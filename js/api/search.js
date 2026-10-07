import { ApiClient } from './client.js';

export const SearchApi = {
  async search(query) {
    return await ApiClient.get('/api/search', { q: query });
  }
};
