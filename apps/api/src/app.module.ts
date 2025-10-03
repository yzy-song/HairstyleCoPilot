import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
