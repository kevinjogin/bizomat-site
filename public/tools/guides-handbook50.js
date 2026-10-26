// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook50).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "shaft-alignment-plan": {
    "purpose": "Alignment plan for a movable machine coupled to a stationary one: offset and slope at the coupling and the corrections at the front and back feet from rim and face dial readings (as the rim and face alignment tool), the vertical thermal growth of each machine from its foot-to-centreline height and support temperature rise and the cold offset to allow (as the thermal growth for hot alignment tool), the cold shim corrections that give true alignment when hot, and the running offset and angularity if nothing is changed, against your tolerances.",
    "uses": [
      "Plan shims for a pump or fan alignment",
      "Allow for thermal growth when aligning cold",
      "Decide whether a machine needs realigning"
    ],
    "users": [
      "Millwrights",
      "Maintenance fitters",
      "Reliability engineers"
    ],
    "inputs": {
      "rim": "Rim dial reading at the bottom, with the dial zeroed at the top (as the rim and face tool).",
      "face": "Face dial reading at the bottom, zeroed at the top.",
      "dia": "Diameter of the circle the face indicator travels on.",
      "front": "Distance from the coupling to the front feet of the movable machine.",
      "back": "Distance from the coupling to the back feet.",
      "H1": "Height from the stationary machine’s feet to its shaft centreline.",
      "a1": "Expansion coefficient of the stationary machine’s supports.",
      "dT1": "Rise in temperature of the stationary machine’s supports from cold to running.",
      "H2": "Height from the movable machine’s feet to its shaft centreline.",
      "a2": "Expansion coefficient of the movable machine’s supports.",
      "dT2": "Rise in temperature of the movable machine’s supports.",
      "tolOff": "Largest running offset you accept at the coupling.",
      "tolAng": "Largest running angularity you accept."
    },
    "outputs": [
      "Offset, slope and foot corrections from the readings",
      "Thermal growth and cold offset",
      "Cold shim corrections and running misalignment"
    ],
    "method": [
      "Offset = rim ÷ 2; slope = face ÷ face diameter; correction at a foot = offset + slope × distance, positive meaning add shims (as the rim and face alignment tool).",
      "Growth = α H ΔT for each machine; the movable machine rises by g₂ − g₁ more than the stationary one when hot (as the thermal growth tool).",
      "Cold correction = correction − (g₂ − g₁) at both feet; running offset if unchanged = offset − (g₂ − g₁); angularity = slope × 100.",
      "Example: add 0.12517 mm at the front feet and add 0.29183 mm at the back; the movable machine grows 0.099 mm more than the stationary one."
    ],
    "limitations": [
      "Vertical plane only; repeat for the horizontal plane with side readings (no thermal term unless the supports grow sideways).",
      "Rigid feet with no soft foot; check soft foot before shimming.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A machine that runs hotter must be set low when cold so it grows into line."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2645–2650, 375–376. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "helical-gear-milling-setup": {
    "purpose": "Set-up for milling a helical gear with a form cutter on a universal dividing head: pitch diameter from the normal module, the lead of the helix and the change gears from the table lead screw to the dividing head with the lead error (as the helical milling tool), table swivel, the cutter number from the formative number of teeth (as the gear cutter number tool for helical gears), the simple indexing setting (as the simple indexing tool), blank diameter and depth of cut.",
    "uses": [
      "Set up a universal mill to cut a replacement helical gear",
      "Check the lead error of the best gear train",
      "Choose the form cutter for a helical gear"
    ],
    "users": [
      "Machinists",
      "Toolroom staff",
      "Maintenance fitters"
    ],
    "inputs": {
      "mn": "Normal module of the gear.",
      "z": "Number of teeth.",
      "beta": "Helix angle at the pitch diameter.",
      "Lm": "Lead of the machine: table travel for one turn of the dividing head spindle with equal gears.",
      "set": "Change gears you have.",
      "ratio": "Worm ratio of the dividing head.",
      "plates": "Index plates you have.",
      "ded": "Dedendum as a multiple of the normal module.",
      "tol": "Largest lead error you accept from the gear train."
    },
    "outputs": [
      "Pitch diameter, lead and change gears",
      "Cutter number and indexing",
      "Blank diameter and depth"
    ],
    "method": [
      "Pitch diameter D = m_n z ÷ cos β; lead = π D ÷ tan β; ratio driven ÷ driver = lead ÷ machine lead, best four-gear train from the set (as the helical milling tool).",
      "Formative teeth = z ÷ cos³ β → cutter number (as the gear cutter number tool); index setting from ratio ÷ z (as the simple indexing tool).",
      "Blank diameter = D + 2m_n; depth = m_n (1 + dedendum factor); swivel the table by the helix angle.",
      "Example: lead 376.99 mm with drivers 24 and 44, driven 28 and 56 (error 0.042547%); cutter No. 3; index 1 turns and 5 holes in the 15-hole circle."
    ],
    "limitations": [
      "Form cutters give approximate profiles; the formative tooth count only picks the nearest cutter.",
      "Gear fit on the quadrant and the hand of helix (swivel direction) must be checked on the machine.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the lead error is too large, try the other gear set or a compound train with an idler change."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2060–2062, 2205, 2107–2121, 2148–2150. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "machine-rate-quote-check": {
    "purpose": "Check of a quoted part price against the true cost of the machine: capital recovery from price, resale value, life and interest, with floor space, maintenance, power and tooling per productive hour, plus the operator (as the machine hour rate tool); the job hours from set-up and cycle time, the job cost with material, cost per part, margin at the quoted price and the least price for the margin you want.",
    "uses": [
      "Check a quote before sending it",
      "Find the least price for a target margin",
      "Show customers where the hourly rate comes from"
    ],
    "users": [
      "Estimators",
      "Business owners",
      "Production managers"
    ],
    "inputs": {
      "price": "Cost of the machine installed and commissioned.",
      "salvage": "Expected resale value at the end of its life.",
      "life": "Years over which the machine must pay for itself.",
      "rate": "Interest or required return on capital.",
      "hours": "Hours per year the machine actually makes parts.",
      "space": "Cost per year of the floor space it occupies.",
      "kW": "Average electrical power while running.",
      "elec": "Electricity price.",
      "maint": "Maintenance and repairs per year.",
      "tooling": "Tooling and consumables per running hour.",
      "labour": "Fully loaded cost of the operator per hour.",
      "setup": "Set-up time for the job.",
      "cycle": "Machine cycle time per part, including load and unload.",
      "qty": "Number of parts in the job.",
      "mat": "Material and bought-in items per part.",
      "quote": "Price per part you intend to quote.",
      "mTarget": "Margin on price you need."
    },
    "outputs": [
      "Machine rate and total hour rate",
      "Job hours, job cost and cost per part",
      "Margin and least price"
    ],
    "method": [
      "Capital recovery = (price − resale) × A/P + resale × i; machine rate = (capital + space + maintenance) ÷ hours + power + tooling; total = machine + operator (as the machine hour rate tool).",
      "Job hours = set-up + quantity × cycle ÷ 60; job cost = hours × total rate + quantity × material; cost per part = job cost ÷ quantity.",
      "Margin = (quote − cost per part) ÷ quote; least price = cost per part ÷ (1 − margin wanted).",
      "Example: the machine costs 105.9 AUD/h with its operator; the job costs 17.208 AUD a part, so 22 AUD gives 21.78% margin."
    ],
    "limitations": [
      "General overheads beyond the machine (sales, admin, profit share) are not included unless added to the rates.",
      "Assumes the productive hours per year are achieved; idle time raises the true rate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Small batches carry the set-up time: quote set-up separately or set a minimum order."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–146, 1153–1160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "crane-load-swing-check": {
    "purpose": "Check of a load hanging from a crane trolley or hoist that stops abruptly from its travel speed: pendulum period for the rope length corrected for amplitude (as the pendulum period tool), the swing angle and horizontal swing from the kinetic energy of the load, the rope tension at the bottom of the swing including the centripetal force, the largest travel speed for your swing clearance, and checks against the clearance and the rated load.",
    "uses": [
      "Set a travel speed limit near obstructions",
      "Explain load swing to crane operators",
      "Check the dynamic rope load from swinging"
    ],
    "users": [
      "Lifting supervisors",
      "Crane engineers",
      "Riggers"
    ],
    "inputs": {
      "mass": "Mass of the hanging load including the hook block below the sheave.",
      "L": "Length from the trolley sheave to the load’s centre of gravity.",
      "v": "Trolley or bridge travel speed when it stops.",
      "clear": "Horizontal distance the load may swing before it hits something.",
      "SWL": "Rated load of the crane, hoist or rigging in force units."
    },
    "outputs": [
      "Period and swing angle",
      "Horizontal swing and rope tension",
      "Largest travel speed for the clearance"
    ],
    "method": [
      "Period T = 2π √(L ÷ g), corrected by (1 + θ² ÷ 16) for amplitude (as the pendulum period tool).",
      "Rise of the load h = v² ÷ 2g; swing angle θ = cos⁻¹(1 − h ÷ L); horizontal swing = L sin θ.",
      "Rope tension at the bottom = m g + m v² ÷ L; largest speed for clearance c = √[2g L (1 − cos(sin⁻¹(c ÷ L)))].",
      "Example: stopping from 0.5 m/s swings the load 0.39089 m (3.7354°) every 4.916 s; keep travel below 0.63978 m/s for 0.5 m clearance."
    ],
    "limitations": [
      "Abrupt stop of the trolley; gradual braking reduces the swing.",
      "Point load on a single fall; long loads also rotate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Swing grows with speed and with the square root of rope length: slow down and shorten the drop near obstructions."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 173–174. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "nested-spring-check": {
    "purpose": "Check of two helical compression springs nested one inside the other and compressed together: each spring’s rate, load and corrected shear stress at the working length, solid length and stress at solid (as the compression spring tool), the combined rate and load share in parallel (as the springs in series or parallel tool), the radial clearance between the inner spring’s outside and the outer spring’s inside, and the total load against what you need.",
    "uses": [
      "Increase spring force in a fixed space",
      "Check a nested valve or die spring pair",
      "Balance stresses between inner and outer springs"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Spring designers"
    ],
    "inputs": {
      "do": "Wire diameter of the outer spring.",
      "Do": "Mean coil diameter of the outer spring.",
      "Nao": "Active coils of the outer spring.",
      "di": "Wire diameter of the inner spring.",
      "Di": "Mean coil diameter of the inner spring.",
      "Nai": "Active coils of the inner spring.",
      "ends": "End type of both springs.",
      "G": "Shear modulus of the spring wire.",
      "L0": "Unloaded length of both springs (equal unloaded lengths share the deflection).",
      "Lw": "Length both springs are compressed to.",
      "allow": "Allowable corrected shear stress of the wire.",
      "need": "Total load the pair must give at the working length.",
      "cMin": "Least radial gap between the inner spring’s outside and the outer spring’s inside."
    },
    "outputs": [
      "Rate, load and stress of each spring",
      "Combined rate, total load and share",
      "Solid length and radial clearance"
    ],
    "method": [
      "k = G d⁴ ÷ 8 D³ N_a; F = k (L₀ − L_w); τ = K 8 F D ÷ π d³ with the Wahl factor K (as the compression spring tool).",
      "Parallel rate = k_outer + k_inner; each spring carries its own k × deflection (as the springs in series or parallel tool).",
      "Radial clearance = [(D_o − d_o) − (D_i + d_i)] ÷ 2; solid length from total coils × wire diameter.",
      "Example: the pair gives 274.27 N (outer 193.6 N, inner 80.668 N); stresses 291.86 and 311.32 MPa; radial clearance 2.75 mm."
    ],
    "limitations": [
      "Equal unloaded lengths; unequal lengths make one spring act first.",
      "Static load; fatigue and buckling of the inner spring need separate checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Wind the inner and outer springs in opposite hands so the coils cannot tangle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spun-cone-plan": {
    "purpose": "Plan for shear spinning a cone: blank thickness by the sine law and the thickness reduction (as the shear spinning tool) against the largest reduction the material will take in one pass, blank diameter and mass, tangential roller force, surface speed and power at the roller against the machine, and the spinning time over the cone length at the roller feed.",
    "uses": [
      "Plan the blank for a spun cone",
      "Check whether a cone can be spun in one pass",
      "Estimate the spinning time and power"
    ],
    "users": [
      "Metal spinners",
      "Fabrication engineers",
      "Process planners"
    ],
    "inputs": {
      "Tw": "Wall thickness the spun cone must have.",
      "alpha": "Half angle of the cone measured from its axis.",
      "Dl": "Diameter of the large end of the cone (the blank diameter in shear spinning).",
      "Ds": "Diameter of the small end where the cone meets the mandrel nose.",
      "sf": "Average flow stress of the material over the reduction.",
      "rho": "Density of the material.",
      "f": "Axial feed of the roller per spindle revolution.",
      "rpm": "Spindle speed.",
      "redMax": "Largest thickness reduction the material takes in one pass (from your spinning trials).",
      "Pm": "Power available at the spindle."
    },
    "outputs": [
      "Blank thickness, diameter and mass",
      "Reduction against the limit",
      "Roller force, power and spinning time"
    ],
    "method": [
      "Blank thickness T = t ÷ sin α; reduction = 1 − t ÷ T (as the shear spinning tool).",
      "Tangential force = flow stress × (T − t) × feed; power = force × surface speed at the large diameter (as the shear spinning tool).",
      "Blank diameter = large cone diameter; cone axial length = (D_l − D_s) ÷ 2 tan α; time = length ÷ (feed × rpm).",
      "Example: use a 4 mm blank 300 mm across (0.76341 kg); reduction 50%; 1.885 kW; 51.962 s to spin."
    ],
    "limitations": [
      "Ideal sine-law deformation; real forces include friction and redundant work.",
      "Single pass; larger reductions need intermediate annealing or two passes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Small cone angles need very thick blanks and large reductions: they may need two passes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1362–1364. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "moulded-part-cost": {
    "purpose": "Cost check for an injection moulded part: clamp force from the projected area and cavity pressure, shot size against the barrel, cooling time from the wall thickness, cycle time and parts per hour (as the injection moulding estimate tool), then per good part the machine cost at your hourly rate, the plastic including runner and scrap, and the mould amortised over its life quantity, against the target price.",
    "uses": [
      "Quote a moulded part",
      "Compare cavity numbers",
      "Check a mould suits a machine before a trial"
    ],
    "users": [
      "Moulding estimators",
      "Product designers",
      "Production managers"
    ],
    "inputs": {
      "Ap": "Area of one part projected on the parting plane.",
      "cav": "Number of cavities.",
      "Ar": "Projected area of the runner system.",
      "pc": "Average cavity pressure for the material and flow length.",
      "marg": "Extra clamp force allowance.",
      "Vp": "Volume of one part.",
      "Vr": "Volume of the runner per shot.",
      "rho": "Density of the melt.",
      "s": "Thickest main wall of the part.",
      "a": "Thermal diffusivity of the plastic.",
      "Tm": "Melt temperature.",
      "Tw": "Mould surface temperature.",
      "Te": "Temperature at which the part can be ejected.",
      "tOther": "Fill, hold, mould open, eject and close time.",
      "clamp": "Rated clamp force of the machine.",
      "barrel": "Shot capacity of the machine.",
      "rateM": "Hourly rate of the machine with its share of an operator (from the machine hour rate tool).",
      "resin": "Price of the plastic.",
      "scrap": "Share of parts rejected.",
      "mould": "Cost of the mould charged to this part.",
      "life": "Number of parts over which the mould cost is spread.",
      "target": "Cost per part you need to reach."
    },
    "outputs": [
      "Clamp force, shot and barrel use",
      "Cooling time, cycle and parts per hour",
      "Machine, plastic and mould cost per good part"
    ],
    "method": [
      "Clamp force = projected area × cavity pressure × (1 + margin); shot = cavities × part + runner; cooling time t = s² ÷ (π² a) × ln[4 ÷ π × (T_m − T_w) ÷ (T_e − T_w)]; parts per hour = cavities × 3600 ÷ cycle (as the injection moulding estimate tool).",
      "Machine cost per good part = rate ÷ [parts per hour × (1 − scrap)]; plastic per good part = shot mass ÷ cavities × price ÷ (1 − scrap).",
      "Mould per part = mould cost ÷ life quantity; total against target.",
      "Example: 754.2 parts an hour; each good part costs 0.36159 $ (machine 0.082015, plastic 0.079575, mould 0.2)."
    ],
    "limitations": [
      "Plate cooling estimate for the thickest wall; ribs and bosses can control the cycle.",
      "Runner material assumed not reground.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More cavities cut the machine cost per part but raise the mould cost and clamp force."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 584–592, 134–146. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "dynamometer-cooling-plan": {
    "purpose": "Plan for a power test with a prony brake or absorption dynamometer: net scale force, torque and power absorbed from the arm length, scale readings and speed (as the prony brake tool), the share of the power carried away by the cooling water, the water flow for your allowed temperature rise (as the coolant flow for a heat load tool), the water used over the test, and checks against the brake rating and the water supply.",
    "uses": [
      "Plan an engine or motor power test",
      "Size the water supply for a water-cooled brake",
      "Check a dynamometer is big enough"
    ],
    "users": [
      "Test engineers",
      "Maintenance engineers",
      "Technical college staff"
    ],
    "inputs": {
      "L": "Distance from the shaft centre to the scale load point.",
      "tare": "Scale reading while the brake absorbs power.",
      "zero": "Scale reading with the brake slack (the arm’s own weight).",
      "n": "Shaft speed during the reading.",
      "share": "Share of the absorbed power taken away by the cooling water (the rest goes to air and the structure).",
      "dT": "Largest rise in water temperature through the brake.",
      "cp": "Specific heat of the water.",
      "rhoW": "Density of the water.",
      "mins": "Length of the test run.",
      "rating": "Largest power the brake can absorb continuously.",
      "supply": "Water flow the supply can give."
    },
    "outputs": [
      "Torque and power absorbed",
      "Cooling water flow and test water use",
      "Checks against rating and supply"
    ],
    "method": [
      "Net force = reading − zero; torque = force × arm; power = 2π n T ÷ 60 (as the prony brake tool).",
      "Heat to water = power × share; flow = heat ÷ (ρ c_p ΔT) (as the coolant flow for a heat load tool).",
      "Water used = flow × test duration.",
      "Example: the brake absorbs 12.566 kW at 200 N·m; it needs 16.267 L/min of water and 488 L for the test."
    ],
    "limitations": [
      "Steady readings; scale damping is needed for a stable reading.",
      "Water share depends on the brake design; air-cooled brakes need a different heat path.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the supply is short, allow a larger temperature rise within the brake maker’s limit or recirculate through a cooler."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2998–2999, 371–374. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "internal-gear-drive-check": {
    "purpose": "Check of a spur pinion driving an internal (ring) gear: pitch diameters, centre distance, enlarged and conventional internal and outside diameters and the tooth-number difference against the minimum for the tooth form (as the internal gear proportions tool), the ratio and output speed, pinion torque and tangential force from the power, and the Lewis bending stress with the velocity factor (as the Lewis bending stress tool) against your allowable.",
    "uses": [
      "Check an internal gear drive for a turntable or slewing ring",
      "Size the pinion of a ring gear drive",
      "Avoid interference in internal gearing"
    ],
    "users": [
      "Gear designers",
      "Machine designers",
      "Design engineers"
    ],
    "inputs": {
      "m": "Module of both gears.",
      "Zg": "Teeth on the internal gear.",
      "Zp": "Teeth on the pinion.",
      "form": "Tooth form of the pair.",
      "P": "Power transmitted.",
      "n": "Speed of the pinion.",
      "b": "Face width in mesh.",
      "Y": "Lewis form factor for the pinion tooth count and form (from your gear data).",
      "make": "How the teeth are made (sets the velocity factor).",
      "allow": "Allowable bending stress of the pinion material."
    },
    "outputs": [
      "Diameters, centre distance and tooth difference",
      "Ratio, torque and tangential force",
      "Pinion bending stress"
    ],
    "method": [
      "Pitch diameters m Z; centre distance = m (Z_g − Z_p) ÷ 2; enlarged and conventional diameters and the tooth-difference rule (as the internal gear proportions tool).",
      "Torque = 9549 P ÷ n; tangential force = 2T ÷ pinion pitch diameter; output speed = n Z_p ÷ Z_g.",
      "σ = K_v F_t ÷ (b m Y) with the velocity factor for the manufacture (as the Lewis bending stress tool).",
      "Example: centre distance 81 mm; ring turns at 362.5 rpm; pinion bending 41.145 MPa."
    ],
    "limitations": [
      "Lewis bending only; surface durability (pitting) needs a separate check.",
      "Proportions follow the handbook rules for internal gearing; tip relief may still be needed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Internal gears share load over more teeth than external pairs, so the Lewis check is conservative."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2170–2171, 2131–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
