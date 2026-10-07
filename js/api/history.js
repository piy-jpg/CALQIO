import { ApiClient } from './client.js';

export const HistoryApi = {
  async getHistory(limit = 50) {
    return await ApiClient.get('/api/history', { limit });
  },

  async addHistory(entry) {
    return await ApiClient.post('/api/history', entry);
  },

  async removeHistory(id) {
    return await ApiClient.delete(`/api/history/${id}`);
  },

  async clearHistory() {
    return await ApiClient.delete('/api/history');
  },

  async syncHistory(historyList) {
    return await ApiClient.post('/api/history/sync', { history: historyList });
  }
};
