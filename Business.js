import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Murugan Maligai & Department Store'
  },
  tagline: {
    type: String,
    default: 'Daily Provisions & Fresh Essentials'
  },
  ownerName: {
    type: String,
    default: 'S. Murugan'
  },
  phone: {
    type: String,
    default: '+91 98421 23456'
  },
  alternatePhone: {
    type: String,
    default: '+91 94432 11000'
  },
  email: {
    type: String,
    default: 'muruganstore@gmail.com'
  },
  address: {
    type: String,
    default: '124, West Tower Street, Madurai, Tamil Nadu 625001'
  },
  gstin: {
    type: String,
    default: '33AAAAA0000A1Z5'
  },
  category: {
    type: String,
    default: 'Grocery & Department Store'
  },
  currency: {
    type: String,
    default: '₹'
  },
  avatarIcon: {
    type: String,
    default: '🏪'
  },
  preferredLanguage: {
    type: String,
    enum: ['ta', 'en'],
    default: 'ta'
  },
  aiProvider: {
    type: String,
    default: 'gemini'
  }
}, {
  timestamps: true
});

export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema);
export default Business;
