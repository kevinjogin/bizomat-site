// BIZOMAT Tools input guides: handbook83. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook83.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "worm-cutter-profile-correction": {
    d: {
      what: "Pitch diameter of the worm, where the thread thickness equals the space.",
      tip: "Take it from the worm drawing; the formulas use half of it, the pitch radius.",
      effect: "A larger worm changes the profile curvature and the pressure angle change of every tool.",
      fig: "diameter",
      sym: "d"
    },
    lam: {
      what: "Lead angle of the worm thread, measured from a plane square to the worm axis.",
      tip: "Use the lead angle at the pitch diameter, not the helix angle measured from the axis.",
      effect: "Steeper leads give much larger profile changes: the pressure angle change grows with the cube of sin λ.",
      fig: "angle",
      sym: "λ"
    },
    phin: {
      what: "Normal pressure angle of the milling cutter or grinding wheel.",
      tip: "Normally the specified worm pressure angle, such as 20°.",
      effect: "Sets the involute profile radius and the slant height of the addendum.",
      fig: "angle",
      sym: "φₙ"
    },
    n: {
      what: "Number of threads or starts on the worm.",
      tip: "Count the thread starts at the end of the worm.",
      effect: "The pressure angle change in the formula falls as the number of threads rises.",
      fig: "count",
      sym: "n"
    },
    a: {
      what: "Addendum of the worm thread, from the pitch line to the tip.",
      tip: "Take it from the worm proportions; for the fine-pitch standard it is 0.3183 × normal pitch.",
      effect: "The profile departure grows with the square of the addendum’s slant height.",
      fig: "depth",
      sym: "a"
    },
    Dc: {
      what: "Diameter of the first, smaller tool, usually a disc milling cutter.",
      tip: "Use the cutter’s actual diameter; it shrinks a little with resharpening.",
      effect: "A small cutter curves the profile and changes the pressure angle the most.",
      fig: "diameter",
      sym: "D_c"
    },
    Dw: {
      what: "Diameter of the second, larger tool, usually a grinding wheel.",
      tip: "Use the wheel diameter you will work at; it falls as the wheel wears.",
      effect: "A large wheel comes closest to the involute profile.",
      fig: "diameter",
      sym: "D_w"
    },
    tolY: {
      what: "Profile tolerance you allow between the two worms, as a departure from a straight side.",
      tip: "Take it from the worm drawing or the wormgear maker.",
      effect: "Only moves the profile check.",
      fig: "tolerance",
      sym: "Δy_t"
    },
    tolS: {
      what: "Tolerance you allow along the slant height of the thread from the pressure angle change.",
      tip: "Take it from the pressure angle tolerance on the worm drawing.",
      effect: "Only moves the pressure angle check.",
      fig: "tolerance",
      sym: "Δs_t"
    }
  },
  "industrial-worm-gearing-design": {
    P: {
      what: "Axial pitch of the worm, equal to the circular pitch of the wormgear.",
      tip: "Measure from one thread to the next along the worm axis, not along the thread.",
      effect: "Scales every tooth proportion and the wormgear diameter.",
      fig: "pitch",
      sym: "P"
    },
    t: {
      what: "Number of threads or starts on the worm.",
      tip: "Count the thread starts at the worm end.",
      effect: "More threads raise the lead angle and efficiency for the same worm diameter.",
      fig: "count",
      sym: "t"
    },
    T: {
      what: "Number of teeth on the wormgear.",
      tip: "Choose it with the threads to give the ratio; avoid a common factor for hunting-tooth action.",
      effect: "Sets the ratio and the wormgear diameter.",
      fig: "teeth",
      sym: "T"
    },
    phi: {
      what: "Pressure angle you intend to use, half the included thread angle.",
      tip: "The handbook relates it to the lead angle: 14½° for small leads up to 30° for leads over 35°.",
      effect: "Only moves the pressure angle check.",
      fig: "angle",
      sym: "φ"
    },
    mode: {
      what: "Whether the centre distance is fixed or the worm diameter is chosen.",
      tip: "Fix the centre distance when the housing is given; choose the worm when strength sets it.",
      effect: "Decides which of the two size inputs the tool uses.",
      fig: "choice",
      sym: "mode"
    },
    C: {
      what: "Centre distance between the worm and wormgear axes.",
      tip: "Take it from the housing bores.",
      effect: "With a fixed centre distance the worm gets 2C − D, so it sets the lead angle.",
      fig: "length",
      sym: "C"
    },
    dw: {
      what: "Worm pitch diameter you have chosen.",
      tip: "Size it for bending and torsion; the handbook gives empirical ranges by centre distance.",
      effect: "A smaller worm raises the lead angle and efficiency but lowers stiffness.",
      fig: "diameter",
      sym: "d"
    },
    depth: {
      what: "Whether the tooth depths are worked from the axial or the normal pitch.",
      tip: "For lead angles over 15° to 20° the handbook says the normal pitch is commonly used.",
      effect: "Normal pitch gives shallower teeth at steep leads.",
      fig: "choice",
      sym: "basis"
    },
    mount: {
      what: "Whether the worm is a shell fitted on a shaft or cut integral with the shaft.",
      tip: "Integral worms are usual for case-hardened alloy steel worms.",
      effect: "Changes the face width rule.",
      fig: "choice",
      sym: "type"
    },
    nw: {
      what: "Rotational speed of the worm (input) shaft.",
      tip: "Use the motor or input speed after any first reduction.",
      effect: "Sets the rubbing speed, which drives heat and lubrication needs.",
      fig: "rotation",
      sym: "n"
    },
    f: {
      what: "Coefficient of friction between the worm thread and the wormgear teeth.",
      tip: "Take it from test data or the gear maker for your materials, finish, lubricant and rubbing speed.",
      effect: "Higher friction lowers efficiency and makes self-locking more likely.",
      fig: "friction",
      sym: "f"
    }
  },
  "worm-hob-design": {
    D: {
      what: "Pitch diameter of the worm the hob must reproduce.",
      tip: "Take it from the worm drawing.",
      effect: "The hob pitch diameter is this plus the sharpening allowance.",
      fig: "diameter",
      sym: "D"
    },
    P: {
      what: "Axial pitch of the worm, the linear pitch of the hob.",
      tip: "Measure along the axis from thread to thread.",
      effect: "Sets the lead, the normal pitch and the flute rule.",
      fig: "pitch",
      sym: "P"
    },
    t: {
      what: "Number of threads on the worm, which the hob must also have.",
      tip: "Count the worm thread starts.",
      effect: "Sets the lead and the common-factor checks.",
      fig: "count",
      sym: "t"
    },
    Tg: {
      what: "Number of teeth on the wormgear to be cut.",
      tip: "Take it from the wormgear drawing.",
      effect: "Checked for a common factor with the hob threads.",
      fig: "teeth",
      sym: "T"
    },
    A: {
      what: "Addendum of the worm and wormgear teeth.",
      tip: "Take it from the worm proportions.",
      effect: "Sets the hob outside and root diameters.",
      fig: "depth",
      sym: "A"
    },
    Cl: {
      what: "Clearance between the worm and wormgear teeth.",
      tip: "Take it from the worm proportions; the hob cuts the wormgear root this much deeper.",
      effect: "Adds to the hob outside diameter.",
      fig: "gap",
      sym: "C"
    },
    Fl: {
      what: "Number of flutes or gashes you intend to cut in the hob.",
      tip: "Start from the rule’s suggestion and avoid a common factor with the threads.",
      effect: "Sets the flute pitch, gash width and the common-factor check.",
      fig: "count",
      sym: "F"
    },
    fl: {
      what: "Whether the flutes are parallel to the axis or helical at right angles to the thread.",
      tip: "Straight flutes are easier to relieve; helical flutes cut better.",
      effect: "Helical flutes add the flute lead and angle to the results.",
      fig: "choice",
      sym: "flute"
    },
    Nrel: {
      what: "Teeth per turn along the thread helix that the relieving attachment can be geared for.",
      tip: "Pick a whole or half number near the exact value the tool reports.",
      effect: "Sets the modified flute lead; it must be more than the number of flutes.",
      fig: "count",
      sym: "N"
    }
  },
  "metric-tap-thread-limits": {
    D: {
      what: "Basic major diameter of the metric thread.",
      tip: "The number after M in the thread size, such as 6 for M6 × 1.",
      effect: "Sets the basic pitch and major diameters.",
      fig: "diameter",
      sym: "D"
    },
    P: {
      what: "Pitch of the thread, the distance from one thread to the next.",
      tip: "The number after the × in the thread size; coarse pitches are often left off the size.",
      effect: "Sets the thread height, W and the table row for X, Y and Z.",
      fig: "thread",
      sym: "P"
    },
    lim: {
      what: "Which pitch diameter limits the tap is made to.",
      tip: "Read the marking: D or DU with a number, or no limit number for a standard tap.",
      effect: "Decides how the maximum and minimum pitch diameters are set.",
      fig: "choice",
      sym: "limit"
    },
    num: {
      what: "Limit number marked on the tap after D or DU.",
      tip: "Each step is 0.013 mm over or under the basic pitch diameter.",
      effect: "Moves the tap pitch diameter up (D) or down (DU).",
      fig: "count",
      sym: "no."
    },
    X: {
      what: "Major diameter tolerance for the pitch, from ASME B94.9 Table 4.",
      tip: "Read the X column for your pitch.",
      effect: "Sets the maximum major diameter.",
      fig: "tolerance",
      sym: "X"
    },
    Y: {
      what: "Amount over basic for the maximum pitch diameter, from Table 4.",
      tip: "Read the Y column for your pitch and size range.",
      effect: "Sets the standard maximum pitch diameter and the major diameter.",
      fig: "tolerance",
      sym: "Y"
    },
    Z: {
      what: "Pitch diameter tolerance, from Table 4.",
      tip: "Read the Z column for your pitch and size range.",
      effect: "Sets the band between maximum and minimum pitch diameter.",
      fig: "tolerance",
      sym: "Z"
    },
    PDm: {
      what: "Pitch diameter you measured on the tap.",
      tip: "Measure over wires or with a thread micrometer on the full threads behind the chamfer.",
      effect: "Checked against the pitch diameter limits.",
      fig: "diameter",
      sym: "PD_m"
    },
    Mm: {
      what: "Major diameter you measured on the tap.",
      tip: "Measure across the crests on the full threads.",
      effect: "Checked against the major diameter limits.",
      fig: "diameter",
      sym: "M_m"
    }
  },
  "unified-tap-thread-limits": {
    D: {
      what: "Basic major diameter of the Unified thread in inches.",
      tip: "For example 0.375 for 3/8-16 or 0.190 for No. 10.",
      effect: "Sets the basic pitch and major diameters.",
      fig: "diameter",
      sym: "D"
    },
    n: {
      what: "Number of threads per inch of thread length.",
      tip: "The number after the dash in the size, such as 16 in 3/8-16.",
      effect: "Sets the pitch, thread height, A and B.",
      fig: "thread",
      sym: "n"
    },
    lim: {
      what: "Which pitch diameter limits the tap is made to.",
      tip: "Read the marking: H or L with a number, or no number for standard limits.",
      effect: "Decides how the minimum and maximum pitch diameters are set.",
      fig: "choice",
      sym: "limit"
    },
    num: {
      what: "Limit number marked on the tap after H or L.",
      tip: "Each step is 0.0005 in over or under the basic pitch diameter.",
      effect: "Moves the tap pitch diameter up (H) or down (L).",
      fig: "count",
      sym: "no."
    },
    C: {
      what: "Amount over basic for the minimum pitch diameter, from ASME B94.9 Table 2.",
      tip: "Read the C column for your threads per inch and diameter range.",
      effect: "Sets the standard minimum pitch diameter and the major diameter.",
      fig: "tolerance",
      sym: "C"
    },
    Dt: {
      what: "Pitch diameter tolerance, from Table 2.",
      tip: "Read the D column for your threads per inch and diameter range.",
      effect: "Sets the band between minimum and maximum pitch diameter.",
      fig: "tolerance",
      sym: "D_tol"
    },
    PDm: {
      what: "Pitch diameter you measured on the tap, in inches.",
      tip: "Measure over wires on the full threads behind the chamfer.",
      effect: "Checked against the pitch diameter limits.",
      fig: "diameter",
      sym: "PD_m"
    },
    Mm: {
      what: "Major diameter you measured on the tap, in inches.",
      tip: "Measure across the crests on the full threads.",
      effect: "Checked against the major diameter limits.",
      fig: "diameter",
      sym: "M_m"
    }
  },
  "slot-vs-high-speed-milling-cost": {
    Dc: {
      what: "Diameter of the end mill used for both strategies.",
      tip: "Use the actual cutter diameter.",
      effect: "Sets the spindle speed for a given cutting speed.",
      fig: "diameter",
      sym: "D"
    },
    dist: {
      what: "Length cut in one pass along the feed direction.",
      tip: "Measure the toolpath length of one pass on the feature.",
      effect: "Cutting time and cost grow in direct proportion.",
      fig: "length",
      sym: "Dist"
    },
    HR: {
      what: "Hourly cost of the machine and operator, excluding GST.",
      tip: "Use your machine-hour rate with labour and overheads.",
      effect: "Scales cutting cost and turns edge cost into equivalent time.",
      fig: "money",
      sym: "HR"
    },
    qty: {
      what: "Number of parts made in the batch or order.",
      tip: "Use the order or batch quantity.",
      effect: "Only scales the saving per batch.",
      fig: "count",
      sym: "qty"
    },
    nmax: {
      what: "Highest spindle speed the machine can run.",
      tip: "Take it from the machine specification, not the controller override.",
      effect: "Only moves the spindle speed checks.",
      fig: "rotation",
      sym: "n_max"
    },
    zS: {
      what: "Teeth on the cutter for full slotting.",
      tip: "Fewer teeth leave room for chips in a full slot.",
      effect: "More teeth raise the feed rate in direct proportion.",
      fig: "teeth",
      sym: "z_S"
    },
    fzS: {
      what: "Feed per tooth for full slotting.",
      tip: "Take it from your tooling data at the tool life you enter.",
      effect: "Raises the feed rate and lowers the cost per part.",
      fig: "feed",
      sym: "fz_S"
    },
    VS: {
      what: "Cutting speed for full slotting.",
      tip: "Take it from your tooling data for the same tool life.",
      effect: "Raises spindle speed and feed rate.",
      fig: "velocity",
      sym: "V_S"
    },
    TS: {
      what: "Tool life at the slotting speed and feed.",
      tip: "Use the life your tooling data give at these conditions.",
      effect: "Longer life lowers the tooling share of the cost.",
      fig: "time",
      sym: "T_S"
    },
    pS: {
      what: "Passes per part when slotting.",
      tip: "Count the passes needed to finish the feature by slotting.",
      effect: "Cost grows in direct proportion.",
      fig: "count",
      sym: "p_S"
    },
    trS: {
      what: "Time to replace the set of edges or the cutter for slotting.",
      tip: "Time a tool change including any presetting at the machine.",
      effect: "Adds to the equivalent tooling-cost time.",
      fig: "time",
      sym: "tr_S"
    },
    ceS: {
      what: "Cost of the set of edges or a regrind for slotting, excluding GST.",
      tip: "Use the price per change divided by the uses you get.",
      effect: "Adds 60 × cost ÷ hourly rate minutes to the tooling time.",
      fig: "money",
      sym: "CE_S"
    },
    zH: {
      what: "Teeth on the cutter for high-speed milling.",
      tip: "Light radial cuts allow more teeth.",
      effect: "More teeth raise the feed rate in direct proportion.",
      fig: "teeth",
      sym: "z_H"
    },
    fzH: {
      what: "Feed per tooth at the light radial cut.",
      tip: "Take it from your tooling data; chip thinning allows a much higher feed than slotting.",
      effect: "Raises the feed rate and lowers the cost per part.",
      fig: "feed",
      sym: "fz_H"
    },
    VH: {
      what: "Cutting speed at the light radial cut.",
      tip: "Take it from your tooling data for the same tool life.",
      effect: "Raises spindle speed and feed rate.",
      fig: "velocity",
      sym: "V_H"
    },
    TH: {
      what: "Tool life at the high-speed conditions.",
      tip: "Use the life your tooling data give at these conditions.",
      effect: "Longer life lowers the tooling share of the cost.",
      fig: "time",
      sym: "T_H"
    },
    pH: {
      what: "Passes per part with the light radial cut.",
      tip: "A full-width feature normally needs several passes; count them from the toolpath.",
      effect: "Cost grows in direct proportion.",
      fig: "count",
      sym: "p_H"
    },
    trH: {
      what: "Time to replace the edges or the cutter for high-speed milling.",
      tip: "Time a tool change including any presetting.",
      effect: "Adds to the equivalent tooling-cost time.",
      fig: "time",
      sym: "tr_H"
    },
    ceH: {
      what: "Cost of the edges or a regrind for high-speed milling, excluding GST.",
      tip: "Use the price per change divided by the uses you get.",
      effect: "Adds 60 × cost ÷ hourly rate minutes to the tooling time.",
      fig: "money",
      sym: "CE_H"
    }
  }
});
