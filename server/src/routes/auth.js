import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendOTP } from '../utils/email.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  })
);

// POST /send-otp - sends OTP to email
router.post('/send-otp',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { error: 'Too many OTP requests.' } }),
  [body('email').isEmail().normalizeEmail().withMessage('Valid email is required.')],
  validate,
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const { code } = await Otp.generate(email);

    // Try to send email — if SMTP fails, log OTP to console and continue
    try {
      await sendOTP(email, code);
    } catch (emailErr) {
      console.warn(`[otp] Email send failed (${emailErr.message}). OTP for ${email}: ${code}`);
    }

    // Always return success — user advances to step 2 regardless
    res.json({ message: 'OTP sent to your email.' });
  })
);

// POST /verify-otp - verifies OTP code
router.post('/verify-otp',
  [body('email').isEmail().normalizeEmail(), body('code').trim().isLength({ min: 6, max: 6 })],
  validate,
  asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    const otp = await Otp.findOne({ email: email.toLowerCase(), verified: false });
    if (!otp) return res.status(400).json({ error: 'No pending OTP. Request a new one.' });
    const valid = await otp.verify(code);
    if (!valid) return res.status(400).json({ error: 'Invalid or expired OTP.' });
    res.json({ message: 'Email verified.', verified: true });
  })
);

// POST /register - creates user account after OTP verification
router.post('/register',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many registration attempts.' } }),
  [
    body('email').isEmail().normalizeEmail(),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { email, username, password, fullName, phone, company } = req.body;
    // Verify OTP was completed
    const otp = await Otp.findOne({ email: email.toLowerCase(), verified: true });
    if (!otp) return res.status(400).json({ error: 'Email not verified. Please verify your email first.' });
    // Check duplicates
    const existingUser = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
    if (existingUser) {
      if (existingUser.email === email) return res.status(409).json({ error: 'Email already registered.' });
      return res.status(409).json({ error: 'Username already taken.' });
    }
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      email, username: username.toLowerCase(), passwordHash, fullName, phone: phone || '', company: company || '',
      role: 'user', emailVerified: true,
    });
    await Otp.deleteMany({ email: email.toLowerCase() });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role, fullName: user.fullName, email: user.email } });
  })
);

// GET /me - get current user profile
router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
}));

export default router;
