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

  async googleLogin(googleUserData) {
    try {
      const data = await ApiClient.post('/api/auth/google', googleUserData);
      if (data && data.token) {
        ApiClient.setToken(data.token);
      }
      return data;
    } catch (e) {
      // Create local session token for offline / static hosting
      const mockToken = 'g_token_' + btoa(JSON.stringify({ email: googleUserData.email, id: googleUserData.googleId, exp: Date.now() + 86400000 * 30 }));
      ApiClient.setToken(mockToken);
      return {
        success: true,
        token: mockToken,
        user: {
          id: googleUserData.googleId || 'g_' + Date.now(),
          email: googleUserData.email,
          name: googleUserData.name,
          avatar: googleUserData.avatar,
          role: 'user',
          provider: 'google'
        }
      };
    }
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
