import express from 'express';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await dbAdapter.getPayments();
    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST settle customer pending dues
router.post('/settle', async (req, res) => {
  try {
    const { customerId, amount, paymentMethod = 'cash', notes = '' } = req.body;
    if (!customerId || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid customerId and positive amount are required.'
      });
    }

    const payment = await dbAdapter.recordCustomerPayment({
      customerId,
      amount: Number(amount),
      paymentMethod,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded and customer balance updated.',
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

