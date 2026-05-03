import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { ClientsModule } from './clients/clients.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TemplatesModule } from './templates/templates.module';
import { EmailModule } from './email/email.module';
import { AppLogger } from './common/utils/logger';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    AuthModule,
    CloudinaryModule,
    ClientsModule,
    ConsultationsModule,
    TemplatesModule,
    EmailModule,
  ],
  providers: [PrismaService, AppLogger],
})
export class AppModule {}
