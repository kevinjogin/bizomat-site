// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook97).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "narrow-v-belt-rating": {
    "purpose": "Power rating of narrow V-belts by the ANSI/RMA IP-22 formula the handbook gives: HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log (dp r)] + KSR r per belt, with dp the small sheave pitch diameter in inches, r the faster shaft speed in thousands of rpm, the cross-section constants K1 to K4 and the speed ratio correction KSR; the rating times the length and arc of contact correction factors, the arc of contact 2 cos⁻¹ ((D − d) ÷ 2C), the belt speed, and the number of belts for the design power (power × service factor).",
    "uses": [
      "Find how many narrow V-belts a drive needs",
      "Check an existing drive against the belt ratings",
      "Compare cross sections and sheave sizes for a drive"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive and conveyor designers"
    ],
    "inputs": {
      "sec": "Narrow V-belt cross section.",
      "dp": "Pitch diameter of the smaller sheave.",
      "Dp": "Pitch diameter of the larger sheave.",
      "C": "Distance between the shaft centres.",
      "n": "Speed of the faster (smaller sheave) shaft.",
      "KSR": "Speed ratio correction read from the handbook table for the cross section and the speed ratio shown (0 for a ratio of 1.00).",
      "kL": "Length correction factor from the handbook table for the belt length.",
      "kA": "Arc of contact correction factor from the handbook table for the arc shown.",
      "P": "Power the drive must transmit.",
      "SF": "Service factor for the driver and driven machine.",
      "nb": "Number of belts you will fit on the sheaves."
    },
    "outputs": [
      "Speed ratio, belt speed and arc of contact",
      "Basic rating per belt corrected for speed ratio",
      "Rating per belt after length and arc corrections",
      "Design power and the number of belts needed"
    ],
    "method": [
      "dp and D in inches; r = rpm ÷ 1000; HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log₁₀(dp r)] + KSR r.",
      "K1, K2, K3, K4: 3VX 1.1691, 1.5295, 1.5229 × 10⁻⁴, 0.15960; 5VX 3.3038, 7.7810, 3.6432 × 10⁻⁴, 0.43343; 5V 3.3140, 10.123, 5.8758 × 10⁻⁴, 0.46527; 8V 8.6628, 49.323, 1.5804 × 10⁻³, 1.1669.",
      "Corrected rating = HP × length factor × arc factor (1 hp = 0.7457 kW).",
      "Arc of contact = 2 cos⁻¹ ((D − d) ÷ 2C); belts = design power ÷ corrected rating, rounded up.",
      "Example: one 5V belt carries 12.91 kW, so the drive needs 2 belts for 18 kW."
    ],
    "limitations": [
      "The constants are for ANSI/RMA narrow V-belts; belts from a particular maker may be rated differently.",
      "Use at least the minimum sheave diameter recommended for the cross section and speed.",
      "The rating formula falls off at high belt speeds; a zero or negative rating means the sheave is too small or too fast for the section.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The design power is the power to transmit times the service factor.",
      "Larger small sheaves raise the rating per belt and reduce the number of belts."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2492–2494. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "classical-v-belt-rating": {
    "purpose": "Power rating of classical V-belts by the ANSI/RMA IP-20 formulas the handbook gives: HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log (dp r)] + K2 r (1 − 1 ÷ KSR) per belt for each cross section (A, AX, B, BX, C, CX, D), with dp in inches and r the faster shaft speed in thousands of rpm; corrected by the length and arc of contact factors, with the speed ratio, belt speed, arc of contact and the number of belts for the design power.",
    "uses": [
      "Find how many classical V-belts a drive needs",
      "Compare wrapped and cogged belts of the same section",
      "Check an existing classical belt drive"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive and conveyor designers"
    ],
    "inputs": {
      "sec": "Classical V-belt cross section; X marks the cogged belts.",
      "dp": "Pitch diameter of the smaller sheave.",
      "Dp": "Pitch diameter of the larger sheave.",
      "C": "Distance between the shaft centres.",
      "n": "Speed of the faster (smaller sheave) shaft.",
      "KSR": "Speed ratio factor read from the handbook table for the speed ratio shown (1.0000 for a ratio of 1.00).",
      "kL": "Length correction factor from the handbook table for the belt length and section.",
      "kA": "Arc of contact correction factor from the handbook table for the arc shown.",
      "P": "Power the drive must transmit.",
      "SF": "Service factor for the driver and driven machine.",
      "nb": "Number of belts you will fit on the sheaves."
    },
    "outputs": [
      "Speed ratio, belt speed and arc of contact",
      "Basic rating per belt corrected for speed ratio",
      "Rating per belt after length and arc corrections",
      "Design power and the number of belts needed"
    ],
    "method": [
      "HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log₁₀(dp r)] + K2 r (1 − 1 ÷ KSR), dp in inches, r = rpm ÷ 1000.",
      "K1, K2, K3, K4: A 1.004, 1.652, 1.547 × 10⁻⁴, 0.2126; AX 1.462, 2.239, 2.198 × 10⁻⁴, 0.4238; B 1.769, 4.372, 3.081 × 10⁻⁴, 0.3658; BX 2.051, 3.532, 3.097 × 10⁻⁴, 0.5735; C 3.325, 12.07, 5.828 × 10⁻⁴, 0.6886; CX 3.272, 6.655, 5.298 × 10⁻⁴, 0.8637; D 7.160, 43.21, 1.384 × 10⁻³, 1.454.",
      "Corrected rating = HP × length factor × arc factor; belts = design power ÷ corrected rating, rounded up.",
      "Example: one B belt carries 4.0751 kW, so the drive needs 3 belts for 9 kW."
    ],
    "limitations": [
      "The constants are for ANSI/RMA classical V-belts; belts from a particular maker may be rated differently.",
      "Use at least the minimum sheave diameter recommended for the cross section and speed.",
      "A zero or negative rating means the sheave is too small or too fast for the section.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cogged (X) belts bend more easily and carry more on small sheaves.",
      "The design power is the power to transmit times the service factor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2499–2501. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "double-v-belt-tension": {
    "purpose": "Double V-belt drive by the ANSI/RMA IP-21 tension method the handbook gives, for a drive of two sheaves: belt speed S = r d ÷ 3.820 (thousands of ft/min), effective pull Te = 33 Pd ÷ S (lbf, Pd in hp), tight side tension TT = Te × R ÷ (R − 1) with the tension ratio factor read for the arc of contact, slack side tension TS = TT − Te, the allowable tight side tension per belt by the formulas Tr = K1 − K2 ÷ d − K3 S² − K4 log S for each cross section on each sheave, and the number of belts Nb = TT ÷ (Tr Kf) with the length-flex correction factor Kf.",
    "uses": [
      "Find the number of double V-belts for a drive",
      "Check the tight side tension against the belt allowable on each sheave",
      "Work out effective pull and slack side tension"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive and conveyor designers"
    ],
    "inputs": {
      "sec": "Double V-belt cross section.",
      "d": "Effective diameter of the smaller sheave.",
      "D": "Effective diameter of the larger sheave.",
      "C": "Distance between the shaft centres.",
      "n": "Speed of the faster (smaller sheave) shaft.",
      "RR": "Tension ratio factor R ÷ (R − 1) read from the handbook table for the arc of contact shown.",
      "Kf": "Length-flex correction factor read from the handbook table for the effective length ÷ number of sheaves.",
      "P": "Power the drive must transmit.",
      "SF": "Service factor for the driver and driven machine.",
      "nb": "Number of belts you will fit."
    },
    "outputs": [
      "Belt speed and arc of contact",
      "Effective pull, tight and slack side tensions",
      "Allowable tight side tension per belt on each sheave",
      "Number of belts needed"
    ],
    "method": [
      "d in inches, r = rpm ÷ 1000; S = r d ÷ 3.820; Pd = power × service factor in hp; Te = 33 Pd ÷ S lbf.",
      "TT = Te × R ÷ (R − 1); TS = TT − Te.",
      "Tr = 118.5 − 318.2 ÷ d − 0.8380 S² − 25.76 log₁₀ S (AA); 186.3 − 665.1 ÷ d − 1.269 S² − 39.02 log S (BB); 363.9 − 2060 ÷ d − 2.400 S² − 73.77 log S (CC); 783.1 − 7790 ÷ d − 5.078 S² − 156.1 log S (DD).",
      "Nb = TT ÷ (Tr Kf) on each sheave; the larger, rounded up, governs.",
      "Example: the tight side tension is 1,436.3 N and one belt allows 261.06 N on the small sheave, so the drive needs 6 belts."
    ],
    "limitations": [
      "This tool covers a drive of two sheaves; serpentine drives with several loaded sheaves follow the handbook’s fourteen steps around the drive.",
      "The tension formulas are not corrected for tension ratio or length-flex; the tool applies Kf as the handbook directs.",
      "The effective belt length is best found from a scaled layout, as the handbook advises.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Slip usually occurs first at the driver, which the tension ratio factor allows for.",
      "The smaller sheave allows less tension, so it usually decides the number of belts."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2505–2510. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "light-duty-v-belt-rating": {
    "purpose": "Power rating of light duty V-belts by the ANSI/RMA IP-23 formulas the handbook gives: HP = r [K1 d^0.91 ÷ r^0.09 − K2 − K3 r² d³] with d = d0 − 2a (the effective outside diameter of the small sheave less the 2a differential) in inches and r the faster shaft speed in thousands of rpm, for 3L, 4L and 5L sections; the rating divided by the combined correction factor for the driven machine and speed ratio, compared with the power the belt must carry.",
    "uses": [
      "Check a single light duty belt on a fractional horsepower drive",
      "Choose between 3L, 4L and 5L sections",
      "Find the smallest sheave that carries a small load"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive and conveyor designers"
    ],
    "inputs": {
      "sec": "Light duty V-belt cross section.",
      "d0": "Effective outside diameter of the smaller sheave.",
      "twoA": "Differential 2a from the handbook table for the section; subtracted from the outside diameter to give the diameter for rating.",
      "n": "Speed of the faster (smaller sheave) shaft.",
      "cf": "Combined correction factor from the handbook table for the driven machine and speed ratio; it allows for drive geometry and service.",
      "P": "Power the belt must transmit."
    },
    "outputs": [
      "Rating diameter d = d0 − 2a and belt speed",
      "Horsepower rating of the belt",
      "Rating corrected by the combined factor",
      "Check against the power to carry"
    ],
    "method": [
      "d = d0 − 2a in inches; r = rpm ÷ 1000.",
      "HP = r [K1 d^0.91 ÷ r^0.09 − K2 − K3 r² d³]: 3L 0.2164, 0.2324, 0.0001396; 4L 0.4666, 0.7231, 0.0002286; 5L 0.7748, 1.727, 0.0003641.",
      "Corrected rating = HP ÷ combined correction factor (1 hp = 0.7457 kW).",
      "Example: one 4L belt carries 0.48162 kW after correction, against 0.37 kW to carry."
    ],
    "limitations": [
      "Light duty belts are meant for a single belt on fractional horsepower drives; use industrial belts for heavier duty.",
      "The 2L section is not covered by the RMA standard.",
      "A zero or negative rating means the sheave is too small for the section at this speed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The combined correction factor already includes the service factor, so do not apply a separate one.",
      "The rating diameter is smaller than the outside diameter by the 2a differential."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2510–2513. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "v-ribbed-belt-rating": {
    "purpose": "Power rating of V-ribbed belts by the ANSI/RMA IP-26 formulas the handbook gives, per rib: HP = dp r [K1 ÷ (dp r)^0.09 − K2 ÷ dp − K3 (dp r)²] + K2 r (1 − 1 ÷ KSR) for J, L and M sections, with dp in inches and r the faster shaft speed in thousands of rpm; corrected by the length and arc of contact factors, with the speed ratio, belt speed, arc of contact and the number of ribs for the design power.",
    "uses": [
      "Find the number of ribs a V-ribbed belt needs",
      "Check a poly-V drive on small sheaves",
      "Compare J, L and M sections"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive and conveyor designers"
    ],
    "inputs": {
      "sec": "V-ribbed belt cross section.",
      "dp": "Pitch diameter of the smaller sheave.",
      "Dp": "Pitch diameter of the larger sheave.",
      "C": "Distance between the shaft centres.",
      "n": "Speed of the faster (smaller sheave) shaft.",
      "KSR": "Speed ratio factor read from the handbook table for the speed ratio shown.",
      "kL": "Length correction factor from the handbook table for the belt length and section.",
      "kA": "Arc of contact correction factor from the handbook table for (D − d) ÷ C.",
      "P": "Power the drive must transmit.",
      "SF": "Service factor for the driver and driven machine.",
      "nr": "Number of ribs on the belt you will fit."
    },
    "outputs": [
      "Speed ratio, (D − d) ÷ C, belt speed and arc of contact",
      "Basic rating per rib",
      "Rating per rib after length and arc corrections",
      "Design power and the number of ribs needed"
    ],
    "method": [
      "HP per rib = dp r [K1 ÷ (dp r)^0.09 − K2 ÷ dp − K3 (dp r)²] + K2 r (1 − 1 ÷ KSR), dp in inches, r = rpm ÷ 1000.",
      "K1, K2, K3: J 0.1240, 0.08663, 0.2318 × 10⁻⁴; L 0.5761, 0.8987, 1.018 × 10⁻⁴; M 1.975, 6.597, 3.922 × 10⁻⁴.",
      "Corrected rating = HP × length factor × arc factor; ribs = design power ÷ corrected rating per rib, rounded up.",
      "Example: one L rib carries 1.1496 kW, so the belt needs 7 ribs for 7.15 kW."
    ],
    "limitations": [
      "H and K sections are for specialised uses and are not covered by the formulas.",
      "V-ribbed belts run at higher tension than V-belts; check the shaft and bearing loads.",
      "A zero or negative rating means the sheave is too small or too fast for the section.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The arc of contact factor is read for (D − d) ÷ C, which the tool shows.",
      "The design power is the power to transmit times the service factor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2513–2518. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "variable-speed-belt-drive": {
    "purpose": "Variable-speed belt drive by the ANSI/RMA IP-25 rules the handbook gives: speed variation PDmax ÷ PDmin for a single variable sheave or (DR × DN) ÷ (dr × dn) for a compound drive with both sheaves variable, the belt power rating HP = dp r [K1 (dp r)^−0.09 − K2 ÷ dp − K3 (dp r)²] + Kr r (1 − 1 ÷ KSR) for the twelve standard cross sections (1422V to 4836V) at the small pitch diameter, corrected by the length and arc of contact factors, the number of belts for the design power, and the rim speed π Do × rpm of the variable sheave.",
    "uses": [
      "Find the speed range a variable-pitch belt drive can give",
      "Check the belt rating at the smallest working pitch diameter",
      "Check the rim speed of a variable sheave"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive and conveyor designers"
    ],
    "inputs": {
      "sec": "Variable-speed belt cross section: top width in sixteenths of an inch, then the groove angle.",
      "dp": "Smallest pitch diameter the small sheave works at, where the rating is lowest.",
      "n": "Speed of the faster shaft.",
      "KSR": "Speed ratio factor from the handbook table for the speed ratio of the drive.",
      "kL": "Length correction factor from the handbook table.",
      "kA": "Arc of contact correction factor from the handbook table.",
      "P": "Power the drive must transmit.",
      "SF": "Service factor for the driver and driven machine.",
      "nb": "Number of belts on the drive; variable-speed drives usually use one.",
      "mode": "One variable sheave with a fixed companion sheave, or both sheaves variable.",
      "PDmax": "Largest working pitch diameter of the variable (driver) sheave.",
      "PDmin": "Smallest working pitch diameter of the variable (driver) sheave.",
      "DNmax": "Largest working pitch diameter of the driven sheave in a compound drive.",
      "DNmin": "Smallest working pitch diameter of the driven sheave in a compound drive.",
      "Do": "Outside diameter of the variable sheave, for its rim speed.",
      "nv": "Speed of the variable sheave.",
      "vmax": "Largest rim speed the sheave material and design allow, from the sheave maker."
    },
    "outputs": [
      "Speed variation of the drive",
      "Basic rating per belt at the smallest pitch diameter",
      "Rating after length and arc corrections and the belts needed",
      "Rim speed of the variable sheave"
    ],
    "method": [
      "Speed variation = PDmax ÷ PDmin (one variable sheave) or (DR × DN) ÷ (dr × dn) (compound).",
      "HP = dp r [K1 (dp r)^−0.09 − K2 ÷ dp − K3 (dp r)²] + Kr r (1 − 1 ÷ KSR) with the constants printed for each section (dp in inches, r = rpm ÷ 1000).",
      "Corrected rating = HP × length factor × arc factor; belts = design power ÷ corrected rating, rounded up.",
      "Rim speed = π Do × rpm.",
      "Example: the drive gives a 2 : 1 speed variation and one belt carries 4.7102 kW at its smallest pitch diameter."
    ],
    "limitations": [
      "The pitch diameter range a section can attain is limited (Table 33 gives 2av for each section).",
      "Change the speed ratio only while the drive runs.",
      "For 4430V the source prints 7.854 in the bracket and 9.818 in the speed ratio term; the tool follows the print.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Rate the belt at its smallest working pitch diameter, where the rating is lowest.",
      "Single variable sheaves seldom exceed 3 : 1; compound drives reach about 10 : 1."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2518–2525. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "synchronous-belt-rating": {
    "purpose": "Ratings of synchronous belts by the ANSI/RMA IP-24 formulas the handbook gives: for MXL the torque rating Qr = d [2.63 − 3.21 × 10⁻³ d²] lbf·in for the 0.25 in belt (and the 0.12 and 0.19 in formulas), for XL, L, H, XH and XXH the power rating of the widest standard belt HP = d r [K1 − K2 (d r)²], with d the small pulley pitch diameter in inches from its teeth and pitch and r the faster shaft speed in thousands of rpm; the teeth in mesh factor (1.00 with six or more teeth, 0.20 less for each tooth below that), the belt width factor you read from the handbook table, the belt speed against the 6500 ft/min limit of the ratings, and the check against the design power.",
    "uses": [
      "Check that a timing belt is wide enough for a drive",
      "Find the torque an MXL belt carries on a small pulley",
      "Allow for drives with fewer than six teeth in mesh"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive and conveyor designers"
    ],
    "inputs": {
      "sec": "Synchronous belt section; the pitch is shown in brackets.",
      "z": "Number of teeth (grooves) on the smaller pulley.",
      "n": "Speed of the faster (smaller pulley) shaft.",
      "mesh": "Number of belt teeth engaged with the small pulley.",
      "mxlw": "Width of an MXL belt; the handbook gives a torque formula for each standard width.",
      "wf": "Width factor read from the handbook table for the belt width you chose; 1.00 for the widest standard width of the section (0.38 in XL, 1.00 in L, 3.00 in H, 4.00 in XH, 5.00 in XXH).",
      "P": "Power the drive must transmit.",
      "SF": "Service factor for the driver and driven machine."
    },
    "outputs": [
      "Pitch diameter of the small pulley and belt speed",
      "Torque or power rating of the belt",
      "Teeth in mesh factor and corrected rating",
      "Width factor needed and the check against the design power"
    ],
    "method": [
      "d = teeth × pitch ÷ π (inches); r = rpm ÷ 1000.",
      "MXL: Qr = d [1.13 − 1.38 × 10⁻³ d²] (0.12 in), d [1.88 − 2.30 × 10⁻³ d²] (0.19 in), d [2.63 − 3.21 × 10⁻³ d²] (0.25 in) lbf·in; power = Qr × speed.",
      "XL (0.38 in) d r [0.0916 − 7.07 × 10⁻⁵ (d r)²]; L (1.00) [0.436 − 3.01 × 10⁻⁴ (d r)²]; H (3.00) [3.73 − 1.41 × 10⁻³ (d r)²]; XH (4.00) [7.21 − 4.68 × 10⁻³ (d r)²]; XXH (5.00) [11.4 − 7.81 × 10⁻³ (d r)²] hp.",
      "Kz = 1.00 for six or more teeth in mesh and 0.2 × (teeth − 1) below six (0.80 for five, down to 0.20 for two); corrected rating = rating × Kz; capacity = corrected rating × width factor; width factor needed = design power ÷ corrected rating.",
      "Example: the widest H belt carries 15.227 kW on the small pulley, so a width factor of 0.45972 is needed."
    ],
    "limitations": [
      "The ratings hold for pulley surface speeds up to 6500 ft/min (33 m/s).",
      "The belt width should not exceed the small pulley diameter, or side thrust becomes excessive.",
      "Ratings for a particular maker’s belts may differ; check the minimum pulley size for the speed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With fewer than six teeth in mesh the rating falls by a fifth for each missing tooth.",
      "Double-sided belts have the same total rating as single-sided ones."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2534–2536. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
