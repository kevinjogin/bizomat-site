// KEVOS® MAKEOS: mechanism kinematics topic tools (batch norton3) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "inverted-slider-crank-kinematics",
    "name": "Inverted Slider-Crank Position, Velocity and Acceleration (Inversion 3)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For an inverted slider-crank, where the slider block pivots on the output link and the coupler slides through it, what are the output link angle, the slider position along the coupler, their rates and accelerations, and the Coriolis acceleration at the slider?",
    "description": "Analytical kinematics of Norton’s inversion 3 of the fourbar slider-crank: the output angle θ4 from P sin θ4 + Q cos θ4 + R = 0 with P = a sin θ2 sin γ + (a cos θ2 − d) cos γ, Q = −a sin θ2 cos γ + (a cos θ2 − d) sin γ, R = −c sin γ, solved through tan(θ4/2), the coupler angle θ3 = θ4 ± γ, the varying length b from the loop equations, ω3 = ω4 = aω2 cos(θ2 − θ3) ÷ [b + c cos(θ4 − θ3)], the slip velocity ḃ, and α3 = α4 and the slip acceleration b̈ from the acceleration loop equations including the Coriolis term 2ḃω3.",
    "keywords": [
      "MAKEOS",
      "inverted slider crank",
      "slider crank inversion 3",
      "Coriolis acceleration slider",
      "slip velocity linkage",
      "oscillating cylinder linkage",
      "slotted link kinematics"
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
        "key": "c",
        "label": "Output link c (link 4, pivot to slider)",
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
        "key": "g",
        "label": "Slider angle γ between links 3 and 4",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.1,
        "max": 179.9,
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
        "label": "Circuit",
        "type": "select",
        "default": "open",
        "options": [
          [
            "open",
            "Open (θ3 = θ4 + γ)"
          ],
          [
            "crossed",
            "Crossed (θ3 = θ4 − γ)"
          ]
        ]
      }
    ]
  },
  {
    "id": "cam-svaj-functions",
    "name": "Cam Follower Displacement, Velocity, Acceleration and Jerk (Double-Dwell Functions)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a cam rise or fall between dwells using a simple harmonic, cycloidal, modified trapezoid, modified sine, 3-4-5 or 4-5-6-7 polynomial program, what are the follower displacement, velocity, acceleration and jerk at a cam angle, and what are their peak values at my cam speed?",
    "description": "Norton’s s v a j functions for double-dwell cams: simple harmonic s = (h/2)[1 − cos(πθ/β)], cycloidal s = h[θ/β − (1/2π) sin(2πθ/β)], the five-segment modified trapezoid and three-segment modified sine with their published coefficients, the 3-4-5 polynomial s = h[10(θ/β)³ − 15(θ/β)⁴ + 6(θ/β)⁵] and the 4-5-6-7 polynomial s = h[35(θ/β)⁴ − 84(θ/β)⁵ + 70(θ/β)⁶ − 20(θ/β)⁷], each with its exact derivatives, converted to time by ω, ω² and ω³, for a rise or a fall, with the peak values over the segment.",
    "keywords": [
      "MAKEOS",
      "cam svaj",
      "cycloidal cam motion",
      "modified trapezoid cam",
      "modified sine cam",
      "3-4-5 polynomial cam",
      "cam jerk"
    ],
    "fields": [
      {
        "key": "law",
        "label": "Cam program",
        "type": "select",
        "default": "cyc",
        "options": [
          [
            "shm",
            "Simple harmonic"
          ],
          [
            "cyc",
            "Cycloidal"
          ],
          [
            "mtrap",
            "Modified trapezoid"
          ],
          [
            "msine",
            "Modified sine"
          ],
          [
            "p345",
            "3-4-5 polynomial"
          ],
          [
            "p4567",
            "4-5-6-7 polynomial"
          ]
        ]
      },
      {
        "key": "dir",
        "label": "Segment",
        "type": "select",
        "default": "rise",
        "options": [
          [
            "rise",
            "Rise"
          ],
          [
            "fall",
            "Fall"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Total rise (lift) h",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Cam angle of the segment β",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.1,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th",
        "label": "Cam angle into the segment θ",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Camshaft speed",
        "type": "number",
        "default": 60,
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
    "id": "fourbar-force-balance",
    "name": "Fourbar Linkage Complete Force Balance (Counterweights on Crank and Rocker)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What counterweight mass-radius products, and at what angles, must I add to the crank and rocker of my fourbar so that its overall centre of mass stays still and the shaking force on the frame vanishes?",
    "description": "Complete force balance of a fourbar linkage by the Berkof-Lowen method Norton presents: the global mass centre is made stationary when m2b2 e^{jφ2} = m3 (b3 (l2/l3) e^{jφ3} − l2) and m4b4 e^{jφ4} = −m3 b3 (l4/l3) e^{jφ3}, giving (m2b2)x = m3 (b3 (l2/l3) cos φ3 − l2), (m2b2)y = m3 b3 (l2/l3) sin φ3, (m4b4)x = −m3 b3 (l4/l3) cos φ3, (m4b4)y = −m3 b3 (l4/l3) sin φ3, with the coupler mass and centre of gravity you enter and the existing unbalance of the crank and rocker subtracted to give the counterweights to add.",
    "keywords": [
      "MAKEOS",
      "fourbar force balance",
      "linkage counterweight",
      "shaking force balance",
      "Berkof Lowen method",
      "mass centre stationary",
      "crank and rocker balance"
    ],
    "fields": [
      {
        "key": "l2",
        "label": "Crank length l2 (O2 to A)",
        "type": "number",
        "default": 127,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l3",
        "label": "Coupler length l3 (A to B)",
        "type": "number",
        "default": 381,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l4",
        "label": "Rocker length l4 (O4 to B)",
        "type": "number",
        "default": 254,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Coupler mass m3",
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
        "key": "b3",
        "label": "Coupler CG distance from A, b3",
        "type": "number",
        "default": 190,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p3",
        "label": "Coupler CG angle from line AB, φ3",
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
        "key": "m2b2",
        "label": "Existing crank unbalance m2b2 (0 if none)",
        "type": "number",
        "default": 0,
        "unit": "kg·mm",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Angle of the existing crank unbalance from O2A, φ2",
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
        "key": "m4b4",
        "label": "Existing rocker unbalance m4b4 (0 if none)",
        "type": "number",
        "default": 0,
        "unit": "kg·mm",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p4",
        "label": "Angle of the existing rocker unbalance from O4B, φ4",
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
  }
]);
