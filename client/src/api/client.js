const API = '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API;
  }

  _token() {
    try {
      return JSON.parse(localStorage.getItem('auth') || '{}').token || '';
    } catch {
      return '';
    }
  }

  async request(path, opts = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = { ...opts.headers };
    if (!(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this._token();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || 'Request failed.');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // Auth
  login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  sendOtp(email) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  verifyOtp(email, code) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Applications
  submitApplication(formData) {
    return this.request('/applications', {
      method: 'POST',
      body: formData,
    });
  }

  getMyApplications() {
    return this.request('/applications/mine');
  }

  getApplications(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/applications${qs ? '?' + qs : ''}`);
  }

  updateApplicationStatus(id, status) {
    return this.request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Products (public)
  getProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/products${qs ? '?' + qs : ''}`);
  }
  getProduct(slug) {
    return this.request(`/products/${slug}`);
  }

  // Products (admin)
  createProduct(data) {
    return this.request('/products', { method: 'POST', body: JSON.stringify(data) });
  }
  updateProduct(id, data) {
    return this.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }
  uploadProductImage(formData) {
    return this.request('/products/upload-image', { method: 'POST', body: formData });
  }

  // Jobs (public)
  getJobs(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/jobs${qs ? '?' + qs : ''}`);
  }
  getJob(slug) {
    return this.request(`/jobs/${slug}`);
  }

  // Jobs (admin)
  createJob(data) {
    return this.request('/jobs', { method: 'POST', body: JSON.stringify(data) });
  }
  updateJob(id, data) {
    return this.request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  deleteJob(id) {
    return this.request(`/jobs/${id}`, { method: 'DELETE' });
  }

  // Leads (public)
  submitLead(data) {
    return this.request('/leads', { method: 'POST', body: JSON.stringify(data) });
  }

  // Leads (admin)
  getLeads(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/leads${qs ? '?' + qs : ''}`);
  }
  updateLeadStatus(id, status) {
    return this.request(`/leads/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
  deleteLead(id) {
    return this.request(`/leads/${id}`, { method: 'DELETE' });
  }

  // Gallery (public)
  getGallery(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/gallery${qs ? '?' + qs : ''}`);
  }

  // Gallery (admin)
  uploadPhoto(formData) {
    return this.request('/gallery', {
      method: 'POST',
      body: formData,
    });
  }
  updatePhoto(id, data) {
    return this.request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  deletePhoto(id) {
    return this.request(`/gallery/${id}`, { method: 'DELETE' });
  }
}

const api = new ApiClient();
export default api;
