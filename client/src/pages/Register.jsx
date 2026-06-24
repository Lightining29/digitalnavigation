import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { sendOtp, verifyOtp, register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP, 3 = Registering/Success
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validations
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    try {
      await sendOtp(formData.email);
      setStep(2);
    } catch (err) {
      // Error is set in context, but we catch to stop execution
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otpCode.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      // 1. Verify OTP
      await verifyOtp(formData.email, otpCode);
      
      // 2. If verified successfully, register
      setStep(3);
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        company: formData.company,
      });

      // 3. Redirect to home page
      navigate('/');
    } catch (err) {
      // If error happens in registration or OTP verification, revert step back to 2 or keep at 2
      setStep(2);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResendMessage('');
    try {
      await sendOtp(formData.email);
      setResendMessage('A new code has been sent to your email.');
    } catch (err) {
      setResendMessage('');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4) 0' }}>
      <div className="neu-raised" style={{ padding: 'var(--space-6)', width: '100%', maxWidth: 480 }}>
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-5)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'var(--accent-soft)', zIndex: 1, transform: 'translateY(-50%)' }} />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: step >= s ? 'var(--accent)' : 'var(--surface)',
                color: step >= s ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                border: step >= s ? 'none' : '2px solid var(--accent-soft)',
                boxShadow: step >= s ? '0 0 10px var(--accent-soft)' : 'none',
                zIndex: 2,
                transition: 'all 0.3s ease',
              }}
            >
              {s === 3 && step === 3 ? '✓' : s}
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: 'var(--space-2)', textAlign: 'center' }}>
          {step === 1 && 'Create Account'}
          {step === 2 && 'Verify Email'}
          {step === 3 && 'Finalizing...'}
        </h2>
        <p className="muted text-center" style={{ fontSize: '0.88rem', marginBottom: 'var(--space-5)' }}>
          {step === 1 && 'Register to apply for jobs and submit inquiries.'}
          {step === 2 && `We sent a 6-digit code to ${formData.email}`}
          {step === 3 && 'Creating your profile and signing in...'}
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}
        {resendMessage && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)', color: 'var(--success)' }}>{resendMessage}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
              <label>Full Name *</label>
              <input className="input" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />
            </div>

            <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
              <label>Email Address *</label>
              <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>

            <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
              <label>Username *</label>
              <input className="input" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" required />
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div className="field">
                <label>Password *</label>
                <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••" required />
              </div>
              <div className="field">
                <label>Confirm Password *</label>
                <input className="input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" required />
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div className="field">
                <label>Phone (Optional)</label>
                <input className="input" name="phone" value={formData.phone} onChange={handleChange} placeholder="+123456789" />
              </div>
              <div className="field">
                <label>Company (Optional)</label>
                <input className="input" name="company" value={formData.company} onChange={handleChange} placeholder="ACME Corp" />
              </div>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister}>
            <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ textAlign: 'center', display: 'block', marginBottom: 'var(--space-2)' }}>Verification Code</label>
              <input
                className="input text-center"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                placeholder="123456"
                style={{ fontSize: '1.5rem', letterSpacing: 8, maxWidth: 200, margin: '0 auto' }}
                required
              />
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>

            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
              <span className="muted" style={{ fontSize: '0.88rem' }}>Didn't receive the code? </span>
              <button className="btn btn-link btn-sm" type="button" onClick={handleResendOtp} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
                Resend Code
              </button>
            </div>

            <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
              <button className="btn btn-link btn-sm" type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                ← Edit Details
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="loading-center" style={{ padding: 'var(--space-5)' }}>
            <div className="spinner" />
          </div>
        )}

        {step === 1 && (
          <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', borderTop: '1px solid var(--accent-soft)', paddingTop: 'var(--space-4)' }}>
            <span className="muted" style={{ fontSize: '0.88rem' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
