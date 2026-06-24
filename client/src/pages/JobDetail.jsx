import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function JobDetail() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);
  const [appStatus, setAppStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    api.getJob(slug)
      .then(setJob)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user && job) {
      api.getMyApplications()
        .then((apps) => {
          const match = apps.find(a => a.job?._id === job._id);
          if (match) {
            setHasApplied(true);
            setAppStatus(match.status);
          }
        })
        .catch(() => {});
    }
  }, [user, job]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!resumeFile) {
      setSubmitError('Please upload your resume.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('job', job._id);
      fd.append('coverLetter', coverLetter);
      fd.append('resume', resumeFile);

      await api.submitApplication(fd);
      setSubmitSuccess(true);
      setHasApplied(true);
      setAppStatus('submitted');
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!job) return (
    <section className="section">
      <div className="container text-center">
        <h2>Job not found</h2>
        <Link to="/jobs" className="btn" style={{ marginTop: 16 }}>← Back to Jobs</Link>
      </div>
    </section>
  );

  return (
    <>
      <section style={{ padding: 'var(--space-6) 0 var(--space-4)' }}>
        <div className="container">
          <Link to="/jobs" className="btn btn-sm" style={{ marginBottom: 'var(--space-4)' }}>← All Jobs</Link>
          <span className="eyebrow">{job.department}</span>
          <h1 style={{ marginTop: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>{job.title}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
            <span className="chip chip-accent">{job.location}</span>
            <span className="chip">{job.type}</span>
            <span className={`chip ${job.status === 'open' ? 'chip-success' : 'chip-danger'}`}>{job.status}</span>
          </div>
          <div style={{ maxWidth: 780 }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>About the Role</h3>
            <p className="muted" style={{ fontSize: '0.95rem', whiteSpace: 'pre-line', marginBottom: 'var(--space-4)' }}>
              {job.description}
            </p>

            {job.requirements?.length > 0 && (
              <>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Requirements</h3>
                <ul style={{ paddingLeft: 24, marginBottom: 'var(--space-4)' }}>
                  {job.requirements.map((r, i) => (
                    <li key={i} className="muted" style={{ fontSize: '0.95rem', marginBottom: 4 }}>{r}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--accent-soft)' }}>
        <div className="container" style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>Apply for this Position</h2>

          {submitSuccess && (
            <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)', color: 'var(--success)' }}>
              Your application has been submitted successfully!
            </div>
          )}

          {!user ? (
            <div className="neu-raised text-center" style={{ padding: 'var(--space-5)' }}>
              <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>
                You must be logged in to apply for this job.
              </p>
              <Link to="/login" className="btn btn-primary">Login to Apply</Link>
            </div>
          ) : hasApplied ? (
            <div className="neu-raised text-center" style={{ padding: 'var(--space-5)' }}>
              <div className="chip chip-success" style={{ display: 'inline-block', marginBottom: 'var(--space-3)', textTransform: 'capitalize' }}>
                Application {appStatus} ✓
              </div>
              <p className="muted" style={{ margin: 0 }}>
                You have already submitted an application for this role. You can track its status in <Link to="/my-applications" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>My Applications</Link>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="neu-raised" style={{ padding: 'var(--space-5)' }}>
              {submitError && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{submitError}</div>}

              <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
                <label>Cover Letter (Optional)</label>
                <textarea
                  className="textarea"
                  rows="6"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself and tell us why you are a great fit for this role..."
                />
              </div>

              <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
                <label>Resume / CV *</label>
                <input
                  className="input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  required
                />
                <span className="muted" style={{ fontSize: '0.78rem', marginTop: 4, display: 'block' }}>
                  Accepted formats: PDF, DOC, DOCX. Max size 5MB.
                </span>
              </div>

              <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
