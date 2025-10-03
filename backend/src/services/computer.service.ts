import { ApiError } from '../utils/apiError';
import prisma from '../config/db';
import { calculateDuration, calculateCost } from '../utils/helpers';

export const getAllComputersService = async () => {
  return prisma.computer.findMany({
    include: {
      sessions: {
        where: {
          endTime: null // Only include active sessions
        },
        orderBy: {
          startTime: 'desc' // Get most recent session first
        },
        take: 1 // Only take one (most recent) session
      }
    }
  });
};

export const startSessionService = async (computerId: number, user?: string) => {
  // Verify computer exists and is available
  const computer = await prisma.computer.findUnique({
    where: { id: computerId }
  });

  if (!computer) {
    throw new ApiError(404, 'Computer not found');
  }

  if (computer.status !== 'available') {
    throw new ApiError(400, 'Computer is not available');
  }

  // Create new session
  const session = await prisma.session.create({
    data: {
      computerId,
      user: user || 'Anonymous',
      startTime: new Date()
    }
  });

  // Update computer status
  await prisma.computer.update({
    where: { id: computerId },
    data: {
      status: 'in-use'
    }
  });

  return session;
};

export const endSessionService = async (computerId: number) => {
  // Find computer and its active session
  const computer = await prisma.computer.findUnique({
    where: { id: computerId },
    include: {
      sessions: {
        where: {
          endTime: null
        },
        orderBy: {
          startTime: 'desc'
        },
        take: 1
      }
    }
  });

  if (!computer) {
    throw new ApiError(404, 'Computer not found');
  }

  const [activeSession] = computer.sessions;
  if (!activeSession) {
    throw new ApiError(400, 'No active session for this computer');
  }

  // Calculate duration and cost
  const endTime = new Date();
  const durationMinutes = calculateDuration(activeSession.startTime, endTime);
  const totalAmount = calculateCost(durationMinutes, computer.hourlyRate);

  // Update session
  const updatedSession = await prisma.session.update({
    where: { id: activeSession.id },
    data: {
      endTime,
      totalAmount,
      isPaid: false // Mark as unpaid (can be updated when payment is received)
    }
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      sessionId: activeSession.id,
      amount: totalAmount,
      paymentTime: endTime
    }
  });

  // Update computer status
  await prisma.computer.update({
    where: { id: computerId },
    data: {
      status: 'available'
    }
  });

  return {
    session: updatedSession,
    durationMinutes,
    totalAmount
  };
};


// services/computer.ts
export const addComputerService = async (hourlyRate: number) => {
  const computerCount = await prisma.computer.count();
  
  return prisma.computer.create({
    data: {
      status: 'available',
      hourlyRate,
      name: `PC-${computerCount + 1}`
    }
  });
};
export const deleteComputerService = async (computerId: number) => {
  // Check for active sessions
  const activeSessions = await prisma.session.count({
    where: {
      computerId,
      endTime: null
    }
  });

  if (activeSessions > 0) {
    throw new ApiError(400, 'Cannot delete computer with active session');
  }

  return prisma.$transaction([
    prisma.session.deleteMany({
      where: { computerId }
    }),
    prisma.computer.delete({
      where: { id: computerId }
    })
  ]);
};