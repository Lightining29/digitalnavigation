import { Router } from 'express';
import { body } from 'express-validator';
import Job from '../models/Job.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uniqueSlug } from '../utils/slugify.js';

const router = Router();

const VALID_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

// PUBLIC — list open jobs
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : { status: 'open' };
    const jobs = await Job.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    res.json(jobs);
  })
);

// PUBLIC — single job by slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const job = await Job.findOne({ slug: req.params.slug }).lean();
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    res.json(job);
  })
);

// ---- ADMIN ----
const jobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('department').trim().notEmpty().withMessage('Department is required.'),
  body('location').trim().notEmpty().withMessage('Location is required.'),
  body('summary').trim().notEmpty().withMessage('Summary is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('type')
    .optional()
    .isIn(VALID_TYPES)
    .withMessage('Type must be one of: full-time, part-time, contract, internship.'),
  validate,
];

// ADMIN — create
router.post(
  '/',
  requireAuth,
  requireAdmin,
  jobValidation,
  asyncHandler(async (req, res) => {
    const { title, department, location, type, summary, description, requirements, status, order } =
      req.body;
    const slug = await uniqueSlug(Job, title);
    const job = await Job.create({
      slug,
      title,
      department,
      location,
      type: type || 'full-time',
      summary,
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      status: status || 'open',
      order: Number(order) || 0,
    });
    res.status(201).json(job);
  })
);

// ADMIN — update
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  jobValidation,
  asyncHandler(async (req, res) => {
    const { title, department, location, type, summary, description, requirements, status, order, slug } =
      req.body;
    const update = {
      department,
      location,
      type: type || 'full-time',
      summary,
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      status: status || 'open',
      order: Number(order) || 0,
    };
    if (title) update.title = title;
    if (slug) update.slug = await uniqueSlug(Job, slug, req.params.id);
    const job = await Job.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    res.json(job);
  })
);

// ADMIN — delete
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    res.json({ ok: true });
  })
);

export default router;
