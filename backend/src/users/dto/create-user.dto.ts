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
}
