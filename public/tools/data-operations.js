// KEVOS® tool definitions: Operations. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "capacity",
  "name": "Capacity Check",
  "category": "Operations",
  "question": "How much can you realistically produce?",
  "description": "Convert working time, cycle time and efficiency into realistic output and utilisation.",
  "keywords": [
   "utilisation",
   "throughput"
  ],
  "fields": [
   {
    "key": "hours",
    "label": "Available hours / period",
    "type": "number",
    "default": 160,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "machines",
    "label": "Machines / parallel stations",
    "type": "number",
    "default": 2,
    "min": 1,
    "step": 1,
    "unit": "stations"
   },
   {
    "key": "cycle",
    "label": "Cycle time / unit",
    "type": "number",
    "default": 4,
    "min": 0.01,
    "step": 0.01,
    "unit": "min"
   },
   {
    "key": "efficiency",
    "label": "Realistic efficiency",
    "type": "number",
    "default": 85,
    "min": 1,
    "step": 1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "demand",
    "label": "Demand / period",
    "type": "number",
    "default": 3500,
    "min": 0,
    "step": 1,
    "unit": "units"
   }
  ]
 },
 {
  "id": "bottleneck",
  "name": "Bottleneck and Line Balance",
  "category": "Operations",
  "question": "Which step is constraining the process?",
  "description": "Compare three process-step cycle times against required takt.",
  "keywords": [
   "constraint",
   "takt",
   "line balancing"
  ],
  "fields": [
   {
    "key": "available",
    "label": "Available production time",
    "type": "number",
    "default": 420,
    "min": 1,
    "step": 1,
    "unit": "min/day"
   },
   {
    "key": "demand",
    "label": "Daily demand",
    "type": "number",
    "default": 120,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "stepA",
    "label": "Step A cycle time",
    "type": "number",
    "default": 2.5,
    "min": 0,
    "step": 0.1,
    "unit": "min"
   },
   {
    "key": "stepB",
    "label": "Step B cycle time",
    "type": "number",
    "default": 3.8,
    "min": 0,
    "step": 0.1,
    "unit": "min"
   },
   {
    "key": "stepC",
    "label": "Step C cycle time",
    "type": "number",
    "default": 2.9,
    "min": 0,
    "step": 0.1,
    "unit": "min"
   }
  ]
 },
 {
  "id": "takt-time",
  "name": "Takt Time",
  "category": "Operations",
  "question": "What pace must the process achieve?",
  "description": "Calculate required takt time from available production time and customer demand.",
  "keywords": [
   "pace",
   "customer demand",
   "lean"
  ],
  "fields": [
   {
    "key": "available",
    "label": "Net available production time",
    "type": "number",
    "default": 420,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "demand",
    "label": "Required output",
    "type": "number",
    "default": 120,
    "min": 1,
    "step": 1,
    "unit": "units"
   }
  ]
 },
 {
  "id": "oee",
  "name": "OEE (quick)",
  "category": "Operations",
  "question": "How effectively is the equipment being used?",
  "description": "Calculate Overall Equipment Effectiveness from availability, performance and quality.",
  "keywords": [
   "availability",
   "performance",
   "quality",
   "TPM"
  ],
  "fields": [
   {
    "key": "availability",
    "label": "Availability",
    "type": "number",
    "default": 90,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "performance",
    "label": "Performance",
    "type": "number",
    "default": 92,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "quality",
    "label": "Quality",
    "type": "number",
    "default": 98,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "cycle-time",
  "name": "Cycle Time vs Takt",
  "category": "Operations",
  "question": "What cycle time do you need to meet demand?",
  "description": "Compare actual cycle time with the cycle time required by available time and demand.",
  "keywords": [
   "pace",
   "rate"
  ],
  "fields": [
   {
    "key": "available",
    "label": "Available time",
    "type": "number",
    "default": 420,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "demand",
    "label": "Required output",
    "type": "number",
    "default": 140,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "actual",
    "label": "Current cycle time",
    "type": "number",
    "default": 3.4,
    "min": 0,
    "step": 0.1,
    "unit": "min/unit"
   }
  ]
 },
 {
  "id": "staffing-need",
  "name": "Staffing Need",
  "category": "Operations",
  "question": "How many people are required for this workload?",
  "description": "Convert workload and productive time into a practical staffing requirement.",
  "keywords": [
   "FTE",
   "labour",
   "headcount"
  ],
  "fields": [
   {
    "key": "demand",
    "label": "Units required",
    "type": "number",
    "default": 1000,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "labourMin",
    "label": "Labour minutes / unit",
    "type": "number",
    "default": 6,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "hoursPerson",
    "label": "Available hours / person",
    "type": "number",
    "default": 120,
    "min": 0.1,
    "step": 0.1,
    "unit": "hr"
   },
   {
    "key": "efficiency",
    "label": "Productive efficiency",
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
  "id": "shift-output",
  "name": "Shift Output",
  "category": "Operations",
  "question": "How much should one shift realistically produce?",
  "description": "Calculate shift output after breaks and efficiency loss.",
  "keywords": [
   "output",
   "shift"
  ],
  "fields": [
   {
    "key": "shift",
    "label": "Shift length",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 0.25,
    "max": 24,
    "unit": "hr"
   },
   {
    "key": "breaks",
    "label": "Breaks + planned stops",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "cycle",
    "label": "Cycle time / unit",
    "type": "number",
    "default": 2.5,
    "min": 0.01,
    "step": 0.01,
    "unit": "min"
   },
   {
    "key": "stations",
    "label": "Parallel stations",
    "type": "number",
    "default": 1,
    "min": 1,
    "step": 1,
    "unit": "stations"
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
  "id": "oee-downtime-pro",
  "name": "OEE and Downtime Analysis",
  "category": "Operations",
  "question": "How effectively is this production asset being used?",
  "description": "Calculate availability, performance, quality and overall equipment effectiveness from one production period.",
  "keywords": [
   "OEE",
   "losses",
   "downtime"
  ],
  "fields": [
   {
    "key": "plannedMin",
    "label": "Planned production time",
    "type": "number",
    "default": 480,
    "min": 1,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "downtimeMin",
    "label": "Downtime",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "min"
   },
   {
    "key": "idealCycle",
    "label": "Ideal cycle time",
    "type": "number",
    "default": 30,
    "min": 0.01,
    "step": 0.01,
    "unit": "sec/unit"
   },
   {
    "key": "totalCount",
    "label": "Total units produced",
    "type": "number",
    "default": 700,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "goodCount",
    "label": "Good units",
    "type": "number",
    "default": 665,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "downtimeRate",
    "label": "Estimated downtime cost",
    "type": "number",
    "default": 180,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   }
  ]
 }
]);
