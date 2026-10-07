/**
 * CALQIO Declarative EMI Calculator
 */

export const EmiDef = {
  id: 'emi',
  name: 'EMI Calculator',
  category: 'finance',
  icon: 'finance',
  description: 'Calculate monthly equated loan installments (EMI), interest totals, and payoff amounts.',
  inputs: [
    {
      id: 'principal',
      label: 'Loan Amount',
      type: 'number',
      defaultValue: 1000000,
      min: 1000,
      step: 1000,
      prefix: 'CURRENCY',
      rangeSync: true,
      rangeMin: 50000,
      rangeMax: 10000000,
      rangeStep: 25000,
      validate: (v) => v <= 0 ? 'Loan amount must be greater than zero' : null
    },
    {
      id: 'rate',
      label: 'Interest Rate (% p.a.)',
      type: 'number',
      defaultValue: 8.5,
      min: 0.1,
      max: 40,
      step: 0.1,
      suffix: '%',
      rangeSync: true,
      rangeMin: 1,
      rangeMax: 25,
      rangeStep: 0.1,
      validate: (v) => v <= 0 ? 'Interest rate must be positive' : null
    },
    {
      id: 'tenure',
      label: 'Loan Tenure (Years)',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 40,
      step: 1,
      suffix: 'Years',
      rangeSync: true,
      rangeMin: 1,
      rangeMax: 30,
      rangeStep: 1,
      validate: (v) => v <= 0 ? 'Tenure must be at least 1 year' : null
    }
  ],
  calculate: (vals, { currency }) => {
    const P = parseFloat(vals.principal) || 0;
    const annualRate = parseFloat(vals.rate) || 0;
    const years = parseFloat(vals.tenure) || 0;
    const totalMonths = years * 12;

    const r = annualRate / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - P;

    const principalPct = ((P / totalPayment) * 100).toFixed(1);
    const interestPct = ((totalInterest / totalPayment) * 100).toFixed(1);

    const fmt = (n) => `${currency}${Math.round(n).toLocaleString('en-US')}`;

    return {
      mainResult: fmt(emi),
      mainLabel: 'Monthly EMI Installment',
      subResult: `Total Payment: ${fmt(totalPayment)} over ${years} years`,
      breakdown: [
        { label: 'Principal Amount', value: `${fmt(P)} (${principalPct}%)` },
        { label: 'Total Interest', value: `${fmt(totalInterest)} (${interestPct}%)`, color: '#f59e0b' },
        { label: 'Total Amount Payable', value: fmt(totalPayment) },
        { label: 'Total Payments', value: `${totalMonths} monthly EMIs` }
      ],
      formula: 'EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)',
      explanation: `Where P = ${fmt(P)}, monthly rate r = ${(r * 100).toFixed(4)}%, and total installments n = ${totalMonths} months.`,
      expression: `${fmt(P)} @ ${annualRate}% for ${years} yrs`
    };
  },
  related: ['loan', 'gst', 'margin_markup', 'breakeven']
};

export const LoanDef = {
  id: 'loan',
  name: 'Loan Calculator',
  category: 'finance',
  icon: 'finance',
  description: 'Evaluate personal, home, or commercial loan costs with total interest and repayment schedules.',
  inputs: [
    {
      id: 'amount',
      label: 'Total Loan Borrowed',
      type: 'number',
      defaultValue: 300000,
      min: 1000,
      step: 1000,
      prefix: 'CURRENCY',
      validate: (v) => v <= 0 ? 'Loan amount must be greater than zero' : null
    },
    {
      id: 'rate',
      label: 'Annual Interest Rate',
      type: 'number',
      defaultValue: 7.2,
      min: 0.1,
      max: 40,
      step: 0.1,
      suffix: '%',
      validate: (v) => v <= 0 ? 'Interest rate must be positive' : null
    },
    {
      id: 'months',
      label: 'Loan Term (Months)',
      type: 'number',
      defaultValue: 36,
      min: 1,
      max: 360,
      step: 1,
      suffix: 'Months',
      validate: (v) => v <= 0 ? 'Loan term must be at least 1 month' : null
    }
  ],
  calculate: (vals, { currency }) => {
    const P = parseFloat(vals.amount) || 0;
    const rate = parseFloat(vals.rate) || 0;
    const n = parseFloat(vals.months) || 1;

    const r = rate / 12 / 100;
    const payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = payment * n;
    const interest = total - P;

    const fmt = (v) => `${currency}${parseFloat(v.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return {
      mainResult: fmt(payment),
      mainLabel: 'Monthly Payment',
      subResult: `Total Interest: ${fmt(interest)}`,
      breakdown: [
        { label: 'Borrowed Capital', value: fmt(P) },
        { label: 'Interest Charge', value: fmt(interest), color: '#f59e0b' },
        { label: 'Total Payoff Cost', value: fmt(total) }
      ],
      formula: 'Payment = P × (r(1+r)ⁿ) / ((1+r)ⁿ - 1)',
      explanation: `Repaying ${fmt(P)} over ${n} months at ${rate}% annual interest equals ${fmt(payment)} per month.`,
      expression: `${fmt(P)} @ ${rate}% (${n} mos)`
    };
  },
  related: ['emi', 'gst', 'margin_markup']
};
