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
    let user: any;

    if (payload.role === 'stylist') {
      user = await this.prisma.stylist.findUnique({
        where: { id: payload.sub },
        include: { salon: true },
      });
    } else if (payload.role === 'salon') {
      user = await this.prisma.salon.findUnique({
        where: { id: payload.sub },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // 从返回的用户信息中删除敏感信息，并附加上角色
    if (payload.role === 'stylist') {
      const { passwordHash, ...stylistWithoutPassword } = user;
      return { ...stylistWithoutPassword, role: 'stylist' }; // <-- 将角色附加回去
    }

    // 假设 salon 也有 passwordHash
    const { passwordHash, ...salonWithoutPassword } = user;
    return { ...salonWithoutPassword, role: 'salon' }; // <-- 将角色附加回去
  }
}
