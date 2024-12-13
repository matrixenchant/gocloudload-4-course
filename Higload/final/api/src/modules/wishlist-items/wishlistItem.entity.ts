import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Wishlist } from '../wishlists/wishlist.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class WishlistItem {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;

  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(() => Product, (product) => product.wishlist_items)
  product: Product;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
