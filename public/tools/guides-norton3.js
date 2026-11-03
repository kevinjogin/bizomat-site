// MAKEOS methods, input sources and limits for the mechanism kinematics topic tools (batch norton3).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "inverted-slider-crank-kinematics": {
    "purpose": "Analytical kinematics of Norton’s inversion 3 of the fourbar slider-crank: the output angle θ4 from P sin θ4 + Q cos θ4 + R = 0 with P = a sin θ2 sin γ + (a cos θ2 − d) cos γ, Q = −a sin θ2 cos γ + (a cos θ2 − d) sin γ, R = −c sin γ, solved through tan(θ4/2), the coupler angle θ3 = θ4 ± γ, the varying length b from the loop equations, ω3 = ω4 = aω2 cos(θ2 − θ3) ÷ [b + c cos(θ4 − θ3)], the slip velocity ḃ, and α3 = α4 and the slip acceleration b̈ from the acceleration loop equations including the Coriolis term 2ḃω3.",
    "uses": [
      "Analyse linkages driven through a sliding block, such as an oscillating cylinder",
      "Find the slip velocity and acceleration at a sliding joint",
      "Find the Coriolis acceleration in a rotating slider"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "a": "Length of the crank from O2 to the crank pin A.",
      "c": "Length of the output link from its pivot O4 to the slider block pivot B.",
      "d": "Distance between the fixed pivots O2 and O4.",
      "g": "Fixed angle between the slide line (link 3) and link 4 at the block, 90° when the slide is square to link 4.",
      "t2": "Crank angle measured anticlockwise from O2O4.",
      "w2": "Crank angular velocity; anticlockwise is positive.",
      "a2": "Crank angular acceleration; anticlockwise is positive.",
      "circ": "Which of the two assemblies, given by the sign of γ in θ3 = θ4 ± γ."
    },
    "outputs": [
      "Output and coupler angles θ4 and θ3",
      "Slider position b along the coupler",
      "Angular velocity ω4 and slip velocity ḃ",
      "Angular acceleration α4, slip acceleration b̈ and the Coriolis acceleration"
    ],
    "method": [
      "P, Q, R as above; S = R − Q, T = 2P, U = Q + R; θ4 = 2 arctan[(−T ± √(T² − 4SU)) ÷ 2S] (eqs. 4.21, 4.22), taking the root that gives a positive b.",
      "θ3 = θ4 + γ (open) or θ4 − γ (crossed) (eq. 4.18); b = (a sin θ2 − c sin θ4) ÷ sin θ3 (eq. 4.20a).",
      "ω4 = ω3 = aω2 cos(θ2 − θ3) ÷ [b + c cos(θ4 − θ3)]; ḃ from eq. 6.29 (eqs. 6.25, 6.30).",
      "α4 = α3 and b̈ by solving the two scalar acceleration equations together, which include the Coriolis term 2ḃω3 (eqs. 7.22, 7.25).",
      "Example: θ4 = 99.02°, b = 61.415 mm and ω4 = -6.0813 rad/s."
    ],
    "limitations": [
      "If T² − 4SU is negative the links cannot assemble at this crank angle.",
      "Angles are measured anticlockwise from the X axis along O2O4; the analysis is for one position.",
      "Velocities and accelerations are in mm/s and mm/s² when lengths are in millimetres.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The Coriolis acceleration 2ḃω3 is present whenever the slider slips along a rotating link.",
      "The slip velocity is lost motion along the slide; only the transmission component does useful work."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 161–163, 276–278, 315–318. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "cam-svaj-functions": {
    "purpose": "Norton’s s v a j functions for double-dwell cams: simple harmonic s = (h/2)[1 − cos(πθ/β)], cycloidal s = h[θ/β − (1/2π) sin(2πθ/β)], the five-segment modified trapezoid and three-segment modified sine with their published coefficients, the 3-4-5 polynomial s = h[10(θ/β)³ − 15(θ/β)⁴ + 6(θ/β)⁵] and the 4-5-6-7 polynomial s = h[35(θ/β)⁴ − 84(θ/β)⁵ + 70(θ/β)⁶ − 20(θ/β)⁷], each with its exact derivatives, converted to time by ω, ω² and ω³, for a rise or a fall, with the peak values over the segment.",
    "uses": [
      "Get the follower motion at any cam angle for a chosen cam program",
      "Compare peak velocity, acceleration and jerk of cam programs",
      "Size the follower spring from the peak negative acceleration"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "law": "Displacement function used for the segment.",
      "dir": "Whether the follower rises or falls in this segment.",
      "h": "Total follower lift over the segment.",
      "beta": "Cam angle over which the segment takes place.",
      "th": "Cam angle from the start of the segment at which to evaluate the motion.",
      "rpm": "Camshaft speed, taken as constant."
    },
    "outputs": [
      "Displacement, velocity, acceleration and jerk at θ",
      "Peak velocity, acceleration and jerk over the segment",
      "The same per radian of cam rotation"
    ],
    "method": [
      "x = θ/β. Simple harmonic: s = (h/2)(1 − cos πx); cycloidal: s = h(x − sin 2πx ÷ 2π) (eqs. 8.6, 8.12).",
      "Modified trapezoid: five pieces joined at β/8, 3β/8, 5β/8 and 7β/8 (eqs. 8.13a–e); modified sine: three pieces joined at β/8 and 7β/8 (eqs. 8.14a–c).",
      "3-4-5: s = h(10x³ − 15x⁴ + 6x⁵) (eq. 8.20); 4-5-6-7: s = h(35x⁴ − 84x⁵ + 70x⁶ − 20x⁷) (eq. 8.21); v, a, j are the derivatives with respect to θ in radians.",
      "Time-based values: v × ω, a × ω², j × ω³ with ω = 2π rpm ÷ 60; a fall is h minus the rise with v, a, j reversed.",
      "Example: peak acceleration 2.5133 m/s² and peak jerk 63.165 m/s³."
    ],
    "limitations": [
      "These are double-dwell programs; the simple harmonic breaks the fundamental law of cam design at dwells because its acceleration is not zero at the ends.",
      "Peak values are found by evaluating the functions over the segment.",
      "The motion is of the follower; the cam profile also depends on the follower type and base circle.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The cycloidal has smooth jerk; the modified trapezoid has the lowest peak acceleration of these; the modified sine the lowest peak velocity.",
      "Dynamic force is proportional to acceleration, so the peak negative acceleration sizes the return spring."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 357–370, 380–382. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "fourbar-force-balance": {
    "purpose": "Complete force balance of a fourbar linkage by the Berkof-Lowen method Norton presents: the global mass centre is made stationary when m2b2 e^{jφ2} = m3 (b3 (l2/l3) e^{jφ3} − l2) and m4b4 e^{jφ4} = −m3 b3 (l4/l3) e^{jφ3}, giving (m2b2)x = m3 (b3 (l2/l3) cos φ3 − l2), (m2b2)y = m3 b3 (l2/l3) sin φ3, (m4b4)x = −m3 b3 (l4/l3) cos φ3, (m4b4)y = −m3 b3 (l4/l3) sin φ3, with the coupler mass and centre of gravity you enter and the existing unbalance of the crank and rocker subtracted to give the counterweights to add.",
    "uses": [
      "Size counterweights that cancel the shaking force of a fourbar",
      "Find where on the crank and rocker the counterweights go",
      "Check the existing unbalance of the crank and rocker"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "l2": "Length of the crank between pin centres O2 and A.",
      "l3": "Length of the coupler between pin centres A and B.",
      "l4": "Length of the rocker between pin centres O4 and B.",
      "m3": "Mass of the coupler including its pins.",
      "b3": "Distance from joint A to the coupler’s centre of gravity.",
      "p3": "Angle from the line AB to the line from A to the coupler CG, measured anticlockwise.",
      "m2b2": "Mass times CG distance from O2 of the crank as it is, before counterweighting.",
      "p2": "Angle of the crank CG from the line O2A.",
      "m4b4": "Mass times CG distance from O4 of the rocker as it is.",
      "p4": "Angle of the rocker CG from the line O4B."
    },
    "outputs": [
      "Total mass-radius product needed on the crank and its angle",
      "Total mass-radius product needed on the rocker and its angle",
      "Counterweights to add after the existing unbalance",
      "x and y components"
    ],
    "method": [
      "Required crank m2b2: x = m3 (b3 (l2/l3) cos φ3 − l2), y = m3 b3 (l2/l3) sin φ3 (eq. 12.8c).",
      "Required rocker m4b4: x = −m3 b3 (l4/l3) cos φ3, y = −m3 b3 (l4/l3) sin φ3 (eq. 12.8d).",
      "Angles are measured from each link’s line of centres (O2A, O4B); counterweight to add = required − existing, converted to magnitude and angle.",
      "With these the global mass centre is stationary and the shaking force is zero; the shaking moment and input torque are not balanced.",
      "Example: the crank needs 157.59 kg·mm at 156.3° and the rocker 253.33 kg·mm at 210°."
    ],
    "limitations": [
      "The method balances shaking force only; Norton notes that force balance usually increases the shaking moment and the input torque.",
      "Pin forces at the crank and rocker pivots remain; they become equal and opposite.",
      "Masses and CG positions of the links are entered by you from the design.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A counterweight mass-radius product can be any combination of mass and radius that gives the product.",
      "The required angle on each link is measured from its own line of centres, so the counterweight moves with the link."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 580–583. Topic reference; no source tables, figures or examples are reproduced."
    ]
  }
});
