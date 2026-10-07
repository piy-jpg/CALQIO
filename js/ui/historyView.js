/**
 * CALQIO Calculation History View
 * Modern timeline log with domain filtering, export options, and interactive recall cards.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';
import { CALCULATORS_MAP } from '../registry.js';
import { TOP_LEVEL_CATEGORIES, getParentCategoryForDomain } from '../taxonomy.js';

export const HistoryView = {
  currentFilter: 'all',
  searchQuery: '',

  render(container) {
    const history = Storage.getHistory();

    // Group domain categories
    const categoriesMap = {};
    history.forEach(item => {
      const calc = CALCULATORS_MAP.get(item.calcId);
      const category = calc ? calc.category : 'general';
      const topCatKey = getParentCategoryForDomain(category);
      const topCat = TOP_LEVEL_CATEGORIES[topCatKey] || { name: 'General', icon: 'calculator' };
      if (!categoriesMap[topCatKey]) {
        categoriesMap[topCatKey] = { name: topCat.name, count: 0, key: topCatKey };
      }
      categoriesMap[topCatKey].count++;
    });

    const filtered = history.filter(item => {
      const calc = CALCULATORS_MAP.get(item.calcId);
      const category = calc ? calc.category : 'general';
      const topCatKey = getParentCategoryForDomain(category);

      const matchesFilter = this.currentFilter === 'all' || topCatKey === this.currentFilter;
      const q = this.searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        (item.calcName && item.calcName.toLowerCase().includes(q)) ||
        (item.expression && item.expression.toLowerCase().includes(q)) ||
        (item.result && item.result.toLowerCase().includes(q));

      return matchesFilter && matchesQuery;
    });

    // Group items by date timeline
    const grouped = this.groupByTimeline(filtered);

    container.innerHTML = `
      <div class="main-container">
        <!-- HERO BANNER -->
        <div class="util-hero-card">
          <div class="util-hero-main">
            <div class="util-hero-icon" style="background: var(--accent-primary-light); color: var(--accent-primary); border: 1px solid var(--accent-primary-border);">
              ${getIcon('history')}
            </div>
            <div>
              <h1 class="util-hero-title">
                Calculation History
                <span class="badge badge-primary" style="font-size:0.75rem; vertical-align:middle;">LOCAL & SECURE</span>
              </h1>
              <p class="util-hero-desc">Review, copy, export, and re-open previous calculations saved locally.</p>
            </div>
          </div>
          <div class="util-hero-stats">
            <div class="util-stat-pill">
              <span>Recorded:</span>
              <strong>${history.length}</strong>
            </div>
            ${history.length > 0 ? `
              <button id="hist-export-btn" class="btn btn-subtle btn-sm" title="Export as CSV/JSON">
                ${getIcon('download')} Export
              </button>
              <button id="clear-history-btn" class="btn btn-subtle btn-sm" style="color: var(--accent-danger);" title="Clear history">
                ${getIcon('trash')} Clear
              </button>
            ` : ''}
          </div>
        </div>

        ${history.length === 0 ? `
          <div class="card" style="text-align:center; padding: 4.5rem 1.5rem; color: var(--text-muted); border-radius: var(--radius-2xl);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📜</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">No History Recorded Yet</h3>
            <p style="font-size: 0.925rem; max-width: 440px; margin: 0 auto 1.75rem auto; line-height: 1.5;">Calculations you perform across basic, scientific, finance, health, and percentage tools will automatically appear here.</p>
            <div style="display:flex; justify-content:center; gap: 0.75rem;">
              <a href="#/calc/basic" class="btn btn-primary">Open Basic Studio</a>
              <a href="#/calc/scientific" class="btn btn-secondary">Open Scientific</a>
            </div>
          </div>
        ` : `
          <!-- FILTER & SEARCH TOOLBAR -->
          <div class="util-filter-bar">
            <div class="util-filter-chips">
              <button class="filter-chip-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-cat="all">
                All <span class="chip-count">${history.length}</span>
              </button>
              ${Object.values(categoriesMap).map(cat => `
                <button class="filter-chip-btn ${this.currentFilter === cat.key ? 'active' : ''}" data-cat="${cat.key}">
                  ${cat.name} <span class="chip-count">${cat.count}</span>
                </button>
              `).join('')}
            </div>

            <div class="form-group" style="margin-bottom:0; width: 280px;">
              <div class="input-wrapper has-prefix">
                <span class="input-prefix">${getIcon('search')}</span>
                <input type="text" id="history-filter-input" class="input-field" placeholder="Search expression, result..." value="${this.searchQuery}">
              </div>
            </div>
          </div>

          <!-- TIMELINE LIST -->
          <div id="history-items-container">
            ${this.renderTimelineGroups(grouped)}
          </div>
        `}
      </div>
    `;

    this.bindEvents(container);
  },

  groupByTimeline(items) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      Today: [],
      Yesterday: [],
      'Earlier This Week': [],
      'Older Calculations': []
    };

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    items.forEach(item => {
      const itemDate = new Date(item.timestamp || Date.now());
      if (itemDate >= today) {
        groups.Today.push(item);
      } else if (itemDate >= yesterday) {
        groups.Yesterday.push(item);
      } else if (itemDate >= oneWeekAgo) {
        groups['Earlier This Week'].push(item);
      } else {
        groups['Older Calculations'].push(item);
      }
    });

    return groups;
  },

  renderTimelineGroups(groups) {
    let totalRendered = 0;
    let html = '';

    for (const [tag, items] of Object.entries(groups)) {
      if (items.length === 0) continue;
      totalRendered += items.length;

      html += `
        <div class="history-timeline-group">
          <div class="history-timeline-header">
            <span class="history-timeline-tag">${tag}</span>
            <span class="badge badge-subtle" style="font-size:0.6875rem;">${items.length} records</span>
          </div>
          <div class="history-timeline-items">
            ${items.map(item => this.renderHistoryItem(item)).join('')}
          </div>
        </div>
      `;
    }

    if (totalRendered === 0) {
      return `
        <div class="card" style="text-align:center; padding: 3rem 1rem; color: var(--text-muted); border-radius: var(--radius-xl);">
          <p>No calculations match your filter or search term.</p>
        </div>
      `;
    }

    return html;
  },

  renderHistoryItem(item) {
    const calc = CALCULATORS_MAP.get(item.calcId);
    const iconName = calc ? calc.icon : 'calculator';
    const timeStr = new Date(item.timestamp || Date.now()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="history-card-item" data-history-id="${item.id}">
        <div class="history-card-left">
          <div class="history-card-icon">
            ${getIcon(iconName)}
          </div>
          <div class="history-card-details">
            <div class="history-card-header-row">
              <span class="history-card-name">${item.calcName || 'Calculator'}</span>
              <span class="badge badge-subtle" style="font-size:0.6875rem;">${timeStr}</span>
            </div>
            <div class="history-card-expr" title="${item.expression}">${item.expression}</div>
          </div>
        </div>

        <div class="history-card-right">
          <div class="history-card-res">${item.result}</div>
          
          <a href="#/calc/${item.calcId}" class="btn btn-subtle btn-sm" title="Re-open calculator">
            Open
          </a>

          <button class="icon-btn hist-copy-btn" data-copy="${item.result}" title="Copy Result">
            ${getIcon('copy')}
          </button>

          <button class="icon-btn hist-delete-btn" data-id="${item.id}" title="Delete item">
            ${getIcon('trash')}
          </button>
        </div>
      </div>
    `;
  },

  bindEvents(container) {
    const clearBtn = container.querySelector('#clear-history-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire calculation history?')) {
          Storage.clearHistory();
          Toast.success('Calculation history cleared');
          this.render(container);
        }
      });
    }

    const exportBtn = container.querySelector('#hist-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const history = Storage.getHistory();
        if (history.length === 0) return;
        const jsonStr = JSON.stringify(history, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calqio-history-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Toast.success('Exported history as JSON');
      });
    }

    // Filter chip switching
    container.querySelectorAll('.filter-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.cat;
        this.render(container);
      });
    });

    // Filter input
    const filterInput = container.querySelector('#history-filter-input');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
        const refocused = container.querySelector('#history-filter-input');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(this.searchQuery.length, this.searchQuery.length);
        }
      });
    }

    this.bindItemActions(container);
  },

  bindItemActions(container) {
    // Copy buttons
    container.querySelectorAll('.hist-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.copy;
        navigator.clipboard.writeText(val).then(() => {
          Toast.success(`Copied "${val}" to clipboard`);
        });
      });
    });

    // Delete item buttons
    container.querySelectorAll('.hist-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        Storage.removeHistoryItem(id);
        Toast.info('Calculation removed from history');
        this.render(container);
      });
    });
  }
};

