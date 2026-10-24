// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook5).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "force-resultant": {
    "purpose": "Resolve up to four coplanar forces acting through one point into X and Y components, the resultant and the equilibrant.",
    "uses": [
      "Combine cable, sling or bracket loads",
      "Find the reaction a support must provide",
      "Check a free-body diagram quickly"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Technicians"
    ],
    "inputs": {
      "F1": "Magnitude of force 1 from your load analysis.",
      "a1": "Direction of force 1, anticlockwise from the +X axis.",
      "F2": "Magnitude of force 2.",
      "a2": "Direction of force 2.",
      "F3": "Magnitude of force 3 (0 if not used).",
      "a3": "Direction of force 3.",
      "F4": "Magnitude of force 4 (0 if not used).",
      "a4": "Direction of force 4."
    },
    "outputs": [
      "X and Y components",
      "Resultant magnitude and direction",
      "Equilibrant"
    ],
    "method": [
      "Rx = Σ F cos θ; Ry = Σ F sin θ.",
      "R = √(Rx² + Ry²); direction = atan2(Ry, Rx). The equilibrant has the same size, opposite direction.",
      "Example: 1000 N at 0° and 800 N at 60° give a resultant of 1,562 N at 26.33°."
    ],
    "limitations": [
      "All forces must act through the same point in one plane; moments from offset forces are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Design the support or anchor for the equilibrant, with your code’s load factors."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "inclined-plane": {
    "purpose": "Force parallel to an incline needed to raise, hold and lower a load with sliding friction, with efficiency and a self-locking check.",
    "uses": [
      "Size a pusher, winch or cylinder for a ramp",
      "Check whether a load slides on a chute",
      "Estimate efficiency of a sliding lift"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Technicians"
    ],
    "inputs": {
      "mass": "Mass of the load including any carrier or pallet.",
      "angle": "Slope of the plane from horizontal.",
      "mu": "Sliding (kinetic) friction coefficient for the two surfaces, measured or from a supplier; use static friction for break-away."
    },
    "outputs": [
      "Force to push up the slope",
      "Force to hold the load",
      "Force to pull it down",
      "Efficiency raising",
      "Self-locking or not"
    ],
    "method": [
      "Weight W = m g with g = 9.80665 m/s².",
      "Raise: F = W(sin θ + μ cos θ). Hold: F = W(sin θ − μ cos θ). Lower: F = W(μ cos θ − sin θ).",
      "Self-locking when μ ≥ tan θ. Efficiency raising = sin θ ÷ (sin θ + μ cos θ).",
      "Example: 200 kg on a 15° slope with μ = 0.3 needs 1,076 N to push it up."
    ],
    "limitations": [
      "Force parallel to the plane; rolling resistance and acceleration forces are not included.",
      "Friction coefficients vary widely with surface condition and lubrication.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the break-away (static) coefficient to size a drive that must start the load."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flywheel-energy": {
    "purpose": "Mass moment of inertia of a disc or ring flywheel, energy released between maximum and minimum speed, coefficient of fluctuation and rim speed.",
    "uses": [
      "Check a press or punch flywheel for one stroke",
      "Estimate energy stored for a cycle",
      "Compare rim speed with the maker’s limit"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Technicians"
    ],
    "inputs": {
      "mass": "Mass of the rotating disc or rim (weigh it or use the CAD mass).",
      "outer": "Outside diameter of the flywheel.",
      "inner": "Inside diameter of a ring-shaped rim; 0 for a uniform solid disc.",
      "nmax": "Speed before the energy is drawn (e.g. before the press stroke).",
      "nmin": "Lowest speed allowed during the working stroke.",
      "vmax": "Rim speed limit from the flywheel maker or your design standard for the material and construction."
    },
    "outputs": [
      "Mass moment of inertia",
      "Energy released between the two speeds",
      "Kinetic energy at maximum speed",
      "Coefficient of speed fluctuation",
      "Rim speed"
    ],
    "method": [
      "J = m(R² + r²) ÷ 2 (solid disc when r = 0).",
      "ΔE = ½J(ω₁² − ω₂²), ω = 2πn ÷ 60.",
      "Coefficient of fluctuation Cs = (n₁ − n₂) ÷ mean speed; rim speed = π D n₁ ÷ 60 000.",
      "Example: a 150 kg, 800 mm solid disc slowing from 600 to 540 rpm gives up 4,500.5 J."
    ],
    "limitations": [
      "Hub, spokes and shaft inertia are not included unless their mass is part of the entered disc.",
      "Rim stress depends on construction; the speed limit must come from the maker or a stress analysis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the released energy is less than the work per stroke, increase inertia or allow a larger speed drop."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3000–3010, 179–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centrifugal-force": {
    "purpose": "Centrifugal force, acceleration in g and tangential speed of a mass rotating at a radius, for clamps, counterweights and attachments.",
    "uses": [
      "Check clamping of fixture parts and counterweights on a spindle",
      "Estimate loads on rotor attachments",
      "Assess chuck jaw force loss at speed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Technicians"
    ],
    "inputs": {
      "mass": "Mass of the part, weight or jaw that rotates.",
      "radius": "Distance from the axis to the part’s centre of mass.",
      "rpm": "Highest speed the part will run at."
    },
    "outputs": [
      "Centrifugal force",
      "Acceleration in g",
      "Tangential speed"
    ],
    "method": [
      "ω = 2πn ÷ 60; F = m ω² r (r in metres).",
      "Acceleration = ω² r; in g = ω² r ÷ 9.80665.",
      "Example: 2 kg at 150 mm and 1500 rpm pulls outward with 7,402.2 N (377.41 g)."
    ],
    "limitations": [
      "Rigid body at steady speed; the effect of the part deflecting outward is not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare the force with the clamp, bolt or jaw holding capacity, including your safety factor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 187–190. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "balance-grade": {
    "purpose": "Permissible residual unbalance and specific unbalance for a rigid rotor from its mass, maximum service speed and balance quality grade G, compared with a measured value.",
    "uses": [
      "Set the balancing tolerance on a drawing or work order",
      "Accept or reject a balancing report",
      "Compare grades for a fan, pulley or spindle part"
    ],
    "users": [
      "Maintenance engineers",
      "Machinists",
      "Quality inspectors"
    ],
    "inputs": {
      "mass": "Mass of the rotating assembly being balanced.",
      "rpm": "Highest speed the rotor runs in service.",
      "grade": "Grade from the equipment standard, purchase specification or ISO 21940-11 guidance for the machine type.",
      "planes": "One plane for narrow discs; two planes for longer rotors. Unequal plane positions need the standard’s allocation rules.",
      "measured": "Residual unbalance per plane from the balancing machine report."
    },
    "outputs": [
      "Permissible residual unbalance (total and per plane)",
      "Permissible specific unbalance (eccentricity)",
      "Measured result against the limit"
    ],
    "method": [
      "Permissible specific unbalance e = G × 1000 ÷ ω (µm, = g·mm/kg), ω = 2πn ÷ 60.",
      "Permissible residual unbalance U = e × M = 9549 × G × M ÷ n (g·mm).",
      "With two planes and the centre of mass midway, each plane receives half of U.",
      "Example: a 25 kg rotor at 3000 rpm in G 6.3 may have 501.34 g·mm residual unbalance (20.054 µm)."
    ],
    "limitations": [
      "Rigid rotors only; flexible rotors need ISO 21940-12 methods.",
      "Equal allocation to two planes applies only when the centre of mass lies midway between them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Convert the limit into a correction mass at a radius: mass (g) = U (g·mm) ÷ radius (mm)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 191–196. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 21940-11:2016 Mechanical vibration — Rotor balancing — Part 11: Procedures and tolerances for rotors with rigid behaviour — https://www.iso.org/standard/54074.html"
    ]
  },
  "impact-load": {
    "purpose": "Impact energy of a falling or moving mass and the average and linear-spring peak forces when it is stopped over a given distance.",
    "uses": [
      "Size end stops, buffers and shock absorbers",
      "Estimate the load from a dropped part or tool",
      "Compare stopping distances"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Technicians"
    ],
    "inputs": {
      "mode": "Falling mass or a mass moving horizontally into a stop.",
      "mass": "Mass of the moving or falling body.",
      "height": "Height of the fall before contact (falling only).",
      "speed": "Speed at the moment of contact (moving only).",
      "stop": "Distance over which the body is brought to rest: buffer stroke, deflection or crush depth."
    },
    "outputs": [
      "Impact speed",
      "Energy to absorb",
      "Average stopping force",
      "Peak force for a linear spring stop",
      "Deceleration"
    ],
    "method": [
      "Falling: v = √(2gh); energy E = m g (h + s), including the fall through the stopping distance.",
      "Moving: E = ½ m v².",
      "Average force = E ÷ s; a linear spring stop peaks at 2E ÷ s.",
      "Example: 50 kg falling 300 mm onto a 10 mm stop must absorb 152 J, averaging 15,200 N."
    ],
    "limitations": [
      "Rigid bodies and a known stopping distance are assumed; real stops have non-linear characteristics.",
      "Rebound and energy lost elsewhere are ignored, which is conservative for the stop.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Select a buffer or absorber rated for the energy per stroke and the peak force, at your cycle rate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 179–186, 278. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "move-profile": {
    "purpose": "Move time for a trapezoidal (or triangular) velocity profile with equal acceleration and deceleration, with the force needed to accelerate the moving mass.",
    "uses": [
      "Estimate pick-and-place or axis cycle times",
      "Check whether an axis reaches top speed",
      "Size the acceleration force for a drive"
    ],
    "users": [
      "Automation engineers",
      "Machine designers"
    ],
    "inputs": {
      "distance": "Length of the move.",
      "vmax": "Speed limit of the axis, drive or process.",
      "accel": "Acceleration the drive can deliver and the load can tolerate.",
      "mass": "Total moving mass including carriage, tooling and product."
    },
    "outputs": [
      "Move time",
      "Profile type and peak speed",
      "Acceleration time and distance",
      "Acceleration force"
    ],
    "method": [
      "If L ≥ v²/a the profile is trapezoidal: t = L ÷ v + v ÷ a.",
      "Otherwise it is triangular: t = 2√(L ÷ a) and the peak speed is √(a L).",
      "Acceleration force = m × a (friction and gravity excluded).",
      "Example: 500 mm at up to 1000 mm/s and 5000 mm/s² takes 0.7 s."
    ],
    "limitations": [
      "Constant acceleration; jerk limits and settling time lengthen real moves.",
      "Friction, gravity on vertical axes and process forces are not included in the force.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add settling and dwell time for the total cycle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 175–180. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sling-tension": {
    "purpose": "Tension in each leg of a multi-leg sling from the load mass, the number of legs assumed to share the load and the leg angle from vertical.",
    "uses": [
      "Check slings and shackles before a lift",
      "Plan sling length to keep angles small",
      "Explain why wide sling angles overload legs"
    ],
    "users": [
      "Riggers and supervisors",
      "Maintenance planners",
      "Lifting engineers"
    ],
    "inputs": {
      "mass": "Load mass including lifting beams and attachments below the hook.",
      "legs": "Number of legs that carry load; many codes count only two legs of a three- or four-leg sling unless load sharing is assured.",
      "angle": "Angle of each leg from vertical (half the included angle).",
      "wll": "Working load limit of one leg as marked on the sling tag (in a straight vertical pull)."
    },
    "outputs": [
      "Tension per leg",
      "Angle factor",
      "Leg tension against the WLL"
    ],
    "method": [
      "Tension per leg = m g ÷ (n cos β), where n is the number of legs sharing the load and β the angle from vertical.",
      "Angle factor = 1 ÷ cos β; the leg tension in kilograms-force = mass ÷ (n cos β).",
      "Example: 2000 kg on 2 legs at 30° from vertical puts 1,154.7 kg in each leg."
    ],
    "limitations": [
      "Symmetrical load with legs at equal angles; an off-centre centre of gravity loads legs unequally.",
      "This is a calculation aid, not a lift plan; follow your lifting code and a competent person’s assessment.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Shorten the angle (longer legs) or use a spreader beam when the tension is near the rating."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2613–2650. Topic reference; no source tables or recommended settings are reproduced.",
      "AS 1418 and AS 3775 series (cranes and chain slings) or your national lifting code — consult the current editions"
    ]
  },
  "combined-cg": {
    "purpose": "Total mass and centre of gravity (X, Y, Z) of up to five masses at known positions, for lifting, transport and machine layout.",
    "uses": [
      "Find lifting points for an assembly or skid",
      "Check tipping stability of a machine",
      "Locate the CG of a fixture with work"
    ],
    "users": [
      "Design engineers",
      "Lifting planners",
      "Machine builders"
    ],
    "inputs": {
      "m1": "Mass of item 1 (0 if not used), from weighing or CAD.",
      "x1": "X coordinate of item 1’s own centre of gravity from a common datum.",
      "y1": "Y coordinate of item 1’s centre of gravity.",
      "z1": "Z coordinate of item 1’s centre of gravity.",
      "m2": "Mass of item 2 (0 if not used), from weighing or CAD.",
      "x2": "X coordinate of item 2’s own centre of gravity from a common datum.",
      "y2": "Y coordinate of item 2’s centre of gravity.",
      "z2": "Z coordinate of item 2’s centre of gravity.",
      "m3": "Mass of item 3 (0 if not used), from weighing or CAD.",
      "x3": "X coordinate of item 3’s own centre of gravity from a common datum.",
      "y3": "Y coordinate of item 3’s centre of gravity.",
      "z3": "Z coordinate of item 3’s centre of gravity.",
      "m4": "Mass of item 4 (0 if not used), from weighing or CAD.",
      "x4": "X coordinate of item 4’s own centre of gravity from a common datum.",
      "y4": "Y coordinate of item 4’s centre of gravity.",
      "z4": "Z coordinate of item 4’s centre of gravity.",
      "m5": "Mass of item 5 (0 if not used), from weighing or CAD.",
      "x5": "X coordinate of item 5’s own centre of gravity from a common datum.",
      "y5": "Y coordinate of item 5’s centre of gravity.",
      "z5": "Z coordinate of item 5’s centre of gravity."
    },
    "outputs": [
      "Total mass",
      "Combined centre of gravity X, Y, Z"
    ],
    "method": [
      "Total mass M = Σ mᵢ.",
      "X̄ = Σ(mᵢ xᵢ) ÷ M, and similarly for Y and Z.",
      "Example: the default items total 195 kg with the centre of gravity at X 153.85, Y 46.154, Z 61.538 mm."
    ],
    "limitations": [
      "Each item’s own centre of gravity must be known; estimated item CGs limit the accuracy.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Place lifting points so the hook is directly above the combined centre of gravity."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 221–227. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "mass-moment-inertia": {
    "purpose": "Mass moment of inertia and radius of gyration of common solids, with the parallel-axis transfer to an offset axis, for drive sizing and acceleration.",
    "uses": [
      "Size a motor for a rotary table, roller or disc",
      "Find inertia of a part about a pivot",
      "Compare inertia of design options"
    ],
    "users": [
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "shape": "The body and the axis it rotates about.",
      "mass": "Mass of the body.",
      "dimA": "Outer diameter (disc, ring, cylinder, sphere), side a (block) or length (rod).",
      "dimB": "Inner diameter (ring), length (cylinder across), side b (block); not used for disc, sphere or rod.",
      "offset": "Distance between the body’s own central axis and the actual (parallel) rotation axis; 0 if it rotates about its centre."
    },
    "outputs": [
      "Moment of inertia about the body axis",
      "Moment of inertia about the offset axis",
      "Radius of gyration"
    ],
    "method": [
      "Disc ½mr²; ring ½m(rₒ² + rᵢ²); cylinder across m(3r² + L²) ÷ 12; block m(a² + b²) ÷ 12; sphere ⅖mr²; rod about end mL² ÷ 3.",
      "Parallel axis: J = J_c + m d².",
      "Radius of gyration k = √(J ÷ m).",
      "Example: a 10 kg, 300 mm disc has J = 0.1125 kg·m²."
    ],
    "limitations": [
      "Uniform density and the idealised shape are assumed; holes and features change the result.",
      "The rod formula already refers to the end axis; the offset is added from that axis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the inertia with the motor’s rotor inertia and any gear ratio to check acceleration."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 228–240. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "belt-friction": {
    "purpose": "Maximum tight-side tension of a belt, rope or band wrapped around a drum (capstan or Euler–Eytelwein relation), for flat and V-groove contact.",
    "uses": [
      "Check slip of a flat or V belt",
      "Size a band brake or rope brake",
      "Estimate holding force of a rope around a bollard"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Technicians"
    ],
    "inputs": {
      "slack": "Tension on the low-tension side: belt slack-side tension, brake anchor force or holding force on a rope.",
      "mu": "Friction coefficient between belt, rope or lining and the drum, from the supplier or tests.",
      "wrap": "Angle of contact around the drum (180° for equal pulleys; more for several turns).",
      "groove": "Included angle of a V-groove (e.g. 34–40° for V-belts); 0 for flat contact."
    },
    "outputs": [
      "Maximum tight-side tension",
      "Tension ratio",
      "Net force (tight minus slack)",
      "Effective friction coefficient"
    ],
    "method": [
      "Effective friction μₑ = μ for flat contact, or μ ÷ sin(β ÷ 2) in a groove of included angle β.",
      "T₁ ÷ T₂ = e^(μₑ θ), with θ in radians.",
      "Transmissible force = T₁ − T₂.",
      "Example: 200 N slack tension, μ 0.3 and 180° of wrap allow 513.27 N on the tight side."
    ],
    "limitations": [
      "Centrifugal tension of fast belts is not included and reduces the usable tension.",
      "Assumes slip is impending; the friction coefficient strongly affects the result.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep the working tension ratio well below the slip limit to allow for wear, dirt and lubricant."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–168, 2473–2490. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "column-buckling": {
    "purpose": "Critical buckling load of a straight, centrally loaded column using Euler’s formula for slender members and the J.B. Johnson parabola for intermediate ones, with the safety factor against an applied load.",
    "uses": [
      "Check push rods, cylinder rods, props and frame members in compression",
      "Choose a section to resist buckling",
      "Compare end fixity options"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "E": "Elastic modulus from the material data sheet or an approved materials database (steel is typically about 200 GPa).",
      "Sy": "Minimum yield strength from the material certificate or specification, not a typical value.",
      "A": "Area of the section, from a section table or the section properties calculator.",
      "I": "Smallest second moment of area of the section (the weak axis).",
      "L": "Length between points that are held against sideways movement.",
      "K": "Theoretical values: 1.0 pinned–pinned, 0.5 fixed–fixed, 0.7 fixed–pinned, 2.0 fixed–free. Design codes often use larger values for real end conditions.",
      "P": "Largest compressive load on the member.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Slenderness ratio and transition slenderness",
      "Method used (Euler or Johnson)",
      "Critical load",
      "Safety factor"
    ],
    "method": [
      "r = √(I ÷ A); slenderness λ = K L ÷ r; transition C_c = π√(2E ÷ S_y).",
      "Euler (λ ≥ C_c): σ_cr = π²E ÷ λ².",
      "Johnson (λ < C_c): σ_cr = S_y − (S_y λ ÷ 2π)² ÷ E.",
      "P_cr = σ_cr × A; safety factor = P_cr ÷ P.",
      "Example: the default strut has λ = 100, below C_c = 125.66, so Johnson gives P_cr = 170.84 kN and a factor of 3.4169."
    ],
    "limitations": [
      "Straight, centrally loaded, prismatic members; eccentricity and initial crookedness reduce capacity (see the eccentric column method or your code).",
      "Local buckling of thin walls and lateral-torsional buckling are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Structural steelwork must also be checked to the applicable code (e.g. AS 4100), which includes imperfection factors."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "principal-stress": {
    "purpose": "Principal stresses, their direction, maximum shear stress, von Mises and Tresca equivalent stresses for a plane stress state, with safety factors against yield.",
    "uses": [
      "Combine bending, axial and torsional stresses at a critical point",
      "Check a hand calculation or FEA result",
      "Compare yield criteria"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "sx": "Normal stress in the X direction (tension positive) from your calculation.",
      "sy": "Normal stress in the Y direction (tension positive).",
      "txy": "Shear stress on the X and Y faces.",
      "Sy": "Minimum yield strength from the material certificate or specification, not a typical value.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Principal stresses σ1 and σ2",
      "Principal angle",
      "Maximum shear stress",
      "von Mises and Tresca equivalent stresses",
      "Safety factors"
    ],
    "method": [
      "σ₁,₂ = (σx + σy) ÷ 2 ± √(((σx − σy) ÷ 2)² + τxy²); θp = ½ atan2(2τxy, σx − σy).",
      "von Mises σ′ = √(σ₁² − σ₁σ₂ + σ₂²); Tresca = max(|σ₁ − σ₂|, |σ₁|, |σ₂|) with σ₃ = 0.",
      "Safety factor = yield ÷ equivalent stress.",
      "Example: σx 120, σy -40, τ 50 MPa give σ₁ = 134.34 and σ₂ = -54.34 MPa, von Mises 168.23 MPa."
    ],
    "limitations": [
      "Plane stress (σz = 0); ductile, isotropic materials for the yield criteria.",
      "Stress concentrations must already be included in the entered stresses.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use von Mises for ductile metals; Tresca is slightly more conservative."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pressure-cylinder": {
    "purpose": "Hoop, radial and longitudinal stresses in a cylinder under internal pressure by Lamé’s thick-wall equations, with the thin-wall estimate and a von Mises safety factor.",
    "uses": [
      "Check hydraulic cylinder barrels, tubes and pipes",
      "Compare thin-wall and thick-wall results",
      "Screen a wall thickness before code design"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "di": "Bore of the tube or cylinder.",
      "t": "Minimum wall thickness after tolerances, corrosion and machining allowances.",
      "p": "Maximum working (or test) gauge pressure; 1 MPa = 10 bar.",
      "ends": "Closed if the pressure on the end caps is carried by this wall (e.g. a capped cylinder).",
      "Sy": "Minimum yield strength from the material certificate or specification, not a typical value.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Hoop stress at the bore (Lamé)",
      "Longitudinal and radial stress",
      "Thin-wall hoop stress",
      "von Mises stress and safety factor"
    ],
    "method": [
      "ro = ri + t. Hoop at bore σθ = p(ro² + ri²) ÷ (ro² − ri²); radial σr = −p.",
      "Longitudinal (closed ends) σz = p ri² ÷ (ro² − ri²).",
      "Thin wall σθ ≈ p d_mean ÷ 2t; von Mises from the three principal stresses at the bore.",
      "Example: 80 mm bore, 10 mm wall at 25 MPa gives a bore hoop stress of 113.89 MPa and a factor of 2.9514."
    ],
    "limitations": [
      "Elastic stresses away from ends, ports and welds; these features raise local stress.",
      "Pressure equipment must be designed to its code (e.g. AS 1210 or ASME VIII), which sets allowable stresses and thicknesses.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the thin-wall result is much lower than Lamé, the wall is thick and the Lamé result governs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 290–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "goodman-fatigue": {
    "purpose": "Fatigue safety factors for combined alternating and mean stress by modified Goodman, Soderberg and Gerber, plus first-cycle yield, against a required factor.",
    "uses": [
      "Check shafts, springs and brackets under cyclic load",
      "Compare mean-stress criteria",
      "Screen a design before testing"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "sa": "Half the stress range, including the fatigue stress concentration factor Kf.",
      "sm": "Average of maximum and minimum stress (tension positive), including Kf where your method requires it.",
      "Se": "Endurance limit corrected for surface, size, load, temperature and reliability, from test data or your design method.",
      "Su": "Ultimate tensile strength from the material certificate.",
      "Sy": "Minimum yield strength from the material certificate or specification, not a typical value.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Goodman, Soderberg and Gerber safety factors",
      "First-cycle yield safety factor",
      "Governing factor"
    ],
    "method": [
      "Goodman: n = 1 ÷ (σa ÷ Se + σm ÷ Su). Soderberg: n = 1 ÷ (σa ÷ Se + σm ÷ Sy).",
      "Gerber: n = ½(Su ÷ σm)²(σa ÷ Se)[−1 + √(1 + (2σm Se ÷ (Su σa))²)].",
      "Compressive mean stress: n = Se ÷ σa. Yield (Langer): n = Sy ÷ (σa + |σm|).",
      "Example: σa 100 and σm 80 MPa with Se 220 and Su 600 MPa give a Goodman factor of 1.701."
    ],
    "limitations": [
      "Infinite-life (endurance) criteria for steels; materials without an endurance limit need a life-based method.",
      "The accuracy depends on the corrected endurance limit, which is the user’s responsibility.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Goodman is the usual design criterion; Gerber fits test data better; Soderberg is the most conservative."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 200–211, 280. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "beam-cases": {
    "purpose": "Reactions, maximum bending moment, bending stress and deflection for an off-centre point load, cantilever with uniform load, fixed–fixed beams and a propped cantilever.",
    "uses": [
      "Check frames, rails and support beams",
      "Compare support conditions",
      "Size a section for stress and stiffness"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "case": "The support and load arrangement.",
      "load": "Point load, or the total of a uniformly distributed load (w × L).",
      "L": "Distance between supports, or the cantilever length.",
      "a": "Distance of the point load from the left support (off-centre case only).",
      "E": "Elastic modulus from the material data sheet or an approved materials database (steel is typically about 200 GPa).",
      "I": "Second moment of area about the bending axis, from a section table or the section properties calculator.",
      "c": "Distance from the neutral axis to the outermost fibre (half the depth for symmetrical sections).",
      "allow": "Allowable bending stress from your design code or company standard."
    },
    "outputs": [
      "Reactions",
      "Maximum bending moment",
      "Bending stress and its ratio to the allowable",
      "Maximum deflection and span-to-deflection ratio"
    ],
    "method": [
      "Off-centre: R₁ = Pb ÷ L, M = Pab ÷ L; δmax = Pb(L² − b²)^1.5 ÷ (9√3 EIL) for the shorter segment b.",
      "Cantilever UDL: M = WL ÷ 2, δ = WL³ ÷ 8EI. Fixed–fixed point: M = PL ÷ 8, δ = PL³ ÷ 192EI. Fixed–fixed UDL: M = WL ÷ 12, δ = WL³ ÷ 384EI.",
      "Propped UDL: R = 5W/8 and 3W/8, M = WL ÷ 8 at the fixed end, δmax at 0.4215L from the support.",
      "Stress σ = M c ÷ I.",
      "Example: 5000 N at 600 mm on a 2000 mm span gives M = 2,100 N·m, σ = 13.125 MPa and δ = 0.41766 mm."
    ],
    "limitations": [
      "Linear elastic, small-deflection beams of constant section; self-weight is not added automatically.",
      "Lateral-torsional buckling, shear deflection and local bearing are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Typical deflection limits are span/250 to span/1000 depending on use; take yours from the design brief."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 257–277. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shaft-diameter": {
    "purpose": "Minimum solid shaft diameter for combined bending and torsion by the maximum-shear-stress theory with shock and fatigue factors, and the stress in a chosen diameter.",
    "uses": [
      "Size line shafts, pulley and gear shafts",
      "Check an existing shaft after a load change",
      "Compare the effect of a keyway"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "M": "Largest bending moment at the section, from the shaft’s bending moment diagram.",
      "T": "Torque transmitted through the section.",
      "Km": "Combined shock and fatigue factor for bending, from your design method (the ASME code suggests about 1.5 for gradually applied loads on rotating shafts).",
      "Kt": "Combined shock and fatigue factor for torsion (about 1.0 for gradually applied loads in the ASME code).",
      "tau": "Allowable shear stress from your design method; the ASME code uses the lower of 0.3 × yield and 0.18 × tensile strength.",
      "keyway": "A keyway at the section reduces the allowable stress by 25% in the ASME code method.",
      "d": "Diameter of an existing or proposed shaft to check."
    },
    "outputs": [
      "Required diameter",
      "Equivalent torque",
      "Shear stress and safety ratio in the checked diameter"
    ],
    "method": [
      "Equivalent torque Te = √((Km M)² + (Kt T)²).",
      "Required d = (16 Te ÷ (π τ_allow))^(1/3), with τ_allow × 0.75 when a keyway is present.",
      "Check: τ = 16 Te ÷ (π d³).",
      "Example: M 300 N·m and T 500 N·m need at least 48.516 mm; a 50 mm shaft runs at 27.407 MPa."
    ],
    "limitations": [
      "Solid circular shafts; for hollow shafts use the polar section modulus.",
      "Stress concentrations at shoulders and grooves need a fatigue check (see the Goodman tool); deflection and critical speed are separate checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Round up to a standard size and check bearing seats, key and deflection."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "critical-speed": {
    "purpose": "First critical speed of a uniform solid shaft with simple, fixed–free or fixed–fixed supports, optionally with a single disc (Dunkerley), checked against the operating speed.",
    "uses": [
      "Check long line shafts, rollers and spindles",
      "Decide on intermediate bearings",
      "Screen a drive before detailed rotor dynamics"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "d": "Diameter of the shaft (uniform).",
      "L": "Distance between bearings, or overhang length for the fixed–free case.",
      "E": "Elastic modulus from the material data sheet or an approved materials database (steel is typically about 200 GPa).",
      "rho": "Density of the shaft material (steel about 7850 kg/m³).",
      "support": "How the bearings restrain the shaft; real bearings lie between simple and fixed.",
      "disc": "Mass of a single pulley, rotor or disc at mid-span (or at the free end when overhung).",
      "rpm": "Highest running speed.",
      "margin": "How far the running speed must stay from the critical speed, from your design standard."
    },
    "outputs": [
      "Critical speed of the shaft alone",
      "Critical speed with the disc (Dunkerley)",
      "Operating speed as a percentage of critical"
    ],
    "method": [
      "Shaft alone: ω = (βL ÷ L)²√(EI ÷ ρA), with βL = π (simple), 1.875 (fixed–free) or 4.730 (fixed–fixed).",
      "Disc on a massless shaft: ω = √(k ÷ m) with k = 48EI/L³, 3EI/L³ or 192EI/L³.",
      "Combined (Dunkerley): 1/ω² = 1/ω_shaft² + 1/ω_disc²; n = 60ω ÷ 2π.",
      "Example: a 40 mm shaft over 1500 mm with a 20 kg disc has a critical speed of about 1,092.9 rpm."
    ],
    "limitations": [
      "Dunkerley’s method underestimates the critical speed slightly (conservative).",
      "Bearing and support stiffness lower the critical speed; gyroscopic effects are ignored.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Running above critical is possible but the shaft passes through resonance on start-up and shut-down."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 197, 302. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "circular-plate": {
    "purpose": "Maximum bending stress and centre deflection of a uniformly loaded circular flat plate with clamped or simply supported edges (small-deflection theory).",
    "uses": [
      "Check blind flanges, cylinder end caps and covers",
      "Size a window or inspection cover",
      "Compare clamped and simply supported edges"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "edge": "Clamped for a plate welded or bolted rigidly all round; simply supported for a plate resting on a gasket or ledge.",
      "a": "Radius at which the plate is supported (gasket or bolt-circle radius as appropriate).",
      "t": "Minimum plate thickness.",
      "p": "Pressure difference across the plate (1 MPa = 10 bar).",
      "E": "Elastic modulus from the material data sheet or an approved materials database (steel is typically about 200 GPa).",
      "nu": "Poisson’s ratio of the material (about 0.3 for steel).",
      "allow": "Allowable bending stress from your design code."
    },
    "outputs": [
      "Maximum bending stress and location",
      "Centre deflection",
      "Deflection-to-thickness ratio"
    ],
    "method": [
      "Plate rigidity D = E t³ ÷ 12(1 − ν²).",
      "Clamped: σmax = 3pa² ÷ 4t² at the edge; δ = pa⁴ ÷ 64D.",
      "Simply supported: σmax = 3(3 + ν)pa² ÷ 8t² at the centre; δ = (5 + ν)pa⁴ ÷ 64(1 + ν)D.",
      "Example: a 12 mm clamped plate of 100 mm radius at 1 MPa has σmax = 52.083 MPa and δ = 0.049371 mm."
    ],
    "limitations": [
      "Small deflections only (δ less than about half the thickness); larger deflections need membrane theory.",
      "Real edges lie between clamped and simply supported; bolted flanges and pressure vessel heads must follow their codes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If unsure of the edge condition, check both cases and use the worse result."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 288–290. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-fit": {
    "purpose": "Interface pressure of a hub on a solid or hollow shaft from the diametral interference (Lamé), hub bore stresses, torque and axial holding capacity, and the hub temperature rise for a shrink fit.",
    "uses": [
      "Check gears, couplings and pulleys pressed on shafts",
      "Find the heating temperature for a shrink fit",
      "Compare interference with torque requirement"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "d": "Nominal diameter of the fit.",
      "D": "Outside diameter of the hub around the fit.",
      "di": "Bore of a hollow shaft; 0 for solid.",
      "delta": "Shaft diameter minus hub bore diameter; use the minimum for holding capacity and the maximum for stress.",
      "L": "Length of the fitted contact.",
      "mu": "Friction coefficient for the assembled fit, from tests or your design guide (assembly method and surface finish affect it).",
      "Eh": "Hub material modulus.",
      "nuh": "Hub Poisson’s ratio.",
      "Es": "Shaft material modulus.",
      "nus": "Shaft Poisson’s ratio.",
      "Sy": "Minimum yield strength of the hub material.",
      "req": "Factor of safety required by your design code, customer specification or company standard.",
      "alpha": "Linear expansion coefficient of the hub material over the heating range.",
      "clear": "Extra clearance needed to slide the hot hub on (often about 0.001 × d)."
    },
    "outputs": [
      "Interface pressure",
      "Hub hoop and von Mises stress at the bore",
      "Holding torque and axial force",
      "Hub temperature rise for shrink fitting"
    ],
    "method": [
      "p = δ ÷ [d((D² + d²) ÷ (D² − d²) + νh) ÷ Eh + d((d² + di²) ÷ (d² − di²) − νs) ÷ Es].",
      "Hub hoop at bore σθ = p(D² + d²) ÷ (D² − d²); von Mises with σr = −p.",
      "Torque T = μ p π d² L ÷ 2; axial force F = μ p π d L.",
      "Temperature rise ΔT = (δ + clearance) ÷ (α d).",
      "Example: 0.04 mm interference on a 50 mm steel fit in a 100 mm hub gives p = 60 MPa and holds 2,120.6 N·m."
    ],
    "limitations": [
      "Elastic, plane-stress Lamé solution for equal-length hub and shaft; hub ends and keyways raise local stresses.",
      "Surface smoothing reduces effective interference on rough surfaces.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check holding capacity at minimum interference and hub stress at maximum interference."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 631–634. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thermal-stress": {
    "purpose": "Stress and force in a bar or pipe whose thermal expansion is fully or partly restrained, compared with the yield strength.",
    "uses": [
      "Check rails, pipes and frames fixed at both ends",
      "Estimate anchor loads from heating",
      "Decide whether an expansion joint is needed"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "E": "Elastic modulus from the material data sheet or an approved materials database (steel is typically about 200 GPa).",
      "alpha": "Linear expansion coefficient over the temperature range, from material data.",
      "dT": "Change from the temperature at which the member was fixed (positive for heating).",
      "restraint": "100% if the ends cannot move at all; less if supports allow some movement.",
      "A": "Cross-section area of the member.",
      "Sy": "Minimum yield strength from the material certificate or specification, not a typical value."
    },
    "outputs": [
      "Thermal stress",
      "Axial force on the restraints",
      "Unrestrained expansion strain",
      "Safety factor against yield"
    ],
    "method": [
      "Unrestrained strain ε = α ΔT.",
      "Stress σ = E α ΔT × restraint (compressive when heated).",
      "Force on restraints = σ A.",
      "Example: steel heated 60 K with full restraint reaches 144 MPa and pushes on its anchors with 288 kN."
    ],
    "limitations": [
      "Uniform temperature through the section; temperature gradients create additional stresses.",
      "Slender members may buckle before reaching the calculated compressive stress (check with the column buckling tool).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the stress approaches yield or the member is slender, allow movement or add an expansion joint."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–376, 578. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hertz-contact": {
    "purpose": "Contact width, maximum contact pressure and maximum subsurface shear stress for sphere (point) or parallel cylinder (line) contact by Hertz theory.",
    "uses": [
      "Check wheels on rails, cam followers and rollers",
      "Size ball transfer units and pivots",
      "Compare materials and radii"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "geom": "Point contact for balls; line contact for rollers and wheels on flat tracks.",
      "R1": "Radius of the convex body (ball or roller radius).",
      "R2": "Radius of the mating body: 0 for flat, negative for a concave seat or groove.",
      "F": "Normal load across the contact.",
      "L": "Length of line contact (roller or wheel width).",
      "E1": "Modulus of body 1.",
      "nu1": "Poisson’s ratio of body 1.",
      "E2": "Modulus of body 2.",
      "nu2": "Poisson’s ratio of body 2.",
      "allow": "Allowable contact pressure for the material, hardness and number of cycles, from your design data."
    },
    "outputs": [
      "Contact radius or half-width",
      "Maximum contact pressure",
      "Maximum subsurface shear and its depth",
      "Approach (point contact)"
    ],
    "method": [
      "E* = 1 ÷ ((1 − ν₁²) ÷ E₁ + (1 − ν₂²) ÷ E₂); 1/R = 1/R₁ + 1/R₂.",
      "Point: a = (3FR ÷ 4E*)^(1/3); p₀ = 3F ÷ 2πa²; τmax ≈ 0.31 p₀ at 0.48a.",
      "Line: b = √(4FR ÷ πLE*); p₀ = 2F ÷ πbL; τmax ≈ 0.30 p₀ at 0.786b.",
      "Example: a 50 mm radius roller, 20 mm long, on a flat with 10000 N gives p₀ = 606.04 MPa."
    ],
    "limitations": [
      "Elastic, frictionless, smooth contacts with dimensions much larger than the contact area.",
      "Edge loading at roller ends raises pressure well above the line-contact value.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare with allowable values for the actual hardness and cycle count; surface fatigue governs repeated contacts."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2301–2309. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "compression-spring": {
    "purpose": "Rate, working load, Wahl-corrected shear stress, solid length, stress at solid, natural frequency and buckling ratio of a round-wire helical compression spring.",
    "uses": [
      "Check a catalogue or custom spring against a duty",
      "Specify a replacement spring",
      "Check stress at solid before ordering"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Measured or specified wire diameter.",
      "D": "Mean coil diameter = outside diameter − wire diameter.",
      "Na": "Coils that deflect; for closed ends this is total coils minus 2.",
      "ends": "End form of the spring.",
      "G": "Shear modulus of the wire (about 79 GPa for spring steel, about 69 GPa for stainless 302).",
      "L0": "Length with no load.",
      "Lw": "Installed or working length under the maximum load.",
      "allow": "Allowable shear stress for the wire material, size and duty (static or fatigue) from the spring maker or design data.",
      "rho": "Wire material density (steel about 7850 kg/m³)."
    },
    "outputs": [
      "Spring rate and working load",
      "Spring index and Wahl factor",
      "Corrected shear stress at working length and at solid",
      "Solid length, total coils and clash allowance",
      "Natural frequency and buckling ratio"
    ],
    "method": [
      "Rate k = G d⁴ ÷ 8D³Na; index C = D ÷ d; Wahl K = (4C − 1) ÷ (4C − 4) + 0.615 ÷ C.",
      "Load F = k(L₀ − L_w); stress τ = K × 8FD ÷ πd³.",
      "Total coils and solid length by end type: closed & ground Nt = Na + 2, Ls = Nt d; closed Nt = Na + 2, Ls = (Nt + 1)d; plain & ground Nt = Na + 1, Ls = Nt d; plain Nt = Na, Ls = (Nt + 1)d.",
      "Natural frequency (fixed ends) f = ½√(k ÷ m_active), m_active = ρπ²d²DNa ÷ 4.",
      "Example: 2 mm wire, 16 mm mean diameter and 8 active coils give k = 4.8401 N/mm, 72.601 N at 35 mm and τ = 437.8 MPa."
    ],
    "limitations": [
      "Round wire, uniform pitch and axial loading; hook or eccentric loads raise stress.",
      "Buckling depends on end restraint; the slenderness ratio is a screening value only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep the stress at solid below the allowable so the spring survives being fully compressed; keep C between about 4 and 12 for easy manufacture."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "extension-spring": {
    "purpose": "Rate, load at extension including initial tension, and Wahl-corrected body stress of a round-wire helical extension spring.",
    "uses": [
      "Check a return or counterbalance spring",
      "Specify initial tension and rate",
      "Compare spring options"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Wire diameter.",
      "D": "Mean coil diameter = outside diameter − wire diameter.",
      "Na": "Active body coils (hooks or loops are often counted as about one extra coil; follow the maker’s convention).",
      "G": "Shear modulus of the wire material.",
      "Fi": "Initial tension wound into the spring, from the maker’s data or a load test (the load needed before coils separate).",
      "x": "Extension beyond the free length at the working position.",
      "allow": "Allowable body stress for the material and duty; hooks usually limit extension springs."
    },
    "outputs": [
      "Spring rate",
      "Load at the working extension",
      "Body shear stress",
      "Stress from initial tension"
    ],
    "method": [
      "Rate k = G d⁴ ÷ 8D³Na.",
      "Load F = Fi + k x.",
      "Body stress τ = K × 8FD ÷ πd³ with the Wahl factor K; initial-tension stress τi = 8Fi D ÷ πd³ (uncorrected).",
      "Example: the default spring has k = 1.8797 N/mm and carries 56.993 N at 25 mm extension."
    ],
    "limitations": [
      "Hook and loop stresses are not calculated and usually govern failure; check them with the maker.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare the initial-tension stress with the range your spring maker can achieve for the index."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 325–332. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torsion-spring": {
    "purpose": "Angular deflection, rate, bending stress (with the inner-fibre correction factor) and reduced coil diameter of a round-wire helical torsion spring under a moment.",
    "uses": [
      "Check hinge, lid and return torsion springs",
      "Choose an arbor that will not bind",
      "Specify rate per turn"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Wire diameter.",
      "D": "Mean coil diameter = outside diameter − wire diameter.",
      "Nb": "Number of body coils (turns), excluding the legs.",
      "E": "Elastic (tensile) modulus of the wire (about 207 GPa for spring steel).",
      "F": "Force applied at the end of the arm.",
      "arm": "Perpendicular distance from the load to the coil axis.",
      "arbor": "Diameter of the pin the spring winds onto; 0 if none.",
      "allow": "Allowable bending stress for the wire and duty, from the spring maker or design data."
    },
    "outputs": [
      "Moment and angular deflection",
      "Rate per radian and per turn",
      "Corrected bending stress",
      "Inside diameter after winding and arbor clearance"
    ],
    "method": [
      "Moment M = F × arm. Deflection θ = 64 M D Nb ÷ (E d⁴) radians (legs not included).",
      "Rate = E d⁴ ÷ 64 D Nb per radian; × 2π per turn.",
      "Stress σ = Ki × 32M ÷ πd³ with Ki = (4C² − C − 1) ÷ 4C(C − 1).",
      "Wound mean diameter D′ = D Nb ÷ (Nb + θ/2π); inside diameter = D′ − d.",
      "Example: 20 N on a 25 mm arm winds the default spring 66.43° with σ = 687.9 MPa."
    ],
    "limitations": [
      "Leg deflection and coil friction are ignored; some references increase the deflection by about 6% for friction (constant 10.8 instead of 10.19 per turn).",
      "Load must wind the spring (close the coils); unwinding loads raise stress.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep about 10% diametral clearance between the wound inside diameter and the arbor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 333–343. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spring-combination": {
    "purpose": "Equivalent rate of up to four springs in series or parallel, with the deflection and load of each spring under a given total load.",
    "uses": [
      "Combine springs for a target rate",
      "Find load sharing in nested or stacked springs",
      "Model mounts and supports"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "arr": "Parallel when springs act side by side or nested; series when one pushes on the next.",
      "k1": "Rate of spring 1 from its data sheet or a test.",
      "k2": "Rate of spring 2.",
      "k3": "Rate of spring 3, or 0.",
      "k4": "Rate of spring 4, or 0.",
      "F": "Total load on the combination."
    },
    "outputs": [
      "Equivalent rate",
      "Total deflection",
      "Load and deflection of each spring"
    ],
    "method": [
      "Parallel: k = Σkᵢ; every spring deflects F ÷ k and carries kᵢ × deflection.",
      "Series: 1/k = Σ(1/kᵢ); every spring carries F and deflects F ÷ kᵢ.",
      "Example: 20 and 30 N/mm in parallel give 50 N/mm and 10 mm under 500 N."
    ],
    "limitations": [
      "Linear springs within their working range; parallel springs must start loading together (no preload differences).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check that no individual spring exceeds its own maximum load or deflection."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–320. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "disc-spring": {
    "purpose": "Load, flat load and top inner-edge stress of a disc (Belleville) spring by the Almen–László method, and the force and travel of series and parallel stacks.",
    "uses": [
      "Size disc stacks for bolted joints, clutches and valves",
      "Check load at a set deflection",
      "Compare series and parallel stacking"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "De": "Outside diameter from the catalogue.",
      "Di": "Inside diameter from the catalogue.",
      "t": "Disc thickness.",
      "h0": "Unloaded height l₀ minus thickness t, from the catalogue.",
      "E": "Elastic modulus of the spring steel.",
      "nu": "Poisson’s ratio (about 0.3).",
      "s": "Deflection of a single disc at the working position (no more than h₀).",
      "ns": "Number of single discs (or parallel sets) stacked in alternating directions.",
      "np": "Number of discs nested in the same direction in each set."
    },
    "outputs": [
      "Force of one disc and of the stack",
      "Force at flat",
      "Top inner-edge stress (σOM and σI)",
      "Stack travel"
    ],
    "method": [
      "δ = De ÷ Di; K₁ = (1/π)((δ − 1)/δ)² ÷ ((δ + 1)/(δ − 1) − 2/ln δ).",
      "F = 4E ÷ (1 − ν²) × t⁴ ÷ (K₁De²) × (s/t) × [(h₀/t − s/t)(h₀/t − s/2t) + 1].",
      "σI = −4E ÷ (1 − ν²) × t² ÷ (K₁De²) × (s/t) × [K₂(h₀/t − s/2t) + K₃], with K₂ = (6/π)((δ − 1)/ln δ − 1)/ln δ and K₃ = (3/π)(δ − 1)/ln δ.",
      "Stack force = F × parallel count (friction neglected); stack travel = s × series count.",
      "Example: the default disc gives 4,762.1 N at 1.05 mm deflection and 5,897.9 N at flat."
    ],
    "limitations": [
      "Discs without contact flats; friction in parallel stacks raises loading force and lowers unloading force.",
      "Fatigue needs the tensile stresses at the lower edges (σII, σIII) and the maker’s fatigue diagrams.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep the working deflection at or below about 75% of h₀ for a predictable, near-linear characteristic."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 350–359. Topic reference; no source tables or recommended settings are reproduced.",
      "EN 16983:2016 Disc springs — Quality specifications — Dimensions; EN 16984:2016 Disc springs — Calculation"
    ]
  }
});
