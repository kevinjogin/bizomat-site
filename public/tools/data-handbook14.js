// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook14) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "plane-area",
    "name": "Plane Figure Area and Perimeter",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What area and perimeter does this flat shape have?",
    "description": "Area, perimeter and equivalent circle and square of common plane figures: circle, ring, sector, ring sector, rectangle, parallelogram, trapezoid, fillet (spandrel), parabolic segment and cycloid.",
    "keywords": [
      "MAKEOS",
      "area",
      "perimeter",
      "sector",
      "trapezoid",
      "spandrel",
      "fillet area",
      "parabola",
      "cycloid",
      "ring"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Shape",
        "type": "select",
        "default": "trapezoid",
        "options": [
          [
            "circle",
            "Circle (A = diameter)"
          ],
          [
            "ring",
            "Ring (A = outer dia, B = inner dia)"
          ],
          [
            "sector",
            "Circle sector (A = radius, angle)"
          ],
          [
            "ringsector",
            "Ring sector (A = outer radius, B = inner radius, angle)"
          ],
          [
            "rect",
            "Rectangle (A × B)"
          ],
          [
            "parallelogram",
            "Parallelogram (A = base, C = height, B = side)"
          ],
          [
            "trapezoid",
            "Trapezoid (A, B = parallel sides, C = height)"
          ],
          [
            "spandrel",
            "Fillet or spandrel (A = radius)"
          ],
          [
            "parabola",
            "Parabolic segment (A = chord, C = height)"
          ],
          [
            "cycloid",
            "Cycloid (A = rolling circle radius)"
          ]
        ]
      },
      {
        "key": "A",
        "label": "Dimension A",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Dimension B",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Dimension C (height)",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Angle (sectors)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 0.001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "polygon-area",
    "name": "Polygon Area and Centroid from Coordinates",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What is the area, perimeter and centroid of this polygon from its corner coordinates?",
    "description": "Area (shoelace formula), perimeter and centroid of any simple polygon with up to eight corners, including irregular quadrilaterals (trapeziums) and plate outlines.",
    "keywords": [
      "MAKEOS",
      "polygon area",
      "shoelace",
      "trapezium",
      "centroid",
      "coordinates",
      "irregular shape"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of corners",
        "type": "number",
        "default": 4,
        "unit": "corners",
        "min": 3,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_corner_1",
        "label": "Corner 1",
        "type": "heading"
      },
      {
        "key": "x1",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_2",
        "label": "Corner 2",
        "type": "heading"
      },
      {
        "key": "x2",
        "label": "X",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_3",
        "label": "Corner 3",
        "type": "heading"
      },
      {
        "key": "x3",
        "label": "X",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Y",
        "type": "number",
        "default": 70,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_4",
        "label": "Corner 4",
        "type": "heading"
      },
      {
        "key": "x4",
        "label": "X",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "Y",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_5",
        "label": "Corner 5",
        "type": "heading"
      },
      {
        "key": "x5",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y5",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_6",
        "label": "Corner 6",
        "type": "heading"
      },
      {
        "key": "x6",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y6",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_7",
        "label": "Corner 7",
        "type": "heading"
      },
      {
        "key": "x7",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y7",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_8",
        "label": "Corner 8",
        "type": "heading"
      },
      {
        "key": "x8",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y8",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "solid-volume",
    "name": "Volume and Surface of Solids",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What volume, surface area and mass does this solid have?",
    "description": "Volume, surface area and mass of spheres, hollow spheres, spherical caps, zones, sectors and wedges, cones, pyramids, cylinders, cylindrical hoofs, paraboloids, barrels, tori and ellipsoids.",
    "keywords": [
      "MAKEOS",
      "volume",
      "sphere",
      "spherical cap",
      "torus",
      "paraboloid",
      "barrel",
      "ellipsoid",
      "cylindrical wedge"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Solid",
        "type": "select",
        "default": "cap",
        "options": [
          [
            "sphere",
            "Sphere (A = diameter)"
          ],
          [
            "hsphere",
            "Hollow sphere (A = outer dia, B = inner dia)"
          ],
          [
            "cap",
            "Spherical cap or segment (A = base radius, C = height)"
          ],
          [
            "zone",
            "Spherical zone (A, B = end radii, C = height)"
          ],
          [
            "ssector",
            "Spherical sector (A = sphere radius, C = cap height)"
          ],
          [
            "swedge",
            "Spherical wedge (A = radius, angle)"
          ],
          [
            "cone",
            "Cone (A = base dia, C = height)"
          ],
          [
            "pyramid",
            "Square pyramid (A = base side, C = height)"
          ],
          [
            "cylinder",
            "Cylinder (A = dia, C = length)"
          ],
          [
            "hoof",
            "Cylindrical hoof, cut through the base diameter (A = radius, C = height)"
          ],
          [
            "paraboloid",
            "Paraboloid (A = base dia, C = height)"
          ],
          [
            "pseg",
            "Paraboloidal segment (A, B = end dias, C = height)"
          ],
          [
            "barrel",
            "Barrel, parabolic sides (A = bung dia, B = head dia, C = length)"
          ],
          [
            "torus",
            "Torus (A = centre-line dia, B = tube dia)"
          ],
          [
            "ellipsoid",
            "Ellipsoid (A, B, C = full axes)"
          ],
          [
            "cube",
            "Cube (A = side)"
          ]
        ]
      },
      {
        "key": "A",
        "label": "Dimension A",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Dimension B",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Dimension C",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Wedge angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density (for mass)",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0,
        "max": 50000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "centroid-shapes",
    "name": "Centre of Gravity of Common Shapes",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "Where is the centre of gravity of this shape or solid?",
    "description": "Position of the centroid (centre of gravity) of plane areas, arcs and uniform solids: triangle, sector, segment, arc, semicircle, trapezoid, parabolic area, cone, pyramid, frustum, hemisphere, hollow hemisphere, paraboloid, spherical segment and sector, and two bodies.",
    "keywords": [
      "MAKEOS",
      "centre of gravity",
      "centroid",
      "cone",
      "hemisphere",
      "sector",
      "segment",
      "frustum"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Shape",
        "type": "select",
        "default": "frustum",
        "options": [
          [
            "triangle",
            "Triangle (C = height): from base"
          ],
          [
            "semicircle",
            "Semicircle area (A = radius): from diameter"
          ],
          [
            "sector",
            "Circle sector (A = radius, angle): from centre"
          ],
          [
            "segment",
            "Circular segment (A = radius, angle): from centre"
          ],
          [
            "arc",
            "Circular arc (A = radius, angle): from centre"
          ],
          [
            "trapezoid",
            "Trapezoid (A = base, B = top, C = height): from base"
          ],
          [
            "parabola",
            "Parabolic segment (C = height): from base chord"
          ],
          [
            "cone",
            "Solid cone or pyramid (C = height): from base"
          ],
          [
            "frustum",
            "Frustum of cone (A = base dia, B = top dia, C = height): from base"
          ],
          [
            "hemisphere",
            "Solid hemisphere (A = radius): from flat face"
          ],
          [
            "hhemi",
            "Hollow hemisphere (A = outer radius, B = inner radius): from flat face"
          ],
          [
            "paraboloid",
            "Solid paraboloid (C = height): from base"
          ],
          [
            "sseg",
            "Spherical segment (A = sphere radius, C = height): from sphere centre"
          ],
          [
            "ssector",
            "Spherical sector (A = sphere radius, C = cap height): from sphere centre"
          ],
          [
            "bodies",
            "Two bodies (A = mass 1, B = mass 2, C = distance apart): from body 1"
          ]
        ]
      },
      {
        "key": "A",
        "label": "Dimension A",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Dimension B",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Dimension C",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Included angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "complex-number",
    "name": "Complex Number Calculator",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What is the sum, difference, product or quotient of these complex numbers, in rectangular and polar form?",
    "description": "Add, subtract, multiply and divide complex numbers and convert them between rectangular (a + bi) and polar (magnitude and angle) form, for AC circuits, vibration and phasor work.",
    "keywords": [
      "MAKEOS",
      "complex number",
      "phasor",
      "polar form",
      "imaginary",
      "impedance",
      "rectangular form"
    ],
    "fields": [
      {
        "key": "op",
        "label": "Operation",
        "type": "select",
        "default": "mul",
        "options": [
          [
            "add",
            "Add (z₁ + z₂)"
          ],
          [
            "sub",
            "Subtract (z₁ − z₂)"
          ],
          [
            "mul",
            "Multiply (z₁ × z₂)"
          ],
          [
            "div",
            "Divide (z₁ ÷ z₂)"
          ]
        ]
      },
      {
        "key": "a",
        "label": "z₁ real part",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "z₁ imaginary part",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "z₂ real part",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "z₂ imaginary part",
        "type": "number",
        "default": -2,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "coordinates-3d",
    "name": "Cylindrical and Spherical Coordinates",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What are the rectangular, cylindrical or spherical coordinates of this point?",
    "description": "Convert a point between rectangular (x, y, z), cylindrical (r, θ, z) and spherical (ρ, θ, φ) coordinates, for five-axis work, probing and layout.",
    "keywords": [
      "MAKEOS",
      "cylindrical coordinates",
      "spherical coordinates",
      "rectangular",
      "3D",
      "five-axis",
      "coordinate conversion"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Convert from",
        "type": "select",
        "default": "cyl",
        "options": [
          [
            "rect",
            "Rectangular (x, y, z)"
          ],
          [
            "cyl",
            "Cylindrical (r, θ, z)"
          ],
          [
            "sph",
            "Spherical (ρ, θ, φ)"
          ]
        ]
      },
      {
        "key": "p1",
        "label": "x, or r, or ρ",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "y, or θ (angle in XY plane from +X)",
        "type": "number",
        "default": 30,
        "unit": "mm or °",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p3",
        "label": "z, or φ (angle from +Z axis)",
        "type": "number",
        "default": 20,
        "unit": "mm or °",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "two-point-distance",
    "name": "Distance and Angle Between Two Points",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "How far apart are these two points, and at what angle?",
    "description": "Straight-line distance in 2D and 3D, the angle in the XY plane, the slope and the midpoint between two points.",
    "keywords": [
      "MAKEOS",
      "distance",
      "two points",
      "angle",
      "slope",
      "midpoint",
      "hypotenuse"
    ],
    "fields": [
      {
        "key": "x1",
        "label": "Point 1 X",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Point 1 Y",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Point 1 Z",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Point 2 X",
        "type": "number",
        "default": 70,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Point 2 Y",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z2",
        "label": "Point 2 Z",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "equation-solver",
    "name": "Quadratic and Cubic Equation Solver",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What are the roots of this quadratic or cubic equation?",
    "description": "Real and complex roots of a quadratic (ax² + bx + c = 0) or cubic (ax³ + bx² + cx + d = 0) equation, with the discriminant.",
    "keywords": [
      "MAKEOS",
      "quadratic equation",
      "cubic equation",
      "roots",
      "discriminant",
      "polynomial",
      "Cardano"
    ],
    "fields": [
      {
        "key": "degree",
        "label": "Equation",
        "type": "select",
        "default": "3",
        "options": [
          [
            "2",
            "Quadratic: ax² + bx + c = 0"
          ],
          [
            "3",
            "Cubic: ax³ + bx² + cx + d = 0"
          ]
        ]
      },
      {
        "key": "a",
        "label": "Coefficient a",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Coefficient b",
        "type": "number",
        "default": -6,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Coefficient c",
        "type": "number",
        "default": 11,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Coefficient d (cubic)",
        "type": "number",
        "default": -6,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "linear-system",
    "name": "Simultaneous Equations and 3 × 3 Matrix",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What solves these two or three simultaneous linear equations, and what are the determinant and inverse?",
    "description": "Solution of two or three simultaneous linear equations, with the determinant, inverse and transpose of the coefficient matrix.",
    "keywords": [
      "MAKEOS",
      "simultaneous equations",
      "matrix",
      "determinant",
      "inverse matrix",
      "Cramer",
      "linear system"
    ],
    "fields": [
      {
        "key": "size",
        "label": "Size",
        "type": "select",
        "default": "3",
        "options": [
          [
            "2",
            "2 equations, 2 unknowns"
          ],
          [
            "3",
            "3 equations, 3 unknowns"
          ]
        ]
      },
      {
        "key": "h_equation_1",
        "label": "Equation 1",
        "type": "heading"
      },
      {
        "key": "a11",
        "label": "Coefficient of x1",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a12",
        "label": "Coefficient of x2",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a13",
        "label": "Coefficient of x3",
        "type": "number",
        "default": -1,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b1",
        "label": "Right-hand side",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_equation_2",
        "label": "Equation 2",
        "type": "heading"
      },
      {
        "key": "a21",
        "label": "Coefficient of x1",
        "type": "number",
        "default": -3,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a22",
        "label": "Coefficient of x2",
        "type": "number",
        "default": -1,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a23",
        "label": "Coefficient of x3",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b2",
        "label": "Right-hand side",
        "type": "number",
        "default": -11,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_equation_3",
        "label": "Equation 3",
        "type": "heading"
      },
      {
        "key": "a31",
        "label": "Coefficient of x1",
        "type": "number",
        "default": -2,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a32",
        "label": "Coefficient of x2",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a33",
        "label": "Coefficient of x3",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b3",
        "label": "Right-hand side",
        "type": "number",
        "default": -3,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "combinations",
    "name": "Factorials, Permutations and Combinations",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "How many arrangements or selections of r items from n are possible?",
    "description": "Factorial n!, permutations nPr and combinations nCr, with large values in scientific notation, for sampling plans, tooling options and probability.",
    "keywords": [
      "MAKEOS",
      "factorial",
      "permutations",
      "combinations",
      "nCr",
      "nPr",
      "probability"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Total items n",
        "type": "number",
        "default": 10,
        "unit": "items",
        "min": 0,
        "max": 170,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "r",
        "label": "Items chosen r",
        "type": "number",
        "default": 3,
        "unit": "items",
        "min": 0,
        "max": 170,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "trig-functions",
    "name": "Trigonometric and Involute Functions",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What are the trigonometric, versed and involute functions of this angle, or the angle for an involute value?",
    "description": "Sine, cosine, tangent, cotangent, secant, cosecant, versed sine and cosine, and the involute function of an angle, or the angle whose involute is a given value (inverse involute) for gear work.",
    "keywords": [
      "MAKEOS",
      "trigonometry",
      "involute function",
      "inverse involute",
      "versed sine",
      "secant",
      "gear calculations"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "angle",
        "options": [
          [
            "angle",
            "Functions of an angle"
          ],
          [
            "inv",
            "Angle from an involute value"
          ]
        ]
      },
      {
        "key": "angle",
        "label": "Angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": -3600,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "invValue",
        "label": "Involute value",
        "type": "number",
        "default": 0.014904,
        "unit": "",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "dms-converter",
    "name": "Degrees, Minutes and Seconds Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this angle in degrees–minutes–seconds, decimal degrees and radians?",
    "description": "Convert an angle between degrees–minutes–seconds, decimal degrees and radians, for drawings, sine bar set-ups and survey data.",
    "keywords": [
      "MAKEOS",
      "degrees minutes seconds",
      "DMS",
      "decimal degrees",
      "radians",
      "angle conversion"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Convert from",
        "type": "select",
        "default": "dms",
        "options": [
          [
            "dms",
            "Degrees, minutes, seconds"
          ],
          [
            "dec",
            "Decimal degrees"
          ],
          [
            "rad",
            "Radians"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Degrees",
        "type": "number",
        "default": 12,
        "unit": "°",
        "min": -36000,
        "max": 36000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mi",
        "label": "Minutes",
        "type": "number",
        "default": 30,
        "unit": "′",
        "min": 0,
        "max": 59.999999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Seconds",
        "type": "number",
        "default": 15,
        "unit": "″",
        "min": 0,
        "max": 59.999999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dec",
        "label": "Decimal degrees",
        "type": "number",
        "default": 12.504167,
        "unit": "°",
        "min": -36000,
        "max": 36000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Radians",
        "type": "number",
        "default": 0.218239,
        "unit": "rad",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "triangle-ssa",
    "name": "Triangle from Two Sides and an Opposite Angle",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "Which triangles have these two sides and the angle opposite one of them?",
    "description": "Solve the ambiguous case of a triangle (two sides and an angle opposite one of them), giving none, one or two possible triangles with all sides, angles and areas.",
    "keywords": [
      "MAKEOS",
      "triangle",
      "ambiguous case",
      "law of sines",
      "SSA",
      "oblique triangle"
    ],
    "fields": [
      {
        "key": "a",
        "label": "Side a (opposite the known angle)",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Side b",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Angle A (opposite side a)",
        "type": "number",
        "default": 40,
        "unit": "°",
        "min": 0.000001,
        "max": 179.999,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "circle-packing",
    "name": "Rollers Around a Shaft and Circles in Circles",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What size rollers fit around this shaft, how big a circle holds N equal circles, or how many circles fit in a rectangle?",
    "description": "Diameter of equal rollers fitting around a shaft (or the shaft for given rollers), the enclosing circle for up to ten equal circles, and the number of equal circles in a rectangle by square and hexagonal packing.",
    "keywords": [
      "MAKEOS",
      "rollers on a shaft",
      "circle packing",
      "circles in a circle",
      "bundle",
      "nesting",
      "tube bundle"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Problem",
        "type": "select",
        "default": "shaft",
        "options": [
          [
            "shaft",
            "N rollers around a shaft"
          ],
          [
            "incircle",
            "N equal circles inside a circle (N ≤ 10)"
          ],
          [
            "rect",
            "Equal circles in a rectangle"
          ]
        ]
      },
      {
        "key": "n",
        "label": "Number of rollers or circles",
        "type": "number",
        "default": 8,
        "unit": "items",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d",
        "label": "Shaft diameter, or circle diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Rectangle width",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hh",
        "label": "Rectangle height",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "density-converter",
    "name": "Density and Specific Gravity Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this density in other units, or as a specific gravity?",
    "description": "Convert density between kg/m³, g/cm³, kg/L, lb/in³, lb/ft³, lb/US gal and specific gravity (relative to water at 4 °C).",
    "keywords": [
      "MAKEOS",
      "density",
      "specific gravity",
      "lb/in3",
      "kg/m3",
      "unit conversion"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Density value",
        "type": "number",
        "default": 7.85,
        "unit": "",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "gcm3",
        "options": [
          [
            "kgm3",
            "kg/m³"
          ],
          [
            "gcm3",
            "g/cm³"
          ],
          [
            "kgL",
            "kg/L"
          ],
          [
            "lbin3",
            "lb/in³"
          ],
          [
            "lbft3",
            "lb/ft³"
          ],
          [
            "lbgal",
            "lb/US gal"
          ],
          [
            "sg",
            "specific gravity"
          ]
        ]
      }
    ]
  },
  {
    "id": "wind-chill",
    "name": "Wind Chill Temperature",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "How cold does it feel at this air temperature and wind speed?",
    "description": "Wind chill equivalent temperature from air temperature and wind speed (JAG/TI 2001 formula used in North America), for outdoor work planning.",
    "keywords": [
      "MAKEOS",
      "wind chill",
      "cold stress",
      "outdoor work",
      "temperature",
      "weather"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Air temperature",
        "type": "number",
        "default": -5,
        "unit": "°C",
        "min": -80,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Wind speed at 10 m height",
        "type": "number",
        "default": 30,
        "unit": "km/h",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
