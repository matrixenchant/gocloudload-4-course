import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItemsController } from './wishlist-items.controller';
import { WishlistItemsService } from './wishlist-items.service';
import { WishlistItem } from './wishlistItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem])],
  providers: [WishlistItemsService],
  exports: [WishlistItemsService],
  controllers: [WishlistItemsController],
})
export class WishlistItemsModule {}
