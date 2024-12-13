import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@dataui/crud';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheStore,
  CacheTTL,
} from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Product,
  },
})
@Controller('products')
export class ProductsController implements CrudController<Product> {
  constructor(
    public service: ProductsService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  get base(): CrudController<Product> {
    return this;
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  @Override('getManyBase')
  getAllCached(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  @Override('getOneBase')
  getOneCached(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @Body() dto: Product) {
    const result = await this.base.createOneBase(req, dto);
    await this.cacheManager.del('products');
    return result;
  }
}
