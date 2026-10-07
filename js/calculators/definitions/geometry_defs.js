/**
 * CALQIO Geometry Calculator Definitions
 */

export const PythagoreanTheoremDef = {
  id: 'pythagorean_theorem',
  name: 'Pythagorean Theorem Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Calculate right triangle hypotenuse c = √(a² + b²) or missing legs with angles and area.',
  inputs: [
    {
      id: 'solveFor',
      label: 'Solve For',
      type: 'segmented',
      defaultValue: 'c',
      options: [
        { label: 'Hypotenuse (c)', value: 'c' },
        { label: 'Leg (a)', value: 'a' },
        { label: 'Leg (b)', value: 'b' }
      ]
    },
    { id: 'val1', label: 'Side A / Given Side 1', type: 'number', defaultValue: 3 },
    { id: 'val2', label: 'Side B / Given Side 2', type: 'number', defaultValue: 4 }
  ],
  calculate: (vals) => {
    const mode = vals.solveFor || 'c';
    const v1 = parseFloat(vals.val1) || 0;
    const v2 = parseFloat(vals.val2) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    let a, b, c;
    if (mode === 'c') {
      a = v1; b = v2;
      c = Math.sqrt(a * a + b * b);
    } else if (mode === 'a') {
      b = v1; c = v2;
      if (c <= b) {
        return {
          mainResult: 'Invalid Hypotenuse',
          mainLabel: 'Error',
          subResult: 'Hypotenuse c must be strictly greater than leg b',
          breakdown: [{ label: 'Condition', value: 'c > b required' }],
          formula: 'a = √(c² − b²)',
          explanation: 'In Euclidean geometry, the hypotenuse is always the longest side of a right triangle.'
        };
      }
      a = Math.sqrt(c * c - b * b);
    } else {
      a = v1; c = v2;
      if (c <= a) {
        return {
          mainResult: 'Invalid Hypotenuse',
          mainLabel: 'Error',
          subResult: 'Hypotenuse c must be strictly greater than leg a',
          breakdown: [{ label: 'Condition', value: 'c > a required' }],
          formula: 'b = √(c² − a²)',
          explanation: 'In Euclidean geometry, the hypotenuse is always the longest side of a right triangle.'
        };
      }
      b = Math.sqrt(c * c - a * a);
    }

    const area = 0.5 * a * b;
    const perimeter = a + b + c;
    const angleA = (Math.asin(a / c) * 180) / Math.PI;
    const angleB = 90 - angleA;

    return {
      mainResult: mode === 'c' ? `c = ${fmt(c)}` : (mode === 'a' ? `a = ${fmt(a)}` : `b = ${fmt(b)}`),
      mainLabel: mode === 'c' ? 'Calculated Hypotenuse (c)' : 'Calculated Missing Leg',
      subResult: `Right Triangle: a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`,
      breakdown: [
        { label: 'Side a (Leg)', value: `${fmt(a)}` },
        { label: 'Side b (Leg)', value: `${fmt(b)}` },
        { label: 'Side c (Hypotenuse)', value: `${fmt(c)}` },
        { label: 'Triangle Area', value: `${fmt(area)} sq units` },
        { label: 'Perimeter', value: `${fmt(perimeter)} units` },
        { label: 'Angle α', value: `${fmt(angleA)}°` },
        { label: 'Angle β', value: `${fmt(angleB)}°` }
      ],
      formula: `a² + b² = c²  →  ${mode} = ${fmt(mode === 'c' ? c : (mode === 'a' ? a : b))}`,
      explanation: 'Applies the Pythagorean Theorem to resolve all right triangle metric properties.',
      expression: `Hypotenuse = ${fmt(c)}`
    };
  }
};

export const TriangleGeometryDef = {
  id: 'triangle_geometry',
  name: 'Triangle Geometry Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Calculate triangle area (Heron’s formula / Base-Height), perimeter, inradius, and circumradius.',
  inputs: [
    {
      id: 'method',
      label: 'Calculation Method',
      type: 'segmented',
      defaultValue: 'sides',
      options: [
        { label: 'Three Sides (a, b, c)', value: 'sides' },
        { label: 'Base & Height', value: 'bh' }
      ]
    },
    { id: 'a', label: 'Side a / Base (b)', type: 'number', defaultValue: 6 },
    { id: 'b', label: 'Side b / Height (h)', type: 'number', defaultValue: 8 },
    { id: 'c', label: 'Side c (if 3 sides)', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const method = vals.method || 'sides';
    const a = parseFloat(vals.a) || 0;
    const b = parseFloat(vals.b) || 0;
    const c = parseFloat(vals.c) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (method === 'bh') {
      const area = 0.5 * a * b;
      return {
        mainResult: `${fmt(area)} sq units`,
        mainLabel: 'Triangle Area',
        subResult: `Base = ${fmt(a)},  Height = ${fmt(b)}`,
        breakdown: [
          { label: 'Base (b)', value: `${fmt(a)}` },
          { label: 'Height (h)', value: `${fmt(b)}` }
        ],
        formula: `Area = ½ × base × height = 0.5 × ${fmt(a)} × ${fmt(b)} = ${fmt(area)}`,
        explanation: 'Standard base-height area formula for triangles.'
      };
    }

    if (a + b <= c || a + c <= b || b + c <= a) {
      return {
        mainResult: 'Invalid Triangle',
        mainLabel: 'Triangle Inequality Violation',
        subResult: 'Sum of any two sides must exceed the third side.',
        breakdown: [{ label: 'Check', value: 'a + b > c failed' }],
        formula: 'a + b > c, b + c > a, a + c > b',
        explanation: 'The provided side lengths do not form a closed Euclidean polygon.'
      };
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const perimeter = a + b + c;
    const inradius = area / s;
    const circumradius = (a * b * c) / (4 * area);

    return {
      mainResult: `${fmt(area)} sq units`,
      mainLabel: 'Triangle Area (Heron’s Formula)',
      subResult: `Perimeter = ${fmt(perimeter)} units`,
      breakdown: [
        { label: 'Semiperimeter (s)', value: `${fmt(s)}` },
        { label: 'Perimeter (P)', value: `${fmt(perimeter)}` },
        { label: 'Incircle Radius (r)', value: `${fmt(inradius)}` },
        { label: 'Circumcircle Radius (R)', value: `${fmt(circumradius)}` }
      ],
      formula: `Area = √(s(s−a)(s−b)(s−c)) = ${fmt(area)}`,
      explanation: 'Heron’s formula calculates exact triangle area from three boundary side lengths.',
      expression: `Area = ${fmt(area)}`
    };
  }
};

export const RectangleSquareDef = {
  id: 'rectangle_square',
  name: 'Rectangle & Square Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Compute area, perimeter, diagonal length, and aspect ratio of rectangles and squares.',
  inputs: [
    { id: 'length', label: 'Length (l)', type: 'number', defaultValue: 12 },
    { id: 'width', label: 'Width (w)', type: 'number', defaultValue: 8 }
  ],
  calculate: (vals) => {
    const l = parseFloat(vals.length) || 0;
    const w = parseFloat(vals.width) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const area = l * w;
    const perimeter = 2 * (l + w);
    const diagonal = Math.sqrt(l * l + w * w);
    const isSquare = l === w && l > 0;

    return {
      mainResult: `${fmt(area)} sq units`,
      mainLabel: isSquare ? 'Square Area' : 'Rectangle Area',
      subResult: `Perimeter: ${fmt(perimeter)} units,  Diagonal: ${fmt(diagonal)}`,
      breakdown: [
        { label: 'Shape Type', value: isSquare ? 'Square (l = w)' : 'Rectangle' },
        { label: 'Perimeter (2l + 2w)', value: `${fmt(perimeter)}` },
        { label: 'Diagonal (√(l² + w²))', value: `${fmt(diagonal)}` },
        { label: 'Aspect Ratio', value: w > 0 ? `${fmt(l / w)} : 1` : 'N/A' }
      ],
      formula: `Area = l × w = ${fmt(l)} × ${fmt(w)} = ${fmt(area)}`,
      explanation: 'Calculates 2D planar quadrilateral area and internal hypotenuse diagonal.',
      expression: `Area = ${fmt(area)}`
    };
  }
};

export const CircleEllipseDef = {
  id: 'circle_ellipse',
  name: 'Circle & Ellipse Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Calculate circle & ellipse area, circumference, diameter, and eccentricity.',
  inputs: [
    {
      id: 'shape',
      label: 'Geometry Shape',
      type: 'segmented',
      defaultValue: 'circle',
      options: [
        { label: 'Circle', value: 'circle' },
        { label: 'Ellipse', value: 'ellipse' }
      ]
    },
    { id: 'r1', label: 'Radius (r) / Semi-major Axis (a)', type: 'number', defaultValue: 7 },
    { id: 'r2', label: 'Semi-minor Axis (b - Ellipse only)', type: 'number', defaultValue: 4 }
  ],
  calculate: (vals) => {
    const isCircle = vals.shape === 'circle';
    const a = parseFloat(vals.r1) || 0;
    const b = isCircle ? a : (parseFloat(vals.r2) || 0);

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const area = Math.PI * a * b;
    let perimeter;

    if (isCircle) {
      perimeter = 2 * Math.PI * a;
      return {
        mainResult: `${fmt(area)} sq units`,
        mainLabel: 'Circle Area',
        subResult: `Circumference: ${fmt(perimeter)} units`,
        breakdown: [
          { label: 'Diameter (2r)', value: `${fmt(2 * a)}` },
          { label: 'Circumference (2πr)', value: `${fmt(perimeter)}` },
          { label: 'Exact Area', value: `${fmt(a * a)}π` }
        ],
        formula: `Area = πr² = π × ${fmt(a)}² = ${fmt(area)}`,
        explanation: 'Calculates circle enclosed planar area and outer circumference perimeter.'
      };
    }

    // Ramanujan ellipse perimeter approximation
    const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
    perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    const ecc = a > 0 ? Math.sqrt(Math.max(0, 1 - (b * b) / (a * a))) : 0;

    return {
      mainResult: `${fmt(area)} sq units`,
      mainLabel: 'Ellipse Area',
      subResult: `Perimeter ≈ ${fmt(perimeter)} units`,
      breakdown: [
        { label: 'Semi-major Axis (a)', value: `${fmt(a)}` },
        { label: 'Semi-minor Axis (b)', value: `${fmt(b)}` },
        { label: 'Circumference (Ramanujan)', value: `${fmt(perimeter)}` },
        { label: 'Eccentricity (e)', value: `${fmt(ecc)}` }
      ],
      formula: `Area = π × a × b = π × ${fmt(a)} × ${fmt(b)} = ${fmt(area)}`,
      explanation: 'Calculates 2D planar ellipse surface area and Ramanujan perimeter approximation.'
    };
  }
};

export const TrapezoidRhombusDef = {
  id: 'trapezoid_rhombus',
  name: 'Trapezoid & Rhombus Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Compute area and perimeter of trapezoids (trapeziums) and rhombuses.',
  inputs: [
    {
      id: 'shape',
      label: 'Shape',
      type: 'segmented',
      defaultValue: 'trapezoid',
      options: [
        { label: 'Trapezoid', value: 'trapezoid' },
        { label: 'Rhombus', value: 'rhombus' }
      ]
    },
    { id: 'p1', label: 'Base a / Diagonal d₁', type: 'number', defaultValue: 10 },
    { id: 'p2', label: 'Base b / Diagonal d₂', type: 'number', defaultValue: 6 },
    { id: 'p3', label: 'Height h / Side s', type: 'number', defaultValue: 5 }
  ],
  calculate: (vals) => {
    const isTrap = vals.shape === 'trapezoid';
    const v1 = parseFloat(vals.p1) || 0;
    const v2 = parseFloat(vals.p2) || 0;
    const v3 = parseFloat(vals.p3) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (isTrap) {
      const area = 0.5 * (v1 + v2) * v3;
      return {
        mainResult: `${fmt(area)} sq units`,
        mainLabel: 'Trapezoid Area',
        subResult: `Bases: ${fmt(v1)} and ${fmt(v2)}, Height: ${fmt(v3)}`,
        breakdown: [
          { label: 'Parallel Base a', value: `${fmt(v1)}` },
          { label: 'Parallel Base b', value: `${fmt(v2)}` },
          { label: 'Vertical Height h', value: `${fmt(v3)}` }
        ],
        formula: `Area = ((a + b) ÷ 2) × h = ((${fmt(v1)} + ${fmt(v2)}) ÷ 2) × ${fmt(v3)} = ${fmt(area)}`,
        explanation: 'The area of a trapezoid equals the average length of the parallel bases times height.'
      };
    }

    // Rhombus
    const area = 0.5 * v1 * v2;
    const side = Math.sqrt(Math.pow(v1 / 2, 2) + Math.pow(v2 / 2, 2));
    const perimeter = 4 * side;

    return {
      mainResult: `${fmt(area)} sq units`,
      mainLabel: 'Rhombus Area',
      subResult: `Perimeter: ${fmt(perimeter)} units,  Side: ${fmt(side)}`,
      breakdown: [
        { label: 'Diagonal d₁', value: `${fmt(v1)}` },
        { label: 'Diagonal d₂', value: `${fmt(v2)}` },
        { label: 'Calculated Side (s)', value: `${fmt(side)}` },
        { label: 'Perimeter (4s)', value: `${fmt(perimeter)}` }
      ],
      formula: `Area = ½ × d₁ × d₂ = 0.5 × ${fmt(v1)} × ${fmt(v2)} = ${fmt(area)}`,
      explanation: 'Calculates rhombus planar area from perpendicular diagonals.'
    };
  }
};

export const PolygonsDef = {
  id: 'polygons',
  name: 'Regular Polygon Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Area, perimeter, interior/exterior angles, and inradius/circumradius of regular n-sided polygons.',
  inputs: [
    { id: 'n', label: 'Number of Sides (n ≥ 3)', type: 'number', defaultValue: 6 },
    { id: 's', label: 'Side Length (s)', type: 'number', defaultValue: 5 }
  ],
  calculate: (vals) => {
    const n = Math.max(3, parseInt(vals.n) || 3);
    const s = parseFloat(vals.s) || 0;

    const fmt = (num) => parseFloat(num.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const perimeter = n * s;
    const apothem = s / (2 * Math.tan(Math.PI / n));
    const area = (n * s * apothem) / 2;
    const interiorAngle = ((n - 2) * 180) / n;
    const exteriorAngle = 360 / n;
    const circumradius = s / (2 * Math.sin(Math.PI / n));

    const names = { 3: 'Equilateral Triangle', 4: 'Square', 5: 'Regular Pentagon', 6: 'Regular Hexagon', 8: 'Regular Octagon', 10: 'Regular Decagon', 12: 'Regular Dodecagon' };
    const shapeName = names[n] || `${n}-sided Regular Polygon`;

    return {
      mainResult: `${fmt(area)} sq units`,
      mainLabel: `${shapeName} Area`,
      subResult: `Perimeter: ${fmt(perimeter)} units`,
      breakdown: [
        { label: 'Polygon Type', value: shapeName },
        { label: 'Apothem (Inradius r)', value: `${fmt(apothem)}` },
        { label: 'Circumradius (R)', value: `${fmt(circumradius)}` },
        { label: 'Interior Angle', value: `${fmt(interiorAngle)}°` },
        { label: 'Exterior Angle', value: `${fmt(exteriorAngle)}°` }
      ],
      formula: `Area = (n × s²) ÷ (4 × tan(π/n)) = ${fmt(area)}`,
      explanation: 'Calculates regular polygonal geometry metrics and apothem radius.'
    };
  }
};

export const CubeCuboidDef = {
  id: 'cube_cuboid',
  name: 'Cube & Cuboid (Rectangular Prism)',
  category: 'math',
  icon: 'geometry',
  description: 'Calculate 3D volume, total surface area, lateral area, and space diagonal of cuboids.',
  inputs: [
    { id: 'l', label: 'Length (l)', type: 'number', defaultValue: 8 },
    { id: 'w', label: 'Width (w)', type: 'number', defaultValue: 5 },
    { id: 'h', label: 'Height (h)', type: 'number', defaultValue: 4 }
  ],
  calculate: (vals) => {
    const l = parseFloat(vals.l) || 0;
    const w = parseFloat(vals.w) || 0;
    const h = parseFloat(vals.h) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const volume = l * w * h;
    const surfaceArea = 2 * (l * w + w * h + h * l);
    const lateralArea = 2 * h * (l + w);
    const diagonal = Math.sqrt(l * l + w * w + h * h);
    const isCube = l === w && w === h && l > 0;

    return {
      mainResult: `${fmt(volume)} cubic units`,
      mainLabel: isCube ? 'Cube Volume' : 'Cuboid Volume',
      subResult: `Total Surface Area: ${fmt(surfaceArea)} sq units`,
      breakdown: [
        { label: '3D Solid Type', value: isCube ? 'Perfect Cube (l=w=h)' : 'Rectangular Prism / Cuboid' },
        { label: 'Total Surface Area', value: `${fmt(surfaceArea)} sq units` },
        { label: 'Lateral Area (Walls)', value: `${fmt(lateralArea)} sq units` },
        { label: 'Space Diagonal', value: `${fmt(diagonal)} units` }
      ],
      formula: `Volume = l × w × h = ${fmt(l)} × ${fmt(w)} × ${fmt(h)} = ${fmt(volume)}`,
      explanation: 'Computes total enclosed 3D cubic capacity and multi-face surface boundaries.'
    };
  }
};

export const CylinderVolumeDef = {
  id: 'cylinder_volume',
  name: 'Cylinder Volume & Surface Area',
  category: 'math',
  icon: 'geometry',
  description: 'Compute 3D volume, curved lateral surface area, and total surface area of a circular cylinder.',
  inputs: [
    { id: 'r', label: 'Base Radius (r)', type: 'number', defaultValue: 4 },
    { id: 'h', label: 'Height (h)', type: 'number', defaultValue: 10 }
  ],
  calculate: (vals) => {
    const r = parseFloat(vals.r) || 0;
    const h = parseFloat(vals.h) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    const volume = Math.PI * r * r * h;
    const curvedArea = 2 * Math.PI * r * h;
    const baseArea = Math.PI * r * r;
    const totalArea = curvedArea + 2 * baseArea;

    return {
      mainResult: `${fmt(volume)} cubic units`,
      mainLabel: 'Cylinder Volume',
      subResult: `Total Surface Area: ${fmt(totalArea)} sq units`,
      breakdown: [
        { label: 'Base Circle Area', value: `${fmt(baseArea)} sq units` },
        { label: 'Curved Surface Area', value: `${fmt(curvedArea)} sq units` },
        { label: 'Total Surface Area', value: `${fmt(totalArea)} sq units` },
        { label: 'Exact Volume', value: `${fmt(r * r * h)}π` }
      ],
      formula: `Volume = πr²h = π × ${fmt(r)}² × ${fmt(h)} = ${fmt(volume)}`,
      explanation: 'Calculates the 3D volume and outer enclosing surface area of a right cylinder.'
    };
  }
};

export const ConePyramidDef = {
  id: 'cone_pyramid',
  name: 'Cone & Pyramid Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Calculate 3D volume, slant height, curved surface area, and total area of cones and pyramids.',
  inputs: [
    {
      id: 'solid',
      label: 'Solid Type',
      type: 'segmented',
      defaultValue: 'cone',
      options: [
        { label: 'Circular Cone', value: 'cone' },
        { label: 'Square Pyramid', value: 'pyramid' }
      ]
    },
    { id: 'r', label: 'Radius (r) / Base Side (a)', type: 'number', defaultValue: 5 },
    { id: 'h', label: 'Vertical Height (h)', type: 'number', defaultValue: 12 }
  ],
  calculate: (vals) => {
    const isCone = vals.solid === 'cone';
    const r = parseFloat(vals.r) || 0;
    const h = parseFloat(vals.h) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (isCone) {
      const slant = Math.sqrt(r * r + h * h);
      const volume = (1 / 3) * Math.PI * r * r * h;
      const lateralArea = Math.PI * r * slant;
      const totalArea = lateralArea + Math.PI * r * r;

      return {
        mainResult: `${fmt(volume)} cubic units`,
        mainLabel: 'Cone Volume',
        subResult: `Slant Height: ${fmt(slant)} units`,
        breakdown: [
          { label: 'Slant Height (s = √(r²+h²))', value: `${fmt(slant)}` },
          { label: 'Curved Surface Area', value: `${fmt(lateralArea)} sq units` },
          { label: 'Base Area (πr²)', value: `${fmt(Math.PI * r * r)} sq units` },
          { label: 'Total Surface Area', value: `${fmt(totalArea)} sq units` }
        ],
        formula: `Volume = ⅓πr²h = ⅓ × π × ${fmt(r)}² × ${fmt(h)} = ${fmt(volume)}`,
        explanation: 'Calculates conical 3D capacity and slant geometric envelope.'
      };
    }

    // Square Pyramid
    const slant = Math.sqrt(Math.pow(r / 2, 2) + h * h);
    const volume = (1 / 3) * (r * r) * h;
    const lateralArea = 2 * r * slant;
    const totalArea = lateralArea + r * r;

    return {
      mainResult: `${fmt(volume)} cubic units`,
      mainLabel: 'Square Pyramid Volume',
      subResult: `Total Surface Area: ${fmt(totalArea)} sq units`,
      breakdown: [
        { label: 'Base Side (a)', value: `${fmt(r)}` },
        { label: 'Pyramid Slant Height', value: `${fmt(slant)}` },
        { label: 'Lateral Triangular Area', value: `${fmt(lateralArea)} sq units` },
        { label: 'Base Area (a²)', value: `${fmt(r * r)} sq units` }
      ],
      formula: `Volume = ⅓ × a² × h = ⅓ × ${fmt(r)}² × ${fmt(h)} = ${fmt(volume)}`,
      explanation: 'Calculates the 3D volume and surface area of a square-base pyramid.'
    };
  }
};

export const SphereHemisphereDef = {
  id: 'sphere_hemisphere',
  name: 'Sphere & Hemisphere Calculator',
  category: 'math',
  icon: 'geometry',
  description: 'Compute 3D volume and surface area of spheres and hemispheres.',
  inputs: [
    {
      id: 'shape',
      label: 'Solid',
      type: 'segmented',
      defaultValue: 'sphere',
      options: [
        { label: 'Sphere', value: 'sphere' },
        { label: 'Hemisphere', value: 'hemisphere' }
      ]
    },
    { id: 'r', label: 'Radius (r)', type: 'number', defaultValue: 6 }
  ],
  calculate: (vals) => {
    const isSphere = vals.shape === 'sphere';
    const r = parseFloat(vals.r) || 0;

    const fmt = (n) => parseFloat(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

    if (isSphere) {
      const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
      const surfaceArea = 4 * Math.PI * r * r;

      return {
        mainResult: `${fmt(volume)} cubic units`,
        mainLabel: 'Sphere Volume',
        subResult: `Surface Area: ${fmt(surfaceArea)} sq units`,
        breakdown: [
          { label: 'Diameter (2r)', value: `${fmt(2 * r)}` },
          { label: 'Surface Area (4πr²)', value: `${fmt(surfaceArea)} sq units` },
          { label: 'Exact Volume', value: `${fmt((4/3) * Math.pow(r, 3))}π` }
        ],
        formula: `Volume = ⁴⁄₃πr³ = ⁴⁄₃ × π × ${fmt(r)}³ = ${fmt(volume)}`,
        explanation: 'Calculates the 3D capacity and enclosing surface area of a perfect sphere.'
      };
    }

    // Hemisphere
    const volume = (2 / 3) * Math.PI * Math.pow(r, 3);
    const curvedArea = 2 * Math.PI * r * r;
    const totalArea = 3 * Math.PI * r * r;

    return {
      mainResult: `${fmt(volume)} cubic units`,
      mainLabel: 'Hemisphere Volume',
      subResult: `Total Surface Area: ${fmt(totalArea)} sq units`,
      breakdown: [
        { label: 'Curved Surface Area (2πr²)', value: `${fmt(curvedArea)} sq units` },
        { label: 'Flat Base Area (πr²)', value: `${fmt(Math.PI * r * r)} sq units` },
        { label: 'Total Surface Area (3πr²)', value: `${fmt(totalArea)} sq units` }
      ],
      formula: `Volume = ⅔πr³ = ⅔ × π × ${fmt(r)}³ = ${fmt(volume)}`,
      explanation: 'Calculates hemisphere volume and total closed surface area including flat base.'
    };
  }
};
