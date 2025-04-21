import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user1Id' })
  @ApiProperty({ description: 'First user in chat' })
  user1: User;

  @Column()
  @ApiProperty({ description: 'First user ID' })
  user1Id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user2Id' })
  @ApiProperty({ description: 'Second user in chat' })
  user2: User;

  @Column()
  @ApiProperty({ description: 'Second user ID' })
  user2Id: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Last message content',
    example: 'See you tomorrow!',
  })
  lastMessageContent: string;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Unread messages count', example: 3 })
  unreadCount: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Chat creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last message date' })
  updatedAt: Date;
}
