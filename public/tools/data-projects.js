// KEVOS® WORKOS tool definitions: Projects. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "project-health",
  "name": "Project Health Check",
  "category": "Projects",
  "question": "How healthy is this project right now?",
  "description": "Combine schedule, cost, scope, risk and resource signals into a project-health score.",
  "keywords": [
   "status",
   "RAG",
   "recovery"
  ],
  "fields": [
   {
    "key": "scheduleVar",
    "label": "Schedule variance",
    "type": "number",
    "default": 5,
    "min": -100,
    "step": 1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "costVar",
    "label": "Cost variance",
    "type": "number",
    "default": 3,
    "min": -100,
    "step": 1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "scope",
    "label": "Scope stability",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "risk",
    "label": "Risk exposure",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "resource",
    "label": "Resource adequacy",
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
  "id": "project-size",
  "name": "Project Size and Governance",
  "category": "Projects",
  "question": "How large and complex is this project?",
  "description": "Classify project scale from budget, duration, stakeholders and complexity.",
  "keywords": [
   "governance",
   "scale",
   "assurance"
  ],
  "fields": [
   {
    "key": "budget",
    "label": "Budget",
    "type": "number",
    "default": 100000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "months",
    "label": "Duration",
    "type": "number",
    "default": 6,
    "min": 0.1,
    "step": 0.1,
    "unit": "months"
   },
   {
    "key": "stakeholders",
    "label": "Key stakeholder groups",
    "type": "number",
    "default": 5,
    "min": 1,
    "step": 1,
    "unit": "groups"
   },
   {
    "key": "complexity",
    "label": "Technical complexity",
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
  "id": "resource-fit",
  "name": "Resource Fit",
  "category": "Projects",
  "question": "Do you have enough people-hours to deliver?",
  "description": "Compare required effort with available capacity over the planned period.",
  "keywords": [
   "utilisation",
   "team capacity"
  ],
  "fields": [
   {
    "key": "required",
    "label": "Required effort",
    "type": "number",
    "default": 800,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "people",
    "label": "Available people",
    "type": "number",
    "default": 3,
    "min": 1,
    "step": 1,
    "unit": "people"
   },
   {
    "key": "hoursPerson",
    "label": "Available hours / person",
    "type": "number",
    "default": 300,
    "min": 0,
    "step": 1,
    "unit": "hr"
   }
  ]
 },
 {
  "id": "schedule-risk",
  "name": "Schedule Risk Check",
  "category": "Projects",
  "question": "Are you likely to hit the deadline?",
  "description": "Compare remaining work with productive capacity before the deadline.",
  "keywords": [
   "deadline",
   "remaining work",
   "forecast"
  ],
  "fields": [
   {
    "key": "work",
    "label": "Remaining work",
    "type": "number",
    "default": 600,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "people",
    "label": "People available",
    "type": "number",
    "default": 3,
    "min": 1,
    "step": 1,
    "unit": "people"
   },
   {
    "key": "hoursDay",
    "label": "Productive hours / person / day",
    "type": "number",
    "default": 6,
    "min": 0.1,
    "step": 0.1,
    "max": 24,
    "unit": "hr"
   },
   {
    "key": "days",
    "label": "Working days remaining",
    "type": "number",
    "default": 30,
    "min": 1,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "efficiency",
    "label": "Planning efficiency",
    "type": "number",
    "default": 80,
    "min": 1,
    "step": 1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "contingency",
  "name": "Contingency Allowance",
  "category": "Projects",
  "question": "How much project contingency is reasonable?",
  "description": "Estimate a transparent contingency allowance from uncertainty, complexity and risk.",
  "keywords": [
   "risk allowance",
   "estimate",
   "AACE"
  ],
  "fields": [
   {
    "key": "base",
    "label": "Base project cost",
    "type": "number",
    "default": 100000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "uncertainty",
    "label": "Estimate uncertainty",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "complexity",
    "label": "Complexity",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "risk",
    "label": "Risk exposure",
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
  "id": "business-case",
  "name": "Business Case with NPV",
  "category": "Projects",
  "question": "Does this project make commercial sense?",
  "description": "Quick business-case screen using investment, recurring benefit, recurring cost, horizon and risk.",
  "keywords": [
   "net present value",
   "payback",
   "investment"
  ],
  "fields": [
   {
    "key": "investment",
    "label": "Initial investment",
    "type": "number",
    "default": 100000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "benefit",
    "label": "Annual benefit",
    "type": "number",
    "default": 60000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "annualCost",
    "label": "Annual operating cost",
    "type": "number",
    "default": 10000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "years",
    "label": "Assessment horizon",
    "type": "number",
    "default": 5,
    "min": 1,
    "step": 1,
    "max": 20,
    "unit": "years"
   },
   {
    "key": "risk",
    "label": "Delivery risk",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "discountRate",
    "label": "Discount rate (your approved rate)",
    "type": "number",
    "default": 8,
    "min": 0,
    "max": 50,
    "step": 0.5,
    "unit": "%"
   }
  ]
 }
]);
