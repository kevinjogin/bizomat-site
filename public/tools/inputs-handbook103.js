// KEVOS® Tools input guides: handbook103. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook103.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "planetary-arrangement-ratio": {
    fig: {
      what: "The figure in the handbook planetary gearing table that matches your gear train.",
      tip: "Match which member drives, which follows and which gear is held still before choosing.",
      effect: "Chooses the formula used for the ratio.",
      fig: "choice",
      sym: "Fig."
    },
    A: {
      what: "Size of the driving gear, as a tooth count or a pitch diameter.",
      tip: "Use the same kind of size, teeth or pitch diameter, for every gear.",
      effect: "Changes the ratio through the formula of the chosen figure.",
      fig: "teeth",
      sym: "z"
    },
    B: {
      what: "Size of the driven gear that is the follower of the train.",
      tip: "Use the same kind of size, teeth or pitch diameter, for every gear.",
      effect: "Changes the ratio through the formula of the chosen figure.",
      fig: "teeth",
      sym: "z"
    },
    C: {
      what: "Size of the gear that is held still in the arrangement.",
      tip: "Use the same kind of size, teeth or pitch diameter, for every gear.",
      effect: "Changes the ratio through the formula of the chosen figure.",
      fig: "teeth",
      sym: "z"
    },
    x: {
      what: "Size of the planet gear marked x in the handbook figure.",
      tip: "Only used in the compound planet figures.",
      effect: "Changes the ratio through the formula of the chosen figure.",
      fig: "teeth",
      sym: "z"
    },
    y: {
      what: "Size of the planet gear marked y in the handbook figure.",
      tip: "Only used in the compound planet figures.",
      effect: "Changes the ratio through the formula of the chosen figure.",
      fig: "teeth",
      sym: "z"
    },
    z: {
      what: "Size of the secondary driving gear when the follower has two drivers.",
      tip: "Only used in Figs. 19 to 22.",
      effect: "Changes the ratio through the formula of the chosen figure.",
      fig: "teeth",
      sym: "z"
    },
    S: {
      what: "Turns of the secondary driver for each turn of the initial driver.",
      tip: "Enter it as negative when the two drivers turn in opposite directions.",
      effect: "Changes the ratio of the differential arrangements.",
      fig: "ratio",
      sym: "S"
    },
    E: {
      what: "Angle between the inclined planet axis and the main axis in Fig. 4.",
      tip: "Only used in Fig. 4; 90° makes cos E zero.",
      effect: "Adds cos E to the ratio of Fig. 4.",
      fig: "angle",
      sym: "E"
    },
    n: {
      what: "Rotational speed of the member that drives the train.",
      tip: "Use the motor or input shaft speed.",
      effect: "The follower speed is this times F.",
      fig: "rotation",
      sym: "n"
    }
  },
  "microdroplet-adhesion-check": {
    Dd: {
      what: "Diameter of one lubricant droplet in the mist from the nozzle.",
      tip: "Take it from the mist generator data or a droplet measurement.",
      effect: "The droplet mass and centrifugal force rise with its cube.",
      fig: "diameter",
      sym: "d"
    },
    rho: {
      what: "Mass per unit volume of the lubricant used for the mist.",
      tip: "Read it from the lubricant data sheet.",
      effect: "The droplet mass rises in proportion.",
      fig: "density",
      sym: "ρ"
    },
    P: {
      what: "Size of the drop as it spreads on the tool surface, seen from above.",
      tip: "Measure it on a toolmaker’s microscope as the handbook describes.",
      effect: "The adhesion force rises in proportion.",
      fig: "length",
      sym: "P"
    },
    theta: {
      what: "Angle between the drop surface and the tool surface where they meet.",
      tip: "Measure it for your lubricant on your tool material or coating.",
      effect: "A smaller angle wets better and holds the drop more strongly.",
      fig: "angle",
      sym: "θ"
    },
    sig: {
      what: "Surface tension between the lubricant and the surrounding air.",
      tip: "Read it from the lubricant data sheet, in N/m.",
      effect: "The adhesion force rises in proportion.",
      fig: "factor",
      sym: "σ_L"
    },
    Dt: {
      what: "Diameter of the micro mill or drill that the mist must wet.",
      tip: "Use the flute diameter of the tool.",
      effect: "Sets the surface speed for a spindle speed.",
      fig: "diameter",
      sym: "D_t"
    },
    n: {
      what: "Rotational speed of the spindle carrying the tool.",
      tip: "Use the programmed spindle speed.",
      effect: "The centrifugal force rises with its square.",
      fig: "rotation",
      sym: "n"
    }
  },
  "force-ratio-tool-life": {
    mode: {
      what: "Whether the force ratio comes from two measured forces or is entered.",
      tip: "Use measured forces from a dynamometer when you have them.",
      effect: "Chooses how FH ÷ FC is found.",
      fig: "choice",
      sym: "mode"
    },
    FH: {
      what: "Resultant of the axial and radial forces in the feed plane.",
      tip: "Combine the feed and radial dynamometer readings into one resultant.",
      effect: "A larger feed-plane force raises the ratio and the life.",
      fig: "force",
      sym: "F_H"
    },
    FC: {
      what: "Tangential force in the direction of the cutting speed.",
      tip: "Read it from the dynamometer or estimate it as Kc × chip area.",
      effect: "A larger cutting force lowers the ratio.",
      fig: "force",
      sym: "F_C"
    },
    r: {
      what: "Ratio of the feed-plane force to the tangential cutting force.",
      tip: "The handbook gives about 0.3 to 0.4 in roughing and 0.5 to 0.6 in finishing turning.",
      effect: "The tool life rises steeply with it.",
      fig: "ratio",
      sym: "FH/FC"
    },
    a: {
      what: "Constant of the force ratio relation that depends on the rake angle.",
      tip: "The handbook gives about 0.25 to 0.5 in turning; take it from your tests.",
      effect: "A larger a shortens the life for the same ratio.",
      fig: "factor",
      sym: "a"
    },
    k: {
      what: "Ratio of the force-ratio constant LF to the tool-life constant L.",
      tip: "The handbook gives 10 to 20; take it from your tests.",
      effect: "Sets how steeply life rises with the force ratio.",
      fig: "factor",
      sym: "LF/L"
    },
    Tt: {
      what: "Tool life you want between tool changes.",
      tip: "Enter 0 to skip the check and the matching force ratio.",
      effect: "Gives the force ratio at which to change the tool.",
      fig: "time",
      sym: "T"
    }
  }
});
