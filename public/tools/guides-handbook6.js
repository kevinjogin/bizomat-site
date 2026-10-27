// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook6).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bolt-torque-preload": {
    "purpose": "Relation between tightening torque and bolt preload for metric bolts using the nut factor (T = K F d), with stress in the tensile stress area and the share of proof load.",
    "uses": [
      "Set a tightening torque for a joint",
      "Check what preload a specified torque produces",
      "Compare lubricated and dry assembly"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Quality inspectors"
    ],
    "inputs": {
      "mode": "Choose torque from a preload target, or preload from a torque.",
      "d": "Nominal (major) diameter of the bolt.",
      "P": "Thread pitch (coarse M12 is 1.75 mm).",
      "K": "Nut factor for the actual surface finish and lubricant, from the fastener supplier or a torque–tension test (about 0.2 for plain dry steel, lower when lubricated).",
      "Sp": "Proof stress for the property class from the bolt standard (e.g. ISO 898-1) or the supplier.",
      "pct": "Target preload as a percentage of proof load from your joint design (often 65–75%).",
      "T": "Specified tightening torque (preload mode)."
    },
    "outputs": [
      "Tensile stress area",
      "Preload and bolt stress",
      "Share of proof load",
      "Tightening torque"
    ],
    "method": [
      "Tensile stress area As = π/4 (d − 0.938194P)².",
      "Proof load = Sp × As; target preload F = % × proof load.",
      "Torque T = K F d (d in metres gives N·m); preload from torque F = T ÷ (K d).",
      "Example: M12 × 1.75 at 75% of a 600 MPa proof stress needs 37.92 kN, about 91.008 N·m with K = 0.2."
    ],
    "limitations": [
      "The nut factor scatters widely (often ±25%); preload from torque is approximate. Use tension control, turn-of-nut or direct tension indicators for critical joints.",
      "Coarse and fine metric threads only; prevailing-torque nuts add torque that does not produce preload.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Specify torque with the lubricant condition; changing lubrication changes the preload at the same torque."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-engagement": {
    "purpose": "Minimum length of engagement for a metric or unified thread so that the external thread does not strip before the screw breaks, with the extra length needed when the tapped material is weaker.",
    "uses": [
      "Set tapped hole depth in aluminium, cast iron or soft steel",
      "Check a short nut or thin plate thread",
      "Decide whether a thread insert is needed"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Quality inspectors"
    ],
    "inputs": {
      "d": "Nominal size of the thread.",
      "P": "Thread pitch (for unified threads, 25.4 ÷ threads per inch).",
      "Knmax": "From the thread limits table for your thread class (e.g. 6H); 0 uses the basic minor diameter, which is slightly optimistic.",
      "Esmin": "From the thread limits table for the bolt class (e.g. 6g); 0 uses the basic pitch diameter.",
      "Dsmin": "Minimum major diameter of the bolt thread from the limits table; 0 uses the basic size.",
      "Enmax": "Maximum pitch diameter of the tapped thread from the limits table; 0 uses the basic pitch diameter.",
      "Sub": "Minimum tensile strength of the screw (e.g. 800 MPa for property class 8.8).",
      "Sun": "Minimum tensile strength of the nut or tapped component material."
    },
    "outputs": [
      "Tensile stress area",
      "Engagement to protect the external thread",
      "Strength ratio J and engagement for the internal thread",
      "Required engagement in diameters"
    ],
    "method": [
      "At = π/4 (d − 0.938194P)² (or π(Es min/2 − 0.16238P)² above 1240 MPa).",
      "External thread: Le = 2At ÷ [π Kn max (½ + 0.57735 n (Es min − Kn max))], with n = 1/P.",
      "Internal thread shear area per unit length: π n Ds min [½ + 0.57735 n (Ds min − En max)]; J = (As external × Su screw) ÷ (As internal × Su tapped); required length = J × Le when J > 1.",
      "Example: M10 × 1.5 (8.8) into 310 MPa material needs about 10.888 mm (1.0888 × d) of engagement."
    ],
    "limitations": [
      "Basic dimensions (inputs left at 0) overstate the shear areas slightly; use the limits for your thread class for a design check.",
      "Assumes full-form threads over the whole engaged length; countersinks, chamfers and incomplete threads at the hole bottom do not count.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the required length is impractical, use a thread insert, through bolt and nut, or a stronger tapped material."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1536–1537. Topic reference; no source tables or recommended settings are reproduced.",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1528. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolted-joint": {
    "purpose": "Bolt and member stiffness, joint constant, bolt load, remaining clamp force and separation load of a preloaded tension joint, with an optional frustum estimate of member stiffness.",
    "uses": [
      "Check flange, cap and bracket bolts under external tension",
      "Find the preload needed to prevent separation",
      "Compare short and long grip bolts"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Quality inspectors"
    ],
    "inputs": {
      "d": "Nominal bolt diameter.",
      "P": "Thread pitch.",
      "grip": "Total thickness of the parts clamped between the bolt head and nut faces.",
      "Lt": "Length of thread inside the grip (the rest is plain shank).",
      "Eb": "Bolt modulus.",
      "kmMode": "Estimate for plain steel-on-steel plates with washer-face bearing, or enter a value from FEA or tests.",
      "Em": "Modulus of the clamped material (for the estimate).",
      "km": "Member stiffness from analysis or tests, used when \"Enter a value\" is chosen.",
      "Fi": "Installed preload (see the torque and preload tool).",
      "Pext": "External load trying to separate the joint, per bolt.",
      "Sp": "Proof strength of the bolt property class."
    },
    "outputs": [
      "Bolt and member stiffness",
      "Joint constant C",
      "Bolt load and stress",
      "Remaining clamp force",
      "Separation load and load factor"
    ],
    "method": [
      "kb = 1 ÷ (Ls ÷ (E Ad) + Lt ÷ (E At)); Ad = πd²/4, At = π/4 (d − 0.938194P)².",
      "Estimate: km = 0.5774 π E d ÷ (2 ln(5(0.5774 l + 0.5d) ÷ (0.5774 l + 2.5d))).",
      "C = kb ÷ (kb + km); bolt load Fb = Fi + C P; clamp Fm = Fi − (1 − C) P.",
      "Separation load P₀ = Fi ÷ (1 − C).",
      "Example: 35 kN preload with 10 kN external load gives C = 0.19434, a bolt load of 36.943 kN and 26.943 kN left clamping."
    ],
    "limitations": [
      "Concentric tension joint; prying, bending and thermal loads are not modelled.",
      "The frustum estimate suits plates of one material with washer-face bearing; gaskets and different materials need a measured or calculated stiffness.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep a clear margin against separation; a separated joint transfers the full alternating load to the bolt and loosens."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535. Topic reference; no source tables or recommended settings are reproduced.",
      "VDI 2230 Part 1: Systematic calculation of highly stressed bolted joints"
    ]
  },
  "bolt-shear-bearing": {
    "purpose": "Shear stress in bolts, dowels or clevis pins in single or double shear and the bearing stress on the plate, compared with allowable values.",
    "uses": [
      "Check clevis pins, hinge pins and dowels",
      "Check bolted lap and splice joints in shear",
      "Choose pin size and plate thickness"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Quality inspectors"
    ],
    "inputs": {
      "F": "Total shear load on the group (equal sharing assumed).",
      "n": "Number of fasteners sharing the load.",
      "planes": "Single shear for a lap joint; double shear for a clevis or pin between two plates.",
      "d": "Diameter where the shear plane cuts: the shank diameter, or the thread minor diameter if threads are in the shear plane.",
      "t": "Thickness of the thinnest plate (or the sum of the two outer plates in double shear, whichever is smaller).",
      "tauAllow": "Allowable shear stress of the fastener material from your design code.",
      "bAllow": "Allowable bearing stress on the plate from your design code."
    },
    "outputs": [
      "Shear stress and its ratio to allowable",
      "Bearing stress and its ratio to allowable",
      "Governing mode"
    ],
    "method": [
      "Shear τ = F ÷ (n × planes × πd²/4).",
      "Bearing σ_b = F ÷ (n d t).",
      "Utilisation = stress ÷ allowable; the larger governs.",
      "Example: 20000 N on 2 × 10 mm bolts in single shear gives τ = 127.32 MPa and bearing 125 MPa."
    ],
    "limitations": [
      "Equal load sharing; eccentric groups and slip-critical (friction) joints need other methods.",
      "Edge distance, net-section tension and block shear of the plates are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep threads out of the shear plane, or use the minor diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "riveted-joint": {
    "purpose": "Strength of a riveted lap or butt joint per pitch by plate tearing, rivet shearing and crushing, and the joint efficiency compared with the solid plate.",
    "uses": [
      "Choose rivet pitch and diameter for sheet and plate joints",
      "Compare single and double riveting",
      "Repair or assess existing riveted structures"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Quality inspectors"
    ],
    "inputs": {
      "p": "Centre distance between rivets in one row.",
      "d": "Diameter of the drilled or punched hole (the driven rivet fills it).",
      "t": "Thickness of the thinner plate.",
      "rows": "Number of rivets in each pitch length (one per row).",
      "shear": "Single shear for lap joints; double shear for butt joints with two cover straps.",
      "st": "Allowable tensile stress of the plate material.",
      "tau": "Allowable shear stress of the rivet material.",
      "sc": "Allowable crushing (bearing) stress."
    },
    "outputs": [
      "Strength per pitch by tearing, shearing and crushing",
      "Solid plate strength per pitch",
      "Joint efficiency and failure mode"
    ],
    "method": [
      "Tearing between holes: (p − d) t σt.",
      "Shearing: rows × planes × πd²/4 × τ; crushing: rows × d t σc.",
      "Efficiency = weakest ÷ (p t σt).",
      "Example: 16 mm rivets at 50 mm pitch in 10 mm plate give an efficiency of 26.808%, limited by rivet shearing."
    ],
    "limitations": [
      "Classical strength-of-materials method; modern structural rivet design follows the applicable code.",
      "Edge distance, plate buckling and fatigue are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raise efficiency by balancing tearing against shearing: adjust pitch, diameter or add a row."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tap-drill": {
    "purpose": "Theoretical tap drill or hole size for a chosen percentage of thread, for cutting taps and cold-forming (roll) taps, in metric or unified threads.",
    "uses": [
      "Pick a tap drill for tough materials or deep holes",
      "Find the hole size for a forming tap",
      "Check an existing drill against thread engagement"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "system": "Metric threads in millimetres, or unified threads in inches.",
      "D": "Nominal size: millimetres for metric, inches for unified.",
      "pitch": "Metric thread pitch (ignored for unified).",
      "tpi": "Threads per inch (ignored for metric).",
      "pct": "About 75% is usual for cutting taps (60–65% in tough materials or deep holes); 65% is usual for forming taps.",
      "tap": "Cutting taps remove metal; forming taps displace it and need a larger hole."
    },
    "outputs": [
      "Theoretical drill or hole size",
      "Drill size in both units",
      "Basic minor diameter for comparison"
    ],
    "method": [
      "Cutting tap: drill = D − 0.01299 × % × P (or D − 0.01299 × % ÷ n in inches).",
      "Forming tap: hole = D − 0.0068 × % × P (or ÷ n in inches).",
      "Basic minor diameter of the internal thread = D − 1.082532P.",
      "Example: M10 × 1.5 at 75% with a cutting tap needs a 8.5386 mm drill."
    ],
    "limitations": [
      "Theoretical sizes; drills cut oversize, so check the actual hole and choose the nearest available drill.",
      "The resulting minor diameter must stay within the thread class limits.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose the nearest standard drill and check the minor diameter against the thread limits table."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2029–2036. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "metric-thread": {
    "purpose": "Basic dimensions of an ISO metric (M) thread from nominal diameter and pitch: pitch and minor diameters, thread height, tensile stress area, lead angle and proof load.",
    "uses": [
      "Check thread dimensions for design or inspection",
      "Find the stress area for bolt calculations",
      "Set CNC thread-milling and turning depths"
    ],
    "users": [
      "Design engineers",
      "CNC programmers",
      "Quality inspectors"
    ],
    "inputs": {
      "d": "Nominal (basic major) diameter.",
      "P": "Pitch from the thread designation (coarse M12 is 1.75 mm).",
      "starts": "Number of starts; 1 for normal fastener threads.",
      "Sp": "Proof stress for the bolt property class (ISO 898-1), to give a proof load; 0 to skip."
    },
    "outputs": [
      "Basic pitch diameter",
      "Basic minor diameters (internal and external root)",
      "Fundamental triangle and thread heights",
      "Tensile stress area and proof load",
      "Lead and lead angle"
    ],
    "method": [
      "H = 0.866025P; d₂ = d − 0.649519P; D₁ = d − 1.082532P; d₃ = d − 1.226869P.",
      "Tensile stress area As = π/4 ((d₂ + d₃)/2)² = π/4 (d − 0.938194P)².",
      "Lead = starts × P; lead angle = atan(lead ÷ π d₂).",
      "Example: M12 × 1.75 has d₂ = 10.863 mm, D₁ = 10.106 mm and As = 84.267 mm²."
    ],
    "limitations": [
      "Basic profile only; tolerance class limits (e.g. 6g/6H) come from ISO 965 tables.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the stress area for bolt stress and the minor diameter for shear through the thread."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1867–1890. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 68-1 (basic profile) and ISO 724 (basic dimensions) — https://www.iso.org/standard/4166.html"
    ]
  },
  "unified-thread": {
    "purpose": "Basic dimensions of a Unified (UN/UNR) inch thread from its major diameter and threads per inch, in inches and millimetres.",
    "uses": [
      "Check inch thread dimensions for design or inspection",
      "Find the stress area for an inch bolt",
      "Convert inch thread data to metric"
    ],
    "users": [
      "Design engineers",
      "Machinists",
      "Quality inspectors"
    ],
    "inputs": {
      "D": "Nominal size in inches (e.g. 0.5 for ½-13 UNC).",
      "n": "Threads per inch from the designation."
    },
    "outputs": [
      "Pitch",
      "Basic pitch diameter",
      "Basic minor diameter (internal)",
      "Tensile stress area"
    ],
    "method": [
      "Pitch = 1 ÷ n; H = 0.866025 ÷ n.",
      "Basic pitch diameter E = D − 0.649519 ÷ n; basic minor (internal) = D − 1.082532 ÷ n.",
      "Tensile stress area At = 0.7854 (D − 0.9743 ÷ n)².",
      "Example: 0.5-13 UNC has E = 0.45004 in and At = 0.1419 in²."
    ],
    "limitations": [
      "Basic profile only; class 2A/2B and 3A/3B limits come from ASME B1.1 tables.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the stress area for bolt stress calculations."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1806–1866. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "three-wire": {
    "purpose": "Measurement over wires for 60°, 55° and 29° threads from the pitch diameter and wire size, the best wire size, and the pitch diameter from a measured reading.",
    "uses": [
      "Inspect external threads to their pitch diameter",
      "Choose wires for a thread",
      "Convert a wire reading to pitch diameter"
    ],
    "users": [
      "Quality inspectors",
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "angle": "Included thread angle.",
      "P": "Thread pitch in the same unit as the diameters.",
      "E": "Target pitch diameter from the thread limits (e.g. mid-tolerance).",
      "W": "Measured diameter of the wires you will use; 0 calculates with the best wire size.",
      "Mmeas": "Reading over the wires, to convert into a pitch diameter; 0 if not measured."
    },
    "outputs": [
      "Best wire size",
      "Expected measurement over wires",
      "Pitch diameter from the measured reading"
    ],
    "method": [
      "Best wire W = (P ÷ 2) sec(α ÷ 2) (0.57735P for 60°).",
      "M = E − (P ÷ 2) cot(α ÷ 2) + W(1 + csc(α ÷ 2)); for 60° this is E − 0.866025P + 3W.",
      "From a reading: E = M + (P ÷ 2) cot(α ÷ 2) − W(1 + csc(α ÷ 2)).",
      "Example: pitch diameter 10.863 with 1.75 pitch and best wires (1.0104) reads 12.379 over the wires."
    ],
    "limitations": [
      "Lead-angle effect is ignored; it is small for single-start fastener threads but matters for multi-start and Acme threads.",
      "Measuring force and wire accuracy affect the reading; use calibrated wires.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare the pitch diameter from the reading with the thread class limits."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1990–2003. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "screw-efficiency": {
    "purpose": "Lead, helix (lead) angle, efficiency raising a load and self-locking check for a power or fastening screw with a given flank angle and friction coefficient.",
    "uses": [
      "Check whether a jack or lead screw will back-drive",
      "Compare single and multi-start screws",
      "Find the helix angle for tool clearance"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "d2": "Pitch (mean) diameter of the thread.",
      "P": "Pitch: axial distance between adjacent threads.",
      "starts": "Number of starts; lead = starts × pitch.",
      "flank": "Thread profile; the half-angle is used for the friction wedge effect.",
      "mu": "Thread friction coefficient for the materials and lubrication (about 0.1–0.2 for lubricated steel on bronze)."
    },
    "outputs": [
      "Lead and helix angle",
      "Efficiency raising a load",
      "Self-locking or back-driving"
    ],
    "method": [
      "Lead L = starts × P; tan λ = L ÷ π d₂.",
      "Normal flank angle αₙ = atan(tan α cos λ).",
      "Efficiency η = tan λ (cos αₙ − μ tan λ) ÷ (cos αₙ tan λ + μ).",
      "Self-locking when μ ≥ cos αₙ tan λ.",
      "Example: 20 mm pitch diameter with 4 mm pitch has a 3.6426° helix angle and 28.838% efficiency."
    ],
    "limitations": [
      "Collar or thrust-bearing friction is not included and lowers overall efficiency.",
      "Vibration can back-drive a nominally self-locking screw.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the screw must hold a load safely, use a brake; do not rely on self-locking under vibration."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1921–1928, 2061–2062. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "simple-indexing": {
    "purpose": "Crank movement for simple indexing (whole turns plus holes in a circle) for a 40:1 or other worm ratio, using Brown & Sharpe or Cincinnati standard plate hole circles.",
    "uses": [
      "Index gear teeth, splines and bolt holes on a dividing head",
      "Check whether simple indexing can produce a number",
      "Choose the index plate and sector arm setting"
    ],
    "users": [
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "divisions": "Number of equal divisions required (e.g. gear teeth).",
      "ratio": "Turns of the crank for one turn of the spindle; 40 on most dividing heads.",
      "plates": "The index plates fitted to your head."
    },
    "outputs": [
      "Crank turns per division",
      "Hole circles that give exact indexing",
      "Holes to move in each circle"
    ],
    "method": [
      "Crank turns per division = ratio ÷ divisions = whole turns + remainder ÷ divisions.",
      "A circle with h holes works when remainder × h ÷ divisions is a whole number of holes.",
      "Brown & Sharpe circles: 15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49. Cincinnati: 24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66.",
      "Example: 27 divisions on a 40:1 head need 1 turns and 13 holes in the 27-hole circle."
    ],
    "limitations": [
      "Simple indexing only; numbers it cannot produce need differential, compound or angular indexing.",
      "Hole counts assume standard plates; check the plates on your head.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Set the sector arms to span the holes to move plus the one the pin is in."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2107–2121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "change-gears": {
    "purpose": "Best simple and compound change-gear trains from a standard gear set to cut a required metric or inch lead with a given leadscrew, with the resulting lead error.",
    "uses": [
      "Set up a manual lathe for a non-standard pitch",
      "Cut metric threads with an inch leadscrew (or the reverse)",
      "Check the error of an approximate gear train"
    ],
    "users": [
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "cutUnit": "Whether the thread is metric (pitch) or inch (TPI).",
      "cut": "Pitch in millimetres or threads per inch of the thread to cut.",
      "screwUnit": "Leadscrew specification.",
      "screw": "Leadscrew pitch or threads per inch, from the lathe plate or manual.",
      "fixed": "Any fixed reduction between the spindle and the first change-gear stud (1 if none).",
      "set": "The change gears available; check your actual set (one of each size assumed)."
    },
    "outputs": [
      "Required gear ratio",
      "Best two-gear train and its error",
      "Best four-gear compound train and its error"
    ],
    "method": [
      "Required ratio (driver ÷ driven product) = lead to cut ÷ (leadscrew lead × fixed ratio), all leads in mm.",
      "Simple train A ÷ B; compound train (A ÷ B) × (C ÷ D), each gear used once.",
      "Error = (train ratio ÷ required − 1) × 100%; 25.4 mm = 127 ÷ 5 × 1 mm makes 127-tooth gears exact for metric–inch conversions.",
      "Example: 1.5 mm pitch on an 8 TPI leadscrew: drivers 20 and 75, driven 25 and 127 (error 0%)."
    ],
    "limitations": [
      "Gear meshing and clearance on the banjo are not checked; some compound trains may not fit your lathe.",
      "One of each gear size is assumed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For an approximate train, multiply the error by the thread length to see the accumulated lead error."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2043–2049. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "helical-gear": {
    "purpose": "Transverse module, pitch and tip diameters, centre distance, transverse pressure angle, virtual teeth, axial pitch and overlap ratio for a standard (unshifted) parallel-axis helical gear pair.",
    "uses": [
      "Lay out a helical gear pair",
      "Check centre distance for a replacement pair",
      "Find axial thrust direction and overlap"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "mn": "Normal module (the hob or cutter module).",
      "beta": "Helix angle at the pitch diameter (0 for spur gears).",
      "alphan": "Normal pressure angle (20° is standard).",
      "z1": "Number of teeth on the pinion.",
      "z2": "Number of teeth on the gear.",
      "b": "Face width in mesh."
    },
    "outputs": [
      "Transverse module and pressure angle",
      "Pitch, tip and base diameters",
      "Centre distance and ratio",
      "Virtual number of teeth",
      "Axial pitch and overlap ratio"
    ],
    "method": [
      "mt = mn ÷ cos β; d = z mt; tip diameter = d + 2mn (standard addendum); a = (d₁ + d₂) ÷ 2.",
      "αt = atan(tan αn ÷ cos β); base diameter = d cos αt.",
      "Virtual teeth zv = z ÷ cos³β; axial pitch = π mn ÷ sin β; overlap ratio εβ = b sin β ÷ π mn.",
      "Example: mn 3, 15°, 20/45 teeth give a centre distance of 100.94 mm and an overlap ratio of 0.82385."
    ],
    "limitations": [
      "Standard, unshifted gears; profile shift changes the centre distance and tip diameters.",
      "Strength and contact ratio in the transverse plane need a gear rating method (ISO 6336 or AGMA 2001).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An overlap ratio of 1 or more gives smooth, quiet running."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2195–2210. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-forces": {
    "purpose": "Tangential, radial (separating) and axial (thrust) tooth forces of a spur or helical gear from power, speed and pitch diameter, for shaft and bearing loads.",
    "uses": [
      "Find bearing loads from a gear mesh",
      "Size shafts carrying gears",
      "Check the thrust a helical gear puts on its bearings"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "kW": "Power through the mesh (motor power × any upstream efficiency).",
      "rpm": "Speed of the gear whose pitch diameter is entered.",
      "d": "Pitch diameter of the same gear.",
      "alphan": "Normal pressure angle.",
      "beta": "Helix angle; 0 for spur gears."
    },
    "outputs": [
      "Torque",
      "Tangential, radial and axial force",
      "Total tooth force",
      "Pitch-line velocity"
    ],
    "method": [
      "T = 9549 × P ÷ n (N·m); Ft = 2T ÷ d.",
      "Radial Fr = Ft tan αn ÷ cos β; axial Fa = Ft tan β.",
      "Total F = √(Ft² + Fr² + Fa²); pitch-line velocity = π d n ÷ 60 000.",
      "Example: 15 kW at 1450 rpm on an 80 mm gear gives Ft = 2,469.6 N and Fr = 898.88 N."
    ],
    "limitations": [
      "Friction and dynamic loads are not included; apply application and dynamic factors from your rating method.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the forces with the gear position on the shaft to find bearing reactions."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160, 2195–2200. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lewis-bending": {
    "purpose": "Lewis tooth bending stress with the Barth velocity factor for the manufacturing method, compared with an allowable stress, as a first check before a full gear rating.",
    "uses": [
      "Quickly size the module and face width",
      "Screen a gear for tooth breakage",
      "Compare materials and widths"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "Ft": "Tangential force at the pitch circle (see the gear tooth forces tool).",
      "m": "Module.",
      "b": "Face width in contact.",
      "Y": "Lewis form factor for the tooth count and pressure angle, from a form factor table (based on module, not diametral pitch).",
      "d": "Pitch diameter, for pitch-line velocity.",
      "rpm": "Gear speed.",
      "make": "How the teeth are produced; this sets the Barth velocity factor.",
      "allow": "Allowable bending stress for the gear material and heat treatment from your design data."
    },
    "outputs": [
      "Pitch-line velocity and velocity factor",
      "Lewis bending stress",
      "Ratio to allowable"
    ],
    "method": [
      "V = π d n ÷ 60 000 (m/s).",
      "Velocity factor Kv: cast (3.05 + V)/3.05; cut (6.1 + V)/6.1; hobbed (3.56 + √V)/3.56; ground √((5.56 + √V)/5.56).",
      "σ = Kv Ft ÷ (b m Y).",
      "Example: 3000 N on a module 3, 35 mm wide tooth with Y = 0.32 gives σ = 142.81 MPa."
    ],
    "limitations": [
      "The Lewis equation ignores stress concentration, load sharing and many rating factors; use ISO 6336 or AGMA 2001 for design.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Treat the result as a screening value; a full rating will usually give a higher stress."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "worm-gear": {
    "purpose": "Ratio, lead and lead angle, wheel diameter, centre distance, forward efficiency and back-driving efficiency of a worm and wheel from module, starts, teeth and friction.",
    "uses": [
      "Select a worm reduction",
      "Check whether a worm drive will hold a load",
      "Estimate gearbox efficiency and heat"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "mx": "Axial module of the worm, equal to the transverse module of the wheel.",
      "z1": "Number of threads (starts) on the worm.",
      "z2": "Number of teeth on the wheel.",
      "d1": "Pitch diameter of the worm.",
      "alphan": "Normal pressure angle (often 20°).",
      "mu": "Friction coefficient at the running sliding speed and lubrication, from the gear maker (about 0.02–0.08 for bronze wheels in oil)."
    },
    "outputs": [
      "Ratio",
      "Lead and lead angle",
      "Wheel pitch diameter and centre distance",
      "Efficiency worm driving",
      "Efficiency wheel driving and self-locking"
    ],
    "method": [
      "Ratio = z₂ ÷ z₁; lead = π mx z₁; lead angle γ = atan(lead ÷ π d₁).",
      "Wheel diameter d₂ = mx z₂; centre distance a = (d₁ + d₂) ÷ 2.",
      "Worm driving η = (cos αn − μ tan γ) ÷ (cos αn + μ cot γ).",
      "Wheel driving η′ = (cos αn − μ cot γ) ÷ (cos αn + μ tan γ); η′ ≤ 0 means self-locking.",
      "Example: a 1-start worm with 40 teeth gives 40:1, a 5.7106° lead angle and 64.923% efficiency."
    ],
    "limitations": [
      "Bearing and churning losses are not included.",
      "Static self-locking is not reliable under vibration; use a brake where safety matters.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Low efficiency means heat: check the gearbox thermal rating at continuous duty."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2191–2194. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bevel-gear": {
    "purpose": "Pitch cone angles, pitch and outside diameters, outer cone distance and face-width ratio of a straight bevel gear pair at any shaft angle.",
    "uses": [
      "Lay out a right-angle or angled bevel drive",
      "Check replacement bevel gears",
      "Find the mounting distances"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Transverse module at the outer (heel) end of the teeth.",
      "z1": "Pinion tooth count.",
      "z2": "Gear tooth count.",
      "shaft": "Angle between the shafts (90° for most drives).",
      "b": "Face width along the cone."
    },
    "outputs": [
      "Pitch cone angles",
      "Pitch and outside diameters",
      "Outer cone distance",
      "Face width as a share of cone distance"
    ],
    "method": [
      "tan δ₁ = sin Σ ÷ (z₂/z₁ + cos Σ); δ₂ = Σ − δ₁.",
      "d = m z; outer cone distance Re = d₂ ÷ (2 sin δ₂).",
      "Outside diameter (standard addendum = m) da = d + 2m cos δ.",
      "Example: 18/36 teeth at 90° give pitch angles of 26.565° and 63.435°, Re = 80.498 mm."
    ],
    "limitations": [
      "Standard straight bevel proportions with equal addendum; Gleason and other systems use unequal addenda.",
      "Strength needs a bevel gear rating (ISO 10300 or AGMA 2003).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Face width is usually kept to a third of the cone distance or less."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2181–2190. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "chordal-tooth": {
    "purpose": "Chordal tooth thickness and corrected (chordal) addendum for measuring spur gear teeth with a gear tooth vernier caliper.",
    "uses": [
      "Inspect cut gears with a gear tooth vernier",
      "Set up gear cutting depth",
      "Check worn teeth"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Module of the gear.",
      "z": "Number of teeth.",
      "a": "Addendum; 0 uses the standard one module (enter the actual value for shifted or stub teeth).",
      "t": "Circular tooth thickness at the pitch circle; 0 uses the standard π m ÷ 2 (enter a thinned value to include backlash allowance)."
    },
    "outputs": [
      "Chordal tooth thickness",
      "Chordal addendum (caliper depth setting)",
      "Pitch diameter"
    ],
    "method": [
      "Pitch diameter D = m z; half-angle θ = t ÷ D (radians).",
      "Chordal thickness tc = D sin θ (= D sin(90°/z) for standard teeth).",
      "Chordal addendum ac = a + (D ÷ 2)(1 − cos θ).",
      "Example: module 3, 30 teeth: set the caliper depth to 3.0617 mm and expect 4.7102 mm across the tooth."
    ],
    "limitations": [
      "Measures from the tip, so tip diameter errors affect the reading; span or over-pins methods are more accurate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Correct the depth setting by half the difference between measured and nominal tip diameters."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2145, 2238–2240. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "span-measurement": {
    "purpose": "Base tangent length (span measurement, Wildhaber) over k teeth for external spur and helical gears, including profile shift, with the number of teeth to span.",
    "uses": [
      "Inspect tooth thickness with a disc micrometer",
      "Set hobbing depth",
      "Check profile-shifted gears"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "mn": "Normal module.",
      "z": "Number of teeth.",
      "alphan": "Normal pressure angle.",
      "beta": "Helix angle at the pitch circle; 0 for spur.",
      "x": "Profile shift coefficient from the gear drawing (0 if not shifted).",
      "k": "Number of teeth to span; 0 chooses the usual value so the anvils touch near the pitch circle.",
      "b": "Face width, to check the anvils fit across a helical gear."
    },
    "outputs": [
      "Teeth spanned",
      "Base tangent length W",
      "Face width needed for helical gears"
    ],
    "method": [
      "inv α = tan α − α; αt = atan(tan αn ÷ cos β).",
      "W = mn cos αn [π(k − 0.5) + z inv αt] + 2 x mn sin αn.",
      "Recommended k = (z/π)[√((1 + 2x/z)² − cos²αt) ÷ cos αt − inv αt − 2x tan αn ÷ z] + 0.5, rounded (z αt ÷ 180° + 0.5 when x = 0).",
      "Helical: the face width must exceed W sin βb, with sin βb = sin β cos αn.",
      "Example: module 3, 30 teeth: span 4 teeth and expect W = 32.258 mm."
    ],
    "limitations": [
      "External gears; internal gears need measurement over pins.",
      "Thinned tooth thickness for backlash must be subtracted from W (by the normal thickness reduction × cos αn).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Subtract the design thinning for backlash to get the inspection value."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2236–2248. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-over-pins": {
    "purpose": "Measurement over two pins (or balls) for an external spur gear with even or odd teeth, from the tooth thickness and pin size, by the involute function.",
    "uses": [
      "Inspect spur gear tooth thickness accurately",
      "Write an inspection dimension on a gear drawing",
      "Check a gear without a span micrometer"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Module.",
      "z": "Number of teeth.",
      "alpha": "Pressure angle.",
      "x": "Profile shift coefficient (0 if not shifted).",
      "thin": "Reduction of arc tooth thickness for backlash, from the gear drawing.",
      "dp": "Actual pin or ball diameter; 0 uses 1.728 × module, a common size that contacts near the pitch circle."
    },
    "outputs": [
      "Pin diameter used",
      "Pressure angle at the pin centre",
      "Measurement over pins"
    ],
    "method": [
      "Tooth thickness s = m(π/2 + 2x tan α) − thinning; d = m z; d_b = d cos α.",
      "inv φ = s ÷ d + inv α + d_p ÷ d_b − π ÷ z (solved for φ by Newton’s method).",
      "Even teeth: M = d_b ÷ cos φ + d_p. Odd teeth: M = (d_b ÷ cos φ) cos(90° ÷ z) + d_p.",
      "Example: module 2, 25 teeth with 3.456 mm pins measures 54.702 mm over the pins."
    ],
    "limitations": [
      "External spur gears; helical and internal gears need modified formulas.",
      "Pins must contact the flanks on the involute; check the contact diameter for small tooth counts.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger reading means thicker teeth (less backlash)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2236–2248. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-train": {
    "purpose": "Overall ratio, output speed, direction, output torque and efficiency of a simple or compound gear train with up to four meshes.",
    "uses": [
      "Design a reduction from available gears",
      "Check output speed of an existing train",
      "Estimate torque at the output shaft"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "nin": "Speed of the first driver.",
      "Tin": "Torque at the first driver.",
      "eff": "Efficiency of each external spur or helical mesh (typically 97–99% including bearings).",
      "a1": "Teeth on the driver of mesh 1.",
      "b1": "Teeth on the driven gear of mesh 1.",
      "a2": "Teeth on the driver of mesh 2 (on the same shaft as driven gear 1); 0 if not used.",
      "b2": "Teeth on the driven gear of mesh 2.",
      "a3": "Mesh 3 driver, or 0.",
      "b3": "Mesh 3 driven gear, or 0.",
      "a4": "Mesh 4 driver, or 0.",
      "b4": "Mesh 4 driven gear, or 0."
    },
    "outputs": [
      "Overall ratio",
      "Output speed and direction",
      "Output torque",
      "Overall efficiency"
    ],
    "method": [
      "Ratio of each mesh = driven ÷ driver; overall ratio = product of mesh ratios.",
      "Output speed = input ÷ overall ratio; each external mesh reverses direction.",
      "Output torque = input torque × ratio × efficiency^(number of meshes).",
      "Example: 20:60 then 18:54 gives 9:1, 161.11 rpm and 172.87 N·m."
    ],
    "limitations": [
      "External meshes only; idler gears change direction but not the ratio (enter them as a mesh with equal teeth if needed).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check each mesh for strength with its own torque, not only the output."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2122–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cam-motion": {
    "purpose": "Peak follower velocity and acceleration for simple harmonic, cycloidal, constant-acceleration and 3-4-5 polynomial rise motions at a given cam speed, with the follower inertia force.",
    "uses": [
      "Choose a cam motion law for a mechanism",
      "Check follower spring force needed to keep contact",
      "Compare peak accelerations of motion laws"
    ],
    "users": [
      "Machine designers",
      "Automation engineers"
    ],
    "inputs": {
      "law": "Motion law of the rise segment.",
      "h": "Total follower rise.",
      "beta": "Cam rotation angle over which the rise happens.",
      "rpm": "Cam shaft speed.",
      "mass": "Mass of the follower and parts moving with it."
    },
    "outputs": [
      "Rise time",
      "Peak velocity",
      "Peak acceleration",
      "Peak inertia force"
    ],
    "method": [
      "ω = 2πn ÷ 60; β in radians.",
      "Simple harmonic: v = πhω ÷ 2β, a = π²hω² ÷ 2β². Cycloidal: v = 2hω ÷ β, a = 2πhω² ÷ β².",
      "Constant acceleration: v = 2hω ÷ β, a = 4hω² ÷ β². 3-4-5 polynomial: v = 1.875hω ÷ β, a = 5.7735hω² ÷ β².",
      "Inertia force = m × a.",
      "Example: a 20 mm cycloidal rise over 120° at 300 rpm peaks at 28.274 m/s²."
    ],
    "limitations": [
      "Rise segment only; dwell transitions with simple harmonic and parabolic laws have acceleration jumps that cause vibration.",
      "Follower and frame flexibility are not modelled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cycloidal and 3-4-5 laws have no acceleration jumps and suit higher speeds."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2284–2309. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "belt-drive-tensions": {
    "purpose": "Effective pull, tight and slack side tensions at the slip limit, centrifugal tension and resulting shaft load of a flat or V-belt drive.",
    "uses": [
      "Set belt tension for a drive",
      "Find bearing loads from a belt drive",
      "Check whether a drive will slip"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "kW": "Design power (motor power × service factor).",
      "d": "Pitch diameter of the pulley being checked (usually the smaller one).",
      "rpm": "Speed of that pulley.",
      "wrap": "Arc of contact on that pulley (see the open belt drive tool).",
      "mu": "Belt-to-pulley friction coefficient from the belt maker.",
      "groove": "Included groove angle for V-belts (about 34–40°); 0 for flat belts.",
      "mass": "Belt mass per metre (all belts together) from the belt data sheet."
    },
    "outputs": [
      "Belt speed",
      "Effective pull",
      "Tight and slack side tensions",
      "Centrifugal tension",
      "Shaft load"
    ],
    "method": [
      "Belt speed v = π d n ÷ 60 000; effective pull Fe = P ÷ v.",
      "e^(μₑθ) with μₑ = μ ÷ sin(β/2) for V-grooves; slack T₂ = Fe ÷ (e^(μₑθ) − 1) + m v²; tight T₁ = T₂ + Fe.",
      "Shaft load = √(T₁² + T₂² − 2T₁T₂ cos θ) with the centrifugal part removed.",
      "Example: 7.5 kW on a 160 mm pulley at 1450 rpm needs T₁ = 689.81 N and T₂ = 72.403 N, loading the shaft with 702.58 N."
    ],
    "limitations": [
      "Tensions are at the slip limit; install with a margin (the belt maker’s recommended static tension).",
      "Belt bending and fatigue are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the belt maker’s tension figures for installation; this result shows the minimum to avoid slip."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2473–2520. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "chain-length": {
    "purpose": "Chain length in pitches for two sprockets at a centre distance, rounded to an even number of links, the exact centre distance for that length, and chain speed.",
    "uses": [
      "Order the right chain length",
      "Set the centre distance for a standard chain",
      "Check chain speed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "p": "Chain pitch (e.g. 15.875 mm for 10B or 50/ANSI).",
      "z1": "Teeth on the small sprocket.",
      "z2": "Teeth on the large sprocket.",
      "C": "Wanted centre distance (often 30–50 pitches).",
      "rpm": "Speed of the small sprocket."
    },
    "outputs": [
      "Chain length in pitches (exact and rounded to even)",
      "Chain length in mm",
      "Exact centre distance for the rounded chain",
      "Chain speed and wrap on the small sprocket"
    ],
    "method": [
      "L (pitches) = 2C/p + (z₁ + z₂)/2 + ((z₂ − z₁)/2π)² ÷ (C/p).",
      "Round up to an even number of links (avoids an offset link).",
      "C = (p/4)[L − (z₁ + z₂)/2 + √((L − (z₁ + z₂)/2)² − 8((z₂ − z₁)/2π)²)].",
      "Example: 17/51 teeth at about 600 mm need 112 links, giving an exact centre distance of 613.11 mm."
    ],
    "limitations": [
      "Allow adjustment for chain wear and sag; the exact centre distance is for a new, tight chain.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep at least about 120° of wrap on the small sprocket."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2537–2560. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "reflected-inertia": {
    "purpose": "Load inertia reflected through a reduction, inertia ratio, acceleration torque and total motor torque to reach a speed in a given time against a load torque.",
    "uses": [
      "Size a servo or induction motor and gearbox",
      "Check acceleration time of a conveyor or rotary table",
      "Choose a gear ratio for inertia matching"
    ],
    "users": [
      "Automation engineers",
      "Machine designers"
    ],
    "inputs": {
      "JL": "Inertia of everything on the load side, about the load shaft (see the mass moment of inertia tool).",
      "Jm": "Rotor inertia from the motor data sheet (add gearbox input inertia).",
      "i": "Gear ratio: motor speed divided by load speed.",
      "eff": "Gearbox efficiency from the maker.",
      "nL": "Speed the load must reach.",
      "t": "Time allowed to reach that speed from rest.",
      "TL": "Steady torque at the load shaft from friction, gravity or process."
    },
    "outputs": [
      "Reflected load inertia and inertia ratio",
      "Motor speed",
      "Acceleration and load torque at the motor",
      "Peak motor torque"
    ],
    "method": [
      "Reflected inertia = J_L ÷ (i² η); inertia ratio = reflected ÷ J_m.",
      "Motor angular acceleration α = 2π n_L i ÷ (60 t).",
      "Motor torque = (J_m + J_L ÷ (i² η)) α + T_L ÷ (i η).",
      "Example: 2 kg·m² through 10:1 reflects as 0.022222 kg·m² (ratio 18.519); peak motor torque 9.5805 N·m."
    ],
    "limitations": [
      "Constant acceleration from rest; deceleration and duty cycle (RMS torque) need separate checks.",
      "Coupling and gearbox inertia should be added to the motor inertia.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Many servo makers recommend inertia ratios of about 10:1 or less for good tuning; follow your drive maker’s guidance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 180–186, 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ballscrew-limits": {
    "purpose": "Critical (whirling) speed and Euler buckling load of a ball or lead screw from root diameter, unsupported length and end fixity, against the operating speed and axial load.",
    "uses": [
      "Check a ball screw axis before ordering",
      "Choose end bearing arrangement",
      "Find the longest screw for a speed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "dr": "Root (minor) diameter of the screw from the catalogue.",
      "L": "Distance between bearings, or from the bearing to the nut at its furthest position.",
      "ends": "Bearing arrangement at the screw ends.",
      "E": "Modulus of the screw steel.",
      "rho": "Density of the screw material.",
      "rpm": "Highest screw speed in service.",
      "Fa": "Largest compressive load on the screw.",
      "speedPct": "Maximum share of critical speed your design rule or the screw maker allows (often 80%).",
      "loadPct": "Maximum share of buckling load your design rule allows (often 50%)."
    },
    "outputs": [
      "Critical speed and allowed speed",
      "Buckling load and allowed load",
      "Utilisation of each"
    ],
    "method": [
      "I = π d_r⁴ ÷ 64; A = π d_r² ÷ 4.",
      "Critical speed n = (λ² ÷ 2πL²) √(EI ÷ ρA) × 60, with λ = 4.730, 3.927, π or 1.875 for fixed–fixed, fixed–supported, supported–supported and fixed–free.",
      "Buckling P = π²EI ÷ (KL)², with K = 0.5, 0.7, 1 or 2.",
      "Example: a 21 mm root, 1200 mm fixed–supported screw has a critical speed of 2,750.4 rpm and a buckling load of 27.508 kN."
    ],
    "limitations": [
      "Uniform shaft at the root diameter; the nut and support stiffness affect real values.",
      "Nut life, DN limit and drive torque are separate checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the speed is too high, use a larger diameter, a fixed–fixed mounting, a shorter length or a rotating nut."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2561–2568. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "clutch-torque": {
    "purpose": "Torque capacity of a plate clutch or disc brake by the uniform-wear and uniform-pressure assumptions, with the peak lining pressure, against a required torque.",
    "uses": [
      "Size a friction clutch or brake",
      "Check torque capacity after a lining change",
      "Find the clamp force needed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "Do": "Outside diameter of the friction lining.",
      "Di": "Inside diameter of the friction lining.",
      "surfaces": "Number of friction interfaces (a single plate between a flywheel and pressure plate has 2).",
      "mu": "Dynamic friction coefficient of the lining from its maker (use a conservative value).",
      "F": "Spring or actuator clamping force.",
      "Treq": "Torque to be transmitted, multiplied by your service factor."
    },
    "outputs": [
      "Torque by uniform wear (normal design basis)",
      "Torque by uniform pressure (new lining)",
      "Peak lining pressure",
      "Margin over the required torque"
    ],
    "method": [
      "Uniform wear: T = μ F n (Rₒ + Rᵢ) ÷ 2.",
      "Uniform pressure: T = (2/3) μ F n (Rₒ³ − Rᵢ³) ÷ (Rₒ² − Rᵢ²).",
      "Peak pressure (uniform wear) p_max = F ÷ (2π Rᵢ (Rₒ − Rᵢ)).",
      "Example: 4000 N on 2 surfaces of a 250/150 mm lining with μ 0.3 carries 240 N·m (uniform wear)."
    ],
    "limitations": [
      "Flat, annular linings; heat capacity and wear rate are not checked.",
      "Friction coefficient changes with temperature, speed and contamination.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Design on the uniform-wear torque, which is the lower and more realistic value after bedding in."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2446–2458. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "motor-power": {
    "purpose": "Input power, output power, line current and shaft torque of a three-phase induction motor from voltage, power factor and efficiency.",
    "uses": [
      "Estimate full-load current for cable and protection sizing",
      "Convert a measured current into load",
      "Find shaft torque from rated power and speed"
    ],
    "users": [
      "Electrical and maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "mode": "Current from power, or power from a measured current.",
      "V": "Line-to-line supply voltage (e.g. 400 or 415 V).",
      "kW": "Rated or required shaft power (current mode).",
      "I": "Measured line current (power mode).",
      "pf": "Power factor at this load from the motor data sheet (falls at part load).",
      "eff": "Efficiency at this load from the data sheet.",
      "rpm": "Shaft speed (rated speed for full load)."
    },
    "outputs": [
      "Line current",
      "Electrical input power",
      "Shaft output power",
      "Shaft torque"
    ],
    "method": [
      "Input power P_in = √3 V I pf.",
      "Output power = P_in × efficiency; current I = P_out ÷ (√3 V pf η).",
      "Torque = 9549 × P_out (kW) ÷ n.",
      "Example: 11 kW at 415 V, pf 0.85 and 91% efficiency draws about 19.784 A."
    ],
    "limitations": [
      "Balanced three-phase supply; power factor and efficiency change with load.",
      "Not a substitute for the motor nameplate current or electrical code sizing rules.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Size cables and protection from the nameplate current and your wiring rules (e.g. AS/NZS 3000 and 3008)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "key-stress": {
    "purpose": "Shear and compressive (crushing) stress in a parallel key transmitting torque, the minimum key length for each, compared with allowable stresses.",
    "uses": [
      "Choose key length for a gear, pulley or coupling",
      "Check an existing key after a power increase",
      "Decide between a key and an interference fit"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "T": "Peak torque including service factor.",
      "d": "Shaft diameter at the key.",
      "w": "Key width from the key standard for the shaft size.",
      "h": "Key height from the key standard.",
      "L": "Effective (straight-sided) length in contact; subtract rounded ends.",
      "tauA": "Allowable shear stress for the key material from your design data.",
      "sigA": "Allowable compressive stress for the weakest of key, shaft and hub materials."
    },
    "outputs": [
      "Shear stress and minimum length for shear",
      "Crushing stress and minimum length for crushing",
      "Governing mode"
    ],
    "method": [
      "Force at the shaft surface F = 2T ÷ d.",
      "Shear τ = F ÷ (w L); crushing σ = F ÷ (h/2 × L) (half the key height bears in the hub).",
      "Minimum length = F ÷ (w τ_allow) and F ÷ (h/2 × σ_allow).",
      "Example: 400 N·m on a 40 mm shaft with a 12 × 8 key 50 mm long: τ = 33.333 MPa, σ = 100 MPa."
    ],
    "limitations": [
      "Uniform load along the key; real keys are loaded more at the torque input end.",
      "Fatigue at the keyway in the shaft is checked with the shaft stress concentration, not here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keys longer than about 1.5 × shaft diameter carry load unevenly; use two keys or a spline instead."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2460–2486, 301. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bearing-life-adjusted": {
    "purpose": "Equivalent dynamic load from radial and axial loads, basic L10 life for ball or roller bearings, and life adjusted for reliability and a life modification factor, against a required life.",
    "uses": [
      "Select a bearing for a required life",
      "Check bearing life after a load or speed change",
      "Compare ball and roller bearings"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Reliability engineers"
    ],
    "inputs": {
      "type": "Ball or roller bearing.",
      "C": "Basic dynamic load rating from the bearing catalogue.",
      "Fr": "Radial load on the bearing.",
      "Fa": "Axial load on the bearing.",
      "X": "Radial load factor from the catalogue for the Fa/Fr ratio (1 for pure radial load).",
      "Y": "Axial load factor from the catalogue (0 for pure radial load).",
      "rpm": "Shaft speed (use a weighted mean for variable duty).",
      "rel": "Required reliability; a₁ values follow ISO 281.",
      "aiso": "Life modification factor for lubrication and contamination from the bearing maker’s method (1 if not assessed).",
      "req": "Required service life from the machine specification."
    },
    "outputs": [
      "Equivalent dynamic load",
      "Basic L10 life (millions of revolutions and hours)",
      "Adjusted life Lnm in hours",
      "Comparison with the required life"
    ],
    "method": [
      "P = X Fr + Y Fa (P = Fr when X = 1 and Y = 0; P is never taken below Fr).",
      "L10 = (C ÷ P)^p million revolutions, p = 3 (ball) or 10/3 (roller); hours = L10 × 10⁶ ÷ (60 n).",
      "Lnm = a₁ × a_ISO × L10.",
      "Example: C = 52 kN with 4 kN radial and 1.5 kN axial gives P = 4.64 kN and L10h = 15,639 h."
    ],
    "limitations": [
      "X and Y depend on the bearing type and Fa/Fr ratio; take them from the catalogue for the actual bearing.",
      "Static capacity, speed limit, fit and lubrication must be checked separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If life is short, check the a_ISO factor (lubrication and cleanliness) before choosing a larger bearing."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2400–2420. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 281:2007 Rolling bearings — Dynamic load ratings and rating life — https://www.iso.org/standard/38102.html"
    ]
  },
  "journal-bearing-pv": {
    "purpose": "Projected bearing pressure, sliding velocity and PV value of a plain (sleeve) bearing or bushing, compared with the limits of the bearing material.",
    "uses": [
      "Select a bronze, polymer or sintered bush",
      "Check a pivot or slow shaft bearing",
      "Compare bush lengths"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "W": "Radial load on the bearing.",
      "d": "Shaft (journal) diameter.",
      "L": "Bearing length in contact.",
      "rpm": "Shaft speed; for oscillation use the equivalent speed from the bearing maker’s method.",
      "Pmax": "Static or dynamic pressure limit from the bearing material maker.",
      "Vmax": "Sliding speed limit from the maker (lubricated or dry as applicable).",
      "PVmax": "PV limit from the maker for the lubrication condition."
    },
    "outputs": [
      "Projected pressure",
      "Sliding velocity",
      "PV value",
      "Utilisation of each limit"
    ],
    "method": [
      "P = W ÷ (d L) (projected area).",
      "V = π d n ÷ 60 000.",
      "PV = P × V; compare each with the material limits.",
      "Example: 2000 N on a 30 × 30 mm bush at 200 rpm gives P = 2.2222 MPa, V = 0.31416 m/s and PV = 0.69813."
    ],
    "limitations": [
      "PV limits depend on lubrication, temperature and duty; they are screening values, not a hydrodynamic design.",
      "Fully hydrodynamic journal bearings need a film thickness (Sommerfeld) analysis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A length-to-diameter ratio of about 0.5 to 1.5 is common for bushes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2314–2337. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "o-ring-gland": {
    "purpose": "Squeeze, stretch (or circumferential compression), reduced cross-section and gland fill of an O-ring in a piston (male) or rod/bore (female) groove, compared with typical design ranges.",
    "uses": [
      "Check a groove design before release",
      "Choose an O-ring size for an existing groove",
      "Investigate a leaking or extruding seal"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "gland": "Piston (male) grooves stretch the ring; rod (female) grooves compress it circumferentially.",
      "duty": "Static seals tolerate more squeeze than dynamic seals.",
      "id": "Inside diameter of the O-ring from the size standard (e.g. AS 568 or ISO 3601).",
      "cs": "Cross-section diameter of the O-ring.",
      "gd": "Piston groove bottom diameter, or rod/bore groove outer diameter.",
      "depth": "Radial distance from the groove bottom to the mating surface, at nominal clearance.",
      "width": "Axial width of the groove."
    },
    "outputs": [
      "Stretch or circumferential compression",
      "Cross-section after stretch",
      "Squeeze",
      "Gland fill"
    ],
    "method": [
      "Piston: stretch = (groove diameter − ring ID) ÷ ring ID. Rod: compression = (ring OD − groove diameter) ÷ ring OD.",
      "Stretched cross-section ≈ CS ÷ √(1 + stretch) (constant volume).",
      "Squeeze = (CS′ − depth) ÷ CS′; fill = (π CS′² ÷ 4) ÷ (depth × width).",
      "Example: a 47.22 × 2.62 ring in the default piston groove has 1.6518% stretch, 19.188% squeeze and 70.154% fill."
    ],
    "limitations": [
      "Nominal dimensions; repeat at tolerance extremes and with swell in the working fluid.",
      "Typical ranges used for the checks vary by seal maker and application; confirm with the seal supplier.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Typical guidance: static squeeze about 15–30%, dynamic about 10–20%, fill below about 85%, stretch up to about 5%."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2591–2610. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 3601-2 Fluid power systems — O-rings — Housing dimensions for general applications"
    ]
  }
});
