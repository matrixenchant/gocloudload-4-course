import { useApp } from '@/hooks/useApp';
import { User } from '@/types/users.types';
import { Button, User as UserChip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  user: User;
  onClick?: () => void;
}

const UserCard = ({ user, onClick }: IProps) => {
  const navigate = useNavigate();
  const { updateUser } = useApp();

  return (
    <div className="p-2 bg-content2 rounded-xl">
      <UserChip name={user.name} />
      {onClick && (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              navigate('/tasks');
              updateUser(user);
            }}
          >
            Tasks
          </Button>
          <Button onClick={onClick} variant="bordered">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
