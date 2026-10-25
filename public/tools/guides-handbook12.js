// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook12).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "nose-radius-compensation": {
    "purpose": "Compensation along Z and X for programming a taper or chamfer with the imaginary tool tip of a radiused insert, and the profile error if no compensation is applied.",
    "uses": [
      "Program tapers and chamfers without cutter compensation",
      "Check the error left by an uncompensated program",
      "Explain nose radius effects to operators"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "r": "Nose radius of the insert (0.4, 0.8 and 1.2 mm are common).",
      "angle": "Angle of the taper or chamfer measured from the spindle (Z) axis: 0° is a plain diameter, 90° a face."
    },
    "outputs": [
      "Compensation along Z",
      "Compensation along X (radius and diameter)",
      "Profile error if uncompensated"
    ],
    "method": [
      "With the imaginary tip programmed on the drawn line, the nose stands off the true profile by r(sin θ + cos θ − 1), measured square to the taper.",
      "Shift the programmed line into the material by ΔZ = r(1 − tan(θ ÷ 2)) along Z, or ΔX = r(1 − tan((90° − θ) ÷ 2)) along X (radius; double it for diameter).",
      "For a 45° chamfer both shifts are 0.586 r.",
      "Example: a 0.8 mm nose on a 45° chamfer needs 0.46863 mm along Z (or 0.93726 mm on diameter)."
    ],
    "limitations": [
      "Straight tapers only; arcs need the radius adjusted by the nose radius instead.",
      "Assumes the usual imaginary tip for OD turning; check the tip orientation code for your tool.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With tool nose radius compensation active (G41/G42), the control applies this automatically; use these values for manual programming or checks."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 782–790, 1289–1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "feed-for-finish": {
    "purpose": "Theoretical arithmetic-mean roughness Ra and peak-to-valley Rt in turning from feed and tool nose radius, or the feed for a target Ra.",
    "uses": [
      "Choose a finishing feed for a drawing Ra",
      "Trade feed against finish and cycle time",
      "Explain finish problems"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Find Ra from a feed, or the feed for an Ra.",
      "R": "Insert nose radius.",
      "f": "Feed per revolution (Ra mode).",
      "Ra": "Required arithmetic mean roughness from the drawing (feed mode)."
    },
    "outputs": [
      "Theoretical Ra",
      "Theoretical Rt (peak to valley)",
      "Feed"
    ],
    "method": [
      "Ra ≈ 0.031553 f² ÷ R; Rt ≈ f² ÷ 8R (= 0.125 f² ÷ R).",
      "Feed for a target Ra: f = √(Ra × R ÷ 0.031553), with Ra and R in the same length unit.",
      "Example (handbook case): Ra 1 µm with a 1 mm nose radius needs a feed of 0.17802 mm/rev."
    ],
    "limitations": [
      "Theoretical geometric finish; built-up edge, vibration, tool wear and material effects make the real Ra higher.",
      "Wiper inserts give better finish than this relation predicts.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Start from the theoretical feed and reduce it if measured finish is too rough."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1125–1131. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "inch-speeds-feeds": {
    "purpose": "Spindle speed from surface feet per minute and diameter, and feed rate from inches per tooth (or per revolution), with metric equivalents.",
    "uses": [
      "Convert supplier SFM and IPT data to machine settings",
      "Check inch programs",
      "Work with US tooling catalogues"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "sfm": "Recommended surface feet per minute for the tool and material.",
      "D": "Effective cutting diameter in inches.",
      "teeth": "Flutes or inserts on the cutter; 1 when the feed is per revolution.",
      "ipt": "Chip load per tooth (or feed per revolution for turning and drilling)."
    },
    "outputs": [
      "Spindle speed",
      "Feed rate",
      "Metric equivalents"
    ],
    "method": [
      "RPM = 12 × SFM ÷ (π D) ≈ 3.82 × SFM ÷ D.",
      "IPM = RPM × teeth × IPT.",
      "Metric: m/min = SFM × 0.3048; mm/min = IPM × 25.4.",
      "Example: 400 SFM on a 0.5 in cutter is 3,055.8 rpm; at 0.002 in/tooth with 4 teeth the feed is 24.446 in/min."
    ],
    "limitations": [
      "Supplier recommendations govern; check machine speed and power limits.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Round the RPM to the nearest available speed and recompute the feed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1013–1017. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "knurl-blank": {
    "purpose": "Number of teeth produced on a blank for a diametral-pitch (inch) or circular-pitch (metric) knurl, and the nearest blank diameters that give a whole number of teeth for clean tracking.",
    "uses": [
      "Size a blank before knurling to avoid double tracking",
      "Choose a knurl pitch for a diameter",
      "Explain poor knurl patterns"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "system": "Inch knurls are specified by diametral pitch (64, 96, 128, 160); metric knurls by circular pitch.",
      "P": "Diametral pitch of the knurl (inch system).",
      "t": "Circular pitch of the knurl (metric system).",
      "D": "Blank diameter you plan to use: inches for diametral pitch, millimetres for circular pitch."
    },
    "outputs": [
      "Teeth on the planned blank",
      "Nearest smaller and larger blank diameters for a whole number of teeth"
    ],
    "method": [
      "Diametral pitch: teeth = P × D; tracking blank = N ÷ P for a whole N.",
      "Circular pitch: teeth = π D ÷ t; tracking blank = N t ÷ π.",
      "Round the tooth count down and up to get the two nearest tracking diameters.",
      "Example: 96 DP on a 0.75 in blank gives 72 teeth; use 0.75 or 0.76042 in."
    ],
    "limitations": [
      "Straight knurling with the knurl axis parallel to the work; diagonal set-ups use P cos α.",
      "Material displacement raises the outside diameter; allow for it in the finished size.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Turn the blank to a tracking diameter within the tolerance the part allows."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 991–997. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bandsaw-time": {
    "purpose": "Cross-section area, cutting time per cut from the blade maker’s cutting rate, and output per hour including handling time, for round, rectangular and tube sections.",
    "uses": [
      "Estimate saw time for a cutting list",
      "Quote sawing and preparation",
      "Compare blade and material options"
    ],
    "users": [
      "Saw operators",
      "Estimators",
      "Production planners"
    ],
    "inputs": {
      "shape": "Shape of the stock.",
      "a": "Bar diameter, or width of a rectangular section, or tube outside diameter.",
      "b": "Height of a rectangular section, or tube wall thickness (ignored for round bar).",
      "rate": "Area cut per minute for the material and blade, from the blade maker’s chart or your records.",
      "handle": "Time to index, clamp and approach for each cut."
    },
    "outputs": [
      "Cut area",
      "Cutting time per cut",
      "Cuts per hour"
    ],
    "method": [
      "Area: round πD²/4; rectangle w × h; tube π(D² − (D − 2t)²)/4.",
      "Cutting time = area ÷ rate.",
      "Cuts per hour = 3600 ÷ (cutting time + handling time in seconds).",
      "Example: a 100 mm round bar at 40 cm²/min takes 1.9635 min to cut."
    ],
    "limitations": [
      "Cutting rates vary with material, blade, feed pressure and coolant; rates from tests are best.",
      "Bundle cutting and blade breakdown time are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tubes and structural shapes cut faster per area but need finer-tooth blades."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1182–1192. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centerless-feed": {
    "purpose": "Axial through-feed rate of a centerless grinder from the regulating wheel diameter, speed and inclination angle, with work rotation speed and parts per minute.",
    "uses": [
      "Set regulating wheel speed and angle for a production rate",
      "Estimate output of a through-feed job",
      "Check work speed"
    ],
    "users": [
      "Grinding machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "Dr": "Current regulating wheel diameter.",
      "nr": "Regulating wheel speed.",
      "angle": "Inclination of the regulating wheel axis (typically 1–6° for through-feed).",
      "dw": "Diameter of the part being ground.",
      "L": "Length of each part.",
      "gap": "Gap between parts as they feed through (0 for end-to-end feeding).",
      "slip": "Allowance for slip between wheel and work (about 90–98%)."
    },
    "outputs": [
      "Through-feed rate",
      "Work rotation speed",
      "Parts per minute"
    ],
    "method": [
      "Through-feed f = π Dr nr sin(α) × efficiency.",
      "Work speed ≈ Dr nr cos(α) ÷ dw.",
      "Parts per minute = f ÷ (part length + gap).",
      "Example: a 250 mm wheel at 40 rpm and 3° feeds 1,562 mm/min, about 18.376 parts/min."
    ],
    "limitations": [
      "Slip depends on wheel condition, work rest and coolant; measure actual output to refine the efficiency.",
      "Stock removal per pass and number of passes are not considered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Increase the angle for faster feed; reduce it for finer finish and better roundness."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1259–1261. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "refractometer-concentration": {
    "purpose": "Coolant concentration from a Brix refractometer reading and the coolant’s refractometer factor, and the volume of concentrate or water to add to reach the target.",
    "uses": [
      "Check daily sump concentration",
      "Calculate a correction addition",
      "Keep coolant within the maker’s range"
    ],
    "users": [
      "Machine operators",
      "Maintenance technicians",
      "Coolant managers"
    ],
    "inputs": {
      "brix": "Reading from a clean, calibrated refractometer at the sump temperature.",
      "factor": "Factor from the coolant data sheet (concentration = Brix × factor).",
      "target": "Concentration recommended by the coolant maker for this operation.",
      "volume": "Current volume of coolant in the sump."
    },
    "outputs": [
      "Actual concentration",
      "Difference from target",
      "Concentrate or water to add"
    ],
    "method": [
      "Concentration = Brix reading × refractometer factor.",
      "Too weak: add concentrate x = V (target − actual) ÷ (100 − target).",
      "Too strong: add water x = V (actual − target) ÷ target.",
      "Example: 4 °Brix × 1.6 = 6.4%; add 2.5806 L of concentrate to reach 7%."
    ],
    "limitations": [
      "Tramp oil and contamination raise the reading; check against titration periodically.",
      "Assumes the added concentrate is undiluted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add premixed coolant at the target concentration for routine top-ups; use corrections only to fix drift."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1176–1181. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bending-springback": {
    "purpose": "Final bend radius and angle after springback for sheet metal from the tool radius, thickness, yield strength and modulus, with the springback factor and overbend angle.",
    "uses": [
      "Set overbend on a press brake",
      "Choose a punch radius for a final radius",
      "Compare materials for springback"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "Ri": "Inside radius while the sheet is held in the tool.",
      "t": "Sheet thickness.",
      "YS": "Yield strength of the sheet (higher strength springs back more).",
      "E": "Elastic modulus (steel 200, aluminium about 70 GPa).",
      "angle": "Bend angle required after release."
    },
    "outputs": [
      "Final radius after springback",
      "Springback factor",
      "Angle to bend to (overbend)"
    ],
    "method": [
      "x = Ri × YS ÷ (E t). Ri ÷ Rf = 4x³ − 3x + 1.",
      "Neutral length is unchanged: (Ri + t/2) θi = (Rf + t/2) θf; springback factor K = θf ÷ θi.",
      "Bend angle in the tool = required angle ÷ K.",
      "Example: 2 mm mild steel on a 6 mm radius: K = 0.99034, so bend to 90.878° for 90°."
    ],
    "limitations": [
      "Approximate formula for free bending; bottoming and coining reduce springback.",
      "Material property scatter makes trial bends essential.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Large radius-to-thickness ratios and high-strength materials spring back most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1351–1352. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tube-bend-thinning": {
    "purpose": "Approximate outer wall thinning and inner wall thickening of a tube bent to a centreline radius, with the bend ratio and wall factor used to judge bendability.",
    "uses": [
      "Check tube wall after bending against a minimum thickness",
      "Choose a centreline radius",
      "Decide whether a mandrel is needed"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "D": "Outside diameter of the tube.",
      "t": "Nominal wall thickness.",
      "R": "Centreline radius of the bend die.",
      "tmin": "Minimum wall thickness allowed after bending (from the pressure or strength calculation)."
    },
    "outputs": [
      "Outer wall thickness and thinning",
      "Inner wall thickness",
      "Bend ratio R/D and wall factor D/t"
    ],
    "method": [
      "Outer wall ≈ t × R ÷ (R + D/2); inner wall ≈ t × R ÷ (R − D/2) (constant volume along the arc).",
      "Thinning % = (t − outer) ÷ t.",
      "Bend ratio = R ÷ D; wall factor = D ÷ t.",
      "Example: a 50 × 2 mm tube on a 100 mm radius thins to about 1.6 mm (20%)."
    ],
    "limitations": [
      "Simple geometric estimate; actual thinning depends on the process (rotary draw, mandrel, pressure die boost).",
      "Ovality and wrinkling are not predicted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Small bend ratios with large D/t usually need a mandrel and wiper die."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1382–1386. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "weld-cost": {
    "purpose": "Weld metal mass, arc time, labour, filler metal and shielding gas cost per metre of fillet weld from leg size, deposition rate, operating factor and prices.",
    "uses": [
      "Quote welded fabrication",
      "Compare processes and weld sizes",
      "Show the cost of oversize welds"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "leg": "Specified leg length of an equal-leg fillet.",
      "excess": "Extra metal from convexity and oversize welds (often 10–30%).",
      "rho": "Density of the deposited metal.",
      "dep": "Deposition rate for the process, wire size and current (from the consumable maker).",
      "of": "Share of the welder’s paid time with the arc on (manual 20–40%, mechanised more).",
      "eff": "Share of filler bought that ends up as weld metal (solid MIG wire about 90–95%, stick electrodes about 60–65%).",
      "rate": "Fully loaded labour and overhead cost per hour.",
      "wire": "Filler metal price per kilogram.",
      "gasFlow": "Shielding gas flow rate.",
      "gasPrice": "Gas cost per cubic metre."
    },
    "outputs": [
      "Weld metal per metre",
      "Arc time and paid time per metre",
      "Labour, filler and gas cost per metre",
      "Total cost per metre"
    ],
    "method": [
      "Weld metal = ½ × leg² × (1 + excess) × density (kg/m).",
      "Arc time = mass ÷ deposition rate; paid time = arc time ÷ operating factor.",
      "Labour = paid time × rate; filler = mass ÷ efficiency × price; gas = arc time × flow × price.",
      "Example: a 6 mm fillet costs about $18.80 per metre, mostly labour."
    ],
    "limitations": [
      "Excludes preparation, fit-up, cleaning, inspection and distortion correction.",
      "Deposition rate and operating factor vary greatly between shops; use measured values.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Weld cost rises with the square of leg size: avoid specifying welds larger than needed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1439–1441, 1429–1449. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lap-joint-length": {
    "purpose": "Overlap length for a lap or sleeve joint so the joint’s shear capacity matches or exceeds the strength of the thinner member, and the capacity at a chosen overlap.",
    "uses": [
      "Design brazed tube and sheet joints",
      "Choose overlap for bonded joints",
      "Check an existing overlap"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "t": "Thickness of the thinner part (for tubes, the wall).",
      "w": "Width of the joint, or circumference for a sleeve joint.",
      "sm": "Strength of the member (yield or tensile, matching your design basis).",
      "tau": "Shear strength of the braze alloy, solder or adhesive from its data sheet (reduce for temperature and ageing).",
      "factor": "How much stronger than the member the joint should be.",
      "L": "Overlap length you plan to use.",
      "load": "Service load on the joint, if known."
    },
    "outputs": [
      "Overlap needed",
      "Overlap in member thicknesses",
      "Joint and member capacity at the chosen overlap"
    ],
    "method": [
      "Member capacity = w t σ; joint capacity = w L τ.",
      "Required overlap L = factor × t σ ÷ τ.",
      "Brazed joints commonly use 3 to 6 × t overlap; longer overlaps add little because stress concentrates at the ends.",
      "Example: 1.5 mm sheet at 210 MPa with a 70 MPa braze needs 5.625 mm (3.75 × t)."
    ],
    "limitations": [
      "Uniform shear assumed; real lap joints peak at the ends, especially bonded joints.",
      "Joint clearance, fill and fillet quality strongly affect strength.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For adhesives, a longer overlap gives diminishing returns; increase width instead."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1423–1430. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "coating-coverage": {
    "purpose": "Theoretical and practical coverage, material quantity and cost for liquid paint (from volume solids) or powder coating (from density) at a dry film thickness and transfer efficiency.",
    "uses": [
      "Estimate paint or powder for a job",
      "Quote coating cost per part or per square metre",
      "Compare application methods"
    ],
    "users": [
      "Coating supervisors",
      "Estimators",
      "Fabrication managers"
    ],
    "inputs": {
      "type": "Liquid paint or powder.",
      "area": "Total surface area including both sides and edges where coated.",
      "dft": "Specified dry film thickness per coat.",
      "vs": "Volume solids from the paint data sheet (liquid only).",
      "density": "Specific gravity of the powder from its data sheet (powder only).",
      "te": "Share of material that reaches the part (spray about 30–70%, electrostatic powder about 60–95% with reclaim).",
      "price": "Cost per litre (liquid) or kilogram (powder)."
    },
    "outputs": [
      "Theoretical coverage",
      "Practical coverage",
      "Quantity needed and cost",
      "Cost per square metre"
    ],
    "method": [
      "Liquid: theoretical coverage (m²/L) = 10 × volume solids % ÷ DFT (µm).",
      "Powder: theoretical coverage (m²/kg) = 1000 ÷ (density × DFT).",
      "Practical = theoretical × transfer efficiency; quantity = area ÷ practical coverage.",
      "Example: 50 m² at 75 µm with 60% solids needs about 9.6154 L."
    ],
    "limitations": [
      "Surface profile, overspray on complex parts and mixing losses add to consumption.",
      "Multiple coats: calculate each coat separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Measure actual consumption on a few jobs to calibrate the transfer efficiency."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1500–1516. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
