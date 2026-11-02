// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook40).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "drop-impact-design": {
    "purpose": "Design check of a simply supported or cantilever beam struck by a falling mass: static deflection and stress under the weight, the impact factor 1 + √(1 + 2h ÷ δ_st), dynamic deflection and stress (as the beam impact tool), the equivalent static force, the energy absorbed (matching the impact load tool with the beam’s dynamic deflection as the stopping distance), and the largest drop height that keeps the stress within the allowable.",
    "uses": [
      "Check a beam or platform for dropped loads",
      "Find a safe drop height for a test rig",
      "Compare beam sections for impact"
    ],
    "users": [
      "Design engineers",
      "Structural engineers",
      "Safety engineers"
    ],
    "inputs": {
      "support": "How the beam is supported and where the mass lands.",
      "mass": "Mass that falls onto the beam.",
      "h": "Height the mass falls before touching the beam.",
      "L": "Span between supports, or length of the cantilever.",
      "E": "Elastic modulus of the beam.",
      "I": "Second moment of area of the section.",
      "c": "Distance from the neutral axis to the extreme fibre.",
      "allow": "Allowable stress for impact (often up to yield for an occasional event; your value).",
      "dMax": "Largest dynamic deflection you accept."
    },
    "outputs": [
      "Static deflection, stress and impact factor",
      "Dynamic stress, deflection, equivalent force and energy",
      "Largest safe drop height"
    ],
    "method": [
      "Static deflection δ_st = W L³ ÷ 48EI (simply supported) or W L³ ÷ 3EI (cantilever); static stress from M = W L ÷ 4 or W L.",
      "Impact factor k = 1 + √(1 + 2h ÷ δ_st); dynamic stress and deflection = k × static (as the beam impact tool).",
      "Energy = W (h + δ_d) (as the impact load tool with δ_d as the stopping distance); equivalent static force = k W.",
      "Safe drop height h = δ_st [(k_a − 1)² − 1] ÷ 2 with k_a = allowable ÷ static stress.",
      "Example: 20 kg dropped 100 mm gives an impact factor of 99.946 and 61.258 MPa; it may fall up to 1,691.2 mm."
    ],
    "limitations": [
      "Elastic beam, mass stays in contact, beam mass neglected (conservative for heavy beams).",
      "Local crushing at the contact point is not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A softer beam or a resilient pad lowers the impact factor: stiffness, not just strength, governs impact."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 278, 179–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centerless-grinding-plan": {
    "purpose": "Plan of through-feed centerless grinding: through-feed rate, work rotation speed and parts per minute from the regulating wheel diameter, speed, inclination and slip (as the centerless feed tool), passes for the diametral stock at your stock per pass, parts per hour allowing for the passes, and the regulating-wheel inclination needed to reach a target output, against the largest inclination you use.",
    "uses": [
      "Plan a through-feed centerless job",
      "Set the regulating wheel angle for an output target",
      "Quote centerless grinding of pins or bars"
    ],
    "users": [
      "Grinding machinists",
      "Process planners",
      "Estimators"
    ],
    "inputs": {
      "Dr": "Diameter of the regulating wheel.",
      "nr": "Speed of the regulating wheel.",
      "angle": "Inclination of the regulating wheel, which drives the parts through.",
      "slip": "Share of the theoretical feed actually reached (parts slip against the wheel).",
      "dw": "Diameter of the parts.",
      "L": "Length of each part.",
      "gap": "Space between parts as they feed end to end.",
      "stock": "Total stock to remove on the diameter.",
      "perPass": "Stock removed in one pass through the machine (on the diameter; your value for finish and roundness).",
      "target": "Parts per hour you need.",
      "angMax": "Largest regulating-wheel inclination you would use (roundness and finish suffer at high angles)."
    },
    "outputs": [
      "Through-feed rate, work speed and parts per minute",
      "Passes and parts per hour",
      "Inclination needed for the target"
    ],
    "method": [
      "Through-feed f = π D_r n_r sin α × efficiency; work speed = D_r n_r cos α ÷ d_w; parts per minute = f ÷ (L + gap) (as the centerless feed tool).",
      "Passes = stock ÷ stock per pass (rounded up); parts per hour = parts per minute × 60 ÷ passes.",
      "Inclination for the target: sin α = target × (L + gap) × passes ÷ 60 ÷ (π D_r n_r × efficiency).",
      "Example: 1,562 mm/min through-feed and 4 passes give 275.64 parts per hour; 250 per hour needs 2.7207°."
    ],
    "limitations": [
      "Continuous end-to-end feeding; loading gaps and dressing reduce output.",
      "Feed efficiency must be confirmed on the machine.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising regulating-wheel speed raises output without changing the angle, but it also raises work speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1259–1261. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sawing-plan": {
    "purpose": "Plan of a bandsaw cut-off job: section area and cutting time per cut from the cutting rate in area per minute (as the bandsaw time tool), cuts per hour with handling, pieces per bar after kerf and end allowance, bars needed, blades used from the blade life in area cut, blade changes, total time against the hours available, and cost per cut from machine time and blades.",
    "uses": [
      "Plan a cut-off batch for a shift",
      "Quote sawing cost per piece",
      "Work out bar stock to order"
    ],
    "users": [
      "Saw operators",
      "Estimators",
      "Production planners"
    ],
    "inputs": {
      "shape": "Shape of the bar.",
      "a": "Diameter of a round bar or tube, or width of a rectangular bar.",
      "b": "Height of a rectangular bar, or wall thickness of a tube.",
      "rate": "Area the saw cuts per minute in this material (from the saw maker or your records).",
      "handle": "Time to index the bar, clamp and unclamp per cut.",
      "cuts": "Number of pieces to cut.",
      "piece": "Length of each piece.",
      "kerf": "Width of the saw cut.",
      "bar": "Length of the stock bars.",
      "ends": "Unusable length at the bar ends (squaring cut and remnant).",
      "life": "Area a blade cuts before it needs changing (your records).",
      "bladeCost": "Price of a blade.",
      "change": "Time to change a blade.",
      "rateH": "Machine plus operator rate.",
      "avail": "Time available to finish the batch."
    },
    "outputs": [
      "Area, time per cut and cuts per hour",
      "Pieces per bar and bars needed",
      "Blades, total time and cost per cut"
    ],
    "method": [
      "Area: π a² ÷ 4 (round), a b (rectangle), π [a² − (a − 2b)²] ÷ 4 (tube); time per cut = area ÷ rate (as the bandsaw time tool).",
      "Pieces per bar = ⌊(bar − ends) ÷ (piece + kerf)⌋; bars = cuts ÷ pieces per bar (rounded up).",
      "Blades used = cuts × area ÷ life; blade changes = blades used rounded up − 1.",
      "Total time = cuts × (cut time + handling) + changes × change time; cost per cut = (rate × time + blades × price) ÷ cuts.",
      "Example: 200 cuts take 8.7117 h using 9 bars and 3.1416 blades; each cut costs about 3.556."
    ],
    "limitations": [
      "Constant cutting rate; blade wear slows the last cuts on each blade.",
      "Bundle cutting of several bars at once is not modelled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "On large sections blade cost can rival machine time: a better blade often pays for itself."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1182–1192. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "motor-load-assessment": {
    "purpose": "Assessment of a three-phase induction motor: rated line current, input power and torque from the nameplate (as the motor power tool), synchronous speed, slip and the load estimated from measured against rated slip (as the motor slip tool), the estimated output, torque and current at that load, the yearly energy and cost, and checks for overload and for an oversized (lightly loaded) motor.",
    "uses": [
      "Check whether a motor is overloaded or oversized",
      "Estimate running cost of a motor",
      "Find torque at the operating point"
    ],
    "users": [
      "Maintenance engineers",
      "Energy managers",
      "Electrical engineers"
    ],
    "inputs": {
      "V": "Line-to-line supply voltage.",
      "kW": "Rated shaft output from the nameplate.",
      "pf": "Power factor at rated load from the nameplate.",
      "eff": "Efficiency at rated load from the nameplate.",
      "f": "Supply frequency.",
      "poles": "Number of poles (sets synchronous speed).",
      "nRated": "Full-load speed from the nameplate.",
      "n": "Speed measured in service (tachometer or strobe).",
      "hours": "Hours the motor runs each year.",
      "price": "Price of electricity.",
      "loMin": "Load share below which you treat the motor as oversized (your value)."
    },
    "outputs": [
      "Rated current, input and torque",
      "Slip and estimated load",
      "Estimated output, current, torque and energy cost"
    ],
    "method": [
      "Rated current I = P ÷ (√3 V pf η); rated torque = 9549 P ÷ n (as the motor power tool).",
      "Synchronous speed n_s = 120 f ÷ poles; slip = (n_s − n) ÷ n_s; load ≈ measured slip ÷ rated slip (as the motor slip tool).",
      "Output ≈ load × rated output; input ≈ output ÷ η (rated efficiency assumed); torque = 9549 × output ÷ n.",
      "Current at part load estimated as load × rated current (an upper bound at light load, where the magnetising current dominates).",
      "Example: 1475 rpm means about 62.5% load: 6.875 kW and 44.509 N·m, costing 7,554.9 a year."
    ],
    "limitations": [
      "The slip method is approximate (±20%), and voltage and temperature change the slip.",
      "Efficiency and power factor fall at light load; measure input power for accuracy.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A motor running under about 40% load wastes energy in poor power factor and efficiency: consider a smaller motor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolted-joint-temperature": {
    "purpose": "Preload change in a bolted joint when bolt and clamped parts expand differently: bolt stiffness from shank and thread lengths, member stiffness by the frustum method (as the bolted joint design check), assembly preload from the share of proof load, the preload change (α_m − α_b) ΔT × grip × k_b k_m ÷ (k_b + k_m), the preload at temperature, and checks against the least clamp force needed and the bolt proof load.",
    "uses": [
      "Check steel bolts in an aluminium housing at temperature",
      "Find whether a joint loosens when cold",
      "Choose assembly preload for a hot joint"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Nominal bolt diameter.",
      "P": "Thread pitch.",
      "Sp": "Proof strength of the bolt grade.",
      "Eb": "Elastic modulus of the bolt.",
      "grip": "Total thickness clamped.",
      "Lt": "Length of thread inside the grip.",
      "Em": "Elastic modulus of the clamped parts (70 aluminium, 207 steel).",
      "pct": "Preload at assembly as a share of the proof load.",
      "ab": "Expansion coefficient of the bolt.",
      "am": "Expansion coefficient of the clamped parts.",
      "dT": "Change from the assembly temperature to the operating temperature (negative for cooling).",
      "Freq": "Least clamp force the joint needs in service (sealing, slip, separation)."
    },
    "outputs": [
      "Bolt and member stiffness",
      "Preload change and preload at temperature",
      "Clamp and proof checks"
    ],
    "method": [
      "k_b = 1 ÷ [(grip − L_t) ÷ (E A_d) + L_t ÷ (E A_t)]; k_m = 0.5774π E_m d ÷ {2 ln[5(0.5774 grip + 0.5d) ÷ (0.5774 grip + 2.5d)]} (as the bolted joint design check).",
      "Assembly preload F_i = share × S_p A_t.",
      "Preload change ΔF = (α_m − α_b) ΔT × grip × k_b k_m ÷ (k_b + k_m).",
      "Preload at temperature = F_i + ΔF, checked against the clamp needed and S_p A_t.",
      "Example: a 60 K change shifts the preload by 7.927 kN, from 35.392 to 43.319 kN."
    ],
    "limitations": [
      "Moduli taken at assembly temperature; they fall at high temperature, and creep or relaxation are not included.",
      "Uniform temperature through bolt and parts; transients can be worse.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Aluminium parts with steel bolts gain preload when hot and lose it when cold: check both extremes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1536, 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-circle-layout": {
    "purpose": "Layout of equally spaced holes on a bolt circle: angular step, adjacent centre chord and the coordinates of each hole (as the bolt circle tool), the ligament between neighbouring holes, edge distances to the outside and bore of the flange, whether the socket or wrench fits between neighbouring bolts, and the most bolts the wrench clearance allows on this circle.",
    "uses": [
      "Lay out a flange or cover bolt pattern",
      "Check a design for wrench access",
      "Program hole positions for drilling"
    ],
    "users": [
      "Design engineers",
      "CNC programmers",
      "Drafters"
    ],
    "inputs": {
      "BCD": "Diameter of the circle through the hole centres.",
      "n": "Number of equally spaced holes.",
      "start": "Angle of the first hole from the X axis, anticlockwise.",
      "dh": "Diameter of the holes.",
      "OD": "Outside diameter of the flange.",
      "ID": "Diameter of the central bore (0 for a solid cover).",
      "wrench": "Outside diameter of the socket or the swing clearance the wrench needs at each bolt.",
      "minLig": "Least metal you accept between neighbouring holes.",
      "minEdge": "Least metal you accept from a hole to the outside or bore edge."
    },
    "outputs": [
      "Angular step, chord and coordinates",
      "Ligament and edge distances",
      "Wrench fit and the most bolts it allows"
    ],
    "method": [
      "Step = 360° ÷ n; chord = BCD sin(180° ÷ n); hole i at (BCD ÷ 2) (cos θ_i, sin θ_i) (as the bolt circle tool).",
      "Ligament = chord − hole diameter; outside edge = (OD − BCD) ÷ 2 − d_h ÷ 2; bore edge = (BCD − ID) ÷ 2 − d_h ÷ 2.",
      "Socket fits if chord ≥ socket diameter; most bolts = ⌊180° ÷ sin⁻¹(socket ÷ BCD)⌋.",
      "Example: 4 holes on 100 mm are 70.711 mm apart with 59.711 mm ligament; up to 12 bolts leave room for the socket."
    ],
    "limitations": [
      "Equally spaced holes; unequal patterns need individual angles.",
      "Coordinates from the bolt circle centre; add the part datum offsets.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Wrench clearance, not ligament, usually limits the number of bolts on small circles."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 686. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tapping-plan": {
    "purpose": "Plan of a tapping operation for a metric thread: the tap drill for a target thread percentage for cut or formed taps and the basic minor diameter (as the tap drill tool), the percentage the drill you actually have gives, spindle speed from tapping speed held to the machine maximum, synchronous feed and forward time (as the tapping feed tool), reverse time at the retract speed multiple, and the batch time.",
    "uses": [
      "Choose a tap drill for strength or tap life",
      "Check a standard drill’s thread percentage",
      "Estimate tapping time for a batch"
    ],
    "users": [
      "CNC machinists",
      "Process planners",
      "CNC programmers"
    ],
    "inputs": {
      "D": "Nominal diameter of the thread.",
      "pitch": "Thread pitch.",
      "pct": "Thread engagement wanted (about 65–75% for cut taps; higher for forming taps).",
      "tap": "Cutting or forming tap (forming taps need a larger hole).",
      "drillHave": "Drill size available; 0 uses the calculated size.",
      "pMin": "Lowest thread percentage you accept (strength).",
      "pMax": "Highest thread percentage you accept (tap breakage, torque).",
      "vc": "Tapping speed for the tap and material.",
      "nmax": "Highest spindle speed for tapping on the machine.",
      "depth": "Depth of full thread.",
      "rev": "Retract speed as a multiple of the forward speed.",
      "other": "Rapid positioning and dwell per hole.",
      "holes": "Number of holes to tap."
    },
    "outputs": [
      "Tap drill for the target and the drill’s actual percentage",
      "Spindle speed and synchronous feed",
      "Time per hole and per batch"
    ],
    "method": [
      "Tap drill = D − k × percentage × P, with k = 0.01299 (cut) or 0.0068 (form) per percent; basic minor diameter = D − 1.0825P (as the tap drill tool).",
      "Percentage given by a drill = (D − drill) ÷ (k P).",
      "n = min(1000 v_c ÷ π D, n_max); feed = P × n; forward time = depth ÷ feed (as the tapping feed tool); retract time = forward time ÷ retract multiple.",
      "Example: 8.5386 mm gives 75%; a 8.5 mm drill gives 76.982%. At 318.31 rpm a batch of 100 takes 8.0457 min."
    ],
    "limitations": [
      "Basic 60° metric thread; hole size in tough or soft materials may need adjusting.",
      "Thread percentage relates to engagement, not directly to strength; 75% gives most of the full strength.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising thread percentage above about 75% adds little strength but much more tapping torque."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2029–2036. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "machine-tipping-stability": {
    "purpose": "Overturning check of a free-standing machine, rack or tank about its tipping edge by moments of forces: restoring moment of the weight about the edge (allowing for a floor slope), overturning moment from a horizontal acceleration at the centre of gravity (seismic, transport or braking) and from a horizontal force at its height, the safety factor against tipping, the acceleration and tilt angle that just tip it, and if the factor is short, the anchor tension per anchor to reach the required factor, against the anchor capacity.",
    "uses": [
      "Check a tall cabinet or machine for tipping",
      "Size floor anchors for a seismic or transport load",
      "Check a load on a forklift or trolley for tipping"
    ],
    "users": [
      "Design engineers",
      "Safety engineers",
      "Plant engineers"
    ],
    "inputs": {
      "mass": "Mass of the machine with its contents.",
      "hcg": "Height of the centre of gravity above the floor.",
      "b": "Horizontal distance from the centre of gravity to the edge it would tip about.",
      "aH": "Sideways acceleration as a share of gravity (seismic coefficient, transport or braking; your value from the code or duty).",
      "Fh": "Extra horizontal push (wind, operator, hose pull).",
      "hF": "Height at which that push acts.",
      "tilt": "Floor slope that leans the machine towards the tipping edge.",
      "req": "Safety factor against tipping you require.",
      "nA": "Number of anchors on the side that lifts.",
      "La": "Distance from the tipping edge to the line of those anchors.",
      "cap": "Allowable tension per anchor (from the anchor maker for the floor)."
    },
    "outputs": [
      "Restoring and overturning moments",
      "Safety factor and the acceleration that tips it",
      "Anchor tension needed against capacity"
    ],
    "method": [
      "Restoring moment M_r = W (b cos θ − h sin θ) on a slope θ.",
      "Overturning moment M_o = W a h + F_h h_F.",
      "Safety factor = M_r ÷ M_o; acceleration to tip = b ÷ h (level floor); tilt to tip = tan⁻¹(b ÷ h).",
      "Anchor tension per anchor = (factor × M_o − M_r) ÷ (anchors × L_a) when the factor is short.",
      "Example: 0.3 g gives a factor of 1.1111; 2 anchors each need 1.7162 kN to reach 1.5."
    ],
    "limitations": [
      "Rigid body tipping about one edge; sliding and dynamic rocking are separate checks.",
      "Anchor capacity must include edge distance and concrete strength.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Lowering the centre of gravity or widening the base helps far more than adding weight."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 167–168, 221–227. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rope-winch-drum": {
    "purpose": "Check of a rope wrapped around a rotating drum or capstan: the tension ratio e^(μθ) for the turns of rope (as the belt friction tool with no groove), the largest load the tail pull can hold, the turns needed for the load, drum torque from the difference of tensions, drive power at the rope speed with the drive efficiency, and the rope safety factor against its breaking load.",
    "uses": [
      "Size a capstan or warping drum",
      "Find how many turns a rope needs on a bollard",
      "Check the drive of a rope haulage winch"
    ],
    "users": [
      "Design engineers",
      "Rigging supervisors",
      "Maintenance engineers"
    ],
    "inputs": {
      "F": "Pull on the load side of the rope.",
      "tail": "Pull applied by hand or a tailing device on the slack side.",
      "mu": "Friction coefficient between rope and drum (about 0.2–0.3 fibre rope on steel; lower when wet or oily).",
      "wraps": "Number of complete turns around the drum.",
      "D": "Diameter of the drum measured to the rope centre.",
      "v": "Speed of the rope.",
      "eta": "Efficiency of the gearing and drive.",
      "MBL": "Minimum breaking load of the rope.",
      "SFreq": "Safety factor on the rope you require (from the lifting or rope standard)."
    },
    "outputs": [
      "Tension ratio and holding capacity",
      "Turns needed for the load",
      "Drum torque, drive power and rope safety factor"
    ],
    "method": [
      "Wrap angle θ = 2π × turns; tension ratio = e^(μθ) (as the belt friction tool with no groove).",
      "Largest load held = tail pull × ratio; turns needed = ln(load ÷ tail) ÷ (2π μ).",
      "Drum torque = (load − tail) × D ÷ 2; power = load × speed ÷ efficiency.",
      "Rope safety factor = breaking load ÷ load.",
      "Example: 3 turns give a ratio of 111.32; 200 N holds up to 22.264 kN. The drum needs 480 N·m and 0.98039 kW."
    ],
    "limitations": [
      "Impending slip with constant friction; rope stiffness and drum fleet angle are not included.",
      "Rope riding up on itself reduces the effective turns.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each extra turn multiplies the holding capacity: friction rises exponentially with wrap."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–168. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
