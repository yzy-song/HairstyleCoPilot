import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateGeneratedImageDto } from './dto/create-generated-image.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@ApiTags('Consultations')
@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('stylist', 'salon')
export class ConsultationsController {
  constructor(
    private readonly consultationsService: ConsultationsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('quick')
  @ApiOperation({ summary: 'Create a quick walk-in consultation' })
  @ApiCommonResponses()
  createQuickConsult(@CurrentUser() user: AuthenticatedUser) {
    return this.consultationsService.createQuickConsult(user.id, user.salonId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a consultation for an existing client' })
  @ApiCommonResponses()
  createForClient(@Body() createConsultationDto: CreateConsultationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.consultationsService.createForClient(createConsultationDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a consultation by ID' })
  @ApiCommonResponses()
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.consultationsService.findOne(id, user.salonId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a consultation' })
  @ApiCommonResponses()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConsultationDto: UpdateConsultationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.consultationsService.update(id, updateConsultationDto, user.salonId);
  }

  @Get(':id/generated-images')
  @ApiOperation({ summary: 'List all generated images for a consultation' })
  @ApiCommonResponses()
  findGeneratedImages(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.consultationsService.findGeneratedImages(id, user.salonId);
  }

  @Post(':id/generated-images')
  @ApiOperation({ summary: 'Generate an AI hairstyle preview image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary', description: 'Client photo' },
        templateId: { type: 'string', description: 'Hairstyle template ID' },
        modelKey: { type: 'string', description: 'AI model key' },
        options: { type: 'string', description: 'JSON string of generation options' },
      },
    },
  })
  @ApiCommonResponses()
  @UseInterceptors(FileInterceptor('image'))
  async createGeneratedImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() createGeneratedImageDto: CreateGeneratedImageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required.');
    }

    return this.consultationsService.createGeneratedImage(id, image, createGeneratedImageDto, user);
  }
}
