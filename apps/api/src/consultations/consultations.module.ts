import { Module } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { PrismaService } from 'src/prisma.service';
import { ReplicateProvider } from 'src/common/replicate/providers/replicate.provider';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, CloudinaryService, PrismaService, ReplicateProvider],
})
export class ConsultationsModule {}
