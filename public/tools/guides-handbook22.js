// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook22).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "retaining-ring-thrust": {
    "purpose": "Allowable thrust on a retaining ring application by the handbook formulas: ring shear capacity, the load at the onset of groove yielding for spiral-wound rings, the governing (lower) value, and the minimum distance of the groove from the end of the shaft or bore.",
    "uses": [
      "Check a circlip or spiral ring against an axial load",
      "Choose groove material and depth for a higher thrust",
      "Locate a groove safely near a shaft end"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Assembly engineers"
    ],
    "inputs": {
      "D": "Diameter of the shaft or bore carrying the ring.",
      "t": "Thickness of the ring.",
      "dg": "Depth of the groove.",
      "Ss": "Shear strength of the ring material (from the ring supplier).",
      "Sy": "Compressive yield strength of the grooved part.",
      "Sc": "Shear strength of the grooved part.",
      "K": "Safety factor (the handbook notes 3 is usual for ring shear).",
      "P": "Axial load the ring must hold.",
      "ring": "Spiral rings contact the whole groove; stamped rings only part of it.",
      "contact": "Share of the groove circumference a stamped ring touches."
    },
    "outputs": [
      "Ring shear capacity",
      "Groove yield capacity",
      "Minimum groove distance from the end"
    ],
    "method": [
      "Ring shear: P_s = π D t S_s ÷ K.",
      "Groove yield onset: P_G = π D d S_y ÷ K (× contact fraction for stamped rings).",
      "Allowable thrust = the lower of the two; minimum groove distance from the end Y = K P ÷ (π D S_c).",
      "Example: a 25 mm shaft with a 0.5 mm groove in 250 MPa steel allows 3.2725 kN."
    ],
    "limitations": [
      "Static thrust with square groove corners and line-to-line contact; chamfers and corner radii on the retained part reduce capacity.",
      "Use the ring supplier’s ratings for final selection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Groove yield usually governs; a harder groove material or a deeper groove raises capacity."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1763–1789. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "iso-cleanliness-code": {
    "purpose": "ISO 4406 range numbers for particles of 4, 6 and 14 µm and larger per millilitre of oil, from counts per millilitre or per sample volume, with the three-part code and a check against a target code for each size.",
    "uses": [
      "Turn a particle count report into an ISO code",
      "Check oil against the target cleanliness for a machine",
      "Track filtration improvements over time"
    ],
    "users": [
      "Reliability engineers",
      "Lubrication technicians",
      "Maintenance engineers"
    ],
    "inputs": {
      "vol": "Volume of oil the counts refer to (1 mL if counts are already per millilitre).",
      "c4": "Count of particles 4 µm(c) and larger.",
      "c6": "Count of particles 6 µm(c) and larger.",
      "c14": "Count of particles 14 µm(c) and larger.",
      "t4": "Target range number at 4 µm (from the machine or component maker).",
      "t6": "Target at 6 µm.",
      "t14": "Target at 14 µm."
    },
    "outputs": [
      "ISO code (4/6/14 µm)",
      "Count per millilitre for each size",
      "Comparison with the target"
    ],
    "method": [
      "Counts are converted to particles per millilitre.",
      "Range numbers double with each step: number R covers more than 0.01 × 2^(R−1) up to 0.01 × 2^R particles per mL, so R = ⌈log₂(count per mL ÷ 0.01)⌉.",
      "The code is written R₄/R₆/R₁₄, for example 21/19/17.",
      "Example: 15000, 3000 and 1000 particles per mL give ISO 21/19/17."
    ],
    "limitations": [
      "Counts must come from a calibrated counter per ISO 11171 sizes µm(c).",
      "Range numbers above 28 or below 1 are reported at the limit as calculated.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each range number down halves the particle count; one step cleaner can noticeably extend component life."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2439–2441. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "filter-beta-ratio": {
    "purpose": "Filtration (beta) ratio of a filter element from upstream and downstream particle counts at a given size, the capture efficiency, and the downstream count expected from a known beta ratio and upstream contamination.",
    "uses": [
      "Compare filter elements by their tested beta ratio",
      "Estimate downstream cleanliness from a filter rating",
      "Check a filter’s performance from before-and-after counts"
    ],
    "users": [
      "Reliability engineers",
      "Lubrication technicians",
      "Maintenance engineers"
    ],
    "inputs": {
      "mode": "Calculate beta from counts, or the downstream count from a rated beta.",
      "up": "Particle count upstream of the filter at the stated size.",
      "down": "Particle count downstream at the same size.",
      "beta": "Rated beta ratio at the size of interest (from the filter maker’s ISO 16889 / ISO 4572 multipass test)."
    },
    "outputs": [
      "Beta ratio",
      "Capture efficiency",
      "Particles passing"
    ],
    "method": [
      "β_x = upstream count ÷ downstream count at particle size x.",
      "Efficiency = (1 − 1 ÷ β) × 100%.",
      "Downstream count = upstream ÷ β.",
      "Example: 5000 upstream and 25 downstream particles per mL is β = 200 (99.5% efficient)."
    ],
    "limitations": [
      "Beta ratios apply at one particle size and test condition; flow surges and cold starts reduce real efficiency.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "β 200 captures 99.5%; going from β 75 to β 200 cuts particles passing by more than half."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2441–2442. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "inverse-time-feed": {
    "purpose": "Inverse time feed command (G93 F-word) for a linear, rotary or combined multi-axis move: the reciprocal of the move time, from the feed rate and the length or angle of the move, with the time per block and the surface speed of a rotary move at a radius.",
    "uses": [
      "Program feed for 4th- and 5th-axis moves",
      "Convert a target surface feed to an inverse-time F value",
      "Check block times in a multi-axis program"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Kind of move.",
      "dist": "Straight-line distance of the linear axes in the block.",
      "angle": "Angle turned by the rotary axis in the block.",
      "radius": "Radius from the rotary axis to the cutting point.",
      "feed": "Feed you want along the cutting path."
    },
    "outputs": [
      "Inverse-time F value",
      "Time for the block",
      "Path length at the cutter"
    ],
    "method": [
      "Inverse time feed = feed rate ÷ distance moved = 1 ÷ time (in minutes) for the block.",
      "Rotary path at the cutter = π r × angle ÷ 180°; combined path ≈ √(linear² + arc²).",
      "Program G93 with F = 1 ÷ time on every block; return to G94 afterwards.",
      "Example: 90° at 40 mm radius at 300 mm/min needs F4.7746."
    ],
    "limitations": [
      "Combined path is approximated as straight in the developed plane; long blocks with large rotation should be split.",
      "Controls differ in G93 limits and decimal resolution.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Every G93 block needs its own F word; a missing F is an alarm on most controls."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1288–1289. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "screw-machine-stock": {
    "purpose": "Parts per bar and bar stock required for automatic screw machine or bar-fed lathe work, from the part length, cut-off tool width, facing allowance, bar length and the remnant lost to chucking, with the handbook’s feet-per-1000-parts estimate for 10-foot bars.",
    "uses": [
      "Order bar stock for a screw machine job",
      "Quote material cost per part",
      "Compare bar lengths and remnant allowances"
    ],
    "users": [
      "Screw machine setters",
      "Estimators",
      "Production planners"
    ],
    "inputs": {
      "L": "Overall length of the finished part.",
      "W": "Width of the cut-off blade (wider for larger bar).",
      "face": "Extra length per part removed by facing.",
      "bar": "Length of the bars supplied.",
      "rem": "Bar end left in the collet or bar feeder.",
      "qty": "Number of good parts needed (add your scrap allowance).",
      "kgm": "Mass per metre of the bar (from a stock-mass calculation)."
    },
    "outputs": [
      "Parts per bar",
      "Bars to order",
      "Stock length and mass"
    ],
    "method": [
      "Length per part = part length + cut-off width + facing allowance.",
      "Parts per bar = ⌊(bar length − remnant) ÷ length per part⌋; bars = ⌈quantity ÷ parts per bar⌉.",
      "Handbook estimate for 10-ft bars: feet per 1000 parts = (L + W) × 84, with L and W in inches.",
      "Example: 25.4 mm parts with a 1.57 mm cut-off give 109 parts per bar and need 10 bars."
    ],
    "limitations": [
      "Start-up and setup parts are not included.",
      "The handbook estimate assumes 10-foot bars and its standard chucking allowance.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Shorter remnants (bar pullers, remnant-less feeders) can save a bar in every few on short parts."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1175–1176. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shearing-blade-force": {
    "purpose": "Shearing force for straight parallel blades from the shear strength and cut area, and for straight inclined (raked) blades from tensile strength, thickness, blade angle and the relative penetration, with the handbook’s 30% machine allowance and a capacity check.",
    "uses": [
      "Check whether a guillotine can cut a plate",
      "Choose a rake angle to cut the force",
      "Estimate shear force for a cut-off die"
    ],
    "users": [
      "Fabrication supervisors",
      "Toolmakers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "blades": "Parallel blades shear the whole length at once; inclined blades cut progressively.",
      "T": "Thickness of the material.",
      "b": "Length of the cut with parallel blades.",
      "tau": "Shear strength of the material.",
      "UTS": "Ultimate tensile strength of the material.",
      "alpha": "Angle of the upper blade to the lower.",
      "n": "Factor n, about 0.75–0.85 for most materials (handbook).",
      "k": "Shear-to-tensile strength ratio, about 0.7–0.8 (handbook).",
      "eps": "Relative penetration of the blade at fracture (falls with thickness and hardness; from shear data).",
      "cap": "Rated capacity of the shear or press."
    },
    "outputs": [
      "Shearing force",
      "Machine force with allowance",
      "Capacity check"
    ],
    "method": [
      "Parallel blades: F = τ b T.",
      "Inclined blades: F = n k UTS ε T² ÷ tan α.",
      "Machine force = 1.3 F, allowing for blade clearance, thickness variation and edge wear.",
      "Example: 3 mm sheet at 2° rake needs about 48.246 kN at the machine."
    ],
    "limitations": [
      "Approximate formulas; blade clearance and sharpness change the force considerably.",
      "Inclined blades need a longer stroke and may twist narrow strips.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A small rake angle greatly reduces force on long cuts; plate shears exploit this."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1336–1338. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "agma-pitting-power": {
    "purpose": "Allowable transmitted power for pitting resistance by the AGMA power rating formula (metric form), with the external or internal spur gear geometry factor I calculated from the pressure angle and ratio, the dynamic, size, load-distribution, surface and application factors, and the allowable contact stress with its life and hardness factors.",
    "uses": [
      "Rate a spur gear pair for power",
      "Check a gear set against a motor power",
      "Compare face width or material options for durability"
    ],
    "users": [
      "Gear designers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "np": "Speed of the pinion.",
      "F": "Net face width in contact.",
      "d": "Operating pitch diameter of the pinion.",
      "mg": "Gear ratio (always 1 or more).",
      "kind": "External or internal mesh, for the geometry factor.",
      "phi": "Operating transverse pressure angle.",
      "Imode": "Calculate I for standard spur gears (load sharing ratio 1), or enter it from AGMA 908.",
      "I": "Geometry factor for pitting resistance.",
      "Cv": "Dynamic factor in the older AGMA form (1 or less).",
      "Cs": "Size factor.",
      "Cm": "Load distribution factor.",
      "Cf": "Surface condition factor.",
      "Ca": "Application (overload) factor.",
      "Sac": "Allowable contact stress number for the material and heat treatment (use the lower of pinion and gear).",
      "CL": "Life factor for the number of cycles.",
      "CH": "Hardness ratio factor (gear only).",
      "Cp": "Elastic coefficient (191 √MPa for steel on steel).",
      "CT": "Temperature factor.",
      "CR": "Reliability factor.",
      "P": "Power you need to transmit."
    },
    "outputs": [
      "Geometry factor I",
      "Allowable power for pitting",
      "Service factor against the required power"
    ],
    "method": [
      "Geometry factor (spur, m_N = 1): I = cos φ sin φ ÷ 2 × m_G ÷ (m_G ± 1), + for external, − for internal gears.",
      "P_ac = n_p F ÷ 1.91 × 10⁷ × I C_v ÷ (C_s C_m C_f C_a) × [d S_ac C_L C_H ÷ (C_p C_T C_R)]² kW, with F and d in mm and S_ac in MPa (handbook formula 5a).",
      "Example: a 60 mm pinion, 30 mm face at 1500 rpm rates 13.795 kW for pitting."
    ],
    "limitations": [
      "Spur gears without helix; helical gears need the load sharing ratio in I.",
      "Rate both pinion and gear with their own S_ac C_L C_H and use the lower.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pitting capacity rises with the square of pinion diameter and allowable stress, but only linearly with face width."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3304–3313. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grinding-cycle-time": {
    "purpose": "Grinding time for reciprocating surface grinding (strokes per pass from crossfeed, passes from stock and downfeed), cylindrical traverse grinding (traverse rate from wheel width, traverse per revolution and work speed) and cylindrical plunge grinding (infeed rate), with spark-out passes or dwell.",
    "uses": [
      "Quote grinding time for a part",
      "Compare traverse and plunge grinding",
      "Balance a grinding operation in a cell"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "type": "Choose the grinding operation.",
      "stock": "Material to remove; for cylindrical work enter the reduction in diameter.",
      "feed": "Wheel feed per pass; for cylindrical work on the diameter.",
      "spark": "Extra passes without feed to finish size and finish.",
      "L": "Length of the ground surface.",
      "B": "Width of the ground surface.",
      "over": "Table overrun beyond each end.",
      "vt": "Table speed.",
      "cf": "Crossfeed at each stroke (usually a fraction of wheel width).",
      "Lw": "Length of the ground diameter.",
      "bw": "Width of the grinding wheel.",
      "frac": "Axial traverse per work revolution as a share of wheel width.",
      "nw": "Rotational speed of the work.",
      "vf": "Plunge infeed rate on the diameter.",
      "dwell": "Time at final size in plunge grinding."
    },
    "outputs": [
      "Passes or strokes",
      "Grinding time",
      "Feed rates used"
    ],
    "method": [
      "Surface: strokes per pass = ⌈B ÷ crossfeed⌉; stroke time = (L + 2 × overtravel) ÷ table speed; passes = ⌈stock ÷ downfeed⌉ + spark-out.",
      "Traverse: traverse rate = share × wheel width × work rpm; pass time = (ground length + wheel width) ÷ traverse rate; passes = ⌈stock ÷ infeed⌉ + spark-out.",
      "Plunge: time = stock ÷ infeed rate + dwell.",
      "Example: the default surface grinding job takes 5.6 min."
    ],
    "limitations": [
      "Approach, dressing and gauging time are not included.",
      "Feeds and speeds come from your wheel supplier and process data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fewer, deeper roughing passes followed by light finishing passes usually shorten the cycle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1246–1265. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pattern-shrinkage": {
    "purpose": "Pattern dimension for a casting from the finished dimension, machining allowance and the metal’s shrinkage allowance (as a percentage or millimetres per metre), and the approximate casting weight from the pattern weight and the densities of the metal and the pattern material.",
    "uses": [
      "Size a pattern or die cavity for a casting",
      "Check a pattern maker’s shrink rule",
      "Estimate casting weight for a quote from the pattern"
    ],
    "users": [
      "Pattern makers",
      "Foundry engineers",
      "Estimators"
    ],
    "inputs": {
      "Lp": "Dimension on the finished part.",
      "mach": "Stock left on each machined face.",
      "faces": "How many faces across this dimension are machined (0, 1 or 2).",
      "shrink": "Shrinkage allowance for the metal and casting (from your foundry or the handbook’s list).",
      "Wp": "Weight of the pattern.",
      "rhoP": "Density of the pattern material (wood about 400–700 kg/m³).",
      "rhoM": "Density of the casting metal.",
      "cores": "Volume removed by cores that the pattern does not show."
    },
    "outputs": [
      "Casting dimension before machining",
      "Pattern dimension",
      "Approximate casting weight"
    ],
    "method": [
      "Casting size = finished size + machining allowance × machined faces.",
      "Pattern size = casting size × (1 + shrinkage ÷ 1000) with shrinkage in mm per metre.",
      "Casting weight ≈ pattern weight × metal density ÷ pattern density, less the weight of cored spaces (the handbook gives this as ratio factors per pattern material).",
      "Example: a 300 mm dimension needs a 309.18 mm pattern at 10.4 mm/m."
    ],
    "limitations": [
      "Shrinkage varies with section size, restraint and alloy; confirm with the foundry.",
      "Pattern weight method assumes a solid pattern of uniform density without core prints.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Hindered contraction (cores, flanges) shrinks less than free contraction; foundries adjust allowances by feature."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1414, 1419. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
