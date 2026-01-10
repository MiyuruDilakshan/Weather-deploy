import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import weatherRoutes from './routes/index.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://weather.miyuru.dev'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', weatherRoutes);
app.use('/', weatherRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;