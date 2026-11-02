// KEVOS® Tools input guides: handbook99. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook99.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "rim-face-arrangement-shims": {
    arr: {
      what: "Which of the sixteen handbook dial indicator mountings matches your set-up.",
      tip: "Compare where the rim and face buttons touch and which unit carries the bracket with Figs. 1a to 16a.",
      effect: "Sets the signs of the rim and face terms in both formulas.",
      fig: "choice",
      sym: "arr"
    },
    plane: {
      what: "Whether the readings were taken top and bottom or side to side.",
      tip: "Do the vertical alignment first, then the horizontal alignment.",
      effect: "Vertical results are shim changes; horizontal results are side moves.",
      fig: "choice",
      sym: "pl"
    },
    r: {
      what: "Reading of the dial indicator on the coupling rim in the reading position.",
      tip: "Zero the indicator 180° away, rotate both shafts together and keep the sign of the reading.",
      effect: "Half of it, with its sign, is added to every foot.",
      fig: "tolerance",
      sym: "r"
    },
    f: {
      what: "Reading of the dial indicator on the coupling face in the reading position.",
      tip: "Zero it with the rim indicator and read it at the same rotation.",
      effect: "Sets the angular part of the move, larger at feet further away.",
      fig: "tolerance",
      sym: "f"
    },
    A: {
      what: "Diameter of the circle the face indicator button traces on the coupling.",
      tip: "Measure the button’s radius from the shaft centre and double it.",
      effect: "A larger circle makes the same face reading a smaller angle.",
      fig: "diameter",
      sym: "A"
    },
    B: {
      what: "Axial distance from the path of the rim indicator to the front feet or the front move point.",
      tip: "Measure from the rim indicator path; enter it as negative if the feet are on the other side of the rim indicator.",
      effect: "Multiplies the face reading term, so feet further away need larger moves.",
      fig: "length",
      sym: "x"
    },
    C: {
      what: "Axial distance from the path of the rim indicator to the rear feet or the rear move point.",
      tip: "Measure from the rim indicator path; enter it as negative if the feet are on the other side of the rim indicator.",
      effect: "Multiplies the face reading term, so feet further away need larger moves.",
      fig: "length",
      sym: "x"
    },
    nx: {
      what: "How many further pairs of feet the movable machine stands on.",
      tip: "A motor with ten feet has three pairs besides the front and rear pairs.",
      effect: "Adds a shim or move result for each extra pair.",
      fig: "count",
      sym: "n"
    },
    E1: {
      what: "Axial distance from the path of the rim indicator to the first extra pair of feet.",
      tip: "Measure from the rim indicator path; enter it as negative if the feet are on the other side of the rim indicator.",
      effect: "Multiplies the face reading term, so feet further away need larger moves.",
      fig: "length",
      sym: "x"
    },
    E2: {
      what: "Axial distance from the path of the rim indicator to the second extra pair of feet.",
      tip: "Measure from the rim indicator path; enter it as negative if the feet are on the other side of the rim indicator.",
      effect: "Multiplies the face reading term, so feet further away need larger moves.",
      fig: "length",
      sym: "x"
    },
    E3: {
      what: "Axial distance from the path of the rim indicator to the third extra pair of feet.",
      tip: "Measure from the rim indicator path; enter it as negative if the feet are on the other side of the rim indicator.",
      effect: "Multiplies the face reading term, so feet further away need larger moves.",
      fig: "length",
      sym: "x"
    },
    sag: {
      what: "Total reading of the rim indicator and bracket turned 180° on a rigid bar.",
      tip: "Mount the bracket on a pipe in V-blocks exactly as on the machine, zero at the top and read at the bottom.",
      effect: "Corrects the vertical rim reading by this amount.",
      fig: "tolerance",
      sym: "sag"
    },
    zero: {
      what: "Clock position at which the rim indicator was set to zero.",
      tip: "Zeroed at 12 o’clock the sag is added; zeroed at 6 o’clock it is subtracted.",
      effect: "Sets whether the sag is added to or taken from the rim reading.",
      fig: "choice",
      sym: "z"
    },
    tol: {
      what: "The largest shim change or move that you will accept as aligned.",
      tip: "Use the tolerance from your alignment standard for the speed of the machine, or 0 to skip the check.",
      effect: "Moves within it report the machine as aligned.",
      fig: "tolerance",
      sym: "tol"
    }
  },
  "jackbolt-alignment-turns": {
    thr: {
      what: "Whether the jackbolts have inch threads or metric threads.",
      tip: "Check the bolt designation, e.g. 5/8-11 is inch and M16 is metric.",
      effect: "Chooses threads per inch or the metric pitch.",
      fig: "choice",
      sym: "thr"
    },
    tpi: {
      what: "Number of threads in one inch along an inch jackbolt.",
      tip: "Read it from the designation, e.g. 11 for 5/8-11 UNC.",
      effect: "The advance per turn is 1 ÷ TPI inch.",
      fig: "thread",
      sym: "n"
    },
    pitch: {
      what: "Distance between threads along a metric jackbolt.",
      tip: "Read it from the designation, e.g. 2 mm for M16 coarse.",
      effect: "The advance per turn equals the pitch.",
      fig: "pitch",
      sym: "p"
    },
    head: {
      what: "Number of flats on the jackbolt head, square or hex.",
      tip: "Square heads have four flats and hex heads six.",
      effect: "More flats give a finer move per flat.",
      fig: "choice",
      sym: "k"
    },
    mF: {
      what: "Side move needed at the front jackbolt from the alignment calculation.",
      tip: "Take it from the rim and face or reverse indicator result, with its sign.",
      effect: "Divided by the pitch to give the turns at the front.",
      fig: "length",
      sym: "m_F"
    },
    mR: {
      what: "Side move needed at the rear jackbolt from the alignment calculation.",
      tip: "Take it from the rim and face or reverse indicator result, with its sign.",
      effect: "Divided by the pitch to give the turns at the rear.",
      fig: "length",
      sym: "m_R"
    }
  },
  "riveted-joint-strength-by-type": {
    type: {
      what: "Arrangement of plates, cover plates and rows of rivets in the joint.",
      tip: "Count the rows on each side of the joint and see whether the plates overlap or butt.",
      effect: "Sets the ways of failing and their formulas.",
      fig: "choice",
      sym: "type"
    },
    d: {
      what: "Diameter of the rivet shank used for its shear area and crushing area.",
      tip: "Use the rivet size; the handbook examples use it for shear and bearing.",
      effect: "Shear resistance rises with its square, crushing in proportion.",
      fig: "diameter",
      sym: "d"
    },
    Dh: {
      what: "Diameter of the drilled or punched hole the rivet fills.",
      tip: "The handbook examples take holes 1/16 in (1.6 mm) larger than the rivet.",
      effect: "Reduces the net plate width that resists tearing.",
      fig: "diameter",
      sym: "D"
    },
    t: {
      what: "Thickness of the main plates joined by the rivets.",
      tip: "Use the thinner plate if the two plates differ.",
      effect: "Tearing and crushing resistances rise in proportion.",
      fig: "thickness",
      sym: "t"
    },
    tc: {
      what: "Thickness of one cover plate in a triple-riveted butt joint.",
      tip: "Measure one strap; it is only used for crushing in front of five rivets.",
      effect: "Raises the crushing resistance of the triple butt joint.",
      fig: "thickness",
      sym: "t_c"
    },
    p: {
      what: "Spacing of the rivets along the seam in a lap joint, or of the inner row.",
      tip: "Measure centre to centre along the seam.",
      effect: "For lap joints it is the repeating length and sets the tearing width.",
      fig: "pitch",
      sym: "p"
    },
    P: {
      what: "Spacing of the outer row of rivets in cover plate and butt joints.",
      tip: "Measure centre to centre of the outer row; it is the repeating length of the joint.",
      effect: "Sets the tearing widths and the solid plate strength.",
      fig: "pitch",
      sym: "P"
    },
    Ss: {
      what: "Shear stress you allow in the rivets under the working load.",
      tip: "Take it from the code, practice or specification you design to.",
      effect: "Shear resistances rise in proportion.",
      fig: "stress",
      sym: "S_s"
    },
    St: {
      what: "Tensile stress you allow in the plate under the working load.",
      tip: "Take it from the code, practice or specification you design to.",
      effect: "Tearing resistances and the solid plate strength rise in proportion.",
      fig: "stress",
      sym: "S_t"
    },
    Sc: {
      what: "Bearing stress you allow between the rivets and the plate.",
      tip: "Take it from the code, practice or specification you design to.",
      effect: "Crushing resistances rise in proportion.",
      fig: "stress",
      sym: "S_c"
    },
    Ls: {
      what: "Length of the riveted seam that shares the load.",
      tip: "Measure along the seam over the rivets that carry the load.",
      effect: "The seam load is the load per pitch times the number of pitches.",
      fig: "length",
      sym: "L"
    },
    Lreq: {
      what: "Total load the riveted seam has to carry in service.",
      tip: "Include the factors your code requires, or enter 0 to skip the check.",
      effect: "Compared with the safe load of the seam.",
      fig: "force",
      sym: "F"
    },
    e: {
      what: "Distance from the edge of the plate to the centres of the nearest rivets.",
      tip: "Measure square to the edge; the handbook places rivets 1.5 diameters in.",
      effect: "Below 1.5 d the plate may tear or shear out to the edge.",
      fig: "length",
      sym: "e"
    }
  },
  "uniform-strength-beam": {
    cs: {
      what: "Supports, load and tapered outline of the beam from the handbook tables.",
      tip: "Pick the row whose sketch matches the support, the load and which dimension tapers.",
      effect: "Sets the formula constant and the outline at a point.",
      fig: "choice",
      sym: "case"
    },
    mode: {
      what: "Whether to find the safe load, the depth needed or the width needed.",
      tip: "Size a new beam with depth or width; check an existing one with the safe load.",
      effect: "Chooses which of P, h and b is worked out.",
      fig: "choice",
      sym: "mode"
    },
    S: {
      what: "Bending stress you allow in the beam material for the duty.",
      tip: "Take it from your design code or the yield strength over your factor of safety.",
      effect: "The safe load rises in proportion.",
      fig: "stress",
      sym: "S"
    },
    b: {
      what: "Breadth of the beam at its largest section, across the load.",
      tip: "For a beam tapered in width this is the width at the root or the load point.",
      effect: "The safe load rises in proportion.",
      fig: "section",
      sym: "b"
    },
    h: {
      what: "Height of the beam at its largest section, in the direction of the load.",
      tip: "For a beam tapered in depth this is the depth at the root or the load point.",
      effect: "The safe load rises with its square.",
      fig: "section",
      sym: "h"
    },
    l: {
      what: "Length of a cantilever, or distance between the supports.",
      tip: "Measure from the fixed end to the load, or between the support centres.",
      effect: "A longer beam carries less load.",
      fig: "length",
      sym: "l"
    },
    a: {
      what: "Distance from the left support to a concentrated load.",
      tip: "Only used for a load at any point; the other distance is the span minus this.",
      effect: "A load near the centre gives the lowest safe load.",
      fig: "length",
      sym: "a"
    },
    P: {
      what: "Load the beam must carry; for a distributed load, the whole load.",
      tip: "Include the weight of anything the beam supports and any shock allowance.",
      effect: "Used to size the beam and compared with the safe load.",
      fig: "force",
      sym: "P"
    },
    x: {
      what: "Position along the beam at which you want its depth or width.",
      tip: "Measure from the loaded free end of a cantilever, or from the left support.",
      effect: "Gives the section from the tapered outline at that point.",
      fig: "length",
      sym: "x"
    }
  },
  "nose-radius-finish-change": {
    Ra1: {
      what: "Arithmetic mean roughness measured with the insert you use now.",
      tip: "Measure the finishing cut with a profilometer across the feed marks.",
      effect: "The new finish is in proportion to it.",
      fig: "roughness",
      sym: "Ra₁"
    },
    r1: {
      what: "Corner radius of the insert used for the measured finish.",
      tip: "Read it from the insert designation, e.g. 08 is 0.8 mm.",
      effect: "A smaller present radius gives a larger gain from the change.",
      fig: "radius",
      sym: "r₁"
    },
    r2: {
      what: "Corner radius of the insert you are changing to.",
      tip: "Read it from the insert designation, e.g. 16 is 1.6 mm.",
      effect: "Ra falls with the square root of the radius ratio.",
      fig: "radius",
      sym: "r₂"
    },
    Rat: {
      what: "Roughness the drawing or the process needs at the finished surface.",
      tip: "Enter the Ra from the drawing, or 0 to skip the check.",
      effect: "Gives the nose radius that would reach it.",
      fig: "roughness",
      sym: "Ra_t"
    }
  }
});
