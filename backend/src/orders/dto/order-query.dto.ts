import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';
import { PaginationQueryDto } from '../../items/dto/pagination-query.dto';

export class OrderQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Статус заказа',
    enum: OrderStatus,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'ID клиента',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({
    description: 'ID исполнителя',
    example: 1,
  })
  @IsOptional()
  @IsString()
  performerId?: string;

  @ApiPropertyOptional({
    description: 'ID навыка',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  itemId?: number;

  @ApiPropertyOptional({
    description: 'Категория для поиска',
    example: 'Web Service Development',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Поисковый запрос (ищет в названии и описании)',
    example: 'Django',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
