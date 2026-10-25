// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook29).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "gear-train-ratio-planner": {
    "purpose": "Search for spur or helical gear tooth numbers that produce a target reduction in one or two stages within limits on tooth count and stage ratio: the best combination by ratio error, preferring hunting-tooth pairs (no common factor) and the smallest total teeth, with the actual ratio, error, output speed and a table of the five best trains.",
    "uses": [
      "Pick tooth counts for a custom reduction gearbox",
      "Match an odd ratio for a feed or timing drive",
      "Avoid repeating tooth contact with hunting-tooth pairs"
    ],
    "users": [
      "Gear designers",
      "Machine designers",
      "Toolmakers"
    ],
    "inputs": {
      "R": "Required overall reduction (for a step-up drive enter the reciprocal and reverse the train).",
      "nin": "Input shaft speed.",
      "stages": "Number of gear meshes in series.",
      "zmin": "Smallest pinion allowed (17 or more avoids undercut at 20°).",
      "zmax": "Largest gear allowed.",
      "rmax": "Largest ratio allowed in one mesh (about 6–8 for spur gears).",
      "hunt": "Prefer pairs whose tooth numbers share no common factor, so every tooth meets every other tooth (more even wear)."
    },
    "outputs": [
      "Best tooth numbers",
      "Actual ratio and error",
      "Output speed and the five best trains"
    ],
    "method": [
      "One stage: for each pinion z₁, gear z₂ = round(R z₁) within the limits.",
      "Two stages: for each first pair z₁/z₂ (ratio r₁ ≤ limit), the second pair z₃/z₄ = round(R ÷ r₁ × z₃).",
      "Ranked by ratio error, then hunting-tooth pairs (greatest common divisor 1), then fewest total teeth.",
      "Actual ratio = Π z_driven ÷ Π z_driver; output speed = input ÷ ratio.",
      "Example: a 23.5:1 reduction in 2 stage(s) is 17/94 × 20/85 (error 0%)."
    ],
    "limitations": [
      "Ratio only; centre distances, strength and space need their own checks.",
      "Two stages searched exhaustively within the limits; three or more stages are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the error is too large, widen the tooth range or add a stage."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160, 2043–2047. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gearbox-heat-balance": {
    "purpose": "Thermal balance of an enclosed gearbox or hydraulic power unit: heat generated from the power and efficiency, equilibrium oil temperature from the housing or tank surface area and a heat transfer coefficient (natural or fan-cooled), the thermal power limit for the maximum oil temperature, and the cooler duty and oil flow needed when the surface alone is not enough.",
    "uses": [
      "Check whether a worm gearbox will overheat at full power",
      "Size an oil cooler for a hydraulic power unit",
      "Compare natural and fan cooling"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mode": "Gearbox or hydraulic power unit (affects wording only).",
      "P": "Power going into the unit.",
      "eff": "Share of input power delivered usefully; the rest becomes heat (worm gears can be 50–90%, spur and helical about 95–98% per stage; hydraulic systems often 60–80%).",
      "A": "External surface area of the housing or reservoir that sheds heat (exclude the base on a foundation).",
      "h": "Heat transfer coefficient: about 10–15 W/m²·K in still air, 20–40 with a shaft fan or good air flow.",
      "Tamb": "Surrounding air temperature.",
      "Tmax": "Highest oil temperature you accept (from the lubricant and seals).",
      "dT": "Temperature drop of the oil through the cooler.",
      "cp": "Specific heat of the oil.",
      "rho": "Density of the oil."
    },
    "outputs": [
      "Heat generated and equilibrium temperature",
      "Thermal power limit",
      "Cooler duty and oil flow"
    ],
    "method": [
      "Heat generated = P (1 − η).",
      "Equilibrium oil temperature = T_amb + heat ÷ (h A).",
      "Thermal power limit = h A (T_max − T_amb) ÷ (1 − η).",
      "Cooler duty = heat − h A (T_max − T_amb); oil flow = duty ÷ (ρ c_p ΔT).",
      "Example: 15 kW at 92% efficiency on 2 m² settles at about 70 °C."
    ],
    "limitations": [
      "Steady state with uniform surface temperature; churning and fan effects are in the coefficient.",
      "Gear makers publish thermal ratings that supersede this estimate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the thermal limit is below the mechanical rating, the thermal limit governs (as the handbook notes for worm gearing)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3339–3340, 2430–2436. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tool-deflection-cut-limit": {
    "purpose": "Cutting force on an end mill (average tangential force from removal rate and specific cutting force) or a boring bar (chip area × specific cutting force), the resultant with the radial component, the tool’s cantilever deflection with an effective fluted diameter, the overhang ratio, and the largest depth of cut that keeps deflection within the allowance.",
    "uses": [
      "Set depth of cut for a long-reach end mill",
      "Hold bore tolerance with a long boring bar",
      "Choose a shorter or carbide tool before cutting"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "type": "End mill or boring bar.",
      "D": "Diameter of the tool or bar.",
      "L": "Distance from the holder face to the cutting edge.",
      "k": "Equivalent stiff diameter as a share of nominal (about 0.8 for fluted end mills, 1 for solid bars).",
      "E": "Elastic modulus (about 600 GPa carbide, 210 GPa steel).",
      "kc": "Specific cutting force for the material.",
      "ratio": "Radial (deflecting) force as a share of the tangential force (about 0.3–0.6).",
      "z": "Teeth on the end mill.",
      "fz": "Feed per tooth.",
      "ae": "Radial engagement of the end mill.",
      "ap": "Axial depth of the end mill cut.",
      "f": "Feed per revolution for boring or turning.",
      "ab": "Radial depth of cut for boring.",
      "allow": "Deflection you can accept (a share of the tolerance)."
    },
    "outputs": [
      "Cutting force",
      "Tool deflection and overhang ratio",
      "Largest depth of cut for the allowance"
    ],
    "method": [
      "End mill average tangential force F_t = a_e a_p f_z z k_c ÷ π D (removal rate × k_c ÷ cutting speed).",
      "Boring: F_t = a_p × f × k_c.",
      "Resultant F = F_t √(1 + ratio²); deflection δ = F L³ ÷ 3 E I with I = π (k D)⁴ ÷ 64 (as the boring-bar tool).",
      "Force is proportional to depth, so the largest depth = depth × allowable ÷ δ.",
      "Example: a 10 mm end mill at 40 mm stick-out deflects 50.347 µm; keep the depth below 3.9724 mm."
    ],
    "limitations": [
      "Average force; peak force on few-tooth cutters is higher.",
      "Holder and spindle compliance add to tool deflection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Deflection rises with the cube of overhang: shorten the tool before reducing feed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1093–1094, 1162–1167. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sheet-metal-part-cost": {
    "purpose": "Cost build-up of a one- or two-bend sheet-metal part: developed flat length from outside dimensions with the bend allowance and deduction (K-factor), parts per sheet in the better orientation with spacing, material utilisation and cost per part, press brake force per bend, and labour cost from bend and blanking times with set-up spread over the batch.",
    "uses": [
      "Quote a bent bracket or cover",
      "Choose sheet size for best yield",
      "Check press brake capacity for a part"
    ],
    "users": [
      "Estimators",
      "Fabrication supervisors",
      "Design engineers"
    ],
    "inputs": {
      "a": "Outside length of the first flange.",
      "b": "Outside length of the web between bends.",
      "c": "Outside length of the second flange (0 for an L-bracket).",
      "W": "Width of the part along the bend line.",
      "t": "Material thickness.",
      "R": "Inside radius of the bends.",
      "k": "K-factor locating the neutral axis (about 0.33–0.45 for air bending).",
      "ang": "Bend angle of each bend.",
      "Ls": "Length of the stock sheet.",
      "Ws": "Width of the stock sheet.",
      "gap": "Spacing between blanks and at the sheet edge.",
      "rho": "Material density.",
      "price": "Price of the sheet per kilogram.",
      "UTS": "Tensile strength of the sheet.",
      "V": "Opening of the bending die (6–12 × thickness).",
      "kf": "Air-bending force factor (1.33 is common).",
      "rate": "Machine and labour rate.",
      "tb": "Handling and bending time per bend.",
      "tc": "Time to cut each blank.",
      "setup": "Set-up time for the batch.",
      "batch": "Parts in the batch."
    },
    "outputs": [
      "Flat blank and parts per sheet",
      "Bending force",
      "Cost per part"
    ],
    "method": [
      "Bend allowance BA = θ (R + k t); outside setback = (R + t) tan(θ ÷ 2); deduction = 2 × setback − BA (as the bend allowance tool).",
      "Flat length = sum of outside dimensions − bends × deduction.",
      "Parts per sheet = best of the two orientations of ⌊(L_s − gap) ÷ (blank + gap)⌋ × ⌊(W_s − gap) ÷ (width + gap)⌋.",
      "Bend force = k W t² UTS ÷ V; cost = sheet cost ÷ parts + rate × (bends × t_bend + t_blank) + set-up share.",
      "Example: the default bracket blanks at 172.8 × 100 mm, nests 161 per sheet and costs about 2.1571 each."
    ],
    "limitations": [
      "Rectangular blanks on a simple grid; true nesting software can do better.",
      "Holes, notches and finishing are not costed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Utilisation under about 75% suggests trying another sheet size or orientation."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1353. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tapped-hole-design": {
    "purpose": "Design of a blind tapped hole for a metric screw: tap drill for the chosen percentage of thread and tap type, the length of engagement at which the bolt breaks before the threads strip (handbook shear-area method, extended by the strength ratio for weaker internal threads), the full-thread depth allowing for the tap chamfer, and the drill depth including the drill point.",
    "uses": [
      "Specify drill and tap depths for a screw into aluminium or cast iron",
      "Check whether a tapped hole needs a thread insert",
      "Write a hole callout on a drawing"
    ],
    "users": [
      "Design engineers",
      "Machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Nominal screw diameter.",
      "P": "Thread pitch.",
      "pct": "Percentage of full thread height (65–75% is usual for cutting taps).",
      "tap": "Cutting tap or thread-forming tap.",
      "Sub": "Tensile strength of the screw.",
      "Sun": "Tensile strength of the material being tapped.",
      "chamfer": "Incomplete threads at the tap’s chamfer, in pitches (about 2 for bottoming, 3–5 for plug taps).",
      "extra": "Clearance below the threads for chips.",
      "point": "Included angle of the drill point."
    },
    "outputs": [
      "Tap drill",
      "Engagement length needed",
      "Thread depth and drill depth"
    ],
    "method": [
      "Tap drill = D − k × % thread × P, with k = 0.01299 for cutting and 0.0068 for forming taps (as the tap drill tool).",
      "Engagement L_e = 2 A_t ÷ {π K_n [½ + 0.57735 n (E_s − K_n)]} at basic diameters; multiplied by J = (external shear area × S_ub) ÷ (internal shear area × S_un) when the internal thread is weaker (as the thread engagement tool).",
      "Full-thread depth = engagement + chamfer allowance; drill depth = thread depth + extra + drill point length.",
      "Example: M10 × 1.5 into 310 MPa material needs 16.332 mm of engagement and a 25.397 mm deep 8.5386 mm hole."
    ],
    "limitations": [
      "Basic thread diameters; tolerance class and actual percentage of thread change the shear areas.",
      "Static strength; vibration loosening and repeated assembly need inserts or longer engagement.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the engagement exceeds about 2 D, a thread insert or through-bolt usually costs less than a deep tapped hole."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1536, 2029–2031. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pneumatic-cylinder-sizing": {
    "purpose": "Sizing of a double-acting pneumatic cylinder: minimum bore for the load at a recommended load ratio, the next standard bore, extend and retract forces, free air per cycle and average consumption (as the cylinder air consumption tool), peak flow while extending at speed, kinetic energy against the cushion capacity, and the yearly energy cost of the air.",
    "uses": [
      "Choose a cylinder bore for an automation task",
      "Estimate compressed-air demand for a new machine",
      "Show the energy cost of cylinder air"
    ],
    "users": [
      "Automation engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "F": "Force the cylinder must produce while moving.",
      "ratio": "Largest share of theoretical force to use (about 50–70% for dynamic loads).",
      "p": "Supply pressure at the cylinder.",
      "rod": "Rod diameter of the chosen cylinder.",
      "stroke": "Stroke length.",
      "cpm": "Full cycles (extend and retract) per minute.",
      "v": "Piston speed while extending.",
      "mass": "Mass moved by the piston.",
      "cush": "Energy the end cushion can absorb (from the cylinder maker).",
      "spec": "Compressor power per unit of free air delivered.",
      "hours": "Hours per year the machine cycles.",
      "price": "Cost of electricity."
    },
    "outputs": [
      "Minimum and standard bore with forces",
      "Air per cycle, average consumption and peak flow",
      "Cushioning check and air cost"
    ],
    "method": [
      "Minimum bore = √[4F ÷ (π p × ratio)]; next ISO bore from 8 to 320 mm.",
      "Air per cycle, as free air = (2A − A_rod) × stroke × (p + 1.013) ÷ 1.013.",
      "Peak free-air flow while extending = A v (p + 1.013) ÷ 1.013.",
      "Kinetic energy = ½ m v² against the cushion capacity; air cost = consumption × specific power × hours × price.",
      "Example: 600 N at 6 bar needs a 50 mm bore using 25.006 L/min of free air."
    ],
    "limitations": [
      "Theoretical forces; seal friction and pressure drop in valves and tubing reduce them.",
      "Isothermal air use; real use is higher with long tubing to the valve.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Oversized cylinders waste air every stroke; lower pressure on the return stroke saves more."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3421–3425, 3030–3037. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "disc-spring-stack-design": {
    "purpose": "Design of a disc (Belleville) spring stack from a single disc’s dimensions: the number of discs in series so that each deflects no more than a chosen share of its cone height over the stroke, the number in parallel to reach the force (Almen–László characteristic, as the disc spring tool), the stack force, free and solid heights, and the top inner-edge stress against an allowable.",
    "uses": [
      "Design a disc spring pack for a clamp, brake or bolted joint",
      "Find how many discs a stroke and force need",
      "Check stack height for the space available"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Machine designers"
    ],
    "inputs": {
      "De": "Outside diameter of one disc.",
      "Di": "Inside diameter.",
      "t": "Disc thickness.",
      "h0": "Unloaded cone height of one disc (overall height minus thickness).",
      "E": "Elastic modulus.",
      "nu": "Poisson’s ratio.",
      "F": "Force the stack must give at the working stroke.",
      "stroke": "Total compression of the stack at the working point.",
      "use": "Largest share of cone height each disc may deflect (75% keeps clear of flat).",
      "allow": "Allowable static stress at the top inner edge (from the spring maker)."
    },
    "outputs": [
      "Discs in series and parallel",
      "Stack force and deflection per disc",
      "Unloaded height, solid height and stress"
    ],
    "method": [
      "Series count n_s = ⌈stroke ÷ (share × h₀)⌉; deflection per disc s = stroke ÷ n_s.",
      "Force per disc F(s) by Almen–László: F = 4E ÷ (1 − ν²) × t⁴ ÷ (K₁ D_e²) × (s ÷ t) [(h₀ ÷ t − s ÷ t)(h₀ ÷ t − s ÷ 2t) + 1].",
      "Parallel count n_p = ⌈F ÷ F(s)⌉; stack force = n_p F(s).",
      "Unloaded stack height = n_s (h₀ + n_p t); solid height = n_s n_p t.",
      "Example: 12000 N over 3 mm needs 3 groups in series of 3 discs in parallel."
    ],
    "limitations": [
      "Friction between nested discs raises force when compressing and lowers it when releasing (not included).",
      "Long series stacks need guiding to stay aligned.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Parallel discs multiply force; series discs multiply stroke."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 350–353. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drilling-cycle-planner": {
    "purpose": "Drilling plan for a batch of holes: spindle speed, cutting power, torque and approximate thrust (the same method as the drilling power tool), motor power and thrust against the limits, time per hole including the drill point, clearance, peck retracts and positioning, and the total time for all holes.",
    "uses": [
      "Plan a drilling operation in a CNC program",
      "Check thrust against fixturing and thin parts",
      "Estimate cycle time for a pattern of holes"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Drill diameter.",
      "vc": "Cutting speed for the drill and material.",
      "f": "Feed per revolution.",
      "kc": "Specific cutting force of the material.",
      "point": "Point angle of the drill.",
      "eta": "Spindle drive efficiency.",
      "Pavail": "Spindle power of the machine.",
      "Tlim": "Largest thrust the fixture, part or machine should see.",
      "depth": "Depth of each hole.",
      "holes": "Number of holes.",
      "clear": "Extra travel for approach and breakthrough.",
      "peck": "Depth per peck for deep holes (0 for continuous feed).",
      "retract": "Time for each retract and return when pecking.",
      "pos": "Rapid move time from hole to hole."
    },
    "outputs": [
      "Speed, feed rate, power, torque and thrust",
      "Time per hole",
      "Total time for all holes"
    ],
    "method": [
      "n = 1000 v_c ÷ π D; power P = f v_c D k_c ÷ 240,000 kW; torque = P × 30,000 ÷ π n; thrust ≈ 0.5 k_c (D ÷ 2) f sin(point ÷ 2) (as the drilling power tool).",
      "Travel = depth + point length D ÷ [2 tan(point ÷ 2)] + clearance; feed time = travel ÷ (n f).",
      "Pecks = ⌈depth ÷ peck⌉ − 1, each adding its retract time; positioning added per hole.",
      "Example: 20 holes 10 mm × 30 mm take about 2.4995 min at 2,546.5 rpm."
    ],
    "limitations": [
      "Thrust is approximate; the chisel edge can add considerably, especially without point thinning.",
      "Tool changes and spot drilling are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Peck only as deep as chip evacuation needs: every retract costs time."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1092, 1089. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-motor-drive": {
    "purpose": "Sizing a hydraulic motor drive through an optional gear reduction: motor torque and speed, the displacement needed at the available pressure difference with mechanical efficiency, the flow with volumetric efficiency, hydraulic and pump input power, and, for a chosen motor size, the actual pressure needed (using the same relations as the hydraulic motor tool).",
    "uses": [
      "Size a hydraulic motor for a winch, wheel or conveyor drive",
      "Check whether a chosen motor has enough torque at the pressure available",
      "Size the pump for the drive"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Mobile equipment designers"
    ],
    "inputs": {
      "TL": "Torque needed at the load.",
      "nL": "Speed of the load.",
      "i": "Gear reduction between the motor and the load.",
      "etaG": "Efficiency of the gear reduction.",
      "dp": "Pressure difference across the motor available from the system (relief setting minus line losses and back pressure).",
      "em": "Mechanical (torque) efficiency of the motor.",
      "ev": "Volumetric efficiency of the motor.",
      "ep": "Overall efficiency of the pump.",
      "Vc": "Displacement of a catalogue motor you are considering."
    },
    "outputs": [
      "Motor torque and speed",
      "Displacement and flow",
      "Pressure needed and pump power"
    ],
    "method": [
      "Motor torque = T_L ÷ (i η_G); motor speed = n_L × i.",
      "Displacement needed V = 20π T ÷ (Δp η_m) cm³/rev (from T = V Δp η_m ÷ 20π).",
      "Flow Q = V n ÷ (1000 η_v) L/min; hydraulic power = Q Δp ÷ 600 kW; pump input = hydraulic ÷ η_pump.",
      "Example: 2000 N·m at 40 rpm through 4:1 needs 199.69 cm³/rev and 33.633 L/min."
    ],
    "limitations": [
      "Running efficiencies; starting torque efficiency is lower (check breakaway).",
      "Speed must lie within the motor’s rated range.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger reduction allows a smaller, faster motor; check the motor’s minimum smooth speed for slow drives."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3418–3425. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
