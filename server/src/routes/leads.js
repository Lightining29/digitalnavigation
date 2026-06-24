import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import Lead from '../models/Lead.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { notifyNewContact } from '../utils/email.js';

const router = Router();

// PUBLIC — submit a lead (rate-limited)
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

router.post(
  '/',
  leadLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').trim().isEmail().withMessage('A valid email is required.'),
    body('phone').optional().trim(),
    body('company').optional().trim(),
    body('message').optional().trim(),
    body('subject').optional().trim(),
    body('type')
      .optional()
      .isIn(['contact', 'demo', 'support', 'job'])
      .withMessage('Invalid lead type.'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, phone, company, message, type, subject, productRef, jobRef } = req.body;
    const lead = await Lead.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      message: message || '',
      subject: subject || '',
      type: type || 'contact',
      productRef: productRef || undefined,
      jobRef: jobRef || undefined,
    });

    // Fire-and-forget admin notification
    notifyNewContact(name, email, lead.subject, message).catch(() => {});

    res.status(201).json({ ok: true, id: lead._id });
  })
);

// ---- ADMIN ----
router.get(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('productRef', 'name slug')
      .populate('jobRef', 'title slug')
      .lean();
    res.json(leads);
  })
);

router.put(
  '/:id/status',
  requireAuth,
  requireAdmin,
  [body('status').isIn(['new', 'contacted', 'closed']).withMessage('Invalid status.')],
  validate,
  asyncHandler(async (req, res) => {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json(lead);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json({ ok: true });
  })
);

export default router;
