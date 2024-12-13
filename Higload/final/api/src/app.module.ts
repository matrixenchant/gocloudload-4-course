import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './filters/allExceptions.filter';
import { AuthModule } from './modules/auth/auth.module';
import { CartItem } from './modules/cart-items/cart-item.entity';
import { CartItemsModule } from './modules/cart-items/cart-items.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { Category } from './modules/categories/category.entity';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrderItem } from './modules/order-items/orderItem.entity';
import { Order } from './modules/orders/order.entity';
import { OrdersModule } from './modules/orders/orders.module';
import { Payment } from './modules/payments/payment.entity';
import { PaymentsModule } from './modules/payments/payments.module';
import { Product } from './modules/products/product.entity';
import { ProductsModule } from './modules/products/products.module';
import { Review } from './modules/reviews/review.entity';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ShoppingCart } from './modules/shopping-carts/shopping-cart.entity';
import { ShoppingCartsModule } from './modules/shopping-carts/shopping-carts.module';
import { User } from './modules/users/user.entity';
import { UsersModule } from './modules/users/users.module';
import { WishlistItemsModule } from './modules/wishlist-items/wishlist-items.module';
import { WishlistItem } from './modules/wishlist-items/wishlistItem.entity';
import { Wishlist } from './modules/wishlists/wishlist.entity';
import { WishlistsModule } from './modules/wishlists/wishlists.module';

@Module({
  imports: [
    PrometheusModule.register(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'highload-final',
      entities: [
        CartItem,
        Category,
        OrderItem,
        Order,
        Payment,
        Product,
        Review,
        ShoppingCart,
        User,
        WishlistItem,
        Wishlist,
      ],
      synchronize: true,
      migrations: ['/migrations/*{.ts,.js}'],
      migrationsTableName: 'task_migrations',
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000,
        };
      },
      isGlobal: true,
    }),
    AuthModule,
    CartItemsModule,
    CategoriesModule,
    OrderItemsModule,
    OrdersModule,
    PaymentsModule,
    ProductsModule,
    ReviewsModule,
    ShoppingCartsModule,
    UsersModule,
    WishlistItemsModule,
    WishlistsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
