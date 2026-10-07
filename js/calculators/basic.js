/**
 * CALQIO Standard Tactile Basic Calculator Studio
 * Features real-time LCD display, tactile keypad, memory bank (MC/MR/M+/M-/MS),
 * live calculation tape, quick powers/roots, and full keyboard acceleration.
 */

import { Storage } from '../storage.js';
import { Toast } from '../toast.js';
import { getIcon } from '../icons.js';

export const BasicCalculator = {
  id: 'basic',
  name: 'Basic Calculator',
  category: 'basic_scientific',
  icon: 'basic',
  description: 'Fast, tactile arithmetic with real-time computation, memory registers, calculation tape, and keyboard acceleration.',
  
  state: {
    expression: '',
    result: '0',
    justEvaluated: false,
    memory: 0,
    hasMemory: false,
    lastAnswer: '0',
    activeTab: 'tape', // 'tape' | 'quick' | 'related'
    sessionTape: []
  },

  render(container) {
    this.state.expression = '';
    this.state.result = '0';
    this.state.justEvaluated = false;

    // Load past history for tape
    const allHistory = Storage.getHistory() || [];
    const basicHistory = allHistory.filter(h => h.calcId === 'basic').slice(0, 15);
    this.state.sessionTape = basicHistory.map(h => ({
      expr: h.expression || h.inputs?.expression || '',
      result: h.result || '0',
      time: h.timestamp ? new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
    }));

    const isFav = Storage.isFavorite('basic');

    container.innerHTML = `
      <!-- 1. WORKSPACE BREADCRUMB & HEADER -->
      <div class="workspace-header" style="max-width: 980px; margin: 0 auto 1.5rem auto;">
        <div class="workspace-title-area">
          <div class="workspace-icon-box" style="background: rgba(99, 102, 241, 0.12); color: #6366f1;">
            ${getIcon('basic')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <h1 class="workspace-heading" style="font-size:1.5rem; margin:0;">Basic Calculator</h1>
              <span class="badge badge-primary" style="font-size:0.68rem; font-weight:700;">STUDIO</span>
              <span class="badge badge-subtle" style="font-size:0.68rem;">Tactile Keypad</span>
            </div>
            <p class="workspace-description" style="font-size:0.85rem; margin:3px 0 0 0;">
              Fast arithmetic with tactile response, active memory registers, session tape, and keyboard shortcuts.
            </p>
          </div>
        </div>
        <div class="workspace-actions">
          <button id="basic-fav-btn" class="icon-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
            ${getIcon(isFav ? 'starFilled' : 'star')}
          </button>
        </div>
      </div>

      <!-- 2. STUDIO 2-COLUMN WORKSPACE -->
      <div class="basic-studio-layout" style="max-width: 980px; margin: 0 auto;">
        
        <!-- LEFT: TACTILE CALCULATOR CONSOLE -->
        <div class="basic-console-card">
          
          <!-- LCD Console Status Rim -->
          <div class="basic-console-rim">
            <div class="basic-rim-status">
              <span class="rim-status-dot"></span>
              <span class="rim-mode-pill">STD MATH</span>
              <span class="rim-mem-indicator ${this.state.hasMemory ? 'active' : ''}" id="basic-mem-indicator">
                ${this.state.hasMemory ? `M (${this.state.memory})` : 'M: OFF'}
              </span>
            </div>
            <div class="basic-rim-actions">
              <button type="button" class="rim-action-btn" id="basic-copy-action" title="Copy Result (⌘C)">
                ${getIcon('copy')}
                <span>Copy</span>
              </button>
            </div>
          </div>

          <!-- LCD Segmented Display -->
          <div class="basic-calc-display" id="basic-display">
            <div class="basic-calc-expression" id="basic-expression">&nbsp;</div>
            <div class="basic-calc-result" id="basic-result">0</div>
          </div>

          <!-- Tactile Memory Quick Bar -->
          <div class="basic-mem-bar">
            <button type="button" class="mem-btn ${this.state.hasMemory ? '' : 'disabled'}" data-mem="MC" title="Clear Memory">MC</button>
            <button type="button" class="mem-btn ${this.state.hasMemory ? '' : 'disabled'}" data-mem="MR" title="Recall Memory">MR</button>
            <button type="button" class="mem-btn" data-mem="M+" title="Add to Memory">M+</button>
            <button type="button" class="mem-btn" data-mem="M-" title="Subtract from Memory">M−</button>
            <button type="button" class="mem-btn" data-mem="MS" title="Store in Memory">MS</button>
            <button type="button" class="mem-btn mem-btn-ans" data-mem="ANS" title="Recall Previous Result">Ans</button>
          </div>

          <!-- 5-Row Main Keypad -->
          <div class="basic-calc-keypad" id="basic-keypad">
            <!-- Row 1: Actions & Operator -->
            <button type="button" class="calc-btn calc-btn-clear" data-action="clear" title="Clear Display (Esc / C)">AC</button>
            <button type="button" class="calc-btn calc-btn-action" data-action="backspace" title="Backspace (⌫)">⌫</button>
            <button type="button" class="calc-btn calc-btn-action" data-action="percent" title="Percentage (%)">%</button>
            <button type="button" class="calc-btn calc-btn-operator" data-action="operator" data-val="/" title="Divide (/)">÷</button>

            <!-- Row 2: 7, 8, 9, Multiply -->
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="7">7</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="8">8</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="9">9</button>
            <button type="button" class="calc-btn calc-btn-operator" data-action="operator" data-val="*" title="Multiply (*)">×</button>

            <!-- Row 3: 4, 5, 6, Subtract -->
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="4">4</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="5">5</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="6">6</button>
            <button type="button" class="calc-btn calc-btn-operator" data-action="operator" data-val="-" title="Subtract (-)">−</button>

            <!-- Row 4: 1, 2, 3, Add -->
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="1">1</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="2">2</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="3">3</button>
            <button type="button" class="calc-btn calc-btn-operator" data-action="operator" data-val="+" title="Add (+)">+</button>

            <!-- Row 5: Sign flip, 0, Dot, Equals -->
            <button type="button" class="calc-btn calc-btn-action" data-action="sign" title="Negate / Sign flip (±)">±</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="digit" data-val="0">0</button>
            <button type="button" class="calc-btn calc-btn-num" data-action="dot" data-val=".">.</button>
            <button type="button" class="calc-btn calc-btn-equal" data-action="equals" title="Calculate (Enter / =)">=</button>
          </div>

          <!-- Bottom Keyboard Shortcut Guide -->
          <div class="basic-shortcuts-footer">
            <div class="shortcuts-legend">
              <span class="legend-item"><kbd>0-9</kbd> Digits</span>
              <span class="legend-item"><kbd>+ - * /</kbd> Ops</span>
              <span class="legend-item"><kbd>Enter</kbd> Solve</span>
              <span class="legend-item"><kbd>Esc</kbd> Clear</span>
              <span class="legend-item"><kbd>⌫</kbd> Del</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: COMPANION INTELLIGENCE CARD -->
        <div class="basic-companion-card">
          
          <!-- Companion Header Tabs -->
          <div class="companion-tabs-bar">
            <button type="button" class="companion-tab-btn ${this.state.activeTab === 'tape' ? 'active' : ''}" data-tab="tape">
              <span>Calculation Tape</span>
              ${this.state.sessionTape.length > 0 ? `<span class="tape-count-chip">${this.state.sessionTape.length}</span>` : ''}
            </button>
            <button type="button" class="companion-tab-btn ${this.state.activeTab === 'quick' ? 'active' : ''}" data-tab="quick">
              <span>Quick Functions</span>
            </button>
            <button type="button" class="companion-tab-btn ${this.state.activeTab === 'related' ? 'active' : ''}" data-tab="related">
              <span>Solvers</span>
            </button>
          </div>

          <!-- TAB 1: CALCULATION TAPE -->
          <div class="companion-tab-pane ${this.state.activeTab === 'tape' ? 'active' : ''}" id="pane-tape">
            <div class="tape-header">
              <span class="tape-title">Session History</span>
              ${this.state.sessionTape.length > 0 ? `
                <button type="button" class="tape-clear-btn" id="basic-clear-tape">Clear Tape</button>
              ` : ''}
            </div>

            <div class="tape-list-wrapper" id="basic-tape-list">
              ${this.renderTapeItemsHtml()}
            </div>
          </div>

          <!-- TAB 2: QUICK MATH & PERCENTAGES -->
          <div class="companion-tab-pane ${this.state.activeTab === 'quick' ? 'active' : ''}" id="pane-quick">
            <div class="quick-tools-grid">
              <div class="quick-tool-card" data-quick-func="square">
                <div class="quick-tool-header">
                  <span class="quick-tool-name">Square (x²)</span>
                  <span class="quick-tool-badge">Math</span>
                </div>
                <p class="quick-tool-desc">Multiplies the current value by itself.</p>
                <button type="button" class="quick-apply-btn">Apply x²</button>
              </div>

              <div class="quick-tool-card" data-quick-func="sqrt">
                <div class="quick-tool-header">
                  <span class="quick-tool-name">Square Root (√x)</span>
                  <span class="quick-tool-badge">Root</span>
                </div>
                <p class="quick-tool-desc">Calculates the principal square root.</p>
                <button type="button" class="quick-apply-btn">Apply √x</button>
              </div>

              <div class="quick-tool-card" data-quick-func="reciprocal">
                <div class="quick-tool-header">
                  <span class="quick-tool-name">Reciprocal (1/x)</span>
                  <span class="quick-tool-badge">Inverse</span>
                </div>
                <p class="quick-tool-desc">Divides 1 by the current display value.</p>
                <button type="button" class="quick-apply-btn">Apply 1/x</button>
              </div>

              <div class="quick-tool-card" data-quick-func="pct_ten">
                <div class="quick-tool-header">
                  <span class="quick-tool-name">10% Tip / Tax</span>
                  <span class="quick-tool-badge">Finance</span>
                </div>
                <p class="quick-tool-desc">Quickly evaluates 10% of the current total.</p>
                <button type="button" class="quick-apply-btn">Apply 10%</button>
              </div>
            </div>
          </div>

          <!-- TAB 3: RELATED SOLVERS -->
          <div class="companion-tab-pane ${this.state.activeTab === 'related' ? 'active' : ''}" id="pane-related">
            <div class="related-solvers-list">
              <a href="#/calc/scientific" class="related-solver-item">
                <span class="related-solver-icon" style="background: rgba(99, 102, 241, 0.12); color: #6366f1;">
                  ${getIcon('scientific')}
                </span>
                <div class="related-solver-info">
                  <span class="related-solver-name">Scientific Calculator Pro</span>
                  <span class="related-solver-desc">Trigonometry, Logs, Exponents & Physical Constants</span>
                </div>
                <span class="related-solver-arrow">→</span>
              </a>

              <a href="#/calc/fraction" class="related-solver-item">
                <span class="related-solver-icon" style="background: rgba(16, 185, 129, 0.12); color: #10b981;">
                  ${getIcon('math')}
                </span>
                <div class="related-solver-info">
                  <span class="related-solver-name">Fraction & Ratio Solver</span>
                  <span class="related-solver-desc">Add, subtract, multiply, and simplify mixed fractions</span>
                </div>
                <span class="related-solver-arrow">→</span>
              </a>

              <a href="#/calc/percentage" class="related-solver-item">
                <span class="related-solver-icon" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
                  ${getIcon('percent')}
                </span>
                <div class="related-solver-info">
                  <span class="related-solver-name">Percentage Calculator</span>
                  <span class="related-solver-desc">Percentage change, increase, decrease & difference</span>
                </div>
                <span class="related-solver-arrow">→</span>
              </a>

              <a href="#/calc/unit_converter" class="related-solver-item">
                <span class="related-solver-icon" style="background: rgba(6, 182, 212, 0.12); color: #06b6d4;">
                  ${getIcon('converters')}
                </span>
                <div class="related-solver-info">
                  <span class="related-solver-name">Unit Converter</span>
                  <span class="related-solver-desc">Length, Weight, Speed, Temperature, Volume & Area</span>
                </div>
                <span class="related-solver-arrow">→</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    `;

    this.bindEvents(container);
  },

  renderTapeItemsHtml() {
    if (!this.state.sessionTape || this.state.sessionTape.length === 0) {
      return `
        <div class="tape-empty-state">
          <div class="tape-empty-icon">${getIcon('history')}</div>
          <p class="tape-empty-text">No calculations yet</p>
          <span class="tape-empty-sub">Calculations will appear here in real time.</span>
        </div>
      `;
    }

    return this.state.sessionTape.map((item, idx) => `
      <div class="tape-item" data-tape-index="${idx}">
        <div class="tape-item-meta">
          <span class="tape-item-time">${item.time}</span>
          <button type="button" class="tape-item-action tape-recall-btn" title="Load into display">Recall</button>
        </div>
        <div class="tape-item-expr">${item.expr || ' '}</div>
        <div class="tape-item-result">= ${item.result}</div>
      </div>
    `).join('');
  },

  bindEvents(container) {
    const keypad = container.querySelector('#basic-keypad');
    const copyBtn = container.querySelector('#basic-copy-action');
    const favBtn = container.querySelector('#basic-fav-btn');
    const memBar = container.querySelector('.basic-mem-bar');
    const companionTabs = container.querySelectorAll('.companion-tab-btn');
    const clearTapeBtn = container.querySelector('#basic-clear-tape');

    // Keypad Clicks
    if (keypad) {
      keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('.calc-btn');
        if (!btn) return;
        this.handleButtonPress(btn);
      });
    }

    // Memory Bar Clicks
    if (memBar) {
      memBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.mem-btn');
        if (!btn) return;
        const memAction = btn.dataset.mem;
        this.handleMemoryAction(memAction);
      });
    }

    // Copy Result Button
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const val = this.state.result;
        navigator.clipboard.writeText(val).then(() => {
          Toast.success(`Copied "${val}" to clipboard`);
        });
      });
    }

    // Favorite Button
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const isAdded = Storage.toggleFavorite('basic');
        favBtn.classList.toggle('active', isAdded);
        favBtn.innerHTML = getIcon(isAdded ? 'starFilled' : 'star');
        Toast.info(isAdded ? 'Added to favorites' : 'Removed from favorites');
      });
    }

    // Companion Tabs Switching
    companionTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        this.state.activeTab = target;
        companionTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
        container.querySelectorAll('.companion-tab-pane').forEach(p => {
          p.classList.toggle('active', p.id === `pane-${target}`);
        });
      });
    });

    // Clear Tape
    if (clearTapeBtn) {
      clearTapeBtn.addEventListener('click', () => {
        this.state.sessionTape = [];
        const tapeList = container.querySelector('#basic-tape-list');
        if (tapeList) tapeList.innerHTML = this.renderTapeItemsHtml();
        Toast.info('Calculation tape cleared');
      });
    }

    // Tape Item Recall Click
    const tapeList = container.querySelector('#basic-tape-list');
    if (tapeList) {
      tapeList.addEventListener('click', (e) => {
        const tapeItem = e.target.closest('.tape-item');
        if (!tapeItem) return;
        const idx = parseInt(tapeItem.dataset.tapeIndex, 10);
        const item = this.state.sessionTape[idx];
        if (item) {
          this.state.expression = item.result;
          this.state.result = item.result;
          this.state.justEvaluated = true;
          this.updateDisplay();
          Toast.info(`Recalled ${item.result}`);
        }
      });
    }

    // Quick Tools Click
    const quickGrid = container.querySelector('.quick-tools-grid');
    if (quickGrid) {
      quickGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.quick-tool-card');
        if (!card) return;
        const func = card.dataset.quickFunc;
        this.applyQuickFunction(func);
      });
    }

    // Keyboard interaction listener
    this.keyHandler = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      
      const key = e.key;
      let handled = true;

      if (/^[0-9]$/.test(key)) {
        this.inputDigit(key);
      } else if (key === '.') {
        this.inputDot();
      } else if (['+', '-', '*', '/'].includes(key)) {
        this.inputOperator(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        this.evaluate();
      } else if (key === 'Backspace') {
        this.backspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        this.clear();
      } else if (key === '%') {
        this.inputPercent();
      } else {
        handled = false;
      }

      if (handled) {
        this.animateKey(key);
      }
    };

    window.removeEventListener('keydown', this._activeKeyHandler);
    this._activeKeyHandler = this.keyHandler;
    window.addEventListener('keydown', this.keyHandler);
  },

  destroy() {
    if (this._activeKeyHandler) {
      window.removeEventListener('keydown', this._activeKeyHandler);
      this._activeKeyHandler = null;
    }
  },

  animateKey(key) {
    const keypad = document.getElementById('basic-keypad');
    if (!keypad) return;
    let sel = '';
    if (/^[0-9]$/.test(key)) sel = `[data-val="${key}"]`;
    else if (key === '.') sel = `[data-action="dot"]`;
    else if (['+', '-', '*', '/'].includes(key)) sel = `[data-val="${key}"]`;
    else if (key === 'Enter' || key === '=') sel = `[data-action="equals"]`;
    else if (key === 'Backspace') sel = `[data-action="backspace"]`;
    else if (key === 'Escape' || key.toLowerCase() === 'c') sel = `[data-action="clear"]`;

    if (sel) {
      const btn = keypad.querySelector(sel);
      if (btn) {
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 120);
      }
    }
  },

  handleButtonPress(btn) {
    const action = btn.dataset.action;
    const val = btn.dataset.val;

    switch (action) {
      case 'digit': this.inputDigit(val); break;
      case 'dot': this.inputDot(); break;
      case 'operator': this.inputOperator(val); break;
      case 'equals': this.evaluate(); break;
      case 'clear': this.clear(); break;
      case 'backspace': this.backspace(); break;
      case 'percent': this.inputPercent(); break;
      case 'sign': this.toggleSign(); break;
    }
  },

  handleMemoryAction(action) {
    const currentNum = parseFloat(this.state.result) || 0;

    switch (action) {
      case 'MC':
        this.state.memory = 0;
        this.state.hasMemory = false;
        Toast.info('Memory Cleared');
        break;
      case 'MR':
        if (this.state.hasMemory) {
          this.state.expression = this.state.memory.toString();
          this.state.result = this.state.memory.toString();
          this.state.justEvaluated = true;
          Toast.info(`Recalled Memory: ${this.state.memory}`);
        }
        break;
      case 'M+':
        this.state.memory += currentNum;
        this.state.hasMemory = true;
        Toast.success(`Added ${currentNum} to Memory`);
        break;
      case 'M-':
        this.state.memory -= currentNum;
        this.state.hasMemory = true;
        Toast.success(`Subtracted ${currentNum} from Memory`);
        break;
      case 'MS':
        this.state.memory = currentNum;
        this.state.hasMemory = true;
        Toast.success(`Stored ${currentNum} in Memory`);
        break;
      case 'ANS':
        if (this.state.lastAnswer !== undefined) {
          this.inputDigit(this.state.lastAnswer.toString());
          Toast.info(`Recalled Ans: ${this.state.lastAnswer}`);
        }
        break;
    }

    this.updateMemoryDisplay();
    this.updateDisplay();
  },

  applyQuickFunction(func) {
    const val = parseFloat(this.state.result) || 0;
    let res = 0;
    let exprStr = '';

    switch (func) {
      case 'square':
        res = val * val;
        exprStr = `sqr(${val})`;
        break;
      case 'sqrt':
        if (val < 0) {
          Toast.error('Cannot calculate square root of a negative number');
          return;
        }
        res = Math.sqrt(val);
        exprStr = `√(${val})`;
        break;
      case 'reciprocal':
        if (val === 0) {
          Toast.error('Cannot divide by zero');
          return;
        }
        res = 1 / val;
        exprStr = `1/(${val})`;
        break;
      case 'pct_ten':
        res = val * 0.1;
        exprStr = `10% of ${val}`;
        break;
    }

    const formatted = parseFloat(res.toFixed(8)).toString();
    this.state.expression = exprStr;
    this.state.result = formatted;
    this.state.justEvaluated = true;
    this.state.lastAnswer = formatted;

    this.addToTape(exprStr, formatted);
    this.updateDisplay();
    Toast.success(`${exprStr} = ${formatted}`);
  },

  toggleSign() {
    if (!this.state.expression) {
      this.state.expression = '-';
      this.updateDisplay();
      return;
    }

    if (this.state.justEvaluated) {
      const val = parseFloat(this.state.result);
      if (!isNaN(val)) {
        const negated = (-val).toString();
        this.state.expression = negated;
        this.state.result = negated;
        this.updateDisplay();
      }
      return;
    }

    // Toggle sign on last number segment
    const match = this.state.expression.match(/([+\-*/])?([0-9.]+)$/);
    if (match) {
      const op = match[1] || '';
      const num = match[2];
      const start = this.state.expression.slice(0, match.index);
      if (op === '+') {
        this.state.expression = start + '-' + num;
      } else if (op === '-') {
        this.state.expression = start + '+' + num;
      } else if (!op) {
        this.state.expression = (parseFloat(num) * -1).toString();
      } else {
        this.state.expression = start + op + '(-' + num + ')';
      }
    } else {
      this.state.expression = '-' + this.state.expression;
    }
    this.updateDisplay();
  },

  inputDigit(digit) {
    if (this.state.justEvaluated) {
      this.state.expression = '';
      this.state.result = '0';
      this.state.justEvaluated = false;
    }

    if (this.state.expression === '0' && digit !== '.') {
      this.state.expression = digit;
    } else {
      this.state.expression += digit;
    }
    this.updateDisplay();
  },

  inputDot() {
    if (this.state.justEvaluated) {
      this.state.expression = '0.';
      this.state.justEvaluated = false;
      this.updateDisplay();
      return;
    }

    const segments = this.state.expression.split(/[\+\-\*\/]/);
    const lastSeg = segments[segments.length - 1];
    if (!lastSeg.includes('.')) {
      if (!this.state.expression || /[\+\-\*\/]$/.test(this.state.expression)) {
        this.state.expression += '0.';
      } else {
        this.state.expression += '.';
      }
      this.updateDisplay();
    }
  },

  inputOperator(op) {
    if (this.state.justEvaluated) {
      if (this.state.result !== 'Cannot divide by 0' && this.state.result !== 'Error') {
        this.state.expression = this.state.result;
      } else {
        this.state.expression = '';
      }
      this.state.justEvaluated = false;
    }

    if (!this.state.expression) {
      if (op === '-') {
        this.state.expression = '-';
        this.updateDisplay();
      }
      return;
    }

    if (/[\+\-\*\/]$/.test(this.state.expression)) {
      this.state.expression = this.state.expression.slice(0, -1) + op;
    } else {
      this.state.expression += op;
    }
    this.updateDisplay();
  },

  inputPercent() {
    if (!this.state.expression) return;
    try {
      const sanitized = this.state.expression.replace(/×/g, '*').replace(/÷/g, '/');
      const val = Function(`'use strict'; return (${sanitized})`)();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        const pct = parseFloat((val / 100).toFixed(8)).toString();
        this.state.expression = pct;
        this.state.result = pct;
        this.updateDisplay();
      }
    } catch (e) {}
  },

  backspace() {
    if (this.state.justEvaluated) {
      this.clear();
      return;
    }
    this.state.expression = this.state.expression.slice(0, -1);
    this.updateDisplay();
  },

  clear() {
    this.state.expression = '';
    this.state.result = '0';
    this.state.justEvaluated = false;
    this.updateDisplay();
  },

  evaluate() {
    if (!this.state.expression) return;

    let expr = this.state.expression;
    if (/[\+\-\*\/]$/.test(expr)) {
      expr = expr.slice(0, -1);
    }

    // Check division by zero
    if (/\/0(?![0-9\.])/.test(expr)) {
      this.state.result = 'Cannot divide by 0';
      this.state.justEvaluated = true;
      this.updateDisplay();
      return;
    }

    try {
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      const evaluated = Function(`'use strict'; return (${sanitized})`)();
      
      let formattedResult;
      if (typeof evaluated === 'number' && !isNaN(evaluated) && isFinite(evaluated)) {
        formattedResult = parseFloat(evaluated.toFixed(10)).toString();
      } else {
        formattedResult = 'Error';
      }

      this.state.result = formattedResult;
      this.state.lastAnswer = formattedResult;
      this.state.justEvaluated = true;
      this.updateDisplay();

      // Add to History & Tape
      if (formattedResult !== 'Error' && formattedResult !== 'Cannot divide by 0') {
        const prettyExpr = expr.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ').replace(/\+/g, ' + ').replace(/\-/g, ' − ');
        
        Storage.addHistory({
          calcId: 'basic',
          calcName: 'Basic Calculator',
          expression: prettyExpr,
          result: formattedResult,
          inputs: { expression: expr }
        });

        this.addToTape(prettyExpr, formattedResult);
      }
    } catch (err) {
      this.state.result = 'Error';
      this.updateDisplay();
    }
  },

  addToTape(expr, result) {
    const newItem = {
      expr,
      result,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.state.sessionTape.unshift(newItem);
    if (this.state.sessionTape.length > 25) {
      this.state.sessionTape.pop();
    }

    const tapeList = document.getElementById('basic-tape-list');
    if (tapeList) {
      tapeList.innerHTML = this.renderTapeItemsHtml();
    }
  },

  updateMemoryDisplay() {
    const memInd = document.getElementById('basic-mem-indicator');
    if (memInd) {
      memInd.classList.toggle('active', this.state.hasMemory);
      memInd.textContent = this.state.hasMemory ? `M (${this.state.memory})` : 'M: OFF';
    }

    const memBtns = document.querySelectorAll('.mem-btn[data-mem="MC"], .mem-btn[data-mem="MR"]');
    memBtns.forEach(btn => btn.classList.toggle('disabled', !this.state.hasMemory));
  },

  updateDisplay() {
    const exprEl = document.getElementById('basic-expression');
    const resEl = document.getElementById('basic-result');
    if (!exprEl || !resEl) return;

    const formattedExpr = this.state.expression
      .replace(/\*/g, ' × ')
      .replace(/\//g, ' ÷ ')
      .replace(/\+/g, ' + ')
      .replace(/\-/g, ' − ');

    exprEl.textContent = formattedExpr || ' ';
    resEl.textContent = this.state.result || '0';
  }
};

