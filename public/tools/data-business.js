// BIZOMAT tool definitions: Business. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "hire-outsource",
  "name": "Hire or Outsource",
  "category": "Business",
  "question": "Should you hire or outsource this work?",
  "description": "Compare annual employee and contractor cost for a defined workload.",
  "keywords": [
   "contractor",
   "employee"
  ],
  "fields": [
   {
    "key": "hours",
    "label": "Annual workload",
    "type": "number",
    "default": 1400,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "salary",
    "label": "Annual salary",
    "type": "number",
    "default": 85000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "oncost",
    "label": "Employee on-costs",
    "type": "number",
    "default": 25,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "hiring",
    "label": "Hiring / setup cost",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "contractor",
    "label": "Contractor rate",
    "type": "number",
    "default": 85,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   }
  ]
 },
 {
  "id": "subscription-value",
  "name": "Subscription Value",
  "category": "Business",
  "question": "Is this subscription earning its keep?",
  "description": "Compare subscription cost with time saved and additional value created.",
  "keywords": [
   "SaaS",
   "software cost"
  ],
  "fields": [
   {
    "key": "monthly",
    "label": "Monthly subscription cost",
    "type": "number",
    "default": 100,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "hours",
    "label": "Hours saved / month",
    "type": "number",
    "default": 4,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "hourValue",
    "label": "Value of time",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "extra",
    "label": "Other monthly value / revenue",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 },
 {
  "id": "buy-lease",
  "name": "Buy or Lease",
  "category": "Business",
  "question": "Should you buy or lease this equipment?",
  "description": "Compare multi-year ownership cost with lease cost.",
  "keywords": [
   "equipment finance",
   "present value"
  ],
  "fields": [
   {
    "key": "buy",
    "label": "Purchase price",
    "type": "number",
    "default": 60000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "residual",
    "label": "Expected resale value",
    "type": "number",
    "default": 15000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "maintenance",
    "label": "Annual ownership maintenance",
    "type": "number",
    "default": 3000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "lease",
    "label": "Monthly lease payment",
    "type": "number",
    "default": 1500,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "leaseUpfront",
    "label": "Lease upfront / fees",
    "type": "number",
    "default": 3000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "years",
    "label": "Comparison period",
    "type": "number",
    "default": 4,
    "min": 1,
    "step": 1,
    "max": 20,
    "unit": "years"
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
 },
 {
  "id": "process-or-software",
  "name": "Process or Software Readiness",
  "category": "Business",
  "question": "Should you fix the process first or buy software?",
  "description": "Use process clarity, consistency, manual effort and error exposure to guide the next step.",
  "keywords": [
   "digitise",
   "system"
  ],
  "fields": [
   {
    "key": "clarity",
    "label": "Process clarity",
    "type": "range",
    "default": 2,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "consistency",
    "label": "Process consistency",
    "type": "range",
    "default": 2,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "manual",
    "label": "Manual effort",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "errors",
    "label": "Error exposure",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "data",
    "label": "Data readiness",
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
  "id": "build-buy-software",
  "name": "Build or Buy Software",
  "category": "Business",
  "question": "Should you build custom software or buy an existing product?",
  "description": "Compare multi-year cost with fit, uniqueness and control requirements.",
  "keywords": [
   "custom software",
   "package",
   "TCO"
  ],
  "fields": [
   {
    "key": "custom",
    "label": "Custom build cost",
    "type": "number",
    "default": 50000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "customAnnual",
    "label": "Custom annual support",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "packageSetup",
    "label": "Package setup cost",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "packageMonthly",
    "label": "Package monthly cost",
    "type": "number",
    "default": 1500,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "years",
    "label": "Comparison period",
    "type": "number",
    "default": 3,
    "min": 1,
    "step": 1,
    "max": 10,
    "unit": "years"
   },
   {
    "key": "fit",
    "label": "Off-the-shelf fit",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "unique",
    "label": "Uniqueness of requirement",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "control",
    "label": "Need for control",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   }
  ]
 }
]);
