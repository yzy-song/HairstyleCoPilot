import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Stylist as StylistModel } from '@repo/db';

export const Stylist = createParamDecorator((data: keyof StylistModel, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});
