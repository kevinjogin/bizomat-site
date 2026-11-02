// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook77).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "countershaft-bearing-check": {
    "purpose": "Check of a countershaft with two spur gears: the tangential and radial tooth forces on each gear from the torque and pitch diameter (as the gear tooth forces tool), resolved into two planes from the angular position of each mesh, the bearing reactions in both planes and their resultants, the L10 rating life of each bearing (as the bearing L10 life tool) and its static safety factor (as the bearing static ratio tool), and the largest bending moment with the torque giving the combined stress in the shaft, against your life, safety factor and stress limits.",
    "uses": [
      "Check the bearings of an intermediate gearbox shaft",
      "See how the mesh positions change the bearing loads",
      "Check the shaft diameter against bending and torsion"
    ],
    "users": [
      "Machine designers",
      "Mechanical engineers",
      "Gearbox and maintenance engineers"
    ],
    "inputs": {
      "T": "Torque the shaft transmits from the driven gear to the driving gear, including any service factor you use.",
      "n": "Rotational speed of the countershaft.",
      "L": "Distance between the centres of the two bearings.",
      "phi": "Pressure angle of the gear teeth (20° is the usual standard).",
      "d1": "Pitch diameter of the gear that receives power from its mating gear.",
      "x1": "Distance of that gear's centre from bearing A along the shaft (negative or beyond the spacing for an overhung gear).",
      "th1": "Angle around the shaft, from a reference direction and measured in the direction of rotation, at which this gear meshes with its mating gear.",
      "d2": "Pitch diameter of the gear that delivers power to the next gear.",
      "x2": "Distance of that gear's centre from bearing A along the shaft.",
      "th2": "Angle around the shaft at which this gear meshes with its mating gear, measured the same way.",
      "btype": "Ball bearings use a life exponent of 3, roller bearings 10/3.",
      "C": "Basic dynamic load rating of each bearing, from the bearing maker's catalogue.",
      "C0": "Basic static load rating of each bearing, from the catalogue.",
      "Lreq": "Rating life the bearings must reach, from your design brief.",
      "s0req": "Least ratio of static rating to static load you require (from the bearing maker's guidance for the duty).",
      "ds": "Shaft diameter at the gear seats where the bending moment is largest.",
      "sA": "Allowable combined (von Mises) stress for the shaft material and duty."
    },
    "outputs": [
      "Tooth forces on each gear",
      "Bearing loads in each plane and resultant",
      "L10 life and static safety factor of each bearing",
      "Largest bending moment and combined shaft stress"
    ],
    "method": [
      "Tooth forces (as the gear tooth forces tool): F_t = 2T ÷ d, F_r = F_t tan φ.",
      "At mesh angle θ the radial force points to the shaft centre and the tangential force acts along the direction of rotation on the driven gear and against it on the driving gear; each force is resolved into two planes.",
      "Bearing reactions from moments about each bearing in each plane: R_B = −Σ F x ÷ L, R_A = −Σ F − R_B; resultant load √(R_y² + R_z²).",
      "L10 life (as the bearing L10 life tool) = (C ÷ P)^p × 10⁶ ÷ (60 n) h with p = 3 or 10/3; static factor C₀ ÷ P (as the bearing static ratio tool).",
      "Bending moment at each gear from the reactions and forces to its left, resultant of the two planes; combined stress √(σ² + 3τ²) with σ = 32M ÷ (π d³), τ = 16T ÷ (π d³).",
      "Example: the bearings carry 2,063.6 N and 3,308.7 N, giving L10 lives of 102,410 h and 24,848 h; the shaft sees 49.971 MPa combined."
    ],
    "limitations": [
      "Spur gears only, with the shaft simply supported on two bearings; helical axial forces, bearing preload and gear weight are not included.",
      "Steady torque; fatigue of the shaft and the effect of keyways or shoulders are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Where the two meshes sit around the shaft matters as much as the forces: meshes on opposite sides can add the tangential forces at one bearing, while meshes on the same side partly cancel them.",
      "Bearing life falls with the cube of the load, so the more heavily loaded bearing nearly always governs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160, 2404–2412, 257–277. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "carburizing-case-depth-plan": {
    "purpose": "Plan for gas or pack carburising: the total case depth needed for a finished effective case after grinding stock is removed and the effective case is converted to total case with your ratio, the time at temperature from the parabolic growth of case depth with the square root of time and the case depth factor for the temperature, the total furnace cycle with the heating, diffusion and quench time you enter, the cost per part for a furnace rate and load, and the total case as a share of the half-section against your limit.",
    "uses": [
      "Specify the carburising case depth for a part that is ground after hardening",
      "Estimate time at temperature and furnace cost",
      "Check that the case is not too deep for a thin section"
    ],
    "users": [
      "Heat treaters",
      "Mechanical and process engineers",
      "Purchasing and quality staff"
    ],
    "inputs": {
      "eff": "Effective case depth the drawing requires on the finished part, measured to the hardness the drawing specifies.",
      "stock": "Material removed on the diameter by grinding after heat treatment (half of it comes off each side).",
      "ratio": "Effective case depth as a share of the total case depth for this steel and process, from the heat treater's records.",
      "sect": "Thinnest wall or smallest diameter of the carburised section.",
      "shareMax": "Largest share of the half-section the total case may occupy before the core is too small, from your design practice.",
      "K": "Case depth factor: total case depth reached after one hour at the carburising temperature, from the heat treater for this steel, atmosphere and temperature.",
      "extra": "Time per cycle outside the carburising time itself: heating up, diffusion, cooling to the hardening temperature and quench.",
      "rate": "Cost of an hour of furnace time, including labour and atmosphere.",
      "parts": "Number of parts in one furnace load."
    },
    "outputs": [
      "Case removed by grinding and total case needed",
      "Time at temperature and total cycle",
      "Cost per part",
      "Case as a share of the half-section"
    ],
    "method": [
      "Case removed by grinding = stock ÷ 2; effective case before grinding = required + stock ÷ 2; total case = effective ÷ ratio.",
      "Case depth grows with the square root of time: d = K √t, so the time at temperature t = (d ÷ K)².",
      "Cycle = t + heating, diffusion and quench time; cost per part = cycle × rate ÷ parts per load.",
      "Case share = total case ÷ (section ÷ 2), against your limit.",
      "Example: 0.8 mm effective after grinding needs 1.3571 mm total case, 5.1162 h at temperature and a 8.1162 h cycle, A$5.749 a part."
    ],
    "limitations": [
      "The parabolic law with a constant factor is an approximation for a constant temperature and carbon potential; boost-diffuse cycles and alloy steels follow their own curves.",
      "Grinding is taken as removing stock evenly; distortion makes the removal uneven, so allow extra where it matters.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Because depth grows only with the square root of time, doubling the case takes four times as long; grinding stock is expensive in furnace time.",
      "A case that is too deep for the section leaves too little tough core and can make thin sections brittle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 467–470, 484–487. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "induction-hardening-plan": {
    "purpose": "Plan for induction surface hardening of a round bar: the electromagnetic reference (penetration) depth at the generator frequency from the steel's hot resistivity and relative permeability, its ratio to the case depth against your range, the frequency that would put the reference depth at the middle of that range, the bar diameter as a multiple of the reference depth, and the energy to heat the surface layer to the hardening temperature, with the power at the work and from the generator and the surface power density for the heating time you enter.",
    "uses": [
      "Check whether an induction generator's frequency suits a case depth",
      "Find the frequency for a new case depth",
      "Estimate the power for a heating time"
    ],
    "users": [
      "Heat treaters",
      "Process engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the round bar or shaft being hardened.",
      "Lh": "Length heated at once by the coil (for scanning, the length heated in the time entered).",
      "case": "Hardened case depth required, from the drawing.",
      "hf": "Depth that must reach the hardening temperature, as a multiple of the case depth, to allow for the transition below the case.",
      "f": "Output frequency of the induction generator.",
      "rho": "Electrical resistivity of the steel at the hardening temperature, which is several times its room-temperature value.",
      "mur": "Relative magnetic permeability of the steel while it is hot; it falls to 1 above the Curie point, where the hardening is done.",
      "rMin": "Least ratio of reference depth to case depth you accept for this work, from your practice or the equipment maker.",
      "rMax": "Largest ratio of reference depth to case depth you accept.",
      "dMin": "Least ratio of bar diameter to reference depth for efficient heating, from the equipment maker's guidance.",
      "T1": "Temperature the surface layer must reach for hardening.",
      "T0": "Temperature of the part before heating.",
      "cp": "Mean specific heat of the steel between the starting and hardening temperatures, from material data.",
      "dens": "Density of the steel.",
      "th": "Time the layer is heated for, from the process (often a few seconds).",
      "eff": "Share of the generator output that ends up as heat in the work after coil and transformer losses."
    },
    "outputs": [
      "Reference depth at the generator frequency and its ratio to the case",
      "Frequency for the middle of your ratio range",
      "Bar diameter as a multiple of the reference depth",
      "Energy for the heated layer, power at the work and from the generator, surface power density"
    ],
    "method": [
      "Reference depth δ = 503 √(ρ ÷ (μ_r f)) m, with ρ in Ω·m and f in Hz.",
      "Frequency for a target depth δ_t = ρ (503 ÷ δ_t)² ÷ μ_r, with δ_t at the middle of your ratio range times the case depth.",
      "Heated layer: an annulus of depth h = case × multiple; mass m = ρ_s π ÷ 4 (D² − (D − 2h)²) L; energy = m c_p ΔT.",
      "Power at the work = energy ÷ time; generator power = work power ÷ efficiency; power density = work power ÷ (π D L).",
      "Example: at 10 kHz the reference depth is 5.2787 mm, 2.6393 times the 2 mm case; about 30.96 kHz would suit it. Heating the layer in 4 s needs 51.62 kW from the generator."
    ],
    "limitations": [
      "The reference depth is an electromagnetic estimate for a uniform material; the hardened depth also depends on heating time, conduction into the core and the quench.",
      "Energy for the heated layer only; heat conducted into the core during heating and losses from the surface add to the real demand.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Higher frequencies concentrate the heat in a shallower layer, so frequency is chosen to suit the case depth and power to suit the heating time.",
      "Below the Curie point steel is magnetic and the reference depth is much smaller, which is why surface layers heat fastest early in the cycle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 487–489, 467–470. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
