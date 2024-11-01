import Layout from '@/components/Layout';
import { useApi } from '@/hooks/useApi';
import { useApp } from '@/hooks/useApp';
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const [form, setForm] = useState<Omit<User, 'id'>>({
    username: '',
    password: '',
  });
  const { data, loading, fetch, error } = useApi<{ user: User; token: string }>(`login`, {
    method: 'POST',
    manual: true,
    body: form,
  });
  const { login } = useApp();

  const onChangeHandler = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (data) {
      login(data.user, data.token);
    }
  }, [data]);

  return (
    <Layout>
      <div className="text-2xl font-bold text-default-700">Login</div>

      <div className="flex flex-col gap-3 w-64 mt-4">
        <input
          className="border p-2 rounded-lg"
          placeholder="Username"
          type="text"
          name="username"
          value={form.username}
          onChange={onChangeHandler}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="Password"
          type="text"
          name="password"
          value={form.password}
          onChange={onChangeHandler}
        />

        {!loading && (
          <button
            className="p-2 rounded-lg bg-primary transition-all text-white hover:bg-primary-600"
            onClick={fetch}
          >
            Login
          </button>
        )}
        {loading && <div className="p-2 rounded-lg bg-primary text-white">Loading...</div>}
      </div>

      {error && (
        <div className="mt-3 p-2 w-fit rounded-lg border border-danger text-danger text-center">
          {error}
        </div>
      )}
    </Layout>
  );
};

export default LoginPage;
