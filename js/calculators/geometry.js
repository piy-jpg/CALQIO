/**
 * CALQIO Geometry Tools: 2D Area & Perimeter, 3D Volume, Pythagorean Theorem
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const GeometryCalculator = {
  id: 'geometry',
  name: 'Geometry & 3D Shapes',
  category: 'geometry',
  icon: 'geometry',
  description: 'Calculate Area, Perimeter, Surface Area, and Volume for Circles, Triangles, Rectangles, Spheres, and Cylinders.',

  state: {
    shape: 'circle' // 'circle' | 'triangle' | 'rectangle' | 'cylinder' | 'sphere'
  },

  render(container) {
    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">📐</div>
          <div>
            <h1 class="workspace-heading">Geometry & Shapes Calculator</h1>
            <p class="workspace-description">Solve area, perimeter, surface area, and volume across 2D & 3D geometric shapes.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="geom-fav-btn" class="icon-btn ${Storage.isFavorite('geometry') ? 'active' : ''}">
            ${getIcon(Storage.isFavorite('geometry') ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label">Select Geometric Shape</label>
            <div class="segmented-control" id="geom-shape-tabs" style="flex-wrap: wrap;">
              <button class="segment-btn active" data-shape="circle">Circle</button>
              <button class="segment-btn" data-shape="rectangle">Rectangle</button>
              <button class="segment-btn" data-shape="triangle">Triangle</button>
              <button class="segment-btn" data-shape="cylinder">Cylinder</button>
              <button class="segment-btn" data-shape="sphere">Sphere</button>
            </div>
          </div>

          <!-- Circle Inputs -->
          <div id="geom-panel-circle" class="geom-panel">
            <div class="form-group">
              <label class="form-label" for="geom-radius">Radius (r)</label>
              <input type="number" id="geom-radius" class="input-field" value="7" min="0.1" step="0.1">
            </div>
          </div>

          <!-- Rectangle Inputs -->
          <div id="geom-panel-rectangle" class="geom-panel hidden">
            <div class="form-group">
              <label class="form-label" for="geom-rect-w">Width (w)</label>
              <input type="number" id="geom-rect-w" class="input-field" value="10" min="0.1" step="0.1">
            </div>
            <div class="form-group">
              <label class="form-label" for="geom-rect-h">Height / Length (h)</label>
              <input type="number" id="geom-rect-h" class="input-field" value="5" min="0.1" step="0.1">
            </div>
          </div>

          <!-- Triangle Inputs -->
          <div id="geom-panel-triangle" class="geom-panel hidden">
            <div class="form-group">
              <label class="form-label" for="geom-tri-b">Base (b)</label>
              <input type="number" id="geom-tri-b" class="input-field" value="8" min="0.1" step="0.1">
            </div>
            <div class="form-group">
              <label class="form-label" for="geom-tri-h">Height (h)</label>
              <input type="number" id="geom-tri-h" class="input-field" value="6" min="0.1" step="0.1">
            </div>
          </div>

          <!-- Cylinder Inputs -->
          <div id="geom-panel-cylinder" class="geom-panel hidden">
            <div class="form-group">
              <label class="form-label" for="geom-cyl-r">Radius (r)</label>
              <input type="number" id="geom-cyl-r" class="input-field" value="4" min="0.1" step="0.1">
            </div>
            <div class="form-group">
              <label class="form-label" for="geom-cyl-h">Height (h)</label>
              <input type="number" id="geom-cyl-h" class="input-field" value="10" min="0.1" step="0.1">
            </div>
          </div>

          <!-- Sphere Inputs -->
          <div id="geom-panel-sphere" class="geom-panel hidden">
            <div class="form-group">
              <label class="form-label" for="geom-sph-r">Radius (r)</label>
              <input type="number" id="geom-sph-r" class="input-field" value="5" min="0.1" step="0.1">
            </div>
          </div>

          <div class="calc-action-buttons">
            <button id="geom-calc-btn" class="btn btn-primary" style="flex:1;">Compute Geometry</button>
            <button id="geom-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label" id="geom-result-top-label">Surface Area</span>
            <button id="geom-copy-btn" class="btn btn-subtle btn-sm">${getIcon('copy')} Copy</button>
          </div>

          <div>
            <div class="result-main-value" id="geom-res-main" style="color:var(--accent-primary);">153.94 units²</div>
            <div class="result-sub-value" id="geom-res-sub">Perimeter / Circumference: 43.98 units</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label" id="geom-item1-label">Area</div>
              <div class="breakdown-item-value" id="geom-item1-val">153.94</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label" id="geom-item2-label">Circumference</div>
              <div class="breakdown-item-value" id="geom-item2-val">43.98</div>
            </div>
          </div>

          <div class="result-explanation-box">
            <div class="explanation-title">${getIcon('info')} Formula</div>
            <div id="geom-formula-text" style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">
              Area = π × r² = π × 7² = 153.938<br>
              Circumference = 2 × π × r = 43.982
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.calculate();
  },

  bindEvents(container) {
    const tabs = container.querySelectorAll('#geom-shape-tabs .segment-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.shape = btn.dataset.shape;

        container.querySelectorAll('.geom-panel').forEach(p => p.classList.add('hidden'));
        container.querySelector(`#geom-panel-${this.state.shape}`)?.classList.remove('hidden');

        this.calculate();
      });
    });

    const inputs = container.querySelectorAll('.input-field');
    inputs.forEach(i => i.addEventListener('input', () => this.calculate()));

    container.querySelector('#geom-calc-btn').addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Geometry calculated & saved');
    });

    container.querySelector('#geom-reset-btn').addEventListener('click', () => {
      this.calculate();
    });

    container.querySelector('#geom-copy-btn').addEventListener('click', () => {
      const val = container.querySelector('#geom-res-main').textContent;
      navigator.clipboard.writeText(val).then(() => Toast.success(`Copied "${val}"`));
    });

    const favBtn = container.querySelector('#geom-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('geometry');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const shape = this.state.shape;
    let mainText = '', subText = '', item1Label = '', item1Val = '', item2Label = '', item2Val = '', fText = '';

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US');

    if (shape === 'circle') {
      const r = parseFloat(document.getElementById('geom-radius')?.value) || 0;
      const area = Math.PI * r * r;
      const circ = 2 * Math.PI * r;
      mainText = `${fmt(area)} units²`;
      subText = `Circumference: ${fmt(circ)} units`;
      item1Label = 'Area'; item1Val = `${fmt(area)} sq units`;
      item2Label = 'Circumference'; item2Val = `${fmt(circ)} units`;
      fText = `Area = π × r² = π × ${r}² = ${fmt(area)}<br>Circumference = 2 × π × r = ${fmt(circ)}`;
    } else if (shape === 'rectangle') {
      const w = parseFloat(document.getElementById('geom-rect-w')?.value) || 0;
      const h = parseFloat(document.getElementById('geom-rect-h')?.value) || 0;
      const area = w * h;
      const perim = 2 * (w + h);
      const diag = Math.sqrt((w * w) + (h * h));
      mainText = `${fmt(area)} units²`;
      subText = `Perimeter: ${fmt(perim)} units | Diagonal: ${fmt(diag)}`;
      item1Label = 'Area'; item1Val = `${fmt(area)} sq units`;
      item2Label = 'Perimeter'; item2Val = `${fmt(perim)} units`;
      fText = `Area = w × h = ${w} × ${h} = ${fmt(area)}<br>Diagonal = √(w² + h²) = ${fmt(diag)}`;
    } else if (shape === 'triangle') {
      const b = parseFloat(document.getElementById('geom-tri-b')?.value) || 0;
      const h = parseFloat(document.getElementById('geom-tri-h')?.value) || 0;
      const area = 0.5 * b * h;
      mainText = `${fmt(area)} units²`;
      subText = `Base: ${b} | Height: ${h}`;
      item1Label = 'Area'; item1Val = `${fmt(area)} sq units`;
      item2Label = 'Base / Height'; item2Val = `${b} × ${h}`;
      fText = `Area = ½ × base × height = ½ × ${b} × ${h} = ${fmt(area)}`;
    } else if (shape === 'cylinder') {
      const r = parseFloat(document.getElementById('geom-cyl-r')?.value) || 0;
      const h = parseFloat(document.getElementById('geom-cyl-h')?.value) || 0;
      const vol = Math.PI * r * r * h;
      const surf = (2 * Math.PI * r * h) + (2 * Math.PI * r * r);
      mainText = `${fmt(vol)} units³`;
      subText = `Total Surface Area: ${fmt(surf)} units²`;
      item1Label = 'Volume'; item1Val = `${fmt(vol)} cubic units`;
      item2Label = 'Surface Area'; item2Val = `${fmt(surf)} sq units`;
      fText = `Volume = π × r² × h = ${fmt(vol)}<br>Surface Area = 2πrh + 2πr² = ${fmt(surf)}`;
    } else if (shape === 'sphere') {
      const r = parseFloat(document.getElementById('geom-sph-r')?.value) || 0;
      const vol = (4 / 3) * Math.PI * Math.pow(r, 3);
      const surf = 4 * Math.PI * r * r;
      mainText = `${fmt(vol)} units³`;
      subText = `Surface Area: ${fmt(surf)} units²`;
      item1Label = 'Volume'; item1Val = `${fmt(vol)} cubic units`;
      item2Label = 'Surface Area'; item2Val = `${fmt(surf)} sq units`;
      fText = `Volume = 4/3 × π × r³ = ${fmt(vol)}<br>Surface Area = 4 × π × r² = ${fmt(surf)}`;
    }

    const mEl = document.getElementById('geom-res-main');
    const sEl = document.getElementById('geom-res-sub');
    const l1El = document.getElementById('geom-item1-label');
    const v1El = document.getElementById('geom-item1-val');
    const l2El = document.getElementById('geom-item2-label');
    const v2El = document.getElementById('geom-item2-val');
    const fEl = document.getElementById('geom-formula-text');

    if (mEl) mEl.textContent = mainText;
    if (sEl) sEl.textContent = subText;
    if (l1El) l1El.textContent = item1Label;
    if (v1El) v1El.textContent = item1Val;
    if (l2El) l2El.textContent = item2Label;
    if (v2El) v2El.textContent = item2Val;
    if (fEl) fEl.innerHTML = fText;

    if (logHistory) {
      Storage.addHistory({
        calcId: 'geometry',
        calcName: 'Geometry',
        expression: `${shape.toUpperCase()}`,
        result: mainText
      });
    }
  }
};
