// KEVOS® MAKEOS: quality, reliability, maintenance, operations and fabrication tools (batch handbook76) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bearing-defect-frequency-check",
    "name": "Bearing Defect Frequency Check (BPFO, BPFI, Ball Spin, Cage, Match to a Measured Peak)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "For this rolling bearing at this shaft speed, what are its outer race, inner race, ball spin and cage defect frequencies, and does the peak I measured in the vibration spectrum match one of them?",
    "description": "Characteristic defect frequencies of a rolling element bearing from its geometry and shaft speed: ball pass frequency of the outer race (BPFO) and inner race (BPFI), ball spin frequency (BSF) and fundamental train (cage) frequency (FTF), each in hertz, cycles per minute and orders of shaft speed, with their first three harmonics, compared with a measured spectrum peak within your tolerance to name the likely defect.",
    "keywords": [
      "MAKEOS",
      "bearing defect frequency",
      "BPFO",
      "BPFI",
      "vibration analysis",
      "condition monitoring",
      "envelope spectrum"
    ],
    "fields": [
      {
        "key": "rpm",
        "label": "Shaft speed",
        "type": "number",
        "default": 1480,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nb",
        "label": "Number of rolling elements",
        "type": "number",
        "default": 9,
        "unit": "balls",
        "min": 3,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d",
        "label": "Rolling element diameter",
        "type": "number",
        "default": 7.94,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Pitch diameter",
        "type": "number",
        "default": 39.04,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Contact angle",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measured_peak",
        "label": "Measured peak",
        "type": "heading"
      },
      {
        "key": "fm",
        "label": "Measured peak frequency",
        "type": "number",
        "default": 88.3,
        "unit": "Hz",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Matching tolerance",
        "type": "number",
        "default": 2,
        "unit": "%",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "individuals-chart-check",
    "name": "Individuals Control Chart Check (Moving Range, Control Limits, Points Out of Control)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From these individual measurements taken one at a time, where are the control limits, and is any point outside them?",
    "description": "Individuals (X) control chart from up to twelve readings in time order: the mean, the moving ranges between consecutive readings and their average, the process standard deviation estimated from the average moving range, the upper and lower control limits, and which readings fall outside them, so you can see whether the process is in statistical control.",
    "keywords": [
      "MAKEOS",
      "individuals chart",
      "I-MR chart",
      "control chart",
      "moving range",
      "SPC",
      "control limits"
    ],
    "fields": [
      {
        "key": "k",
        "label": "Number of readings used",
        "type": "number",
        "default": 12,
        "unit": "readings",
        "min": 3,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_readings_in_time_order",
        "label": "Readings in time order",
        "type": "heading"
      },
      {
        "key": "x1",
        "label": "Reading 1",
        "type": "number",
        "default": 10.02,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Reading 2",
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
        "key": "x3",
        "label": "Reading 3",
        "type": "number",
        "default": 9.98,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x4",
        "label": "Reading 4",
        "type": "number",
        "default": 10.01,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x5",
        "label": "Reading 5",
        "type": "number",
        "default": 10.04,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x6",
        "label": "Reading 6",
        "type": "number",
        "default": 9.99,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x7",
        "label": "Reading 7",
        "type": "number",
        "default": 10.03,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x8",
        "label": "Reading 8",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x9",
        "label": "Reading 9",
        "type": "number",
        "default": 10.06,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x10",
        "label": "Reading 10",
        "type": "number",
        "default": 9.97,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x11",
        "label": "Reading 11",
        "type": "number",
        "default": 10.02,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x12",
        "label": "Reading 12",
        "type": "number",
        "default": 10.01,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "p-chart-check",
    "name": "p-Chart Check (Fraction Defective, Control Limits, Samples Out of Control)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From the number of defective items in each sample of the same size, what is the average fraction defective, where are the control limits, and is any sample out of control?",
    "description": "Proportions (p) control chart from up to ten samples of equal size: the fraction defective in each sample, the average fraction defective, the upper and lower control limits from the binomial standard deviation (lower limit not below zero), which samples fall outside them, and the defectives per sample that would trigger a signal.",
    "keywords": [
      "MAKEOS",
      "p chart",
      "fraction defective",
      "attribute control chart",
      "SPC",
      "nonconforming",
      "control limits"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Items inspected in each sample",
        "type": "number",
        "default": 200,
        "unit": "items",
        "min": 2,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "k",
        "label": "Number of samples used",
        "type": "number",
        "default": 10,
        "unit": "samples",
        "min": 2,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_defective_items_in_each_sample",
        "label": "Defective items in each sample",
        "type": "heading"
      },
      {
        "key": "d1",
        "label": "Sample 1 defectives",
        "type": "number",
        "default": 4,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d2",
        "label": "Sample 2 defectives",
        "type": "number",
        "default": 6,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d3",
        "label": "Sample 3 defectives",
        "type": "number",
        "default": 3,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d4",
        "label": "Sample 4 defectives",
        "type": "number",
        "default": 5,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d5",
        "label": "Sample 5 defectives",
        "type": "number",
        "default": 7,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d6",
        "label": "Sample 6 defectives",
        "type": "number",
        "default": 2,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d7",
        "label": "Sample 7 defectives",
        "type": "number",
        "default": 5,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d8",
        "label": "Sample 8 defectives",
        "type": "number",
        "default": 4,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d9",
        "label": "Sample 9 defectives",
        "type": "number",
        "default": 6,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d10",
        "label": "Sample 10 defectives",
        "type": "number",
        "default": 8,
        "unit": "items",
        "min": 0,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "reliability-demonstration-test",
    "name": "Reliability Demonstration Test Plan (MTBF Objective, Confidence, Allowed Failures, Test Length)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "How many unit-hours of testing do I need to show, at my confidence level, that a machine or component meets its MTBF objective, and can it be done in the time I have?",
    "description": "Test length to demonstrate a mean time between failures for equipment with a constant failure rate (exponential or HPP model): the chi-square test-length factor for the confidence and the number of failures allowed, the total unit-hours needed, the hours each unit must run and the calendar days at your running hours, against the days available, with the factor for allowing one more and one fewer failure.",
    "keywords": [
      "MAKEOS",
      "reliability demonstration",
      "MTBF test",
      "chi-square",
      "test length",
      "acceptance test",
      "exponential"
    ],
    "fields": [
      {
        "key": "M",
        "label": "MTBF objective",
        "type": "number",
        "default": 200,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "conf",
        "label": "Confidence",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 50,
        "max": 99.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Failures allowed during the test",
        "type": "number",
        "default": 4,
        "unit": "failures",
        "min": 0,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_test_resources",
        "label": "Test resources",
        "type": "heading"
      },
      {
        "key": "units",
        "label": "Units on test",
        "type": "number",
        "default": 2,
        "unit": "units",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
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
        "key": "days",
        "label": "Calendar days available",
        "type": "number",
        "default": 60,
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
    "id": "queue-wait-check",
    "name": "Queue Wait Check (Utilisation, Chance of Waiting, Average Wait and Queue, Servers Needed)",
    "category": "Operations",
    "collection": "MAKEOS",
    "question": "Jobs arrive at a shared resource such as an inspection bench, a crane or a CNC programmer: how busy is it, how long do jobs wait on average, and how many servers are needed to keep the wait under my target?",
    "description": "Multi-server queue with random arrivals and service times (M/M/c): utilisation, the probability that an arriving job must wait (Erlang C), the average wait in the queue, the average time in the system and the average queue length (by Little’s law), and the fewest servers that keep the average wait within your target, against that target.",
    "keywords": [
      "MAKEOS",
      "queue",
      "waiting time",
      "Erlang C",
      "utilisation",
      "M/M/c",
      "Little’s law"
    ],
    "fields": [
      {
        "key": "lam",
        "label": "Arrival rate",
        "type": "number",
        "default": 5,
        "unit": "jobs/h",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ts",
        "label": "Average service time per job",
        "type": "number",
        "default": 20,
        "unit": "min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Number of servers",
        "type": "number",
        "default": 3,
        "unit": "servers",
        "min": 1,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "target",
        "label": "Average wait accepted",
        "type": "number",
        "default": 15,
        "unit": "min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sheet-nesting-yield",
    "name": "Sheet Nesting Yield Check (Parts per Sheet, Material Utilisation, Sheets and Cost per Part)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How many rectangular blanks of this size can I cut from a standard sheet, what share of the sheet do they use, how many sheets does the order need, and what does the material cost per part?",
    "description": "Rectangular nesting of identical blanks on a sheet for laser, plasma, punch or guillotine cutting: usable sheet after the edge margin, blanks per sheet in a straight grid both ways round and in a two-block layout that fills the leftover strip with blanks turned through 90°, the best layout, material utilisation, sheets needed for the order and material cost per part, against the utilisation you require.",
    "keywords": [
      "MAKEOS",
      "nesting",
      "sheet utilisation",
      "blank layout",
      "parts per sheet",
      "laser cutting",
      "material cost"
    ],
    "fields": [
      {
        "key": "SL",
        "label": "Sheet length",
        "type": "number",
        "default": 2400,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SW",
        "label": "Sheet width",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pl",
        "label": "Blank length",
        "type": "number",
        "default": 310,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pw",
        "label": "Blank width",
        "type": "number",
        "default": 180,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gap",
        "label": "Gap between blanks (kerf and web)",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "edge",
        "label": "Edge margin all round",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_order_and_cost",
        "label": "Order and cost",
        "type": "heading"
      },
      {
        "key": "qty",
        "label": "Blanks needed",
        "type": "number",
        "default": 500,
        "unit": "blanks",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "price",
        "label": "Price per sheet (ex GST)",
        "type": "number",
        "default": 180,
        "unit": "AUD",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "umin",
        "label": "Lowest utilisation accepted",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
