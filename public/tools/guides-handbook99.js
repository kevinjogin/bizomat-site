// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook99).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "rim-face-arrangement-shims": {
    "purpose": "Rim and face shaft alignment moves by the handbook’s sixteen dial indicator arrangements, each with its own signs in F = r ÷ (±2) + f B ÷ (±A) and R = r ÷ (±2) + f C ÷ (±A), with the face reading circle A and the distances B, C (and up to three more foot positions) measured from the rim indicator path, positive to one side and negative to the other as for motors with more than four feet, and the indicator bracket sag added to or taken from a vertical rim reading.",
    "uses": [
      "Work out shims when the indicators are mounted differently from the usual set-up",
      "Align a motor with more than four feet",
      "Correct a vertical rim reading for bracket sag"
    ],
    "users": [
      "Maintenance fitters",
      "Millwrights",
      "Reliability engineers"
    ],
    "inputs": {
      "arr": "The handbook figure whose indicator mounting matches yours; each has its own signs.",
      "plane": "Vertical readings give shims; horizontal readings give side-to-side moves.",
      "r": "Rim indicator reading in the reading position, with its sign.",
      "f": "Face indicator reading in the reading position, with its sign.",
      "A": "Diameter of the circle the face indicator button traces.",
      "B": "Axial distance from the rim indicator path to the front feet or front move point.",
      "C": "Axial distance from the rim indicator path to the rear feet or rear move point.",
      "nx": "Further pairs of feet, as on a motor with more than four feet.",
      "E1": "Distance to the first extra pair of feet.",
      "E2": "Distance to the second extra pair of feet.",
      "E3": "Distance to the third extra pair of feet.",
      "sag": "Total reading of the indicator and bracket rotated 180° on a rigid bar.",
      "zero": "Where the rim indicator was zeroed for the vertical readings.",
      "tol": "Your own alignment tolerance for the moves, if you want them checked."
    },
    "outputs": [
      "Shim change or move at the front and rear feet",
      "Shim change or move at up to three extra pairs of feet",
      "Rim reading after the sag correction",
      "Whether the moves are within your tolerance"
    ],
    "method": [
      "Choose the arrangement that matches the indicator mounting; its formulas are F = r ÷ (±2) + f B ÷ (±A) and R = r ÷ (±2) + f C ÷ (±A) with the signs of that figure.",
      "Distances are measured from the rim indicator path: to one side they enter as positive values and to the other as negative values, as the handbook does for motors with more than four feet; each foot uses the same formula with its own distance.",
      "Vertical readings: a rim indicator zeroed at 12 o’clock has its bracket sag added to the reading, one zeroed at 6 o’clock has it subtracted.",
      "A positive result adds shims (vertical) or moves the machine in the positive direction of the figure (horizontal); a negative result removes shims or moves it the other way.",
      "Example: arrangement 1 needs 1.0446 mm at the front feet and 2.5781 mm at the rear feet."
    ],
    "limitations": [
      "The readings must be taken after zeroing 180° from the reading position, as the handbook figures show.",
      "Correct for thermal growth separately; the readings are for the machines as measured.",
      "The handbook describes the sag correction for vertical readings taken at 12 and 6 o’clock.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Half the rim reading is the offset of the shafts at the rim indicator; the face reading divided by A is their angularity.",
      "If the diagram of the readings and the numbers seem to disagree, follow the numbers; the handbook diagrams are not to scale."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2627–2650. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "jackbolt-alignment-turns": {
    "purpose": "Jackbolt moves for horizontal shaft alignment as the handbook works them: one full turn advances the bolt by its pitch (1 ÷ TPI for inch threads, or the metric pitch), one flat of a square head by a quarter of that and one flat of a hex head by a sixth, so the turns are the move divided by the pitch and the flats the turns times the number of flats, rounded to the nearest flat.",
    "uses": [
      "Turn the side-to-side moves from an alignment into jackbolt turns",
      "Choose square or hex jackbolts for fine moves",
      "Check how close a whole number of flats gets to the move"
    ],
    "users": [
      "Maintenance fitters",
      "Millwrights",
      "Reliability engineers"
    ],
    "inputs": {
      "thr": "Whether the jackbolt has an inch or a metric thread.",
      "tpi": "Threads per inch of an inch jackbolt, e.g. 11 for 5/8-11.",
      "pitch": "Pitch of a metric jackbolt, e.g. 2 mm for M16.",
      "head": "Square heads have four flats and hex heads six.",
      "mF": "Side-to-side move at the front jackbolt from the alignment calculation.",
      "mR": "Side-to-side move at the rear jackbolt from the alignment calculation."
    },
    "outputs": [
      "Advance per turn and per flat",
      "Turns at the front and rear jackbolts",
      "Nearest whole number of flats and the move it gives",
      "What is left over after the nearest flat"
    ],
    "method": [
      "Advance per turn = pitch = 1 ÷ TPI (inch) or the metric pitch.",
      "Advance per flat = pitch ÷ 4 (square head) or pitch ÷ 6 (hex head).",
      "Turns = move ÷ pitch; flats = turns × number of flats, rounded to the nearest flat.",
      "The sign of the move gives the direction; push from the side the machine moves away from.",
      "Example: the front jackbolt needs 0.704 turn (3 flats) and the rear 1.001 turn (4 flats)."
    ],
    "limitations": [
      "The advance assumes the bolt bears straight on the machine foot with no take-up of slack or bending.",
      "Back off the jackbolts on the opposite side before advancing, and take a final set of readings after the move.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Heavy resistance while turning means a mechanical bind, not a rusty thread, as the handbook notes.",
      "Remove and store the jackbolts after the alignment is complete."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2631–2632. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "riveted-joint-strength-by-type": {
    "purpose": "Strength of riveted joints by the handbook’s formulas for six joint types: the resistances to shearing the rivets (πd²/4 times the number of rivet shear areas), tearing the plate between rivets ((P − D) t St, (P − 2D) t St, (P − 1½D) t St), crushing in front of the rivets (d t Sc) and the combined modes, the least of which is the safe load per pitch, the efficiency against the solid plate (P t St) and the safe load over the seam length, with the allowable stresses you enter.",
    "uses": [
      "Find the governing failure of a riveted seam",
      "Compare lap, cover plate and butt joints for a plate",
      "Check the safe load of a riveted joint over its length"
    ],
    "users": [
      "Machine designers",
      "Structural designers",
      "Fabricators"
    ],
    "inputs": {
      "type": "Joint arrangement as listed in the handbook’s riveted joint formulas.",
      "d": "Diameter of the rivet, used for its shear area and crushing area.",
      "Dh": "Diameter of the rivet hole, used for the net plate width when tearing.",
      "t": "Thickness of the main plate.",
      "tc": "Thickness of one cover plate; used in the triple-riveted butt joint.",
      "p": "Pitch along the seam of a lap joint, the repeating length of the joint.",
      "P": "Pitch of the outer row, the repeating length of cover plate and butt joints.",
      "Ss": "Allowable shear stress of the rivet from your code or practice.",
      "St": "Allowable tensile stress of the plate from your code or practice.",
      "Sc": "Allowable bearing stress of rivet and plate from your code or practice.",
      "Ls": "Length of the riveted seam that carries the load.",
      "Lreq": "Load the whole seam must carry, if you want it checked.",
      "e": "Distance from the plate edge to the centres of the edge rivets."
    },
    "outputs": [
      "Resistance of each way of failing per pitch",
      "Governing (least) resistance and joint efficiency",
      "Safe load over the seam length",
      "Edge distance check"
    ],
    "method": [
      "Lap joints repeat every p; cover plate and butt joints every P. Rivet shear area = πd²/4 per shear plane.",
      "Single lap: πd²/4 Ss; (p − D) t St; d t Sc. Double lap: 2πd²/4 Ss; (p − D) t St; 2 d t Sc.",
      "Single lap with inside cover: (P − D) t St; (P − 2D) t St + πd²/4 Ss; 3πd²/4 Ss; 3 t d Sc; (P − 2D) t St + t d Sc. Double lap with inside cover: (P − D) t St; 4πd²/4 Ss; (P − 1½D) t St + πd²/4 Ss; 4 t d Sc; (P − 1½D) t St + t d Sc.",
      "Double butt: (P − D) t St; 5πd²/4 Ss; (P − 2D) t St + πd²/4 Ss; 3 t d Sc; (P − 2D) t St + t d Sc. Triple butt: (P − D) t St; 9πd²/4 Ss; (P − 2D) t St + πd²/4 Ss; 4 d t Sc + πd²/4 Ss; 4 d t Sc + d tc Sc.",
      "Safe load per pitch = least resistance; efficiency = that ÷ (pitch × t × St); seam load = safe load per pitch × seam length ÷ pitch. Edge distance should be at least 1.5 rivet diameters.",
      "Example: the joint carries 69.599 kN over the seam at an efficiency of 52.155 %."
    ],
    "limitations": [
      "The formulas assume the load is shared equally by the rivets and the stresses are evenly spread, as the handbook’s simplified design assumptions do.",
      "Allowable stresses are set by the code, practice or specification you design to and are entered by you.",
      "Tearing or shearing out to the plate edge is avoided by the edge distance, not calculated.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The handbook’s worked examples use the rivet diameter for shear and bearing and the hole diameter for tearing; enter the same value in both to use the hole diameter throughout.",
      "A joint efficiency is the joint strength as a share of the solid plate strength."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1731–1734. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "uniform-strength-beam": {
    "purpose": "Beams of uniform strength throughout their length by the handbook’s tables: P = S b h² ÷ 6l for a cantilever with an end load (parabolic depth or triangular width), P = S b h² ÷ 3l for a cantilever with a uniformly distributed load (triangular depth or parabolic width), P = S b h² l ÷ 6ac for a simply supported beam with a load at any point (P = 2 S b h² ÷ 3l at the centre) and P = 4 S b h² ÷ 3l for a uniformly distributed load, solved for the load, the depth or the width, with the section at a chosen point from the outline the table gives.",
    "uses": [
      "Size a tapered lever, arm or cantilever for its load",
      "Find the safe load of a beam shaped for uniform strength",
      "Lay out the outline of a tapered beam"
    ],
    "users": [
      "Machine designers",
      "Structural designers",
      "Design engineers"
    ],
    "inputs": {
      "cs": "Support, load and outline as in the handbook’s Tables 3a and 3b.",
      "mode": "Whether to find the safe load or the depth or width for your load.",
      "S": "Safe bending stress of the material for your design.",
      "b": "Width of the beam at its largest section.",
      "h": "Depth of the beam at its largest section.",
      "l": "Length of a cantilever, or span between supports.",
      "a": "Distance of a concentrated load from the left support.",
      "P": "Load the beam must carry; the whole load for a distributed load.",
      "x": "Point along the beam at which to give the section."
    },
    "outputs": [
      "Safe load, or the depth or width needed",
      "Bending stress under your load",
      "Depth or width at the chosen point from the outline",
      "Whether the load is within the safe load"
    ],
    "method": [
      "Cantilever, end load: P = S b h² ÷ 6l. Cantilever, uniformly distributed load: P = S b h² ÷ 3l.",
      "Supported at both ends, load at any point: P = S b h² l ÷ 6ac, with a and c the distances from the load to the supports (2 S b h² ÷ 3l at the centre). Uniformly distributed: P = 4 S b h² ÷ 3l.",
      "Depth needed h = √(K P ÷ S b) and width needed b = K P ÷ S h², with P = S b h² ÷ K.",
      "Section at a point: the depth follows the parabola, triangle or ellipse of the outline, and the width the triangle or parabola, so that S stays the same along the beam.",
      "Example: the beam carries 8.3333 kN at a safe stress of 100 MPa."
    ],
    "limitations": [
      "The outlines taper to nothing at the ends where the moment is zero; leave enough section there to carry the shear and any fixing.",
      "The formulas give the bending strength only; check deflection, which is larger than for a uniform beam of the same largest section.",
      "S is your safe stress for the material and duty.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A beam of uniform strength uses less material than a uniform beam because every section is stressed to S.",
      "Leaf and plate springs are practical forms of the triangular width outline."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 271–272. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "nose-radius-finish-change": {
    "purpose": "The handbook’s rule of thumb from the machining econometrics section for the effect of tool nose radius on surface finish at the same ECT and speed: Ra1 ÷ Ra2 = (r2 ÷ r1)^0.5 in finishing, with roughing values 1.5 times the finishing values, compared with the inverse proportion of the simple geometric rule that the handbook says gives large errors, and the nose radius that would give a target Ra.",
    "uses": [
      "Estimate the finish after changing to an insert with a larger nose radius",
      "Choose a nose radius for a target Ra from a measured finish",
      "Compare the empirical and geometric nose radius rules"
    ],
    "users": [
      "CNC machinists",
      "Manufacturing engineers",
      "Process planners"
    ],
    "inputs": {
      "Ra1": "Roughness measured in finishing with the present insert.",
      "r1": "Nose radius of the present insert.",
      "r2": "Nose radius of the insert you are changing to.",
      "Rat": "The Ra you need, if you want the nose radius for it."
    },
    "outputs": [
      "Ra with the new nose radius in finishing and roughing",
      "Ratio of the finishes",
      "Ra by the simple geometric rule for comparison",
      "Nose radius for the target Ra"
    ],
    "method": [
      "Finishing, same ECT and speed: Ra2 = Ra1 × (r1 ÷ r2)^0.5.",
      "Roughing: Ra = 1.5 × the finishing value at the same ECT and speed.",
      "Simple geometric rule for comparison: Ra2 = Ra1 × r1 ÷ r2.",
      "Nose radius for a target finish: r = r1 × (Ra1 ÷ Ra target)².",
      "Example: changing from 0.8 mm to 1.6 mm takes a finish of 1.6 µm to about 1.1314 µm."
    ],
    "limitations": [
      "The rule holds for common practical ECT values and speeds; the work material, tool geometry and cutting conditions also affect the finish.",
      "Keep the equivalent chip thickness and speed the same when you compare; a larger nose radius at the same feed changes the ECT.",
      "Measure the finish after the change; this is an estimate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The geometric rule (Ra in proportion to feed squared over nose radius) overstates the gain from a larger nose radius, as the handbook explains.",
      "Roughing finishes are about half as good again as finishing at the same ECT."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1143–1144. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
