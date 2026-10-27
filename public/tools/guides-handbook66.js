// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook66).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "screw-clamp-force-check": {
    "purpose": "Check of a hand-operated clamping screw: the torque from the handle effort and its radius, the clamping force that torque produces through the thread and the swivel pad or collar friction (the power screw torque relation solved for the load, as the power screw torque tool), the compressive stress at the screw root, and whether the screw stays put, against the clamping force you need and the allowable stress.",
    "uses": [
      "Check a fixture or welding clamp screw",
      "Find the clamping force of a vice",
      "Size the handle for a needed clamping force"
    ],
    "users": [
      "Fixture designers",
      "Toolmakers",
      "Design engineers"
    ],
    "inputs": {
      "Fh": "Force applied at the end of the handle or tommy bar.",
      "rh": "Distance from the screw axis to where the hand pushes.",
      "dm": "Mean diameter of the screw thread.",
      "lead": "Lead of the screw (pitch × starts).",
      "flank": "Thread form.",
      "mu": "Friction in the thread (dry steel about 0.15–0.2, oiled about 0.1).",
      "dc": "Mean diameter of the swivel pad or thrust collar where the screw bears.",
      "muc": "Friction at the pad or collar.",
      "dr": "Root (minor) diameter of the screw.",
      "sA": "Allowable compressive stress in the screw.",
      "Freq": "Clamping force the job needs."
    },
    "outputs": [
      "Handle torque",
      "Clamping force and efficiency",
      "Screw stress and decision"
    ],
    "method": [
      "Torque = handle effort × radius.",
      "Torque to raise load F = F [d_m ÷ 2 × (L + π μ d_m sec α) ÷ (π d_m − μ L sec α) + μ_c d_c ÷ 2] (as the power screw torque tool), solved for F.",
      "Root stress = F ÷ (π d_r² ÷ 4).",
      "Example: 11.25 N·m at the handle gives 6,595.5 N of clamping force and 131.21 MPa in the screw."
    ],
    "limitations": [
      "Static tightening; impact from hammering the handle multiplies the force.",
      "Long, slender screws can buckle; check them as columns.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Most of the handle effort goes into friction: lubricating the thread and pad can nearly double the clamping force."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1921–1928, 2561–2568. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "scissor-lift-screw-check": {
    "purpose": "Check of a scissor lift table driven by a horizontal screw between the bottom pivots: the platform height range from the arm length and angles, the horizontal actuator force from the load (largest at the lowest angle), the screw travel, the torque to drive the screw at the largest force (as the power screw torque tool), the lift time at the screw speed and the drive power, against the torque available and the time allowed.",
    "uses": [
      "Size the screw and motor for a scissor table",
      "See why scissor lifts start hard at the bottom",
      "Check a lift table for a heavier load"
    ],
    "users": [
      "Machine designers",
      "Design engineers",
      "Materials handling engineers"
    ],
    "inputs": {
      "W": "Load on the platform plus the platform itself (arm weight left out).",
      "L": "Length of each scissor arm between its end pivots.",
      "thMin": "Arm angle from horizontal with the table lowered.",
      "thMax": "Arm angle with the table raised.",
      "dm": "Mean diameter of the screw thread.",
      "lead": "Lead of the screw.",
      "flank": "Thread form.",
      "mu": "Thread friction (a ball screw has far less).",
      "dc": "Mean diameter of a plain thrust collar (0 for a rolling thrust bearing).",
      "muc": "Collar friction.",
      "nS": "Speed of the screw.",
      "Tav": "Torque the motor and gearing can give at the screw.",
      "tMax": "Longest time allowed for a full lift."
    },
    "outputs": [
      "Height range and screw travel",
      "Largest actuator force and screw torque",
      "Lift time and power"
    ],
    "method": [
      "Height = L sin θ; base length = L cos θ; screw travel = L (cos θ_min − cos θ_max).",
      "Virtual work: W dh = F dx gives F = W ÷ tan θ, largest at the lowest angle.",
      "Torque to raise the largest force (as the power screw torque tool); lift time = travel ÷ (lead × speed); power = torque × ω.",
      "Example: 28,356 N at the bottom of the lift needs 59.654 N·m; the lift takes 16.417 s."
    ],
    "limitations": [
      "Single stage with the load centred and arm weight and pivot friction left out.",
      "Screw buckling and nut wear not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The force at the bottom of the lift is several times the load; starting a little higher (a larger lowest angle) cuts it sharply."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 153–163, 1921–1928. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rope-drum-fleet-angle-check": {
    "purpose": "Check of a rope drum and its lead: the fleet angle from half the drum width and the distance to the first sheave, the drum-to-rope diameter ratio, the turns per layer and the rope each layer holds, the rope length needed for the lift and falls plus dead turns, the layers used, and the drum torque on the outermost layer used (as the rope winch drum tool), against your fleet angle limit, least D/d ratio and the layers allowed.",
    "uses": [
      "Lay out a winch and its lead sheave",
      "Check rope capacity before fitting a longer rope",
      "Find the torque on the top layer of a drum"
    ],
    "users": [
      "Lifting engineers",
      "Riggers",
      "Machine designers"
    ],
    "inputs": {
      "F": "Line pull on the rope where it leaves the drum.",
      "D": "Diameter of the drum barrel (under the first layer).",
      "dr": "Rope diameter.",
      "Ld": "Width of the drum between its flanges.",
      "Ls": "Distance from the drum to the first (lead) sheave, centred on the drum.",
      "lift": "Height the hook travels.",
      "falls": "Number of rope falls between the drum and the hook block.",
      "dead": "Turns that must stay on the drum at the lowest hook position.",
      "fleetMax": "Largest fleet angle you accept for even spooling (often 1.5° for grooved and 1° to 2° for plain drums).",
      "ratioMin": "Least drum-to-rope diameter ratio from your rope or crane code.",
      "layersMax": "Most rope layers allowed on the drum."
    },
    "outputs": [
      "Fleet angle and D/d ratio",
      "Rope needed and capacity by layer",
      "Layers used and top-layer torque"
    ],
    "method": [
      "Fleet angle = atan ((drum width ÷ 2) ÷ distance to the sheave), lead sheave on the drum centre line.",
      "Turns per layer = drum width ÷ rope diameter; layer i holds π (D + (2i − 1) d) × turns; rope needed = lift × falls + dead turns × π (D + d).",
      "Drum torque = pull × layer pitch radius (as the rope winch drum tool at that diameter).",
      "Example: fleet angle 1.4321°; 42.922 m of rope in 1 layer(s); 1,550 N·m on the top layer."
    ],
    "limitations": [
      "Rope wound tightly with no gaps; loose spooling needs more drum.",
      "Fleet angle for a sheave on the drum centre line; an offset sheave makes one side worse.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each extra layer raises the torque and speed of the rope and crushes the layers below; most crane codes limit layers for that reason."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–168, 2455–2459. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "enclosure-cooling-airflow": {
    "purpose": "Ventilation of a closed cabinet: the heat lost through the enclosure surface at the temperature difference from a wall heat transfer coefficient, the heat the fan must remove, the mass and volume of air per hour to carry it at the allowed temperature rise (as the heating energy tool, applied to the cooling air), and the fan airflow against the fan you have.",
    "uses": [
      "Size a filter fan for a control cabinet",
      "Check whether a panel needs a fan at all",
      "See the effect of a hotter plant room"
    ],
    "users": [
      "Electrical engineers",
      "Panel builders",
      "Maintenance engineers"
    ],
    "inputs": {
      "P": "Total heat given off by drives, power supplies and other equipment inside.",
      "Ta": "Highest temperature of the air drawn in.",
      "Ti": "Highest temperature the equipment inside may see.",
      "As": "Surface area of the enclosure that can lose heat (walls against other walls or the floor count less).",
      "k": "Heat transfer coefficient through the walls to still air (about 5.5 for painted steel).",
      "rho": "Density of the air at the inlet.",
      "cp": "Specific heat of air.",
      "fan": "Airflow of the fan at the pressure drop of its filters and grilles."
    },
    "outputs": [
      "Heat lost through the walls",
      "Heat for the fan to remove",
      "Airflow needed against the fan"
    ],
    "method": [
      "Wall loss = k A (T_inside − T_outside); fan heat = heat load − wall loss.",
      "Air mass per hour to carry the fan heat with a rise of T_inside − T_outside: m = Q ÷ (c_p ΔT) (as the heating energy tool, Q = m c ΔT).",
      "Airflow = mass ÷ density.",
      "Example: the walls lose 110 W; the fan must move 120.43 m³/h."
    ],
    "limitations": [
      "Air drawn in at the outside temperature and leaving at the inside limit; poor air paths leave hot spots.",
      "Solar gain on outdoor cabinets is not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the inside limit is close to the outside temperature, the airflow needed rises steeply; an air conditioner may then be the better answer."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–374, 2683. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ramp-traction-check": {
    "purpose": "Traction check of a two-axle vehicle climbing a ramp: the load on each axle from the weight, its position between the axles, the height of the centre of gravity and the slope, the force to climb (as the inclined plane tool), to overcome rolling resistance (as the rolling resistance tool) and to accelerate, and the grip of the driven axle from the tyre friction, against the force needed and with a check that the uphill axle stays loaded.",
    "uses": [
      "Check a forklift or AGV on a loading ramp",
      "Decide front or rear drive for a vehicle on slopes",
      "Find the steepest ramp a vehicle can climb"
    ],
    "users": [
      "Materials handling engineers",
      "Vehicle designers",
      "Safety advisers"
    ],
    "inputs": {
      "mass": "Mass of the vehicle with its load.",
      "slope": "Slope of the ramp.",
      "wb": "Distance between the axles.",
      "a": "Horizontal distance of the centre of gravity behind the uphill (front) axle.",
      "hcg": "Height of the centre of gravity above the ground.",
      "drive": "Which axle drives.",
      "mu": "Friction between tyres and the ramp surface (wet or dusty surfaces are much lower).",
      "f": "Coefficient of rolling resistance (lever arm, mm).",
      "r": "Wheel radius.",
      "acc": "Acceleration when starting on the ramp."
    },
    "outputs": [
      "Axle loads on the slope",
      "Force needed to climb",
      "Grip available and decision"
    ],
    "method": [
      "Rear axle load = W (cos θ × a + sin θ × h) ÷ wheelbase; front = W cos θ − rear.",
      "Climbing force = W sin θ (as the inclined plane tool, no sliding friction); rolling resistance = W cos θ × f ÷ r (as the rolling resistance tool); plus m a.",
      "Grip = μ × driven axle load; the front axle must stay loaded.",
      "Example: 3,475.2 N needed against 7,827.2 N of grip; the front axle keeps 8,727.9 N."
    ],
    "limitations": [
      "Rigid vehicle on a uniform slope; the transition at the ramp foot and crest is worse.",
      "Front uphill when climbing forwards; reversing up the ramp swaps the axles.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Climbing shifts weight to the downhill axle, so rear drive grips better uphill and front drive worse."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "two-pump-arrangement-check": {
    "purpose": "Operating point of two identical centrifugal pumps in parallel (heads equal, flows add) or in series (flows equal, heads add) on a system curve: the single-pump operating point (as the pump operating point tool), the combined pump curve and its intersection with the system curve, the flow gain over one pump, the flow, head, share of best-efficiency flow and efficiency of each pump, and the total power, against the flow needed.",
    "uses": [
      "See how much a second pump really adds",
      "Choose parallel or series for a duty",
      "Check each pump stays near its best efficiency"
    ],
    "users": [
      "Process engineers",
      "Building services engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mode": "Parallel pumps share the flow at the same head; series pumps pass the same flow and add their heads.",
      "H0": "Head of each pump at zero flow.",
      "Qb": "Flow of each pump at its best efficiency.",
      "Hb": "Head of each pump at best efficiency.",
      "etab": "Best efficiency of each pump.",
      "Hs": "Static head of the system.",
      "Qd": "A known flow on the system curve.",
      "Hd": "System head at that flow.",
      "rho": "Liquid density.",
      "Qreq": "Flow the duty needs."
    },
    "outputs": [
      "One pump alone",
      "Both pumps together and the gain",
      "Each pump’s flow, head and efficiency"
    ],
    "method": [
      "Pump curve H = H₀ − a Q² through the best-efficiency point; system curve H = H_s + k Q² (as the pump operating point tool).",
      "Parallel: H₀ − a (Q ÷ 2)² = H_s + k Q². Series: 2 (H₀ − a Q²) = H_s + k Q².",
      "Each pump’s efficiency from the parabola through its best-efficiency point; power = ρ g Q H ÷ η per pump.",
      "Example: one pump gives 390.8 L/min; two give 438.18 L/min (12.122% more)."
    ],
    "limitations": [
      "Identical pumps with simple parabolic curves; real curves and unequal pumps need the makers’ data.",
      "Parallel pumps need check valves; series pumps need the second casing rated for the higher pressure.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "On a steep (friction-dominated) system a second pump in parallel adds little flow; series suits high static head."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3021–3026. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cantilever-rack-arm-check": {
    "purpose": "Check of a cantilever rack arm or bracket with a uniformly spread load: the section properties of an I, T, channel or angle arm (as the section shapes tool), the moment at the column and the tip deflection for a cantilever with a uniform load (as the beam cases tool), the bending stress, and the tension in the top bolts of the moment connection from the lever arm to the bottom bearing point, against your allowable stress, deflection limit and bolt capacity.",
    "uses": [
      "Check cantilever racking for bar or pipe storage",
      "Size a wall bracket arm",
      "Check bolts of a cantilever arm to its column"
    ],
    "users": [
      "Design engineers",
      "Warehouse engineers",
      "Fabricators"
    ],
    "inputs": {
      "P": "Total load on the arm, taken as spread evenly along it.",
      "L": "Length of the arm from the column face.",
      "shape": "Shape of the arm section.",
      "H": "Depth of the section.",
      "B": "Width of the section.",
      "tf": "Flange thickness.",
      "tw": "Web thickness.",
      "E": "Modulus of elasticity.",
      "sA": "Allowable bending stress.",
      "dlim": "Largest tip deflection as a fraction of the arm length.",
      "z": "Distance from the top bolts down to the point where the arm bears on the column.",
      "nb": "Bolts in the top row taking the moment as tension.",
      "Fb": "Allowable tension in each bolt."
    },
    "outputs": [
      "Arm section properties",
      "Moment, stress and tip deflection",
      "Bolt tension at the column"
    ],
    "method": [
      "A, I and Z of the section about its horizontal axis (as the section shapes tool).",
      "Cantilever with a uniform load: M = P L ÷ 2 at the column, tip deflection = P L³ ÷ 8EI (as the beam cases tool).",
      "Bolt tension = M ÷ lever arm ÷ top bolts.",
      "Example: 42.054 MPa and 0.56773 mm at the tip; each top bolt carries 15,000 N."
    ],
    "limitations": [
      "Uniform load and a rigid column; point loads at the tip double the moment for the same total.",
      "Bending about the section’s main axis; channels and angles also twist under load.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Loads placed at the arm tip are the worst case; marking a safe working load per arm prevents overloading."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 234–246, 257–277, 1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centrifugal-clutch-check": {
    "purpose": "Check of a shoe-type centrifugal clutch: the centrifugal force on each shoe at speed (as the centrifugal force tool), the speed at which it equals the spring force holding the shoe in (engagement speed), the net shoe force and the friction torque at the running speed from the number of shoes, friction coefficient and drum radius, against the torque needed with a service factor and the idle speed at which the clutch must stay disengaged.",
    "uses": [
      "Check a centrifugal clutch for an engine-driven machine",
      "Choose spring force for a set engagement speed",
      "See whether a clutch slips under load"
    ],
    "users": [
      "Design engineers",
      "Small engine mechanics",
      "Machine designers"
    ],
    "inputs": {
      "nSh": "Number of friction shoes.",
      "m": "Mass of each shoe with its lining.",
      "r": "Radius from the clutch axis to each shoe’s centre of gravity when engaged.",
      "Fs": "Inward force of the springs on each shoe when it just touches the drum.",
      "Rd": "Inside radius of the drum where the linings rub.",
      "mu": "Friction coefficient of the lining on the drum.",
      "n": "Speed the clutch runs at under load.",
      "nIdle": "Engine idle speed, at which the clutch must not drag.",
      "Treq": "Torque the driven machine needs.",
      "SF": "Factor for starting and shock loads."
    },
    "outputs": [
      "Centrifugal force per shoe",
      "Engagement speed",
      "Torque at running speed"
    ],
    "method": [
      "Centrifugal force F = m ω² r (as the centrifugal force tool).",
      "Engagement when m ω² r = spring force: ω = √(F_s ÷ (m r)).",
      "Torque = shoes × μ × (m ω² r − F_s) × drum radius.",
      "Example: engages at 1,232.8 rpm; carries 83.055 N·m at 3000 rpm."
    ],
    "limitations": [
      "Leading and trailing shoe effects (self-energising) are ignored; pivoted shoes can carry more torque one way.",
      "Linings worn so the shoes travel further change the spring force.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Clutch torque rises with the square of speed above engagement, so the clutch slips at low speed and grips firmly at full speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 187–190, 2433–2446. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "expansion-gap-plan": {
    "purpose": "Plan of an expansion gap for a run fixed at one end: the length change over the temperature range from the expansion coefficient, the gap to set at the installation temperature so a least gap remains at the hottest temperature, the gap at the coldest temperature, the number of gaps needed if the range is too wide for one joint, and the thermal stress and force that would build up if the run were fully restrained (as the thermal stress tool).",
    "uses": [
      "Set gaps for crane or conveyor rails",
      "Plan expansion joints in long cladding or pipe runs",
      "See the stress if a gap closes"
    ],
    "users": [
      "Site engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "L": "Length of the run between its fixed point and the gap.",
      "alpha": "Linear expansion coefficient of the material (steel about 12, aluminium about 23).",
      "Tmin": "Lowest temperature the run reaches.",
      "Tmax": "Highest temperature the run reaches (sun on dark surfaces can be well above air temperature).",
      "Ti": "Temperature of the run when the gap is set.",
      "gMin": "Smallest gap to leave at the hottest temperature.",
      "gMax": "Largest gap the joint, rail or cover plate can bridge.",
      "E": "Elastic modulus.",
      "A": "Cross-section area of the run.",
      "Sy": "Yield strength of the material."
    },
    "outputs": [
      "Movement over the range",
      "Gap to set and gap when coldest",
      "Gaps needed and restrained stress"
    ],
    "method": [
      "Length change = α L ΔT.",
      "Gap to set = least gap + α L (T_max − T_install); gap when coldest = gap to set + α L (T_install − T_min).",
      "Gaps needed = ⌈α L (T_max − T_min) ÷ (largest − least gap)⌉; restrained stress = E α (T_max − T_install) and force = stress × area (as the thermal stress tool).",
      "Example: set a 11 mm gap at 20 °C; it opens to 20 mm when coldest; restrained, the run would see 60 MPa."
    ],
    "limitations": [
      "Uniform temperature along the run and free sliding; friction at supports takes up part of the movement.",
      "One fixed point per run; runs fixed at both ends need the joint in between to take both movements.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Setting the gap for the temperature on the day of installation is what keeps the joint inside its range in summer and winter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–376, 578. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
