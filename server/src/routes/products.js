import { Router } from 'express';
import { body } from 'express-validator';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uniqueSlug } from '../utils/slugify.js';

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
    const update = {
      tagline,
      description,
      category,
      featured: !!featured,
      features: Array.isArray(features) ? features : [],
      specs: Array.isArray(specs) ? specs : [],
      images: Array.isArray(images) ? images : [],
      order: Number(order) || 0,
    };
    if (name) update.name = name;
    if (slug) update.slug = await uniqueSlug(Product, slug, req.params.id);
    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
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
    res.json({ ok: true });
  })
);

export default router;
