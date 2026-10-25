// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook17).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "rectangular-plate": {
    "purpose": "Maximum stress and deflection of square and rectangular flat plates with supported or fixed edges under uniform pressure or a central load, by the handbook’s plate formulas.",
    "uses": [
      "Check tank sides, access covers and floor plates",
      "Size a plate for a pressure or point load",
      "Compare supported and fixed edges"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "case": "Plate shape, edge support and load.",
      "L": "Distance between supports (long side for rectangles).",
      "l": "Short side of a rectangular plate.",
      "t": "Plate thickness.",
      "p": "Uniform pressure (1 kPa = 0.001 MPa; water depth 1 m ≈ 9.8 kPa).",
      "W": "Concentrated load at the centre.",
      "r0": "Radius of the area the central load is applied over.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "allow": "Allowable stress from your design code."
    },
    "outputs": [
      "Maximum stress",
      "Maximum deflection",
      "Total load"
    ],
    "method": [
      "Square, uniform (W = p × area): supported S = 0.29W/t² (0.28 bottom only), d = 0.0443WL²/Et³; fixed S = 0.31W/t², d = 0.0138WL²/Et³.",
      "Square, central load: fixed S = 0.62W/t² ln(L/2r₀), d = 0.0568WL²/Et³; supported S = 0.62W/t² (ln(L/2r₀) + 0.577), d = 0.1266WL²/Et³ (r₀ replaced by √(1.6r₀² + t²) − 0.675t when r₀ < 1.7t).",
      "Rectangular supported: S = 0.75W ÷ t²(L/l + 1.61 l²/L²), d = 0.1422W ÷ Et³(L/l³ + 2.21/L²). Fixed: S = 0.5W ÷ t²(L/l + 0.623 l⁵/L⁵), d = 0.0284W ÷ Et³(L/l³ + 1.056 l²/L⁴).",
      "Example: a 1000 × 600 × 8 mm supported plate at 10 kPa reaches 31.302 MPa and deflects 1.2182 mm."
    ],
    "limitations": [
      "Small-deflection formulas based on ν = 0.3 (within about 3% for other metals).",
      "Deflections over about half the thickness need large-deflection (membrane) analysis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stiffeners usually save more weight than a thicker plate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 288–290. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spherical-shell": {
    "purpose": "Membrane stress of a thin sphere and the maximum (inner surface) stress of a thick sphere by Lamé’s equations, with the safety factor and the thickness needed for an allowable stress.",
    "uses": [
      "Check spherical tanks, floats and hemispherical heads",
      "Find the thickness for a spherical pressure part",
      "Compare spheres with cylinders"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "di": "Inside diameter of the sphere or hemispherical head.",
      "t": "Minimum wall thickness.",
      "p": "Internal gauge pressure.",
      "Sy": "Minimum yield strength from the material certificate or specification.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Thin-wall membrane stress",
      "Thick-wall maximum stress (Lamé)",
      "Safety factor and thickness for the required factor"
    ],
    "method": [
      "Thin sphere: σ = p d ÷ 4t (half the hoop stress of a cylinder of the same diameter).",
      "Thick sphere (Lamé), inner surface: σt = p (ro³ + 2ri³) ÷ 2(ro³ − ri³).",
      "Thickness for the required factor (thin wall): t = p d × factor ÷ 4 Sy.",
      "Example: a 600 mm sphere 6 mm thick at 2 MPa has 50 MPa membrane stress."
    ],
    "limitations": [
      "Elastic stress away from nozzles, supports and welds.",
      "Pressure equipment must be designed to its code (AS 1210, ASME VIII).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A sphere needs about half the wall thickness of a cylinder of the same diameter and pressure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 290–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shaft-brittle-hollow": {
    "purpose": "Shaft diameter for brittle materials (cast iron, hardened steel) by the maximum-normal-stress theory with shock factors, the hollow-shaft factor B, and the outside diameter of a hollow shaft equal in strength to a solid one.",
    "uses": [
      "Size shafts of cast iron or hardened steel",
      "Replace a solid shaft with a lighter hollow one",
      "Compare weight and stiffness of hollow and solid shafts"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "M": "Maximum bending moment at the section.",
      "T": "Torque at the section.",
      "Km": "Combined shock and fatigue factor for bending.",
      "Kt": "Combined shock and fatigue factor for torsion.",
      "St": "Allowable tensile stress of the brittle material (well below its tensile strength).",
      "k": "Ratio of bore to outside diameter for a hollow shaft; 0 for solid."
    },
    "outputs": [
      "Solid shaft diameter (maximum normal stress)",
      "Hollow shaft outside and inside diameters",
      "Weight and stiffness compared with the solid shaft"
    ],
    "method": [
      "Solid: D = ∛(5.1 ÷ St × [Km M + √((Km M)² + (Kt T)²)]).",
      "Hollow factor B = ∛(1 ÷ (1 − k⁴)); outside diameter = B × solid diameter.",
      "Weight ratio = B²(1 − k²); torsional stiffness ratio = B⁴(1 − k⁴).",
      "Example: the default loads need 52.311 mm solid, or 54.788 mm outside × 32.873 mm bore hollow."
    ],
    "limitations": [
      "Brittle materials only (elongation under about 5%); ductile shafts use the maximum-shear method (shaft diameter tool).",
      "Stress concentrations and fatigue need separate checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A hollow shaft with k = 0.6 is about 4% larger in diameter but roughly 30% lighter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flange-coupling-bolts": {
    "purpose": "Shear stress in the bolts of a rigid flanged shaft coupling from torque, number of bolts and bolt circle, the bolt diameter needed, and the friction torque the bolt preload can carry instead.",
    "uses": [
      "Check a rigid coupling for a higher-power drive",
      "Size coupling bolts",
      "Decide whether friction or bolt shear carries the torque"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "T": "Peak torque including service factor.",
      "n": "Number of fitted bolts.",
      "Dbc": "Diameter of the bolt circle.",
      "d": "Bolt diameter in the shear plane (fitted bolts).",
      "tau": "Allowable shear stress of the bolt material.",
      "Fi": "Bolt preload, if friction is to carry the torque.",
      "mu": "Friction coefficient between flange faces.",
      "Df": "Mean diameter of the contact face; 0 uses the bolt circle."
    },
    "outputs": [
      "Shear force and stress per bolt",
      "Bolt diameter needed",
      "Friction torque capacity"
    ],
    "method": [
      "Force per bolt = 2T ÷ (n Dbc); shear stress = force ÷ (π d²/4).",
      "Bolt diameter needed = √(8T ÷ (π n Dbc τ)).",
      "Friction capacity = μ n Fi × D_f ÷ 2.",
      "Example: 2000 N·m on 6 × 12 mm bolts at 150 mm gives τ = 39.298 MPa."
    ],
    "limitations": [
      "Equal sharing between fitted bolts; clearance bolts carry torque only by friction.",
      "Flange and hub strength are checked separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use either friction (preload) or fitted-bolt shear as the design basis, not both added together."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2441–2450, 302. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taper-pin-torque": {
    "purpose": "Mean taper pin diameter needed to transmit a torque (or power at a speed) through a shaft by double shear, by the handbook formula, with the shear stress in a chosen pin.",
    "uses": [
      "Size a cross pin fixing a hub or collar to a shaft",
      "Check an existing pin after a power change",
      "Choose between a pin and a key"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters"
    ],
    "inputs": {
      "mode": "Enter the torque directly, or power and speed.",
      "T": "Torque to transmit (torque mode).",
      "P": "Power transmitted (power mode).",
      "rpm": "Shaft speed (power mode).",
      "D": "Shaft diameter at the pin.",
      "S": "Safe shear stress for the pin material (with your safety margin).",
      "dp": "Mean diameter of a proposed pin."
    },
    "outputs": [
      "Mean pin diameter needed",
      "Shear stress in the checked pin"
    ],
    "method": [
      "d = 1.13 √(T ÷ (D S)) with T in N·mm, D in mm and S in N/mm² (the pin is in double shear at the shaft surface).",
      "Torque from power: T = 9549 × P ÷ n (N·m).",
      "Check: the force at the shaft surface, 2T ÷ D, is carried by two pin sections, so τ = 4T ÷ (π d² D).",
      "Example: 60 N·m through a 30 mm shaft needs a 5.65 mm mean-diameter pin."
    ],
    "limitations": [
      "Pin shear only; the cross hole weakens the shaft and the hub bearing stress must be checked.",
      "Use a safe stress with a margin for shock.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Taper pins are good for light to moderate torque; use keys or splines for heavy drives."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 220, 1714–1720. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "universal-joint": {
    "purpose": "Maximum and minimum driven-shaft speed, speed variation and output speed at any rotation angle of a single universal (Cardan) joint working at an angle, with the matching torque variation.",
    "uses": [
      "Check whether a single universal joint is acceptable for a drive",
      "Explain vibration from a drive shaft at an angle",
      "Decide on a double joint or intermediate shaft"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "angle": "Angle between the two shafts at the joint.",
      "rpm": "Constant speed of the driving shaft.",
      "pos": "Rotation of the driving yoke from the position where the driven shaft is fastest.",
      "Tin": "Torque at the driving shaft."
    },
    "outputs": [
      "Maximum and minimum driven speed",
      "Total variation",
      "Instantaneous speed and torque at the chosen position"
    ],
    "method": [
      "Maximum driven speed = n sec β; minimum = n cos β (handbook).",
      "Instantaneous ratio ω₂/ω₁ = cos β ÷ (1 − sin²β sin²θ), θ from the minimum-speed position.",
      "Torque varies inversely with speed (power constant, losses ignored).",
      "Example (handbook case): 100 rpm at 25° gives 110.34 and 90.631 rpm, a variation of 19.707 rpm."
    ],
    "limitations": [
      "Single joint; two joints correctly phased with equal angles cancel the variation.",
      "Inertia of the driven parts turns the speed variation into torque pulses.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Angles above about 20–25° should be avoided except at low speed and power; above 45° a single joint does not work well."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2445–2446. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fatigue-notch-factor": {
    "purpose": "Notch sensitivity (Peterson) and the fatigue stress concentration factor Kf from the theoretical factor Kt, the notch radius and the material’s tensile strength or characteristic length.",
    "uses": [
      "Turn a chart Kt into the effective fatigue factor",
      "Compare fillet radii on a shaft shoulder",
      "Feed the Goodman fatigue tool"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "Kt": "Elastic stress concentration factor for the geometry from charts or FEA.",
      "r": "Radius at the root of the notch, fillet or groove.",
      "aMode": "Estimate the material constant for steels, or enter it.",
      "Su": "Ultimate tensile strength (used for the steel estimate).",
      "a": "Peterson’s characteristic length for the material from fatigue data (entered mode)."
    },
    "outputs": [
      "Notch sensitivity q",
      "Fatigue factor Kf",
      "Reduction compared with Kt"
    ],
    "method": [
      "Steel estimate: a ≈ 0.0254 × (2070 ÷ Su)^1.8 mm (Su in MPa).",
      "Peterson: q = 1 ÷ (1 + a/r).",
      "Kf = 1 + q (Kt − 1); multiply nominal alternating stress by Kf.",
      "Example: Kt 2.2 with a 1 mm radius in 700 MPa steel gives q = 0.84831 and Kf = 2.018."
    ],
    "limitations": [
      "Empirical notch sensitivity; for very small radii or high-strength steels use measured data.",
      "Kt must match the load type (bending, axial or torsion).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger radius lowers Kt and gives the material less notch sensitivity benefit; both effects are captured here."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 200–211. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sn-fatigue-life": {
    "purpose": "Estimated cycles to failure for a fully reversed (or equivalent) alternating stress from a Basquin S-N line between 10³ cycles and the corrected endurance limit at 10⁶ cycles.",
    "uses": [
      "Estimate the life of a part loaded above its endurance limit",
      "Find the stress allowed for a required number of cycles",
      "Compare design options for limited-life parts"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "sa": "Alternating stress amplitude, including Kf; convert mean stress effects first (e.g. with the Goodman relation).",
      "Su": "Ultimate tensile strength.",
      "Se": "Endurance limit corrected for surface, size, load, temperature and reliability.",
      "f": "Fraction of Su reached at 1000 cycles (about 0.9 for steels below 500 MPa, falling for stronger steels).",
      "Nreq": "Number of cycles the part must survive."
    },
    "outputs": [
      "Estimated cycles to failure",
      "Stress allowed for the required life",
      "Basquin constants"
    ],
    "method": [
      "Line through (10³, f Su) and (10⁶, Se) on log axes: σ = a N^b.",
      "a = (f Su)² ÷ Se; b = −(1/3) log₁₀(f Su ÷ Se).",
      "N = (σa ÷ a)^(1/b); below Se the life is taken as unlimited.",
      "Example: 300 MPa alternating in 700 MPa steel gives about 255,980 cycles."
    ],
    "limitations": [
      "Approximate S-N estimate for steels; scatter is large, so apply a life factor.",
      "Above about 10³ cycles only; low-cycle fatigue needs strain-life methods.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fatigue life is very sensitive to stress: 10% less stress can mean several times more life."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 200–211, 358. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vickers-knoop-hardness": {
    "purpose": "Vickers (HV) or Knoop (HK) hardness from the test force and the measured indentation diagonal, with the indentation depth for checking specimen or case thickness.",
    "uses": [
      "Calculate hardness from a microhardness reading",
      "Check case depth traverses",
      "Check minimum specimen thickness"
    ],
    "users": [
      "Quality inspectors",
      "Metallurgists",
      "Materials engineers"
    ],
    "inputs": {
      "type": "Indenter type.",
      "F": "Test force in kilograms-force (HV10 = 10 kgf; 1 kgf = 9.80665 N).",
      "d": "Measured diagonal: mean of both diagonals for Vickers, long diagonal for Knoop."
    },
    "outputs": [
      "Hardness number",
      "Indentation depth",
      "Minimum specimen thickness"
    ],
    "method": [
      "Vickers: HV = 1.8544 F ÷ d²; depth ≈ d ÷ 7.",
      "Knoop: HK = 14.229 F ÷ L²; depth ≈ L ÷ 30.",
      "Minimum thickness ≈ 1.5 × diagonal (Vickers) or 10 × depth (Knoop).",
      "Example: HV10 with a 0.3 mm diagonal is 206.04 HV."
    ],
    "limitations": [
      "Diagonals must be measured accurately; small indentations magnify measurement error.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Report the force with the result (e.g. 206 HV10)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1406–1412. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 6507-1 Vickers hardness test; ISO 4545-1 Knoop hardness test"
    ]
  },
  "elastic-constants": {
    "purpose": "Modulus of elasticity E, shear modulus G, Poisson’s ratio ν, bulk modulus K and Lamé constant λ of an isotropic material from any two of E, G and ν.",
    "uses": [
      "Find G for torsion and spring calculations from E and ν",
      "Check data sheet values for consistency",
      "Get the bulk modulus for pressure calculations"
    ],
    "users": [
      "Design engineers",
      "Materials engineers",
      "Engineering students"
    ],
    "inputs": {
      "mode": "Which two constants you know.",
      "E": "Young’s modulus from material data.",
      "G": "Shear modulus from material data.",
      "nu": "Poisson’s ratio from material data."
    },
    "outputs": [
      "E, G and ν",
      "Bulk modulus K",
      "Lamé constant λ"
    ],
    "method": [
      "G = E ÷ 2(1 + ν); ν = E ÷ 2G − 1; E = 2G(1 + ν).",
      "K = E ÷ 3(1 − 2ν); λ = Eν ÷ ((1 + ν)(1 − 2ν)).",
      "Example: E 200 GPa and ν 0.3 give G = 76.923 GPa and K = 166.67 GPa."
    ],
    "limitations": [
      "Isotropic, linear elastic materials only; composites, wood and some plastics are anisotropic.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Inconsistent data-sheet values (ν outside 0–0.5) indicate a typing or unit error."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 369–380, 2695. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "melting-energy": {
    "purpose": "Energy to heat a metal charge to its melting point, melt it and superheat the liquid to the pouring temperature, and the melting time and energy cost at a furnace power and efficiency.",
    "uses": [
      "Estimate furnace time and energy per melt",
      "Compare melting costs of alloys",
      "Size a furnace for a production rate"
    ],
    "users": [
      "Foundry engineers",
      "Process engineers",
      "Estimators"
    ],
    "inputs": {
      "mass": "Mass of metal charged.",
      "T0": "Temperature of the charge when loaded.",
      "Tm": "Melting point (or liquidus) of the alloy.",
      "Tp": "Temperature to which the liquid is superheated before pouring.",
      "cs": "Average specific heat of the solid over the range (aluminium about 0.9, steel about 0.65, copper about 0.39 kJ/kg·K).",
      "L": "Latent heat of fusion (aluminium 397, iron about 270, copper about 205 kJ/kg).",
      "cl": "Specific heat of the liquid metal.",
      "P": "Furnace rated power.",
      "eff": "Share of furnace energy that reaches the metal (induction about 55–75%, fuel-fired lower).",
      "price": "Energy price per kWh (or equivalent fuel cost)."
    },
    "outputs": [
      "Energy to heat, melt and superheat",
      "Melting time",
      "Energy drawn and cost per melt"
    ],
    "method": [
      "Q = m [cs (Tm − T₀) + L + cl (Tp − Tm)].",
      "Energy drawn = Q ÷ efficiency; time = energy drawn ÷ power.",
      "Cost = energy drawn × price.",
      "Example: 500 kg of aluminium to 720 °C needs 144.97 kWh in the metal, about 0.96648 h at 250 kW."
    ],
    "limitations": [
      "Average property values; alloys melt over a range and properties vary with temperature.",
      "Holding losses while waiting to pour are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep superheat to what the casting needs; each degree costs energy and increases gas pick-up and oxidation."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–374, 1404–1420. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "snap-fit": {
    "purpose": "Assembly strain of a straight or tapered cantilever snap-fit finger by the handbook formula, the deflection force and the assembly (insertion) force from the lead-in angle and friction.",
    "uses": [
      "Design snap-fit latches in moulded plastic parts",
      "Check a finger against the material’s strain limit",
      "Estimate insertion and deflection forces"
    ],
    "users": [
      "Product designers",
      "Plastics engineers",
      "Design engineers"
    ],
    "inputs": {
      "Y": "How far the finger tip must deflect to pass the undercut.",
      "h": "Thickness of the finger where it joins the part.",
      "L": "Length from the root to the hook.",
      "b": "Width of the finger.",
      "K": "Factor from the handbook chart for fingers that taper to half thickness (about 1.6–1.7); 1 for a straight finger.",
      "E": "Secant modulus of the plastic at the expected strain (lower than the initial modulus).",
      "eAllow": "Permissible short-term strain for the material from the resin supplier (e.g. about 2–4% for many unfilled thermoplastics, less for filled grades).",
      "mu": "Friction between the mating materials.",
      "alpha": "Angle of the lead-in ramp on the hook."
    },
    "outputs": [
      "Assembly strain",
      "Deflection force",
      "Assembly force"
    ],
    "method": [
      "Strain ε = 3Yh ÷ (2L²K) (K = 1 for a straight finger).",
      "Deflection force P = b h² E ε ÷ (6L).",
      "Assembly force W = P (μ + tan α) ÷ (1 − μ tan α).",
      "Example: the default finger strains 1.28% and needs about 6.3852 N to assemble."
    ],
    "limitations": [
      "Elastic beam theory with a rigid root; real roots flex, which lowers strain but also holding force.",
      "Sharp corners at the root multiply the strain; always add a root radius.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the strain is too high, lengthen or thin the finger, or taper it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 593–605. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-contact-stress": {
    "purpose": "Nominal contact (Hertzian) stress at the pitch point of a spur or helical gear pair by the ISO 6336-style relation with elasticity and zone factors, as a screening check against pitting.",
    "uses": [
      "Screen gear face width and diameter for pitting",
      "Compare materials and heat treatments",
      "Check a gear set after a power increase"
    ],
    "users": [
      "Gear designers",
      "Design engineers"
    ],
    "inputs": {
      "Ft": "Tangential force at the pitch circle (see the gear tooth forces tool).",
      "d1": "Pitch diameter of the pinion.",
      "b": "Face width in contact.",
      "u": "Tooth ratio; use it as negative for internal gears is not supported here.",
      "alpha": "Pressure angle.",
      "E": "Modulus of the gear material.",
      "nu": "Poisson’s ratio.",
      "K": "Product of application, dynamic and load-distribution factors from your rating method.",
      "allow": "Allowable contact stress for the material and heat treatment (e.g. from ISO 6336-5 or AGMA data)."
    },
    "outputs": [
      "Elasticity and zone factors",
      "Contact stress",
      "Ratio to allowable"
    ],
    "method": [
      "Elasticity factor ZE = √(E ÷ 2π(1 − ν²)) for equal materials (≈ 189.8 √MPa for steel).",
      "Zone factor ZH = √(2 ÷ (sin α cos α)) for unshifted spur gears (≈ 2.49 at 20°).",
      "σH = ZE ZH √(K Ft (u + 1) ÷ (b d₁ u)).",
      "Example: 3000 N on a 60 mm pinion, 30 mm wide, ratio 3: σH ≈ 864.49 MPa."
    ],
    "limitations": [
      "Screening relation; a full ISO 6336 or AGMA 2001 rating adds contact ratio, helix, lubrication and life factors.",
      "Same material for both gears.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Contact stress falls with the square root of face width and pinion diameter; doubling width cuts stress by about 30%."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160, 2301–2309. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 6336-2 Calculation of load capacity of spur and helical gears — Surface durability (pitting)"
    ]
  },
  "cam-pressure-angle": {
    "purpose": "Maximum pressure angle and its position for a radial (in-line) roller follower on a disc cam, from the base circle, roller radius, rise, cam angle and motion law, against a limit.",
    "uses": [
      "Choose the smallest base circle that keeps the pressure angle acceptable",
      "Check a cam design for jamming",
      "Compare motion laws"
    ],
    "users": [
      "Machine designers",
      "Automation engineers"
    ],
    "inputs": {
      "law": "Motion law of the rise.",
      "h": "Total follower rise.",
      "beta": "Cam rotation over which the rise occurs.",
      "Rb": "Radius of the base circle (smallest cam radius).",
      "Rr": "Radius of the follower roller.",
      "limit": "Largest pressure angle your design allows (about 30° for translating followers is a common guide)."
    },
    "outputs": [
      "Maximum pressure angle and where it occurs",
      "Prime circle radius"
    ],
    "method": [
      "Prime circle radius Rp = Rb + Rr.",
      "Follower displacement y(θ) and slope dy/dθ from the motion law.",
      "Pressure angle φ = atan((dy/dθ) ÷ (Rp + y)); the maximum is found by sampling the rise.",
      "Example: a 20 mm cycloidal rise over 90° on a 40 mm base circle peaks at 23.233°."
    ],
    "limitations": [
      "Radial (in-line) translating roller follower; offset and oscillating followers need different relations.",
      "Undercutting (radius of curvature) is a separate check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the pressure angle is too high, enlarge the base circle or spread the rise over a larger cam angle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2284–2309. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bearing-duty-cycle": {
    "purpose": "Mean equivalent load and speed over up to four duty-cycle steps (load, speed, share of time), and the resulting L10 life in hours for ball or roller bearings.",
    "uses": [
      "Find bearing life for machines with changing loads and speeds",
      "Compare duty cycles",
      "Check a bearing selection against a mission profile"
    ],
    "users": [
      "Design engineers",
      "Reliability engineers"
    ],
    "inputs": {
      "type": "Ball or roller bearing.",
      "C": "Basic dynamic load rating from the catalogue.",
      "P1": "Equivalent dynamic load in step 1 (see the adjusted life tool for X and Y factors).",
      "n1": "Speed in step 1.",
      "t1": "Share of operating time in step 1.",
      "P2": "Load in step 2.",
      "n2": "Speed in step 2.",
      "t2": "Share of time in step 2.",
      "P3": "Load in step 3.",
      "n3": "Speed in step 3.",
      "t3": "Share of time in step 3.",
      "P4": "Load in step 4 (0 if not used).",
      "n4": "Speed in step 4.",
      "t4": "Share of time in step 4."
    },
    "outputs": [
      "Mean speed",
      "Mean equivalent load",
      "L10 life in revolutions and hours",
      "Share of damage from each step"
    ],
    "method": [
      "Mean speed nm = Σ nᵢ tᵢ ÷ Σ tᵢ.",
      "Mean load Pm = (Σ Pᵢᵖ nᵢ tᵢ ÷ Σ nᵢ tᵢ)^(1/p), p = 3 (ball) or 10/3 (roller).",
      "L10 = (C ÷ Pm)ᵖ million revolutions; hours = L10 × 10⁶ ÷ (60 nm).",
      "Example: the default duty cycle gives Pm = 4.1857 kN and L10h = 3,409.1 h."
    ],
    "limitations": [
      "Basic L10 life; apply reliability and lubrication factors with the adjusted life tool.",
      "Steps are treated as long compared with a revolution.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The heaviest step usually dominates damage because life falls with the cube of load."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2400–2420. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rms-torque": {
    "purpose": "Root-mean-square (thermal) torque and peak torque over a repeating duty cycle of up to five segments, compared with a motor’s continuous and peak torque ratings.",
    "uses": [
      "Size a servo or VFD motor for an indexing or reciprocating cycle",
      "Check that a motor will not overheat",
      "Compare motion profiles"
    ],
    "users": [
      "Automation engineers",
      "Electrical engineers"
    ],
    "inputs": {
      "T1": "Torque in segment 1 (accelerating, for example).",
      "t1": "Duration of segment 1.",
      "T2": "Torque in segment 2 (constant speed).",
      "t2": "Duration of segment 2.",
      "T3": "Torque in segment 3 (decelerating, negative if braking).",
      "t3": "Duration of segment 3.",
      "T4": "Torque in segment 4 (dwell, 0 if standing).",
      "t4": "Duration of segment 4.",
      "T5": "Torque in segment 5 (0 if not used).",
      "t5": "Duration of segment 5.",
      "Tc": "Motor continuous (rated) torque at the operating speed.",
      "Tp": "Motor or drive peak torque."
    },
    "outputs": [
      "RMS torque",
      "Peak torque",
      "Utilisation of continuous and peak ratings"
    ],
    "method": [
      "T_rms = √(Σ Tᵢ² tᵢ ÷ Σ tᵢ), including dwell time at zero torque.",
      "Peak = largest |Tᵢ|.",
      "Motor acceptable when T_rms ≤ continuous rating and peak ≤ peak rating.",
      "Example: the default cycle has T_rms = 5.2058 N·m and a peak of 12 N·m."
    ],
    "limitations": [
      "Torque only; speed and the motor’s thermal time constant also matter for long cycles.",
      "Dwell segments help cooling only if the motor is actually at zero torque.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep a margin (often 20%) below the continuous rating for ambient temperature and ageing."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2569–2580, 180–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ball-screw-life": {
    "purpose": "Rating life of a ball screw in revolutions, travel distance and hours from its dynamic load rating, mean axial load, lead and speed, against a required life.",
    "uses": [
      "Check a ball screw for a machine’s service life",
      "Compare screw sizes and preloads",
      "Estimate travel life in kilometres"
    ],
    "users": [
      "Automation engineers",
      "Machine designers"
    ],
    "inputs": {
      "Ca": "Basic dynamic load rating from the ball screw catalogue.",
      "Fm": "Mean axial load over the duty cycle (cubic mean of loads, with preload included per the maker).",
      "fw": "Load (operating condition) factor for shock and vibration (about 1.0–1.2 smooth, 1.2–1.5 normal, up to 2–3 with impact).",
      "lead": "Screw lead.",
      "rpm": "Mean screw speed.",
      "req": "Required service life."
    },
    "outputs": [
      "Life in revolutions",
      "Travel life",
      "Life in hours"
    ],
    "method": [
      "L = (Ca ÷ (fw Fm))³ × 10⁶ revolutions.",
      "Travel life = L × lead.",
      "Hours = L ÷ (60 × mean speed).",
      "Example: Ca 15 kN at 2 kN mean load lasts 4,069 h, about 2,441.4 km of travel."
    ],
    "limitations": [
      "Basic rating life (90% reliability); the maker’s reliability and hardness factors may apply.",
      "Critical speed and buckling are separate checks (ball screw limits tool).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Life falls with the cube of load: reducing the mean load by 20% roughly doubles life."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2561–2568. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "timing-belt": {
    "purpose": "Pitch length and tooth count of a synchronous (timing) belt for two pulleys at a centre distance, the exact centre distance for the chosen belt, and teeth in mesh on the small pulley.",
    "uses": [
      "Select a stock timing belt length",
      "Set the centre distance for a chosen belt",
      "Check teeth in mesh on the small pulley"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "p": "Belt pitch (e.g. 5 mm for HTD 5M, 5.08 mm for XL, 8 mm for 8M).",
      "z1": "Teeth on the small pulley.",
      "z2": "Teeth on the large pulley.",
      "C": "Wanted centre distance."
    },
    "outputs": [
      "Belt pitch length and tooth count",
      "Exact centre distance for the rounded belt",
      "Teeth in mesh on the small pulley"
    ],
    "method": [
      "Pitch diameters D = z p ÷ π.",
      "L = 2C + π(D + d)/2 + (D − d)² ÷ 4C; teeth = L ÷ p rounded to the nearest whole tooth.",
      "Exact C from the open-belt relation by iteration; teeth in mesh = z₁ × wrap ÷ 360°.",
      "Example: 20/40 teeth at about 200 mm need a 110-tooth belt (550 mm), giving C = 199.36 mm."
    ],
    "limitations": [
      "Pitch-line geometry; stock belt lengths come in steps set by the maker.",
      "Allow centre adjustment for installation and tension.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep at least six teeth in mesh on the small pulley for most belt types."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2473–2535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "alignment-thermal-growth": {
    "purpose": "Vertical thermal growth of the driver and driven shafts from foot-to-centreline height, expansion coefficient and temperature rise, and the cold alignment offset that gives true alignment at operating temperature.",
    "uses": [
      "Set cold alignment targets for hot pumps, compressors and turbines",
      "Explain why hot machines need offset alignment",
      "Check alignment targets supplied by a maker"
    ],
    "users": [
      "Maintenance engineers",
      "Reliability engineers",
      "Maintenance technicians"
    ],
    "inputs": {
      "H1": "Height from the stationary machine’s feet (or baseplate) to its shaft centreline.",
      "a1": "Expansion coefficient of the stationary machine’s casing or supports (cast iron about 10.5, steel about 11–12 µm/m·K).",
      "dT1": "Average temperature rise of those supports from cold to running.",
      "H2": "Height from the movable machine’s feet to its shaft centreline.",
      "a2": "Expansion coefficient of the movable machine’s supports.",
      "dT2": "Average temperature rise of the movable machine’s supports."
    },
    "outputs": [
      "Thermal growth of each shaft",
      "Relative growth",
      "Cold vertical offset to set"
    ],
    "method": [
      "Growth = α × H × ΔT for each machine.",
      "Relative growth = movable growth − stationary growth.",
      "Set the movable machine this much lower (positive) or higher (negative) than the stationary one when cold.",
      "Example: the movable machine grows 165 µm and the stationary one 66 µm, so set the movable machine 99 µm low when cold."
    ],
    "limitations": [
      "Uniform temperature rise of the supports; piping loads and uneven heating also move machines.",
      "Vertical growth only; horizontal growth is usually small but not always.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Confirm with hot alignment checks (laser or proximity probes) where accuracy matters."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2645–2650, 375–376. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
