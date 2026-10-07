/**
 * CALQIO Master 42-Category Taxonomy & Subcategory Architecture
 * Supports 300+ calculators across 42 specialized domains.
 */

export const MASTER_TAXONOMY = {
  basic_scientific: {
    id: 'basic_scientific',
    name: 'Basic & Scientific',
    icon: 'basic',
    color: '#6366f1',
    description: 'Standard keypad arithmetic, scientific calculations, exponents, roots, logs, and modulo math.',
    subcategories: [
      { id: 'standard', name: 'Standard Calculations', items: ['basic', 'scientific', 'advanced_scientific'] },
      { id: 'fractions_percentages', name: 'Fractions & Ratios', items: ['fraction', 'mixed_fraction', 'percentage', 'ratio', 'proportion'] },
      { id: 'powers_roots', name: 'Powers & Roots', items: ['exponent', 'power', 'square_root', 'cube_root'] },
      { id: 'logarithms_factors', name: 'Logs & Factors', items: ['logarithm', 'natural_log', 'factorial', 'modulo', 'gcd_lcm', 'prime_checker', 'random_number'] }
    ]
  },
  math: {
    id: 'math',
    name: 'Math',
    icon: 'math',
    color: '#6366f1',
    description: 'Arithmetic, percentage change & differences, averages, weighted mean, median, mode, and number theory.',
    subcategories: [
      { id: 'arithmetic', name: 'General Arithmetic', items: ['arithmetic', 'percentage', 'percentage_increase', 'percentage_decrease', 'percentage_diff'] },
      { id: 'averages', name: 'Averages & Means', items: ['average', 'weighted_average', 'mean_median_mode'] },
      { id: 'number_theory', name: 'Number Theory', items: ['fractions', 'decimals', 'modulo', 'gcd_lcm', 'roman_numerals', 'number_base'] }
    ]
  },
  algebra: {
    id: 'algebra',
    name: 'Algebra',
    icon: 'math',
    color: '#4f46e5',
    description: 'Linear & quadratic equations, inequalities, sequences, matrices, determinants, and vector math.',
    subcategories: [
      { id: 'equations', name: 'Equations & Roots', items: ['linear_equation', 'quadratic_equation', 'cubic_equation', 'system_equations', 'polynomial_roots'] },
      { id: 'sequences', name: 'Progressions & Sequences', items: ['arithmetic_progression', 'geometric_progression', 'slope_intercept', 'distance_midpoint'] },
      { id: 'matrices', name: 'Matrices & Vectors', items: ['matrix_addition', 'matrix_multiplication', 'determinant', 'matrix_inverse', 'vector_calc'] }
    ]
  },
  geometry: {
    id: 'geometry',
    name: 'Geometry',
    icon: 'geometry',
    color: '#ec4899',
    description: '2D area & perimeter, 3D volume & surface area, Pythagorean theorem, and polygon geometry.',
    subcategories: [
      { id: '2d_shapes', name: '2D Plane Geometry', items: ['geometry', 'triangle_geometry', 'rectangle_square', 'circle_ellipse', 'trapezoid_rhombus', 'polygons'] },
      { id: '3d_solids', name: '3D Solid Geometry', items: ['cube_cuboid', 'cylinder_volume', 'cone_pyramid', 'sphere_hemisphere'] },
      { id: 'coordinate', name: 'Coordinate Geometry', items: ['pythagorean_theorem', 'distance_between_points', 'angle_calculator'] }
    ]
  },
  trigonometry: {
    id: 'trigonometry',
    name: 'Trigonometry',
    icon: 'scientific',
    color: '#8b5cf6',
    description: 'Sin, Cos, Tan, inverse trig functions, Law of Sines/Cosines, and triangle solvers.',
    subcategories: [
      { id: 'functions', name: 'Trig Functions', items: ['sin_cos_tan', 'inverse_trig', 'deg_rad_converter'] },
      { id: 'triangles', name: 'Triangle Solvers', items: ['right_triangle_trig', 'law_of_sines', 'law_of_cosines', 'triangle_sides_angles'] }
    ]
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    icon: 'finance',
    color: '#10b981',
    description: 'Loan EMI, mortgage, interest rates, simple & compound interest, future value, and loan payoff amortization.',
    subcategories: [
      { id: 'loans', name: 'Loans & EMI', items: ['emi', 'loan', 'home_loan', 'personal_loan', 'car_loan', 'mortgage', 'loan_amortization'] },
      { id: 'interest', name: 'Interest & Valuation', items: ['simple_interest', 'compound_interest', 'future_value', 'present_value', 'npv_irr'] }
    ]
  },
  investment: {
    id: 'investment',
    name: 'Investment',
    icon: 'trendingUp',
    color: '#10b981',
    description: 'SIP, lumpsum wealth, mutual funds, CAGR, XIRR, stocks, dividend yields, PPF, FD/RD, and retirement planning.',
    subcategories: [
      { id: 'sip_growth', name: 'Mutual Funds & SIP', items: ['investment', 'lumpsum_calc', 'mutual_fund', 'cagr_calculator', 'xirr_calc'] },
      { id: 'stocks_bonds', name: 'Stocks & Bonds', items: ['stock_return', 'dividend_yield', 'bond_yield_price'] },
      { id: 'fixed_income_retirement', name: 'Retirement & Savings', items: ['retirement_corpus', 'fd_rd_calc', 'ppf_epf_nps', 'inflation_calc'] }
    ]
  },
  tax_salary: {
    id: 'tax_salary',
    name: 'Tax & Salary',
    icon: 'tax',
    color: '#10b981',
    description: 'GST inclusive/exclusive, income tax regimes, in-hand take home salary, CTC breakdown, HRA, and TDS.',
    subcategories: [
      { id: 'gst_taxes', name: 'GST & Consumption Tax', items: ['gst', 'gst_inclusive', 'gst_exclusive', 'gst_reverse'] },
      { id: 'payroll_salary', name: 'Salary & Deductions', items: ['income_tax_regimes', 'in_hand_salary', 'ctc_breakdown', 'hra_tds_calc', 'gratuity_bonus'] }
    ]
  },
  business: {
    id: 'business',
    name: 'Business',
    icon: 'business',
    color: '#10b981',
    description: 'Gross & net profit margins, retail markup, break-even analysis, ROI, unit economics, CAC, and LTV.',
    subcategories: [
      { id: 'profitability', name: 'Margins & Markups', items: ['profit_loss', 'margin_markup', 'discount', 'breakeven'] },
      { id: 'metrics', name: 'Business Metrics & Unit Economics', items: ['roi_calculator', 'cac_ltv_calc', 'revenue_growth', 'pricing_commission'] }
    ]
  },
  health_fitness: {
    id: 'health_fitness',
    name: 'Health & Fitness',
    icon: 'health',
    color: '#ec4899',
    description: 'BMI, BMR, TDEE, daily calorie deficit/surplus, body fat %, ideal weight, macro nutrients, and target heart rate.',
    subcategories: [
      { id: 'body_composition', name: 'Body Composition', items: ['bmi', 'bmr_tdee', 'body_fat_percentage', 'ideal_weight'] },
      { id: 'nutrition_calories', name: 'Nutrition & Macros', items: ['calorie_deficit_target', 'macro_protein_carb', 'water_intake'] },
      { id: 'cardio_sports', name: 'Cardio & Wellness', items: ['target_heart_rate', 'running_pace', 'pregnancy_due_date'] }
    ]
  },
  date_time: {
    id: 'date_time',
    name: 'Date & Time',
    icon: 'calendar',
    color: '#f59e0b',
    description: 'Chronological age, duration between dates, working days, time addition/subtraction, timezones, and timestamps.',
    subcategories: [
      { id: 'age_calendar', name: 'Age & Calendar Intervals', items: ['age', 'date_diff', 'business_working_days', 'days_until_countdown'] },
      { id: 'time_clocks', name: 'Time Math & Clocks', items: ['time_duration_calc', 'timezone_converter', 'unix_timestamp_converter'] }
    ]
  },
  everyday: {
    id: 'everyday',
    name: 'Everyday Life',
    icon: 'everyday',
    color: '#8b5cf6',
    description: 'Tip & bill splitting, sales tax, fuel & travel costs, electricity & utility bills, and household budgets.',
    subcategories: [
      { id: 'dining_shopping', name: 'Dining & Shopping', items: ['tip_split', 'grocery_shopping_cost', 'sales_tax_calc'] },
      { id: 'utilities_fuel', name: 'Utilities & Fuel', items: ['fuel_mileage_cost', 'electricity_appliance_bill', 'monthly_budget_planner'] }
    ]
  },
  education: {
    id: 'education',
    name: 'Education',
    icon: 'education',
    color: '#3b82f6',
    description: 'GPA, CGPA, semester grade points, exam score curve, marks percentage, and study schedule planners.',
    subcategories: [
      { id: 'grades', name: 'GPA & Grades', items: ['cgpa', 'gpa', 'weighted_grade_calculator', 'exam_score_curve'] },
      { id: 'attendance_study', name: 'Academic Planning', items: ['attendance_percentage_calc', 'credits_converter'] }
    ]
  },
  statistics: {
    id: 'statistics',
    name: 'Statistics',
    icon: 'statistics',
    color: '#06b6d4',
    description: 'Mean, median, mode, sample & population standard deviation, variance, z-score, IQR, and linear regression.',
    subcategories: [
      { id: 'descriptive', name: 'Descriptive Statistics', items: ['statistics', 'variance_std_dev', 'quartiles_iqr', 'z_score_normal'] },
      { id: 'inferential', name: 'Correlation & Regression', items: ['linear_regression', 'correlation_covariance', 'confidence_interval'] }
    ]
  },
  probability: {
    id: 'probability',
    name: 'Probability',
    icon: 'probability',
    color: '#8b5cf6',
    description: 'Permutations (nPr), Combinations (nCr), binomial probability, Bayes theorem, and odds distributions.',
    subcategories: [
      { id: 'combinatorics', name: 'Combinatorics', items: ['perm_comb', 'permutations_npr', 'combinations_ncr'] },
      { id: 'distributions', name: 'Probability Models', items: ['binomial_probability', 'poisson_distribution', 'bayes_theorem_calc'] }
    ]
  },
  data_computer: {
    id: 'data_computer',
    name: 'Data & Computer',
    icon: 'recent',
    color: '#06b6d4',
    description: 'Binary, hex, decimal base conversions, bandwidth download/upload time, and storage sizing.',
    subcategories: [
      { id: 'bases', name: 'Number Base Conversion', items: ['binary_hex_decimal', 'bit_byte_converter'] },
      { id: 'bandwidth', name: 'Bandwidth & Storage', items: ['download_upload_time', 'aspect_ratio_resolution', 'file_size_storage'] }
    ]
  },
  converters: {
    id: 'converters',
    name: 'Unit Converters',
    icon: 'converters',
    color: '#06b6d4',
    description: 'Precision conversions for Length, Weight, Temp, Volume, Speed, Pressure, Data, and Area.',
    subcategories: [
      { id: 'common', name: 'Common Measurements', items: ['unit_converter', 'length_distance_converter', 'weight_mass_converter', 'temperature_converter'] },
      { id: 'engineering_units', name: 'Engineering & Fluid Units', items: ['volume_capacity_converter', 'pressure_bar_psi_converter', 'speed_velocity_converter'] }
    ]
  },
  currency: {
    id: 'currency',
    name: 'Currency',
    icon: 'finance',
    color: '#10b981',
    description: 'Currency conversions, exchange rates, cross-currency pairs, and percentage fluctuations.',
    subcategories: [
      { id: 'fx', name: 'Foreign Exchange', items: ['currency_converter', 'exchange_rate_calc', 'multi_currency_calc'] }
    ]
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    icon: 'physics',
    color: '#06b6d4',
    description: 'Kinematics, velocity, force, mass, momentum, work, kinetic & potential energy, projectile motion, and optics.',
    subcategories: [
      { id: 'mechanics', name: 'Classical Mechanics', items: ['kinematics', 'force_mass_acceleration', 'work_power_energy', 'projectile_motion'] },
      { id: 'waves_thermo', name: 'Waves & Thermodynamics', items: ['wavelength_frequency', 'specific_heat_thermal'] }
    ]
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'chemistry',
    color: '#10b981',
    description: 'Molar mass, molarity, solution dilution, pH/pOH, ideal gas laws (PV=nRT), and stoichiometry.',
    subcategories: [
      { id: 'solutions', name: 'Solutions & Concentrations', items: ['molarity', 'dilution_m1v1', 'ph_poh_calculator'] },
      { id: 'gas_stoichiometry', name: 'Gas Laws & Stoichiometry', items: ['ideal_gas_law', 'molar_mass_calculator', 'percent_composition'] }
    ]
  },
  electrical: {
    id: 'electrical',
    name: 'Electrical',
    icon: 'electrical',
    color: '#eab308',
    description: "Ohm's Law (V, I, R, P), series/parallel resistance, voltage drop, kWh electricity cost, and battery run time.",
    subcategories: [
      { id: 'ohms_power', name: "Ohm's Law & Power", items: ['ohms_law', 'series_parallel_resistance', 'electrical_energy_kwh'] },
      { id: 'power_distribution', name: 'Cables & Battery', items: ['wire_size_voltage_drop', 'battery_runtime_capacity', 'solar_panel_calculator'] }
    ]
  },
  electronics: {
    id: 'electronics',
    name: 'Electronics',
    icon: 'electrical',
    color: '#eab308',
    description: 'Resistor color band codes, LED series resistor, voltage divider, 555 timer, and RC circuit time constants.',
    subcategories: [
      { id: 'passive_components', name: 'Components & Codes', items: ['resistor_color_code', 'led_resistor_calc', 'voltage_divider_calc', 'rc_filter_time'] }
    ]
  },
  engineering: {
    id: 'engineering',
    name: 'Engineering',
    icon: 'engineering',
    color: '#6366f1',
    description: 'Mechanical horsepower & torque, beam stress & deflection, fluid pipe flow, and thermal expansion.',
    subcategories: [
      { id: 'mechanical_eng', name: 'Mechanics & Stress', items: ['hp_torque', 'beam_deflection_stress', 'youngs_modulus_elasticity'] },
      { id: 'fluid_thermal', name: 'Fluid & Thermal', items: ['pipe_flow_rate', 'thermal_expansion_calc'] }
    ]
  },
  construction: {
    id: 'construction',
    name: 'Construction',
    icon: 'construction',
    color: '#f97316',
    description: 'Concrete slab volume, cement/sand/gravel bags, brick/block estimator, flooring tiles, and paint coverage.',
    subcategories: [
      { id: 'masonry_concrete', name: 'Concrete & Masonry', items: ['concrete', 'brick_block_estimator', 'sand_cement_gravel'] },
      { id: 'interior_finish', name: 'Flooring & Paint', items: ['flooring_tiles_calc', 'paint_coverage_calc', 'roof_area_pitch'] }
    ]
  },
  mechanical: {
    id: 'mechanical',
    name: 'Mechanical',
    icon: 'engineering',
    color: '#6366f1',
    description: 'Gear ratios & speeds, mechanical advantage, pulleys, belt lengths, cutting speeds, and machining RPM.',
    subcategories: [
      { id: 'gears_machining', name: 'Gears & Machining', items: ['gear_ratio_speed', 'pulley_belt_calc', 'machining_cutting_speed'] }
    ]
  },
  automotive: {
    id: 'automotive',
    name: 'Automotive',
    icon: 'engineering',
    color: '#ef4444',
    description: 'Fuel economy, trip fuel cost, EV charging time & range, engine displacement, tire size, and car loan EMI.',
    subcategories: [
      { id: 'fuel_ev', name: 'Fuel & EV Charging', items: ['fuel_economy_trip_cost', 'ev_charging_range_calc'] },
      { id: 'engine_tires', name: 'Engine & Tires', items: ['engine_displacement', 'tire_size_calculator'] }
    ]
  },
  sports: {
    id: 'sports',
    name: 'Sports & Athletics',
    icon: 'health',
    color: '#ec4899',
    description: 'Running pace & race time predictor, cycling speed, swimming splits, cricket run rates, and calories burned.',
    subcategories: [
      { id: 'running_cycling', name: 'Endurance & Pace', items: ['running_pace_predictor', 'cycling_speed_pace', 'calories_burned_sports'] },
      { id: 'cricket_field', name: 'Cricket & Scoring', items: ['cricket_run_rate_calc', 'batting_bowling_average'] }
    ]
  },
  cooking_food: {
    id: 'cooking_food',
    name: 'Cooking & Food',
    icon: 'everyday',
    color: '#f59e0b',
    description: 'Recipe scaling & serving adjustments, kitchen unit conversions (cups to grams), baking temperatures, and recipe cost.',
    subcategories: [
      { id: 'recipe_scaling', name: 'Kitchen & Scaling', items: ['recipe_servings_scaler', 'cups_to_grams_converter', 'recipe_food_cost'] }
    ]
  },
  home_household: {
    id: 'home_household',
    name: 'Home & Household',
    icon: 'home',
    color: '#8b5cf6',
    description: 'Paint and flooring coverage, room area & volume, appliance electricity cost, and home renovation estimators.',
    subcategories: [
      { id: 'home_improvement', name: 'Home Renovation', items: ['room_area_volume', 'appliance_electricity_cost', 'home_renovation_budget'] }
    ]
  },
  travel: {
    id: 'travel',
    name: 'Travel & Trips',
    icon: 'calendar',
    color: '#06b6d4',
    description: 'Trip fuel cost & distance, flight time, timezone difference & jet lag, and travel budget planner.',
    subcategories: [
      { id: 'road_flight', name: 'Trip & Flight Planning', items: ['road_trip_fuel_budget', 'flight_duration_jetlag', 'travel_budget_planner'] }
    ]
  },
  weather_environment: {
    id: 'weather_environment',
    name: 'Weather & Environment',
    icon: 'recent',
    color: '#06b6d4',
    description: 'Wind chill, heat index, dew point, humidity, rainfall conversion, and carbon footprint CO2 estimator.',
    subcategories: [
      { id: 'meteorology', name: 'Weather Indexes', items: ['wind_chill_heat_index', 'dew_point_humidity', 'carbon_footprint_calc'] }
    ]
  },
  astronomy: {
    id: 'astronomy',
    name: 'Astronomy',
    icon: 'physics',
    color: '#8b5cf6',
    description: 'Light years, astronomical units (AU), orbital periods, escape velocity, and cosmic distance scales.',
    subcategories: [
      { id: 'celestial_physics', name: 'Space & Orbits', items: ['light_years_au_converter', 'orbital_period_kepler', 'escape_velocity_calc'] }
    ]
  },
  agriculture: {
    id: 'agriculture',
    name: 'Agriculture',
    icon: 'everyday',
    color: '#10b981',
    description: 'Land area, crop yield per acre/hectare, fertilizer requirement (NPK), seed rate, and farm profit estimates.',
    subcategories: [
      { id: 'farming_crops', name: 'Farming & Fertilizer', items: ['crop_yield_estimator', 'npk_fertilizer_calc', 'land_area_seed_rate'] }
    ]
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: 'engineering',
    color: '#f97316',
    description: 'Overall Equipment Effectiveness (OEE), cycle time, takt time, scrap rate, and machine production yield.',
    subcategories: [
      { id: 'production_metrics', name: 'Plant Efficiency & OEE', items: ['oee_calculator', 'takt_cycle_time_calc', 'production_yield_scrap'] }
    ]
  },
  logistics: {
    id: 'logistics',
    name: 'Logistics & Shipping',
    icon: 'converters',
    color: '#3b82f6',
    description: 'Volumetric chargeable weight, package volume, freight shipping cost, and pallet load capacity.',
    subcategories: [
      { id: 'freight_packaging', name: 'Freight & Packaging', items: ['volumetric_chargeable_weight', 'freight_shipping_cost', 'pallet_load_capacity'] }
    ]
  },
  real_estate: {
    id: 'real_estate',
    name: 'Real Estate',
    icon: 'finance',
    color: '#10b981',
    description: 'Rental yield, property appreciation, stamp duty & registration, mortgage down payment, and price per sq ft.',
    subcategories: [
      { id: 'property_investment', name: 'Property & Mortgages', items: ['rental_yield_calculator', 'stamp_duty_registration', 'price_per_sqft_calc'] }
    ]
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce',
    icon: 'business',
    color: '#10b981',
    description: 'Product pricing, marketplace commission & fees, return cost, ROAS, and net profitability.',
    subcategories: [
      { id: 'seller_metrics', name: 'Pricing & Marketplace Fees', items: ['ecommerce_product_pricing', 'marketplace_fees_margin', 'roas_conversion_rate'] }
    ]
  },
  digital_marketing: {
    id: 'digital_marketing',
    name: 'Digital Marketing',
    icon: 'business',
    color: '#8b5cf6',
    description: 'Click-Through Rate (CTR), Cost Per Click (CPC), CPM, CPA, ROAS, and Marketing ROI.',
    subcategories: [
      { id: 'ad_metrics', name: 'Paid Advertising Metrics', items: ['ctr_cpc_cpm_calc', 'roas_marketing_roi', 'conversion_rate_calc'] }
    ]
  },
  computer_science: {
    id: 'computer_science',
    name: 'Computer Science',
    icon: 'recent',
    color: '#06b6d4',
    description: 'IP subnetting (IPv4 / IPv6 / CIDR), usable IP range, ASCII/Hex encoding, and data transfer times.',
    subcategories: [
      { id: 'networking', name: 'Networking & Subnetting', items: ['ipv4_subnet_cidr', 'data_transfer_time_calc', 'ascii_unicode_hex'] }
    ]
  },
  science: {
    id: 'science',
    name: 'Science',
    icon: 'scientific',
    color: '#06b6d4',
    description: 'Scientific notation, significant figures, percentage error, physical density, and fundamental constants.',
    subcategories: [
      { id: 'laboratory', name: 'Laboratory & Error Analysis', items: ['sig_figs_scientific_notation', 'percentage_error_calc', 'density_mass_volume'] }
    ]
  },
  pet_animal: {
    id: 'pet_animal',
    name: 'Pet & Animal',
    parentCategory: 'more',
    icon: 'pet',
    color: '#ec4899',
    description: 'Pet age converter (Dog & Cat human years equivalent), daily pet calorie needs, and food portions.',
    subcategories: [
      { id: 'pet_health', name: 'Pet Care & Age', items: ['dog_cat_age_converter', 'pet_daily_calorie_food'] }
    ]
  },
  miscellaneous: {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    parentCategory: 'more',
    icon: 'misc',
    color: '#8b5cf6',
    description: 'Random number generation, dice roller, password strength & combinations, aspect ratios, and color code converter.',
    subcategories: [
      { id: 'random_utility', name: 'General Utilities', items: ['random_number_dice', 'aspect_ratio_screen', 'hex_rgb_color_converter'] }
    ]
  }
};

export const ALL_CATEGORY_KEYS = Object.keys(MASTER_TAXONOMY);

/**
 * 14 User-Facing Top-Level Categories + More
 * Reorganizes the 42 domains into a clean, intuitive navigation hierarchy.
 */
export const TOP_LEVEL_CATEGORIES = {
  basic: {
    id: 'basic',
    slug: 'basic',
    name: 'Basic',
    icon: 'basic',
    color: '#6366f1',
    description: 'Standard keypad arithmetic, scientific calculations, fractions, percentages, powers, and roots.',
    domainIds: ['basic_scientific'],
    sidebarPreview: ['basic', 'scientific', 'percentage'],
    sections: [
      { id: 'standard', name: 'Standard Calculations', items: ['basic', 'scientific', 'advanced_scientific'] },
      { id: 'fractions_percentages', name: 'Fractions & Percentages', items: ['fraction', 'mixed_fraction', 'percentage', 'ratio', 'proportion', 'average'] },
      { id: 'powers_roots', name: 'Powers & Roots', items: ['exponent', 'power', 'square_root', 'cube_root'] },
      { id: 'logs_factors', name: 'Logs & Factors', items: ['logarithm', 'natural_log', 'factorial', 'modulo', 'gcd_lcm', 'prime_checker', 'random_number'] }
    ]
  },
  math: {
    id: 'math',
    slug: 'math',
    name: 'Math',
    icon: 'math',
    color: '#6366f1',
    description: 'Algebra, geometry, trigonometry, percentages, proportions, and advanced mathematical solvers.',
    domainIds: ['math', 'algebra', 'geometry', 'trigonometry'],
    sidebarPreview: ['percentage', 'fraction', 'geometry'],
    sections: [
      { id: 'popular', name: 'Popular', items: ['percentage', 'fraction', 'ratio', 'average'] },
      { id: 'algebra', name: 'Algebra', items: ['linear_equation', 'quadratic_equation', 'cubic_equation', 'system_equations', 'polynomial_roots'] },
      { id: 'geometry', name: 'Geometry', items: ['geometry', 'triangle_geometry', 'rectangle_square', 'circle_ellipse', 'trapezoid_rhombus', 'polygons', 'cube_cuboid', 'cylinder_volume', 'cone_pyramid', 'sphere_hemisphere', 'pythagorean_theorem'] },
      { id: 'trigonometry', name: 'Trigonometry', items: ['sin_cos_tan', 'inverse_trig', 'deg_rad_converter', 'right_triangle_trig', 'law_of_sines', 'law_of_cosines', 'triangle_sides_angles'] },
      { id: 'numbers_arithmetic', name: 'Numbers & Arithmetic', items: ['arithmetic', 'percentage_increase', 'percentage_decrease', 'percentage_diff', 'weighted_average', 'mean_median_mode', 'fractions', 'decimals', 'modulo', 'gcd_lcm', 'roman_numerals', 'number_base'] },
      { id: 'advanced_math', name: 'Advanced Math', items: ['matrix_addition', 'matrix_multiplication', 'determinant', 'matrix_inverse', 'vector_calc', 'arithmetic_progression', 'geometric_progression', 'slope_intercept', 'distance_midpoint'] }
    ]
  },
  finance: {
    id: 'finance',
    slug: 'finance',
    name: 'Finance',
    icon: 'finance',
    color: '#10b981',
    description: 'Loans, mortgages, EMI installments, wealth SIP, investments, taxes, salary, and real estate.',
    domainIds: ['finance', 'investment', 'tax_salary', 'real_estate'],
    sidebarPreview: ['emi', 'loan', 'gst'],
    sections: [
      { id: 'loans', name: 'Loans & EMI', items: ['emi', 'loan', 'home_loan', 'personal_loan', 'car_loan', 'mortgage', 'loan_amortization'] },
      { id: 'investment', name: 'Investment & SIP', items: ['investment', 'lumpsum_calc', 'mutual_fund', 'cagr_calculator', 'xirr_calc', 'stock_return', 'dividend_yield', 'bond_yield_price'] },
      { id: 'tax_salary', name: 'Tax & Salary', items: ['gst', 'gst_inclusive', 'gst_exclusive', 'gst_reverse', 'income_tax_regimes', 'in_hand_salary', 'ctc_breakdown', 'hra_tds_calc', 'gratuity_bonus'] },
      { id: 'real_estate', name: 'Real Estate', items: ['rental_yield_calculator', 'stamp_duty_registration', 'price_per_sqft_calc'] },
      { id: 'savings_interest', name: 'Savings & Interest', items: ['simple_interest', 'compound_interest', 'future_value', 'present_value', 'npv_irr', 'retirement_corpus', 'fd_rd_calc', 'ppf_epf_nps', 'inflation_calc'] }
    ]
  },
  business: {
    id: 'business',
    slug: 'business',
    name: 'Business',
    icon: 'business',
    color: '#10b981',
    description: 'Profit & loss, retail margins, discounts, break-even analysis, e-commerce pricing, and marketing.',
    domainIds: ['business', 'ecommerce', 'digital_marketing'],
    sidebarPreview: ['discount', 'profit_loss', 'margin_markup'],
    sections: [
      { id: 'profitability', name: 'Business & Profitability', items: ['profit_loss', 'margin_markup', 'discount', 'breakeven', 'roi_calculator', 'cac_ltv_calc', 'revenue_growth', 'pricing_commission'] },
      { id: 'ecommerce', name: 'E-Commerce', items: ['ecommerce_product_pricing', 'marketplace_fees_margin', 'roas_conversion_rate'] },
      { id: 'marketing', name: 'Digital Marketing', items: ['ctr_cpc_cpm_calc', 'roas_marketing_roi', 'conversion_rate_calc'] }
    ]
  },
  health: {
    id: 'health',
    slug: 'health',
    name: 'Health',
    icon: 'health',
    color: '#ec4899',
    description: 'Body composition, BMI, BMR, TDEE, calorie deficit/surplus, nutrition macros, and cardio wellness.',
    domainIds: ['health_fitness'],
    sidebarPreview: ['bmi', 'bmr_tdee'],
    sections: [
      { id: 'body', name: 'Body Composition', items: ['bmi', 'body_fat_percentage', 'ideal_weight'] },
      { id: 'nutrition', name: 'Nutrition & Calories', items: ['bmr_tdee', 'calorie_deficit_target', 'macro_protein_carb', 'water_intake'] },
      { id: 'fitness', name: 'Fitness & Wellness', items: ['target_heart_rate', 'running_pace', 'pregnancy_due_date'] }
    ]
  },
  education: {
    id: 'education',
    slug: 'education',
    name: 'Education',
    icon: 'education',
    color: '#3b82f6',
    description: 'CGPA, GPA, grade curves, percentage conversion, and academic schedule planning.',
    domainIds: ['education'],
    sidebarPreview: ['cgpa', 'gpa'],
    sections: [
      { id: 'gpa', name: 'GPA & CGPA', items: ['cgpa', 'gpa'] },
      { id: 'grades', name: 'Grades & Marks', items: ['weighted_grade_calculator', 'exam_score_curve'] },
      { id: 'study', name: 'Attendance & Study Planning', items: ['attendance_percentage_calc', 'credits_converter'] }
    ]
  },
  data_statistics: {
    id: 'data_statistics',
    slug: 'data-statistics',
    name: 'Data & Statistics',
    icon: 'statistics',
    color: '#06b6d4',
    description: 'Standard deviation, variance, combinations (nCr/nPr), probability models, binary/hex, and networking.',
    domainIds: ['statistics', 'probability', 'data_computer', 'computer_science'],
    sidebarPreview: ['statistics', 'perm_comb'],
    sections: [
      { id: 'statistics', name: 'Statistics', items: ['statistics', 'variance_std_dev', 'quartiles_iqr', 'z_score_normal', 'linear_regression', 'correlation_covariance', 'confidence_interval'] },
      { id: 'probability', name: 'Probability', items: ['perm_comb', 'permutations_npr', 'combinations_ncr', 'binomial_probability', 'poisson_distribution', 'bayes_theorem_calc'] },
      { id: 'data', name: 'Data & Bases', items: ['binary_hex_decimal', 'bit_byte_converter', 'download_upload_time', 'aspect_ratio_resolution', 'file_size_storage'] },
      { id: 'computer', name: 'Computer Science', items: ['ipv4_subnet_cidr', 'data_transfer_time_calc', 'ascii_unicode_hex'] }
    ]
  },
  converters: {
    id: 'converters',
    slug: 'converters',
    name: 'Converters',
    icon: 'converters',
    color: '#06b6d4',
    description: 'Precision unit converters for length, weight, temperature, volume, speed, pressure, and currency.',
    domainIds: ['converters', 'currency'],
    sidebarPreview: ['unit_converter'],
    sections: [
      { id: 'units', name: 'Unit Converters', items: ['unit_converter', 'length_distance_converter', 'weight_mass_converter', 'temperature_converter', 'volume_capacity_converter', 'pressure_bar_psi_converter', 'speed_velocity_converter'] },
      { id: 'currency', name: 'Currency Exchange', items: ['currency_converter', 'exchange_rate_calc', 'multi_currency_calc'] }
    ]
  },
  engineering: {
    id: 'engineering',
    slug: 'engineering',
    name: 'Engineering',
    icon: 'engineering',
    color: '#6366f1',
    description: 'Electrical circuits, mechanical machines, civil structures, computer systems, chemical processes, electronics, and automotive engineering.',
    domainIds: ['engineering', 'electrical', 'electronics', 'mechanical', 'construction', 'manufacturing', 'automotive', 'chemistry', 'physics'],
    sidebarPreview: ['scientific', 'ohms_law', 'torque_calc', 'beam_deflection_stress', 'ipv4_subnet_cidr'],
    sections: [
      { id: 'electrical_eng', name: '⚡ Electrical Engineering', items: ['ohms_law', 'resistor_color_code', 'series_parallel_resistance', 'voltage_divider_calc', 'electrical_energy_kwh', 'capacitor_calc', 'inductor_calc', 'ac_impedance_calc', 'led_resistor_calc'] },
      { id: 'mechanical_eng', name: '⚙️ Mechanical Engineering', items: ['torque_calc', 'mechanical_power_calc', 'gear_ratio_speed', 'rpm_speed_calc', 'force_calculator', 'work_energy_calc', 'spring_force_calc', 'pulley_belt_calc', 'shaft_power_calc', 'bearing_life_calc'] },
      { id: 'civil_eng', name: '🏗️ Civil Engineering', items: ['beam_deflection_stress', 'stress_strain_calc', 'concrete', 'brick_block_estimator', 'steel_weight_rebar_calc', 'concrete_slab_calc', 'column_load_calc', 'footing_concrete_calc', 'earthwork_excavation_calc', 'paint_coverage_calc'] },
      { id: 'computer_eng', name: '💻 Computer Engineering', items: ['binary_converter', 'hex_converter', 'binary_hex_converter', 'ipv4_subnet_cidr', 'bandwidth_speed_calc', 'data_storage_converter', 'ip_address_info_calc', 'data_transfer_time_calc'] },
      { id: 'chemical_eng', name: '🧪 Chemical Engineering', items: ['molarity', 'ph_poh_calculator', 'ideal_gas_law_eng', 'molar_mass_molecular_weight', 'dilution_m1v1', 'gas_flow_pipe_calc'] },
      { id: 'electronics_comm', name: '📡 Electronics & Communication', items: ['resistor_calc', 'capacitor_calc', 'rc_filter_time', 'frequency_wavelength_calc', 'decibel_power_ratio', 'ohms_law', 'led_resistor_calc'] },
      { id: 'automobile_eng', name: '🚗 Automobile Engineering', items: ['fuel_economy_calc', 'fuel_cost_trip_calc', 'engine_displacement', 'hp_torque', 'tire_size_calculator', 'car_rpm_speed_calc'] },
      { id: 'aerospace_eng', name: '✈️ Aerospace Engineering', items: ['mach_number_speed', 'aerodynamic_drag_lift'] },
      { id: 'environmental_eng', name: '🌱 Environmental Engineering', items: ['carbon_footprint_calc'] },
      { id: 'industrial_eng', name: '🤖 Industrial & Production', items: ['oee_calculator', 'takt_cycle_time_calc'] }
    ]
  },
  science: {
    id: 'science',
    slug: 'science',
    name: 'Science',
    icon: 'physics',
    color: '#06b6d4',
    description: 'Kinematics motion, solution molarity, gas laws (PV=nRT), astronomical orbits, and laboratory error analysis.',
    domainIds: ['physics', 'chemistry', 'astronomy', 'science'],
    sidebarPreview: ['kinematics', 'molarity'],
    sections: [
      { id: 'physics', name: 'Physics', items: ['kinematics', 'force_mass_acceleration', 'work_power_energy', 'projectile_motion', 'wavelength_frequency', 'specific_heat_thermal'] },
      { id: 'chemistry', name: 'Chemistry', items: ['molarity', 'dilution_m1v1', 'ph_poh_calculator', 'ideal_gas_law', 'molar_mass_calculator', 'percent_composition'] },
      { id: 'astronomy', name: 'Astronomy', items: ['light_years_au_converter', 'orbital_period_kepler', 'escape_velocity_calc'] },
      { id: 'general_science', name: 'General Science', items: ['sig_figs_scientific_notation', 'percentage_error_calc', 'density_mass_volume'] }
    ]
  },
  transport_travel: {
    id: 'transport_travel',
    slug: 'transport-travel',
    name: 'Transport & Travel',
    icon: 'car',
    color: '#ef4444',
    description: 'Trip fuel economy, EV charging range, road trip budget, flight duration, and freight shipping.',
    domainIds: ['automotive', 'travel', 'logistics'],
    sidebarPreview: ['fuel_economy_trip_cost', 'road_trip_fuel_budget'],
    sections: [
      { id: 'automotive', name: 'Automotive & Fuel', items: ['fuel_economy_trip_cost', 'ev_charging_range_calc', 'engine_displacement', 'tire_size_calculator'] },
      { id: 'travel', name: 'Travel & Trips', items: ['road_trip_fuel_budget', 'flight_duration_jetlag', 'travel_budget_planner'] },
      { id: 'logistics', name: 'Logistics & Shipping', items: ['volumetric_chargeable_weight', 'freight_shipping_cost', 'pallet_load_capacity'] }
    ]
  },
  home_lifestyle: {
    id: 'home_lifestyle',
    slug: 'home-lifestyle',
    name: 'Home & Lifestyle',
    icon: 'everyday',
    color: '#8b5cf6',
    description: 'Tip splitting, household budget, recipe scaling, kitchen measurements, and home renovation estimators.',
    domainIds: ['everyday', 'cooking_food', 'home_household'],
    sidebarPreview: ['tip_split'],
    sections: [
      { id: 'everyday', name: 'Everyday & Dining', items: ['tip_split', 'grocery_shopping_cost', 'sales_tax_calc', 'fuel_mileage_cost', 'electricity_appliance_bill', 'monthly_budget_planner'] },
      { id: 'cooking', name: 'Cooking & Food', items: ['recipe_servings_scaler', 'cups_to_grams_converter', 'recipe_food_cost'] },
      { id: 'home', name: 'Home & Household', items: ['room_area_volume', 'appliance_electricity_cost', 'home_renovation_budget'] }
    ]
  },
  sports: {
    id: 'sports',
    slug: 'sports',
    name: 'Sports',
    icon: 'sports',
    color: '#ec4899',
    description: 'Running pace, marathon race predictor, cycling speed, swimming splits, and cricket run rates.',
    domainIds: ['sports'],
    sidebarPreview: ['running_pace_predictor'],
    sections: [
      { id: 'running_cycling', name: 'Endurance & Pace', items: ['running_pace_predictor', 'cycling_speed_pace', 'calories_burned_sports'] },
      { id: 'cricket_field', name: 'Cricket & Scoring', items: ['cricket_run_rate_calc', 'batting_bowling_average'] }
    ]
  },
  date_time: {
    id: 'date_time',
    slug: 'date-time',
    name: 'Date & Time',
    icon: 'calendar',
    color: '#f59e0b',
    description: 'Chronological age, duration between dates, working days countdown, time duration math, and timezones.',
    domainIds: ['date_time'],
    sidebarPreview: ['age', 'date_diff'],
    sections: [
      { id: 'age_calendar', name: 'Age & Calendar Intervals', items: ['age', 'date_diff', 'business_working_days', 'days_until_countdown'] },
      { id: 'time_clocks', name: 'Time Math & Clocks', items: ['time_duration_calc', 'timezone_converter', 'unix_timestamp_converter'] }
    ]
  },
  more: {
    id: 'more',
    slug: 'more',
    name: 'More',
    icon: 'more',
    color: '#6b7280',
    description: 'Specialized domains for agriculture, weather & environment, pet care, and general utilities.',
    domainIds: ['agriculture', 'weather_environment', 'pet_animal', 'miscellaneous'],
    sidebarPreview: ['crop_yield_estimator', 'wind_chill_heat_index', 'dog_cat_age_converter', 'random_number_dice'],
    sections: [
      { id: 'agriculture', name: 'Agriculture & Farming', items: ['crop_yield_estimator', 'npk_fertilizer_calc', 'land_area_seed_rate'] },
      { id: 'weather_environment', name: 'Weather & Environment', items: ['wind_chill_heat_index', 'dew_point_humidity', 'carbon_footprint_calc'] },
      { id: 'pet_animal', name: 'Pet & Animal Care', items: ['dog_cat_age_converter', 'pet_daily_calorie_food'] },
      { id: 'miscellaneous', name: 'General Utilities', items: ['random_number_dice', 'aspect_ratio_screen', 'hex_rgb_color_converter'] }
    ]
  }
};

/**
 * Helper: Find top-level category by id, slug, or matching domain
 */
export function getTopLevelCategory(keyOrSlug) {
  if (!keyOrSlug) return null;
  const normalized = keyOrSlug.toLowerCase().replace(/-/g, '_');
  
  // 1. Exact or normalized key match
  if (TOP_LEVEL_CATEGORIES[keyOrSlug]) return TOP_LEVEL_CATEGORIES[keyOrSlug];
  if (TOP_LEVEL_CATEGORIES[normalized]) return TOP_LEVEL_CATEGORIES[normalized];

  // 2. Slug match
  for (const cat of Object.values(TOP_LEVEL_CATEGORIES)) {
    if (cat.slug === keyOrSlug || cat.id === normalized) return cat;
  }

  // 3. Domain match (find parent top level category for domain)
  for (const cat of Object.values(TOP_LEVEL_CATEGORIES)) {
    if (cat.domainIds.includes(normalized) || cat.domainIds.includes(keyOrSlug)) {
      return cat;
    }
  }

  // 4. Check if direct in MASTER_TAXONOMY
  const domain = MASTER_TAXONOMY[normalized] || MASTER_TAXONOMY[keyOrSlug];
  if (domain && domain.parentCategory && TOP_LEVEL_CATEGORIES[domain.parentCategory]) {
    return TOP_LEVEL_CATEGORIES[domain.parentCategory];
  }

  return null;
}

/**
 * Helper: Get parent category ID for a domain
 */
export function getParentCategoryForDomain(domainId) {
  const norm = (domainId || '').toLowerCase().replace(/-/g, '_');
  for (const [topId, topCat] of Object.entries(TOP_LEVEL_CATEGORIES)) {
    if (topCat.domainIds.includes(norm) || topCat.domainIds.includes(domainId)) {
      return topId;
    }
  }
  return 'more';
}

/**
 * Helper: Gather all calculator IDs across a top-level category
 */
export function getAllCalculatorsForTopCategory(topCatId) {
  const topCat = getTopLevelCategory(topCatId);
  if (!topCat) return [];
  
  const ids = [];
  topCat.sections.forEach(sec => {
    sec.items.forEach(id => {
      if (!ids.includes(id)) ids.push(id);
    });
  });
  return ids;
}
