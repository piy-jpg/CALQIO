/**
 * CALQIO Age & Chronological Milestone Calculator
 * Accurate leap-year math, multi-unit life stats, next birthday countdown, and biological milestones.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const AgeCalculator = {
  id: 'age',
  name: 'Age Calculator Pro',
  category: 'datetime',
  icon: 'calendar',
  description: 'Calculate exact chronological age, total milestones lived, next birthday countdown, and life statistics.',

  state: {
    dob: '1998-05-15',
    targetDate: new Date().toISOString().split('T')[0]
  },

  render(container) {
    const todayStr = new Date().toISOString().split('T')[0];
    const isFav = Storage.isFavorite('age');

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border-color: rgba(245, 158, 11, 0.3);">
            ${getIcon('calendar')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Age Calculator Pro</h1>
              <span class="badge badge-primary" style="font-size:0.7rem; font-weight:700;">MILESTONES</span>
            </div>
            <p class="workspace-description">Compute precise chronological age, elapsed life duration, next birthday countdown, and biological metrics.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="age-fav-btn" class="icon-btn ${isFav ? 'active' : ''}" title="Favorite">
            ${getIcon(isFav ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="age-dob" style="font-weight:700;">Date of Birth</label>
            <div class="input-wrapper">
              <input type="date" id="age-dob" class="input-field" value="${this.state.dob}" max="${todayStr}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="age-target" style="font-weight:700;">Age as of Date</label>
            <div class="input-wrapper">
              <input type="date" id="age-target" class="input-field" value="${todayStr}">
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="age-calc-btn" class="btn btn-primary" style="flex:1;">Calculate & Save</button>
            <button id="age-today-btn" class="btn btn-secondary">Set to Today</button>
          </div>
        </div>

        <!-- Result Panel -->
        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Exact Chronological Age</span>
            <button id="age-copy-btn" class="btn btn-subtle btn-sm" title="Copy age">
              ${getIcon('copy')} Copy
            </button>
          </div>

          <div>
            <div class="result-main-value" id="age-main-val">28 years</div>
            <div class="result-sub-value" id="age-sub-val">4 months, 19 days</div>
          </div>

          <!-- Next Birthday Card -->
          <div class="breakdown-item" style="background: var(--accent-primary-light); border-color: var(--accent-primary-border); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div class="breakdown-item-label" style="color: var(--accent-primary); font-weight:700;">Next Birthday Countdown</div>
              <div class="breakdown-item-value" id="age-next-bday" style="color: var(--text-primary); font-size: 1.1rem;">7 months, 11 days</div>
            </div>
            <div id="age-next-bday-day" class="badge badge-primary" style="font-size:0.8rem; padding:4px 10px;">Friday</div>
          </div>

          <!-- Total Life Statistics -->
          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Months</div>
              <div class="breakdown-item-value" id="age-total-months">340</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Weeks</div>
              <div class="breakdown-item-value" id="age-total-weeks">1,481</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Days</div>
              <div class="breakdown-item-value" id="age-total-days">10,369</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Hours</div>
              <div class="breakdown-item-value" id="age-total-hours">248,856</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Est. Heartbeats</div>
              <div class="breakdown-item-value" id="age-total-heartbeats">1.04B</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Est. Breaths</div>
              <div class="breakdown-item-value" id="age-total-breaths">238M</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">
              ${getIcon('info')} Milestone Summary
            </div>
            <div id="age-summary-text" style="color: var(--text-secondary); font-size: 0.8125rem; margin-top: 4px; line-height:1.45;">
              Born on a Friday. You have experienced over 10,000 sunrises!
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const dobInput = container.querySelector('#age-dob');
    const targetInput = container.querySelector('#age-target');

    dobInput?.addEventListener('change', () => this.calculate());
    targetInput?.addEventListener('change', () => this.calculate());

    container.querySelector('#age-calc-btn')?.addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Age calculated & saved to history');
    });

    container.querySelector('#age-today-btn')?.addEventListener('click', () => {
      if (targetInput) {
        targetInput.value = new Date().toISOString().split('T')[0];
        this.calculate();
      }
    });

    container.querySelector('#age-copy-btn')?.addEventListener('click', () => {
      const main = container.querySelector('#age-main-val')?.textContent || '';
      const sub = container.querySelector('#age-sub-val')?.textContent || '';
      const full = `${main}, ${sub}`;
      navigator.clipboard.writeText(full).then(() => {
        Toast.success(`Copied "${full}" to clipboard`);
      });
    });

    const favBtn = container.querySelector('#age-fav-btn');
    favBtn?.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('age');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const dobVal = document.getElementById('age-dob')?.value;
    const targetVal = document.getElementById('age-target')?.value;

    if (!dobVal || !targetVal) return;

    const dob = new Date(dobVal + 'T00:00:00');
    const target = new Date(targetVal + 'T00:00:00');

    if (dob > target) {
      const mainEl = document.getElementById('age-main-val');
      if (mainEl) mainEl.textContent = 'Invalid date range';
      return;
    }

    // Exact years, months, days computation
    let years = target.getFullYear() - dob.getFullYear();
    let months = target.getMonth() - dob.getMonth();
    let days = target.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total units elapsed
    const diffMs = target.getTime() - dob.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const estHeartbeats = totalMinutes * 72; // ~72 bpm
    const estBreaths = totalMinutes * 16;     // ~16 breaths/min

    // Next Birthday calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, dob.getMonth(), dob.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, dob.getMonth(), dob.getDate());
    }

    let bdayMonths = nextBday.getMonth() - target.getMonth();
    let bdayDays = nextBday.getDate() - target.getDate();
    if (bdayDays < 0) {
      bdayMonths--;
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      bdayDays += prevMonth.getDate();
    }
    if (bdayMonths < 0) {
      bdayMonths += 12;
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDayName = dayNames[dob.getDay()];
    const nextBdayDayName = dayNames[nextBday.getDay()];

    const formatBig = (n) => {
      if (n >= 1e9) return (n / 1e9).toFixed(2) + ' Billion';
      if (n >= 1e6) return (n / 1e6).toFixed(1) + ' Million';
      return n.toLocaleString('en-US');
    };

    // DOM updates
    const mainEl = document.getElementById('age-main-val');
    const subEl = document.getElementById('age-sub-val');
    const nextBdayEl = document.getElementById('age-next-bday');
    const nextBdayDayEl = document.getElementById('age-next-bday-day');
    const tMonthsEl = document.getElementById('age-total-months');
    const tWeeksEl = document.getElementById('age-total-weeks');
    const tDaysEl = document.getElementById('age-total-days');
    const tHoursEl = document.getElementById('age-total-hours');
    const tBeatsEl = document.getElementById('age-total-heartbeats');
    const tBreathsEl = document.getElementById('age-total-breaths');
    const summaryEl = document.getElementById('age-summary-text');

    if (mainEl) mainEl.textContent = `${years} years`;
    if (subEl) subEl.textContent = `${months} months, ${days} days`;
    if (nextBdayEl) {
      if (bdayMonths === 0 && bdayDays === 0) {
        nextBdayEl.textContent = '🎉 Happy Birthday Today!';
      } else {
        nextBdayEl.textContent = `${bdayMonths} months, ${bdayDays} days`;
      }
    }
    if (nextBdayDayEl) nextBdayDayEl.textContent = nextBdayDayName;

    if (tMonthsEl) tMonthsEl.textContent = totalMonths.toLocaleString('en-US');
    if (tWeeksEl) tWeeksEl.textContent = totalWeeks.toLocaleString('en-US');
    if (tDaysEl) tDaysEl.textContent = totalDays.toLocaleString('en-US');
    if (tHoursEl) tHoursEl.textContent = totalHours.toLocaleString('en-US');
    if (tBeatsEl) tBeatsEl.textContent = formatBig(estHeartbeats);
    if (tBreathsEl) tBreathsEl.textContent = formatBig(estBreaths);

    if (summaryEl) {
      summaryEl.textContent = `Born on a ${bornDayName}. You have experienced ${totalDays.toLocaleString('en-US')} days of life, ~${formatBig(estHeartbeats)} heartbeats, and ~${formatBig(estBreaths)} breaths!`;
    }

    if (logHistory) {
      Storage.addHistory({
        calcId: 'age',
        calcName: 'Age Calculator Pro',
        expression: `DOB: ${dobVal}`,
        result: `${years} yrs, ${months} mos, ${days} days`,
        inputs: { dob: dobVal, target: targetVal }
      });
    }
  }
};

