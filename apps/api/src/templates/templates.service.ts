import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/utils/pagination.util';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(createTemplateDto: CreateTemplateDto) {
    const { tags, aiParameters, ...rest } = createTemplateDto;

    // Handle the many-to-many relationship for tags
    const tagConnectOrCreate = tags
      ? tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        }))
      : [];

    return this.prisma.hairstyleTemplate.create({
      data: {
        ...rest,
        aiParameters: JSON.parse(aiParameters), // Parse the JSON string into an object
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto, tags?: string[]) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (tags && tags.length > 0) {
      whereClause.tags = {
        some: {
          name: {
            in: tags,
          },
        },
      };
    }

    const [templates, total] = await this.prisma.$transaction([
      this.prisma.hairstyleTemplate.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { tags: true },
      }),
      this.prisma.hairstyleTemplate.count({ where: whereClause }),
    ]);

    return paginate(templates, total, page, limit);
  }

  async findOne(id: number) {
    const template = await this.prisma.hairstyleTemplate.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found.`);
    }
    return template;
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    const { tags, aiParameters, ...rest } = updateTemplateDto;

    // Prisma doesn't have a simple way to sync relations, so we handle it manually if tags are provided.
    const tagOperations = tags
      ? {
          set: tags.map((tagName) => ({ name: tagName })), // Disconnects old, connects new
        }
      : undefined;

    return this.prisma.hairstyleTemplate.update({
      where: { id },
      data: {
        ...rest,
        aiParameters: aiParameters ? JSON.parse(aiParameters) : undefined,
        tags: tagOperations,
      },
    });
  }

  async remove(id: number) {
    // The relation to tags is automatically handled by Prisma
    await this.findOne(id); // Verify it exists first
    return this.prisma.hairstyleTemplate.delete({
      where: { id },
    });
  }
}
