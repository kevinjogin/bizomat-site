// BIZOMAT Tools input guides: handbook86. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook86.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "sphere-sections": {
    sec: {
      what: "Spherical section to calculate, lettered as in the handbook figure of spherical areas and volumes.",
      tip: "A dished head or dome is a segment S; a band cut by two parallel planes is a zone T; a ring is W.",
      effect: "Chooses the formulas and which dimensions are used.",
      fig: "choice",
      sym: "sec"
    },
    R: {
      what: "Radius of the whole sphere, used for the whole sphere and the sector K.",
      tip: "Half the measured diameter; for a sector, the radius of the spherical surface.",
      effect: "Area grows with the square and volume with the cube of the radius.",
      fig: "radius",
      sym: "R"
    },
    Nv: {
      what: "Volume of a whole sphere when you want the radius it needs.",
      tip: "1 L is 1,000,000 mm³; a 1 L sphere is about 124 mm in diameter.",
      effect: "Sets the radius, area and mass for that section only.",
      fig: "volume",
      sym: "N_v"
    },
    R1: {
      what: "Outer sphere radius for the wall G and hollow sector U; for a ring, the radius from the ring axis to the centre of its section.",
      tip: "For a ring, measure the mean diameter of the ring and halve it.",
      effect: "Raises the area and volume of the wall, sector or ring.",
      fig: "radius",
      sym: "R_1"
    },
    R2: {
      what: "Inner sphere radius for the wall G and hollow sector U; for a ring, the radius of the circular ring section.",
      tip: "Must be less than R₁; for a ring it is half the thickness of the ring section.",
      effect: "A larger inner radius leaves less material in the wall or sector; a larger section radius enlarges a ring.",
      fig: "radius",
      sym: "R_2"
    },
    phi: {
      what: "Included angle of the sector at the centre of the sphere, or the angle of a part ring about its axis.",
      tip: "A hemisphere is a sector of 180°; a quarter ring is 90°.",
      effect: "Sets the depth and size of a sector or the share of a ring.",
      fig: "angle",
      sym: "φ"
    },
    E: {
      what: "Diameter of the flat base of the spherical segment (cap).",
      tip: "Measure across the open edge of a dished head or dome.",
      effect: "Wider bases give larger segments and flatter spheres.",
      fig: "diameter",
      sym: "E"
    },
    F: {
      what: "Height of the spherical segment from its flat base to the top of the dome.",
      tip: "Measure square to the base at the centre.",
      effect: "A higher segment holds more and comes from a smaller sphere.",
      fig: "height",
      sym: "F"
    },
    H: {
      what: "Distance between the two parallel planes that bound the spherical zone.",
      tip: "Measure square to both cut faces.",
      effect: "Area of the zone is proportional to this height.",
      fig: "height",
      sym: "H"
    },
    P: {
      what: "Diameter of the circle where one bounding plane cuts the sphere, at one end of the zone.",
      tip: "Measure across one cut face of the band.",
      effect: "With Q and H, fixes the radius of the sphere.",
      fig: "diameter",
      sym: "P"
    },
    Q: {
      what: "Diameter of the circle where the other bounding plane cuts the sphere, at the other end of the zone.",
      tip: "Measure across the other cut face of the band.",
      effect: "With P and H, fixes the radius of the sphere.",
      fig: "diameter",
      sym: "Q"
    },
    rho: {
      what: "Density of the material the spherical section is made of, for its mass.",
      tip: "Steel is about 7850 kg/m³ and aluminium about 2700 kg/m³; use your material data.",
      effect: "Mass is proportional to density; areas and volumes do not change.",
      fig: "density",
      sym: "ρ"
    }
  },
  "conic-section-equation": {
    A: {
      what: "Number multiplying x² in the general equation Ax² + Cy² + Dx + Ey + F = 0.",
      tip: "Enter 0 when the equation has no x² term; keep the sign.",
      effect: "With C, decides whether the curve is a parabola, ellipse or hyperbola.",
      fig: "number",
      sym: "A"
    },
    C: {
      what: "Number multiplying y² in the general equation of the curve.",
      tip: "Enter 0 when the equation has no y² term; keep the sign.",
      effect: "With A, decides the kind of curve and the length of its axes.",
      fig: "number",
      sym: "C"
    },
    D: {
      what: "Number multiplying x in the general equation, with its sign.",
      tip: "Move every term to one side so the equation equals zero first.",
      effect: "Shifts the curve along x.",
      fig: "number",
      sym: "D"
    },
    E: {
      what: "Number multiplying y in the general equation, with its sign.",
      tip: "Move every term to one side so the equation equals zero first.",
      effect: "Shifts the curve along y.",
      fig: "number",
      sym: "E"
    },
    F: {
      what: "Constant term of the general equation, with its sign.",
      tip: "It is the number left with no x or y once the equation equals zero.",
      effect: "Changes the size of an ellipse or hyperbola and the position of a parabola.",
      fig: "number",
      sym: "F"
    }
  },
  "four-arc-oval": {
    A: {
      what: "Overall length of the oval measured along its major axis.",
      tip: "Use the finished outside or inside size the part needs.",
      effect: "A longer oval has larger side arcs and a smaller end radius for the width.",
      fig: "length",
      sym: "A"
    },
    B: {
      what: "Overall width of the oval measured across its minor axis.",
      tip: "Must be less than the length.",
      effect: "Sets the end radius and the side-arc radius.",
      fig: "length",
      sym: "B"
    },
    rFrom: {
      what: "Whether the end radius comes from the handbook equation or is entered.",
      tip: "Start with the equation; enter a radius to make the ends sharper or fuller.",
      effect: "Changes the end radius and with it every other arc.",
      fig: "choice",
      sym: "r_src"
    },
    rg: {
      what: "End radius of the oval used when you choose to enter it yourself.",
      tip: "Must be less than half the width; smaller gives a thinner oval.",
      effect: "A larger end radius moves the side-arc centres closer to the oval.",
      fig: "radius",
      sym: "r"
    }
  },
  "hole-location-disks": {
    x: {
      what: "Centre distance between hole A and hole B from the drawing.",
      tip: "Use the basic dimension; label the holes so A–B, B–C and A–C go round the triangle.",
      effect: "A longer A–B distance enlarges disks A and B.",
      fig: "length",
      sym: "x"
    },
    y: {
      what: "Centre distance between hole B and hole C from the drawing.",
      tip: "Calculate it from the drawing coordinates when it is not dimensioned.",
      effect: "A longer B–C distance enlarges disks B and C.",
      fig: "length",
      sym: "y"
    },
    z: {
      what: "Centre distance between hole A and hole C from the drawing.",
      tip: "Each distance must be less than the sum of the other two.",
      effect: "A longer A–C distance enlarges disks A and C.",
      fig: "length",
      sym: "z"
    }
  },
  "metal-ball-lot-check": {
    Dw: {
      what: "Nominal diameter used to identify the ball size on the order.",
      tip: "For inch balls enter the nominal size in mm (1/4 in = 6.35 mm).",
      effect: "Sets the ordered size, the specific diameter and the count per kilogram.",
      fig: "diameter",
      sym: "D_w"
    },
    gage: {
      what: "Ball gauge on the order: the signed amount the lot mean diameter should differ from nominal.",
      tip: "Choose from the preferred ball gauges for the grade; 0 is called “OK”.",
      effect: "Moves the ordered size and both acceptance limits.",
      fig: "tolerance",
      sym: "gauge"
    },
    devMinus: {
      what: "How far the lot mean diameter may fall below the ordered size for the grade.",
      tip: "Take it from the standard or your agreement with the ball maker.",
      effect: "Sets the lower acceptance limit.",
      fig: "tolerance",
      sym: "dev_lo"
    },
    devPlus: {
      what: "How far the lot mean diameter may lie above the ordered size for the grade.",
      tip: "Take it from the standard or your agreement with the ball maker.",
      effect: "Sets the upper acceptance limit.",
      fig: "tolerance",
      sym: "dev_hi"
    },
    inc: {
      what: "Container marking increment for the grade, the step the specific diameter is rounded to.",
      tip: "Read it from Table 1 of the ball standard for the grade.",
      effect: "Changes only the rounding of the specific diameter.",
      fig: "tolerance",
      sym: "inc"
    },
    VLmax: {
      what: "Allowed lot diameter variation for the grade, the largest spread of ball mean diameters.",
      tip: "Read it from Table 1 of the ball standard for the grade.",
      effect: "Rejects the lot when the measured spread is larger.",
      fig: "tolerance",
      sym: "VDwL"
    },
    Dmax: {
      what: "Mean diameter of the largest ball measured in the lot.",
      tip: "Average the largest and smallest single diameters of that ball.",
      effect: "Raises the lot mean diameter and the lot variation.",
      fig: "diameter",
      sym: "D_max"
    },
    Dmin: {
      what: "Mean diameter of the smallest ball measured in the lot.",
      tip: "Average the largest and smallest single diameters of that ball.",
      effect: "Lowers the lot mean diameter and widens the lot variation.",
      fig: "diameter",
      sym: "D_min"
    },
    rho: {
      what: "Density of the ball material, for the count per kilogram and the lot mass.",
      tip: "The handbook lists 7833 kg/m³ for chrome alloy steel and 14947 kg/m³ for tungsten carbide.",
      effect: "Denser balls give fewer per kilogram.",
      fig: "density",
      sym: "ρ"
    },
    qty: {
      what: "Number of balls in the lot or package being checked.",
      tip: "Take it from the order or the package label.",
      effect: "Only changes the lot mass.",
      fig: "count",
      sym: "n"
    }
  },
  "engine-flywheel-rim-and-arms": {
    given: {
      what: "Whether the energy comes from the indicated power or from the work per revolution.",
      tip: "Use the work per revolution when you know the mean effective pressure, piston area and stroke.",
      effect: "Chooses which of the two inputs sets the work per revolution.",
      fig: "choice",
      sym: "mode"
    },
    P: {
      what: "Indicated power developed in the engine cylinders.",
      tip: "Indicated power is above the shaft power by the mechanical losses; 1 hp = 0.7457 kW.",
      effect: "The rim mass rises in proportion.",
      fig: "power",
      sym: "P"
    },
    Wrev: {
      what: "Average work the engine does in one revolution, entered directly.",
      tip: "Double-acting engine: mean pressure × piston area × twice the stroke.",
      effect: "The rim mass rises in proportion.",
      fig: "energy",
      sym: "W_rev"
    },
    c: {
      what: "Factor of energy excess: the share of the work per revolution the flywheel must absorb and give back.",
      tip: "Read it from the handbook table for the engine type and point of cut-off, or from engine data.",
      effect: "The rim mass rises in proportion.",
      fig: "factor",
      sym: "c"
    },
    N: {
      what: "Rotational speed of the flywheel in revolutions per minute.",
      tip: "Use the running speed of the engine shaft that carries the flywheel.",
      effect: "The rim mass falls with the square of the speed for given work.",
      fig: "rotation",
      sym: "N"
    },
    pct: {
      what: "Allowed variation in speed during a revolution as a percentage of the mean speed.",
      tip: "The handbook range is 1/50 to 1/100, that is 2 % to 1 %; finer for generators.",
      effect: "Halving the variation doubles the rim mass.",
      fig: "percent",
      sym: "1/n"
    },
    Dm: {
      what: "Mean diameter of the flywheel rim, measured to the centre of the rim section.",
      tip: "Outside diameter less the rim depth.",
      effect: "The rim mass falls with the square of the diameter.",
      fig: "diameter",
      sym: "D"
    },
    rho: {
      what: "Density of the rim material, for the cross-section that gives the rim mass.",
      tip: "Cast iron is about 7200 kg/m³ and steel about 7850 kg/m³; use your material data.",
      effect: "Only changes the rim cross-section.",
      fig: "density",
      sym: "ρ"
    },
    arms: {
      what: "Number of arms (spokes) between the hub and the rim of the flywheel.",
      tip: "The handbook gives arm proportions for six and eight arms.",
      effect: "Sets the arm width factor: 1.3 for six arms, 1.2 for eight.",
      fig: "count",
      sym: "arms"
    },
    ds: {
      what: "Diameter of the shaft where the flywheel hub sits.",
      tip: "Use the shaft size at the hub, not a reduced journal.",
      effect: "Arm width and thickness grow in proportion.",
      fig: "diameter",
      sym: "d_s"
    }
  }
});
