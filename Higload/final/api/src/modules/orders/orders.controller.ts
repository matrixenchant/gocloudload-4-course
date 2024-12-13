import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@Crud({
  model: {
    type: Order,
  },
})
@Controller('orders')
export class OrdersController implements CrudController<Order> {
  constructor(public service: OrdersService) {}
}
