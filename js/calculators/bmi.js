/**
 * CALQIO BMI (Body Mass Index) & Health Calculator
 * Unit toggles (Metric vs Imperial), animated health gauge, ideal weight, and BMR metrics.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const BmiCalculator = {
  id: 'bmi',
  name: 'BMI Calculator',
  category: 'health',
  icon: 'heart',
  description: 'Calculate Body Mass Index (BMI), health category, ideal weight range, and daily energy needs.',

  state: {
    unit: 'metric', // 'metric' | 'imperial'
    gender: 'male', // 'male' | 'female'
    age: 26,
    // Metric
    heightCm: 175,
    weightKg: 70,
    // Imperial
    heightFt: 5,
    heightIn: 9,
    weightLbs: 154
  },

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(225, 29, 72, 0.15); color: #e11d48; border: 1px solid rgba(225, 29, 72, 0.3);">
            ${getIcon('health')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">BMI & Body Health Calculator</h1>
              <span class="badge badge-primary" style="background: rgba(225, 29, 72, 0.15); color: #e11d48; border-color: rgba(225, 29, 72, 0.3);">WHO Standard</span>
            </div>
            <p class="workspace-description">Evaluate your body mass index, healthy weight targets, and metabolic baseline.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="bmi-fav-btn" class="icon-btn ${Storage.isFavorite('bmi') ? 'active' : ''}" title="Favorite">
            ${getIcon(Storage.isFavorite('bmi') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label">Measurement Units</label>
            <div class="segmented-control" id="bmi-unit-tabs">
              <button class="segment-btn active" data-unit="metric">Metric (cm, kg)</button>
              <button class="segment-btn" data-unit="imperial">Imperial (ft/in, lbs)</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label" for="bmi-gender">Biological Sex</label>
              <select id="bmi-gender" class="input-field select-field">
                <option value="male" selected>Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="bmi-age">Age (years)</label>
              <input type="number" id="bmi-age" class="input-field" value="${this.state.age}" min="2" max="120">
            </div>
          </div>

          <!-- Metric Inputs -->
          <div id="bmi-metric-group">
            <div class="form-group">
              <label class="form-label" for="bmi-height-cm">Height</label>
              <div class="input-wrapper has-suffix">
                <input type="number" id="bmi-height-cm" class="input-field" value="${this.state.heightCm}" min="50" max="250" step="0.5">
                <span class="input-suffix">cm</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="bmi-weight-kg">Weight</label>
              <div class="input-wrapper has-suffix">
                <input type="number" id="bmi-weight-kg" class="input-field" value="${this.state.weightKg}" min="10" max="300" step="0.1">
                <span class="input-suffix">kg</span>
              </div>
            </div>
          </div>

          <!-- Imperial Inputs -->
          <div id="bmi-imperial-group" class="hidden">
            <div class="form-group">
              <label class="form-label">Height</label>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div class="input-wrapper has-suffix">
                  <input type="number" id="bmi-height-ft" class="input-field" value="${this.state.heightFt}" min="1" max="8">
                  <span class="input-suffix">ft</span>
                </div>
                <div class="input-wrapper has-suffix">
                  <input type="number" id="bmi-height-in" class="input-field" value="${this.state.heightIn}" min="0" max="11">
                  <span class="input-suffix">in</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="bmi-weight-lbs">Weight</label>
              <div class="input-wrapper has-suffix">
                <input type="number" id="bmi-weight-lbs" class="input-field" value="${this.state.weightLbs}" min="20" max="600" step="0.5">
                <span class="input-suffix">lbs</span>
              </div>
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="bmi-calc-btn" class="btn btn-primary" style="flex:1;">Recalculate & Save</button>
            <button id="bmi-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <!-- Result Panel -->
        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Body Mass Index</span>
            <span id="bmi-status-badge" class="badge" style="background: var(--accent-success-light); color: var(--accent-success); border-color: rgba(16, 185, 129, 0.3);">
              Normal Weight
            </span>
          </div>

          <div>
            <div class="result-main-value" id="bmi-score-val" style="color: var(--accent-success);">22.9</div>
            <div class="result-sub-value" id="bmi-sub-summary">Healthy weight for your height</div>
          </div>

          <!-- Interactive Scale Gauge -->
          <div class="bmi-gauge-wrapper">
            <div class="bmi-bar-track">
              <div id="bmi-pin" class="bmi-indicator-pin" style="left: 42%;"></div>
            </div>
            <div class="bmi-scale-labels">
              <span>Under (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Over (25-29.9)</span>
              <span>Obese (30+)</span>
            </div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Healthy Weight Range</div>
              <div class="breakdown-item-value" id="bmi-ideal-weight">56.7 – 76.3 kg</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Estimated BMR</div>
              <div class="breakdown-item-value" id="bmi-bmr-val">1,680 kcal/day</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">
              ${getIcon('info')} Health Insights
            </div>
            <div id="bmi-recommendation-text" style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 4px;">
              A BMI of 22.9 is in the optimal range. Maintain a balanced diet and regular physical activity.
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const unitTabs = container.querySelectorAll('#bmi-unit-tabs .segment-btn');
    const metricGroup = container.querySelector('#bmi-metric-group');
    const imperialGroup = container.querySelector('#bmi-imperial-group');

    unitTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        unitTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.unit = btn.dataset.unit;

        if (this.state.unit === 'metric') {
          metricGroup.classList.remove('hidden');
          imperialGroup.classList.add('hidden');
        } else {
          metricGroup.classList.add('hidden');
          imperialGroup.classList.remove('hidden');
        }
        this.calculate();
      });
    });

    const inputs = container.querySelectorAll('.input-field, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.calculate());
      input.addEventListener('change', () => this.calculate());
    });

    container.querySelector('#bmi-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('BMI calculated & saved to history');
    });

    container.querySelector('#bmi-reset-btn').addEventListener('click', () => {
      container.querySelector('#bmi-height-cm').value = 175;
      container.querySelector('#bmi-weight-kg').value = 70;
      container.querySelector('#bmi-height-ft').value = 5;
      container.querySelector('#bmi-height-in').value = 9;
      container.querySelector('#bmi-weight-lbs').value = 154;
      container.querySelector('#bmi-age').value = 26;
      this.calculate();
    });

    const favBtn = container.querySelector('#bmi-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('bmi');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const isMetric = this.state.unit === 'metric';
    let heightM = 0;
    let weightKg = 0;

    if (isMetric) {
      const heightCm = parseFloat(document.getElementById('bmi-height-cm')?.value) || 170;
      weightKg = parseFloat(document.getElementById('bmi-weight-kg')?.value) || 65;
      heightM = heightCm / 100;
    } else {
      const ft = parseFloat(document.getElementById('bmi-height-ft')?.value) || 5;
      const inch = parseFloat(document.getElementById('bmi-height-in')?.value) || 7;
      const totalInches = (ft * 12) + inch;
      const weightLbs = parseFloat(document.getElementById('bmi-weight-lbs')?.value) || 150;
      heightM = totalInches * 0.0254;
      weightKg = weightLbs * 0.453592;
    }

    if (heightM <= 0 || weightKg <= 0) return;

    const bmi = weightKg / (heightM * heightM);
    const roundedBmi = parseFloat(bmi.toFixed(1));

    // Category Determination
    let category = 'Normal Weight';
    let categoryColor = 'var(--accent-success)';
    let categoryBg = 'var(--accent-success-light)';
    let statusSummary = 'Healthy weight for your height';
    let recommendation = 'Your BMI is in the optimal range. Maintain your active lifestyle and balanced diet.';

    // Progress percentage on gauge (15 to 35 range mapped to 0% to 100%)
    let gaugePercent = Math.min(100, Math.max(0, ((bmi - 14) / (36 - 14)) * 100));

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'var(--accent-info)';
      categoryBg = 'var(--accent-info-light)';
      statusSummary = 'Below recommended body weight';
      recommendation = 'You may benefit from nutrient-dense foods and strength training to build healthy muscle mass.';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal Weight';
      categoryColor = 'var(--accent-success)';
      categoryBg = 'var(--accent-success-light)';
      statusSummary = 'Healthy weight for your height';
      recommendation = 'Great job! Your weight is within the healthy recommended parameters.';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      category = 'Overweight';
      categoryColor = 'var(--accent-warning)';
      categoryBg = 'var(--accent-warning-light)';
      statusSummary = 'Slightly above recommended weight';
      recommendation = 'Consider incorporating 30 minutes of moderate aerobic activity and mindful portion sizing.';
    } else {
      category = 'Obesity';
      categoryColor = 'var(--accent-danger)';
      categoryBg = 'var(--accent-danger-light)';
      statusSummary = 'Significantly above healthy range';
      recommendation = 'Consulting a healthcare professional or nutritionist can help create a structured wellness plan.';
    }

    // Ideal Weight Range for this height (BMI 18.5 - 24.9)
    const minIdealKg = 18.5 * (heightM * heightM);
    const maxIdealKg = 24.9 * (heightM * heightM);
    let idealWeightText = `${minIdealKg.toFixed(1)} – ${maxIdealKg.toFixed(1)} kg`;
    if (!isMetric) {
      idealWeightText = `${(minIdealKg * 2.20462).toFixed(1)} – ${(maxIdealKg * 2.20462).toFixed(1)} lbs`;
    }

    // BMR Calculation (Mifflin-St Jeor formula)
    const gender = document.getElementById('bmi-gender')?.value || 'male';
    const age = parseFloat(document.getElementById('bmi-age')?.value) || 25;
    const heightCm = heightM * 100;
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr += (gender === 'male' ? 5 : -161);
    const bmrText = `${Math.round(bmr).toLocaleString('en-US')} kcal/day`;

    // Update DOM
    const scoreEl = document.getElementById('bmi-score-val');
    const badgeEl = document.getElementById('bmi-status-badge');
    const subEl = document.getElementById('bmi-sub-summary');
    const pinEl = document.getElementById('bmi-pin');
    const idealEl = document.getElementById('bmi-ideal-weight');
    const bmrEl = document.getElementById('bmi-bmr-val');
    const recEl = document.getElementById('bmi-recommendation-text');

    if (scoreEl) {
      scoreEl.textContent = roundedBmi;
      scoreEl.style.color = categoryColor;
    }
    if (badgeEl) {
      badgeEl.textContent = category;
      badgeEl.style.color = categoryColor;
      badgeEl.style.background = categoryBg;
    }
    if (subEl) subEl.textContent = statusSummary;
    if (pinEl) pinEl.style.left = `${gaugePercent}%`;
    if (idealEl) idealEl.textContent = idealWeightText;
    if (bmrEl) bmrEl.textContent = bmrText;
    if (recEl) recEl.textContent = recommendation;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'bmi',
        calcName: 'BMI Calculator',
        expression: `${isMetric ? (heightM*100).toFixed(0)+' cm, '+weightKg.toFixed(1)+' kg' : 'Height: '+(heightM*39.37).toFixed(0)+' in, '+ (weightKg*2.204).toFixed(0)+' lbs'}`,
        result: `BMI: ${roundedBmi} (${category})`,
        inputs: { bmi: roundedBmi, category }
      });
    }
  }
};
