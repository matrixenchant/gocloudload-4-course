import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  providers: [CartItemsService],
  exports: [CartItemsService],
  controllers: [CartItemsController],
})
export class CartItemsModule {}
