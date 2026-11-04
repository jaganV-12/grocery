import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import Payment from '../models/Payment.js';
import Business from '../models/Business.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'voicebiz_db.json');

// Default Indian grocery and retail seed data
const initialSeed = {
  users: [
    {
      _id: "user-001",
      name: "S. Murugan",
      businessName: "Murugan Maligai & Department Store",
      email: "murugan@voicebiz.in",
      phone: "+91 98421 23456",
      category: "Grocery & Department Store",
      password: "$2b$10$SKwNC1XMeuMUo2hg69zgKedyw0HMC2qHVvVs1S2v/EwtEWLgXhunu", // VoiceBiz@123
      role: "owner",
      createdAt: new Date().toISOString()
    }
  ],
  business: {
    _id: "biz-001",
    name: "Murugan Maligai & Department Store",
    ownerName: "S. Murugan",
    phone: "+91 98421 23456",
    email: "muruganstore@gmail.com",
    address: "124, West Tower Street, Madurai, Tamil Nadu 625001",
    gstin: "33AAAAA0000A1Z5",
    currency: "₹",
    preferredLanguage: "ta",
    aiProvider: "gemini"
  },
  products: [
    {
      _id: "prod-1",
      name: "Ponni Boiled Rice",
      tamilName: "பொன்னி புழுங்கல் அரிசி",
      category: "Grains & Rice",
      unit: "kg",
      purchasePrice: 48,
      sellingPrice: 60,
      stock: 120,
      minimumStock: 25,
      barcode: "8901001",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-2",
      name: "Toor Dal (Ooty Grade)",
      tamilName: "துவரம் பருப்பு",
      category: "Dals & Pulses",
      unit: "kg",
      purchasePrice: 140,
      sellingPrice: 165,
      stock: 8, // Low stock on purpose
      minimumStock: 15,
      barcode: "8901002",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-3",
      name: "Gold Winner Sunflower Oil",
      tamilName: "சூரியகாந்தி எண்ணெய்",
      category: "Oils & Ghee",
      unit: "liter",
      purchasePrice: 130,
      sellingPrice: 145,
      stock: 40,
      minimumStock: 10,
      barcode: "8901003",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-4",
      name: "Refined White Sugar",
      tamilName: "சர்க்கரை",
      category: "Staples",
      unit: "kg",
      purchasePrice: 38,
      sellingPrice: 44,
      stock: 50,
      minimumStock: 12,
      barcode: "8901004",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-5",
      name: "Aashirvaad Shudh Chakki Atta",
      tamilName: "ஆசீர்வாத் கோதுமை மாவு",
      category: "Flours",
      unit: "kg",
      purchasePrice: 45,
      sellingPrice: 55,
      stock: 35,
      minimumStock: 10,
      barcode: "8901005",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-6",
      name: "Tata Tea Gold 250g",
      tamilName: "டாடா டீ தூள்",
      category: "Beverages",
      unit: "packet",
      purchasePrice: 110,
      sellingPrice: 130,
      stock: 5, // Low stock on purpose
      minimumStock: 10,
      barcode: "8901006",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-7",
      name: "Aavin Blue Fresh Milk",
      tamilName: "ஆவின் பால்",
      category: "Dairy",
      unit: "packet",
      purchasePrice: 20,
      sellingPrice: 22,
      stock: 25,
      minimumStock: 5,
      barcode: "8901007",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-8",
      name: "Urad Dal (Split White)",
      tamilName: "உளுத்தம் பருப்பு",
      category: "Dals & Pulses",
      unit: "kg",
      purchasePrice: 120,
      sellingPrice: 145,
      stock: 0, // Out of Stock on purpose
      minimumStock: 15,
      barcode: "8901008",
      createdAt: new Date().toISOString()
    },
    {
      _id: "prod-9",
      name: "Parle-G Gold Biscuits (100g)",
      tamilName: "பார்லே-ஜி பிஸ்கட்",
      category: "Snacks",
      unit: "packet",
      purchasePrice: 10,
      sellingPrice: 12,
      stock: 0, // Out of Stock on purpose
      minimumStock: 20,
      barcode: "8901009",
      createdAt: new Date().toISOString()
    }
  ],
  customers: [
    {
      _id: "cust-1",
      name: "Kumar",
      phone: "+91 98401 23456",
      address: "Cross St 4, Madurai",
      totalPurchases: 3200,
      paidAmount: 2600,
      pendingBalance: 600,
      lastTransactionDate: new Date(Date.now() - 3600000 * 24).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      _id: "cust-2",
      name: "Priya",
      phone: "+91 97890 54321",
      address: "North Gate, Madurai",
      totalPurchases: 1850,
      paidAmount: 1850,
      pendingBalance: 0,
      lastTransactionDate: new Date(Date.now() - 3600000 * 12).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      _id: "cust-3",
      name: "Anitha",
      phone: "+91 94432 98765",
      address: "Main Road, Madurai",
      totalPurchases: 4500,
      paidAmount: 3300,
      pendingBalance: 1200,
      lastTransactionDate: new Date(Date.now() - 3600000 * 48).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      _id: "cust-4",
      name: "Karthik",
      phone: "+91 91234 56789",
      address: "East Gate, Madurai",
      totalPurchases: 1450,
      paidAmount: 1000,
      pendingBalance: 450,
      lastTransactionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      _id: "cust-5",
      name: "Guru",
      phone: "+91 98421 99887",
      address: "South Gate, Madurai",
      totalPurchases: 3500,
      paidAmount: 2700,
      pendingBalance: 800,
      lastTransactionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ],
  transactions: [
    {
      _id: "tx-1001",
      invoiceNumber: "INV-1001",
      type: "sale",
      customerId: "cust-1",
      customerName: "Kumar",
      customerPhone: "+91 98401 23456",
      productId: "prod-1",
      productName: "Ponni Boiled Rice",
      quantity: 10,
      unit: "kg",
      unitPrice: 60,
      total: 600,
      paid: 0,
      pending: 600,
      paymentStatus: "pending",
      paymentDueDate: "Tomorrow",
      inputMethod: "voice",
      voiceTranscript: "Today Kumar purchased 10 kg rice for 600 rupees. He will pay tomorrow.",
      detectedLanguage: "en",
      notes: "Voice bill - credit sale",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      _id: "tx-1002",
      invoiceNumber: "INV-1002",
      type: "sale",
      customerId: "cust-2",
      customerName: "Priya",
      customerPhone: "+91 97890 54321",
      productId: "prod-3",
      productName: "Gold Winner Sunflower Oil",
      quantity: 2,
      unit: "liter",
      unitPrice: 145,
      total: 290,
      paid: 290,
      pending: 0,
      paymentStatus: "paid",
      paymentDueDate: "Immediate (Cash)",
      inputMethod: "voice",
      voiceTranscript: "பிரியா 2 லிட்டர் சூரியகாந்தி எண்ணெய் 290 ரூபாய்க்கு ரொக்கமாக வாங்கினார்",
      detectedLanguage: "ta",
      notes: "Cash settled",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      _id: "tx-1003",
      invoiceNumber: "INV-1003",
      type: "sale",
      customerId: "cust-4",
      customerName: "Karthik",
      customerPhone: "+91 91234 56789",
      productId: "prod-5",
      productName: "Aashirvaad Shudh Chakki Atta",
      quantity: 5,
      unit: "kg",
      unitPrice: 55,
      total: 275,
      paid: 275,
      pending: 0,
      paymentStatus: "paid",
      paymentDueDate: "Immediate (UPI)",
      inputMethod: "manual",
      voiceTranscript: "",
      detectedLanguage: "en",
      notes: "GPay payment",
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      _id: "tx-1004",
      invoiceNumber: "INV-1004",
      type: "sale",
      customerId: "cust-1",
      customerName: "Kumar",
      customerPhone: "+91 98401 23456",
      productId: "prod-1",
      productName: "Ponni Boiled Rice",
      quantity: 25,
      unit: "kg",
      unitPrice: 60,
      total: 1500,
      paid: 1500,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "manual",
      createdAt: "2026-10-24T10:15:00.000Z"
    },
    {
      _id: "tx-1005",
      invoiceNumber: "INV-1005",
      type: "sale",
      customerId: "cust-2",
      customerName: "Priya",
      productId: "prod-3",
      productName: "Gold Winner Sunflower Oil",
      quantity: 10,
      unit: "liter",
      unitPrice: 145,
      total: 1450,
      paid: 1450,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "voice",
      createdAt: "2026-10-18T16:30:00.000Z"
    },
    {
      _id: "tx-1006",
      invoiceNumber: "INV-1006",
      type: "sale",
      customerId: "cust-3",
      customerName: "Anitha",
      productId: "prod-4",
      productName: "Refined White Sugar",
      quantity: 15,
      unit: "kg",
      unitPrice: 44,
      total: 660,
      paid: 660,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "manual",
      createdAt: "2026-10-10T11:20:00.000Z"
    },
    {
      _id: "tx-1007",
      invoiceNumber: "INV-1007",
      type: "sale",
      customerId: "cust-4",
      customerName: "Karthik",
      productId: "prod-2",
      productName: "Toor Dal (Ooty Grade)",
      quantity: 10,
      unit: "kg",
      unitPrice: 165,
      total: 1650,
      paid: 1650,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "voice",
      createdAt: "2026-10-05T09:45:00.000Z"
    },
    {
      _id: "tx-1008",
      invoiceNumber: "INV-1008",
      type: "sale",
      customerId: "cust-1",
      customerName: "Kumar",
      productId: "prod-1",
      productName: "Ponni Boiled Rice",
      quantity: 20,
      unit: "kg",
      unitPrice: 60,
      total: 1200,
      paid: 1200,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "manual",
      createdAt: "2026-09-28T14:10:00.000Z"
    },
    {
      _id: "tx-1009",
      invoiceNumber: "INV-1009",
      type: "sale",
      customerId: "cust-2",
      customerName: "Priya",
      productId: "prod-6",
      productName: "Tata Tea Gold 250g",
      quantity: 8,
      unit: "packet",
      unitPrice: 130,
      total: 1040,
      paid: 1040,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "voice",
      createdAt: "2026-09-20T17:05:00.000Z"
    },
    {
      _id: "tx-1010",
      invoiceNumber: "INV-1010",
      type: "sale",
      customerId: "cust-3",
      customerName: "Anitha",
      productId: "prod-5",
      productName: "Aashirvaad Shudh Chakki Atta",
      quantity: 12,
      unit: "kg",
      unitPrice: 55,
      total: 660,
      paid: 660,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "manual",
      createdAt: "2026-09-12T12:00:00.000Z"
    },
    {
      _id: "tx-1011",
      invoiceNumber: "INV-1011",
      type: "sale",
      customerId: "cust-4",
      customerName: "Karthik",
      productId: "prod-3",
      productName: "Gold Winner Sunflower Oil",
      quantity: 6,
      unit: "liter",
      unitPrice: 145,
      total: 870,
      paid: 870,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "voice",
      createdAt: "2026-09-03T18:40:00.000Z"
    },
    {
      _id: "tx-1012",
      invoiceNumber: "INV-1012",
      type: "sale",
      customerId: "cust-1",
      customerName: "Kumar",
      productId: "prod-1",
      productName: "Ponni Boiled Rice",
      quantity: 30,
      unit: "kg",
      unitPrice: 60,
      total: 1800,
      paid: 1800,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "manual",
      createdAt: "2026-08-25T15:20:00.000Z"
    },
    {
      _id: "tx-1013",
      invoiceNumber: "INV-1013",
      type: "sale",
      customerId: "cust-2",
      customerName: "Priya",
      productId: "prod-2",
      productName: "Toor Dal (Ooty Grade)",
      quantity: 8,
      unit: "kg",
      unitPrice: 165,
      total: 1320,
      paid: 1320,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "voice",
      createdAt: "2026-08-14T11:10:00.000Z"
    },
    {
      _id: "tx-1014",
      invoiceNumber: "INV-1014",
      type: "sale",
      customerId: "cust-5",
      customerName: "Guru",
      productId: "prod-4",
      productName: "Refined White Sugar",
      quantity: 20,
      unit: "kg",
      unitPrice: 44,
      total: 880,
      paid: 880,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "voice",
      createdAt: "2026-08-08T13:30:00.000Z"
    },
    {
      _id: "tx-1015",
      invoiceNumber: "INV-1015",
      type: "sale",
      customerId: "cust-4",
      customerName: "Karthik",
      productId: "prod-3",
      productName: "Gold Winner Sunflower Oil",
      quantity: 12,
      unit: "liter",
      unitPrice: 145,
      total: 1740,
      paid: 1740,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "manual",
      createdAt: "2026-07-22T10:00:00.000Z"
    },
    {
      _id: "tx-1016",
      invoiceNumber: "INV-1016",
      type: "sale",
      customerId: "cust-3",
      customerName: "Anitha",
      productId: "prod-1",
      productName: "Ponni Boiled Rice",
      quantity: 15,
      unit: "kg",
      unitPrice: 60,
      total: 900,
      paid: 900,
      pending: 0,
      paymentStatus: "paid",
      inputMethod: "manual",
      createdAt: "2026-07-11T16:15:00.000Z"
    }
  ],
  payments: [
    {
      _id: "pay-1",
      customerId: "cust-2",
      customerName: "Priya",
      transactionId: "tx-1002",
      amount: 290,
      paymentMethod: "cash",
      notes: "Instant cash payment",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      _id: "pay-2",
      customerId: "cust-4",
      customerName: "Karthik",
      transactionId: "tx-1003",
      amount: 275,
      paymentMethod: "upi",
      notes: "UPI payment received",
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ]
};

// Check if MongoDB is connected
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Local File DB helper functions
function readLocalDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf8');
      return initialSeed;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.users) {
      parsed.users = [...initialSeed.users];
      writeLocalDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return initialSeed;
  }
}

function writeLocalDb(data) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local JSON db:', err);
  }
}

export const dbAdapter = {
  isMongoActive: () => isMongoConnected(),

  // PRODUCTS
  async getProducts() {
    if (isMongoConnected()) {
      return await Product.find().sort({ createdAt: -1 });
    }
    const db = readLocalDb();
    return db.products.map(p => ({
      ...p,
      isLowStock: p.stock <= p.minimumStock
    }));
  },

  async getProductById(id) {
    if (isMongoConnected()) {
      return await Product.findById(id);
    }
    const db = readLocalDb();
    return db.products.find(p => p._id === id || p.id === id);
  },

  async findProductByName(name) {
    if (!name) return null;
    const cleanName = name.toLowerCase().trim();
    if (isMongoConnected()) {
      return await Product.findOne({
        $or: [
          { name: { $regex: cleanName, $options: 'i' } },
          { tamilName: { $regex: cleanName, $options: 'i' } }
        ]
      });
    }
    const db = readLocalDb();
    return db.products.find(p => 
      p.name.toLowerCase().includes(cleanName) || 
      (p.tamilName && p.tamilName.toLowerCase().includes(cleanName)) ||
      cleanName.includes(p.name.toLowerCase()) ||
      (p.tamilName && cleanName.includes(p.tamilName.toLowerCase()))
    );
  },

  async createProduct(data) {
    if (isMongoConnected()) {
      const prod = new Product(data);
      return await prod.save();
    }
    const db = readLocalDb();
    const newProd = {
      _id: 'prod-' + Date.now(),
      ...data,
      stock: Number(data.stock) || 0,
      minimumStock: Number(data.minimumStock) || 10,
      purchasePrice: Number(data.purchasePrice) || 0,
      sellingPrice: Number(data.sellingPrice) || 0,
      createdAt: new Date().toISOString()
    };
    db.products.unshift(newProd);
    writeLocalDb(db);
    return newProd;
  },

  async updateProduct(id, updates) {
    if (isMongoConnected()) {
      return await Product.findByIdAndUpdate(id, updates, { new: true });
    }
    const db = readLocalDb();
    const idx = db.products.findIndex(p => p._id === id || p.id === id);
    if (idx !== -1) {
      db.products[idx] = { 
        ...db.products[idx], 
        ...updates,
        stock: updates.stock !== undefined ? Number(updates.stock) : db.products[idx].stock,
        sellingPrice: updates.sellingPrice !== undefined ? Number(updates.sellingPrice) : db.products[idx].sellingPrice,
        purchasePrice: updates.purchasePrice !== undefined ? Number(updates.purchasePrice) : db.products[idx].purchasePrice,
        minimumStock: updates.minimumStock !== undefined ? Number(updates.minimumStock) : db.products[idx].minimumStock
      };
      writeLocalDb(db);
      return db.products[idx];
    }
    return null;
  },

  async deleteProduct(id) {
    if (isMongoConnected()) {
      return await Product.findByIdAndDelete(id);
    }
    const db = readLocalDb();
    const prevLen = db.products.length;
    db.products = db.products.filter(p => p._id !== id && p.id !== id);
    writeLocalDb(db);
    return prevLen !== db.products.length;
  },

  // CUSTOMERS
  async getCustomers() {
    if (isMongoConnected()) {
      return await Customer.find().sort({ updatedAt: -1 });
    }
    const db = readLocalDb();
    return db.customers;
  },

  async getCustomerById(id) {
    if (isMongoConnected()) {
      return await Customer.findById(id);
    }
    const db = readLocalDb();
    return db.customers.find(c => c._id === id || c.id === id);
  },

  async findCustomerByName(name) {
    if (!name) return null;
    const cleanName = name.toLowerCase().trim();
    if (isMongoConnected()) {
      return await Customer.findOne({
        name: { $regex: cleanName, $options: 'i' }
      });
    }
    const db = readLocalDb();
    // 1. Exact match first
    const exact = db.customers.find(c => c.name.toLowerCase() === cleanName);
    if (exact) return exact;
    // 2. Contains match
    return db.customers.find(c => 
      c.name.toLowerCase().includes(cleanName) || 
      cleanName.includes(c.name.toLowerCase())
    );
  },

  async createCustomer(data) {
    if (isMongoConnected()) {
      const cust = new Customer(data);
      return await cust.save();
    }
    const db = readLocalDb();
    const newCust = {
      _id: 'cust-' + Date.now(),
      name: data.name,
      phone: data.phone || '',
      address: data.address || '',
      totalPurchases: Number(data.totalPurchases) || 0,
      paidAmount: Number(data.paidAmount) || 0,
      pendingBalance: Number(data.pendingBalance) || 0,
      lastTransactionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    db.customers.unshift(newCust);
    writeLocalDb(db);
    return newCust;
  },

  async updateCustomer(id, updates) {
    if (isMongoConnected()) {
      return await Customer.findByIdAndUpdate(id, updates, { new: true });
    }
    const db = readLocalDb();
    const idx = db.customers.findIndex(c => c._id === id || c.id === id);
    if (idx !== -1) {
      db.customers[idx] = { ...db.customers[idx], ...updates };
      writeLocalDb(db);
      return db.customers[idx];
    }
    return null;
  },

  // TRANSACTIONS
  async getTransactions(limit = 200) {
    if (isMongoConnected()) {
      return await Transaction.find().sort({ createdAt: -1 }).limit(limit);
    }
    const db = readLocalDb();
    return db.transactions.slice(0, limit);
  },

  async createTransaction(txData) {
    const invoiceNumber = txData.invoiceNumber || ('INV-' + Math.floor(1000 + Math.random() * 9000));
    
    // Core Business Logic:
    // 1. Check & Deduct Product Stock
    let matchedProduct = null;
    if (txData.productId) {
      matchedProduct = await this.getProductById(txData.productId);
    } else if (txData.productName) {
      matchedProduct = await this.findProductByName(txData.productName);
    }

    if (matchedProduct) {
      const newStock = Math.max(0, matchedProduct.stock - Number(txData.quantity));
      await this.updateProduct(matchedProduct._id, { stock: newStock });
      txData.productId = matchedProduct._id;
      txData.productName = matchedProduct.name;
    }

    // 2. Customer Update / Creation
    let matchedCustomer = null;
    if (txData.customerId) {
      matchedCustomer = await this.getCustomerById(txData.customerId);
    } else if (txData.customerName) {
      matchedCustomer = await this.findCustomerByName(txData.customerName);
    }

    const totalAmt = Number(txData.total) || 0;
    const paidAmt = Number(txData.paid) || 0;
    const pendingAmt = Number(txData.pending) !== undefined ? Number(txData.pending) : (totalAmt - paidAmt);

    if (matchedCustomer) {
      await this.updateCustomer(matchedCustomer._id, {
        totalPurchases: (Number(matchedCustomer.totalPurchases) || 0) + totalAmt,
        paidAmount: (Number(matchedCustomer.paidAmount) || 0) + paidAmt,
        pendingBalance: (Number(matchedCustomer.pendingBalance) || 0) + pendingAmt,
        lastTransactionDate: new Date().toISOString()
      });
      txData.customerId = matchedCustomer._id;
      txData.customerName = matchedCustomer.name;
    } else if (txData.customerName) {
      const newCust = await this.createCustomer({
        name: txData.customerName,
        phone: txData.customerPhone || '',
        totalPurchases: totalAmt,
        paidAmount: paidAmt,
        pendingBalance: pendingAmt
      });
      txData.customerId = newCust._id;
    }

    const finalTx = {
      ...txData,
      invoiceNumber,
      total: totalAmt,
      paid: paidAmt,
      pending: pendingAmt,
      paymentStatus: pendingAmt <= 0 ? 'paid' : (paidAmt > 0 ? 'partial' : 'pending'),
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const tx = new Transaction(finalTx);
      const savedTx = await tx.save();

      // If payment recorded, create payment row
      if (paidAmt > 0) {
        const pay = new Payment({
          customerId: finalTx.customerId,
          customerName: finalTx.customerName,
          transactionId: savedTx._id,
          amount: paidAmt,
          paymentMethod: 'cash',
          notes: 'Invoice ' + invoiceNumber
        });
        await pay.save();
      }

      return savedTx;
    }

    // Local DB save
    const db = readLocalDb();
    const newRecord = {
      _id: 'tx-' + Date.now(),
      ...finalTx
    };
    db.transactions.unshift(newRecord);

    if (paidAmt > 0) {
      db.payments.unshift({
        _id: 'pay-' + Date.now(),
        customerId: finalTx.customerId,
        customerName: finalTx.customerName,
        transactionId: newRecord._id,
        amount: paidAmt,
        paymentMethod: 'cash',
        notes: 'Invoice ' + invoiceNumber,
        createdAt: new Date().toISOString()
      });
    }

    writeLocalDb(db);
    return newRecord;
  },

  // PAYMENTS (e.g. Settle customer pending dues)
  async getPayments() {
    if (isMongoConnected()) {
      return await Payment.find().sort({ createdAt: -1 });
    }
    const db = readLocalDb();
    return db.payments;
  },

  async recordCustomerPayment({ customerId, amount, paymentMethod = 'cash', notes = '' }) {
    const amt = Number(amount);
    const customer = await this.getCustomerById(customerId);
    if (!customer) throw new Error('Customer not found');

    const newPending = Math.max(0, (Number(customer.pendingBalance) || 0) - amt);
    const newPaid = (Number(customer.paidAmount) || 0) + amt;

    await this.updateCustomer(customerId, {
      paidAmount: newPaid,
      pendingBalance: newPending,
      lastTransactionDate: new Date().toISOString()
    });

    if (isMongoConnected()) {
      const pay = new Payment({
        customerId,
        customerName: customer.name,
        amount: amt,
        paymentMethod,
        notes: notes || 'Settlement payment'
      });
      return await pay.save();
    }

    const db = readLocalDb();
    const paymentRecord = {
      _id: 'pay-' + Date.now(),
      customerId,
      customerName: customer.name,
      amount: amt,
      paymentMethod,
      notes: notes || 'Settlement payment',
      createdAt: new Date().toISOString()
    };
    db.payments.unshift(paymentRecord);
    writeLocalDb(db);
    return paymentRecord;
  },

  // BUSINESS SETTINGS
  async getBusinessProfile() {
    if (isMongoConnected()) {
      let b = await Business.findOne();
      if (!b) {
        b = new Business(initialSeed.business);
        await b.save();
      }
      return b;
    }
    const db = readLocalDb();
    return db.business || initialSeed.business;
  },

  async updateBusinessProfile(updates) {
    if (isMongoConnected()) {
      return await Business.findOneAndUpdate({}, updates, { new: true, upsert: true });
    }
    const db = readLocalDb();
    db.business = { ...db.business, ...updates };
    writeLocalDb(db);
    return db.business;
  },

  // DASHBOARD AGGREGATE STATS
  async getDashboardStats() {
    const products = await this.getProducts();
    const customers = await this.getCustomers();
    const transactions = await this.getTransactions(100);

    // Today's boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todaySales = 0;
    let todayOrdersCount = 0;

    transactions.forEach(t => {
      const tDate = new Date(t.createdAt);
      if (tDate >= today) {
        todaySales += Number(t.total) || 0;
        todayOrdersCount++;
      }
    });

    // Total pending across all customers
    const totalPendingPayments = customers.reduce((acc, c) => acc + (Number(c.pendingBalance) || 0), 0);

    // Total inventory value (stock * purchasePrice or sellingPrice)
    const totalInventoryValue = products.reduce((acc, p) => acc + ((Number(p.stock) || 0) * (Number(p.sellingPrice) || 0)), 0);

    // Separated Stock Health: Out of Stock (0 or less) vs Low Stock (1 to minStock)
    const outOfStockProducts = products.filter(p => Number(p.stock) <= 0);
    const lowStockProducts = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));

    // Recent 5 transactions
    const recentTransactions = transactions.slice(0, 5);

    return {
      todaySales,
      todayOrdersCount,
      totalPendingPayments,
      totalInventoryValue,
      outOfStockCount: outOfStockProducts.length,
      outOfStockProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      totalAlertsCount: outOfStockProducts.length + lowStockProducts.length,
      recentTransactions,
      totalProductsCount: products.length,
      totalCustomersCount: customers.length,
      isMongoActive: isMongoConnected()
    };
  },

  // USERS & AUTHENTICATION
  async getUsers() {
    if (isMongoConnected()) {
      return await User.find();
    }
    const db = readLocalDb();
    return db.users || initialSeed.users || [];
  },

  async findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected()) {
      return await User.findOne({ email: cleanEmail });
    }
    const db = readLocalDb();
    const users = db.users || initialSeed.users || [];
    return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async createUser(userData) {
    const cleanEmail = userData.email.toLowerCase().trim();
    if (isMongoConnected()) {
      const user = new User({ ...userData, email: cleanEmail });
      return await user.save();
    }
    const db = readLocalDb();
    if (!db.users) db.users = [...(initialSeed.users || [])];
    const newUser = {
      _id: 'user-' + Date.now(),
      name: userData.name,
      businessName: userData.businessName,
      email: cleanEmail,
      phone: userData.phone || '',
      category: userData.category || 'Grocery & Department Store',
      password: userData.password,
      role: userData.role || 'owner',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeLocalDb(db);
    return newUser;
  },

  async getUserById(id) {
    if (isMongoConnected()) {
      return await User.findById(id);
    }
    const db = readLocalDb();
    const users = db.users || initialSeed.users || [];
    return users.find(u => u._id === id || u.id === id) || null;
  },

  // RESET TO DEMO DATA
  async resetToDemo() {
    if (isMongoConnected()) {
      await User.deleteMany({});
      await Product.deleteMany({});
      await Customer.deleteMany({});
      await Transaction.deleteMany({});
      await Payment.deleteMany({});
      await Business.deleteMany({});

      await User.insertMany(initialSeed.users);
      await Product.insertMany(initialSeed.products);
      await Customer.insertMany(initialSeed.customers);
      await Transaction.insertMany(initialSeed.transactions);
      await Payment.insertMany(initialSeed.payments);
      await Business.create(initialSeed.business);
      return { success: true, mode: 'mongo' };
    }
    writeLocalDb(initialSeed);
    return { success: true, mode: 'local' };
  }
};

export default dbAdapter;

