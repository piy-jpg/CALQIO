/**
 * CALQIO Numbers & Arithmetic Calculator Definitions
 */

export const AverageDef = {
  id: 'average',
  name: 'Average Calculator',
  category: 'math',
  icon: 'math',
  description: 'Calculate mean average, sum, minimum, maximum, range, and count for any list of numbers.',
  inputs: [
    {
      id: 'numbers',
      label: 'Numbers (separated by commas or spaces)',
      type: 'text',
      defaultValue: '12, 18, 24, 30, 36, 42'
    }
  ],
  calculate: (vals) => {
    const raw = vals.numbers || '';
    const nums = raw
      .split(/[\s,]+/)
      .map(n => parseFloat(n))
      .filter(n => !isNaN(n));

    if (nums.length === 0) {
      return {
        mainResult: '0',
        mainLabel: 'Mean Average',
        subResult: 'Please enter numbers to calculate average',
        breakdown: [],
        formula: 'Average = Sum ÷ Count',
        explanation: 'Enter a comma-separated list of values.'
      };
    }

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const count = nums.length;
    const avg = sum / count;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const range = max - min;

    // Geometric mean (if all > 0)
    let geoMeanText = 'N/A (requires all values > 0)';
    if (nums.every(n => n > 0)) {
      const logSum = nums.reduce((acc, curr) => acc + Math.log(curr), 0);
      geoMeanText = fmt(Math.exp(logSum / count));
    }

    return {
      mainResult: fmt(avg),
      mainLabel: 'Arithmetic Mean (Average)',
      subResult: `Sum: ${fmt(sum)}  |  Count: ${count}`,
      breakdown: [
        { label: 'Sum (∑x)', value: fmt(sum) },
        { label: 'Total Count (n)', value: `${count}` },
        { label: 'Minimum Value', value: fmt(min) },
        { label: 'Maximum Value', value: fmt(max) },
        { label: 'Range (Max − Min)', value: fmt(range) },
        { label: 'Geometric Mean', value: geoMeanText }
      ],
      formula: `Average = (∑ x) ÷ n = ${fmt(sum)} ÷ ${count} = ${fmt(avg)}`,
      explanation: `Sum of ${count} values divided by ${count}.`,
      expression: `Average = ${fmt(avg)}`
    };
  }
};

export const WeightedAverageDef = {
  id: 'weighted_average',
  name: 'Weighted Average Calculator',
  category: 'math',
  icon: 'math',
  description: 'Calculate weighted mean where each value has a custom proportional weight.',
  inputs: [
    { id: 'v1', label: 'Value 1', type: 'number', defaultValue: 85 },
    { id: 'w1', label: 'Weight 1', type: 'number', defaultValue: 20 },
    { id: 'v2', label: 'Value 2', type: 'number', defaultValue: 90 },
    { id: 'w2', label: 'Weight 2', type: 'number', defaultValue: 30 },
    { id: 'v3', label: 'Value 3', type: 'number', defaultValue: 78 },
    { id: 'w3', label: 'Weight 3', type: 'number', defaultValue: 50 }
  ],
  calculate: (vals) => {
    const v1 = parseFloat(vals.v1) || 0; const w1 = parseFloat(vals.w1) || 0;
    const v2 = parseFloat(vals.v2) || 0; const w2 = parseFloat(vals.w2) || 0;
    const v3 = parseFloat(vals.v3) || 0; const w3 = parseFloat(vals.w3) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const totalWeight = w1 + w2 + w3;
    if (totalWeight === 0) {
      return {
        mainResult: '0',
        mainLabel: 'Weighted Average',
        subResult: 'Total weight cannot be zero',
        breakdown: [],
        formula: 'Weighted Mean = (∑ w·x) ÷ (∑ w)',
        explanation: 'At least one weight must be greater than zero.'
      };
    }

    const weightedSum = v1 * w1 + v2 * w2 + v3 * w3;
    const result = weightedSum / totalWeight;

    return {
      mainResult: fmt(result),
      mainLabel: 'Weighted Average',
      subResult: `Total Weight Sum: ${fmt(totalWeight)}`,
      breakdown: [
        { label: 'Item 1 Contribution', value: `${fmt(v1)} × ${fmt(w1)} = ${fmt(v1 * w1)}` },
        { label: 'Item 2 Contribution', value: `${fmt(v2)} × ${fmt(w2)} = ${fmt(v2 * w2)}` },
        { label: 'Item 3 Contribution', value: `${fmt(v3)} × ${fmt(w3)} = ${fmt(v3 * w3)}` },
        { label: 'Sum of Products (∑ w·x)', value: fmt(weightedSum) },
        { label: 'Total Weights (∑ w)', value: fmt(totalWeight) }
      ],
      formula: `Weighted Mean = (${fmt(v1)}×${w1} + ${fmt(v2)}×${w2} + ${fmt(v3)}×${w3}) ÷ ${fmt(totalWeight)} = ${fmt(result)}`,
      explanation: 'Weights each item according to its relative importance or credit value.',
      expression: `Weighted Avg = ${fmt(result)}`
    };
  }
};

export const ModuloDef = {
  id: 'modulo',
  name: 'Modulo & Remainder Calculator',
  category: 'math',
  icon: 'math',
  description: 'Compute dividend mod divisor (a mod m), quotient, integer division, and modular congruence.',
  inputs: [
    { id: 'dividend', label: 'Dividend (a)', type: 'number', defaultValue: 29 },
    { id: 'divisor', label: 'Divisor / Modulus (m)', type: 'number', defaultValue: 6 }
  ],
  calculate: (vals) => {
    const a = parseFloat(vals.dividend) || 0;
    const m = parseFloat(vals.divisor) || 1;

    if (m === 0) {
      return {
        mainResult: 'Undefined (Division by 0)',
        mainLabel: 'Modulo Error',
        subResult: 'Modulus m cannot be zero',
        breakdown: [],
        formula: 'a mod m',
        explanation: 'Modulo by zero is undefined in arithmetic.'
      };
    }

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const quotient = Math.floor(a / m);
    const remainder = ((a % m) + m) % m; // Euclidean modulo
    const standardRem = a % m;

    return {
      mainResult: `${fmt(remainder)}`,
      mainLabel: `${a} mod ${m} (Remainder)`,
      subResult: `Quotient: ${quotient}  |  ${a} = (${m} × ${quotient}) + ${fmt(remainder)}`,
      breakdown: [
        { label: 'Dividend (a)', value: `${a}` },
        { label: 'Modulus (m)', value: `${m}` },
        { label: 'Integer Quotient (⌊a/m⌋)', value: `${quotient}` },
        { label: 'Remainder (r)', value: `${fmt(remainder)}` },
        { label: 'Modular Congruence', value: `${a} ≡ ${fmt(remainder)} (mod ${m})` }
      ],
      formula: `a = (m × q) + r  →  ${a} = (${m} × ${quotient}) + ${fmt(remainder)}`,
      explanation: 'Computes positive Euclidean remainder and integer division.',
      expression: `${a} mod ${m} = ${fmt(remainder)}`
    };
  }
};

export const RomanNumeralsDef = {
  id: 'roman_numerals',
  name: 'Roman Numerals Converter',
  category: 'math',
  icon: 'math',
  description: 'Convert standard numbers (1 to 3,999) to Roman numerals and Roman numerals to numbers.',
  inputs: [
    {
      id: 'mode',
      label: 'Conversion Mode',
      type: 'segmented',
      defaultValue: 'to_roman',
      options: [
        { label: 'Number → Roman', value: 'to_roman' },
        { label: 'Roman → Number', value: 'to_num' }
      ]
    },
    { id: 'input', label: 'Input Value', type: 'text', defaultValue: '2026' }
  ],
  calculate: (vals) => {
    const mode = vals.mode || 'to_roman';
    const raw = (vals.input || '').trim().toUpperCase();

    const romanMap = [
      { val: 1000, sym: 'M' }, { val: 900, sym: 'CM' }, { val: 500, sym: 'D' }, { val: 400, sym: 'CD' },
      { val: 100, sym: 'C' }, { val: 90, sym: 'XC' }, { val: 50, sym: 'L' }, { val: 40, sym: 'XL' },
      { val: 10, sym: 'X' }, { val: 9, sym: 'IX' }, { val: 5, sym: 'V' }, { val: 4, sym: 'IV' }, { val: 1, sym: 'I' }
    ];

    if (mode === 'to_roman') {
      let num = parseInt(raw, 10);
      if (isNaN(num) || num < 1 || num > 3999) {
        return {
          mainResult: 'Invalid Integer (1 - 3999)',
          mainLabel: 'Error',
          subResult: 'Standard Roman numerals support integers between 1 and 3,999',
          breakdown: [],
          formula: 'M=1000, D=500, C=100, L=50, X=10, V=5, I=1',
          explanation: 'Please enter a valid whole integer between 1 and 3999.'
        };
      }

      let roman = '';
      let temp = num;
      for (const item of romanMap) {
        while (temp >= item.val) {
          roman += item.sym;
          temp -= item.val;
        }
      }

      return {
        mainResult: roman,
        mainLabel: 'Roman Numeral',
        subResult: `${num} in Roman Numerals`,
        breakdown: [
          { label: 'Arabic Number', value: `${num}` },
          { label: 'Roman Representation', value: roman }
        ],
        formula: 'Additive & Subtractive Roman Numeral System',
        explanation: `${num} converts directly to ${roman}.`,
        expression: `${num} = ${roman}`
      };
    } else {
      // Roman to number
      const romanVal = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < raw.length; i++) {
        const curr = romanVal[raw[i]] || 0;
        const next = romanVal[raw[i + 1]] || 0;
        if (curr < next) {
          total -= curr;
        } else {
          total += curr;
        }
      }

      return {
        mainResult: `${total}`,
        mainLabel: 'Standard Arabic Integer',
        subResult: `Roman "${raw}" = ${total}`,
        breakdown: [
          { label: 'Roman String', value: raw },
          { label: 'Calculated Integer', value: `${total}` }
        ],
        formula: 'Roman Subtractive Notation Parsing',
        explanation: `Evaluated "${raw}" to integer ${total}.`,
        expression: `${raw} = ${total}`
      };
    }
  }
};

export const NumberBaseDef = {
  id: 'number_base',
  name: 'Number Base Converter (Hex, Dec, Oct, Bin)',
  category: 'math',
  icon: 'math',
  description: 'Convert values across Decimal (10), Binary (2), Hexadecimal (16), and Octal (8) bases.',
  inputs: [
    {
      id: 'fromBase',
      label: 'Input Base',
      type: 'segmented',
      defaultValue: '10',
      options: [
        { label: 'Decimal (10)', value: '10' },
        { label: 'Binary (2)', value: '2' },
        { label: 'Hex (16)', value: '16' },
        { label: 'Octal (8)', value: '8' }
      ]
    },
    { id: 'input', label: 'Value to Convert', type: 'text', defaultValue: '255' }
  ],
  calculate: (vals) => {
    const fromBase = parseInt(vals.fromBase) || 10;
    const raw = (vals.input || '').trim();

    const dec = parseInt(raw, fromBase);
    if (isNaN(dec)) {
      return {
        mainResult: 'Invalid Base Input',
        mainLabel: 'Error',
        subResult: `"${raw}" is not a valid Base-${fromBase} number.`,
        breakdown: [],
        formula: 'Radix Base Conversion',
        explanation: 'Check digits for the selected base.'
      };
    }

    const bin = dec.toString(2);
    const oct = dec.toString(8);
    const hex = dec.toString(16).toUpperCase();

    return {
      mainResult: `Hex: 0x${hex}  |  Bin: ${bin}`,
      mainLabel: 'Converted Bases',
      subResult: `Decimal: ${dec}  |  Octal: ${oct}`,
      breakdown: [
        { label: 'Decimal (Base 10)', value: `${dec}` },
        { label: 'Binary (Base 2)', value: bin },
        { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
        { label: 'Octal (Base 8)', value: `0o${oct}` }
      ],
      formula: 'Positional Radix Polynomial Base Conversion',
      explanation: `Converts Base-${fromBase} number "${raw}" into standard computing bases.`,
      expression: `${raw} (Base ${fromBase}) = ${dec} (Dec)`
    };
  }
};
