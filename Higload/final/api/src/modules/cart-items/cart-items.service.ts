import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartItemsService extends TypeOrmCrudService<CartItem> {
  constructor(@InjectRepository(CartItem) repo) {
    super(repo);
  }
}
