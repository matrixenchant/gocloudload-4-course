import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Crud({
  model: {
    type: Category,
  },
})
@Controller('categories')
export class CategoriesController implements CrudController<Category> {
  constructor(public service: CategoriesService) {}
}
