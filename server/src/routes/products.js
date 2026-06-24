import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uniqueSlug } from '../utils/slugify.js';
import { createGridFsImageStorage, deleteImageByUrl } from '../services/imageStore.js';

const upload = multer({
  storage: createGridFsImageStorage({ usedBy: 'product' }),
  limits: { fileSize: 8 * 1024 * 1024 },
});

function uploadProductImage(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (!err) {
      next();
      return;
    }

    const status = err.status || (err instanceof multer.MulterError ? 400 : 500);
    res.status(status).json({ error: err.message });
  });
}

const router = Router();

// PUBLIC — list products (optionally only featured)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { featured } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;
    const products = await Product.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .select('-description -specs -features')
      .lean();
    res.json(products);
  })
);

// PUBLIC — single product by slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  })
);

// ---- ADMIN ----
const productValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('tagline').trim().notEmpty().withMessage('Tagline is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  validate,
];

// ADMIN — upload product image
router.post(
  '/upload-image',
  requireAuth,
  requireAdmin,
  uploadProductImage,
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });
    res.status(201).json({
      id: req.file.id.toString(),
      url: `/api/images/${req.file.id}`,
      size: req.file.size,
      contentType: req.file.mimetype,
    });
  })
);

// ADMIN — create
router.post(
  '/',
  requireAuth,
  requireAdmin,
  productValidation,
  asyncHandler(async (req, res) => {
    const { name, tagline, description, category, featured, features, specs, images, order } =
      req.body;
    const slug = await uniqueSlug(Product, name);
    const product = await Product.create({
      slug,
      name,
      tagline,
      description,
      category,
      featured: !!featured,
      features: Array.isArray(features) ? features : [],
      specs: Array.isArray(specs) ? specs : [],
      images: Array.isArray(images) ? images : [],
      order: Number(order) || 0,
    });
    res.status(201).json(product);
  })
);

// ADMIN — update
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  productValidation,
  asyncHandler(async (req, res) => {
    const { name, tagline, description, category, featured, features, specs, images, order, slug } =
      req.body;
    const nextImages = Array.isArray(images) ? images : [];
    const update = {
      tagline,
      description,
      category,
      featured: !!featured,
      features: Array.isArray(features) ? features : [],
      specs: Array.isArray(specs) ? specs : [],
      images: nextImages,
      order: Number(order) || 0,
    };
    if (name) update.name = name;
    if (slug) update.slug = await uniqueSlug(Product, slug, req.params.id);
    const existingProduct = await Product.findById(req.params.id).select('images').lean();
    if (!existingProduct) return res.status(404).json({ error: 'Product not found.' });
    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    const keptImages = new Set(nextImages);
    const removedImages = (existingProduct.images || []).filter((url) => !keptImages.has(url));
    await Promise.allSettled(removedImages.map((url) => deleteImageByUrl(url)));
    res.json(product);
  })
);

// ADMIN — delete
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    await Promise.allSettled((product.images || []).map((url) => deleteImageByUrl(url)));
    res.json({ ok: true });
  })
);

export default router;
