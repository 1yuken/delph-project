import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiPropertyOptional({
    description: 'Message content',
    example: 'Hello, how are you?',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Receiver user ID',
    example: 1,
  })
  @IsString()
  @IsNotEmpty()
  receiverId: string;
}
