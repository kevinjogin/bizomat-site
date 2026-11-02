// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook100).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "cutting-speed-table-adjustment": {
    "purpose": "The handbook’s method for adjusting the tabulated cutting speeds: V = Vopt × Ff × Fd for turning, drilling, reaming and full slot milling, V = VHSS × Ff × Fd for high-speed steel turning, V = Vopt × Ff × Fd × Far for face milling, and for end, side and slit milling with a partial radial depth the feed range fmax and fmin from the feed factors and the feed factor interpolated between Ff2 at fmin and Ff1 at fmax, with the ratios you need to read the tables, the spindle speed and the table feed rate. The table factors are entered by you.",
    "uses": [
      "Adjust a table cutting speed to your own feed and depth",
      "Interpolate the feed factor for a side or end milling cut",
      "Turn the adjusted speed into spindle speed and feed rate"
    ],
    "users": [
      "CNC machinists",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "op": "The operation and the form of the adjustment the handbook gives for it.",
      "fopt": "The optimum (first) feed of the feed and speed pair in the table, per revolution or per tooth.",
      "Vopt": "The optimum (lower) speed of the pair in the table, or the HSS speed.",
      "Vavg": "The average (higher) speed of the pair in the table.",
      "f": "The feed per revolution or per tooth you intend to use.",
      "Ff": "Feed factor read from the adjustment table at your feed ratio and speed ratio.",
      "Fd": "Depth of cut and lead angle factor read from the adjustment table.",
      "Far": "Radial depth of cut factor from the face milling table.",
      "kmax": "Maximum feed per tooth factor for your ar/D from Table 15c.",
      "kmin": "Minimum feed per tooth factor for your ar/D from Table 15c.",
      "Ff1": "Feed factor at the maximum feed for your ar/D and speed ratio.",
      "Ff2": "Feed factor at the minimum feed for your ar/D and speed ratio.",
      "D": "Diameter of the work in turning, or of the drill, reamer or cutter.",
      "z": "Number of teeth on the cutter; 1 for turning, drilling per revolution."
    },
    "outputs": [
      "Feed ratio and speed ratio for reading the tables",
      "Feed range and interpolated feed factor (side and slit milling)",
      "Adjusted cutting speed",
      "Spindle speed and feed rate"
    ],
    "method": [
      "Feed ratio = f ÷ fopt and speed ratio = Vavg ÷ Vopt locate Ff (and Fd) in the adjustment table; Vopt is always the lower of the two table speeds.",
      "Turning, drilling, reaming, full slot: V = Vopt × Ff × Fd. HSS turning: V = VHSS × Ff × Fd. Face milling: V = Vopt × Ff × Fd × Far. Slit milling fed into the work: V = Vopt × Ff × Far.",
      "End, side and slit milling with a partial radial depth: fmax = max factor × fopt, fmin = min factor × fopt; Ff = Ff2 + (f − fmin) ÷ (fmax − fmin) × (Ff1 − Ff2); Fd is read at f ÷ fmax; V = Vopt × Ff × Fd (slit and side milling: V = Vopt × Ff).",
      "Spindle speed n = 1000 V ÷ (π D); feed rate = f × z × n.",
      "Example: the adjusted speed is 200.57 m/min, 1,276.9 rpm."
    ],
    "limitations": [
      "The adjusted speeds are for the tool life the speed tables are based on (15 minutes for turning, 45 minutes for milling) unless you also apply a tool life factor.",
      "The factors come from the handbook adjustment tables for your ratios and are entered by you.",
      "Check the power and rigidity of the machine at the adjusted speed and feed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A feed below fmin rubs and wears the tool early; a feed above fmax risks breaking the edge.",
      "For side milling the depth factor is read at the feed ratio to fmax, not to fopt."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1025, 1034–1035, 1040–1042, 1055–1057. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grinding-force-and-power": {
    "purpose": "Grinding forces as the handbook works them: chip area = ECT × CEL, tangential force Fc = Kc × ECT × CEL with the specific grinding force Kc you enter (around 30 to 40 times the turning values), normal force FH = (FH ÷ FC) × Fc with the force ratio you enter (generally 2 to 4), and the wheel torque Fc × D ÷ 2 and power Fc × V ÷ 60,000, compared with the spindle power available.",
    "uses": [
      "Check the spindle power for a grinding cut",
      "Estimate the normal force on the work and fixture",
      "Compare grinding forces at different ECT"
    ],
    "users": [
      "Manufacturing engineers",
      "Grinding machinists",
      "Fixture designers"
    ],
    "inputs": {
      "ECT": "Equivalent chip thickness of the grinding cut.",
      "CEL": "Length of the cutting edge in contact, the width of cut.",
      "Kc": "Specific grinding force for the work material and ECT, from data or tests.",
      "ratio": "Ratio of the normal to the tangential grinding force, from data or tests.",
      "V": "Peripheral speed of the wheel.",
      "Dw": "Diameter of the grinding wheel.",
      "Pav": "Power available at the wheel spindle, if you want it checked."
    },
    "outputs": [
      "Chip area",
      "Tangential and normal grinding forces",
      "Wheel torque and power",
      "Whether the spindle power is enough"
    ],
    "method": [
      "Chip area = ECT × CEL.",
      "Tangential force Fc = Kc × chip area; normal force FH = (FH ÷ FC) × Fc.",
      "Torque = Fc × D ÷ 2; power = Fc × V ÷ 60,000 kW (V in m/min).",
      "Example: the tangential force is 255 N and the wheel needs 8.5 kW."
    ],
    "limitations": [
      "Kc and the force ratio depend on the work material, wheel, ECT and speed; enter values from data or tests.",
      "The power is at the wheel; allow for the drive losses of the machine.",
      "Forces rise as the wheel dulls; use values for a worn wheel when sizing the machine.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Kc for grinding is much higher than for turning because the ECT is very small and the grits cut with large negative rake.",
      "The normal force is the larger one and sets the deflection of the work and the spark-out time."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1203–1204. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grinding-economic-wheel-life": {
    "purpose": "The handbook’s economic wheel life for grinding: equivalent tooling-cost time TV = TRPL + 60 × CE ÷ HR minutes with CE the cost per wheel dressing (the wheel cost per dressing plus the cost of dressing) and HR the hourly rate, economic life TE = 3 × TV, the wheel speed on the Taylor line V × T^0.26 = C at that life, the specific metal removal rate SMRR = 1000 × ECT × V and the work speed Vw = SMRR ÷ (1000 × ar).",
    "uses": [
      "Set the wheel life for minimum grinding cost",
      "Find the wheel speed and work speed at the economic life",
      "See how dressing cost and rate change the economic life"
    ],
    "users": [
      "Manufacturing engineers",
      "Grinding machinists",
      "Process planners"
    ],
    "inputs": {
      "TRPL": "Time to change or dress the wheel each time it is worn.",
      "Cw": "Share of the wheel price used up in each dressing.",
      "Cd": "Cost of carrying out one dressing, such as the dresser wear.",
      "HR": "Hourly rate of the machine and operator.",
      "C": "Taylor constant for the work material group and ECT, from the grinding data tables or your calibration.",
      "ECT": "Equivalent chip thickness of the grinding cut.",
      "ar": "Radial depth of cut of the pass."
    },
    "outputs": [
      "Equivalent tooling-cost time TV",
      "Economic wheel life TE",
      "Wheel speed at the economic life",
      "Specific removal rate and work speed"
    ],
    "method": [
      "CE = wheel cost per dressing + cost per dressing; TV = TRPL + 60 × CE ÷ HR (minutes).",
      "Economic wheel life TE = 3 × TV.",
      "Taylor line V × T^0.26 = C, so V at TE = C ÷ TE^0.26.",
      "SMRR = 1000 × ECT × V (mm³/mm/min); work speed Vw = SMRR ÷ (1000 × ar) (m/min).",
      "Example: TV is 3.5 min, so the economic wheel life is 10.5 min at 2,544.9 m/min."
    ],
    "limitations": [
      "The simple rule TE = 3 TV is the handbook’s recommendation for minimum cost; the global optimum also depends on the ECT.",
      "Check that the wheel speed is within the maximum operating speed marked on the wheel.",
      "C must be for the same work material group, wheel and ECT.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "In conventional grinders TV is usually 2 to 5 minutes, giving economic wheel lives of 6 to 15 minutes, as the handbook notes.",
      "Automatic dressing after each stroke makes TV small and the economic life short."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1200, 1205, 1215. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-torque-thread-friction": {
    "purpose": "Tightening torque by the handbook’s Equations (21) to (24): T = PB [l ÷ 2π + d2 μ1 ÷ (2 cos α) + (d + b) μ2 ÷ 4] with the lead l, pitch diameter d2, thread half angle α, bearing face diameter b and the thread and bearing friction coefficients μ1 and μ2 you enter, the 60° thread forms T = PB [0.159 l + d (0.531 μ1 + 0.625 μ2)] and T = PB (0.159 l + 1.156 μ d), and the preload PB from a share of the tensile strength on the stress area of Equation (9) or entered directly.",
    "uses": [
      "Set a tightening torque when the thread and bearing friction differ",
      "See how much of the torque is lost in friction",
      "Check a torque figure against the simplified handbook forms"
    ],
    "users": [
      "Mechanical designers",
      "Maintenance fitters",
      "Assembly engineers"
    ],
    "inputs": {
      "d": "Nominal diameter of the bolt.",
      "P": "Pitch of the thread; for inch threads 25.4 ÷ TPI.",
      "starts": "Number of starts; the lead is starts × pitch.",
      "alpha": "Half the included thread angle; 30° for 60° threads.",
      "pre": "Whether the preload comes from the bolt strength or is entered directly.",
      "Sut": "Minimum tensile strength of the bolt grade.",
      "pct": "Share of the tensile strength the preload is to reach.",
      "PB": "Axial preload in the bolt, when entered directly.",
      "mu1": "Friction coefficient between the bolt and nut threads.",
      "mu2": "Friction coefficient under the turned nut or bolt head.",
      "b": "Outer diameter of the pressure face under the turned nut or head."
    },
    "outputs": [
      "Stress area and preload",
      "Torque by Equation (22) and its three parts",
      "Torque by the simplified Equations (23) and (24)",
      "Share of the torque that stretches the bolt"
    ],
    "method": [
      "Stress area As = π ÷ 4 × ((dp + dm) ÷ 2)² with dp = d − 0.6495P and dm = d − 1.2990P (Equation 9); PB = share × tensile strength × As.",
      "T1 = PB l ÷ 2π (stretching the bolt), T2 = PB d2 μ1 ÷ (2 cos α) (thread friction) with d2 = d − 0.6495P, T3 = PB (d + b) μ2 ÷ 4 (bearing friction); T = T1 + T2 + T3 (Equation 22).",
      "For 60° threads with d2 ≈ 0.92d and b ≈ 1.5d: T = PB [0.159 l + d (0.531 μ1 + 0.625 μ2)] (Equation 23); with μ1 = μ2 = μ: T = PB (0.159 l + 1.156 μ d) (Equation 24).",
      "Example: the preload of 52.074 kN needs 129.75 N·m by Equation (22)."
    ],
    "limitations": [
      "Friction coefficients vary widely with finish, plating and lubrication; measure or take them for your parts.",
      "The stress area of Equation (9) is for unified inch threads; metric stress areas differ slightly.",
      "Most of the torque is lost in friction, so small changes in friction change the preload a lot.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the two coefficients are equal, Equation (24) gives the same torque as Equation (23).",
      "A loose washer under the nut changes the bearing diameter b and the bearing friction."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1529–1534. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "power-thread-basic-sizes": {
    "purpose": "Basic dimensions of the alternative power transmission thread forms the handbook gives: square thread h = t = 0.5p, E = D − 0.5p, K = D − p; 10° modified square thread E = D − 0.5p, K = D − p, h = 0.5p, t = 0.5p, crest flat F = 0.4563p and root flat G = 0.4563p − 0.17C; 60° stub thread t = 0.5p, h = 0.433p, F = 0.25p, G = 0.227p, E = D − 0.433p, K = D − 0.866p with a clearance of at least 0.02p added to the depth; and the lead and lead angle for the number of starts.",
    "uses": [
      "Set the basic sizes for turning a square or modified square thread",
      "Grind a threading tool to the crest and root flats",
      "Find the lead angle of a multi-start power thread"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Machine designers"
    ],
    "inputs": {
      "form": "Which of the alternative power thread forms is cut.",
      "D": "Basic major diameter of the screw.",
      "p": "Pitch of the thread.",
      "starts": "Number of thread starts; the lead is starts × pitch.",
      "C": "Clearance between the root of the screw and the crest of the nut thread."
    },
    "outputs": [
      "Basic pitch and minor diameters",
      "Basic depth and depth with clearance",
      "Thread thickness and crest and root flats",
      "Lead and lead angle"
    ],
    "method": [
      "Square: h = 0.5p, t = 0.5p, E = D − 0.5p, K = D − p.",
      "10° modified square: E = D − 0.5p, K = D − p, h = 0.5p, t = 0.5p, F = 0.4563p, G = 0.4563p − 0.17C.",
      "60° stub: t = 0.5p, h = 0.433p, F = 0.25p, G = 0.227p, E = D − 0.433p, K = D − 0.866p; clearance at least 0.02p.",
      "Depth with clearance = h + C; lead = starts × p; lead angle = atan(lead ÷ π E).",
      "Example: the screw has a basic pitch diameter of 37 mm and a depth of 3.15 mm with clearance."
    ],
    "limitations": [
      "These are basic sizes; set allowances and tolerances for the fit you need.",
      "The nut groove of a square thread is made a little wider than half the pitch to give the screw clearance.",
      "Consult the cutting tool maker before specifying multiple thread milling cutters or ground taps for modified square threads of large lead angle.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The modified square thread is the practical equivalent of a square thread that can be produced economically.",
      "The square thread has largely been replaced by the Acme form."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1944. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
