import { customFetch } from '../utils/api';
import { type AuthResponse } from '../types/todo';

interface AuthPayload {
  username: string;
  password: string;
}

export const authService = {
  login: (payload: AuthPayload) =>
    customFetch<AuthResponse>('/Auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: AuthPayload) =>
    customFetch<{ message: string }>('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};