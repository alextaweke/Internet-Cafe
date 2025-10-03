export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Computer {
  id: number;
  name: string;
  status: string;
  hourlyRate: number;
  currentSession?: Session;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: number;
  computerId: number;
  user?: string;
  startTime: Date;
  endTime?: Date;
  totalAmount?: number;
  isPaid: boolean;
  computer?: Computer;
  payment?: Payment;
}

export interface EndSessionResponse extends Session {
  durationMinutes: number;
  payment: Payment;
}

export interface Payment {
  id: number;
  sessionId: number;
  amount: number;
  paymentTime: Date;
}

export interface DailyReport {
  date: Date;
  totalSessions: number;
  totalAmount: number;
  sessions: Session[];
}

export interface TimePeriodReport {
  period: string;
  startDate: Date;
  totalAmount: number;
  totalPayments: number;
  chartData: { date: string; amount: number }[];
}