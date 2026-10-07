import { ApiClient } from './client.js';

export const CategoryApi = {
  async getAll() {
    return await ApiClient.get('/api/categories');
  },

  async getBySlug(slug) {
    return await ApiClient.get(`/api/categories/${slug}`);
  }
};
