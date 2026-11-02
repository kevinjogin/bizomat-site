// MAKEOS methods, input sources and limits for the mechanism kinematics topic tools (batch norton2).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "engine-piston-motion": {
    "purpose": "Piston motion of the in-line slider-crank by Norton’s engine dynamics equations: exact position x = r cos ωt + l √[1 − (r/l sin ωt)²] with its exact derivatives, and the Fourier approximations from the binomial expansion x ≈ l − r²/4l + r (cos ωt + (r/4l) cos 2ωt), ẋ ≈ −rω (sin ωt + (r/2l) sin 2ωt) and ẍ ≈ −rω² (cos ωt + (r/l) cos 2ωt), with the crank-conrod ratio r/l and the peak acceleration at top dead centre rω² (1 + r/l).",
    "uses": [
      "Find the piston speed and acceleration of an engine or compressor",
      "Check the error of the two-harmonic approximation",
      "Compare crank-conrod ratios"
    ],
    "users": [
      "Engine and compressor designers",
      "Machine designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "r": "Crank throw, half the piston stroke.",
      "l": "Connecting rod length between the crankpin and wrist pin centres.",
      "rpm": "Crankshaft speed, taken as constant.",
      "wt": "Crank angle measured from top dead centre in the direction of rotation."
    },
    "outputs": [
      "Piston position, velocity and acceleration (exact)",
      "The same by the Fourier approximation",
      "Crank-conrod ratio",
      "Peak acceleration at top dead centre in g"
    ],
    "method": [
      "ω = 2π rpm ÷ 60; x = r cos ωt + l √[1 − (r/l sin ωt)²] (eq. 13.1d); ẋ and ẍ are its exact time derivatives at constant ω (eqs. 13.1e, 13.1f).",
      "Approximations: x ≈ l − r²/4l + r (cos ωt + r/4l cos 2ωt); ẋ ≈ −rω (sin ωt + r/2l sin 2ωt); ẍ ≈ −rω² (cos ωt + r/l cos 2ωt) (eqs. 13.3c–e).",
      "Peak acceleration at top dead centre = rω² (1 + r/l); g = 9.80665 m/s².",
      "Example: the piston accelerates at -5,789.5 m/s² at this angle; the peak is 747.91 g."
    ],
    "limitations": [
      "The crank is assumed to turn at constant speed; the cylinder axis passes through the crank centre (no offset).",
      "Norton recommends a crank-conrod ratio between about 1/3 and 1/5; above 1/2 the transmission angle becomes too small.",
      "The approximation drops the fourth and higher harmonics; its error is a fraction of one per cent at practical ratios.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The second harmonic, twice per revolution, is what makes the acceleration curve flat-topped near bottom dead centre.",
      "Peak acceleration rises with the square of speed."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 605–610. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "engine-gas-torque": {
    "purpose": "Gas force and gas torque of a single-cylinder slider-crank by Norton’s equations: gas force Fg = Pg π B² ÷ 4 on a bore B, piston side force Fg tan φ with the conrod angle φ from sin φ = (r/l) sin ωt, exact gas torque Tg = Fg tan φ × x with the exact piston position x, and the approximation Tg ≈ Fg r sin ωt (1 + (r/l) cos ωt), with the cylinder pressure you enter for the crank angle.",
    "uses": [
      "Turn a cylinder pressure into crankshaft torque",
      "Find the piston side thrust on the cylinder wall",
      "Check the approximate gas torque formula"
    ],
    "users": [
      "Engine and compressor designers",
      "Machine designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "B": "Cylinder bore, the piston diameter.",
      "Pg": "Cylinder pressure above the crankcase pressure at this crank angle, from the pressure curve.",
      "r": "Crank throw, half the piston stroke.",
      "l": "Connecting rod length between the crankpin and wrist pin centres.",
      "wt": "Crank angle measured from top dead centre in the direction of rotation."
    },
    "outputs": [
      "Piston area and gas force",
      "Conrod angle and piston side force",
      "Gas torque on the crankshaft (exact and approximate)"
    ],
    "method": [
      "Ap = π B² ÷ 4; Fg = Pg Ap (eq. 13.4).",
      "sin φ = (r/l) sin ωt; side force on the cylinder wall Fg14 = Fg tan φ (eq. 13.5a).",
      "Exact gas torque Tg = Fg tan φ × x with x = r cos ωt + l cos φ (eqs. 13.1d, 13.6d).",
      "Approximation Tg ≈ Fg r sin ωt (1 + (r/l) cos ωt) (eq. 13.8b).",
      "Example: 13.681 kN of gas force gives 384.78 N·m on the crankshaft."
    ],
    "limitations": [
      "Enter the gas pressure for the crank angle analysed; the pressure curve comes from the engine’s thermodynamics or measurement.",
      "Friction and inertia are not included; add the inertia torque for the total.",
      "The cylinder axis passes through the crank centre.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Gas torque is zero at top and bottom dead centre, where the moment arm is zero.",
      "The gas force is internal to the engine and does not shake the frame; the gas torque does turn the crank."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 605–613. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "engine-inertia-forces": {
    "purpose": "Dynamic model of the single-cylinder engine by Norton’s method: the conrod split into m3a = m3 lb ÷ (la + lb) at the crankpin and m3b = m3 la ÷ (la + lb) at the wrist pin with la and lb the distances from its centre of gravity, the centre of percussion lp = IG3 ÷ (m3 lb) for comparison, the crank as m2a = m2 rG2 ÷ r at the crankpin, mA = m2a + m3a and mB = m3b + m4; the shaking force Fx ≈ mA rω² cos ωt + mB rω² (cos ωt + (r/l) cos 2ωt) and Fy = mA rω² sin ωt, and the inertia torque Ti ≈ ½ mB r²ω² ((r/2l) sin ωt − sin 2ωt − (3r/2l) sin 3ωt).",
    "uses": [
      "Estimate the shaking forces of a single-cylinder engine or compressor",
      "Split a connecting rod into crankpin and wrist pin masses",
      "See the inertia torque that adds to the gas torque"
    ],
    "users": [
      "Engine and compressor designers",
      "Machine designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "r": "Crank throw, half the piston stroke.",
      "l": "Connecting rod length between the crankpin and wrist pin centres.",
      "rpm": "Crankshaft speed, taken as constant.",
      "wt": "Crank angle measured from top dead centre in the direction of rotation.",
      "m2": "Mass of the crank throw that is not balanced out, with its CG at rG2; 0 for a fully balanced crank.",
      "rG2": "Distance from the main bearing axis to the CG of the crank mass m2.",
      "m3": "Total mass of the connecting rod.",
      "la": "Distance from the conrod CG to the crankpin centre; lb is the rod length less this.",
      "IG3": "Mass moment of inertia of the conrod about its CG, if known, to place the centre of percussion.",
      "m4": "Mass of the piston, rings, wrist pin and clips."
    },
    "outputs": [
      "Conrod masses at the crankpin and wrist pin",
      "Rotating mass mA and reciprocating mass mB",
      "Shaking force components and their primary and secondary amplitudes",
      "Inertia torque"
    ],
    "method": [
      "lb = l − la; m3a = m3 lb ÷ (la + lb), m3b = m3 la ÷ (la + lb) (eq. 13.10); centre of percussion lp = IG3 ÷ (m3 lb) (eq. 13.9e).",
      "m2a = m2 rG2 ÷ r (eq. 13.11); mA = m2a + m3a, mB = m3b + m4 (eq. 13.12).",
      "Fx ≈ mA rω² cos ωt + mB rω² (cos ωt + (r/l) cos 2ωt); Fy = mA rω² sin ωt (eq. 13.14, shaking force on the frame, sign as the inertia force).",
      "Ti ≈ ½ mB r²ω² ((r/2l) sin ωt − sin 2ωt − (3r/2l) sin 3ωt) (eq. 13.15e).",
      "Example: mA = 0.66984 kg, mB = 0.65238 kg; the inertia torque is -102.42 N·m at this angle."
    ],
    "limitations": [
      "The lumped model puts the second conrod mass at the crankpin instead of the centre of percussion, an approximation Norton accepts for early design.",
      "The equations keep harmonics up to the third (torque) and second (force).",
      "Constant crank speed is assumed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The rotating mass mA can be balanced by a counterweight; the reciprocating mass mB cannot be fully balanced in a single cylinder.",
      "Inertia torque averages zero over a revolution but adds to the torque fluctuation."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 614–622. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "inline-engine-balance": {
    "purpose": "Balance of inline multicylinder engines by Norton’s phase-angle sums: shaking forces cancel through the second harmonic when Σ cos φi, Σ sin φi, Σ cos 2φi and Σ sin 2φi are all zero (and the fourth and sixth with 4φi and 6φi), inertia torque when the sums of φi, 2φi and 3φi are zero, and shaking moments when Σ zi cos nφi and Σ zi sin nφi are zero for n = 1, 2, 4 and 6; with the reciprocating mass, crank radius, rod length and speed you enter it gives the amplitudes of the unbalanced primary and secondary forces and moments, and the even firing interval 360° ÷ n (two-stroke) or 720° ÷ n (four-stroke).",
    "uses": [
      "Check a crankshaft layout for primary and secondary balance",
      "Find the unbalanced shaking forces and moments of an inline engine",
      "Find the even firing interval for a cylinder count"
    ],
    "users": [
      "Engine and compressor designers",
      "Machine designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "n": "Number of cylinders in line.",
      "cycle": "Two-stroke or four-stroke cycle, which sets the even firing interval.",
      "p2": "Crank phase angle of cylinder 2 relative to cylinder 1 (φ1 = 0).",
      "p3": "Crank phase angle of cylinder 3.",
      "p4": "Crank phase angle of cylinder 4.",
      "p5": "Crank phase angle of cylinder 5.",
      "p6": "Crank phase angle of cylinder 6.",
      "p7": "Crank phase angle of cylinder 7.",
      "p8": "Crank phase angle of cylinder 8.",
      "z1": "Distance along the crankshaft from the moment reference point to cylinder 1.",
      "sp": "Distance between neighbouring cylinder centres.",
      "mB": "Reciprocating mass of one cylinder (piston plus conrod wrist pin share), to size the unbalanced forces.",
      "r": "Crank throw, half the stroke.",
      "l": "Connecting rod length.",
      "rpm": "Crankshaft speed for the force amplitudes."
    },
    "outputs": [
      "Force sums for the 1st, 2nd, 4th and 6th harmonics",
      "Inertia torque sums for the 1st to 3rd harmonics",
      "Moment sums for the 1st, 2nd, 4th and 6th harmonics",
      "Unbalanced force and moment amplitudes and the even firing interval"
    ],
    "method": [
      "φ1 = 0; zi = z1 + (i − 1) × spacing.",
      "Shaking force balanced in harmonic k (k = 1, 2, 4, 6) when Σ cos kφi = Σ sin kφi = 0 (eq. 14.3); inertia torque balanced for k = 1, 2, 3 (eq. 14.5); shaking moment when Σ zi cos kφi = Σ zi sin kφi = 0 (eq. 14.7).",
      "Unbalanced amplitudes from eqs. 14.2d and 14.6b: primary force mB rω² √[(Σ cos φi)² + (Σ sin φi)²], secondary force (r/l) mB rω² √[(Σ cos 2φi)² + (Σ sin 2φi)²], and the same with zi for the moments.",
      "Even firing interval Δφ = 360° ÷ n (two-stroke) or 720° ÷ n (four-stroke) (eq. 14.8).",
      "Example: the primary force sums are 0 and 0."
    ],
    "limitations": [
      "All cylinders are assumed alike in mass and displacement and equally spaced; the expressions keep the harmonics Norton includes.",
      "The rotating masses are assumed counterweighted on each throw.",
      "Vee and opposed engines need the bank angle as well and are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The primary terms matter most because of their size; the secondary terms are multiplied by r/l and are smaller.",
      "A layout can balance forces and torques yet leave a shaking moment that pitches the engine, as Norton’s 0, 90, 180, 270° four-cylinder does."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 645–653. Topic reference; no source tables, figures or examples are reproduced."
    ]
  }
});
