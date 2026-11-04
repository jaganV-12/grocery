import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';

import dashboardRoutes from './routes/dashboard.js';
import voiceRoutes from './routes/voice.js';
import productRoutes from './routes/products.js';
import customerRoutes from './routes/customers.js';
import transactionRoutes from './routes/transactions.js';
import paymentRoutes from './routes/payments.js';
import businessRoutes from './routes/business.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voicebiz';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection with seamless fallback
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2000,
})
.then(() => {
  console.log('✅ Connected to MongoDB at:', MONGODB_URI);
})
.catch((err) => {
  console.warn('⚠️  MongoDB local service not detected (or connection timed out).');
  console.log('💡 VoiceBiz AI active with persistent JSON data storage fallback.');
  console.log('   (To use MongoDB, start mongod or set MONGODB_URI in server/.env)');
});

// API Routes (Mounted at both /api/* and /* for Vercel Serverless compatibility)
app.use('/api/dashboard', dashboardRoutes);
app.use('/dashboard', dashboardRoutes);

app.use('/api/voice', voiceRoutes);
app.use('/voice', voiceRoutes);

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/customers', customerRoutes);
app.use('/customers', customerRoutes);

app.use('/api/transactions', transactionRoutes);
app.use('/transactions', transactionRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/payments', paymentRoutes);

app.use('/api/business', businessRoutes);
app.use('/business', businessRoutes);

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    app: 'VoiceBiz AI Server',
    time: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 VoiceBiz AI Server running on http://localhost:${PORT}`);
  });
}

export default app;

