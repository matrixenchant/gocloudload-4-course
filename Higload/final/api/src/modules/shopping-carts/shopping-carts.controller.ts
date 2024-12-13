import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { ShoppingCart } from './shopping-cart.entity';
import { ShoppingCartsService } from './shopping-carts.service';

@Crud({
  model: {
    type: ShoppingCart,
  },
})
@Controller('shopping-carts')
export class ShoppingCartsController implements CrudController<ShoppingCart> {
  constructor(public service: ShoppingCartsService) {}
}
