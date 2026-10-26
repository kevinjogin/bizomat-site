// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook55).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "ring-blank-make-plan": {
    "purpose": "Comparison of blank routes for a rectangular-section ring: finished ring volume and mass, and the rolled-ring blank with machining allowance, by Pappus’s theorem (area of the section × path of its centroid, as the Pappus surface and volume tool), against a square plate blank of the same thickness with its offcut credited as scrap; mass, cost and material yield for each and the cheaper route, checked against your budget.",
    "uses": [
      "Choose between a rolled ring and a plate cut-out",
      "Estimate material for a large machined ring",
      "Quote a ring part"
    ],
    "users": [
      "Estimators",
      "Buyers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "OD": "Outside diameter of the finished ring.",
      "ID": "Inside diameter of the finished ring.",
      "h": "Axial height of the finished ring.",
      "a": "Material left on each machined surface.",
      "edge": "Extra added to the square plate blank for flame or saw cutting.",
      "rho": "Density of the material.",
      "pRing": "Price per kilogram of a rolled or forged ring blank.",
      "pPlate": "Price per kilogram of plate.",
      "pScrap": "Value per kilogram of the plate offcut and centre disc returned as scrap.",
      "budget": "Most you will pay for the blank."
    },
    "outputs": [
      "Finished ring and rolled blank volume and mass",
      "Plate blank mass and scrap",
      "Cost, yield and the cheaper route"
    ],
    "method": [
      "Ring volume = section area × 2π × radius of the section centroid (as the Pappus surface and volume tool).",
      "Rolled blank: section (OD + 2a − ID + 2a) ÷ 2 × (h + 2a) on its centroid radius; cost = mass × ring price.",
      "Plate blank: square of side OD + 2a + edge, thickness h + 2a; cost = mass × plate price − scrap × scrap credit; yield = finished mass ÷ blank mass.",
      "Example: the finished ring weighs 21.579 kg; a rolled blank costs 94.74 $ against 99.411 $ from plate."
    ],
    "limitations": [
      "Rectangular ring section; contoured rings need their own section area and centroid.",
      "Plate offcut assumed sold as scrap, not reused.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thin, large-diameter rings waste most of a plate blank, so rolled rings usually win as the ring gets thinner."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66–67. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-rolling-setup": {
    "purpose": "Set-up for cylindrical-die thread rolling of an ISO metric thread: pitch diameter, thread height and stress area of the thread (as the metric thread tool), the blank diameter taken at about the pitch diameter, the roll pitch diameter and lead for the number of starts on the rolls (as the threading roll size tool), and the range of starts that gives a roll inside the machine’s roll diameter range.",
    "uses": [
      "Set up a thread rolling machine",
      "Order thread rolls for a new thread",
      "Turn blanks for rolled threads"
    ],
    "users": [
      "Setters",
      "Manufacturing engineers",
      "Tool buyers"
    ],
    "inputs": {
      "d": "Nominal diameter of the metric thread.",
      "P": "Pitch of the thread.",
      "Ns": "Number of starts on each roll.",
      "Dmin": "Smallest roll pitch diameter the machine spindles accept.",
      "Dmax": "Largest roll pitch diameter the machine accepts."
    },
    "outputs": [
      "Thread pitch diameter, height and stress area",
      "Blank diameter",
      "Roll pitch diameter, lead and suitable starts"
    ],
    "method": [
      "Pitch diameter d₂ = d − 0.6495P; external thread height h₃ = 0.6134P; stress area from d₂ and d₃ (as the metric thread tool).",
      "Blank diameter ≈ pitch diameter, adjusted on trial for full form.",
      "Roll pitch diameter = N_s (d₂ − h₃ ÷ 2) − h₃; roll lead = N_s × P (as the threading roll size tool).",
      "Example: turn the blank to about 10.863 mm; 10-start rolls have a 102.19 mm pitch diameter; 8 to 17 starts fit the machine."
    ],
    "limitations": [
      "Blank diameter is a starting value; material flow and the class of fit set the final size.",
      "Cylindrical dies; flat dies and planetary heads use other relations.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Rolls with more starts are larger and last longer, but must fit between the spindles."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2050–2051, 1867–1890. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shear-legs-check": {
    "purpose": "Check of shear legs or an A-frame of two equal legs with the load hung from the apex: the triangle of legs and foot spread, apex angle and head height (as the triangle solver tool), the compression in each leg and the outward thrust at each foot, and Euler or Johnson buckling of each round-tube leg (as the column buckling tool), checked against your factor of safety and the foot tie or anchor capacity.",
    "uses": [
      "Check improvised lifting shear legs",
      "Size the tube for an A-frame hoist",
      "Find the foot tie force"
    ],
    "users": [
      "Riggers",
      "Maintenance engineers",
      "Lifting supervisors"
    ],
    "inputs": {
      "Lg": "Length of each leg from foot to the head pin.",
      "s": "Distance between the two feet.",
      "W": "Load hung from the head, including the hook block and slings.",
      "OD": "Outside diameter of the tube legs.",
      "t": "Wall thickness of the legs.",
      "E": "Elastic modulus.",
      "Sy": "Yield strength of the tube.",
      "K": "Effective length factor for the leg ends (1 for pinned).",
      "req": "Factor against buckling you need.",
      "tie": "Capacity of the tie between the feet, or of each foot anchor against sliding outwards."
    },
    "outputs": [
      "Apex angle, leg angle and head height",
      "Leg force and foot thrust",
      "Leg buckling factor"
    ],
    "method": [
      "Triangle with sides L, L and s: apex angle and base angles by the law of cosines (as the triangle solver tool); head height = √(L² − (s ÷ 2)²).",
      "Each leg carries W ÷ (2 cos θ) with θ the half apex angle; thrust at each foot = W tan θ ÷ 2.",
      "Leg buckling by Euler or Johnson for the tube section (as the column buckling tool).",
      "Example: the head stands 3,815.8 mm high; each leg carries 5.2414 kN and the feet push out with 1.5724 kN; buckling factor 13.9."
    ],
    "limitations": [
      "Load hung centrally at the apex in the plane of the legs; shear legs also need back guys against falling over.",
      "Pinned leg ends; foot slipping and ground bearing are checked separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Spreading the feet wider lowers the head and raises both the leg force and the foot thrust."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 95–102, 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "stock-removal-plan": {
    "purpose": "Plan for machining a part from round bar: stock volume and mass from the bar diameter and cut length (as the solid volume tool), the material removed for the finished part volume and the material yield, the metal removal rate, cutting and motor power from the specific cutting force (as the turning power tool), the cutting time to remove the stock, and the stock cost, checked against the machine power and your least yield.",
    "uses": [
      "Decide whether a part is better near-net-shape",
      "Estimate roughing time from bar",
      "Check a machine’s power for heavy roughing"
    ],
    "users": [
      "Process planners",
      "Estimators",
      "Machinists"
    ],
    "inputs": {
      "D": "Diameter of the bar stock.",
      "L": "Length of bar cut for one part, including facing and parting allowances.",
      "Vf": "Volume of the finished part (from CAD).",
      "rho": "Density of the material.",
      "price": "Price of the bar.",
      "vc": "Cutting speed for roughing.",
      "f": "Feed per revolution.",
      "ap": "Depth of cut.",
      "kc": "Specific cutting force of the material.",
      "eta": "Efficiency of the spindle drive.",
      "Pavail": "Spindle power.",
      "yMin": "Least share of the bought material that ends up in the part."
    },
    "outputs": [
      "Stock volume, mass and cost",
      "Volume removed, chip mass and yield",
      "Removal rate, power and cutting time"
    ],
    "method": [
      "Stock volume = π D² ÷ 4 × L (as the solid volume tool); removed = stock − finished.",
      "Removal rate Q = v_c × a_p × f; cutting power = k_c a_p f v_c ÷ 60 000; motor power = cutting ÷ efficiency (as the turning power tool).",
      "Cutting time = volume removed ÷ Q; yield = finished ÷ stock.",
      "Example: 282.74 cm³ of bar, 132.74 cm³ to chips (53.052% yield); 44.248 s at 180 cm³/min and 7.5 kW."
    ],
    "limitations": [
      "Roughing time only; finishing, tool changes and handling are extra.",
      "Constant removal rate; small diameters may be speed-limited.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Low yield on costly material points to forgings, castings or near-net bar sizes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 82–88, 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pump-speed-control-plan": {
    "purpose": "Plan for reducing a pump’s flow by speed instead of throttling: pump and system curves fitted from the shut-off head, best-efficiency point and one known system point, the speed for the target flow (as the pump operating point tool), the head, efficiency and power at that speed, and the power when the same flow is got by throttling at full speed, with the saving per year, checked against the least speed and that the target is reachable.",
    "uses": [
      "Justify a variable speed drive on a pump",
      "Find the speed for a reduced flow",
      "Compare throttling and speed control"
    ],
    "users": [
      "Energy managers",
      "Plant engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "H0": "Head at zero flow at rated speed.",
      "Qb": "Flow at best efficiency at rated speed.",
      "Hb": "Head at best efficiency at rated speed.",
      "etab": "Best efficiency of the pump.",
      "n0": "Rated speed of the pump.",
      "Hs": "Static lift plus pressure difference the system needs at zero flow.",
      "Qd": "A flow at which the system head is known.",
      "Hd": "System head at that flow.",
      "rho": "Density of the liquid.",
      "Qt": "Flow you need.",
      "hours": "Hours per year the pump runs at the target flow.",
      "price": "Electricity price.",
      "sMin": "Lowest speed you allow (cooling, seal and stability limits)."
    },
    "outputs": [
      "Speed for the target flow",
      "Power with speed control and with throttling",
      "Yearly saving"
    ],
    "method": [
      "Pump curve H = s² H₀ − a Q² with a = (H₀ − H_b) ÷ Q_b²; system curve H = H_s + k Q²; speed ratio for the target s = √[(H_s + (a + k) Q_t²) ÷ H₀] (as the pump operating point tool).",
      "Efficiency from the curve relative to the best-efficiency flow at that speed (Q_b s); power = ρ g Q H ÷ η.",
      "Throttled at full speed: pump head H₀ − a Q_t² at efficiency for Q_t ÷ Q_b; saving = throttled − speed-controlled power.",
      "Example: run at 1,223.9 rpm (84.41%) for 300 L/min using 1.986 kW instead of 3.0945 kW throttled, saving 1,108.5 $ a year."
    ],
    "limitations": [
      "Quadratic pump and system curves and a simple efficiency curve; use the maker’s curves for important decisions.",
      "Drive and motor losses at part speed are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Speed control saves most where friction head dominates; with high static head the saving is smaller."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3021–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lot-acceptance-from-capability": {
    "purpose": "Link between process capability and incoming inspection: z-values, Cpk and the fraction of parts outside the limits for a normal process (as the parts out of tolerance tool), then the probability that a lot with that fraction defective is accepted by a single sampling plan of n parts with acceptance number c (as the sampling plan operating characteristic tool), the share of lots rejected and the average outgoing quality, against the acceptance probability you need.",
    "uses": [
      "Predict how often lots will be rejected at goods-in",
      "Set a capability target to keep lots passing",
      "Show the cost of an off-centre process"
    ],
    "users": [
      "Quality engineers",
      "Supplier quality engineers",
      "Production managers"
    ],
    "inputs": {
      "mean": "Mean of the process.",
      "sd": "Standard deviation of the process.",
      "lsl": "Lower specification limit.",
      "usl": "Upper specification limit.",
      "n": "Parts sampled from each lot.",
      "c": "Largest number of defectives in the sample for the lot to pass.",
      "PaMin": "Probability of a lot passing that you want to reach."
    },
    "outputs": [
      "z-values, Cpk and fraction outside tolerance",
      "Probability of acceptance and lots rejected",
      "Average outgoing quality"
    ],
    "method": [
      "z to each limit = distance ÷ σ; Cpk = smaller z ÷ 3; fraction defective from the normal distribution (as the parts out of tolerance tool).",
      "Probability of acceptance = Σ (k = 0 … c) C(n, k) p^k (1 − p)^(n − k) (as the sampling plan operating characteristic tool).",
      "Lots rejected = 1 − Pa; average outgoing quality ≈ p × Pa.",
      "Example: Cpk 0.88889 gives 3,862.1 ppm out of tolerance; the n = 50, c = 1 plan accepts 98.384% of lots."
    ],
    "limitations": [
      "Stable normal process; tails of real processes are often heavier.",
      "Binomial sampling from large lots.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Centring the process usually cuts rejected lots faster than tightening the spread."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 2859-1 Sampling procedures for inspection by attributes"
    ]
  },
  "sump-pumpout-plan": {
    "purpose": "Pump-out plan for a pit, trench or sump of uniform length with an irregular cross-section: the section area by Simpson’s rule from depths measured at equal spacings across it (as the Simpson’s rule area tool), the volume over the length, the net pumping rate after inflow, and the time to empty, against the time you have.",
    "uses": [
      "Plan dewatering of a machine pit or trench",
      "Estimate a sump volume from soundings",
      "Size a pump for a pump-out time"
    ],
    "users": [
      "Maintenance supervisors",
      "Plant engineers",
      "Site engineers"
    ],
    "inputs": {
      "W": "Equal spacing between the depth readings across the pit.",
      "Ns": "Number of spaces between readings (must be even).",
      "V0": "Water depth at the first reading.",
      "V1": "Depth at reading 1.",
      "V2": "Depth at reading 2.",
      "V3": "Depth at reading 3.",
      "V4": "Depth at reading 4.",
      "V5": "Depth at reading 5.",
      "V6": "Depth at reading 6.",
      "V7": "Depth at reading 7.",
      "V8": "Depth at reading 8.",
      "V9": "Depth at reading 9.",
      "V10": "Depth at reading 10.",
      "L": "Length of the pit along which the section is uniform.",
      "pump": "Flow the pump delivers at the pumping head.",
      "inflow": "Water still entering while pumping.",
      "tMax": "Time you have to empty it."
    },
    "outputs": [
      "Section area by Simpson’s rule",
      "Volume of water",
      "Net pumping rate and time to empty"
    ],
    "method": [
      "Area = (spacing ÷ 3)(d₀ + 4d₁ + 2d₂ + … + 4d_(N−1) + d_N) (as the Simpson’s rule area tool).",
      "Volume = section area × length.",
      "Time = volume ÷ (pump flow − inflow).",
      "Example: the section is 4.2333 m², holding 25,400 L; at a net 500 L/min it takes 50.8 min."
    ],
    "limitations": [
      "Uniform section along the length; irregular pits need several sections averaged.",
      "Pump flow taken as constant although head rises as the level falls.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Inflow eats directly into pumping: a pump only slightly larger than the inflow never empties the pit."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 67–68. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "outdoor-cabinet-wind-tipping": {
    "purpose": "Check of a free-standing outdoor item against wind: dynamic pressure, wind force and its height (as the wind pressure tool), restoring and overturning moments about the leeward edge and the safety factor against tipping, with the anchor tension needed if it falls short (as the machine tipping stability tool), and sliding resistance from friction at the base against the wind force.",
    "uses": [
      "Check an outdoor switchboard or cabinet",
      "Decide whether a temporary tank or machine needs anchors",
      "Find anchor tension for a wind rating"
    ],
    "users": [
      "Site engineers",
      "Electrical contractors",
      "Maintenance engineers"
    ],
    "inputs": {
      "V": "Design gust or wind speed at the site.",
      "rhoA": "Air density.",
      "Cd": "Force coefficient for the shape (about 1.2–1.5 for box shapes).",
      "A": "Projected area facing the wind.",
      "hF": "Height above the base of the centre of that area.",
      "mass": "Mass of the item (use the empty mass if it can stand empty).",
      "hcg": "Height of its centre of gravity.",
      "b": "Horizontal distance from the centre of gravity to the edge it would tip about.",
      "mu": "Friction coefficient between the base and the ground.",
      "req": "Safety factor against tipping you need.",
      "nA": "Anchors on the windward side that would resist uplift.",
      "La": "Distance from the tipping edge to those anchors.",
      "cap": "Tension capacity of each anchor."
    },
    "outputs": [
      "Wind pressure, force and overturning moment",
      "Tipping safety factor and anchor tension",
      "Sliding resistance"
    ],
    "method": [
      "q = ½ ρ V²; wind force F = C_d q A at the area centre height (as the wind pressure tool).",
      "Restoring moment = W b; overturning moment = F h; factor = restoring ÷ overturning; anchor tension = (factor needed × overturning − restoring) ÷ (anchors × lever) (as the machine tipping stability tool).",
      "Sliding resistance = μ W, against F.",
      "Example: 15 m/s gives 351 N of wind; the tipping factor is 2.5145 and friction resists 882.6 N."
    ],
    "limitations": [
      "Steady wind with one force coefficient; gusts, vortex shedding and shielding are not covered.",
      "Rigid item on a level base; soft ground can let it rock.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An empty tank or cabinet is the worst case: always check with the lightest mass it can have outdoors."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3028, 167–168. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "segmented-flange-plan": {
    "purpose": "Plan for a large flat ring (flange, stiffener or base ring) welded from equal segments cut from plate: the area of each ring-sector segment (as the plane area tool for a ring sector), the bounding rectangle each segment needs (chord of the outside edge by the width from the outside edge to the inside chord), whether it fits the plate size, material yield, ring mass and the length of butt welds, checked against the plate size and your least yield.",
    "uses": [
      "Plan a large flange or base ring from plate",
      "Choose the number of segments for a plate size",
      "Estimate plate and welding for a ring"
    ],
    "users": [
      "Boilermakers",
      "Fabrication supervisors",
      "Estimators"
    ],
    "inputs": {
      "OD": "Outside diameter of the finished ring.",
      "ID": "Inside diameter of the finished ring.",
      "n": "Number of equal segments welded together.",
      "t": "Thickness of the plate.",
      "rho": "Density of the plate.",
      "allow": "Extra added around each segment for cutting.",
      "pw": "Width of the plate available.",
      "pl": "Length of the plate available.",
      "yMin": "Least share of each rectangle used by its segment."
    },
    "outputs": [
      "Segment area and bounding rectangle",
      "Plate fit and yield",
      "Ring mass and butt weld length"
    ],
    "method": [
      "Segment area = (R² − r²) θ ÷ 2 with θ = 360° ÷ n (as the plane area tool for a ring sector).",
      "Rectangle length = 2R sin(θ ÷ 2) + allowance; width = R − r cos(θ ÷ 2) + allowance.",
      "Yield = segment area ÷ rectangle area; ring mass = n × area × thickness × density; welds = n × (R − r).",
      "Example: each of 6 segments needs 1,510 × 384.17 mm (50.546% yield); the ring weighs 276.21 kg with 1.2 m of butt weld."
    ],
    "limitations": [
      "Rectangles nested one per space; staggering segments head-to-tail on the plate improves yield.",
      "Weld shrinkage and machining allowance on the faces are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More segments improve yield and fit smaller plate, but add welds: balance plate cost against welding."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66–81. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
