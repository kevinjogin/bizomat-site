// KEVOS® tool definitions: Manufacturing. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "batch-fit",
  "name": "Rack and Batch Fit",
  "category": "Manufacturing",
  "question": "How many parts fit on a rack, jig or tray?",
  "description": "Calculate a simple rectangular layout using available width/height, part size and clearances.",
  "keywords": [
   "coating",
   "rack",
   "loading"
  ],
  "fields": [
   {
    "key": "rackW",
    "label": "Usable rack width",
    "type": "number",
    "default": 1200,
    "min": 1,
    "step": 1,
    "unit": "mm"
   },
   {
    "key": "rackH",
    "label": "Usable rack height",
    "type": "number",
    "default": 1000,
    "min": 1,
    "step": 1,
    "unit": "mm"
   },
   {
    "key": "partW",
    "label": "Part width",
    "type": "number",
    "default": 100,
    "min": 1,
    "step": 1,
    "unit": "mm"
   },
   {
    "key": "partH",
    "label": "Part height",
    "type": "number",
    "default": 150,
    "min": 1,
    "step": 1,
    "unit": "mm"
   },
   {
    "key": "gap",
    "label": "Clearance between parts",
    "type": "number",
    "default": 20,
    "min": 0,
    "step": 1,
    "unit": "mm"
   }
  ]
 },
 {
  "id": "machine-load",
  "name": "Machine Load",
  "category": "Manufacturing",
  "question": "How heavily loaded is this machine?",
  "description": "Convert demand and cycle time into required machine hours and utilisation.",
  "keywords": [
   "utilisation",
   "machine hours"
  ],
  "fields": [
   {
    "key": "demand",
    "label": "Demand / period",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "cycle",
    "label": "Cycle time",
    "type": "number",
    "default": 1.8,
    "min": 0,
    "step": 0.1,
    "unit": "min/unit"
   },
   {
    "key": "available",
    "label": "Available machine hours",
    "type": "number",
    "default": 180,
    "min": 0.1,
    "step": 0.1,
    "unit": "hr"
   },
   {
    "key": "efficiency",
    "label": "Efficiency",
    "type": "number",
    "default": 85,
    "min": 1,
    "step": 1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "scrap-impact",
  "name": "Scrap Cost Impact",
  "category": "Manufacturing",
  "question": "What is scrap costing you?",
  "description": "Estimate units and direct cost lost to scrap.",
  "keywords": [
   "quality cost",
   "waste"
  ],
  "fields": [
   {
    "key": "units",
    "label": "Units produced",
    "type": "number",
    "default": 20000,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "unitCost",
    "label": "Cost / unit",
    "type": "number",
    "default": 4.5,
    "min": 0,
    "step": 0.1,
    "unit": "$"
   },
   {
    "key": "scrap",
    "label": "Scrap rate",
    "type": "number",
    "default": 3,
    "min": 0,
    "step": 0.1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "setup-worth",
  "name": "Setup Reduction Value",
  "category": "Manufacturing",
  "question": "Is reducing setup time worth the investment?",
  "description": "Convert saved setup minutes into annual labour / machine saving and payback.",
  "keywords": [
   "SMED",
   "changeover"
  ],
  "fields": [
   {
    "key": "current",
    "label": "Current setup time",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "target",
    "label": "Target setup time",
    "type": "number",
    "default": 30,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "changes",
    "label": "Changeovers / year",
    "type": "number",
    "default": 250,
    "min": 0,
    "step": 1,
    "unit": "changes"
   },
   {
    "key": "rate",
    "label": "Combined hourly cost",
    "type": "number",
    "default": 120,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "investment",
    "label": "Improvement investment",
    "type": "number",
    "default": 8000,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 },
 {
  "id": "tooling-payback",
  "name": "Tooling Payback",
  "category": "Manufacturing",
  "question": "How quickly will new tooling pay back?",
  "description": "Compare old and new unit costs against tooling investment and annual volume.",
  "keywords": [
   "tool investment",
   "unit saving"
  ],
  "fields": [
   {
    "key": "tooling",
    "label": "Tooling investment",
    "type": "number",
    "default": 15000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "oldCost",
    "label": "Current cost / unit",
    "type": "number",
    "default": 5.2,
    "min": 0,
    "step": 0.1,
    "unit": "$"
   },
   {
    "key": "newCost",
    "label": "New cost / unit",
    "type": "number",
    "default": 4.1,
    "min": 0,
    "step": 0.1,
    "unit": "$"
   },
   {
    "key": "volume",
    "label": "Annual volume",
    "type": "number",
    "default": 20000,
    "min": 0,
    "step": 1,
    "unit": "units"
   }
  ]
 },
 {
  "id": "downtime-cost",
  "name": "Downtime Cost",
  "category": "Manufacturing",
  "question": "What does downtime really cost?",
  "description": "Estimate lost contribution plus idle labour and restart cost.",
  "keywords": [
   "breakdown",
   "stoppage"
  ],
  "fields": [
   {
    "key": "hours",
    "label": "Downtime",
    "type": "number",
    "default": 6,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "contribution",
    "label": "Lost contribution / operating hour",
    "type": "number",
    "default": 800,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "idlePeople",
    "label": "People affected",
    "type": "number",
    "default": 4,
    "min": 0,
    "step": 1,
    "unit": "people"
   },
   {
    "key": "labourRate",
    "label": "Loaded labour rate",
    "type": "number",
    "default": 50,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "restart",
    "label": "Restart / recovery cost",
    "type": "number",
    "default": 600,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 },
 {
  "id": "yield-check",
  "name": "Yield and First-pass Yield",
  "category": "Manufacturing",
  "question": "How much good output are you getting from input?",
  "description": "Calculate first-pass yield and loss quantity.",
  "keywords": [
   "first pass yield",
   "rework",
   "quality"
  ],
  "fields": [
   {
    "key": "started",
    "label": "Units started",
    "type": "number",
    "default": 10000,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "good",
    "label": "Good units",
    "type": "number",
    "default": 9600,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "firstPass",
    "label": "Good first time (no rework)",
    "type": "number",
    "default": 9400,
    "min": 0,
    "step": 1,
    "unit": "units"
   }
  ]
 }
]);
