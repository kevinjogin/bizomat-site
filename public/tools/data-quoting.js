// KEVOS® tool definitions: Quoting. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "quote-check",
  "name": "Quote Margin Check",
  "category": "Quoting",
  "question": "Does this quote actually make commercial sense?",
  "description": "Check total cost, profit, gross margin and target-margin gap.",
  "keywords": [
   "tender",
   "gross margin"
  ],
  "fields": [
   {
    "key": "price",
    "label": "Quoted selling price",
    "type": "number",
    "default": 10000,
    "min": 0.01,
    "step": 0.01,
    "unit": "$"
   },
   {
    "key": "material",
    "label": "Material",
    "type": "number",
    "default": 3500,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "labour",
    "label": "Labour",
    "type": "number",
    "default": 2200,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "overhead",
    "label": "Overhead / other",
    "type": "number",
    "default": 1200,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "target",
    "label": "Target gross margin",
    "type": "number",
    "default": 30,
    "min": 0,
    "step": 1,
    "max": 99,
    "unit": "%"
   }
  ]
 },
 {
  "id": "price-builder",
  "name": "Price from Target Margin",
  "category": "Quoting",
  "question": "What should you charge for the target margin?",
  "description": "Build a selling price from total cost and desired gross margin.",
  "keywords": [
   "pricing",
   "markup"
  ],
  "fields": [
   {
    "key": "cost",
    "label": "Total job / product cost",
    "type": "number",
    "default": 700,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "margin",
    "label": "Target gross margin",
    "type": "number",
    "default": 30,
    "min": 0,
    "step": 1,
    "max": 99,
    "unit": "%"
   }
  ]
 },
 {
  "id": "labour-quote",
  "name": "Labour Quote",
  "category": "Quoting",
  "question": "What should the labour portion of the job cost?",
  "description": "Apply loaded rate, on-cost allowance and target margin.",
  "keywords": [
   "hourly rate",
   "on-cost"
  ],
  "fields": [
   {
    "key": "hours",
    "label": "Estimated labour",
    "type": "number",
    "default": 20,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "rate",
    "label": "Base hourly rate",
    "type": "number",
    "default": 45,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "oncost",
    "label": "On-cost / overhead",
    "type": "number",
    "default": 35,
    "min": 0,
    "step": 1,
    "unit": "%"
   },
   {
    "key": "margin",
    "label": "Target margin",
    "type": "number",
    "default": 25,
    "min": 0,
    "step": 1,
    "max": 99,
    "unit": "%"
   }
  ]
 },
 {
  "id": "job-cost",
  "name": "Job Cost Estimate",
  "category": "Quoting",
  "question": "What is the expected total cost of this job?",
  "description": "Combine material, labour, equipment, overhead and contingency.",
  "keywords": [
   "estimate",
   "contingency"
  ],
  "fields": [
   {
    "key": "material",
    "label": "Materials",
    "type": "number",
    "default": 4000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "hours",
    "label": "Labour hours",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "hr"
   },
   {
    "key": "rate",
    "label": "Loaded labour rate",
    "type": "number",
    "default": 50,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "equipment",
    "label": "Equipment / subcontract",
    "type": "number",
    "default": 1000,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "overhead",
    "label": "Allocated overhead",
    "type": "number",
    "default": 800,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "contingency",
    "label": "Contingency",
    "type": "number",
    "default": 10,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "supplier-compare",
  "name": "Supplier Comparison",
  "category": "Quoting",
  "question": "Which supplier offers the stronger overall value?",
  "description": "Compare price, lead time, quality and reliability instead of price alone.",
  "keywords": [
   "vendor",
   "procurement",
   "weighted scoring"
  ],
  "fields": [
   {
    "key": "aPrice",
    "label": "Supplier A price",
    "type": "number",
    "default": 10000,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "aLead",
    "label": "Supplier A lead time",
    "type": "number",
    "default": 21,
    "min": 1,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "aQuality",
    "label": "Supplier A quality",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "aReliability",
    "label": "Supplier A reliability",
    "type": "range",
    "default": 4,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "bPrice",
    "label": "Supplier B price",
    "type": "number",
    "default": 9200,
    "min": 1,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "bLead",
    "label": "Supplier B lead time",
    "type": "number",
    "default": 35,
    "min": 1,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "bQuality",
    "label": "Supplier B quality",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "bReliability",
    "label": "Supplier B reliability",
    "type": "range",
    "default": 3,
    "min": 1,
    "max": 5,
    "step": 1,
    "hint": ""
   },
   {
    "key": "wPrice",
    "label": "Weight: price",
    "type": "number",
    "default": 40,
    "min": 0,
    "max": 100,
    "step": 5,
    "unit": "%"
   },
   {
    "key": "wLead",
    "label": "Weight: lead time",
    "type": "number",
    "default": 15,
    "min": 0,
    "max": 100,
    "step": 5,
    "unit": "%"
   },
   {
    "key": "wQuality",
    "label": "Weight: quality",
    "type": "number",
    "default": 20,
    "min": 0,
    "max": 100,
    "step": 5,
    "unit": "%"
   },
   {
    "key": "wReliability",
    "label": "Weight: delivery reliability",
    "type": "number",
    "default": 25,
    "min": 0,
    "max": 100,
    "step": 5,
    "unit": "%"
   }
  ]
 },
 {
  "id": "moq-check",
  "name": "Minimum Order Quantity Check",
  "category": "Quoting",
  "question": "What does the supplier MOQ do to your inventory economics?",
  "description": "Estimate months of stock and carrying cost created by a minimum order quantity.",
  "keywords": [
   "MOQ",
   "stock exposure"
  ],
  "fields": [
   {
    "key": "moq",
    "label": "Minimum order quantity",
    "type": "number",
    "default": 5000,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "monthly",
    "label": "Expected monthly demand",
    "type": "number",
    "default": 1000,
    "min": 0.01,
    "step": 0.01,
    "unit": "units"
   },
   {
    "key": "unitCost",
    "label": "Unit purchase cost",
    "type": "number",
    "default": 2.5,
    "min": 0,
    "step": 0.1,
    "unit": "$"
   },
   {
    "key": "carry",
    "label": "Annual carrying cost rate",
    "type": "number",
    "default": 20,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   },
   {
    "key": "shelfMonths",
    "label": "Shelf life or obsolescence horizon (0 = not limited)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 1,
    "unit": "months"
   }
  ]
 },
 {
  "id": "manufacturing-quote",
  "name": "Manufacturing Quote Builder",
  "category": "Quoting",
  "question": "What should this manufacturing job be quoted at?",
  "description": "Build a practical quote from material, labour, machine time, overhead and target margin.",
  "keywords": [
   "quotation",
   "cost build-up"
  ],
  "fields": [
   {
    "key": "qty",
    "label": "Order quantity",
    "type": "number",
    "default": 100,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "materialUnit",
    "label": "Material cost / unit",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 0.01,
    "unit": "$/unit"
   },
   {
    "key": "labourHours",
    "label": "Total labour hours",
    "type": "number",
    "default": 12,
    "min": 0,
    "step": 0.1,
    "unit": "hr"
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
    "key": "machineHours",
    "label": "Machine hours",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 0.1,
    "unit": "hr"
   },
   {
    "key": "machineRate",
    "label": "Machine rate",
    "type": "number",
    "default": 75,
    "min": 0,
    "step": 1,
    "unit": "$/hr"
   },
   {
    "key": "overhead",
    "label": "Overhead loading",
    "type": "number",
    "default": 15,
    "min": 0,
    "max": 200,
    "step": 1,
    "unit": "%"
   },
   {
    "key": "margin",
    "label": "Target gross margin",
    "type": "number",
    "default": 30,
    "min": 0,
    "max": 95,
    "step": 1,
    "unit": "%"
   }
  ]
 }
]);
