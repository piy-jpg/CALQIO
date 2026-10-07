/**
 * CALQIO Pro Scientific Calculator
 * Clean, structured, beautifully proportioned engineering computation console.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const ScientificCalculator = {
  id: 'scientific',
  name: 'Scientific Calculator Pro',
  category: 'basic_scientific',
  icon: 'scientific',
  description: 'Pro-grade engineering calculator: Trigonometric, Hyperbolic, Powers, Logs, Memory, and Physical Constants.',

  state: {
    expression: '',
    result: '0',
    angleUnit: 'deg', // 'deg' | 'rad' | 'grad'
    isSecond: false,  // 2nd shift mode
    isHyp: false,     // Hyperbolic mode
    notation: 'std',  // 'std' | 'sci' | 'eng'
    activeTab: 'constants', // 'constants' | 'tape' | 'formulas'
    memory: 0,
    hasMemory: false,
    justEvaluated: false,
    history: []
  },

  constants: [
    { cat: 'Fundamental', symbol: 'π', name: 'Pi', value: Math.PI, desc: 'Ratio of circle circumference to diameter' },
    { cat: 'Fundamental', symbol: 'e', name: 'Euler’s Number', value: Math.E, desc: 'Base of natural logarithms' },
    { cat: 'Quantum & EM', symbol: 'c', name: 'Speed of Light', value: 299792458, unit: 'm/s', desc: 'Speed of light in vacuum' },
    { cat: 'Quantum & EM', symbol: 'h', name: 'Planck Constant', value: 6.62607015e-34, unit: 'J·s', desc: 'Quantum of action' },
    { cat: 'Quantum & EM', symbol: 'q_e', name: 'Elementary Charge', value: 1.602176634e-19, unit: 'C', desc: 'Charge of a proton' },
    { cat: 'Quantum & EM', symbol: 'm_e', name: 'Electron Mass', value: 9.1093837015e-31, unit: 'kg', desc: 'Rest mass of an electron' },
    { cat: 'Gravitation', symbol: 'G', name: 'Gravitational Const', value: 6.67430e-11, unit: 'N·m²/kg²', desc: 'Universal gravitational constant' },
    { cat: 'Gravitation', symbol: 'g', name: 'Standard Gravity', value: 9.80665, unit: 'm/s²', desc: 'Earth surface gravity acceleration' },
    { cat: 'Thermodynamics', symbol: 'k_B', name: 'Boltzmann Constant', value: 1.380649e-23, unit: 'J/K', desc: 'Relates temperature to energy' },
    { cat: 'Thermodynamics', symbol: 'N_A', name: 'Avogadro Constant', value: 6.02214076e23, unit: 'mol⁻¹', desc: 'Particles per mole' },
    { cat: 'Thermodynamics', symbol: 'R', name: 'Ideal Gas Constant', value: 8.314462618, unit: 'J/(mol·K)', desc: 'Molar universal gas constant' }
  ],

  formulas: [
    { name: 'Euler’s Identity', formula: 'e^(iπ) + 1 = 0' },
    { name: 'Pythagorean Identity', formula: 'sin²(θ) + cos²(θ) = 1' },
    { name: 'Tangent Ratio', formula: 'tan(θ) = sin(θ) ÷ cos(θ)' },
    { name: 'Double Angle Sine', formula: 'sin(2θ) = 2 sin(θ) cos(θ)' },
    { name: 'Double Angle Cosine', formula: 'cos(2θ) = cos²(θ) − sin²(θ)' },
    { name: 'Product of Logs', formula: 'log(a × b) = log(a) + log(b)' },
    { name: 'Quotient of Logs', formula: 'log(a ÷ b) = log(a) − log(b)' },
    { name: 'Power of Logs', formula: 'log(a^b) = b × log(a)' }
  ],

  render(container) {
    this.state.expression = '';
    this.state.result = '0';
    this.state.justEvaluated = false;

    const isFav = Storage.isFavorite('scientific');

    container.innerHTML = `
      <!-- 1. WORKSPACE HEADER -->
      <div class="workspace-header" style="max-width: 960px; margin: 0 auto 1.25rem auto;">
        <div class="workspace-title-area">
          <div class="workspace-icon-box">🔬</div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="workspace-heading" style="font-size:1.5rem; margin:0;">Scientific Calculator</h1>
              <span class="badge badge-primary" style="font-size:0.7rem; font-weight:700;">PRO</span>
            </div>
            <p class="workspace-description" style="font-size:0.85rem; margin:2px 0 0 0;">Engineering & scientific precision with 2nd shift, memory bank, and physics constants.</p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="sci-fav-btn" class="icon-btn ${isFav ? 'active' : ''}" title="Favorite">
            ${getIcon(isFav ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <!-- 2. PRO CENTERED STRUCTURED WRAPPER -->
      <div class="pro-sci-wrapper" style="max-width: 960px;">
        
        <!-- LEFT: SCIENTIFIC CONSOLE -->
        <div class="pro-sci-console">
          
          <!-- TOP CONTROLS & STATUS -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap;">
            
            <div style="display:flex; align-items:center; gap:5px;">
              <div class="segmented-control" id="sci-angle-tabs" style="width: 165px; height: 32px;">
                <button class="segment-btn ${this.state.angleUnit === 'deg' ? 'active' : ''}" data-unit="deg" style="font-size:0.75rem; padding: 2px 6px;">DEG</button>
                <button class="segment-btn ${this.state.angleUnit === 'rad' ? 'active' : ''}" data-unit="rad" style="font-size:0.75rem; padding: 2px 6px;">RAD</button>
                <button class="segment-btn ${this.state.angleUnit === 'grad' ? 'active' : ''}" data-unit="grad" style="font-size:0.75rem; padding: 2px 6px;">GRAD</button>
              </div>

              <button class="btn btn-sm ${this.state.isSecond ? 'btn-primary' : 'btn-outline'}" id="sci-2nd-btn" style="height:32px; padding: 0 10px; font-size: 0.75rem; font-weight: 700;" title="Shift: Inverses & Higher Powers">
                2nd
              </button>

              <button class="btn btn-sm ${this.state.isHyp ? 'btn-primary' : 'btn-outline'}" id="sci-hyp-btn" style="height:32px; padding: 0 10px; font-size: 0.75rem; font-weight: 700;" title="Hyperbolic Functions">
                hyp
              </button>
            </div>

            <div style="display:flex; align-items:center; gap:6px;">
              <button class="btn btn-sm btn-subtle" id="sci-notation-btn" style="height:32px; font-size:0.75rem; padding: 0 8px; border: 1px solid var(--border-subtle);" title="Toggle Notation">
                <span id="sci-notation-label">F-E: Standard</span>
              </button>
              <div id="sci-memory-indicator" class="badge badge-primary" style="height:28px; font-size:0.7rem; display:${this.state.hasMemory ? 'inline-flex' : 'none'}; align-items:center;">
                M = ${this.state.memory}
              </div>
            </div>
          </div>

          <!-- LCD DISPLAY -->
          <div class="pro-sci-display">
            <div class="pro-sci-display-top">
              <span id="sci-bracket-count" style="color:var(--accent-primary); font-weight:600;"></span>
              <div class="pro-sci-expr" id="sci-expression">&nbsp;</div>
            </div>
            <div class="pro-sci-res" id="sci-result">0</div>
          </div>

          <!-- MEMORY TOOLBAR -->
          <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap: 0.35rem; background:var(--bg-subtle); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <button class="btn btn-sm btn-subtle sci-mem-btn" data-mem="MC" style="font-size:0.75rem; padding:4px 0; font-weight:600;">MC</button>
            <button class="btn btn-sm btn-subtle sci-mem-btn" data-mem="MR" style="font-size:0.75rem; padding:4px 0; font-weight:600;">MR</button>
            <button class="btn btn-sm btn-subtle sci-mem-btn" data-mem="M+" style="font-size:0.75rem; padding:4px 0; font-weight:600;">M+</button>
            <button class="btn btn-sm btn-subtle sci-mem-btn" data-mem="M-" style="font-size:0.75rem; padding:4px 0; font-weight:600;">M−</button>
            <button class="btn btn-sm btn-subtle sci-mem-btn" data-mem="MS" style="font-size:0.75rem; padding:4px 0; font-weight:600;">MS</button>
            <button class="btn btn-sm btn-subtle sci-mem-btn" data-mem="CLEAR_ALL" style="font-size:0.75rem; padding:4px 0; color:var(--accent-danger); font-weight:700;">Reset</button>
          </div>

          <!-- 6-COLUMN PROFESSIONAL KEYPAD MATRIX -->
          <div class="pro-sci-keypad" id="sci-keypad">
            
            <!-- ROW 1: TRIG & LOG FUNCTIONS -->
            <button class="pro-btn pro-btn-fn" data-fn="trig_sin" id="btn-sin">sin</button>
            <button class="pro-btn pro-btn-fn" data-fn="trig_cos" id="btn-cos">cos</button>
            <button class="pro-btn pro-btn-fn" data-fn="trig_tan" id="btn-tan">tan</button>
            <button class="pro-btn pro-btn-fn" data-fn="log_base" id="btn-log">log</button>
            <button class="pro-btn pro-btn-fn" data-fn="ln_base" id="btn-ln">ln</button>
            <button class="pro-btn pro-btn-clear" data-action="clear">AC</button>

            <!-- ROW 2: POWERS, ROOTS & FACTORIAL -->
            <button class="pro-btn pro-btn-fn" data-fn="pow2" id="btn-sqr">x²</button>
            <button class="pro-btn pro-btn-fn" data-fn="pow_y" id="btn-pow">xʸ</button>
            <button class="pro-btn pro-btn-fn" data-fn="sqrt_fn" id="btn-sqrt">√x</button>
            <button class="pro-btn pro-btn-fn" data-fn="exp_10" id="btn-exp10">10ˣ</button>
            <button class="pro-btn pro-btn-fn" data-fn="fact_fn">n!</button>
            <button class="pro-btn pro-btn-fn" data-action="backspace">⌫</button>

            <!-- ROW 3: UTILITIES & DIVISION -->
            <button class="pro-btn pro-btn-fn" data-fn="inv_fn">1/x</button>
            <button class="pro-btn pro-btn-fn" data-fn="abs_fn">|x|</button>
            <button class="pro-btn pro-btn-fn" data-char="(">(</button>
            <button class="pro-btn pro-btn-fn" data-char=")">)</button>
            <button class="pro-btn pro-btn-fn" data-fn="mod_fn">mod</button>
            <button class="pro-btn pro-btn-op" data-char="/">÷</button>

            <!-- ROW 4: 7, 8, 9 & MULTIPLICATION -->
            <button class="pro-btn pro-btn-fn" data-fn="pi_const" style="color:var(--accent-primary); font-weight:700;">π</button>
            <button class="pro-btn pro-btn-fn" data-fn="e_const" style="color:var(--accent-primary); font-weight:700;">e</button>
            <button class="pro-btn pro-btn-num" data-char="7">7</button>
            <button class="pro-btn pro-btn-num" data-char="8">8</button>
            <button class="pro-btn pro-btn-num" data-char="9">9</button>
            <button class="pro-btn pro-btn-op" data-char="*">×</button>

            <!-- ROW 5: 4, 5, 6 & SUBTRACTION -->
            <button class="pro-btn pro-btn-fn" data-fn="cbrt_fn" id="btn-cbrt">³√x</button>
            <button class="pro-btn pro-btn-fn" data-fn="pct_fn">%</button>
            <button class="pro-btn pro-btn-num" data-char="4">4</button>
            <button class="pro-btn pro-btn-num" data-char="5">5</button>
            <button class="pro-btn pro-btn-num" data-char="6">6</button>
            <button class="pro-btn pro-btn-op" data-char="-">−</button>

            <!-- ROW 6: 1, 2, 3 & ADDITION -->
            <button class="pro-btn pro-btn-fn" data-fn="rnd_fn" style="font-size:0.8rem;">Rand</button>
            <button class="pro-btn pro-btn-fn" data-fn="exp_sci" style="font-size:0.8rem;">EE</button>
            <button class="pro-btn pro-btn-num" data-char="1">1</button>
            <button class="pro-btn pro-btn-num" data-char="2">2</button>
            <button class="pro-btn pro-btn-num" data-char="3">3</button>
            <button class="pro-btn pro-btn-op" data-char="+">+</button>

            <!-- ROW 7: ±, 0, ., = (EVALUATE) -->
            <button class="pro-btn pro-btn-fn" data-fn="sign_fn">±</button>
            <button class="pro-btn pro-btn-num" data-char="0">0</button>
            <button class="pro-btn pro-btn-num" data-char="00">00</button>
            <button class="pro-btn pro-btn-num" data-char=".">.</button>
            <button class="pro-btn pro-btn-eval" data-action="eval" style="grid-column: span 2;">=</button>
          </div>

          <!-- FOOTER DETAILS -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">
            <span>64-bit precision math • Physical Keyboard Ready</span>
            <button id="sci-copy-btn" class="btn btn-subtle btn-sm" style="font-size: 0.75rem; padding: 2px 8px;">
              Copy Result
            </button>
          </div>
        </div>

        <!-- RIGHT: STRUCTURED UTILITIES (CONSTANTS, TAPE, FORMULAS) -->
        <div class="pro-sci-sidecard">
          
          <!-- TAB HEADER -->
          <div class="segmented-control" id="sci-utility-tabs" style="width: 100%; height: 34px;">
            <button class="segment-btn ${this.state.activeTab === 'constants' ? 'active' : ''}" data-tab="constants" style="font-size:0.75rem;">Constants</button>
            <button class="segment-btn ${this.state.activeTab === 'tape' ? 'active' : ''}" data-tab="tape" style="font-size:0.75rem;">Tape</button>
            <button class="segment-btn ${this.state.activeTab === 'formulas' ? 'active' : ''}" data-tab="formulas" style="font-size:0.75rem;">Formulas</button>
          </div>

          <!-- TAB 1: CONSTANTS -->
          <div id="sci-panel-constants" style="display:${this.state.activeTab === 'constants' ? 'flex' : 'none'}; flex-direction:column; gap:6px; flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
              <span>Click to Insert Constant</span>
              <span>11 Values</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:5px; max-height: 380px; overflow-y:auto; padding-right:2px;">
              ${this.constants.map(c => `
                <button class="btn btn-outline sci-constant-btn" data-val="${c.value}" data-sym="${c.symbol}" style="padding: 7px 10px; justify-content:space-between; font-size:0.8rem; text-align:left; border-radius: var(--radius-sm);" title="${c.desc}">
                  <div>
                    <strong>${c.symbol}</strong> <span style="color:var(--text-muted); font-size:0.75rem;">(${c.name})</span>
                    <div style="font-size:0.68rem; color:var(--text-muted);">${c.unit || c.cat}</div>
                  </div>
                  <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-primary); font-weight:600;">${c.value.toExponential ? c.value.toExponential(2) : c.value}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- TAB 2: TAPE -->
          <div id="sci-panel-tape" style="display:${this.state.activeTab === 'tape' ? 'flex' : 'none'}; flex-direction:column; gap:6px; flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
              <span>Calculation History</span>
              <button id="sci-clear-tape-btn" class="btn btn-subtle btn-sm" style="font-size:0.68rem; padding:2px 6px;">Clear</button>
            </div>
            <div id="sci-history-tape" style="display:flex; flex-direction:column; gap:5px; max-height: 380px; overflow-y:auto;">
              <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding: 30px 0;">No calculations yet</div>
            </div>
          </div>

          <!-- TAB 3: FORMULAS -->
          <div id="sci-panel-formulas" style="display:${this.state.activeTab === 'formulas' ? 'flex' : 'none'}; flex-direction:column; gap:6px; flex:1;">
            <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
              <span>Mathematical Identities</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px; max-height: 380px; overflow-y:auto;">
              ${this.formulas.map(f => `
                <div style="padding: 7px 9px; background:var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                  <div style="font-size:0.72rem; font-weight:600; color:var(--text-primary); margin-bottom:2px;">${f.name}</div>
                  <div style="font-family:var(--font-mono); font-size:0.78rem; color:var(--accent-primary);">${f.formula}</div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;

    this.bindEvents(container);
    this.updateShiftLabels();
  },

  bindEvents(container) {
    // Utility tab switching (Constants, Tape, Formulas)
    const utilityTabs = container.querySelectorAll('#sci-utility-tabs .segment-btn');
    utilityTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        utilityTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.activeTab = btn.dataset.tab;

        const pConst = container.querySelector('#sci-panel-constants');
        const pTape = container.querySelector('#sci-panel-tape');
        const pForm = container.querySelector('#sci-panel-formulas');

        if (pConst) pConst.style.display = this.state.activeTab === 'constants' ? 'flex' : 'none';
        if (pTape) pTape.style.display = this.state.activeTab === 'tape' ? 'flex' : 'none';
        if (pForm) pForm.style.display = this.state.activeTab === 'formulas' ? 'flex' : 'none';
      });
    });

    // Angle unit tabs (DEG, RAD, GRAD)
    const angleTabs = container.querySelectorAll('#sci-angle-tabs .segment-btn');
    angleTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        angleTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.angleUnit = btn.dataset.unit;
        Toast.info(`Angle mode set to ${this.state.angleUnit.toUpperCase()}`);
      });
    });

    // 2nd Shift toggle
    const secondBtn = container.querySelector('#sci-2nd-btn');
    secondBtn.addEventListener('click', () => {
      this.state.isSecond = !this.state.isSecond;
      secondBtn.classList.toggle('btn-primary', this.state.isSecond);
      secondBtn.classList.toggle('btn-outline', !this.state.isSecond);
      this.updateShiftLabels();
    });

    // Hyp toggle
    const hypBtn = container.querySelector('#sci-hyp-btn');
    hypBtn.addEventListener('click', () => {
      this.state.isHyp = !this.state.isHyp;
      hypBtn.classList.toggle('btn-primary', this.state.isHyp);
      hypBtn.classList.toggle('btn-outline', !this.state.isHyp);
      this.updateShiftLabels();
    });

    // Notation toggle
    const notBtn = container.querySelector('#sci-notation-btn');
    const notLabel = container.querySelector('#sci-notation-label');
    notBtn.addEventListener('click', () => {
      if (this.state.notation === 'std') this.state.notation = 'sci';
      else if (this.state.notation === 'sci') this.state.notation = 'eng';
      else this.state.notation = 'std';

      const labels = { std: 'F-E: Standard', sci: 'F-E: Scientific', eng: 'F-E: Engineering' };
      notLabel.textContent = labels[this.state.notation];
      this.formatAndDisplayResult();
      Toast.info(`Display: ${labels[this.state.notation]}`);
    });

    // Memory keys
    container.querySelectorAll('.sci-mem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleMemory(btn.dataset.mem);
      });
    });

    // Keypad actions
    const keypad = container.querySelector('#sci-keypad');
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.pro-btn');
      if (!btn) return;

      if (btn.dataset.char) {
        this.appendChar(btn.dataset.char);
      } else if (btn.dataset.fn) {
        this.applyFunction(btn.dataset.fn);
      } else if (btn.dataset.action === 'clear') {
        this.clear();
      } else if (btn.dataset.action === 'backspace') {
        this.backspace();
      } else if (btn.dataset.action === 'eval') {
        this.evaluate();
      }
    });

    // Physical Constants Quick-Insert
    container.querySelectorAll('.sci-constant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (this.state.justEvaluated) {
          this.state.expression = '';
          this.state.justEvaluated = false;
        }
        this.state.expression += val;
        this.updateDisplay();
        Toast.info(`Inserted constant ${btn.dataset.sym}`);
      });
    });

    // Tape clear
    const clearTapeBtn = container.querySelector('#sci-clear-tape-btn');
    if (clearTapeBtn) {
      clearTapeBtn.addEventListener('click', () => {
        this.state.history = [];
        this.updateTape();
        Toast.info('Calculation tape cleared.');
      });
    }

    // Copy Result
    container.querySelector('#sci-copy-btn').addEventListener('click', () => {
      const val = this.state.result;
      navigator.clipboard.writeText(val).then(() => {
        Toast.success(`Copied "${val}" to clipboard`);
      });
    });

    // Favorite toggle
    const favBtn = container.querySelector('#sci-fav-btn');
    favBtn.addEventListener('click', () => {
      const isFav = Storage.toggleFavorite('scientific');
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = getIcon(isFav ? 'starFilled' : 'star');
      Toast.info(isFav ? 'Added to favorites' : 'Removed from favorites');
    });

    // Global Keypad Listener for Physical Keyboard
    this.keyListener = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      if (e.key >= '0' && e.key <= '9') this.appendChar(e.key);
      else if (['+', '-', '*', '/'].includes(e.key)) this.appendChar(e.key);
      else if (e.key === '.') this.appendChar('.');
      else if (e.key === '(' || e.key === ')') this.appendChar(e.key);
      else if (e.key === '^') this.applyFunction('pow_y');
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); this.evaluate(); }
      else if (e.key === 'Backspace') { e.preventDefault(); this.backspace(); }
      else if (e.key === 'Escape') this.clear();
      else if (e.key === 'p' || e.key === 'P') this.applyFunction('pi_const');
      else if (e.key === 'e' || e.key === 'E') this.applyFunction('e_const');
    };

    window.removeEventListener('keydown', this._activeKeyHandler);
    this._activeKeyHandler = this.keyListener;
    window.addEventListener('keydown', this._activeKeyHandler);
  },

  updateShiftLabels() {
    const is2nd = this.state.isSecond;
    const isHyp = this.state.isHyp;

    const btnSin = document.getElementById('btn-sin');
    const btnCos = document.getElementById('btn-cos');
    const btnTan = document.getElementById('btn-tan');
    const btnLog = document.getElementById('btn-log');
    const btnLn = document.getElementById('btn-ln');
    const btnSqr = document.getElementById('btn-sqr');
    const btnSqrt = document.getElementById('btn-sqrt');
    const btnExp10 = document.getElementById('btn-exp10');
    const btnCbrt = document.getElementById('btn-cbrt');

    if (btnSin) btnSin.textContent = isHyp ? (is2nd ? 'asinh' : 'sinh') : (is2nd ? 'sin⁻¹' : 'sin');
    if (btnCos) btnCos.textContent = isHyp ? (is2nd ? 'acosh' : 'cosh') : (is2nd ? 'cos⁻¹' : 'cos');
    if (btnTan) btnTan.textContent = isHyp ? (is2nd ? 'atanh' : 'tanh') : (is2nd ? 'tan⁻¹' : 'tan');
    if (btnLog) btnLog.textContent = is2nd ? 'log₂' : 'log';
    if (btnLn) btnLn.textContent = is2nd ? 'eˣ' : 'ln';
    if (btnSqr) btnSqr.textContent = is2nd ? 'x³' : 'x²';
    if (btnSqrt) btnSqrt.textContent = is2nd ? 'ʸ√x' : '√x';
    if (btnExp10) btnExp10.textContent = is2nd ? '2ˣ' : '10ˣ';
    if (btnCbrt) btnCbrt.textContent = is2nd ? '³√x' : '³√x';
  },

  handleMemory(action) {
    const currentNum = parseFloat(this.state.result) || 0;

    if (action === 'MC') {
      this.state.memory = 0;
      this.state.hasMemory = false;
      Toast.info('Memory Cleared (MC)');
    } else if (action === 'MR') {
      if (this.state.justEvaluated) {
        this.state.expression = '';
        this.state.justEvaluated = false;
      }
      this.state.expression += this.state.memory.toString();
      this.updateDisplay();
      Toast.info(`Recalled Memory: ${this.state.memory}`);
    } else if (action === 'M+') {
      this.state.memory += currentNum;
      this.state.hasMemory = true;
      Toast.success(`Added to Memory: ${currentNum} (Total: ${this.state.memory})`);
    } else if (action === 'M-') {
      this.state.memory -= currentNum;
      this.state.hasMemory = true;
      Toast.info(`Subtracted from Memory: ${currentNum} (Total: ${this.state.memory})`);
    } else if (action === 'MS') {
      this.state.memory = currentNum;
      this.state.hasMemory = true;
      Toast.success(`Stored to Memory: ${currentNum}`);
    } else if (action === 'CLEAR_ALL') {
      this.clear();
      this.state.memory = 0;
      this.state.hasMemory = false;
      Toast.info('Reset All');
    }

    const memInd = document.getElementById('sci-memory-indicator');
    if (memInd) {
      memInd.style.display = this.state.hasMemory ? 'inline-flex' : 'none';
      memInd.textContent = `M = ${this.state.memory}`;
    }
  },

  appendChar(ch) {
    if (this.state.justEvaluated) {
      if (['+', '-', '*', '/', '^', '%'].includes(ch)) {
        this.state.expression = this.state.result;
      } else {
        this.state.expression = '';
      }
      this.state.justEvaluated = false;
    }
    this.state.expression += ch;
    this.updateDisplay();
  },

  applyFunction(fn) {
    if (this.state.justEvaluated) {
      this.state.expression = this.state.result;
      this.state.justEvaluated = false;
    }

    const is2nd = this.state.isSecond;
    const isHyp = this.state.isHyp;

    if (fn === 'trig_sin') {
      const f = isHyp ? (is2nd ? 'asinh' : 'sinh') : (is2nd ? 'asin' : 'sin');
      this.state.expression += `${f}(`;
    } else if (fn === 'trig_cos') {
      const f = isHyp ? (is2nd ? 'acosh' : 'cosh') : (is2nd ? 'acos' : 'cos');
      this.state.expression += `${f}(`;
    } else if (fn === 'trig_tan') {
      const f = isHyp ? (is2nd ? 'atanh' : 'tanh') : (is2nd ? 'atan' : 'tan');
      this.state.expression += `${f}(`;
    } else if (fn === 'log_base') {
      this.state.expression += is2nd ? 'log2(' : 'log(';
    } else if (fn === 'ln_base') {
      this.state.expression += is2nd ? 'exp(' : 'ln(';
    } else if (fn === 'pow2') {
      this.state.expression += is2nd ? '^3' : '^2';
    } else if (fn === 'pow_y') {
      this.state.expression += '^';
    } else if (fn === 'sqrt_fn') {
      this.state.expression += is2nd ? 'yroot(' : 'sqrt(';
    } else if (fn === 'exp_10') {
      this.state.expression += is2nd ? '2^' : '10^';
    } else if (fn === 'fact_fn') {
      this.state.expression += '!';
    } else if (fn === 'inv_fn') {
      this.state.expression += '^(-1)';
    } else if (fn === 'abs_fn') {
      this.state.expression += 'abs(';
    } else if (fn === 'mod_fn') {
      this.state.expression += '%';
    } else if (fn === 'pi_const') {
      this.state.expression += 'π';
    } else if (fn === 'e_const') {
      this.state.expression += 'e';
    } else if (fn === 'cbrt_fn') {
      this.state.expression += 'cbrt(';
    } else if (fn === 'pct_fn') {
      this.state.expression += '/100';
    } else if (fn === 'exp_sci') {
      this.state.expression += 'e+';
    } else if (fn === 'rnd_fn') {
      this.state.expression += parseFloat(Math.random().toFixed(4)).toString();
    } else if (fn === 'sign_fn') {
      if (this.state.expression.startsWith('-(') && this.state.expression.endsWith(')')) {
        this.state.expression = this.state.expression.slice(2, -1);
      } else {
        this.state.expression = `-(${this.state.expression || '0'})`;
      }
    }

    this.updateDisplay();
  },

  clear() {
    this.state.expression = '';
    this.state.result = '0';
    this.state.justEvaluated = false;
    this.updateDisplay();
  },

  backspace() {
    this.state.expression = this.state.expression.slice(0, -1);
    this.updateDisplay();
  },

  evaluate() {
    if (!this.state.expression) return;
    try {
      let rawExpr = this.state.expression;

      // Auto-close unbalanced parentheses
      const openParens = (rawExpr.match(/\(/g) || []).length;
      const closeParens = (rawExpr.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        rawExpr += ')'.repeat(openParens - closeParens);
      }

      let expr = rawExpr;
      const unit = this.state.angleUnit;

      const toRad = (angle) => {
        if (unit === 'deg') return `((${angle}) * Math.PI / 180)`;
        if (unit === 'grad') return `((${angle}) * Math.PI / 200)`;
        return `(${angle})`;
      };

      const fromRad = (rad) => {
        if (unit === 'deg') return `((${rad}) * 180 / Math.PI)`;
        if (unit === 'grad') return `((${rad}) * 200 / Math.PI)`;
        return `(${rad})`;
      };

      // Constants
      expr = expr.replace(/π/g, `${Math.PI}`).replace(/(?<![a-zA-Z0-9_])e(?![a-zA-Z0-9_])/g, `${Math.E}`);

      // Powers & roots
      expr = expr.replace(/\^([0-9\.\-]+)/g, '**$1');
      expr = expr.replace(/\^/g, '**');

      // Hyperbolic Functions
      expr = expr.replace(/sinh\(/g, 'Math.sinh(')
                 .replace(/cosh\(/g, 'Math.cosh(')
                 .replace(/tanh\(/g, 'Math.tanh(')
                 .replace(/asinh\(/g, 'Math.asinh(')
                 .replace(/acosh\(/g, 'Math.acosh(')
                 .replace(/atanh\(/g, 'Math.atanh(');

      // Trigonometric Functions
      if (unit === 'deg' || unit === 'grad') {
        expr = expr.replace(/sin\(([^)]+)\)/g, (m, g) => `Math.sin(${toRad(g)})`);
        expr = expr.replace(/cos\(([^)]+)\)/g, (m, g) => `Math.cos(${toRad(g)})`);
        expr = expr.replace(/tan\(([^)]+)\)/g, (m, g) => `Math.tan(${toRad(g)})`);

        expr = expr.replace(/asin\(([^)]+)\)/g, (m, g) => fromRad(`Math.asin(${g})`));
        expr = expr.replace(/acos\(([^)]+)\)/g, (m, g) => fromRad(`Math.acos(${g})`));
        expr = expr.replace(/atan\(([^)]+)\)/g, (m, g) => fromRad(`Math.atan(${g})`));
      } else {
        expr = expr.replace(/sin\(/g, 'Math.sin(')
                   .replace(/cos\(/g, 'Math.cos(')
                   .replace(/tan\(/g, 'Math.tan(')
                   .replace(/asin\(/g, 'Math.asin(')
                   .replace(/acos\(/g, 'Math.acos(')
                   .replace(/atan\(/g, 'Math.atan(');
      }

      // Logarithms & Roots
      expr = expr.replace(/log\(/g, 'Math.log10(')
                 .replace(/log2\(/g, 'Math.log2(')
                 .replace(/ln\(/g, 'Math.log(')
                 .replace(/exp\(/g, 'Math.exp(')
                 .replace(/sqrt\(/g, 'Math.sqrt(')
                 .replace(/cbrt\(/g, 'Math.cbrt(')
                 .replace(/abs\(/g, 'Math.abs(');

      // Factorials: n!
      expr = expr.replace(/(\d+)!/g, (m, n) => {
        let f = 1;
        const val = parseInt(n);
        if (val > 170) return Infinity;
        for (let i = 2; i <= val; i++) f *= i;
        return f;
      });

      const res = Function(`'use strict'; return (${expr})`)();
      
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        this.state.rawResult = res;
        this.state.result = parseFloat(res.toFixed(10)).toString();
      } else if (res === Infinity || res === -Infinity) {
        this.state.rawResult = res;
        this.state.result = res === Infinity ? 'Infinity' : '-Infinity';
      } else {
        this.state.rawResult = 0;
        this.state.result = 'Error';
      }

      this.formatAndDisplayResult();
      this.state.justEvaluated = true;

      if (this.state.result !== 'Error') {
        // Record to History Tape
        this.state.history.unshift({
          expr: rawExpr,
          result: this.state.result,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        if (this.state.history.length > 20) this.state.history.pop();
        this.updateTape();

        Storage.addHistory({
          calcId: 'scientific',
          calcName: 'Scientific Calculator Pro',
          expression: rawExpr,
          result: this.state.result
        });
      }
    } catch (e) {
      this.state.result = 'Error';
      this.updateDisplay();
    }
  },

  formatAndDisplayResult() {
    if (this.state.result === 'Error' || this.state.result === 'Infinity' || this.state.result === '-Infinity') {
      this.updateDisplay();
      return;
    }

    const val = this.state.rawResult !== undefined ? this.state.rawResult : parseFloat(this.state.result);
    if (isNaN(val)) {
      this.updateDisplay();
      return;
    }

    if (this.state.notation === 'sci') {
      this.state.result = val.toExponential(6);
    } else if (this.state.notation === 'eng') {
      const exp = Math.floor(Math.log10(Math.abs(val) || 1) / 3) * 3;
      const mantissa = val / Math.pow(10, exp);
      this.state.result = `${parseFloat(mantissa.toFixed(4))} × 10^${exp}`;
    } else {
      this.state.result = parseFloat(val.toFixed(10)).toString();
    }

    this.updateDisplay();
  },

  updateDisplay() {
    const exprEl = document.getElementById('sci-expression');
    const resEl = document.getElementById('sci-result');
    const bracketEl = document.getElementById('sci-bracket-count');

    if (exprEl) exprEl.textContent = this.state.expression || ' ';
    if (resEl) resEl.textContent = this.state.result || '0';

    if (bracketEl) {
      const openP = (this.state.expression.match(/\(/g) || []).length;
      const closeP = (this.state.expression.match(/\)/g) || []).length;
      const diff = openP - closeP;
      bracketEl.textContent = diff > 0 ? `Unclosed: ${diff} bracket${diff > 1 ? 's' : ''}` : '';
    }
  },

  updateTape() {
    const tapeEl = document.getElementById('sci-history-tape');
    if (!tapeEl) return;

    if (this.state.history.length === 0) {
      tapeEl.innerHTML = '<div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding: 30px 0;">No calculations yet</div>';
      return;
    }

    tapeEl.innerHTML = this.state.history.map((item, idx) => `
      <div style="padding: 7px 9px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size:0.8rem; cursor:pointer;" class="sci-tape-item" data-idx="${idx}" title="Click to recall expression">
        <div style="color:var(--text-muted); font-size:0.68rem; display:flex; justify-content:space-between; margin-bottom:2px;">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:70%; font-family:var(--font-mono);">${item.expr}</span>
          <span>${item.time}</span>
        </div>
        <div style="font-weight:700; color:var(--accent-primary); text-align:right; font-family:var(--font-mono); font-size:0.85rem;">= ${item.result}</div>
      </div>
    `).join('');

    tapeEl.querySelectorAll('.sci-tape-item').forEach(item => {
      item.addEventListener('click', () => {
        const h = this.state.history[parseInt(item.dataset.idx)];
        if (h) {
          this.state.expression = h.expr;
          this.state.result = h.result;
          this.state.justEvaluated = true;
          this.updateDisplay();
          Toast.info(`Recalled: ${h.expr}`);
        }
      });
    });
  }
};
