import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './shopping-cart.entity';
import { ShoppingCartsController } from './shopping-carts.controller';
import { ShoppingCartsService } from './shopping-carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCart])],
  providers: [ShoppingCartsService],
  exports: [ShoppingCartsService],
  controllers: [ShoppingCartsController],
})
export class ShoppingCartsModule {}
