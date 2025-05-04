import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  categories: string;

  //   @ManyToOne(() => Order, { nullable: true })
  //   @JoinColumn({ name: 'orderId' })
  //   order: Order;

  @Column({ nullable: true })
  orderId: number;
}
