import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how are you?',
  })
  content: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: 'Message attachment',
    example: 'http://localhost:3000/uploads/message-image-123.jpg',
  })
  imageUrl: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderId' })
  @ApiProperty({ description: 'Message sender' })
  sender: User;

  @Column()
  @ApiProperty({ description: 'Sender ID' })
  senderId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'receiverId' })
  @ApiProperty({ description: 'Message receiver' })
  receiver: User;

  @Column()
  @ApiProperty({ description: 'Receiver ID' })
  receiverId: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Is message read', example: false })
  isRead: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Message creation date' })
  createdAt: Date;
}
