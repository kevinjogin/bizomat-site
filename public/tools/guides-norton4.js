// MAKEOS methods, input sources and limits for the mechanism kinematics topic tools (batch norton4).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "vee-engine-balance": {
    "purpose": "Balance of a vee engine by Norton’s bank equations: each throw drives one cylinder in each bank, the right bank sees the crank at θ + γ and the left bank at θ − γ, where 2γ is the vee angle and θ = ωt − φi, and each cylinder’s force is mB rω²[cos(θ ± γ) + (r/l) cos 2(θ ± γ)] along its bank. The bank forces combine to Fx = (FL + FR) cos γ along the vee centreline and Fy = (FL − FR) sin γ across it, the moments with the cylinder positions zi, and the inertia torque sums ½ mB r²ω²[(r/2l) sin x − sin 2x − (3r/2l) sin 3x] over both banks. The tool follows these over one revolution and reports the peak primary and secondary force and moment, whether each is balanced or rotates at constant magnitude, and the values at a crank angle you choose.",
    "uses": [
      "Check a vee engine layout for primary and secondary balance",
      "See whether an unbalanced primary can be taken by a crankshaft counterweight",
      "Compare vee angles and crank phasing for shaking forces and moments"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "n": "Number of crank throws; each throw carries one cylinder from each bank.",
      "vee": "Angle between the two cylinder banks; the bank angle γ is half of it.",
      "p2": "Crank phase angle of throw 2 relative to throw 1 (φ1 = 0).",
      "p3": "Crank phase angle of throw 3.",
      "p4": "Crank phase angle of throw 4.",
      "p5": "Crank phase angle of throw 5.",
      "p6": "Crank phase angle of throw 6.",
      "z1": "Distance along the crankshaft from the moment reference point to throw 1.",
      "sp": "Distance between neighbouring throws.",
      "mB": "Reciprocating mass of one cylinder (piston plus the rod’s share at the wrist pin), to size the forces.",
      "r": "Crank throw, half the stroke.",
      "l": "Connecting rod length.",
      "rpm": "Crankshaft speed for the force and torque values.",
      "th": "Crank angle of throw 1 from the vee centreline at which the instantaneous values are given."
    },
    "outputs": [
      "Peak primary and secondary shaking force and whether each is balanced or rotates at constant magnitude",
      "Peak primary and secondary shaking moment",
      "Peak inertia torque",
      "Force, moment and inertia torque at the chosen crank angle"
    ],
    "method": [
      "γ = vee angle ÷ 2; θ = ωt − φi (eq. 14.10a); zi = z1 + (i − 1) × spacing.",
      "Right bank: FR = mB rω²[cos(θ + γ) + (r/l) cos 2(θ + γ)]; left bank: FL with θ − γ (eq. 14.10d).",
      "Fx = (FL + FR) cos γ, Fy = (FL − FR) sin γ (eq. 14.10j); moments Mx = (ML − MR) sin γ, My = (−ML − MR) cos γ with the zi-weighted bank sums (eqs. 14.11).",
      "Inertia torque: ½ mB r²ω² Σ [(r/2l) sin x − sin 2x − (3r/2l) sin 3x] with x = θ + γ and θ − γ for the two banks (eqs. 14.12).",
      "The forces and moments are followed at 1,440 crank angles over one revolution; a harmonic whose magnitude does not change rotates at constant size.",
      "Example: the peak primary moment factor is 316.23 mm with balanced shaking forces."
    ],
    "limitations": [
      "Both cylinders on a throw are taken in the same plane along the crankshaft; any offset between the banks is ignored.",
      "The force expression keeps the first two harmonics, as Norton’s approximation does; rotating masses are assumed counterweighted on each throw.",
      "All cylinders are assumed alike in mass and size and the throws equally spaced.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A harmonic of constant magnitude turning with the crank can be cancelled by a counterweight on the crankshaft; one that changes size cannot.",
      "The secondary terms are multiplied by r/l and turn at twice crank speed, so crankshaft counterweights cannot balance them."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 664–669. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "geared-fivebar-kinematics": {
    "purpose": "Analytical kinematics of Norton’s geared fivebar: links 2 and 5 are pivoted on the ground and geared together so that θ5 = λθ2 + φ, which reduces the fivebar to two unknowns. θ4 comes from the half-angle solution θ4 = 2 arctan[(−E ± √(E² − 4DF)) ÷ 2D] with Norton’s A, B, C, D, E and F, θ3 from the loop equations, ω3 and ω4 from the two velocity equations with ω5 = λω2, and α3 and α4 from Norton’s acceleration equations with α5 = λα2. It also gives the transmission angle between links 3 and 4 and the position and speed of a point on the coupler.",
    "uses": [
      "Analyse a geared fivebar at any crank angle",
      "Try gear ratios and phase angles for a coupler path",
      "Check the transmission angle of a geared fivebar"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "a": "Length of link 2 from its fixed pivot O2 to the joint A with the coupler.",
      "b": "Length of link 3 from joint A to joint B.",
      "c": "Length of link 4 from joint C on link 5 to joint B.",
      "d": "Length of link 5 from its fixed pivot O5 to joint C.",
      "f": "Distance between the fixed pivots O2 and O5, along the X axis.",
      "lam": "Ratio between the rotations of the two geared links; external gears turn opposite ways, so λ is then negative.",
      "phi": "Angle of link 5 when link 2 is at 0°, set by how the gears are meshed.",
      "t2": "Angle of link 2 measured anticlockwise from the line O2O5.",
      "w2": "Angular velocity of link 2; anticlockwise is positive.",
      "a2": "Angular acceleration of link 2; anticlockwise is positive.",
      "circ": "Which of the two assemblies of links 3 and 4, by the sign taken in the θ4 solution.",
      "p": "Distance from joint A to a point of interest on the coupler.",
      "d3": "Angle from line AB to the coupler point, anticlockwise."
    },
    "outputs": [
      "Angles θ3, θ4 and θ5",
      "Angular velocities ω3, ω4 and ω5",
      "Angular accelerations α3, α4 and α5",
      "Transmission angle and the coupler point position and speed"
    ],
    "method": [
      "θ5 = λθ2 + φ, ω5 = λω2, α5 = λα2 (eqs. 4.23c, 7.28c).",
      "A = 2c[d cos θ5 − a cos θ2 + f], B = 2c[d sin θ5 − a sin θ2], C = a² − b² + c² + d² + f² − 2af cos θ2 − 2d(a cos θ2 − f) cos θ5 − 2ad sin θ2 sin θ5; D = C − A, E = 2B, F = A + C; θ4 = 2 arctan[(−E ± √(E² − 4DF)) ÷ 2D] (eq. 4.24h).",
      "θ3 from b cos θ3 = −a cos θ2 + c cos θ4 + d cos θ5 + f and b sin θ3 = −a sin θ2 + c sin θ4 + d sin θ5 (eqs. 4.24e, f).",
      "ω3 and ω4 by solving the two velocity equations together (eqs. 6.32, 6.33); α3 and α4 from eqs. 7.29a and 7.29b.",
      "Example: θ3 = 28.149°, θ4 = 75.045° and ω4 = -4.4768 rad/s."
    ],
    "limitations": [
      "If E² − 4DF is negative the links cannot assemble at this crank angle.",
      "The gears are taken as exact: backlash and tooth errors are ignored.",
      "When λ is not a whole number the linkage takes more than one crank turn to repeat; the assembly check covers crank angles 0–360° only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Changing the phase angle by re-meshing the gears changes the coupler curve without changing any link.",
      "Keep the transmission angle between links 3 and 4 well away from 0° and 180°."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 164–166, 277–278, 319–320. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "fourbar-three-position-synthesis": {
    "purpose": "Three-position motion generation by Norton’s analytical method: the coupler point moves P21 at angle δ2 and P31 at angle δ3 from its first position while the coupler turns α2 and α3. Choosing the rotations β2 and β3 of the input link and γ2 and γ3 of the output link as free choices makes each dyad a set of four linear equations (eqs. 5.24–5.27 and 5.30–5.31), solved here for the vectors W and Z of the input dyad and U and S of the output dyad. The coupler V = Z − S and the ground G = W + V − U (eqs. 5.2), the fixed pivots follow from the first position, and the tool gives the crank, coupler and rocker angles, the transmission angle and the assembly circuit at each position, with the Grashof class.",
    "uses": [
      "Design a fourbar to carry a part through three positions",
      "Try free choices of the link rotations until the linkage is practical",
      "Find the fixed pivot positions and link lengths for a three-position task"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "p21": "Straight-line distance the coupler point moves from the first to the second position.",
      "d2": "Angle of that move measured anticlockwise from the X axis.",
      "p31": "Straight-line distance the coupler point moves from the first to the third position.",
      "d3": "Angle of the move from the first to the third position, anticlockwise from X.",
      "a2": "Rotation of the coupler between the first and second positions, anticlockwise positive.",
      "a3": "Rotation of the coupler between the first and third positions, anticlockwise positive.",
      "b2": "Chosen rotation of the input link between positions 1 and 2.",
      "b3": "Chosen rotation of the input link between positions 1 and 3.",
      "g2": "Chosen rotation of the output link between positions 1 and 2.",
      "g3": "Chosen rotation of the output link between positions 1 and 3."
    },
    "outputs": [
      "Vectors W, Z, U and S of the two dyads",
      "Link lengths and fixed pivot positions measured from the first precision point",
      "Coupler point location on the coupler",
      "Crank, coupler and rocker angles, transmission angle and circuit at each position, and the Grashof class"
    ],
    "method": [
      "Input dyad: A = cos β2 − 1, B = sin β2, C = cos α2 − 1, D = sin α2, E = p21 cos δ2, F = cos β3 − 1, G = sin β3, H = cos α3 − 1, K = sin α3, L = p31 cos δ3, M = p21 sin δ2, N = p31 sin δ3 (eq. 5.25); solve the 4 × 4 system of eq. 5.27 for W1x, W1y, Z1x, Z1y.",
      "Output dyad: the same with γ2 and γ3 in place of β2 and β3 (eqs. 5.30, 5.31) for U1 and S1.",
      "Coupler V = Z − S; ground G = W + V − U (eqs. 5.2); O2 = −Z − W and O4 = −S − U from the first precision point.",
      "At each position the angles are taken from the ground line O2O4; the circuit is found by comparing the rocker angle with the open and crossed fourbar solutions (eq. 4.10).",
      "Example: the links are 229.35, 173.53, 35.542 and 81.27 mm."
    ],
    "limitations": [
      "Each set of free choices gives a different linkage; many will be impractical, with pivots too far away or circuit, branch or order defects.",
      "The linkage reaches the three positions exactly but its motion between them is not controlled; run it in a fourbar analysis to check it.",
      "Angles are measured anticlockwise; all data are relative to the first position, so the global origin is at the first precision point.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the circuit differs between positions the linkage would have to be taken apart to reach all three; change the free choices.",
      "Keep the transmission angle above about 40° at every position."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 155–157, 191, 201–209, 258. Topic reference; no source tables, figures or examples are reproduced."
    ]
  }
});
