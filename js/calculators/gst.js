/**
 * CALQIO GST (Goods and Services Tax) Calculator
 * Supports Add GST (Exclusive) and Remove GST (Inclusive) with CGST/SGST/IGST tax splits.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const GstCalculator = {
  id: 'gst',
  name: 'GST Calculator',
  category: 'finance',
  icon: 'tax',
  description: 'Calculate Goods and Services Tax (GST), Add/Remove tax, and view CGST/SGST tax split.',

  state: {
    mode: 'add', // 'add' (exclusive) | 'remove' (inclusive)
    amount: 10000,
    rate: 18,
    taxType: 'intra' // 'intra' (CGST+SGST) | 'inter' (IGST)
  },

  render(container) {
    const currency = Storage.getSettings().currency || '₹';

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(5, 150, 105, 0.15); color: #059669; border: 1px solid rgba(5, 150, 105, 0.3);">
            ${getIcon('tax')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">GST & Tax Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(5, 150, 105, 0.15); color: #059669; border-color: rgba(5, 150, 105, 0.3);">Tax Split</span>
            </div>
            <p class="workspace-description">Quickly add or deduct GST from base amounts with automatic CGST/SGST/IGST tax component split.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="gst-fav-btn" class="icon-btn ${Storage.isFavorite('gst') ? 'active' : ''}" title="Favorite">
            ${getIcon(Storage.isFavorite('gst') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label">GST Mode</label>
            <div class="segmented-control" id="gst-mode-tabs">
              <button class="segment-btn active" data-mode="add">Add GST (Exclusive)</button>
              <button class="segment-btn" data-mode="remove">Remove GST (Inclusive)</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="gst-amount">
              <span id="gst-amount-label">Initial Amount (Before Tax)</span>
            </label>
            <div class="input-wrapper has-prefix">
              <span class="input-prefix">${currency}</span>
              <input type="number" id="gst-amount" class="input-field" value="${this.state.amount}" min="0" step="any" placeholder="e.g. 10000">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="gst-rate">GST Tax Slab</label>
            <div style="display:flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;" id="gst-rate-presets">
              <button class="btn btn-subtle btn-sm gst-rate-pill" data-rate="3">3%</button>
              <button class="btn btn-subtle btn-sm gst-rate-pill" data-rate="5">5%</button>
              <button class="btn btn-subtle btn-sm gst-rate-pill" data-rate="12">12%</button>
              <button class="btn btn-primary btn-sm gst-rate-pill" data-rate="18">18%</button>
              <button class="btn btn-subtle btn-sm gst-rate-pill" data-rate="28">28%</button>
            </div>
            <div class="input-wrapper has-suffix">
              <input type="number" id="gst-rate" class="input-field" value="${this.state.rate}" min="0" max="100" step="0.1" placeholder="Custom rate">
              <span class="input-suffix">%</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Supply Type</label>
            <div class="segmented-control" id="gst-tax-type">
              <button class="segment-btn active" data-type="intra">Intra-State (CGST + SGST)</button>
              <button class="segment-btn" data-type="inter">Inter-State (IGST)</button>
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="gst-calc-btn" class="btn btn-primary" style="flex:1;">Calculate & Save</button>
            <button id="gst-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <!-- Result Panel -->
        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label" id="gst-result-top-label">Total Gross Amount</span>
            <button id="gst-copy-btn" class="btn btn-subtle btn-sm" title="Copy result">
              ${getIcon('copy')} Copy
            </button>
          </div>

          <div>
            <div class="result-main-value" id="gst-total-val">${currency}11,800</div>
            <div class="result-sub-value" id="gst-tax-summary">Includes ${currency}1,800 GST (18%)</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Net Amount</div>
              <div class="breakdown-item-value" id="gst-net-val">${currency}10,000</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Total GST Tax</div>
              <div class="breakdown-item-value" id="gst-tax-val" style="color: var(--accent-primary);">${currency}1,800</div>
            </div>
          </div>

          <div class="breakdown-grid" id="gst-split-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label" id="gst-c-label">CGST (9%)</div>
              <div class="breakdown-item-value" id="gst-c-val">${currency}900</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label" id="gst-s-label">SGST (9%)</div>
              <div class="breakdown-item-value" id="gst-s-val">${currency}900</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">
              ${getIcon('info')} Calculation Formula
            </div>
            <div id="gst-formula-box" style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 4px;">
              GST = (Amount × 18) ÷ 100 = ${currency}1,800
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const amtInput = container.querySelector('#gst-amount');
    const rateInput = container.querySelector('#gst-rate');

    // Mode tabs
    const modeTabs = container.querySelectorAll('#gst-mode-tabs .segment-btn');
    modeTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        modeTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.mode = btn.dataset.mode;
        
        const amtLabel = container.querySelector('#gst-amount-label');
        if (amtLabel) {
          amtLabel.textContent = this.state.mode === 'add' ? 'Initial Amount (Before Tax)' : 'Gross Amount (Including Tax)';
        }
        this.calculate();
      });
    });

    // Supply type tabs
    const typeTabs = container.querySelectorAll('#gst-tax-type .segment-btn');
    typeTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        typeTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.taxType = btn.dataset.type;
        this.calculate();
      });
    });

    // Preset pills
    const pills = container.querySelectorAll('.gst-rate-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => {
          p.classList.remove('btn-primary');
          p.classList.add('btn-subtle');
        });
        pill.classList.remove('btn-subtle');
        pill.classList.add('btn-primary');
        rateInput.value = pill.dataset.rate;
        this.calculate();
      });
    });

    amtInput.addEventListener('input', () => this.calculate());
    rateInput.addEventListener('input', () => {
      pills.forEach(p => {
        if (p.dataset.rate === rateInput.value) {
          p.classList.remove('btn-subtle');
          p.classList.add('btn-primary');
        } else {
          p.classList.remove('btn-primary');
          p.classList.add('btn-subtle');
        }
      });
      this.calculate();
    });

    // Buttons
    container.querySelector('#gst-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('GST calculated & saved to history');
    });

    container.querySelector('#gst-reset-btn').addEventListener('click', () => {
      amtInput.value = 10000;
      rateInput.value = 18;
      this.calculate();
    });

    container.querySelector('#gst-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#gst-total-val').textContent;
      navigator.clipboard.writeText(val).then(() => {
        Toast.success(`Copied "${val}" to clipboard`);
      });
    });

    const favBtn = container.querySelector('#gst-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('gst');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const currency = Storage.getSettings().currency || '₹';
    const amount = parseFloat(document.getElementById('gst-amount')?.value) || 0;
    const rate = parseFloat(document.getElementById('gst-rate')?.value) || 0;
    const isAdd = this.state.mode === 'add';
    const isIntra = this.state.taxType === 'intra';

    let netAmount = 0;
    let gstAmount = 0;
    let grossAmount = 0;
    let formulaStr = '';

    if (isAdd) {
      netAmount = amount;
      gstAmount = (amount * rate) / 100;
      grossAmount = netAmount + gstAmount;
      formulaStr = `GST = (${currency}${netAmount.toLocaleString('en-US')} × ${rate}) ÷ 100 = ${currency}${gstAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    } else {
      grossAmount = amount;
      netAmount = (grossAmount * 100) / (100 + rate);
      gstAmount = grossAmount - netAmount;
      formulaStr = `Net Amount = (${currency}${grossAmount.toLocaleString('en-US')} × 100) ÷ (100 + ${rate}) = ${currency}${netAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    }

    const formatCurr = (n) => `${currency}${parseFloat(n.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const totalEl = document.getElementById('gst-total-val');
    const summaryEl = document.getElementById('gst-tax-summary');
    const netEl = document.getElementById('gst-net-val');
    const taxEl = document.getElementById('gst-tax-val');
    const splitGrid = document.getElementById('gst-split-grid');
    const formulaEl = document.getElementById('gst-formula-box');

    if (totalEl) totalEl.textContent = formatCurr(grossAmount);
    if (summaryEl) summaryEl.textContent = `${isAdd ? 'Added' : 'Includes'} ${formatCurr(gstAmount)} GST (${rate}%)`;
    if (netEl) netEl.textContent = formatCurr(netAmount);
    if (taxEl) taxEl.textContent = formatCurr(gstAmount);
    if (formulaEl) formulaEl.textContent = formulaStr;

    if (splitGrid) {
      if (isIntra) {
        const halfRate = rate / 2;
        const halfGst = gstAmount / 2;
        splitGrid.innerHTML = `
          <div class="breakdown-item">
            <div class="breakdown-item-label">CGST (${halfRate}%)</div>
            <div class="breakdown-item-value">${formatCurr(halfGst)}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-item-label">SGST (${halfRate}%)</div>
            <div class="breakdown-item-value">${formatCurr(halfGst)}</div>
          </div>
        `;
      } else {
        splitGrid.innerHTML = `
          <div class="breakdown-item" style="grid-column: span 2;">
            <div class="breakdown-item-label">IGST (${rate}%)</div>
            <div class="breakdown-item-value">${formatCurr(gstAmount)}</div>
          </div>
        `;
      }
    }

    if (logHistory) {
      Storage.addHistory({
        calcId: 'gst',
        calcName: 'GST Calculator',
        expression: `${formatCurr(amount)} (${isAdd ? '+ GST ' : 'incl. GST '} ${rate}%)`,
        result: `Total: ${formatCurr(grossAmount)}`,
        inputs: { amount, rate, mode: this.state.mode }
      });
    }
  }
};
