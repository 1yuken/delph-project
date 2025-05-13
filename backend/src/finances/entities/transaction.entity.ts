import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  ORDER = 'ORDER',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('transactions')
export class Transaction {
  @ApiProperty({ example: 'uuid-string', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user-id', description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ example: 100.5, description: 'Transaction amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
    description: 'Type of transaction',
  })
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({
    example: 'ORD12345',
    description: 'Reference code for the transaction',
    required: false,
  })
  @Column({ nullable: true })
  referenceCode: string;

  @ApiProperty({
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
    description: 'Current status of the transaction',
  })
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Transaction creation date',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: 'Пополнение баланса',
    description: 'Transaction description',
    required: false,
  })
  @Column({ nullable: true })
  description: string;
}
