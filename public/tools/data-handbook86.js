// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook86) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "sphere-sections",
    "name": "Spherical Sections: Areas and Volumes (Hollow Sphere, Sector, Segment, Zone, Ring)",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What is the surface area, volume and mass of a sphere or of a part of one — a hollow sphere wall, a spherical sector, a segment (cap), a zone between two parallel planes, a hollow sector, a solid ring or part of a ring — and what radius of sphere do the given dimensions belong to?",
    "description": "Areas and volumes of a sphere and of the spherical sections drawn in the handbook: the whole sphere (or its radius from a volume), the wall G between two concentric spheres, the sector K of included angle φ, the segment S of base diameter E and height F, the zone T between parallel planes of diameters P and Q a height H apart (with the radius of its sphere), the hollow sector U between two spheres, the solid ring W (torus) and the part Z of a ring within an angle φ, with the mass from a density you enter.",
    "keywords": [
      "MAKEOS",
      "spherical segment",
      "spherical cap volume",
      "spherical zone",
      "spherical sector",
      "hollow sphere volume",
      "torus volume",
      "ring volume",
      "sphere surface area"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Section",
        "type": "select",
        "default": "S",
        "options": [
          [
            "sphere",
            "Whole sphere (radius R)"
          ],
          [
            "fromvol",
            "Whole sphere from its volume"
          ],
          [
            "G",
            "Wall G between two concentric spheres (R₁, R₂)"
          ],
          [
            "K",
            "Sector K (R, angle φ)"
          ],
          [
            "S",
            "Segment (cap) S (E, F)"
          ],
          [
            "T",
            "Zone T between parallel planes (P, Q, H)"
          ],
          [
            "U",
            "Hollow sector U (R₁, R₂, angle φ)"
          ],
          [
            "W",
            "Solid ring W (R₁, R₂)"
          ],
          [
            "Z",
            "Part Z of a ring (R₁, R₂, angle φ)"
          ]
        ]
      },
      {
        "key": "h_sphere",
        "label": "Sphere",
        "type": "heading"
      },
      {
        "key": "R",
        "label": "Sphere radius R",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nv",
        "label": "Volume of the whole sphere (to find its radius)",
        "type": "number",
        "default": 1,
        "unit": "L",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_wall_sector_and_ring",
        "label": "Wall, sector and ring",
        "type": "heading"
      },
      {
        "key": "R1",
        "label": "Outer radius R₁ (ring: radius to the centre of the ring section)",
        "type": "number",
        "default": 125,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R2",
        "label": "Inner radius R₂ (ring: radius of the ring section)",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Included angle φ",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.000001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_segment_and_zone",
        "label": "Segment and zone",
        "type": "heading"
      },
      {
        "key": "E",
        "label": "Base diameter E of the segment",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Height F of the segment",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "H",
        "label": "Height H of the zone",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Diameter P at one end of the zone",
        "type": "number",
        "default": 280,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Diameter Q at the other end of the zone",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_material",
        "label": "Material",
        "type": "heading"
      },
      {
        "key": "rho",
        "label": "Density of the material (for the mass)",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 30000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "conic-section-equation",
    "name": "Conic Section from Its General Equation (Parabola, Ellipse, Hyperbola: Centre, Vertices, Foci, Directrix)",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "Given the equation Ax² + Cy² + Dx + Ey + F = 0 of a curve, is it a parabola, an ellipse (or circle) or a hyperbola, and where are its vertex or centre, vertices, foci, directrix, axes and asymptotes?",
    "description": "Identifies the conic section of a general second-degree equation without an xy term and puts it into the standard form by completing the squares, as in the handbook examples: for a parabola (y − k)² = 4p(x − h) or (x − h)² = 4p(y − k), giving vertex, focus, directrix, axis and latus rectum; for an ellipse or circle the centre, semi-axes, foci and eccentricity; for a hyperbola (x − h)²/a² − (y − k)²/b² = 1 (or the vertical form) the centre, a, b, c = √(a² + b²), the eccentricity e = c ÷ a, vertices, foci and asymptotes.",
    "keywords": [
      "MAKEOS",
      "conic section",
      "parabola focus directrix",
      "hyperbola foci",
      "ellipse equation",
      "completing the square",
      "eccentricity",
      "general equation of a conic"
    ],
    "fields": [
      {
        "key": "A",
        "label": "Coefficient A of x²",
        "type": "number",
        "default": 9,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Coefficient C of y²",
        "type": "number",
        "default": -4,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Coefficient D of x",
        "type": "number",
        "default": -36,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Coefficient E of y",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Constant F",
        "type": "number",
        "default": -4,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "four-arc-oval",
    "name": "Four-Arc Oval Approximating an Ellipse (End and Side Radii and Their Centres)",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "To lay out an oval of a given length and width from four circular arcs that approximates an ellipse, what end radius, side radius and arc centres should I use, and how close is its area to the true ellipse?",
    "description": "Four-arc oval construction from the handbook (Brueckner method), which still works when the length is four or more times the width: end radius r = (B² ÷ 2A)(A ÷ B)^0.38, the distance X of the side-arc centre beyond the oval centre X = (A²/4 − Ar + Br − B²/4) ÷ (B − 2r) and the side radius R = B/2 + X, with the arc centres for layout, the angle of each arc, the tangent points, and the perimeter and area of the oval against the true ellipse. A smaller or larger end radius can be entered to make the oval thinner or fatter.",
    "keywords": [
      "MAKEOS",
      "four arc oval",
      "approximate ellipse",
      "oval layout",
      "oval radii",
      "ellipse by arcs",
      "oval duct",
      "racetrack oval"
    ],
    "fields": [
      {
        "key": "A",
        "label": "Major axis A (overall length)",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Minor axis B (overall width)",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rFrom",
        "label": "End radius r",
        "type": "select",
        "default": "eq",
        "options": [
          [
            "eq",
            "From the handbook equation (1)"
          ],
          [
            "given",
            "Entered (thinner or fatter oval)"
          ]
        ]
      },
      {
        "key": "rg",
        "label": "End radius r (when entered)",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hole-location-disks",
    "name": "Locating Three Holes by the Disk Method (Disk Diameters from Centre Distances)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "To locate three precision holes on the lathe or for checking by three disks whose rims touch, what diameter must each disk be so that its centre falls on its hole, given the three centre distances between the holes?",
    "description": "Disk method of locating holes in small precision work, by the handbook rule: three carefully centred disks are made to such diameters that when their rims touch, each disk centre lies on a hole position; the disks are then clamped to the work and each in turn is indicated true with the lathe spindle. From the centre distances A–B, B–C and A–C the radii are r_A = (AB − BC + AC) ÷ 2, r_B = AB − r_A and r_C = BC − r_B, with the triangle of the hole positions for checking the layout.",
    "keywords": [
      "MAKEOS",
      "disk method",
      "locating holes",
      "toolmakers buttons",
      "hole location disks",
      "jig boring without a jig borer",
      "precision hole layout"
    ],
    "fields": [
      {
        "key": "x",
        "label": "Centre distance hole A to hole B",
        "type": "number",
        "default": 23.622,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Centre distance hole B to hole C",
        "type": "number",
        "default": 18.288,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Centre distance hole A to hole C",
        "type": "number",
        "default": 21.844,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "metal-ball-lot-check",
    "name": "Standard Metal Ball Lot Check (Lot Mean Diameter, Ball Gauge, Specific Diameter, Balls per Kilogram)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For a lot of precision metal balls ordered by nominal diameter, grade and ball gauge, is the measured lot mean diameter and lot variation within what I allow for the grade, what specific diameter should the package be marked with, and how many balls are there per kilogram?",
    "description": "Lot check and package marking for standard metal balls in the terms of ANSI/AFBMA Std 10 as described in the handbook: the lot mean diameter DwmL from the mean diameters of the largest and smallest balls, the lot diameter variation VDwL, the size the order asks for (nominal diameter plus the ball gauge), acceptance between the limits you enter for the grade, the specific diameter (lot mean diameter rounded to the container marking increment, less the nominal diameter) for the package label, and the number of balls per kilogram and the lot mass from the material density.",
    "keywords": [
      "MAKEOS",
      "metal balls",
      "ball gauge",
      "ball grade",
      "lot mean diameter",
      "specific diameter",
      "balls per kilogram",
      "AFBMA",
      "precision balls"
    ],
    "fields": [
      {
        "key": "Dw",
        "label": "Nominal ball diameter Dw",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gage",
        "label": "Ball gauge ordered (with sign)",
        "type": "number",
        "default": -4,
        "unit": "µm",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "devMinus",
        "label": "Allowed lot mean diameter below the ordered size",
        "type": "number",
        "default": 1,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "devPlus",
        "label": "Allowed lot mean diameter above the ordered size",
        "type": "number",
        "default": 1.25,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "inc",
        "label": "Container marking increment for the grade",
        "type": "number",
        "default": 0.25,
        "unit": "µm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "VLmax",
        "label": "Allowed lot diameter variation for the grade",
        "type": "number",
        "default": 0.8,
        "unit": "µm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measured_lot",
        "label": "Measured lot",
        "type": "heading"
      },
      {
        "key": "Dmax",
        "label": "Mean diameter of the largest ball",
        "type": "number",
        "default": 5.9964,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dmin",
        "label": "Mean diameter of the smallest ball",
        "type": "number",
        "default": 5.99614,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_count_and_mass",
        "label": "Count and mass",
        "type": "heading"
      },
      {
        "key": "rho",
        "label": "Density of the ball material",
        "type": "number",
        "default": 7833,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 30000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Number of balls in the lot",
        "type": "number",
        "default": 5000,
        "unit": "balls",
        "min": 1,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "engine-flywheel-rim-and-arms",
    "name": "Engine Flywheel Rim Weight and Arm Proportions (Energy Excess Factor, Speed Variation)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a reciprocating engine or compressor flywheel, what rim mass keeps the speed within my allowed variation, given the indicated power or the work per revolution and the factor of energy excess, and what width and thickness should the elliptical arms have at the hub?",
    "description": "Flywheel rim weight for engines by the handbook formulas W = 387,587,500 c n HP ÷ (D² N³) when the indicated horsepower is given and W = 11,745 n E ÷ (D² N²) when the work per revolution is given, here in SI as rim mass m = n E ÷ v² with E = c × work per revolution, the factor of energy excess c entered from the table for the engine and cut-off, 1/n the allowed speed variation and v the speed of the mean rim diameter; with the rim cross-section for the material density, and the arm proportions: width at the hub 1.3 × shaft diameter for six arms or 1.2 × for eight, thickness half the width, and the area at the rim at least two-thirds of the area at the hub.",
    "keywords": [
      "MAKEOS",
      "engine flywheel",
      "flywheel rim weight",
      "factor of energy excess",
      "speed variation",
      "flywheel arms",
      "flywheel spokes",
      "steam engine flywheel",
      "compressor flywheel"
    ],
    "fields": [
      {
        "key": "given",
        "label": "Energy from",
        "type": "select",
        "default": "power",
        "options": [
          [
            "power",
            "Indicated power of the engine"
          ],
          [
            "work",
            "Work done per revolution"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Indicated power",
        "type": "number",
        "default": 112,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Wrev",
        "label": "Work done by the engine per revolution",
        "type": "number",
        "default": 20000,
        "unit": "J",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Factor of energy excess (from the table for the engine)",
        "type": "number",
        "default": 0.209,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "N",
        "label": "Flywheel speed",
        "type": "number",
        "default": 200,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pct",
        "label": "Allowed speed variation 1/n",
        "type": "number",
        "default": 2,
        "unit": "%",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dm",
        "label": "Mean diameter of the rim",
        "type": "number",
        "default": 1.8,
        "unit": "m",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_rim",
        "label": "Rim",
        "type": "heading"
      },
      {
        "key": "rho",
        "label": "Density of the rim material",
        "type": "number",
        "default": 7200,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 30000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_arms",
        "label": "Arms",
        "type": "heading"
      },
      {
        "key": "arms",
        "label": "Number of arms",
        "type": "select",
        "default": "6",
        "options": [
          [
            "6",
            "6 arms"
          ],
          [
            "8",
            "8 arms"
          ]
        ]
      },
      {
        "key": "ds",
        "label": "Shaft diameter at the hub",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
