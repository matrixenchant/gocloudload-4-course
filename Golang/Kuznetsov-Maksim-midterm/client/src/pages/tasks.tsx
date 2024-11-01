import EditModal from '@/components/EditModal';
import Layout from '@/components/Layout';
import StatusSelect from '@/components/StatusSelect';
import TaskCard from '@/components/TaskCard';
import UserCard from '@/components/UserCard';
import { useApp } from '@/hooks/useApp';
import { Task } from '@/types/tasks.types';
import { api } from '@/utils';
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';

const TasksPage = () => {
  const user = useApp().user!;

  const [edited, setEdited] = useState<Partial<Task> | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = () => {
    api('tasks', { params: { user: user.id } }).then((res) => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Layout>
      <EditModal
        fields={['title', 'description', 'status', 'userID']}
        name="tasks"
        data={edited}
        onClose={() => setEdited(null)}
        onSubmited={fetchTasks}
        inputs={{
          userID: () => null,
          status: StatusSelect,
        }}
      />

      <UserCard user={user!} />

      <div className="flex gap-4 items-center mt-2">
        <h1 className="text-2xl">Tasks</h1>
        <Button onClick={() => setEdited({ userID: +user.id })} variant="solid" color="secondary">
          Добавить
        </Button>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {tasks.map((task) => (
          <TaskCard onClick={() => setEdited(task)} task={task} key={task.id} />
        ))}
      </div>
    </Layout>
  );
};

export default TasksPage;
