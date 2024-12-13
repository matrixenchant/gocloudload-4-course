import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { CartItem } from './cart-item.entity';
import { CartItemsService } from './cart-items.service';

@Crud({
  model: {
    type: CartItem,
  },
})
@Controller('cart-items')
export class CartItemsController implements CrudController<CartItem> {
  constructor(public service: CartItemsService) {}
}
