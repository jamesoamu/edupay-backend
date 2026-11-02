import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './src/routes/api.ts';

dotenv.config();

export const backendApp = express();
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '3000', 10);

// Enable CORS for external frontends (e.g. running on Vercel, localhost:5173, etc.)
backendApp.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

backendApp.use(express.json());

// Mount API routes
backendApp.use('/api', apiRouter);

// Root informative endpoint
backendApp.get('/', (_req, res) => {
  res.json({
    service: 'EduPay Tracker Backend Service',
    description: 'PostgreSQL Relational DB & Paystack Billing API Server',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/docs',
    healthCheck: '/api/health',
    endpoints: {
      dashboard: '/api/dashboard',
      students: '/api/students',
      payments: '/api/payments',
      feeStructures: '/api/fee-structures',
      subscriptions: '/api/subscriptions',
      reminders: '/api/reminders',
      paystackInitialize: '/api/paystack/initialize',
      paystackVerify: '/api/paystack/verify',
      paystackWebhook: '/api/webhooks/paystack',
    },
  });
});

// If run directly (e.g., node backend/server.ts or tsx backend/server.ts)
if (process.argv[1]?.endsWith('server.ts') && !process.env.EMBEDDED_DEV_MODE) {
  backendApp.listen(BACKEND_PORT, '0.0.0.0', () => {
    console.log(`EduPay Dedicated Backend running at http://0.0.0.0:${BACKEND_PORT}`);
  });
}
