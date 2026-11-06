// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook15) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "overhanging-beam",
    "name": "Overhanging Beam",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What reactions, moments and deflections does this beam with overhanging ends have?",
    "description": "Reactions, maximum positive and negative bending moments, stress and deflections of a beam on two supports with one or two overhangs, under end point loads or a uniform load.",
    "keywords": [
      "MAKEOS",
      "overhanging beam",
      "overhang",
      "cantilevered end",
      "negative moment",
      "reactions"
    ],
    "fields": [
      {
        "key": "case",
        "label": "Arrangement",
        "type": "select",
        "default": "two-udl",
        "options": [
          [
            "one-point",
            "One overhang · point load at its tip"
          ],
          [
            "two-point",
            "Equal overhangs · point load at each tip"
          ],
          [
            "two-udl",
            "Equal overhangs · uniform load over whole length"
          ],
          [
            "one-udl",
            "One overhang · uniform load over whole length"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Span between supports",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Overhang length",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "load",
        "label": "Point load (each), or uniform load per metre",
        "type": "number",
        "default": 4000,
        "unit": "N or N/m",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area",
        "type": "number",
        "default": 8000000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Distance to extreme fibre",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "two-span-beam",
    "name": "Continuous Beam over Two Spans",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What reactions, moments and deflections does this beam continuous over three supports have?",
    "description": "Reactions, the support moment (three-moment equation), maximum span moments, stress and deflections of a beam continuous over two equal or unequal spans with uniform or point loads.",
    "keywords": [
      "MAKEOS",
      "continuous beam",
      "two spans",
      "three-moment equation",
      "centre support",
      "indeterminate beam"
    ],
    "fields": [
      {
        "key": "case",
        "label": "Loading",
        "type": "select",
        "default": "udl",
        "options": [
          [
            "udl",
            "Uniform load on each span"
          ],
          [
            "point",
            "One point load in each span"
          ]
        ]
      },
      {
        "key": "L1",
        "label": "Span 1",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Span 2",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w1",
        "label": "Load on span 1 (N/m, or N for a point load)",
        "type": "number",
        "default": 2000,
        "unit": "N/m or N",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w2",
        "label": "Load on span 2 (N/m, or N for a point load)",
        "type": "number",
        "default": 2000,
        "unit": "N/m or N",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Point load position in span 1 (from end support)",
        "type": "number",
        "default": 1500,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Point load position in span 2 (from centre support)",
        "type": "number",
        "default": 1500,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area",
        "type": "number",
        "default": 8000000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Distance to extreme fibre",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "beam-cases-more",
    "name": "Beam Cases: Fixed, Guided, Propped and Partial Loads",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What moments and deflection does this less common beam case give?",
    "description": "Reactions, maximum bending moment, stress and maximum deflection for a fixed–fixed beam with an off-centre load, beams fixed at one end and guided at the other, a propped cantilever with a point load anywhere, two symmetrical loads, and a uniform load on part of a span.",
    "keywords": [
      "MAKEOS",
      "fixed beam",
      "guided end",
      "propped cantilever",
      "two point loads",
      "partial uniform load",
      "beam formulas"
    ],
    "fields": [
      {
        "key": "case",
        "label": "Beam case",
        "type": "select",
        "default": "ff-offset",
        "options": [
          [
            "ff-offset",
            "Fixed both ends · point load at distance a"
          ],
          [
            "guided-point",
            "Fixed one end, guided other · load at guided end"
          ],
          [
            "guided-udl",
            "Fixed one end, guided other · uniform load"
          ],
          [
            "prop-point",
            "Fixed one end, supported other · point load at a from fixed end"
          ],
          [
            "ss-two",
            "Simply supported · two equal loads at a from each support"
          ],
          [
            "ss-partial",
            "Simply supported · uniform load of length c starting at a"
          ]
        ]
      },
      {
        "key": "load",
        "label": "Load (each point load, or total uniform load)",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Span",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Distance a",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cl",
        "label": "Loaded length c (partial load)",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area",
        "type": "number",
        "default": 8000000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Distance to extreme fibre",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shaft-combined-stress",
    "name": "Round Shaft under Axial Load, Bending and Torsion",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What are the combined stresses in this round shaft or bar, and is it safe against yield?",
    "description": "Direct, bending and torsional stresses in a solid or hollow round shaft carrying axial load, bending moment and torque together, with principal stresses, von Mises and Tresca safety factors.",
    "keywords": [
      "MAKEOS",
      "combined stress",
      "shaft",
      "bending and torsion",
      "axial and torsion",
      "von Mises",
      "round bar"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Outside diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "di",
        "label": "Bore (0 = solid)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Axial force (+ tension, − compression)",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": -10000000000,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "M",
        "label": "Bending moment",
        "type": "number",
        "default": 300,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "principal-stress-3d",
    "name": "Three-Dimensional Principal Stresses",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What are the three principal stresses, maximum shear and von Mises stress for this 3D stress state?",
    "description": "Principal stresses of a general three-dimensional stress state from its six components, by the stress invariants, with maximum shear, von Mises equivalent stress and the safety factor.",
    "keywords": [
      "MAKEOS",
      "3D stress",
      "principal stresses",
      "stress invariants",
      "von Mises",
      "triaxial stress",
      "stress tensor"
    ],
    "fields": [
      {
        "key": "sx",
        "label": "σx",
        "type": "number",
        "default": 80,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sy",
        "label": "σy",
        "type": "number",
        "default": -30,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sz",
        "label": "σz",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "txy",
        "label": "τxy",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tyz",
        "label": "τyz",
        "type": "number",
        "default": 10,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tzx",
        "label": "τzx",
        "type": "number",
        "default": -15,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rankine-column",
    "name": "Column Strength by Rankine–Gordon",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What load will this column carry by the Rankine–Gordon formula?",
    "description": "Crippling load of a column by the Rankine–Gordon formula, which blends crushing and Euler buckling, with the theoretical or an empirical Rankine constant and the safety factor.",
    "keywords": [
      "MAKEOS",
      "Rankine formula",
      "Gordon",
      "column",
      "strut",
      "crippling load",
      "buckling"
    ],
    "fields": [
      {
        "key": "Sc",
        "label": "Crushing (compressive) strength",
        "type": "number",
        "default": 320,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Area",
        "type": "number",
        "default": 1000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Least second moment of area",
        "type": "number",
        "default": 400000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Effective length factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aRank",
        "label": "Rankine constant a (0 = theoretical Sc ÷ π²E)",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Applied load",
        "type": "number",
        "default": 50000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "section-shapes-more",
    "name": "Section Properties: Ellipse, Hexagon, Triangle, Z and Cross",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What are the area, second moments and section moduli of this section?",
    "description": "Area, centroid, second moments of area, section moduli, radii of gyration and polar moment of elliptical, hollow elliptical, half-round, hexagonal, triangular, round-with-hexagon-hole, round-with-square-hole, Z and cross (X) sections.",
    "keywords": [
      "MAKEOS",
      "section properties",
      "ellipse",
      "hexagon",
      "triangle",
      "Z section",
      "cross section",
      "moment of inertia"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Section",
        "type": "select",
        "default": "hex",
        "options": [
          [
            "ellipse",
            "Ellipse (A, B = full axes)"
          ],
          [
            "hellipse",
            "Hollow ellipse (A, B outer; C, D inner axes)"
          ],
          [
            "half",
            "Half circle (A = diameter)"
          ],
          [
            "hex",
            "Hexagon (A = across flats)"
          ],
          [
            "tri",
            "Isosceles triangle (A = base, B = height)"
          ],
          [
            "cirhex",
            "Round with hexagonal hole (A = dia, C = hole across flats)"
          ],
          [
            "cirsq",
            "Round with square hole (A = dia, C = hole side)"
          ],
          [
            "zsec",
            "Z section (A = depth, B = flange width, C = flange t, D = web t)"
          ],
          [
            "cross",
            "Cross / X section (A = height, B = width, C = thickness of both bars)"
          ]
        ]
      },
      {
        "key": "A",
        "label": "Dimension A",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Dimension B",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Dimension C",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Dimension D",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "mass-inertia-more",
    "name": "Mass Moment of Inertia: Cone, Torus, Ellipsoid and Shells",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What is the mass moment of inertia and radius of gyration of this body?",
    "description": "Mass moment of inertia and radius of gyration of a solid cone, hollow sphere, thin spherical shell, torus, ellipsoid, thin ring about a diameter and thin-walled cylinder, with a parallel-axis offset.",
    "keywords": [
      "MAKEOS",
      "mass moment of inertia",
      "radius of gyration",
      "torus",
      "cone",
      "hollow sphere",
      "ellipsoid"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Body and axis",
        "type": "select",
        "default": "torus",
        "options": [
          [
            "cone",
            "Solid cone about its axis (A = base dia)"
          ],
          [
            "conebase",
            "Solid cone about a base diameter (A = base dia, B = height)"
          ],
          [
            "hsphere",
            "Hollow sphere about a diameter (A = outer dia, B = inner dia)"
          ],
          [
            "shell",
            "Thin spherical shell about a diameter (A = dia)"
          ],
          [
            "torus",
            "Torus about its axis (A = centre-line dia, B = tube dia)"
          ],
          [
            "ellipsoid",
            "Ellipsoid about axis A (B, C = the other full axes)"
          ],
          [
            "ring",
            "Thin ring about a diameter (A = dia)"
          ],
          [
            "tube",
            "Thin-walled cylinder about its axis (A = dia)"
          ]
        ]
      },
      {
        "key": "mass",
        "label": "Mass",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Dimension A",
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
        "label": "Dimension B",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Dimension C",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "offset",
        "label": "Parallel axis offset",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "force-system",
    "name": "Resultant of Non-Concurrent and Parallel Forces",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What single force and line of action replaces these forces acting at different points?",
    "description": "Resultant magnitude, direction, moment about the origin and line of action of up to four coplanar forces acting at different points, including parallel forces.",
    "keywords": [
      "MAKEOS",
      "resultant",
      "parallel forces",
      "line of action",
      "moment",
      "force system",
      "statics"
    ],
    "fields": [
      {
        "key": "h_force_1",
        "label": "Force 1",
        "type": "heading"
      },
      {
        "key": "F1",
        "label": "Magnitude",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x1",
        "label": "X of a point on its line",
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
        "label": "Y of that point",
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
        "key": "h_force_2",
        "label": "Force 2",
        "type": "heading"
      },
      {
        "key": "F2",
        "label": "Magnitude",
        "type": "number",
        "default": 1500,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "X of a point on its line",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Y of that point",
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
        "key": "h_force_3",
        "label": "Force 3",
        "type": "heading"
      },
      {
        "key": "F3",
        "label": "Magnitude",
        "type": "number",
        "default": 500,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x3",
        "label": "X of a point on its line",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Y of that point",
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
        "key": "h_force_4",
        "label": "Force 4",
        "type": "heading"
      },
      {
        "key": "F4",
        "label": "Magnitude",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a4",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x4",
        "label": "X of a point on its line",
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
        "key": "y4",
        "label": "Y of that point",
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
    "id": "square-wire-spring",
    "name": "Square-Wire Compression Spring",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What rate, load and stress does this square-wire compression spring have?",
    "description": "Rate, load at working length and torsional stress of a helical compression spring wound from square wire, using the handbook’s square-wire constants.",
    "keywords": [
      "MAKEOS",
      "square wire spring",
      "compression spring",
      "spring rate",
      "die spring",
      "rectangular wire"
    ],
    "fields": [
      {
        "key": "a",
        "label": "Wire side",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Na",
        "label": "Active coils",
        "type": "number",
        "default": 8,
        "unit": "coils",
        "min": 0.5,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L0",
        "label": "Unloaded (free) length",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lw",
        "label": "Working length",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "journal-bearing-petroff",
    "name": "Journal Bearing Friction (Petroff) and Sommerfeld Number",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What friction torque, power loss and Sommerfeld number does this lightly loaded journal bearing have?",
    "description": "Unit load, Petroff friction torque, coefficient of friction and power loss of a hydrodynamic journal bearing, with the Sommerfeld number for use with design charts.",
    "keywords": [
      "MAKEOS",
      "journal bearing",
      "Petroff",
      "Sommerfeld number",
      "hydrodynamic",
      "oil film",
      "bearing friction"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Journal diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Bearing length",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Radial clearance",
        "type": "number",
        "default": 0.04,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Oil viscosity at operating temperature",
        "type": "number",
        "default": 25,
        "unit": "mPa·s (cP)",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Radial load",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "thrust-bearing-pads",
    "name": "Thrust Bearing Pad Unit Load and PV",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What unit load, sliding speed and PV does this pad or washer thrust bearing run at?",
    "description": "Pad area, unit load, mean sliding velocity and PV of a flat-land, tapered-land or tilting-pad thrust bearing (or a thrust washer), against allowable values.",
    "keywords": [
      "MAKEOS",
      "thrust bearing",
      "tilting pad",
      "tapered land",
      "thrust washer",
      "unit load",
      "PV"
    ],
    "fields": [
      {
        "key": "Do",
        "label": "Outside diameter",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Di",
        "label": "Inside diameter",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fill",
        "label": "Pad coverage of the ring",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Thrust load",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pallow",
        "label": "Allowable unit load",
        "type": "number",
        "default": 2,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PVallow",
        "label": "Allowable PV (0 = not checked)",
        "type": "number",
        "default": 0,
        "unit": "MPa·m/s",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gas-compression-process",
    "name": "Gas Compression and Expansion Process",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What final volume, temperature and work result from compressing or expanding this gas?",
    "description": "Final volume and temperature and the work for isothermal, adiabatic or polytropic compression or expansion of a gas between two absolute pressures.",
    "keywords": [
      "MAKEOS",
      "adiabatic compression",
      "isothermal",
      "polytropic",
      "gas work",
      "temperature rise",
      "expansion"
    ],
    "fields": [
      {
        "key": "process",
        "label": "Process",
        "type": "select",
        "default": "adi",
        "options": [
          [
            "iso",
            "Isothermal (n = 1)"
          ],
          [
            "adi",
            "Adiabatic (n = k)"
          ],
          [
            "poly",
            "Polytropic (n as entered)"
          ]
        ]
      },
      {
        "key": "p1",
        "label": "Initial pressure (absolute)",
        "type": "number",
        "default": 1.013,
        "unit": "bar",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V1",
        "label": "Initial volume",
        "type": "number",
        "default": 100,
        "unit": "L",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Initial temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -273,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Final pressure (absolute)",
        "type": "number",
        "default": 8,
        "unit": "bar",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Ratio of specific heats k",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.01,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Polytropic exponent n",
        "type": "number",
        "default": 1.3,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
