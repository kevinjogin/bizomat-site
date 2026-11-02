// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook82) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "gear-pitting-geometry-factor",
    "name": "Gear Pitting Geometry Factor I (Spur and Helical, Contact Ratios, Load Sharing)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For my external spur or helical gear pair, what pitting resistance geometry factor I does the AGMA method give, with the contact ratios and load sharing behind it, and does it support the value used in my rating?",
    "description": "Pitting resistance geometry factor I for an external spur or helical gear pair by the AGMA 908-B89 equations the handbook gives: standard and operating transverse pressure angles, base radii and base pitches, the distances along the line of action to the lowest and highest points of single tooth contact, the transverse and axial contact ratios, the minimum length of the lines of contact and the load sharing ratio for helical gears, the helical overlap factor for low axial contact ratio helicals, the radii of curvature of the profiles at the stress point and the factor I, compared with the value used in your rating.",
    "keywords": [
      "MAKEOS",
      "geometry factor I",
      "AGMA 908",
      "pitting resistance",
      "contact ratio",
      "load sharing ratio",
      "helical overlap factor",
      "LPSTC"
    ],
    "fields": [
      {
        "key": "h_gear_pair",
        "label": "Gear pair",
        "type": "heading"
      },
      {
        "key": "mn",
        "label": "Normal module",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 21,
        "unit": "",
        "min": 6,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "n2",
        "label": "Gear teeth",
        "type": "number",
        "default": 55,
        "unit": "",
        "min": 6,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "phin",
        "label": "Normal pressure angle",
        "type": "number",
        "default": 25,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "psi",
        "label": "Helix angle (0 for spur)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Effective face width",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_as_made",
        "label": "As made",
        "type": "heading"
      },
      {
        "key": "Cr",
        "label": "Operating centre distance",
        "type": "number",
        "default": 152,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "do1",
        "label": "Pinion outside diameter",
        "type": "number",
        "default": 92,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "do2",
        "label": "Gear outside diameter",
        "type": "number",
        "default": 228,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_rating",
        "label": "Rating",
        "type": "heading"
      },
      {
        "key": "Iused",
        "label": "Geometry factor I used in the rating",
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
    "id": "fine-pitch-worm-design",
    "name": "Fine-Pitch Worm and Wormgear Design (ANSI B6.9 Proportions, Centre Distance, Face Width, Thread Length)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For a fine-pitch worm and wormgear, what are the diameters, tooth proportions, centre distance, face width and threaded length, how many threads or what lead angle hits my centre distance, and is the worm diameter in range?",
    "description": "Proportions of a fine-pitch worm and wormgear by the American Standard (ANSI B6.9-1977) formulas the handbook gives: lead, worm and wormgear pitch diameters and centre distance from the axial pitch, lead angle, threads and teeth; normal pitch, addendum, whole and working depth, clearance and tooth thickness from the normal pitch; worm and wormgear outside diameters, minimum wormgear face width and the safe minimum threaded length of the worm; the approximate number of threads and the lead angle that give your target centre distance; and checks of the centre distance and worm pitch diameter against your limits.",
    "keywords": [
      "MAKEOS",
      "worm gear",
      "fine pitch",
      "ANSI B6.9",
      "lead angle",
      "axial pitch",
      "centre distance",
      "wormgear face width"
    ],
    "fields": [
      {
        "key": "h_worm_and_wormgear",
        "label": "Worm and wormgear",
        "type": "heading"
      },
      {
        "key": "Px",
        "label": "Axial pitch of the worm",
        "type": "number",
        "default": 4.064,
        "unit": "mm",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lam",
        "label": "Lead angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0.1,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads (starts) on the worm",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "N",
        "label": "Teeth on the wormgear",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": 4,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_targets_and_limits",
        "label": "Targets and limits",
        "type": "heading"
      },
      {
        "key": "Ct",
        "label": "Target centre distance",
        "type": "number",
        "default": 76.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ctol",
        "label": "Accepted centre distance difference",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dmin",
        "label": "Smallest worm pitch diameter accepted",
        "type": "number",
        "default": 6.35,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dmax",
        "label": "Largest worm pitch diameter accepted",
        "type": "number",
        "default": 50.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "internal-gear-pin-measurement",
    "name": "Internal Gear Measurement Between Pins (Even or Odd Teeth, Backlash Allowance, Space Width from a Reading)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What should the measurement between two pins be for my internal spur gear, at the low and high limits of its backlash allowance, and does a reading I have taken fall inside them?",
    "description": "Measurement between two pins (or wires) for an internal spur gear with even or odd teeth by the involute function: the pin centre pressure angle from the space width at the pitch circle, the pin centre radius and the dimension between the pins for the standard space width and for the smallest and largest space-width increases allowed for backlash; the space width a measured reading implies; and the diameter at which the pins touch the flanks, checked against the inside and root diameters.",
    "keywords": [
      "MAKEOS",
      "internal gear",
      "measurement between pins",
      "measurement between wires",
      "Van Keuren",
      "space width",
      "involute function",
      "gear inspection"
    ],
    "fields": [
      {
        "key": "h_gear",
        "label": "Gear",
        "type": "heading"
      },
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Number of teeth",
        "type": "number",
        "default": 60,
        "unit": "",
        "min": 7,
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
        "key": "Di",
        "label": "Inside (tip) diameter of the internal gear",
        "type": "number",
        "default": 116,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dr",
        "label": "Root diameter of the internal gear",
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
        "key": "h_pins_and_limits",
        "label": "Pins and limits",
        "type": "heading"
      },
      {
        "key": "dp",
        "label": "Pin diameter",
        "type": "number",
        "default": 2.88,
        "unit": "mm",
        "min": 0.01,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eMin",
        "label": "Smallest space-width increase for backlash",
        "type": "number",
        "default": 0.04,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eMax",
        "label": "Largest space-width increase for backlash",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mmeas",
        "label": "Measured dimension between the pins",
        "type": "number",
        "default": 117.5,
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
    "id": "wire-rope-sheave-drum-check",
    "name": "Wire Rope on Sheaves and Drums (Radial Pressure, Bending Stress and Load, Drum Capacity)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a wire rope running over a sheave and onto a drum, is the radial pressure within the sheave material's limit, how much does bending add to the rope load, what factor remains against breaking, and will the drum hold the rope I need?",
    "description": "Check of a wire rope on its sheaves and drum by the handbook formulas: the radial pressure the rope exerts on the sheave tread from the tension, tread diameter and rope diameter against the allowable pressure for the sheave material; the bending stress in the outer wires from the rope modulus, wire diameter and sheave diameter, the rope's metal area and the equivalent bending load that adds to the direct tension; the factor of the rope's minimum breaking force over the tension plus bending load; and the length of rope a flanged drum or reel holds from its barrel, flange and width and the rope factor K.",
    "keywords": [
      "MAKEOS",
      "wire rope",
      "sheave",
      "drum capacity",
      "radial pressure",
      "bending stress",
      "tread pressure",
      "reel capacity"
    ],
    "fields": [
      {
        "key": "h_rope",
        "label": "Rope",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Rope diameter",
        "type": "number",
        "default": 14.2875,
        "unit": "mm",
        "min": 0.5,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kw",
        "label": "Outer wire diameter as a share of rope diameter",
        "type": "number",
        "default": 0.063,
        "unit": "",
        "min": 0.005,
        "max": 0.3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qa",
        "label": "Metal area factor Q (area = Q d²)",
        "type": "number",
        "default": 0.405,
        "unit": "",
        "min": 0.1,
        "max": 0.8,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Rope modulus of elasticity",
        "type": "number",
        "default": 82700,
        "unit": "MPa",
        "min": 1000,
        "max": 300000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Rope tension",
        "type": "number",
        "default": 12000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "MBF",
        "label": "Rope minimum breaking force",
        "type": "number",
        "default": 150,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SFreq",
        "label": "Least factor required against breaking",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_sheave",
        "label": "Sheave",
        "type": "heading"
      },
      {
        "key": "Ds",
        "label": "Sheave tread (pitch) diameter",
        "type": "number",
        "default": 609.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pAllow",
        "label": "Allowable radial pressure for the sheave material",
        "type": "number",
        "default": 3.4,
        "unit": "MPa",
        "min": 0.01,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_drum",
        "label": "Drum",
        "type": "heading"
      },
      {
        "key": "Dd",
        "label": "Drum barrel diameter",
        "type": "number",
        "default": 457.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hf",
        "label": "Drum flange diameter",
        "type": "number",
        "default": 762,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Width between flanges",
        "type": "number",
        "default": 609.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Depth left unfilled below the flange rim",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Rope factor K for this rope size (handbook Table 8)",
        "type": "number",
        "default": 0.741,
        "unit": "ft/in³",
        "min": 0.001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lreq",
        "label": "Rope length the drum must hold",
        "type": "number",
        "default": 600,
        "unit": "m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shock-stress-check",
    "name": "Shock Stress in Beams and Springs (Dropped Weight or Moving Body, Impact Factor, Allowable)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "If a weight drops onto my beam or spring, or a moving body runs into it, what peak stress does the shock produce and is it within my allowable stress?",
    "description": "Stress produced by a shock load by the handbook formulas: a weight dropped through a height onto a simply supported beam at its centre, a cantilever at its free end, a beam fixed at both ends at its centre, or a helical spring of round or square wire; the static stress and deflection under the weight, the stress from the full formula p = p_s(1 + √(1 + 2h ÷ y)) and the approximate value for large drops; or, for a body moving horizontally, the approximate stress with its kinetic energy in place of weight × height; checked against your allowable stress.",
    "keywords": [
      "MAKEOS",
      "shock load",
      "impact stress",
      "dropped weight",
      "impact factor",
      "spring shock",
      "falling load",
      "kinetic energy"
    ],
    "fields": [
      {
        "key": "member",
        "label": "Member struck",
        "type": "select",
        "default": "ss",
        "options": [
          [
            "ss",
            "Beam, simply supported, struck at the centre"
          ],
          [
            "cant",
            "Beam, cantilever, struck at the free end"
          ],
          [
            "fixed",
            "Beam, fixed at both ends, struck at the centre"
          ],
          [
            "round",
            "Helical spring, round wire"
          ],
          [
            "square",
            "Helical spring, square wire"
          ]
        ]
      },
      {
        "key": "load",
        "label": "Shock",
        "type": "select",
        "default": "drop",
        "options": [
          [
            "drop",
            "Weight dropped through a height"
          ],
          [
            "move",
            "Body moving horizontally into the member"
          ]
        ]
      },
      {
        "key": "h_beam",
        "label": "Beam",
        "type": "heading"
      },
      {
        "key": "L",
        "label": "Span (cantilever length)",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area",
        "type": "number",
        "default": 8330000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Distance from neutral axis to extreme fibre",
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
        "key": "E",
        "label": "Modulus of elasticity",
        "type": "number",
        "default": 200000,
        "unit": "MPa",
        "min": 100,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_spring",
        "label": "Spring",
        "type": "heading"
      },
      {
        "key": "Dm",
        "label": "Mean coil diameter",
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
        "key": "dw",
        "label": "Wire diameter (side of square wire)",
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
        "key": "n",
        "label": "Active coils",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": 0.5,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79300,
        "unit": "MPa",
        "min": 100,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "M",
        "label": "Mass of the falling or moving body",
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
        "label": "Drop height before striking",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vel",
        "label": "Speed of the moving body",
        "type": "number",
        "default": 1,
        "unit": "m/s",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sallow",
        "label": "Allowable stress",
        "type": "number",
        "default": 300,
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
    "id": "thin-ring-load-check",
    "name": "Thin Ring Loaded Across a Diameter (Bending Stress, Diameter Changes, Safe Load)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "When two opposite forces squeeze or pull my thin ring across a diameter, what is the bending stress, how much do the diameters change, and what load can it take at my allowable stress?",
    "description": "Stresses and deflections of a thin ring loaded by two equal and opposite forces across a diameter, by the handbook formulas: the maximum bending stress S = P D d ÷ (4π I) at the load points for a round, rectangular or other section, the increase of the diameter along the load and the decrease across it, the load that brings the stress to your allowable value, and checks of the stress and diameter change against your limits.",
    "keywords": [
      "MAKEOS",
      "thin ring",
      "ring under diametral load",
      "ring bending stress",
      "chain link",
      "ring deflection",
      "loaded ring"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Ring section",
        "type": "select",
        "default": "round",
        "options": [
          [
            "round",
            "Round bar"
          ],
          [
            "rect",
            "Rectangular bar"
          ],
          [
            "user",
            "Other section (enter I and depth)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Mean diameter of the ring",
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
        "key": "d",
        "label": "Bar diameter or radial depth of the section",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Axial width (rectangular bar)",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Iu",
        "label": "Second moment of area (other section)",
        "type": "number",
        "default": 7854,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Modulus of elasticity",
        "type": "number",
        "default": 200000,
        "unit": "MPa",
        "min": 100,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Load on the ring (each of the two opposite forces)",
        "type": "number",
        "default": 3000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sallow",
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
        "key": "dMax",
        "label": "Largest change of diameter accepted",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
