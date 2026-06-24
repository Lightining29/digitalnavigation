import { useEffect, useState } from 'react';
import api from '../api/client';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyApplications()
      .then((data) => {
        setApplications(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load applications.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'shortlisted':
        return 'chip chip-success';
      case 'rejected':
        return 'chip chip-danger';
      case 'reviewed':
        return 'chip chip-accent';
      default:
        return 'chip'; // submitted
    }
  };

  if (loading) {
    return (
      <div className="container section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-center">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ minHeight: '60vh' }}>
      <header style={{ marginBottom: 'var(--space-6)' }}>
        <span className="eyebrow">User Dashboard</span>
        <h1>My Applications</h1>
        <p className="muted">Track the status of your job applications with Digital Navigation.</p>
      </header>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

      {applications.length === 0 ? (
        <div className="neu-raised text-center" style={{ padding: 'var(--space-6)' }}>
          <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>You haven't applied for any jobs yet.</p>
          <a href="/jobs" className="btn btn-primary">View Open Roles</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {applications.map((app) => (
            <div key={app._id} className="neu-raised" style={{ padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text)' }}>
                    {app.job?.title || 'Unknown Position'}
                  </h3>
                  <p className="muted" style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    {app.job?.department} · {app.job?.location}
                  </p>
                  <p className="muted" style={{ fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                    Applied on: {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className={getStatusChipClass(app.status)} style={{ textTransform: 'capitalize' }}>
                    {app.status}
                  </span>
                </div>
              </div>

              {app.coverLetter && (
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--accent-soft)' }}>
                  <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>Cover Letter</strong>
                  <p className="muted" style={{ fontSize: '0.88rem', whiteSpace: 'pre-wrap', margin: 0, maxHeight: 120, overflow: 'auto' }}>
                    {app.coverLetter}
                  </p>
                </div>
              )}

              {app.resumeFilename && (
                <div style={{ marginTop: 'var(--space-3)', fontSize: '0.85rem' }}>
                  <span className="muted">Attached Resume: </span>
                  <span style={{ color: 'var(--accent)', fontWeight: '500' }}>📄 {app.resumeFilename}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
