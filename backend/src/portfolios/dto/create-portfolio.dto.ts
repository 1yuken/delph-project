import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({ description: 'Описание работы в портфолио' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
