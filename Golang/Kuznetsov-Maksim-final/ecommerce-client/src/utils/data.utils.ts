import { Locals } from '@/constants/locals.constansts';

export const Mock = (size: number) => Array(size).fill('-').join('');

export const fromLocal = <T>(key: Locals | string, fallback: any = null): T | typeof fallback => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') || fallback;
  } catch (e) {
    console.error(`fromLocal[${key}] Error: `, e);
    localStorage.removeItem(key);
    return fallback;
  }
};

export const toLocal = (key: Locals | string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
