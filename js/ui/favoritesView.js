/**
 * CALQIO Favorites View
 * Modern studio workspace for pinned calculators with domain filters and quick search.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';
import { CALCULATORS_LIST, CATEGORIES } from '../registry.js';
import { state } from '../state.js';
import { TOP_LEVEL_CATEGORIES, getParentCategoryForDomain } from '../taxonomy.js';

export const FavoritesView = {
  currentFilter: 'all',
  searchQuery: '',

  render(container) {
    const favorites = Storage.getFavorites();
    const favCalcs = favorites.map(id => CALCULATORS_LIST.find(c => c.id === id)).filter(Boolean);

    // Group categories for filter chips
    const categoriesMap = {};
    favCalcs.forEach(c => {
      const topCatKey = getParentCategoryForDomain(c.category);
      const topCat = TOP_LEVEL_CATEGORIES[topCatKey] || { name: c.category, icon: 'calculator' };
      if (!categoriesMap[topCatKey]) {
        categoriesMap[topCatKey] = { name: topCat.name, count: 0, key: topCatKey };
      }
      categoriesMap[topCatKey].count++;
    });

    const filteredCalcs = favCalcs.filter(calc => {
      const matchesFilter = this.currentFilter === 'all' || getParentCategoryForDomain(calc.category) === this.currentFilter;
      const matchesQuery = !this.searchQuery || 
        calc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        calc.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesFilter && matchesQuery;
    });

    container.innerHTML = `
      <div class="main-container">
        <!-- HERO BANNER -->
        <div class="util-hero-card">
          <div class="util-hero-main">
            <div class="util-hero-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">
              ${getIcon('starFilled')}
            </div>
            <div>
              <h1 class="util-hero-title">
                Favorite Calculators
                <span class="badge badge-primary" style="font-size:0.75rem; vertical-align:middle;">PINNED</span>
              </h1>
              <p class="util-hero-desc">Your curated workspace of frequently accessed solvers and computation tools.</p>
            </div>
          </div>
          <div class="util-hero-stats">
            <div class="util-stat-pill">
              <span>Saved Tools:</span>
              <strong>${favCalcs.length}</strong>
            </div>
            ${favCalcs.length > 0 ? `
              <button id="fav-clear-all-btn" class="btn btn-subtle btn-sm" style="color: var(--accent-danger);" title="Clear all favorites">
                ${getIcon('trash')} Clear All
              </button>
            ` : ''}
          </div>
        </div>

        ${favCalcs.length === 0 ? `
          <div class="card" style="text-align:center; padding: 4.5rem 1.5rem; color: var(--text-muted); border-radius: var(--radius-2xl);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">No Favorites Saved Yet</h3>
            <p style="font-size: 0.925rem; max-width: 440px; margin: 0 auto 1.75rem auto; line-height: 1.5;">Click the star icon on any calculator card or studio workspace to pin it here for rapid, one-click access.</p>
            <div style="display:flex; justify-content:center; gap: 0.75rem;">
              <a href="#/" class="btn btn-primary">Browse All 118+ Tools</a>
              <a href="#/calc/basic" class="btn btn-secondary">Open Basic Studio</a>
            </div>
          </div>
        ` : `
          <!-- FILTER & SEARCH TOOLBAR -->
          <div class="util-filter-bar">
            <div class="util-filter-chips">
              <button class="filter-chip-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-cat="all">
                All <span class="chip-count">${favCalcs.length}</span>
              </button>
              ${Object.values(categoriesMap).map(cat => `
                <button class="filter-chip-btn ${this.currentFilter === cat.key ? 'active' : ''}" data-cat="${cat.key}">
                  ${cat.name} <span class="chip-count">${cat.count}</span>
                </button>
              `).join('')}
            </div>

            <div class="form-group" style="margin-bottom:0; width: 260px;">
              <div class="input-wrapper has-prefix">
                <span class="input-prefix">${getIcon('search')}</span>
                <input type="text" id="fav-search-input" class="input-field" placeholder="Search saved..." value="${this.searchQuery}">
              </div>
            </div>
          </div>

          <!-- FAVORITES GRID -->
          ${filteredCalcs.length === 0 ? `
            <div class="card" style="text-align:center; padding: 3rem 1rem; color: var(--text-muted); border-radius: var(--radius-xl);">
              <p>No favorites match your current filter or search query.</p>
            </div>
          ` : `
            <div class="cards-grid">
              ${filteredCalcs.map(calc => {
                const cat = CATEGORIES[calc.category] || { name: calc.category };
                const topCatKey = getParentCategoryForDomain(calc.category);
                const topCat = TOP_LEVEL_CATEGORIES[topCatKey];
                const domainLabel = topCat && topCat.name !== cat.name ? `${topCat.name} • ${cat.name}` : cat.name;

                return `
                  <div class="calc-card" data-calc-id="${calc.id}" style="cursor:pointer;">
                    <div class="calc-card-top">
                      <div class="calc-card-icon">
                        ${getIcon(calc.icon)}
                      </div>
                      <button class="calc-card-favorite-btn active" data-fav-id="${calc.id}" title="Remove from favorites" aria-label="Favorite">
                        ${getIcon('starFilled')}
                      </button>
                    </div>

                    <div>
                      <h4 class="calc-card-title">${calc.name}</h4>
                      <p class="calc-card-desc">${calc.description}</p>
                    </div>

                    <div class="calc-card-bottom">
                      <span class="calc-card-category">${domainLabel}</span>
                      <a href="#/calc/${calc.id}" class="calc-card-arrow" aria-label="Open ${calc.name}">
                        ${getIcon('arrowRight')}
                      </a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        `}
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    container.querySelectorAll('.calc-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.calc-card-favorite-btn')) return;
        const id = card.dataset.calcId;
        window.location.hash = `#/calc/${id}`;
      });
    });

    container.querySelectorAll('.calc-card-favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.favId;
        const isAdded = Storage.toggleFavorite(id);
        state.set('favorites', Storage.getFavorites());
        Toast.info(isAdded ? 'Added to favorites' : 'Removed from favorites');
        this.render(container);
      });
    });

    // Filter chip switching
    container.querySelectorAll('.filter-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.cat;
        this.render(container);
      });
    });

    // Search input
    const searchInput = container.querySelector('#fav-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
        const refocused = container.querySelector('#fav-search-input');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(this.searchQuery.length, this.searchQuery.length);
        }
      });
    }

    // Clear all
    const clearBtn = container.querySelector('#fav-clear-all-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all your saved favorites?')) {
          localStorage.setItem('calqio_favorites', JSON.stringify([]));
          state.set('favorites', []);
          Toast.success('All favorites cleared');
          this.render(container);
        }
      });
    }
  }
};

