import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewsService],
  exports: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
