import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of a user', example: 'John Doe' })
  username: string;

  @ApiProperty({ description: 'Password of a user', example: 'password123' })
  password: string;
}
