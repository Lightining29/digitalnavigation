import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280' viewBox='0 0 400 280'%3E%3Crect width='400' height='280' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='44%25' font-size='48' text-anchor='middle' dominant-baseline='middle'%3E📦%3C/text%3E%3Ctext x='50%25' y='68%25' font-size='14' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3ENo image yet%3C/text%3E%3C/svg%3E`;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Products</span>
        <h2 style={{ marginBottom: 'var(--space-5)' }}>Our Solutions</h2>

        {products.length === 0 ? (
          <div className="neu-raised text-center" style={{ padding: 'var(--space-7)' }}>
            <p className="muted">No products yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {products.map((p) => (
              <Link key={p._id} to={`/products/${p.slug}`} className="neu-raised" style={{
                padding: 'var(--space-4)', textDecoration: 'none', color: 'inherit',
              }}>
                <div style={{
                  width: '100%', height: 200, borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                  background: 'var(--surface-dark)', marginBottom: 'var(--space-3)',
                }}>
                  <img
                    src={p.images?.[0] || PLACEHOLDER}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
                  />
                </div>
                <span className="chip chip-accent" style={{ marginBottom: 8 }}>{p.category}</span>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>{p.name}</h3>
                <p className="muted" style={{ fontSize: '0.9rem' }}>{p.tagline}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
