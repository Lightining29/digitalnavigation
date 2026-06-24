import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api/client';
import ToastContainer from '../../components/ToastContainer';

const TABS = ['Leads', 'Applications', 'Products', 'Jobs', 'Gallery'];

// ─── Leads Tab ───
function LeadsTab({ toast }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.getLeads().then(setLeads).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const updateStatus = async (id, status) => {
    try { await api.updateLeadStatus(id, status); toast.success('Status updated'); load(); }
    catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try { await api.deleteLead(id); toast.success('Lead deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <h3 style={{ marginBottom: 'var(--space-4)' }}>Leads ({leads.length})</h3>
      {leads.length === 0 ? <p className="muted">No leads yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {leads.map((l) => (
            <div key={l._id} className="neu-raised" style={{ padding: 'var(--space-3) var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <strong>{l.name}</strong> <span className="muted" style={{ fontSize: '0.85rem' }}>&lt;{l.email}&gt;</span>
                  {l.company && <span className="muted" style={{ fontSize: '0.85rem' }}> — {l.company}</span>}
                  <br />
                  <span className="muted" style={{ fontSize: '0.82rem' }}>
                    {new Date(l.createdAt).toLocaleDateString()} · {l.type}
                    {l.productRef && <> · {l.productRef.name}</>}
                    {l.jobRef && <> · {l.jobRef.title}</>}
                  </span>
                  {l.message && <p className="muted" style={{ fontSize: '0.85rem', marginTop: 4, maxWidth: 500 }}>{l.message}</p>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select className="input" value={l.status} onChange={(e) => updateStatus(l._id, e.target.value)} style={{ width: 'auto', padding: '6px 10px', fontSize: '0.82rem' }}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button className="btn btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(l._id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Applications Tab ───
function ApplicationsTab({ toast }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.getApplications().then(setApps).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.updateApplicationStatus(id, status);
      toast.success('Status updated');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <h3 style={{ marginBottom: 'var(--space-4)' }}>Applications ({apps.length})</h3>
      {apps.length === 0 ? <p className="muted">No applications yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {apps.map((a) => (
            <div key={a._id} className="neu-raised" style={{ padding: 'var(--space-3) var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <strong>{a.user?.fullName || a.user?.username}</strong>
                  <span className="muted" style={{ fontSize: '0.85rem' }}> &lt;{a.user?.email}&gt;</span>
                  <br />
                  <span className="muted" style={{ fontSize: '0.82rem' }}>
                    Applied for: <strong>{a.job?.title || 'Unknown Job'}</strong> · {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                  {a.coverLetter && <p className="muted" style={{ fontSize: '0.85rem', marginTop: 4, maxWidth: 500 }}>{a.coverLetter.substring(0, 200)}{a.coverLetter.length > 200 ? '...' : ''}</p>}
                  {a.resumeUrl && (
                    <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ marginTop: 8, display: 'inline-block' }}>📄 Download Resume</a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select className="input" value={a.status} onChange={(e) => updateStatus(a._id, e.target.value)} style={{ width: 'auto', padding: '6px 10px', fontSize: '0.82rem' }}>
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Products Tab ───
function ProductsTab({ toast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', tagline: '', description: '', category: 'Live Streaming', featured: false, features: '', specs: '', images: '' });

  const load = useCallback(() => {
    setLoading(true);
    api.getProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const reset = () => { setEditing(null); setForm({ name: '', tagline: '', description: '', category: 'Live Streaming', featured: false, features: '', specs: '', images: '' }); };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, tagline: p.tagline, description: p.description, category: p.category,
      featured: p.featured,
      features: (p.features || []).join('\n'),
      specs: (p.specs || []).map(s => `${s.label}: ${s.value}`).join('\n'),
      images: (p.images || []).join('\n'),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      specs: form.specs.split('\n').map(line => { const [label, ...rest] = line.split(':'); return { label: label.trim(), value: rest.join(':').trim() }; }).filter(s => s.label),
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editing) { await api.updateProduct(editing, payload); toast.success('Product updated'); }
      else { await api.createProduct(payload); toast.success('Product created'); }
      reset(); load();
    } catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.deleteProduct(id); toast.success('Product deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3>Products ({products.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={reset}>{editing ? 'Cancel' : '+ New Product'}</button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSubmit} className="neu-inset" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div className="grid grid-2">
            <div className="field"><label>Name *</label><input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="field"><label>Tagline *</label><input className="input" required value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} /></div>
          </div>
          <div className="field" style={{ marginTop: 12 }}><label>Category</label><input className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
          <div className="field" style={{ marginTop: 12 }}><label>Description *</label><textarea className="textarea" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            <div className="field"><label>Features (one per line)</label><textarea className="textarea" value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} style={{ minHeight: 80 }} /></div>
            <div className="field"><label>Specs (label: value, one per line)</label><textarea className="textarea" value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} style={{ minHeight: 80 }} /></div>
          </div>
          <div className="field" style={{ marginTop: 12 }}><label>Image URLs (one per line)</label><textarea className="textarea" value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} style={{ minHeight: 60 }} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: '0.88rem' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} /> Featured
          </label>
          <button className="btn btn-primary" style={{ marginTop: 12 }} type="submit">{editing ? 'Update Product' : 'Create Product'}</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.map((p) => (
          <div key={p._id} className="neu-raised" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <strong>{p.name}</strong> {p.featured && <span className="chip chip-accent" style={{ marginLeft: 8 }}>Featured</span>}
              <br /><span className="muted" style={{ fontSize: '0.82rem' }}>{p.tagline}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm" onClick={() => startEdit(p)}>Edit</button>
              <button className="btn btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(p._id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Jobs Tab ───
function JobsTab({ toast }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', department: '', location: '', type: 'full-time', summary: '', description: '', requirements: '', status: 'open' });

  const load = useCallback(() => {
    setLoading(true);
    api.getJobs().then(setJobs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const reset = () => { setEditing(null); setForm({ title: '', department: '', location: '', type: 'full-time', summary: '', description: '', requirements: '', status: 'open' }); };

  const startEdit = (j) => {
    setEditing(j._id);
    setForm({ title: j.title, department: j.department, location: j.location, type: j.type, summary: j.summary, description: j.description, requirements: (j.requirements || []).join('\n'), status: j.status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, requirements: form.requirements.split('\n').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) { await api.updateJob(editing, payload); toast.success('Job updated'); }
      else { await api.createJob(payload); toast.success('Job created'); }
      reset(); load();
    } catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this job?')) return;
    try { await api.deleteJob(id); toast.success('Job deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3>Jobs ({jobs.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={reset}>{editing ? 'Cancel' : '+ New Job'}</button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSubmit} className="neu-inset" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div className="grid grid-2">
            <div className="field"><label>Title *</label><input className="input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="field"><label>Department *</label><input className="input" required value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></div>
            <div className="field"><label>Location *</label><input className="input" required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div className="field">
              <label>Type</label>
              <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
          <div className="field" style={{ marginTop: 12 }}><label>Summary *</label><input className="input" required value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} /></div>
          <div className="field" style={{ marginTop: 12 }}><label>Description *</label><textarea className="textarea" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="field" style={{ marginTop: 12 }}><label>Requirements (one per line)</label><textarea className="textarea" value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} style={{ minHeight: 80 }} /></div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Status</label>
            <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ width: 'auto' }}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 12 }} type="submit">{editing ? 'Update Job' : 'Create Job'}</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {jobs.map((j) => (
          <div key={j._id} className="neu-raised" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <strong>{j.title}</strong>
              <span className={`chip ${j.status === 'open' ? 'chip-success' : 'chip-danger'}`} style={{ marginLeft: 8 }}>{j.status}</span>
              <br />
              <span className="muted" style={{ fontSize: '0.82rem' }}>{j.department} · {j.location} · {j.type}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm" onClick={() => startEdit(j)}>Edit</button>
              <button className="btn btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(j._id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery Tab ───
function GalleryTab({ toast }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('General');
  const fileRef = null;

  const load = useCallback(() => {
    setLoading(true);
    api.getGallery().then(setPhotos).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements?.photo;
    if (!fileInput || !fileInput.files?.length) { toast.error('Select an image first.'); return; }
    const fd = new FormData();
    fd.append('photo', fileInput.files[0]);
    fd.append('caption', caption);
    fd.append('category', category);
    setUploading(true);
    try {
      await api.uploadPhoto(fd);
      toast.success('Photo uploaded!');
      setCaption('');
      if (fileInput) fileInput.value = '';
      load();
    } catch (err) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this photo?')) return;
    try { await api.deletePhoto(id); toast.success('Photo deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <h3 style={{ marginBottom: 'var(--space-4)' }}>Gallery ({photos.length})</h3>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="neu-inset" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div className="grid grid-2">
          <div className="field">
            <label>Photo *</label>
            <input type="file" name="photo" accept="image/*" required style={{ fontSize: '0.88rem' }} />
          </div>
          <div>
            <div className="field"><label>Caption</label><input className="input" value={caption} onChange={e => setCaption(e.target.value)} /></div>
            <div className="field" style={{ marginTop: 8 }}><label>Category</label><input className="input" value={category} onChange={e => setCategory(e.target.value)} /></div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }} type="submit" disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </button>
      </form>

      {/* Photo grid */}
      {photos.length === 0 ? <p className="muted">No photos yet.</p> : (
        <div className="grid grid-4">
          {photos.map((p) => (
            <div key={p._id} className="neu-raised" style={{ overflow: 'hidden' }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                <img src={p.url} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p className="muted" style={{ fontSize: '0.78rem' }}>{p.caption || '—'}</p>
                  <span className="muted" style={{ fontSize: '0.72rem' }}>{p.category}</span>
                </div>
                <button className="btn btn-sm" style={{ color: 'var(--danger)', padding: '4px 8px' }} onClick={() => remove(p._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Shell ───
export default function AdminDashboard() {
  const { logout } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  const [tab, setTab] = useState('Leads');

  const TabComponent = { Leads: LeadsTab, Applications: ApplicationsTab, Products: ProductsTab, Jobs: JobsTab, Gallery: GalleryTab }[tab];

  return (
    <section className="section">
      <div className="container">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
          <h2>Admin Dashboard</h2>
          <button className="btn btn-sm" onClick={logout}>Sign Out</button>
        </div>

        {/* Tab bar */}
        <div className="neu-inset" style={{
          display: 'flex', gap: 4, padding: 4, marginBottom: 'var(--space-4)', borderRadius: 'var(--radius)',
        }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px 16px', border: 'none', borderRadius: 'var(--radius-sm)',
                background: tab === t ? 'var(--surface)' : 'transparent',
                boxShadow: tab === t ? 'var(--shadow-raised-sm)' : 'none',
                fontWeight: tab === t ? 700 : 500, fontSize: '0.88rem', color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'var(--transition)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <TabComponent toast={{ success, error }} />
      </div>
    </section>
  );
}
