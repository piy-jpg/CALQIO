/**
 * CALQIO Authentication & User Profile Modal
 * High-precision, luminous modal dedicated exclusively to Real-Time Google Authentication & Cloud Sync.
 */

import { state } from '../state.js';
import { AuthApi } from '../api/auth.js';
import { GoogleAuthService } from '../services/googleAuth.js';
import { Storage } from '../storage.js';
import { getIcon } from '../icons.js';
import { Toast } from '../toast.js';

export const AuthModal = {
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
    return `
      <div class="cmd-palette-backdrop open" id="auth-modal-backdrop">
        <div class="cmd-palette-modal" style="max-width: 440px; padding: 32px 28px; border-radius: 24px; position:relative; overflow:hidden; background: var(--bg-surface); text-align: center;">
          <!-- Top Google Aura Gradient Line -->
          <div style="position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%);"></div>

          <!-- Close Button -->
          <div style="display:flex; justify-content:flex-end; margin-bottom: 4px;">
            <button id="auth-close-btn" class="icon-btn" style="width:34px; height:34px; border-radius: 10px;" aria-label="Close">
              ${getIcon('x')}
            </button>
          </div>

          <!-- Google / Brand Icon Box -->
          <div style="display:flex; justify-content:center; margin-bottom: 1rem;">
            <div style="width: 64px; height: 64px; border-radius: 20px; background: var(--bg-surface); border: 1.5px solid var(--border-default); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(66, 133, 244, 0.15);">
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/><path fill="#FBBC05" d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15Z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/></svg>
            </div>
          </div>

          <h2 style="font-size: 1.45rem; font-weight: 800; margin: 0 0 6px 0; color: var(--text-primary); letter-spacing:-0.03em;">
            Sign in with Google
          </h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.45;">
            Connect your Google account to enable real-time cloud sync across your devices.
          </p>

          <!-- Feature Cards Grid -->
          <div style="display:flex; flex-direction:column; gap: 8px; margin-bottom: 1.75rem; text-align: left;">
            <div style="display:flex; align-items:center; gap: 10px; padding: 10px 14px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px;">
              <span style="color:#10B981; font-weight:800; font-size:1rem;">✓</span>
              <div style="font-size: 0.8125rem; color: var(--text-primary);">
                <strong>Real-Time Cloud Synchronization</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Sync calculations, history & formulas in real time</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap: 10px; padding: 10px 14px; background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 12px;">
              <span style="color:#6366F1; font-weight:800; font-size:1rem;">✓</span>
              <div style="font-size: 0.8125rem; color: var(--text-primary);">
                <strong>289+ Solvers & Engineering Tools</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Save customized presets and quick favorites</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap: 10px; padding: 10px 14px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px;">
              <span style="color:#F59E0B; font-weight:800; font-size:1rem;">✓</span>
              <div style="font-size: 0.8125rem; color: var(--text-primary);">
                <strong>1-Click Instant Sign-In</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">No passwords required • 100% Private & Secure</div>
              </div>
            </div>
          </div>

          <!-- Main Google Sign-In Action Button -->
          <button type="button" class="btn-google-auth" id="auth-google-btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 13px 18px; border-radius: 14px; font-size: 0.95rem; font-weight: 800; cursor: pointer; transition: all var(--transition-fast); background: var(--bg-surface); border: 1.5px solid var(--border-default); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);">
            ${getIcon('google')}
            <span id="google-btn-text">Continue with Google</span>
          </button>

          <div style="margin-top: 1.25rem; text-align: center; font-size: 0.775rem; color: var(--text-muted); line-height: 1.4;">
            🔒 Protected by Google OAuth 2.0 & End-to-End Privacy
          </div>
        </div>
      </div>
    `;
  },

  renderProfileView(user) {
    const isGoogle = user.provider === 'google' || Boolean(user.email);
    return `
      <div class="cmd-palette-backdrop open" id="auth-modal-backdrop">
        <div class="cmd-palette-modal" style="max-width: 450px; padding: 28px 26px; border-radius: 24px; position:relative; overflow:hidden; background: var(--bg-surface);">
          <div style="position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, #4285F4 0%, #34A853 50%, #6366F1 100%);"></div>

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
                    ${getIcon('google')} Google Account
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
