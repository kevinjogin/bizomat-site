// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook42) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "hydraulic-filter-selection",
    "name": "Hydraulic Filter Selection (Beta Ratios, Cleanliness Code, Pressure Drop)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "Will this filter bring the oil to my target cleanliness code, and is its pressure drop acceptable at my flow and oil viscosity?",
    "description": "Selection check of a hydraulic filter: particle counts per millilitre at 4, 6 and 14 µm upstream, the counts after a filter with your beta ratios at each size and its capture efficiencies (as the filter beta ratio tool), the ISO 4406 codes before and after (as the ISO cleanliness code tool) against the target, and the element pressure drop scaled from the maker’s rated value for your flow and viscosity against the allowable drop.",
    "keywords": [
      "MAKEOS",
      "hydraulic filter",
      "beta ratio",
      "ISO 4406",
      "cleanliness code",
      "filter pressure drop",
      "contamination control"
    ],
    "fields": [
      {
        "key": "h_upstream_counts_per_ml_",
        "label": "Upstream counts (per mL)",
        "type": "heading"
      },
      {
        "key": "c4",
        "label": "≥ 4 µm",
        "type": "number",
        "default": 15000,
        "unit": "per mL",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c6",
        "label": "≥ 6 µm",
        "type": "number",
        "default": 3000,
        "unit": "per mL",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c14",
        "label": "≥ 14 µm",
        "type": "number",
        "default": 1000,
        "unit": "per mL",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_filter_beta_ratios",
        "label": "Filter beta ratios",
        "type": "heading"
      },
      {
        "key": "b4",
        "label": "β at 4 µm",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b6",
        "label": "β at 6 µm",
        "type": "number",
        "default": 75,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b14",
        "label": "β at 14 µm",
        "type": "number",
        "default": 200,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target_code",
        "label": "Target code",
        "type": "heading"
      },
      {
        "key": "t4",
        "label": "Target at 4 µm",
        "type": "number",
        "default": 18,
        "unit": "",
        "min": 0,
        "max": 30,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "t6",
        "label": "Target at 6 µm",
        "type": "number",
        "default": 16,
        "unit": "",
        "min": 0,
        "max": 30,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "t14",
        "label": "Target at 14 µm",
        "type": "number",
        "default": 13,
        "unit": "",
        "min": 0,
        "max": 30,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_pressure_drop",
        "label": "Pressure drop",
        "type": "heading"
      },
      {
        "key": "dpR",
        "label": "Element pressure drop at rated flow and viscosity",
        "type": "number",
        "default": 0.2,
        "unit": "bar",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "QR",
        "label": "Rated flow",
        "type": "number",
        "default": 100,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nuR",
        "label": "Rated viscosity",
        "type": "number",
        "default": 32,
        "unit": "cSt",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Actual flow",
        "type": "number",
        "default": 80,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Actual viscosity (coldest running)",
        "type": "number",
        "default": 46,
        "unit": "cSt",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dpMax",
        "label": "Allowable clean element drop",
        "type": "number",
        "default": 1,
        "unit": "bar",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "submerged-tank-flotation",
    "name": "Buried or Submerged Tank Flotation Check (Uplift and Ballast)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Will this empty tank float out of the ground when the water table rises, and how much concrete ballast holds it down?",
    "description": "Flotation check of an empty buried or submerged tank: buoyant uplift on the displaced volume (as the buoyancy tool), resistance from the tank’s own weight, the submerged weight of the soil over it and the submerged weight of concrete ballast or an anchor slab, the safety factor against flotation, and the concrete mass needed to reach your required factor.",
    "keywords": [
      "MAKEOS",
      "tank flotation",
      "buoyancy uplift",
      "buried tank",
      "concrete ballast",
      "water table",
      "anchor slab"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Volume displaced (tank outside volume below water)",
        "type": "number",
        "default": 10,
        "unit": "m³",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoW",
        "label": "Water density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 900,
        "max": 1300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mT",
        "label": "Tank mass (empty)",
        "type": "number",
        "default": 1500,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Atop",
        "label": "Plan area of soil carried on the tank",
        "type": "number",
        "default": 8,
        "unit": "m²",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hs",
        "label": "Soil cover depth",
        "type": "number",
        "default": 0.6,
        "unit": "m",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gs",
        "label": "Submerged unit weight of the soil",
        "type": "number",
        "default": 9,
        "unit": "kN/m³",
        "min": 0,
        "max": 15,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mB",
        "label": "Concrete ballast or anchor slab mass",
        "type": "number",
        "default": 12000,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoC",
        "label": "Concrete density",
        "type": "number",
        "default": 2400,
        "unit": "kg/m³",
        "min": 1500,
        "max": 4000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Safety factor required",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cable-span-design",
    "name": "Cable Span Design (Catenary Sag, Tension, Clearance and Stretch)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What tension does this cable carry across its span at the sag I want, is it strong enough, does the low point keep its clearance, and how much does it stretch?",
    "description": "Design of a cable or rope hanging between two supports at the same level: catenary parameter, horizontal and maximum tension, cable length and end angle by the exact catenary (as the catenary cable tool), the vertical reaction at each support, the cable safety factor against its breaking load, the clearance at the low point, and the elastic stretch at that tension.",
    "keywords": [
      "MAKEOS",
      "catenary",
      "cable sag",
      "cable tension",
      "overhead cable",
      "span",
      "support reaction"
    ],
    "fields": [
      {
        "key": "S",
        "label": "Span between supports",
        "type": "number",
        "default": 100,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Sag at mid-span",
        "type": "number",
        "default": 5,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Cable weight per metre (plus any uniform load)",
        "type": "number",
        "default": 10,
        "unit": "N/m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hSup",
        "label": "Support height above ground",
        "type": "number",
        "default": 12,
        "unit": "m",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "clr",
        "label": "Least clearance at the low point",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "MBL",
        "label": "Minimum breaking load",
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
        "key": "SF",
        "label": "Safety factor required",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "EA",
        "label": "Axial stiffness E × A",
        "type": "number",
        "default": 5000,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "system-reliability",
    "name": "System Reliability from Weibull Components (Series and Redundancy)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What is the chance this machine runs a mission without failure when its components wear out on Weibull curves, and does redundancy on one item get it to target?",
    "description": "Reliability of a system of up to four component blocks in series, each with its own Weibull shape and characteristic life (as the Weibull reliability tool) and a number of identical units in active redundancy: component and block reliability at the mission time, system reliability, the weakest block, and the system mean time to failure by numerical integration of the system reliability curve.",
    "keywords": [
      "MAKEOS",
      "system reliability",
      "Weibull",
      "redundancy",
      "series system",
      "MTTF",
      "mission reliability"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Mission time",
        "type": "number",
        "default": 2000,
        "unit": "h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "target",
        "label": "Target system reliability",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 1,
        "max": 99.9999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_block_1",
        "label": "Block 1",
        "type": "heading"
      },
      {
        "key": "b1",
        "label": "Block 1 Weibull shape β",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.2,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e1",
        "label": "Block 1 characteristic life η (0 = not used)",
        "type": "number",
        "default": 10000,
        "unit": "h",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k1",
        "label": "Block 1 identical units in parallel",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_block_2",
        "label": "Block 2",
        "type": "heading"
      },
      {
        "key": "b2",
        "label": "Block 2 Weibull shape β",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0.2,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e2",
        "label": "Block 2 characteristic life η (0 = not used)",
        "type": "number",
        "default": 20000,
        "unit": "h",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k2",
        "label": "Block 2 identical units in parallel",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_block_3",
        "label": "Block 3",
        "type": "heading"
      },
      {
        "key": "b3",
        "label": "Block 3 Weibull shape β",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.2,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e3",
        "label": "Block 3 characteristic life η (0 = not used)",
        "type": "number",
        "default": 50000,
        "unit": "h",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k3",
        "label": "Block 3 identical units in parallel",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_block_4",
        "label": "Block 4",
        "type": "heading"
      },
      {
        "key": "b4",
        "label": "Block 4 Weibull shape β",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.2,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e4",
        "label": "Block 4 characteristic life η (0 = not used)",
        "type": "number",
        "default": 0,
        "unit": "h",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k4",
        "label": "Block 4 identical units in parallel",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "learning-curve-quote",
    "name": "Learning-Curve Quote (Batch Hours, Cost and Price per Unit)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "With the learning curve, how many hours will this batch take, what does each unit cost, and does the price I am offered give my margin?",
    "description": "Quote for a batch where labour time falls with repetition: time for the first and last unit, cumulative and average hours on the unit learning curve (as the learning curve tool), set-up, labour and machine cost at your hourly rate, material per unit, overhead, total and unit cost, the price per unit for your margin, and the margin the offered price gives.",
    "keywords": [
      "MAKEOS",
      "learning curve quote",
      "batch cost",
      "unit cost",
      "cumulative hours",
      "pricing",
      "experience curve"
    ],
    "fields": [
      {
        "key": "T1",
        "label": "Hours for the first unit",
        "type": "number",
        "default": 10,
        "unit": "h",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Learning rate",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Units in the batch",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "setup",
        "label": "Set-up hours",
        "type": "number",
        "default": 6,
        "unit": "h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hr",
        "label": "Labour and machine rate",
        "type": "number",
        "default": 105,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mat",
        "label": "Material per unit",
        "type": "number",
        "default": 40,
        "unit": "$",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "oh",
        "label": "Overhead on cost",
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
        "key": "margin",
        "label": "Margin wanted on price",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "offer",
        "label": "Price offered per unit",
        "type": "number",
        "default": 900,
        "unit": "$",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "acceptance-sampling-plan",
    "name": "Acceptance Sampling Plan (n and c for Producer and Consumer Risk)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What sample size and acceptance number protect both me and my customer at these quality levels, and does my current plan do it?",
    "description": "Design of a single attributes sampling plan: the smallest sample size and acceptance number whose operating characteristic accepts lots at the acceptable quality level with at least 1 − α probability and accepts lots at the rejectable quality level with at most β probability (binomial, as the sampling OC tool), its average outgoing quality limit, and the same checks for a plan you choose.",
    "keywords": [
      "MAKEOS",
      "acceptance sampling",
      "sampling plan",
      "AQL",
      "LTPD",
      "producer risk",
      "consumer risk"
    ],
    "fields": [
      {
        "key": "aql",
        "label": "Acceptable quality level (AQL)",
        "type": "number",
        "default": 1,
        "unit": "% defective",
        "min": 0.01,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rql",
        "label": "Rejectable quality level (LTPD)",
        "type": "number",
        "default": 5,
        "unit": "% defective",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Producer’s risk α",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Consumer’s risk β",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nU",
        "label": "Your sample size (0 = use the designed plan)",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "cU",
        "label": "Your acceptance number",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "measurement-uncertainty-budget",
    "name": "Measurement Uncertainty Budget (Combined, Expanded, Test Ratio)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What is the total uncertainty of this length measurement, is it small enough against the tolerance, and what guard-banded limits should I accept to?",
    "description": "Uncertainty budget for a dimensional measurement: standard uncertainties from the gauge calibration certificate, the display resolution, repeatability, the Abbe error from an offset and tilt (as the Abbe error tool, taken as a rectangular limit), and the temperature uncertainty of the part, combined by root-sum-square, expanded with a coverage factor, the test uncertainty ratio against the tolerance band, and guard-banded acceptance limits inside the tolerance.",
    "keywords": [
      "MAKEOS",
      "measurement uncertainty",
      "uncertainty budget",
      "test uncertainty ratio",
      "guard band",
      "GUM",
      "gauge capability"
    ],
    "fields": [
      {
        "key": "tol",
        "label": "Tolerance band (total)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0.0001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ucal",
        "label": "Calibration uncertainty of the gauge (expanded, k = 2)",
        "type": "number",
        "default": 2,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "res",
        "label": "Resolution of the gauge",
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
        "key": "srep",
        "label": "Repeatability (standard deviation of repeat readings)",
        "type": "number",
        "default": 1.5,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "offset",
        "label": "Abbe offset",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tilt",
        "label": "Tilt of the moving element",
        "type": "number",
        "default": 20,
        "unit": "arcsec",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length measured",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Part expansion coefficient",
        "type": "number",
        "default": 11.5,
        "unit": "µm/m·K",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Uncertainty of the part temperature (±)",
        "type": "number",
        "default": 0.5,
        "unit": "K",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Coverage factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "turMin",
        "label": "Least test uncertainty ratio",
        "type": "number",
        "default": 4,
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
    "id": "furnace-wall-design",
    "name": "Furnace Wall Design (Layers, Convection and Radiation from the Surface)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What outside surface temperature and heat loss will this layered furnace wall have, are the layer interfaces within their service temperatures, and what does the loss cost?",
    "description": "Heat loss through a layered furnace or oven wall with the outside surface losing heat by both convection and radiation: the surface temperature found by iteration so that conduction through the layers equals convection plus radiation (radiation as the radiant heat tool), the heat flux and loss for the wall area, the temperature at each interface (as the wall heat loss tool with the combined surface coefficient), the annual energy cost, and checks against the surface touch limit and the service limit of the insulating layer.",
    "keywords": [
      "MAKEOS",
      "furnace wall",
      "refractory",
      "insulation layers",
      "surface temperature",
      "radiation loss",
      "heat loss"
    ],
    "fields": [
      {
        "key": "Thot",
        "label": "Hot face temperature",
        "type": "number",
        "default": 900,
        "unit": "°C",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ta",
        "label": "Ambient temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -50,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_layers_hot_face_first_",
        "label": "Layers (hot face first)",
        "type": "heading"
      },
      {
        "key": "t1",
        "label": "Layer 1 thickness",
        "type": "number",
        "default": 115,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k1",
        "label": "Layer 1 conductivity",
        "type": "number",
        "default": 1.2,
        "unit": "W/m·K",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2",
        "label": "Layer 2 thickness",
        "type": "number",
        "default": 230,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k2",
        "label": "Layer 2 conductivity",
        "type": "number",
        "default": 0.15,
        "unit": "W/m·K",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3",
        "label": "Layer 3 thickness (shell)",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k3",
        "label": "Layer 3 conductivity",
        "type": "number",
        "default": 50,
        "unit": "W/m·K",
        "min": 0.01,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_outside_surface",
        "label": "Outside surface",
        "type": "heading"
      },
      {
        "key": "hc",
        "label": "Convection coefficient",
        "type": "number",
        "default": 8,
        "unit": "W/m²·K",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Surface emissivity",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "area",
        "label": "Wall area",
        "type": "number",
        "default": 10,
        "unit": "m²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TsMax",
        "label": "Largest surface temperature",
        "type": "number",
        "default": 70,
        "unit": "°C",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T12Max",
        "label": "Service limit at the layer 1–2 interface",
        "type": "number",
        "default": 1000,
        "unit": "°C",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Hours per year",
        "type": "number",
        "default": 4000,
        "unit": "h",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Energy price",
        "type": "number",
        "default": 0.08,
        "unit": "$/kWh",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "fastener-position-tolerance",
    "name": "Fastener Position Tolerance (Floating or Fixed) and Part Check",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What position tolerance can I give the holes for these fasteners and clearance holes, and does a measured part pass with its bonus tolerance?",
    "description": "Position tolerance for a bolted pattern by the fastener formulas: floating fasteners (clearance holes in both parts) T = H − F, fixed fasteners (one part threaded or pressed) T₁ + T₂ = H − F split between the parts, with the projected tolerance zone reminder, then the check of a measured hole: actual position from the coordinate deviations, bonus tolerance from the departure from maximum material condition, and accept or reject (as the true position tool).",
    "keywords": [
      "MAKEOS",
      "position tolerance",
      "floating fastener",
      "fixed fastener",
      "MMC bonus",
      "true position",
      "GD&T"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Fastener case",
        "type": "select",
        "default": "floating",
        "options": [
          [
            "floating",
            "Floating (clearance holes in both parts)"
          ],
          [
            "fixed",
            "Fixed (one part threaded or pressed)"
          ]
        ]
      },
      {
        "key": "H",
        "label": "Clearance hole at MMC (smallest hole)",
        "type": "number",
        "default": 11,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Fastener at MMC (largest fastener)",
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
        "key": "share",
        "label": "Share of total tolerance given to the clearance-hole part (fixed case)",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measured_hole",
        "label": "Measured hole",
        "type": "heading"
      },
      {
        "key": "dx",
        "label": "X deviation from true position",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dy",
        "label": "Y deviation from true position",
        "type": "number",
        "default": 0.4,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "size",
        "label": "Measured hole size",
        "type": "number",
        "default": 11.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "upper",
        "label": "Hole size upper limit (LMC)",
        "type": "number",
        "default": 11.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
