import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './orderItem.entity';

@Injectable()
export class OrderItemsService extends TypeOrmCrudService<OrderItem> {
  constructor(@InjectRepository(OrderItem) repo) {
    super(repo);
  }
}
