import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // 1. 先从 ConfigService 获取密钥
    const secret = configService.get<string>('JWT_SECRET');

    // 2. 检查密钥是否存在，如果不存在则抛出错误，使应用启动失败
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // 3. 确认密钥存在后，再将其传入 super()
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // <-- 此处 secret 的类型被 TypeScript 推断为明确的 string
    });
  }

  // 4. Passport 在验证 Token 签名有效后，会调用这个方法
  //    payload 是 Token 解码后的 JSON 对象
  async validate(payload: { sub: number; email: string; role: 'stylist' | 'salon' }) {
    if (payload.role === 'stylist') {
      const stylist = await this.prisma.stylist.findUnique({
        where: { id: payload.sub },
      });
      if (!stylist) {
        throw new UnauthorizedException('Invalid token');
      }
      const { passwordHash, ...result } = stylist;
      // The stylist object already has salonId, so we just add the role
      return { ...result, role: 'stylist' };
    }

    if (payload.role === 'salon') {
      const salon = await this.prisma.salon.findUnique({
        where: { id: payload.sub },
      });
      if (!salon) {
        throw new UnauthorizedException('Invalid token');
      }
      const { passwordHash, ...result } = salon; // Assuming salon might have a passwordHash
      // **THE KEY CHANGE IS HERE:**
      // We add a `salonId` property to the salon user object, which is its own ID.
      return { ...result, role: 'salon', salonId: salon.id };
    }

    throw new UnauthorizedException('Invalid token role');
  }
}
