// BIZOMAT tool definitions: Money. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "roi",
  "name": "Return on Investment and NPV",
  "category": "Money",
  "question": "Is this investment financially worthwhile?",
  "description": "Calculate ROI, annual net benefit and simple payback.",
  "keywords": [
   "payback",
   "net present value",
   "discounted"
  ],
  "fields": [
   {
    "key": "investment",
    "label": "Initial investment",
    "type": "number",
    "default": 25000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "annualBenefit",
    "label": "Annual gross benefit",
    "type": "number",
    "default": 18000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "annualCost",
    "label": "Annual ongoing cost",
    "type": "number",
    "default": 3000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "years",
    "label": "Evaluation period",
    "type": "number",
    "default": 3,
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
  "id": "break-even",
  "name": "Break-even and Margin of Safety",
  "category": "Money",
  "question": "How much must you sell before you break even?",
  "description": "Calculate contribution per unit and break-even volume and revenue.",
  "keywords": [
   "contribution",
   "CVP",
   "volume"
  ],
  "fields": [
   {
    "key": "fixed",
    "label": "Fixed costs",
    "type": "number",
    "default": 20000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "price",
    "label": "Selling price / unit",
    "type": "number",
    "default": 25,
    "min": 0.01,
    "step": 0.01,
    "unit": "$"
   },
   {
    "key": "variable",
    "label": "Variable cost / unit",
    "type": "number",
    "default": 14,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "expected",
    "label": "Expected volume / period",
    "type": "number",
    "default": 2500,
    "min": 0,
    "step": 1,
    "unit": "units"
   }
  ]
 },
 {
  "id": "margin",
  "name": "Margin and Markup",
  "category": "Money",
  "question": "What margin are you actually making?",
  "description": "See gross profit, margin and markup from cost and selling price.",
  "keywords": [
   "gross profit",
   "pricing"
  ],
  "fields": [
   {
    "key": "cost",
    "label": "Total cost / unit",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "price",
    "label": "Selling price / unit",
    "type": "number",
    "default": 100,
    "min": 0.01,
    "step": 0.01,
    "unit": "$"
   }
  ]
 },
 {
  "id": "true-cost",
  "name": "True Unit Cost",
  "category": "Money",
  "question": "What does this work really cost?",
  "description": "Combine material, labour, overhead and other cost into a realistic unit cost.",
  "keywords": [
   "fully loaded",
   "costing",
   "unit cost"
  ],
  "fields": [
   {
    "key": "material",
    "label": "Material / unit",
    "type": "number",
    "default": 12,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "labourHours",
    "label": "Labour hours / unit",
    "type": "number",
    "default": 0.5,
    "min": 0,
    "step": 0.05,
    "unit": "hr"
   },
   {
    "key": "labourRate",
    "label": "Loaded labour rate",
    "type": "number",
    "default": 45,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "overhead",
    "label": "Overhead allocation / unit",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "other",
    "label": "Other cost / unit",
    "type": "number",
    "default": 2,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "price",
    "label": "Selling price / unit (optional, 0 = not used)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.01,
    "unit": "$"
   }
  ]
 },
 {
  "id": "investment-check",
  "name": "Investment Hurdle Check",
  "category": "Money",
  "question": "Does the investment clear a simple commercial hurdle?",
  "description": "Compare payback and ROI against your minimum acceptable thresholds.",
  "keywords": [
   "payback",
   "hurdle rate",
   "capital approval"
  ],
  "fields": [
   {
    "key": "investment",
    "label": "Initial investment",
    "type": "number",
    "default": 50000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "annualNet",
    "label": "Annual net benefit",
    "type": "number",
    "default": 20000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "maxPayback",
    "label": "Maximum acceptable payback",
    "type": "number",
    "default": 3,
    "min": 0.1,
    "step": 0.1,
    "unit": "years"
   },
   {
    "key": "minROI",
    "label": "Minimum acceptable ROI",
    "type": "number",
    "default": 20,
    "min": 0,
    "step": 1,
    "unit": "%"
   }
  ]
 },
 {
  "id": "savings-check",
  "name": "Recurring Savings Check",
  "category": "Money",
  "question": "What is this improvement worth over a year?",
  "description": "Annualise recurring time or cost savings and subtract implementation cost.",
  "keywords": [
   "cost saving",
   "first-year"
  ],
  "fields": [
   {
    "key": "savingEach",
    "label": "Saving per occurrence",
    "type": "number",
    "default": 25,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "frequency",
    "label": "Occurrences per week",
    "type": "number",
    "default": 50,
    "min": 0,
    "step": 1,
    "unit": "times"
   },
   {
    "key": "weeks",
    "label": "Working weeks / year",
    "type": "number",
    "default": 48,
    "min": 1,
    "step": 1,
    "max": 52,
    "unit": "weeks"
   },
   {
    "key": "implementation",
    "label": "One-off implementation cost",
    "type": "number",
    "default": 5000,
    "min": 0,
    "step": 1,
    "unit": "$"
   }
  ]
 }
]);
