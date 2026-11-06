// BIZOMAT Tools input guides: handbook98. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook98.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "general-purpose-acme-limits": {
    D: {
      what: "Basic major diameter, which is also the nominal size of the thread.",
      tip: "Use the nominal size from the thread designation, e.g. 1.000 for 1.000-5 ACME-2G.",
      effect: "Sets the basic diameters and the √D allowances and tolerances.",
      fig: "diameter",
      sym: "D"
    },
    n: {
      what: "Number of thread pitches in one inch along the axis.",
      tip: "Count the crests over one inch or read it from the designation; the pitch is 1 ÷ n.",
      effect: "Sets the pitch, thread height and the √P part of the tolerance.",
      fig: "thread",
      sym: "n"
    },
    cls: {
      what: "Tolerance class of the general purpose Acme thread, which sets the allowance and tolerances.",
      tip: "Class 2 is the usual fit; classes 3 and 4 give less backlash and are harder to make.",
      effect: "Closer classes have smaller allowances and pitch diameter tolerances.",
      fig: "choice",
      sym: "cls"
    },
    starts: {
      what: "How many separate helical threads are cut side by side on the screw.",
      tip: "Count the thread ends at the end of the screw; the lead is starts × pitch.",
      effect: "Two, three and four or more starts add 50, 75 and 100 % of the allowance to the nut.",
      fig: "count",
      sym: "z"
    },
    LE: {
      what: "Axial length over which the screw and nut threads are engaged.",
      tip: "Use the nut length, or the depth of the shorter of the two threads.",
      effect: "Beyond twice the diameter, each inch or part adds 10 % to the allowance.",
      fig: "length",
      sym: "L_e"
    }
  },
  "centralizing-acme-limits": {
    D: {
      what: "Basic major diameter, which is also the nominal size of the thread.",
      tip: "Use the nominal size from the thread designation, e.g. 1.000 for 1.000-5 ACME-2G.",
      effect: "Sets the basic diameters and the √D allowances and tolerances.",
      fig: "diameter",
      sym: "D"
    },
    n: {
      what: "Number of thread pitches in one inch along the axis.",
      tip: "Count the crests over one inch or read it from the designation; the pitch is 1 ÷ n.",
      effect: "Sets the pitch, thread height and the √P part of the tolerance.",
      fig: "thread",
      sym: "n"
    },
    ce: {
      what: "Centralizing class of the external thread, the screw.",
      tip: "A 2C screw suits any nut class; 3C and 4C need nuts of the same or closer class.",
      effect: "Sets the screw pitch diameter allowance and major diameter tolerance.",
      fig: "choice",
      sym: "cls_e"
    },
    ci: {
      what: "Centralizing class of the internal thread, the nut.",
      tip: "Choose a nut class the same as or closer than the screw class.",
      effect: "Sets the nut pitch diameter and major diameter tolerances.",
      fig: "choice",
      sym: "cls_i"
    },
    LE: {
      what: "Axial length over which the screw and nut threads are engaged.",
      tip: "Use the nut length, or the depth of the shorter of the two threads.",
      effect: "Beyond twice the diameter, each inch or part adds 10 % to the allowance.",
      fig: "length",
      sym: "L_e"
    }
  },
  "stub-acme-limits": {
    D: {
      what: "Basic major diameter, which is also the nominal size of the thread.",
      tip: "Use the nominal size from the designation, e.g. 0.500 for 0.500-20 Stub Acme.",
      effect: "Sets the basic diameters and the √D allowances and tolerances.",
      fig: "diameter",
      sym: "D"
    },
    n: {
      what: "Number of thread pitches in one inch along the axis.",
      tip: "Count the crests over one inch or read it from the designation; the pitch is 1 ÷ n.",
      effect: "Sets the pitch, thread height and the √P part of the tolerance.",
      fig: "thread",
      sym: "n"
    },
    form: {
      what: "Which of the three Stub Acme profiles in the standard is cut.",
      tip: "The designation adds M1 or M2 after Acme for the modified forms.",
      effect: "Sets the basic thread height and the crest flat of the form.",
      fig: "choice",
      sym: "form"
    },
    cls: {
      what: "Fit whose pitch diameter allowance and tolerance the Stub Acme thread takes.",
      tip: "Stub Acme threads normally take Class 2G; 3G or 4G give less backlash.",
      effect: "Closer fits reduce the allowance and the pitch diameter tolerance.",
      fig: "choice",
      sym: "cls"
    },
    LE: {
      what: "Axial length over which the screw and nut threads are engaged.",
      tip: "Use the nut length, or the depth of the shorter of the two threads.",
      effect: "Beyond twice the diameter, each inch or part adds 10 % to the allowance.",
      fig: "length",
      sym: "L_e"
    }
  },
  "whitworth-thread-limits": {
    D: {
      what: "Nominal outside diameter of the Whitworth bolt, in inches.",
      tip: "Use the nominal size, e.g. 0.5 for a 1/2 in BSW thread.",
      effect: "Sets the basic diameters and the ∛D term of the tolerance unit.",
      fig: "diameter",
      sym: "D"
    },
    n: {
      what: "Number of thread pitches in one inch along the axis.",
      tip: "BSW and BSF sizes have different pitches; check with a Whitworth pitch gauge.",
      effect: "Sets the pitch, thread depth and the √p terms of the tolerances.",
      fig: "thread",
      sym: "n"
    },
    L: {
      what: "Axial length over which the bolt and nut threads are engaged.",
      tip: "Use the nut thickness or the length of thread in a tapped hole.",
      effect: "A longer engagement raises the tolerance unit T.",
      fig: "length",
      sym: "L"
    },
    bc: {
      what: "BS 84 class of the bolt, from a fine snug fit to ordinary commercial quality.",
      tip: "Medium suits better interchangeable work, free most commercial bolts.",
      effect: "Close, medium and free take 2/3, 1 and 3/2 of T.",
      fig: "choice",
      sym: "cls_b"
    },
    nc: {
      what: "BS 84 class of the nut that mates with the bolt.",
      tip: "Normal class nuts are meant for medium or free class bolts.",
      effect: "Close, medium and normal take 2/3, 1 and 3/2 of T on the effective diameter.",
      fig: "choice",
      sym: "cls_n"
    },
    ss: {
      what: "Whether the bolt is stainless steel, which BS 84 treats differently.",
      tip: "Choose stainless steel for austenitic or other stainless bolts.",
      effect: "Above 3/4 in the bolt limits move 0.001 in smaller.",
      fig: "choice",
      sym: "mat"
    }
  },
  "unified-miniature-thread-limits": {
    D: {
      what: "Nominal size of the miniature thread in millimetres, e.g. 1.00 UNM.",
      tip: "The standard series runs from 0.30 to 1.40 mm.",
      effect: "Sets the major diameter and all the limits.",
      fig: "diameter",
      sym: "D"
    },
    p: {
      what: "Axial distance between adjacent thread crests, in millimetres.",
      tip: "Read it from the size table of the standard, e.g. 0.250 mm for 1.00 UNM.",
      effect: "Sets the thread depth and every tolerance.",
      fig: "pitch",
      sym: "p"
    }
  },
  "bearing-static-equivalent-load": {
    type: {
      what: "Kind of rolling bearing, which sets the static load factors used.",
      tip: "Use the maker’s description; tapered roller bearings use the roller factors.",
      effect: "Changes Xo and Yo or the thrust formula.",
      fig: "choice",
      sym: "type"
    },
    rows: {
      what: "Whether one row of rolling elements carries the load, or two rows or a matched pair.",
      tip: "A tandem pair counts as single row; back-to-back and face-to-face pairs as double row.",
      effect: "Double row factors raise Xo and Yo.",
      fig: "choice",
      sym: "rows"
    },
    dir: {
      what: "Whether a thrust bearing takes axial load in one direction or both.",
      tip: "Only used for thrust ball and thrust roller bearings.",
      effect: "Sets the range of Fr ÷ Fa for which the thrust formula holds.",
      fig: "choice",
      sym: "dir"
    },
    alpha: {
      what: "Nominal angle between the line of contact and a radial plane of the bearing.",
      tip: "Take it from the bearing catalogue; deep groove ball bearings are 0°.",
      effect: "Sets Yo for angular and roller bearings and the 2.3 Fr tan α term.",
      fig: "angle",
      sym: "α"
    },
    Fr: {
      what: "Force on the bearing at right angles to the shaft axis.",
      tip: "For a matched pair, enter the total radial load on the pair.",
      effect: "Raises the static equivalent load; Po is never less than Fr.",
      fig: "force",
      sym: "F_r"
    },
    Fa: {
      what: "Force on the bearing along the shaft axis.",
      tip: "For a matched pair, enter the total axial load on the pair.",
      effect: "Raises the static equivalent load through Yo.",
      fig: "force",
      sym: "F_a"
    },
    Co: {
      what: "Static load rating of the bearing from the maker or the rating formulas.",
      tip: "Use Co for radial bearings and Coa for thrust bearings, in kilonewtons.",
      effect: "Divided by Po to give the static safety factor.",
      fig: "force",
      sym: "C_0"
    },
    s0: {
      what: "Smallest ratio of static rating to static load that the duty allows.",
      tip: "Take it from the bearing maker for the smoothness and shock of the duty.",
      effect: "Fails the bearing when Co ÷ Po is below it.",
      fig: "factor",
      sym: "s_0"
    }
  },
  "rail-and-track-wheel-size": {
    C: {
      what: "Vertical force carried by one track wheel onto the rail.",
      tip: "Include the wheel’s share of the load, the trolley and any impact allowance you design for.",
      effect: "The rail widths and the wheel diameter rise in proportion.",
      fig: "force",
      sym: "C"
    },
    D: {
      what: "Diameter of the track wheel at its tread.",
      tip: "Measure across the tread, not the flange.",
      effect: "A larger wheel needs a narrower tread and raises the AREA load.",
      fig: "diameter",
      sym: "D"
    },
    A: {
      what: "Width across the head of the rail the wheel will run on.",
      tip: "Take it from the rail section you intend to use.",
      effect: "A wider head lowers the smallest safe wheel diameter.",
      fig: "length",
      sym: "A"
    },
    K: {
      what: "Factor for the wheel material in the handbook smallest wheel formula.",
      tip: "The handbook gives ranges for steel castings and cast iron in lb/in²; 1 lb/in² = 0.006895 N/mm².",
      effect: "A higher factor allows a smaller wheel.",
      fig: "factor",
      sym: "K"
    },
    ys: {
      what: "Yield strength of the steel wheel or roller and plate for the AREA formula.",
      tip: "Use the lower yield strength of the wheel and the rail or plate.",
      effect: "The allowable load per unit length rises with it above 13,000 lb/in².",
      fig: "stress",
      sym: "σ_y"
    }
  }
});
