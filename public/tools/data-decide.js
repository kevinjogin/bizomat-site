// BIZOMAT tool definitions: Decide. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "make-buy",
  "name": "Make or Buy (quick check)",
  "category": "Decide",
  "question": "Should you make it yourself or outsource it?",
  "description": "Compare total internal and supplier cost, then see the volume where the decision changes.",
  "keywords": [
   "outsource",
   "in-house",
   "sourcing",
   "crossover"
  ],
  "fields": [
   {
    "key": "qty",
    "label": "Annual quantity",
    "type": "number",
    "default": 10000,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "makeUnit",
    "label": "Internal variable cost / unit",
    "type": "number",
    "default": 2.5,
    "min": 0,
    "step": 0.01,
    "unit": "$"
   },
   {
    "key": "makeFixed",
    "label": "Internal setup + tooling",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 10,
    "unit": "$"
   },
   {
    "key": "buyUnit",
    "label": "Supplier price / unit",
    "type": "number",
    "default": 3.2,
    "min": 0,
    "step": 0.01,
    "unit": "$"
   },
   {
    "key": "buyFixed",
    "label": "Freight + supplier fixed cost",
    "type": "number",
    "default": 1000,
    "min": 0,
    "step": 10,
    "unit": "$"
   }
  ]
 },
 {
  "id": "project-gate",
  "name": "Project Gate Review",
  "category": "Decide",
  "question": "Is this project worth proceeding with?",
  "description": "Balance financial value, strategic fit, urgency, risk and resource readiness into a transparent gate score.",
  "keywords": [
   "stage gate",
   "go no-go",
   "approval"
  ],
  "fields": [
   {
    "key": "benefit",
    "label": "Expected annual benefit",
    "type": "number",
    "default": 50000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "cost",
    "label": "Initial project cost",
    "type": "number",
    "default": 30000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "strategic",
    "label": "Strategic fit",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "urgency",
    "label": "Urgency",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "risk",
    "label": "Risk level",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "resource",
    "label": "Resource readiness",
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
  "id": "priority",
  "name": "Work Priority Score",
  "category": "Decide",
  "question": "What should go first?",
  "description": "Score work by impact, urgency, risk exposure and effort so competing priorities are easier to discuss.",
  "keywords": [
   "prioritise",
   "backlog",
   "triage"
  ],
  "fields": [
   {
    "key": "impact",
    "label": "Business impact",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "urgency",
    "label": "Urgency",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "risk",
    "label": "Risk if delayed",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "effort",
    "label": "Effort required",
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
  "id": "option-compare",
  "name": "Two-Option Comparison",
  "category": "Decide",
  "question": "Which of two options gives the stronger overall outcome?",
  "description": "Compare value, cost, delivery time and risk across two alternatives.",
  "keywords": [
   "alternatives",
   "trade-off",
   "select"
  ],
  "fields": [
   {
    "key": "aBenefit",
    "label": "Option A annual benefit",
    "type": "number",
    "default": 60000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "aCost",
    "label": "Option A cost",
    "type": "number",
    "default": 30000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "aDays",
    "label": "Option A delivery time",
    "type": "number",
    "default": 60,
    "min": 1,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "aRisk",
    "label": "Option A risk",
    "type": "range",
    "default": 2,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "bBenefit",
    "label": "Option B annual benefit",
    "type": "number",
    "default": 70000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "bCost",
    "label": "Option B cost",
    "type": "number",
    "default": 45000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "bDays",
    "label": "Option B delivery time",
    "type": "number",
    "default": 40,
    "min": 1,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "bRisk",
    "label": "Option B risk",
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
  "id": "change-impact",
  "name": "Change Impact Assessment",
  "category": "Decide",
  "question": "How disruptive is this proposed change?",
  "description": "Turn cost, schedule, risk, quality and expected benefit into a change-impact rating.",
  "keywords": [
   "variation",
   "change request",
   "scope change"
  ],
  "fields": [
   {
    "key": "cost",
    "label": "Additional cost",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "baseCost",
    "label": "Current project or process value",
    "type": "number",
    "default": 50000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "days",
    "label": "Schedule impact",
    "type": "number",
    "default": 5,
    "min": 0,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "baseDays",
    "label": "Remaining schedule",
    "type": "number",
    "default": 60,
    "min": 1,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "risk",
    "label": "Risk increase",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "quality",
    "label": "Quality impact",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "benefit",
    "label": "Expected benefit",
    "type": "number",
    "default": 10000,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 },
 {
  "id": "risk-score",
  "name": "Risk Rating (5 × 5 matrix)",
  "category": "Decide",
  "question": "How serious is this risk?",
  "description": "Use a classic likelihood × consequence assessment with a clear response band.",
  "keywords": [
   "likelihood",
   "consequence",
   "risk matrix",
   "ISO 31000"
  ],
  "fields": [
   {
    "key": "likelihood",
    "label": "Likelihood",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "consequence",
    "label": "Consequence",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   }
  ]
 },
 {
  "id": "make-vs-buy-pro",
  "name": "Make or Buy (detailed cost comparison)",
  "category": "Decide",
  "question": "Should you manufacture this internally or buy it from a supplier?",
  "description": "Compare annual make and buy cost, including fixed cost, freight and supplier setup.",
  "keywords": [
   "outsource",
   "landed cost",
   "sourcing"
  ],
  "fields": [
   {
    "key": "annualQty",
    "label": "Annual quantity",
    "type": "number",
    "default": 10000,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "makeMaterial",
    "label": "Make material / unit",
    "type": "number",
    "default": 5,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "makeLabour",
    "label": "Make labour / unit",
    "type": "number",
    "default": 3,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "makeVariableOH",
    "label": "Make variable overhead / unit",
    "type": "number",
    "default": 1.5,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "makeFixed",
    "label": "Annual make fixed cost",
    "type": "number",
    "default": 15000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "buyUnit",
    "label": "Supplier price / unit",
    "type": "number",
    "default": 11,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "freightUnit",
    "label": "Freight / landed cost / unit",
    "type": "number",
    "default": 0.75,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "supplierSetup",
    "label": "Annual supplier/setup cost",
    "type": "number",
    "default": 3000,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 }
]);
