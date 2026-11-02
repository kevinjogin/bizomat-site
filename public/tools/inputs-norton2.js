// KEVOS® Tools input guides: norton2. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-norton2.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "engine-piston-motion": {
    r: {
      what: "Radius of the crank throw, which is half the piston stroke.",
      tip: "Measure from the main bearing centre to the crankpin centre, or halve the stroke.",
      effect: "Piston velocity rises in proportion and the r/l ratio changes.",
      fig: "radius",
      sym: "r"
    },
    l: {
      what: "Length of the connecting rod between crankpin and wrist pin centres.",
      tip: "Measure centre to centre of the two bores in the rod.",
      effect: "A longer rod lowers r/l and the second harmonic.",
      fig: "length",
      sym: "l"
    },
    rpm: {
      what: "Rotational speed of the crankshaft, taken as steady.",
      tip: "Use the speed you want to check, often the highest running speed.",
      effect: "Accelerations and inertia forces rise with its square.",
      fig: "rotation",
      sym: "n"
    },
    wt: {
      what: "Angle the crank has turned from top dead centre.",
      tip: "Measure in the direction of rotation; 0° is the piston at the top of its stroke.",
      effect: "Sets where in the cycle the values are taken.",
      fig: "angle",
      sym: "ωt"
    }
  },
  "engine-gas-torque": {
    B: {
      what: "Diameter of the cylinder bore, equal to the piston diameter.",
      tip: "Take it from the engine data, e.g. 76.2 mm for a 3 in bore.",
      effect: "The gas force rises with its square.",
      fig: "diameter",
      sym: "B"
    },
    Pg: {
      what: "Cylinder pressure above the crankcase at this crank angle.",
      tip: "Read it from a measured or calculated pressure curve at the same crank angle.",
      effect: "The gas force and torque rise in proportion.",
      fig: "pressure",
      sym: "P_g"
    },
    r: {
      what: "Radius of the crank throw, which is half the piston stroke.",
      tip: "Measure from the main bearing centre to the crankpin centre, or halve the stroke.",
      effect: "Piston velocity rises in proportion and the r/l ratio changes.",
      fig: "radius",
      sym: "r"
    },
    l: {
      what: "Length of the connecting rod between crankpin and wrist pin centres.",
      tip: "Measure centre to centre of the two bores in the rod.",
      effect: "A longer rod lowers r/l and the second harmonic.",
      fig: "length",
      sym: "l"
    },
    wt: {
      what: "Angle the crank has turned from top dead centre.",
      tip: "Measure in the direction of rotation; 0° is the piston at the top of its stroke.",
      effect: "Sets where in the cycle the values are taken.",
      fig: "angle",
      sym: "ωt"
    }
  },
  "engine-inertia-forces": {
    r: {
      what: "Radius of the crank throw, which is half the piston stroke.",
      tip: "Measure from the main bearing centre to the crankpin centre, or halve the stroke.",
      effect: "Piston velocity rises in proportion and the r/l ratio changes.",
      fig: "radius",
      sym: "r"
    },
    l: {
      what: "Length of the connecting rod between crankpin and wrist pin centres.",
      tip: "Measure centre to centre of the two bores in the rod.",
      effect: "A longer rod lowers r/l and the second harmonic.",
      fig: "length",
      sym: "l"
    },
    rpm: {
      what: "Rotational speed of the crankshaft, taken as steady.",
      tip: "Use the speed you want to check, often the highest running speed.",
      effect: "Accelerations and inertia forces rise with its square.",
      fig: "rotation",
      sym: "n"
    },
    wt: {
      what: "Angle the crank has turned from top dead centre.",
      tip: "Measure in the direction of rotation; 0° is the piston at the top of its stroke.",
      effect: "Sets where in the cycle the values are taken.",
      fig: "angle",
      sym: "ωt"
    },
    m2: {
      what: "Mass of the crank throw that is not balanced by a counterweight.",
      tip: "Enter 0 if the crank is fully counterweighted.",
      effect: "Adds to the rotating mass at the crankpin.",
      fig: "mass",
      sym: "m_2"
    },
    rG2: {
      what: "Distance from the main bearing axis to the centre of gravity of the crank mass.",
      tip: "Take it from CAD or by balancing the part on a knife edge.",
      effect: "Sets the crank’s share of the crankpin mass.",
      fig: "length",
      sym: "r_G2"
    },
    m3: {
      what: "Total mass of the connecting rod with its cap and bolts.",
      tip: "Weigh the rod assembly.",
      effect: "Split between the crankpin and wrist pin masses.",
      fig: "mass",
      sym: "m_3"
    },
    la: {
      what: "Distance from the conrod centre of gravity to the crankpin centre.",
      tip: "Find it by weighing each end with the rod level; usually about a third of the length.",
      effect: "Sets how much rod mass goes to each end.",
      fig: "length",
      sym: "l_a"
    },
    IG3: {
      what: "Mass moment of inertia of the conrod about its centre of gravity.",
      tip: "Take it from CAD or a pendulum test; enter 0 to skip the check.",
      effect: "Places the centre of percussion for checking the model.",
      fig: "inertia",
      sym: "I_G3"
    },
    m4: {
      what: "Mass of the piston with its rings, wrist pin and clips.",
      tip: "Weigh the piston assembly.",
      effect: "Adds to the reciprocating mass at the wrist pin.",
      fig: "mass",
      sym: "m_4"
    }
  },
  "inline-engine-balance": {
    n: {
      what: "Number of cylinders arranged in one line along the crankshaft.",
      tip: "Enter up to eight; phase angles beyond this count are ignored.",
      effect: "Sets how many throws are summed.",
      fig: "count",
      sym: "n"
    },
    cycle: {
      what: "Whether each cylinder fires every revolution or every second revolution.",
      tip: "Two-stroke engines fire once per revolution, four-stroke once per two.",
      effect: "Sets the even firing interval.",
      fig: "choice",
      sym: "cycle"
    },
    p2: {
      what: "Angle of crank throw 2 relative to throw 1, measured round the crankshaft.",
      tip: "Measure in the direction of rotation; unused cylinders are ignored.",
      effect: "Decides which harmonics of force, torque and moment cancel.",
      fig: "angle",
      sym: "φ2"
    },
    p3: {
      what: "Angle of crank throw 3 relative to throw 1, measured round the crankshaft.",
      tip: "Measure in the direction of rotation; unused cylinders are ignored.",
      effect: "Decides which harmonics of force, torque and moment cancel.",
      fig: "angle",
      sym: "φ3"
    },
    p4: {
      what: "Angle of crank throw 4 relative to throw 1, measured round the crankshaft.",
      tip: "Measure in the direction of rotation; unused cylinders are ignored.",
      effect: "Decides which harmonics of force, torque and moment cancel.",
      fig: "angle",
      sym: "φ4"
    },
    p5: {
      what: "Angle of crank throw 5 relative to throw 1, measured round the crankshaft.",
      tip: "Measure in the direction of rotation; unused cylinders are ignored.",
      effect: "Decides which harmonics of force, torque and moment cancel.",
      fig: "angle",
      sym: "φ5"
    },
    p6: {
      what: "Angle of crank throw 6 relative to throw 1, measured round the crankshaft.",
      tip: "Measure in the direction of rotation; unused cylinders are ignored.",
      effect: "Decides which harmonics of force, torque and moment cancel.",
      fig: "angle",
      sym: "φ6"
    },
    p7: {
      what: "Angle of crank throw 7 relative to throw 1, measured round the crankshaft.",
      tip: "Measure in the direction of rotation; unused cylinders are ignored.",
      effect: "Decides which harmonics of force, torque and moment cancel.",
      fig: "angle",
      sym: "φ7"
    },
    p8: {
      what: "Angle of crank throw 8 relative to throw 1, measured round the crankshaft.",
      tip: "Measure in the direction of rotation; unused cylinders are ignored.",
      effect: "Decides which harmonics of force, torque and moment cancel.",
      fig: "angle",
      sym: "φ8"
    },
    z1: {
      what: "Distance from the point moments are taken about to cylinder 1.",
      tip: "Use 0 to take moments about cylinder 1, or the distance to one end of the crankshaft.",
      effect: "Changes the moment sums but not whether they cancel.",
      fig: "length",
      sym: "z_1"
    },
    sp: {
      what: "Distance along the crankshaft between neighbouring cylinder centres.",
      tip: "Measure the bore centre spacing of the block.",
      effect: "Scales the shaking moments.",
      fig: "length",
      sym: "s"
    },
    mB: {
      what: "Reciprocating mass of one cylinder: piston plus the wrist pin share of the rod.",
      tip: "Use the engine inertia force tool to find it, or 0 for the sums only.",
      effect: "Sizes the unbalanced forces and moments.",
      fig: "mass",
      sym: "m_B"
    },
    r: {
      what: "Radius of the crank throw, which is half the piston stroke.",
      tip: "Measure from the main bearing centre to the crankpin centre, or halve the stroke.",
      effect: "Piston velocity rises in proportion and the r/l ratio changes.",
      fig: "radius",
      sym: "r"
    },
    l: {
      what: "Length of the connecting rod between crankpin and wrist pin centres.",
      tip: "Measure centre to centre of the two bores in the rod.",
      effect: "A longer rod lowers r/l and the second harmonic.",
      fig: "length",
      sym: "l"
    },
    rpm: {
      what: "Rotational speed of the crankshaft, taken as steady.",
      tip: "Use the speed you want to check, often the highest running speed.",
      effect: "Accelerations and inertia forces rise with its square.",
      fig: "rotation",
      sym: "n"
    }
  }
});
