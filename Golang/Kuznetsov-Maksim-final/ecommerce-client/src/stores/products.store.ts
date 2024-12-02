import { Product } from '@/types/common.types';
import { api, RequestData } from '@/utils/api.utils';
import { makeAutoObservable } from 'mobx';

export class ProductsStoreClass {
  constructor() {
    makeAutoObservable(this);
  }

  products = new RequestData<[], Product[]>(() => api('products'), []);
}

const ProductsStore = new ProductsStoreClass();

export default ProductsStore;
