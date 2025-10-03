import axios from 'axios';
import type { Session, Computer, ApiResponse } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
export const addComputer = async (name: string, hourlyRate: number = 25): Promise<Computer> => {
  const response = await axios.post<ApiResponse<Computer>>(
    `${API_URL}/computers`,
    { name, hourlyRate },  // Send both fields
    getAuthHeader()
  );
  return response.data.data;
};
export const deleteComputer = async (id: number): Promise<void> => {
  await axios.delete<ApiResponse<void>>(
    `${API_URL}/computers/${id}`,
    getAuthHeader()
  );
};
export const getComputers = async (): Promise<Computer[]> => {
  const response = await axios.get<ApiResponse<Computer[]>>(
    `${API_URL}/computers`,
    getAuthHeader()
  );
  return response.data.data;
};

export const startSession = async (
  computerId: number,
  user?: string
): Promise<Session> => {
  const payload = {
    computerId,
    user: user || 'Anonymous' // ✅ fallback
  };

  const response = await axios.post<ApiResponse<Session>>(
    `${API_URL}/computers/start-session`,
    payload,
    getAuthHeader()
  );

  return response.data.data;
};


export const endSession = async (
  computerId: number
): Promise<Session> => {
  const response = await axios.post<ApiResponse<Session>>(
    `${API_URL}/computers/end-session`,
    { computerId },
    getAuthHeader()
  );
  return response.data.data;
};

export const getActiveSessions = async (): Promise<Session[]> => {
  const response = await axios.get<ApiResponse<Session[]>>(
    `${API_URL}/sessions/active`,
    getAuthHeader()
  );
  return response.data.data;
};
