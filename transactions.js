import express from 'express';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();

// GET transactions
router.get('/', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 200;
    const transactions = await dbAdapter.getTransactions(limit);
    res.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST confirm and create transaction (Core Business Logic)
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      productId,
      productName,
      quantity,
      unit,
      unitPrice,
      total,
      paid,
      pending,
      paymentStatus,
      paymentDueDate,
      inputMethod = 'voice',
      voiceTranscript = '',
      detectedLanguage = 'en',
      notes = ''
    } = req.body;

    if (!customerName || !productName || quantity === undefined || total === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required transaction fields: customerName, productName, quantity, and total.'
      });
    }

    if (Number(quantity) <= 0 || Number(total) < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than zero and total cannot be negative.'
      });
    }

    const calculatedUnitPrice = Number(unitPrice) || (Number(total) / Number(quantity));

    const transaction = await dbAdapter.createTransaction({
      customerId,
      customerName,
      customerPhone,
      productId,
      productName,
      quantity: Number(quantity),
      unit: unit || 'kg',
      unitPrice: calculatedUnitPrice,
      total: Number(total),
      paid: Number(paid) || 0,
      pending: Number(pending) !== undefined ? Number(pending) : (Number(total) - (Number(paid) || 0)),
      paymentStatus: paymentStatus || (Number(pending) <= 0 ? 'paid' : 'pending'),
      paymentDueDate: paymentDueDate || (paymentStatus === 'pending' ? 'Tomorrow' : 'Immediate'),
      inputMethod,
      voiceTranscript,
      detectedLanguage,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Transaction verified and recorded successfully. Stock and ledger updated.',
      transaction
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

