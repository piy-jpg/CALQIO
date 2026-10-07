/**
 * CALQIO Declarative GST, Discount, and Profit & Loss Calculators
 */

export const GstDef = {
  id: 'gst',
  name: 'GST Calculator',
  category: 'finance',
  icon: 'tax',
  description: 'Add or remove Goods and Services Tax (GST) with CGST, SGST, and IGST breakdowns.',
  inputs: [
    {
      id: 'mode',
      label: 'GST Mode',
      type: 'segmented',
      defaultValue: 'add',
      options: [
        { label: 'Add GST (Exclusive)', value: 'add' },
        { label: 'Remove GST (Inclusive)', value: 'remove' }
      ]
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
      defaultValue: 10000,
      min: 0,
      step: 'any',
      prefix: 'CURRENCY',
      validate: (v) => v <= 0 ? 'Amount must be greater than zero' : null
    },
    {
      id: 'rate',
      label: 'GST Tax Rate',
      type: 'select',
      defaultValue: '18',
      options: [
        { label: '3% (Gold & Precious Items)', value: '3' },
        { label: '5% (Essential Goods)', value: '5' },
        { label: '12% (Standard Slabs)', value: '12' },
        { label: '18% (Most Goods & Services)', value: '18' },
        { label: '28% (Luxury & Sin Goods)', value: '28' }
      ]
    }
  ],
  calculate: (vals, { currency }) => {
    const isAdd = vals.mode === 'add';
    const amt = parseFloat(vals.amount) || 0;
    const rate = parseFloat(vals.rate) || 18;

    let net = 0, tax = 0, gross = 0;
    if (isAdd) {
      net = amt;
      tax = (amt * rate) / 100;
      gross = net + tax;
    } else {
      gross = amt;
      net = (gross * 100) / (100 + rate);
      tax = gross - net;
    }

    const fmt = (n) => `${currency}${parseFloat(n.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return {
      mainResult: fmt(gross),
      mainLabel: isAdd ? 'Total Gross (Including GST)' : 'Gross (Original Input)',
      subResult: `${isAdd ? 'Added' : 'Deducted'} ${fmt(tax)} GST (${rate}%)`,
      breakdown: [
        { label: 'Net Amount (Pre-Tax)', value: fmt(net) },
        { label: 'Total GST Tax', value: fmt(tax), color: 'var(--accent-primary)' },
        { label: `CGST (${rate / 2}%)`, value: fmt(tax / 2) },
        { label: `SGST (${rate / 2}%)`, value: fmt(tax / 2) }
      ],
      formula: isAdd 
        ? `GST = (${fmt(net)} × ${rate}) ÷ 100 = ${fmt(tax)}`
        : `Net = (${fmt(gross)} × 100) ÷ (100 + ${rate}) = ${fmt(net)}`,
      explanation: `For an Intra-State supply, total GST of ${fmt(tax)} splits equally between Central GST (${fmt(tax / 2)}) and State GST (${fmt(tax / 2)}).`,
      expression: `${fmt(amt)} (${isAdd ? '+ GST' : 'incl. GST'} ${rate}%)`
    };
  },
  related: ['discount', 'profit_loss', 'margin_markup', 'emi']
};

export const DiscountDef = {
  id: 'discount',
  name: 'Discount Calculator',
  category: 'business',
  icon: 'business',
  description: 'Calculate final sale prices, discount savings, and additional coupon deductions.',
  inputs: [
    {
      id: 'price',
      label: 'Original Price',
      type: 'number',
      defaultValue: 2500,
      min: 0,
      step: 'any',
      prefix: 'CURRENCY',
      validate: (v) => v <= 0 ? 'Price must be greater than zero' : null
    },
    {
      id: 'discount',
      label: 'Primary Discount (%)',
      type: 'number',
      defaultValue: 20,
      min: 0,
      max: 100,
      step: 1,
      suffix: '%',
      rangeSync: true,
      rangeMin: 0,
      rangeMax: 100,
      validate: (v) => v < 0 || v > 100 ? 'Discount must be between 0% and 100%' : null
    },
    {
      id: 'extra',
      label: 'Additional Coupon Discount (%)',
      type: 'number',
      defaultValue: 5,
      min: 0,
      max: 100,
      step: 1,
      suffix: '%'
    }
  ],
  calculate: (vals, { currency }) => {
    const original = parseFloat(vals.price) || 0;
    const d1 = parseFloat(vals.discount) || 0;
    const d2 = parseFloat(vals.extra) || 0;

    const priceAfterD1 = original * (1 - (d1 / 100));
    const finalPrice = priceAfterD1 * (1 - (d2 / 100));
    const totalSavings = original - finalPrice;
    const effectiveDiscount = original > 0 ? (totalSavings / original) * 100 : 0;

    const fmt = (n) => `${currency}${parseFloat(n.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return {
      mainResult: fmt(finalPrice),
      mainLabel: 'Final Sale Price',
      subResult: `You Save: ${fmt(totalSavings)} (${effectiveDiscount.toFixed(1)}% off)`,
      breakdown: [
        { label: 'Original Price', value: fmt(original) },
        { label: 'Primary Discount', value: `${d1}% (−${fmt(original * (d1 / 100))})` },
        { label: 'Coupon Discount', value: `${d2}% (−${fmt(priceAfterD1 * (d2 / 100))})` },
        { label: 'Total Savings', value: fmt(totalSavings), color: '#10b981' }
      ],
      formula: `Final = ${fmt(original)} × (1 − ${d1}%) × (1 − ${d2}%) = ${fmt(finalPrice)}`,
      explanation: `Applying ${d1}% discount followed by an additional ${d2}% coupon gives an effective overall discount of ${effectiveDiscount.toFixed(1)}%.`,
      expression: `${fmt(original)} − ${d1}% − ${d2}%`
    };
  },
  related: ['gst', 'profit_loss', 'percentage']
};

export const ProfitLossDef = {
  id: 'profit_loss',
  name: 'Profit & Loss Calculator',
  category: 'business',
  icon: 'business',
  description: 'Calculate net profit, loss amount, profit margin %, and markup on cost.',
  inputs: [
    {
      id: 'cost',
      label: 'Cost Price (CP)',
      type: 'number',
      defaultValue: 1500,
      min: 0,
      step: 'any',
      prefix: 'CURRENCY',
      validate: (v) => v <= 0 ? 'Cost price must be greater than zero' : null
    },
    {
      id: 'selling',
      label: 'Selling Price (SP)',
      type: 'number',
      defaultValue: 2250,
      min: 0,
      step: 'any',
      prefix: 'CURRENCY',
      validate: (v) => v <= 0 ? 'Selling price must be greater than zero' : null
    }
  ],
  calculate: (vals, { currency }) => {
    const cp = parseFloat(vals.cost) || 0;
    const sp = parseFloat(vals.selling) || 0;

    const diff = sp - cp;
    const isProfit = diff >= 0;
    const margin = sp > 0 ? (diff / sp) * 100 : 0;
    const markup = cp > 0 ? (diff / cp) * 100 : 0;

    const fmt = (n) => `${currency}${parseFloat(Math.abs(n).toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return {
      mainResult: `${isProfit ? '+' : '−'}${fmt(diff)}`,
      mainLabel: isProfit ? 'Net Profit' : 'Net Loss',
      subResult: `${isProfit ? 'Profit' : 'Loss'} Margin: ${Math.abs(margin).toFixed(2)}%`,
      breakdown: [
        { label: 'Cost Price (CP)', value: fmt(cp) },
        { label: 'Selling Price (SP)', value: fmt(sp) },
        { label: 'Profit Margin', value: `${margin.toFixed(2)}%`, color: isProfit ? '#10b981' : '#ef4444' },
        { label: 'Markup on Cost', value: `${markup.toFixed(2)}%` }
      ],
      formula: isProfit 
        ? `Profit = SP − CP = ${fmt(sp)} − ${fmt(cp)} = ${fmt(diff)}`
        : `Loss = CP − SP = ${fmt(cp)} − ${fmt(sp)} = ${fmt(diff)}`,
      explanation: isProfit 
        ? `Selling at ${fmt(sp)} yields a ${fmt(diff)} profit, with a ${margin.toFixed(2)}% margin on revenue.`
        : `Selling at ${fmt(sp)} results in a ${fmt(diff)} loss (${Math.abs(margin).toFixed(2)}% negative margin).`,
      expression: `CP ${fmt(cp)}, SP ${fmt(sp)}`
    };
  },
  related: ['margin_markup', 'discount', 'gst', 'breakeven']
};
