/**
 * CALQIO Education Tools: GPA / CGPA & Grade Percentage
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const GpaCalculator = {
  id: 'gpa',
  name: 'GPA & CGPA Calculator',
  category: 'education',
  icon: 'education',
  description: 'Calculate Grade Point Average (GPA / CGPA) on a 4.0 or 10.0 scale with credit weighting.',

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">🎓</div>
          <div>
            <h1 class="workspace-heading">GPA & CGPA Calculator</h1>
            <p class="workspace-description">Compute weighted semester GPA and cumulative academic performance.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="gpa-fav-btn" class="icon-btn ${Storage.isFavorite('gpa') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('gpa') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label">Course Grades & Credits</label>
            <div id="gpa-courses-list" style="display:flex; flex-direction:column; gap:0.5rem;">
              <!-- Course Row 1 -->
              <div class="gpa-row" style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:0.5rem;">
                <input type="text" class="input-field" value="Course 1" placeholder="Course Name">
                <select class="input-field select-field gpa-grade">
                  <option value="4.0" selected>A (4.0)</option>
                  <option value="3.7">A- (3.7)</option>
                  <option value="3.3">B+ (3.3)</option>
                  <option value="3.0">B (3.0)</option>
                  <option value="2.7">B- (2.7)</option>
                  <option value="2.0">C (2.0)</option>
                  <option value="1.0">D (1.0)</option>
                  <option value="0.0">F (0.0)</option>
                </select>
                <input type="number" class="input-field gpa-credit" value="4" min="1" max="10" placeholder="Credits">
              </div>

              <!-- Course Row 2 -->
              <div class="gpa-row" style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:0.5rem;">
                <input type="text" class="input-field" value="Course 2" placeholder="Course Name">
                <select class="input-field select-field gpa-grade">
                  <option value="4.0">A (4.0)</option>
                  <option value="3.7" selected>A- (3.7)</option>
                  <option value="3.3">B+ (3.3)</option>
                  <option value="3.0">B (3.0)</option>
                  <option value="2.0">C (2.0)</option>
                </select>
                <input type="number" class="input-field gpa-credit" value="3" min="1" max="10" placeholder="Credits">
              </div>

              <!-- Course Row 3 -->
              <div class="gpa-row" style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:0.5rem;">
                <input type="text" class="input-field" value="Course 3" placeholder="Course Name">
                <select class="input-field select-field gpa-grade">
                  <option value="4.0">A (4.0)</option>
                  <option value="3.3" selected>B+ (3.3)</option>
                  <option value="3.0">B (3.0)</option>
                </select>
                <input type="number" class="input-field gpa-credit" value="3" min="1" max="10" placeholder="Credits">
              </div>

              <!-- Course Row 4 -->
              <div class="gpa-row" style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:0.5rem;">
                <input type="text" class="input-field" value="Course 4" placeholder="Course Name">
                <select class="input-field select-field gpa-grade">
                  <option value="4.0" selected>A (4.0)</option>
                  <option value="3.7">A- (3.7)</option>
                  <option value="3.0">B (3.0)</option>
                </select>
                <input type="number" class="input-field gpa-credit" value="4" min="1" max="10" placeholder="Credits">
              </div>
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="gpa-calc-btn" class="btn btn-primary" style="flex:1;">Calculate GPA</button>
            <button id="gpa-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Weighted GPA (4.0 Scale)</span>
            <button id="gpa-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="gpa-main-val" style="color:var(--accent-primary);">3.79</div>
            <div class="result-sub-value" id="gpa-sub-val">Total Credits: 14 | Honors Standing</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Equivalent 10.0 Scale</div>
              <div class="breakdown-item-value" id="gpa-10-val">9.48 / 10</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Grade Percentage</div>
              <div class="breakdown-item-value" id="gpa-pct-val">94.8%</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formula</div>
            <div id="gpa-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              GPA = Σ(Grade Points × Credits) ÷ Σ(Total Credits)
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const inputs = container.querySelectorAll('.gpa-grade, .gpa-credit');
    inputs.forEach(i => {
      i.addEventListener('input', () => this.calculate());
      i.addEventListener('change', () => this.calculate());
    });

    container.querySelector('#gpa-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('GPA computed & saved');
    });

    container.querySelector('#gpa-reset-btn').addEventListener('click', () => {
      this.calculate();
    });

    container.querySelector('#gpa-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#gpa-main-val').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied GPA: ${val}`));
    });

    const favBtn = container.querySelector('#gpa-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('gpa');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const rows = document.querySelectorAll('.gpa-row');
    let totalPoints = 0;
    let totalCredits = 0;

    rows.forEach(r => {
      const grade = parseFloat(r.querySelector('.gpa-grade')?.value) || 0;
      const cred = parseFloat(r.querySelector('.gpa-credit')?.value) || 0;
      totalPoints += (grade * cred);
      totalCredits += cred;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const gpa10 = (gpa / 4) * 10;
    const gpaPct = (gpa / 4) * 100;

    const gEl = document.getElementById('gpa-main-val');
    const sEl = document.getElementById('gpa-sub-val');
    const g10El = document.getElementById('gpa-10-val');
    const gPctEl = document.getElementById('gpa-pct-val');

    if (gEl) gEl.textContent = gpa.toFixed(2);
    if (sEl) sEl.textContent = `Total Credits: ${totalCredits} | ${gpa >= 3.5 ? 'Excellent Standing' : 'Good Standing'}`;
    if (g10El) g10El.textContent = `${gpa10.toFixed(2)} / 10`;
    if (gPctEl) gPctEl.textContent = `${gpaPct.toFixed(1)}%`;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'gpa',
        calcName: 'GPA Calculator',
        expression: `${totalCredits} Credits, ${totalPoints.toFixed(1)} Points`,
        result: `GPA: ${gpa.toFixed(2)} / 4.0`
      });
    }
  }
};
