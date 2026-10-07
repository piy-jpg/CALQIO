/**
 * CALQIO SIP & Compound Investment Calculator
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const InvestmentCalculator = {
  id: 'investment',
  name: 'SIP / Investment Calculator',
  category: 'finance',
  icon: 'trendingUp',
  description: 'Calculate future wealth from Systematic Investment Plans (SIP) and compound growth.',

  state: {
    monthlyDeposit: 5000,
    expectedReturn: 12,
    years: 10
  },

  render(container) {
    const currency = Storage.getSettings().currency || '₹';

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(5, 150, 105, 0.15); color: #059669; border: 1px solid rgba(5, 150, 105, 0.3);">
            ${getIcon('trendingUp')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">SIP & Investment Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(5, 150, 105, 0.15); color: #059669; border-color: rgba(5, 150, 105, 0.3);">Compound Growth</span>
            </div>
            <p class="workspace-description">Simulate wealth accumulation through regular monthly contributions and compound interest.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="inv-fav-btn" class="icon-btn ${Storage.isFavorite('investment') ? 'active' : ''}" title="Favorite">
            ${getIcon(Storage.isFavorite('investment') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="inv-monthly">
              <span>Monthly Investment</span>
              <span class="form-label-hint" id="inv-monthly-hint">${currency}5,000</span>
            </label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="inv-monthly" class="input-field" value="${this.state.monthlyDeposit}" min="500" step="500">
            </div>
            <input type="range" id="inv-monthly-range" min="500" max="100000" step="500" value="${this.state.monthlyDeposit}" style="width:100%; margin-top: 6px; accent-color: var(--accent-primary);">
          </div>

          <div class="form-group">
            <label class="form-label" for="inv-return">
              <span>Expected Annual Return (% p.a.)</span>
              <span class="form-label-hint" id="inv-return-hint">12%</span>
            </label>
            <div class="input-wrapper has-suffix">
              <input type="number" id="inv-return" class="input-field" value="${this.state.expectedReturn}" min="1" max="30" step="0.5">
              <span class="input-suffix">%</span>
            </div>
            <input type="range" id="inv-return-range" min="1" max="30" step="0.5" value="${this.state.expectedReturn}" style="width:100%; margin-top: 6px; accent-color: var(--accent-primary);">
          </div>

          <div class="form-group">
            <label class="form-label" for="inv-years">
              <span>Investment Duration</span>
              <span class="form-label-hint" id="inv-years-hint">10 Years</span>
            </label>
            <div class="input-wrapper has-suffix">
              <input type="number" id="inv-years" class="input-field" value="${this.state.years}" min="1" max="40" step="1">
              <span class="input-suffix">Years</span>
            </div>
            <input type="range" id="inv-years-range" min="1" max="40" step="1" value="${this.state.years}" style="width:100%; margin-top: 6px; accent-color: var(--accent-primary);">
          </div>

          <div class="calc-action-buttons">
            <button id="inv-calc-btn" class="btn btn-primary" style="flex:1;">Calculate & Save</button>
            <button id="inv-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <!-- Result Panel -->
        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Expected Maturity Value</span>
            <button id="inv-copy-btn" class="btn btn-subtle btn-sm" title="Copy result">
              ${getIcon('copy')} Copy
            </button>
          </div>

          <div>
            <div class="result-main-value" id="inv-total-val" style="color: #10b981;">${currency}1,161,695</div>
            <div class="result-sub-value" id="inv-wealth-gain">Wealth Gained: ${currency}561,695 (+93.6%)</div>
          </div>

          <!-- Progress Bar Growth Comparison -->
          <div style="margin: 0.75rem 0;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px; font-weight: 600;">
              <span>Invested: <span id="inv-bar-invested-pct">51.7%</span></span>
              <span>Returns: <span id="inv-bar-returns-pct" style="color: #10b981;">48.3%</span></span>
            </div>
            <div style="height: 12px; border-radius: var(--radius-full); background: var(--bg-subtle); overflow: hidden; display: flex;">
              <div id="inv-bar-invested" style="width: 51.7%; background: var(--accent-primary);"></div>
              <div id="inv-bar-returns" style="width: 48.3%; background: #10b981;"></div>
            </div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Amount Invested</div>
              <div class="breakdown-item-value" id="inv-invested-val">${currency}600,000</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Estimated Returns</div>
              <div class="breakdown-item-value" id="inv-returns-val" style="color: #10b981;">${currency}561,695</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">
              ${getIcon('info')} SIP Formula
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 4px;">
              <span class="formula-tag">M = P × ({[1 + i]ⁿ − 1} ÷ i) × (1 + i)</span>
              <p style="margin-top: 4px; font-size: 0.75rem; color: var(--text-muted);">Compound growth reinvests periodic earnings, accelerating wealth accumulation exponentially over time.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const mInput = container.querySelector('#inv-monthly');
    const mRange = container.querySelector('#inv-monthly-range');
    const rInput = container.querySelector('#inv-return');
    const rRange = container.querySelector('#inv-return-range');
    const yInput = container.querySelector('#inv-years');
    const yRange = container.querySelector('#inv-years-range');

    mInput.addEventListener('input', () => { mRange.value = mInput.value; this.calculate(); });
    mRange.addEventListener('input', () => { mInput.value = mRange.value; this.calculate(); });

    rInput.addEventListener('input', () => { rRange.value = rInput.value; this.calculate(); });
    rRange.addEventListener('input', () => { rInput.value = rRange.value; this.calculate(); });

    yInput.addEventListener('input', () => { yRange.value = yInput.value; this.calculate(); });
    yRange.addEventListener('input', () => { yInput.value = yRange.value; this.calculate(); });

    container.querySelector('#inv-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Investment calculated & saved to history');
    });

    container.querySelector('#inv-reset-btn').addEventListener('click', () => {
      mInput.value = 5000;
      mRange.value = 5000;
      rInput.value = 12;
      rRange.value = 12;
      yInput.value = 10;
      yRange.value = 10;
      this.calculate();
    });

    container.querySelector('#inv-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#inv-total-val').textContent;
      navigator.clipboard.writeText(val).then(() => {
        Toast.success(`Copied maturity value: ${val}`);
      });
    });

    const favBtn = container.querySelector('#inv-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('investment');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const currency = Storage.getSettings().currency || '₹';
    const P = parseFloat(document.getElementById('inv-monthly')?.value) || 0;
    const annualRate = parseFloat(document.getElementById('inv-return')?.value) || 0;
    const years = parseFloat(document.getElementById('inv-years')?.value) || 0;

    if (P <= 0 || annualRate <= 0 || years <= 0) return;

    const n = years * 12; // Total monthly installments
    const i = annualRate / 12 / 100; // Monthly interest rate

    // SIP formula: M = P * (( (1 + i)^n - 1 ) / i) * (1 + i)
    const maturity = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const totalReturns = maturity - totalInvested;

    const investedPct = Math.round((totalInvested / maturity) * 1000) / 10;
    const returnsPct = Math.round((totalReturns / maturity) * 1000) / 10;
    const gainPct = Math.round((totalReturns / totalInvested) * 1000) / 10;

    const formatCurr = (num) => `${currency}${Math.round(num).toLocaleString('en-US')}`;

    // Update hints
    const mHint = document.getElementById('inv-monthly-hint');
    const rHint = document.getElementById('inv-return-hint');
    const yHint = document.getElementById('inv-years-hint');
    if (mHint) mHint.textContent = formatCurr(P);
    if (rHint) rHint.textContent = `${annualRate}%`;
    if (yHint) yHint.textContent = `${years} Years`;

    // Update results
    const totalEl = document.getElementById('inv-total-val');
    const gainEl = document.getElementById('inv-wealth-gain');
    const investedEl = document.getElementById('inv-invested-val');
    const returnsEl = document.getElementById('inv-returns-val');
    const barInvested = document.getElementById('inv-bar-invested');
    const barReturns = document.getElementById('inv-bar-returns');
    const barInvPct = document.getElementById('inv-bar-invested-pct');
    const barRetPct = document.getElementById('inv-bar-returns-pct');

    if (totalEl) totalEl.textContent = formatCurr(maturity);
    if (gainEl) gainEl.textContent = `Wealth Gained: ${formatCurr(totalReturns)} (+${gainPct}%)`;
    if (investedEl) investedEl.textContent = formatCurr(totalInvested);
    if (returnsEl) returnsEl.textContent = formatCurr(totalReturns);

    if (barInvested) barInvested.style.width = `${investedPct}%`;
    if (barReturns) barReturns.style.width = `${returnsPct}%`;
    if (barInvPct) barInvPct.textContent = `${investedPct}%`;
    if (barRetPct) barRetPct.textContent = `${returnsPct}%`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'investment',
        calcName: 'SIP Calculator',
        expression: `${formatCurr(P)}/mo @ ${annualRate}% for ${years} yrs`,
        result: `Total: ${formatCurr(maturity)}`,
        inputs: { monthly: P, rate: annualRate, years }
      });
    }
  }
};
