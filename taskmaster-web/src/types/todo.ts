export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  priority: Priority;
  category?: string;
  createdAt: string;
  userId: number;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  category?: string;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  category?: string;
  isCompleted: boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  message: string;
}