// BIZOMAT MAKEOS: mechanism kinematics topic tools (batch norton4) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "vee-engine-balance",
    "name": "Vee Engine Shaking Force, Shaking Moment and Inertia Torque (Shared Crank Throws)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a vee engine with two cylinders on each crank throw, my vee angle and my crank phase angles, are the primary and secondary shaking forces and moments balanced, does an unbalanced primary rotate at constant size so a crank counterweight can take it, and how large is the inertia torque?",
    "description": "Balance of a vee engine by Norton’s bank equations: each throw drives one cylinder in each bank, the right bank sees the crank at θ + γ and the left bank at θ − γ, where 2γ is the vee angle and θ = ωt − φi, and each cylinder’s force is mB rω²[cos(θ ± γ) + (r/l) cos 2(θ ± γ)] along its bank. The bank forces combine to Fx = (FL + FR) cos γ along the vee centreline and Fy = (FL − FR) sin γ across it, the moments with the cylinder positions zi, and the inertia torque sums ½ mB r²ω²[(r/2l) sin x − sin 2x − (3r/2l) sin 3x] over both banks. The tool follows these over one revolution and reports the peak primary and secondary force and moment, whether each is balanced or rotates at constant magnitude, and the values at a crank angle you choose.",
    "keywords": [
      "MAKEOS",
      "vee engine balance",
      "V8 shaking force",
      "V twin primary balance",
      "vee angle balance",
      "cross plane crank balance",
      "vee engine inertia torque"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of crank throws (cylinders per bank)",
        "type": "number",
        "default": 4,
        "unit": "throws",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "vee",
        "label": "Vee angle between the banks 2γ",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Phase angle φ2 of throw 2",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": -720,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p3",
        "label": "Phase angle φ3",
        "type": "number",
        "default": 270,
        "unit": "°",
        "min": -720,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p4",
        "label": "Phase angle φ4",
        "type": "number",
        "default": 180,
        "unit": "°",
        "min": -720,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p5",
        "label": "Phase angle φ5",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -720,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p6",
        "label": "Phase angle φ6",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -720,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Distance of throw 1 from the moment reference z1",
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
        "key": "sp",
        "label": "Throw spacing",
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
        "key": "mB",
        "label": "Reciprocating mass per cylinder mB (0 = factors only)",
        "type": "number",
        "default": 0,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Crank radius r",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l",
        "label": "Connecting rod length l",
        "type": "number",
        "default": 157.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Crankshaft speed",
        "type": "number",
        "default": 3400,
        "unit": "rpm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th",
        "label": "Crank angle ωt for the instantaneous values",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -720,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "geared-fivebar-kinematics",
    "name": "Geared Fivebar Linkage Position, Velocity and Acceleration",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a geared fivebar linkage with my link lengths, gear ratio and phase angle, where are links 3, 4 and 5 at a given crank angle, what are their angular velocities and accelerations, and where is a coupler point and how fast is it moving?",
    "description": "Analytical kinematics of Norton’s geared fivebar: links 2 and 5 are pivoted on the ground and geared together so that θ5 = λθ2 + φ, which reduces the fivebar to two unknowns. θ4 comes from the half-angle solution θ4 = 2 arctan[(−E ± √(E² − 4DF)) ÷ 2D] with Norton’s A, B, C, D, E and F, θ3 from the loop equations, ω3 and ω4 from the two velocity equations with ω5 = λω2, and α3 and α4 from Norton’s acceleration equations with α5 = λα2. It also gives the transmission angle between links 3 and 4 and the position and speed of a point on the coupler.",
    "keywords": [
      "MAKEOS",
      "geared fivebar linkage",
      "fivebar kinematics",
      "geared five bar mechanism",
      "fivebar coupler curve",
      "gear ratio phase angle linkage",
      "two degree of freedom linkage geared"
    ],
    "fields": [
      {
        "key": "a",
        "label": "Link 2 (geared crank) a",
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
        "label": "Link 3 (coupler) b",
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
        "label": "Link 4 c",
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
        "key": "d",
        "label": "Link 5 (geared link) d",
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
        "key": "f",
        "label": "Ground link O2O5 f",
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
        "key": "lam",
        "label": "Gear ratio λ (θ5 = λθ2 + φ; negative for external gears)",
        "type": "number",
        "default": -1,
        "unit": "",
        "min": -10,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Phase angle φ",
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
        "key": "t2",
        "label": "Crank angle θ2",
        "type": "number",
        "default": 30,
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
        "label": "Assembly (sign of the root in eq. 4.24h)",
        "type": "select",
        "default": "minus",
        "options": [
          [
            "minus",
            "Minus root (−)"
          ],
          [
            "plus",
            "Plus root (+)"
          ]
        ]
      },
      {
        "key": "p",
        "label": "Coupler point distance from A (0 = none)",
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
        "label": "Coupler point angle from line AB",
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
    "id": "fourbar-three-position-synthesis",
    "name": "Fourbar Three-Position Motion Synthesis (Analytical Dyad Method)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "I need a fourbar whose coupler carries a line through three given positions: from the moves of the coupler point and the coupler rotations between the positions, and my free choices of the crank and rocker rotations, what are the link lengths, the fixed pivot locations, the coupler point and the linkage angles at each position?",
    "description": "Three-position motion generation by Norton’s analytical method: the coupler point moves P21 at angle δ2 and P31 at angle δ3 from its first position while the coupler turns α2 and α3. Choosing the rotations β2 and β3 of the input link and γ2 and γ3 of the output link as free choices makes each dyad a set of four linear equations (eqs. 5.24–5.27 and 5.30–5.31), solved here for the vectors W and Z of the input dyad and U and S of the output dyad. The coupler V = Z − S and the ground G = W + V − U (eqs. 5.2), the fixed pivots follow from the first position, and the tool gives the crank, coupler and rocker angles, the transmission angle and the assembly circuit at each position, with the Grashof class.",
    "keywords": [
      "MAKEOS",
      "three position synthesis",
      "fourbar motion generation",
      "analytical linkage synthesis",
      "dyad synthesis standard form",
      "precision point synthesis",
      "design a four bar linkage"
    ],
    "fields": [
      {
        "key": "p21",
        "label": "Move of the coupler point from position 1 to 2, p21",
        "type": "number",
        "default": 71.07,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d2",
        "label": "Direction of that move δ2",
        "type": "number",
        "default": -31.19,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p31",
        "label": "Move from position 1 to 3, p31",
        "type": "number",
        "default": 99.54,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d3",
        "label": "Direction of that move δ3",
        "type": "number",
        "default": -16.34,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Coupler rotation from position 1 to 2, α2",
        "type": "number",
        "default": -45,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Coupler rotation from position 1 to 3, α3",
        "type": "number",
        "default": 9.3,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b2",
        "label": "Chosen input link rotation β2",
        "type": "number",
        "default": 342.3,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b3",
        "label": "Chosen input link rotation β3",
        "type": "number",
        "default": 324.8,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g2",
        "label": "Chosen output link rotation γ2",
        "type": "number",
        "default": 30.9,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g3",
        "label": "Chosen output link rotation γ3",
        "type": "number",
        "default": 80.6,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
