/**
 * CALQIO Algebra Calculator Definitions
 */

export const LinearEquationDef = {
  id: 'linear_equation',
  name: 'Linear Equation Solver',
  category: 'math',
  icon: 'math',
  description: 'Solve single-variable linear equations of the form ax + b = c with step-by-step algebra.',
  inputs: [
    { id: 'a', label: 'Coefficient a (in ax)', type: 'number', defaultValue: 3 },
    { id: 'b', label: 'Constant b (in + b)', type: 'number', defaultValue: 6 },
    { id: 'c', label: 'Equals c (= c)', type: 'number', defaultValue: 24 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.a) || 0;
    const b = parseFloat(vals.b) || 0;
    const c = parseFloat(vals.c) || 0;

    if (a === 0) {
      return {
        mainResult: b === c ? 'Infinite Solutions' : 'No Solution',
        mainLabel: 'Linear Result',
        subResult: b === c ? 'Identity equation (0 = 0)' : `${b} ≠ ${c} (Contradiction)`,
        breakdown: [
          { label: 'Equation', value: `${a}x + ${b} = ${c}` },
          { label: 'Status', value: b === c ? 'All real numbers satisfy x' : 'Inconsistent equation' }
        ],
        formula: 'ax + b = c',
        explanation: 'When coefficient a is 0, the equation has either no solution or infinitely many solutions.'
      };
    }

    const x = (c - b) / a;
    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    return {
      mainResult: `x = ${fmt(x)}`,
      mainLabel: 'Solution for x',
      subResult: `Equation: ${a}x + (${b}) = ${c}`,
      breakdown: [
        { label: 'Step 1: Subtract b', value: `${a}x = ${fmt(c - b)}` },
        { label: 'Step 2: Divide by a', value: `x = ${fmt(c - b)} ÷ ${a}` },
        { label: 'Verification', value: `${a}(${fmt(x)}) + ${b} = ${fmt(a * x + b)}` }
      ],
      formula: `x = (c − b) ÷ a = (${c} − ${b}) ÷ ${a} = ${fmt(x)}`,
      explanation: `To isolate x, subtract ${b} from both sides and then divide by ${a}.`,
      expression: `${a}x + ${b} = ${c}`
    };
  }
};

export const QuadraticEquationDef = {
  id: 'quadratic_equation',
  name: 'Quadratic Equation Solver',
  category: 'math',
  icon: 'math',
  description: 'Solve ax² + bx + c = 0 to find real or complex roots, discriminant, and parabola vertex.',
  inputs: [
    { id: 'a', label: 'Coefficient a (x²)', type: 'number', defaultValue: 1 },
    { id: 'b', label: 'Coefficient b (x)', type: 'number', defaultValue: -5 },
    { id: 'c', label: 'Constant c', type: 'number', defaultValue: 6 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.a) || 1;
    const b = parseFloat(vals.b) || 0;
    const c = parseFloat(vals.c) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const disc = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    let rootsText = '';
    let rootType = '';
    let x1, x2;

    if (disc > 0) {
      x1 = (-b + Math.sqrt(disc)) / (2 * a);
      x2 = (-b - Math.sqrt(disc)) / (2 * a);
      rootsText = `x₁ = ${fmt(x1)},  x₂ = ${fmt(x2)}`;
      rootType = 'Two Distinct Real Roots';
    } else if (disc === 0) {
      x1 = -b / (2 * a);
      rootsText = `x = ${fmt(x1)} (Double Root)`;
      rootType = 'One Real Repeated Root';
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-disc) / (2 * a);
      rootsText = `x = ${fmt(realPart)} ± ${fmt(imagPart)}i`;
      rootType = 'Two Complex Conjugate Roots';
    }

    return {
      mainResult: rootsText,
      mainLabel: 'Roots of Quadratic Equation',
      subResult: `${rootType} (Δ = ${fmt(disc)})`,
      breakdown: [
        { label: 'Discriminant (Δ = b² - 4ac)', value: `${fmt(disc)}` },
        { label: 'Parabola Vertex (h, k)', value: `(${fmt(vertexX)}, ${fmt(vertexY)})` },
        { label: 'Axis of Symmetry', value: `x = ${fmt(vertexX)}` },
        { label: 'Parabola Direction', value: a > 0 ? 'Opens Upwards (Min Vertex)' : 'Opens Downwards (Max Vertex)' }
      ],
      formula: `x = (−b ± √(b² − 4ac)) ÷ (2a)`,
      explanation: `For equation ${a}x² + (${b})x + (${c}) = 0, discriminant Δ = ${fmt(disc)} indicates ${rootType.toLowerCase()}.`,
      expression: `${a}x² + ${b}x + ${c} = 0`
    };
  }
};

export const CubicEquationDef = {
  id: 'cubic_equation',
  name: 'Cubic Equation Solver',
  category: 'math',
  icon: 'math',
  description: 'Find roots and inflection point for cubic polynomial ax³ + bx² + cx + d = 0.',
  inputs: [
    { id: 'a', label: 'Coefficient a (x³)', type: 'number', defaultValue: 1 },
    { id: 'b', label: 'Coefficient b (x²)', type: 'number', defaultValue: -6 },
    { id: 'c', label: 'Coefficient c (x)', type: 'number', defaultValue: 11 },
    { id: 'd', label: 'Constant d', type: 'number', defaultValue: -6 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.a) || 1;
    const b = parseFloat(vals.b) || 0;
    const c = parseFloat(vals.c) || 0;
    const d = parseFloat(vals.d) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    // Depressed cubic t^3 + pt + q = 0
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    const disc = (q * q) / 4 + (p * p * p) / 27;

    const shift = -b / (3 * a);
    let r1, r2, r3;
    let resString = '';

    if (disc > 0) {
      const u = Math.cbrt(-q / 2 + Math.sqrt(disc));
      const v = Math.cbrt(-q / 2 - Math.sqrt(disc));
      r1 = u + v + shift;
      resString = `x₁ = ${fmt(r1)} (1 Real Root, 2 Complex)`;
    } else if (disc === 0) {
      const u = Math.cbrt(-q / 2);
      r1 = 2 * u + shift;
      r2 = -u + shift;
      resString = `x₁ = ${fmt(r1)},  x₂ = x₃ = ${fmt(r2)}`;
    } else {
      const r = Math.sqrt(-(p * p * p) / 27);
      const phi = Math.acos(-q / (2 * r));
      r1 = 2 * Math.cbrt(r) * Math.cos(phi / 3) + shift;
      r2 = 2 * Math.cbrt(r) * Math.cos((phi + 2 * Math.PI) / 3) + shift;
      r3 = 2 * Math.cbrt(r) * Math.cos((phi + 4 * Math.PI) / 3) + shift;
      resString = `x₁ = ${fmt(r1)},  x₂ = ${fmt(r2)},  x₃ = ${fmt(r3)}`;
    }

    return {
      mainResult: resString,
      mainLabel: 'Cubic Roots',
      subResult: `Inflection Point at x = ${fmt(shift)}`,
      breakdown: [
        { label: 'Inflection Point x', value: `${fmt(shift)}` },
        { label: 'Depressed Cubic p', value: `${fmt(p)}` },
        { label: 'Depressed Cubic q', value: `${fmt(q)}` },
        { label: 'Discriminant', value: `${fmt(disc)}` }
      ],
      formula: 'Cardano formula for ax³ + bx² + cx + d = 0',
      explanation: 'Uses Cardano transformation to depressed cubic form and trigonometric angle trisection.',
      expression: `${a}x³ + ${b}x² + ${c}x + ${d} = 0`
    };
  }
};

export const SystemEquationsDef = {
  id: 'system_equations',
  name: 'System of Linear Equations (2x2)',
  category: 'math',
  icon: 'math',
  description: 'Solve 2-variable linear systems: a₁x + b₁y = c₁ and a₂x + b₂y = c₂ using Cramer’s rule.',
  inputs: [
    { id: 'a1', label: 'a₁ (in a₁x + b₁y = c₁)', type: 'number', defaultValue: 2 },
    { id: 'b1', label: 'b₁ (in a₁x + b₁y = c₁)', type: 'number', defaultValue: 3 },
    { id: 'c1', label: 'c₁ (in a₁x + b₁y = c₁)', type: 'number', defaultValue: 12 },
    { id: 'a2', label: 'a₂ (in a₂x + b₂y = c₂)', type: 'number', defaultValue: 4 },
    { id: 'b2', label: 'b₂ (in a₂x + b₂y = c₂)', type: 'number', defaultValue: -1 },
    { id: 'c2', label: 'c₂ (in a₂x + b₂y = c₂)', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const a1 = parseFloat(vals.a1) || 0;
    const b1 = parseFloat(vals.b1) || 0;
    const c1 = parseFloat(vals.c1) || 0;
    const a2 = parseFloat(vals.a2) || 0;
    const b2 = parseFloat(vals.b2) || 0;
    const c2 = parseFloat(vals.c2) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;

    if (D === 0) {
      return {
        mainResult: (Dx === 0 && Dy === 0) ? 'Infinitely Many Solutions' : 'No Solution (Parallel Lines)',
        mainLabel: 'System Status',
        subResult: 'Determinant D = 0',
        breakdown: [
          { label: 'Determinant D', value: '0' },
          { label: 'Determinant Dx', value: `${fmt(Dx)}` },
          { label: 'Determinant Dy', value: `${fmt(Dy)}` }
        ],
        formula: 'D = a₁b₂ − a₂b₁ = 0',
        explanation: 'When D = 0, the system lines are either parallel (no solution) or coincident (infinite solutions).'
      };
    }

    const x = Dx / D;
    const y = Dy / D;

    return {
      mainResult: `x = ${fmt(x)},  y = ${fmt(y)}`,
      mainLabel: 'System Solution (x, y)',
      subResult: `Intersection Point: (${fmt(x)}, ${fmt(y)})`,
      breakdown: [
        { label: 'Determinant D', value: `${fmt(D)}` },
        { label: 'Determinant Dx', value: `${fmt(Dx)}` },
        { label: 'Determinant Dy', value: `${fmt(Dy)}` },
        { label: 'Verification Eq 1', value: `${a1}(${fmt(x)}) + ${b1}(${fmt(y)}) = ${fmt(a1*x + b1*y)}` },
        { label: 'Verification Eq 2', value: `${a2}(${fmt(x)}) + ${b2}(${fmt(y)}) = ${fmt(a2*x + b2*y)}` }
      ],
      formula: `x = Dx ÷ D = ${fmt(Dx)} ÷ ${fmt(D)},  y = Dy ÷ D = ${fmt(Dy)} ÷ ${fmt(D)}`,
      explanation: `Solved via Cramer’s rule using matrix determinants.`,
      expression: `2x2 System: (${fmt(x)}, ${fmt(y)})`
    };
  }
};

export const PolynomialRootsDef = {
  id: 'polynomial_roots',
  name: 'Polynomial Roots & Evaluator',
  category: 'math',
  icon: 'math',
  description: 'Evaluate polynomial P(x) = ax⁴ + bx³ + cx² + dx + e and find value at x.',
  inputs: [
    { id: 'a', label: 'Coefficient a (x⁴)', type: 'number', defaultValue: 1 },
    { id: 'b', label: 'Coefficient b (x³)', type: 'number', defaultValue: -2 },
    { id: 'c', label: 'Coefficient c (x²)', type: 'number', defaultValue: -1 },
    { id: 'd', label: 'Coefficient d (x)', type: 'number', defaultValue: 2 },
    { id: 'e', label: 'Constant e', type: 'number', defaultValue: 0 },
    { id: 'evalX', label: 'Evaluate at x =', type: 'number', defaultValue: 3 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.a) || 0;
    const b = parseFloat(vals.b) || 0;
    const c = parseFloat(vals.c) || 0;
    const d = parseFloat(vals.d) || 0;
    const e = parseFloat(vals.e) || 0;
    const x = parseFloat(vals.evalX) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const px = a * Math.pow(x, 4) + b * Math.pow(x, 3) + c * Math.pow(x, 2) + d * x + e;
    const dpx = 4 * a * Math.pow(x, 3) + 3 * b * Math.pow(x, 2) + 2 * c * x + d;

    return {
      mainResult: `P(${x}) = ${fmt(px)}`,
      mainLabel: 'Polynomial Value at x',
      subResult: `Derivative P'(${x}) = ${fmt(dpx)} (Slope)`,
      breakdown: [
        { label: 'Term ax⁴', value: `${fmt(a * Math.pow(x, 4))}` },
        { label: 'Term bx³', value: `${fmt(b * Math.pow(x, 3))}` },
        { label: 'Term cx²', value: `${fmt(c * Math.pow(x, 2))}` },
        { label: 'Term dx', value: `${fmt(d * x)}` },
        { label: 'Constant e', value: `${fmt(e)}` }
      ],
      formula: `P(x) = ax⁴ + bx³ + cx² + dx + e`,
      explanation: `Calculates exact polynomial value and instantaneous derivative slope at x = ${x}.`,
      expression: `P(${x}) = ${fmt(px)}`
    };
  }
};

export const SlopeInterceptDef = {
  id: 'slope_intercept',
  name: 'Slope-Intercept & Line Equation',
  category: 'math',
  icon: 'math',
  description: 'Calculate slope m, y-intercept, angle, and equation of line between two points (x₁, y₁) and (x₂, y₂).',
  inputs: [
    { id: 'x1', label: 'Point 1: x₁', type: 'number', defaultValue: 2 },
    { id: 'y1', label: 'Point 1: y₁', type: 'number', defaultValue: 3 },
    { id: 'x2', label: 'Point 2: x₂', type: 'number', defaultValue: 6 },
    { id: 'y2', label: 'Point 2: y₂', type: 'number', defaultValue: 11 }
  ],
  calculate: (vals) => {
    const x1 = parseFloat(vals.x1) || 0;
    const y1 = parseFloat(vals.y1) || 0;
    const x2 = parseFloat(vals.x2) || 0;
    const y2 = parseFloat(vals.y2) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (x2 === x1) {
      return {
        mainResult: `x = ${fmt(x1)}`,
        mainLabel: 'Vertical Line Equation',
        subResult: 'Slope is undefined (Infinite)',
        breakdown: [
          { label: 'Line Type', value: 'Vertical' },
          { label: 'Angle with X-axis', value: '90°' }
        ],
        formula: `x = ${fmt(x1)}`,
        explanation: 'Since x₁ = x₂, the line is vertical and the slope is undefined.'
      };
    }

    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    const angleRad = Math.atan(m);
    const angleDeg = (angleRad * 180) / Math.PI;

    const sign = b >= 0 ? `+ ${fmt(b)}` : `− ${fmt(Math.abs(b))}`;
    const eq = `y = ${fmt(m)}x ${sign}`;

    return {
      mainResult: eq,
      mainLabel: 'Slope-Intercept Equation',
      subResult: `Slope m = ${fmt(m)},  y-intercept b = ${fmt(b)}`,
      breakdown: [
        { label: 'Slope m (Δy / Δx)', value: `${fmt(m)}` },
        { label: 'y-intercept (0, b)', value: `(0, ${fmt(b)})` },
        { label: 'x-intercept (−b / m, 0)', value: m !== 0 ? `(${fmt(-b / m)}, 0)` : 'None (Horizontal)' },
        { label: 'Inclination Angle', value: `${fmt(angleDeg)}°` }
      ],
      formula: `m = (y₂ − y₁) ÷ (x₂ − x₁),  y = mx + b`,
      explanation: `Calculates slope rate of change and coordinates where line intersects axes.`,
      expression: `Line: ${eq}`
    };
  }
};

export const DistanceMidpointDef = {
  id: 'distance_midpoint',
  name: 'Distance & Midpoint 2D',
  category: 'math',
  icon: 'math',
  description: 'Compute Euclidean straight-line distance and exact midpoint between two 2D points.',
  inputs: [
    { id: 'x1', label: 'Point A: x₁', type: 'number', defaultValue: 1 },
    { id: 'y1', label: 'Point A: y₁', type: 'number', defaultValue: 2 },
    { id: 'x2', label: 'Point B: x₂', type: 'number', defaultValue: 7 },
    { id: 'y2', label: 'Point B: y₂', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const x1 = parseFloat(vals.x1) || 0;
    const y1 = parseFloat(vals.y1) || 0;
    const x2 = parseFloat(vals.x2) || 0;
    const y2 = parseFloat(vals.y2) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return {
      mainResult: `${fmt(distance)} units`,
      mainLabel: 'Euclidean Distance d',
      subResult: `Midpoint M = (${fmt(midX)}, ${fmt(midY)})`,
      breakdown: [
        { label: 'Horizontal Δx', value: `${fmt(dx)}` },
        { label: 'Vertical Δy', value: `${fmt(dy)}` },
        { label: 'Midpoint Coordinates', value: `(${fmt(midX)}, ${fmt(midY)})` }
      ],
      formula: `d = √((x₂ − x₁)² + (y₂ − y₁)²),  M = ((x₁+x₂)/2, (y₁+y₂)/2)`,
      explanation: `Computes direct Pythagorean hypotenuse distance between coordinate pairs.`,
      expression: `Distance = ${fmt(distance)}`
    };
  }
};

export const ArithmeticProgressionDef = {
  id: 'arithmetic_progression',
  name: 'Arithmetic Progression (AP)',
  category: 'math',
  icon: 'math',
  description: 'Calculate n-th term an, sum of first n terms Sn, and full sequence progression.',
  inputs: [
    { id: 'a', label: 'First Term (a)', type: 'number', defaultValue: 3 },
    { id: 'd', label: 'Common Difference (d)', type: 'number', defaultValue: 5 },
    { id: 'n', label: 'Number of Terms (n)', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.a) || 0;
    const d = parseFloat(vals.d) || 0;
    const n = Math.max(1, parseInt(vals.n) || 1);

    const fmt = (num) => parseFloat(num.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const an = a + (n - 1) * d;
    const Sn = (n / 2) * (2 * a + (n - 1) * d);

    const previewTerms = [];
    for (let i = 0; i < Math.min(n, 6); i++) {
      previewTerms.push(fmt(a + i * d));
    }
    if (n > 6) previewTerms.push('...');

    return {
      mainResult: `S${n} = ${fmt(Sn)}`,
      mainLabel: `Sum of First ${n} Terms`,
      subResult: `${n}th Term a${n} = ${fmt(an)}`,
      breakdown: [
        { label: 'First Term (a)', value: `${fmt(a)}` },
        { label: 'Common Difference (d)', value: `${fmt(d)}` },
        { label: `${n}-th Term (an)`, value: `${fmt(an)}` },
        { label: 'Sequence Preview', value: previewTerms.join(', ') }
      ],
      formula: `an = a + (n − 1)d,  Sn = (n ÷ 2) × (2a + (n − 1)d)`,
      explanation: `Calculates arithmetic progression term progression and total series summation.`,
      expression: `AP Sum = ${fmt(Sn)}`
    };
  }
};

export const GeometricProgressionDef = {
  id: 'geometric_progression',
  name: 'Geometric Progression (GP)',
  category: 'math',
  icon: 'math',
  description: 'Calculate n-th term an, sum of first n terms Sn, and infinite series sum S∞.',
  inputs: [
    { id: 'a', label: 'First Term (a)', type: 'number', defaultValue: 2 },
    { id: 'r', label: 'Common Ratio (r)', type: 'number', defaultValue: 3 },
    { id: 'n', label: 'Number of Terms (n)', type: 'number', defaultValue: 6 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.a) || 0;
    const r = parseFloat(vals.r) || 1;
    const n = Math.max(1, parseInt(vals.n) || 1);

    const fmt = (num) => parseFloat(num.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const an = a * Math.pow(r, n - 1);
    let Sn;
    if (r === 1) {
      Sn = a * n;
    } else {
      Sn = a * (1 - Math.pow(r, n)) / (1 - r);
    }

    let sumInfText = 'Diverges (|r| ≥ 1)';
    if (Math.abs(r) < 1) {
      sumInfText = `${fmt(a / (1 - r))}`;
    }

    return {
      mainResult: `S${n} = ${fmt(Sn)}`,
      mainLabel: `Sum of First ${n} Terms`,
      subResult: `${n}th Term a${n} = ${fmt(an)}`,
      breakdown: [
        { label: `${n}-th Term (an)`, value: `${fmt(an)}` },
        { label: 'Sum of n Terms (Sn)', value: `${fmt(Sn)}` },
        { label: 'Infinite Sum (S∞)', value: sumInfText }
      ],
      formula: `an = a × rⁿ⁻¹,  Sn = a × (rⁿ − 1) ÷ (r − 1)`,
      explanation: `Solves geometric exponential sequence progression and series convergence.`,
      expression: `GP Sum = ${fmt(Sn)}`
    };
  }
};

export const MatrixOpsDef = {
  id: 'matrix_addition',
  name: 'Matrix Operations (2x2)',
  category: 'math',
  icon: 'math',
  description: 'Matrix addition, subtraction, multiplication, and determinant for 2x2 matrices.',
  inputs: [
    {
      id: 'op',
      label: 'Operation',
      type: 'segmented',
      defaultValue: 'add',
      options: [
        { label: 'A + B', value: 'add' },
        { label: 'A − B', value: 'sub' },
        { label: 'A × B', value: 'mul' },
        { label: 'det(A)', value: 'det' }
      ]
    },
    { id: 'a11', label: 'Matrix A (1,1)', type: 'number', defaultValue: 1 },
    { id: 'a12', label: 'Matrix A (1,2)', type: 'number', defaultValue: 2 },
    { id: 'a21', label: 'Matrix A (2,1)', type: 'number', defaultValue: 3 },
    { id: 'a22', label: 'Matrix A (2,2)', type: 'number', defaultValue: 4 },
    { id: 'b11', label: 'Matrix B (1,1)', type: 'number', defaultValue: 5 },
    { id: 'b12', label: 'Matrix B (1,2)', type: 'number', defaultValue: 6 },
    { id: 'b21', label: 'Matrix B (2,1)', type: 'number', defaultValue: 7 },
    { id: 'b22', label: 'Matrix B (2,2)', type: 'number', defaultValue: 8 }
  ],
  calculate: (vals) => {
    const op = vals.op || 'add';
    const a11 = parseFloat(vals.a11) || 0;
    const a12 = parseFloat(vals.a12) || 0;
    const a21 = parseFloat(vals.a21) || 0;
    const a22 = parseFloat(vals.a22) || 0;

    const b11 = parseFloat(vals.b11) || 0;
    const b12 = parseFloat(vals.b12) || 0;
    const b21 = parseFloat(vals.b21) || 0;
    const b22 = parseFloat(vals.b22) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const detA = a11 * a22 - a12 * a21;
    const detB = b11 * b22 - b12 * b21;

    let r11, r12, r21, r22;
    if (op === 'add') {
      r11 = a11 + b11; r12 = a12 + b12;
      r21 = a21 + b21; r22 = a22 + b22;
    } else if (op === 'sub') {
      r11 = a11 - b11; r12 = a12 - b12;
      r21 = a21 - b21; r22 = a22 - b22;
    } else if (op === 'mul') {
      r11 = a11 * b11 + a12 * b21;
      r12 = a11 * b12 + a12 * b22;
      r21 = a21 * b11 + a22 * b21;
      r22 = a21 * b12 + a22 * b22;
    } else {
      return {
        mainResult: `det(A) = ${fmt(detA)}`,
        mainLabel: 'Determinant of Matrix A',
        subResult: `det(B) = ${fmt(detB)}`,
        breakdown: [
          { label: 'Matrix A det (ad − bc)', value: `${fmt(detA)}` },
          { label: 'Matrix B det (ad − bc)', value: `${fmt(detB)}` },
          { label: 'Invertible?', value: detA !== 0 ? 'Yes (det ≠ 0)' : 'No (Singular)' }
        ],
        formula: 'det(A) = a₁₁a₂₂ − a₁₂a₂₁',
        explanation: 'Computes scalar determinant scaling factor.'
      };
    }

    return {
      mainResult: `[ [${fmt(r11)}, ${fmt(r12)}], [${fmt(r21)}, ${fmt(r22)}] ]`,
      mainLabel: `Result Matrix (${op.toUpperCase()})`,
      subResult: `det(Result) = ${fmt(r11 * r22 - r12 * r21)}`,
      breakdown: [
        { label: 'Row 1', value: `[ ${fmt(r11)},  ${fmt(r12)} ]` },
        { label: 'Row 2', value: `[ ${fmt(r21)},  ${fmt(r22)} ]` },
        { label: 'det(A)', value: `${fmt(detA)}` },
        { label: 'det(B)', value: `${fmt(detB)}` }
      ],
      formula: 'Matrix linear algebra transformation',
      explanation: 'Calculates element-wise or dot-product transformation.',
      expression: `Matrix ${op}`
    };
  }
};

export const VectorCalcDef = {
  id: 'vector_calc',
  name: 'Vector Operations 3D',
  category: 'math',
  icon: 'math',
  description: 'Vector magnitude, dot product, cross product, and angle between 3D vectors u and v.',
  inputs: [
    { id: 'u1', label: 'Vector u: x', type: 'number', defaultValue: 1 },
    { id: 'u2', label: 'Vector u: y', type: 'number', defaultValue: 2 },
    { id: 'u3', label: 'Vector u: z', type: 'number', defaultValue: 3 },
    { id: 'v1', label: 'Vector v: x', type: 'number', defaultValue: 4 },
    { id: 'v2', label: 'Vector v: y', type: 'number', defaultValue: 5 },
    { id: 'v3', label: 'Vector v: z', type: 'number', defaultValue: 6 }
  ],
  calculate: (vals) => {
    const u1 = parseFloat(vals.u1) || 0;
    const u2 = parseFloat(vals.u2) || 0;
    const u3 = parseFloat(vals.u3) || 0;

    const v1 = parseFloat(vals.v1) || 0;
    const v2 = parseFloat(vals.v2) || 0;
    const v3 = parseFloat(vals.v3) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const magU = Math.sqrt(u1 * u1 + u2 * u2 + u3 * u3);
    const magV = Math.sqrt(v1 * v1 + v2 * v2 + v3 * v3);

    const dot = u1 * v1 + u2 * v2 + u3 * v3;

    // Cross product u x v
    const cx = u2 * v3 - u3 * v2;
    const cy = u3 * v1 - u1 * v3;
    const cz = u1 * v2 - u2 * v1;
    const magCross = Math.sqrt(cx * cx + cy * cy + cz * cz);

    let angleDeg = 0;
    if (magU > 0 && magV > 0) {
      const cosTheta = Math.max(-1, Math.min(1, dot / (magU * magV)));
      angleDeg = (Math.acos(cosTheta) * 180) / Math.PI;
    }

    return {
      mainResult: `u · v = ${fmt(dot)}`,
      mainLabel: 'Dot Product (Scalar)',
      subResult: `u × v = (${fmt(cx)}, ${fmt(cy)}, ${fmt(cz)})`,
      breakdown: [
        { label: 'Magnitude |u|', value: `${fmt(magU)}` },
        { label: 'Magnitude |v|', value: `${fmt(magV)}` },
        { label: 'Cross Product (u × v)', value: `(${fmt(cx)}, ${fmt(cy)}, ${fmt(cz)})` },
        { label: 'Angle θ between vectors', value: `${fmt(angleDeg)}°` }
      ],
      formula: `u · v = u₁v₁ + u₂v₂ + u₃v₃,  cos θ = (u · v) ÷ (|u||v|)`,
      explanation: 'Computes spatial 3D vector orientation, projection, and orthogonal normal vector.',
      expression: `u · v = ${fmt(dot)}`
    };
  }
};
