import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireAdmin, requireUser } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { notifyNewApplication } from '../utils/email.js';

const router = Router();

// Multer config for resume uploads
const resumeDir = 'uploads/resumes/';
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });

const upload = multer({
  dest: resumeDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pdf', '.doc', '.docx'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

// POST / — submit a new application (authenticated user)
router.post(
  '/',
  requireAuth,
  requireUser,
  upload.single('resume'),
  [
    body('job').notEmpty().withMessage('Job ID is required.'),
    body('coverLetter').optional().trim(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { job: jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    const existing = await Application.findOne({ job: jobId, user: req.user.sub });
    if (existing) return res.status(409).json({ error: 'You have already applied for this job.' });

    const appData = {
      job: jobId,
      user: req.user.sub,
      coverLetter: coverLetter || '',
    };

    if (req.file) {
      appData.resumeFilename = req.file.originalname;
      appData.resumeUrl = `/${resumeDir}${req.file.filename}`;
    }

    const application = await Application.create(appData);

    // Fire-and-forget admin notification
    const user = await User.findById(req.user.sub);
    notifyNewApplication(
      user?.fullName || user?.username || 'Unknown',
      user?.email || '',
      job.title,
    ).catch(() => {});

    res.status(201).json(application);
  })
);

// GET / — admin: list all applications
router.get(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate('job', 'title slug department location')
      .populate('user', 'username fullName email phone')
      .lean();
    res.json(applications);
  })
);

// GET /mine — authenticated user: list own applications
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const applications = await Application.find({ user: req.user.sub })
      .sort({ createdAt: -1 })
      .populate('job', 'title slug department location status')
      .lean();
    res.json(applications);
  })
);

// PUT /:id/status — admin: update application status
router.put(
  '/:id/status',
  requireAuth,
  requireAdmin,
  [
    body('status')
      .isIn(['submitted', 'reviewed', 'shortlisted', 'rejected'])
      .withMessage('Invalid status.'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!application) return res.status(404).json({ error: 'Application not found.' });
    res.json(application);
  })
);

// GET /:id/resume — admin: download resume file
router.get(
  '/:id/resume',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found.' });
    if (!application.resumeUrl) return res.status(404).json({ error: 'No resume attached.' });

    const filePath = path.resolve(application.resumeUrl.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Resume file not found on server.' });

    res.download(filePath, application.resumeFilename || 'resume');
  })
);

export default router;
