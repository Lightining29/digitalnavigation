import { useState } from 'react';
import api from '../api/client';

export default function LeadForm({ type = 'contact', productRef, jobRef, onSuccess }) {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    company: '', 
    phone: '', 
    subject: type === 'contact' ? 'General Inquiry' : '', 
    message: '' 
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSending(true);
    try {
      let finalType = type;
      if (type === 'contact') {
        if (form.subject === 'Request a Demo') finalType = 'demo';
        else if (form.subject === 'Technical Support') finalType = 'support';
        else finalType = 'contact';
      }
      await api.submitLead({ ...form, type: finalType, productRef, jobRef });
      setSent(true);
      if (onSuccess) onSuccess();
    } catch (e) {
      setErr(e.message || 'Failed to send.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="neu-raised text-center" style={{ padding: 'var(--space-5)' }}>
        <h3 className="accent">Message Sent!</h3>
        <p className="muted" style={{ marginTop: 8 }}>Thank you for reaching out. We will get back to you shortly.</p>
        <button className="btn btn-sm" style={{ marginTop: 16 }} onClick={() => { setSent(false); setForm({ name: '', email: '', company: '', phone: '', subject: type === 'contact' ? 'General Inquiry' : '', message: '' }); }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="neu-raised" style={{ padding: 'var(--space-5)' }}>
      <h3 style={{ marginBottom: 'var(--space-4)' }}>Get in Touch</h3>

      {err && <div className="alert alert-error">{err}</div>}

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="field">
          <label>Name *</label>
          <input className="input" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
        </div>
        <div className="field">
          <label>Email *</label>
          <input className="input" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" />
        </div>
        <div className="field">
          <label>Company</label>
          <input className="input" name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
        </div>
        <div className="field">
          <label>Phone</label>
          <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 …" />
        </div>
      </div>

      {type === 'contact' && (
        <div className="field" style={{ marginTop: 'var(--space-3)' }}>
          <label>Inquiry Type *</label>
          <select 
            className="input" 
            name="subject" 
            value={form.subject} 
            onChange={handleChange}
            required
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Request a Demo">Request a Demo</option>
            <option value="Technical Support">Technical Support</option>
          </select>
        </div>
      )}

      <div className="field" style={{ marginTop: 'var(--space-3)' }}>
        <label>Message</label>
        <textarea className="textarea" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project or requirements…" />
      </div>

      <button className="btn btn-primary btn-block" style={{ marginTop: 'var(--space-4)' }} disabled={sending}>
        {sending ? 'Sending…' : 'Send Message'}
      </button>

      <style>{`
        @media (max-width: 600px) {
          form .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
