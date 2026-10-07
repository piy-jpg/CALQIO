/**
 * CALQIO Date & Time Tools: Date Difference, Time Duration, Work Hours
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

// 1. Date Difference Calculator Pro
export const DateDifferenceCalculator = {
  id: 'date_diff',
  name: 'Date Difference Pro',
  category: 'datetime',
  icon: 'calendar',
  description: 'Calculate exact number of days, weeks, months, business workdays, and hours between two calendar dates.',

  render(container) {
    const todayStr = new Date().toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const isFav = Storage.isFavorite('date_diff');

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border-color: rgba(245, 158, 11, 0.3);">
            ${getIcon('calendar')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Date Difference Pro</h1>
              <span class="badge badge-primary" style="font-size:0.7rem; font-weight:700;">DURATION</span>
            </div>
            <p class="workspace-description">Compute precise calendar duration, working days (M-F), weekend count, and hourly intervals.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="dd-fav-btn" class="icon-btn ${isFav ? 'active' : ''}" title="Favorite">
            ${getIcon(isFav ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="dd-start" style="font-weight:700;">Start Date</label>
            <input type="date" id="dd-start" class="input-field" value="${todayStr}">
          </div>

          <div class="form-group">
            <label class="form-label" for="dd-end" style="font-weight:700;">End Date</label>
            <input type="date" id="dd-end" class="input-field" value="${futureDate}">
          </div>

          <!-- Quick Presets -->
          <div style="margin-top: 0.5rem;">
            <label class="form-label" style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Interval Presets</label>
            <div id="dd-presets-container" style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-top:4px;">
              <button class="filter-chip-btn dd-preset-btn" data-days="30">+30 Days</button>
              <button class="filter-chip-btn dd-preset-btn" data-days="60">+60 Days</button>
              <button class="filter-chip-btn dd-preset-btn" data-days="90">+90 Days</button>
              <button class="filter-chip-btn dd-preset-btn" data-days="180">+6 Months</button>
              <button class="filter-chip-btn dd-preset-btn" data-days="365">+1 Year</button>
            </div>
          </div>

          <div class="calc-action-buttons" style="margin-top: 1.25rem;">
            <button id="dd-calc-btn" class="btn btn-primary" style="flex:1;">Compute Difference</button>
            <button id="dd-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Total Duration</span>
            <button id="dd-copy-btn" class="btn btn-subtle btn-sm" title="Copy result">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="dd-days-val">90 Days</div>
            <div class="result-sub-value" id="dd-sub-val">Approx. 2 months, 29 days</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Weeks</div>
              <div class="breakdown-item-value" id="dd-weeks-val">12 wks, 6 days</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Working Days (M-F)</div>
              <div class="breakdown-item-value" id="dd-workdays-val">65 days</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Weekend Days</div>
              <div class="breakdown-item-value" id="dd-weekends-val">25 days</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Hours</div>
              <div class="breakdown-item-value" id="dd-hours-val">2,160 hrs</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Interval Summary</div>
            <div id="dd-summary-text" style="color:var(--text-secondary); font-size:0.8125rem; margin-top:4px; line-height:1.45;">
              Equal to 2,160 hours or 129,600 minutes (65 business days, 25 weekend days).
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const inputs = container.querySelectorAll('.input-field');
    inputs.forEach(i => i.addEventListener('change', () => this.calculate()));

    container.querySelector('#dd-calc-btn')?.addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Date difference computed & saved');
    });

    container.querySelector('#dd-reset-btn')?.addEventListener('click', () => {
      const startEl = container.querySelector('#dd-start');
      const endEl = container.querySelector('#dd-end');
      if (startEl) startEl.value = new Date().toISOString().split('T')[0];
      if (endEl) endEl.value = new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      this.calculate();
    });

    container.querySelector('#dd-copy-btn')?.addEventListener('click', () => {
      const val = container.querySelector('#dd-days-val')?.textContent || '';
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#dd-fav-btn');
    favBtn?.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('date_diff');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });

    // Presets
    container.querySelectorAll('.dd-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days, 10);
        const startVal = container.querySelector('#dd-start')?.value || new Date().toISOString().split('T')[0];
        const startDate = new Date(startVal + 'T00:00:00');
        const endDate = new Date(startDate.getTime() + (days * 24 * 60 * 60 * 1000));
        const endEl = container.querySelector('#dd-end');
        if (endEl) {
          endEl.value = endDate.toISOString().split('T')[0];
          this.calculate();
        }
      });
    });
  },

  calculate(logHistory = false) {
    const d1Str = document.getElementById('dd-start')?.value;
    const d2Str = document.getElementById('dd-end')?.value;

    if (!d1Str || !d2Str) return;

    const d1 = new Date(d1Str + 'T00:00:00');
    const d2 = new Date(d2Str + 'T00:00:00');

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    // Approximate months
    const totalMonths = parseFloat((totalDays / 30.4375).toFixed(1));

    // Count business days
    let workDays = 0;
    const cur = new Date(Math.min(d1.getTime(), d2.getTime()));
    const end = new Date(Math.max(d1.getTime(), d2.getTime()));
    while (cur < end) {
      cur.setDate(cur.getDate() + 1);
      const day = cur.getDay();
      if (day !== 0 && day !== 6) workDays++;
    }
    const weekendDays = totalDays - workDays;

    const dEl = document.getElementById('dd-days-val');
    const sEl = document.getElementById('dd-sub-val');
    const wEl = document.getElementById('dd-weeks-val');
    const bEl = document.getElementById('dd-workdays-val');
    const weEl = document.getElementById('dd-weekends-val');
    const hEl = document.getElementById('dd-hours-val');
    const sumEl = document.getElementById('dd-summary-text');

    if (dEl) dEl.textContent = `${totalDays.toLocaleString('en-US')} Days`;
    if (sEl) sEl.textContent = `Interval from ${d1Str} to ${d2Str} (~${totalMonths} months)`;
    if (wEl) wEl.textContent = `${weeks} wks, ${remDays} days`;
    if (bEl) bEl.textContent = `${workDays} workdays`;
    if (weEl) weEl.textContent = `${weekendDays} days`;
    if (hEl) hEl.textContent = `${(totalDays * 24).toLocaleString('en-US')} hrs`;
    if (sumEl) sumEl.textContent = `Total duration: ${(totalDays * 24).toLocaleString('en-US')} hours or ${(totalDays * 24 * 60).toLocaleString('en-US')} minutes (${workDays} business workdays, ${weekendDays} weekend days).`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'date_diff',
        calcName: 'Date Difference Pro',
        expression: `${d1Str} → ${d2Str}`,
        result: `${totalDays} Days (${workDays} workdays)`
      });
    }
  }
};

