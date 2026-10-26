// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook49) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "pump-suction-check",
    "name": "Pump Suction Line Check (Friction Loss, NPSH Available, Lowest Liquid Level)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Will my pump cavitate with this suction line, how low can the liquid level fall before it does, and is the suction velocity reasonable?",
    "description": "Check of a pump suction line: velocity in the suction pipe against your limit, friction factor and head loss through the pipe, foot valve and fittings (as the pipe friction tool), NPSH available from the surface pressure, vapour pressure, liquid level and suction losses compared with the pump’s NPSH required plus your margin (as the NPSH available tool), and the lowest liquid level that still keeps the margin.",
    "keywords": [
      "MAKEOS",
      "NPSH",
      "pump suction",
      "cavitation",
      "suction lift",
      "suction pipe",
      "net positive suction head"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 300,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Suction pipe inside diameter",
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
        "key": "L",
        "label": "Suction pipe length",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Sum of fitting loss coefficients (foot valve, bends)",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Kinematic viscosity",
        "type": "number",
        "default": 1,
        "unit": "cSt",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 998,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Pipe roughness",
        "type": "number",
        "default": 0.045,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pressures_and_levels",
        "label": "Pressures and levels",
        "type": "heading"
      },
      {
        "key": "ps",
        "label": "Pressure on the liquid surface (absolute)",
        "type": "number",
        "default": 101.3,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pv",
        "label": "Vapour pressure at pumping temperature",
        "type": "number",
        "default": 2.34,
        "unit": "kPa",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Liquid level above pump centreline (negative = below)",
        "type": "number",
        "default": -2,
        "unit": "m",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "npshr",
        "label": "Pump NPSH required at duty",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Required margin",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vMax",
        "label": "Largest suction velocity",
        "type": "number",
        "default": 1.5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shoe-brake-stop-check",
    "name": "Shoe Brake Stop Check (Stopping Torque, Lever Force, Lining Pressure, Heat)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What braking torque stops this rotating load in the time I want, what lever force does my shoe brake need, and are the lining pressure and drum temperature rise acceptable?",
    "description": "Check of a single-shoe drum brake stopping a rotating load: the torque to decelerate the inertia in the stopping time less any drag that helps (as the torque to accelerate a rotating load tool), the normal and friction forces on the shoe and the lever force for the pivot geometry, self-energising or not, with the self-locking check (as the shoe brake tool), shoe pressure, kinetic energy per stop, revolutions to stop and the drum temperature rise, checked against the force available, your pressure limit and temperature limit.",
    "keywords": [
      "MAKEOS",
      "shoe brake",
      "drum brake",
      "stopping time",
      "brake lever force",
      "brake heat",
      "lining pressure"
    ],
    "fields": [
      {
        "key": "J",
        "label": "Inertia of the load at the brake shaft",
        "type": "number",
        "default": 8,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Stopping time wanted",
        "type": "number",
        "default": 3,
        "unit": "s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Td",
        "label": "Drag torque helping to stop",
        "type": "number",
        "default": 0,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_brake_geometry",
        "label": "Brake geometry",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Drum diameter",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.35,
        "unit": "",
        "min": 0.05,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Pivot to applied force",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Pivot to shoe normal force line",
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
        "key": "c",
        "label": "Offset of friction force line from pivot",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir",
        "label": "Rotation relative to the pivot",
        "type": "select",
        "default": "energ",
        "options": [
          [
            "energ",
            "Friction moment helps apply the shoe (self-energising)"
          ],
          [
            "de",
            "Friction moment opposes the shoe (de-energising)"
          ]
        ]
      },
      {
        "key": "area",
        "label": "Shoe contact area",
        "type": "number",
        "default": 6000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
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
        "key": "Favail",
        "label": "Lever force available",
        "type": "number",
        "default": 1500,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pAllow",
        "label": "Allowable lining pressure",
        "type": "number",
        "default": 1,
        "unit": "MPa",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mDrum",
        "label": "Drum mass",
        "type": "number",
        "default": 15,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cDrum",
        "label": "Drum specific heat",
        "type": "number",
        "default": 0.46,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTmax",
        "label": "Largest drum temperature rise per stop",
        "type": "number",
        "default": 20,
        "unit": "K",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "drive-torsional-check",
    "name": "Drive Shaft Torsional Check (Natural Frequency, Resonance Margins, Stress, Twist)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Does the torsional natural frequency of my motor, shaft and load fall clear of the running-speed excitations, and are the shaft stress and twist acceptable?",
    "description": "Check of a two-inertia drive (motor and load joined by a shaft): torsional stiffness of the shaft, effective inertia and natural frequency (as the torsional vibration tool), the excitation bands for the first few orders of running speed over the speed range, the separation of the natural frequency from each band against your margin, the critical speeds, and the shaft shear stress and angle of twist at the drive torque.",
    "keywords": [
      "MAKEOS",
      "torsional vibration",
      "torsional resonance",
      "critical speed",
      "shaft twist",
      "drive train",
      "natural frequency"
    ],
    "fields": [
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Shaft outside diameter",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "di",
        "label": "Shaft bore (0 = solid)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ls",
        "label": "Shaft length",
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
        "key": "J1",
        "label": "Motor inertia",
        "type": "number",
        "default": 0.05,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "J2",
        "label": "Load inertia",
        "type": "number",
        "default": 0.5,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_operation",
        "label": "Operation",
        "type": "heading"
      },
      {
        "key": "nMin",
        "label": "Lowest running speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMax",
        "label": "Highest running speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "orders",
        "label": "Excitation orders to check (1 to …)",
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
        "key": "sep",
        "label": "Separation margin",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Drive torque",
        "type": "number",
        "default": 150,
        "unit": "N·m",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tauA",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 60,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "flange-coupling-design",
    "name": "Flange Coupling Design (Design Torque, Bolts, Friction Drive, Key)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Is this rigid flange coupling strong enough for the motor power, do the bolts carry the torque by friction or shear, and is the hub key long enough?",
    "description": "Check of a rigid flange coupling: design torque from power, speed and service factor; bolt force and bolt shear stress on the bolt circle with the shank diameter needed, and the torque the bolt preload can carry by face friction (as the flange coupling bolts tool); key force, shear and crushing stress in the hub and the least key length for each (as the key stress tool), with the key length checked against the hub length.",
    "keywords": [
      "MAKEOS",
      "flange coupling",
      "coupling bolts",
      "key design",
      "design torque",
      "service factor",
      "rigid coupling"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power",
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
        "key": "n",
        "label": "Speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
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
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolts",
        "label": "Bolts",
        "type": "heading"
      },
      {
        "key": "nb",
        "label": "Number of bolts",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 2,
        "max": 64,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Dbc",
        "label": "Bolt circle diameter",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "db",
        "label": "Bolt shank diameter",
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
        "key": "tauB",
        "label": "Allowable bolt shear stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fi",
        "label": "Preload per bolt",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient between flange faces",
        "type": "number",
        "default": 0.2,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_shaft_key",
        "label": "Shaft key",
        "type": "heading"
      },
      {
        "key": "ds",
        "label": "Shaft diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Key width",
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
        "key": "h",
        "label": "Key height",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lk",
        "label": "Effective key length",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hubL",
        "label": "Hub length",
        "type": "number",
        "default": 70,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tauK",
        "label": "Allowable key shear stress",
        "type": "number",
        "default": 60,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sigK",
        "label": "Allowable compressive stress (weakest of key, shaft, hub)",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-milling-setup",
    "name": "Spur Gear Milling Set-up (Indexing, Cutter Number, Depth, Tooth Check)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How do I set up a dividing head and form cutter to mill this spur gear: index setting, cutter number, blank size, depth of cut and the chordal tooth check?",
    "description": "Set-up for milling a spur gear with a form cutter on a dividing head: simple indexing (crank turns and holes in an index circle) for the number of teeth (as the simple indexing tool), the involute cutter number for the tooth count (as the gear cutter number tool), blank outside diameter, whole depth of cut, and the chordal thickness and chordal addendum for checking the first teeth with a gear tooth vernier (as the chordal tooth tool).",
    "keywords": [
      "MAKEOS",
      "gear milling",
      "dividing head",
      "simple indexing",
      "involute cutter",
      "form cutter",
      "chordal thickness"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.3,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Number of teeth",
        "type": "number",
        "default": 47,
        "unit": "",
        "min": 12,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "ratio",
        "label": "Dividing head worm ratio",
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
        "label": "Index plates available",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe plates 1–3"
          ],
          [
            "cin",
            "Cincinnati standard plate (both sides)"
          ]
        ]
      },
      {
        "key": "ded",
        "label": "Dedendum factor (dedendum ÷ module)",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 1.6,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "lubricant-viscosity-check",
    "name": "Lubricant Viscosity Check (Operating and Cold-Start Viscosity)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "Is this oil grade thick enough at the operating temperature and thin enough to circulate at a cold start?",
    "description": "Check of an oil grade for a bearing, gearbox or hydraulic system: viscosity at the operating temperature and at the cold-start temperature from the oil’s viscosity at two temperatures by the ASTM D341 chart relation (as the oil viscosity–temperature tool), the same values in dynamic viscosity and Saybolt units (as the viscosity units tool), and the ratio of the operating viscosity to the minimum your machine needs, against your cold-start limit.",
    "keywords": [
      "MAKEOS",
      "oil viscosity",
      "viscosity grade",
      "operating temperature",
      "cold start",
      "lubricant selection",
      "kappa"
    ],
    "fields": [
      {
        "key": "T1",
        "label": "First data temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v1",
        "label": "Viscosity at the first temperature",
        "type": "number",
        "default": 68,
        "unit": "cSt",
        "min": 0.5,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Second data temperature",
        "type": "number",
        "default": 100,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v2",
        "label": "Viscosity at the second temperature",
        "type": "number",
        "default": 8.6,
        "unit": "cSt",
        "min": 0.5,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sg",
        "label": "Oil specific gravity",
        "type": "number",
        "default": 0.88,
        "unit": "",
        "min": 0.5,
        "max": 2,
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
        "key": "Top",
        "label": "Operating temperature",
        "type": "number",
        "default": 70,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nuMin",
        "label": "Least viscosity needed at operating temperature",
        "type": "number",
        "default": 15,
        "unit": "cSt",
        "min": 0.5,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tcold",
        "label": "Cold-start temperature",
        "type": "number",
        "default": 5,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nuStart",
        "label": "Largest viscosity for a cold start",
        "type": "number",
        "default": 1500,
        "unit": "cSt",
        "min": 1,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rolled-plate-plan",
    "name": "Rolled Plate Plan (Roll-To Radius for Springback, Blank Length, Radius Inspection)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "To what radius must I roll this plate so it springs back to the radius I want, how long is the blank, and does my roll-gauge measurement show the radius is within tolerance?",
    "description": "Plan for rolling a plate or sheet to a radius: the radius to roll to so that after springback it opens to the target radius, found by solving the springback relation (as the bending springback tool), the springback change, the blank length along the mid-thickness for the arc angle, and inspection of the rolled radius from a measurement over two rolls (as the arc radius from rolls tool), against the radius tolerance.",
    "keywords": [
      "MAKEOS",
      "plate rolling",
      "springback",
      "roll radius",
      "blank length",
      "radius gauge",
      "rolled shell"
    ],
    "fields": [
      {
        "key": "Rt",
        "label": "Target inside radius",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Plate thickness",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "YS",
        "label": "Yield strength",
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
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Arc angle of the part",
        "type": "number",
        "default": 180,
        "unit": "°",
        "min": 1,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_inspection_over_rolls",
        "label": "Inspection over rolls",
        "type": "heading"
      },
      {
        "key": "surf",
        "label": "Surface measured",
        "type": "select",
        "default": "in",
        "options": [
          [
            "in",
            "Inside (concave) surface"
          ],
          [
            "out",
            "Outside (convex) surface"
          ]
        ]
      },
      {
        "key": "type",
        "label": "Gauge set-up",
        "type": "select",
        "default": "concave",
        "options": [
          [
            "concave",
            "Arc bridges the rolls; H = height of the arc’s top"
          ],
          [
            "convex",
            "Arc rests on the rolls; H = height of the arc’s lowest point"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Roll diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Measurement over the rolls",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hh",
        "label": "Height measured",
        "type": "number",
        "default": 34.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Radius tolerance (±)",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hopper-bin-design",
    "name": "Hopper and Bin Design (Capacity, Wall Angle, Plate Mass)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much material will this round bin with a conical hopper hold, is the cone steep enough for the material to flow, and what will the shell plate weigh?",
    "description": "Design check of a round bin with a cylindrical section over a conical hopper: hopper volume, slant area and wall angle from horizontal (as the frustum volume tool), cylinder volume, mass held at the bulk density and fill level against the mass needed, the wall angle against the angle your material needs to flow, and the plate area and mass of the shell for the plate thickness.",
    "keywords": [
      "MAKEOS",
      "hopper design",
      "bin capacity",
      "hopper angle",
      "bulk density",
      "silo",
      "cone volume"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Bin diameter (top of the cone)",
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
        "key": "Hc",
        "label": "Cylindrical section height",
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
        "key": "d",
        "label": "Outlet diameter",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hh",
        "label": "Cone height",
        "type": "number",
        "default": 1500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_material_and_plate",
        "label": "Material and plate",
        "type": "heading"
      },
      {
        "key": "rhoB",
        "label": "Bulk density of the material",
        "type": "number",
        "default": 1400,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fill",
        "label": "Fill level (share of total volume)",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "need",
        "label": "Mass to be held",
        "type": "number",
        "default": 8000,
        "unit": "kg",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angMin",
        "label": "Least wall angle from horizontal for flow",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 0,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tp",
        "label": "Plate thickness",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoS",
        "label": "Plate density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "knurling-setup",
    "name": "Knurling Set-up (Tracking Blank Diameter, Speed, Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Will my knurl track on this blank diameter, what diameter should I turn to instead, and what speed and time does the knurling pass need?",
    "description": "Set-up of a straight knurling operation: teeth that fit around the planned blank and the nearest diameters that give a whole number of teeth so the knurl tracks (as the knurling blank diameter tool), whether the planned blank lies within your tolerance of a tracking diameter, spindle speed from the knurling speed, and time for the passes along the length at the feed.",
    "keywords": [
      "MAKEOS",
      "knurling",
      "knurl tracking",
      "blank diameter",
      "knurl pitch",
      "knurling speed",
      "lathe set-up"
    ],
    "fields": [
      {
        "key": "system",
        "label": "Knurl system",
        "type": "select",
        "default": "cp",
        "options": [
          [
            "cp",
            "Circular pitch (metric)"
          ],
          [
            "dp",
            "Diametral pitch (inch)"
          ]
        ]
      },
      {
        "key": "t",
        "label": "Circular pitch",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Diametral pitch (teeth per inch of diameter)",
        "type": "number",
        "default": 96,
        "unit": "1/in",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Planned blank diameter",
        "type": "number",
        "default": 20.05,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolD",
        "label": "Diameter tolerance for tracking",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cutting",
        "label": "Cutting",
        "type": "heading"
      },
      {
        "key": "vc",
        "label": "Knurling speed",
        "type": "number",
        "default": 20,
        "unit": "m/min",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed along the work",
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
        "key": "L",
        "label": "Knurled length",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "passes",
        "label": "Passes",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  }
]);
