import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api/client';
import ToastContainer from '../../components/ToastContainer';

const TABS = ['Leads', 'Applications', 'Products', 'Jobs', 'Gallery'];

// ─── Image Upload Zone (shared) ───
function ImageUploadZone({ onUploaded, uploadFn, label = 'Click or drag an image here' }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadFn(fd);
      onUploaded(res.url);
    } catch (e) {
      alert('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--accent-soft)'}`,
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? 'var(--accent-soft)' : 'transparent',
        transition: 'var(--transition)',
        minHeight: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {preview && (
        <img src={preview} alt="preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, pointerEvents: 'none' }} />
      )}
      <span style={{ fontSize: '1.8rem' }}>{uploading ? '⏳' : '📁'}</span>
      <span className="muted" style={{ fontSize: '0.82rem', position: 'relative', zIndex: 1 }}>
        {uploading ? 'Uploading…' : label}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}

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
    try { await api.updateApplicationStatus(id, status); toast.success('Status updated'); load(); }
    catch (e) { toast.error(e.message); }
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
  const [editing, setEditing] = useState(null); // null = hidden, 'new' = new form, id = edit
  const [form, setForm] = useState({ name: '', tagline: '', description: '', category: 'Web Development', featured: false, features: '', specs: '', images: [] });

  const load = useCallback(() => {
    setLoading(true);
    api.getProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const reset = () => {
    setEditing(null);
    setForm({ name: '', tagline: '', description: '', category: 'Web Development', featured: false, features: '', specs: '', images: [] });
  };

  const startNew = () => {
    reset();
    setEditing('new');
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, tagline: p.tagline, description: p.description, category: p.category,
      featured: p.featured,
      features: (p.features || []).join('\n'),
      specs: (p.specs || []).map(s => `${s.label}: ${s.value}`).join('\n'),
      images: p.images || [],
    });
  };

  const handleImageUploaded = (url) => {
    setForm(f => ({ ...f, images: [...f.images, url] }));
    toast.success('Image added!');
  };

  const removeImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      specs: form.specs
        .split('\n')
        .map(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx === -1) return null;
          const label = line.slice(0, colonIdx).trim();
          const value = line.slice(colonIdx + 1).trim();
          if (!label || !value) return null;
          return { label, value };
        })
        .filter(Boolean),
      images: form.images,
    };
    try {
      if (editing && editing !== 'new') {
        await api.updateProduct(editing, payload); toast.success('Product updated');
      } else {
        await api.createProduct(payload); toast.success('Product created');
      }
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
        <button className="btn btn-primary btn-sm" onClick={editing ? reset : startNew}>
          {editing ? '✕ Cancel' : '+ New Product'}
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSubmit} className="neu-inset" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)', borderRadius: 'var(--radius)' }}>
          <h4 style={{ marginBottom: 'var(--space-3)' }}>{editing === 'new' ? 'New Product' : 'Edit Product'}</h4>

          <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
            <div className="field"><label>Name *</label><input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. NewsGlobe NRCS" /></div>
            <div className="field"><label>Tagline *</label><input className="input" required value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="One-line description" /></div>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <div className="field">
              <label>Category</label>
              <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Web Development', 'App Development', 'Broadcast Media', 'Print Media', 'Live Streaming', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              <label htmlFor="featured" style={{ marginBottom: 0, cursor: 'pointer' }}>⭐ Mark as Featured</label>
            </div>
          </div>

          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label>Description *</label>
            <textarea className="textarea" required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Full product description..." />
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <div className="field">
              <label>Features (one per line)</label>
              <textarea className="textarea" value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} style={{ minHeight: 90 }} placeholder="Real-time editorial workflow&#10;MOS protocol support&#10;Multi-user access" />
            </div>
            <div className="field">
              <label>Specs (Label: Value, one per line)</label>
              <textarea className="textarea" value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} style={{ minHeight: 90 }} placeholder="Platform: Web & Desktop&#10;Protocol: MOS 2.8&#10;Users: Unlimited" />
            </div>
          </div>

          {/* Image uploader */}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, fontSize: '0.88rem' }}>
              Product Images
            </label>

            {/* Existing images */}
            {form.images.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                {form.images.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', width: 90, height: 90 }}>
                    <img src={url} alt="" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--accent-soft)' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'var(--danger)', color: '#fff',
                        border: 'none', cursor: 'pointer', fontSize: '0.7rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}
                    >✕</button>
                    {idx === 0 && (
                      <span style={{ position: 'absolute', bottom: 2, left: 2, background: 'var(--accent)', color: '#fff', fontSize: '0.6rem', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>MAIN</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload zone */}
            <ImageUploadZone
              label="Click or drag an image to upload"
              uploadFn={(fd) => api.uploadProductImage(fd)}
              onUploaded={handleImageUploaded}
            />
            <p className="muted" style={{ fontSize: '0.76rem', marginTop: 6 }}>First image will be the main product image. Max 8 MB per image.</p>
          </div>

          <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} type="submit">
            {editing === 'new' ? '✓ Create Product' : '✓ Save Changes'}
          </button>
        </form>
      )}

      {/* Products list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.length === 0 && !editing && <p className="muted">No products yet. Click "+ New Product" to add one.</p>}
        {products.map((p) => (
          <div key={p._id} className="neu-raised" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Thumbnail */}
            <div style={{ width: 72, height: 56, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--accent-soft)', flexShrink: 0 }}>
              {p.images?.[0]
                ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📦</div>
              }
            </div>
            <div style={{ flex: 1 }}>
              <strong>{p.name}</strong>
              {p.featured && <span className="chip chip-accent" style={{ marginLeft: 8, fontSize: '0.72rem' }}>⭐ Featured</span>}
              <br />
              <span className="muted" style={{ fontSize: '0.82rem' }}>{p.category} · {p.tagline}</span>
              <br />
              <span className="muted" style={{ fontSize: '0.75rem' }}>{p.images?.length || 0} image{p.images?.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm" onClick={() => startEdit(p)}>✏️ Edit</button>
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
        <button className="btn btn-primary btn-sm" onClick={editing ? reset : () => setEditing('')}>{editing !== null ? '✕ Cancel' : '+ New Job'}</button>
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
              <button className="btn btn-sm" onClick={() => startEdit(j)}>✏️ Edit</button>
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
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();

  const load = useCallback(() => {
    setLoading(true);
    api.getGallery().then(setPhotos).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!previewFile) { toast.error('Select an image first.'); return; }
    const fd = new FormData();
    fd.append('photo', previewFile);
    fd.append('caption', caption);
    fd.append('category', category);
    setUploading(true);
    try {
      await api.uploadPhoto(fd);
      toast.success('Photo uploaded!');
      setCaption('');
      setPreviewFile(null);
      setPreviewUrl(null);
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
      <form onSubmit={handleUpload} className="neu-inset" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)', borderRadius: 'var(--radius)' }}>
        <h4 style={{ marginBottom: 'var(--space-3)' }}>Upload New Photo</h4>
        <div className="grid grid-2" style={{ gap: 'var(--space-4)', alignItems: 'start' }}>

          {/* Drop zone */}
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileSelect(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${dragging ? 'var(--accent)' : previewUrl ? 'var(--success)' : 'var(--accent-soft)'}`,
                borderRadius: 'var(--radius)', cursor: 'pointer',
                background: dragging ? 'var(--accent-soft)' : 'transparent',
                transition: 'var(--transition)', overflow: 'hidden',
                aspectRatio: '4/3', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🖼️</div>
                  <p className="muted" style={{ fontSize: '0.82rem' }}>Click or drag & drop<br />an image here</p>
                </div>
              )}
              {previewUrl && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <span style={{ color: '#fff', fontWeight: 700 }}>Change Image</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelect(e.target.files[0])} />
          </div>

          {/* Caption & category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="field">
              <label>Caption</label>
              <input className="input" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Describe this photo..." />
            </div>
            <div className="field">
              <label>Category</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                {['General', 'Web Development', 'App Development', 'Broadcast', 'Print', 'Events', 'Team', 'Office'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {previewFile && (
              <div className="neu-raised" style={{ padding: 'var(--space-2) var(--space-3)', fontSize: '0.8rem' }}>
                <span className="muted">Selected: </span><strong>{previewFile.name}</strong><br />
                <span className="muted">{(previewFile.size / 1024).toFixed(0)} KB</span>
              </div>
            )}
            <button className="btn btn-primary btn-block" type="submit" disabled={uploading || !previewFile} style={{ marginTop: 'auto' }}>
              {uploading ? '⏳ Uploading…' : '📤 Upload Photo'}
            </button>
          </div>
        </div>
      </form>

      {/* Photo grid */}
      {photos.length === 0
        ? <p className="muted">No photos yet. Upload one above.</p>
        : (
          <div className="grid grid-4" style={{ gap: 'var(--space-3)' }}>
            {photos.map((p) => (
              <div key={p._id} className="neu-raised" style={{ overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                  <img src={p.url} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => remove(p._id)}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'rgba(220,38,38,0.9)', color: '#fff',
                      border: 'none', cursor: 'pointer', fontSize: '0.75rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >✕</button>
                  {p.category && (
                    <span style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.65rem', padding: '2px 7px', borderRadius: 4 }}>
                      {p.category}
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <p className="muted" style={{ fontSize: '0.76rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.caption || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      }

      <style>{`
        @media(max-width:640px){ .grid-4 { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}

// ─── Dashboard Shell ───
export default function AdminDashboard() {
  const { logout } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  const [tab, setTab] = useState('Leads');

  const tabIcons = { Leads: '📋', Applications: '📄', Products: '📦', Jobs: '💼', Gallery: '🖼️' };
  const TabComponent = { Leads: LeadsTab, Applications: ApplicationsTab, Products: ProductsTab, Jobs: JobsTab, Gallery: GalleryTab }[tab];

  return (
    <section className="section">
      <div className="container">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
            <p className="muted" style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>Digital Navigation — Content Management</p>
          </div>
          <button className="btn btn-sm" onClick={logout}>Sign Out</button>
        </div>

        {/* Tab bar */}
        <div className="neu-inset" style={{ display: 'flex', gap: 4, padding: 4, marginBottom: 'var(--space-4)', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, minWidth: 'max-content', padding: '10px 16px', border: 'none', borderRadius: 'var(--radius-sm)',
                background: tab === t ? 'var(--surface)' : 'transparent',
                boxShadow: tab === t ? 'var(--shadow-raised-sm)' : 'none',
                fontWeight: tab === t ? 700 : 500, fontSize: '0.88rem',
                color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'var(--transition)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <span>{tabIcons[t]}</span>{t}
            </button>
          ))}
        </div>

        <TabComponent toast={{ success, error }} />
      </div>
    </section>
  );
}
