// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook99) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "rim-face-arrangement-shims",
    "name": "Rim and Face Alignment for Any of the 16 Indicator Arrangements",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "For the way my rim and face dial indicators are mounted (any of the handbook’s sixteen arrangements), how much shim do I add or remove, or how far do I move the machine, at the front, rear and any extra feet, allowing for indicator bracket sag?",
    "description": "Rim and face shaft alignment moves by the handbook’s sixteen dial indicator arrangements, each with its own signs in F = r ÷ (±2) + f B ÷ (±A) and R = r ÷ (±2) + f C ÷ (±A), with the face reading circle A and the distances B, C (and up to three more foot positions) measured from the rim indicator path, positive to one side and negative to the other as for motors with more than four feet, and the indicator bracket sag added to or taken from a vertical rim reading.",
    "keywords": [
      "MAKEOS",
      "rim and face alignment arrangement",
      "dial indicator arrangement shims",
      "face and rim method signs",
      "shaft alignment extra feet",
      "indicator bracket sag correction",
      "motor to pump alignment shims"
    ],
    "fields": [
      {
        "key": "arr",
        "label": "Dial indicator arrangement (handbook Fig. 1a to 16a)",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Arrangement 1 (F = r ÷ (−2) + f B ÷ A)"
          ],
          [
            "2",
            "Arrangement 2 (F = r ÷ (−2) + f B ÷ (−A))"
          ],
          [
            "3",
            "Arrangement 3 (F = r ÷ 2 + f B ÷ (−A))"
          ],
          [
            "4",
            "Arrangement 4 (F = r ÷ 2 + f B ÷ A)"
          ],
          [
            "5",
            "Arrangement 5 (F = r ÷ (−2) + f B ÷ A)"
          ],
          [
            "6",
            "Arrangement 6 (F = r ÷ (−2) + f B ÷ (−A))"
          ],
          [
            "7",
            "Arrangement 7 (F = r ÷ 2 + f B ÷ (−A))"
          ],
          [
            "8",
            "Arrangement 8 (F = r ÷ 2 + f B ÷ A)"
          ],
          [
            "9",
            "Arrangement 9 (F = r ÷ (−2) + f B ÷ A)"
          ],
          [
            "10",
            "Arrangement 10 (F = r ÷ (−2) + f B ÷ (−A))"
          ],
          [
            "11",
            "Arrangement 11 (F = r ÷ 2 + f B ÷ (−A))"
          ],
          [
            "12",
            "Arrangement 12 (F = r ÷ 2 + f B ÷ A)"
          ],
          [
            "13",
            "Arrangement 13 (F = r ÷ (−2) + f B ÷ A)"
          ],
          [
            "14",
            "Arrangement 14 (F = r ÷ (−2) + f B ÷ (−A))"
          ],
          [
            "15",
            "Arrangement 15 (F = r ÷ 2 + f B ÷ (−A))"
          ],
          [
            "16",
            "Arrangement 16 (F = r ÷ 2 + f B ÷ A)"
          ]
        ]
      },
      {
        "key": "plane",
        "label": "Readings",
        "type": "select",
        "default": "v",
        "options": [
          [
            "v",
            "Vertical (shims under the feet)"
          ],
          [
            "h",
            "Horizontal (side-to-side moves)"
          ]
        ]
      },
      {
        "key": "r",
        "label": "Rim indicator reading r",
        "type": "number",
        "default": -0.3556,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Face indicator reading f",
        "type": "number",
        "default": 0.5334,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Diameter of the face indicator path A",
        "type": "number",
        "default": 101.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Rim indicator path to front feet B (signed)",
        "type": "number",
        "default": 165.1,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Rim indicator path to rear feet C (signed)",
        "type": "number",
        "default": 457.2,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nx",
        "label": "Extra pairs of feet between or beyond F and R",
        "type": "number",
        "default": 0,
        "unit": "pairs",
        "min": 0,
        "max": 3,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "E1",
        "label": "Rim indicator path to extra feet 1 (signed)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E2",
        "label": "Rim indicator path to extra feet 2 (signed)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E3",
        "label": "Rim indicator path to extra feet 3 (signed)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sag",
        "label": "Rim indicator bracket sag (reading on a rigid bar)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zero",
        "label": "Rim indicator zeroed at",
        "type": "select",
        "default": "12",
        "options": [
          [
            "12",
            "12 o’clock (sag is added)"
          ],
          [
            "6",
            "6 o’clock (sag is subtracted)"
          ]
        ]
      },
      {
        "key": "tol",
        "label": "Largest move you accept as aligned (0 = no check)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "jackbolt-alignment-turns",
    "name": "Jackbolt Turns and Flats for an Alignment Move",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "How many turns and head flats of the jackbolts at the front and rear of the machine give the side-to-side moves my alignment calls for?",
    "description": "Jackbolt moves for horizontal shaft alignment as the handbook works them: one full turn advances the bolt by its pitch (1 ÷ TPI for inch threads, or the metric pitch), one flat of a square head by a quarter of that and one flat of a hex head by a sixth, so the turns are the move divided by the pitch and the flats the turns times the number of flats, rounded to the nearest flat.",
    "keywords": [
      "MAKEOS",
      "jackbolt turns alignment",
      "jack bolt move per flat",
      "horizontal alignment jackbolts",
      "jackbolt advance per turn",
      "square head jackbolt flats",
      "alignment move by jackbolt"
    ],
    "fields": [
      {
        "key": "thr",
        "label": "Jackbolt thread",
        "type": "select",
        "default": "inch",
        "options": [
          [
            "inch",
            "Inch (threads per inch)"
          ],
          [
            "metric",
            "Metric (pitch in mm)"
          ]
        ]
      },
      {
        "key": "tpi",
        "label": "Threads per inch (inch thread)",
        "type": "number",
        "default": 11,
        "unit": "TPI",
        "min": 0.000001,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pitch",
        "label": "Pitch (metric thread)",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "head",
        "label": "Jackbolt head",
        "type": "select",
        "default": "4",
        "options": [
          [
            "4",
            "Square head (4 flats)"
          ],
          [
            "6",
            "Hex head (6 flats)"
          ]
        ]
      },
      {
        "key": "mF",
        "label": "Move needed at the front jackbolt",
        "type": "number",
        "default": 1.6256,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mR",
        "label": "Move needed at the rear jackbolt",
        "type": "number",
        "default": 2.3114,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "riveted-joint-strength-by-type",
    "name": "Riveted Joint Strength by Joint Type (Lap, Cover Plate and Butt Joints)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a single or double riveted lap joint, a lap joint with an inside cover plate, or a double or triple riveted butt joint, what load can each way of failing carry, which one governs, and what is the joint efficiency and safe load over my seam length?",
    "description": "Strength of riveted joints by the handbook’s formulas for six joint types: the resistances to shearing the rivets (πd²/4 times the number of rivet shear areas), tearing the plate between rivets ((P − D) t St, (P − 2D) t St, (P − 1½D) t St), crushing in front of the rivets (d t Sc) and the combined modes, the least of which is the safe load per pitch, the efficiency against the solid plate (P t St) and the safe load over the seam length, with the allowable stresses you enter.",
    "keywords": [
      "MAKEOS",
      "riveted joint efficiency",
      "double riveted butt joint",
      "lap joint with cover plate",
      "rivet shear tearing crushing",
      "triple riveted butt joint strength",
      "riveted seam safe load"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Joint type",
        "type": "select",
        "default": "lap1",
        "options": [
          [
            "lap1",
            "Single-riveted lap joint"
          ],
          [
            "lap2",
            "Double-riveted lap joint"
          ],
          [
            "lapc1",
            "Single-riveted lap joint with inside cover plate"
          ],
          [
            "lapc2",
            "Double-riveted lap joint with inside cover plate"
          ],
          [
            "butt2",
            "Double-riveted butt joint"
          ],
          [
            "butt3",
            "Triple-riveted butt joint"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Rivet diameter d (for shear and crushing)",
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
        "key": "Dh",
        "label": "Rivet hole diameter D (for tearing)",
        "type": "number",
        "default": 17.4625,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Plate thickness t",
        "type": "number",
        "default": 6.35,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Cover plate thickness tc (triple butt joint)",
        "type": "number",
        "default": 7.9375,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Pitch of the rivets p (lap joints) or inner row",
        "type": "number",
        "default": 50.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Pitch of the outer row P (cover plate and butt joints)",
        "type": "number",
        "default": 101.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Allowable shear stress of the rivets Ss",
        "type": "number",
        "default": 58.605,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "St",
        "label": "Allowable tensile stress of the plate St",
        "type": "number",
        "default": 68.948,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sc",
        "label": "Allowable bearing (crushing) stress Sc",
        "type": "number",
        "default": 137.9,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ls",
        "label": "Length of the seam",
        "type": "number",
        "default": 304.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lreq",
        "label": "Load the seam must carry (0 = no check)",
        "type": "number",
        "default": 60,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e",
        "label": "Edge distance to the rivet centres",
        "type": "number",
        "default": 25,
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
    "id": "uniform-strength-beam",
    "name": "Beam of Uniform Strength: Safe Load, Size and Outline",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a cantilever or simply supported beam shaped to uniform strength (tapered depth or width), what load can it carry at the safe stress, what depth or width does it need for my load, and what is its depth or width at a point along the span?",
    "description": "Beams of uniform strength throughout their length by the handbook’s tables: P = S b h² ÷ 6l for a cantilever with an end load (parabolic depth or triangular width), P = S b h² ÷ 3l for a cantilever with a uniformly distributed load (triangular depth or parabolic width), P = S b h² l ÷ 6ac for a simply supported beam with a load at any point (P = 2 S b h² ÷ 3l at the centre) and P = 4 S b h² ÷ 3l for a uniformly distributed load, solved for the load, the depth or the width, with the section at a chosen point from the outline the table gives.",
    "keywords": [
      "MAKEOS",
      "beam of uniform strength",
      "tapered cantilever beam",
      "parabolic beam depth",
      "triangular plate spring beam",
      "uniform strength beam formula",
      "constant stress beam"
    ],
    "fields": [
      {
        "key": "cs",
        "label": "Beam and outline",
        "type": "select",
        "default": "ce-depth",
        "options": [
          [
            "ce-depth",
            "Cantilever, end load: uniform width, depth parabolic"
          ],
          [
            "ce-width",
            "Cantilever, end load: uniform depth, width triangular"
          ],
          [
            "ce-approx",
            "Cantilever, end load: approximately uniform strength, not to a point"
          ],
          [
            "cu-depth",
            "Cantilever, distributed load: uniform width, depth triangular"
          ],
          [
            "cu-width",
            "Cantilever, distributed load: uniform depth, width two parabolas"
          ],
          [
            "sp-width",
            "Supported both ends, load at any point: uniform depth, width triangles"
          ],
          [
            "sp-depth",
            "Supported both ends, load at any point: uniform width, depth parabolas"
          ],
          [
            "su-width",
            "Supported both ends, distributed load: uniform depth, width parabolas"
          ],
          [
            "su-depth",
            "Supported both ends, distributed load: uniform width, depth half ellipse"
          ]
        ]
      },
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "load",
        "options": [
          [
            "load",
            "Safe load for this section"
          ],
          [
            "depth",
            "Depth h needed for the load"
          ],
          [
            "width",
            "Width b needed for the load"
          ]
        ]
      },
      {
        "key": "S",
        "label": "Safe stress S",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Width b at the largest section",
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
        "key": "h",
        "label": "Depth h at the largest section",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l",
        "label": "Length l (cantilever) or span (supported)",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Load point from the left support a (load at any point)",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Load P (total, for a distributed load)",
        "type": "number",
        "default": 5,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Point for the section (from the loaded end, or the left support)",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "nose-radius-finish-change",
    "name": "Surface Finish Change with Tool Nose Radius (Colding Rule)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "If I change the tool nose radius while keeping the same equivalent chip thickness and speed, how much will the surface roughness Ra change in finishing and in roughing, and what nose radius would reach my target Ra?",
    "description": "The handbook’s rule of thumb from the machining econometrics section for the effect of tool nose radius on surface finish at the same ECT and speed: Ra1 ÷ Ra2 = (r2 ÷ r1)^0.5 in finishing, with roughing values 1.5 times the finishing values, compared with the inverse proportion of the simple geometric rule that the handbook says gives large errors, and the nose radius that would give a target Ra.",
    "keywords": [
      "MAKEOS",
      "nose radius surface finish",
      "Ra and nose radius",
      "Colding surface finish rule",
      "larger nose radius finish",
      "roughing Ra 1.5",
      "equivalent chip thickness finish"
    ],
    "fields": [
      {
        "key": "Ra1",
        "label": "Ra measured with the present nose radius (finishing)",
        "type": "number",
        "default": 1.6,
        "unit": "µm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Present nose radius r1",
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
        "key": "r2",
        "label": "New nose radius r2",
        "type": "number",
        "default": 1.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rat",
        "label": "Target Ra (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
