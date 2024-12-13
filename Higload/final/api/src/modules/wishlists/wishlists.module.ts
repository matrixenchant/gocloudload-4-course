import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])],
  providers: [WishlistsService],
  exports: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
