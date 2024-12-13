import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) repo) {
    super(repo);
  }
}
