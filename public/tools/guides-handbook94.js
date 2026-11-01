// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook94).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "milled-bevel-gear-dimensions": {
    "purpose": "Dimensions of a pair of milled bevel gears with shafts at any angle by the handbook’s rules for milled bevel gears, where pinion and gear have equal tooth thickness, addendum and dedendum: pitch cone angles tan γP = sin Σ ÷ (NG ÷ NP + cos Σ) and γG = Σ − γP, pitch diameters N ÷ P, addendum 1 ÷ P, dedendum 1.157 ÷ P, whole depth 2.157 ÷ P, tooth thickness 1.5708 ÷ P, pitch cone radius C = D ÷ 2 sin γ, the widest face (C ÷ 3 or 8 ÷ P, whichever is smaller), small-end addendum and thickness in the ratio (C − F) ÷ C, addendum and dedendum angles tan α = S ÷ C and tan δ = (S + A) ÷ C, face angle γ + α, compound rest angle 90° − γ − α, cutting angle γ − δ (or γ − α for uniform clearance), angular addendum S cos γ, outside diameter D + 2K, vertex distances J = (O ÷ 2) cot (γ + α) and j = J (C − F) ÷ C, and the number of teeth N ÷ cos γ for which to select each formed cutter.",
    "uses": [
      "Turn bevel gear blanks to the right outside diameter, face angle and vertex distance",
      "Set the dividing head to the cutting angle for milling bevel gear teeth",
      "Find the tooth numbers for selecting formed bevel gear cutters"
    ],
    "users": [
      "Machinists and gear cutters",
      "Gear designers",
      "Students"
    ],
    "inputs": {
      "m": "Module of the gears; for a diametral pitch P it is 25.4 ÷ P.",
      "NP": "Number of teeth in the pinion.",
      "NG": "Number of teeth in the gear.",
      "sigma": "Angle between the pinion and gear shafts; 90° for shafts at right angles.",
      "F": "Width of face (tooth length) you intend for both gears.",
      "root": "Whether to cut the root with the dedendum angle as in the handbook table, or with the addendum angle so the clearance is uniform as the handbook recommends."
    },
    "outputs": [
      "Pitch cone angles and pitch diameters",
      "Addendum, dedendum, whole depth and tooth thickness",
      "Pitch cone radius and the widest face allowed",
      "Small-end addendum and tooth thickness",
      "Addendum, dedendum, face, compound rest and cutting angles for each gear",
      "Angular addendum, outside diameter and vertex distances for each gear",
      "Tooth numbers for selecting the formed cutters"
    ],
    "method": [
      "tan γP = sin Σ ÷ (NG ÷ NP + cos Σ); γG = Σ − γP; D = N m.",
      "S = m; S + A = 1.157 m; W = 2.157 m; T = 1.5708 m; C = D ÷ (2 sin γ).",
      "F (max) = the smaller of C ÷ 3 and 8 m; s = S (C − F) ÷ C; t = T (C − F) ÷ C.",
      "tan α = S ÷ C; tan δ = (S + A) ÷ C; face angle γ + α; compound rest angle 90° − γ − α; cutting angle γ − δ, or γ − α for uniform clearance.",
      "K = S cos γ; O = D + 2K; J = (O ÷ 2) cot (γ + α); j = J (C − F) ÷ C.",
      "Number of teeth for selecting the cutter N′ = N ÷ cos γ.",
      "Example: the pinion’s pitch cone angle is 18.296° and its cutter is selected for 21.065 teeth; the gear’s for 80.681 teeth."
    ],
    "limitations": [
      "These are the proportions for milled bevel gears, with equal addendums and tooth thicknesses on pinion and gear; generated bevel gears use long and short addendums.",
      "Milled bevel gears are approximate in form and are not suitable for high speeds or accurate motion.",
      "Pitch cone angles of 90° or more (crown and internal bevel gears) are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The face width should not exceed the maximum, or the teeth become too small at the inner end.",
      "Select the cutters from the spur gear cutter series for the tooth numbers N′ shown, using the gear cutter number tool."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2181–2184, 2187. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bevel-gear-milling-offset": {
    "purpose": "Set-up for milling a bevel gear with a rotary formed cutter by the handbook method: pitch diameter and pitch cone radius C = D ÷ 2 sin γ, the ratio C ÷ F for reading the offset factor, the number of teeth N ÷ cos γ for selecting the cutter, the depth 1.157 ÷ P at which to measure the cutter thickness, the offset T ÷ 2 − factor ÷ P from the cutter’s measured thickness and the factor you read from the handbook table, the dividing head cutting angle (pitch cone angle less addendum angle), and the circular and chordal thickness and chordal addendum at the large end (T = 1.5708 ÷ P, Tc = T − T³ ÷ 6D², Sc = S + T² cos γ ÷ 4D) and at the small end in the ratio (C − F) ÷ C.",
    "uses": [
      "Set the blank over by the right amount for the two cuts on each tooth space",
      "Set the dividing head to the cutting angle",
      "Check the teeth at both ends with a gear tooth caliper"
    ],
    "users": [
      "Machinists and gear cutters",
      "Gear designers",
      "Students"
    ],
    "inputs": {
      "m": "Module of the gear; for a diametral pitch P it is 25.4 ÷ P.",
      "Nt": "Number of teeth in the bevel gear being milled.",
      "gamma": "Pitch cone angle of the gear being milled.",
      "F": "Width of face (tooth length).",
      "Tc": "Thickness of the formed cutter at its pitch line, measured with a gear tooth caliper at the depth shown.",
      "factor": "Factor read from the handbook’s offset factor table for the cutter number and the ratio C ÷ F shown here."
    },
    "outputs": [
      "Pitch cone radius and the ratio C ÷ F for the factor table",
      "Number of teeth for selecting the cutter",
      "Depth at which to measure the cutter",
      "Offset of the blank from the central position",
      "Dividing head cutting angle",
      "Chordal thickness and chordal addendum at the large and small ends"
    ],
    "method": [
      "D = N m; C = D ÷ (2 sin γ); ratio C ÷ F; N′ = N ÷ cos γ.",
      "Measure the cutter thickness T at depth S + A = 1.157 m.",
      "Offset = T ÷ 2 − factor × m (factor ÷ P in inches).",
      "Cutting angle = γ − α, where tan α = S ÷ C.",
      "Large end: T = 1.5708 m; Tc = T − T³ ÷ 6D²; Sc = S + T² cos γ ÷ 4D.",
      "Small end: t = T (C − F) ÷ C; s = S (C − F) ÷ C; tc = t − t³ ÷ 6(D − 2F sin γ)²; sc = s + t² cos γ ÷ 4(D − 2F sin γ).",
      "Example: offset the blank 1.0308 mm each side of centre and set the dividing head to 27.614°."
    ],
    "limitations": [
      "The offset factor comes from the handbook table for the cutter number and C ÷ F; enter it, do not guess it.",
      "The offset is a starting setting: trial cuts and caliper checks at both ends correct it, as the handbook describes.",
      "Bevel gear cutters are relieved on the sides, so measure the cutter thickness each time it is sharpened.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the large end is right and the small end too thick, the blank was offset too much; if the small end is right and the large end too thick, it was not offset enough.",
      "File the small-end tooth sides afterwards as the handbook shows to correct the milled form."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2188–2189. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sae-straight-sided-spline": {
    "purpose": "Dimensions and torque capacity of an S.A.E. standard spline fitting (4, 6, 10 or 16 splines) by the handbook’s formulas for S.A.E. splines: spline width W (0.241D, 0.250D, 0.156D or 0.098D), and the depth h and minor diameter d for the permanent fit (A), sliding without load (B) or sliding under load (C), then the mean radius R = (D + d) ÷ 4 and the torque capacity T = p N R h per unit of bearing length (the handbook’s T = 1000 N R h at 1000 lbf/in² on the spline sides) for your side pressure and length, against the torque the fitting must carry.",
    "uses": [
      "Size a straight-sided splined shaft and hole for a fit",
      "Check the torque capacity of an S.A.E. spline fitting",
      "Compare 4, 6, 10 and 16 spline fittings"
    ],
    "users": [
      "Machine designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "D": "Nominal major diameter of the spline fitting.",
      "n": "Number of splines in the fitting.",
      "fit": "Permanent fit, sliding without load, or sliding under load.",
      "L": "Length over which the hub and shaft splines bear on each other.",
      "p": "Bearing pressure you allow on the sides of the splines; the handbook’s table capacities are for 1000 lbf/in² (6.895 MPa).",
      "Treq": "Torque the fitting must transmit."
    },
    "outputs": [
      "Spline width",
      "Depth and minor diameter for the fit",
      "Mean radius of the spline sides",
      "Torque capacity per unit length and for the length",
      "Side pressure at your torque"
    ],
    "method": [
      "W = 0.241D (4), 0.250D (6), 0.156D (10) or 0.098D (16).",
      "Fit A: h = 0.075D, d = 0.850D (4); 0.050D, 0.900D (6); 0.045D, 0.910D (10, 16).",
      "Fit B: h = 0.125D, d = 0.750D (4); 0.075D, 0.850D (6); 0.070D, 0.860D (10, 16).",
      "Fit C: h = 0.100D, d = 0.800D (6); 0.095D, 0.810D (10, 16); none for 4 splines.",
      "R = (D + d) ÷ 4; T = p N R h L (the handbook’s T = 1000 N R h lbf·in per inch at 1000 lbf/in²).",
      "Example: the fitting carries 16.101 N·m over 25.4 mm at 6.895 MPa on the spline sides."
    ],
    "limitations": [
      "The dimensions apply to soft broached holes; the handbook tables give the tolerances.",
      "The torque capacity assumes all splines bear evenly; spacing errors reduce it.",
      "Radii at the spline corners should not exceed 0.015 in (0.38 mm), and the splines should be parallel to the axis within 0.006 in per foot (0.5 mm per metre).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Take the side pressure from your design rules; the handbook’s tabulated capacities use 1000 lbf/in².",
      "A sliding fit has deeper splines and a smaller minor diameter than a permanent fit of the same size."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2279–2281. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "roller-chain-sprocket-tooth-form": {
    "purpose": "ANSI B29.1M roller chain sprocket tooth form by the formulas the handbook gives: seating curve diameter Ds = 1.005 Dr + 0.003 in and R = Ds ÷ 2, angles A = 35° + 60° ÷ N and B = 18° − 56° ÷ N, ac = 0.8 Dr, M = 0.8 Dr cos A, T = 0.8 Dr sin A, E = 1.3025 Dr + 0.0015 in, chord xy = (2.605 Dr + 0.003) sin (9° − 28° ÷ N), yz, ab = 1.4 Dr, W and V, F, H = √(F² − (1.4 Dr − 0.5 P)²), S = 0.5 P cos (180° ÷ N) + H sin (180° ÷ N), the approximate outside diameter P [0.6 + cot (180° ÷ N)] and the outside diameter when the tooth is pointed, the pressure angles for new chain, minimum and average, and the standard hob: normal pitch 1.011 P, H = 0.27 P, fillet radius 0.03 P, outside diameter 1.7 (bore + Dr + 0.7 P), pitch diameter OD − Ds, helix angle sin M = Pn ÷ π Dh, lead Pn ÷ cos M and the least width.",
    "uses": [
      "Lay out a roller chain sprocket tooth for a template, wire cut or CNC profile",
      "Check a sprocket against the standard tooth form",
      "Specify a hob for cutting roller chain sprockets"
    ],
    "users": [
      "Machinists and gear cutters",
      "Machine designers",
      "Toolmakers"
    ],
    "inputs": {
      "P": "Pitch of the roller chain.",
      "Dr": "Nominal roller diameter of the chain.",
      "Nt": "Number of teeth in the sprocket.",
      "bore": "Bore of the hob that will cut the sprocket teeth."
    },
    "outputs": [
      "Seating curve diameter and radius",
      "Tooth form angles, arc centres and chords",
      "Topping curve values F, H and S",
      "Approximate and pointed-tooth outside diameters",
      "Pressure angles for new chain, minimum and average",
      "Hob normal pitch, outside and pitch diameters, helix angle, lead and least width"
    ],
    "method": [
      "Ds = 1.005 Dr + 0.0762 mm (0.003 in); R = Ds ÷ 2; A = 35° + 60° ÷ N; B = 18° − 56° ÷ N; ac = 0.8 Dr.",
      "M = 0.8 Dr cos A; T = 0.8 Dr sin A; E = 1.3025 Dr + 0.0381 mm (0.0015 in).",
      "xy = (2.605 Dr + 0.0762) sin (9° − 28° ÷ N); yz = Dr [1.4 sin (17° − 64° ÷ N) − 0.8 sin (18° − 56° ÷ N)]; ab = 1.4 Dr; W = 1.4 Dr cos (180° ÷ N); V = 1.4 Dr sin (180° ÷ N).",
      "F = Dr [0.8 cos (18° − 56° ÷ N) + 1.4 cos (17° − 64° ÷ N) − 1.3025] − 0.0381 mm; H = √(F² − (1.4 Dr − 0.5 P)²); S = 0.5 P cos (180° ÷ N) + H sin (180° ÷ N).",
      "OD (approx., J = 0.3 P) = P [0.6 + cot (180° ÷ N)]; OD (pointed) = P cot (180° ÷ N) + cos (180° ÷ N)(Ds − Dr) + 2H.",
      "Pressure angle for new chain 35° − 120° ÷ N; minimum 17° − 64° ÷ N; average 26° − 92° ÷ N.",
      "Hob: Pn = 1.011 P; H = 0.27 P; E = 0.03 P; OD = 1.7 (bore + Dr + 0.7 P); Dh = OD − Ds; sin M = Pn ÷ π Dh; lead = Pn ÷ cos M; width at least 2 × bore, 6 Dr and 3.2 P.",
      "Example: the seating curve diameter is 8.0406 mm and the approximate outside diameter 87.805 mm."
    ],
    "limitations": [
      "The inch constants of the standard (0.003 and 0.0015 in) are converted to millimetres; the seating curve diameter has a plus tolerance only, given in the handbook table.",
      "The hob outside diameter formula is approximate, as the handbook notes.",
      "A hob made for a given pitch and roller diameter cuts any number of teeth.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The approximate outside diameter must be smaller than the pointed-tooth diameter, or the teeth come to a point.",
      "The pressure angle falls from the new-chain value toward the minimum as the chain wears and rides higher on the teeth."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2554–2555. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
