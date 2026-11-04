import express from 'express';
import { extractTransactionFromSpeech } from '../services/aiParser.js';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();

/**
 * POST /api/voice/process
 * Body: { transcript: string, language: 'ta' | 'en' | 'auto', apiKey?: string }
 * Returns structured transaction preview with backend validation
 */
router.post('/process', async (req, res) => {
  try {
    const { transcript, language = 'auto', apiKey } = req.body;

    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Transcript is required. Please speak or type a transaction command.'
      });
    }

    // 1. AI / NLP extraction
    const extracted = await extractTransactionFromSpeech(transcript, language, apiKey);

    // 2. Backend verification against actual Database
    const validationWarnings = [];
    const validationErrors = [];

    // Check product in inventory
    let matchedProduct = null;
    if (extracted.product) {
      matchedProduct = await dbAdapter.findProductByName(extracted.product);
    }

    let inventoryInfo = null;
    if (matchedProduct) {
      inventoryInfo = {
        productId: matchedProduct._id,
        matchedName: matchedProduct.name,
        availableStock: matchedProduct.stock,
        unit: matchedProduct.unit,
        catalogSellingPrice: matchedProduct.sellingPrice,
        minimumStock: matchedProduct.minimumStock
      };

      // Check stock availability
      if (matchedProduct.stock < extracted.quantity) {
        validationWarnings.push(
          `Insufficient stock alert! Requested ${extracted.quantity} ${extracted.unit}, but only ${matchedProduct.stock} ${matchedProduct.unit} available in inventory.`
        );
      } else if (matchedProduct.stock - extracted.quantity <= matchedProduct.minimumStock) {
        validationWarnings.push(
          `Low stock warning: Remaining stock after this sale will be ${matchedProduct.stock - extracted.quantity} ${matchedProduct.unit}.`
        );
      }

      // Check price divergence
      const expectedTotal = matchedProduct.sellingPrice * extracted.quantity;
      if (extracted.total && Math.abs(extracted.total - expectedTotal) > 5) {
        validationWarnings.push(
          `Catalog price is ₹${matchedProduct.sellingPrice}/${matchedProduct.unit} (Expected ₹${expectedTotal}), but voice input specified ₹${extracted.total}.`
        );
      }
    } else {
      validationWarnings.push(
        `Product "${extracted.product}" not found in current inventory. A new entry can be created or matched upon confirmation.`
      );
    }

    // Check customer in database
    let matchedCustomer = null;
    if (extracted.customer) {
      matchedCustomer = await dbAdapter.findCustomerByName(extracted.customer);
    }

    let customerInfo = null;
    if (matchedCustomer) {
      const currentPending = Number(matchedCustomer.pendingBalance) || 0;
      const additionalPending = extracted.payment_status === 'pending' 
        ? (Number(extracted.pending) || Number(extracted.total) || 0) 
        : 0;
      const newEstimatedPending = currentPending + additionalPending;

      customerInfo = {
        customerId: matchedCustomer._id,
        matchedName: matchedCustomer.name,
        phone: matchedCustomer.phone,
        currentPendingBalance: currentPending,
        newEstimatedPendingBalance: newEstimatedPending,
        totalPurchases: matchedCustomer.totalPurchases,
        lastTransactionDate: matchedCustomer.lastTransactionDate,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };

      if (matchedCustomer.pendingBalance > 0 && extracted.payment_status === 'pending') {
        validationWarnings.push(
          `Customer ${matchedCustomer.name} has existing balance ₹${matchedCustomer.pendingBalance}. With this transaction, total pending will be ₹${newEstimatedPending}.`
        );
      }
    } else {
      const pendingVal = extracted.payment_status === 'pending' ? (Number(extracted.pending) || Number(extracted.total) || 0) : 0;
      customerInfo = {
        isNewCustomer: true,
        name: extracted.customer,
        currentPendingBalance: 0,
        newEstimatedPendingBalance: pendingVal,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };
      validationWarnings.push(
        `Customer "${extracted.customer}" is not yet in records. A new ledger profile will be created with initial balance ₹${pendingVal}.`
      );
    }

    // Quantity sanity check
    if (extracted.quantity <= 0) {
      extracted.quantity = 1;
    }

    // Price sanity check
    if (extracted.total <= 0 && (!extracted.price || extracted.price <= 0)) {
      validationErrors.push('Total amount or unit price must be greater than zero.');
    }

    const preview = {
      ...extracted,
      rawTranscript: transcript,
      detectedLanguage: language,
      matchedProduct: inventoryInfo,
      matchedCustomer: customerInfo,
      formattedDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      timestamp: new Date().toISOString(),
      validation: {
        canConfirm: validationErrors.length === 0,
        errors: validationErrors,
        warnings: validationWarnings,
        hasWarnings: validationWarnings.length > 0
      }
    };

    return res.json({
      success: true,
      preview
    });

  } catch (error) {
    console.error('Voice process route error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error processing voice transaction: ' + error.message
    });
  }
});

export default router;

