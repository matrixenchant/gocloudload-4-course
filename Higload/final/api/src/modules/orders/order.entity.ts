import { CrudValidationGroups } from '@dataui/crud';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '../order-items/orderItem.entity';
import { Payment } from '../payments/payment.entity';
import { User } from '../users/user.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @IsNotEmpty({ groups: [CREATE] })
  @IsEnum(OrderStatus, { groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 20, nullable: false })
  order_status: OrderStatus;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_amount: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  /**
   * Relations
   */
  @OneToMany(() => OrderItem, (e) => e.order)
  order_items: OrderItem[];

  @OneToMany(() => Payment, (e) => e.order)
  payments: Payment[];
}
