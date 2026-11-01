// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook74) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "boring-bar-overhang-check",
    "name": "Boring Bar Overhang Check (Deflection, Diameter Error, Natural Frequency, Longest Overhang)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "At this overhang and cut, how far does the boring bar deflect, how much diameter error does that cause, how stiff and how lively is the bar, and how long could the overhang be for the tolerance?",
    "description": "Check of a solid round boring bar: the cutting force from the specific cutting force, depth of cut and feed, the radial share of it, the tip deflection of the bar as a cantilever (as the boring bar deflection tool) and the diameter error it causes, the overhang ratio against your limit, the first natural frequency of the bar, the longest overhang and the largest feed that keep the diameter error within your allowance, and the same figures for a bar of a stiffer material such as carbide.",
    "keywords": [
      "MAKEOS",
      "boring bar",
      "overhang",
      "L/D ratio",
      "deflection",
      "chatter",
      "carbide bar"
    ],
    "fields": [
      {
        "key": "h_bar",
        "label": "Bar",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Bar diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Overhang from the clamp to the cutting edge",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Bar elastic modulus",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Bar density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 100,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cut",
        "label": "Cut",
        "type": "heading"
      },
      {
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 2000,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Radial depth of cut",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.15,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rr",
        "label": "Radial force as a share of the cutting force",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits_and_alternative",
        "label": "Limits and alternative",
        "type": "heading"
      },
      {
        "key": "allow",
        "label": "Diameter error the tolerance allows",
        "type": "number",
        "default": 20,
        "unit": "µm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "LDmax",
        "label": "Largest overhang ratio you accept for this bar material",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ealt",
        "label": "Modulus of the alternative bar material",
        "type": "number",
        "default": 600,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoAlt",
        "label": "Density of the alternative bar material",
        "type": "number",
        "default": 14500,
        "unit": "kg/m³",
        "min": 100,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "slender-work-turning-check",
    "name": "Slender Work Turning Check (Work Deflection, Diameter Error, Steady Rest Spacing)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "When turning a long, slender part, how far does the cutting force push the work away from the tool, how much diameter error does that cause, and how far apart must steady rests be to hold the tolerance?",
    "description": "Check of a slender round part turned between centres or held in a chuck only: the cutting and radial forces from the specific cutting force, depth of cut and feed, the deflection of the work at the worst tool position (mid-span between centres, or the free end in a chuck, as the beam deflection tool), the diameter error and the length-to-diameter ratio, the longest unsupported length that holds your allowance, the number of steady rests needed between centres, and the largest feed for the full length.",
    "keywords": [
      "MAKEOS",
      "slender shaft",
      "turning",
      "steady rest",
      "between centres",
      "work deflection",
      "L/D"
    ],
    "fields": [
      {
        "key": "hold",
        "label": "Work holding",
        "type": "select",
        "default": "centres",
        "options": [
          [
            "centres",
            "Between centres (simply supported)"
          ],
          [
            "chuck",
            "In a chuck only (cantilever)"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Work diameter at the cut",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length between centres, or overhang from the chuck",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Work elastic modulus",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cut",
        "label": "Cut",
        "type": "heading"
      },
      {
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 2000,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Depth of cut",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.2,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rr",
        "label": "Radial force as a share of the cutting force",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0,
        "max": 2,
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
        "key": "allow",
        "label": "Diameter error the tolerance allows",
        "type": "number",
        "default": 30,
        "unit": "µm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "reaming-plan",
    "name": "Reaming Plan (Drilled Size, Stock, Speeds, Cycle Time, Holes per Reamer)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "To ream a batch of holes to size, what size should the pilot hole be drilled, how much stock is left, what spindle speeds and cycle time result, and how many holes will a reamer do?",
    "description": "Plan for drilling and reaming holes: the pilot drill size from the finished size and your reaming allowance, the radial stock per side against your range, the drilling and reaming spindle speeds and feed rates (drilling as the drilling cycle planner tool), the feed per reamer tooth, the time per hole including the reamer's retract, the total time for the batch, and the holes per reamer and reamers needed from the reamer's life in metres of hole.",
    "keywords": [
      "MAKEOS",
      "reaming",
      "reaming allowance",
      "pilot drill",
      "reamer life",
      "cycle time",
      "hole finishing"
    ],
    "fields": [
      {
        "key": "Df",
        "label": "Finished hole diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Reaming allowance on diameter",
        "type": "number",
        "default": 0.25,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Hole depth",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holes",
        "label": "Number of holes",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": 1,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_drilling_the_pilot",
        "label": "Drilling the pilot",
        "type": "heading"
      },
      {
        "key": "vcD",
        "label": "Drilling cutting speed",
        "type": "number",
        "default": 25,
        "unit": "m/min",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fD",
        "label": "Drilling feed",
        "type": "number",
        "default": 0.15,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "point",
        "label": "Drill point angle",
        "type": "number",
        "default": 118,
        "unit": "°",
        "min": 60,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_reaming",
        "label": "Reaming",
        "type": "heading"
      },
      {
        "key": "vcR",
        "label": "Reaming cutting speed",
        "type": "number",
        "default": 10,
        "unit": "m/min",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fR",
        "label": "Reaming feed",
        "type": "number",
        "default": 0.4,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Reamer teeth",
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
        "key": "retract",
        "label": "Reamer retract",
        "type": "select",
        "default": "feed",
        "options": [
          [
            "feed",
            "At feed rate (common for a good finish)"
          ],
          [
            "rapid",
            "At rapid traverse"
          ]
        ]
      },
      {
        "key": "h_times_and_limits",
        "label": "Times and limits",
        "type": "heading"
      },
      {
        "key": "clear",
        "label": "Approach and breakthrough clearance",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pos",
        "label": "Positioning or tool change time per hole",
        "type": "number",
        "default": 3,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lifeM",
        "label": "Reamer life in metres of reamed hole",
        "type": "number",
        "default": 30,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sMin",
        "label": "Smallest radial stock you accept",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sMax",
        "label": "Largest radial stock you accept",
        "type": "number",
        "default": 0.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMax",
        "label": "Highest spindle speed available",
        "type": "number",
        "default": 4000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "dowel-pin-joint-check",
    "name": "Dowel Pin Joint Check (Pin Shear, Bearing, Fit Interference, Engagement)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Will the dowel pins locating two parts carry the sideways load without shearing or crushing the holes, what fit do the chosen pin and hole limits give, and is each pin engaged deeply enough?",
    "description": "Check of dowel pins locating two parts under a lateral load: the shear stress in the pins (as the bolt and pin shear and bearing tool, with equal sharing), the bearing stress on the shorter engagement in the softer part, both against your allowables, the largest and smallest interference from the pin and hole limits you enter, the type of fit that results, and the engagement in each part as a multiple of the pin diameter against your requirement.",
    "keywords": [
      "MAKEOS",
      "dowel pin",
      "locating pin",
      "pin shear",
      "bearing stress",
      "press fit",
      "transition fit"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Pin diameter",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of pins sharing the load",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "planes",
        "label": "Shear planes per pin",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Single shear (two parts)"
          ],
          [
            "2",
            "Double shear (three parts)"
          ]
        ]
      },
      {
        "key": "F",
        "label": "Lateral load on the joint",
        "type": "number",
        "default": 6000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_engagement_and_allowables",
        "label": "Engagement and allowables",
        "type": "heading"
      },
      {
        "key": "t1",
        "label": "Engagement in the first part",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2",
        "label": "Engagement in the second part",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tauA",
        "label": "Allowable shear stress in the pin",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bA",
        "label": "Allowable bearing stress in the softer part",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "engReq",
        "label": "Least engagement as a multiple of the pin diameter",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits_of_size",
        "label": "Limits of size",
        "type": "heading"
      },
      {
        "key": "pinUp",
        "label": "Pin upper deviation",
        "type": "number",
        "default": 15,
        "unit": "µm",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pinLo",
        "label": "Pin lower deviation",
        "type": "number",
        "default": 6,
        "unit": "µm",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holeUp",
        "label": "Hole upper deviation",
        "type": "number",
        "default": 15,
        "unit": "µm",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holeLo",
        "label": "Hole lower deviation",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "taper-shank-holding-check",
    "name": "Taper Shank Holding Check (Drilling Torque, Thrust, Taper Friction Torque, Self-Holding)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "When a taper-shank drill cuts, can the friction in the taper alone carry the drilling torque, or does the tool need its tang or a drawbar, and is the taper self-holding?",
    "description": "Check of a taper-shank tool in its socket while drilling: the spindle speed, cutting power, torque and approximate thrust of the drill (as the drilling cycle planner tool), the normal force the thrust develops on a taper of the given rate, the friction torque the taper can carry from it at the mean engaged diameter, the ratio of that capacity to the drilling torque against your safety factor, and whether the taper angle is small enough to be self-holding for the friction coefficient you enter.",
    "keywords": [
      "MAKEOS",
      "Morse taper",
      "taper shank",
      "self-holding taper",
      "drilling torque",
      "tang",
      "drawbar"
    ],
    "fields": [
      {
        "key": "h_drill_and_cut",
        "label": "Drill and cut",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Drill diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 25,
        "unit": "m/min",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.25,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
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
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "point",
        "label": "Point angle",
        "type": "number",
        "default": 118,
        "unit": "°",
        "min": 60,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_taper",
        "label": "Taper",
        "type": "heading"
      },
      {
        "key": "Dl",
        "label": "Large diameter of the taper at the gauge line",
        "type": "number",
        "default": 24,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Taper on diameter per unit length",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0.0001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Le",
        "label": "Engaged length of the taper",
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
        "key": "mu",
        "label": "Friction coefficient in the taper",
        "type": "number",
        "default": 0.1,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Required ratio of taper capacity to drilling torque",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
