// MAKEOS methods, input sources and limits for the mechanism kinematics topic tools (batch norton1).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "linkage-mobility": {
    "purpose": "Mobility of a linkage by the equations Norton gives: Kutzbach’s form of Gruebler’s equation for planar mechanisms M = 3(L − 1) − 2J1 − J2 with full (one-freedom) and half (two-freedom) joints, multiple joints counting as one less than the number of links they join, and the Kutzbach equation for spatial linkages M = 6(L − 1) − 5J1 − 4J2 − 3J3 − 2J4 − J5, with the classification into a mechanism (M > 0), a structure (M = 0) or a preloaded structure (M < 0).",
    "uses": [
      "Check a proposed linkage has one degree of freedom before designing it",
      "Count the joints of a sketch to see whether it will move",
      "Find the mobility of a spatial linkage"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "space": "Whether the links move in one plane or in three dimensions.",
      "L": "Number of links, counting the ground (frame) as one link.",
      "J1": "Full joints: pin and slider joints that allow one freedom; a multiple joint counts as one less than the links it joins.",
      "J2": "Half joints: roll-slide joints such as cam or gear contacts that allow two freedoms.",
      "J3": "Spatial joints with three freedoms, such as a ball joint.",
      "J4": "Spatial joints with four freedoms.",
      "J5": "Spatial joints with five freedoms."
    },
    "outputs": [
      "Degree of freedom (mobility) M",
      "Whether it is a mechanism, a structure or a preloaded structure"
    ],
    "method": [
      "Planar: M = 3(L − 1) − 2J1 − J2 (Kutzbach’s modification of Gruebler’s equation); a multiple joint joining n links counts as n − 1 full joints.",
      "Spatial: M = 6(L − 1) − 5J1 − 4J2 − 3J3 − 2J4 − J5.",
      "M > 0: a mechanism with M independent inputs; M = 0: a structure; M < 0: a preloaded structure.",
      "Example: 4 links with 4 full joints give M = 1."
    ],
    "limitations": [
      "The equations count links and joints only; special link proportions (such as parallel links) can give motion the count does not predict.",
      "Count each multiple joint as one less than the number of links joined at it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A fourbar linkage (4 links, 4 full joints) has one degree of freedom and needs one input.",
      "Three links joined by three full joints form a structure; two links joined by two full joints are preloaded."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 29–33. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "fourbar-grashof-check": {
    "purpose": "Fourbar linkage behaviour by Norton’s Grashof condition S + L ≤ P + Q with the shortest S, longest L and other links P and Q: Class I (S + L < P + Q) gives a crank-rocker when a link next to the shortest is grounded, a double-crank when the shortest is grounded and a Grashof double-rocker when the link opposite the shortest is grounded; Class II (S + L > P + Q) gives triple-rockers; Class III (S + L = P + Q) has change points. It also gives the extreme transmission angles of a crank-rocker, μ = arccos{[b² + c² − (d ± a)²] ÷ 2bc}, and for a non-Grashof linkage the input toggle angle θ2 = arccos[(a² + d² − b² − c²) ÷ 2ad ± bc ÷ ad] (equation 4.33) with the transmission angle at the toggle where the input and coupler are in line.",
    "uses": [
      "Check whether a fourbar crank will turn fully",
      "Classify a fourbar inversion before analysing it",
      "Check the transmission angle range of a crank-rocker"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "d": "Distance between the two fixed pivots O2 and O4.",
      "a": "Length of the input link, from O2 to the coupler joint A.",
      "b": "Length of the coupler, from A to B.",
      "c": "Length of the output link, from O4 to B."
    },
    "outputs": [
      "Shortest, longest and the other two links",
      "Grashof class and the motion of this inversion",
      "Extreme transmission angles of a crank-rocker",
      "Toggle angles of the input for a non-Grashof linkage"
    ],
    "method": [
      "S, L, P, Q are the shortest, longest and remaining links; Class I if S + L < P + Q, Class II if S + L > P + Q, Class III (special-case Grashof, change points) if equal.",
      "Class I inversions: shortest link adjacent to ground → crank-rocker; shortest grounded → double-crank; shortest is the coupler → Grashof double-rocker. Class II: triple-rocker.",
      "Crank-rocker with the input as crank: μ1 = arccos{[b² + c² − (d + a)²] ÷ 2bc}, μ2 = arccos{[b² + c² − (d − a)²] ÷ 2bc} (eq. 4.29).",
      "Non-Grashof: θ2,toggle = arccos{[a² + d² − b² − c²] ÷ 2ad ± bc ÷ ad}, taking the sign that gives an argument within ±1 (eq. 4.33); the toggle positions are ± that angle. With input and coupler colinear, μ = arccos{[(a + b)² + c² − d²] ÷ 2c(a + b)} (eq. 4.30).",
      "Example: S + L = 160 against P + Q = 180."
    ],
    "limitations": [
      "The condition applies to pin-jointed fourbar linkages; whether the linkage assembles at all needs the longest link shorter than the sum of the others.",
      "Transmission angles below about 40° give poor force transmission in practice; check your own limit.",
      "Class III linkages need their motion limited or a carry-through link at the change points.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The Grashof condition does not depend on the order in which the links are assembled; the inversion (which link is grounded) decides the motion.",
      "The transmission angle is the angle between the coupler and the output link; 90° is ideal."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 46–49, 169–172. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "fourbar-time-ratio": {
    "purpose": "Quick-return time ratio of a Grashof crank-rocker by Norton’s definitions: the crank sweeps α and β between the two toggle positions (crank and coupler colinear), with TR = α ÷ β, α + β = 360° and the construction angle δ = |180° − α| = |180° − β|; for a given linkage the two sweeps and the rocker swing follow from the cosine law in the extended (a + b) and overlapped (b − a) colinear positions, and for design they follow from the time ratio.",
    "uses": [
      "Find the time ratio of an existing crank-rocker",
      "Set the crank angles for a quick-return design",
      "Find the rocker swing of a crank-rocker"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "mode": "Whether to analyse a linkage or design for a time ratio.",
      "d": "Distance between the fixed pivots.",
      "a": "Length of the crank, the shortest link.",
      "b": "Length of the coupler.",
      "c": "Length of the rocker.",
      "TR": "Ratio of the longer crank sweep to the shorter, e.g. 1.25 for 1:1.25."
    },
    "outputs": [
      "Crank sweeps α and β",
      "Time ratio",
      "Construction angle δ",
      "Rocker swing angle"
    ],
    "method": [
      "TR = α ÷ β with α + β = 360°; δ = |180° − α| (eqs. 3.1 and 3.2).",
      "Design: β = 360° ÷ (1 + 1/TR) for the slower stroke, α = 360° − β.",
      "Analysis: the crank angles at the toggle positions follow from the cosine law with O2B = a + b (extended) and b − a (overlapped): cos φ = [O2B² + d² − c²] ÷ (2 d O2B); δ = |φ_overlapped − φ_extended|, sweeps 180° ± δ.",
      "Rocker swing = difference of the rocker angles at O4 in the two positions, cos γ = [c² + d² − O2B²] ÷ 2cd.",
      "Example: the crank sweeps 187.87° and 172.13°, a time ratio of 1:1.0915."
    ],
    "limitations": [
      "The time ratio assumes the crank turns at constant speed.",
      "The linkage must be a Grashof crank-rocker with the crank as the shortest link.",
      "Norton notes that fourbar quick-returns work well to about 1:1.5; beyond that the transmission angles become poor.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Equal sweeps of 180° (δ = 0) give no quick return, as when the crank pivot lies on the rocker chord extended.",
      "Running the crank the other way turns a quick-return into a quick-forward."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 97–99. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "fourbar-kinematics": {
    "purpose": "Analytical kinematics of the pin-jointed fourbar by Norton’s vector loop solution: the output angle from Freudenstein’s constants K1 = d/a, K2 = d/c, K3 = (a² − b² + c² + d²) ÷ 2ac and θ4 = 2 arctan[(−B ∓ √(B² − 4AC)) ÷ 2A] for the open (−) or crossed (+) circuit, the coupler angle from the loop equations, ω3 = (aω2 ÷ b) sin(θ4 − θ2) ÷ sin(θ3 − θ4) and ω4 = (aω2 ÷ c) sin(θ2 − θ3) ÷ sin(θ4 − θ3), α3 = (CD − AF) ÷ (AE − BD) and α4 = (CE − BF) ÷ (AE − BD) with Norton’s acceleration constants, the transmission angle |θ3 − θ4| taken acute, and the position and velocity of a coupler point at distance p and angle δ3 from A.",
    "uses": [
      "Find the output angle and speed of a fourbar at one crank position",
      "Check the angular accelerations for dynamic force analysis",
      "Find where a coupler point is and how fast it moves"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "a": "Length of the input link from O2 to A.",
      "b": "Length of the coupler from A to B.",
      "c": "Length of the output link from O4 to B.",
      "d": "Distance between the fixed pivots O2 and O4, along the X axis.",
      "t2": "Angle of the input link measured anticlockwise from the line O2O4.",
      "w2": "Angular velocity of the input link; anticlockwise is positive.",
      "a2": "Angular acceleration of the input link; anticlockwise is positive.",
      "circ": "Which of the two ways the linkage is assembled at this input angle.",
      "p": "Distance from joint A to a point of interest on the coupler.",
      "d3": "Angle of that point from the line AB, measured anticlockwise at A."
    },
    "outputs": [
      "Coupler and output angles θ3 and θ4",
      "Angular velocities ω3 and ω4",
      "Angular accelerations α3 and α4",
      "Transmission angle",
      "Velocities of A, B and the coupler point"
    ],
    "method": [
      "K1 = d/a, K2 = d/c, K3 = (a² − b² + c² + d²) ÷ 2ac; A = cos θ2 − K1 − K2 cos θ2 + K3, B = −2 sin θ2, C = K1 − (K2 + 1) cos θ2 + K3; θ4 = 2 arctan[(−B ∓ √(B² − 4AC)) ÷ 2A], minus for the open circuit (eqs. 4.8, 4.10).",
      "θ3 from b cos θ3 = −a cos θ2 + c cos θ4 + d and b sin θ3 = −a sin θ2 + c sin θ4 (eqs. 4.6c, 4.6d).",
      "ω3 = (aω2 ÷ b) sin(θ4 − θ2) ÷ sin(θ3 − θ4); ω4 = (aω2 ÷ c) sin(θ2 − θ3) ÷ sin(θ4 − θ3) (eq. 6.18).",
      "α3 = (CD − AF) ÷ (AE − BD), α4 = (CE − BF) ÷ (AE − BD) with A = c sin θ4, B = b sin θ3, C = aα2 sin θ2 + aω2² cos θ2 + bω3² cos θ3 − cω4² cos θ4, D = c cos θ4, E = b cos θ3, F = aα2 cos θ2 − aω2² sin θ2 − bω3² sin θ3 + cω4² sin θ4 (eq. 7.12).",
      "Transmission angle = |θ3 − θ4|, taken as π minus it when above 90° (eq. 4.28); coupler point R_P = R_A + p e^{j(θ3 + δ3)} (eq. 4.27), V_P = V_A + jpω3 e^{j(θ3 + δ3)}.",
      "Example: θ3 = 20.298°, θ4 = 57.325°, ω4 = 2.7992 rad/s."
    ],
    "limitations": [
      "A negative discriminant means the links cannot be connected at this input angle (beyond a toggle position or impossible lengths).",
      "Angles are measured anticlockwise from the X axis along the ground link O2O4; the analysis is for one position — run it at each angle of interest.",
      "Lengths may be in any one unit; velocities and accelerations of points are reported in mm/s and mm/s² of the length unit entered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The open and crossed circuits are the two ways the same links can be assembled; a linkage cannot pass from one to the other without being taken apart.",
      "Transmission angles below about 40° give poor force transmission."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 156–159, 169–170, 271–274, 309–311. Topic reference; no source tables, figures or examples are reproduced."
    ]
  },
  "slider-crank-kinematics": {
    "purpose": "Analytical kinematics of the fourbar offset slider-crank (inversion 1) by Norton’s vector loop: θ3 = arcsin[(a sin θ2 − c) ÷ b] for the first circuit or arcsin[−(a sin θ2 − c) ÷ b] + π for the second, slider position d = a cos θ2 − b cos θ3, ω3 = (a cos θ2 ÷ b cos θ3) ω2, slider velocity ḋ = −aω2 sin θ2 + bω3 sin θ3, α3 = (aα2 cos θ2 − aω2² sin θ2 + bω3² sin θ3) ÷ (b cos θ3) and slider acceleration d̈ = −aα2 sin θ2 − aω2² cos θ2 + bα3 sin θ3 + bω3² cos θ3, with the offset c measured square to the slide axis.",
    "uses": [
      "Find the piston or slider position, velocity and acceleration at a crank angle",
      "Check the effect of an offset on a slider-crank",
      "Get the connecting rod motion for dynamic forces"
    ],
    "users": [
      "Machine designers",
      "Mechanism designers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "a": "Length of the crank from O2 to the crank pin A.",
      "b": "Length of the connecting rod from A to the slider pin B.",
      "c": "Offset of the slide axis from the crank pivot, measured square to the slide; 0 for an in-line slider-crank.",
      "t2": "Crank angle measured anticlockwise from the slide direction.",
      "w2": "Angular velocity of the crank; anticlockwise is positive.",
      "a2": "Angular acceleration of the crank; anticlockwise is positive.",
      "circ": "Which side of the crank pivot the slider runs on; the two sides are Norton’s two circuits."
    },
    "outputs": [
      "Connecting rod angle θ3",
      "Slider position d",
      "Slider velocity and acceleration",
      "Connecting rod angular velocity and acceleration"
    ],
    "method": [
      "θ3 = arcsin[−(a sin θ2 − c) ÷ b] + π with the slider on the +X side, or arcsin[(a sin θ2 − c) ÷ b] with it on the −X side (eqs. 4.16a, 4.17); d = a cos θ2 − b cos θ3 (eq. 4.16b).",
      "ω3 = (a cos θ2 ÷ b cos θ3) ω2; ḋ = −aω2 sin θ2 + bω3 sin θ3 (eq. 6.22).",
      "α3 = (aα2 cos θ2 − aω2² sin θ2 + bω3² sin θ3) ÷ (b cos θ3); d̈ = −aα2 sin θ2 − aω2² cos θ2 + bα3 sin θ3 + bω3² cos θ3 (eqs. 7.16d, 7.16e).",
      "θ3 is measured at the slider pin B, as Norton defines it for this inversion.",
      "Example: the slider is at 144.9 mm moving at -3.5144 m/s."
    ],
    "limitations": [
      "The rod cannot reach the slide axis when |a sin θ2 − c| > b.",
      "Angles are measured anticlockwise from the slide axis through the crank pivot; the analysis is for one position.",
      "Velocities and accelerations are in mm/s and mm/s² when the lengths are in millimetres.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With no offset the slider positions repeat symmetrically about the crank pivot axis; an offset makes the strokes unequal in time.",
      "The slider acceleration is greatest near the top dead centre of an in-line slider-crank."
    ],
    "refs": [
      "Robert L. Norton, Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines, 2nd edition (McGraw-Hill, 1999), pp. 159–161, 274–276, 311–313. Topic reference; no source tables, figures or examples are reproduced."
    ]
  }
});
