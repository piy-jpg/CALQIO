import { state } from './state.js';
import { Dashboard } from './ui/dashboard.js';
import { Workspace } from './ui/workspace.js';
import { HistoryView } from './ui/historyView.js';
import { FavoritesView } from './ui/favoritesView.js';
import { RecentlyUsedView } from './ui/recentlyUsedView.js';
import { CategoryView } from './ui/categoryView.js';
import { SettingsView } from './ui/settingsView.js';
import { getTopLevelCategory, MASTER_TAXONOMY } from './taxonomy.js';



export const Router = {
  mainContainer: null,

  init(containerEl) {
    this.mainContainer = containerEl;
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash || '#/';
    const cleanHash = hash.replace(/^#\/?/, '');

    // Teardown active calculator if navigating away
    if (!cleanHash.startsWith('calc/')) {
      Workspace.destroy();
    }

    if (!cleanHash || cleanHash === '') {
      state.set('currentRoute', { type: 'dashboard', params: {} });
      Dashboard.render(this.mainContainer);
    } else if (cleanHash.startsWith('calc/')) {
      const calcId = cleanHash.split('/')[1];
      state.set('currentRoute', { type: 'calculator', params: { id: calcId } });
      Workspace.render(this.mainContainer, calcId);
    } else if (cleanHash.startsWith('category/')) {
      const catId = cleanHash.split('/')[1];
      state.set('currentRoute', { type: 'category', params: { id: catId } });
      CategoryView.render(this.mainContainer, catId);
    } else if (cleanHash === 'history') {
      state.set('currentRoute', { type: 'history', params: {} });
      HistoryView.render(this.mainContainer);
    } else if (cleanHash === 'favorites') {
      state.set('currentRoute', { type: 'favorites', params: {} });
      FavoritesView.render(this.mainContainer);
    } else if (cleanHash === 'recent') {
      state.set('currentRoute', { type: 'recent', params: {} });
      RecentlyUsedView.render(this.mainContainer);
    } else if (cleanHash === 'settings') {
      state.set('currentRoute', { type: 'settings', params: {} });
      SettingsView.render(this.mainContainer);
    } else if (getTopLevelCategory(cleanHash) || MASTER_TAXONOMY[cleanHash]) {
      // Support clean direct URLs: #/math, #/finance, #/data-statistics, #/engineering, etc.
      state.set('currentRoute', { type: 'category', params: { id: cleanHash } });
      CategoryView.render(this.mainContainer, cleanHash);
    } else {
      state.set('currentRoute', { type: 'dashboard', params: {} });
      Dashboard.render(this.mainContainer);
    }

    if (this.mainContainer) this.mainContainer.scrollTop = 0;
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }
};
