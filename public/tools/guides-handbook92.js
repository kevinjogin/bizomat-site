// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook92).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "crossed-helical-exact-centre-distance": {
    "purpose": "Helical gears for shafts at any angle and an exact centre distance by the handbook procedure (same hand, helix angles adding to the shaft angle Σ): pinion teeth nearest n = 2 C Pn cos αa cos βa ÷ (R cos βa + cos αa) for approximate helix angles, exact helix angles found by trial from R sec α + sec β = 2 C Pn ÷ n with β = Σ − α, pitch diameters D = N ÷ (Pn cos α) and d = n ÷ (Pn cos β), outside diameters D + 2 ÷ Pn and d + 2 ÷ Pn, leads L = π D cot α and l = π d cot β, the helix angle for the least centre distance (cot α = R^⅓ at 90°), and formed cutter numbers from N′ = N sec³ α + Pn Dc tan² α.",
    "uses": [
      "Find the helix angles that fit crossed helical gears to a fixed centre distance",
      "Find the least centre distance for a crossed helical ratio",
      "Work out leads and formed cutter numbers for milling crossed helical gears"
    ],
    "users": [
      "Gear designers",
      "Machinists and gear cutters",
      "Students"
    ],
    "inputs": {
      "sigma": "Angle between the two shafts; 90° for shafts at right angles.",
      "C": "Exact centre distance the gears must fit.",
      "mn": "Normal module of the teeth and cutter; for a normal diametral pitch Pn it is 25.4 ÷ Pn.",
      "Nt": "Number of teeth in the larger gear.",
      "n": "Number of teeth in the pinion, the whole number nearest the estimate shown.",
      "alphaA": "Approximate helix angle you want on the gear; the pinion takes the shaft angle less this.",
      "Dc": "Pitch diameter of the formed milling cutter, from the cutter maker or the handbook’s cutter table."
    },
    "outputs": [
      "Pinion teeth estimated for the approximate helix angles",
      "Exact helix angles of gear and pinion",
      "Pitch and outside diameters",
      "Leads of both helices",
      "Helix angle and centre distance for the least centre distance",
      "Formed cutter numbers by the preferred and approximate formulas"
    ],
    "method": [
      "R = N ÷ n; nest = 2 C cos αa cos βa ÷ (mn (R cos βa + cos αa)) with βa = Σ − αa (2 C Pn ÷ n = 2 C ÷ (n mn) in SI).",
      "Solve R sec α + sec (Σ − α) = 2 C ÷ (n mn) for the root nearest αa; β = Σ − α.",
      "D = N mn ÷ cos α; d = n mn ÷ cos β; O = D + 2 mn; o = d + 2 mn; L = π D cot α; l = π d cot β.",
      "Least centre distance where R sec α + sec β is smallest (cot α = R^⅓ at Σ = 90°).",
      "N′ = N sec³ α + (Dc ÷ mn) tan² α and n′ = n sec³ β + (Dc ÷ mn) tan² β, rounded and looked up in the cutter series; N ÷ cos³ α shown for comparison.",
      "Example: 84 and 28 teeth at 254 mm take helix angles of 46.099° and 43.901°; the least centre distance for the ratio is 240.28 mm."
    ],
    "limitations": [
      "Covers gears of the same hand whose helix angles add to the shaft angle; for opposite-hand pairs the difference of the angles equals the shaft angle.",
      "Crossed helical gears have point contact and suit light loads; rate them separately.",
      "Choose the hand of each helix from the rotation and the direction the thrust must be taken.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "There are usually two helix angles that fit; the tool takes the one nearest your approximate angle.",
      "If the centre distance is below the least centre distance, no helix angles fit: increase it or change the teeth."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2199–2205, 2150. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "helical-milling-cutter-selection": {
    "purpose": "Selecting the formed milling cutter for a helical gear by the handbook’s preferred formula N′ = N sec³ α + Pn Dc tan² α (written N′ = N K + Q K′ with K = sec³ α, K′ = tan² α and Q = Pn Dc), which gives correct results for all combinations of helix angle and tooth number, compared with the approximate N′ = N ÷ cos³ α; the cutter number from the involute cutter series (regular and half-number); with the pitch diameter N ÷ (Pn cos α), lead π D cot α, whole depth 2.157 ÷ Pn and tooth thickness 1.571 ÷ Pn at the pitch line.",
    "uses": [
      "Choose the involute cutter for milling a helical gear on a dividing head",
      "Check whether the approximate formula picks the wrong cutter",
      "Find the lead, tooth depth and tooth thickness for milling"
    ],
    "users": [
      "Machinists and gear cutters",
      "Toolmakers",
      "Gear designers"
    ],
    "inputs": {
      "Nt": "Actual number of teeth in the helical gear.",
      "helix": "Helix angle of the gear teeth, measured from the axis.",
      "mn": "Normal module of the gear and cutter; for a normal diametral pitch Pn it is 25.4 ÷ Pn.",
      "Dc": "Pitch diameter of the formed cutter, from the cutter maker or the handbook’s cutter table."
    },
    "outputs": [
      "Factors K = sec³ α, K′ = tan² α and Q = Pn Dc",
      "Cutter teeth N′ by the preferred and approximate formulas",
      "Cutter number in the regular and half-number series",
      "Pitch diameter and lead of the gear",
      "Whole depth and tooth thickness at the pitch line"
    ],
    "method": [
      "K = sec³ α; K′ = tan² α; Q = Pn Dc = Dc ÷ mn.",
      "N′ = N K + Q K′ (preferred); N′ = N K (approximate); round and look up the involute cutter series.",
      "D = N mn ÷ cos α; lead L = π D cot α; set the table to α.",
      "Whole depth 2.157 mn (2.157 ÷ Pn); tooth thickness at the pitch line 1.571 mn (1.571 ÷ Pn).",
      "Example: 15 teeth at 30° give N′ = 35.694 (cutter No. 3) against 23.094 by the approximate formula."
    ],
    "limitations": [
      "The cutter series covers 12 teeth to a rack; below 12 cutter teeth the gear is outside the series.",
      "The cutter pitch diameter changes as the cutter is sharpened; use its current size.",
      "Formed cutters give an approximate involute; hob or grind gears that need accuracy.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "At high helix angles with few teeth the approximate formula picks too high a cutter number (too few teeth).",
      "A larger cutter diameter raises N′, so the same gear may need a different cutter with another cutter size."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2204–2206, 2150. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "enlarged-helical-pinion": {
    "purpose": "Enlargement of full-depth helical pinions of 20° normal pressure angle by the handbook formulas: transverse diametral pitch Pt = Pn cos ψ, pitch diameter d = n ÷ Pt, transverse pressure angle tan φt = tan φn ÷ cos ψ, enlargement Kh = 2.1 − (n ÷ cos ψ)(sin φt − cos φt tan 5°) sin φt and outside diameter do = d + (2 + Kh) ÷ Pn; then the centre distance for tight mesh with the mating gear, inv φ = inv φt + (tnP + tnG − π) ÷ (n + N) and C′ = C cos φt ÷ cos φ with C = (n + N) ÷ (2 Pn cos ψ).",
    "uses": [
      "Find the outside diameter of an enlarged fine-pitch helical pinion",
      "Find the centre distance for an enlarged pinion meshing with a standard gear",
      "Check whether a helical pinion needs enlarging at all"
    ],
    "users": [
      "Gear designers",
      "Machinists and gear cutters",
      "Students"
    ],
    "inputs": {
      "n": "Number of teeth in the helical pinion.",
      "mn": "Normal module of the teeth; for a normal diametral pitch Pn it is 25.4 ÷ Pn.",
      "psi": "Helix angle of the pinion.",
      "Nt": "Number of teeth in the mating gear.",
      "tnP": "Tooth thickness of the enlarged pinion at 1 diametral pitch, from the handbook’s Table 9c for its tooth number.",
      "tnG": "Tooth thickness of the mating gear at 1 diametral pitch; 1.5708 for a standard gear."
    },
    "outputs": [
      "Transverse module and pitch diameter",
      "Transverse pressure angle",
      "Enlargement Kh and outside diameter of the pinion",
      "Standard centre distance",
      "Operating pressure angle and centre distance for tight mesh"
    ],
    "method": [
      "Pt = Pn cos ψ (transverse module mn ÷ cos ψ); d = n ÷ Pt; tan φt = tan 20° ÷ cos ψ.",
      "Kh = 2.1 − (n ÷ cos ψ)(sin φt − cos φt tan 5°) sin φt; do = d + (2 + Kh) ÷ Pn; no enlargement when Kh is not positive.",
      "C = (n + N) ÷ (2 Pn cos ψ); inv φ = inv φt + (tnP + tnG − π) ÷ (n + N) with inv x = tan x − x; C′ = C cos φt ÷ cos φ.",
      "Example: a 12-tooth pinion at 18° takes Kh = 0.8566 and an outside diameter of 12.283 mm; with a 24-tooth gear it meshes tight at 15.403 mm."
    ],
    "limitations": [
      "The formulas are for full-depth teeth of 20° normal pressure angle cut by hobs with sharp top corners; pinions cut by shaper cutters may need less enlargement.",
      "The handbook’s graph gives Kh directly and may differ slightly from the formula.",
      "An enlarged pinion needs a larger centre distance or a smaller mating gear.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fewer teeth or a smaller helix angle need more enlargement; pinions with about 24 or more teeth need none.",
      "The tight-mesh centre distance is the closest the gears can run; add backlash to it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2206–2207, 2152. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "helical-hobbing-change-gears": {
    "purpose": "Index and feed change gears for hobbing helical gears on a machine without a differential by the handbook formulas: index gear ratio R = L ÷ (L ∓ F) × K T ÷ N (minus when gear and hob are the same hand, plus when opposite, reversed for climb hobbing), the error of the obtainable index ratio, the feed that compensates for it F = L (N R − K T) ÷ (N R), the feed gear ratio F ÷ M, the feed from the feed gears fitted, and the lead obtained L = F N R ÷ (N R − K T) with its error.",
    "uses": [
      "Work out the index ratio for hobbing a helical gear",
      "Correct the feed to make up for the index gear error",
      "Check the lead obtained with the gears available"
    ],
    "users": [
      "Machinists and gear cutters",
      "Toolmakers",
      "Gear designers"
    ],
    "inputs": {
      "Nt": "Number of teeth on the helical gear being hobbed.",
      "L": "Lead of the gear helix; L = π D cot α for pitch diameter D and helix angle α.",
      "F": "Nominal feed of the hob per revolution of the gear.",
      "K": "Index constant of the hobbing machine, from its maker.",
      "T": "Number of threads (starts) on the hob.",
      "M": "Feed gear constant of the machine, from its maker.",
      "hand": "Whether gear and hob have the same or opposite hand of helix.",
      "mode": "Conventional or climb hobbing; climb hobbing reverses the sign rule.",
      "i1": "First driving index gear.",
      "i2": "Second driving index gear; for a simple pair use equal gears in the second positions.",
      "i3": "First driven index gear.",
      "i4": "Second driven index gear.",
      "f1": "First driving feed gear.",
      "f2": "Second driving feed gear.",
      "f3": "First driven feed gear.",
      "f4": "Second driven feed gear.",
      "errMax": "Largest lead error you accept per 100 mm of lead, from the gear’s lead tolerance."
    },
    "outputs": [
      "Index gear ratio required",
      "Index ratio obtained and its error",
      "Feed that compensates for the index error and its feed gear ratio",
      "Feed from the feed gears fitted",
      "Lead obtained and its error, with and without the feed correction"
    ],
    "method": [
      "R = L ÷ (L − F) × K T ÷ N for gear and hob of the same hand (L + F for opposite hand; the rule reverses for climb hobbing).",
      "Obtainable index ratio Ri = (i1 i2) ÷ (i3 i4); error R − Ri.",
      "F = L (N Ri − K T) ÷ (N Ri); feed gear ratio F ÷ M (use K T − N Ri for opposite hand or climb hobbing).",
      "Feed fitted = M (f1 f2) ÷ (f3 f4); lead obtained L = F N Ri ÷ (N Ri − K T); error against the lead required.",
      "Example: the index ratio required is 0.6255; with the gears fitted the feed becomes 0.85446 mm and the lead 1,119.8 mm, 0.0057822 mm per 100 mm off."
    ],
    "limitations": [
      "For machines without a differential only; with a differential follow the machine maker’s lead gear formula.",
      "Machine constants K and M and the sign rule depend on the machine: check them against its manual.",
      "Find gear combinations close to the ratio with conjugate fractions or a ratio table.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Without the feed correction even a tiny index ratio error gives a large lead error.",
      "The feed correction is small; keep the feed gears close to the ratio required."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2208–2209. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
