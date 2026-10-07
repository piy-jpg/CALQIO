/**
 * CALQIO Global Command Palette (Cmd+K / Ctrl+K Spotlight Search Modal)
 * Deeply indexes all 42 categories, subcategories, keywords, and individual calculators.
 */

import { state } from '../state.js';
import { getIcon } from '../icons.js';
import { CALCULATORS_LIST, CALCULATORS_MAP, searchCalculators } from '../registry.js';
import { MASTER_TAXONOMY, TOP_LEVEL_CATEGORIES, getTopLevelCategory, getParentCategoryForDomain } from '../taxonomy.js';
import { Storage } from '../storage.js';



export const CommandPalette = {
  selectedIndex: 0,
  currentResults: [],

  render(container) {
    container.innerHTML = `
      <div class="cmd-palette-backdrop" id="cmd-palette-modal">
        <div class="cmd-palette" role="dialog" aria-modal="true" aria-label="Search Calculators">
          <div class="cmd-header">
            <span style="color: var(--text-muted); display:flex;">${getIcon('search')}</span>
            <input type="text" id="cmd-search-input" class="cmd-input" placeholder="Search any calculator, formula, or category (e.g. EMI, GST, BMI, geometry, resistor, kg)..." autocomplete="off">
            <button id="cmd-close-btn" class="icon-btn" style="width:28px; height:28px;" aria-label="Close search">
              ${getIcon('x')}
            </button>
          </div>

          <ul class="cmd-results-list" id="cmd-results-list"></ul>

          <div class="cmd-footer">
            <div class="cmd-hints">
              <span class="cmd-hint"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> to navigate</span>
              <span class="cmd-hint"><kbd class="kbd">↵</kbd> to select</span>
              <span class="cmd-hint"><kbd class="kbd">ESC</kbd> to close</span>
            </div>
            <span>CALQIO Platform</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    if (!container) return;
    const modal = container.querySelector('#cmd-palette-modal');
    const input = container.querySelector('#cmd-search-input');
    const list = container.querySelector('#cmd-results-list');
    const closeBtn = container.querySelector('#cmd-close-btn');

    state.subscribe('commandPaletteOpen', ({ value }) => {
      if (!modal || !input) return;
      if (value) {
        modal.classList.add('open');
        input.value = '';
        this.selectedIndex = 0;
        this.updateResults('');
        setTimeout(() => input?.focus(), 50);
      } else {
        modal.classList.remove('open');
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => state.set('commandPaletteOpen', false));
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          state.set('commandPaletteOpen', false);
        }
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        this.selectedIndex = 0;
        this.updateResults(e.target.value);
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.currentResults.length);
          this.renderResultsList(list);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + this.currentResults.length) % Math.max(1, this.currentResults.length);
          this.renderResultsList(list);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.currentResults[this.selectedIndex]) {
            this.selectItem(this.currentResults[this.selectedIndex]);
          }
        } else if (e.key === 'Escape') {
          state.set('commandPaletteOpen', false);
        }
      });
    }

    if (list) {
      list.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.cmd-item');
        if (itemEl) {
          const idx = parseInt(itemEl.dataset.idx, 10);
          if (this.currentResults[idx]) {
            this.selectItem(this.currentResults[idx]);
          }
        }
      });
    }
  },

  updateResults(query) {
    const list = document.getElementById('cmd-results-list');
    const q = (query || '').toLowerCase().trim();

    if (!q) {
      // Recent & Popular
      const recentIds = Storage.getRecentCalcs();
      const recents = recentIds.map(id => CALCULATORS_MAP.get(id)).filter(Boolean).map(c => {
        const parentTopId = getParentCategoryForDomain(c.category);
        const topCat = TOP_LEVEL_CATEGORIES[parentTopId];
        return {
          type: 'calculator',
          id: c.id,
          name: c.name,
          description: c.description,
          icon: c.icon,
          badge: topCat ? topCat.name : c.category
        };
      });

      const topCalcs = CALCULATORS_LIST.filter(c => !recentIds.includes(c.id)).slice(0, 5).map(c => {
        const parentTopId = getParentCategoryForDomain(c.category);
        const topCat = TOP_LEVEL_CATEGORIES[parentTopId];
        return {
          type: 'calculator',
          id: c.id,
          name: c.name,
          description: c.description,
          icon: c.icon,
          badge: topCat ? topCat.name : c.category
        };
      });

      this.currentResults = [...recents, ...topCalcs];
    } else {
      const results = [];
      const seenKeys = new Set();

      // 1. Search Top-Level Categories
      for (const [topKey, topCat] of Object.entries(TOP_LEVEL_CATEGORIES)) {
        if (topCat.name.toLowerCase().includes(q) || topCat.description.toLowerCase().includes(q) || topCat.slug.includes(q)) {
          const key = `topcat_${topCat.slug}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              type: 'category',
              id: topCat.slug,
              name: `${topCat.name} Category`,
              description: topCat.description,
              icon: topCat.icon,
              badge: 'Top Category'
            });
          }
        }
      }

      // 2. Search Underling 42 Domains
      for (const [domKey, dom] of Object.entries(MASTER_TAXONOMY)) {
        if (dom.name.toLowerCase().includes(q) || dom.description.toLowerCase().includes(q) || domKey.includes(q)) {
          const parentTopId = getParentCategoryForDomain(domKey);
          const topCat = TOP_LEVEL_CATEGORIES[parentTopId];
          const topName = topCat ? topCat.name : 'Category';
          const key = `domain_${domKey}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              type: 'category',
              id: domKey,
              name: `${dom.name}`,
              description: dom.description,
              icon: dom.icon,
              badge: `${topName} → ${dom.name}`
            });
          }
        }
      }

      // 3. Search Registered Calculators
      const calcMatches = searchCalculators(q);
      calcMatches.forEach(c => {
        const parentTopId = getParentCategoryForDomain(c.category);
        const topCat = TOP_LEVEL_CATEGORIES[parentTopId];
        const dom = MASTER_TAXONOMY[c.category];
        const domName = dom ? dom.name : c.category;
        const topName = topCat ? topCat.name : '';
        const badge = topName && topName !== domName ? `${topName} → ${domName}` : (domName || 'Calculator');
        const key = `calc_${c.id}`;

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          results.push({
            type: 'calculator',
            id: c.id,
            name: c.name,
            description: c.description,
            icon: c.icon,
            badge: badge
          });
        }
      });

      // 4. Search Section / Subcategory items in Taxonomy
      for (const [domKey, dom] of Object.entries(MASTER_TAXONOMY)) {
        dom.subcategories.forEach(sub => {
          if (sub.name.toLowerCase().includes(q)) {
            const parentTopId = getParentCategoryForDomain(domKey);
            const topCat = TOP_LEVEL_CATEGORIES[parentTopId];
            const topName = topCat ? topCat.name : 'Category';
            const key = `sub_${domKey}_${sub.id}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              results.push({
                type: 'category',
                id: domKey,
                name: `${sub.name}`,
                description: `Subcategory with ${sub.items.length} calculators`,
                icon: dom.icon,
                badge: `${topName} → ${dom.name}`
              });
            }
          }
        });
      }

      this.currentResults = results.slice(0, 16);
    }

    this.renderResultsList(list);
  },

  renderResultsList(list) {
    if (!list) return;

    if (this.currentResults.length === 0) {
      list.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
          No calculators or categories found matching your search.
        </div>
      `;
      return;
    }

    list.innerHTML = this.currentResults.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;

      return `
        <li class="cmd-item ${isSelected ? 'selected' : ''}" data-idx="${idx}">
          <div class="cmd-item-left">
            <div class="cmd-item-icon">
              ${getIcon(item.icon)}
            </div>
            <div>
              <div class="cmd-item-title">${item.name}</div>
              <div class="cmd-item-desc">${item.description}</div>
            </div>
          </div>
          <span class="badge badge-subtle" style="font-size:0.7rem;">${item.badge}</span>
        </li>
      `;
    }).join('');

    const selectedEl = list.children[this.selectedIndex];
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  },

  selectItem(item) {
    state.set('commandPaletteOpen', false);
    if (item.type === 'category') {
      window.location.hash = `#/category/${item.id}`;
    } else {
      Storage.recordCalcUsage(item.id);
      window.location.hash = `#/calc/${item.id}`;
    }
  }
};
