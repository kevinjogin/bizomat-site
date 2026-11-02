// KEVOS® Tools input guides: handbook96. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook96.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "modified-constant-velocity-cam": {
    y1: {
      what: "Part of the rise made with constant acceleration from rest.",
      tip: "A small part, often a fifth or so of the whole rise.",
      effect: "Sets the acceleration angle β1 and the acceleration.",
      fig: "height",
      sym: "y_1"
    },
    y2: {
      what: "Part of the rise made at constant follower velocity.",
      tip: "The working part of the stroke, where uniform speed is needed.",
      effect: "Sets the constant velocity together with β2.",
      fig: "height",
      sym: "y_2"
    },
    y3: {
      what: "Part of the rise made with constant deceleration to rest.",
      tip: "Often larger than y1 to soften the stop.",
      effect: "Sets the deceleration angle β3 and the deceleration.",
      fig: "height",
      sym: "y_3"
    },
    b2: {
      what: "Cam rotation for the constant-velocity part of the rise.",
      tip: "Take it from the timing diagram of the machine.",
      effect: "Sets the matching angles and the constant velocity.",
      fig: "angle",
      sym: "β_2"
    },
    step: {
      what: "Interval of cam rotation at which the displacement is tabulated.",
      tip: "5° is common; finer steps for large cams or accurate profiles.",
      effect: "Sets how many points the table lists.",
      fig: "angle",
      sym: "Δθ"
    },
    N: {
      what: "Rotational speed of the cam shaft.",
      tip: "Use the highest speed the machine runs at.",
      effect: "Velocity rises with speed and acceleration with its square.",
      fig: "rotation",
      sym: "N"
    },
    amax: {
      what: "Largest follower acceleration that your follower mass and spring can accept.",
      tip: "Work it out from the spring force available and the moving mass.",
      effect: "Fails the cam when the acceleration is higher.",
      fig: "number",
      sym: "a_max"
    }
  },
  "cam-size-and-curvature": {
    law: {
      what: "Motion law the follower follows during the rise.",
      tip: "Uniform velocity is included for comparison; it needs blending at the ends.",
      effect: "Changes the accelerations, pressure angles and curvature.",
      fig: "choice",
      sym: "law"
    },
    h: {
      what: "Total rise of the follower from its lowest to its highest position.",
      tip: "Take it from the motion the machine needs.",
      effect: "Larger rises raise the pressure angle and the accelerations.",
      fig: "height",
      sym: "h"
    },
    beta: {
      what: "Cam rotation during which the follower makes its rise.",
      tip: "A longer rise angle lowers the accelerations and the pressure angle.",
      effect: "Accelerations fall with the square of the rise angle.",
      fig: "angle",
      sym: "β"
    },
    phiMax: {
      what: "Largest angle you accept between the follower motion and the normal to the cam.",
      tip: "30° or less is usual for translating followers.",
      effect: "A smaller limit needs a larger cam.",
      fig: "angle",
      sym: "φ_max"
    },
    Ruse: {
      what: "Least radius from the cam centre to the pitch curve that you will use.",
      tip: "Enter 0 to use the smallest that meets the pressure angle; enter a larger value if the hub needs it.",
      effect: "A larger cam lowers the pressure angle and raises the curvature radius.",
      fig: "radius",
      sym: "R_min"
    },
    rf: {
      what: "Radius of the roller on the follower.",
      tip: "Choose it smaller than the least convex radius of curvature.",
      effect: "A larger roller reduces the cam surface radius and can undercut it.",
      fig: "radius",
      sym: "r_f"
    },
    rcut: {
      what: "Radius of the milling cutter or grinding wheel used for concave parts of the profile.",
      tip: "Enter 0 to skip the check.",
      effect: "Fails the check when the concave cam radius is smaller than the cutter.",
      fig: "radius",
      sym: "r_c"
    }
  },
  "cam-follower-force-analysis": {
    law: {
      what: "Motion law the follower follows during the rise.",
      tip: "Cycloidal motion gives the lowest dynamic forces at high speed.",
      effect: "Changes the accelerations, pressure angles and curvature.",
      fig: "choice",
      sym: "law"
    },
    h: {
      what: "Total rise of the follower from its lowest to its highest position.",
      tip: "Take it from the motion the machine needs.",
      effect: "Larger rises raise the pressure angle and the accelerations.",
      fig: "height",
      sym: "h"
    },
    beta: {
      what: "Cam rotation during which the follower makes its rise.",
      tip: "A longer rise angle lowers the accelerations and the pressure angle.",
      effect: "Accelerations fall with the square of the rise angle.",
      fig: "angle",
      sym: "β"
    },
    N: {
      what: "Rotational speed of the cam shaft.",
      tip: "Use the highest speed the machine runs at.",
      effect: "Inertia forces rise with the square of the speed.",
      fig: "rotation",
      sym: "N"
    },
    Rmin: {
      what: "Least radius from the cam centre to the pitch curve.",
      tip: "Take it from the cam size tool or the cam drawing.",
      effect: "Sets the pressure angle and the torque arm.",
      fig: "radius",
      sym: "R_min"
    },
    th: {
      what: "Cam angle from the start of the rise at which to work out the forces.",
      tip: "Use the angle of the largest pressure angle, or check several angles.",
      effect: "Sets the rise, pressure angle and acceleration used.",
      fig: "angle",
      sym: "θ"
    },
    mf: {
      what: "Mass of the follower, roller and stem that move with the cam.",
      tip: "Weigh the parts or take them from the model.",
      effect: "Raises the inertia force and the spring needed.",
      fig: "mass",
      sym: "m_f"
    },
    ms: {
      what: "Mass of the return spring; a third of it moves with the follower.",
      tip: "Weigh the spring; enter 0 if it is small.",
      effect: "Adds a third of its mass to the moving mass.",
      fig: "mass",
      sym: "m_s"
    },
    me: {
      what: "Mass of the external parts the follower pushes, such as a slide or piston.",
      tip: "Enter 0 if the follower moves nothing else.",
      effect: "Raises the inertia force.",
      fig: "mass",
      sym: "m_e"
    },
    Fe: {
      what: "External force resisting the follower as it rises.",
      tip: "For example a process load or a counterbalance; enter 0 if none.",
      effect: "Raises the normal force and lowers the spring force needed.",
      fig: "force",
      sym: "F_e"
    },
    Ff: {
      what: "Friction from guide bushings and other sources, besides the pressure-angle friction.",
      tip: "Enter 0 when it is small or unknown.",
      effect: "Lowers the spring force needed to hold the follower.",
      fig: "force",
      sym: "F_f"
    },
    F0: {
      what: "Force of the return spring with the follower at its lowest position.",
      tip: "Allow some preload for the set the spring takes in service.",
      effect: "Lowers the spring rate needed and raises the cam load.",
      fig: "force",
      sym: "F_0"
    },
    kd: {
      what: "Factor on the calculated inertia force for elasticity and backlash.",
      tip: "The handbook says at least 2 for parabolic and 1.05 for cycloidal motion.",
      effect: "Raises the spring force needed.",
      fig: "factor",
      sym: "k"
    },
    mu: {
      what: "Coefficient of friction between the follower stem and its bushing.",
      tip: "About 0.05 for a lubricated steel stem; it rises sharply if the stem bends.",
      effect: "Raises the normal force on the cam.",
      fig: "friction",
      sym: "μ"
    },
    l1: {
      what: "Distance from the roller centre to the near end of the guide bushing.",
      tip: "Keep it short so the stem does not bend.",
      effect: "A longer overhang raises the friction force.",
      fig: "length",
      sym: "l_1"
    },
    l2: {
      what: "Length of the guide bushing that supports the follower stem.",
      tip: "A longer bushing lowers the friction from the pressure angle.",
      effect: "A longer bushing lowers the normal force.",
      fig: "length",
      sym: "l_2"
    },
    dst: {
      what: "Diameter of the follower stem in the bushing.",
      tip: "Measure the stem or take it from the drawing.",
      effect: "Changes the friction term slightly.",
      fig: "diameter",
      sym: "d"
    },
    e: {
      what: "Height of a bump, or depth of a dent, on the cam surface.",
      tip: "From chatter marks or poor blending; a few micrometres on good cams.",
      effect: "The extra acceleration rises in proportion.",
      fig: "tolerance",
      sym: "e"
    },
    eps: {
      what: "Width of the surface error, measured as cam rotation.",
      tip: "Short errors are the most harmful.",
      effect: "The extra acceleration rises with the inverse square of the width.",
      fig: "angle",
      sym: "ε"
    }
  },
  "bolt-torque-coefficient-yield": {
    d: {
      what: "Nominal (major) diameter of the bolt thread.",
      tip: "For example 10 for an M10 bolt.",
      effect: "Sets the stress area and the torque for a given preload.",
      fig: "diameter",
      sym: "d"
    },
    P: {
      what: "Pitch of the thread, from one thread crest to the next.",
      tip: "1.5 mm for M10 coarse, 1.25 mm for M10 fine.",
      effect: "Sets the lead angle, the pitch diameter and the stress area.",
      fig: "pitch",
      sym: "P"
    },
    alpha: {
      what: "Angle between a thread flank and a line square to the axis.",
      tip: "30° for ISO metric and Unified threads.",
      effect: "Raises the thread friction torque through sec α′.",
      fig: "angle",
      sym: "α"
    },
    mus: {
      what: "Coefficient of friction between the bolt and nut threads.",
      tip: "About 0.12 to 0.20 dry or lightly oiled; lower with molybdenum paste.",
      effect: "Raises K and lowers the yield clamping force.",
      fig: "friction",
      sym: "μ_s"
    },
    muw: {
      what: "Coefficient of friction between the turning nut or head and the joint face.",
      tip: "Often similar to the thread friction; washers and coatings change it.",
      effect: "Raises K and the share of torque lost under the head.",
      fig: "friction",
      sym: "μ_w"
    },
    Do: {
      what: "Outside diameter of the bearing face under the nut or head.",
      tip: "The handbook tables take 0.95 × the width across flats.",
      effect: "A larger bearing face raises the under-head friction torque.",
      fig: "diameter",
      sym: "D_o"
    },
    Di: {
      what: "Inside diameter of the bearing face, usually the clearance hole.",
      tip: "Take the clearance hole diameter for the fit class used.",
      effect: "Sets the equivalent bearing diameter with Do.",
      fig: "diameter",
      sym: "D_i"
    },
    sy: {
      what: "Yield point or proof stress of the bolt material.",
      tip: "640 MPa for property class 8.8, 940 MPa for 10.9.",
      effect: "The yield clamping force rises in proportion.",
      fig: "stress",
      sym: "σ_y"
    },
    Tapp: {
      what: "Torque applied to the nut or head when tightening.",
      tip: "Enter 0 to skip the preload from torque.",
      effect: "Sets the preload and its share of the yield clamping force.",
      fig: "torque",
      sym: "T"
    }
  }
});
