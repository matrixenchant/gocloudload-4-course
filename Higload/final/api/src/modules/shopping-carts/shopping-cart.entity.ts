import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from '../cart-items/cart-item.entity';
import { User } from '../users/user.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class ShoppingCart {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @ManyToOne(() => User, (user) => user.shopping_carts)
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
