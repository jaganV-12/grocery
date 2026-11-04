import express from 'express';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await dbAdapter.getCustomers();
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await dbAdapter.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, pendingBalance } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Customer name is required' });
    }
    const newCustomer = await dbAdapter.createCustomer({
      name,
      phone: phone || '',
      address: address || '',
      pendingBalance: Number(pendingBalance) || 0
    });
    res.status(201).json({ success: true, customer: newCustomer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const updated = await dbAdapter.updateCustomer(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, customer: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

