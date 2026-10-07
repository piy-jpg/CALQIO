/**
 * CALQIO Health & Fitness Tools: BMR/TDEE & Calorie Needs, Body Fat %, Water Intake
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

// 1. BMR & TDEE (Total Daily Energy Expenditure) Calculator
export const BmrTdeeCalculator = {
  id: 'bmr_tdee',
  name: 'BMR & Calorie Calculator',
  category: 'health',
  icon: 'health',
  description: 'Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) for weight loss, maintenance, or muscle gain.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(225, 29, 72, 0.15); color: #e11d48; border: 1px solid rgba(225, 29, 72, 0.3);">
            ${getIcon('health')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">BMR & Calorie Needs</h1>
              <span class="badge badge-primary" style="background: rgba(225, 29, 72, 0.15); color: #e11d48; border-color: rgba(225, 29, 72, 0.3);">Metabolism</span>
            </div>
            <p class="workspace-description">Find your exact baseline metabolism and daily calorie targets based on physical activity.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="bmr-fav-btn" class="icon-btn ${Storage.isFavorite('bmr_tdee') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('bmr_tdee') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label" for="bmr-gender">Gender</label>
              <select id="bmr-gender" class="input-field select-field">
                <option value="male" selected>Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="bmr-age">Age</label>
              <input type="number" id="bmr-age" class="input-field" value="28" min="10" max="120">
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label" for="bmr-height">Height (cm)</label>
              <input type="number" id="bmr-height" class="input-field" value="175" min="50" max="250">
            </div>
            <div class="form-group">
              <label class="form-label" for="bmr-weight">Weight (kg)</label>
              <input type="number" id="bmr-weight" class="input-field" value="72" min="20" max="300">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="bmr-activity">Activity Level</label>
            <select id="bmr-activity" class="input-field select-field">
              <option value="1.2">Sedentary (Little or no exercise)</option>
              <option value="1.375" selected>Lightly active (Exercise 1-3 days/week)</option>
              <option value="1.55">Moderately active (Exercise 3-5 days/week)</option>
              <option value="1.725">Very active (Hard exercise 6-7 days/week)</option>
              <option value="1.9">Extra active (Physical job + training)</option>
            </select>
          </div>

          <div class="calc-action-buttons">
            <button id="bmr-calc-btn" class="btn btn-primary" style="flex:1;">Compute Calories</button>
            <button id="bmr-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Maintenance Calories (TDEE)</span>
            <button id="bmr-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="bmr-tdee-val" style="color:#ec4899;">2,316 kcal</div>
            <div class="result-sub-value" id="bmr-base-val">Basal Metabolic Rate: 1,684 kcal/day</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Mild Weight Loss (-10%)</div>
              <div class="breakdown-item-value" id="bmr-loss-mild" style="color:var(--accent-primary);">2,084 kcal</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Weight Gain (+15%)</div>
              <div class="breakdown-item-value" id="bmr-gain-val" style="color:#10b981;">2,663 kcal</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Mifflin-St Jeor Guideline</div>
            <div style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              BMR is the energy your body burns at complete rest to maintain vital organ functions.
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
    inputs.forEach(i => i.addEventListener('input', () => this.calculate()));
    inputs.forEach(i => i.addEventListener('change', () => this.calculate()));

    container.querySelector('#bmr-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Calories calculated & saved');
    });

    container.querySelector('#bmr-reset-btn').addEventListener('click', () => {
      container.querySelector('#bmr-gender').value = 'male';
      container.querySelector('#bmr-age').value = 28;
      container.querySelector('#bmr-height').value = 175;
      container.querySelector('#bmr-weight').value = 72;
      container.querySelector('#bmr-activity').value = '1.375';
      this.calculate();
    });

    container.querySelector('#bmr-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#bmr-tdee-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#bmr-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('bmr_tdee');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const gender = document.getElementById('bmr-gender')?.value || 'male';
    const age = parseFloat(document.getElementById('bmr-age')?.value) || 28;
    const h = parseFloat(document.getElementById('bmr-height')?.value) || 175;
    const w = parseFloat(document.getElementById('bmr-weight')?.value) || 72;
    const act = parseFloat(document.getElementById('bmr-activity')?.value) || 1.375;

    let bmr = (10 * w) + (6.25 * h) - (5 * age);
    bmr += (gender === 'male' ? 5 : -161);

    const tdee = bmr * act;
    const mildLoss = tdee * 0.9;
    const gain = tdee * 1.15;

    const tEl = document.getElementById('bmr-tdee-val');
    const bEl = document.getElementById('bmr-base-val');
    const lEl = document.getElementById('bmr-loss-mild');
    const gEl = document.getElementById('bmr-gain-val');

    const fmt = (n) => `${Math.round(n).toLocaleString('en-US')} kcal/day`;

    if (tEl) tEl.textContent = `${Math.round(tdee).toLocaleString('en-US')} kcal`;
    if (bEl) bEl.textContent = `Basal Metabolic Rate: ${fmt(bmr)}`;
    if (lEl) lEl.textContent = fmt(mildLoss);
    if (gEl) gEl.textContent = fmt(gain);

    if (logHistory) {
      Storage.addHistory({
        calcId: 'bmr_tdee',
        calcName: 'BMR & Calories',
        expression: `${w}kg, ${h}cm, age ${age}`,
        result: `TDEE: ${Math.round(tdee)} kcal (BMR: ${Math.round(bmr)})`
      });
    }
  }
};
