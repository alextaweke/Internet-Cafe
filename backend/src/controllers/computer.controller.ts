import { Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import prisma from '../config/db';

export const getAllComputers = async (req: Request, res: Response) => {
  const computers = await prisma.computer.findMany({
    include: {
      sessions: {
        where: {
          endTime: null // Only include active sessions
        },
        take: 1 // Only get the most recent active session
      }
    }
  });

  // Transform the data to match your frontend expectations
  const transformedComputers = computers.map((computer: { sessions: any[]; }) => ({
    ...computer,
    currentSession: computer.sessions[0] || null
  }));

  new ApiResponse(res, 200, transformedComputers);
};

export const startSession = async (req: Request, res: Response) => {
  const { computerId, user } = req.body;

  // Check if computer exists
  const computer = await prisma.computer.findUnique({
    where: { id: computerId }
  });

  if (!computer) {
    throw new ApiError(404, 'Computer not found');
  }

  // Check if computer already has an active session
  const activeSession = await prisma.session.findFirst({
    where: {
      computerId,
      endTime: null
    }
  });

  if (activeSession) {
    throw new ApiError(400, 'Computer already has an active session');
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

  new ApiResponse(res, 201, session, 'Session started successfully');
};

export const endSession = async (req: Request, res: Response) => {
  try {
    const { computerId } = req.body;

    // Validate input
    if (!computerId || isNaN(Number(computerId))) {
      throw new ApiError(400, 'Invalid computer ID');
    }

    // Find computer with active session
    const computer = await prisma.computer.findUnique({
      where: { id: Number(computerId) },
      include: {
        sessions: {
          where: { endTime: null },
          orderBy: { startTime: 'desc' },
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
    const durationMinutes = (endTime.getTime() - activeSession.startTime.getTime()) / (1000 * 60);
    const hourlyRate = computer.hourlyRate || 25; // Default rate if not set
    const totalAmount = (durationMinutes / 60) * hourlyRate;

    // Update in transaction
    const [updatedSession, payment] = await prisma.$transaction([
      prisma.session.update({
        where: { id: activeSession.id },
        data: {
          endTime,
          totalAmount,
          isPaid: true
        }
      }),
      prisma.payment.create({
        data: {
          sessionId: activeSession.id,
          amount: totalAmount,
          paymentTime: endTime
        }
      }),
      prisma.computer.update({
        where: { id: computer.id },
        data: { status: 'available' }
      })
    ]);

    new ApiResponse(res, 200, {
      ...updatedSession,
      durationMinutes,
      totalAmount,
      payment
    }, 'Session ended successfully');

  } catch (error) {
    console.error('End session error:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};


// controllers/computer.ts
export const addComputer = async (req: Request, res: Response) => {
  const { name, hourlyRate } = req.body;  // Destructure both fields
  
  if (!name) {
    throw new ApiError(400, 'Computer name is required');
  }

  if (hourlyRate && isNaN(Number(hourlyRate))) {
    throw new ApiError(400, 'Invalid hourly rate');
  }

  const computer = await prisma.computer.create({
    data: {
      name,
      status: 'available',
      hourlyRate: hourlyRate ? Number(hourlyRate) : 25 // Default to 25 if not provided
    }
  });

  new ApiResponse(res, 201, computer, 'Computer added successfully');
};
export const deleteComputer = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, 'Invalid computer ID');
  }

  const computer = await prisma.computer.findUnique({
    where: { id: Number(id) },
    include: {
      sessions: {
        where: {
          endTime: null
        }
      }
    }
  });

  if (!computer) {
    throw new ApiError(404, 'Computer not found');
  }

  if (computer.sessions.length > 0) {
    throw new ApiError(400, 'Cannot delete computer with active session');
  }

  // Use transaction to ensure data consistency
  await prisma.$transaction([
    // First delete all sessions (including historical ones)
    prisma.session.deleteMany({
      where: { computerId: Number(id) }
    }),
    // Then delete the computer
    prisma.computer.delete({
      where: { id: Number(id) }
    })
  ]);

  new ApiResponse(res, 200, null, 'Computer deleted successfully');
};