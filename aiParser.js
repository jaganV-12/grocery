import { GoogleGenerativeAI } from '@google/generative-ai';

// Tamil to English customer name dictionary for cross-matching
const TAMIL_NAME_MAP = {
  'குரு': 'Guru',
  'குருசாமி': 'Gurusamy',
  'குருபிரசாத்': 'Guru',
  'குமார்': 'Kumar',
  'பிரியா': 'Priya',
  'அனிதா': 'Anitha',
  'கார்த்திக்': 'Karthik',
  'முருகன்': 'Murugan',
  'ரமேஷ்': 'Ramesh',
  'சுரேஷ்': 'Suresh',
  'ராஜா': 'Raja',
  'விஜய்': 'Vijay',
  'செல்வம்': 'Selvam',
  'சரவணன்': 'Saravanan',
  'தினேஷ்': 'Dinesh',
  'பாலா': 'Bala',
  'மணிகண்டன்': 'Manikandan',
  'ரவி': 'Ravi',
  'தீபா': 'Deepa',
  'மீனா': 'Meena',
  'சங்கீதா': 'Sangeetha',
  'கோபால்': 'Gopal'
};

const TAMIL_PRODUCT_MAP = {
  'அரிசி': 'Ponni Boiled Rice',
  'பொன்னி அரிசி': 'Ponni Boiled Rice',
  'புழுங்கல் அரிசி': 'Ponni Boiled Rice',
  'பருப்பு': 'Toor Dal (Ooty Grade)',
  'துவரம் பருப்பு': 'Toor Dal (Ooty Grade)',
  'துவரம்பருப்பு': 'Toor Dal (Ooty Grade)',
  'எண்ணெய்': 'Gold Winner Sunflower Oil',
  'சூரியகாந்தி எண்ணெய்': 'Gold Winner Sunflower Oil',
  'சர்க்கரை': 'Refined White Sugar',
  'சீனி': 'Refined White Sugar',
  'மாவு': 'Aashirvaad Shudh Chakki Atta',
  'கோதுமை மாவு': 'Aashirvaad Shudh Chakki Atta',
  'டீ தூள்': 'Tata Tea Gold 250g',
  'டீத்தூள்': 'Tata Tea Gold 250g',
  'டீ': 'Tata Tea Gold 250g',
  'பால்': 'Aavin Blue Fresh Milk'
};

const TAMIL_NUMBERS = {
  'ஒன்று': 1, 'ஒரு': 1, 'ஒன்னு': 1,
  'இரண்டு': 2, 'ரெண்டு': 2,
  'மூன்று': 3, 'மூணு': 3,
  'நான்கு': 4, 'நாலு': 4,
  'ஐந்து': 5, 'அஞ்சு': 5,
  'ஆறு': 6,
  'ஏழு': 7,
  'எட்டு': 8,
  'ஒன்பது': 9,
  'பத்து': 10,
  'இருபது': 20,
  'இருபத்தைந்து': 25,
  'ஐம்பது': 50,
  'நூறு': 100
};

/**
 * Fallback Intelligent Rule-Based NLP Parser for Tamil, English & Tanglish
 */
export function parseVoiceWithRules(transcript, detectedLanguage = 'auto') {
  const text = transcript.trim();
  const lower = text.toLowerCase();

  const isTamil = /[\u0B80-\u0BFF]/.test(text) || detectedLanguage === 'ta';

  let customer = '';
  let product = '';
  let quantity = 0;
  let unit = 'kg';
  let total = 0;
  let price = 0;
  let payment_status = 'paid';
  let payment_due_date = 'Immediate';
  let notes = '';

  // 1. EXTRACT QUANTITY & UNIT
  // Check Tamil patterns first: e.g. "10 கிலோ", "2 லிட்டர்", "1 பாக்கெட்"
  const tamilUnitMatch = text.match(/(\d+(?:\.\d+)?)\s*(கிலோ|லிட்டர்|பாக்கெட்|டப்பா|எண்ணிக்கை)/i);
  const engUnitMatch = text.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilogram|kilograms|liter|liters|litre|litres|l|packet|packets|pkt|pkts|piece|pieces|box|boxes|bag|bags)\b/i);

  if (tamilUnitMatch) {
    quantity = parseFloat(tamilUnitMatch[1]);
    const u = tamilUnitMatch[2];
    if (u === 'கிலோ') unit = 'kg';
    else if (u === 'லிட்டர்') unit = 'liter';
    else if (u === 'பாக்கெட்') unit = 'packet';
    else if (u === 'டப்பா') unit = 'box';
    else unit = 'piece';
  } else if (engUnitMatch) {
    quantity = parseFloat(engUnitMatch[1]);
    const u = engUnitMatch[2].toLowerCase();
    if (u.startsWith('kg') || u.startsWith('kilo')) unit = 'kg';
    else if (u.startsWith('l')) unit = 'liter';
    else if (u.startsWith('pkt') || u.startsWith('pack')) unit = 'packet';
    else if (u.startsWith('box')) unit = 'box';
    else unit = 'piece';
  } else {
    // Check Tamil word numbers (e.g. பத்து கிலோ)
    for (const [w, num] of Object.entries(TAMIL_NUMBERS)) {
      if (text.includes(w)) {
        quantity = num;
        break;
      }
    }
    // Generic number fallback
    const numMatch = text.match(/\b(\d+(?:\.\d+)?)\b/);
    if (numMatch && !quantity) {
      quantity = parseFloat(numMatch[1]);
    }
  }

  // 2. EXTRACT TOTAL AMOUNT / PRICE
  // Look for currency symbols or words like rupees, rs, ரூபாய், ரூ.
  const priceTamilMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:ரூபாய்|ரூ|ரூபாய்க்கு)/i) || 
                          text.match(/(?:ரூபாய்|ரூ\.?)\s*(\d+(?:\.\d+)?)/i);
  const priceEngMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:rupees|rupee|rs|inr|\/-)/i) || 
                        text.match(/(?:rs\.?|₹|inr)\s*(\d+(?:\.\d+)?)/i) ||
                        text.match(/for\s*(\d+(?:\.\d+)?)/i);

  if (priceTamilMatch) {
    total = parseFloat(priceTamilMatch[1] || priceTamilMatch[2]);
  } else if (priceEngMatch) {
    total = parseFloat(priceEngMatch[1] || priceEngMatch[2]);
  } else {
    // Look for a secondary number if quantity was already found
    const allNumbers = text.match(/\b\d+(?:\.\d+)?\b/g);
    if (allNumbers && allNumbers.length >= 2) {
      const candidates = allNumbers.map(Number).filter(n => n !== quantity);
      if (candidates.length > 0) {
        total = Math.max(...candidates);
      }
    }
  }

  // 3. EXTRACT PRODUCT
  if (isTamil) {
    for (const [tamilTerm, canonicalName] of Object.entries(TAMIL_PRODUCT_MAP)) {
      if (text.includes(tamilTerm)) {
        product = canonicalName;
        break;
      }
    }
  }

  if (!product) {
    const knownProducts = [
      { key: 'rice', name: 'Ponni Boiled Rice', unit: 'kg' },
      { key: 'toor dal', name: 'Toor Dal (Ooty Grade)', unit: 'kg' },
      { key: 'dal', name: 'Toor Dal (Ooty Grade)', unit: 'kg' },
      { key: 'oil', name: 'Gold Winner Sunflower Oil', unit: 'liter' },
      { key: 'sunflower oil', name: 'Gold Winner Sunflower Oil', unit: 'liter' },
      { key: 'sugar', name: 'Refined White Sugar', unit: 'kg' },
      { key: 'atta', name: 'Aashirvaad Shudh Chakki Atta', unit: 'kg' },
      { key: 'wheat flour', name: 'Aashirvaad Shudh Chakki Atta', unit: 'kg' },
      { key: 'flour', name: 'Aashirvaad Shudh Chakki Atta', unit: 'kg' },
      { key: 'tea', name: 'Tata Tea Gold 250g', unit: 'packet' },
      { key: 'tea powder', name: 'Tata Tea Gold 250g', unit: 'packet' },
      { key: 'milk', name: 'Aavin Blue Fresh Milk', unit: 'packet' }
    ];

    for (const p of knownProducts) {
      if (lower.includes(p.key)) {
        product = p.name;
        if (!unit) unit = p.unit;
        break;
      }
    }
  }

  // Fallback product detection if still not detected
  if (!product) {
    const prodMatch = text.match(/(?:bought|purchased|sold|for)\s+([a-zA-Z\s]{3,15})/i);
    if (prodMatch) {
      product = prodMatch[1].trim();
    } else {
      product = 'General Merchandise';
    }
  }

  // 4. EXTRACT CUSTOMER
  // Check Tamil known names first
  for (const [tamilName, engName] of Object.entries(TAMIL_NAME_MAP)) {
    if (text.includes(tamilName)) {
      customer = engName;
      break;
    }
  }

  if (!customer) {
    // Common English / Romanized customer names
    const knownNames = [
      'guru', 'gurusamy', 'guru prasad', 'kumar', 'priya', 'anitha', 'karthik', 'murugan', 'ramesh', 'suresh', 
      'vijay', 'lakshmi', 'selvam', 'saravanan', 'dinesh', 'balu', 'raja', 
      'manikandan', 'subramani', 'ravi', 'deepa', 'meena', 'sangeetha', 'gopal'
    ];
    
    for (const name of knownNames) {
      if (lower.includes(name)) {
        customer = name.charAt(0).toUpperCase() + name.slice(1);
        break;
      }
    }
  }

  // Tamil name detection: words before வாங்கினார் or after இன்று
  if (!customer && isTamil) {
    const tmMatch = text.match(/(?:இன்று\s+)?([^\s0-9]+)\s+(?:\d+|[^\s]+)\s+(?:கிலோ|லிட்டர்|அரிசி|பருப்பு)/);
    if (tmMatch && tmMatch[1]) {
      customer = tmMatch[1].trim();
    }
  }

  // English fallback: "Today Kumar purchased..." or "Kumar purchased..."
  if (!customer) {
    const engCustMatch = text.match(/(?:today\s+)?([A-Z][a-z]+)\s+(?:purchased|bought|sold|took|ordered|credit|pending)/i);
    if (engCustMatch) {
      customer = engCustMatch[1].trim();
    } else {
      customer = 'Walk-in Customer';
    }
  }

  // 5. EXTRACT PAYMENT STATUS & DUE DATE
  const isPending = /நாளை|கடன்|பிறகு|பாக்கி|தருவார்|கொடுப்பார்|tomorrow|credit|pending|later|due|unpaid/i.test(text);
  const isPaid = /ரொக்கம்|கொடுத்தார்|செலுத்தினார்|பணம்\s*தந்தார்|ஜிபே|paid|cash|gpay|upi|settled|received/i.test(text);

  if (isPending && !isPaid) {
    payment_status = 'pending';
    payment_due_date = /tomorrow|நாளை/i.test(text) ? 'Tomorrow' : 'Later';
    notes = 'Credit sale - Payment due';
  } else {
    payment_status = 'paid';
    payment_due_date = 'Immediate';
    notes = /upi|ஜிபே|gpay/i.test(text) ? 'Paid via UPI' : 'Paid in cash';
  }

  // Default general provisions if amount is given but specific product omitted
  if (!product || product === 'General Merchandise') {
    if (total > 0) {
      product = 'Store Provisions / Khata Credit';
      if (!quantity || quantity <= 0 || ((!tamilUnitMatch && !engUnitMatch) && quantity === total)) {
        quantity = 1;
        unit = 'lot';
      }
    }
  }

  // If no explicit unit matched and quantity matches total amount, quantity is 1 lot
  if ((!tamilUnitMatch && !engUnitMatch) && quantity === total && total > 0) {
    quantity = 1;
    unit = 'lot';
  }

  // Calculate unit price if total and quantity are available
  if (total > 0 && quantity > 0) {
    price = Math.round((total / quantity) * 100) / 100;
  }

  // Validation
  const missingFields = [];
  if (!customer || customer === 'Walk-in Customer') missingFields.push('Customer name');
  if (!total || total <= 0) missingFields.push('Total amount (₹)');
  if (!quantity || quantity <= 0) quantity = 1;

  return {
    engine: 'VoiceBiz NLP Engine (Built-in)',
    intent: 'create_sale',
    customer: customer || 'Customer',
    product: product || 'Product',
    quantity: quantity || 1,
    unit: unit || 'kg',
    price: price || (total ? total : 0),
    total: total || 0,
    paid: payment_status === 'paid' ? (total || 0) : 0,
    pending: payment_status === 'pending' ? (total || 0) : 0,
    payment_status,
    payment_due_date,
    notes,
    isValid: missingFields.length === 0,
    missingFields,
    clarificationPrompt: missingFields.length > 0 
      ? `We need a bit more detail: Please specify ${missingFields.join(', ')}.`
      : null
  };
}

/**
 * Main AI Processor: Calls Gemini API if configured, otherwise falls back to Rule-Based NLP
 */
export async function extractTransactionFromSpeech(transcript, detectedLanguage = 'auto', customApiKey = null) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  // If no Gemini key is provided, use our intelligent local engine
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return parseVoiceWithRules(transcript, detectedLanguage);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are the AI engine for "VoiceBiz AI", an intelligent business assistant for Indian small businesses (grocery shops, provisional stores, distributors).
The store owner speaks in Tamil, English, or Tanglish. Your job is to extract structured sales transaction details.

Input Voice Transcript:
"${transcript}"

Detected/Selected Language: "${detectedLanguage}"

Return ONLY a valid JSON object with the following schema:
{
  "engine": "Gemini 1.5 Flash",
  "intent": "create_sale",
  "customer": "Customer Name (string, proper capitalized, e.g. 'Kumar')",
  "product": "Product Name (string in English canonical format, e.g. 'Rice', 'Sunflower Oil', 'Toor Dal')",
  "quantity": 10 (number),
  "unit": "kg" | "liter" | "packet" | "piece" | "box",
  "price": 60 (unit price as number),
  "total": 600 (total amount in INR as number),
  "paid": 0 (number, amount paid right now),
  "pending": 600 (number, balance due),
  "payment_status": "paid" | "partial" | "pending",
  "payment_due_date": "Tomorrow" | "Immediate" | "Within a week" | "",
  "notes": "Brief summary",
  "isValid": true | false,
  "missingFields": ["list of missing required fields if any"],
  "clarificationPrompt": "Conversational question in case critical fields are missing, else null"
}

Crucial Business Rules:
1. "He will pay tomorrow" / "நாளை பணம் தருவார்" / "கடன்" means payment_status="pending", paid=0, pending=total, payment_due_date="Tomorrow".
2. "cash" / "paid" / "ரொக்கம்" / "கொடுத்தார்" means payment_status="paid", paid=total, pending=0, payment_due_date="Immediate".
3. Calculate unit price if total and quantity are given (price = total / quantity).
4. Do NOT include markdown backticks or any conversational text outside the raw JSON object.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean markdown formatting if present
    const cleaned = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    parsed.engine = 'Gemini 1.5 Flash (AI)';
    return parsed;

  } catch (error) {
    console.warn('Gemini API call failed or timed out, falling back to built-in NLP parser:', error.message);
    const fallback = parseVoiceWithRules(transcript, detectedLanguage);
    fallback.notes += ` (Handled by local NLP fallback: ${error.message.slice(0, 50)})`;
    return fallback;
  }
}
