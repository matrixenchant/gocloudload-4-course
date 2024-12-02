import { Locals } from '@/constants/locals.constansts';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API,
});

const AuthInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(Locals.Token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

api.interceptors.request.use(AuthInterceptor);

export class RequestData<T extends any[], D = null> {
  data: D;
  loading = false;
  error: Partial<AxiosError> | null = null;
  _callback: any;

  constructor(callback: (...args: T) => Promise<AxiosResponse<D, any>>, initData: D | null = null) {
    this._callback = callback;
    this.data = initData as D;

    makeAutoObservable(this);
  }

  async call(...args: T) {
    try {
      this.error = null;
      this.loading = true;

      const res: AxiosResponse<D, any> = await this._callback(...args);
      this.data = res.data;

      this.loading = false;
      return res;
    } catch (e: any) {
      if (isAxiosError(e)) {
        this.error = e.response?.data;
      } else {
        this.error = { message: e.message };
      }

      this.loading = false;
      throw this.error;
    }
  }

  mutate(data: MutateFunc<D> | D) {
    if (typeof data === 'function') {
      this.data = (data as MutateFunc<D>)(this.data);
      return;
    }

    this.data = data;
  }
}

type MutateFunc<T> = (oldData: T) => T;

export const getApiErrorMessage = (err: any) => {
  if (isAxiosError(err)) {
    const msg = err.response?.data.message;
    if (Array.isArray(msg)) return msg.join('\n');
    return msg;
  }

  return err?.message || 'Ошибка сервера';
};
