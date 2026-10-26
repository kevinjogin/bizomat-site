// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook42).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "hydraulic-filter-selection": {
    "purpose": "Selection check of a hydraulic filter: particle counts per millilitre at 4, 6 and 14 µm upstream, the counts after a filter with your beta ratios at each size and its capture efficiencies (as the filter beta ratio tool), the ISO 4406 codes before and after (as the ISO cleanliness code tool) against the target, and the element pressure drop scaled from the maker’s rated value for your flow and viscosity against the allowable drop.",
    "uses": [
      "Choose a filter rating for a target oil cleanliness",
      "Check a filter’s pressure drop with cold oil",
      "Explain an oil sample that misses its target code"
    ],
    "users": [
      "Maintenance engineers",
      "Hydraulic engineers",
      "Reliability engineers"
    ],
    "inputs": {
      "c4": "Particles of 4 µm(c) and larger per mL upstream (from an oil sample).",
      "c6": "Particles of 6 µm(c) and larger.",
      "c14": "Particles of 14 µm(c) and larger.",
      "b4": "Filter beta ratio at 4 µm(c) from the maker’s ISO 16889 data.",
      "b6": "Beta ratio at 6 µm(c).",
      "b14": "Beta ratio at 14 µm(c).",
      "t4": "Target ISO 4406 range number at 4 µm (from the component maker’s requirement).",
      "t6": "Target at 6 µm.",
      "t14": "Target at 14 µm.",
      "dpR": "Clean element pressure drop the maker gives at the rated flow and viscosity.",
      "QR": "Flow at which that drop is given.",
      "nuR": "Viscosity at which that drop is given.",
      "Q": "Flow through the filter in service.",
      "nu": "Oil viscosity at the coldest running condition.",
      "dpMax": "Largest clean element drop you accept (well below the bypass setting)."
    },
    "outputs": [
      "Downstream counts and efficiencies",
      "ISO codes before and after against the target",
      "Element pressure drop"
    ],
    "method": [
      "Downstream count = upstream ÷ β; efficiency = 1 − 1 ÷ β (as the filter beta ratio tool).",
      "ISO 4406 range number = ⌈log₂(count per mL ÷ 0.01)⌉ (as the ISO cleanliness code tool).",
      "Element drop ≈ rated drop × (Q ÷ Q_rated) × (ν ÷ ν_rated) for laminar flow through the media.",
      "Example: the oil goes from 21/19/17 to 18/12/9 against 18/16/13; the element drops 0.23 bar."
    ],
    "limitations": [
      "Single pass through the filter; a real system reaches a balance between ingression and filtration.",
      "Housing and bypass valve drops are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Code numbers fall by one for every halving of the count: a β of 200 drops the code by about seven."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2439–2442. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 4406 Hydraulic fluid power — Fluids — Method for coding the level of contamination by solid particles"
    ]
  },
  "submerged-tank-flotation": {
    "purpose": "Flotation check of an empty buried or submerged tank: buoyant uplift on the displaced volume (as the buoyancy tool), resistance from the tank’s own weight, the submerged weight of the soil over it and the submerged weight of concrete ballast or an anchor slab, the safety factor against flotation, and the concrete mass needed to reach your required factor.",
    "uses": [
      "Design hold-down for a buried fuel or water tank",
      "Check a pit or sump for uplift",
      "Size a concrete anchor slab"
    ],
    "users": [
      "Civil engineers",
      "Plant engineers",
      "Design engineers"
    ],
    "inputs": {
      "V": "Outside volume of the tank (and any attached structure) that can be below the water table.",
      "rhoW": "Density of the groundwater or flood water.",
      "mT": "Mass of the empty tank.",
      "Atop": "Plan area of soil that sits on the tank and must lift with it.",
      "hs": "Depth of soil cover over the tank.",
      "gs": "Unit weight of the soil when below the water table (about 8–10 kN/m³; your value from the geotechnical report).",
      "mB": "Mass of concrete ballast, collar or anchor slab tied to the tank.",
      "rhoC": "Density of the concrete.",
      "SF": "Safety factor against flotation you require (often 1.1–1.5; follow your code)."
    },
    "outputs": [
      "Buoyant uplift",
      "Resisting weights and safety factor",
      "Ballast needed for the required factor"
    ],
    "method": [
      "Uplift F_b = ρ_w g V (as the buoyancy tool).",
      "Resistance = tank weight + soil γ′ A h + ballast weight × (1 − ρ_w ÷ ρ_c) (the ballast is itself submerged).",
      "Safety factor = resistance ÷ uplift; ballast needed = (SF × F_b − tank − soil) ÷ [g (1 − ρ_w ÷ ρ_c)].",
      "Example: 10 m³ gives 98.067 kN of uplift; with 12000 kg of concrete the factor is 1.2905, and 11,305 kg would be needed."
    ],
    "limitations": [
      "Empty tank with the water table at the ground surface (worst case).",
      "Soil friction on the tank sides is ignored (conservative).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Concrete only weighs about 58% of its dry weight under water: ballast must allow for its own buoyancy."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cable-span-design": {
    "purpose": "Design of a cable or rope hanging between two supports at the same level: catenary parameter, horizontal and maximum tension, cable length and end angle by the exact catenary (as the catenary cable tool), the vertical reaction at each support, the cable safety factor against its breaking load, the clearance at the low point, and the elastic stretch at that tension.",
    "uses": [
      "Size a catenary support wire or overhead line",
      "Set the sag for a guard or safety line",
      "Check clearance under a cable span"
    ],
    "users": [
      "Design engineers",
      "Riggers",
      "Electrical engineers"
    ],
    "inputs": {
      "S": "Horizontal distance between the supports (at the same height).",
      "d": "Sag at the middle of the span.",
      "w": "Weight of the cable per metre, plus ice, wind or a uniformly spread load.",
      "hSup": "Height of the attachment points above the ground.",
      "clr": "Least height you need under the cable.",
      "MBL": "Minimum breaking load of the cable or rope.",
      "SF": "Safety factor you require on the breaking load.",
      "EA": "Elastic modulus times metallic area of the cable (from the maker)."
    },
    "outputs": [
      "Catenary tensions, length and end angle",
      "Support reactions and cable safety factor",
      "Low-point clearance and stretch"
    ],
    "method": [
      "Solve a [cosh(S ÷ 2a) − 1] = d for the catenary parameter a; horizontal tension H = w a; maximum (end) tension T = w (a + d); length L = 2a sinh(S ÷ 2a) (as the catenary cable tool).",
      "Vertical reaction at each support = w L ÷ 2.",
      "Safety factor = MBL ÷ T_max; clearance = support height − sag; stretch ≈ H L ÷ EA.",
      "Example: 100 m with 5 m sag pulls 2.5583 kN at the ends (factor 7.8177), and the low point is 7 m up."
    ],
    "limitations": [
      "Supports at the same level; uneven supports shift the low point.",
      "Point loads on the cable need a different analysis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the sag roughly doubles the tension: tight cables are expensive cables."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2999. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "system-reliability": {
    "purpose": "Reliability of a system of up to four component blocks in series, each with its own Weibull shape and characteristic life (as the Weibull reliability tool) and a number of identical units in active redundancy: component and block reliability at the mission time, system reliability, the weakest block, and the system mean time to failure by numerical integration of the system reliability curve.",
    "uses": [
      "Check a machine against a reliability target",
      "See whether a redundant pump or fan is worth it",
      "Find the component that limits reliability"
    ],
    "users": [
      "Reliability engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "t": "Operating time the system must survive.",
      "target": "Reliability the system must reach over the mission.",
      "b1": "Weibull shape of the units in block 1 (below 1 early failures, 1 random, above 1 wear-out).",
      "e1": "Characteristic life of the units in block 1, where 63.2% have failed; 0 if the block is not used.",
      "k1": "Number of identical units sharing the job in block 1 (1 for a single unit; 2 for a duty/standby pair running together).",
      "b2": "Weibull shape of the units in block 2 (below 1 early failures, 1 random, above 1 wear-out).",
      "e2": "Characteristic life of the units in block 2, where 63.2% have failed; 0 if the block is not used.",
      "k2": "Number of identical units sharing the job in block 2 (1 for a single unit; 2 for a duty/standby pair running together).",
      "b3": "Weibull shape of the units in block 3 (below 1 early failures, 1 random, above 1 wear-out).",
      "e3": "Characteristic life of the units in block 3, where 63.2% have failed; 0 if the block is not used.",
      "k3": "Number of identical units sharing the job in block 3 (1 for a single unit; 2 for a duty/standby pair running together).",
      "b4": "Weibull shape of the units in block 4 (below 1 early failures, 1 random, above 1 wear-out).",
      "e4": "Characteristic life of the units in block 4, where 63.2% have failed; 0 if the block is not used.",
      "k4": "Number of identical units sharing the job in block 4 (1 for a single unit; 2 for a duty/standby pair running together)."
    },
    "outputs": [
      "Unit and block reliability at the mission time",
      "System reliability and the weakest block",
      "System mean time to failure"
    ],
    "method": [
      "Unit reliability R = exp[−(t ÷ η)^β] (as the Weibull reliability tool).",
      "Block with k units in active redundancy R_b = 1 − (1 − R)^k; system in series R_s = Π R_b.",
      "System MTTF = ∫ R_s(t) dt, integrated numerically.",
      "Example: over 2000 h the system reliability is 92.945%; block 1 is the weakest; MTTF about 7,426.2 h."
    ],
    "limitations": [
      "Independent failures; common-cause failures defeat redundancy.",
      "Active redundancy with perfect switching; standby units need a different model.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Redundancy helps most on the weakest block; doubling an already reliable block adds little."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "learning-curve-quote": {
    "purpose": "Quote for a batch where labour time falls with repetition: time for the first and last unit, cumulative and average hours on the unit learning curve (as the learning curve tool), set-up, labour and machine cost at your hourly rate, material per unit, overhead, total and unit cost, the price per unit for your margin, and the margin the offered price gives.",
    "uses": [
      "Quote a first production batch",
      "Decide whether an offered price is acceptable",
      "Show how cost falls with batch size"
    ],
    "users": [
      "Estimators",
      "Production managers",
      "Business owners"
    ],
    "inputs": {
      "T1": "Hours the first unit takes (estimate or prototype record).",
      "rate": "Learning rate: each doubling of quantity multiplies the unit time by this (80–90% typical for manual assembly).",
      "n": "Units in the batch.",
      "setup": "Set-up hours for the batch.",
      "hr": "Hourly rate for labour plus machine (for example from the machine hour rate tool).",
      "mat": "Material and bought-in parts per unit.",
      "oh": "Overhead added to the direct cost.",
      "margin": "Margin you want as a share of the selling price.",
      "offer": "Price per unit the customer offers."
    },
    "outputs": [
      "Unit and cumulative hours",
      "Cost in total and per unit",
      "Price for the margin and the offered margin"
    ],
    "method": [
      "Unit time T_x = T₁ x^b with b = log₂(learning rate); cumulative hours = Σ T_x (as the learning curve tool).",
      "Cost = (cumulative + set-up) × rate + material × n, plus overhead.",
      "Price for margin m = unit cost ÷ (1 − m); margin offered = 1 − unit cost ÷ offer.",
      "Example: 50 units take 255.13 h; unit cost 676.63, price for 20% margin 845.79; the offer gives 24.819%."
    ],
    "limitations": [
      "Unit learning curve (Crawford); the cumulative-average (Wright) model gives different numbers.",
      "Learning stops at a floor set by machine time; check later units against standard times.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The first units cost far more than the average: quote small first batches with care."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 146, 134–146. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "acceptance-sampling-plan": {
    "purpose": "Design of a single attributes sampling plan: the smallest sample size and acceptance number whose operating characteristic accepts lots at the acceptable quality level with at least 1 − α probability and accepts lots at the rejectable quality level with at most β probability (binomial, as the sampling OC tool), its average outgoing quality limit, and the same checks for a plan you choose.",
    "uses": [
      "Design an incoming inspection plan",
      "Check whether a supplier’s plan protects you",
      "Trade inspection cost against risk"
    ],
    "users": [
      "Quality engineers",
      "Supplier quality engineers",
      "Inspectors"
    ],
    "inputs": {
      "aql": "Defect level that should be accepted nearly always.",
      "rql": "Defect level that should be rejected nearly always (lot tolerance percent defective).",
      "alpha": "Largest chance of rejecting a good lot at the AQL.",
      "beta": "Largest chance of accepting a bad lot at the RQL.",
      "nU": "Sample size of a plan you want to check (0 checks the designed plan).",
      "cU": "Acceptance number of that plan (accept if the sample has this many defectives or fewer)."
    },
    "outputs": [
      "Designed sample size and acceptance number",
      "Acceptance probabilities and AOQL",
      "Check of your plan"
    ],
    "method": [
      "Probability of acceptance P_a(p) = Σ_{k≤c} C(n, k) p^k (1 − p)^(n−k) (as the sampling OC tool).",
      "For each c from 0 upward, find the smallest n with P_a(RQL) ≤ β; the first such plan with P_a(AQL) ≥ 1 − α is the design.",
      "Average outgoing quality limit = largest p × P_a(p) over p.",
      "Example: sample 132 and accept on 3 or fewer defectives: P_a is 95.575% at the AQL and 9.9228% at the RQL."
    ],
    "limitations": [
      "Binomial model for large lots; small lots need the hypergeometric model.",
      "Single sampling only; double and sequential plans need fewer samples on average.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The closer the AQL and RQL, the larger the sample must be to tell them apart."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 2859-1 Sampling procedures for inspection by attributes"
    ]
  },
  "measurement-uncertainty-budget": {
    "purpose": "Uncertainty budget for a dimensional measurement: standard uncertainties from the gauge calibration certificate, the display resolution, repeatability, the Abbe error from an offset and tilt (as the Abbe error tool, taken as a rectangular limit), and the temperature uncertainty of the part, combined by root-sum-square, expanded with a coverage factor, the test uncertainty ratio against the tolerance band, and guard-banded acceptance limits inside the tolerance.",
    "uses": [
      "Check a gauge is good enough for a tolerance",
      "Set guard-banded acceptance limits",
      "Find the biggest contributor to measurement error"
    ],
    "users": [
      "Quality engineers",
      "Metrologists",
      "Inspectors"
    ],
    "inputs": {
      "tol": "Width of the tolerance band (upper minus lower limit).",
      "Ucal": "Expanded uncertainty on the gauge’s calibration certificate (usually at k = 2).",
      "res": "Smallest step of the gauge display.",
      "srep": "Standard deviation of repeated readings on the same part (from a repeatability study).",
      "offset": "Distance between the measuring line and the scale (Abbe offset).",
      "tilt": "Tilt of the moving jaw or slide in arc-seconds.",
      "L": "Length being measured.",
      "alpha": "Expansion coefficient of the part (the gauge is assumed corrected).",
      "dT": "Plus-or-minus uncertainty of the part temperature from 20 °C after correction.",
      "k": "Coverage factor for the expanded uncertainty (2 for about 95%).",
      "turMin": "Least ratio of tolerance band to twice the expanded uncertainty you accept (often 4)."
    },
    "outputs": [
      "Standard uncertainty of each contributor",
      "Combined and expanded uncertainty",
      "Test uncertainty ratio and guard-banded limits"
    ],
    "method": [
      "Calibration u = U ÷ 2; resolution u = res ÷ √12; repeatability u = s.",
      "Abbe limit a = offset × tan(tilt) (as the Abbe error tool), u = a ÷ √3; temperature limit a = L α ΔT, u = a ÷ √3.",
      "Combined u_c = √Σu²; expanded U = k u_c; TUR = tolerance ÷ 2U; guard-banded acceptance = tolerance limits brought in by U.",
      "Example: U = 5.9696 µm (k = 2); the test uncertainty ratio is 4.1879; accept within ±19.03 µm of nominal."
    ],
    "limitations": [
      "Uncorrelated contributors; correlated ones (same gauge, same temperature) add linearly.",
      "Gauge temperature effects assumed corrected; add them if not.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The largest contributor dominates the root-sum-square: reduce it first."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 709–735. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO/IEC Guide 98-3 Uncertainty of measurement (GUM)"
    ]
  },
  "furnace-wall-design": {
    "purpose": "Heat loss through a layered furnace or oven wall with the outside surface losing heat by both convection and radiation: the surface temperature found by iteration so that conduction through the layers equals convection plus radiation (radiation as the radiant heat tool), the heat flux and loss for the wall area, the temperature at each interface (as the wall heat loss tool with the combined surface coefficient), the annual energy cost, and checks against the surface touch limit and the service limit of the insulating layer.",
    "uses": [
      "Design a refractory and insulation lining",
      "Check a furnace shell surface for burn risk",
      "Estimate the running cost of wall losses"
    ],
    "users": [
      "Furnace engineers",
      "Plant engineers",
      "Energy managers"
    ],
    "inputs": {
      "Thot": "Temperature of the hot face of the lining.",
      "Ta": "Air temperature outside the furnace.",
      "t1": "Thickness of the hot-face layer (refractory brick or castable).",
      "k1": "Conductivity of layer 1 at its mean temperature.",
      "t2": "Thickness of the insulating layer.",
      "k2": "Conductivity of layer 2 at its mean temperature.",
      "t3": "Thickness of the steel shell (0 if none).",
      "k3": "Conductivity of the shell.",
      "hc": "Natural convection coefficient at the outer surface (about 5–10 indoors).",
      "eps": "Emissivity of the outer surface (about 0.8 painted or oxidised steel).",
      "area": "Area of wall.",
      "TsMax": "Highest outside surface temperature you allow.",
      "T12Max": "Highest temperature the insulating layer may see (its service limit).",
      "hours": "Hours per year at temperature.",
      "price": "Energy price."
    },
    "outputs": [
      "Surface temperature, flux and heat loss",
      "Interface temperatures",
      "Annual energy cost and checks"
    ],
    "method": [
      "Conduction resistance R = Σ t ÷ k per square metre; flux q = (T_hot − T_s) ÷ R.",
      "At the surface q = h_c (T_s − T_a) + ε σ (T_s⁴ − T_a⁴) (radiation as the radiant heat tool); solve for T_s by bisection.",
      "Interface temperatures fall by q × t ÷ k across each layer (as the wall heat loss tool with the combined coefficient).",
      "Loss = q × area; energy = loss × hours.",
      "Example: the shell runs at 62.288 °C, losing 514.16 W/m² (5.1416 kW); the insulation sees 850.73 °C."
    ],
    "limitations": [
      "Constant conductivities; real refractories vary strongly with temperature.",
      "Steady state; heat stored in the lining during start-up is not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Most of the temperature drop should occur in the insulating layer; the brick protects it from the hot face."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fastener-position-tolerance": {
    "purpose": "Position tolerance for a bolted pattern by the fastener formulas: floating fasteners (clearance holes in both parts) T = H − F, fixed fasteners (one part threaded or pressed) T₁ + T₂ = H − F split between the parts, with the projected tolerance zone reminder, then the check of a measured hole: actual position from the coordinate deviations, bonus tolerance from the departure from maximum material condition, and accept or reject (as the true position tool).",
    "uses": [
      "Set position tolerances for a bolted joint",
      "Check whether a part with off-position holes still assembles",
      "Choose clearance hole size for a positional tolerance"
    ],
    "users": [
      "Design engineers",
      "Inspectors",
      "Drafters"
    ],
    "inputs": {
      "mode": "Floating fasteners pass through clearance holes in all parts; fixed fasteners are held in one part (tapped hole, stud, dowel).",
      "H": "Smallest permitted clearance hole (maximum material condition).",
      "F": "Largest permitted fastener diameter.",
      "share": "For fixed fasteners, the share of H − F given to the part with clearance holes (the rest goes to the threaded part, whose zone should be projected).",
      "dx": "Measured X offset of the hole from its true position.",
      "dy": "Measured Y offset.",
      "size": "Measured size of that hole.",
      "upper": "Largest permitted size of the clearance hole."
    },
    "outputs": [
      "Position tolerance at MMC for each part",
      "Actual position and bonus of the measured hole",
      "Accept or reject"
    ],
    "method": [
      "Floating: T = H − F for each part; fixed: T₁ + T₂ = H − F, split by the share (project the threaded part’s zone).",
      "Actual position = 2√(Δx² + Δy²) (as the true position tool).",
      "Bonus at MMC = actual hole size − MMC size; allowed = T + bonus; accept if position ≤ allowed and the size is within limits.",
      "Example: the clearance holes get ⌀1 mm at MMC; the measured hole is at ⌀1 with ⌀1.1 allowed."
    ],
    "limitations": [
      "Zero-clearance assembly condition with no allowance for fastener head or thread tilt.",
      "Fixed-fastener zones should be projected by the mating part thickness.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Bonus tolerance at MMC accepts parts with larger holes and more position error that still assemble."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 615–627. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME Y14.5-2018 Dimensioning and Tolerancing"
    ]
  }
});
