// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook84).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "compound-indexing": {
    "purpose": "Indexing movements for a plain dividing head with Brown & Sharpe plates 1–3 or the two-sided Cincinnati standard plate, by the method the handbook describes: simple indexing when a hole circle divides the crank turns exactly, compound indexing (two movements on two circles of the same plate, added or subtracted) when that is exact, and otherwise approximate compound movements that fill in the divisions over several workpiece revolutions. Each movement is given with the precise number of divisions it produces, the handbook’s measure of closeness (the diameter at which the error equals 0.001) and the error at your workpiece diameter against the error you accept. A movement taken from an indexing table can be checked the same way.",
    "uses": [
      "Index a prime or awkward number of divisions without differential change gears",
      "Choose between approximate movements by the error they leave at the workpiece",
      "Check a movement taken from an indexing table before cutting"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Gear cutters"
    ],
    "inputs": {
      "mode": "Search for the best movements for the number of divisions, or check one movement read from an indexing table.",
      "N": "Number of equally spaced divisions (teeth, flutes, holes) wanted around the work.",
      "ratio": "Crank turns for one turn of the spindle; 40 for most plain dividing heads.",
      "plates": "The standard index plates available: Brown & Sharpe plates 1–3 (six circles each) or the Cincinnati standard plate (eleven circles on each side). Compound movements use two circles of the same plate or side.",
      "Rmax": "Approximate movements fill in the divisions over several revolutions of the work; more revolutions give closer approximations but longer, more error-prone indexing.",
      "dia": "Diameter at which the position error matters, normally the pitch diameter of a gear or the diameter of the feature being divided.",
      "tol": "Largest position error at that diameter you accept from an approximate movement.",
      "w": "Whole turns of the crank in each indexing movement.",
      "a": "Holes moved on the first (crank pin) circle.",
      "A": "Number of holes in the first circle.",
      "sign": "Whether the second movement is in the same direction (added) or the opposite direction (subtracted).",
      "b": "Holes moved on the second (stationary pin) circle, moving plate and crank together.",
      "B": "Number of holes in the second circle.",
      "R": "Revolutions the work makes before all divisions are cut, as listed beside the movement in the table."
    },
    "outputs": [
      "Simple indexing movement when one is exact",
      "Exact compound movement when one exists",
      "Best approximate movement for each number of workpiece revolutions",
      "Precise number of divisions of each movement",
      "Diameter at which the error equals 0.001",
      "Position error at your workpiece diameter"
    ],
    "method": [
      "Crank movement per division for an exact result = worm ratio × R ÷ N, where R is the number of workpiece revolutions (1 for exact movements).",
      "Simple indexing is exact when worm ratio × circle ÷ N is a whole number of holes; the circle with the fewest holes to count is preferred.",
      "A compound movement is w + a ÷ A ± b ÷ B crank turns, with A and B two circles of the same plate; the movement for each circle pair is searched hole by hole.",
      "Precise number of divisions N′ = worm ratio × R ÷ (w + a ÷ A ± b ÷ B); R must have no factor in common with N so the later revolutions fill the spaces left by the earlier ones.",
      "Diameter at which the error equals 0.001 = 0.001 N ÷ (π |N − N′|), which reproduces the handbook table; error at a diameter d = (d ÷ that diameter) × 0.001 = π d |N − N′| ÷ N.",
      "Example: 127 divisions with a 40:1 head has no exact movement on the Brown & Sharpe plates; the handbook’s movement 42/47 + 2/39 over 3 revolutions gives 127 divisions and an error of 0.0058642 mm at 200 mm."
    ],
    "limitations": [
      "Compound indexing needs an index plate able to turn on the worm shaft and a stationary pin on the head frame; the second movement turns crank and plate together.",
      "In negative compounding take up the worm backlash by backing off a few holes before each movement.",
      "Only the standard plates are searched; the Cincinnati high-number plates and differential indexing (the differential indexing tool) are other ways to reach divisions simple indexing cannot.",
      "The error measure is the handbook’s; it describes how far the last division misses after the full set of movements.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Prefer simple indexing, then an exact compound movement, then the approximation with the fewest workpiece revolutions that meets your accuracy: every extra revolution adds movements and chances of a miscount.",
      "For an approximate movement, the error grows in proportion to the diameter: a movement good enough for a small gear can be too coarse for a large one."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2079–2086. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "unified-thread-gauge-limits": {
    "purpose": "Nominal sizes and limits of the American National Standard gauges for Unified inch screw threads by the formulas of ANSI/ASME B1.2 Table 5 that the handbook gives: GO and NOT GO (LO) thread ring gauges and plain major diameter gauges for external threads, GO and NOT GO (HI) thread plug gauges and plain minor diameter gauges for internal threads, full-form and truncated setting plugs with the 0.001 in crest-width rule, and solid thread-setting rings for snap and indicating gauges. The product limits and the gauge tolerances (from Table 4 for W and X gauges, and your plain gauge standard) are entered, and each gauge is listed with the side its tolerance is applied to, in inches and millimetres.",
    "uses": [
      "Specify the thread gauges to order for a Unified thread",
      "Check a gauge maker’s quoted sizes against the standard formulas",
      "See how much of the product tolerance the gauge tolerances use"
    ],
    "users": [
      "Quality inspectors",
      "Gauge makers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "n": "Threads per inch of the Unified thread; the pitch is p = 1 ÷ n.",
      "eMaj": "Maximum major diameter of the external thread, from the thread limits table for the size and class.",
      "eMajMin": "Minimum major diameter of the external thread.",
      "ePDmax": "Maximum pitch diameter of the external thread.",
      "ePDmin": "Minimum pitch diameter of the external thread.",
      "iMaj": "Minimum major diameter of the internal thread (equal to the basic major diameter).",
      "iPDmin": "Minimum pitch diameter of the internal thread.",
      "iPDmax": "Maximum pitch diameter of the internal thread.",
      "iMinMin": "Minimum minor diameter of the internal thread.",
      "iMinMax": "Maximum minor diameter of the internal thread.",
      "xPD": "Pitch diameter tolerance of the working thread gauges, from Table 4 for the gauge class (X gauges are normal for working gauges) and the thread size.",
      "xMaj": "Tolerance on the major and minor diameters of the thread gauges, from Table 4.",
      "wPD": "W gauge tolerance on pitch diameter from Table 4, used for setting plugs and rings.",
      "wMaj": "W gauge tolerance on major and minor diameters from Table 4.",
      "plain": "Tolerance of the plain plug, ring or snap gauges for the major and minor diameters, from the gauge-maker’s tolerance class you specify."
    },
    "outputs": [
      "Sharp-V height H and the setting plug truncation",
      "GO and NOT GO thread ring sizes for the external thread",
      "GO and NOT GO thread plug sizes for the internal thread",
      "Plain major and minor diameter gauge sizes",
      "Setting plug and setting ring sizes, with the 0.001 in crest-width rule",
      "Each gauge with its tolerance direction and limits in inches and millimetres"
    ],
    "method": [
      "p = 1 ÷ n; H = 0.866025 p, the height of the sharp V.",
      "Thread gauges for external threads: GO PD = max PD (minus); GO minor = max PD − H ÷ 2 (minus); NOT GO PD = min PD (plus); NOT GO minor = min PD − H ÷ 4 (plus). Plain major: GO = max major (minus), NOT GO = min major (plus).",
      "Thread gauges for internal threads: GO major = min major (plus); GO PD = min PD (plus); NOT GO major = max PD + H ÷ 2 (minus); NOT GO PD = max PD (minus). Plain minor: GO = min minor (plus), NOT GO = max minor (minus).",
      "Setting plugs: GO major, truncated = max major − (0.060 ∛p² + 0.017 p) (minus); GO major, full = max major (plus); GO PD = max PD (minus); NOT GO major, truncated = min PD + H ÷ 2 (minus); NOT GO PD = min PD (plus).",
      "NOT GO setting plug major, full portion = max major (W plus), unless the crest would then be narrower than 0.001 in: then max major + 0.216506 p − (PD tolerance + 0.0017) (W minus).",
      "Setting rings: GO PD = min PD of the internal thread (plus); GO minor = min minor (minus); NOT GO PD = max PD (minus); NOT GO minor = max minor (minus).",
      "Example: for 1/4-20 UNC-2A/2B the GO thread ring has a minor diameter of 0.19475 in, the NOT GO (HI) plug a major diameter of 0.24405 in and the truncated GO setting plug 0.23991 in."
    ],
    "limitations": [
      "The formulas are ANSI/ASME B1.2-1983 Table 5 as the handbook gives them; lead and half-angle tolerances of the gauges (Table 4) are not calculated here.",
      "Enter the product limits from the Unified thread tables for the size, series and class, and the gauge tolerances from Table 4 for the threads per inch and diameter.",
      "The truncated setting plug portion is needed only when the optional sharp root profile is used.",
      "Tolerances greater than W on the setting ring pitch diameter are acceptable when the indicating or snap gauge can take them and supplier and user agree.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Every gauge tolerance points into the product tolerance: GO gauges are made smaller (rings) or larger (plugs) only towards the NOT GO side, so a part a gauge accepts is always within its limits.",
      "When the gauge tolerances take a large share of the product pitch diameter tolerance, good parts near the limits will be rejected; finer gauges or indicating gauges leave more of the tolerance for manufacture."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2013–2014, 1808. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "forging-hammer-efficiency": {
    "purpose": "Work done by one blow of a forging hammer from the Heim test the handbook describes: a pure lead cylinder 1.5 times as high as its diameter is struck, and the work follows from its diameter and the relative reduction in height by the empirical formula Work = 36.75 D³ [8.85 A + 13.12 (A² + A⁴)] foot-pounds (D in inches). The tool converts your millimetre measurements, gives the work per blow in joules and foot-pounds, the useful power at the blows per minute, and the efficiency against the power supplied to the hammer.",
    "uses": [
      "Test whether a forging hammer still delivers the energy it should",
      "Compare hammers by the useful work each delivers",
      "Find the efficiency of a hammer from the power it draws"
    ],
    "users": [
      "Forge supervisors",
      "Maintenance engineers",
      "Plant engineers"
    ],
    "inputs": {
      "D": "Diameter of the pure lead test cylinder; the handbook’s Table 5 gives the size used for each falling weight of hammer.",
      "H0": "Original height of the cylinder; the method uses cylinders 1.5 times as high as their diameter.",
      "H1": "Height of the cylinder after one blow of the hammer.",
      "bpm": "Blows per minute with the hammer running continuously (steam hammers must be tested running, not on a single blow).",
      "Pin": "Power supplied to the hammer while it runs at that rate, measured at the motor or from the steam or air supply."
    },
    "outputs": [
      "Relative reduction in height A",
      "Factor B = 8.85 A + 13.12 (A² + A⁴)",
      "Work per blow in foot-pounds and joules",
      "Useful power at the blow rate",
      "Efficiency against the power supplied"
    ],
    "method": [
      "A = (H − H₁) ÷ H, the reduction in height as a fraction of the original height.",
      "B = 8.85 A + 13.12 (A² + A⁴), the bracketed factor of the Heim formula (tabulated by the handbook as Table 6 for A = 0.10 to 0.60).",
      "Work per blow = 36.75 D³ B foot-pounds with D in inches (D = mm ÷ 25.4); 1 ft·lb = 1.3558 J.",
      "Useful power = work per blow × blows per minute ÷ 60.",
      "Efficiency = useful power ÷ power supplied.",
      "Example: a 50 mm lead cylinder shortened from 75 to 48 mm (A = 0.36) shows 1,940.9 J per blow; at 180 blows per minute that is 5.8228 kW, 75.818 % of the 7.68 kW supplied."
    ],
    "limitations": [
      "The formula is empirical (Heim), found with pure lead cylinders 1.5 times as high as their diameter; other proportions or impure lead change the result.",
      "Table 6 covers A from 0.10 to 0.60; outside that range the formula is extrapolated.",
      "The test measures the work done on the lead in one blow; it does not give the force of the blow or the energy absorbed by the anvil and foundation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pick the lead cylinder size for the hammer’s falling weight so the reduction falls inside the tabulated range.",
      "A fall in efficiency over time points to losses in the drive, guides, valves or packing; repeat the test under the same conditions to compare."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3234–3236. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-gauge-pressure-for-work": {
    "purpose": "Hydraulic press capacity and pressure on the work by the rules the handbook gives: the press force is the gauge pressure on the ram area (C = 0.00039 D² P tons in the inch form, 0.7854 D² P in pounds), the pressure on the material is the press force divided by the area being pressed, and the gauge pressure for a required pressure on the material is that pressure times the area of the work divided by 0.7854 times the square of the ram diameter. In SI units with force in kilonewtons and tonnes-force, checked against the most pressure the press system may run at.",
    "uses": [
      "Set the press gauge for a pressing, coining or compacting pressure",
      "Find whether a press can reach the pressure a job needs on its area",
      "Convert a gauge reading into the force and pressure on the work"
    ],
    "users": [
      "Press operators",
      "Tooling engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the press ram (piston) on which the oil pressure acts.",
      "P": "Gauge pressure you set or read on the press.",
      "Pmax": "Most gauge pressure the press, its pump and relief valve may run at, from the press rating plate.",
      "A": "Area of the material actually being pressed, measured in the pressing direction.",
      "Pa": "Pressure the process needs on the material, from your process data (coining, compacting or bonding pressure)."
    },
    "outputs": [
      "Ram area",
      "Press force at the gauge pressure set",
      "Press capacity at the most pressure allowed",
      "Pressure on the work at the gauge pressure set",
      "Gauge pressure needed for the pressure wanted on the work"
    ],
    "method": [
      "Ram area = 0.7854 D².",
      "Press force C = gauge pressure × ram area (handbook inch form: C = 0.00039 D² P short tons).",
      "Pressure on the material Pa = press force ÷ area of the work (handbook: Pa = 2000 C ÷ A).",
      "Gauge pressure for a pressure on the work P = A × Pa ÷ (0.7854 D²).",
      "1 tonne-force = 9.80665 kN; 1 short ton-force = 8.8964 kN.",
      "Example: a 250 mm ram at 200 bar gives 981.75 kN (100.11 tf), 49.087 MPa on 20000 mm²; 40 MPa on the work needs 162.97 bar."
    ],
    "limitations": [
      "The force is the ideal hydraulic force on the ram; seal friction, a return spring or the weight of the platen change it slightly.",
      "The pressure on the work is an average over the area; the local pressure varies with the shape of the tooling.",
      "The gauge must read the pressure at the cylinder; long lines or a restrictive valve can make it read differently while the press moves.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pressure on the work rises with the square of the ram diameter and falls with the area being pressed: a press that coins a small part easily may not reach the pressure on a larger one.",
      "Set the relief valve no higher than the most pressure the press may run at, and keep the working gauge pressure below it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3224. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pm-dc-motor-constants": {
    "purpose": "Derived parameters of a permanent-magnet DC control motor by the definitions the handbook gives for its idealised straight-line torque–speed characteristic: stall current V ÷ R, torque constant K_T = T_STo ÷ I_STo, voltage constant K_E = V ÷ ω_NL, motor constant K_M = K_T ÷ √R, damping D_M = T_STo ÷ ω_NL and mechanical time constant T_M = J_M ÷ D_M, with the torque at the amplifier current limit and at rated current, the speeds at those torques on the characteristic, the time constant with the load inertia, and the torsional resonance f_n = √(K ÷ J_L) ÷ 2π compared with the control bandwidth.",
    "uses": [
      "Work out the constants a motor data sheet does not list",
      "Check the torque a current limit leaves for acceleration",
      "Check whether the drive’s torsional resonance falls in the control bandwidth"
    ],
    "users": [
      "Controls engineers",
      "Machine designers",
      "Automation technicians"
    ],
    "inputs": {
      "V": "Rated voltage of the motor, from its data sheet.",
      "R": "Resistance of the armature winding, terminal to terminal, at the working temperature.",
      "Tst": "Torque at stall with no current limiting, T_STo, the top of the straight-line characteristic.",
      "NL": "Speed at no load, ω_NL, the end of the straight-line characteristic.",
      "JM": "Rotor inertia of the motor, J_M.",
      "IL": "Current limit I_L set in the amplifier; it caps the motor torque.",
      "IR": "Rated current I_R the motor may carry continuously.",
      "JL": "Inertia of the load referred to the motor shaft (load inertia divided by the square of any gear ratio).",
      "K": "Torsional stiffness of the shafts and coupling between motor and load.",
      "bw": "Bandwidth of the closed-loop control system."
    },
    "outputs": [
      "Stall current I_STo = V ÷ R",
      "Torque constant K_T and voltage constant K_E",
      "Motor constant K_M = K_T ÷ √R",
      "Motor damping D_M and mechanical time constant T_M",
      "Torque and speed at the current limit and at rated current",
      "Time constant with the load and torsional resonance against the bandwidth"
    ],
    "method": [
      "ω_NL = no-load speed × 2π ÷ 60 rad/s; I_STo = V ÷ R.",
      "K_T = T_STo ÷ I_STo (N·m/A); K_E = V ÷ ω_NL (V·s/rad); K_M = K_T ÷ √R.",
      "D_M = T_STo ÷ ω_NL (N·m·s/rad); T_M = J_M ÷ D_M seconds, and (J_M + J_L) ÷ D_M with the load.",
      "Torque at a current I = K_T × I (the torque limit T_L at I_L, never above T_STo; T_R at I_R); speed on the straight-line characteristic ω = ω_NL (1 − T ÷ T_STo).",
      "Peak acceleration at the torque limit = T_L ÷ (J_M + J_L); torsional resonance f_n = √(K ÷ J_L) ÷ 2π Hz.",
      "Example: a 48 V motor with 1.2 Ω and 4 N·m stall torque has K_T = 0.1 N·m/A and a time constant of 14.388 ms; with the load the torsional resonance is 355.88 Hz against a 40 Hz bandwidth."
    ],
    "limitations": [
      "The handbook’s characteristic is idealised as a straight line from stall torque to no-load speed; real motors depart from it near stall and at high temperature.",
      "Peak torque may be limited by demagnetisation in motors without rare-earth magnets; check the maker’s peak torque before using the current limit.",
      "Duty-cycle and thermal checks (the rated current over the cycle) are not covered.",
      "The resonance treats the motor as fixed and the load as one inertia on one stiffness; several modes need a fuller model.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The current limit, not the stall torque, sets the torque available to accelerate the load.",
      "If the torsional resonance lies inside the control bandwidth, self-sustained oscillation is likely: stiffen the drive, reduce the load inertia or filter the loop (a notch at the resonance)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3413–3414. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "silent-chain-sprocket-tooth-form": {
    "purpose": "Tooth form and cutting dimensions of an ANSI B29.2M silent chain sprocket by the formulas the handbook gives: for 3/8 in and larger pitch the diameter to the centre of the topping curve E = P (cot(180°/N) − 0.22) and the diameter to the base of the working face B = P √(1.515213 + (cot(180°/N) − 1.1)²) of the 60° form, the angle between the faces of a tooth 60° − 720°/N (70° − 720°/N for 3/16 in pitch), the maximum hub diameter P (cot(180°/N) − 1.33) for hobbed and − 1.25 for straddle-cut teeth, the hob generating diameter and the 0.6875 P maximum depth of cut, with the pitch diameter, checked against the handbook’s tooth-count advice and your hub size.",
    "uses": [
      "Draw the tooth form of a silent chain sprocket",
      "Check that a sprocket hub clears the chain guides",
      "Find the hob generating diameter and depth of cut for cutting the teeth"
    ],
    "users": [
      "Machine designers",
      "Gear and sprocket cutters",
      "Maintenance engineers"
    ],
    "inputs": {
      "size": "ANSI silent chain of 3/8 in pitch and larger has a 60° tooth form; 3/16 in pitch chain has a 70° form.",
      "P": "Chain pitch; 3/8 in = 9.525 mm, 1/2 in = 12.7 mm, 1 in = 25.4 mm, 3/16 in = 4.7625 mm.",
      "Nt": "Number of teeth on the sprocket.",
      "cut": "Whether the teeth are hobbed or cut with a straddle cutter; the hub clearance differs.",
      "hub": "Outside diameter of the sprocket hub you intend to use."
    },
    "outputs": [
      "Pitch diameter",
      "Diameter to the centre of the topping curve E (3/8 in and larger)",
      "Diameter to the base of the working face B (3/8 in and larger)",
      "Angle between the tooth faces",
      "Maximum hub diameter for hobbed or straddle-cut teeth",
      "Hob generating diameter and maximum depth of cut (3/8 in and larger)"
    ],
    "method": [
      "Pitch diameter = P ÷ sin(180°/N).",
      "E = P (cot(180°/N) − 0.22); B = P √(1.515213 + (cot(180°/N) − 1.1)²) — Table 7a, 3/8 in and larger pitch.",
      "Angle between the faces of a tooth = 60° − 720°/N for 3/8 in and larger, 70° − 720°/N for 3/16 in; each face is at half that to the tooth centre line.",
      "Maximum hub diameter = P (cot(180°/N) − 1.33) for hobbed teeth and P (cot(180°/N) − 1.25) for straddle-cut teeth.",
      "Hob generating diameter HGD = P √(1 ÷ sin²(180°/N) + 0.5625 − 1.5 sin(30° − 180°/N) ÷ sin(180°/N)); maximum depth of cut 0.6875 P — Table 9.",
      "Example: a 21-tooth sprocket for 25.4 mm pitch chain has a pitch diameter of 170.42 mm, faces 25.714° apart and a maximum hub of 134.74 mm for hobbed teeth."
    ],
    "limitations": [
      "Formulas are those of ANSI B29.2M-1982 (R1987) as given in the handbook; the E, B and hob formulas are for 3/8 in and larger pitch only.",
      "Hub diameters for other methods of cutting may differ from these values.",
      "Chain widths, sprocket face dimensions and recommended bores are table values; take them from the standard or the chain maker.",
      "The over-pin measurement and outside diameter are in the silent chain sprocket tool.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The angle between the tooth faces shrinks as teeth are removed: at 12 teeth (3/8 in and larger) the faces are parallel and fewer teeth would be undercut.",
      "The handbook advises 21 or more teeth for best results and never fewer than 17."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3468–3473. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "helical-gear-helix-for-centre-distance": {
    "purpose": "Helix angle of a parallel-shaft helical gear pair chosen to fit a given centre distance, by the relation the handbook gives for normal diametral pitch (cos ψ = (N₁ + N₂) ÷ (2 P_n C)), in metric form cos ψ = m_n (z₁ + z₂) ÷ (2 a), with the leads L = π z m_n ÷ sin ψ, the transverse module and pitch diameters that add up to twice the centre distance, and the helix angle at the outside diameter from tan ψ = 2π R ÷ L, checked against the range of helix angles you accept.",
    "uses": [
      "Fit a helical gear pair to an existing centre distance",
      "Find the leads for setting up a milling machine or hobber",
      "Check the helix angle against what the cutter or thrust bearings allow"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Gearbox repairers"
    ],
    "inputs": {
      "mn": "Normal module of the cutter or hob (25.4 ÷ normal diametral pitch).",
      "z1": "Number of teeth on the pinion.",
      "z2": "Number of teeth on the gear.",
      "C": "Centre distance the pair must fit, measured between the shaft axes.",
      "psiMin": "Smallest helix angle your design accepts, for example to keep enough overlap.",
      "psiMax": "Largest helix angle your design accepts, for example from the thrust the bearings take or the cutter set-up."
    },
    "outputs": [
      "Helix angle that fits the centre distance",
      "Transverse module and pitch diameters",
      "Lead of the pinion and of the gear",
      "Helix angle at the outside diameters",
      "Check against the accepted range"
    ],
    "method": [
      "cos ψ = m_n (z₁ + z₂) ÷ (2 C) — the handbook’s cos ψ = (N₁ + N₂) ÷ (2 P_n C) with P_n = 25.4 ÷ m_n.",
      "Transverse module m_t = m_n ÷ cos ψ; pitch diameters d = z m_t (they add up to 2C).",
      "Leads L₁ = π z₁ m_n ÷ sin ψ and L₂ = π z₂ m_n ÷ sin ψ (= 2π R ÷ tan ψ).",
      "Helix angle at the outside diameter tan ψ_a = π d_a ÷ L, with d_a = d + 2 m_n for a standard addendum.",
      "Example: 18 and 30 teeth of 4 mm normal module on 110 mm centres need a helix angle of 29.223°; the leads are 463.32 mm and 772.19 mm."
    ],
    "limitations": [
      "Standard (unshifted) teeth are assumed; profile shift is another way to fit a centre distance and is in the profile shift tool.",
      "The outside diameters assume a standard addendum equal to the normal module.",
      "The two gears of a parallel-shaft pair have the same helix angle and opposite hands.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A centre distance only slightly larger than the spur centre distance gives a small helix angle with little overlap; a much larger one gives a steep helix and high end thrust.",
      "Set the milling machine table to the helix angle and the lead from the change gears; the helix angle at the outside diameter is larger than at the pitch diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2078. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
