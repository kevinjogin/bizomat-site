// KEVOS® WORKOS input guides: handbook82. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook82.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "gear-pitting-geometry-factor": {
    mn: {
      what: "The normal module: reference diameter ÷ teeth, measured normal to the teeth; for spur gears it is the ordinary module.",
      tip: "Take it from the drawing or the cutter; for helical gears do not use the transverse module.",
      effect: "Scales every length; I itself does not change with module for the same tooth numbers and proportions.",
      fig: "pitch",
      sym: "mₙ"
    },
    n1: {
      what: "Teeth on the pinion, the smaller gear of the pair.",
      tip: "Count the teeth on the driving or smaller gear; the larger gear goes in the next box.",
      effect: "More pinion teeth flatten the profile curvature and usually raise I.",
      fig: "teeth",
      sym: "n₁"
    },
    n2: {
      what: "Teeth on the gear, the larger member of an external pair.",
      tip: "Count the teeth; it must be at least the pinion's count.",
      effect: "A higher ratio raises I towards the value for a rack.",
      fig: "teeth",
      sym: "n₂"
    },
    phin: {
      what: "Normal pressure angle of the cutting tool, at the reference diameter.",
      tip: "Common values are 20° and 25°; take it from the drawing, not from a measurement.",
      effect: "A larger pressure angle gives larger radii of curvature and a higher I.",
      fig: "angle",
      sym: "φₙ"
    },
    psi: {
      what: "Helix angle at the reference diameter; zero for spur gears.",
      tip: "Enter 0 for spur gears; for helicals use the drawing value, not the base helix angle.",
      effect: "A helix angle adds axial overlap and load sharing, which can raise I considerably.",
      fig: "angle",
      sym: "ψ"
    },
    F: {
      what: "Face width over which the teeth actually mesh, the narrower of the two gears less end chamfers.",
      tip: "Do not use the wider gear's face width; only the overlapping width carries load.",
      effect: "Matters for helical gears: more face width raises the axial contact ratio and load sharing.",
      fig: "length",
      sym: "F"
    },
    Cr: {
      what: "The centre distance at which the pair runs in its housing.",
      tip: "Use the housing's centre distance; for standard gears it is (n₁ + n₂) mₙ ÷ (2 cos ψ).",
      effect: "A larger centre distance raises the operating pressure angle and shortens the contact.",
      fig: "length",
      sym: "C_r"
    },
    do1: {
      what: "Outside (tip) diameter of the pinion as made.",
      tip: "Measure it or take it from the drawing, including any addendum modification.",
      effect: "A larger tip extends the contact and moves the lowest point of single tooth contact.",
      fig: "diameter",
      sym: "d_o1"
    },
    do2: {
      what: "Outside (tip) diameter of the gear as made.",
      tip: "Measure it or take it from the drawing; a short-addendum gear has a smaller tip.",
      effect: "Changes where contact begins on the pinion flank and the contact ratio.",
      fig: "diameter",
      sym: "d_o2"
    },
    Iused: {
      what: "The geometry factor I assumed in your pitting resistance rating.",
      tip: "Read it from the rating calculation or the supplier's data sheet.",
      effect: "Only moves the pass or fail line; it does not change the calculated I.",
      fig: "factor",
      sym: "I"
    }
  },
  "fine-pitch-worm-design": {
    Px: {
      what: "Axial pitch of the worm: distance between adjacent threads along the worm axis, equal to the wormgear circular pitch.",
      tip: "Fine-pitch standard pitches are given in inches; 0.160 in is 4.064 mm.",
      effect: "Scales every dimension of the worm and wormgear.",
      fig: "pitch",
      sym: "Pₓ"
    },
    lam: {
      what: "Lead angle of the worm thread, measured from a plane square to the worm axis.",
      tip: "Choose from the standard series (0.5° to 30°) to keep tooling standard.",
      effect: "A larger lead angle gives a smaller worm diameter for the same lead and a more efficient drive.",
      fig: "angle",
      sym: "λ"
    },
    n: {
      what: "Number of threads or starts on the worm.",
      tip: "Most fine-pitch worms have one or two threads; more threads give a larger lead.",
      effect: "More threads multiply the lead and lower the ratio for the same wormgear.",
      fig: "count",
      sym: "n"
    },
    N: {
      what: "Number of teeth on the wormgear.",
      tip: "Ratio = teeth ÷ threads; choose a count with no common factor with the threads for a hunting tooth.",
      effect: "More teeth enlarge the wormgear and the centre distance.",
      fig: "teeth",
      sym: "N"
    },
    Ct: {
      what: "The centre distance between the worm and wormgear axes that the design must meet.",
      tip: "Take it from the housing or mechanism layout.",
      effect: "Only moves the target check and the threads or lead angle suggested to meet it.",
      fig: "length",
      sym: "C"
    },
    Ctol: {
      what: "How far the calculated centre distance may differ from the target.",
      tip: "Use what the housing can take up, for example by shims or an adjustable mounting.",
      effect: "A tighter allowance may force another thread count or lead angle.",
      fig: "tolerance",
      sym: "±ΔC"
    },
    dmin: {
      what: "Smallest worm pitch diameter you accept.",
      tip: "The handbook gives 0.250 in (6.35 mm) as the minimum recommended for fine-pitch worms.",
      effect: "Only moves the diameter check.",
      fig: "diameter",
      sym: "d_min"
    },
    dmax: {
      what: "Largest worm pitch diameter you accept.",
      tip: "The handbook gives 2.000 in (50.8 mm) as the maximum recommended for fine-pitch worms.",
      effect: "Only moves the diameter check.",
      fig: "diameter",
      sym: "d_max"
    }
  },
  "internal-gear-pin-measurement": {
    m: {
      what: "Module of the internal gear: pitch diameter ÷ teeth.",
      tip: "Take it from the drawing; for an inch gear, module = 25.4 ÷ diametral pitch.",
      effect: "Scales the pitch diameter and the measurement.",
      fig: "pitch",
      sym: "m"
    },
    z: {
      what: "Number of teeth on the internal gear.",
      tip: "Count carefully: an odd count changes how the pins sit and the formula used.",
      effect: "Sets the pitch diameter; odd counts give a slightly smaller reading.",
      fig: "teeth",
      sym: "z"
    },
    phi: {
      what: "Standard pressure angle of the internal gear teeth.",
      tip: "Common values are 14½°, 20° and 25°; take it from the drawing.",
      effect: "Changes the base diameter and where the pins sit.",
      fig: "angle",
      sym: "φ"
    },
    Di: {
      what: "Diameter across the tips of the internal teeth, the smallest diameter of the ring gear.",
      tip: "Measure across the tooth tips or take it from the drawing.",
      effect: "Only used to check that the pins touch the flanks above the tips.",
      fig: "diameter",
      sym: "D_i"
    },
    Dr: {
      what: "Diameter at the bottom of the tooth spaces of the internal gear.",
      tip: "Take it from the drawing or the cutter data.",
      effect: "Only used to check that the pins do not bottom in the spaces.",
      fig: "diameter",
      sym: "D_r"
    },
    dp: {
      what: "Diameter of the gauge pins or wires placed in two tooth spaces.",
      tip: "Van Keuren's internal-gear size is 1.44 × module; measure the pins before use.",
      effect: "A larger pin sits further out in the space and changes the reading.",
      fig: "diameter",
      sym: "d_p"
    },
    eMin: {
      what: "The least amount the space width at the pitch circle is opened for backlash.",
      tip: "From the drawing's tooth thickness or space width tolerance; zero means no backlash allowance.",
      effect: "Sets the smallest acceptable reading.",
      fig: "tolerance",
      sym: "e_min"
    },
    eMax: {
      what: "The greatest amount the space width at the pitch circle is opened for backlash.",
      tip: "From the drawing; must be at least the smallest increase.",
      effect: "Sets the largest acceptable reading.",
      fig: "tolerance",
      sym: "e_max"
    },
    Mmeas: {
      what: "Dimension measured between the inner sides of the two pins.",
      tip: "Put the pins in opposite spaces (or as nearly opposite as possible for odd teeth) and take the smallest reading across them.",
      effect: "Converted to the space width actually cut and checked against the limits.",
      fig: "length",
      sym: "M"
    }
  },
  "wire-rope-sheave-drum-check": {
    d: {
      what: "Nominal diameter of the wire rope.",
      tip: "Use the catalogue size; 9/16 in is 14.29 mm.",
      effect: "A larger rope lowers the radial pressure for the same tension but raises the bending load.",
      fig: "diameter",
      sym: "d"
    },
    kw: {
      what: "Outer wire diameter divided by the rope diameter, which depends on the rope construction.",
      tip: "The handbook gives 0.106 for 6 × 7, 0.063 for 6 × 19, 0.045 for 6 × 37 and 0.050 for 8 × 19 rope.",
      effect: "Thicker wires raise the bending stress and load.",
      fig: "ratio",
      sym: "d_w/d"
    },
    Qa: {
      what: "Factor that gives the metal area of the rope as Q × d².",
      tip: "The handbook lists values by construction and core, for example 0.405 for 6 × 19 fibre core and 0.475 for 6 × 19 IWRC.",
      effect: "Scales the equivalent bending load.",
      fig: "factor",
      sym: "Q"
    },
    E: {
      what: "Modulus of elasticity of the rope as a whole.",
      tip: "The handbook gives 10 to 14 million psi (about 69 000 to 97 000 MPa), with 12 million psi (about 83 000 MPa) often used.",
      effect: "Scales the bending stress and load.",
      fig: "modulus",
      sym: "E"
    },
    T: {
      what: "Direct tension in the rope where it passes over the sheave.",
      tip: "Include the load share on this part of line and any reeving friction.",
      effect: "Raises the radial pressure and lowers the factor against breaking.",
      fig: "force",
      sym: "T"
    },
    MBF: {
      what: "Minimum breaking force of the rope.",
      tip: "Take it from the rope certificate, not a nominal catalogue figure for another grade.",
      effect: "Only changes the factor against breaking.",
      fig: "force",
      sym: "MBF"
    },
    SFreq: {
      what: "Least factor of safety the rope must keep against breaking.",
      tip: "From the code or standard for your lifting application.",
      effect: "Only moves the pass or fail line.",
      fig: "factor",
      sym: "SF"
    },
    Ds: {
      what: "Diameter of the sheave or drum at the bottom of the rope groove.",
      tip: "Measure in the groove, not over the flanges.",
      effect: "A larger sheave lowers both the radial pressure and the bending load.",
      fig: "diameter",
      sym: "D"
    },
    pAllow: {
      what: "Largest radial pressure the sheave or drum material should carry for this rope type.",
      tip: "The handbook gives maximums by material and rope; cast iron is lowest and manganese steel highest.",
      effect: "Only moves the pressure check.",
      fig: "pressure",
      sym: "p_all"
    },
    Dd: {
      what: "Diameter of the drum or reel barrel.",
      tip: "Measure the barrel the first layer winds on.",
      effect: "A larger barrel holds more rope per layer.",
      fig: "diameter",
      sym: "D"
    },
    Hf: {
      what: "Outside diameter of the drum or reel flanges.",
      tip: "Measure across the flange rims.",
      effect: "Larger flanges give a deeper winding space and much more capacity.",
      fig: "diameter",
      sym: "H"
    },
    B: {
      what: "Clear width between the drum or reel flanges.",
      tip: "Measure inside the flanges at the barrel.",
      effect: "Capacity rises in proportion to the width.",
      fig: "length",
      sym: "B"
    },
    Y: {
      what: "Depth below the flange rim left empty so the rope cannot spill over.",
      tip: "Use zero for a full reel; leave a margin on working drums.",
      effect: "Reduces the winding depth and the capacity.",
      fig: "depth",
      sym: "Y"
    },
    K: {
      what: "Drum capacity factor for the rope size, in feet of rope per cubic inch of winding space, as the handbook tabulates it.",
      tip: "Read it from the handbook's drum and reel capacity table for your rope size; the tool converts the units.",
      effect: "Capacity is directly proportional to K.",
      fig: "factor",
      sym: "K"
    },
    Lreq: {
      what: "Length of rope the drum or reel must store.",
      tip: "Include dead wraps left on the drum and any spare length.",
      effect: "Only moves the capacity check.",
      fig: "length",
      sym: "L"
    }
  },
  "shock-stress-check": {
    member: {
      what: "The member that takes the shock and how it is supported or wound.",
      tip: "Pick the beam case nearest your supports, or a helical spring of round or square wire.",
      effect: "Changes the static stress and stiffness, and so the peak stress.",
      fig: "choice"
    },
    load: {
      what: "Whether a weight falls onto the member or a body moves horizontally into it.",
      tip: "Choose the moving body for carriages, trolleys or slides hitting a stop.",
      effect: "For a moving body only its kinetic energy acts, so the approximate formula is used.",
      fig: "choice"
    },
    L: {
      what: "Distance between the beam supports, or the length of a cantilever to the point struck.",
      tip: "Use centre-to-centre of the supports.",
      effect: "A longer beam is more flexible, which lowers the shock stress.",
      fig: "length",
      sym: "L"
    },
    I: {
      what: "Second moment of area of the beam section about the bending axis.",
      tip: "For a solid rectangle it is b h³ ÷ 12; use the section tables for rolled shapes.",
      effect: "A stiffer section raises the static part of the peak but lowers the stress overall.",
      fig: "section",
      sym: "I"
    },
    a: {
      what: "Distance from the neutral axis to the outermost fibre of the beam.",
      tip: "Half the depth for a symmetrical section.",
      effect: "The stress is directly proportional to this distance.",
      fig: "length",
      sym: "a"
    },
    E: {
      what: "Elastic modulus of the beam material.",
      tip: "Take it from your material data; about 200 000 MPa for steel.",
      effect: "A stiffer material takes the energy over a shorter deflection, so the stress is higher.",
      fig: "modulus",
      sym: "E"
    },
    Dm: {
      what: "Mean coil diameter of the spring: outside diameter less one wire diameter.",
      tip: "Measure the outside diameter and subtract the wire size.",
      effect: "A larger coil lowers the spring rate and spreads the energy over more deflection.",
      fig: "diameter",
      sym: "D"
    },
    dw: {
      what: "Wire diameter of a round-wire spring, or the side of a square-wire spring.",
      tip: "Measure the wire with a micrometer.",
      effect: "Thicker wire stiffens the spring sharply and raises the shock stress.",
      fig: "diameter",
      sym: "d"
    },
    n: {
      what: "Number of active coils that deflect under load.",
      tip: "Total coils less the closed and ground end coils (usually two).",
      effect: "More active coils lower the rate and the shock stress.",
      fig: "coils",
      sym: "n"
    },
    G: {
      what: "Shear modulus of the spring material.",
      tip: "Take it from your material data; about 79 000 MPa for spring steel.",
      effect: "A higher modulus raises the shock stress for the same energy.",
      fig: "modulus",
      sym: "G"
    },
    M: {
      what: "Mass of the body that falls or moves into the member.",
      tip: "Include everything that moves with the body at impact.",
      effect: "More mass means more energy and a higher peak stress.",
      fig: "mass",
      sym: "M"
    },
    h: {
      what: "Height the weight falls before it touches the member.",
      tip: "Measure from the bottom of the weight to the top of the member.",
      effect: "The peak stress rises roughly with the square root of the height.",
      fig: "height",
      sym: "h"
    },
    vel: {
      what: "Horizontal speed of the moving body at the moment of impact.",
      tip: "Use the highest speed the drive or a runaway can reach.",
      effect: "The energy and the stress rise with the speed; the stress in proportion to it.",
      fig: "velocity",
      sym: "v"
    },
    Sallow: {
      what: "Largest stress you allow in the member under the shock.",
      tip: "Base it on yield strength with your design code's factor.",
      effect: "Only moves the pass or fail line.",
      fig: "stress",
      sym: "S_all"
    }
  },
  "thin-ring-load-check": {
    sec: {
      what: "Shape of the bar the ring is made from.",
      tip: "Choose other section for tubes or shapes, and enter their second moment of area and depth.",
      effect: "Sets the second moment of area that resists bending.",
      fig: "choice"
    },
    D: {
      what: "Diameter of the ring measured to the centre of the bar.",
      tip: "Average the inside and outside diameters.",
      effect: "The stress grows with the diameter and the diameter change with its cube.",
      fig: "diameter",
      sym: "D"
    },
    d: {
      what: "Bar diameter for a round section, or the section depth measured radially in the plane of the ring.",
      tip: "For a flat band bent the easy way this is the thickness, not the width.",
      effect: "A deeper section lowers the stress sharply.",
      fig: "thickness",
      sym: "d"
    },
    b: {
      what: "Width of a rectangular section along the axis of the ring.",
      tip: "Used for rectangular bars only.",
      effect: "A wider bar lowers the stress in proportion.",
      fig: "length",
      sym: "b"
    },
    Iu: {
      what: "Second moment of area of an other-shaped section about the axis that bends in the ring's plane.",
      tip: "Used for other sections only; take it from section tables or CAD.",
      effect: "A larger value lowers the stress and the diameter change.",
      fig: "section",
      sym: "I"
    },
    E: {
      what: "Elastic modulus of the ring material.",
      tip: "Take it from your material data; about 200 000 MPa for steel.",
      effect: "Only changes the diameter changes, not the stress.",
      fig: "modulus",
      sym: "E"
    },
    P: {
      what: "Each of the two equal and opposite forces acting across a diameter of the ring.",
      tip: "Use the largest pinch or pull the ring sees in service.",
      effect: "The stress and diameter changes are in direct proportion to the load.",
      fig: "force",
      sym: "P"
    },
    Sallow: {
      what: "Largest bending stress you allow in the ring.",
      tip: "Base it on yield strength with your design code's factor, or on fatigue for repeated loads.",
      effect: "Only moves the stress check and sets the load at the allowable stress.",
      fig: "stress",
      sym: "S_all"
    },
    dMax: {
      what: "Largest increase or decrease of a diameter your fit or clearance can accept.",
      tip: "Take it from the clearance around the ring or the fit it must keep.",
      effect: "Only moves the diameter-change check.",
      fig: "tolerance",
      sym: "Δ_max"
    }
  }
});
