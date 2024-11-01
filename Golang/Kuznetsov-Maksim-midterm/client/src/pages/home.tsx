import EditModal from '@/components/EditModal';
import Layout from '@/components/Layout';
import UserCard from '@/components/UserCard';
import { User } from '@/types/users.types';
import { api } from '@/utils';
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [edited, setEdited] = useState<Partial<User> | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    api('users').then((res) => setUsers(res.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <EditModal
        fields={['name']}
        name="users"
        data={edited}
        onClose={() => setEdited(null)}
        onSubmited={fetchUsers}
      />

      <div className="flex gap-4 items-center">
        <h1 className="text-2xl">Select the user</h1>
        <Button onClick={() => setEdited({})} variant="solid" color="secondary">
          Добавить
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {users.map((user) => (
          <UserCard onClick={() => setEdited(user)} user={user} key={user.id} />
        ))}
      </div>
    </Layout>
  );
};
export default HomePage;
