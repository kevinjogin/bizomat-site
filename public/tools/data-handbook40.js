// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook40) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "drop-impact-design",
    "name": "Drop Impact on a Beam (Impact Factor, Stress and Safe Drop Height)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How much stress and deflection does a mass dropped on this beam cause, and from what height can it fall before the beam is overstressed?",
    "description": "Design check of a simply supported or cantilever beam struck by a falling mass: static deflection and stress under the weight, the impact factor 1 + √(1 + 2h ÷ δ_st), dynamic deflection and stress (as the beam impact tool), the equivalent static force, the energy absorbed (matching the impact load tool with the beam’s dynamic deflection as the stopping distance), and the largest drop height that keeps the stress within the allowable.",
    "keywords": [
      "MAKEOS",
      "drop impact",
      "impact factor",
      "falling load",
      "dynamic stress",
      "beam impact",
      "safe drop height"
    ],
    "fields": [
      {
        "key": "support",
        "label": "Beam",
        "type": "select",
        "default": "ss",
        "options": [
          [
            "ss",
            "Simply supported, load at mid-span"
          ],
          [
            "cant",
            "Cantilever, load at the free end"
          ]
        ]
      },
      {
        "key": "mass",
        "label": "Falling mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Drop height",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Span (or cantilever length)",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area",
        "type": "number",
        "default": 8000000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Distance to the extreme fibre",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable stress",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMax",
        "label": "Largest dynamic deflection allowed",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "centerless-grinding-plan",
    "name": "Through-Feed Centerless Grinding Plan (Feed, Passes, Output, Angle)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How many parts per hour will this through-feed centerless set-up give with the passes the stock needs, and what regulating-wheel angle would reach my target?",
    "description": "Plan of through-feed centerless grinding: through-feed rate, work rotation speed and parts per minute from the regulating wheel diameter, speed, inclination and slip (as the centerless feed tool), passes for the diametral stock at your stock per pass, parts per hour allowing for the passes, and the regulating-wheel inclination needed to reach a target output, against the largest inclination you use.",
    "keywords": [
      "MAKEOS",
      "centerless grinding",
      "through-feed",
      "regulating wheel angle",
      "parts per hour",
      "grinding passes",
      "centreless"
    ],
    "fields": [
      {
        "key": "Dr",
        "label": "Regulating wheel diameter",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nr",
        "label": "Regulating wheel speed",
        "type": "number",
        "default": 40,
        "unit": "rpm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Regulating wheel inclination",
        "type": "number",
        "default": 3,
        "unit": "°",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "slip",
        "label": "Feed efficiency (allowing for slip)",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dw",
        "label": "Work diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Part length",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gap",
        "label": "Gap between parts",
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
        "key": "stock",
        "label": "Stock on diameter",
        "type": "number",
        "default": 0.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "perPass",
        "label": "Stock removed per pass (on diameter)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0.001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "target",
        "label": "Output wanted",
        "type": "number",
        "default": 250,
        "unit": "parts/h",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angMax",
        "label": "Largest inclination used",
        "type": "number",
        "default": 6,
        "unit": "°",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sawing-plan",
    "name": "Bandsaw Cutting Plan (Time, Bars, Blades and Cost per Cut)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long will this batch of saw cuts take, how many bars and blades will it use, and what does each cut cost?",
    "description": "Plan of a bandsaw cut-off job: section area and cutting time per cut from the cutting rate in area per minute (as the bandsaw time tool), cuts per hour with handling, pieces per bar after kerf and end allowance, bars needed, blades used from the blade life in area cut, blade changes, total time against the hours available, and cost per cut from machine time and blades.",
    "keywords": [
      "MAKEOS",
      "bandsaw plan",
      "sawing time",
      "blade life",
      "cut-off cost",
      "bars needed",
      "kerf"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Section",
        "type": "select",
        "default": "round",
        "options": [
          [
            "round",
            "Round bar"
          ],
          [
            "rect",
            "Rectangular bar"
          ],
          [
            "tube",
            "Round tube"
          ]
        ]
      },
      {
        "key": "a",
        "label": "Diameter or width",
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
        "key": "b",
        "label": "Height or tube wall",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Cutting rate",
        "type": "number",
        "default": 40,
        "unit": "cm²/min",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "handle",
        "label": "Handling time per cut",
        "type": "number",
        "default": 30,
        "unit": "s",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cuts",
        "label": "Cuts in the batch",
        "type": "number",
        "default": 200,
        "unit": "",
        "min": 1,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "piece",
        "label": "Piece length",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kerf",
        "label": "Kerf",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bar",
        "label": "Bar length",
        "type": "number",
        "default": 6000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "End allowance per bar",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "life",
        "label": "Blade life (area cut)",
        "type": "number",
        "default": 5000,
        "unit": "cm²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bladeCost",
        "label": "Blade price",
        "type": "number",
        "default": 60,
        "unit": "$",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "change",
        "label": "Blade change time",
        "type": "number",
        "default": 10,
        "unit": "min",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rateH",
        "label": "Machine and labour rate",
        "type": "number",
        "default": 60,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "avail",
        "label": "Hours available",
        "type": "number",
        "default": 10,
        "unit": "h",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "motor-load-assessment",
    "name": "Induction Motor Load Assessment (Current, Slip, Load, Energy)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "From the nameplate and a measured speed, how heavily loaded is this induction motor, what current and torque is it running at, and what does it cost to run?",
    "description": "Assessment of a three-phase induction motor: rated line current, input power and torque from the nameplate (as the motor power tool), synchronous speed, slip and the load estimated from measured against rated slip (as the motor slip tool), the estimated output, torque and current at that load, the yearly energy and cost, and checks for overload and for an oversized (lightly loaded) motor.",
    "keywords": [
      "MAKEOS",
      "motor load",
      "induction motor slip",
      "motor current",
      "motor efficiency",
      "energy cost",
      "oversized motor"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Line voltage",
        "type": "number",
        "default": 415,
        "unit": "V",
        "min": 0.000001,
        "max": 15000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kW",
        "label": "Rated output",
        "type": "number",
        "default": 11,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pf",
        "label": "Rated power factor",
        "type": "number",
        "default": 0.85,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Rated efficiency",
        "type": "number",
        "default": 91,
        "unit": "%",
        "min": 40,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Supply frequency",
        "type": "number",
        "default": 50,
        "unit": "Hz",
        "min": 10,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "poles",
        "label": "Poles",
        "type": "select",
        "default": "4",
        "options": [
          [
            "2",
            "2"
          ],
          [
            "4",
            "4"
          ],
          [
            "6",
            "6"
          ],
          [
            "8",
            "8"
          ],
          [
            "10",
            "10"
          ],
          [
            "12",
            "12"
          ]
        ]
      },
      {
        "key": "nRated",
        "label": "Rated speed",
        "type": "number",
        "default": 1460,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Measured speed",
        "type": "number",
        "default": 1475,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Running hours per year",
        "type": "number",
        "default": 4000,
        "unit": "h",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Electricity price",
        "type": "number",
        "default": 0.25,
        "unit": "$/kWh",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "loMin",
        "label": "Load below which the motor is oversized",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolted-joint-temperature",
    "name": "Bolted Joint at Temperature (Preload Change from Differential Expansion)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "How much does this bolt’s preload rise or fall when the joint heats up or cools down, and does it stay between the clamp needed and the proof load?",
    "description": "Preload change in a bolted joint when bolt and clamped parts expand differently: bolt stiffness from shank and thread lengths, member stiffness by the frustum method (as the bolted joint design check), assembly preload from the share of proof load, the preload change (α_m − α_b) ΔT × grip × k_b k_m ÷ (k_b + k_m), the preload at temperature, and checks against the least clamp force needed and the bolt proof load.",
    "keywords": [
      "MAKEOS",
      "bolted joint temperature",
      "preload change",
      "differential expansion",
      "aluminium bolted joint",
      "joint stiffness",
      "thermal preload"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Bolt diameter",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 1.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sp",
        "label": "Proof strength",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Eb",
        "label": "Bolt modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "grip",
        "label": "Grip length",
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
        "key": "Lt",
        "label": "Threaded length in the grip",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Em",
        "label": "Clamped part modulus",
        "type": "number",
        "default": 70,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pct",
        "label": "Assembly preload as share of proof load",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ab",
        "label": "Bolt expansion coefficient",
        "type": "number",
        "default": 11.5,
        "unit": "µm/m·K",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "am",
        "label": "Clamped part expansion coefficient",
        "type": "number",
        "default": 23,
        "unit": "µm/m·K",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Temperature change from assembly",
        "type": "number",
        "default": 60,
        "unit": "K",
        "min": -300,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Freq",
        "label": "Least clamp force needed",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolt-circle-layout",
    "name": "Bolt Circle Layout (Coordinates, Ligament, Edge and Wrench Clearance)",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "Where do the holes of this bolt circle go, is there enough metal between holes and to the edges, and will a socket fit between the bolts?",
    "description": "Layout of equally spaced holes on a bolt circle: angular step, adjacent centre chord and the coordinates of each hole (as the bolt circle tool), the ligament between neighbouring holes, edge distances to the outside and bore of the flange, whether the socket or wrench fits between neighbouring bolts, and the most bolts the wrench clearance allows on this circle.",
    "keywords": [
      "MAKEOS",
      "bolt circle",
      "hole coordinates",
      "pitch circle diameter",
      "ligament",
      "edge distance",
      "wrench clearance"
    ],
    "fields": [
      {
        "key": "BCD",
        "label": "Bolt circle diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of holes",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 2,
        "max": 360,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "start",
        "label": "Angle of the first hole",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dh",
        "label": "Hole diameter",
        "type": "number",
        "default": 11,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "OD",
        "label": "Flange outside diameter",
        "type": "number",
        "default": 140,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ID",
        "label": "Flange bore (0 = solid)",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wrench",
        "label": "Socket or wrench clearance diameter",
        "type": "number",
        "default": 24,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minLig",
        "label": "Least ligament between holes",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minEdge",
        "label": "Least edge distance (hole edge to flange edge)",
        "type": "number",
        "default": 10,
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
    "id": "tapping-plan",
    "name": "Tapping Plan (Tap Drill, Thread Percentage, Speed and Cycle Time)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What tap drill gives the thread percentage I want, what percentage will the drill I have give, and how long does a batch of tapped holes take?",
    "description": "Plan of a tapping operation for a metric thread: the tap drill for a target thread percentage for cut or formed taps and the basic minor diameter (as the tap drill tool), the percentage the drill you actually have gives, spindle speed from tapping speed held to the machine maximum, synchronous feed and forward time (as the tapping feed tool), reverse time at the retract speed multiple, and the batch time.",
    "keywords": [
      "MAKEOS",
      "tapping plan",
      "tap drill",
      "thread percentage",
      "tapping speed",
      "rigid tapping",
      "form tap"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Thread diameter",
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
        "key": "pitch",
        "label": "Pitch",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pct",
        "label": "Thread percentage wanted",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 40,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tap",
        "label": "Tap type",
        "type": "select",
        "default": "cut",
        "options": [
          [
            "cut",
            "Cutting tap"
          ],
          [
            "form",
            "Forming (roll) tap"
          ]
        ]
      },
      {
        "key": "drillHave",
        "label": "Drill you have (0 = use the calculated size)",
        "type": "number",
        "default": 8.5,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMin",
        "label": "Smallest thread percentage accepted",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMax",
        "label": "Largest thread percentage accepted",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 1,
        "max": 110,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vc",
        "label": "Tapping speed",
        "type": "number",
        "default": 10,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmax",
        "label": "Largest tapping spindle speed",
        "type": "number",
        "default": 2000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Thread depth",
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
        "key": "rev",
        "label": "Retract speed ÷ forward speed",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "other",
        "label": "Positioning and dwell per hole",
        "type": "number",
        "default": 2,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holes",
        "label": "Holes in the batch",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": 1,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "machine-tipping-stability",
    "name": "Machine Tipping Stability (Overturning, Safety Factor, Anchors)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Will this free-standing machine or cabinet tip over under a sideways acceleration or push, and if so, what anchor force holds it down?",
    "description": "Overturning check of a free-standing machine, rack or tank about its tipping edge by moments of forces: restoring moment of the weight about the edge (allowing for a floor slope), overturning moment from a horizontal acceleration at the centre of gravity (seismic, transport or braking) and from a horizontal force at its height, the safety factor against tipping, the acceleration and tilt angle that just tip it, and if the factor is short, the anchor tension per anchor to reach the required factor, against the anchor capacity.",
    "keywords": [
      "MAKEOS",
      "tipping stability",
      "overturning moment",
      "machine anchoring",
      "centre of gravity",
      "seismic restraint",
      "anchor uplift"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Mass",
        "type": "number",
        "default": 2000,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hcg",
        "label": "Height of the centre of gravity",
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
        "key": "b",
        "label": "Horizontal distance from the centre of gravity to the tipping edge",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aH",
        "label": "Horizontal acceleration",
        "type": "number",
        "default": 0.3,
        "unit": "g",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fh",
        "label": "Additional horizontal force",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hF",
        "label": "Height of that force",
        "type": "number",
        "default": 1500,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tilt",
        "label": "Floor slope towards the tipping edge",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Safety factor against tipping required",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nA",
        "label": "Anchors on the far (uplift) side",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "La",
        "label": "Distance from the tipping edge to the anchors",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Anchor tension capacity",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rope-winch-drum",
    "name": "Rope Winch Drum and Capstan (Wraps, Holding Pull, Torque, Power)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How many turns of rope around this drum let a small tail pull hold the load, what torque and power does the drum need, and is the rope strong enough?",
    "description": "Check of a rope wrapped around a rotating drum or capstan: the tension ratio e^(μθ) for the turns of rope (as the belt friction tool with no groove), the largest load the tail pull can hold, the turns needed for the load, drum torque from the difference of tensions, drive power at the rope speed with the drive efficiency, and the rope safety factor against its breaking load.",
    "keywords": [
      "MAKEOS",
      "capstan",
      "rope winch",
      "rope friction",
      "wraps",
      "tail pull",
      "Euler belt friction"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Load on the rope",
        "type": "number",
        "default": 5,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tail",
        "label": "Tail (holding) pull",
        "type": "number",
        "default": 200,
        "unit": "N",
        "min": 1,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Rope-to-drum friction coefficient",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wraps",
        "label": "Turns of rope on the drum",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 0.25,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Drum diameter (to rope centre)",
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
        "key": "v",
        "label": "Rope speed",
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
        "key": "eta",
        "label": "Drive efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "MBL",
        "label": "Rope minimum breaking load",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SFreq",
        "label": "Rope safety factor required",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
