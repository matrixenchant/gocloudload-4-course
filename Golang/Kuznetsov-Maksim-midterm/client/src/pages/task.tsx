import Layout from '@/components/Layout';
import { Task } from '@/types/tasks.types';
import { api } from '@/utils';
import { Button, Progress, User } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);

  const fetchTaskById = (id: string) => {
    api(`tasks/${id}`).then((res) => setTask(res.data));
  };

  useEffect(() => {
    if (!id) return;

    fetchTaskById(id);
  }, [id]);

  if (task === null) return <Progress isIndeterminate />;

  return (
    <Layout>
      <Button onClick={() => navigate(-1)} variant="faded">
        Back
      </Button>

      <div className="text-4xl font-bold mt-2">{task.title}</div>

      <div className="text-medium mt-5">{task.description}</div>

      <div className="flex items-center gap-2 mt-5">
        Author: <User name={task.user?.name || 'Anonym'} />
      </div>
    </Layout>
  );
};

export default TaskDetails;
