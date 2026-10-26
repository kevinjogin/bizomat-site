// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook53).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "porter-governor-check": {
    "purpose": "Check of a loaded (Porter) or simple fly-ball governor with equal arms pivoted on the spindle axis: governor height at the working speed and the ends of the control range, sleeve height change and coefficient of speed variation (as the fly-ball governor tool), the ball radius from the arm length and height, and the centrifugal force on each ball at that radius (as the centrifugal force tool), checked against the sleeve travel you need and the largest speed variation you accept.",
    "uses": [
      "Check a mechanical governor for an engine or turbine",
      "Choose a central load for the speed range",
      "Teach governor sensitivity"
    ],
    "users": [
      "Mechanical engineers",
      "Restoration engineers",
      "Students"
    ],
    "inputs": {
      "w": "Mass of each fly-ball.",
      "c": "Mass of the central (sleeve) load of a Porter governor; 0 for a simple Watt governor.",
      "n": "Normal running speed of the governor spindle.",
      "nmin": "Lowest speed of the control range.",
      "nmax": "Highest speed of the control range.",
      "La": "Length of each arm from its pivot on the axis to the ball centre.",
      "travel": "Sleeve movement the control linkage needs over the range.",
      "Cmax": "Largest speed variation over mean speed you accept."
    },
    "outputs": [
      "Height at speed and over the range",
      "Sleeve travel and speed variation",
      "Ball radius and centrifugal force"
    ],
    "method": [
      "Height h = (g ÷ ω²) × (c + w) ÷ w at each speed; sleeve change = h_min − h_max; coefficient of speed variation = (n_max − n_min) ÷ mean (as the fly-ball governor tool).",
      "Ball radius r = √(L² − h²) for arms pivoted on the axis.",
      "Centrifugal force on a ball = w ω² r (as the centrifugal force tool).",
      "Example: at 200 rpm the governor stands 134.14 mm high with the balls at 148.35 mm radius carrying 130.14 N; the sleeve moves 26.962 mm over the range."
    ],
    "limitations": [
      "Frictionless, symmetric governor with arms pivoted on the axis.",
      "Steady speeds; hunting and damping are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A heavier central load raises the speed the governor works at without changing its sensitivity."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3453–3455, 187–190. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "overhang-beam-uplift-check": {
    "purpose": "Check of a beam on two supports with a point load at the tip of an overhang (a runway extension, a jib on a frame, a cantilevered platform beam): the reactions, including the uplift at the back support, the moment over the front support, bending stress and tip deflection (as the overhanging beam tool), the tension per anchor bolt at the back support, and checks against the allowable stress, bolt capacity, front support capacity and tip deflection limit.",
    "uses": [
      "Check a beam extended past its support to carry a hoist",
      "Size hold-down bolts for an overhanging platform",
      "Check tip deflection of an overhang"
    ],
    "users": [
      "Structural designers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "L": "Distance between the back and front supports.",
      "a": "Length of the overhang beyond the front support.",
      "P": "Load at the end of the overhang (include an allowance for dynamic effects).",
      "E": "Elastic modulus.",
      "I": "Second moment of area about the bending axis.",
      "c": "Distance from the neutral axis to the extreme fibre.",
      "allow": "Allowable bending stress.",
      "nb": "Number of anchor bolts holding the back support down.",
      "Tbolt": "Allowable tension of each anchor bolt and its anchorage.",
      "Rmax": "Load the front support can carry.",
      "dRatio": "Tip deflection limit as the overhang length divided by this number."
    },
    "outputs": [
      "Reactions and uplift",
      "Bending stress and tip deflection",
      "Anchor bolt tension"
    ],
    "method": [
      "Back reaction R₁ = −P a ÷ L (uplift); front reaction R₂ = P (L + a) ÷ L; moment at the front support = P a (as the overhanging beam tool).",
      "Stress = P a c ÷ I; tip deflection = P a² (L + a) ÷ 3EI (as the overhanging beam tool).",
      "Bolt tension = uplift ÷ number of bolts.",
      "Example: the back support is pulled up with 1,066.7 N (533.33 N per bolt); the tip drops 2.0267 mm; stress 20 MPa."
    ],
    "limitations": [
      "Prismatic beam, rigid supports; support flexibility adds to the tip deflection.",
      "Static load; moving hoists need a dynamic allowance in P.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A short back span makes the uplift large: lengthen the span or add holding-down weight."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 257–262. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "beam-drop-impact-check": {
    "purpose": "Check of a fabricated or rolled I-section beam struck by a falling load: area, mass per metre, second moment and section modulus of the I-section from its flange and web sizes (as the section properties tool), then the static deflection and stress, the impact factor from the drop height and the dynamic stress and deflection for a simply supported or cantilever beam (as the impact load on a beam tool), against your allowable stress and deflection limit.",
    "uses": [
      "Check a beam under a hoist for an accidental drop",
      "Check a guard or stop beam for a falling part",
      "Compare beam sections for impact"
    ],
    "users": [
      "Design engineers",
      "Safety engineers",
      "Structural designers"
    ],
    "inputs": {
      "Hs": "Overall depth of the I-section.",
      "B": "Width of the flanges.",
      "tf": "Thickness of each flange.",
      "tw": "Thickness of the web.",
      "rho": "Density of the beam material.",
      "support": "How the beam is supported and where the load strikes.",
      "mass": "Mass of the falling object.",
      "h": "Height the object falls before it touches the beam.",
      "L": "Span between supports, or the cantilever length.",
      "E": "Elastic modulus.",
      "allow": "Allowable stress for the impact case (often close to yield for an accidental drop).",
      "dMax": "Largest deflection you accept during the impact."
    },
    "outputs": [
      "Section properties",
      "Static and dynamic deflection",
      "Impact factor and dynamic stress"
    ],
    "method": [
      "I-section built from two flanges and a web: area, I_x, and c = depth ÷ 2 (as the section properties tool).",
      "Static deflection δ_st = W L³ ÷ 48EI (simply supported) or ÷ 3EI (cantilever); impact factor = 1 + √(1 + 2h ÷ δ_st) (as the impact load on a beam tool).",
      "Dynamic stress and deflection = factor × static values.",
      "Example: I = 20.983 × 10⁶ mm⁴; the impact factor is 161.24, giving 75.358 MPa and 1.256 mm."
    ],
    "limitations": [
      "Energy method ignoring the beam’s own mass, which lowers the impact factor for heavy beams.",
      "Local crushing under the impact point and flange buckling are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A stiffer beam has a smaller static deflection and so a larger impact factor: impact resistance comes from energy absorption, not stiffness alone."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 278, 234–246. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "silent-chain-drive-check": {
    "purpose": "Layout check of a silent (inverted-tooth) chain drive: pitch, outside and guide-groove diameters and the over-pin gauge for both sprockets (as the silent chain sprocket tool), chain length in pitches rounded to an even number of links, the exact centre distance for that length, chain speed and wrap on the small sprocket (as the chain length tool), the ratio and driven speed, checked against your chain speed limit, least small-sprocket teeth and least wrap.",
    "uses": [
      "Lay out a silent chain drive",
      "Check sprocket blanks and gauge sizes",
      "Order chain length for a fixed centre distance"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machinists"
    ],
    "inputs": {
      "P": "Pitch of the silent chain.",
      "z1": "Teeth on the small (driving) sprocket.",
      "z2": "Teeth on the large sprocket.",
      "C": "Centre distance you plan.",
      "rpm": "Speed of the small sprocket.",
      "vMax": "Highest chain speed for the chain type and lubrication (from the maker).",
      "zMin": "Fewest teeth you accept on the small sprocket for smooth running.",
      "wrapMin": "Least wrap angle you accept on the small sprocket."
    },
    "outputs": [
      "Sprocket diameters and gauge sizes",
      "Chain links and exact centre distance",
      "Chain speed, wrap and ratio"
    ],
    "method": [
      "Pitch diameter = P ÷ sin(180° ÷ N); outside = P (cot(180° ÷ N) + 0.08); guide groove = P (cot(180° ÷ N) − 1.16); over-pin gauge from the handbook formulas (as the silent chain sprocket tool).",
      "Length in pitches = 2C ÷ P + (N₁ + N₂) ÷ 2 + [(N₂ − N₁) ÷ 2π]² ÷ (C ÷ P), rounded up to an even number; exact centre distance for that length (as the chain length tool).",
      "Chain speed = P N₁ n ÷ 60 000; wrap = 180° − 2 sin⁻¹[(D₂ − D₁) ÷ 2C].",
      "Example: sprockets 85.211 and 169.94 mm pitch diameter; order 96 links for 407.36 mm centres; chain speed 5.334 m/s."
    ],
    "limitations": [
      "Sprocket formulas for 3/8 in (9.525 mm) and larger pitches.",
      "Layout only: power rating comes from the chain maker’s tables.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Silent chains run quietly at high speed, but only if the small sprocket has enough teeth."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3457–3460, 2537–2560. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "jaw-clutch-milling-setup": {
    "purpose": "Set-up for milling saw-tooth, V-shaped or straight-sided jaw clutch teeth: the angle to tilt the dividing head so a single- or double-angle cutter forms the tooth faces (as the clutch teeth dividing-head tool), the angle between teeth and the simple indexing setting for the tooth count (as the simple indexing tool), with notes for odd and even tooth counts.",
    "uses": [
      "Mill a replacement jaw or dog clutch",
      "Set the dividing head angle for saw-tooth clutch teeth",
      "Check whether the tooth count can be simply indexed"
    ],
    "users": [
      "Machinists",
      "Toolroom staff",
      "Maintenance fitters"
    ],
    "inputs": {
      "type": "Form of the clutch teeth.",
      "Nt": "Number of teeth on the clutch.",
      "theta": "Angle of the single-angle cutter, or the included angle of the double-angle cutter.",
      "ratio": "Worm ratio of the dividing head.",
      "plates": "Index plates you have."
    },
    "outputs": [
      "Dividing-head angle",
      "Angle between teeth",
      "Index setting"
    ],
    "method": [
      "Saw-tooth: cos α = tan(360° ÷ N) ÷ (2 tan θ); V-shaped: cos α = tan(180° ÷ N) ÷ (2 tan(θ ÷ 2)); straight-sided: head vertical (as the clutch teeth dividing-head tool).",
      "Angle between teeth = 360° ÷ N.",
      "Crank turns = ratio ÷ N: whole turns plus holes in a circle where the remainder × circle ÷ N is whole (as the simple indexing tool).",
      "Example: tilt the head to 27.321° and index 8 whole turns between teeth."
    ],
    "limitations": [
      "Handbook set-up for the cutter on the clutch centre line.",
      "Simple indexing only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With straight-sided teeth and an odd count, one pass cuts the sides of two teeth at once."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2452–2454, 2107–2121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "snatch-block-load-check": {
    "purpose": "Check of a snatch (diverting) block in a rope pull: the resultant of the two rope legs on the block from the line pull and the included angle between the legs (as the resultant of concurrent forces tool), the angle factor, the direction of the resultant, and checks of the block working load, the anchor capacity and the rope’s design factor on its minimum breaking load.",
    "uses": [
      "Rate a snatch block and anchor for a winching job",
      "Show how the block load grows as the rope angle closes",
      "Check a rope against its design factor"
    ],
    "users": [
      "Riggers",
      "Lifting supervisors",
      "Maintenance supervisors"
    ],
    "inputs": {
      "T": "Tension in the rope (the winch line pull, plus friction at other sheaves).",
      "theta": "Angle between the incoming and outgoing rope legs at the block (0° = rope doubles back, 180° = straight through).",
      "WLLb": "Working load limit marked on the snatch block.",
      "anchor": "Capacity of the anchor point, sling and shackle holding the block.",
      "MBL": "Minimum breaking load of the rope.",
      "DF": "Design factor the rope must have (from your standard)."
    },
    "outputs": [
      "Resultant load on the block and its direction",
      "Angle factor",
      "Rope design factor"
    ],
    "method": [
      "Two legs of tension T at ±θ ÷ 2 about the bisector combine to R = 2T cos(θ ÷ 2) along the bisector (as the resultant of concurrent forces tool).",
      "Angle factor = R ÷ T.",
      "Rope design factor = MBL ÷ T.",
      "Example: at 60° the block and anchor take 17.321 kN, 1.7321 times the line pull; the rope has a design factor of 6."
    ],
    "limitations": [
      "Equal tension both sides of the block; sheave friction raises the outgoing tension slightly.",
      "Static pull; snatch loads from slack rope can be much higher.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the rope doubles back (small angle), the block and anchor carry nearly twice the line pull."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "crossed-belt-drive-check": {
    "purpose": "Check of a crossed flat or round belt drive, which reverses the driven pulley: belt length and wrap on each pulley compared with an open drive (as the crossed belt length tool), belt speed, the effective pull for the power, the tension ratio at the point of slip from the friction and wrap (as the belt friction tool), the tight and slack side tensions with centrifugal tension added, checked against the belt’s allowable tension and speed.",
    "uses": [
      "Design a reversing flat belt drive",
      "Check an old line-shaft belt for a new load",
      "Compare crossed and open belt wrap"
    ],
    "users": [
      "Maintenance engineers",
      "Restoration engineers",
      "Design engineers"
    ],
    "inputs": {
      "D1": "Diameter of the driving pulley.",
      "D2": "Diameter of the driven pulley.",
      "C": "Distance between the pulley centres.",
      "P": "Power to transmit (include a service factor).",
      "n1": "Speed of the driving pulley.",
      "mu": "Friction coefficient of the belt on the pulleys.",
      "mb": "Mass of the belt per metre of length.",
      "Tallow": "Allowable working tension of the belt (from its width and material).",
      "vMax": "Highest belt speed for the belt and joint."
    },
    "outputs": [
      "Belt length and wrap",
      "Belt speed, effective pull and tension ratio",
      "Tight and slack side tensions"
    ],
    "method": [
      "Crossed belt length = 2√(C² − s²) + s (π + 2 sin⁻¹(s ÷ C)) with s = (D₁ + D₂) ÷ 2; wrap = 180° + 2 sin⁻¹(s ÷ C) on both pulleys (as the crossed belt length tool).",
      "Tension ratio = e^(μθ) at the point of slip (as the belt friction tool); effective pull = P ÷ v.",
      "Slack side = pull ÷ (ratio − 1); tight side = slack × ratio; centrifugal tension m v² added to both.",
      "Example: a 1,708.9 mm belt wraps 208.96°; at 15.184 m/s it needs 267.19 N on the tight side."
    ],
    "limitations": [
      "Flat or round belt that can be twisted; check the belt maker allows crossing.",
      "Tensions at the point of slip; set the installed tension higher to keep a margin.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Crossing the belt increases the wrap on the small pulley, so a crossed drive grips better than an open one."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2473–2490, 165–168. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "square-round-spring-compare": {
    "purpose": "Side-by-side check of two compression springs with the same coil diameter, active coils, free and working lengths: one wound from square wire of side a (as the square-wire spring tool) and one from round wire of diameter a (as the compression spring tool) — rate, load at the working length, corrected stress, solid length — and which of them gives the load you need within the allowable stress.",
    "uses": [
      "Decide whether square wire gives enough extra load",
      "Compare die spring options in a fixed pocket",
      "Check solid length for both wire shapes"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Spring buyers"
    ],
    "inputs": {
      "a": "Side of the square wire, and diameter of the round wire compared with it.",
      "D": "Mean coil diameter of both springs.",
      "Na": "Active coils of both springs.",
      "G": "Shear modulus of the wire.",
      "L0": "Unloaded length of both springs.",
      "Lw": "Length both are compressed to.",
      "allow": "Allowable corrected shear stress.",
      "need": "Load the spring must give at the working length."
    },
    "outputs": [
      "Rate and load of each spring",
      "Corrected stress of each",
      "Solid length and which meets the need"
    ],
    "method": [
      "Square wire: k = G a⁴ ÷ (5.58 N_a D³); stress = 0.96 K F D ÷ (0.416 a³) (as the square-wire spring tool).",
      "Round wire: k = G d⁴ ÷ (8 D³ N_a); stress = K 8 F D ÷ π d³ with the Wahl factor (as the compression spring tool).",
      "Solid length = (active coils + 2) × wire size for closed and ground ends.",
      "Example: square wire gives 269.8 N at 564.77 MPa; round wire 188.18 N at 434.69 MPa."
    ],
    "limitations": [
      "Square wire assumed to stay square in the coil; in practice it becomes keystone-shaped.",
      "Static load; closed and ground ends for solid length.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Square wire stores more energy in the same space, but costs more and is harder to obtain."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "crossed-helical-drive-check": {
    "purpose": "Check of crossed helical (spiral) gears on shafts at 90°: pitch and outside diameters, centre distance and leads for the normal diametral pitch and helix angles (as the crossed helical gears tool), pitch-line velocities, the sliding velocity between the teeth, the pinion tangential force from the power and the gear tangential (pinion axial) force, checked against your sliding velocity limit.",
    "uses": [
      "Check a light right-angle drive with crossed helical gears",
      "Choose helix angles to limit sliding",
      "Find shaft thrust loads"
    ],
    "users": [
      "Design engineers",
      "Gear designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Pn": "Normal diametral pitch of both gears.",
      "n": "Teeth on the pinion.",
      "Nt": "Teeth on the gear.",
      "psi": "Helix angle of the gear; the pinion’s is 90° minus this for shafts at right angles.",
      "P": "Power transmitted.",
      "rpm": "Speed of the pinion.",
      "vsMax": "Largest sliding velocity you accept for the materials and lubrication."
    },
    "outputs": [
      "Diameters, centre distance and leads",
      "Pitch-line and sliding velocities",
      "Tangential and axial forces"
    ],
    "method": [
      "Pitch diameters D = N ÷ (P_n cos ψ) for each gear with its own helix angle; centre distance = (D + d) ÷ 2; lead = π D ÷ tan ψ (as the crossed helical gears tool).",
      "Sliding velocity V_s = V₁ ÷ cos ψ_gear for shafts at 90°, where V₁ is the pinion pitch-line velocity.",
      "Pinion tangential force = P ÷ V₁; gear tangential (pinion axial) force = pinion tangential × tan ψ_pinion, friction neglected.",
      "Example: centre distance 5.3033 in; the teeth slide at 3.9898 m/s; the pinion shaft carries 177.23 N thrust."
    ],
    "limitations": [
      "Point contact: crossed helical gears suit light loads only.",
      "Friction raises the thrust and lowers the efficiency.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Equal 45° helix angles give the smallest centre distance for a given ratio but the highest sliding at high ratios."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2195–2203. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
