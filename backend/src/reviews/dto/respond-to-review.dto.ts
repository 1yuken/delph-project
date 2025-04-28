import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RespondToReviewDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Response to the review',
    example: 'Thank you for your feedback! It was a pleasure working with you.',
  })
  response: string;
}
