import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import GalleryPhoto from '../models/GalleryPhoto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { createGridFsImageStorage, deleteImageByUrl } from '../services/imageStore.js';

const router = Router();

const upload = multer({
  storage: createGridFsImageStorage({ usedBy: 'gallery' }),
  limits: { fileSize: 8 * 1024 * 1024 },
});

function uploadSingle(fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        next();
        return;
      }

      const status = err.status || (err instanceof multer.MulterError ? 400 : 500);
      res.status(status).json({ error: err.message });
    });
  };
}

function validateUploadedPhoto(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const first = errors.array()[0];
  const sendValidationError = () => res.status(422).json({ error: first.msg });

  if (!req.file?.id) {
    sendValidationError();
    return;
  }

  deleteImageByUrl(`/api/images/${req.file.id}`)
    .catch((err) => console.warn('[gallery] could not clean up rejected upload:', err.message))
    .finally(sendValidationError);
}

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
  validateUploadedPhoto,
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Image file is required.' });
    const { caption, category, order } = req.body;
    const url = `/api/images/${req.file.id}`;

    try {
      const photo = await GalleryPhoto.create({
        filename: req.file.filename,
        url,
        caption: caption || '',
        category: category || 'General',
        order: Number(order) || 0,
      });
      res.status(201).json(photo);
    } catch (err) {
      await deleteImageByUrl(url);
      throw err;
    }
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

// ADMIN — delete (also removes MongoDB-stored image data for new uploads)
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const photo = await GalleryPhoto.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found.' });
    try {
      await deleteImageByUrl(photo.url);
    } catch (err) {
      console.warn('[gallery] could not delete image from MongoDB:', err.message);
    }
    res.json({ ok: true });
  })
);

export default router;
