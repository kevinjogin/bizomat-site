// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook45).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "air-main-sizing": {
    "purpose": "Sizing of a compressed-air main: velocity, Reynolds number, friction factor and pressure drop for a bore (as the compressed-air pipe drop tool), the smallest standard bore that keeps both the drop and the velocity within your limits (searched through common nominal bores), the check of the bore you chose, and the receiver volume to cover a peak demand above the compressor output over a pressure band (as the air receiver tool).",
    "uses": [
      "Size a new compressed-air ring main or header",
      "Check an existing line after adding machines",
      "Size a receiver for a peak demand"
    ],
    "users": [
      "Plant engineers",
      "Maintenance engineers",
      "Energy managers"
    ],
    "inputs": {
      "Q": "Flow of free air the main carries at peak.",
      "p": "Gauge pressure in the main.",
      "T": "Air temperature in the main.",
      "L": "Pipe length plus the equivalent length of bends, tees and valves.",
      "eps": "Absolute roughness of the pipe bore.",
      "d": "Inside diameter of the pipe you intend to use.",
      "dpPct": "Largest pressure drop you allow along this main (often 1–5% of line pressure).",
      "vMax": "Largest air velocity you allow in the main (about 6–10 m/s for mains).",
      "deficit": "How far the peak demand exceeds compressor output.",
      "tPeak": "How long the peak lasts.",
      "p1": "Receiver pressure when the peak begins.",
      "p2": "Least pressure the users can accept."
    },
    "outputs": [
      "Velocity and pressure drop in the chosen bore",
      "Smallest standard bore that meets the limits",
      "Receiver volume for the peak"
    ],
    "method": [
      "Actual flow and density from free air at line pressure and temperature; Re and Colebrook friction factor; Δp = f (L ÷ d) ρ v² ÷ 2 (as the compressed-air pipe drop tool).",
      "Search the common bores 15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250 and 300 mm for the first that meets both limits.",
      "Receiver V = t × deficit × p_atm ÷ (p₁ − p₂) (as the air receiver tool).",
      "Example: 5 m³/min in 50 mm runs at 5.4581 m/s with 0.05902 bar drop; the smallest bore that passes is 50 mm; the receiver needs 1.351 m³."
    ],
    "limitations": [
      "Equivalent length must include fittings; long branch lines need their own check.",
      "Steady flow; compressor control band and dryer drops are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A ring main halves the flow path and lets a smaller bore meet the same drop."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3036–3041, 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "anodizing-plan": {
    "purpose": "Plan of a sulfuric acid anodising job: growth rate and time to thickness by the 720 rule with your efficiency factor, build-up per surface (as the anodising time tool), current for the load against the rectifier capacity, the electrical heat the tank cooling must remove at the bath voltage, loads and line hours for the batch, energy, and cost per part from energy and line time.",
    "uses": [
      "Plan an anodising batch",
      "Size the bath chiller for a bigger load",
      "Quote anodising per part"
    ],
    "users": [
      "Platers and anodisers",
      "Process engineers",
      "Estimators"
    ],
    "inputs": {
      "J": "Anodic current density (about 1.2–2 A/dm² for sulfuric acid anodising).",
      "thick": "Total coating thickness wanted.",
      "eff": "Factor on the 720 rule for alloy and bath (100% for the rule as written; calibrate from thickness checks).",
      "ap": "Anodised area of one part.",
      "np": "Parts on one jig load.",
      "batch": "Parts to anodise.",
      "rect": "Largest current the rectifier supplies.",
      "V": "Voltage across the bath at this current density.",
      "chill": "Heat the bath chiller or cooling coil can remove.",
      "handle": "Time to rack, rinse, seal and unload a load.",
      "pE": "Electricity price.",
      "rate": "Labour and overhead per hour of line time."
    },
    "outputs": [
      "Growth rate, time and build-up",
      "Current against the rectifier and heat against the cooling",
      "Loads, hours and cost per part"
    ],
    "method": [
      "720 rule: thickness (mil) = A/ft² × minutes ÷ 720, giving growth rate (µm/min) = 25.4 × 9.290 ÷ 720 × J × efficiency (as the anodising time tool); build-up per surface ≈ thickness ÷ 3.",
      "Current = J × area per part × parts per load; bath heat ≈ V × I.",
      "Loads = batch ÷ parts per load (rounded up); hours = loads × (time + handling) ÷ 60; cost per part = (energy × price + hours × rate) ÷ batch.",
      "Example: 20 µm takes 40.682 min at 75 A per load, putting 1.35 kW into the bath; each part costs about 1.1182."
    ],
    "limitations": [
      "Rule of thumb for Type II sulfuric acid anodising; hard anodising and other baths differ.",
      "Costs exclude chemicals, dyes, sealing and waste treatment.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Most of the electrical power ends up as heat in the bath: the chiller often limits the load before the rectifier does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1500–1516. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "repair-or-replace": {
    "purpose": "Replacement decision between an existing machine (the defender) and a new one (the challenger): the defender’s equivalent uniform annual cost from its present market value, first-year running cost rising by a yearly gradient (using the gradient factor, as the interest factors tool) and its salvage at the end of its remaining life, the challenger’s equivalent annual cost from price, running cost and salvage (as the EUAC comparison tool), the yearly difference and the decision.",
    "uses": [
      "Decide whether to replace an ageing machine",
      "Justify a replacement budget",
      "Find how fast running cost must rise to justify replacement"
    ],
    "users": [
      "Maintenance managers",
      "Engineering managers",
      "Finance analysts"
    ],
    "inputs": {
      "rate": "Interest rate or minimum acceptable rate of return.",
      "mvD": "What the old machine would fetch if sold now (its opportunity cost).",
      "aD": "Operating and maintenance cost of the old machine next year.",
      "gD": "How much that cost rises each year after.",
      "sD": "What the old machine will fetch at the end of its remaining life.",
      "nD": "Years the old machine could still run.",
      "pC": "Price of the new machine installed.",
      "aC": "Yearly operating and maintenance cost of the new machine.",
      "sC": "Salvage of the new machine at the end of its life.",
      "nC": "Life of the new machine."
    },
    "outputs": [
      "Defender equivalent annual cost",
      "Challenger equivalent annual cost",
      "Yearly difference and decision"
    ],
    "method": [
      "Capital recovery (A/P, i, n) = i (1 + i)ⁿ ÷ [(1 + i)ⁿ − 1]; sinking fund (A/F) = i ÷ [(1 + i)ⁿ − 1]; gradient (A/G) = 1 ÷ i − n ÷ [(1 + i)ⁿ − 1] (as the interest factors tool).",
      "Defender EUAC = MV (A/P) + A₁ + G (A/G) − salvage (A/F).",
      "Challenger EUAC = P (A/P) + running cost − salvage (A/F) (as the EUAC comparison tool).",
      "Example: keeping costs 20,671 a year, replacing 17,232; replace it, saving 3,438.9 a year."
    ],
    "limitations": [
      "Before tax; repeatability of the challenger is assumed when lives differ.",
      "Productivity and quality differences must be added as costs or savings.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The old machine’s sunk cost does not matter: only what it could be sold for now."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–146. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "make-or-buy": {
    "purpose": "Make-or-buy comparison: in-house unit cost from cycle time at your machine-hour rate plus material, with tooling and set-up as fixed cost; bought cost from the supplier price plus any one-off tooling or qualification charge; total cost at the planned quantity, the break-even quantity where the two totals meet (as the process break-even tool), and the cheaper option with its saving.",
    "uses": [
      "Decide whether to bring a bought part in-house",
      "Check a supplier quote against your own cost",
      "Find the volume at which making pays"
    ],
    "users": [
      "Manufacturing engineers",
      "Purchasing managers",
      "Business owners"
    ],
    "inputs": {
      "qty": "Number of parts needed over the period compared.",
      "fixM": "One-off cost to make in-house: tooling, fixtures, programming and set-ups.",
      "tc": "Machine time per part including handling.",
      "mhr": "Hourly rate of the machine and operator (for example from the machine hour rate tool).",
      "mat": "Material and bought-in items per part.",
      "price": "Supplier’s price per part.",
      "fixB": "One-off charge for buying: supplier tooling, first-article and qualification.",
      "freight": "Freight, receiving inspection and handling per bought part."
    },
    "outputs": [
      "In-house and bought unit variable cost",
      "Totals at the planned quantity",
      "Break-even quantity and decision"
    ],
    "method": [
      "Make: variable cost = cycle time ÷ 60 × rate + material; total = fixed + variable × quantity.",
      "Buy: variable cost = price + freight; total = one-off charge + variable × quantity.",
      "Break-even quantity = (fixed_make − fixed_buy) ÷ (variable_buy − variable_make) (as the process break-even tool).",
      "Example: making costs 10 a part plus 6000 fixed; buying 12.5; break-even at 1,800 parts; at 2000 make, saving 500."
    ],
    "limitations": [
      "Linear costs; capacity limits, overtime and learning effects change the picture.",
      "Strategic factors (know-how, supply risk, lead time) are not costed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the machine would otherwise stand idle, use its marginal rate, not the full machine-hour rate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 143–146, 1153–1160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "block-and-tackle-check": {
    "purpose": "Check of a rope block and tackle (simple purchase with n supporting parts): ideal pull, overall efficiency of the reeving from the efficiency of each sheave, actual fast-line pull (as the hoist mechanical advantage tool with that overall efficiency), mechanical advantage, rope pulled per metre of lift, the rope safety factor on the fast line, and for hand operation the pull against your limit for one person.",
    "uses": [
      "Check a hand-hauled block and tackle",
      "Choose the number of falls for a load",
      "Check the rope on a hoisting purchase"
    ],
    "users": [
      "Riggers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "mass": "Mass of the load lifted.",
      "n": "Number of rope parts between the blocks that carry the load.",
      "e": "Efficiency of one sheave and its bearing (about 96% for roller-bearing sheaves, 90–95% plain bushes).",
      "MBL": "Minimum breaking load of the rope.",
      "SF": "Safety factor you require on the rope (from the lifting standard).",
      "op": "Whether the fast line goes to a winch or is pulled by hand.",
      "hand": "Largest sustained pull you allow for one person (your value from manual handling guidance)."
    },
    "outputs": [
      "Ideal pull and overall efficiency",
      "Actual pull and mechanical advantage",
      "Rope safety factor and hand-pull check"
    ],
    "method": [
      "Ideal pull = W ÷ n; overall efficiency η = (1 − eⁿ) ÷ [n (1 − e)] for n sheaves in the reeving.",
      "Actual pull = ideal pull ÷ η (as the hoist mechanical advantage tool with that efficiency); mechanical advantage = W ÷ pull.",
      "Rope pulled per metre of lift = n; rope safety factor = MBL ÷ pull.",
      "Example: 500 kg on 4 parts needs 1,301.9 N at the fast line (94.158% efficient); rope factor 15.362."
    ],
    "limitations": [
      "Static lifting at slow speed; acceleration and swinging add load.",
      "Fast line leaving the fixed block; other reevings change the count.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each extra part lowers the pull less than the last, because each extra sheave adds friction."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 170–171, 2613–2650. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "restrained-bar-thermal-check": {
    "purpose": "Check of a round bar or member held at both ends while its temperature changes: free thermal strain, restrained thermal stress and the force on the supports (as the thermal stress tool), the yield safety factor, the buckling load of the member by Euler or Johnson for its effective length (as the column buckling tool), the buckling safety factor against the thermal force, and the temperature rise at which yielding and buckling would begin.",
    "uses": [
      "Check a pipe or rod anchored at both ends",
      "Find the temperature rise a tie rod can take",
      "Decide whether an expansion joint is needed"
    ],
    "users": [
      "Design engineers",
      "Piping engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Diameter of the round bar (solid).",
      "L": "Length between the supports that stop it growing.",
      "K": "Effective length factor for the end fixity (0.5 fixed at both ends, 1 pinned).",
      "E": "Elastic modulus.",
      "alpha": "Linear expansion coefficient.",
      "dT": "Rise in temperature from the fitting temperature.",
      "restraint": "Share of the free growth the supports prevent (100% for rigid anchors).",
      "Sy": "Yield strength at temperature.",
      "req": "Safety factor you require on both yield and buckling."
    },
    "outputs": [
      "Thermal stress, force and yield factor",
      "Buckling load and factor",
      "Temperature rise at yield and at buckling"
    ],
    "method": [
      "Thermal stress σ = E α ΔT × restraint; force = σ A (as the thermal stress tool).",
      "Buckling stress by Euler for slender bars or Johnson for intermediate ones, with slenderness K L ÷ r (as the column buckling tool); buckling factor = P_cr ÷ force.",
      "Temperature rise at yield = S_y ÷ (E α × restraint); at buckling = σ_cr ÷ (E α × restraint).",
      "Example: 40 K gives 96 MPa and 120.64 kN; the bar buckles at 71.185 K and yields at 104.17 K."
    ],
    "limitations": [
      "Uniform temperature along the bar; local hot spots and bowing from uneven heating are not covered.",
      "Real supports are not fully rigid: the actual restraint is often less.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Long slender members buckle long before they yield: a guide or an expansion loop is then the answer."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–376, 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "buffer-stop-design": {
    "purpose": "Design of an end buffer for a moving carriage, trolley or crane: kinetic energy at impact (as the impact load tool, moving mode), extra energy from a drive force that keeps pushing through the stroke, peak buffer force and deceleration for a spring buffer (force rising linearly) or a hydraulic buffer (near-constant force at its efficiency), the stroke needed to stay within your deceleration limit, and checks of force and deceleration.",
    "uses": [
      "Size buffers for a crane or transfer car",
      "Check an end stop for a faster speed",
      "Compare spring and hydraulic buffers"
    ],
    "users": [
      "Machine designers",
      "Crane engineers",
      "Safety engineers"
    ],
    "inputs": {
      "mass": "Mass of the moving carriage and its load.",
      "v": "Speed at which it reaches the buffer (often a share of full speed, from the standard you follow).",
      "Fd": "Drive or gravity force that keeps pushing during the stroke (0 if the drive is cut).",
      "type": "Hydraulic buffers give a near-constant force; springs and elastomers build force with stroke.",
      "eta": "How close the hydraulic buffer comes to a constant force (force = energy ÷ (efficiency × stroke)).",
      "s": "Working stroke of the buffer.",
      "aMax": "Largest deceleration the load and people allow.",
      "Fmax": "Largest force the end stop and its fixings can take."
    },
    "outputs": [
      "Impact and total energy",
      "Peak force and deceleration for the stroke",
      "Stroke needed for the deceleration limit"
    ],
    "method": [
      "Kinetic energy E = ½ m v² (as the impact load tool, moving mode); total energy = E + F_d s.",
      "Spring: peak force = 2E_total ÷ s; hydraulic: peak force ≈ E_total ÷ (η s).",
      "Peak deceleration = (peak force − F_d) ÷ m; stroke for the limit found by search.",
      "Example: 2000 kg at 1 m/s carries 1,000 J; a 100 mm hydraulic buffer peaks at 11.111 kN and 0.56651 g."
    ],
    "limitations": [
      "Rigid carriage and end stop; structure flexibility adds stroke and lowers force.",
      "Spring buffers return energy: rebound must be acceptable.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A hydraulic buffer of the same stroke has about half the peak force of a spring buffer."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 179–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gas-vessel-temperature-check": {
    "purpose": "Pressure change of a fixed volume of gas with temperature: the pressure at the hot condition from the gas law at constant volume (as the gas law tool with equal volumes), the mass of gas held, the pressure rise against the vessel rating or relief setting, and the highest fill pressure at the filling temperature that keeps the hot pressure within the rating.",
    "uses": [
      "Check an air or nitrogen vessel left in the sun",
      "Set the fill pressure for a gas spring or accumulator",
      "Check a sealed enclosure for heating"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Safety engineers"
    ],
    "inputs": {
      "V": "Internal volume of the vessel.",
      "p1": "Gauge pressure when filled.",
      "T1": "Gas temperature at filling.",
      "T2": "Highest gas temperature in service (sun, process heat, fire case).",
      "patm": "Atmospheric pressure.",
      "R": "Specific gas constant (287 air, 297 nitrogen, 2077 helium).",
      "rating": "Maximum allowable working pressure or relief setting."
    },
    "outputs": [
      "Pressure at the hot condition",
      "Mass of gas",
      "Rating check and the highest fill pressure"
    ],
    "method": [
      "Constant volume: P₂ = P₁ T₂ ÷ T₁ in absolute units (as the gas law tool with V₂ = V₁).",
      "Mass m = P₁ V ÷ (R T₁).",
      "Highest fill pressure = (rating + p_atm) × T₁ ÷ T₂ − p_atm.",
      "Example: filled to 200 bar at 20 °C, the vessel reaches 227.43 bar at 60 °C against 230 bar; fill to at most 202.26 bar."
    ],
    "limitations": [
      "Ideal gas; at very high pressures use a compressibility factor.",
      "Uniform gas temperature; the vessel itself is taken as rigid.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pressure rises about one third of a percent per kelvin at room temperature: a 40 K rise adds about 14%."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "blow-off-nozzle-cost": {
    "purpose": "Consumption of open blow-off nozzles or pipe ends: jet velocity, choked flow and free-air flow through each opening (as the escaping air velocity tool), total flow for the nozzles at their duty, share of compressor capacity, compressor power and yearly energy cost from your specific power, and the saving from changing to engineered nozzles of a known flow.",
    "uses": [
      "Cost the open pipes used for blow-off on a line",
      "Justify engineered air nozzles",
      "Check that blow-off does not overload the compressor"
    ],
    "users": [
      "Energy managers",
      "Maintenance engineers",
      "Production engineers"
    ],
    "inputs": {
      "p1": "Gauge pressure behind the openings.",
      "p2": "Absolute pressure outside (atmosphere).",
      "T": "Air temperature.",
      "k": "Ratio of specific heats (1.4 for air).",
      "d": "Bore of each open pipe or nozzle orifice.",
      "Cd": "Discharge coefficient (about 0.6–0.65 for drilled holes and pipe ends).",
      "n": "Number of openings blowing.",
      "duty": "Share of running time the air flows.",
      "spec": "Compressor input power per m³/min of free air.",
      "Qc": "Air delivered by the compressors, as free air.",
      "hours": "Hours per year the line runs.",
      "price": "Electricity price.",
      "Qeng": "Consumption (as free air) of the engineered nozzle you would fit instead (from its data sheet; 0 if none)."
    },
    "outputs": [
      "Jet velocity and flow per opening",
      "Total flow, share of capacity, power and cost",
      "Saving with engineered nozzles"
    ],
    "method": [
      "Choked when p₂ ÷ p₁ < [2 ÷ (k + 1)]^(k/(k−1)); jet velocity sonic, flow ṁ = C_d A p₁ √(k ÷ R T) [2 ÷ (k + 1)]^((k+1)/(2(k−1))), as free air (as the escaping air velocity tool).",
      "Average flow = per opening × openings × duty; power = flow (m³/min) × specific power; cost = power × hours × price.",
      "Saving = (flow now − engineered flow × openings × duty) × specific power × hours × price.",
      "Example: each 2 mm opening blows 168.16 L/min; 6 at 50% duty use 5.0448% of the compressor and cost 3,279.1 a year."
    ],
    "limitations": [
      "Open discharge to atmosphere; long or small supply hoses lower the pressure at the opening.",
      "Engineered nozzle flow must be taken at the same pressure.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Lowering the blow-off pressure or switching air off between parts often saves more than any nozzle change."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3037–3038, 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
