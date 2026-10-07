/**
 * CALQIO Authentication & User Profile Modal
 * High-precision, luminous modal with Real-Time Google Authentication,
 * cloud sync status, and responsive authorization controls.
 */

import { state } from '../state.js';
import { AuthApi } from '../api/auth.js';
import { GoogleAuthService } from '../services/googleAuth.js';
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
        <div class="cmd-palette-modal" style="max-width: 450px; padding: 28px 26px; border-radius: 24px; position:relative; overflow:hidden; background: var(--bg-surface);">
          <div style="position:absolute; top:0; left:0; right:0; height:3.5px; background:linear-gradient(90deg, #4285F4 0%, #EA4335 25%, #FBBC05 50%, #34A853 75%, #6366F1 100%);"></div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.1rem; margin-top: 4px;">
            <div style="display:flex; align-items:center; gap: 12px;">
              <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%); border: 1px solid rgba(99, 102, 241, 0.3); display:flex; align-items:center; justify-content:center; color: #6366F1; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);">
                ${getIcon('user')}
              </div>
              <div>
                <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0; color: var(--text-primary); letter-spacing:-0.03em; line-height: 1.2;">
                  ${isLogin ? 'Sign in to CALQIO' : 'Create CALQIO Account'}
                </h2>
                <div style="font-size: 0.775rem; color: var(--text-muted); font-weight: 500;">
                  ${isLogin ? 'Precision Multi-Calculator Workspace' : 'Unlock real-time sync & custom formulas'}
                </div>
              </div>
            </div>
            <button id="auth-close-btn" class="icon-btn" style="width:34px; height:34px; border-radius: 10px;" aria-label="Close">
              ${getIcon('x')}
            </button>
          </div>

          <!-- Highlights Pills -->
          <div style="display:flex; gap:6px; margin-bottom: 1.25rem; flex-wrap:wrap;">
            <span style="font-size:0.725rem; font-weight: 700; color: #10B981; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 3px 9px; border-radius: 8px;">✓ Realtime Sync</span>
            <span style="font-size:0.725rem; font-weight: 700; color: #6366F1; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.25); padding: 3px 9px; border-radius: 8px;">✓ 289+ Solvers</span>
            <span style="font-size:0.725rem; font-weight: 700; color: #F59E0B; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); padding: 3px 9px; border-radius: 8px;">✓ Private & Secure</span>
          </div>

          <!-- Real-Time Google One-Click Auth Button -->
          <button type="button" class="btn-google-auth" id="auth-google-btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 11px; padding: 11px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all var(--transition-fast); margin-bottom: 1.25rem;">
            ${getIcon('google')}
            <span id="google-btn-text">Continue with Google</span>
          </button>

          <!-- OR Divider -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.15rem;">
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
            <span style="font-size: 0.725rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;">Or with email</span>
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
          </div>

          <!-- Tab Selector -->
          <div class="segmented-control" id="auth-tab-control" style="margin-bottom: 1.15rem; height: 38px; padding: 3px; border-radius: 10px; background: var(--bg-subtle); border: 1px solid var(--border-subtle);">
            <button class="segment-btn ${isLogin ? 'active' : ''}" data-tab="login" style="font-size: 0.8125rem; font-weight: 700; border-radius: 8px;">Sign In</button>
            <button class="segment-btn ${!isLogin ? 'active' : ''}" data-tab="register" style="font-size: 0.8125rem; font-weight: 700; border-radius: 8px;">Create Account</button>
          </div>

          <form id="auth-form" style="display:flex; flex-direction:column; gap: 12px;">
            ${!isLogin ? `
              <div>
                <label style="display:block; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Full Name</label>
                <input type="text" id="auth-name" class="input-field" placeholder="e.g. Alex Morgan" required style="width:100%; height:40px; border-radius:10px; font-size:0.875rem;" />
              </div>
            ` : ''}

            <div>
              <label style="display:block; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Email Address</label>
              <input type="email" id="auth-email" class="input-field" placeholder="alex@calqio.com" required style="width:100%; height:40px; border-radius:10px; font-size:0.875rem;" />
            </div>

            <div>
              <label style="display:block; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Password</label>
              <input type="password" id="auth-password" class="input-field" placeholder="••••••••" required style="width:100%; height:40px; border-radius:10px; font-size:0.875rem;" />
            </div>

            <div id="auth-error-msg" style="color: var(--accent-danger); background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); padding: 8px 12px; border-radius: 8px; font-size: 0.8125rem; display:none;"></div>

            <button type="submit" class="btn btn-primary" id="auth-submit-btn" style="width: 100%; justify-content: center; padding: 11px; margin-top: 4px; font-weight: 800; font-size: 0.9rem; border-radius: 11px; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%); box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);">
              ${isLogin ? 'Sign In to Workspace' : 'Create Free Account'}
            </button>
          </form>

          <div style="margin-top: 1.15rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); text-align: center; font-size: 0.775rem; color: var(--text-muted); line-height: 1.4;">
            🔒 Guest calculations & pinned tools automatically sync upon signing in.
          </div>
        </div>
      </div>
    `;
  },

  renderProfileView(user) {
    const isGoogle = user.provider === 'google';
    return `
      <div class="cmd-palette-backdrop open" id="auth-modal-backdrop">
        <div class="cmd-palette-modal" style="max-width: 450px; padding: 28px 26px; border-radius: 24px; position:relative; overflow:hidden; background: var(--bg-surface);">
          <div style="position:absolute; top:0; left:0; right:0; height:3.5px; background:linear-gradient(90deg, #10B981 0%, #06B6D4 50%, #6366F1 100%);"></div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0; color: var(--text-primary); letter-spacing:-0.03em;">Account & Cloud Sync</h2>
            <button id="auth-close-btn" class="icon-btn" style="width:34px; height:34px; border-radius: 10px;" aria-label="Close">
              ${getIcon('x')}
            </button>
          </div>

          <div style="display:flex; align-items:center; gap: 14px; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 16px; margin-bottom: 1.25rem; box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);">
            <img src="${user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(user.name || 'User')}" alt="${user.name}" style="width: 54px; height: 54px; border-radius: 50%; background: var(--bg-card); border: 2px solid var(--border-subtle); object-fit: cover;" />
            <div style="flex:1;">
              <div style="font-weight: 800; font-size: 1.125rem; color: var(--text-primary);">${user.name || 'CALQIO User'}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${user.email}</div>
              <div style="display:flex; align-items:center; gap:6px; margin-top: 5px;">
                <span class="badge badge-primary" style="font-size: 0.6875rem;">${(user.role || 'MEMBER').toUpperCase()}</span>
                ${isGoogle ? `
                  <span style="display:inline-flex; align-items:center; gap:4px; font-size: 0.6875rem; font-weight:700; color:#4285F4; background: rgba(66, 133, 244, 0.1); padding: 1px 7px; border-radius: 6px; border: 1px solid rgba(66, 133, 244, 0.2);">
                    ${getIcon('google')} Google Verified
                  </span>
                ` : ''}
              </div>
            </div>
          </div>

          <div style="padding: 14px 16px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 14px; margin-bottom: 1.5rem; display:flex; align-items:center; gap: 12px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #10B981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 800; flex-shrink: 0;">✓</div>
            <div style="font-size: 0.8125rem; color: var(--text-primary);">
              <strong style="font-size: 0.875rem; display: block; margin-bottom: 2px;">Real-Time Cloud Sync Active</strong>
              <div style="color: var(--text-secondary); font-size: 0.775rem;">All calculations, custom presets, and favorites are synced in real time.</div>
            </div>
          </div>

          <button id="auth-logout-btn" class="btn btn-outline" style="width: 100%; justify-content: center; border-color: rgba(239, 68, 68, 0.3); color: var(--accent-danger); font-weight: 700; padding: 10px; border-radius: 11px;">
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
    const googleBtn = rootEl.querySelector('#auth-google-btn');

    const closeModal = () => state.set('authModalOpen', false);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Google Sign-In button click
    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        const btnText = googleBtn.querySelector('#google-btn-text');
        if (btnText) btnText.textContent = 'Connecting Google...';
        googleBtn.disabled = true;

        try {
          await GoogleAuthService.promptSignIn();
        } catch (e) {
          console.warn('Google sign in error:', e);
        } finally {
          if (btnText) btnText.textContent = 'Continue with Google';
          googleBtn.disabled = false;
        }
      });
    }

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
