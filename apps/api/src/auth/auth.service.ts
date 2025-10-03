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

    // 1. First, try to find a stylist with the provided email.
    const stylist = await this.prisma.stylist.findUnique({ where: { email } });

    if (stylist) {
      // If a stylist is found, check their password.
      const isPasswordMatching = await bcrypt.compare(password, stylist.passwordHash);
      if (isPasswordMatching) {
        // If password matches, generate a STYLIST token.
        const payload = {
          sub: stylist.id,
          email: stylist.email,
          salonId: stylist.salonId,
          role: 'stylist', // Crucial role identifier
        };
        return { accessToken: this.jwtService.sign(payload) };
      }
    }

    // 2. If no stylist was found OR the password didn't match, try to find a salon.
    // NOTE: For security, we don't tell the user *which* part failed.
    const salon = await this.prisma.salon.findUnique({ where: { email } });

    if (salon) {
      // If a salon is found, check its password. (Assuming Salon model has a passwordHash)
      const isPasswordMatching = await bcrypt.compare(password, salon.passwordHash);
      if (isPasswordMatching) {
        // If password matches, generate a SALON token.
        const payload = {
          sub: salon.id,
          email: salon.email,
          role: 'salon', // Crucial role identifier
        };
        return { accessToken: this.jwtService.sign(payload) };
      }
    }

    // 3. If neither a stylist nor a salon could be authenticated, throw a single generic error.
    throw new UnauthorizedException('Invalid credentials.');
  }
}
