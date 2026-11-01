// KEVOS® WORKOS input guides: handbook93. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook93.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "spur-gear-profile-checker": {
    m: {
      what: "Module of the pinion and gear, the pitch diameter per tooth in millimetres.",
      tip: "For an inch diametral pitch P, enter 25.4 ÷ P.",
      effect: "Scales every diameter, tooth thickness and centre distance.",
      fig: "length",
      sym: "m"
    },
    phi: {
      what: "Pressure angle of the gears and the hob at the standard pitch circle.",
      tip: "20° is the usual standard; 14½° and 25° are also used.",
      effect: "Changes the base circles and every involute angle.",
      fig: "angle",
      sym: "φ"
    },
    n: {
      what: "Number of teeth in the pinion, the smaller gear of the pair.",
      tip: "Count the teeth on the drawing or the part.",
      effect: "Sets the pinion diameters and its undercut limit.",
      fig: "count",
      sym: "n"
    },
    dO: {
      what: "Outside (tip) diameter of the pinion as it is made.",
      tip: "Standard is (n + 2) × module; measure it on an odd-tooth gear with care.",
      effect: "Sets where contact ends on the pinion and starts on the gear.",
      fig: "diameter",
      sym: "d_o"
    },
    Nt: {
      what: "Number of teeth in the mating gear of the pair.",
      tip: "Count the teeth on the drawing or the part.",
      effect: "Sets the gear diameters and its undercut limit.",
      fig: "count",
      sym: "N"
    },
    DO: {
      what: "Outside (tip) diameter of the mating gear as it is made.",
      tip: "Standard is (N + 2) × module.",
      effect: "Sets where contact starts on the pinion.",
      fig: "diameter",
      sym: "D_o"
    },
    b: {
      what: "Dedendum of the tooth system as a multiple of the module.",
      tip: "Enter 1.25 for a dedendum of 1.25 ÷ P (1.25 module); 1.35 for shaved or ground teeth.",
      effect: "A deeper root lowers the true involute form diameter.",
      fig: "factor",
      sym: "b"
    },
    rc: {
      what: "Tip radius of the hob or rack cutter as a multiple of the module.",
      tip: "Enter 0.30 for a tip radius of 0.30 ÷ P; 0 for a sharp-cornered hob.",
      effect: "A larger radius raises the TIF diameter and reduces undercut.",
      fig: "factor",
      sym: "r_c"
    },
    mfMin: {
      what: "Least contact ratio you accept for this drive.",
      tip: "The handbook suggests not less than about 1.4 for power gears, 1.15 at the very least.",
      effect: "Fails the gear pair when the contact ratio is lower.",
      fig: "tolerance",
      sym: "m_f"
    }
  },
  "spur-gears-for-given-centre-distance": {
    m: {
      what: "Module of the hob or cutter used to cut both gears, the pitch diameter per tooth in millimetres.",
      tip: "For an inch diametral pitch P, enter 25.4 ÷ P.",
      effect: "Scales every diameter, tooth thickness and centre distance.",
      fig: "length",
      sym: "m"
    },
    phi: {
      what: "Pressure angle of the hob or cutter at the standard pitch circle.",
      tip: "20° is the usual standard; 14½° and 25° are also used.",
      effect: "Changes the base circles and every involute angle.",
      fig: "angle",
      sym: "φ"
    },
    Np: {
      what: "Number of teeth in the pinion of the pair.",
      tip: "Choose the teeth for the ratio you need first.",
      effect: "Sets the ratio and the pinion tooth thickness.",
      fig: "count",
      sym: "N_P"
    },
    Ng: {
      what: "Number of teeth in the gear of the pair.",
      tip: "Gear teeth ÷ pinion teeth gives the ratio.",
      effect: "Sets the ratio and the gear tooth thickness.",
      fig: "count",
      sym: "N_G"
    },
    C1: {
      what: "Centre distance the gear pair must run at in the housing.",
      tip: "Take it from the housing bores, measured between shaft centres.",
      effect: "Sets the operating pitch and pressure angle.",
      fig: "length",
      sym: "C_1"
    },
    bc: {
      what: "Addendum of the hob or cutter, from its pitch line to its tip.",
      tip: "From the hob maker; it equals the dedendum the hob cuts on a standard gear.",
      effect: "Sets the dedendums, root diameters and tip clearance.",
      fig: "length",
      sym: "b_c"
    },
    phiMin: {
      what: "Smallest operating pressure angle you accept for the pair.",
      tip: "The handbook suggests about 18°.",
      effect: "Flags a pressure angle that is too low.",
      fig: "angle",
      sym: "φ_min"
    },
    phiMax: {
      what: "Largest operating pressure angle you accept for the pair.",
      tip: "The handbook suggests about 25°.",
      effect: "Flags a pressure angle that is too high.",
      fig: "angle",
      sym: "φ_max"
    }
  },
  "enlarged-spur-pinion-mesh": {
    m: {
      what: "Module of the enlarged pinion and its mating gear, the pitch diameter per tooth in millimetres.",
      tip: "For an inch diametral pitch P, enter 25.4 ÷ P.",
      effect: "Scales every diameter, tooth thickness and centre distance.",
      fig: "length",
      sym: "m"
    },
    phi: {
      what: "Pressure angle of the gears at the standard pitch circle.",
      tip: "20° is the usual standard; 14½° and 25° are also used.",
      effect: "Changes the base circles and every involute angle.",
      fig: "angle",
      sym: "φ"
    },
    n: {
      what: "Number of teeth in the enlarged pinion of the pair.",
      tip: "The handbook enlarges coarse-pitch pinions of 10 to 17 teeth at 20°.",
      effect: "Sets the pinion diameters and the centre distance.",
      fig: "count",
      sym: "n"
    },
    Nt: {
      what: "Number of teeth in the gear that meshes with the enlarged pinion.",
      tip: "A reduced gear needs enough teeth to avoid its own undercut.",
      effect: "Sets the gear diameters and the centre distance.",
      fig: "count",
      sym: "N"
    },
    ePin: {
      what: "Amount the pinion outside diameter is made larger than standard.",
      tip: "Take it from the handbook’s enlarged pinion tables for the tooth number, or your design.",
      effect: "Thickens the pinion teeth by e tan φ.",
      fig: "length",
      sym: "e"
    },
    eGear: {
      what: "Amount the gear outside diameter is made smaller than standard.",
      tip: "Equal to the pinion enlargement keeps the standard centre distance; 0 for a standard gear.",
      effect: "Thins the gear teeth by e tan φ and raises its undercut limit.",
      fig: "length",
      sym: "e_G"
    },
    aH: {
      what: "Addendum of the hob or rack cutter, from its pitch line to its tip.",
      tip: "From the hob maker; it equals the dedendum the hob cuts on a standard gear.",
      effect: "A longer addendum raises the smallest tooth number without undercut.",
      fig: "length",
      sym: "a_H"
    },
    rt: {
      what: "Radius at the tip corners of the hob or rack cutter teeth.",
      tip: "From the hob maker; 0 for a sharp-cornered hob.",
      effect: "A larger radius lowers the smallest tooth number without undercut.",
      fig: "length",
      sym: "r_t"
    }
  },
  "gear-shaving-stock-check": {
    m: {
      what: "Module of the preshaved gear and the master gear, the pitch diameter per tooth in millimetres.",
      tip: "For an inch diametral pitch P, enter 25.4 ÷ P.",
      effect: "Scales every diameter, tooth thickness and centre distance.",
      fig: "length",
      sym: "m"
    },
    phi: {
      what: "Pressure angle of the gears at the standard pitch circle.",
      tip: "20° is the usual standard; 14½° and 25° are also used.",
      effect: "Changes the base circles and every involute angle.",
      fig: "angle",
      sym: "φ"
    },
    n: {
      what: "Number of teeth in the preshaved gear being checked.",
      tip: "Count the teeth on the gear or its drawing.",
      effect: "Used only in the exact involute check.",
      fig: "count",
      sym: "n"
    },
    Nt: {
      what: "Number of teeth in the master gear of standard tooth thickness.",
      tip: "Use a master gear whose tooth thickness is known to be standard.",
      effect: "Used only in the exact involute check.",
      fig: "count",
      sym: "N"
    },
    d: {
      what: "Amount the centre distance exceeds standard with the gears meshed tight.",
      tip: "Mesh without backlash on a centre-distance fixture and average several positions.",
      effect: "The stock rises in proportion, 2 tan φ for each millimetre.",
      fig: "length",
      sym: "d"
    },
    sMin: {
      what: "Least total stock (both sides of the tooth) you want left for shaving.",
      tip: "From your shaving process; the handbook gives 0.0508 to 0.0762 mm for 7 to 10 diametral pitch.",
      effect: "Flags too little stock to clean up the teeth.",
      fig: "tolerance",
      sym: "s_min"
    },
    sMax: {
      what: "Most total stock (both sides of the tooth) you want left for shaving.",
      tip: "Too much stock shortens shaving cutter life and lengthens shaving time.",
      effect: "Flags too much stock for shaving.",
      fig: "tolerance",
      sym: "s_max"
    }
  }
});
