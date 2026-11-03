// KEVOS® Tools input guides: norton4. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-norton4.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "vee-engine-balance": {
    n: {
      what: "Number of crank throws, each carrying one cylinder from each bank.",
      tip: "A V8 has four throws; a V-twin has one.",
      effect: "Sets how many cylinder pairs are summed.",
      fig: "count",
      sym: "n"
    },
    vee: {
      what: "Angle between the centre lines of the two cylinder banks.",
      tip: "Common vee angles are 60° and 90°; enter 0 for an inline pair.",
      effect: "Changes how the two banks’ forces add and cancel.",
      fig: "angle",
      sym: "2γ"
    },
    p2: {
      what: "Crank phase angle of throw 2 relative to throw 1, which is at 0°.",
      tip: "Read it from the crankshaft drawing; enter 0 for throws beyond the count.",
      effect: "Decides which harmonics of force and moment cancel.",
      fig: "angle",
      sym: "φ2"
    },
    p3: {
      what: "Crank phase angle of throw 3 relative to throw 1, which is at 0°.",
      tip: "Read it from the crankshaft drawing; enter 0 for throws beyond the count.",
      effect: "Decides which harmonics of force and moment cancel.",
      fig: "angle",
      sym: "φ3"
    },
    p4: {
      what: "Crank phase angle of throw 4 relative to throw 1, which is at 0°.",
      tip: "Read it from the crankshaft drawing; enter 0 for throws beyond the count.",
      effect: "Decides which harmonics of force and moment cancel.",
      fig: "angle",
      sym: "φ4"
    },
    p5: {
      what: "Crank phase angle of throw 5 relative to throw 1, which is at 0°.",
      tip: "Read it from the crankshaft drawing; enter 0 for throws beyond the count.",
      effect: "Decides which harmonics of force and moment cancel.",
      fig: "angle",
      sym: "φ5"
    },
    p6: {
      what: "Crank phase angle of throw 6 relative to throw 1, which is at 0°.",
      tip: "Read it from the crankshaft drawing; enter 0 for throws beyond the count.",
      effect: "Decides which harmonics of force and moment cancel.",
      fig: "angle",
      sym: "φ6"
    },
    z1: {
      what: "Distance along the crankshaft from the moment reference point to throw 1.",
      tip: "Enter 0 to take moments about throw 1.",
      effect: "Moves the reference for the shaking moments only.",
      fig: "length",
      sym: "z1"
    },
    sp: {
      what: "Distance along the crankshaft between neighbouring crank throws.",
      tip: "Measure centre to centre of the crank pins.",
      effect: "Shaking moments rise in proportion.",
      fig: "pitch",
      sym: "s"
    },
    mB: {
      what: "Reciprocating mass of one cylinder: the piston plus the rod’s share at the wrist pin.",
      tip: "Weigh the piston assembly; enter 0 to see the factors only.",
      effect: "Forces, moments and torque rise in proportion.",
      fig: "mass",
      sym: "mB"
    },
    r: {
      what: "Crank radius from the main bearing centre to the crank pin centre.",
      tip: "Half the piston stroke.",
      effect: "Forces rise with r; the secondary also with r/l.",
      fig: "radius",
      sym: "r"
    },
    l: {
      what: "Connecting rod length between the crank pin and wrist pin centres.",
      tip: "Measure pin centre to pin centre.",
      effect: "A longer rod lowers the secondary terms.",
      fig: "length",
      sym: "l"
    },
    rpm: {
      what: "Rotational speed of the crankshaft for the force and torque values.",
      tip: "Check at the highest running speed.",
      effect: "Forces and torque rise with the square of speed.",
      fig: "rotation",
      sym: "n"
    },
    th: {
      what: "Angle of throw 1 from the vee centre line at which to report the values.",
      tip: "Step it to follow the forces through a revolution.",
      effect: "Changes only the instantaneous values.",
      fig: "angle",
      sym: "ωt"
    }
  },
  "geared-fivebar-kinematics": {
    a: {
      what: "Length of link 2, the geared crank, from its fixed pivot O2 to joint A.",
      tip: "Measure pin centre to pin centre.",
      effect: "Sets the size of the input motion.",
      fig: "length",
      sym: "a"
    },
    b: {
      what: "Length of link 3, the coupler, from joint A to joint B.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the position of B and the coupler curve.",
      fig: "length",
      sym: "b"
    },
    c: {
      what: "Length of link 4 from joint C on link 5 to joint B.",
      tip: "Measure pin centre to pin centre.",
      effect: "Changes the position of B and the coupler curve.",
      fig: "length",
      sym: "c"
    },
    d: {
      what: "Length of link 5, the second geared link, from its fixed pivot O5 to joint C.",
      tip: "Measure pin centre to pin centre.",
      effect: "Sets the size of the second input motion.",
      fig: "length",
      sym: "d"
    },
    f: {
      what: "Distance between the two fixed pivots O2 and O5 of the geared links.",
      tip: "For gears in mesh this is the sum of their pitch radii.",
      effect: "Changes the reach the coupler and link 4 must span.",
      fig: "length",
      sym: "f"
    },
    lam: {
      what: "Gear ratio between the two geared links, with sign for direction of turning.",
      tip: "External gears turn opposite ways: λ = −(gear 2 diameter ÷ gear 5 diameter).",
      effect: "Changes how fast link 5 turns against link 2.",
      fig: "ratio",
      sym: "λ"
    },
    phi: {
      what: "Angle of link 5 when link 2 is at 0°, set by how the gears are meshed.",
      tip: "Re-meshing the gears by one tooth changes it by one tooth angle.",
      effect: "Changes the coupler curve without changing any link.",
      fig: "angle",
      sym: "φ"
    },
    t2: {
      what: "Angle of link 2 measured anticlockwise from the line O2O5.",
      tip: "Measure from the line joining the fixed pivots.",
      effect: "Sets the position of every link.",
      fig: "angle",
      sym: "θ2"
    },
    w2: {
      what: "Angular velocity of link 2, positive anticlockwise.",
      tip: "rad/s = rpm × 2π ÷ 60.",
      effect: "All velocities rise in proportion.",
      fig: "rotation",
      sym: "ω2"
    },
    a2: {
      what: "Angular acceleration of link 2, positive anticlockwise.",
      tip: "Enter 0 for a crank at constant speed.",
      effect: "Adds tangential acceleration terms.",
      fig: "acceleration",
      sym: "α2"
    },
    circ: {
      what: "Which of the two ways links 3 and 4 can be assembled at this crank angle.",
      tip: "Try both and keep the one that matches your drawing.",
      effect: "Chooses the position solution.",
      fig: "choice",
      sym: "±"
    },
    p: {
      what: "Distance from joint A to a point of interest on the coupler.",
      tip: "Enter 0 if no coupler point is needed.",
      effect: "Adds the coupler point position and speed.",
      fig: "length",
      sym: "p"
    },
    d3: {
      what: "Angle from the line AB to the line from A to the coupler point.",
      tip: "Measure anticlockwise at A; 0° puts the point on AB.",
      effect: "Moves the coupler point around A.",
      fig: "angle",
      sym: "δ3"
    }
  },
  "fourbar-three-position-synthesis": {
    p21: {
      what: "Straight-line distance the coupler point moves from the first to the second position.",
      tip: "Draw the three positions to scale and measure P1 to P2.",
      effect: "Scales the linkage with the size of the move.",
      fig: "length",
      sym: "p21"
    },
    d2: {
      what: "Direction of the move from P1 to P2, anticlockwise from the X axis.",
      tip: "Measure from a horizontal line through P1.",
      effect: "Turns the second position about P1.",
      fig: "angle",
      sym: "δ2"
    },
    p31: {
      what: "Straight-line distance the coupler point moves from the first to the third position.",
      tip: "Measure P1 to P3 on the same drawing.",
      effect: "Scales the linkage with the size of the move.",
      fig: "length",
      sym: "p31"
    },
    d3: {
      what: "Direction of the move from P1 to P3, anticlockwise from the X axis.",
      tip: "Measure from the same horizontal line through P1.",
      effect: "Turns the third position about P1.",
      fig: "angle",
      sym: "δ3"
    },
    a2: {
      what: "Rotation of the coupler line between the first and second positions.",
      tip: "Anticlockwise is positive; measure the change in the line’s angle.",
      effect: "Changes both dyads and so every link.",
      fig: "angle",
      sym: "α2"
    },
    a3: {
      what: "Rotation of the coupler line between the first and third positions.",
      tip: "Anticlockwise is positive; measure from the first position.",
      effect: "Changes both dyads and so every link.",
      fig: "angle",
      sym: "α3"
    },
    b2: {
      what: "Chosen rotation of the input link between position 1 and position 2.",
      tip: "Pick a value, solve, and change it until the pivots and links suit the space.",
      effect: "Moves the fixed pivot and changes the link lengths.",
      fig: "angle",
      sym: "β2"
    },
    b3: {
      what: "Chosen rotation of the input link between position 1 and position 3.",
      tip: "Pick a value, solve, and change it until the pivots and links suit the space.",
      effect: "Moves the fixed pivot and changes the link lengths.",
      fig: "angle",
      sym: "β3"
    },
    g2: {
      what: "Chosen rotation of the output link between position 1 and position 2.",
      tip: "Pick a value, solve, and change it until the pivots and links suit the space.",
      effect: "Moves the fixed pivot and changes the link lengths.",
      fig: "angle",
      sym: "γ2"
    },
    g3: {
      what: "Chosen rotation of the output link between position 1 and position 3.",
      tip: "Pick a value, solve, and change it until the pivots and links suit the space.",
      effect: "Moves the fixed pivot and changes the link lengths.",
      fig: "angle",
      sym: "γ3"
    }
  }
});
