import { ApiClient } from './client.js';

export const FavoritesApi = {
  async getFavorites() {
    return await ApiClient.get('/api/favorites');
  },

  async addFavorite(calculatorSlug) {
    return await ApiClient.post('/api/favorites', { calculator_slug: calculatorSlug });
  },

  async removeFavorite(calculatorSlug) {
    return await ApiClient.delete(`/api/favorites/${calculatorSlug}`);
  },

  async syncFavorites(favoritesList) {
    return await ApiClient.post('/api/favorites/sync', { favorites: favoritesList });
  }
};
