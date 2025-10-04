import { IsString, IsNotEmpty, IsUrl, IsOptional, IsJSON, IsArray } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  modelKey: string;

  @IsJSON()
  @IsNotEmpty()
  aiParameters: string; // Receive as a JSON string for validation, then parse

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]; // Array of tag names, e.g., ["blonde", "wavy"]
}
