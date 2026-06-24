export default function About() {
  return (
    <>
      <section style={{ padding: 'var(--space-6) 0 var(--space-4)' }}>
        <div className="container text-center">
          <span className="eyebrow">About Us</span>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Digital Navigation</h1>
          <p className="muted" style={{ maxWidth: 720, margin: '0 auto', fontSize: '1.05rem' }}>
            We are a team of broadcast engineers and technologists dedicated to making professional live streaming
            accessible from any location. Our T-Rex and Smart Telecaster product lines are trusted by news
            organisations, sports broadcasters, and production companies worldwide.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className="neu-raised" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Our Mission</h3>
              <p className="muted" style={{ fontSize: '0.95rem' }}>
                To democratise broadcast-quality live video by building reliable, portable, and easy-to-use
                cellular bonding encoders that work everywhere — from city centres to remote mountain passes.
              </p>
            </div>
            <div className="neu-raised" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>What We Do</h3>
              <p className="muted" style={{ fontSize: '0.95rem' }}>
                We design, manufacture, and support a range of live streaming hardware and software solutions.
                Every product is tested in real-world broadcast conditions to ensure it meets the demands of
                mission-critical live production.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {[
              { value: '50+', label: 'Countries served' },
              { value: '10K+', label: 'Live events covered' },
              { value: '99.9%', label: 'Uptime reliability' },
            ].map((s) => (
              <div key={s.label} className="neu-raised text-center" style={{ padding: 'var(--space-5)' }}>
                <div className="accent" style={{ fontSize: '2.2rem', fontWeight: 800 }}>{s.value}</div>
                <p className="muted" style={{ fontSize: '0.9rem', marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Get in Touch</h2>
          <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>
            Want to learn more about our products or discuss a project? We'd love to hear from you.
          </p>
          <a href="mailto:info@digitalinnovation.com" className="btn btn-primary">Contact Us</a>
        </div>
      </section>
    </>
  );
}
