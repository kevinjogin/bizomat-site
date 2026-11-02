// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook83) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "worm-cutter-profile-correction",
    "name": "Worm Profile Change with Cutter or Grinding Wheel Size (Profile Deviation and Pressure Angle Correction)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "If one worm is milled with a small cutter and another is ground with a large wheel, how far does each normal profile depart from a straight side, how much does each change the pressure angle, and what correction makes the two worms interchangeable?",
    "description": "Profile deviation and pressure angle change produced in a worm thread by the diameter of the milling cutter or grinding wheel, by the formulas the handbook gives from ANSI B6.9: the radius of curvature of the normal profile of an involute thread and of the thread actually produced, the difference between the pressure angle of the thread and of the tool in minutes, the slant height of the addendum, the departure of the profile from a straight side and the effect of the pressure angle change along the slant height, for two tools of different diameter, with the profile curve and pressure angle correction that make their worms alike, compared with your profile tolerance.",
    "keywords": [
      "MAKEOS",
      "worm profile",
      "worm thread grinding",
      "worm milling cutter",
      "pressure angle change",
      "profile deviation",
      "ANSI B6.9",
      "worm hob"
    ],
    "fields": [
      {
        "key": "h_worm",
        "label": "Worm",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Pitch diameter of the worm",
        "type": "number",
        "default": 22.405,
        "unit": "mm",
        "min": 0.1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lam",
        "label": "Lead angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0.5,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phin",
        "label": "Normal pressure angle of the cutter or wheel",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 5,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads (starts) on the worm",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "a",
        "label": "Addendum of the worm",
        "type": "number",
        "default": 1.12,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tools",
        "label": "Tools",
        "type": "heading"
      },
      {
        "key": "Dc",
        "label": "First tool diameter (milling cutter)",
        "type": "number",
        "default": 50.8,
        "unit": "mm",
        "min": 1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dw",
        "label": "Second tool diameter (grinding wheel)",
        "type": "number",
        "default": 508,
        "unit": "mm",
        "min": 1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tolerance",
        "label": "Tolerance",
        "type": "heading"
      },
      {
        "key": "tolY",
        "label": "Profile tolerance accepted (curve departure)",
        "type": "number",
        "default": 0.005,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolS",
        "label": "Tolerance accepted along the slant height (pressure angle)",
        "type": "number",
        "default": 0.005,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "industrial-worm-gearing-design",
    "name": "Industrial Worm Gearing Proportions (Coarse Pitch: Diameters, Lead Angle, Face Width, Thread Length, Efficiency)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For a coarse-pitch power worm and wormgear, what diameters, lead angle, tooth depths, face width and worm thread length do the handbook rules give at my pitch, ratio and centre distance, and what efficiency, rubbing speed and hunting-tooth action follow?",
    "description": "Proportions of industrial (coarse-pitch) worm gearing by the rules and formulas of the handbook’s Table 4 and the AGMA proportions it gives: ratio and lead, wormgear pitch diameter from teeth and axial pitch, worm pitch diameter from the centre distance (or the centre distance from a chosen worm), lead angle, normal pitch, addendum, whole depth, dedendum and clearance, worm outside diameter, wormgear throat diameter and throat radius, wormgear outside diameter by the lead-angle and thread-count rules, face width for shell or integral worms, worm thread length, rubbing speed, efficiency with the worm or the wormgear driving by the friction-angle formulas and the empirical rules, the hunting-tooth check, the teeth-plus-threads total and the pressure angle the handbook relates to the lead angle.",
    "keywords": [
      "MAKEOS",
      "worm gearing",
      "industrial worm",
      "coarse pitch worm",
      "lead angle",
      "hunting tooth",
      "wormgear throat diameter",
      "worm efficiency"
    ],
    "fields": [
      {
        "key": "h_worm_set",
        "label": "Worm set",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Axial pitch of the worm (circular pitch of the wormgear)",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.5,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Threads (starts) on the worm",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "T",
        "label": "Teeth on the wormgear",
        "type": "number",
        "default": 36,
        "unit": "",
        "min": 10,
        "max": 400,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "phi",
        "label": "Pressure angle chosen",
        "type": "number",
        "default": 25,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_size",
        "label": "Size",
        "type": "heading"
      },
      {
        "key": "mode",
        "label": "Size the worm from",
        "type": "select",
        "default": "C",
        "options": [
          [
            "C",
            "The centre distance (fixed)"
          ],
          [
            "d",
            "A chosen worm pitch diameter"
          ]
        ]
      },
      {
        "key": "C",
        "label": "Centre distance (used when it is fixed)",
        "type": "number",
        "default": 91.44,
        "unit": "mm",
        "min": 5,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dw",
        "label": "Worm pitch diameter (used when chosen)",
        "type": "number",
        "default": 37.36,
        "unit": "mm",
        "min": 2,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Tooth proportions from",
        "type": "select",
        "default": "normal",
        "options": [
          [
            "axial",
            "Axial pitch (Table 4 rules)"
          ],
          [
            "normal",
            "Normal pitch (lead angles over 15–20°)"
          ]
        ]
      },
      {
        "key": "mount",
        "label": "Worm construction",
        "type": "select",
        "default": "shell",
        "options": [
          [
            "shell",
            "Shell worm (bored, fitted on a shaft)"
          ],
          [
            "integral",
            "Threads integral with the shaft"
          ]
        ]
      },
      {
        "key": "h_running",
        "label": "Running",
        "type": "heading"
      },
      {
        "key": "nw",
        "label": "Worm speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 1,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Coefficient of friction (worm on wormgear)",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0.001,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "worm-hob-design",
    "name": "Wormgear Hob Design (Over-Size Diameters, Sharpening Allowance, Setting Angle, Flutes)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For a hob to cut my wormgear, what outside, root and pitch diameters should it have with the AGMA sharpening allowance, at what angle should it be set, how many flutes should it have, and what flute lead lets me relieve a helical-fluted hob?",
    "description": "Wormgear hob proportions by the handbook’s formulas and AGMA practice: the over-size sharpening allowance from the normal pitch and the helix angles at the outside and pitch diameters (solved together with the diameters it changes), the hob outside, root and pitch diameters, the hob lead angle and the extra setting angle that makes up for the smaller lead angle of an over-size hob, the approximate number of flutes by the handbook rule with a count that has no common factor with the threads, the common-factor check between hob threads and wormgear teeth, flute pitch and gash width at the periphery, and for helical flutes at right angles to the thread, the teeth per turn along the thread and the modified flute lead and angle that suit the relieving attachment.",
    "keywords": [
      "MAKEOS",
      "worm hob",
      "wormgear hob",
      "hob sharpening allowance",
      "over-size hob",
      "hob flutes",
      "gashes",
      "helical fluted hob"
    ],
    "fields": [
      {
        "key": "h_worm_and_wormgear",
        "label": "Worm and wormgear",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Pitch diameter of the worm",
        "type": "number",
        "default": 50.8,
        "unit": "mm",
        "min": 2,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Axial pitch of the worm",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.2,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Threads (starts) on the worm and hob",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Tg",
        "label": "Teeth on the wormgear",
        "type": "number",
        "default": 41,
        "unit": "",
        "min": 10,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "A",
        "label": "Addendum of the worm and wormgear",
        "type": "number",
        "default": 4.04,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cl",
        "label": "Clearance between worm and wormgear",
        "type": "number",
        "default": 0.84,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_flutes",
        "label": "Flutes",
        "type": "heading"
      },
      {
        "key": "Fl",
        "label": "Number of flutes (gashes) on the hob",
        "type": "number",
        "default": 9,
        "unit": "",
        "min": 3,
        "max": 60,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "fl",
        "label": "Flute direction",
        "type": "select",
        "default": "straight",
        "options": [
          [
            "straight",
            "Straight, parallel to the axis"
          ],
          [
            "helical",
            "Helical, at about right angles to the thread"
          ]
        ]
      },
      {
        "key": "Nrel",
        "label": "Teeth per turn along the thread the relieving gears suit (helical flutes)",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "metric-tap-thread-limits",
    "name": "Metric Ground Thread Tap Limits (M Profile: Pitch and Major Diameter, D and DU Limit Numbers)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a metric M-profile ground thread tap, what are its pitch and major diameter limits for the standard limits or a D or DU limit number, what limit number is it, and is the tap I measured within them?",
    "description": "Pitch diameter and major diameter limits of an ASME B94.9 metric (M profile) ground thread tap by the formulas the handbook gives: the symmetrical thread height and basic pitch diameter, the maximum and minimum tap pitch diameters for the standard limits or for a D (over basic) or DU (under basic) limit number in steps of 0.013 mm, the equivalent limit number, the minimum major diameter from the specified tap pitch diameter and the maximum major diameter, with your measured pitch and major diameters checked against them; the table allowances for the size and pitch are entered by you.",
    "keywords": [
      "MAKEOS",
      "tap limits",
      "tap pitch diameter",
      "D limit",
      "DU limit",
      "ASME B94.9",
      "ground thread tap",
      "metric tap"
    ],
    "fields": [
      {
        "key": "h_thread",
        "label": "Thread",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Basic major (nominal) diameter",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 1,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.2,
        "max": 8,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tap_limits",
        "label": "Tap limits",
        "type": "heading"
      },
      {
        "key": "lim",
        "label": "Pitch diameter limits",
        "type": "select",
        "default": "std",
        "options": [
          [
            "std",
            "Standard: maximum = basic + Y"
          ],
          [
            "D",
            "D limit number (maximum over basic)"
          ],
          [
            "DU",
            "DU limit number (minimum under basic)"
          ]
        ]
      },
      {
        "key": "num",
        "label": "Limit number (D or DU)",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "X",
        "label": "Major diameter tolerance X (from the table)",
        "type": "number",
        "default": 0.041,
        "unit": "mm",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Amount over basic for the maximum pitch diameter Y (from the table)",
        "type": "number",
        "default": 0.065,
        "unit": "mm",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Z",
        "label": "Pitch diameter tolerance Z (from the table)",
        "type": "number",
        "default": 0.025,
        "unit": "mm",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measured_tap",
        "label": "Measured tap",
        "type": "heading"
      },
      {
        "key": "PDm",
        "label": "Measured pitch diameter",
        "type": "number",
        "default": 5.4,
        "unit": "mm",
        "min": 0.5,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mm",
        "label": "Measured major diameter",
        "type": "number",
        "default": 6.1,
        "unit": "mm",
        "min": 0.5,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "unified-tap-thread-limits",
    "name": "Unified Inch Ground Thread Tap Limits (Pitch and Major Diameter, H and L Limit Numbers)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a Unified inch ground thread tap, what are its pitch and major diameter limits for the standard limits or an H or L limit number, what limit number is it, and is the tap I measured within them?",
    "description": "Pitch diameter and major diameter limits of an ASME B94.9 Unified inch ground thread tap by the formulas the handbook gives: thread height and basic pitch diameter from the threads per inch, the minimum and maximum tap pitch diameters for the standard limits (minimum C over basic) or for an H (over basic) or L (under basic) limit number in steps of 0.0005 in, the equivalent limit number, the maximum major diameter from the specified tap pitch diameter with the constant A = 0.130 P, and the minimum major diameter with the tolerance B by threads per inch, with your measured diameters checked against them; the table allowances C and D for the size are entered by you.",
    "keywords": [
      "MAKEOS",
      "tap limits",
      "H limit",
      "L limit",
      "tap pitch diameter",
      "ASME B94.9",
      "Unified tap",
      "ground thread tap"
    ],
    "fields": [
      {
        "key": "h_thread",
        "label": "Thread",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Basic major (nominal) diameter",
        "type": "number",
        "default": 0.375,
        "unit": "in",
        "min": 0.05,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 16,
        "unit": "TPI",
        "min": 4,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tap_limits",
        "label": "Tap limits",
        "type": "heading"
      },
      {
        "key": "lim",
        "label": "Pitch diameter limits",
        "type": "select",
        "default": "std",
        "options": [
          [
            "std",
            "Standard: minimum = basic + C"
          ],
          [
            "H",
            "H limit number (maximum over basic)"
          ],
          [
            "L",
            "L limit number (minimum under basic)"
          ]
        ]
      },
      {
        "key": "num",
        "label": "Limit number (H or L)",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C",
        "label": "Amount over basic for the minimum pitch diameter C (from the table)",
        "type": "number",
        "default": 0.001,
        "unit": "in",
        "min": 0,
        "max": 0.05,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dt",
        "label": "Pitch diameter tolerance D (from the table)",
        "type": "number",
        "default": 0.0005,
        "unit": "in",
        "min": 0.000001,
        "max": 0.05,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measured_tap",
        "label": "Measured tap",
        "type": "heading"
      },
      {
        "key": "PDm",
        "label": "Measured pitch diameter",
        "type": "number",
        "default": 0.3357,
        "unit": "in",
        "min": 0.01,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mm",
        "label": "Measured major diameter",
        "type": "number",
        "default": 0.381,
        "unit": "in",
        "min": 0.01,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "slot-vs-high-speed-milling-cost",
    "name": "Slot Milling against High-Speed End Milling (Feed Rate, Equivalent Tooling Time, Cost per Part)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Does full slot end milling or high-speed end milling with a light radial cut cost less per part for my cut length, cutter, feeds, speeds and tooling costs, and by how much?",
    "description": "Comparison of two end milling strategies by the handbook’s machining econometrics: spindle speed from cutting speed and cutter diameter, feed rate from teeth, feed per tooth and speed, cutting time for the cut length and passes, equivalent tooling-cost time from the edge replacement time and the cost of the edges at the hourly rate, and the total cost per part of cutting, tool changing and tooling for full slot milling and for high-speed milling, with the cost ratio, the saving per part and per batch, and a check of both spindle speeds against the machine.",
    "keywords": [
      "MAKEOS",
      "high-speed milling",
      "slot milling",
      "end milling cost",
      "feed rate",
      "equivalent tooling cost time",
      "machining econometrics",
      "cost per part"
    ],
    "fields": [
      {
        "key": "h_job",
        "label": "Job",
        "type": "heading"
      },
      {
        "key": "Dc",
        "label": "Cutter diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.5,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dist",
        "label": "Cut length per pass",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 1,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "HR",
        "label": "Hourly rate of machine and operator (ex GST)",
        "type": "number",
        "default": 50,
        "unit": "A$/h",
        "min": 1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Parts in the batch",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": 1,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "nmax",
        "label": "Maximum spindle speed of the machine",
        "type": "number",
        "default": 20000,
        "unit": "rpm",
        "min": 100,
        "max": 200000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_full_slot_milling",
        "label": "Full slot milling",
        "type": "heading"
      },
      {
        "key": "zS",
        "label": "Teeth (slot)",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "fzS",
        "label": "Feed per tooth (slot)",
        "type": "number",
        "default": 0.17,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "VS",
        "label": "Cutting speed (slot)",
        "type": "number",
        "default": 249,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TS",
        "label": "Tool life (slot)",
        "type": "number",
        "default": 45,
        "unit": "min",
        "min": 0.1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pS",
        "label": "Passes per part (slot)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "trS",
        "label": "Time to replace the edges (slot)",
        "type": "number",
        "default": 2,
        "unit": "min",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ceS",
        "label": "Cost of the edges or cutter regrind (slot, ex GST)",
        "type": "number",
        "default": 10,
        "unit": "A$",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_high_speed_milling",
        "label": "High-speed milling",
        "type": "heading"
      },
      {
        "key": "zH",
        "label": "Teeth (high-speed)",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "fzH",
        "label": "Feed per tooth (high-speed)",
        "type": "number",
        "default": 0.628,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "VH",
        "label": "Cutting speed (high-speed)",
        "type": "number",
        "default": 375,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TH",
        "label": "Tool life (high-speed)",
        "type": "number",
        "default": 45,
        "unit": "min",
        "min": 0.1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pH",
        "label": "Passes per part (high-speed)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "trH",
        "label": "Time to replace the edges (high-speed)",
        "type": "number",
        "default": 2,
        "unit": "min",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ceH",
        "label": "Cost of the edges or cutter regrind (high-speed, ex GST)",
        "type": "number",
        "default": 10,
        "unit": "A$",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
