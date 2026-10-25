// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook25).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "forming-tool-depth": {
    "purpose": "Forming tool dimensions by the handbook methods: step depth and angle on a flat tool with front clearance, step depth on a tool with both rake and clearance from the work radii, and the radius of each step on a circular forming tool whose cutting face sits below centre.",
    "uses": [
      "Grind a dovetail or circular form tool for a profile",
      "Correct form depths for rake and clearance",
      "Check a supplier’s form tool drawing"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Type of forming tool.",
      "D": "Difference in radius between two steps on the work.",
      "C": "Front clearance angle of the flat tool.",
      "A": "Angle of a flank on the work (for its reduced angle on the tool).",
      "R": "Larger radius on the work.",
      "r": "Smaller radius on the work.",
      "F": "Top rake angle of the tool.",
      "E": "Front clearance angle of the tool.",
      "Rt": "Radius of the circular tool at its largest step.",
      "off": "Distance of the cutting face below the tool’s horizontal centre line (set by the machine)."
    },
    "outputs": [
      "Step depth on the tool",
      "Angle or radius on the tool",
      "Correction from the work dimension"
    ],
    "method": [
      "Flat tool: depth d = D cos C; angle in plane x-x: tan A′ = tan A × cos C.",
      "Rake and clearance: A = 180° − F; sin B = r sin A ÷ R; C = 180° − (A + B); y = R sin C ÷ sin A; tool angle D = 90° − (E + F); depth x = y sin D (handbook example: 16 and 10 mm radii, 10° rake, 15° clearance → 5.490 mm).",
      "Circular tool: r = √[(√(R² − C²) − D)² + C²], with C the offset of the cutting face.",
      "Example: a 12.7 mm step with 15° clearance is 12.267 mm deep on a flat tool."
    ],
    "limitations": [
      "Straight radial steps; curved profiles need point-by-point correction.",
      "Machine-specific tool radius and offset come from the machine maker.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Without correction, a raked or offset tool cuts steps shallower than intended."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 797–801. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spade-drill-power": {
    "purpose": "Power at the cutter and at the motor, and the thrust force, for spade drilling by the handbook formulas from drill diameter, feed, speed and the unit power of the work material, with an allowance for tool wear.",
    "uses": [
      "Check whether a machine can drive a large spade drill",
      "Size fixturing against drilling thrust",
      "Compare feeds for power and thrust"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the spade drill.",
      "f": "Feed per revolution.",
      "n": "Spindle speed.",
      "ukw": "Unit power for spade drilling the work material (from tooling or handbook data for the material and hardness).",
      "em": "Mechanical efficiency of the machine drive (about 0.9 belt direct drive, 0.75 back gear, 0.7–0.8 geared head).",
      "dull": "Increase for a dulling tool (the handbook suggests 25–50% for a dull tool).",
      "avail": "Rated motor power of the machine."
    },
    "outputs": [
      "Power at the cutter and motor",
      "Thrust force",
      "Machine utilisation"
    ],
    "method": [
      "Power at the cutter kW_c = ukw × (π D² ÷ 4) × f × N ÷ 1000.",
      "Thrust B_s = 22,500 × ukw × f × D newtons (US form 148,500 uhp f D pounds).",
      "Motor power = kW_c ÷ e_m; wear allowance applied to both power and thrust.",
      "Example: a 40 mm spade drill at 0.3 mm/rev and 300 rpm needs 6.3441 kW at the motor."
    ],
    "limitations": [
      "Values for sharp tools; dull tools raise power and thrust 25–50%.",
      "Unit power varies with hardness and tool geometry.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Reduce feed before speed if thrust is the limit; reduce speed if power is."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1077–1079. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "true-stress-strain": {
    "purpose": "Nominal (engineering) and true stress and strain from a tensile test load, original and current area and gauge length, the flow stress from the strain-hardening law σ = K εⁿ, elongation and reduction of area — the metalworking quantities used for forming calculations.",
    "uses": [
      "Convert tensile test data to true stress and strain for forming",
      "Estimate flow stress at a forming strain",
      "Report elongation and reduction of area"
    ],
    "users": [
      "Materials engineers",
      "Forming engineers",
      "Test laboratory technicians"
    ],
    "inputs": {
      "F": "Load at the point of interest.",
      "A0": "Original cross-section area of the specimen.",
      "A": "Measured current area (or at fracture); 0 assumes constant volume, A = A₀ l₀ ÷ l.",
      "l0": "Original gauge length.",
      "l": "Current gauge length (or the length between gauge marks after fracture).",
      "K": "Strength coefficient of the flow curve (true stress at true strain 1) from material data.",
      "nexp": "Strain-hardening exponent (typically 0.10–0.50 for metals)."
    },
    "outputs": [
      "Nominal stress and strain",
      "True stress and strain",
      "Flow stress, elongation and reduction of area"
    ],
    "method": [
      "Nominal stress = F ÷ A₀; nominal strain = (l − l₀) ÷ l₀.",
      "True stress = F ÷ A; true strain ε = ln(l ÷ l₀).",
      "Flow curve σ = K εⁿ.",
      "Elongation = (l_f − l₀) ÷ l₀ × 100%; reduction of area = (A₀ − A_f) ÷ A₀ × 100%.",
      "Example: 30 kN with the gauge stretched from 50 to 60 mm gives a true stress of 458.37 MPa at a true strain of 0.18232."
    ],
    "limitations": [
      "Constant-volume area holds only before necking; measure the area after necking starts.",
      "The power-law flow curve is an approximation over the plastic range.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "n roughly equals the true strain at the onset of necking: high n means good stretch formability."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1331–1334. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "viscosity-units": {
    "purpose": "Conversion between kinematic viscosity (centistokes, mm²/s), absolute or dynamic viscosity (centipoise, pascal-seconds, reyn) and Saybolt Universal Seconds at 40 °C and 100 °C, using the oil’s density, by the handbook relations.",
    "uses": [
      "Compare oil specifications quoted in different units",
      "Convert a viscosity for a bearing film calculation",
      "Check an older SUS specification against an ISO VG grade"
    ],
    "users": [
      "Lubrication technicians",
      "Reliability engineers",
      "Design engineers"
    ],
    "inputs": {
      "unit": "Unit of the value you have.",
      "val": "Viscosity value in that unit.",
      "sg": "Specific gravity of the oil at the measurement temperature."
    },
    "outputs": [
      "Kinematic viscosity",
      "Dynamic viscosity",
      "Saybolt seconds"
    ],
    "method": [
      "cSt = cP ÷ specific gravity; cP = specific gravity × cSt.",
      "SUS ≈ 4.632 × cSt at 100 °F (40 °C) and 4.664 × cSt at 210 °F (100 °C).",
      "1 reyn = 68,950 poise = 6.895 × 10⁶ cP; 1 cP = 1 mPa·s.",
      "Example: 68 cSt at specific gravity 0.88 is 59.84 cP and about 314.98 SUS at 40 °C."
    ],
    "limitations": [
      "The SUS multipliers apply to the higher viscosities; low viscosities need the ASTM D2161 table.",
      "Viscosity must be converted at the same temperature as it was measured.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Absolute viscosity is what an oil-film calculation needs; kinematic is what grades and oil analysis report."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2425–2426. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "buttress-thread": {
    "purpose": "Basic form and diameters of the American National Standard 7°/45° buttress inch screw thread (ANSI B1.9) for any pitch: sharp-V height, thread engagement, root radius and truncations, crest width, major, pitch and minor diameters of the internal and external threads with an allowance.",
    "uses": [
      "Machine or inspect a buttress thread for a vise, press screw or breech",
      "Grind a buttress thread tool to the basic form",
      "Check drawing dimensions against the standard formulas"
    ],
    "users": [
      "Quality inspectors",
      "Machinists",
      "Gauge makers"
    ],
    "inputs": {
      "D": "Basic major diameter.",
      "p": "Pitch (25.4 ÷ threads per inch).",
      "G": "Allowance (from the class of thread in the standard; 0 for basic size)."
    },
    "outputs": [
      "Thread form dimensions",
      "Internal thread diameters",
      "External thread diameters"
    ],
    "method": [
      "H = 0.89064 p; h = 0.6 p; root radius r = 0.07141 p; root truncation s = 0.0826 p; crest truncation f = 0.14532 p; crest width F = 0.16316 p; thread heights h_n = h_s = 0.66271 p.",
      "Internal: major D_n = D + 0.12542 p; pitch E_n = D − h; minor K_n = D − 2h.",
      "External: major D_s = D − G; pitch E_s = D − h − G; minor K_s = D − 1.32542 p − G.",
      "Example: a 50.8 mm buttress thread of 4.233 mm pitch has a basic pitch diameter of 48.26 mm."
    ],
    "limitations": [
      "Basic (maximum material) dimensions; tolerances depend on the class and length of engagement.",
      "Load is carried on the 7° flank; mating parts must be assembled the right way round.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Buttress threads carry high axial load in one direction with low radial bursting force."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1945–1952. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "three-wire-taper-buttress": {
    "purpose": "Measurement over wires for taper screw threads (corrected for the taper, including the simplified form for American pipe threads) and for buttress threads of any flank angles, the pitch diameter equivalent to a measured value, and the wire size for pitch-line contact on buttress threads.",
    "uses": [
      "Check a taper pipe thread gauge or part over wires",
      "Measure a buttress thread’s pitch diameter",
      "Choose wires for buttress thread measurement"
    ],
    "users": [
      "Quality inspectors",
      "Machinists",
      "Gauge makers"
    ],
    "inputs": {
      "mode": "Kind of thread.",
      "E": "Pitch diameter where the single wire is placed.",
      "P": "Pitch.",
      "W": "Diameter of the wires used.",
      "ang": "Included angle of a symmetrical taper thread (60° for pipe threads).",
      "tpf": "Taper on diameter per foot of length (¾ in. = 19.05 mm for American pipe threads).",
      "A": "Included angle of the buttress thread groove.",
      "a": "Angle of the front, load-carrying face from the perpendicular to the axis.",
      "Mm": "A measured value over the wires, to convert back to pitch diameter."
    },
    "outputs": [
      "Measurement over wires",
      "Pitch diameter for a measured value",
      "Recommended wire size (buttress)"
    ],
    "method": [
      "Taper: M = [E − (cot a) P ÷ 2 + W (1 + csc a)] ÷ sec b, with a half the thread angle and b half the taper angle; for pipe threads M = [E − 0.866025 P + 3W] ÷ 1.00049.",
      "Buttress: M = E − P ÷ [tan a + tan(A − a)] + W [1 + cos(A ÷ 2 − a) csc(A ÷ 2)].",
      "Buttress wire for pitch-line contact: W = P cos a ÷ (1 + cos A).",
      "Example: the handbook 3-in. pipe thread gauge (3.3885 in. pitch diameter, 8 threads per inch, 0.07217 in. wires) measures 3.495 in. over wires."
    ],
    "limitations": [
      "The taper formula is accurate for tapers up to ¾ in. per foot.",
      "Wire placement on a taper thread must be at the point where the pitch diameter is wanted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the converted pitch diameter to judge the part against its tolerance, not the raw measurement."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2005–2007. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "multi-start-threading": {
    "purpose": "CNC set-up for multi-start threads: lead (programmed feed) from pitch and starts, the angular spacing of the starts, the Z-axis shift between starts and number of shifts, the helix angle at the pitch diameter for tool side clearance, and the spindle speed limit from the axis feed limit.",
    "uses": [
      "Program a two- or three-start thread on a CNC lathe",
      "Check tool side clearance for a steep lead",
      "Find the spindle speed the Z-axis can follow"
    ],
    "users": [
      "CNC programmers",
      "Machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "P": "Pitch (axial distance between adjacent threads).",
      "starts": "Number of independent thread starts.",
      "d2": "Pitch diameter of the thread.",
      "fmax": "Highest feed rate the Z-axis can follow while threading.",
      "rpm": "Spindle speed you plan to use."
    },
    "outputs": [
      "Lead and programmed feed",
      "Start spacing and Z shift",
      "Helix angle and speed limit"
    ],
    "method": [
      "Lead = number of starts × pitch (the F value for G32 or G76).",
      "Start spacing = 360° ÷ starts; each start is cut after shifting Z by one pitch, with starts − 1 shifts.",
      "Helix angle = atan[lead ÷ (π × pitch diameter)]; maximum speed = axis feed limit ÷ lead.",
      "Example: a 3-start thread of 1.5875 mm pitch has a 4.7625 mm lead and a 3.4701° helix angle."
    ],
    "limitations": [
      "Start the Z shift from the same synchronised position; acceleration distance must clear the part.",
      "Controls differ in G76 syntax; check the control manual.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Steep multi-start leads need extra side clearance on the leading flank of the tool."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1304–1305. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shear-spinning": {
    "purpose": "Shear (cone) spinning by the sine law: starting blank thickness for a required wall thickness and cone half-angle, the ideal tangential roller force from the material’s average flow stress, thickness reduction and feed, and the power at the roller.",
    "uses": [
      "Choose blank thickness for a spun cone",
      "Estimate roller force and machine power",
      "Check how steep a cone can be spun in one pass"
    ],
    "users": [
      "Forming engineers",
      "Spinning machine operators",
      "Manufacturing engineers"
    ],
    "inputs": {
      "Tw": "Required wall thickness of the cone.",
      "alpha": "Half angle of the cone (between the wall and the axis).",
      "sf": "Average flow stress over the strain range (from a true stress–strain calculation).",
      "f": "Axial feed of the roller per revolution.",
      "Dr": "Work diameter at the roller contact.",
      "rpm": "Spindle speed."
    },
    "outputs": [
      "Starting blank thickness",
      "Tangential roller force",
      "Power at the roller"
    ],
    "method": [
      "Sine law: T = T_w ÷ sin α (the flange keeps its blank diameter, the wall thins).",
      "Ideal tangential force F_t = σ_f (T − T_w) f.",
      "Power = F_t × surface speed at the roller.",
      "Example: a 2 mm wall at 30° half angle needs a 4 mm blank."
    ],
    "limitations": [
      "Ideal force; friction and redundant work add to it.",
      "Very small half angles exceed the material’s spinnability limit; confirm with trials.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thickness reduction (1 − sin α) is the measure of severity; stay within the material’s tested limit."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1362–1364. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "machine-positioning-accuracy": {
    "purpose": "Machine tool positioning accuracy by the AMT method described in the handbook: for each target point the mean positional deviation and standard deviation of repeated unidirectional runs, the ±3σ repeatability spread, and the axis accuracy as the spread from the lowest (mean − 3σ) to the highest (mean + 3σ) across all targets.",
    "uses": [
      "Evaluate a laser or gauge check of a CNC axis",
      "Compare machines against a required accuracy",
      "Track axis accuracy before and after compensation"
    ],
    "users": [
      "Quality engineers",
      "Maintenance engineers",
      "Machine tool technicians"
    ],
    "inputs": {
      "nt": "How many target points along the axis you measured (up to four here).",
      "t1r1": "Positional deviation (measured − target) of run 1 to target 1.",
      "t1r2": "Positional deviation (measured − target) of run 2 to target 1.",
      "t1r3": "Positional deviation (measured − target) of run 3 to target 1.",
      "t1r4": "Positional deviation (measured − target) of run 4 to target 1.",
      "t1r5": "Positional deviation (measured − target) of run 5 to target 1.",
      "t2r1": "Positional deviation (measured − target) of run 1 to target 2.",
      "t2r2": "Positional deviation (measured − target) of run 2 to target 2.",
      "t2r3": "Positional deviation (measured − target) of run 3 to target 2.",
      "t2r4": "Positional deviation (measured − target) of run 4 to target 2.",
      "t2r5": "Positional deviation (measured − target) of run 5 to target 2.",
      "t3r1": "Positional deviation (measured − target) of run 1 to target 3.",
      "t3r2": "Positional deviation (measured − target) of run 2 to target 3.",
      "t3r3": "Positional deviation (measured − target) of run 3 to target 3.",
      "t3r4": "Positional deviation (measured − target) of run 4 to target 3.",
      "t3r5": "Positional deviation (measured − target) of run 5 to target 3.",
      "t4r1": "Positional deviation (measured − target) of run 1 to target 4.",
      "t4r2": "Positional deviation (measured − target) of run 2 to target 4.",
      "t4r3": "Positional deviation (measured − target) of run 3 to target 4.",
      "t4r4": "Positional deviation (measured − target) of run 4 to target 4.",
      "t4r5": "Positional deviation (measured − target) of run 5 to target 4.",
      "req": "Accuracy the work requires, as a total spread."
    },
    "outputs": [
      "Mean deviation and sigma at each target",
      "Repeatability (±3σ) at the worst target",
      "Axis accuracy spread"
    ],
    "method": [
      "Mean positional deviation X̄ = Σ x ÷ n at each target.",
      "σ = √[Σ (x − X̄)² ÷ (n − 1)]; repeatability at a target is the ±3σ spread (6σ).",
      "Axis accuracy = max(X̄ + 3σ) − min(X̄ − 3σ) over all targets (handbook example: deviations −0.0002 to +0.0008 in. give X̄ = 0.0004 in. and 3σ = 0.0012 in.).",
      "Example: the default runs give an axis accuracy of 61.905 µm."
    ],
    "limitations": [
      "Unidirectional approach only; bidirectional tests add backlash and give larger spreads.",
      "Five runs per target is a small sample; standards specify the number of runs and targets.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Repeatability is usually about half the accuracy; compensation improves accuracy more than repeatability."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1319–1322. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "acme-tap-drill": {
    "purpose": "Minimum and maximum internal minor diameters, and the drill size range, for tapping general purpose (G) and centralizing (2C–4C and 5C–6C) Acme screw threads by the handbook formulas derived from ANSI/ASME B1.5, with an allowance for drill oversize.",
    "uses": [
      "Choose a drill before tapping an Acme thread",
      "Check a hole size on a drawing",
      "Allow for drill oversize in selection"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Basic major diameter of the Acme thread.",
      "tpi": "Threads per inch.",
      "cls": "Thread class (5C and 6C are not recommended for new designs).",
      "over": "Expected amount the drill cuts oversize (from experience with the drill and material)."
    },
    "outputs": [
      "Minimum and maximum hole diameter",
      "Drill size range allowing for oversize",
      "Values in millimetres"
    ],
    "method": [
      "Pitch p = 1 ÷ threads per inch.",
      "General purpose: minimum = D − p. Centralizing 2C–4C: minimum = D − 0.9 p. Centralizing 5C–6C: minimum = (D − 0.025 √D) − 0.9 p.",
      "Maximum = minimum + 0.05 p; choose a drill whose size plus oversize lies between the limits, close to the maximum.",
      "Example: ½-10 Acme 2G needs a hole between 0.4 and 0.405 in."
    ],
    "limitations": [
      "Inch Acme threads to ANSI/ASME B1.5; stub Acme threads differ.",
      "Actual drill oversize depends on the drill, its sharpening and the material.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Staying near the maximum limit reduces the material the tap must remove."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 944–947. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "milling-cutter-teeth": {
    "purpose": "Recommended number of milling cutter teeth by the handbook formulas: for face mills from cutter diameter and width of cut, for peripheral cutters from diameter, depth of cut and helix angle (both for two teeth in the cut, scalable to another number), and for high-speed milling from the power available, feed per tooth, speed, depth and width of cut.",
    "uses": [
      "Choose a coarse or fine pitch cutter for a job",
      "Avoid overloading the spindle with too many teeth",
      "Check that enough teeth are in the cut to avoid chatter"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Which handbook rule to apply.",
      "D": "Cutter diameter.",
      "W": "Width of cut (face milling and power rule).",
      "d": "Depth of cut (peripheral and power rule).",
      "helix": "Helix angle of a peripheral cutter.",
      "zc": "Number of teeth to have cutting at once (the formulas assume two).",
      "H": "Power available at the cutter.",
      "F": "Feed per tooth.",
      "n": "Cutter speed.",
      "mat": "Work material constant: removal rate per kilowatt (handbook values 0.65, 1.5 and 2.5 in³/min per hp, converted).",
      "K": "Your own removal rate per kilowatt for the material."
    },
    "outputs": [
      "Recommended number of teeth",
      "Basis of the recommendation",
      "Rounded tooth count"
    ],
    "method": [
      "Face mills: T = 6.3 D ÷ W (two teeth in the cut).",
      "Peripheral cutters: T = 12.6 D cos A ÷ (D + 4d) (two teeth in the cut).",
      "For another number of teeth in the cut, divide by 2 and multiply by that number.",
      "Power rule: T = K H ÷ (F N d W) (handbook example: 7.5 kW, 0.2032 mm, 272 rpm, 3.2 × 152.4 mm cut in alloy steel gives about 4 teeth).",
      "Example: a 152.4 mm face mill taking a 101.6 mm wide cut should have about 9.45 teeth (the handbook rounds this example to 10)."
    ],
    "limitations": [
      "Guidance only; chip space, chatter and insert geometry also govern.",
      "The power rule protects the motor; it does not check chip space.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fewer teeth suit long-chipping materials and heavy cuts; more teeth suit thin walls and short-chipping materials."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 808–809. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "angular-cutter-setting": {
    "purpose": "Dividing-head setting angle for cutting teeth in the conical face of an angular milling cutter or a taper reamer with a single-angle fluting cutter, from the number of teeth, the angle of the blank and the angle of the fluting cutter, including the case of a flat (0°) blank.",
    "uses": [
      "Set up to flute an angular cutter or countersink",
      "Cut teeth on a taper reamer blank",
      "Check a fluting set-up angle"
    ],
    "users": [
      "Toolmakers",
      "Machinists",
      "Cutter grinders"
    ],
    "inputs": {
      "Nt": "Number of teeth to be cut.",
      "B": "Angle of the blank in which the teeth are cut (0 for a flat face).",
      "C": "Angle of the single-angle fluting cutter."
    },
    "outputs": [
      "Dividing-head setting angle A",
      "Intermediate angles D and E",
      "Index angle between teeth"
    ],
    "method": [
      "tan D = cos(360° ÷ N) × cot B.",
      "sin E = tan(360° ÷ N) × cot C × sin D.",
      "Setting angle A = D − E; for a 0° blank this reduces to cos A = tan(360° ÷ N) × cot C.",
      "Handbook example: 9 teeth, 35° blank, 55° cutter → A = 21° 52′.",
      "Example: 9 teeth in a 35° blank with a 55° cutter need the head at 21° 52.2′."
    ],
    "limitations": [
      "Single-angle fluting cutters; check that the setting gives the land width wanted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Take a trial cut and check the land width before fluting all teeth."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 833–834. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
