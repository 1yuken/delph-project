import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './entities/transaction.entity';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
  WithdrawFundsDto,
} from './dto/transaction.dto';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async findAll(userId: string, search?: string) {
    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });

    if (search) {
      query.andWhere(
        'transaction.referenceCode LIKE :search OR transaction.description LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    return query.orderBy('transaction.createdAt', 'DESC').getMany();
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionsRepository.create({
      userId,
      ...createTransactionDto,
    });

    return this.transactionsRepository.save(transaction);
  }

  async updateStatus(
    id: string,
    userId: string,
    updateStatusDto: UpdateTransactionStatusDto,
  ) {
    const transaction = await this.findOne(id, userId);

    transaction.status = updateStatusDto.status;

    return this.transactionsRepository.save(transaction);
  }

  async withdraw(userId: string, withdrawDto: WithdrawFundsDto) {
    const balance = await this.calculateBalance(userId);

    if (balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const withdrawalCode = `WD${Math.floor(Math.random() * 100000)}`;

    return this.create(userId, {
      amount: -withdrawDto.amount,
      type: TransactionType.WITHDRAWAL,
      referenceCode: withdrawalCode,
      description: `Вывод средств #${withdrawalCode}`,
    });
  }

  async calculateBalance(userId: string) {
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.COMPLETED,
      })
      .getRawOne();

    return result.total || 0;
  }

  async getFinancialSummary(userId: string) {
    // Calculate total received
    const receivedResult = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.amount > 0')
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.COMPLETED,
      })
      .getRawOne();

    // Calculate total spent
    const spentResult = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(ABS(transaction.amount))', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.amount < 0')
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.COMPLETED,
      })
      .getRawOne();

    // Calculate monthly income (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyResult = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.amount > 0')
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.COMPLETED,
      })
      .andWhere('transaction.createdAt >= :date', { date: thirtyDaysAgo })
      .getRawOne();

    return {
      totalReceived: receivedResult.total || 0,
      totalSpent: spentResult.total || 0,
      monthlyIncome: monthlyResult.total || 0,
    };
  }
}
