// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook52).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "pusher-move-check": {
    "purpose": "Check of a pusher, transfer or shuttle moving a part over a stroke in a set time with a symmetric accelerate–decelerate (triangular) profile: acceleration, peak speed and the distance covered at peak speed (as the uniformly accelerated motion tool), the force to accelerate the part against sliding friction and the braking force, peak power, and the average impact force if the part is instead stopped at full speed by a hard stop in the stop time (as the impulse and momentum tool), against the actuator force and the stop’s allowable load.",
    "uses": [
      "Size an actuator for a pusher or shuttle",
      "Check what happens if a part overruns into a stop",
      "Choose a move time for a transfer"
    ],
    "users": [
      "Automation engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Mass being moved, including the slide or carriage.",
      "s": "Length of the move.",
      "t": "Time for the whole move, start to stop.",
      "mu": "Friction coefficient between the part and its guide or table.",
      "ts": "Time over which a hard stop brings the part from full speed to rest (compression of the stop).",
      "Fact": "Force the cylinder or drive can push with.",
      "Fstop": "Largest force the end stop and its mounting may take."
    },
    "outputs": [
      "Acceleration and peak speed",
      "Pushing force, braking force and power",
      "Impact force at a hard stop"
    ],
    "method": [
      "Triangular profile: a = 4s ÷ t², peak speed = 2s ÷ t, reached at half the time and half the stroke (as the uniformly accelerated motion tool).",
      "Pushing force = m (a + μ g); braking force = m (a − μ g); peak power = pushing force × peak speed.",
      "Hard-stop force = m × peak speed ÷ stop time (as the impulse and momentum tool).",
      "Example: 3.3333 m/s² to 1 m/s needs 125.51 N; hitting a hard stop at full speed would give 2,000 N."
    ],
    "limitations": [
      "Rigid part and slide; compliance and cushioning change the forces.",
      "Triangular profile; a trapezoidal profile with a cruise phase needs higher acceleration for the same time.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the move time quadruples the acceleration force and doubles the impact speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 175–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lid-counterbalance-spring": {
    "purpose": "Check of a hinged lid, hatch or guard balanced by torsion springs at the hinge: the lid’s weight torque as it opens, each spring’s rate from its wire, coil and turns (as the helical torsion spring tool), the spring torque from the wind-up at the closed position, the out-of-balance torque over the whole opening and the largest force at the handle, whether the lid stays open and shut, and the spring stress at full wind-up against your allowable.",
    "uses": [
      "Balance a machine guard or hatch",
      "Check handle force on a heavy lid",
      "Choose torsion springs for a hinge"
    ],
    "users": [
      "Machine designers",
      "Product designers",
      "Design engineers"
    ],
    "inputs": {
      "mass": "Mass of the lid.",
      "r": "Distance from the hinge axis to the lid’s centre of gravity, with the lid closed and horizontal.",
      "open": "Angle the lid opens to from horizontal.",
      "nS": "Number of identical springs sharing the load.",
      "d": "Wire diameter of each spring.",
      "D": "Mean coil diameter.",
      "Nb": "Number of body turns.",
      "E": "Elastic modulus of the spring wire.",
      "th0": "Angle the springs are wound up when the lid is closed (they unwind as it opens).",
      "allow": "Allowable bending stress of the spring wire.",
      "handle": "Distance from the hinge to the handle.",
      "Fmax": "Largest force you accept at the handle anywhere in the swing."
    },
    "outputs": [
      "Spring rate and torque",
      "Out-of-balance torque and handle force",
      "Spring stress at full wind-up"
    ],
    "method": [
      "Spring rate k = E d⁴ ÷ (64 D N_b) per radian; stress = K_i 32 M ÷ π d³ with K_i = (4C² − C − 1) ÷ [4C (C − 1)] (as the helical torsion spring tool).",
      "Lid torque = m g r cos θ; spring torque = n k (θ₀ − θ) at opening angle θ.",
      "Out-of-balance torque scanned over the opening; handle force = largest out-of-balance ÷ handle distance.",
      "Example: each spring has 7,896.4 N·mm/rad; the worst handle force is 9.9979 N at 40°; spring stress 1,143.8 MPa."
    ],
    "limitations": [
      "Lid centre of gravity on the line through the hinge when closed; offsets change the torque curve.",
      "Friction in the hinge ignored; it helps hold positions.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A linear spring cannot match the cosine weight curve exactly: balance near the middle of the swing to keep handle forces low at both ends."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 333–343. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "triaxial-stress-check": {
    "purpose": "Check of a general three-dimensional stress state: principal stresses from the stress invariants, maximum shear and von Mises stress (as the three-dimensional principal stress tool), the safety factor against yield by von Mises and by Tresca, shear and bulk moduli from E and Poisson’s ratio (as the elastic constants tool), the principal strains by Hooke’s law and the volume change, against your required factor.",
    "uses": [
      "Check a point in a thick part, fit or pressure component",
      "Compare von Mises and Tresca margins",
      "Convert a stress state to strains for a gauge check"
    ],
    "users": [
      "Stress engineers",
      "Design engineers",
      "Students"
    ],
    "inputs": {
      "sx": "Normal stress in x (tension positive).",
      "sy": "Normal stress in y.",
      "sz": "Normal stress in z.",
      "txy": "Shear stress in the xy plane.",
      "tyz": "Shear stress in the yz plane.",
      "tzx": "Shear stress in the zx plane.",
      "E": "Elastic modulus.",
      "nu": "Poisson’s ratio.",
      "Sy": "Yield strength in tension.",
      "req": "Safety factor you need against yield."
    },
    "outputs": [
      "Principal stresses, maximum shear and von Mises stress",
      "Safety factors by von Mises and Tresca",
      "Principal strains, volume change, G and K"
    ],
    "method": [
      "Principal stresses are the roots of σ³ − I₁σ² + I₂σ − I₃ = 0; von Mises = √{½[(σ₁ − σ₂)² + (σ₂ − σ₃)² + (σ₃ − σ₁)²]} (as the three-dimensional principal stress tool).",
      "Factor by von Mises = S_y ÷ σ_vm; by Tresca = S_y ÷ (σ₁ − σ₃).",
      "G = E ÷ 2(1 + ν); K = E ÷ 3(1 − 2ν) (as the elastic constants tool); ε₁ = [σ₁ − ν(σ₂ + σ₃)] ÷ E and so on; volume change = (1 − 2ν) I₁ ÷ E.",
      "Example: principal stresses 94.711, 21.367 and -46.078 MPa; von Mises 121.96 MPa gives a factor of 2.8697 (Tresca 2.486)."
    ],
    "limitations": [
      "Isotropic, linear-elastic material.",
      "Static stress; cyclic states need a fatigue check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tresca is always the more conservative of the two; the difference is largest in pure shear."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218, 369–380. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "machine-noise-acceptance": {
    "purpose": "Acceptance check of a machine against a noise limit: the machine’s own level from the total reading and the background with it stopped (as the machinery noise tool, machine mode), the validity of the test from the difference between the readings, the level corrected to the distance in the specification and to the operator’s position by the inverse-square law (as the machinery noise tool, distance mode), and the comparison with the limit.",
    "uses": [
      "Accept a new machine against a noise specification",
      "Check a measurement made in a noisy shop",
      "Estimate the level at the operator position"
    ],
    "users": [
      "Safety officers",
      "Maintenance engineers",
      "Project engineers"
    ],
    "inputs": {
      "T": "Sound level with the machine running, at the measurement point.",
      "B": "Sound level at the same point with the machine stopped.",
      "r1": "Distance from the machine to the measurement point.",
      "rS": "Distance at which the specification states its limit.",
      "rOp": "Distance from the machine to where the operator works.",
      "limit": "Highest machine level allowed at the specification distance.",
      "minDiff": "Least difference between running and background readings for the result to be trusted (your test standard)."
    },
    "outputs": [
      "Machine level from the two readings",
      "Level at the specification distance and the operator",
      "Validity and limit check"
    ],
    "method": [
      "Machine level L = 10 log(10^(T/10) − 10^(B/10)) (as the machinery noise tool, machine mode).",
      "Level at distance r = L − 20 log(r ÷ r₁) (as the machinery noise tool, distance mode).",
      "Valid if T − B is at least the least difference; meets the limit if the level at the specification distance is at or below it.",
      "Example: the machine alone is 87.251 dB; at 1 m it is 87.251 dB against 90 dB; the operator hears about 77.708 dB."
    ],
    "limitations": [
      "Steady noise, the same frequency weighting for both readings; tonal or impulsive noise needs more.",
      "Spreading as from a point source in open space; reflections in a room make far levels higher.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the readings differ by less than about 3 dB the machine level cannot be separated reliably: reduce the background and repeat."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3455–3456. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "melt-charge-blend": {
    "purpose": "Blend of two charge materials (two scrap grades, a base metal and a master alloy) to reach a target content of an element by alligation (as the mixture blending tool), the masses of each for the batch with a melt loss allowance for the element, and the charge cost per kilogram as a weighted average (as the mixture value tool), checked against your cost limit.",
    "uses": [
      "Make up a furnace charge from two grades",
      "Dilute a master alloy to a target content",
      "Compare charge costs for a target chemistry"
    ],
    "users": [
      "Foundry metallurgists",
      "Furnace operators",
      "Buyers"
    ],
    "inputs": {
      "cA": "Content of the element in material A.",
      "cB": "Content of the element in material B.",
      "cT": "Content wanted in the poured metal.",
      "loss": "Share of the element lost by oxidation in melting (the charge aims higher to make up for it).",
      "batch": "Total mass of the charge.",
      "pA": "Price of material A.",
      "pB": "Price of material B.",
      "maxCost": "Highest average charge cost you accept."
    },
    "outputs": [
      "Charge content aimed for and shares of A and B",
      "Masses for the batch",
      "Charge cost per kilogram"
    ],
    "method": [
      "Charge aim = target ÷ (1 − loss).",
      "Share of A = (c_B − aim) ÷ (c_B − c_A) by alligation; masses = share × batch (as the mixture blending tool).",
      "Cost per kilogram = Σ mass × price ÷ batch (as the mixture value tool).",
      "Example: charge 300 kg of A and 200 kg of B for 9%; the charge costs 2.4 $/kg."
    ],
    "limitations": [
      "Linear mixing of the element; other elements must be checked the same way.",
      "Single melt loss figure; actual loss varies with temperature and time.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the target is outside the two contents no blend of these two reaches it: add a third material."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 384. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "angle-ring-cut-plan": {
    "purpose": "Cutting plan for rolled stiffening or flange rings of angle or bar fitted inside or outside a shell: cut length from the shell diameter corrected to the section’s neutral axis (as the length of angle bent to a ring tool), joints per ring when one ring needs more than one stock length, stock bars for the quantity with saw kerf, waste, mass of each ring and the material cost, with the waste checked against your limit.",
    "uses": [
      "Order angle for tank or duct stiffening rings",
      "Cut blanks for rolled flanges",
      "Estimate joints and waste for a ring job"
    ],
    "users": [
      "Boilermakers",
      "Fabrication supervisors",
      "Estimators"
    ],
    "inputs": {
      "mode": "Whether the correction uses the neutral-axis distance or a length constant (as the ring length tool).",
      "place": "Whether the ring sits inside or outside the shell.",
      "D": "Shell diameter at the back of the angle or bar.",
      "x": "Distance from the back of the section to its neutral axis.",
      "k": "Length constant from your section data.",
      "qty": "Number of rings.",
      "stock": "Length of the stock bars.",
      "kerf": "Material lost per cut, including end trim.",
      "area": "Cross-section area of the angle or bar.",
      "rho": "Density of the material.",
      "price": "Price of the material.",
      "maxWaste": "Largest share of bought length you accept as waste."
    },
    "outputs": [
      "Cut length and neutral diameter",
      "Joints per ring, stock bars and waste",
      "Ring mass and cost"
    ],
    "method": [
      "Cut length = π D ∓ 2π x (or ∓ the length constant), minus for a ring inside the shell (as the length of angle bent to a ring tool).",
      "Joints per ring = 1 if one bar covers it, otherwise ⌈length ÷ stock⌉; total length = rings × (length + joints × kerf); bars = ⌈total ÷ stock⌉.",
      "Waste = 1 − rings × length ÷ (bars × stock); mass = length × area × density.",
      "Example: cut 19,010 mm per ring with 4 joint(s); 13 bars of 6 m, 2.514% waste; each ring 134.3 kg."
    ],
    "limitations": [
      "Cut length to the neutral axis; rolling springback and joint preparation need trial allowances.",
      "Waste assumes offcuts are not reused.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Longer stock bars cut the number of joints; check what lengths the mill supplies."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2593. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "two-span-stringer-check": {
    "purpose": "Check of a stringer, rail or pipe-rack beam continuous over two spans with a uniform load plus its own weight: support reactions, the negative moment over the middle support, the span moments, the bending stress and the span deflections (as the continuous beam over two spans tool), against your allowable stress, deflection limit as a fraction of span, and the capacity of each support.",
    "uses": [
      "Check a conveyor stringer or rail over three supports",
      "Size a pipe-rack beam",
      "Find the load on a middle support"
    ],
    "users": [
      "Structural designers",
      "Design engineers",
      "Fabrication engineers"
    ],
    "inputs": {
      "L1": "Length of the first span.",
      "L2": "Length of the second span.",
      "w": "Uniform load on the beam (both spans).",
      "self": "Mass of the beam per metre (added to the load).",
      "E": "Elastic modulus.",
      "I": "Second moment of area of the beam about its bending axis.",
      "c": "Distance from the neutral axis to the extreme fibre.",
      "allow": "Allowable bending stress.",
      "dRatio": "Deflection limit as span divided by this number.",
      "Rmax": "Load each support, bracket or column can take."
    },
    "outputs": [
      "Support reactions",
      "Moments and bending stress",
      "Span deflections against the limit"
    ],
    "method": [
      "Total load per metre = applied + mass × g on both spans.",
      "Middle-support moment from the three-moment equation; reactions, span moments and deflections by superposition (as the continuous beam over two spans tool).",
      "Stress = largest moment × c ÷ I; deflection limit = span ÷ ratio.",
      "Example: the middle support carries 8.0516 kN; the beam is stressed to 15.097 MPa and deflects 0.58871 mm."
    ],
    "limitations": [
      "Prismatic beam on rigid supports at the same level; support settlement changes the moments.",
      "Uniform load on both spans; patterned live loads can raise span moments.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The middle support of equal spans takes about 1¼ times the load of one span: check it first."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 264–267. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "inch-spur-gear-check": {
    "purpose": "Check of a spur gear pair made to inch diametral-pitch proportions: pitch and outside diameters and centre distance for the tooth system (as the spur gear dimensions by diametral pitch tool), the ratio and gear speed, pinion torque and tangential force from the horsepower, and the Lewis bending stress with the velocity factor for the way the teeth are made (as the Lewis bending stress tool, worked in metric with module = 25.4 ÷ P), against your allowable.",
    "uses": [
      "Check a replacement inch gear pair",
      "Rate an existing DP gear set for a new motor",
      "Work out blank sizes for inch gears"
    ],
    "users": [
      "Maintenance engineers",
      "Gear cutters",
      "Design engineers"
    ],
    "inputs": {
      "P": "Diametral pitch (teeth per inch of pitch diameter).",
      "n1": "Teeth on the pinion.",
      "n2": "Teeth on the gear.",
      "system": "Tooth system of the pair.",
      "hp": "Power transmitted in horsepower.",
      "rpm": "Speed of the pinion.",
      "face": "Face width in mesh, in inches.",
      "Y": "Lewis form factor for the pinion tooth count and system (from your gear data).",
      "make": "How the teeth are made (sets the velocity factor).",
      "allow": "Allowable bending stress of the pinion material."
    },
    "outputs": [
      "Pitch and outside diameters and centre distance",
      "Ratio, torque and tangential force",
      "Pinion bending stress"
    ],
    "method": [
      "Pitch diameter = N ÷ P; outside diameter = pitch diameter + 2 × addendum; centre distance = (N₁ + N₂) ÷ 2P (as the spur gear dimensions by diametral pitch tool).",
      "Torque = hp × 745.7 ÷ ω; tangential force = 2T ÷ pitch diameter.",
      "Module = 25.4 ÷ P; σ = K_v F_t ÷ (b m Y) (as the Lewis bending stress tool).",
      "Example: pitch diameters 2 and 4.5 in, centre distance 3.25 in; pinion bending 67.981 MPa."
    ],
    "limitations": [
      "Lewis bending only; check surface durability separately.",
      "Standard addendum proportions for the tooth system.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the pinion is overstressed, a wider face or a coarser pitch (smaller P) lowers the bending stress."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160, 2249–2251. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "equipment-finance-plan": {
    "purpose": "Yearly cash-flow plan for a machine bought with a loan: the level loan payment from the purchase price, rate and term (capital recovery factor as the interest and equivalence factors tool), the interest and principal in each payment, the depreciation in each year by straight line, sum of the years’ digits or double declining balance (as the depreciation schedule tool), tax on the saving less depreciation and interest, and the after-tax cash flow each year and in total, checked for any year with a shortfall.",
    "uses": [
      "Test whether a financed machine pays its way each year",
      "Compare depreciation methods for cash flow",
      "Prepare a purchase case for a lender"
    ],
    "users": [
      "Business owners",
      "Finance managers",
      "Engineering managers"
    ],
    "inputs": {
      "cost": "Price of the machine, all borrowed.",
      "salvage": "Value at the end of the depreciation life.",
      "life": "Years over which the machine is depreciated.",
      "method": "Depreciation method.",
      "rate": "Annual interest rate of the loan.",
      "n": "Years over which the loan is repaid in equal annual payments.",
      "save": "Pre-tax saving or extra profit the machine brings each year.",
      "tax": "Income tax rate on profit."
    },
    "outputs": [
      "Loan payment and interest each year",
      "Depreciation and tax each year",
      "After-tax cash flow each year and in total"
    ],
    "method": [
      "Payment = cost × A/P with A/P = i(1 + i)ⁿ ÷ [(1 + i)ⁿ − 1] (as the interest and equivalence factors tool); interest = rate × opening balance.",
      "Depreciation by the chosen method (as the depreciation schedule tool).",
      "Tax = rate × (saving − depreciation − interest); cash flow = saving − payment − tax.",
      "Example: the loan costs 25,046 AUD a year; year 1 nets 3,754.4 AUD after tax and the worst year 1,910.9 AUD."
    ],
    "limitations": [
      "Annual payments and end-of-year cash flows; real loans are usually monthly.",
      "Tax treatment simplified: losses are assumed to offset other profit in the same year.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Accelerated depreciation helps early cash flow but leaves less to deduct later."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–140. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
