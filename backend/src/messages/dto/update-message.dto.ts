import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({
    description: 'Updated message content',
    example: 'Updated message text',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
