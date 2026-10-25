// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook32).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bearing-fit-clearance": {
    "purpose": "Operating radial internal clearance of a rolling bearing: the initial clearance range, the reduction from the inner ring expanding on an interference shaft fit and the outer ring contracting in an interference housing fit (as shares of the effective interference), the reduction from the inner ring running hotter than the outer, and the resulting operating clearance range with a preload check.",
    "uses": [
      "Choose a clearance group (normal, C3, C4) for a fit and temperature",
      "Check that a tight shaft fit will not preload the bearing",
      "Explain bearing overheating after a fit change"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "cmin": "Lower limit of the bearing’s radial internal clearance group (from the bearing maker for the size and group).",
      "cmax": "Upper limit of the clearance group.",
      "d": "Bore diameter.",
      "D": "Outside diameter.",
      "Ii": "Effective interference of the inner ring fit (measured interference less surface smoothing).",
      "fi": "Share of the inner ring interference that expands the raceway (about 0.7–0.9 for solid steel shafts).",
      "Io": "Effective interference of the outer ring in the housing (0 for a clearance fit).",
      "fo": "Share of the outer ring interference that contracts the raceway (about 0.6–0.8 for steel housings).",
      "dT": "Temperature difference between inner and outer ring when running.",
      "alpha": "Expansion coefficient of bearing steel.",
      "cminReq": "Least operating clearance you accept (0 = just no preload; negative values allow a small preload)."
    },
    "outputs": [
      "Clearance reduction from the fits",
      "Clearance reduction from temperature",
      "Operating clearance range and preload check"
    ],
    "method": [
      "Fit reduction = f_i × I_i + f_o × I_o.",
      "Thermal reduction = α ΔT d_m, with d_m = (d + D) ÷ 2 the mean raceway diameter.",
      "Operating clearance = initial clearance − fit reduction − thermal reduction (for both limits).",
      "Example: 25–40 µm initial clearance runs at 4.8–19.8 µm after the fit and a 5 K difference."
    ],
    "limitations": [
      "Approximate shares; the bearing maker’s method uses ring and shaft geometry.",
      "Thin-walled housings and hollow shafts change the shares.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the minimum goes negative, choose the next larger clearance group (C3, C4) or a looser fit."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2365–2416. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "overhung-load-check": {
    "purpose": "Overhung load check: shaft torque from power and speed, overhung load from the drive element’s pitch diameter and its tension factor (chain, gear, V-belt or flat belt), the catalogue allowable corrected for where the load actually sits on the shaft, and the resulting load on the outer bearing from the lever over the bearing span.",
    "uses": [
      "Check a sprocket or pulley on a gearbox output shaft",
      "Decide whether to move the hub closer or add an outboard bearing",
      "Compare chain and belt drives for shaft load"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power transmitted through the shaft.",
      "n": "Speed of the shaft.",
      "elem": "Type of element on the shaft; the factor allows for belt or chain tension above the transmitted pull.",
      "Dp": "Pitch diameter of the sprocket, gear or pulley.",
      "Fa": "Allowable overhung load from the gearbox or motor catalogue.",
      "Lc": "Distance from the outer bearing to where the catalogue allowable applies (often mid-shaft extension).",
      "La": "Distance from the outer bearing to the centre of the hub actually fitted.",
      "S": "Centre distance between the two bearings of the shaft."
    },
    "outputs": [
      "Torque and overhung load",
      "Allowable at the actual position",
      "Outer bearing load"
    ],
    "method": [
      "Torque T = P ÷ ω; overhung load = 2T ÷ D × factor.",
      "Allowable at the actual position ≈ catalogue allowable × L_c ÷ L_a (equal bending moment at the outer bearing).",
      "Outer bearing load = OHL × (S + L_a) ÷ S (lever over the bearing span).",
      "Example: 7.5 kW at 100 rpm on a 200 mm sprocket gives 7.162 kN against 7.5 kN allowed."
    ],
    "limitations": [
      "Simple lever correction; use the maker’s position factors where published.",
      "Factors are typical values for the element type; tensioning practice changes them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Mounting the hub tight against the shaft shoulder is often the cheapest way to cut bearing load."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2487–2556, 2365–2416. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "injection-moulding-estimate": {
    "purpose": "First estimate for an injection moulding job: clamp force from projected area of the cavities and runner and the cavity pressure with a margin, shot volume and mass against the barrel capacity, cooling time for the wall thickness from the plastic’s thermal diffusivity and the melt, mould and ejection temperatures, cycle time and output per hour.",
    "uses": [
      "Choose a moulding machine for a new mould",
      "Estimate cycle time and output for a quote",
      "See how wall thickness drives cycle time"
    ],
    "users": [
      "Moulding engineers",
      "Estimators",
      "Product engineers"
    ],
    "inputs": {
      "Ap": "Projected area of one part in the direction of mould opening.",
      "cav": "Number of cavities.",
      "Ar": "Projected area of the runner system.",
      "pc": "Mean pressure in the cavity (about 20–40 MPa for easy-flow materials and thick walls, 40–80 for thin walls and stiff materials).",
      "marg": "Margin on clamp force.",
      "Vp": "Volume of one part.",
      "Vr": "Volume of the runner (0 for a hot runner).",
      "rho": "Density of the melt.",
      "s": "Largest wall thickness of the part.",
      "a": "Thermal diffusivity of the plastic (about 0.07–0.12 mm²/s).",
      "Tm": "Melt temperature.",
      "Tw": "Mould surface temperature.",
      "Te": "Temperature at which the part can be ejected.",
      "tOther": "Time for filling, holding, mould movements and ejection.",
      "clamp": "Clamp force of the machine considered.",
      "barrel": "Maximum shot volume of the machine."
    },
    "outputs": [
      "Clamp force against the machine",
      "Shot volume and barrel use",
      "Cooling time, cycle and output"
    ],
    "method": [
      "Clamp force = (cavities × A_part + A_runner) × cavity pressure × (1 + margin).",
      "Shot = cavities × V_part + V_runner; barrel use = shot ÷ capacity (20–80% preferred).",
      "Cooling time t = s² ÷ (π² a) × ln[(4 ÷ π)(T_m − T_w) ÷ (T_e − T_w)] (plate cooling to ejection at the mid-plane).",
      "Cycle = cooling + other times; output = cavities × 3600 ÷ cycle.",
      "Example: 4 cavities need 968 kN of clamp and cool in 11.093 s, giving 754.2 parts per hour."
    ],
    "limitations": [
      "Estimates only; mould flow simulation gives cavity pressure and fill time properly.",
      "Cooling time assumes a flat wall cooled from both sides.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cooling time rises with the square of wall thickness: thinner, even walls pay back on every shot."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 584–592. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bearing-friction-oil-flow": {
    "purpose": "Heat from rolling bearings by the friction-coefficient method (torque = μ P d ÷ 2, as the bearing friction tool) plus other losses such as gear mesh or seals, and the circulating oil flow to carry that heat away at an allowed oil temperature rise (as the coolant heat-flow tool with oil properties).",
    "uses": [
      "Size a circulating oil system for a gearbox or spindle",
      "Estimate bearing heat for a thermal check",
      "Check whether splash lubrication is enough"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "nb": "Number of bearings on the circuit.",
      "P": "Equivalent load on each bearing.",
      "d": "Bore diameter of the bearings.",
      "mu": "Friction coefficient referred to the bore (about 0.001 cylindrical roller, 0.0015 deep groove ball, 0.002 tapered and spherical roller).",
      "rpm": "Shaft speed.",
      "other": "Other heat going into the oil.",
      "dT": "Temperature rise of the oil through the machine.",
      "cp": "Specific heat of the oil.",
      "rho": "Oil density."
    },
    "outputs": [
      "Bearing friction torque and power loss",
      "Total heat",
      "Oil flow required"
    ],
    "method": [
      "Friction torque per bearing M = 0.5 μ P d.",
      "Bearing loss = M ω × number of bearings; total heat = bearings + other losses.",
      "Oil flow Q = heat ÷ (ρ c_p ΔT).",
      "Example: the bearings lose 58.905 W; with other losses the oil needs 0.93976 L/min at a 10 K rise."
    ],
    "limitations": [
      "Constant friction coefficient; at high speed and light load, lubricant churning dominates.",
      "Oil flow for heat only; bearings also need a minimum flow for lubrication.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the flow is very low, splash or grease lubrication may carry the heat without a circulating system."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2365–2440. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-brake-setup": {
    "purpose": "Air-bending set-up for a press brake: the die opening from a chosen multiple of thickness (rounded up to a common die opening), the inside radius that air bending produces (a share of the die opening), the shortest flange that still spans the die, the bending force by the handbook-style formula (as the press brake force tool), force per metre and the press capacity check.",
    "uses": [
      "Choose a die for a new sheet-metal part",
      "Check the minimum flange a die allows",
      "Confirm press brake tonnage before bending"
    ],
    "users": [
      "Press brake operators",
      "Fabrication supervisors",
      "Sheet-metal designers"
    ],
    "inputs": {
      "t": "Sheet thickness.",
      "uts": "Tensile strength of the sheet.",
      "L": "Length of the bend.",
      "vr": "Die opening as a multiple of thickness (about 6–8 for thin sheet, 8–12 for plate).",
      "rf": "Inside radius produced by air bending as a share of die opening (about 0.15–0.16 mild steel, 0.2 or more for stainless and aluminium).",
      "flf": "Shortest flange as a share of die opening (so the flange still bridges the die).",
      "k": "Air-bending factor in the force formula.",
      "cap": "Press brake rated force.",
      "dieRate": "Load rating of the die per metre of length."
    },
    "outputs": [
      "Die opening chosen",
      "Inside radius and minimum flange",
      "Bending force, force per metre and checks"
    ],
    "method": [
      "Die opening = multiple × t, rounded up to a common opening (6, 8, 10, 12, 16, 20, 24, 30, 35, 40, 50, 60, 80, 100, 120, 160, 200, 250 mm).",
      "Inside radius ≈ share × die opening; minimum flange ≈ share × die opening.",
      "Force F = k L t² UTS ÷ V (as the press brake force tool); force per metre = F ÷ L.",
      "Example: 3 mm sheet on a 24 mm die bends to about 3.84 mm inside radius with 224.44 kN."
    ],
    "limitations": [
      "Air bending rules of thumb; bottoming and coining need several times more force.",
      "Radius and flange shares vary with material and tooling.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A wider die lowers force and raises the inside radius; a narrower die does the reverse."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1353, 1383–1386. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gearbox-selection-check": {
    "purpose": "Selection check of a catalogue gearbox: output speed and torque from motor power, ratio and efficiency, the mechanical rating needed with the service factor against the catalogue rating, the thermal rating against the actual power (thermal ratings are not multiplied by the service factor), and output torque with service factor against the catalogue torque.",
    "uses": [
      "Check a gearbox chosen from a catalogue",
      "Explain why a gearbox overheats while mechanically adequate",
      "Compare gearbox sizes for a duty"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Rated power of the driving motor (or the actual absorbed power if known and limited).",
      "n1": "Input shaft speed.",
      "i": "Gear ratio.",
      "eta": "Gearbox efficiency.",
      "SF": "Service factor for the driven machine, hours per day and starts per hour (from the gearbox catalogue).",
      "Pmech": "Mechanical power rating of the gearbox at this input speed and ratio (catalogue).",
      "Pth": "Thermal power rating for the mounting and ambient (catalogue).",
      "T2r": "Rated output torque (catalogue)."
    },
    "outputs": [
      "Output speed and torque",
      "Mechanical rating needed",
      "Thermal and torque checks"
    ],
    "method": [
      "Output speed = n₁ ÷ i; output torque T₂ = P η ÷ ω₂.",
      "Mechanical rating needed = P × SF against the catalogue mechanical rating.",
      "Thermal: the actual power against the thermal rating (no service factor).",
      "Torque: T₂ × SF against the catalogue output torque.",
      "Example: 7.5 kW through 14.5:1 gives 673.23 N·m at 100 rpm; it needs a 10.5 kW mechanical rating."
    ],
    "limitations": [
      "Catalogue ratings and service factors come from the gearbox maker; they differ between makers.",
      "Overhung and thrust loads on the shafts are separate checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A gearbox can pass mechanically and still overheat: the thermal check often governs at high input speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3339–3340, 3304–3313. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "riveted-joint-design": {
    "purpose": "Design of a riveted lap or butt joint: strength of the rivets per pitch in shear and crushing, the balanced pitch at which plate tearing equals the rivet strength, joint efficiency at that pitch (as the riveted joint tool), the number of pitches along the joint length and the joint capacity against the load, with the minimum pitch of three diameters.",
    "uses": [
      "Lay out a riveted lap or butt joint",
      "Choose rows and rivet size for a load",
      "Check an old riveted structure"
    ],
    "users": [
      "Structural engineers",
      "Fabrication supervisors",
      "Maintenance engineers"
    ],
    "inputs": {
      "t": "Thickness of the (thinner) plate.",
      "d": "Diameter of the rivet hole (the driven rivet fills it).",
      "rows": "Number of rivet rows within one pitch.",
      "shear": "Shear planes each rivet carries.",
      "st": "Allowable tensile stress of the plate.",
      "tau": "Allowable shear stress of the rivets.",
      "sc": "Allowable bearing stress between rivet and plate.",
      "Lj": "Length of the joint across the load.",
      "F": "Total load the joint must carry."
    },
    "outputs": [
      "Rivet strength per pitch",
      "Balanced pitch and efficiency",
      "Joint capacity against the load"
    ],
    "method": [
      "Per pitch: rivet shear = rows × planes × π d² ÷ 4 × τ; crushing = rows × d t σ_c; rivet value R = the smaller.",
      "Balanced pitch: (p − d) t σ_t = R, so p = d + R ÷ (t σ_t); not less than 3d.",
      "Efficiency = R ÷ (p t σ_t) (as the riveted joint tool); pitches = ⌊L ÷ p⌋; capacity = pitches × weakest per pitch.",
      "Example: 2 rows of 17 mm rivets in 10 mm plate balance at a 51 mm pitch, 59.341% efficient."
    ],
    "limitations": [
      "Static design by allowable stresses; fatigue and slip need separate checks.",
      "Edge distances and gauges must follow the applicable code.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More rows raise the rivet value and allow a wider pitch, increasing efficiency."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1735–1745. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "storage-tank-shell": {
    "purpose": "Shell plate thickness for an open-top or low-pressure vertical cylindrical storage tank under its liquid head, course by course, by the widely used one-foot method (API 650 style) with joint efficiency, corrosion allowance and a minimum thickness, with tank capacity and shell steel mass — for preliminary comparison.",
    "uses": [
      "Estimate plate thicknesses for a water or oil tank",
      "Compare tank diameter and height options by steel weight",
      "Check an existing tank for a heavier liquid"
    ],
    "users": [
      "Mechanical engineers",
      "Estimators",
      "Plant engineers"
    ],
    "inputs": {
      "D": "Nominal tank diameter.",
      "Hl": "Height from the bottom to the design liquid level (top of shell or overflow).",
      "G": "Specific gravity of the stored liquid (1.0 for water; use the test water case too).",
      "S": "Allowable stress of the shell plate.",
      "E": "Joint efficiency of the vertical welds.",
      "CA": "Corrosion allowance.",
      "tmin": "Minimum nominal thickness for the tank diameter (from the tank standard).",
      "hc": "Height of each shell course.",
      "rhoS": "Density of the shell steel."
    },
    "outputs": [
      "Thickness of each course",
      "Tank capacity",
      "Shell steel mass"
    ],
    "method": [
      "One-foot method: t = 4.9 D (H − 0.3) G ÷ (S E) + CA (t in mm, D and H in m, S in MPa), with H the liquid height above the bottom of the course.",
      "Each course thickness is at least the minimum thickness.",
      "Capacity = π D² ÷ 4 × liquid height; shell mass = Σ π D × course height × thickness × density.",
      "Example: a 20 m × 12 m water tank needs 9.9309 mm at the bottom course and holds 3,769.9 m³."
    ],
    "limitations": [
      "Preliminary comparison only; storage tanks must be designed to the applicable standard (API 650, AS 1692, EN 14015) with wind, seismic, roof and bottom design.",
      "Shell stability and openings are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thickness grows with diameter and depth: a wider, lower tank is not always lighter once the minimum thickness governs the upper courses."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 290–294, 3021–3026. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "milling-cost-per-part": {
    "purpose": "Cost of a milling operation per part: cutting time from the volume to remove and the removal rate (from width, depth and table feed), tool edges used from the tool life at those conditions, tool change time and edge cost, non-cutting time, set-up spread over the batch, and the machine rate, with the cost breakdown.",
    "uses": [
      "Quote a milled part",
      "Compare a faster cut that wears tools quicker",
      "See what share of cost is tooling, cutting and set-up"
    ],
    "users": [
      "Estimators",
      "Manufacturing engineers",
      "Production managers"
    ],
    "inputs": {
      "Vol": "Volume of metal removed per part.",
      "ae": "Radial width of cut.",
      "ap": "Axial depth of cut.",
      "vf": "Table feed (from a milling cut plan).",
      "Tl": "Tool life in cutting minutes at these speeds and feeds (from tests or the tool maker).",
      "z": "Number of inserts replaced at each tool change.",
      "edge": "Cost of one cutting edge.",
      "tch": "Time to index or change all the edges.",
      "tnc": "Rapids, approach, probing and tool changes per part.",
      "rate": "Machine plus operator rate.",
      "setup": "Set-up time for the batch.",
      "batch": "Parts per batch."
    },
    "outputs": [
      "Removal rate and cutting time",
      "Tool changes per part",
      "Cost per part breakdown"
    ],
    "method": [
      "Removal rate Q = a_e a_p v_f; cutting time = volume ÷ Q.",
      "Tool changes per part = cutting time ÷ tool life.",
      "Cost = rate × (cutting + non-cutting + changes × change time + set-up ÷ batch) + changes × edges × edge cost.",
      "Example: removing 120 cm³ takes 2.6178 min of cutting; the part costs about 10.767."
    ],
    "limitations": [
      "Single operation at constant conditions; finishing passes need their own line.",
      "Tool life must match the speeds and feeds used.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When set-up dominates, bigger batches pay; when tooling dominates, slower speeds may be cheaper."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101, 1146–1152. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
