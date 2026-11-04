# VoiceBiz AI — AI Business Management Startup

**VoiceBiz AI** is a professional, voice-first business management application designed for small Indian businesses (grocery stores, provisional shops, retail merchants, and local distributors). It allows business owners to manage daily sales, stock inventory, customer credit (Khata), and pending payments using **Tamil and English voice commands**.

---

## 🌟 Key Features

0. **Liquid Glass Authentication & Welcome Experience**
   - **Public Landing Page**: Dark `#080808` theme with glowing emerald `#19D3A2` lighting, AI microphone visual, and live floating glass panels for sales, stock, and Khata dues.
   - **Login Page**: Translucent glass card with email, password show/hide, remember me, forgot password modal, and **1-Click Demo Login**.
   - **Sign Up Page**: Full onboarding with business name, category, mobile, hashed password storage, and duplicate email validation.
   - **Session Persistence**: JWT token stored securely with auto-verification across browser refreshes.
   - **Protected Routes**: Unauthenticated users are gracefully routed to the Welcome experience.

1. **Dashboard**
   - Live metrics: **Today's Sales (₹)**, **Total Pending Payments (₹)**, **Total Inventory Value (₹)**, and **Low-Stock Alert items**.
   - Live recent transactions stream.
   - 1-click Demo Data reset for testing.

2. **AI Voice Assistant (Tamil & English)**
   - Large interactive microphone button with real-time audio wave pulses.
   - Dual-language support: **Tamil (`ta-IN`)** and **English (`en-IN`)**.
   - Real-time speech-to-text recognition with editable transcript fallback.
   - One-click sample voice command chips for instant testing.
   - **AI Transaction Preview**: Shows extracted Intent, Customer, Product, Quantity, Unit, Price, Total, and Payment terms.
   - **Backend Verification**: Verifies product existence in inventory, checks stock availability, warns of prior pending balances, and enforces owner confirmation before saving.

3. **Inventory Management**
   - Full CRUD operations: Product Name, Tamil Name, Category, Unit (kg, liter, packet, piece, box), Purchase Price, Selling Price, Available Stock, Minimum Stock Threshold.
   - Instant "+ Restock" quick action.
   - Real-time low-stock and out-of-stock badges.

4. **Customer Khata & Balance Ledger**
   - Customer name, phone, address, total purchases, paid amounts, and outstanding credit.
   - **Settle Dues modal**: Instantly record cash or UPI settlements, reducing customer debt in real-time.

5. **Payments & Invoices**
   - Chronological audit ledger of all sales.
   - Printable Tax Invoice / Bill receipts.
   - Filter by Paid, Pending, or Partial payments.

6. **Financial Reports & Analytics**
   - Sales volume, collection rate, Khata aging, top revenue-generating products, and print/export functionality.

7. **Resilient Data Architecture**
   - Connects to **MongoDB** via Mongoose when available (`MONGODB_URI`).
   - Built-in zero-friction persistent JSON storage fallback (`server/data/voicebiz_db.json`) if local MongoDB daemon is not running.
   - **Dual NLP Engine**: Built-in intelligent Tamil/English NLP parser + optional Google Gemini 1.5 Flash API.

## 🔐 Demo Credentials for Instant Login

- **Email**: `murugan@voicebiz.in`
- **Password**: `VoiceBiz@123`
- Or simply click the **"1-Click Demo Login"** button on the Login page!

---

## 🏗️ Architecture & Verification Flow

```
Owner speaks (Tamil / English)
         │
         ▼
  Speech to Text (Web Speech API)
         │
         ▼
  Backend AI Processing (Gemini / Built-in NLP)
         │
         ▼
  Backend Database Verification
    • Check stock availability
    • Check unit pricing
    • Check existing customer dues
         │
         ▼
  AI Transaction Preview Card
         │
         ▼
  Owner reviews & clicks "Confirm"
         │
         ▼
  Backend Updates Database
    • Stock deducted automatically
    • Customer ledger updated
    • Invoice & payment recorded
         │
         ▼
  Dashboard & Stock refreshed in real time!
```

---

## 🚀 Quick Start Guide (Windows & VS Code)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended — tested on Node v24)
- Visual Studio Code or your preferred editor
- Google Chrome or Microsoft Edge (recommended for Web Speech API microphone support)

### 1. Start the Backend API Server
```powershell
# Open terminal in project root
cd "c:\Users\VARUN COMPUTERS\Desktop\mini\VOICE AI\server"

# Install dependencies (if not already done)
npm install

# Start the server (runs on http://localhost:5000)
npm run dev
```

### 2. Start the Frontend React Client
```powershell
# Open a second terminal
cd "c:\Users\VARUN COMPUTERS\Desktop\mini\VOICE AI\client"

# Install dependencies (if not already done)
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

### 3. Open in Browser
Visit **`http://localhost:5173`** in Google Chrome or Microsoft Edge.

---

## 🎙️ Testing Voice Commands

### English Example
Click the microphone button and speak:
> *"Today Kumar purchased 10 kg rice for 600 rupees. He will pay tomorrow."*

- **Extracted**:
  - Customer: `Kumar`
  - Product: `Ponni Boiled Rice`
  - Quantity: `10 kg`
  - Total: `₹600`
  - Payment Status: `pending`
  - Due Date: `Tomorrow`
- **Verification**: Alerts that Kumar already has pending balance and stock will drop to 110 kg.
- Click **Confirm & Save Transaction** to finalize.

### Tamil Example
Select **🇮🇳 தமிழ்** language and click the microphone:
> *"இன்று குமார் 10 கிலோ அரிசி 600 ரூபாய்க்கு வாங்கினார். நாளை பணம் தருவார்."*

- **Extracted**:
  - வாடிக்கையாளர்: `Kumar`
  - பொருள்: `Ponni Boiled Rice`
  - அளவு: `10 kg`
  - தொகை: `₹600`
  - நிலை: `pending`

---

## 📁 Project Structure

```
VOICE AI/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Sidebar, Header, StatCard, VoiceMicButton, TransactionPreviewCard, Toast
│   │   ├── context/            # BusinessContext.jsx (global store)
│   │   ├── pages/              # Dashboard, VoiceAssistant, Inventory, Customers, Transactions, Reports, Settings
│   │   ├── services/           # api.js
│   │   ├── App.jsx             # Main App Shell
│   │   ├── index.css           # Professional SaaS design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── models/                 # Mongoose schemas (Product, Customer, Transaction, Payment, Business)
│   ├── routes/                 # dashboard, voice, products, customers, transactions, payments, business
│   ├── services/               # dbAdapter.js, aiParser.js
│   ├── data/                   # voicebiz_db.json (fallback persistent database)
│   ├── server.js               # Express application entry
│   ├── package.json
│   └── .env                    # Port, Mongo URI, Gemini Key
└── README.md
```

---

## ⚙️ Environment Configuration

In `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voicebiz
# Optional: Add Gemini API Key for Gemini 1.5 Flash processing
GEMINI_API_KEY=
```
*(If `GEMINI_API_KEY` is not provided, VoiceBiz AI automatically uses its built-in rule-based NLP parser, guaranteeing 100% functionality without setup barriers).*

