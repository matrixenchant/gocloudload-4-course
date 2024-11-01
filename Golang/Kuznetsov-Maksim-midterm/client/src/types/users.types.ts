import { Task } from './tasks.types';

export interface User {
  id: number;
  name: string;
  tasks: Task[];
}
