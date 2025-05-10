import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email of a user',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Username of a user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'User bio or description',
    example:
      'Experienced frontend developer passionate about creating intuitive interfaces',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'Is user a freelancer',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFreelancer?: boolean;
}
