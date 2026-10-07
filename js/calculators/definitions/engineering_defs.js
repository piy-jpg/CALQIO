/**
 * CALQIO Master Engineering Disciplines Definitions
 * Comprehensive Suite covering Electrical, Mechanical, Civil, Computer, Chemical, Electronics & Automobile Engineering.
 */

// ==========================================
// 1. ⚡ ELECTRICAL ENGINEERING
// ==========================================

export const ResistorColorCodeDef = {
  id: 'resistor_color_code',
  name: 'Resistor Color Code Decoder',
  category: 'engineering',
  icon: 'electrical',
  description: 'Decode 4-band and 5-band axial resistor color bands into resistance value, multiplier, and tolerance percentage.',
  inputs: [
    {
      id: 'bands',
      label: 'Band Count',
      type: 'segmented',
      defaultValue: '4',
      options: [
        { label: '4 Bands', value: '4' },
        { label: '5 Bands', value: '5' }
      ]
    },
    {
      id: 'band1',
      label: '1st Band (1st Digit)',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '🟫 Brown (1)', value: '1' },
        { label: '🟥 Red (2)', value: '2' },
        { label: '🟧 Orange (3)', value: '3' },
        { label: '🟨 Yellow (4)', value: '4' },
        { label: '🟩 Green (5)', value: '5' },
        { label: '🟦 Blue (6)', value: '6' },
        { label: '🟪 Violet (7)', value: '7' },
        { label: '⬜ Gray (8)', value: '8' },
        { label: '⬜ White (9)', value: '9' }
      ]
    },
    {
      id: 'band2',
      label: '2nd Band (2nd Digit)',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '⬛ Black (0)', value: '0' },
        { label: '🟫 Brown (1)', value: '1' },
        { label: '🟥 Red (2)', value: '2' },
        { label: '🟧 Orange (3)', value: '3' },
        { label: '🟨 Yellow (4)', value: '4' },
        { label: '🟩 Green (5)', value: '5' },
        { label: '🟦 Blue (6)', value: '6' },
        { label: '🟪 Violet (7)', value: '7' },
        { label: '⬜ Gray (8)', value: '8' },
        { label: '⬜ White (9)', value: '9' }
      ]
    },
    {
      id: 'band3',
      label: '3rd Band (3rd Digit for 5-Band / Multiplier for 4-Band)',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '⬛ Black (×1 / 0)', value: '0' },
        { label: '🟫 Brown (×10 / 1)', value: '1' },
        { label: '🟥 Red (×100 / 2)', value: '2' },
        { label: '🟧 Orange (×1k / 3)', value: '3' },
        { label: '🟨 Yellow (×10k / 4)', value: '4' },
        { label: '🟩 Green (×100k / 5)', value: '5' },
        { label: '🟦 Blue (×1M / 6)', value: '6' },
        { label: '🟪 Violet (×10M / 7)', value: '7' },
        { label: '🪙 Gold (×0.1)', value: '-1' },
        { label: '🔘 Silver (×0.01)', value: '-2' }
      ]
    },
    {
      id: 'multiplier',
      label: 'Multiplier (5-Band Only)',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '⬛ Black (×1)', value: '0' },
        { label: '🟫 Brown (×10)', value: '1' },
        { label: '🟥 Red (×100)', value: '2' },
        { label: '🟧 Orange (×1k)', value: '3' },
        { label: '🟨 Yellow (×10k)', value: '4' },
        { label: '🟩 Green (×100k)', value: '5' },
        { label: '🟦 Blue (×1M)', value: '6' },
        { label: '🪙 Gold (×0.1)', value: '-1' },
        { label: '🔘 Silver (×0.01)', value: '-2' }
      ]
    },
    {
      id: 'tolerance',
      label: 'Tolerance Band',
      type: 'select',
      defaultValue: '5',
      options: [
        { label: '🟫 Brown (±1%)', value: '1' },
        { label: '🟥 Red (±2%)', value: '2' },
        { label: '🟩 Green (±0.5%)', value: '0.5' },
        { label: '🟦 Blue (±0.25%)', value: '0.25' },
        { label: '🟪 Violet (±0.1%)', value: '0.1' },
        { label: '🪙 Gold (±5%)', value: '5' },
        { label: '🔘 Silver (±10%)', value: '10' }
      ]
    }
  ],
  calculate: (vals) => {
    const is5Band = vals.bands === '5';
    const b1 = parseInt(vals.band1, 10) || 1;
    const b2 = parseInt(vals.band2, 10) || 0;
    const tol = parseFloat(vals.tolerance) || 5;

    let baseDigits = 0;
    let multExponent = 0;

    if (is5Band) {
      const b3 = parseInt(vals.band3, 10) >= 0 ? parseInt(vals.band3, 10) : 0;
      baseDigits = b1 * 100 + b2 * 10 + b3;
      multExponent = parseFloat(vals.multiplier) || 0;
    } else {
      baseDigits = b1 * 10 + b2;
      multExponent = parseFloat(vals.band3) || 0;
    }

    const resistance = baseDigits * Math.pow(10, multExponent);

    let displayStr = `${resistance} Ω`;
    if (resistance >= 1e6) {
      displayStr = `${(resistance / 1e6).toFixed(2).replace(/\.00$/, '')} MΩ`;
    } else if (resistance >= 1e3) {
      displayStr = `${(resistance / 1e3).toFixed(2).replace(/\.00$/, '')} kΩ`;
    }

    const minR = resistance * (1 - tol / 100);
    const maxR = resistance * (1 + tol / 100);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${displayStr} ±${tol}%`,
      mainLabel: 'Decoded Resistor Value',
      subResult: `Tolerance Range: ${fmt(minR)} Ω – ${fmt(maxR)} Ω`,
      breakdown: [
        { label: 'Nominal Resistance', value: `${fmt(resistance)} Ω` },
        { label: 'Standard Notation', value: displayStr },
        { label: 'Tolerance Limit', value: `±${tol}%` },
        { label: 'Band Configuration', value: `${is5Band ? '5-Band Precision' : '4-Band Standard'}` }
      ],
      formula: is5Band ? `R = (D₁D₂D₃) × 10^Multiplier ± Tol%` : `R = (D₁D₂) × 10^Multiplier ± Tol%`,
      explanation: 'Axial resistor EIA standard color code sequence.'
    };
  }
};

export const SeriesParallelResistanceDef = {
  id: 'series_parallel_resistance',
  name: 'Series & Parallel Resistance',
  category: 'engineering',
  icon: 'electrical',
  description: 'Calculate equivalent resistance, conductance, and branch currents for series and parallel circuits.',
  inputs: [
    {
      id: 'type',
      label: 'Circuit Configuration',
      type: 'segmented',
      defaultValue: 'parallel',
      options: [
        { label: 'Parallel', value: 'parallel' },
        { label: 'Series', value: 'series' }
      ]
    },
    { id: 'r1', label: 'Resistor R₁ (Ω)', type: 'number', defaultValue: 10 },
    { id: 'r2', label: 'Resistor R₂ (Ω)', type: 'number', defaultValue: 20 },
    { id: 'r3', label: 'Resistor R₃ (Ω - optional)', type: 'number', defaultValue: 30 }
  ],
  calculate: (vals) => {
    const isSeries = vals.type === 'series';
    const r1 = parseFloat(vals.r1) || 0;
    const r2 = parseFloat(vals.r2) || 0;
    const r3 = parseFloat(vals.r3) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (isSeries) {
      const totalR = r1 + r2 + r3;
      return {
        mainResult: `${fmt(totalR)} Ω`,
        mainLabel: 'Total Series Equivalent Resistance (R_eq)',
        subResult: `R_eq = R₁ + R₂ + R₃ = ${fmt(r1)} + ${fmt(r2)} + ${fmt(r3)}`,
        breakdown: [
          { label: 'Resistor R₁', value: `${fmt(r1)} Ω` },
          { label: 'Resistor R₂', value: `${fmt(r2)} Ω` },
          { label: 'Resistor R₃', value: r3 > 0 ? `${fmt(r3)} Ω` : 'None' },
          { label: 'Conductance (1/R)', value: totalR > 0 ? `${fmt(1 / totalR)} S (Siemens)` : '0' }
        ],
        formula: 'R_eq = R₁ + R₂ + R₃',
        explanation: 'In a series circuit, resistors add linearly because the same current flows through each element.'
      };
    }

    const invSum = (r1 > 0 ? 1 / r1 : 0) + (r2 > 0 ? 1 / r2 : 0) + (r3 > 0 ? 1 / r3 : 0);
    const totalR = invSum > 0 ? 1 / invSum : 0;

    return {
      mainResult: `${fmt(totalR)} Ω`,
      mainLabel: 'Total Parallel Equivalent Resistance (R_eq)',
      subResult: `Total Conductance: ${fmt(invSum)} Siemens (S)`,
      breakdown: [
        { label: 'Branch 1 Conductance', value: r1 > 0 ? `${fmt(1 / r1)} S` : '0' },
        { label: 'Branch 2 Conductance', value: r2 > 0 ? `${fmt(1 / r2)} S` : '0' },
        { label: 'Branch 3 Conductance', value: r3 > 0 ? `${fmt(1 / r3)} S` : 'None' },
        { label: 'Equivalent Resistance', value: `${fmt(totalR)} Ω` }
      ],
      formula: '1 / R_eq = 1/R₁ + 1/R₂ + 1/R₃',
      explanation: 'In a parallel circuit, total resistance is always less than the smallest individual branch resistor.'
    };
  }
};

export const ElectricalEnergyKwhDef = {
  id: 'electrical_energy_kwh',
  name: 'Power & Electrical Energy (kWh)',
  category: 'engineering',
  icon: 'electrical',
  description: 'Compute power load, energy consumption in kilowatt-hours (kWh), and cost per day, month, and year.',
  inputs: [
    { id: 'power', label: 'Appliance Power (Watts W)', type: 'number', defaultValue: 1500 },
    { id: 'hours', label: 'Usage per Day (Hours)', type: 'number', defaultValue: 5 },
    { id: 'tariff', label: 'Electricity Tariff (Cost per kWh)', type: 'number', defaultValue: 8.5 }
  ],
  calculate: (vals) => {
    const w = parseFloat(vals.power) || 0;
    const h = parseFloat(vals.hours) || 0;
    const tariff = parseFloat(vals.tariff) || 0;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });

    const dailyKwh = (w * h) / 1000;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;

    const dailyCost = dailyKwh * tariff;
    const monthlyCost = monthlyKwh * tariff;
    const yearlyCost = yearlyKwh * tariff;

    return {
      mainResult: `₹${fmt(monthlyCost)} / mo`,
      mainLabel: 'Monthly Electricity Cost',
      subResult: `Monthly Consumption: ${fmt(monthlyKwh)} kWh (Units)`,
      breakdown: [
        { label: 'Daily Energy', value: `${fmt(dailyKwh)} kWh` },
        { label: 'Daily Cost', value: `₹${fmt(dailyCost)}` },
        { label: 'Monthly Energy (30 days)', value: `${fmt(monthlyKwh)} kWh` },
        { label: 'Yearly Energy (365 days)', value: `${fmt(yearlyKwh)} kWh` },
        { label: 'Yearly Projected Cost', value: `₹${fmt(yearlyCost)}` }
      ],
      formula: `Energy (kWh) = (Watts × Hours) ÷ 1000,  Cost = kWh × Tariff Rate`,
      explanation: 'Calculates electrical power load consumption and utility bill expenditure.'
    };
  }
};

export const CapacitorCalcDef = {
  id: 'capacitor_calc',
  name: 'Capacitor Charge, Energy & Reactance',
  category: 'engineering',
  icon: 'electrical',
  description: 'Calculate capacitor stored charge Q, electrostatic energy E, and capacitive reactance Xc at specified AC frequency.',
  inputs: [
    { id: 'c', label: 'Capacitance (μF)', type: 'number', defaultValue: 100 },
    { id: 'v', label: 'Voltage across Capacitor (Volts V)', type: 'number', defaultValue: 24 },
    { id: 'freq', label: 'AC Frequency (Hz - optional for reactance)', type: 'number', defaultValue: 50 }
  ],
  calculate: (vals) => {
    const cMicro = parseFloat(vals.c) || 0;
    const cFarads = cMicro * 1e-6;
    const v = parseFloat(vals.v) || 0;
    const freq = parseFloat(vals.freq) || 50;

    const qCoulombs = cFarads * v;
    const energyJoules = 0.5 * cFarads * Math.pow(v, 2);
    const xc = (freq > 0 && cFarads > 0) ? 1 / (2 * Math.PI * freq * cFarads) : 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US');

    return {
      mainResult: `${(energyJoules * 1000).toFixed(2)} mJ (${(energyJoules).toFixed(4)} J)`,
      mainLabel: 'Stored Electrostatic Energy',
      subResult: `Stored Charge: ${(qCoulombs * 1000).toFixed(2)} mC (Millicoulombs)`,
      breakdown: [
        { label: 'Stored Energy (E = ½CV²)', value: `${(energyJoules * 1000).toFixed(2)} mJ` },
        { label: 'Stored Charge (Q = C·V)', value: `${(qCoulombs * 1000).toFixed(3)} mC` },
        { label: `Capacitive Reactance Xc (@${freq}Hz)`, value: `${fmt(xc)} Ω` },
        { label: 'Applied Voltage', value: `${v} V` }
      ],
      formula: 'Q = C × V,  E = ½ × C × V²,  Xc = 1 ÷ (2 × π × f × C)',
      explanation: 'Calculates fundamental electrostatic capacitance storage and AC frequency impedance.'
    };
  }
};

export const InductorCalcDef = {
  id: 'inductor_calc',
  name: 'Inductor Reactance & Magnetic Energy',
  category: 'engineering',
  icon: 'electrical',
  description: 'Compute inductive reactance (XL), stored magnetic field energy (Joules), and voltage induced.',
  inputs: [
    { id: 'l', label: 'Inductance (mH - Millihenries)', type: 'number', defaultValue: 10 },
    { id: 'i', label: 'Current (Amperes A)', type: 'number', defaultValue: 2.5 },
    { id: 'freq', label: 'AC Frequency (Hz)', type: 'number', defaultValue: 1000 }
  ],
  calculate: (vals) => {
    const lMh = parseFloat(vals.l) || 0;
    const lHenries = lMh * 1e-3;
    const current = parseFloat(vals.i) || 0;
    const freq = parseFloat(vals.freq) || 0;

    const xl = 2 * Math.PI * freq * lHenries;
    const energy = 0.5 * lHenries * Math.pow(current, 2);

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(xl)} Ω Reactance`,
      mainLabel: 'Inductive Reactance (X_L)',
      subResult: `Stored Magnetic Energy: ${(energy * 1000).toFixed(2)} mJ`,
      breakdown: [
        { label: 'Inductive Reactance (X_L)', value: `${fmt(xl)} Ω` },
        { label: 'Stored Magnetic Energy', value: `${(energy * 1000).toFixed(2)} mJ` },
        { label: 'Inductance in Henries', value: `${lHenries} H` },
        { label: 'Operating Frequency', value: `${freq} Hz` }
      ],
      formula: 'X_L = 2 × π × f × L,  E = ½ × L × I²',
      explanation: 'Electromagnetic induction opposition to alternating current and magnetic flux energy.'
    };
  }
};

export const AcImpedanceCalcDef = {
  id: 'ac_impedance_calc',
  name: 'AC Circuit RLC Impedance & Resonance',
  category: 'engineering',
  icon: 'electrical',
  description: 'Calculate series RLC circuit total impedance Z, phase angle θ, power factor, and resonant frequency f₀.',
  inputs: [
    { id: 'r', label: 'Resistance R (Ω)', type: 'number', defaultValue: 50 },
    { id: 'l', label: 'Inductance L (mH)', type: 'number', defaultValue: 20 },
    { id: 'c', label: 'Capacitance C (μF)', type: 'number', defaultValue: 10 },
    { id: 'f', label: 'Frequency f (Hz)', type: 'number', defaultValue: 350 }
  ],
  calculate: (vals) => {
    const r = parseFloat(vals.r) || 0;
    const lMh = parseFloat(vals.l) || 0;
    const cUf = parseFloat(vals.c) || 0;
    const f = parseFloat(vals.f) || 50;

    const lH = lMh * 1e-3;
    const cF = cUf * 1e-6;

    const xl = 2 * Math.PI * f * lH;
    const xc = (f > 0 && cF > 0) ? 1 / (2 * Math.PI * f * cF) : 0;
    const xNet = xl - xc;
    const z = Math.sqrt(Math.pow(r, 2) + Math.pow(xNet, 2));

    const phaseRad = Math.atan2(xNet, r);
    const phaseDeg = phaseRad * (180 / Math.PI);
    const powerFactor = Math.cos(phaseRad);

    const f0 = (lH > 0 && cF > 0) ? 1 / (2 * Math.PI * Math.sqrt(lH * cF)) : 0;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(z)} Ω`,
      mainLabel: 'Total AC Impedance (Z)',
      subResult: `Resonant Frequency f₀: ${fmt(f0)} Hz | PF: ${powerFactor.toFixed(3)} (${phaseDeg >= 0 ? 'Inductive Lag' : 'Capacitive Lead'})`,
      breakdown: [
        { label: 'Total Impedance (Z)', value: `${fmt(z)} Ω` },
        { label: 'Inductive Reactance (X_L)', value: `${fmt(xl)} Ω` },
        { label: 'Capacitive Reactance (X_C)', value: `${fmt(xc)} Ω` },
        { label: 'Net Reactance (X_L − X_C)', value: `${fmt(xNet)} Ω` },
        { label: 'Phase Angle (θ)', value: `${fmt(phaseDeg)}°` },
        { label: 'Power Factor (cos θ)', value: powerFactor.toFixed(4) }
      ],
      formula: 'Z = √(R² + (X_L − X_C)²),  f₀ = 1 ÷ (2π√(LC))',
      explanation: 'AC sinusoidal steady-state vector impedance analysis.'
    };
  }
};

export const LedResistorDef = {
  id: 'led_resistor_calc',
  name: 'LED Series Current Limiting Resistor',
  category: 'engineering',
  icon: 'electrical',
  description: 'Calculate current limiting resistor (Ω) and wattage power rating for LED circuits.',
  inputs: [
    { id: 'vs', label: 'Power Supply Voltage (Vs in Volts)', type: 'number', defaultValue: 12 },
    { id: 'vf', label: 'LED Forward Voltage Drop (Vf in Volts)', type: 'number', defaultValue: 2.2 },
    { id: 'if', label: 'Desired LED Current (If in mA)', type: 'number', defaultValue: 20 }
  ],
  calculate: (vals) => {
    const vs = parseFloat(vals.vs) || 5;
    const vf = parseFloat(vals.vf) || 2;
    const if_mA = parseFloat(vals.if) || 20;

    const if_A = if_mA / 1000;
    const vDrop = vs - vf;

    if (vDrop <= 0) {
      return {
        mainResult: 'Voltage Insufficient',
        mainLabel: 'Error',
        subResult: 'Supply voltage Vs must be greater than LED forward voltage Vf',
        breakdown: [],
        formula: 'Vs > Vf',
        explanation: 'Supply voltage is too low to forward-bias the LED.'
      };
    }

    const r = vDrop / if_A;
    const powerW = vDrop * if_A;

    const standardRes = [100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000, 1200, 1500, 2200];
    const recommended = standardRes.find(val => val >= r) || Math.ceil(r);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(r)} Ω (Nearest: ${recommended} Ω)`,
      mainLabel: 'Required Resistor Value',
      subResult: `Resistor Power Dissipation: ${fmt(powerW * 1000)} mW (Use ${powerW > 0.25 ? '½ Watt' : '¼ Watt'})`,
      breakdown: [
        { label: 'Exact Calculated Resistance', value: `${fmt(r)} Ω` },
        { label: 'Voltage Across Resistor', value: `${fmt(vDrop)} V` },
        { label: 'Resistor Power Rating', value: `${fmt(powerW * 1000)} mW` },
        { label: 'Recommended Standard E12', value: `${recommended} Ω` }
      ],
      formula: `R = (Vs − Vf) ÷ If = (${vs} − ${vf}) ÷ ${if_A} = ${fmt(r)} Ω`,
      explanation: 'Protects semiconductor diode junction from excessive thermal burnout current.'
    };
  }
};

export const VoltageDividerDef = {
  id: 'voltage_divider_calc',
  name: 'Voltage Divider Calculator',
  category: 'engineering',
  icon: 'electrical',
  description: 'Compute output voltage Vout and current through a two-resistor voltage divider.',
  inputs: [
    { id: 'vin', label: 'Input Voltage (Vin in Volts)', type: 'number', defaultValue: 12 },
    { id: 'r1', label: 'Top Resistor R₁ (kΩ)', type: 'number', defaultValue: 10 },
    { id: 'r2', label: 'Bottom Resistor R₂ (kΩ)', type: 'number', defaultValue: 4.7 }
  ],
  calculate: (vals) => {
    const vin = parseFloat(vals.vin) || 0;
    const r1 = parseFloat(vals.r1) || 1;
    const r2 = parseFloat(vals.r2) || 1;

    const vout = vin * (r2 / (r1 + r2));
    const current_mA = vin / (r1 + r2);

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US', { maximumFractionDigits: 3 });

    return {
      mainResult: `${fmt(vout)} Volts`,
      mainLabel: 'Output Voltage (Vout)',
      subResult: `Division Ratio: ${(r2 / (r1 + r2)).toFixed(4)}x`,
      breakdown: [
        { label: 'Output Voltage (Vout)', value: `${fmt(vout)} V` },
        { label: 'Divider Current', value: `${fmt(current_mA)} mA` },
        { label: 'Voltage Drop across R₁', value: `${fmt(vin - vout)} V` },
        { label: 'Total Resistance', value: `${fmt(r1 + r2)} kΩ` }
      ],
      formula: `Vout = Vin × (R₂ ÷ (R₁ + R₂)) = ${vin} × (${r2} ÷ ${r1 + r2}) = ${fmt(vout)}V`,
      explanation: 'Linear resistive potential attenuation circuit.'
    };
  }
};

export const BatteryRuntimeDef = {
  id: 'battery_runtime_capacity',
  name: 'Battery Backup & Runtime Estimator',
  category: 'engineering',
  icon: 'electrical',
  description: 'Estimate battery backup duration based on capacity (Ah), system voltage, load watts, and discharge efficiency.',
  inputs: [
    { id: 'ah', label: 'Battery Capacity (Ah)', type: 'number', defaultValue: 150 },
    { id: 'v', label: 'Battery Voltage (V)', type: 'number', defaultValue: 12 },
    { id: 'load', label: 'Load Power (Watts W)', type: 'number', defaultValue: 300 },
    { id: 'eff', label: 'Efficiency / Depth of Discharge (%)', type: 'number', defaultValue: 85 }
  ],
  calculate: (vals) => {
    const ah = parseFloat(vals.ah) || 0;
    const v = parseFloat(vals.v) || 12;
    const load = parseFloat(vals.load) || 1;
    const eff = (parseFloat(vals.eff) || 85) / 100;

    const totalWattHours = ah * v * eff;
    const hours = totalWattHours / load;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });

    return {
      mainResult: `${h} hrs ${m} mins`,
      mainLabel: 'Estimated Battery Backup Time',
      subResult: `Usable Energy Capacity: ${fmt(totalWattHours)} Wh`,
      breakdown: [
        { label: 'Gross Energy (V × Ah)', value: `${fmt(ah * v)} Wh` },
        { label: 'Usable Energy with DOD', value: `${fmt(totalWattHours)} Wh` },
        { label: 'Discharge Current', value: `${fmt(load / v)} Amperes` },
        { label: 'Total Decimal Hours', value: `${fmt(hours)} hrs` }
      ],
      formula: `Runtime (hrs) = (Capacity Ah × Voltage V × Efficiency) ÷ Load Watts`,
      explanation: 'Determines continuous power runtime under specified wattage demand.'
    };
  }
};

export const WireVoltageDropDef = {
  id: 'wire_size_voltage_drop',
  name: 'Wire Size & Voltage Drop Calculator',
  category: 'engineering',
  icon: 'electrical',
  description: 'Calculate copper wire voltage drop, percentage loss, and end-of-line delivered voltage.',
  inputs: [
    { id: 'v', label: 'Source Voltage (Volts V)', type: 'number', defaultValue: 230 },
    { id: 'i', label: 'Load Current (Amps A)', type: 'number', defaultValue: 15 },
    { id: 'len', label: 'One-Way Cable Distance (meters)', type: 'number', defaultValue: 50 },
    { id: 'csa', label: 'Conductor Cross Section (mm²)', type: 'number', defaultValue: 2.5 }
  ],
  calculate: (vals) => {
    const v = parseFloat(vals.v) || 230;
    const current = parseFloat(vals.i) || 0;
    const lenM = parseFloat(vals.len) || 0;
    const csa = parseFloat(vals.csa) || 2.5;

    const rho = 0.0175;
    const totalLength = 2 * lenM;
    const r = (rho * totalLength) / csa;
    const vDrop = current * r;
    const pctDrop = (vDrop / v) * 100;
    const endV = Math.max(0, v - vDrop);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(vDrop)} V (${fmt(pctDrop)}% Loss)`,
      mainLabel: 'Cable Voltage Drop',
      subResult: `Delivered Voltage: ${fmt(endV)} V ${pctDrop > 5 ? '⚠️ Exceeds 5% Max Limit' : '✅ Within 3-5% IEC Standard'}`,
      breakdown: [
        { label: 'Voltage Drop (ΔV)', value: `${fmt(vDrop)} V` },
        { label: 'Percentage Drop', value: `${fmt(pctDrop)}%` },
        { label: 'End-of-Line Voltage', value: `${fmt(endV)} V` },
        { label: 'Loop Cable Resistance', value: `${fmt(r)} Ω` }
      ],
      formula: 'ΔV = (2 × L × ρ × I) ÷ Area',
      explanation: 'Ensures cable size complies with NEC/IEC allowable voltage drop thresholds.'
    };
  }
};


// ==========================================
// 2. ⚙️ MECHANICAL ENGINEERING
// ==========================================

export const TorqueCalcDef = {
  id: 'torque_calc',
  name: 'Torque Calculator',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate rotational torque (τ = F × r × sin θ) from applied force and lever moment arm distance.',
  inputs: [
    { id: 'f', label: 'Applied Force (Newtons N)', type: 'number', defaultValue: 150 },
    { id: 'r', label: 'Lever Arm Radius / Distance (meters m)', type: 'number', defaultValue: 0.4 },
    { id: 'angle', label: 'Angle of Force (Degrees °)', type: 'number', defaultValue: 90 }
  ],
  calculate: (vals) => {
    const f = parseFloat(vals.f) || 0;
    const r = parseFloat(vals.r) || 0;
    const angleDeg = parseFloat(vals.angle) || 90;

    const rad = angleDeg * (Math.PI / 180);
    const torqueNm = f * r * Math.sin(rad);
    const torqueLbFt = torqueNm * 0.737562;
    const torqueKgfM = torqueNm * 0.101972;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(torqueNm)} N·m (${fmt(torqueLbFt)} lb-ft)`,
      mainLabel: 'Rotational Torque (τ)',
      subResult: `Torque in kgf·m: ${fmt(torqueKgfM)} kgf·m`,
      breakdown: [
        { label: 'Torque (N·m)', value: `${fmt(torqueNm)} N·m` },
        { label: 'Torque (lb-ft)', value: `${fmt(torqueLbFt)} lb-ft` },
        { label: 'Torque (kgf·m)', value: `${fmt(torqueKgfM)} kgf·m` },
        { label: 'Perpendicular Force Component', value: `${fmt(f * Math.sin(rad))} N` }
      ],
      formula: 'τ = Force × Radius × sin(θ) = F × r × sin(θ)',
      explanation: 'Calculates rotational twisting moment generated about an axis of rotation.'
    };
  }
};

export const MechanicalPowerCalcDef = {
  id: 'mechanical_power_calc',
  name: 'Mechanical Power & Motor HP Calculator',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate shaft mechanical power (kW and Horsepower) from rotational torque and shaft speed (RPM).',
  inputs: [
    { id: 'torque', label: 'Shaft Torque (N·m)', type: 'number', defaultValue: 250 },
    { id: 'rpm', label: 'Rotational Speed (RPM)', type: 'number', defaultValue: 1800 }
  ],
  calculate: (vals) => {
    const torque = parseFloat(vals.torque) || 0;
    const rpm = parseFloat(vals.rpm) || 0;

    const omega = (2 * Math.PI * rpm) / 60; // rad/s
    const powerWatts = torque * omega;
    const powerKw = powerWatts / 1000;
    const powerHp = powerKw * 1.34102;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(powerKw)} kW (${fmt(powerHp)} HP)`,
      mainLabel: 'Mechanical Power Output',
      subResult: `Angular Velocity: ${fmt(omega)} rad/sec`,
      breakdown: [
        { label: 'Power in Kilowatts', value: `${fmt(powerKw)} kW` },
        { label: 'Power in Horsepower', value: `${fmt(powerHp)} HP` },
        { label: 'Angular Velocity (ω)', value: `${fmt(omega)} rad/s` },
        { label: 'Shaft Torque', value: `${fmt(torque)} N·m` }
      ],
      formula: 'Power (kW) = (Torque × RPM) ÷ 9549,  HP = kW × 1.341',
      explanation: 'Relates rotational mechanics torque and speed to mechanical power transmission.'
    };
  }
};

export const GearRatioSpeedDef = {
  id: 'gear_ratio_speed',
  name: 'Gear Ratio & Output Speed',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate gear ratio, driven gear RPM, output torque, and mechanical speed reduction.',
  inputs: [
    { id: 't1', label: 'Driver Gear Teeth (N₁)', type: 'number', defaultValue: 15 },
    { id: 't2', label: 'Driven Gear Teeth (N₂)', type: 'number', defaultValue: 45 },
    { id: 'rpm1', label: 'Input Driver Speed (RPM)', type: 'number', defaultValue: 1800 },
    { id: 'torque1', label: 'Input Torque (Nm)', type: 'number', defaultValue: 25 }
  ],
  calculate: (vals) => {
    const t1 = parseFloat(vals.t1) || 1;
    const t2 = parseFloat(vals.t2) || 1;
    const rpm1 = parseFloat(vals.rpm1) || 0;
    const torque1 = parseFloat(vals.torque1) || 0;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });

    const ratio = t2 / t1;
    const rpm2 = rpm1 / ratio;
    const torque2 = torque1 * ratio;

    return {
      mainResult: `${fmt(rpm2)} RPM`,
      mainLabel: 'Output Driven Speed (RPM)',
      subResult: `Gear Ratio: ${fmt(ratio)} : 1 (${ratio > 1 ? 'Speed Reduction' : 'Overdrive'})`,
      breakdown: [
        { label: 'Gear Ratio (N₂ / N₁)', value: `${fmt(ratio)} : 1` },
        { label: 'Input Speed', value: `${fmt(rpm1)} RPM` },
        { label: 'Output Torque (Nm)', value: `${fmt(torque2)} Nm` },
        { label: 'Mechanical Advantage', value: `${fmt(ratio)}x` }
      ],
      formula: `Ratio = N₂ ÷ N₁,  RPM₂ = RPM₁ ÷ Ratio,  Torque₂ = Torque₁ × Ratio`,
      explanation: 'Calculates rotational mechanical advantage and kinematic gear transmission speed.'
    };
  }
};

export const RpmSpeedCalcDef = {
  id: 'rpm_speed_calc',
  name: 'RPM & Cutting Surface Speed',
  category: 'engineering',
  icon: 'engineering',
  description: 'Convert tool/wheel diameter and rotational RPM into peripheral cutting speed and surface linear velocity.',
  inputs: [
    { id: 'd', label: 'Tool / Wheel Diameter (mm)', type: 'number', defaultValue: 100 },
    { id: 'rpm', label: 'Spindle Rotational Speed (RPM)', type: 'number', defaultValue: 1200 }
  ],
  calculate: (vals) => {
    const dMm = parseFloat(vals.d) || 0;
    const rpm = parseFloat(vals.rpm) || 0;

    const dM = dMm / 1000;
    const surfaceSpeedMMin = (Math.PI * dMm * rpm) / 1000;
    const surfaceSpeedMs = surfaceSpeedMMin / 60;
    const sfm = surfaceSpeedMMin * 3.28084; // Surface feet per minute

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(surfaceSpeedMMin)} m/min (${fmt(surfaceSpeedMs)} m/s)`,
      mainLabel: 'Peripheral Surface Speed',
      subResult: `Surface Feet / Min (SFM): ${fmt(sfm)} SFM`,
      breakdown: [
        { label: 'Surface Velocity (m/min)', value: `${fmt(surfaceSpeedMMin)} m/min` },
        { label: 'Surface Velocity (m/s)', value: `${fmt(surfaceSpeedMs)} m/s` },
        { label: 'Surface Speed (SFM)', value: `${fmt(sfm)} ft/min` },
        { label: 'Circumference', value: `${fmt(Math.PI * dMm)} mm` }
      ],
      formula: 'Cutting Speed (m/min) = (π × D × RPM) ÷ 1000',
      explanation: 'Determines peripheral tangential machining cutting speed and rotational tooling speeds.'
    };
  }
};

export const ForceCalculatorDef = {
  id: 'force_calculator',
  name: 'Force, Mass & Acceleration (F = m·a)',
  category: 'engineering',
  icon: 'engineering',
  description: 'Compute mechanical force, acceleration, and kinetic weight based on Newton\'s Second Law of Motion.',
  inputs: [
    { id: 'm', label: 'Mass (kg)', type: 'number', defaultValue: 75 },
    { id: 'a', label: 'Acceleration (m/s² - Earth Gravity = 9.80665)', type: 'number', defaultValue: 9.80665 }
  ],
  calculate: (vals) => {
    const m = parseFloat(vals.m) || 0;
    const a = parseFloat(vals.a) || 0;

    const fNewtons = m * a;
    const fKn = fNewtons / 1000;
    const fLbf = fNewtons * 0.224809;
    const fKgf = fNewtons / 9.80665;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(fNewtons)} N (${fmt(fKn)} kN)`,
      mainLabel: 'Resultant Force (F)',
      subResult: `Imperial Force: ${fmt(fLbf)} lbf (${fmt(fKgf)} kgf)`,
      breakdown: [
        { label: 'Force in Newtons', value: `${fmt(fNewtons)} N` },
        { label: 'Force in Kilonewtons', value: `${fmt(fKn)} kN` },
        { label: 'Force in Pounds (lbf)', value: `${fmt(fLbf)} lbf` },
        { label: 'Mass', value: `${m} kg` }
      ],
      formula: 'F = Mass × Acceleration = m × a',
      explanation: 'Newtonian classical mechanics foundation for dynamic and static load forces.'
    };
  }
};

export const WorkEnergyCalcDef = {
  id: 'work_energy_calc',
  name: 'Mechanical Work & Kinetic Energy',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate mechanical work done, kinetic energy (½mv²), and gravitational potential energy (mgh).',
  inputs: [
    { id: 'f', label: 'Force (N)', type: 'number', defaultValue: 500 },
    { id: 'd', label: 'Displacement Distance (m)', type: 'number', defaultValue: 12 },
    { id: 'm', label: 'Object Mass (kg - for Kinetic Energy)', type: 'number', defaultValue: 50 },
    { id: 'v', label: 'Velocity (m/s - for Kinetic Energy)', type: 'number', defaultValue: 15 }
  ],
  calculate: (vals) => {
    const f = parseFloat(vals.f) || 0;
    const d = parseFloat(vals.d) || 0;
    const m = parseFloat(vals.m) || 0;
    const v = parseFloat(vals.v) || 0;

    const workJoules = f * d;
    const keJoules = 0.5 * m * Math.pow(v, 2);
    const workKj = workJoules / 1000;
    const keKj = keJoules / 1000;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(workKj)} kJ (${fmt(workJoules)} Joules)`,
      mainLabel: 'Mechanical Work Done (W)',
      subResult: `Kinetic Energy of Motion: ${fmt(keKj)} kJ (${fmt(keJoules)} J)`,
      breakdown: [
        { label: 'Work (W = F·d)', value: `${fmt(workJoules)} J` },
        { label: 'Work (in kJ)', value: `${fmt(workKj)} kJ` },
        { label: 'Kinetic Energy (½mv²)', value: `${fmt(keJoules)} J` },
        { label: 'Kinetic Momentum (p = m·v)', value: `${fmt(m * v)} kg·m/s` }
      ],
      formula: 'Work = Force × Distance,  KE = ½ × Mass × Velocity²',
      explanation: 'Conservation of mechanical energy and work-energy theorem.'
    };
  }
};

export const SpringForceCalcDef = {
  id: 'spring_force_calc',
  name: 'Spring Force & Elastic Potential Energy',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate Hooke\'s law spring force (F = k·x), displacement, and stored elastic strain energy.',
  inputs: [
    { id: 'k', label: 'Spring Rate / Constant k (N/mm)', type: 'number', defaultValue: 25 },
    { id: 'x', label: 'Displacement / Compression x (mm)', type: 'number', defaultValue: 30 }
  ],
  calculate: (vals) => {
    const k_Nmm = parseFloat(vals.k) || 0;
    const x_mm = parseFloat(vals.x) || 0;

    const k_Nm = k_Nmm * 1000; // N/m
    const x_m = x_mm / 1000; // m

    const forceN = k_Nmm * x_mm;
    const energyJ = 0.5 * k_Nm * Math.pow(x_m, 2);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(forceN)} N (${(forceN / 9.80665).toFixed(2)} kgf)`,
      mainLabel: 'Restoring Spring Force (F)',
      subResult: `Stored Elastic Energy: ${fmt(energyJ)} Joules`,
      breakdown: [
        { label: 'Spring Force (F = k·x)', value: `${fmt(forceN)} N` },
        { label: 'Stored Energy (E = ½kx²)', value: `${fmt(energyJ)} J` },
        { label: 'Spring Constant (N/m)', value: `${fmt(k_Nm)} N/m` },
        { label: 'Compression / Extension', value: `${x_mm} mm` }
      ],
      formula: 'F = k × x,  Energy = ½ × k × x²',
      explanation: 'Hooke\'s law linear elasticity for helical coil springs.'
    };
  }
};

export const PulleyBeltDef = {
  id: 'pulley_belt_calc',
  name: 'Pulley Speed & Belt Length',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate driven pulley RPM, belt speed (m/s), and open belt pitch length.',
  inputs: [
    { id: 'd1', label: 'Driver Pulley Diameter (D₁ mm)', type: 'number', defaultValue: 100 },
    { id: 'd2', label: 'Driven Pulley Diameter (D₂ mm)', type: 'number', defaultValue: 250 },
    { id: 'rpm1', label: 'Driver Motor Speed (RPM)', type: 'number', defaultValue: 1440 },
    { id: 'dist', label: 'Center-to-Center Distance (C mm)', type: 'number', defaultValue: 500 }
  ],
  calculate: (vals) => {
    const d1 = parseFloat(vals.d1) || 1;
    const d2 = parseFloat(vals.d2) || 1;
    const rpm1 = parseFloat(vals.rpm1) || 0;
    const c = parseFloat(vals.dist) || 500;

    const ratio = d2 / d1;
    const rpm2 = rpm1 / ratio;
    const beltSpeedMs = (Math.PI * (d1 / 1000) * rpm1) / 60;
    const beltLenMm = 2 * c + (Math.PI * (d1 + d2)) / 2 + Math.pow(d2 - d1, 2) / (4 * c);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(rpm2)} RPM`,
      mainLabel: 'Driven Pulley Speed',
      subResult: `Belt Pitch Length: ${fmt(beltLenMm)} mm (${(beltLenMm / 25.4).toFixed(1)} inches)`,
      breakdown: [
        { label: 'Speed Ratio (D₂/D₁)', value: `${fmt(ratio)} : 1` },
        { label: 'Driven RPM', value: `${fmt(rpm2)} RPM` },
        { label: 'Belt Linear Speed', value: `${fmt(beltSpeedMs)} m/s` },
        { label: 'Center Distance', value: `${c} mm` }
      ],
      formula: 'RPM₂ = RPM₁ × (D₁ ÷ D₂),  Length = 2C + π(D₁+D₂)/2 + (D₂−D₁)²/(4C)',
      explanation: 'Mechanical power transmission design for V-belt and flat belt drives.'
    };
  }
};

export const ShaftPowerCalcDef = {
  id: 'shaft_power_calc',
  name: 'Shaft Power, Diameter & Torsional Stress',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate solid drive shaft diameter, allowable torsional shear stress, and transmitted torque.',
  inputs: [
    { id: 'power', label: 'Transmitted Power (kW)', type: 'number', defaultValue: 45 },
    { id: 'rpm', label: 'Shaft Speed (RPM)', type: 'number', defaultValue: 1440 },
    { id: 'tau', label: 'Allowable Shear Stress τ (MPa - Steel=40-60)', type: 'number', defaultValue: 50 }
  ],
  calculate: (vals) => {
    const powerKw = parseFloat(vals.power) || 0;
    const rpm = parseFloat(vals.rpm) || 1;
    const tauMpa = parseFloat(vals.tau) || 50;

    const torqueNm = (powerKw * 9549) / rpm;
    const torqueNmm = torqueNm * 1000;
    const dMm = Math.pow((16 * torqueNmm) / (Math.PI * tauMpa), 1 / 3);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `Ø ${fmt(dMm)} mm (Min Shaft Diameter)`,
      mainLabel: 'Required Solid Shaft Diameter',
      subResult: `Transmitted Torque: ${fmt(torqueNm)} N·m`,
      breakdown: [
        { label: 'Minimum Shaft Diameter', value: `${fmt(dMm)} mm` },
        { label: 'Design Torque', value: `${fmt(torqueNm)} N·m` },
        { label: 'Allowable Shear Stress', value: `${tauMpa} MPa (N/mm²)` },
        { label: 'Shaft Power Rating', value: `${powerKw} kW (${(powerKw * 1.341).toFixed(1)} HP)` }
      ],
      formula: 'd = ∛((16 × Torque) ÷ (π × τ_allow)),  Torque = (9549 × kW) ÷ RPM',
      explanation: 'Torsion formula for solid circular drive shafts under torsional stress.'
    };
  }
};

export const BearingLifeCalcDef = {
  id: 'bearing_life_calc',
  name: 'Bearing Rating Life (ISO L10)',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate basic rating life of ball and roller bearings in millions of revolutions and operating hours.',
  inputs: [
    {
      id: 'type',
      label: 'Bearing Type',
      type: 'segmented',
      defaultValue: 'ball',
      options: [
        { label: 'Ball Bearing (p=3)', value: 'ball' },
        { label: 'Roller Bearing (p=10/3)', value: 'roller' }
      ]
    },
    { id: 'c', label: 'Dynamic Load Rating C (kN)', type: 'number', defaultValue: 28 },
    { id: 'p', label: 'Equivalent Dynamic Load P (kN)', type: 'number', defaultValue: 4.5 },
    { id: 'rpm', label: 'Operating Speed (RPM)', type: 'number', defaultValue: 1500 }
  ],
  calculate: (vals) => {
    const isBall = vals.type === 'ball';
    const c = parseFloat(vals.c) || 1;
    const p = parseFloat(vals.p) || 1;
    const rpm = parseFloat(vals.rpm) || 1;

    const exponent = isBall ? 3 : (10 / 3);
    const l10_revs = Math.pow(c / p, exponent); // In millions of revolutions
    const l10_hours = (l10_revs * 1e6) / (60 * rpm);

    const fmt = (n) => parseFloat(n.toFixed(0)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(l10_hours)} Operating Hours`,
      mainLabel: 'Bearing Rating Life (L₁₀h)',
      subResult: `Life in Revolutions: ${l10_revs.toFixed(2)} Million Revs`,
      breakdown: [
        { label: 'Life in Operating Hours (L₁₀h)', value: `${fmt(l10_hours)} hrs` },
        { label: 'Life in Revolutions (L₁₀)', value: `${l10_revs.toFixed(2)} × 10⁶ revs` },
        { label: 'Load Ratio (C / P)', value: `${(c / p).toFixed(2)}x` },
        { label: 'Bearing Exponent p', value: isBall ? '3 (Ball)' : '3.33 (Roller)' }
      ],
      formula: 'L₁₀ = (C ÷ P)^p × 10⁶ revs,  L₁₀h = (L₁₀) ÷ (60 × RPM)',
      explanation: 'ISO 281 standard fatigue rating life expectation for anti-friction bearings.'
    };
  }
};


// ==========================================
// 3. 🏗️ CIVIL ENGINEERING
// ==========================================

export const BeamDeflectionStressDef = {
  id: 'beam_deflection_stress',
  name: 'Beam Bending Stress & Deflection',
  category: 'engineering',
  icon: 'construction',
  description: 'Calculate maximum bending moment, maximum bending stress, and center deflection of simply supported beams.',
  inputs: [
    { id: 'p', label: 'Center Point Load (P in kN)', type: 'number', defaultValue: 25 },
    { id: 'l', label: 'Beam Span Length (L in meters)', type: 'number', defaultValue: 6 },
    { id: 'e', label: 'Elastic Modulus E (GPa - Steel=200, Concrete=30)', type: 'number', defaultValue: 200 },
    { id: 'i', label: 'Moment of Inertia I (cm⁴)', type: 'number', defaultValue: 5000 }
  ],
  calculate: (vals) => {
    const P_kN = parseFloat(vals.p) || 0;
    const L_m = parseFloat(vals.l) || 1;
    const E_GPa = parseFloat(vals.e) || 200;
    const I_cm4 = parseFloat(vals.i) || 5000;

    const P = P_kN * 1000;
    const L = L_m * 1000;
    const E = E_GPa * 1000;
    const I = I_cm4 * 10000;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });

    const maxMoment_kNm = (P_kN * L_m) / 4;
    const maxDeflection_mm = (P * Math.pow(L, 3)) / (48 * E * I);
    const spanRatio = maxDeflection_mm > 0 ? `L / ${Math.round(L / maxDeflection_mm)}` : 'N/A';

    return {
      mainResult: `${fmt(maxDeflection_mm)} mm`,
      mainLabel: 'Maximum Center Deflection (δ_max)',
      subResult: `Deflection Limit Ratio: ${spanRatio} (Standard: L/360)`,
      breakdown: [
        { label: 'Max Bending Moment (M_max)', value: `${fmt(maxMoment_kNm)} kN·m` },
        { label: 'Max Deflection (δ_max)', value: `${fmt(maxDeflection_mm)} mm` },
        { label: 'Span-to-Deflection Ratio', value: spanRatio },
        { label: 'Beam Span', value: `${L_m} meters` }
      ],
      formula: `δ_max = (P × L³) ÷ (48 × E × I),  M_max = (P × L) ÷ 4`,
      explanation: 'Calculates structural beam elasticity deflection and critical central moment.'
    };
  }
};

export const StressStrainCalcDef = {
  id: 'stress_strain_calc',
  name: 'Stress, Strain & Young\'s Modulus',
  category: 'engineering',
  icon: 'construction',
  description: 'Calculate tensile/compressive axial stress (σ = F/A), engineering strain (ε = ΔL/L), and elongation under load.',
  inputs: [
    { id: 'f', label: 'Axial Load Force (kN)', type: 'number', defaultValue: 50 },
    { id: 'area', label: 'Cross-Section Area (mm²)', type: 'number', defaultValue: 500 },
    { id: 'len', label: 'Original Length L₀ (meters)', type: 'number', defaultValue: 3 },
    { id: 'e', label: 'Young\'s Modulus E (GPa - Steel=200, Al=70)', type: 'number', defaultValue: 200 }
  ],
  calculate: (vals) => {
    const fKn = parseFloat(vals.f) || 0;
    const areaMm2 = parseFloat(vals.area) || 1;
    const lenM = parseFloat(vals.len) || 1;
    const eGpa = parseFloat(vals.e) || 200;

    const fN = fKn * 1000;
    const stressMpa = fN / areaMm2; // N/mm² = MPa
    const eMpa = eGpa * 1000; // MPa
    const strain = stressMpa / eMpa;
    const deltaL_mm = (strain * lenM * 1000);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(stressMpa)} MPa (N/mm²)`,
      mainLabel: 'Normal Direct Stress (σ)',
      subResult: `Total Elongation ΔL: ${deltaL_mm.toFixed(3)} mm (Strain: ${(strain * 1e6).toFixed(1)} µε)`,
      breakdown: [
        { label: 'Axial Stress (σ)', value: `${fmt(stressMpa)} MPa` },
        { label: 'Elongation / Extension (ΔL)', value: `${deltaL_mm.toFixed(3)} mm` },
        { label: 'Engineering Strain (ε)', value: strain.toExponential(3) },
        { label: 'Applied Load', value: `${fKn} kN` }
      ],
      formula: 'σ = Force ÷ Area,  ΔL = (F × L₀) ÷ (A × E),  ε = ΔL ÷ L₀',
      explanation: 'Mechanics of materials axial deformation and Hookean stress-strain relation.'
    };
  }
};

export const BrickBlockEstimatorDef = {
  id: 'brick_block_estimator',
  name: 'Brick & Masonry Quantity Estimator',
  category: 'engineering',
  icon: 'construction',
  description: 'Estimate total bricks, mortar volume, and cement/sand requirements for masonry walls.',
  inputs: [
    { id: 'l', label: 'Wall Length (ft)', type: 'number', defaultValue: 30 },
    { id: 'h', label: 'Wall Height (ft)', type: 'number', defaultValue: 10 },
    { id: 'thick', label: 'Wall Thickness', type: 'select', defaultValue: '9', options: [{ label: '4.5 inch (Single Brick)', value: '4.5' }, { label: '9 inch (Double Brick)', value: '9' }] },
    { id: 'waste', label: 'Wastage Margin (%)', type: 'number', defaultValue: 5 }
  ],
  calculate: (vals) => {
    const l = parseFloat(vals.l) || 0;
    const h = parseFloat(vals.h) || 0;
    const thick = vals.thick === '9' ? 9 : 4.5;
    const wasteRaw = parseFloat(vals.waste);
    const waste = (!isNaN(wasteRaw) ? wasteRaw : 5) / 100;

    const wallAreaSqFt = l * h;
    const bricksPerSqFt = thick === 9 ? 9.5 : 4.75;
    const rawBricks = wallAreaSqFt * bricksPerSqFt;
    const totalBricks = Math.ceil(rawBricks * (1 + waste));

    const mortarBags = Math.ceil((totalBricks / 500) * 2.5);

    const fmt = (n) => parseFloat(n.toFixed(0)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(totalBricks)} Bricks`,
      mainLabel: 'Total Required Bricks',
      subResult: `Wall Surface Area: ${wallAreaSqFt} sq ft (${thick}" wall)`,
      breakdown: [
        { label: 'Net Brick Count', value: `${fmt(rawBricks)} bricks` },
        { label: 'With Wastage Allowance', value: `${fmt(totalBricks)} bricks` },
        { label: 'Estimated Cement Bags', value: `${mortarBags} bags (50kg)` },
        { label: 'Estimated Sand', value: `${(mortarBags * 0.25).toFixed(1)} m³` }
      ],
      formula: `Bricks = Wall Area × Density Factor × (1 + Wastage %)`,
      explanation: 'Estimates standard modular bricks and mortar bonding materials for construction.'
    };
  }
};

export const SteelWeightRebarCalcDef = {
  id: 'steel_weight_rebar_calc',
  name: 'Steel Rebar Weight & Section Quantity',
  category: 'engineering',
  icon: 'construction',
  description: 'Calculate reinforcement steel rebar unit weight (D²/162 kg/m) and total tonnage for construction.',
  inputs: [
    {
      id: 'dia',
      label: 'Rebar Diameter (mm)',
      type: 'select',
      defaultValue: '12',
      options: [
        { label: '8 mm', value: '8' },
        { label: '10 mm', value: '10' },
        { label: '12 mm', value: '12' },
        { label: '16 mm', value: '16' },
        { label: '20 mm', value: '20' },
        { label: '25 mm', value: '25' },
        { label: '32 mm', value: '32' }
      ]
    },
    { id: 'len', label: 'Bar Length per Piece (meters)', type: 'number', defaultValue: 12 },
    { id: 'qty', label: 'Total Number of Bars', type: 'number', defaultValue: 50 }
  ],
  calculate: (vals) => {
    const d = parseFloat(vals.dia) || 12;
    const lenM = parseFloat(vals.len) || 12;
    const qty = parseInt(vals.qty, 10) || 1;

    // Unit weight = d^2 / 162.28 kg/m
    const unitWeightKgM = (Math.pow(d, 2)) / 162.28;
    const singleBarWeight = unitWeightKgM * lenM;
    const totalWeightKg = singleBarWeight * qty;
    const totalTons = totalWeightKg / 1000;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(totalWeightKg)} kg (${fmt(totalTons)} Metric Tonnes)`,
      mainLabel: 'Total Rebar Steel Weight',
      subResult: `Unit Weight: ${fmt(unitWeightKgM)} kg/meter (Ø${d}mm)`,
      breakdown: [
        { label: 'Total Steel Weight', value: `${fmt(totalWeightKg)} kg` },
        { label: 'Total Metric Tonnes', value: `${fmt(totalTons)} T` },
        { label: 'Weight per 1 Bar', value: `${fmt(singleBarWeight)} kg` },
        { label: 'Total Linear Run', value: `${(lenM * qty).toLocaleString()} meters` }
      ],
      formula: 'Weight (kg/m) = D² ÷ 162,  Total Weight = Weight/m × Length × Qty',
      explanation: 'Civil engineering standard bar bending reinforcement estimation formula.'
    };
  }
};

export const ConcreteSlabCalcDef = {
  id: 'concrete_slab_calc',
  name: 'Concrete Slab Volume & Material Batches',
  category: 'engineering',
  icon: 'construction',
  description: 'Calculate concrete slab volume in cubic meters/yards and batches of cement, sand, and coarse aggregate.',
  inputs: [
    { id: 'l', label: 'Slab Length (meters)', type: 'number', defaultValue: 10 },
    { id: 'w', label: 'Slab Width (meters)', type: 'number', defaultValue: 6 },
    { id: 't', label: 'Slab Thickness (mm)', type: 'number', defaultValue: 150 },
    {
      id: 'mix',
      label: 'Concrete Grade Mix Ratio',
      type: 'select',
      defaultValue: 'm20',
      options: [
        { label: 'M15 (1 : 2 : 4)', value: 'm15' },
        { label: 'M20 (1 : 1.5 : 3) Standard', value: 'm20' },
        { label: 'M25 (1 : 1 : 2) High Strength', value: 'm25' }
      ]
    }
  ],
  calculate: (vals) => {
    const l = parseFloat(vals.l) || 0;
    const w = parseFloat(vals.w) || 0;
    const tMm = parseFloat(vals.t) || 150;

    const tM = tMm / 1000;
    const wetVolumeM3 = l * w * tM;
    const dryVolumeM3 = wetVolumeM3 * 1.54; // 54% dry volume factor

    let cRatio = 1, sRatio = 1.5, aRatio = 3;
    if (vals.mix === 'm15') { sRatio = 2; aRatio = 4; }
    else if (vals.mix === 'm25') { sRatio = 1; aRatio = 2; }
    const totalParts = cRatio + sRatio + aRatio;

    const cementM3 = (cRatio / totalParts) * dryVolumeM3;
    const cementBags = Math.ceil((cementM3 * 1440) / 50); // Density 1440 kg/m3, 50kg bag
    const sandM3 = (sRatio / totalParts) * dryVolumeM3;
    const aggM3 = (aRatio / totalParts) * dryVolumeM3;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(wetVolumeM3)} m³ (${(wetVolumeM3 * 1.30795).toFixed(2)} yd³)`,
      mainLabel: 'Total Slab Concrete Volume',
      subResult: `Required Cement: ${cementBags} Bags (50kg each)`,
      breakdown: [
        { label: 'Wet Concrete Volume', value: `${fmt(wetVolumeM3)} m³` },
        { label: 'Cement Bags (50kg)', value: `${cementBags} bags` },
        { label: 'Sand Volume', value: `${fmt(sandM3)} m³ (${fmt(sandM3 * 35.3147)} cu ft)` },
        { label: 'Coarse Aggregate Volume', value: `${fmt(aggM3)} m³` },
        { label: 'Slab Top Area', value: `${(l * w).toFixed(1)} m²` }
      ],
      formula: 'Volume = Length × Width × Thickness,  Dry Vol = Wet Vol × 1.54',
      explanation: 'Civil concrete structural volume and volumetric batching estimation.'
    };
  }
};

export const ColumnLoadCalcDef = {
  id: 'column_load_calc',
  name: 'RCC Column Axial Load Capacity',
  category: 'engineering',
  icon: 'construction',
  description: 'Calculate ultimate axial compressive load carrying capacity (Pu) for short reinforced concrete columns.',
  inputs: [
    { id: 'b', label: 'Column Width (mm)', type: 'number', defaultValue: 300 },
    { id: 'd', label: 'Column Depth (mm)', type: 'number', defaultValue: 450 },
    { id: 'fck', label: 'Concrete Grade fck (MPa - M20, M25, M30)', type: 'number', defaultValue: 25 },
    { id: 'steelPct', label: 'Steel Reinforcement (%)', type: 'number', defaultValue: 1.5 }
  ],
  calculate: (vals) => {
    const b = parseFloat(vals.b) || 300;
    const d = parseFloat(vals.d) || 300;
    const fck = parseFloat(vals.fck) || 25;
    const steelPct = (parseFloat(vals.steelPct) || 1.5) / 100;
    const fy = 415; // Fe415 steel yield strength

    const ag = b * d; // Gross area mm2
    const asc = ag * steelPct; // Area of steel
    const ac = ag - asc; // Area of concrete

    // IS 456 Short column formula: Pu = 0.4 fck Ac + 0.67 fy Asc
    const puN = (0.4 * fck * ac) + (0.67 * fy * asc);
    const puKn = puN / 1000;
    const safeKn = puKn / 1.5; // Working safe load with factor of safety

    const fmt = (n) => parseFloat(n.toFixed(0)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(puKn)} kN (${fmt(puKn / 9.80665)} Tons)`,
      mainLabel: 'Ultimate Axial Load Capacity (P_u)',
      subResult: `Safe Working Service Load: ${fmt(safeKn)} kN (${fmt(safeKn / 9.80665)} Metric Tons)`,
      breakdown: [
        { label: 'Ultimate Load (Pu)', value: `${fmt(puKn)} kN` },
        { label: 'Safe Service Load (W)', value: `${fmt(safeKn)} kN` },
        { label: 'Concrete Capacity Contribution', value: `${fmt((0.4 * fck * ac) / 1000)} kN` },
        { label: 'Steel Capacity Contribution', value: `${fmt((0.67 * fy * asc) / 1000)} kN` }
      ],
      formula: 'P_u = 0.40 × f_ck × A_c + 0.67 × f_y × A_sc',
      explanation: 'Limit State Design RCC short column axial load bearing capacity (IS 456).'
    };
  }
};

export const FootingConcreteCalcDef = {
  id: 'footing_concrete_calc',
  name: 'Footing Concrete & Soil Bearing Pressure',
  category: 'engineering',
  icon: 'construction',
  description: 'Calculate isolated foundation footing volume and check soil contact pressure against allowable bearing capacity.',
  inputs: [
    { id: 'l', label: 'Footing Length (m)', type: 'number', defaultValue: 2.0 },
    { id: 'w', label: 'Footing Width (m)', type: 'number', defaultValue: 2.0 },
    { id: 'd', label: 'Footing Depth / Thickness (m)', type: 'number', defaultValue: 0.45 },
    { id: 'load', label: 'Column Vertical Load (kN)', type: 'number', defaultValue: 450 }
  ],
  calculate: (vals) => {
    const l = parseFloat(vals.l) || 1;
    const w = parseFloat(vals.w) || 1;
    const d = parseFloat(vals.d) || 0.4;
    const loadKn = parseFloat(vals.load) || 0;

    const baseAreaM2 = l * w;
    const volumeM3 = baseAreaM2 * d;
    const selfWeightKn = volumeM3 * 24; // Concrete density ~24 kN/m3
    const totalLoadKn = loadKn + selfWeightKn;
    const pressureKpa = totalLoadKn / baseAreaM2;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(volumeM3)} m³ Concrete`,
      mainLabel: 'Footing Concrete Volume',
      subResult: `Soil Base Pressure: ${fmt(pressureKpa)} kPa (kN/m²)`,
      breakdown: [
        { label: 'Concrete Volume', value: `${fmt(volumeM3)} m³` },
        { label: 'Soil Base Contact Pressure', value: `${fmt(pressureKpa)} kPa` },
        { label: 'Footing Base Area', value: `${fmt(baseAreaM2)} m²` },
        { label: 'Self-Weight of Footing', value: `${fmt(selfWeightKn)} kN` }
      ],
      formula: 'Volume = L × W × D,  Soil Pressure = (Column Load + Self Weight) ÷ Base Area',
      explanation: 'Geotechnical & civil foundation design verification against soil bearing capacity.'
    };
  }
};

export const EarthworkExcavationCalcDef = {
  id: 'earthwork_excavation_calc',
  name: 'Earthwork Excavation & Truck Loads',
  category: 'engineering',
  icon: 'construction',
  description: 'Calculate excavation trench/pit soil volume in cubic meters and estimate dump truck trips required.',
  inputs: [
    { id: 'l', label: 'Excavation Length (m)', type: 'number', defaultValue: 15 },
    { id: 'w', label: 'Excavation Width (m)', type: 'number', defaultValue: 8 },
    { id: 'd', label: 'Excavation Depth (m)', type: 'number', defaultValue: 2.5 },
    { id: 'swell', label: 'Soil Swell / Bulking Factor (%)', type: 'number', defaultValue: 20 },
    { id: 'truck', label: 'Dump Truck Capacity (m³)', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const l = parseFloat(vals.l) || 0;
    const w = parseFloat(vals.w) || 0;
    const d = parseFloat(vals.d) || 0;
    const swell = (parseFloat(vals.swell) || 20) / 100;
    const truckCap = parseFloat(vals.truck) || 10;

    const bankVolumeM3 = l * w * d;
    const looseVolumeM3 = bankVolumeM3 * (1 + swell);
    const truckTrips = Math.ceil(looseVolumeM3 / truckCap);

    const fmt = (n) => parseFloat(n.toFixed(1)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(bankVolumeM3)} m³ (Bank) / ${fmt(looseVolumeM3)} m³ (Loose)`,
      mainLabel: 'Total Excavation Earthwork Volume',
      subResult: `Estimated Hauling: ~${truckTrips} Dump Truck Trips (${truckCap} m³ trucks)`,
      breakdown: [
        { label: 'In-Situ Bank Volume', value: `${fmt(bankVolumeM3)} m³` },
        { label: 'Loose Swelled Volume', value: `${fmt(looseVolumeM3)} m³` },
        { label: 'Estimated Truck Loads', value: `${truckTrips} trips` },
        { label: 'Surface Footprint Area', value: `${(l * w).toFixed(1)} m²` }
      ],
      formula: 'Bank Vol = L × W × D,  Loose Vol = Bank Vol × (1 + Swell%)',
      explanation: 'Civil construction site grading and earthmoving volume estimation.'
    };
  }
};

export const PaintCoverageCalcDef = {
  id: 'paint_coverage_calc',
  name: 'Paint Quantity & Surface Coverage',
  category: 'engineering',
  icon: 'construction',
  description: 'Estimate required paint quantity in liters and gallons for walls and interior/exterior rooms.',
  inputs: [
    { id: 'area', label: 'Total Wall Surface Area (sq ft)', type: 'number', defaultValue: 800 },
    { id: 'deduct', label: 'Doors & Windows Deduction (sq ft)', type: 'number', defaultValue: 120 },
    { id: 'coats', label: 'Number of Coats', type: 'number', defaultValue: 2 },
    { id: 'spread', label: 'Coverage Rate (sq ft per Liter - Standard=100)', type: 'number', defaultValue: 100 }
  ],
  calculate: (vals) => {
    const grossArea = parseFloat(vals.area) || 0;
    const deduct = parseFloat(vals.deduct) || 0;
    const coats = parseInt(vals.coats, 10) || 2;
    const spread = parseFloat(vals.spread) || 100;

    const netArea = Math.max(0, grossArea - deduct);
    const totalCoatedArea = netArea * coats;
    const litersNeeded = Math.ceil(totalCoatedArea / spread);
    const gallonsNeeded = (litersNeeded * 0.264172).toFixed(1);

    const fmt = (n) => parseFloat(n.toFixed(0)).toLocaleString('en-US');

    return {
      mainResult: `${litersNeeded} Liters (~${gallonsNeeded} Gallons)`,
      mainLabel: 'Required Paint Quantity',
      subResult: `Net Surface Area to Paint: ${netArea} sq ft (${coats} Coats applied)`,
      breakdown: [
        { label: 'Paint Volume in Liters', value: `${litersNeeded} L` },
        { label: 'Paint Volume in US Gallons', value: `${gallonsNeeded} gal` },
        { label: 'Total Coated Area (Area × Coats)', value: `${fmt(totalCoatedArea)} sq ft` },
        { label: 'Deductions (Openings)', value: `${deduct} sq ft` }
      ],
      formula: 'Liters = (Net Area × Coats) ÷ Coverage Rate per Liter',
      explanation: 'Estimates architectural coatings and primer quantities for architectural surfaces.'
    };
  }
};


// ==========================================
// 4. 💻 COMPUTER ENGINEERING
// ==========================================

export const BinaryConverterDef = {
  id: 'binary_converter',
  name: 'Binary ↔ Decimal Converter',
  category: 'engineering',
  icon: 'statistics',
  description: 'Convert numbers between Decimal and Binary with two\'s complement and bit-length breakdown.',
  inputs: [
    {
      id: 'mode',
      label: 'Conversion Direction',
      type: 'segmented',
      defaultValue: 'dec_to_bin',
      options: [
        { label: 'Decimal → Binary', value: 'dec_to_bin' },
        { label: 'Binary → Decimal', value: 'bin_to_dec' }
      ]
    },
    { id: 'val', label: 'Input Value', type: 'text', defaultValue: '156' }
  ],
  calculate: (vals) => {
    const isDecToBin = vals.mode === 'dec_to_bin';
    const inputStr = (vals.val || '0').trim();

    if (isDecToBin) {
      const dec = parseInt(inputStr, 10);
      if (isNaN(dec)) return { mainResult: 'Invalid Decimal', mainLabel: 'Error', subResult: 'Enter a valid decimal number', breakdown: [], formula: '', explanation: '' };
      const bin = (dec >>> 0).toString(2);
      const hex = (dec >>> 0).toString(16).toUpperCase();
      const oct = (dec >>> 0).toString(8);

      return {
        mainResult: `0b${bin}`,
        mainLabel: 'Binary Representation',
        subResult: `Hex: 0x${hex} | Octal: 0o${oct} | Bit Length: ${bin.length} bits`,
        breakdown: [
          { label: 'Binary (Base 2)', value: bin },
          { label: 'Decimal (Base 10)', value: `${dec}` },
          { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
          { label: 'Bit Width', value: `${bin.length} bits (${Math.ceil(bin.length / 8)} Bytes)` }
        ],
        formula: 'Division by 2 remainder successive decomposition',
        explanation: 'Base-2 positional radix numeral conversion.'
      };
    }

    // Binary to Decimal
    const cleanBin = inputStr.replace(/^0b/i, '');
    if (!/^[01]+$/.test(cleanBin)) {
      return { mainResult: 'Invalid Binary', mainLabel: 'Error', subResult: 'Only 0 and 1 are allowed in binary strings', breakdown: [], formula: '', explanation: '' };
    }
    const dec = parseInt(cleanBin, 2);

    return {
      mainResult: `${dec.toLocaleString('en-US')}`,
      mainLabel: 'Decimal Output',
      subResult: `Hex: 0x${dec.toString(16).toUpperCase()} | Oct: 0o${dec.toString(8)}`,
      breakdown: [
        { label: 'Decimal Value', value: `${dec}` },
        { label: 'Hexadecimal', value: `0x${dec.toString(16).toUpperCase()}` },
        { label: 'Bit Count', value: `${cleanBin.length} bits` }
      ],
      formula: 'Decimal = ∑ (b_i × 2^i)',
      explanation: 'Binary sum of powers of 2.'
    };
  }
};

export const HexConverterDef = {
  id: 'hex_converter',
  name: 'Hexadecimal ↔ Decimal Converter',
  category: 'engineering',
  icon: 'statistics',
  description: 'Convert numbers between Decimal and Hexadecimal (Base 16) with ASCII character preview.',
  inputs: [
    {
      id: 'mode',
      label: 'Conversion Mode',
      type: 'segmented',
      defaultValue: 'dec_to_hex',
      options: [
        { label: 'Decimal → Hex', value: 'dec_to_hex' },
        { label: 'Hex → Decimal', value: 'hex_to_dec' }
      ]
    },
    { id: 'val', label: 'Input Value', type: 'text', defaultValue: '255' }
  ],
  calculate: (vals) => {
    const isDecToHex = vals.mode === 'dec_to_hex';
    const input = (vals.val || '0').trim();

    if (isDecToHex) {
      const dec = parseInt(input, 10);
      if (isNaN(dec)) return { mainResult: 'Invalid Number', mainLabel: 'Error', subResult: 'Enter valid decimal integer', breakdown: [], formula: '', explanation: '' };
      const hex = (dec >>> 0).toString(16).toUpperCase();
      const bin = (dec >>> 0).toString(2);

      return {
        mainResult: `0x${hex}`,
        mainLabel: 'Hexadecimal Output',
        subResult: `Binary: 0b${bin} | Decimal: ${dec}`,
        breakdown: [
          { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
          { label: 'Decimal (Base 10)', value: `${dec}` },
          { label: 'Binary (Base 2)', value: bin }
        ],
        formula: 'Hex = Remainder division by 16 (0-9, A-F)',
        explanation: 'Base-16 compact binary representation.'
      };
    }

    const cleanHex = input.replace(/^0x/i, '');
    const dec = parseInt(cleanHex, 16);
    if (isNaN(dec)) return { mainResult: 'Invalid Hex', mainLabel: 'Error', subResult: 'Enter valid hexadecimal string (0-9, A-F)', breakdown: [], formula: '', explanation: '' };

    return {
      mainResult: `${dec.toLocaleString('en-US')}`,
      mainLabel: 'Decimal Output',
      subResult: `Binary: 0b${(dec >>> 0).toString(2)}`,
      breakdown: [
        { label: 'Decimal Value', value: `${dec}` },
        { label: 'Binary', value: (dec >>> 0).toString(2) },
        { label: 'Hex Input', value: `0x${cleanHex.toUpperCase()}` }
      ],
      formula: 'Decimal = ∑ (d_i × 16^i)',
      explanation: 'Base-16 polynomial evaluation.'
    };
  }
};

export const BinaryHexConverterDef = {
  id: 'binary_hex_converter',
  name: 'Binary ↔ Hexadecimal Direct Converter',
  category: 'engineering',
  icon: 'statistics',
  description: 'Direct nibble-by-nibble (4 bits = 1 Hex digit) conversion between Binary and Hexadecimal.',
  inputs: [
    {
      id: 'mode',
      label: 'Direction',
      type: 'segmented',
      defaultValue: 'bin_to_hex',
      options: [
        { label: 'Binary → Hex', value: 'bin_to_hex' },
        { label: 'Hex → Binary', value: 'hex_to_bin' }
      ]
    },
    { id: 'val', label: 'Input String', type: 'text', defaultValue: '11011111' }
  ],
  calculate: (vals) => {
    const isBinToHex = vals.mode === 'bin_to_hex';
    const input = (vals.val || '').trim().replace(/^(0b|0x)/i, '');

    if (isBinToHex) {
      if (!/^[01]+$/.test(input)) return { mainResult: 'Invalid Binary', mainLabel: 'Error', subResult: 'Enter binary 0 and 1 only', breakdown: [], formula: '', explanation: '' };
      const dec = parseInt(input, 2);
      const hex = dec.toString(16).toUpperCase();

      return {
        mainResult: `0x${hex}`,
        mainLabel: 'Hexadecimal Representation',
        subResult: `Decimal Value: ${dec.toLocaleString('en-US')}`,
        breakdown: [
          { label: 'Hex Result', value: `0x${hex}` },
          { label: 'Binary Input', value: input },
          { label: 'Nibbles Count (4-bit groups)', value: `${Math.ceil(input.length / 4)} nibbles` }
        ],
        formula: '4 Bits = 1 Hexadecimal Character',
        explanation: 'Direct 4-bit nibble mapping.'
      };
    }

    if (!/^[0-9a-fA-F]+$/.test(input)) return { mainResult: 'Invalid Hex', mainLabel: 'Error', subResult: 'Enter hex chars 0-9, A-F', breakdown: [], formula: '', explanation: '' };
    const dec = parseInt(input, 16);
    const bin = (dec >>> 0).toString(2);

    return {
      mainResult: `0b${bin}`,
      mainLabel: 'Binary String',
      subResult: `Decimal Value: ${dec.toLocaleString('en-US')}`,
      breakdown: [
        { label: 'Binary Output', value: bin },
        { label: 'Hex Input', value: `0x${input.toUpperCase()}` },
        { label: 'Total Bits', value: `${bin.length} bits` }
      ],
      formula: 'Hex character expanded into 4 binary bits',
      explanation: 'Binary expansion from hexadecimal digits.'
    };
  }
};

export const Ipv4SubnetCidrDef = {
  id: 'ipv4_subnet_cidr',
  name: 'IPv4 Subnet & CIDR Calculator',
  category: 'engineering',
  icon: 'statistics',
  description: 'Calculate subnet mask, network IP, broadcast address, usable host range, and wildcard mask.',
  inputs: [
    { id: 'ip', label: 'IP Address', type: 'text', defaultValue: '192.168.1.100' },
    { id: 'cidr', label: 'CIDR Prefix (/xx)', type: 'number', defaultValue: 24 }
  ],
  calculate: (vals) => {
    const rawIp = (vals.ip || '192.168.1.1').trim();
    const cidr = Math.min(32, Math.max(1, parseInt(vals.cidr, 10) || 24));

    const octets = rawIp.split('.').map(n => parseInt(n, 10) || 0);
    if (octets.length !== 4) {
      return {
        mainResult: 'Invalid IP',
        mainLabel: 'Error',
        subResult: 'Please enter a valid IPv4 address (e.g. 192.168.1.1)',
        breakdown: [],
        formula: 'IPv4: 4 octets (0-255)',
        explanation: 'Check IP address syntax.'
      };
    }

    const ipInt = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr));
    const networkInt = ipInt & maskInt;
    const broadcastInt = networkInt | (~maskInt);

    const intToIp = (num) => [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');

    const netIp = intToIp(networkInt);
    const maskIp = intToIp(maskInt);
    const bcastIp = intToIp(broadcastInt);
    const firstHost = cidr >= 31 ? netIp : intToIp(networkInt + 1);
    const lastHost = cidr >= 31 ? bcastIp : intToIp(broadcastInt - 1);
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

    const fmt = (n) => n.toLocaleString('en-US');

    return {
      mainResult: `${netIp} / ${cidr}`,
      mainLabel: 'Network Address & Subnet',
      subResult: `Usable Host Range: ${firstHost} – ${lastHost}`,
      breakdown: [
        { label: 'Subnet Mask', value: maskIp },
        { label: 'Broadcast Address', value: bcastIp },
        { label: 'Usable Hosts Count', value: `${fmt(usableHosts)} hosts` },
        { label: 'Total Addresses', value: `${fmt(totalHosts)} IPs` },
        { label: 'CIDR Notation', value: `/${cidr}` }
      ],
      formula: 'Network = IP & Subnet Mask, Hosts = 2^(32 - CIDR) - 2',
      explanation: 'Calculates IPv4 binary subnetting boundary and address space allocation.'
    };
  }
};

export const BandwidthSpeedCalcDef = {
  id: 'bandwidth_speed_calc',
  name: 'Bandwidth & Network Throughput Calculator',
  category: 'engineering',
  icon: 'statistics',
  description: 'Calculate network throughput, data transfer rate (Mbps, MB/s, Gbps), and capacity required.',
  inputs: [
    { id: 'speed', label: 'Connection Bandwidth', type: 'number', defaultValue: 100 },
    {
      id: 'unit',
      label: 'Bandwidth Unit',
      type: 'select',
      defaultValue: 'mbps',
      options: [
        { label: 'Mbps (Megabits/sec)', value: 'mbps' },
        { label: 'Gbps (Gigabits/sec)', value: 'gbps' },
        { label: 'MB/s (Megabytes/sec)', value: 'mbs' }
      ]
    }
  ],
  calculate: (vals) => {
    const rawVal = parseFloat(vals.speed) || 0;
    const unit = vals.unit || 'mbps';

    let mbps = rawVal;
    if (unit === 'gbps') mbps = rawVal * 1000;
    else if (unit === 'mbs') mbps = rawVal * 8;

    const megaBytesPerSec = mbps / 8;
    const gigaBytesPerHour = (megaBytesPerSec * 3600) / 1024;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(megaBytesPerSec)} MB/s (${fmt(mbps)} Mbps)`,
      mainLabel: 'Actual Download / Transfer Throughput',
      subResult: `Hourly Transfer Capacity: ${fmt(gigaBytesPerHour)} GB / hour`,
      breakdown: [
        { label: 'Throughput in MB/s', value: `${fmt(megaBytesPerSec)} MB/s` },
        { label: 'Bandwidth in Mbps', value: `${fmt(mbps)} Mbps` },
        { label: 'Bandwidth in Gbps', value: `${(mbps / 1000).toFixed(3)} Gbps` },
        { label: 'Hourly Throughput', value: `${fmt(gigaBytesPerHour)} GB` }
      ],
      formula: 'Throughput (MB/s) = Bandwidth in Mbps ÷ 8',
      explanation: 'Data networking throughput taking 8 bits per byte into account.'
    };
  }
};

export const DataStorageConverterDef = {
  id: 'data_storage_converter',
  name: 'Data Storage Converter (KB, MB, GB, TB)',
  category: 'engineering',
  icon: 'statistics',
  description: 'Convert digital storage sizes across Decimal (KB, MB, GB, TB) and Binary (KiB, MiB, GiB, TiB) metrics.',
  inputs: [
    { id: 'size', label: 'Storage Size', type: 'number', defaultValue: 500 },
    {
      id: 'unit',
      label: 'Source Unit',
      type: 'select',
      defaultValue: 'gb',
      options: [
        { label: 'Gigabytes (GB - Decimal)', value: 'gb' },
        { label: 'Megabytes (MB)', value: 'mb' },
        { label: 'Terabytes (TB)', value: 'tb' },
        { label: 'Gibibytes (GiB - Binary)', value: 'gib' }
      ]
    }
  ],
  calculate: (vals) => {
    const s = parseFloat(vals.size) || 0;
    const unit = vals.unit || 'gb';

    let bytes = s;
    if (unit === 'mb') bytes = s * 1e6;
    else if (unit === 'gb') bytes = s * 1e9;
    else if (unit === 'tb') bytes = s * 1e12;
    else if (unit === 'gib') bytes = s * Math.pow(1024, 3);

    const gb = bytes / 1e9;
    const tb = bytes / 1e12;
    const gib = bytes / Math.pow(1024, 3);
    const mib = bytes / Math.pow(1024, 2);

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(gib)} GiB (${fmt(gb)} GB)`,
      mainLabel: 'Equivalent Digital Storage',
      subResult: `Total Terabytes: ${fmt(tb)} TB | MiB: ${fmt(mib)} MiB`,
      breakdown: [
        { label: 'Binary GiB (1024³)', value: `${fmt(gib)} GiB` },
        { label: 'Decimal GB (1000³)', value: `${fmt(gb)} GB` },
        { label: 'Terabytes TB (10¹²)', value: `${fmt(tb)} TB` },
        { label: 'Raw Bytes', value: `${bytes.toLocaleString()} Bytes` }
      ],
      formula: 'Decimal: 1 GB = 1000 MB,  Binary: 1 GiB = 1024 MiB',
      explanation: 'IEEE / IEC standards for digital binary and decimal memory measurement.'
    };
  }
};

export const IpAddressInfoCalcDef = {
  id: 'ip_address_info_calc',
  name: 'IP Address Information & Class Lookup',
  category: 'engineering',
  icon: 'statistics',
  description: 'Identify IPv4 address class (A, B, C, D, E), RFC1918 private vs public scope, and binary octets.',
  inputs: [
    { id: 'ip', label: 'IPv4 Address', type: 'text', defaultValue: '172.16.25.40' }
  ],
  calculate: (vals) => {
    const ipStr = (vals.ip || '192.168.1.1').trim();
    const octets = ipStr.split('.').map(n => parseInt(n, 10) || 0);

    if (octets.length !== 4) return { mainResult: 'Invalid IP', mainLabel: 'Error', subResult: 'Enter a valid IPv4 address (e.g. 192.168.1.1)', breakdown: [], formula: '', explanation: '' };

    const first = octets[0];
    let ipClass = 'Class A';
    let defaultMask = '255.0.0.0 (/8)';
    if (first >= 128 && first <= 191) { ipClass = 'Class B'; defaultMask = '255.255.0.0 (/16)'; }
    else if (first >= 192 && first <= 223) { ipClass = 'Class C'; defaultMask = '255.255.255.0 (/24)'; }
    else if (first >= 224 && first <= 239) { ipClass = 'Class D (Multicast)'; defaultMask = 'N/A'; }
    else if (first >= 240) { ipClass = 'Class E (Experimental)'; defaultMask = 'N/A'; }

    let isPrivate = false;
    if (first === 10) isPrivate = true;
    else if (first === 172 && octets[1] >= 16 && octets[1] <= 31) isPrivate = true;
    else if (first === 192 && octets[1] === 168) isPrivate = true;
    else if (first === 127) isPrivate = true; // Loopback

    const binOctets = octets.map(o => o.toString(2).padStart(8, '0')).join('.');

    return {
      mainResult: `${ipClass} (${isPrivate ? 'Private / Internal' : 'Public IP'})`,
      mainLabel: 'IP Address Classification',
      subResult: `Default Subnet Mask: ${defaultMask}`,
      breakdown: [
        { label: 'Address Class', value: ipClass },
        { label: 'Scope', value: isPrivate ? 'Private (RFC 1918)' : 'Public Internet' },
        { label: 'Binary Octets', value: binOctets },
        { label: 'Default Mask', value: defaultMask }
      ],
      formula: 'Class A: 1-126, Class B: 128-191, Class C: 192-223',
      explanation: 'IPv4 historical address class architecture and private address allocations.'
    };
  }
};

export const DataTransferTimeDef = {
  id: 'data_transfer_time_calc',
  name: 'Data Transfer & Download Time ETA',
  category: 'engineering',
  icon: 'statistics',
  description: 'Calculate file download/upload duration based on file size and internet connection bandwidth.',
  inputs: [
    { id: 'size', label: 'File / Dataset Size (GB)', type: 'number', defaultValue: 25 },
    { id: 'speed', label: 'Connection Speed (Mbps)', type: 'number', defaultValue: 100 },
    { id: 'overhead', label: 'Network Overhead (%)', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const sizeGB = parseFloat(vals.size) || 0;
    const speedMbps = parseFloat(vals.speed) || 1;
    const overheadRaw = parseFloat(vals.overhead);
    const overhead = (!isNaN(overheadRaw) ? overheadRaw : 10) / 100;

    const sizeMegabits = sizeGB * 8 * 1024;
    const effectiveSpeed = speedMbps * (1 - overhead);
    const seconds = sizeMegabits / effectiveSpeed;

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    const timeStr = `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs}s`;

    return {
      mainResult: timeStr,
      mainLabel: 'Estimated Transfer Duration',
      subResult: `Effective Speed: ${(effectiveSpeed / 8).toFixed(1)} MB/s`,
      breakdown: [
        { label: 'Total Size in Megabits', value: `${(sizeMegabits).toLocaleString()} Mb` },
        { label: 'Nominal Bandwidth', value: `${speedMbps} Mbps` },
        { label: 'Effective Transfer Speed', value: `${(effectiveSpeed / 8).toFixed(2)} MB/sec` },
        { label: 'Total Seconds', value: `${Math.round(seconds)} seconds` }
      ],
      formula: 'Time = (File Size in Bits) ÷ Effective Bandwidth',
      explanation: 'Estimates networking throughput duration taking TCP/IP protocol overhead into account.'
    };
  }
};


// ==========================================
// 5. 🧪 CHEMICAL ENGINEERING
// ==========================================

export const DilutionDef = {
  id: 'dilution_m1v1',
  name: 'Solution Dilution (M₁V₁ = M₂V₂)',
  category: 'engineering',
  icon: 'chemistry',
  description: 'Calculate stock volume or concentration for chemical dilutions using M₁V₁ = M₂V₂.',
  inputs: [
    { id: 'm1', label: 'Stock Concentration M₁ (M or %)', type: 'number', defaultValue: 12 },
    { id: 'm2', label: 'Target Concentration M₂ (M or %)', type: 'number', defaultValue: 2 },
    { id: 'v2', label: 'Target Final Volume V₂ (mL)', type: 'number', defaultValue: 500 }
  ],
  calculate: (vals) => {
    const m1 = parseFloat(vals.m1) || 1;
    const m2 = parseFloat(vals.m2) || 0;
    const v2 = parseFloat(vals.v2) || 0;

    const v1 = (m2 * v2) / m1;
    const solventV = v2 - v1;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });

    return {
      mainResult: `${fmt(v1)} mL Stock Solution`,
      mainLabel: 'Required Stock Volume (V₁)',
      subResult: `Add ${fmt(solventV)} mL of solvent (water) to reach ${v2} mL`,
      breakdown: [
        { label: 'Stock Volume (V₁)', value: `${fmt(v1)} mL` },
        { label: 'Diluent / Solvent Volume', value: `${fmt(solventV)} mL` },
        { label: 'Dilution Factor', value: `${fmt(m1 / m2)}x` },
        { label: 'Final Total Volume (V₂)', value: `${fmt(v2)} mL` }
      ],
      formula: `V₁ = (M₂ × V₂) ÷ M₁ = (${m2} × ${v2}) ÷ ${m1} = ${fmt(v1)} mL`,
      explanation: 'Conservation of solute mass in chemical solutions.'
    };
  }
};

export const PhPohDef = {
  id: 'ph_poh_calculator',
  name: 'pH & pOH Ion Concentration',
  category: 'engineering',
  icon: 'chemistry',
  description: 'Calculate solution acidity/alkalinity: pH, pOH, [H⁺] hydrogen ion, and [OH⁻] hydroxide ion concentration.',
  inputs: [
    {
      id: 'type',
      label: 'Input Type',
      type: 'segmented',
      defaultValue: 'ph',
      options: [
        { label: 'pH Value', value: 'ph' },
        { label: '[H⁺] Molarity (M)', value: 'h' }
      ]
    },
    { id: 'val', label: 'Value', type: 'number', defaultValue: 3.5, step: 'any' }
  ],
  calculate: (vals) => {
    const isPh = vals.type === 'ph';
    const v = parseFloat(vals.val) || 7;

    let ph, poh, hConc, ohConc;

    if (isPh) {
      ph = v;
      poh = 14 - ph;
      hConc = Math.pow(10, -ph);
      ohConc = Math.pow(10, -poh);
    } else {
      hConc = v;
      ph = -Math.log10(hConc);
      poh = 14 - ph;
      ohConc = Math.pow(10, -poh);
    }

    let status = 'Neutral (Pure Water)';
    if (ph < 7) status = `Acidic (${ph < 3 ? 'Strong Acid' : 'Weak Acid'})`;
    else if (ph > 7) status = `Alkaline / Basic (${ph > 11 ? 'Strong Base' : 'Weak Base'})`;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `pH = ${fmt(ph)}  |  pOH = ${fmt(poh)}`,
      mainLabel: 'Solution pH & pOH',
      subResult: `Classification: ${status}`,
      breakdown: [
        { label: 'Hydrogen Ion [H⁺]', value: `${hConc.toExponential(3)} M` },
        { label: 'Hydroxide Ion [OH⁻]', value: `${ohConc.toExponential(3)} M` },
        { label: 'Solution Nature', value: status }
      ],
      formula: 'pH = −log₁₀[H⁺],  pH + pOH = 14',
      explanation: 'Logarithmic scale of chemical hydronium and hydroxide ion activity.'
    };
  }
};

export const IdealGasLawEngDef = {
  id: 'ideal_gas_law_eng',
  name: 'Ideal Gas Law (PV = nRT)',
  category: 'engineering',
  icon: 'chemistry',
  description: 'Calculate pressure, volume, temperature, or molar amount of an ideal gas using PV = nRT.',
  inputs: [
    { id: 'p', label: 'Pressure P (kPa)', type: 'number', defaultValue: 101.325 },
    { id: 'v', label: 'Volume V (Liters L)', type: 'number', defaultValue: 22.414 },
    { id: 't', label: 'Temperature T (°C)', type: 'number', defaultValue: 0 }
  ],
  calculate: (vals) => {
    const pKpa = parseFloat(vals.p) || 101.325;
    const vL = parseFloat(vals.v) || 22.414;
    const tC = parseFloat(vals.t) || 0;

    const tK = tC + 273.15;
    const R = 8.314462; // L·kPa / (mol·K)
    const moles = (pKpa * vL) / (R * tK);

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(moles)} moles`,
      mainLabel: 'Amount of Substance (n)',
      subResult: `Absolute Temperature: ${tK.toFixed(2)} K (STP Conditions)`,
      breakdown: [
        { label: 'Number of Moles (n)', value: `${fmt(moles)} mol` },
        { label: 'Pressure', value: `${pKpa} kPa` },
        { label: 'Volume', value: `${vL} Liters` },
        { label: 'Gas Constant R', value: '8.314 J/(mol·K)' }
      ],
      formula: 'n = (P × V) ÷ (R × T),  T(K) = T(°C) + 273.15',
      explanation: 'Equation of state of a hypothetical ideal gas.'
    };
  }
};

export const MolecularWeightDef = {
  id: 'molar_mass_molecular_weight',
  name: 'Molecular Weight & Molar Mass Calculator',
  category: 'engineering',
  icon: 'chemistry',
  description: 'Calculate molecular weight (g/mol) and mass percentage composition of chemical compounds.',
  inputs: [
    {
      id: 'compound',
      label: 'Select Chemical Compound',
      type: 'select',
      defaultValue: 'h2so4',
      options: [
        { label: 'H₂O (Water)', value: 'h2o' },
        { label: 'H₂SO₄ (Sulfuric Acid)', value: 'h2so4' },
        { label: 'NaCl (Sodium Chloride)', value: 'nacl' },
        { label: 'NaOH (Sodium Hydroxide)', value: 'naoh' },
        { label: 'HCl (Hydrochloric Acid)', value: 'hcl' },
        { label: 'C₆H₁₂O₆ (Glucose)', value: 'glucose' },
        { label: 'CaCO₃ (Calcium Carbonate)', value: 'caco3' },
        { label: 'NH₃ (Ammonia)', value: 'nh3' }
      ]
    },
    { id: 'moles', label: 'Amount in Moles (mol)', type: 'number', defaultValue: 1 }
  ],
  calculate: (vals) => {
    const compoundMap = {
      h2o: { name: 'Water (H₂O)', mw: 18.015, elements: 'H: 11.2%, O: 88.8%' },
      h2so4: { name: 'Sulfuric Acid (H₂SO₄)', mw: 98.079, elements: 'H: 2.1%, S: 32.7%, O: 65.3%' },
      nacl: { name: 'Sodium Chloride (NaCl)', mw: 58.443, elements: 'Na: 39.3%, Cl: 60.7%' },
      naoh: { name: 'Sodium Hydroxide (NaOH)', mw: 39.997, elements: 'Na: 57.5%, O: 40.0%, H: 2.5%' },
      hcl: { name: 'Hydrochloric Acid (HCl)', mw: 36.461, elements: 'H: 2.8%, Cl: 97.2%' },
      glucose: { name: 'Glucose (C₆H₁₂O₆)', mw: 180.156, elements: 'C: 40.0%, H: 6.7%, O: 53.3%' },
      caco3: { name: 'Calcium Carbonate (CaCO₃)', mw: 100.087, elements: 'Ca: 40.0%, C: 12.0%, O: 48.0%' },
      nh3: { name: 'Ammonia (NH₃)', mw: 17.031, elements: 'N: 82.2%, H: 17.8%' }
    };

    const comp = compoundMap[vals.compound] || compoundMap.h2so4;
    const moles = parseFloat(vals.moles) || 1;
    const totalMass = comp.mw * moles;

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(comp.mw)} g/mol`,
      mainLabel: 'Molar Mass (Molecular Weight)',
      subResult: `Mass of ${moles} mol: ${fmt(totalMass)} grams`,
      breakdown: [
        { label: 'Molar Mass (MW)', value: `${fmt(comp.mw)} g/mol` },
        { label: 'Total Sample Mass', value: `${fmt(totalMass)} g` },
        { label: 'Elemental Composition', value: comp.elements },
        { label: 'Compound Formula', value: comp.name }
      ],
      formula: 'Molecular Weight = ∑ (Atomic Mass × Atom Count)',
      explanation: 'Sum of atomic weights of all constituent atoms in a molecule.'
    };
  }
};

export const GasFlowPipeCalcDef = {
  id: 'gas_flow_pipe_calc',
  name: 'Gas Flow Rate & Pipe Velocity',
  category: 'engineering',
  icon: 'chemistry',
  description: 'Calculate volumetric gas flow rate (m³/hr, Nm³/hr) and linear velocity through process pipes.',
  inputs: [
    { id: 'd', label: 'Internal Pipe Diameter (mm)', type: 'number', defaultValue: 80 },
    { id: 'v', label: 'Gas Flow Velocity (m/s)', type: 'number', defaultValue: 15 },
    { id: 'p', label: 'Operating Pressure (Bar absolute)', type: 'number', defaultValue: 4.0 }
  ],
  calculate: (vals) => {
    const dMm = parseFloat(vals.d) || 50;
    const v = parseFloat(vals.v) || 0;
    const pBar = parseFloat(vals.p) || 1;

    const areaM2 = (Math.PI * Math.pow(dMm / 1000, 2)) / 4;
    const actualFlowM3s = areaM2 * v;
    const actualFlowM3h = actualFlowM3s * 3600;
    const normalFlowNm3h = actualFlowM3h * pBar; // Simplified Boyle normalization

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(actualFlowM3h)} m³/hr (${fmt(normalFlowNm3h)} Nm³/hr)`,
      mainLabel: 'Volumetric Gas Flow Rate',
      subResult: `Pipe Cross-Section Area: ${(areaM2 * 10000).toFixed(1)} cm²`,
      breakdown: [
        { label: 'Actual Flow Rate (m³/h)', value: `${fmt(actualFlowM3h)} m³/h` },
        { label: 'Normalized Flow (Nm³/h)', value: `${fmt(normalFlowNm3h)} Nm³/h` },
        { label: 'Gas Velocity', value: `${v} m/s` },
        { label: 'Operating Pressure', value: `${pBar} Bar(a)` }
      ],
      formula: 'Flow Q = Velocity × Cross-Section Area = v × (π × D² ÷ 4)',
      explanation: 'Compressible fluid dynamics pipe throughput calculation.'
    };
  }
};

export const ReynoldsNumberDef = {
  id: 'reynolds_number_calc',
  name: 'Reynolds Number & Flow Regime',
  category: 'engineering',
  icon: 'chemistry',
  description: 'Determine fluid flow regime (Laminar, Transitional, Turbulent) in pipes.',
  inputs: [
    { id: 'v', label: 'Flow Velocity (v in m/s)', type: 'number', defaultValue: 1.5 },
    { id: 'd', label: 'Internal Pipe Diameter (D in mm)', type: 'number', defaultValue: 50 },
    { id: 'visc', label: 'Kinematic Viscosity ν (cSt or 10⁻⁶ m²/s - Water=1.0)', type: 'number', defaultValue: 1.0 }
  ],
  calculate: (vals) => {
    const v = parseFloat(vals.v) || 0;
    const dM = (parseFloat(vals.d) || 50) / 1000;
    const nu = (parseFloat(vals.visc) || 1) * 1e-6;

    const re = nu > 0 ? (v * dM) / nu : 0;

    let regime = 'Laminar Flow (Re < 2,300)';
    if (re >= 2300 && re <= 4000) regime = 'Transitional Flow (2,300 ≤ Re ≤ 4,000)';
    else if (re > 4000) regime = 'Turbulent Flow (Re > 4,000)';

    const fmt = (n) => parseFloat(n.toFixed(0)).toLocaleString('en-US');

    return {
      mainResult: `Re = ${fmt(re)}`,
      mainLabel: 'Reynolds Number',
      subResult: `Flow Regime: ${regime}`,
      breakdown: [
        { label: 'Reynolds Number (Re)', value: fmt(re) },
        { label: 'Flow Classification', value: regime.split(' ')[0] },
        { label: 'Pipe Diameter', value: `${(dM * 1000)} mm` },
        { label: 'Flow Velocity', value: `${v} m/s` }
      ],
      formula: 'Re = (Velocity × Diameter) ÷ Kinematic Viscosity = (v × D) ÷ ν',
      explanation: 'Predicts fluid dynamic boundary layer behavior in chemical process piping.'
    };
  }
};


// ==========================================
// 6. 📡 ELECTRONICS & COMMUNICATION
// ==========================================

export const ResistorCalcDef = {
  id: 'resistor_calc',
  name: 'Resistor SMD Code & Value Calculator',
  category: 'engineering',
  icon: 'electrical',
  description: 'Decode 3-digit and 4-digit SMD surface mount resistor markings and calculate equivalent resistance.',
  inputs: [
    { id: 'code', label: 'SMD Marking Code (e.g. 103, 4702, 4R7)', type: 'text', defaultValue: '103' }
  ],
  calculate: (vals) => {
    const raw = (vals.code || '103').trim().toUpperCase();

    let ohms = 0;
    if (raw.includes('R')) {
      ohms = parseFloat(raw.replace('R', '.'));
    } else if (/^\d{3}$/.test(raw)) {
      const digits = parseInt(raw.slice(0, 2), 10);
      const mult = parseInt(raw.slice(2), 10);
      ohms = digits * Math.pow(10, mult);
    } else if (/^\d{4}$/.test(raw)) {
      const digits = parseInt(raw.slice(0, 3), 10);
      const mult = parseInt(raw.slice(3), 10);
      ohms = digits * Math.pow(10, mult);
    } else {
      ohms = parseFloat(raw) || 0;
    }

    let displayStr = `${ohms} Ω`;
    if (ohms >= 1e6) displayStr = `${(ohms / 1e6).toFixed(2)} MΩ`;
    else if (ohms >= 1e3) displayStr = `${(ohms / 1e3).toFixed(2)} kΩ`;

    return {
      mainResult: displayStr,
      mainLabel: 'SMD Resistor Value',
      subResult: `Exact Value: ${ohms.toLocaleString('en-US')} Ohms (Ω)`,
      breakdown: [
        { label: 'Resistance Value', value: displayStr },
        { label: 'Ohms (Ω)', value: `${ohms} Ω` },
        { label: 'SMD Code Marking', value: raw }
      ],
      formula: 'Code "AB C" = AB × 10^C Ω',
      explanation: 'Standard surface-mount resistor EIA marking code system.'
    };
  }
};

export const RcFilterTimeDef = {
  id: 'rc_filter_time',
  name: 'RC Filter Cutoff & Time Constant',
  category: 'engineering',
  icon: 'electrical',
  description: 'Calculate RC circuit time constant (τ), cutoff frequency (fc), and charge time.',
  inputs: [
    { id: 'r', label: 'Resistance R (kΩ)', type: 'number', defaultValue: 10 },
    { id: 'c', label: 'Capacitance C (μF)', type: 'number', defaultValue: 4.7 }
  ],
  calculate: (vals) => {
    const rOhms = (parseFloat(vals.r) || 1) * 1000;
    const cFarads = (parseFloat(vals.c) || 1) * 1e-6;

    const tau = rOhms * cFarads;
    const fc = 1 / (2 * Math.PI * tau);
    const timeTo99Pct = 5 * tau;

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(tau * 1000)} ms (τ)`,
      mainLabel: 'RC Time Constant (Tau)',
      subResult: `Cutoff Frequency (fc, -3dB): ${fmt(fc)} Hz`,
      breakdown: [
        { label: 'Time Constant (τ = R·C)', value: `${fmt(tau * 1000)} ms` },
        { label: 'Cutoff Frequency (-3dB)', value: `${fmt(fc)} Hz` },
        { label: 'Full Charge Time (5τ)', value: `${fmt(timeTo99Pct * 1000)} ms` },
        { label: 'Bandwidth', value: `0 to ${fmt(fc)} Hz` }
      ],
      formula: 'τ = R × C,  fc = 1 ÷ (2 × π × R × C)',
      explanation: 'Defines low-pass/high-pass filtering threshold in analog electronic circuits.'
    };
  }
};

export const FrequencyWavelengthCalcDef = {
  id: 'frequency_wavelength_calc',
  name: 'Frequency & RF Wavelength Calculator',
  category: 'engineering',
  icon: 'electrical',
  description: 'Convert electromagnetic frequency to wavelength (λ = c / f) across RF and optical spectrums.',
  inputs: [
    { id: 'f', label: 'Frequency (MHz)', type: 'number', defaultValue: 100 }
  ],
  calculate: (vals) => {
    const fMhz = parseFloat(vals.f) || 100;
    const fHz = fMhz * 1e6;
    const c = 299792458; // Speed of light m/s

    const lambdaM = c / fHz;
    const periodSec = 1 / fHz;

    let band = 'VHF (Very High Frequency - 30 to 300 MHz)';
    if (fMhz < 3) band = 'MF / LF (Medium/Low Frequency)';
    else if (fMhz < 30) band = 'HF (High Frequency / Shortwave)';
    else if (fMhz < 300) band = 'VHF (FM Radio, Airband)';
    else if (fMhz < 3000) band = 'UHF (Wi-Fi, 4G/5G, Bluetooth)';
    else band = 'SHF / Microwave (Satellite, 5G NR)';

    const fmt = (n) => parseFloat(n.toFixed(3)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(lambdaM)} meters (λ)`,
      mainLabel: 'Electromagnetic Wavelength (λ)',
      subResult: `RF Band Classification: ${band}`,
      breakdown: [
        { label: 'Wavelength (λ)', value: `${fmt(lambdaM)} m` },
        { label: 'Quarter-Wave Antenna Length (λ/4)', value: `${fmt((lambdaM / 4) * 100)} cm` },
        { label: 'Wave Period (T)', value: `${(periodSec * 1e9).toFixed(2)} ns` },
        { label: 'Speed of Light (c)', value: '299,792,458 m/s' }
      ],
      formula: 'λ = c ÷ f,  Period T = 1 ÷ f',
      explanation: 'Fundamental electromagnetic wave relationship in air and free space vacuum.'
    };
  }
};

export const DecibelCalculatorDef = {
  id: 'decibel_power_ratio',
  name: 'Decibel (dB, dBm) & Signal Power Ratio',
  category: 'engineering',
  icon: 'electrical',
  description: 'Calculate decibel gain/loss for power (10 log P₂/P₁) and voltage (20 log V₂/V₁) ratios.',
  inputs: [
    {
      id: 'type',
      label: 'Calculation Type',
      type: 'segmented',
      defaultValue: 'power',
      options: [
        { label: 'Power (Watts)', value: 'power' },
        { label: 'Voltage (Volts)', value: 'voltage' }
      ]
    },
    { id: 'inVal', label: 'Input Value (P₁ / V₁)', type: 'number', defaultValue: 1 },
    { id: 'outVal', label: 'Output Value (P₂ / V₂)', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const isPower = vals.type === 'power';
    const v1 = parseFloat(vals.inVal) || 1;
    const v2 = parseFloat(vals.outVal) || 1;

    const ratio = v2 / v1;
    const db = isPower ? 10 * Math.log10(ratio) : 20 * Math.log10(ratio);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(db)} dB`,
      mainLabel: 'Decibel Gain / Attenuation',
      subResult: `Linear Amplification Ratio: ${fmt(ratio)}x`,
      breakdown: [
        { label: 'Decibels (dB)', value: `${fmt(db)} dB` },
        { label: 'Linear Gain Ratio', value: `${fmt(ratio)}x` },
        { label: 'Input Level', value: `${v1}` },
        { label: 'Output Level', value: `${v2}` }
      ],
      formula: isPower ? 'dB = 10 × log₁₀(P₂ ÷ P₁)' : 'dB = 20 × log₁₀(V₂ ÷ V₁)',
      explanation: 'Logarithmic unit of signal power amplification and telecommunication gain.'
    };
  }
};


// ==========================================
// 7. 🚗 AUTOMOBILE ENGINEERING
// ==========================================

export const FuelEconomyCalcDef = {
  id: 'fuel_economy_calc',
  name: 'Fuel Economy & Mileage Converter',
  category: 'engineering',
  icon: 'car',
  description: 'Convert fuel efficiency between km/L, L/100 km, US MPG, and Imperial UK MPG.',
  inputs: [
    { id: 'kml', label: 'Fuel Economy (km / Liter)', type: 'number', defaultValue: 18 }
  ],
  calculate: (vals) => {
    const kml = parseFloat(vals.kml) || 1;

    const l100km = 100 / kml;
    const usMpg = kml * 2.35214583;
    const ukMpg = kml * 2.82481;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(l100km)} L/100 km (${fmt(usMpg)} US MPG)`,
      mainLabel: 'Fuel Consumption Metrics',
      subResult: `UK Mileage: ${fmt(ukMpg)} MPG (Imperial)`,
      breakdown: [
        { label: 'Metric Liters / 100 km', value: `${fmt(l100km)} L/100km` },
        { label: 'US Miles per Gallon', value: `${fmt(usMpg)} MPG` },
        { label: 'UK Miles per Gallon', value: `${fmt(ukMpg)} MPG` },
        { label: 'Kilometers per Liter', value: `${kml} km/L` }
      ],
      formula: 'L/100km = 100 ÷ (km/L),  US MPG = km/L × 2.352',
      explanation: 'Global automotive fuel consumption standards conversion.'
    };
  }
};

export const FuelCostTripCalcDef = {
  id: 'fuel_cost_trip_calc',
  name: 'Trip Fuel Cost & Consumption',
  category: 'engineering',
  icon: 'car',
  description: 'Calculate fuel required and total trip expenditure based on distance, vehicle mileage, and fuel price.',
  inputs: [
    { id: 'dist', label: 'Trip Distance (km)', type: 'number', defaultValue: 350 },
    { id: 'mileage', label: 'Vehicle Mileage (km/L)', type: 'number', defaultValue: 16 },
    { id: 'price', label: 'Fuel Price (₹ per Liter)', type: 'number', defaultValue: 96 }
  ],
  calculate: (vals) => {
    const dist = parseFloat(vals.dist) || 0;
    const mileage = parseFloat(vals.mileage) || 1;
    const price = parseFloat(vals.price) || 0;

    const fuelLiters = dist / mileage;
    const totalCost = fuelLiters * price;
    const costPerKm = dist > 0 ? totalCost / dist : 0;

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `₹${fmt(totalCost)} Total Cost`,
      mainLabel: 'Total Trip Fuel Cost',
      subResult: `Fuel Required: ${fmt(fuelLiters)} Liters (₹${fmt(costPerKm)} / km)`,
      breakdown: [
        { label: 'Total Trip Fuel Cost', value: `₹${fmt(totalCost)}` },
        { label: 'Total Fuel Volume', value: `${fmt(fuelLiters)} Liters` },
        { label: 'Running Cost per km', value: `₹${fmt(costPerKm)} / km` },
        { label: 'Trip Distance', value: `${dist} km` }
      ],
      formula: 'Fuel (L) = Distance ÷ Mileage,  Total Cost = Fuel × Price',
      explanation: 'Automotive trip fuel budgeting and vehicle operating expenditure.'
    };
  }
};

export const EngineDisplacementDef = {
  id: 'engine_displacement',
  name: 'Engine Displacement (cc / Liters)',
  category: 'engineering',
  icon: 'car',
  description: 'Calculate internal combustion engine cubic capacity (cc) and liters from cylinder bore, stroke, and cylinder count.',
  inputs: [
    { id: 'bore', label: 'Cylinder Bore (mm)', type: 'number', defaultValue: 82.5 },
    { id: 'stroke', label: 'Piston Stroke (mm)', type: 'number', defaultValue: 92.8 },
    { id: 'cyl', label: 'Number of Cylinders', type: 'number', defaultValue: 4 }
  ],
  calculate: (vals) => {
    const bore = parseFloat(vals.bore) || 0;
    const stroke = parseFloat(vals.stroke) || 0;
    const cyl = parseInt(vals.cyl, 10) || 1;

    const singleCylVolCc = (Math.PI / 4) * Math.pow(bore / 10, 2) * (stroke / 10);
    const totalCc = singleCylVolCc * cyl;
    const liters = totalCc / 1000;
    const boreStrokeRatio = bore / stroke;

    const fmt = (n) => parseFloat(n.toFixed(1)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(totalCc)} cc (${liters.toFixed(2)}L)`,
      mainLabel: 'Total Engine Displacement',
      subResult: `${cyl}-Cylinder Engine (${boreStrokeRatio > 1 ? 'Over-square' : 'Under-square'})`,
      breakdown: [
        { label: 'Single Cylinder Displacement', value: `${fmt(singleCylVolCc)} cc` },
        { label: 'Total Cubic Centimeters', value: `${fmt(totalCc)} cc` },
        { label: 'Total Liters', value: `${liters.toFixed(2)} Liters` },
        { label: 'Bore / Stroke Ratio', value: `${boreStrokeRatio.toFixed(3)}` }
      ],
      formula: `Displacement = N × (π ÷ 4) × Bore² × Stroke`,
      explanation: 'Calculates swept volume displacement of internal combustion pistons.'
    };
  }
};

export const TireSizeCalcDef = {
  id: 'tire_size_calculator',
  name: 'Tire Size, Diameter & Circumference',
  category: 'engineering',
  icon: 'car',
  description: 'Calculate overall tire diameter, sidewall height, circumference, and revolutions per kilometer.',
  inputs: [
    { id: 'w', label: 'Tire Section Width (mm)', type: 'number', defaultValue: 205 },
    { id: 'ar', label: 'Aspect Ratio (%)', type: 'number', defaultValue: 55 },
    { id: 'rim', label: 'Wheel Rim Diameter (inches)', type: 'number', defaultValue: 16 }
  ],
  calculate: (vals) => {
    const w = parseFloat(vals.w) || 205;
    const ar = (parseFloat(vals.ar) || 55) / 100;
    const rimInches = parseFloat(vals.rim) || 16;

    const sidewallMm = w * ar;
    const rimMm = rimInches * 25.4;
    const overallDiaMm = rimMm + 2 * sidewallMm;
    const circumMm = Math.PI * overallDiaMm;
    const revsPerKm = (1000 * 1000) / circumMm;

    const fmt = (n) => parseFloat(n.toFixed(1)).toLocaleString('en-US');

    return {
      mainResult: `Ø ${fmt(overallDiaMm)} mm (${(overallDiaMm / 25.4).toFixed(1)} inches)`,
      mainLabel: 'Overall Tire Diameter',
      subResult: `Circumference: ${fmt(circumMm)} mm | ${fmt(revsPerKm)} Revs/km`,
      breakdown: [
        { label: 'Overall Diameter', value: `${fmt(overallDiaMm)} mm` },
        { label: 'Sidewall Height', value: `${fmt(sidewallMm)} mm` },
        { label: 'Tire Rolling Circumference', value: `${fmt(circumMm)} mm` },
        { label: 'Revolutions per km', value: `${fmt(revsPerKm)} revs/km` }
      ],
      formula: 'Diameter = (Rim × 25.4) + 2 × (Width × Aspect Ratio)',
      explanation: 'Standard metric tire sizing geometry (e.g. 205/55 R16).'
    };
  }
};

export const CarRpmSpeedCalcDef = {
  id: 'car_rpm_speed_calc',
  name: 'Vehicle Speed vs Engine RPM & Gear Ratio',
  category: 'engineering',
  icon: 'car',
  description: 'Calculate vehicle road speed (km/h and mph) based on engine RPM, transmission gear ratio, final drive, and tire circumference.',
  inputs: [
    { id: 'rpm', label: 'Engine RPM', type: 'number', defaultValue: 3000 },
    { id: 'gear', label: 'Selected Gear Ratio', type: 'number', defaultValue: 0.95 },
    { id: 'fd', label: 'Final Drive Ratio (Axle Differential)', type: 'number', defaultValue: 3.85 },
    { id: 'tireDia', label: 'Tire Overall Diameter (mm)', type: 'number', defaultValue: 632 }
  ],
  calculate: (vals) => {
    const rpm = parseFloat(vals.rpm) || 0;
    const gear = parseFloat(vals.gear) || 1;
    const fd = parseFloat(vals.fd) || 1;
    const tireDiaMm = parseFloat(vals.tireDia) || 632;

    const totalRatio = gear * fd;
    const wheelRpm = totalRatio > 0 ? rpm / totalRatio : 0;
    const circumM = (Math.PI * tireDiaMm) / 1000;
    const speedMs = (wheelRpm * circumM) / 60;
    const speedKmh = speedMs * 3.6;
    const speedMph = speedKmh * 0.621371;

    const fmt = (n) => parseFloat(n.toFixed(1)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(speedKmh)} km/h (${fmt(speedMph)} MPH)`,
      mainLabel: 'Vehicle Road Speed',
      subResult: `Wheel Speed: ${fmt(wheelRpm)} RPM (Total Gear Reduction: ${totalRatio.toFixed(2)}:1)`,
      breakdown: [
        { label: 'Vehicle Speed (km/h)', value: `${fmt(speedKmh)} km/h` },
        { label: 'Vehicle Speed (MPH)', value: `${fmt(speedMph)} mph` },
        { label: 'Wheel Rotational Speed', value: `${fmt(wheelRpm)} RPM` },
        { label: 'Total Transmission Ratio', value: `${totalRatio.toFixed(2)} : 1` }
      ],
      formula: 'Speed (km/h) = (Engine RPM ÷ Total Ratio) × Circumference × 0.06',
      explanation: 'Drivetrain kinematic speed calculation across gearbox and differential ratios.'
    };
  }
};


// ==========================================
// 8. ✈️ AEROSPACE ENGINEERING
// ==========================================

export const MachNumberSpeedDef = {
  id: 'mach_number_speed',
  name: 'Mach Number & Supersonic Speed',
  category: 'engineering',
  icon: 'engineering',
  description: 'Convert aircraft speed to Mach number based on atmospheric altitude and temperature.',
  inputs: [
    { id: 'speed', label: 'Aircraft True Airspeed (km/h)', type: 'number', defaultValue: 2400 },
    { id: 'alt', label: 'Altitude (meters)', type: 'number', defaultValue: 10000 }
  ],
  calculate: (vals) => {
    const speedKmh = parseFloat(vals.speed) || 0;
    const altM = parseFloat(vals.alt) || 0;

    const tempK = Math.max(216.65, 288.15 - 0.0065 * altM);
    const speedOfSoundMs = Math.sqrt(1.4 * 287.05 * tempK);
    const speedOfSoundKmh = speedOfSoundMs * 3.6;

    const mach = speedKmh / speedOfSoundKmh;

    let regime = 'Subsonic';
    if (mach >= 0.8 && mach < 1.2) regime = 'Transonic';
    else if (mach >= 1.2 && mach < 5.0) regime = 'Supersonic';
    else if (mach >= 5.0) regime = 'Hypersonic';

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `Mach ${mach.toFixed(2)} (${regime})`,
      mainLabel: 'Mach Flight Regime',
      subResult: `Speed of Sound at ${altM}m: ${fmt(speedOfSoundKmh)} km/h`,
      breakdown: [
        { label: 'Mach Number', value: `M ${mach.toFixed(3)}` },
        { label: 'Local Speed of Sound', value: `${fmt(speedOfSoundKmh)} km/h` },
        { label: 'Air Temperature at Alt', value: `${(tempK - 273.15).toFixed(1)} °C` },
        { label: 'Speed in Knots', value: `${fmt(speedKmh * 0.539957)} knots` }
      ],
      formula: `Mach = Velocity ÷ Speed of Sound (a = √(γ·R·T))`,
      explanation: 'Compressible fluid dynamics ratio of flight velocity to local acoustic sound speed.'
    };
  }
};

export const AerodynamicDragLiftDef = {
  id: 'aerodynamic_drag_lift',
  name: 'Aerodynamic Drag & Lift Force',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate aerodynamic drag force and lift force for airfoils and moving vehicles.',
  inputs: [
    { id: 'v', label: 'Velocity (km/h)', type: 'number', defaultValue: 250 },
    { id: 'area', label: 'Frontal / Wing Area A (m²)', type: 'number', defaultValue: 1.8 },
    { id: 'cd', label: 'Drag Coefficient (Cd)', type: 'number', defaultValue: 0.32 },
    { id: 'rho', label: 'Air Density ρ (kg/m³ - Sea Level=1.225)', type: 'number', defaultValue: 1.225 }
  ],
  calculate: (vals) => {
    const vKmh = parseFloat(vals.v) || 0;
    const vMs = vKmh / 3.6;
    const a = parseFloat(vals.area) || 1;
    const cd = parseFloat(vals.cd) || 0.3;
    const rho = parseFloat(vals.rho) || 1.225;

    const dragN = 0.5 * rho * Math.pow(vMs, 2) * cd * a;
    const powerKw = (dragN * vMs) / 1000;
    const powerHp = powerKw * 1.34102;

    const fmt = (n) => parseFloat(n.toFixed(1)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(dragN)} N Drag Force`,
      mainLabel: 'Aerodynamic Drag Resistance',
      subResult: `Power to Overcome Drag: ${fmt(powerKw)} kW (${fmt(powerHp)} HP)`,
      breakdown: [
        { label: 'Drag Force (Fd)', value: `${fmt(dragN)} N` },
        { label: 'Power to Overcome Drag', value: `${fmt(powerKw)} kW` },
        { label: 'Equivalent Horsepower', value: `${fmt(powerHp)} HP` },
        { label: 'Velocity (m/s)', value: `${vMs.toFixed(2)} m/s` }
      ],
      formula: 'Fd = ½ × ρ × v² × Cd × A,  Power = Fd × v',
      explanation: 'Calculates fluid dynamic resistance and propulsion energy required at speed.'
    };
  }
};


// ==========================================
// 9. 🌱 ENVIRONMENTAL ENGINEERING
// ==========================================

export const CarbonFootprintDef = {
  id: 'carbon_footprint_calc',
  name: 'Carbon Footprint & CO₂ Emissions',
  category: 'engineering',
  icon: 'weather',
  description: 'Calculate annual CO₂ carbon footprint from electricity, fuel consumption, and flights.',
  inputs: [
    { id: 'kwh', label: 'Monthly Electricity Usage (kWh)', type: 'number', defaultValue: 300 },
    { id: 'fuel', label: 'Monthly Vehicle Fuel (Liters)', type: 'number', defaultValue: 60 },
    { id: 'flights', label: 'Yearly Flight Distance (km)', type: 'number', defaultValue: 4000 }
  ],
  calculate: (vals) => {
    const kwh = parseFloat(vals.kwh) || 0;
    const fuel = parseFloat(vals.fuel) || 0;
    const flights = parseFloat(vals.flights) || 0;

    const elecCo2 = (kwh * 12) * 0.82;
    const fuelCo2 = (fuel * 12) * 2.31;
    const flightCo2 = flights * 0.15;

    const totalKg = elecCo2 + fuelCo2 + flightCo2;
    const totalTons = totalKg / 1000;
    const treesRequired = Math.ceil(totalKg / 21.77);

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(totalTons)} Tons CO₂ / yr`,
      mainLabel: 'Annual Carbon Footprint',
      subResult: `Offsetting requires planting ~${treesRequired} mature trees`,
      breakdown: [
        { label: 'Electricity Emissions', value: `${fmt(elecCo2 / 1000)} Tons CO₂` },
        { label: 'Transportation Fuel', value: `${fmt(fuelCo2 / 1000)} Tons CO₂` },
        { label: 'Aviation Flights', value: `${fmt(flightCo2 / 1000)} Tons CO₂` },
        { label: 'Total Annual Emissions', value: `${fmt(totalKg)} kg CO₂e` }
      ],
      formula: 'CO₂e = ∑ (Activity Activity × Emission Factor)',
      explanation: 'Greenhouse gas emissions quantification across domestic and transport energy.'
    };
  }
};


// ==========================================
// 10. 🤖 INDUSTRIAL / PRODUCTION ENGINEERING
// ==========================================

export const OeeCalculatorDef = {
  id: 'oee_calculator',
  name: 'OEE (Overall Equipment Effectiveness)',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate manufacturing OEE: Availability × Performance × Quality metrics.',
  inputs: [
    { id: 'avail', label: 'Availability Rate (%)', type: 'number', defaultValue: 90 },
    { id: 'perf', label: 'Performance / Speed Rate (%)', type: 'number', defaultValue: 85 },
    { id: 'qual', label: 'Quality / Good Parts Rate (%)', type: 'number', defaultValue: 98 }
  ],
  calculate: (vals) => {
    const a = (parseFloat(vals.avail) || 100) / 100;
    const p = (parseFloat(vals.perf) || 100) / 100;
    const q = (parseFloat(vals.qual) || 100) / 100;

    const oee = a * p * q * 100;

    let worldClass = 'Typical (60% - 75%)';
    if (oee >= 85) worldClass = 'World Class Manufacturing (≥ 85%)';
    else if (oee >= 75) worldClass = 'Good Industrial Performance';
    else if (oee < 60) worldClass = 'Low Efficiency (High Downtime/Loss)';

    const fmt = (n) => parseFloat(n.toFixed(2)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(oee)}% OEE`,
      mainLabel: 'Overall Equipment Effectiveness',
      subResult: `Benchmark: ${worldClass}`,
      breakdown: [
        { label: 'Availability Factor (A)', value: `${(a * 100).toFixed(1)}%` },
        { label: 'Performance Factor (P)', value: `${(p * 100).toFixed(1)}%` },
        { label: 'Quality Factor (Q)', value: `${(q * 100).toFixed(1)}%` },
        { label: 'Total Lost Capacity', value: `${(100 - oee).toFixed(2)}%` }
      ],
      formula: `OEE = Availability × Performance × Quality = ${fmt(oee)}%`,
      explanation: 'Standard Lean Manufacturing metric to identify machine productivity and downtime.'
    };
  }
};

export const TaktCycleTimeDef = {
  id: 'takt_cycle_time_calc',
  name: 'Takt Time & Production Cycle Time',
  category: 'engineering',
  icon: 'engineering',
  description: 'Calculate takt time pace needed to meet customer demand and compare with production cycle time.',
  inputs: [
    { id: 'hours', label: 'Daily Planned Production Time (Hours)', type: 'number', defaultValue: 8 },
    { id: 'breaks', label: 'Planned Downtime / Breaks (Minutes)', type: 'number', defaultValue: 60 },
    { id: 'demand', label: 'Customer Demand (Units per Day)', type: 'number', defaultValue: 700 }
  ],
  calculate: (vals) => {
    const h = parseFloat(vals.hours) || 8;
    const breaksMin = parseFloat(vals.breaks) || 0;
    const demand = parseFloat(vals.demand) || 1;

    const totalAvailableSec = Math.max(0, (h * 60 - breaksMin) * 60);
    const taktSec = totalAvailableSec / demand;

    const fmt = (n) => parseFloat(n.toFixed(1)).toLocaleString('en-US');

    return {
      mainResult: `${fmt(taktSec)} sec / unit`,
      mainLabel: 'Required Takt Time Pace',
      subResult: `Target Production Pace: ${(3600 / taktSec).toFixed(1)} units/hour`,
      breakdown: [
        { label: 'Takt Time per Unit', value: `${fmt(taktSec)} seconds` },
        { label: 'Net Available Work Time', value: `${(totalAvailableSec / 3600).toFixed(2)} hours` },
        { label: 'Required Output / Minute', value: `${(60 / taktSec).toFixed(2)} units` },
        { label: 'Daily Target Demand', value: `${demand} units` }
      ],
      formula: 'Takt Time = Net Available Operating Time ÷ Customer Demand',
      explanation: 'Foundational Lean Manufacturing metric synchronizing assembly rate with sales demand.'
    };
  }
};
