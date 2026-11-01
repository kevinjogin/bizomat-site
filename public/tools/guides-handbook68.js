// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook68).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "machine-economic-life": {
    "purpose": "Economic life of a new machine (the challenger): its equivalent uniform annual cost for every life from one year to the longest you examine, from the price, a resale value that falls each year, a running cost that rises by a yearly gradient (capital recovery, sinking fund and gradient factors, as the interest factors tool), the life with the lowest cost and that cost, then the cost of keeping the existing machine (the defender) for one more year from its fall in resale value, the interest on its present value and its running cost, against the challenger’s lowest annual cost.",
    "uses": [
      "Decide how long to keep a new machine tool or vehicle",
      "Decide whether to replace an ageing machine this year or next",
      "Compare a replacement policy with the budget"
    ],
    "users": [
      "Engineering managers",
      "Plant engineers",
      "Finance and business owners"
    ],
    "inputs": {
      "P": "Installed price of the new machine, on the same GST basis as every other amount (ex GST for a GST-registered business).",
      "s1": "What the new machine could be sold for after one year, as a share of its price (from dealers or used-equipment prices).",
      "dS": "How much the resale value falls each further year, as a share of the previous year’s value.",
      "A1": "Running cost in the first year: maintenance, repairs, energy and downtime cost.",
      "G": "How much the running cost rises each year as the machine ages.",
      "i": "Your discount rate or cost of capital.",
      "Nmax": "Longest life to examine.",
      "MV0": "What the existing machine would sell for today.",
      "MV1": "What it would sell for in one year.",
      "Ad": "Running cost of the existing machine over the next year."
    },
    "outputs": [
      "EUAC for each life and the economic life",
      "Lowest equivalent annual cost",
      "Cost of keeping the existing machine one more year",
      "Keep or replace"
    ],
    "method": [
      "Resale after n years Lₙ = P × s₁ × (1 − d)^(n − 1).",
      "EUAC(n) = P (A/P, i, n) − Lₙ (A/F, i, n) + A₁ + G (A/G, i, n), with (A/P) = i (1 + i)ⁿ ÷ [(1 + i)ⁿ − 1], (A/F) = i ÷ [(1 + i)ⁿ − 1] and (A/G) = 1 ÷ i − n ÷ [(1 + i)ⁿ − 1] (as the interest factors and EUAC comparison tools); the economic life is the n with the lowest EUAC.",
      "Cost of keeping the existing machine one more year = (MV₀ − MV₁) + MV₀ × i + its running cost; keep it while this is below the challenger’s lowest EUAC.",
      "Example: the new machine is cheapest kept 7 years at A$42,579 a year; keeping the old one another year costs A$40,400."
    ],
    "limitations": [
      "End-of-year cash flows, a constant interest rate and a challenger that repeats like for like; tax, inflation and technology change are not modelled.",
      "Resale value falls by a fixed share each year and running cost rises by a fixed amount each year; replace these with your own records where you have them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The EUAC curve is usually flat near its lowest point, so a year either side of the economic life costs little more: other factors can decide within that band."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–143. Topic reference; no source tables or recommended settings are reproduced.",
      "Newnan D. G., Eschenbach T. G. and Lavelle J. P., Engineering Economic Analysis (Oxford University Press): replacement analysis, economic life and the defender’s marginal cost."
    ]
  },
  "groove-weld-cost-check": {
    "purpose": "Quantity and cost of a full-penetration butt (groove) weld: the groove area from the plate thickness, preparation, groove angle, root gap and root face, the weld cap area on one or both faces, the weld metal mass per metre and in total, filler wire from the deposition efficiency, arc time from the deposition rate, paid time from the operating factor plus other time per metre, and labour, filler and shielding gas cost (as the weld cost tool, with groove geometry in place of the fillet), against the price quoted for the welding.",
    "uses": [
      "Price a butt-welded plate or pipe joint",
      "Compare a single-V with a double-V preparation",
      "Check a welding quote before it goes out"
    ],
    "users": [
      "Fabrication estimators",
      "Welding supervisors",
      "Fabrication engineers"
    ],
    "inputs": {
      "prep": "Edge preparation of the joint, from the drawing or welding procedure.",
      "t": "Thickness of the plates being joined.",
      "ang": "Included groove angle for single- and double-V; the bevel angle on the one prepared plate for a single-bevel. Not used for a square butt.",
      "g": "Root gap between the plates.",
      "c": "Root face (land) left unbevelled at the root.",
      "h": "Height of the weld cap above the plate surface.",
      "e": "How far the cap spreads past each edge of the groove.",
      "caps": "Whether there is a cap on one face or on both (double-V and back-welded joints).",
      "L": "Total length of this weld.",
      "rho": "Density of the weld metal (steel about 7.85).",
      "dep": "Deposition rate of the process at the chosen settings.",
      "of": "Arc-on time as a share of paid welding time.",
      "eff": "Share of the filler bought that ends up in the weld.",
      "rate": "Charge-out or labour rate per hour.",
      "wire": "Price of the filler wire or electrodes.",
      "gasFlow": "Shielding gas flow rate (0 for processes without gas).",
      "gasPrice": "Price of the shielding gas.",
      "oth": "Other welder time per metre of weld that is not arc time.",
      "quote": "Price quoted for this weld, on the same GST basis as the rates."
    },
    "outputs": [
      "Groove area, cap width and weld metal per metre",
      "Weld metal, filler, arc and paid time",
      "Labour, filler and gas cost against the quote"
    ],
    "method": [
      "Groove area: single-V g t + (t − c)² tan(α ÷ 2); double-V g t + (t − c)² tan(α ÷ 2) ÷ 2; single-bevel g t + (t − c)² tan β ÷ 2; square butt g t.",
      "Each cap is a parabolic segment ⅔ W h, with W the groove width at the surface plus the overlap on both sides; weld metal per metre = total area × density ÷ 1000.",
      "Arc time = mass ÷ deposition rate; paid time = arc time ÷ operating factor + other time; cost = labour + filler (mass ÷ efficiency × price) + gas (arc time × flow × price), as the weld cost tool.",
      "Example: 103.8 mm² of weld metal, 4.8889 kg in all; the weld costs A$660.53 against a quote of A$800."
    ],
    "limitations": [
      "Idealised groove and cap shapes; real root penetration, root reinforcement and fit-up variation change the volume.",
      "Preparation dimensions are entered by you; take them from AS/NZS 1554.1 prequalified preparations or the approved welding procedure.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The groove area grows with the square of the depth prepared, so for thick plate a double-V or a narrower angle cuts weld metal sharply."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1438–1441, 1476–1484. Topic reference; no source tables or recommended settings are reproduced.",
      "AS/NZS 1554.1, Structural steel welding, Part 1: Welding of steel structures — prequalified butt weld preparations; dimensions are not reproduced here."
    ]
  },
  "insert-consumption-reorder-plan": {
    "purpose": "Consumption plan for indexable inserts on a turning operation: spindle speed and cutting time per part (as the turning cost tool), Taylor tool life at the cutting speed (as the Taylor tool life tool), the share of life used before indexing, whole parts per edge, inserts per month and per day, insert cost per part and per month, then the safety stock for a service level and the reorder point over the supplier lead time (as the safety stock and reorder point tools), against the inserts on hand.",
    "uses": [
      "Set reorder points for inserts in the tool crib",
      "Budget monthly tooling cost for a new job",
      "See how a speed change affects insert use"
    ],
    "users": [
      "Production engineers",
      "Tool crib and purchasing staff",
      "Machining supervisors"
    ],
    "inputs": {
      "V": "Cutting speed used on the job.",
      "n": "Taylor exponent for this insert grade and workpiece material, from your own tool-life tests or the tool maker.",
      "C": "Taylor constant: the cutting speed that would give one minute of tool life.",
      "use": "Share of the Taylor life you let an edge run before indexing (below 100 % to avoid edge breakdown).",
      "D": "Diameter being turned.",
      "Lc": "Length of each pass.",
      "f": "Feed per revolution.",
      "passes": "Passes per part with this insert.",
      "edges": "Usable cutting edges on each insert.",
      "price": "Price of one insert, ex GST.",
      "parts": "Parts made each month.",
      "days": "Working days in a month.",
      "lead": "Working days from placing an order to receiving the inserts.",
      "cv": "Standard deviation of daily insert use as a share of the average (from usage records).",
      "svc": "Chance of not running out during a lead time.",
      "onHand": "Inserts in the crib and at the machines now."
    },
    "outputs": [
      "Tool life and whole parts per edge",
      "Inserts per month and cost per part",
      "Safety stock and reorder point",
      "Order now or stock adequate"
    ],
    "method": [
      "N = 1000 V ÷ (π D); cutting time per part t_c = passes × L ÷ (f N) (as the turning cost tool).",
      "Taylor life T = (C ÷ V)^(1/n) (as the Taylor tool life tool); parts per edge = whole number of (T × share used ÷ t_c).",
      "Inserts per month = parts ÷ (parts per edge × edges); daily use d = monthly use ÷ working days.",
      "Safety stock = z × σ_d × √lead time with σ_d = cv × d; reorder point = d × lead time + safety stock (as the safety stock and reorder point tools).",
      "Example: 16 parts per edge and 93.75 inserts a month at A$0.28125 per part; reorder at 51.609 inserts."
    ],
    "limitations": [
      "Taylor life with constants you supply; real edge life scatters widely, so confirm parts per edge on the machine.",
      "Demand is treated as steady with normal day-to-day variation and a fixed lead time.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tool life falls steeply with speed (with n = 0.25 a 19 % speed rise halves it), so insert use and stock both change sharply with the cutting speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1102–1106, 1132–1140. Topic reference; no source tables or recommended settings are reproduced.",
      "Silver E. A., Pyke D. F. and Thomas D. J., Inventory and Production Management in Supply Chains (CRC Press)"
    ]
  },
  "bearing-fleet-spares-plan": {
    "purpose": "Spares plan for identical rolling bearings: the basic rating life L₁₀ from the dynamic rating, equivalent load and speed (as the bearing life tool), the Weibull characteristic life that puts 10 % of failures at L₁₀ for the slope you enter, the probability that one bearing fails within the planning period (as the Weibull reliability tool), the expected number of failures in the group, and the smallest number of spares whose binomial probability of covering all failures reaches your service level, against the spares held.",
    "uses": [
      "Set stock levels for critical bearings",
      "Check whether a store holds enough spares for a fleet of pumps or conveyors",
      "Show how load and speed drive spares demand"
    ],
    "users": [
      "Maintenance planners",
      "Reliability engineers",
      "Stores and purchasing staff"
    ],
    "inputs": {
      "type": "Ball or roller bearing (sets the life exponent).",
      "C": "Basic dynamic load rating from the bearing maker’s catalogue.",
      "P": "Equivalent dynamic load on each bearing in service.",
      "rpm": "Running speed of each bearing.",
      "eS": "Weibull slope of bearing life scatter; the reliability factor a₁ in the bearing selection check corresponds to a slope of 1.5. Use your own failure records where you have them.",
      "Nb": "Number of identical bearings running under the same load and speed.",
      "hpy": "Running hours of each bearing per year.",
      "yrs": "Period the spares must cover (often the resupply time or a stock-review period).",
      "tgt": "Probability that the spares cover every failure in the period.",
      "held": "Spares in stock now."
    },
    "outputs": [
      "L₁₀ life and Weibull characteristic life",
      "Chance of failure per bearing and expected failures",
      "Spares needed for the service level against spares held"
    ],
    "method": [
      "L₁₀ = (C ÷ P)^p × 10⁶ ÷ (60 n) hours, p = 3 for ball and 10/3 for roller bearings (as the bearing life tool).",
      "Characteristic life η = L₁₀ ÷ [ln (1 ÷ 0.9)]^(1/β); chance one bearing fails in t hours F = 1 − exp[−(t ÷ η)^β] (as the Weibull reliability tool).",
      "Failures in the group follow a binomial distribution with N bearings and probability F; spares needed = smallest s with P(X ≤ s) ≥ the service level.",
      "Example: L₁₀ is 11,494 h; each bearing has a 2.1397 % chance of failing, 0.85589 failures are expected and 3 spares give 95 % cover."
    ],
    "limitations": [
      "All bearings start the period as new and a replaced bearing is not counted failing again; with a high chance of failure per bearing, renewals add more demand.",
      "Rating-life model only: lubrication, contamination, misalignment and installation damage often decide real bearing life.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Life varies with the cube of the load ratio for ball bearings, so a small overload multiplies the spares a fleet needs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2403–2415, 128–133. Topic reference; no source tables or recommended settings are reproduced.",
      "NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.6.6.18 Binomial Distribution — https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm"
    ]
  },
  "hydraulic-press-cycle-check": {
    "purpose": "Cycle check of a single-cylinder hydraulic press: cylinder areas, approach speed and the pressure needed to overcome the approach resistance with a standard or regenerative approach circuit, pressing speed and the force at the relief pressure (as the hydraulic cylinder tool), return speed, the stroke times and total cycle time with dwell, and the motor power at the pressure needed for the pressing force and at the relief pressure (as the hydraulic power tool), against the force needed, the cycle time target and the installed motor.",
    "uses": [
      "Check a press design before ordering the power unit",
      "See how much a regenerative approach shortens the cycle",
      "Find why a press is slow or stalls"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Toolmakers and press-shop engineers"
    ],
    "inputs": {
      "bore": "Bore of the press cylinder.",
      "rod": "Diameter of the piston rod.",
      "Q": "Pump delivery at working speed.",
      "p": "Relief valve (maximum system) pressure.",
      "circuit": "Whether the approach stroke uses a regenerative connection or a standard one.",
      "Freq": "Force the press must reach on the work.",
      "Fapp": "Force resisting the approach (guides, seals, stripper springs), less the ram weight on a down-acting press.",
      "sA": "Length of the fast approach stroke.",
      "sP": "Length of the slow pressing stroke.",
      "dwell": "Time held at pressure at the bottom of the stroke.",
      "eta": "Overall efficiency of the pump (from its data sheet).",
      "Pmot": "Rated power of the electric motor.",
      "tMax": "Cycle time the press must achieve."
    },
    "outputs": [
      "Approach, pressing and return speeds",
      "Pressing force and approach pressure",
      "Cycle time",
      "Motor power at the pressing load and at relief"
    ],
    "method": [
      "Areas: bore A_b = π D² ÷ 4, rod A_r = π d² ÷ 4, annulus A_a = A_b − A_r.",
      "Approach: regenerative speed Q ÷ A_r and pressure F_app ÷ A_r; standard speed Q ÷ A_b and pressure F_app ÷ A_b. Pressing: speed Q ÷ A_b and force p A_b; return: speed Q ÷ A_a (as the hydraulic cylinder tool).",
      "Cycle time = approach + pressing + return (full stroke) times + dwell; motor power = pressure × Q ÷ (600 η) kW at the pressure the pressing force needs and at the relief setting (as the hydraulic power tool).",
      "Example: 157.08 kN available against 120 kN; a 4.4789 s cycle needing 11.983 kW at the pressing load."
    ],
    "limitations": [
      "Ideal speeds with no leakage, valve shift time or acceleration; pressure drops in the valves and lines are not counted.",
      "A regenerative approach gives only the rod-area force; the switch to full-bore pressing must happen before the work is reached.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A regenerative approach is fastest when the rod is large compared with the bore, but its force is small: keep approach resistance low."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 365–368. Topic reference; no source tables or recommended settings are reproduced.",
      "Esposito A., Fluid Power with Applications (Pearson): regenerative cylinder circuits."
    ]
  },
  "vacuum-table-workholding-check": {
    "purpose": "Workholding check for milling a flat part on a vacuum table: the holding force from the vacuum and the sealed area with an allowance for leakage (as the vacuum cup tool), the friction resistance with the part weight, the mean cutting force from the cutting power and cutting speed (as the milling power tool) with a factor for force peaks, the sliding safety factor, and the largest feed rate that keeps your required safety factor.",
    "uses": [
      "Check a router or mill vacuum fixture before cutting",
      "Find a safe feed rate for a thin plate",
      "Decide whether tabs, clamps or a sacrificial spoilboard are needed"
    ],
    "users": [
      "CNC programmers",
      "Machinists",
      "Fixture designers"
    ],
    "inputs": {
      "Lp": "Length of the area inside the gasket or seal under the part.",
      "Wp": "Width of that area.",
      "vac": "Vacuum level at the table (gauge reading below atmosphere).",
      "effA": "Share of the sealed area that holds full vacuum after leakage, grooves and through-cuts.",
      "mu": "Friction coefficient between the part and the table or spoilboard, from a pull test.",
      "mass": "Mass of the part.",
      "ae": "Radial width of cut.",
      "ap": "Axial depth of cut.",
      "vf": "Table feed rate.",
      "D": "Cutter diameter.",
      "rpm": "Spindle speed.",
      "kc": "Specific cutting force for the material and chip thickness, from the tool maker.",
      "dyn": "Ratio of peak to mean cutting force (interrupted cuts, few teeth and entry shock raise it).",
      "SF": "Safety factor you require against sliding."
    },
    "outputs": [
      "Holding force and friction resistance",
      "Mean and peak cutting force",
      "Safety factor against sliding",
      "Largest feed for the required safety factor"
    ],
    "method": [
      "Holding force = vacuum × length × width × effective share (as the vacuum cup tool); resistance = μ (holding force + m g).",
      "Cutting power P_c = a_e a_p v_f k_c ÷ (60 × 10⁶) kW and cutting speed v_c = π D n ÷ 1000 (as the milling power tool); mean cutting force = P_c ÷ v_c; peak = mean × factor.",
      "Safety factor = resistance ÷ peak force; largest feed = feed × safety factor ÷ required factor (force rises in proportion to feed at a fixed specific cutting force).",
      "Example: 7,680 N of vacuum hold resists 2,318.7 N against a 1,086.5 N peak: safety factor 2.1341."
    ],
    "limitations": [
      "Friction only: lifting forces from helical cutters, part bow and loss of seal as through-cuts open are not calculated.",
      "Fixed specific cutting force; at thin chips the real specific force rises, so the largest feed is optimistic.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Small parts lose holding force with their area while the cutting force stays the same, so the last parts cut from a sheet are the ones that move."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101, 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gauge-repeatability-bias-check": {
    "purpose": "Type 1 gauge study from repeated readings of one reference master by one operator: the tolerance, bias (mean minus reference), the potential capability Cg from a share of the tolerance against a spread of standard deviations, the capability with bias Cgk, the percentage of tolerance taken by repeatability and by repeatability with bias, a two-sided t-test of the bias (confidence interval of the mean, as the two-sample t-test tool’s t distribution), and the gauge resolution as a share of the tolerance, against your minimum capability and largest resolution share.",
    "uses": [
      "Accept a new gauge or CMM program for a characteristic",
      "Check a gauge after repair or recalibration",
      "Decide whether bias needs correcting"
    ],
    "users": [
      "Quality engineers",
      "Metrology technicians",
      "Production supervisors"
    ],
    "inputs": {
      "n": "Number of readings of the master (studies commonly use 25 to 50).",
      "xbar": "Average of the repeated readings, in the unit of the tolerance.",
      "s": "Sample standard deviation of the readings.",
      "xref": "Calibrated value of the reference master, from its certificate.",
      "LSL": "Lower limit of the characteristic’s tolerance.",
      "USL": "Upper limit of the characteristic’s tolerance.",
      "res": "Smallest step the gauge displays.",
      "K": "Share of the tolerance the gauge spread may use (20 % is Minitab’s default).",
      "Lm": "Number of standard deviations taken as the gauge spread (6 covers about 99.73 %).",
      "cmin": "Minimum Cg and Cgk your quality system requires.",
      "resMax": "Largest gauge resolution allowed as a share of the tolerance, from your quality system.",
      "alpha": "Chance of calling a bias significant when there is none."
    },
    "outputs": [
      "Tolerance, bias and t-test",
      "Cg and Cgk",
      "Share of tolerance used",
      "Resolution share and the decision"
    ],
    "method": [
      "Tolerance T = USL − LSL; bias = x̄ − x_ref.",
      "Cg = (K × T) ÷ (L s); Cgk = (K × T ÷ 2 − |bias|) ÷ (L s ÷ 2); share of tolerance for repeatability = L s ÷ T and with bias = K ÷ Cgk.",
      "Bias test: t = bias ÷ (s ÷ √n) with n − 1 degrees of freedom; p from the t distribution (two-sided); significant when p < α.",
      "Example: Cg = 1.6667 and Cgk = 1.5833; the bias of 0.0002 has p = 0.22335."
    ],
    "limitations": [
      "One master at one point of the range, one operator: a type 1 study shows repeatability and bias only, not reproducibility between operators or linearity across the range.",
      "Readings assumed independent and roughly normal; drift during the study inflates the standard deviation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A gauge with good Cg but poor Cgk is repeatable but offset: correcting the bias (re-mastering or an offset) can be enough."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–129. Topic reference; no source tables or recommended settings are reproduced.",
      "Minitab, Methods and formulas for Type 1 Gage Study — https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/how-to/gage-study/type-1-gage-study/methods-and-formulas/methods-and-formulas/",
      "VDA Volume 5 (Verband der Automobilindustrie), capability of measurement processes: the source of the type 1 study; consult the current edition."
    ]
  }
});
