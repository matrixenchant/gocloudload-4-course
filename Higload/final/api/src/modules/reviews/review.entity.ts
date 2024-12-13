import { CrudValidationGroups } from '@dataui/crud';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Review {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  @Min(1, { always: true })
  @Max(5, { always: true })
  @Column({ type: 'int', nullable: false })
  rating: number;

  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString({ always: true })
  @MaxLength(500, { always: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
