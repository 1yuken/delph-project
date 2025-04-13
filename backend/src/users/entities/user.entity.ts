import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: string;

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
}
