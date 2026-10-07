/**
 * CALQIO Declarative Engine & Standard Calculator Suite Test
 */

import { PercentageDef } from '../js/calculators/definitions/percentage.js';
import { EmiDef, LoanDef } from '../js/calculators/definitions/emi.js';
import { GstDef, DiscountDef, ProfitLossDef } from '../js/calculators/definitions/business_defs.js';
import { BmiDef, AgeDef, CgpaDef } from '../js/calculators/definitions/health_edu_defs.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

function assertClose(val1, val2, tolerance = 0.05, message = '') {
  const diff = Math.abs(val1 - val2);
  if (diff > tolerance) {
    console.error(`❌ FAIL: ${message} (Expected ~${val2}, got ${val1}, diff ${diff})`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message} (${val1} ≈ ${val2})`);
  }
}

const ctx = { currency: '₹' };

console.log('\n--- 1. Testing Percentage Calculator Definition ---');
const pRes1 = PercentageDef.calculate({ mode: 'of', valA: 25, valB: 5000 }, ctx);
assert(pRes1.mainResult === '1,250', '25% of 5,000 = 1,250');

const pRes2 = PercentageDef.calculate({ mode: 'is_what', valA: 450, valB: 1800 }, ctx);
assert(pRes2.mainResult === '25%', '450 is 25% of 1,800');

const pRes3 = PercentageDef.calculate({ mode: 'change', valA: 120, valB: 180 }, ctx);
assert(pRes3.mainResult === '+50%', 'Change from 120 to 180 is +50%');

console.log('\n--- 2. Testing EMI & Loan Calculators ---');
const emiRes = EmiDef.calculate({ principal: 1000000, rate: 8.5, tenure: 5 }, ctx);
assert(emiRes.mainResult === '₹20,517', 'Monthly EMI is ₹20,517');
assert(emiRes.breakdown[1].value.includes('₹230,992'), 'Total interest is ₹230,992');

const loanRes = LoanDef.calculate({ amount: 300000, rate: 7.2, months: 36 }, ctx);
assert(loanRes.mainResult === '₹9,290.59', '300k Loan Monthly payment is ₹9,290.59');

console.log('\n--- 3. Testing GST Calculator ---');
const gstAdd = GstDef.calculate({ mode: 'add', amount: 10000, rate: 18 }, ctx);
assert(gstAdd.mainResult === '₹11,800.00', 'Add GST: 10,000 + 18% = ₹11,800.00');

const gstRem = GstDef.calculate({ mode: 'remove', amount: 11800, rate: 18 }, ctx);
assert(gstRem.breakdown[0].value === '₹10,000.00', 'Remove GST: Net amount is ₹10,000.00');

console.log('\n--- 4. Testing Discount & Profit/Loss ---');
const discRes = DiscountDef.calculate({ price: 2500, discount: 20, extra: 5 }, ctx);
assert(discRes.mainResult === '₹1,900.00', '2500 with 20% + 5% coupon = ₹1,900.00');
assert(discRes.subResult.includes('₹600.00'), 'Total discount savings is ₹600.00');

const plProfit = ProfitLossDef.calculate({ cost: 1500, selling: 2250 }, ctx);
assert(plProfit.mainResult === '+₹750.00', 'Profit is +₹750.00');
assert(plProfit.breakdown[2].value === '33.33%', 'Profit margin is 33.33%');

const plLoss = ProfitLossDef.calculate({ cost: 2000, selling: 1600 }, ctx);
assert(plLoss.mainResult === '−₹400.00', 'Loss is −₹400.00');

console.log('\n--- 5. Testing Health & Education Calculators ---');
const bmiRes = BmiDef.calculate({ height: 175, weight: 70 }, ctx);
assert(bmiRes.mainResult === '22.9', 'BMI for 175cm, 70kg is 22.9');
assert(bmiRes.subResult.includes('Normal Weight'), 'BMI classification is Normal Weight');

const ageRes = AgeDef.calculate({ dob: '2000-01-15', target: '2026-03-20' }, ctx);
assert(ageRes.mainResult === '26 Years', 'Age is 26 Years');

const cgpaRes1 = CgpaDef.calculate({ gpa: 3.8, scale: '4.0' }, ctx);
assert(cgpaRes1.mainResult === '95.0%', '3.8 on 4.0 scale is 95.0%');

const cgpaRes2 = CgpaDef.calculate({ gpa: 8.5, scale: '10.0' }, ctx);
assert(cgpaRes2.mainResult === '77.5%', '8.5 on 10.0 scale is 77.5%');

console.log('\n======================================================');
console.log('🎉 ALL REUSABLE ENGINE CALCULATOR TESTS PASSED (100%)');
console.log('======================================================\n');
