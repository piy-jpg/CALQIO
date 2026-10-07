import { ApiClient } from './client.js';

export const CalculatorApi = {
  async getAll(params = {}) {
    return await ApiClient.get('/api/calculators', params);
  },

  async getPopular() {
    return await ApiClient.get('/api/calculators/popular');
  },

  async getBySlug(slug) {
    return await ApiClient.get(`/api/calculators/${slug}`);
  },

  async getByCategory(categorySlug) {
    return await ApiClient.get(`/api/calculators/category/${categorySlug}`);
  }
};
