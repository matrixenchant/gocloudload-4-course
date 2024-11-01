import Layout from '@/components/Layout';
import Loader from '@/components/Loader';
import { useApp } from '@/hooks/useApp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { books, booksLoading } = useApp();

  return (
    <Layout>
      <div className="flex gap-2">
        <div className="text-2xl font-bold text-default-700">All Library</div>
        <button
          className="p-2 text-small rounded-lg bg-content2 transition-all hover:bg-content3"
          onClick={() => navigate('/create')}
        >
          New Book
        </button>
      </div>

      {booksLoading && <Loader />}

      <div className="grid grid-cols-4 gap-2 mt-4">
        {books.map((book) => (
          <div key={book.id} className="p-4 bg-content2 rounded-2xl">
            <div className="text-tiny opacity-50">{book.id}</div>
            <div className="text-medium my-1">{book.title}</div>
            <div className="text-small text-default-500 line-clamp-2">{book.description}</div>
            <button
              className="mt-2 p-2 text-small rounded-lg bg-content3 transition-all hover:bg-content4"
              onClick={() => navigate(`/${book.id}`)}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default HomePage;
