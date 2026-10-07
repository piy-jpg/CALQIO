/**
 * CALQIO Central Calculator Registry
 * Uses the declarative CalculatorPage engine for standard calculators and specialized handlers for keypads.
 */

import { CalculatorPage } from './engine/calculatorPage.js';

// Specialized Keypad Calculators
import { BasicCalculator } from './calculators/basic.js';
import { ScientificCalculator } from './calculators/scientific.js';

// Declarative Definitions - Core
import { PercentageDef } from './calculators/definitions/percentage.js';
import { EmiDef, LoanDef } from './calculators/definitions/emi.js';
import { GstDef, DiscountDef, ProfitLossDef } from './calculators/definitions/business_defs.js';
import { BmiDef, AgeDef, CgpaDef } from './calculators/definitions/health_edu_defs.js';

// Declarative Definitions - Complete Math Suite
import {
  LinearEquationDef,
  QuadraticEquationDef,
  CubicEquationDef,
  SystemEquationsDef,
  PolynomialRootsDef,
  SlopeInterceptDef,
  DistanceMidpointDef,
  ArithmeticProgressionDef,
  GeometricProgressionDef,
  MatrixOpsDef,
  VectorCalcDef
} from './calculators/definitions/algebra_defs.js';

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
} from './calculators/definitions/geometry_defs.js';

import {
  SinCosTanDef,
  InverseTrigDef,
  DegRadConverterDef,
  RightTriangleTrigDef,
  LawOfSinesDef,
  LawOfCosinesDef
} from './calculators/definitions/trigonometry_defs.js';

import {
  AverageDef,
  WeightedAverageDef,
  ModuloDef,
  RomanNumeralsDef,
  NumberBaseDef
} from './calculators/definitions/arithmetic_defs.js';

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
} from './calculators/definitions/engineering_defs.js';

// Additional Functional Tools
import { FractionCalculator, RatioCalculator, GcdLcmCalculator } from './calculators/math_tools.js';
import { MarginMarkupCalculator, BreakEvenCalculator } from './calculators/business.js';
import { BmrTdeeCalculator } from './calculators/health_advanced.js';
import { DateDifferenceCalculator } from './calculators/datetime_tools.js';
import { TipCalculator } from './calculators/everyday.js';
import { GpaCalculator } from './calculators/education.js';
import { ConcreteCalculator } from './calculators/construction.js';
import { HorsepowerTorqueCalculator } from './calculators/engineering.js';
import { StatisticsCalculator, PermutationCombinationCalculator } from './calculators/statistics_prob.js';
import { OhmsLawCalculator } from './calculators/electrical.js';
import { KinematicsCalculator, MolarityCalculator } from './calculators/physics_chem.js';
import { GeometryCalculator } from './calculators/geometry.js';
import { ConvertersCalculator } from './calculators/converters.js';
import { TOP_LEVEL_CATEGORIES } from './taxonomy.js';

// Reusable Engine Instantiations - Core
export const PercentageCalculator = CalculatorPage.create(PercentageDef);
export const EmiCalculator = CalculatorPage.create(EmiDef);
export const LoanCalculator = CalculatorPage.create(LoanDef);
export const GstCalculator = CalculatorPage.create(GstDef);
export const DiscountCalculator = CalculatorPage.create(DiscountDef);
export const ProfitLossCalculator = CalculatorPage.create(ProfitLossDef);
export const BmiCalculator = CalculatorPage.create(BmiDef);
export const AgeCalculator = CalculatorPage.create(AgeDef);
export const CgpaCalculator = CalculatorPage.create(CgpaDef);

// Reusable Engine Instantiations - Math: Algebra
export const LinearEquationCalculator = CalculatorPage.create(LinearEquationDef);
export const QuadraticEquationCalculator = CalculatorPage.create(QuadraticEquationDef);
export const CubicEquationCalculator = CalculatorPage.create(CubicEquationDef);
export const SystemEquationsCalculator = CalculatorPage.create(SystemEquationsDef);
export const PolynomialRootsCalculator = CalculatorPage.create(PolynomialRootsDef);
export const SlopeInterceptCalculator = CalculatorPage.create(SlopeInterceptDef);
export const DistanceMidpointCalculator = CalculatorPage.create(DistanceMidpointDef);
export const ArithmeticProgressionCalculator = CalculatorPage.create(ArithmeticProgressionDef);
export const GeometricProgressionCalculator = CalculatorPage.create(GeometricProgressionDef);
export const MatrixOpsCalculator = CalculatorPage.create(MatrixOpsDef);
export const VectorCalcCalculator = CalculatorPage.create(VectorCalcDef);

// Reusable Engine Instantiations - Math: Geometry
export const PythagoreanTheoremCalculator = CalculatorPage.create(PythagoreanTheoremDef);
export const TriangleGeometryCalculator = CalculatorPage.create(TriangleGeometryDef);
export const RectangleSquareCalculator = CalculatorPage.create(RectangleSquareDef);
export const CircleEllipseCalculator = CalculatorPage.create(CircleEllipseDef);
export const TrapezoidRhombusCalculator = CalculatorPage.create(TrapezoidRhombusDef);
export const PolygonsCalculator = CalculatorPage.create(PolygonsDef);
export const CubeCuboidCalculator = CalculatorPage.create(CubeCuboidDef);
export const CylinderVolumeCalculator = CalculatorPage.create(CylinderVolumeDef);
export const ConePyramidCalculator = CalculatorPage.create(ConePyramidDef);
export const SphereHemisphereCalculator = CalculatorPage.create(SphereHemisphereDef);

// Reusable Engine Instantiations - Math: Trigonometry
export const SinCosTanCalculator = CalculatorPage.create(SinCosTanDef);
export const InverseTrigCalculator = CalculatorPage.create(InverseTrigDef);
export const DegRadConverterCalculator = CalculatorPage.create(DegRadConverterDef);
export const RightTriangleTrigCalculator = CalculatorPage.create(RightTriangleTrigDef);
export const LawOfSinesCalculator = CalculatorPage.create(LawOfSinesDef);
export const LawOfCosinesCalculator = CalculatorPage.create(LawOfCosinesDef);

// Reusable Engine Instantiations - Math: Arithmetic & Numbers
export const AverageCalculator = CalculatorPage.create(AverageDef);
export const WeightedAverageCalculator = CalculatorPage.create(WeightedAverageDef);
export const ModuloCalculator = CalculatorPage.create(ModuloDef);
export const RomanNumeralsCalculator = CalculatorPage.create(RomanNumeralsDef);
export const NumberBaseCalculator = CalculatorPage.create(NumberBaseDef);

// Reusable Engine Instantiations - Engineering: Electrical
export const ResistorColorCodeCalculator = CalculatorPage.create(ResistorColorCodeDef);
export const SeriesParallelResistanceCalculator = CalculatorPage.create(SeriesParallelResistanceDef);
export const ElectricalEnergyKwhCalculator = CalculatorPage.create(ElectricalEnergyKwhDef);
export const CapacitorCalcCalculator = CalculatorPage.create(CapacitorCalcDef);
export const InductorCalcCalculator = CalculatorPage.create(InductorCalcDef);
export const AcImpedanceCalcCalculator = CalculatorPage.create(AcImpedanceCalcDef);
export const LedResistorCalculator = CalculatorPage.create(LedResistorDef);
export const VoltageDividerCalculator = CalculatorPage.create(VoltageDividerDef);
export const BatteryRuntimeCalculator = CalculatorPage.create(BatteryRuntimeDef);
export const WireVoltageDropCalculator = CalculatorPage.create(WireVoltageDropDef);

// Reusable Engine Instantiations - Engineering: Mechanical
export const TorqueCalcCalculator = CalculatorPage.create(TorqueCalcDef);
export const MechanicalPowerCalcCalculator = CalculatorPage.create(MechanicalPowerCalcDef);
export const GearRatioSpeedCalculator = CalculatorPage.create(GearRatioSpeedDef);
export const RpmSpeedCalcCalculator = CalculatorPage.create(RpmSpeedCalcDef);
export const ForceCalculator = CalculatorPage.create(ForceCalculatorDef);
export const WorkEnergyCalcCalculator = CalculatorPage.create(WorkEnergyCalcDef);
export const SpringForceCalcCalculator = CalculatorPage.create(SpringForceCalcDef);
export const PulleyBeltCalculator = CalculatorPage.create(PulleyBeltDef);
export const ShaftPowerCalcCalculator = CalculatorPage.create(ShaftPowerCalcDef);
export const BearingLifeCalcCalculator = CalculatorPage.create(BearingLifeCalcDef);

// Reusable Engine Instantiations - Engineering: Civil
export const BeamDeflectionStressCalculator = CalculatorPage.create(BeamDeflectionStressDef);
export const StressStrainCalcCalculator = CalculatorPage.create(StressStrainCalcDef);
export const BrickBlockEstimatorCalculator = CalculatorPage.create(BrickBlockEstimatorDef);
export const SteelWeightRebarCalcCalculator = CalculatorPage.create(SteelWeightRebarCalcDef);
export const ConcreteSlabCalcCalculator = CalculatorPage.create(ConcreteSlabCalcDef);
export const ColumnLoadCalcCalculator = CalculatorPage.create(ColumnLoadCalcDef);
export const FootingConcreteCalcCalculator = CalculatorPage.create(FootingConcreteCalcDef);
export const EarthworkExcavationCalcCalculator = CalculatorPage.create(EarthworkExcavationCalcDef);
export const PaintCoverageCalcCalculator = CalculatorPage.create(PaintCoverageCalcDef);

// Reusable Engine Instantiations - Engineering: Computer
export const BinaryConverterCalculator = CalculatorPage.create(BinaryConverterDef);
export const HexConverterCalculator = CalculatorPage.create(HexConverterDef);
export const BinaryHexConverterCalculator = CalculatorPage.create(BinaryHexConverterDef);
export const Ipv4SubnetCidrCalculator = CalculatorPage.create(Ipv4SubnetCidrDef);
export const BandwidthSpeedCalcCalculator = CalculatorPage.create(BandwidthSpeedCalcDef);
export const DataStorageConverterCalculator = CalculatorPage.create(DataStorageConverterDef);
export const IpAddressInfoCalcCalculator = CalculatorPage.create(IpAddressInfoCalcDef);
export const DataTransferTimeCalculator = CalculatorPage.create(DataTransferTimeDef);

// Reusable Engine Instantiations - Engineering: Chemical
export const IdealGasLawEngCalculator = CalculatorPage.create(IdealGasLawEngDef);
export const MolecularWeightCalculator = CalculatorPage.create(MolecularWeightDef);
export const DilutionCalculator = CalculatorPage.create(DilutionDef);
export const PhPohCalculator = CalculatorPage.create(PhPohDef);
export const GasFlowPipeCalcCalculator = CalculatorPage.create(GasFlowPipeCalcDef);
export const ReynoldsNumberCalculator = CalculatorPage.create(ReynoldsNumberDef);

// Reusable Engine Instantiations - Engineering: Electronics & Comm
export const ResistorCalcCalculator = CalculatorPage.create(ResistorCalcDef);
export const RcFilterTimeCalculator = CalculatorPage.create(RcFilterTimeDef);
export const FrequencyWavelengthCalcCalculator = CalculatorPage.create(FrequencyWavelengthCalcDef);
export const DecibelCalculator = CalculatorPage.create(DecibelCalculatorDef);

// Reusable Engine Instantiations - Engineering: Automobile
export const FuelEconomyCalcCalculator = CalculatorPage.create(FuelEconomyCalcDef);
export const FuelCostTripCalcCalculator = CalculatorPage.create(FuelCostTripCalcDef);
export const EngineDisplacementCalculator = CalculatorPage.create(EngineDisplacementDef);
export const TireSizeCalcCalculator = CalculatorPage.create(TireSizeCalcDef);
export const CarRpmSpeedCalcCalculator = CalculatorPage.create(CarRpmSpeedCalcDef);

// Reusable Engine Instantiations - Engineering: Aerospace, Env, Ind
export const MachNumberSpeedCalculator = CalculatorPage.create(MachNumberSpeedDef);
export const AerodynamicDragLiftCalculator = CalculatorPage.create(AerodynamicDragLiftDef);
export const CarbonFootprintCalculator = CalculatorPage.create(CarbonFootprintDef);
export const OeeCalculator = CalculatorPage.create(OeeCalculatorDef);
export const TaktCycleTimeCalculator = CalculatorPage.create(TaktCycleTimeDef);

// Primary Categories for navigation & UI
export const CATEGORIES = TOP_LEVEL_CATEGORIES;

// Full Registered Calculator Suite
export const CALCULATORS_LIST = [
  // Basic & Scientific Keypads
  BasicCalculator,
  ScientificCalculator,

  // Math - Core & Arithmetic
  PercentageCalculator,
  FractionCalculator,
  RatioCalculator,
  GcdLcmCalculator,
  AverageCalculator,
  WeightedAverageCalculator,
  ModuloCalculator,
  RomanNumeralsCalculator,
  NumberBaseCalculator,

  // Math - Algebra
  LinearEquationCalculator,
  QuadraticEquationCalculator,
  CubicEquationCalculator,
  SystemEquationsCalculator,
  PolynomialRootsCalculator,
  SlopeInterceptCalculator,
  DistanceMidpointCalculator,
  ArithmeticProgressionCalculator,
  GeometricProgressionCalculator,
  MatrixOpsCalculator,
  VectorCalcCalculator,

  // Math - Geometry
  GeometryCalculator,
  PythagoreanTheoremCalculator,
  TriangleGeometryCalculator,
  RectangleSquareCalculator,
  CircleEllipseCalculator,
  TrapezoidRhombusCalculator,
  PolygonsCalculator,
  CubeCuboidCalculator,
  CylinderVolumeCalculator,
  ConePyramidCalculator,
  SphereHemisphereCalculator,

  // Math - Trigonometry
  SinCosTanCalculator,
  InverseTrigCalculator,
  DegRadConverterCalculator,
  RightTriangleTrigCalculator,
  LawOfSinesCalculator,
  LawOfCosinesCalculator,

  // Finance & Business
  EmiCalculator,
  LoanCalculator,
  GstCalculator,
  DiscountCalculator,
  ProfitLossCalculator,
  MarginMarkupCalculator,
  BreakEvenCalculator,

  // Health & Fitness
  BmiCalculator,
  BmrTdeeCalculator,

  // Date & Time
  AgeCalculator,
  DateDifferenceCalculator,

  // Everyday
  TipCalculator,

  // Education
  CgpaCalculator,
  GpaCalculator,

  // Engineering & Construction - Core Legacy
  ConcreteCalculator,
  HorsepowerTorqueCalculator,
  OhmsLawCalculator,

  // Engineering - ⚡ Electrical
  ResistorColorCodeCalculator,
  SeriesParallelResistanceCalculator,
  ElectricalEnergyKwhCalculator,
  CapacitorCalcCalculator,
  InductorCalcCalculator,
  AcImpedanceCalcCalculator,
  LedResistorCalculator,
  VoltageDividerCalculator,
  BatteryRuntimeCalculator,
  WireVoltageDropCalculator,

  // Engineering - ⚙️ Mechanical
  TorqueCalcCalculator,
  MechanicalPowerCalcCalculator,
  GearRatioSpeedCalculator,
  RpmSpeedCalcCalculator,
  ForceCalculator,
  WorkEnergyCalcCalculator,
  SpringForceCalcCalculator,
  PulleyBeltCalculator,
  ShaftPowerCalcCalculator,
  BearingLifeCalcCalculator,

  // Engineering - 🏗️ Civil
  BeamDeflectionStressCalculator,
  StressStrainCalcCalculator,
  BrickBlockEstimatorCalculator,
  SteelWeightRebarCalcCalculator,
  ConcreteSlabCalcCalculator,
  ColumnLoadCalcCalculator,
  FootingConcreteCalcCalculator,
  EarthworkExcavationCalcCalculator,
  PaintCoverageCalcCalculator,

  // Engineering - 💻 Computer
  BinaryConverterCalculator,
  HexConverterCalculator,
  BinaryHexConverterCalculator,
  Ipv4SubnetCidrCalculator,
  BandwidthSpeedCalcCalculator,
  DataStorageConverterCalculator,
  IpAddressInfoCalcCalculator,
  DataTransferTimeCalculator,

  // Engineering - 🧪 Chemical
  IdealGasLawEngCalculator,
  MolecularWeightCalculator,
  DilutionCalculator,
  PhPohCalculator,
  GasFlowPipeCalcCalculator,
  ReynoldsNumberCalculator,

  // Engineering - 📡 Electronics & Comm
  ResistorCalcCalculator,
  RcFilterTimeCalculator,
  FrequencyWavelengthCalcCalculator,
  DecibelCalculator,

  // Engineering - 🚗 Automobile
  FuelEconomyCalcCalculator,
  FuelCostTripCalcCalculator,
  EngineDisplacementCalculator,
  TireSizeCalcCalculator,
  CarRpmSpeedCalcCalculator,

  // Engineering - ✈️ Aerospace / 🌱 Env / 🤖 Ind
  MachNumberSpeedCalculator,
  AerodynamicDragLiftCalculator,
  CarbonFootprintCalculator,
  OeeCalculator,
  TaktCycleTimeCalculator,

  // Statistics & Probability
  StatisticsCalculator,
  PermutationCombinationCalculator,

  // Science
  KinematicsCalculator,
  MolarityCalculator,

  // Converters
  ConvertersCalculator
];

export const CALCULATORS_MAP = new Map(CALCULATORS_LIST.map(c => [c.id, c]));

// Add aliases for subcategory variations to map directly to live calculators
const DIRECT_ALIASES = {
  'arithmetic': 'percentage',
  'percentage_increase': 'percentage',
  'percentage_decrease': 'percentage',
  'percentage_diff': 'percentage',
  'mean_median_mode': 'statistics',
  'fractions': 'fraction',
  'decimals': 'fraction',
  'triangle_sides_angles': 'law_of_cosines',
  'matrix_multiplication': 'matrix_addition',
  'determinant': 'matrix_addition',
  'matrix_inverse': 'matrix_addition',
  // Engineering subcategory mappings
  'wire_size_voltage_drop': 'wire_voltage_drop',
  'battery_runtime_capacity': 'battery_runtime_calc',
  'sand_cement_gravel': 'brick_block_estimator',
  'flooring_tiles_calc': 'brick_block_estimator',
  'roof_area_pitch': 'beam_deflection_stress',
  'machining_cutting_speed': 'gear_ratio_speed',
  'hydraulic_cylinder_force': 'force_calculator',
  'download_upload_time': 'data_transfer_time_calc',
  'bit_byte_converter': 'binary_converter',
  'binary_hex_decimal': 'binary_hex_converter',
  'pipe_flow_rate': 'gas_flow_pipe_calc',
  'ideal_gas_law': 'ideal_gas_law_eng',
  'molar_mass_calculator': 'molar_mass_molecular_weight',
  'fuel_economy_trip_cost': 'fuel_cost_trip_calc',
  'ev_charging_range_calc': 'battery_runtime_calc',
  'brake_stopping_distance': 'car_rpm_speed_calc',
  'thrust_to_weight_ratio': 'aerodynamic_drag_lift',
  'orbital_period_kepler': 'mach_number_speed',
  'escape_velocity_calc': 'mach_number_speed',
  'water_flow_discharge': 'gas_flow_pipe_calc',
  'air_quality_index_aqi': 'carbon_footprint_calc',
  'wastewater_bod_cod': 'dilution_m1v1',
  'production_yield_scrap': 'oee_calculator',
  'economic_order_quantity_eoq': 'takt_cycle_time_calc',
  'machine_hourly_rate': 'oee_calculator',
  'solar_panel_calculator': 'electrical_energy_kwh'
};

for (const [alias, targetId] of Object.entries(DIRECT_ALIASES)) {
  const target = CALCULATORS_MAP.get(targetId);
  if (target && !CALCULATORS_MAP.has(alias)) {
    CALCULATORS_MAP.set(alias, target);
  }
}

// Search Keyword Aliases for instant discovery
const SEARCH_ALIASES = {
  'kg': 'unit_converter',
  'cm': 'unit_converter',
  'm': 'unit_converter',
  'celsius': 'unit_converter',
  'fahrenheit': 'unit_converter',
  'weight': 'unit_converter',
  'length': 'unit_converter',
  'speed': 'unit_converter',
  'temp': 'unit_converter',
  'height': 'bmi',
  'body mass': 'bmi',
  'bmr': 'bmr_tdee',
  'tdee': 'bmr_tdee',
  'loan': 'emi',
  'mortgage': 'emi',
  'tax': 'gst',
  'gst': 'gst',
  'resistor': 'ohms_law',
  'ohm': 'ohms_law',
  'watt': 'ohms_law',
  'power': 'ohms_law',
  'voltage': 'ohms_law',
  'concrete': 'concrete',
  'cement': 'concrete',
  'torque': 'hp_torque',
  'horsepower': 'hp_torque',
  'geometry': 'geometry',
  'shapes': 'geometry',
  'circle': 'circle_ellipse',
  'triangle': 'triangle_geometry',
  'cylinder': 'cylinder_volume',
  'sphere': 'sphere_hemisphere',
  'pythagoras': 'pythagorean_theorem',
  'linear': 'linear_equation',
  'quadratic': 'quadratic_equation',
  'cubic': 'cubic_equation',
  'matrix': 'matrix_addition',
  'vector': 'vector_calc',
  'trig': 'sin_cos_tan',
  'sin': 'sin_cos_tan',
  'cos': 'sin_cos_tan',
  'tan': 'sin_cos_tan',
  'arcsin': 'inverse_trig',
  'radians': 'deg_rad_converter',
  'degrees': 'deg_rad_converter',
  'average': 'average',
  'mean': 'average',
  'modulo': 'modulo',
  'remainder': 'modulo',
  'roman': 'roman_numerals',
  'hex': 'number_base',
  'binary': 'number_base',
  'gpa': 'cgpa',
  'cgpa': 'cgpa',
  'grades': 'cgpa',
  'sale': 'discount',
  'coupon': 'discount',
  'profit': 'profit_loss',
  'loss': 'profit_loss',
  'margin': 'margin_markup',
  'markup': 'margin_markup',
  'breakeven': 'breakeven',
  'birthday': 'age',
  'dob': 'age',
  'date diff': 'date_diff',
  'tip': 'tip_split',
  'bill': 'tip_split',
  'split': 'tip_split',
  'fraction': 'fraction',
  'ratio': 'ratio',
  'gcd': 'gcd_lcm',
  'lcm': 'gcd_lcm',
  'std dev': 'statistics',
  'variance': 'statistics',
  'permutations': 'perm_comb',
  'combinations': 'perm_comb',
  'kinematics': 'kinematics',
  'molarity': 'molarity',
  'subnet': 'ipv4_subnet_cidr',
  'ip': 'ipv4_subnet_cidr',
  'cidr': 'ipv4_subnet_cidr',
  'oee': 'oee_calculator',
  'ph': 'ph_poh_calculator',
  'dilution': 'dilution_m1v1',
  'gear': 'gear_ratio_speed',
  'pulley': 'pulley_belt_calc',
  'mach': 'mach_number_speed',
  'drag': 'aerodynamic_drag_lift',
  'carbon': 'carbon_footprint_calc',
  'displacement': 'engine_displacement',
  'cc': 'engine_displacement',
  'voltage drop': 'wire_size_voltage_drop',
  'led': 'led_resistor_calc',
  'rc': 'rc_filter_time',
  'beam': 'beam_deflection_stress',
  'brick': 'brick_block_estimator'
};

export function getCalculator(id) {
  return CALCULATORS_MAP.get(id);
}

export function getCalculatorsByCategory(catId) {
  const topCat = TOP_LEVEL_CATEGORIES[catId];
  if (topCat) {
    const validDomainIds = [topCat.id, ...(topCat.domainIds || [])];
    return CALCULATORS_LIST.filter(c => 
      validDomainIds.includes(c.category) || 
      validDomainIds.includes(c.category.replace(/-/g, '_')) ||
      (c.parentCategory && validDomainIds.includes(c.parentCategory))
    );
  }
  return CALCULATORS_LIST.filter(c => c.category === catId);
}

export function searchCalculators(query) {
  if (!query || !query.trim()) return CALCULATORS_LIST;
  const q = query.toLowerCase().trim();

  const aliasTarget = SEARCH_ALIASES[q];
  const matchedViaAlias = aliasTarget ? CALCULATORS_MAP.get(aliasTarget) : null;

  const matches = CALCULATORS_LIST.filter(c => 
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.id.toLowerCase().includes(q)
  );

  if (matchedViaAlias && !matches.includes(matchedViaAlias)) {
    return [matchedViaAlias, ...matches];
  }

  return matches;
}
