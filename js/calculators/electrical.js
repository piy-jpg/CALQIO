/**
 * CALQIO Electrical Tools: Ohm's Law & Power Calculator
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const OhmsLawCalculator = {
  id: 'ohms_law',
  name: "Ohm's Law & Power",
  category: 'electrical',
  icon: 'electrical',
  description: "Calculate Voltage (V), Current (I), Resistance (R), and Electrical Power (P).",

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">⚡</div>
          <div>
            <h1 class="workspace-heading">Ohm's Law & Power Calculator</h1>
            <p class="workspace-description">Enter any 2 parameters to instantly calculate the other 2 electrical variables.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="ohm-fav-btn" class="icon-btn ${Storage.isFavorite('ohms_law') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('ohms_law') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="ohm-v">Voltage (V in Volts)</label>
            <input type="number" id="ohm-v" class="input-field" value="12" step="any">
          </div>

          <div class="form-group">
            <label class="form-label" for="ohm-r">Resistance (R in Ohms Ω)</label>
            <input type="number" id="ohm-r" class="input-field" value="4" step="any">
          </div>

          <div class="calc-action-buttons">
            <button id="ohm-calc-btn" class="btn btn-primary" style="flex:1;">Calculate Parameters</button>
            <button id="ohm-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Current (I in Amperes)</span>
            <button id="ohm-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="ohm-i-val" style="color:var(--accent-primary);">3.00 A</div>
            <div class="result-sub-value" id="ohm-p-sub">Electrical Power: 36.00 Watts (W)</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Power (P)</div>
              <div class="breakdown-item-value" id="ohm-p-item" style="color:#f59e0b;">36.00 W</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Energy / Hour</div>
              <div class="breakdown-item-value" id="ohm-wh-item">0.036 kWh</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formulas</div>
            <div id="ohm-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              I = V ÷ R = 12V ÷ 4Ω = 3A<br>
              P = V × I = 12V × 3A = 36W
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

    container.querySelector('#ohm-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success("Ohm's Law computed & saved");
    });

    container.querySelector('#ohm-reset-btn').addEventListener('click', () => {
      container.querySelector('#ohm-v').value = 12;
      container.querySelector('#ohm-r').value = 4;
      this.calculate();
    });

    container.querySelector('#ohm-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#ohm-i-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#ohm-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('ohms_law');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const v = parseFloat(document.getElementById('ohm-v')?.value) || 0;
    const r = parseFloat(document.getElementById('ohm-r')?.value) || 0;

    if (r === 0) return;

    const i = v / r;
    const p = v * i;
    const kwh = p / 1000;

    const iVal = document.getElementById('ohm-i-val');
    const pSub = document.getElementById('ohm-p-sub');
    const pItem = document.getElementById('ohm-p-item');
    const whItem = document.getElementById('ohm-wh-item');
    const fText = document.getElementById('ohm-formula-text');

    if (iVal) iVal.textContent = `${i.toFixed(2)} A`;
    if (pSub) pSub.textContent = `Electrical Power: ${p.toFixed(2)} Watts (W)`;
    if (pItem) pItem.textContent = `${p.toFixed(2)} W`;
    if (whItem) whItem.textContent = `${kwh.toFixed(3)} kWh`;
    if (fText) fText.innerHTML = `I = V ÷ R = ${v}V ÷ ${r}Ω = ${i.toFixed(2)}A<br>P = V × I = ${v}V × ${i.toFixed(2)}A = ${p.toFixed(2)}W`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'ohms_law',
        calcName: "Ohm's Law",
        expression: `${v}V, ${r}Ω`,
        result: `I = ${i.toFixed(2)}A, P = ${p.toFixed(2)}W`
      });
    }
  }
};
