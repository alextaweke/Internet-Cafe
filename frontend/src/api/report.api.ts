import axios from 'axios';
import type { Report, ApiResponse } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getDailyReport = async (date: string): Promise<Report> => {
  const response = await axios.get<ApiResponse<Report>>(
    `${API_URL}/reports/daily?date=${date}`,
    getAuthHeader()
  );
  return response.data.data;
};

export const getTimePeriodReport = async (period: string): Promise<Report> => {
  const response = await axios.get<ApiResponse<Report>>(
    `${API_URL}/reports/${period}`,
    getAuthHeader()
  );
  return response.data.data;
};
