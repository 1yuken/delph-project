import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'Email of a user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username of a user', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password of a user', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  avatarUrl?: string;
}
