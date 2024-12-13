import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './orderItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
  controllers: [OrderItemsController],
})
export class OrderItemsModule {}
