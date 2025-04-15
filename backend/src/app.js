import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import rutaRoutes from './routes/rutaRoutes.js';

// 加载环境变量
dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.json({
    message: 'VoltPilot API Server',
    version: '1.0.0',
    status: 'active'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routing', rutaRoutes);

// 404 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '404 Not Found',
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;