import { ApiClient } from './client.js';

export const SettingsApi = {
  async getSettings() {
    return await ApiClient.get('/api/settings');
  },

  async saveSettings(settings) {
    return await ApiClient.put('/api/settings', settings);
  }
};
