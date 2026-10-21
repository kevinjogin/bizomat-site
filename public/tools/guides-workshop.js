// Original methods, examples, input sources and application limits.
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "signed-tolerance-stack": {
    "purpose": "Calculate exact interval bounds for a three-term linear dimension chain with asymmetric tolerances and signed coefficients.",
    "uses": [
      "assembly clearance",
      "worst-case stack",
      "asymmetric tolerance"
    ],
    "users": [
      "Design engineers",
      "Drawing checkers",
      "Toolmakers"
    ],
    "inputs": {
      "n1": "Nominal dimension in the signed assembly equation, measured from a consistent datum.",
      "l1": "Positive distance from nominal down to the permitted minimum; 0 means no lower deviation.",
      "u1": "Positive distance from nominal up to the permitted maximum; 0 means no upper deviation.",
      "c1": "Coefficient in the linear equation: +1 adds, −1 subtracts and 0 excludes this term.",
      "n2": "Nominal dimension in the signed assembly equation, measured from a consistent datum.",
      "l2": "Positive distance from nominal down to the permitted minimum; 0 means no lower deviation.",
      "u2": "Positive distance from nominal up to the permitted maximum; 0 means no upper deviation.",
      "c2": "Coefficient in the linear equation: +1 adds, −1 subtracts and 0 excludes this term.",
      "n3": "Nominal dimension in the signed assembly equation, measured from a consistent datum.",
      "l3": "Positive distance from nominal down to the permitted minimum; 0 means no lower deviation.",
      "u3": "Positive distance from nominal up to the permitted maximum; 0 means no upper deviation.",
      "c3": "Coefficient in the linear equation: +1 adds, −1 subtracts and 0 excludes this term."
    },
    "outputs": [
      "Nominal result",
      "Minimum and maximum result",
      "Contribution of each term"
    ],
    "method": [
      "Define y = c₁n₁ + c₂n₂ + c₃n₃. Each dimension lies between n − lower deviation and n + upper deviation.",
      "Multiply both limits by the signed coefficient, take the smaller and larger products, then sum the three lower products and three upper products.",
      "Example: 100 (−0.1/+0.2) − 60 (−0.05/+0.1) − 30 (−0.02/+0.03) mm gives 10 mm nominal, with limits 9.77 to 10.27 mm."
    ],
    "limitations": [
      "Linear size-only worst-case calculation; geometry, deformation and temperature require separate treatment.",
      "Coefficients may combine repeated terms for worst-case arithmetic. Correlated constraints can make the interval conservative. There is no RSS or probability claim.",
      "Three terms are supported. Carry validated limits when combining a longer sub-chain into one term.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Write the physical equation first and check subtraction directions against the drawing.",
      "Compare both limits with the functional requirement; a positive nominal gap alone does not establish clearance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 608–636. Topic reference; implementation and examples are original, and no source tables are reproduced.",
      "Method: direct interval arithmetic for a linear dimension equation; no statistical tolerancing standard is assumed."
    ]
  },
  "measurement-uncertainty": {
    "purpose": "Combine repeatability, calibration, resolution and one bounded dimensional contribution into standard and expanded uncertainty.",
    "uses": [
      "measurement budget",
      "repeatability",
      "coverage factor"
    ],
    "users": [
      "Metrology teams",
      "Quality engineers",
      "Inspectors"
    ],
    "inputs": {
      "mode": "Choose a sample mean or one individual observation.",
      "sd": "Sample standard deviation from independent repeated measurements under the relevant conditions.",
      "count": "Observations used to estimate the standard deviation; also the averaging count in mean mode.",
      "cal": "Expanded uncertainty from the calibration certificate in millimetres at the relevant point.",
      "calK": "Coverage factor stated on that certificate; do not assume every certificate uses 2.",
      "resolution": "Smallest digital increment, modelled as independent rounding over ±half an increment.",
      "bound": "Half-width of one independent rectangular contribution, already converted to equivalent dimensional error in millimetres.",
      "coverage": "Coverage factor justified by the uncertainty procedure and effective degrees of freedom."
    },
    "outputs": [
      "Combined standard uncertainty",
      "Expanded uncertainty",
      "Component standard uncertainties and variance shares"
    ],
    "method": [
      "Repeatability u = s/√n for a mean or s for one observation. Calibration u = certificate expanded uncertainty divided by its coverage factor.",
      "Resolution u = increment/√12. Other rectangular u = half-width/√3. Combined u is the square root of the sum of the four squared contributions. Expanded U = k × combined u.",
      "Example: s = 0.01 mm, n = 10, calibration U = 0.004 mm at k = 2, resolution 0.01 mm and half-width 0.003 mm gives combined u ≈ 0.005033223 mm and U ≈ 0.010066446 mm at output k = 2."
    ],
    "limitations": [
      "All contributions must be in millimetres with unit sensitivity coefficients. Covariances and general propagation coefficients are not modelled.",
      "Do not count resolution twice if another contribution already includes it. Resolution is not reduced by averaging here.",
      "k = 2 does not automatically establish 95% coverage. Small samples, distributions, bias corrections and degrees of freedom need review.",
      "An all-zero budget is rejected. No conformity decision or accredited certificate is issued.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Document the measurement model and independence evidence before using the combined result.",
      "Variance shares help prioritise improvement. Record the quantity, unit, coverage factor and uncertainty together."
    ],
    "refs": [
      "NIST TN 1297: Law of propagation of uncertainty — https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-law-propagation-uncertainty",
      "NIST TN 1297: Reporting uncertainty — https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-7-reporting-uncertainty",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 709–738. Topic reference; implementation and examples are original, and no source tables are reproduced."
    ]
  },
  "section-properties": {
    "purpose": "Calculate area, centroidal second moments, elastic section moduli and radii of gyration for four ideal section shapes.",
    "uses": [
      "second moment of area",
      "section modulus",
      "rectangular tube"
    ],
    "users": [
      "Mechanical designers",
      "CAD users",
      "Fabricators"
    ],
    "inputs": {
      "shape": "Select the ideal geometry; commercial sections can have corner radii and tolerances.",
      "width": "Outside horizontal width for rectangles or outside diameter for circles.",
      "height": "Outside vertical height; ignored for circles. Leave a valid positive value when unused.",
      "wall": "Uniform wall; ignored for solid sections. Leave a valid positive value when unused."
    },
    "outputs": [
      "Area and centroid from lower-left bounding corner",
      "Centroidal horizontal Iₓ and vertical Iᵧ",
      "Elastic section moduli and gyration radii"
    ],
    "method": [
      "Rectangle: A = bh, Iₓ = bh³/12, Iᵧ = hb³/12. Circle: A = πD²/4, Iₓ = Iᵧ = πD⁴/64.",
      "For tubes subtract the centred inner shape. Section modulus Z = I divided by the corresponding extreme-fibre distance; gyration radius = √(I/A).",
      "Example: a 40 × 80 mm rectangle gives A = 3200 mm², Iₓ = 1,706,666.667 mm⁴, Iᵧ = 426,666.667 mm⁴ and Zₓ = 42,666.667 mm³."
    ],
    "limitations": [
      "Hollow rectangles have sharp corners. Use certified catalogue or CAD properties for rounded stock.",
      "Area second moments are not mass moments. Iₓ + Iᵧ is not the torsion constant of a rectangle.",
      "No stress, allowable load, buckling resistance or structural-code compliance is determined.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Match the bending axis when transferring I or Z to another calculation.",
      "Centroid coordinates use the lower-left outside bounding corner; moments are about centroidal axes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 236–244. Topic reference; implementation and examples are original, and no source tables are reproduced."
    ]
  },
  "countersink-depth": {
    "purpose": "Resolve axial cone depth from pilot diameter, mouth diameter and included angle, then compare it with material thickness.",
    "uses": [
      "countersink geometry",
      "remaining wall",
      "breakthrough"
    ],
    "users": [
      "Machinists",
      "Design engineers"
    ],
    "inputs": {
      "pilot": "Finished cylindrical pilot-hole diameter.",
      "mouth": "Required diameter at the entry face; at least the pilot diameter.",
      "angle": "Full included cone angle, verified from the tool and drawing.",
      "thickness": "Axial thickness from the entry face to the opposite face."
    },
    "outputs": [
      "Axial depth",
      "Remaining axial thickness",
      "Mouth diameter at just-through depth"
    ],
    "method": [
      "h = (mouth − pilot)/[2 tan(included angle/2)]. Remaining thickness = thickness − h.",
      "Mouth diameter at just-through depth = pilot + 2 × thickness × tan(angle/2).",
      "Example: 6 mm pilot, 12 mm mouth and 90° included angle gives 3 mm depth, leaving 2 mm in 5 mm material."
    ],
    "limitations": [
      "Ideal coaxial cone and cylindrical pilot; burrs, runout and tolerances are excluded.",
      "Zero or negative remaining thickness is reported as breakthrough. Positive remaining material is not proof of adequate strength.",
      "This is geometry, not a fastener-seat standard or a counterbore calculator.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Confirm the drawing uses the included angle.",
      "Verify a trial part and assess the minimum-thickness tolerance condition."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 852–853. Topic reference; implementation and examples are original, and no source tables are reproduced.",
      "Method: right-triangle geometry of the cone half-angle."
    ]
  },
  "turning-cusp": {
    "purpose": "Compare exact circular-nose turning cusp geometry with the small-feed approximation.",
    "uses": [
      "turning finish geometry",
      "nose radius",
      "peak-to-valley cusp"
    ],
    "users": [
      "Machinists",
      "Process engineers"
    ],
    "inputs": {
      "feed": "Actual straight-turning axial feed per revolution, not feed per minute.",
      "radius": "Circular nose radius from the insert geometry, not a wiper effective width."
    },
    "outputs": [
      "Exact ideal cusp in micrometres",
      "Small-feed approximation",
      "Approximation difference"
    ],
    "method": [
      "Exact h = r − √(r² − f²/4). The equivalent f²/[4(r + √(r² − f²/4))] retains precision at small feed.",
      "Approximate h = f²/(8r). Multiply millimetres by 1000 for micrometres.",
      "Example: f = 0.2 mm/rev and r = 0.8 mm gives exact cusp 6.274607 µm; the approximation gives 6.25 µm."
    ],
    "limitations": [
      "Peak-to-valley geometry is not measured Ra or Rz; no surface-parameter conversion is made.",
      "Wiper geometry, chatter, wear, built-up edge and material recovery can dominate finish.",
      "Feed must be below the nose diameter; this bound does not establish a suitable cutting setting.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Compare geometric trends, then measure the specified surface parameter.",
      "Check tool data and stability before changing feed or nose radius."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 733–742. Topic reference; implementation and examples are original, and no source tables are reproduced.",
      "Method: circular-segment geometry. Handbook pages explain surface-texture terminology, not guaranteed finish."
    ]
  },
  "radial-chip-thinning": {
    "purpose": "Calculate a geometric chip-thinning correction for a 90° peripheral cutter and supplied maximum chip thickness.",
    "uses": [
      "radial engagement",
      "chip thinning",
      "feed per tooth"
    ],
    "users": [
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "diameter": "Effective diameter of a cylindrical cutter with a 90° entering angle.",
      "width": "Actual radial engagement on a straight peripheral pass, greater than zero and no greater than the diameter.",
      "chip": "Validated target maximum chip thickness from supplier data or an approved process.",
      "rpm": "Proposed speed checked against machine, cutter and workholding limits.",
      "teeth": "Effective cutting teeth used in the feed calculation."
    },
    "outputs": [
      "Chip-thickness factor",
      "Corrected feed per tooth",
      "Calculated table feed"
    ],
    "method": [
      "Let r = width/diameter. Below r = 0.5, factor = 2√[r(1 − r)]; at or above 0.5, factor = 1.",
      "Feed per tooth = maximum chip thickness/factor. Table feed = feed per tooth × teeth × RPM.",
      "Example: 1 mm engagement on a 10 mm cutter gives factor 0.6. A 0.05 mm chip requires 0.083333 mm/tooth, giving 666.667 mm/min with 4 teeth at 2000 rpm."
    ],
    "limitations": [
      "Straight peripheral milling with a 90° entering angle only. Ball-nose, round-insert, high-feed and changing-engagement paths need other models.",
      "Very small engagement can request very high feed. Machine dynamics and tool limits still govern.",
      "No suitable chip thickness is selected and no machine program is issued.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Check corners, entry and increased engagement across the whole path.",
      "Compare the calculation with supplier limits, then validate the process."
    ],
    "refs": [
      "Sandvik Coromant: Milling formulas and definitions — https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions",
      "Harvey Performance: How to combat chip thinning — https://www.harveyperformance.com/in-the-loupe/combat-chip-thinning/"
    ]
  },
  "ball-nose-diameter": {
    "purpose": "Calculate the maximum engaged diameter of an untilted ball nose, its boundary cutting speed and RPM for a specified speed.",
    "uses": [
      "ball nose",
      "effective diameter",
      "shallow milling"
    ],
    "users": [
      "CNC programmers",
      "Tooling engineers"
    ],
    "inputs": {
      "diameter": "Spherical ball diameter from the tool drawing.",
      "depth": "Depth from the ball tip into a flat surface, no greater than the radius.",
      "rpm": "Actual or proposed spindle setting.",
      "speed": "Validated cutting speed at the maximum engaged diameter."
    },
    "outputs": [
      "Maximum effective diameter",
      "Boundary surface speed",
      "RPM for specified speed"
    ],
    "method": [
      "Effective diameter = 2√[a(D − a)] for 0 < depth a ≤ D/2.",
      "Surface speed = π × effective diameter × RPM/1000. Required RPM = 1000 × speed/(π × effective diameter).",
      "Example: a 10 mm ball at 1 mm depth has 6 mm effective diameter. At 5000 rpm its boundary speed is 94.247780 m/min; 100 m/min requires 5305.164770 rpm."
    ],
    "limitations": [
      "An untilted cutter and flat surface are assumed. Tilt, scallop height and general 3D contact are excluded.",
      "Speed varies over the contact and remains zero at the rotational centre; the reported speed is the maximum engaged boundary speed.",
      "A large calculated RPM may exceed equipment limits. Feed and chip thinning are separate.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Review actual contact geometry in CAM.",
      "Verify spindle, tool and workholding limits."
    ],
    "refs": [
      "Sandvik Coromant: Milling formulas and definitions — https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions",
      "Harvey Performance: Ball nose milling strategy guide — https://www.harveyperformance.com/in-the-loupe/ball-nose-milling-strategy-guide/"
    ]
  },
  "circular-interpolation-feed": {
    "purpose": "Convert peripheral feed to tool-centre feed for a constant-height internal or external circular pass.",
    "uses": [
      "circular milling",
      "internal interpolation",
      "tool centre feed"
    ],
    "users": [
      "CNC programmers",
      "Machinists"
    ],
    "inputs": {
      "side": "Inside a bore or outside a boss.",
      "work": "Finished wall diameter at the contact plane.",
      "cutter": "Effective cylindrical cutter diameter; smaller than the bore for internal milling.",
      "feed": "Desired feed around the workpiece circumference after selecting suitable cutting data."
    },
    "outputs": [
      "Centre-path diameter",
      "Tool-centre feed",
      "Full-circle travel and time"
    ],
    "method": [
      "Centre-path diameter = work diameter − cutter diameter internally, or work diameter + cutter diameter externally.",
      "Centre feed = peripheral feed × centre-path diameter/work diameter. Full-circle time = π × centre-path diameter/centre feed.",
      "Example: a 10 mm cutter inside a 50 mm bore at 1000 mm/min peripheral feed needs 800 mm/min centre feed. One 40 mm centre-path circle takes 0.157080 min."
    ],
    "limitations": [
      "Constant-height 2D motion at constant speed only; helical motion, acceleration and entry are excluded.",
      "CAM/controller compensation conventions vary. Applying the correction twice gives the wrong feed.",
      "This tool does not select radial engagement or an acceptable cutting load.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Confirm whether the controller expects centre or compensated contour feed.",
      "Review the path using the established setup procedure."
    ],
    "refs": [
      "Sandvik Coromant: Milling formulas and definitions — https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions"
    ]
  },
  "coolant-blend": {
    "purpose": "Balance two compatible volume concentrations to prepare a specified final coolant volume.",
    "uses": [
      "coolant mixing",
      "dilution",
      "concentration balance"
    ],
    "users": [
      "Maintenance teams",
      "Machine shop supervisors"
    ],
    "inputs": {
      "volume": "Required final working volume with tank operating allowance.",
      "strong": "Actual volume concentration of the stronger fluid; 100% denotes the same product concentrate.",
      "weak": "Actual concentration of the weaker compatible fluid; 0% denotes intended make-up water.",
      "target": "Supplier-approved target for the operation."
    },
    "outputs": [
      "Stronger-fluid volume",
      "Weaker-fluid volume",
      "Concentrate-equivalent balance"
    ],
    "method": [
      "Stronger volume = final volume × (target − weaker concentration)/(stronger − weaker concentration). Weaker volume is the remainder.",
      "The stronger concentration must exceed the weaker, with the target between them. All percentages use the same volume basis.",
      "Example: 100 L at 5%, made from 100% concentrate and 0% water, requires 5 L concentrate and 95 L water under the additive-volume assumption."
    ],
    "limitations": [
      "Volumes are assumed additive. Mass-based concentrations require density-aware mass balance.",
      "Streams must be compatible forms of the same coolant system. No compatibility or mixing-order advice is inferred.",
      "Refractometer readings require the product-specific factor and contamination checks.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Follow supplier mixing instructions, circulate and measure final concentration.",
      "Record actual quantities and check product range, water quality and coolant condition."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1182–1187. Topic reference; implementation and examples are original, and no source tables are reproduced.",
      "Blaser Swisslube: Measuring coolant concentration — https://blaser.com/measuring-the-coolant-concentration/"
    ]
  },
  "coolant-topup": {
    "purpose": "Calculate the addition needed to correct an existing coolant concentration using a specified make-up mixture.",
    "uses": [
      "sump top-up",
      "coolant correction",
      "tank capacity"
    ],
    "users": [
      "Maintenance teams",
      "Machinists"
    ],
    "inputs": {
      "volume": "Measured volume before correction, excluding unusable tank space.",
      "current": "Representative measured concentration after the refractometer correction.",
      "addition": "Actual concentration of compatible prepared make-up fluid.",
      "target": "Required final concentration within product instructions.",
      "capacity": "Maximum permitted working level with operating headroom, not brim capacity."
    },
    "outputs": [
      "Required addition",
      "Final working volume",
      "Capacity margin"
    ],
    "method": [
      "Added volume = existing volume × (target − current concentration)/(make-up − target concentration).",
      "A target already equal to current needs no addition. Make-up at the target cannot bring a different initial concentration exactly to target in finite volume.",
      "Example: 100 L at 3%, corrected to 5% with 20% make-up, needs 13.333333 L and ends at 113.333333 L."
    ],
    "limitations": [
      "Compatible fluids, volume fractions, additive volumes and complete mixing are assumed. No removal or evaporation occurs during addition.",
      "The make-up concentration must be beyond the target in the required direction. Unattainable targets are rejected.",
      "Capacity exceedance is reported without clipping the quantity. Drain-and-replace planning is excluded.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Confirm working level before adding; if capacity fails, develop a separate supplier-approved correction plan.",
      "Circulate and recheck condition and concentration."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1182–1187. Topic reference; implementation and examples are original, and no source tables are reproduced.",
      "Blaser Swisslube: Measuring coolant concentration — https://blaser.com/measuring-the-coolant-concentration/"
    ]
  },
  "stock-cut-plan": {
    "purpose": "Build a feasible longest-first plan for three part lengths, with end trims, kerf, offcuts and bars to purchase.",
    "uses": [
      "cut stock",
      "saw cutting plan",
      "material yield"
    ],
    "users": [
      "Fabricators",
      "Estimators",
      "Workshop planners"
    ],
    "inputs": {
      "stock": "Purchased full-length stock before end trims; all bars use this length.",
      "trim": "Length removed at each end, including any trim-cut loss not covered by per-piece kerf.",
      "kerf": "One kerf per finished piece including the last piece: deliberately conservative.",
      "length1": "Required cut length including any later machining allowance.",
      "count1": "Whole pieces of this length, up to 100; use 0 to omit this part.",
      "length2": "Required cut length including any later machining allowance.",
      "count2": "Whole pieces of this length, up to 100; use 0 to omit this part.",
      "length3": "Required cut length including any later machining allowance.",
      "count3": "Whole pieces of this length, up to 100; use 0 to omit this part.",
      "available": "Identical full-length bars already available; shorter offcuts are excluded."
    },
    "outputs": [
      "Per-bar cutting list",
      "Required bars and purchase quantity",
      "Parts, kerf, trims, offcuts and yield"
    ],
    "method": [
      "Enter lengths to at most three decimals in millimetres; calculations use integer micrometres. Usable length is stock minus two end trims.",
      "Sort pieces longest first and place each into the first bar with room for its length plus one kerf, starting another bar when necessary.",
      "The ceiling of total piece-plus-kerf length divided by usable bar length is a material lower bound. Matching this bound proves minimum bar count in this model; otherwise the plan is only feasible.",
      "Example: 1000 mm stock, 5 mm each end and 2 mm kerf, with six 250 mm, four 180 mm and four 90 mm pieces needs 3 bars. Parts = 2580 mm, kerf = 28 mm, trims = 30 mm, offcuts = 362 mm. With 2 bars available, purchase 1."
    ],
    "limitations": [
      "At most three lengths and 100 pieces each. Mixed stock sizes, mitres, defects, clamping length, shared cuts and reusable offcut inventory are excluded.",
      "First-fit decreasing is a heuristic. A plan above the lower bound is not claimed optimal.",
      "One kerf is reserved per finished piece, including the last. End trims include their own cutting loss.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Check each pattern, stock specification and machine allowances before cutting.",
      "Yield is finished part length/gross stock length. No reuse value is assigned to offcuts."
    ],
    "refs": [
      "Method: original first-fit decreasing implementation with integer length accounting and a material lower bound."
    ]
  },
  "fillet-weld-quantity": {
    "purpose": "Estimate equal-leg fillet volume and mass with a supplied profile allowance, density and deposition efficiency.",
    "uses": [
      "weld metal quantity",
      "fillet volume",
      "consumable estimate"
    ],
    "users": [
      "Welding estimators",
      "Fabrication planners"
    ],
    "inputs": {
      "leg": "Equal leg on a 90° joint, not throat size.",
      "length": "Total actual weld length; count both sides separately where required.",
      "density": "Deposited metal density from a relevant material source.",
      "profile": "Justified multiplier over ideal triangular volume; 1 means ideal triangle.",
      "efficiency": "Deposited mass/consumed filler mass on the same accounting basis, from demonstrated process data."
    },
    "outputs": [
      "Ideal area and geometric throat",
      "Adjusted deposited volume and mass",
      "Consumed filler mass"
    ],
    "method": [
      "Ideal area = leg²/2; geometric throat = leg/√2 for a flat-faced equal-leg 90° fillet.",
      "Volume = area × length × profile factor. Mass = volume/10⁹ × density. Consumed filler = deposited mass/(efficiency/100).",
      "Example: 6 mm legs over 1000 mm, profile factor 1.1, density 7850 kg/m³ and 95% efficiency gives 0.15543 kg deposited and 0.163611 kg consumed filler."
    ],
    "limitations": [
      "No strength, required weld size, penetration, distortion or procedure qualification is evaluated. Geometric throat is not a design acceptance value.",
      "Unequal legs, grooves, concavity and gaps need another section model.",
      "Flux, stubs, packaging and purchasing waste may require separate allowances on a consistent efficiency basis.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Use approved geometry and measured profile/deposition data.",
      "Estimate arc time, labour, access and inspection separately."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1437–1452. Topic reference; implementation and examples are original, and no source tables are reproduced.",
      "Method: triangular geometry, volume and mass balance; no weld design standard is substituted."
    ]
  },
  "welding-heat-input": {
    "purpose": "Separate unadjusted arc energy from efficiency-adjusted heat input for a steady arc and supplied travel speed.",
    "uses": [
      "welding energy",
      "arc energy",
      "travel speed"
    ],
    "users": [
      "Welding engineers",
      "Fabrication teams",
      "Procedure reviewers"
    ],
    "inputs": {
      "voltage": "Measured across the arc using a suitable method; supply-terminal voltage may differ.",
      "current": "Measured current for a sufficiently steady arc. Product of averages is not a general pulsed-power measurement.",
      "travel": "Actual travel per minute along the weld.",
      "efficiency": "Energy efficiency required by the applicable procedure or convention; not deposition efficiency."
    },
    "outputs": [
      "Steady arc power",
      "Arc energy per millimetre",
      "Adjusted heat input"
    ],
    "method": [
      "Arc power = voltage × current. Arc energy (kJ/mm) = 60 × voltage × current/(1000 × travel in mm/min).",
      "Adjusted heat input = arc energy × efficiency/100.",
      "Example: 24 V, 200 A, 300 mm/min gives 4.8 kW and 0.96 kJ/mm arc energy. Supplied 80% efficiency gives 0.768 kJ/mm adjusted heat input."
    ],
    "limitations": [
      "Pulsed or waveform-controlled welding needs appropriate power integration; multiplying mean current and mean voltage can be wrong.",
      "Terminology and efficiency conventions differ among standards. Identify whether the requirement concerns arc energy or adjusted heat input.",
      "No acceptable energy window, preheat, interpass limit or procedure approval is provided.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Compare the appropriate quantity with the qualified procedure and applicable standard.",
      "Record measurement locations, travel method and efficiency source."
    ],
    "refs": [
      "TWI: Difference between heat input and arc energy — https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-the-difference-between-heat-input-and-arc-energy",
      "TWI: Measurement of arc welding parameters — https://www.twi-global.com/technical-knowledge/job-knowledge/measurement-of-arc-welding-parameters-139",
      "TWI: ISO 15614-1:2017 changes, including waveform energy measurement — https://www.twi-global.com/technical-knowledge/faqs/faq-whats-new-in-iso-15614-1-2017"
    ]
  },
  "tube-bend-length": {
    "purpose": "Sum straight tangent lengths and centreline arc lengths for repeated equal-radius tube bends.",
    "uses": [
      "tube development",
      "centreline arc",
      "bend allowance"
    ],
    "users": [
      "Tube fabricators",
      "Mechanical designers",
      "Estimators"
    ],
    "inputs": {
      "radius": "Radius to tube centreline, not inside radius or die outside diameter.",
      "angle": "Direction change per bend; 90° is a right-angle turn and 0° is straight.",
      "bends": "Bends sharing the same radius and direction change.",
      "straight": "Sum of straight centreline lengths between tangencies and ends, not theoretical sharp intersections."
    },
    "outputs": [
      "Arc per bend",
      "Total arc length",
      "Geometric developed length"
    ],
    "method": [
      "One arc = radius × angle × π/180. Total = total straights + bend count × one arc.",
      "Example: two 90° bends at 50 mm centreline radius add 157.079633 mm to 400 mm straights, giving 557.079633 mm.",
      "For different radii, calculate each arc group separately and add each contribution once to the common straight total."
    ],
    "limitations": [
      "Centreline geometry excludes stretching, thinning, ovality, springback, clamp allowance and trim.",
      "No minimum bend radius or forming feasibility is established.",
      "Bend intersections and three-dimensional collisions are not checked.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Confirm tangent locations on the drawing or CAD model.",
      "Use process trials and the machine method to release the production cutting length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1382–1383. Topic reference; implementation and examples are original, and no source tables are reproduced.",
      "Method: circular arc length in radians plus straight centreline lengths."
    ]
  },
  "thermal-fit": {
    "purpose": "Calculate signed diametral clearance after hole and shaft undergo separate uniform temperature changes from one reference.",
    "uses": [
      "operating clearance",
      "differential expansion",
      "thermal interference"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "hole": "Actual or selected limit hole diameter at the reference temperature.",
      "shaft": "Actual or selected limit shaft diameter at the same temperature.",
      "holeAlpha": "Validated mean linear expansion coefficient for the hole material over its range.",
      "shaftAlpha": "Validated mean coefficient for the shaft material over its range.",
      "reference": "Common temperature at which both entered diameters apply.",
      "holeTemp": "Uniform temperature of the hole-carrying part.",
      "shaftTemp": "Uniform operating shaft temperature."
    },
    "outputs": [
      "Operating diameters",
      "Reference and operating signed clearance",
      "Thermal clearance change"
    ],
    "method": [
      "For each part: diameter at temperature = reference diameter × [1 + coefficient × 10⁻⁶ × temperature change].",
      "Signed diametral clearance = hole − shaft. Positive is gap; negative is geometric interference.",
      "Example: 50.02 mm hole with coefficient 23 and 50 mm shaft with coefficient 12, referenced at 20°C and operating at 80°C and 60°C, gives 50.0890276 and 50.024 mm. Clearance = 0.0650276 mm."
    ],
    "limitations": [
      "Uniform, unrestrained isotropic expansion with constant mean coefficients; gradients, coatings and constraint are excluded.",
      "Interference is geometric, not a contact-pressure or assembly-force result.",
      "Coefficients are user-supplied, and the examples do not select materials. Tolerance/temperature corner cases require separate evaluation.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Check minimum and maximum clearance across credible size and temperature conditions.",
      "Verify material data over the complete temperature range."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–379. Topic reference; implementation and examples are original, and no source tables are reproduced."
    ]
  },
  "axial-stress": {
    "purpose": "Calculate nominal stress, strain, extension or shortening and strain energy for a uniform member under concentric axial load.",
    "uses": [
      "axial deformation",
      "tensile stress",
      "elastic strain"
    ],
    "users": [
      "Mechanical designers",
      "Project engineers"
    ],
    "inputs": {
      "force": "Concentric force: tension positive, compression negative.",
      "area": "Uniform load-carrying area normal to force, with any justified net-area reduction.",
      "length": "Uniform length between the displacement reference points.",
      "modulus": "Young’s modulus for the actual material, temperature and elastic loading direction."
    },
    "outputs": [
      "Signed nominal stress and strain",
      "Extension or shortening",
      "Elastic strain energy"
    ],
    "method": [
      "Stress = force/area in N/mm² (MPa); strain = stress/E; extension = strain × length.",
      "Energy in joules = force² × length/(2 × area × E × 1000), for elastic loading from zero.",
      "Example: 10,000 N, 200 mm², 1000 mm and 200,000 MPa gives 50 MPa, strain 0.00025, extension 0.25 mm and 1.25 J."
    ],
    "limitations": [
      "Small-strain linear elasticity, uniform area and concentric static load are assumed. Yielding, joints, thermal effects and concentrations are excluded.",
      "Compression may buckle before nominal stress becomes high; column stability is not calculated.",
      "No allowable load or structural compliance is established.",
      "Default values are worked examples, not recommended settings or material properties."
    ],
    "interpret": [
      "Compare with independently established material, stability and serviceability criteria.",
      "Check load introduction and joint compliance when comparing measured displacement."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 199–202. Topic reference; implementation and examples are original, and no source tables are reproduced."
    ]
  }
});
