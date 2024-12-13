import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @ManyToOne(() => Order, (order) => order.order_items)
  order: Order;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @ManyToOne(() => Product, (product) => product.order_items)
  product: Product;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @IsPositive({ always: true })
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @IsPositive({ always: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
