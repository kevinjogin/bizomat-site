// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook56).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "three-leg-sling-check": {
    "purpose": "Check of a three-leg bridle with the hook directly above the load’s centre of gravity and the lift points at any positions: leg lengths and angles from vertical from the point coordinates (as the cylindrical and spherical coordinates tool), and the tension in each leg by solving the three equilibrium equations of the hook (as the simultaneous equations tool), checked for slack legs, the leg working load limit and the largest angle from vertical.",
    "uses": [
      "Plan a lift with three uneven lift points",
      "Check which leg of a bridle carries most",
      "Find leg lengths for a level lift"
    ],
    "users": [
      "Riggers",
      "Lifting supervisors",
      "Lifting engineers"
    ],
    "inputs": {
      "W": "Weight of the load and everything below the hook.",
      "x1": "Horizontal x position of lift point 1 from the hook, which sits directly above the centre of gravity.",
      "y1": "Horizontal y position of lift point 1.",
      "z1": "Vertical position of lift point 1 (negative: below the hook).",
      "x2": "x of lift point 2.",
      "y2": "y of lift point 2.",
      "z2": "z of lift point 2.",
      "x3": "x of lift point 3.",
      "y3": "y of lift point 3.",
      "z3": "z of lift point 3.",
      "WLL": "Working load limit of each leg at the angle used.",
      "angMax": "Steepest leg angle from vertical your rigging rules allow."
    },
    "outputs": [
      "Leg lengths and angles from vertical",
      "Tension in each leg",
      "Checks for slack, overload and angle"
    ],
    "method": [
      "Leg length = distance from the hook to each lift point; angle from vertical from the spherical coordinates of the point (as the cylindrical and spherical coordinates tool).",
      "Hook equilibrium: Σ Tᵢ uᵢ = (0, 0, −W) with uᵢ the unit vector along each leg, solved as three simultaneous equations (as the simultaneous equations tool).",
      "A negative tension means that leg goes slack: the centre of gravity lies outside the triangle of lift points.",
      "Example: the legs carry 12.806, 12.667 and 12.667 kN at 38.66°, 37.864° and 37.864° from vertical."
    ],
    "limitations": [
      "Hook directly over the centre of gravity and rigid legs of the lengths given; stretch and hook shift redistribute load.",
      "Three legs only: a four-leg bridle is statically indeterminate and is usually rated on two legs.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The leg nearest the centre of gravity and the steepest legs carry most: shorten or re-position to even them out."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 43–45, 122–127, 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "instrument-calibration-check": {
    "purpose": "Calibration check of a pressure gauge, thermometer or other instrument at five points across its range: the error at each point and as a percentage of span against the accuracy class, the worst point, and the corrected (true) value of an in-service reading by linear interpolation between the two calibration points that bracket it (as the linear interpolation tool).",
    "uses": [
      "Record and judge a gauge calibration",
      "Correct readings from a gauge with a known error",
      "Decide whether to adjust or replace an instrument"
    ],
    "users": [
      "Instrument technicians",
      "Quality technicians",
      "Maintenance planners"
    ],
    "inputs": {
      "lo": "Lowest value of the instrument range.",
      "hi": "Highest value of the instrument range.",
      "cls": "Permitted error as a percentage of span.",
      "r1": "Reference (true) value at calibration point 1.",
      "m1": "Instrument reading at point 1.",
      "r2": "Reference value at point 2.",
      "m2": "Reading at point 2.",
      "r3": "Reference value at point 3.",
      "m3": "Reading at point 3.",
      "r4": "Reference value at point 4.",
      "m4": "Reading at point 4.",
      "r5": "Reference value at point 5.",
      "m5": "Reading at point 5.",
      "field": "A reading taken in use that you want corrected."
    },
    "outputs": [
      "Error at each point and as % of span",
      "Worst error against the class",
      "Corrected value of the service reading"
    ],
    "method": [
      "Error = reading − reference; % of span = error ÷ (high − low) × 100.",
      "Within class if every |error| ≤ class × span ÷ 100.",
      "Corrected value: find the true value for the reading by linear interpolation between the bracketing calibration points (as the linear interpolation tool, finding x for a given y).",
      "Example: the worst error is 0.4% of span against 1%; a reading of 6 corresponds to 5.9677."
    ],
    "limitations": [
      "Rising readings only; hysteresis needs falling readings as well.",
      "Readings must increase with the reference for interpolation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the errors are all one way, a zero or span adjustment usually brings the instrument back into class."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 121, 709–735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "npt-port-check": {
    "purpose": "Check of a tapped port for an NPT tapered pipe thread: pitch diameter at the small end, effective thread length and pitch diameter at that length (as the NPT pipe thread tool), the tapped depth needed for the effective length plus the tap chamfer threads, and the wall left between the thread major diameter and the boss outside diameter, against the depth and wall you have.",
    "uses": [
      "Check a tapped port in a manifold or casting",
      "Size a weld-on boss for a pipe thread",
      "Set the tapping depth on a drawing"
    ],
    "users": [
      "Design engineers",
      "Machinists",
      "Hydraulic technicians"
    ],
    "inputs": {
      "D": "Outside diameter of the pipe (e.g. 0.840 in for ½ NPT).",
      "n": "Threads per inch for the size.",
      "chamfer": "Incomplete threads at the tap end to allow beyond the effective length.",
      "depth": "Depth the boss allows you to tap.",
      "boss": "Outside diameter of the boss or the narrowest wall across the port.",
      "wallMin": "Least wall you accept around the thread for strength and leak tightness."
    },
    "outputs": [
      "Small-end pitch diameter, effective length, pitch diameter at L₂",
      "Tapped depth needed",
      "Boss wall left"
    ],
    "method": [
      "p = 1 ÷ n; E₀ = D − (0.05D + 1.1)p; L₂ = (0.8D + 6.8)p; E₂ = E₀ + L₂ ÷ 16; thread height 0.8p (as the NPT pipe thread tool).",
      "Depth needed = L₂ + chamfer threads × p.",
      "Major diameter near the face ≈ E₂ + 0.8p; wall = (boss − major) ÷ 2.",
      "Example: tap at least 17.185 mm deep (L₂ = 13.556 mm); the boss leaves 5.2186 mm of wall."
    ],
    "limitations": [
      "Formula dimensions; hand-tight engagement L₁ and tolerances come from the standard’s tables.",
      "Wall taken at the effective-length position, which is conservative near the face.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A short port lets the fitting bottom before it seals: tap deep enough for the full effective length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1952–1975. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME B1.20.1 Pipe Threads, General Purpose (Inch)"
    ]
  },
  "fit-at-temperature-check": {
    "purpose": "Check of an interference fit between a hub and shaft of different materials (aluminium on steel, bronze on steel): the interference at the operating temperature from the difference in expansion, contact pressure, holding torque and hub stress at assembly and at operating temperature (as the press and shrink fit tool), the torque against the required torque times the slip factor at the weaker condition, and the hub safety factor at the tighter one.",
    "uses": [
      "Check an aluminium pulley or hub pressed on a steel shaft",
      "Check a bronze bush in a steel housing hot",
      "Choose interference for a fit that runs hot or cold"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Nominal diameter of the fit.",
      "D": "Outside diameter of the hub.",
      "di": "Bore of a hollow shaft.",
      "delta0": "Diametral interference at the assembly temperature.",
      "L": "Length of the fit.",
      "mu": "Friction coefficient at the interface.",
      "Eh": "Elastic modulus of the hub.",
      "nuh": "Poisson’s ratio of the hub.",
      "ah": "Expansion coefficient of the hub.",
      "Sy": "Yield strength of the hub.",
      "Es": "Elastic modulus of the shaft.",
      "nus": "Poisson’s ratio of the shaft.",
      "as": "Expansion coefficient of the shaft.",
      "Ta": "Temperature at which the interference is measured.",
      "Top": "Temperature of the joint in service (both parts at the same temperature).",
      "Treq": "Torque the fit must transmit.",
      "SF": "Safety factor against slipping.",
      "req": "Safety factor you need on hub yield."
    },
    "outputs": [
      "Interference at operating temperature",
      "Pressure, torque and hub stress cold and hot",
      "Checks at the weaker and tighter conditions"
    ],
    "method": [
      "Interference hot = δ₀ + d (α_shaft − α_hub)(T_op − T_a).",
      "At each interference: p = δ ÷ {d [(k_h + ν_h) ÷ E_h + (k_s − ν_s) ÷ E_s]}; torque = μ p π d² L ÷ 2; hub von Mises stress (as the press and shrink fit tool).",
      "Grip checked at the smaller interference; hub stress at the larger.",
      "Example: the interference drops from 80 to 34 µm at 100 °C, so the fit holds 750.48 N·m hot."
    ],
    "limitations": [
      "Both parts at the same uniform temperature; transient heating of the hub alone loosens the fit further.",
      "Thick-cylinder theory; stress concentrations at the hub ends are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An aluminium hub on a steel shaft loosens as it warms: choose the interference for the hottest running condition."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 631–634, 375–376. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spring-fatigue-check": {
    "purpose": "Fatigue check of a helical compression spring cycling between two lengths: rate, loads and corrected shear stresses at the preload and working lengths and the solid length (as the compression spring tool), the alternating and mean shear stresses, and the Goodman, Soderberg and Gerber factors with first-cycle yield (as the Goodman fatigue tool, using the torsional endurance limit, ultimate and yield of the wire), against your required factor.",
    "uses": [
      "Check a valve, clutch or die spring for fatigue life",
      "Choose a working stroke that gives infinite life",
      "Compare spring wire grades"
    ],
    "users": [
      "Design engineers",
      "Spring designers",
      "Machine designers"
    ],
    "inputs": {
      "d": "Wire diameter.",
      "D": "Mean coil diameter.",
      "Na": "Active coils.",
      "ends": "End type of the spring.",
      "G": "Shear modulus of the wire.",
      "L0": "Length with no load.",
      "L1": "Length at the smallest working load (preload).",
      "L2": "Length at the largest working load.",
      "Ses": "Torsional endurance limit of the wire, corrected for surface finish and shot peening (from your spring data).",
      "Sus": "Torsional ultimate strength of the wire (often about 0.67 × tensile).",
      "Ssy": "Torsional yield strength of the wire.",
      "req": "Safety factor you need against fatigue."
    },
    "outputs": [
      "Loads and stresses at both lengths",
      "Alternating and mean stresses",
      "Goodman, Soderberg, Gerber and yield factors"
    ],
    "method": [
      "k = G d⁴ ÷ 8 D³ N_a; F = k (L₀ − L); τ = K 8 F D ÷ π d³ with the Wahl factor (as the compression spring tool).",
      "τ_a = (τ₂ − τ₁) ÷ 2; τ_m = (τ₂ + τ₁) ÷ 2.",
      "Goodman n = 1 ÷ (τ_a ÷ S_es + τ_m ÷ S_us); yield n = S_sy ÷ (τ_a + τ_m) (as the Goodman fatigue tool).",
      "Example: the spring cycles between 233.49 and 437.8 MPa; Goodman factor 1.5757."
    ],
    "limitations": [
      "Wahl factor applied to both mean and alternating stress (conservative).",
      "Infinite-life criteria; surge and resonance at high speed need a separate check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Shot peening raises the endurance limit far more than a stronger wire does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324, 200–211. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cam-return-spring-check": {
    "purpose": "Check of the spring that holds a cam follower against the cam: the peak deceleration of the follower for the motion law, rise, cam angle and speed (as the cam follower motion tool), the inertia force at that point, where in the rise it occurs, the spring force there from its preload and rate, the margin against jump, the speed at which the follower would leave the cam, and the largest spring force against the spring’s rating.",
    "uses": [
      "Size a cam follower return spring",
      "Find the highest safe cam speed",
      "Check a cam after a speed increase"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "law": "Motion law of the rise.",
      "h": "Total rise of the follower.",
      "beta": "Cam angle over which the rise happens.",
      "rpm": "Cam speed.",
      "mass": "Mass of the follower and everything moving with it, plus about a third of the spring.",
      "F0": "Force the spring exerts with the follower at the bottom of its travel.",
      "k": "Rate of the spring.",
      "margin": "How much the spring force must exceed the inertia force where deceleration peaks.",
      "Fmax": "Largest load the spring can take without overstress (at full lift)."
    },
    "outputs": [
      "Peak deceleration and inertia force",
      "Spring force where it peaks and the margin",
      "Jump speed and full-lift spring force"
    ],
    "method": [
      "Peak acceleration = c h ω² ÷ β² with c for the law (as the cam follower motion tool); the peak deceleration has the same size.",
      "It occurs at the end of the rise (harmonic), ¾ of the cam angle (cycloidal), from half the rise (parabolic) or at 0.789 of the angle (3-4-5); the spring force there = F₀ + k × lift at that point.",
      "Jump speed = speed × √(spring force ÷ inertia force); spring force at full lift = F₀ + k h.",
      "Example: the follower decelerates at 28.274 m/s², needing 42.412 N; the spring gives 114.55 N there, so the follower jumps at about 493.03 rpm."
    ],
    "limitations": [
      "Rigid follower and linkage; elasticity adds vibration that can cause jump earlier.",
      "Gravity and friction ignored; a vertical follower moving down gains help from gravity on the return.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Inertia force rises with the square of speed: a 40% speed increase roughly doubles the spring force needed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2284–2309, 304–320. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "angular-cutter-fluting-setup": {
    "purpose": "Set-up for milling the flutes of an angular milling cutter or taper reamer: the dividing-head setting angle from the number of teeth, the angle of the blank and the angle of the fluting cutter, with the intermediate angles (as the angular cutter fluting tool), and the simple indexing setting between teeth (as the simple indexing tool).",
    "uses": [
      "Make an angular cutter or taper reamer",
      "Set the dividing head for fluting a cone",
      "Check a tooth count can be indexed"
    ],
    "users": [
      "Toolmakers",
      "Machinists",
      "Toolroom staff"
    ],
    "inputs": {
      "Nt": "Number of teeth to cut on the cutter or reamer.",
      "B": "Angle of the blank’s conical face.",
      "C": "Included angle of the fluting cutter.",
      "ratio": "Worm ratio of the dividing head.",
      "plates": "Index plates you have."
    },
    "outputs": [
      "Setting angle and intermediate angles",
      "Angle between teeth",
      "Index setting"
    ],
    "method": [
      "tan D = cos(360° ÷ N) ÷ tan B; sin E = tan(360° ÷ N) ÷ tan C × sin D; setting angle A = D − E (as the angular cutter fluting tool).",
      "Angle between teeth = 360° ÷ N.",
      "Crank turns between teeth = ratio ÷ N (as the simple indexing tool).",
      "Example: set the head to 21.87° and index 4 turns and 8 holes in the 18-hole circle between teeth."
    ],
    "limitations": [
      "Handbook set-up for straight flutes on a conical blank.",
      "Simple indexing only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the land width on the first two teeth before cutting the rest."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 833–834, 2107–2121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gearbox-oil-temperature-check": {
    "purpose": "Check of a gearbox’s steady oil temperature and its lubricant: heat generated from the power and efficiency, the equilibrium oil temperature from the housing’s dissipation, the thermal power limit, cooler duty and oil flow if needed (as the gearbox heat balance tool), and the oil’s viscosity at the running temperature (the equilibrium temperature, or the limit if a cooler holds it there) from its viscosity at 40 °C and 100 °C (as the oil viscosity–temperature tool), against the least viscosity the gears need.",
    "uses": [
      "Check a gearbox for a higher power or hotter site",
      "Choose an oil grade for the running temperature",
      "Decide whether a gearbox needs a cooler"
    ],
    "users": [
      "Maintenance engineers",
      "Lubrication engineers",
      "Design engineers"
    ],
    "inputs": {
      "P": "Power going into the gearbox.",
      "eff": "Overall efficiency of the gearbox.",
      "A": "Outside surface area of the housing that sheds heat.",
      "h": "Combined convection and radiation coefficient of the housing (higher with a shaft fan).",
      "Tamb": "Air temperature around the gearbox.",
      "Tmax": "Highest oil temperature you allow.",
      "dT": "Temperature drop of oil through a cooler, if one is needed.",
      "cp": "Specific heat of the oil.",
      "rho": "Density of the oil.",
      "v40": "Kinematic viscosity of the oil at 40 °C (from the data sheet).",
      "v100": "Kinematic viscosity at 100 °C.",
      "nuMin": "Least viscosity the gear maker requires at the running temperature."
    },
    "outputs": [
      "Heat generated and equilibrium temperature",
      "Thermal limit, cooler duty and oil flow",
      "Viscosity at the running temperature"
    ],
    "method": [
      "Heat = P (1 − η); equilibrium temperature = ambient + heat ÷ (h A); thermal limit, cooler duty and flow (as the gearbox heat balance tool).",
      "Running temperature = equilibrium temperature, or the maximum if a cooler is fitted to hold it there.",
      "Viscosity at the running temperature by the ASTM D341 relation through the 40 °C and 100 °C values (as the oil viscosity–temperature tool).",
      "Example: the oil settles at 70 °C where the oil is 51.702 cSt against 50 cSt needed."
    ],
    "limitations": [
      "Steady state; start-up and intermittent duty run cooler.",
      "Single housing coefficient; sun, enclosures and nearby heat sources change it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A shaft-mounted fan can double the housing coefficient, often removing the need for a cooler."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3339–3340, 2430–2436, 2329–2337. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM D341 Viscosity–Temperature Charts for Liquid Petroleum Products"
    ]
  },
  "small-tool-substitution-check": {
    "purpose": "Check of a substitute small end mill or drill: the stiffness change from the new diameter and flute length, and the bending deflection of the new tool under the radial cutting force at its stick-out (as the small cutter stiffness tool), compared with the deflection your tolerance allows, with the force and feed (proportional to force) that keep the deflection within the limit.",
    "uses": [
      "Check a smaller replacement end mill",
      "Set a reduced feed for a long-reach tool",
      "Explain why a micro tool cut out of tolerance"
    ],
    "users": [
      "CNC programmers",
      "Machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D1": "Diameter of the tool the process was proven with.",
      "L1": "Flute length of that tool.",
      "D2": "Diameter of the substitute tool.",
      "L2": "Flute length of the substitute.",
      "Lo": "Stick-out of the substitute from the holder face.",
      "k": "Diameter of an equivalent solid round as a share of the tool diameter (fluted section).",
      "E": "Elastic modulus of the tool (carbide about 600 GPa).",
      "F": "Radial cutting force at the planned feed (from measurement or a force estimate).",
      "feed": "Feed per tooth planned for the substitute.",
      "dMax": "Largest tool deflection the part tolerance can absorb."
    },
    "outputs": [
      "Stiffness change from diameter and length",
      "Deflection of the new tool",
      "Force and feed for the deflection limit"
    ],
    "method": [
      "Stiffness change from diameter = (D₂ ÷ D₁)⁴; from flute length = (L₁ ÷ L₂)²; combined ratio (as the small cutter stiffness tool).",
      "Deflection = F L³ ÷ 3EI with I = π (k D₂)⁴ ÷ 64 at the stick-out (as the small cutter stiffness tool).",
      "Force for the limit = F × limit ÷ deflection; feed scaled in the same proportion (force taken as proportional to feed).",
      "Example: the new tool is 28.444% as stiff and deflects 3.6428 µm; the feed for 5 µm is 0.01 mm."
    ],
    "limitations": [
      "Cantilever deflection of the tool alone; holder and spindle compliance add to it.",
      "Force assumed proportional to feed; at very small feeds rubbing breaks this.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stick-out matters most: deflection grows with its cube, so the shortest holder pays back immediately."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1093–1094. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
