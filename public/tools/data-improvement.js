// KEVOS® WORKOS tool definitions: Improvement. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "improvement-value",
  "name": "Improvement Value",
  "category": "Improvement",
  "question": "What is this process improvement worth?",
  "description": "Translate time saved into annual value and simple payback.",
  "keywords": [
   "time saving",
   "kaizen"
  ],
  "fields": [
   {
    "key": "old",
    "label": "Current time / occurrence",
    "type": "number",
    "default": 12,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "new",
    "label": "Improved time / occurrence",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "freq",
    "label": "Occurrences / week",
    "type": "number",
    "default": 400,
    "min": 0,
    "step": 1,
    "unit": "times"
   },
   {
    "key": "rate",
    "label": "Loaded labour rate",
    "type": "number",
    "default": 45,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "cost",
    "label": "Implementation cost",
    "type": "number",
    "default": 6000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "weeks",
    "label": "Working weeks",
    "type": "number",
    "default": 48,
    "min": 1,
    "step": 1,
    "max": 52,
    "unit": "weeks"
   }
  ]
 },
 {
  "id": "waste-check",
  "name": "Eight Wastes Check",
  "category": "Improvement",
  "question": "Where is Lean waste most visible?",
  "description": "Score the eight classic wastes and surface the strongest improvement opportunity.",
  "keywords": [
   "lean",
   "muda",
   "TIMWOODS"
  ],
  "fields": [
   {
    "key": "transport",
    "label": "Transport",
    "type": "range",
    "default": 2,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "inventory",
    "label": "Inventory",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "motion",
    "label": "Motion",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "waiting",
    "label": "Waiting",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "overproduction",
    "label": "Overproduction",
    "type": "range",
    "default": 2,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "overprocess",
    "label": "Over-processing",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "defects",
    "label": "Defects",
    "type": "range",
    "default": 2,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "talent",
    "label": "Unused talent",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   }
  ]
 },
 {
  "id": "before-after",
  "name": "Before and After Comparison",
  "category": "Improvement",
  "question": "Did the change actually improve the process?",
  "description": "Compare time, cost and defect performance before and after.",
  "keywords": [
   "improvement",
   "results"
  ],
  "fields": [
   {
    "key": "oldTime",
    "label": "Before cycle time",
    "type": "number",
    "default": 10,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "newTime",
    "label": "After cycle time",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "oldCost",
    "label": "Before cost / unit",
    "type": "number",
    "default": 10,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "newCost",
    "label": "After cost / unit",
    "type": "number",
    "default": 8.5,
    "min": 0,
    "step": 0.1,
    "unit": "$"
   },
   {
    "key": "oldDefect",
    "label": "Before defect rate",
    "type": "number",
    "default": 4,
    "min": 0,
    "step": 0.1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "newDefect",
    "label": "After defect rate",
    "type": "number",
    "default": 2,
    "min": 0,
    "step": 0.1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "automation-check",
  "name": "Automation Business Case",
  "category": "Improvement",
  "question": "Is this repetitive work worth automating?",
  "description": "Compare the annual cost of manual work with automation investment and maintenance.",
  "keywords": [
   "robot",
   "automate",
   "payback"
  ],
  "fields": [
   {
    "key": "hoursWeek",
    "label": "Manual hours / week",
    "type": "number",
    "default": 20,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "rate",
    "label": "Loaded labour rate",
    "type": "number",
    "default": 45,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "weeks",
    "label": "Working weeks",
    "type": "number",
    "default": 48,
    "min": 1,
    "step": 1,
    "max": 52,
    "unit": "weeks"
   },
   {
    "key": "investment",
    "label": "Automation investment",
    "type": "number",
    "default": 40000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "maintenance",
    "label": "Annual automation cost",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "reduction",
    "label": "Expected manual effort reduction",
    "type": "number",
    "default": 80,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "process-score",
  "name": "Process Maturity Score",
  "category": "Improvement",
  "question": "How mature is this process?",
  "description": "Score clarity, standardisation, measurement, ownership and continuous improvement.",
  "keywords": [
   "standard work",
   "maturity"
  ],
  "fields": [
   {
    "key": "clarity",
    "label": "Process clarity",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "standard",
    "label": "Standardisation",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "measure",
    "label": "Measurement",
    "type": "range",
    "default": 2,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "ownership",
    "label": "Ownership",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "improve",
    "label": "Improvement discipline",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   }
  ]
 },
 {
  "id": "jig-fixture-roi",
  "name": "Jig and Fixture Return on Investment",
  "category": "Improvement",
  "question": "Is this jig or fixture worth building?",
  "description": "Estimate labour and scrap savings, monthly benefit, payback and first-year return for a proposed jig or fixture.",
  "keywords": [
   "fixture",
   "tooling",
   "payback"
  ],
  "fields": [
   {
    "key": "investment",
    "label": "Design and build investment",
    "type": "number",
    "default": 6000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "savingMin",
    "label": "Time saved / run",
    "type": "number",
    "default": 20,
    "min": 0,
    "step": 0.1,
    "unit": "min"
   },
   {
    "key": "runsMonth",
    "label": "Runs / month",
    "type": "number",
    "default": 80,
    "min": 0,
    "step": 1,
    "unit": "runs"
   },
   {
    "key": "labourRate",
    "label": "Labour rate",
    "type": "number",
    "default": 55,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "scrapSaving",
    "label": "Monthly scrap and rework savings",
    "type": "number",
    "default": 400,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "maintenance",
    "label": "Fixture maintenance / month",
    "type": "number",
    "default": 50,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 }
]);
