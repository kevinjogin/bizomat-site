// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook12) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "nose-radius-compensation",
    "name": "Tool Nose Radius Compensation for Tapers",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How far must the programmed taper line move to allow for the insert nose radius?",
    "description": "Compensation along Z and X for programming a taper or chamfer with the imaginary tool tip of a radiused insert, and the profile error if no compensation is applied.",
    "keywords": [
      "MAKEOS",
      "nose radius compensation",
      "tool tip radius",
      "chamfer",
      "taper",
      "CNC lathe",
      "G41 G42"
    ],
    "fields": [
      {
        "key": "r",
        "label": "Insert nose radius",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Taper angle from the Z axis",
        "type": "number",
        "default": 45,
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
    "id": "feed-for-finish",
    "name": "Turning Feed for Surface Finish (Ra)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What surface finish does this feed and nose radius give, or what feed achieves the target Ra?",
    "description": "Theoretical arithmetic-mean roughness Ra and peak-to-valley Rt in turning from feed and tool nose radius, or the feed for a target Ra.",
    "keywords": [
      "MAKEOS",
      "surface finish",
      "Ra",
      "feed rate",
      "nose radius",
      "roughness",
      "turning finish"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "feed",
        "options": [
          [
            "ra",
            "Ra from feed"
          ],
          [
            "feed",
            "Feed for a target Ra"
          ]
        ]
      },
      {
        "key": "R",
        "label": "Tool nose radius",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.15,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ra",
        "label": "Target Ra",
        "type": "number",
        "default": 1,
        "unit": "µm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "inch-speeds-feeds",
    "name": "Speeds and Feeds in Inch Units",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What spindle speed and feed rate follow from this SFM and chip load?",
    "description": "Spindle speed from surface feet per minute and diameter, and feed rate from inches per tooth (or per revolution), with metric equivalents.",
    "keywords": [
      "MAKEOS",
      "SFM",
      "RPM",
      "IPM",
      "IPT",
      "chip load",
      "inch speeds and feeds"
    ],
    "fields": [
      {
        "key": "sfm",
        "label": "Surface speed",
        "type": "number",
        "default": 400,
        "unit": "ft/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Cutter or work diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "teeth",
        "label": "Number of teeth (1 for turning or drilling per rev)",
        "type": "number",
        "default": 4,
        "unit": "teeth",
        "min": 1,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "ipt",
        "label": "Feed per tooth (or per rev)",
        "type": "number",
        "default": 0.002,
        "unit": "in",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "knurl-blank",
    "name": "Knurling Blank Diameter for Tracking",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What blank diameter lets this knurl track cleanly with a whole number of teeth?",
    "description": "Number of teeth produced on a blank for a diametral-pitch (inch) or circular-pitch (metric) knurl, and the nearest blank diameters that give a whole number of teeth for clean tracking.",
    "keywords": [
      "MAKEOS",
      "knurling",
      "knurl",
      "blank diameter",
      "tracking",
      "diametral pitch knurl",
      "circular pitch"
    ],
    "fields": [
      {
        "key": "system",
        "label": "Knurl system",
        "type": "select",
        "default": "dp",
        "options": [
          [
            "dp",
            "Diametral pitch (inch)"
          ],
          [
            "cp",
            "Circular pitch (metric)"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Diametral pitch (teeth per inch of diameter)",
        "type": "number",
        "default": 96,
        "unit": "1/in",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Circular pitch",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Planned blank diameter",
        "type": "number",
        "default": 0.75,
        "unit": "in or mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bandsaw-time",
    "name": "Band Saw Cutting Time",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long does each cut take on the band saw, and how many cuts per hour?",
    "description": "Cross-section area, cutting time per cut from the blade maker’s cutting rate, and output per hour including handling time, for round, rectangular and tube sections.",
    "keywords": [
      "MAKEOS",
      "band saw",
      "cutting time",
      "cutting rate",
      "sawing",
      "cut-off",
      "cm² per minute"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Section",
        "type": "select",
        "default": "round",
        "options": [
          [
            "round",
            "Round bar"
          ],
          [
            "rect",
            "Rectangular or flat bar"
          ],
          [
            "tube",
            "Round tube"
          ]
        ]
      },
      {
        "key": "a",
        "label": "Diameter or width",
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
        "key": "b",
        "label": "Height (rectangular) or wall (tube)",
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
        "key": "rate",
        "label": "Cutting rate",
        "type": "number",
        "default": 40,
        "unit": "cm²/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "handle",
        "label": "Handling and approach time per cut",
        "type": "number",
        "default": 30,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "centerless-feed",
    "name": "Centerless Grinding Through-Feed Rate",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How fast do parts pass through this centerless grinder, and how many per minute?",
    "description": "Axial through-feed rate of a centerless grinder from the regulating wheel diameter, speed and inclination angle, with work rotation speed and parts per minute.",
    "keywords": [
      "MAKEOS",
      "centerless grinding",
      "through-feed",
      "regulating wheel",
      "inclination angle",
      "production rate"
    ],
    "fields": [
      {
        "key": "Dr",
        "label": "Regulating wheel diameter",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nr",
        "label": "Regulating wheel speed",
        "type": "number",
        "default": 40,
        "unit": "rpm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Regulating wheel inclination",
        "type": "number",
        "default": 3,
        "unit": "°",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dw",
        "label": "Work diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Part length",
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
        "key": "gap",
        "label": "Gap between parts",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "slip",
        "label": "Feed efficiency (slip allowance)",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "refractometer-concentration",
    "name": "Coolant Concentration from Refractometer",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What is the coolant concentration from this refractometer reading, and what should be added to correct it?",
    "description": "Coolant concentration from a Brix refractometer reading and the coolant’s refractometer factor, and the volume of concentrate or water to add to reach the target.",
    "keywords": [
      "MAKEOS",
      "coolant concentration",
      "refractometer",
      "Brix",
      "cutting fluid",
      "sump",
      "coolant management"
    ],
    "fields": [
      {
        "key": "brix",
        "label": "Refractometer reading",
        "type": "number",
        "default": 4,
        "unit": "°Brix",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "factor",
        "label": "Refractometer factor of the coolant",
        "type": "number",
        "default": 1.6,
        "unit": "",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "target",
        "label": "Target concentration",
        "type": "number",
        "default": 7,
        "unit": "%",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "volume",
        "label": "Sump volume",
        "type": "number",
        "default": 400,
        "unit": "L",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bending-springback",
    "name": "Sheet Metal Bending Springback",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much will this bend spring back, and how far must it be overbent?",
    "description": "Final bend radius and angle after springback for sheet metal from the tool radius, thickness, yield strength and modulus, with the springback factor and overbend angle.",
    "keywords": [
      "MAKEOS",
      "springback",
      "press brake",
      "overbend",
      "bend radius",
      "sheet metal",
      "air bending"
    ],
    "fields": [
      {
        "key": "Ri",
        "label": "Bend radius before release (tool radius)",
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
        "key": "t",
        "label": "Thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "YS",
        "label": "Yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
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
        "key": "angle",
        "label": "Required final bend angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tube-bend-thinning",
    "name": "Tube Bending Wall Thinning",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much will the tube wall thin on the outside of this bend, and thicken on the inside?",
    "description": "Approximate outer wall thinning and inner wall thickening of a tube bent to a centreline radius, with the bend ratio and wall factor used to judge bendability.",
    "keywords": [
      "MAKEOS",
      "tube bending",
      "wall thinning",
      "bend radius",
      "pipe bending",
      "D/t ratio",
      "mandrel"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Tube outside diameter",
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
        "key": "t",
        "label": "Wall thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Centreline bend radius",
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
        "key": "tmin",
        "label": "Minimum wall required (0 = not set)",
        "type": "number",
        "default": 1.6,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "weld-cost",
    "name": "Fillet Weld Cost per Metre",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What does this fillet weld cost per metre in labour, filler and gas?",
    "description": "Weld metal mass, arc time, labour, filler metal and shielding gas cost per metre of fillet weld from leg size, deposition rate, operating factor and prices.",
    "keywords": [
      "MAKEOS",
      "welding cost",
      "cost per metre",
      "deposition rate",
      "operating factor",
      "filler metal",
      "shielding gas"
    ],
    "fields": [
      {
        "key": "leg",
        "label": "Fillet leg size",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "excess",
        "label": "Excess weld (reinforcement and overwelding)",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Weld metal density",
        "type": "number",
        "default": 7.85,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dep",
        "label": "Deposition rate",
        "type": "number",
        "default": 3,
        "unit": "kg/h",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "of",
        "label": "Operating factor (arc-on share)",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Deposition efficiency",
        "type": "number",
        "default": 92,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Labour and overhead rate",
        "type": "number",
        "default": 95,
        "unit": "AUD/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wire",
        "label": "Filler price",
        "type": "number",
        "default": 6,
        "unit": "AUD/kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gasFlow",
        "label": "Gas flow (0 for no gas)",
        "type": "number",
        "default": 15,
        "unit": "L/min",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gasPrice",
        "label": "Gas price",
        "type": "number",
        "default": 12,
        "unit": "AUD/m³",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "lap-joint-length",
    "name": "Lap Joint Overlap (Brazed, Soldered or Bonded)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much overlap does this brazed, soldered or bonded lap joint need?",
    "description": "Overlap length for a lap or sleeve joint so the joint’s shear capacity matches or exceeds the strength of the thinner member, and the capacity at a chosen overlap.",
    "keywords": [
      "MAKEOS",
      "lap joint",
      "brazing",
      "soldering",
      "adhesive bonding",
      "overlap length",
      "shear strength"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Thickness of the thinner member",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Joint width (or circumference for tubes)",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sm",
        "label": "Strength of the member",
        "type": "number",
        "default": 210,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Shear strength of the joint material",
        "type": "number",
        "default": 70,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "factor",
        "label": "Joint strength ÷ member strength wanted",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Overlap used",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "load",
        "label": "Applied load (0 = not set)",
        "type": "number",
        "default": 0,
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
    "id": "coating-coverage",
    "name": "Paint and Powder Coating Coverage",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much paint or powder is needed to coat this area at the specified film thickness?",
    "description": "Theoretical and practical coverage, material quantity and cost for liquid paint (from volume solids) or powder coating (from density) at a dry film thickness and transfer efficiency.",
    "keywords": [
      "MAKEOS",
      "paint coverage",
      "powder coating",
      "dry film thickness",
      "volume solids",
      "transfer efficiency",
      "coating cost"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Coating",
        "type": "select",
        "default": "liquid",
        "options": [
          [
            "liquid",
            "Liquid paint (litres)"
          ],
          [
            "powder",
            "Powder coating (kilograms)"
          ]
        ]
      },
      {
        "key": "area",
        "label": "Area to coat",
        "type": "number",
        "default": 50,
        "unit": "m²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dft",
        "label": "Dry film thickness",
        "type": "number",
        "default": 75,
        "unit": "µm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vs",
        "label": "Volume solids (liquid)",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "density",
        "label": "Powder density (powder)",
        "type": "number",
        "default": 1.5,
        "unit": "g/cm³",
        "min": 0.5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "te",
        "label": "Transfer efficiency",
        "type": "number",
        "default": 65,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Price per litre or kilogram",
        "type": "number",
        "default": 25,
        "unit": "AUD",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
