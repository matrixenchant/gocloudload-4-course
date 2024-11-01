import axios, { AxiosRequestConfig, isAxiosError, Method } from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface ApiProps {
  method?: Method;
  default?: any;
  initLoading?: boolean;
  body?: any;
  config?: AxiosRequestConfig;
  manual?: boolean;
}

const api = axios.create({ baseURL: 'http://localhost:8080/' });

export const useApi = <T>(url: string | null, props: ApiProps = {}) => {
  const [data, setData] = useState<T>(props.default || null);
  const [loading, setLoading] = useState(props.initLoading || false);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    if (!url) return;

    const token = localStorage.getItem('token');

    setError('');
    setLoading(true);
    try {
      let res;

      await delay();

      props.config = {
        ...props.config,
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      };

      switch (props.method) {
        case 'POST':
          res = await api.post(url, props.body || {}, props.config);
          break;

        case 'PATCH':
          res = await api.patch(url, props.body || {}, props.config);
          break;

        case 'DELETE':
          res = await api.delete(url, props.config);
          break;

        default:
          res = await api.get(url, props.config);
          break;
      }

      setData(res.data);
    } catch (e: any) {
      if (isAxiosError(e)) {
        setError(e.response?.data.message);
      } else {
        setError(e.message || 'Unknown Error');
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [url, props]);

  useEffect(() => {
    if (!url) return;

    if (!props.manual) {
      console.log('FETCH', url, props);

      fetch();
    }
  }, [url]);

  return { data, loading, error, fetch };
};

const delay = (t = 1000) =>
  new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, t)
  );
