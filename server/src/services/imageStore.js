import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';

const BUCKET_NAME = 'images';

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/svg+xml',
]);

function getDb() {
  const db = mongoose.connection.db;
  if (!db) {
    const err = new Error('Image storage is not connected.');
    err.status = 503;
    throw err;
  }
  return db;
}

export function getImageBucket() {
  return new mongoose.mongo.GridFSBucket(getDb(), { bucketName: BUCKET_NAME });
}

export function getImageFilesCollection() {
  return getDb().collection(`${BUCKET_NAME}.files`);
}

export function isAllowedImage(file) {
  return Boolean(file?.mimetype?.startsWith('image/')) && allowedImageTypes.has(file.mimetype);
}

export function makeImageFilename(originalName = 'image') {
  const ext = path.extname(originalName).toLowerCase();
  const suffix = crypto.randomBytes(12).toString('hex');
  return `${Date.now()}-${suffix}${ext}`;
}

export function createGridFsImageStorage({ usedBy = '' } = {}) {
  return {
    _handleFile(req, file, cb) {
      let uploadStream;
      let settled = false;

      const done = (err, info) => {
        if (settled) return;
        settled = true;
        cb(err, info);
      };

      try {
        if (!isAllowedImage(file)) {
          const err = new Error('Only image files (jpg, png, gif, webp, avif, svg) are allowed.');
          err.status = 400;
          file.stream.resume();
          done(err);
          return;
        }

        const filename = makeImageFilename(file.originalname);
        uploadStream = getImageBucket().openUploadStream(filename, {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            contentType: file.mimetype,
            usedBy: req.body?.usedBy || usedBy,
          },
        });

        file.stream.on('error', done);
        uploadStream.on('error', done);
        uploadStream.on('finish', () => {
          const storedFile = uploadStream.gridFSFile;
          done(null, {
            id: storedFile._id,
            filename: storedFile.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: storedFile.length,
            gridfsFile: storedFile,
            path: `/api/images/${storedFile._id}`,
          });
        });

        file.stream.pipe(uploadStream);
      } catch (err) {
        done(err);
      }
    },

    _removeFile(_req, file, cb) {
      if (!file?.id) {
        cb(null);
        return;
      }

      getImageBucket().delete(file.id).then(() => cb(null), cb);
    },
  };
}

export function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid image id.');
    err.status = 400;
    throw err;
  }
  return new mongoose.Types.ObjectId(id);
}

export function imageIdFromUrl(url) {
  const match = /^\/api\/images\/([a-f\d]{24})$/i.exec(url || '');
  return match ? new mongoose.Types.ObjectId(match[1]) : null;
}

export async function deleteImageByUrl(url) {
  const imageId = imageIdFromUrl(url);
  if (!imageId) return;

  try {
    await getImageBucket().delete(imageId);
  } catch (err) {
    if (!err?.message?.startsWith('File not found for id')) {
      throw err;
    }
  }
}
