import Layout from '@/components/Layout';
import { useApi } from '@/hooks/useApi';
import { useNavigate, useParams } from 'react-router-dom';

const DetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: book, loading } = useApi<Book>(id ? `books/${id}` : null, { initLoading: true });

  if (loading) return <div>Loading...</div>;

  return (
    <Layout>
      <button className="p-2 rounded-lg bg-content3" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="mt-2 text-2xl font-bold text-default-700">Book "{book.title}"</div>
      <div className="text-tiny opacity-50">#{book.id}</div>
      <div className="my-2"></div>
      <div className="text-medium text-default-500">{book.description}</div>
    </Layout>
  );
};

export default DetailsPage;
