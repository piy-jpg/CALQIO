/**
 * CALQIO Construction Tools: Concrete Volume, Flooring / Tile, Paint Coverage
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const ConcreteCalculator = {
  id: 'concrete',
  name: 'Concrete Slab Calculator',
  category: 'construction',
  icon: 'construction',
  description: 'Calculate volume of concrete required in cubic meters and cubic yards, plus bag count estimates.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">🏗️</div>
          <div>
            <h1 class="workspace-heading">Concrete Slab Calculator</h1>
            <p class="workspace-description">Estimate volume, premix bags, and materials needed for slabs and footings.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="conc-fav-btn" class="icon-btn ${Storage.isFavorite('concrete') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('concrete') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="conc-len">Length (meters)</label>
            <input type="number" id="conc-len" class="input-field" value="6" step="0.1" min="0.1">
          </div>
          <div class="form-group">
            <label class="form-label" for="conc-wid">Width (meters)</label>
            <input type="number" id="conc-wid" class="input-field" value="4" step="0.1" min="0.1">
          </div>
          <div class="form-group">
            <label class="form-label" for="conc-thick">Thickness (centimeters)</label>
            <input type="number" id="conc-thick" class="input-field" value="10" step="1" min="1">
          </div>

          <div class="calc-action-buttons">
            <button id="conc-calc-btn" class="btn btn-primary" style="flex:1;">Compute Volume</button>
            <button id="conc-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Total Concrete Volume</span>
            <button id="conc-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="conc-vol-val" style="color:var(--accent-primary);">2.40 m³</div>
            <div class="result-sub-value" id="conc-sub-val">Equivalent to 3.14 cubic yards</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Premix Bags (30 kg)</div>
              <div class="breakdown-item-value" id="conc-bags-val">~160 bags</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Surface Area</div>
              <div class="breakdown-item-value" id="conc-area-val">24.0 m²</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formula & Waste Margin</div>
            <div id="conc-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              Volume = 6m × 4m × 0.10m = 2.40 m³ (+10% recommended waste margin: 2.64 m³).
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

    container.querySelector('#conc-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Concrete volume computed');
    });

    container.querySelector('#conc-reset-btn').addEventListener('click', () => {
      container.querySelector('#conc-len').value = 6;
      container.querySelector('#conc-wid').value = 4;
      container.querySelector('#conc-thick').value = 10;
      this.calculate();
    });

    container.querySelector('#conc-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#conc-vol-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#conc-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('concrete');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const len = parseFloat(document.getElementById('conc-len')?.value) || 0;
    const wid = parseFloat(document.getElementById('conc-wid')?.value) || 0;
    const thickCm = parseFloat(document.getElementById('conc-thick')?.value) || 0;

    const area = len * wid;
    const volM3 = area * (thickCm / 100);
    const volYd3 = volM3 * 1.30795;
    // 1 m3 concrete ≈ 66 bags of 30kg (or 2200 kg/m3)
    const bags = Math.ceil(volM3 * 67);

    const vEl = document.getElementById('conc-vol-val');
    const sEl = document.getElementById('conc-sub-val');
    const bEl = document.getElementById('conc-bags-val');
    const aEl = document.getElementById('conc-area-val');
    const fEl = document.getElementById('conc-formula-text');

    if (vEl) vEl.textContent = `${volM3.toFixed(2)} m³`;
    if (sEl) sEl.textContent = `Equivalent to ${volYd3.toFixed(2)} cubic yards`;
    if (bEl) bEl.textContent = `~${bags} bags (30kg)`;
    if (aEl) aEl.textContent = `${area.toFixed(1)} m²`;
    if (fEl) fEl.textContent = `Volume = ${len}m × ${wid}m × ${(thickCm/100).toFixed(2)}m = ${volM3.toFixed(2)} m³ (Add 10% waste buffer: ${(volM3 * 1.1).toFixed(2)} m³).`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'concrete',
        calcName: 'Concrete Slab',
        expression: `${len}m × ${wid}m × ${thickCm}cm`,
        result: `${volM3.toFixed(2)} m³ (${bags} bags)`
      });
    }
  }
};
