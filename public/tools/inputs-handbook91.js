// BIZOMAT Tools input guides: handbook91. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook91.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "step-thrust-bearing-design": {
    W: {
      what: "Axial (thrust) load carried by the thrust bearing.",
      tip: "Include hydraulic, gear and impeller thrust at the worst running condition.",
      effect: "Raises the unit load and the diameter required.",
      fig: "force",
      sym: "W"
    },
    D1: {
      what: "Inside diameter of the thrust face.",
      tip: "Set by the shaft diameter plus running clearance.",
      effect: "A larger bore needs a larger outside diameter for the same area.",
      fig: "diameter",
      sym: "D_1"
    },
    D2: {
      what: "Outside diameter of the thrust face or pads.",
      tip: "Round the diameter required to a convenient size, or use the largest that fits.",
      effect: "Sets the pad width and pitch circumference.",
      fig: "diameter",
      sym: "D_2"
    },
    Kg: {
      what: "Fraction of the pitch circumference occupied by pads rather than grooves.",
      tip: "Usually 0.8; 0.8 or 0.9 for tapered land bearings.",
      effect: "A smaller fraction needs a larger outside diameter.",
      fig: "ratio",
      sym: "K_g"
    },
    i: {
      what: "Number of pads around the thrust face.",
      tip: "Take the even number nearest the estimate shown.",
      effect: "Sets the pad length and the unit load.",
      fig: "count",
      sym: "i"
    },
    n: {
      what: "Rotational speed of the shaft.",
      tip: "Use the running speed at full thrust load.",
      effect: "Sets the pitch-line velocity, friction and film.",
      fig: "rotation",
      sym: "N"
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
      effect: "A higher specific heat lowers the temperature rise or the flow needed.",
      fig: "heat",
      sym: "c_p"
    },
    pDesign: {
      what: "Unit load used to find the outside diameter required for the thrust face.",
      tip: "About 1379 kPa (200 psi) normal and 3447 kPa (500 psi) maximum for step bearings.",
      effect: "Only changes the diameter required shown.",
      fig: "pressure",
      sym: "p"
    },
    s: {
      what: "Width of each oil groove between pads.",
      tip: "At least 1.6 mm (0.062 in); wider than any chamfer added later.",
      effect: "Wider grooves shorten the pads.",
      fig: "length",
      sym: "s"
    },
    Z: {
      what: "Viscosity of the oil in centipoises at the operating temperature.",
      tip: "Read it from the oil’s viscosity–temperature chart.",
      effect: "Higher viscosity thickens the film and raises friction.",
      fig: "viscosity",
      sym: "Z"
    },
    dTmax: {
      what: "Largest temperature rise of the oil through the bearing you accept.",
      tip: "The handbook gives 27.8 °C (50 °F) as an acceptable maximum.",
      effect: "Fails the design when the rise is higher.",
      fig: "temperature",
      sym: "Δt"
    }
  },
  "tapered-land-thrust-bearing-design": {
    W: {
      what: "Axial (thrust) load carried by the thrust bearing.",
      tip: "Include hydraulic, gear and impeller thrust at the worst running condition.",
      effect: "Raises the unit load and the diameter required.",
      fig: "force",
      sym: "W"
    },
    D1: {
      what: "Inside diameter of the thrust face.",
      tip: "Set by the shaft diameter plus running clearance.",
      effect: "A larger bore needs a larger outside diameter for the same area.",
      fig: "diameter",
      sym: "D_1"
    },
    D2: {
      what: "Outside diameter of the thrust face or pads.",
      tip: "Round the diameter required to a convenient size, or use the largest that fits.",
      effect: "Sets the pad width and pitch circumference.",
      fig: "diameter",
      sym: "D_2"
    },
    Kg: {
      what: "Fraction of the pitch circumference occupied by pads rather than grooves.",
      tip: "Usually 0.8; 0.8 or 0.9 for tapered land bearings.",
      effect: "A smaller fraction needs a larger outside diameter.",
      fig: "ratio",
      sym: "K_g"
    },
    i: {
      what: "Number of pads around the thrust face.",
      tip: "Take the even number nearest the estimate shown.",
      effect: "Sets the pad length and the unit load.",
      fig: "count",
      sym: "i"
    },
    n: {
      what: "Rotational speed of the shaft.",
      tip: "Use the running speed at full thrust load.",
      effect: "Sets the pitch-line velocity, friction and film.",
      fig: "rotation",
      sym: "N"
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
      effect: "A higher specific heat lowers the temperature rise or the flow needed.",
      fig: "heat",
      sym: "c_p"
    },
    pDesign: {
      what: "Unit load used to find the outside diameter of the tapered land bearing.",
      tip: "About 1379 kPa (200 psi) normal and 3447 kPa (500 psi) maximum.",
      effect: "A lower design load needs a larger outside diameter.",
      fig: "pressure",
      sym: "p"
    },
    s: {
      what: "Width of each oil groove between the pads.",
      tip: "The handbook example uses 0.5 in (12.7 mm) on a large bearing.",
      effect: "Wider grooves shorten the pads.",
      fig: "length",
      sym: "s"
    },
    d2: {
      what: "Depth of the taper at the outside diameter of the pad, from the handbook table.",
      tip: "Interpolate in Table 2 for the pad size a × b.",
      effect: "The film flow rises in proportion.",
      fig: "depth",
      sym: "δ_2"
    },
    Z: {
      what: "Viscosity of the oil in centipoises at the outlet temperature.",
      tip: "Inlet temperature plus the allowed rise, from the oil’s viscosity chart.",
      effect: "Higher viscosity lowers the factor K and raises friction.",
      fig: "viscosity",
      sym: "Z"
    },
    dT: {
      what: "Temperature rise of the oil through the bearing you allow.",
      tip: "The handbook gives 27.8 °C (50 °F) as an acceptable maximum.",
      effect: "A smaller rise needs more oil flow.",
      fig: "temperature",
      sym: "Δt"
    },
    h: {
      what: "Minimum film thickness read from the handbook chart at the factor K and the tapers.",
      tip: "K is shown in the results; enter the chart with it and your taper values.",
      effect: "Used for the power-loss coefficient and the film check.",
      fig: "thickness",
      sym: "h"
    },
    J: {
      what: "Power-loss coefficient read from the handbook chart at the film thickness.",
      tip: "Enter Fig. 10 with the film thickness h.",
      effect: "Friction power rises in proportion.",
      fig: "factor",
      sym: "J"
    },
    YG: {
      what: "Oil-flow factor read from the handbook chart at the shape factor and diameter ratio.",
      tip: "YS and D1/D2 are shown in the results.",
      effect: "The film flow rises in proportion.",
      fig: "factor",
      sym: "Y_G"
    },
    hAccept: {
      what: "Least minimum film thickness you accept for this bearing.",
      tip: "About 0.025 mm (0.001 in) for small and 0.051 mm (0.002 in) for large or high-speed bearings.",
      effect: "Flags the design when the film read is thinner.",
      fig: "thickness",
      sym: "h_acc"
    }
  },
  "tilting-pad-thrust-bearing-design": {
    W: {
      what: "Axial (thrust) load carried by the thrust bearing.",
      tip: "Include hydraulic, gear and impeller thrust at the worst running condition.",
      effect: "Raises the unit load and the diameter required.",
      fig: "force",
      sym: "W"
    },
    D1: {
      what: "Inside diameter of the thrust face.",
      tip: "Set by the shaft diameter plus running clearance.",
      effect: "A larger bore needs a larger outside diameter for the same area.",
      fig: "diameter",
      sym: "D_1"
    },
    D2: {
      what: "Outside diameter of the thrust face or pads.",
      tip: "Round the diameter required to a convenient size, or use the largest that fits.",
      effect: "Sets the pad width and pitch circumference.",
      fig: "diameter",
      sym: "D_2"
    },
    Kg: {
      what: "Fraction of the pitch circumference occupied by pads rather than grooves.",
      tip: "Usually 0.8; 0.8 or 0.9 for tapered land bearings.",
      effect: "A smaller fraction needs a larger outside diameter.",
      fig: "ratio",
      sym: "K_g"
    },
    i: {
      what: "Number of pads around the thrust face.",
      tip: "Take the even number nearest the estimate shown.",
      effect: "Sets the pad length and the unit load.",
      fig: "count",
      sym: "i"
    },
    n: {
      what: "Rotational speed of the shaft.",
      tip: "Use the running speed at full thrust load.",
      effect: "Sets the pitch-line velocity, friction and film.",
      fig: "rotation",
      sym: "N"
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
      effect: "A higher specific heat lowers the temperature rise or the flow needed.",
      fig: "heat",
      sym: "c_p"
    },
    pDesign: {
      what: "Unit load used to find the outside diameter required for the tilting pads.",
      tip: "About 1379 kPa (200 psi) normal and 3447 kPa (500 psi) maximum.",
      effect: "Only changes the diameter required shown.",
      fig: "pressure",
      sym: "p"
    },
    b: {
      what: "Length of each pad along the pitch line.",
      tip: "Near the estimate B Kg ÷ i shown; the example rounds 4.61 in up to 4.75 in.",
      effect: "Sets the unit load, operating number and film.",
      fig: "length",
      sym: "b"
    },
    Z2: {
      what: "Viscosity of the oil in centipoises at the outlet temperature.",
      tip: "Inlet temperature plus the assumed rise, from the oil’s viscosity chart.",
      effect: "Raises the operating number and the film.",
      fig: "viscosity",
      sym: "Z_2"
    },
    dTmax: {
      what: "Largest temperature rise of the oil through the bearing you accept.",
      tip: "The handbook gives 27.8 °C (50 °F) as an acceptable maximum.",
      effect: "Fails the design when the rise is higher.",
      fig: "temperature",
      sym: "Δt"
    },
    alpha: {
      what: "Dimensionless film thickness factor read from the handbook chart at the operating number.",
      tip: "Enter it in thousandths, for example 0.30 for 0.30 × 10⁻³.",
      effect: "Sets the film, the oil flow and the temperature rise.",
      fig: "factor",
      sym: "α"
    },
    f: {
      what: "Coefficient of friction of the tilting pads read from the handbook chart.",
      tip: "Enter Fig. 14 with the film thickness factor α.",
      effect: "Friction power and temperature rise rise in proportion.",
      fig: "friction",
      sym: "f"
    },
    hAccept: {
      what: "Least minimum film thickness you accept for this bearing.",
      tip: "About 0.025 mm (0.001 in) for small and 0.051 mm (0.002 in) for large or high-speed bearings.",
      effect: "Flags the design when the film is thinner.",
      fig: "thickness",
      sym: "h_acc"
    }
  }
});
