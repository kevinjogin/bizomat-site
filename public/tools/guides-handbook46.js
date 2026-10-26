// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook46).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "tank-calibration-chart": {
    "purpose": "Contents of a horizontal cylindrical tank with flat, 2:1 ellipsoidal or hemispherical heads: liquid volume in the shell at a depth (as the tank volume tool), the liquid in both heads at the same depth (the two heads together form a sphere or a half-depth spheroid), total and full capacity (full matching the vessel head volume tool), percentage full, liquid mass, the time to fill the rest at a pump rate, and a calibration chart every tenth of the diameter.",
    "uses": [
      "Make a dip chart for a fuel or water tank",
      "Convert a dip reading to litres",
      "Find the time to fill a tank"
    ],
    "users": [
      "Plant engineers",
      "Operators",
      "Fuel and storage managers"
    ],
    "inputs": {
      "D": "Inside diameter of the shell.",
      "L": "Length of the cylindrical shell between the head tangent lines.",
      "head": "Shape of the two end heads.",
      "h": "Liquid depth measured from the bottom of the shell.",
      "rho": "Density of the liquid.",
      "Qp": "Flow of the filling pump."
    },
    "outputs": [
      "Shell, head and total volume at the dip",
      "Full capacity, percentage and mass",
      "Fill time and calibration chart"
    ],
    "method": [
      "Shell segment area A = r² cos⁻¹[(r − h) ÷ r] − (r − h)√(2rh − h²); shell volume = A L (as the tank volume tool).",
      "Two hemispherical heads = a sphere: V = π h² (3r − h) ÷ 3; two 2:1 ellipsoidal heads = half of that (a spheroid of half depth); flat heads add nothing.",
      "Full capacity = π r² L + heads (as the vessel head volume tool); fill time = (full − contents) ÷ pump rate.",
      "Example: at 400 mm the tank holds 1,107.3 L (28.796% of 3,845.3 L); filling the rest takes 27.38 min."
    ],
    "limitations": [
      "Level tank; a slope changes the readings, especially near empty and full.",
      "Inside dimensions; nozzles and internals are not deducted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The middle of a horizontal tank holds the most per millimetre of dip: readings near the top and bottom change slowly."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 68–69, 82–87. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "guillotine-shear-check": {
    "purpose": "Check of a sheet-metal guillotine with a raked (inclined) or parallel blade: shearing force and the machine force with the 1.3 allowance (as the shearing blade force tool), energy per cut from the force for parallel blades over the penetration, motor power at the stroke rate and drive efficiency, the sheet width against the blade length, and the thickest sheet the machine capacity allows in this material at this rake.",
    "uses": [
      "Check whether a shear can cut a thicker or stronger plate",
      "Estimate motor power for a shearing rate",
      "Choose rake for a thick sheet"
    ],
    "users": [
      "Fabrication supervisors",
      "Press and shear operators",
      "Manufacturing engineers"
    ],
    "inputs": {
      "blades": "Raked blades cut progressively with less force; parallel blades cut the whole width at once.",
      "T": "Thickness of the sheet.",
      "b": "Width of sheet cut.",
      "tau": "Shear strength of the sheet (about 0.75–0.8 of tensile strength for steels).",
      "UTS": "Tensile strength of the sheet.",
      "alpha": "Rake angle of the moving blade.",
      "n": "Penetration coefficient in the inclined-blade formula (handbook value for the material; your value).",
      "k": "Ratio factor in the inclined-blade formula (your value).",
      "eps": "Share of the thickness the blade enters before the sheet fractures.",
      "cap": "Rated cutting force of the machine.",
      "blade": "Length of the blade.",
      "cpm": "Number of cuts per minute.",
      "Pm": "Rated power of the main motor.",
      "eta": "Share of motor power reaching the blade."
    },
    "outputs": [
      "Shearing and machine force against capacity",
      "Energy per cut and power at the stroke rate",
      "Thickest sheet at capacity and width check"
    ],
    "method": [
      "Parallel blades F = τ b T; inclined blades F = n k UTS ε T² ÷ tan α; machine force = 1.3 F (as the shearing blade force tool).",
      "Energy per cut ≈ τ b T × ε T (the shearing work is the same whatever the rake); power = energy × cuts per minute ÷ 60 ÷ efficiency.",
      "Thickest sheet at capacity: inclined T = √[cap tan α ÷ (1.3 n k UTS ε)]; parallel T = cap ÷ (1.3 τ b).",
      "Example: 3 mm × 1000 mm needs 48.246 kN (capacity 300 kN), 1,620 J per cut and 0.77143 kW at 20 cuts a minute; the thickest sheet is 7.4808 mm."
    ],
    "limitations": [
      "Handbook approximate formulas; blade clearance and sharpness change the force.",
      "Flywheel machines can exceed the average power for single cuts.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More rake lowers the force but twists and bows the cut strip: thick plate is cut at the smallest rake that the capacity allows."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1336–1338. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "machine-axis-error-budget": {
    "purpose": "Error budget for a dimension made or measured along one machine axis: positioning accuracy and repeatability from the machine test, the Abbe error from the offset between the work and the scale and the axis tilt (as the Abbe error tool), the uncompensated part of the screw or scale thermal growth (as the thermal growth tool), and the fixture or set-up error, combined by worst-case sum and by root-sum-square, against the share of the tolerance you allow the machine.",
    "uses": [
      "Decide whether a machine can hold a tight tolerance",
      "Find the largest error source on an axis",
      "Justify thermal compensation or a better fixture"
    ],
    "users": [
      "Manufacturing engineers",
      "Quality engineers",
      "Machine tool engineers"
    ],
    "inputs": {
      "tol": "Total tolerance band (upper minus lower limit).",
      "share": "Part of the tolerance you allow for machine errors, leaving the rest for tool wear, deflection and measurement.",
      "acc": "Positioning accuracy over the travel from an ISO 230-2 or similar test.",
      "rep": "Repeatability from the same test.",
      "offset": "Distance between the work point and the axis scale or screw line.",
      "tilt": "Angular error (pitch or yaw) of the axis over the travel.",
      "Ls": "Length of screw between the fixed bearing and the working position (or scale length).",
      "alpha": "Expansion coefficient of the screw or scale.",
      "dT": "Temperature rise of the screw in running.",
      "comp": "Share of the thermal growth the control compensates (0 if none).",
      "fix": "Error from locating and clamping the part."
    },
    "outputs": [
      "Each error contribution",
      "Worst-case and root-sum-square totals",
      "Total against the allowed share of tolerance"
    ],
    "method": [
      "Abbe error = offset × tan(tilt) (as the Abbe error tool).",
      "Thermal error = L α ΔT × (1 − compensation) (as the thermal growth tool).",
      "Worst case = sum of all contributions; RSS = √(sum of squares); compare with the allowed share of the tolerance band.",
      "Example: worst case 24.174 µm, RSS 11.702 µm, against 25 µm allowed; the largest source is Positioning accuracy."
    ],
    "limitations": [
      "Treats contributions as independent for RSS; correlated thermal errors add directly.",
      "One axis only; multi-axis features need volumetric errors.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thermal growth is often the largest error on long screws: compensation or a scale feedback removes most of it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 709–735, 375–376. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "plastic-gear-drive-check": {
    "purpose": "Check of a plastic spur, helical or bevel gear in a metal housing: power rating by the handbook plastic gear formula with the service factor (as the plastic gear power tool) against the power required, the growth of the gear pitch radii from temperature and moisture swell against the growth of the housing centre distance (the plastic–metal mismatch, as the plastic thermal mismatch tool), the resulting loss of backlash through the pressure angle, and the backlash left at the hot, wet condition.",
    "uses": [
      "Size a nylon or acetal gear pair",
      "Set the cold backlash so a plastic mesh does not bind",
      "Check a plastic gear for a power increase"
    ],
    "users": [
      "Design engineers",
      "Product designers",
      "Plastics engineers"
    ],
    "inputs": {
      "type": "Gear type for the rating formula.",
      "F": "Face width.",
      "Y": "Lewis form factor for the tooth count.",
      "m": "Module.",
      "Ss": "Safe bending stress of the plastic at the running temperature (your value from the resin maker).",
      "d1": "Pitch diameter of the plastic pinion (the gear rated).",
      "d2": "Pitch diameter of the mating gear (taken as plastic too).",
      "rpm": "Speed of the pinion.",
      "Cs": "Service factor for the duty.",
      "C": "Cone distance for bevel gears.",
      "Preq": "Power the drive must carry.",
      "alpha": "Pressure angle.",
      "j0": "Circular backlash set at assembly at room temperature, dry.",
      "ap": "Expansion coefficient of the gear plastic.",
      "am": "Expansion coefficient of the housing that sets the centre distance.",
      "dT": "Rise from assembly to running temperature.",
      "swell": "Linear growth from moisture absorption (nylons swell; acetal very little).",
      "jMin": "Least backlash that must remain."
    },
    "outputs": [
      "Power rating against the power required",
      "Change in backlash from temperature and moisture",
      "Backlash left in service"
    ],
    "method": [
      "Spur rating P = F Y m S V ÷ [327 (3.05 + V) C_s] kW-form (helical and bevel variants) with V the pitch-line speed (as the plastic gear power tool).",
      "Centre distance a = (d₁ + d₂) ÷ 2; gear growth = a (α_p ΔT + swell); housing growth = a α_m ΔT (as the plastic thermal mismatch tool).",
      "Backlash change Δj = −2 tan α × (gear growth − housing growth); backlash in service = assembly backlash + Δj.",
      "Example: the pinion is rated 143.19 W against 100 W; warming and swelling take 0.2103 mm of backlash, leaving 0.089698 mm."
    ],
    "limitations": [
      "Handbook rating formula; resin makers’ data give better limits for modern materials.",
      "Uniform temperature of gears and housing; gears run hotter than the housing in practice.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Nylon gears in an aluminium housing lose backlash as they warm and soak: set enough cold backlash or use a lower-swell resin."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 604–606, 578–580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "set-screw-hub-check": {
    "purpose": "Check of a hub, collar or pulley held by cup-point set screws: power, torque and holding force per screw by the handbook empirical rule (as the set-screw holding tool), the torque needed with your safety factor, the number of screws needed, the torque and axial capacity of the screws you fit, and the advice to change to a key or clamp collar when more than two screws would be needed.",
    "uses": [
      "Check a set-screw hub for a motor or pulley",
      "Decide between set screws and a key",
      "Check axial hold of a collar"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machine designers"
    ],
    "inputs": {
      "D": "Diameter of the shaft.",
      "d": "Nominal diameter of the set screws.",
      "rpm": "Speed of the shaft.",
      "P": "Power passing through the hub.",
      "SF": "Safety factor on the holding torque and axial force (higher for shock and reversing loads).",
      "n": "Number of set screws fitted (usually one or two, about 90° apart).",
      "Fax": "Axial force trying to slide the hub along the shaft."
    },
    "outputs": [
      "Holding per screw (power, torque, force)",
      "Screws needed and capacity of those fitted",
      "Torque and axial checks"
    ],
    "method": [
      "Handbook rule (inch units): holding power hp = D N d^2.3 ÷ 50; torque = 1250 D d^2.3 lb·in, converted to metric (as the set-screw holding tool).",
      "Torque needed = P ÷ ω × SF; screws needed = torque needed ÷ torque per screw (rounded up).",
      "Axial capacity ≈ holding force per screw × screws fitted, against axial load × SF.",
      "Example: each M12.7 screw holds 28.679 N·m; 2 screws give 57.358 N·m against 32.043 N·m needed."
    ],
    "limitations": [
      "Empirical rule for cup-point screws on a hardened screw and unhardened shaft; flats or spot drills change the hold.",
      "Vibration loosens set screws: use thread locker or a key for critical drives.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Two screws at 90° hold better than two at 180°, and a flat on the shaft stops marking."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1699–1700. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tank-wall-panel-check": {
    "purpose": "Check of a flat-walled (rectangular) tank: pressure at the bottom, the resultant force on the wall and its centre of pressure (as the hydrostatic force tool), and a rectangular panel between stiffeners treated as simply supported under the bottom pressure (conservative), with its bending stress and centre deflection (as the rectangular plate tool), the thickness needed for the allowable stress, and checks against the allowable stress and deflection limit.",
    "uses": [
      "Size the plate of a rectangular water or chemical tank",
      "Choose stiffener spacing for a tank wall",
      "Check an existing tank for a heavier liquid"
    ],
    "users": [
      "Structural engineers",
      "Fabrication supervisors",
      "Plant engineers"
    ],
    "inputs": {
      "h": "Depth of liquid above the tank floor.",
      "rho": "Density of the liquid.",
      "w": "Width of the wall.",
      "ps": "Gas or vapour pressure above the liquid (0 for an open tank).",
      "L": "Longer side of the panel between stiffeners.",
      "l": "Shorter side of the panel.",
      "t": "Plate thickness (after corrosion allowance).",
      "E": "Elastic modulus of the plate.",
      "allow": "Allowable bending stress in the plate (your design value).",
      "dMax": "Largest deflection you accept at the panel centre."
    },
    "outputs": [
      "Bottom pressure, wall force and centre of pressure",
      "Panel stress and deflection",
      "Thickness needed and checks"
    ],
    "method": [
      "Bottom pressure p = p_s + ρ g h; wall force = ρ g w h² ÷ 2 + p_s w h; centre of pressure from the floor (as the hydrostatic force tool).",
      "Simply supported rectangular panel under uniform pressure p: σ = 0.75 W ÷ [t² (L ÷ l + 1.61 l² ÷ L²)]; deflection = 0.1422 W ÷ [E t³ (L ÷ l³ + 2.21 ÷ L²)], W = p L l (as the rectangular plate tool).",
      "Thickness for the allowable: t = √{0.75 W ÷ [σ_allow (L ÷ l + 1.61 l² ÷ L²)]}.",
      "Example: 2 m of liquid gives 19.613 kPa at the floor; a 1000 × 600 mm panel of 7 mm plate runs at 80.187 MPa and deflects 3.5665 mm."
    ],
    "limitations": [
      "The bottom pressure is applied to the whole panel (conservative for upper panels).",
      "Stiffeners, corners and floor joints need their own design.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the short side of the panel cuts the stress roughly four times: closer stiffeners save plate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 288–290. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "crane-wheel-rail-check": {
    "purpose": "Check of a steel wheel on a flat-headed rail: Hertz line-contact half-width, peak contact pressure and the depth of the largest shear stress for a cylinder on a flat (as the Hertz contact tool), the mean wheel pressure W ÷ (D b) against your limit, rolling resistance per wheel from the coefficient of rolling friction (as the rolling resistance tool), the total travel force and power for all wheels, and checks of contact pressure and wheel pressure.",
    "uses": [
      "Size crane or trolley wheels",
      "Check wheels for a heavier load",
      "Estimate travel resistance for a drive"
    ],
    "users": [
      "Crane engineers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "W": "Largest load on one wheel (with the trolley at the end of its travel).",
      "nW": "Number of wheels carrying the machine.",
      "D": "Rolling diameter of the wheel.",
      "b": "Usable width of the rail head (flat contact length).",
      "E1": "Elastic modulus of the wheel.",
      "nu1": "Poisson’s ratio of the wheel.",
      "E2": "Elastic modulus of the rail.",
      "nu2": "Poisson’s ratio of the rail.",
      "p0Max": "Largest peak contact pressure for the wheel and rail hardness (your value).",
      "pMeanMax": "Largest mean pressure W ÷ (D b) for the wheel material and speed (your value from the crane standard).",
      "f": "Coefficient of rolling friction (lever arm; about 0.5 mm steel on steel).",
      "v": "Travel speed."
    },
    "outputs": [
      "Contact half-width, peak pressure and shear depth",
      "Mean wheel pressure",
      "Rolling resistance, travel force and power"
    ],
    "method": [
      "Combined modulus 1 ÷ E* = (1 − ν₁²) ÷ E₁ + (1 − ν₂²) ÷ E₂; half-width b = √(4 W R ÷ π L E*); p₀ = 2W ÷ (π b L); largest shear about 0.30 p₀ at 0.786 b (as the Hertz contact tool).",
      "Mean wheel pressure = W ÷ (D b).",
      "Rolling resistance per wheel = W f ÷ r (as the rolling resistance tool); travel force = per wheel × wheels; power = force × speed.",
      "Example: 50 kN on a 400 mm wheel gives 428.53 MPa peak contact and 2.5 MPa mean; rolling the machine takes 500 N."
    ],
    "limitations": [
      "Line contact on a flat head; crowned wheels and rail wear change the contact.",
      "Travel force excludes wind, slope, flange friction and acceleration.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger wheel lowers both contact stress and rolling resistance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2301–2309, 165–167. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bar-stock-plan": {
    "purpose": "Material and time plan for parts made from bar on a lathe or screw machine: length per part with cut-off and facing allowance, parts per bar, bars to order and stock length and mass (as the screw machine stock tool), material yield, material cost per part, machine hours from the cycle time and bar change time, and shifts needed.",
    "uses": [
      "Order bar stock for a turned-part batch",
      "Quote material cost per part",
      "Plan the run time on a bar-fed lathe"
    ],
    "users": [
      "CNC machinists",
      "Estimators",
      "Production planners"
    ],
    "inputs": {
      "L": "Finished length of one part.",
      "W": "Width of the cut-off (parting) tool.",
      "face": "Extra length faced off each part.",
      "bar": "Length of the bar stock.",
      "rem": "Length left in the collet or feeder that cannot be used.",
      "qty": "Parts to make.",
      "kgm": "Mass per metre of the bar.",
      "price": "Price of the bar material.",
      "cycle": "Machine cycle time per part.",
      "change": "Time to load a new bar.",
      "shift": "Hours in a shift.",
      "yMin": "Least share of bar that should end up in finished parts."
    },
    "outputs": [
      "Parts per bar, bars and stock mass",
      "Material yield and cost per part",
      "Machine hours and shifts"
    ],
    "method": [
      "Length per part = part + cut-off + facing; parts per bar = ⌊(bar − remnant) ÷ length per part⌋; bars = quantity ÷ parts per bar (rounded up) (as the screw machine stock tool).",
      "Yield = parts × part length ÷ (bars × bar length); material cost per part = bars × bar length × mass per metre × price ÷ quantity.",
      "Hours = (quantity × cycle + bars × bar change) ÷ 3600; shifts = hours ÷ hours per shift.",
      "Example: 109 parts per bar need 10 bars (36.576 kg), 83.333% yield, about 0.10973 of material a part and 12.667 hours of machine time."
    ],
    "limitations": [
      "Whole parts per bar; last-bar remnants and set-up parts are not added.",
      "Constant cycle time; tool changes and inspection add time.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A thinner cut-off tool and a shorter remnant both raise yield: on short parts the cut-off can be most of the waste."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1175–1176. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "stockpile-haulage-plan": {
    "purpose": "Plan for moving a conical or ridge-shaped stockpile of bulk material: pile height from the angle of repose, volume and mass (as the stockpile weight tool), truck loads at the payload, loader bucket passes at the bucket size and fill factor, loading time at the cycle time, and the peak ground pressure under the highest point of the pile against the allowable bearing pressure.",
    "uses": [
      "Plan removal of a gravel, coal or ore stockpile",
      "Estimate a stockpile’s tonnage for inventory",
      "Check ground bearing under a new pile"
    ],
    "users": [
      "Site supervisors",
      "Plant engineers",
      "Logistics planners"
    ],
    "inputs": {
      "shape": "Round cone or a ridge with sloping ends.",
      "D": "Base diameter of a conical pile.",
      "A": "Base width of a ridge pile (the shorter side).",
      "B": "Base length of a ridge pile.",
      "theta": "Angle of repose of the material (about 30–40° for most granular materials).",
      "rho": "Bulk (loose) density of the material.",
      "pay": "Legal payload of one truck.",
      "bucket": "Rated (heaped) bucket capacity of the loader.",
      "fill": "Share of the rated bucket actually loaded each pass.",
      "cycleL": "Time for one loader cycle (dig, travel, dump, return).",
      "qAllow": "Allowable bearing pressure of the ground under the pile (from a geotechnical assessment)."
    },
    "outputs": [
      "Pile height, volume and mass",
      "Truck loads, loader passes and loading time",
      "Peak ground pressure against the allowable"
    ],
    "method": [
      "Cone: h = (D ÷ 2) tan θ, V = π D² h ÷ 12; ridge: h = (A ÷ 2) tan θ, V = A h (3B − A) ÷ 6 (as the stockpile weight tool).",
      "Truck loads = mass ÷ payload (rounded up); bucket passes = volume ÷ (bucket × fill) (rounded up); loading time = passes × cycle.",
      "Peak ground pressure = ρ g h under the highest point.",
      "Example: the pile is 3.501 m high, 146.65 t; moving it takes 8 truck loads and 51 loader passes (0.56667 h)."
    ],
    "limitations": [
      "Ideal pile shape at the angle of repose; real piles are often flatter or have a flat top.",
      "Bulk density varies with moisture and compaction.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The pressure under the peak of a pile is three times the average: check the ground there."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 382–383. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
