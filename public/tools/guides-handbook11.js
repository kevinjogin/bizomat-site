// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook11).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bolt-stretch": {
    "purpose": "Bolt elongation, member compression and the nut rotation from snug-tight needed to reach a target preload, from bolt and joint stiffness.",
    "uses": [
      "Set a turn-of-nut or angle-tightening procedure",
      "Check ultrasonic or micrometer bolt stretch readings",
      "Compare joint stiffness options"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Quality inspectors"
    ],
    "inputs": {
      "d": "Nominal bolt diameter.",
      "P": "Thread pitch.",
      "grip": "Total clamped thickness.",
      "Lt": "Length of thread inside the grip.",
      "Eb": "Bolt modulus.",
      "Em": "Modulus of the clamped parts (one material assumed for the stiffness estimate).",
      "F": "Target preload from the joint design (see the bolt torque and preload tool)."
    },
    "outputs": [
      "Bolt and member stiffness",
      "Bolt elongation at preload",
      "Member compression",
      "Nut turn from snug"
    ],
    "method": [
      "kb = 1 ÷ (Ls ÷ (E Ad) + Lt ÷ (E At)); km by the 30° frustum estimate.",
      "Bolt stretch δb = F ÷ kb; member compression δm = F ÷ km.",
      "Nut turn from snug = 360° × (δb + δm) ÷ P.",
      "Example: M20 with an 80 mm grip at 120 kN stretches 158.08 µm and needs about 27.696° from snug."
    ],
    "limitations": [
      "The snug point is uncertain and adds scatter; turn-of-nut procedures usually come from tests or the code (e.g. AS 4100 / RCSC tables).",
      "Elastic stiffness only; yield-controlled tightening goes beyond this calculation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Validate any angle procedure on the actual joint with a tension-indicating method."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-group-eccentric": {
    "purpose": "Shear force on each bolt of a group of up to six under an in-plane load applied away from the group centroid, by the elastic (vector) method, against the bolt shear capacity.",
    "uses": [
      "Check bracket and gusset bolt patterns",
      "Find the critical bolt in a group",
      "Compare bolt layouts"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Quality inspectors"
    ],
    "inputs": {
      "n": "How many of the listed bolts are used (the first n).",
      "x1": "X position of bolt 1.",
      "y1": "Y position of bolt 1.",
      "x2": "X of bolt 2.",
      "y2": "Y of bolt 2.",
      "x3": "X of bolt 3.",
      "y3": "Y of bolt 3.",
      "x4": "X of bolt 4.",
      "y4": "Y of bolt 4.",
      "x5": "X of bolt 5 (used when n ≥ 5).",
      "y5": "Y of bolt 5.",
      "x6": "X of bolt 6 (used when n = 6).",
      "y6": "Y of bolt 6.",
      "Px": "Horizontal component of the load.",
      "Py": "Vertical component of the load (negative downwards).",
      "lx": "X coordinate of a point on the load’s line of action.",
      "ly": "Y coordinate of that point.",
      "cap": "Design shear capacity of one bolt from your code (see the bolt shear and bearing tool)."
    },
    "outputs": [
      "Group centroid and moment",
      "Force on each bolt",
      "Critical bolt and utilisation"
    ],
    "method": [
      "Centroid = mean of bolt positions; M = (lx − xc)Py − (ly − yc)Px.",
      "Direct shear: Px ÷ n, Py ÷ n per bolt.",
      "Torsional shear: Fx = −M (y − yc) ÷ Σr², Fy = M (x − xc) ÷ Σr², with r² = (x − xc)² + (y − yc)².",
      "Resultant per bolt = vector sum; the largest governs.",
      "Example: 20 kN at 300 mm on the default 4-bolt pattern puts 21.506 kN on the critical bolt."
    ],
    "limitations": [
      "Elastic method with equal bolt stiffness and rigid plate; the instantaneous-centre method gives higher capacity for ductile bolts.",
      "Out-of-plane loads (prying, tension) are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Spreading bolts further from the centroid reduces the torsional share."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "acme-thread": {
    "purpose": "Basic pitch, minor and major diameters, thread height, crest clearance, lead, lead angle and root area of a general-purpose Acme (inch) or ISO metric trapezoidal (Tr) thread.",
    "uses": [
      "Machine or inspect lead screws and nuts",
      "Find the root area for screw strength",
      "Set thread depth for single-point cutting"
    ],
    "users": [
      "Machinists",
      "Design engineers",
      "Quality inspectors"
    ],
    "inputs": {
      "system": "Metric trapezoidal (sizes in mm) or Acme (sizes in inches).",
      "d": "Nominal (major) diameter in mm (Tr) or inches (Acme).",
      "P": "Pitch in millimetres for trapezoidal threads (ignored for Acme).",
      "tpi": "Threads per inch for Acme threads (ignored for Tr).",
      "starts": "Number of starts; lead = starts × pitch."
    },
    "outputs": [
      "Pitch diameter",
      "External minor (root) diameter and internal minor diameter",
      "Thread height and crest clearance",
      "Lead, lead angle and root area"
    ],
    "method": [
      "Tr (ISO 2904): H₁ = 0.5P; crest clearance ac = 0.15 (P = 1.5), 0.25 (2–5), 0.5 (6–12), 1 (14–44) mm; d₂ = d − 0.5P; d₃ = d − 2(0.5P + ac); D₁ = d − P.",
      "Acme (general purpose): basic height 0.5p; pitch diameter = D − 0.5p; minor diameter = D − p; crest flat 0.3707p.",
      "Lead angle = atan(lead ÷ π d₂); root area = π d₃² ÷ 4.",
      "Example: Tr20 × 4 has d₂ = 18 mm and d₃ = 15.5 mm."
    ],
    "limitations": [
      "Basic dimensions only; class allowances and tolerances (e.g. 7e/7H, 2G/3G) come from the thread standards.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the root (minor) area for tensile and buckling checks of lead screws."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1921–1946. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 2904 Metric trapezoidal screw threads — Basic dimensions; ASME B1.5 Acme screw threads"
    ]
  },
  "npt-thread": {
    "purpose": "Pitch diameter at the small end, effective thread length, pitch diameter at the end of the effective thread, thread height and taper of an American National Standard taper pipe thread (NPT) from its outside diameter and threads per inch.",
    "uses": [
      "Machine or inspect NPT threads",
      "Check pipe thread length on a drawing",
      "Understand taper and engagement"
    ],
    "users": [
      "Machinists",
      "Quality inspectors",
      "Piping designers"
    ],
    "inputs": {
      "D": "Outside diameter of the pipe (0.840 in for ½ NPT, 1.050 in for ¾ NPT, 1.315 in for 1 NPT).",
      "n": "Threads per inch for the size (27, 18, 14, 11.5 or 8)."
    },
    "outputs": [
      "Pitch diameter at the small end E₀",
      "Effective thread length L₂",
      "Pitch diameter at L₂",
      "Thread height and taper"
    ],
    "method": [
      "E₀ = D − (0.05D + 1.1) ÷ n.",
      "L₂ = (0.80D + 6.8) ÷ n.",
      "E₂ = E₀ + 0.0625 L₂ (taper 1 in 16 on diameter); thread height = 0.8 ÷ n.",
      "Example: ½ NPT (0.84 in, 14 TPI) has E₀ = 0.75843 in and L₂ = 0.53371 in."
    ],
    "limitations": [
      "Formula values; hand-tight engagement L₁ and gauging tolerances come from the ASME B1.20.1 tables.",
      "Dryseal (NPTF) threads have different crest and root requirements.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Gauge NPT threads with L₁ ring and plug gauges; the formula values support machining set-up."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1952–1975. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME B1.20.1 Pipe Threads, General Purpose (Inch)"
    ]
  },
  "differential-indexing": {
    "purpose": "An approximate number, crank movement and change gears for differential indexing on a 40:1 dividing head with the standard gear set, for numbers simple indexing cannot produce.",
    "uses": [
      "Index prime and awkward numbers of teeth",
      "Set up the dividing head gearing",
      "Check a differential indexing table"
    ],
    "users": [
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "divisions": "Number of equal divisions required.",
      "ratio": "Crank turns per spindle turn (40 on most heads).",
      "set": "Change gears supplied with your dividing head."
    },
    "outputs": [
      "Approximate number used",
      "Crank movement for the approximate number",
      "Change gears (spindle to worm) and idler arrangement"
    ],
    "method": [
      "Choose an approximate number A that simple indexing can produce; index for A. Numbers giving a simple two-gear train are preferred, then the closest A.",
      "Gear ratio (driver on spindle ÷ driven on worm) = (A − N) × 40 ÷ A (use N − A when A < N).",
      "A > N: index plate turns the same way as the crank; A < N: the opposite way (set with idlers).",
      "Example: 67 divisions: index for 70 and gear 48 on the spindle driving 28 on the worm."
    ],
    "limitations": [
      "Gearing must be fitted with the plate unlocked; check your head’s instructions for idler positions.",
      "Only exact gear trains from the selected set are offered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the first few divisions with a test cut before cutting the full part."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2107–2121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "helical-milling": {
    "purpose": "Lead of a helix from the work diameter and helix angle, the table swivel angle, and the closest compound change-gear train between the table feed screw and the dividing head.",
    "uses": [
      "Mill helical gears, flutes and cams",
      "Find change gears for a required lead",
      "Check the lead error of a gear train"
    ],
    "users": [
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "D": "Diameter at which the helix angle is specified (pitch diameter for helical gears).",
      "beta": "Helix angle measured from the work axis.",
      "Lm": "Table travel for one dividing-head spindle turn with equal gears (254 mm = 10 in on many machines).",
      "set": "Change gears available."
    },
    "outputs": [
      "Required lead",
      "Table swivel angle",
      "Best compound gear train and lead error"
    ],
    "method": [
      "Lead = π D ÷ tan β.",
      "Gear ratio (driven product ÷ driver product) = required lead ÷ machine lead.",
      "Search all four-gear combinations of the set for the closest ratio.",
      "Example: 60 mm at 30° needs a 326.48 mm lead; drivers 24 and 56, driven 24 and 72 (error 0.026814%)."
    ],
    "limitations": [
      "Gear fit on the quadrant is not checked.",
      "The swivel is set to the helix angle at the cutting diameter.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Multiply the percentage error by the face width to see the lead error over the part."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2060–2062, 2205. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-infeed": {
    "purpose": "Radial infeed for each pass of a single-point threading cycle with a decreasing (constant chip area) schedule, with cumulative depth and the X diameter for each pass.",
    "uses": [
      "Program a threading cycle by hand",
      "Choose the number of passes",
      "Check a G76 depth schedule"
    ],
    "users": [
      "CNC programmers",
      "Machinists"
    ],
    "inputs": {
      "type": "External or internal thread.",
      "d": "Nominal thread diameter.",
      "P": "Thread pitch.",
      "passes": "Number of cutting passes (tool supplier tables suggest a number for each pitch).",
      "depth": "Total radial depth; 0 uses 0.6134P (external) or 0.5413P (internal), the ISO basic heights."
    },
    "outputs": [
      "Infeed for each pass",
      "Cumulative depth",
      "X diameter for each pass"
    ],
    "method": [
      "First pass: Δ₁ = a_p √0.3 ÷ √(n − 1).",
      "Cumulative depth after pass x (x ≥ 2) = a_p √(x − 1) ÷ √(n − 1); the last pass reaches a_p.",
      "External X = d − 2 × depth; internal X = minor diameter + 2 × depth.",
      "Example: M20 × 2.5 external in 8 passes: first infeed 0.31746 mm, last 0.11375 mm."
    ],
    "limitations": [
      "Radial depth schedule only; flank or modified-flank infeed changes the X/Z moves.",
      "Add spring passes as your process requires.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep the last pass above the insert’s minimum infeed (often about 0.05 mm) to avoid rubbing."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2037–2042, 1289–1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "planetary-gear": {
    "purpose": "Ratio, output speed and torque of a simple planetary gear set with the ring, sun or carrier held, the planet tooth count and the equal-spacing assembly check.",
    "uses": [
      "Design or check a planetary reduction",
      "Choose tooth counts that assemble",
      "Find speed and torque at the output"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "zs": "Teeth on the sun gear.",
      "zr": "Teeth on the internal ring gear.",
      "np": "Number of equally spaced planets.",
      "mode": "Which member is held, which is the input and which is the output.",
      "nin": "Input speed.",
      "Tin": "Input torque.",
      "eff": "Overall efficiency of the stage."
    },
    "outputs": [
      "Planet teeth",
      "Ratio and direction",
      "Output speed and torque",
      "Assembly check"
    ],
    "method": [
      "Planet teeth = (Zr − Zs) ÷ 2 (standard gears, same module).",
      "Ring fixed: i = 1 + Zr/Zs. Sun fixed: i = 1 + Zs/Zr. Carrier fixed: i = −Zr/Zs (output reverses).",
      "Equal spacing requires (Zs + Zr) ÷ number of planets to be a whole number.",
      "Example: sun 24, ring 72 with the ring fixed gives 4:1 and 375 rpm."
    ],
    "limitations": [
      "Standard, unshifted gears of one module; profile-shifted sets can break the planet-count rule.",
      "Load sharing between planets is assumed equal.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check each mesh (sun–planet and planet–ring) for strength with its own tangential force."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2211, 2122–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "profile-shift": {
    "purpose": "Working pressure angle, working centre distance and centre distance modification for a spur gear pair with profile shift, the undercut check and the backlash change at an actual centre distance.",
    "uses": [
      "Fit a gear pair to a non-standard centre distance",
      "Avoid undercut on small pinions",
      "Estimate backlash change from centre distance"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Module.",
      "z1": "Pinion tooth count.",
      "z2": "Gear tooth count.",
      "alpha": "Standard pressure angle.",
      "x1": "Profile shift coefficient of the pinion (positive = cutter withdrawn).",
      "x2": "Profile shift coefficient of the gear.",
      "aAct": "Housing centre distance, to find the backlash change from the zero-backlash position."
    },
    "outputs": [
      "Working pressure angle",
      "Working centre distance and modification",
      "Undercut check for each gear",
      "Backlash change at the actual centre distance"
    ],
    "method": [
      "inv αw = 2(x₁ + x₂) tan α ÷ (z₁ + z₂) + inv α (solved by Newton’s method).",
      "Standard a₀ = m(z₁ + z₂) ÷ 2; working aw = a₀ cos α ÷ cos αw.",
      "No undercut when x ≥ 1 − z sin²α ÷ 2.",
      "Circumferential backlash change ≈ 2(a_actual − aw) tan αw.",
      "Example: x₁ = 0.2 on 14/40 teeth gives αw = 21.099° and aw = 54.39 mm."
    ],
    "limitations": [
      "Zero-backlash working distance; tooth thinning for backlash is separate.",
      "Large positive shifts can give pointed teeth; check tip thickness.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Distribute the total shift between pinion and gear to balance strength and avoid undercut on the pinion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2141–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "contact-ratio": {
    "purpose": "Transverse contact ratio of an external spur gear pair from module, tooth counts, pressure angle and profile shifts, with base pitch and length of contact.",
    "uses": [
      "Check smoothness and load sharing of a gear pair",
      "Compare tooth counts and pressure angles",
      "Verify a gear design"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Module.",
      "z1": "Pinion tooth count.",
      "z2": "Gear tooth count.",
      "alpha": "Pressure angle.",
      "x1": "Pinion profile shift coefficient (0 if standard).",
      "x2": "Gear profile shift coefficient."
    },
    "outputs": [
      "Tip and base radii",
      "Working centre distance",
      "Length of contact and base pitch",
      "Contact ratio"
    ],
    "method": [
      "Tip radius rₐ = m(z/2 + 1 + x); base radius r_b = m z cos α ÷ 2.",
      "Working distance aw from the profile shifts (involute relation).",
      "ε = [√(rₐ₁² − r_b1²) + √(rₐ₂² − r_b2²) − aw sin αw] ÷ (π m cos α).",
      "Example: 20/50 teeth at 20° give a contact ratio of 1.6558."
    ],
    "limitations": [
      "Standard addendum (tip diameter not shortened); tip relief and chamfers reduce the effective ratio.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep the contact ratio above about 1.2; values near 2 give very smooth running."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "dp-spur-gear": {
    "purpose": "Pitch, outside and root diameters, addendum, dedendum, whole depth, circular pitch, tooth thickness and centre distance of a diametral-pitch spur gear pair, with metric equivalents.",
    "uses": [
      "Machine or replace inch-system gears",
      "Convert diametral pitch to module",
      "Check gear blank diameters"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "P": "Diametral pitch (teeth per inch of pitch diameter).",
      "n1": "Pinion tooth count.",
      "n2": "Gear tooth count.",
      "system": "Tooth proportions of the gear system."
    },
    "outputs": [
      "Pitch, outside and root diameters",
      "Addendum, dedendum and whole depth",
      "Circular pitch and tooth thickness",
      "Centre distance and equivalent module"
    ],
    "method": [
      "Pitch diameter = N ÷ P; addendum a = 1/P (stub 0.8/P).",
      "Dedendum b = 1.25/P (20° FD), 1.157/P (14½° FD), 1/P (stub); OD = (N + 2aP) ÷ P; root = PD − 2b.",
      "Circular pitch = π ÷ P; tooth thickness = π ÷ 2P; centre distance = (N₁ + N₂) ÷ 2P; module = 25.4 ÷ P.",
      "Example: 10 DP, 20 teeth: PD 2 in, OD 2.2 in, centre distance 3.25 in."
    ],
    "limitations": [
      "Standard proportions; fine-pitch gears (20 DP and finer) add a clearance allowance to the dedendum.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Turn gear blanks to the outside diameter before cutting."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2140, 2249–2251. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sprocket-diameters": {
    "purpose": "Pitch diameter, approximate outside diameter, bottom diameter and caliper diameter (for odd tooth counts) of a roller chain sprocket from chain pitch, tooth count and roller diameter.",
    "uses": [
      "Machine or inspect sprockets",
      "Check clearances around a sprocket",
      "Measure worn sprockets"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "p": "Chain pitch (15.875 mm for 10B/ANSI 50, 12.7 mm for 08B/ANSI 40).",
      "N": "Tooth count of the sprocket.",
      "Dr": "Roller diameter of the chain from its data sheet."
    },
    "outputs": [
      "Pitch diameter",
      "Approximate outside diameter",
      "Bottom diameter",
      "Caliper diameter (odd teeth)"
    ],
    "method": [
      "Pitch diameter = p ÷ sin(180° ÷ N).",
      "Bottom diameter = PD − roller diameter.",
      "Caliper diameter (odd N) = PD cos(90° ÷ N) − roller diameter; outside diameter ≈ p (0.6 + cot(180° ÷ N)).",
      "Example: 17 teeth on 15.875 mm pitch: PD 86.395 mm, bottom 76.235 mm."
    ],
    "limitations": [
      "The outside diameter is the ANSI approximate value; tooth form tolerances come from the chain standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Measure worn sprockets across the bottoms (or caliper for odd teeth) and compare with these values."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2537–2550. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
