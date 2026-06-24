import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import config from '../config.js';

const uploadDir = path.resolve(config.uploadDir);

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const id = crypto.randomBytes(12).toString('hex');
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && /^image\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed.'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_BYTES },
});

// Wrap multer so errors return JSON instead of HTML
export function uploadSingle(fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
}
