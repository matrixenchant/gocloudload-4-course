import { CrudValidationGroups } from '@dataui/crud';
import {
  IsNotEmpty,
  IsNumber,
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
import { Product } from '../products/product.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Category {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsNumber({}, { always: true })
  @Column({ type: 'int', nullable: true })
  parent_id: number;

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
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
