// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook65).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "sluice-gate-lift-check": {
    "purpose": "Check of a vertical sliding gate opened by a screw spindle: the water force on the gate and where it acts (as the hydrostatic force tool), the lifting force from the gate weight and the friction of the seals and guides under that force, the torque to raise the load on the spindle thread and thrust collar and whether the screw holds without a brake (as the power screw torque tool), and the rim effort on the handwheel through any reduction gearing, against your effort limit.",
    "uses": [
      "Check a manual penstock or sluice gate",
      "Size the spindle and handwheel for a channel gate",
      "Decide whether a gearbox or actuator is needed"
    ],
    "users": [
      "Civil and water engineers",
      "Maintenance engineers",
      "Plant engineers"
    ],
    "inputs": {
      "h": "Depth of water against the gate, from the gate bottom.",
      "w": "Width of the gate across the opening.",
      "rho": "Density of the water or liquid.",
      "mGate": "Mass of the gate leaf and the part of the spindle that moves with it.",
      "muS": "Friction between the gate seals and guides and their seats under water load.",
      "dm": "Mean diameter of the spindle thread.",
      "lead": "Lead of the spindle thread.",
      "flank": "Thread form.",
      "mu": "Thread friction.",
      "dc": "Mean diameter of the thrust collar or bearing.",
      "muc": "Collar friction (small for a ball thrust bearing).",
      "Rw": "Radius of the handwheel rim.",
      "gr": "Handwheel turns for one turn of the spindle nut (1 for direct drive).",
      "effG": "Efficiency of any gearing between handwheel and spindle.",
      "Fmax": "Largest rim force one person should apply."
    },
    "outputs": [
      "Water force and its height",
      "Lifting force",
      "Spindle torque and handwheel effort"
    ],
    "method": [
      "Water force = ρ g w h² ÷ 2, acting h ÷ 3 above the bottom (as the hydrostatic force tool).",
      "Lifting force = gate weight + friction coefficient × water force.",
      "Spindle torque to raise (thread and collar) and self-locking (as the power screw torque tool); handwheel effort = torque ÷ (gearing × efficiency) ÷ rim radius.",
      "Example: 23.536 kN of water force; 8,531.8 N to lift; 157.58 N at the handwheel."
    ],
    "limitations": [
      "Gate fully closed with water on one side only; the first crack open, with flow under the gate, can be harder.",
      "Static friction taken as the coefficient given; silt and corrosion raise it a lot.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The water force grows with the square of the depth, so the effort can double for a modest rise in level."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 1921–1928. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ball-detent-check": {
    "purpose": "Check of a spring-loaded ball or plunger detent: the spring rate, preload at the fitted length and stress (as the compression spring tool), the force along the sliding direction to push the ball out of a vee notch from the preload, flank angle and friction (as the wedge force tool with the friction on one face), the spring load and stress when the ball has risen out of the notch, and the clearance to solid, against the release force range you want and the allowable stress.",
    "uses": [
      "Set the holding force of an indexing detent",
      "Choose a spring for a ball plunger",
      "Check a detent that slips or is too stiff"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Product designers"
    ],
    "inputs": {
      "alpha": "Angle of the notch flank measured from the direction of sliding (45° for a 90° vee).",
      "muB": "Friction between the ball and the notch flank.",
      "rise": "How far the ball moves back into its bore to clear the notch.",
      "Fmin": "Least force that should be needed to move out of the detent position.",
      "Fmax": "Most force that should be needed.",
      "d": "Spring wire diameter.",
      "D": "Mean coil diameter.",
      "Na": "Active coils.",
      "ends": "End type of the spring.",
      "G": "Shear modulus.",
      "L0": "Length of the spring with no load.",
      "Lw": "Spring length with the ball seated in the notch.",
      "allow": "Allowable shear stress."
    },
    "outputs": [
      "Spring rate, preload and stress",
      "Release force",
      "Spring load and stress at full rise"
    ],
    "method": [
      "k = G d⁴ ÷ (8 D³ N_a); preload = k (L₀ − L_w); stress with the Wahl factor (as the compression spring tool).",
      "Release force = preload × tan (α + φ) with tan φ = μ (as the wedge force tool with friction on the ball face only).",
      "At full rise the spring is at L_w − rise; its load and stress are checked and the length kept above solid.",
      "Example: 17.209 N preload; 23.283 N to release; 439.11 MPa in the spring at full rise."
    ],
    "limitations": [
      "Release force at the start of the movement; once the ball rides up, the spring load rises and the angle changes.",
      "Ball contact on the flank, not the edge, of the notch.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A steeper notch flank raises the release force far faster than a stiffer spring does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324, 169–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "expansion-vessel-sizing": {
    "purpose": "Sizing of a gas-cushioned (diaphragm or bladder) expansion vessel for a closed liquid system: the expansion volume from the system volume, a mean volumetric expansion coefficient and the temperature rise, the acceptance factor from the pre-charge and final pressures by Boyle’s law at constant temperature (as the gas law tool), the vessel volume needed, and the gas volume left at the final pressure, against the vessel you have.",
    "uses": [
      "Size the expansion vessel for a heating or chilled water loop",
      "Check an existing vessel after adding volume",
      "Set the pre-charge pressure"
    ],
    "users": [
      "Building services engineers",
      "Process engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Vs": "Total volume of liquid in the system (pipes, emitters, boiler or chiller).",
      "T1": "Temperature at which the system is filled.",
      "T2": "Highest temperature the liquid reaches.",
      "beta": "Mean volumetric expansion coefficient over the temperature range (water is about 0.0003 to 0.0007 per kelvin, rising with temperature; glycol mixtures are higher).",
      "p0": "Gas pre-charge of the vessel, normally equal to the static fill pressure at the vessel.",
      "pf": "Highest pressure allowed at the vessel (below the relief valve setting).",
      "patm": "Atmospheric pressure.",
      "Vv": "Nominal volume of the vessel you have."
    },
    "outputs": [
      "Expansion volume",
      "Acceptance factor",
      "Vessel volume needed against the vessel fitted"
    ],
    "method": [
      "Expansion volume V_e = V_s β (T₂ − T₁).",
      "Gas compressed from P₀ to P_f at constant temperature: V₂ = V₁ P₀ ÷ P_f (as the gas law tool, absolute pressures); acceptance factor = (P_f − P₀) ÷ P_f.",
      "Vessel volume = V_e ÷ acceptance factor.",
      "Example: the water expands 14.35 L; with an acceptance factor of 0.42699 the vessel needs 33.608 L."
    ],
    "limitations": [
      "Isothermal gas compression; a hot vessel gas cushion takes slightly less.",
      "No allowance for a water reserve or system leaks; add one for systems that lose water.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising the final pressure or lowering the pre-charge makes the vessel smaller; a high fill pressure makes it much larger."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torque-arm-reaction-check": {
    "purpose": "Check of the torque arm of a shaft-mounted gear reducer: the output torque from power and speed with a service factor, the reaction at the arm anchor from the torque and the arm length, then the pin bending, shear and bearing, the eye net tension and tear-out of the arm’s pin joint (as the clevis pin joint tool), against the allowable stresses.",
    "uses": [
      "Check the torque arm on a conveyor drive",
      "Size the anchor pin and bracket",
      "Check a torque arm after fitting a larger motor"
    ],
    "users": [
      "Maintenance engineers",
      "Design engineers",
      "Millwrights"
    ],
    "inputs": {
      "P": "Rated power of the motor driving the reducer.",
      "n": "Speed of the reducer output shaft.",
      "SF": "Factor for starting torque, shock and jams.",
      "L": "Distance from the shaft centre to the anchor pin, measured perpendicular to the arm’s line of reaction.",
      "d": "Diameter of the anchor pin.",
      "a": "Thickness of the arm’s eye.",
      "bf": "Thickness of each plate of the anchor bracket (fork).",
      "g": "Gap between the eye and each plate.",
      "R": "Distance from the eye hole centre to the end of the arm.",
      "sbA": "Allowable pin bending stress.",
      "tpA": "Allowable pin shear stress.",
      "bA": "Allowable bearing stress.",
      "stA": "Allowable eye net-section tensile stress.",
      "tA": "Allowable eye tear-out shear stress."
    },
    "outputs": [
      "Output torque",
      "Arm reaction",
      "Pin joint stresses and utilisation"
    ],
    "method": [
      "Output torque = 9549 P ÷ n × service factor.",
      "Arm reaction = torque ÷ arm length (taken perpendicular to the arm).",
      "Pin bending, shear, eye and fork bearing, eye net tension and tear-out (as the clevis pin joint tool).",
      "Example: 1,145.9 N·m gives a 3.8197 kN reaction; the joint is at 36.025% of its allowables."
    ],
    "limitations": [
      "Arm perpendicular to the line to the shaft centre; an inclined arm adds a component along the arm.",
      "Reaction from torque only; belt pull or overhung loads on the reducer are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Doubling the arm length halves the anchor reaction; a rubber bush at the anchor cushions starting shocks."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735, 2122–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "traction-hoist-check": {
    "purpose": "Check of a counterweighted traction drive: the counterweight from the car mass and a share of the rated load, the rope tensions on each side with the car full and empty, increased for acceleration, their ratio, the traction the sheave can give from the groove friction and wrap (as the belt friction tool, with the groove angle), and the motor power from the largest out-of-balance load, speed and efficiency, against the motor fitted.",
    "uses": [
      "Check traction on a goods lift or hoist",
      "Choose the counterweight balance",
      "Check motor power for a counterweighted drive"
    ],
    "users": [
      "Lifting engineers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mc": "Mass of the car or platform, its frame and its share of the ropes.",
      "mL": "Rated load.",
      "bal": "Share of the rated load the counterweight balances (40–50% is usual).",
      "acc": "Largest acceleration or emergency braking deceleration.",
      "mu": "Friction between the rope and the sheave groove.",
      "wrap": "Angle of rope wrap on the sheave.",
      "groove": "Included angle of a vee or undercut groove (0 for a round seat).",
      "vr": "Rated rope speed.",
      "eta": "Efficiency of the motor, gearing and sheave.",
      "Pfit": "Rated power of the motor."
    },
    "outputs": [
      "Counterweight and rope tensions",
      "Tension ratios against the traction available",
      "Motor power"
    ],
    "method": [
      "Counterweight = car + balance × rated load.",
      "Tensions = mass × g on each side, with the heavier side × (g + a) ÷ g and the lighter × (g − a) ÷ g; ratio = heavier ÷ lighter, full and empty.",
      "Traction available e^{μ′θ} with μ′ = μ ÷ sin (groove ÷ 2) (as the belt friction tool); motor power = largest out-of-balance × g × speed ÷ efficiency.",
      "Example: counterweight 850 kg; ratios 1.4332 full and 1.5689 empty against 2.5056; motor 3.5024 kW."
    ],
    "limitations": [
      "Rope and compensation weights, and car friction in the guides, are not included.",
      "Static and acceleration traction; buffer impact and safety gear cases are separate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Balancing about half the rated load keeps the ratio about the same full and empty, which makes the best use of the traction."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–168, 2473–2490. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shear-pin-overload-design": {
    "purpose": "Design of a shear pin (breaking pin) through a hub and flange or sprocket: the break torque from the running torque and the overload factor, the pin diameter that shears at that torque from the pin ultimate shear strength, the number of pins and shear planes and the pin circle radius, the break torque and factor with the diameter you choose, and the shear and bearing stresses as a check (as the bolt shear and bearing tool at the break force), against your break factor range and allowable bearing stress.",
    "uses": [
      "Size a shear pin for a conveyor or mixer drive",
      "Check a replacement shear pin",
      "Set the break torque of a sprocket shear pin"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Agricultural machinery engineers"
    ],
    "inputs": {
      "T": "Torque the drive transmits in normal running.",
      "ovl": "Multiple of the running torque at which the pin should break.",
      "np": "Number of shear pins sharing the torque.",
      "planes": "Shear planes per pin (2 when the pin passes through a hub between two flanges).",
      "Rp": "Radius from the shaft centre to the pin centre.",
      "tauU": "Ultimate shear strength of the pin material (test a sample batch; it varies widely).",
      "dCh": "Diameter of the pin you will fit (at the shear plane, often a groove).",
      "fMin": "Least break torque as a multiple of running torque (to avoid nuisance breaks).",
      "fMax": "Largest break torque as a multiple of running torque (to protect the drive).",
      "t": "Thickness of the thinnest hub or flange part the pin bears on.",
      "bA": "Allowable bearing stress of the hub and flange at the break force."
    },
    "outputs": [
      "Break torque and pin diameter needed",
      "Break torque and factor with the chosen pin",
      "Bearing at the break force"
    ],
    "method": [
      "Break torque = running torque × overload factor; break force at the pin circle = torque ÷ radius.",
      "Pin diameter = √(4F ÷ (π × pins × planes × τ_u)); chosen pin break torque = pins × planes × π d² ÷ 4 × τ_u × radius.",
      "Shear and bearing stress at the chosen pin’s break force (as the bolt shear and bearing tool).",
      "Example: a 7.2837 mm pin breaks at 1,000 N·m; the 7.5 mm pin breaks at 1,060.3 N·m (2.1206 × running)."
    ],
    "limitations": [
      "Ultimate shear strength varies between batches; test pins from each batch for a reliable break torque.",
      "Sudden overloads; slow overloads can fatigue and break pins early.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A groove at the shear plane fixes where the pin breaks and makes the break torque more repeatable."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "portable-gantry-check": {
    "purpose": "Check of a portable gantry crane: the section properties of the I-beam (as the section shapes tool), the bending moment, stress and deflection with the load at mid-span (as the beam cases tool for a central point load), the end reaction with the load at one end, the axial force in each splayed leg and its buckling capacity and safety factor (as the column buckling tool for a tubular leg), and the load on each castor, against your allowables.",
    "uses": [
      "Check a workshop gantry for a heavier hoist",
      "Size the beam and legs of a new gantry",
      "Check castor ratings for a gantry"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Fabricators"
    ],
    "inputs": {
      "W": "Rated load plus hoist, trolley and an allowance for dynamic effects.",
      "L": "Span of the beam between the centres of the two A-frames.",
      "H": "Beam depth.",
      "B": "Flange width.",
      "tf": "Flange thickness.",
      "tw": "Web thickness.",
      "E": "Modulus of elasticity.",
      "sA": "Allowable bending stress for the beam.",
      "dlim": "Largest deflection as a fraction of the span.",
      "Hl": "Vertical height of each leg.",
      "beta": "Angle of each leg from vertical in the A-frame.",
      "legOD": "Outside diameter of each leg tube.",
      "legT": "Wall thickness of each leg.",
      "Sy": "Yield strength of the leg.",
      "K": "Effective length factor for the leg ends.",
      "req": "Safety factor against leg buckling you need.",
      "castor": "Load rating of each castor (one under each leg)."
    },
    "outputs": [
      "Beam section, stress and deflection",
      "Leg force and buckling",
      "Castor load"
    ],
    "method": [
      "A, I and Z of the I-beam (as the section shapes tool); M = W L ÷ 4 and deflection W L³ ÷ 48EI at mid-span (as the beam cases tool).",
      "Load at one end: end reaction = W; leg force = W ÷ (2 cos β); leg length = height ÷ cos β; buckling as the column buckling tool.",
      "Castor load = W ÷ 2 (two legs at the loaded end).",
      "Example: beam at 37.505 MPa and 1.6669 mm; legs carry 10,353 N each with a factor of 20.817."
    ],
    "limitations": [
      "Self-weight of beam and frames left out; add it to the load for long or heavy gantries.",
      "In-plane loads only; side loads from moving or pulling the gantry need bracing checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Widening the leg splay makes the gantry steadier but raises the leg force and length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 234–246, 257–277, 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-tie-rod-check": {
    "purpose": "Check of the tie rods of a hydraulic press frame: the press force from the cylinder bore and pressure, matching the bore a cylinder sizing gives for that force (as the hydraulic cylinder sizing tool), the load per rod, the thread tensile stress area and stress (as the metric thread tool), the elastic stretch of each rod over its length, and the nut length needed so the threads do not strip (as the thread engagement tool), against your allowable stress, stretch limit and nut height.",
    "uses": [
      "Check the tie rods of a workshop or moulding press",
      "Size rods and nuts for a new press frame",
      "Check a press after raising the system pressure"
    ],
    "users": [
      "Design engineers",
      "Hydraulic engineers",
      "Toolmakers"
    ],
    "inputs": {
      "bore": "Bore of the press cylinder.",
      "p": "Highest system pressure (relief valve setting).",
      "nRod": "Number of tie rods sharing the load.",
      "d": "Nominal diameter of the rod thread.",
      "P": "Thread pitch.",
      "Lr": "Length of rod between the nuts (the length that stretches).",
      "E": "Modulus of elasticity of the rods.",
      "sA": "Allowable tensile stress on the thread (lower for rods that cycle millions of times).",
      "dMax": "Largest stretch you accept (it shows as frame spring and uneven bolster loading).",
      "mNut": "Length of thread engaged in each nut.",
      "Sub": "Tensile strength of the rod material.",
      "Sun": "Tensile strength of the nut material."
    },
    "outputs": [
      "Press force and load per rod",
      "Thread stress and stretch",
      "Nut engagement needed"
    ],
    "method": [
      "Press force F = p × π D² ÷ 4; the bore that gives F at this pressure (as the hydraulic cylinder sizing tool).",
      "Thread stress area A_s = π ÷ 4 × ((d₂ + d₃) ÷ 2)² (as the metric thread tool); stress = F ÷ (rods × A_s); stretch = (F ÷ rods) L ÷ (E × π d² ÷ 4).",
      "Engagement needed so the nut thread does not strip before the rod (as the thread engagement tool).",
      "Example: 628.32 kN of press force puts 157.08 kN on each rod: 140.14 MPa and 0.85034 mm stretch."
    ],
    "limitations": [
      "Load shared equally by the rods; off-centre work loads some rods more.",
      "Static stress; presses that cycle often need a fatigue check of the thread roots.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pre-tightening the nuts above the press load keeps the frame stiff and the threads out of fatigue."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–286, 1867–1890, 1586–1590. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centrifuge-bowl-check": {
    "purpose": "Check of a thin cylindrical centrifuge bowl: the acceleration at the wall as a multiple of gravity (as the centrifugal force tool), the hoop stress from the spinning shell itself (density × rim speed squared), the pressure the spinning liquid ring puts on the wall, the hoop stress from that pressure (as the thick cylinder tool’s thin-wall value), the total hoop stress, and the highest speed for your allowable stress, since every stress grows with the square of the speed.",
    "uses": [
      "Check a centrifuge bowl before raising the speed",
      "Size the wall of a spinning drum",
      "Find the safe speed limit for a bowl"
    ],
    "users": [
      "Design engineers",
      "Process engineers",
      "Safety engineers"
    ],
    "inputs": {
      "r": "Inside radius of the bowl wall.",
      "t": "Wall thickness of the bowl.",
      "rpm": "Running speed.",
      "rhoS": "Density of the bowl material.",
      "rhoL": "Density of the liquid or slurry.",
      "r0": "Radius of the free liquid surface (the liquid fills the ring from here to the wall; equal to the wall radius when empty).",
      "allow": "Allowable hoop stress for the bowl material, joints and duty."
    },
    "outputs": [
      "Wall acceleration as g",
      "Hoop stress from the shell and from the liquid",
      "Total stress and speed limit"
    ],
    "method": [
      "ω = 2π n ÷ 60; g-level = ω² r ÷ g (as the centrifugal force tool).",
      "Shell self stress = ρ_s v² at the mean wall radius; liquid pressure at the wall p = ρ_l ω² (r² − r₀²) ÷ 2.",
      "Liquid hoop stress = p (D + t) ÷ 2t (the thin-wall value of the thick cylinder tool); speed limit = n √(allowable ÷ total).",
      "Example: 1,118.2 g at the wall; 22.041 + 36.993 = 59.034 MPa; the limit is 2,603 rpm."
    ],
    "limitations": [
      "Thin plain cylinder; perforations in a basket raise the stress and the bowl ends, hubs and joints need their own checks.",
      "Liquid ring only; solids cake in a basket add pressure as a denser ring.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Every stress in a spinning bowl rises with the square of the speed: 10% more speed means 21% more stress."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 187–190, 290–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
