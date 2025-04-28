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
export class Review {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the review' })
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sender_id' })
  @ApiProperty({ description: 'User who sent the review' })
  sender: User;

  @Column()
  @ApiProperty({ description: 'ID of the sender' })
  sender_id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'receiver_id' })
  @ApiProperty({ description: 'User who received the review' })
  receiver: User;

  @Column()
  @ApiProperty({ description: 'ID of the receiver' })
  receiver_id: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Review message',
    example: 'Great work! Very professional and delivered on time.',
  })
  msg: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description:
      'ID of the job/ad this review is related to (placeholder for now)',
    example: '123',
  })
  job_id: string;

  @Column({ type: 'int' })
  @ApiProperty({
    description: 'Rating given in the review',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    description: 'Response from the receiver to this review',
    example: 'Thank you for your feedback! It was a pleasure working with you.',
  })
  response: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({ description: 'Date when the response was added' })
  responseDate: Date;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date when the review was created' })
  createdAt: Date;
}
