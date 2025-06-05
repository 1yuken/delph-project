import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Transaction } from 'src/finances/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Item,
      Order,
      Portfolio,
      Review,
      Message,
      Transaction,
    ]),
  ],
  controllers: [SeedsController],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}
