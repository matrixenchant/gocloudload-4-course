import { CrudValidationGroups } from '@dataui/crud';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from '../cart-items/cart-item.entity';
import { Category } from '../categories/category.entity';
import { OrderItem } from '../order-items/orderItem.entity';
import { Review } from '../reviews/review.entity';
import { WishlistItem } from '../wishlist-items/wishlistItem.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Product {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @IsPositive({ always: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @IsPositive({ always: true })
  @Column({ type: 'int', nullable: false })
  stock_quantity: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { always: true })
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

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
  @OneToMany(() => OrderItem, (e) => e.product)
  order_items: OrderItem[];

  @OneToMany(() => CartItem, (e) => e.product)
  cart_items: CartItem[];

  @OneToMany(() => Review, (e) => e.product)
  reviews: Review[];

  @OneToMany(() => WishlistItem, (e) => e.product)
  wishlist_items: WishlistItem[];
}
