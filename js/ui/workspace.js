/**
 * CALQIO Calculator Workspace Container
 */

import { getCalculator } from '../registry.js';
import { Storage } from '../storage.js';

export const Workspace = {
  currentCalculator: null,

  render(container, calcId) {
    // Teardown active calculator if needed
    if (this.currentCalculator && typeof this.currentCalculator.destroy === 'function') {
      this.currentCalculator.destroy();
    }

    const calc = getCalculator(calcId);
    if (!calc) {
      container.innerHTML = `
        <div class="main-container" style="text-align: center; padding: 4rem 1rem;">
          <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Calculator Not Found</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">The calculator "${calcId}" could not be located.</p>
          <a href="#/" class="btn btn-primary">Return to Dashboard</a>
        </div>
      `;
      return;
    }

    this.currentCalculator = calc;
    Storage.recordCalcUsage(calcId);

    container.innerHTML = `<div class="main-container" id="workspace-inner"></div>`;
    const inner = container.querySelector('#workspace-inner');
    calc.render(inner);
  },

  destroy() {
    if (this.currentCalculator && typeof this.currentCalculator.destroy === 'function') {
      this.currentCalculator.destroy();
      this.currentCalculator = null;
    }
  }
};
