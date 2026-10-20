# MAKEOS handbook opportunity register

First section-by-section opportunity pass, 20 October 2026. **272 distinct opportunities: 24 implemented in batch 1, 10 mapped to existing tools, and 238 future candidates.** The register is a research and delivery backlog, not a claim that every possible engineering application or every page has been independently validated.

Reference: the supplied *Machinery’s Handbook, 29th edition* (Industrial Press, 2012), including its additional CD content. All twelve main section contents and the CD contents were inspected. Formula-bearing pages for batch 1 were examined selectively, and current primary technical sources were checked where used. Printed page numbers below are the handbook’s numbering, not PDF page indices. Do not copy handbook tables, illustrations, software or prose into the site.

## Architecture and scope

The current production directory is WORKOS at `/tools/`, with 63 pre-existing tools. MAKEOS is an engineering collection inside that same directory. Batch 1 adds 24 tools (87 total) and uses the existing form, result, sensitivity, guide, share and report system. Existing tool IDs, navigation, fonts, colours and CSS remain in place. Categories are introduced only when a working tool exists; no empty catalogue promises are published.

Requested category mapping: Engineering and Manufacturing retain their current names. Maintenance, Hydraulics, Pneumatics, Power Transmission, Materials, Fabrication and Quality are added in batch 1. Project Management maps to existing Projects/Planning/Quoting tools; Productivity maps to Operations/Improvement/Planning. Safety candidates remain behind documented technical review. Automation is a future subject, rather than a global navigation change.

## Delivery sequence

1. **Batch 1:** the 24 implemented rows below. Transparent SI calculations, examples, finite-input and geometry checks, references, reports and numerical tests.
2. **Batch 2:** signed tolerance stacks, uncertainty budgets, section properties, counterbore/countersink geometry, chip thinning, stock cutting, coolant mixing and welding quantities. Prioritise repeat use and independently verifiable examples.
3. **Batch 3:** variable-load bearings, pump/system curves, liquid pressure loss, shaft alignment, belt/chain/screw selection and controlled quality studies. Validate all applicability limits.
4. **Later batches:** standards-dependent thread/GD&T databases and load-rating or safety tools. Obtain current authoritative data, licensing and domain review before release. Never label a historical handbook number as a current approved rating.

Each candidate needs: a defined user decision; inputs/units/data provenance; exact model and domain; known numerical examples and boundary tests; an original accessible table or SVG chart where useful; guide and export; local QA; verified main-branch release; public URL checks. Never publish an empty calculator merely to increase the count.

## Status key

**Batch 1** links are implemented routes. **Next** means candidate, not scheduled or published. **Review** needs additional model, current-standard, manufacturer or domain validation. **Existing** avoids duplicate products. The topic’s presence in the handbook is a research lead; it does not by itself validate a future implementation.

## Mathematics

Source coverage: printed 1–146.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-001 | Fractional workshop dimensions | Engineering | Exact fractions, mixed units and rounding to a chosen increment | Next |
| MH-002 | Triangle solver | Engineering | Sides and angles with ambiguous-case detection | Next |
| MH-003 | Compound angle setup | Engineering | Two-plane angles and machine setup conventions | Next |
| MH-004 | Circle segment and chord | Engineering | Chord, sagitta, arc and segment area from consistent inputs | Next |
| MH-005 | Ellipse layout | Engineering | Axes, focal distance and coordinate table | Next |
| MH-006 | Regular polygon layout | Engineering | Across-flats, across-corners, side length and vertices | Next |
| MH-007 | Irregular area from coordinates | Engineering | Signed polygon area with self-intersection checks | Next |
| MH-008 | Tank fill geometry | Engineering | Horizontal cylindrical volume versus level curve | Next |
| MH-009 | Frustum volume | Engineering | Volume and surface area of truncated cones and pyramids | Next |
| MH-010 | Centroid of composite areas | Engineering | Signed areas and centroid coordinates | Next |
| MH-011 | Roller packing on a shaft | Engineering | Tangent-circle geometry and count envelope | Next |
| MH-012 | Linear interpolation with range checks | Engineering | Bracketed interpolation with explicit extrapolation refusal | Next |
| MH-013 | Simultaneous equation solver | Engineering | Small systems, residuals and singularity detection | Next |
| MH-014 | Measurement summary statistics | Quality | Mean, median, sample spread and histogram from uploaded values | Next |
| MH-015 | Mean comparison planner | Quality | Difference and interval under declared sampling assumptions | Review |
| MH-016 | Sample-size planning | Quality | Precision or power target and the assumed variance | Review |
| MH-017 | Equivalent annual cost | Project Management | Convert investment and uneven cash flows to an annual equivalent | Next |
| MH-018 | Depreciation comparison | Project Management | Generic straight-line and reducing-balance schedules; no tax advice | Next |
| MH-019 | NPV and payback | Project Management | Use the current investment and business-case tools | [Existing](https://kevos.com/tools/?tool=roi) |
| MH-020 | Break-even economics | Productivity | Use the current fixed/variable-cost model | [Existing](https://kevos.com/tools/?tool=break-even) |

## Mechanics and strength of materials

Source coverage: printed 147–368.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-021 | Force-vector resolution | Engineering | Components, resultant and angle in two or three dimensions | Next |
| MH-022 | Static equilibrium solver | Engineering | Forces and couples with equilibrium residuals | Next |
| MH-023 | Lever and strap-clamp reactions | Manufacturing | Reactions at workpiece and heel with contact-loss warning | Next |
| MH-024 | Inclined-plane force | Engineering | Gravity and stated friction on a plane | Next |
| MH-025 | Wedge force sensitivity | Manufacturing | Input effort versus friction with back-driving conditions | Next |
| MH-026 | Pulley force balance | Engineering | Ideal effort and rope travel; no lifting rating | Review |
| MH-027 | Power-screw effort | Power Transmission | Torque for raising and lowering with explicit friction | Next |
| MH-028 | Toggle geometry | Engineering | Position and ideal mechanical advantage away from singularities | Next |
| MH-029 | Motion profile | Engineering | Trapezoidal move time, velocity and acceleration curves | Next |
| MH-030 | Rotating mass force | Engineering | Centripetal force from mass, radius and speed | Next |
| MH-031 | Single-plane balance correction | Maintenance | Vector correction mass and angle from measured unbalance | Review |
| MH-032 | Two-plane balance worksheet | Maintenance | Influence coefficients with measurement quality checks | Review |
| MH-033 | Rotational inertia builder | Power Transmission | Composite inertia and radius of gyration | Next |
| MH-034 | Torque, Power and Speed | Power Transmission | Mechanical power to torque at an entered speed | [Batch 1](https://kevos.com/tools/?tool=torque-power) |
| MH-035 | Work and kinetic energy | Engineering | Translational and rotational energy with unit checks | Next |
| MH-036 | Impact-energy worksheet | Safety | Energy bookkeeping; no impact-force or injury threshold claim | Review |
| MH-037 | Axial stress and extension | Engineering | Uniform member stress, strain and displacement | Next |
| MH-038 | Combined plane stress | Engineering | Principal stresses, Mohr circle and declared yield criteria | Review |
| MH-039 | Stress concentration study | Engineering | Apply user-supplied concentration factors; no copied charts | Review |
| MH-040 | Fatigue load cycle summary | Engineering | Mean and alternating stress; qualified material model required | Review |
| MH-041 | Section property builder | Engineering | Area, centroid, second moments and section moduli | Next |
| MH-042 | Beam Stress and Deflection | Engineering | Three stated elastic beam load cases | [Batch 1](https://kevos.com/tools/?tool=beam-deflection) |
| MH-043 | Beam superposition workbench | Engineering | Multiple loads with shear, moment and deflection diagrams | Review |
| MH-044 | Curved beam screen | Engineering | Curved-beam stress with geometric applicability checks | Review |
| MH-045 | Column buckling screen | Engineering | Euler load and slenderness; no structural code approval | Review |
| MH-046 | Thin pressure-shell stress | Engineering | Membrane stress with thin-wall checks; no vessel rating | Review |
| MH-047 | Thick-cylinder stress | Engineering | Lamé radial and hoop stresses with boundary checks | Review |
| MH-048 | Circular Shaft Torsion | Power Transmission | Solid or hollow circular shaft stress and twist | [Batch 1](https://kevos.com/tools/?tool=shaft-torsion) |
| MH-049 | Shaft critical-speed estimate | Power Transmission | Simple rotor/shaft model with resonance exclusions | Review |
| MH-050 | Compression spring workbench | Engineering | Rate, stress and solid-height checks from specified geometry | Review |
| MH-051 | Extension spring workbench | Engineering | Rate and initial tension with hook limitations | Review |
| MH-052 | Torsion spring workbench | Engineering | Angular rate and body stress with leg compliance | Review |
| MH-053 | Disc spring stack model | Engineering | Series/parallel stack curves from supplier-rated single discs | Review |
| MH-054 | Hydrostatic load on a surface | Hydraulics | Resultant fluid force and centre of pressure | Next |
| MH-055 | Buoyancy and displaced volume | Hydraulics | Net force under stated density and immersion | Next |

## Properties, treatment and testing of materials

Source coverage: printed 369–607.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-056 | Linear Thermal Growth | Materials | Signed free expansion from a supplied coefficient | [Batch 1](https://kevos.com/tools/?tool=thermal-growth) |
| MH-057 | Differential thermal fit | Materials | Two mating dimensions and their independent temperatures | Next |
| MH-058 | Restrained thermal stress | Materials | Ideal restraint case with elastic applicability checks | Review |
| MH-059 | Heat energy and heating time | Materials | Sensible/latent heat budget and stated heater efficiency | Next |
| MH-060 | Thermal resistance network | Materials | Series/parallel conduction paths and interface assumptions | Next |
| MH-061 | Stock Volume and Mass | Materials | Plate, bar and tube with supplied density | [Batch 1](https://kevos.com/tools/?tool=stock-mass) |
| MH-062 | Mixture density | Materials | Mass and volume fractions with porosity assumptions | Next |
| MH-063 | Material substitution worksheet | Materials | Compare measured properties, standards and processing conditions | Review |
| MH-064 | Steel designation navigator | Materials | Links to current standards and suppliers; no asserted equivalence | Review |
| MH-065 | Tool steel selection worksheet | Materials | Rank documented wear, toughness and temperature requirements | Review |
| MH-066 | Heat-treatment distortion register | Quality | Before/after measurements and dimensional change analysis | Next |
| MH-067 | Quench bath heat balance | Materials | Thermal load and bath temperature rise; no process recipe | Review |
| MH-068 | Hardness test geometry | Quality | Indentation-based hardness arithmetic with units and validity ranges | Review |
| MH-069 | Hardness comparison navigator | Materials | Current licensed conversion source and material-specific limits | Review |
| MH-070 | Material test stress–strain plot | Materials | Engineering/true strain conversion within stated limits | Next |
| MH-071 | Plastic creep data viewer | Materials | User-supplied isochronous curves and interpolation | Review |
| MH-072 | Injection-mould clamp force | Manufacturing | Projected area and specified cavity pressure, including runners | Review |
| MH-073 | Mould shrinkage allowance | Manufacturing | Dimensions from validated directional shrinkage factors | Review |
| MH-074 | Snap-fit strain screen | Engineering | Declared cantilever geometry, strain and creep limitations | Review |
| MH-075 | Corrosion compatibility register | Materials | Evidence links and service conditions, without unsupported ratings | Review |

## Dimensioning, gauging and measuring

Source coverage: printed 608–753.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-076 | Hole and Shaft Clearance Limits | Engineering | Worst-case signed diametral clearance from explicit limits | [Batch 1](https://kevos.com/tools/?tool=fit-clearance) |
| MH-077 | Signed tolerance stack | Engineering | Many-component worst-case bounds with contribution table | Next |
| MH-078 | Statistical tolerance stack | Quality | Covariance model, distribution assumptions and sensitivity | Review |
| MH-079 | Thermal tolerance envelope | Engineering | Enumerate dimensional and thermal corner cases | Next |
| MH-080 | Measurement uncertainty budget | Quality | Sensitivity coefficients, covariance and coverage assumptions | Review |
| MH-081 | Guard-band decision helper | Quality | User-agreed decision rule and measurement interval | Review |
| MH-082 | Position-error conversion | Quality | Cartesian offset to radial and diametral position error | Next |
| MH-083 | Virtual-condition worksheet | Engineering | Current GD&T standard selected explicitly | Review |
| MH-084 | Bonus-tolerance worksheet | Quality | Size and geometric boundary arithmetic under a selected standard | Review |
| MH-085 | Fit designation reference | Engineering | Verified current ISO/ANSI data with licensing provenance | Review |
| MH-086 | Shrink-fit temperature screen | Manufacturing | Differential expansion and assembly clearance; strength separate | Review |
| MH-087 | Sine Bar Height | Quality | Roller-centre distance to gauge-block height | [Batch 1](https://kevos.com/tools/?tool=sine-bar) |
| MH-088 | Taper Angle and Ratio | Engineering | Conical half-angle and diametral taper | [Batch 1](https://kevos.com/tools/?tool=taper-geometry) |
| MH-089 | Bolt Circle Coordinates | Engineering | Numbered X/Y table with origin and direction | [Batch 1](https://kevos.com/tools/?tool=bolt-circle) |
| MH-090 | Radius from chord and sagitta | Quality | Arc radius and measurement sensitivity | Next |
| MH-091 | Over-pins groove geometry | Quality | Declared V geometry and contact assumptions | Review |
| MH-092 | Gauge-block combination finder | Quality | Minimum-block combinations from the user's available set | Next |
| MH-093 | Calibration drift tracker | Quality | Trend, uncertainty and user-defined recall triggers | Review |
| MH-094 | Surface-plate grid analysis | Quality | User-supplied height grid and datum plane | Review |
| MH-095 | Surface profile parameter viewer | Quality | Ra/Rq/Rz from traces with filtering/cutoff explicitly selected | Review |
| MH-096 | Measurement resolution budget | Quality | Quantisation contribution and suitable display precision | Next |

## Tooling and toolmaking

Source coverage: printed 754–1003.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-097 | Tool-angle conversion | Manufacturing | Transform rake/relief conventions for defined tool geometry | Next |
| MH-098 | Turning cusp-height estimate | Manufacturing | Feed and nose-radius geometry; actual finish requires trials | Next |
| MH-099 | Form-tool profile compensation | Manufacturing | Geometry correction for declared rake and relief | Review |
| MH-100 | Milling cutter engagement viewer | Manufacturing | Contact arc and effective teeth for stated engagement | Next |
| MH-101 | Cutter tooth-rest setting | Manufacturing | Clearance-angle and indicator-drop geometry | Review |
| MH-102 | Reamer allowance worksheet | Manufacturing | Compare supplied stock allowance against supplier recommendations | Next |
| MH-103 | Drill point geometry | Manufacturing | Point length and lip geometry; shares geometry with drilling tool | Next |
| MH-104 | Counterbore and countersink depth | Manufacturing | Diameter, pilot diameter and included-angle depth | Next |
| MH-105 | Drill-size reference navigator | Manufacturing | Current supplier letter/number/fraction size data | Review |
| MH-106 | Tap-limit reference navigator | Manufacturing | Link current thread-limit and material application data | Review |
| MH-107 | Taper inspection comparator | Quality | Measured taper deviations from entered nominal geometry | Next |
| MH-108 | Tool overhang stiffness | Manufacturing | Simplified shank stiffness with holder compliance separated | Review |
| MH-109 | Broach length and tooth count | Manufacturing | Rise per tooth, cut depth and finishing-tooth allowance | Review |
| MH-110 | Knurl blank geometry | Manufacturing | Pitch and integer tooth closure with trial allowance | Review |
| MH-111 | Tool wear trend | Maintenance | Measured wear versus cutting time and user-defined replacement trigger | Next |

## Machining operations

Source coverage: printed 1004–1327.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-112 | Cutting Speed and Spindle RPM | Manufacturing | Specified surface speed and effective diameter to RPM | [Batch 1](https://kevos.com/tools/?tool=cutting-speed) |
| MH-113 | Milling Feed, Removal Rate and Time | Manufacturing | Steady table feed, removal and cutting time | [Batch 1](https://kevos.com/tools/?tool=milling-feed-time) |
| MH-114 | Turning Feed and Cutting Time | Manufacturing | Constant-RPM equal axial passes | [Batch 1](https://kevos.com/tools/?tool=turning-time) |
| MH-115 | Drilling Travel and Time | Manufacturing | Through-hole travel including conical point | [Batch 1](https://kevos.com/tools/?tool=drilling-time) |
| MH-116 | Facing time with speed cap | Manufacturing | Integrate CSS/RPM-limited radial motion | Next |
| MH-117 | Radial chip-thinning compensation | Manufacturing | Engagement geometry with cutter-type applicability | Review |
| MH-118 | Ball-nose effective diameter | Manufacturing | Contact diameter at a stated axial engagement | Next |
| MH-119 | Circular interpolation feed | Manufacturing | Tool-centre feed versus work-surface feed | Next |
| MH-120 | Machining power estimate | Manufacturing | Removal rate and supplied specific cutting force | Review |
| MH-121 | Drilling torque and thrust screen | Manufacturing | Supplier-supported coefficients and tool geometry | Review |
| MH-122 | Taylor tool-life fit | Productivity | Fit coefficients from trials and plot uncertainty | Review |
| MH-123 | Economic cutting speed | Productivity | Tool cost, change time and validated tool-life model | Review |
| MH-124 | Cost per cutting edge | Productivity | Edges used, tool changes and measured parts per edge | Next |
| MH-125 | Multi-operation cycle estimator | Productivity | Cutting, handling, inspection and change time without double counting | Next |
| MH-126 | Saw cutting-time estimator | Manufacturing | Section area and validated cutting rate | Next |
| MH-127 | Coolant concentration mixer | Maintenance | Blend volumes from refractometer factor and target concentration | Next |
| MH-128 | Coolant top-up mass balance | Maintenance | Account for concentrate, water and existing sump volume | Next |
| MH-129 | Grinding wheel surface speed | Manufacturing | RPM and diameter; compare only against entered maker rating | Review |
| MH-130 | Grinding ratio and removal | Manufacturing | Work volume divided by measured wheel wear volume | Next |
| MH-131 | Grinding equivalent chip thickness | Manufacturing | Kinematic proxy with process-specific interpretation | Review |
| MH-132 | Honing cross-hatch geometry | Manufacturing | Reciprocation/rotation ratio and angle convention | Next |
| MH-133 | CNC coordinate transform | Manufacturing | Translation and rotation, with explicit handedness | Next |
| MH-134 | CNC arc consistency checker | Manufacturing | Endpoints, centre offsets and radius residuals; no automatic machine execution | Next |
| MH-135 | CNC cycle-time reconciliation | Productivity | Compare ideal calculations with measured cycle segments | Next |

## Manufacturing processes

Source coverage: printed 1328–1516.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-136 | Sheet Bend Allowance and Deduction | Fabrication | Single bend with supplied K-factor and outside dimensions | [Batch 1](https://kevos.com/tools/?tool=bend-allowance) |
| MH-137 | Punching Force Estimate | Fabrication | Simultaneous perimeter, thickness and supplied shear strength | [Batch 1](https://kevos.com/tools/?tool=punching-force) |
| MH-138 | Punch clearance worksheet | Fabrication | Per-side versus total clearance using supplier-approved inputs | Review |
| MH-139 | Multi-bend flat-pattern calculator | Fabrication | Ordered bend deductions and flange convention checks | Next |
| MH-140 | Press brake force screen | Fabrication | Selected tooling equation with verified material/process inputs | Review |
| MH-141 | Roll-bending geometry | Fabrication | Cylinder/cone development with springback excluded | Next |
| MH-142 | Tube bend development | Fabrication | Centreline bend allowance and straight lengths | Next |
| MH-143 | Deep-draw blank estimator | Fabrication | Area conservation with thickness and trim assumptions | Review |
| MH-144 | Draw reduction sequence | Fabrication | Trial-supported stage limits and material evidence | Review |
| MH-145 | Press energy and cycle screen | Manufacturing | Force–stroke integration against supplied machine curve | Review |
| MH-146 | EDM electrode offset | Manufacturing | Geometry allowance from validated spark-gap data | Next |
| MH-147 | Wire EDM path time | Manufacturing | Cut length, passes and measured feed with thread-up time | Next |
| MH-148 | Casting pattern allowance | Manufacturing | Directional contraction and machining allowances | Next |
| MH-149 | Casting yield | Manufacturing | Finished casting mass versus poured metal including gates/risers | Next |
| MH-150 | Casting solidification comparison | Manufacturing | Modulus-based estimate with fitted process coefficient | Review |
| MH-151 | Weld metal volume and mass | Fabrication | Specified groove/fillet geometry with reinforcement allowance | Next |
| MH-152 | Weld deposition time | Fabrication | Deposited mass and demonstrated deposition rate/arc-on fraction | Next |
| MH-153 | Welding heat input | Fabrication | Voltage, current, travel and named efficiency convention | Review |
| MH-154 | Weld group elastic forces | Engineering | Declared load model; qualified weld design remains separate | Review |
| MH-155 | Laser line energy | Manufacturing | Power divided by travel; no cut or exposure setting recommendation | Review |
| MH-156 | Coating area and material demand | Fabrication | Area, dry-film thickness, solids and transfer efficiency | Next |
| MH-157 | Plating deposition estimate | Manufacturing | Faraday-law arithmetic with chemistry/process validation | Review |

## Fasteners

Source coverage: printed 1517–1801.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-158 | Bolt preload sensitivity | Engineering | Torque, nut factor and clamp-load range without a recommended torque | Review |
| MH-159 | Bolt elongation | Quality | Elastic extension from specified tensile area and grip model | Review |
| MH-160 | Bolted-joint stiffness | Engineering | Load sharing from supplied bolt/member stiffness | Review |
| MH-161 | Joint separation screen | Engineering | External load versus initial clamp and stiffness model | Review |
| MH-162 | Bolt combined stress | Engineering | Tension/torsion/shear under a declared failure criterion | Review |
| MH-163 | Bolt-group force distribution | Engineering | Elastic axial/eccentric load distribution | Review |
| MH-164 | Fastener engagement worksheet | Engineering | Current material/thread stripping model and uncertainty | Review |
| MH-165 | Bolt length and grip planner | Manufacturing | Stack, washers, nut engagement and thread runout | Next |
| MH-166 | Countersunk fastener geometry | Engineering | Head envelope and countersink depth from supplied dimensions | Next |
| MH-167 | Thread insert selection worksheet | Maintenance | Supplier engagement and parent-material evidence | Review |
| MH-168 | Riveted-joint load screen | Engineering | Shear, bearing and net-section checks with declared allowables | Review |
| MH-169 | Rivet stock length | Fabrication | Grip plus supplier-approved head-forming allowance | Next |
| MH-170 | Pin shear and bearing | Engineering | Single/double-shear ideal models with bending limitations | Review |
| MH-171 | Set-screw retention worksheet | Engineering | Compare supplier-tested retention evidence | Review |
| MH-172 | Fastener inspection register | Quality | Certificate, grade, lot and installation evidence | Next |
| MH-173 | Axial retention selection | Engineering | Use the existing evidence-gated candidate selector | [Existing](https://kevos.com/tools/?tool=retention-selector) |

## Threads and threading

Source coverage: printed 1802–2121.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-174 | Tapping Feed and Thread Lead | Manufacturing | Pitch, starts, speed and synchronous feed | [Batch 1](https://kevos.com/tools/?tool=tapping-feed) |
| MH-175 | Pitch and TPI converter | Manufacturing | Exact 25.4/TPI conversion and lead distinction | Next |
| MH-176 | Basic thread profile geometry | Engineering | Declared form and nominal pitch; no tolerance inference | Review |
| MH-177 | Thread class lookup | Quality | Licensed current standard edition and traceable limit values | Review |
| MH-178 | Thread coating allowance | Engineering | Coating geometry and documented tolerance allocation | Review |
| MH-179 | Three-wire thread measurement | Quality | Wire diameter, pitch geometry and helix corrections | Review |
| MH-180 | Thread helix-angle calculator | Manufacturing | Lead and pitch diameter with holder compatibility limits | Next |
| MH-181 | Thread engagement length planner | Manufacturing | Full-form length, chamfer and runout allowances | Next |
| MH-182 | Tap drill candidate comparison | Manufacturing | Supplier-recommended drills and actual measured thread performance | Review |
| MH-183 | Acme screw geometry | Power Transmission | Basic dimensions for a selected current standard | Review |
| MH-184 | Buttress thread geometry | Power Transmission | Declared load-face/back-face form and dimensions | Review |
| MH-185 | Pipe thread inspection worksheet | Quality | Current standard gauge method; do not infer pressure tightness | Review |
| MH-186 | Thread milling path and feed | Manufacturing | Helical path length and centreline feed compensation | Next |
| MH-187 | Indexing head setup | Manufacturing | Simple/compound indexing from an available plate inventory | Next |
| MH-188 | Differential indexing planner | Manufacturing | Gear-train combinations with setup verification | Review |
| MH-189 | Thread rolling blank worksheet | Manufacturing | Validated blank diameter, volume and trial record | Review |

## Gears, splines and cams

Source coverage: printed 2122–2309.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-190 | Spur Gear Pair Geometry | Power Transmission | Unshifted external spur pair reference geometry | [Batch 1](https://kevos.com/tools/?tool=gear-pair) |
| MH-191 | Involute function and inverse | Power Transmission | Angle conversion and numerical residual check | Next |
| MH-192 | Profile-shifted spur geometry | Power Transmission | Operating pressure angle and centre-distance relationships | Review |
| MH-193 | Helical gear geometry | Power Transmission | Normal/transverse systems and axial thrust | Review |
| MH-194 | Bevel gear geometry | Power Transmission | Pitch cones and tooth-system limitations | Review |
| MH-195 | Worm drive kinematics | Power Transmission | Starts, lead angle and speed ratio | Next |
| MH-196 | Gear tooth force resolver | Power Transmission | Tangential, radial and axial components | Next |
| MH-197 | Gear contact ratio | Power Transmission | Line-of-action geometry and interference checks | Review |
| MH-198 | Gear backlash sensitivity | Power Transmission | Centre-distance and tooth-thickness contributions | Review |
| MH-199 | Gear strength worksheet | Power Transmission | Current rating standard and licensed factors | Review |
| MH-200 | Gear measurement over pins | Quality | Declared tooth geometry, pin size and contact conditions | Review |
| MH-201 | Gear span measurement | Quality | Base tangent length for the specified tooth system | Review |
| MH-202 | Compound gear train | Power Transmission | Stage ratios, direction and efficiency allocation | Next |
| MH-203 | Planetary gear kinematics | Power Transmission | Willis relation with fixed/input/output member identified | Next |
| MH-204 | Spline contact pressure screen | Power Transmission | Effective engagement, load distribution and supplier limits | Review |
| MH-205 | Cam motion profile | Engineering | Displacement, velocity, acceleration and jerk curves | Next |
| MH-206 | Cam pressure angle | Engineering | Follower geometry and chosen motion law | Review |
| MH-207 | Cam curvature and undercut | Engineering | Local radius and roller envelope verification | Review |

## Machine elements

Source coverage: printed 2310–2650.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-208 | Plain bearing PV screen | Power Transmission | Projected pressure and surface speed against supplier evidence | Review |
| MH-209 | Journal bearing data workbench | Power Transmission | Dimensionless parameters with validated viscosity/clearance | Review |
| MH-210 | Rolling bearing basic rating life | Maintenance | Entered C/P and exponent; no adjusted-life claim | Review |
| MH-211 | Variable-load bearing life | Maintenance | Equivalent duty load and speed weighting | Review |
| MH-212 | Bearing fit and clearance budget | Engineering | Mounted/operating clearance from traceable fit and thermal data | Review |
| MH-213 | Lubricant viscosity interpolation | Maintenance | Standardised temperature-viscosity relation from two data points | Review |
| MH-214 | Grease quantity worksheet | Maintenance | Supplier-specific replenishment method and service conditions | Review |
| MH-215 | Oil cleanliness trend | Maintenance | Measured particle counts and current code interpretation | Review |
| MH-216 | Filter efficiency conversion | Maintenance | Beta ratio to capture efficiency at a specified particle size | Next |
| MH-217 | Lubricant contamination dilution | Maintenance | Mass balance for a planned change with residual fluid | Next |
| MH-218 | Coupling selection worksheet | Power Transmission | Torque, speed, misalignment and supplier evidence | Review |
| MH-219 | Universal joint speed fluctuation | Power Transmission | Kinematic ratio over a revolution | Next |
| MH-220 | Clutch torque screen | Power Transmission | Friction model, contact pressure and heat per engagement | Review |
| MH-221 | Brake energy budget | Safety | Kinetic and potential energy per stop; no stopping-distance approval | Review |
| MH-222 | Key shear and bearing | Power Transmission | Declared key contact dimensions and load distribution | Review |
| MH-223 | Open Belt Drive Geometry | Power Transmission | Exact tangent/arc length, wrap and ideal speed | [Batch 1](https://kevos.com/tools/?tool=belt-drive) |
| MH-224 | Belt tension difference | Power Transmission | Transmitted power and belt speed; pretension separate | Review |
| MH-225 | Chain length and centres | Power Transmission | Pitch, tooth counts, links and centre-distance iteration | Next |
| MH-226 | Chain sprocket geometry | Power Transmission | Pitch diameter and polygonal speed effect | Next |
| MH-227 | Lead-screw drive sizing | Power Transmission | Axial speed, thrust, efficiency and reflected inertia | Review |
| MH-228 | Motor acceleration sizing | Power Transmission | Load inertia, speed ramp and friction torque | Next |
| MH-229 | Motor duty RMS torque | Power Transmission | Time-weighted torque cycle and peak limits | Review |
| MH-230 | Adhesive mixing quantity | Manufacturing | Specified mass/volume ratio and batch allowance | Next |
| MH-231 | O-ring squeeze and fill | Engineering | Supplied seal/gland geometry and supplier limits | Review |
| MH-232 | Shaft alignment shim calculator | Maintenance | Rim/face or reverse-dial geometry, sag and soft-foot evidence | Review |
| MH-233 | Wire-rope inspection register | Safety | Manufacturer and current-standard criteria with human sign-off | Review |

## Measuring units

Source coverage: printed 2651–2700.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-234 | Engineering unit converter | Engineering | Dimension-checked SI/US length, area, volume, force, pressure, torque, power and energy | Next |
| MH-235 | Compound-unit conversion checker | Engineering | Distinguish mass from force and volume from standard gas volume | Next |
| MH-236 | Temperature and interval converter | Materials | Absolute temperature versus temperature-difference conversions | Next |
| MH-237 | Engineering notation and rounding | Quality | Significant digits, scientific notation and explicit rounding rule | Next |
| MH-238 | Unit-consistency worksheet | Engineering | Record input dimensions and flag incompatible equations | Next |

## Additional CD material

Source coverage: printed 2864–3492.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-239 | Hydraulic Cylinder Force and Speed | Hydraulics | Net port forces and ideal stroke times | [Batch 1](https://kevos.com/tools/?tool=hydraulic-cylinder) |
| MH-240 | Hydraulic Power and Pump Input | Hydraulics | Differential pressure, delivered flow and overall efficiency | [Batch 1](https://kevos.com/tools/?tool=hydraulic-power) |
| MH-241 | Liquid Pipe Velocity and Reynolds Number | Hydraulics | Newtonian liquid full-pipe continuity and regime guide | [Batch 1](https://kevos.com/tools/?tool=pipe-flow) |
| MH-242 | Pneumatic Cylinder Air Demand | Pneumatics | Ideal-gas reference volume with explicit absolute conditions | [Batch 1](https://kevos.com/tools/?tool=pneumatic-consumption) |
| MH-243 | Liquid pressure-drop workbench | Hydraulics | Darcy factor, roughness and minor losses with validity checks | Review |
| MH-244 | Pump operating-point comparison | Hydraulics | Intersect entered pump and system curves | Review |
| MH-245 | Hydraulic motor duty | Hydraulics | Displacement, speed, flow, torque and declared efficiencies | Review |
| MH-246 | Hydraulic accumulator worksheet | Hydraulics | Gas-law storage under manufacturer precharge constraints | Review |
| MH-247 | Hydraulic circuit flow intensification | Hydraulics | Area ratios and opposing-port consequences | Review |
| MH-248 | Nozzle flow screen | Hydraulics | Discharge coefficient and pressure/head relationship | Review |
| MH-249 | Air receiver usable volume | Pneumatics | Pressure-window mass balance and stated temperature model | Review |
| MH-250 | Compressed-air leak cost | Pneumatics | Measured leak flow, duty, energy intensity and tariff | Next |
| MH-251 | Pneumatic force margin | Pneumatics | Pressure, friction and back pressure with dynamic limits | Review |
| MH-252 | Pneumatic valve flow worksheet | Pneumatics | Current supplier sonic-conductance/choked-flow model | Review |
| MH-253 | Motion-control reflected inertia | Automation | Transmission ratios, load inertia and acceleration duty | Next |
| MH-254 | Noise level summation | Safety | Logarithmic source combination; no exposure-compliance conclusion | Review |
| MH-255 | Jig bushing location budget | Manufacturing | Supplied bushing clearance, plate geometry and tool deflection | Review |
| MH-256 | Grinding wheel rating comparator | Safety | Calculated speed versus entered traceable wheel/machine ratings | Review |

## Cross-chapter extensions and existing coverage

Source coverage: printed Related applications; extra research required.

| ID | Tool opportunity | Category | Calculation, chart or workflow | Status |
| --- | --- | --- | --- | --- |
| MH-257 | Repairable Asset Availability | Maintenance | Observed availability and repairable-asset event averages | [Batch 1](https://kevos.com/tools/?tool=maintenance-availability) |
| MH-258 | Process Capability from Summary Data | Quality | Cp/Cpk arithmetic with unverified assumptions kept visible | [Batch 1](https://kevos.com/tools/?tool=process-capability) |
| MH-259 | Repeatability and reproducibility study | Quality | Crossed/nested study, variance components and intervals | Review |
| MH-260 | Control-chart workbench | Quality | Select chart by data type; rational subgroup and stability checks | Review |
| MH-261 | Acceptance-sampling planner | Quality | Agreed risks and current sampling standard | Review |
| MH-262 | Dimensional trial comparison | Quality | Pilot groups, effect sizes and measurement uncertainty | Review |
| MH-263 | Maintenance interval economics | Maintenance | Failure evidence, consequence and cost model; human review | Review |
| MH-264 | Cut-stock optimiser | Fabrication | Stock lengths, kerf, trim, required counts and reusable offcuts | Next |
| MH-265 | Setup reduction value | Productivity | Use the existing measured changeover comparison | [Existing](https://kevos.com/tools/?tool=setup-worth) |
| MH-266 | OEE and downtime analysis | Productivity | Use the existing availability/performance/quality model | [Existing](https://kevos.com/tools/?tool=oee-downtime-pro) |
| MH-267 | Manufacturing quote builder | Project Management | Use the current complete cost and margin model | [Existing](https://kevos.com/tools/?tool=manufacturing-quote) |
| MH-268 | Capacity planning | Productivity | Use the existing resource and machine-capacity tools | [Existing](https://kevos.com/tools/?tool=capacity-planner-pro) |
| MH-269 | Jig and fixture investment | Project Management | Use the existing lifecycle comparison | [Existing](https://kevos.com/tools/?tool=jig-fixture-roi) |
| MH-270 | Engineering change impact | Project Management | Use the current scope/cost/time decision tool | [Existing](https://kevos.com/tools/?tool=change-impact) |
| MH-271 | Risk assessment register | Safety | Use the existing risk matrix with qualified task review | [Existing](https://kevos.com/tools/?tool=risk-score) |
| MH-272 | Commissioning evidence pack | Project Management | Requirements, tests, results, deviations and release responsibilities | Next |

## Chart opportunities

Create original code-native charts from user data or the implemented equations: load/deflection and shear/moment diagrams; spindle-speed versus diameter; feed/time and cost sensitivity; torque–speed curves; thermal fit envelopes; tolerance contribution and uncertainty bars; pump/system intersections; cylinder force/flow curves; gear/cam displacement and acceleration; bearing duty contributions; control charts, histograms and capability overlays. Every chart needs units, assumptions, an accessible data table and a useful export. The current batch reuses the existing sensitivity tables and adds a bolt-circle coordinate table; these future charts are not claimed as built.

## Exclusions and current-data dependencies

Do not turn old chemical recipes, historical electrical ampacity tables, explosive forming instructions, obsolete control syntax, legacy tax rules, or generic rope/crane load tables into automatic operating recommendations. Historical lookup tables are not a current catalogue licence. Safety and pressure-equipment calculations must not imply certification. Manufacturer limits, current standards, machine configuration and local legal requirements need separate confirmation.

Standard identifiers and bibliographic page references may be recorded, but copyrighted tabulations require permission or an independently authorised dataset. Numerical methods and original examples are developed independently. The supplied PDF stays outside the repository and public assets.
