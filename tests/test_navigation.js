/**
 * CALQIO Navigation & Taxonomy Unit Tests
 */

import { MASTER_TAXONOMY, TOP_LEVEL_CATEGORIES, getTopLevelCategory, getParentCategoryForDomain, getAllCalculatorsForTopCategory } from '../js/taxonomy.js';
import { CALCULATORS_MAP, searchCalculators } from '../js/registry.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- 1. Testing Domain Preservation & Taxonomy Counts ---');
const domainKeys = Object.keys(MASTER_TAXONOMY);
assert(domainKeys.length === 42, `Exactly 42 underlying domains preserved (Found: ${domainKeys.length})`);

const topLevelKeys = Object.keys(TOP_LEVEL_CATEGORIES);
assert(topLevelKeys.length === 15, `14 Top-Level Categories + More defined (Found: ${topLevelKeys.length})`);

console.log('\n--- 2. Testing Parent Category Mappings ---');
assert(getParentCategoryForDomain('geometry') === 'math', 'Domain "geometry" maps to parent "math"');
assert(getParentCategoryForDomain('tax_salary') === 'finance', 'Domain "tax_salary" maps to parent "finance"');
assert(getParentCategoryForDomain('electronics') === 'engineering', 'Domain "electronics" maps to parent "engineering"');
assert(getParentCategoryForDomain('automotive') === 'engineering', 'Domain "automotive" maps to parent "engineering"');
assert(getParentCategoryForDomain('cooking_food') === 'home_lifestyle', 'Domain "cooking_food" maps to parent "home_lifestyle"');
assert(getParentCategoryForDomain('agriculture') === 'more', 'Domain "agriculture" maps to parent "more"');

console.log('\n--- 3. Testing Category Resolution & Sections ---');
const mathCat = getTopLevelCategory('math');
assert(mathCat && mathCat.name === 'Math', 'Resolved Math category');
const mathSectionNames = mathCat.sections.map(s => s.name);
assert(mathSectionNames.includes('Popular') && mathSectionNames.includes('Algebra') && mathSectionNames.includes('Geometry') && mathSectionNames.includes('Trigonometry'), 'Math category has Popular, Algebra, Geometry, Trigonometry sections');

const financeCat = getTopLevelCategory('finance');
assert(financeCat && financeCat.sections.some(s => s.id === 'loans'), 'Finance category contains Loans section');

const mathCalculators = getAllCalculatorsForTopCategory('math');
assert(mathCalculators.length > 20, `Math category aggregates ${mathCalculators.length} calculators across its domains`);

console.log('\n--- 4. Testing Search Resolution & Aliases ---');
const geometrySearch = searchCalculators('geometry');
assert(geometrySearch.some(c => c.id === 'geometry'), 'Searching "geometry" finds Geometry calculator');

const gstSearch = searchCalculators('gst');
assert(gstSearch.some(c => c.id === 'gst'), 'Searching "gst" finds GST calculator');

const resistorSearch = searchCalculators('resistor');
assert(resistorSearch.some(c => c.id === 'ohms_law'), 'Searching "resistor" finds Ohm\'s Law & Power calculator');

const kgSearch = searchCalculators('kg');
assert(kgSearch.some(c => c.id === 'unit_converter'), 'Searching "kg" finds Multi-Unit Converter');

console.log(`\n======================================================`);
console.log(`🎉 ALL NAVIGATION TESTS PASSED (${passed}/${passed + failed})`);
console.log(`======================================================\n`);

if (failed > 0) process.exit(1);
