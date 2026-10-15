import apiClient from './apiClient';

async function hashPassword(plainText) {
  if (!plainText) return '';
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

  return plainText;
}

export const userService = {
  async getUsers({ page = 1, limit = 10, search = '', roleId = '' } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search && search.trim()) params.append('search', search.trim());
    if (roleId) params.append('roleId', roleId);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/v1/users${query}`);
    return res.data;
  },

  async getRoles() {
    const res = await apiClient.get('/v1/users/roles');
    return res.data;
  },

  async getUserById(id) {
    const res = await apiClient.get(`/v1/users/${id}`);
    return res.data;
  },

  async createUser({ name, email, password, roleId }) {
    const hashedPassword = await hashPassword(password);
    const res = await apiClient.post('/v1/users', {
      name,
      email,
      password: hashedPassword,
      roleId,
    });
    return res.data;
  },

  async updateUser(id, { name, email, password, roleId }) {
    const payload = {};
    if (name) payload.name = name;
    if (email) payload.email = email;
    if (roleId) payload.roleId = roleId;
    if (password && password.trim() !== '') {
      payload.password = await hashPassword(password);
    }

    const res = await apiClient.put(`/v1/users/${id}`, payload);
    return res.data;
  },

  async deleteUser(id) {
    const res = await apiClient.delete(`/v1/users/${id}`);
    return res.data;
  },
};

export default userService;
