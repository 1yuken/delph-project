import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Item } from '../../items/entities/item.entity';

export enum OrderStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID заказа' })
  id: number;

  @Column()
  @ApiProperty({
    description: 'Название заказа',
    example: 'Разработка веб-сервиса на Django',
  })
  title: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    description: 'Описание заказа',
    example: 'Требуется разработать REST API для мобильного приложения',
  })
  description: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: 'Категории заказа через запятую',
    example: 'Web Service Development, Code Optimization',
  })
  categories: string;

  @Column()
  @ApiProperty({ description: 'ID связанного навыка' })
  itemId: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'itemId' })
  @ApiProperty({ description: 'Связанный навык' })
  item: Item;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  @ApiProperty({ description: 'Клиент, создавший заказ' })
  client: User;

  @Column()
  @ApiProperty({ description: 'ID клиента' })
  clientId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'performerId' })
  @ApiPropertyOptional({ description: 'Исполнитель заказа' })
  performer: User;

  @Column({ nullable: true })
  @ApiPropertyOptional({ description: 'ID исполнителя' })
  performerId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.OPEN,
  })
  @ApiProperty({
    description: 'Статус заказа',
    enum: OrderStatus,
    default: OrderStatus.OPEN,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiPropertyOptional({
    description: 'Бюджет заказа',
    example: 1000.0,
  })
  budget: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Дата создания заказа' })
  creationDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiPropertyOptional({ description: 'Дата завершения заказа' })
  completionDate: Date;
}
