// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook35).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "torsion-spring-designer": {
    "purpose": "Design check of a helical torsion spring: the moment from the load and arm, angular deflection including the bending of straight legs (as extra active coils), rate per radian and per turn, bending stress with the inner-fibre curvature factor (as the torsion spring tool), the largest angle before the allowable stress is reached, the coil diameter and body length after windup, and the clearance over the arbor.",
    "uses": [
      "Design a return spring for a hinge, lever or lid",
      "Check that a wound-up spring still clears its arbor",
      "Find the safe working angle of a spring"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Product designers"
    ],
    "inputs": {
      "d": "Diameter of the spring wire.",
      "D": "Mean diameter of the coils.",
      "Nb": "Number of coils in the body.",
      "L1": "Length of the leg the load acts on.",
      "L2": "Length of the leg that is held.",
      "E": "Elastic modulus of the wire.",
      "F": "Load applied at the arm.",
      "arm": "Distance from the spring axis to the load.",
      "arbor": "Diameter of the rod the spring winds onto (0 if none).",
      "allow": "Allowable bending stress for the wire and duty (your value from the spring maker).",
      "clr": "Least clearance you want between the wound inside diameter and the arbor, as a share of the arbor diameter."
    },
    "outputs": [
      "Moment, angle and rate",
      "Bending stress and largest safe angle",
      "Wound diameter, body length and arbor clearance"
    ],
    "method": [
      "Moment M = F × arm; equivalent active coils N_a = N_b + (L₁ + L₂) ÷ (3πD) for straight legs.",
      "Angle θ = 64 M D N_a ÷ (E d⁴) radians; rate = M ÷ θ.",
      "Bending stress σ = K_i 32 M ÷ (π d³), K_i = (4C² − C − 1) ÷ [4C(C − 1)], C = D ÷ d (as the torsion spring tool).",
      "Wound mean diameter D′ = D N_b ÷ (N_b + θ_body ÷ 2π); inside diameter = D′ − d; body length ≈ d (N_b + 1 + θ_body ÷ 2π).",
      "Example: 20 N on a 25 mm arm winds the spring 69.367° at 687.9 MPa; the wound inside diameter is 17.403 mm."
    ],
    "limitations": [
      "Static design stress; fatigue needs the stress range and the maker’s fatigue data.",
      "Load in the direction that winds the coils tighter; unwinding loads need a lower allowable.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Long legs add deflection: shorten them for a stiffer spring rather than adding wire size."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 333–343. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "planetary-gear-set-design": {
    "purpose": "Design check of a simple planetary gear set: planet teeth, ratio, output speed and torque for the chosen fixed member (as the planetary gear tool), the equal-spacing assembly condition and the planet adjacency (tip clearance) check, pitch diameters and centre distance, sun torque and the tangential force per planet with a load-sharing factor, the meshing speed relative to the carrier, the planet pin load and the Lewis bending stress on the sun teeth.",
    "uses": [
      "Lay out a planetary stage for a gearmotor or winch",
      "Check tooth counts for equal planet spacing",
      "Find the planet bearing load"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "zs": "Teeth on the sun gear.",
      "zr": "Teeth on the internal ring gear.",
      "np": "Number of planet gears.",
      "mode": "Which member drives, which is held and which is the output.",
      "nin": "Speed of the input member.",
      "Tin": "Torque on the input member.",
      "eff": "Efficiency of the stage.",
      "m": "Module of all three gears.",
      "b": "Face width of the sun mesh.",
      "Ks": "Factor for uneven load sharing between planets (1 for a floating sun and perfect sharing; higher for rigid mounting).",
      "Y": "Lewis form factor for the sun teeth.",
      "make": "Manufacturing quality, which sets the velocity factor.",
      "allow": "Allowable bending stress of the sun material (your design value)."
    },
    "outputs": [
      "Planet teeth, ratio, speeds and torque",
      "Assembly and adjacency checks",
      "Tooth force per planet, pin load and sun bending stress"
    ],
    "method": [
      "Planet teeth z_p = (z_r − z_s) ÷ 2; ratio 1 + z_r ÷ z_s (ring fixed), 1 + z_s ÷ z_r (sun fixed), −z_r ÷ z_s (carrier fixed) (as the planetary gear tool).",
      "Equal spacing needs (z_s + z_r) ÷ n_p to be a whole number; neighbouring planets clear if (z_s + z_p) sin(π ÷ n_p) > z_p + 2.",
      "Sun torque from the torque split T_s : T_r : T_c = 1 : z_r ÷ z_s : (1 + z_r ÷ z_s); tangential force per planet F_t = 2T_s ÷ (d_s n_p) × K_s; planet pin load ≈ 2F_t.",
      "Lewis σ = K_v F_t ÷ (b m Y) with the velocity factor from the pitch-line speed relative to the carrier.",
      "Example: 24/72 teeth with 3 planets give 4:1; each planet carries 798.61 N and the sun bending stress is 97.985 MPa."
    ],
    "limitations": [
      "Lewis method for a first sizing; full ratings use ISO 6336 with the planetary load factors.",
      "Standard (unshifted) gears with planets of equal size.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More planets cut the load per tooth but need better load sharing (a floating sun or flexible pins)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2211, 2122–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "turning-cut-planner": {
    "purpose": "Plan of a turning operation: spindle speed from cutting speed and diameter (held to the machine’s maximum), passes for the radial stock at the depth of cut, cutting force and power from the specific cutting force (as the turning power tool), spindle torque against the machine’s torque at that speed, theoretical peak-to-valley height and roughness from feed and nose radius (as the turning cusp tool), and cutting time (as the turning time tool).",
    "uses": [
      "Plan speeds and feeds for a turned part",
      "Check a heavy cut against spindle power and torque",
      "Choose a feed for a required finish"
    ],
    "users": [
      "CNC machinists",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Starting diameter of the work.",
      "L": "Length turned in each pass.",
      "appr": "Extra travel for approach and run-out.",
      "stock": "Material to remove on the radius.",
      "ap": "Depth of cut per pass.",
      "vc": "Cutting speed for the tool and material.",
      "f": "Feed per revolution.",
      "r": "Tool nose radius.",
      "kc": "Specific cutting force for the material at this chip thickness (your value; see the chip thickness tool).",
      "eta": "Share of motor power that reaches the cut.",
      "Pavail": "Rated spindle power.",
      "nmax": "Highest spindle speed of the machine (or of the chuck and work).",
      "Tmax": "Torque the spindle can deliver at this speed (from the power-torque chart).",
      "RaMax": "Roughness the drawing allows."
    },
    "outputs": [
      "Spindle speed and passes",
      "Cutting force, power and torque",
      "Theoretical finish and cutting time"
    ],
    "method": [
      "n = 1000 v_c ÷ (π D), limited to n_max (the cutting speed then falls); passes = stock ÷ a_p rounded up.",
      "F_c = k_c a_p f; power = F_c v_c ÷ 60 000 ÷ η; torque = F_c D ÷ 2000 (as the turning power tool).",
      "Peak-to-valley R_t ≈ f² ÷ (8r); Ra ≈ f² ÷ (32r) (as the turning cusp tool).",
      "Time = passes × (L + approach) ÷ (f n) (as the turning time tool).",
      "Example: 200 m/min on 80 mm runs at 795.77 rpm and needs 6.25 kW; Ra is about 2.4414 µm and the cut takes 1.0254 min."
    ],
    "limitations": [
      "Uses the starting diameter for every pass; later passes are slightly lighter.",
      "Theoretical finish only; vibration, built-up edge and tool wear make it rougher.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the feed quarters the theoretical roughness but doubles the time."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101, 1023–1030. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flat-belt-drive-design": {
    "purpose": "Design of an open flat belt drive: wrap angle on the small pulley, belt length for the centre distance, belt speed, effective pull with a service factor, tight and slack side tensions with the centrifugal tension of the belt (as the belt drive tensions tool), the belt width needed so the tight-side stress stays within your allowable, and the shaft load.",
    "uses": [
      "Size a flat belt for a fan, pump or line shaft",
      "Check a belt for a higher speed",
      "Find the shaft load for bearing selection"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "kW": "Power transmitted.",
      "SF": "Service factor for the driven machine.",
      "d": "Diameter of the small pulley.",
      "D": "Diameter of the large pulley.",
      "C": "Distance between pulley centres.",
      "rpm": "Speed of the small pulley.",
      "mu": "Friction coefficient between belt and pulley.",
      "t": "Belt thickness.",
      "rho": "Density of the belt material.",
      "sa": "Allowable tensile stress in the belt including joint efficiency (your value from the belt maker).",
      "b": "Belt width considered.",
      "vMax": "Largest speed for the belt and pulleys."
    },
    "outputs": [
      "Wrap angle, belt length and speed",
      "Tensions and shaft load",
      "Belt width needed"
    ],
    "method": [
      "Wrap θ = 180° − 2 sin⁻¹[(D − d) ÷ 2C]; open belt length L = 2C + π(D + d) ÷ 2 + (D − d)² ÷ 4C.",
      "Effective pull F_e = P × SF ÷ v; centrifugal tension T_c = m v² with m = ρ b t; T₂ = F_e ÷ (e^{μθ} − 1) + T_c; T₁ = T₂ + F_e (as the belt drive tensions tool).",
      "Width so that T₁ ÷ (b t) ≤ σ_a: b = F_e e^{μθ} ÷ [(e^{μθ} − 1) t (σ_a − ρ v²)].",
      "Example: 7.5 kW at 12.147 m/s needs a 89.849 mm wide, 5 mm belt; the shaft load is 1,797.9 N."
    ],
    "limitations": [
      "Belt tension is assumed set so the drive just transmits the load with the service factor; real installation tension is often higher.",
      "Crossed belts and idlers change the wrap.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Above about 25–30 m/s centrifugal tension eats into the belt’s capacity."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2473–2520. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "disc-brake-design": {
    "purpose": "Design check of a caliper disc brake: the braking torque to stop an inertia in the required time against a load that drives through the stop or helps it, the effective friction radius for uniform wear or uniform pressure, the clamp force for the number of friction faces, pad pressure, friction energy per stop, the disc temperature rise if the disc absorbs the heat, and the stopping angle.",
    "uses": [
      "Size a caliper brake for a machine spindle, winch or conveyor",
      "Check pad pressure and disc heating",
      "Compare uniform-wear and uniform-pressure assumptions"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "J": "Inertia of everything that stops, referred to the brake disc.",
      "n": "Speed of the disc when braking starts.",
      "ts": "Time within which the load must stop.",
      "TL": "Load torque at the disc (friction or gravity).",
      "dir": "Whether the load helps the brake or drives through it.",
      "ro": "Outer radius of the pad contact.",
      "ri": "Inner radius of the pad contact.",
      "basis": "Uniform wear (the usual design case) or uniform pressure (new pads).",
      "mu": "Friction coefficient of the pad material.",
      "faces": "Number of friction faces (2 for a single disc with a caliper on both sides).",
      "Apad": "Contact area of the pad on one face.",
      "pMax": "Largest pad pressure for the lining (your value from the maker).",
      "Fmax": "Clamp force the caliper can apply.",
      "md": "Mass of the disc that takes up the heat.",
      "c": "Specific heat of the disc (about 0.46 steel, 0.5 cast iron).",
      "dTmax": "Largest temperature rise you accept in one stop."
    },
    "outputs": [
      "Braking torque and clamp force",
      "Pad pressure",
      "Energy, disc temperature rise and stopping angle"
    ],
    "method": [
      "ω = 2π n ÷ 60; brake torque T_b = J ω ÷ t_s − T_L (load helps) or + T_L (load drives through).",
      "Effective radius r_e = (r_o + r_i) ÷ 2 (uniform wear) or 2(r_o³ − r_i³) ÷ [3(r_o² − r_i²)] (uniform pressure).",
      "Clamp force F = T_b ÷ (μ r_e × faces); pad pressure = F ÷ pad area.",
      "Energy per stop = T_b ω t_s ÷ 2; disc temperature rise = energy ÷ (m c).",
      "Example: stopping 2 kg·m² from 1000 rpm in 2 s needs 104.72 N·m and 1,496 N of clamp; the disc warms 4.7679 K."
    ],
    "limitations": [
      "All the heat is taken by the disc mass; pads and hub take some, cooling runs between stops.",
      "Constant friction coefficient; it falls as the lining heats (fade).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Repeated stops add up: check the cooling time between stops as well as the single-stop rise."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2455–2459. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cover-plate-design": {
    "purpose": "Design of a flat circular plate or end cover under uniform pressure, with the edge clamped or simply supported: the thickness needed for the allowable bending stress and the thickness needed for the allowable centre deflection, the governing thickness, the stress and deflection at the thickness chosen (as the circular plate tool), and the total pressure force the cover passes to its bolts.",
    "uses": [
      "Size a flat end cover for a tank, cylinder or housing",
      "Check a blanking plate for a test pressure",
      "Compare clamped and simply supported edges"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Fabrication supervisors"
    ],
    "inputs": {
      "p": "Uniform pressure on the cover (design or test pressure).",
      "a": "Radius of the unsupported area (to the bolt circle or gasket for a simply supported cover, to the weld for a clamped one).",
      "edge": "How the edge is held.",
      "E": "Elastic modulus of the plate.",
      "nu": "Poisson’s ratio of the plate.",
      "allow": "Allowable bending stress (your design value).",
      "dMax": "Largest deflection at the centre you accept (for sealing or fit).",
      "t": "Thickness you intend to use, before corrosion allowance.",
      "ca": "Corrosion allowance added to the thickness needed."
    },
    "outputs": [
      "Thickness for stress and for deflection",
      "Stress and deflection at the thickness chosen",
      "Pressure force on the bolts"
    ],
    "method": [
      "Stress: clamped σ = 3 p a² ÷ (4t²) at the edge; simply supported σ = 3(3 + ν) p a² ÷ (8t²) at the centre; so t = a √(k p ÷ σ_a).",
      "Deflection: clamped w = p a⁴ ÷ (64 D); simply supported w = (5 + ν) p a⁴ ÷ [64(1 + ν) D], with D = E t³ ÷ [12(1 − ν²)]; solve for t.",
      "Thickness needed = the larger of the two plus corrosion allowance; end force = p π a².",
      "Example: 1 MPa on a 100 mm radius needs 9.4843 mm (stress 6.8465 mm, deflection 9.4843 mm)."
    ],
    "limitations": [
      "Thin-plate theory: deflection should stay below about half the thickness.",
      "Pressure vessel covers must follow the applicable code formula.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A simply supported cover is much more stressed than a clamped one: clamping the edge is worth up to 1.6× in stress."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 288–290. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-power-unit-sizing": {
    "purpose": "Sizing of a hydraulic power unit: pump displacement for the flow at the drive speed and volumetric efficiency, hydraulic power, shaft power with volumetric and mechanical efficiencies (as the hydraulic power tool with the overall efficiency), drive torque, reservoir volume from your multiple of pump flow, heat from the share of power lost and the duty, natural heat dissipation from the reservoir surface, and the cooler capacity still needed.",
    "uses": [
      "Size a power pack for a press or machine",
      "Check whether a reservoir needs a cooler",
      "Choose a motor for a pump at a pressure"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Q": "Flow the circuit needs from the pump.",
      "p": "Highest working pressure.",
      "n": "Speed of the electric motor driving the pump.",
      "etaV": "Volumetric efficiency of the pump.",
      "etaM": "Mechanical-hydraulic efficiency of the pump.",
      "Pmot": "Rated power of the motor considered.",
      "mult": "Reservoir volume as a multiple of pump flow per minute (your design rule; often 3–5 for industrial units, less for mobile).",
      "loss": "Share of the input power that ends up as heat (throttling, relief and leakage; your estimate for the circuit).",
      "duty": "Share of time the unit runs at the working pressure.",
      "k": "Heat transfer coefficient from the reservoir walls to air (about 10–15 still air, more with a fan).",
      "dT": "Oil temperature rise above ambient you allow."
    },
    "outputs": [
      "Pump displacement and drive torque",
      "Hydraulic and shaft power against the motor",
      "Reservoir, heat load and cooler capacity"
    ],
    "method": [
      "Displacement V_g = Q × 1000 ÷ (n η_v) cm³/rev; drive torque = V_g p ÷ (20π η_m) N·m.",
      "Hydraulic power = p Q ÷ 600 kW; shaft power = hydraulic ÷ (η_v η_m) (as the hydraulic power tool).",
      "Reservoir = multiple × Q; surface ≈ 6.5 V^(2/3) m² (V in m³, a near-cubic tank); dissipation = k A ΔT.",
      "Heat = shaft power × loss share × duty; cooler = heat − dissipation (if positive).",
      "Example: 40 L/min at 160 bar needs a 29.985 cm³/rev pump and 12.882 kW; about 1.041 kW of cooling is still needed."
    ],
    "limitations": [
      "Heat share is an estimate; throttling circuits turn most of the power into heat.",
      "Reservoir surface uses a near-cubic tank; long, flat tanks dissipate more.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A pressure-compensated or load-sensing pump can cut the heat share sharply compared with a fixed pump on relief."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3421–3425, 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "linear-guide-selection": {
    "purpose": "Selection check of a profile-rail linear guide with four carriages on two rails: the static load on each carriage from a load offset along and across the rails, the extra load on the leading and trailing carriages from acceleration at the load’s height, the cubic mean load over constant-speed and accelerating travel, nominal life in kilometres on the 50 km basis with a load factor, life in hours from stroke and cycle rate, and the static safety factor.",
    "uses": [
      "Choose a linear guide size for a gantry or slide",
      "Check life when the load is off-centre",
      "See how acceleration loads the carriages"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "mass": "Mass carried by the four carriages.",
      "L0": "Distance between the two carriages on each rail.",
      "W0": "Distance between the two rails.",
      "x": "Distance of the load’s centre of mass from the carriage pattern centre, along the rails.",
      "y": "Distance of the load’s centre of mass from the centre, across the rails.",
      "h": "Height of the load’s centre of mass above the carriage mounting faces.",
      "a": "Acceleration and deceleration of the axis.",
      "acc": "Share of each stroke spent accelerating or decelerating.",
      "C": "Dynamic load rating of one carriage on the 50 km basis (from the maker).",
      "C0": "Static load rating of one carriage (from the maker).",
      "fw": "Load factor for shock and vibration (about 1.0–1.5 smooth, 1.5–2 with shock).",
      "stroke": "Length of the stroke.",
      "cpm": "Number of out-and-back cycles per minute.",
      "req": "Life the machine needs.",
      "fs": "Least static safety factor you require."
    },
    "outputs": [
      "Load on each carriage at constant speed",
      "Peak load during acceleration and the mean load",
      "Life in km and hours, static safety factor"
    ],
    "method": [
      "Carriage at (±L₀/2, ±W₀/2): P = W ÷ 4 ± W x ÷ (2L₀) ± W y ÷ (2W₀) for weight W = m g.",
      "Acceleration adds ± m a h ÷ (2L₀) to the leading and trailing carriages.",
      "Mean load P_m = ³√(s P_acc³ + (1 − s) P_run³) for the most loaded carriage, s = share accelerating.",
      "Life L = 50 km × [C ÷ (f_w P_m)]³; hours = L ÷ (2 × stroke × cycles per minute × 60); static factor = C₀ ÷ P_acc.",
      "Example: the worst carriage carries 388.18 N running and 471.51 N accelerating; life is about 45,549 h."
    ],
    "limitations": [
      "Rigid table and equal carriage stiffness; real load sharing depends on mounting accuracy.",
      "Lift-off and side loads on the carriages are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Centring the load and spreading the carriages cut the worst carriage load the most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2365–2416. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-cylinder-structure": {
    "purpose": "Structural check of a hydraulic cylinder: barrel stresses by the thick-wall (Lamé) equations with closed ends and the von Mises stress at the bore (as the pressure cylinder tool), the least wall for your safety factor, the bore expansion under pressure (which affects the piston seal), the flat end cap thickness as a clamped plate (as the circular plate tool), the push force, and buckling of the fully extended rod by Euler or Johnson (as the column buckling tool).",
    "uses": [
      "Design a custom hydraulic cylinder",
      "Check a cylinder for a higher pressure",
      "Check rod buckling for a longer stroke"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Design engineers"
    ],
    "inputs": {
      "bore": "Bore of the barrel.",
      "t": "Wall thickness of the barrel.",
      "p": "Highest working pressure.",
      "Sy": "Yield strength of the barrel tube.",
      "SFb": "Safety factor against yield you require for the barrel.",
      "E": "Elastic modulus of the barrel and rod steel.",
      "nu": "Poisson’s ratio.",
      "tc": "Thickness of the flat end cap (treated as clamped at the bore).",
      "sc": "Allowable bending stress of the end cap (your design value).",
      "rod": "Diameter of the piston rod.",
      "Lb": "Length from the cylinder mounting point to the rod end with the rod fully extended.",
      "K": "Effective length factor for the mounting (1 for pivoted at both ends; 2 for a fixed body with a free rod end; follow the cylinder maker’s mounting factors).",
      "SyR": "Yield strength of the rod.",
      "SFr": "Safety factor against buckling you require for the rod."
    },
    "outputs": [
      "Barrel stresses, safety factor, least wall and bore expansion",
      "End cap thickness needed",
      "Push force and rod buckling safety factor"
    ],
    "method": [
      "Lamé at the bore: σ_θ = p (r_o² + r_i²) ÷ (r_o² − r_i²), σ_r = −p, σ_z = p r_i² ÷ (r_o² − r_i²) (closed ends); von Mises from the three (as the pressure cylinder tool); least wall found by bisection.",
      "Bore expansion Δd = 2 r_i [σ_θ − ν(σ_r + σ_z)] ÷ E.",
      "End cap (clamped plate) t = a √(0.75 p ÷ σ_a) with a = bore ÷ 2 (as the circular plate tool).",
      "Push force F = p π D² ÷ 4; rod buckling by Euler or Johnson with length K L_b (as the column buckling tool).",
      "Example: at 160 bar the barrel has a factor of 3.9142, the bore grows 32.085 µm, and the rod’s buckling factor is 8.3959."
    ],
    "limitations": [
      "Rod buckling uses a concentric load; side loads and mounting misalignment lower it.",
      "Welds, ports and thread roots need their own checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Rod buckling often limits long-stroke cylinders before pressure does: a larger rod or a better mounting style helps most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 290–294, 281–288, 3421–3425. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
