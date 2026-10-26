// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook53) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "porter-governor-check",
    "name": "Porter Governor Check (Heights, Sleeve Travel, Ball Radius, Centrifugal Force)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Over its control range, how far does this loaded fly-ball governor’s sleeve move, where do the balls run, and what centrifugal force do they carry?",
    "description": "Check of a loaded (Porter) or simple fly-ball governor with equal arms pivoted on the spindle axis: governor height at the working speed and the ends of the control range, sleeve height change and coefficient of speed variation (as the fly-ball governor tool), the ball radius from the arm length and height, and the centrifugal force on each ball at that radius (as the centrifugal force tool), checked against the sleeve travel you need and the largest speed variation you accept.",
    "keywords": [
      "MAKEOS",
      "governor",
      "fly-ball governor",
      "Porter governor",
      "sleeve travel",
      "centrifugal force",
      "speed control"
    ],
    "fields": [
      {
        "key": "w",
        "label": "Mass of one ball",
        "type": "number",
        "default": 2,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Central load (0 = simple governor)",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Governor speed",
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
        "key": "nmin",
        "label": "Minimum speed of the control range",
        "type": "number",
        "default": 190,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmax",
        "label": "Maximum speed of the control range",
        "type": "number",
        "default": 210,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "La",
        "label": "Arm length (pivot to ball centre)",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_requirements",
        "label": "Requirements",
        "type": "heading"
      },
      {
        "key": "travel",
        "label": "Least sleeve travel over the range",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cmax",
        "label": "Largest coefficient of speed variation",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0.001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "overhang-beam-uplift-check",
    "name": "Overhang Beam with Tip Load (Uplift, Anchor Bolts, Tip Deflection)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a beam on two supports with a load out on an overhang, how hard does the back support have to hold the beam down, are the anchor bolts enough, and how far does the tip drop?",
    "description": "Check of a beam on two supports with a point load at the tip of an overhang (a runway extension, a jib on a frame, a cantilevered platform beam): the reactions, including the uplift at the back support, the moment over the front support, bending stress and tip deflection (as the overhanging beam tool), the tension per anchor bolt at the back support, and checks against the allowable stress, bolt capacity, front support capacity and tip deflection limit.",
    "keywords": [
      "MAKEOS",
      "overhanging beam",
      "uplift",
      "anchor bolts",
      "tip deflection",
      "cantilever",
      "hold-down"
    ],
    "fields": [
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
        "key": "P",
        "label": "Point load at the tip",
        "type": "number",
        "default": 4000,
        "unit": "N",
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
      },
      {
        "key": "h_supports",
        "label": "Supports",
        "type": "heading"
      },
      {
        "key": "nb",
        "label": "Anchor bolts at the back support",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Tbolt",
        "label": "Allowable tension per bolt",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rmax",
        "label": "Capacity of the front support",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dRatio",
        "label": "Tip deflection limit (overhang ÷ …)",
        "type": "number",
        "default": 150,
        "unit": "",
        "min": 20,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "beam-drop-impact-check",
    "name": "Beam Drop Impact Check (I-Section Properties, Impact Factor, Dynamic Stress)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "If a load drops onto this I-beam, what impact factor, dynamic stress and deflection result, and is the section strong enough?",
    "description": "Check of a fabricated or rolled I-section beam struck by a falling load: area, mass per metre, second moment and section modulus of the I-section from its flange and web sizes (as the section properties tool), then the static deflection and stress, the impact factor from the drop height and the dynamic stress and deflection for a simply supported or cantilever beam (as the impact load on a beam tool), against your allowable stress and deflection limit.",
    "keywords": [
      "MAKEOS",
      "impact load",
      "drop",
      "I-beam",
      "impact factor",
      "dynamic stress",
      "falling load"
    ],
    "fields": [
      {
        "key": "h_section_i_or_h_",
        "label": "Section (I or H)",
        "type": "heading"
      },
      {
        "key": "Hs",
        "label": "Overall depth",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Flange width",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tf",
        "label": "Flange thickness",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tw",
        "label": "Web thickness",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 50000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_impact",
        "label": "Impact",
        "type": "heading"
      },
      {
        "key": "support",
        "label": "Support",
        "type": "select",
        "default": "ss",
        "options": [
          [
            "ss",
            "Simply supported, load at mid-span"
          ],
          [
            "cant",
            "Cantilever, load at the tip"
          ]
        ]
      },
      {
        "key": "mass",
        "label": "Falling mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Drop height above the beam",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Span (or cantilever length)",
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
        "key": "allow",
        "label": "Allowable stress",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMax",
        "label": "Largest dynamic deflection",
        "type": "number",
        "default": 20,
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
    "id": "silent-chain-drive-check",
    "name": "Silent Chain Drive Check (Sprocket Diameters, Chain Length, Speed, Wrap)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For this inverted-tooth (silent) chain drive, what are the sprocket diameters, how many links do I order, what centre distance results, and are the chain speed and wrap acceptable?",
    "description": "Layout check of a silent (inverted-tooth) chain drive: pitch, outside and guide-groove diameters and the over-pin gauge for both sprockets (as the silent chain sprocket tool), chain length in pitches rounded to an even number of links, the exact centre distance for that length, chain speed and wrap on the small sprocket (as the chain length tool), the ratio and driven speed, checked against your chain speed limit, least small-sprocket teeth and least wrap.",
    "keywords": [
      "MAKEOS",
      "silent chain",
      "inverted tooth chain",
      "sprocket diameter",
      "chain length",
      "centre distance",
      "chain drive"
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
        "key": "z1",
        "label": "Small sprocket teeth",
        "type": "number",
        "default": 21,
        "unit": "",
        "min": 13,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Large sprocket teeth",
        "type": "number",
        "default": 42,
        "unit": "",
        "min": 13,
        "max": 400,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C",
        "label": "Approximate centre distance",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Small sprocket speed",
        "type": "number",
        "default": 1200,
        "unit": "rpm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits",
        "label": "Limits",
        "type": "heading"
      },
      {
        "key": "vMax",
        "label": "Largest chain speed",
        "type": "number",
        "default": 15,
        "unit": "m/s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zMin",
        "label": "Least small-sprocket teeth",
        "type": "number",
        "default": 21,
        "unit": "",
        "min": 13,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "wrapMin",
        "label": "Least wrap on the small sprocket",
        "type": "number",
        "default": 120,
        "unit": "°",
        "min": 60,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "jaw-clutch-milling-setup",
    "name": "Jaw Clutch Milling Set-up (Dividing-Head Angle and Indexing)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "To mill the teeth of this jaw clutch on a dividing head, at what angle do I tilt the head, and what index setting moves from one tooth to the next?",
    "description": "Set-up for milling saw-tooth, V-shaped or straight-sided jaw clutch teeth: the angle to tilt the dividing head so a single- or double-angle cutter forms the tooth faces (as the clutch teeth dividing-head tool), the angle between teeth and the simple indexing setting for the tooth count (as the simple indexing tool), with notes for odd and even tooth counts.",
    "keywords": [
      "MAKEOS",
      "jaw clutch",
      "clutch teeth",
      "dividing head",
      "indexing",
      "saw-tooth clutch",
      "milling set-up"
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
      },
      {
        "key": "ratio",
        "label": "Dividing head worm ratio",
        "type": "number",
        "default": 40,
        "unit": ":1",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plates",
        "label": "Index plates available",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe plates 1–3"
          ],
          [
            "cin",
            "Cincinnati standard plate (both sides)"
          ]
        ]
      }
    ]
  },
  {
    "id": "snatch-block-load-check",
    "name": "Snatch Block and Anchor Load Check (Rope Angle, Resultant, Ratings)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "When my winch rope turns through a snatch block, what load does the block and its anchor take at this rope angle, and are the block, anchor and rope rated for it?",
    "description": "Check of a snatch (diverting) block in a rope pull: the resultant of the two rope legs on the block from the line pull and the included angle between the legs (as the resultant of concurrent forces tool), the angle factor, the direction of the resultant, and checks of the block working load, the anchor capacity and the rope’s design factor on its minimum breaking load.",
    "keywords": [
      "MAKEOS",
      "snatch block",
      "rigging",
      "anchor load",
      "rope angle",
      "winch",
      "diverting sheave"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Line pull in the rope",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Included angle between the rope legs",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 0,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_ratings",
        "label": "Ratings",
        "type": "heading"
      },
      {
        "key": "WLLb",
        "label": "Snatch block working load limit",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "anchor",
        "label": "Anchor capacity",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "MBL",
        "label": "Rope minimum breaking load",
        "type": "number",
        "default": 60,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "DF",
        "label": "Required rope design factor",
        "type": "number",
        "default": 5,
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
    "id": "crossed-belt-drive-check",
    "name": "Crossed Flat Belt Drive Check (Length, Wrap, Tensions, Speed)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For this crossed (reversing) flat belt drive, how long is the belt, how much wrap does it get, and what tight-side tension does it need to carry the power without slipping?",
    "description": "Check of a crossed flat or round belt drive, which reverses the driven pulley: belt length and wrap on each pulley compared with an open drive (as the crossed belt length tool), belt speed, the effective pull for the power, the tension ratio at the point of slip from the friction and wrap (as the belt friction tool), the tight and slack side tensions with centrifugal tension added, checked against the belt’s allowable tension and speed.",
    "keywords": [
      "MAKEOS",
      "crossed belt",
      "flat belt",
      "reversing drive",
      "belt tension",
      "wrap angle",
      "belt friction"
    ],
    "fields": [
      {
        "key": "D1",
        "label": "Driving pulley diameter",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D2",
        "label": "Driven pulley diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 2,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Driving pulley speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Belt friction coefficient",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.05,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mb",
        "label": "Belt mass per metre",
        "type": "number",
        "default": 0.3,
        "unit": "kg/m",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits",
        "label": "Limits",
        "type": "heading"
      },
      {
        "key": "Tallow",
        "label": "Allowable belt tension",
        "type": "number",
        "default": 1500,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vMax",
        "label": "Largest belt speed",
        "type": "number",
        "default": 30,
        "unit": "m/s",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "square-round-spring-compare",
    "name": "Square versus Round Wire Spring Comparison (Rate, Load, Stress, Solid Length)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "In the same space, would a square-wire or a round-wire compression spring of the same size give me the load I need within stress?",
    "description": "Side-by-side check of two compression springs with the same coil diameter, active coils, free and working lengths: one wound from square wire of side a (as the square-wire spring tool) and one from round wire of diameter a (as the compression spring tool) — rate, load at the working length, corrected stress, solid length — and which of them gives the load you need within the allowable stress.",
    "keywords": [
      "MAKEOS",
      "square wire spring",
      "compression spring",
      "spring comparison",
      "spring rate",
      "die spring",
      "spring stress"
    ],
    "fields": [
      {
        "key": "a",
        "label": "Wire size (square side or round diameter)",
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
        "label": "Unloaded length",
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
      },
      {
        "key": "need",
        "label": "Load needed at the working length",
        "type": "number",
        "default": 200,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "crossed-helical-drive-check",
    "name": "Crossed Helical Gear Drive Check (Proportions, Sliding Velocity, Forces)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For this pair of crossed helical gears on shafts at right angles, what are the diameters and centre distance, how fast do the teeth slide, and what forces act on the shafts?",
    "description": "Check of crossed helical (spiral) gears on shafts at 90°: pitch and outside diameters, centre distance and leads for the normal diametral pitch and helix angles (as the crossed helical gears tool), pitch-line velocities, the sliding velocity between the teeth, the pinion tangential force from the power and the gear tangential (pinion axial) force, checked against your sliding velocity limit.",
    "keywords": [
      "MAKEOS",
      "crossed helical gears",
      "spiral gears",
      "skew gears",
      "sliding velocity",
      "right-angle drive",
      "helix angle"
    ],
    "fields": [
      {
        "key": "Pn",
        "label": "Normal diametral pitch",
        "type": "number",
        "default": 8,
        "unit": "1/in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 5,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Nt",
        "label": "Gear teeth",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 5,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "psi",
        "label": "Gear helix angle (pinion = 90° − this)",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 5,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 0.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Pinion speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vsMax",
        "label": "Largest sliding velocity",
        "type": "number",
        "default": 5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
