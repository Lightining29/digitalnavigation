import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const { login, loading, error, setError, user, isAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
      <form onSubmit={handleSubmit} className="neu-raised" style={{ padding: 'var(--space-6)', width: '100%', maxWidth: 400 }}>
        <h2 style={{ marginBottom: 'var(--space-2)', textAlign: 'center' }}>Admin Login</h2>
        <p className="muted text-center" style={{ fontSize: '0.88rem', marginBottom: 'var(--space-5)' }}>
          Sign in to manage products, jobs, gallery, and leads.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
          <label>Username</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required />
        </div>
        <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', borderTop: '1px solid var(--accent-soft)', paddingTop: 'var(--space-4)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem' }} className="muted">Not an admin?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.88rem' }}>Login here</Link>
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.88rem' }}>Register account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
