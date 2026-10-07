import { state } from '../state.js';
import { getIcon } from '../icons.js';
import { CALCULATORS_LIST, getCalculatorsByCategory } from '../registry.js';
import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY, getParentCategoryForDomain } from '../taxonomy.js';
import { Storage } from '../storage.js';
import { Toast } from '../toast.js';

export const Dashboard = {
  render(container) {
    const favorites = Storage.getFavorites() || [];
    const history = (Storage.getHistory() || []).slice(0, 4);
    const favCalculators = favorites.map(id => CALCULATORS_LIST.find(c => c.id === id)).filter(Boolean);

    // Dynamic counts
    const totalCount = CALCULATORS_LIST.length;
    const mathCalcs = getCalculatorsByCategory('math');
    const engCalcs = getCalculatorsByCategory('engineering');
    const finCalcs = [...getCalculatorsByCategory('finance'), ...getCalculatorsByCategory('business')];

    // Popular Curated Mathematics Calculators for Preview Section
    const mathPreviewIds = [
      'percentage',
      'fraction',
      'linear_equation',
      'quadratic_equation',
      'matrix_addition',
      'pythagorean_theorem',
      'triangle_geometry',
      'sin_cos_tan'
    ];
    const mathPreviewCalcs = mathPreviewIds.map(id => CALCULATORS_LIST.find(c => c.id === id)).filter(Boolean);

    // 6 Main Domains for the Domain Grid
    const domainCards = [
      {
        id: 'math',
        slug: 'math',
        name: 'Mathematics',
        icon: 'math',
        count: '37',
        description: 'Algebra, geometry, trigonometry, arithmetic, polynomials, matrices, vectors, and progressions.',
        popular: [
          { name: 'Quadratic', id: 'quadratic_equation' },
          { name: 'Matrix Ops', id: 'matrix_addition' },
          { name: 'Trigonometry', id: 'sin_cos_tan' }
        ]
      },
      {
        id: 'engineering',
        slug: 'engineering',
        name: 'Engineering',
        icon: 'engineering',
        count: '62',
        description: 'Electrical circuits, mechanical machines, civil structures, computer networks, and chemical flows.',
        popular: [
          { name: "Ohm's Law", id: 'ohms_law' },
          { name: 'Beam Deflection', id: 'beam_deflection_stress' },
          { name: 'Subnet CIDR', id: 'ipv4_subnet_cidr' }
        ]
      },
      {
        id: 'finance',
        slug: 'finance',
        name: 'Finance & Business',
        icon: 'finance',
        count: '16',
        description: 'Loan EMI installments, SIP investments, GST & tax regimes, profit margins, and break-even analysis.',
        popular: [
          { name: 'EMI Loan', id: 'emi' },
          { name: 'GST Tax', id: 'gst' },
          { name: 'Profit / Loss', id: 'profit_loss' }
        ]
      },
      {
        id: 'science',
        slug: 'science',
        name: 'Science & Data',
        icon: 'physics',
        count: '18',
        description: 'Kinematics motion, solution molarity, gas laws (PV=nRT), statistics, standard deviation, and base radix.',
        popular: [
          { name: 'Molarity', id: 'molarity' },
          { name: 'Kinematics', id: 'kinematics' },
          { name: 'Statistics', id: 'statistics' }
        ]
      },
      {
        id: 'health',
        slug: 'health',
        name: 'Health & Education',
        icon: 'health',
        count: '10',
        description: 'Body Mass Index (BMI), BMR/TDEE calorie deficit, CGPA/GPA converters, and academic planners.',
        popular: [
          { name: 'BMI Metric', id: 'bmi' },
          { name: 'BMR & TDEE', id: 'bmr_tdee' },
          { name: 'CGPA / GPA', id: 'cgpa' }
        ]
      },
      {
        id: 'everyday',
        slug: 'home-lifestyle',
        name: 'Everyday & Travel',
        icon: 'everyday',
        count: '15',
        description: 'Multi-unit converter (Length, Weight, Temp, Pressure), tip splitters, fuel costs, and date countdowns.',
        popular: [
          { name: 'Unit Converter', id: 'unit_converter' },
          { name: 'Age Calculator', id: 'age' },
          { name: 'Tip Split', id: 'tip_split' }
        ]
      }
    ];

    container.innerHTML = `
      <div class="dashboard-viewport">
        <!-- Ambient Visual Background Layers -->
        <div class="dashboard-ambient-bg" aria-hidden="true"></div>
        <div class="dashboard-ambient-grid" aria-hidden="true"></div>
        <div class="dashboard-ambient-glow glow-top-left" aria-hidden="true"></div>
        <div class="dashboard-ambient-glow glow-top-right" aria-hidden="true"></div>
        <div class="dashboard-ambient-glow glow-mid-center" aria-hidden="true"></div>

        <div class="main-container dashboard-content-layer">
          <!-- 1. HERO SECTION -->
          <section class="dashboard-hero">
            <div class="hero-eyebrow">
              <span class="hero-pulse-dot"></span>
              <span>CALQIO • PRECISION CALCULATION PLATFORM</span>
            </div>

            <h1 class="hero-title">Precision Solvers for <span class="hero-highlight-text">Every Domain.</span></h1>
            <p class="hero-subtitle">Engineering, mathematics, finance, science, and everyday calculations — unified in one powerful workspace.</p>

            <!-- Large Premium Search Box -->
            <div class="hero-search-box" id="hero-search-trigger">
              <span class="hero-search-icon">${getIcon('search')}</span>
              <input type="text" id="hero-search-input" class="hero-search-input" placeholder="Search 118+ calculators, formulas, or engineering tools..." readonly>
              <div class="hero-search-shortcut">
                <kbd class="kbd">⌘K</kbd>
              </div>
            </div>

            <!-- Trending Calculator Shortcuts with Colored Domain Dots -->
            <div class="hero-trending-row">
              <span class="trending-badge">TRENDING</span>
              <a href="#/calc/scientific" class="trending-link"><span class="dot dot-blue"></span>Scientific Pad</a>
              <a href="#/calc/ohms_law" class="trending-link"><span class="dot dot-blue"></span>Ohm's Law</a>
              <a href="#/calc/beam_deflection_stress" class="trending-link"><span class="dot dot-orange"></span>Beam & Civil</a>
              <a href="#/calc/emi" class="trending-link"><span class="dot dot-emerald"></span>Loan & EMI</a>
              <a href="#/calc/binary_converter" class="trending-link"><span class="dot dot-emerald"></span>Binary / Hex</a>
              <a href="#/calc/quadratic_equation" class="trending-link"><span class="dot dot-purple"></span>Quadratic</a>
              <a href="#/calc/molarity" class="trending-link"><span class="dot dot-cyan"></span>Molarity</a>
            </div>
          </section>

          <!-- 2. PLATFORM STATISTICS -->
          <section class="platform-stats-grid">
            <div class="stat-card stat-card-blue">
              <div class="stat-card-header">
                <span class="stat-label">Total Solvers</span>
                <div class="stat-icon-chip stat-chip-blue">${getIcon('calculator')}</div>
              </div>
              <div class="stat-num stat-num-blue">118+</div>
              <div class="stat-subtext">Unified precision workspace</div>
              <div class="stat-bar-track"><div class="stat-bar-fill bar-blue" style="width: 100%;"></div></div>
            </div>
            <div class="stat-card stat-card-purple">
              <div class="stat-card-header">
                <span class="stat-label">Math Solvers</span>
                <div class="stat-icon-chip stat-chip-purple">${getIcon('math')}</div>
              </div>
              <div class="stat-num stat-num-purple">37</div>
              <div class="stat-subtext">Algebra, geometry & matrices</div>
              <div class="stat-bar-track"><div class="stat-bar-fill bar-purple" style="width: 78%;"></div></div>
            </div>
            <div class="stat-card stat-card-orange">
              <div class="stat-card-header">
                <span class="stat-label">Engineering Tools</span>
                <div class="stat-icon-chip stat-chip-orange">${getIcon('engineering')}</div>
              </div>
              <div class="stat-num stat-num-orange">62</div>
              <div class="stat-subtext">10 specialized disciplines</div>
              <div class="stat-bar-track"><div class="stat-bar-fill bar-orange" style="width: 92%;"></div></div>
            </div>
            <div class="stat-card stat-card-emerald">
              <div class="stat-card-header">
                <span class="stat-label">Finance Models</span>
                <div class="stat-icon-chip stat-chip-emerald">${getIcon('finance')}</div>
              </div>
              <div class="stat-num stat-num-emerald">7</div>
              <div class="stat-subtext">Loans, taxes & investments</div>
              <div class="stat-bar-track"><div class="stat-bar-fill bar-emerald" style="width: 65%;"></div></div>
            </div>
          </section>

          <!-- 3. FEATURED CALCULATOR HERO CARD (SPLIT LAYOUT WITH INTERACTIVE CONSOLE PREVIEW) -->
          <section class="featured-calculator-card">
            <div class="featured-card-grid">
              <div class="featured-card-body">
                <div class="featured-tag">★ FEATURED WORKSPACE</div>
                <h2 class="featured-title">Scientific Calculator Pro</h2>
                <p class="featured-desc">Trigonometry, logarithms, roots, factorials, Deg/Rad modes, physical constants, and a live expression parser with memory registers.</p>
                <div class="featured-spec-tags">
                  <span class="spec-pill">AST Expression Engine</span>
                  <span class="spec-pill">Rad / Deg Angles</span>
                  <span class="spec-pill">Physical Constants</span>
                </div>
                <a href="#/calc/scientific" class="btn btn-featured" style="margin-top: 0.5rem; align-self: flex-start;">
                  <span>Launch Scientific Pad</span>
                  <span>→</span>
                </a>
              </div>

              <!-- Interactive Scientific Console Graphic Preview -->
              <div class="featured-lcd-preview">
                <div class="lcd-header">
                  <span class="lcd-mode">RAD • FIX 4</span>
                  <span class="lcd-status">LIVE EVAL</span>
                </div>
                <div class="lcd-expression">sin(π / 4) + √(256) × ln(e)</div>
                <div class="lcd-result">= 16.7071</div>
                <div class="lcd-mini-keypad">
                  <span class="lcd-key">sin</span>
                  <span class="lcd-key">cos</span>
                  <span class="lcd-key">tan</span>
                  <span class="lcd-key">ln</span>
                  <span class="lcd-key">√x</span>
                  <span class="lcd-key">xʸ</span>
                  <span class="lcd-key">π</span>
                  <span class="lcd-key">e</span>
                  <span class="lcd-key">(</span>
                  <span class="lcd-key">)</span>
                  <span class="lcd-key lcd-key-op">÷</span>
                  <span class="lcd-key lcd-key-op">×</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 4. ENGINEERING MASTERY SECTION (10 DISCIPLINES) -->
          <section class="engineering-showcase-section">
            <div class="section-header-compact">
              <div>
                <span class="section-micro-label">10 DISCIPLINES</span>
                <h2 class="section-heading">Engineering Mastery</h2>
                <p class="section-subtext">Professional calculation tools for electrical, mechanical, civil, computer, chemical, automobile, aerospace, and other engineering disciplines.</p>
              </div>
              <a href="#/category/engineering" class="btn btn-secondary btn-sm" style="font-weight: 600;">Explore Engineering →</a>
            </div>

            <!-- Engineering Discipline Chips Grid -->
            <div class="disciplines-chips-grid">
              <a href="#/calc/ohms_law" class="discipline-chip chip-electrical">
                <span class="discipline-chip-icon">${getIcon('electrical')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Electrical</span>
                  <span class="discipline-count">8 solvers</span>
                </div>
              </a>
              <a href="#/calc/torque_calc" class="discipline-chip chip-mechanical">
                <span class="discipline-chip-icon">${getIcon('engineering')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Mechanical</span>
                  <span class="discipline-count">8 solvers</span>
                </div>
              </a>
              <a href="#/calc/beam_deflection_stress" class="discipline-chip chip-civil">
                <span class="discipline-chip-icon">${getIcon('construction')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Civil</span>
                  <span class="discipline-count">7 solvers</span>
                </div>
              </a>
              <a href="#/calc/binary_converter" class="discipline-chip chip-computer">
                <span class="discipline-chip-icon">${getIcon('calculator')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Computer</span>
                  <span class="discipline-count">6 solvers</span>
                </div>
              </a>
              <a href="#/calc/molarity" class="discipline-chip chip-chemical">
                <span class="discipline-chip-icon">${getIcon('chemistry')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Chemical</span>
                  <span class="discipline-count">5 solvers</span>
                </div>
              </a>
              <a href="#/calc/engine_displacement" class="discipline-chip chip-automobile">
                <span class="discipline-chip-icon">${getIcon('car')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Automobile</span>
                  <span class="discipline-count">4 solvers</span>
                </div>
              </a>
              <a href="#/calc/mach_number_speed" class="discipline-chip chip-aerospace">
                <span class="discipline-chip-icon">${getIcon('engineering')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Aerospace</span>
                  <span class="discipline-count">3 solvers</span>
                </div>
              </a>
              <a href="#/calc/resistor_calc" class="discipline-chip chip-electronics">
                <span class="discipline-chip-icon">${getIcon('electrical')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Electronics</span>
                  <span class="discipline-count">5 solvers</span>
                </div>
              </a>
              <a href="#/calc/carbon_footprint_calc" class="discipline-chip chip-environmental">
                <span class="discipline-chip-icon">${getIcon('weather')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Environmental</span>
                  <span class="discipline-count">3 solvers</span>
                </div>
              </a>
              <a href="#/calc/oee_calculator" class="discipline-chip chip-industrial">
                <span class="discipline-chip-icon">${getIcon('engineering')}</span>
                <div class="discipline-chip-text">
                  <span class="discipline-name">Industrial</span>
                  <span class="discipline-count">4 solvers</span>
                </div>
              </a>
            </div>
          </section>

        <!-- 5. PINNED FAVORITES (IF PRESENT) -->
        ${favCalculators.length > 0 ? `
          <section class="dashboard-section">
            <div class="section-header-compact">
              <h2 class="section-heading" style="display:flex; align-items:center; gap:0.5rem;">
                <span style="color:#f59e0b;">⭐</span> Pinned Favorites
              </h2>
              <a href="#/favorites" class="btn btn-subtle btn-sm">Manage →</a>
            </div>
            <div class="cards-grid">
              ${favCalculators.slice(0, 4).map(c => this.renderCalcCard(c)).join('')}
            </div>
          </section>
        ` : ''}

        <!-- 6. RECENT ACTIVITY (IF PRESENT) -->
        ${history.length > 0 ? `
          <section class="dashboard-section">
            <div class="section-header-compact">
              <h2 class="section-heading" style="display:flex; align-items:center; gap:0.5rem;">
                <span>${getIcon('history')}</span> Recent Activity
              </h2>
              <a href="#/history" class="btn btn-subtle btn-sm">Full History →</a>
            </div>
            <div class="history-list">
              ${history.map(item => `
                <div class="history-item-card">
                  <div class="history-item-info">
                    <span class="history-item-title">${item.calcName}</span>
                    <span class="history-item-expr">${item.expression}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:1rem;">
                    <span class="history-item-result">${item.result}</span>
                    <a href="#/calc/${item.calcId}" class="btn btn-subtle btn-sm">Calculate Again</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- 7. EXPLORE CALCULATORS BY DOMAIN (COLOR-CODED DOMAINS) -->
        <section class="dashboard-section">
          <div class="section-header-compact" style="flex-direction: column; align-items: flex-start;">
            <h2 class="section-heading">Explore Calculators by Domain</h2>
            <p class="section-subtext">Browse specialized calculation tools organized across scientific and practical disciplines.</p>
          </div>

          <div class="domain-cards-grid">
            ${domainCards.map(domain => `
              <div class="domain-card" data-domain="${domain.id}">
                <div class="domain-card-header">
                  <div class="domain-card-icon">
                    ${getIcon(domain.icon)}
                  </div>
                  <span class="domain-card-badge">${domain.count} tools</span>
                </div>

                <h3 class="domain-card-title">${domain.name}</h3>
                <p class="domain-card-desc">${domain.description}</p>

                <div class="domain-popular-chips">
                  ${domain.popular.map(p => `
                    <a href="#/calc/${p.id}" class="domain-mini-chip">${p.name}</a>
                  `).join('')}
                </div>

                <div class="domain-card-footer">
                  <a href="#/category/${domain.slug}" class="domain-card-action">View all ${domain.name} →</a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 8. MATHEMATICS SUITE PREVIEW -->
        <section class="dashboard-section" style="margin-bottom: 2rem;">
          <div class="section-header-compact">
            <div>
              <h2 class="section-heading">📐 Mathematics Suite</h2>
              <p class="section-subtext">Precision algebraic, geometric, trigonometric, and arithmetic equation solvers.</p>
            </div>
            <a href="#/category/math" class="btn btn-secondary btn-sm" style="font-weight: 600;">View all Math calculators →</a>
          </div>

          <div class="cards-grid">
            ${mathPreviewCalcs.map(c => this.renderCalcCard(c)).join('')}
          </div>
        </section>
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  renderCalcCard(calc) {
    const isFav = Storage.isFavorite(calc.id);
    const parentTopId = getParentCategoryForDomain(calc.category) || calc.category;
    const topCat = TOP_LEVEL_CATEGORIES[parentTopId];
    const dom = MASTER_TAXONOMY[calc.category];
    const catName = topCat ? topCat.name : (dom ? dom.name : calc.category);

    return `
      <div class="calc-card" data-calc-id="${calc.id}" data-cat="${parentTopId}">
        <div class="calc-card-top">
          <div class="calc-card-icon">
            ${getIcon(calc.icon)}
          </div>
          <button class="calc-card-favorite-btn ${isFav ? 'active' : ''}" data-fav-id="${calc.id}" title="${isFav ? 'Remove Favorite' : 'Add to Favorites'}" aria-label="Favorite">
            ${getIcon(isFav ? 'starFilled' : 'star')}
          </button>
        </div>

        <div>
          <h4 class="calc-card-title">${calc.name}</h4>
          <p class="calc-card-desc">${calc.description}</p>
        </div>

        <div class="calc-card-bottom">
          <span class="calc-card-category">${catName}</span>
          <span class="calc-card-arrow" aria-hidden="true">
            ${getIcon('arrowRight')}
          </span>
        </div>
      </div>
    `;
  },

  bindEvents(container) {
    // Hero search triggers command palette
    const searchBox = container.querySelector('#hero-search-input');
    const searchContainer = container.querySelector('#hero-search-trigger');
    const openSearch = () => state.set('commandPaletteOpen', true);
    if (searchBox) searchBox.addEventListener('click', openSearch);
    if (searchContainer) searchContainer.addEventListener('click', openSearch);

    // Card navigation when card body is clicked
    container.querySelectorAll('.calc-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.calc-card-favorite-btn')) return;
        const id = card.dataset.calcId;
        window.location.hash = `#/calc/${id}`;
      });
    });

    // Favorite button clicks
    container.querySelectorAll('.calc-card-favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.favId;
        const isAdded = Storage.toggleFavorite(id);
        btn.classList.toggle('active', isAdded);
        btn.innerHTML = getIcon(isAdded ? 'starFilled' : 'star');
        state.set('favorites', Storage.getFavorites());
        Toast.info(isAdded ? 'Added to favorites' : 'Removed from favorites');
      });
    });
  }
};


