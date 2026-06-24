import { Router } from 'express';
import { body } from 'express-validator';
import fs from 'fs';
import path from 'path';
import GalleryPhoto from '../models/GalleryPhoto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

// PUBLIC — list gallery photos
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const photos = await GalleryPhoto.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    res.json(photos);
  })
);

// ADMIN — upload a new photo (multipart/form-data)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadSingle('photo'),
  [
    body('caption').optional().trim(),
    body('category').optional().trim(),
    body('order').optional().isNumeric().withMessage('Order must be a number.'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Image file is required.' });
    const { caption, category, order } = req.body;
    const photo = await GalleryPhoto.create({
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      caption: caption || '',
      category: category || 'General',
      order: Number(order) || 0,
    });
    res.status(201).json(photo);
  })
);

// ADMIN — update metadata (no file change here)
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  [
    body('caption').optional().trim(),
    body('category').optional().trim(),
    body('order').optional().isNumeric().withMessage('Order must be a number.'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const update = {};
    if (req.body.caption !== undefined) update.caption = req.body.caption;
    if (req.body.category !== undefined) update.category = req.body.category;
    if (req.body.order !== undefined) update.order = Number(req.body.order);
    const photo = await GalleryPhoto.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!photo) return res.status(404).json({ error: 'Photo not found.' });
    res.json(photo);
  })
);

// ADMIN — delete (also removes the file from disk)
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const photo = await GalleryPhoto.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found.' });
    // best-effort file removal
    try {
      const filePath = path.resolve(
        process.env.UPLOAD_DIR || 'uploads',
        path.basename(photo.filename)
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('[gallery] could not delete file:', e.message);
    }
    res.json({ ok: true });
  })
);

export default router;
