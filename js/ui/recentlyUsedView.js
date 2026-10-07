/**
 * CALQIO Recently Used Calculators View
 * Fast jumping to recently active tools with category grouping and favorite pins.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';
import { CALCULATORS_LIST, CATEGORIES } from '../registry.js';
import { state } from '../state.js';
import { TOP_LEVEL_CATEGORIES, getParentCategoryForDomain } from '../taxonomy.js';

export const RecentlyUsedView = {
  currentFilter: 'all',

  render(container) {
    const recents = Storage.getRecentCalcs();
    const recentCalcs = recents.map(id => CALCULATORS_LIST.find(c => c.id === id)).filter(Boolean);

    // Group domain categories for filter chips
    const categoriesMap = {};
    recentCalcs.forEach(c => {
      const topCatKey = getParentCategoryForDomain(c.category);
      const topCat = TOP_LEVEL_CATEGORIES[topCatKey] || { name: c.category, icon: 'calculator' };
      if (!categoriesMap[topCatKey]) {
        categoriesMap[topCatKey] = { name: topCat.name, count: 0, key: topCatKey };
      }
      categoriesMap[topCatKey].count++;
    });

    const filteredCalcs = recentCalcs.filter(calc => {
      return this.currentFilter === 'all' || getParentCategoryForDomain(calc.category) === this.currentFilter;
    });

    container.innerHTML = `
      <div class="main-container">
        <!-- HERO BANNER -->
        <div class="util-hero-card">
          <div class="util-hero-main">
            <div class="util-hero-icon" style="background: var(--accent-primary-light); color: var(--accent-primary); border: 1px solid var(--accent-primary-border);">
              ${getIcon('recent')}
            </div>
            <div>
              <h1 class="util-hero-title">
                Recently Used Tools
                <span class="badge badge-primary" style="font-size:0.75rem; vertical-align:middle;">RECENTS</span>
              </h1>
              <p class="util-hero-desc">Quickly jump back into calculators and converters you launched recently.</p>
            </div>
          </div>
          <div class="util-hero-stats">
            <div class="util-stat-pill">
              <span>Recent Sessions:</span>
              <strong>${recentCalcs.length}</strong>
            </div>
            ${recentCalcs.length > 0 ? `
              <button id="recents-clear-all-btn" class="btn btn-subtle btn-sm" style="color: var(--accent-danger);" title="Clear recents">
                ${getIcon('trash')} Clear
              </button>
            ` : ''}
          </div>
        </div>

        ${recentCalcs.length === 0 ? `
          <div class="card" style="text-align:center; padding: 4.5rem 1.5rem; color: var(--text-muted); border-radius: var(--radius-2xl);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏱️</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">No Recent Activity</h3>
            <p style="font-size: 0.925rem; max-width: 440px; margin: 0 auto 1.75rem auto; line-height: 1.5;">Calculators and engineering solvers you launch will automatically appear here for rapid resuming.</p>
            <div style="display:flex; justify-content:center; gap: 0.75rem;">
              <a href="#/" class="btn btn-primary">Browse All 118+ Tools</a>
              <a href="#/calc/basic" class="btn btn-secondary">Open Basic Studio</a>
            </div>
          </div>
        ` : `
          <!-- FILTER TOOLBAR -->
          ${Object.keys(categoriesMap).length > 1 ? `
            <div class="util-filter-bar">
              <div class="util-filter-chips">
                <button class="filter-chip-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-cat="all">
                  All <span class="chip-count">${recentCalcs.length}</span>
                </button>
                ${Object.values(categoriesMap).map(cat => `
                  <button class="filter-chip-btn ${this.currentFilter === cat.key ? 'active' : ''}" data-cat="${cat.key}">
                    ${cat.name} <span class="chip-count">${cat.count}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- RECENT CALCS GRID -->
          <div class="cards-grid">
            ${filteredCalcs.map(calc => {
              const isFav = Storage.isFavorite(calc.id);
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
                    <button class="calc-card-favorite-btn ${isFav ? 'active' : ''}" data-fav-id="${calc.id}" title="${isFav ? 'Remove Favorite' : 'Add to Favorites'}" aria-label="Favorite">
                      ${getIcon(isFav ? 'starFilled' : 'star')}
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
        btn.classList.toggle('active', isAdded);
        btn.innerHTML = getIcon(isAdded ? 'starFilled' : 'star');
        Toast.info(isAdded ? 'Added to favorites' : 'Removed from favorites');
      });
    });

    // Filter chip switching
    container.querySelectorAll('.filter-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.cat;
        this.render(container);
      });
    });

    // Clear all
    const clearBtn = container.querySelector('#recents-clear-all-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your recently used history?')) {
          localStorage.setItem('calqio_recent_calcs', JSON.stringify([]));
          Toast.success('Recent tools cleared');
          this.render(container);
        }
      });
    }
  }
};

