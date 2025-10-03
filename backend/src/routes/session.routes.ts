import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  startSession,
  endSession,
  getActiveSessions,
  getSessionById,
  getAllSessions,
  deleteSession
} from '../controllers/session.controller';

const router = Router();

// Start a new session
router.post('/start', auth, startSession);

// End an active session
router.post('/:id/end', auth, endSession);

// Get all active sessions
router.get('/active', auth, getActiveSessions);

// Get session by ID
router.get('/:id', auth, getSessionById);

// Get all sessions (with optional filters)
router.get('/', auth, getAllSessions);

// Delete a session (admin only)
router.delete('/:id', auth, deleteSession);

export default router;