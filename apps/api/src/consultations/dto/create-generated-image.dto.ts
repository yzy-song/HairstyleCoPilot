import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGeneratedImageDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  templateId: number;

  @IsString()
  @IsNotEmpty()
  modelKey: string;

  @Transform(({ value }) => {
    if (!value || value === '') return undefined;
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return {};
    }
  })
  @IsOptional()
  options?: Record<string, any>;
}
