import { Locals } from '@/constants/locals.constansts';

import { User } from '@/types/common.types';
import { api } from '@/utils/api.utils';
import { makeAutoObservable } from 'mobx';
import toast from 'react-hot-toast';
import UserStore from './user.store';

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export class AuthStoreClass {
  isAuth = false;
  authLoading = !!localStorage.getItem(Locals.Token);

  constructor() {
    makeAutoObservable(this);
  }

  async init() {
    if (localStorage.getItem(Locals.Token)) {
      try {
        const user = await UserStore.getMe();
        AuthStore.authorize(user);
      } catch {
        toast.error('Ошибка авторизации');
        AuthStore.logout();
      }
    }
  }

  async login({ username, password }: LoginDTO) {
    const { data } = await api.post<{ token: string; user: User }>('auth/login', {
      username,
      password,
    });

    const { user, token } = data;
    localStorage.setItem(Locals.Token, token);

    this.authorize(user);
  }

  async register({ username, password, email }: RegisterDTO) {
    const { data } = await api.post<{ token: string; user: User }>('auth/register', {
      username,
      password,
      email,
    });

    const { user, token } = data;
    localStorage.setItem(Locals.Token, token);

    this.authorize(user);
  }

  authorize(user: User) {
    UserStore.updateUser(user);
    this.isAuth = true;
    this.authLoading = false;
  }

  logout() {
    this.isAuth = false;
    UserStore.clearUser();
    localStorage.removeItem(Locals.Token);
    this.authLoading = false;
  }
}

const AuthStore = new AuthStoreClass();

export default AuthStore;
