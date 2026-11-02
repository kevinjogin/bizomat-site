// KEVOS® Tools input guides: handbook90. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook90.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "journal-bearing-lubrication-analysis": {
    W: {
      what: "Radial load carried by the journal bearing.",
      tip: "Use the steady load; check peak loads separately.",
      effect: "Raises the unit load and the pressure parameter.",
      fig: "force",
      sym: "W"
    },
    d: {
      what: "Diameter of the journal running in the bearing.",
      tip: "Usually set by shaft strength and deflection first.",
      effect: "Sets the unit load, friction torque and both oil flows.",
      fig: "diameter",
      sym: "d"
    },
    l: {
      what: "Bearing length as the handbook defines it for the oil feed.",
      tip: "Whole length with a single oil hole; half the length with a central groove.",
      effect: "A longer bearing lowers the unit load and passes more hydrodynamic flow.",
      fig: "length",
      sym: "l"
    },
    feed: {
      what: "How oil is fed into the bearing: a single hole or a central circumferential groove.",
      tip: "A central groove doubles the bearing constant and raises the pressure flow.",
      effect: "Sets the constants K used for load, friction and pressure flow.",
      fig: "choice",
      sym: "K"
    },
    n: {
      what: "Rotational speed of the shaft in the bearing.",
      tip: "Use the running speed at the load being analysed.",
      effect: "Raises friction power and hydrodynamic flow.",
      fig: "rotation",
      sym: "N"
    },
    cd: {
      what: "Diametral clearance between journal and bearing at operating temperature.",
      tip: "Allow for thermal expansion of journal and bearing when converting to machining sizes.",
      effect: "More clearance passes more oil and cools the bearing but thins the film.",
      fig: "gap",
      sym: "c_d"
    },
    ps: {
      what: "Pressure at which oil is supplied to the bearing feed hole or groove.",
      tip: "Measure at the bearing, after any restrictor.",
      effect: "The pressure flow rises in proportion.",
      fig: "pressure",
      sym: "p_s"
    },
    ta: {
      what: "Assumed rise of oil temperature through the bearing for this pass.",
      tip: "Start with 11 °C (20 °F); then use the new value the tool gives.",
      effect: "Sets the operating temperature at which the viscosity is read.",
      fig: "temperature",
      sym: "t_a"
    },
    Z: {
      what: "Absolute viscosity of the oil in centipoises at the inlet temperature plus the assumed rise.",
      tip: "Read it from the oil’s viscosity–temperature chart for its grade.",
      effect: "Higher viscosity raises friction and lowers the pressure parameter.",
      fig: "viscosity",
      sym: "Z"
    },
    eps: {
      what: "Eccentricity ratio of the journal in the bearing, read from the handbook chart.",
      tip: "Enter the chart at the pressure parameter P and l/d shown in the results.",
      effect: "Higher eccentricity thins the minimum film and raises the pressure flow.",
      fig: "ratio",
      sym: "ε"
    },
    Tp: {
      what: "Torque parameter read from the handbook chart at 1/(1 − ε) and l/d.",
      tip: "Use Fig. 8 for low and Fig. 9 for high eccentricity.",
      effect: "Friction torque and power rise in proportion.",
      fig: "factor",
      sym: "T"
    },
    qf: {
      what: "Flow factor read from the handbook chart at the bearing capacity number Cn.",
      tip: "Cn is shown in the results for this pass.",
      effect: "The hydrodynamic flow rises in proportion.",
      fig: "factor",
      sym: "q"
    },
    X: {
      what: "Heat factor of the oil linking friction power, flow and temperature rise.",
      tip: "About 12 for mineral oils (Table 5), or 0.1837 ÷ (density lb/in³ × specific heat Btu/lb °F).",
      effect: "The flow required and the temperature rise rise in proportion.",
      fig: "factor",
      sym: "X"
    }
  },
  "flat-plate-thrust-bearing-design": {
    W: {
      what: "Axial (thrust) load carried by the bearing.",
      tip: "Include any hydraulic or gear thrust on the shaft.",
      effect: "Raises the outside diameter required and the unit load.",
      fig: "force",
      sym: "W"
    },
    D1: {
      what: "Inside diameter of the thrust face.",
      tip: "Set by the shaft diameter plus running clearance.",
      effect: "A larger bore needs a larger outside diameter.",
      fig: "diameter",
      sym: "D_1"
    },
    pDesign: {
      what: "Unit load the thrust face is designed to carry.",
      tip: "About 517 kPa (75 psi) normal and 1034 kPa (150 psi) maximum for flat plate bearings.",
      effect: "A lower design load needs a larger outside diameter.",
      fig: "pressure",
      sym: "p"
    },
    Kg: {
      what: "Fraction of the pitch circumference occupied by pads rather than grooves.",
      tip: "Usually 0.8, leaving a fifth of the circumference for oil grooves.",
      effect: "A smaller fraction needs a larger outside diameter.",
      fig: "ratio",
      sym: "K_g"
    },
    D2: {
      what: "Outside diameter of the thrust face you choose.",
      tip: "Round up from the diameter required.",
      effect: "Sets the pad width and pitch circumference.",
      fig: "diameter",
      sym: "D_2"
    },
    s: {
      what: "Width of each oil groove between the pads.",
      tip: "The handbook example uses 3/16 in (4.8 mm).",
      effect: "Wider grooves shorten the pads.",
      fig: "length",
      sym: "s"
    },
    i: {
      what: "Number of pads around the thrust face.",
      tip: "Take an even number near the approximate number shown, so pads are about square.",
      effect: "Sets the pad length and the flow per chamfer.",
      fig: "count",
      sym: "i"
    },
    n: {
      what: "Rotational speed of the shaft.",
      tip: "Use the running speed at full load.",
      effect: "Sets the pitch-line velocity for the friction chart.",
      fig: "rotation",
      sym: "N"
    },
    M: {
      what: "Friction horsepower per square inch of pad, read from the handbook chart.",
      tip: "Enter Fig. 3 at the pitch-line velocity and unit load shown.",
      effect: "Friction power and the oil flow required rise in proportion.",
      fig: "power",
      sym: "M"
    },
    rho: {
      what: "Density of the lubricating oil.",
      tip: "About 850 to 900 kg/m³ for mineral oils.",
      effect: "With the specific heat, sets the heat the oil carries per litre.",
      fig: "density",
      sym: "ρ"
    },
    cp: {
      what: "Specific heat of the lubricating oil.",
      tip: "About 1.9 to 2.0 kJ/(kg·K) for mineral oils.",
      effect: "A higher specific heat needs less oil flow.",
      fig: "heat",
      sym: "c_p"
    },
    dT: {
      what: "Temperature rise of the oil through the bearing you allow.",
      tip: "The handbook gives 27.8 °C (50 °F) as an acceptable maximum.",
      effect: "A smaller rise needs more oil.",
      fig: "temperature",
      sym: "Δt"
    },
    Z2: {
      what: "Viscosity of the oil in centipoises at the outlet temperature.",
      tip: "Inlet temperature plus the allowed rise, from the oil’s viscosity chart.",
      effect: "Higher viscosity lowers the film flow and deepens the chamfer.",
      fig: "viscosity",
      sym: "Z_2"
    },
    h: {
      what: "Film thickness used to estimate the film flow of a flat plate bearing.",
      tip: "The handbook says to use 0.002 in (0.0508 mm) because it cannot be calculated.",
      effect: "Film flow rises with its cube.",
      fig: "thickness",
      sym: "h"
    },
    ps: {
      what: "Pressure at which oil is supplied to the bearing.",
      tip: "Measure at the bearing inlet.",
      effect: "Raises the film flow and allows a shallower chamfer.",
      fig: "pressure",
      sym: "p_s"
    },
    share: {
      what: "Share of the required oil flow that must pass through the feed chamfers.",
      tip: "The handbook recommends at least one-half; the example puts all the flow through them.",
      effect: "Raises the flow per chamfer and its depth.",
      fig: "ratio",
      sym: "share"
    },
    lc: {
      what: "Length of each feed chamfer along the pad edge.",
      tip: "The handbook example uses 1/8 in (3.2 mm).",
      effect: "A longer chamfer needs a slightly deeper cut.",
      fig: "length",
      sym: "l"
    },
    kappa: {
      what: "Kinetic energy correction factor for the chamfer flow, read from the handbook chart.",
      tip: "Enter Fig. 4 at Z2 × l and the flow per chamfer shown.",
      effect: "A smaller factor raises the uncorrected flow and the chamfer depth.",
      fig: "factor",
      sym: "κ"
    }
  }
});
