// Produce a URL-friendly slug from arbitrary text.
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Ensure uniqueness of a slug against a model that has a slug field.
export async function uniqueSlug(model, base, ignoreId = null) {
  let slug = slugify(base) || 'item';
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = model.findOne({ slug });
    if (ignoreId) query.where('_id').ne(ignoreId);
    const existing = await query.exec(); // eslint-disable-line no-await-in-loop
    if (!existing) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}
