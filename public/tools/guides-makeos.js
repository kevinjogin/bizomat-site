// Original MAKEOS methods, input sources and limits.
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "cutting-speed": {
    "purpose": "Convert a specified surface speed to spindle RPM, and check the surface speed at an actual machine setting.",
    "uses": [
      "spindle speed",
      "surface speed",
      "SFM planning"
    ],
    "users": [
      "Machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "diameter": "Tool supplier geometry at the actual cutting depth; work diameter for turning.",
      "speed": "Validated tooling data for the material, grade, operation and setup.",
      "rpm": "Actual machine setting, checked against tooling and machine limits."
    },
    "outputs": [
      "Required spindle speed",
      "Actual surface speed"
    ],
    "method": [
      "Required RPM = 1000 × cutting speed ÷ (π × diameter).",
      "Actual surface speed = π × diameter × actual RPM ÷ 1000.",
      "Example: 20 mm at 120 m/min requires 1909.859 rpm. At 1000 rpm the speed is 62.832 m/min."
    ],
    "limitations": [
      "The input speed is supplied by you; this tool does not select cutting data.",
      "Effective diameter can differ from nominal diameter for ball-nose and round-insert cutters.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose an available RPM and check tool, spindle and workholding speed ratings."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1013–1017. Topic reference; no source tables or recommended settings are reproduced.",
      "Sandvik Coromant: Milling formulas and definitions — https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions"
    ]
  },
  "milling-feed-time": {
    "purpose": "Calculate table feed, steady material removal and ideal cutting time from RPM, effective teeth and feed per tooth.",
    "uses": [
      "milling feed",
      "chip load",
      "metal removal rate"
    ],
    "users": [
      "CNC programmers",
      "Estimators"
    ],
    "inputs": {
      "rpm": "Actual machine setting, checked against tooling and machine limits.",
      "teeth": "Effective cutting teeth specified for the tool, not inserts that do not contribute to feed.",
      "chip": "Tool supplier recommendation or proven process sheet.",
      "width": "Programmed engaged width; this calculation assumes constant engagement.",
      "depth": "Programmed axial cutting depth.",
      "length": "Total distance travelled at the entered feed, including any chosen approach and overtravel."
    },
    "outputs": [
      "Table feed",
      "Material removal",
      "Cutting time"
    ],
    "method": [
      "Feed = RPM × effective teeth × feed per tooth.",
      "Removal rate (cm³/min) = width × depth × feed ÷ 1000.",
      "Time (min) = feed travel ÷ feed. Example: 1000 rpm, 4 teeth and 0.05 mm/tooth gives 200 mm/min; 10 × 2 mm engagement gives 4 cm³/min; 100 mm takes 0.5 min."
    ],
    "limitations": [
      "Excludes acceleration, tool changes, air moves and engagement changes.",
      "Feed per tooth is not automatically maximum chip thickness. No chip-thinning correction is applied.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add non-cutting time when estimating a complete cycle and verify cutting power separately."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1039–1058, 1087, 1153. Topic reference; no source tables or recommended settings are reproduced.",
      "Sandvik Coromant: Milling formulas and definitions — https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions"
    ]
  },
  "turning-time": {
    "purpose": "Calculate axial feed, ideal straight-pass time and surface speed for constant-RPM turning.",
    "uses": [
      "lathe time",
      "turning cycle",
      "axial feed"
    ],
    "users": [
      "Machinists",
      "Estimators"
    ],
    "inputs": {
      "rpm": "Actual machine setting, checked against tooling and machine limits.",
      "feed": "Programmed feed per revolution for the tool and material.",
      "length": "Total distance travelled at the entered feed, including any chosen approach and overtravel.",
      "passes": "Passes with the same travel and feed; enter dissimilar passes separately.",
      "diameter": "Diameter at which the reported surface speed is evaluated."
    },
    "outputs": [
      "Axial feed",
      "Time per pass",
      "Total cutting time",
      "Surface speed"
    ],
    "method": [
      "Axial feed = RPM × feed per revolution.",
      "Total cutting time = passes × travel ÷ axial feed.",
      "Surface speed = π × diameter × RPM ÷ 1000. Example: 100 mm at 1000 rpm and 0.2 mm/rev takes 0.5 min per pass, or 1.5 min for three passes."
    ],
    "limitations": [
      "Constant RPM and axial passes only; excludes facing and constant-surface-speed integration.",
      "Return, loading, acceleration and tool changes are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use each pass’s actual diameter for surface speed and add handling time to the estimate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1015, 1025, 1153. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drilling-time": {
    "purpose": "Estimate continuous-feed time for through-drilling, including the geometric drill point and chosen extra travel.",
    "uses": [
      "drill point",
      "through hole",
      "drilling time"
    ],
    "users": [
      "Machinists",
      "CNC programmers"
    ],
    "inputs": {
      "rpm": "Actual machine setting, checked against tooling and machine limits.",
      "feed": "Proven feed for the actual drill and material.",
      "diameter": "Actual drill cutting diameter.",
      "thickness": "Material thickness along the drill axis.",
      "angle": "Drill point geometry; conventional conical-point approximation.",
      "extra": "Approach and full-diameter breakthrough allowance beyond the conical point.",
      "holes": "Number of identical holes."
    },
    "outputs": [
      "Conical point length",
      "Feed travel / hole",
      "Penetration rate",
      "Time / hole",
      "Total feed time"
    ],
    "method": [
      "Point length = diameter ÷ (2 × tan(included angle ÷ 2)).",
      "Feed travel = thickness + point length + extra travel.",
      "Time = hole count × travel ÷ (RPM × feed/rev). Angles are converted from degrees to radians."
    ],
    "limitations": [
      "For a through-hole, the point must pass beyond the exit before the full diameter breaks through.",
      "Excludes pecks, dwell, retract and positioning. Split points and unusual drill tips need their actual geometry.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check exit clearance and use a separate calculation for blind-hole depth."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 866, 998, 1059–1072. Topic reference; no source tables or recommended settings are reproduced.",
      "Sandvik Coromant: Drilling formulas and definitions — https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/drilling-formulas-definitions"
    ]
  },
  "tapping-feed": {
    "purpose": "Relate thread pitch, number of starts and spindle speed to axial tapping or threading feed.",
    "uses": [
      "rigid tapping",
      "thread lead",
      "multi-start"
    ],
    "users": [
      "CNC programmers",
      "Machinists"
    ],
    "inputs": {
      "pitch": "Axial spacing of adjacent thread crests from the drawing; convert TPI first if needed.",
      "starts": "Number of independent helices on the thread.",
      "rpm": "Actual machine setting, checked against tooling and machine limits.",
      "depth": "Travel during the forward feed; not the required full-thread depth."
    },
    "outputs": [
      "Thread lead",
      "Synchronous feed",
      "Forward feed time"
    ],
    "method": [
      "Lead = pitch × starts.",
      "Synchronous feed (mm/min) = RPM × lead.",
      "Forward feed time = distance ÷ feed. Example: 1.5 mm single-start at 1000 rpm gives 1500 mm/min; 15 mm takes 0.6 s."
    ],
    "limitations": [
      "No tap-drill selection, thread tolerance, torque prediction or controller-specific cycle is provided.",
      "Excludes reversal, acceleration, chamfer allowance and return.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check whether the control expects feed per minute or feed per revolution and verify synchronisation."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1071, 1808, 2027–2044. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-circle": {
    "purpose": "Generate a coordinate table for an equally spaced bolt circle with a defined origin, start angle and direction.",
    "uses": [
      "PCD",
      "hole coordinates",
      "bolt pattern"
    ],
    "users": [
      "Designers",
      "Toolmakers",
      "CNC programmers"
    ],
    "inputs": {
      "diameter": "Hole-centre circle diameter from the drawing.",
      "holes": "Equally spaced hole count.",
      "angle": "First hole angle; positive angles are anticlockwise.",
      "x": "Circle centre relative to the drawing or setup origin.",
      "y": "Circle centre relative to the drawing or setup origin.",
      "direction": "Direction in which successive hole numbers increase."
    },
    "outputs": [
      "Angular spacing",
      "Adjacent centre chord",
      "Coordinate count"
    ],
    "method": [
      "Angular step = 360° ÷ hole count.",
      "X = centre X + radius × cos(angle); Y = centre Y + radius × sin(angle).",
      "Adjacent chord = 2 × radius × sin(π ÷ hole count). Example: four holes on a 100 mm circle centred at zero give (50,0), (0,50), (−50,0), (0,−50)."
    ],
    "limitations": [
      "Coordinates are geometry only, not a CNC program.",
      "The drawing’s datum, view direction and tolerance system must be resolved separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check one known hole and the coordinate origin before transferring positions to equipment."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 95–103, 692–695. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taper-geometry": {
    "purpose": "Calculate a straight conical taper from its two diameters and axial length.",
    "uses": [
      "cone angle",
      "taper per length",
      "compound slide"
    ],
    "users": [
      "Toolmakers",
      "Designers"
    ],
    "inputs": {
      "large": "Larger end diameter on the same nominal conical surface.",
      "small": "Smaller end diameter.",
      "length": "Distance between the diameter measurement planes, along the axis."
    },
    "outputs": [
      "Half-angle to axis",
      "Included angle",
      "Diametral taper",
      "Diametral ratio"
    ],
    "method": [
      "Diametral taper = (large diameter − small diameter) ÷ length.",
      "Half-angle = atan((large diameter − small diameter) ÷ (2 × length)).",
      "Included angle = 2 × half-angle. Example: 30 to 20 mm over 100 mm is 1:10 diametral taper and a 2.862405° half-angle."
    ],
    "limitations": [
      "No standard taper designation or interchangeability is inferred.",
      "Angle is the half-angle to the axis; do not confuse it with the included angle.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the machine’s angle convention and verify the finished taper by measurement."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 681–685. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sine-bar": {
    "purpose": "Calculate the height difference between equal-diameter sine-bar rollers for an entered angle.",
    "uses": [
      "sine bar",
      "gauge blocks",
      "angle setting"
    ],
    "users": [
      "Inspectors",
      "Toolmakers"
    ],
    "inputs": {
      "length": "Calibrated distance between the roller centres, not the overall bar length.",
      "angle": "Angle from the reference plane."
    },
    "outputs": [
      "Height difference",
      "Angle change per 1 µm height error"
    ],
    "method": [
      "Height difference = roller centre distance × sin(angle).",
      "Example: a 200 mm centre distance at 30° requires a 100 mm height difference.",
      "A one-micrometre height change gives approximately 0.001 ÷ (length × cos(angle)) radians of angular change."
    ],
    "limitations": [
      "Assumes equal rollers, clean contacts and correct bar geometry.",
      "At steep angles, height errors cause larger angular errors; the tool does not certify measurement uncertainty.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use calibrated blocks and the instrument’s permitted angle range."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 678–680. Topic reference; no source tables or recommended settings are reproduced.",
      "NPL, Fundamental Good Practice in Dimensional Metrology, GPG 80 — https://eprintspublications.npl.co.uk/3360/1/mgpg80.pdf"
    ]
  },
  "fit-clearance": {
    "purpose": "Calculate the worst-case diametral clearance range from explicitly supplied hole and shaft limits.",
    "uses": [
      "limits fits",
      "interference",
      "dimensional tolerance"
    ],
    "users": [
      "Mechanical designers",
      "Inspectors"
    ],
    "inputs": {
      "holeMin": "Lower permitted hole size on the current drawing.",
      "holeMax": "Upper permitted hole size on the current drawing.",
      "shaftMin": "Lower permitted shaft size on the current drawing.",
      "shaftMax": "Upper permitted shaft size on the current drawing."
    },
    "outputs": [
      "Minimum signed clearance",
      "Maximum signed clearance",
      "Size-only classification"
    ],
    "method": [
      "Minimum clearance = minimum hole − maximum shaft.",
      "Maximum clearance = maximum hole − minimum shaft.",
      "Positive values are clearance; negative values are interference. Example limits give 0.007 to 0.041 mm diametral clearance."
    ],
    "limitations": [
      "Uses size limits only; no ISO/ANSI fit-class values are embedded.",
      "Form, position, finish, coatings, compliance and operating temperature may change assembly behaviour.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check limit order and assess geometry and thermal conditions before approving the fit."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 628–631. Topic reference; no source tables or recommended settings are reproduced.",
      "NPL, Fundamental Good Practice in Dimensional Metrology, GPG 80 — https://eprintspublications.npl.co.uk/3360/1/mgpg80.pdf"
    ]
  },
  "thermal-growth": {
    "purpose": "Estimate signed linear growth using a supplied constant expansion coefficient and temperature change.",
    "uses": [
      "thermal expansion",
      "temperature correction",
      "dimensional growth"
    ],
    "users": [
      "Designers",
      "Maintenance engineers",
      "Metrologists"
    ],
    "inputs": {
      "length": "Dimension at the initial temperature.",
      "alpha": "Material supplier data over the temperature range; 12 is an illustrative input.",
      "initial": "Temperature at which the initial length applies.",
      "final": "Uniform final part temperature."
    },
    "outputs": [
      "Temperature change",
      "Signed length change",
      "Final length"
    ],
    "method": [
      "Temperature change = final − initial temperature.",
      "Length change = initial length × coefficient × 10⁻⁶ × temperature change.",
      "Final length = initial length + change. Example: 1000 mm, 12 µm/(m·K), 20 to 60°C grows 0.48 mm."
    ],
    "limitations": [
      "Constant coefficient, uniform temperature and unrestrained expansion only.",
      "No phase changes, gradients, constraint stresses or temperature-dependent properties are modelled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For a fit, calculate both mating parts under their actual thermal conditions."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–379. Topic reference; no source tables or recommended settings are reproduced.",
      "NPL, Fundamental Good Practice in Dimensional Metrology, GPG 80 — https://eprintspublications.npl.co.uk/3360/1/mgpg80.pdf"
    ]
  },
  "beam-deflection": {
    "purpose": "Screen a prismatic beam under one defined load case using supplied section properties and elastic modulus.",
    "uses": [
      "beam bending",
      "stiffness",
      "deflection"
    ],
    "users": [
      "Mechanical designers",
      "Fixture designers"
    ],
    "inputs": {
      "case": "Match the actual support and load arrangement to one of these ideal cases.",
      "load": "Point force, or TOTAL uniformly distributed load over the entire span.",
      "length": "Support span, or fixed face to load for a cantilever.",
      "modulus": "Verified elastic modulus at the operating temperature.",
      "inertia": "Section property about the actual bending axis; do not use polar moment.",
      "fibre": "Distance from the neutral axis to the most distant fibre."
    },
    "outputs": [
      "Maximum bending moment",
      "Maximum nominal bending stress",
      "Maximum deflection",
      "Deflection / span"
    ],
    "method": [
      "Simply supported central point: Mmax = F × L / 4; δmax = F × L³ / (48 × E × I).",
      "Cantilever tip point: Mmax = F × L; δmax = F × L³ / (3 × E × I).",
      "Simply supported uniform TOTAL load: Mmax = F × L / 8; δmax = 5 × F × L³ / (384 × E × I).",
      "Bending stress = Mmax × fibre distance / I. Example central point case: 1000 N, 1000 mm, E = 200000 MPa, I = 1000000 mm⁴, c = 50 mm gives 12.5 MPa and 0.104167 mm."
    ],
    "limitations": [
      "Linear elastic, small-deflection Euler–Bernoulli model; shear deflection and support flexibility excluded.",
      "No strength rating, buckling, fatigue, connection, impact or code-compliance assessment.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare against project-specific allowables and verify that the ideal supports match the real load path."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 232–244, 256–273. Topic reference; no source tables or recommended settings are reproduced.",
      "MIT OpenCourseWare, David Roylance: Beam Displacements — https://ocw.mit.edu/courses/3-11-mechanics-of-materials-fall-1999/resources/mit3_11f99_bdisp/"
    ]
  },
  "shaft-torsion": {
    "purpose": "Calculate elastic torsion of a uniform solid or hollow circular shaft with a supplied shear modulus.",
    "uses": [
      "torsion",
      "shaft twist",
      "polar inertia"
    ],
    "users": [
      "Designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "outer": "Actual uniform shaft outside diameter.",
      "inner": "Bore diameter; enter zero for a solid shaft.",
      "length": "Length over which the stated torque acts.",
      "torque": "Transmitted torque for the chosen load case.",
      "modulus": "Material shear modulus at the operating temperature."
    },
    "outputs": [
      "Polar area moment J",
      "Peak nominal shear stress",
      "Twist"
    ],
    "method": [
      "Polar area moment J = π × (D⁴ − d⁴) / 32.",
      "Convert torque from N·m to N·mm by multiplying by 1000.",
      "Peak nominal shear stress = torque × (D/2) / J. Twist (radians) = torque × length / (G × J).",
      "Example: 40 mm solid shaft, 500 mm long, 200 N·m and G = 80000 MPa gives 15.915494 MPa and 0.284966°."
    ],
    "limitations": [
      "Circular, uniform, linear elastic shaft only.",
      "Keyways, shoulders, bending, fatigue, buckling and critical speed are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the nominal result as one load-case input, then assess discontinuities and combined loading."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 244–249, 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torque-power": {
    "purpose": "Convert mechanical shaft power and rotational speed into steady torque.",
    "uses": [
      "motor torque",
      "shaft power",
      "rotational speed"
    ],
    "users": [
      "Designers",
      "Maintenance teams"
    ],
    "inputs": {
      "power": "Delivered mechanical power at this shaft, not motor electrical input.",
      "rpm": "Operating speed at the same shaft where power is specified."
    },
    "outputs": [
      "Shaft torque",
      "Angular speed",
      "Mechanical power"
    ],
    "method": [
      "Angular speed = 2 × π × RPM / 60.",
      "Torque (N·m) = power (kW) × 1000 ÷ angular speed.",
      "Example: 5 kW at 1500 rpm corresponds to 31.830989 N·m."
    ],
    "limitations": [
      "Steady mechanical power only; no start-up, shock, stall or duty-cycle rating.",
      "Efficiencies must be applied before entering output shaft power.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the actual torque-speed envelope for drive selection."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 176, 186, 295–297, 2573. Topic reference; no source tables or recommended settings are reproduced.",
      "Parker: Basic Hydraulic Formulas — https://www.parker.com/content/dam/Parker-com/Literature/Accumulator---Cooler-Division---Americas/Catalogs---Bulletins/GAD-HY10-1630-5-2012/ACD_CoolerCatalog_HY10_1700.pdf"
    ]
  },
  "gear-pair": {
    "purpose": "Calculate reference geometry and ideal output speed for an unshifted external spur gear pair.",
    "uses": [
      "spur gear",
      "module",
      "gear ratio"
    ],
    "users": [
      "Mechanical designers"
    ],
    "inputs": {
      "module": "Common transverse module of both spur gears.",
      "driver": "Tooth count of the input gear.",
      "driven": "Tooth count of the output gear.",
      "rpm": "Speed of the driver."
    },
    "outputs": [
      "Driver reference diameter",
      "Driven reference diameter",
      "Nominal centre distance",
      "Reduction ratio",
      "Output speed"
    ],
    "method": [
      "Reference diameter = module × tooth count.",
      "Nominal centre distance = module × (driver teeth + driven teeth) / 2.",
      "Speed ratio = driven teeth / driver teeth; output RPM = input RPM / ratio.",
      "Example: module 2, 20/60 teeth gives 40/120 mm reference diameters, 80 mm centres and 400 rpm output from 1200 rpm."
    ],
    "limitations": [
      "External spur gears without profile shift; both must have compatible tooth system and pressure angle.",
      "No tooth-strength, undercut, backlash, contact ratio or lubrication rating.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Confirm the manufacturer’s operating centre distance and all rating conditions before selecting gears."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2126–2133. Topic reference; no source tables or recommended settings are reproduced.",
      "KHK Gears: Calculation of Gear Dimensions — https://khkgears.net/new/gear_knowledge/gear_technical_reference/calculation_gear_dimensions.html"
    ]
  },
  "belt-drive": {
    "purpose": "Calculate ideal speed ratio and exact geometric belt pitch length for two circular pulleys in an open drive.",
    "uses": [
      "pulley ratio",
      "belt length",
      "belt speed"
    ],
    "users": [
      "Designers",
      "Maintenance technicians"
    ],
    "inputs": {
      "driver": "Effective pitch diameter, not pulley outside diameter.",
      "driven": "Effective pitch diameter on the output shaft.",
      "centre": "Distance between the parallel shaft axes.",
      "rpm": "Input pulley speed."
    },
    "outputs": [
      "Geometric pitch length",
      "Small-pulley wrap",
      "Ideal output speed",
      "Belt speed"
    ],
    "method": [
      "Let r and R be smaller and larger pitch radii, C the centres and a = asin((R−r)/C).",
      "Exact ideal pitch length = 2 × sqrt(C²−(R−r)²) + π × (R+r) + 2 × a × (R−r).",
      "Small-pulley wrap = 180° − 2a in degrees. Output RPM = input RPM × driver diameter / driven diameter.",
      "Belt speed (m/s) = π × driver diameter × RPM / 60000. Example 100/200 mm at 500 mm centres gives about 1476.243 mm pitch length and 750 rpm output from 1500 rpm."
    ],
    "limitations": [
      "Open, coplanar, no-slip drive only; no idlers, belt stretch or crossed drive.",
      "Pitch length is not necessarily the manufacturer’s outside or datum length. No power rating is calculated.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Select a catalogue belt and recheck centres, tension, wrap and supplier service factors."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2484–2487. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-cylinder": {
    "purpose": "Calculate double-acting cylinder forces with return pressure, plus ideal extension and retraction times.",
    "uses": [
      "cylinder force",
      "hydraulic ram",
      "stroke time"
    ],
    "users": [
      "Hydraulic engineers",
      "Maintenance teams"
    ],
    "inputs": {
      "bore": "Cylinder drawing or manufacturer datasheet.",
      "rod": "Rod diameter at the working piston.",
      "pressure": "Pressure at the active cylinder port under load.",
      "back": "Opposing-port pressure under the relevant return flow.",
      "flow": "Actual flow delivered to the active chamber.",
      "stroke": "Travel between the analysed positions."
    },
    "outputs": [
      "Ideal extension force",
      "Ideal retraction force",
      "Extension speed",
      "Retraction speed",
      "Extension time",
      "Retraction time"
    ],
    "method": [
      "Piston area A = π × bore² / 4; annular area B = π × (bore² − rod²) / 4.",
      "Extension force (N) = 0.1 × (supply bar × A − return bar × B). Retraction uses 0.1 × (supply × B − return × A).",
      "Speed (mm/s) = inlet flow × 10⁶ / (60 × active area). Time (s) = stroke / speed.",
      "For 50/25 mm, 100/5 bar and 10 L/min, extension force is about 18.899 kN and extension time is 1.1781 s over 100 mm."
    ],
    "limitations": [
      "Theoretical port forces only; seal friction, leakage, acceleration and pressure losses are excluded.",
      "No rod buckling, mounting, load holding or pressure-rating check. Regenerative circuits need a different model.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use measured port pressures and verify return-flow capacity and load control."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 365–368; CD pp. 3416–3420. Topic reference; no source tables or recommended settings are reproduced.",
      "Parker: Basic Hydraulic Formulas — https://www.parker.com/content/dam/Parker-com/Literature/Accumulator---Cooler-Division---Americas/Catalogs---Bulletins/GAD-HY10-1630-5-2012/ACD_CoolerCatalog_HY10_1700.pdf"
    ]
  },
  "hydraulic-power": {
    "purpose": "Calculate hydraulic power from differential pressure and delivered flow, with an entered overall pump efficiency.",
    "uses": [
      "pump power",
      "hydraulic kW",
      "pump loss"
    ],
    "users": [
      "Designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "pressure": "Pump outlet minus inlet pressure under the specified duty.",
      "flow": "Actual delivered flow at the stated pressure.",
      "efficiency": "Combined volumetric and mechanical efficiency at this duty, from supplier data."
    },
    "outputs": [
      "Hydraulic power",
      "Pump shaft input",
      "Estimated pump loss"
    ],
    "method": [
      "Fluid power (kW) = pressure rise (bar) × flow (L/min) / 600.",
      "Shaft input = fluid power / (efficiency / 100).",
      "Pump loss = shaft input − fluid power. Example: 150 bar and 20 L/min gives 5 kW fluid power, 5.882353 kW shaft input at 85%, and 0.882353 kW pump loss."
    ],
    "limitations": [
      "Efficiency is specific to the pump and operating point; the default is illustrative.",
      "Loss here excludes downstream throttling and motor electrical losses. It is not total system cooling demand.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Size the motor and cooling system for the full duty cycle and additional losses."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 186, 365–368; CD pp. 3416–3420. Topic reference; no source tables or recommended settings are reproduced.",
      "Parker: Basic Hydraulic Formulas — https://www.parker.com/content/dam/Parker-com/Literature/Accumulator---Cooler-Division---Americas/Catalogs---Bulletins/GAD-HY10-1630-5-2012/ACD_CoolerCatalog_HY10_1700.pdf"
    ]
  },
  "pipe-flow": {
    "purpose": "Calculate mean velocity and Reynolds number for a full circular pipe carrying a single-phase Newtonian liquid.",
    "uses": [
      "pipe velocity",
      "Reynolds",
      "liquid flow"
    ],
    "users": [
      "Hydraulic engineers",
      "Process engineers"
    ],
    "inputs": {
      "diameter": "Actual internal bore, not nominal pipe size.",
      "flow": "Volumetric flow at operating conditions.",
      "viscosity": "Fluid viscosity at the operating temperature."
    },
    "outputs": [
      "Mean velocity",
      "Reynolds number",
      "Regime indication"
    ],
    "method": [
      "Velocity = (flow / 60000) ÷ (π × (diameter / 1000)² / 4), in m/s.",
      "Re = velocity × (diameter / 1000) ÷ (kinematic viscosity × 10⁻⁶).",
      "The guide bands are Re < 2000, 2000–4000 and Re > 4000; real transition depends on disturbances. Example: 25 mm, 20 L/min and 1 mm²/s gives 0.679061 m/s and Re = 16976.53."
    ],
    "limitations": [
      "Not for compressed gas, open channels, two-phase flow or non-Newtonian fluids.",
      "No pressure drop, cavitation, erosion or suitable-velocity approval is inferred.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use Reynolds number to select a suitable friction model and include fittings and roughness in pressure-drop work."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 365–366; CD pp. 3022–3024. Topic reference; no source tables or recommended settings are reproduced.",
      "US Department of Energy, DOE-HDBK-1012/3-92, Fluid Flow, pp. 9–11 and 19–20 — https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1012-92_VOL3.pdf"
    ]
  },
  "pneumatic-consumption": {
    "purpose": "Estimate ideal reference-volume consumption for a double-acting cylinder using absolute pressure and temperature.",
    "uses": [
      "compressed air",
      "air consumption",
      "cylinder demand"
    ],
    "users": [
      "Automation engineers",
      "Maintenance teams"
    ],
    "inputs": {
      "bore": "Cylinder datasheet.",
      "rod": "Rod diameter; single rod cylinder.",
      "stroke": "Travel per extension or retraction.",
      "pressure": "Working pressure at the cylinder.",
      "ambient": "Local atmospheric pressure used to convert gauge to absolute.",
      "reference": "Pressure at which the reported litres are expressed.",
      "temperature": "Average absolute-gas calculation temperature during filling.",
      "refTemp": "Temperature at which the reported litres are expressed.",
      "cycles": "One extension plus one retraction is one complete cycle."
    },
    "outputs": [
      "Swept volume / complete cycle",
      "Working absolute pressure",
      "Reference volume / cycle",
      "Mean reference air demand",
      "Reference conditions"
    ],
    "method": [
      "Swept volume per full cycle (L) = [π × bore² / 4 + π × (bore² − rod²) / 4] × stroke / 10⁶.",
      "Absolute working pressure = gauge pressure + local ambient pressure.",
      "Reference litres/cycle = swept litres × (working absolute pressure / reference pressure) × ((reference °C + 273.15) / (cylinder °C + 273.15)).",
      "Multiply by complete cycles/min for reference L/min. At 50/20 mm, 100 mm stroke, 6 bar gauge plus 1 bar ambient and equal temperatures, the example uses 2.528982 reference L/cycle."
    ],
    "limitations": [
      "Ideal gas and swept chamber volumes only; tubing, dead volumes, leaks and valve losses are excluded.",
      "This is mean demand, not peak valve flow or compressor selection. Reference conditions must match when comparing air ratings.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add measured leakage and auxiliary volumes, then check peak flow and pressure drop."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed CD pp. 3027–3036, 3421–3422. Topic reference; no source tables or recommended settings are reproduced.",
      "NASA Glenn: Equation of State (ideal-gas relationship) — https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/equation-of-state/",
      "Festo: Air consumption of cylinders — https://www.festo.com/ca/en/s/air-consumption"
    ]
  },
  "stock-mass": {
    "purpose": "Estimate mass for rectangular stock, solid round bar or round tube using an explicitly supplied density.",
    "uses": [
      "material weight",
      "bar mass",
      "tube mass",
      "plate mass"
    ],
    "users": [
      "Estimators",
      "Designers",
      "Fabricators"
    ],
    "inputs": {
      "shape": "Select the constant cross-section of the stock.",
      "length": "Overall length of the stock.",
      "width": "Width for rectangular stock; outside diameter for round stock.",
      "thickness": "Rectangular thickness or tube wall; ignored for solid round bar.",
      "density": "Material supplier density at the relevant condition; default is illustrative."
    },
    "outputs": [
      "Cross-sectional area",
      "Volume",
      "Theoretical mass"
    ],
    "method": [
      "Rectangular area = width × thickness. Round area = π × diameter² / 4.",
      "Tube inside diameter = outside diameter − 2 × wall; area = π × (outside² − inside²) / 4.",
      "Volume (m³) = area (mm²) × length (mm) / 10⁹. Mass = volume × density. Example: 1000 × 100 × 10 mm at 7850 kg/m³ is 7.85 kg."
    ],
    "limitations": [
      "Uniform cross-section and density only; ignores tolerances, weld beads, coatings and removed features.",
      "Theoretical mass is not a rated lifting load or a substitute for weighing.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Include allowances for purchasing and handling only when supported by the actual stock and task."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66–87, 380–384. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bend-allowance": {
    "purpose": "Calculate one bend’s neutral-axis allowance and outside-dimension deduction using a supplied K-factor.",
    "uses": [
      "bend deduction",
      "flat pattern",
      "K factor"
    ],
    "users": [
      "Sheet-metal designers",
      "Fabricators"
    ],
    "inputs": {
      "thickness": "Measured or drawing thickness.",
      "radius": "Achieved inside radius for the actual tooling and material.",
      "angle": "Change in direction from flat: a right-angle bend is 90°, not its supplementary angle.",
      "k": "Neutral-axis distance from the inside surface divided by thickness; calibrate with trials.",
      "a": "Outside dimension to the theoretical sharp intersection of the outside faces.",
      "b": "Other outside flange dimension to that same virtual sharp."
    },
    "outputs": [
      "Bend allowance",
      "Outside setback",
      "Bend deduction",
      "Developed length"
    ],
    "method": [
      "Bend allowance BA = angle (radians) × (inside radius + K × thickness).",
      "Outside setback SB = (inside radius + thickness) × tan(angle / 2).",
      "Bend deduction BD = 2 × SB − BA. Developed length = A + B − BD.",
      "Example: t = 2, R = 3, K = 0.4 and a 90° bend gives BA = 5.969026 mm, BD = 4.030974 mm; 30/40 mm outside flanges develop to 65.969026 mm."
    ],
    "limitations": [
      "K is process-specific, not a material constant. Outside-dimension conventions must match this method.",
      "No bend-force, minimum-radius, springback or manufacturability prediction.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cut and measure a trial strip before releasing a production flat pattern."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1352. Topic reference; no source tables or recommended settings are reproduced.",
      "SOLIDWORKS Design Help: K-Factor — https://help.solidworks.com/2026/english/solidworks/sldworks/c_K_Factor.htm"
    ]
  },
  "punching-force": {
    "purpose": "Estimate nominal flat-punch cutting force from total simultaneous perimeter, thickness and material shear strength.",
    "uses": [
      "press tonnage",
      "blanking",
      "punch force"
    ],
    "users": [
      "Toolmakers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "perimeter": "Sum of all edges cut at the same instant, including every punch in a cluster.",
      "thickness": "Actual sheet thickness.",
      "strength": "Verified shear strength for the material and condition; do not assume tensile strength is identical.",
      "factor": "Task-specific allowance supported by tooling/process evidence; 1.2 is only illustrative."
    },
    "outputs": [
      "Nominal cutting force",
      "Adjusted estimate",
      "Adjusted metric tonne-force"
    ],
    "method": [
      "Nominal force (N) = perimeter (mm) × thickness (mm) × shear strength (N/mm²).",
      "Adjusted estimate = nominal force × supplied multiplier.",
      "Metric tonne-force = force (N) / 9806.65. Example: 100 mm × 2 mm × 300 MPa gives 60 kN; with 1.2 multiplier the estimate is 72 kN."
    ],
    "limitations": [
      "Flat-punch cutting estimate; shaped shear faces alter the force history.",
      "Does not approve press capacity, energy, stripping, eccentric loading, tool stress or punch-to-thickness ratio.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the press force-versus-stroke curve, tooling limits and actual material before selecting equipment."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1339–1343. Topic reference; no source tables or recommended settings are reproduced.",
      "Mate Precision Technologies: Calculating Punching Force — https://www.mate.com/wp-content/uploads/2015/10/SalvIII_LIT00828PN_2020_MPTECH_LR.pdf"
    ]
  },
  "process-capability": {
    "purpose": "Calculate two-sided Cp and Cpk from supplied specifications, process mean and within-process standard deviation.",
    "uses": [
      "Cp Cpk",
      "process capability",
      "quality statistics"
    ],
    "users": [
      "Quality engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "lower": "Engineering specification in the same unit as all other dimensional inputs.",
      "upper": "Upper engineering specification; not a control limit.",
      "mean": "Mean from a representative stable process dataset.",
      "sigma": "Appropriate within-subgroup estimate; not tolerance divided by six.",
      "stable": "Review control charts, sampling and the distribution before interpreting capability."
    },
    "outputs": [
      "Cp",
      "Cpk",
      "Upper-side index",
      "Lower-side index"
    ],
    "method": [
      "Cp = (upper specification − lower specification) / (6 × within-process standard deviation).",
      "Cpk = minimum of [(upper − mean)/(3σ), (mean − lower)/(3σ)].",
      "Example: 9.9–10.1 limits, mean 10.02 and σ = 0.02 gives Cp = 1.666667 and Cpk = 1.333333."
    ],
    "limitations": [
      "No stability test, sigma estimation, confidence interval or defect-rate forecast is performed.",
      "If the spread is an overall sample standard deviation, the corresponding indices are Pp/Ppk, not Cp/Cpk.",
      "No universal capability acceptance threshold is assumed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Negative Cpk means the mean lies outside a specification limit. Compare with an agreed customer criterion only after validating the study."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced.",
      "NIST/SEMATECH e-Handbook: What is Process Capability? — https://itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm"
    ]
  },
  "maintenance-availability": {
    "purpose": "Calculate observed availability and simple failure and repair averages for one repairable asset.",
    "uses": [
      "MTBF",
      "MTTR",
      "asset availability",
      "repair history"
    ],
    "users": [
      "Maintenance planners",
      "Reliability engineers"
    ],
    "inputs": {
      "uptime": "Total actual operating hours over the observation window.",
      "downtime": "Total corrective downtime in the same window; declare whether waiting time is included.",
      "failures": "Consistently defined failure events for this one asset."
    },
    "outputs": [
      "Observed availability",
      "Operating-time MTBF estimate",
      "Average corrective downtime / failure"
    ],
    "method": [
      "Observed availability = operating time / (operating time + corrective downtime).",
      "For a nonzero failure count: operating-time MTBF estimate = operating time / failures; average corrective downtime = downtime / failures.",
      "Example: 900 operating hours, 100 corrective hours and five failures gives 90% observed availability, 180 h MTBF and 20 h average corrective downtime."
    ],
    "limitations": [
      "A simple historical summary, not a reliability prediction or maintenance interval recommendation.",
      "Zero observed failures does not establish infinite MTBF; the tool leaves that estimate unreported.",
      "MTTR is a repair-time metric only when the recorded downtime contains repair time; logistics delays change the meaning.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep event definitions and observation windows consistent. Analyse failure causes before changing maintenance intervals."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed p. 2578 (maintenance context); this record-based KPI is an original extension. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
