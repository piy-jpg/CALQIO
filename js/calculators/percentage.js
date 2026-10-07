/**
 * CALQIO Percentage Calculator (4-in-1 Suite)
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const PercentageCalculator = {
  id: 'percentage',
  name: 'Percentage Calculator',
  category: 'calculators',
  icon: 'percent',
  description: 'Calculate simple percentages, percentage increase or decrease, differences, and fractions.',

  state: {
    mode: 'of', // 'of' | 'is_what' | 'change' | 'diff'
    // Mode 1: P% of X
    valP: 25,
    valX: 5000,
    // Mode 2: X is what % of Y
    isX: 450,
    isY: 1800,
    // Mode 3: Change from X to Y
    fromVal: 120,
    toVal: 180,
    // Mode 4: Difference between X and Y
    diffA: 200,
    diffB: 240
  },

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            ${getIcon('percent')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Percentage Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border-color: rgba(245, 158, 11, 0.3);">4-in-1 Suite</span>
            </div>
            <p class="workspace-description">Solve any percentage calculation, percentage change, increase, decrease, or difference with instant breakdown.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="pct-fav-btn" class="icon-btn ${Storage.isFavorite('percentage') ? 'active' : ''}" title="Favorite">
            ${getIcon(Storage.isFavorite('percentage') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label">Calculation Mode</label>
            <div class="segmented-control" id="pct-mode-tabs">
              <button class="segment-btn active" data-mode="of">% of Value</button>
              <button class="segment-btn" data-mode="is_what">What % is</button>
              <button class="segment-btn" data-mode="change">% Change</button>
              <button class="segment-btn" data-mode="diff">% Difference</button>
            </div>
          </div>

          <!-- Mode 1 Container: What is P% of X -->
          <div id="mode-panel-of" class="mode-panel">
            <div class="form-group">
              <label class="form-label" for="pct-p">Percentage Rate (%)</label>
              <div class="input-wrapper has-suffix">
                <input type="number" id="pct-p" class="input-field" value="${this.state.valP}" step="any" placeholder="e.g. 25">
                <span class="input-suffix">%</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="pct-x">Of Total Value</label>
              <div class="input-wrapper">
                <input type="number" id="pct-x" class="input-field" value="${this.state.valX}" step="any" placeholder="e.g. 5000">
              </div>
            </div>
          </div>

          <!-- Mode 2 Container: X is what % of Y -->
          <div id="mode-panel-is_what" class="mode-panel hidden">
            <div class="form-group">
              <label class="form-label" for="pct-is-x">Part Value (X)</label>
              <div class="input-wrapper">
                <input type="number" id="pct-is-x" class="input-field" value="${this.state.isX}" step="any" placeholder="e.g. 450">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="pct-is-y">Total Whole Value (Y)</label>
              <div class="input-wrapper">
                <input type="number" id="pct-is-y" class="input-field" value="${this.state.isY}" step="any" placeholder="e.g. 1800">
              </div>
            </div>
          </div>

          <!-- Mode 3 Container: % Change from X to Y -->
          <div id="mode-panel-change" class="mode-panel hidden">
            <div class="form-group">
              <label class="form-label" for="pct-from">Initial Value (From)</label>
              <div class="input-wrapper">
                <input type="number" id="pct-from" class="input-field" value="${this.state.fromVal}" step="any" placeholder="e.g. 120">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="pct-to">Final Value (To)</label>
              <div class="input-wrapper">
                <input type="number" id="pct-to" class="input-field" value="${this.state.toVal}" step="any" placeholder="e.g. 180">
              </div>
            </div>
          </div>

          <!-- Mode 4 Container: % Difference -->
          <div id="mode-panel-diff" class="mode-panel hidden">
            <div class="form-group">
              <label class="form-label" for="pct-diff-a">Value A</label>
              <div class="input-wrapper">
                <input type="number" id="pct-diff-a" class="input-field" value="${this.state.diffA}" step="any" placeholder="e.g. 200">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="pct-diff-b">Value B</label>
              <div class="input-wrapper">
                <input type="number" id="pct-diff-b" class="input-field" value="${this.state.diffB}" step="any" placeholder="e.g. 240">
              </div>
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="pct-calc-btn" class="btn btn-primary" style="flex:1;">Calculate</button>
            <button id="pct-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <!-- Result Panel -->
        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label" id="pct-result-label">Calculated Result</span>
            <button id="pct-copy-btn" class="btn btn-subtle btn-sm" title="Copy result">
              ${getIcon('copy')} Copy
            </button>
          </div>

          <div>
            <div class="result-main-value" id="pct-result-value">1,250</div>
            <div class="result-sub-value" id="pct-result-sub">25% of 5,000</div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">
              ${getIcon('info')} Formula & Breakdown
            </div>
            <div id="pct-formula-text" style="color: var(--text-secondary); margin-bottom: 0.5rem;">
              (25 ÷ 100) × 5,000 = 1,250
            </div>
            <div class="breakdown-grid" id="pct-breakdown-grid">
              <div class="breakdown-item">
                <div class="breakdown-item-label">Fraction</div>
                <div class="breakdown-item-value" id="pct-fraction-val">1/4 (0.25)</div>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-item-label">Remaining</div>
                <div class="breakdown-item-value" id="pct-remaining-val">3,750 (75%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    // Mode tabs
    const tabs = container.querySelectorAll('#pct-mode-tabs .segment-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.mode = btn.dataset.mode;

        container.querySelectorAll('.mode-panel').forEach(p => p.classList.add('hidden'));
        const activePanel = container.querySelector(`#mode-panel-${this.state.mode}`);
        if (activePanel) activePanel.classList.remove('hidden');

        this.calculate();
      });
    });

    // Inputs live calculate
    const inputs = container.querySelectorAll('.input-field');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.calculate());
    });

    // Calc and Reset buttons
    container.querySelector('#pct-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Percentage calculated & logged to history');
    });

    container.querySelector('#pct-reset-btn').addEventListener('click', () => {
      container.querySelector('#pct-p').value = 25;
      container.querySelector('#pct-x').value = 5000;
      container.querySelector('#pct-is-x').value = 450;
      container.querySelector('#pct-is-y').value = 1800;
      container.querySelector('#pct-from').value = 120;
      container.querySelector('#pct-to').value = 180;
      container.querySelector('#pct-diff-a').value = 200;
      container.querySelector('#pct-diff-b').value = 240;
      this.calculate();
    });

    // Copy result
    container.querySelector('#pct-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#pct-result-value').textContent;
      navigator.clipboard.writeText(val).then(() => {
        Toast.success(`Copied "${val}" to clipboard`);
      });
    });

    // Favorite toggle
    const favBtn = container.querySelector('#pct-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('percentage');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const mode = this.state.mode;
    let mainResult = '';
    let subResult = '';
    let formulaText = '';
    let expression = '';
    let item1Label = 'Item 1', item1Val = '-';
    let item2Label = 'Item 2', item2Val = '-';

    const formatNum = (num, decimals = 2) => {
      if (isNaN(num) || !isFinite(num)) return '0';
      return parseFloat(num.toFixed(decimals)).toLocaleString('en-US', { maximumFractionDigits: 4 });
    };

    if (mode === 'of') {
      const p = parseFloat(document.getElementById('pct-p')?.value) || 0;
      const x = parseFloat(document.getElementById('pct-x')?.value) || 0;
      const res = (p / 100) * x;
      const remaining = x - res;

      mainResult = formatNum(res);
      subResult = `${p}% of ${formatNum(x)}`;
      formulaText = `(${p} ÷ 100) × ${formatNum(x)} = ${formatNum(res)}`;
      expression = `${p}% of ${formatNum(x)}`;

      item1Label = 'Decimal Fraction';
      item1Val = `${formatNum(p / 100, 4)}`;
      item2Label = 'Remaining (100 - ' + p + '%)';
      item2Val = `${formatNum(remaining)} (${formatNum(100 - p)}%)`;

    } else if (mode === 'is_what') {
      const x = parseFloat(document.getElementById('pct-is-x')?.value) || 0;
      const y = parseFloat(document.getElementById('pct-is-y')?.value) || 0;
      const res = y !== 0 ? (x / y) * 100 : 0;

      mainResult = `${formatNum(res)}%`;
      subResult = `${formatNum(x)} is ${formatNum(res)}% of ${formatNum(y)}`;
      formulaText = `(${formatNum(x)} ÷ ${formatNum(y)}) × 100 = ${formatNum(res)}%`;
      expression = `${formatNum(x)} of ${formatNum(y)}`;

      item1Label = 'Fraction Ratio';
      item1Val = `${formatNum(x)} / ${formatNum(y)}`;
      item2Label = 'Multiplier';
      item2Val = `${formatNum(y !== 0 ? x / y : 0, 4)}x`;

    } else if (mode === 'change') {
      const from = parseFloat(document.getElementById('pct-from')?.value) || 0;
      const to = parseFloat(document.getElementById('pct-to')?.value) || 0;
      const change = to - from;
      const pctChange = from !== 0 ? (change / from) * 100 : 0;

      const isIncrease = change >= 0;
      mainResult = `${isIncrease ? '+' : ''}${formatNum(pctChange)}%`;
      subResult = `${isIncrease ? 'Increase' : 'Decrease'} of ${formatNum(Math.abs(change))}`;
      formulaText = `((${formatNum(to)} − ${formatNum(from)}) ÷ ${formatNum(from)}) × 100 = ${mainResult}`;
      expression = `${formatNum(from)} → ${formatNum(to)} (${mainResult})`;

      item1Label = 'Absolute Difference';
      item1Val = `${isIncrease ? '+' : ''}${formatNum(change)}`;
      item2Label = 'Growth Multiplier';
      item2Val = `${formatNum(from !== 0 ? to / from : 0, 3)}x`;

    } else if (mode === 'diff') {
      const a = parseFloat(document.getElementById('pct-diff-a')?.value) || 0;
      const b = parseFloat(document.getElementById('pct-diff-b')?.value) || 0;
      const avg = (a + b) / 2;
      const diff = Math.abs(a - b);
      const pctDiff = avg !== 0 ? (diff / avg) * 100 : 0;

      mainResult = `${formatNum(pctDiff)}%`;
      subResult = `Difference between ${formatNum(a)} and ${formatNum(b)}`;
      formulaText = `(|${formatNum(a)} − ${formatNum(b)}| ÷ ((${formatNum(a)} + ${formatNum(b)}) ÷ 2)) × 100 = ${formatNum(pctDiff)}%`;
      expression = `Diff between ${formatNum(a)} and ${formatNum(b)}`;

      item1Label = 'Absolute Gap';
      item1Val = `${formatNum(diff)}`;
      item2Label = 'Average Base';
      item2Val = `${formatNum(avg)}`;
    }

    const resValEl = document.getElementById('pct-result-value');
    const resSubEl = document.getElementById('pct-result-sub');
    const formulaEl = document.getElementById('pct-formula-text');
    const gridEl = document.getElementById('pct-breakdown-grid');

    if (resValEl) resValEl.textContent = mainResult;
    if (resSubEl) resSubEl.textContent = subResult;
    if (formulaEl) formulaEl.textContent = formulaText;
    if (gridEl) {
      gridEl.innerHTML = `
        <div class="breakdown-item">
          <div class="breakdown-item-label">${item1Label}</div>
          <div class="breakdown-item-value">${item1Val}</div>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-item-label">${item2Label}</div>
          <div class="breakdown-item-value">${item2Val}</div>
        </div>
      `;
    }

    if (logHistory) {
      Storage.addHistory({
        calcId: 'percentage',
        calcName: 'Percentage Calculator',
        expression: expression,
        result: mainResult,
        inputs: { mode }
      });
    }
  }
};
