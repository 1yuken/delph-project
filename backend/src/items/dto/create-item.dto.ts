import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import type { Express } from 'express';

export class CreateItemDto {
  @ApiProperty({ description: 'Название навыка', example: 'Django' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Изображение навыка',
    required: false,
    format: 'binary',
    type: 'string',
  })
  @IsOptional()
  image?: any;

  @ApiProperty({
    description: 'URL изображения навыка',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Категории навыка через запятую',
    example: 'Web Service Development, Code Optimization',
    required: false,
  })
  @IsOptional()
  @IsString()
  categories?: string;
}
