// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook48) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "water-line-design-check",
    "name": "Water Supply Line Check (Velocity, Friction Loss, Outlet Pressure, Valve Surge)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Is this water line big enough: is the velocity reasonable, what pressure is left at the outlet after friction and lift, and will a quick-closing valve push the pressure past the pipe rating?",
    "description": "Check of a water (or other liquid) supply line: velocity in the bore against your limit and the smallest bore for it (as the pipe size for velocity tool), friction factor and pressure drop through the pipe and fittings (as the pipe friction tool), pressure left at the outlet after friction and static lift, and the surge when a valve at the outlet closes in your closing time added to the supply pressure and compared with the rating (as the valve closure surge tool).",
    "keywords": [
      "MAKEOS",
      "water line sizing",
      "pipe pressure drop",
      "outlet pressure",
      "water hammer",
      "valve closure surge",
      "supply main"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 300,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pipe inside diameter",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Pipe length",
        "type": "number",
        "default": 120,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Sum of fitting loss coefficients",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rise",
        "label": "Outlet height above the supply",
        "type": "number",
        "default": 10,
        "unit": "m",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Kinematic viscosity",
        "type": "number",
        "default": 1,
        "unit": "cSt",
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
        "default": 998,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Pipe roughness",
        "type": "number",
        "default": 0.045,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pressures_and_limits",
        "label": "Pressures and limits",
        "type": "heading"
      },
      {
        "key": "pS",
        "label": "Supply pressure (gauge)",
        "type": "number",
        "default": 6,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMin",
        "label": "Least pressure needed at the outlet",
        "type": "number",
        "default": 3,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vMax",
        "label": "Largest velocity",
        "type": "number",
        "default": 2,
        "unit": "m/s",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rating",
        "label": "Pipe or component pressure rating",
        "type": "number",
        "default": 16,
        "unit": "bar",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_valve_and_pipe_wall",
        "label": "Valve and pipe wall",
        "type": "heading"
      },
      {
        "key": "tc",
        "label": "Valve closing time",
        "type": "number",
        "default": 2,
        "unit": "s",
        "min": 0.001,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Pipe wall thickness",
        "type": "number",
        "default": 3.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Pipe elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kb",
        "label": "Liquid bulk modulus",
        "type": "number",
        "default": 2.2,
        "unit": "GPa",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-run-expansion-check",
    "name": "Pipe Run Thermal Expansion Check (Growth, Loop Leg, Anchor Force)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much will this hot pipe run grow, is the expansion loop or bend leg I have room for long enough, and what force will it put on the anchors?",
    "description": "Check of a straight pipe run between anchors that heats up: thermal growth, the stress and anchor force if the run were fully restrained (as the thermal stress tool), the displacement the bend or loop leg must take and the leg length needed for the allowable bending stress range (as the pipe expansion loop tool), and for the leg length you have, the bending stress and the anchor force from a guided cantilever, checked against the allowable stress and the anchor load limit.",
    "keywords": [
      "MAKEOS",
      "pipe expansion",
      "expansion loop",
      "anchor force",
      "thermal growth",
      "steam pipe",
      "pipe flexibility"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Pipe run between anchors",
        "type": "number",
        "default": 50,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "µm/m·K",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Installation temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Operating temperature",
        "type": "number",
        "default": 170,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "OD",
        "label": "Pipe outside diameter",
        "type": "number",
        "default": 114.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wt",
        "label": "Wall thickness",
        "type": "number",
        "default": 6.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
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
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "type",
        "label": "Absorbed by",
        "type": "select",
        "default": "U",
        "options": [
          [
            "U",
            "A U-loop at mid-run (growth shared from both sides)"
          ],
          [
            "L",
            "An L-bend (one leg takes the whole growth)"
          ]
        ]
      },
      {
        "key": "h_what_you_have_and_your_limits",
        "label": "What you have and your limits",
        "type": "heading"
      },
      {
        "key": "leg",
        "label": "Leg length available",
        "type": "number",
        "default": 5000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sa",
        "label": "Allowable bending stress range",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fallow",
        "label": "Allowable anchor force",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pivot-pin-retention-check",
    "name": "Pivot Pin and Retaining Ring Check (Clevis Stresses and Axial Retention)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Is this clevis pivot pin strong enough for the load, and will the retaining ring that holds it in take the axial push without failing?",
    "description": "Check of a pivot pin in a clevis held in by a retaining ring: pin bending and shear, bearing in the eye and fork plates, net tension and tear-out of the eye, each against your allowable (as the clevis pin joint tool), the thrust capacity of the ring in shear and of the groove in yield with your safety factor and the least groove distance from the pin end (as the retaining ring thrust tool), checked against the axial load and the pin projection you have.",
    "keywords": [
      "MAKEOS",
      "clevis pin",
      "pivot pin",
      "retaining ring",
      "circlip",
      "pin retention",
      "axial thrust"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Radial load on the pin",
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
        "key": "Fax",
        "label": "Axial load on the ring",
        "type": "number",
        "default": 2,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pin diameter",
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
        "key": "a",
        "label": "Eye thickness",
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
        "key": "bf",
        "label": "Thickness of each fork plate",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g",
        "label": "Gap between eye and each fork plate",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Eye edge distance (hole centre to edge)",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_retaining_ring",
        "label": "Retaining ring",
        "type": "heading"
      },
      {
        "key": "ring",
        "label": "Ring type",
        "type": "select",
        "default": "spiral",
        "options": [
          [
            "spiral",
            "Spiral-wound (full contact)"
          ],
          [
            "stamped",
            "Stamped (partial contact)"
          ]
        ]
      },
      {
        "key": "rt",
        "label": "Ring thickness",
        "type": "number",
        "default": 1.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dg",
        "label": "Groove depth",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "contact",
        "label": "Groove contact fraction (stamped)",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ext",
        "label": "Pin projection beyond the groove",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_allowables_your_values_",
        "label": "Allowables (your values)",
        "type": "heading"
      },
      {
        "key": "sbA",
        "label": "Allowable pin bending stress",
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
        "key": "tpA",
        "label": "Allowable pin shear stress",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bA",
        "label": "Allowable bearing stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stA",
        "label": "Allowable eye tensile stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tA",
        "label": "Allowable eye shear stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Shear strength of the ring material",
        "type": "number",
        "default": 1000,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength of the pin (groove) material",
        "type": "number",
        "default": 400,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sc",
        "label": "Shear strength of the pin (groove) material",
        "type": "number",
        "default": 300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Ring safety factor",
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
    "id": "maintenance-interval-plan",
    "name": "Preventive Replacement Interval Plan (Weibull Reliability and Cost per Hour)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "Should I replace this part on a schedule or run it to failure, what interval minimises cost, and what interval gives the reliability I want?",
    "description": "Planned replacement of a wearing component with Weibull failure data: reliability, hazard rate, B10 life and mean life (as the Weibull reliability tool), the interval that gives your target reliability, the age-replacement cost per operating hour (planned cost if it survives, failure cost if not, over the mean running time in the cycle), the interval with the lowest cost, run-to-failure cost per hour, and the yearly saving at the interval used.",
    "keywords": [
      "MAKEOS",
      "preventive maintenance interval",
      "age replacement",
      "Weibull",
      "run to failure",
      "maintenance cost",
      "reliability"
    ],
    "fields": [
      {
        "key": "beta",
        "label": "Weibull shape β",
        "type": "number",
        "default": 2.5,
        "unit": "",
        "min": 0.2,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Characteristic life η",
        "type": "number",
        "default": 8000,
        "unit": "h",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cp",
        "label": "Cost of a planned replacement",
        "type": "number",
        "default": 500,
        "unit": "$",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cf",
        "label": "Cost of a failure (repair, downtime, scrap)",
        "type": "number",
        "default": 4000,
        "unit": "$",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rt",
        "label": "Reliability wanted over the interval",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 1,
        "max": 99.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tuse",
        "label": "Interval to use (0 = lowest cost)",
        "type": "number",
        "default": 0,
        "unit": "h",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hpy",
        "label": "Operating hours per year",
        "type": "number",
        "default": 4000,
        "unit": "h",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "process-change-trial",
    "name": "Process Change Trial (Sample Size, Welch t-Test, Improvement Decision)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "How many parts should I run before and after a process change to detect the improvement I care about, and do my trial results prove the change made a real difference?",
    "description": "Planning and evaluation of a before-and-after trial of a process change: the sample size per group to detect your smallest worthwhile difference at the chosen significance and power (equivalent to the sample size for a mean tool with the margin set for a difference), and the Welch two-sample t-test on the results with p-value and confidence interval (as the two-sample t-test tool), then the decision: improvement confirmed, no proven difference, or made worse, with checks of sample size and practical size of the change.",
    "keywords": [
      "MAKEOS",
      "process change",
      "trial size",
      "two-sample t-test",
      "statistical significance",
      "power",
      "improvement"
    ],
    "fields": [
      {
        "key": "h_plan",
        "label": "Plan",
        "type": "heading"
      },
      {
        "key": "sd",
        "label": "Expected standard deviation",
        "type": "number",
        "default": 2.2,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "delta",
        "label": "Smallest difference worth detecting",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Significance level (two-sided)",
        "type": "select",
        "default": "0.05",
        "options": [
          [
            "0.1",
            "0.10"
          ],
          [
            "0.05",
            "0.05"
          ],
          [
            "0.01",
            "0.01"
          ]
        ]
      },
      {
        "key": "power",
        "label": "Power",
        "type": "select",
        "default": "80",
        "options": [
          [
            "80",
            "80%"
          ],
          [
            "90",
            "90%"
          ],
          [
            "95",
            "95%"
          ]
        ]
      },
      {
        "key": "goal",
        "label": "Better is",
        "type": "select",
        "default": "lower",
        "options": [
          [
            "lower",
            "Lower values (after below before)"
          ],
          [
            "higher",
            "Higher values (after above before)"
          ]
        ]
      },
      {
        "key": "h_before_the_change",
        "label": "Before the change",
        "type": "heading"
      },
      {
        "key": "m1",
        "label": "Mean",
        "type": "number",
        "default": 52.3,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s1",
        "label": "Standard deviation",
        "type": "number",
        "default": 2.1,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Sample size",
        "type": "number",
        "default": 15,
        "unit": "items",
        "min": 2,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_after_the_change",
        "label": "After the change",
        "type": "heading"
      },
      {
        "key": "m2",
        "label": "Mean",
        "type": "number",
        "default": 50.1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s2",
        "label": "Standard deviation",
        "type": "number",
        "default": 2.4,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n2",
        "label": "Sample size",
        "type": "number",
        "default": 12,
        "unit": "items",
        "min": 2,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "timber-order-plan",
    "name": "Timber Order Plan (Board Feet, Cost, Moisture, Weight, Deliveries)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much timber do I order with a waste allowance, what will it cost, is it dry enough to use, and how heavy is the load to deliver?",
    "description": "Plan for a timber order: pieces with a waste allowance, board feet, volume and cost (as the lumber board feet tool), moisture content from an oven-dry test of a sample and the density at that moisture content from the specific gravity (as the wood moisture and density tool), the mass of the order, the deliveries for your vehicle payload, and a check of moisture content against your limit.",
    "keywords": [
      "MAKEOS",
      "timber order",
      "board feet",
      "lumber cost",
      "moisture content",
      "timber weight",
      "pallet and crate timber"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Thickness",
        "type": "number",
        "default": 45,
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
        "default": 90,
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
        "default": 2.4,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Pieces needed",
        "type": "number",
        "default": 200,
        "unit": "",
        "min": 1,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "waste",
        "label": "Waste and defect allowance",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pmode",
        "label": "Price given",
        "type": "select",
        "default": "m3",
        "options": [
          [
            "m3",
            "Per cubic metre"
          ],
          [
            "bf",
            "Per board foot"
          ]
        ]
      },
      {
        "key": "price",
        "label": "Price",
        "type": "number",
        "default": 650,
        "unit": "$",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_moisture_and_weight",
        "label": "Moisture and weight",
        "type": "heading"
      },
      {
        "key": "G",
        "label": "Specific gravity of the wood",
        "type": "number",
        "default": 0.45,
        "unit": "",
        "min": 0.05,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wet",
        "label": "Sample mass as tested",
        "type": "number",
        "default": 11.8,
        "unit": "g",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dry",
        "label": "Sample oven-dry mass",
        "type": "number",
        "default": 10,
        "unit": "g",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "MCmax",
        "label": "Largest moisture content for use",
        "type": "number",
        "default": 19,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "payload",
        "label": "Vehicle payload",
        "type": "number",
        "default": 1500,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "orifice-restrictor-design",
    "name": "Hydraulic Orifice Restrictor Design (Drill Size, Flow, Heat)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What orifice size gives the flow I want at this pressure drop, what flow does the nearest drill size actually give, and how much heat does the restrictor put into the oil?",
    "description": "Design of a fixed orifice to limit flow in a hydraulic or lubrication circuit: exact orifice diameter for the target flow at the pressure drop, the diameter rounded to your drill steps or one you choose, the flow it gives and the pressure drop it needs for the target flow (as the orifice flow tool), jet velocity, the power turned to heat and the temperature rise of the oil passing through, checked against your flow tolerance, least orifice size for clogging and temperature rise limit.",
    "keywords": [
      "MAKEOS",
      "orifice",
      "flow restrictor",
      "hydraulic orifice",
      "lubrication orifice",
      "drill size",
      "throttling heat"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow wanted",
        "type": "number",
        "default": 4,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure drop available",
        "type": "number",
        "default": 70,
        "unit": "bar",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Discharge coefficient",
        "type": "number",
        "default": 0.62,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Fluid density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Fluid specific heat",
        "type": "number",
        "default": 1.88,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "step",
        "label": "Drill size step",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.01,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dCh",
        "label": "Orifice diameter chosen (0 = rounded)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 200,
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
        "key": "tol",
        "label": "Flow tolerance",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0.5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMin",
        "label": "Least orifice diameter (clogging)",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTmax",
        "label": "Largest oil temperature rise",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "machine-levelling-wedge-check",
    "name": "Machine Levelling Wedge Check (Drive Force, Self-Locking, Travel)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Can these levelling wedges lift my machine with the force I can apply, will they stay put under load, and is there enough wedge travel for the height adjustment?",
    "description": "Check of wedge-type levelling elements under a machine: load on the most heavily loaded wedge from the machine mass and its share, the force to drive the wedge under the load and the force to withdraw it, with friction on both faces (as the wedge force tool), whether the wedge is self-locking, the wedge travel needed for the height adjustment and the lift per millimetre of travel, against the drive force and travel you have.",
    "keywords": [
      "MAKEOS",
      "levelling wedge",
      "machine levelling",
      "wedge force",
      "self-locking",
      "machine installation",
      "jacking"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Machine mass",
        "type": "number",
        "default": 4000,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of wedges",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "share",
        "label": "Share of the weight on the worst wedge",
        "type": "number",
        "default": 35,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Wedge angle",
        "type": "number",
        "default": 6,
        "unit": "°",
        "min": 0.1,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction (both faces)",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Height adjustment needed",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "travel",
        "label": "Wedge travel available",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Favail",
        "label": "Drive force available (screw or tool)",
        "type": "number",
        "default": 8000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ramp-winch-pull-check",
    "name": "Ramp Winch Pull Check (Pull, Holding Force, Power)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What pull does my winch need to haul this load up the ramp on wheels or skids, will the load run back if released, and is the winch power enough at the haul speed?",
    "description": "Check of a winch hauling a load up a ramp: the effective friction from rolling resistance of the wheels (coefficient of rolling resistance ÷ wheel radius, as the rolling resistance tool) or sliding friction on skids, the pull up the slope and the force to hold the load against sliding back (as the inclined plane tool), the power at the haul speed with the winch efficiency, checked against the winch rated pull, its motor power and its brake for the holding force.",
    "keywords": [
      "MAKEOS",
      "ramp winch",
      "winch pull",
      "incline haul",
      "rolling resistance",
      "skid",
      "machine moving"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Load mass",
        "type": "number",
        "default": 2000,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Ramp angle",
        "type": "number",
        "default": 10,
        "unit": "°",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mode",
        "label": "Load moves on",
        "type": "select",
        "default": "wheels",
        "options": [
          [
            "wheels",
            "Wheels or skates"
          ],
          [
            "skid",
            "Skids (sliding)"
          ]
        ]
      },
      {
        "key": "f",
        "label": "Coefficient of rolling resistance",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Wheel or roller radius",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Sliding friction (skids)",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Haul speed",
        "type": "number",
        "default": 0.2,
        "unit": "m/s",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_winch",
        "label": "Winch",
        "type": "heading"
      },
      {
        "key": "eff",
        "label": "Winch efficiency",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rating",
        "label": "Winch rated pull",
        "type": "number",
        "default": 6000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pm",
        "label": "Winch motor power",
        "type": "number",
        "default": 1.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
