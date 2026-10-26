// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook39).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "sine-bar-setup": {
    "purpose": "Set-up of a sine bar or sine plate: the height difference between the rollers for the angle (as the sine bar tool), the stack rounded to the resolution of the gauge-block set (and checked as buildable by the gauge block stack tool), the angle actually set by the rounded stack, the angle change per micrometre of height, the total angle error from rounding plus your stack tolerance, and the check against the angle tolerance, with a warning above 45° where sine bars lose sensitivity.",
    "uses": [
      "Set a sine bar to inspect or grind an angle",
      "Find how accurately an angle can be set",
      "Check whether a longer sine bar is needed"
    ],
    "users": [
      "Inspectors",
      "Toolmakers",
      "Machinists"
    ],
    "inputs": {
      "L": "Distance between the roller centres of the sine bar or plate (common sizes 100, 200, 250 mm or 5, 10 in).",
      "angle": "Angle the work must be set to.",
      "res": "Smallest step the gauge-block set can build (0.0005 mm for an 88-piece metric set).",
      "tolS": "Combined length tolerance of the blocks in the stack (from the block grade; your value).",
      "angTol": "Tolerance on the angle being inspected or ground."
    },
    "outputs": [
      "Exact and rounded stack height",
      "Angle set and the error from rounding",
      "Total angle error against the tolerance"
    ],
    "method": [
      "Height H = L sin θ (as the sine bar tool); stack = H rounded to the set resolution.",
      "Angle set θ′ = sin⁻¹(stack ÷ L); rounding error = θ′ − θ.",
      "Sensitivity = 0.001 ÷ (L cos θ) radians per micrometre; total error = |rounding error| + stack tolerance × sensitivity.",
      "Example: 30° on a 200 mm bar needs a 100 mm stack; the set-up error is about 0.29772″ against ±10″."
    ],
    "limitations": [
      "Roller and bar errors and the surface plate flatness add to the error.",
      "Above about 45° a small height error gives a large angle error: use an angle block or a compound set-up.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A longer sine bar lowers the angle error per micrometre in proportion to its length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 676–682, 705–708. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "internal-taper-inspection": {
    "purpose": "Inspection of an internal taper (ring gauge, socket or bore) with a small and a large precision ball: the included angle, diametral taper and diameter at the top face from the two depth readings (as the taper balls tool), the depth difference expected at the nominal angle, and accept or reject against the angle and top-diameter tolerances.",
    "uses": [
      "Inspect a taper socket or ring gauge",
      "Check a machine spindle taper",
      "Set limits for a two-ball taper check"
    ],
    "users": [
      "Inspectors",
      "Toolmakers",
      "Quality engineers"
    ],
    "inputs": {
      "d1": "Diameter of the small ball (it sits deeper).",
      "d2": "Diameter of the large ball.",
      "h1": "Measured depth from the top face down to the top of the small ball.",
      "h2": "Measured depth from the top face down to the top of the large ball (negative if it stands above the face).",
      "angN": "Included angle on the drawing.",
      "angT": "Plus-or-minus tolerance on the included angle.",
      "topN": "Diameter at the top face on the drawing.",
      "topT": "Plus-or-minus tolerance on that diameter."
    },
    "outputs": [
      "Included angle, taper and top diameter from the readings",
      "Depth difference expected at the nominal angle",
      "Accept or reject"
    ],
    "method": [
      "sin(α ÷ 2) = (R₂ − R₁) ÷ [(h₁ − h₂) − (R₂ − R₁)] (as the taper balls tool).",
      "Diametral taper = 2 tan(α ÷ 2); top diameter from the large ball’s contact position.",
      "Expected depth difference at the nominal angle = (R₂ − R₁) ÷ sin(α_N ÷ 2) + (R₂ − R₁).",
      "Example: the readings give 23.074° and 28.577 mm at the top against 23° and 28.6 mm."
    ],
    "limitations": [
      "Ball diameter errors and depth-gauge squareness affect the result.",
      "Assumes a straight (conical) bore; check bellmouth with more balls.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the angle is right but the top diameter is off, the taper sits too deep or too shallow rather than being the wrong shape."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 682–691. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-milling-plan": {
    "purpose": "Plan of helical thread milling with a single-form or multi-form cutter: spindle speed from cutting speed (held to the machine maximum), feed at the cutting edge, tool-centre path diameter and the programmed centre feed corrected for the path (as the thread milling path tool), radial passes for the thread depth at your largest radial step, milling time per thread and for the batch with approach and retract time, and the cutter-size check for internal threads.",
    "uses": [
      "Program a thread milling cycle",
      "Compare thread milling with tapping for a batch",
      "Check cutter size for a small internal thread"
    ],
    "users": [
      "CNC programmers",
      "Process planners",
      "CNC machinists"
    ],
    "inputs": {
      "type": "Internal (in a hole) or external (on a boss) thread.",
      "D": "Major diameter of the thread.",
      "P": "Pitch.",
      "L": "Length of thread to mill.",
      "dc": "Cutting diameter of the thread mill.",
      "z": "Number of cutting flutes.",
      "vc": "Cutting speed for the cutter and material.",
      "fz": "Feed per tooth at the cutting edge.",
      "nmax": "Highest spindle speed.",
      "apMax": "Largest radial depth the cutter takes in one pass (your value for the cutter and material).",
      "approach": "Time for approach, arc-in, arc-out and retract per thread.",
      "holes": "Number of threads in the batch."
    },
    "outputs": [
      "Spindle speed, edge feed and programmed centre feed",
      "Radial passes and helical revolutions",
      "Time per thread and for the batch"
    ],
    "method": [
      "n = min(1000 v_c ÷ π d_c, n_max); edge feed f_e = n z f_z.",
      "Path diameter = D − d_c (internal) or D + d_c (external); centre feed f_c = f_e × path diameter ÷ D (as the thread milling path tool).",
      "Thread depth = 0.5413P (internal) or 0.6134P (external); radial passes = depth ÷ largest step (rounded up).",
      "Time per thread = (L ÷ P × passes) × helix length ÷ f_c + approach; batch = threads × time.",
      "Example: 2,728.4 rpm with a programmed feed of 196.44 mm/min mills the thread in 2 passes, 120.15 s per thread."
    ],
    "limitations": [
      "Single-form cutter making one helix per pass; multi-form cutters cover several pitches per revolution.",
      "Deflection of long, small cutters may need extra spring passes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Forgetting the path-diameter correction overfeeds an internal thread by the ratio D ÷ (D − d_c)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2058–2070, 1292–1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-hobbing-plan": {
    "purpose": "Plan of a gear hobbing job: hob and work speeds, approach and total hob travel, cutting and floor-to-floor time per gear with stacked blanks (as the hobbing time tool), machine-time cost with set-up spread over the batch, sharpening cost per gear from the gears cut between sharpenings, hob cost per gear over the hob’s sharpening life, the cost per gear and for the batch, and the hob speed against the machine maximum.",
    "uses": [
      "Quote a hobbed gear",
      "Compare stacking blanks for a batch",
      "See what share of cost the hob takes"
    ],
    "users": [
      "Gear engineers",
      "Estimators",
      "Process planners"
    ],
    "inputs": {
      "z": "Number of teeth on the gear.",
      "starts": "Number of starts on the hob.",
      "Dh": "Outside diameter of the hob.",
      "Vc": "Cutting speed for the hob and material.",
      "f": "Axial feed of the hob per revolution of the work.",
      "b": "Face width of the gear.",
      "h": "Whole depth of the tooth.",
      "beta": "Helix angle of the gear.",
      "over": "Extra hob travel past the face.",
      "stack": "Blanks cut together in one stack.",
      "load": "Time to load and unload a stack.",
      "nmax": "Highest hob spindle speed of the machine.",
      "rate": "Machine plus operator rate.",
      "setup": "Set-up time for the batch.",
      "batch": "Gears in the batch.",
      "perSharp": "Gears the hob cuts before it needs sharpening (your value).",
      "sharpCost": "Cost of sharpening the hob once.",
      "sharps": "Number of sharpenings the hob can take before it is scrapped.",
      "hobPrice": "Price of a new hob."
    },
    "outputs": [
      "Hob and work speeds, travel and times",
      "Machine, sharpening and hob cost per gear",
      "Batch cost"
    ],
    "method": [
      "Hob speed n = 1000 V_c ÷ (π D_h); work speed = n × starts ÷ z; approach = √[h (D_h − h)]; travel = b ÷ cos β + approach + overrun (as the hobbing time tool).",
      "Cutting time per gear = travel ÷ (f × work speed) ÷ stack; floor-to-floor adds the load time ÷ stack.",
      "Cost per gear = rate × (floor-to-floor + set-up ÷ batch) + sharpening ÷ gears per sharpening + hob price ÷ [gears per sharpening × (sharpenings + 1)].",
      "Example: each gear takes 6.9709 min floor to floor and costs about 11.582; the batch costs 5,790.9."
    ],
    "limitations": [
      "Single pass at constant feed; roughing and finishing passes need their own lines.",
      "Hob life must match the speeds, feeds and material.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stacking blanks spreads the approach and loading over several gears; it pays most on narrow gears."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3347–3349. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "accumulator-circuit-sizing": {
    "purpose": "Sizing of an accumulator to help a pump with a fast cylinder stroke: oil volume and flow for the stroke in the time wanted, what the pump supplies in that time, the deficit the accumulator must deliver, the accumulator gas volume for the precharge, minimum and maximum pressures and the polytropic exponent (as the accumulator size tool), the recharge time at pump flow against the time available, and the installed size against the size needed.",
    "uses": [
      "Size an accumulator for a fast clamp or press stroke",
      "Check whether a smaller pump plus accumulator will do",
      "Check recharge between cycles"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "bore": "Bore of the cylinder (cap-side area is used).",
      "stroke": "Stroke length.",
      "ncyl": "Number of cylinders that stroke at the same time.",
      "t1": "Time the stroke must take.",
      "Qp": "Flow of the pump.",
      "t2": "Time between strokes in which the pump refills the accumulator.",
      "p0": "Gas precharge pressure (about 90% of the minimum working pressure for bladder types).",
      "p1": "Lowest pressure at which the cylinder still does its work.",
      "p2": "Pressure at which the accumulator is full (relief or unloading setting).",
      "nexp": "Exponent of the gas process: 1 for slow (isothermal), 1.4 for fast (adiabatic) discharge.",
      "Vinst": "Nominal gas volume of the accumulator considered."
    },
    "outputs": [
      "Stroke volume and flow",
      "Deficit and accumulator size needed",
      "Recharge time and installed size check"
    ],
    "method": [
      "Stroke volume V = n × π D² ÷ 4 × stroke; flow needed = V ÷ t₁.",
      "Pump supplies Q_p t₁; deficit ΔV = V − Q_p t₁.",
      "Gas volume V₀ = ΔV ÷ [(P₀ ÷ P₁)^(1/n) − (P₀ ÷ P₂)^(1/n)] with absolute pressures (as the accumulator size tool).",
      "Recharge time = ΔV ÷ Q_p, against the time available.",
      "Example: the stroke needs 45.239 L/min against 30 L/min from the pump; the accumulator supplies 0.50796 L and must be at least 1.4093 L."
    ],
    "limitations": [
      "Ideal gas; real gas at high pressure needs a correction factor.",
      "Pressure drop in valves and lines during the fast stroke is not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A fast stroke discharges nearly adiabatically: sizing with n = 1 would undersize the accumulator."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cylinder-speed-control": {
    "purpose": "Meter-out flow control of a double-acting cylinder extending against a resisting or overrunning load: cap-side and annulus areas, cap-side flow for the speed against pump flow, rod-side (back) pressure from the force balance including intensification, the orifice diameter that passes the rod-side flow at that pressure drop (as the orifice flow tool), heat generated in the orifice and over the relief valve, and the rod-side pressure against its rating.",
    "uses": [
      "Size a fixed orifice or set a flow control for a cylinder speed",
      "Check rod-side pressure with a meter-out circuit",
      "Estimate heat from speed control"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "bore": "Cylinder bore.",
      "rod": "Rod diameter.",
      "p1": "Pressure on the cap side (the relief setting holds it there with meter-out control).",
      "F": "Load on the rod: positive when it resists extension, negative when it pulls the rod out.",
      "v": "Extension speed wanted.",
      "Qp": "Pump flow available.",
      "Cd": "Discharge coefficient of the orifice or valve (about 0.6–0.7).",
      "rho": "Oil density.",
      "pRod": "Pressure rating of the rod-side seals, cylinder and valve."
    },
    "outputs": [
      "Areas, flows and pump check",
      "Rod-side pressure and intensification",
      "Orifice diameter and heat"
    ],
    "method": [
      "A₁ = π D² ÷ 4, A₂ = A₁ − π d² ÷ 4; Q₁ = A₁ v, Q₂ = A₂ v.",
      "Force balance p₁ A₁ = F + p₂ A₂, so p₂ = (p₁ A₁ − F) ÷ A₂ (an overrunning load raises it above p₁ A₁ ÷ A₂).",
      "Orifice area A₀ = Q₂ ÷ [C_d √(2 p₂ ÷ ρ)] with the tank at zero pressure (as the orifice flow tool).",
      "Heat = p₂ Q₂ (orifice) + p₁ (Q_p − Q₁) (relief).",
      "Example: 0.1 m/s against 15 kN needs a 1.7999 mm orifice; the rod side runs at 77.035 bar and the circuit makes 2.6667 kW of heat."
    ],
    "limitations": [
      "Sharp-edged orifice, turbulent flow; a pressure-compensated flow control holds speed as the load changes.",
      "Line and valve losses are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Meter-out holds overrunning loads but intensifies rod-side pressure: check the rod seals when the load reverses."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-insulation-design": {
    "purpose": "Design of insulation on a hot pipe: heat loss per metre, surface temperature and annual energy cost for a thickness (as the insulated pipe tool), the least thickness that keeps the surface at or below your touch limit and the least that holds the loss per metre to your target (found by search), the governing thickness, and for the thickness chosen the saving against the bare pipe and the simple payback on the installed cost.",
    "uses": [
      "Choose insulation thickness for a steam or hot-oil line",
      "Make a pipe safe to touch",
      "Justify insulating bare pipework"
    ],
    "users": [
      "Plant engineers",
      "Energy managers",
      "Maintenance engineers"
    ],
    "inputs": {
      "D": "Outside diameter of the pipe.",
      "Ti": "Temperature of the pipe (taken as the fluid temperature).",
      "Ta": "Surrounding air temperature.",
      "k": "Thermal conductivity of the insulation at its mean temperature.",
      "h": "Combined convection and radiation coefficient at the outer surface (about 8–12 still air indoors, more outdoors).",
      "L": "Length of pipe.",
      "hours": "Hours per year the pipe is hot.",
      "price": "Price of the heat energy (fuel or steam cost per kWh).",
      "TsMax": "Highest surface temperature you allow for personnel protection.",
      "qMax": "Largest heat loss per metre you accept.",
      "t": "Insulation thickness you intend to fit.",
      "cost": "Installed cost of the insulation per metre of pipe."
    },
    "outputs": [
      "Thickness for surface temperature and for heat loss",
      "Loss, surface temperature and cost at the chosen thickness",
      "Saving against bare pipe and payback"
    ],
    "method": [
      "Resistance per metre R = ln(r₂ ÷ r₁) ÷ (2πk) + 1 ÷ (2π r₂ h); loss q = (T_i − T_a) ÷ R; surface T_s = T_a + q ÷ (2π r₂ h) (as the insulated pipe tool).",
      "Least thickness for T_s ≤ limit and for q ≤ target found by bisection; the larger governs.",
      "Saving = (q_bare − q) × L × hours × price; payback = installed cost ÷ saving.",
      "Example: 50 mm of insulation cuts the loss from 246.27 to 31.794 W/m, keeps the surface at 26.313 °C, and pays back in 0.29141 years."
    ],
    "limitations": [
      "Steady state with the pipe wall neglected; fittings and valves lose much more per metre.",
      "For small pipes with poor insulation, check the critical radius (insulation can raise the loss).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The first 25 mm saves most of the heat; extra thickness gives diminishing returns."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sheet-metal-flat-pattern": {
    "purpose": "Flat pattern of a formed sheet-metal part with up to four bends of the same inside radius: bend allowance, outside setback and bend deduction for each bend angle from the K-factor (as the bend allowance tool), the flat length from the outside flange dimensions less the deductions, and checks that every flange is longer than its setbacks and your shortest flange for the die, and that the inside radius is at least your minimum ratio to thickness.",
    "uses": [
      "Cut blanks for a channel, hat or Z section",
      "Check a drawing’s flanges against the press brake die",
      "Compare K-factors for a material"
    ],
    "users": [
      "Sheet-metal designers",
      "Press brake operators",
      "Fabrication supervisors"
    ],
    "inputs": {
      "t": "Sheet thickness.",
      "R": "Inside radius of every bend.",
      "K": "Position of the neutral axis as a share of thickness (about 0.33–0.45 for air bending).",
      "L1": "Outside length of the first flange.",
      "A1": "Angle of the first bend (the change in direction; 90° for a right-angle bend; 0 if there are no bends).",
      "L2": "Outside length of the second flange (between bends 1 and 2, outside to outside).",
      "A2": "Angle of the second bend (0 to stop here).",
      "L3": "Outside length of the third flange.",
      "A3": "Angle of the third bend.",
      "L4": "Outside length of the fourth flange.",
      "A4": "Angle of the fourth bend.",
      "L5": "Outside length of the fifth flange.",
      "minFl": "Shortest flange the press-brake die can form (see the press brake set-up tool).",
      "rMin": "Smallest inside radius as a multiple of thickness for the material (your value)."
    },
    "outputs": [
      "Allowance, setback and deduction for each bend",
      "Flat length",
      "Flange and radius checks"
    ],
    "method": [
      "Bend allowance = θ (R + K t); outside setback = (R + t) tan(θ ÷ 2); bend deduction = 2 × setback − allowance (as the bend allowance tool).",
      "Flat length = Σ outside flanges − Σ bend deductions.",
      "Each flange must exceed the setbacks of the bends at its ends, and the end flanges your die minimum.",
      "Example: 2 bends of 3 mm radius in 2 mm sheet give a flat length of 101.94 mm."
    ],
    "limitations": [
      "All bends share one radius and K-factor; mixed radii need separate deductions.",
      "Outside dimensions to the virtual sharps; dimension to the drawing’s convention.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Confirm the K-factor with a test bend: a 0.05 error changes each 90° deduction by about 0.08 t."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1353. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ball-nose-finishing-plan": {
    "purpose": "Plan of ball-nose finish milling on a flat or gently curved area: stepover for the target scallop height, or the scallop for a stepover you set (as the scallop height tool), effective cutting diameter at the axial engagement and the spindle speed for the cutting speed there (as the ball nose diameter tool), held to the machine maximum, the feed rate, number of passes and finishing time for the area.",
    "uses": [
      "Program a finishing pass for a mould or die surface",
      "Trade surface finish against machining time",
      "Set spindle speed for a small effective diameter"
    ],
    "users": [
      "CNC programmers",
      "Mould makers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the ball-nose cutter.",
      "z": "Number of flutes.",
      "ap": "Depth of the ball in the material (sets the effective diameter).",
      "hT": "Largest scallop (cusp) height the surface may have.",
      "step": "Stepover you intend to program; 0 uses the stepover for the scallop target.",
      "vc": "Cutting speed wanted at the effective diameter.",
      "fz": "Feed per tooth.",
      "nmax": "Highest spindle speed.",
      "Lx": "Length of each finishing pass.",
      "Wy": "Width of the area across the passes."
    },
    "outputs": [
      "Stepover and scallop height",
      "Effective diameter, spindle speed and feed",
      "Passes and finishing time"
    ],
    "method": [
      "Stepover for scallop h: s = 2√(2Rh − h²); scallop for stepover s: h = R − √(R² − s² ÷ 4) (as the scallop height tool).",
      "Effective diameter D_e = 2√[a_p (D − a_p)]; n = min(1000 v_c ÷ π D_e, n_max) (as the ball nose diameter tool).",
      "Feed = n z f_z; passes = width ÷ stepover (rounded up); time = passes × length ÷ feed.",
      "Example: a 0.28281 mm stepover leaves 2 µm; at 15,000 rpm and 1,500 mm/min the 100 × 80 mm area takes 18.867 min."
    ],
    "limitations": [
      "Flat surface normal to the tool; slopes change the scallop and effective diameter.",
      "Stepover moves and lead-in time are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the scallop height only shortens the stepover by about 30%, but the time rises in the same proportion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1039–1058, 1279–1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
