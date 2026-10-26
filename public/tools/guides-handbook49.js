// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook49).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "pump-suction-check": {
    "purpose": "Check of a pump suction line: velocity in the suction pipe against your limit, friction factor and head loss through the pipe, foot valve and fittings (as the pipe friction tool), NPSH available from the surface pressure, vapour pressure, liquid level and suction losses compared with the pump’s NPSH required plus your margin (as the NPSH available tool), and the lowest liquid level that still keeps the margin.",
    "uses": [
      "Check a pump installation before ordering",
      "Find how far a sump may be drawn down",
      "Size a suction pipe"
    ],
    "users": [
      "Plant engineers",
      "Maintenance engineers",
      "Pump installers"
    ],
    "inputs": {
      "Q": "Flow the pump delivers at duty.",
      "d": "Inside diameter of the suction pipe.",
      "L": "Length of the suction pipe.",
      "K": "Sum of loss coefficients for the entry, foot valve, strainer and bends.",
      "nu": "Kinematic viscosity at the pumping temperature.",
      "rho": "Density of the liquid.",
      "eps": "Roughness of the pipe bore.",
      "ps": "Absolute pressure on the liquid surface (atmospheric for an open sump).",
      "pv": "Vapour pressure of the liquid at the pumping temperature.",
      "z": "Height of the liquid surface above the pump centreline; negative for a suction lift.",
      "npshr": "NPSH the pump needs at the duty flow, from its curve.",
      "margin": "Extra head you want above the NPSH required.",
      "vMax": "Largest velocity you accept in the suction pipe."
    },
    "outputs": [
      "Suction velocity and head loss",
      "NPSH available and margin",
      "Lowest liquid level for the margin"
    ],
    "method": [
      "Velocity = Q ÷ A; head loss h_f = (f L ÷ d + ΣK) v² ÷ 2g with the Colebrook friction factor (as the pipe friction tool).",
      "NPSH_a = (p_s − p_v) ÷ ρg + z − h_f (as the NPSH available tool); margin = NPSH_a − NPSH_r.",
      "Lowest level = z − (margin − margin required).",
      "Example: the suction loses 0.23159 m, NPSH available is 7.8797 m against 3 m required, and the level may fall to -5.8797 m."
    ],
    "limitations": [
      "Steady flow at the duty point; NPSH required rises at higher flows.",
      "Entrained air and vortexing at a low submergence are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising the liquid level or shortening the suction line helps more than any change to the pump."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shoe-brake-stop-check": {
    "purpose": "Check of a single-shoe drum brake stopping a rotating load: the torque to decelerate the inertia in the stopping time less any drag that helps (as the torque to accelerate a rotating load tool), the normal and friction forces on the shoe and the lever force for the pivot geometry, self-energising or not, with the self-locking check (as the shoe brake tool), shoe pressure, kinetic energy per stop, revolutions to stop and the drum temperature rise, checked against the force available, your pressure limit and temperature limit.",
    "uses": [
      "Size a hand or spring-applied drum brake",
      "Check a brake for a new stopping time",
      "Estimate drum heating per stop"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "J": "Moment of inertia of everything being stopped, referred to the brake shaft.",
      "n": "Speed of the brake shaft when the brake is applied.",
      "t": "Time in which the load must stop.",
      "Td": "Friction or load torque that also slows the load (0 to ignore).",
      "D": "Diameter of the brake drum.",
      "mu": "Friction coefficient of the lining on the drum.",
      "a": "Distance from the shoe pivot to the applied lever force.",
      "b": "Distance from the pivot to the line of the shoe normal force.",
      "c": "Offset of the friction force line from the pivot.",
      "dir": "Whether drum rotation helps or opposes the shoe application.",
      "area": "Contact area of the lining.",
      "Favail": "Force the operator, spring or actuator can apply to the lever.",
      "pAllow": "Allowable pressure for the lining.",
      "mDrum": "Mass of the drum that absorbs the heat.",
      "cDrum": "Specific heat of the drum (cast iron or steel about 0.46 kJ/kg·K).",
      "dTmax": "Largest temperature rise per stop you accept."
    },
    "outputs": [
      "Stopping torque, energy and revolutions",
      "Shoe forces, lever force and pressure",
      "Drum temperature rise"
    ],
    "method": [
      "Brake torque = J ω ÷ t − drag (as the torque to accelerate a rotating load tool, with deceleration).",
      "Friction force = torque ÷ r; normal force = friction ÷ μ; lever force = N (b ∓ μc) ÷ a, self-locking if b ≤ μc when self-energising (as the shoe brake tool); pressure = N ÷ area.",
      "Energy per stop = ½ J ω²; revolutions = n t ÷ 120; drum temperature rise = energy ÷ (m c).",
      "Example: stopping in 3 s needs 167.55 N·m and 1,187.2 N on the lever; each stop puts 15.791 kJ into the drum, 2.2886 K."
    ],
    "limitations": [
      "Short shoe with uniform pressure; long shoes need the pressure distribution.",
      "All energy assumed to go into the drum in one stop; repeated stops accumulate heat.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A self-energising shoe needs less lever force but its torque is very sensitive to the friction coefficient."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2455–2459, 176–181. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drive-torsional-check": {
    "purpose": "Check of a two-inertia drive (motor and load joined by a shaft): torsional stiffness of the shaft, effective inertia and natural frequency (as the torsional vibration tool), the excitation bands for the first few orders of running speed over the speed range, the separation of the natural frequency from each band against your margin, the critical speeds, and the shaft shear stress and angle of twist at the drive torque.",
    "uses": [
      "Check a long drive shaft or line shaft",
      "Check a variable-speed drive for resonance",
      "Size a shaft for stiffness as well as strength"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Vibration analysts"
    ],
    "inputs": {
      "G": "Shear modulus of the shaft material (steel about 79 GPa).",
      "d": "Outside diameter of the shaft.",
      "di": "Bore of a hollow shaft; 0 for solid.",
      "Ls": "Length of shaft between the motor and the load.",
      "J1": "Moment of inertia of the motor rotor and coupling half.",
      "J2": "Moment of inertia of the driven load.",
      "nMin": "Lowest speed the drive runs at continuously.",
      "nMax": "Highest speed the drive runs at.",
      "orders": "Number of running-speed orders that excite the system (1× from unbalance, 2× from universal joints and so on).",
      "sep": "How far the natural frequency must stay from each excitation band.",
      "T": "Torque the shaft transmits.",
      "tauA": "Allowable torsional shear stress of the shaft."
    },
    "outputs": [
      "Stiffness, effective inertia and natural frequency",
      "Excitation bands, critical speeds and margins",
      "Shaft stress and twist"
    ],
    "method": [
      "K = G π (d⁴ − d_i⁴) ÷ 32L; J_eff = J₁ J₂ ÷ (J₁ + J₂); f_n = √(K ÷ J_eff) ÷ 2π (as the torsional vibration tool).",
      "Order k excites from k n_min ÷ 60 to k n_max ÷ 60 Hz; f_n must lie below (1 − margin) × the band start or above (1 + margin) × the band end; critical speed = 60 f_n ÷ k.",
      "τ = 16 T d ÷ π (d⁴ − d_i⁴); twist = T ÷ K.",
      "Example: f_n = 66.277 Hz; the critical speed nearest the running range is 1,988.3 rpm; the shaft carries 28.294 MPa and twists 1.0903°."
    ],
    "limitations": [
      "Two-inertia model with a massless shaft; couplings and gear meshes add flexibility.",
      "Damping is ignored, so margins should be generous.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stiffening the shaft raises f_n with √K; a larger load inertia barely lowers it once J₂ ≫ J₁."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3412–3413, 296–302. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flange-coupling-design": {
    "purpose": "Check of a rigid flange coupling: design torque from power, speed and service factor; bolt force and bolt shear stress on the bolt circle with the shank diameter needed, and the torque the bolt preload can carry by face friction (as the flange coupling bolts tool); key force, shear and crushing stress in the hub and the least key length for each (as the key stress tool), with the key length checked against the hub length.",
    "uses": [
      "Check a rigid coupling when fitting a larger motor",
      "Choose bolts and keys for a fabricated coupling",
      "Decide whether fitted bolts are needed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Millwrights"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n": "Shaft speed.",
      "SF": "Service factor for the driver, load and duty.",
      "nb": "Number of coupling bolts.",
      "Dbc": "Diameter of the bolt circle.",
      "db": "Diameter of the bolt shank in the shear plane.",
      "tauB": "Allowable shear stress of the bolts.",
      "Fi": "Tightening preload of each bolt.",
      "mu": "Friction coefficient between the flange faces.",
      "ds": "Diameter of the shaft in the hub.",
      "w": "Width of the key.",
      "h": "Height of the key.",
      "Lk": "Length of key engaged in the hub.",
      "hubL": "Length of the coupling hub.",
      "tauK": "Allowable shear stress of the key.",
      "sigK": "Allowable crushing stress of the key, shaft or hub, whichever is weakest."
    },
    "outputs": [
      "Design torque",
      "Bolt force, shear stress and friction capacity",
      "Key stresses and least key length"
    ],
    "method": [
      "Design torque T = 9549 P ÷ n × service factor.",
      "Bolt force = 2T ÷ (n_b D_bc); shear stress = force ÷ (π d² ÷ 4); friction torque = μ n_b F_i D_bc ÷ 2 (as the flange coupling bolts tool).",
      "Key force = 2T ÷ d_s; shear = F ÷ (w L); crushing = F ÷ (h ÷ 2 × L); least length for each (as the key stress tool).",
      "Example: the design torque is 429.72 N·m; the bolts see 22.797 MPa and friction can carry 960 N·m; the key needs at least 53.715 mm."
    ],
    "limitations": [
      "Steady torque with a service factor; shock and reversing loads need a fatigue check.",
      "Bolts in shear assume fitted (reamed) bolts; clearance bolts rely on friction.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If friction alone carries the design torque, the bolts are not loaded in shear and clearance holes are fine."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2441–2450, 2460–2486, 301–302. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-milling-setup": {
    "purpose": "Set-up for milling a spur gear with a form cutter on a dividing head: simple indexing (crank turns and holes in an index circle) for the number of teeth (as the simple indexing tool), the involute cutter number for the tooth count (as the gear cutter number tool), blank outside diameter, whole depth of cut, and the chordal thickness and chordal addendum for checking the first teeth with a gear tooth vernier (as the chordal tooth tool).",
    "uses": [
      "Set up a milling machine to cut a replacement gear",
      "Check whether a tooth count can be simply indexed",
      "Prepare an operation sheet for gear cutting"
    ],
    "users": [
      "Machinists",
      "Toolroom staff",
      "Maintenance fitters"
    ],
    "inputs": {
      "m": "Module of the gear.",
      "z": "Number of teeth to cut.",
      "ratio": "Turns of the index crank per turn of the spindle.",
      "plates": "Index plates on your dividing head.",
      "ded": "Dedendum as a multiple of the module (your gear standard); the addendum is one module."
    },
    "outputs": [
      "Index setting",
      "Cutter number",
      "Blank diameter, depth of cut and chordal tooth check"
    ],
    "method": [
      "Crank turns = ratio ÷ z: whole turns plus holes in a circle where the remainder × circle ÷ z is whole (as the simple indexing tool).",
      "Cutter number from the tooth count (as the gear cutter number tool).",
      "Blank diameter = m (z + 2); depth of cut = m (1 + dedendum factor); chordal thickness = D sin(π ÷ 2z) and chordal addendum = m + D ÷ 2 [1 − cos(π ÷ 2z)] (as the chordal tooth tool).",
      "Example: index 0 turns and 40 holes in the 47-hole circle; use cutter No. 3; turn the blank to 98 mm and cut 4.5 mm deep."
    ],
    "limitations": [
      "Form cutters give approximately correct profiles; generated gears are more accurate.",
      "Simple indexing only; numbers it cannot divide need differential indexing.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the first two teeth with the gear tooth vernier before cutting the rest."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2107–2121, 2148–2150, 2145, 2238–2240. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lubricant-viscosity-check": {
    "purpose": "Check of an oil grade for a bearing, gearbox or hydraulic system: viscosity at the operating temperature and at the cold-start temperature from the oil’s viscosity at two temperatures by the ASTM D341 chart relation (as the oil viscosity–temperature tool), the same values in dynamic viscosity and Saybolt units (as the viscosity units tool), and the ratio of the operating viscosity to the minimum your machine needs, against your cold-start limit.",
    "uses": [
      "Check an oil grade for a machine running hotter than planned",
      "Choose a grade for a cold climate",
      "Compare two grades for a gearbox"
    ],
    "users": [
      "Maintenance engineers",
      "Lubrication technicians",
      "Reliability engineers"
    ],
    "inputs": {
      "T1": "Temperature of the first viscosity value on the oil data sheet (usually 40 °C).",
      "v1": "Kinematic viscosity at the first temperature.",
      "T2": "Temperature of the second value (usually 100 °C).",
      "v2": "Kinematic viscosity at the second temperature.",
      "sg": "Specific gravity of the oil (for dynamic viscosity).",
      "Top": "Steady operating temperature of the oil in the machine.",
      "nuMin": "Least viscosity the bearings, gears or pump need (from the component maker or a film thickness calculation).",
      "Tcold": "Lowest temperature at which the machine starts.",
      "nuStart": "Highest viscosity the pump or system can start with (from the pump or system maker)."
    },
    "outputs": [
      "Viscosity at operating and cold-start temperatures",
      "Dynamic and Saybolt equivalents",
      "Viscosity ratio and checks"
    ],
    "method": [
      "log log(ν + 0.7) = A − B log T (T in kelvin) through the two data points (as the oil viscosity–temperature tool).",
      "Dynamic viscosity = ν × specific gravity; SUS ≈ 4.632 ν (as the viscosity units tool).",
      "Viscosity ratio = ν at operating ÷ least needed; cold-start viscosity against the limit.",
      "Example: at 70 °C the oil is 19.966 cSt (ratio 1.3311); at 5 °C it is 678.2 cSt."
    ],
    "limitations": [
      "Straight-grade mineral and synthetic oils; viscosity-modified oils may shear thin.",
      "Extrapolating far beyond the two data temperatures loses accuracy.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If neither limit can be met by one grade, the machine needs oil heating, cooling or a higher-index oil."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2329–2337, 2425–2426. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM D341 Viscosity–Temperature Charts for Liquid Petroleum Products"
    ]
  },
  "rolled-plate-plan": {
    "purpose": "Plan for rolling a plate or sheet to a radius: the radius to roll to so that after springback it opens to the target radius, found by solving the springback relation (as the bending springback tool), the springback change, the blank length along the mid-thickness for the arc angle, and inspection of the rolled radius from a measurement over two rolls (as the arc radius from rolls tool), against the radius tolerance.",
    "uses": [
      "Set plate rolls for a shell or curved panel",
      "Develop the blank for a rolled part",
      "Inspect a rolled radius with rolls and a height gauge"
    ],
    "users": [
      "Boilermakers",
      "Fabrication supervisors",
      "Inspectors"
    ],
    "inputs": {
      "Rt": "Inside radius the finished part must have.",
      "t": "Thickness of the plate.",
      "YS": "Yield strength of the plate.",
      "E": "Elastic modulus of the plate.",
      "ang": "Angle of arc the part covers (360° for a full shell).",
      "surf": "Which surface the roll gauge measures.",
      "type": "How the rolls and height reading are arranged (as the arc radius from rolls tool).",
      "D": "Diameter of the two gauge rolls.",
      "L": "Measurement over the two rolls.",
      "Hh": "Height reading of the arc.",
      "tol": "Plus-or-minus tolerance on the radius."
    },
    "outputs": [
      "Roll-to radius and springback",
      "Blank length",
      "Measured radius and deviation"
    ],
    "method": [
      "Final radius R_f = R_i ÷ (4x³ − 3x + 1) with x = R_i S_y ÷ (E t) (as the bending springback tool), solved for the roll-to radius R_i that gives the target.",
      "Blank length = (R + t ÷ 2) × arc angle in radians along the mid-thickness.",
      "Measured radius from the rolls: (c_b² + c_e²) ÷ 2c_e ± D ÷ 2 (as the arc radius from rolls tool), compared with the target for the surface measured.",
      "Example: roll to 218.84 mm so it springs back to 300 mm; cut the blank 947.19 mm long; the gauge reads 300.37 mm."
    ],
    "limitations": [
      "Elastic–perfectly plastic material; work hardening makes the springback larger.",
      "Ends of rolled plates stay flat unless pre-bent.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thin, high-strength plate rolled to a large radius springs back most: roll tighter in small steps and gauge often."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1351–1352, 687–688. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hopper-bin-design": {
    "purpose": "Design check of a round bin with a cylindrical section over a conical hopper: hopper volume, slant area and wall angle from horizontal (as the frustum volume tool), cylinder volume, mass held at the bulk density and fill level against the mass needed, the wall angle against the angle your material needs to flow, and the plate area and mass of the shell for the plate thickness.",
    "uses": [
      "Size a feed hopper or storage bin",
      "Check a hopper angle for a new material",
      "Estimate plate for fabrication"
    ],
    "users": [
      "Fabrication supervisors",
      "Process engineers",
      "Design engineers"
    ],
    "inputs": {
      "D": "Inside diameter of the bin and the top of the cone.",
      "Hc": "Height of the straight cylindrical section.",
      "d": "Diameter of the outlet at the bottom of the cone.",
      "Hh": "Vertical height of the cone.",
      "rhoB": "Loose bulk density of the stored material.",
      "fill": "How full the bin is normally filled.",
      "need": "Mass the bin must hold.",
      "angMin": "Least cone wall angle from horizontal the material needs to flow (from flow testing or experience).",
      "tp": "Thickness of the shell plate.",
      "rhoS": "Density of the plate material."
    },
    "outputs": [
      "Cone, cylinder and total volume",
      "Mass held and wall angle",
      "Plate area and mass"
    ],
    "method": [
      "Cone volume = π h (D² + D d + d²) ÷ 12; slant area = π (R + r) × slant height; wall angle = tan⁻¹[h ÷ (R − r)] (as the frustum volume tool).",
      "Cylinder volume = π D² ÷ 4 × height; mass held = total volume × fill × bulk density.",
      "Plate area = slant area + π D × cylinder height; plate mass = area × thickness × density.",
      "Example: the bin holds 6.5541 m³, 8,258.2 kg at 90% fill; the cone walls are at 60.461°; the shell weighs 614.41 kg."
    ],
    "limitations": [
      "Level fill; a heaped top adds volume and a surcharge.",
      "Flow depends on the material’s friction on the wall; the angle needed must come from tests or experience.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Steeper cones flow better but give less volume for the same height."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 82–87, 66. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "knurling-setup": {
    "purpose": "Set-up of a straight knurling operation: teeth that fit around the planned blank and the nearest diameters that give a whole number of teeth so the knurl tracks (as the knurling blank diameter tool), whether the planned blank lies within your tolerance of a tracking diameter, spindle speed from the knurling speed, and time for the passes along the length at the feed.",
    "uses": [
      "Turn the right blank diameter before knurling",
      "Avoid double tracking on a knurled handle",
      "Estimate the knurling time"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Toolroom staff"
    ],
    "inputs": {
      "system": "Whether the knurl is specified by circular pitch (metric) or diametral pitch (inch).",
      "t": "Circular pitch of the knurl.",
      "P": "Diametral pitch of the knurl.",
      "D": "Blank diameter you plan to turn, in millimetres.",
      "tolD": "How close the blank must be to a tracking diameter.",
      "vc": "Surface speed for knurling (your value for the material).",
      "f": "Axial feed per revolution for knurling along the work.",
      "L": "Length to be knurled.",
      "passes": "Number of passes along the length."
    },
    "outputs": [
      "Teeth on the planned blank and the nearest tracking diameters",
      "Tracking check",
      "Spindle speed and knurling time"
    ],
    "method": [
      "Teeth = π D ÷ circular pitch, or P × D (inches) for diametral pitch; tracking diameters give whole numbers of teeth (as the knurling blank diameter tool).",
      "Distance from the planned blank to the nearest tracking diameter against the tolerance.",
      "n = 1000 v_c ÷ π D; time = length × passes ÷ (feed × n).",
      "Example: 20.05 mm gives 62.989 teeth; the nearest tracking diameter is 20.054 mm; knurling takes 47.242 s at 317.52 rpm."
    ],
    "limitations": [
      "Straight knurling with the knurl axis parallel to the work.",
      "The knurl raises the diameter; allow for it in the finished size.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Turning the blank to a tracking diameter is the surest cure for double tracking."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 991–997. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
