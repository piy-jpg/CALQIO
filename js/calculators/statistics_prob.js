/**
 * CALQIO Statistics & Probability Tools: Standard Deviation, Permutations & Combinations
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

function factorial(n) {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// 1. Standard Deviation & Statistics
export const StatisticsCalculator = {
  id: 'statistics',
  name: 'Standard Deviation & Stats',
  category: 'statistics',
  icon: 'statistics',
  description: 'Calculate Mean, Median, Mode, Sample & Population Standard Deviation, Variance, and Range.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">📈</div>
          <div>
            <h1 class="workspace-heading">Standard Deviation & Stats</h1>
            <p class="workspace-description">Enter comma-separated values to compute summary statistics, variance, and spread.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="stat-fav-btn" class="icon-btn ${Storage.isFavorite('statistics') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('statistics') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="stat-data">Data Set (Comma / Space Separated Numbers)</label>
            <textarea id="stat-data" class="input-field" rows="4" style="resize:vertical;">12, 15, 18, 22, 25, 28, 30, 35, 42</textarea>
          </div>

          <div class="calc-action-buttons">
            <button id="stat-calc-btn" class="btn btn-primary" style="flex:1;">Compute Statistics</button>
            <button id="stat-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Sample Standard Deviation (s)</span>
            <button id="stat-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="stat-sd-val" style="color:var(--accent-primary);">9.89</div>
            <div class="result-sub-value" id="stat-mean-sub">Mean (Average): 25.22 | Count (n): 9</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Variance (s²)</div>
              <div class="breakdown-item-value" id="stat-var-val">97.94</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Median</div>
              <div class="breakdown-item-value" id="stat-med-val">25.00</div>
            </div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Range (Max - Min)</div>
              <div class="breakdown-item-value" id="stat-range-val">30 (12 to 42)</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Pop. Std Dev (σ)</div>
              <div class="breakdown-item-value" id="stat-pop-val">9.33</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const input = container.querySelector('#stat-data');
    input.addEventListener('input', () => this.calculate());

    container.querySelector('#stat-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Statistics computed');
    });

    container.querySelector('#stat-reset-btn').addEventListener('click', () => {
      input.value = '12, 15, 18, 22, 25, 28, 30, 35, 42';
      this.calculate();
    });

    container.querySelector('#stat-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#stat-sd-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied Std Dev: ${val}`));
    });

    const favBtn = container.querySelector('#stat-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('statistics');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const raw = document.getElementById('stat-data')?.value || '';
    const nums = raw.split(/[\s,]+/).map(v => parseFloat(v)).filter(v => !isNaN(v) && isFinite(v));

    if (nums.length < 2) return;

    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Variance
    const sumSqDiff = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
    const sampleVar = sumSqDiff / (n - 1);
    const sampleSd = Math.sqrt(sampleVar);
    const popVar = sumSqDiff / n;
    const popSd = Math.sqrt(popVar);

    // Median
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    const sdEl = document.getElementById('stat-sd-val');
    const mSubEl = document.getElementById('stat-mean-sub');
    const varEl = document.getElementById('stat-var-val');
    const medEl = document.getElementById('stat-med-val');
    const rngEl = document.getElementById('stat-range-val');
    const popEl = document.getElementById('stat-pop-val');

    if (sdEl) sdEl.textContent = sampleSd.toFixed(3);
    if (mSubEl) mSubEl.textContent = `Mean: ${mean.toFixed(2)} | Count (n): ${n} | Sum: ${sum.toFixed(1)}`;
    if (varEl) varEl.textContent = sampleVar.toFixed(3);
    if (medEl) medEl.textContent = median.toFixed(2);
    if (rngEl) rngEl.textContent = `${range.toFixed(2)} (${min} to ${max})`;
    if (popEl) popEl.textContent = popSd.toFixed(3);

    if (logHistory) {
      Storage.addHistory({
        calcId: 'statistics',
        calcName: 'Standard Deviation',
        expression: `n=${n} items, Mean ${mean.toFixed(2)}`,
        result: `s = ${sampleSd.toFixed(3)}, s² = ${sampleVar.toFixed(2)}`
      });
    }
  }
};

// 2. Permutations & Combinations (Probability)
export const PermutationCombinationCalculator = {
  id: 'perm_comb',
  name: 'Permutations & Combinations',
  category: 'probability',
  icon: 'probability',
  description: 'Calculate ordered arrangements nPr and unordered selections nCr with step formulas.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">🎲</div>
          <div>
            <h1 class="workspace-heading">Permutations & Combinations</h1>
            <p class="workspace-description">Compute nPr (order matters) and nCr (order does not matter).</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="pc-fav-btn" class="icon-btn ${Storage.isFavorite('perm_comb') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('perm_comb') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="pc-n">Total Number of Items (n)</label>
            <input type="number" id="pc-n" class="input-field" value="10" min="1" max="100" step="1">
          </div>

          <div class="form-group">
            <label class="form-label" for="pc-r">Number of Selected Items (r)</label>
            <input type="number" id="pc-r" class="input-field" value="3" min="0" max="100" step="1">
          </div>

          <div class="calc-action-buttons">
            <button id="pc-calc-btn" class="btn btn-primary" style="flex:1;">Compute Combinatorics</button>
            <button id="pc-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Combinations (nCr)</span>
            <button id="pc-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="pc-ncr-val" style="color:var(--accent-primary);">120</div>
            <div class="result-sub-value" id="pc-npr-sub">Permutations (nPr): 720</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Combinations nCr</div>
              <div class="breakdown-item-value" id="pc-ncr-item">120 ways</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Permutations nPr</div>
              <div class="breakdown-item-value" id="pc-npr-item" style="color:#8b5cf6;">720 ways</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formulas</div>
            <div id="pc-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              nCr = n! ÷ (r! × (n − r)!) = 10! ÷ (3! × 7!) = 120<br>
              nPr = n! ÷ (n − r)! = 10! ÷ 7! = 720
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

    container.querySelector('#pc-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Combinatorics computed');
    });

    container.querySelector('#pc-reset-btn').addEventListener('click', () => {
      container.querySelector('#pc-n').value = 10;
      container.querySelector('#pc-r').value = 3;
      this.calculate();
    });

    container.querySelector('#pc-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#pc-ncr-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#pc-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('perm_comb');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const n = parseInt(document.getElementById('pc-n')?.value, 10) || 0;
    const r = parseInt(document.getElementById('pc-r')?.value, 10) || 0;

    if (r > n || n < 0 || r < 0) return;

    // Compute nPr and nCr using loops to avoid integer overflow
    let nPr = 1;
    for (let i = 0; i < r; i++) {
      nPr *= (n - i);
    }
    const nCr = nPr / factorial(r);

    const cValEl = document.getElementById('pc-ncr-val');
    const pSubEl = document.getElementById('pc-npr-sub');
    const cItemEl = document.getElementById('pc-ncr-item');
    const pItemEl = document.getElementById('pc-npr-item');
    const fTextEl = document.getElementById('pc-formula-text');

    if (cValEl) cValEl.textContent = nCr.toLocaleString('en-US');
    if (pSubEl) pSubEl.textContent = `Permutations (nPr): ${nPr.toLocaleString('en-US')}`;
    if (cItemEl) cItemEl.textContent = `${nCr.toLocaleString('en-US')} combinations`;
    if (pItemEl) pItemEl.textContent = `${nPr.toLocaleString('en-US')} permutations`;
    if (fTextEl) fTextEl.innerHTML = `nCr = ${n}! ÷ (${r}! × (${n} − ${r})!) = ${nCr.toLocaleString('en-US')}<br>nPr = ${n}! ÷ (${n} − ${r})! = ${nPr.toLocaleString('en-US')}`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'perm_comb',
        calcName: 'Combinatorics',
        expression: `n=${n}, r=${r}`,
        result: `nCr: ${nCr.toLocaleString('en-US')}, nPr: ${nPr.toLocaleString('en-US')}`
      });
    }
  }
};
