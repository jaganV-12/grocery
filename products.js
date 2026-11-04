import express from 'express';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await dbAdapter.getProducts();
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await dbAdapter.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const { name, tamilName, category, unit, purchasePrice, sellingPrice, stock, minimumStock, barcode } = req.body;
    if (!name || !unit) {
      return res.status(400).json({ success: false, error: 'Product name and unit are required' });
    }
    const newProduct = await dbAdapter.createProduct({
      name,
      tamilName: tamilName || '',
      category: category || 'General',
      unit,
      purchasePrice: Number(purchasePrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      stock: Number(stock) || 0,
      minimumStock: Number(minimumStock) || 10,
      barcode: barcode || ''
    });
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await dbAdapter.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await dbAdapter.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

