import {
  LinearEquationDef,
  QuadraticEquationDef,
  CubicEquationDef,
  SystemEquationsDef,
  SlopeInterceptDef,
  DistanceMidpointDef,
  ArithmeticProgressionDef,
  GeometricProgressionDef,
  MatrixOpsDef,
  VectorCalcDef
} from '../js/calculators/definitions/algebra_defs.js';

import {
  PythagoreanTheoremDef,
  TriangleGeometryDef,
  RectangleSquareDef,
  CircleEllipseDef,
  TrapezoidRhombusDef,
  PolygonsDef,
  CubeCuboidDef,
  CylinderVolumeDef,
  ConePyramidDef,
  SphereHemisphereDef
} from '../js/calculators/definitions/geometry_defs.js';

import {
  SinCosTanDef,
  InverseTrigDef,
  DegRadConverterDef,
  RightTriangleTrigDef,
  LawOfSinesDef,
  LawOfCosinesDef
} from '../js/calculators/definitions/trigonometry_defs.js';

import {
  AverageDef,
  WeightedAverageDef,
  ModuloDef,
  RomanNumeralsDef,
  NumberBaseDef
} from '../js/calculators/definitions/arithmetic_defs.js';

import { CALCULATORS_MAP, getCalculator } from '../js/registry.js';
import { TOP_LEVEL_CATEGORIES } from '../js/taxonomy.js';

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${name}`);
    failed++;
  }
}

console.log('======================================================');
console.log('CALQIO Math Suite Verification Tests');
console.log('======================================================\n');

// 1. Algebra Tests
console.log('--- 1. Algebra Solvers ---');
const linRes = LinearEquationDef.calculate({ a: 3, b: 6, c: 24 });
assert(linRes.mainResult === 'x = 6', 'Linear Equation 3x + 6 = 24 -> x = 6');

const quadRes = QuadraticEquationDef.calculate({ a: 1, b: -5, c: 6 });
assert(quadRes.mainResult.includes('x₁ = 3') && quadRes.mainResult.includes('x₂ = 2'), 'Quadratic Equation x² - 5x + 6 = 0 -> x = 3, 2');

const sysRes = SystemEquationsDef.calculate({ a1: 2, b1: 3, c1: 12, a2: 4, b2: -1, c2: 10 });
assert(sysRes.mainResult === 'x = 3,  y = 2', 'Linear System (2x+3y=12, 4x-y=10) -> (3, 2)');

const slopeRes = SlopeInterceptDef.calculate({ x1: 2, y1: 3, x2: 6, y2: 11 });
assert(slopeRes.mainResult === 'y = 2x − 1', 'Slope-Intercept Line between (2,3) and (6,11) -> y = 2x - 1');

const distRes = DistanceMidpointDef.calculate({ x1: 1, y1: 2, x2: 4, y2: 6 });
assert(distRes.mainResult === '5 units', 'Euclidean Distance between (1,2) and (4,6) -> 5 units');

const apRes = ArithmeticProgressionDef.calculate({ a: 3, d: 5, n: 10 });
assert(apRes.mainResult === 'S10 = 255' && apRes.subResult.includes('a10 = 48'), 'Arithmetic Progression AP(a=3, d=5, n=10) -> S10=255, a10=48');

const gpRes = GeometricProgressionDef.calculate({ a: 2, r: 3, n: 4 });
assert(gpRes.mainResult === 'S4 = 80' && gpRes.subResult.includes('a4 = 54'), 'Geometric Progression GP(a=2, r=3, n=4) -> S4=80, a4=54');

const matRes = MatrixOpsDef.calculate({ op: 'det', a11: 1, a12: 2, a21: 3, a22: 4 });
assert(matRes.mainResult === 'det(A) = -2', 'Matrix Determinant of [[1,2],[3,4]] -> -2');

const vecRes = VectorCalcDef.calculate({ u1: 1, u2: 2, u3: 3, v1: 4, v2: 5, v3: 6 });
assert(vecRes.mainResult === 'u · v = 32', 'Vector Dot Product of (1,2,3) and (4,5,6) -> 32');

// 2. Geometry Tests
console.log('\n--- 2. Geometry Solvers ---');
const pythRes = PythagoreanTheoremDef.calculate({ solveFor: 'c', val1: 3, val2: 4 });
assert(pythRes.mainResult === 'c = 5', 'Pythagorean Hypotenuse a=3, b=4 -> c=5');

const triRes = TriangleGeometryDef.calculate({ method: 'sides', a: 6, b: 8, c: 10 });
assert(triRes.mainResult === '24 sq units', 'Triangle Area a=6, b=8, c=10 -> 24 sq units');

const rectRes = RectangleSquareDef.calculate({ length: 12, width: 8 });
assert(rectRes.mainResult === '96 sq units', 'Rectangle Area 12x8 -> 96 sq units');

const circRes = CircleEllipseDef.calculate({ shape: 'circle', r1: 7 });
assert(circRes.subResult.includes('Circumference: 43.9823'), 'Circle Radius 7 -> Circumference ~43.98');

const cubeRes = CubeCuboidDef.calculate({ l: 5, w: 5, h: 5 });
assert(cubeRes.mainResult === '125 cubic units', 'Cube Volume 5x5x5 -> 125 cubic units');

const cylRes = CylinderVolumeDef.calculate({ r: 3, h: 7 });
assert(cylRes.mainResult === '197.9203 cubic units', 'Cylinder Volume r=3, h=7 -> ~197.92 cubic units');

// 3. Trigonometry Tests
console.log('\n--- 3. Trigonometry Solvers ---');
const trigRes = SinCosTanDef.calculate({ angle: 30, unit: 'deg' });
assert(trigRes.breakdown[0].value === '0.5' && trigRes.breakdown[1].value === '0.866025', 'Sin(30°) = 0.5, Cos(30°) = 0.866');

const degRadRes = DegRadConverterDef.calculate({ angle: 180, fromUnit: 'deg' });
assert(degRadRes.mainResult.includes('3.141593 rad'), '180° = π radians (3.141593 rad)');

const rTrigRes = RightTriangleTrigDef.calculate({ sideA: 5, sideB: 12 });
assert(rTrigRes.mainResult === 'c = 13 units', 'Right Triangle Sides 5 and 12 -> Hypotenuse 13');

// 4. Arithmetic & Number Theory Tests
console.log('\n--- 4. Arithmetic & Number Theory ---');
const avgRes = AverageDef.calculate({ numbers: '10, 20, 30, 40, 50' });
assert(avgRes.mainResult === '30', 'Average of [10, 20, 30, 40, 50] -> 30');

const weightRes = WeightedAverageDef.calculate({ v1: 80, w1: 1, v2: 90, w2: 2, v3: 100, w3: 1 });
assert(weightRes.mainResult === '90', 'Weighted Average [80(1), 90(2), 100(1)] -> 90');

const modRes = ModuloDef.calculate({ dividend: 29, divisor: 6 });
assert(modRes.mainResult === '5', '29 mod 6 = 5');

const romanRes = RomanNumeralsDef.calculate({ mode: 'to_roman', input: '2026' });
assert(romanRes.mainResult === 'MMXXVI', '2026 to Roman -> MMXXVI');

const baseRes = NumberBaseDef.calculate({ fromBase: '10', input: '255' });
assert(baseRes.mainResult.includes('0xFF') && baseRes.mainResult.includes('11111111'), '255 Dec -> Hex 0xFF, Bin 11111111');

// 5. Complete Registry Integration for Math Category
console.log('\n--- 5. Registry Coverage for Math Category ---');
const mathSections = TOP_LEVEL_CATEGORIES.math.sections;
let totalMathCalculators = 0;
let registeredMathCalculators = 0;

mathSections.forEach(sec => {
  sec.items.forEach(id => {
    totalMathCalculators++;
    const calc = getCalculator(id);
    if (calc) {
      registeredMathCalculators++;
    } else {
      console.error(`Missing registered calculator for Math tool: ${id}`);
    }
  });
});

assert(registeredMathCalculators === totalMathCalculators, `All ${totalMathCalculators} Math Category Tools are Registered in Engine (${registeredMathCalculators}/${totalMathCalculators})`);

console.log('\n======================================================');
console.log(`🎉 Math Suite Verification: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
