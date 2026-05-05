import { customFetch } from '../utils/api';
import { type Todo, type CreateTodoRequest, type UpdateTodoRequest } from '../types/todo';

export const todoService = {
  getAll: () =>
    customFetch<Todo[]>('/Todo'),

  create: (payload: CreateTodoRequest) =>
    customFetch<Todo>('/Todo', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpdateTodoRequest) =>
    customFetch<void>(`/Todo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    customFetch<void>(`/Todo/${id}`, {
      method: 'DELETE',
    }),
};