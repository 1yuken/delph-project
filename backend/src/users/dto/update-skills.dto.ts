import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateSkillsDto {
  @ApiProperty({
    description: 'Comma-separated list of skills',
    example: 'Vue,React,Angular,TypeScript',
  })
  @IsString()
  skillsString: string;
}
