import apiClient from './apiClient';

const USER_STORAGE_KEY = 'bite_ledger_user';

/**
 * Pre-hash password using native Web Crypto API (SHA-256)
 * Keeps plaintext password out of the network payload
 */
async function hashPassword(plainText) {
  if (!plainText) return '';
  // If already a 64-char hex string (SHA-256), return as-is
  if (/^[a-f0-9]{64}$/i.test(plainText)) {
    return plainText.toLowerCase();
  }
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback if crypto.subtle is unavailable
  return plainText;
}

export const authService = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    const res = await apiClient.get('/health');
    return {
      status: res.status,
      latencyMs: res.latencyMs,
      data: res.data,
    };
  },

  /**
   * Login with email and password (pre-hashed with SHA-256)
   */
  async login(email, password) {
    const hashedPassword = await hashPassword(password);
    const res = await apiClient.post('/v1/auth/login', { email, password: hashedPassword });
    
    // Structure: { status: 'success', message: '...', data: { user } }
    const result = res.data;
    if (result?.data?.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.data.user));
    }
    if (result?.data?.access_token) {
      apiClient.setToken(result.data.access_token);
    }
    return {
      ...result,
      latencyMs: res.latencyMs,
    };
  },

  /**
   * Get authenticated user profile & permissions
   */
  async getMe() {
    const res = await apiClient.get('/v1/auth/me');
    if (res.data?.data) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.data));
    }
    return {
      ...res.data,
      latencyMs: res.latencyMs,
    };
  },

  /**
   * Log out and clear stored session
   */
  async logout() {
    try {
      await apiClient.post('/v1/auth/logout');
    } catch {
      // ignore network errors
    }
    apiClient.setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Get cached user profile
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated (checks cached user)
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  getToken() {
    return apiClient.getToken();
  }
};

export default authService;
