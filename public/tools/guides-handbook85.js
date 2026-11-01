// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook85).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "cutter-clearance-grinding-setup": {
    "purpose": "Set-up for grinding the clearance (relief) angle on the teeth of plain milling cutters, face mills and form-relieved cutters by the handbook’s cutter grinding rules: the clearance angle the cut needs from the feed per revolution, land width, depth of cut, cutter diameter and the Brinell hardness of the work, the offset of the disc wheel centre above the cutter centre (wheel diameter × ½ × sin clearance), below the cutter centre (cutter diameter × ½ × sin clearance), the tooth rest drop with wheel and cutter centres in line (wheel diameter × cutter diameter × sin ½ clearance ÷ (wheel + cutter diameter)) and with a cup wheel, and the indicator drops for checking the relief on side and end teeth and the rake on the tooth face over a measuring distance.",
    "uses": [
      "Set up a tool and cutter grinder to sharpen a milling cutter",
      "Check that the clearance ground suits the feed, depth and material being cut",
      "Check relief and rake angles with a dial indicator"
    ],
    "users": [
      "Toolroom machinists",
      "Cutter grinders",
      "Machine shop supervisors"
    ],
    "inputs": {
      "setup": "How the clearance is ground: with the periphery of a disc wheel offset above or below the cutter centre, with wheel and cutter centres in line and the tooth rest lowered, or with the face of a cup wheel.",
      "Dc": "Outside diameter of the milling cutter being sharpened.",
      "Dw": "Diameter of the disc grinding wheel (not used for a cup wheel).",
      "cl": "Primary clearance angle you intend to grind on the peripheral teeth.",
      "F": "Feed per revolution of the cutter in the cut (feed per tooth × number of teeth).",
      "L": "Width of the land behind the cutting edge; the handbook gives about 0.4, 0.8 and 1.6 mm for small, medium and large cutters.",
      "d": "Depth of cut the cutter takes.",
      "B": "Brinell hardness number of the work material.",
      "dist": "Distance the cutter or indicator is moved in a straight line for the indicator-drop check of side and end teeth or the tooth face.",
      "rake": "Rake angle of the tooth face to be checked with the indicator."
    },
    "outputs": [
      "Clearance angle needed by the cut",
      "Wheel or tooth-rest offset for the set-up chosen",
      "Offsets for all four set-ups",
      "Indicator drop for the relief on side and end teeth",
      "Indicator drop for the rake angle of the tooth face"
    ],
    "method": [
      "Clearance needed C = (45860 ÷ (D B)) (1.5 L + (F ÷ (π D)) √(d (D − d))) degrees, with F, L, d and D in inches (mm ÷ 25.4) and B the Brinell number.",
      "Disc wheel above centre: offset of the wheel centre = wheel diameter × ½ × sin clearance.",
      "Disc wheel below centre: offset of the wheel centre = cutter diameter × ½ × sin clearance.",
      "Centres in line: tooth rest below the centre line = wheel diameter × cutter diameter × sin(½ clearance) ÷ (wheel diameter + cutter diameter).",
      "Cup wheel: tooth rest below the cutter centre = cutter diameter × ½ × sin clearance.",
      "Indicator drop over a straight measuring distance = distance × tan(angle), which reproduces the handbook’s Tables 3 and 4 for side and end relief and face rake.",
      "Example: a 100 mm cutter cutting 200 HB work at 1 mm/rev and 3 mm deep needs about 2.8761° clearance; to grind 5° with a 150 mm wheel set the wheel centre 6.5367 mm above the cutter centre."
    ],
    "limitations": [
      "The clearance formula is the handbook’s general rule for plain milling cutters, face mills and form-relieved cutters; it uses inch units, so millimetre inputs are converted.",
      "A disc wheel leaves the land slightly hollow, which reduces the effective clearance more with small wheels; the offsets set the angle at the cutting edge.",
      "The indicator-drop rule is for straight-line checks of side teeth, end teeth and rake; the radial relief on peripheral teeth is checked by rotating the cutter against the handbook’s Table 1.",
      "Secondary clearance of 3 to 5 degrees behind the primary land is ground the same way at the larger angle.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Grind at least the clearance the cut needs: a land that rubs heats the edge and wears it quickly; much more weakens the edge.",
      "Offsets grow with the wheel diameter above centre and with the cutter diameter below centre; measure both after dressing and resharpening."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 838–843. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spline-shaft-milling-cutter": {
    "purpose": "Proportions of a special milling cutter that forms the space between adjacent splines of a straight-sided splined shaft, by the handbook formulas: the cutter angle B = 360° ÷ N, the angle A between the centre line of a spline and a radial line through the point where its side meets the root circle (sin A = W ÷ d), and the chordal width C = d sin(180° ÷ N − A) at the root circle between adjacent splines, which is the chordal width across the concave edge of the cutter.",
    "uses": [
      "Order or grind a formed cutter for milling a splined shaft",
      "Check the space between splines at the root diameter",
      "Set up a dividing head job for a straight-sided spline"
    ],
    "users": [
      "Toolroom machinists",
      "Repair shops",
      "Tool designers"
    ],
    "inputs": {
      "Ns": "Number of splines around the shaft.",
      "W": "Width of each spline across its parallel sides.",
      "d": "Root diameter of the splined shaft, where the cutter forms the bottom of each space."
    },
    "outputs": [
      "Cutter angle B = 360° ÷ N",
      "Angle A at the root circle",
      "Chordal width C across the cutter’s concave edge",
      "Space between splines as a share of the pitch at the root"
    ],
    "method": [
      "B = 360° ÷ N.",
      "sin A = W ÷ d, where A is the angle between the centre line of a spline and a radial line through the intersection of the root circle and one side of the spline.",
      "C = d sin(180° ÷ N − A), the chordal width at the root circle between adjacent splines.",
      "Example: 6 splines 6 mm wide on a 23 mm root diameter need a cutter angle of 60° and a chordal width of 5.9056 mm at the root."
    ],
    "limitations": [
      "For straight-sided splines milled one space at a time; hobbing is the more efficient method in production.",
      "Involute splines are made by other tools (the involute spline tools).",
      "The cutter width is the chord at the root circle; allow for the fit and tolerance of the spline width.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The chordal width falls quickly as splines are made wider or more numerous; when it approaches zero the spaces can no longer be milled with one cutter pass."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 836. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "top-knurling-cam-rise": {
    "purpose": "Cross-slide (top) knurling on an automatic screw machine by the handbook method: the distance the knurl travels from first contact to the centre of the work at full tooth depth, c = √((R + r)² − (R + r − d)²) from the stock radius, the knurl radius and the depth of the teeth, which is the cam rise required; the revolutions to knurl at the feed per revolution, and the time at the spindle speed. The tooth depth can be entered or found from the circular pitch and included angle of a sharp V tooth.",
    "uses": [
      "Lay out the knurling lobe of a screw machine cam",
      "Find the revolutions and time a knurling operation adds to the cycle",
      "Compare knurling feeds"
    ],
    "users": [
      "Screw machine setters",
      "Cam designers",
      "Production engineers"
    ],
    "inputs": {
      "Dst": "Diameter of the bar stock being knurled; the formula uses the radius R.",
      "Dk": "Outside diameter of the knurl; the formula uses its radius r.",
      "depthFrom": "Find the depth of the teeth from the knurl’s circular pitch and tooth angle, or enter it.",
      "pc": "Circular pitch of the knurl teeth (25.4 ÷ diametral pitch for inch knurls; 32 pitch is 0.79375 mm).",
      "ang": "Included angle of the knurl teeth, for example 90° for brass as in the handbook example.",
      "dg": "Depth of the knurled teeth, used when you enter it directly.",
      "f": "Feed of the knurl per spindle revolution for top knurling, from your screw machine feed data.",
      "n": "Spindle speed while knurling."
    },
    "outputs": [
      "Depth of the teeth",
      "Travel from contact to centre, the cam rise required",
      "Revolutions to knurl",
      "Time to knurl"
    ],
    "method": [
      "R = stock diameter ÷ 2; r = knurl diameter ÷ 2.",
      "Depth of a sharp V tooth d = circular pitch ÷ (2 tan(½ included angle)); for 90° teeth this is half the circular pitch.",
      "c = √((R + r)² − (R + r − d)²), the distance the knurl travels from first contact to the centre of the work.",
      "Revolutions = c ÷ feed per revolution; time = revolutions ÷ spindle speed.",
      "Example: a 15.875 mm knurl on 7.9375 mm stock with 0.39688 mm deep teeth needs a cam rise of 3.0485 mm, 24.004 revolutions at 0.127 mm/rev."
    ],
    "limitations": [
      "Inch or metric units may be used in the formula; this tool works in millimetres.",
      "The depth found from the pitch is that of a sharp V; worn knurls and rounded crests give a little less.",
      "Add any dwell revolutions you want at full depth, and the quick rise off centre, when laying out the cam.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A higher permissible feed shortens the knurling time in proportion; spiral knurling from the turret runs faster than diamond knurling."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1170. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rubber-pad-forming-pressure": {
    "purpose": "Rubber pad forming (the Guerin process) by the handbook: the total pad forming pressure p = F × 2000 ÷ A (F press capacity in tons, A pad area in square inches), here in SI as press force divided by pad area, compared with the forming pressure your part needs, and the pad thickness against the height of the rigid form block (usually three times the block height and never less than 1.5 times), with the pad hardness against the 50 to 70 Shore range the handbook gives.",
    "uses": [
      "Check that a press can form a part by the rubber pad process",
      "Size the pad container area for a forming pressure",
      "Check the pad thickness for a form block"
    ],
    "users": [
      "Sheet metal tooling engineers",
      "Aerospace fabricators",
      "Press shop supervisors"
    ],
    "inputs": {
      "F": "Force the press can apply to the pad container.",
      "A": "Area of the rubber pad in its container, in plan.",
      "t": "Thickness of the rubber or polyurethane pad.",
      "shore": "Durometer hardness of the pad; the handbook gives 50 to 70 Shore for Guerin pads.",
      "h": "Height of the rigid form block above the press bed.",
      "preq": "Pressure the part needs to form fully, from your trials or forming data for the material, thickness and smallest radius."
    },
    "outputs": [
      "Pad forming pressure",
      "Pressure against the pressure needed",
      "Pad thickness as a multiple of the form block height",
      "Pad hardness against the usual range"
    ],
    "method": [
      "Pad pressure p = press force ÷ pad area (handbook: p = F × 2000 ÷ A psi with F in tons and A in square inches).",
      "Pad thickness ÷ form block height: usually 3, at least 1.5.",
      "Pad hardness: 50 to 70 Shore.",
      "Example: 4000 kN on a 400000 mm² pad gives 10 MPa against 7 MPa needed; the pad is 3 times the form block height."
    ],
    "limitations": [
      "The pressure is an average over the pad area; it is uniform on the blank, which is why the process thins the material very little.",
      "Radii formed by a rubber pad are larger than those from rigid dies; very small radii need more pressure or a different process.",
      "The forming pressure the part needs is not calculated here; enter it from trials or forming data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A smaller pad (or container) raises the pressure for the same press; several small parts on one table share the pad area.",
      "A pad thinner than 1.5 times the block height is overstrained and wears quickly."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1364–1365. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-angular-backlash": {
    "purpose": "Angular backlash of a pair of gears from the backlash on the pitch circles by the handbook formulas: the angular movement of the larger gear with the smaller held, 6875 B ÷ D minutes, and of the smaller gear with the larger held, 6875 B ÷ d minutes, with the angular play also in degrees and arc-seconds; and the approximate relation used when tooth thickness is checked on a variable-centre-distance fixture, change in tooth thickness (or backlash) = 2 × change in centre distance × tan(transverse pressure angle), so a centre distance change can be turned into a backlash change.",
    "uses": [
      "Convert a gear backlash into the angular play at each shaft",
      "Find how much backlash a centre distance adjustment adds or removes",
      "Interpret a variable-centre-distance gear check"
    ],
    "users": [
      "Gear designers",
      "Machine designers",
      "Inspection technicians"
    ],
    "inputs": {
      "Bk": "Backlash between the gears measured on the pitch circles.",
      "D": "Pitch diameter of the larger gear.",
      "d": "Pitch diameter of the smaller gear.",
      "dC": "Change in the centre distance from the one at which the backlash was measured; positive when the gears move apart.",
      "phi": "Transverse pressure angle of the gears, 20° for most modern spur gears.",
      "maxSmall": "Largest angular play you accept at the smaller gear (often the motor or input side)."
    },
    "outputs": [
      "Angular backlash of the larger gear",
      "Angular backlash of the smaller gear",
      "Backlash change from the centre distance change",
      "Backlash and angular play after the change"
    ],
    "method": [
      "θ_D = 6875 B ÷ D minutes (larger gear rocked, smaller held); θ_d = 6875 B ÷ d minutes (smaller gear rocked, larger held).",
      "6875 = 2 × 180 × 60 ÷ π (rounded): the backlash divided by the pitch radius, in minutes.",
      "Change in backlash ≈ 2 × change in centre distance × tan(pressure angle), the handbook’s approximation for tooth thickness change on a variable-centre fixture.",
      "Example: 0.1 mm backlash gives 3.4375′ of play at the 200 mm gear and 13.75′ at the 50 mm pinion; moving the centres apart by 0.02 mm adds about 0.014559 mm."
    ],
    "limitations": [
      "The backlash is the one on the pitch circle; backlash measured normal to the teeth is smaller by the cosine of the pressure angle (and helix angle for helical gears).",
      "The centre distance relation is approximate and applies to small changes.",
      "The backlash a gear set needs is set by its accuracy, temperature range and duty; enter the backlash you have or intend.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The smaller gear always rocks through the larger angle; on a reduction drive the motor side sees the play multiplied by the ratio.",
      "Adjusting the centre distance is a common way to set backlash at assembly in spur and helical gearing."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2168–2169. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "unified-cut-thread-tap-limits": {
    "purpose": "Thread limits of Unified inch cut thread taps by the formulas of ASME B94.9 Table 3 that the handbook gives: minimum major diameter = basic diameter + B + C, maximum major diameter = minimum major + A, minimum pitch diameter = basic pitch diameter + B, maximum pitch diameter = minimum pitch diameter + D, where C is 20 % of the theoretical truncation for 2 to 5½ threads per inch and 25 % for 6 to 80 (calculated here), and the tolerances A and D and the amount B are entered from the table for the tap diameter and pitch. A measured tap is checked against the limits, with the lead tolerance of ±0.003 in in any inch.",
    "uses": [
      "Check a cut thread tap before tapping production holes",
      "Specify a special cut thread tap",
      "Compare cut and ground tap limits"
    ],
    "users": [
      "Quality inspectors",
      "Toolroom staff",
      "Manufacturing engineers"
    ],
    "inputs": {
      "Dn": "Basic major diameter of the Unified thread, for example 0.25 in for 1/4-20.",
      "n": "Threads per inch; the pitch is 1 ÷ n.",
      "A": "Major diameter tolerance A from Table 3 for the tap diameter.",
      "B": "Amount over basic for the minimum pitch diameter B from Table 3 for the diameter and threads per inch.",
      "Dt": "Pitch diameter tolerance D from Table 3 for the diameter and the thread series (coarser than NF, or NF and finer).",
      "PDm": "Pitch diameter of the tap measured over wires or with a thread micrometer.",
      "Mm": "Major diameter of the tap measured over the crests."
    },
    "outputs": [
      "Basic pitch diameter",
      "Constant C for the threads per inch",
      "Minimum and maximum major diameter",
      "Minimum and maximum pitch diameter",
      "Measured tap against the limits"
    ],
    "method": [
      "Basic pitch diameter = basic diameter − 0.649519 ÷ n.",
      "C = 20 % (2 to 5½ threads per inch) or 25 % (6 to 80) of the theoretical truncation 0.216506 ÷ n.",
      "Minimum major = basic diameter + B + C; maximum major = minimum major + A.",
      "Minimum pitch diameter = basic pitch diameter + B; maximum = minimum + D.",
      "Example: a 1/4-20 cut thread tap has pitch diameter limits 0.21802 to 0.22002 in and major diameter limits 0.25321 to 0.25571 in."
    ],
    "limitations": [
      "The formulas are ASME B94.9-1999 Table 3 for cut thread taps; ground thread taps are in the Unified inch ground thread tap tool.",
      "Take A, B and D from Table 3; taps over 1½ in with 10 or more threads per inch take the NF and finer tolerances.",
      "Half-angle tolerances (Table 3) and the lead tolerance are checked separately on a thread comparator or lead tester.",
      "The handbook’s table prints C = 0.0078 in for 6 threads per inch, where 25 % of the truncation gives 0.0090 in; the tool uses the formula.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The tap is made above basic so that it cuts a thread inside the nut’s limits after tap oversize; a tap below the minimum pitch diameter cuts tight threads.",
      "Use the same Table 3 row for A and D as the tap diameter and series."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 910. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "silent-chain-width": {
    "purpose": "Silent chain width by the rules the handbook gives with the American Chain Association ratings: horsepower capacity per inch of width = rating per inch ÷ service factor, and the chain width for a given power = power × service factor ÷ rating per inch. Here in kilowatts with the rating per 25.4 mm of width entered from the rating table for the pitch, the small sprocket teeth and its speed, giving the width needed and the capacity of the width you choose, with the lubrication type the rating table shows.",
    "uses": [
      "Choose a silent chain width for a drive",
      "Check the capacity of an existing silent chain",
      "Compare pitches for a drive by the width each needs"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Drive specialists"
    ],
    "inputs": {
      "P": "Power transmitted by the drive.",
      "SF": "Service factor for the driver and driven machine from the chain maker’s or handbook’s service factor table.",
      "rate": "Power rating per inch (25.4 mm) of chain width from the rating table for the chain pitch, the number of teeth on the small sprocket and its speed (1 hp = 0.7457 kW).",
      "wChosen": "Width of the chain you intend to use, from the standard widths for the pitch.",
      "lube": "Type of lubrication the rating table shows at that pitch, sprocket and speed.",
      "lubeHave": "Type of lubrication the drive will actually have; it must be the type shown or better."
    },
    "outputs": [
      "Capacity per 25.4 mm of width after the service factor",
      "Chain width needed",
      "Capacity of the width chosen",
      "Lubrication check"
    ],
    "method": [
      "Capacity per inch of width = rating per inch ÷ service factor.",
      "Width needed = power × service factor ÷ rating per inch (× 25.4 mm).",
      "Capacity of the chosen width = (width ÷ 25.4) × rating per inch ÷ service factor.",
      "The drive must have the lubrication type the rating shows or a better one (I < II < III).",
      "Example: 30 kW with a service factor of 1.4 at 9 kW per inch needs 118.53 mm of chain; the 127 mm chain carries 32.143 kW."
    ],
    "limitations": [
      "The ratings are for a life of about 15,000 hours under the conditions of the rating tables; take them from the table for your pitch, sprocket and speed.",
      "Chain widths come in standard steps for each pitch; choose the next standard width above the width needed.",
      "Sprocket sizes, chain length and centre distance are in the silent chain drive check tool.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the width needed is large, a larger pitch or a faster small sprocket (more teeth) raises the rating per inch.",
      "The lubrication type matters as much as the width: a chain run with poorer lubrication than the rating assumes wears out early."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3475–3476. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
