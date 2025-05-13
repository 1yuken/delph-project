import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description:
      'Transaction amount (positive for income, negative for expense)',
    example: 100.5,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Reference code for the transaction',
    example: 'ORD12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  referenceCode?: string;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Пополнение баланса',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTransactionStatusDto {
  @ApiProperty({
    description: 'New status for the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}

export class WithdrawFundsDto {
  @ApiProperty({
    description: 'Amount to withdraw',
    example: 50.0,
    minimum: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
