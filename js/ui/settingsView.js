/**
 * CALQIO Settings & Preferences View
 * Complete personalization suite: Theme cards, currency defaults, formatting, shortcuts & backup.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';
import { state } from '../state.js';

export const SettingsView = {
  render(container) {
    const settings = Storage.getSettings();
    const currentTheme = state.get('theme');
    const favorites = Storage.getFavorites();
    const history = Storage.getHistory();
    const recents = Storage.getRecentCalcs();

    // Approximate storage usage in KB
    let storageBytes = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          storageBytes += (localStorage[key].length + key.length) * 2;
        }
      }
    } catch (e) {}
    const storageKb = (storageBytes / 1024).toFixed(1);

    container.innerHTML = `
      <div class="main-container" style="max-width: 860px;">
        <!-- HERO BANNER -->
        <div class="util-hero-card">
          <div class="util-hero-main">
            <div class="util-hero-icon" style="background: var(--accent-primary-light); color: var(--accent-primary); border: 1px solid var(--accent-primary-border);">
              ${getIcon('settings')}
            </div>
            <div>
              <h1 class="util-hero-title">
                Settings & Preferences
                <span class="badge badge-primary" style="font-size:0.75rem; vertical-align:middle;">PREFERENCES</span>
              </h1>
              <p class="util-hero-desc">Personalize your calculation studio, default currencies, precision, and storage.</p>
            </div>
          </div>
          <div class="util-hero-stats">
            <div class="util-stat-pill">
              <span>Local Storage:</span>
              <strong>${storageKb} KB</strong>
            </div>
          </div>
        </div>

        <div class="settings-grid-container">
          <!-- 1. APPEARANCE & THEMES -->
          <div class="settings-card-enhanced">
            <div class="settings-section-top">
              <div class="settings-section-icon">${getIcon('sun')}</div>
              <div>
                <h3 class="settings-section-heading">Appearance & Workspace Theme</h3>
              </div>
            </div>

            <div class="settings-row-modern" style="flex-direction:column; align-items:stretch;">
              <div class="settings-row-info" style="margin-bottom:0.75rem;">
                <span class="settings-row-label">Interface Theme Mode</span>
                <span class="settings-row-desc">Select between clean Blueprint Light and high-contrast Midnight Aurora dark mode.</span>
              </div>

              <div class="theme-preview-cards" id="settings-theme-cards">
                <div class="theme-card-option ${currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                  <div class="theme-thumb theme-thumb-light">
                    <div class="thumb-side"></div>
                    <div class="thumb-body">
                      <div class="thumb-bar"></div>
                      <div class="thumb-card"></div>
                    </div>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; font-size:0.875rem;">Blueprint Light</span>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Crisp & Sharp</span>
                  </div>
                </div>

                <div class="theme-card-option ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                  <div class="theme-thumb theme-thumb-dark">
                    <div class="thumb-side"></div>
                    <div class="thumb-body">
                      <div class="thumb-bar"></div>
                      <div class="thumb-card"></div>
                    </div>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; font-size:0.875rem;">Midnight Aurora</span>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Deep Contrast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. CURRENCY & NUMBER PRECISION -->
          <div class="settings-card-enhanced">
            <div class="settings-section-top">
              <div class="settings-section-icon">${getIcon('finance')}</div>
              <div>
                <h3 class="settings-section-heading">Currency & Precision Formatting</h3>
              </div>
            </div>

            <div class="settings-row-modern">
              <div class="settings-row-info">
                <span class="settings-row-label">Default Financial Currency</span>
                <span class="settings-row-desc">Automatically formatted across EMI, GST, SIP, Loan, and Business tools.</span>
              </div>
              <select id="settings-currency" class="input-field select-field" style="width: 150px; font-weight: 600;">
                <option value="₹" ${settings.currency === '₹' ? 'selected' : ''}>₹ (INR - Rupee)</option>
                <option value="$" ${settings.currency === '$' ? 'selected' : ''}>$ (USD - Dollar)</option>
                <option value="€" ${settings.currency === '€' ? 'selected' : ''}>€ (EUR - Euro)</option>
                <option value="£" ${settings.currency === '£' ? 'selected' : ''}>£ (GBP - Pound)</option>
                <option value="¥" ${settings.currency === '¥' ? 'selected' : ''}>¥ (JPY - Yen)</option>
                <option value="A$" ${settings.currency === 'A$' ? 'selected' : ''}>A$ (AUD - Dollar)</option>
                <option value="C$" ${settings.currency === 'C$' ? 'selected' : ''}>C$ (CAD - Dollar)</option>
              </select>
            </div>

            <div class="settings-row-modern">
              <div class="settings-row-info">
                <span class="settings-row-label">Decimal Precision</span>
                <span class="settings-row-desc">Maximum fractional digits displayed in computed results.</span>
              </div>
              <select id="settings-decimals" class="input-field select-field" style="width: 150px; font-weight: 600;">
                <option value="0" ${settings.decimals === 0 ? 'selected' : ''}>0 Decimals (1,250)</option>
                <option value="2" ${settings.decimals === 2 ? 'selected' : ''}>2 Decimals (1,250.00)</option>
                <option value="4" ${settings.decimals === 4 ? 'selected' : ''}>4 Decimals (1,250.0000)</option>
              </select>
            </div>

            <div class="settings-row-modern">
              <div class="settings-row-info">
                <span class="settings-row-label">Auto-Record History</span>
                <span class="settings-row-desc">Log calculations automatically to your private browser storage.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="settings-history-toggle" ${settings.historyRetention ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 3. KEYBOARD SHORTCUTS -->
          <div class="settings-card-enhanced">
            <div class="settings-section-top">
              <div class="settings-section-icon">${getIcon('search')}</div>
              <div>
                <h3 class="settings-section-heading">Keyboard Shortcuts & Navigation</h3>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; align-items:center; padding: 0.65rem 0.85rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <span style="font-weight:600; color:var(--text-primary);">Command Search</span>
                <kbd class="kbd">⌘K / Ctrl+K</kbd>
              </div>
              <div style="display: flex; justify-content: space-between; align-items:center; padding: 0.65rem 0.85rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <span style="font-weight:600; color:var(--text-primary);">Close Modals / Overlays</span>
                <kbd class="kbd">ESC</kbd>
              </div>
              <div style="display: flex; justify-content: space-between; align-items:center; padding: 0.65rem 0.85rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <span style="font-weight:600; color:var(--text-primary);">Basic / Sci: Evaluate</span>
                <kbd class="kbd">Enter / =</kbd>
              </div>
              <div style="display: flex; justify-content: space-between; align-items:center; padding: 0.65rem 0.85rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <span style="font-weight:600; color:var(--text-primary);">Basic / Sci: Clear All</span>
                <kbd class="kbd">ESC / C</kbd>
              </div>
            </div>
          </div>

          <!-- 4. DATA BACKUP & RESET -->
          <div class="settings-card-enhanced" style="border-color: rgba(239, 68, 68, 0.25);">
            <div class="settings-section-top">
              <div class="settings-section-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--accent-danger);">
                ${getIcon('trash')}
              </div>
              <div>
                <h3 class="settings-section-heading" style="color: var(--accent-danger);">Data Management & Reset</h3>
              </div>
            </div>

            <div class="settings-row-modern">
              <div class="settings-row-info">
                <span class="settings-row-label">Export Full Backup (JSON)</span>
                <span class="settings-row-desc">Download all your calculation logs, favorite pins, and settings into a JSON backup file.</span>
              </div>
              <button id="settings-export-json-btn" class="btn btn-outline btn-sm">
                ${getIcon('download')} Export Backup
              </button>
            </div>

            <div class="settings-row-modern">
              <div class="settings-row-info">
                <span class="settings-row-label">Reset Workspace Data</span>
                <span class="settings-row-desc">Wipes calculation logs (${history.length}), clears favorites (${favorites.length}), and restores factory defaults.</span>
              </div>
              <button id="settings-reset-all-btn" class="btn btn-danger btn-sm">
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    // Theme card clicking
    const themeCards = container.querySelectorAll('#settings-theme-cards .theme-card-option');
    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const theme = card.dataset.theme;
        state.setTheme(theme);
        Toast.success(`Theme set to ${theme === 'light' ? 'Blueprint Light' : 'Midnight Aurora'}`);
      });
    });

    // Currency select
    const currSelect = container.querySelector('#settings-currency');
    currSelect?.addEventListener('change', () => {
      state.updateSettings({ currency: currSelect.value });
      Toast.success(`Default currency changed to ${currSelect.value}`);
    });

    // Decimals select
    const decSelect = container.querySelector('#settings-decimals');
    decSelect?.addEventListener('change', () => {
      state.updateSettings({ decimals: parseInt(decSelect.value, 10) });
      Toast.success(`Decimal precision updated`);
    });

    // History toggle
    const histToggle = container.querySelector('#settings-history-toggle');
    histToggle?.addEventListener('change', () => {
      state.updateSettings({ historyRetention: histToggle.checked });
      Toast.info(histToggle.checked ? 'History logging enabled' : 'History logging disabled');
    });

    // Export JSON Backup
    const exportBtn = container.querySelector('#settings-export-json-btn');
    exportBtn?.addEventListener('click', () => {
      const backupData = {
        favorites: Storage.getFavorites(),
        history: Storage.getHistory(),
        recents: Storage.getRecentCalcs(),
        settings: Storage.getSettings(),
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calqio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      Toast.success('CALQIO backup exported successfully');
    });

    // Reset all data
    const resetBtn = container.querySelector('#settings-reset-all-btn');
    resetBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all CALQIO data? This will clear history, reset favorites, and restore default preferences.')) {
        localStorage.clear();
        state.setTheme('light');
        Toast.success('CALQIO data reset successfully');
        window.location.hash = '#/';
        setTimeout(() => window.location.reload(), 300);
      }
    });
  }
};

