// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook19) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "uniform-acceleration",
    "name": "Uniformly Accelerated Motion and Falling Bodies",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How fast and how far does this body travel under constant acceleration, or how fast does it hit the ground?",
    "description": "Final velocity and distance from initial velocity, acceleration and time; the acceleration and time needed to change speed over a distance; and the impact speed and time of a body falling from a height.",
    "keywords": [
      "MAKEOS",
      "acceleration",
      "velocity",
      "distance",
      "falling body",
      "free fall",
      "kinematics",
      "braking distance"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Known values",
        "type": "select",
        "default": "time",
        "options": [
          [
            "time",
            "Initial speed, acceleration and time"
          ],
          [
            "distance",
            "Initial and final speed over a distance"
          ],
          [
            "fall",
            "Fall from a height"
          ]
        ]
      },
      {
        "key": "u",
        "label": "Initial velocity",
        "type": "number",
        "default": 0,
        "unit": "m/s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Acceleration (negative to decelerate)",
        "type": "number",
        "default": 2,
        "unit": "m/s²",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Time",
        "type": "number",
        "default": 5,
        "unit": "s",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Final velocity (distance mode)",
        "type": "number",
        "default": 20,
        "unit": "m/s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Distance (distance mode)",
        "type": "number",
        "default": 50,
        "unit": "m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Fall height (fall mode)",
        "type": "number",
        "default": 10,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "angular-acceleration-torque",
    "name": "Torque to Accelerate a Rotating Load",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How much torque does it take to bring this rotating load up to speed in the time allowed?",
    "description": "Angular acceleration, accelerating torque, total torque with friction, revolutions turned during the run-up, kinetic energy stored and the peak power at the end of acceleration for a load of known moment of inertia.",
    "keywords": [
      "MAKEOS",
      "angular acceleration",
      "accelerating torque",
      "moment of inertia",
      "run-up time",
      "flywheel start",
      "motor sizing"
    ],
    "fields": [
      {
        "key": "J",
        "label": "Moment of inertia of the load",
        "type": "number",
        "default": 0.5,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n0",
        "label": "Starting speed",
        "type": "number",
        "default": 0,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Final speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Acceleration time",
        "type": "number",
        "default": 2,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tf",
        "label": "Friction and load torque",
        "type": "number",
        "default": 2,
        "unit": "N·m",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "impulse-momentum",
    "name": "Impulse, Momentum and Collisions",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What average force changes this body’s velocity in the time available, and how do two bodies move after they collide?",
    "description": "Average force from the change in momentum over a time (linear impulse), and the velocities of two bodies after a direct central impact with a coefficient of restitution, with the kinetic energy lost.",
    "keywords": [
      "MAKEOS",
      "impulse",
      "momentum",
      "collision",
      "coefficient of restitution",
      "impact force",
      "energy loss"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculation",
        "type": "select",
        "default": "force",
        "options": [
          [
            "force",
            "Average force from a velocity change"
          ],
          [
            "collision",
            "Two-body collision"
          ]
        ]
      },
      {
        "key": "m",
        "label": "Mass (force mode)",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v0",
        "label": "Initial velocity",
        "type": "number",
        "default": 0,
        "unit": "m/s",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vf",
        "label": "Final velocity",
        "type": "number",
        "default": 5,
        "unit": "m/s",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Time the force acts",
        "type": "number",
        "default": 0.1,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m1",
        "label": "Mass of body 1",
        "type": "number",
        "default": 2,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v1",
        "label": "Velocity of body 1 before impact",
        "type": "number",
        "default": 3,
        "unit": "m/s",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Mass of body 2",
        "type": "number",
        "default": 1,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v2",
        "label": "Velocity of body 2 before impact",
        "type": "number",
        "default": 0,
        "unit": "m/s",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e",
        "label": "Coefficient of restitution",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pendulum-period",
    "name": "Pendulum Period: Simple, Compound, Conical and Torsional",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What is the period of this pendulum, and how much does a large swing change it?",
    "description": "Period and frequency of a simple pendulum, a compound (physical) pendulum from its radius of gyration, a conical pendulum, and a torsional pendulum made of a disc on a slender rod, with a large-amplitude correction for swinging pendulums.",
    "keywords": [
      "MAKEOS",
      "pendulum",
      "period",
      "compound pendulum",
      "conical pendulum",
      "torsional pendulum",
      "radius of gyration",
      "natural frequency"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Pendulum",
        "type": "select",
        "default": "simple",
        "options": [
          [
            "simple",
            "Simple (point mass on a cord)"
          ],
          [
            "compound",
            "Compound (rigid body)"
          ],
          [
            "conical",
            "Conical (bob circling)"
          ],
          [
            "torsional",
            "Torsional (disc on a rod)"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Length (cord, or rod for torsional)",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "amp",
        "label": "Swing amplitude (simple, compound)",
        "type": "number",
        "default": 5,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k0",
        "label": "Radius of gyration about the pivot (compound)",
        "type": "number",
        "default": 0.6,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rcg",
        "label": "Pivot to centre of gravity (compound)",
        "type": "number",
        "default": 0.4,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Cord angle from vertical (conical)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0.000001,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "M",
        "label": "Disc mass (torsional)",
        "type": "number",
        "default": 2,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rd",
        "label": "Disc radius (torsional)",
        "type": "number",
        "default": 0.1,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Rod diameter (torsional)",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus of the rod (torsional)",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "flyball-governor",
    "name": "Fly-ball (Porter) Governor Height and Sensitivity",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "At what height does this fly-ball governor run at this speed, and how sensitive is it?",
    "description": "Height of a loaded (Porter) or simple conical-pendulum fly-ball governor at a given speed, the sleeve movement between two speeds, and the coefficient of speed variation used to compare governor sensitiveness.",
    "keywords": [
      "MAKEOS",
      "governor",
      "fly-ball governor",
      "Porter governor",
      "Watt governor",
      "conical pendulum",
      "speed regulation"
    ],
    "fields": [
      {
        "key": "w",
        "label": "Mass of one ball",
        "type": "number",
        "default": 2,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Central load (0 = simple governor)",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Governor speed",
        "type": "number",
        "default": 200,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmax",
        "label": "Maximum speed of the control range",
        "type": "number",
        "default": 210,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmin",
        "label": "Minimum speed of the control range",
        "type": "number",
        "default": 190,
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
    "id": "geneva-mechanism",
    "name": "Geneva Wheel Indexing Mechanism",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What crank radius and wheel size does a Geneva drive need, and how long are its index and dwell?",
    "description": "Geometry and timing of an external Geneva wheel with slots tangent to the roller path at entry and exit: crank radius, wheel radius, minimum slot length, driver angle for indexing, index and dwell times, and the peak speed ratio of the wheel.",
    "keywords": [
      "MAKEOS",
      "Geneva wheel",
      "Geneva drive",
      "Maltese cross",
      "intermittent motion",
      "indexing",
      "dwell"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of slots",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 3,
        "max": 24,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C",
        "label": "Centre distance",
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
        "key": "rpm",
        "label": "Driver speed",
        "type": "number",
        "default": 60,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "roller",
        "label": "Roller diameter",
        "type": "number",
        "default": 10,
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
    "id": "gyroscope-precession",
    "name": "Gyroscopic Couple and Bearing Reactions",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What gyroscopic couple does this spinning rotor exert when its axis is turned, and what load does it put on the bearings?",
    "description": "Gyroscopic couple of a spinning rotor whose axis precesses (turns) at a given rate, from the rotor’s moment of inertia, spin speed and precession speed, and the resulting pair of bearing reactions.",
    "keywords": [
      "MAKEOS",
      "gyroscope",
      "gyroscopic couple",
      "precession",
      "gyroscopic effect",
      "bearing load",
      "rotor"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Rotor",
        "type": "select",
        "default": "disc",
        "options": [
          [
            "disc",
            "Solid disc"
          ],
          [
            "ring",
            "Thin ring"
          ],
          [
            "entered",
            "Enter the moment of inertia"
          ]
        ]
      },
      {
        "key": "M",
        "label": "Rotor mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Rotor outer radius",
        "type": "number",
        "default": 0.2,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "J",
        "label": "Moment of inertia (entered)",
        "type": "number",
        "default": 0.4,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ns",
        "label": "Spin speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "np",
        "label": "Precession speed (axis turning rate)",
        "type": "number",
        "default": 10,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Bearing span",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "prony-brake",
    "name": "Prony Brake and Absorption Dynamometer Power",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How much power is the machine delivering according to the brake arm, scale reading and speed?",
    "description": "Torque and power absorbed by a Prony brake or water brake from the brake arm length, the scale reading under load, the zero reading and the shaft speed, with the heat that must be carried away.",
    "keywords": [
      "MAKEOS",
      "Prony brake",
      "dynamometer",
      "brake power",
      "absorption dynamometer",
      "water brake",
      "shaft power test"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Brake arm length",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tare",
        "label": "Scale reading with the brake absorbing power",
        "type": "number",
        "default": 250,
        "unit": "N",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zero",
        "label": "Zero reading (frictionless)",
        "type": "number",
        "default": 50,
        "unit": "N",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Shaft speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "catenary-cable",
    "name": "Catenary Cable Sag, Tension and Length",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What tension and length does a cable or chain of this weight have when it sags this much over the span?",
    "description": "Exact catenary for a uniform cable or chain hanging between two supports at the same level: catenary parameter, horizontal and maximum tension, cable length and support angle, compared with the parabolic approximation.",
    "keywords": [
      "MAKEOS",
      "catenary",
      "cable sag",
      "cable tension",
      "chain sag",
      "suspended cable",
      "conductor sag"
    ],
    "fields": [
      {
        "key": "S",
        "label": "Span between supports",
        "type": "number",
        "default": 100,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Sag at mid-span",
        "type": "number",
        "default": 5,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Cable weight per metre",
        "type": "number",
        "default": 10,
        "unit": "N/m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rolling-resistance",
    "name": "Rolling Resistance of Wheels and Rollers",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What force does it take to keep this wheeled load rolling, and how does that compare with sliding it?",
    "description": "Rolling resistance force from the load, wheel radius and coefficient of rolling resistance (a length), the power to keep the load moving at a speed, and the comparison with sliding friction.",
    "keywords": [
      "MAKEOS",
      "rolling resistance",
      "rolling friction",
      "wheel load",
      "trolley push force",
      "castor",
      "rail wheel"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Total load on the wheels",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Wheel radius",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Coefficient of rolling resistance",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Travel speed",
        "type": "number",
        "default": 1,
        "unit": "m/s",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Sliding friction coefficient for comparison",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rotating-balance-plane",
    "name": "Counterbalancing Masses in One Plane",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What counterweight, at what angle, balances these masses rotating in one plane?",
    "description": "Resultant unbalance of up to four masses at given radii and angles in a single plane of rotation, the counterweight mass and angle at a chosen radius that balances them, and the unbalance force at speed before correction.",
    "keywords": [
      "MAKEOS",
      "balancing",
      "counterweight",
      "static balance",
      "unbalance",
      "rotating masses",
      "lathe fixture balance"
    ],
    "fields": [
      {
        "key": "h_masses_mass_0_unused_",
        "label": "Masses (mass 0 = unused)",
        "type": "heading"
      },
      {
        "key": "m1",
        "label": "Mass 1",
        "type": "number",
        "default": 50,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Radius 1",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Angle 1",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Mass 2",
        "type": "number",
        "default": 30,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Radius 2",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Angle 2",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Mass 3",
        "type": "number",
        "default": 20,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r3",
        "label": "Radius 3",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Angle 3",
        "type": "number",
        "default": 200,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m4",
        "label": "Mass 4",
        "type": "number",
        "default": 0,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r4",
        "label": "Radius 4",
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
        "key": "a4",
        "label": "Angle 4",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_correction",
        "label": "Correction",
        "type": "heading"
      },
      {
        "key": "rc",
        "label": "Counterweight radius",
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
        "key": "rpm",
        "label": "Running speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "two-plane-balance",
    "name": "Two-Plane (Dynamic) Balance Corrections",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What correction masses in two planes give this rotor a running (dynamic) balance?",
    "description": "Correction masses and angles in two chosen correction planes that balance up to three masses lying in different planes along a rotor, by taking moments about one correction plane.",
    "keywords": [
      "MAKEOS",
      "dynamic balance",
      "two-plane balancing",
      "running balance",
      "couple unbalance",
      "rotor balancing",
      "correction mass"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Distance between correction planes A and B",
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
        "key": "h_masses_axial_position_measured_from_plane_a_",
        "label": "Masses (axial position measured from plane A)",
        "type": "heading"
      },
      {
        "key": "m1",
        "label": "Mass 1",
        "type": "number",
        "default": 40,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Radius 1",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Angle 1",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Axial position 1",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Mass 2",
        "type": "number",
        "default": 30,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Radius 2",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Angle 2",
        "type": "number",
        "default": 120,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z2",
        "label": "Axial position 2",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Mass 3",
        "type": "number",
        "default": 0,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r3",
        "label": "Radius 3",
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
        "key": "a3",
        "label": "Angle 3",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z3",
        "label": "Axial position 3",
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
        "key": "h_correction_radii",
        "label": "Correction radii",
        "type": "heading"
      },
      {
        "key": "rA",
        "label": "Correction radius in plane A",
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
        "key": "rB",
        "label": "Correction radius in plane B",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "torsional-vibration",
    "name": "Torsional Natural Frequency of a Drive",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "At what frequency will this motor-and-load drive resonate in torsion, and is that safely above the control bandwidth?",
    "description": "Torsional stiffness of a connecting shaft and the torsional natural frequency of a single inertia on a shaft or of a motor and load joined by a shaft, compared with the servo or control bandwidth.",
    "keywords": [
      "MAKEOS",
      "torsional vibration",
      "torsional resonance",
      "natural frequency",
      "servo resonance",
      "drive stiffness",
      "two-inertia system"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "System",
        "type": "select",
        "default": "two",
        "options": [
          [
            "two",
            "Motor and load joined by the shaft"
          ],
          [
            "single",
            "Load on a shaft fixed at the far end"
          ]
        ]
      },
      {
        "key": "kMode",
        "label": "Stiffness",
        "type": "select",
        "default": "shaft",
        "options": [
          [
            "shaft",
            "From shaft dimensions"
          ],
          [
            "entered",
            "Enter the torsional stiffness"
          ]
        ]
      },
      {
        "key": "K",
        "label": "Torsional stiffness (entered)",
        "type": "number",
        "default": 2500,
        "unit": "N·m/rad",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
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
        "default": 20,
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
        "default": 500,
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
        "default": 0.002,
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
        "default": 0.05,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bw",
        "label": "Control bandwidth",
        "type": "number",
        "default": 50,
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
    "id": "buoyancy",
    "name": "Buoyancy and Submerged Weight",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Will this body float, and how much does it weigh when submerged?",
    "description": "Buoyant force by Archimedes’ principle, the apparent (submerged) weight of a body, whether it floats, and the fraction of its volume below the surface when it does.",
    "keywords": [
      "MAKEOS",
      "buoyancy",
      "Archimedes",
      "submerged weight",
      "flotation",
      "displacement",
      "lifting underwater"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Volume of the body",
        "type": "number",
        "default": 10,
        "unit": "L",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Mass of the body",
        "type": "number",
        "default": 78.5,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Fluid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 30000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wind-pressure",
    "name": "Wind Pressure and Force on a Surface",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What force and overturning moment does wind at this speed put on this sign, guard or structure?",
    "description": "Dynamic pressure of wind from its speed and air density, the pressure on a surface with a shape (force) coefficient, the resulting force and its overturning moment about the base.",
    "keywords": [
      "MAKEOS",
      "wind pressure",
      "wind load",
      "dynamic pressure",
      "drag force",
      "overturning moment",
      "sign load"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Wind speed",
        "type": "number",
        "default": 20,
        "unit": "m/s",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Air density",
        "type": "number",
        "default": 1.2,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Shape (force) coefficient",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Area facing the wind",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Height of the area centre above the base",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "escaping-air-velocity",
    "name": "Velocity and Flow of Escaping Compressed Air",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How fast and how much air escapes from this tank through a hole or nozzle?",
    "description": "Theoretical velocity of air escaping adiabatically from a large container by the handbook formula, the velocity actually reached at a plain orifice (limited to sonic when the flow chokes), and the mass and free-air flow through an orifice of given size.",
    "keywords": [
      "MAKEOS",
      "escaping air",
      "air leak",
      "choked flow",
      "orifice flow",
      "compressed air velocity",
      "blow-off"
    ],
    "fields": [
      {
        "key": "p1",
        "label": "Tank pressure (gauge)",
        "type": "number",
        "default": 6,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Outside pressure (absolute)",
        "type": "number",
        "default": 1.01325,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Air temperature in the tank",
        "type": "number",
        "default": 21,
        "unit": "°C",
        "min": -50,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Ratio of specific heats",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.01,
        "max": 1.7,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Orifice diameter",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Discharge coefficient",
        "type": "number",
        "default": 0.65,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ratchet-wheel-pitch",
    "name": "Ratchet Wheel Tooth Pitch",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What tooth pitch and outside diameter does a ratchet wheel need to hold this turning moment?",
    "description": "Circular pitch of ratchet wheel teeth at the outside circumference for holding a suspended load, from the turning moment, face width, safe stress and number of teeth with the handbook’s tooth-number factor, and the resulting outside diameter.",
    "keywords": [
      "MAKEOS",
      "ratchet",
      "ratchet wheel",
      "pawl",
      "crane ratchet",
      "holding brake",
      "tooth pitch"
    ],
    "fields": [
      {
        "key": "M",
        "label": "Turning moment on the ratchet shaft",
        "type": "number",
        "default": 200,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Face width (ratchet thickness)",
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
        "key": "S",
        "label": "Safe stress for the tooth material",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 16,
        "unit": "",
        "min": 6,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  }
]);
