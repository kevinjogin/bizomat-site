// KEVOS® Tools input guides: handbook101. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook101.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "spline-pin-measurement": {
    kind: {
      what: "Whether the spline is internal and measured between pins, or external and over pins.",
      tip: "Internal splines are in the hub; external splines are on the shaft.",
      effect: "Chooses the between-pins or over-pins formula and the standard pin.",
      fig: "choice",
      sym: "kind"
    },
    P: {
      what: "Teeth per inch of pitch diameter, the first number of the spline pitch.",
      tip: "For a 3/6 pitch spline enter 3; the second number sets the tooth depth.",
      effect: "Sets the pitch diameter and the standard pin size.",
      fig: "teeth",
      sym: "P"
    },
    N: {
      what: "Count of teeth or spaces around the spline.",
      tip: "Odd numbers of teeth use the cos(90° ÷ N) correction.",
      effect: "Sets the pitch diameter and the odd-tooth correction.",
      fig: "teeth",
      sym: "N"
    },
    pa: {
      what: "Standard pressure angle of the involute spline teeth.",
      tip: "Read it from the drawing or the spline designation: 30°, 37.5° or 45°.",
      effect: "Sets the base diameter and the standard internal pin.",
      fig: "angle",
      sym: "φD"
    },
    w: {
      what: "Arc width of the space (internal) or tooth (external) at the pitch circle to be measured.",
      tip: "Use the maximum or minimum actual value from the spline standard to get the measurement limits.",
      effect: "A wider space or thicker tooth moves the pins and changes the reading.",
      fig: "thickness",
      sym: "s,t"
    },
    dp: {
      what: "Diameter of the gauge pins used in the measurement.",
      tip: "Enter 0 to use the standard pin, 1.728 ÷ P or 1.920 ÷ P.",
      effect: "Larger pins sit further out on the flanks.",
      fig: "diameter",
      sym: "d_pin"
    }
  },
  "iso-fit-limits-from-deviations": {
    size: {
      what: "Nominal size common to the hole and the shaft of the fit.",
      tip: "Use the size on the drawing, e.g. 45 for 45 H7/p6.",
      effect: "The limits are this size plus the deviations.",
      fig: "diameter",
      sym: "D"
    },
    hk: {
      what: "Which of the two hole deviations the ISO table gives for the hole letter.",
      tip: "Holes A to H have a tabulated EI, J to ZC a tabulated ES; choose H or Js directly.",
      effect: "Decides how the other deviation is found.",
      fig: "choice",
      sym: "hk"
    },
    hdev: {
      what: "Fundamental deviation of the hole read from the ISO limits table, with its sign.",
      tip: "Read it in micrometres for the letter and the size step that contains the basic size.",
      effect: "Places the tolerance zone relative to the basic size.",
      fig: "tolerance",
      sym: "dev"
    },
    hIT: {
      what: "Standard tolerance for the grade and size of the hole, from the IT table.",
      tip: "Read it in micrometres, e.g. IT7 for 30 to 50 mm is 25 µm.",
      effect: "Sets the width of the tolerance zone.",
      fig: "tolerance",
      sym: "IT"
    },
    hdelta: {
      what: "Delta value from the table for K, M and N holes to IT8 and P to ZC holes to IT7.",
      tip: "Read it from the end of the hole deviation table; enter 0 for other holes.",
      effect: "Added to the tabulated upper deviation ES of the hole.",
      fig: "tolerance",
      sym: "Δ"
    },
    sk: {
      what: "Which of the two shaft deviations the ISO table gives for the shaft letter.",
      tip: "Shafts a to h have a tabulated es, j to zc a tabulated ei; choose h or js directly.",
      effect: "Decides how the other deviation is found.",
      fig: "choice",
      sym: "sk"
    },
    sdev: {
      what: "Fundamental deviation of the shaft read from the ISO limits table, with its sign.",
      tip: "Read it in micrometres for the letter and the size step that contains the basic size.",
      effect: "Places the tolerance zone relative to the basic size.",
      fig: "tolerance",
      sym: "dev"
    },
    sIT: {
      what: "Standard tolerance for the grade and size of the shaft, from the IT table.",
      tip: "Read it in micrometres, e.g. IT7 for 30 to 50 mm is 25 µm.",
      effect: "Sets the width of the tolerance zone.",
      fig: "tolerance",
      sym: "IT"
    }
  },
  "cylinder-portion-volume": {
    mode: {
      what: "Whether the cutting plane passes through a chord of the base or across the whole cylinder.",
      tip: "A hoof or ungula starts at a chord of the base; a mitred pipe is cut across.",
      effect: "Chooses the ungula or the cut-across formulas.",
      fig: "choice",
      sym: "cut"
    },
    d: {
      what: "Outside diameter of the cylinder or round bar that is cut.",
      tip: "Measure across the round section square to the axis.",
      effect: "Volume rises with its square.",
      fig: "diameter",
      sym: "d"
    },
    h: {
      what: "Height the cut reaches at the side of the base furthest from the chord.",
      tip: "Measure along the cylinder side from the base to the cutting plane.",
      effect: "The ungula volume and surface rise in proportion.",
      fig: "height",
      sym: "h"
    },
    b: {
      what: "Square distance from the cylinder axis to the chord where the plane meets the base.",
      tip: "Enter 0 when the chord passes through the centre of the base.",
      effect: "Moving the chord changes the base area and the volume.",
      fig: "length",
      sym: "b"
    },
    side: {
      what: "Whether the base of the ungula covers more or less than half the circle.",
      tip: "The base is larger than half when the chord is on the far side of the axis from the high point.",
      effect: "Chooses the plus or minus signs of the formulas.",
      fig: "choice",
      sym: "±"
    },
    h1: {
      what: "Height of the longest side of the cylinder cut off at an angle.",
      tip: "Measure along the side where the cut is furthest from the base.",
      effect: "The volume follows the mean of h1 and h2.",
      fig: "height",
      sym: "h₁"
    },
    h2: {
      what: "Height of the shortest side of the cylinder cut off at an angle.",
      tip: "Measure along the side where the cut is nearest the base.",
      effect: "The volume follows the mean of h1 and h2.",
      fig: "height",
      sym: "h₂"
    }
  },
  "after-tax-npv-comparison": {
    i: {
      what: "Lowest rate of return after tax that the business accepts on an investment.",
      tip: "Use your company hurdle rate after tax.",
      effect: "A higher rate lowers both present values.",
      fig: "percent",
      sym: "i"
    },
    n: {
      what: "Number of years both alternatives are kept and depreciated.",
      tip: "Both must have the same life for this comparison.",
      effect: "Sets the present worth factors and the yearly depreciation.",
      fig: "time",
      sym: "n"
    },
    TR: {
      what: "Share of the net income paid as income tax.",
      tip: "Use your marginal company tax rate, e.g. 25 or 30 per cent.",
      effect: "Reduces the cash flow and sets the depreciation tax saving.",
      fig: "percent",
      sym: "TR"
    },
    PA: {
      what: "Purchase and installation cost of alternative A.",
      tip: "Include delivery, installation and commissioning.",
      effect: "Lowers the NPV of A and raises its depreciation recovery.",
      fig: "money",
      sym: "$"
    },
    LA: {
      what: "Value alternative A can be sold for at the end of its life.",
      tip: "Enter 0 if it will have no resale or scrap value.",
      effect: "Adds its present value and lowers the depreciation.",
      fig: "money",
      sym: "$"
    },
    ARA: {
      what: "Yearly revenue or saving that alternative A brings.",
      tip: "Multiply the yearly output by the selling price, or enter the saving.",
      effect: "Raises the NPV of A after tax.",
      fig: "money",
      sym: "$"
    },
    AEA: {
      what: "Yearly operating and maintenance cost of alternative A in the first year.",
      tip: "Include labour, power, maintenance and consumables.",
      effect: "Lowers the NPV of A after tax.",
      fig: "money",
      sym: "$"
    },
    GA: {
      what: "Amount the yearly expense of alternative A rises each year.",
      tip: "Enter 0 if the expense stays level.",
      effect: "Adds a growing cost through the gradient factor.",
      fig: "money",
      sym: "$"
    },
    PB: {
      what: "Purchase and installation cost of alternative B.",
      tip: "Include delivery, installation and commissioning.",
      effect: "Lowers the NPV of B and raises its depreciation recovery.",
      fig: "money",
      sym: "$"
    },
    LB: {
      what: "Value alternative B can be sold for at the end of its life.",
      tip: "Enter 0 if it will have no resale or scrap value.",
      effect: "Adds its present value and lowers the depreciation.",
      fig: "money",
      sym: "$"
    },
    ARB: {
      what: "Yearly revenue or saving that alternative B brings.",
      tip: "Multiply the yearly output by the selling price, or enter the saving.",
      effect: "Raises the NPV of B after tax.",
      fig: "money",
      sym: "$"
    },
    AEB: {
      what: "Yearly operating and maintenance cost of alternative B in the first year.",
      tip: "Include labour, power, maintenance and consumables.",
      effect: "Lowers the NPV of B after tax.",
      fig: "money",
      sym: "$"
    },
    GB: {
      what: "Amount the yearly expense of alternative B rises each year.",
      tip: "Enter 0 if the expense stays level.",
      effect: "Adds a growing cost through the gradient factor.",
      fig: "money",
      sym: "$"
    }
  }
});
