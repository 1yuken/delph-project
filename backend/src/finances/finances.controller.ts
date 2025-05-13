import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { FinancesService } from './finances.service';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
  WithdrawFundsDto,
} from './dto/transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Transaction } from './entities/transaction.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Finances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all transactions',
    type: [Transaction],
  })
  async findAll(@Req() req, @Query('search') search?: string) {
    return this.financesService.findAll(req.user.userId, search);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary' })
  @ApiResponse({
    status: 200,
    description: 'Returns financial summary',
    schema: {
      type: 'object',
      properties: {
        totalReceived: { type: 'number' },
        totalSpent: { type: 'number' },
        monthlyIncome: { type: 'number' },
      },
    },
  })
  async getFinancialSummary(@Req() req) {
    return this.financesService.getFinancialSummary(req.user.userId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get current balance' })
  @ApiResponse({
    status: 200,
    description: 'Returns current balance',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number' },
      },
    },
  })
  async getBalance(@Req() req) {
    const balance = await this.financesService.calculateBalance(
      req.user.userId,
    );
    return { balance };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the transaction',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.financesService.findOne(id, req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: Transaction,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async create(@Req() req, @Body() createTransactionDto: CreateTransactionDto) {
    try {
      return await this.financesService.create(
        req.user.userId,
        createTransactionDto,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message ||
          'Failed to create transaction. Please check your input data.',
      );
    }
  }

  @Post(':id/status')
  @ApiOperation({ summary: 'Update transaction status' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiBody({ type: UpdateTransactionStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async updateStatus(
    @Param('id') id: string,
    @Req() req,
    @Body() updateStatusDto: UpdateTransactionStatusDto,
  ) {
    return this.financesService.updateStatus(
      id,
      req.user.userId,
      updateStatusDto,
    );
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw funds' })
  @ApiBody({ type: WithdrawFundsDto })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal successful',
    type: Transaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient funds or invalid amount',
  })
  async withdraw(@Req() req, @Body() withdrawDto: WithdrawFundsDto) {
    return this.financesService.withdraw(req.user.userId, withdrawDto);
  }
}
