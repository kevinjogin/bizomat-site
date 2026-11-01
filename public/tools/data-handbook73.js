// KEVOS® MAKEOS: project, business, operations, maintenance, quality and machining tools (batch handbook73) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "earned-value-check",
    "name": "Earned Value Check (Cost and Schedule Variance, CPI, SPI, Estimate at Completion, TCPI)",
    "category": "Projects",
    "collection": "MAKEOS",
    "question": "From the planned value, earned value and actual cost to date, is this project on budget and on schedule, what will it cost at completion, and how efficient must the rest of the work be to finish on budget?",
    "description": "Earned value status of a project at a reporting date: cost and schedule variances, the cost and schedule performance indices, two estimates at completion (current cost efficiency continuing, and cost and schedule efficiency together), the estimate to complete, the variance at completion, the to-complete performance index needed to finish within budget, the per cent complete and a simple forecast duration, against the lowest indices and highest TCPI you accept.",
    "keywords": [
      "MAKEOS",
      "earned value",
      "EVM",
      "CPI",
      "SPI",
      "estimate at completion",
      "project control"
    ],
    "fields": [
      {
        "key": "BAC",
        "label": "Budget at completion",
        "type": "number",
        "default": 500000,
        "unit": "AUD",
        "min": 0.000001,
        "max": 100000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PV",
        "label": "Planned value to date",
        "type": "number",
        "default": 200000,
        "unit": "AUD",
        "min": 0,
        "max": 100000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "EV",
        "label": "Earned value to date",
        "type": "number",
        "default": 195000,
        "unit": "AUD",
        "min": 0,
        "max": 100000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "AC",
        "label": "Actual cost to date",
        "type": "number",
        "default": 200000,
        "unit": "AUD",
        "min": 0,
        "max": 100000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dur",
        "label": "Planned duration",
        "type": "number",
        "default": 12,
        "unit": "months",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits_you_accept",
        "label": "Limits you accept",
        "type": "heading"
      },
      {
        "key": "cpiMin",
        "label": "Lowest CPI accepted",
        "type": "number",
        "default": 0.95,
        "unit": "",
        "min": 0.01,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spiMin",
        "label": "Lowest SPI accepted",
        "type": "number",
        "default": 0.95,
        "unit": "",
        "min": 0.01,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tcpiMax",
        "label": "Highest TCPI accepted",
        "type": "number",
        "default": 1.1,
        "unit": "",
        "min": 0.5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pert-schedule-check",
    "name": "PERT Schedule Check (Three-Point Estimates, Expected Duration, Chance of Meeting the Deadline)",
    "category": "Projects",
    "collection": "MAKEOS",
    "question": "With optimistic, most likely and pessimistic durations for the activities on the critical path, what is the expected completion time, how likely is it to meet the deadline, and what duration can I promise at my confidence level?",
    "description": "PERT analysis of up to five activities in sequence on a critical path: the expected duration and variance of each activity from its three-point estimate, the expected path duration and standard deviation, the probability of finishing by the deadline from the normal distribution, and the duration to promise at the confidence you require, against that confidence.",
    "keywords": [
      "MAKEOS",
      "PERT",
      "three-point estimate",
      "critical path",
      "schedule risk",
      "project duration",
      "probability of completion"
    ],
    "fields": [
      {
        "key": "h_activity_1",
        "label": "Activity 1",
        "type": "heading"
      },
      {
        "key": "a1",
        "label": "Activity 1 optimistic",
        "type": "number",
        "default": 5,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m1",
        "label": "Activity 1 most likely",
        "type": "number",
        "default": 8,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b1",
        "label": "Activity 1 pessimistic",
        "type": "number",
        "default": 14,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_activity_2",
        "label": "Activity 2",
        "type": "heading"
      },
      {
        "key": "a2",
        "label": "Activity 2 optimistic",
        "type": "number",
        "default": 10,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Activity 2 most likely",
        "type": "number",
        "default": 12,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b2",
        "label": "Activity 2 pessimistic",
        "type": "number",
        "default": 20,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_activity_3",
        "label": "Activity 3",
        "type": "heading"
      },
      {
        "key": "a3",
        "label": "Activity 3 optimistic",
        "type": "number",
        "default": 3,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Activity 3 most likely",
        "type": "number",
        "default": 5,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b3",
        "label": "Activity 3 pessimistic",
        "type": "number",
        "default": 9,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_activity_4",
        "label": "Activity 4",
        "type": "heading"
      },
      {
        "key": "a4",
        "label": "Activity 4 optimistic",
        "type": "number",
        "default": 6,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m4",
        "label": "Activity 4 most likely",
        "type": "number",
        "default": 9,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b4",
        "label": "Activity 4 pessimistic",
        "type": "number",
        "default": 15,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_activity_5_0_0_0_to_leave_out_",
        "label": "Activity 5 (0, 0, 0 to leave out)",
        "type": "heading"
      },
      {
        "key": "a5",
        "label": "Activity 5 optimistic",
        "type": "number",
        "default": 0,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m5",
        "label": "Activity 5 most likely",
        "type": "number",
        "default": 0,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b5",
        "label": "Activity 5 pessimistic",
        "type": "number",
        "default": 0,
        "unit": "days",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target",
        "label": "Target",
        "type": "heading"
      },
      {
        "key": "dl",
        "label": "Deadline (from the start)",
        "type": "number",
        "default": 40,
        "unit": "days",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "conf",
        "label": "Confidence required",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 50,
        "max": 99.9,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "early-payment-discount-check",
    "name": "Early Payment Discount Check (Implied Interest Rate, Effective Annual Rate, Take or Pay Net)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "A supplier offers a discount for paying early: what annual interest rate does giving it up cost me, and should I take the discount or keep the cash until the due date?",
    "description": "Cost of a supplier’s early payment discount (for example 2/10 net 30): the rate earned per period by paying early, the nominal and effective annual rates over the days gained by waiting (nominal and effective interest, as the interest factors tool), the saving on this invoice, and the decision against your cost of funds.",
    "keywords": [
      "MAKEOS",
      "early payment discount",
      "trade credit",
      "payment terms",
      "2/10 net 30",
      "effective interest rate",
      "cash flow"
    ],
    "fields": [
      {
        "key": "inv",
        "label": "Invoice amount",
        "type": "number",
        "default": 11000,
        "unit": "AUD",
        "min": 0.000001,
        "max": 100000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Discount for paying early",
        "type": "number",
        "default": 2,
        "unit": "%",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nd",
        "label": "Days allowed to take the discount",
        "type": "number",
        "default": 10,
        "unit": "days",
        "min": 0,
        "max": 365,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "N",
        "label": "Days until the net amount is due",
        "type": "number",
        "default": 30,
        "unit": "days",
        "min": 0.000001,
        "max": 730,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Your cost of funds (overdraft or loan rate)",
        "type": "number",
        "default": 9,
        "unit": "%/year",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "economic-production-quantity",
    "name": "Economic Production Quantity Check (Batch Size, Run Length, Peak Stock, Cost against Current Batch)",
    "category": "Inventory",
    "collection": "MAKEOS",
    "question": "When I make a part in batches while it is also being used, what batch size gives the lowest set-up plus holding cost, how long is each run, and how much does my current batch size cost me extra?",
    "description": "Economic production quantity for a part made at a finite rate while demand continues: daily demand, the batch size with the lowest yearly set-up and holding cost (the economic order quantity adjusted for stock building only at the production rate less the demand rate), run length, cycle length, peak stock, runs per year and production days used, and the yearly cost of your current batch size against the optimum, against the extra cost you accept.",
    "keywords": [
      "MAKEOS",
      "economic production quantity",
      "EPQ",
      "batch size",
      "lot sizing",
      "set-up cost",
      "holding cost"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Annual demand",
        "type": "number",
        "default": 24000,
        "unit": "units/year",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Production rate while running",
        "type": "number",
        "default": 400,
        "unit": "units/day",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wd",
        "label": "Working days per year",
        "type": "number",
        "default": 240,
        "unit": "days",
        "min": 1,
        "max": 366,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "S",
        "label": "Set-up cost per run",
        "type": "number",
        "default": 450,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hc",
        "label": "Holding cost per unit per year",
        "type": "number",
        "default": 2.5,
        "unit": "AUD",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_current_practice",
        "label": "Current practice",
        "type": "heading"
      },
      {
        "key": "Qnow",
        "label": "Current batch size",
        "type": "number",
        "default": 5000,
        "unit": "units",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Extra cost accepted over the optimum",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wip-lead-time-check",
    "name": "WIP and Lead Time Check (Little’s Law, Flow Efficiency, WIP Limit for a Target Lead Time)",
    "category": "Operations",
    "collection": "MAKEOS",
    "question": "With this much work in progress and this output rate, how long does a job take to get through, how much of that time is actual work, and how far must WIP come down to hit my lead-time target?",
    "description": "Lead time through a production area or office process by Little’s law: average lead time from work in progress and throughput, in days and working hours, flow efficiency (value-added time as a share of lead time), and the work-in-progress limit that gives your target lead time at the same throughput, against that target.",
    "keywords": [
      "MAKEOS",
      "Little’s law",
      "lead time",
      "work in progress",
      "WIP limit",
      "flow efficiency",
      "throughput"
    ],
    "fields": [
      {
        "key": "wip",
        "label": "Work in progress",
        "type": "number",
        "default": 600,
        "unit": "units",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thr",
        "label": "Throughput (completed per day)",
        "type": "number",
        "default": 120,
        "unit": "units/day",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "va",
        "label": "Value-added time per unit",
        "type": "number",
        "default": 45,
        "unit": "min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hpd",
        "label": "Working hours per day",
        "type": "number",
        "default": 16,
        "unit": "h",
        "min": 0.000001,
        "max": 24,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "target",
        "label": "Target lead time",
        "type": "number",
        "default": 6,
        "unit": "days",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "critical-spares-poisson-plan",
    "name": "Critical Spares Plan (Poisson Failures over the Lead Time, Spares for a Service Level)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "For a group of identical repairable or randomly failing parts, how many failures should I expect while a replacement is on order, and how many spares must I hold to be this sure of not running out?",
    "description": "Spares holding for parts that fail at a constant rate (random failures, such as electronic boards, drives, seals or repairable units): the expected failures across the installed parts during the resupply or repair lead time from the MTBF and running hours, the smallest number of spares whose Poisson probability of covering all failures in that time reaches your service level, and the cover the spares held give, against your service level.",
    "keywords": [
      "MAKEOS",
      "critical spares",
      "Poisson",
      "MTBF",
      "lead time",
      "service level",
      "maintenance stores"
    ],
    "fields": [
      {
        "key": "Nu",
        "label": "Identical parts installed",
        "type": "number",
        "default": 12,
        "unit": "parts",
        "min": 1,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mtbf",
        "label": "Mean time between failures of one part",
        "type": "number",
        "default": 8000,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hpd",
        "label": "Running hours per day",
        "type": "number",
        "default": 16,
        "unit": "h/day",
        "min": 0.000001,
        "max": 24,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lead",
        "label": "Resupply or repair lead time",
        "type": "number",
        "default": 45,
        "unit": "days",
        "min": 0.000001,
        "max": 3650,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tgt",
        "label": "Chance of not running out",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 50,
        "max": 99.99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "held",
        "label": "Spares held",
        "type": "number",
        "default": 3,
        "unit": "parts",
        "min": 0,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "capability-confidence-check",
    "name": "Capability Confidence Check (Cp, Cpk and Their Lower Confidence Bounds, Sample Size)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From a capability study of this many parts, is the process proven capable at my confidence level, or does the sample only suggest it?",
    "description": "Capability indices with lower confidence bounds: Cp and Cpk from the sample mean, standard deviation and specification limits, the one-sided lower confidence bound on Cp from the chi-square distribution and on Cpk from its normal approximation (NIST e-Handbook), the sample size at which the same Cpk would be proven, against the Cpk you require.",
    "keywords": [
      "MAKEOS",
      "process capability",
      "Cpk",
      "confidence bound",
      "sample size",
      "capability study",
      "PPAP"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of parts measured",
        "type": "number",
        "default": 50,
        "unit": "parts",
        "min": 5,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "xbar",
        "label": "Sample mean",
        "type": "number",
        "default": 10.004,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Sample standard deviation",
        "type": "number",
        "default": 0.008,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "LSL",
        "label": "Lower specification limit",
        "type": "number",
        "default": 9.95,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "USL",
        "label": "Upper specification limit",
        "type": "number",
        "default": 10.05,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "conf",
        "label": "Confidence level (one-sided)",
        "type": "select",
        "default": "0.95",
        "options": [
          [
            "0.9",
            "90%"
          ],
          [
            "0.95",
            "95%"
          ],
          [
            "0.99",
            "99%"
          ]
        ]
      },
      {
        "key": "req",
        "label": "Cpk required",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "parting-off-plan",
    "name": "Parting-Off Plan (Spindle Speed Limit, Cutting Force and Power, Parting Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "When I part off this bar or tube, where does the spindle hit its speed limit, what force and power does the blade need, how long does the cut take, and does it fit my machine and cycle time?",
    "description": "Plan for parting off a bar or tube on a lathe at constant cutting speed: starting spindle speed, the diameter at which the spindle reaches its maximum speed, the cutting force from the specific cutting force, blade width and feed (as the turning power tool), cutting and motor power and torque at the start, and the parting time, integrated at constant surface speed out to the speed limit and at the limit speed after that, against the available power and your cycle time.",
    "keywords": [
      "MAKEOS",
      "parting off",
      "cut-off",
      "constant surface speed",
      "spindle speed limit",
      "cutting force",
      "lathe"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Bar outside diameter",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "di",
        "label": "Bore of a tube (0 = solid bar)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Blade (insert) width",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Radial feed",
        "type": "number",
        "default": 0.08,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 150,
        "unit": "m/min",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmax",
        "label": "Spindle speed limit",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 2000,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_machine_and_cycle",
        "label": "Machine and cycle",
        "type": "heading"
      },
      {
        "key": "eta",
        "label": "Spindle drive efficiency",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pav",
        "label": "Spindle power available",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tMax",
        "label": "Parting time allowed",
        "type": "number",
        "default": 30,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
