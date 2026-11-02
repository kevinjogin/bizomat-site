// KEVOS® Tools input guides: handbook89. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook89.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "grinding-wheel-life-plan": {
    C: {
      what: "Taylor constant for the work material group at the chosen chip thickness: the wheel speed for 1 minute wheel life.",
      tip: "Read it from the grinding data table for the material group, or use your calibrated value.",
      effect: "Every wheel speed and removal rate is proportional to it.",
      fig: "velocity",
      sym: "C"
    },
    ECT: {
      what: "Equivalent chip thickness: work speed × depth ÷ wheel speed, the chip load on the wheel.",
      tip: "Tables use 0.00017 to 0.00075 mm for steels; carbide and ceramics with diamond wheels use 0.00002 to 0.00008 mm.",
      effect: "A larger ECT raises the removal rate at a given wheel speed.",
      fig: "thickness",
      sym: "ECT"
    },
    T: {
      what: "Wheel life between dressings you want, in minutes of grinding.",
      tip: "Use the dressing interval your process can tolerate.",
      effect: "A longer life lowers the wheel speed and the removal rate.",
      fig: "time",
      sym: "T"
    },
    cal: {
      what: "Whether the standard Taylor constant is corrected with one result from your own grinding.",
      tip: "Use a recent result on the same machine and wheel type.",
      effect: "Scales every speed by the calibration ratio.",
      fig: "choice",
      sym: "cal"
    },
    VU: {
      what: "Wheel speed at which your shop result was obtained.",
      tip: "Use the speed at the wheel face, not the spindle rpm.",
      effect: "Raises the user constant in proportion.",
      fig: "velocity",
      sym: "V_U"
    },
    TU: {
      what: "Wheel life obtained in your shop result, in minutes of grinding between dressings.",
      tip: "Time only the grinding, not loading or measuring.",
      effect: "A longer life raises the user constant.",
      fig: "time",
      sym: "T_U"
    },
    CshopStd: {
      what: "Standard Taylor constant from the table at the chip thickness of your shop result.",
      tip: "Equal to the constant above when the shop result was at the same chip thickness.",
      effect: "The calibration ratio is the user constant divided by this.",
      fig: "velocity",
      sym: "C_ST"
    },
    ar: {
      what: "Radial depth of cut taken by the wheel per pass.",
      tip: "About 0.01 to 0.025 mm roughing and 0.0025 mm finishing.",
      effect: "A smaller depth needs a faster work speed for the same removal rate.",
      fig: "depth",
      sym: "a_r"
    },
    D: {
      what: "Outside diameter of the grinding wheel.",
      tip: "Measure after dressing; it shrinks with use.",
      effect: "Sets the wheel rpm for the wheel speed.",
      fig: "diameter",
      sym: "D"
    },
    dw: {
      what: "Diameter of the work being ground in cylindrical grinding.",
      tip: "Use the diameter before the final pass.",
      effect: "Sets the work rpm for the work speed.",
      fig: "diameter",
      sym: "d_w"
    },
    width: {
      what: "Width of the grinding wheel face.",
      tip: "Measure the usable face after dressing.",
      effect: "With the fraction, sets the side feed.",
      fig: "length",
      sym: "W"
    },
    frac: {
      what: "Side feed per work revolution as a fraction of the wheel width.",
      tip: "About 1/2 to 3/4 for roughing and 1/4 to 3/8 for finishing.",
      effect: "Raises the feed rate and removal rate.",
      fig: "ratio",
      sym: "C_f"
    },
    dist: {
      what: "Length ground in one pass of the wheel along the work.",
      tip: "Include the overrun at each end.",
      effect: "The time per pass rises in proportion.",
      fig: "length",
      sym: "DIST"
    },
    tsp: {
      what: "Spark-out time added to each pass with no further infeed.",
      tip: "Zero for roughing passes without spark-out.",
      effect: "Adds directly to the time per pass.",
      fig: "time",
      sym: "t_sp"
    },
    vmax: {
      what: "Maximum operating speed marked on the grinding wheel.",
      tip: "Read it from the wheel blotter or label; never exceed it.",
      effect: "Fails the plan when the wheel speed is higher.",
      fig: "velocity",
      sym: "v_max"
    }
  },
  "thread-tool-relief-angles": {
    lead: {
      what: "Axial advance of the thread in one turn: pitch times the number of starts.",
      tip: "A 5 tpi double-start thread has a lead of 0.4 in (10.16 mm).",
      effect: "A larger lead raises both helix angles and the leading relief.",
      fig: "pitch",
      sym: "L"
    },
    Dmaj: {
      what: "Major (outside) diameter of the thread being cut.",
      tip: "Use the basic major diameter of the thread.",
      effect: "Sets the helix angle that reduces the trailing relief.",
      fig: "diameter",
      sym: "D"
    },
    Kmin: {
      what: "Minor (root) diameter of the thread being cut.",
      tip: "Use the basic minor diameter from the thread standard.",
      effect: "Sets the helix angle added to the leading relief.",
      fig: "diameter",
      sym: "K"
    },
    ang: {
      what: "Included angle of the thread form, which the tool point must match.",
      tip: "60° Unified and metric, 29° Acme, 30° trapezoidal.",
      effect: "Changes the relief ground perpendicular to the edges and the nose angle.",
      fig: "angle",
      sym: "φ"
    },
    ae: {
      what: "Effective relief angle wanted below every cutting edge, measured parallel to the thread axis.",
      tip: "8 to 14° for high-speed steel and 5 to 10° for carbide; more for soft, gummy metals.",
      effect: "Adds directly to both side relief angles.",
      fig: "angle",
      sym: "a_e"
    }
  },
  "milling-chip-thickness-ect": {
    mode: {
      what: "Whether the cutter cuts at the edge of the work (end or side milling) or is centred on it (face milling).",
      tip: "Face milling the side of a part with ar/D of 0.5 or less behaves as end milling.",
      effect: "Changes the engagement angle formula and the reference feed.",
      fig: "choice",
      sym: "mode"
    },
    D: {
      what: "Diameter of the milling cutter.",
      tip: "Use the effective cutting diameter for inserts with a lead angle.",
      effect: "With the radial depth, sets the engagement.",
      fig: "diameter",
      sym: "D"
    },
    ar: {
      what: "Radial depth (width) of cut taken by the cutter.",
      tip: "Equal to the cutter diameter for a full slot.",
      effect: "A lighter radial cut thins the chip.",
      fig: "depth",
      sym: "a_r"
    },
    z: {
      what: "Number of teeth or inserts on the milling cutter.",
      tip: "Count effective teeth; some cutters have unequal or staggered teeth.",
      effect: "ECT rises in proportion; mean chip thickness does not.",
      fig: "teeth",
      sym: "z"
    },
    fz: {
      what: "Feed per tooth now used or planned.",
      tip: "Feed rate ÷ (teeth × rpm).",
      effect: "Mean chip thickness and ECT rise in proportion.",
      fig: "feed",
      sym: "f_z"
    },
    aaCEL: {
      what: "Axial depth of cut divided by the cutting edge length in contact.",
      tip: "About 0.95 for a square shoulder (90°) cutter; less for cutters with a lead angle.",
      effect: "ECT rises in proportion.",
      fig: "ratio",
      sym: "aa/CEL"
    },
    hTarget: {
      what: "Mean chip thickness you want the cutter to take.",
      tip: "The handbook reference is 0.108 mm (full slot at 0.17 mm per tooth).",
      effect: "Sets the feed per tooth reported.",
      fig: "thickness",
      sym: "h_t"
    },
    hMin: {
      what: "Smallest mean chip thickness you accept before the cutter starts to rub.",
      tip: "The handbook gives about 0.02 to 0.04 mm as the practical minimum.",
      effect: "Fails the cut when the chip is thinner.",
      fig: "thickness",
      sym: "h_min"
    },
    n: {
      what: "Spindle speed of the milling cutter.",
      tip: "From the cutting speed and cutter diameter.",
      effect: "Only changes the feed rate reported.",
      fig: "rotation",
      sym: "n"
    }
  }
});
