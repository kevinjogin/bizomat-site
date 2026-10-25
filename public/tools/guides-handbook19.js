// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook19).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "uniform-acceleration": {
    "purpose": "Final velocity and distance from initial velocity, acceleration and time; the acceleration and time needed to change speed over a distance; and the impact speed and time of a body falling from a height.",
    "uses": [
      "Size a conveyor or slide acceleration ramp",
      "Check stopping distance for a decelerating carriage",
      "Estimate the impact speed of a dropped part"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "mode": "Choose which values you know.",
      "u": "Velocity at the start (downward for a fall).",
      "a": "Constant acceleration; enter a negative value for braking.",
      "t": "Duration of the acceleration.",
      "v": "Velocity at the end of the distance.",
      "s": "Distance over which the speed changes.",
      "h": "Height of the fall."
    },
    "outputs": [
      "Final velocity",
      "Distance travelled or acceleration needed",
      "Time taken"
    ],
    "method": [
      "v = u + a t and s = u t + ½ a t².",
      "a = (v² − u²) ÷ 2 s and t = 2 s ÷ (u + v).",
      "Falling body: v = √(u² + 2 g h), t = (v − u) ÷ g, with g = 9.80665 m/s².",
      "Example: from rest at 2 m/s² for 5 s a body reaches 10 m/s after 25 m."
    ],
    "limitations": [
      "Constant acceleration only; real drives ramp acceleration (jerk limits).",
      "Air resistance is neglected for falling bodies.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For a fall the impact energy is m g h; use it with an impact or shock-load tool to size the stop."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 175–181. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "angular-acceleration-torque": {
    "purpose": "Angular acceleration, accelerating torque, total torque with friction, revolutions turned during the run-up, kinetic energy stored and the peak power at the end of acceleration for a load of known moment of inertia.",
    "uses": [
      "Check that a motor can start a heavy rotating load",
      "Set an acceleration ramp on a drive",
      "Estimate the energy to bring a spindle or drum to speed"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "J": "Moment of inertia about the axis of rotation (from a mass-inertia tool or the supplier), referred to the shaft being driven.",
      "n0": "Speed at the start.",
      "n1": "Speed at the end.",
      "t": "Time allowed for the speed change.",
      "Tf": "Steady torque from friction and the load during acceleration."
    },
    "outputs": [
      "Angular acceleration",
      "Accelerating and total torque",
      "Revolutions and energy during run-up"
    ],
    "method": [
      "α = (ω₁ − ω₀) ÷ t, with ω = 2π n ÷ 60.",
      "Accelerating torque = J α; total torque = J α + friction torque.",
      "Revolutions = (n₀ + n₁) ÷ 2 × t ÷ 60; energy change = ½ J (ω₁² − ω₀²); peak power = total torque × ω₁.",
      "Example: 0.5 kg·m² to 1500 rpm in 2 s needs 41.27 N·m."
    ],
    "limitations": [
      "Constant acceleration; a motor’s torque varies with speed.",
      "Inertia must be referred to the same shaft (multiply by the speed ratio squared through gearing).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare the total torque with the motor’s accelerating torque across the speed range, not just its rated torque."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 176–181. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "impulse-momentum": {
    "purpose": "Average force from the change in momentum over a time (linear impulse), and the velocities of two bodies after a direct central impact with a coefficient of restitution, with the kinetic energy lost.",
    "uses": [
      "Estimate the force on a stop or buffer from the stopping time",
      "Predict the rebound after two parts collide",
      "Estimate the energy absorbed in an impact"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "mode": "Choose the calculation.",
      "m": "Mass of the body.",
      "v0": "Velocity at the start (signed along one line).",
      "vf": "Velocity at the end (signed).",
      "t": "Duration of the force (stopping or acceleration time).",
      "m1": "Mass of the first body.",
      "v1": "Its velocity before impact (signed).",
      "m2": "Mass of the second body.",
      "v2": "Its velocity before impact (signed).",
      "e": "1 for a perfectly elastic impact, 0 for perfectly plastic (bodies move together); measure or estimate for your materials."
    },
    "outputs": [
      "Average force or velocities after impact",
      "Momentum",
      "Kinetic energy lost"
    ],
    "method": [
      "Linear impulse equals the change in momentum: F t = m (v_f − v₀).",
      "Collision: v₁′ = [m₁v₁ + m₂v₂ − m₂ e (v₁ − v₂)] ÷ (m₁ + m₂) and v₂′ = [m₁v₁ + m₂v₂ + m₁ e (v₁ − v₂)] ÷ (m₁ + m₂).",
      "Energy lost = initial minus final kinetic energy.",
      "Example: 10 kg from 0 to 5 m/s in 0.1 s needs an average force of 500 N."
    ],
    "limitations": [
      "Average force only; peak force in an impact is usually several times higher.",
      "Direct central impact along one line.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A softer buffer that lengthens the stopping time lowers the force in proportion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 184–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pendulum-period": {
    "purpose": "Period and frequency of a simple pendulum, a compound (physical) pendulum from its radius of gyration, a conical pendulum, and a torsional pendulum made of a disc on a slender rod, with a large-amplitude correction for swinging pendulums.",
    "uses": [
      "Measure a part’s moment of inertia by swinging it",
      "Check the natural frequency of a hanging load",
      "Design a torsion-rod timing or test device"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "type": "Choose the pendulum type.",
      "L": "Cord length from pivot to the bob centre, or the free length of the torsion rod.",
      "amp": "Amplitude of swing either side of vertical; small swings need no correction.",
      "k0": "Radius of gyration of the body about the pivot axis.",
      "rcg": "Distance from the pivot to the body’s centre of gravity.",
      "theta": "Angle of the cord from vertical while the bob circles.",
      "M": "Mass of the disc.",
      "Rd": "Radius of the disc.",
      "d": "Diameter of the torsion rod.",
      "G": "Shear modulus of the rod material."
    },
    "outputs": [
      "Period of one complete cycle",
      "Frequency",
      "Equivalent simple-pendulum length"
    ],
    "method": [
      "Simple: T = 2π √(l ÷ g). Compound: T = 2π √(k₀² ÷ g r).",
      "Conical: T = 2π √(l cos θ ÷ g) for one revolution.",
      "Torsional: T = 2π √(J ÷ k) with J = M R² ÷ 2 and k = G π d⁴ ÷ 32 l (the handbook’s SI form T = 8 √(π M R² l ÷ d⁴ G)).",
      "Large swings: period × (1 + θ₀² ÷ 16), θ₀ in radians.",
      "Example: a 1 m simple pendulum has a period of 2.0064 s."
    ],
    "limitations": [
      "Small-angle formulas are about 1% low at 22° and 2% low at 32° amplitude; the correction shown covers moderate swings.",
      "Damping and pivot friction are neglected.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "To find an unknown moment of inertia, time many swings and solve the compound formula for k₀."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 173–174. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flyball-governor": {
    "purpose": "Height of a loaded (Porter) or simple conical-pendulum fly-ball governor at a given speed, the sleeve movement between two speeds, and the coefficient of speed variation used to compare governor sensitiveness.",
    "uses": [
      "Check the sleeve travel of a centrifugal governor",
      "Compare loaded and simple governors for a speed range",
      "Restore or replicate a mechanical speed regulator"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "w": "Mass of one fly-ball.",
      "c": "Mass of the central sliding load on the spindle (Porter governor); 0 for an unloaded Watt governor.",
      "n": "Speed of the governor spindle.",
      "nmax": "Highest speed within the governor’s range of action.",
      "nmin": "Lowest speed within the range."
    },
    "outputs": [
      "Governor height at the speed",
      "Sleeve height change across the range",
      "Coefficient of speed variation"
    ],
    "method": [
      "h = (g ÷ ω²) × (c + w) ÷ w — the handbook’s h = 2933 ÷ n² × (c + w) ÷ w in feet; c = 0 gives the simple pendulum governor.",
      "Coefficient of speed variation C = (M − M₁) ÷ m, with m the mean speed.",
      "Example: 2 kg balls with a 10 kg load run at a height of 134.14 mm at 200 rpm."
    ],
    "limitations": [
      "Arms pivoted on the spindle axis with equal arm and link lengths; friction is neglected.",
      "Spring-loaded (Hartnell) governors need a spring force balance instead.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger central load raises the working speed for the same height and makes the governor usable at higher speeds."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3453–3455. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "geneva-mechanism": {
    "purpose": "Geometry and timing of an external Geneva wheel with slots tangent to the roller path at entry and exit: crank radius, wheel radius, minimum slot length, driver angle for indexing, index and dwell times, and the peak speed ratio of the wheel.",
    "uses": [
      "Lay out a Geneva drive for an indexing table",
      "Check the index and dwell times against a process cycle",
      "Estimate peak wheel speed for inertia loads"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Automation engineers"
    ],
    "inputs": {
      "n": "Number of radial slots in the driven wheel (indexes per revolution of the wheel).",
      "C": "Distance between the driver and wheel centres.",
      "rpm": "Speed of the driving crank.",
      "roller": "Diameter of the drive roller (sets the slot width)."
    },
    "outputs": [
      "Crank radius and wheel radius",
      "Index and dwell time",
      "Peak wheel speed"
    ],
    "method": [
      "For slots tangent to the roller path: crank radius a = C sin(180° ÷ n); wheel radius to the slot mouth b = C cos(180° ÷ n).",
      "Driver angle while indexing = 180° − 360° ÷ n; index time = that fraction of one driver revolution.",
      "Peak wheel-to-driver speed ratio (roller on the centre line) = λ ÷ (1 − λ), with λ = sin(180° ÷ n).",
      "Minimum slot length from the mouth = a + b − C, plus the roller radius and clearance.",
      "Example: a 4-slot wheel on 100 mm centres needs a 70.711 mm crank and indexes in 0.25 s at 60 rpm."
    ],
    "limitations": [
      "External Geneva with radial slots; internal and spherical Geneva drives differ.",
      "Acceleration at roller entry is high for 3 and 4 slots; check inertia loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More slots give a smoother index but a smaller index angle per driver revolution."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gyroscope-precession": {
    "purpose": "Gyroscopic couple of a spinning rotor whose axis precesses (turns) at a given rate, from the rotor’s moment of inertia, spin speed and precession speed, and the resulting pair of bearing reactions.",
    "uses": [
      "Check bearing loads on a spindle mounted on a slewing or turning machine",
      "Estimate gyroscopic loads on vehicle or ship rotors",
      "Size a gyroscopic stabiliser"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "shape": "Shape used to estimate the moment of inertia, or enter it.",
      "M": "Mass of the rotor.",
      "R": "Outer radius of the rotor.",
      "J": "Polar moment of inertia of the rotor about its spin axis.",
      "ns": "Speed of the rotor about its own axis.",
      "np": "Rate at which the spin axis itself is turned (for example a slewing or turning rate).",
      "L": "Distance between the two bearings carrying the rotor."
    },
    "outputs": [
      "Gyroscopic couple",
      "Bearing reaction pair",
      "Angular momentum"
    ],
    "method": [
      "Angular momentum H = J ω_s.",
      "Gyroscopic couple = J ω_s Ω_p, about the axis perpendicular to both the spin and precession axes.",
      "Each bearing carries ± couple ÷ span, in opposite directions.",
      "Example: a 20 kg disc at 3000 rpm turned at 10 rpm exerts 131.59 N·m."
    ],
    "limitations": [
      "Steady precession at right angles to the spin axis.",
      "Add the gyroscopic reactions to the weight and other bearing loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The couple grows with both speeds; slowing the turning rate is often the easiest way to reduce it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2998. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "prony-brake": {
    "purpose": "Torque and power absorbed by a Prony brake or water brake from the brake arm length, the scale reading under load, the zero reading and the shaft speed, with the heat that must be carried away.",
    "uses": [
      "Measure the output power of a motor or engine on test",
      "Check a gearbox’s delivered torque",
      "Size cooling for a brake test rig"
    ],
    "users": [
      "Test engineers",
      "Maintenance engineers",
      "Engineering students"
    ],
    "inputs": {
      "L": "Horizontal distance from the shaft axis to the knife edge on the scale.",
      "tare": "Scale reading while the brake absorbs power.",
      "zero": "Scale reading with friction removed (average of slow forward and backward readings).",
      "n": "Speed of the braked pulley."
    },
    "outputs": [
      "Brake reading and torque",
      "Power absorbed",
      "Heat to remove"
    ],
    "method": [
      "Brake reading W = tare − zero reading.",
      "Torque = W L; power = 2π L n W ÷ 60 (the handbook’s H.P. = 2π L N W ÷ 33,000 in feet, rpm and pounds).",
      "All absorbed power becomes heat in the brake.",
      "Example: 200 N net on a 1 m arm at 600 rpm is 12.566 kW."
    ],
    "limitations": [
      "Steady running; readings fluctuate with friction changes.",
      "Water brakes need continuous water flow to remove the heat.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Take readings at several loads to plot the machine’s torque and power curve."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2998–2999. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "catenary-cable": {
    "purpose": "Exact catenary for a uniform cable or chain hanging between two supports at the same level: catenary parameter, horizontal and maximum tension, cable length and support angle, compared with the parabolic approximation.",
    "uses": [
      "Check the tension in a hanging cable, hose or chain",
      "Work out the cable length to order for a span and sag",
      "Set sag for festoon and catenary supply systems"
    ],
    "users": [
      "Structural engineers",
      "Electrical engineers",
      "Rigging supervisors"
    ],
    "inputs": {
      "S": "Horizontal distance between the supports (at the same level).",
      "d": "Vertical sag at mid-span.",
      "w": "Weight per unit length (mass per metre × 9.81, plus any uniform ice or attached load)."
    },
    "outputs": [
      "Horizontal and maximum tension",
      "Cable length",
      "Support angle"
    ],
    "method": [
      "y = a cosh(x ÷ a): the parameter a solves d = a [cosh(S ÷ 2a) − 1].",
      "Horizontal tension H = w a; maximum tension at the supports = w (a + d).",
      "Length = 2a sinh(S ÷ 2a); parabolic estimate H ≈ w S² ÷ 8 d.",
      "Example: 10 N/m over 100 m with 5 m sag carries 2,558.3 N at the supports."
    ],
    "limitations": [
      "Uniform weight along the cable, supports at equal level, inextensible cable.",
      "Concentrated loads and elastic stretch change the shape.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the sag roughly doubles the tension; tight cables carry very high loads."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2999. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rolling-resistance": {
    "purpose": "Rolling resistance force from the load, wheel radius and coefficient of rolling resistance (a length), the power to keep the load moving at a speed, and the comparison with sliding friction.",
    "uses": [
      "Size a drive or push force for a trolley or transfer car",
      "Choose wheel diameter and material for low effort",
      "Compare rolling with skidding a load"
    ],
    "users": [
      "Materials-handling engineers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "W": "Total weight or load carried by all the wheels.",
      "r": "Rolling radius of the wheels.",
      "f": "Coefficient of rolling resistance, a length depending on wheel and surface materials (from tests or supplier data).",
      "v": "Speed for the power estimate.",
      "mu": "Sliding coefficient to compare with dragging the load."
    },
    "outputs": [
      "Rolling resistance force",
      "Power at the speed",
      "Sliding force for comparison"
    ],
    "method": [
      "Rolling resistance = W f ÷ r, with f a length in the same units as r.",
      "Power = force × speed.",
      "Sliding force = μ W.",
      "Example: 10000 N on 150 mm wheels with f = 0.5 mm needs 33.333 N to keep rolling."
    ],
    "limitations": [
      "Level ground at steady speed; starting, slopes and bearing friction add to the force.",
      "Published coefficients vary widely; test where it matters.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Doubling the wheel diameter halves the rolling resistance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–167. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rotating-balance-plane": {
    "purpose": "Resultant unbalance of up to four masses at given radii and angles in a single plane of rotation, the counterweight mass and angle at a chosen radius that balances them, and the unbalance force at speed before correction.",
    "uses": [
      "Balance a lathe fixture or faceplate set-up",
      "Find the counterweight for an offset rotating part",
      "Estimate bearing load from unbalance at speed"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Maintenance engineers"
    ],
    "inputs": {
      "m1": "Mass of the first unbalanced item.",
      "r1": "Radius of its centre of gravity from the axis.",
      "a1": "Angular position measured from a reference line.",
      "m2": "Second mass.",
      "r2": "Its radius.",
      "a2": "Its angle.",
      "m3": "Third mass.",
      "r3": "Its radius.",
      "a3": "Its angle.",
      "m4": "Fourth mass (0 if unused).",
      "r4": "Its radius.",
      "a4": "Its angle.",
      "rc": "Radius at which the counterweight’s centre of gravity will sit.",
      "rpm": "Speed for the unbalance force before correction."
    },
    "outputs": [
      "Counterweight mass and angle",
      "Resultant unbalance",
      "Unbalance force at speed"
    ],
    "method": [
      "Resultant unbalance U = Σ mᵢ rᵢ ∠θᵢ (vector sum of mass × radius).",
      "Counterweight: m_c = |U| ÷ r_c, placed 180° from the resultant.",
      "Unbalance force = |U| ω².",
      "Example: the three masses need 31.666 g at 100 mm, at 209.91°."
    ],
    "limitations": [
      "All masses in one plane; masses in different planes need two-plane balancing.",
      "Mass × radius uses each item’s own centre of gravity.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the result by static balancing on parallels or a balancing stand."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 191–195. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "two-plane-balance": {
    "purpose": "Correction masses and angles in two chosen correction planes that balance up to three masses lying in different planes along a rotor, by taking moments about one correction plane.",
    "uses": [
      "Work out corrections for a long rotor or roll",
      "Balance a fixture with offset masses at different heights",
      "Check bearing loads from couple unbalance"
    ],
    "users": [
      "Maintenance engineers",
      "Machine designers",
      "Balancing technicians"
    ],
    "inputs": {
      "L": "Axial distance between the two correction planes.",
      "m1": "First unbalanced mass.",
      "r1": "Its radius.",
      "a1": "Its angle.",
      "z1": "Its axial distance from plane A (negative if outside, beyond A).",
      "m2": "Second mass.",
      "r2": "Its radius.",
      "a2": "Its angle.",
      "z2": "Its axial position.",
      "m3": "Third mass (0 if unused).",
      "r3": "Its radius.",
      "a3": "Its angle.",
      "z3": "Its axial position.",
      "rA": "Radius for the correction mass in plane A.",
      "rB": "Radius for the correction mass in plane B."
    },
    "outputs": [
      "Correction mass and angle in plane A",
      "Correction mass and angle in plane B",
      "Static and couple unbalance"
    ],
    "method": [
      "Moments about plane A: U_B = −Σ (mᵢ rᵢ ∠θᵢ) zᵢ ÷ L.",
      "Forces: U_A = −Σ (mᵢ rᵢ ∠θᵢ) − U_B.",
      "Correction mass = |U| ÷ correction radius in each plane.",
      "Example: corrections of 27.042 g in plane A and 19.526 g in plane B."
    ],
    "limitations": [
      "Rigid rotor below its first critical speed.",
      "Measured unbalance from a balancing machine is more reliable than calculated item masses.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the correction in one plane is tiny, a single-plane correction may be enough."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 191–195. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torsional-vibration": {
    "purpose": "Torsional stiffness of a connecting shaft and the torsional natural frequency of a single inertia on a shaft or of a motor and load joined by a shaft, compared with the servo or control bandwidth.",
    "uses": [
      "Check a servo axis for torsional resonance",
      "Choose a coupling or shaft stiff enough for the bandwidth",
      "Diagnose oscillation in a motion axis"
    ],
    "users": [
      "Automation engineers",
      "Servo and controls engineers",
      "Machine designers"
    ],
    "inputs": {
      "mode": "Two inertias on a free shaft, or one inertia on a shaft fixed at the other end.",
      "kMode": "Calculate the stiffness from a plain shaft or enter it (couplings and gearboxes in series reduce it).",
      "K": "Overall torsional stiffness between the inertias.",
      "G": "Shear modulus of the shaft.",
      "d": "Outside diameter.",
      "di": "Bore diameter for a hollow shaft.",
      "Ls": "Twisting length of the shaft.",
      "J1": "Motor rotor inertia.",
      "J2": "Load inertia referred to the same shaft.",
      "bw": "Closed-loop bandwidth of the drive or controller."
    },
    "outputs": [
      "Torsional stiffness",
      "Natural frequency",
      "Ratio to the control bandwidth"
    ],
    "method": [
      "Shaft stiffness K = G J_p ÷ L, with J_p = π (d⁴ − dᵢ⁴) ÷ 32.",
      "Single inertia: f_n = (1 ÷ 2π) √(K ÷ J_L), as in the handbook.",
      "Two inertias: f_n = (1 ÷ 2π) √[K (J₁ + J₂) ÷ (J₁ J₂)].",
      "Example: the drive resonates at 181.15 Hz against a 50 Hz bandwidth."
    ],
    "limitations": [
      "Lumped inertias on a massless shaft; first mode only.",
      "Couplings, keys and gear mesh add compliance and lower the frequency.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the resonance falls within the control bandwidth, stiffen the drive or add a notch filter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3412–3413. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "buoyancy": {
    "purpose": "Buoyant force by Archimedes’ principle, the apparent (submerged) weight of a body, whether it floats, and the fraction of its volume below the surface when it does.",
    "uses": [
      "Find the lifting force needed for a part underwater",
      "Check whether a float or tank will float and how deep",
      "Size ballast for a submerged structure"
    ],
    "users": [
      "Design engineers",
      "Rigging supervisors",
      "Process engineers"
    ],
    "inputs": {
      "V": "Total external volume of the body (displacement when fully submerged).",
      "mass": "Mass of the body.",
      "rho": "Density of the fluid (fresh water about 1000, sea water about 1025 kg/m³)."
    },
    "outputs": [
      "Buoyant force when fully submerged",
      "Apparent weight in the fluid",
      "Floating draught fraction"
    ],
    "method": [
      "Buoyant force = ρ g V (weight of fluid displaced).",
      "Apparent weight = m g − ρ g V.",
      "A body less dense than the fluid floats with ρ_body ÷ ρ_fluid of its volume submerged.",
      "Example: 10 L at 78.5 kg has a buoyant force of 98.067 N in 1000 kg/m³ fluid."
    ],
    "limitations": [
      "Static fluid; flow, waves and lift from motion are excluded.",
      "Floating stability (metacentric height) is not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When lifting a submerged load, the crane takes the full weight as the load clears the surface."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wind-pressure": {
    "purpose": "Dynamic pressure of wind from its speed and air density, the pressure on a surface with a shape (force) coefficient, the resulting force and its overturning moment about the base.",
    "uses": [
      "Check anchoring of an outdoor enclosure, sign or guard",
      "Estimate wind force on a crane load or panel being lifted",
      "Size fixings for a rooftop unit"
    ],
    "users": [
      "Structural engineers",
      "Rigging supervisors",
      "Site engineers"
    ],
    "inputs": {
      "V": "Design wind speed (from the applicable wind-load standard for structures).",
      "rho": "Air density; about 1.2 kg/m³ at sea level and 20 °C.",
      "Cd": "Force coefficient for the shape (from the wind-load standard or test).",
      "A": "Projected area facing the wind.",
      "h": "Lever arm from the base to the centre of pressure."
    },
    "outputs": [
      "Dynamic pressure",
      "Wind pressure and force",
      "Overturning moment"
    ],
    "method": [
      "Dynamic pressure q = ½ ρ V².",
      "Pressure on the surface p = C q; force F = p A; moment = F h.",
      "The handbook’s pressures (about 0.004 V² lb/ft² with V in mph) correspond to C ≈ 1.6 on this basis.",
      "Example: 20 m/s on 2 m² with C = 1.2 gives 576 N."
    ],
    "limitations": [
      "Steady wind; gusts and dynamic response are not included.",
      "Structures must be designed to the applicable wind-load standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pressure rises with the square of speed: doubling the wind speed quadruples the force."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3028. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "escaping-air-velocity": {
    "purpose": "Theoretical velocity of air escaping adiabatically from a large container by the handbook formula, the velocity actually reached at a plain orifice (limited to sonic when the flow chokes), and the mass and free-air flow through an orifice of given size.",
    "uses": [
      "Estimate air loss through a leak or blow-off nozzle",
      "Check whether a vent is choked",
      "Size an orifice for a purge flow"
    ],
    "users": [
      "Compressed-air engineers",
      "Maintenance engineers",
      "Process engineers"
    ],
    "inputs": {
      "p1": "Gauge pressure in the container.",
      "p2": "Absolute pressure outside the orifice (atmospheric is 1.01325 bar).",
      "T": "Air temperature in the container.",
      "k": "Ratio of specific heats: 1.4 for air (the handbook uses 1.41).",
      "d": "Diameter of the hole or nozzle.",
      "Cd": "Discharge coefficient of the orifice (sharp-edged about 0.6–0.65, rounded nozzle up to about 0.97; confirm for yours)."
    },
    "outputs": [
      "Escape velocity",
      "Whether the flow is choked",
      "Mass and free-air flow"
    ],
    "method": [
      "Handbook (adiabatic): v₂ = √{2 k ÷ (k − 1) × R T × [1 − (p₂ ÷ p₁)^((k−1)/k)]}, with R = 287 J/kg·K.",
      "When p₂ ÷ p₁ is below (2 ÷ (k + 1))^(k/(k−1)) ≈ 0.53 the orifice flow chokes and the velocity there is sonic: √(2 k R T ÷ (k + 1)).",
      "Mass flow through the orifice uses the compressible orifice equations; free-air flow at 1.01325 bar and 20 °C.",
      "Example: air at 6 bar gauge through a 2 mm hole escapes at 313.86 m/s and 168.16 L/min of free air."
    ],
    "limitations": [
      "Large container, steady flow, ideal gas.",
      "Higher pressure does not raise the orifice velocity once choked; it raises the mass flow.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the free-air flow with the compressor’s specific power to price a leak."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3037–3038. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ratchet-wheel-pitch": {
    "purpose": "Circular pitch of ratchet wheel teeth at the outside circumference for holding a suspended load, from the turning moment, face width, safe stress and number of teeth with the handbook’s tooth-number factor, and the resulting outside diameter.",
    "uses": [
      "Size a ratchet and pawl for a winch or hoist",
      "Check an existing ratchet against a higher load",
      "Choose tooth count and face width together"
    ],
    "users": [
      "Machine designers",
      "Lifting equipment designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "M": "Torque the ratchet must hold.",
      "L": "Width of the tooth face.",
      "S": "Safe working stress you allow for the ratchet material, reduced where shock loads occur.",
      "Nt": "Number of teeth on the wheel."
    },
    "outputs": [
      "Circular pitch at the outside",
      "Outside diameter",
      "Factor used"
    ],
    "method": [
      "P = √(F M ÷ L S N), with M in N·mm, L in mm and S in MPa.",
      "F = 50 for 12 teeth or fewer, 35 for 13 to 20 teeth and 20 for more than 20 teeth (handbook).",
      "Outside diameter = P N ÷ π.",
      "Example: 200 N·m on a 16-tooth, 25 mm wide ratchet needs a 29.58 mm pitch."
    ],
    "limitations": [
      "Crane-design rule for holding ratchets; check the pawl, its pin and the hub separately.",
      "Shock loading needs a lower safe stress.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A wider face or a stronger material reduces the pitch and wheel diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2215–2217. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
