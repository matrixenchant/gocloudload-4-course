import { User } from "./users.types";

export interface Task {
  id: number;
  title: string;
  status: string;
  description: string;
  userID: number

  user?: User
}
