// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook64).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "hinged-flap-cylinder-check": {
    "purpose": "Check of a cylinder raising a hinged flap: the moment of the flap weight about the hinge at each angle through the swing, the cylinder length and its moment arm about the hinge from the base and rod-end pivot positions, the cylinder force needed at each angle and its largest value, the stroke needed, then the extend force, load ratio and smallest bore for that force at the supply pressure (as the pneumatic cylinder force tool), against your load ratio limit and the cylinder stroke.",
    "uses": [
      "Size a cylinder to lift a machine guard or hopper lid",
      "Choose cylinder pivot positions",
      "Check a flap cylinder after adding weight"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mass": "Mass of the flap or lid.",
      "rg": "Distance from the hinge to the flap’s centre of gravity, measured along the flap.",
      "thMax": "Angle the flap swings through, from closed (horizontal).",
      "rc": "Distance from the hinge to the cylinder rod-end pivot, along the flap.",
      "bx": "Horizontal position of the cylinder base pivot from the hinge.",
      "by": "Vertical position of the base pivot (negative below the hinge).",
      "bore": "Cylinder bore.",
      "rod": "Rod diameter.",
      "p": "Supply pressure.",
      "eff": "Share of the theoretical force left after seal friction.",
      "ratio": "Largest share of the theoretical force the load may use (lower for smooth, fast motion).",
      "strokeAv": "Stroke of the cylinder you have."
    },
    "outputs": [
      "Force needed through the swing",
      "Cylinder lengths and stroke",
      "Cylinder force, load ratio and smallest bore"
    ],
    "method": [
      "Weight moment about the hinge = m g r_g cos θ; rod end at (r_c cos θ, r_c sin θ).",
      "Cylinder line from the base pivot to the rod end; moment arm = perpendicular distance from the hinge; force needed = moment ÷ arm, the largest over the swing.",
      "Extend force = p A η; load ratio = force needed ÷ p A; smallest bore = √(4F ÷ (π p × ratio)) (as the pneumatic cylinder force tool).",
      "Example: up to 1,377.5 N needed at 25°; stroke 156.84 mm; load ratio 73.648%."
    ],
    "limitations": [
      "Slow lift; acceleration and cushioning loads are extra.",
      "Flap centre of gravity on the line from the hinge through the rod end.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Moving the rod end further from the hinge cuts the force but lengthens the stroke in proportion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041, 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tank-stand-leg-check": {
    "purpose": "Check of the legs of a vertical cylindrical tank stand: the full volume of the tank (as the tank volume tool), the full weight with the empty tank mass, the load on each leg, the area and least second moment of area of a tubular leg, then the slenderness, Euler or Johnson critical stress and buckling load and the safety factor (as the column buckling tool), against your required factor.",
    "uses": [
      "Check legs for a header or rainwater tank",
      "Size legs for a process tank",
      "See how longer legs reduce the safety factor"
    ],
    "users": [
      "Design engineers",
      "Fabricators",
      "Plant engineers"
    ],
    "inputs": {
      "D": "Inside diameter of the tank.",
      "Ht": "Height of the cylindrical shell up to the full level.",
      "rhoF": "Density of the contents.",
      "mEmpty": "Mass of the empty tank, roof and fittings.",
      "n": "Number of legs sharing the load.",
      "legOD": "Outside diameter of each tubular leg.",
      "legT": "Wall thickness of each leg.",
      "L": "Length of leg between the base and the first brace or the tank.",
      "K": "Effective length factor for the end fixity (1.2 to 2 for legs fixed at the base with little restraint at the top).",
      "E": "Modulus of elasticity of the leg.",
      "Sy": "Yield strength of the leg.",
      "req": "Safety factor against buckling you need."
    },
    "outputs": [
      "Full volume and weight",
      "Load per leg",
      "Leg buckling load and safety factor"
    ],
    "method": [
      "Full volume = π D² H ÷ 4 (as the tank volume tool, vertical and full).",
      "Load per leg = (empty mass + volume × density) g ÷ legs.",
      "Leg A and I of the tube; slenderness K L ÷ r; Euler above C_c, Johnson below; buckling load = σ_cr A (as the column buckling tool).",
      "Example: 1,696.5 L full, 4,772.1 N per leg; legs buckle at 128,690 N (factor 26.967)."
    ],
    "limitations": [
      "Concentric vertical load shared equally; wind, seismic and sloshing loads and an uneven base are not included.",
      "Leg buckling only; leg-to-tank welds and base plates need separate checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cross-bracing the legs halves their unsupported length and roughly quadruples their Euler buckling load."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 68–69, 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "nozzle-manifold-check": {
    "purpose": "Check of a nozzle manifold or spray bar: the flow through each nozzle from its orifice size, discharge coefficient and pressure (as the orifice flow tool), the total flow, the velocity, Reynolds number, friction factor and pressure drop in the feed pipe with fittings taken at the full flow (as the pipe friction tool), and the supply pressure needed, against the pump pressure available and a velocity limit.",
    "uses": [
      "Size the feed pipe for a spray bar",
      "Check a pump for a parts washer",
      "See how many nozzles a supply can feed"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Machine designers"
    ],
    "inputs": {
      "nN": "Number of nozzles on the manifold.",
      "d": "Orifice diameter of each nozzle.",
      "Cd": "Discharge coefficient of the nozzle (from the nozzle maker; about 0.6 for sharp orifices, higher for shaped nozzles).",
      "pN": "Pressure wanted at the nozzles.",
      "rho": "Density of the liquid.",
      "dp": "Inside diameter of the feed pipe.",
      "L": "Length of the feed pipe from the pump to the last nozzle.",
      "nu": "Kinematic viscosity of the liquid (1 cSt for water at 20 °C).",
      "eps": "Absolute roughness of the pipe.",
      "K": "Sum of the loss coefficients of bends, valves and fittings.",
      "pPump": "Pressure the pump gives at this flow.",
      "vMax": "Highest velocity you accept in the feed pipe."
    },
    "outputs": [
      "Flow per nozzle and in total",
      "Feed pipe velocity and pressure drop",
      "Supply pressure against the pump"
    ],
    "method": [
      "Flow per nozzle Q = C_d A √(2Δp ÷ ρ) (as the orifice flow tool); total = nozzles × flow.",
      "Pipe drop = (f L ÷ d + ΣK) ρ v² ÷ 2 with f from Colebrook or 64 ÷ Re (as the pipe friction tool), at the full flow over the whole length.",
      "Supply pressure = nozzle pressure + pipe drop.",
      "Example: 34.629 L/min in total; the pipe loses 0.20881 bar, so 3.2088 bar is needed."
    ],
    "limitations": [
      "Full flow taken over the whole pipe length, which is on the safe side for a manifold that feeds nozzles along its length.",
      "Equal pressure at every nozzle; long manifolds give less at the far end.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Nozzle flow rises only with the square root of pressure: doubling the flow needs four times the pressure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drilling-fixture-clamp-check": {
    "purpose": "Check of the clamping for a drilling operation: spindle speed, cutting and motor power, drill torque and thrust (as the drilling power tool), the tangential force the torque applies at the effective friction radius of the clamped faces, then the total clamping force by friction at the clamps and locators with a safety factor, the force on each strap clamp screw, its tightening torque and tensile stress (as the fixture clamp force tool), against the machine power and the screw proof strength.",
    "uses": [
      "Check clamps on a drilling fixture",
      "Find whether a part will spin under a large drill",
      "Size the strap clamp screws"
    ],
    "users": [
      "Fixture designers",
      "Machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Drill diameter.",
      "vc": "Cutting speed.",
      "fr": "Feed per revolution.",
      "kc": "Specific cutting force for the material.",
      "point": "Drill point angle.",
      "eta": "Machine efficiency.",
      "Pavail": "Spindle motor power.",
      "rf": "Average radius from the drill axis at which the clamp and locator friction acts.",
      "n": "Safety factor on the clamping force.",
      "mu1": "Friction between the clamps and the work.",
      "mu2": "Friction between the work and the locators.",
      "nc": "Number of strap clamps.",
      "A": "Distance from the clamp screw to where the strap presses the work.",
      "B": "Distance from the screw to the heel of the strap.",
      "d": "Clamp screw diameter.",
      "P": "Clamp screw pitch.",
      "K": "Nut factor for the screw torque.",
      "Sp": "Proof strength of the clamp screw."
    },
    "outputs": [
      "Drill speed, power, torque and thrust",
      "Clamping force and force per clamp",
      "Screw force, torque and stress"
    ],
    "method": [
      "n = 1000 v ÷ π D; cutting power = f v D k_c ÷ 240 000; torque = P × 30 000 ÷ π n; thrust from the point angle (as the drilling power tool).",
      "Tangential force = torque ÷ friction radius; clamping force = SF × force ÷ (μ₁ + μ₂); the thrust presses the work onto the locators and is not counted.",
      "Strap clamp screw force = force per clamp × (A + B) ÷ B; torque = K F d; stress on the tensile stress area (as the fixture clamp force tool).",
      "Example: the drill turns the work with 25 N·m; 2,777.8 N of clamping holds it; each screw sees 32.964 MPa."
    ],
    "limitations": [
      "Friction holding only; a stop or pin against rotation takes the torque directly and needs far less clamping.",
      "Steady drilling; breakthrough and a grabbing drill can multiply the torque.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A pin or stop against rotation is far more reliable than friction for large drills."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1089–1093, 3131–3134, 1522–1532. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "conveyor-takeup-plan": {
    "purpose": "Plan of a gravity take-up for a belt conveyor: the load per metre, effective pull and the slack side tension needed to drive without slip (as the conveyor drive sizing tool), the tension needed to keep belt sag between carrying idlers within a percentage of their spacing, the take-up tension as the larger of the two, the counterweight mass for a take-up that carries both belt runs, and the travel for belt stretch over the belt length plus a splice allowance, against the travel available.",
    "uses": [
      "Size the counterweight of a gravity take-up",
      "Check belt sag between idlers",
      "Check take-up travel for a new belt"
    ],
    "users": [
      "Bulk handling engineers",
      "Maintenance engineers",
      "Plant engineers"
    ],
    "inputs": {
      "Q": "Material carried per hour.",
      "v": "Belt speed.",
      "L": "Length between terminal pulley centres.",
      "Hl": "Lift.",
      "qm": "Belt and rotating idler mass per metre, both runs.",
      "f": "Overall friction factor.",
      "mu": "Friction between belt and drive pulley.",
      "wrap": "Wrap on the drive pulley.",
      "D": "Drive pulley diameter.",
      "eta": "Drive efficiency.",
      "marg": "Power margin.",
      "qb": "Mass per metre of the belt itself (one run).",
      "a": "Spacing of the carrying idlers.",
      "sag": "Largest sag between idlers as a share of the spacing (about 1–2%).",
      "elong": "Permanent and elastic stretch of the belt to allow for.",
      "splice": "Extra travel for splicing and fitting the belt.",
      "travelAv": "Travel of the take-up carriage."
    },
    "outputs": [
      "Slack side tension for no slip",
      "Sag tension and take-up tension",
      "Counterweight and travel"
    ],
    "method": [
      "Effective pull T_e and slack side tension T₂ = T_e ÷ (e^{μθ} − 1) (as the conveyor drive sizing tool).",
      "Sag tension = (q_L + q_b) g a ÷ (8 × sag); take-up tension = the larger of T₂ and the sag tension.",
      "Counterweight = 2 × take-up tension ÷ g (both runs); travel = 2L × stretch + splice allowance.",
      "Example: 2,097.5 N at the take-up needs 427.78 kg of counterweight and 1,500 mm of travel."
    ],
    "limitations": [
      "Take-up at or near the drive where the slack side tension is lowest; elsewhere add the resistance between the drive and the take-up.",
      "Sag checked on the carrying side with the belt fully loaded.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "On short, lightly loaded conveyors the sag limit, not slip, usually sets the counterweight."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2487–2512, 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "forklift-load-centre-check": {
    "purpose": "Check of a forklift lift: the combined mass and centre of gravity of up to three items on the forks measured from the fork face (as the combined centre of gravity tool), the capacity at that load centre from the rated capacity and rated load centre by the balance of moments about the front axle, and the sideways offset of the load, against the load mass and an offset limit.",
    "uses": [
      "Check a long or uneven load before lifting",
      "Find the capacity of a forklift at a longer load centre",
      "Arrange items on a pallet to keep within capacity"
    ],
    "users": [
      "Warehouse supervisors",
      "Riggers",
      "Safety advisers"
    ],
    "inputs": {
      "Q": "Rated capacity on the truck’s data plate.",
      "c0": "Load centre at which the rated capacity applies.",
      "Ax": "Distance from the front axle (tipping line) to the fork face.",
      "m1": "Mass of item 1.",
      "x1": "Distance of item 1’s centre of gravity from the fork face.",
      "y1": "Sideways offset of item 1.",
      "m2": "Mass of item 2.",
      "x2": "Distance of item 2’s CG from the fork face.",
      "y2": "Sideways offset of item 2.",
      "m3": "Mass of item 3.",
      "x3": "Distance of item 3’s CG from the fork face.",
      "y3": "Sideways offset of item 3.",
      "yMax": "Largest sideways offset of the combined CG you accept."
    },
    "outputs": [
      "Load mass and centre of gravity",
      "Capacity at that load centre",
      "Load against capacity and offset"
    ],
    "method": [
      "Combined mass and centre of gravity of the items (as the combined centre of gravity tool).",
      "Capacity at load centre c = Q (A + c₀) ÷ (A + c), from moments about the front axle.",
      "Utilisation = load ÷ capacity; sideways offset against the limit.",
      "Example: 1,400 kg with its CG 614.29 mm out; the truck can lift 2,231.5 kg there."
    ],
    "limitations": [
      "Moment balance only; the manufacturer’s capacity plate for the mast height and attachments governs.",
      "Load lifted low and level; tilting and lifting high reduce stability.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Capacity falls as the load centre moves out: a load twice as deep as standard can roughly halve what the truck may lift."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 221–227, 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cylinder-air-consumption-check": {
    "purpose": "Air demand of double-acting pneumatic cylinders: the swept volume of the extend and return strokes with an allowance for dead volume and hoses, the atmospheric air per cycle at the working pressure, the total demand for the number of cylinders and their cycle rate plus a leakage allowance, and the theoretical and shaft power to compress it (as the compressor power tool), against the delivery of the compressor.",
    "uses": [
      "Check a compressor before adding a machine",
      "Estimate the running cost of cylinders",
      "Compare bore sizes on air use"
    ],
    "users": [
      "Automation engineers",
      "Maintenance engineers",
      "Energy managers"
    ],
    "inputs": {
      "bore": "Cylinder bore.",
      "rod": "Rod diameter (the return stroke uses less air).",
      "stroke": "Cylinder stroke.",
      "cpm": "Complete out-and-back cycles per minute of each cylinder.",
      "nCyl": "Number of identical cylinders.",
      "p": "Working pressure.",
      "dead": "Extra volume in ports, cushions and hoses as a share of the swept volume.",
      "leak": "Allowance for leaks across the system.",
      "fad": "Air the compressor delivers at this pressure, measured at atmospheric conditions.",
      "stages": "Number of compression stages.",
      "eff": "Overall compressor efficiency."
    },
    "outputs": [
      "Atmospheric air per cycle",
      "Total demand",
      "Compressor capacity and power"
    ],
    "method": [
      "Swept volume per cycle = (π D² ÷ 4 + π (D² − d²) ÷ 4) × stroke × (1 + dead volume).",
      "Atmospheric air = swept volume × (p + p_atm) ÷ p_atm; demand = free air × cycles × cylinders × (1 + leakage).",
      "Adiabatic and shaft power for the demand at the working pressure (as the compressor power tool).",
      "Example: 5.5014 L of atmospheric air per cycle; 253.06 L/min in total takes 1.4719 kW."
    ],
    "limitations": [
      "Cylinders filled to full pressure every stroke; pressure regulators on the return stroke save air.",
      "Average demand; short peaks need receiver volume.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Air use grows with the square of the bore: one size down can save a third of the air."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "winch-drum-brake-check": {
    "purpose": "Check of the motor-shaft brake of a geared rope winch or hoist: the drum torque from the rope load, the load torque at the brake through the gear ratio with the gear efficiency helping the brake when lowering, the rope speed, the inertia at the brake including the load reflected through the drum and gears, then the stopping time, stop distance, holding factor and energy per stop and per hour (as the holding brake sizing tool, load overhauling), against your stop time and brake ratings.",
    "uses": [
      "Check the brake on a hoist or winch",
      "Find the stop distance of a descending load",
      "Check a brake after a gearbox change"
    ],
    "users": [
      "Lifting engineers",
      "Maintenance engineers",
      "Machine designers"
    ],
    "inputs": {
      "F": "Load on the rope at the drum, including hook and rope.",
      "D": "Drum diameter to the rope centre (use the outer layer for a multi-layer drum).",
      "i": "Total reduction from the motor to the drum.",
      "effG": "Efficiency of the gearing.",
      "nM": "Motor speed when lowering.",
      "Jm": "Inertia of the motor rotor, brake disc and coupling.",
      "Tb": "Dynamic torque rating of the brake.",
      "td": "Time from switching off to the brake gripping.",
      "treq": "Longest acceptable stop time.",
      "SFh": "Brake torque as a multiple of the load torque needed for holding.",
      "Wmax": "Energy the brake may absorb in one stop.",
      "z": "Stops per hour.",
      "Wh": "Energy the brake may absorb per hour."
    },
    "outputs": [
      "Drum torque, load torque at the brake, rope speed",
      "Inertia, stop time and stop distance",
      "Holding factor and brake energy"
    ],
    "method": [
      "Drum torque = F D ÷ 2; load torque at the brake when lowering = drum torque ÷ i × η; rope speed = π D n ÷ (60 i).",
      "Inertia at the brake = J_m + m (D ÷ 2i)² with m = F ÷ g.",
      "Stop time, angle, energy and holding factor with the load driving through the stop (as the holding brake sizing tool); stop distance = brake shaft angle × D ÷ 2i.",
      "Example: 15.938 N·m at the brake; the load stops in 0.22145 s after dropping 77.284 mm."
    ],
    "limitations": [
      "Rigid rope and gearing; rope stretch adds to the stop distance and softens the shock.",
      "Single brake on the motor shaft; a second (load) brake changes the duty.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When lowering, gear losses help the brake; when the gearbox is efficient the brake must do more."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2455–2459, 165–168. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tank-drain-time-check": {
    "purpose": "Drain time of a vertical cylindrical tank through a bottom orifice or short outlet: the volume between the two levels (as the tank volume tool), the outflow at the starting level from the head as a pressure drop (as the orifice flow tool), the time to fall from the starting to the final level with the head falling as the tank empties, and the outlet diameter that would drain it in your time, against the time allowed.",
    "uses": [
      "Find how long a tank takes to drain for cleaning",
      "Size a drain outlet for an emergency dump",
      "Estimate outflow from a tank at a given level"
    ],
    "users": [
      "Process engineers",
      "Plant operators",
      "Maintenance engineers"
    ],
    "inputs": {
      "D": "Inside diameter of the tank.",
      "H1": "Liquid level above the outlet at the start.",
      "H2": "Liquid level above the outlet when draining stops.",
      "d": "Outlet diameter.",
      "Cd": "Discharge coefficient of the outlet (about 0.6 for a sharp orifice, 0.8 for a short pipe).",
      "rho": "Liquid density (for the outflow as a pressure drop).",
      "tMax": "Time the drain must take at most."
    },
    "outputs": [
      "Volume drained",
      "Outflow at the start",
      "Drain time and outlet for the time allowed"
    ],
    "method": [
      "Volume = π D² (H₁ − H₂) ÷ 4 (as the tank volume tool).",
      "Outflow at the start Q = C_d A √(2 Δp ÷ ρ) with Δp = ρ g H₁ (as the orifice flow tool).",
      "Time t = (A_tank ÷ C_d A_outlet) √(2 ÷ g) (√H₁ − √H₂); the outlet for a time t₀ is d √(t ÷ t₀).",
      "Example: 1,583.4 L drains in 26.258 min; a 23.389 mm outlet would meet the time allowed."
    ],
    "limitations": [
      "Unrestricted outflow to air from a tank open at the top; a vented, pumped or piped outlet changes the flow.",
      "Outlet losses taken in the discharge coefficient; long drain pipes need the pipe friction tool.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The last part of the tank drains slowest because the head is lowest; draining fully takes far longer than draining half."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 68–69, 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
