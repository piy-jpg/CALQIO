/**
 * CALQIO Engineering Tools: Horsepower & Torque, Gear Ratio
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const HorsepowerTorqueCalculator = {
  id: 'hp_torque',
  name: 'Horsepower & Torque',
  category: 'engineering',
  icon: 'engineering',
  description: 'Convert between Mechanical Horsepower (HP), Torque (lb-ft or Nm), and Engine RPM.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">⚙️</div>
          <div>
            <h1 class="workspace-heading">Horsepower & Torque Calculator</h1>
            <p class="workspace-description">Convert rotational torque, engine RPM, and brake horsepower (HP / kW).</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="hp-fav-btn" class="icon-btn ${Storage.isFavorite('hp_torque') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('hp_torque') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="hp-rpm">Engine Speed (RPM)</label>
            <input type="number" id="hp-rpm" class="input-field" value="5252" step="50" min="100">
          </div>

          <div class="form-group">
            <label class="form-label" for="hp-torque">Torque (lb-ft)</label>
            <input type="number" id="hp-torque" class="input-field" value="300" step="5" min="1">
          </div>

          <div class="calc-action-buttons">
            <button id="hp-calc-btn" class="btn btn-primary" style="flex:1;">Compute Horsepower</button>
            <button id="hp-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Calculated Power</span>
            <button id="hp-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="hp-main-val" style="color:var(--accent-primary);">300.0 HP</div>
            <div class="result-sub-value" id="hp-sub-val">223.7 kW (Kilowatts)</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Metric Torque (Nm)</div>
              <div class="breakdown-item-value" id="hp-nm-val">406.7 Nm</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Power (Watts)</div>
              <div class="breakdown-item-value" id="hp-watts-val">223,710 W</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Engineering Formula</div>
            <div id="hp-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              HP = (Torque in lb-ft × RPM) ÷ 5252. At 5,252 RPM, Horsepower and Torque in lb-ft are always numerically equal.
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

    container.querySelector('#hp-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Horsepower computed');
    });

    container.querySelector('#hp-reset-btn').addEventListener('click', () => {
      container.querySelector('#hp-rpm').value = 5252;
      container.querySelector('#hp-torque').value = 300;
      this.calculate();
    });

    container.querySelector('#hp-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#hp-main-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#hp-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('hp_torque');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const rpm = parseFloat(document.getElementById('hp-rpm')?.value) || 0;
    const torque = parseFloat(document.getElementById('hp-torque')?.value) || 0;

    const hp = (torque * rpm) / 5252;
    const kw = hp * 0.745699872;
    const nm = torque * 1.355818;

    const hEl = document.getElementById('hp-main-val');
    const sEl = document.getElementById('hp-sub-val');
    const nEl = document.getElementById('hp-nm-val');
    const wEl = document.getElementById('hp-watts-val');

    if (hEl) hEl.textContent = `${hp.toFixed(1)} HP`;
    if (sEl) sEl.textContent = `${kw.toFixed(1)} kW (Kilowatts)`;
    if (nEl) nEl.textContent = `${nm.toFixed(1)} Nm`;
    if (wEl) wEl.textContent = `${Math.round(kw * 1000).toLocaleString('en-US')} W`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'hp_torque',
        calcName: 'Horsepower & Torque',
        expression: `${torque} lb-ft @ ${rpm} RPM`,
        result: `${hp.toFixed(1)} HP (${kw.toFixed(1)} kW)`
      });
    }
  }
};
