/**
 * CALQIO Declarative Percentage Calculator
 */

export const PercentageDef = {
  id: 'percentage',
  name: 'Percentage Calculator',
  category: 'math',
  icon: 'percent',
  description: 'Calculate simple percentage, percentage increase or decrease, and differences.',
  inputs: [
    {
      id: 'mode',
      label: 'Calculation Mode',
      type: 'segmented',
      defaultValue: 'of',
      options: [
        { label: '% of Value', value: 'of' },
        { label: 'What % is', value: 'is_what' },
        { label: '% Change', value: 'change' },
        { label: '% Difference', value: 'diff' }
      ]
    },
    {
      id: 'valA',
      label: 'Percentage Rate (%) / Value A',
      type: 'number',
      defaultValue: 25,
      step: 'any',
      validate: (val) => val === '' ? 'Please enter value A' : null
    },
    {
      id: 'valB',
      label: 'Total / Value B',
      type: 'number',
      defaultValue: 5000,
      step: 'any',
      validate: (val, allVals) => {
        if (val === '') return 'Please enter value B';
        if ((allVals.mode === 'is_what' || allVals.mode === 'change') && val === 0) {
          return 'Base value cannot be zero';
        }
        return null;
      }
    }
  ],
  calculate: (vals) => {
    const mode = vals.mode || 'of';
    const a = parseFloat(vals.valA) || 0;
    const b = parseFloat(vals.valB) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (mode === 'of') {
      const res = (a / 100) * b;
      const rem = b - res;
      return {
        mainResult: fmt(res),
        mainLabel: 'Calculated Percentage',
        subResult: `${a}% of ${fmt(b)}`,
        breakdown: [
          { label: 'Fraction Ratio', value: `${fmt(a / 100)}` },
          { label: 'Remaining (100 - ' + a + '%)', value: `${fmt(rem)} (${fmt(100 - a)}%)` },
          { label: 'Multiplier', value: `× ${fmt(a / 100)}` }
        ],
        formula: `Result = (${a} ÷ 100) × ${fmt(b)} = ${fmt(res)}`,
        explanation: `To find ${a}% of ${fmt(b)}, convert ${a}% to decimal (${a / 100}) and multiply by ${fmt(b)}.`,
        expression: `${a}% of ${fmt(b)}`
      };
    } else if (mode === 'is_what') {
      const pct = b !== 0 ? (a / b) * 100 : 0;
      return {
        mainResult: `${fmt(pct)}%`,
        mainLabel: 'Calculated Percentage Rate',
        subResult: `${fmt(a)} is ${fmt(pct)}% of ${fmt(b)}`,
        breakdown: [
          { label: 'Part Value (X)', value: `${fmt(a)}` },
          { label: 'Total Value (Y)', value: `${fmt(b)}` },
          { label: 'Fraction', value: `${fmt(a)} / ${fmt(b)}` }
        ],
        formula: `Percentage = (${fmt(a)} ÷ ${fmt(b)}) × 100 = ${fmt(pct)}%`,
        explanation: `${fmt(a)} represents ${fmt(pct)}% of the whole ${fmt(b)}.`,
        expression: `${fmt(a)} of ${fmt(b)}`
      };
    } else if (mode === 'change') {
      const change = b - a;
      const pctChange = a !== 0 ? (change / a) * 100 : 0;
      const isUp = change >= 0;
      return {
        mainResult: `${isUp ? '+' : ''}${fmt(pctChange)}%`,
        mainLabel: isUp ? 'Percentage Increase' : 'Percentage Decrease',
        subResult: `${isUp ? 'Increased' : 'Decreased'} by ${fmt(Math.abs(change))}`,
        breakdown: [
          { label: 'Initial Value', value: `${fmt(a)}` },
          { label: 'Final Value', value: `${fmt(b)}` },
          { label: 'Absolute Difference', value: `${isUp ? '+' : ''}${fmt(change)}`, color: isUp ? 'var(--accent-success)' : 'var(--accent-danger)' }
        ],
        formula: `Change = ((${fmt(b)} − ${fmt(a)}) ÷ ${fmt(a)}) × 100 = ${fmt(pctChange)}%`,
        explanation: `The value moved from ${fmt(a)} to ${fmt(b)}, representing a ${fmt(Math.abs(pctChange))}% ${isUp ? 'growth' : 'reduction'}.`,
        expression: `${fmt(a)} → ${fmt(b)}`
      };
    } else {
      const diff = Math.abs(a - b);
      const avg = (a + b) / 2;
      const pctDiff = avg !== 0 ? (diff / avg) * 100 : 0;
      return {
        mainResult: `${fmt(pctDiff)}%`,
        mainLabel: 'Percentage Difference',
        subResult: `Difference between ${fmt(a)} and ${fmt(b)}`,
        breakdown: [
          { label: 'Absolute Gap', value: `${fmt(diff)}` },
          { label: 'Average Base', value: `${fmt(avg)}` }
        ],
        formula: `Diff = (|${fmt(a)} − ${fmt(b)}| ÷ ((${fmt(a)} + ${fmt(b)}) ÷ 2)) × 100 = ${fmt(pctDiff)}%`,
        explanation: `The relative percentage difference comparing ${fmt(a)} and ${fmt(b)} against their mean base.`,
        expression: `Diff between ${fmt(a)} & ${fmt(b)}`
      };
    }
  },
  related: ['fraction', 'ratio', 'discount', 'gst', 'margin_markup']
};
