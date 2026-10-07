/**
 * CALQIO Reusable Calculator Page Orchestrator
 * Standardizes layout, reactive input binding, validation, result cards, and related tools.
 */

import { InputRenderer } from './inputRenderer.js';
import { ResultRenderer } from './resultRenderer.js';
import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';
import { getCalculator, CALCULATORS_MAP } from '../registry.js';
import { state } from '../state.js';

export const CalculatorPage = {
  create(calcDef) {
    return {
      id: calcDef.id,
      name: calcDef.name,
      category: calcDef.category,
      icon: calcDef.icon,
      description: calcDef.description,
      related: calcDef.related || [],
      definition: calcDef,
      calculate: (vals, opts) => calcDef.calculate(vals, opts),

      render(container) {
        const currency = Storage.getSettings().currency || '₹';
        const isFav = Storage.isFavorite(calcDef.id);

        // Prepare initial values
        const currentValues = {};
        (calcDef.inputs || []).forEach(inp => {
          currentValues[inp.id] = inp.defaultValue;
        });

        // Compute initial result
        let initialResult = { mainResult: '0', mainLabel: 'Result', breakdown: [] };
        try {
          initialResult = calcDef.calculate(currentValues, { currency }) || initialResult;
        } catch (e) {
          console.warn('Initial calculation error:', e);
        }

        // Render inputs HTML
        const inputsHtml = (calcDef.inputs || []).map(inp => 
          InputRenderer.renderField(inp, currentValues[inp.id], currency)
        ).join('');

        // Render Related Calculators
        const relatedCalcs = (calcDef.related || []).map(relId => CALCULATORS_MAP.get(relId)).filter(Boolean);
        const relatedHtml = relatedCalcs.length > 0 ? `
          <div style="margin-top: 2.5rem; width: 100%;">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Related Calculators</h3>
            <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
              ${relatedCalcs.map(rel => `
                <a href="#/calc/${rel.id}" class="calc-card" style="padding: 1rem 1.25rem;">
                  <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                      <div class="calc-card-icon" style="width:34px; height:34px; font-size:1.1rem;">
                        ${getIcon(rel.icon)}
                      </div>
                      <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">${rel.name}</div>
                    </div>
                    <span style="color:var(--text-muted);">${getIcon('arrowRight')}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        ` : '';

        const topCatKey = calcDef.category ? (calcDef.category) : '';
        
        // Assemble Full Page Layout
        container.innerHTML = `
          <div class="workspace-header">
            <div class="workspace-title-area">
              <div class="workspace-icon-box">
                ${getIcon(calcDef.icon)}
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h1 class="workspace-heading">${calcDef.name}</h1>
                  <span class="badge badge-subtle" style="font-size:0.7rem; font-weight:700; text-transform:uppercase;">${calcDef.category || 'TOOL'}</span>
                </div>
                <p class="workspace-description">${calcDef.description}</p>
              </div>
            </div>
            <div class="workspace-actions">
              <button id="calc-fav-btn" class="icon-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                ${getIcon(isFav ? 'starFilled' : 'star')}
              </button>
            </div>
          </div>

          <div class="workspace-grid">
            <!-- Input Panel Card -->
            <div class="card calc-inputs-card">
              <form id="calc-form" onsubmit="return false;">
                ${inputsHtml}

                <div class="calc-action-buttons" style="margin-top: 1.25rem;">
                  <button type="submit" id="calc-submit-btn" class="btn btn-primary" style="flex:1;">
                    Calculate & Save
                  </button>
                  <button type="button" id="calc-reset-btn" class="btn btn-secondary">
                    Reset
                  </button>
                </div>
              </form>
            </div>

            <!-- Result Panel Card -->
            <div id="calc-result-container">
              ${ResultRenderer.renderCard(initialResult)}
            </div>
          </div>

          ${relatedHtml}
        `;

        // Bind Reactive Events
        this.bindEvents(container, currentValues);
      },

      bindEvents(container, currentValues) {
        const currency = Storage.getSettings().currency || '₹';

        // Perform calculation function with validation
        const performCalculation = (logHistory = false) => {
          let hasError = false;

          // Validate inputs
          (calcDef.inputs || []).forEach(inp => {
            const val = currentValues[inp.id];
            let errorMsg = null;

            if (inp.type === 'number') {
              if (val === '' || val === null || isNaN(val)) {
                errorMsg = 'Please enter a valid number';
              } else if (inp.min !== undefined && val < inp.min) {
                errorMsg = `Value must be at least ${inp.min}`;
              } else if (inp.max !== undefined && val > inp.max) {
                errorMsg = `Value cannot exceed ${inp.max}`;
              }
            }

            if (!errorMsg && typeof inp.validate === 'function') {
              errorMsg = inp.validate(val, currentValues);
            }

            InputRenderer.showError(container, inp.id, errorMsg);
            if (errorMsg) hasError = true;
          });

          if (hasError) return;

          try {
            const resultData = calcDef.calculate(currentValues, { currency });
            if (resultData) {
              ResultRenderer.updateResult(container, resultData);

              if (logHistory && resultData.mainResult) {
                Storage.addHistory({
                  calcId: calcDef.id,
                  calcName: calcDef.name,
                  expression: resultData.expression || Object.entries(currentValues).map(([k, v]) => `${k}: ${v}`).join(', '),
                  result: `${resultData.mainLabel || 'Result'}: ${resultData.mainResult}`,
                  inputs: { ...currentValues }
                });
                Toast.success(`${calcDef.name} calculated & saved`);
              }
            }
          } catch (err) {
            console.error(`Calculation error in ${calcDef.name}:`, err);
          }
        };

        // Bind all field changes
        (calcDef.inputs || []).forEach(inp => {
          InputRenderer.bindFieldEvents(container, inp, (id, val) => {
            currentValues[id] = inp.type === 'number' ? (val === '' ? '' : parseFloat(val)) : val;
            performCalculation(false);
          });
        });

        // Submit & Reset
        container.querySelector('#calc-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          performCalculation(true);
        });

        container.querySelector('#calc-reset-btn')?.addEventListener('click', () => {
          (calcDef.inputs || []).forEach(inp => {
            currentValues[inp.id] = inp.defaultValue;
            const el = container.querySelector(`#calc-input-${inp.id}`);
            if (el) el.value = inp.defaultValue;
            const rEl = container.querySelector(`#calc-range-${inp.id}`);
            if (rEl) rEl.value = inp.defaultValue;
            InputRenderer.showError(container, inp.id, null);
          });
          performCalculation(false);
          Toast.info('Inputs reset to default');
        });

        // Copy button
        container.querySelector('#calc-copy-result-btn')?.addEventListener('click', () => {
          const val = container.querySelector('#calc-result-main')?.textContent || '';
          navigator.clipboard.writeText(val).then(() => {
            Toast.success(`Copied "${val}" to clipboard`);
          });
        });

        // Favorite button
        const favBtn = container.querySelector('#calc-fav-btn');
        favBtn?.addEventListener('click', () => {
          const isAdded = Storage.toggleFavorite(calcDef.id);
          state.set('favorites', Storage.getFavorites());
          favBtn.classList.toggle('active', isAdded);
          favBtn.innerHTML = getIcon(isAdded ? 'starFilled' : 'star');
          Toast.info(isAdded ? 'Added to favorites' : 'Removed from favorites');
        });
      }
    };
  }
};
