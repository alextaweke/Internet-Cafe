import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { calculateDuration, calculateCost } from '../utils/helpers';

const prisma = new PrismaClient();

interface SessionData {
  computerId: number;
  user?: string;
}

interface EndSessionData {
  paymentAmount?: number;
}

class SessionService {
  async getAllSessions(status?: 'active' | 'completed', computerId?: number) {
    return prisma.session.findMany({
      where: {
        ...(status === 'active' ? { endTime: null } : 
             status === 'completed' ? { endTime: { not: null } } : {}),
        ...(computerId ? { computerId } : {})
      },
      include: {
        computer: true,
        payment: true
      },
      orderBy: {
        startTime: 'desc'
      }
    });
  }

  async getActiveSessions() {
    return prisma.session.findMany({
      where: {
        endTime: null
      },
      include: {
        computer: true
      }
    });
  }

  async getSessionById(id: number) {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        computer: true,
        payment: true
      }
    });

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    return session;
  }

  async createSession({ computerId, user }: SessionData) {
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

    // Start new session
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
  }

  async endSession(id: number, { paymentAmount }: EndSessionData = {}) {
    // Find session with computer details
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        computer: true
      }
    });

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    if (session.endTime) {
      throw new ApiError(400, 'Session already ended');
    }

    // Calculate duration and cost
    const endTime = new Date();
    const durationMinutes = calculateDuration(session.startTime, endTime);
    const calculatedAmount = calculateCost(durationMinutes, session.computer.hourlyRate);
    const finalAmount = paymentAmount || calculatedAmount;

    // Update session
    const updatedSession = await prisma.$transaction([
      prisma.session.update({
        where: { id },
        data: {
          endTime,
          totalAmount: finalAmount,
          isPaid: Boolean(paymentAmount)
        }
      }),
      prisma.payment.create({
        data: {
          sessionId: id,
          amount: finalAmount,
          paymentTime: endTime
        }
      }),
      prisma.computer.update({
        where: { id: session.computerId },
        data: {
          status: 'available'
        }
      })
    ]);

    return {
      session: updatedSession[0],
      payment: updatedSession[1],
      durationMinutes,
      calculatedAmount,
      finalAmount
    };
  }

  async deleteSession(id: number) {
    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id }
    });

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    // Use transaction to ensure data consistency
    return prisma.$transaction(async (tx) => {
      // Delete session
      await tx.session.delete({
        where: { id }
      });

      // If session was active, free up the computer
      if (!session.endTime) {
        await tx.computer.update({
          where: { id: session.computerId },
          data: {
            status: 'available'
          }
        });
      }
    });
  }
}

export default new SessionService();