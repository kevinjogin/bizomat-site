// KEVOS® WORKOS input guides: handbook94. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook94.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "milled-bevel-gear-dimensions": {
    m: {
      what: "Module of the pinion and gear, the pitch diameter per tooth in millimetres.",
      tip: "For an inch diametral pitch P, enter 25.4 ÷ P.",
      effect: "Scales every diameter, depth and tooth thickness.",
      fig: "pitch",
      sym: "m"
    },
    NP: {
      what: "Number of teeth in the pinion, the smaller bevel gear.",
      tip: "Count the teeth on the drawing or the part.",
      effect: "Sets the pinion pitch cone angle and diameters.",
      fig: "teeth",
      sym: "N_P"
    },
    NG: {
      what: "Number of teeth in the gear, the larger bevel gear.",
      tip: "Gear teeth ÷ pinion teeth gives the speed ratio.",
      effect: "Sets the gear pitch cone angle and diameters.",
      fig: "teeth",
      sym: "N_G"
    },
    sigma: {
      what: "Angle between the pinion and gear shafts.",
      tip: "90° for shafts at right angles; acute or obtuse angles also work.",
      effect: "The two pitch cone angles add up to it.",
      fig: "angle",
      sym: "Σ"
    },
    F: {
      what: "Width of face, the length of the teeth along the pitch cone.",
      tip: "Keep it to a third of the pitch cone radius or less.",
      effect: "A wider face makes the small-end teeth smaller.",
      fig: "length",
      sym: "F"
    },
    root: {
      what: "How the cutting (root) angle is worked out.",
      tip: "Uniform clearance (addendum angle) is what the handbook recommends.",
      effect: "Changes the dividing head angle by the difference of the two angles.",
      fig: "choice",
      sym: "ζ"
    }
  },
  "bevel-gear-milling-offset": {
    m: {
      what: "Module of the bevel gear being milled, the pitch diameter per tooth in millimetres.",
      tip: "For an inch diametral pitch P, enter 25.4 ÷ P.",
      effect: "Scales every diameter, depth and tooth thickness.",
      fig: "pitch",
      sym: "m"
    },
    Nt: {
      what: "Number of teeth in the bevel gear being milled.",
      tip: "Count the teeth on the drawing or the part.",
      effect: "Sets the pitch diameter and the cutter selection.",
      fig: "teeth",
      sym: "N"
    },
    gamma: {
      what: "Pitch cone angle of the gear being milled.",
      tip: "Take it from the gear drawing or the milled bevel gear tool.",
      effect: "Sets the pitch cone radius and the cutting angle.",
      fig: "angle",
      sym: "γ"
    },
    F: {
      what: "Width of face, the length of the teeth along the pitch cone.",
      tip: "Keep it to a third of the pitch cone radius or less.",
      effect: "A wider face makes the small-end teeth smaller.",
      fig: "length",
      sym: "F"
    },
    Tc: {
      what: "Thickness of the formed cutter at its pitch line.",
      tip: "Measure it with a gear tooth caliper set to the depth shown, after each sharpening.",
      effect: "The offset rises by half of any increase.",
      fig: "thickness",
      sym: "T"
    },
    factor: {
      what: "Offset factor from the handbook table for milling bevel gears.",
      tip: "Read it for the cutter number and the ratio C ÷ F the tool shows.",
      effect: "A larger factor reduces the offset.",
      fig: "factor",
      sym: "k"
    }
  },
  "sae-straight-sided-spline": {
    D: {
      what: "Nominal (major) diameter of the spline fitting.",
      tip: "The S.A.E. tables run from 3/4 to 6 in, depending on the number of splines.",
      effect: "Every dimension is a fixed fraction of it.",
      fig: "diameter",
      sym: "D"
    },
    n: {
      what: "Number of splines in the fitting: 4, 6, 10 or 16.",
      tip: "More splines give a stronger fitting for the same diameter.",
      effect: "Sets the spline width and the depth for each fit.",
      fig: "choice",
      sym: "N"
    },
    fit: {
      what: "Fit of the hub on the shaft: permanent, sliding without load or sliding under load.",
      tip: "There is no 4-spline fitting to slide under load.",
      effect: "Sliding fits have deeper splines and a smaller minor diameter.",
      fig: "choice",
      sym: "fit"
    },
    L: {
      what: "Length over which the hub and shaft splines bear on each other.",
      tip: "Use the length of the hub, less any chamfers.",
      effect: "The torque capacity rises in proportion.",
      fig: "length",
      sym: "L"
    },
    p: {
      what: "Bearing pressure you allow on the sides of the splines.",
      tip: "The handbook’s table capacities use 1000 lbf/in², which is 6.895 MPa.",
      effect: "The torque capacity rises in proportion.",
      fig: "pressure",
      sym: "p"
    },
    Treq: {
      what: "Torque the spline fitting must transmit.",
      tip: "Use the peak running torque, including any shock.",
      effect: "Fails the fitting when it exceeds the capacity.",
      fig: "torque",
      sym: "T"
    }
  },
  "roller-chain-sprocket-tooth-form": {
    P: {
      what: "Pitch of the roller chain, from pin centre to pin centre.",
      tip: "Standard pitches run from 1/4 in (6.35 mm) to 3 in (76.2 mm).",
      effect: "Sets the sprocket diameters and the hob pitch.",
      fig: "pitch",
      sym: "P"
    },
    Dr: {
      what: "Nominal diameter of the chain rollers.",
      tip: "Take it from the chain maker’s data or the standard for the chain number.",
      effect: "Sets the seating curve and every tooth form value.",
      fig: "diameter",
      sym: "D_r"
    },
    Nt: {
      what: "Number of teeth in the sprocket.",
      tip: "Count the teeth on the drawing or the part.",
      effect: "Changes the tooth form angles and the outside diameter.",
      fig: "teeth",
      sym: "N"
    },
    bore: {
      what: "Bore of the hob that will cut the sprocket teeth.",
      tip: "Take it from the hob maker; the handbook’s standard hobs use 1.250 to 2.000 in.",
      effect: "Sets the hob outside diameter and the least hob width.",
      fig: "diameter",
      sym: "bore"
    }
  }
});
