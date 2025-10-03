import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  // Note: For a real signup, you'd handle salon creation/association differently.
  // For now, we assume a salonId is provided.
  @IsNumber()
  salonId: number;
}
