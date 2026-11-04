import express from 'express';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();

// GET business profile
router.get('/', async (req, res) => {
  try {
    const business = await dbAdapter.getBusinessProfile();
    res.json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update business profile
router.put('/', async (req, res) => {
  try {
    const updated = await dbAdapter.updateBusinessProfile(req.body);
    res.json({ success: true, business: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

