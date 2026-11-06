// BIZOMAT Tools input guides: handbook95. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook95.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "ball-bearing-load-ratings": {
    type: {
      what: "Whether the ball bearing carries mainly radial load or mainly thrust.",
      tip: "Angular contact bearings count as radial when the contact angle is below 90°.",
      effect: "Changes the rating formulas and the static rating.",
      fig: "choice",
      sym: "type"
    },
    i: {
      what: "Number of rows of balls in the bearing.",
      tip: "For a thrust bearing, count only rows carrying load in the same direction.",
      effect: "More rows raise the rating less than in proportion.",
      fig: "count",
      sym: "i"
    },
    alpha: {
      what: "Nominal contact angle between the load line and the plane square to the axis.",
      tip: "0° for deep groove and cylindrical bearings, 90° for pure thrust bearings.",
      effect: "A larger angle lowers the radial rating and raises the thrust rating.",
      fig: "angle",
      sym: "α"
    },
    Z: {
      what: "Number of balls carried in each row of the bearing.",
      tip: "Count them, or take the number from the bearing drawing.",
      effect: "The rating rises with a power of the number below one.",
      fig: "count",
      sym: "Z"
    },
    D: {
      what: "Diameter of the balls, all the same size in a bearing.",
      tip: "Measure a ball or take it from the bearing drawing; above 25.4 mm a different formula applies.",
      effect: "The dynamic rating rises with D^1.8 and the static rating with D².",
      fig: "diameter",
      sym: "D"
    },
    dm: {
      what: "Pitch diameter of the ball set, from bearing centre to ball centre and back.",
      tip: "About the mean of the bore and the outside diameter of the bearing.",
      effect: "Sets D cos α ÷ dm, the value for reading the factors.",
      fig: "diameter",
      sym: "d_m"
    },
    fc: {
      what: "Dynamic rating factor from the handbook table for the bearing type.",
      tip: "Read the metric column at the D cos α ÷ dm the tool shows; interpolate between rows.",
      effect: "The dynamic rating rises in proportion.",
      fig: "factor",
      sym: "f_c"
    },
    fo: {
      what: "Static rating factor from the handbook table for the bearing type.",
      tip: "Read the metric column at the D cos α ÷ dm the tool shows; interpolate between rows.",
      effect: "The static rating rises in proportion.",
      fig: "factor",
      sym: "f_o"
    },
    nb: {
      what: "Number of similar bearings mounted in tandem and sharing the load.",
      tip: "Only when they are made and mounted to share the load equally.",
      effect: "The dynamic rating rises by a power below one; the static rating in proportion.",
      fig: "count",
      sym: "n"
    },
    P: {
      what: "Equivalent dynamic load on the bearing.",
      tip: "X Fr + Y Fa with the factors from the handbook tables, or from the bearing life tools.",
      effect: "Life falls with the cube (ball) or the 10/3 power (roller) of the load.",
      fig: "force",
      sym: "P"
    },
    n: {
      what: "Rotational speed of the bearing.",
      tip: "Use the mean speed over the duty cycle.",
      effect: "Converts the life in revolutions to hours.",
      fig: "rotation",
      sym: "n"
    },
    Lreq: {
      what: "Rating life the application needs, in hours.",
      tip: "The handbook lists typical design lives for many machines.",
      effect: "Fails the bearing when its life is shorter.",
      fig: "time",
      sym: "L_req"
    },
    Po: {
      what: "Static equivalent load on the bearing at rest or turning slowly.",
      tip: "The greater of Xo Fr + Yo Fa and Fr; 0 if there is no static load.",
      effect: "Sets the static safety.",
      fig: "force",
      sym: "P_o"
    },
    s0Min: {
      what: "Least static safety factor Co ÷ Po you accept.",
      tip: "Take it from the bearing maker for the duty and the quietness you need.",
      effect: "Fails the bearing when the static safety is lower.",
      fig: "factor",
      sym: "s_0"
    }
  },
  "roller-bearing-load-ratings": {
    type: {
      what: "Whether the roller bearing carries mainly radial load or mainly thrust.",
      tip: "Angular contact bearings count as radial when the contact angle is below 90°.",
      effect: "Changes the rating formulas and the static rating.",
      fig: "choice",
      sym: "type"
    },
    i: {
      what: "Number of rows of rollers in the bearing.",
      tip: "For a thrust bearing, count only rows carrying load in the same direction.",
      effect: "More rows raise the rating less than in proportion.",
      fig: "count",
      sym: "i"
    },
    alpha: {
      what: "Nominal contact angle between the load line and the plane square to the axis.",
      tip: "0° for deep groove and cylindrical bearings, 90° for pure thrust bearings.",
      effect: "A larger angle lowers the radial rating and raises the thrust rating.",
      fig: "angle",
      sym: "α"
    },
    Z: {
      what: "Number of rollers carried in each row of the bearing.",
      tip: "Count them, or take the number from the bearing drawing.",
      effect: "The rating rises with a power of the number below one.",
      fig: "count",
      sym: "Z"
    },
    D: {
      what: "Diameter of the rollers: mean diameter of a tapered roller, major diameter of a spherical roller.",
      tip: "Measure a roller or take it from the bearing drawing.",
      effect: "The dynamic rating rises with D^(29/27).",
      fig: "diameter",
      sym: "D"
    },
    leff: {
      what: "Effective length of roller contact.",
      tip: "The roller length less chamfers or grinding undercuts where contact is shortest.",
      effect: "The dynamic rating rises with leff^(7/9); above 2.5 D the factor fc falls.",
      fig: "length",
      sym: "l_eff"
    },
    dm: {
      what: "Pitch diameter of the roller set, from bearing centre to roller centre and back.",
      tip: "About the mean of the bore and the outside diameter of the bearing.",
      effect: "Sets D cos α ÷ dm, the value for reading the factors.",
      fig: "diameter",
      sym: "d_m"
    },
    fc: {
      what: "Dynamic rating factor from the handbook table for the bearing type.",
      tip: "Read the metric column at the D cos α ÷ dm the tool shows; interpolate between rows.",
      effect: "The dynamic rating rises in proportion.",
      fig: "factor",
      sym: "f_c"
    },
    nb: {
      what: "Number of similar bearings mounted in tandem and sharing the load.",
      tip: "Only when they are made and mounted to share the load equally.",
      effect: "The dynamic rating rises by a power below one; the static rating in proportion.",
      fig: "count",
      sym: "n"
    },
    P: {
      what: "Equivalent dynamic load on the bearing.",
      tip: "X Fr + Y Fa with the factors from the handbook tables, or from the bearing life tools.",
      effect: "Life falls with the cube (ball) or the 10/3 power (roller) of the load.",
      fig: "force",
      sym: "P"
    },
    n: {
      what: "Rotational speed of the bearing.",
      tip: "Use the mean speed over the duty cycle.",
      effect: "Converts the life in revolutions to hours.",
      fig: "rotation",
      sym: "n"
    },
    Lreq: {
      what: "Rating life the application needs, in hours.",
      tip: "The handbook lists typical design lives for many machines.",
      effect: "Fails the bearing when its life is shorter.",
      fig: "time",
      sym: "L_req"
    },
    Po: {
      what: "Static equivalent load on the bearing at rest or turning slowly.",
      tip: "The greater of Xo Fr + Yo Fa and Fr; 0 if there is no static load.",
      effect: "Sets the static safety.",
      fig: "force",
      sym: "P_o"
    },
    s0Min: {
      what: "Least static safety factor Co ÷ Po you accept.",
      tip: "Take it from the bearing maker for the duty and the quietness you need.",
      effect: "Fails the bearing when the static safety is lower.",
      fig: "factor",
      sym: "s_0"
    }
  },
  "disc-spring-fatigue-life": {
    D: {
      what: "Nominal outside diameter of the disc spring.",
      tip: "Choose it to fit the bore the stack works in, with clearance.",
      effect: "Sets the diameter ratio and, through Da, the force.",
      fig: "diameter",
      sym: "D"
    },
    d: {
      what: "Inside diameter of the disc spring.",
      tip: "Choose it to clear the guide rod.",
      effect: "Sets the diameter ratio δ = D ÷ d and the constants K1, K2 and K3.",
      fig: "diameter",
      sym: "d"
    },
    t: {
      what: "Thickness of the spring steel the disc is made from.",
      tip: "Below 1.25 mm the spring is Group 1, from 1.25 to 6 mm Group 2.",
      effect: "Force rises steeply with thickness; it also sets the group for fatigue.",
      fig: "thickness",
      sym: "t"
    },
    h: {
      what: "Cone (dish) height of the unloaded disc.",
      tip: "The free height of the disc less its thickness.",
      effect: "Sets the shape of the force curve and how far the disc can deflect.",
      fig: "height",
      sym: "h"
    },
    E: {
      what: "Modulus of elasticity of the spring steel.",
      tip: "About 206,000 MPa for spring steels.",
      effect: "Forces and stresses rise in proportion.",
      fig: "modulus",
      sym: "E"
    },
    nu: {
      what: "Poisson’s ratio of the spring steel.",
      tip: "Use 0.3 for spring steels.",
      effect: "Changes forces and stresses slightly.",
      fig: "ratio",
      sym: "μ"
    },
    smin: {
      what: "Deflection of one disc at the minimum load, including the preload.",
      tip: "Stack deflection at minimum load ÷ discs in series; preload is usually 15 to 20 % of h.",
      effect: "Sets the minimum stresses in the fatigue range.",
      fig: "length",
      sym: "s_min"
    },
    smax: {
      what: "Deflection of one disc at the maximum load.",
      tip: "Stack deflection at maximum load ÷ discs in series; it cannot exceed h.",
      effect: "Sets the maximum stresses and the force.",
      fig: "length",
      sym: "s_max"
    },
    ns: {
      what: "Number of discs stacked in series, alternately facing.",
      tip: "Unloaded stack length = discs × (t + h); it must fit the space.",
      effect: "Multiplies the travel, not the force.",
      fig: "count",
      sym: "n"
    },
    Nreq: {
      what: "Number of load cycles the stack must survive.",
      tip: "The equations cover 10⁴ to 2 × 10⁶ cycles.",
      effect: "Fails the springs when the life is shorter.",
      fig: "count",
      sym: "N"
    },
    s0Max: {
      what: "Limit on the compressive stress on the top surface at the mean diameter (point 0).",
      tip: "The handbook gives 1600 N/mm² for most spring steels.",
      effect: "Fails the springs when the stress is higher.",
      fig: "stress",
      sym: "σ_0"
    },
    sTMax: {
      what: "Limit on the tensile stress at the bottom inner and outer edges (points 2 and 3).",
      tip: "The handbook gives 1300 (Group 1) and 1250 N/mm² (Group 2).",
      effect: "Fails the springs when the stress is higher.",
      fig: "stress",
      sym: "σ_T"
    }
  },
  "thread-wire-involute-helicoid": {
    E: {
      what: "Pitch diameter for which you want the reading over wires.",
      tip: "Use the basic, maximum or minimum pitch diameter from the thread limits.",
      effect: "The reading rises almost one for one with it.",
      fig: "diameter",
      sym: "E"
    },
    P: {
      what: "Axial pitch of the thread, from one thread to the next.",
      tip: "For a multi-start thread the pitch is the lead ÷ the starts.",
      effect: "Sets the thread width T = P ÷ 2 and the lead.",
      fig: "pitch",
      sym: "P"
    },
    S: {
      what: "Number of starts (threads) on the screw or worm.",
      tip: "Count the thread ends at the end of the screw.",
      effect: "Raises the lead and the lead angle.",
      fig: "count",
      sym: "S"
    },
    plane: {
      what: "Plane in which the thread half-angle is given.",
      tip: "Normal plane for a thread milled with a cutter of that angle; axial plane for a lathe-cut thread.",
      effect: "Changes which half-angle is converted by the lead angle.",
      fig: "choice",
      sym: "plane"
    },
    ang: {
      what: "Angle between one thread flank and a line square to the axis, half the included angle.",
      tip: "14.5° for Acme, 30° for 60° threads, 20° for a 40° worm.",
      effect: "A smaller angle makes the lead angle matter more.",
      fig: "angle",
      sym: "A"
    },
    wire: {
      what: "Whether to use your wire size or the size the simplified formula needs.",
      tip: "The exact formula works with any wire that touches the flanks.",
      effect: "Changes the reading over wires.",
      fig: "choice",
      sym: "W"
    },
    W: {
      what: "Diameter of the measuring wires or pins.",
      tip: "Measure the wires precisely; any error goes straight into the reading.",
      effect: "The reading rises with the wire size.",
      fig: "diameter",
      sym: "W"
    },
    Mmeas: {
      what: "Reading over the wires you measured.",
      tip: "Measure with the recommended contact pressure; 0 to skip.",
      effect: "Gives the pitch diameter of the thread you measured.",
      fig: "length",
      sym: "M"
    },
    tol: {
      what: "How close the reading over wires must be.",
      tip: "For gauges, a few micrometres; for general work, more.",
      effect: "Decides whether the simplified formula is good enough.",
      fig: "tolerance",
      sym: "tol"
    }
  }
});
