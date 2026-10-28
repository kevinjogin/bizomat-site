// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook67).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "cylinder-cushion-check": {
    "purpose": "Check of the end cushion of a hydraulic cylinder stopping a moving load at the rod end: the kinetic energy and the deceleration over the cushion length (as the uniform acceleration tool), the force needed to stop the mass plus the drive force still pushing on the full bore and any external load, the pressure in the trapped annulus that this needs, and the highest approach speed the cushion can take at its rated pressure, against the cushion pressure rating.",
    "uses": [
      "Check a cylinder stopping a heavy slide",
      "Find the fastest safe speed into the cushion",
      "Decide whether external shock absorbers are needed"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mass": "Mass of everything moving with the rod, including the rod and piston.",
      "v": "Speed of the piston as it enters the cushion.",
      "sc": "Length of the cushion spear or sleeve.",
      "Fext": "Other force in the direction of motion during cushioning, such as gravity on a falling load (negative if it opposes).",
      "bore": "Cylinder bore.",
      "rod": "Rod diameter (the cushion traps oil in the annulus on extension).",
      "pDrive": "Pressure the pump keeps on the full bore while the cushion acts (relief setting for the worst case).",
      "pRate": "Highest pressure the cylinder maker allows in the cushion."
    },
    "outputs": [
      "Kinetic energy and deceleration",
      "Force to stop and cushion pressure",
      "Largest speed for the cushion rating"
    ],
    "method": [
      "Deceleration a = v² ÷ 2s over the cushion length (as the uniform acceleration tool); kinetic energy ½ m v².",
      "Stopping force = m a + drive pressure × bore area + external force; cushion pressure = force ÷ annulus area.",
      "Largest speed = √(2s (rating × annulus − drive force − external force) ÷ m).",
      "Example: 25 J stopped in 20 mm raises the cushion to 154.44 bar; up to 2.0645 m/s is safe."
    ],
    "limitations": [
      "Uniform deceleration over the cushion; real cushions peak at the start unless they are profiled.",
      "Rigid oil; oil compressibility and hose swell soften the peak a little.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pump pressure on the full bore often adds more cushion pressure than the load itself: dropping the pressure during cushioning helps most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 175–181, 281–286. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-bend-thrust-check": {
    "purpose": "Thrust on an unrestrained pipe bend: the flow velocity in the pipe (as the pipe friction tool), the pressure force and the momentum force of the flow, the resultant thrust bisecting the bend angle, and the bearing pressure of the thrust block on the ground with the block area needed, against the ground’s allowable bearing pressure.",
    "uses": [
      "Size a thrust block for a buried water main bend",
      "Check an anchor at a pump discharge bend",
      "Find the force on a bend during a pressure test"
    ],
    "users": [
      "Civil and water engineers",
      "Pipe fitters",
      "Plant engineers"
    ],
    "inputs": {
      "Q": "Flow through the pipe.",
      "d": "Inside diameter of the pipe.",
      "p": "Internal pressure; use the test pressure, which is usually the worst case.",
      "ang": "Angle through which the pipe changes direction (90 for an elbow).",
      "rho": "Density of the liquid.",
      "Ab": "Area of the block face bearing on undisturbed ground.",
      "qa": "Allowable horizontal bearing pressure of the ground (from a site investigation; soft clays are low)."
    },
    "outputs": [
      "Velocity, pressure and momentum forces",
      "Resultant thrust",
      "Block bearing pressure and area needed"
    ],
    "method": [
      "Velocity v = Q ÷ A (as the pipe friction tool).",
      "Thrust = 2 (p A + ρ Q v) sin (θ ÷ 2), acting along the bisector of the bend, outwards.",
      "Bearing pressure = thrust ÷ block area; area needed = thrust ÷ allowable pressure.",
      "Example: 25.191 kN of thrust; the block bears at 25.191 kPa (needs 0.33588 m²)."
    ],
    "limitations": [
      "Horizontal bend; vertical bends add or subtract the weight of the pipe, water and block.",
      "Static pressure dominates at normal velocities; water hammer surges raise the pressure.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "At normal pipe velocities the momentum part is only about one per cent of the thrust: the test pressure is what matters."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "jet-impact-force-check": {
    "purpose": "Forces from a liquid jet: the flow and jet velocity through the nozzle from its size, discharge coefficient and pressure (as the orifice flow tool), the reaction force on the nozzle, and the force on a flat plate struck by the jet at an angle and possibly moving away from it, against the largest reaction force a hand-held nozzle or mounting should take.",
    "uses": [
      "Check the kick-back of a hand-held cleaning lance",
      "Find the force of a jet on a target or gate",
      "Size the mounting of a fixed spray nozzle"
    ],
    "users": [
      "Process engineers",
      "Safety advisers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Diameter of the nozzle orifice.",
      "Cd": "Discharge coefficient of the nozzle (about 0.95 for a smooth nozzle, 0.6 for a sharp orifice).",
      "dp": "Pressure just upstream of the nozzle.",
      "rho": "Density of the liquid.",
      "beta": "Angle between the jet and the plate surface (90 = jet square to the plate).",
      "u": "Speed at which the plate moves away along the jet (0 for a fixed target).",
      "Rmax": "Largest kick-back force for a hand-held nozzle (from your safety guidance) or rating of the mounting."
    },
    "outputs": [
      "Flow and jet velocity",
      "Nozzle reaction",
      "Force on the plate"
    ],
    "method": [
      "Flow Q = C_d A √(2Δp ÷ ρ); jet velocity = √(2Δp ÷ ρ) (as the orifice flow tool).",
      "Nozzle reaction = ρ Q v.",
      "Force normal to a plate = ρ Q (v − u)² ÷ v × sin β.",
      "Example: 141.57 L/min at 31.623 m/s; 74.613 N reaction and 74.613 N on the plate."
    ],
    "limitations": [
      "Single plate; a series of vanes or a bucket that turns the jet back takes up to twice the force.",
      "Jet treated as coherent up to the plate; long throws break up and lose force.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Reaction force grows in proportion to pressure for a fixed nozzle: doubling the pressure doubles the kick."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spring-clamp-hydraulic-release": {
    "purpose": "Check of a spring-applied, hydraulically released clamp, brake or tool holder: the rate, load and stress of each coil spring at the clamped length (as the compression spring tool), the total clamping force of the springs in parallel, the extra compression and load at the release stroke, the hydraulic pressure on the annular release piston needed with an allowance for seal friction, the spring stress at release and the clearance to solid, against the clamping force needed, the pressure available and the allowable stress.",
    "uses": [
      "Check a fail-safe brake or clamp",
      "Find the release pressure of a spring clamp",
      "Choose the number of springs for a clamping force"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Toolmakers"
    ],
    "inputs": {
      "Fc": "Clamping or braking force the springs must give when clamped.",
      "nS": "Number of identical springs working in parallel.",
      "stroke": "Extra compression of the springs to release the clamp.",
      "d": "Wire diameter of each spring.",
      "D": "Mean coil diameter.",
      "Na": "Active coils.",
      "ends": "End type.",
      "G": "Shear modulus.",
      "L0": "Length of each spring unloaded.",
      "Lw": "Length of each spring when clamped.",
      "allow": "Allowable shear stress.",
      "Do": "Outside diameter of the release piston.",
      "Di": "Inside diameter of an annular piston (0 for a solid piston).",
      "fric": "Extra pressure for seal friction as a share of the spring load.",
      "pAv": "Hydraulic pressure available."
    },
    "outputs": [
      "Spring rate, clamped load and stress",
      "Total clamping force",
      "Release pressure and stress at release"
    ],
    "method": [
      "k = G d⁴ ÷ (8 D³ N_a); load = k (L₀ − L); Wahl-corrected stress (as the compression spring tool).",
      "Clamping force = springs × clamped load; load at release = springs × k (L₀ − L_w + stroke).",
      "Release pressure = load at release × (1 + friction) ÷ piston area.",
      "Example: 3,177.6 N of clamping; 11.01 bar releases it with 422.29 MPa in the springs."
    ],
    "limitations": [
      "Springs share the load equally; uneven spring lengths load some springs more.",
      "Clamping force falls as linings or pads wear and the springs lengthen.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A softer spring with more compression keeps the clamping force steadier as the pads wear, at the cost of a higher release pressure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324, 281–286. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "extraction-duct-check": {
    "purpose": "Check of a local exhaust ventilation duct: the total airflow from the hoods, the duct velocity against the least transport velocity for the dust, the Reynolds number, friction factor and pressure loss in the duct and fittings at the full flow (as the pipe friction tool with air properties), and the fan pressure needed with the hood entry loss, against the fan pressure available.",
    "uses": [
      "Size the main duct for a workshop extraction system",
      "Check a fan before adding a hood",
      "Check dust will not settle in a duct"
    ],
    "users": [
      "Ventilation engineers",
      "Safety advisers",
      "Plant engineers"
    ],
    "inputs": {
      "nH": "Number of hoods or extraction points open at once.",
      "qH": "Airflow each hood needs to capture the contaminant.",
      "d": "Diameter of the main duct.",
      "L": "Length of duct from the furthest hood to the fan.",
      "eps": "Roughness of the duct (galvanised spiral duct about 0.15 mm).",
      "K": "Sum of loss coefficients of bends, junctions and the filter connection.",
      "rho": "Air density.",
      "nu": "Kinematic viscosity of air (about 15 cSt at 20 °C).",
      "vMin": "Least velocity to keep the dust airborne (from your ventilation guidance; heavy dusts need 20 m/s or more).",
      "pHood": "Entry loss of the hood itself.",
      "pFan": "Fan pressure from its curve at the total airflow, less the filter loss."
    },
    "outputs": [
      "Total airflow and duct velocity",
      "Duct pressure loss",
      "Fan pressure needed"
    ],
    "method": [
      "Total airflow = hoods × airflow per hood; velocity = flow ÷ duct area.",
      "Duct loss = (f L ÷ d + ΣK) ρ v² ÷ 2 with f from Colebrook (as the pipe friction tool with air properties).",
      "Fan pressure needed = duct loss + hood entry loss.",
      "Example: 3,200 m³/h at 18.108 m/s; 959.06 Pa in the duct and 1,209.1 Pa in all."
    ],
    "limitations": [
      "Full flow taken over the whole duct length; branches carry less and need their own checks.",
      "Clean duct; dust build-up and a loaded filter raise the loss.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Duct velocity must stay above the transport velocity everywhere, so a duct that is too large is as bad as one that is too small."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gravity-chute-check": {
    "purpose": "Check of a sliding gravity chute or slide: the forces along the slope from the part weight and friction (as the inclined plane tool), the acceleration and whether the part slides at all, the least chute angle to slide, the exit speed and time over the chute length from the entry speed (as the uniform acceleration tool), and the impact energy at the bottom, against the largest exit speed you accept.",
    "uses": [
      "Set the angle of a parts chute",
      "Check parts are not damaged at the bottom of a slide",
      "Find why parts stick in a chute"
    ],
    "users": [
      "Automation engineers",
      "Materials handling engineers",
      "Machine designers"
    ],
    "inputs": {
      "angle": "Slope of the chute from horizontal.",
      "mu": "Friction between the part and the chute surface (lined chutes and rollers are lower).",
      "L": "Length the part slides.",
      "u": "Speed of the part entering the chute.",
      "mass": "Mass of the part (for the impact energy).",
      "vMax": "Fastest the part may arrive without damage or noise."
    },
    "outputs": [
      "Slope and friction forces",
      "Acceleration and least angle",
      "Exit speed, time and impact energy"
    ],
    "method": [
      "Driving force = W (sin θ − μ cos θ) (as the inclined plane tool); acceleration = force ÷ m.",
      "Slides only when tan θ > μ; least angle = atan μ.",
      "Exit speed v = √(u² + 2 a L) and time t = (v − u) ÷ a (as the uniform acceleration tool); impact energy = ½ m v².",
      "Example: 2.3555 m/s² down the chute; 3.7594 m/s at the bottom after 1.596 s (141.33 J)."
    ],
    "limitations": [
      "Sliding friction constant along the chute; damp, oily or worn surfaces change it.",
      "Part slides without rolling or tumbling; air drag ignored.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A few degrees above the friction angle gives a slow, reliable slide; much steeper and the parts arrive too fast."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–171, 175–181. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torque-wrench-adapter-check": {
    "purpose": "Correction of a torque wrench used with an extension adapter: the effective lever length from the wrench length and the adapter length at its angle, the actual torque at the bolt for the wrench setting, the setting that gives the target torque, and the bolt preload and share of proof load from the actual torque with the nut factor (as the bolt torque and preload tool), against the target preload and the largest share of proof load allowed.",
    "uses": [
      "Set a torque wrench used with a crowfoot spanner",
      "Check a bolt tightened through an adapter",
      "Avoid overtightening with extensions"
    ],
    "users": [
      "Fitters",
      "Maintenance technicians",
      "Quality inspectors"
    ],
    "inputs": {
      "Lw": "Length from the centre of the hand grip to the square drive of the wrench.",
      "E": "Length of the adapter or crowfoot from the square drive to the bolt centre.",
      "phi": "Angle between the adapter and the wrench (0 in line, 90 at right angles, 180 folded back).",
      "Tset": "Torque the wrench is set to.",
      "d": "Bolt nominal diameter.",
      "P": "Thread pitch.",
      "K": "Nut factor (about 0.2 dry, 0.15 lubricated).",
      "Sp": "Proof strength of the bolt.",
      "pct": "Preload wanted as a share of proof load.",
      "tol": "How far the preload may be from the target.",
      "pctMax": "Highest preload accepted."
    },
    "outputs": [
      "Effective length and correction",
      "Actual torque and the setting for the target",
      "Preload and share of proof"
    ],
    "method": [
      "Effective length = L_w + E cos φ; actual torque = setting × effective length ÷ L_w.",
      "Setting for the target torque = target × L_w ÷ effective length, with the target torque from the nut factor (as the bolt torque and preload tool).",
      "Preload = actual torque ÷ (K d); share of proof = preload ÷ (S_p A_s) (as the same tool).",
      "Example: the setting gives 91.125 N·m at the bolt; set 80.896 N·m for the target; preload 75.097% of proof."
    ],
    "limitations": [
      "Wrench held at the grip centre; holding it elsewhere changes the effective length.",
      "Nut factor scatter dominates the preload accuracy, adapter or not.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An in-line adapter makes the wrench read low: the bolt gets more torque than the setting unless it is corrected."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "friction-wheel-drive-check": {
    "purpose": "Check of a friction (traction) drive of two cylinders pressed together: the input torque and the tangential force at the driver, the normal force needed to carry it without slip from the friction coefficient and a slip factor, the contact half-width and peak contact pressure of the two cylinders (as the Hertz contact stress tool for line contact), the output speed and the load on the shaft bearings, against the allowable contact pressure.",
    "uses": [
      "Size a friction wheel drive for a feeder or turntable",
      "Check rollers on a friction-driven conveyor",
      "Find the spring force for a roller drive"
    ],
    "users": [
      "Machine designers",
      "Design engineers",
      "Automation engineers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n1": "Speed of the driving roller.",
      "R1": "Radius of the driving roller.",
      "R2": "Radius of the driven roller.",
      "mu": "Friction coefficient between the rollers (dry steel on steel about 0.15; traction fluids less).",
      "SF": "Factor on the normal force against slip.",
      "L": "Width of the contact along the roller axes.",
      "E1": "Elastic modulus of the driver.",
      "nu1": "Poisson’s ratio of the driver.",
      "E2": "Elastic modulus of the driven roller.",
      "nu2": "Poisson’s ratio of the driven roller.",
      "allow": "Allowable peak contact pressure for the roller materials and life."
    },
    "outputs": [
      "Torque and tangential force",
      "Normal force needed and contact stress",
      "Output speed and bearing load"
    ],
    "method": [
      "Driver torque = 9549 P ÷ n; tangential force = torque ÷ R₁.",
      "Normal force = SF × tangential force ÷ μ.",
      "Line contact of two cylinders: half-width b = √(4 F R ÷ (π L E*)), peak pressure 2F ÷ (π b L) (as the Hertz contact stress tool); output speed = n₁ R₁ ÷ R₂.",
      "Example: 318.31 N tangential needs 3,183.1 N pressing force; contact pressure 418.76 MPa."
    ],
    "limitations": [
      "Rigid rollers with a uniform line contact; misalignment concentrates the load at one end.",
      "Creep of about 1–2% lowers the output speed slightly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Friction drives need a pressing force many times the transmitted force, which loads the bearings heavily."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2301–2309, 165–168. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taper-bush-grip-check": {
    "purpose": "Check of a taper-lock (split taper) bush or keyless taper clamp: the preload of each tightening screw from its torque and nut factor and its share of proof load (as the bolt torque and preload tool), the total axial force, the normal force on the taper from the wedge action with friction on the taper face, and the friction torque on the shaft at the bore, against the drive torque from power and speed with a service factor.",
    "uses": [
      "Check a taper bush pulley on a motor shaft",
      "Find the screw torque for a keyless taper clamp",
      "See why a taper bush slips"
    ],
    "users": [
      "Maintenance engineers",
      "Design engineers",
      "Millwrights"
    ],
    "inputs": {
      "nScr": "Number of screws that pull the bush into the hub.",
      "d": "Screw diameter.",
      "P": "Screw pitch.",
      "T": "Torque applied to each screw.",
      "K": "Nut factor for the screw (lubricated or dry).",
      "Sp": "Proof strength of the screws.",
      "alpha": "Half angle of the taper (taper bushes are commonly about 4°–8°).",
      "muT": "Friction between the bush and hub tapers.",
      "Ds": "Diameter of the shaft.",
      "muS": "Friction between the bush bore and the shaft (clean, dry surfaces).",
      "Pw": "Power transmitted.",
      "n": "Shaft speed.",
      "SF": "Factor for starting and shock torque."
    },
    "outputs": [
      "Screw preload and axial force",
      "Normal force and grip torque",
      "Against the drive torque"
    ],
    "method": [
      "Screw preload = T ÷ (K d) (as the bolt torque and preload tool); axial force = screws × preload.",
      "Wedge with friction on the taper: normal force = axial ÷ (sin α + μ_t cos α).",
      "Grip torque = μ_s × normal force × shaft radius; drive torque = 9549 P ÷ n × service factor.",
      "Example: 20 kN axial gives 69.514 kN of grip; 182.47 N·m capacity against 72.443 N·m."
    ],
    "limitations": [
      "Normal force taken as acting fully on the shaft; bush stiffness and the hub fit take some of it.",
      "Clean, oil-free surfaces; oil or grease on the bore greatly reduces the grip.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A smaller taper angle multiplies the grip from the same screws, which is why taper bushes use shallow tapers."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535, 169–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
