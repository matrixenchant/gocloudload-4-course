import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistsService extends TypeOrmCrudService<Wishlist> {
  constructor(@InjectRepository(Wishlist) repo) {
    super(repo);
  }
}
