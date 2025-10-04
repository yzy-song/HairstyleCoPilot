import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateConsultationDto {
  @IsInt()
  @IsOptional()
  clientId?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  status?: 'SAVED' | 'TEMPORARY';
}
