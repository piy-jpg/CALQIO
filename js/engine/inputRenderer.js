/**
 * CALQIO Reusable Input Field Renderer & Validation
 */

export const InputRenderer = {
  renderField(inputDef, currentValue, currency = '₹') {
    const id = inputDef.id;
    const label = inputDef.label;
    const type = inputDef.type || 'number';
    const val = currentValue !== undefined ? currentValue : inputDef.defaultValue;
    const prefix = inputDef.prefix === 'CURRENCY' ? currency : inputDef.prefix;
    const suffix = inputDef.suffix;
    const hint = inputDef.hint || '';

    let inputHtml = '';

    if (type === 'select') {
      const optionsHtml = (inputDef.options || []).map(opt => {
        const optVal = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        const selected = String(optVal) === String(val) ? 'selected' : '';
        return `<option value="${optVal}" ${selected}>${optLabel}</option>`;
      }).join('');

      inputHtml = `
        <select id="calc-input-${id}" class="input-field select-field" data-input-id="${id}">
          ${optionsHtml}
        </select>
      `;
    } else if (type === 'segmented') {
      const segmentsHtml = (inputDef.options || []).map(opt => {
        const optVal = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        const active = String(optVal) === String(val) ? 'active' : '';
        return `<button type="button" class="segment-btn ${active}" data-val="${optVal}">${optLabel}</button>`;
      }).join('');

      inputHtml = `
        <div class="segmented-control" id="calc-segmented-${id}" data-input-id="${id}">
          ${segmentsHtml}
        </div>
        <input type="hidden" id="calc-input-${id}" value="${val}" data-input-id="${id}">
      `;
    } else if (type === 'date') {
      inputHtml = `
        <div class="input-wrapper">
          <input type="date" id="calc-input-${id}" class="input-field" value="${val}" data-input-id="${id}">
        </div>
      `;
    } else {
      // Number input (with optional prefix, suffix, and range slider)
      const hasPrefix = Boolean(prefix);
      const hasSuffix = Boolean(suffix);
      const wrapperClasses = `input-wrapper ${hasPrefix ? 'has-prefix' : ''} ${hasSuffix ? 'has-suffix' : ''}`;

      inputHtml = `
        <div class="${wrapperClasses}">
          ${hasPrefix ? `<span class="input-prefix">${prefix}</span>` : ''}
          <input type="number" id="calc-input-${id}" class="input-field" value="${val}" 
                 min="${inputDef.min !== undefined ? inputDef.min : ''}" 
                 max="${inputDef.max !== undefined ? inputDef.max : ''}" 
                 step="${inputDef.step || 'any'}" 
                 placeholder="${inputDef.placeholder || ''}"
                 data-input-id="${id}">
          ${hasSuffix ? `<span class="input-suffix">${suffix}</span>` : ''}
        </div>
        ${inputDef.rangeSync ? `
          <input type="range" id="calc-range-${id}" 
                 min="${inputDef.rangeMin || inputDef.min || 0}" 
                 max="${inputDef.rangeMax || inputDef.max || 100}" 
                 step="${inputDef.rangeStep || inputDef.step || 1}" 
                 value="${val}" 
                 style="width:100%; margin-top: 6px; accent-color: var(--accent-primary);"
                 data-range-id="${id}">
        ` : ''}
      `;
    }

    return `
      <div class="form-group" id="form-group-${id}">
        <label class="form-label" for="calc-input-${id}">
          <span>${label}</span>
          ${hint ? `<span class="form-label-hint" id="hint-${id}">${hint}</span>` : ''}
        </label>
        ${inputHtml}
        <div class="form-field-error hidden" id="error-${id}" style="color: var(--accent-danger); font-size: 0.75rem; margin-top: 4px;"></div>
      </div>
    `;
  },

  bindFieldEvents(container, inputDef, onChange) {
    const id = inputDef.id;
    const inputEl = container.querySelector(`#calc-input-${id}`);
    const rangeEl = container.querySelector(`#calc-range-${id}`);
    const segmentedEl = container.querySelector(`#calc-segmented-${id}`);

    if (inputEl) {
      inputEl.addEventListener('input', () => {
        if (rangeEl) rangeEl.value = inputEl.value;
        onChange(id, inputEl.value);
      });
      inputEl.addEventListener('change', () => {
        onChange(id, inputEl.value);
      });
    }

    if (rangeEl && inputEl) {
      rangeEl.addEventListener('input', () => {
        inputEl.value = rangeEl.value;
        onChange(id, rangeEl.value);
      });
    }

    if (segmentedEl && inputEl) {
      segmentedEl.querySelectorAll('.segment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          segmentedEl.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          inputEl.value = btn.dataset.val;
          onChange(id, btn.dataset.val);
        });
      });
    }
  },

  showError(container, inputId, message) {
    const errorEl = container.querySelector(`#error-${inputId}`);
    const inputEl = container.querySelector(`#calc-input-${inputId}`);
    if (errorEl) {
      if (message) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        if (inputEl) inputEl.style.borderColor = 'var(--accent-danger)';
      } else {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
        if (inputEl) inputEl.style.borderColor = '';
      }
    }
  }
};
