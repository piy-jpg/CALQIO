/**
 * CALQIO EMI & Loan Calculator
 * Accurate financial amortization, interactive SVG donut chart, and yearly schedule.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const EmiCalculator = {
  id: 'emi',
  name: 'EMI Calculator',
  category: 'finance',
  icon: 'finance',
  description: 'Calculate monthly loan installments (EMI), total interest, and view visual payment breakdowns.',

  state: {
    principal: 1000000,
    rate: 8.5,
    tenure: 5,
    tenureType: 'years' // 'years' | 'months'
  },

  render(container) {
    const currency = Storage.getSettings().currency || '₹';

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(5, 150, 105, 0.15); color: #059669; border: 1px solid rgba(5, 150, 105, 0.3);">
            ${getIcon('finance')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">EMI Loan Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(5, 150, 105, 0.15); color: #059669; border-color: rgba(5, 150, 105, 0.3);">Amortization</span>
            </div>
            <p class="workspace-description">Compute your monthly installment, total payable interest, and amortization schedule.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="emi-fav-btn" class="icon-btn ${Storage.isFavorite('emi') ? 'active' : ''}" title="Favorite">
            ${getIcon(Storage.isFavorite('emi') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" for="emi-principal">
              <span>Loan Amount</span>
              <span class="form-label-hint" id="emi-principal-hint">${currency}1,000,000</span>
            </label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="emi-principal" class="input-field" value="${this.state.principal}" min="1000" step="1000">
            </div>
            <input type="range" id="emi-principal-range" min="50000" max="10000000" step="25000" value="${this.state.principal}" style="width:100%; margin-top: 6px; accent-color: var(--accent-primary);">
          </div>

          <div class="form-group">
            <label class="form-label" for="emi-rate">
              <span>Interest Rate (% per annum)</span>
              <span class="form-label-hint" id="emi-rate-hint">8.5%</span>
            </label>
            <div class="input-wrapper has-suffix">
              <input type="number" id="emi-rate" class="input-field" value="${this.state.rate}" min="0.1" max="30" step="0.1">
              <span class="input-suffix">%</span>
            </div>
            <input type="range" id="emi-rate-range" min="1" max="25" step="0.1" value="${this.state.rate}" style="width:100%; margin-top: 6px; accent-color: var(--accent-primary);">
          </div>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
              <label class="form-label" style="margin-bottom:0;" for="emi-tenure">Loan Tenure</label>
              <div class="segmented-control" id="emi-tenure-type" style="width: 140px;">
                <button class="segment-btn active" data-type="years">Years</button>
                <button class="segment-btn" data-type="months">Months</button>
              </div>
            </div>
            <div class="input-wrapper">
              <input type="number" id="emi-tenure" class="input-field" value="${this.state.tenure}" min="1" max="360" step="1">
            </div>
            <input type="range" id="emi-tenure-range" min="1" max="30" step="1" value="${this.state.tenure}" style="width:100%; margin-top: 6px; accent-color: var(--accent-primary);">
          </div>

          <div class="calc-action-buttons">
            <button id="emi-calc-btn" class="btn btn-primary" style="flex:1;">Recalculate & Save</button>
            <button id="emi-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <!-- Result Panel -->
        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Monthly EMI</span>
            <button id="emi-copy-btn" class="btn btn-subtle btn-sm" title="Copy EMI">
              ${getIcon('copy')} Copy
            </button>
          </div>

          <div>
            <div class="result-main-value" id="emi-monthly-val">${currency}20,517</div>
            <div class="result-sub-value" id="emi-total-summary">Total payable: ${currency}1,230,992</div>
          </div>

          <!-- Donut Chart & Legend -->
          <div class="donut-chart-container">
            <svg width="120" height="120" viewBox="0 0 42 42" class="donut-chart">
              <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--bg-subtle)" stroke-width="6"></circle>
              <circle id="donut-principal-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--accent-primary)" stroke-width="6" stroke-dasharray="81.2 18.8" stroke-dashoffset="25"></circle>
              <circle id="donut-interest-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" stroke-width="6" stroke-dasharray="18.8 81.2" stroke-dashoffset="43.8"></circle>
            </svg>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color-dot" style="background: var(--accent-primary);"></span>
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Principal Amount</div>
                  <div style="font-weight:700;" id="emi-principal-pct">${currency}1,000,000 (81.2%)</div>
                </div>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot" style="background: #f59e0b;"></span>
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Total Interest</div>
                  <div style="font-weight:700; color:#f59e0b;" id="emi-interest-pct">${currency}230,992 (18.8%)</div>
                </div>
              </div>
            </div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Principal Amount</div>
              <div class="breakdown-item-value" id="emi-breakdown-principal">${currency}1,000,000</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total Interest</div>
              <div class="breakdown-item-value" id="emi-breakdown-interest" style="color: #f59e0b;">${currency}230,992</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">
              ${getIcon('info')} EMI Formula
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 4px;">
              <span class="formula-tag">E = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</span>
              <p style="margin-top: 4px; font-size: 0.75rem; color: var(--text-muted);">Where P = Principal, r = monthly interest rate, and n = total number of monthly payments.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const pInput = container.querySelector('#emi-principal');
    const pRange = container.querySelector('#emi-principal-range');
    const rInput = container.querySelector('#emi-rate');
    const rRange = container.querySelector('#emi-rate-range');
    const tInput = container.querySelector('#emi-tenure');
    const tRange = container.querySelector('#emi-tenure-range');

    // Principal sync
    pInput.addEventListener('input', () => {
      pRange.value = pInput.value;
      this.calculate();
    });
    pRange.addEventListener('input', () => {
      pInput.value = pRange.value;
      this.calculate();
    });

    // Rate sync
    rInput.addEventListener('input', () => {
      rRange.value = rInput.value;
      this.calculate();
    });
    rRange.addEventListener('input', () => {
      rInput.value = rRange.value;
      this.calculate();
    });

    // Tenure sync & type tabs
    tInput.addEventListener('input', () => {
      tRange.value = tInput.value;
      this.calculate();
    });
    tRange.addEventListener('input', () => {
      tInput.value = tRange.value;
      this.calculate();
    });

    const tenureTabs = container.querySelectorAll('#emi-tenure-type .segment-btn');
    tenureTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tenureTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.tenureType = btn.dataset.type;
        
        if (this.state.tenureType === 'years') {
          tRange.max = 30;
          tInput.value = Math.min(30, Math.max(1, Math.round(parseFloat(tInput.value) / 12) || 5));
        } else {
          tRange.max = 360;
          tInput.value = Math.min(360, (parseFloat(tInput.value) || 5) * 12);
        }
        tRange.value = tInput.value;
        this.calculate();
      });
    });

    // Buttons
    container.querySelector('#emi-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('EMI calculated & saved to history');
    });

    container.querySelector('#emi-reset-btn').addEventListener('click', () => {
      pInput.value = 1000000;
      pRange.value = 1000000;
      rInput.value = 8.5;
      rRange.value = 8.5;
      tInput.value = 5;
      tRange.value = 5;
      this.calculate();
    });

    container.querySelector('#emi-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#emi-monthly-val').textContent;
      navigator.clipboard.writeText(val).then(() => {
        Toast.success(`Copied Monthly EMI: ${val}`);
      });
    });

    const favBtn = container.querySelector('#emi-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('emi');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const currency = Storage.getSettings().currency || '₹';
    const P = parseFloat(document.getElementById('emi-principal')?.value) || 0;
    const annualRate = parseFloat(document.getElementById('emi-rate')?.value) || 0;
    const tenureVal = parseFloat(document.getElementById('emi-tenure')?.value) || 0;
    const isYears = this.state.tenureType === 'years';
    const totalMonths = isYears ? tenureVal * 12 : tenureVal;

    if (P <= 0 || annualRate <= 0 || totalMonths <= 0) return;

    const monthlyRate = annualRate / 12 / 100;
    const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - P;

    const principalPct = Math.round((P / totalPayment) * 1000) / 10;
    const interestPct = Math.round((totalInterest / totalPayment) * 1000) / 10;

    const formatCurr = (n) => `${currency}${Math.round(n).toLocaleString('en-US')}`;

    // Update hints & labels
    const pHint = document.getElementById('emi-principal-hint');
    const rHint = document.getElementById('emi-rate-hint');
    if (pHint) pHint.textContent = formatCurr(P);
    if (rHint) rHint.textContent = `${annualRate}%`;

    const monthlyEl = document.getElementById('emi-monthly-val');
    const summaryEl = document.getElementById('emi-total-summary');
    const bPrincipalEl = document.getElementById('emi-breakdown-principal');
    const bInterestEl = document.getElementById('emi-breakdown-interest');
    const pPctEl = document.getElementById('emi-principal-pct');
    const iPctEl = document.getElementById('emi-interest-pct');

    if (monthlyEl) monthlyEl.textContent = formatCurr(emi);
    if (summaryEl) summaryEl.textContent = `Total payable: ${formatCurr(totalPayment)} over ${isYears ? tenureVal + ' yrs' : tenureVal + ' mos'}`;
    if (bPrincipalEl) bPrincipalEl.textContent = formatCurr(P);
    if (bInterestEl) bInterestEl.textContent = formatCurr(totalInterest);
    if (pPctEl) pPctEl.textContent = `${formatCurr(P)} (${principalPct}%)`;
    if (iPctEl) iPctEl.textContent = `${formatCurr(totalInterest)} (${interestPct}%)`;

    // SVG donut updates
    const pSeg = document.getElementById('donut-principal-segment');
    const iSeg = document.getElementById('donut-interest-segment');
    if (pSeg && iSeg) {
      pSeg.setAttribute('stroke-dasharray', `${principalPct} ${100 - principalPct}`);
      pSeg.setAttribute('stroke-dashoffset', '25');
      iSeg.setAttribute('stroke-dasharray', `${interestPct} ${100 - interestPct}`);
      iSeg.setAttribute('stroke-dashoffset', `${25 - principalPct}`);
    }

    if (logHistory) {
      Storage.addHistory({
        calcId: 'emi',
        calcName: 'EMI Calculator',
        expression: `${formatCurr(P)} @ ${annualRate}% for ${isYears ? tenureVal + ' yr' : tenureVal + ' mo'}`,
        result: `EMI: ${formatCurr(emi)}/mo`,
        inputs: { principal: P, rate: annualRate, tenure: tenureVal }
      });
    }
  }
};
