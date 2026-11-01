// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook82).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "gear-pitting-geometry-factor": {
    "purpose": "Pitting resistance geometry factor I for an external spur or helical gear pair by the AGMA 908-B89 equations the handbook gives: standard and operating transverse pressure angles, base radii and base pitches, the distances along the line of action to the lowest and highest points of single tooth contact, the transverse and axial contact ratios, the minimum length of the lines of contact and the load sharing ratio for helical gears, the helical overlap factor for low axial contact ratio helicals, the radii of curvature of the profiles at the stress point and the factor I, compared with the value used in your rating.",
    "uses": [
      "Calculate I for a gear pair instead of reading a chart",
      "Check the I used in a pitting rating for a helical or profile-shifted pair",
      "See how face width and helix angle change load sharing"
    ],
    "users": [
      "Gear designers",
      "Mechanical design engineers",
      "Gearbox reviewers"
    ],
    "inputs": {
      "mn": "Normal module of the pair (the transverse module for spur gears), from the gear drawing.",
      "n1": "Number of teeth on the smaller gear of the pair.",
      "n2": "Number of teeth on the larger gear; the method is for external gears only.",
      "phin": "Standard normal pressure angle of the cutting tool, from the drawing.",
      "psi": "Standard helix angle at the reference diameter; enter 0 for spur gears.",
      "F": "Face width over which the teeth are in contact, the narrower of the two gears less any end chamfers.",
      "Cr": "Centre distance at which the gears actually run, from the housing drawing.",
      "do1": "Outside (tip) diameter of the pinion as made, from the drawing or a measurement.",
      "do2": "Outside (tip) diameter of the gear as made.",
      "Iused": "Geometry factor I assumed in your pitting resistance rating, so this tool can confirm it."
    },
    "outputs": [
      "Gear ratio, transverse and operating pressure angles",
      "Line-of-action distances C1 to C6 and the active length",
      "Transverse and axial contact ratios",
      "Minimum length of contact lines and load sharing ratio",
      "Helical overlap factor and radii of curvature",
      "Pitting resistance geometry factor I against the value used"
    ],
    "method": [
      "All lengths are divided by the normal module (unity normal module), as the method requires.",
      "Gear ratio m_G = n₂ ÷ n₁; R₁ = n₁ ÷ (2 cos ψ); transverse pressure angle φ = arctan(tan φn ÷ cos ψ); base radii R_b1 = R₁ cos φ, R_b2 = R_b1 m_G.",
      "Operating pressure angle φr = arccos((R_b2 + R_b1) ÷ C_r); base pitch p_b = 2π R_b1 ÷ n₁; normal base pitch p_N = π cos φn; base helix angle ψ_b = arccos(p_N ÷ p_b).",
      "C₆ = C_r sin φr; C₁ = C₆ − √(R_o2² − R_b2²); C₅ = √(R_o1² − R_b1²); C₂ = C₅ − p_b; C₄ = C₁ + p_b; Z = C₅ − C₁.",
      "Transverse contact ratio m_p = Z ÷ p_b; axial pitch p_x = π ÷ sin ψ; axial contact ratio m_F = F ÷ p_x (0 for spur).",
      "For helicals with m_F > 1: L_min from the fractional parts n_r of m_p and n_a of m_F (case I or II), m_N = F ÷ L_min, radii of curvature at the mean radius R_m1 = ½[R_o1 + (C_r − R_o2)], C_ψ = 1.",
      "For spur gears and helicals with m_F ≤ 1: m_N = 1, radii at the lowest point of single tooth contact ρ₁ = C₂, ρ₂ = C₆ − ρ₁, and C_ψ = [1 − m_F(1 − ρ_m1 ρ_m2 Z ÷ (ρ₁ ρ₂ p_N))]^0.5.",
      "Operating pinion pitch diameter d = 2 C_r ÷ (m_G + 1); I = cos φr C_ψ² ÷ [(1 ÷ ρ₁ + 1 ÷ ρ₂) d m_N].",
      "Example: a 21/55 spur pair at 25° has a contact ratio of 1.4822 and I = 0.12077, against 0.12 used in the rating."
    ],
    "limitations": [
      "External gears only: the handbook prints the curvature sum for external pairs; internal gears need the AGMA standard itself.",
      "Spur gears with a transverse contact ratio above 2 (high contact ratio) are outside this method.",
      "The bending strength geometry factor J is not calculated; the handbook refers to AGMA 908-B89 for it.",
      "Undercut pinions and tip relief change the active profile; check them with the gear maker.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "I scales the contact stress: a larger I means a lower contact stress for the same load, so overestimating I overstates the pitting rating.",
      "For helical gears, longer face width (more axial overlap) raises load sharing and usually raises I."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3286–3289, 3295–3300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fine-pitch-worm-design": {
    "purpose": "Proportions of a fine-pitch worm and wormgear by the American Standard (ANSI B6.9-1977) formulas the handbook gives: lead, worm and wormgear pitch diameters and centre distance from the axial pitch, lead angle, threads and teeth; normal pitch, addendum, whole and working depth, clearance and tooth thickness from the normal pitch; worm and wormgear outside diameters, minimum wormgear face width and the safe minimum threaded length of the worm; the approximate number of threads and the lead angle that give your target centre distance; and checks of the centre distance and worm pitch diameter against your limits.",
    "uses": [
      "Lay out a fine-pitch worm drive for an instrument or small gearbox",
      "Choose threads or lead angle to suit a centre distance",
      "Check worm blank, wormgear blank and threaded length sizes"
    ],
    "users": [
      "Instrument and mechanism designers",
      "Gear designers",
      "Toolmakers"
    ],
    "inputs": {
      "Px": "Axial pitch of the worm, equal to the circular pitch of the wormgear in the central plane; the standard is built on axial pitch.",
      "lam": "Lead angle of the worm thread, normally one of the standard series of fifteen angles from 0.5° to 30°.",
      "n": "Number of threads or starts on the worm; most fine-pitch worms have one or two.",
      "N": "Number of teeth on the wormgear; the ratio is teeth ÷ threads.",
      "Ct": "Centre distance the housing or mechanism needs.",
      "Ctol": "Largest difference from the target centre distance you can accept or take up in the housing.",
      "dmin": "Smallest worm pitch diameter you accept; the handbook gives 0.250 in (6.35 mm) as the minimum recommended.",
      "dmax": "Largest worm pitch diameter you accept; the handbook gives 2.000 in (50.8 mm) as the maximum recommended."
    },
    "outputs": [
      "Lead, ratio and worm and wormgear pitch diameters",
      "Centre distance against the target",
      "Normal pitch, addendum, depths, clearance and tooth thickness",
      "Worm and wormgear outside diameters",
      "Minimum wormgear face width and worm threaded length",
      "Threads and lead angle for the target centre distance"
    ],
    "method": [
      "Lead l = n P_x; worm pitch diameter d = l ÷ (π tan λ); wormgear pitch diameter D = N P_x ÷ π; centre distance C = 0.5(d + D).",
      "Normal pitch P_n = P_x cos λ; addendum a = 0.3183 P_n; whole depth h_t = 0.7003 P_n + 0.002 in (0.0508 mm); working depth h_k = 0.6366 P_n; clearance c = h_t − h_k; tooth thickness t_n = 0.5 P_n.",
      "Worm outside diameter d_o = d + 2a; wormgear outside diameter D_o = 2C − d + 2a.",
      "Minimum wormgear face width F_G = 1.125 √((d_o + 2c)² − (d_o − 4a)²); safe minimum worm threaded length F_W = √(D_o² − D²).",
      "Threads for a target centre distance ≈ 2πC ÷ (P_x (cot λ + m_G)); lead angle for the target with these threads from cot λ = 2πC ÷ (n P_x) − m_G.",
      "Example: 10 threads at 30° and 100 teeth give d = 22.406 mm, D = 129.36 mm and C = 75.884 mm against 76.2 mm, with a 16.995 mm minimum face width."
    ],
    "limitations": [
      "Fine-pitch worm gearing with axes at right angles and non-throated wormgear blanks, as the standard assumes; coarse-pitch power worms follow other proportions.",
      "The 20° cutter gives a slightly larger normal pressure angle on the worm, depending on the worm diameter, lead angle and cutter size; that change is not calculated.",
      "Strength, wear and efficiency are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The lead angle sets the worm diameter for a given lead: a small lead angle gives a large worm, a large one a slender worm.",
      "More threads raise the lead angle and efficiency for the same ratio, but need more wormgear teeth."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3321–3325. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "internal-gear-pin-measurement": {
    "purpose": "Measurement between two pins (or wires) for an internal spur gear with even or odd teeth by the involute function: the pin centre pressure angle from the space width at the pitch circle, the pin centre radius and the dimension between the pins for the standard space width and for the smallest and largest space-width increases allowed for backlash; the space width a measured reading implies; and the diameter at which the pins touch the flanks, checked against the inside and root diameters.",
    "uses": [
      "Set the inspection limits for an internal (ring) gear",
      "Turn a pin reading into the space width actually cut",
      "Check a pin size touches the flanks and not the tooth tips"
    ],
    "users": [
      "Gear inspectors",
      "Quality engineers",
      "Machinists cutting internal gears"
    ],
    "inputs": {
      "m": "Module of the internal gear, from the drawing.",
      "z": "Number of teeth on the internal gear; the method handles even and odd numbers.",
      "phi": "Standard pressure angle of the gear.",
      "Di": "Inside diameter across the tooth tips of the internal gear, from the drawing or a measurement.",
      "Dr": "Diameter at the bottom of the tooth spaces (the root) of the internal gear.",
      "dp": "Diameter of the gauge pins; the handbook's Van Keuren standard for internal gears is 1.44 ÷ diametral pitch, which is 1.44 × module in metric.",
      "eMin": "Least amount the space width at the pitch circle is opened up for backlash, from the gear drawing.",
      "eMax": "Greatest amount the space width is opened up for backlash.",
      "Mmeas": "Dimension measured between the inner sides of the two pins with the pins in opposite (even) or nearly opposite (odd) spaces."
    },
    "outputs": [
      "Pin centre pressure angle and radius",
      "Measurement between pins for the standard space width",
      "Measurement limits for the backlash allowance",
      "Space width and increase implied by the reading",
      "Pin contact diameter against the inside and root diameters"
    ],
    "method": [
      "Pitch diameter D = m z; base diameter D_b = D cos φ; standard space width at the pitch circle e₀ = π m ÷ 2.",
      "Pin centre involute function: inv φ_w = e ÷ D + inv φ − d_p ÷ D_b, with inv x = tan x − x, solved for φ_w.",
      "Pin centre radius R_w = D_b ÷ (2 cos φ_w); between pins M = 2R_w − d_p for even teeth, M = 2R_w cos(90° ÷ z) − d_p for odd teeth.",
      "From a reading: R_w from M, cos φ_w = D_b ÷ (2R_w), e = D(inv φ_w − inv φ + d_p ÷ D_b).",
      "Pins touch the flanks at the diameter 2√(R_b² + (R_b tan φ_w + d_p ÷ 2)²), which must lie between the inside and root diameters.",
      "Example: 60 teeth of module 2 measure 117.33 mm between 2.88 mm pins for the standard space, and 117.44 to 117.6 mm with the backlash allowance."
    ],
    "limitations": [
      "Spur internal gears with involute teeth; helical internal gears need a pin size and correction for the helix.",
      "Pitch and runout errors make readings vary around the gear; measure at several positions.",
      "The pins must be accurate to well within the tolerance; check their size before use.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Opening the space width moves the pins outwards, so the dimension between them grows with the backlash allowance.",
      "For odd teeth the pins are not quite opposite, so the reading is smaller than for an even-tooth gear of the same size."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2226–2230. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wire-rope-sheave-drum-check": {
    "purpose": "Check of a wire rope on its sheaves and drum by the handbook formulas: the radial pressure the rope exerts on the sheave tread from the tension, tread diameter and rope diameter against the allowable pressure for the sheave material; the bending stress in the outer wires from the rope modulus, wire diameter and sheave diameter, the rope's metal area and the equivalent bending load that adds to the direct tension; the factor of the rope's minimum breaking force over the tension plus bending load; and the length of rope a flanged drum or reel holds from its barrel, flange and width and the rope factor K.",
    "uses": [
      "Check a sheave or drum material against rope pressure",
      "Allow for bending when checking a rope around small sheaves",
      "Find whether a drum or reel holds the length of rope needed"
    ],
    "users": [
      "Lifting equipment designers",
      "Maintenance engineers",
      "Riggers and crane technicians"
    ],
    "inputs": {
      "d": "Nominal diameter of the wire rope, from the rope certificate.",
      "kw": "Diameter of an outer wire divided by the rope diameter; the handbook gives typical values by construction, for example 0.063 for 6 × 19 rope.",
      "Qa": "Factor that gives the rope's metal area as Q × d², which depends on the construction and core; the handbook lists values, for example 0.405 for 6 × 19 fibre core.",
      "E": "Modulus of elasticity of the rope as a whole, lower than that of the wire; the handbook gives 69 000 to 97 000 MPa (10 to 14 million psi) with 83 000 MPa often used.",
      "T": "Direct tension in the rope where it runs over the sheave, including the load and any reeving friction.",
      "MBF": "Minimum breaking force of the rope, from the rope certificate or maker's catalogue.",
      "SFreq": "Least factor of safety your application, code or standard requires for the rope.",
      "Ds": "Diameter of the sheave or drum at the bottom of the groove, where the rope bears.",
      "pAllow": "Largest radial pressure recommended for the sheave or drum material and rope type, from the handbook's table or the sheave maker.",
      "Dd": "Diameter of the drum or reel barrel the first layer winds on.",
      "Hf": "Outside diameter of the drum or reel flanges.",
      "B": "Clear width between the flanges.",
      "Y": "Depth of the flange you leave unfilled to keep the rope from spilling over; zero for a full drum.",
      "K": "Factor from the handbook's drum and reel capacity table for the rope size, in feet of rope per cubic inch of winding space as tabulated; the tool converts units.",
      "Lreq": "Length of rope the drum or reel must store, including dead wraps."
    },
    "outputs": [
      "Radial pressure on the sheave against the allowable",
      "Outer wire diameter, bending stress, metal area and equivalent bending load",
      "Factor against breaking on tension plus bending load",
      "Drum winding depth and rope capacity against the length needed",
      "Sheave-to-rope diameter ratio"
    ],
    "method": [
      "Radial pressure p = 2T ÷ (D d), with D the tread diameter and d the rope diameter.",
      "Outer wire diameter d_w = share × d; bending stress s_b = E d_w ÷ D; metal area A = Q d²; equivalent bending load P_b = s_b A.",
      "Factor against breaking = minimum breaking force ÷ (T + P_b).",
      "Winding depth A = (H − D − 2Y) ÷ 2; rope length L = (A + D) × A × B × K with dimensions in inches and L in feet, converted to metres.",
      "Example: 2.7556 MPa on the sheave against 3.4 MPa; bending adds 10.095 kN, leaving a factor of 6.7887, and the drum holds 780.56 m."
    ],
    "limitations": [
      "The drum capacity assumes even winding with the same number of wraps in each layer; uneven winding or spooling tension changes it.",
      "Allowable pressures, rope factors and moduli vary with rope construction, lay and condition; take them from the rope and sheave makers where you can.",
      "Fatigue life of the rope over sheaves is not estimated.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Radial pressure falls in proportion to sheave diameter, so a larger sheave protects both the groove and the rope.",
      "Bending load can be a large share of the tension on small sheaves; it is why rope makers set minimum sheave-to-rope ratios."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3432–3435. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shock-stress-check": {
    "purpose": "Stress produced by a shock load by the handbook formulas: a weight dropped through a height onto a simply supported beam at its centre, a cantilever at its free end, a beam fixed at both ends at its centre, or a helical spring of round or square wire; the static stress and deflection under the weight, the stress from the full formula p = p_s(1 + √(1 + 2h ÷ y)) and the approximate value for large drops; or, for a body moving horizontally, the approximate stress with its kinetic energy in place of weight × height; checked against your allowable stress.",
    "uses": [
      "Check a beam, stop or buffer spring for a dropped load",
      "Estimate the stress when a moving carriage hits a stop",
      "Compare round and square wire springs for shock"
    ],
    "users": [
      "Machine designers",
      "Structural and mechanical engineers",
      "Safety reviewers"
    ],
    "inputs": {
      "member": "The member that takes the shock and how it is supported; springs are close-coiled helical springs.",
      "load": "Whether a weight falls onto the member, or a body moves horizontally into it so only its kinetic energy acts.",
      "L": "Distance between supports, or the cantilever length to the point struck.",
      "I": "Second moment of area of the beam section about its bending axis.",
      "a": "Distance from the neutral axis to the outermost fibre, for example half the depth of a symmetrical section.",
      "E": "Elastic modulus of the beam material, from the material data.",
      "Dm": "Mean diameter of the spring coils (outside diameter less one wire diameter).",
      "dw": "Wire diameter of a round-wire spring, or the side of a square-wire spring.",
      "n": "Number of active coils that deflect under load.",
      "G": "Shear modulus of the spring material, from the material data.",
      "M": "Mass of the body that falls or moves into the member.",
      "h": "Height the weight falls before it touches the member.",
      "vel": "Horizontal speed of the moving body at impact (used for the moving-body shock only).",
      "Sallow": "Largest stress you allow in the member under the shock, from your material data and design code."
    },
    "outputs": [
      "Shock energy",
      "Static stress and deflection under the weight",
      "Peak stress by the full formula and the approximation",
      "Impact factor (peak ÷ static stress)",
      "Peak stress against the allowable"
    ],
    "method": [
      "Weight Q = M g with g = 9.81 m/s²; energy Q h for a drop, ½ M v² for a moving body (Qh = 1000 × ½ M v² N·mm).",
      "Beams: static stress p_s = Q a L ÷ (k I) and static deflection y = 2 Q L³ ÷ (c E I), with k = 4, 1, 8 and c = 96, 6, 384 for simply supported, cantilever and fixed-ended beams; peak p = p_s(1 + √(1 + c h E I ÷ (Q L³))) = p_s(1 + √(1 + 2h ÷ y)); approximately p = a √(6 Q h E ÷ (L I)).",
      "Round-wire springs: f_s = 8QD ÷ (π d³); f = f_s(1 + √(1 + G h d⁴ ÷ (4 Q D³ n))); approximately f = 1.27 √(Q h G ÷ (D d² n)).",
      "Square-wire springs: f_s = 9QD ÷ (4d³); f = f_s(1 + √(1 + G h d⁴ ÷ (0.9π Q D³ n))); approximately f = 1.34 √(Q h G ÷ (D d² n)).",
      "For a body moving horizontally the approximate formula is used with ½ M v² in place of Q h.",
      "Example: 20 kg dropped 50 mm onto the beam gives a peak stress of 59.734 MPa, 202.89 times the static stress, against 300 MPa allowed."
    ],
    "limitations": [
      "The member is assumed to take all the shock energy elastically, with no loss at impact and no mass of its own; the result is an upper bound, as the handbook notes.",
      "Spring stresses are the uncorrected torsional stresses the handbook gives; the curvature (Wahl) factor raises the stress at the coil inside.",
      "Local stresses at the point of impact and yielding are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A load dropped from zero height still doubles the static stress: the impact factor is never below 2.",
      "The approximate formula shows the stress rises with the square root of the energy, so halving the drop height lowers the stress by about 30 %."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 278–280. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thin-ring-load-check": {
    "purpose": "Stresses and deflections of a thin ring loaded by two equal and opposite forces across a diameter, by the handbook formulas: the maximum bending stress S = P D d ÷ (4π I) at the load points for a round, rectangular or other section, the increase of the diameter along the load and the decrease across it, the load that brings the stress to your allowable value, and checks of the stress and diameter change against your limits.",
    "uses": [
      "Check a ring, link, collar or band loaded across a diameter",
      "Estimate how much a ring goes oval under a pinch load",
      "Find the load a ring can take at an allowable stress"
    ],
    "users": [
      "Machine designers",
      "Mechanical engineers",
      "Tooling designers"
    ],
    "inputs": {
      "sec": "Shape of the bar the ring is made from; for other sections enter the second moment of area and radial depth.",
      "D": "Diameter of the ring measured to the centre of the bar section.",
      "d": "Diameter of a round bar, or the depth of the section measured radially (in the plane of the ring).",
      "b": "Width of a rectangular section along the ring's axis.",
      "Iu": "Second moment of area of the section about the axis that bends in the plane of the ring (used for other sections only).",
      "E": "Elastic modulus of the ring material, from the material data.",
      "P": "Each of the two equal and opposite forces acting across the diameter.",
      "Sallow": "Largest bending stress you allow in the ring, from your material data and design code.",
      "dMax": "Largest increase or decrease of a diameter your fit or clearance can accept."
    },
    "outputs": [
      "Second moment of area of the section",
      "Maximum bending stress at the load points",
      "Increase of the diameter along the load and decrease across it",
      "Load at the allowable stress",
      "Section depth as a share of the diameter"
    ],
    "method": [
      "Second moment of area: π d⁴ ÷ 64 for a round bar, b d³ ÷ 12 for a rectangular bar.",
      "Maximum bending stress S = P D d ÷ (4π I); for a round bar this is S = 1.621 P D ÷ d³, or P = 0.617 S d³ ÷ D.",
      "Increase of the diameter along the load = (π ÷ 4 − 2 ÷ π) P R³ ÷ (E I) with R = D ÷ 2, which the handbook gives as 0.0186 P D³ ÷ (E I).",
      "Decrease of the diameter across the load = (2 ÷ π − 1 ÷ 2) P R³ ÷ (E I), about 92 % of the increase as the handbook states.",
      "Load at the allowable stress = 4π I S_allow ÷ (D d).",
      "Example: 3000 N across a 200 mm ring of 20 mm bar gives 121.59 MPa and opens the loaded diameter by 0.28415 mm; the ring takes 3,701.1 N at 150 MPa."
    ],
    "limitations": [
      "Thin rings only: the section depth must be small compared with the diameter, as the handbook states; thick rings need curved-beam theory.",
      "Direct and shear stresses at the load points, and local contact stress, are not included.",
      "Linear elastic material; the ring must not yield or buckle.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stress grows with the ring diameter and falls with the cube of the bar size, so a slightly thicker bar helps a great deal.",
      "A ring flexes far more than a straight bar of the same length: the diameter change grows with the cube of the diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 219–220. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
