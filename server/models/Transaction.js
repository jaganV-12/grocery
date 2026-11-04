import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['sale', 'purchase'],
    default: 'sale'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    default: ''
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.01
  },
  unit: {
    type: String,
    default: 'kg'
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paid: {
    type: Number,
    default: 0,
    min: 0
  },
  pending: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'partial', 'pending'],
    default: 'paid'
  },
  paymentDueDate: {
    type: String,
    default: ''
  },
  inputMethod: {
    type: String,
    enum: ['voice', 'manual'],
    default: 'voice'
  },
  voiceTranscript: {
    type: String,
    default: ''
  },
  detectedLanguage: {
    type: String,
    default: 'en'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;

