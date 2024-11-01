import Layout from '@/components/Layout';
import { useApi } from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<Book, 'id'>>({
    title: 'New Book',
    description: '',
    author: '',
  });
  const {
    data: newBook,
    loading,
    fetch,
    error,
  } = useApi<Book>(`books`, { method: 'POST', manual: true, body: form });

  const onChangeHandler = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (newBook) {
      navigate(`/${newBook.id}`);
    }
  }, [newBook]);

  return (
    <Layout>
      <button className="p-2 rounded-lg bg-content3" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="text-2xl font-bold text-default-700">Create New Book</div>

      <div className="flex flex-col gap-3 w-64 mt-4">
        <input
          className="border p-2 rounded-lg"
          placeholder="Title"
          type="text"
          name="title"
          value={form.title}
          onChange={onChangeHandler}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="Description"
          type="text"
          name="description"
          value={form.description}
          onChange={onChangeHandler}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="Author"
          type="text"
          name="author"
          value={form.author}
          onChange={onChangeHandler}
        />

        {!loading && (
          <button
            className="p-2 rounded-lg bg-primary transition-all text-white hover:bg-primary-600"
            onClick={fetch}
          >
            Create
          </button>
        )}
        {loading && <div className="p-2 rounded-lg bg-primary text-white">Creating...</div>}
      </div>

      {error && <div className="mt-3 p-2 w-fit rounded-lg border border-danger text-danger text-center">{error}</div>}
    </Layout>
  );
};

export default CreatePage;
