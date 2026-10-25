// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook37).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "fatigue-design-check": {
    "purpose": "Fatigue check of a notched part under a fluctuating stress: the endurance limit corrected by your surface, size, load, temperature and reliability factors, the fatigue notch factor from the stress concentration factor and notch radius (as the fatigue notch factor tool), alternating and mean stresses from the nominal maximum and minimum, safety factors by Goodman, Soderberg and Gerber with a first-cycle yield check (as the Goodman fatigue tool), and the finite life from the S-N line for the equivalent fully reversed stress (as the S-N fatigue life tool).",
    "uses": [
      "Check a shaft shoulder, hole or groove under cyclic load",
      "Find the life of a part that does not reach infinite life",
      "See how surface finish and notch radius affect fatigue"
    ],
    "users": [
      "Design engineers",
      "Reliability engineers",
      "Mechanical engineers"
    ],
    "inputs": {
      "Su": "Ultimate tensile strength.",
      "Sy": "Yield strength.",
      "Sep": "Rotating-beam endurance limit of polished specimens; 0 estimates it as half the tensile strength, capped at 700 MPa (steels).",
      "ka": "Surface factor for the finish (machined, ground, as-forged; your value).",
      "kb": "Size factor for the section size.",
      "kc": "Load factor (1 bending, about 0.85 axial, 0.59 torsion).",
      "kd": "Temperature factor.",
      "ke": "Reliability factor (1 for 50%, about 0.868 for 99%).",
      "Kt": "Theoretical stress concentration factor for the notch geometry and load type.",
      "r": "Notch root radius (for the notch sensitivity).",
      "smax": "Largest nominal stress in the cycle (without the notch).",
      "smin": "Smallest nominal stress in the cycle.",
      "req": "Safety factor you require.",
      "Nreq": "Cycles the part must last if it cannot reach infinite life."
    },
    "outputs": [
      "Corrected endurance limit and fatigue notch factor",
      "Alternating and mean stresses",
      "Safety factors and finite life"
    ],
    "method": [
      "S_e = k_a k_b k_c k_d k_e S_e′.",
      "Neuber constant a = 0.0254 (2070 ÷ S_u)^1.8 mm; q = 1 ÷ (1 + a ÷ r); K_f = 1 + q(K_t − 1) (as the fatigue notch factor tool).",
      "σ_a = K_f (σ_max − σ_min) ÷ 2; σ_m = K_f (σ_max + σ_min) ÷ 2.",
      "Goodman n = 1 ÷ (σ_a ÷ S_e + σ_m ÷ S_u); Soderberg uses S_y; Gerber the parabola; yield n = S_y ÷ (σ_a + |σ_m|) (as the Goodman fatigue tool).",
      "Finite life: σ_ar = σ_a ÷ (1 − σ_m ÷ S_u); N from the S-N line through 0.9 S_u at 10³ and S_e at 10⁶ (as the S-N fatigue life tool).",
      "Example: S_e = 177.07 MPa and K_f = 1.9709 give σ_a 78.835 MPa, σ_m 118.25 MPa and a Goodman factor of 1.5569."
    ],
    "limitations": [
      "Correction factors and the S-N line are estimates; tested data for the material and finish govern.",
      "Uniaxial stress; combined stresses need an equivalent (von Mises) alternating and mean stress.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger notch radius and a better surface finish are usually the cheapest fatigue improvements."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 200–211, 280, 358. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "crane-hook-design": {
    "purpose": "Check of a hook or curved lifting member with a rectangular critical section: inner and outer fibre stresses by the curved-beam (Winkler–Bach) method at the working load limit (as the curved beam tool), the same stress at the proof load against yield, the straight-beam stress for comparison, and the tensile stress in the threaded shank at the thread stress area.",
    "uses": [
      "Check a fabricated or forged hook for a load rating",
      "Compare a curved member with straight-beam theory",
      "Check the shank thread of a hook"
    ],
    "users": [
      "Design engineers",
      "Rigging supervisors",
      "Structural engineers"
    ],
    "inputs": {
      "W": "Rated working load of the hook.",
      "proof": "Proof test load as a multiple of the working load (from the lifting standard you follow).",
      "ri": "Radius from the centre of curvature to the inside of the critical section.",
      "h": "Radial depth of the critical section.",
      "b": "Width of the critical section (a rectangle approximates the real trapezoid).",
      "allow": "Allowable stress at the working load (your design value).",
      "Sy": "Yield strength; the proof load must not exceed it.",
      "ds": "Nominal diameter of the shank thread.",
      "Ps": "Pitch of the shank thread.",
      "sA": "Allowable tensile stress in the shank thread (your design value)."
    },
    "outputs": [
      "Curved-beam stresses at the working load",
      "Inner fibre stress at the proof load",
      "Shank thread stress"
    ],
    "method": [
      "Neutral axis r_n = h ÷ ln(r_o ÷ r_i); eccentricity e = r_c − r_n; moment M = P r_c (as the curved beam tool).",
      "Inner fibre σ_i = P ÷ A + M (r_n − r_i) ÷ (A e r_i); outer σ_o = P ÷ A − M (r_o − r_n) ÷ (A e r_o).",
      "Proof check: σ_i at the proof load against S_y.",
      "Shank: σ = W ÷ A_s, A_s = π ÷ 4 (d − 0.9382p)².",
      "Example: 20 kN gives 120.76 MPa at the throat (1.4098× the straight-beam bending), 241.53 MPa at proof, and 35.677 MPa in the shank."
    ],
    "limitations": [
      "Rectangular section approximation; the trapezoidal hook section has a different neutral axis.",
      "Hooks must be rated and proof tested to the applicable lifting standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Curvature concentrates stress on the inside of the throat: the straight-beam formula would underestimate it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 274–276, 1521–1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "universal-joint-drive": {
    "purpose": "Kinematic and torque check of a single or double Cardan (Hooke’s) joint drive: the output angle traced through a full turn for each joint, speed ratio extremes and fluctuation at the output and at the intermediate shaft (for a single joint, the limits match the universal joint tool), whether a double joint cancels the fluctuation (equal angles and yokes in phase), peak angular accelerations and the inertia torques they cause, and the peak joint torque against your rating.",
    "uses": [
      "Check a Cardan drive shaft layout",
      "Confirm a double joint runs at constant velocity",
      "Find the torque peaks from joint angle and inertia"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "n1": "Speed of the input shaft.",
      "T1": "Torque on the input shaft.",
      "mode": "One joint, or two joints with an intermediate shaft.",
      "b1": "Angle between the input and the next shaft at joint 1.",
      "b2": "Angle at joint 2 (double arrangement).",
      "phase": "Whether the yokes on the two ends of the intermediate shaft lie in the same plane.",
      "Jo": "Inertia of the driven machine at the output shaft.",
      "Ji": "Inertia of the intermediate shaft (double arrangement).",
      "bMax": "Largest joint angle you accept for the speed and life (your value from the joint maker).",
      "Tr": "Torque rating of the joint for the speed and angle (from the maker)."
    },
    "outputs": [
      "Speed limits and fluctuation at the output and intermediate shafts",
      "Phasing check for constant velocity",
      "Inertia torques and peak joint torque"
    ],
    "method": [
      "Joint 1: φ = atan2(sin θ, cos θ cos β₁); ratio dφ ÷ dθ swings between cos β and 1 ÷ cos β (as the universal joint tool).",
      "Joint 2: in phase ψ = atan2(sin φ cos β₂, cos φ) (cancels joint 1 when β₂ = β₁); out of phase ψ = atan2(sin φ, cos φ cos β₂) (adds to it).",
      "Angular acceleration α = ω₁² d²ψ ÷ dθ², found point by point; inertia torque = J α.",
      "Peak joint torque = T₁ × the largest speed ratio’s reciprocal + the intermediate-shaft inertia torque.",
      "Example: at 15° the output swings 0% and the intermediate shaft 6.935%; the peak joint torque is 111.14 N·m."
    ],
    "limitations": [
      "Rigid shafts and joints; torsional resonance of the shaft is not checked.",
      "Friction and joint bearing loads are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Equal angles with in-phase yokes give a constant output speed; any angle difference brings fluctuation back."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2445–2446. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tolerance-stack-design": {
    "purpose": "One-dimensional tolerance stack of up to six dimensions with symmetric tolerances: nominal gap, worst-case limits, root-sum-square (RSS) limits with an inflation factor (as the RSS tolerance stack tool), the statistical spread from each dimension’s process capability index Cp, the predicted share of assemblies outside the required gap assuming normal distributions centred on nominal, and the dimension contributing most.",
    "uses": [
      "Check an assembly gap before releasing a drawing",
      "Decide whether worst-case or statistical tolerancing is justified",
      "Find the dimension to tighten first"
    ],
    "users": [
      "Design engineers",
      "Quality engineers",
      "Drafters"
    ],
    "inputs": {
      "dir1": "Whether dimension 1 adds to or subtracts from the gap (or is unused), going round the loop.",
      "nom1": "Nominal size of dimension 1.",
      "tol1": "Plus-or-minus tolerance of dimension 1.",
      "dir2": "Whether dimension 2 adds to or subtracts from the gap (or is unused), going round the loop.",
      "nom2": "Nominal size of dimension 2.",
      "tol2": "Plus-or-minus tolerance of dimension 2.",
      "dir3": "Whether dimension 3 adds to or subtracts from the gap (or is unused), going round the loop.",
      "nom3": "Nominal size of dimension 3.",
      "tol3": "Plus-or-minus tolerance of dimension 3.",
      "dir4": "Whether dimension 4 adds to or subtracts from the gap (or is unused), going round the loop.",
      "nom4": "Nominal size of dimension 4.",
      "tol4": "Plus-or-minus tolerance of dimension 4.",
      "dir5": "Whether dimension 5 adds to or subtracts from the gap (or is unused), going round the loop.",
      "nom5": "Nominal size of dimension 5.",
      "tol5": "Plus-or-minus tolerance of dimension 5.",
      "dir6": "Whether dimension 6 adds to or subtracts from the gap (or is unused), going round the loop.",
      "nom6": "Nominal size of dimension 6.",
      "tol6": "Plus-or-minus tolerance of dimension 6.",
      "reqMin": "Smallest gap the function allows.",
      "reqMax": "Largest gap the function allows.",
      "inflate": "Factor on the RSS result to allow for non-normal or off-centre processes (often 1.0–1.5).",
      "Cp": "Capability of the processes making the parts: tolerance = 3 × Cp × standard deviation.",
      "rejMax": "Largest share of assemblies outside the gap you accept."
    },
    "outputs": [
      "Nominal gap, worst-case and RSS limits",
      "Statistical spread and predicted reject share",
      "Largest contributor"
    ],
    "method": [
      "Gap = Σ (sign × nominal); worst-case half-range = Σ tolerance; RSS half-range = inflation × √Σ tolerance² (as the RSS tolerance stack tool).",
      "Each dimension σ = tolerance ÷ (3 Cp); gap σ = √Σσ².",
      "Predicted reject share = Φ((min − gap) ÷ σ) + 1 − Φ((max − gap) ÷ σ), with Φ the normal distribution.",
      "Example: the gap is 0.5 mm, worst case ±0.28 mm, RSS ±0.14629 mm; predicted rejects 0%."
    ],
    "limitations": [
      "Linear one-dimensional stack with symmetric tolerances; geometric tolerances and non-linear stacks need more.",
      "Assumes centred normal processes; real processes drift.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tighten the largest contributor first: it gives the biggest RSS reduction for the cost."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 628–634, 128–130. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "leaf-spring-design": {
    "purpose": "Design of a semi-elliptic (centre-loaded, end-supported) leaf spring of equal-strength graduated leaves: the number of leaves needed to keep the bending stress within the allowable, the number needed to keep the deflection within your limit, the governing count, and the stress, deflection and rate with the leaves you choose (as the leaf spring tool, semi-elliptic case).",
    "uses": [
      "Size a leaf spring for a trailer, cart or machine mount",
      "Check a spring for a higher load",
      "Trade leaf thickness against leaf count"
    ],
    "users": [
      "Design engineers",
      "Vehicle engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "F": "Load applied at the centre clamp (both ends supported).",
      "L": "Distance between the end supports (eyes or slippers).",
      "b": "Width of each leaf.",
      "t": "Thickness of each leaf.",
      "E": "Elastic modulus of the spring steel.",
      "allow": "Allowable bending stress for the duty (your value).",
      "dMax": "Largest centre deflection you allow (for clearance or ride).",
      "n": "Number of leaves you intend to use."
    },
    "outputs": [
      "Leaves needed for stress and for deflection",
      "Stress, deflection and rate with the leaves chosen"
    ],
    "method": [
      "Semi-elliptic, graduated leaves: σ = 3FL ÷ (2 n b t²); δ = 3FL³ ÷ (8 n E b t³) (as the leaf spring tool).",
      "Leaves for stress n = 3FL ÷ (2 b t² σ_allow); for deflection n = 3FL³ ÷ (8 E b t³ δ_max); round the larger up.",
      "Rate = F ÷ δ.",
      "Example: 5000 N on a 1000 mm span needs 4 leaves; 6 leaves run at 325.52 MPa and deflect 49.143 mm."
    ],
    "limitations": [
      "Equal-strength (graduated) leaves without inter-leaf friction; real springs are stiffer and show hysteresis.",
      "Static stress; fatigue and the centre bolt hole need their own checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thicker leaves cut the stress-limited count fast, but the spring gets much stiffer (thickness cubed)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 344–345. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lathe-threading-plan": {
    "purpose": "Plan of single-point thread turning on a lathe: total radial depth for an external or internal 60° metric thread and constant-chip-area infeed per pass (as the thread infeed tool), spring passes, spindle speed from the cutting speed limited by the machine maximum and by the largest axial feed rate the machine can synchronise, the actual cutting speed, and cutting time for the passes over the thread length with run-in.",
    "uses": [
      "Program a threading cycle on a CNC lathe",
      "Check the first and last pass infeeds",
      "Estimate threading time for a quote"
    ],
    "users": [
      "CNC machinists",
      "Process planners",
      "CNC programmers"
    ],
    "inputs": {
      "type": "External (on a shaft) or internal (in a bore) thread.",
      "d": "Major (nominal) diameter.",
      "P": "Thread pitch.",
      "passes": "Number of cutting passes with infeed.",
      "spring": "Extra passes at full depth with no infeed, to clean up.",
      "L": "Length of thread.",
      "appr": "Distance before the thread for the axis to reach synchronised speed.",
      "vc": "Cutting speed for the insert and material.",
      "nmax": "Highest spindle speed of the machine.",
      "vfMax": "Highest axial feed rate the control can keep synchronised while threading.",
      "aMax": "Largest radial infeed in one pass for the insert (your value).",
      "aMin": "Smallest infeed that still cuts rather than rubs (your value)."
    },
    "outputs": [
      "Total depth and the infeed of each pass",
      "Spindle speed and what limits it",
      "Threading time"
    ],
    "method": [
      "Depth a_p = 0.6134P (external) or 0.5413P (internal); constant-area infeed: cumulative depth after pass x = a_p √(x − 1) ÷ √(n − 1), first pass a_p √0.3 ÷ √(n − 1) (as the thread infeed tool).",
      "Spindle speed n = min(1000 v_c ÷ π d, n_max, v_f,max ÷ P).",
      "Time = (passes + spring passes) × (L + run-in) ÷ (P n).",
      "Example: M20×2.5 needs 1.5335 mm depth; the first pass takes 0.31746 mm, the spindle runs at 1,591.5 rpm and the thread takes 4.7501 s."
    ],
    "limitations": [
      "Radial depth for basic 60° metric profiles; other forms and modified flank infeed differ.",
      "Rapid return moves between passes are not included in the time.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Too many passes make the last infeed so small that the insert rubs; too few overload the first pass."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2037–2042, 1289–1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "clevis-pin-joint": {
    "purpose": "Check of a pinned clevis joint with a central eye between two fork plates: pin bending moment with the load spread over the eye and fork plates and the gaps between them, pin bending stress, double-shear stress (as the bolt and pin shear tool), bearing stress in the eye and in the fork plates, and the eye’s net-section tension and shear tear-out beyond the hole.",
    "uses": [
      "Size a clevis pin for a cylinder or linkage",
      "Find why clevis pins bend in service",
      "Check an eye end for a higher load"
    ],
    "users": [
      "Design engineers",
      "Hydraulic engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "F": "Load through the joint.",
      "d": "Diameter of the pin (taken equal to the hole).",
      "a": "Thickness of the eye (the central member).",
      "bf": "Thickness of each of the two fork plates.",
      "g": "Clearance between the eye and each fork plate.",
      "R": "Distance from the hole centre to the edge of the eye in the load direction.",
      "sbA": "Allowable bending stress of the pin (your value).",
      "tpA": "Allowable shear stress of the pin.",
      "bA": "Allowable bearing stress between pin and plates.",
      "stA": "Allowable tensile stress of the eye.",
      "tA": "Allowable shear stress of the eye."
    },
    "outputs": [
      "Pin bending moment and stress",
      "Pin shear and bearing stresses",
      "Eye net tension and tear-out"
    ],
    "method": [
      "Pin bending with the load spread over the eye and fork plates: M = F (a + 2b + 4g) ÷ 8; σ = 32M ÷ (π d³).",
      "Double shear τ = F ÷ (2 × π d² ÷ 4) (as the bolt and pin shear tool).",
      "Bearing: eye F ÷ (d a); fork F ÷ (2 d b).",
      "Eye net tension F ÷ [(2R − d) a]; tear-out F ÷ [2a (R − d ÷ 2)].",
      "Example: 20 kN bends the 20 mm pin to 140.06 MPa; shear is 31.831 MPa and the eye bears at 50 MPa."
    ],
    "limitations": [
      "Uniformly spread bearing loads; a tight fit or rigid plates lowers the pin moment.",
      "Static loads; reversing loads need fatigue checks and a hardened pin.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pin bending often governs: closing the gaps and keeping the fork plates thin relative to the pin helps most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "o-ring-groove-design": {
    "purpose": "Design of a radial O-ring gland (piston or rod): stretch of the ring on the groove diameter and the reduced cross-section, groove depth for your target squeeze, groove width for your target fill, the mating bore or rod diameter that results, and a check of the depth and width you actually choose for squeeze, fill and stretch against your limits (as the O-ring gland tool), with the extrusion gap against your allowable for the pressure.",
    "uses": [
      "Design a gland for a standard O-ring",
      "Check a drawn gland before machining",
      "Find the clearance a pressure allows"
    ],
    "users": [
      "Design engineers",
      "Hydraulic engineers",
      "Sealing engineers"
    ],
    "inputs": {
      "gland": "Whether the groove is on the moving inner part (piston) or in the housing (rod).",
      "id": "Inside diameter of the O-ring.",
      "cs": "Cross-section diameter of the O-ring.",
      "gd": "For a piston, the diameter at the bottom of the groove; for a rod, the outer diameter of the groove.",
      "sqT": "Squeeze you design to.",
      "fillT": "Share of the groove area the ring fills, designed to.",
      "depth": "Groove depth on the drawing (0 to use the design value).",
      "width": "Groove width on the drawing (0 to use the design value).",
      "sqLo": "Smallest squeeze you accept (for the duty; from the seal maker).",
      "sqHi": "Largest squeeze you accept.",
      "fillMax": "Largest fill you accept (room for swell and heat).",
      "stMax": "Largest stretch of the ring on a piston groove, or diametral compression in a rod groove.",
      "gap": "Radial clearance between the parts at the seal.",
      "gapMax": "Largest clearance for the pressure and ring hardness (from the seal maker)."
    },
    "outputs": [
      "Stretch and stretched cross-section",
      "Design depth, width and mating diameter",
      "Squeeze, fill, stretch and gap checks at the chosen groove"
    ],
    "method": [
      "Piston stretch = (groove diameter − ring ID) ÷ ring ID; rod compression from the ring OD; stretched cross-section = cs ÷ √(1 + stretch) (as the O-ring gland tool).",
      "Depth = cs′ (1 − squeeze); width = π cs′² ÷ 4 ÷ (depth × fill).",
      "Mating bore (piston) = groove diameter + 2 × depth; mating rod (rod) = groove diameter − 2 × depth.",
      "At the chosen groove: squeeze = (cs′ − depth) ÷ cs′; fill = π cs′² ÷ 4 ÷ (depth × width).",
      "Example: the ring stretches 1.6518%; 2.0789 × 3.4016 mm gives the target, and the chosen groove gives 19.188% squeeze and 70.154% fill."
    ],
    "limitations": [
      "Nominal dimensions; check squeeze and fill at the tolerance extremes too.",
      "Static or slow dynamic seals; high-speed and rotary seals need different glands.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the extrusion gap is too large for the pressure, fit a back-up ring rather than tightening the fit."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2591–2610. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 3601-2 Fluid power systems — O-rings — Housing dimensions for general applications"
    ]
  },
  "flywheel-rim-design": {
    "purpose": "Design of a flywheel as a plain annular disc: inertia needed for the energy fluctuation at the mean speed and coefficient of speed fluctuation, the inner diameter that gives that inertia at the outer diameter and width chosen, mass, the energy check by the flywheel energy method, the speed range, rim speed at the top speed, and the largest stress of a rotating disc at the top speed (as the rotating disc tool) against your safety factor.",
    "uses": [
      "Size a flywheel for a compressor, press or engine",
      "Check a flywheel for a higher speed",
      "Trade diameter against width and mass"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "dE": "Largest difference in kinetic energy over the cycle (from the torque–angle diagram).",
      "n": "Mean running speed.",
      "Cs": "Allowed (n_max − n_min) ÷ n_mean (about 0.002 generators, 0.02–0.05 machine tools, 0.1–0.2 punches and crushers).",
      "Do": "Outside diameter of the flywheel.",
      "b": "Width of the disc or rim along the shaft.",
      "rho": "Density (about 7200 cast iron, 7850 steel).",
      "nu": "Poisson’s ratio.",
      "Sy": "Strength of the material for the stress check.",
      "req": "Safety factor you require on the rotating stress (higher for cast iron).",
      "vMax": "Largest rim speed for the material and construction (your value)."
    },
    "outputs": [
      "Inertia needed",
      "Inner diameter, mass and speed range",
      "Rim speed, rotating stress and safety factor"
    ],
    "method": [
      "Inertia I = ΔE ÷ (ω² C_s), ω the mean angular speed.",
      "Annular disc I = ρ π b (R_o⁴ − R_i⁴) ÷ 2, so R_i = [R_o⁴ − 2I ÷ (ρ π b)]^¼; mass = ρ π b (R_o² − R_i²).",
      "Speed range n (1 ± C_s ÷ 2); energy check ΔE = I (ω_max² − ω_min²) ÷ 2 (as the flywheel energy tool).",
      "Rotating disc stress at the bore at top speed: σ = (3 + ν) ÷ 4 × ρ ω² [R_o² + (1 − ν) ÷ (3 + ν) R_i²] (as the rotating disc tool).",
      "Example: 5 kJ at 600 rpm needs 25.33 kg·m²: a 800 mm disc 100 mm wide with a 475.8 mm bore, 233.89 kg."
    ],
    "limitations": [
      "Plain annular disc; spoked and rimmed flywheels have different inertia and stress.",
      "Hub, keys and bolts need their own checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Inertia rises with the fourth power of diameter: a slightly larger diameter saves a lot of mass, until rim speed limits it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3000–3010, 179–190. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
