import { state } from './state.js';
import { Dashboard } from './ui/dashboard.js';
import { Workspace } from './ui/workspace.js';
import { HistoryView } from './ui/historyView.js';
import { FavoritesView } from './ui/favoritesView.js';
import { RecentlyUsedView } from './ui/recentlyUsedView.js';
import { CategoryView } from './ui/categoryView.js';
import { SettingsView } from './ui/settingsView.js';
import { getTopLevelCategory, MASTER_TAXONOMY } from './taxonomy.js';
import { CALCULATORS_MAP } from './registry.js';

export const Router = {
  mainContainer: null,
  isListening: false,

  init(containerEl) {
    this.mainContainer = containerEl;

    if (!this.isListening) {
      window.addEventListener('popstate', () => this.handleRoute());
      window.addEventListener('hashchange', () => this.handleRoute());

      // Global internal link interceptor for clean HTML5 URL navigation
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Skip non-standard clicks (new tab, download, external)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (link.target && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Internal hash or clean path routing
        if (href.startsWith('#/')) {
          e.preventDefault();
          this.navigate(href.replace(/^#\/?/, '/'));
        } else if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/api/')) {
          e.preventDefault();
          this.navigate(href);
        }
      });

      this.isListening = true;
    }

    this.handleRoute();
  },

  navigate(path) {
    let clean = (path || '/').trim();
    if (clean.startsWith('#/')) {
      clean = clean.replace(/^#\/?/, '/');
    }
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }
    if (window.location.pathname !== clean) {
      window.history.pushState(null, '', clean);
    }
    this.handleRoute();
  },

  handleRoute() {
    let cleanPath = '';

    // 1. Backward compatibility: if hash route is present (#/calc/emi), redirect to clean URL
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      cleanPath = window.location.hash.replace(/^#\/?/, '');
      const cleanUrl = '/' + cleanPath;
      if (typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', cleanUrl);
      }
    } else {
      // 2. Read clean HTML5 pathname
      cleanPath = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      if (cleanPath === 'index.html') cleanPath = '';
    }

    // Teardown active calculator if navigating away
    if (!cleanPath.startsWith('calc/')) {
      Workspace.destroy();
    }

    if (!cleanPath || cleanPath === '') {
      state.set('currentRoute', { type: 'dashboard', params: {} });
      this.updateMetadata('dashboard');
      Dashboard.render(this.mainContainer);
    } else if (cleanPath.startsWith('calc/')) {
      const calcId = cleanPath.split('/')[1];
      state.set('currentRoute', { type: 'calculator', params: { id: calcId } });
      this.updateMetadata('calculator', calcId);
      Workspace.render(this.mainContainer, calcId);
    } else if (cleanPath.startsWith('category/')) {
      const catId = cleanPath.split('/')[1];
      state.set('currentRoute', { type: 'category', params: { id: catId } });
      this.updateMetadata('category', catId);
      CategoryView.render(this.mainContainer, catId);
    } else if (cleanPath === 'history') {
      state.set('currentRoute', { type: 'history', params: {} });
      this.updateMetadata('history');
      HistoryView.render(this.mainContainer);
    } else if (cleanPath === 'favorites') {
      state.set('currentRoute', { type: 'favorites', params: {} });
      this.updateMetadata('favorites');
      FavoritesView.render(this.mainContainer);
    } else if (cleanPath === 'recent') {
      state.set('currentRoute', { type: 'recent', params: {} });
      this.updateMetadata('recent');
      RecentlyUsedView.render(this.mainContainer);
    } else if (cleanPath === 'settings') {
      state.set('currentRoute', { type: 'settings', params: {} });
      this.updateMetadata('settings');
      SettingsView.render(this.mainContainer);
    } else if (getTopLevelCategory(cleanPath) || MASTER_TAXONOMY[cleanPath]) {
      // Clean category URLs: /math, /finance, /engineering, etc.
      state.set('currentRoute', { type: 'category', params: { id: cleanPath } });
      this.updateMetadata('category', cleanPath);
      CategoryView.render(this.mainContainer, cleanPath);
    } else {
      state.set('currentRoute', { type: 'dashboard', params: {} });
      this.updateMetadata('dashboard');
      Dashboard.render(this.mainContainer);
    }

    if (this.mainContainer) this.mainContainer.scrollTop = 0;
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  },

  updateMetadata(type, id) {
    if (typeof document === 'undefined') return;

    let title = 'CALQIO — The Modern Multi-Calculator Platform | 289+ Solvers';
    let desc = 'CALQIO is a precision multi-calculator platform featuring 289+ solvers for mathematics, engineering, finance, health, physics, and unit conversions.';
    let canonical = 'https://calqio.townhub.site/';

    if (type === 'calculator' && id) {
      const calc = CALCULATORS_MAP.get(id);
      if (calc) {
        title = `${calc.name} — Free Online Calculator | CALQIO`;
        desc = calc.description || `Instant ${calc.name} calculator with step-by-step formula breakdown, precision calculation, and history tracking.`;
        canonical = `https://calqio.townhub.site/calc/${calc.id}`;
      }
    } else if (type === 'category' && id) {
      const cat = getTopLevelCategory(id) || MASTER_TAXONOMY[id];
      const catName = cat?.name || id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      title = `${catName} Calculators & Technical Solvers | CALQIO`;
      desc = `Access precision online ${catName} calculators, engineering tools, and mathematical solvers on CALQIO.`;
      canonical = `https://calqio.townhub.site/category/${id}`;
    }

    document.title = title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', canonical);
  }
};

if (typeof window !== 'undefined') {
  window.Router = Router;
}
