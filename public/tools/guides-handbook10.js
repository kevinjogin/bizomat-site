// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook10).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "rect-bar-torsion": {
    "purpose": "Maximum shear stress, angle of twist and torsional constant of a solid rectangular bar under torque, using Roark’s approximations.",
    "uses": [
      "Check square drive shafts and flat bars in torsion",
      "Compare a flat bar with a round shaft",
      "Estimate twist of a torsion arm"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "T": "Torque transmitted.",
      "b": "Longer side of the section.",
      "c": "Shorter side (equal to b for a square).",
      "L": "Length over which twist is wanted.",
      "G": "Shear modulus (steel about 79 GPa, aluminium about 26 GPa).",
      "allow": "Allowable shear stress from your design code."
    },
    "outputs": [
      "Maximum shear stress (mid-point of the long side)",
      "Torsional constant K",
      "Angle of twist"
    ],
    "method": [
      "τmax ≈ T(3b + 1.8c) ÷ (b² c²).",
      "K = b c³ [1/3 − 0.21 (c/b)(1 − c⁴ ÷ 12b⁴)].",
      "Twist θ = T L ÷ (K G).",
      "Example: 200 N·m on a 40 × 20 mm bar gives τmax = 48.75 MPa and 0.98649° of twist over 500 mm."
    ],
    "limitations": [
      "Approximate formulas (within a few per cent); stress concentrations at re-entrant corners are not included.",
      "The bar ends are assumed able to warp.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A rectangular section is much less stiff in torsion than a round or closed tube of the same area."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "curved-beam": {
    "purpose": "Stresses at the inner and outer fibres of a curved rectangular section (crane hook, C-frame, ring) by the Winkler–Bach theory, with the straight-beam comparison.",
    "uses": [
      "Check hooks, clamp frames and C-frame presses",
      "See how curvature raises inner-fibre stress",
      "Size a curved bracket"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "P": "Load pulling the section apart, acting along a line through the centre of curvature (as on a hook).",
      "ri": "Radius from the centre of curvature to the inside face.",
      "h": "Radial depth of the rectangular section.",
      "b": "Width of the section.",
      "allow": "Allowable stress from your design code or lifting standard."
    },
    "outputs": [
      "Inner fibre stress",
      "Outer fibre stress",
      "Neutral axis shift",
      "Straight-beam stress and curvature factor"
    ],
    "method": [
      "ro = ri + h; centroid radius rc = ri + h/2; neutral radius rn = h ÷ ln(ro/ri); e = rc − rn.",
      "Moment M = P rc. Inner σ = P/A + M(rn − ri) ÷ (A e ri); outer σ = P/A − M(ro − rn) ÷ (A e ro).",
      "Straight beam: σ = P/A ± 6M ÷ (b h²).",
      "Example: 20000 N on the default hook section gives 120.76 MPa at the inner fibre against 88.889 MPa by straight-beam theory."
    ],
    "limitations": [
      "Rectangular section; hooks with trapezoidal or round sections need their own section integrals.",
      "Elastic theory; lifting hooks must follow their standard and proof testing.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The inner fibre governs: curvature raises its stress above the straight-beam value."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218, 257–260. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tube-collapse": {
    "purpose": "Elastic buckling (collapse) pressure and yield-limited pressure of a long thin round tube under external pressure, with the safety factor against an applied pressure.",
    "uses": [
      "Check tubes and shells under vacuum",
      "Check heat exchanger tubes with shell-side pressure",
      "Screen a jacketed vessel inner shell"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "D": "Outside diameter of the tube or shell.",
      "t": "Minimum wall thickness.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "nu": "Poisson’s ratio (about 0.3 for steel).",
      "Sy": "Minimum yield strength from the material certificate or specification.",
      "p": "Net external pressure (outside minus inside); full vacuum is about 0.1 MPa.",
      "req": "Factor required by your code (external pressure codes commonly use about 3)."
    },
    "outputs": [
      "Elastic collapse pressure",
      "Yield-limited pressure",
      "Governing collapse pressure and safety factor"
    ],
    "method": [
      "Mean diameter Dm = D − t.",
      "Elastic collapse (long tube): p_cr = 2E ÷ (1 − ν²) × (t ÷ Dm)³.",
      "Yield limit: p_y = 2 S_y t ÷ Dm; the lower governs.",
      "Example: a 100 × 2 mm steel tube collapses at about 3.7362 MPa; the factor at 0.5 MPa is 7.4724."
    ],
    "limitations": [
      "Long, perfectly round tubes; out-of-roundness and short lengths between stiffeners change the result substantially.",
      "Pressure vessels under external pressure must be designed to their code charts (e.g. AS 1210, ASME VIII).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stiffening rings shorten the effective length and greatly raise the collapse pressure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 293–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "eccentric-column": {
    "purpose": "Maximum stress in a column with an eccentric axial load by the secant formula, the Euler load, and the load factor at which the peak stress reaches yield.",
    "uses": [
      "Check columns, legs and struts loaded off-centre",
      "Allow for accidental eccentricity in a strut",
      "Compare with the concentric buckling result"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "P": "Compressive load.",
      "e": "Distance from the load line to the section centroid.",
      "A": "Cross-section area.",
      "I": "Second moment of area about the axis of bending caused by the eccentricity.",
      "c": "Distance from the neutral axis to the compressed extreme fibre.",
      "L": "Unsupported length.",
      "K": "Effective length factor for the end conditions.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "Sy": "Minimum yield strength from the material certificate or specification.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Maximum stress at the applied load",
      "Euler buckling load",
      "Load factor to first yield"
    ],
    "method": [
      "r² = I ÷ A. σmax = P/A × [1 + (e c ÷ r²) sec((KL ÷ 2r) √(P ÷ A E))].",
      "Euler load P_E = π² E I ÷ (KL)².",
      "Load factor n: solve σmax(nP) = S_y by bisection (n P stays below P_E).",
      "Example: 40000 N at 10 mm eccentricity gives σmax = 72.884 MPa; yield is reached at 2.5431 × the load."
    ],
    "limitations": [
      "Elastic, prismatic, pin-ended (or effective-length) member with equal end eccentricities.",
      "Structural members must still be checked to the applicable code.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The secant formula is non-linear: doubling the load more than doubles the peak stress near buckling."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "beam-impact": {
    "purpose": "Static deflection, impact factor, dynamic deflection and dynamic bending stress when a weight falls onto a simply supported beam at mid-span or onto a cantilever tip.",
    "uses": [
      "Check guards, stops and platforms against dropped objects",
      "Estimate shock loading on a beam",
      "Compare stiff and flexible supports"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "support": "Support arrangement and impact point.",
      "mass": "Mass of the falling object.",
      "h": "Height it falls before touching the beam.",
      "L": "Span, or cantilever length.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "I": "Second moment of area of the beam section.",
      "c": "Neutral axis to extreme fibre.",
      "allow": "Allowable stress for this (often accidental) load case."
    },
    "outputs": [
      "Static deflection and stress",
      "Impact factor",
      "Dynamic deflection and stress"
    ],
    "method": [
      "Static: simply supported δst = WL³ ÷ 48EI, M = WL/4; cantilever δst = WL³ ÷ 3EI, M = WL.",
      "Impact factor = 1 + √(1 + 2h ÷ δst).",
      "Dynamic deflection and stress = factor × static values.",
      "Example: 20 kg dropped 100 mm on the default beam gives an impact factor of 99.946 and 61.258 MPa."
    ],
    "limitations": [
      "The beam mass and local indentation are ignored (conservative for light beams, less so for heavy ones).",
      "Elastic response assumed; above yield the energy is absorbed plastically.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A more flexible beam has a lower impact factor; a stiff beam sees higher dynamic stress."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 278. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "section-shapes": {
    "purpose": "Area, mass per metre, centroid, second moments of area, principal axes, section moduli and radii of gyration of built-up or rolled I, T, channel and angle sections made from rectangles.",
    "uses": [
      "Find properties of fabricated sections",
      "Check a rolled section approximately",
      "Feed beam and column calculations"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "shape": "Section type; root radii are ignored.",
      "H": "Overall depth (for angles, the vertical leg length).",
      "B": "Overall width (for angles, the horizontal leg length).",
      "tf": "Flange thickness (for angles, the horizontal leg thickness).",
      "tw": "Web thickness (for angles, the vertical leg thickness).",
      "rho": "Material density for mass per metre."
    },
    "outputs": [
      "Area and mass per metre",
      "Centroid position",
      "Ix, Iy and principal moments",
      "Section moduli and radii of gyration"
    ],
    "method": [
      "The section is split into rectangles; A = Σ aᵢ, centroid = Σ aᵢ cᵢ ÷ A (from the bottom-left corner).",
      "I about centroidal axes by the parallel axis theorem: I = Σ (Iᵢ + aᵢ dᵢ²); Ixy = Σ aᵢ dxᵢ dyᵢ.",
      "Principal moments = (Ix + Iy)/2 ± √(((Ix − Iy)/2)² + Ixy²); Z = I ÷ extreme fibre distance; r = √(I/A).",
      "Example: a 200 × 100 I-section with 10 mm flanges and a 6 mm web has Ix = 20.983 × 10⁶ mm⁴ and Zx = 209.83 × 10³ mm³."
    ],
    "limitations": [
      "Root and toe radii of rolled sections are ignored, so tabulated values differ slightly; use the maker’s tables for rolled sections.",
      "Thin-walled torsion and warping properties are not given.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For angles, bending about the principal axes governs unless the angle is restrained."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 234–246. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thin-tube-torsion": {
    "purpose": "Shear stress (Bredt’s formula), torsional constant and twist of a closed thin-walled round or rectangular tube under torque.",
    "uses": [
      "Check RHS and box frames in torsion",
      "Compare open and closed sections",
      "Size a torque tube"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "shape": "Round or rectangular hollow section.",
      "b": "Outside diameter (round) or outside width (rectangular).",
      "h": "Outside height (rectangular only).",
      "t": "Wall thickness.",
      "T": "Torque.",
      "L": "Length for twist.",
      "G": "Shear modulus.",
      "allow": "Allowable shear stress from your design code."
    },
    "outputs": [
      "Enclosed mid-line area",
      "Shear stress",
      "Torsional constant J",
      "Angle of twist"
    ],
    "method": [
      "Mid-line dimensions: outside minus t. Enclosed area Am; mid-line perimeter s.",
      "Bredt: τ = T ÷ (2 Am t).",
      "J = 4 Am² t ÷ s; twist θ = T L ÷ (G J).",
      "Example: 1500 N·m on a 100 × 50 × 4 RHS gives τ = 42.459 MPa."
    ],
    "limitations": [
      "Thin walls (t well under a tenth of the size); corner radii ignored.",
      "Open sections (with a slit) are far weaker and need a different method.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Closing a section (welding a slit shut) multiplies torsional stiffness many times."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rotating-disc": {
    "purpose": "Maximum centrifugal stress in a rotating solid disc or a disc with a central bore, its rim speed, safety factor against yield and the speed at which yield is reached.",
    "uses": [
      "Check flywheels, saw blades, pulleys and impellers for overspeed",
      "Find the yield speed of a disc",
      "Compare solid and bored discs"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "Do": "Outside diameter of the disc.",
      "Di": "Diameter of the central bore; 0 for a solid disc.",
      "rpm": "Highest running speed, including overspeed conditions.",
      "rho": "Material density.",
      "nu": "Poisson’s ratio.",
      "Sy": "Minimum yield strength from the material certificate or specification.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Maximum stress and its location",
      "Rim speed",
      "Safety factor",
      "Speed at which yield is reached"
    ],
    "method": [
      "ω = 2πn ÷ 60; outer radius b, bore radius a.",
      "Solid disc: σmax = (3 + ν) ÷ 8 × ρ ω² b² (at the centre).",
      "Bored disc: hoop stress at the bore σmax = (3 + ν) ÷ 4 × ρ ω² (b² + (1 − ν) ÷ (3 + ν) a²).",
      "Stress rises with speed squared: yield speed = n √(S_y ÷ σmax).",
      "Example: a 500 mm steel disc with a 50 mm bore at 3000 rpm reaches 40.034 MPa at the bore."
    ],
    "limitations": [
      "Uniform-thickness flat disc; holes, keyways and blades add stress concentrations.",
      "Elastic stress; burst occurs above yield but the margin depends on ductility.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A small central bore roughly doubles the peak stress compared with a solid disc."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 187–190, 3000–3010. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "axial-bending-stress": {
    "purpose": "Stresses at the four corners of a rectangular section under an axial force and bending moments about both axes, with the peak tension and compression against an allowable stress.",
    "uses": [
      "Check brackets, posts and machine legs with offset loads",
      "Find whether a base plate lifts (tension)",
      "Check a section under combined loads"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "P": "Axial force at the section (tension positive).",
      "Mx": "Bending moment about the X axis (the width axis), from your load analysis.",
      "My": "Bending moment about the Y axis.",
      "b": "Width of the rectangle along X.",
      "h": "Depth of the rectangle along Y.",
      "allow": "Allowable stress from your design code."
    },
    "outputs": [
      "Stress at each corner",
      "Peak tension and compression",
      "Whether the whole section stays in compression"
    ],
    "method": [
      "A = b h; Zx = b h² ÷ 6; Zy = h b² ÷ 6.",
      "Corner stress σ = P/A ± Mx ÷ Zx ± My ÷ Zy.",
      "Peak magnitude compared with the allowable.",
      "Example: the default loads give corner stresses from -6.6667 to 4 MPa."
    ],
    "limitations": [
      "Solid rectangular section, elastic; buckling of compression members is checked separately.",
      "For base plates on concrete or soil, a negative (tension) corner means lift-off and a different analysis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If any corner is in tension on a bearing surface, the contact area shrinks and the simple formula no longer applies."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "leaf-spring": {
    "purpose": "Deflection, rate and bending stress of a single flat cantilever spring, a graduated multi-leaf cantilever, or a semi-elliptic leaf spring loaded at the centre.",
    "uses": [
      "Design flat spring clips, contacts and detents",
      "Check vehicle or trailer leaf springs",
      "Choose strip thickness for a rate"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "type": "Spring arrangement.",
      "F": "Load at the free end (cantilever) or total centre load (semi-elliptic).",
      "L": "Length from the clamp to the load, or span between eyes (semi-elliptic).",
      "b": "Width of the strip or leaves.",
      "t": "Thickness of each leaf.",
      "n": "Number of leaves (1 for a single strip).",
      "E": "Elastic modulus of the spring material.",
      "allow": "Allowable bending stress for the spring material and duty."
    },
    "outputs": [
      "Deflection",
      "Spring rate",
      "Maximum bending stress"
    ],
    "method": [
      "Single: σ = 6FL ÷ (b t²); δ = 4FL³ ÷ (E b t³).",
      "Multi-leaf (graduated): σ = 6FL ÷ (n b t²); δ = 6FL³ ÷ (n E b t³).",
      "Semi-elliptic (total load W, span L): σ = 3WL ÷ (2 n b t²); δ = 3WL³ ÷ (8 n E b t³).",
      "Example: 15 N on a 60 × 10 × 1 mm flat spring deflects 6.2609 mm with σ = 540 MPa."
    ],
    "limitations": [
      "Small deflections; large deflections of slender strips need large-deflection theory.",
      "Friction between leaves and the effect of clamp bolts are ignored.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For flat springs, stress at the clamp governs; avoid sharp clamp edges."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 344–345. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torsion-bar": {
    "purpose": "Torsional rate, angle of twist, arm-tip deflection and shear stress of a solid round torsion bar loaded through a lever arm.",
    "uses": [
      "Size a torsion bar for a counterbalance or suspension",
      "Check stress at maximum twist",
      "Find arm deflection"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Diameter of the active (twisting) part of the bar.",
      "L": "Length between the fixed end and the arm.",
      "G": "Shear modulus of the bar steel.",
      "F": "Force at the end of the lever arm.",
      "arm": "Lever arm length from the bar axis.",
      "allow": "Allowable shear stress for the spring steel and duty."
    },
    "outputs": [
      "Torque and twist",
      "Torsional rate and linear rate at the arm",
      "Shear stress"
    ],
    "method": [
      "T = F × arm; J = π d⁴ ÷ 32.",
      "Twist θ = T L ÷ (G J); rate = G J ÷ L.",
      "τ = 16T ÷ π d³; arm-tip deflection ≈ arm × θ (small angles).",
      "Example: 1000 N on a 200 mm arm twists the default bar 7.3595° with τ = 127.32 MPa."
    ],
    "limitations": [
      "Solid round bar; end fittings and transitions add stress concentrations.",
      "Small-angle arm deflection approximation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Preset (scragging) and shot peening raise the usable stress of torsion bars."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303, 344. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grain-size": {
    "purpose": "ASTM E112 grain size number G from grains per square inch at 100×, grains per mm² at 1×, or the mean lineal intercept length, with the equivalent values.",
    "uses": [
      "Report grain size from a micrograph count",
      "Convert between grain size measures",
      "Check a material certificate requirement"
    ],
    "users": [
      "Metallurgists",
      "Quality inspectors",
      "Materials engineers"
    ],
    "inputs": {
      "mode": "Which measurement you made.",
      "value": "The measured number: grains per in² at 100×, grains per mm², or mean intercept length in micrometres."
    },
    "outputs": [
      "ASTM grain size number G",
      "Grains per mm² and per in² at 100×",
      "Mean lineal intercept"
    ],
    "method": [
      "From a 100× count: G = 1 + log₂(n).",
      "From grains per mm² at 1×: G = 3.321928 log₁₀(N_A) − 2.954.",
      "From mean intercept ℓ (mm): G = −6.643856 log₁₀(ℓ) − 3.288.",
      "Example: 64 grains per in² at 100× is ASTM G 7."
    ],
    "limitations": [
      "The planimetric and intercept relations agree only approximately; report the method used.",
      "Assumes equiaxed grains; elongated or duplex structures need the standard’s special procedures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger G means finer grains."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 369–380. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM E112 Standard Test Methods for Determining Average Grain Size"
    ]
  },
  "corrosion-rate": {
    "purpose": "Uniform corrosion rate from a coupon’s mass loss, area, exposure time and density (ASTM G1 method), in mm/year and mils/year, with the remaining life of a corrosion allowance.",
    "uses": [
      "Evaluate corrosion coupons from tanks, cooling water or process lines",
      "Estimate remaining life from a corrosion allowance",
      "Compare materials in a test"
    ],
    "users": [
      "Materials engineers",
      "Maintenance and reliability engineers",
      "Water treatment specialists"
    ],
    "inputs": {
      "W": "Mass loss after cleaning, from before and after weighing.",
      "A": "Total exposed surface area of the coupon.",
      "hours": "Exposure time.",
      "rho": "Density of the metal (carbon steel 7.86, stainless about 7.9, copper 8.96 g/cm³).",
      "allowance": "Wall thickness still available before the minimum required thickness."
    },
    "outputs": [
      "Corrosion rate in mm/year and mils/year",
      "Remaining life of the allowance"
    ],
    "method": [
      "CR (mm/y) = 87.6 × W ÷ (ρ A T), W in mg, A in cm², T in hours.",
      "mils per year = mm/y × 39.37.",
      "Remaining life = allowance ÷ rate.",
      "Example: 120 mg lost from 20 cm² over 720 h is 0.092875 mm/y (3.6565 mpy)."
    ],
    "limitations": [
      "Uniform corrosion only; pitting and crevice corrosion can perforate much sooner.",
      "Coupon conditions must represent the equipment (flow, temperature, deposits).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Back up coupon results with thickness measurements on the equipment."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1500–1516. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM G1 Standard Practice for Preparing, Cleaning, and Evaluating Corrosion Test Specimens"
    ]
  }
});
