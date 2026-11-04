import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbAdapter from '../services/dbAdapter.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'voicebiz-liquid-glass-jwt-secret-2026';

// Helper: generate token
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      businessName: user.businessName
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, businessName, email, phone, category, password, confirmPassword } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (at least 2 characters).' });
    }
    if (!businessName || businessName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Business name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match. Please verify.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existing = await dbAdapter.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `An account registered with "${cleanEmail}" already exists. Please log in instead.`
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await dbAdapter.createUser({
      name: name.trim(),
      businessName: businessName.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      category: category || 'Grocery & Department Store',
      password: hashedPassword,
      role: 'owner'
    });

    // Also synchronize business profile
    await dbAdapter.updateBusinessProfile({
      name: businessName.trim(),
      ownerName: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      category: category || 'Grocery & Department Store'
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to VoiceBiz AI.',
      token,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        businessName: newUser.businessName,
        email: newUser.email,
        phone: newUser.phone,
        category: newUser.category
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Server error during registration: ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Both email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await dbAdapter.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'No account found with this email. Please check your spelling or sign up.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please try again or use Forgot Password.'
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone,
        category: user.category
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Server error during login: ' + error.message });
  }
});

// GET /api/auth/me (Verify session)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({ success: false, error: 'Session expired or invalid token.' });
    }

    const user = await dbAdapter.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account no longer exists.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone,
        category: user.category
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: 'Auth check error: ' + error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Please enter your registered email address.' });
  }
  const user = await dbAdapter.findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ success: false, error: 'No account found with this email.' });
  }

  return res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. For local development demo, password is: VoiceBiz@123`
  });
});

export default router;

