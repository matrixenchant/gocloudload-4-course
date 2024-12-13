import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { WishlistItem } from '../wishlist-items/wishlistItem.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => WishlistItem, (item) => item.wishlist)
  items: WishlistItem[];
}
