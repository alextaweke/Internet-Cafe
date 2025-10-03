import { Router } from 'express';
import authRouter from './auth.routes';
import computerRouter from './computer.routes';
import sessionRouter from './session.routes';
import reportRouter from './report.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/computers', computerRouter);
router.use('/sessions', sessionRouter);
router.use('/reports', reportRouter);

export default router;