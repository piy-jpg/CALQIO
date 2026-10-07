/**
 * CALQIO Business Calculators: Margin & Markup, Break-Even, ROI, Discount
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

// 1. Margin & Markup Calculator
export const MarginMarkupCalculator = {
  id: 'margin_markup',
  name: 'Margin & Markup',
  category: 'business',
  icon: 'business',
  description: 'Calculate gross profit, profit margin %, and markup percentage on goods and services.',

  render(container) {
    const currency = Storage.getSettings().currency || '₹';

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
            ${getIcon('business')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Margin & Markup Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.3);">Profitability</span>
            </div>
            <p class="workspace-description">Determine cost, revenue, profit margins, and retail markup targets.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="mm-fav-btn" class="icon-btn ${Storage.isFavorite('margin_markup') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('margin_markup') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="mm-cost">Cost of Goods Sold (COGS)</label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="mm-cost" class="input-field" value="120" step="any">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="mm-revenue">Selling Price (Revenue)</label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="mm-revenue" class="input-field" value="200" step="any">
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="mm-calc-btn" class="btn btn-primary" style="flex:1;">Compute Margins</button>
            <button id="mm-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Gross Profit</span>
            <button id="mm-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="mm-profit-val" style="color:#10b981;">${currency}80.00</div>
            <div class="result-sub-value" id="mm-sub-val">Margin: 40.0% | Markup: 66.7%</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Profit Margin</div>
              <div class="breakdown-item-value" id="mm-margin-val" style="color:#10b981;">40.00%</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Markup %</div>
              <div class="breakdown-item-value" id="mm-markup-val">66.67%</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formulas</div>
            <div id="mm-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              Margin = (Profit ÷ Revenue) × 100 = 40%<br>
              Markup = (Profit ÷ Cost) × 100 = 66.7%
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
    inputs.forEach(i => i.addEventListener('input', () => this.calculate()));

    container.querySelector('#mm-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Margins calculated & saved');
    });

    container.querySelector('#mm-reset-btn').addEventListener('click', () => {
      container.querySelector('#mm-cost').value = 120;
      container.querySelector('#mm-revenue').value = 200;
      this.calculate();
    });

    container.querySelector('#mm-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#mm-profit-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied profit: ${val}`));
    });

    const favBtn = container.querySelector('#mm-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('margin_markup');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const currency = Storage.getSettings().currency || '₹';
    const cost = parseFloat(document.getElementById('mm-cost')?.value) || 0;
    const rev = parseFloat(document.getElementById('mm-revenue')?.value) || 0;

    const profit = rev - cost;
    const margin = rev !== 0 ? (profit / rev) * 100 : 0;
    const markup = cost !== 0 ? (profit / cost) * 100 : 0;

    const pVal = document.getElementById('mm-profit-val');
    const sVal = document.getElementById('mm-sub-val');
    const mVal = document.getElementById('mm-margin-val');
    const uVal = document.getElementById('mm-markup-val');
    const fText = document.getElementById('mm-formula-text');

    const fmtCurr = (n) => `${currency}${parseFloat(n.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    if (pVal) {
      pVal.textContent = fmtCurr(profit);
      pVal.style.color = profit >= 0 ? '#10b981' : '#ef4444';
    }
    if (sVal) sVal.textContent = `Margin: ${margin.toFixed(2)}% | Markup: ${markup.toFixed(2)}%`;
    if (mVal) mVal.textContent = `${margin.toFixed(2)}%`;
    if (uVal) uVal.textContent = `${markup.toFixed(2)}%`;
    if (fText) fText.innerHTML = `Profit = ${fmtCurr(rev)} − ${fmtCurr(cost)} = ${fmtCurr(profit)}<br>Margin = (${fmtCurr(profit)} ÷ ${fmtCurr(rev)}) × 100 = ${margin.toFixed(2)}%<br>Markup = (${fmtCurr(profit)} ÷ ${fmtCurr(cost)}) × 100 = ${markup.toFixed(2)}%`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'margin_markup',
        calcName: 'Margin & Markup',
        expression: `Cost ${fmtCurr(cost)}, Rev ${fmtCurr(rev)}`,
        result: `Profit: ${fmtCurr(profit)} (${margin.toFixed(1)}% margin)`
      });
    }
  }
};

// 2. Break-Even Analysis Calculator
export const BreakEvenCalculator = {
  id: 'breakeven',
  name: 'Break-Even Analysis',
  category: 'business',
  icon: 'business',
  description: 'Calculate the number of units and total sales required to cover all fixed and variable costs.',

  render(container) {
    const currency = Storage.getSettings().currency || '₹';

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
            ${getIcon('business')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Break-Even Analysis</h1>
              <span class="badge badge-primary" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.3);">Business Model</span>
            </div>
            <p class="workspace-description">Find the exact sales volume needed to reach zero profit and zero loss.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="be-fav-btn" class="icon-btn ${Storage.isFavorite('breakeven') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('breakeven') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="be-fixed">Total Fixed Costs (Rent, Salaries, etc.)</label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="be-fixed" class="input-field" value="50000" step="1000">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="be-price">Price Per Unit (Selling Price)</label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="be-price" class="input-field" value="100" step="1">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="be-var">Variable Cost Per Unit (Materials, Labor)</label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="be-var" class="input-field" value="40" step="1">
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="be-calc-btn" class="btn btn-primary" style="flex:1;">Calculate Break-Even</button>
            <button id="be-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Break-Even Sales Volume</span>
            <button id="be-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="be-units-val">834 units</div>
            <div class="result-sub-value" id="be-rev-val">Break-Even Revenue: ${currency}83,400</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Contribution Margin</div>
              <div class="breakdown-item-value" id="be-contrib-val">${currency}60.00 (60%)</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Break-Even Sales</div>
              <div class="breakdown-item-value" id="be-sales-val">${currency}83,400</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formula</div>
            <div id="be-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              Break-Even Units = Fixed Costs ÷ (Price − Variable Cost) = 50,000 ÷ (100 − 40) = 834 Units
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
    inputs.forEach(i => i.addEventListener('input', () => this.calculate()));

    container.querySelector('#be-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Break-even calculated & saved');
    });

    container.querySelector('#be-reset-btn').addEventListener('click', () => {
      container.querySelector('#be-fixed').value = 50000;
      container.querySelector('#be-price').value = 100;
      container.querySelector('#be-var').value = 40;
      this.calculate();
    });

    container.querySelector('#be-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#be-units-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#be-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('breakeven');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const currency = Storage.getSettings().currency || '₹';
    const fixed = parseFloat(document.getElementById('be-fixed')?.value) || 0;
    const price = parseFloat(document.getElementById('be-price')?.value) || 0;
    const vCost = parseFloat(document.getElementById('be-var')?.value) || 0;

    const contrib = price - vCost;
    if (contrib <= 0) return;

    const units = Math.ceil(fixed / contrib);
    const breakEvenRev = units * price;
    const contribRatio = (contrib / price) * 100;

    const fmtCurr = (n) => `${currency}${Math.round(n).toLocaleString('en-US')}`;

    const uEl = document.getElementById('be-units-val');
    const rEl = document.getElementById('be-rev-val');
    const cEl = document.getElementById('be-contrib-val');
    const sEl = document.getElementById('be-sales-val');
    const fEl = document.getElementById('be-formula-text');

    if (uEl) uEl.textContent = `${units.toLocaleString('en-US')} units`;
    if (rEl) rEl.textContent = `Break-Even Revenue: ${fmtCurr(breakEvenRev)}`;
    if (cEl) cEl.textContent = `${fmtCurr(contrib)} (${contribRatio.toFixed(1)}%)`;
    if (sEl) sEl.textContent = fmtCurr(breakEvenRev);
    if (fEl) fEl.textContent = `Break-Even Units = ${fmtCurr(fixed)} ÷ (${fmtCurr(price)} − ${fmtCurr(vCost)}) = ${units.toLocaleString('en-US')} Units`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'breakeven',
        calcName: 'Break-Even Analysis',
        expression: `Fixed ${fmtCurr(fixed)}, Margin ${fmtCurr(contrib)}/unit`,
        result: `Break-Even: ${units} units (${fmtCurr(breakEvenRev)})`
      });
    }
  }
};
