import express from 'express';
import weatherController from '../controllers/weatherController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import cache from '../config/cache.js';

const router = express.Router();

// Weather endpoint - requires authentication
router.get('/weather', authMiddleware, weatherController.getWeatherDashboard);

// Cache status debug endpoint
router.get('/cache/status', (req, res) => {
  const stats = cache.getStats();
  const keys = cache.keys();
  res.json({ stats, keys });
});

export default router;
