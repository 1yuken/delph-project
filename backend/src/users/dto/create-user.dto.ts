import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'Email of a user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({ description: 'Username of a user', example: 'John Doe' })
  username: string;

  @ApiProperty({ description: 'Password of a user', example: 'password123' })
  password: string;

  @ApiPropertyOptional({
    description: 'User bio or description',
    example:
      'Experienced frontend developer passionate about creating intuitive interfaces',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;
}
