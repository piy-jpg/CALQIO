/**
 * CALQIO Declarative BMI, Age, and CGPA Calculators
 */

export const BmiDef = {
  id: 'bmi',
  name: 'BMI Calculator',
  category: 'health',
  icon: 'heart',
  description: 'Calculate Body Mass Index (BMI), health classification, and healthy weight targets.',
  inputs: [
    {
      id: 'height',
      label: 'Height (cm)',
      type: 'number',
      defaultValue: 175,
      min: 50,
      max: 260,
      step: 0.5,
      suffix: 'cm',
      rangeSync: true,
      rangeMin: 120,
      rangeMax: 220,
      validate: (v) => v <= 0 ? 'Height must be positive' : null
    },
    {
      id: 'weight',
      label: 'Weight (kg)',
      type: 'number',
      defaultValue: 70,
      min: 10,
      max: 350,
      step: 0.5,
      suffix: 'kg',
      rangeSync: true,
      rangeMin: 30,
      rangeMax: 180,
      validate: (v) => v <= 0 ? 'Weight must be positive' : null
    }
  ],
  calculate: (vals) => {
    const hCm = parseFloat(vals.height) || 175;
    const wKg = parseFloat(vals.weight) || 70;
    const hM = hCm / 100;

    const bmi = wKg / (hM * hM);
    const roundedBmi = parseFloat(bmi.toFixed(1));

    let category = 'Normal Weight';
    let color = 'var(--accent-success)';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'var(--accent-info)';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal Weight';
      color = 'var(--accent-success)';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      category = 'Overweight';
      color = 'var(--accent-warning)';
    } else {
      category = 'Obese';
      color = 'var(--accent-danger)';
    }

    const minIdeal = (18.5 * hM * hM).toFixed(1);
    const maxIdeal = (24.9 * hM * hM).toFixed(1);

    return {
      mainResult: `${roundedBmi}`,
      mainLabel: 'Body Mass Index (BMI)',
      subResult: `${category} Classification`,
      breakdown: [
        { label: 'Category', value: category, color },
        { label: 'Healthy Weight Range', value: `${minIdeal} – ${maxIdeal} kg` },
        { label: 'Height / Weight', value: `${hCm} cm / ${wKg} kg` }
      ],
      formula: `BMI = Weight(kg) ÷ (Height(m))² = ${wKg} ÷ (${hM.toFixed(2)})² = ${roundedBmi}`,
      explanation: `For a height of ${hCm} cm, the healthy weight range according to WHO guidelines is ${minIdeal} kg to ${maxIdeal} kg.`,
      expression: `${hCm} cm, ${wKg} kg`
    };
  },
  related: ['bmr_tdee', 'age', 'percentage']
};

export const AgeDef = {
  id: 'age',
  name: 'Age Calculator',
  category: 'datetime',
  icon: 'calendar',
  description: 'Calculate exact chronological age in years, months, days, and total lifetime milestones.',
  inputs: [
    {
      id: 'dob',
      label: 'Date of Birth',
      type: 'date',
      defaultValue: '1998-05-15',
      validate: (v) => !v ? 'Please select a valid date of birth' : null
    },
    {
      id: 'target',
      label: 'Age on Date',
      type: 'date',
      defaultValue: new Date().toISOString().split('T')[0],
      validate: (v, all) => {
        if (!v) return 'Please select a target date';
        if (new Date(all.dob) > new Date(v)) return 'Date of birth cannot be after target date';
        return null;
      }
    }
  ],
  calculate: (vals) => {
    const dob = new Date((vals.dob || '1998-05-15') + 'T00:00:00');
    const target = new Date((vals.target || new Date().toISOString().split('T')[0]) + 'T00:00:00');

    let years = target.getFullYear() - dob.getFullYear();
    let months = target.getMonth() - dob.getMonth();
    let days = target.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = target.getTime() - dob.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;

    return {
      mainResult: `${years} Years`,
      mainLabel: 'Chronological Age',
      subResult: `${months} months, ${days} days`,
      breakdown: [
        { label: 'Total Months', value: totalMonths.toLocaleString('en-US') },
        { label: 'Total Weeks', value: totalWeeks.toLocaleString('en-US') },
        { label: 'Total Days', value: totalDays.toLocaleString('en-US') },
        { label: 'Total Hours', value: (totalDays * 24).toLocaleString('en-US') }
      ],
      formula: `Age = ${years}y ${months}m ${days}d`,
      explanation: `Calculated with exact calendar day counts and leap year precision.`,
      expression: `DOB: ${vals.dob}`
    };
  },
  related: ['date_diff', 'bmi', 'tip_split']
};

export const CgpaDef = {
  id: 'cgpa',
  name: 'CGPA & GPA Calculator',
  category: 'education',
  icon: 'education',
  description: 'Calculate Cumulative Grade Point Average (CGPA), semester GPA, and equivalent percentages.',
  inputs: [
    {
      id: 'gpa',
      label: 'Grade Points (CGPA on 4.0 or 10.0 scale)',
      type: 'number',
      defaultValue: 3.8,
      min: 0,
      max: 10,
      step: 0.01,
      rangeSync: true,
      rangeMin: 1,
      rangeMax: 10,
      rangeStep: 0.1,
      validate: (v) => v < 0 || v > 10 ? 'CGPA must be between 0 and 10' : null
    },
    {
      id: 'scale',
      label: 'Grading Scale',
      type: 'select',
      defaultValue: '4.0',
      options: [
        { label: '4.0 Scale (US / Standard)', value: '4.0' },
        { label: '10.0 Scale (Indian / European)', value: '10.0' }
      ]
    }
  ],
  calculate: (vals) => {
    const gpa = parseFloat(vals.gpa) || 0;
    const is4 = vals.scale === '4.0';

    let pct = 0;
    let gpa4 = 0;
    let gpa10 = 0;

    if (is4) {
      gpa4 = gpa;
      gpa10 = (gpa / 4) * 10;
      pct = (gpa / 4) * 100;
    } else {
      gpa10 = gpa;
      gpa4 = (gpa / 10) * 4;
      pct = (gpa - 0.75) * 10; // Standard CBSE/AICTE formula: % = (CGPA - 0.75) * 10
      if (pct < 0) pct = 0;
    }

    let standing = 'First Class with Distinction';
    if (pct < 50) standing = 'Pass Class';
    else if (pct < 60) standing = 'Second Class';
    else if (pct < 75) standing = 'First Class';

    return {
      mainResult: `${pct.toFixed(1)}%`,
      mainLabel: 'Equivalent Percentage',
      subResult: `${standing}`,
      breakdown: [
        { label: '4.0 Scale GPA', value: gpa4.toFixed(2) },
        { label: '10.0 Scale CGPA', value: gpa10.toFixed(2) },
        { label: 'Academic Standing', value: standing, color: 'var(--accent-primary)' }
      ],
      formula: is4 
        ? `Percentage = (GPA ÷ 4.0) × 100 = ${pct.toFixed(1)}%` 
        : `Percentage = (CGPA − 0.75) × 10 = ${pct.toFixed(1)}%`,
      explanation: `Standard university conversion formula mapping grade points to overall academic percentage.`,
      expression: `${gpa} on ${vals.scale} scale`
    };
  },
  related: ['percentage', 'statistics', 'perm_comb']
};
