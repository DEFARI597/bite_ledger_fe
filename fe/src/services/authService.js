import apiClient from './apiClient';

const USER_STORAGE_KEY = 'bite_ledger_user';

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
   * Login with email and password
   */
  async login(email, password) {
    const res = await apiClient.post('/v1/auth/login', { email, password });
    
    // Structure: { status: 'success', message: '...', data: { access_token, token_type, expires_in, user } }
    const result = res.data;
    if (result?.data?.access_token) {
      apiClient.setToken(result.data.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.data.user));
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
  logout() {
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
   * Check if user token is present
   */
  isAuthenticated() {
    return !!apiClient.getToken();
  },

  getToken() {
    return apiClient.getToken();
  }
};

export default authService;
