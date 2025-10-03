import { Router } from 'express';
import { 
  getAllComputers, 
  startSession, 
  endSession,
  addComputer,
  deleteComputer
} from '../controllers/computer.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// Computer management routes
router.get('/', auth, getAllComputers);
router.post('/', auth, addComputer);  // Correct endpoint for adding computers
router.delete('/:id', auth, deleteComputer);

// Session management routes
router.post('/start-session', auth, startSession);
router.post('/end-session', auth, endSession);

export default router;