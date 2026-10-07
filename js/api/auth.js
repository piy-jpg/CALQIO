import { ApiClient } from './client.js';

export const AuthApi = {
  async register(name, email, password) {
    const data = await ApiClient.post('/api/auth/register', { name, email, password });
    if (data.token) {
      ApiClient.setToken(data.token);
    }
    return data;
  },

  async login(email, password) {
    const data = await ApiClient.post('/api/auth/login', { email, password });
    if (data.token) {
      ApiClient.setToken(data.token);
    }
    return data;
  },

  async getMe() {
    return await ApiClient.get('/api/auth/me');
  },

  async updateProfile(profileData) {
    return await ApiClient.put('/api/auth/profile', profileData);
  },

  logout() {
    ApiClient.removeToken();
  },

  isAuthenticated() {
    return Boolean(ApiClient.getToken());
  }
};
