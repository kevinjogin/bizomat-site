// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook96) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "modified-constant-velocity-cam",
    "name": "Modified Constant-Velocity Cam with Parabolic Matching (Rise Angles, Displacement Table, Acceleration)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "My cam follower must rise partly at constant velocity, with constant acceleration before and constant deceleration after: what cam angles do the acceleration and deceleration parts need so the curves blend, what is the displacement at each step of cam rotation, and how large are the velocity and accelerations at my cam speed?",
    "description": "Modified constant-velocity cam by the handbook’s parabolic matching: a rise y1 at constant acceleration, y2 at constant velocity over the angle β2 and y3 at constant deceleration, with the parabolas tangent to the straight line so the velocity is continuous; the matching angles β1 = 2 y1 β2 ÷ y2 and β3 = 2 y3 β2 ÷ y2, the displacement y = y1 (θ ÷ β1)² in the first part, y1 + y2 (θ − β1) ÷ β2 in the middle and (y1 + y2 + y3) − y3 ((βt − θ) ÷ β3)² in the last, tabulated at your step of cam rotation, and at your cam speed the constant velocity y2 ω ÷ β2 and the accelerations 2 y1 ω² ÷ β1² and 2 y3 ω² ÷ β3².",
    "keywords": [
      "MAKEOS",
      "modified constant velocity cam",
      "parabolic matching cam",
      "cam displacement table",
      "constant velocity cam with acceleration",
      "cam rise angles",
      "cam follower acceleration"
    ],
    "fields": [
      {
        "key": "y1",
        "label": "Rise at constant acceleration y1",
        "type": "number",
        "default": 6.35,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Rise at constant velocity y2",
        "type": "number",
        "default": 31.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Rise at constant deceleration y3",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b2",
        "label": "Cam angle for the constant-velocity rise β2",
        "type": "number",
        "default": 50,
        "unit": "°",
        "min": 0.000001,
        "max": 359,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "step",
        "label": "Step of cam rotation for the table",
        "type": "number",
        "default": 5,
        "unit": "°",
        "min": 0.000001,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cam_speed_and_limit",
        "label": "Cam speed and limit",
        "type": "heading"
      },
      {
        "key": "N",
        "label": "Cam speed",
        "type": "number",
        "default": 100,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "amax",
        "label": "Largest follower acceleration you accept",
        "type": "number",
        "default": 50,
        "unit": "m/s²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cam-size-and-curvature",
    "name": "Cam Size for a Maximum Pressure Angle and Radius of Curvature (Smallest Base Radius, Undercut, Cutter Check)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a disc cam with a radial translating roller follower, how small can the cam be (the least radius to the pitch curve) without exceeding my maximum pressure angle, where does that angle occur, what is the smallest radius of curvature of the pitch curve, and will my roller undercut the cam or my cutter be too large for the concave parts?",
    "description": "Cam proportions by the handbook formulas for uniform velocity, parabolic, simple harmonic and cycloidal rises with a radial translating roller follower: the pressure angle tan φ = (dr ÷ dθ) ÷ r along the pitch curve, the smallest radius Rmin to the pitch curve that keeps the largest pressure angle within your limit (closed form Rmin = 180 h ÷ (π β tan φmax) for uniform velocity and 360 h ÷ (π β tan φmax) − h ÷ 2 for parabolic motion, and the same condition solved for simple harmonic and cycloidal motion), the angle and radius where the largest pressure angle occurs, the radius of curvature ρ = (r² + r′²)^1.5 ÷ (r² + 2 r′² − r r″) along the rise, the cam surface radius ρ − rf on convex parts and ρ + rf on concave parts, and the checks against undercutting by the roller and against the radius of the cutter.",
    "keywords": [
      "MAKEOS",
      "cam pressure angle base circle",
      "minimum cam size pressure angle",
      "cam radius of curvature",
      "cam undercutting roller follower",
      "cam pitch curve curvature",
      "cycloidal cam Rmin"
    ],
    "fields": [
      {
        "key": "law",
        "label": "Rise motion",
        "type": "select",
        "default": "cycloidal",
        "options": [
          [
            "uniform",
            "Uniform velocity"
          ],
          [
            "cycloidal",
            "Cycloidal"
          ],
          [
            "shm",
            "Simple harmonic"
          ],
          [
            "parabolic",
            "Parabolic (constant acceleration)"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Rise h",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Cam angle for the rise β",
        "type": "number",
        "default": 100,
        "unit": "°",
        "min": 0.000001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phiMax",
        "label": "Largest pressure angle you accept φmax",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 1,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ruse",
        "label": "Least radius to the pitch curve to use (0 = smallest for φmax)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_roller_and_cutter",
        "label": "Roller and cutter",
        "type": "heading"
      },
      {
        "key": "rf",
        "label": "Roller radius rf",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rcut",
        "label": "Radius of the cutter or wheel for concave parts (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cam-follower-force-analysis",
    "name": "Cam Follower Force Analysis (Return Spring Rate, Normal Force with Guide Friction, Cam Torque, Surface Error)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a disc cam driving a translating roller follower held by a return spring, what spring rate keeps the follower on the cam, what normal force does the cam carry at a chosen angle once friction in the follower guide is included, what torque does the cam shaft need there, and how much would a small bump on the cam surface add to the acceleration?",
    "description": "Force analysis of a radial translating roller follower by the handbook method: the follower acceleration a = h y″ ω² ÷ β² for the motion law, the equivalent mass m = mf + ms ÷ 3 + me, the inertia force R = m a at the point of greatest deceleration (θ = 0.75 β cycloidal, β simple harmonic, β ÷ 2 parabolic), the spring force Fs = k R − mf g − Fe − Ff with your dynamic factor k, the spring rate Ks = (Fs − preload) ÷ ya, then at your chosen angle the pressure angle, the load P = m a + (y Ks + preload) + mf g + Fe, the normal force Fn = P ÷ [cos φ − μ sin φ (2 l1 + l2 − μ d) ÷ l2] with friction in the guide bushing, the cam torque To = (Rmin + y) Fn sin φ, the radius of curvature, and the extra acceleration Δa = 2 e (6 N ÷ ε)² from a surface error of height e over ε degrees.",
    "keywords": [
      "MAKEOS",
      "cam follower force analysis",
      "cam return spring rate",
      "cam normal force guide friction",
      "cam torque",
      "cam surface error acceleration",
      "translating roller follower forces"
    ],
    "fields": [
      {
        "key": "law",
        "label": "Rise motion",
        "type": "select",
        "default": "cycloidal",
        "options": [
          [
            "cycloidal",
            "Cycloidal"
          ],
          [
            "shm",
            "Simple harmonic"
          ],
          [
            "parabolic",
            "Parabolic (constant acceleration)"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Rise h",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Cam angle for the rise β",
        "type": "number",
        "default": 100,
        "unit": "°",
        "min": 0.000001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "N",
        "label": "Cam speed N",
        "type": "number",
        "default": 900,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rmin",
        "label": "Least radius to the pitch curve Rmin",
        "type": "number",
        "default": 39.624,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th",
        "label": "Cam angle to analyse θ (from the start of the rise)",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_masses_and_loads",
        "label": "Masses and loads",
        "type": "heading"
      },
      {
        "key": "mf",
        "label": "Follower mass mf",
        "type": "number",
        "default": 0.9072,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ms",
        "label": "Return spring mass ms",
        "type": "number",
        "default": 0,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "me",
        "label": "External mass moved me",
        "type": "number",
        "default": 0,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fe",
        "label": "External force resisting the follower Fe",
        "type": "number",
        "default": 44.48,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ff",
        "label": "Other friction force Ff",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F0",
        "label": "Spring preload at Rmin",
        "type": "number",
        "default": 160.1,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kd",
        "label": "Dynamic factor on the inertia force",
        "type": "number",
        "default": 1.05,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_follower_guide",
        "label": "Follower guide",
        "type": "heading"
      },
      {
        "key": "mu",
        "label": "Friction coefficient in the guide bushing μ",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l1",
        "label": "Distance from roller to bushing l1",
        "type": "number",
        "default": 38.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l2",
        "label": "Length of the bushing l2",
        "type": "number",
        "default": 101.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dst",
        "label": "Follower stem diameter d",
        "type": "number",
        "default": 19.05,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_surface_error",
        "label": "Surface error",
        "type": "heading"
      },
      {
        "key": "e",
        "label": "Height of a bump or dent e",
        "type": "number",
        "default": 0.0254,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Width of the error ε",
        "type": "number",
        "default": 1,
        "unit": "°",
        "min": 0.000001,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolt-torque-coefficient-yield",
    "name": "Bolt Torque Coefficient and Yield Clamping Force (JIS Method from Thread and Bearing Friction)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a metric bolt and nut with known friction in the threads and under the head, what is the torque coefficient K, how is the tightening torque shared between the threads and the bearing face, what clamping force takes the bolt to yield and what torque does that need, and what preload does my tightening torque give?",
    "description": "Torque and tension of a metric fastener by the JIS B 1803 relations the handbook gives: pitch diameter d2 = d − 0.649515 P, stress area As = (π ÷ 4)((d2 + d3) ÷ 2)² with d3 = d1 − H ÷ 6, the lead angle tan β = P ÷ π d and the flank angle in the normal section tan α′ = tan α cos β, the equivalent bearing diameter Dw = (2 ÷ 3)(Do³ − Di³) ÷ (Do² − Di²), the torque coefficient K = (P ÷ π + μs d2 sec α′ + μw Dw) ÷ 2d with Tf = K Ff d, the thread and bearing torques Ts and Tw, the yield clamping force Ffy = σy As ÷ √(1 + 3 [(2 ÷ dA)(P ÷ π + μs d2 sec α′)]²) by the shear strain energy theory and the torque Tfy = K Ffy d to reach it, and the preload and share of the yield clamping force from your tightening torque.",
    "keywords": [
      "MAKEOS",
      "bolt torque coefficient",
      "nut factor from friction",
      "yield clamping force bolt",
      "tightening torque to yield",
      "JIS B 1803 torque",
      "thread friction bearing friction torque"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal diameter d",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Pitch P",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Thread half-angle α",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 5,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_friction_and_bearing_face",
        "label": "Friction and bearing face",
        "type": "heading"
      },
      {
        "key": "mus",
        "label": "Friction coefficient in the threads μs",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muw",
        "label": "Friction coefficient under the head or nut μw",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Do",
        "label": "Outside diameter of the bearing face Do",
        "type": "number",
        "default": 16.15,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Di",
        "label": "Inside diameter of the bearing face Di (clearance hole)",
        "type": "number",
        "default": 11,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_and_tightening",
        "label": "Bolt and tightening",
        "type": "heading"
      },
      {
        "key": "sy",
        "label": "Yield point or proof stress of the bolt σy",
        "type": "number",
        "default": 640,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tapp",
        "label": "Tightening torque you apply",
        "type": "number",
        "default": 35,
        "unit": "N·m",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
