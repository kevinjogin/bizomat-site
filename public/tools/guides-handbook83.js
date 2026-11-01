// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook83).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "worm-cutter-profile-correction": {
    "purpose": "Profile deviation and pressure angle change produced in a worm thread by the diameter of the milling cutter or grinding wheel, by the formulas the handbook gives from ANSI B6.9: the radius of curvature of the normal profile of an involute thread and of the thread actually produced, the difference between the pressure angle of the thread and of the tool in minutes, the slant height of the addendum, the departure of the profile from a straight side and the effect of the pressure angle change along the slant height, for two tools of different diameter, with the profile curve and pressure angle correction that make their worms alike, compared with your profile tolerance.",
    "uses": [
      "Decide whether a milled worm and a ground worm can run with the same wormgears",
      "Find the pressure angle and profile correction for a cutter or grinding wheel",
      "Set a worm profile tolerance that suits the tools in the shop"
    ],
    "users": [
      "Gear designers",
      "Worm and hob makers",
      "Production engineers"
    ],
    "inputs": {
      "d": "Pitch diameter of the worm; the formulas use the pitch radius r = d ÷ 2.",
      "lam": "Lead angle of the worm thread, measured from a plane square to the worm axis.",
      "phin": "Normal pressure angle of the milling cutter or grinding wheel, normally the pressure angle the worm is specified with.",
      "n": "Number of threads or starts on the worm, as the formula for the pressure angle change uses it.",
      "a": "Addendum of the worm thread, from the worm proportions.",
      "Dc": "Diameter of the first (normally smaller) tool, for example a milling cutter; the handbook works with 2 in (50.8 mm).",
      "Dw": "Diameter of the second (normally larger) tool, for example a grinding wheel; the handbook works with 20 in (508 mm).",
      "tolY": "Largest difference in profile curvature between the two worms that your profile tolerance allows, measured from a straight side.",
      "tolS": "Largest difference along the slant height of the thread, from the pressure angle change, that your tolerance allows."
    },
    "outputs": [
      "Radius of curvature of the involute normal profile",
      "Radius of curvature of the profile each tool produces",
      "Pressure angle change of each tool in minutes",
      "Slant height of the addendum",
      "Profile departure y and slant-height effect s for each tool",
      "Profile and pressure angle correction Δy and Δs between the tools"
    ],
    "method": [
      "Pitch radius r = d ÷ 2; tool radius R = tool diameter ÷ 2 for each tool.",
      "ρ_ni = r sin φn ÷ (sin λ)² — radius of curvature of the normal profile of an involute thread (1).",
      "ρ_n = ρ_ni + r ρ_ni ÷ (R (cos λ)²) — radius of curvature of the normal profile the tool produces (2).",
      "Δφ = 5400 r (sin λ)³ ÷ (n (R (cos λ)² + r)) minutes — difference between the thread and tool normal pressure angles (3).",
      "q = a sec φn (4); y = q² ÷ (2 ρ_n) (5); s = 0.000582 q Δφ (6).",
      "Δy = y_w − y_c (7); Δs = s_c − s_w (8), where c is the first tool and w the second.",
      "Example: a 50.8 mm cutter changes the pressure angle by 24.995′ and a 508 mm wheel by 3.7489′; making the worms alike needs a profile correction of 0.014588 mm and 0.014738 mm along the slant height."
    ],
    "limitations": [
      "The formulas are those the handbook gives in slightly modified form from ANSI B6.9-1977 for straight-sided cutters and wheels on cylindrical worms.",
      "The handbook prints the profile departure of the 2 in cutter in Example 3 with the wheel’s radius of curvature; the tool uses formula (5) for each tool, which gives the example’s final Δy = 0.00057 in.",
      "Wormgear hob design and the tolerances themselves are not set here; enter the tolerance your drawing allows.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A small cutter changes the pressure angle and curves the profile much more than a large wheel, so worms made by the two methods are not interchangeable unless one tool is corrected.",
      "The correction applies to either tool: change its pressure angle by the amount Δs represents and give it a profile curved by Δy."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3329–3330. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "industrial-worm-gearing-design": {
    "purpose": "Proportions of industrial (coarse-pitch) worm gearing by the rules and formulas of the handbook’s Table 4 and the AGMA proportions it gives: ratio and lead, wormgear pitch diameter from teeth and axial pitch, worm pitch diameter from the centre distance (or the centre distance from a chosen worm), lead angle, normal pitch, addendum, whole depth, dedendum and clearance, worm outside diameter, wormgear throat diameter and throat radius, wormgear outside diameter by the lead-angle and thread-count rules, face width for shell or integral worms, worm thread length, rubbing speed, efficiency with the worm or the wormgear driving by the friction-angle formulas and the empirical rules, the hunting-tooth check, the teeth-plus-threads total and the pressure angle the handbook relates to the lead angle.",
    "uses": [
      "Lay out a power worm drive at a fixed centre distance and ratio",
      "Choose threads and teeth for a hunting-tooth ratio",
      "Get blank sizes, face width and thread length for drawings"
    ],
    "users": [
      "Gearbox designers",
      "Mechanical design engineers",
      "Machine builders"
    ],
    "inputs": {
      "P": "Axial pitch of the worm, which equals the circular pitch of the wormgear in its central plane; the handbook example uses 0.5 in (12.7 mm).",
      "t": "Number of threads or starts on the worm; multi-thread worms with lead angles of 25° to 45° are the efficient choice for power.",
      "T": "Number of teeth on the wormgear; the ratio is teeth ÷ threads.",
      "phi": "Pressure angle you intend to use (half the included thread angle), checked against the handbook’s guide by lead angle.",
      "mode": "With the centre distance fixed the worm takes what is left after the wormgear; otherwise the centre distance follows from the worm you choose.",
      "C": "Centre distance between the worm and wormgear axes, from the housing.",
      "dw": "Worm pitch diameter you have chosen for strength and stiffness.",
      "depth": "The handbook’s depth rules are written in axial pitch; for lead angles over 15° to 20° it says the normal pitch is commonly used instead, giving shallower teeth.",
      "mount": "A shell worm is bored and fitted on a shaft; a worm with threads cut on the shaft uses the face width rule from the centre distance.",
      "nw": "Speed of the worm shaft, for the rubbing speed.",
      "f": "Coefficient of friction between the worm and wormgear for your materials, finish and lubricant, from test data or the gear maker."
    },
    "outputs": [
      "Ratio, lead and lead angle",
      "Wormgear and worm pitch diameters and centre distance",
      "Normal pitch, addendum, whole depth, dedendum and clearance",
      "Worm outside diameter, wormgear throat diameter, throat radius and outside diameter",
      "Face width and worm thread length",
      "Rubbing speed and efficiency with the worm or the wormgear driving",
      "Hunting tooth, teeth-plus-threads total and pressure angle checks"
    ],
    "method": [
      "Ratio R = T ÷ t; lead L = t P; wormgear pitch diameter D = T P ÷ π (rule 22).",
      "Fixed centre distance: worm pitch diameter d = 2C − D (rule 18); otherwise C = (D + d) ÷ 2 (rule 2).",
      "Lead angle tan λ = L ÷ (π d) (rule 12); normal pitch P_n = P cos λ (rule 17).",
      "AGMA proportions: single and double thread a = 0.318 p, W = 0.686 p; triple and quadruple a = 0.286 p, W = 0.623 p, with p the axial pitch or, for steep leads, the normal pitch; dedendum b = W − a; clearance c = W − 2a.",
      "Worm outside d_o = d + 2a (rule 13); throat diameter D_t = D + 2a (rule 28); throat radius U = d_o ÷ 2 − 2a (rule 29).",
      "Wormgear outside diameter: D + 3 × 0.3183 P up to 20° lead angle, D + 3 × 0.3183 P cos λ above; or D_t + 0.4775 P (one or two threads), D_t + 0.3183 P (three or more).",
      "Face width: shell worms 2.38 P + 0.25 in (one or two threads) or 2.15 P + 0.20 in (three or four); integral worms C^0.875 ÷ 3 with C in inches. Thread length G = P (4.5 + 0.02 T) (rule 31).",
      "Rubbing speed V = π d n ÷ cos λ (0.262 d n sec λ ft/min, rule 27).",
      "Friction angle φ_f = arctan f; worm driving E = 100 tan λ ÷ tan(λ + φ_f) and empirically 100 − R ÷ 2; wormgear driving E = 100 tan(λ − φ_f) ÷ tan λ and empirically 100 − 2R.",
      "Example: 36/6 at 12.7 mm pitch on a 91.44 mm centre distance gives D = 145.53 mm, d = 37.349 mm and a 33.001° lead angle, with 89.836 % efficiency with the worm driving."
    ],
    "limitations": [
      "The handbook gives the AGMA depth rules and face width rules for one to four threads; for more threads the triple-and-quadruple rules are used here and should be confirmed with the gear maker.",
      "Efficiency excludes bearing and oil-churning losses, as the handbook notes; the empirical rules and the friction formulas differ somewhat.",
      "Load and thermal ratings are not calculated; check them with the gear maker or a rating standard.",
      "The handbook’s pressure angle guide by lead angle is a general guide with overlapping bands.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A lead angle of 25° to 45° keeps efficiency high; single-thread worms with small lead angles are inefficient but give large ratios and may self-lock.",
      "Teeth and threads with no common factor give hunting-tooth action, which spreads hob errors over all teeth; if the worm threads are not accurately indexed, the handbook prefers to avoid it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3331–3338, 3344. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "worm-hob-design": {
    "purpose": "Wormgear hob proportions by the handbook’s formulas and AGMA practice: the over-size sharpening allowance from the normal pitch and the helix angles at the outside and pitch diameters (solved together with the diameters it changes), the hob outside, root and pitch diameters, the hob lead angle and the extra setting angle that makes up for the smaller lead angle of an over-size hob, the approximate number of flutes by the handbook rule with a count that has no common factor with the threads, the common-factor check between hob threads and wormgear teeth, flute pitch and gash width at the periphery, and for helical flutes at right angles to the thread, the teeth per turn along the thread and the modified flute lead and angle that suit the relieving attachment.",
    "uses": [
      "Specify hob diameters for a wormgear",
      "Choose the number of gashes for a multi-thread hob",
      "Work out the flute lead for a helical-fluted hob to suit the relieving gears"
    ],
    "users": [
      "Hob and cutter makers",
      "Gear cutting shops",
      "Gear designers"
    ],
    "inputs": {
      "D": "Pitch diameter of the worm the hob copies.",
      "P": "Axial pitch of the worm; the hob has the same lead and threads as the worm.",
      "t": "Number of threads on the worm, which the hob must also have.",
      "Tg": "Number of teeth on the wormgear to be hobbed, for the common-factor check.",
      "A": "Addendum of the worm and wormgear teeth, from the worm proportions.",
      "Cl": "Clearance between the worm and wormgear teeth at the root, from the worm proportions.",
      "Fl": "Number of flutes or gashes you intend to cut; compare it with the handbook rule and the common-factor check.",
      "fl": "Hobs are usually fluted parallel to the axis; flutes at right angles to the thread cut better but need a flute lead the relieving attachment can follow.",
      "Nrel": "Number of teeth in one turn along the thread helix for which you can gear the relieving attachment, for example a whole or half number close to the exact value this tool reports."
    },
    "outputs": [
      "Lead, worm lead angle and normal pitch",
      "Sharpening allowance by the AGMA formula",
      "Hob outside, root and pitch diameters",
      "Hob lead angle and setting angle correction",
      "Flutes by the handbook rule and the common-factor checks",
      "Flute pitch and gash width at the periphery",
      "Teeth per turn along the thread, flute lead and flute angle for helical flutes"
    ],
    "method": [
      "Lead L = t P; worm lead angle λ = arctan(L ÷ (π D)); normal pitch P_n = P cos λ.",
      "Outside diameter O = D + 2A + 2C + S; root diameter = D − 2A; hob pitch diameter D_h = O − (2A + 2C) = D + S.",
      "Helix angles from the axis: H = arctan(π D_h ÷ L) at the pitch diameter, h = arctan(π O ÷ L) at the outside diameter.",
      "Sharpening allowance S = 0.075 P_n [16 − (h − H)] ÷ 16 + 0.010 in (0.254 mm), with angles in degrees; S and the diameters are solved together by repeated substitution.",
      "Hob lead angle λ_h = arctan(L ÷ (π D_h)); the hob axis is set at 90° plus λ − λ_h to the wormgear axis.",
      "Approximate flutes = 3 × hob diameter ÷ (2 × linear pitch); choose a number with no common factor with the threads, and threads with no common factor with the wormgear teeth.",
      "Flute pitch at the periphery = π O ÷ flutes; gash width ≈ 0.4 × flute pitch.",
      "Helical flutes: teeth per turn along the thread N = F ÷ cos² α with α the hob lead angle; for a chosen N the flute lead = L F ÷ (N − F), and its angle from the axis at the pitch diameter is arctan(π D_h ÷ flute lead).",
      "Example: a 2-thread hob for a 50.8 mm worm gets a 1.1133 mm sharpening allowance, 61.673 mm outside diameter and a 0.19083° extra setting angle; the rule gives about 7.2842 flutes."
    ],
    "limitations": [
      "The sharpening allowance is the AGMA practice for ordinary commercial hobs that the handbook gives; precision hobs may differ.",
      "Gashing cutter thickness and depth below the thread root are given by the handbook in inches as ranges; they are not calculated.",
      "For helical flutes the relieving gearing itself is not worked out; choose a value of N you can gear for.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An over-size hob has a larger pitch diameter and a smaller lead angle than the worm; resharpening slowly brings it back, and the setting angle makes up the difference meanwhile.",
      "A common factor between threads and flutes, or between threads and wormgear teeth, repeats errors on the same teeth; avoid it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3345–3346. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "metric-tap-thread-limits": {
    "purpose": "Pitch diameter and major diameter limits of an ASME B94.9 metric (M profile) ground thread tap by the formulas the handbook gives: the symmetrical thread height and basic pitch diameter, the maximum and minimum tap pitch diameters for the standard limits or for a D (over basic) or DU (under basic) limit number in steps of 0.013 mm, the equivalent limit number, the minimum major diameter from the specified tap pitch diameter and the maximum major diameter, with your measured pitch and major diameters checked against them; the table allowances for the size and pitch are entered by you.",
    "uses": [
      "Find the pitch diameter limits marked on a metric tap",
      "Check a measured tap before tapping a gauged thread",
      "Specify an oversize or undersize tap by its limit number"
    ],
    "users": [
      "Toolroom and inspection staff",
      "Production engineers",
      "Tool buyers"
    ],
    "inputs": {
      "D": "Basic major diameter of the metric thread, for example 6 for M6.",
      "P": "Pitch of the thread.",
      "lim": "Standard taps take the maximum pitch diameter Y over basic from the table; D and DU taps are marked with a number of 0.013 mm steps over or under basic.",
      "num": "Limit number marked on the tap after D or DU; not used for the standard limits.",
      "X": "Major diameter tolerance for the pitch, from the handbook’s Table 4 (ASME B94.9).",
      "Y": "Amount over basic for the maximum pitch diameter for the size range and pitch, from Table 4; also used for the major diameter.",
      "Z": "Pitch diameter tolerance for the size range and pitch, from Table 4.",
      "PDm": "Pitch diameter you measured on the tap, for example over wires.",
      "Mm": "Major diameter you measured on the tap."
    },
    "outputs": [
      "Thread height and basic pitch diameter",
      "Maximum and minimum tap pitch diameter",
      "Equivalent D or DU limit number",
      "Minimum and maximum tap major diameter",
      "Measured pitch and major diameters against the limits"
    ],
    "method": [
      "Symmetrical thread height h = 0.64951905 P; basic pitch diameter = D − h.",
      "Standard: maximum tap PD = basic PD + Y. D limit: maximum = basic PD + 0.013 × number. DU limit: minimum = basic PD − 0.013 × number.",
      "The other pitch diameter limit is found with the tolerance Z: minimum = maximum − Z, or maximum = minimum + Z.",
      "Equivalent limit number = (maximum tap PD − basic PD) ÷ 0.013 (D when positive, DU from the minimum when below basic).",
      "Minimum major diameter = maximum tap PD − Y + 0.64951904 P + W, with W = 0.08 P; maximum major diameter = minimum + X.",
      "Example: an M6 × 1 tap with standard limits has a pitch diameter from 5.3905 to 5.4155 mm and a major diameter from 6.08 to 6.121 mm."
    ],
    "limitations": [
      "Ground thread taps with lead angles up to 5° and the 60° M profile with a P/8 flat at the basic major diameter, as the standard assumes.",
      "The table allowances X, Y and Z depend on the pitch and size range; enter them from ASME B94.9 or the handbook’s Table 4 (for intermediate pitches use the next coarser pitch).",
      "The handbook prints the minimum pitch diameter formula with a plus sign and the D limit step as 0.0013; its worked examples use minus and 0.013 mm, as here.",
      "Lead and angle tolerances are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A D (oversize) tap cuts a larger thread, used where plating, soft material or a looser fit needs it; a DU tap cuts closer to the minimum.",
      "The tap major diameter follows the tap pitch diameter, so an oversize tap also has a larger major diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 904, 911–912. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "unified-tap-thread-limits": {
    "purpose": "Pitch diameter and major diameter limits of an ASME B94.9 Unified inch ground thread tap by the formulas the handbook gives: thread height and basic pitch diameter from the threads per inch, the minimum and maximum tap pitch diameters for the standard limits (minimum C over basic) or for an H (over basic) or L (under basic) limit number in steps of 0.0005 in, the equivalent limit number, the maximum major diameter from the specified tap pitch diameter with the constant A = 0.130 P, and the minimum major diameter with the tolerance B by threads per inch, with your measured diameters checked against them; the table allowances C and D for the size are entered by you.",
    "uses": [
      "Read what an H or L number on an inch tap means in diameters",
      "Check a measured inch tap before tapping a gauged thread",
      "Specify an oversize or undersize inch tap"
    ],
    "users": [
      "Toolroom and inspection staff",
      "Production engineers",
      "Tool buyers"
    ],
    "inputs": {
      "D": "Basic major diameter of the Unified thread, for example 0.375 for 3/8 in.",
      "n": "Threads per inch; the pitch is 1 ÷ TPI.",
      "lim": "Standard taps take the minimum pitch diameter C over basic from the table; H and L taps are marked with a number of 0.0005 in steps over or under basic.",
      "num": "Limit number marked on the tap after H or L; not used for the standard limits.",
      "C": "Amount over basic for the minimum pitch diameter for the threads per inch and diameter range, from the handbook’s Table 2 (ASME B94.9); also used for the major diameter.",
      "Dt": "Pitch diameter tolerance for the threads per inch and diameter range, from Table 2.",
      "PDm": "Pitch diameter you measured on the tap.",
      "Mm": "Major diameter you measured on the tap."
    },
    "outputs": [
      "Pitch, thread height and basic pitch diameter",
      "Minimum and maximum tap pitch diameter",
      "Equivalent H or L limit number",
      "Constant A, tolerance B and the major diameter limits",
      "Measured diameters against the limits, with millimetre equivalents"
    ],
    "method": [
      "P = 1 ÷ TPI; symmetrical thread height h = 0.64951905 P; basic pitch diameter = D − h.",
      "Standard: minimum tap PD = basic PD + C. H limit: maximum = basic PD + 0.0005 × number. L limit: minimum = basic PD − 0.0005 × number.",
      "The other limit uses the tolerance D: maximum = minimum + D, or minimum = maximum − D.",
      "Equivalent limit number = (maximum tap PD − basic PD) ÷ 0.0005 (H), or (basic PD − minimum tap PD) ÷ 0.0005 (L) when the tap is below basic.",
      "Maximum major diameter = minimum tap PD − C + 0.64951904 P + A, with A = 0.130 P; minimum major = maximum − B, with B = 0.087 P (48 to 80 TPI), 0.076 P (36 to 47) or 0.065 P (4 to 35).",
      "Example: a 0.375 in × 16 TPI tap with standard limits has a pitch diameter from 0.33541 to 0.33591 in, which is H 3."
    ],
    "limitations": [
      "Ground thread taps with lead angles up to 5°, as the standard assumes; cut thread taps use the handbook’s Table 3.",
      "C and D depend on the threads per inch and the diameter range; enter them from ASME B94.9 or the handbook’s Table 2 (for intermediate pitches use the next coarser pitch).",
      "The handbook’s Table 2 prints A for 12 TPI as 0.1080; the formula A = 0.130 P gives 0.0108, as used here.",
      "Lead and angle tolerances are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An H number gives the maximum tap pitch diameter in half-thousandths over basic; H3 for a 3/8-16 tap is 0.0015 in over.",
      "An oversize tap also carries a larger major diameter, because the major diameter is set from the tap pitch diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 904, 906–907, 909. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "slot-vs-high-speed-milling-cost": {
    "purpose": "Comparison of two end milling strategies by the handbook’s machining econometrics: spindle speed from cutting speed and cutter diameter, feed rate from teeth, feed per tooth and speed, cutting time for the cut length and passes, equivalent tooling-cost time from the edge replacement time and the cost of the edges at the hourly rate, and the total cost per part of cutting, tool changing and tooling for full slot milling and for high-speed milling, with the cost ratio, the saving per part and per batch, and a check of both spindle speeds against the machine.",
    "uses": [
      "Decide between slotting and a light radial-cut strategy for a feature",
      "Show the cost effect of more teeth or a higher feed per tooth",
      "Put a figure on the saving per batch for a process change"
    ],
    "users": [
      "Process and production engineers",
      "CNC programmers",
      "Estimators"
    ],
    "inputs": {
      "Dc": "Diameter of the end mill, the same for both strategies as in the handbook comparison.",
      "dist": "Length cut in one pass along the feed direction; the handbook example uses 1000 mm.",
      "HR": "Cost of the machine and operator per hour, excluding GST, from your machine-hour rate.",
      "qty": "Number of parts in the batch, for the saving per batch.",
      "nmax": "Highest spindle speed the machine can run, from its specification.",
      "zS": "Number of teeth on the cutter for slotting.",
      "fzS": "Feed per tooth for full slotting at the tool life you enter, from your tooling data.",
      "VS": "Cutting speed for full slotting at that tool life, from your tooling data.",
      "TS": "Tool life in minutes at the slotting speed and feed.",
      "pS": "Number of passes along the cut length to finish the part by slotting.",
      "trS": "Time to replace the set of edges or the cutter for regrinding, in minutes.",
      "ceS": "Cost of the set of edges, or of a regrind, excluding GST.",
      "zH": "Number of teeth on the cutter for high-speed milling.",
      "fzH": "Feed per tooth at the light radial cut (chip thinning allows a much higher feed), from your tooling data.",
      "VH": "Cutting speed at the light radial cut and the tool life you enter.",
      "TH": "Tool life in minutes at the high-speed conditions.",
      "pH": "Number of passes needed to finish the same part with the light radial cut; a full-width feature normally needs several.",
      "trH": "Time to replace the edges or the cutter for high-speed milling.",
      "ceH": "Cost of the edges or regrind for high-speed milling, excluding GST."
    },
    "outputs": [
      "Spindle speed and feed rate for each strategy",
      "Cutting time per part",
      "Equivalent tooling-cost time",
      "Total cost per part for each strategy",
      "Cost ratio, saving per part and saving per batch",
      "Spindle speeds against the machine"
    ],
    "method": [
      "Spindle speed rpm = 1000 V ÷ (π D); feed rate FR = z f_z rpm (mm/min).",
      "Cutting time per part = passes × Dist ÷ FR (minutes).",
      "Equivalent tooling-cost time T_V = T_RPL + 60 C_E ÷ HR (minutes).",
      "Total cost per part c_tot = HR × (passes × Dist ÷ FR) × (1 + T_V ÷ T) ÷ 60.",
      "Saving per part = c_tot(slot) − c_tot(high-speed); per batch = saving × parts; ratio = c_tot(high-speed) ÷ c_tot(slot).",
      "Example: slotting at 3,233.8 mm/min costs A$0.33787 per part and high-speed milling at 17,991 mm/min costs A$0.06073, 17.975 % of the slotting cost."
    ],
    "limitations": [
      "Costs of idle and slack time are not included, as in the handbook comparison; add handling and set-up with the milling cost tool.",
      "The feed per tooth, cutting speed and tool life for each strategy must come from your tooling data at the same tool life basis; the handbook values are for its example steel and cutters.",
      "Results hold for perfect milling conditions (no run-out, accurate sharpening), as the handbook notes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A light radial cut lets the feed per tooth rise sharply for the same chip thickness, so the feed rate and cost per part improve even when more passes are needed.",
      "More teeth raise the feed rate in both strategies but also the tooling cost per change; compare with the right edge cost."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1167–1169. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
