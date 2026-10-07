/**
 * CALQIO Multi-Unit Converter
 * Length, Weight, Temperature, Area, Volume, Speed, Digital Storage, and Pressure.
 * Features live multi-unit matrix comparison table and quick presets.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

const CONVERSION_DATA = {
  length: {
    name: 'Length',
    icon: '📏',
    base: 'm',
    units: {
      m: { name: 'Meter (m)', symbol: 'm', factor: 1 },
      km: { name: 'Kilometer (km)', symbol: 'km', factor: 1000 },
      cm: { name: 'Centimeter (cm)', symbol: 'cm', factor: 0.01 },
      mm: { name: 'Millimeter (mm)', symbol: 'mm', factor: 0.001 },
      inch: { name: 'Inch (in)', symbol: 'in', factor: 0.0254 },
      ft: { name: 'Foot (ft)', symbol: 'ft', factor: 0.3048 },
      yd: { name: 'Yard (yd)', symbol: 'yd', factor: 0.9144 },
      mi: { name: 'Mile (mi)', symbol: 'mi', factor: 1609.344 }
    },
    presets: [
      { label: '10 m → ft', val: 10, from: 'm', to: 'ft' },
      { label: '100 km → mi', val: 100, from: 'km', to: 'mi' },
      { label: '6 ft → cm', val: 6, from: 'ft', to: 'cm' },
      { label: '50 in → cm', val: 50, from: 'inch', to: 'cm' }
    ],
    defaultFrom: 'm',
    defaultTo: 'ft',
    defaultVal: 10
  },
  weight: {
    name: 'Weight / Mass',
    icon: '⚖️',
    base: 'kg',
    units: {
      kg: { name: 'Kilogram (kg)', symbol: 'kg', factor: 1 },
      g: { name: 'Gram (g)', symbol: 'g', factor: 0.001 },
      mg: { name: 'Milligram (mg)', symbol: 'mg', factor: 0.000001 },
      lb: { name: 'Pound (lb)', symbol: 'lb', factor: 0.45359237 },
      oz: { name: 'Ounce (oz)', symbol: 'oz', factor: 0.0283495 },
      ton: { name: 'Metric Ton (t)', symbol: 't', factor: 1000 }
    },
    presets: [
      { label: '75 kg → lb', val: 75, from: 'kg', to: 'lb' },
      { label: '150 lb → kg', val: 150, from: 'lb', to: 'kg' },
      { label: '500 g → oz', val: 500, from: 'g', to: 'oz' },
      { label: '2 t → kg', val: 2, from: 'ton', to: 'kg' }
    ],
    defaultFrom: 'kg',
    defaultTo: 'lb',
    defaultVal: 75
  },
  temperature: {
    name: 'Temperature',
    icon: '🌡️',
    units: {
      c: { name: 'Celsius (°C)', symbol: '°C' },
      f: { name: 'Fahrenheit (°F)', symbol: '°F' },
      k: { name: 'Kelvin (K)', symbol: 'K' }
    },
    presets: [
      { label: '25 °C → °F', val: 25, from: 'c', to: 'f' },
      { label: '98.6 °F → °C', val: 98.6, from: 'f', to: 'c' },
      { label: '0 °C → K', val: 0, from: 'c', to: 'k' },
      { label: '100 °C → °F', val: 100, from: 'c', to: 'f' }
    ],
    defaultFrom: 'c',
    defaultTo: 'f',
    defaultVal: 25
  },
  volume: {
    name: 'Volume & Liquid',
    icon: '🧪',
    base: 'l',
    units: {
      l: { name: 'Liter (L)', symbol: 'L', factor: 1 },
      ml: { name: 'Milliliter (mL)', symbol: 'mL', factor: 0.001 },
      m3: { name: 'Cubic Meter (m³)', symbol: 'm³', factor: 1000 },
      gal: { name: 'US Gallon (gal)', symbol: 'gal', factor: 3.78541 },
      qt: { name: 'US Quart (qt)', symbol: 'qt', factor: 0.946353 },
      cup: { name: 'US Cup', symbol: 'cup', factor: 0.236588 },
      floz: { name: 'Fluid Ounce (fl oz)', symbol: 'fl oz', factor: 0.0295735 }
    },
    presets: [
      { label: '10 L → gal', val: 10, from: 'l', to: 'gal' },
      { label: '1 gal → L', val: 1, from: 'gal', to: 'l' },
      { label: '500 mL → fl oz', val: 500, from: 'ml', to: 'floz' },
      { label: '2 cup → mL', val: 2, from: 'cup', to: 'ml' }
    ],
    defaultFrom: 'l',
    defaultTo: 'gal',
    defaultVal: 10
  },
  speed: {
    name: 'Speed',
    icon: '⚡',
    base: 'mps',
    units: {
      mps: { name: 'Meters / sec (m/s)', symbol: 'm/s', factor: 1 },
      kmh: { name: 'Kilometers / hr (km/h)', symbol: 'km/h', factor: 0.277778 },
      mph: { name: 'Miles / hr (mph)', symbol: 'mph', factor: 0.44704 },
      knot: { name: 'Knot (kn)', symbol: 'kn', factor: 0.514444 }
    },
    presets: [
      { label: '100 km/h → mph', val: 100, from: 'kmh', to: 'mph' },
      { label: '65 mph → km/h', val: 65, from: 'mph', to: 'kmh' },
      { label: '25 m/s → km/h', val: 25, from: 'mps', to: 'kmh' },
      { label: '30 kn → mph', val: 30, from: 'knot', to: 'mph' }
    ],
    defaultFrom: 'kmh',
    defaultTo: 'mph',
    defaultVal: 100
  },
  digital: {
    name: 'Digital Storage',
    icon: '💾',
    base: 'mb',
    units: {
      b: { name: 'Byte (B)', symbol: 'B', factor: 0.000001 },
      kb: { name: 'Kilobyte (KB)', symbol: 'KB', factor: 0.001 },
      mb: { name: 'Megabyte (MB)', symbol: 'MB', factor: 1 },
      gb: { name: 'Gigabyte (GB)', symbol: 'GB', factor: 1000 },
      tb: { name: 'Terabyte (TB)', symbol: 'TB', factor: 1000000 }
    },
    presets: [
      { label: '16 GB → MB', val: 16, from: 'gb', to: 'mb' },
      { label: '1 TB → GB', val: 1, from: 'tb', to: 'gb' },
      { label: '500 MB → KB', val: 500, from: 'mb', to: 'kb' },
      { label: '256 GB → TB', val: 256, from: 'gb', to: 'tb' }
    ],
    defaultFrom: 'gb',
    defaultTo: 'mb',
    defaultVal: 16
  },
  pressure: {
    name: 'Pressure',
    icon: '💨',
    base: 'bar',
    units: {
      bar: { name: 'Bar (bar)', symbol: 'bar', factor: 1 },
      psi: { name: 'Pound / sq in (psi)', symbol: 'psi', factor: 0.0689476 },
      kpa: { name: 'Kilopascal (kPa)', symbol: 'kPa', factor: 0.01 },
      atm: { name: 'Atmosphere (atm)', symbol: 'atm', factor: 1.01325 }
    },
    presets: [
      { label: '2.2 bar → psi', val: 2.2, from: 'bar', to: 'psi' },
      { label: '32 psi → bar', val: 32, from: 'psi', to: 'bar' },
      { label: '1 atm → kPa', val: 1, from: 'atm', to: 'kpa' },
      { label: '100 kPa → bar', val: 100, from: 'kpa', to: 'bar' }
    ],
    defaultFrom: 'bar',
    defaultTo: 'psi',
    defaultVal: 2.2
  },
  area: {
    name: 'Area',
    icon: '📐',
    base: 'sqm',
    units: {
      sqm: { name: 'Square Meter (m²)', symbol: 'm²', factor: 1 },
      sqft: { name: 'Square Foot (ft²)', symbol: 'ft²', factor: 0.092903 },
      sqkm: { name: 'Square Kilometer (km²)', symbol: 'km²', factor: 1000000 },
      acre: { name: 'Acre (ac)', symbol: 'ac', factor: 4046.86 },
      ha: { name: 'Hectare (ha)', symbol: 'ha', factor: 10000 }
    },
    presets: [
      { label: '100 m² → ft²', val: 100, from: 'sqm', to: 'sqft' },
      { label: '1 acre → m²', val: 1, from: 'acre', to: 'sqm' },
      { label: '1,200 ft² → m²', val: 1200, from: 'sqft', to: 'sqm' },
      { label: '5 ha → acre', val: 5, from: 'ha', to: 'acre' }
    ],
    defaultFrom: 'sqm',
    defaultTo: 'sqft',
    defaultVal: 100
  }
};

export const ConvertersCalculator = {
  id: 'unit_converter',
  name: 'Unit Converter Pro',
  category: 'converters',
  icon: 'converters',
  description: 'Convert values across Length, Weight, Temperature, Area, Volume, Speed, Data, and Pressure with live comparison matrix.',

  state: {
    category: 'length',
    fromUnit: 'm',
    toUnit: 'ft',
    value: 10
  },

  render(container) {
    const isFav = Storage.isFavorite('unit_converter');

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4; border-color: rgba(6, 182, 212, 0.3);">
            ${getIcon('converters')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading">Unit Converter Pro</h1>
              <span class="badge badge-primary" style="font-size:0.7rem; font-weight:700;">LIVE MATRIX</span>
            </div>
            <p class="workspace-description">Precision real-time conversions with synchronized multi-unit breakdown table.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="unit-fav-btn" class="icon-btn ${isFav ? 'active' : ''}" title="Favorite">
            ${getIcon(isFav ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <!-- INPUT & CONFIG PANEL -->
        <div class="card calc-inputs-card">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Measurement Domain</label>
            <div class="segmented-control" id="unit-type-tabs" style="flex-wrap: wrap;">
              <button class="segment-btn active" data-cat="length">📏 Length</button>
              <button class="segment-btn" data-cat="weight">⚖️ Weight</button>
              <button class="segment-btn" data-cat="temperature">🌡️ Temp</button>
              <button class="segment-btn" data-cat="volume">🧪 Volume</button>
              <button class="segment-btn" data-cat="speed">⚡ Speed</button>
              <button class="segment-btn" data-cat="digital">💾 Data</button>
              <button class="segment-btn" data-cat="pressure">💨 Pressure</button>
              <button class="segment-btn" data-cat="area">📐 Area</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="unit-val">Input Value</label>
            <input type="number" id="unit-val" class="input-field" value="${this.state.value}" step="any" style="font-size:1.2rem; font-weight:700; font-family:var(--font-mono);">
          </div>

          <div style="display:grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: end;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="unit-from-select">From Unit</label>
              <select id="unit-from-select" class="input-field select-field" style="font-weight:600;"></select>
            </div>

            <button id="unit-swap-btn" class="icon-btn" style="margin-bottom: 2px; width:38px; height:38px; border-radius:var(--radius-md);" title="Swap units">
              ${getIcon('repeat')}
            </button>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="unit-to-select">To Unit</label>
              <select id="unit-to-select" class="input-field select-field" style="font-weight:600;"></select>
            </div>
          </div>

          <!-- Quick Presets -->
          <div style="margin-top: 1rem;">
            <label class="form-label" style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Popular Conversions</label>
            <div id="unit-presets-container" style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-top:4px;"></div>
          </div>

          <div class="calc-action-buttons" style="margin-top: 1.25rem;">
            <button id="unit-calc-btn" class="btn btn-primary" style="flex:1;">Convert & Save</button>
            <button id="unit-reset-btn" class="btn btn-secondary">Reset</button>
          </div>
        </div>

        <!-- RESULT & MULTI-UNIT MATRIX PANEL -->
        <div class="calc-result-card">
          <div class="result-header">
            <span class="result-label">Converted Measurement</span>
            <button id="unit-copy-btn" class="btn btn-subtle btn-sm" title="Copy result">
              ${getIcon('copy')} Copy
            </button>
          </div>

          <div>
            <div class="result-main-value" id="unit-result-val">32.808 ft</div>
            <div class="result-sub-value" id="unit-sub-val">10 m = 32.8084 ft</div>
          </div>

          <div class="breakdown-grid">
            <div class="breakdown-item">
              <div class="breakdown-item-label">Unit Multiplier</div>
              <div class="breakdown-item-value" id="unit-multiplier">1 m = 3.2808 ft</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-item-label">Inverse Rate</div>
              <div class="breakdown-item-value" id="unit-inverse">1 ft = 0.3048 m</div>
            </div>
          </div>

          <!-- Synchronized Multi-Unit Comparison Table -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.4rem;">
              <span class="result-label">All Units in This Domain</span>
              <span class="badge badge-subtle" style="font-size:0.65rem;" id="unit-count-badge">8 Units</span>
            </div>
            <div class="converter-table-container">
              <div class="converter-table-header">
                <span>Unit</span>
                <span style="text-align:right;">Converted Value</span>
              </div>
              <div id="unit-matrix-rows"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.populateSelects();
    this.renderPresets();
    this.calculate();
  },

  populateSelects() {
    const catData = CONVERSION_DATA[this.state.category];
    const fromSelect = document.getElementById('unit-from-select');
    const toSelect = document.getElementById('unit-to-select');
    if (!fromSelect || !toSelect) return;

    let optionsHtml = '';
    for (const [key, u] of Object.entries(catData.units)) {
      optionsHtml += `<option value="${key}">${u.name}</option>`;
    }

    fromSelect.innerHTML = optionsHtml;
    toSelect.innerHTML = optionsHtml;

    fromSelect.value = catData.defaultFrom;
    toSelect.value = catData.defaultTo;
  },

  renderPresets() {
    const catData = CONVERSION_DATA[this.state.category];
    const presetsContainer = document.getElementById('unit-presets-container');
    if (!presetsContainer || !catData.presets) return;

    presetsContainer.innerHTML = catData.presets.map((p, idx) => `
      <button class="filter-chip-btn unit-preset-btn" data-idx="${idx}" style="font-size:0.75rem; padding: 3px 8px;">
        ${p.label}
      </button>
    `).join('');

    presetsContainer.querySelectorAll('.unit-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = catData.presets[parseInt(btn.dataset.idx)];
        if (p) {
          const valEl = document.getElementById('unit-val');
          const fromEl = document.getElementById('unit-from-select');
          const toEl = document.getElementById('unit-to-select');
          if (valEl) valEl.value = p.val;
          if (fromEl) fromEl.value = p.from;
          if (toEl) toEl.value = p.to;
          this.calculate();
        }
      });
    });
  },

  bindEvents(container) {
    const catTabs = container.querySelectorAll('#unit-type-tabs .segment-btn');
    catTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        catTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.category = btn.dataset.cat;
        this.populateSelects();
        this.renderPresets();
        this.calculate();
      });
    });

    const valInput = container.querySelector('#unit-val');
    const fromSelect = container.querySelector('#unit-from-select');
    const toSelect = container.querySelector('#unit-to-select');

    valInput?.addEventListener('input', () => this.calculate());
    fromSelect?.addEventListener('change', () => this.calculate());
    toSelect?.addEventListener('change', () => this.calculate());

    container.querySelector('#unit-swap-btn')?.addEventListener('click', () => {
      const temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
      this.calculate();
    });

    container.querySelector('#unit-calc-btn')?.addEventListener('click', () => {
      this.calculate(true);
      Toast.success('Conversion saved to history');
    });

    container.querySelector('#unit-reset-btn')?.addEventListener('click', () => {
      if (valInput) valInput.value = CONVERSION_DATA[this.state.category].defaultVal;
      this.calculate();
    });

    container.querySelector('#unit-copy-btn')?.addEventListener('click', () => {
      const val = container.querySelector('#unit-result-val')?.textContent || '';
      navigator.clipboard.writeText(val).then(() => {
        Toast.success(`Copied "${val}" to clipboard`);
      });
    });

    const favBtn = container.querySelector('#unit-fav-btn');
    favBtn?.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('unit_converter');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });
  },

  calculate(logHistory = false) {
    const cat = this.state.category;
    const catData = CONVERSION_DATA[cat];
    const val = parseFloat(document.getElementById('unit-val')?.value) || 0;
    const from = document.getElementById('unit-from-select')?.value || catData.defaultFrom;
    const to = document.getElementById('unit-to-select')?.value || catData.defaultTo;

    const convertValue = (num, srcUnit, destUnit) => {
      if (cat === 'temperature') {
        if (srcUnit === destUnit) return num;
        if (srcUnit === 'c' && destUnit === 'f') return (num * 9 / 5) + 32;
        if (srcUnit === 'c' && destUnit === 'k') return num + 273.15;
        if (srcUnit === 'f' && destUnit === 'c') return (num - 32) * 5 / 9;
        if (srcUnit === 'f' && destUnit === 'k') return ((num - 32) * 5 / 9) + 273.15;
        if (srcUnit === 'k' && destUnit === 'c') return num - 273.15;
        if (srcUnit === 'k' && destUnit === 'f') return ((num - 273.15) * 9 / 5) + 32;
        return num;
      } else {
        const factorFrom = catData.units[srcUnit]?.factor || 1;
        const factorTo = catData.units[destUnit]?.factor || 1;
        return (num * factorFrom) / factorTo;
      }
    };

    const converted = convertValue(val, from, to);

    const formatNum = (n) => {
      if (Math.abs(n) >= 1000000 || (Math.abs(n) < 0.0001 && n !== 0)) {
        return n.toExponential(4);
      }
      return parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 6 });
    };

    const resValEl = document.getElementById('unit-result-val');
    const subValEl = document.getElementById('unit-sub-val');
    const multEl = document.getElementById('unit-multiplier');
    const invEl = document.getElementById('unit-inverse');
    const matrixEl = document.getElementById('unit-matrix-rows');
    const countBadgeEl = document.getElementById('unit-count-badge');

    const toSymbol = catData.units[to]?.symbol || to;
    const fromSymbol = catData.units[from]?.symbol || from;

    if (resValEl) resValEl.textContent = `${formatNum(converted)} ${toSymbol}`;
    if (subValEl) subValEl.textContent = `${formatNum(val)} ${fromSymbol} = ${formatNum(converted)} ${toSymbol}`;

    if (cat !== 'temperature') {
      const factorFrom = catData.units[from]?.factor || 1;
      const factorTo = catData.units[to]?.factor || 1;
      const rate1 = factorFrom / factorTo;
      const rate2 = factorTo / factorFrom;
      if (multEl) multEl.textContent = `1 ${fromSymbol} = ${formatNum(rate1)} ${toSymbol}`;
      if (invEl) invEl.textContent = `1 ${toSymbol} = ${formatNum(rate2)} ${fromSymbol}`;
    } else {
      if (multEl) multEl.textContent = `${from.toUpperCase()} Scale`;
      if (invEl) invEl.textContent = `${to.toUpperCase()} Scale`;
    }

    // Render Matrix rows for all units
    if (matrixEl) {
      const unitsList = Object.entries(catData.units);
      if (countBadgeEl) countBadgeEl.textContent = `${unitsList.length} Units`;

      matrixEl.innerHTML = unitsList.map(([uKey, uData]) => {
        const rowVal = convertValue(val, from, uKey);
        const isSelected = uKey === to;

        return `
          <div class="converter-table-row ${isSelected ? 'active-row' : ''}">
            <div style="display:flex; align-items:center; gap:6px;">
              <strong>${uData.symbol || uKey}</strong>
              <span style="color:var(--text-muted); font-size:0.75rem;">${uData.name}</span>
            </div>
            <div style="text-align:right; font-family:var(--font-mono); font-weight:700;">
              ${formatNum(rowVal)} ${uData.symbol || uKey}
            </div>
          </div>
        `;
      }).join('');
    }

    if (logHistory) {
      Storage.addHistory({
        calcId: 'unit_converter',
        calcName: 'Unit Converter Pro',
        expression: `${formatNum(val)} ${fromSymbol} → ${toSymbol}`,
        result: `${formatNum(converted)} ${toSymbol}`
      });
    }
  }
};

