import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'User login or email', example: 'username' })
  username: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;
}
