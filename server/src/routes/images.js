import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  createGridFsImageStorage,
  getImageBucket,
  getImageFilesCollection,
  toObjectId,
} from '../services/imageStore.js';

const router = Router();

const upload = multer({
  storage: createGridFsImageStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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

// PUBLIC - stream any stored image by ID.
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const imageId = toObjectId(req.params.id);
    const file = await getImageFilesCollection().findOne({ _id: imageId });

    if (!file) {
      return res.status(404).send('Image not found.');
    }

    const contentType = file.contentType || file.metadata?.contentType || 'application/octet-stream';
    const etag = `"${file._id.toString()}-${file.length}"`;

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    res.set({
      'Content-Type': contentType,
      'Content-Length': file.length,
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: etag,
      'X-Content-Type-Options': 'nosniff',
    });

    const stream = getImageBucket().openDownloadStream(imageId);
    stream.on('error', next);
    stream.pipe(res);
  })
);

// ADMIN - upload an image and store it as MongoDB binary chunks.
router.post(
  '/upload',
  requireAuth,
  requireAdmin,
  uploadSingle('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided.' });
    }

    res.status(201).json({
      id: req.file.id.toString(),
      url: `/api/images/${req.file.id}`,
      size: req.file.size,
      contentType: req.file.mimetype,
      filename: req.file.filename,
    });
  })
);

// ADMIN - delete an image by ID.
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const imageId = toObjectId(req.params.id);
    await getImageBucket().delete(imageId);
    res.json({ ok: true });
  })
);

export default router;
