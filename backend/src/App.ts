import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/error.middleware';
import router from './routes';
import logger from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Routes
app.use('/api', router);

// Error handling
app.use(notFound);
app.use(errorHandler);

// ✅ Start the server
app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
