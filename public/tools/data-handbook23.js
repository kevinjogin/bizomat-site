// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook23) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "spur-contact-diameters",
    "name": "Spur Gear Contact Diameters, Contact Ratio and LPSTC",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Where does contact start on each gear, what is the contact ratio, and where is the lowest point of single tooth contact?",
    "description": "For two spur gears at standard centre distance: the contact (start of active profile) diameter on each gear, the contact ratio by two independent formulas, the lowest point of single tooth contact (LPSTC) on each gear for contact stress checks, and the maximum hob tip radius for the tooth system.",
    "keywords": [
      "MAKEOS",
      "contact diameter",
      "start of active profile",
      "LPSTC",
      "contact ratio",
      "hob tip radius",
      "spur gear inspection"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Teeth on gear 1 (pinion)",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 6,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Teeth on gear 2",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 6,
        "max": 2000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "phi",
        "label": "Pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "do1",
        "label": "Outside diameter of gear 1 (0 = standard)",
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
        "key": "do2",
        "label": "Outside diameter of gear 2 (0 = standard)",
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
        "key": "bded",
        "label": "Dedendum constant b (dedendum = b × module)",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "clutch-teeth-dividing-head",
    "name": "Dividing-Head Angle for Milling Clutch Teeth",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "At what angle must the dividing head be set to mill these saw-tooth or V-shaped clutch teeth?",
    "description": "Dividing-head (blank inclination) angle for milling saw-tooth clutch teeth with a single-angle cutter or V-shaped teeth with a double-angle cutter so that the tooth tops and bottoms converge to the centre, and the indexing for straight-tooth clutches.",
    "keywords": [
      "MAKEOS",
      "clutch teeth",
      "dividing head",
      "jaw clutch",
      "saw-tooth clutch",
      "V-tooth clutch",
      "milling clutches"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Tooth form",
        "type": "select",
        "default": "single",
        "options": [
          [
            "single",
            "Saw-tooth (single-angle cutter)"
          ],
          [
            "double",
            "V-shaped (double-angle cutter)"
          ],
          [
            "straight",
            "Straight-sided teeth"
          ]
        ]
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 3,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "theta",
        "label": "Cutter angle (single) or included angle (double)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 20,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "silent-chain-sprocket",
    "name": "Silent (Inverted-Tooth) Chain Sprocket Diameters",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What pitch, outside, guide-groove and over-pin diameters does this silent chain sprocket have?",
    "description": "Sprocket diameters for ANSI silent (inverted-tooth) chain of 3/8 in. pitch and larger by the handbook formulas: pitch diameter, outside diameter for round teeth, maximum guide groove diameter, gauge pin diameter and the measurement over pins for even or odd tooth numbers.",
    "keywords": [
      "MAKEOS",
      "silent chain",
      "inverted tooth chain",
      "sprocket diameter",
      "over pin diameter",
      "guide groove",
      "ANSI B29.2"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Chain pitch",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 9.5,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 21,
        "unit": "",
        "min": 13,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "microtool-stiffness",
    "name": "Small Cutter and Drill Stiffness and Deflection",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How much stiffness do I lose by choosing a smaller or longer micro end mill or drill, and how far will it deflect?",
    "description": "Change in torsional stiffness of small end mills and drills when the diameter or flute length changes, using the handbook’s proportionalities (diameter⁴, flute length⁻²), and the bending deflection of the new tool under a radial cutting force as a cantilever with an effective fluted diameter.",
    "keywords": [
      "MAKEOS",
      "micro end mill",
      "tool deflection",
      "tool stiffness",
      "microdrill",
      "flute length",
      "micromachining"
    ],
    "fields": [
      {
        "key": "D1",
        "label": "Original tool diameter",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L1",
        "label": "Original flute length",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D2",
        "label": "New tool diameter",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "New flute length",
        "type": "number",
        "default": 1.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lo",
        "label": "New tool stick-out from the holder",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Effective diameter factor for flutes",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.4,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Tool material modulus",
        "type": "number",
        "default": 600,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Radial cutting force",
        "type": "number",
        "default": 2,
        "unit": "N",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "stockpile-weight",
    "name": "Stockpile Volume and Weight from Angle of Repose",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much material is in a natural pile on this circular or rectangular base?",
    "description": "Volume and weight of bulk material piled naturally to its angle of repose on a circular base (a cone) or a rectangular base (a ridged pile with sloping ends), from the base size, the angle of repose and the bulk density.",
    "keywords": [
      "MAKEOS",
      "stockpile",
      "angle of repose",
      "bulk material",
      "pile volume",
      "cone volume",
      "bin capacity"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Base",
        "type": "select",
        "default": "circle",
        "options": [
          [
            "circle",
            "Circular (cone)"
          ],
          [
            "rect",
            "Rectangular (ridged pile)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Base diameter (circular)",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Base width, shorter side (rectangular)",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Base length, longer side (rectangular)",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Angle of repose",
        "type": "number",
        "default": 35,
        "unit": "°",
        "min": 5,
        "max": 70,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Bulk density",
        "type": "number",
        "default": 1600,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "lumber-board-feet",
    "name": "Lumber Board Feet and Volume",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How many board feet and cubic metres are in this timber order, and what does it cost?",
    "description": "Board feet (feet board measure) and cubic volume of sawn timber from thickness, width, length and quantity, with cost from a price per board foot or per cubic metre, and weight from density.",
    "keywords": [
      "MAKEOS",
      "board feet",
      "board measure",
      "lumber volume",
      "timber quantity",
      "fbm",
      "cubic metres"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Thickness",
        "type": "number",
        "default": 50.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Width",
        "type": "number",
        "default": 152.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length",
        "type": "number",
        "default": 3.048,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Number of pieces",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "pmode",
        "label": "Price given",
        "type": "select",
        "default": "bf",
        "options": [
          [
            "bf",
            "Per board foot"
          ],
          [
            "m3",
            "Per cubic metre"
          ]
        ]
      },
      {
        "key": "price",
        "label": "Price",
        "type": "number",
        "default": 2.5,
        "unit": "$",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Timber density at its moisture content",
        "type": "number",
        "default": 500,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolt-working-strength-packed",
    "name": "Working Strength of Bolts in Packed (Gasketed) Joints",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What external load can this bolt safely carry in a packed joint after allowing for the tightening load?",
    "description": "Empirical working strength of studs and bolts in packed or gasketed joints (where the gasket is more elastic than the bolts) by the handbook’s Cornell formula W = S_t (0.55 d² − 0.25 d), and by the alternative using the thread root area, with the bolt count for a total load.",
    "keywords": [
      "MAKEOS",
      "bolt working strength",
      "packed joint",
      "gasketed joint",
      "cylinder head studs",
      "Cornell formula",
      "bolt load"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal bolt diameter",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ar",
        "label": "Area at the thread root",
        "type": "number",
        "default": 357.8,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "St",
        "label": "Allowable working stress in tension",
        "type": "number",
        "default": 68.95,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "load",
        "label": "Total external load on the joint",
        "type": "number",
        "default": 50,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "press-flywheel-sizing",
    "name": "Punch and Shear Flywheel Sizing",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What motor power and flywheel rim does this punch or shear need for its energy per stroke?",
    "description": "Simplified flywheel design for punches and shears: average motor power from energy per stroke and stroking rate, energy the flywheel must give up during the cut, rim mass for the permitted speed reduction, rim section for a depth-to-width ratio, and the rim hoop stress from its speed.",
    "keywords": [
      "MAKEOS",
      "flywheel",
      "punch press",
      "shear",
      "energy per stroke",
      "rim speed",
      "speed reduction"
    ],
    "fields": [
      {
        "key": "emode",
        "label": "Energy per stroke from",
        "type": "select",
        "default": "force",
        "options": [
          [
            "force",
            "Peak force × working travel"
          ],
          [
            "energy",
            "Entered energy"
          ]
        ]
      },
      {
        "key": "F",
        "label": "Peak force",
        "type": "number",
        "default": 1601.4,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Working travel (e.g. plate thickness)",
        "type": "number",
        "default": 101.6,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Energy per stroke (entered)",
        "type": "number",
        "default": 10,
        "unit": "kJ",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spm",
        "label": "Strokes per minute",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tcut",
        "label": "Time of the actual cut",
        "type": "number",
        "default": 0.75,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dm",
        "label": "Mean rim diameter",
        "type": "number",
        "default": 1.9812,
        "unit": "m",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Flywheel speed",
        "type": "number",
        "default": 200,
        "unit": "rpm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "red",
        "label": "Speed reduction during the cut",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0.5,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Rim material density",
        "type": "number",
        "default": 7200,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Rim depth ÷ width",
        "type": "number",
        "default": 1.22,
        "unit": "",
        "min": 0.2,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ect-cutting-forces",
    "name": "Equivalent Chip Thickness (ECT) and Cutting Forces",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What equivalent chip thickness, removal rate, cutting force and power does this turning cut give?",
    "description": "Equivalent chip thickness from feed, depth of cut and cutting edge length (Woxén–Colding), the metal removal rate, the main cutting force from a specific cutting force, the feed-plane force and its axial and radial components from the chip flow angle, and the power.",
    "keywords": [
      "MAKEOS",
      "equivalent chip thickness",
      "ECT",
      "cutting edge length",
      "cutting force",
      "machining econometrics",
      "chip flow angle"
    ],
    "fields": [
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.8,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Depth of cut",
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
        "key": "CEL",
        "label": "Engaged cutting edge length",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Cutting speed",
        "type": "number",
        "default": 200,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kc",
        "label": "Specific cutting force at this ECT",
        "type": "number",
        "default": 1500,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Feed-plane force ÷ cutting force (F_H ÷ F_C)",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cfa",
        "label": "Chip flow angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "draw-reductions",
    "name": "Deep Drawing Reduction Sequence",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How many draws does this shell need, and what diameter should each draw produce?",
    "description": "Sequence of shell diameters in successive deep drawing operations from the blank diameter, a first-draw ratio and a redraw ratio (each the drawn diameter divided by the previous diameter), the number of draws needed to reach the final diameter, and the reduction percentage at each step.",
    "keywords": [
      "MAKEOS",
      "deep drawing",
      "draw ratio",
      "redraw",
      "number of draws",
      "drawing sequence",
      "cup drawing"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Blank diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Final shell diameter",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m1",
        "label": "First draw ratio (d₁ ÷ D)",
        "type": "number",
        "default": 0.55,
        "unit": "",
        "min": 0.3,
        "max": 0.95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mr",
        "label": "Redraw ratio (dₙ ÷ dₙ₋₁)",
        "type": "number",
        "default": 0.75,
        "unit": "",
        "min": 0.4,
        "max": 0.98,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
