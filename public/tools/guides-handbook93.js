// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook93).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "spur-gear-profile-checker": {
    "purpose": "Every significant diameter of a spur gear pair at standard centre distance by the handbook’s three-step and two-step formulas: contact diameter (cos A = N cos φ ÷ Do P, tan b = tan φ − (N ÷ n)(tan A − tan φ), dc = n cos φ ÷ P cos b), contact ratio by three formulas, lowest point of single tooth contact (tan c = tan a − 2π ÷ n), highest point (tan d = tan b + 2π ÷ n), the maximum hob tip radius rc = (0.785398 cos φ − b sin φ) ÷ (1 − sin φ), the undercut limit (b − rc) ÷ sin φ + rc ≤ 0.5 n sin φ, the true involute form diameter tan e = tan φ − (4 ÷ n)[(b − rc) ÷ sin 2φ + rc ÷ 2 cos φ], the base radius and the roll angle at each point (tan × 57.2958) for the involute checker.",
    "uses": [
      "Set an involute profile checker to the significant points of a spur gear",
      "Check that the true involute form diameter lies below the contact diameter",
      "Check a hob tip radius and whether the teeth will be undercut"
    ],
    "users": [
      "Gear inspectors",
      "Machinists and gear cutters",
      "Gear designers"
    ],
    "inputs": {
      "m": "Module of both gears; for a diametral pitch P it is 25.4 ÷ P.",
      "phi": "Pressure angle of the gears and the hob.",
      "n": "Number of teeth in the pinion.",
      "dO": "Outside diameter of the pinion as made.",
      "Nt": "Number of teeth in the mating gear.",
      "DO": "Outside diameter of the gear as made.",
      "b": "Dedendum constant of the tooth system: 1.25 when the dedendum is 1.25 ÷ P.",
      "rc": "Tip radius of the hob or rack as a constant times the module: 0.30 when the radius is 0.30 ÷ P.",
      "mfMin": "Least contact ratio you accept for the drive."
    },
    "outputs": [
      "Contact diameter on each gear",
      "Contact ratio by three formulas",
      "Lowest and highest points of single tooth contact",
      "True involute form diameter on each gear",
      "Maximum hob tip radius and the undercut limit",
      "Base radius and roll angles for the involute checker"
    ],
    "method": [
      "cos A = N m cos φ ÷ Do; tan b = tan φ − (N ÷ n)(tan A − tan φ); dc = n m cos φ ÷ cos b; the same with the gears swapped gives a, B and Dc.",
      "mf = N (tan A − tan B) ÷ 2π = n (tan a − tan b) ÷ 2π = (√(Ro² − Rb²) + √(ro² − rb²) − C sin φ) ÷ (π m cos φ).",
      "LPSTC: tan c = tan a − 2π ÷ n, tan C = tan A − 2π ÷ N; HPSTC: tan d = tan b + 2π ÷ n, tan D = tan B + 2π ÷ N; diameter z m cos φ ÷ cos of the angle.",
      "rc (max) = (0.785398 cos φ − b sin φ) ÷ (1 − sin φ); no undercut when (b − rc) ÷ sin φ + rc ≤ 0.5 z sin φ.",
      "tan e = tan φ − (4 ÷ z)[(b − rc) ÷ sin 2φ + rc ÷ (2 cos φ)]; dTIF = z m cos φ ÷ cos e.",
      "Base radius z m cos φ ÷ 2; roll angle at each point = its tangent × 57.2958°.",
      "Example: the pinion’s TIF diameter is 55.069 mm below its contact diameter of 55.411 mm, and the contact ratio is 1.6262."
    ],
    "limitations": [
      "The contact formulas assume the gears run at the standard centre distance (n + N) m ÷ 2.",
      "The undercut and TIF formulas apply only to standard gears hobbed with the hob rolling on the gear’s pitch diameter.",
      "Profile tolerances on the checker chart come from the gear’s quality class, not from these settings.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The TIF diameter must be smaller than the contact diameter, or the mating tip runs into the fillet.",
      "Roll angles increase from TIF to outside diameter; set the checker’s base radius first."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2155–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spur-gears-for-given-centre-distance": {
    "purpose": "Spur gears of standard diametral pitch P and pressure angle φ redesigned to run at a specified centre distance C1 by the handbook procedure: operating pitch P1 = (NP + NG) ÷ 2 C1, operating pressure angle φ1 = arccos (P1 cos φ ÷ P), operating pitch and base diameters, basic tooth thickness 1.5708 ÷ P1 at the operating pitch circle, tooth thicknesses at the standard pitch circle t = (N ÷ P)(1.5708 ÷ N + inv φ1 − inv φ), dedendums b1 = bc − (t − 1.5708 ÷ P) ÷ 2 tan φ for a hob of addendum bc, root diameters N ÷ P − 2 b1 and outside diameters 2 C1 − (mating root diameter) − 2 (bc − 1 ÷ P).",
    "uses": [
      "Design a spur gear pair for a centre distance no standard pitch fits",
      "Find the tooth thicknesses and blank diameters to cut with a standard hob",
      "Check the operating pressure angle stays in a sensible range"
    ],
    "users": [
      "Gear designers",
      "Machinists and gear cutters",
      "Students"
    ],
    "inputs": {
      "m": "Module of the hob or cutter; for a diametral pitch P it is 25.4 ÷ P.",
      "phi": "Pressure angle of the hob or cutter.",
      "Np": "Number of teeth in the pinion.",
      "Ng": "Number of teeth in the gear.",
      "C1": "Centre distance the gears must run at.",
      "bc": "Addendum of the hob or cutter, measured from its pitch line to its tip.",
      "phiMin": "Smallest operating pressure angle you accept; the handbook suggests about 18°.",
      "phiMax": "Largest operating pressure angle you accept; the handbook suggests about 25°."
    },
    "outputs": [
      "Operating module (pitch) and pressure angle",
      "Operating pitch and base diameters",
      "Basic tooth thickness at the operating pitch circle",
      "Tooth thicknesses at the standard pitch circle",
      "Dedendums, root diameters and outside diameters to cut"
    ],
    "method": [
      "Operating module m1 = 2 C1 ÷ (NP + NG) (P1 = (NP + NG) ÷ 2 C1); cos φ1 = m cos φ ÷ m1.",
      "DP1 = NP m1, DG1 = NG m1; base diameters × cos φ1; t1 = π m1 ÷ 2.",
      "tP = NP m (π ÷ 2 NP + inv φ1 − inv φ) and the same for the gear, with inv x = tan x − x.",
      "bP1 = bc − (tP − π m ÷ 2) ÷ (2 tan φ); root diameter DPR1 = NP m − 2 bP1; the same for the gear.",
      "DPO = 2 C1 − DGR1 − 2 (bc − m); DGO = 2 C1 − DPR1 − 2 (bc − m).",
      "Example: 28 and 88 teeth at 190.5 mm run at 24.719°; cut the pinion to 97.189 mm and the gear to 295.03 mm outside diameter."
    ],
    "limitations": [
      "The tooth thicknesses give zero backlash at C1; thin the teeth for the backlash you need.",
      "A negative dedendum means the root lies outside the standard pitch circle; check the teeth are not pointed.",
      "Check the contact ratio and the undercut of each gear separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The tooth thickness is shared so each gear has the basic thickness at its operating pitch circle.",
      "Choose the hob pitch and pressure angle so the operating pressure angle stays within your range."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2139–2140. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "enlarged-spur-pinion-mesh": {
    "purpose": "Enlarged spur pinions by the handbook formulas, in the standard centre-distance (long and short addendum) system or the enlarged centre-distance system: outside diameters, arc tooth thickness at the standard pitch circle t = p ÷ 2 + e tan φ for the enlarged pinion and p ÷ 2 − e tan φ for a reduced gear, the centre distance for no backlash from inv φ1 = inv φ + (P (t + T) − π) ÷ (n + N) and C1 = C cos φ ÷ cos φ1, the smallest gear teeth without undercut N = 2 a csc² φ, and the smallest teeth of standard proportions a hob cuts without undercut, Nmin = 2 P csc² φ [aH − rt (1 − sin φ)].",
    "uses": [
      "Find the tooth thicknesses and outside diameters for an enlarged pinion and reduced gear",
      "Find the tight-mesh centre distance when only the pinion is enlarged",
      "Check the reduced gear has enough teeth to avoid undercut"
    ],
    "users": [
      "Gear designers",
      "Machinists and gear cutters",
      "Students"
    ],
    "inputs": {
      "m": "Module of both gears; for a diametral pitch P it is 25.4 ÷ P.",
      "phi": "Pressure angle of the gears.",
      "n": "Number of teeth in the enlarged pinion.",
      "Nt": "Number of teeth in the mating gear.",
      "ePin": "Amount the pinion outside diameter is increased over standard, from the handbook’s enlarged pinion tables or your design.",
      "eGear": "Amount the gear outside diameter is reduced under standard; equal to the pinion enlargement keeps the standard centre distance.",
      "aH": "Addendum of the hob or rack cutter, from its pitch line to its tip.",
      "rt": "Radius at the tip corners of the hob or rack cutter."
    },
    "outputs": [
      "Outside diameters of pinion and gear",
      "Arc tooth thicknesses at the standard pitch circle",
      "Operating pressure angle and centre distance for no backlash",
      "Smallest gear teeth without undercut",
      "Smallest pinion teeth of standard proportions without undercut"
    ],
    "method": [
      "Do (pinion) = n m + 2 m + e; Do (gear) = N m + 2 m − e (gear).",
      "t = π m ÷ 2 + e tan φ (pinion); T = π m ÷ 2 − e (gear) tan φ.",
      "inv φ1 = inv φ + (t + T − π m) ÷ ((n + N) m), with inv x = tan x − x; C = (n + N) m ÷ 2; C1 = C cos φ ÷ cos φ1.",
      "Smallest gear teeth N = 2 a csc² φ with a = 1 + (gear reduction × P ÷ 2), the enlarged pinion’s addendum at 1 diametral pitch when the gear is reduced by the same amount.",
      "Nmin = 2 csc² φ [aH − rt (1 − sin φ)] ÷ m for teeth of standard proportions.",
      "Example: the enlarged 10-tooth pinion has a tooth 0.47574 mm thick and meshes tight with the 30-tooth gear at 5.1787 mm, 0.098658 mm over standard."
    ],
    "limitations": [
      "The tight-mesh centre distance has no backlash; add the backlash you need.",
      "The smallest-teeth formulas are for hob or rack cutters; shaper cutters undercut less.",
      "Take the enlargement for a given tooth number from the handbook’s tables or the gear standard you follow.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the gear is reduced by the pinion’s enlargement the centre distance and pressure angle stay standard.",
      "With a standard gear the centre distance grows by about half the enlargement."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2142, 2154–2155. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-shaving-stock-check": {
    "purpose": "Stock left for shaving by the handbook’s centre-distance method: the preshaved gear is meshed without backlash against a gear of standard tooth thickness and the increase d in centre distance over standard is measured; the total thickness over standard is t2 = 2 tan φ × d, half on each side of the tooth, checked here also by the exact involute relation (inv φ1 = inv φ + (t2 ÷ m) ÷ (n + N) with cos φ1 = C cos φ ÷ (C + d)) and against your shaving allowance.",
    "uses": [
      "Check the stock left on a preshaved gear before shaving",
      "Convert a measured centre distance increase into tooth thickness",
      "Decide whether to recut a gear before shaving"
    ],
    "users": [
      "Gear inspectors",
      "Machinists and gear cutters",
      "Gear designers"
    ],
    "inputs": {
      "m": "Module of the gears; for a diametral pitch P it is 25.4 ÷ P.",
      "phi": "Pressure angle of the gears.",
      "n": "Number of teeth in the preshaved gear being checked.",
      "Nt": "Number of teeth in the gear of standard tooth thickness it is meshed with.",
      "d": "Amount the centre distance exceeds standard when the two gears are meshed without backlash.",
      "sMin": "Least total stock (both sides of the tooth) you want left for shaving.",
      "sMax": "Most total stock (both sides of the tooth) you want left for shaving."
    },
    "outputs": [
      "Total tooth thickness over standard by the handbook formula",
      "Stock on each side of the tooth",
      "The same by the exact involute relation",
      "Check against your shaving allowance"
    ],
    "method": [
      "t2 = 2 tan φ × d (handbook centre-distance method); stock per side t2 ÷ 2.",
      "Exact: C = (n + N) m ÷ 2; cos φ1 = C cos φ ÷ (C + d); t2 = (n + N) m (inv φ1 − inv φ).",
      "Compare t2 with the least and most stock you want.",
      "Example: a centre distance 0.087 mm over standard means 0.063331 mm of stock on the tooth, 0.031665 mm on each side."
    ],
    "limitations": [
      "The master gear must have standard tooth thickness and the gears must mesh without backlash when measured.",
      "Runout of either gear changes the reading; take the mean of several positions.",
      "Take the allowance from your shaving process or the handbook’s guide for the diametral pitch.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Too much stock shortens the life of the shaving cutter and lengthens the shaving time.",
      "Too little stock may not clean up the hobbed or shaped surface."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2141, 2155. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
