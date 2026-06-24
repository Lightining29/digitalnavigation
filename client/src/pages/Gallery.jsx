import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getGallery()
      .then(setPhotos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Gallery</span>
        <h2 style={{ marginBottom: 'var(--space-5)' }}>In the Field</h2>

        {photos.length === 0 ? (
          <div className="neu-raised text-center" style={{ padding: 'var(--space-7)' }}>
            <p className="muted">No photos yet. The admin can upload images to the gallery.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {photos.map((p) => (
              <div
                key={p._id}
                className="neu-raised"
                style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setSelected(p)}
              >
                <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={p.url} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                </div>
                {p.caption && (
                  <div style={{ padding: '10px 14px' }}>
                    <p className="muted" style={{ fontSize: '0.82rem' }}>{p.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, cursor: 'pointer',
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900, width: '100%' }}>
            <img src={selected.url} alt={selected.caption} style={{
              width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }} />
            {selected.caption && (
              <p style={{ color: '#fff', textAlign: 'center', marginTop: 12, fontSize: '0.95rem' }}>{selected.caption}</p>
            )}
            <button
              onClick={() => setSelected(null)}
              style={{
                display: 'block', margin: '16px auto 0', background: 'var(--surface)', border: 'none',
                padding: '8px 24px', borderRadius: 'var(--radius-pill)', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
