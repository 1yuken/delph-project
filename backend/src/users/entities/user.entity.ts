import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiPropertyOptional({
    description: 'Email of a user',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Username of a user', example: 'John Doe' })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false, // Важно! Чтобы пароль не возвращался в ответе
  })
  @ApiProperty({ description: 'Password of a user', example: 'password123' })
  password: string;

  @Column({ default: true })
  @ApiProperty({ description: 'Is a user a freelancer', example: true })
  isFreelancer: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    description: 'User bio or description',
    example:
      'Experienced frontend developer passionate about creating intuitive interfaces',
  })
  bio: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl: string;

  // @Column({ type: 'simple-array', nullable: true })
  // @ApiPropertyOptional({
  //   description: 'User skills',
  //   example: ['Vue', 'JavaScript', 'TypeScript', 'SCSS'],
  // })
  // skills: string[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Registration date' })
  registrationDate: Date;
}
