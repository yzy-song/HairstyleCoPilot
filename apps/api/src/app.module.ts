import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { ClientsModule } from './clients/clients.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { ReplicateModule } from './common/replicate/replicate.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TemplatesModule } from './templates/templates.module';
import { AppLogger } from './common/utils/logger';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 窗口时间，单位：毫秒 (这里是 60 秒)
        limit: 20, // 在一个窗口时间内，同一个 IP 最多允许 20 次请求
      },
    ]),
    AuthModule,
    CloudinaryModule,
    ClientsModule,
    ConsultationsModule,
    ReplicateModule,
    TemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppLogger],
})
export class AppModule {}
