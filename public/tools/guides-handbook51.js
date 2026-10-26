// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook51).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "c-frame-throat-check": {
    "purpose": "Check of the throat section of an open-gap C-frame (press frame, punch frame, clamp or hook-shaped bracket) under the working force: direct tension plus bending from the force acting at the gap depth, with the curved-beam stresses at the inner and outer fibres from the neutral-axis shift (as the curved beam tool), the straight-beam combined stress for comparison (as the combined axial and bending stress tool), the curvature factor, and the throat depth needed to bring the inner fibre to your allowable.",
    "uses": [
      "Check a C-frame press or punch frame",
      "Size the throat of a clamp or bracket",
      "Show why the inside corner of a frame cracks first"
    ],
    "users": [
      "Machine designers",
      "Press tool designers",
      "Design engineers"
    ],
    "inputs": {
      "P": "Force the frame resists across its gap (press tonnage, clamp force).",
      "a": "Horizontal distance from the line of the force to the inner face of the throat.",
      "h": "Depth of the rectangular throat section from inner to outer face.",
      "b": "Width of the throat section (total thickness of the side plates for a plate frame).",
      "ri": "Radius of the inside corner of the throat, measured to the inner face.",
      "allow": "Allowable tensile stress for the frame material and duty."
    },
    "outputs": [
      "Curved-beam inner and outer fibre stresses",
      "Straight-beam stress and curvature factor",
      "Throat depth needed"
    ],
    "method": [
      "Moment = P × (a + h ÷ 2) about the section centroid.",
      "Curved beam: r_n = h ÷ ln(r_o ÷ r_i), e = r_c − r_n; σ_i = P ÷ A + M (r_n − r_i) ÷ (A e r_i); σ_o = P ÷ A − M (r_o − r_n) ÷ (A e r_o) (as the curved beam tool).",
      "Straight beam σ = P ÷ A + 6M ÷ b h² (as the combined axial and bending stress tool); depth needed found by solving σ_i = allowable.",
      "Example: the inner corner carries 99.063 MPa against 60 MPa by straight-beam theory (×1.651); a 258.48 mm throat meets 120 MPa."
    ],
    "limitations": [
      "Rectangular throat; I or T sections need their own neutral-axis shift.",
      "Static stress; press frames also need a fatigue and gap-deflection check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The tighter the corner radius, the more the inner fibre stress exceeds the straight-beam value."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218, 257–260. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-pattern-hole-plan": {
    "purpose": "Plan for a circular bolt pattern with clearance holes: hole coordinates, chord between adjacent holes, ligament, edge distances and wrench clearance with the holes at their largest (least-material) size (as the bolt circle layout tool), and the position tolerance at maximum material for floating or fixed fasteners with the bonus available at the largest hole (as the fastener position tolerance tool), checked against the least tolerance your shop can hold.",
    "uses": [
      "Lay out and tolerance a flange bolt pattern",
      "Check a pattern before drilling",
      "Decide whether fixed or floating fasteners work"
    ],
    "users": [
      "Design engineers",
      "Drafters",
      "CNC programmers"
    ],
    "inputs": {
      "BCD": "Diameter of the bolt circle.",
      "n": "Number of equally spaced holes.",
      "start": "Angle of the first hole from the X axis.",
      "F": "Largest size of the fastener.",
      "Hm": "Smallest size of the clearance hole.",
      "Hl": "Largest size of the clearance hole.",
      "mode": "Floating: clearance holes in both parts; fixed: one part is threaded or has pressed studs.",
      "share": "For fixed fasteners, how the total tolerance is split between the clearance-hole part and the threaded part.",
      "OD": "Outside diameter of the flange.",
      "ID": "Bore of the flange (0 for none).",
      "wrench": "Diameter the socket or wrench needs around each fastener.",
      "minLig": "Least metal you accept between adjacent holes.",
      "minEdge": "Least metal from a hole to the flange edge or bore.",
      "minTol": "Smallest position tolerance your drilling process holds reliably."
    },
    "outputs": [
      "Hole coordinates, chord and ligament",
      "Edge distances and wrench clearance",
      "Position tolerance and bonus"
    ],
    "method": [
      "Hole k at angle start + k × 360 ÷ n on radius BCD ÷ 2; chord = BCD sin(π ÷ n); ligament = chord − largest hole; edge distances to the outside and bore (as the bolt circle layout tool).",
      "Floating fasteners: T = H − F for each part; fixed: T = H − F shared between the parts (as the fastener position tolerance tool).",
      "Bonus at the largest hole = H_LMC − H_MMC; total allowed = T + bonus.",
      "Example: the clearance holes may be 1 mm out of position at MMC (1.3 mm at LMC); the ligament is 59.411 mm."
    ],
    "limitations": [
      "Equally spaced holes on one circle.",
      "Position tolerance from fastener clearance only; mating parts need the same datum scheme.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the tolerance is too tight to make, use larger clearance holes or floating rather than fixed fasteners."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 686, 615–627. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME Y14.5-2018 Dimensioning and Tolerancing"
    ]
  },
  "interference-fit-limits-check": {
    "purpose": "Check of an interference fit over its full tolerance range: the hole and shaft tolerances from the IT grades for the size (as the ISO tolerance grade tool), with a basic hole and your shaft lower deviation; the least and most interference; contact pressure and holding torque at the least interference against the torque times your slip factor; hub stress and safety factor at the most interference; press-in force and heating temperature for assembly at the most (as the press and shrink fit tool).",
    "uses": [
      "Choose a shaft tolerance for a press-fitted gear or coupling",
      "Check a fit over its whole tolerance band",
      "Set the heating temperature for shrinking on"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Nominal diameter of the fit.",
      "gh": "IT grade of the hole (basic hole: the hole’s lower deviation is zero).",
      "gs": "IT grade of the shaft.",
      "ei": "Lower deviation of the shaft from nominal for the fit you want (positive for an interference fit; from your fit standard).",
      "D": "Outside diameter of the hub.",
      "di": "Bore of a hollow shaft.",
      "L": "Length of the fit.",
      "mu": "Friction coefficient at the interface.",
      "Eh": "Elastic modulus of the hub.",
      "nuh": "Poisson’s ratio of the hub.",
      "Es": "Elastic modulus of the shaft.",
      "nus": "Poisson’s ratio of the shaft.",
      "Sy": "Yield strength of the hub.",
      "req": "Safety factor you need on hub yield.",
      "alpha": "Expansion coefficient of the hub for shrink assembly.",
      "clear": "Clearance wanted when the heated hub is slid on.",
      "Treq": "Torque the fit must transmit.",
      "SF": "Safety factor against slipping."
    },
    "outputs": [
      "Hole and shaft limits, least and most interference",
      "Pressure and holding torque at least interference",
      "Hub stress, press force and heating temperature at most interference"
    ],
    "method": [
      "IT values from the standard tolerance unit i = 0.45 ∛D + 0.001 D for the size step (as the ISO tolerance grade tool); hole 0 to +IT_h; shaft ei to ei + IT_s.",
      "Least interference = ei − IT_h; most = ei + IT_s.",
      "p = δ ÷ {d [(k_h + ν_h) ÷ E_h + (k_s − ν_s) ÷ E_s]}; holding torque = μ p π d² L ÷ 2; hub von Mises stress, press force and heating ΔT = (δ + clearance) ÷ (α d) (as the press and shrink fit tool).",
      "Example: interference 20.02–60.612 µm; it holds 1,061.4 N·m at the least and the hub has a factor of 1.6498 at the most."
    ],
    "limitations": [
      "Thick-cylinder theory; long hubs and stepped shafts concentrate stress at the hub ends.",
      "Surface smoothing reduces the effective interference slightly; allow for it with fine finishes ignored.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The tolerance band must keep both ends working: enough grip at the least interference and no yield at the most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 631–634, 635–668. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 286-1:2010 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes"
    ]
  },
  "pontoon-float-check": {
    "purpose": "Check of a float or raft supported on horizontal cylindrical drums or pipes: the total buoyancy of the fully submerged drums against the weight (as the buoyancy tool), the water volume to be displaced, the immersed segment area per drum and the draft found by solving the circular segment area (as the circular segment tool), freeboard, and reserve buoyancy, checked against your least freeboard and reserve.",
    "uses": [
      "Size a work raft or pump pontoon",
      "Check a floating walkway",
      "Find the payload for a set of drums"
    ],
    "users": [
      "Maintenance engineers",
      "Plant engineers",
      "Fabrication supervisors"
    ],
    "inputs": {
      "n": "Number of identical drums or pipes, lying horizontally.",
      "D": "Outside diameter of each drum.",
      "L": "Length of each drum.",
      "mDrum": "Mass of one drum.",
      "mDeck": "Mass of the deck, frame and fittings.",
      "pay": "Mass of people, equipment and stores carried.",
      "rho": "Density of the water (fresh about 1000, sea about 1025).",
      "minFb": "Least height of drum above the water you accept.",
      "minRes": "Least spare buoyancy as a share of the weight (allows for uneven loading and waves)."
    },
    "outputs": [
      "Total weight, full buoyancy and displaced volume",
      "Draft and freeboard",
      "Reserve buoyancy"
    ],
    "method": [
      "Full buoyancy = ρ g × n × π D² L ÷ 4 (as the buoyancy tool); displaced volume = total mass ÷ ρ.",
      "Immersed area per drum = displaced volume ÷ (n L); the draft h is found from the segment area r² (θ − sin θ) ÷ 2 with θ = 2 cos⁻¹[(r − h) ÷ r] (as the circular segment tool).",
      "Freeboard = D − h; reserve = (full volume − displaced) ÷ displaced.",
      "Example: the raft floats 272.68 mm deep with 327.32 mm freeboard and 126.19% reserve buoyancy."
    ],
    "limitations": [
      "Level float with the load centred; off-centre loads heel the raft and reduce freeboard on one side.",
      "Sealed drums; a leaking drum loses all its buoyancy.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep reserve buoyancy high on rafts that carry people, because they move to one side."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3027, 77–80. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spade-drilling-plan": {
    "purpose": "Plan for drilling a large hole with a spade drill: spindle speed from the cutting speed held to the machine maximum, metal removal rate, cutting and motor power with a tool wear allowance and thrust (as the spade drilling power tool), drilling time for the depth plus approach, checked against the motor power and the machine’s thrust limit.",
    "uses": [
      "Check a machine for large-diameter drilling",
      "Set feed so the thrust stays within the spindle limit",
      "Estimate drilling time"
    ],
    "users": [
      "Machinists",
      "Process planners",
      "CNC programmers"
    ],
    "inputs": {
      "D": "Diameter of the spade drill.",
      "vc": "Cutting speed at the drill periphery (your value for the material).",
      "f": "Feed per spindle revolution.",
      "depth": "Depth of the hole.",
      "appr": "Extra travel for approach and breakthrough.",
      "ukw": "Unit power of the work material.",
      "em": "Mechanical efficiency of the spindle drive.",
      "dull": "Extra power and thrust for a worn drill.",
      "nmax": "Highest spindle speed of the machine.",
      "avail": "Spindle motor power.",
      "thrustMax": "Largest thrust the feed drive and spindle bearings take."
    },
    "outputs": [
      "Spindle speed and metal removal rate",
      "Motor power and thrust",
      "Drilling time"
    ],
    "method": [
      "n = min(1000 v_c ÷ π D, n_max).",
      "MRR = π D² ÷ 4 × f × n; cutting power = unit power × MRR × wear allowance; motor power = cutting ÷ efficiency; thrust from the handbook relation for spade drills (as the spade drilling power tool).",
      "Time = (depth + approach) ÷ (f × n).",
      "Example: at 238.73 rpm the drill needs 5.0484 kW and 12,116 N thrust; each hole takes 54.454 s."
    ],
    "limitations": [
      "Through or blind holes with good chip removal; deep holes need pecking or coolant-fed drills.",
      "Unit power and wear allowance as entered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the thrust is too high, reduce the feed: thrust falls in proportion while the power falls too."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1077–1079. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thrust-pad-bearing-check": {
    "purpose": "Check of a flat or tilting-pad thrust bearing: pad area from the ring and pad coverage, unit load, mean sliding velocity and PV (as the thrust bearing pad tool) against your allowable values, friction power loss from the friction coefficient, and the oil flow needed to remove that heat for the allowed oil temperature rise (as the coolant flow for a heat load tool) against the oil supply.",
    "uses": [
      "Check a thrust collar or pad bearing",
      "Size the oil supply for a thrust bearing",
      "Compare pad areas for a new load"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Lubrication engineers"
    ],
    "inputs": {
      "Do": "Outside diameter of the thrust ring.",
      "Di": "Inside diameter of the thrust ring.",
      "fill": "Share of the ring covered by pads (the rest is oil grooves).",
      "W": "Axial load on the bearing.",
      "rpm": "Shaft speed.",
      "mu": "Friction coefficient of the running bearing (from its type and lubrication).",
      "dT": "Rise in oil temperature you accept through the bearing.",
      "cp": "Specific heat of the oil.",
      "rho": "Density of the oil.",
      "Pallow": "Allowable unit load for the bearing material and type.",
      "PVallow": "Allowable PV for the bearing material and type.",
      "supply": "Oil flow available to the bearing."
    },
    "outputs": [
      "Pad area, unit load, velocity and PV",
      "Friction power loss",
      "Oil flow needed"
    ],
    "method": [
      "Area = π (D_o² − D_i²) ÷ 4 × coverage; P = W ÷ area; V = π (D_o + D_i) ÷ 2 × n; PV (as the thrust bearing pad tool).",
      "Friction loss = μ W V.",
      "Oil flow = loss ÷ (ρ c_p ΔT) (as the coolant flow for a heat load tool).",
      "Example: 1.9771 MPa, PV 17.857; friction wastes 903.21 W, needing 2.2089 L/min of oil."
    ],
    "limitations": [
      "Uniform load over the pads; misalignment concentrates load on some pads.",
      "The friction coefficient must suit the regime (boundary, mixed or full film).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If PV is too high, more pad area or a lower speed helps; if the oil flow is short, raise the allowed rise only within the oil’s limits."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2338–2356, 371–374. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tube-post-eccentric-check": {
    "purpose": "Check of a round tube post or strut carrying an axial load at an eccentricity (a bracket, a sign arm or an offset beam seat): area, second moment, radius of gyration and slenderness of the tube, Euler buckling load, and the secant-formula peak stress and load factor to first yield (as the eccentrically loaded column tool), checked against your load factor and slenderness limit.",
    "uses": [
      "Check a pipe post carrying a bracket load",
      "Size a column with an offset beam seat",
      "Check a cantilever sign post in compression"
    ],
    "users": [
      "Structural designers",
      "Design engineers",
      "Fabrication engineers"
    ],
    "inputs": {
      "OD": "Outside diameter of the tube.",
      "t": "Wall thickness of the tube.",
      "L": "Length of the post or strut.",
      "K": "Effective length factor for the end fixity (2 for a free-standing post fixed at the base).",
      "P": "Axial compressive load.",
      "e": "Distance from the tube centreline to the line of the load.",
      "E": "Elastic modulus.",
      "Sy": "Yield strength of the tube.",
      "req": "Factor on load you need before first yield.",
      "slMax": "Largest slenderness ratio your code allows."
    },
    "outputs": [
      "Section properties and slenderness",
      "Euler load and peak stress",
      "Load factor to yield"
    ],
    "method": [
      "A = π (D² − d²) ÷ 4; I = π (D⁴ − d⁴) ÷ 64; r = √(I ÷ A); slenderness = K L ÷ r.",
      "σ_max = P ÷ A [1 + (e c ÷ r²) sec(K L ÷ 2r × √(P ÷ A E))] (as the eccentrically loaded column tool).",
      "Load factor = the multiple of P at which σ_max reaches yield.",
      "Example: the tube peaks at 32.093 MPa; yield comes at 4.4217 × the load; KL/r = 156.46."
    ],
    "limitations": [
      "Elastic secant formula to first yield; it does not include residual stresses or initial crookedness beyond the eccentricity.",
      "Local buckling of thin walls is not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Eccentricity, not slenderness, usually controls short posts: move the load line closer to the centre if you can."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–287, 234–246. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hot-surface-insulation-check": {
    "purpose": "Check of insulation for a hot flat surface (tank wall, oven casing, duct): bare-surface loss by radiation (as the radiant heat loss tool) plus convection, insulated loss through the insulation and the outer surface film (as the layered wall heat flow tool), the outer surface temperature against your touch limit, the yearly energy saving and the payback of the insulation cost.",
    "uses": [
      "Justify insulating a tank, oven or duct",
      "Choose an insulation thickness for personnel protection",
      "Estimate energy saved by lagging"
    ],
    "users": [
      "Energy managers",
      "Maintenance engineers",
      "Plant engineers"
    ],
    "inputs": {
      "area": "Area of the hot surface.",
      "Ts": "Temperature of the hot surface (the metal under any insulation).",
      "Ta": "Temperature of the surrounding air and surfaces.",
      "eps": "Emissivity of the bare surface.",
      "hc": "Natural or forced convection coefficient of the bare surface.",
      "t": "Thickness of the insulation.",
      "k": "Thermal conductivity of the insulation at its mean temperature.",
      "hout": "Combined convection and radiation film coefficient of the insulated outer surface (cladding).",
      "hours": "Hours per year the surface is hot.",
      "price": "Cost of a kilowatt-hour of heat delivered.",
      "cost": "Installed cost of the insulation and cladding per square metre.",
      "touch": "Highest outer surface temperature allowed for people.",
      "payMax": "Longest payback you accept."
    },
    "outputs": [
      "Bare loss by radiation and convection",
      "Insulated loss and outer surface temperature",
      "Saving and payback"
    ],
    "method": [
      "Radiation = ε σ A (T_s⁴ − T_a⁴) (as the radiant heat loss tool); convection = h_c A (T_s − T_a).",
      "Insulated: U = 1 ÷ (t ÷ k + 1 ÷ h_out); loss = U A ΔT; outer surface = T_a + U ΔT ÷ h_out (as the layered wall heat flow tool).",
      "Saving = (bare − insulated) × hours × price; payback = insulation cost ÷ saving.",
      "Example: bare it loses 33.151 kW, insulated 1.2963 kW; the outer surface runs at 37.963 °C and the insulation pays back in 0.4709 months."
    ],
    "limitations": [
      "Flat surface; pipes need the cylindrical form.",
      "Film coefficients as entered; wind raises the bare loss considerably.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The first few millimetres of insulation save the most: extra thickness is often set by the touch temperature rather than by energy."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "plug-gauge-plan": {
    "purpose": "Plan for go and no-go limit gauges for a hole or shaft: the IT tolerance for the size and grade (as the ISO tolerance grade tool) placed by your fundamental deviation (lower deviation of a hole, upper deviation of a shaft), the go and no-go gauge size ranges with gauge tolerance and go-gauge wear allowance as shares of the work tolerance (as the go and no-go gauge tool), and a check that the gauge tolerance is not smaller than your gauge maker can hold.",
    "uses": [
      "Order plug or ring gauges for a toleranced feature",
      "Check whether a grade can be gauged by fixed gauges",
      "Set gauge sizes on an inspection plan"
    ],
    "users": [
      "Quality engineers",
      "Inspectors",
      "Toolroom staff"
    ],
    "inputs": {
      "feature": "Whether the feature is a hole (plug gauges) or a shaft (ring or snap gauges).",
      "size": "Nominal size of the feature.",
      "grade": "IT tolerance grade.",
      "dev": "Fundamental deviation from your fit standard: the lower deviation of a hole (0 for H) or the upper deviation of a shaft (0 for h).",
      "gpct": "Gauge-making tolerance as a share of the work tolerance.",
      "wpct": "Wear allowance on the go gauge as a share of the work tolerance.",
      "minG": "Smallest gauge tolerance your gauge supplier can make."
    },
    "outputs": [
      "Work tolerance and limits",
      "Go and no-go gauge size ranges",
      "Gauge makeability"
    ],
    "method": [
      "IT value from the standard tolerance unit for the size step (as the ISO tolerance grade tool); hole: lower = size + EI, upper = lower + IT; shaft: upper = size + es, lower = upper − IT.",
      "Go gauge at the maximum-material limit plus wear allowance; no-go at the least-material limit; each with the gauge tolerance inside the work limits (as the go and no-go gauge tool).",
      "Makeable if the gauge tolerance is not below the gauge maker’s limit.",
      "Example: limits 25–25.021 mm (IT 20.918 µm); go 25.001–25.003 mm, no-go 25.019–25.021 mm."
    ],
    "limitations": [
      "Gauge tolerance and wear allowance set as shares of the work tolerance; your gauge standard may set them differently.",
      "Sizes up to 500 mm.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fine grades leave very little gauge tolerance: below about IT6 measure with comparators instead of fixed gauges."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 661–663, 705–708, 635–668. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 286-1:2010 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes"
    ]
  }
});
