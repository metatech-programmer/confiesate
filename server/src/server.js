import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import publicationRoutes from './routes/publicationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

// Import error handler
import { errorMiddleware } from './utils/errorHandler.js';

// Environment variables configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/publications', publicationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;