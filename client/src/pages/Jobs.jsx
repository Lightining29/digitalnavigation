import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getJobs()
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Careers</span>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Open Positions</h2>
        <p className="muted" style={{ marginBottom: 'var(--space-5)', maxWidth: 600 }}>
          Join our team of engineers, designers, and broadcast specialists building the future of live streaming.
        </p>

        {jobs.length === 0 ? (
          <div className="neu-raised text-center" style={{ padding: 'var(--space-7)' }}>
            <p className="muted">No open positions right now. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {jobs.map((j) => (
              <Link key={j._id} to={`/jobs/${j.slug}`} className="neu-raised" style={{
                padding: 'var(--space-4)', textDecoration: 'none', color: 'inherit',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)',
              }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{j.title}</h3>
                  <p className="muted" style={{ fontSize: '0.88rem' }}>{j.summary}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <span className="chip chip-accent">{j.location}</span>
                  <span className="chip">{j.type}</span>
                  <span className="chip">{j.department}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
