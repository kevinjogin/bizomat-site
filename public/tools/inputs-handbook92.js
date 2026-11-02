// KEVOS® Tools input guides: handbook92. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook92.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "crossed-helical-exact-centre-distance": {
    sigma: {
      what: "Angle between the two shafts the crossed helical gears connect.",
      tip: "90° for shafts at right angles.",
      effect: "The helix angles of gear and pinion add to it.",
      fig: "angle",
      sym: "Σ"
    },
    C: {
      what: "Exact centre distance the gear pair must fit between the shafts.",
      tip: "Measure square to both shafts along their common perpendicular.",
      effect: "Sets the helix angles found by trial.",
      fig: "length",
      sym: "C"
    },
    mn: {
      what: "Normal module of the gear teeth, the size of tooth in the normal plane.",
      tip: "For an inch normal diametral pitch Pn, enter 25.4 ÷ Pn.",
      effect: "Scales every diameter, lead and tooth dimension.",
      fig: "length",
      sym: "m_n"
    },
    Nt: {
      what: "Number of teeth in the larger gear of the crossed helical pair.",
      tip: "Gear teeth ÷ pinion teeth gives the speed ratio.",
      effect: "Sets the ratio and the gear diameter.",
      fig: "count",
      sym: "N"
    },
    n: {
      what: "Number of teeth in the smaller gear (pinion) of the pair.",
      tip: "Take the whole number nearest the estimate shown.",
      effect: "Sets the ratio and the pinion diameter.",
      fig: "count",
      sym: "n"
    },
    alphaA: {
      what: "Approximate helix angle you want on the larger gear.",
      tip: "The pinion takes the shaft angle less this; 45° each at 90° is common.",
      effect: "Picks which of the two fitting helix angles is used.",
      fig: "angle",
      sym: "α_a"
    },
    Dc: {
      what: "Pitch diameter of the formed milling cutter used for the teeth.",
      tip: "From the cutter maker or the handbook’s table of standard cutters.",
      effect: "A larger cutter raises the cutter tooth number N′.",
      fig: "diameter",
      sym: "D_c"
    }
  },
  "helical-milling-cutter-selection": {
    Nt: {
      what: "Actual number of teeth in the helical gear to be milled.",
      tip: "Count the teeth on the drawing, not the equivalent number.",
      effect: "The cutter tooth number rises in proportion.",
      fig: "count",
      sym: "N"
    },
    helix: {
      what: "Helix angle of the gear teeth, measured from the gear axis.",
      tip: "Set the milling machine table to this angle.",
      effect: "A larger angle raises the cutter tooth number sharply.",
      fig: "angle",
      sym: "α"
    },
    mn: {
      what: "Normal module of the gear teeth, the size of tooth in the normal plane.",
      tip: "For an inch normal diametral pitch Pn, enter 25.4 ÷ Pn.",
      effect: "Scales every diameter, lead and tooth dimension.",
      fig: "length",
      sym: "m_n"
    },
    Dc: {
      what: "Pitch diameter of the formed involute cutter you will use.",
      tip: "Measure the cutter as it is now, after sharpening.",
      effect: "A larger cutter raises the cutter tooth number.",
      fig: "diameter",
      sym: "D_c"
    }
  },
  "enlarged-helical-pinion": {
    n: {
      what: "Number of teeth in the helical pinion to be checked for enlargement.",
      tip: "Pinions with fewer than about 24 teeth usually need enlarging.",
      effect: "Fewer teeth need more enlargement.",
      fig: "count",
      sym: "n"
    },
    mn: {
      what: "Normal module of the gear teeth, the size of tooth in the normal plane.",
      tip: "For an inch normal diametral pitch Pn, enter 25.4 ÷ Pn.",
      effect: "Scales every diameter, lead and tooth dimension.",
      fig: "length",
      sym: "m_n"
    },
    psi: {
      what: "Helix angle of the pinion teeth, measured from the axis.",
      tip: "The formulas are for 20° normal pressure angle teeth.",
      effect: "A larger helix angle needs less enlargement.",
      fig: "angle",
      sym: "ψ"
    },
    Nt: {
      what: "Number of teeth in the standard mating gear.",
      tip: "Used only for the centre distances.",
      effect: "Sets the standard and tight-mesh centre distances.",
      fig: "count",
      sym: "N"
    },
    tnP: {
      what: "Arc tooth thickness of the enlarged pinion at 1 diametral pitch.",
      tip: "Read it from the handbook’s Table 9c for the pinion’s tooth number.",
      effect: "A thicker tooth pushes the gears further apart.",
      fig: "thickness",
      sym: "t_nP"
    },
    tnG: {
      what: "Arc tooth thickness of the mating gear at 1 diametral pitch.",
      tip: "A standard gear has 1.5708 (half the circular pitch).",
      effect: "A thicker tooth pushes the gears further apart.",
      fig: "thickness",
      sym: "t_nG"
    }
  },
  "helical-hobbing-change-gears": {
    Nt: {
      what: "Number of teeth on the helical gear being hobbed.",
      tip: "Count from the gear drawing.",
      effect: "Sets the index ratio required.",
      fig: "count",
      sym: "N"
    },
    L: {
      what: "Lead of the helix on the gear being hobbed.",
      tip: "L = π × pitch diameter ÷ tan helix angle.",
      effect: "Sets the index ratio and the feed correction.",
      fig: "length",
      sym: "L"
    },
    F: {
      what: "Nominal feed of the hob per revolution of the gear blank.",
      tip: "The tool corrects it slightly to offset the index gear error.",
      effect: "Changes the index ratio required a little.",
      fig: "feed",
      sym: "F"
    },
    K: {
      what: "Index constant of the hobbing machine without a differential.",
      tip: "Take it from the machine maker’s manual or index plate.",
      effect: "The index ratio rises in proportion.",
      fig: "factor",
      sym: "K"
    },
    T: {
      what: "Number of threads (starts) on the hob.",
      tip: "Single-thread hobs are usual; double threads are used for roughing.",
      effect: "The index ratio rises in proportion.",
      fig: "count",
      sym: "T"
    },
    M: {
      what: "Feed gear constant of the hobbing machine.",
      tip: "Take it from the machine maker’s manual.",
      effect: "Sets the feed gear ratio for the feed required.",
      fig: "feed",
      sym: "M"
    },
    hand: {
      what: "Whether the gear and hob helices are of the same or opposite hand.",
      tip: "Same hand uses the minus sign in the handbook formulas.",
      effect: "Changes the sign in the index ratio and feed formulas.",
      fig: "choice",
      sym: "hand"
    },
    mode: {
      what: "Whether the hob cuts conventionally or by climb hobbing.",
      tip: "Climb hobbing reverses the sign rule for the hands.",
      effect: "Changes the sign in the index ratio and feed formulas.",
      fig: "choice",
      sym: "mode"
    },
    i1: {
      what: "First driving gear in the index change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the index ratio obtained and so the feed correction.",
      fig: "count",
      sym: "z"
    },
    i2: {
      what: "Second driving gear in the index change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the index ratio obtained and so the feed correction.",
      fig: "count",
      sym: "z"
    },
    i3: {
      what: "First driven gear in the index change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the index ratio obtained and so the feed correction.",
      fig: "count",
      sym: "z"
    },
    i4: {
      what: "Second driven gear in the index change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the index ratio obtained and so the feed correction.",
      fig: "count",
      sym: "z"
    },
    f1: {
      what: "First driving gear in the feed change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the feed obtained and so the lead.",
      fig: "count",
      sym: "z"
    },
    f2: {
      what: "Second driving gear in the feed change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the feed obtained and so the lead.",
      fig: "count",
      sym: "z"
    },
    f3: {
      what: "First driven gear in the feed change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the feed obtained and so the lead.",
      fig: "count",
      sym: "z"
    },
    f4: {
      what: "Second driven gear in the feed change-gear train, as fitted on the hobbing machine.",
      tip: "Enter its number of teeth; for a simple pair repeat equal gears in the second positions.",
      effect: "Sets the feed obtained and so the lead.",
      fig: "count",
      sym: "z"
    },
    errMax: {
      what: "Largest lead error you accept for every 100 mm of lead.",
      tip: "Take it from the lead (helix) tolerance on the gear drawing.",
      effect: "Fails the gear set-up when the lead error is larger.",
      fig: "tolerance",
      sym: "e"
    }
  }
});
