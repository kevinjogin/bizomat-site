// KEVOS® WORKOS tool definitions: Inventory. Generated from the tool register; edit with care and keep tests passing.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
 {
  "id": "reorder-point",
  "name": "Reorder Point",
  "category": "Inventory",
  "question": "When should you reorder?",
  "description": "Calculate reorder point from average demand, lead time and safety stock.",
  "keywords": [
   "ROP",
   "replenishment"
  ],
  "fields": [
   {
    "key": "daily",
    "label": "Average daily demand",
    "type": "number",
    "default": 40,
    "min": 0,
    "step": 1,
    "unit": "units/day"
   },
   {
    "key": "lead",
    "label": "Lead time",
    "type": "number",
    "default": 10,
    "min": 0,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "safety",
    "label": "Safety stock",
    "type": "number",
    "default": 150,
    "min": 0,
    "step": 1,
    "unit": "units"
   }
  ]
 },
 {
  "id": "safety-stock",
  "name": "Safety Stock",
  "category": "Inventory",
  "question": "How much buffer stock should you hold?",
  "description": "Use max/average demand and lead-time variation to estimate a simple safety stock.",
  "keywords": [
   "service level",
   "buffer stock",
   "variability"
  ],
  "fields": [
   {
    "key": "maxDaily",
    "label": "Maximum daily demand",
    "type": "number",
    "default": 60,
    "min": 0,
    "step": 1,
    "unit": "units/day"
   },
   {
    "key": "maxLead",
    "label": "Maximum lead time",
    "type": "number",
    "default": 14,
    "min": 0,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "avgDaily",
    "label": "Average daily demand",
    "type": "number",
    "default": 40,
    "min": 0,
    "step": 1,
    "unit": "units/day"
   },
   {
    "key": "avgLead",
    "label": "Average lead time",
    "type": "number",
    "default": 9,
    "min": 0,
    "step": 1,
    "unit": "days"
   },
   {
    "key": "sdDaily",
    "label": "Std deviation of daily demand (0 = not known)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.1,
    "unit": "units/day"
   },
   {
    "key": "sdLead",
    "label": "Std deviation of lead time (0 = not known)",
    "type": "number",
    "default": 0,
    "min": 0,
    "step": 0.1,
    "unit": "days"
   },
   {
    "key": "service",
    "label": "Target cycle service level",
    "type": "select",
    "default": "95",
    "options": [
     [
      "90",
      "90 %"
     ],
     [
      "95",
      "95 %"
     ],
     [
      "97.5",
      "97.5 %"
     ],
     [
      "99",
      "99 %"
     ],
     [
      "99.5",
      "99.5 %"
     ]
    ]
   }
  ]
 },
 {
  "id": "inventory-cost",
  "name": "Inventory Carrying Cost",
  "category": "Inventory",
  "question": "What does holding this inventory cost each year?",
  "description": "Estimate annual carrying cost from average stock value and carrying rate.",
  "keywords": [
   "holding cost",
   "working capital"
  ],
  "fields": [
   {
    "key": "avgUnits",
    "label": "Average inventory",
    "type": "number",
    "default": 4000,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "unitCost",
    "label": "Unit cost",
    "type": "number",
    "default": 8,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "carry",
    "label": "Annual carrying rate",
    "type": "number",
    "default": 22,
    "min": 0,
    "step": 1,
    "max": 100,
    "unit": "%"
   }
  ]
 },
 {
  "id": "stock-days",
  "name": "Days of Stock Cover",
  "category": "Inventory",
  "question": "How many days of stock do you have?",
  "description": "Convert stock on hand into days of cover.",
  "keywords": [
   "coverage",
   "stock cover"
  ],
  "fields": [
   {
    "key": "stock",
    "label": "Stock on hand",
    "type": "number",
    "default": 2500,
    "min": 0,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "daily",
    "label": "Average daily demand",
    "type": "number",
    "default": 100,
    "min": 0.01,
    "step": 0.01,
    "unit": "units/day"
   }
  ]
 },
 {
  "id": "order-quantity",
  "name": "Economic Order Quantity (EOQ)",
  "category": "Inventory",
  "question": "What order quantity balances ordering and holding cost?",
  "description": "Calculate classic EOQ from annual demand, order cost and annual holding cost per unit.",
  "keywords": [
   "EOQ",
   "order size",
   "Harris"
  ],
  "fields": [
   {
    "key": "annual",
    "label": "Annual demand",
    "type": "number",
    "default": 24000,
    "min": 1,
    "step": 1,
    "unit": "units"
   },
   {
    "key": "orderCost",
    "label": "Cost to place an order",
    "type": "number",
    "default": 80,
    "min": 0,
    "step": 1,
    "unit": "$"
   },
   {
    "key": "holding",
    "label": "Annual holding cost / unit",
    "type": "number",
    "default": 2,
    "min": 0.01,
    "step": 0.01,
    "unit": "$"
   }
  ]
 }
]);
