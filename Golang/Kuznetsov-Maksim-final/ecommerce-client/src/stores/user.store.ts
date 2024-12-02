import { Order, User } from '@/types/common.types';
import { ProductReviewDto } from '@/types/dto.types';
import { api, RequestData } from '@/utils/api.utils';
import { makeAutoObservable } from 'mobx';

export class UserStoreClass {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getMe() {
    const res = await api('users/profile');
    return res.data;
  }

  updateUser(userProps: Partial<User> | ((_user: User) => User)) {
    if (typeof userProps === 'function' && this.user) {
      this.user = userProps(this.user);
    } else {
      this.user = { ...this.user, ...userProps } as User;
    }
  }

  clearUser() {
    this.user = null;
  }

  addReview = new RequestData<[ProductReviewDto]>((props) => api.post('reviews', props));

  orders = new RequestData<[], Order[]>(() => api.get('orders'), []);

  cancelOrder = new RequestData<[number]>((id) => api.get(`orders/${id}/cancel`));
  payOrder = new RequestData<[number]>((id) => api.get(`orders/${id}/pay`));
}

const UserStore = new UserStoreClass();

export default UserStore;
