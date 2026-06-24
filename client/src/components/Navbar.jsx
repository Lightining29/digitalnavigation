import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PRODUCTS_LINKS = [
  { to: '/products', label: 'All Products', icon: '📦', desc: 'Browse the full product range' },
  { to: '/products/t-rex-live-streaming-solution', label: 'T-Rex', icon: '🦖', desc: 'H.264/H.265 cellular bonding encoder' },
  { to: '/products/smart-telecaster-pro', label: 'Smart Telecaster Pro', icon: '📹', desc: 'Compact backpack encoder for ENG' },
];

const SERVICES_LINKS = [
  { to: '/services', label: 'All Services', icon: '🛎️', desc: 'See everything we offer' },
  { to: '/services#broadcast-consulting', label: 'Broadcast Consulting', icon: '📡', desc: 'Expert workflow guidance' },
  { to: '/services#installation-training', label: 'Installation & Training', icon: '🎓', desc: 'On-site setup and training' },
  { to: '/services#technical-support', label: 'Technical Support', icon: '🛠️', desc: '24/7 broadcast engineer support' },
  { to: '/services#remote-monitoring', label: 'Remote Monitoring', icon: '🌐', desc: 'Cloud dashboard for all units' },
  { to: '/services#system-integration', label: 'System Integration', icon: '🔗', desc: 'Integrate into your broadcast chain' },
  { to: '/services#managed-events', label: 'Managed Live Events', icon: '🏟️', desc: 'Full event production service' },
];

const PAGES_LINKS = [
  { to: '/about', label: 'About Us', icon: '🏢', desc: 'Our story and mission' },
  { to: '/gallery', label: 'Gallery', icon: '🖼️', desc: 'Photos from the field' },
  { to: '/jobs', label: 'Careers', icon: '💼', desc: 'Join our broadcast team' },
  { to: '/contact', label: 'Contact', icon: '✉️', desc: 'Get in touch with us' },
];

function Dropdown({ label, links, isActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <li ref={ref} style={{ position: 'relative', listStyle: 'none' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: '8px 14px',
          borderRadius: 'var(--radius-pill)',
          fontWeight: isActive || open ? 700 : 500,
          fontSize: '0.9rem',
          background: open ? 'var(--accent-soft)' : 'transparent',
          color: open || isActive ? 'var(--accent)' : 'var(--text-muted)',
          transition: 'var(--transition)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          fontSize: '0.7rem',
          opacity: 0.7,
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-raised-lg)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--accent-soft)',
          padding: '8px',
          minWidth: 260,
          zIndex: 200,
          animation: 'dropIn 0.18s ease',
        }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: 'var(--text)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center', flexShrink: 0 }}>{l.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{l.label}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>{l.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`@keyframes dropIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </li>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState('');
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const isProductsActive = location.pathname.startsWith('/products');
  const isServicesActive = location.pathname.startsWith('/services');
  const isPagesActive = ['/about', '/gallery', '/jobs', '/contact'].includes(location.pathname);

  const closeMobile = () => { setMobileOpen(false); setMobileExpanded(''); };

  return (
    <nav className="navbar neu-raised" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'auto',
      minHeight: 'var(--nav-height)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 var(--space-4)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--nav-height)', width: '100%' }}>

        {/* Logo */}
        <Link to="/" onClick={closeMobile} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 800, fontSize: '1.15rem', textDecoration: 'none', color: 'var(--text)', flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: '0.85rem',
          }}>DI</span>
          <span className="nav-logo-text">Digital Navigation</span>
        </Link>

        {/* Desktop nav */}
        <ul style={{ display: 'flex', listStyle: 'none', gap: 4, alignItems: 'center', margin: 0, padding: 0 }} className="desktop-nav">
          <li style={{ listStyle: 'none' }}>
            <NavLink to="/" end style={({ isActive }) => ({
              padding: '8px 14px', borderRadius: 'var(--radius-pill)',
              fontWeight: isActive ? 700 : 500, fontSize: '0.9rem',
              background: isActive ? 'var(--accent-soft)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'var(--transition)', textDecoration: 'none', whiteSpace: 'nowrap',
            })}>Home</NavLink>
          </li>

          <Dropdown label="Products" links={PRODUCTS_LINKS} isActive={isProductsActive} />
          <Dropdown label="Services" links={SERVICES_LINKS} isActive={isServicesActive} />
          <Dropdown label="Pages" links={PAGES_LINKS} isActive={isPagesActive} />

          {/* Auth section */}
          {user ? (
            <>
              {isAdmin ? (
                <li style={{ listStyle: 'none' }}>
                  <NavLink to="/admin" style={({ isActive }) => ({
                    padding: '8px 14px', borderRadius: 'var(--radius-pill)',
                    fontWeight: isActive ? 700 : 500, fontSize: '0.9rem',
                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'var(--transition)', textDecoration: 'none',
                  })}>Admin</NavLink>
                </li>
              ) : (
                <li style={{ listStyle: 'none' }}>
                  <NavLink to="/my-applications" style={({ isActive }) => ({
                    padding: '8px 14px', borderRadius: 'var(--radius-pill)',
                    fontWeight: isActive ? 700 : 500, fontSize: '0.9rem',
                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'var(--transition)', textDecoration: 'none',
                  })}>My Applications</NavLink>
                </li>
              )}
              <li style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
                <span className="muted" style={{ fontSize: '0.82rem' }}>Hi, {user.fullName || user.username}</span>
                <button onClick={logout} className="btn btn-sm" style={{ padding: '6px 12px' }}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li style={{ listStyle: 'none' }}>
                <NavLink to="/login" style={({ isActive }) => ({
                  padding: '8px 14px', borderRadius: 'var(--radius-pill)',
                  fontWeight: isActive ? 700 : 500, fontSize: '0.9rem',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'var(--transition)', textDecoration: 'none',
                })}>Login</NavLink>
              </li>
              <li style={{ listStyle: 'none' }}>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: 6 }}>Register</Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none', background: 'none', border: 'none',
            fontSize: '1.5rem', color: 'var(--text)', padding: 'var(--space-2)', cursor: 'pointer',
          }}
          className="nav-burger"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--surface)', borderTop: '1px solid var(--accent-soft)',
          padding: 'var(--space-3) 0 var(--space-4)', width: '100%',
          maxHeight: '80vh', overflowY: 'auto',
        }}>
          <NavLink to="/" end onClick={closeMobile} style={{ display: 'block', padding: '12px var(--space-4)', fontWeight: 600, textDecoration: 'none', color: 'var(--text)' }}>Home</NavLink>

          {[
            { label: 'Products', links: PRODUCTS_LINKS, key: 'products' },
            { label: 'Services', links: SERVICES_LINKS, key: 'services' },
            { label: 'Pages', links: PAGES_LINKS, key: 'pages' },
          ].map(({ label, links, key }) => (
            <div key={key}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === key ? '' : key)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '12px var(--space-4)', fontWeight: 600,
                  background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '1rem',
                  borderTop: '1px solid var(--accent-soft)',
                }}
              >
                <span>{label}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, transition: 'transform 0.2s', transform: mobileExpanded === key ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
              </button>
              {mobileExpanded === key && (
                <div style={{ background: 'var(--accent-soft)', paddingLeft: 'var(--space-4)' }}>
                  {links.map((l) => (
                    <Link key={l.to} to={l.to} onClick={closeMobile} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px var(--space-3)', textDecoration: 'none', color: 'var(--text)',
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                    }}>
                      <span style={{ fontSize: '1.1rem' }}>{l.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{l.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--accent-soft)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            {user ? (
              <>
                {isAdmin ? (
                  <NavLink to="/admin" onClick={closeMobile} style={{ display: 'block', padding: '12px var(--space-4)', textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}>Admin Dashboard</NavLink>
                ) : (
                  <NavLink to="/my-applications" onClick={closeMobile} style={{ display: 'block', padding: '12px var(--space-4)', textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}>My Applications</NavLink>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px var(--space-4)' }}>
                  <span className="muted" style={{ fontSize: '0.88rem' }}>Hi, {user.fullName || user.username}</span>
                  <button onClick={() => { logout(); closeMobile(); }} className="btn btn-sm">Logout</button>
                </div>
              </>
            ) : (
              <div style={{ padding: '0 var(--space-4)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <NavLink to="/login" onClick={closeMobile} className="btn btn-block text-center" style={{ textDecoration: 'none' }}>Login</NavLink>
                <Link to="/register" onClick={closeMobile} className="btn btn-primary btn-block text-center" style={{ textDecoration: 'none' }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
