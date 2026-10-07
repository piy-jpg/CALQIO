import { state } from '../state.js';
import { getIcon } from '../icons.js';
import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY, getTopLevelCategory, getParentCategoryForDomain } from '../taxonomy.js';
import { CALCULATORS_MAP } from '../registry.js';
import { Storage } from '../storage.js';



export const Sidebar = {
  render(sidebarEl) {
    const favorites = Storage.getFavorites() || [];
    const history = Storage.getHistory() || [];
    const recent = Storage.getRecentCalcs() || [];

    // Separate main 14 categories from More
    const mainEntries = Object.entries(TOP_LEVEL_CATEGORIES).filter(([k]) => k !== 'more');
    const moreCategory = TOP_LEVEL_CATEGORIES.more;

    let mainCategoriesHtml = '';
    mainEntries.forEach(([catKey, cat]) => {
      // Gather unique items across sections
      const allItemIds = [];
      cat.sections.forEach(sec => {
        sec.items.forEach(id => {
          if (!allItemIds.includes(id)) allItemIds.push(id);
        });
      });

      // Preview items from sidebarPreview config or first 3
      const previewList = (cat.sidebarPreview && cat.sidebarPreview.length > 0)
        ? cat.sidebarPreview
        : allItemIds.slice(0, 3);

      const previewItems = previewList.map(id => {
        const c = CALCULATORS_MAP.get(id);
        const name = c ? c.name : id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const icon = c ? c.icon : cat.icon;
        const isLive = Boolean(c);
        return { id, name, icon, isLive };
      });

      mainCategoriesHtml += `
        <div class="category-group collapsed" data-cat="${catKey}" data-cat-slug="${cat.slug}">
          <div class="category-header">
            <a href="#/category/${cat.slug}" class="category-header-title" title="${cat.name}">
              <span class="category-icon-chip" style="background: ${cat.color}18; color: ${cat.color};">
                ${getIcon(cat.icon)}
              </span>
              <span class="category-title-text">${cat.name}</span>
            </a>
            <div class="category-header-actions">
              <span class="category-count-chip">${allItemIds.length}</span>
              <button class="category-chevron-btn" aria-label="Toggle ${cat.name}">
                <span class="category-chevron">${getIcon('chevronDown')}</span>
              </button>
            </div>
          </div>
          <div class="category-items">
            ${previewItems.map(item => `
              <a href="${item.isLive ? `#/calc/${item.id}` : `#/category/${cat.slug}`}" class="nav-link nav-sublink" data-calc-id="${item.id}" title="${item.name}">
                <div class="nav-link-main">
                  <span class="nav-link-icon nav-sublink-icon">${getIcon(item.icon)}</span>
                  <span class="nav-link-text">${item.name}</span>
                </div>
              </a>
            `).join('')}
            <a href="#/category/${cat.slug}" class="category-view-all" data-cat-link="${catKey}" data-cat-slug-link="${cat.slug}">
              <span>View all ${allItemIds.length} tools</span>
              <span class="view-all-arrow">→</span>
            </a>
          </div>
        </div>
      `;
    });

    // Render "More" expandable group for secondary domains (Agriculture, Weather, Pet, Misc)
    let moreHtml = '';
    if (moreCategory) {
      const moreDomainsList = [
        { id: 'agriculture', name: 'Agriculture', icon: 'agriculture', color: '#16a34a', count: MASTER_TAXONOMY.agriculture ? MASTER_TAXONOMY.agriculture.subcategories.reduce((acc, s) => acc + s.items.length, 0) : 3 },
        { id: 'weather_environment', name: 'Weather & Env', icon: 'weather', color: '#0284c7', count: MASTER_TAXONOMY.weather_environment ? MASTER_TAXONOMY.weather_environment.subcategories.reduce((acc, s) => acc + s.items.length, 0) : 3 },
        { id: 'pet_animal', name: 'Pet & Animal', icon: 'pet', color: '#ea580c', count: MASTER_TAXONOMY.pet_animal ? MASTER_TAXONOMY.pet_animal.subcategories.reduce((acc, s) => acc + s.items.length, 0) : 2 },
        { id: 'miscellaneous', name: 'Miscellaneous', icon: 'misc', color: '#64748b', count: MASTER_TAXONOMY.miscellaneous ? MASTER_TAXONOMY.miscellaneous.subcategories.reduce((acc, s) => acc + s.items.length, 0) : 3 }
      ];

      moreHtml = `
        <div class="category-group collapsed" data-cat="more" data-cat-slug="more">
          <div class="category-header">
            <a href="#/category/more" class="category-header-title" title="More Categories">
              <span class="category-icon-chip" style="background: ${moreCategory.color}18; color: ${moreCategory.color};">
                ${getIcon(moreCategory.icon)}
              </span>
              <span class="category-title-text">More Domains</span>
            </a>
            <div class="category-header-actions">
              <span class="category-count-chip">4 Domains</span>
              <button class="category-chevron-btn" aria-label="Toggle More Domains">
                <span class="category-chevron">${getIcon('chevronDown')}</span>
              </button>
            </div>
          </div>
          <div class="category-items">
            ${moreDomainsList.map(dom => `
              <a href="#/category/${dom.id}" class="nav-link nav-sublink" data-cat-link="${dom.id}" title="${dom.name}">
                <div class="nav-link-main">
                  <span class="nav-link-icon nav-sublink-icon" style="color:${dom.color};">${getIcon(dom.icon)}</span>
                  <span class="nav-link-text">${dom.name}</span>
                </div>
                <span class="category-subcount">${dom.count}</span>
              </a>
            `).join('')}
            <a href="#/category/more" class="category-view-all" data-cat-link="more" data-cat-slug-link="more">
              <span>View all specialized tools</span>
              <span class="view-all-arrow">→</span>
            </a>
          </div>
        </div>
      `;
    }

    sidebarEl.innerHTML = `
      <div class="sidebar-scroll-area">
        <!-- OVERVIEW SECTION -->
        <div class="sidebar-section">
          <div class="nav-section-title">Overview</div>
          <ul class="nav-item-list">
            <li>
              <a href="#/" class="nav-link active" id="nav-home-link" title="Dashboard">
                <div class="nav-link-main">
                  <span class="nav-icon-chip chip-overview">
                    ${getIcon('home')}
                  </span>
                  <span class="nav-link-text">Dashboard</span>
                </div>
                <span class="sidebar-live-pill">Live</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- CALCULATORS SECTION -->
        <div class="sidebar-section">
          <div class="nav-section-title">
            <span>Solvers & Domains</span>
            <span class="section-count-badge">14 Hubs</span>
          </div>
          <div class="categories-accordion-list">
            ${mainCategoriesHtml}
            ${moreHtml}
          </div>
        </div>

        <!-- UTILITIES SECTION -->
        <div class="sidebar-section">
          <div class="nav-section-title">Workspace & Tools</div>
          <ul class="nav-item-list">
            <li>
              <a href="#/favorites" class="nav-link" id="nav-favs-link" title="Favorites">
                <div class="nav-link-main">
                  <span class="nav-icon-chip chip-favorites">
                    ${getIcon('star')}
                  </span>
                  <span class="nav-link-text">Favorites</span>
                </div>
                <span class="nav-counter" id="sidebar-fav-count">${favorites.length}</span>
              </a>
            </li>
            <li>
              <a href="#/history" class="nav-link" id="nav-hist-link-sidebar" title="History">
                <div class="nav-link-main">
                  <span class="nav-icon-chip chip-history">
                    ${getIcon('history')}
                  </span>
                  <span class="nav-link-text">History</span>
                </div>
                <span class="nav-counter" id="sidebar-hist-count">${history.length}</span>
              </a>
            </li>
            <li>
              <a href="#/recent" class="nav-link" id="nav-recent-link-sidebar" title="Recently Used">
                <div class="nav-link-main">
                  <span class="nav-icon-chip chip-recent">
                    ${getIcon('recent')}
                  </span>
                  <span class="nav-link-text">Recently Used</span>
                </div>
                <span class="nav-counter" id="sidebar-recent-count">${recent.length}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- SYSTEM SECTION -->
        <div class="sidebar-section">
          <div class="nav-section-title">Preferences</div>
          <ul class="nav-item-list">
            <li>
              <a href="#/settings" class="nav-link" id="nav-settings-link-sidebar" title="Settings">
                <div class="nav-link-main">
                  <span class="nav-icon-chip chip-settings">
                    ${getIcon('settings')}
                  </span>
                  <span class="nav-link-text">Settings</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="sidebar-status-card">
          <div class="sidebar-status-header">
            <span class="sidebar-status-dot"></span>
            <span class="sidebar-status-label">All Engines Active</span>
          </div>
          <div class="sidebar-status-meta">
            <span class="sidebar-version-badge">v2.5 Pro</span>
            <span class="sidebar-tools-count">118+ Solvers</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(sidebarEl);
  },

  bindEvents(sidebarEl) {
    // Accordion expand/collapse on header click or chevron click
    const headers = sidebarEl.querySelectorAll('.category-header');
    headers.forEach(header => {
      header.addEventListener('click', (e) => {
        const group = header.closest('.category-group');
        if (!group) return;

        // If clicking on the title link, expand it and let hash navigation occur
        if (e.target.closest('.category-header-title')) {
          group.classList.remove('collapsed');
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        group.classList.toggle('collapsed');
      });
    });

    // Close mobile drawer on link click
    sidebarEl.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link') || e.target.closest('.category-header-title');
      if (link && window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-open');
      }
    });

    // Route active states
    state.subscribe('currentRoute', ({ value }) => {
      this.updateActiveLink(sidebarEl, value);
    });

    // Favorite counts
    state.subscribe('favorites', ({ value }) => {
      const favCount = sidebarEl.querySelector('#sidebar-fav-count');
      if (favCount) favCount.textContent = value.length;
    });
  },

  updateActiveLink(sidebarEl, route) {
    sidebarEl.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    sidebarEl.querySelectorAll('.category-header-title').forEach(link => link.classList.remove('active'));

    if (!route) return;

    if (route.type === 'dashboard') {
      const homeLink = sidebarEl.querySelector('#nav-home-link');
      if (homeLink) homeLink.classList.add('active');
    } else if (route.type === 'calculator') {
      const calcId = route.params.id;
      const calcLink = sidebarEl.querySelector(`[data-calc-id="${calcId}"]`);
      if (calcLink) {
        calcLink.classList.add('active');
        const group = calcLink.closest('.category-group');
        if (group) group.classList.remove('collapsed');
      } else {
        // Find which top category contains this calculator and expand it
        const calc = CALCULATORS_MAP.get(calcId);
        if (calc) {
          const topCatId = getParentCategoryForDomain(calc.category);
          const group = sidebarEl.querySelector(`[data-cat="${topCatId}"]`) || sidebarEl.querySelector(`[data-cat-slug="${topCatId}"]`);
          if (group) group.classList.remove('collapsed');
        }
      }
    } else if (route.type === 'category') {
      const catParam = route.params.id;
      const topCat = getTopLevelCategory(catParam);
      const topCatId = topCat ? topCat.id : catParam;
      const topCatSlug = topCat ? topCat.slug : catParam;

      const catGroup = sidebarEl.querySelector(`[data-cat="${topCatId}"]`) || sidebarEl.querySelector(`[data-cat-slug="${topCatSlug}"]`);
      if (catGroup) {
        catGroup.classList.remove('collapsed');
        const headerTitle = catGroup.querySelector('.category-header-title');
        if (headerTitle) headerTitle.classList.add('active');
        const viewAllLink = catGroup.querySelector(`[data-cat-link="${topCatId}"]`) || catGroup.querySelector(`[data-cat-slug-link="${topCatSlug}"]`);
        if (viewAllLink) viewAllLink.classList.add('active');
      } else {
        // Direct domain link inside More
        const domLink = sidebarEl.querySelector(`[data-cat-link="${catParam}"]`);
        if (domLink) {
          domLink.classList.add('active');
          const moreGroup = sidebarEl.querySelector('[data-cat="more"]');
          if (moreGroup) moreGroup.classList.remove('collapsed');
        }
      }
    } else if (route.type === 'favorites') {
      const favLink = sidebarEl.querySelector('#nav-favs-link');
      if (favLink) favLink.classList.add('active');
    } else if (route.type === 'history') {
      const histLink = sidebarEl.querySelector('#nav-hist-link-sidebar');
      if (histLink) histLink.classList.add('active');
    } else if (route.type === 'recent') {
      const recLink = sidebarEl.querySelector('#nav-recent-link-sidebar');
      if (recLink) recLink.classList.add('active');
    } else if (route.type === 'settings') {
      const setLink = sidebarEl.querySelector('#nav-settings-link-sidebar');
      if (setLink) setLink.classList.add('active');
    }
  }
};

