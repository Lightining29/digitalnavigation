import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import api from '../api/client';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProduct(slug)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!product) return (
    <section className="section">
      <div className="container text-center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn" style={{ marginTop: 16 }}>← Back to Products</Link>
      </div>
    </section>
  );

  return (
    <>
      {/* Hero */}
      <section style={{ padding: 'var(--space-6) 0 var(--space-4)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          <div className="neu-raised" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img src={product.images?.[0] || '/uploads/placeholder-trex-1.svg'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span className="chip chip-accent">{product.category}</span>
            <h1 style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>{product.name}</h1>
            <p style={{ fontSize: '1.05rem', marginBottom: 'var(--space-4)' }}>{product.tagline}</p>
            <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>{product.description}</p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">Request a Quote</Link>
              <Link to="/products" className="btn">All Products</Link>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:780px){section .container{grid-template-columns:1fr !important; text-align:center;} section .container div[style*="flex"]{justify-content:center;}}`}</style>
      </section>

      {/* Features */}
      {product.features?.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Key Features</h2>
            <div className="grid grid-3">
              {product.features.map((f, i) => (
                <div key={i} className="neu-raised" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specs table */}
      {product.specs?.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Specifications</h2>
            <div className="neu-raised" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={i} style={{
                      background: i % 2 === 0 ? 'var(--surface-light)' : 'var(--surface)',
                    }}>
                      <td style={{ padding: '14px 24px', fontWeight: 600, fontSize: '0.9rem', width: '40%' }}>{s.label}</td>
                      <td style={{ padding: '14px 24px', fontSize: '0.9rem' }}>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Gallery strip */}
      {product.images?.length > 1 && (
        <section className="section">
          <div className="container">
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Gallery</h2>
            <div className="grid grid-4">
              {product.images.map((img, i) => (
                <div key={i} className="neu-raised" style={{ overflow: 'hidden', aspectRatio: '1' }}>
                  <img src={img} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead form */}
      <section className="section">
        <div className="container" style={{ maxWidth: 600, margin: '0 auto' }}>
          <LeadForm type="quote" productRef={product._id} />
        </div>
      </section>
    </>
  );
}
