// BIZOMAT tool definitions: Engineering. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "retention-selector",
  "name": "Retention Method Selector",
  "category": "Engineering",
  "question": "Which axial retention method suits this joint, and what will it cost over its life?",
  "description": "Screen up to three retention methods against load, speed, temperature and disassembly needs, then compare lifecycle cost, risks and assembly guidance. Technical rejections always override cost.",
  "keywords": [
   "circlip",
   "retaining ring",
   "spring pin",
   "roll pin",
   "press fit",
   "interference fit",
   "adhesive",
   "staking",
   "shaft collar",
   "axial retention",
   "DFM",
   "design for assembly"
  ],
  "fields": [
   {
    "type": "heading",
    "key": "hApp",
    "label": "Application"
   },
   {
    "key": "joint",
    "label": "Retention location",
    "type": "select",
    "default": "shaft",
    "options": [
     [
      "shaft",
      "On a shaft (external)"
     ],
     [
      "bore",
      "In a bore or housing (internal)"
     ]
    ]
   },
   {
    "key": "dia",
    "label": "Shaft or bore diameter",
    "type": "number",
    "default": 20,
    "min": 1,
    "max": 2000,
    "step": 0.1,
    "unit": "mm",
    "sens": false
   },
   {
    "key": "load",
    "label": "Maximum axial load in service",
    "type": "number",
    "default": 1500,
    "min": 0,
    "step": 1,
    "unit": "N"
   },
   {
    "key": "loadType",
    "label": "Load character",
    "type": "select",
    "default": "static",
    "options": [
     [
      "static",
      "Static or slowly varying"
     ],
     [
      "cyclic",
      "Cyclic or vibrating"
     ],
     [
      "impact",
      "Impact or shock"
     ]
    ]
   },
   {
    "key": "rpm",
    "label": "Rotational speed of the retained parts",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "rpm"
   },
   {
    "key": "temp",
    "label": "Maximum service temperature",
    "type": "number",
    "default": 60,
    "min": -60,
    "max": 1000,
    "step": 1,
    "unit": "°C",
    "sens": false
   },
   {
    "key": "service",
    "label": "Disassembly requirement",
    "type": "select",
    "default": "occasional",
    "options": [
     [
      "never",
      "Never (permanent assembly)"
     ],
     [
      "occasional",
      "Occasional servicing"
     ],
     [
      "frequent",
      "Frequent disassembly"
     ]
    ]
   },
   {
    "key": "designFactor",
    "label": "Required design factor (your approved value, 0 = not set)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 20,
    "step": 0.1,
    "unit": "×",
    "sens": false
   },
   {
    "type": "heading",
    "key": "hLife",
    "label": "Production and lifecycle"
   },
   {
    "key": "volume",
    "label": "Annual production volume",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "years",
    "label": "Production life",
    "type": "number",
    "default": 5,
    "min": 1,
    "max": 30,
    "step": 1,
    "unit": "years"
   },
   {
    "key": "services",
    "label": "Service disassemblies per unit over its life",
    "type": "number",
    "default": 1,
    "min": 0,
    "max": 100,
    "step": 1,
    "unit": "times"
   },
   {
    "key": "rate",
    "label": "Loaded labour rate",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "type": "heading",
    "key": "hA",
    "label": "Candidate A",
    "hint": "Enter values from the supplier datasheet, the applicable standard or your own validated calculation or test. Leave 0 where you do not yet have evidence."
   },
   {
    "key": "methodA",
    "label": "Candidate A method",
    "type": "select",
    "default": "ring",
    "options": [
     [
      "ring",
      "Retaining ring (circlip)"
     ],
     [
      "eclip",
      "E-clip / retaining washer"
     ],
     [
      "pin",
      "Spring pin through cross-hole"
     ],
     [
      "collar",
      "Shaft collar (set screw or clamp)"
     ],
     [
      "nut",
      "Shoulder and locked nut"
     ],
     [
      "press",
      "Interference (press) fit"
     ],
     [
      "adhesive",
      "Anaerobic retaining compound"
     ],
     [
      "stake",
      "Staking or peening"
     ]
    ]
   },
   {
    "key": "ratingA",
    "label": "Rated axial capacity (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "N"
   },
   {
    "key": "maxRpmA",
    "label": "Rated maximum speed (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "rpm"
   },
   {
    "key": "maxTempA",
    "label": "Rated maximum temperature (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 1000,
    "step": 1,
    "unit": "°C"
   },
   {
    "key": "partA",
    "label": "Part or material cost",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "featureA",
    "label": "Feature machining cost (groove, hole, thread, fit)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "timeA",
    "label": "Assembly time",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.5,
    "unit": "s/unit"
   },
   {
    "key": "toolingA",
    "label": "One-off tooling and fixtures",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "type": "heading",
    "key": "hB",
    "label": "Candidate B",
    "hint": "Enter values from the supplier datasheet, the applicable standard or your own validated calculation or test. Leave 0 where you do not yet have evidence."
   },
   {
    "key": "methodB",
    "label": "Candidate B method",
    "type": "select",
    "default": "pin",
    "options": [
     [
      "ring",
      "Retaining ring (circlip)"
     ],
     [
      "eclip",
      "E-clip / retaining washer"
     ],
     [
      "pin",
      "Spring pin through cross-hole"
     ],
     [
      "collar",
      "Shaft collar (set screw or clamp)"
     ],
     [
      "nut",
      "Shoulder and locked nut"
     ],
     [
      "press",
      "Interference (press) fit"
     ],
     [
      "adhesive",
      "Anaerobic retaining compound"
     ],
     [
      "stake",
      "Staking or peening"
     ]
    ]
   },
   {
    "key": "ratingB",
    "label": "Rated axial capacity (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "N"
   },
   {
    "key": "maxRpmB",
    "label": "Rated maximum speed (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "rpm"
   },
   {
    "key": "maxTempB",
    "label": "Rated maximum temperature (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 1000,
    "step": 1,
    "unit": "°C"
   },
   {
    "key": "partB",
    "label": "Part or material cost",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "featureB",
    "label": "Feature machining cost (groove, hole, thread, fit)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "timeB",
    "label": "Assembly time",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.5,
    "unit": "s/unit"
   },
   {
    "key": "toolingB",
    "label": "One-off tooling and fixtures",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "type": "heading",
    "key": "hC",
    "label": "Candidate C",
    "hint": "Enter values from the supplier datasheet, the applicable standard or your own validated calculation or test. Leave 0 where you do not yet have evidence."
   },
   {
    "key": "methodC",
    "label": "Candidate C method",
    "type": "select",
    "default": "press",
    "options": [
     [
      "ring",
      "Retaining ring (circlip)"
     ],
     [
      "eclip",
      "E-clip / retaining washer"
     ],
     [
      "pin",
      "Spring pin through cross-hole"
     ],
     [
      "collar",
      "Shaft collar (set screw or clamp)"
     ],
     [
      "nut",
      "Shoulder and locked nut"
     ],
     [
      "press",
      "Interference (press) fit"
     ],
     [
      "adhesive",
      "Anaerobic retaining compound"
     ],
     [
      "stake",
      "Staking or peening"
     ]
    ]
   },
   {
    "key": "ratingC",
    "label": "Rated axial capacity (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "N"
   },
   {
    "key": "maxRpmC",
    "label": "Rated maximum speed (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "rpm"
   },
   {
    "key": "maxTempC",
    "label": "Rated maximum temperature (0 = not supplied)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 1000,
    "step": 1,
    "unit": "°C"
   },
   {
    "key": "partC",
    "label": "Part or material cost",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "featureC",
    "label": "Feature machining cost (groove, hole, thread, fit)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "timeC",
    "label": "Assembly time",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.5,
    "unit": "s/unit"
   },
   {
    "key": "toolingC",
    "label": "One-off tooling and fixtures",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 }
]);
