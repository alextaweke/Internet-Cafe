export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Computer {
  sessions: any;
  id: number;
  name: string;
  status: 'available' | 'in-use' | 'maintenance';
  hourlyRate: number;
  currentSession?: Session;
}

export interface Session {
  id: number;
  computerId: number;
  startTime: string;
  endTime?: string;
  user?: string;
  totalAmount?: number;
  isPaid: boolean;
}

export interface Payment {
  id: number;
  sessionId: number;
  amount: number;
  paymentTime: string;
}

export interface Report {
  date: string;
  totalAmount: number;
  totalSessions: number;
  chartData: {
    date: string;  // or hour: string if you prefer hourly data
    amount: number;
  }[];
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}