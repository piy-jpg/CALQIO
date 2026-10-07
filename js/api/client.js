/**
 * CALQIO Frontend API Client
 * Manages REST requests, Bearer JWT token headers, and standardized error extraction.
 */

const TOKEN_KEY = 'calqio_jwt_token';

export const ApiClient = {
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Could not store token:', e);
    }
  },

  removeToken() {
    this.setToken(null);
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const res = await fetch(endpoint, config);
      const json = await res.json().catch(() => ({ success: false, error: 'Invalid server response' }));

      if (!res.ok || json.success === false) {
        const errorMsg = json.error || `HTTP ${res.status}: ${res.statusText}`;
        const err = new Error(errorMsg);
        err.status = res.status;
        err.data = json;
        throw err;
      }

      return json.data !== undefined ? json.data : json;
    } catch (err) {
      console.warn(`[API Client] ${options.method || 'GET'} ${endpoint} failed:`, err.message);
      throw err;
    }
  },

  get(endpoint, params = {}) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        qs.append(k, v);
      }
    }
    const query = qs.toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
