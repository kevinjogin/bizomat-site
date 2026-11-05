// BIZOMAT Tools input guides: norton3. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-norton3.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "inverted-slider-crank-kinematics": {
    a: {
      what: "Length of the crank from its fixed pivot O2 to the crank pin A.",
      tip: "Measure pin centre to pin centre.",
      effect: "Sets the size of the input motion.",
      fig: "length",
      sym: "a"
    },
    c: {
      what: "Length of the output link from its fixed pivot O4 to the pivot of the slider block.",
      tip: "Measure from the fixed pivot to the block pin centre.",
      effect: "Changes the swing of the output link.",
      fig: "length",
      sym: "c"
    },
    d: {
      what: "Distance between the two fixed pivots O2 and O4.",
      tip: "Measure centre to centre of the frame pivots.",
      effect: "Changes the output swing and the slip.",
      fig: "length",
      sym: "d"
    },
    g: {
      what: "Fixed angle between the sliding line of the coupler and the output link at the block.",
      tip: "Use 90° when the slide is square to link 4.",
      effect: "Changes the position solution and the coupler angle.",
      fig: "angle",
      sym: "γ"
    },
    t2: {
      what: "Angle of the crank measured anticlockwise from the line O2O4.",
      tip: "Measure from the line joining the fixed pivots.",
      effect: "Sets the position of every link.",
      fig: "angle",
      sym: "θ2"
    },
    w2: {
      what: "Angular velocity of the crank, positive anticlockwise.",
      tip: "rad/s = rpm × 2π ÷ 60.",
      effect: "All velocities rise in proportion.",
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
      what: "Which of the two ways the linkage is assembled, by the sign of γ.",
      tip: "Open adds γ to the output angle; crossed subtracts it.",
      effect: "Chooses the position solution.",
      fig: "choice",
      sym: "circ"
    }
  },
  "cam-svaj-functions": {
    law: {
      what: "Displacement program used for this rise or fall between dwells.",
      tip: "Modified sine suits heavy followers; cycloidal gives smooth jerk.",
      effect: "Changes the peak velocity, acceleration and jerk.",
      fig: "choice",
      sym: "law"
    },
    dir: {
      what: "Whether the follower moves out (rise) or back (fall) in this segment.",
      tip: "A fall is the mirror of the rise.",
      effect: "Reverses the signs of velocity, acceleration and jerk.",
      fig: "choice",
      sym: "dir"
    },
    h: {
      what: "Total lift of the follower over the segment.",
      tip: "Take it from the cam timing diagram.",
      effect: "All motion values rise in proportion.",
      fig: "length",
      sym: "h"
    },
    beta: {
      what: "Cam rotation angle over which the rise or fall happens.",
      tip: "Take it from the timing diagram, e.g. 90°.",
      effect: "A shorter angle raises acceleration with its square.",
      fig: "angle",
      sym: "β"
    },
    th: {
      what: "Cam rotation from the start of the segment at which to read the motion.",
      tip: "Enter half of β for the middle of the segment.",
      effect: "Sets where the values are read.",
      fig: "angle",
      sym: "θ"
    },
    rpm: {
      what: "Rotational speed of the camshaft, taken as steady.",
      tip: "Use the running speed of the machine.",
      effect: "Velocity rises with speed, acceleration with its square, jerk with its cube.",
      fig: "rotation",
      sym: "n"
    }
  },
  "fourbar-force-balance": {
    l2: {
      what: "Length of the crank between its pivot O2 and joint A.",
      tip: "Measure pin centre to pin centre.",
      effect: "Scales the crank counterweight.",
      fig: "length",
      sym: "l2"
    },
    l3: {
      what: "Length of the coupler between joints A and B.",
      tip: "Measure pin centre to pin centre.",
      effect: "Divides the coupler mass between the crank and rocker.",
      fig: "length",
      sym: "l3"
    },
    l4: {
      what: "Length of the rocker between its pivot O4 and joint B.",
      tip: "Measure pin centre to pin centre.",
      effect: "Scales the rocker counterweight.",
      fig: "length",
      sym: "l4"
    },
    m3: {
      what: "Mass of the coupler link including its pins and anything it carries.",
      tip: "Weigh the coupler assembly or take it from CAD.",
      effect: "Both counterweights rise in proportion.",
      fig: "mass",
      sym: "m3"
    },
    b3: {
      what: "Distance from joint A to the centre of gravity of the coupler.",
      tip: "Take it from CAD or by balancing the link.",
      effect: "Changes both counterweights and their angles.",
      fig: "length",
      sym: "b3"
    },
    p3: {
      what: "Angle from the line AB to the line from A to the coupler’s centre of gravity.",
      tip: "Measure anticlockwise at A; 0° if the CG lies on AB.",
      effect: "Sets the angles of both counterweights.",
      fig: "angle",
      sym: "φ3"
    },
    m2b2: {
      what: "Mass of the crank as it is now, multiplied by the distance of its centre of gravity from its pivot.",
      tip: "Find it from CAD or by weighing; enter 0 if the crank's CG is on the pivot.",
      effect: "Subtracted from the required total to give the counterweight to add.",
      fig: "mass",
      sym: "mb"
    },
    p2: {
      what: "Angle of the crank's centre of gravity measured from the line O2A.",
      tip: "Measure anticlockwise from the line through the link’s pin centres.",
      effect: "Sets the direction of the existing unbalance.",
      fig: "angle",
      sym: "φ"
    },
    m4b4: {
      what: "Mass of the rocker as it is now, multiplied by the distance of its centre of gravity from its pivot.",
      tip: "Find it from CAD or by weighing; enter 0 if the rocker's CG is on the pivot.",
      effect: "Subtracted from the required total to give the counterweight to add.",
      fig: "mass",
      sym: "mb"
    },
    p4: {
      what: "Angle of the rocker's centre of gravity measured from the line O4B.",
      tip: "Measure anticlockwise from the line through the link’s pin centres.",
      effect: "Sets the direction of the existing unbalance.",
      fig: "angle",
      sym: "φ"
    }
  }
});
