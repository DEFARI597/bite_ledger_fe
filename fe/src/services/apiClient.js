const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('bite_ledger_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('bite_ledger_token', token);
    } else {
      localStorage.removeItem('bite_ledger_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers = {
      Accept: 'application/json',
      ...options.headers,
    };

    // Only set application/json if not sending FormData (browser automatically sets boundary for FormData)
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      credentials: 'include',
      ...options,
      headers,
    };

    const startTime = performance.now();

    try {
      const response = await fetch(url, config);
      const latencyMs = Math.round(performance.now() - startTime);

      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        const errorMessage = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        error.latencyMs = latencyMs;
        throw error;
      }

      return {
        data,
        status: response.status,
        latencyMs,
      };
    } catch (err) {
      if (!err.latencyMs) {
        err.latencyMs = Math.round(performance.now() - startTime);
      }
      throw err;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body = {}, headers = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  patch(endpoint, body = {}, headers = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      method: 'PATCH',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body = {}, headers = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
