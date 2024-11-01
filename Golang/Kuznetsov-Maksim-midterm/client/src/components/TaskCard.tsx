import { Task } from '@/types/tasks.types';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: IProps) => {
  const navigate = useNavigate();
  const { status, title, description } = task;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <div>"{title}"</div>

        {status === 'idle' && (
          <Chip size="sm" color="default">
            {status.toLocaleUpperCase()}
          </Chip>
        )}
        {status === 'active' && (
          <Chip size="sm" color="warning">
            {status.toLocaleUpperCase()}
          </Chip>
        )}
        {status === 'finished' && (
          <Chip size="sm" color="success">
            {status.toLocaleUpperCase()}
          </Chip>
        )}
      </CardHeader>

      <CardBody>
        <div className="h-4"></div>

        <div className="text-tiny text-default-400">Description</div>
        <div>{description}</div>
      </CardBody>
      <CardFooter>
        <Button onClick={() => navigate(`/tasks/${task.id}`)}>Open</Button>
        <Button onClick={onClick} variant="light">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
