import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank', 'other'],
    default: 'cash'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;

