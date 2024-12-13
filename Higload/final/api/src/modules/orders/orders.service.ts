import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService extends TypeOrmCrudService<Order> {
  constructor(@InjectRepository(Order) repo) {
    super(repo);
  }
}
