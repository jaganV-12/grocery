import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  totalPurchases: {
    type: Number,
    default: 0,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  lastTransactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;

