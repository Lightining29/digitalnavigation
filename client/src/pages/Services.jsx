import { Link } from 'react-router-dom';

const SERVICES = [
  {
    id: 'broadcast-consulting',
    icon: '📡',
    title: 'Broadcast Consulting',
    desc: 'Expert guidance for your live broadcast infrastructure. We analyse your workflow, recommend hardware/software stacks, and help you achieve broadcast-grade output from any location.',
    features: ['Workflow analysis & planning', 'Hardware & software recommendations', 'Latency optimisation', 'Protocol selection (SRT, RTMP, RTSP)'],
  },
  {
    id: 'installation-training',
    icon: '🎓',
    title: 'Installation & Training',
    desc: 'Full on-site setup, integration, and hands-on training for your team. We ensure every operator is confident with the equipment before going live.',
    features: ['On-site equipment installation', 'Network configuration & testing', 'Operator training workshops', 'Custom training materials'],
  },
  {
    id: 'technical-support',
    icon: '🛠️',
    title: 'Technical Support',
    desc: '24/7 priority technical support from broadcast engineers who understand mission-critical live production. From troubleshooting to firmware updates — we have you covered.',
    features: ['24/7 remote support', 'Dedicated account engineer', 'Firmware & software updates', 'Replacement unit SLA'],
  },
  {
    id: 'remote-monitoring',
    icon: '🌐',
    title: 'Remote Monitoring',
    desc: 'Cloud-based monitoring dashboard giving you real-time visibility into all your encoder units — signal strength, bitrate, temperature, battery, and connectivity at a glance.',
    features: ['Live encoder health dashboard', 'Automated alerts & notifications', 'Historical telemetry logs', 'Multi-device management'],
  },
  {
    id: 'system-integration',
    icon: '🔗',
    title: 'System Integration',
    desc: 'Seamless integration of T-Rex and Smart Telecaster units into your existing broadcast chain — newsroom systems, playout, CDN delivery, and cloud infrastructure.',
    features: ['MOS & NRCS integration', 'CDN & streaming platform setup', 'Playout & graphics integration', 'API & webhook configuration'],
  },
  {
    id: 'managed-events',
    icon: '🏟️',
    title: 'Managed Live Events',
    desc: 'Full end-to-end managed service for high-stakes live events. Our engineers deploy on-site, monitor in real-time, and guarantee broadcast quality from start to finish.',
    features: ['On-site engineer deployment', 'Real-time quality monitoring', 'Redundant connectivity setup', 'Post-event reporting'],
  },
];

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: 'var(--space-7) 0 var(--space-5)', background: 'linear-gradient(135deg, var(--surface) 0%, var(--accent-soft) 100%)' }}>
        <div className="container text-center">
          <span className="eyebrow">What We Offer</span>
          <h1 style={{ marginTop: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
            Professional <span className="accent">Broadcast Services</span>
          </h1>
          <p className="muted" style={{ maxWidth: 600, margin: '0 auto var(--space-5)', fontSize: '1.05rem' }}>
            From initial consultation to 24/7 ongoing support, we provide end-to-end services that keep your live productions running flawlessly.
          </p>
          <Link to="/contact" className="btn btn-primary">Get a Free Consultation</Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {SERVICES.map((s) => (
              <div key={s.id} className="neu-raised" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 'var(--space-3)' }}>{s.icon}</div>
                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--text)' }}>{s.title}</h3>
                <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)', flex: 1 }}>{s.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-4) 0' }}>
                  {s.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1rem' }}>✓</span>
                      <span className="muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="btn btn-sm"
                  style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
                >
                  Enquire →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ borderTop: '1px solid var(--accent-soft)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <span className="eyebrow">Our Commitment</span>
            <h2 style={{ marginTop: 'var(--space-1)' }}>Why Broadcast Teams Choose Us</h2>
          </div>
          <div className="grid grid-4">
            {[
              { icon: '⚡', title: 'Fast Response', desc: 'Average 15-minute response time for critical support tickets.' },
              { icon: '🏆', title: 'Proven Track Record', desc: 'Trusted at 10,000+ live events across 50+ countries.' },
              { icon: '👷', title: 'Certified Engineers', desc: 'All engineers hold broadcast industry certifications.' },
              { icon: '🔒', title: 'SLA Guaranteed', desc: 'Service level agreements with financial penalties for breaches.' },
            ].map((item) => (
              <div key={item.title} className="neu-raised text-center" style={{ padding: 'var(--space-4)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{item.icon}</div>
                <h4 style={{ marginBottom: 'var(--space-1)', fontSize: '0.95rem' }}>{item.title}</h4>
                <p className="muted" style={{ fontSize: '0.82rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <div className="neu-raised" style={{ padding: 'var(--space-7)', maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Ready to Get Started?</h2>
            <p className="muted" style={{ marginBottom: 'var(--space-5)' }}>
              Talk to one of our broadcast engineers today. No commitment — just expert advice tailored to your needs.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">Contact Us</Link>
              <Link to="/products" className="btn">View Products</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .grid-3 { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .grid-3, .grid-4 { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
