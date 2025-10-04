import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateGeneratedImageDto } from './dto/create-generated-image.dto';
import { AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';
import { MODELS } from 'src/common/replicate/models.config';
import { ReplicateProvider } from 'src/common/replicate/providers/replicate.provider';

@Injectable()
export class ConsultationsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private readonly replicateProvider: ReplicateProvider,
  ) {}

  // For the "Quick Consult" workflow
  async createQuickConsult(stylistId: number, salonId: number) {
    // Creates a temporary "Walk-in" client and a consultation linked to it.
    const newClient = await this.prisma.client.create({
      data: {
        name: `Walk-in Client - ${new Date().toLocaleTimeString()}`,
        salonId: salonId,
      },
    });

    return this.prisma.consultation.create({
      data: {
        stylistId,
        clientId: newClient.id,
        status: 'TEMPORARY',
      },
    });
  }

  // For creating a consultation with a known client
  async createForClient(dto: CreateConsultationDto, stylistId: number) {
    return this.prisma.consultation.create({
      data: {
        clientId: dto.clientId,
        stylistId,
      },
    });
  }

  async findOne(id: number, salonId: number) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id, client: { salonId }, deletedAt: null },
      include: { generatedImages: true, tags: true },
    });
    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found.`);
    }
    return consultation;
  }

  async createGeneratedImage(
    consultationId: number,
    sourceImage: Express.Multer.File,
    dto: CreateGeneratedImageDto,
    user: AuthenticatedUser,
  ) {
    // 1. 验证咨询是否存在且属于该用户/沙龙 (你的原有逻辑)
    await this.findOne(consultationId, user.salonId);

    // 2. 从数据库查找发型模板
    const template = await this.prisma.hairstyleTemplate.findUnique({
      where: { id: dto.templateId },
    });
    if (!template) {
      throw new NotFoundException(`Template with ID ${dto.templateId} not found.`);
    }

    // 3. 从 models.config.ts 中获取模型的静态配置（如 Replicate ID）
    const modelConfig = MODELS[template.modelKey];
    if (!modelConfig) {
      throw new NotFoundException(`Model configuration for key '${template.modelKey}' not found.`);
    }

    // 4. 将用户上传的图片 buffer 上传到 Cloudinary，获取可访问的 URL,replicate api的调用需要一个可访问的源图URL
    const sourceImageUpload = await this.cloudinaryService.uploadImageFromBuffer(sourceImage.buffer);
    const sourceImageUrl = this.cloudinaryService.optimizeCloudinaryUrl(sourceImageUpload.secure_url);

    // 5. 准备调用 AI 模型所需的参数
    // 合并来自数据库模板的 aiParameters 和来自前端请求的动态 options
    const finalOptions = {
      ...(template.aiParameters as Record<string, any>), // 模板预设参数
      ...(dto.options || {}), // 前端实时传入的参数（可覆盖模板参数）
    };

    // 使用 modelConfig 中的 formatInput 函数来构建最终的输入
    const modelInput = modelConfig.formatInput(
      {
        sourceImageUrl: sourceImageUrl, // 刚刚上传的用户图片 URL
        template: template, // 模板
      },
      finalOptions,
    );

    console.log('=========');
    console.log(modelInput);
    console.log('=========');
    // 6. 调用 Replicate API
    let replicateOutput;
    try {
      replicateOutput = await this.replicateProvider.run({ model: modelConfig.id, input: modelInput });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('nsfw')) {
        throw new BadRequestException('Generation failed: The source image was flagged as inappropriate.');
      }
      throw new BadRequestException(
        `AI generation failed. Please try again or contact support. Error: ${errorMessage}`,
      );
    }

    const resultImageUrl = Array.isArray(replicateOutput) ? replicateOutput[0] : replicateOutput;
    if (!resultImageUrl || typeof resultImageUrl !== 'string') {
      throw new BadRequestException('AI model did not return a valid image URL.');
    }

    // 7. 将生成的结果图也上传到 Cloudinary 以便永久保存
    const cloudinaryUpload = await this.cloudinaryService.uploadImageFromUrl(
      resultImageUrl,
      'chimeralens/consultation_results',
    );
    const finalImageUrl = this.cloudinaryService.optimizeCloudinaryUrl(cloudinaryUpload.secure_url);

    // 8. 在数据库中创建生成图片的记录
    return this.prisma.generatedImage.create({
      data: {
        consultationId: consultationId,
        imageUrl: finalImageUrl,
        // 建议：同时保存源图和模板信息，便于追溯
        // sourceImageUrl: sourceImageUrl,
        // hairstyleTemplateId: template.id,
      },
    });
  }
}
