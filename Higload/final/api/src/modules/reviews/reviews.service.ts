import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService extends TypeOrmCrudService<Review> {
  constructor(@InjectRepository(Review) repo) {
    super(repo);
  }
}
