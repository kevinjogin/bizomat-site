// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook7).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "turning-power": {
    "purpose": "Cutting force, cutting power, spindle motor power, torque and metal removal rate for a turning cut from specific cutting force, compared with the available machine power.",
    "uses": [
      "Check a roughing cut against machine power",
      "Find the depth of cut a lathe can take",
      "Estimate spindle torque at low speed"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "vc": "Cutting speed from the tooling recommendation.",
      "f": "Feed per revolution.",
      "ap": "Radial depth of cut.",
      "D": "Workpiece diameter at the cut.",
      "kc": "Specific cutting force for the work material at your chip thickness, from the tool supplier’s data (e.g. about 1500–2100 N/mm² for steels, 500–800 N/mm² for aluminium alloys).",
      "eta": "Overall machine efficiency from spindle motor to cutting edge (often 70–85%); check the machine manual.",
      "Pavail": "Rated spindle power at the speed you will run, from the machine power–speed chart."
    },
    "outputs": [
      "Cutting force",
      "Cutting power and motor power",
      "Spindle speed and torque",
      "Metal removal rate"
    ],
    "method": [
      "Cutting force Fc = kc × ap × f.",
      "Cutting power Pc = Fc × vc ÷ 60 000 (kW); motor power = Pc ÷ η.",
      "Spindle speed n = 1000 vc ÷ πD; torque = Fc × D ÷ 2000 (N·m).",
      "Removal rate Q = vc × ap × f (cm³/min).",
      "Example: 3 mm × 0.3 mm/rev at 200 m/min in kc 2000 steel needs 7.5 kW at the motor."
    ],
    "limitations": [
      "kc depends on chip thickness, rake angle and tool wear; a worn tool can raise force by 30% or more.",
      "Power available falls at low spindle speeds on most machines; use the power–speed curve.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep a margin below the available power for tool wear and hard spots."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "milling-power": {
    "purpose": "Metal removal rate, cutting power, motor power and spindle torque for a milling cut from the specific cutting force, compared with the available spindle power.",
    "uses": [
      "Check a face or slot milling cut against spindle power",
      "Find the feed a spindle can sustain",
      "Check torque at low spindle speed"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "ae": "Width of the cut across the cutter.",
      "ap": "Depth of the cut along the cutter axis.",
      "vf": "Programmed table feed.",
      "D": "Cutter diameter (for surface speed).",
      "rpm": "Spindle speed.",
      "kc": "Specific cutting force for the work material at your chip thickness, from the tool supplier’s data (e.g. about 1500–2100 N/mm² for steels, 500–800 N/mm² for aluminium alloys).",
      "eta": "Overall machine efficiency from spindle motor to cutting edge (often 70–85%); check the machine manual.",
      "Pavail": "Spindle power available at this speed, from the machine chart."
    },
    "outputs": [
      "Metal removal rate",
      "Cutting power and motor power",
      "Spindle torque",
      "Cutting speed"
    ],
    "method": [
      "Removal rate Q = ae × ap × vf ÷ 1000 (cm³/min).",
      "Cutting power Pc = ae × ap × vf × kc ÷ (60 × 10⁶) (kW); motor power = Pc ÷ η.",
      "Torque = Pc × 30 000 ÷ (π n) (N·m); cutting speed = π D n ÷ 1000.",
      "Example: 40 × 3 mm at 800 mm/min removes 96 cm³/min and needs 3.6 kW."
    ],
    "limitations": [
      "kc must match the mean chip thickness of the cut; light radial engagement thins the chip and raises kc.",
      "Entry and exit shocks and tool wear raise peak power.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the spindle power and torque curves; torque often limits large cutters at low speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drilling-power": {
    "purpose": "Spindle speed, feed rate, cutting power, motor power, torque and approximate thrust for a solid twist drill from the specific cutting force.",
    "uses": [
      "Check a large drill against machine power and torque",
      "Size workholding for drilling thrust",
      "Compare feed options"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Drill diameter.",
      "vc": "Cutting speed at the drill periphery.",
      "f": "Feed per revolution.",
      "kc": "Specific cutting force for the work material at your chip thickness, from the tool supplier’s data (e.g. about 1500–2100 N/mm² for steels, 500–800 N/mm² for aluminium alloys).",
      "point": "Drill point angle (118° and 140° are common).",
      "eta": "Overall machine efficiency from spindle motor to cutting edge (often 70–85%); check the machine manual.",
      "Pavail": "Spindle power at this speed from the machine chart."
    },
    "outputs": [
      "Spindle speed and feed rate",
      "Cutting power and motor power",
      "Torque",
      "Approximate thrust force"
    ],
    "method": [
      "n = 1000 vc ÷ π D; feed rate = f × n.",
      "Cutting power Pc = f × vc × D × kc ÷ 240 000 (kW); motor power = Pc ÷ η.",
      "Torque = Pc × 30 000 ÷ (π n); thrust ≈ 0.5 × kc × (D ÷ 2) × f × sin(point angle ÷ 2).",
      "Example: a 20 mm drill at 80 m/min and 0.25 mm/rev needs 4.1667 kW and 25 N·m."
    ],
    "limitations": [
      "The thrust estimate ignores the chisel edge, which can double thrust on drills without point thinning.",
      "Hole depth, chip evacuation and coolant pressure are not considered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Clamp the work for the thrust with your safety factor, and support thin parts under the drill."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1089–1093. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "scallop-height": {
    "purpose": "Theoretical scallop (cusp) height left by a ball-nose or radiused cutter on a flat surface for a given stepover, or the stepover for a target scallop height.",
    "uses": [
      "Set stepover for 3D finishing passes",
      "Trade cycle time against surface finish",
      "Check a CAM finishing strategy"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Choose what you want to find.",
      "D": "Diameter of the ball nose (twice the corner radius for a bull-nose cutter on a flat).",
      "step": "Distance between adjacent passes (scallop-height mode).",
      "h": "Largest acceptable cusp height (stepover mode)."
    },
    "outputs": [
      "Scallop height",
      "Stepover",
      "Stepover as a share of diameter"
    ],
    "method": [
      "h = R − √(R² − (s ÷ 2)²), with R the ball radius and s the stepover.",
      "s = 2√(2Rh − h²).",
      "Example: a 10 mm ball with 0.5 mm stepover leaves 6.2539 µm scallops."
    ],
    "limitations": [
      "Flat surfaces normal to the tool axis; on slopes and curved surfaces the effective radius and scallop change.",
      "Tool deflection, runout and wear add to the theoretical value.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the stepover roughly quarters the scallop height but doubles the passes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1039–1058, 1279–1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taylor-tool-life": {
    "purpose": "Tool life from the Taylor equation (from constants or two test points), and the minimum-cost and maximum-production cutting speeds and tool lives from machine rate, tool cost and tool change time.",
    "uses": [
      "Choose a cutting speed that minimises cost",
      "Predict tool changes per shift",
      "Fit Taylor constants from two tool-life tests"
    ],
    "users": [
      "Manufacturing engineers",
      "Production planners",
      "Machinists"
    ],
    "inputs": {
      "mode": "Enter known Taylor constants, or fit them from two tool-life tests in the same conditions.",
      "n": "Taylor exponent for the tool and work material (often about 0.1–0.17 for HSS, 0.2–0.5 for carbide).",
      "C": "Cutting speed giving one minute of tool life.",
      "V1": "Speed of the first tool-life test.",
      "T1": "Measured tool life (minutes of cutting to the wear limit) in test 1.",
      "V2": "Speed of the second test (different from the first).",
      "T2": "Measured tool life in test 2.",
      "V": "Speed you plan to run.",
      "rate": "Cost of machine and operator per hour.",
      "edge": "Insert cost divided by usable edges, or regrind cost per edge.",
      "tc": "Time to change or index the tool."
    },
    "outputs": [
      "Taylor constants n and C",
      "Tool life at the planned speed",
      "Minimum-cost tool life and speed",
      "Maximum-production tool life and speed"
    ],
    "method": [
      "V T^n = C. From two tests: n = ln(V₁ ÷ V₂) ÷ ln(T₂ ÷ T₁); C = V₁ T₁^n.",
      "Tool life at speed V: T = (C ÷ V)^(1/n).",
      "Minimum cost: T_c = (1/n − 1)(t_c + C_t ÷ C_o), with C_o the cost rate per minute; V_c = C ÷ T_c^n.",
      "Maximum production: T_p = (1/n − 1) t_c.",
      "Example: the two tests give n = 0.24271, C = 489.63 m/min; the minimum-cost speed is 240.47 m/min with 18.721 min tool life."
    ],
    "limitations": [
      "The Taylor equation holds only over the range of the tests and for constant feed, depth and material.",
      "Non-cutting time and part handling do not affect the optimum speed but do affect total cost.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Run between the minimum-cost and maximum-production speeds; never above the maximum-production speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1102–1124, 1132–1140. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grinding-wheel": {
    "purpose": "Wheel peripheral speed against the maximum operating speed marked on the wheel, maximum safe spindle speed, speed ratio, and specific and total material removal rate.",
    "uses": [
      "Check a wheel and spindle speed combination before mounting",
      "Set work speed for a speed ratio",
      "Compare grinding removal rates"
    ],
    "users": [
      "Grinding machinists",
      "Manufacturing engineers",
      "Safety officers"
    ],
    "inputs": {
      "D": "Actual wheel diameter (new or current dressed size).",
      "rpm": "Spindle speed from the machine plate or a tachometer.",
      "vmax": "Maximum operating speed printed on the wheel or its blotter; never exceed it.",
      "vw": "Speed of the work surface past the wheel.",
      "ae": "Infeed (depth) per pass.",
      "b": "Width of the ground area per pass."
    },
    "outputs": [
      "Wheel peripheral speed",
      "Maximum spindle speed for this wheel",
      "Speed ratio",
      "Specific and total removal rate"
    ],
    "method": [
      "Wheel speed vs = π D n ÷ 60 000 (m/s); maximum spindle speed = vmax × 60 000 ÷ (π D).",
      "Speed ratio q = vs ÷ vw (both in m/s).",
      "Specific removal rate Q′ = ae × vw (mm³/mm/s, with vw in mm/s); total Q = Q′ × b.",
      "Example: a 300 mm wheel at 2000 rpm runs at 31.416 m/s against 35 m/s marked."
    ],
    "limitations": [
      "The marked maximum operating speed is a hard safety limit; machine guarding and mounting must also comply with the wheel standard.",
      "Removal rate assumes the full depth is removed (no wheel deflection or wear).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the spindle speed exceeds the wheel’s maximum, do not run it: change the wheel or the speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1199–1268, 1246–1250. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "broach-pitch": {
    "purpose": "Minimum broach tooth pitch from chip space, allowable pitch from machine capacity, the pitch to use, and the number of teeth cutting at once.",
    "uses": [
      "Lay out a new surface or internal broach",
      "Check whether a broaching machine has enough capacity",
      "Find teeth in contact for a part length"
    ],
    "users": [
      "Tool designers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "L": "Length of the surface being broached in the cutting direction.",
      "d": "Rise per tooth (one side for round broaches), from broach design data for the material.",
      "F": "Chip space factor: about 3–4 roughing and 6 finishing for brittle materials; 4–7 roughing and 8 finishing for ductile materials.",
      "b": "Width of the layer removed by each tooth.",
      "P": "Pressure per unit area of cut (depth × width) for the material and depth, from broaching data tables.",
      "T": "Usable capacity of the machine in metric tonnes, taken as 70% of its maximum to allow for dulling."
    },
    "outputs": [
      "Minimum pitch for chip space",
      "Allowable pitch for machine capacity",
      "Pitch to use",
      "Teeth cutting at once"
    ],
    "method": [
      "Minimum pitch = 3√(L d F).",
      "Allowable pitch = d L b P ÷ (9810 T).",
      "Use the larger of the two; teeth in contact = L ÷ pitch (at least two are needed).",
      "Example (the handbook case for cast iron): minimum pitch 28.142 mm, allowable 33.345 mm, so use 33.345 mm."
    ],
    "limitations": [
      "Design data for rise per tooth and pressure must match the material; this tool does not supply them.",
      "Pitch is usually varied slightly between teeth to reduce chatter.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If fewer than two teeth cut at once, reduce the pitch or broach two parts together."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 980–990. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "boring-bar-deflection": {
    "purpose": "Tip deflection of a solid boring bar or long tool as a cantilever under the cutting force, with the overhang-to-diameter ratio, against an allowable deflection.",
    "uses": [
      "Choose bar diameter and material for a deep bore",
      "Estimate size error from tool deflection",
      "Compare steel and carbide bars"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the bar shank (use the flat-to-round equivalent for flats).",
      "L": "Length from the clamping face to the cutting edge.",
      "E": "Modulus of the bar: about 210 GPa for steel, about 550–630 GPa for solid carbide.",
      "F": "Resultant cutting force, roughly kc × depth × feed (see the turning power tool).",
      "allow": "Part of the bore tolerance you can accept from deflection."
    },
    "outputs": [
      "Tip deflection",
      "Overhang-to-diameter ratio",
      "Bar stiffness"
    ],
    "method": [
      "I = π D⁴ ÷ 64.",
      "Deflection δ = F L³ ÷ (3 E I); stiffness = 3EI ÷ L³.",
      "Overhang ratio = L ÷ D.",
      "Example: a 20 mm steel bar at 100 mm overhang deflects 40.42 µm under 200 N."
    ],
    "limitations": [
      "Static deflection only; chatter depends on dynamic stiffness and damping.",
      "Clamping is assumed rigid; real holders add compliance.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Common guidance: steel bars to about 4 × D, carbide to about 6 × D, damped bars to about 10 × D; check the supplier’s limits."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 762–790, 1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "electroplating-thickness": {
    "purpose": "Deposition rate, plating time for a target thickness, current and deposited mass by Faraday’s law for common electroplated metals, with cathode current efficiency.",
    "uses": [
      "Set plating time for a thickness specification",
      "Size rectifier current for a rack",
      "Estimate metal consumption"
    ],
    "users": [
      "Platers",
      "Finishing supervisors",
      "Process engineers"
    ],
    "inputs": {
      "metal": "Metal deposited and its ion valence in the bath.",
      "J": "Average cathode current density from the process sheet.",
      "eff": "Cathode current efficiency of the bath (nickel about 95%, hard chromium about 10–25%) from the supplier.",
      "area": "Total area being plated on the rack or barrel load.",
      "thick": "Required average thickness."
    },
    "outputs": [
      "Deposition rate",
      "Time to reach the target thickness",
      "Total current",
      "Mass deposited"
    ],
    "method": [
      "Mass rate per area = J × η × M ÷ (n F), with M the atomic mass, n the valence and F = 96 485 C/mol.",
      "Thickness rate = mass rate ÷ density.",
      "Time = target thickness ÷ rate; current = J × area.",
      "Example: nickel at 4 A/dm² and 95% efficiency deposits 0.77848 µm/min, reaching 20 µm in 25.691 min."
    ],
    "limitations": [
      "Average thickness only; current distribution makes edges thicker and recesses thinner.",
      "Bath efficiency varies with chemistry, temperature and current density.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Allow for thin areas: measure thickness at the significant surface specified on the drawing."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1467, 1500–1516. Topic reference; no source tables or recommended settings are reproduced.",
      "Atomic masses: IUPAC Commission on Isotopic Abundances and Atomic Weights — https://ciaaw.org"
    ]
  },
  "shear-force": {
    "purpose": "Shearing force for straight parallel blades or inclined (raked) blades, including the machine allowance, compared with the shear’s rated capacity.",
    "uses": [
      "Check whether a shear can cut a plate",
      "Compare rake angles",
      "Estimate force for flat bar cropping"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "blades": "Parallel blades (croppers, punch-shears) or inclined blades (guillotines).",
      "t": "Sheet or plate thickness.",
      "b": "Length of the cut for parallel blades.",
      "uts": "Ultimate tensile strength of the material from its certificate.",
      "ratio": "Shear strength as a fraction of tensile strength (about 0.7–0.8 for steels).",
      "rake": "Rake angle of the upper blade (inclined blades).",
      "pen": "Fraction of the thickness the blade penetrates before fracture, from the material table (softer materials penetrate more).",
      "n": "Factor for inclined blades, about 0.75–0.85 for most materials.",
      "cap": "Rated force of the shear from its plate or manual."
    },
    "outputs": [
      "Shearing force",
      "Machine force with allowance",
      "Utilisation of the shear capacity"
    ],
    "method": [
      "Parallel blades: F = τ × b × t, with τ = ratio × UTS; machine force = 1.3F.",
      "Inclined blades: F = n × k × UTS × λ × t² ÷ tan φ, with k the shear ratio, λ the relative penetration and φ the rake angle.",
      "Example: 6 mm plate of 450 MPa with a 2° rake needs about 118.76 kN."
    ],
    "limitations": [
      "Blade clearance, dull blades and thickness variation raise the force; the 30% allowance covers typical cases only.",
      "Rated capacity on a shear is usually stated for mild steel of a given strength; scale for stronger materials.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the machine’s stated maximum thickness for the material strength as well as the force check."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1336–1339. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-brake-force": {
    "purpose": "Bending force for air bending in a V-die from length, thickness, tensile strength and die opening, with force per metre and comparison with the press brake capacity.",
    "uses": [
      "Check press brake tonnage before quoting a bend",
      "Choose a V-die opening",
      "Compare materials and thicknesses"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "L": "Length of the bend line.",
      "t": "Sheet or plate thickness.",
      "uts": "Ultimate tensile strength of the material.",
      "V": "Width of the V-die opening (often about 8 × thickness for air bending).",
      "k": "1.0 gives the handbook approximation F = L T² UTS ÷ W; many press brake makers use about 1.33 for air bending. Bottoming and coining need several times more.",
      "cap": "Rated tonnage of the press brake (1 t ≈ 9.81 kN)."
    },
    "outputs": [
      "Bending force",
      "Force per metre",
      "Utilisation of the press capacity",
      "Die opening to thickness ratio"
    ],
    "method": [
      "F = k × L × t² × UTS ÷ V.",
      "Force per metre = F ÷ L × 1000.",
      "Example: 2000 mm of 3 mm, 450 MPa sheet in a 24 mm die needs 448.88 kN."
    ],
    "limitations": [
      "Air bending in a V-die; bottoming and coining forces are much higher.",
      "Long bends near full capacity can deflect the beam and bed; check the maker’s load-per-length limit.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Do not concentrate full tonnage on a short length; follow the maker’s maximum force per metre."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1353. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shell-blank": {
    "purpose": "Blank diameter for a cylindrical drawn shell with or without a flange, the first drawing ratio against a limit, the estimated number of draws and the first-draw force.",
    "uses": [
      "Size blanks for drawn cups and cans",
      "Plan the number of drawing operations",
      "Estimate first-draw press force"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "d": "Mean diameter of the finished shell.",
      "h": "Height of the shell (to the flange face if flanged).",
      "r": "Inside corner radius between wall and bottom.",
      "flange": "Outside diameter of the flange; 0 for a plain cup.",
      "t": "Sheet thickness.",
      "uts": "Ultimate tensile strength of the sheet.",
      "m1": "Smallest first-draw ratio d ÷ D for your material and relative thickness, from drawing ratio tables (about 0.48–0.63).",
      "m2": "Smallest redraw ratio for later draws (about 0.73–0.82)."
    },
    "outputs": [
      "Blank diameter",
      "First drawing ratio",
      "Estimated number of draws",
      "First-draw force"
    ],
    "method": [
      "D = √(d_f² + 4 d h − 0.5 r d), with d_f = flange diameter (or d for a plain shell).",
      "First drawing ratio m = d ÷ D; one draw if m ≥ the limiting ratio.",
      "Further draws reduce the diameter by the redraw ratio each time.",
      "First-draw force ≈ π d₁ t UTS (D ÷ d₁ − 0.7), with d₁ the first-draw diameter.",
      "Example: a 60 × 50 mm cup needs a 124.42 mm blank and 2 draw(s)."
    ],
    "limitations": [
      "Thin-wall, constant-thickness approximation; trim allowance (often 3–5 mm on the diameter) must be added.",
      "Corner radius correction is approximate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add trim allowance and confirm with a trial draw."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1353–1360. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fillet-weld-strength": {
    "purpose": "Throat thickness, load capacity of fillet welds on the throat with an allowable shear stress, utilisation under a load and the minimum leg size required.",
    "uses": [
      "Size fillet welds for a bracket or lug",
      "Check an existing weld after a load change",
      "Compare weld length and leg size"
    ],
    "users": [
      "Structural and mechanical engineers",
      "Welding supervisors",
      "Fabrication estimators"
    ],
    "inputs": {
      "leg": "Leg length of an equal-leg fillet weld.",
      "L": "Effective length of each weld, excluding craters and start-stops.",
      "nw": "Number of welds of this size carrying the load.",
      "tau": "Allowable or design shear stress on the weld throat from your design code and electrode (e.g. AS 4100 / AS/NZS 1554 or AWS D1.1).",
      "F": "Load on the weld group, assumed shared uniformly in shear."
    },
    "outputs": [
      "Throat thickness",
      "Weld capacity",
      "Utilisation",
      "Minimum leg size for the load"
    ],
    "method": [
      "Throat a = 0.7071 × leg (equal-leg, 90° fillet).",
      "Capacity = a × L × number of welds × allowable shear.",
      "Minimum leg = F ÷ (0.7071 × L × number × allowable shear).",
      "Example: two 6 mm fillets 100 mm long carry 123.04 kN at 145 MPa."
    ],
    "limitations": [
      "Uniform shear on the throat; eccentric loads add bending and torsion to the weld group.",
      "Base metal capacity, fatigue category and weld quality must be checked to the code.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use code-specified design strengths and capacity factors for structural work."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1476–1486, 1469–1475. Topic reference; no source tables or recommended settings are reproduced.",
      "AS/NZS 1554.1 Structural steel welding — Welding of steel structures; AS 4100 Steel structures"
    ]
  },
  "carbon-equivalent": {
    "purpose": "Carbon equivalent (IIW) and Pcm (Ito–Bessyo) from a steel’s chemical composition, with commonly cited weldability guidance.",
    "uses": [
      "Screen a steel for welding preheat",
      "Compare mill certificate chemistry",
      "Choose a welding procedure category"
    ],
    "users": [
      "Welding engineers",
      "Welding supervisors",
      "Quality inspectors"
    ],
    "inputs": {
      "C": "Carbon content from the mill test certificate (weight %).",
      "Mn": "Manganese from the certificate.",
      "Si": "Silicon from the certificate (used in Pcm only).",
      "Cr": "Chromium from the certificate.",
      "Mo": "Molybdenum from the certificate.",
      "V": "Vanadium from the certificate.",
      "Ni": "Nickel from the certificate.",
      "Cu": "Copper from the certificate.",
      "B": "Boron from the certificate (used in Pcm only)."
    },
    "outputs": [
      "Carbon equivalent CE (IIW)",
      "Pcm",
      "Weldability band"
    ],
    "method": [
      "CE(IIW) = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15.",
      "Pcm = C + Si/30 + (Mn + Cu + Cr)/20 + Ni/60 + Mo/15 + V/10 + 5B.",
      "Example: the default chemistry gives CE = 0.43933 and Pcm = 0.2715."
    ],
    "limitations": [
      "Preheat also depends on thickness, heat input, hydrogen level and restraint; the bands are screening guidance, not a procedure.",
      "Pcm is intended for low-carbon steels (C below about 0.18%).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Commonly cited guidance: CE up to about 0.40 is readily weldable; 0.40–0.60 usually needs preheat and low-hydrogen practice; above about 0.60 needs careful procedures. Determine preheat with AS/NZS 1554.1 or your welding procedure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1431–1449. Topic reference; no source tables or recommended settings are reproduced.",
      "AS/NZS 1554.1 Structural steel welding (preheat determination); International Institute of Welding carbon equivalent"
    ]
  },
  "casting-solidification": {
    "purpose": "Casting and riser moduli and solidification times by Chvorinov’s rule, the riser-to-casting modulus ratio, and pattern size from a shrinkage allowance.",
    "uses": [
      "Check that a riser feeds a casting section",
      "Compare riser sizes",
      "Size a pattern for shrinkage"
    ],
    "users": [
      "Foundry engineers",
      "Pattern makers",
      "Casting buyers"
    ],
    "inputs": {
      "Vc": "Volume of the casting or the section the riser must feed, from CAD.",
      "Ac": "Surface area of that section that cools into the mould (exclude faces joined to other sections).",
      "Dr": "Riser diameter.",
      "Hr": "Riser height.",
      "B": "Mould constant for the metal and mould, from foundry trials or data.",
      "ratio": "Riser modulus must exceed the casting modulus by this factor (1.2 is a common foundry rule).",
      "part": "Finished part dimension to convert to a pattern size.",
      "shrink": "Patternmaker’s shrinkage allowance for the alloy and mould (e.g. about 1% for grey iron, 2% for steel)."
    },
    "outputs": [
      "Casting and riser moduli",
      "Solidification times",
      "Modulus ratio",
      "Pattern dimension"
    ],
    "method": [
      "Modulus M = V ÷ A (cm). Riser (top and side cooling): V = πD²H/4, A = πDH + πD²/4.",
      "Chvorinov: t = B × M².",
      "Pattern dimension = part dimension × (1 + shrinkage).",
      "Example: the casting modulus is 2.2222 cm and the riser’s 2.7013 cm, a ratio of 1.2156."
    ],
    "limitations": [
      "Chvorinov’s rule is an approximation; riser feeding distance and volume (shrinkage demand) must also be checked.",
      "Exothermic or insulated sleeves change the riser modulus.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Feeding needs both a larger modulus and enough liquid volume in the riser."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1405–1420. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "brinell-hardness": {
    "purpose": "Brinell hardness number from test force, ball diameter and mean indentation diameter, with validity checks and an approximate tensile strength for steels.",
    "uses": [
      "Calculate HBW from a measured indentation",
      "Check test validity (indent size, force ratio)",
      "Estimate steel tensile strength"
    ],
    "users": [
      "Quality inspectors",
      "Metallurgists",
      "Materials engineers"
    ],
    "inputs": {
      "F": "Test force in kilograms-force (3000 kgf with a 10 mm ball for steels; 1 kgf = 9.80665 N).",
      "D": "Diameter of the carbide ball.",
      "d": "Mean of two perpendicular indentation diameters measured with the microscope."
    },
    "outputs": [
      "Brinell hardness HBW",
      "Force–diameter ratio",
      "Indentation ratio d/D",
      "Approximate tensile strength (steels)"
    ],
    "method": [
      "HBW = 2F ÷ (πD(D − √(D² − d²))), F in kgf (equivalently 0.102 × 2F_N ÷ …).",
      "Valid indentation: 0.24D ≤ d ≤ 0.6D (ISO 6506-1).",
      "Approximate tensile strength of carbon and low-alloy steels ≈ 3.45 × HBW (MPa).",
      "Example: 3000 kgf on a 10 mm ball leaving a 4 mm indent is 228.77 HBW."
    ],
    "limitations": [
      "The tensile strength estimate is approximate and applies to steels only; use measured tensile tests for acceptance.",
      "Specimen thickness must be at least about 8 × the indentation depth.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Report as HBW with the ball and force, e.g. 229 HBW 10/3000."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1406–1412. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 6506-1 Metallic materials — Brinell hardness test — Part 1: Test method"
    ]
  },
  "wall-heat-loss": {
    "purpose": "Overall heat transfer coefficient, heat flow and interface temperatures for conduction through up to three plane layers with optional surface film coefficients.",
    "uses": [
      "Estimate heat loss from an oven, tank or duct wall",
      "Choose insulation thickness",
      "Find the outside surface temperature for touch safety"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "Thot": "Temperature of the hot fluid or inside surface.",
      "Tcold": "Temperature of the surroundings or cold fluid.",
      "area": "Wall area.",
      "hin": "Convection coefficient on the hot side; 0 to treat the hot temperature as the surface temperature.",
      "hout": "Convection plus radiation coefficient on the cold side (about 8–12 W/m²K for still air).",
      "t1": "Thickness of layer 1 (hot side).",
      "k1": "Conductivity of layer 1 at its mean temperature, from material data.",
      "t2": "Thickness of layer 2.",
      "k2": "Conductivity of layer 2 (insulation conductivity rises with temperature).",
      "t3": "Thickness of layer 3 (cold side).",
      "k3": "Conductivity of layer 3."
    },
    "outputs": [
      "Overall coefficient U",
      "Heat flow and heat flux",
      "Cold-side surface temperature",
      "Interface temperatures"
    ],
    "method": [
      "Resistance per unit area R = 1/h_in + Σ(t ÷ k) + 1/h_out (omitting zero terms).",
      "U = 1 ÷ R; heat flow Q = U × A × ΔT.",
      "Each interface temperature drops by q × (layer resistance) from the hot side.",
      "Example: the default wall loses 673.06 W, and its outer surface runs at 31.731 °C."
    ],
    "limitations": [
      "Steady, one-dimensional conduction through flat layers; curved walls of small radius and thermal bridges increase the loss.",
      "Conductivity varies with temperature; use mean-temperature values.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the outside surface temperature against your touch-temperature or burn-protection limit."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "heating-energy": {
    "purpose": "Energy to raise a mass through a temperature range from its specific heat, and the heating time with a given heater power and efficiency.",
    "uses": [
      "Size a tank or oven heater",
      "Estimate warm-up time",
      "Compare energy cost of heating batches"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mass": "Mass of the material or liquid (water: 1 kg per litre).",
      "c": "Specific heat over the range (water about 4.18, steel about 0.49, aluminium about 0.90 kJ/kg·K).",
      "T1": "Starting temperature.",
      "T2": "Target temperature.",
      "P": "Rated heater power.",
      "eff": "Share of heater output that reaches the load (losses to surroundings reduce it).",
      "price": "Energy tariff for cost per batch."
    },
    "outputs": [
      "Heat energy required",
      "Heating time",
      "Energy drawn and cost per batch"
    ],
    "method": [
      "Q = m c (T₂ − T₁) (kJ); in kWh ÷ 3600.",
      "Time = Q ÷ (P × η) (hours when Q is in kWh).",
      "Energy drawn = Q ÷ η; cost = energy drawn × price.",
      "Example: 500 kg of water from 15 to 60 °C needs 26.125 kWh, about 3.415 h with 9 kW."
    ],
    "limitations": [
      "No phase change (melting or boiling) is included; add latent heat separately.",
      "Heat loss during heating is represented only by the efficiency.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Heat losses rise with temperature; use a lower efficiency for long, hot warm-ups."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–374. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
