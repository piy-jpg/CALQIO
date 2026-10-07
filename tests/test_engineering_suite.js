/**
 * Automated Test Suite for CALQIO Engineering Category & 10 Disciplines
 */

import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY, getTopLevelCategory } from '../js/taxonomy.js';
import { CALCULATORS_MAP, CALCULATORS_LIST, searchCalculators } from '../js/registry.js';
import {
  ResistorColorCodeDef,
  SeriesParallelResistanceDef,
  ElectricalEnergyKwhDef,
  CapacitorCalcDef,
  InductorCalcDef,
  AcImpedanceCalcDef,
  LedResistorDef,
  VoltageDividerDef,
  BatteryRuntimeDef,
  WireVoltageDropDef,
  TorqueCalcDef,
  MechanicalPowerCalcDef,
  GearRatioSpeedDef,
  RpmSpeedCalcDef,
  ForceCalculatorDef,
  WorkEnergyCalcDef,
  SpringForceCalcDef,
  PulleyBeltDef,
  ShaftPowerCalcDef,
  BearingLifeCalcDef,
  BeamDeflectionStressDef,
  StressStrainCalcDef,
  BrickBlockEstimatorDef,
  SteelWeightRebarCalcDef,
  ConcreteSlabCalcDef,
  ColumnLoadCalcDef,
  FootingConcreteCalcDef,
  EarthworkExcavationCalcDef,
  PaintCoverageCalcDef,
  BinaryConverterDef,
  HexConverterDef,
  BinaryHexConverterDef,
  Ipv4SubnetCidrDef,
  BandwidthSpeedCalcDef,
  DataStorageConverterDef,
  IpAddressInfoCalcDef,
  DataTransferTimeDef,
  DilutionDef,
  PhPohDef,
  IdealGasLawEngDef,
  MolecularWeightDef,
  GasFlowPipeCalcDef,
  ReynoldsNumberDef,
  ResistorCalcDef,
  RcFilterTimeDef,
  FrequencyWavelengthCalcDef,
  DecibelCalculatorDef,
  FuelEconomyCalcDef,
  FuelCostTripCalcDef,
  EngineDisplacementDef,
  TireSizeCalcDef,
  CarRpmSpeedCalcDef,
  MachNumberSpeedDef,
  AerodynamicDragLiftDef,
  CarbonFootprintDef,
  OeeCalculatorDef,
  TaktCycleTimeDef
} from '../js/calculators/definitions/engineering_defs.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('====================================================');
console.log('🧪 RUNNING CALQIO ENGINEERING DOMAINS TEST SUITE');
console.log('====================================================');

// 1. Verify Taxonomy Structure for Engineering
console.log('\n--- 1. Testing Engineering Taxonomy Hierarchy ---');
const engCategory = TOP_LEVEL_CATEGORIES.engineering;
assert(!!engCategory, 'Engineering top-level category exists');
assert(engCategory.sections.length === 10, `Engineering has exactly 10 discipline sections (found ${engCategory.sections.length})`);

const expectedDisciplines = [
  '⚡ Electrical Engineering',
  '⚙️ Mechanical Engineering',
  '🏗️ Civil Engineering',
  '💻 Computer Engineering',
  '🧪 Chemical Engineering',
  '📡 Electronics & Communication',
  '🚗 Automobile Engineering',
  '✈️ Aerospace Engineering',
  '🌱 Environmental Engineering',
  '🤖 Industrial & Production'
];

engCategory.sections.forEach((sec, idx) => {
  assert(sec.name === expectedDisciplines[idx], `Discipline ${idx + 1}: ${sec.name} matches expected name`);
  assert(sec.items.length > 0, `Discipline ${sec.name} has at least 1 calculator item`);
});

// 2. Verify Every Item in Engineering Sections has a live Calculator in Registry
console.log('\n--- 2. Testing Calculator Resolution for All Engineering Items ---');
engCategory.sections.forEach(sec => {
  sec.items.forEach(itemId => {
    const calc = CALCULATORS_MAP.get(itemId);
    assert(!!calc, `Item "${itemId}" in section "${sec.name}" resolves to a live calculator`);
  });
});

// 3. Calculation Accuracy Tests
console.log('\n--- 3. Testing Engineering Calculation Functions ---');

// 3.1 Series & Parallel Resistance
const resSeries = SeriesParallelResistanceDef.calculate({ type: 'series', r1: 10, r2: 20, r3: 30 });
assert(resSeries.mainResult.includes('60'), `Series resistance 10+20+30 = 60 Ω (got: ${resSeries.mainResult})`);
const resParallel = SeriesParallelResistanceDef.calculate({ type: 'parallel', r1: 10, r2: 10, r3: 0 });
assert(resParallel.mainResult.includes('5'), `Parallel resistance 10 || 10 = 5 Ω (got: ${resParallel.mainResult})`);

// 3.2 Electrical Energy kWh
const kwhRes = ElectricalEnergyKwhDef.calculate({ power: 1000, hours: 10, tariff: 8 });
assert(kwhRes.mainResult.includes('2,400') || kwhRes.mainResult.includes('2400'), `1000W × 10h/day × 30 days × ₹8/kWh = ₹2,400 (got: ${kwhRes.mainResult})`);

// 3.3 Battery Backup
const battRes = BatteryRuntimeDef.calculate({ ah: 100, v: 12, load: 120, eff: 100 });
assert(battRes.mainResult.includes('10 hrs'), `100Ah × 12V / 120W = 10 hrs (got: ${battRes.mainResult})`);

// 3.4 Wire Voltage Drop
const wireRes = WireVoltageDropDef.calculate({ v: 230, i: 10, len: 100, csa: 2.5 });
assert(wireRes.mainResult.includes('V'), `Wire voltage drop computed (got: ${wireRes.mainResult})`);

// 3.5 Gear Ratio
const gearRes = GearRatioSpeedDef.calculate({ t1: 20, t2: 40, rpm1: 1000, torque1: 50 });
assert(gearRes.mainResult.includes('500 RPM'), `Gear reduction 40/20 at 1000 RPM = 500 RPM (got: ${gearRes.mainResult})`);

// 3.6 Torque & Force
const torqueRes = TorqueCalcDef.calculate({ f: 50, r: 0.5, theta: 90 });
assert(torqueRes.mainResult.includes('25') || torqueRes.mainResult.includes('25.00'), `50N × 0.5m = 25 N·m (got: ${torqueRes.mainResult})`);
const forceRes = ForceCalculatorDef.calculate({ m: 10, a: 9.8 });
assert(forceRes.mainResult.includes('98') || forceRes.mainResult.includes('98.00'), `10kg × 9.8m/s² = 98 N (got: ${forceRes.mainResult})`);

// 3.7 Pulley Belt
const pulleyRes = PulleyBeltDef.calculate({ d1: 100, d2: 200, rpm1: 1500, dist: 600 });
assert(pulleyRes.mainResult.includes('750 RPM'), `Pulley speed 1500 / 2 = 750 RPM (got: ${pulleyRes.mainResult})`);

// 3.8 Beam Deflection
const beamRes = BeamDeflectionStressDef.calculate({ p: 10, l: 4, e: 200, i: 3000 });
assert(beamRes.mainResult.includes('mm'), `Beam deflection computed (got: ${beamRes.mainResult})`);

// 3.9 Brick Estimator
const brickRes = BrickBlockEstimatorDef.calculate({ l: 20, h: 10, thick: '9', waste: 0 });
assert(brickRes.mainResult.includes('1,900 Bricks') || brickRes.mainResult.includes('1900'), `200 sqft × 9.5 bricks/sqft = 1,900 bricks (got: ${brickRes.mainResult})`);

// 3.10 IPv4 CIDR
const subnetRes = Ipv4SubnetCidrDef.calculate({ ip: '192.168.1.50', cidr: 24 });
assert(subnetRes.mainResult.includes('192.168.1.0 / 24'), `Network address 192.168.1.0/24 (got: ${subnetRes.mainResult})`);

// 3.11 Data Transfer
const dtRes = DataTransferTimeDef.calculate({ size: 1, speed: 8, overhead: 0 });
assert(dtRes.mainResult.includes('17m 4s'), `1GB at 8Mbps = 1024 seconds ≈ 17m 4s (got: ${dtRes.mainResult})`);

// 3.12 Dilution
const dilRes = DilutionDef.calculate({ m1: 10, m2: 2, v2: 100 });
assert(dilRes.mainResult.includes('20 mL'), `V1 = 2 × 100 / 10 = 20 mL (got: ${dilRes.mainResult})`);

// 3.13 pH / pOH
const phRes = PhPohDef.calculate({ type: 'ph', val: 3 });
assert(phRes.mainResult.includes('pOH = 11'), `pH 3 gives pOH 11 (got: ${phRes.mainResult})`);

// 3.14 Reynolds Number
const reyRes = ReynoldsNumberDef.calculate({ v: 2, d: 50, visc: 1.0 });
assert(reyRes.mainResult.includes('100,000'), `Re = 2 × 0.05 / 1e-6 = 100,000 (got: ${reyRes.mainResult})`);

// 3.15 LED Resistor
const ledRes = LedResistorDef.calculate({ vs: 12, vf: 2, if: 20 });
assert(ledRes.mainResult.includes('500 Ω'), `(12 - 2) / 0.02A = 500 Ω (got: ${ledRes.mainResult})`);

// 3.16 Voltage Divider
const vdRes = VoltageDividerDef.calculate({ vin: 10, r1: 10, r2: 10 });
assert(vdRes.mainResult.includes('5 Volts') || vdRes.mainResult.includes('5.000 Volts'), `10V with 10k/10k = 5V (got: ${vdRes.mainResult})`);

// 3.17 RC Filter Time
const rcRes = RcFilterTimeDef.calculate({ r: 10, c: 1 });
assert(rcRes.mainResult.includes('10 ms') || rcRes.mainResult.includes('10.000 ms'), `10kΩ × 1μF = 10ms (got: ${rcRes.mainResult})`);

// 3.18 Engine Displacement
const engineRes = EngineDisplacementDef.calculate({ bore: 80, stroke: 80, cyl: 4 });
assert(engineRes.mainResult.includes('1,608.5 cc'), `Engine displacement computed (got: ${engineRes.mainResult})`);

// 3.19 Mach Number
const machRes = MachNumberSpeedDef.calculate({ speed: 1225, alt: 0 });
assert(machRes.mainResult.includes('Mach 1.00'), `1225 km/h at sea level ≈ Mach 1.00 (got: ${machRes.mainResult})`);

// 3.20 Aerodynamic Drag
const dragRes = AerodynamicDragLiftDef.calculate({ v: 100, area: 2, cd: 0.3, rho: 1.225 });
assert(dragRes.mainResult.includes('N Drag Force'), `Drag force computed (got: ${dragRes.mainResult})`);

// 3.21 Carbon Footprint
const co2Res = CarbonFootprintDef.calculate({ kwh: 100, fuel: 50, flights: 0 });
assert(co2Res.mainResult.includes('Tons CO₂'), `Carbon footprint computed (got: ${co2Res.mainResult})`);

// 3.22 OEE
const oeeRes = OeeCalculatorDef.calculate({ avail: 90, perf: 90, qual: 90 });
assert(oeeRes.mainResult.includes('72.9% OEE') || oeeRes.mainResult.includes('72.90% OEE'), `0.9 × 0.9 × 0.9 = 72.9% OEE (got: ${oeeRes.mainResult})`);

// 3.23 Takt Time
const taktRes = TaktCycleTimeDef.calculate({ hours: 8, breaks: 60, demand: 420 });
assert(taktRes.mainResult.includes('60 sec / unit') || taktRes.mainResult.includes('60.0 sec / unit'), `420 min / 420 units = 60 sec/unit (got: ${taktRes.mainResult})`);

// 4. Search Aliases Verification
console.log('\n--- 4. Testing Search Discovery for Engineering ---');
const queries = ['subnet', 'oee', 'ph', 'gear', 'pulley', 'mach', 'drag', 'carbon', 'voltage drop', 'led', 'rc', 'beam'];
queries.forEach(q => {
  const results = searchCalculators(q);
  assert(results.length > 0, `Search query "${q}" returned at least 1 relevant calculator`);
});

console.log('====================================================');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
