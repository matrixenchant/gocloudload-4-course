import { CrudValidationGroups } from '@dataui/crud';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { ShoppingCart } from '../shopping-carts/shopping-cart.entity';
import { Wishlist } from '../wishlists/wishlist.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  username: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsEmail({}, { groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

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
  @OneToMany(() => Order, (e) => e.user, {
    cascade: true,
    eager: true,
  })
  orders: Order[];

  @OneToMany(() => ShoppingCart, (e) => e.user, {
    cascade: true,
    eager: true,
  })
  shopping_carts: ShoppingCart[];

  @OneToMany(() => Review, (e) => e.user, {
    cascade: true,
    eager: true,
  })
  reviews: Review[];

  @OneToMany(() => Wishlist, (e) => e.user, {
    cascade: true,
    eager: true,
  })
  wishlists: Wishlist[];
}
