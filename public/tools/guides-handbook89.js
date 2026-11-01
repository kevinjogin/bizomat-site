// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook89).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "grinding-wheel-life-plan": {
    "purpose": "Grinding data by the handbook’s machinability system: each material group has Taylor lines V × T^0.26 = C at four equivalent chip thicknesses (ECT), so the wheel speed for a desired wheel life is V = C ÷ T^0.26, the specific metal removal rate SMRR = 1000 × ECT × V mm³ per mm of wheel width per minute, and the work speed Vw = SMRR ÷ (1000 × radial depth). One shop result (wheel speed VU and wheel life TU at a known ECT) gives the user constant CU = VU × TU^0.26 and the ratio CU ÷ C that corrects the standard constant at the other chip thicknesses. Wheel and work rpm, side feed (fraction of wheel width), feed rate, removal rate and grinding time per pass with spark-out complete the plan, checked against the maximum speed marked on the wheel.",
    "uses": [
      "Choose a wheel speed for a wanted wheel life in production grinding",
      "Find the work speed and removal rate for roughing and finishing depths",
      "Calibrate the standard grinding data with one shop result"
    ],
    "users": [
      "Grinding machine setters",
      "Process engineers",
      "Production planners"
    ],
    "inputs": {
      "C": "Taylor constant C (the wheel speed for 1 minute wheel life) for the material group at the chosen ECT, from the handbook’s grinding data tables or your own data.",
      "ECT": "Equivalent chip thickness: the handbook tables use 0.00017, 0.00033, 0.00050 and 0.00075 mm for steels and cast iron, and smaller values for carbide and ceramics with diamond wheels.",
      "T": "Wheel life between dressings you want, in minutes of grinding.",
      "cal": "Whether to correct the standard constant with one result from your own grinding.",
      "VU": "Wheel speed used in your shop result.",
      "TU": "Wheel life obtained in your shop result.",
      "CshopStd": "Standard Taylor constant C from the table at the ECT of your shop result (the same as above when the ECT is the same).",
      "ar": "Radial depth of cut per pass; the handbook gives 0.01 to 0.025 mm for roughing and about 0.0025 mm for finishing.",
      "D": "Diameter of the grinding wheel.",
      "dw": "Diameter of the work in cylindrical grinding.",
      "width": "Width of the grinding wheel face.",
      "frac": "Side feed per work revolution as a fraction of the wheel width; the handbook lists about 1/2 to 3/4 for roughing and 1/4 to 3/8 for finishing.",
      "dist": "Length ground in one pass.",
      "tsp": "Spark-out time added to each pass.",
      "vmax": "Maximum operating speed marked on the wheel."
    },
    "outputs": [
      "Taylor constant used (standard or calibrated) and the calibration ratio",
      "Wheel speed for the wheel life wanted, and V10 and V100",
      "Specific metal removal rate SMRR and removal rate",
      "Work speed and work rpm",
      "Wheel rpm, side feed and feed rate",
      "Grinding time per pass"
    ],
    "method": [
      "Taylor line V × T^0.26 = C, so V = C ÷ T^0.26; V10 = C ÷ 10^0.26 and V100 = C ÷ 100^0.26.",
      "Shop calibration: CU = VU × TU^0.26; ratio = CU ÷ C(standard at the shop ECT); calibrated constant at the chosen ECT = C × ratio.",
      "SMRR = 1000 × ECT × V (mm³/mm/min); Vw = SMRR ÷ (1000 × ar) (m/min); ECT ≈ Vw × ar ÷ V.",
      "Wheel rpm = 1000 V ÷ (π D); work rpm = 1000 Vw ÷ (π dw); side feed fs = fraction × width; feed rate FR = fs × work rpm; MRR = SMRR × fs.",
      "Grinding time per pass = distance ÷ FR + spark-out time.",
      "Example: with C = 4690 at ECT 0.00033 mm, a 15 min wheel life needs 2,319.5 m/min wheel speed and gives SMRR 765.43 mm³/mm/min."
    ],
    "limitations": [
      "The Taylor slope n = 0.26 and the tabulated constants assume good system stiffness; calibrate with your own results.",
      "ECT below about 0.0001 mm may lie on the wrong side of the tool-life curve for steels.",
      "The wheel must never run above the speed marked on it, whatever the plan gives.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A longer wheel life needs a lower wheel speed and gives a lower removal rate at the same ECT.",
      "A calibration ratio below 1 means your conditions wear the wheel faster than the standard data."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1205–1214. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-tool-relief-angles": {
    "purpose": "Relief angles of single-point thread cutting tools by the handbook formulas: the helix angles of the thread at the minor diameter, tan ψ = lead ÷ (π K), and at the major diameter, tan φ = lead ÷ (π D); the side relief angles parallel to the thread axis a = ae + ψ at the leading edge and a′ = ae − φ at the trailing edge for an effective relief ae; the relief angles actually ground perpendicular to the side cutting edges, tan b = tan a cos(½ thread angle) and tan b′ = tan a′ cos(½ thread angle); and the nose angle where the flanks meet, tan n = (tan a − tan a′) ÷ (2 tan(½ thread angle)).",
    "uses": [
      "Grind a single-point tool for a coarse, multiple-start or high-helix thread",
      "Check that the trailing flank will not rub",
      "Set the angles on a tool and cutter grinder"
    ],
    "users": [
      "Toolroom machinists",
      "Lathe operators",
      "Tool grinders"
    ],
    "inputs": {
      "lead": "Axial advance per turn: the pitch for a single-start thread, pitch × starts for a multiple-start thread.",
      "Dmaj": "Major (outside) diameter of the thread.",
      "Kmin": "Minor (root) diameter of the thread.",
      "ang": "Included angle of the thread form: 60° for Unified and metric, 29° for Acme, 30° for metric trapezoidal.",
      "ae": "Effective relief angle wanted below every cutting edge, measured parallel to the thread axis; the handbook recommends 8 to 14° for high-speed steel and 5 to 10° for carbide."
    },
    "outputs": [
      "Helix angles at the minor and major diameters",
      "Side relief parallel to the axis at the leading and trailing edges",
      "Relief angles to grind perpendicular to the leading and trailing edges",
      "Nose angle where the flanks meet"
    ],
    "method": [
      "tan ψ = lead ÷ (π K) (helix angle at the minor diameter); tan φ = lead ÷ (π D) (at the major diameter).",
      "Leading edge: a = ae + ψ; trailing edge: a′ = ae − φ (parallel to the thread axis).",
      "Ground relief perpendicular to the edges: tan b = tan a cos(½ thread angle); tan b′ = tan a′ cos(½ thread angle).",
      "Nose angle: tan n = (tan a − tan a′) ÷ (2 tan(½ thread angle)).",
      "Example: a 10.16 mm lead on 25.4 mm major and 19.812 mm minor diameters with 10° effective relief needs 18.7° below the leading edge and 2.6566° below the trailing edge."
    ],
    "limitations": [
      "For right- or left-hand threads the leading edge is the one facing the direction of tool travel.",
      "The effective relief at the nose is ae; grind it without further correction.",
      "The nose angle is the angle of a sharp point; the actual nose carries the flat or radius of the thread form.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the trailing relief comes out small or negative, the trailing flank rubs: increase the effective relief or reduce the trailing-side helix effect with a smaller lead per pass.",
      "High helix (multiple-start or coarse) threads need much more leading relief than standard threads."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2040–2041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "milling-chip-thickness-ect": {
    "purpose": "Chip geometry in milling by the handbook: the angle of engagement AE from cos AE = 1 − 2(ar/D) for end and side milling, or cos AE = 1 − 2(ar/D)² for face milling with the cutter centred on the work; the mean chip thickness over the arc of engagement, hm = fz (1 − cos AE) ÷ AE (end milling) or fz × 2 sin(½AE) ÷ AE (centred face milling), which reproduces the handbook Table 2a; the equivalent chip thickness ECT = fz × z ÷ π × (ar ÷ D) × aa ÷ CEL; the feed per tooth needed for a target mean chip thickness, and its ratio to the feed at the reference engagement (full slot for end milling, ar/D = 0.74 for face milling); with a check against the minimum chip thickness you set.",
    "uses": [
      "Raise the feed per tooth for light radial cuts so the cutter cuts instead of rubbing",
      "Compare end and face milling set-ups by chip thickness",
      "Find the ECT to use with tool-life data"
    ],
    "users": [
      "CNC programmers",
      "Machinists",
      "Process engineers"
    ],
    "inputs": {
      "mode": "End or side milling with the cutter at the edge of the cut, or face milling with the cutter centred on the work (eccentricity near zero).",
      "D": "Diameter of the milling cutter.",
      "ar": "Radial depth (width) of cut; equal to the cutter diameter for a full slot.",
      "z": "Number of teeth (inserts) on the cutter.",
      "fz": "Feed per tooth now used or planned.",
      "aaCEL": "Ratio of axial depth of cut to cutting edge length; the handbook uses about 0.95 for a square shoulder (90°) cutter.",
      "hTarget": "Mean chip thickness you want; the handbook’s reference is 0.108 mm (full slot end milling at 0.17 mm per tooth).",
      "hMin": "Smallest mean chip thickness you accept; the handbook gives about 0.02 to 0.04 mm as the practical minimum.",
      "n": "Spindle speed, for the feed rate at the feed per tooth found."
    },
    "outputs": [
      "Angle of engagement AE",
      "Mean chip thickness hm and hm ÷ fz",
      "Equivalent chip thickness ECT",
      "Feed per tooth for the chip thickness wanted, and its ratio to the reference feed",
      "Feed rate at that feed"
    ],
    "method": [
      "End or side milling: cos AE = 1 − 2 (ar/D); hm = fz (1 − cos AE) ÷ AE (AE in radians) = 2 fz (ar/D) ÷ AE.",
      "Face milling, centred: cos AE = 1 − 2 (ar/D)²; hm = fz × 2 sin(½AE) ÷ AE.",
      "ECT = fz × z ÷ π × (ar/D) × aa/CEL; equivalently ECT = hm (z/2)(AE/180°) for end milling.",
      "Feed for the target: fz = hm(target) ÷ (hm/fz); ratio to the reference feed fz/fz0 = (hm/fz at the reference) ÷ (hm/fz), reference ar/D = 1 for end milling and 0.7355 for face milling.",
      "Example: 3.125 mm wide on a 25 mm cutter gives AE 41.41° and hm 0.034591 mm at 0.1 mm/tooth; 0.31222 mm/tooth gives 0.108 mm."
    ],
    "limitations": [
      "The tabulated relations assume no run-out and evenly sharpened teeth; run-out thins the chip on some teeth.",
      "Raising the feed per tooth for a light cut raises the chip load at the cutter entry; check the cutter maker’s maximum feed.",
      "Face milling relations are for the cutter centred on the work; off-centre face milling behaves like end milling.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Below about ar/D = 0.5 in end milling the chip thins quickly: the feed per tooth must rise to keep the same chip thickness.",
      "ECT is proportional to the number of teeth, while hm is not."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1162–1166. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
