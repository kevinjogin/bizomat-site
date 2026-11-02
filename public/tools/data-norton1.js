// KEVOS® MAKEOS: mechanism kinematics topic tools (batch norton1) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "linkage-mobility",
    "name": "Linkage Degree of Freedom (Gruebler and Kutzbach)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How many degrees of freedom does my planar (or spatial) linkage have, from its numbers of links and joints, and is it a mechanism, a structure or a preloaded structure?",
    "description": "Mobility of a linkage by the equations Norton gives: Kutzbach’s form of Gruebler’s equation for planar mechanisms M = 3(L − 1) − 2J1 − J2 with full (one-freedom) and half (two-freedom) joints, multiple joints counting as one less than the number of links they join, and the Kutzbach equation for spatial linkages M = 6(L − 1) − 5J1 − 4J2 − 3J3 − 2J4 − J5, with the classification into a mechanism (M > 0), a structure (M = 0) or a preloaded structure (M < 0).",
    "keywords": [
      "MAKEOS",
      "Gruebler equation",
      "Kutzbach mobility",
      "linkage degree of freedom",
      "mechanism or structure",
      "planar mechanism DOF",
      "spatial linkage mobility"
    ],
    "fields": [
      {
        "key": "space",
        "label": "Linkage",
        "type": "select",
        "default": "planar",
        "options": [
          [
            "planar",
            "Planar (Gruebler–Kutzbach)"
          ],
          [
            "spatial",
            "Spatial (Kutzbach)"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Number of links L (including the ground)",
        "type": "number",
        "default": 4,
        "unit": "links",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "J1",
        "label": "One-freedom (full) joints J1",
        "type": "number",
        "default": 4,
        "unit": "joints",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "J2",
        "label": "Two-freedom (half) joints J2",
        "type": "number",
        "default": 0,
        "unit": "joints",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "J3",
        "label": "Three-freedom joints J3 (spatial)",
        "type": "number",
        "default": 0,
        "unit": "joints",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "J4",
        "label": "Four-freedom joints J4 (spatial)",
        "type": "number",
        "default": 0,
        "unit": "joints",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "J5",
        "label": "Five-freedom joints J5 (spatial)",
        "type": "number",
        "default": 0,
        "unit": "joints",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "fourbar-grashof-check",
    "name": "Fourbar Linkage Grashof Condition, Type, Transmission and Toggle Angles",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "From the four link lengths of my fourbar linkage, is it Grashof, what kind of motion does this inversion give (crank-rocker, double-crank, double-rocker or triple-rocker), and what are its extreme transmission angles or toggle positions?",
    "description": "Fourbar linkage behaviour by Norton’s Grashof condition S + L ≤ P + Q with the shortest S, longest L and other links P and Q: Class I (S + L < P + Q) gives a crank-rocker when a link next to the shortest is grounded, a double-crank when the shortest is grounded and a Grashof double-rocker when the link opposite the shortest is grounded; Class II (S + L > P + Q) gives triple-rockers; Class III (S + L = P + Q) has change points. It also gives the extreme transmission angles of a crank-rocker, μ = arccos{[b² + c² − (d ± a)²] ÷ 2bc}, and for a non-Grashof linkage the input toggle angle θ2 = arccos[(a² + d² − b² − c²) ÷ 2ad ± bc ÷ ad] (equation 4.33) with the transmission angle at the toggle where the input and coupler are in line.",
    "keywords": [
      "MAKEOS",
      "Grashof condition",
      "fourbar linkage classification",
      "crank rocker double crank",
      "transmission angle",
      "toggle position",
      "triple rocker linkage"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Ground link d (link 1)",
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
        "key": "a",
        "label": "Input link a (link 2)",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Coupler b (link 3)",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Output link c (link 4)",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "fourbar-time-ratio",
    "name": "Fourbar Crank-Rocker Quick-Return Time Ratio",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a crank-rocker driven at constant speed, what are the crank angles for the forward and return strokes and the time ratio, or what angles does a chosen time ratio need when I design one?",
    "description": "Quick-return time ratio of a Grashof crank-rocker by Norton’s definitions: the crank sweeps α and β between the two toggle positions (crank and coupler colinear), with TR = α ÷ β, α + β = 360° and the construction angle δ = |180° − α| = |180° − β|; for a given linkage the two sweeps and the rocker swing follow from the cosine law in the extended (a + b) and overlapped (b − a) colinear positions, and for design they follow from the time ratio.",
    "keywords": [
      "MAKEOS",
      "quick return time ratio",
      "crank rocker time ratio",
      "toggle positions crank",
      "rocker swing angle",
      "construction angle delta",
      "quick-return linkage"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "analyse",
        "options": [
          [
            "analyse",
            "Time ratio of a crank-rocker from its links"
          ],
          [
            "design",
            "Crank angles for a chosen time ratio"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Ground link d",
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
        "key": "a",
        "label": "Crank a",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Coupler b",
        "type": "number",
        "default": 90,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Rocker c",
        "type": "number",
        "default": 70,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TR",
        "label": "Time ratio wanted (slower stroke ÷ faster stroke)",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "fourbar-kinematics",
    "name": "Fourbar Linkage Position, Velocity and Acceleration (Analytical)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a pin-jointed fourbar linkage at a given input angle, speed and acceleration, what are the coupler and output angles, their angular velocities and accelerations, the transmission angle, and the position and velocity of a coupler point?",
    "description": "Analytical kinematics of the pin-jointed fourbar by Norton’s vector loop solution: the output angle from Freudenstein’s constants K1 = d/a, K2 = d/c, K3 = (a² − b² + c² + d²) ÷ 2ac and θ4 = 2 arctan[(−B ∓ √(B² − 4AC)) ÷ 2A] for the open (−) or crossed (+) circuit, the coupler angle from the loop equations, ω3 = (aω2 ÷ b) sin(θ4 − θ2) ÷ sin(θ3 − θ4) and ω4 = (aω2 ÷ c) sin(θ2 − θ3) ÷ sin(θ4 − θ3), α3 = (CD − AF) ÷ (AE − BD) and α4 = (CE − BF) ÷ (AE − BD) with Norton’s acceleration constants, the transmission angle |θ3 − θ4| taken acute, and the position and velocity of a coupler point at distance p and angle δ3 from A.",
    "keywords": [
      "MAKEOS",
      "fourbar position analysis",
      "fourbar velocity analysis",
      "fourbar acceleration",
      "Freudenstein equation",
      "coupler point velocity",
      "open crossed circuit"
    ],
    "fields": [
      {
        "key": "a",
        "label": "Input link a (link 2)",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Coupler b (link 3)",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Output link c (link 4)",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Ground link d (link 1)",
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
        "key": "t2",
        "label": "Input angle θ2 (from the ground line)",
        "type": "number",
        "default": 40,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w2",
        "label": "Input angular velocity ω2 (+ anticlockwise)",
        "type": "number",
        "default": 10,
        "unit": "rad/s",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Input angular acceleration α2",
        "type": "number",
        "default": 0,
        "unit": "rad/s²",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "circ",
        "label": "Circuit (assembly)",
        "type": "select",
        "default": "open",
        "options": [
          [
            "open",
            "Open"
          ],
          [
            "crossed",
            "Crossed"
          ]
        ]
      },
      {
        "key": "p",
        "label": "Coupler point distance p from A (0 = none)",
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
        "key": "d3",
        "label": "Coupler point angle δ3 from line AB",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "slider-crank-kinematics",
    "name": "Offset Slider-Crank Position, Velocity and Acceleration (Analytical)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For an offset (or in-line) slider-crank at a given crank angle, speed and acceleration, where is the slider, how fast is it moving and accelerating, and what are the connecting rod angle, angular velocity and angular acceleration?",
    "description": "Analytical kinematics of the fourbar offset slider-crank (inversion 1) by Norton’s vector loop: θ3 = arcsin[(a sin θ2 − c) ÷ b] for the first circuit or arcsin[−(a sin θ2 − c) ÷ b] + π for the second, slider position d = a cos θ2 − b cos θ3, ω3 = (a cos θ2 ÷ b cos θ3) ω2, slider velocity ḋ = −aω2 sin θ2 + bω3 sin θ3, α3 = (aα2 cos θ2 − aω2² sin θ2 + bω3² sin θ3) ÷ (b cos θ3) and slider acceleration d̈ = −aα2 sin θ2 − aω2² cos θ2 + bα3 sin θ3 + bω3² cos θ3, with the offset c measured square to the slide axis.",
    "keywords": [
      "MAKEOS",
      "slider crank kinematics",
      "offset slider crank",
      "piston velocity acceleration",
      "connecting rod angle",
      "slider position crank angle",
      "crank slider analysis"
    ],
    "fields": [
      {
        "key": "a",
        "label": "Crank a (link 2)",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Connecting rod b (link 3)",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Offset c of the slide axis",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2",
        "label": "Crank angle θ2",
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
        "key": "w2",
        "label": "Crank angular velocity ω2 (+ anticlockwise)",
        "type": "number",
        "default": 100,
        "unit": "rad/s",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Crank angular acceleration α2",
        "type": "number",
        "default": 0,
        "unit": "rad/s²",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "circ",
        "label": "Circuit",
        "type": "select",
        "default": "2",
        "options": [
          [
            "2",
            "Slider on the +X side of the crank pivot (as Norton’s Figure 4-9)"
          ],
          [
            "1",
            "Slider on the −X side of the crank pivot"
          ]
        ]
      }
    ]
  }
]);
