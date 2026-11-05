// BIZOMAT MAKEOS: mechanism kinematics topic tools (batch norton2) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "engine-piston-motion",
    "name": "Engine Piston Position, Velocity and Acceleration (Exact and Fourier Approximation)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a single-cylinder engine or compressor slider-crank at a given crank angle and speed, where is the piston and how fast is it moving and accelerating, by the exact equations and by Norton’s two-harmonic approximation, and what is the peak piston acceleration?",
    "description": "Piston motion of the in-line slider-crank by Norton’s engine dynamics equations: exact position x = r cos ωt + l √[1 − (r/l sin ωt)²] with its exact derivatives, and the Fourier approximations from the binomial expansion x ≈ l − r²/4l + r (cos ωt + (r/4l) cos 2ωt), ẋ ≈ −rω (sin ωt + (r/2l) sin 2ωt) and ẍ ≈ −rω² (cos ωt + (r/l) cos 2ωt), with the crank-conrod ratio r/l and the peak acceleration at top dead centre rω² (1 + r/l).",
    "keywords": [
      "MAKEOS",
      "piston acceleration",
      "piston velocity crank angle",
      "engine slider crank",
      "crank conrod ratio",
      "piston g force",
      "secondary harmonic piston"
    ],
    "fields": [
      {
        "key": "r",
        "label": "Crank radius r (half the stroke)",
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
        "label": "Connecting rod length l (centre to centre)",
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
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wt",
        "label": "Crank angle ωt from top dead centre",
        "type": "number",
        "default": 30,
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
    "id": "engine-gas-torque",
    "name": "Engine Gas Force and Gas Torque at a Crank Angle",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a cylinder pressure at a given crank angle, what force does the gas put on the piston, what side force does the piston put on the cylinder wall, and what torque reaches the crankshaft, exactly and by Norton’s approximation?",
    "description": "Gas force and gas torque of a single-cylinder slider-crank by Norton’s equations: gas force Fg = Pg π B² ÷ 4 on a bore B, piston side force Fg tan φ with the conrod angle φ from sin φ = (r/l) sin ωt, exact gas torque Tg = Fg tan φ × x with the exact piston position x, and the approximation Tg ≈ Fg r sin ωt (1 + (r/l) cos ωt), with the cylinder pressure you enter for the crank angle.",
    "keywords": [
      "MAKEOS",
      "engine gas torque",
      "gas force piston",
      "piston side thrust",
      "crankshaft torque from pressure",
      "cylinder pressure torque",
      "slider crank torque"
    ],
    "fields": [
      {
        "key": "B",
        "label": "Bore B",
        "type": "number",
        "default": 76.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pg",
        "label": "Gas pressure at this crank angle (gauge)",
        "type": "number",
        "default": 3,
        "unit": "MPa",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Crank radius r (half the stroke)",
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
        "label": "Connecting rod length l (centre to centre)",
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
        "key": "wt",
        "label": "Crank angle ωt from top dead centre",
        "type": "number",
        "default": 30,
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
    "id": "engine-inertia-forces",
    "name": "Engine Lumped Masses, Shaking Force and Inertia Torque",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "From the masses of the crank, connecting rod and piston of a single-cylinder engine, what are the lumped masses at the crankpin and wrist pin, and what shaking forces and inertia torque does the engine produce at a crank angle and speed?",
    "description": "Dynamic model of the single-cylinder engine by Norton’s method: the conrod split into m3a = m3 lb ÷ (la + lb) at the crankpin and m3b = m3 la ÷ (la + lb) at the wrist pin with la and lb the distances from its centre of gravity, the centre of percussion lp = IG3 ÷ (m3 lb) for comparison, the crank as m2a = m2 rG2 ÷ r at the crankpin, mA = m2a + m3a and mB = m3b + m4; the shaking force Fx ≈ mA rω² cos ωt + mB rω² (cos ωt + (r/l) cos 2ωt) and Fy = mA rω² sin ωt, and the inertia torque Ti ≈ ½ mB r²ω² ((r/2l) sin ωt − sin 2ωt − (3r/2l) sin 3ωt).",
    "keywords": [
      "MAKEOS",
      "engine shaking force",
      "inertia torque engine",
      "conrod lumped mass",
      "primary secondary force",
      "reciprocating mass",
      "centre of percussion conrod"
    ],
    "fields": [
      {
        "key": "r",
        "label": "Crank radius r (half the stroke)",
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
        "label": "Connecting rod length l (centre to centre)",
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
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wt",
        "label": "Crank angle ωt from top dead centre",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": -720,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Crank mass m2 (unbalanced part)",
        "type": "number",
        "default": 0.5,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rG2",
        "label": "Crank CG distance from the main bearing rG2",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Connecting rod mass m3",
        "type": "number",
        "default": 0.6,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "la",
        "label": "Conrod CG to crankpin la",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "IG3",
        "label": "Conrod moment of inertia about its CG (0 = skip)",
        "type": "number",
        "default": 0.0015,
        "unit": "kg·m²",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m4",
        "label": "Piston assembly mass m4",
        "type": "number",
        "default": 0.5,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "inline-engine-balance",
    "name": "Inline Multicylinder Engine Balance (Shaking Force, Inertia Torque, Shaking Moment, Firing)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For an inline engine with my crankshaft phase angles and cylinder spacing, are the primary and secondary shaking forces, the inertia torque harmonics and the shaking moments balanced, how large are the unbalanced ones, and what crank spacing gives even firing?",
    "description": "Balance of inline multicylinder engines by Norton’s phase-angle sums: shaking forces cancel through the second harmonic when Σ cos φi, Σ sin φi, Σ cos 2φi and Σ sin 2φi are all zero (and the fourth and sixth with 4φi and 6φi), inertia torque when the sums of φi, 2φi and 3φi are zero, and shaking moments when Σ zi cos nφi and Σ zi sin nφi are zero for n = 1, 2, 4 and 6; with the reciprocating mass, crank radius, rod length and speed you enter it gives the amplitudes of the unbalanced primary and secondary forces and moments, and the even firing interval 360° ÷ n (two-stroke) or 720° ÷ n (four-stroke).",
    "keywords": [
      "MAKEOS",
      "inline engine balance",
      "crankshaft phase angles",
      "primary secondary balance",
      "shaking moment engine",
      "firing order interval",
      "multicylinder engine forces"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of cylinders",
        "type": "number",
        "default": 4,
        "unit": "cylinders",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "cycle",
        "label": "Stroke cycle",
        "type": "select",
        "default": "4",
        "options": [
          [
            "4",
            "Four-stroke"
          ],
          [
            "2",
            "Two-stroke"
          ]
        ]
      },
      {
        "key": "p2",
        "label": "Phase angle φ2 of cylinder 2",
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
        "default": 180,
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
        "default": 270,
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
        "key": "p7",
        "label": "Phase angle φ7",
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
        "key": "p8",
        "label": "Phase angle φ8",
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
        "label": "Distance of cylinder 1 from the moment reference z1",
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
        "label": "Cylinder spacing",
        "type": "number",
        "default": 90,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mB",
        "label": "Reciprocating mass per cylinder mB (0 = sums only)",
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
      }
    ]
  }
]);
