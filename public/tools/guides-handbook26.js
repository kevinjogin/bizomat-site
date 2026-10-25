// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook26).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "spur-gear-set-design": {
    "purpose": "One-pass design check of an external spur gear pair: geometry, pitch-line speed, torque and tangential load, contact ratio, undercut check, tooth bending stress (AGMA form with geometry factor J) and contact stress (Hertz with elastic and zone factors) against your allowables, with the face width each criterion requires.",
    "uses": [
      "Size a new spur gear pair for a motor and ratio",
      "Check an existing pair against a power increase",
      "Decide whether module or face width must grow"
    ],
    "users": [
      "Gear designers",
      "Design engineers",
      "Mechanical engineers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n1": "Pinion speed.",
      "Ko": "Overload (application) factor for the driver and load.",
      "KH": "Face load distribution factor for alignment and face width.",
      "Kv": "Dynamic factor; 0 uses the Barth factor (6.1 + v) ÷ 6.1 for cut gears.",
      "z1": "Pinion tooth count.",
      "z2": "Gear tooth count.",
      "m": "Module.",
      "b": "Face width in mesh.",
      "phi": "Pressure angle.",
      "J": "Bending geometry factor for the pinion (AGMA 908 or software).",
      "E": "Elastic modulus of the gear materials.",
      "nu": "Poisson’s ratio.",
      "sFP": "Allowable bending stress adjusted for life and reliability.",
      "sHP": "Allowable contact stress adjusted for life and reliability.",
      "reqF": "Safety factor required on bending.",
      "reqH": "Safety factor required on contact."
    },
    "outputs": [
      "Geometry, speed, torque and tangential load",
      "Bending and contact stresses with safety factors",
      "Face width needed for each criterion"
    ],
    "method": [
      "d = m z; a = (d₁ + d₂) ÷ 2; v = π d₁ n₁ ÷ 60,000; F_t = 2 T₁ ÷ d₁.",
      "Contact ratio = [√(r_a1² − r_b1²) + √(r_a2² − r_b2²) − a sin φ] ÷ (π m cos φ); undercut-free pinion needs z₁ ≥ 2 ÷ sin² φ.",
      "Bending σ_F = F_t K_o K_v K_H ÷ (b m J).",
      "Contact σ_H = Z_E Z_H √[F_t K_o K_v K_H (u + 1) ÷ (b d₁ u)], with Z_E = √[E ÷ 2π(1 − ν²)] and Z_H = √[2 ÷ (sin φ cos φ)].",
      "Face width needed: bending ∝ 1 ÷ b, contact ∝ 1 ÷ √b.",
      "Example: 7.5 kW at 1450 rpm on a module 3, 20/60 pair needs 27.71 mm of face width."
    ],
    "limitations": [
      "External spur gears of the same material; helical and internal gears need their own factors.",
      "Factors and allowables come from AGMA 2001 or ISO 6336 for your gears.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If contact governs, a harder material or larger pinion helps most; if bending governs, a larger module does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2156, 3304–3320. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "compression-spring-designer": {
    "purpose": "Synthesis of a round-wire helical compression spring from two working points: the rate and free length they require, the wire diameter that keeps the Wahl-corrected stress at the highest load within your allowable for the chosen mean diameter, active and total coils for the end type, solid length, clash allowance, stress at solid and buckling ratio, as a ready specification.",
    "uses": [
      "Design a spring for a valve, clamp or return mechanism",
      "Turn two load-length points into a spring specification",
      "Check whether a spring fits the space available"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Product engineers"
    ],
    "inputs": {
      "F1": "Load at the first (installed) length.",
      "L1": "Length at the first point.",
      "F2": "Load at the maximum operating point.",
      "L2": "Length at the maximum operating point.",
      "D": "Mean coil diameter you can fit (outside diameter = D + d).",
      "tau": "Allowable corrected shear stress for the wire material and size at the maximum load.",
      "G": "Shear modulus of the wire material (79.3 GPa for spring steel).",
      "ends": "End type, for total coils and solid length.",
      "clash": "Margin between the maximum operating length and solid, as a share of the deflection from free length."
    },
    "outputs": [
      "Rate and free length",
      "Wire diameter and coils",
      "Solid length, clash, stress at solid and buckling"
    ],
    "method": [
      "Rate k = (F₂ − F₁) ÷ (L₁ − L₂); free length L₀ = L₁ + F₁ ÷ k.",
      "Wire diameter d from τ = K_W 8 F₂ D ÷ π d³, with K_W = (4C − 1) ÷ (4C − 4) + 0.615 ÷ C and C = D ÷ d (solved iteratively).",
      "Active coils N_a = G d⁴ ÷ 8 D³ k; total coils and solid length from the end type.",
      "Clash = (L₂ − solid length) ÷ (L₀ − L₂); buckling ratio L₀ ÷ D.",
      "Example: 100 N at 60 mm and 250 N at 45 mm on a 20 mm mean diameter needs 3.0528 mm wire and 10.762 active coils."
    ],
    "limitations": [
      "Static or low-cycle duty; fatigue needs a stress range check.",
      "Round the wire to an available size and re-check with the compression spring calculator.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the clash allowance is too small, use a larger mean diameter (fewer coils) or a higher-strength wire."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shrink-fit-design": {
    "purpose": "Design of a cylindrical interference fit working backwards from the duty: the interface pressure needed for the torque and axial load with a safety factor, the diametral interference that produces it (Lamé thick-cylinder theory, solid or hollow shaft), hub bore stresses with a von Mises check, the press-in force, and the hub heating temperature for a shrink fit with assembly clearance.",
    "uses": [
      "Specify the interference for a gear, coupling or sleeve on a shaft",
      "Check that the hub can take the interference needed",
      "Set the induction or oven temperature for assembly"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Engineering managers"
    ],
    "inputs": {
      "T": "Torque the fit must carry.",
      "Fa": "Axial force the fit must carry.",
      "n": "Safety factor against slip.",
      "d": "Nominal diameter at the interface.",
      "di": "Bore of a hollow shaft.",
      "D": "Outside diameter of the hub.",
      "L": "Length of the fit.",
      "mu": "Coefficient of friction at the interface (about 0.1–0.2 for dry steel press fits; shrink fits often higher).",
      "Eh": "Elastic modulus of the hub.",
      "nuh": "Poisson’s ratio of the hub.",
      "Es": "Elastic modulus of the shaft.",
      "nus": "Poisson’s ratio of the shaft.",
      "Sy": "Yield strength of the hub material.",
      "alpha": "Linear expansion coefficient of the hub.",
      "clear": "Clearance needed to slide the hot hub on.",
      "Ta": "Starting temperature of the parts."
    },
    "outputs": [
      "Required pressure and interference",
      "Hub stress check",
      "Press force and shrink-fit temperature"
    ],
    "method": [
      "Pressure for the duty: p = n √[(2T ÷ d)² + F_a²] ÷ (π d L μ).",
      "Interference δ = p d {[(D² + d²) ÷ (D² − d²) + ν_h] ÷ E_h + [(d² + d_i²) ÷ (d² − d_i²) − ν_s] ÷ E_s}.",
      "Hub bore hoop stress σ_t = p (D² + d²) ÷ (D² − d²); von Mises with the radial −p: √(σ_t² + σ_t p + p²).",
      "Press force = π d L μ p; hub temperature rise = (δ + clearance) ÷ (α d).",
      "Example: 500 N·m on a 50 mm fit 60 mm long needs 18.313 µm of interference."
    ],
    "limitations": [
      "Uniform pressure over the length; hub ends and keyways raise local stresses.",
      "Surface smoothing reduces effective interference; add roughness allowance.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Specify the minimum interference from this result and check the maximum interference against hub yield."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 631–633, 2442–2444. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolted-joint-design-check": {
    "purpose": "Complete check of a preloaded tension joint: stress area, bolt and member (frustum) stiffness, joint constant, preload and tightening torque from the target share of proof load, preload scatter from the nut factor tolerance, and factors against separation, exceeding proof load and fatigue (Goodman) under a load cycling from zero to the working value.",
    "uses": [
      "Choose bolt size, grade and torque for a joint",
      "Check a joint after a load increase",
      "Decide whether torque control is good enough"
    ],
    "users": [
      "Design engineers",
      "Assembly engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Nominal bolt diameter.",
      "P": "Thread pitch.",
      "Sp": "Proof strength of the property class (from the bolt standard).",
      "Sut": "Minimum tensile strength.",
      "Se": "Fully corrected endurance limit of the threaded bolt (rolled or cut threads, from fatigue data).",
      "Eb": "Elastic modulus of the bolt.",
      "grip": "Total thickness clamped.",
      "Lt": "Length of thread inside the grip.",
      "Em": "Elastic modulus of the clamped members (the frustum estimate assumes one material).",
      "pct": "Preload as a share of proof load (75% is common for reusable joints).",
      "K": "Nominal nut factor for the finish and lubrication.",
      "sc": "Uncertainty in the nut factor, which scatters the preload for a given torque.",
      "Pext": "External tension load per bolt, cycling from zero.",
      "req": "Factor you require against separation and fatigue."
    },
    "outputs": [
      "Stress area, stiffnesses and joint constant",
      "Preload range and tightening torque",
      "Factors against separation, proof and fatigue"
    ],
    "method": [
      "A_t = π ÷ 4 (d − 0.9382 P)²; k_b from the shank and threaded lengths; k_m by the 30° frustum: 0.5774 π E d ÷ 2 ln[5 (0.5774 l + 0.5 d) ÷ (0.5774 l + 2.5 d)].",
      "C = k_b ÷ (k_b + k_m); F_i = share × S_p A_t; torque T = K F_i d; scatter gives F_i ÷ (1 ± scatter).",
      "Separation factor = F_i,min ÷ [(1 − C) P]; proof factor = (S_p A_t − F_i,max) ÷ C P.",
      "Fatigue (Goodman): n_f = S_e (S_ut − σ_i) ÷ [σ_a (S_ut + S_e)], σ_a = C P ÷ 2A_t, σ_i = F_i,max ÷ A_t.",
      "Example: an M12 bolt at 70% of proof needs 84.941 N·m and holds 3.6253 times the separation load."
    ],
    "limitations": [
      "Concentric tension joint; prying, bending and thermal loads are excluded.",
      "Frustum stiffness assumes members of one material wider than about three bolt diameters.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If separation fails, raise preload or use more bolts; if fatigue fails, use rolled threads, a longer bolt or a stiffer joint."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1536. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "turning-cost-per-part": {
    "purpose": "Cycle time and cost per part for a turning operation, combining spindle speed, cutting time, Taylor tool life, tool edges and tool changes per part, handling, set-up spread over the batch and the machine rate, then comparing the cost and time at the minimum-cost and maximum-production cutting speeds.",
    "uses": [
      "Quote a turned part from first principles",
      "Show the saving from running at the economic speed",
      "Compare insert grades by their Taylor constants"
    ],
    "users": [
      "Manufacturing engineers",
      "Estimators",
      "Production managers"
    ],
    "inputs": {
      "D": "Diameter being turned.",
      "L": "Length of each pass.",
      "appr": "Extra travel for approach and overrun.",
      "passes": "Number of passes.",
      "V": "Cutting speed now used.",
      "f": "Feed per revolution.",
      "nT": "Exponent of the Taylor tool-life equation V Tⁿ = C for the tool and material.",
      "Ct": "Taylor constant: cutting speed that gives one minute of tool life.",
      "edge": "Cost of one cutting edge (insert price ÷ edges, plus holder share).",
      "tct": "Time to index or change an edge.",
      "rate": "Machine plus operator rate.",
      "load": "Handling time per part.",
      "setup": "Set-up time for the batch.",
      "batch": "Parts in the batch."
    },
    "outputs": [
      "Cycle time and tool life",
      "Cost per part breakdown",
      "Minimum-cost and maximum-production speeds compared"
    ],
    "method": [
      "N = 1000 V ÷ π D; cutting time t_c = passes × (L + approach) ÷ (f N).",
      "Tool life T = (C ÷ V)^(1/n); edges per part = t_c ÷ T.",
      "Cost per part = rate × [t_c + handling + tool change × t_c ÷ T + set-up ÷ batch] + edge cost × t_c ÷ T.",
      "Minimum-cost speed V = C ÷ [(1/n − 1)(t_ct + edge cost ÷ rate)]ⁿ; maximum-production speed V = C ÷ [(1/n − 1) t_ct]ⁿ.",
      "Example: at 200 m/min each part costs 3.3586 and takes 1.9507 min; the minimum-cost speed is 203.25 m/min."
    ],
    "limitations": [
      "Taylor constants are valid only near the tested feed and depth.",
      "Assumes the feed stays the same when the speed changes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Run between the minimum-cost and maximum-production speeds; go towards maximum production only when the machine is the bottleneck."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1102–1152. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "press-die-tonnage": {
    "purpose": "Total press load for a compound or progressive die stage by summing the handbook forces for blanking and notching (perimeter × thickness × shear strength), piercing a number of holes, bending (L T² × UTS ÷ die opening) and a first draw (π d T × UTS), plus stripping force and a safety margin, with the cutting energy per stroke and the press capacity check.",
    "uses": [
      "Choose a press for a new die",
      "Check a progressive die against press capacity",
      "Estimate cutting energy for a flywheel press"
    ],
    "users": [
      "Toolmakers",
      "Press shop engineers",
      "Estimators"
    ],
    "inputs": {
      "t": "Sheet thickness.",
      "tau": "Shear strength of the sheet (often about 0.8 × tensile strength).",
      "UTS": "Ultimate tensile strength.",
      "blank": "Total length cut at once around blanks and notches.",
      "holes": "Number of holes pierced in the same stroke.",
      "hd": "Diameter of each pierced hole.",
      "bendL": "Total length bent in the stroke.",
      "W": "Opening of the bending die.",
      "drawd": "Mean shell diameter of a first draw in the same stroke.",
      "strip": "Force to strip the strip off the punches.",
      "margin": "Margin above the calculated load when choosing a press.",
      "pen": "Share of thickness the punch penetrates before fracture (for cutting energy).",
      "cap": "Rated press capacity."
    },
    "outputs": [
      "Force for each operation",
      "Total and required press force",
      "Cutting energy and capacity check"
    ],
    "method": [
      "Blanking and notching: F = perimeter × t × τ; piercing: F = holes × π d × t × τ.",
      "Bending: F = L t² UTS ÷ W (handbook formula 36); first draw: F = π d t UTS (formula 44).",
      "Total = cutting forces × (1 + stripping) + bending + drawing; required press = total × (1 + margin).",
      "Cutting energy ≈ cutting force × thickness × penetration share.",
      "Example: the default die needs 404.76 kN, or 485.71 kN with margin."
    ],
    "limitations": [
      "Peak forces assumed to coincide; staggering punch lengths or shear on punches lowers the peak.",
      "Press capacity is usually rated near the bottom of the stroke.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the press rating at the point in the stroke where the peak occurs, not just its nominal tonnage."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1336–1359, 1386–1392. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-cylinder-sizing": {
    "purpose": "Sizing a double-acting hydraulic cylinder from the duty: minimum bore for the push force at system pressure, rod diameter for Euler buckling with a mounting factor and safety factor, the largest rod that still gives the pull force, extend and retract flows for the speeds, pump input power and pipe bores for the chosen fluid velocities.",
    "uses": [
      "Specify a cylinder and power unit for a press or actuator",
      "Check rod buckling on a long stroke",
      "Size supply and return lines"
    ],
    "users": [
      "Hydraulic engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Fpush": "Force needed when extending.",
      "Fpull": "Force needed when retracting.",
      "p": "Pressure available at the cylinder after losses.",
      "vext": "Extend speed.",
      "vret": "Retract speed.",
      "stroke": "Stroke length.",
      "bore": "Bore you intend to use (a standard size); 0 shows the minimum.",
      "Lb": "Length used for buckling, usually the fully extended pin-to-pin or mounting length.",
      "Kf": "Effective length factor: about 0.5 fixed–fixed, 0.7 fixed–pinned, 1 pinned–pinned, 2 fixed–free.",
      "nb": "Safety factor applied to the Euler load.",
      "E": "Elastic modulus of the rod.",
      "eta": "Overall efficiency of the pump and motor.",
      "vp": "Fluid velocity allowed in pressure lines.",
      "vr": "Fluid velocity allowed in return lines."
    },
    "outputs": [
      "Minimum and chosen bore",
      "Rod diameter limits",
      "Flows, power and pipe bores"
    ],
    "method": [
      "Minimum bore = √(4 F_push ÷ π p).",
      "Rod for buckling: Euler F_cr = π² E I ÷ (K L)² ≥ n F_push, giving d = [64 n F (K L)² ÷ π³ E]^¼.",
      "Largest rod for the pull force: √[D² − 4 F_pull ÷ π p].",
      "Flows Q = area × speed; pump power = p Q ÷ η; pipe bore = √(4Q ÷ π v).",
      "Example: 50 kN at 160 bar needs at least a 63.078 mm bore and a 51.462 mm rod for buckling."
    ],
    "limitations": [
      "Euler buckling for slender rods; short stiff rods are governed by stress, and cylinder tube support changes the effective length.",
      "Pressure is at the cylinder; allow for valve and line losses.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the buckling rod is larger than the pull force allows, choose the next bore up."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–286, 3421–3425. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shaft-design-check": {
    "purpose": "Shaft sizing that checks three criteria at once: diameter for combined bending and torsion with shock factors (maximum-shear theory, with the handbook’s 75% working stress allowance for a keyway), diameter for a twist limit per metre, and diameter that keeps the first critical speed of the shaft with a central mass a margin above running speed — reporting which governs.",
    "uses": [
      "Size a drive shaft for a motor, pulley or fan",
      "Check whether stiffness or whirling governs rather than strength",
      "Decide a shaft size before detailed design"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Engineering managers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n": "Shaft speed.",
      "M": "Largest bending moment on the shaft from belt pull, gear forces and weights.",
      "Km": "Combined shock and fatigue factor for bending (1.5 for gradually applied, rotating loads).",
      "Kt": "Combined shock and fatigue factor for torsion.",
      "tau": "Allowable shear stress for the shaft material.",
      "key": "Whether the critical section has a standard keyway.",
      "twist": "Allowable angle of twist per metre of length.",
      "G": "Shear modulus.",
      "E": "Elastic modulus.",
      "rho": "Density of the shaft material.",
      "L": "Distance between bearings.",
      "mass": "Mass carried at mid-span.",
      "ratio": "How far above running speed the first critical speed must be."
    },
    "outputs": [
      "Diameter for strength",
      "Diameter for twist",
      "Diameter for critical speed and the governing size"
    ],
    "method": [
      "Torque T = P ÷ ω; strength: d = [16 ÷ (π τ) √((K_m M)² + (K_t T)²)]^(1/3), with τ × 0.75 for a keyway.",
      "Twist: J ≥ T ÷ (G θ), d = (32 J ÷ π)^(1/4).",
      "Critical speed ≈ 946 ÷ √δ rpm (δ in mm), with δ the static deflection of the simply supported shaft under the central mass plus its own weight; solved for d.",
      "Example: 15 kW at 1450 rpm with 150 N·m of bending needs a 41.295 mm shaft; twist governs."
    ],
    "limitations": [
      "Simply supported span with one central mass; overhung loads and several masses need a fuller analysis.",
      "Stress concentrations other than a standard keyway need their own factors.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When twist governs, a slightly larger diameter is often cheaper than a stronger material."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "milling-cut-planner": {
    "purpose": "Milling set-up from cutter and cut data: spindle speed from cutting speed (capped at the spindle limit), feed per tooth raised to keep the target maximum chip thickness at light radial engagement, table feed and removal rate, average chip thickness and specific cutting force (Kienzle), cutting power and torque against the machine’s power, and the feed that would use full power.",
    "uses": [
      "Program a new milling cut quickly and safely",
      "Check whether a roughing cut fits the spindle power",
      "Raise feed for light radial cuts without overloading"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Cutter diameter.",
      "z": "Teeth (inserts) on the cutter.",
      "Vc": "Recommended cutting speed for the tool and material.",
      "hex": "Maximum chip thickness the tool maker recommends.",
      "ae": "Radial width of cut.",
      "ap": "Axial depth of cut.",
      "kappa": "Lead angle of the cutting edge (90° for square shoulder).",
      "kc1": "Specific cutting force at 1 mm chip thickness for the material.",
      "mc": "Kienzle exponent for the material.",
      "nmax": "Spindle speed limit.",
      "Pmax": "Rated spindle power.",
      "eta": "Efficiency from motor to cutter."
    },
    "outputs": [
      "Spindle speed, feed per tooth and table feed",
      "Chip thickness, removal rate and power",
      "Torque and full-power feed"
    ],
    "method": [
      "n = 1000 V_c ÷ π D (capped at the spindle limit).",
      "Below half-diameter engagement f_z = h_ex D ÷ [2√(a_e (D − a_e))] ÷ sin κ; otherwise h_ex ÷ sin κ.",
      "v_f = f_z z n; MRR = a_e a_p v_f; engagement angle φ = arccos(1 − 2a_e ÷ D); h_m = 360 f_z sin κ a_e ÷ (π D φ).",
      "k_c = k_c1.1 h_m^(−mc); P = MRR k_c ÷ 60×10⁶ ÷ η; feed for full power ∝ (P_max ÷ P)^(1 ÷ (1 − mc)).",
      "Example: a 50 mm, 4-tooth cutter at 180 m/min runs at 1,145.9 rpm and 572.96 mm/min, using 3.1707 kW."
    ],
    "limitations": [
      "Average power; peak torque on few-tooth cutters is higher.",
      "Material constants and tool recommendations come from the tool maker.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If spindle power limits, reduce axial depth before feed; feed per tooth controls tool life and finish."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101, 1162–1167. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
