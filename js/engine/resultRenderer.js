/**
 * CALQIO Standard Calculator Result Card Renderer
 */

import { getIcon } from '../icons.js';

export const ResultRenderer = {
  renderCard(resultData) {
    const mainResult = resultData.mainResult || '0';
    const mainLabel = resultData.mainLabel || 'Result';
    const subResult = resultData.subResult || '';
    const breakdown = resultData.breakdown || [];

    const breakdownHtml = breakdown.map(item => `
      <div class="breakdown-item">
        <div class="breakdown-item-label">${item.label}</div>
        <div class="breakdown-item-value" ${item.color ? `style="color: ${item.color};"` : ''}>
          ${item.value}
        </div>
      </div>
    `).join('');

    return `
      <div class="calc-result-card" id="calc-result-card-root">
        <div class="result-header">
          <span class="result-label" id="calc-result-label">${mainLabel}</span>
          <button type="button" id="calc-copy-result-btn" class="btn btn-subtle btn-sm" title="Copy result">
            ${getIcon('copy')} Copy
          </button>
        </div>

        <div>
          <div class="result-main-value" id="calc-result-main">${mainResult}</div>
          ${subResult ? `<div class="result-sub-value" id="calc-result-sub">${subResult}</div>` : ''}
        </div>

        ${breakdown.length > 0 ? `
          <div class="breakdown-grid" id="calc-breakdown-grid">
            ${breakdownHtml}
          </div>
        ` : ''}

        ${resultData.formula || resultData.explanation ? `
          <div class="result-explanation-box">
            <div class="explanation-title">
              ${getIcon('info')} Formula & Explanation
            </div>
            ${resultData.formula ? `
              <div style="margin: 0.35rem 0;">
                <span class="formula-tag">${resultData.formula}</span>
              </div>
            ` : ''}
            ${resultData.explanation ? `
              <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 4px;" id="calc-explanation-text">
                ${resultData.explanation}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  },

  updateResult(container, resultData) {
    const mainEl = container.querySelector('#calc-result-main');
    const labelEl = container.querySelector('#calc-result-label');
    const subEl = container.querySelector('#calc-result-sub');
    const gridEl = container.querySelector('#calc-breakdown-grid');
    const expEl = container.querySelector('#calc-explanation-text');

    if (mainEl) mainEl.textContent = resultData.mainResult || '0';
    if (labelEl) labelEl.textContent = resultData.mainLabel || 'Result';
    if (subEl) subEl.textContent = resultData.subResult || '';

    if (gridEl && resultData.breakdown) {
      gridEl.innerHTML = resultData.breakdown.map(item => `
        <div class="breakdown-item">
          <div class="breakdown-item-label">${item.label}</div>
          <div class="breakdown-item-value" ${item.color ? `style="color: ${item.color};"` : ''}>
            ${item.value}
          </div>
        </div>
      `).join('');
    }

    if (expEl && resultData.explanation) {
      expEl.textContent = resultData.explanation;
    }
  }
};
