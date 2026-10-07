/**
 * CALQIO Navbar UI Component (Redesigned & Premium)
 */

import { state } from '../state.js';
import { getIcon } from '../icons.js';
import { Storage } from '../storage.js';

export const Navbar = {
  render(headerEl) {
    const isDark = state.get('theme') === 'dark';
    const favs = Storage.getFavorites() || [];
    const favCount = favs.length;
    const user = state.get('currentUser');

    const userName = (user && user.name) ? user.name : (user && user.email ? user.email.split('@')[0] : 'User');
    const firstName = userName.split(' ')[0] || 'User';
    const userAvatar = (user && user.avatar) ? user.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`;

    headerEl.innerHTML = `
      <div class="header-left">
        <button id="sidebar-toggle-btn" class="sidebar-toggle-btn" title="Toggle Sidebar (⌘B)" aria-label="Toggle Sidebar">
          ${getIcon('menu')}
        </button>

        <a href="#/" class="logo-link" title="CALQIO Precision Solvers">
          <div class="logo-img-wrapper">
            <img src="assets/logo.png" alt="CALQIO" class="logo-img" />
          </div>
          <div class="logo-text-group">
            <span class="logo-text">calqio</span>
          </div>
        </a>

        <!-- Quick Navigation Hubs -->
        <nav class="nav-quick-links" aria-label="Quick Hubs">
          <a href="#/" class="nav-quick-pill" id="nav-pill-home" title="All Calculators">
            <span class="nav-pill-icon">${getIcon('calculator')}</span>
            <span>Calculators</span>
          </a>
          <a href="#/calc/scientific" class="nav-quick-pill" id="nav-pill-scientific" title="Scientific Calculator">
            <span class="nav-pill-icon">${getIcon('scientific')}</span>
            <span>Scientific</span>
          </a>
          <a href="#/category/engineering" class="nav-quick-pill" id="nav-pill-engineering" title="Engineering (10 Disciplines)">
            <span class="nav-pill-icon">${getIcon('engineering')}</span>
            <span>Engineering</span>
          </a>
          <a href="#/category/finance" class="nav-quick-pill" id="nav-pill-finance" title="Finance & Loans">
            <span class="nav-pill-icon">${getIcon('finance')}</span>
            <span>Finance</span>
          </a>
          <a href="#/calc/unit_converter" class="nav-quick-pill" id="nav-pill-converters" title="Unit Converters">
            <span class="nav-pill-icon">${getIcon('converters')}</span>
            <span>Converters</span>
          </a>
        </nav>
      </div>

      <div class="header-center">
        <button id="nav-search-trigger" class="search-trigger-btn" aria-label="Search calculators">
          <div class="search-trigger-content">
            <span class="search-icon-sparkle">${getIcon('search')}</span>
            <span>Search 118+ calculators...</span>
          </div>
          <div class="nav-search-kbd">
            <kbd>⌘K</kbd>
          </div>
        </button>
      </div>

      <div class="header-right">
        <!-- Mobile Search Button -->
        <button id="nav-mobile-search" class="icon-btn mobile-search-btn" style="display:none;" title="Search" aria-label="Search">
          ${getIcon('search')}
        </button>

        <!-- Favorites Link with Live Numerical Badge -->
        <a href="#/favorites" class="icon-btn" id="nav-fav-link" title="Favorites" aria-label="Favorites">
          ${getIcon('star')}
          ${favCount > 0 ? `<span class="nav-count-badge" id="nav-fav-badge">${favCount}</span>` : ''}
        </a>

        <!-- Dark / Light Theme Toggle -->
        <button id="nav-theme-btn" class="icon-btn" title="Toggle Dark/Light Mode" aria-label="Toggle Theme">
          ${getIcon(isDark ? 'sun' : 'moon')}
        </button>

        <!-- User Profile or Sign-in Pill -->
        <button id="nav-auth-btn" class="${user ? 'nav-user-pill' : 'nav-signin-pill'}" title="${user ? user.email || userName : 'Account & Cloud Sync'}">
          ${user ? `
            <img src="${userAvatar}" alt="${userName}" class="nav-user-avatar" />
            <span class="nav-user-name">${firstName}</span>
          ` : `
            ${getIcon('user')}
            <span>Sign In</span>
          `}
        </button>
      </div>
    `;

    this.bindEvents(headerEl);
    this.updateActivePills(headerEl);
  },

  updateActivePills(headerEl) {
    const hash = window.location.hash || '#/';
    const pills = headerEl.querySelectorAll('.nav-quick-pill');
    pills.forEach(pill => {
      const href = pill.getAttribute('href');
      if (href === hash || (href !== '#/' && hash.startsWith(href))) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  },

  bindEvents(headerEl) {
    // Sidebar toggle (desktop collapse or mobile drawer open)
    const toggleBtn = headerEl.querySelector('#sidebar-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          document.body.classList.toggle('sidebar-open');
        } else {
          const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
          state.set('sidebarCollapsed', isCollapsed);
        }
      });
    }

    // Theme toggle
    const themeBtn = headerEl.querySelector('#nav-theme-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.toggleTheme();
      });
    }

    state.subscribe('theme', ({ value }) => {
      if (themeBtn) {
        themeBtn.innerHTML = getIcon(value === 'dark' ? 'sun' : 'moon');
      }
    });

    // Search triggers
    const searchTrigger = headerEl.querySelector('#nav-search-trigger');
    const mobileSearch = headerEl.querySelector('#nav-mobile-search');
    
    const openSearch = () => state.set('commandPaletteOpen', true);
    if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
    if (mobileSearch) mobileSearch.addEventListener('click', openSearch);

    // Auth Modal trigger
    const authBtn = headerEl.querySelector('#nav-auth-btn');
    if (authBtn) {
      authBtn.addEventListener('click', () => {
        state.set('authModalOpen', true);
      });
    }

    // Register global reactive subscriptions once
    if (!this._hasSubscribed) {
      this._hasSubscribed = true;
      
      state.subscribe('currentUser', () => {
        this.render(headerEl);
      });

      state.subscribe('favorites', ({ value }) => {
        const favBadge = headerEl.querySelector('#nav-fav-badge');
        const favLink = headerEl.querySelector('#nav-fav-link');
        const count = Array.isArray(value) ? value.length : 0;
        if (count > 0) {
          if (!favBadge && favLink) {
            const badge = document.createElement('span');
            badge.id = 'nav-fav-badge';
            badge.className = 'nav-count-badge';
            badge.textContent = count;
            favLink.appendChild(badge);
          } else if (favBadge) {
            favBadge.textContent = count;
          }
        } else if (favBadge) {
          favBadge.remove();
        }
      });

      if (typeof window !== 'undefined') {
        window.addEventListener('hashchange', () => {
          this.updateActivePills(headerEl);
        });
      }
    }
  }
};

