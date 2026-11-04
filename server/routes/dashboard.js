import express from 'express';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();

// GET dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await dbAdapter.getDashboardStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST reset to sample demo data
router.post('/reset-demo', async (req, res) => {
  try {
    const result = await dbAdapter.resetToDemo();
    res.json({ success: true, message: 'Sample demo data reloaded successfully', result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

