import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistItem } from './wishlistItem.entity';

@Injectable()
export class WishlistItemsService extends TypeOrmCrudService<WishlistItem> {
  constructor(@InjectRepository(WishlistItem) repo) {
    super(repo);
  }

  async getWishlistWithProducts() {
    return this.repo.find({ relations: ['product'] });
  }
}
