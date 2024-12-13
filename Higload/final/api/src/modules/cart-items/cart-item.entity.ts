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
import { Product } from '../products/product.entity';
import { ShoppingCart } from '../shopping-carts/shopping-cart.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @ManyToOne(() => ShoppingCart, (cart) => cart.items)
  cart: ShoppingCart;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @ManyToOne(() => Product, (product) => product.cart_items)
  product: Product;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @IsPositive({ always: true })
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
