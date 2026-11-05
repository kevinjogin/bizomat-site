// BIZOMAT Tools input guides: handbook102. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook102.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "ba-thread-limits": {
    n: {
      what: "Size number of the British Association thread, 0 being the largest.",
      tip: "Read it from the screw designation, e.g. 4 BA.",
      effect: "Sets which tolerance rules and allowance apply.",
      fig: "number",
      sym: "BA"
    },
    p: {
      what: "Axial distance between neighbouring threads, from the BA table.",
      tip: "Take it from the BA table, e.g. 0.66 mm for 4 BA; a pitch gauge confirms it.",
      effect: "Sets the thread depth, radii and every tolerance.",
      fig: "pitch",
      sym: "p"
    },
    D: {
      what: "Outside diameter of the BA screw, from the BA table.",
      tip: "Take it from the BA table, e.g. 3.60 mm for 4 BA.",
      effect: "The effective and minor diameters follow from it.",
      fig: "diameter",
      sym: "D"
    },
    cls: {
      what: "BS 93 class of the bolt or screw being made or checked.",
      tip: "Close class is for precision parts under stress; normal class for general use.",
      effect: "Sets the bolt tolerances and whether an allowance is taken.",
      fig: "choice",
      sym: "cls"
    }
  },
  "steel-pipe-mass": {
    D: {
      what: "Outside diameter of the steel pipe, from the pipe size table.",
      tip: "For sizes to 12 in it is larger than the nominal size, e.g. 60.3 mm for 2 in pipe.",
      effect: "The mass rises roughly in proportion.",
      fig: "diameter",
      sym: "D"
    },
    t: {
      what: "Specified wall thickness of the pipe schedule.",
      tip: "Take it from the schedule table, e.g. 3.91 mm for 2 in schedule 40.",
      effect: "A thicker wall raises the mass and reduces the bore.",
      fig: "thickness",
      sym: "t"
    },
    L: {
      what: "Total length of the pipe run or spool to be weighed.",
      tip: "Use the length of the spool or the run, in metres.",
      effect: "The masses rise in proportion.",
      fig: "length",
      sym: "L"
    },
    rho: {
      what: "Density of the fluid or material filling the pipe.",
      tip: "Use the density of your contents at its working temperature, or 0 for an empty pipe.",
      effect: "Adds the mass of the contents.",
      fig: "density",
      sym: "ρ"
    }
  },
  "ductile-regime-critical-depth": {
    E: {
      what: "Stiffness of the brittle work material in tension, Young’s modulus.",
      tip: "Use the value for the crystal orientation being cut where it is known.",
      effect: "The critical depth rises in proportion.",
      fig: "modulus",
      sym: "E"
    },
    Kc: {
      what: "Resistance of the work surface to crack growth, its fracture toughness.",
      tip: "Take it from tests or material data, in MPa√m.",
      effect: "The critical depth rises with its square.",
      fig: "factor",
      sym: "K_c"
    },
    H: {
      what: "Surface microhardness of the work material, Knoop or Vickers.",
      tip: "Use the same hardness scale for every material you compare.",
      effect: "The critical depth falls with its cube.",
      fig: "pressure",
      sym: "H"
    },
    A: {
      what: "Constant of the plastic flow to fracture energy threshold.",
      tip: "The handbook gives 0.1 to 0.6 because of the uncertainty in the measured properties.",
      effect: "The critical depth rises in proportion.",
      fig: "factor",
      sym: "A"
    },
    ap: {
      what: "Depth of cut you intend to take with the diamond or other tool.",
      tip: "Ductile-regime cuts are usually well under a micrometre.",
      effect: "Compared with the critical depth and the edge radius.",
      fig: "depth",
      sym: "a_p"
    },
    re: {
      what: "Radius of the rounded cutting edge of the tool.",
      tip: "Take it from the tool maker or an edge measurement, or 0 to skip the check.",
      effect: "Depths below half of it plough instead of cutting.",
      fig: "radius",
      sym: "r_e"
    }
  }
});
