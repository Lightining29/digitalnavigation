import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="neu-raised" style={{ marginTop: 'var(--space-7)', padding: 'var(--space-6) 0 var(--space-4)' }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: 'var(--space-5)' }}>

          {/* Brand + tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: '0.75rem',
              }}>DI</span>
              <strong>Digital Navigation</strong>
            </div>
            <p className="muted" style={{ fontSize: '0.88rem', maxWidth: 280, marginBottom: 'var(--space-3)' }}>
              Professional live streaming and broadcast solutions — H264/H265 HEVC cellular bonding encoders for mission-critical video.
            </p>
            {/* Social / extra badges */}
            <div style={{ display: 'flex', gap: 8 }}>
              {['📡', '🎬', '🌐'].map((icon, i) => (
                <span key={i} style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                }}>{icon}</span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-3)', color: 'var(--accent)' }}>Solutions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/products" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Products</Link>
              <Link to="/services" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Services</Link>
              <Link to="/gallery" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Gallery</Link>
              <Link to="/jobs" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Careers</Link>
              <Link to="/about" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>About</Link>
              <Link to="/contact" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-3)', color: 'var(--accent)' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/about" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>About Us</Link>
              <Link to="/jobs" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Careers</Link>
              <Link to="/services" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Our Services</Link>
              <Link to="/admin/login" className="muted" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>Admin Portal</Link>
            </div>
          </div>

          {/* Contact Info from dnavigation.com */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-3)', color: 'var(--accent)' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>

              {/* Address */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', marginTop: 2, flexShrink: 0 }}>📍</span>
                <p className="muted" style={{ fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
                  Unit 307, 3rd Floor, Tower B,<br />
                  A-40, Ithum IT Park, Sector 62,<br />
                  Noida – 201301, India
                </p>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', marginTop: 2, flexShrink: 0 }}>📞</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <a href="tel:+919319132121" className="muted" style={{ fontSize: '0.83rem', textDecoration: 'none' }}>
                    +91-9319132121
                  </a>
                  <a href="tel:01204138169" className="muted" style={{ fontSize: '0.83rem', textDecoration: 'none' }}>
                    0120-4138169
                  </a>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', marginTop: 2, flexShrink: 0 }}>✉️</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <a href="mailto:sales@dnavigation.com" className="muted" style={{ fontSize: '0.83rem', textDecoration: 'none' }}>
                    sales@dnavigation.com
                  </a>
                  <a href="mailto:support@dnavigation.com" className="muted" style={{ fontSize: '0.83rem', textDecoration: 'none' }}>
                    support@dnavigation.com
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <hr style={{ margin: 'var(--space-5) 0 var(--space-3)', border: 'none', borderTop: '1px solid var(--accent-soft)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>
            © {year} Digital Navigation Private Limited. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Link to="/contact" className="muted" style={{ fontSize: '0.82rem', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/contact" className="muted" style={{ fontSize: '0.82rem', textDecoration: 'none' }}>Terms of Use</Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            footer .grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 580px) {
            footer .grid { grid-template-columns: 1fr !important; gap: var(--space-5) !important; }
          }
        `}</style>
      </div>
    </footer>
  );
}
