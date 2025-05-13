import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Название заказа',
    example: 'Разработка веб-сервиса на Django',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Описание заказа',
    example: 'Требуется разработать REST API для мобильного приложения',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Категории заказа через запятую',
    example: 'Web Service Development, Code Optimization',
  })
  @IsOptional()
  @IsString()
  categories?: string;

  @ApiProperty({
    description: 'ID связанного навыка',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiPropertyOptional({
    description: 'ID исполнителя',
    example: 1,
  })
  @IsOptional()
  @IsString()
  performerId?: string;

  @ApiPropertyOptional({
    description: 'Статус заказа',
    enum: OrderStatus,
    default: OrderStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Бюджет заказа',
    example: 1000.0,
  })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiPropertyOptional({
    description: 'Дата завершения заказа',
    example: '2024-06-30T23:59:59.000Z',
  })
  @IsOptional()
  completionDate?: Date;
}
