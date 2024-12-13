import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './orderItem.entity';

@Crud({
  model: {
    type: OrderItem,
  },
})
@Controller('order-items')
export class OrderItemsController implements CrudController<OrderItem> {
  constructor(public service: OrderItemsService) {}
}
