// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook16).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "unified-thread-limits": {
    "purpose": "Allowance, major, pitch and UNR minor diameter limits of an external Unified inch thread, and minor and pitch diameter limits of the mating internal thread, for classes 1A/1B, 2A/2B and 3A/3B, by the ASME B1.1 formulas.",
    "uses": [
      "Find inspection limits for any UN thread size",
      "Set up thread gauges and CNC thread cutting",
      "Check special-diameter threads not in printed tables"
    ],
    "users": [
      "Quality inspectors",
      "Machinists",
      "Design engineers"
    ],
    "inputs": {
      "D": "Basic major diameter in inches.",
      "n": "Threads per inch.",
      "cls": "Tolerance class of the thread (2A/2B is the general-purpose class).",
      "LE": "Length of engagement; 0 uses the smaller of 9 pitches and the basic diameter, which reproduces the published tables."
    },
    "outputs": [
      "Allowance",
      "External major, pitch and UNR minor limits",
      "Internal minor (minimum) and pitch limits",
      "Pitch diameter tolerances"
    ],
    "method": [
      "P = 1/n; base pitch tolerance Td2(2A) = 0.0015 D^(1/3) + 0.0015 √LE + 0.015 P^(2/3).",
      "Class factors on Td2: 1A × 1.5, 2A × 1, 3A × 0.75; internal = 1.3 × external of the same class. Allowance es = 0.3 × Td2(2A) for 1A and 2A, 0 for 3A.",
      "dmax = D − es; major tolerance Td = 0.060 P^(2/3) (1A: 0.090); d2max = dmax − 0.64951905P; d2min = d2max − Td2; UNR minor max = dmax − 1.19078493P.",
      "Internal: D2min = D − 0.64951905P; D2max = D2min + TD2; D1min = D − 1.08253175P. Values are rounded to 0.0001 in as in ASME B1.1.",
      "Example: 0.5-13 class 2A: major 0.4985 / 0.4876 in, pitch 0.4485 / 0.4435 in."
    ],
    "limitations": [
      "Maximum internal minor diameter and class 1B/3B minor tolerances follow additional rules in ASME B1.1; take them from its tables.",
      "Uncoated threads; coatings must fit within the allowance.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Gauge with GO/NOT GO thread gauges; use these limits to check special sizes and set-ups."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1813–1866. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME B1.1 Unified Inch Screw Threads (UN and UNR Thread Form)"
    ]
  },
  "metric-thread-limits": {
    "purpose": "Major, pitch and minor diameter limits of external and internal ISO metric threads for common tolerance classes (4h, 6h, 6g, 6f, 6e, 8g and 4H, 5H, 6H, 7H, 6G) from the ISO 965-1 tolerance formulas.",
    "uses": [
      "Find inspection limits for special metric threads",
      "Set thread turning and milling sizes",
      "Compare tolerance classes"
    ],
    "users": [
      "Quality inspectors",
      "Machinists",
      "Design engineers"
    ],
    "inputs": {
      "d": "Nominal (basic major) diameter.",
      "P": "Thread pitch.",
      "ext": "Tolerance class of the external thread (6g is the usual medium class).",
      "int": "Tolerance class of the internal thread (6H is the usual medium class)."
    },
    "outputs": [
      "External major and pitch diameter limits",
      "Internal minor and pitch diameter limits",
      "Fundamental deviations and tolerances"
    ],
    "method": [
      "Fundamental deviations (µm): e = −(50 + 11P), f = −(30 + 11P), g = −(15 + 11P), h = 0; G = +(15 + 11P), H = 0.",
      "Grade 6 tolerances: Td = 180P^(2/3) − 3.15P^(−1/2); Td2 = 90P^0.4 d^0.1 (d = geometric mean of the ISO diameter range); TD2 = 1.32 Td2; TD1 = 433P − 190P^1.22 (P < 1) or 230P^0.7. Grades 4, 5, 7, 8 multiply by 0.63, 0.8, 1.25, 1.6.",
      "Tolerances are rounded to the R40 preferred-number series and deviations to whole micrometres, as ISO 965 does. Limits: d max = d + es, d2 max = d2 + es, minus the tolerances; internal D2 min = d2 + EI, D1 min = D1 + EI, plus the tolerances.",
      "Example: M10 × 1.5-6g has pitch diameter 8.994 / 8.862 mm; 6H has 9.026 / 9.196 mm."
    ],
    "limitations": [
      "ISO 965 tabulates values rounded to a preferred series; formula values can differ by a few micrometres. Use the ISO 965-2/-3 tables for acceptance.",
      "Root contour and minor diameter of external threads are not limited here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use these values to set up machining; inspect with gauges or the tabulated limits."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1867–1912. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 965-1 ISO general purpose metric screw threads — Tolerances"
    ]
  },
  "whitworth-thread": {
    "purpose": "Basic depth, pitch and minor diameters and crest/root radius of a 55° Whitworth form thread (BSW, BSF, BSP parallel) from its major diameter and threads per inch.",
    "uses": [
      "Repair and replace parts on older British equipment",
      "Inspect Whitworth form threads",
      "Convert Whitworth thread sizes to metric dimensions"
    ],
    "users": [
      "Maintenance fitters",
      "Machinists",
      "Quality inspectors"
    ],
    "inputs": {
      "D": "Basic major diameter in inches (BSP sizes use the pipe thread outside diameter, e.g. 0.825 in for ½ BSP).",
      "n": "Threads per inch (e.g. 12 for ½ BSW, 14 for ½ BSP)."
    },
    "outputs": [
      "Thread depth",
      "Basic pitch and minor diameters",
      "Crest and root radius"
    ],
    "method": [
      "Fundamental triangle H = 0.960491p; depth h = 0.640327p; radius r = 0.137329p (p = 1/n).",
      "Pitch diameter = D − h; minor diameter = D − 2h.",
      "Example: ½ BSW (12 TPI) has a pitch diameter of 0.44664 in and a minor diameter of 0.39328 in."
    ],
    "limitations": [
      "Basic dimensions; tolerances come from BS 84 (BSW/BSF) or ISO 228 (BSP parallel). BSPT is tapered and not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Do not mix Whitworth (55°) and unified or metric (60°) threads; they look similar but do not fit properly."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1980–1989, 1995–1998. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "three-wire-lead-angle": {
    "purpose": "Measurement over three wires including the effect of lead angle by Buckingham’s simplified formula, with the wire size the formula requires, for worms, Acme and multi-start threads.",
    "uses": [
      "Inspect worms and multi-start threads accurately",
      "Choose wire size for a coarse-lead thread",
      "See how much lead angle changes the reading"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "angle": "Included angle of the thread form (60° unified/metric, 29° Acme and worms, 40° worms).",
      "plane": "Whether the stated angle is in the axial plane or the normal plane.",
      "P": "Axial pitch (distance between adjacent threads), in the same unit as the pitch diameter.",
      "starts": "Number of thread starts; lead = starts × pitch.",
      "E": "Pitch diameter to be checked."
    },
    "outputs": [
      "Lead angle",
      "Normal half-angle",
      "Wire diameter required by the formula",
      "Measurement over wires and the simple-formula reading"
    ],
    "method": [
      "Lead angle B = atan(lead ÷ πE); half-angle A = included ÷ 2.",
      "Normal half-angle An: tan An = tan A cos B (axial form) or An = A (normal form). Axial thickness T = P/2.",
      "Wire diameter W = T cos B ÷ cos An; M = E + W(1 + sin An) (Buckingham’s formula 3).",
      "The simple formula without lead angle is shown for comparison.",
      "Example: a 2-start 29° thread, pitch 6.35, on 40 pitch diameter needs 3.2618 wires and reads 44.075."
    ],
    "limitations": [
      "Very accurate for lead angles below about 8–10°; for extreme accuracy at larger angles use the involute helicoid method.",
      "The wire diameter must equal the calculated value for the formula to apply directly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If your wires differ from W, use the closest available set and the simple formula with a correction, or measure with balls."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1990–2003. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "involute-spline": {
    "purpose": "Pitch, base, major, minor and form diameters, circular pitch and minimum effective space width of 30° and 37.5° involute splines by the ANSI B92.1 basic formulas, for side-fit and major-diameter-fit variants.",
    "uses": [
      "Lay out a spline shaft and hub",
      "Check spline blanks before cutting",
      "Find form diameters for tool design"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "Pd": "Diametral pitch (the first number of the pitch fraction).",
      "Nt": "Number of teeth.",
      "type": "Pressure angle, root form and fit."
    },
    "outputs": [
      "Pitch and base diameters",
      "Internal and external major and minor diameters",
      "Form diameters and form clearance",
      "Circular pitch and minimum effective space width"
    ],
    "method": [
      "D = N/P; D_b = D cos φ; circular pitch = π/P; minimum effective space width = π/2P (30°) or (0.5π + 0.1)/P (37.5°).",
      "Major and minor diameters by fit type, e.g. 30° flat root side fit: D_ri = (N + 1.35)/P, D_o = (N + 1)/P, D_i = (N − 1)/P, D_re = (N − 1.35)/P.",
      "Form clearance c_F = 0.001D (0.002–0.010 in); form diameters D_Fi = (N + 1)/P + 2c_F, D_Fe = (N − 1)/P − 2c_F (major-fit and 37.5° variants differ).",
      "Example: 20 teeth at 16/32 pitch have D = 1.25 in and an external major diameter of 1.3125 in."
    ],
    "limitations": [
      "Basic dimensions only; tolerances, effective and actual space widths for each fit class come from the full standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the minimum effective space width with the standard’s tolerances to set gauge sizes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2255–2282. Topic reference; no source tables or recommended settings are reproduced.",
      "ANSI B92.1 Involute Splines and Inspection"
    ]
  },
  "gear-cutter-number": {
    "purpose": "The standard involute gear milling cutter number (1 to 8, and the half-number series) for a spur gear, or for a helical or bevel gear from its formative (equivalent) number of teeth.",
    "uses": [
      "Pick the right form cutter for milling gear teeth",
      "Find the equivalent teeth for helical and bevel gears",
      "Decide when a half-number cutter is worth using"
    ],
    "users": [
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "type": "Kind of gear being milled.",
      "Nt": "Actual number of teeth.",
      "helix": "Helix angle of a helical gear.",
      "pitchAngle": "Pitch cone angle of a bevel gear (see the bevel gear tool)."
    },
    "outputs": [
      "Formative (equivalent) number of teeth",
      "Regular cutter number",
      "Half-number cutter"
    ],
    "method": [
      "Helical: formative teeth = N ÷ cos³ψ. Bevel: formative teeth = N ÷ cos δ (back-cone method).",
      "Regular cutters: No. 1 135–rack; 2 55–134; 3 35–54; 4 26–34; 5 21–25; 6 17–20; 7 14–16; 8 12–13.",
      "Half numbers: 1½ 80–134; 2½ 42–54; 3½ 30–34; 4½ 23–25; 5½ 19–20; 6½ 15–16; 7½ 13.",
      "Example: a 30-tooth helical gear at 30° has 46.188 formative teeth: use a No. 3 cutter."
    ],
    "limitations": [
      "Form cutters give approximately correct profiles; generated teeth (hobbing, shaping) are more accurate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the half-number cutter when the tooth count is near the lower end of a regular cutter’s range and accuracy matters."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2148–2150, 820–829. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "crossed-helical-gears": {
    "purpose": "Pitch and outside diameters, centre distance, leads and ratio of a pair of helical gears on shafts at right angles, from normal diametral pitch, tooth counts and the gear helix angle.",
    "uses": [
      "Design or replace spiral gears on right-angle drives",
      "Find the centre distance for given tooth counts",
      "Choose helix angles to fit a centre distance"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "Pn": "Normal diametral pitch (the pitch of the cutter).",
      "n": "Teeth on the pinion.",
      "Nt": "Teeth on the gear.",
      "psi": "Helix angle of the gear; the two helix angles add to 90° for shafts at right angles."
    },
    "outputs": [
      "Pitch and outside diameters",
      "Centre distance",
      "Leads",
      "Ratio"
    ],
    "method": [
      "Gear D = N ÷ (Pn cos ψ); pinion d = n ÷ (Pn cos(90° − ψ)).",
      "Centre distance C = (D + d)/2; outside diameters add 2/Pn.",
      "Lead = π × pitch diameter ÷ tan(helix angle); ratio = N ÷ n.",
      "Example: 20/40 teeth at 8 normal DP and 45° give a centre distance of 5.3033 in."
    ],
    "limitations": [
      "Point contact: crossed helical gears carry light loads and wear faster than parallel-axis gears.",
      "Both gears must have the same hand of helix for shafts at right angles.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Equal 45° helix angles give the same diameter ratio as the tooth ratio."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2195–2203. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "keyseat-depth": {
    "purpose": "Chordal height at the keyseat edge, keyseat depth at the shaft centre-line, the measurement from the bottom of the keyseat to the opposite side of the shaft, and from the top of the key to the opposite side.",
    "uses": [
      "Set the cutter depth when milling a keyseat",
      "Inspect keyseat depth with a micrometer over the shaft",
      "Check the key projection"
    ],
    "users": [
      "Machinists",
      "Quality inspectors",
      "Maintenance fitters"
    ],
    "inputs": {
      "D": "Shaft diameter at the keyseat.",
      "w": "Width of the key (and keyseat).",
      "t": "Depth of the keyseat measured at its side wall (from the key standard, e.g. t₁ in ISO or half the key height for square keys).",
      "h": "Height of the key."
    },
    "outputs": [
      "Chordal height",
      "Depth at the centre-line",
      "Bottom of keyseat to opposite side of shaft",
      "Top of key to opposite side of shaft"
    ],
    "method": [
      "Chordal height Y = (D − √(D² − w²)) ÷ 2.",
      "Depth at centre-line = Y + t.",
      "S = D − Y − t (micrometer over the shaft from the keyseat floor); T = S + h (over the fitted key).",
      "Example: a 12 mm keyseat 5 mm deep in a 40 mm shaft measures 34.079 mm from its floor across the shaft."
    ],
    "limitations": [
      "Flat-bottomed keyseat; Woodruff keyseats are circular and have their own tables.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Measure S with a micrometer across the shaft to the keyseat floor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2460–2486. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "arc-radius-rolls": {
    "purpose": "Radius of a large concave or convex arc from the distance over two equal rolls and the height of the arc above the surface plate, by the handbook construction.",
    "uses": [
      "Check radius templates and gauges",
      "Measure large radii without a CMM",
      "Inspect curved parts on a surface plate"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "type": "Concave gauge resting on the rolls, or convex arc resting on them.",
      "D": "Measured diameter of the two equal rolls.",
      "L": "Outside distance over both rolls.",
      "Hh": "Height from the surface plate to the arc (top of a concave arc, lowest point of a convex arc)."
    },
    "outputs": [
      "Radius of the arc",
      "Roll centre distance"
    ],
    "method": [
      "Half the roll centre distance cb = (L − D) ÷ 2.",
      "Concave: ce = H − D; ab = (cb² + ce²) ÷ 2ce; R = ab + D/2.",
      "Convex: ce = D − H; ab = (cb² + ce²) ÷ 2ce; R = ab − D/2.",
      "Example: 20 mm rolls 120 mm over, arc 40 mm high: R = 82.5 mm."
    ],
    "limitations": [
      "Rolls must touch the arc on its true radius, away from its ends.",
      "Small heights make the result sensitive to measurement error.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the largest roll spacing the arc allows for better accuracy."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 687–688. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-circle-pins": {
    "purpose": "Distance over plugs in opposite (or most widely spaced) holes of a bolt circle and the bolt circle diameter, from a measurement over adjacent or alternate plugs.",
    "uses": [
      "Check large bolt circles with ordinary micrometers",
      "Find the PCD from a measurement over two plugs",
      "Inspect dies and flanges"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "n": "Number of equally spaced holes.",
      "d": "Diameter of the plugs fitted in the holes.",
      "mode": "Whether the reading is over alternate or adjacent plugs.",
      "m": "Reading over the two plugs."
    },
    "outputs": [
      "Bolt circle (pitch circle) diameter",
      "Distance over opposite (or most widely spaced) plugs"
    ],
    "method": [
      "θ = 360° ÷ n. Bolt circle diameter from adjacent plugs: (c − d) ÷ sin(θ/2); from alternate plugs: (y − d) ÷ sin θ.",
      "Even n: distance over opposite plugs x = PCD + d.",
      "Odd n: across the most widely spaced plugs x = (c − d) ÷ 2 sin(θ/4) + d = PCD cos(θ/4) + d.",
      "Example (handbook case): six 0.75 in holes 4.5 in over alternate plugs: x = 5.0801 in."
    ],
    "limitations": [
      "Equally spaced holes and plugs that fit the holes without play.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use plugs that fit the holes closely; plug clearance shows directly in the result."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 686. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taper-discs": {
    "purpose": "Angle and taper per foot set by two discs at a centre distance, the centre distance for a required angle or taper (on the centre-line or from one side), and the disc size for a given angle, using the handbook’s disc gauge rules.",
    "uses": [
      "Set up a disc gauge for checking tapers",
      "Find the taper given by a disc set-up",
      "Size a disc to contact a reference disc at an angle"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "mode": "What to calculate.",
      "D": "Diameter of the larger disc.",
      "d": "Diameter of the smaller disc.",
      "C": "Distance between disc centres.",
      "angle": "Required included angle.",
      "T": "Required taper per foot (change in diameter over 12 in), measured on the centre-line or from one side as selected."
    },
    "outputs": [
      "Included angle",
      "Taper per foot (centre-line and from one side)",
      "Centre distance or disc diameter"
    ],
    "method": [
      "K = (D − d) ÷ 2C; included angle = 2 arcsin K; taper per foot = 24K ÷ √(1 − K²); from one side T = 24K √(1 − K²) ÷ (1 − 2K²).",
      "Centre distance for taper T: C = (D − d)/2 × √(1 + (T/24)²) ÷ (T/24); for an angle: C = (D − d) ÷ 2 sin(α/2).",
      "Centre distance for a taper from one side: C = (D − d) ÷ √(2 − 2 ÷ √(1 + (T/12)²)). Disc to touch at an angle: D = d (1 + sin(α/2)) ÷ (1 − sin(α/2)).",
      "Example (handbook case): 1.5 and 1 in discs at 5 in give 5.732° and 1.2015 in/ft."
    ],
    "limitations": [
      "Inch units with taper per foot as in the handbook rules; convert metric tapers to the same basis.",
      "Discs must be round and of known diameter.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use gauge blocks between disc centres or a sine bar to set the centre distance accurately."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 684–685. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drill-size-lookup": {
    "purpose": "Decimal inch and millimetre size of number (1–80) and letter (A–Z) drills, and the nearest number, letter, fractional (1/64) and metric (0.1 mm) drills to any diameter.",
    "uses": [
      "Find the size of a number or letter drill",
      "Find the nearest available drill to a calculated hole size",
      "Convert between drill series"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Maintenance fitters"
    ],
    "inputs": {
      "mode": "Find drills near a size, or the size of a drill designation.",
      "dia": "Required hole or drill diameter.",
      "unit": "Unit of the diameter.",
      "code": "Number or letter drill to look up."
    },
    "outputs": [
      "Nearest number, letter, fractional and metric drills",
      "Decimal size of a designation",
      "Difference from the required size"
    ],
    "method": [
      "Number and letter drill sizes are the standard decimal equivalents (ASME B94.11M).",
      "Fractional drills in 1/64 in steps; metric drills in 0.1 mm steps.",
      "The closest drill in each series is reported with its difference from the required size.",
      "Example: the nearest drills to 6.8 mm are No. 1, Letter H, 17/64 in, 6.8 mm."
    ],
    "limitations": [
      "Drills cut slightly oversize; check the hole for close tolerances.",
      "Availability of sizes varies by supplier.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For tapping, use the tap drill tool to choose the size first, then find the nearest drill here."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2695, 1015–1016. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME B94.11M Twist Drills"
    ]
  },
  "full-power-cutting-speed": {
    "purpose": "Highest cutting speed (turning) or table feed (milling) that uses the available spindle power for a given depth, feed or width of cut and specific cutting force.",
    "uses": [
      "Plan the fastest roughing cut a machine can take",
      "Find whether a cut is power-limited or tool-limited",
      "Compare machines for a job"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "op": "Turning or milling.",
      "P": "Spindle power available at the speed you will run (from the machine power curve).",
      "eta": "Overall efficiency from motor to cutting edge.",
      "kc": "Specific cutting force for the material at your chip thickness (tool supplier data).",
      "ap": "Depth of cut (turning) or axial depth (milling).",
      "f": "Feed per revolution (turning).",
      "D": "Work diameter, to give the spindle speed (turning).",
      "ae": "Radial width of cut (milling)."
    },
    "outputs": [
      "Maximum cutting speed and spindle speed (turning)",
      "Maximum table feed and removal rate (milling)"
    ],
    "method": [
      "Turning: vc = P η × 60 000 ÷ (kc ap f) (m/min); n = 1000 vc ÷ πD.",
      "Milling: vf = P η × 60 × 10⁶ ÷ (ae ap kc) (mm/min).",
      "Removal rate at the limit = P η × 60 000 ÷ kc (cm³/min) for either operation.",
      "Example: 11 kW at 80% with 4 × 0.3 mm in kc 2000 allows up to 220 m/min."
    ],
    "limitations": [
      "The tool supplier’s speed limit and the machine’s speed and torque limits may be lower than the power limit.",
      "kc changes with feed and tool wear.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Run at the lower of the power-limited and tool-recommended values, with a margin for wear."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "belt-length-crossed-three": {
    "purpose": "Belt length for a crossed (reversing) two-pulley drive, with the open-belt length for comparison, or for a belt wrapped around the outside of three pulleys at given positions, with wrap angles.",
    "uses": [
      "Order belts for reversing drives",
      "Find belt length around an idler or third pulley",
      "Check wrap on each pulley"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mode": "Crossed two-pulley drive, or open belt around three pulleys (pulley 1 at the origin).",
      "D1": "Pitch diameter of pulley 1.",
      "D2": "Pitch diameter of pulley 2.",
      "D3": "Pitch diameter of pulley 3 (three-pulley drive).",
      "C": "Centre distance of the crossed drive.",
      "x2": "X position of pulley 2 centre (pulley 1 is at 0, 0).",
      "y2": "Y position of pulley 2 centre.",
      "x3": "X position of pulley 3 centre.",
      "y3": "Y position of pulley 3 centre."
    },
    "outputs": [
      "Belt length",
      "Wrap angle on each pulley",
      "Open-belt length (crossed drive comparison)"
    ],
    "method": [
      "Crossed: L = 2√(C² − ((D + d)/2)²) + (D + d)/2 × (π + 2 arcsin((D + d) ÷ 2C)).",
      "Three pulleys: tangent length between pulleys i and j = √(dᵢⱼ² − (rᵢ − rⱼ)²); the belt’s outward normal on each span is found from cos(angle) = (rᵢ − rⱼ) ÷ dᵢⱼ.",
      "Arc on each pulley = radius × wrap angle between its incoming and outgoing spans; L = Σ spans + Σ arcs.",
      "Example: the default three-pulley drive needs a 1,810.5 mm belt."
    ],
    "limitations": [
      "Pitch-line lengths; the belt maker’s length designation (inside or outside) may differ.",
      "All three pulleys must be on the outside of the belt loop (no back-bent idler).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep at least about 120° of wrap on the driving pulley."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2473–2490. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
