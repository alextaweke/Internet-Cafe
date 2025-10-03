import { Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import prisma from '../config/db';
import { calculateDuration, calculateCost } from '../utils/helpers';

export const startSession = async (req: Request, res: Response) => {
  const { computerId, user } = req.body;

  // Validate input
  if (!computerId || isNaN(Number(computerId))) {
    throw new ApiError(400, 'Invalid computer ID');
  }

  // Check computer availability
  const computer = await prisma.computer.findUnique({
    where: { id: Number(computerId) }
  });

  if (!computer) {
    throw new ApiError(404, 'Computer not found');
  }

  if (computer.status !== 'available') {
    throw new ApiError(400, 'Computer is not available');
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      computerId: Number(computerId),
      user: user || 'Anonymous',
      startTime: new Date()
    }
  });

  // Update computer status
  await prisma.computer.update({
    where: { id: Number(computerId) },
    data: { status: 'in-use' }
  });

  new ApiResponse(res, 201, session, 'Session started successfully');
};

export const endSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentAmount } = req.body;

  // Find session with computer details
  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: { computer: true }
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

  // Update session and create payment in a transaction
  const [updatedSession, payment] = await prisma.$transaction([
    prisma.session.update({
      where: { id: Number(id) },
      data: {
        endTime,
        totalAmount: finalAmount,
        isPaid: Boolean(paymentAmount)
      }
    }),
    prisma.payment.create({
      data: {
        sessionId: Number(id),
        amount: finalAmount,
        paymentTime: endTime
      }
    }),
    prisma.computer.update({
      where: { id: session.computerId },
      data: { status: 'available' }
    })
  ]);

  new ApiResponse(res, 200, {
    session: updatedSession,
    payment,
    durationMinutes,
    calculatedAmount,
    finalAmount
  }, 'Session ended successfully');
};

export const getActiveSessions = async (req: Request, res: Response) => {
  const sessions = await prisma.session.findMany({
    where: { endTime: null },
    include: { computer: true }
  });

  new ApiResponse(res, 200, sessions);
};

export const getSessionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: { computer: true, payment: true }
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  new ApiResponse(res, 200, session);
};

export const getAllSessions = async (req: Request, res: Response) => {
  const { status, computerId, userId } = req.query;

  const sessions = await prisma.session.findMany({
    where: {
      ...(status === 'active' ? { endTime: null } : 
           status === 'completed' ? { endTime: { not: null } } : {}),
      ...(computerId ? { computerId: Number(computerId) } : {}),
      ...(userId ? { userId: Number(userId) } : {})
    },
    include: {
      computer: true,
      payment: true
    },
    orderBy: { startTime: 'desc' }
  });

  new ApiResponse(res, 200, sessions);
};

export const deleteSession = async (req: Request, res: Response) => {
  const { id } = req.params;

  const session = await prisma.session.findUnique({
    where: { id: Number(id) }
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  await prisma.$transaction(async (tx) => {
    await tx.session.delete({ where: { id: Number(id) } });

    if (!session.endTime) {
      await tx.computer.update({
        where: { id: session.computerId },
        data: { status: 'available' }
      });
    }
  });

  new ApiResponse(res, 200, null, 'Session deleted successfully');
};