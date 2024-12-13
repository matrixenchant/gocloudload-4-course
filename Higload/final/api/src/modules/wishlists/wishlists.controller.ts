import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { Wishlist } from './wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Crud({
  model: {
    type: Wishlist,
  },
})
@Controller('wishlists')
export class WishlistsController implements CrudController<Wishlist> {
  constructor(public service: WishlistsService) {}
}
