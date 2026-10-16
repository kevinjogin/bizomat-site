// KEVOS® WORKOS tool definitions: Planning. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "demand-capacity",
  "name": "Demand vs Capacity",
  "category": "Planning",
  "question": "Can available capacity meet demand?",
  "description": "Compare demand against practical capacity and show the buffer or shortfall.",
  "keywords": [
   "load",
   "S&OP"
  ],
  "fields": [
   {
    "key": "demand",
    "label": "Demand",
    "type": "number",
    "default": 10000,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "capacity",
    "label": "Practical capacity",
    "type": "number",
    "default": 11500,
    "min": 0.01,
    "step": 0.01,
    "unit": "units"
   }
  ]
 },
 {
  "id": "deadline-check",
  "name": "Deadline Feasibility",
  "category": "Planning",
  "question": "Can you finish this quantity by the deadline?",
  "description": "Convert cycle time, resources and available working days into deliverable quantity.",
  "keywords": [
   "due date",
   "delivery"
  ],
  "fields": [
   {
    "key": "qty",
    "label": "Required quantity",
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
    "default": 3,
    "min": 0.01,
    "step": 0.01,
    "unit": "min/unit"
   },
   {
    "key": "machines",
    "label": "Parallel resources",
    "type": "number",
    "default": 2,
    "min": 1,
    "step": 1,
    "unit": "resources"
   },
   {
    "key": "hoursDay",
    "label": "Hours / day",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 0.25,
    "max": 24,
    "unit": "hr"
   },
   {
    "key": "days",
    "label": "Working days",
    "type": "number",
    "default": 15,
    "min": 0,
    "step": 1,
    "unit": "days"
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
  "id": "workload",
  "name": "Team Workload",
  "category": "Planning",
  "question": "Is the team overloaded?",
  "description": "Compare planned work hours with available team capacity.",
  "keywords": [
   "utilisation",
   "allocation"
  ],
  "fields": [
   {
    "key": "work",
    "label": "Planned work",
    "type": "number",
    "default": 1200,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "people",
    "label": "People",
    "type": "number",
    "default": 5,
    "min": 1,
    "step": 1,
    "unit": "people"
   },
   {
    "key": "hours",
    "label": "Available hours / person",
    "type": "number",
    "default": 200,
    "min": 0,
    "step": 1,
    "unit": "hr"
   }
  ]
 },
 {
  "id": "what-if",
  "name": "Profit What-if Scenario",
  "category": "Planning",
  "question": "What happens if volume, price or cost changes?",
  "description": "Run a simple profit sensitivity scenario against your current baseline.",
  "keywords": [
   "scenario",
   "price change",
   "volume change"
  ],
  "fields": [
   {
    "key": "volume",
    "label": "Base volume",
    "type": "number",
    "default": 10000,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "price",
    "label": "Base price",
    "type": "number",
    "default": 20,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "cost",
    "label": "Base variable cost",
    "type": "number",
    "default": 12,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "fixed",
    "label": "Fixed cost",
    "type": "number",
    "default": 30000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "volChange",
    "label": "Volume change",
    "type": "number",
    "default": 10,
    "min": -100,
    "step": 1,
    "max": 500,
    "unit": "%"
   },
   {
    "key": "priceChange",
    "label": "Price change",
    "type": "number",
    "default": 0,
    "min": -100,
    "step": 1,
    "max": 500,
    "unit": "%"
   },
   {
    "key": "costChange",
    "label": "Unit cost change",
    "type": "number",
    "default": 5,
    "min": -100,
    "step": 1,
    "max": 500,
    "unit": "%"
   }
  ]
 },
 {
  "id": "capacity-planner-pro",
  "name": "Production Capacity Planner",
  "category": "Planning",
  "question": "Can the current production setup meet demand?",
  "description": "Estimate monthly effective capacity from machines, shifts, uptime and cycle time, then compare it with demand.",
  "keywords": [
   "shifts",
   "monthly capacity"
  ],
  "fields": [
   {
    "key": "machines",
    "label": "Machines / lines",
    "type": "number",
    "default": 2,
    "min": 1,
    "step": 1,
    "unit": "assets"
   },
   {
    "key": "shifts",
    "label": "Shifts / day",
    "type": "number",
    "default": 2,
    "min": 1,
    "step": 1,
    "unit": "shifts"
   },
   {
    "key": "hoursShift",
    "label": "Hours / shift",
    "type": "number",
    "default": 8,
    "min": 0.1,
    "step": 0.1,
    "unit": "hr"
   },
   {
    "key": "days",
    "label": "Working days / month",
    "type": "number",
    "default": 22,
    "min": 1,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "uptime",
    "label": "Expected uptime",
    "type": "number",
    "default": 85,
    "min": 1,
    "max": 100,
    "step": 1,
    "unit": "%"
   },
   {
    "key": "cycleSec",
    "label": "Average cycle time",
    "type": "number",
    "default": 45,
    "min": 0.01,
    "step": 0.01,
    "unit": "sec/unit"
   },
   {
    "key": "demand",
    "label": "Monthly demand",
    "type": "number",
    "default": 40000,
    "min": 0,
    "step": 1,
    "unit": "units"
   }
  ]
 }
]);
