import { CrudValidationGroups } from '@dataui/crud';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;

  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ type: 'varchar', length: 50, nullable: false })
  payment_method: string;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @IsPositive({ always: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @IsNotEmpty({ groups: [UPDATE] })
  @IsEnum(PaymentStatus, { always: true })
  @Column({ type: 'varchar', length: 20, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
