// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook61).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "inch-milling-setup-check": {
    "purpose": "Check of an inch-unit milling setup: spindle speed from surface speed and cutter diameter and table feed from teeth and feed per tooth (as the inch speeds and feeds tool), capped at the machine’s top speed with the surface speed and feed that result, then the metal removal rate from width and depth of cut and the spindle power from a unit power for the material, against the machine’s motor power and efficiency.",
    "uses": [
      "Check an end mill setup on a small mill",
      "See whether a cut needs a bigger machine",
      "Work out the feed after the spindle speed is capped"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Process planners"
    ],
    "inputs": {
      "sfm": "Surface speed recommended for the cutter and material.",
      "D": "Diameter of the cutter.",
      "teeth": "Number of cutting teeth (flutes).",
      "ipt": "Feed per tooth (chip load).",
      "woc": "Radial width of cut.",
      "doc": "Axial depth of cut.",
      "Ku": "Power to remove one cubic inch per minute of the material (from the tool or machine maker).",
      "nMax": "Highest spindle speed of the machine.",
      "hp": "Rated spindle motor power.",
      "eff": "Share of motor power that reaches the cutter."
    },
    "outputs": [
      "Spindle speed and table feed",
      "Removal rate",
      "Spindle power against the machine"
    ],
    "method": [
      "Speed = 12 × sfm ÷ (π D); feed = speed × teeth × feed per tooth (as the inch speeds and feeds tool).",
      "Speed capped at the machine limit; surface speed and feed recalculated at the capped speed.",
      "Removal rate = width × depth × feed; power = removal rate × unit power ÷ efficiency.",
      "Example: 3,055.8 rpm and 24.446 in/min remove 3.0558 in³/min, needing 3.8197 hp."
    ],
    "limitations": [
      "Unit power varies with tool sharpness, rake and chip thickness; dull tools need up to half as much again.",
      "Tool deflection, chatter and work holding limit the cut separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the spindle speed is capped, keep the feed per tooth and accept a lower table feed rather than raising the chip load."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1013–1017, 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "index-table-drive-check": {
    "purpose": "Check of a rotary indexing table drive against the motor: table and fixture inertia, index angle, peak speed and acceleration for a cycloidal or trapezoidal move, table and motor peak torques through the reducer, motor speed, the holding torque needed against the process force and the load-to-motor inertia ratio (as the rotary index table sizing tool), against the motor’s peak torque, top speed, your inertia ratio limit and the brake torque multiplied through the reducer.",
    "uses": [
      "Check a motor for a dial table",
      "Find whether a faster index is possible",
      "Check the brake holds the table during pressing"
    ],
    "users": [
      "Automation engineers",
      "Machine designers",
      "Controls engineers"
    ],
    "inputs": {
      "M": "Mass of the table plate.",
      "R": "Radius of the table plate.",
      "st": "Number of stations (index positions).",
      "mf": "Mass of each fixture with its part.",
      "rf": "Radius at which the fixtures sit.",
      "ti": "Time for one index move.",
      "tc": "Time for a full cycle, index plus dwell.",
      "law": "Cam-like cycloidal motion or a trapezoidal velocity profile.",
      "Tf": "Friction torque of the table bearing and seals.",
      "i": "Reduction ratio between motor and table.",
      "eta": "Efficiency of the reducer.",
      "Jm": "Inertia of the motor rotor.",
      "Fm": "Tangential process force on a fixture during the dwell.",
      "SF": "Factor on the holding torque.",
      "TmPk": "Peak torque the motor can give.",
      "nMaxM": "Highest motor speed.",
      "ratioMax": "Largest load-to-motor inertia ratio you accept for good control (reflected through the reducer).",
      "Tb": "Holding torque of the motor brake (or the drive’s holding torque)."
    },
    "outputs": [
      "Table inertia, speed and acceleration",
      "Motor torque, speed and inertia ratio",
      "Holding against the process force"
    ],
    "method": [
      "J = ½ M R² + stations × m_f r_f²; index angle 2π ÷ stations; cycloidal ω_max = 2θ ÷ t, α_max = 2πθ ÷ t² (as the rotary index table sizing tool).",
      "Motor torque = (J α + T_f) ÷ (i η) + J_m α i; motor speed = ω_max i; inertia ratio = J ÷ i² ÷ J_m.",
      "Holding torque needed = SF × F × r_f; brake holds brake torque × i at the table.",
      "Example: the motor needs 3.7354 N·m at 1,666.7 rpm with an inertia ratio of 5.88."
    ],
    "limitations": [
      "Rigid drive; backlash and compliance in the reducer cut the usable stiffness.",
      "Brake holding taken through the reducer without efficiency loss.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger reducer ratio cuts the reflected inertia by its square but raises the motor speed in proportion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 171, 2284–2290. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hand-lever-design-check": {
    "purpose": "Check of a lever of any class: the effort at the effort arm or the arm needed for a given effort, the mechanical advantage and the fulcrum reaction (as the lever force tool), the largest bending moment along the lever and the bending stress in a rectangular arm, and the double shear stress and bearing pressure of the fulcrum pin from the reaction, against your allowable stresses.",
    "uses": [
      "Size a hand lever or foot pedal",
      "Check a clamping lever on a fixture",
      "Check the fulcrum pin of a toggle or brake lever"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Fixture designers"
    ],
    "inputs": {
      "mode": "Find the effort for a given arm, or the arm for a given effort.",
      "type": "Where the fulcrum sits relative to the effort and loads.",
      "x": "Distance from the fulcrum to where the effort is applied.",
      "F": "Effort available (arm mode).",
      "W1": "Load 1.",
      "a1": "Distance of load 1 from the fulcrum.",
      "W2": "Load 2 (0 if unused).",
      "a2": "Distance of load 2 from the fulcrum.",
      "W3": "Load 3 (0 if unused).",
      "a3": "Distance of load 3 from the fulcrum.",
      "b": "Thickness of the rectangular lever arm.",
      "h": "Depth of the arm in the plane of bending (at the most stressed section).",
      "sA": "Allowable bending stress for the arm material.",
      "d": "Diameter of the fulcrum pin.",
      "tauA": "Allowable shear stress of the pin (double shear).",
      "pA": "Allowable bearing pressure between pin and lever (lower for a bushed or greased pivot that moves)."
    },
    "outputs": [
      "Effort, arm, advantage and fulcrum reaction",
      "Largest bending moment and arm stress",
      "Fulcrum pin shear and bearing"
    ],
    "method": [
      "Effort = Σ W a ÷ x (or arm = Σ W a ÷ F); reaction = F + W for the first class, |W − F| otherwise (as the lever force tool).",
      "Bending moment found at the fulcrum, each load and the effort; arm stress = 6M ÷ (b h²).",
      "Pin shear = 2R ÷ (π d²) in double shear; bearing = R ÷ (d b).",
      "Example: 133.33 N effort; 80 N·m bending gives 53.333 MPa in the arm; the pin carries 933.33 N."
    ],
    "limitations": [
      "Uniform rectangular arm at the most stressed section; tapered arms need the depth at that section.",
      "Static load; add a factor for jerks and people standing on pedals.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The largest moment is at the fulcrum for a first-class lever and under a load for second- and third-class levers."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 167–168, 257–270. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "plate-shear-capacity-check": {
    "purpose": "Check of a plate shear (guillotine) for a cut: the shear strength from the tensile strength, the shearing force for parallel blades or raked (inclined) blades with the penetration at fracture, and the machine force with an allowance for parallel blades (as the shearing force tool), then the largest thickness of the same material the shear can cut at its rated capacity, and the cut length against the knife length.",
    "uses": [
      "Check a guillotine before cutting a stronger plate",
      "Find the thickest stainless a mild-steel-rated shear can take",
      "Compare raked and parallel blades"
    ],
    "users": [
      "Fabrication supervisors",
      "Sheet metal workers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "blades": "Parallel blades cut the whole length at once; raked blades cut progressively with much less force.",
      "t": "Thickness of the plate.",
      "b": "Length of the cut (parallel blades shear it all at once).",
      "uts": "Tensile strength of the plate.",
      "ratio": "Shear strength as a share of tensile strength (about 0.8 for steels).",
      "rake": "Rake angle of the moving blade.",
      "pen": "Share of the thickness the blade penetrates before the plate fractures.",
      "n": "Factor for the inclined blade formula.",
      "cap": "Rated force of the shear.",
      "Lk": "Length of the knives."
    },
    "outputs": [
      "Shearing and machine force",
      "Use of the rated capacity",
      "Largest thickness and cut length"
    ],
    "method": [
      "Parallel blades F = τ b t; inclined F = n τ_ratio σ_u p t² ÷ tan (rake); machine force = 1.3F for parallel blades (as the shearing force tool).",
      "Largest thickness: force grows with t for parallel blades and with t² for raked blades, so t_max = t × (capacity ÷ force) or t × √(capacity ÷ force).",
      "Cut length against the knife length.",
      "Example: 118.76 kN of the 500 kN capacity; the shear can cut up to 12.311 mm of this material."
    ],
    "limitations": [
      "Sharp blades with correct clearance; dull blades or wrong clearance raise the force considerably.",
      "Rated capacity as given by the maker, usually for mild steel at its rated thickness.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raked blades cut force roughly in proportion to plate thickness, which is why most plate shears have them."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1336–1339. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vee-groove-pin-inspection": {
    "purpose": "Inspection of a vee groove (or dovetail-like vee slot) by a gauge pin: the distance from the top surface to the pin centre, the depth to the vee apex and the pin height above the surface at the nominal width (as the vee groove pin tool), the readings at the width limits, and the groove width worked back from a measured pin height, with the check that the pin touches the flanks below the top edges.",
    "uses": [
      "Inspect a vee groove width with a pin and height gauge",
      "Choose a pin that touches the flanks properly",
      "Set the readings for a vee slot on a fixture"
    ],
    "users": [
      "Inspectors",
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "angle": "Included angle of the vee.",
      "width": "Width of the groove at the top surface on the drawing.",
      "tol": "Plus-or-minus tolerance on the width.",
      "pin": "Diameter of the gauge pin.",
      "hm": "Height of the top of the pin above the surface (negative if below)."
    },
    "outputs": [
      "Pin centre, apex depth and height at nominal",
      "Readings at the width limits",
      "Width from the reading and the decision"
    ],
    "method": [
      "Pin centre above the apex = (d ÷ 2) ÷ sin (A ÷ 2); apex depth = (W ÷ 2) ÷ tan (A ÷ 2); height above surface = d ÷ 2 + centre − depth (as the vee groove pin tool).",
      "Readings at the limits use W ± tolerance.",
      "Width from a reading = 2 tan (A ÷ 2) × (d ÷ 2 + centre − measured height).",
      "Example: the pin should stand 2.2426 mm above the surface; 2.25 mm gives a width of 9.9853 mm."
    ],
    "limitations": [
      "Sharp vee with straight flanks; a rounded apex does not matter as long as the pin touches the flanks.",
      "The angle is taken as correct; check it separately, as an angle error looks like a width error.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A pin that sits about half its diameter above the surface gives a good reading; one that rests on the edges reads nothing useful."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 682–691. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "special-section-beam-check": {
    "purpose": "Check of a beam with an uncommon solid section: area, second moment of area and extreme fibre distance of an ellipse, hollow ellipse, half circle, hexagon, isosceles triangle, or round bar with a hexagonal or square hole (as the more section shapes tool), then the reactions, largest bending moment, bending stress and deflection for a fixed, guided, propped or simply supported case (as the more beam cases tool), against your allowable stress and span-to-deflection limit, with the mass per metre.",
    "uses": [
      "Check a hex bar or half-round used as a beam",
      "Check a guide rail or slide of odd section",
      "Compare sections for stiffness"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Toolmakers"
    ],
    "inputs": {
      "shape": "Shape of the cross-section, bent about its horizontal axis.",
      "A": "First dimension of the section (see the shape list).",
      "B": "Second dimension.",
      "C": "Third dimension (hole or inner axis).",
      "D": "Fourth dimension (inner axis of the hollow ellipse).",
      "case": "How the beam is supported and loaded.",
      "load": "Each point load, or the total uniform load.",
      "L": "Span between supports.",
      "a": "Position of the load (see the beam case).",
      "E": "Modulus of elasticity of the material.",
      "allow": "Allowable bending stress.",
      "dlim": "Largest deflection allowed as a fraction of the span (250 means span ÷ 250).",
      "rho": "Density for the mass per metre."
    },
    "outputs": [
      "Section area, I and extreme fibre",
      "Reactions, moment, stress and deflection",
      "Against the stress and deflection limits"
    ],
    "method": [
      "Section area and I_x of the chosen shape; extreme fibre half the height, or the larger of the centroid distances for the half circle and triangle (as the more section shapes tool).",
      "Reactions, maximum moment and deflection for the beam case (as the more beam cases tool).",
      "Stress = M c ÷ I; deflection limit = span ÷ limit.",
      "Example: I = 779,420 mm⁴; 92.376 MPa and 6.7742 mm deflection against 8 mm allowed."
    ],
    "limitations": [
      "Bending about the horizontal axis only; unsymmetrical sections can also twist under load.",
      "Elastic, with rigid fixed ends where shown.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For the same area, sections with more material far from the axis (hollow shapes) are much stiffer."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 234–246, 257–270. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "force-group-support-check": {
    "purpose": "Check of a rigid member or base on a pinned support A and a roller support B: the resultant of up to four forces in any direction, its moment about the origin and where its line of action crosses the support line (as the force system tool), then the reactions at A (both directions) and B (perpendicular to the support line), any uplift at either support, and the reactions against the support capacities.",
    "uses": [
      "Find the support loads under a machine with several forces",
      "Check a base for uplift at one support",
      "Check bracket or beam supports for inclined loads"
    ],
    "users": [
      "Design engineers",
      "Structural detailers",
      "Engineering students"
    ],
    "inputs": {
      "F1": "Size of force 1 (0 if unused).",
      "a1": "Direction of force 1, anticlockwise from +X (−90 is straight down).",
      "x1": "X of any point on the line of force 1.",
      "y1": "Y of that point.",
      "F2": "Size of force 2.",
      "a2": "Direction of force 2.",
      "x2": "X of a point on force 2.",
      "y2": "Y of that point.",
      "F3": "Size of force 3.",
      "a3": "Direction of force 3.",
      "x3": "X of a point on force 3.",
      "y3": "Y of that point.",
      "F4": "Size of force 4.",
      "a4": "Direction of force 4.",
      "x4": "X of a point on force 4.",
      "y4": "Y of that point.",
      "xA": "Position of the pinned support (takes both X and Y loads).",
      "xB": "Position of the roller support (takes Y load only).",
      "capA": "Load support A can carry.",
      "capB": "Load support B can carry."
    },
    "outputs": [
      "Resultant, moment and line of action",
      "Reactions at A and B",
      "Uplift and capacity checks"
    ],
    "method": [
      "R_x = Σ F cos θ; R_y = Σ F sin θ; moment about the origin M = Σ (x F_y − y F_x); line of action crosses the X axis at M ÷ R_y (as the force system tool).",
      "Roller B: R_By = −(M − x_A R_y) ÷ (x_B − x_A); pin A: R_Ay = −R_y − R_By, R_Ax = −R_x.",
      "A negative (downward) reaction means uplift: that support must be held down.",
      "Example: resultant 3,000 N acting at X 366.67 mm; A carries 1,900 N and B 1,100 N."
    ],
    "limitations": [
      "Rigid member, forces in one plane, supports on the X axis.",
      "Static loads; dynamic and impact loads need factors.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the line of action of the resultant falls outside the supports, the far support lifts off unless it is held down."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grain-size-acceptance": {
    "purpose": "Acceptance of a material for grain size from up to five fields: the average of the readings (grains per square inch at 100×, grains per mm² at 1× or mean lineal intercept), the ASTM grain size number G from the average and from each field, the equivalent counts and intercept length (as the grain size tool), the spread between the coarsest and finest field, against the specified G range and your largest acceptable spread.",
    "uses": [
      "Accept bar or forgings against a grain size requirement",
      "Average several fields for a test report",
      "Spot a duplex (mixed) grain structure"
    ],
    "users": [
      "Metallurgists",
      "Quality engineers",
      "Lab technicians"
    ],
    "inputs": {
      "mode": "What was measured in each field.",
      "v1": "Reading in field 1.",
      "v2": "Reading in field 2.",
      "v3": "Reading in field 3.",
      "v4": "Reading in field 4.",
      "v5": "Reading in field 5.",
      "Gmin": "Lowest grain size number the specification allows (coarsest grains).",
      "Gmax": "Highest grain size number the specification allows (finest grains).",
      "spread": "Largest difference in G between fields you accept before treating the structure as mixed."
    },
    "outputs": [
      "Average reading and grain size number",
      "Each field’s G and the spread",
      "Against the specification"
    ],
    "method": [
      "G = 1 + log₂ n₁₀₀; G = 3.3219 log N_A − 2.954; G = −6.6439 log (ℓ̄ in mm) − 3.288 (as the grain size tool).",
      "Readings are averaged, then G is found from the average; each field’s G gives the spread.",
      "Accept when the average G lies within the specified range.",
      "Example: the average reading gives G 6.991, with fields from G 7.1293 to 6.858."
    ],
    "limitations": [
      "Equiaxed, single-phase grains; elongated or duplex structures need the full standard’s methods.",
      "Five fields give only a rough average; the standard sets field counts for a given precision.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each step of one in G halves or doubles the number of grains per unit area."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 369–380. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM E112 Standard Test Methods for Determining Average Grain Size"
    ]
  },
  "polar-hole-position-check": {
    "purpose": "Inspection of up to four holes dimensioned in polar coordinates: the nominal X and Y of each hole from its radius and angle (as the polar coordinates tool), the distance from nominal to the measured centre (as the distance between two points tool), the position error as a diameter, and the position tolerance allowed at the measured hole size including bonus tolerance from maximum material condition, with the hole size checked against its limits.",
    "uses": [
      "Check a polar hole pattern from CMM X–Y results",
      "Apply bonus tolerance to hole positions",
      "Convert polar drawing dimensions for inspection"
    ],
    "users": [
      "Inspectors",
      "Quality engineers",
      "CNC programmers"
    ],
    "inputs": {
      "n": "Number of holes to check.",
      "r1": "Radius of hole 1 from the datum centre.",
      "ang1": "Angle of hole 1 from +X, anticlockwise.",
      "mx1": "Measured X of hole 1.",
      "my1": "Measured Y of hole 1.",
      "md1": "Measured diameter of hole 1.",
      "r2": "Radius of hole 2.",
      "ang2": "Angle of hole 2.",
      "mx2": "Measured X of hole 2.",
      "my2": "Measured Y of hole 2.",
      "md2": "Measured diameter of hole 2.",
      "r3": "Radius of hole 3.",
      "ang3": "Angle of hole 3.",
      "mx3": "Measured X of hole 3.",
      "my3": "Measured Y of hole 3.",
      "md3": "Measured diameter of hole 3.",
      "r4": "Radius of hole 4.",
      "ang4": "Angle of hole 4.",
      "mx4": "Measured X of hole 4.",
      "my4": "Measured Y of hole 4.",
      "md4": "Measured diameter of hole 4.",
      "tp": "Diameter of the position tolerance zone at maximum material condition.",
      "dMMC": "Smallest allowed hole size.",
      "dLMC": "Largest allowed hole size."
    },
    "outputs": [
      "Nominal X and Y of each hole",
      "Position error and tolerance allowed",
      "Size and position decision"
    ],
    "method": [
      "Nominal X = r cos θ, Y = r sin θ (as the polar coordinates tool).",
      "Deviation = √(Δx² + Δy²) (as the distance between two points tool); position error = 2 × deviation.",
      "Tolerance allowed = position tolerance + (measured size − MMC size) for a hole within its size limits.",
      "Example: the worst hole uses 90.351% of its allowed position tolerance."
    ],
    "limitations": [
      "Two-dimensional position from the datum centre; datum shift and perpendicularity are not included.",
      "Hole size as a single measured diameter.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Bonus tolerance means a hole made larger than its smallest size may be further out of position and still assemble."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 40–45, 615–627, 692–694. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
