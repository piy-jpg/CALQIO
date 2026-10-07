/**
 * CALQIO Trigonometry Calculator Definitions
 */

export const SinCosTanDef = {
  id: 'sin_cos_tan',
  name: 'Trigonometric Functions (Sin, Cos, Tan)',
  category: 'math',
  icon: 'scientific',
  description: 'Evaluate primary and reciprocal trigonometric ratios (sin, cos, tan, csc, sec, cot) for any angle.',
  inputs: [
    { id: 'angle', label: 'Angle Value (θ)', type: 'number', defaultValue: 45 },
    {
      id: 'unit',
      label: 'Angle Unit',
      type: 'segmented',
      defaultValue: 'deg',
      options: [
        { label: 'Degrees (°)', value: 'deg' },
        { label: 'Radians (rad)', value: 'rad' },
        { label: 'Gradians (grad)', value: 'grad' }
      ]
    }
  ],
  calculate: (vals) => {
    const rawAngle = parseFloat(vals.angle) || 0;
    const unit = vals.unit || 'deg';

    let rad = rawAngle;
    if (unit === 'deg') rad = (rawAngle * Math.PI) / 180;
    else if (unit === 'grad') rad = (rawAngle * Math.PI) / 200;

    const fmt = (n) => {
      if (Math.abs(n) < 1e-12) return '0';
      if (Math.abs(n) > 1e12) return 'Undefined (∞)';
      return parseFloat(n.toFixed(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });
    };

    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = Math.abs(c) < 1e-12 ? Infinity : Math.tan(rad);
    const csc = Math.abs(s) < 1e-12 ? Infinity : 1 / s;
    const sec = Math.abs(c) < 1e-12 ? Infinity : 1 / c;
    const cot = Math.abs(s) < 1e-12 ? Infinity : 1 / Math.tan(rad);

    return {
      mainResult: `sin(θ) = ${fmt(s)},  cos(θ) = ${fmt(c)}`,
      mainLabel: 'Primary Trigonometric Ratios',
      subResult: `tan(θ) = ${fmt(t)}`,
      breakdown: [
        { label: 'sin(θ)', value: fmt(s) },
        { label: 'cos(θ)', value: fmt(c) },
        { label: 'tan(θ)', value: fmt(t) },
        { label: 'csc(θ) = 1/sin', value: fmt(csc) },
        { label: 'sec(θ) = 1/cos', value: fmt(sec) },
        { label: 'cot(θ) = 1/tan', value: fmt(cot) },
        { label: 'Angle in Radians', value: `${parseFloat(rad.toFixed(4))} rad` }
      ],
      formula: 'sin²(θ) + cos²(θ) = 1',
      explanation: 'Evaluates standard trigonometric circle projections and reciprocal ratios.',
      expression: `Trig (${rawAngle} ${unit})`
    };
  }
};

export const InverseTrigDef = {
  id: 'inverse_trig',
  name: 'Inverse Trigonometric Functions',
  category: 'math',
  icon: 'scientific',
  description: 'Calculate arcsin, arccos, and arctan in both degrees and radians.',
  inputs: [
    {
      id: 'fn',
      label: 'Inverse Function',
      type: 'segmented',
      defaultValue: 'asin',
      options: [
        { label: 'arcsin(x)', value: 'asin' },
        { label: 'arccos(x)', value: 'acos' },
        { label: 'arctan(x)', value: 'atan' }
      ]
    },
    { id: 'val', label: 'Input Value x', type: 'number', defaultValue: 0.5, step: 'any' }
  ],
  calculate: (vals) => {
    const fn = vals.fn || 'asin';
    const x = parseFloat(vals.val) || 0;

    const fmt = (n) => parseFloat(n.toFixed(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });

    if ((fn === 'asin' || fn === 'acos') && (x < -1 || x > 1)) {
      return {
        mainResult: 'Domain Error: x ∉ [-1, 1]',
        mainLabel: 'Invalid Input',
        subResult: `Domain for ${fn}(x) is strictly [-1, 1]`,
        breakdown: [{ label: 'Given x', value: `${x}` }],
        formula: `${fn}(x) requires −1 ≤ x ≤ 1`,
        explanation: 'The sine and cosine functions cannot produce outputs beyond [-1, 1].'
      };
    }

    let rad = 0;
    if (fn === 'asin') rad = Math.asin(x);
    else if (fn === 'acos') rad = Math.acos(x);
    else rad = Math.atan(x);

    const deg = (rad * 180) / Math.PI;

    return {
      mainResult: `${fmt(deg)}°`,
      mainLabel: `${fn}(${x}) in Degrees`,
      subResult: `${fmt(rad)} radians`,
      breakdown: [
        { label: 'Degrees (°)', value: `${fmt(deg)}°` },
        { label: 'Radians (rad)', value: `${fmt(rad)} rad` },
        { label: 'Pi Fraction', value: `${fmt(rad / Math.PI)}π` }
      ],
      formula: `θ = ${fn}(${x})`,
      explanation: 'Calculates the principal angle whose trigonometric ratio equals the input.',
      expression: `${fn}(${x}) = ${fmt(deg)}°`
    };
  }
};

export const DegRadConverterDef = {
  id: 'deg_rad_converter',
  name: 'Degrees ↔ Radians ↔ Gradians',
  category: 'math',
  icon: 'scientific',
  description: 'Instantly convert angular measurements between degrees, radians, and gradians.',
  inputs: [
    { id: 'angle', label: 'Angle Value', type: 'number', defaultValue: 180 },
    {
      id: 'fromUnit',
      label: 'Convert From',
      type: 'segmented',
      defaultValue: 'deg',
      options: [
        { label: 'Degrees (°)', value: 'deg' },
        { label: 'Radians (rad)', value: 'rad' },
        { label: 'Gradians (grad)', value: 'grad' }
      ]
    }
  ],
  calculate: (vals) => {
    const val = parseFloat(vals.angle) || 0;
    const from = vals.fromUnit || 'deg';

    const fmt = (n) => parseFloat(n.toFixed(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });

    let deg = 0;
    if (from === 'deg') deg = val;
    else if (from === 'rad') deg = (val * 180) / Math.PI;
    else deg = (val * 180) / 200;

    const rad = (deg * Math.PI) / 180;
    const grad = (deg * 200) / 180;

    return {
      mainResult: `${fmt(rad)} rad (${fmt(rad / Math.PI)}π)`,
      mainLabel: 'Angle in Radians',
      subResult: `${fmt(deg)}° = ${fmt(grad)} grad`,
      breakdown: [
        { label: 'Degrees (°)', value: `${fmt(deg)}°` },
        { label: 'Radians (rad)', value: `${fmt(rad)} rad` },
        { label: 'Gradians (grad)', value: `${fmt(grad)} grad` },
        { label: 'Multiples of π', value: `${fmt(rad / Math.PI)}π` }
      ],
      formula: '180° = π radians = 200 gradians',
      explanation: 'Performs precise trigonometric angle unit conversion.',
      expression: `${val} ${from} converted`
    };
  }
};

export const RightTriangleTrigDef = {
  id: 'right_triangle_trig',
  name: 'Right Triangle Trigonometry Solver',
  category: 'math',
  icon: 'scientific',
  description: 'Solve all sides, angles, area, and altitude of a right-angled triangle given 2 values.',
  inputs: [
    { id: 'sideA', label: 'Side a (Adjacent/Opposite)', type: 'number', defaultValue: 5 },
    { id: 'sideB', label: 'Side b (Adjacent/Opposite)', type: 'number', defaultValue: 12 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.sideA) || 0;
    const b = parseFloat(vals.sideB) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const c = Math.sqrt(a * a + b * b);
    const angleA = (Math.atan(a / b) * 180) / Math.PI;
    const angleB = 90 - angleA;
    const area = 0.5 * a * b;
    const altitude = (a * b) / c;

    return {
      mainResult: `c = ${fmt(c)} units`,
      mainLabel: 'Hypotenuse (c)',
      subResult: `Angles: α = ${fmt(angleA)}°,  β = ${fmt(angleB)}°`,
      breakdown: [
        { label: 'Side a', value: `${fmt(a)}` },
        { label: 'Side b', value: `${fmt(b)}` },
        { label: 'Hypotenuse c', value: `${fmt(c)}` },
        { label: 'Angle α', value: `${fmt(angleA)}°` },
        { label: 'Angle β', value: `${fmt(angleB)}°` },
        { label: 'Area', value: `${fmt(area)} sq units` },
        { label: 'Altitude to Hypotenuse', value: `${fmt(altitude)}` }
      ],
      formula: `c = √(a² + b²),  tan(α) = a/b`,
      explanation: 'Resolves all right triangle geometric dimensions and trigonometric angles.',
      expression: `Right Triangle c = ${fmt(c)}`
    };
  }
};

export const LawOfSinesDef = {
  id: 'law_of_sines',
  name: 'Law of Sines Calculator',
  category: 'math',
  icon: 'scientific',
  description: 'Solve oblique triangles using the Law of Sines: a/sin(A) = b/sin(B) = c/sin(C).',
  inputs: [
    { id: 'sideA', label: 'Side a', type: 'number', defaultValue: 10 },
    { id: 'angleA', label: 'Angle A (degrees)', type: 'number', defaultValue: 30 },
    { id: 'angleB', label: 'Angle B (degrees)', type: 'number', defaultValue: 45 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.sideA) || 0;
    const A = parseFloat(vals.angleA) || 0;
    const B = parseFloat(vals.angleB) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (A + B >= 180 || A <= 0 || B <= 0) {
      return {
        mainResult: 'Invalid Triangle Angles',
        mainLabel: 'Error',
        subResult: 'Sum of angles A and B must be strictly less than 180°',
        breakdown: [{ label: 'A + B', value: `${A + B}°` }],
        formula: 'A + B + C = 180°',
        explanation: 'In Euclidean geometry, the sum of internal triangle angles must equal 180°.'
      };
    }

    const C = 180 - (A + B);
    const radA = (A * Math.PI) / 180;
    const radB = (B * Math.PI) / 180;
    const radC = (C * Math.PI) / 180;

    const b = (a * Math.sin(radB)) / Math.sin(radA);
    const c = (a * Math.sin(radC)) / Math.sin(radA);
    const area = 0.5 * a * b * Math.sin(radC);

    return {
      mainResult: `Side b = ${fmt(b)},  Side c = ${fmt(c)}`,
      mainLabel: 'Calculated Triangle Sides',
      subResult: `Angle C = ${fmt(C)}°,  Area = ${fmt(area)}`,
      breakdown: [
        { label: 'Side a', value: `${fmt(a)}` },
        { label: 'Side b', value: `${fmt(b)}` },
        { label: 'Side c', value: `${fmt(c)}` },
        { label: 'Angle A', value: `${fmt(A)}°` },
        { label: 'Angle B', value: `${fmt(B)}°` },
        { label: 'Angle C', value: `${fmt(C)}°` },
        { label: 'Triangle Area', value: `${fmt(area)} sq units` }
      ],
      formula: 'a ÷ sin(A) = b ÷ sin(B) = c ÷ sin(C)',
      explanation: 'Applies the Law of Sines ratio to resolve non-right oblique triangles.',
      expression: `Law of Sines: b=${fmt(b)}, c=${fmt(c)}`
    };
  }
};

export const LawOfCosinesDef = {
  id: 'law_of_cosines',
  name: 'Law of Cosines Calculator',
  category: 'math',
  icon: 'scientific',
  description: 'Solve third side c = √(a² + b² − 2ab cos C) or find angles given 3 sides (SSS / SAS).',
  inputs: [
    { id: 'a', label: 'Side a', type: 'number', defaultValue: 8 },
    { id: 'b', label: 'Side b', type: 'number', defaultValue: 11 },
    { id: 'angleC', label: 'Included Angle C (degrees)', type: 'number', defaultValue: 60 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.a) || 0;
    const b = parseFloat(vals.b) || 0;
    const C = parseFloat(vals.angleC) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const radC = (C * Math.PI) / 180;
    const c2 = a * a + b * b - 2 * a * b * Math.cos(radC);
    const c = Math.sqrt(Math.max(0, c2));

    const radA = Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c))));
    const A = (radA * 180) / Math.PI;
    const B = 180 - (A + C);
    const area = 0.5 * a * b * Math.sin(radC);

    return {
      mainResult: `Side c = ${fmt(c)}`,
      mainLabel: 'Calculated Opposite Side (c)',
      subResult: `Angle A = ${fmt(A)}°,  Angle B = ${fmt(B)}°`,
      breakdown: [
        { label: 'Side a', value: `${fmt(a)}` },
        { label: 'Side b', value: `${fmt(b)}` },
        { label: 'Side c', value: `${fmt(c)}` },
        { label: 'Included Angle C', value: `${fmt(C)}°` },
        { label: 'Angle A', value: `${fmt(A)}°` },
        { label: 'Angle B', value: `${fmt(B)}°` },
        { label: 'Area', value: `${fmt(area)} sq units` }
      ],
      formula: `c² = a² + b² − 2ab cos(C)`,
      explanation: 'Calculates the third boundary side and remaining interior angles using the Law of Cosines.',
      expression: `Side c = ${fmt(c)}`
    };
  }
};
