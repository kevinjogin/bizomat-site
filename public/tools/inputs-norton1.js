// KEVOS® Tools input guides: norton1. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-norton1.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "linkage-mobility": {
    space: {
      what: "Whether the links all move in one plane or in three dimensions.",
      tip: "Most machine linkages are planar; use spatial for ball-jointed or skewed linkages.",
      effect: "Chooses the planar or spatial mobility equation.",
      fig: "choice",
      sym: "2D/3D"
    },
    L: {
      what: "Number of links in the linkage, counting the frame as one link.",
      tip: "Count every rigid body, including the ground or frame once.",
      effect: "Each link adds three (planar) or six (spatial) freedoms.",
      fig: "count",
      sym: "L"
    },
    J1: {
      what: "Number of joints that allow one relative freedom, such as pins and sliders.",
      tip: "Count a joint shared by n links as n − 1 full joints.",
      effect: "Each removes two (planar) or five (spatial) freedoms.",
      fig: "count",
      sym: "J1"
    },
    J2: {
      what: "Number of joints that allow two freedoms, such as cam or roll-slide contacts.",
      tip: "Gear tooth and cam follower contacts are usually half joints.",
      effect: "Each removes one planar freedom.",
      fig: "count",
      sym: "J2"
    },
    J3: {
      what: "Number of spatial joints that allow three freedoms, such as ball joints.",
      tip: "Only used for spatial linkages.",
      effect: "Each removes three spatial freedoms.",
      fig: "count",
      sym: "J3"
    },
    J4: {
      what: "Number of spatial joints that allow four relative freedoms.",
      tip: "Only used for spatial linkages.",
      effect: "Each removes two spatial freedoms.",
      fig: "count",
      sym: "J4"
    },
    J5: {
      what: "Number of spatial joints that allow five relative freedoms.",
      tip: "Only used for spatial linkages.",
      effect: "Each removes one spatial freedom.",
      fig: "count",
      sym: "J5"
    }
  },
  "fourbar-grashof-check": {
    d: {
      what: "Distance between the two fixed pivots O2 and O4 of the fourbar.",
      tip: "Measure centre to centre of the frame pivots.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    a: {
      what: "Length of the input link from its fixed pivot O2 to joint A.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    b: {
      what: "Length of the coupler from joint A to joint B.",
      tip: "Measure pin centre to pin centre, not the overall link length.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    c: {
      what: "Length of the output link from its fixed pivot O4 to joint B.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    }
  },
  "fourbar-time-ratio": {
    mode: {
      what: "Whether to analyse an existing crank-rocker or design for a time ratio.",
      tip: "Design first, then analyse the linkage you draw to check it.",
      effect: "Chooses which inputs are used.",
      fig: "choice",
      sym: "mode"
    },
    d: {
      what: "Distance between the two fixed pivots O2 and O4 of the fourbar.",
      tip: "Measure centre to centre of the frame pivots.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    a: {
      what: "Length of the crank, the shortest link, from O2 to joint A.",
      tip: "The crank must be the shortest link of a Grashof linkage.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    b: {
      what: "Length of the coupler from joint A to joint B.",
      tip: "Measure pin centre to pin centre, not the overall link length.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    c: {
      what: "Length of the rocker from its fixed pivot O4 to joint B.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    TR: {
      what: "Ratio of the slower stroke time to the faster stroke time.",
      tip: "Enter 1.25 for a time ratio of 1:1.25.",
      effect: "Sets the two crank sweeps and the construction angle.",
      fig: "ratio",
      sym: "T_R"
    }
  },
  "fourbar-kinematics": {
    d: {
      what: "Distance between the two fixed pivots O2 and O4 of the fourbar.",
      tip: "Measure centre to centre of the frame pivots.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    a: {
      what: "Length of the input link from its fixed pivot O2 to joint A.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    b: {
      what: "Length of the coupler from joint A to joint B.",
      tip: "Measure pin centre to pin centre, not the overall link length.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    c: {
      what: "Length of the output link from its fixed pivot O4 to joint B.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    t2: {
      what: "Angle of the input link measured anticlockwise from the ground line O2O4.",
      tip: "Measure from the line joining the fixed pivots, not from horizontal, if the frame is tilted.",
      effect: "Sets the position of every link.",
      fig: "angle",
      sym: "θ2"
    },
    w2: {
      what: "Angular velocity of the input link, positive anticlockwise.",
      tip: "rad/s = rpm × 2π ÷ 60.",
      effect: "All velocities rise in proportion.",
      fig: "rotation",
      sym: "ω2"
    },
    a2: {
      what: "Angular acceleration of the input link, positive anticlockwise.",
      tip: "Enter 0 for a crank turning at constant speed.",
      effect: "Adds tangential acceleration terms.",
      fig: "acceleration",
      sym: "α2"
    },
    circ: {
      what: "Which of the two ways the links are assembled at this input angle.",
      tip: "Open: the links next to the shortest do not cross; crossed: they do.",
      effect: "Chooses the solution of the position equation.",
      fig: "choice",
      sym: "circ"
    },
    p: {
      what: "Distance from joint A to a point of interest on the coupler.",
      tip: "Enter 0 if you do not need a coupler point.",
      effect: "Gives the path and speed of that point.",
      fig: "length",
      sym: "p"
    },
    d3: {
      what: "Angle of the coupler point from the line AB, measured anticlockwise at A.",
      tip: "Measure on the coupler drawing from line AB to line AP.",
      effect: "Places the coupler point on the coupler.",
      fig: "angle",
      sym: "δ3"
    }
  },
  "slider-crank-kinematics": {
    a: {
      what: "Length of the crank from its pivot to the crank pin.",
      tip: "Half the stroke of an in-line slider-crank.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    b: {
      what: "Length of the connecting rod between the crank pin and the slider pin.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the motion and the angles of the whole linkage.",
      fig: "length",
      sym: "L"
    },
    c: {
      what: "Offset of the slide axis from the crank pivot, measured square to the slide.",
      tip: "Enter 0 for an in-line slider-crank such as most engines.",
      effect: "Makes the forward and return strokes unequal.",
      fig: "length",
      sym: "c"
    },
    t2: {
      what: "Crank angle measured anticlockwise from the direction of the slide axis.",
      tip: "Zero when the crank points along the slide towards the +X side.",
      effect: "Sets the slider and rod positions.",
      fig: "angle",
      sym: "θ2"
    },
    w2: {
      what: "Angular velocity of the crank, positive anticlockwise.",
      tip: "rad/s = rpm × 2π ÷ 60.",
      effect: "Slider velocity rises in proportion and acceleration with its square.",
      fig: "rotation",
      sym: "ω2"
    },
    a2: {
      what: "Angular acceleration of the crank, positive anticlockwise.",
      tip: "Enter 0 for a crank at constant speed.",
      effect: "Adds tangential acceleration terms.",
      fig: "acceleration",
      sym: "α2"
    },
    circ: {
      what: "Which side of the crank pivot the slider runs on.",
      tip: "Norton’s Figure 4-9 has the slider on the +X side.",
      effect: "Chooses the solution of the position equation.",
      fig: "choice",
      sym: "circ"
    }
  }
});
