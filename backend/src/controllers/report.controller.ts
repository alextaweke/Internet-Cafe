import { Request, Response } from 'express';
import prisma from '../config/db';
import { ApiResponse } from '../utils/apiResponse';
import {ApiError} from '../utils/apiError'
export const getDailyReport = async (req: Request, res: Response) => {
  const { date } = req.query;
  
  const startDate = new Date(date as string);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);

  const sessions = await prisma.session.findMany({
    where: {
      endTime: {
        gte: startDate,
        lt: endDate
      }
    },
    include: {
      computer: true
    }
  });

  const totalAmount = sessions.reduce((sum: any, session: { totalAmount: any; }) => sum + (session.totalAmount || 0), 0);

  new ApiResponse(res, 200, {
    date: startDate,
    totalSessions: sessions.length,
    totalAmount,
    sessions
  });
};

export const getTimePeriodReport = async (req: Request, res: Response) => {
  const { period } = req.params; // 'week', 'month', 'year'
  
  let startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  switch (period) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      throw new ApiError(400, 'Invalid period specified');
  }

  const payments = await prisma.payment.findMany({
    where: {
      paymentTime: {
        gte: startDate
      }
    },
    include: {
      session: {
        include: {
          computer: true
        }
      }
    }
  });

  const totalAmount = payments.reduce((sum: any, payment: { amount: any; }) => sum + payment.amount, 0);

  // Group by day/week/month for chart data
  const groupedData = payments.reduce((acc: { [x: string]: any; }, payment: { paymentTime: { toISOString: () => string; }; amount: any; }) => {
    const dateKey = payment.paymentTime.toISOString().split('T')[0]; // Simple date key
    
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    acc[dateKey] += payment.amount;
    
    return acc;
  }, {} as Record<string, number>);

  new ApiResponse(res, 200, {
    period,
    startDate,
    totalAmount,
    totalPayments: payments.length,
    chartData: Object.entries(groupedData).map(([date, amount]) => ({ date, amount }))
  });
};