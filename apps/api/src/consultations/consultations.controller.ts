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
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateGeneratedImageDto } from './dto/create-generated-image.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('stylist', 'salon')
export class ConsultationsController {
  constructor(
    private readonly consultationsService: ConsultationsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('quick')
  createQuickConsult(@CurrentUser() user: AuthenticatedUser) {
    return this.consultationsService.createQuickConsult(user.id, user.salonId);
  }

  @Post()
  createForClient(@Body() createConsultationDto: CreateConsultationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.consultationsService.createForClient(createConsultationDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.consultationsService.findOne(id, user.salonId);
  }

  // This is the main AI generation endpoint
  @Post(':id/generated-images')
  @UseInterceptors(FileInterceptor('image')) // Expect a file field named 'image'
  async createGeneratedImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() createGeneratedImageDto: CreateGeneratedImageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required.');
    }

    // Call the service with the image file (the service will handle upload)
    return this.consultationsService.createGeneratedImage(id, image, createGeneratedImageDto, user);
  }
}
