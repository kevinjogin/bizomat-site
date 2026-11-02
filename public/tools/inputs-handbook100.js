// KEVOS® Tools input guides: handbook100. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook100.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "cutting-speed-table-adjustment": {
    op: {
      what: "The operation and which form of the handbook speed adjustment applies to it.",
      tip: "Use the partial width choice for end and side milling when the radial depth is less than the cutter diameter.",
      effect: "Chooses which factors multiply the table speed.",
      fig: "choice",
      sym: "op"
    },
    fopt: {
      what: "First feed of the optimum and average pair given in the speed table.",
      tip: "Table feeds are in thousandths of an inch; multiply by 0.0254 for mm.",
      effect: "Divides your feed to give the feed ratio, and sets fmin and fmax.",
      fig: "feed",
      sym: "f_opt"
    },
    Vopt: {
      what: "Lower speed of the optimum and average pair given in the speed table.",
      tip: "Table speeds are in ft/min; multiply by 0.3048 for m/min. For HSS use the single HSS speed.",
      effect: "The adjusted speed is this times the factors.",
      fig: "velocity",
      sym: "V_opt"
    },
    Vavg: {
      what: "Higher speed of the optimum and average pair given in the speed table.",
      tip: "Use the speed paired with the smaller (average) feed.",
      effect: "The speed ratio Vavg ÷ Vopt picks the column in the factor table.",
      fig: "velocity",
      sym: "V_avg"
    },
    f: {
      what: "Feed per revolution or per tooth that you intend to run.",
      tip: "Use the same unit as the table feed, per revolution for turning and drilling, per tooth for milling.",
      effect: "Sets the feed ratio and, for side milling, the interpolated feed factor.",
      fig: "feed",
      sym: "f"
    },
    Ff: {
      what: "Feed factor read from the adjustment table at your feed and speed ratios.",
      tip: "Find the feed ratio row and the speed ratio column in the table for the operation.",
      effect: "The adjusted speed rises in proportion.",
      fig: "factor",
      sym: "F"
    },
    Fd: {
      what: "Factor for depth of cut and lead angle read from the adjustment table.",
      tip: "Read it in the same row as the feed factor, in the column for your depth and lead angle.",
      effect: "The adjusted speed rises in proportion.",
      fig: "factor",
      sym: "F"
    },
    Far: {
      what: "Factor for radial depth of cut in face milling and slit milling.",
      tip: "Read it from the face milling table at your width of cut to cutter diameter ratio.",
      effect: "The adjusted speed rises in proportion.",
      fig: "factor",
      sym: "F"
    },
    kmax: {
      what: "Maximum feed per tooth factor for your radial depth to diameter ratio.",
      tip: "Read it from the maximum feed column of the side milling table at your ar/D.",
      effect: "fmax = this times the table feed.",
      fig: "factor",
      sym: "F"
    },
    kmin: {
      what: "Minimum feed per tooth factor for your radial depth to diameter ratio.",
      tip: "Read it from the minimum feed column of the side milling table at your ar/D.",
      effect: "fmin = this times the table feed.",
      fig: "factor",
      sym: "F"
    },
    Ff1: {
      what: "Feed factor at the maximum feed per tooth for your ar/D and speed ratio.",
      tip: "Read it from the maximum feed half of the side milling table.",
      effect: "The interpolated feed factor reaches this at fmax.",
      fig: "factor",
      sym: "F"
    },
    Ff2: {
      what: "Feed factor at the minimum feed per tooth for your ar/D and speed ratio.",
      tip: "Read it from the minimum feed half of the side milling table.",
      effect: "The interpolated feed factor starts from this at fmin.",
      fig: "factor",
      sym: "F"
    },
    D: {
      what: "Diameter of the work in turning, or of the drill, reamer or milling cutter.",
      tip: "Use the diameter being cut: the work in turning, the tool otherwise.",
      effect: "A larger diameter needs a lower spindle speed for the same cutting speed.",
      fig: "diameter",
      sym: "D"
    },
    z: {
      what: "Number of cutting teeth on the milling cutter or tool.",
      tip: "Enter 1 for turning and for drilling with the feed per revolution.",
      effect: "The feed rate is feed × teeth × spindle speed.",
      fig: "teeth",
      sym: "z"
    }
  },
  "grinding-force-and-power": {
    ECT: {
      what: "Average chip thickness along the cutting edge, the equivalent chip thickness.",
      tip: "In grinding it is about the work speed times the depth of cut divided by the wheel speed.",
      effect: "The forces rise in proportion.",
      fig: "thickness",
      sym: "ECT"
    },
    CEL: {
      what: "Length of the wheel edge in contact with the work, the width of cut.",
      tip: "Use the contact width of the wheel face on the work.",
      effect: "The forces rise in proportion.",
      fig: "length",
      sym: "CEL"
    },
    Kc: {
      what: "Force per unit chip area for this work material and wheel at your ECT.",
      tip: "Take it from grinding force data or a test; it is far higher than in turning.",
      effect: "The tangential force rises in proportion.",
      fig: "pressure",
      sym: "K_c"
    },
    ratio: {
      what: "How many times larger the normal force is than the tangential force.",
      tip: "Take it from grinding data or a test; the handbook gives about 2 to 4.",
      effect: "Sets the normal force on the work.",
      fig: "ratio",
      sym: "FH/FC"
    },
    V: {
      what: "Peripheral speed of the grinding wheel surface.",
      tip: "V = π D n ÷ 1000 with D in mm and n in rpm.",
      effect: "The power rises in proportion.",
      fig: "velocity",
      sym: "V"
    },
    Dw: {
      what: "Outside diameter of the grinding wheel at present.",
      tip: "Use the current diameter; it shrinks as the wheel is dressed.",
      effect: "Sets the torque at the wheel spindle.",
      fig: "diameter",
      sym: "D"
    },
    Pav: {
      what: "Power the wheel spindle can deliver to the cut.",
      tip: "Use the motor rating times the drive efficiency, or 0 to skip the check.",
      effect: "Compared with the power the cut needs.",
      fig: "power",
      sym: "P_av"
    }
  },
  "grinding-economic-wheel-life": {
    TRPL: {
      what: "Time lost each time the wheel is changed or dressed.",
      tip: "Time it from stopping the cycle to grinding again.",
      effect: "TV rises minute for minute with it.",
      fig: "time",
      sym: "T_RPL"
    },
    Cw: {
      what: "Part of the wheel price used up by each dressing.",
      tip: "Divide the wheel price by the number of dressings it gives before it is discarded.",
      effect: "Adds to the cost per dressing CE.",
      fig: "unit-cost",
      sym: "C_w"
    },
    Cd: {
      what: "Cost of the dressing operation itself, such as diamond wear.",
      tip: "Include the dresser cost per dressing; the labour is covered by TRPL.",
      effect: "Adds to the cost per dressing CE.",
      fig: "unit-cost",
      sym: "C_d"
    },
    HR: {
      what: "Cost of an hour of the grinder and its operator.",
      tip: "Use your shop rate for the machine, including overheads.",
      effect: "A higher rate lowers TV and so shortens the economic life.",
      fig: "rate",
      sym: "HR"
    },
    C: {
      what: "Constant of the Taylor line V × T^0.26 for the work material group and ECT.",
      tip: "Take it from the grinding data tables or calibrate it from a shop result.",
      effect: "The wheel speed at the economic life rises in proportion.",
      fig: "velocity",
      sym: "C"
    },
    ECT: {
      what: "Average chip thickness along the cutting edge, the equivalent chip thickness.",
      tip: "Use the ECT the Taylor constant was read at.",
      effect: "The specific removal rate rises in proportion.",
      fig: "thickness",
      sym: "ECT"
    },
    ar: {
      what: "Depth the wheel cuts into the work on each pass.",
      tip: "Use the roughing or finishing infeed per pass.",
      effect: "A smaller depth needs a higher work speed for the same removal rate.",
      fig: "depth",
      sym: "a_r"
    }
  },
  "bolt-torque-thread-friction": {
    d: {
      what: "Nominal outside diameter of the bolt thread.",
      tip: "For inch bolts multiply the size by 25.4, e.g. 1/2 in is 12.7 mm.",
      effect: "Sets the stress area and the friction radii.",
      fig: "diameter",
      sym: "d"
    },
    P: {
      what: "Axial distance between neighbouring threads of the bolt.",
      tip: "For inch threads divide 25.4 by the threads per inch, e.g. 13 TPI is 1.9538 mm.",
      effect: "Sets the lead, the stress area and the pitch diameter.",
      fig: "pitch",
      sym: "P"
    },
    starts: {
      what: "How many separate threads run side by side along the bolt.",
      tip: "Almost all bolts are single start.",
      effect: "The lead and the stretching torque rise in proportion.",
      fig: "count",
      sym: "n"
    },
    alpha: {
      what: "Half the included angle between the thread flanks.",
      tip: "Use 30° for unified and metric 60° threads.",
      effect: "A larger angle raises the thread friction torque.",
      fig: "angle",
      sym: "α"
    },
    pre: {
      what: "Whether the preload is worked out from the bolt strength or entered.",
      tip: "Choose the direct preload when a joint calculation already gives it.",
      effect: "Chooses how PB is found.",
      fig: "choice",
      sym: "pre"
    },
    Sut: {
      what: "Lowest tensile strength the bolt grade is guaranteed to reach.",
      tip: "Take it from the bolt grade standard, e.g. 1034 MPa (150,000 psi) for SAE grade 8.",
      effect: "The preload and torque rise in proportion.",
      fig: "stress",
      sym: "S_ut"
    },
    pct: {
      what: "Share of the minimum tensile strength the preload is to reach.",
      tip: "Use the share your joint design or company standard calls for.",
      effect: "The preload and torque rise in proportion.",
      fig: "percent",
      sym: "%"
    },
    PB: {
      what: "Axial clamping force the bolt is to carry after tightening.",
      tip: "Only used when the preload is entered directly.",
      effect: "The torque rises in proportion.",
      fig: "force",
      sym: "P_B"
    },
    mu1: {
      what: "Coefficient of friction between the bolt and nut thread flanks.",
      tip: "Measure it or take it for your plating and lubricant; dry steel is about 0.15.",
      effect: "Raises the thread friction part of the torque.",
      fig: "friction",
      sym: "μ₁"
    },
    mu2: {
      what: "Coefficient of friction under the face of the turned nut or bolt head.",
      tip: "Measure it or take it for your surfaces; it may differ from the thread value.",
      effect: "Raises the bearing friction part of the torque.",
      fig: "friction",
      sym: "μ₂"
    },
    b: {
      what: "Outer diameter of the pressure face under the turned nut or bolt head.",
      tip: "Enter 0 to use 1.5 d, the handbook value with no loose washer.",
      effect: "A larger face raises the bearing friction torque.",
      fig: "diameter",
      sym: "b"
    }
  },
  "power-thread-basic-sizes": {
    form: {
      what: "Which of the alternative power transmission thread profiles is cut.",
      tip: "The 10° modified square thread is the practical form of a square thread.",
      effect: "Sets the depth, flats and pitch diameter formulas.",
      fig: "choice",
      sym: "form"
    },
    D: {
      what: "Basic outside diameter of the screw thread.",
      tip: "Use the nominal size from the drawing.",
      effect: "The pitch and minor diameters follow from it.",
      fig: "diameter",
      sym: "D"
    },
    p: {
      what: "Axial distance from one thread to the next.",
      tip: "For inch threads divide 25.4 by the threads per inch.",
      effect: "Sets the depth, thickness and flats.",
      fig: "pitch",
      sym: "p"
    },
    starts: {
      what: "How many separate threads run side by side on the screw.",
      tip: "Count the thread ends at the end of the screw.",
      effect: "The lead and lead angle rise in proportion.",
      fig: "count",
      sym: "n"
    },
    C: {
      what: "Gap left between the screw root and the crest of the nut thread.",
      tip: "For the 60° stub thread use at least 0.02 times the pitch.",
      effect: "Deepens the thread and narrows the root flat of the modified square form.",
      fig: "gap",
      sym: "C"
    }
  }
});
