/**
 * CALQIO Everyday Tools: Tip & Bill Split, Fuel & Trip Cost, Salary Converter
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

// 1. Tip & Bill Split Calculator
export const TipCalculator = {
  id: 'tip_split',
  name: 'Tip & Bill Split',
  category: 'everyday',
  icon: 'everyday',
  description: 'Calculate tip percentages, total bill amount, and split fairly among friends or colleagues.',

  render(container) {
    const currency = Storage.getSettings().currency || '₹';

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">🍽️</div>
          <div>
            <h1 class="workspace-heading">Tip & Split Bill Calculator</h1>
            <p class="workspace-description">Quickly compute gratuity, tax additions, and per-person cost share.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="tip-fav-btn" class="icon-btn ${Storage.isFavorite('tip_split') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('tip_split') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="tip-bill">Bill Amount</label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="tip-bill" class="input-field" value="2400" min="1" step="10">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="tip-pct">Tip Percentage</label>
            <div style="display:flex; gap:6px; margin-bottom:8px;">
              <button class="btn btn-subtle btn-sm tip-preset" data-pct="10">10%</button>
              <button class="btn btn-primary btn-sm tip-preset" data-pct="15">15%</button>
              <button class="btn btn-subtle btn-sm tip-preset" data-pct="18">18%</button>
              <button class="btn btn-subtle btn-sm tip-preset" data-pct="20">20%</button>
            </div>
            <div class="input-wrapper has-suffix">
              <input type="number" id="tip-pct" class="input-field" value="15" min="0" max="100" step="1">
              <span class="input-suffix">%</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="tip-people">Number of People</label>
            <input type="number" id="tip-people" class="input-field" value="4" min="1" max="100" step="1">
          </div>

          <div class="calc-action-buttons">
            <button id="tip-calc-btn" class="btn btn-primary" style="flex:1;">Compute Share</button>
            <button id="tip-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Amount Per Person</span>
            <button id="tip-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="tip-per-person-val" style="color:var(--accent-primary);">${currency}690.00</div>
            <div class="result-sub-value" id="tip-total-val">Total with Tip: ${currency}2,760.00</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Tip Amount</div>
              <div class="breakdown-item-value" id="tip-amount-val">${currency}360.00</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Tip Per Person</div>
              <div class="breakdown-item-value" id="tip-per-tip-val">${currency}90.00</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Summary</div>
            <div id="tip-summary-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              ${currency}2,400 bill + 15% tip (${currency}360) = ${currency}2,760 total divided by 4 diners.
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
    const presets = container.querySelectorAll('.tip-preset');
    const tipPctInput = container.querySelector('#tip-pct');

    inputs.forEach(i => i.addEventListener('input', () => this.calculate()));

    presets.forEach(p => {
      p.addEventListener('click', () => {
        presets.forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-subtle'); });
        p.classList.remove('btn-subtle');
        p.classList.add('btn-primary');
        tipPctInput.value = p.dataset.pct;
        this.calculate();
      });
    });

    container.querySelector('#tip-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Tip & Split computed');
    });

    container.querySelector('#tip-reset-btn').addEventListener('click', () => {
      container.querySelector('#tip-bill').value = 2400;
      container.querySelector('#tip-pct').value = 15;
      container.querySelector('#tip-people').value = 4;
      this.calculate();
    });

    container.querySelector('#tip-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#tip-per-person-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied per-person share: ${val}`));
    });

    const favBtn = container.querySelector('#tip-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('tip_split');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const currency = Storage.getSettings().currency || '₹';
    const bill = parseFloat(document.getElementById('tip-bill')?.value) || 0;
    const pct = parseFloat(document.getElementById('tip-pct')?.value) || 0;
    const people = Math.max(1, parseInt(document.getElementById('tip-people')?.value, 10) || 1);

    const tipAmt = (bill * pct) / 100;
    const total = bill + tipAmt;
    const perPerson = total / people;
    const tipPerPerson = tipAmt / people;

    const fmt = (n) => `${currency}${parseFloat(n.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const pEl = document.getElementById('tip-per-person-val');
    const tEl = document.getElementById('tip-total-val');
    const aEl = document.getElementById('tip-amount-val');
    const ptEl = document.getElementById('tip-per-tip-val');
    const sEl = document.getElementById('tip-summary-text');

    if (pEl) pEl.textContent = fmt(perPerson);
    if (tEl) tEl.textContent = `Total with Tip: ${fmt(total)}`;
    if (aEl) aEl.textContent = fmt(tipAmt);
    if (ptEl) ptEl.textContent = fmt(tipPerPerson);
    if (sEl) sEl.textContent = `${fmt(bill)} bill + ${pct}% tip (${fmt(tipAmt)}) = ${fmt(total)} split across ${people} people.`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'tip_split',
        calcName: 'Tip & Bill Split',
        expression: `${fmt(bill)} + ${pct}% tip / ${people} people`,
        result: `${fmt(perPerson)} / person`
      });
    }
  }
};
