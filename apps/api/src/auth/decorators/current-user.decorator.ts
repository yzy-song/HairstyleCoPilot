import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Define a type for our user payload for better type safety
export type AuthenticatedUser = {
  id: number;
  email: string;
  role: 'stylist' | 'salon';
  salonId: number; // The crucial, consistent property!
};

export const CurrentUser = createParamDecorator((data: keyof AuthenticatedUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});
