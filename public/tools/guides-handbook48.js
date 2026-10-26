// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook48).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "water-line-design-check": {
    "purpose": "Check of a water (or other liquid) supply line: velocity in the bore against your limit and the smallest bore for it (as the pipe size for velocity tool), friction factor and pressure drop through the pipe and fittings (as the pipe friction tool), pressure left at the outlet after friction and static lift, and the surge when a valve at the outlet closes in your closing time added to the supply pressure and compared with the rating (as the valve closure surge tool).",
    "uses": [
      "Size a water or coolant supply line in a plant",
      "Check pressure at the far end of a line",
      "Set a safe valve closing time"
    ],
    "users": [
      "Plant engineers",
      "Maintenance engineers",
      "Building services engineers"
    ],
    "inputs": {
      "Q": "Flow the line must carry.",
      "d": "Inside diameter of the pipe.",
      "L": "Length of the pipe from supply to outlet (also the distance to the reflection point for surge).",
      "K": "Sum of loss coefficients for bends, tees and valves.",
      "rise": "Height of the outlet above the supply point (negative if below).",
      "nu": "Kinematic viscosity (about 1 cSt for water at 20 °C).",
      "rho": "Density of the liquid.",
      "eps": "Absolute roughness of the pipe bore.",
      "pS": "Gauge pressure at the supply point.",
      "pMin": "Pressure the outlet equipment needs.",
      "vMax": "Largest velocity you accept (noise, erosion, surge).",
      "rating": "Lowest pressure rating of the pipe, fittings and equipment.",
      "tc": "Time a valve at the outlet takes to close fully.",
      "t": "Wall thickness of the pipe.",
      "E": "Elastic modulus of the pipe material (steel about 200 GPa, copper about 117 GPa).",
      "Kb": "Bulk modulus of the liquid (water about 2.2 GPa)."
    },
    "outputs": [
      "Velocity and the smallest bore for the limit",
      "Friction loss and outlet pressure",
      "Valve closure surge and peak pressure"
    ],
    "method": [
      "Velocity = Q ÷ A; smallest bore = √(4Q ÷ π v_max) (as the pipe size for velocity tool).",
      "Δp = (f L ÷ d + ΣK) ρ v² ÷ 2 with the Colebrook friction factor (as the pipe friction tool); outlet pressure = supply − Δp − ρ g × rise.",
      "Wave speed a = √[(K ÷ ρ) ÷ (1 + K D ÷ E t)]; surge = ρ a v, reduced by 2L ÷ (a t_c) for slow closure (as the valve closure surge tool); peak = supply + surge.",
      "Example: 300 L/min in a 60 mm bore runs at 1.7684 m/s, loses 0.78521 bar and leaves 4.2361 bar at the outlet; closing in 2 s peaks at 8.1178 bar."
    ],
    "limitations": [
      "Steady, single-phase flow; branches and demand diversity are not modelled.",
      "Surge by the rigid-column estimate; long or branched systems need a transient analysis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the surge is too high, close the valve more slowly or reduce the velocity with a larger bore."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-run-expansion-check": {
    "purpose": "Check of a straight pipe run between anchors that heats up: thermal growth, the stress and anchor force if the run were fully restrained (as the thermal stress tool), the displacement the bend or loop leg must take and the leg length needed for the allowable bending stress range (as the pipe expansion loop tool), and for the leg length you have, the bending stress and the anchor force from a guided cantilever, checked against the allowable stress and the anchor load limit.",
    "uses": [
      "Check an expansion loop or L-bend on a steam or hot water line",
      "Estimate anchor loads for the structure",
      "Decide whether bellows are needed"
    ],
    "users": [
      "Piping designers",
      "Plant engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "L": "Length of straight pipe between the fixed anchors.",
      "alpha": "Mean coefficient of thermal expansion over the temperature range.",
      "T1": "Temperature when the pipe is installed.",
      "T2": "Highest operating temperature.",
      "OD": "Outside diameter of the pipe.",
      "wt": "Wall thickness of the pipe.",
      "E": "Elastic modulus of the pipe material.",
      "type": "How the growth is taken up.",
      "leg": "Length of the leg perpendicular to the run that you have room for.",
      "Sa": "Allowable bending stress range from your piping code.",
      "Fallow": "Largest force the anchors and structure may take."
    },
    "outputs": [
      "Growth and fully restrained stress and force",
      "Leg length needed",
      "Stress and anchor force with the leg you have"
    ],
    "method": [
      "Growth = α L ΔT; restrained stress = E α ΔT and force = stress × area (as the thermal stress tool).",
      "Each leg takes δ = growth (L-bend) or growth ÷ 2 (U-loop); leg needed = √(3 E D δ ÷ S_a) (as the pipe expansion loop tool).",
      "With leg ℓ: bending stress = 3 E D δ ÷ ℓ²; anchor force = 12 E I δ ÷ ℓ³ (guided cantilever).",
      "Example: the run grows 90 mm; the leg needs 4,535.9 mm, and with 5000 mm the stress is 123.44 MPa and the anchor force 2.6011 kN."
    ],
    "limitations": [
      "Guided-cantilever estimate; elbow flexibility makes real stresses lower and real forces different.",
      "Friction at guides and supports adds to anchor loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A longer leg cuts both the stress (with ℓ²) and the anchor force (with ℓ³)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–378, 3401–3402. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pivot-pin-retention-check": {
    "purpose": "Check of a pivot pin in a clevis held in by a retaining ring: pin bending and shear, bearing in the eye and fork plates, net tension and tear-out of the eye, each against your allowable (as the clevis pin joint tool), the thrust capacity of the ring in shear and of the groove in yield with your safety factor and the least groove distance from the pin end (as the retaining ring thrust tool), checked against the axial load and the pin projection you have.",
    "uses": [
      "Check a hydraulic cylinder or linkage pivot",
      "Choose a retaining ring for a pin that sees side thrust",
      "Set the pin projection beyond the fork"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "F": "Load carried by the pin across the clevis.",
      "Fax": "Axial force pushing the pin against the retaining ring (side thrust, misalignment).",
      "d": "Pin diameter (also the ring’s shaft diameter).",
      "a": "Thickness of the eye (the middle member).",
      "bf": "Thickness of each fork plate.",
      "g": "Clearance between the eye and each fork plate.",
      "R": "Distance from the eye hole centre to the eye edge in the load direction.",
      "ring": "Kind of retaining ring.",
      "rt": "Thickness of the retaining ring.",
      "dg": "Depth of the ring groove.",
      "contact": "Share of the groove circumference a stamped ring bears on.",
      "ext": "Length of pin from the groove to the pin end.",
      "sbA": "Allowable bending stress of the pin.",
      "tpA": "Allowable shear stress of the pin.",
      "bA": "Allowable bearing stress of the eye and fork.",
      "stA": "Allowable tensile stress of the eye.",
      "tA": "Allowable shear stress of the eye.",
      "Ss": "Shear strength of the ring material.",
      "Sy": "Yield strength of the pin material at the groove.",
      "Sc": "Shear strength of the pin material behind the groove.",
      "K": "Safety factor on the ring thrust capacity."
    },
    "outputs": [
      "Clevis stresses and highest utilisation",
      "Ring and groove thrust capacity",
      "Groove distance from the pin end"
    ],
    "method": [
      "Pin bending moment = F (a + 2b + 4g) ÷ 8; bending, shear, bearing, net tension and tear-out stresses (as the clevis pin joint tool).",
      "Ring shear capacity = π D t S_s ÷ K; groove yield capacity = π D d_g S_y ÷ K × contact; allowable = the smaller (as the retaining ring thrust tool).",
      "Least groove distance from the end = K P ÷ (π D S_c).",
      "Example: the clevis is at 56.023% of its allowables; the ring holds 4.1888 kN axially against 2 kN."
    ],
    "limitations": [
      "Static loads; reversing loads need a fatigue check of the pin and ring.",
      "The groove is assumed outside the fork plates, so it does not weaken the loaded pin section.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Side thrust is often underestimated: a misaligned cylinder can push a pin out with a large share of its force."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735, 1763–1789. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "maintenance-interval-plan": {
    "purpose": "Planned replacement of a wearing component with Weibull failure data: reliability, hazard rate, B10 life and mean life (as the Weibull reliability tool), the interval that gives your target reliability, the age-replacement cost per operating hour (planned cost if it survives, failure cost if not, over the mean running time in the cycle), the interval with the lowest cost, run-to-failure cost per hour, and the yearly saving at the interval used.",
    "uses": [
      "Set a replacement interval for bearings, belts, seals or tools",
      "Decide whether planned replacement is worth it",
      "Show the cost of a chosen interval"
    ],
    "users": [
      "Maintenance engineers",
      "Reliability engineers",
      "Maintenance planners"
    ],
    "inputs": {
      "beta": "Weibull shape from failure data (above 1 means wear-out).",
      "eta": "Weibull characteristic life (63.2% have failed by then).",
      "Cp": "Total cost of replacing the part as planned.",
      "Cf": "Total cost when it fails in service, including downtime and damage.",
      "Rt": "Probability of surviving the interval you want.",
      "Tuse": "Interval you intend to use; 0 uses the lowest-cost interval.",
      "hpy": "Operating hours per year."
    },
    "outputs": [
      "Reliability, B10 life and mean life",
      "Interval for the reliability target and lowest-cost interval",
      "Cost per hour, run-to-failure cost and yearly saving"
    ],
    "method": [
      "R(t) = exp[−(t ÷ η)^β]; B10 = η (−ln 0.9)^(1/β); mean life = η Γ(1 + 1/β) (as the Weibull reliability tool).",
      "Interval for a target R: t = η (−ln R)^(1/β).",
      "Cost per hour C(T) = [C_p R(T) + C_f (1 − R(T))] ÷ ∫₀ᵀ R dt; run to failure = C_f ÷ mean life; the lowest C(T) is found numerically.",
      "Example: replacing every 3,140.4 h costs 0.269 $/h against 0.56353 $/h run to failure; 90% reliability needs 3,252.1 h."
    ],
    "limitations": [
      "Planned replacement restores the part to as-new; no inspection or repair effects.",
      "Weibull parameters must come from failures of the same part in the same duty.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Planned replacement only pays when β is above 1 and a failure costs clearly more than a planned change."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "process-change-trial": {
    "purpose": "Planning and evaluation of a before-and-after trial of a process change: the sample size per group to detect your smallest worthwhile difference at the chosen significance and power (equivalent to the sample size for a mean tool with the margin set for a difference), and the Welch two-sample t-test on the results with p-value and confidence interval (as the two-sample t-test tool), then the decision: improvement confirmed, no proven difference, or made worse, with checks of sample size and practical size of the change.",
    "uses": [
      "Plan a trial of a new tool, material or setting",
      "Decide whether a change really improved the process",
      "Avoid acting on chance differences"
    ],
    "users": [
      "Quality engineers",
      "Process engineers",
      "Continuous improvement leads"
    ],
    "inputs": {
      "sd": "Standard deviation you expect, from process history.",
      "delta": "Smallest change in the mean that would matter to you.",
      "alpha": "Chance you accept of claiming a difference that is not there.",
      "power": "Chance of detecting a real difference of the size you set.",
      "goal": "Whether a lower or a higher result is an improvement.",
      "m1": "Mean of the parts made before the change.",
      "s1": "Standard deviation before the change.",
      "n1": "Parts measured before the change.",
      "m2": "Mean of the parts made after the change.",
      "s2": "Standard deviation after the change.",
      "n2": "Parts measured after the change."
    },
    "outputs": [
      "Sample size per group for the trial",
      "t statistic, p-value and confidence interval",
      "Decision and checks"
    ],
    "method": [
      "n per group = 2 [(z_α/2 + z_β) σ ÷ δ]², rounded up — the same as the sample size for a mean with margin δ ÷ [√2 (1 + z_β ÷ z_α/2)].",
      "Welch t = (x̄₁ − x̄₂) ÷ √(s₁²/n₁ + s₂²/n₂) with Welch–Satterthwaite degrees of freedom; two-sided p-value and confidence interval (as the two-sample t-test tool).",
      "Improvement confirmed if p < α and the difference is in the better direction.",
      "Example: plan 19 parts per group; the trial shows a difference of 2.2 with p = 0.020303."
    ],
    "limitations": [
      "Independent, roughly normal measurements; trends over time within a group invalidate the test.",
      "A significant result shows a difference in means only, not a change in spread.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A difference can be statistically significant yet too small to matter: compare it with the difference you set as worthwhile."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 130–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "timber-order-plan": {
    "purpose": "Plan for a timber order: pieces with a waste allowance, board feet, volume and cost (as the lumber board feet tool), moisture content from an oven-dry test of a sample and the density at that moisture content from the specific gravity (as the wood moisture and density tool), the mass of the order, the deliveries for your vehicle payload, and a check of moisture content against your limit.",
    "uses": [
      "Order timber for crates, pallets, patterns or framing",
      "Check delivered timber is dry enough",
      "Plan delivery loads"
    ],
    "users": [
      "Fabrication supervisors",
      "Buyers",
      "Pattern makers"
    ],
    "inputs": {
      "t": "Thickness of each piece.",
      "w": "Width of each piece.",
      "L": "Length of each piece.",
      "qty": "Pieces the job needs.",
      "waste": "Extra pieces ordered for defects, splits and cutting waste.",
      "pmode": "Whether the price is per cubic metre or per board foot.",
      "price": "Price of the timber.",
      "G": "Specific gravity of the species (oven-dry mass, green volume basis as in the handbook formula).",
      "wet": "Mass of a sample cut from the delivery.",
      "dry": "Mass of the same sample after oven drying.",
      "MCmax": "Highest moisture content you accept for the use.",
      "payload": "Mass one delivery vehicle may carry."
    },
    "outputs": [
      "Pieces ordered, board feet, volume and cost",
      "Moisture content and density",
      "Mass and deliveries"
    ],
    "method": [
      "Pieces ordered = ⌈needed × (1 + waste)⌉; board feet = t(in) × w(in) × L(ft) ÷ 12 per piece; cost by board feet or volume (as the lumber board feet tool).",
      "Moisture content = (wet − dry) ÷ dry; density = 1000 G (1 + M) ÷ (1 + 0.009 G M) with M in % (as the wood moisture and density tool).",
      "Mass = volume × density; deliveries = ⌈mass ÷ payload⌉.",
      "Example: order 220 pieces, 2.1384 m³ for 1,390 $; at 18% moisture it weighs 1,058.3 kg."
    ],
    "limitations": [
      "Nominal sizes as entered; dressed sizes are smaller than sawn.",
      "One sample may not represent the whole delivery: test several pieces.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Timber used above about 19% moisture shrinks and distorts as it dries in service."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 386–387, 3018–3019. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "orifice-restrictor-design": {
    "purpose": "Design of a fixed orifice to limit flow in a hydraulic or lubrication circuit: exact orifice diameter for the target flow at the pressure drop, the diameter rounded to your drill steps or one you choose, the flow it gives and the pressure drop it needs for the target flow (as the orifice flow tool), jet velocity, the power turned to heat and the temperature rise of the oil passing through, checked against your flow tolerance, least orifice size for clogging and temperature rise limit.",
    "uses": [
      "Size a restrictor for a lubrication point or pilot line",
      "Limit cylinder speed with a fixed orifice",
      "Check heat from throttling"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Maintenance technicians"
    ],
    "inputs": {
      "Q": "Flow you want through the restrictor.",
      "dp": "Pressure difference across the restrictor.",
      "Cd": "Discharge coefficient of the orifice (about 0.6–0.7 for a sharp-edged orifice).",
      "rho": "Density of the fluid.",
      "cp": "Specific heat of the fluid (mineral oil about 1.9 kJ/kg·K).",
      "step": "Steps between available drill sizes.",
      "dCh": "Orifice diameter you intend to use; 0 rounds the exact size to the drill step.",
      "tol": "How far the flow may differ from the target.",
      "dMin": "Smallest orifice you accept with your filtration.",
      "dTmax": "Largest temperature rise of the fluid passing through."
    },
    "outputs": [
      "Exact and chosen orifice diameter",
      "Flow at the chosen size and pressure drop for the target",
      "Jet velocity, heat and temperature rise"
    ],
    "method": [
      "Q = C_d A √(2Δp ÷ ρ), so d = √[4Q ÷ (π C_d √(2Δp ÷ ρ))] (as the orifice flow tool).",
      "Chosen d rounded to the drill step; flow at the chosen d and Δp needed for the target flow.",
      "Heat = Δp × Q; temperature rise = Δp ÷ (ρ c_p).",
      "Example: 4 L/min at 70 bar needs 1.0389 mm; a 1 mm hole gives 3.7063 L/min and heats the oil 4.2798 K."
    ],
    "limitations": [
      "Turbulent flow through a sharp-edged orifice; at low Reynolds numbers C_d falls.",
      "Cavitation and flow forces are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Flow changes with the square of the diameter: a 0.1 mm step on a 1 mm hole is about 20% in flow."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "machine-levelling-wedge-check": {
    "purpose": "Check of wedge-type levelling elements under a machine: load on the most heavily loaded wedge from the machine mass and its share, the force to drive the wedge under the load and the force to withdraw it, with friction on both faces (as the wedge force tool), whether the wedge is self-locking, the wedge travel needed for the height adjustment and the lift per millimetre of travel, against the drive force and travel you have.",
    "uses": [
      "Choose levelling wedges for a machine installation",
      "Check that wedges can be adjusted under load",
      "Size a wedge for a fixture or press bed"
    ],
    "users": [
      "Millwrights",
      "Machine installers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mass": "Mass of the machine.",
      "n": "Number of levelling wedges under it.",
      "share": "Share of the total weight on the most heavily loaded wedge (uneven mass distribution).",
      "angle": "Angle of the wedge slope.",
      "mu": "Friction coefficient on both sliding faces.",
      "h": "Total height adjustment needed at the wedge.",
      "travel": "Travel the wedge design allows.",
      "Favail": "Force the adjusting screw or tool can apply to the wedge."
    },
    "outputs": [
      "Load on the worst wedge",
      "Drive and withdraw forces and self-locking",
      "Travel needed and lift per millimetre"
    ],
    "method": [
      "Load on the worst wedge W = mass × g × share.",
      "Drive force = W tan(α + 2φ); withdraw force = W tan(2φ − α); self-locking if 2φ > α, with φ = tan⁻¹ μ (as the wedge force tool).",
      "Travel = height ÷ tan α; lift per millimetre of travel = tan α.",
      "Example: the worst wedge carries 13.729 kN, needs 5,845.2 N to drive and 47.572 mm of travel for 5 mm."
    ],
    "limitations": [
      "Guided wedge with equal friction on both faces; the adjusting screw’s own friction is extra.",
      "Static levelling; vibration can loosen wedges that are only just self-locking.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A smaller wedge angle needs less force and gives finer adjustment, but more travel."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 169–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ramp-winch-pull-check": {
    "purpose": "Check of a winch hauling a load up a ramp: the effective friction from rolling resistance of the wheels (coefficient of rolling resistance ÷ wheel radius, as the rolling resistance tool) or sliding friction on skids, the pull up the slope and the force to hold the load against sliding back (as the inclined plane tool), the power at the haul speed with the winch efficiency, checked against the winch rated pull, its motor power and its brake for the holding force.",
    "uses": [
      "Check a winch for loading a machine onto a trailer",
      "Plan moving a load up a ramp into a building",
      "Decide between skates and skids"
    ],
    "users": [
      "Riggers",
      "Millwrights",
      "Maintenance supervisors"
    ],
    "inputs": {
      "mass": "Mass of the load and its cart or skids.",
      "angle": "Angle of the ramp from horizontal.",
      "mode": "Whether the load rolls on wheels or slides on skids.",
      "f": "Coefficient of rolling resistance (lever arm) for the wheel and floor.",
      "r": "Radius of the wheels or rollers.",
      "mu": "Sliding friction coefficient of skids on the ramp.",
      "v": "Speed the winch hauls at.",
      "eff": "Efficiency of the winch gearing and drum.",
      "rating": "Rated line pull of the winch on the layer used.",
      "Pm": "Rated power of the winch motor."
    },
    "outputs": [
      "Effective friction and pull up the ramp",
      "Holding force against running back",
      "Power at the haul speed"
    ],
    "method": [
      "Effective friction μ_e = f ÷ r on wheels (as the rolling resistance tool) or μ on skids.",
      "Pull = W (sin θ + μ_e cos θ); holding force = W (sin θ − μ_e cos θ) (as the inclined plane tool).",
      "Motor power = pull × speed ÷ efficiency.",
      "Example: hauling 2000 kg up 10° needs 3,560.3 N and 0.89008 kW; released, it needs 3,251.3 N to hold."
    ],
    "limitations": [
      "Steady haul; starting needs extra force for breakaway friction and acceleration.",
      "Rope angle assumed parallel to the ramp.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Wheeled loads almost always run back down a ramp: the winch brake or a second line must hold them."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
