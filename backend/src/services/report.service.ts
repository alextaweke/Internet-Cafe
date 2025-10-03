import prisma from '../config/db';

export const getDailyReportService = async (date: string) => {
  const startDate = new Date(date);
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

  return {
    date: startDate,
    totalSessions: sessions.length,
    totalAmount,
    sessions
  };
};

export const getTimePeriodReportService = async (period: string) => {
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
      throw new Error('Invalid period specified');
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

  const groupedData = payments.reduce((acc: { [x: string]: any; }, payment: { paymentTime: { toISOString: () => string; }; amount: any; }) => {
    const dateKey = payment.paymentTime.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    acc[dateKey] += payment.amount;
    
    return acc;
  }, {} as Record<string, number>);

  return {
    period,
    startDate,
    totalAmount,
    totalPayments: payments.length,
    chartData: Object.entries(groupedData).map(([date, amount]) => ({ date, amount }))
  };
};