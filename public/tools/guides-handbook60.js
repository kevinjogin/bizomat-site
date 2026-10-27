// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook60).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "sprocket-bore-key-plan": {
    "purpose": "Plan of a roller chain sprocket blank and its shaft key: the pitch, bottom, caliper and outside diameters of the sprocket (as the sprocket diameters tool), the chordal height, keyseat measurement S and measurement over the key T for the shaft (as the keyseat depth tool), and the wall left between the top of the key (where the hub keyway reaches) and the bottom diameter of the teeth, against the least wall you will accept.",
    "uses": [
      "Check the largest bore for a small sprocket",
      "Set the keyseat readings for a sprocket shaft",
      "Rebore a stock sprocket for a bigger shaft"
    ],
    "users": [
      "Machinists",
      "Maintenance fitters",
      "Design engineers"
    ],
    "inputs": {
      "p": "Pitch of the roller chain.",
      "N": "Number of teeth on the sprocket.",
      "Dr": "Roller diameter of the chain.",
      "D": "Shaft diameter, equal to the sprocket bore.",
      "w": "Width of the key.",
      "t": "Depth of the shaft keyseat measured at its side.",
      "h": "Height of the key.",
      "wMin": "Smallest radial wall you will accept between the hub keyway and the tooth bottoms."
    },
    "outputs": [
      "Sprocket diameters",
      "Shaft keyseat readings",
      "Wall under the teeth"
    ],
    "method": [
      "Pitch diameter = p ÷ sin (180° ÷ N); bottom = PD − D_r; caliper = PD cos (90° ÷ N) − D_r for odd teeth; outside = p (0.6 + cot (180° ÷ N)) (as the sprocket diameters tool).",
      "Chordal height Y = (D − √(D² − w²)) ÷ 2; S = D − Y − t; T = S + h (as the keyseat depth tool).",
      "Top of the key from the bore centre = T − D ÷ 2; wall = bottom diameter ÷ 2 − (T − D ÷ 2).",
      "Example: bottom diameter 76.235 mm; keyseat reading S 25.457 mm; 20.661 mm of wall under the teeth."
    ],
    "limitations": [
      "Plain hub without a raised boss; a hub boss adds metal beside the teeth but not under them.",
      "Hub keyway depth taken to the top of the key; add the keyway clearance from your key standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A thin wall under a keyway is where small sprockets crack; go up a tooth or two or use a smaller key with a set screw."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2537–2550, 2460–2486. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pinned-hub-drive-check": {
    "purpose": "Check of a hub, collar or lever driven through a cross (taper or straight) pin: the torque from torque or power and speed, the pin diameter needed and the pin shear stress in double shear (as the taper pin torque tool), the bearing pressure of the pin on the shaft bore, the torsional stress in the shaft raised by the cross-hole stress concentration, and the pin-to-shaft size ratio, against your allowable stresses.",
    "uses": [
      "Size the pin for a pinned collar or gear",
      "Check a pinned handwheel or lever",
      "See whether the cross hole weakens the shaft too much"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machinists"
    ],
    "inputs": {
      "mode": "Whether the load is entered as a torque or as power and speed.",
      "T": "Torque through the pin.",
      "P": "Power through the pin.",
      "rpm": "Shaft speed (power mode).",
      "D": "Diameter of the shaft where the pin passes through.",
      "dp": "Mean diameter of the pin in the shaft.",
      "S": "Safe shear stress for the pin material and duty.",
      "sbA": "Allowable bearing pressure of the pin on the shaft material.",
      "Kt": "Torsional stress concentration factor for a transverse hole in a shaft.",
      "tauA": "Allowable torsional shear stress in the shaft.",
      "ratioMax": "Largest pin diameter as a share of the shaft diameter you will accept."
    },
    "outputs": [
      "Torque and pin size needed",
      "Pin shear and bearing pressure",
      "Shaft stress at the cross hole"
    ],
    "method": [
      "Torque from T or 9549 P ÷ n; pin needed d = 1.13 √(T ÷ (D S)); pin shear τ = 4T ÷ (π d² D) (as the taper pin torque tool).",
      "Bearing pressure of the pin on the shaft = 6T ÷ (d D²).",
      "Shaft stress = K_t × 16T ÷ (π D³).",
      "Example: a 5.65 mm pin is the least; the 8 mm pin runs at 39.789 MPa shear and the shaft at 22.635 MPa."
    ],
    "limitations": [
      "Steady torque; reversing or shock loads loosen pins and need lower allowables.",
      "Shaft net-section effect is in the stress concentration factor you enter.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A pin that shears before the shaft yields acts as a shear pin; a pin over about a third of the shaft size weakens the shaft too much."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 220, 1714–1720. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-flywheel-check": {
    "purpose": "Check of a press flywheel and drive motor: the energy per stroke from peak force and working travel or entered directly, the average power, the energy the flywheel must give up during the cut for the allowed speed drop, the rim mass needed and the rim section, and the rim hoop stress from its speed (as the press flywheel sizing tool), against the rim mass fitted, your allowable rim stress and the motor power with drive efficiency.",
    "uses": [
      "Check a press for a thicker or stronger blank",
      "Check a motor change on an old press",
      "Size a flywheel rim for a new drive"
    ],
    "users": [
      "Press tool designers",
      "Maintenance engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "emode": "Work out the energy from force and travel, or enter it.",
      "F": "Peak press force during the cut.",
      "s": "Travel over which the force acts (about the stock thickness for shearing).",
      "E": "Energy per stroke when entered directly.",
      "spm": "Strokes per minute.",
      "tcut": "Time the cut itself takes.",
      "Dm": "Mean diameter of the flywheel rim.",
      "rpm": "Flywheel speed.",
      "red": "How far the flywheel may slow during the cut.",
      "rho": "Density of the rim material (cast iron about 7200).",
      "y": "Rim section depth divided by width.",
      "mFit": "Mass of the rim on the press (0 if none fitted yet).",
      "sA": "Allowable hoop stress in the rim for its material and construction.",
      "Pmot": "Rated power of the drive motor.",
      "eta": "Efficiency of the belts and gears between motor and flywheel."
    },
    "outputs": [
      "Energy per stroke and average power",
      "Rim mass needed, section and stress",
      "Rim and motor against the press"
    ],
    "method": [
      "E = F s or as entered; average power = E × strokes ÷ 60 (as the press flywheel sizing tool).",
      "Energy from the flywheel E₁ = E (1 − t_cut ÷ t_stroke); rim mass = 2E₁ ÷ (v₁² − v₂²); hoop stress = ρ v₁².",
      "Motor power needed = average power ÷ drive efficiency.",
      "Example: 162.7 kJ per stroke needs 2,984.1 kg of rim and 60.26 kW of motor."
    ],
    "limitations": [
      "Rim mass only; arms and hub add a little inertia, which is on the safe side.",
      "Average power; the motor must also accelerate the flywheel at start-up.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Allowing more slowdown cuts the rim mass sharply but puts more slip and heat into the motor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3004–3006, 182–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drop-hammer-forging-plan": {
    "purpose": "Plan of a drop hammer or drop stamp operation: the force needed to deform the part from its area, the flow stress at the forging temperature and a constraint factor, then the set per blow at which the hammer’s energy (falling mass, drop height and efficiency) gives that average force (as the drop hammer blow tool, solved for the set), the impact speed and energy per blow, and the number of blows for the total reduction, against the most blows you will allow per heat.",
    "uses": [
      "Estimate the blows to upset a bar end",
      "Check whether a hammer is big enough for a forging",
      "Compare drop heights or tup masses"
    ],
    "users": [
      "Forge masters",
      "Manufacturing engineers",
      "Blacksmiths"
    ],
    "inputs": {
      "m": "Mass of the tup, die and anything else that falls.",
      "h": "Height the tup falls before it touches the work.",
      "eff": "Share of the blow energy that goes into deforming the work (the rest goes into the anvil and foundation).",
      "A": "Cross-section area being squeezed, averaged over the blow.",
      "sf": "Flow stress of the material at the forging temperature and strain rate.",
      "K": "Factor for friction and die constraint (about 1.2–2 for open-die upsetting, more for closed dies).",
      "red": "Total reduction in height the forging needs.",
      "maxBlows": "Blows you can strike before the part must be reheated."
    },
    "outputs": [
      "Force needed",
      "Set, energy and impact speed per blow",
      "Number of blows"
    ],
    "method": [
      "Force needed F = A × flow stress × factor.",
      "Average force of a blow F = η m g (h + d) ÷ d (as the drop hammer blow tool), solved for the set: d = η m g h ÷ (F − η m g).",
      "Blows = total reduction ÷ set per blow, rounded up; impact speed √(2 g h).",
      "Example: 450 kN is needed; each blow sets 13.191 mm, so 3 blows."
    ],
    "limitations": [
      "Constant area and flow stress; as the part spreads and cools the force rises and the set falls.",
      "Rigid anvil; a light anvil absorbs much of the blow.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Doubling the drop height roughly doubles the set per blow; a heavier tup does the same with less impact speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 183–184. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "v-belt-motor-load-check": {
    "purpose": "Check of a V-belt or flat belt drive against its motor: the driven pulley size and speed, belt length, wrap, belt speed, effective pull, centrifugal tension, number of belts and the resultant shaft load from the tight and slack side tensions (as the V-belt drive design tool), against the grooves on the pulleys, the driven speed you need and the radial load the motor bearings are rated for at the pulley position.",
    "uses": [
      "Check a fan or pump belt drive on a standard motor",
      "Change pulleys without overloading motor bearings",
      "Find how many belts a drive needs"
    ],
    "users": [
      "Maintenance engineers",
      "Mechanical fitters",
      "HVAC engineers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n1": "Motor speed.",
      "d1": "Pitch diameter of the motor pulley.",
      "ratio": "Motor speed divided by driven speed (driven pulley = ratio × motor pulley).",
      "C": "Distance between the shaft centres.",
      "SF": "Service factor for the driven machine and running hours.",
      "groove": "V-belt in a 38° groove, or a flat belt.",
      "mu": "Friction coefficient between belt and pulley.",
      "mass": "Mass of one belt per metre.",
      "Tmax": "Largest working tension one belt may carry.",
      "nG": "Number of grooves on the pulleys you have.",
      "Fr": "Radial load the motor maker allows at the pulley’s position on the shaft.",
      "n2req": "Speed the driven machine needs.",
      "tol": "How far the driven speed may differ from the speed needed."
    },
    "outputs": [
      "Driven pulley, speed and belt length",
      "Belts needed and shaft load",
      "Against the grooves, speed and motor rating"
    ],
    "method": [
      "Wrap θ = π − 2 asin ((D − d) ÷ 2C); belt speed; effective pull = P × SF ÷ v; centrifugal tension m v² (as the V-belt drive design tool).",
      "Belts = effective pull × e^{μθ} ÷ (e^{μθ} − 1) ÷ (allowable − centrifugal) rounded up; shaft load from T₁ and T₂ and the belt angle.",
      "Driven speed = motor speed ÷ ratio; compared with the speed needed.",
      "Example: 3 belts; the motor shaft carries 1,104.2 N and the driven pulley turns 580 rpm."
    ],
    "limitations": [
      "Steady load at the pulley position given by the motor maker; a pulley mounted further out lowers the allowable load.",
      "Belt capacity by allowable tension; the belt maker’s power ratings govern for a final selection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger motor pulley lowers the belt pull and the shaft load for the same power; a small pulley is the usual cause of bearing failures."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2487–2536. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "conveyor-drive-train-check": {
    "purpose": "Check of a belt conveyor drive train: the load per metre, effective belt pull from friction and lift, the power at the pulley and at the motor with efficiency and margin, the tight and slack side tensions, the pulley torque and speed (as the conveyor drive sizing tool), then the reducer ratio needed from the motor speed, the belt speed with the reducer you have, and the pulley torque with a service factor against the gearbox rating.",
    "uses": [
      "Check a conveyor drive before raising throughput",
      "Pick a reducer ratio for a conveyor",
      "Check a replacement gearbox"
    ],
    "users": [
      "Bulk handling engineers",
      "Maintenance engineers",
      "Plant engineers"
    ],
    "inputs": {
      "Q": "Material carried per hour.",
      "v": "Belt speed the conveyor is designed for.",
      "L": "Length between the terminal pulley centres.",
      "Hl": "Height the material is lifted (negative for downhill).",
      "qm": "Mass per metre of the belt and rotating idler parts, both runs.",
      "f": "Overall friction factor for the idlers and belt (about 0.02–0.03).",
      "mu": "Friction between the belt and the drive pulley (lagged pulleys are higher).",
      "wrap": "Angle of wrap of the belt on the drive pulley.",
      "D": "Diameter of the drive pulley.",
      "eta": "Efficiency of the reducer and couplings.",
      "marg": "Extra power for starting and uncertainty.",
      "nm": "Full-load speed of the motor.",
      "iR": "Ratio of the reducer you have or propose.",
      "tolV": "How far the belt speed may differ from the design speed.",
      "Pinst": "Rated power of the motor fitted.",
      "TgR": "Rated output torque of the gearbox.",
      "SFg": "Service factor on the gearbox for the conveyor duty and hours."
    },
    "outputs": [
      "Belt pull, tensions and power",
      "Reducer ratio and belt speed",
      "Motor and gearbox against the duty"
    ],
    "method": [
      "Load per metre = Q ÷ 3.6v; effective pull = f g L (q_L + q_m) + q_L g H; power = T_e v; motor = power ÷ η × (1 + margin) (as the conveyor drive sizing tool).",
      "Pulley speed = v ÷ (π D) × 60; ratio needed = motor speed ÷ pulley speed; belt speed with the fitted reducer = π D × motor speed ÷ ratio ÷ 60.",
      "Pulley torque = T_e D ÷ 2; gearbox duty = torque × service factor.",
      "Example: 2.7551 kW needed; ratio 20.246 for 1.5 m/s; the fitted 20 : 1 gives 1.5184 m/s and 450.83 N·m gearbox duty."
    ],
    "limitations": [
      "Steady running with an overall friction factor; detailed resistances and starting need a full conveyor design.",
      "Power and torque at the design speed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The lift term dominates on inclined conveyors; on long flat conveyors friction does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2487–2512, 2122–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vessel-shell-plan": {
    "purpose": "Plan of a cylindrical pressure vessel shell and heads: the required thickness of the shell and of 2:1 ellipsoidal heads with joint efficiency and corrosion allowance and the hydrostatic test pressure (as the pressure vessel thickness tool), then the maximum allowable working pressure of the plate you choose for both, the volume and water mass for the hydrostatic test, and the mass of the shell course.",
    "uses": [
      "Pick a plate thickness for an air receiver or tank",
      "Find the working pressure of an existing shell",
      "Plan the water for a hydrostatic test"
    ],
    "users": [
      "Pressure vessel designers",
      "Fabrication engineers",
      "Inspectors"
    ],
    "inputs": {
      "p": "Internal design pressure.",
      "D": "Inside diameter of the shell.",
      "S": "Allowable stress of the plate at the design temperature, from your pressure vessel code.",
      "E": "Efficiency of the longitudinal weld from the code and the extent of radiography.",
      "CA": "Thickness allowed for corrosion over the vessel’s life.",
      "tf": "Hydrostatic test pressure as a multiple of design pressure, from your code.",
      "tUse": "Nominal thickness of the plate you will use for the shell and heads (after forming thinning).",
      "L": "Length of the cylindrical shell between the head tangent lines.",
      "rho": "Density of the plate (7850 for steel)."
    },
    "outputs": [
      "Thickness needed for shell and heads, and test pressure",
      "Working pressure of the chosen plate",
      "Test water and shell mass"
    ],
    "method": [
      "Shell t = P R ÷ (S E − 0.6P) + CA; 2:1 ellipsoidal head t = P D ÷ (2S E − 0.2P) + CA; test pressure = factor × P (as the pressure vessel thickness tool).",
      "MAWP of the shell = S E t_c ÷ (R + 0.6 t_c); of the head = 2 S E t_c ÷ (D + 0.2 t_c), with t_c = chosen − CA.",
      "Volume = π D² L ÷ 4 + 2 × π D³ ÷ 24; shell mass = π (D + t) t L ρ.",
      "Example: the shell needs 5.7845 mm; 8 mm plate allows 1.5131 MPa; the test takes 2,618 kg of water."
    ],
    "limitations": [
      "Internal pressure only; external pressure, nozzles, supports and wind need the full code design.",
      "Head thickness is the finished thickness after forming.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The heads of a 2:1 ellipsoidal design need about the same thickness as the shell, so one plate thickness often serves both."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 290–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "turning-cut-power-check": {
    "purpose": "Check of a turning cut against the lathe: the chip area, equivalent chip thickness, removal rate, cutting force, feed-plane force and its axial and radial parts and the cutting power (as the equivalent chip thickness cutting forces tool), the highest cutting speed the spindle power allows for the same feed and depth (as the full-power cutting speed tool), and the spindle speed for the work diameter, against the power available and the spindle speed limit.",
    "uses": [
      "Check a roughing cut on a small lathe",
      "Find the fastest speed the motor allows",
      "Estimate tool and work forces for a setup"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Process planners"
    ],
    "inputs": {
      "f": "Feed per revolution.",
      "a": "Radial depth of cut.",
      "CEL": "Length of cutting edge in contact (from the tool nose radius, lead angle and depth).",
      "V": "Cutting speed.",
      "Kc": "Specific cutting force for the material at this equivalent chip thickness (from the tool maker).",
      "ratio": "Feed-plane force as a share of the cutting force.",
      "cfa": "Direction of chip flow, which splits the feed-plane force into axial and radial parts.",
      "Pavail": "Rated spindle motor power.",
      "eta": "Share of motor power that reaches the cut.",
      "Dw": "Diameter being turned.",
      "nMax": "Highest spindle speed of the lathe."
    },
    "outputs": [
      "Chip area, ECT and removal rate",
      "Cutting forces and power",
      "Power and speed against the lathe"
    ],
    "method": [
      "Chip area = f a; ECT = area ÷ edge length; F_c = area × K_c; F_H = ratio × F_c split by the chip flow angle; power = F_c V ÷ 60 000 (as the equivalent chip thickness cutting forces tool).",
      "Power at the cut = motor × efficiency; highest speed = power at the cut × 60 000 ÷ (K_c a f) (as the full-power cutting speed tool).",
      "Spindle speed = 1000 V ÷ (π D).",
      "Example: the cut takes 12 kW of the 14.8 kW available, with 3,600 N cutting force; full power allows 246.67 m/min."
    ],
    "limitations": [
      "Specific cutting force must match the ECT and tool geometry used.",
      "Tool life, chatter and work holding limit the cut separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thicker chips cut more efficiently: raising feed is a cheaper way to remove metal than raising speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1132–1141, 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pressure-tube-torsion-check": {
    "purpose": "Check of a thin-walled tube or shaft under internal pressure, end thrust and torque: the hoop and axial stresses from pressure (closed ends) plus the axial load, the shear stress from torque in the thin wall, then the principal stresses, their direction, the maximum shear and the von Mises equivalent stress with the safety factor against yield (as the principal stress tool), against your required factor.",
    "uses": [
      "Check a hydraulic swivel or rotary union tube",
      "Check a pressurised drive tube",
      "Check a pipe under torque from misalignment"
    ],
    "users": [
      "Design engineers",
      "Hydraulic engineers",
      "Stress analysts"
    ],
    "inputs": {
      "OD": "Outside diameter of the tube.",
      "t": "Wall thickness.",
      "p": "Internal gauge pressure; ends are taken as closed, so pressure also loads the tube axially.",
      "N": "Extra axial load (tension positive, compression negative).",
      "T": "Torque carried by the tube.",
      "Sy": "Yield strength of the tube material.",
      "req": "Safety factor on yield you need."
    },
    "outputs": [
      "Hoop, axial and shear stress",
      "Principal stresses and direction",
      "von Mises stress and safety factor"
    ],
    "method": [
      "Mean diameter D_m = OD − t; hoop σ_h = p D_m ÷ 2t; axial σ_a = p D_m ÷ 4t + N ÷ (π D_m t); shear τ = 2T ÷ (π D_m² t).",
      "σ₁,₂ = (σ_a + σ_h) ÷ 2 ± √(((σ_a − σ_h) ÷ 2)² + τ²) (as the principal stress tool, with σx axial and σy hoop).",
      "von Mises √(σ₁² − σ₁σ₂ + σ₂²); safety factor = yield ÷ von Mises.",
      "Example: hoop 120 MPa, axial 60 MPa and shear 34.539 MPa give 119.91 MPa von Mises, a factor of 2.0849."
    ],
    "limitations": [
      "Thin wall (thickness up to about a tenth of the diameter); thick tubes need the Lamé equations.",
      "Away from ends, ports and welds, where local stresses are higher.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Torque adds less than you might expect when hoop stress dominates, because the stresses combine as a vector, not a sum."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218, 290–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
