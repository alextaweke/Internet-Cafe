import axios from 'axios';
import type { User, ApiResponse } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (
  username: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const response = await axios.post<ApiResponse<{ token: string; user: User }>>(
    `${API_URL}/auth/login`,
    { username, password }
  );
  return response.data.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<ApiResponse<User>>(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};
