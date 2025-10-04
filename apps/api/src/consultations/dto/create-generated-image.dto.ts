import { IsInt, IsString, IsObject, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateGeneratedImageDto {
  @IsInt()
  @IsNotEmpty()
  templateId: number;

  @IsString()
  @IsNotEmpty()
  modelKey: string;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;
}
