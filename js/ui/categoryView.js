import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY, getTopLevelCategory } from '../taxonomy.js';
import { CALCULATORS_MAP } from '../registry.js';
import { Storage } from '../storage.js';
import { getIcon } from '../icons.js';
import { Toast } from '../toast.js';

export const CategoryView = {
  currentCatId: null,
  activeSubcategory: 'all',
  searchFilter: '',

  render(container, catId) {
    // 1. Resolve category via Top-Level or Domain fallback
    const topCat = getTopLevelCategory(catId);
    const domainCat = MASTER_TAXONOMY[catId];
    const cat = topCat || domainCat;

    if (!cat) {
      container.innerHTML = `
        <div class="main-container" style="text-align: center; padding: 4rem 1rem;">
          <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Category Not Found</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">The requested category "${catId}" could not be located.</p>
          <a href="#/" class="btn btn-primary">Return to Dashboard</a>
        </div>
      `;
      return;
    }

    this.currentCatId = catId;
    this.activeSubcategory = 'all';
    this.searchFilter = '';

    // Sections or subcategories
    const sections = cat.sections || cat.subcategories || [];

    // Collect all unique calculator IDs across sections
    const allItemIds = [];
    sections.forEach(sec => {
      sec.items.forEach(id => {
        if (!allItemIds.includes(id)) allItemIds.push(id);
      });
    });

    const categoryColor = cat.color || '#6366f1';

    container.innerHTML = `
      <div class="main-container">
        <!-- 1. Breadcrumb -->
        <nav class="cat-breadcrumb" aria-label="Breadcrumb">
          <a href="#/" class="cat-breadcrumb-link">Dashboard</a>
          <span class="cat-breadcrumb-separator">/</span>
          <span class="cat-breadcrumb-segment">Domains</span>
          <span class="cat-breadcrumb-separator">/</span>
          <span class="cat-breadcrumb-current" style="color: ${categoryColor};">${cat.name}</span>
        </nav>

        <!-- 2. Category Hero Banner -->
        <div class="category-hero-banner" style="--cat-accent: ${categoryColor};">
          <div class="category-hero-main">
            <div class="category-hero-icon-box" style="background: ${categoryColor}18; color: ${categoryColor}; border: 1px solid ${categoryColor}35;">
              ${getIcon(cat.icon)}
            </div>
            <div class="category-hero-content">
              <div class="category-hero-title-row">
                <h1 class="category-hero-title">${cat.name}</h1>
                <span class="badge badge-primary" style="background: ${categoryColor}18; color: ${categoryColor}; border-color: ${categoryColor}40;">
                  ${allItemIds.length} Verified Solvers
                </span>
                <span class="badge badge-subtle">Precision Engine</span>
              </div>
              <p class="category-hero-desc">${cat.description}</p>
            </div>
          </div>

          <!-- Hero Metrics Bar -->
          <div class="category-hero-stats">
            <div class="cat-stat-pill">
              <span class="cat-stat-num">${sections.length}</span>
              <span class="cat-stat-lbl">Sections</span>
            </div>
            <div class="cat-stat-pill">
              <span class="cat-stat-num">${allItemIds.length}</span>
              <span class="cat-stat-lbl">Tools</span>
            </div>
            <div class="cat-stat-pill">
              <span class="cat-stat-num">100%</span>
              <span class="cat-stat-lbl">Exact Math</span>
            </div>
          </div>
        </div>

        <!-- 3. Subcategory Filter Tabs & Search Bar -->
        <div class="category-filter-toolbar">
          <div class="segmented-control" id="cat-sub-tabs" style="max-width: 100%; overflow-x: auto;">
            <button class="segment-btn active" data-sub="all">
              <span>All Sections</span>
              <span class="tab-chip">${allItemIds.length}</span>
            </button>
            ${sections.map(sec => `
              <button class="segment-btn" data-sub="${sec.id}">
                <span>${sec.name}</span>
                <span class="tab-chip">${sec.items.length}</span>
              </button>
            `).join('')}
          </div>

          <div class="cat-search-box">
            <span class="cat-search-icon">${getIcon('search')}</span>
            <input type="text" id="cat-search-filter" class="cat-search-input" placeholder="Filter ${cat.name} solvers...">
          </div>
        </div>

        <!-- 4. Calculator Sections / Cards Container -->
        <div id="cat-cards-container" class="category-cards-container">
          ${this.renderCategoryContent(cat, sections)}
        </div>
      </div>
    `;

    this.bindEvents(container, cat, sections);
  },

  renderCategoryContent(cat, sections) {
    const categoryColor = cat.color || '#6366f1';

    // If user has a search query
    if (this.searchFilter) {
      const q = this.searchFilter.toLowerCase().trim();
      const allItemIds = [];
      sections.forEach(sec => {
        sec.items.forEach(id => {
          if (!allItemIds.includes(id)) allItemIds.push(id);
        });
      });

      const matchedIds = allItemIds.filter(id => {
        const c = CALCULATORS_MAP.get(id);
        const name = c ? c.name : id.replace(/_/g, ' ');
        const desc = c ? c.description : '';
        return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || id.toLowerCase().includes(q);
      });

      if (matchedIds.length === 0) {
        return `
          <div class="cat-empty-search">
            <div class="cat-empty-icon">${getIcon('search')}</div>
            <h3 class="cat-empty-title">No solvers found</h3>
            <p class="cat-empty-sub">No calculators match "${this.searchFilter}" in ${cat.name}.</p>
          </div>
        `;
      }

      return `
        <div class="cards-grid">
          ${matchedIds.map(id => this.renderCardHtml(id, cat)).join('')}
        </div>
      `;
    }

    // If user selected a specific section tab
    if (this.activeSubcategory !== 'all') {
      const activeSec = sections.find(s => s.id === this.activeSubcategory);
      if (!activeSec || activeSec.items.length === 0) {
        return `<div class="cat-empty-search"><p>No calculators in this section.</p></div>`;
      }

      return `
        <div class="cat-section-group">
          <div class="cat-section-header">
            <h3 class="cat-section-title">${activeSec.name}</h3>
            <span class="badge badge-subtle">${activeSec.items.length} tools</span>
          </div>
          <div class="cards-grid">
            ${activeSec.items.map(id => this.renderCardHtml(id, cat)).join('')}
          </div>
        </div>
      `;
    }

    // Default: Render all sections grouped with headers
    return sections.map(sec => {
      if (!sec.items || sec.items.length === 0) return '';
      return `
        <div class="cat-section-group">
          <div class="cat-section-header">
            <div class="cat-section-title-wrap">
              <span class="cat-section-accent-bar" style="background: ${categoryColor};"></span>
              <h3 class="cat-section-title">${sec.name}</h3>
            </div>
            <span class="badge badge-subtle">${sec.items.length} solvers</span>
          </div>
          <div class="cards-grid">
            ${sec.items.map(id => this.renderCardHtml(id, cat)).join('')}
          </div>
        </div>
      `;
    }).join('');
  },

  renderCardHtml(id, cat) {
    const activeCalc = CALCULATORS_MAP.get(id);
    const isFav = Storage.isFavorite(id);
    const name = activeCalc ? activeCalc.name : id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Calculator';
    const desc = activeCalc ? activeCalc.description : `Perform precision calculations and formulas for ${name.toLowerCase()}.`;
    const icon = activeCalc ? activeCalc.icon : cat.icon;
    const isLive = Boolean(activeCalc);
    const categoryColor = cat.color || '#6366f1';

    return `
      <div class="calc-card" data-calc-id="${id}" style="--card-accent: ${categoryColor};">
        <div class="calc-card-top">
          <div class="calc-card-icon" style="background: ${categoryColor}15; color: ${categoryColor};">
            ${getIcon(icon)}
          </div>
          <button class="calc-card-favorite-btn ${isFav ? 'active' : ''}" data-fav-id="${id}" title="${isFav ? 'Remove Favorite' : 'Add to Favorites'}" aria-label="Favorite">
            ${getIcon(isFav ? 'starFilled' : 'star')}
          </button>
        </div>

        <div>
          <h4 class="calc-card-title">${name}</h4>
          <p class="calc-card-desc">${desc}</p>
        </div>

        <div class="calc-card-bottom">
          <span class="calc-card-category" style="color: ${categoryColor};">${cat.name}</span>
          <a href="${isLive ? `#/calc/${id}` : `#/calc/basic`}" class="calc-card-arrow" aria-label="Open ${name}">
            <span>Solve</span>
            ${getIcon('arrowRight')}
          </a>
        </div>
      </div>
    `;
  },

  bindEvents(container, cat, sections) {
    // Subcategory tabs
    const subTabs = container.querySelectorAll('#cat-sub-tabs .segment-btn');
    const cardsContainer = container.querySelector('#cat-cards-container');

    subTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        subTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSubcategory = btn.dataset.sub;
        if (cardsContainer) {
          cardsContainer.innerHTML = this.renderCategoryContent(cat, sections);
          this.bindCardActions(container);
        }
      });
    });

    // Search filter
    const searchInput = container.querySelector('#cat-search-filter');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchFilter = e.target.value.trim();
        if (cardsContainer) {
          cardsContainer.innerHTML = this.renderCategoryContent(cat, sections);
          this.bindCardActions(container);
        }
      });
    }

    this.bindCardActions(container);
  },

  bindCardActions(container) {
    container.querySelectorAll('.calc-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.calc-card-favorite-btn')) return;
        const id = card.dataset.calcId;
        const isLive = CALCULATORS_MAP.has(id);
        window.location.hash = isLive ? `#/calc/${id}` : `#/calc/basic`;
      });
    });

    container.querySelectorAll('.calc-card-favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.favId;
        const isAdded = Storage.toggleFavorite(id);
        btn.classList.toggle('active', isAdded);
        btn.innerHTML = getIcon(isAdded ? 'starFilled' : 'star');
        Toast.info(isAdded ? 'Added to favorites' : 'Removed from favorites');
      });
    });
  }
};

