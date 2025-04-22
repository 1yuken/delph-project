import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MessageUploadDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'text',
    description: 'Message text content',
  })
  content?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Message image',
  })
  image: any;

  @ApiProperty({
    type: 'string',
    description: 'Receiver user ID',
  })
  receiverId: string;
}
