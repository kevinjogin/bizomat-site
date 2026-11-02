// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook62) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "intermittent-fillet-weld-plan",
    "name": "Intermittent Fillet Weld Plan (Continuous Leg, Segment Count and Pitch, Cost Saving)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "For a lightly loaded joint, can I use intermittent fillet welds instead of a continuous weld, how many segments at what pitch, and how much does it save?",
    "description": "Plan of a fillet-welded joint along a given length: the throat and leg needed with a continuous weld and its cost (as the fillet weld joint design tool), then intermittent segments of a chosen length at the minimum leg for the plate thickness — the total length needed, the number of segments so that the clear gap between them stays within your limit, the pitch, and the cost of the intermittent weld (as the same tool for the shorter total length), with the saving against the continuous weld.",
    "keywords": [
      "MAKEOS",
      "intermittent weld",
      "stitch weld",
      "fillet weld",
      "weld pitch",
      "weld cost",
      "chain intermittent"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Load on the joint",
        "type": "number",
        "default": 60,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lj",
        "label": "Joint length available to weld",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Allowable throat shear stress",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "amin",
        "label": "Minimum leg for the plate thickness",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thinner plate thickness",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ls",
        "label": "Segment length",
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
        "key": "gapMax",
        "label": "Largest clear gap between segments",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cost",
        "label": "Cost",
        "type": "heading"
      },
      {
        "key": "excess",
        "label": "Convexity and overfill allowance",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Weld metal density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dep",
        "label": "Deposition rate",
        "type": "number",
        "default": 3,
        "unit": "kg/h",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "of",
        "label": "Operating factor (arc-on share)",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Filler deposition efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Labour and overhead rate",
        "type": "number",
        "default": 80,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wire",
        "label": "Filler price",
        "type": "number",
        "default": 4,
        "unit": "$/kg",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "acme-nut-bore-inspection",
    "name": "Acme Nut Bore Inspection (Minor Diameter Limits, Drill Choice, Measured Bore)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For an Acme nut, what are the limits on the minor diameter of the bore, which fractional drill falls between them, and does my measured bore pass?",
    "description": "Inspection and drill choice for the minor diameter of an internal Acme thread: the smallest and largest minor diameter for general-purpose or centralizing classes, and the drill size range allowing for the drill cutting oversize (as the Acme tap drill tool), the nearest fractional (64ths) drill within that range, and the measured bore against the minor diameter limits.",
    "keywords": [
      "MAKEOS",
      "Acme thread",
      "Acme nut",
      "tap drill",
      "minor diameter",
      "lead screw nut",
      "bore inspection"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Basic major diameter",
        "type": "number",
        "default": 1,
        "unit": "in",
        "min": 0.1,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tpi",
        "label": "Threads per inch",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cls",
        "label": "Class",
        "type": "select",
        "default": "G",
        "options": [
          [
            "G",
            "General purpose (2G, 3G, 4G)"
          ],
          [
            "C24",
            "Centralizing 2C, 3C, 4C"
          ],
          [
            "C56",
            "Centralizing 5C, 6C"
          ]
        ]
      },
      {
        "key": "over",
        "label": "Probable drill oversize",
        "type": "number",
        "default": 0.0046,
        "unit": "in",
        "min": 0,
        "max": 0.05,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Bm",
        "label": "Measured bore diameter",
        "type": "number",
        "default": 0.805,
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
    "id": "form-tool-profile-plan",
    "name": "Form Tool Profile Plan (Step Depths and Angles on a Flat or Circular Tool)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For a form tool cutting a stepped or angled profile, what depths and angles must be ground on the tool for each step, and does the profile fit the tool?",
    "description": "Plan of a form tool profile with up to four steps measured from the largest diameter of the work: for a flat tool with front clearance, the depth and angle of each step on the tool (as the forming tool depth tool, flat mode); for a circular tool with its face below centre, the radius of the tool at each step (as the same tool, circular mode), against the usable depth of the flat tool or the smallest radius the circular tool can have.",
    "keywords": [
      "MAKEOS",
      "form tool",
      "circular form tool",
      "profile depth",
      "clearance angle",
      "step depth",
      "tool grinding"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Tool",
        "type": "select",
        "default": "flat",
        "options": [
          [
            "flat",
            "Flat tool with clearance"
          ],
          [
            "circular",
            "Circular tool (face below centre)"
          ]
        ]
      },
      {
        "key": "C",
        "label": "Front clearance angle (flat)",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0.000001,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rt",
        "label": "Largest radius of the circular tool",
        "type": "number",
        "default": 38.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "off",
        "label": "Face offset below centre (circular)",
        "type": "number",
        "default": 6.35,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_1",
        "label": "Step 1",
        "type": "heading"
      },
      {
        "key": "D1",
        "label": "Radial depth from the largest work diameter (0 = unused)",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A1",
        "label": "Flank angle on the work (flat)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_2",
        "label": "Step 2",
        "type": "heading"
      },
      {
        "key": "D2",
        "label": "Radial depth from the largest work diameter (0 = unused)",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A2",
        "label": "Flank angle on the work (flat)",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_3",
        "label": "Step 3",
        "type": "heading"
      },
      {
        "key": "D3",
        "label": "Radial depth from the largest work diameter (0 = unused)",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A3",
        "label": "Flank angle on the work (flat)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_4",
        "label": "Step 4",
        "type": "heading"
      },
      {
        "key": "D4",
        "label": "Radial depth from the largest work diameter (0 = unused)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A4",
        "label": "Flank angle on the work (flat)",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits",
        "label": "Limits",
        "type": "heading"
      },
      {
        "key": "hMax",
        "label": "Usable profile depth of the flat tool",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rMin",
        "label": "Smallest radius allowed on the circular tool",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "taper-disc-gauge-check",
    "name": "Taper Disc Gauge Check (Centre Distance for a Taper, Taper from the Measured Setting)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For a disc-type taper gauge set to a taper per foot, what centre distance and reading over the discs should it have, and what taper does my measured setting actually give?",
    "description": "Set-up and check of a two-disc taper gauge: the centre distance of the discs for a taper per foot along the centre line (as the taper discs tool), the reading over the outsides of the discs at that distance, the actual taper and included angle from a measured reading over the discs (as the same tool from diameters and centre distance), and the error against your tolerance on the taper.",
    "keywords": [
      "MAKEOS",
      "taper gauge",
      "disc gauge",
      "taper per foot",
      "centre distance",
      "included angle",
      "taper inspection"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Large disc diameter",
        "type": "number",
        "default": 1.5,
        "unit": "in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Small disc diameter",
        "type": "number",
        "default": 1,
        "unit": "in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Taper per foot wanted (on diameter)",
        "type": "number",
        "default": 0.75,
        "unit": "in/ft",
        "min": 0.0001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolT",
        "label": "Taper tolerance (±)",
        "type": "number",
        "default": 0.002,
        "unit": "in/ft",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mm",
        "label": "Measured reading over the discs (along their centre line)",
        "type": "number",
        "default": 9.255,
        "unit": "in",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "composite-rotor-inertia",
    "name": "Composite Rotor Inertia and Energy (Up to Three Shapes, Offsets, Stored and Released Energy)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a rotor built up from rings, tori, cones, shells or tubes, what is its total moment of inertia, how much energy does it store at speed, and is the energy given up for my allowed slow-down enough for the duty?",
    "description": "Inertia and energy of a rotating assembly of up to three bodies: the moment of inertia of each body about its own axis or a diameter, moved to the rotation axis by its offset (as the more mass moments of inertia tool), the total inertia and radius of gyration, the kinetic energy at speed and the energy released for the allowed speed drop, against the energy each cycle of the duty needs.",
    "keywords": [
      "MAKEOS",
      "moment of inertia",
      "flywheel",
      "rotor",
      "kinetic energy",
      "radius of gyration",
      "parallel axis"
    ],
    "fields": [
      {
        "key": "h_body_1",
        "label": "Body 1",
        "type": "heading"
      },
      {
        "key": "shape1",
        "label": "Body and axis",
        "type": "select",
        "default": "torus",
        "options": [
          [
            "cone",
            "Solid cone about its axis (A = base dia)"
          ],
          [
            "conebase",
            "Solid cone about a base diameter (A = base dia, B = height)"
          ],
          [
            "hsphere",
            "Hollow sphere about a diameter (A = outer dia, B = inner dia)"
          ],
          [
            "shell",
            "Thin spherical shell about a diameter (A = dia)"
          ],
          [
            "torus",
            "Torus about its axis (A = centre-line dia, B = tube dia)"
          ],
          [
            "ellipsoid",
            "Ellipsoid about axis A (B, C = the other full axes)"
          ],
          [
            "ring",
            "Thin ring about a diameter (A = dia)"
          ],
          [
            "tube",
            "Thin-walled cylinder about its axis (A = dia)"
          ]
        ]
      },
      {
        "key": "m1",
        "label": "Mass (0 = unused)",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A1",
        "label": "Dimension A",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B1",
        "label": "Dimension B",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C1",
        "label": "Dimension C",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "o1",
        "label": "Offset of its axis from the rotation axis",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_body_2",
        "label": "Body 2",
        "type": "heading"
      },
      {
        "key": "shape2",
        "label": "Body and axis",
        "type": "select",
        "default": "tube",
        "options": [
          [
            "cone",
            "Solid cone about its axis (A = base dia)"
          ],
          [
            "conebase",
            "Solid cone about a base diameter (A = base dia, B = height)"
          ],
          [
            "hsphere",
            "Hollow sphere about a diameter (A = outer dia, B = inner dia)"
          ],
          [
            "shell",
            "Thin spherical shell about a diameter (A = dia)"
          ],
          [
            "torus",
            "Torus about its axis (A = centre-line dia, B = tube dia)"
          ],
          [
            "ellipsoid",
            "Ellipsoid about axis A (B, C = the other full axes)"
          ],
          [
            "ring",
            "Thin ring about a diameter (A = dia)"
          ],
          [
            "tube",
            "Thin-walled cylinder about its axis (A = dia)"
          ]
        ]
      },
      {
        "key": "m2",
        "label": "Mass (0 = unused)",
        "type": "number",
        "default": 5,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A2",
        "label": "Dimension A",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B2",
        "label": "Dimension B",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C2",
        "label": "Dimension C",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "o2",
        "label": "Offset of its axis from the rotation axis",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_body_3",
        "label": "Body 3",
        "type": "heading"
      },
      {
        "key": "shape3",
        "label": "Body and axis",
        "type": "select",
        "default": "cone",
        "options": [
          [
            "cone",
            "Solid cone about its axis (A = base dia)"
          ],
          [
            "conebase",
            "Solid cone about a base diameter (A = base dia, B = height)"
          ],
          [
            "hsphere",
            "Hollow sphere about a diameter (A = outer dia, B = inner dia)"
          ],
          [
            "shell",
            "Thin spherical shell about a diameter (A = dia)"
          ],
          [
            "torus",
            "Torus about its axis (A = centre-line dia, B = tube dia)"
          ],
          [
            "ellipsoid",
            "Ellipsoid about axis A (B, C = the other full axes)"
          ],
          [
            "ring",
            "Thin ring about a diameter (A = dia)"
          ],
          [
            "tube",
            "Thin-walled cylinder about its axis (A = dia)"
          ]
        ]
      },
      {
        "key": "m3",
        "label": "Mass (0 = unused)",
        "type": "number",
        "default": 2,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A3",
        "label": "Dimension A",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B3",
        "label": "Dimension B",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C3",
        "label": "Dimension C",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "o3",
        "label": "Offset of its axis from the rotation axis",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "n",
        "label": "Speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "drop",
        "label": "Allowed speed drop",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0.1,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ereq",
        "label": "Energy needed per cycle",
        "type": "number",
        "default": 800,
        "unit": "J",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "preferred-size-selection",
    "name": "Preferred Size Selection (Renard Series Size for Each Requirement, Oversize, Distinct Sizes)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For a set of required sizes or ratings, which preferred numbers should I pick, how much oversize does each choice give, and how many distinct sizes does the range need?",
    "description": "Selection of preferred sizes from a Renard series (R5 to R80) for up to five requirements: the ratio of the series and the preferred numbers around each requirement (as the preferred numbers tool), the smallest preferred number at or above each requirement and its rounded value, the oversize of each choice, and the number of distinct sizes, against the largest oversize you accept.",
    "keywords": [
      "MAKEOS",
      "preferred numbers",
      "Renard series",
      "R10",
      "size range",
      "standardisation",
      "product range"
    ],
    "fields": [
      {
        "key": "series",
        "label": "Series",
        "type": "select",
        "default": "10",
        "options": [
          [
            "5",
            "R5 (ratio 1.58)"
          ],
          [
            "10",
            "R10 (ratio 1.26)"
          ],
          [
            "20",
            "R20 (ratio 1.12)"
          ],
          [
            "40",
            "R40 (ratio 1.06)"
          ],
          [
            "80",
            "R80 (ratio 1.03)"
          ]
        ]
      },
      {
        "key": "r1",
        "label": "Requirement 1 (0 = unused)",
        "type": "number",
        "default": 12,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Requirement 2 (0 = unused)",
        "type": "number",
        "default": 47,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r3",
        "label": "Requirement 3 (0 = unused)",
        "type": "number",
        "default": 150,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r4",
        "label": "Requirement 4 (0 = unused)",
        "type": "number",
        "default": 300,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r5",
        "label": "Requirement 5 (0 = unused)",
        "type": "number",
        "default": 900,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maxOver",
        "label": "Largest oversize accepted",
        "type": "number",
        "default": 15,
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
    "id": "stacked-solid-cg",
    "name": "Stacked Solid Centre of Gravity (Cylinders, Frustums, Cones, Hemispheres, Tipping Angle)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a vessel, hopper or column made of stacked round solids (or the material filling them), where is its centre of gravity, what does it weigh, and at what tilt would it tip over its base?",
    "description": "Centre of gravity of an upright stack of up to three round solid parts — cylinders, frustums, cones and hemispheres, either way up — from the bottom upwards: the volume and centroid height of each part (as the centroid of shapes tool), its mass from its density, the combined mass and centre of gravity height including any height of legs or base below, and the angle of tilt at which the centre of gravity passes over the edge of the base, against your least acceptable tipping angle.",
    "keywords": [
      "MAKEOS",
      "centre of gravity",
      "hopper",
      "silo",
      "tipping angle",
      "frustum",
      "stability"
    ],
    "fields": [
      {
        "key": "h_part_1_from_the_bottom_",
        "label": "Part 1 (from the bottom)",
        "type": "heading"
      },
      {
        "key": "type1",
        "label": "Shape",
        "type": "select",
        "default": "coneDown",
        "options": [
          [
            "none",
            "Not used"
          ],
          [
            "cyl",
            "Cylinder (D₁ = diameter)"
          ],
          [
            "frustum",
            "Frustum (D₁ = bottom dia, D₂ = top dia)"
          ],
          [
            "coneUp",
            "Cone, point up (D₁ = base dia)"
          ],
          [
            "coneDown",
            "Cone, point down (D₁ = top dia)"
          ],
          [
            "hemiUp",
            "Hemisphere, flat face down (D₁ = dia)"
          ],
          [
            "hemiDown",
            "Hemisphere, dome down (D₁ = dia)"
          ]
        ]
      },
      {
        "key": "Da1",
        "label": "Diameter D₁",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Db1",
        "label": "Diameter D₂ (frustum top)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h1",
        "label": "Height (cylinders, frustums, cones)",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho1",
        "label": "Density",
        "type": "number",
        "default": 1500,
        "unit": "kg/m³",
        "min": 0,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_part_2_from_the_bottom_",
        "label": "Part 2 (from the bottom)",
        "type": "heading"
      },
      {
        "key": "type2",
        "label": "Shape",
        "type": "select",
        "default": "cyl",
        "options": [
          [
            "none",
            "Not used"
          ],
          [
            "cyl",
            "Cylinder (D₁ = diameter)"
          ],
          [
            "frustum",
            "Frustum (D₁ = bottom dia, D₂ = top dia)"
          ],
          [
            "coneUp",
            "Cone, point up (D₁ = base dia)"
          ],
          [
            "coneDown",
            "Cone, point down (D₁ = top dia)"
          ],
          [
            "hemiUp",
            "Hemisphere, flat face down (D₁ = dia)"
          ],
          [
            "hemiDown",
            "Hemisphere, dome down (D₁ = dia)"
          ]
        ]
      },
      {
        "key": "Da2",
        "label": "Diameter D₁",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Db2",
        "label": "Diameter D₂ (frustum top)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h2",
        "label": "Height (cylinders, frustums, cones)",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho2",
        "label": "Density",
        "type": "number",
        "default": 1500,
        "unit": "kg/m³",
        "min": 0,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_part_3_from_the_bottom_",
        "label": "Part 3 (from the bottom)",
        "type": "heading"
      },
      {
        "key": "type3",
        "label": "Shape",
        "type": "select",
        "default": "none",
        "options": [
          [
            "none",
            "Not used"
          ],
          [
            "cyl",
            "Cylinder (D₁ = diameter)"
          ],
          [
            "frustum",
            "Frustum (D₁ = bottom dia, D₂ = top dia)"
          ],
          [
            "coneUp",
            "Cone, point up (D₁ = base dia)"
          ],
          [
            "coneDown",
            "Cone, point down (D₁ = top dia)"
          ],
          [
            "hemiUp",
            "Hemisphere, flat face down (D₁ = dia)"
          ],
          [
            "hemiDown",
            "Hemisphere, dome down (D₁ = dia)"
          ]
        ]
      },
      {
        "key": "Da3",
        "label": "Diameter D₁",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Db3",
        "label": "Diameter D₂ (frustum top)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h3",
        "label": "Height (cylinders, frustums, cones)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho3",
        "label": "Density",
        "type": "number",
        "default": 1500,
        "unit": "kg/m³",
        "min": 0,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_base",
        "label": "Base",
        "type": "heading"
      },
      {
        "key": "z0",
        "label": "Height of the bottom of the stack above the base",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Wb",
        "label": "Base width (smallest, across the tipping edge)",
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
        "key": "thMin",
        "label": "Least tipping angle accepted",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "three-point-support-loads",
    "name": "Three-Point Support Loads (Reaction at Each Support, Uplift, Capacity)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a machine, plate or frame resting on three supports, how much load does each support carry from the loads on it, and does any support lift off?",
    "description": "Load share of a rigid body on three supports from up to three vertical loads: the three equilibrium equations (total load, and moments about the X and Y axes) solved by inverting the 3 × 3 matrix of support positions (as the 3 × 3 matrix tool), giving each support reaction, then the check that every reaction is upward (the combined load lies inside the support triangle) and within its capacity.",
    "keywords": [
      "MAKEOS",
      "three-point support",
      "load share",
      "support reactions",
      "machine feet",
      "tripod",
      "statics"
    ],
    "fields": [
      {
        "key": "h_support_1",
        "label": "Support 1",
        "type": "heading"
      },
      {
        "key": "sx1",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sy1",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_support_2",
        "label": "Support 2",
        "type": "heading"
      },
      {
        "key": "sx2",
        "label": "X",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sy2",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_support_3",
        "label": "Support 3",
        "type": "heading"
      },
      {
        "key": "sx3",
        "label": "X",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sy3",
        "label": "Y",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load_1",
        "label": "Load 1",
        "type": "heading"
      },
      {
        "key": "W1",
        "label": "Load (0 = unused)",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wx1",
        "label": "X",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wy1",
        "label": "Y",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load_2",
        "label": "Load 2",
        "type": "heading"
      },
      {
        "key": "W2",
        "label": "Load (0 = unused)",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wx2",
        "label": "X",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wy2",
        "label": "Y",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load_3",
        "label": "Load 3",
        "type": "heading"
      },
      {
        "key": "W3",
        "label": "Load (0 = unused)",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wx3",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wy3",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_capacity",
        "label": "Capacity",
        "type": "heading"
      },
      {
        "key": "cap",
        "label": "Capacity of each support",
        "type": "number",
        "default": 4000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sine-bar-dms-setup",
    "name": "Sine Bar Set-Up from Degrees, Minutes and Seconds (Gauge Stack, Set Angle, Error)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For an angle given in degrees, minutes and seconds, what gauge block stack goes under the sine bar, what angle does it actually set, and is the set-up error within tolerance?",
    "description": "Sine bar set-up for a drawing angle in degrees, minutes and seconds: the angle converted to decimal degrees and radians (as the degrees, minutes and seconds tool), then the exact height difference, the gauge block stack rounded to the set’s resolution, the angle the stack sets, the rounding error, the angle change per micrometre and the total error with the stack tolerance (as the sine bar set-up tool), with the set angle shown back in degrees, minutes and seconds, and the angle given by a measured stack.",
    "keywords": [
      "MAKEOS",
      "sine bar",
      "degrees minutes seconds",
      "gauge blocks",
      "angle set-up",
      "inspection",
      "DMS"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Degrees",
        "type": "number",
        "default": 12,
        "unit": "°",
        "min": 0,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mi",
        "label": "Minutes",
        "type": "number",
        "default": 30,
        "unit": "′",
        "min": 0,
        "max": 59.999999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Seconds",
        "type": "number",
        "default": 15,
        "unit": "″",
        "min": 0,
        "max": 59.999999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Sine bar length (roller centres)",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "res",
        "label": "Gauge-block set resolution",
        "type": "number",
        "default": 0.0005,
        "unit": "mm",
        "min": 0.0001,
        "max": 0.01,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolS",
        "label": "Stack tolerance (sum of block tolerances)",
        "type": "number",
        "default": 0.25,
        "unit": "µm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angTol",
        "label": "Angle tolerance (±)",
        "type": "number",
        "default": 10,
        "unit": "arcsec",
        "min": 0.1,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hm",
        "label": "Measured stack height (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
