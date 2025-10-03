import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
        salonId, // For MVP, you may need to create Salon first or pass a valid ID
      },
    });

    // Don't return the password hash
    const { passwordHash: _, ...result } = stylist;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const stylist = await this.prisma.stylist.findUnique({
      where: { email },
    });

    if (!stylist) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(password, stylist.passwordHash);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = {
      email: stylist.email,
      sub: stylist.id,
      salonId: stylist.salonId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // 登录理发师
  async loginStylist(loginDto: LoginDto) {
    const stylist = await this.prisma.stylist.findUnique({ where: { email: loginDto.email } });
    if (!stylist || !(await bcrypt.compare(loginDto.password, stylist.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const payload = {
      sub: stylist.id,
      email: stylist.email,
      salonId: stylist.salonId,
      role: 'stylist', // <-- 添加角色
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  // 登录沙龙 (假设 Salon 模型也有 email 和 passwordHash)
  async loginSalon(loginDto: LoginDto) {
    const salon = await this.prisma.salon.findUnique({ where: { email: loginDto.email } });
    if (!salon || !(await bcrypt.compare(loginDto.password, salon.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const payload = {
      sub: salon.id,
      email: salon.email,
      role: 'salon', // <-- 添加角色
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
