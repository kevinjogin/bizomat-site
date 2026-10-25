// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook23).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "spur-contact-diameters": {
    "purpose": "For two spur gears at standard centre distance: the contact (start of active profile) diameter on each gear, the contact ratio by two independent formulas, the lowest point of single tooth contact (LPSTC) on each gear for contact stress checks, and the maximum hob tip radius for the tooth system.",
    "uses": [
      "Specify the form diameter a ground or hobbed profile must reach",
      "Find the critical diameter for Hertz stress",
      "Check contact ratio after changing outside diameters"
    ],
    "users": [
      "Gear designers",
      "Gear inspectors",
      "Machinists"
    ],
    "inputs": {
      "m": "Module (25.4 ÷ diametral pitch).",
      "z1": "Number of teeth on the first gear.",
      "z2": "Number of teeth on the second gear.",
      "phi": "Pressure angle.",
      "do1": "Actual outside diameter of gear 1; 0 uses the standard m (z + 2).",
      "do2": "Actual outside diameter of gear 2; 0 uses the standard value.",
      "bded": "Dedendum as a multiple of module for the tooth system (1.25 for standard full depth)."
    },
    "outputs": [
      "Contact diameter on each gear",
      "Contact ratio",
      "LPSTC diameters and maximum hob tip radius"
    ],
    "method": [
      "With P = 1 ÷ m: cos A = N cos φ ÷ (D₀ P); tan b = tan φ − (N ÷ n)(tan A − tan φ); contact diameter d_c = n cos φ ÷ (P cos b), and likewise for the other gear.",
      "Contact ratio m_f = N (tan A − tan B) ÷ 2π = n (tan a − tan b) ÷ 2π (both are reported as a check).",
      "LPSTC: tan c = tan a − 2π ÷ n; d_L = n cos φ ÷ (P cos c).",
      "Maximum hob tip radius = m (0.785398 cos φ − b sin φ) ÷ (1 − sin φ).",
      "Example: 20 and 40 teeth, module 1, contact begins at 18.878 mm on the pinion with a contact ratio of 1.6352."
    ],
    "limitations": [
      "Standard centre distance and standard tooth thickness; operating centre distance changes the result.",
      "A contact diameter at or below the base circle indicates interference.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep the true involute form diameter below the contact diameter, and the contact ratio above about 1.4 for power gears."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2155–2157. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "clutch-teeth-dividing-head": {
    "purpose": "Dividing-head (blank inclination) angle for milling saw-tooth clutch teeth with a single-angle cutter or V-shaped teeth with a double-angle cutter so that the tooth tops and bottoms converge to the centre, and the indexing for straight-tooth clutches.",
    "uses": [
      "Set up a dividing head to mill a jaw or dog clutch",
      "Check the head angle for a replacement clutch part",
      "Choose cutter angle and tooth count together"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Maintenance fitters"
    ],
    "inputs": {
      "type": "Tooth form and cutter type.",
      "Nt": "Number of clutch teeth.",
      "theta": "Angle of the single-angle cutter, or the included angle of the double-angle cutter."
    },
    "outputs": [
      "Dividing-head angle",
      "Angle between teeth",
      "Setting notes"
    ],
    "method": [
      "Single-angle cutter: cos α = tan(360° ÷ N) × cot θ ÷ 2.",
      "Double-angle cutter: cos α = tan(180° ÷ N) × cot(θ ÷ 2) ÷ 2.",
      "α is read on the dividing-head graduations; straight-sided teeth are milled with the head vertical, the cutter side on the centre line, and an odd number of teeth lets one pass finish two tooth sides.",
      "Example: 5 saw teeth with a 60° cutter need the head at 27° 19.2′."
    ],
    "limitations": [
      "Valid only when the formula gives a real angle; small tooth counts with steep cutters are impossible.",
      "Check the narrow end of the tooth space against the cutter width.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Converging tops and bottoms let the mating clutch engage across the whole tooth width."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2452–2454. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "silent-chain-sprocket": {
    "purpose": "Sprocket diameters for ANSI silent (inverted-tooth) chain of 3/8 in. pitch and larger by the handbook formulas: pitch diameter, outside diameter for round teeth, maximum guide groove diameter, gauge pin diameter and the measurement over pins for even or odd tooth numbers.",
    "uses": [
      "Machine or inspect a silent chain sprocket",
      "Check a worn sprocket against its drawing",
      "Size the guide groove for a centre-guide chain"
    ],
    "users": [
      "Power transmission engineers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "P": "Chain pitch (3/8 in. = 9.525 mm and larger).",
      "Nt": "Number of sprocket teeth."
    },
    "outputs": [
      "Pitch diameter",
      "Outside diameter and guide groove",
      "Over-pin diameter and gauge pin size"
    ],
    "method": [
      "PD = P ÷ sin(180° ÷ N).",
      "OD (round teeth) = P cot(180° ÷ N) + 0.08 P; maximum guide groove G = P cot(180° ÷ N) − 1.16 P.",
      "Gauge pins D_p = 0.625 P; pin-centre diameter = PD − 0.125 P csc(30° − 180° ÷ N).",
      "Over pins: even N = pin-centre diameter + D_p; odd N = pin-centre diameter × cos(90° ÷ N) + D_p.",
      "Example: a 21-tooth sprocket for 12.7 mm pitch chain has a 85.211 mm pitch diameter."
    ],
    "limitations": [
      "Formulas for 3/8 in. and larger pitch; 3/16 in. pitch chain uses different constants.",
      "Tolerances are in the standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Measure over pins to check tooth form and wear; compare with the calculated value and the standard’s tolerance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3457–3460. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "microtool-stiffness": {
    "purpose": "Change in torsional stiffness of small end mills and drills when the diameter or flute length changes, using the handbook’s proportionalities (diameter⁴, flute length⁻²), and the bending deflection of the new tool under a radial cutting force as a cantilever with an effective fluted diameter.",
    "uses": [
      "Compare tool options before micromilling or microdrilling",
      "Estimate deflection error on a small cutter",
      "Choose the shortest flute length that reaches the feature"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D1": "Diameter of the current tool.",
      "L1": "Flute length of the current tool.",
      "D2": "Diameter of the proposed tool.",
      "L2": "Flute length of the proposed tool.",
      "Lo": "Length from the holder face to the cutting point.",
      "k": "Ratio of the fluted section’s equivalent diameter to the nominal diameter (about 0.8 for two flutes).",
      "E": "Elastic modulus of the tool (about 600 GPa for carbide).",
      "F": "Radial force at the tool tip."
    },
    "outputs": [
      "Torsional stiffness change from diameter and flute length",
      "Combined change",
      "Bending deflection of the new tool"
    ],
    "method": [
      "Torsional stiffness ∝ D⁴ and ∝ L⁻² (handbook): change = (D₂⁴ − D₁⁴) ÷ D₁⁴ and (L₂⁻² − L₁⁻²) ÷ L₁⁻².",
      "Combined ratio = (D₂ ÷ D₁)⁴ × (L₁ ÷ L₂)².",
      "Deflection δ = F L³ ÷ 3 E I with I = π (k D₂)⁴ ÷ 64 (cantilever).",
      "Example: going from 1 to 0.8 mm cuts torsional stiffness by 59.04% (the handbook’s −59%)."
    ],
    "limitations": [
      "Proportional scaling only; shank, neck and holder stiffness also matter.",
      "Deflection treats the whole stick-out as the fluted section, which is conservative.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Flute length matters almost as much as diameter: choose the shortest that reaches."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1093–1094. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "stockpile-weight": {
    "purpose": "Volume and weight of bulk material piled naturally to its angle of repose on a circular base (a cone) or a rectangular base (a ridged pile with sloping ends), from the base size, the angle of repose and the bulk density.",
    "uses": [
      "Estimate the weight of a stockpile on a floor or plate",
      "Check floor or plate loading under a pile",
      "Size a storage area for a quantity of bulk material"
    ],
    "users": [
      "Process engineers",
      "Site and yard supervisors",
      "Estimators"
    ],
    "inputs": {
      "shape": "Shape of the base the pile stands on.",
      "D": "Diameter of the circular base.",
      "A": "Shorter side of the rectangular base.",
      "B": "Longer side of the rectangular base.",
      "theta": "Natural angle of repose of the material (from material data or measurement).",
      "rho": "Bulk (loose) density of the material."
    },
    "outputs": [
      "Pile height",
      "Volume",
      "Weight and average base pressure"
    ],
    "method": [
      "Cone: h = (D ÷ 2) tan θ; V = π D² h ÷ 12. This is the handbook’s W = M D³ with M = ρ π tan θ ÷ 24.",
      "Rectangular: h = (A ÷ 2) tan θ; V = A h (3B − A) ÷ 6 (a ridged pile sloping on all four sides).",
      "Weight = V × bulk density.",
      "Example: a 3 m circular base at 35° holds about 3.9596 t."
    ],
    "limitations": [
      "Dry, loose material that flows to its natural angle; moist, cohesive or compacted material differs.",
      "Density varies with compaction and moisture: use upper and lower values for limits.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Run the calculation with high and low densities to bracket the weight, as the handbook does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 382–383. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lumber-board-feet": {
    "purpose": "Board feet (feet board measure) and cubic volume of sawn timber from thickness, width, length and quantity, with cost from a price per board foot or per cubic metre, and weight from density.",
    "uses": [
      "Order timber for crates, pallets, patterns or jigs",
      "Compare prices quoted per board foot and per cubic metre",
      "Estimate timber weight for shipping"
    ],
    "users": [
      "Buyers",
      "Packaging and crating supervisors",
      "Pattern makers"
    ],
    "inputs": {
      "t": "Thickness (use nominal sizes if the price is on nominal measure).",
      "w": "Width.",
      "L": "Length of each piece.",
      "qty": "Number of pieces.",
      "pmode": "Whether the price is per board foot or per cubic metre.",
      "price": "Unit price.",
      "rho": "Density of the timber (from a wood density calculation)."
    },
    "outputs": [
      "Board feet",
      "Cubic metres",
      "Cost and weight"
    ],
    "method": [
      "One board foot is 1 in. × 12 in. × 1 ft (144 in³ = 0.00235974 m³).",
      "Board feet = thickness (in) × width (in) × length (ft) ÷ 12 × pieces.",
      "Cost = board feet × price, or cubic metres × price; weight = volume × density.",
      "Example: 10 pieces of 2 × 6 in. × 10 ft is 100 board feet."
    ],
    "limitations": [
      "Nominal and actual (dressed) sizes differ; use the basis your supplier prices on.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Convert quotes to the same basis before comparing suppliers."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3018–3019. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-working-strength-packed": {
    "purpose": "Empirical working strength of studs and bolts in packed or gasketed joints (where the gasket is more elastic than the bolts) by the handbook’s Cornell formula W = S_t (0.55 d² − 0.25 d), and by the alternative using the thread root area, with the bolt count for a total load.",
    "uses": [
      "Check studs on a gasketed cover or cylinder head",
      "Choose the number of bolts for a flange load",
      "Compare a legacy design rule with a modern joint analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Pressure equipment technicians"
    ],
    "inputs": {
      "d": "Nominal outside diameter of the bolt or stud.",
      "Ar": "Root (minor diameter) area of the thread, for the alternative formula.",
      "St": "Allowable tensile working stress you use for the bolt material.",
      "load": "Total separating load on the joint (pressure × area), to find the bolt count."
    },
    "outputs": [
      "Working strength per bolt (both formulas)",
      "Bolts needed for the load",
      "Formula in the handbook units"
    ],
    "method": [
      "W = S_t (0.55 d² − 0.25 d), with W in pounds, S_t in psi and d in inches (converted here).",
      "Alternative: W = S_t (A − 0.25 d), with A the thread root area in square inches.",
      "Handbook example: a 1-in. bolt at 10,000 psi has a working strength of about 3,000 lb.",
      "Example: a 25.4 mm bolt at 68.95 MPa carries about 13.345 kN in a packed joint."
    ],
    "limitations": [
      "Empirical rule for hand-tightened bolts in gasketed joints; bolts under 5/8 in. (16 mm) are not recommended for tight joints.",
      "Pressure equipment must be designed to its code (for example ASME VIII Appendix 2).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The 0.25 d term allows for the extra load put on by tightening; it penalises small bolts most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535–1536. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-flywheel-sizing": {
    "purpose": "Simplified flywheel design for punches and shears: average motor power from energy per stroke and stroking rate, energy the flywheel must give up during the cut, rim mass for the permitted speed reduction, rim section for a depth-to-width ratio, and the rim hoop stress from its speed.",
    "uses": [
      "Size a flywheel for a mechanical press, punch or shear",
      "Check motor power for a stroking rate",
      "Check flywheel rim speed and stress"
    ],
    "users": [
      "Machine designers",
      "Press maintenance engineers",
      "Mechanical engineers"
    ],
    "inputs": {
      "emode": "Whether to work out the energy from force and travel, or enter it.",
      "F": "Peak force during the cut.",
      "s": "Distance over which the force acts.",
      "E": "Energy needed per stroke.",
      "spm": "Strokes per minute.",
      "tcut": "Duration of the working part of the stroke.",
      "Dm": "Mean diameter of the flywheel rim.",
      "rpm": "Flywheel speed before the cut.",
      "red": "Permitted fall in speed during the cut.",
      "rho": "Density of the rim material (cast iron about 7200 kg/m³).",
      "y": "Ratio of radial depth to axial width of the rim section."
    },
    "outputs": [
      "Average motor power",
      "Energy from the flywheel and rim mass",
      "Rim section, rim speed and hoop stress"
    ],
    "method": [
      "Energy per stroke E = F × travel; average power = E × strokes per minute ÷ 60.",
      "Energy from the flywheel E₁ = E (1 − T₁ ÷ T), with T the stroke time.",
      "Rim mass m = 2 E₁ ÷ (v₁² − v₂²), with v the rim speed at the mean diameter and v₂ = v₁ (1 − reduction) — the physics behind the handbook constants C.",
      "Rim hoop stress σ = ρ v² (the handbook’s s = V² ÷ 10 for cast iron in ft/s and psi).",
      "Example: the handbook hot-slab shear (120,000 ft-lb per stroke at 20 strokes per minute, 6 ft 6 in. rim at 200 rpm) needs about 2,984.1 kg of rim (handbook 6,570 lb)."
    ],
    "limitations": [
      "Rim only; arms and hub add some inertia (a margin).",
      "Hoop stress ignores rim bending between arms, which can be considerably higher.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Allowing a larger speed reduction shrinks the flywheel but slows the stroke and loads the motor harder."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3004–3006. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ect-cutting-forces": {
    "purpose": "Equivalent chip thickness from feed, depth of cut and cutting edge length (Woxén–Colding), the metal removal rate, the main cutting force from a specific cutting force, the feed-plane force and its axial and radial components from the chip flow angle, and the power.",
    "uses": [
      "Estimate turning forces and power for a new cut",
      "Compare roughing and finishing conditions on one basis",
      "Estimate radial force for deflection checks"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "f": "Feed per revolution.",
      "a": "Depth of cut.",
      "CEL": "Length of cutting edge in contact (depends on depth, lead angle and nose radius).",
      "V": "Cutting speed.",
      "Kc": "Specific cutting force for the material at the ECT (from tests or tooling data).",
      "ratio": "Ratio of the feed-plane force to the cutting force (about 0.3–0.4 roughing, 0.5–0.6 finishing per the handbook).",
      "cfa": "Chip flow angle (about 30° roughing, 60° finishing at 15° lead angle)."
    },
    "outputs": [
      "Equivalent chip thickness",
      "Metal removal rate",
      "Cutting, axial and radial forces and power"
    ],
    "method": [
      "ECT = area ÷ CEL ≈ feed × depth ÷ CEL (handbook example: 0.8 × 3 ÷ 4 = 0.6 mm).",
      "MRR = 1000 V × ECT × CEL mm³/min.",
      "F_C = area × K_c; F_H = ratio × F_C; F_A = F_H cos(CFA), F_R = F_H sin(CFA).",
      "Power = F_C × V ÷ 60,000 kW.",
      "Example: 0.8 mm/rev × 3 mm over a 4 mm edge gives ECT = 0.6 mm."
    ],
    "limitations": [
      "Area approximated as feed × depth; K_c and the force ratio vary with ECT and speed.",
      "Nose radius and lead angle enter through the cutting edge length.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the product of feed and depth is held constant, tool life stays about constant at the same speed and edge length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1132–1141. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "draw-reductions": {
    "purpose": "Sequence of shell diameters in successive deep drawing operations from the blank diameter, a first-draw ratio and a redraw ratio (each the drawn diameter divided by the previous diameter), the number of draws needed to reach the final diameter, and the reduction percentage at each step.",
    "uses": [
      "Plan the number of operations for a deep-drawn shell",
      "Lay out punch diameters for a draw sequence",
      "Check whether a shell can be drawn in fewer operations"
    ],
    "users": [
      "Toolmakers",
      "Press shop engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the flat blank (from a shell-blank calculation).",
      "d": "Mean diameter of the finished shell.",
      "m1": "Limiting first-draw ratio for the material, thickness ratio and die (from drawing data or trials).",
      "mr": "Limiting ratio for each redraw (usually larger than the first)."
    },
    "outputs": [
      "Number of draws",
      "Diameter after each draw",
      "Reduction at each draw"
    ],
    "method": [
      "d₁ = m₁ D; dₙ = m_r dₙ₋₁ until the final diameter is reached.",
      "Number of draws n = 1 + ⌈log(d ÷ m₁ D) ÷ log m_r⌉ when d < m₁ D.",
      "The last draw is set to the final diameter; reduction = 1 − ratio.",
      "Example: a 100 mm blank to a 30 mm shell needs 4 draws."
    ],
    "limitations": [
      "Ratios depend on material, thickness-to-diameter ratio, die radii and lubrication; use your tested limits.",
      "Annealing between draws may be needed for work-hardening materials.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Spreading reductions evenly over the draws, rather than leaving a tiny last draw, reduces risk of tearing."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1353–1359. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
