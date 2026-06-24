import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const FEATURES = [
  { icon: '📡', title: 'Cellular Bonding', desc: 'Up to 6x bonded cellular links for fail-safe connectivity anywhere.' },
  { icon: '🎬', title: 'H.265 HEVC', desc: 'Hardware encoding for broadcast quality at half the bitrate of H.264.' },
  { icon: '⚡', title: 'Sub-Second Latency', desc: 'SRT and RTMP delivery with glass-to-glass latency under one second.' },
  { icon: '🔋', title: 'All-Day Battery', desc: 'Built-in battery delivers up to 8 hours of continuous streaming.' },
  { icon: '🛡️', title: 'Rugged Build', desc: 'Fanless aluminium enclosure rated for -10 °C to +50 °C operation.' },
  { icon: '🌐', title: 'Multi-Protocol', desc: 'SRT, RTMP, RTSP, TS and HLS — works with every major platform.' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.getProducts({ featured: 'true' }).then(setProducts).catch(() => {});
    api.getGallery().then((g) => setGallery(g.slice(0, 4))).catch(() => {});
    api.getJobs({ status: 'open' }).then((j) => setJobs(j.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <>
      {/* ---- Hero ---- */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-7) 0 var(--space-5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-7)', alignItems: 'center' }}>

            {/* Left — text */}
            <div className="hero-text-col">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-soft)', borderRadius: 'var(--radius-pill)', padding: '6px 16px', marginBottom: 'var(--space-3)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>Digital Navigation — Est. 2019</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.1, fontWeight: 900, marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
                We Build<br />
                <span style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Websites. Apps.<br />Broadcast. Print.
                </span>
              </h1>

              <p className="muted" style={{ fontSize: '1.15rem', maxWidth: 500, lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                Digital Navigation is a full-service technology company delivering cutting-edge
                <strong style={{ color: 'var(--text)' }}> web development</strong>,
                <strong style={{ color: 'var(--text)' }}> mobile applications</strong>,
                <strong style={{ color: 'var(--text)' }}> broadcast media software</strong>, and
                <strong style={{ color: 'var(--text)' }}> print media solutions</strong> — all under one roof.
              </p>

              {/* Service pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
                {[
                  { icon: '🌐', label: 'Web Development' },
                  { icon: '📱', label: 'App Development' },
                  { icon: '📡', label: 'Broadcast Media' },
                  { icon: '🖨️', label: 'Print Media' },
                ].map((s) => (
                  <span key={s.label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                    background: 'var(--accent-soft)', fontSize: '0.84rem', fontWeight: 600,
                    color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb, 99,102,241),0.25)',
                  }}>
                    <span>{s.icon}</span>{s.label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
                <Link to="/services" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 700 }}>
                  Explore Our Services →
                </Link>
                <Link to="/contact" className="btn" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  Get a Free Quote
                </Link>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                {[
                  { value: '200+', label: 'Projects Delivered' },
                  { value: '50+', label: 'Countries Served' },
                  { value: '99.9%', label: 'Client Satisfaction' },
                  { value: '7+', label: 'Years Experience' },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <div style={{ position: 'relative' }} className="hero-img-col">
              <div className="neu-raised" style={{
                borderRadius: 24, overflow: 'hidden',
                aspectRatio: '4/3',
                boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
              }}>
                <img
                  src="/hero-web-development.jpg"
                  alt="Web Development - Digital Navigation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              {/* Floating badge */}
              <div style={{
                position: 'absolute', bottom: -18, left: -18,
                background: 'var(--surface)', borderRadius: 16,
                padding: '14px 20px', boxShadow: 'var(--shadow-raised-lg)',
                display: 'flex', alignItems: 'center', gap: 12,
                border: '1px solid var(--accent-soft)',
              }}>
                <span style={{ fontSize: '1.8rem' }}>🚀</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Full-Service Agency</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Web · App · Broadcast · Print</div>
                </div>
              </div>
              {/* Top-right badge */}
              <div style={{
                position: 'absolute', top: -14, right: -14,
                background: 'var(--accent)', borderRadius: 12,
                padding: '10px 16px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                color: '#fff', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>50+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.9 }}>Countries</div>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
          @media(max-width:860px){
            .hero-text-col { order: 2; text-align: center; }
            .hero-img-col { order: 1; }
            .container > div { grid-template-columns: 1fr !important; }
            .hero-text-col > div[style*="flex"] { justify-content: center; }
          }
        `}</style>
      </section>


      {/* ---- Features ---- */}
      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">Why T-Rex</span>
          <h2 style={{ marginBottom: 'var(--space-5)' }}>Built for Broadcast</h2>
          <div className="grid grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="neu-raised" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-1)' }}>{f.title}</h3>
                <p className="muted" style={{ fontSize: '0.88rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured products ---- */}
      {products.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="eyebrow">Products</span>
            <h2 style={{ marginBottom: 'var(--space-5)' }}>Our Solutions</h2>
            <div className="grid grid-2">
              {products.map((p) => (
                <Link key={p._id} to={`/products/${p.slug}`} className="neu-raised" style={{
                  padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center',
                  textDecoration: 'none', color: 'inherit',
                }}>
                  <div style={{
                    width: 120, height: 90, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0,
                    background: 'var(--surface-dark)',
                  }}>
                    <img src={p.images?.[0] || '/uploads/placeholder-OB1.svg'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{p.name}</h3>
                    <p className="muted" style={{ fontSize: '0.85rem' }}>{p.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
              <Link to="/products" className="btn">View All Products →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- Gallery preview ---- */}
      {gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="eyebrow">Gallery</span>
            <h2 style={{ marginBottom: 'var(--space-5)' }}>In the Field</h2>
            <div className="grid grid-4">
              {gallery.map((p) => (
                <div key={p._id} className="neu-raised" style={{ overflow: 'hidden', aspectRatio: '1' }}>
                  <img src={p.url} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
              <Link to="/gallery" className="btn">View Full Gallery →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- Jobs teaser ---- */}
      {jobs.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="eyebrow">Careers</span>
            <h2 style={{ marginBottom: 'var(--space-5)' }}>Join Our Team</h2>
            <div className="grid grid-3">
              {jobs.map((j) => (
                <Link key={j._id} to={`/jobs/${j.slug}`} className="neu-raised" style={{
                  padding: 'var(--space-4)', textDecoration: 'none', color: 'inherit',
                }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{j.title}</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="chip chip-accent">{j.location}</span>
                    <span className="chip">{j.type}</span>
                  </div>
                  <p className="muted" style={{ fontSize: '0.85rem', marginTop: 8 }}>{j.summary}</p>
                </Link>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
              <Link to="/jobs" className="btn">View All Openings →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className="section">
        <div className="container text-center">
          <div className="neu-raised" style={{ padding: 'var(--space-7)', maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Ready to Go Live?</h2>
            <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>
              Contact us to discuss your next live production — from single-camera ENG to multi-camera stadium events.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">Get a Quote</Link>
              <Link to="/products" className="btn">See Products</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
