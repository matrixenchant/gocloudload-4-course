import { User } from '@/types/users.types';
import { api } from '@/utils';
import { Select, SelectItem } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { EditModalInput } from './EditModal';

const UserSelect: FC<EditModalInput> = ({ value, onChange }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    api('users').then((res) => setUsers(res.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Select selectedKeys={[value]} onChange={(e) => onChange(e.target.value)}>
      {users.map((user) => (
        <SelectItem key={user.id}>{user.name}</SelectItem>
      ))}
    </Select>
  );
};

export default UserSelect;
