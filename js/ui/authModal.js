/**
 * CALQIO Authentication & User Profile Modal
 * Glassmorphic account portal with PostgreSQL cloud sync status and seamless authorization.
 */

import { state } from '../state.js';
import { AuthApi } from '../api/auth.js';
import { Storage } from '../storage.js';
import { getIcon } from '../icons.js';
import { Toast } from '../toast.js';

export const AuthModal = {
  activeTab: 'login', // 'login' | 'register'

  render(rootEl) {
    const user = state.get('currentUser');
    const isOpen = state.get('authModalOpen');

    if (!isOpen) {
      rootEl.innerHTML = '';
      return;
    }

    if (user) {
      rootEl.innerHTML = this.renderProfileView(user);
    } else {
      rootEl.innerHTML = this.renderAuthForm();
    }

    this.bindEvents(rootEl);
  },

  renderAuthForm() {
    const isLogin = this.activeTab === 'login';
    return `
      <div class="cmd-palette-backdrop open" id="auth-modal-backdrop">
        <div class="cmd-palette-modal" style="max-width: 460px; padding: 28px; border-radius: var(--radius-2xl); position:relative; overflow:hidden;">
          <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);"></div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem;">
            <div style="display:flex; align-items:center; gap: 10px;">
              <div class="workspace-icon-box" style="width:38px; height:38px; font-size:1.1rem; border-radius:var(--radius-md);">
                ${getIcon('user')}
              </div>
              <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0; color: var(--text-primary); letter-spacing:-0.02em;">
                ${isLogin ? 'Sign in to CALQIO' : 'Create CALQIO Account'}
              </h2>
            </div>
            <button id="auth-close-btn" class="icon-btn" style="width:32px; height:32px;" aria-label="Close">
              ${getIcon('x')}
            </button>
          </div>

          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height:1.45;">
            ${isLogin 
              ? 'Access your private calculation history, customized settings, and favorite tools across all your devices.'
              : 'Join the CALQIO workspace to backup calculation histories, sync formulas, and unlock cloud features.'}
          </p>

          <!-- Highlights Pills -->
          <div style="display:flex; gap:0.5rem; margin-bottom: 1.5rem; flex-wrap:wrap;">
            <span class="util-stat-pill" style="font-size:0.75rem; padding: 3px 8px;">✓ Cloud Sync</span>
            <span class="util-stat-pill" style="font-size:0.75rem; padding: 3px 8px;">✓ 118+ Solvers</span>
            <span class="util-stat-pill" style="font-size:0.75rem; padding: 3px 8px;">✓ Private & Secure</span>
          </div>

          <!-- Tab Selector -->
          <div class="segmented-control" id="auth-tab-control" style="margin-bottom: 1.25rem; height: 36px;">
            <button class="segment-btn ${isLogin ? 'active' : ''}" data-tab="login">Sign In</button>
            <button class="segment-btn ${!isLogin ? 'active' : ''}" data-tab="register">Create Account</button>
          </div>

          <form id="auth-form" style="display:flex; flex-direction:column; gap: 12px;">
            ${!isLogin ? `
              <div>
                <label style="display:block; font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 5px;">Full Name</label>
                <input type="text" id="auth-name" class="input-field" placeholder="e.g. Alex Morgan" required style="width:100%;" />
              </div>
            ` : ''}

            <div>
              <label style="display:block; font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 5px;">Email Address</label>
              <input type="email" id="auth-email" class="input-field" placeholder="alex@calqio.com" required style="width:100%;" />
            </div>

            <div>
              <label style="display:block; font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 5px;">Password</label>
              <input type="password" id="auth-password" class="input-field" placeholder="••••••••" required style="width:100%;" />
            </div>

            <div id="auth-error-msg" style="color: var(--accent-danger); background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); padding: 8px 12px; border-radius: var(--radius-md); font-size: 0.8125rem; display:none;"></div>

            <button type="submit" class="btn btn-primary" id="auth-submit-btn" style="width: 100%; justify-content: center; padding: 10px; margin-top: 6px; font-weight: 700;">
              ${isLogin ? 'Sign In to Workspace' : 'Create Free Account'}
            </button>
          </form>

          <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); text-align: center; font-size: 0.8125rem; color: var(--text-muted);">
            Guest session data automatically migrates upon signing in.
          </div>
        </div>
      </div>
    `;
  },

  renderProfileView(user) {
    return `
      <div class="cmd-palette-backdrop open" id="auth-modal-backdrop">
        <div class="cmd-palette-modal" style="max-width: 460px; padding: 28px; border-radius: var(--radius-2xl); position:relative; overflow:hidden;">
          <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, #10b981, #06b6d4, #6366f1);"></div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0; color: var(--text-primary); letter-spacing:-0.02em;">Account & Cloud Sync</h2>
            <button id="auth-close-btn" class="icon-btn" style="width:32px; height:32px;" aria-label="Close">
              ${getIcon('x')}
            </button>
          </div>

          <div style="display:flex; align-items:center; gap: 14px; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); margin-bottom: 1.25rem;">
            <img src="${user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(user.name || 'User')}" alt="${user.name}" style="width: 50px; height: 50px; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--border-subtle);" />
            <div>
              <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${user.name || 'CALQIO User'}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${user.email}</div>
              <span class="badge badge-primary" style="margin-top: 4px; display:inline-block; font-size: 0.6875rem;">${(user.role || 'MEMBER').toUpperCase()}</span>
            </div>
          </div>

          <div style="padding: 12px 16px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-lg); margin-bottom: 1.5rem; display:flex; align-items:center; gap: 10px;">
            <span style="color: #10b981; font-size: 1.2rem; font-weight: 800;">✓</span>
            <div style="font-size: 0.8125rem; color: var(--text-primary);">
              <strong>Cloud Sync Active</strong>
              <div style="color: var(--text-secondary); font-size: 0.75rem;">Calculation history and favorites are backed up securely.</div>
            </div>
          </div>

          <button id="auth-logout-btn" class="btn btn-outline" style="width: 100%; justify-content: center; border-color: rgba(239, 68, 68, 0.3); color: var(--accent-danger);">
            ${getIcon('trash')} Sign Out
          </button>
        </div>
      </div>
    `;
  },

  bindEvents(rootEl) {
    const backdrop = rootEl.querySelector('#auth-modal-backdrop');
    const closeBtn = rootEl.querySelector('#auth-close-btn');
    const form = rootEl.querySelector('#auth-form');
    const logoutBtn = rootEl.querySelector('#auth-logout-btn');

    const closeModal = () => state.set('authModalOpen', false);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Tab switching
    const tabBtns = rootEl.querySelectorAll('#auth-tab-control .segment-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        this.render(rootEl);
      });
    });

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = rootEl.querySelector('#auth-error-msg');
        const submitBtn = rootEl.querySelector('#auth-submit-btn');
        if (errorEl) errorEl.style.display = 'none';

        const email = rootEl.querySelector('#auth-email')?.value.trim();
        const password = rootEl.querySelector('#auth-password')?.value;
        const name = rootEl.querySelector('#auth-name')?.value.trim();

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Authenticating...';
        }

        try {
          let resData;
          if (this.activeTab === 'login') {
            resData = await AuthApi.login(email, password);
            Toast.show('Welcome back to CALQIO!', 'success');
          } else {
            resData = await AuthApi.register(name, email, password);
            Toast.show('CALQIO account created successfully!', 'success');
          }

          state.set('currentUser', resData.user);
          await Storage.syncGuestDataToServer();
          closeModal();
        } catch (err) {
          if (errorEl) {
            errorEl.textContent = err.message || 'Authentication error';
            errorEl.style.display = 'block';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = this.activeTab === 'login' ? 'Sign In to Workspace' : 'Create Free Account';
          }
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthApi.logout();
        state.set('currentUser', null);
        Toast.show('Signed out from CALQIO.', 'info');
        closeModal();
      });
    }
  }
};

