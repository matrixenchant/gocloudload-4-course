import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';

@Crud({
  model: {
    type: Review,
  },
})
@Controller('reviews')
export class ReviewsController implements CrudController<Review> {
  constructor(public service: ReviewsService) {}
}
