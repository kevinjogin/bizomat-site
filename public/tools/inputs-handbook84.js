// BIZOMAT Tools input guides: handbook84. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook84.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "compound-indexing": {
    mode: {
      what: "Whether to search for the best movements or to check one movement from an indexing table.",
      tip: "Search first; use the check to confirm a movement someone has written on the job card.",
      effect: "Search lists the best movements; check reports only the movement you enter.",
      fig: "choice",
      sym: "mode"
    },
    N: {
      what: "Number of equally spaced divisions wanted around the work, such as gear teeth or flutes.",
      tip: "Count the teeth or features on the drawing, not the spaces between them.",
      effect: "Sets the crank movement per division; prime numbers above 50 rarely index simply.",
      fig: "count",
      sym: "N"
    },
    ratio: {
      what: "Crank turns for one turn of the dividing head spindle (the worm ratio).",
      tip: "Most plain dividing heads are 40:1; some are 60:1 or 5:1. It is stamped on the head or in its manual.",
      effect: "Scales every crank movement.",
      fig: "ratio",
      sym: "k"
    },
    plates: {
      what: "Which standard index plates are available on the dividing head.",
      tip: "Brown & Sharpe heads have plates 1, 2 and 3; Cincinnati heads have one two-sided standard plate.",
      effect: "Sets the hole circles searched; compound movements use two circles of the same plate or side.",
      fig: "choice",
      sym: "plates"
    },
    Rmax: {
      what: "Most revolutions of the work you accept before all divisions are cut.",
      tip: "Keep it low for manual indexing: each revolution adds a full set of movements and chances of a miscount.",
      effect: "More revolutions allow closer approximations.",
      fig: "count",
      sym: "R_max"
    },
    dia: {
      what: "Diameter at which the position error matters, usually the pitch diameter of the gear.",
      tip: "For a gear use the pitch diameter; for holes or slots use the diameter they sit on.",
      effect: "The error of an approximate movement grows in direct proportion to the diameter.",
      fig: "diameter",
      sym: "d"
    },
    tol: {
      what: "Largest position error at that diameter you accept from an approximate movement.",
      tip: "Take a small share of the spacing tolerance on the drawing, since the cutting adds its own errors.",
      effect: "Only moves the accuracy check and the choice of revolutions.",
      fig: "tolerance",
      sym: "e_max"
    },
    w: {
      what: "Whole turns of the crank in each indexing movement of the movement being checked.",
      tip: "In tables a movement such as 7 41/47 means 7 whole turns and 41 holes in the 47 circle.",
      effect: "Adds whole turns to the movement per division.",
      fig: "count",
      sym: "w"
    },
    a: {
      what: "Holes moved on the first circle, the circle the crank pin follows.",
      tip: "Count from the hole the pin is in as hole zero, as the handbook describes.",
      effect: "Sets the first fractional part of the movement.",
      fig: "count",
      sym: "a"
    },
    A: {
      what: "Number of holes in the first circle used by the crank pin.",
      tip: "Read it from the plate; it must be one of the circles on the plate mounted.",
      effect: "Sets the size of each hole step on the first circle.",
      fig: "count",
      sym: "A"
    },
    sign: {
      what: "Whether the second movement is in the same direction as the first or the opposite one.",
      tip: "Tables show a plus sign for positive and a minus sign for negative compounding.",
      effect: "Adds or subtracts the second fractional movement.",
      fig: "choice",
      sym: "±"
    },
    b: {
      what: "Holes moved on the second circle, the one followed by the stationary pin.",
      tip: "For this movement the crank and plate turn together while the stationary pin is out.",
      effect: "Sets the second fractional part of the movement.",
      fig: "count",
      sym: "b"
    },
    B: {
      what: "Number of holes in the second circle used by the stationary pin.",
      tip: "Use a circle on the same plate as the first; enter any circle when there is no second movement.",
      effect: "Sets the size of each hole step on the second circle.",
      fig: "count",
      sym: "B"
    },
    R: {
      what: "Revolutions the work makes before all the divisions of the checked movement are cut.",
      tip: "Tables list it beside each approximate movement; exact movements need one revolution.",
      effect: "The precise number of divisions is the worm ratio times this, divided by the movement.",
      fig: "count",
      sym: "R"
    }
  },
  "unified-thread-gauge-limits": {
    n: {
      what: "Threads per inch of the Unified screw thread being gauged.",
      tip: "Read it from the thread designation, for example 20 in 1/4-20 UNC-2A.",
      effect: "Sets the pitch, the sharp-V height H and the setting plug truncation.",
      fig: "thread",
      sym: "n"
    },
    eMaj: {
      what: "Maximum major diameter of the external thread for its size and class.",
      tip: "Take it from the Unified thread limits table; for class 2A it is the basic major diameter less the allowance.",
      effect: "Sets the plain GO major gauge and the setting plug majors.",
      fig: "diameter",
      sym: "D_max"
    },
    eMajMin: {
      what: "Minimum major diameter of the external thread for its size and class.",
      tip: "Take it from the Unified thread limits table.",
      effect: "Sets the plain NOT GO major gauge.",
      fig: "diameter",
      sym: "D_min"
    },
    ePDmax: {
      what: "Maximum pitch diameter of the external thread for its size and class.",
      tip: "Take it from the Unified thread limits table.",
      effect: "Sets the GO thread ring and the GO setting plug pitch diameters and the GO ring minor diameter.",
      fig: "diameter",
      sym: "E_max"
    },
    ePDmin: {
      what: "Minimum pitch diameter of the external thread for its size and class.",
      tip: "Take it from the Unified thread limits table.",
      effect: "Sets the NOT GO (LO) thread ring and setting plug pitch diameters.",
      fig: "diameter",
      sym: "E_min"
    },
    iMaj: {
      what: "Minimum major diameter of the internal thread, normally the basic major diameter.",
      tip: "Take it from the Unified thread limits table for the internal class.",
      effect: "Sets the GO thread plug major diameter.",
      fig: "diameter",
      sym: "D_nmin"
    },
    iPDmin: {
      what: "Minimum pitch diameter of the internal thread for its size and class.",
      tip: "Take it from the Unified thread limits table; it equals the basic pitch diameter.",
      effect: "Sets the GO thread plug and GO setting ring pitch diameters.",
      fig: "diameter",
      sym: "E_nmin"
    },
    iPDmax: {
      what: "Maximum pitch diameter of the internal thread for its size and class.",
      tip: "Take it from the Unified thread limits table.",
      effect: "Sets the NOT GO (HI) plug pitch and major diameters and the NOT GO setting ring.",
      fig: "diameter",
      sym: "E_nmax"
    },
    iMinMin: {
      what: "Minimum minor diameter of the internal thread for its size and class.",
      tip: "Take it from the Unified thread limits table.",
      effect: "Sets the plain GO minor plug and the GO setting ring minor diameter.",
      fig: "diameter",
      sym: "D1_min"
    },
    iMinMax: {
      what: "Maximum minor diameter of the internal thread for its size and class.",
      tip: "Take it from the Unified thread limits table.",
      effect: "Sets the plain NOT GO minor plug and the NOT GO setting ring minor diameter.",
      fig: "diameter",
      sym: "D1_max"
    },
    xPD: {
      what: "Pitch diameter tolerance of the working GO and NOT GO thread gauges.",
      tip: "Take it from Table 4 for the threads per inch and the diameter; X gauges are usual for working gauges, W gauges for closer work.",
      effect: "Widens each thread gauge zone into the product tolerance.",
      fig: "tolerance",
      sym: "T_PD"
    },
    xMaj: {
      what: "Tolerance on the major and minor diameters of the thread gauges.",
      tip: "Take it from Table 4 for the threads per inch and the diameter.",
      effect: "Widens the minor diameter zones of rings and the major diameter zones of plugs.",
      fig: "tolerance",
      sym: "T_d"
    },
    wPD: {
      what: "W gauge tolerance on pitch diameter, used for the setting plugs and rings.",
      tip: "Take it from the W gauge rows of Table 4.",
      effect: "Widens the setting gauge pitch diameter zones.",
      fig: "tolerance",
      sym: "W_PD"
    },
    wMaj: {
      what: "W gauge tolerance on the major and minor diameters of the setting gauges.",
      tip: "Take it from the W gauge rows of Table 4.",
      effect: "Widens the setting plug major and setting ring minor diameter zones.",
      fig: "tolerance",
      sym: "W_d"
    },
    plain: {
      what: "Tolerance of the plain plug, ring or snap gauges for the major and minor diameters.",
      tip: "Use the gauge-maker’s tolerance class you specify for plain gauges of that size.",
      effect: "Widens the plain gauge zones inside the major and minor diameter tolerances.",
      fig: "tolerance",
      sym: "T_pl"
    }
  },
  "forging-hammer-efficiency": {
    D: {
      what: "Diameter of the pure lead cylinder used for the test blow.",
      tip: "Choose the size the handbook’s Table 5 gives for the falling weight of the hammer, and measure it before the blow.",
      effect: "The work per blow grows with the cube of the diameter.",
      fig: "diameter",
      sym: "D"
    },
    H0: {
      what: "Height of the lead cylinder before the blow, 1.5 times its diameter.",
      tip: "Face both ends square and measure on the axis.",
      effect: "With the height after the blow sets the reduction A.",
      fig: "height",
      sym: "H"
    },
    H1: {
      what: "Height of the lead cylinder after one blow of the hammer.",
      tip: "Measure on the axis once the cylinder has cooled to room temperature.",
      effect: "A larger reduction in height means more work per blow.",
      fig: "height",
      sym: "H₁"
    },
    bpm: {
      what: "Blows per minute with the hammer running continuously.",
      tip: "Count blows over a full minute; steam hammers must be tested running, not on a single blow.",
      effect: "Useful power grows in direct proportion.",
      fig: "rate",
      sym: "n_b"
    },
    Pin: {
      what: "Power supplied to the hammer while it runs at that blow rate.",
      tip: "Measure the motor input power or the steam or air power over the same period.",
      effect: "Only moves the efficiency.",
      fig: "power",
      sym: "P_in"
    }
  },
  "press-gauge-pressure-for-work": {
    D: {
      what: "Diameter of the press ram or piston on which the oil pressure acts.",
      tip: "Take it from the press rating plate or cylinder drawing, not the rod diameter.",
      effect: "Press force grows with the square of the ram diameter.",
      fig: "diameter",
      sym: "D"
    },
    P: {
      what: "Gauge pressure set on the press or read on its gauge during pressing.",
      tip: "Read the gauge while the press holds the load, not during the fast approach.",
      effect: "Press force and pressure on the work grow in direct proportion.",
      fig: "pressure",
      sym: "P"
    },
    Pmax: {
      what: "Most gauge pressure the press, its pump and relief valve may run at.",
      tip: "Take it from the press rating plate; the relief valve should be set no higher.",
      effect: "Sets the press capacity and the reach check.",
      fig: "pressure",
      sym: "P_max"
    },
    A: {
      what: "Area of the material actually under pressure, seen in the pressing direction.",
      tip: "Use the area in contact with the punch or die face, not the blank outline if only part is pressed.",
      effect: "The pressure on the work falls as the area grows.",
      fig: "area",
      sym: "A"
    },
    Pa: {
      what: "Pressure the process needs on the material, such as a coining or compacting pressure.",
      tip: "Take it from your process data or trials for the material and operation.",
      effect: "Sets the gauge pressure needed.",
      fig: "pressure",
      sym: "P_a"
    }
  },
  "pm-dc-motor-constants": {
    V: {
      what: "Rated voltage of the permanent-magnet DC motor, from its data sheet.",
      tip: "Use the voltage the amplifier actually supplies at full output.",
      effect: "Sets the stall current and the voltage constant.",
      fig: "electric",
      sym: "V"
    },
    R: {
      what: "Resistance of the armature winding, measured terminal to terminal.",
      tip: "Use the hot resistance; copper resistance rises about 0.4 % per kelvin.",
      effect: "Sets the stall current and the motor constant.",
      fig: "electric",
      sym: "R"
    },
    Tst: {
      what: "Stall torque of the motor with no current limiting.",
      tip: "Take it from the data sheet; it is the top of the straight torque–speed line.",
      effect: "Sets the torque constant, the damping and the characteristic.",
      fig: "torque",
      sym: "T_STo"
    },
    NL: {
      what: "Speed of the motor at no load and rated voltage.",
      tip: "Take it from the data sheet; it is the end of the straight torque–speed line.",
      effect: "Sets the voltage constant and the damping.",
      fig: "rotation",
      sym: "ω_NL"
    },
    JM: {
      what: "Rotor inertia of the motor itself, from its data sheet.",
      tip: "Convert from g·cm² by dividing by 10⁷, or from oz·in·s² with the maker’s factor.",
      effect: "Sets the mechanical time constant.",
      fig: "inertia",
      sym: "J_M"
    },
    IL: {
      what: "Current limit set in the servo amplifier for peak torque.",
      tip: "Read it from the amplifier settings; it is usually above the rated current.",
      effect: "Sets the torque available to accelerate the load.",
      fig: "electric",
      sym: "I_L"
    },
    IR: {
      what: "Rated current the motor may carry continuously without overheating.",
      tip: "Take it from the motor data sheet.",
      effect: "Sets the rated torque and the speed at it.",
      fig: "electric",
      sym: "I_R"
    },
    JL: {
      what: "Inertia of the driven load referred to the motor shaft.",
      tip: "Divide the load inertia by the square of the gear ratio between motor and load.",
      effect: "Lengthens the time constant and lowers the torsional resonance.",
      fig: "inertia",
      sym: "J_L"
    },
    K: {
      what: "Torsional stiffness of the shafts and coupling between the motor and the load.",
      tip: "Add the compliances of each shaft and coupling in series; take couplings from the maker’s data.",
      effect: "A stiffer drive raises the torsional resonance.",
      fig: "stiffness",
      sym: "K"
    },
    bw: {
      what: "Bandwidth of the closed control loop driving the motor.",
      tip: "Take it from the tuned loop’s response; the velocity loop is usually the relevant one.",
      effect: "Only moves the resonance check.",
      fig: "frequency",
      sym: "f_bw"
    }
  },
  "silent-chain-sprocket-tooth-form": {
    size: {
      what: "Which ANSI tooth form the chain uses, chosen by its pitch range.",
      tip: "Chains of 3/8 in pitch and larger use the 60° form; 3/16 in pitch chain uses the 70° form.",
      effect: "Sets the tooth face angle and whether the topping, base and hob diameters apply.",
      fig: "choice",
      sym: "form"
    },
    P: {
      what: "Pitch of the silent chain, from one joint pin to the next.",
      tip: "3/8 in = 9.525 mm, 1/2 in = 12.7 mm, 5/8 in = 15.875 mm, 3/4 in = 19.05 mm, 1 in = 25.4 mm.",
      effect: "Every diameter scales with the pitch.",
      fig: "pitch",
      sym: "P"
    },
    Nt: {
      what: "Number of teeth on the sprocket being designed or checked.",
      tip: "The handbook advises 21 or more and never fewer than 17.",
      effect: "More teeth give larger diameters and a wider angle between the tooth faces.",
      fig: "teeth",
      sym: "N"
    },
    cut: {
      what: "Whether the teeth are cut with a hob or with a straddle cutter.",
      tip: "Use the method of the shop or supplier that will cut the teeth.",
      effect: "Hobbed teeth allow a slightly smaller hub than straddle-cut teeth.",
      fig: "choice",
      sym: "cut"
    },
    hub: {
      what: "Outside diameter of the hub you plan for the sprocket.",
      tip: "Measure from the hub drawing, including any shoulder that runs next to the chain.",
      effect: "Only moves the hub clearance check.",
      fig: "diameter",
      sym: "D_hub"
    }
  },
  "helical-gear-helix-for-centre-distance": {
    mn: {
      what: "Normal module of the cutter or hob used for both gears of the pair.",
      tip: "For inch cutters the normal module is 25.4 divided by the normal diametral pitch.",
      effect: "Larger modules need a larger centre distance for the same helix angle.",
      fig: "pitch",
      sym: "m_n"
    },
    z1: {
      what: "Number of teeth on the pinion, the smaller gear of the pair.",
      tip: "Choose it with the gear teeth for the ratio wanted.",
      effect: "More teeth reduce the helix angle at a fixed centre distance.",
      fig: "teeth",
      sym: "z₁"
    },
    z2: {
      what: "Number of teeth on the gear, the larger gear of the pair.",
      tip: "Choose it with the pinion teeth for the ratio wanted.",
      effect: "More teeth reduce the helix angle at a fixed centre distance.",
      fig: "teeth",
      sym: "z₂"
    },
    C: {
      what: "Centre distance the pair must fit, between the two shaft axes.",
      tip: "Measure the housing bores or take it from the casing drawing.",
      effect: "A larger centre distance needs a larger helix angle.",
      fig: "length",
      sym: "C"
    },
    psiMin: {
      what: "Smallest helix angle your design accepts for the pair.",
      tip: "Set it from the overlap you need for smooth running.",
      effect: "Only moves the range check.",
      fig: "angle",
      sym: "ψ_min"
    },
    psiMax: {
      what: "Largest helix angle your design accepts for the pair.",
      tip: "Set it from the end thrust the bearings take or the swivel of the milling table.",
      effect: "Only moves the range check.",
      fig: "angle",
      sym: "ψ_max"
    }
  }
});
