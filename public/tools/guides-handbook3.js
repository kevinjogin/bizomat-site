// KEVOS® MAKEOS handbook tool guides. References are topic references; no protected tables or text are reproduced.
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bearing-l10-life": {
    "purpose": "Calculate the basic rating life of a rolling bearing from its catalogue dynamic load rating, the equivalent dynamic load and a constant speed.",
    "uses": [
      "Compare bearing sizes at the design stage",
      "Check whether a catalogue bearing is in a sensible life range",
      "Estimate how life changes with load or speed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "type": "Ball bearings use life exponent 3 and roller bearings 10/3, as in the basic rating life method.",
      "C": "Basic dynamic load rating from the bearing manufacturer’s catalogue for the exact bearing.",
      "P": "Equivalent dynamic load combining radial and axial loads with the manufacturer’s X and Y factors. Enter it in the same unit as C.",
      "rpm": "Inner-ring speed relative to the outer ring. Use a weighted average for a varying duty."
    },
    "outputs": [
      "Basic rating life L10 (million revolutions)",
      "Basic rating life L10h (hours)",
      "Load ratio C/P"
    ],
    "method": [
      "L10 (million revolutions) = (C / P)^p, where p = 3 for ball bearings and 10/3 for roller bearings.",
      "L10h (hours) = L10 × 10⁶ / (60 × speed in rpm).",
      "Example: a ball bearing with C = 30 kN, P = 10 kN at 1,000 rpm gives L10 = 3³ = 27 million revolutions and L10h = 27 × 10⁶ / 60,000 = 450 h."
    ],
    "limitations": [
      "Basic rating life only: the reliability factor and the lubrication, contamination and material life-modification factors used in modified rating life are not applied.",
      "Assumes constant load and speed, correct mounting and lubrication, and a bearing that fails only by rolling contact fatigue.",
      "No certification, bearing selection or warranty life is implied.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "L10 means 90% of a large group of identical bearings should reach or exceed this life; individual bearings can fail sooner.",
      "A result shorter than the machine’s required service life means a larger bearing, lower load or a full manufacturer calculation is needed."
    ],
    "verify": [
      "Take C, and the X and Y factors used for P, from the manufacturer for the exact bearing designation.",
      "Run the manufacturer’s modified rating life calculation for lubrication and contamination before final selection."
    ],
    "refs": [
      "Budynas R. G. and Nisbett J. K., Shigley’s Mechanical Engineering Design, 10th edition (McGraw-Hill, 2015), chapter 11, Rolling-Contact Bearings. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 281:2007, Rolling bearings — Dynamic load ratings and rating life (cited by title; no content reproduced)."
    ]
  },
  "bearing-static-ratio": {
    "purpose": "Compare a rolling bearing’s basic static load rating with the equivalent static load it carries when stationary, oscillating slowly or under shock.",
    "uses": [
      "Check slowly rotating or stationary bearings",
      "Check shock or peak loads on running bearings",
      "Compare bearing sizes for a static duty"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "C0": "Basic static load rating from the manufacturer’s catalogue for the exact bearing.",
      "P0": "Equivalent static load from radial and axial loads with the manufacturer’s static factors, including peak and shock loads. Same unit as C0."
    },
    "outputs": [
      "Static safety factor s0 = C0 / P0"
    ],
    "method": [
      "s0 = C0 / P0.",
      "Example: C0 = 35 kN and P0 = 12 kN give s0 = 35 / 12 = 2.916667."
    ],
    "limitations": [
      "The minimum acceptable s0 depends on bearing type, running smoothness, noise requirements and shock; it is set by the manufacturer’s guidance, not by this tool.",
      "Housing and shaft strength, and the bearing seat, are not checked.",
      "No certification or bearing selection is implied.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "s0 below 1 means the equivalent static load exceeds the static rating, at which permanent deformation of the rolling contact becomes significant."
    ],
    "verify": [
      "Compare s0 with the manufacturer’s recommended minimum for the bearing type and application.",
      "Include the largest peak or shock load the bearing can see, not only the steady load."
    ],
    "refs": [
      "Budynas R. G. and Nisbett J. K., Shigley’s Mechanical Engineering Design, 10th edition (McGraw-Hill, 2015), chapter 11, Rolling-Contact Bearings. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 76:2006, Rolling bearings — Static load ratings (cited by title; no content reproduced)."
    ]
  },
  "chain-linear-speed": {
    "purpose": "Calculate the average linear speed of a roller chain and the speed fluctuation caused by chordal action as it wraps a sprocket.",
    "uses": [
      "Check chain speed against the manufacturer’s limit",
      "Compare sprocket sizes for smoother running",
      "Convert sprocket speed to conveyor speed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "pitch": "Chain pitch, for example 12.7 mm for a ½-inch pitch chain.",
      "teeth": "Number of teeth on the sprocket whose speed is entered.",
      "rpm": "Speed of that sprocket."
    },
    "outputs": [
      "Average chain speed (m/s and m/min)",
      "Chordal speed variation (%)"
    ],
    "method": [
      "Average speed (m/s) = pitch (mm) × teeth × speed (rpm) / 60,000.",
      "Chordal speed variation ΔV / V = (π / N) × [1 / sin(180° / N) − 1 / tan(180° / N)] for N teeth.",
      "Example: 12.7 mm pitch, 20 teeth, 600 rpm gives 12.7 × 20 × 600 / 60,000 = 2.54 m/s, with a chordal speed variation of about 1.236%."
    ],
    "limitations": [
      "Chain power rating, tension, lubrication regime and wear elongation are not checked.",
      "The chordal variation is the geometric fluctuation only; dynamic effects and resonance are not modelled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More teeth reduce chordal variation, giving smoother, quieter running and less chain fatigue."
    ],
    "refs": [
      "Budynas R. G. and Nisbett J. K., Shigley’s Mechanical Engineering Design, 10th edition (McGraw-Hill, 2015), chapter 17, Flexible Mechanical Elements (roller chain). Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pulley-speed-ratio": {
    "purpose": "Calculate the ideal speed of a driven pulley, the speed ratio and the belt speed from the two pitch diameters and the driver speed.",
    "uses": [
      "Choose pulley sizes for a target speed",
      "Check belt speed against the belt maker’s limit",
      "Estimate a driven machine speed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "driver": "Pitch diameter of the driving pulley (not the outside diameter for V-belts).",
      "driven": "Pitch diameter of the driven pulley.",
      "rpm": "Speed of the driving pulley, for example the motor speed."
    },
    "outputs": [
      "Ideal driven speed (rpm)",
      "Speed ratio",
      "Belt speed (m/s)"
    ],
    "method": [
      "Speed ratio = driven pitch diameter / driver pitch diameter.",
      "Driven speed = driver speed / speed ratio; belt speed (m/s) = π × driver diameter (mm) × driver speed / 60,000.",
      "Example: 100 mm and 250 mm pulleys at 1,500 rpm give a ratio of 2.5, a driven speed of 600 rpm and a belt speed of 7.853982 m/s."
    ],
    "limitations": [
      "Slip and creep, which make the driven speed slightly lower in practice, are ignored.",
      "Belt length, centre distance, wrap angle and power rating are not checked; the Open Belt Drive Geometry tool covers length and wrap.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the result as the nominal speed; measure the actual speed where it matters."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2484–2487. Topic reference; no source tables or recommended settings are reproduced.",
      "Budynas R. G. and Nisbett J. K., Shigley’s Mechanical Engineering Design, 10th edition (McGraw-Hill, 2015), chapter 17, Flexible Mechanical Elements. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "leadscrew-speed": {
    "purpose": "Calculate the linear travel speed of a lead screw or ball screw nut from the screw lead and rotational speed.",
    "uses": [
      "Choose a lead for a target travel speed",
      "Convert motor speed to axis speed",
      "Estimate stroke time at constant speed"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "lead": "Travel per revolution. For a multi-start screw, lead = pitch × number of starts.",
      "rpm": "Screw speed relative to the nut."
    },
    "outputs": [
      "Linear travel speed (mm/s and mm/min)"
    ],
    "method": [
      "Speed (mm/s) = lead (mm) × speed (rpm) / 60.",
      "Example: 5 mm lead at 300 rpm gives 5 × 300 / 60 = 25 mm/s, or 1,500 mm/min."
    ],
    "limitations": [
      "Acceleration, backlash, critical (whirling) speed and the nut’s maximum speed are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Using pitch instead of lead on a multi-start screw underestimates speed by the number of starts."
    ],
    "refs": [
      "Budynas R. G. and Nisbett J. K., Shigley’s Mechanical Engineering Design, 10th edition (McGraw-Hill, 2015), chapter 8, section on the mechanics of power screws. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "leadscrew-torque": {
    "purpose": "Calculate the torque needed to drive a steady axial load through a lead screw or ball screw at a known overall efficiency.",
    "uses": [
      "Size a motor or gearbox for a screw axis",
      "Compare lead screw and ball screw torque",
      "See how lead and efficiency change torque"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "force": "Total axial load to be moved, including gravity load on a vertical axis and process forces.",
      "lead": "Travel per revolution (pitch × number of starts).",
      "efficiency": "Overall efficiency as a fraction from 0.01 to 1, from the screw manufacturer for this screw, nut material and lubrication. Enter 0.3 for 30%."
    },
    "outputs": [
      "Input torque at the entered efficiency (N·m)",
      "Frictionless torque at efficiency 1 (N·m)"
    ],
    "method": [
      "Frictionless torque (N·m) = axial load (N) × lead (mm) / 1,000 / (2π).",
      "Input torque = frictionless torque / efficiency.",
      "Example: 2,000 N, 5 mm lead and efficiency 0.3 give 2,000 × 0.005 / (2π × 0.3) = 5.305165 N·m; the frictionless torque is 1.591549 N·m."
    ],
    "limitations": [
      "Steady motion only: acceleration torque, support bearing and seal drag, and preload torque are excluded.",
      "Back-driving and load holding are not checked. Whether a screw can be back-driven depends on its thread friction and lead angle; a brake may be needed on vertical axes.",
      "No certification or drive selection is implied.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Lead screws commonly have much lower efficiency than ball screws, so the same load needs more torque and generates more heat."
    ],
    "verify": [
      "Use the manufacturer’s efficiency for the actual screw, nut and lubrication, not a generic figure.",
      "Add acceleration and drag torque and apply the drive manufacturer’s service factor before sizing a motor."
    ],
    "refs": [
      "Budynas R. G. and Nisbett J. K., Shigley’s Mechanical Engineering Design, 10th edition (McGraw-Hill, 2015), chapter 8, section on the mechanics of power screws. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-flow-velocity": {
    "purpose": "Calculate the mean velocity of an incompressible flow in a full circular pipe from the volumetric flow and the internal bore.",
    "uses": [
      "Check a pipe or hose size against a velocity guideline",
      "Find the velocity for a pressure-drop calculation",
      "Compare bore sizes"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "flow": "Volumetric flow through the pipe.",
      "diameter": "Internal bore, not the nominal or outside diameter."
    },
    "outputs": [
      "Mean flow velocity (m/s)",
      "Flow area (mm²)"
    ],
    "method": [
      "Flow area (mm²) = π × bore² / 4.",
      "Velocity (m/s) = (flow / 60,000) / (area / 10⁶).",
      "Example: 100 L/min in a 25 mm bore gives an area of 490.873852 mm² and a mean velocity of 3.395305 m/s."
    ],
    "limitations": [
      "Full pipe, single-phase, incompressible flow only. Mean velocity is not the peak velocity on the centreline.",
      "Recommended velocity limits depend on the fluid, pipe material, noise, erosion and application; none is applied here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For pressure drop, use this velocity in the Darcy Pipe Pressure Drop tool; the Liquid Pipe Velocity and Reynolds Number tool adds the flow regime."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 365–366. Topic reference; no source tables or recommended settings are reproduced.",
      "US Department of Energy, DOE-HDBK-1012/3-92, Fluid Flow — https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1012-92_VOL3.pdf"
    ]
  },
  "darcy-pipe-drop": {
    "purpose": "Calculate the friction pressure drop and head loss for fully developed flow in a straight circular pipe using the Darcy–Weisbach equation.",
    "uses": [
      "Estimate line losses for pump or circuit sizing",
      "Compare pipe sizes",
      "Check a measured pressure drop"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "friction": "Darcy (Moody) friction factor for the Reynolds number and relative roughness, from a Moody chart or a friction-factor equation. A Fanning factor is one quarter of the Darcy factor.",
      "length": "Length of straight pipe.",
      "diameter": "Internal bore.",
      "velocity": "Mean velocity; the Pipe Flow Velocity tool calculates it from flow and bore.",
      "density": "Fluid density at the operating temperature, for example about 1,000 kg/m³ for water."
    },
    "outputs": [
      "Friction pressure drop (kPa and bar)",
      "Friction head loss (m of fluid)"
    ],
    "method": [
      "Δp (Pa) = f × (L / D) × ρ × v² / 2, with D in metres.",
      "Head loss (m) = Δp / (ρ × g), with g = 9.80665 m/s².",
      "Example: f = 0.025, 20 m of 25 mm bore, 2 m/s and 1,000 kg/m³ give 0.025 × 800 × 2,000 = 40,000 Pa = 40 kPa, a head loss of 4.078865 m."
    ],
    "limitations": [
      "Straight pipe only: fittings, valves, entries, exits, elevation change and the pump itself are excluded.",
      "The answer is only as good as the friction factor; it must match the Reynolds number and roughness, and for laminar flow f = 64 / Re.",
      "Single-phase flow of approximately constant density; not for compressible gas with a large pressure drop.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pressure drop rises with velocity squared, so a modest increase in bore can reduce losses greatly."
    ],
    "verify": [
      "Confirm the factor is a Darcy factor and matches the Reynolds number from the Liquid Pipe Velocity and Reynolds Number tool.",
      "Add minor losses for fittings and valves before sizing a pump."
    ],
    "refs": [
      "US Department of Energy, DOE-HDBK-1012/3-92, Fluid Flow — https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1012-92_VOL3.pdf",
      "Moody L. F., “Friction factors for pipe flow”, Transactions of the ASME 66 (1944), 671–684."
    ]
  },
  "pump-shaft-power": {
    "purpose": "Calculate the hydraulic power delivered to a liquid and the shaft power a pump needs at a given flow, head and efficiency.",
    "uses": [
      "Estimate pump input power at a duty point",
      "Compare duty points or pump efficiencies",
      "Check a motor size before supplier selection"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "flow": "Flow at the duty point.",
      "head": "Total dynamic head the pump must develop at that flow, including static lift and losses.",
      "density": "Liquid density at the pumping temperature.",
      "efficiency": "Pump efficiency as a fraction from 0.01 to 1, read from the pump curve at the duty point. Enter 0.7 for 70%."
    },
    "outputs": [
      "Pump shaft power (kW)",
      "Hydraulic power (kW)"
    ],
    "method": [
      "Hydraulic power (kW) = ρ × g × Q × H / 1,000, with Q in m³/s (L/min ÷ 60,000) and g = 9.80665 m/s².",
      "Shaft power = hydraulic power / efficiency.",
      "Example: 120 L/min, 30 m, 1,000 kg/m³ and efficiency 0.7 give a hydraulic power of 0.588399 kW and a shaft power of 0.840570 kW."
    ],
    "limitations": [
      "Efficiency varies along the pump curve; the result applies only at the entered duty point.",
      "Motor losses, drive losses and the motor sizing margin are not included. Viscous liquids need viscosity corrections to the pump curve.",
      "No certification or pump selection is implied.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Size the motor for the highest shaft power over the operating range, not only the normal duty point."
    ],
    "verify": [
      "Read efficiency and power from the manufacturer’s pump curve for the actual impeller and speed.",
      "Apply the pump or motor manufacturer’s sizing allowance before choosing a motor."
    ],
    "refs": [
      "US Department of Energy, DOE-HDBK-1012/3-92, Fluid Flow — https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1012-92_VOL3.pdf",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 365–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shaft-angular-offset": {
    "purpose": "Convert a relative offset change measured across a known axial span into an angular misalignment.",
    "uses": [
      "Express alignment readings as an angle or slope",
      "Compare readings with a coupling maker’s tolerance",
      "Check a shim calculation"
    ],
    "users": [
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "difference": "Actual change in relative offset between the two measurement planes. For a rim reading, use half the total indicator reading.",
      "span": "Axial distance between the two measurement planes."
    },
    "outputs": [
      "Angular misalignment (degrees and mrad)",
      "Slope (mm per 100 mm)"
    ],
    "method": [
      "Angle = arctan(offset change / span).",
      "Slope (mm per 100 mm) = 100 × offset change / span.",
      "Example: 0.15 mm across 100 mm gives 0.15 mm per 100 mm, 1.499999 mrad or 0.085944°."
    ],
    "limitations": [
      "Offset (parallel) misalignment, soft foot and thermal growth between cold and running conditions are not included.",
      "Acceptable misalignment comes from the coupling and machine manufacturers; none is applied here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Alignment tolerances are often given as a slope (mm per 100 mm) for angularity and a distance for offset."
    ],
    "refs": [
      "Piotrowski J., Shaft Alignment Handbook, 3rd edition (CRC Press, 2006). Topic reference; no source tables or tolerances are reproduced."
    ]
  },
  "differential-expansion": {
    "purpose": "Calculate how the diametral clearance between a bore and a shaft of different materials changes when both change temperature by the same amount.",
    "uses": [
      "Check whether a fit loosens or tightens at operating temperature",
      "Compare housing materials",
      "Estimate a temperature for assembly"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "diameter": "Nominal diameter of the fit.",
      "boreAlpha": "Linear expansion coefficient of the housing material over the temperature range, for example about 23 × 10⁻⁶ /°C for many aluminium alloys.",
      "shaftAlpha": "Linear expansion coefficient of the shaft material, for example about 12 × 10⁻⁶ /°C for many carbon steels.",
      "deltaT": "Temperature change of both parts from the assembly temperature; negative for cooling."
    },
    "outputs": [
      "Change in diametral clearance (mm)",
      "Bore and shaft growth (mm)"
    ],
    "method": [
      "Growth of each part = diameter × coefficient × 10⁻⁶ × temperature change.",
      "Change in clearance = bore growth − shaft growth; a positive value loosens the fit.",
      "Example: 50 mm, 23 and 12 × 10⁻⁶ /°C and +60 °C give 0.069 − 0.036 = +0.033 mm more clearance."
    ],
    "limitations": [
      "Both parts are assumed to be at one uniform temperature. In service they often differ, which can dominate the result.",
      "Coefficients are constant over the range; real values change with temperature and alloy. Stresses in an interference fit are not calculated.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add the result to the assembly clearance to estimate the running clearance; a negative running clearance means interference."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–379. Topic reference; no source tables or recommended settings are reproduced.",
      "NPL, Fundamental Good Practice in Dimensional Metrology, GPG 80 — https://eprintspublications.npl.co.uk/3360/1/mgpg80.pdf"
    ]
  },
  "cylinder-swept-volume": {
    "purpose": "Calculate the geometric volume a double-acting cylinder sweeps on its extend and retract strokes.",
    "uses": [
      "Find the volume to fill per cycle",
      "Compare bore and rod sizes",
      "Prepare an air or oil consumption estimate"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "bore": "Cylinder bore diameter.",
      "rod": "Piston rod diameter; must be smaller than the bore. Enter 0 to see the full-bore volume on both strokes.",
      "stroke": "Working stroke length."
    },
    "outputs": [
      "Swept volume per complete cycle (L)",
      "Extend and retract stroke volumes (L)"
    ],
    "method": [
      "Extend volume = π × bore² / 4 × stroke; retract volume = π × (bore² − rod²) / 4 × stroke.",
      "Complete cycle = extend + retract, converted from mm³ to litres by dividing by 10⁶.",
      "Example: 50 mm bore, 20 mm rod and 200 mm stroke give 0.392699 L + 0.329867 L = 0.722566 L per cycle."
    ],
    "limitations": [
      "Geometric volume at cylinder conditions only. It is not free-air consumption: use the Pneumatic Cylinder Air Demand tool for pressure and temperature conversion.",
      "Dead volume at the stroke ends, tubing and valve volume, and leakage are excluded.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Multiply by cycles per minute to get a volume flow at cylinder pressure, then convert to free air for compressor sizing."
    ],
    "refs": [
      "Festo: Air consumption of cylinders — https://www.festo.com/ca/en/s/air-consumption",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed CD pp. 3027–3036. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
