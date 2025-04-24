import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'ID of the user receiving the review',
    example: 1,
  })
  receiver_id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Review message',
    example: 'Great work! Very professional and delivered on time.',
  })
  msg: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'ID of the job/ad this review is related to',
    example: '123',
  })
  job_id?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Rating given in the review (1-5 stars)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;
}
