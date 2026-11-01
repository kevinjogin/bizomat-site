// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook96).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "modified-constant-velocity-cam": {
    "purpose": "Modified constant-velocity cam by the handbook’s parabolic matching: a rise y1 at constant acceleration, y2 at constant velocity over the angle β2 and y3 at constant deceleration, with the parabolas tangent to the straight line so the velocity is continuous; the matching angles β1 = 2 y1 β2 ÷ y2 and β3 = 2 y3 β2 ÷ y2, the displacement y = y1 (θ ÷ β1)² in the first part, y1 + y2 (θ − β1) ÷ β2 in the middle and (y1 + y2 + y3) − y3 ((βt − θ) ÷ β3)² in the last, tabulated at your step of cam rotation, and at your cam speed the constant velocity y2 ω ÷ β2 and the accelerations 2 y1 ω² ÷ β1² and 2 y3 ω² ÷ β3².",
    "uses": [
      "Lay out a cam that moves a follower at constant velocity without impact at the ends",
      "Produce the displacement table for drawing or machining the cam",
      "Check the follower accelerations at the cam speed"
    ],
    "users": [
      "Machine designers",
      "Automation and packaging engineers",
      "Toolmakers"
    ],
    "inputs": {
      "y1": "Part of the rise made at constant acceleration from rest.",
      "y2": "Part of the rise made at constant velocity.",
      "y3": "Part of the rise made at constant deceleration to rest.",
      "b2": "Cam rotation during which the constant-velocity part of the rise takes place.",
      "step": "Interval of cam rotation at which to tabulate the displacement.",
      "N": "Rotational speed of the cam.",
      "amax": "Largest follower acceleration you accept, from the follower mass and spring."
    },
    "outputs": [
      "Matching angles β1 and β3 and the total rise angle",
      "Displacement at each step of cam rotation",
      "Constant velocity of the follower",
      "Acceleration and deceleration of the follower"
    ],
    "method": [
      "β1 = 2 y1 β2 ÷ y2; β3 = 2 y3 β2 ÷ y2; βt = β1 + β2 + β3 (the tangent to a parabola bisects the abscissa to its vertex).",
      "0 ≤ θ ≤ β1: y = y1 (θ ÷ β1)²; β1 ≤ θ ≤ β1 + β2: y = y1 + y2 (θ − β1) ÷ β2; last part: y = (y1 + y2 + y3) − y3 ((βt − θ) ÷ β3)².",
      "ω = 6 N °/s; velocity = y2 ω ÷ β2; acceleration 2 y1 ω² ÷ β1²; deceleration 2 y3 ω² ÷ β3².",
      "Example: the acceleration and deceleration take 20° and 40°, so the whole rise takes 110° of cam rotation."
    ],
    "limitations": [
      "The accelerations change suddenly at the ends of each parabola; for high-speed cams a cycloidal blend gives lower dynamic forces.",
      "The return is designed the same way; this tool covers the rise.",
      "Measure the displacements on radial lines from the cam centre when laying out the pitch curve.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Parabolic and cycloidal blends need the same angles because both reach the same velocity for the same rise and angle.",
      "A smaller acceleration part y1 shortens β1 but raises the acceleration as y1 ÷ β1²."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2288–2291. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cam-size-and-curvature": {
    "purpose": "Cam proportions by the handbook formulas for uniform velocity, parabolic, simple harmonic and cycloidal rises with a radial translating roller follower: the pressure angle tan φ = (dr ÷ dθ) ÷ r along the pitch curve, the smallest radius Rmin to the pitch curve that keeps the largest pressure angle within your limit (closed form Rmin = 180 h ÷ (π β tan φmax) for uniform velocity and 360 h ÷ (π β tan φmax) − h ÷ 2 for parabolic motion, and the same condition solved for simple harmonic and cycloidal motion), the angle and radius where the largest pressure angle occurs, the radius of curvature ρ = (r² + r′²)^1.5 ÷ (r² + 2 r′² − r r″) along the rise, the cam surface radius ρ − rf on convex parts and ρ + rf on concave parts, and the checks against undercutting by the roller and against the radius of the cutter.",
    "uses": [
      "Find the smallest cam that keeps the pressure angle within a limit",
      "Check that the roller will not undercut the convex parts of the cam",
      "Check that a milling cutter or grinding wheel can form the concave parts"
    ],
    "users": [
      "Machine designers",
      "Automation and packaging engineers",
      "Toolmakers"
    ],
    "inputs": {
      "law": "Motion of the follower during the rise.",
      "h": "Total rise of the follower.",
      "beta": "Cam rotation during which the rise takes place.",
      "phiMax": "Largest pressure angle you accept between the follower’s line of motion and the normal to the cam; 30° or less is usual.",
      "Ruse": "Least radius from the cam centre to the pitch curve that you will use; 0 uses the smallest that meets the pressure angle limit.",
      "rf": "Radius of the follower roller.",
      "rcut": "Radius of the milling cutter or grinding wheel that forms concave parts of the cam profile; 0 to skip the check."
    },
    "outputs": [
      "Smallest least radius Rmin for the pressure angle limit",
      "Largest pressure angle at the radius used, and where it occurs",
      "Smallest radius of curvature of the pitch curve on convex and concave parts",
      "Cam surface radius and the undercut check",
      "Concave radius against the cutter"
    ],
    "method": [
      "r = Rmin + y(θ); r′ = dr ÷ dθ and r″ = d²r ÷ dθ² from the motion law (θ in radians); tan φ = r′ ÷ r.",
      "Uniform velocity: Rmin = 180 h ÷ (π β tan φmax); parabolic: Rmin = 360 h ÷ (π β tan φmax) − h ÷ 2; simple harmonic and cycloidal: the least Rmin whose largest φ equals φmax, found by successive trial along the rise.",
      "ρ = (r² + r′²)^1.5 ÷ (r² + 2 r′² − r r″); positive on convex parts, negative on concave parts.",
      "Convex: cam surface radius ρ − rf (undercut when ρ ≤ rf); concave: |ρ| + rf, which must exceed the cutter radius.",
      "Example: the least radius to the pitch curve is 38.999 mm and the smallest convex radius of curvature 34.341 mm."
    ],
    "limitations": [
      "The formulas are exact for radial translating roller followers and approximate for offset and swinging followers.",
      "Only the rise is examined; check the return in the same way.",
      "Keep the least radius large enough for the cam bore and hub as well.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A smaller cam raises the pressure angle and lowers the radius of curvature together.",
      "Undercutting changes the motion the roller actually follows; enlarge the cam or use a smaller roller."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2297–2301. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cam-follower-force-analysis": {
    "purpose": "Force analysis of a radial translating roller follower by the handbook method: the follower acceleration a = h y″ ω² ÷ β² for the motion law, the equivalent mass m = mf + ms ÷ 3 + me, the inertia force R = m a at the point of greatest deceleration (θ = 0.75 β cycloidal, β simple harmonic, β ÷ 2 parabolic), the spring force Fs = k R − mf g − Fe − Ff with your dynamic factor k, the spring rate Ks = (Fs − preload) ÷ ya, then at your chosen angle the pressure angle, the load P = m a + (y Ks + preload) + mf g + Fe, the normal force Fn = P ÷ [cos φ − μ sin φ (2 l1 + l2 − μ d) ÷ l2] with friction in the guide bushing, the cam torque To = (Rmin + y) Fn sin φ, the radius of curvature, and the extra acceleration Δa = 2 e (6 N ÷ ε)² from a surface error of height e over ε degrees.",
    "uses": [
      "Size the return spring that keeps a follower on a high-speed cam",
      "Find the normal force on the cam and the drive torque at a point of the rise",
      "Judge how accurately a high-speed cam must be made"
    ],
    "users": [
      "Machine designers",
      "Automation and packaging engineers",
      "Toolmakers"
    ],
    "inputs": {
      "law": "Motion of the follower during the rise.",
      "h": "Total rise of the follower.",
      "beta": "Cam rotation during which the rise takes place.",
      "N": "Rotational speed of the cam.",
      "Rmin": "Least radius from the cam centre to the pitch curve.",
      "th": "Cam angle, from the start of the rise, at which to work out the normal force and torque.",
      "mf": "Mass of the follower.",
      "ms": "Mass of the return spring; one third of it moves with the follower.",
      "me": "Mass of the external parts the follower pushes.",
      "Fe": "External force resisting the follower motion.",
      "Ff": "Friction force from guide bushings and other sources, other than the pressure-angle friction worked out here.",
      "F0": "Preload of the return spring when the follower is at its lowest position.",
      "kd": "Factor on the inertia force for elasticity and backlash; the handbook says at least 2 for parabolic and 1.05 for cycloidal motion.",
      "mu": "Coefficient of friction between the follower stem and its guide bushing.",
      "l1": "Distance from the roller centre to the near end of the guide bushing.",
      "l2": "Length of the guide bushing.",
      "dst": "Diameter of the follower stem.",
      "e": "Height of a bump (or depth of a dent) left on the cam surface.",
      "eps": "Width of the error, as cam rotation."
    },
    "outputs": [
      "Greatest deceleration, where it occurs, and the inertia force",
      "Spring force and spring rate to keep the follower on the cam",
      "Pressure angle, acceleration and load at the chosen angle",
      "Normal force on the cam with guide friction",
      "Cam torque at the chosen angle",
      "Radius of curvature there and the extra acceleration from a surface error"
    ],
    "method": [
      "ω = π N ÷ 30 rad/s; a = h y″(θ ÷ β) ω² ÷ β² (β in radians); m = mf + ms ÷ 3 + me.",
      "Greatest deceleration at θa = 0.75 β (cycloidal), β (simple harmonic) or β ÷ 2 (parabolic); R = m |a|; Fs = kd R − mf g − Fe − Ff; Ks = (Fs − preload) ÷ ya.",
      "At θ: tan φ = (dr ÷ dθ) ÷ (Rmin + y); P = m a + (y Ks + preload) + mf g + Fe.",
      "Fn = P ÷ [cos φ − μ sin φ (2 l1 + l2 − μ d) ÷ l2]; To = (Rmin + y) Fn sin φ.",
      "ρ = (r² + r′²)^1.5 ÷ (r² + 2 r′² − r r″); Δa = 2 e (6 N ÷ ε)².",
      "Example: a spring rate of 9.9521 N/mm keeps the follower on the cam; at θ = 45° the cam carries 539.29 N and needs 13.303 N·m."
    ],
    "limitations": [
      "The analysis treats the follower as rigid; the dynamic factor allows for elasticity and backlash.",
      "The spring is checked only at the point of greatest deceleration, as the handbook does; check other points if the spring is weak.",
      "A follower stem that bends can jam in its bushing and raise the friction coefficient sharply.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A small surface error at high speed can multiply the acceleration many times; high-speed cams must be made accurately.",
      "The cam torque resists during the rise and assists during the return."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2301–2305. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-torque-coefficient-yield": {
    "purpose": "Torque and tension of a metric fastener by the JIS B 1803 relations the handbook gives: pitch diameter d2 = d − 0.649515 P, stress area As = (π ÷ 4)((d2 + d3) ÷ 2)² with d3 = d1 − H ÷ 6, the lead angle tan β = P ÷ π d and the flank angle in the normal section tan α′ = tan α cos β, the equivalent bearing diameter Dw = (2 ÷ 3)(Do³ − Di³) ÷ (Do² − Di²), the torque coefficient K = (P ÷ π + μs d2 sec α′ + μw Dw) ÷ 2d with Tf = K Ff d, the thread and bearing torques Ts and Tw, the yield clamping force Ffy = σy As ÷ √(1 + 3 [(2 ÷ dA)(P ÷ π + μs d2 sec α′)]²) by the shear strain energy theory and the torque Tfy = K Ffy d to reach it, and the preload and share of the yield clamping force from your tightening torque.",
    "uses": [
      "Work out the nut factor from the thread and under-head friction",
      "Find the torque that takes a bolt to its yield clamping force",
      "Check the preload a tightening torque gives against yield"
    ],
    "users": [
      "Machine designers",
      "Maintenance fitters",
      "Assembly engineers"
    ],
    "inputs": {
      "d": "Nominal (major) diameter of the bolt thread.",
      "P": "Pitch of the thread.",
      "alpha": "Half the included thread angle: 30° for ISO metric threads.",
      "mus": "Coefficient of friction between the bolt and nut threads.",
      "muw": "Coefficient of friction between the turning nut or head and the joint face.",
      "Do": "Outside diameter of the bearing face in contact; the handbook’s tables take 0.95 × the width across flats.",
      "Di": "Inside diameter of the bearing face, usually the clearance hole.",
      "sy": "Yield point or proof stress of the bolt material, for example 640 MPa for property class 8.8.",
      "Tapp": "Torque you apply when tightening; 0 to skip."
    },
    "outputs": [
      "Pitch diameter, stress area and its equivalent diameter",
      "Lead angle and flank angle in the normal section",
      "Equivalent bearing diameter Dw",
      "Torque coefficient K and the shares of thread and bearing torque",
      "Yield clamping force and the torque to reach it",
      "Preload from your torque and its share of the yield clamping force"
    ],
    "method": [
      "d2 = d − 0.649515 P; d1 = d − 1.082532 P; H = 0.866025 P; d3 = d1 − H ÷ 6; As = (π ÷ 4)((d2 + d3) ÷ 2)²; dA = √(4 As ÷ π).",
      "tan β = P ÷ π d; tan α′ = tan α cos β; Dw = (2 ÷ 3)(Do³ − Di³) ÷ (Do² − Di²).",
      "K = (P ÷ π + μs d2 sec α′ + μw Dw) ÷ 2d; Ts = (Ff ÷ 2)(P ÷ π + μs d2 sec α′); Tw = (Ff ÷ 2) μw Dw.",
      "Ffy = σy As ÷ √(1 + 3 [(2 ÷ dA)(P ÷ π + μs d2 sec α′)]²); Tfy = K Ffy d.",
      "Preload from the applied torque Ff = T ÷ (K d).",
      "Example: K = 0.16881; the bolt reaches its yield clamping force of 30,454 N at 51.411 N·m."
    ],
    "limitations": [
      "Friction coefficients vary widely with surface finish, coating and lubricant; measure them for critical joints.",
      "The handbook’s tables average K over many sizes, so a single size may differ slightly from the table.",
      "Tightening to yield needs controlled methods; this tool gives the torque at the onset of yield, not a recommended torque.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Usually more than half of the torque goes into friction under the head or nut.",
      "Higher thread friction lowers the yield clamping force because the bolt also carries torsion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1529–1531. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
