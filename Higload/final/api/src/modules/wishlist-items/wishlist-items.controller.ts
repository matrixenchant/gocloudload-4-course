import { Crud, CrudController } from '@dataui/crud';
import { Controller, Get } from '@nestjs/common';
import { WishlistItemsService } from './wishlist-items.service';
import { WishlistItem } from './wishlistItem.entity';

@Crud({
  model: {
    type: WishlistItem,
  },
})
@Controller('wishlist-items')
export class WishlistItemsController implements CrudController<WishlistItem> {
  constructor(public service: WishlistItemsService) {}

  @Get(':id/products')
  getWishlistWithProducts() {
    return this.service.getWishlistWithProducts();
  }
}
