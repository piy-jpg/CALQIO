/**
 * CALQIO Hybrid Storage Manager
 * Seamlessly manages local persistence for guests and background PostgreSQL sync for authenticated users.
 */

import { AuthApi } from './api/auth.js';
import { FavoritesApi } from './api/favorites.js';
import { HistoryApi } from './api/history.js';
import { SettingsApi } from './api/settings.js';

const STORAGE_KEYS = {
  THEME: 'calqio_theme',
  FAVORITES: 'calqio_favorites',
  HISTORY: 'calqio_history',
  SETTINGS: 'calqio_settings',
  RECENT_CALCS: 'calqio_recent_calcs',
  USER: 'calqio_user'
};

const DEFAULT_SETTINGS = {
  currency: '₹',
  decimals: 2,
  historyRetention: true,
  soundEffects: false
};

const DEFAULT_FAVORITES = ['basic', 'percentage', 'emi', 'bmi', 'gst', 'age'];

export const Storage = {
  // User Session Persistence
  getCurrentUser() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    try {
      if (typeof localStorage !== 'undefined') {
        if (user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    } catch (e) {
      console.warn('LocalStorage error (setCurrentUser):', e);
    }
  },

  removeCurrentUser() {
    this.setCurrentUser(null);
  },

  // Theme
  getTheme() {
    try {
      if (typeof localStorage === 'undefined') return 'light';
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    } catch (e) {
      return 'light';
    }
  },

  setTheme(theme) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  // Favorites
  getFavorites() {
    try {
      if (typeof localStorage === 'undefined') return DEFAULT_FAVORITES;
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : DEFAULT_FAVORITES;
    } catch (e) {
      return DEFAULT_FAVORITES;
    }
  },

  isFavorite(calcId) {
    const favs = this.getFavorites();
    return favs.includes(calcId);
  },

  toggleFavorite(calcId) {
    let favs = this.getFavorites();
    const index = favs.indexOf(calcId);
    let isAdded = false;
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(calcId);
      isAdded = true;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Async Cloud Sync if logged in
    if (AuthApi.isAuthenticated()) {
      if (isAdded) {
        FavoritesApi.addFavorite(calcId).catch(err => console.warn('Cloud sync error (add favorite):', err.message));
      } else {
        FavoritesApi.removeFavorite(calcId).catch(err => console.warn('Cloud sync error (remove favorite):', err.message));
      }
    }

    return isAdded;
  },

  // Calculation History
  getHistory() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addHistory(entry) {
    try {
      const settings = this.getSettings();
      if (!settings.historyRetention) return;

      const history = this.getHistory();
      const newEntry = {
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        calcId: entry.calcId,
        calcName: entry.calcName,
        expression: entry.expression,
        result: entry.result,
        inputs: entry.inputs || {},
        timestamp: Date.now()
      };

      // Put latest first, limit to 100 entries
      const updated = [newEntry, ...history.filter(h => h.expression !== newEntry.expression || h.calcId !== newEntry.calcId)].slice(0, 100);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      }

      // Async Cloud Sync if logged in
      if (AuthApi.isAuthenticated()) {
        HistoryApi.addHistory({
          calcId: entry.calcId,
          calcName: entry.calcName,
          expression: entry.expression,
          result: entry.result,
          inputs: entry.inputs
        }).catch(err => console.warn('Cloud sync error (add history):', err.message));
      }

      return newEntry;
    } catch (e) {
      console.warn('LocalStorage error saving history:', e);
    }
  },

  removeHistoryItem(id) {
    try {
      const history = this.getHistory().filter(item => item.id !== id);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      }
      if (AuthApi.isAuthenticated() && typeof id === 'number') {
        HistoryApi.removeHistory(id).catch(err => console.warn('Cloud sync error (remove history):', err.message));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  clearHistory() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
      }
      if (AuthApi.isAuthenticated()) {
        HistoryApi.clearHistory().catch(err => console.warn('Cloud sync error (clear history):', err.message));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  // Recently used calculators
  getRecentCalcs() {
    try {
      if (typeof localStorage === 'undefined') return ['basic', 'percentage', 'emi'];
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_CALCS);
      return data ? JSON.parse(data) : ['basic', 'percentage', 'emi'];
    } catch (e) {
      return ['basic', 'percentage', 'emi'];
    }
  },

  recordCalcUsage(calcId) {
    try {
      const recents = this.getRecentCalcs().filter(id => id !== calcId);
      const updated = [calcId, ...recents].slice(0, 6);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.RECENT_CALCS, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  // Settings
  getSettings() {
    try {
      if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(newSettings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      }
      if (AuthApi.isAuthenticated()) {
        SettingsApi.saveSettings(updated).catch(err => console.warn('Cloud sync error (save settings):', err.message));
      }
      return updated;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Sync Guest Local Data to Backend Account on Login
   */
  async syncGuestDataToServer() {
    if (!AuthApi.isAuthenticated()) return;

    try {
      const localFavs = this.getFavorites();
      const localHistory = this.getHistory();

      // Batch sync favorites
      if (localFavs && localFavs.length > 0) {
        const syncedFavs = await FavoritesApi.syncFavorites(localFavs);
        if (Array.isArray(syncedFavs) && typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(syncedFavs));
        }
      }

      // Batch sync calculation history
      if (localHistory && localHistory.length > 0) {
        const syncedHistory = await HistoryApi.syncHistory(localHistory);
        if (Array.isArray(syncedHistory) && typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(syncedHistory));
        }
      }

      // Fetch user settings from server
      const serverMe = await AuthApi.getMe();
      if (serverMe && serverMe.settings && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(serverMe.settings));
      }
    } catch (err) {
      console.warn('Guest data synchronization failed:', err.message);
    }
  }
};
