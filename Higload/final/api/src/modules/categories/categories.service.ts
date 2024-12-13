import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService extends TypeOrmCrudService<Category> {
  constructor(@InjectRepository(Category) repo) {
    super(repo);
  }
}
