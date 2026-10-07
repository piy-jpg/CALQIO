/**
 * CALQIO Application Entry Point
 */

import { state } from './state.js';
import { Navbar } from './ui/navbar.js';
import { Sidebar } from './ui/sidebar.js';
import { CommandPalette } from './ui/commandPalette.js';
import { AuthModal } from './ui/authModal.js';
import { Router } from './router.js';
import { ThreeDimensionalEngine } from './ui/threeDimensional.js';
import { GoogleAuthService } from './services/googleAuth.js';

function bootstrap() {
  try {
    // 1. Initialize Theme, 3D Canvas, & Google Identity
    try {
      const savedTheme = state.get('theme');
      document.documentElement.setAttribute('data-theme', savedTheme);
      ThreeDimensionalEngine.init();
      GoogleAuthService.init();
    } catch (e) {
      console.warn('Theme/3D init notice:', e);
    }

    // 2. Mount Static App Shell Components
    const headerEl = document.getElementById('app-header');
    const sidebarEl = document.getElementById('app-sidebar');
    const mainEl = document.getElementById('app-main');
    const cmdPaletteEl = document.getElementById('cmd-palette-root');
    const authModalEl = document.getElementById('auth-modal-root');
    const backdropEl = document.getElementById('sidebar-backdrop');

    try {
      if (headerEl) Navbar.render(headerEl);
    } catch (e) {
      console.warn('Navbar render notice:', e);
    }

    try {
      if (sidebarEl) Sidebar.render(sidebarEl);
    } catch (e) {
      console.warn('Sidebar render notice:', e);
    }

    try {
      if (cmdPaletteEl) CommandPalette.render(cmdPaletteEl);
    } catch (e) {
      console.warn('CommandPalette render notice:', e);
    }

    if (authModalEl) {
      state.subscribe('authModalOpen', () => AuthModal.render(authModalEl));
      state.subscribe('currentUser', () => {
        AuthModal.render(authModalEl);
        if (mainEl) Router.handleRoute();
      });
    }

    // 3. Initialize Router for Dynamic Views
    try {
      if (mainEl) Router.init(mainEl);
    } catch (e) {
      console.warn('Router init notice:', e);
    }

    // 4. Check & Restore Authenticated User Session
    state.initAuth().catch(e => console.warn('Auth init note:', e));

    // 5. Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K -> Spotlight search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const isOpen = state.get('commandPaletteOpen');
        state.set('commandPaletteOpen', !isOpen);
      }
    });

    // 6. Mobile Backdrop Click
    if (backdropEl) {
      backdropEl.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
      });
    }

    // 7. Mobile Bottom Nav Active state sync
    state.subscribe('currentRoute', ({ value }) => {
      document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('active');
      });
      if (value.type === 'dashboard') {
        document.getElementById('mob-nav-home')?.classList.add('active');
      } else if (value.type === 'favorites') {
        document.getElementById('mob-nav-favs')?.classList.add('active');
      } else if (value.type === 'history') {
        document.getElementById('mob-nav-hist')?.classList.add('active');
      } else if (value.type === 'calculator' && value.params.id === 'basic') {
        document.getElementById('mob-nav-calc')?.classList.add('active');
      }
    });

    // Mobile search button in bottom nav
    document.getElementById('mob-nav-search')?.addEventListener('click', () => {
      state.set('commandPaletteOpen', true);
    });
  } catch (err) {
    console.error('CALQIO bootstrap initialization error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
