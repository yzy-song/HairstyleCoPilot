import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { paginate, PaginatedResult } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from '@repo/db';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createClientDto: CreateClientDto, salonId: number): Promise<Client> {
    return this.prisma.client.create({
      data: {
        ...createClientDto,
        salonId,
      },
    });
  }

  async findAll(paginationDto: PaginationDto, salonId: number): Promise<PaginatedResult<Client>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [clients, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where: { salonId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where: { salonId, deletedAt: null } }),
    ]);

    return paginate(clients, total, page, limit);
  }

  async findOne(id: number, salonId: number): Promise<Client> {
    const client = await this.prisma.client.findFirst({
      where: { id, salonId, deletedAt: null },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found.`);
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto, salonId: number): Promise<Client> {
    // First, verify the client exists and belongs to the salon
    await this.findOne(id, salonId);

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: number, salonId: number): Promise<void> {
    await this.findOne(id, salonId);

    await this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async uploadPhoto(id: number, file: Express.Multer.File, salonId: number): Promise<Client> {
    await this.findOne(id, salonId);

    const upload = await this.cloudinaryService.uploadImageFromBuffer(file.buffer, 'hairstylecopilot/client_photos');
    const photoUrl = this.cloudinaryService.optimizeCloudinaryUrl(upload.secure_url);

    return this.prisma.client.update({
      where: { id },
      data: { clientPhotoUrl: photoUrl },
    });
  }
}
