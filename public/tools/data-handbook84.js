// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook84) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "compound-indexing",
    "name": "Compound Indexing on a Dividing Head (Exact and Approximate Movements, Error at the Work)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "Simple indexing cannot give the number of divisions I need. Which two-circle (compound) movement on my index plates gives it exactly, or, if none does, which approximate movement over several workpiece revolutions comes closest, and how large is the error at my workpiece diameter?",
    "description": "Indexing movements for a plain dividing head with Brown & Sharpe plates 1–3 or the two-sided Cincinnati standard plate, by the method the handbook describes: simple indexing when a hole circle divides the crank turns exactly, compound indexing (two movements on two circles of the same plate, added or subtracted) when that is exact, and otherwise approximate compound movements that fill in the divisions over several workpiece revolutions. Each movement is given with the precise number of divisions it produces, the handbook’s measure of closeness (the diameter at which the error equals 0.001) and the error at your workpiece diameter against the error you accept. A movement taken from an indexing table can be checked the same way.",
    "keywords": [
      "MAKEOS",
      "compound indexing",
      "dividing head",
      "index plate",
      "Brown & Sharpe plates",
      "Cincinnati index plate",
      "approximate indexing",
      "gear cutting divisions",
      "indexing error"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Show",
        "type": "select",
        "default": "search",
        "options": [
          [
            "search",
            "Best movements for the number of divisions"
          ],
          [
            "check",
            "Check a movement taken from a table"
          ]
        ]
      },
      {
        "key": "h_job",
        "label": "Job",
        "type": "heading"
      },
      {
        "key": "N",
        "label": "Number of divisions wanted",
        "type": "number",
        "default": 127,
        "unit": "divisions",
        "min": 2,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "ratio",
        "label": "Worm ratio (crank turns per spindle turn)",
        "type": "number",
        "default": 40,
        "unit": ":1",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plates",
        "label": "Index plates on the head",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe standard plates 1, 2 and 3"
          ],
          [
            "cin",
            "Cincinnati standard plate, sides 1 and 2"
          ]
        ]
      },
      {
        "key": "Rmax",
        "label": "Most workpiece revolutions accepted for an approximate movement",
        "type": "number",
        "default": 13,
        "unit": "rev",
        "min": 1,
        "max": 30,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_accuracy",
        "label": "Accuracy",
        "type": "heading"
      },
      {
        "key": "dia",
        "label": "Workpiece diameter (pitch diameter for a gear)",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Position error accepted at that diameter",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_movement_to_check",
        "label": "Movement to check",
        "type": "heading"
      },
      {
        "key": "w",
        "label": "Whole turns of the crank",
        "type": "number",
        "default": 0,
        "unit": "turns",
        "min": 0,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "a",
        "label": "Holes moved on the first circle",
        "type": "number",
        "default": 42,
        "unit": "holes",
        "min": 0,
        "max": 400,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "A",
        "label": "Holes in the first circle",
        "type": "number",
        "default": 47,
        "unit": "holes",
        "min": 2,
        "max": 400,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "sign",
        "label": "Second movement",
        "type": "select",
        "default": "plus",
        "options": [
          [
            "plus",
            "Added (positive compounding)"
          ],
          [
            "minus",
            "Subtracted (negative compounding)"
          ]
        ]
      },
      {
        "key": "b",
        "label": "Holes moved on the second circle",
        "type": "number",
        "default": 2,
        "unit": "holes",
        "min": 0,
        "max": 400,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "B",
        "label": "Holes in the second circle",
        "type": "number",
        "default": 39,
        "unit": "holes",
        "min": 2,
        "max": 400,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "R",
        "label": "Workpiece revolutions for the full set of divisions",
        "type": "number",
        "default": 3,
        "unit": "rev",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "unified-thread-gauge-limits",
    "name": "Unified Inch Thread Gauge Sizes (GO and NOT GO Plugs, Rings and Setting Gauges)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a Unified inch screw thread with known product limits, what are the nominal sizes and tolerance directions of the GO and NOT GO thread gauges, the plain major and minor diameter gauges, and the setting plugs and rings, and do the gauge tolerances leave room inside the product tolerance?",
    "description": "Nominal sizes and limits of the American National Standard gauges for Unified inch screw threads by the formulas of ANSI/ASME B1.2 Table 5 that the handbook gives: GO and NOT GO (LO) thread ring gauges and plain major diameter gauges for external threads, GO and NOT GO (HI) thread plug gauges and plain minor diameter gauges for internal threads, full-form and truncated setting plugs with the 0.001 in crest-width rule, and solid thread-setting rings for snap and indicating gauges. The product limits and the gauge tolerances (from Table 4 for W and X gauges, and your plain gauge standard) are entered, and each gauge is listed with the side its tolerance is applied to, in inches and millimetres.",
    "keywords": [
      "MAKEOS",
      "thread gauge",
      "GO NOT GO thread gauge",
      "thread ring gauge",
      "thread plug gauge",
      "setting plug",
      "ANSI B1.2",
      "Unified thread gauge",
      "gage limits"
    ],
    "fields": [
      {
        "key": "h_thread",
        "label": "Thread",
        "type": "heading"
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 20,
        "unit": "TPI",
        "min": 1,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_external_thread_bolt_limits",
        "label": "External thread (bolt) limits",
        "type": "heading"
      },
      {
        "key": "eMaj",
        "label": "Maximum major diameter",
        "type": "number",
        "default": 0.2489,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eMajMin",
        "label": "Minimum major diameter",
        "type": "number",
        "default": 0.2408,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ePDmax",
        "label": "Maximum pitch diameter",
        "type": "number",
        "default": 0.2164,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ePDmin",
        "label": "Minimum pitch diameter",
        "type": "number",
        "default": 0.2127,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_internal_thread_nut_limits",
        "label": "Internal thread (nut) limits",
        "type": "heading"
      },
      {
        "key": "iMaj",
        "label": "Minimum major diameter",
        "type": "number",
        "default": 0.25,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "iPDmin",
        "label": "Minimum pitch diameter",
        "type": "number",
        "default": 0.2175,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "iPDmax",
        "label": "Maximum pitch diameter",
        "type": "number",
        "default": 0.2224,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "iMinMin",
        "label": "Minimum minor diameter",
        "type": "number",
        "default": 0.196,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "iMinMax",
        "label": "Maximum minor diameter",
        "type": "number",
        "default": 0.207,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gauge_tolerances",
        "label": "Gauge tolerances",
        "type": "heading"
      },
      {
        "key": "xPD",
        "label": "Pitch diameter tolerance of the GO and NOT GO thread gauges",
        "type": "number",
        "default": 0.0003,
        "unit": "in",
        "min": 0.000001,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xMaj",
        "label": "Major and minor diameter tolerance of the thread gauges",
        "type": "number",
        "default": 0.0005,
        "unit": "in",
        "min": 0.000001,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wPD",
        "label": "W tolerance on pitch diameter (setting plugs and rings)",
        "type": "number",
        "default": 0.0001,
        "unit": "in",
        "min": 0.000001,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wMaj",
        "label": "W tolerance on major and minor diameters (setting gauges)",
        "type": "number",
        "default": 0.0005,
        "unit": "in",
        "min": 0.000001,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "plain",
        "label": "Tolerance of the plain diameter gauges",
        "type": "number",
        "default": 0.0001,
        "unit": "in",
        "min": 0.000001,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "forging-hammer-efficiency",
    "name": "Forging Hammer Efficiency by the Heim Lead Cylinder Test (Work per Blow and Efficiency)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "If I let my forging or drop hammer strike a pure lead cylinder and measure how much it was shortened, how much work does each blow do, how much useful power does the hammer deliver at its blow rate, and how efficient is it against the power it takes?",
    "description": "Work done by one blow of a forging hammer from the Heim test the handbook describes: a pure lead cylinder 1.5 times as high as its diameter is struck, and the work follows from its diameter and the relative reduction in height by the empirical formula Work = 36.75 D³ [8.85 A + 13.12 (A² + A⁴)] foot-pounds (D in inches). The tool converts your millimetre measurements, gives the work per blow in joules and foot-pounds, the useful power at the blows per minute, and the efficiency against the power supplied to the hammer.",
    "keywords": [
      "MAKEOS",
      "forging hammer efficiency",
      "Heim test",
      "lead cylinder test",
      "hammer blow energy",
      "power hammer",
      "steam hammer test",
      "drop hammer"
    ],
    "fields": [
      {
        "key": "h_lead_cylinder",
        "label": "Lead cylinder",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Diameter of the lead cylinder",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "H0",
        "label": "Height of the cylinder before the blow",
        "type": "number",
        "default": 75,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "H1",
        "label": "Height of the cylinder after the blow",
        "type": "number",
        "default": 48,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_hammer",
        "label": "Hammer",
        "type": "heading"
      },
      {
        "key": "bpm",
        "label": "Blows per minute",
        "type": "number",
        "default": 180,
        "unit": "blows/min",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pin",
        "label": "Power supplied to the hammer while running",
        "type": "number",
        "default": 7.68,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "press-gauge-pressure-for-work",
    "name": "Hydraulic Press Gauge Pressure for a Pressure on the Work (Capacity and Pressure on the Material)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What gauge pressure must my hydraulic press run at to put a given pressure on the area of the work, what force and pressure on the work does it give at the gauge pressure I set, and can the press reach it?",
    "description": "Hydraulic press capacity and pressure on the work by the rules the handbook gives: the press force is the gauge pressure on the ram area (C = 0.00039 D² P tons in the inch form, 0.7854 D² P in pounds), the pressure on the material is the press force divided by the area being pressed, and the gauge pressure for a required pressure on the material is that pressure times the area of the work divided by 0.7854 times the square of the ram diameter. In SI units with force in kilonewtons and tonnes-force, checked against the most pressure the press system may run at.",
    "keywords": [
      "MAKEOS",
      "hydraulic press capacity",
      "press tonnage",
      "gauge pressure",
      "pressure on the work",
      "ram diameter",
      "pressing pressure",
      "compaction pressure"
    ],
    "fields": [
      {
        "key": "h_press",
        "label": "Press",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Ram diameter",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Gauge pressure applied",
        "type": "number",
        "default": 200,
        "unit": "bar",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pmax",
        "label": "Most gauge pressure the press may run at",
        "type": "number",
        "default": 250,
        "unit": "bar",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_work",
        "label": "Work",
        "type": "heading"
      },
      {
        "key": "A",
        "label": "Area of the work under pressure",
        "type": "number",
        "default": 20000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pa",
        "label": "Pressure wanted on the work",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pm-dc-motor-constants",
    "name": "Permanent-Magnet Control Motor Constants (Torque and Voltage Constants, Damping, Time Constant, Resonance)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "From the rated voltage, winding resistance, stall torque, no-load speed and inertia of a permanent-magnet DC control motor, what are its torque and voltage constants, motor constant, damping and mechanical time constant, what torque does the amplifier current limit allow, and does the torsional resonance with my load fall inside the control bandwidth?",
    "description": "Derived parameters of a permanent-magnet DC control motor by the definitions the handbook gives for its idealised straight-line torque–speed characteristic: stall current V ÷ R, torque constant K_T = T_STo ÷ I_STo, voltage constant K_E = V ÷ ω_NL, motor constant K_M = K_T ÷ √R, damping D_M = T_STo ÷ ω_NL and mechanical time constant T_M = J_M ÷ D_M, with the torque at the amplifier current limit and at rated current, the speeds at those torques on the characteristic, the time constant with the load inertia, and the torsional resonance f_n = √(K ÷ J_L) ÷ 2π compared with the control bandwidth.",
    "keywords": [
      "MAKEOS",
      "DC servo motor",
      "torque constant",
      "back EMF constant",
      "motor constant",
      "mechanical time constant",
      "torsional resonance",
      "control bandwidth",
      "permanent magnet motor"
    ],
    "fields": [
      {
        "key": "h_motor_data",
        "label": "Motor data",
        "type": "heading"
      },
      {
        "key": "V",
        "label": "Rated voltage",
        "type": "number",
        "default": 48,
        "unit": "V",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Winding resistance",
        "type": "number",
        "default": 1.2,
        "unit": "Ω",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tst",
        "label": "Stall torque with no current limiting",
        "type": "number",
        "default": 4,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "NL",
        "label": "No-load speed",
        "type": "number",
        "default": 4580,
        "unit": "rpm",
        "min": 0.000001,
        "max": 200000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "JM",
        "label": "Motor (rotor) inertia",
        "type": "number",
        "default": 0.00012,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_amplifier",
        "label": "Amplifier",
        "type": "heading"
      },
      {
        "key": "IL",
        "label": "Current limit set in the amplifier",
        "type": "number",
        "default": 20,
        "unit": "A",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "IR",
        "label": "Rated (continuous) current",
        "type": "number",
        "default": 6,
        "unit": "A",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load_and_control",
        "label": "Load and control",
        "type": "heading"
      },
      {
        "key": "JL",
        "label": "Load inertia referred to the motor shaft",
        "type": "number",
        "default": 0.0004,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Torsional stiffness between motor and load",
        "type": "number",
        "default": 2000,
        "unit": "N·m/rad",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bw",
        "label": "Bandwidth of the control system",
        "type": "number",
        "default": 40,
        "unit": "Hz",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "silent-chain-sprocket-tooth-form",
    "name": "Silent Chain Sprocket Tooth Form, Hub and Hob Diameters (ANSI B29.2M)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a silent (inverted-tooth) chain sprocket of a given pitch and number of teeth, what are the tooth form diameters, the angle between the tooth faces, the largest hub that clears the chain for hobbed or straddle-cut teeth, the hob generating diameter and the depth of cut, and is the tooth count large enough?",
    "description": "Tooth form and cutting dimensions of an ANSI B29.2M silent chain sprocket by the formulas the handbook gives: for 3/8 in and larger pitch the diameter to the centre of the topping curve E = P (cot(180°/N) − 0.22) and the diameter to the base of the working face B = P √(1.515213 + (cot(180°/N) − 1.1)²) of the 60° form, the angle between the faces of a tooth 60° − 720°/N (70° − 720°/N for 3/16 in pitch), the maximum hub diameter P (cot(180°/N) − 1.33) for hobbed and − 1.25 for straddle-cut teeth, the hob generating diameter and the 0.6875 P maximum depth of cut, with the pitch diameter, checked against the handbook’s tooth-count advice and your hub size.",
    "keywords": [
      "MAKEOS",
      "silent chain sprocket",
      "inverted tooth chain",
      "sprocket tooth form",
      "hub diameter",
      "sprocket hob",
      "ANSI B29.2M",
      "straddle cutter"
    ],
    "fields": [
      {
        "key": "size",
        "label": "Chain pitch range",
        "type": "select",
        "default": "big",
        "options": [
          [
            "big",
            "3/8 in and larger (60° tooth form)"
          ],
          [
            "small",
            "3/16 in (70° tooth form)"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Chain pitch",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 21,
        "unit": "teeth",
        "min": 5,
        "max": 300,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "cut",
        "label": "Teeth cut by",
        "type": "select",
        "default": "hob",
        "options": [
          [
            "hob",
            "Hob"
          ],
          [
            "straddle",
            "Straddle cutter"
          ]
        ]
      },
      {
        "key": "hub",
        "label": "Hub diameter planned",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "helical-gear-helix-for-centre-distance",
    "name": "Helical Gear Helix Angle and Leads for a Fixed Centre Distance",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "My helical gear pair must fit a centre distance that is not the standard spur centre distance for the module and tooth numbers. What helix angle makes it fit, and what are the transverse module, pitch diameters and leads of the pinion and gear for setting up the cut?",
    "description": "Helix angle of a parallel-shaft helical gear pair chosen to fit a given centre distance, by the relation the handbook gives for normal diametral pitch (cos ψ = (N₁ + N₂) ÷ (2 P_n C)), in metric form cos ψ = m_n (z₁ + z₂) ÷ (2 a), with the leads L = π z m_n ÷ sin ψ, the transverse module and pitch diameters that add up to twice the centre distance, and the helix angle at the outside diameter from tan ψ = 2π R ÷ L, checked against the range of helix angles you accept.",
    "keywords": [
      "MAKEOS",
      "helical gear helix angle",
      "helical gear centre distance",
      "helical gear lead",
      "normal module",
      "gear milling set-up",
      "helix angle from centre distance"
    ],
    "fields": [
      {
        "key": "mn",
        "label": "Normal module",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Teeth on the pinion",
        "type": "number",
        "default": 18,
        "unit": "teeth",
        "min": 5,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Teeth on the gear",
        "type": "number",
        "default": 30,
        "unit": "teeth",
        "min": 5,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C",
        "label": "Centre distance",
        "type": "number",
        "default": 110,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_accepted_helix_angles",
        "label": "Accepted helix angles",
        "type": "heading"
      },
      {
        "key": "psiMin",
        "label": "Least helix angle you accept",
        "type": "number",
        "default": 5,
        "unit": "°",
        "min": 0,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "psiMax",
        "label": "Largest helix angle you accept",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0.1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
