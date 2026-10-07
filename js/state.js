/**
 * CALQIO Central Reactive State Management
 */

import { Storage } from './storage.js';
import { AuthApi } from './api/auth.js';

class StateStore {
  constructor() {
    this.state = {
      theme: Storage.getTheme(),
      currentRoute: { type: 'dashboard', params: {} },
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      commandPaletteOpen: false,
      authModalOpen: false,
      currentUser: null,
      favorites: Storage.getFavorites(),
      settings: Storage.getSettings()
    };
    this.listeners = new Map();
  }

  async initAuth() {
    // 1. Restore local cached user session immediately
    const cachedUser = Storage.getCurrentUser();
    if (cachedUser) {
      this.set('currentUser', cachedUser);
    }

    // 2. Validate with backend if connected
    if (AuthApi.isAuthenticated()) {
      try {
        const data = await AuthApi.getMe();
        if (data && data.user) {
          this.set('currentUser', data.user);
          Storage.setCurrentUser(data.user);
          if (data.favorites) {
            this.set('favorites', data.favorites);
          }
          if (data.settings) {
            this.set('settings', data.settings);
          }
        }
      } catch (err) {
        console.warn('Backend session verification note:', err.message);
        if (!cachedUser) {
          AuthApi.logout();
        }
      }
    }
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    this.emit(key, { value, oldValue });
    this.emit('*', { key, value, oldValue });
  }

  updateSettings(newSettings) {
    const updated = Storage.saveSettings(newSettings);
    this.set('settings', updated);
  }

  setTheme(theme) {
    Storage.setTheme(theme);
    this.set('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const current = this.get('theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.classList.add('theme-transitioning');
    this.setTheme(next);
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 250);
  }

  toggleFavorite(calcId) {
    const isAdded = Storage.toggleFavorite(calcId);
    const updated = Storage.getFavorites();
    this.set('favorites', updated);
    return isAdded;
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in state listener for ${event}:`, err);
        }
      });
    }
  }
}

export const state = new StateStore();
