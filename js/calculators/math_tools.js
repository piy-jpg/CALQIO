/**
 * CALQIO Math Tools: Fraction, Ratio, Average, GCD/LCM
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

// --- Helper Functions ---
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// 1. Fraction Calculator
export const FractionCalculator = {
  id: 'fraction',
  name: 'Fraction Calculator',
  category: 'math',
  icon: 'math',
  description: 'Add, subtract, multiply, and divide fractions with step-by-step reduction to simplest form.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
            ${getIcon('math')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Fraction Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.3);">Arithmetic</span>
            </div>
            <p class="workspace-description">Perform operations on proper, improper, and mixed fractions with automatic simplification.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="frac-fav-btn" class="icon-btn ${Storage.isFavorite('fraction') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('fraction') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div style="display:flex; align-items:center; gap: 0.75rem; justify-content: space-around; padding: 1rem 0;">
            <!-- Fraction 1 -->
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Numerator 1</span>
              <input type="number" id="f1-num" class="input-field" value="3" style="text-align:center; width:90px; font-weight:700; font-size:1.1rem;">
              <div style="width:100%; height:3px; background:var(--accent-primary); border-radius:2px;"></div>
              <input type="number" id="f1-den" class="input-field" value="4" style="text-align:center; width:90px; font-weight:700; font-size:1.1rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Denominator 1</span>
            </div>

            <!-- Operator Select -->
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Op</span>
              <select id="frac-op" class="input-field select-field" style="width:75px; font-size:1.35rem; font-weight:800; text-align:center; height:48px;">
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
            </div>

            <!-- Fraction 2 -->
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Numerator 2</span>
              <input type="number" id="f2-num" class="input-field" value="2" style="text-align:center; width:90px; font-weight:700; font-size:1.1rem;">
              <div style="width:100%; height:3px; background:var(--accent-primary); border-radius:2px;"></div>
              <input type="number" id="f2-den" class="input-field" value="5" style="text-align:center; width:90px; font-weight:700; font-size:1.1rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Denominator 2</span>
            </div>
          </div>

          <div class="calc-action-buttons" style="margin-top:1rem;">
            <button id="frac-calc-btn" class="btn btn-primary" style="flex:1;">Calculate & Simplify</button>
            <button id="frac-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Simplified Fraction Result</span>
            <button id="frac-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="frac-res-main">23 / 20</div>
            <div class="result-sub-value" id="frac-res-sub">Mixed: 1 3/20 | Decimal: 1.15</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Decimal Value</div>
              <div class="breakdown-item-value" id="frac-dec-val">1.15</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Mixed Number</div>
              <div class="breakdown-item-value" id="frac-mixed-val">1 ³/₂₀</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Simplification Steps</div>
            <div id="frac-steps-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              Common denominator: 20. (3×5 + 2×4) / 20 = 23 / 20.
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const inputs = container.querySelectorAll('.input-field, select');
    inputs.forEach(i => {
      i.addEventListener('input', () => this.calculate());
      i.addEventListener('change', () => this.calculate());
    });

    container.querySelector('#frac-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Fraction computed & saved');
    });

    container.querySelector('#frac-reset-btn').addEventListener('click', () => {
      container.querySelector('#f1-num').value = 3;
      container.querySelector('#f1-den').value = 4;
      container.querySelector('#f2-num').value = 2;
      container.querySelector('#f2-den').value = 5;
      this.calculate();
    });

    container.querySelector('#frac-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#frac-res-main').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#frac-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('fraction');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const n1 = parseInt(document.getElementById('f1-num')?.value, 10) || 0;
    const d1 = parseInt(document.getElementById('f1-den')?.value, 10) || 1;
    const n2 = parseInt(document.getElementById('f2-num')?.value, 10) || 0;
    const d2 = parseInt(document.getElementById('f2-den')?.value, 10) || 1;
    const op = document.getElementById('frac-op')?.value || '+';

    if (d1 === 0 || d2 === 0) return;

    let resNum = 0, resDen = 1;
    if (op === '+') {
      resNum = (n1 * d2) + (n2 * d1);
      resDen = d1 * d2;
    } else if (op === '-') {
      resNum = (n1 * d2) - (n2 * d1);
      resDen = d1 * d2;
    } else if (op === '*') {
      resNum = n1 * n2;
      resDen = d1 * d2;
    } else if (op === '/') {
      resNum = n1 * d2;
      resDen = d1 * n2;
    }

    if (resDen < 0) { resNum = -resNum; resDen = -resDen; }
    const divisor = gcd(resNum, resDen);
    const simpNum = resNum / divisor;
    const simpDen = resDen / divisor;

    const decimalVal = parseFloat((simpNum / simpDen).toFixed(6));
    let mixedText = 'None';
    if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
      const whole = Math.trunc(simpNum / simpDen);
      const rem = Math.abs(simpNum % simpDen);
      mixedText = `${whole} ${rem}/${simpDen}`;
    }

    const mainEl = document.getElementById('frac-res-main');
    const subEl = document.getElementById('frac-res-sub');
    const decEl = document.getElementById('frac-dec-val');
    const mixEl = document.getElementById('frac-mixed-val');
    const stepsEl = document.getElementById('frac-steps-text');

    if (mainEl) mainEl.textContent = `${simpNum} / ${simpDen}`;
    if (subEl) subEl.textContent = `Decimal: ${decimalVal} | Mixed: ${mixedText}`;
    if (decEl) decEl.textContent = `${decimalVal}`;
    if (mixEl) mixEl.textContent = mixedText;
    if (stepsEl) stepsEl.textContent = `${n1}/${d1} ${op} ${n2}/${d2} = ${resNum}/${resDen} = ${simpNum}/${simpDen} (Reduced by GCD ${divisor})`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'fraction',
        calcName: 'Fraction Calculator',
        expression: `${n1}/${d1} ${op} ${n2}/${d2}`,
        result: `${simpNum}/${simpDen} (${decimalVal})`
      });
    }
  }
};

// 2. Ratio & Proportion Calculator
export const RatioCalculator = {
  id: 'ratio',
  name: 'Ratio & Proportion',
  category: 'math',
  icon: 'math',
  description: 'Solve proportions A : B = C : D, scale ratios up or down, and divide quantities proportionally.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
            ${getIcon('math')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Ratio & Proportion Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.3);">Proportions</span>
            </div>
            <p class="workspace-description">Solve for unknown variable X in A : B = C : X, scale dimensions, and split values.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="ratio-fav-btn" class="icon-btn ${Storage.isFavorite('ratio') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('ratio') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label">Proportion Formula (A : B = C : D)</label>
            <div style="display:grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; gap:0.5rem; align-items:center;">
              <input type="number" id="r-a" class="input-field" value="4" style="text-align:center;">
              <span style="font-weight:700;">:</span>
              <input type="number" id="r-b" class="input-field" value="3" style="text-align:center;">
              <span style="font-weight:700;">=</span>
              <input type="number" id="r-c" class="input-field" value="1920" style="text-align:center;">
              <span style="font-weight:700;">:</span>
              <input type="text" id="r-d" class="input-field" value="X (Find)" readonly style="text-align:center; background:var(--accent-primary-light); color:var(--accent-primary); font-weight:700;">
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="ratio-calc-btn" class="btn btn-primary" style="flex:1;">Solve Proportion</button>
            <button id="ratio-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Calculated Missing Value (D)</span>
            <button id="ratio-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="ratio-res-val">1,440</div>
            <div class="result-sub-value" id="ratio-res-sub">4 : 3 = 1920 : 1440</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Scaling Factor</div>
              <div class="breakdown-item-value" id="ratio-scale-val">480x</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Ratio in Decimal</div>
              <div class="breakdown-item-value" id="ratio-dec-val">1.3333</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Cross-Multiplication</div>
            <div id="ratio-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              D = (B × C) ÷ A = (3 × 1920) ÷ 4 = 1440
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

    container.querySelector('#ratio-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Proportion solved & saved');
    });

    container.querySelector('#ratio-reset-btn').addEventListener('click', () => {
      container.querySelector('#r-a').value = 4;
      container.querySelector('#r-b').value = 3;
      container.querySelector('#r-c').value = 1920;
      this.calculate();
    });

    container.querySelector('#ratio-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#ratio-res-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#ratio-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('ratio');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const a = parseFloat(document.getElementById('r-a')?.value) || 0;
    const b = parseFloat(document.getElementById('r-b')?.value) || 0;
    const c = parseFloat(document.getElementById('r-c')?.value) || 0;

    if (a === 0) return;

    const d = (b * c) / a;
    const scale = c / a;
    const dec = a / b;

    const formatNum = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US');

    const resVal = document.getElementById('ratio-res-val');
    const resSub = document.getElementById('ratio-res-sub');
    const scaleEl = document.getElementById('ratio-scale-val');
    const decEl = document.getElementById('ratio-dec-val');
    const fEl = document.getElementById('ratio-formula-text');

    if (resVal) resVal.textContent = formatNum(d);
    if (resSub) resSub.textContent = `${a} : ${b} = ${c} : ${formatNum(d)}`;
    if (scaleEl) scaleEl.textContent = `${formatNum(scale)}x`;
    if (decEl) decEl.textContent = `${formatNum(dec)}`;
    if (fEl) fEl.textContent = `D = (B × C) ÷ A = (${b} × ${c}) ÷ ${a} = ${formatNum(d)}`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'ratio',
        calcName: 'Ratio Calculator',
        expression: `${a}:${b} = ${c}:X`,
        result: `X = ${formatNum(d)}`
      });
    }
  }
};

// 3. Greatest Common Divisor (GCD) & LCM Calculator
export const GcdLcmCalculator = {
  id: 'gcd_lcm',
  name: 'GCD & LCM Calculator',
  category: 'math',
  icon: 'math',
  description: 'Find Greatest Common Divisor (GCD / HCF) and Least Common Multiple (LCM) of numbers.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
            ${getIcon('math')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">GCD & LCM Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.3);">Number Theory</span>
            </div>
            <p class="workspace-description">Compute greatest common factor, least common multiple, and prime factorizations.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="gcd-fav-btn" class="icon-btn ${Storage.isFavorite('gcd_lcm') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('gcd_lcm') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="gcd-num1">First Integer (A)</label>
            <input type="number" id="gcd-num1" class="input-field" value="48" step="1">
          </div>
          <div class="form-group">
            <label class="form-label" for="gcd-num2">Second Integer (B)</label>
            <input type="number" id="gcd-num2" class="input-field" value="72" step="1">
          </div>

          <div class="calc-action-buttons">
            <button id="gcd-calc-btn" class="btn btn-primary" style="flex:1;">Compute Factors</button>
            <button id="gcd-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Greatest Common Divisor (GCD)</span>
            <button id="gcd-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="gcd-res-val">24</div>
            <div class="result-sub-value" id="lcm-res-sub">Least Common Multiple (LCM): 144</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">GCD / HCF</div>
              <div class="breakdown-item-value" id="gcd-val-item">24</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">LCM</div>
              <div class="breakdown-item-value" id="lcm-val-item" style="color:var(--accent-primary);">144</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Prime Factorization</div>
            <div id="gcd-factors-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              48 = 2⁴ × 3 | 72 = 2³ × 3²
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

    container.querySelector('#gcd-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('GCD & LCM computed');
    });

    container.querySelector('#gcd-reset-btn').addEventListener('click', () => {
      container.querySelector('#gcd-num1').value = 48;
      container.querySelector('#gcd-num2').value = 72;
      this.calculate();
    });

    container.querySelector('#gcd-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#gcd-res-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied GCD: ${val}`));
    });

    const favBtn = container.querySelector('#gcd-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('gcd_lcm');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const a = parseInt(document.getElementById('gcd-num1')?.value, 10) || 0;
    const b = parseInt(document.getElementById('gcd-num2')?.value, 10) || 0;

    const g = gcd(a, b);
    const l = lcm(a, b);

    const gValEl = document.getElementById('gcd-res-val');
    const lSubEl = document.getElementById('lcm-res-sub');
    const gItemEl = document.getElementById('gcd-val-item');
    const lItemEl = document.getElementById('lcm-val-item');
    const fTextEl = document.getElementById('gcd-factors-text');

    if (gValEl) gValEl.textContent = `${g}`;
    if (lSubEl) lSubEl.textContent = `Least Common Multiple (LCM): ${l.toLocaleString('en-US')}`;
    if (gItemEl) gItemEl.textContent = `${g}`;
    if (lItemEl) lItemEl.textContent = `${l.toLocaleString('en-US')}`;
    if (fTextEl) fTextEl.textContent = `GCD(${a}, ${b}) = ${g} | LCM(${a}, ${b}) = ${l} | Relation: A × B = GCD × LCM (${a * b} = ${g * l})`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'gcd_lcm',
        calcName: 'GCD & LCM',
        expression: `GCD/LCM of ${a} & ${b}`,
        result: `GCD: ${g}, LCM: ${l}`
      });
    }
  }
};
