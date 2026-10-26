// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook47).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "melt-furnace-batch-plan": {
    "purpose": "Plan of a batch melting furnace: heat to raise the charge to its melting point, melt it and superheat to pouring temperature, energy drawn at the furnace efficiency and melt time at its power (as the melting energy tool), the cycle with charging and tapping time, melts and metal per shift against the demand, energy per tonne and energy cost per kilogram.",
    "uses": [
      "Plan a foundry’s daily melting",
      "Check whether a furnace can meet a casting schedule",
      "Estimate melting energy cost per kilogram"
    ],
    "users": [
      "Foundry engineers",
      "Production planners",
      "Energy managers"
    ],
    "inputs": {
      "mass": "Mass of metal charged per melt.",
      "T0": "Temperature of the charge.",
      "Tm": "Melting point (or liquidus) of the alloy.",
      "Tp": "Temperature at which the metal is tapped and poured.",
      "cs": "Mean specific heat of the solid.",
      "L": "Latent heat of fusion of the alloy.",
      "cl": "Specific heat of the liquid.",
      "P": "Power input of the furnace.",
      "eff": "Share of input energy that goes into the metal.",
      "price": "Price of the energy.",
      "tap": "Time per melt for charging, skimming, sampling and tapping.",
      "shift": "Length of a shift.",
      "demand": "Molten metal the moulding line needs per shift."
    },
    "outputs": [
      "Energy into the metal and drawn from the supply",
      "Melt time, cycle and melts per shift",
      "Metal per shift, energy per tonne and cost per kilogram"
    ],
    "method": [
      "Q = m [c_s (T_m − T₀) + L + c_l (T_p − T_m)]; energy drawn = Q ÷ efficiency; melt time = drawn ÷ power (as the melting energy tool).",
      "Cycle = melt time + charge and tap time; melts per shift = ⌊shift ÷ cycle⌋; metal per shift = melts × charge.",
      "Energy per tonne = drawn ÷ mass × 1000; cost per kilogram = drawn × price ÷ mass.",
      "Example: each 500 kg melt takes 57.989 min; 6 melts give 3,000 kg a shift at 0.12081 per kg."
    ],
    "limitations": [
      "Average properties; holding losses between melts and slag are not included.",
      "Furnace efficiency varies with lining condition and charge make-up.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Charging and tapping time often limits output more than melting power: keep it short."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–374, 1404–1420. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vickers-test-check": {
    "purpose": "Evaluation of a Vickers hardness test from two indentation diagonals: mean diagonal, hardness HV and indentation depth, the least specimen or layer thickness of 1.5 diagonals (as the Vickers–Knoop hardness tool), the difference between the diagonals, and checks of thickness, edge distance and spacing as multiples of the diagonal (your rules), diagonal difference and the specification range.",
    "uses": [
      "Check a Vickers result before reporting it",
      "Check whether a thin case or coating can be tested",
      "Screen heat-treated parts for hardness"
    ],
    "users": [
      "Test laboratory technicians",
      "Quality inspectors",
      "Materials engineers"
    ],
    "inputs": {
      "F": "Test force in kilograms-force (HV10 = 10 kgf).",
      "d1": "First diagonal of the indentation.",
      "d2": "Second diagonal, at right angles.",
      "thick": "Thickness of the specimen or of the hardened layer tested.",
      "edge": "Distance from the indentation centre to the nearest edge.",
      "space": "Distance to the centre of the nearest other indentation.",
      "kEdge": "Least edge distance as a multiple of the mean diagonal (from your test standard).",
      "kSpace": "Least spacing as a multiple of the mean diagonal (from your test standard).",
      "diffMax": "Largest difference between the two diagonals you accept (a larger difference suggests a tilted surface).",
      "hvMin": "Lowest hardness the specification allows.",
      "hvMax": "Highest hardness the specification allows."
    },
    "outputs": [
      "Mean diagonal, hardness and depth",
      "Validity checks",
      "Specification check"
    ],
    "method": [
      "Mean diagonal d = (d₁ + d₂) ÷ 2; HV = 1.8544 F ÷ d²; depth ≈ d ÷ 7; least thickness = 1.5 d (as the Vickers–Knoop hardness tool).",
      "Validity: edge ≥ k × d; spacing ≥ k × d; diagonal difference = |d₁ − d₂| ÷ d.",
      "Specification: HV within the limits.",
      "Example: d = 0.301 mm gives 204.68 HV10; the test meets the validity rules."
    ],
    "limitations": [
      "Diagonal measurement accuracy dominates at low loads.",
      "Rules for thickness, spacing and edge distance differ between standards and materials.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the layer is too thin for the load, use a lower force so the indentation stays within the layer."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1406–1412. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 6507-1 Metallic materials — Vickers hardness test — Part 1: Test method"
    ]
  },
  "gear-mesh-interference-check": {
    "purpose": "Check of a standard spur gear pair for tip-to-root interference: the diameter on each gear where contact begins (the start of active profile) from the mating gear’s outside diameter (as the spur contact diameters tool), compared with the true involute form diameter each gear actually has after cutting, the margin above it and above the base circle, and the transverse contact ratio from the outside diameters (as the contact ratio tool for standard gears).",
    "uses": [
      "Check a pinion for interference with a large gear",
      "Set the form diameter on a gear drawing",
      "Check the effect of a reduced outside diameter"
    ],
    "users": [
      "Gear engineers",
      "Design engineers",
      "Gear inspectors"
    ],
    "inputs": {
      "m": "Module of both gears.",
      "z1": "Teeth on the pinion.",
      "z2": "Teeth on the gear.",
      "phi": "Pressure angle.",
      "do1": "Actual outside diameter of the pinion (0 for standard m(z + 2)).",
      "do2": "Actual outside diameter of the gear (0 for standard).",
      "tif1": "Diameter on the pinion below which the tooth is no longer a true involute (from the cutting tool or drawing).",
      "tif2": "True involute form diameter on the gear.",
      "epsMin": "Least transverse contact ratio you accept."
    },
    "outputs": [
      "Contact start diameter on each gear",
      "Margin over the form diameter and base circle",
      "Contact ratio"
    ],
    "method": [
      "From the mating outside diameter, the roll angle at the start of contact gives the start-of-active-profile diameter on each gear (as the spur contact diameters tool).",
      "No interference if the start diameter is at or above the true involute form diameter (and above the base circle).",
      "Contact ratio ε = [√(r_a1² − r_b1²) + √(r_a2² − r_b2²) − a sin φ] ÷ (π m cos φ) with a = m (z₁ + z₂) ÷ 2.",
      "Example: contact starts at 18.878 mm on the pinion (form 18.5 mm) and 38.67 mm on the gear (form 38.3 mm); contact ratio 1.6352."
    ],
    "limitations": [
      "Standard centre distance and unshifted teeth; shifted gears need the working pressure angle.",
      "Tip rounding and chamfers reduce the effective outside diameter.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If contact starts below the form diameter, reduce the mating outside diameter or use a profile shift."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2155–2157, 2131–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "finish-turning-setup": {
    "purpose": "Set-up of a finish-turning pass: the feed for a target Ra from the nose radius (as the feed for finish tool) or the Ra of a feed you choose, spindle speed from the cutting speed held to the machine maximum, cutting time for the pass (as the turning time tool), and the Z and X compensation and the profile error for a chamfer or taper at your angle if nose-radius compensation is not used (as the nose radius compensation tool).",
    "uses": [
      "Set feeds for a finishing pass",
      "Check a chamfer error before enabling compensation",
      "Estimate finishing time"
    ],
    "users": [
      "CNC machinists",
      "CNC programmers",
      "Process planners"
    ],
    "inputs": {
      "R": "Nose radius of the finishing insert.",
      "RaT": "Surface roughness the drawing requires.",
      "fCh": "Feed you intend to program; 0 uses the feed for the target Ra.",
      "vc": "Cutting speed for finishing.",
      "D": "Diameter being finished.",
      "L": "Length of the finishing pass.",
      "appr": "Extra travel for approach and run-out.",
      "nmax": "Highest spindle speed.",
      "ang": "Angle of the chamfer or taper to the axis that the tool also cuts.",
      "errMax": "Largest error on the chamfer or taper you accept without nose-radius compensation."
    },
    "outputs": [
      "Feed for the target and Ra at the feed used",
      "Spindle speed and finishing time",
      "Nose-radius compensation and profile error"
    ],
    "method": [
      "Ra ≈ 0.0316 f² ÷ R (in µm with f and R in mm × 1000), so f = √(Ra R ÷ 31.55) (as the feed for finish tool); R_t = f² ÷ 8R.",
      "n = min(1000 v_c ÷ π D, n_max); time = (L + approach) ÷ (f n) (as the turning time tool).",
      "For angle θ: ΔZ = r [1 − tan(θ ÷ 2)], ΔX = r [1 − tan((90° − θ) ÷ 2)]; profile error = r (sin θ + cos θ − 1) (as the nose radius compensation tool).",
      "Example: Ra 1.6 µm with r 0.8 mm needs 0.20141 mm/rev; the pass takes 15.348 s; uncompensated, the 45° chamfer is off by 0.33137 mm."
    ],
    "limitations": [
      "Theoretical finish; vibration, built-up edge and wear make it rougher.",
      "Straight chamfers and tapers; arcs need full compensation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger nose radius allows a higher feed for the same finish but raises cutting forces and chatter risk."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1125–1131, 782–790. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "coolant-tank-maintenance": {
    "purpose": "Maintenance plan for a water-mixed metalworking fluid sump: concentration from the refractometer reading and the product factor, the concentrate or water to add to bring it to target (as the refractometer concentration tool), the make-up mix strength that holds the target when water evaporates and mixed fluid is dragged out on chips and parts, the daily make-up volume, and concentrate use and cost per month.",
    "uses": [
      "Correct a machine sump to its target concentration",
      "Set the make-up mix ratio",
      "Budget coolant concentrate use"
    ],
    "users": [
      "Machine operators",
      "Maintenance technicians",
      "Production supervisors"
    ],
    "inputs": {
      "brix": "Reading on the refractometer scale.",
      "factor": "Refractometer factor of the coolant product (from its data sheet).",
      "target": "Concentration the supplier recommends for the work.",
      "volume": "Working volume of fluid in the sump.",
      "evap": "Water lost by evaporation each day (only water leaves).",
      "drag": "Mixed fluid carried away on chips, parts and leaks each day.",
      "days": "Working days per month.",
      "price": "Price of the concentrate.",
      "tol": "Plus-or-minus deviation from target you accept before correcting (as a share of the target)."
    },
    "outputs": [
      "Actual concentration and the correction to make",
      "Make-up mix strength and daily volume",
      "Concentrate use and cost per month"
    ],
    "method": [
      "Concentration = reading × factor; correction to the target (as the refractometer concentration tool).",
      "Steady make-up strength c_m = target × drag-out ÷ (drag-out + evaporation), because only water evaporates.",
      "Daily make-up = drag-out + evaporation; concentrate per day = make-up × c_m; per month = per day × days.",
      "Example: 4 °Brix is 6.4%; add 2.5806 L of concentrate; top up with a 2.3333% mix, using 7.7 L of concentrate a month."
    ],
    "limitations": [
      "Uniform losses; tramp oil raises refractometer readings and must be removed first.",
      "Concentration correction assumes undiluted concentrate or clean water is added.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Topping up with neat water lets the concentration fall with drag-out; with neat concentrate it climbs as water evaporates."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1176–1181. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "compound-angle-sine-setup": {
    "purpose": "Set-up of a compound (double) sine plate for a surface sloping in two perpendicular directions: true compound angle and its direction (as the compound angle tool), the lower plate angle equal to the first slope, the upper plate angle measured in the tilted plane, tan B′ = tan B cos A, the stack heights for each plate (as the sine bar tool), the stacks rounded to the block set, and the check of each plate angle against its limit.",
    "uses": [
      "Set up a compound sine plate for grinding or inspection",
      "Convert drawing slopes to a true angle",
      "Check whether a compound angle is within a plate’s range"
    ],
    "users": [
      "Toolmakers",
      "Inspectors",
      "Machinists"
    ],
    "inputs": {
      "A": "Angle of the surface from horizontal seen in one vertical plane (the lower plate axis).",
      "B": "Angle of the surface from horizontal in the vertical plane at right angles (the upper plate axis).",
      "L1": "Distance between the rollers of the lower plate.",
      "L2": "Distance between the rollers of the upper plate.",
      "res": "Smallest step the gauge-block set can build.",
      "maxAng": "Largest angle you set on one plate (sine plates lose accuracy above about 45°)."
    },
    "outputs": [
      "True compound angle and direction",
      "Plate angles and stack heights",
      "Rounded stacks and angle checks"
    ],
    "method": [
      "True angle = tan⁻¹ √(tan² A + tan² B); direction = tan⁻¹(tan B ÷ tan A) (as the compound angle tool).",
      "Lower plate set to A; upper plate set to B′ with tan B′ = tan B cos A.",
      "Stack height H = L sin(angle) (as the sine bar tool), rounded to the block set resolution.",
      "Example: 20° and 30° make a true 34.314° slope; set the lower plate with 68.404 mm and the upper with 95.374 mm (B′ = 28.481°)."
    ],
    "limitations": [
      "Both slopes must be measured from horizontal in vertical planes at right angles.",
      "Plate, roller and stack errors add as for a single sine bar.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The upper plate angle is always smaller than the drawing slope B, because the lower plate already tilts its frame."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 119–121, 676–682. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "dovetail-inspection": {
    "purpose": "Inspection of a male or female dovetail with two precision rods: the reading over or between the rods for the nominal width and at both width limits (as the dovetail measurement tool), the width worked back from your measured reading, whether the rods contact the flanks within the dovetail depth, and accept or reject against the width tolerance.",
    "uses": [
      "Inspect a dovetail slide or gib",
      "Put reading limits on a drawing",
      "Check whether the chosen rod size is suitable"
    ],
    "users": [
      "Inspectors",
      "Toolmakers",
      "Machinists"
    ],
    "inputs": {
      "type": "Male tongue (measure over rods) or female slot (measure between rods).",
      "angle": "Angle between the flank and the base.",
      "width": "Nominal width at the corners where the flanks meet the base.",
      "tolU": "Upper deviation of the width.",
      "tolL": "Lower deviation of the width.",
      "rod": "Diameter of the two rods.",
      "depth": "Depth of the dovetail (the rods must touch the flanks within it).",
      "Mmeas": "Micrometer reading over (or between) the rods."
    },
    "outputs": [
      "Reading at nominal and at the width limits",
      "Width from the measured reading",
      "Rod contact and the decision"
    ],
    "method": [
      "Rod factor k = 1 + cot(angle ÷ 2); reading = width + rod × k (male) or width − rod × k (female) (as the dovetail measurement tool).",
      "Width from a reading = reading − rod × k (male) or reading + rod × k (female).",
      "Rod contact height = (rod ÷ 2) cot(angle ÷ 2) sin(angle), which must be below the depth.",
      "Example: the reading should lie between 77.271 and 77.371 mm; 77.33 mm means a width of 50.009 mm."
    ],
    "limitations": [
      "Sharp corners at the base; corner radii or reliefs do not affect the rod reading but do affect the width definition.",
      "Rod diameter errors enter the result multiplied by the rod factor.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose rods that touch the flanks near mid-depth: too small and burrs at the base interfere, too large and they ride over the top."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 682. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-tooth-caliper-setting": {
    "purpose": "Gear tooth vernier (caliper) settings for a spur gear thinned for backlash: arc tooth thickness reduced for this gear’s share of the normal backlash range, chordal thickness and chordal addendum at both limits (as the chordal tooth tool), the depth setting corrected for the measured tip diameter, and accept or reject of the measured chordal thickness.",
    "uses": [
      "Set a gear tooth vernier for a cut gear",
      "Convert a backlash requirement into tooth thickness limits",
      "Inspect a gear on the machine"
    ],
    "users": [
      "Gear cutters",
      "Inspectors",
      "Machinists"
    ],
    "inputs": {
      "m": "Module.",
      "z": "Number of teeth.",
      "alpha": "Pressure angle.",
      "jnMin": "Smallest normal backlash the pair must have.",
      "jnMax": "Largest normal backlash the pair may have.",
      "share": "How much of the backlash comes from thinning this gear.",
      "tipMeas": "Measured outside diameter of the gear (the caliper depth is set from the tip); 0 uses the nominal tip diameter.",
      "tcMeas": "Chordal thickness read on the vernier."
    },
    "outputs": [
      "Arc tooth thickness limits",
      "Chordal thickness and depth settings",
      "Accept or reject"
    ],
    "method": [
      "Thinning Δs = share × j_n ÷ cos α; arc thickness s = π m ÷ 2 − Δs at each backlash limit.",
      "Chordal thickness t_c = D sin(s ÷ D); chordal addendum a_c = m + D ÷ 2 [1 − cos(s ÷ D)] with D = m z (as the chordal tooth tool).",
      "Depth setting = chordal addendum + (measured tip − nominal tip) ÷ 2.",
      "Example: set the depth to 3.06 mm; the chordal thickness should read 4.6252–4.6677 mm."
    ],
    "limitations": [
      "Spur gears; for helical gears use the normal module and virtual tooth count.",
      "Vernier readings are less accurate than span or over-pins measurement.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Always correct the depth setting for the actual tip diameter: a large tip error changes the thickness read."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2145, 2238–2240. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "perforated-plate-design": {
    "purpose": "Design of a perforated sheet: the hole diameter for a target open area at a pitch for 60° staggered or straight rows, open area, holes per square metre and sheet mass for the hole you choose (as the perforated open area tool), punching force for the punches working in one hit with a wear factor (as the punching force tool) against the press, and checks of the ligament and hole size relative to the sheet thickness.",
    "uses": [
      "Specify a perforated screen or guard",
      "Check a perforating tool against the press",
      "Trade hole size and pitch for open area and strength"
    ],
    "users": [
      "Fabrication supervisors",
      "Design engineers",
      "Press tool designers"
    ],
    "inputs": {
      "pattern": "Layout of the holes.",
      "OAt": "Open area the screen or guard needs.",
      "p": "Centre distance between neighbouring holes.",
      "d": "Hole diameter you intend to use.",
      "t": "Sheet thickness.",
      "A": "Area of the perforated sheet.",
      "rho": "Density of the sheet.",
      "nHit": "Number of punches that cut in one press stroke.",
      "tau": "Shear strength of the sheet.",
      "factor": "Allowance for punch and die wear.",
      "press": "Rated capacity of the perforating press.",
      "kLig": "Least ligament width as a multiple of thickness for flatness and strength (your value).",
      "kHole": "Least hole diameter as a multiple of thickness for punch life (your value)."
    },
    "outputs": [
      "Hole size for the target open area",
      "Open area, holes and mass for the hole chosen",
      "Punching force and the ligament and hole checks"
    ],
    "method": [
      "Open area = 90.69 (d ÷ p)² % for 60° staggered or 78.54 (d ÷ p)² % for straight rows; hole for a target = p √(OA ÷ constant) (as the perforated open area tool).",
      "Holes per square metre = 1.1547 ÷ p² (staggered) or 1 ÷ p² (straight); mass = area × thickness × density × (1 − open area).",
      "Force per hit = holes × π d × t × τ × wear factor (as the punching force tool); ligament = p − d.",
      "Example: 35% at a 8 mm pitch needs 4.9699 mm holes; 5 mm gives 35.426% and 169.65 kN per hit of 20 holes."
    ],
    "limitations": [
      "Full field of holes; margins and blank areas reduce the overall open area.",
      "Flat-faced punches; staggered punch lengths lower the peak force.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Narrow ligaments make the sheet distort and the punches break: keep the ligament at least the sheet thickness."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2607–2608, 1338–1346. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
