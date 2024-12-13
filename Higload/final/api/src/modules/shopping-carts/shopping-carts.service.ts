import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCart } from './shopping-cart.entity';

@Injectable()
export class ShoppingCartsService extends TypeOrmCrudService<ShoppingCart> {
  constructor(@InjectRepository(ShoppingCart) repo) {
    super(repo);
  }
}
