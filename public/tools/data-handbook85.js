// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook85) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "cutter-clearance-grinding-setup",
    "name": "Milling Cutter Clearance Grinding Set-up (Clearance Needed, Wheel and Tooth-Rest Offsets, Indicator Drops)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "When I sharpen a milling cutter on a cutter grinder, what clearance angle does the cut need, how far must I offset the wheel or the tooth rest from the cutter centre to grind that angle with a disc or cup wheel, and what indicator drop should I see when I check it?",
    "description": "Set-up for grinding the clearance (relief) angle on the teeth of plain milling cutters, face mills and form-relieved cutters by the handbook’s cutter grinding rules: the clearance angle the cut needs from the feed per revolution, land width, depth of cut, cutter diameter and the Brinell hardness of the work, the offset of the disc wheel centre above the cutter centre (wheel diameter × ½ × sin clearance), below the cutter centre (cutter diameter × ½ × sin clearance), the tooth rest drop with wheel and cutter centres in line (wheel diameter × cutter diameter × sin ½ clearance ÷ (wheel + cutter diameter)) and with a cup wheel, and the indicator drops for checking the relief on side and end teeth and the rake on the tooth face over a measuring distance.",
    "keywords": [
      "MAKEOS",
      "cutter grinding",
      "clearance angle",
      "relief angle",
      "tooth rest",
      "wheel offset",
      "tool and cutter grinder",
      "indicator drop",
      "milling cutter sharpening"
    ],
    "fields": [
      {
        "key": "setup",
        "label": "Grinding set-up",
        "type": "select",
        "default": "above",
        "options": [
          [
            "above",
            "Disc wheel, centre above the cutter centre"
          ],
          [
            "below",
            "Disc wheel, centre below the cutter centre"
          ],
          [
            "inline",
            "Disc wheel, centres in line (tooth rest lowered)"
          ],
          [
            "cup",
            "Cup wheel (tooth rest below the cutter centre)"
          ]
        ]
      },
      {
        "key": "Dc",
        "label": "Cutter diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dw",
        "label": "Grinding wheel diameter",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cl",
        "label": "Clearance angle to grind",
        "type": "number",
        "default": 5,
        "unit": "°",
        "min": 0.000001,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_clearance_the_cut_needs",
        "label": "Clearance the cut needs",
        "type": "heading"
      },
      {
        "key": "F",
        "label": "Feed per revolution of the cutter",
        "type": "number",
        "default": 1,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Width of the land",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Depth of cut",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Brinell hardness of the work",
        "type": "number",
        "default": 200,
        "unit": "HB",
        "min": 10,
        "max": 800,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_indicator_check",
        "label": "Indicator check",
        "type": "heading"
      },
      {
        "key": "dist",
        "label": "Measuring distance moved under the indicator",
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
        "key": "rake",
        "label": "Rake angle of the tooth face",
        "type": "number",
        "default": 10,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spline-shaft-milling-cutter",
    "name": "Spline Shaft Milling Cutter (Cutter Angle and Chordal Width at the Root)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "To mill a straight-sided splined shaft with a formed cutter, what included angle must the cutter have and what chordal width must its concave edge have so that it cuts the space between two splines down to the root diameter?",
    "description": "Proportions of a special milling cutter that forms the space between adjacent splines of a straight-sided splined shaft, by the handbook formulas: the cutter angle B = 360° ÷ N, the angle A between the centre line of a spline and a radial line through the point where its side meets the root circle (sin A = W ÷ d), and the chordal width C = d sin(180° ÷ N − A) at the root circle between adjacent splines, which is the chordal width across the concave edge of the cutter.",
    "keywords": [
      "MAKEOS",
      "spline shaft cutter",
      "splined shaft milling",
      "straight sided spline",
      "spline cutter width",
      "formed milling cutter",
      "chordal width"
    ],
    "fields": [
      {
        "key": "Ns",
        "label": "Number of splines",
        "type": "number",
        "default": 6,
        "unit": "splines",
        "min": 3,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "W",
        "label": "Width of each spline",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Root (minor) diameter of the splined shaft",
        "type": "number",
        "default": 23,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "top-knurling-cam-rise",
    "name": "Top Knurling on an Automatic Screw Machine (Cam Rise and Revolutions)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "When I top knurl from the cross slide of an automatic screw machine, how far must the knurl travel from first contact to the centre of the work, how much rise does that need on the cam, and how many spindle revolutions and how much time does it take at my feed?",
    "description": "Cross-slide (top) knurling on an automatic screw machine by the handbook method: the distance the knurl travels from first contact to the centre of the work at full tooth depth, c = √((R + r)² − (R + r − d)²) from the stock radius, the knurl radius and the depth of the teeth, which is the cam rise required; the revolutions to knurl at the feed per revolution, and the time at the spindle speed. The tooth depth can be entered or found from the circular pitch and included angle of a sharp V tooth.",
    "keywords": [
      "MAKEOS",
      "knurling cam",
      "screw machine knurling",
      "top knurling",
      "cam rise",
      "cross slide knurling",
      "automatic screw machine"
    ],
    "fields": [
      {
        "key": "Dst",
        "label": "Stock diameter",
        "type": "number",
        "default": 7.9375,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dk",
        "label": "Knurl diameter",
        "type": "number",
        "default": 15.875,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depthFrom",
        "label": "Depth of teeth",
        "type": "select",
        "default": "pitch",
        "options": [
          [
            "pitch",
            "From circular pitch and tooth angle (sharp V)"
          ],
          [
            "given",
            "Entered directly"
          ]
        ]
      },
      {
        "key": "pc",
        "label": "Circular pitch of the knurl",
        "type": "number",
        "default": 0.79375,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Included angle of the teeth",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 30,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dg",
        "label": "Depth of teeth (when entered)",
        "type": "number",
        "default": 0.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_machine",
        "label": "Machine",
        "type": "heading"
      },
      {
        "key": "f",
        "label": "Knurling feed per revolution",
        "type": "number",
        "default": 0.127,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Spindle speed",
        "type": "number",
        "default": 2400,
        "unit": "rpm",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rubber-pad-forming-pressure",
    "name": "Rubber Pad (Guerin) Forming Pressure and Pad Thickness Check",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "In rubber pad (Guerin) forming, what pressure does the pad put on the blank for my press capacity and pad area, is it enough for the part, and is the rubber pad thick enough for the height of the form block?",
    "description": "Rubber pad forming (the Guerin process) by the handbook: the total pad forming pressure p = F × 2000 ÷ A (F press capacity in tons, A pad area in square inches), here in SI as press force divided by pad area, compared with the forming pressure your part needs, and the pad thickness against the height of the rigid form block (usually three times the block height and never less than 1.5 times), with the pad hardness against the 50 to 70 Shore range the handbook gives.",
    "keywords": [
      "MAKEOS",
      "rubber pad forming",
      "Guerin process",
      "polyurethane pad",
      "pad pressure",
      "form block",
      "hydroforming",
      "flexible die forming"
    ],
    "fields": [
      {
        "key": "h_press_and_pad",
        "label": "Press and pad",
        "type": "heading"
      },
      {
        "key": "F",
        "label": "Press capacity (force)",
        "type": "number",
        "default": 4000,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Area of the pad",
        "type": "number",
        "default": 400000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thickness of the rubber pad",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shore",
        "label": "Hardness of the pad",
        "type": "number",
        "default": 60,
        "unit": "Shore A",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_part",
        "label": "Part",
        "type": "heading"
      },
      {
        "key": "h",
        "label": "Height of the form block",
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
        "key": "preq",
        "label": "Forming pressure the part needs",
        "type": "number",
        "default": 7,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-angular-backlash",
    "name": "Angular Backlash of a Gear Pair (and Backlash from a Centre Distance Change)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "With a given backlash between two gears, how far can each gear rock back and forth while the other is held, and how much does a change in centre distance change the backlash or the tooth thickness I measure on a variable-centre fixture?",
    "description": "Angular backlash of a pair of gears from the backlash on the pitch circles by the handbook formulas: the angular movement of the larger gear with the smaller held, 6875 B ÷ D minutes, and of the smaller gear with the larger held, 6875 B ÷ d minutes, with the angular play also in degrees and arc-seconds; and the approximate relation used when tooth thickness is checked on a variable-centre-distance fixture, change in tooth thickness (or backlash) = 2 × change in centre distance × tan(transverse pressure angle), so a centre distance change can be turned into a backlash change.",
    "keywords": [
      "MAKEOS",
      "angular backlash",
      "gear backlash",
      "lost motion",
      "centre distance change",
      "backlash in minutes",
      "gear play"
    ],
    "fields": [
      {
        "key": "Bk",
        "label": "Backlash on the pitch circle",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Pitch diameter of the larger gear",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pitch diameter of the smaller gear",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_centre_distance_change",
        "label": "Centre distance change",
        "type": "heading"
      },
      {
        "key": "dC",
        "label": "Increase in centre distance (negative for a decrease)",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Transverse pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 5,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_accepted_play",
        "label": "Accepted play",
        "type": "heading"
      },
      {
        "key": "maxSmall",
        "label": "Most angular play accepted at the smaller gear",
        "type": "number",
        "default": 20,
        "unit": "min",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "unified-cut-thread-tap-limits",
    "name": "Unified Inch Cut Thread Tap Limits (Major and Pitch Diameter, ASME B94.9)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a cut thread (not ground) tap for a Unified inch screw thread, what are the minimum and maximum major and pitch diameters by the ASME B94.9 Table 3 formulas, and is my measured tap inside them?",
    "description": "Thread limits of Unified inch cut thread taps by the formulas of ASME B94.9 Table 3 that the handbook gives: minimum major diameter = basic diameter + B + C, maximum major diameter = minimum major + A, minimum pitch diameter = basic pitch diameter + B, maximum pitch diameter = minimum pitch diameter + D, where C is 20 % of the theoretical truncation for 2 to 5½ threads per inch and 25 % for 6 to 80 (calculated here), and the tolerances A and D and the amount B are entered from the table for the tap diameter and pitch. A measured tap is checked against the limits, with the lead tolerance of ±0.003 in in any inch.",
    "keywords": [
      "MAKEOS",
      "cut thread tap",
      "tap limits",
      "ASME B94.9",
      "Unified tap",
      "tap pitch diameter",
      "tap major diameter",
      "cut tap tolerance"
    ],
    "fields": [
      {
        "key": "Dn",
        "label": "Basic (nominal) diameter",
        "type": "number",
        "default": 0.25,
        "unit": "in",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 20,
        "unit": "TPI",
        "min": 2,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_table_3_values",
        "label": "Table 3 values",
        "type": "heading"
      },
      {
        "key": "A",
        "label": "Major diameter tolerance A",
        "type": "number",
        "default": 0.0025,
        "unit": "in",
        "min": 0.000001,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Amount over basic for minimum pitch diameter B",
        "type": "number",
        "default": 0.0005,
        "unit": "in",
        "min": 0,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dt",
        "label": "Pitch diameter tolerance D",
        "type": "number",
        "default": 0.002,
        "unit": "in",
        "min": 0.000001,
        "max": 0.1,
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
        "label": "Measured pitch diameter of the tap",
        "type": "number",
        "default": 0.2185,
        "unit": "in",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mm",
        "label": "Measured major diameter of the tap",
        "type": "number",
        "default": 0.2545,
        "unit": "in",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "silent-chain-width",
    "name": "Silent Chain Width for a Power (Rating per Unit Width and Service Factor)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How wide must a silent (inverted-tooth) chain be to carry my power with the service factor for the drive, from the chain’s rating per inch of width at my sprocket and speed, and does the width I have chosen carry it?",
    "description": "Silent chain width by the rules the handbook gives with the American Chain Association ratings: horsepower capacity per inch of width = rating per inch ÷ service factor, and the chain width for a given power = power × service factor ÷ rating per inch. Here in kilowatts with the rating per 25.4 mm of width entered from the rating table for the pitch, the small sprocket teeth and its speed, giving the width needed and the capacity of the width you choose, with the lubrication type the rating table shows.",
    "keywords": [
      "MAKEOS",
      "silent chain width",
      "inverted tooth chain rating",
      "chain service factor",
      "silent chain power",
      "chain drive design"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power to transmit",
        "type": "number",
        "default": 30,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Rating per 25.4 mm (1 in) of width from the table",
        "type": "number",
        "default": 9,
        "unit": "kW per 25.4 mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wChosen",
        "label": "Chain width chosen",
        "type": "number",
        "default": 127,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lube",
        "label": "Lubrication the rating table shows",
        "type": "select",
        "default": "II",
        "options": [
          [
            "I",
            "Type I: manual, brush or oil cup"
          ],
          [
            "II",
            "Type II: bath or disc"
          ],
          [
            "III",
            "Type III: circulating pump"
          ]
        ]
      },
      {
        "key": "lubeHave",
        "label": "Lubrication the drive will have",
        "type": "select",
        "default": "II",
        "options": [
          [
            "I",
            "Type I: manual, brush or oil cup"
          ],
          [
            "II",
            "Type II: bath or disc"
          ],
          [
            "III",
            "Type III: circulating pump"
          ]
        ]
      }
    ]
  }
]);
