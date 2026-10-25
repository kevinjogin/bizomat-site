// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook30).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "chuck-grip-force": {
    "purpose": "Workholding check for a jaw chuck: cutting and feed forces from the chip area and specific cutting force, the total jaw grip needed to resist the cutting torque and feed force by friction with a safety factor, the grip lost (or gained) to centrifugal force on the jaws at the spindle speed, the static grip to set, and the highest speed at which the chuck’s rated grip still holds the work.",
    "uses": [
      "Check that a part will not slip in the chuck on a heavy cut",
      "Find a safe spindle speed for heavy top jaws",
      "Set chuck pressure for thin-walled parts"
    ],
    "users": [
      "Machinists",
      "Manufacturing engineers",
      "Tooling engineers"
    ],
    "inputs": {
      "dc": "Diameter being cut.",
      "kc": "Specific cutting force of the material.",
      "ap": "Depth of cut.",
      "f": "Feed per revolution.",
      "ratio": "Axial feed force as a share of the main cutting force.",
      "dg": "Diameter on which the jaws grip.",
      "grip": "Outside gripping loses grip with speed; inside gripping gains it.",
      "mu": "Friction coefficient between jaws and work (about 0.1 for smooth hard jaws, 0.2–0.3 for serrated jaws).",
      "n": "Safety factor on holding.",
      "jaws": "Number of jaws.",
      "mj": "Mass of one base jaw plus its top jaw.",
      "rc": "Distance from the spindle axis to the jaws’ centre of gravity.",
      "rpm": "Spindle speed.",
      "Fmax": "Largest static grip the chuck is rated for (from the chuck maker)."
    },
    "outputs": [
      "Cutting and feed forces",
      "Grip needed while cutting and centrifugal change",
      "Static grip to set and the speed limit"
    ],
    "method": [
      "Cutting force F_c = k_c a_p f; feed force = ratio × F_c.",
      "Grip needed while turning = n √[(F_c d_c ÷ d_g)² + F_f²] ÷ μ (the friction at the grip must carry the cutting torque and the feed force).",
      "Centrifugal force on the jaws = jaws × m r ω²; static grip to set = grip needed + centrifugal force (outside gripping) or − (inside gripping).",
      "Speed limit (outside gripping) where the rated grip minus centrifugal force equals the grip needed.",
      "Example: the default cut needs 40.249 kN of grip; at 1500 rpm the jaws lose 8.8826 kN."
    ],
    "limitations": [
      "Rigid part; thin walls deform under grip and need lower pressure with soft jaws.",
      "Use the chuck maker’s speed and grip curves; this does not replace them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Heavy top jaws can lose most of the grip at high speed: lighter jaws or a lower speed may be needed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101, 3131–3134. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "coolant-system-sizing": {
    "purpose": "Sizing of a machine-tool coolant system: the flow to carry the cutting heat away at an allowed temperature rise (as the coolant heat-flow tool), the flow the nozzles need for the jet velocity, the governing flow, tank volume for the chosen turnover time, and pump shaft power for the head and efficiency (as the pump power tool).",
    "uses": [
      "Specify a coolant pump and tank for a machine",
      "Check whether a coolant system keeps temperature stable",
      "Size a central coolant supply for several machines"
    ],
    "users": [
      "Machinists",
      "Manufacturing engineers",
      "Tooling engineers"
    ],
    "inputs": {
      "Pc": "Cutting power at the spindle during heavy cuts.",
      "share": "Share of the heat carried by the coolant (most goes into chips and coolant).",
      "dT": "Temperature rise of the coolant you accept per pass.",
      "cp": "Specific heat of the coolant (about 4.0 for water-based emulsions).",
      "rho": "Coolant density.",
      "nz": "Number of nozzles delivering coolant.",
      "dz": "Bore of each nozzle.",
      "vj": "Jet velocity wanted at the nozzle (higher for chip flushing).",
      "turn": "Minutes of flow the tank holds (5–10 settles chips and releases air).",
      "head": "Total head the pump must deliver (nozzle pressure plus losses).",
      "eta": "Pump efficiency."
    },
    "outputs": [
      "Flow for heat and for nozzles",
      "Tank volume",
      "Pump power"
    ],
    "method": [
      "Flow for heat Q = heat ÷ (ρ c_p ΔT).",
      "Nozzle flow = number × area × jet velocity; design flow = the larger.",
      "Tank volume = design flow × turnover time.",
      "Pump shaft power = ρ g Q H ÷ η.",
      "Example: 10 kW of cutting needs 21 L/min, a 105 L tank and a 0.11441 kW pump."
    ],
    "limitations": [
      "Average heat; through-spindle and high-pressure systems need their own pump curves.",
      "Tank size also depends on chip settling and filtration.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If nozzle flow governs, fewer, better-aimed nozzles save pump power."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1112–1121, 1183–1190. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rotary-index-table-sizing": {
    "purpose": "Sizing of a servo or geared index table: table and fixture inertia, index angle from the number of stations, peak speed and acceleration for a cycloidal or trapezoidal move, table and motor torque through the reducer, motor speed, dwell time in the cycle, and the holding torque the clamp or brake must provide against machining forces.",
    "uses": [
      "Choose a motor and reducer for a dial table",
      "Check whether an index time is achievable",
      "Specify the table clamp or brake for machining loads"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "M": "Mass of the round table plate.",
      "R": "Radius of the table plate.",
      "st": "Number of stations (indexes per revolution).",
      "mf": "Mass of one fixture with its part.",
      "rf": "Radius at which fixtures sit.",
      "ti": "Time allowed for each index move.",
      "tc": "Total time per station including the index.",
      "law": "Motion profile of the index.",
      "Tf": "Friction torque at the table.",
      "i": "Speed reduction between motor and table.",
      "eta": "Reducer efficiency.",
      "Jm": "Motor rotor inertia.",
      "Fm": "Tangential machining force at the fixture radius during dwell.",
      "SF": "Factor on the holding torque."
    },
    "outputs": [
      "Table inertia and index motion",
      "Table and motor torque and motor speed",
      "Dwell time and holding torque"
    ],
    "method": [
      "J = ½ M R² + stations × m_f r_f² (fixtures as point masses).",
      "Index angle θ = 360° ÷ stations; cycloidal: ω_max = 2θ ÷ t, α_max = 2π θ ÷ t²; trapezoidal (⅓ each): ω_max = 1.5 θ ÷ t, α = 4.5 θ ÷ t².",
      "Table torque = J α + friction; motor torque = table torque ÷ (i η) + J_m α i; motor speed = ω_max i.",
      "Holding torque = SF × F_m × r_f.",
      "Example: a 6-station table indexing in 0.6 s needs 139.34 N·m at the table and 3.7354 N·m at the motor."
    ],
    "limitations": [
      "Rigid table; reducer backlash and stiffness affect settling time.",
      "Unbalanced fixtures add gravity torque on tilted tables.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cycloidal motion needs more peak torque than trapezoidal but settles more smoothly."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 171, 2284–2290. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rack-pinion-axis-sizing": {
    "purpose": "Sizing of a rack-and-pinion linear axis (gantry, transfer or vertical axis): forces from friction, gravity on an incline, external load and acceleration, pinion pitch diameter, torque and speed, reducer ratio for the motor speed, motor torque including rotor inertia, and the Lewis tooth bending stress with the velocity factor (as the Lewis bending tool) against an allowable.",
    "uses": [
      "Size motor, reducer and pinion for a long-travel axis",
      "Check rack teeth for a heavier carriage",
      "Plan a vertical rack drive with counterbalance"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "mass": "Mass of the carriage and load.",
      "mu": "Friction coefficient of the guides.",
      "Fx": "Process force opposing motion.",
      "incl": "Angle of the axis from horizontal (90° for a vertical axis; no counterbalance assumed).",
      "vmax": "Top speed.",
      "ta": "Time to reach top speed.",
      "m": "Pinion and rack module.",
      "z": "Teeth on the pinion.",
      "b": "Face width in mesh.",
      "Y": "Lewis form factor for the pinion tooth count.",
      "make": "Manufacturing quality, for the Barth velocity factor.",
      "allow": "Allowable bending stress for the rack and pinion material.",
      "erp": "Efficiency of the rack and pinion mesh.",
      "i": "Reducer ratio between motor and pinion.",
      "eg": "Reducer efficiency.",
      "Jm": "Motor rotor inertia."
    },
    "outputs": [
      "Axial forces running and accelerating",
      "Pinion and motor torque and speed",
      "Tooth bending stress"
    ],
    "method": [
      "Running force = m g (sin α + μ cos α) + F_ext; accelerating force = running + m a.",
      "Pinion d = m z; pinion torque = F d ÷ 2 ÷ η_rp; pinion speed = v ÷ π d (as the rack and pinion tool).",
      "Motor torque = pinion torque ÷ (i η_g) + J_m α_motor; motor speed = pinion speed × i.",
      "Lewis: σ = K_v F ÷ (b m Y) with the Barth factor for the tooth quality (as the Lewis bending tool).",
      "Example: 300 kg at 1.5 m/s with a module 3, 20-tooth pinion needs 9.3467 N·m peak at the motor."
    ],
    "limitations": [
      "Vertical axes need a counterbalance or brake check beyond this; gravity is included only as a running force.",
      "Lewis is a first check; use ISO 6336 for final rack ratings.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger pinion lowers tooth load but needs more motor torque or a higher ratio."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2140, 2219. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hoist-drive-sizing": {
    "purpose": "Sizing of an electric rope hoist: line pull at the drum for the reeving with sheave efficiency and the rope safety factor and D/d ratio (as the wire rope reeving tool), rope and drum speed, drum torque, gearbox ratio for the motor speed, motor power and the next standard rating, and the brake torque at the motor with a safety factor.",
    "uses": [
      "Size a hoist or winch drive",
      "Check a hoist for a heavier load or faster lift",
      "Specify the brake for a lifting drive"
    ],
    "users": [
      "Lifting equipment designers",
      "Maintenance engineers",
      "Machine designers"
    ],
    "inputs": {
      "mass": "Mass lifted, including the hook block and rigging.",
      "v": "Hook lifting speed.",
      "n": "Number of rope parts carrying the hook block.",
      "es": "Efficiency of each sheave (about 98% with rolling bearings).",
      "D": "Drum diameter to the rope centre.",
      "d": "Rope diameter.",
      "mbl": "Minimum breaking load of the rope.",
      "req": "Rope safety factor required by the code for the duty.",
      "Dd": "Minimum drum-to-rope diameter ratio for the duty.",
      "eg": "Gearbox efficiency.",
      "poles": "Motor pole count.",
      "slip": "Motor slip at full load.",
      "bf": "Brake torque as a multiple of the load torque at the brake (often 1.5–2)."
    },
    "outputs": [
      "Line pull, rope safety factor and D/d",
      "Drum speed and torque, gear ratio",
      "Motor power, rating and brake torque"
    ],
    "method": [
      "Line pull F = W (1 − η) ÷ (1 − ηⁿ) (W ÷ n when frictionless), as the reeving tool.",
      "Rope speed = lifting speed × n; drum speed = rope speed ÷ π D; drum torque = F D ÷ 2.",
      "Gear ratio = motor speed ÷ drum speed; motor power = F × rope speed ÷ η_gear, rounded up to the IEC series.",
      "Brake torque at the motor = factor × drum torque ÷ ratio.",
      "Example: 5000 kg at 8 m/min on 4 falls needs 12.632 kN line pull and a 7.5 kW motor."
    ],
    "limitations": [
      "Steady hoisting; acceleration, duty class and code factors must be added for the actual crane standard.",
      "Lifting equipment must be designed and certified to the applicable standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More parts of rope reduce line pull and motor torque but slow the hook and need more rope."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2613–2625, 3444–3450. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "furnace-heat-treat-plan": {
    "purpose": "Energy plan for a furnace heat-treatment cycle: energy to heat the load and its fixtures through the temperature range from mean specific heat (as the heating energy tool), heat-up time from the furnace power and the share reaching the load, standing losses during the soak, total energy, cost per load and cost per kilogram of work.",
    "uses": [
      "Quote heat treatment by energy cost",
      "Plan furnace loading for throughput",
      "Compare fuller loads against more cycles"
    ],
    "users": [
      "Heat treaters",
      "Production planners",
      "Estimators"
    ],
    "inputs": {
      "mass": "Mass of parts in the load.",
      "fix": "Mass of baskets, trays and fixtures heated with it.",
      "cp": "Average specific heat between the two temperatures (about 0.6 kJ/kg·K for steel to 850 °C, including the transformation).",
      "T0": "Temperature of the load going in.",
      "T1": "Furnace set temperature.",
      "P": "Rated input of the furnace.",
      "eff": "Share of input power going into the load during heat-up (the rest heats the furnace and escapes).",
      "loss": "Power the furnace needs just to hold temperature empty.",
      "soak": "Time at temperature (from the heat-treatment specification for the section size).",
      "price": "Price of electricity or fuel per kWh."
    },
    "outputs": [
      "Heat into the load",
      "Heat-up time and total cycle",
      "Energy and cost per load and per kilogram"
    ],
    "method": [
      "Heat Q = (m_work + m_fixture) c_p (T₁ − T₀).",
      "Heat-up time = Q ÷ (P × share).",
      "Energy = Q ÷ share + standing loss × soak time.",
      "Cost per load = energy × price; per kilogram = cost ÷ work mass.",
      "Example: 500 kg to 850 °C takes about 2.3056 h to heat and costs 7.2167 cents per kg."
    ],
    "limitations": [
      "Mean specific heat; the real heat-up slows as the load approaches set temperature.",
      "Soak time must come from the heat-treatment specification for the section size.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fixture mass is pure overhead: lighter baskets and fuller loads cut cost per kilogram."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 472–480, 372–376. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "crank-press-capacity": {
    "purpose": "Force available from a crank press at any height above bottom dead centre: the slider-crank geometry gives the slide position against crank angle, the rated crankshaft torque follows from the rated force at the rating point, and the available force at the working height is that torque divided by the slide’s mechanical advantage there (capped at the frame rating), with the energy of the working stroke.",
    "uses": [
      "Check whether a press can blank or draw high in the stroke",
      "Choose between presses with different rating points",
      "Explain why a press stalls on deep draws"
    ],
    "users": [
      "Press shop engineers",
      "Toolmakers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "Fr": "Nominal tonnage of the press.",
      "hr": "Height above bottom dead centre at which the nominal tonnage is rated (often 3–13 mm).",
      "S": "Slide stroke (twice the crank radius).",
      "L": "Centre distance of the connecting rod.",
      "Fw": "Force the die needs.",
      "hw": "Height above bottom where the die starts working (for blanking, the material thickness above bottom; for drawing, the draw depth).",
      "dw": "Distance over which the force acts.",
      "Ef": "Energy the flywheel can give per stroke without slowing too much (from the press maker)."
    },
    "outputs": [
      "Crank angle at the working height",
      "Force available there",
      "Working energy against flywheel energy"
    ],
    "method": [
      "Slide height above bottom h(θ) = r (1 − cos θ) + L − √(L² − r² sin² θ), with r = stroke ÷ 2 and θ from bottom.",
      "dh/dθ = r sin θ [1 + r cos θ ÷ √(L² − r² sin² θ)]; rated torque T = F_rated × dh/dθ at the rating point.",
      "Force available at height h = T ÷ dh/dθ there, capped at the rated force.",
      "Working energy ≈ force × working distance.",
      "Example: a 1000 kN press rated 6 mm above bottom gives only 581.61 kN at 20 mm."
    ],
    "limitations": [
      "Crank (eccentric) drives; link and knuckle presses have different curves.",
      "Press makers publish the official capacity curve; use it for final selection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Blanking happens near the bottom; drawing starts high in the stroke where capacity falls away quickly."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1386–1392, 1342. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-expansion-loop": {
    "purpose": "Thermal expansion of a straight pipe run between anchors, the force and stress if it were fully restrained (as the thermal stress tool), and the leg length of an L-bend or U-loop needed to absorb the growth within an allowable bending stress range by the guided-cantilever method.",
    "uses": [
      "Lay out an expansion loop for a steam or hot-water line",
      "Check whether an L-bend can absorb a run’s growth",
      "Estimate anchor loads before choosing bellows or loops"
    ],
    "users": [
      "Piping engineers",
      "Plant engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "L": "Length of straight pipe between fixed anchors.",
      "alpha": "Linear expansion coefficient of the pipe material.",
      "dT": "Change from installation to operating temperature.",
      "OD": "Outside diameter of the pipe.",
      "wt": "Wall thickness.",
      "E": "Elastic modulus at temperature.",
      "Sa": "Allowable displacement stress range for the piping code.",
      "type": "L-bend at the end of the run, or a symmetric U-loop."
    },
    "outputs": [
      "Thermal growth of the run",
      "Restrained stress and anchor force",
      "Loop leg length needed"
    ],
    "method": [
      "Growth Δ = α L ΔT.",
      "Fully restrained stress σ = E α ΔT; anchor force = σ × metal area.",
      "Guided-cantilever leg length to absorb displacement δ: L_leg = √(3 E D δ ÷ S_a).",
      "L-bend: δ = Δ; U-loop at mid-run: each leg absorbs Δ ÷ 2.",
      "Example: 50 m of pipe heated 150 K grows 90 mm; a U-loop needs legs about 4.5359 m long."
    ],
    "limitations": [
      "Simplified guided-cantilever estimate; final layouts need a piping flexibility analysis to the code.",
      "Guides and supports must allow the movement.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cold springing the loop by half the growth halves the hot anchor loads but not the stress range."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–378, 3401–3402. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-backlash-temperature": {
    "purpose": "Change in circular backlash of a spur gear pair when the housing and the gears expand differently: the change in centre distance of the housing bores, the growth of the gears’ pitch radii, the net change in operating centre distance and the resulting change in backlash (2 Δa tan φ), giving the hot backlash and a jamming check.",
    "uses": [
      "Set cold backlash for a gearbox with an aluminium housing",
      "Check plastic or bronze gears for jamming when warm",
      "Explain noise or rattle changes as a gearbox warms"
    ],
    "users": [
      "Gear designers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Module.",
      "z1": "Pinion teeth.",
      "z2": "Gear teeth.",
      "phi": "Pressure angle.",
      "j0": "Circular backlash at assembly temperature.",
      "ah": "Expansion coefficient of the housing (23 for aluminium, 11 for cast iron).",
      "dTh": "Rise in housing temperature from assembly to running.",
      "ag": "Expansion coefficient of the gears (11.5 for steel; plastics 50–100 or more).",
      "dTg": "Rise in gear temperature (gears usually run hotter than the housing)."
    },
    "outputs": [
      "Centre distance change from the housing",
      "Pitch radius growth of the gears",
      "Hot backlash and jamming check"
    ],
    "method": [
      "Standard centre distance a = m (z₁ + z₂) ÷ 2.",
      "Housing bores move apart by a α_h ΔT_h; the gears’ pitch radii together grow by a α_g ΔT_g.",
      "Net operating centre distance change Δa = a (α_h ΔT_h − α_g ΔT_g).",
      "Backlash change Δj = 2 Δa tan φ (handbook relation between centre distance and backlash); hot backlash = cold + Δj.",
      "Example: 20/60 teeth, module 2, go from 0.08 mm to 0.10009 mm of backlash when warm."
    ],
    "limitations": [
      "Uniform temperatures; tooth thickness growth is included through the pitch radius approach.",
      "Bearing clearances and shaft deflection also change running backlash.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An aluminium housing with steel gears gains backlash when warm; plastic gears in a steel housing lose it and can jam."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2163–2167, 375–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
