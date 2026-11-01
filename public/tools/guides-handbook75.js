// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook75).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "trepanning-plan": {
    "purpose": "Plan for cutting a large hole by trepanning, which removes only a ring and leaves a solid core, compared with drilling it solid: the spindle speed, the cutting power and torque for the ring from the kerf width, feed, mean cutting speed and specific cutting force, the motor power against the spindle power, the cutting time, the volume removed and the core diameter, mass and value, and the same speed and power for a solid drill of the hole size (as the drilling cycle planner tool).",
    "uses": [
      "Decide between trepanning and solid drilling for a large hole",
      "Check that the machine has the power for the cut",
      "Value the core trepanning leaves"
    ],
    "users": [
      "Machinists",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the hole to be made.",
      "L": "Depth of the hole (the length of the core for a through hole).",
      "w": "Radial width of the groove the trepanning tool cuts, from the tool maker; the core diameter is the hole diameter less twice this.",
      "clear": "Extra travel before and after the cut.",
      "vc": "Cutting speed at the outside of the hole for the tool material and work, from the tool maker or cutting data.",
      "f": "Feed per revolution for the trepanning tool.",
      "fD": "Feed per revolution a solid drill of this size would use, for the comparison.",
      "point": "Point angle of the solid drill, for its travel.",
      "kc": "Specific cutting force for the work material at this chip thickness, from the tool maker or a cutting data handbook.",
      "eta": "Share of motor power that reaches the spindle.",
      "Pav": "Spindle (motor) power the machine can deliver at this speed.",
      "rho": "Density of the work material (steel about 7,850 kg/m³).",
      "price": "What the core is worth: its value as bar stock or scrap, per kilogram."
    },
    "outputs": [
      "Spindle speed and mean cutting speed",
      "Trepanning power, motor power, torque and time",
      "Volume removed, core diameter, mass and value",
      "Solid drilling power and time for comparison"
    ],
    "method": [
      "Spindle speed n = 1000 v_c ÷ (π D); mean cutting speed of the ring v_m = v_c (D − w) ÷ D.",
      "Trepanning cutting power P = k_c w f v_m ÷ 60,000 kW; motor power P ÷ η; torque = P × 30,000 ÷ (π n) N·m; time = (depth + clearance) ÷ (n f).",
      "Core diameter D_c = D − 2w; volume removed = π ÷ 4 (D² − D_c²) L; core mass = ρ π D_c² L ÷ 4.",
      "Solid drill (as the drilling cycle planner tool): P = f_D v_c D k_c ÷ 240,000 kW, time = (depth + point length + clearance) ÷ (n f_D).",
      "Example: trepanning a 60 mm hole needs 2.16 kW at the motor and 3.0041 min, leaving a 48 mm core of 2.1308 kg; a solid drill needs 12.5 kW."
    ],
    "limitations": [
      "Unit-power estimate of the cutting power; feed force, chip evacuation and the stiffness of the long tool are not checked.",
      "The solid drill is taken at the same cutting speed; large drills often run slower, so check its own data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Trepanning removes only the ring, so it needs a fraction of the power of solid drilling and leaves a core worth keeping; it is often the only way to make a large, deep hole on a machine of modest power."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1077–1081, 1084–1092. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grinding-wheel-cost-plan": {
    "purpose": "Plan of grinding wheel use for an external cylindrical grinding job: the stock volume removed from each part, the wheel wear it causes from the grinding ratio (as the grinding geometry tool defines it), the wheel volume taken off by dressing shared over the parts between dressings, the usable wheel volume between the new and the discard diameter, the parts per wheel, the wheel cost and the grinding time cost per part from a specific removal rate, against a target cost per part.",
    "uses": [
      "Estimate grinding wheel cost per part",
      "See how much of the wheel goes in dressing rather than grinding",
      "Compare the effect of a better grinding ratio or less frequent dressing"
    ],
    "users": [
      "Grinding machinists",
      "Process planners",
      "Cost estimators"
    ],
    "inputs": {
      "dw": "Diameter of the part before grinding.",
      "Lw": "Length of the ground diameter.",
      "s": "Material removed on the diameter by grinding.",
      "G": "Grinding ratio for this wheel, work material and conditions: volume of metal removed per volume of wheel worn, measured or from the wheel maker.",
      "D0": "Diameter of a new wheel.",
      "Dmin": "Smallest diameter at which the wheel is discarded (set by the flange size or the lowest safe speed).",
      "b": "Width of the wheel.",
      "ad": "Depth taken off the wheel radius at each dressing.",
      "pd": "Number of parts ground between one dressing and the next.",
      "price": "Price of a new wheel, on the same GST basis as the other costs.",
      "Qp": "Metal removal rate per millimetre of wheel width in contact, from your process or the wheel maker.",
      "spark": "Time per part for spark-out passes, dwell and the approach not covered by the removal rate.",
      "rate": "Hourly cost of the machine and operator.",
      "target": "Grinding cost per part you aim for."
    },
    "outputs": [
      "Stock volume per part and wheel wear from the grinding ratio",
      "Dressing volume per part and share of the wheel lost to dressing",
      "Usable wheel volume, parts per wheel and wheel cost per part",
      "Grinding time and total grinding cost per part"
    ],
    "method": [
      "Stock volume per part V_w = π ÷ 4 (d_w² − (d_w − s)²) L; wheel wear per part = V_w ÷ G (G as defined by the grinding geometry tool).",
      "Dressing volume per part = π D_mean b a_d ÷ parts per dressing, with D_mean the mean of the new and discard diameters.",
      "Usable wheel volume = π ÷ 4 (D₀² − D_min²) b; parts per wheel = usable volume ÷ (wear + dressing) per part.",
      "Grinding time = V_w ÷ (Q′ b) + spark-out; cost per part = wheel price ÷ parts per wheel + time × rate.",
      "Example: each part uses 205.42 mm³ of wheel, 42.822 % of it in dressing; a wheel does 10,705 parts at A$0.042035 each, and the part costs A$1.2208 to grind."
    ],
    "limitations": [
      "The grinding ratio is taken as constant over the wheel's life; it changes with wheel diameter, speed, coolant and dressing.",
      "External cylindrical plunge or traverse grinding with the full wheel width in contact; wheel truing after mounting and breakage are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Dressing often takes as much wheel as grinding does: less frequent or lighter dressing can halve the wheel cost without changing the wheel.",
      "Wheel cost is usually a small part of grinding cost; the time per part dominates."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1196–1199, 1199–1268. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drill-bushing-position-check": {
    "purpose": "Check of hole position from a drill jig: the largest radial clearance between the drill and the bushing bore from their limits and the bushing wear you allow, the tilt the drill can take inside the bushing length, the largest offset of the drill point at the work surface after the gap below the bushing, the resulting position error as a diameter against the position tolerance, and the chip gap as a multiple of the drill diameter against your range.",
    "uses": [
      "Check whether a drill jig can hold a hole position tolerance",
      "Choose the bushing length and the gap below it",
      "Set a wear limit for bushings"
    ],
    "users": [
      "Tool and fixture designers",
      "Quality engineers",
      "Machinists"
    ],
    "inputs": {
      "D": "Nominal diameter of the drill.",
      "drillLo": "Lower deviation of the drill diameter from nominal, from the drill standard (drills are usually made slightly under nominal).",
      "bushUp": "Upper deviation of the bushing bore from nominal, from the bushing standard or drawing.",
      "wear": "How much the bushing bore may wear before it is replaced.",
      "Lb": "Length of the bushing bore that guides the drill.",
      "g": "Distance between the end of the bushing and the surface of the work, left for chips.",
      "wander": "Any further radial wander of the drill point you expect at entry, for example from an uneven surface (0 if none).",
      "T": "Position tolerance for the hole, as the diameter of the tolerance zone from the drawing.",
      "gMin": "Least chip gap your practice allows, as a multiple of the drill diameter.",
      "gMax": "Largest chip gap your practice allows, as a multiple of the drill diameter."
    },
    "outputs": [
      "Largest radial clearance in the bushing",
      "Drill tilt in the bushing",
      "Largest offset at the work surface and position error as a diameter",
      "Chip gap ratio"
    ],
    "method": [
      "Largest radial clearance c = (bushing upper deviation + wear − drill lower deviation) ÷ 2.",
      "Largest tilt of the drill in the bushing ≈ 2c ÷ L_b (it can touch opposite sides at the two ends).",
      "Offset at the work surface e = c + tilt × gap + wander; position error as a diameter = 2e, against the tolerance zone.",
      "Chip gap ratio = gap ÷ D, against your range.",
      "Example: 24 µm of clearance lets the 8 mm drill tilt 3 mm/m, so the hole can start 42 µm off position, an error of 0.084 mm against 0.1 mm."
    ],
    "limitations": [
      "Geometric clearance and tilt only; drill flexure, a skewed work surface and the error of the jig's own bushing positions add to it.",
      "The hole may wander further as it deepens; the check covers the start of the hole at the work surface.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A longer bushing and a smaller gap both cut the tilt error, but the gap is needed for chips: the check shows the trade.",
      "Bushing wear adds directly to the clearance, so a wear limit belongs on the jig's inspection record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3121–3125, 3131–3134. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "woodruff-key-check": {
    "purpose": "Check of a Woodruff (half-moon) key transmitting torque: the force at the shaft surface, the shear stress across the key width over its length (as the parallel key stress tool), the bearing stress on the part of the key standing above the shaft in the hub and on the part sunk in the shaft, the shaft's torsional stress raised by a stress concentration factor for the deep keyseat, all against your allowables, and the least key length for shear and for hub bearing.",
    "uses": [
      "Check a Woodruff key on a small shaft",
      "Find the least key length for the torque",
      "Check that the deep keyseat has not weakened the shaft too much"
    ],
    "users": [
      "Machine designers",
      "Mechanical engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "T": "Largest torque the key transmits, including any service factor you use.",
      "d": "Diameter of the shaft at the key.",
      "w": "Width of the Woodruff key, from the key standard or drawing.",
      "L": "Length of the key where it meets the shaft surface (the chord of the half-moon at the shaft diameter).",
      "h": "Total height of the key.",
      "t1": "Depth of the keyseat in the shaft, which sets how much of the key stands above the shaft into the hub.",
      "tauA": "Allowable shear stress for the key material and duty, from your design standard.",
      "sigA": "Allowable bearing stress for the weakest of the key, hub and shaft materials.",
      "Kt": "Stress concentration factor for torsion at the deep keyseat, from a design reference for this keyseat shape.",
      "tauS": "Allowable torsional shear stress for the shaft material and duty."
    },
    "outputs": [
      "Force at the shaft surface",
      "Key shear stress and least length",
      "Bearing stress in the hub and in the shaft",
      "Shaft torsional stress at the keyseat"
    ],
    "method": [
      "Force at the shaft surface F = 2T ÷ d.",
      "Key shear τ = F ÷ (w L) (as the parallel key stress tool); least length for shear = F ÷ (w τ_a).",
      "Hub bearing σ_h = F ÷ ((h − t₁) L); shaft bearing σ_s = F ÷ (t₁ L); least length for hub bearing = F ÷ ((h − t₁) σ_a).",
      "Shaft torsion τ = K_t × 16T ÷ (π d³), against the shaft allowable.",
      "Example: 60 N·m on a 25 mm shaft gives 4,800 N at the key: 32 MPa shear, 76.8 MPa hub bearing and 39.114 MPa in the shaft."
    ],
    "limitations": [
      "Uniform shear and bearing over the key length; a Woodruff key bears unevenly along its curved seat.",
      "The stress concentration factor is your input; the shaft check covers static torsion, not fatigue.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Only the small height of a Woodruff key above the shaft bears on the hub, so hub bearing usually governs; the deep seat holds the key against tipping but weakens the shaft."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2460–2486, 301. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "eyebolt-lift-check": {
    "purpose": "Check of a two-eyebolt lift with legs at unequal angles to the vertical: the tension in each leg from horizontal and vertical equilibrium (the horizontal pulls are equal and the vertical parts add to the load), the vertical share and the sideways pull on each eyebolt, each tension against the eyebolt's rated vertical load reduced by the share you allow at that leg angle, and the thread engagement as a multiple of the thread diameter against your requirement. Unequal legs show why dividing the load by the number of eyebolts can be unsafe.",
    "uses": [
      "Check eyebolts on a load lifted with unequal sling legs",
      "Find the tension and sideways pull on each eyebolt",
      "Check that each eyebolt is engaged deeply enough"
    ],
    "users": [
      "Riggers and lifting supervisors",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "W": "Mass of the load being lifted, including any attachments.",
      "a1": "Angle of the first sling leg from the vertical, measured at the eyebolt.",
      "a2": "Angle of the second sling leg from the vertical, measured at the eyebolt.",
      "wll": "Working load limit marked on the eyebolt for a straight vertical pull.",
      "s1": "Share of the vertical rating the eyebolt maker allows at leg 1's angle, with the eyebolt correctly seated and aligned in the plane of the pull (from the maker's data).",
      "s2": "Share of the vertical rating the eyebolt maker allows at leg 2's angle (from the maker's data).",
      "dt": "Nominal diameter of the eyebolt thread.",
      "Le": "Length of thread engaged in the tapped hole of the load.",
      "eReq": "Least engagement your practice or the eyebolt maker requires for this load material, as a multiple of the thread diameter."
    },
    "outputs": [
      "Tension in each leg",
      "Vertical share and sideways pull on each eyebolt",
      "Each tension against the eyebolt capacity at its angle",
      "Thread engagement ratio"
    ],
    "method": [
      "Equilibrium of the hook: T₁ sin a₁ = T₂ sin a₂ and T₁ cos a₁ + T₂ cos a₂ = W, giving T₁ = W sin a₂ ÷ sin(a₁ + a₂) and T₂ = W sin a₁ ÷ sin(a₁ + a₂).",
      "Vertical share T cos a; sideways pull T sin a (equal on both eyebolts).",
      "Capacity at the angle = rated vertical load × allowed share; compare each leg tension with its capacity.",
      "Engagement ratio = engaged length ÷ thread diameter, against the requirement.",
      "Example: legs at 45° and 30° carry 517.64 kg and 732.05 kg of a 1000 kg load, with a sideways pull of 366.03 kg on each eyebolt."
    ],
    "limitations": [
      "Two legs meeting at one hook, with the load hanging still; dynamic effects of lifting and stopping are not included.",
      "The allowed share at an angle comes from the eyebolt maker and applies only to eyebolts made for angular loading, fully seated and aligned with the pull.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With unequal legs the steeper leg carries more of the load, so dividing the load by the number of eyebolts understates the heavier one.",
      "Side pull is what bends and breaks eyebolts; plain eyebolts without a shoulder are for vertical lifts only."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2613–2650, 3450. Topic reference; no source tables or recommended settings are reproduced.",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1536–1537. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
