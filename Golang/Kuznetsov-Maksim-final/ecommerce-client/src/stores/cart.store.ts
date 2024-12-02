import { ShoppingCart } from '@/types/common.types';
import { api, RequestData } from '@/utils/api.utils';
import { makeAutoObservable } from 'mobx';

export interface CartItemDto {
  cart_id: number;
  product_id: number;
  quantity: number;
}

export class CartsStoreClass {
  activeCartId: null | number = null;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveCartId = (id: number) => {
    this.activeCartId = id;
  };

  myCarts = new RequestData<[], ShoppingCart[]>(() => api('carts'), []);

  getCart = new RequestData<[string], ShoppingCart>((id) => api(`carts/${id}`));

  createCart = new RequestData<[], ShoppingCart>(() => api.post('carts'));

  deleteCart = new RequestData<[number], ShoppingCart>((id) => api.delete(`carts/${id}`));

  addItem = new RequestData<[CartItemDto], ShoppingCart[]>(
    (props) => api.post('cart-item', { ...props }),
    []
  );

  updateItem = new RequestData<[string, CartItemDto], ShoppingCart[]>(
    (id, props) => api.patch(`cart-item/${id}`, { ...props }),
    []
  );

  deleteItem = new RequestData<[string], ShoppingCart[]>((id) => api.delete(`cart-item/${id}`), []);

  async addCartItem(productId: number, quantity: number) {
    if (this.myCarts.data.length === 0) {
      const { data: newCart } = await this.createCart.call();

      this.setActiveCartId(newCart.cart_id);
    }

    if (!this.activeCartId) {
      this.activeCartId = this.myCarts.data[0].cart_id;
    }

    await this.addItem.call({ cart_id: this.activeCartId, product_id: productId, quantity });
  }

  checkoutCart = new RequestData<[{ cart_id: number }]>((props) => api.post('orders', props));
}

const CartsStore = new CartsStoreClass();

export default CartsStore;
