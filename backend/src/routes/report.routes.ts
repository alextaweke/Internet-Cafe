import { Router } from 'express';
import { 
  getDailyReport, 
  getTimePeriodReport 
} from '../controllers/report.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.get('/daily', auth, getDailyReport);
router.get('/:period', auth, getTimePeriodReport);

export default router;