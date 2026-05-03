import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SignUpDto } from './dto/signup.dto';
import { SignUpSalonDto } from './dto/signup-salon.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name, salonId } = signUpDto;

    const existingStylist = await this.prisma.stylist.findUnique({
      where: { email },
    });

    if (existingStylist) {
      throw new ConflictException('Email already in use.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const stylist = await this.prisma.stylist.create({
      data: {
        email,
        passwordHash,
        name,
        salonId,
      },
    });

    const { passwordHash: _, ...result } = stylist;
    return result;
  }

  async signUpSalon(signUpSalonDto: SignUpSalonDto) {
    const { email, password, salonName } = signUpSalonDto;

    const existingSalon = await this.prisma.salon.findUnique({
      where: { email },
    });

    if (existingSalon) {
      throw new ConflictException('A salon with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const salon = await this.prisma.salon.create({
      data: {
        email,
        passwordHash,
        salonName,
      },
    });

    const payload = {
      sub: salon.id,
      email: salon.email,
      role: 'salon' as const,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      salon: {
        id: salon.id,
        email: salon.email,
        salonName: salon.salonName,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const stylist = await this.prisma.stylist.findUnique({ where: { email } });

    if (stylist) {
      const isPasswordMatching = await bcrypt.compare(password, stylist.passwordHash);
      if (isPasswordMatching) {
        const payload = {
          sub: stylist.id,
          email: stylist.email,
          salonId: stylist.salonId,
          role: 'stylist',
        };
        return { accessToken: this.jwtService.sign(payload) };
      }
    }

    const salon = await this.prisma.salon.findUnique({ where: { email } });

    if (salon) {
      const isPasswordMatching = await bcrypt.compare(password, salon.passwordHash);
      if (isPasswordMatching) {
        const payload = {
          sub: salon.id,
          email: salon.email,
          role: 'salon',
        };
        return { accessToken: this.jwtService.sign(payload) };
      }
    }

    throw new UnauthorizedException('Invalid credentials.');
  }

  async requestPasswordReset(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const salon = await this.prisma.salon.findUnique({ where: { email } });
    if (salon) {
      await this.prisma.salon.update({
        where: { id: salon.id },
        data: { passwordResetToken: token, passwordResetExpires: expires },
      });
      await this.emailService.sendPasswordResetEmail(email, token);
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    const stylist = await this.prisma.stylist.findUnique({ where: { email } });
    if (stylist) {
      await this.prisma.stylist.update({
        where: { id: stylist.id },
        data: { passwordResetToken: token, passwordResetExpires: expires },
      });
      await this.emailService.sendPasswordResetEmail(email, token);
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    // Return same message even if email not found (security best practice)
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Check Salon first
    const salon = await this.prisma.salon.findFirst({
      where: { passwordResetToken: token },
    });

    if (salon) {
      if (!salon.passwordResetExpires || salon.passwordResetExpires < new Date()) {
        throw new BadRequestException('Password reset token has expired.');
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.prisma.salon.update({
        where: { id: salon.id },
        data: {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });
      return { message: 'Password has been reset successfully.' };
    }

    // Check Stylist
    const stylist = await this.prisma.stylist.findFirst({
      where: { passwordResetToken: token },
    });

    if (stylist) {
      if (!stylist.passwordResetExpires || stylist.passwordResetExpires < new Date()) {
        throw new BadRequestException('Password reset token has expired.');
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.prisma.stylist.update({
        where: { id: stylist.id },
        data: {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });
      return { message: 'Password has been reset successfully.' };
    }

    throw new BadRequestException('Invalid password reset token.');
  }
}
