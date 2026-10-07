/**
 * CALQIO Physics & Chemistry Tools: Kinematics / Force, Molarity & Dilution
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

// 1. Physics: Velocity & Kinematics
export const KinematicsCalculator = {
  id: 'kinematics',
  name: 'Kinematics & Velocity',
  category: 'physics',
  icon: 'physics',
  description: 'Calculate Final Velocity (v), Displacement (s), and Kinetic Energy from initial velocity, acceleration, and time.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">🚀</div>
          <div>
            <h1 class="workspace-heading">Kinematics & Motion Calculator</h1>
            <p class="workspace-description">Solve linear motion equations (v = u + at, s = ut + ½at²).</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="kin-fav-btn" class="icon-btn ${Storage.isFavorite('kinematics') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('kinematics') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="kin-u">Initial Velocity (u in m/s)</label>
            <input type="number" id="kin-u" class="input-field" value="0" step="any">
          </div>

          <div class="form-group">
            <label class="form-label" for="kin-a">Acceleration (a in m/s²)</label>
            <input type="number" id="kin-a" class="input-field" value="9.8" step="any">
          </div>

          <div class="form-group">
            <label class="form-label" for="kin-t">Time (t in seconds)</label>
            <input type="number" id="kin-t" class="input-field" value="5" min="0" step="any">
          </div>

          <div class="calc-action-buttons">
            <button id="kin-calc-btn" class="btn btn-primary" style="flex:1;">Compute Motion</button>
            <button id="kin-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Final Velocity (v)</span>
            <button id="kin-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="kin-v-val" style="color:var(--accent-primary);">49.00 m/s</div>
            <div class="result-sub-value" id="kin-kmh-sub">176.4 km/h (Kilometers per hour)</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Displacement (s)</div>
              <div class="breakdown-item-value" id="kin-s-val">122.50 m</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Average Speed</div>
              <div class="breakdown-item-value" id="kin-avg-val">24.50 m/s</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formulas</div>
            <div id="kin-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              v = u + at = 0 + (9.8 × 5) = 49 m/s<br>
              s = ut + ½at² = 0 + ½(9.8)(25) = 122.5 m
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

    container.querySelector('#kin-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Kinematics computed');
    });

    container.querySelector('#kin-reset-btn').addEventListener('click', () => {
      container.querySelector('#kin-u').value = 0;
      container.querySelector('#kin-a').value = 9.8;
      container.querySelector('#kin-t').value = 5;
      this.calculate();
    });

    container.querySelector('#kin-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#kin-v-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#kin-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('kinematics');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const u = parseFloat(document.getElementById('kin-u')?.value) || 0;
    const a = parseFloat(document.getElementById('kin-a')?.value) || 0;
    const t = parseFloat(document.getElementById('kin-t')?.value) || 0;

    const v = u + (a * t);
    const s = (u * t) + (0.5 * a * t * t);
    const kmh = v * 3.6;
    const avgSpeed = t > 0 ? s / t : 0;

    const vEl = document.getElementById('kin-v-val');
    const kmhEl = document.getElementById('kin-kmh-sub');
    const sEl = document.getElementById('kin-s-val');
    const avgEl = document.getElementById('kin-avg-val');
    const fEl = document.getElementById('kin-formula-text');

    if (vEl) vEl.textContent = `${v.toFixed(2)} m/s`;
    if (kmhEl) kmhEl.textContent = `${kmh.toFixed(1)} km/h (${(v * 2.23694).toFixed(1)} mph)`;
    if (sEl) sEl.textContent = `${s.toFixed(2)} m`;
    if (avgEl) avgEl.textContent = `${avgSpeed.toFixed(2)} m/s`;
    if (fEl) fEl.innerHTML = `v = u + at = ${u} + (${a} × ${t}) = ${v.toFixed(2)} m/s<br>s = ut + ½at² = (${u}×${t}) + ½(${a})(${t}²) = ${s.toFixed(2)} m`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'kinematics',
        calcName: 'Kinematics',
        expression: `u=${u}, a=${a}, t=${t}s`,
        result: `v = ${v.toFixed(2)} m/s, s = ${s.toFixed(2)} m`
      });
    }
  }
};

// 2. Chemistry: Molarity & Solution Dilution Calculator
export const MolarityCalculator = {
  id: 'molarity',
  name: 'Molarity & Dilution',
  category: 'chemistry',
  icon: 'chemistry',
  description: 'Calculate solution molarity (mol/L) and perform laboratory dilution calculations (M1V1 = M2V2).',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">🧪</div>
          <div>
            <h1 class="workspace-heading">Molarity & Dilution Calculator</h1>
            <p class="workspace-description">Compute solution concentration and solvent volumes for chemical preparations.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="mol-fav-btn" class="icon-btn ${Storage.isFavorite('molarity') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('molarity') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="mol-m1">Initial Concentration (M₁ in Molar)</label>
            <input type="number" id="mol-m1" class="input-field" value="2.5" step="0.1" min="0.001">
          </div>

          <div class="form-group">
            <label class="form-label" for="mol-m2">Target Concentration (M₂ in Molar)</label>
            <input type="number" id="mol-m2" class="input-field" value="0.5" step="0.1" min="0.001">
          </div>

          <div class="form-group">
            <label class="form-label" for="mol-v2">Final Volume Desired (V₂ in mL)</label>
            <input type="number" id="mol-v2" class="input-field" value="500" step="10" min="1">
          </div>

          <div class="calc-action-buttons">
            <button id="mol-calc-btn" class="btn btn-primary" style="flex:1;">Calculate Dilution</button>
            <button id="mol-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Stock Volume Needed (V₁)</span>
            <button id="mol-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="mol-v1-val" style="color:var(--accent-primary);">100.0 mL</div>
            <div class="result-sub-value" id="mol-solvent-sub">Add 400.0 mL of Solvent / Water</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Dilution Factor</div>
              <div class="breakdown-item-value" id="mol-df-val">5.0x</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Solvent Volume</div>
              <div class="breakdown-item-value" id="mol-solvent-val">400.0 mL</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Law of Dilution</div>
            <div id="mol-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              V₁ = (M₂ × V₂) ÷ M₁ = (0.5M × 500 mL) ÷ 2.5M = 100 mL
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

    container.querySelector('#mol-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Dilution computed & saved');
    });

    container.querySelector('#mol-reset-btn').addEventListener('click', () => {
      container.querySelector('#mol-m1').value = 2.5;
      container.querySelector('#mol-m2').value = 0.5;
      container.querySelector('#mol-v2').value = 500;
      this.calculate();
    });

    container.querySelector('#mol-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#mol-v1-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#mol-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('molarity');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const m1 = parseFloat(document.getElementById('mol-m1')?.value) || 0;
    const m2 = parseFloat(document.getElementById('mol-m2')?.value) || 0;
    const v2 = parseFloat(document.getElementById('mol-v2')?.value) || 0;

    if (m1 === 0 || m2 > m1) return;

    const v1 = (m2 * v2) / m1;
    const solvent = v2 - v1;
    const df = m1 / m2;

    const v1El = document.getElementById('mol-v1-val');
    const sSubEl = document.getElementById('mol-solvent-sub');
    const dfEl = document.getElementById('mol-df-val');
    const sValEl = document.getElementById('mol-solvent-val');
    const fEl = document.getElementById('mol-formula-text');

    if (v1El) v1El.textContent = `${v1.toFixed(1)} mL`;
    if (sSubEl) sSubEl.textContent = `Add ${solvent.toFixed(1)} mL of Solvent to reach ${v2} mL`;
    if (dfEl) dfEl.textContent = `${df.toFixed(1)}x`;
    if (sValEl) sValEl.textContent = `${solvent.toFixed(1)} mL`;
    if (fEl) fEl.innerHTML = `V₁ = (M₂ × V₂) ÷ M₁ = (${m2}M × ${v2} mL) ÷ ${m1}M = ${v1.toFixed(1)} mL`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'molarity',
        calcName: 'Molarity & Dilution',
        expression: `M₁=${m1}M → M₂=${m2}M (${v2}mL)`,
        result: `V₁ = ${v1.toFixed(1)} mL (+ ${solvent.toFixed(1)} mL solvent)`
      });
    }
  }
};
