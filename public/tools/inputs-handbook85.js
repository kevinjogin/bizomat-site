// KEVOS® WORKOS input guides: handbook85. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook85.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "cutter-clearance-grinding-setup": {
    setup: {
      what: "How the clearance angle is ground on the cutter teeth on the cutter grinder.",
      tip: "Disc wheels are usually set above or below centre; a cup wheel grinds a flat land with the tooth rest below the cutter centre.",
      effect: "Chooses which offset is reported as the set-up.",
      fig: "choice",
      sym: "setup"
    },
    Dc: {
      what: "Outside diameter of the milling cutter being sharpened.",
      tip: "Measure over the teeth after the last sharpening, not the catalogue size.",
      effect: "Sets the offsets below centre and with a cup wheel, and the clearance needed.",
      fig: "diameter",
      sym: "D_c"
    },
    Dw: {
      what: "Diameter of the disc grinding wheel used on the cutter grinder.",
      tip: "Measure the wheel after dressing; it shrinks with use.",
      effect: "Sets the offset with the wheel above centre and in line.",
      fig: "diameter",
      sym: "D_w"
    },
    cl: {
      what: "Primary clearance angle you intend to grind behind the cutting edge.",
      tip: "The handbook gives about 3 to 5° for steels, 4 to 7° for cast iron and bronze, 10 to 12° for soft non-ferrous metals.",
      effect: "Every offset grows with the sine of this angle.",
      fig: "angle",
      sym: "c"
    },
    F: {
      what: "Feed per revolution of the cutter in the cut, feed per tooth times teeth.",
      tip: "Take it from the job’s feed rate divided by the spindle speed.",
      effect: "A larger feed needs more clearance behind the edge.",
      fig: "feed",
      sym: "F"
    },
    L: {
      what: "Width of the land behind the cutting edge of each tooth.",
      tip: "About 0.4, 0.8 and 1.6 mm for small, medium and large cutters; it widens with each resharpening.",
      effect: "A wider land needs more clearance.",
      fig: "length",
      sym: "L"
    },
    d: {
      what: "Depth of cut the cutter takes in the job.",
      tip: "Use the deepest cut the cutter will take.",
      effect: "A deeper cut needs a little more clearance.",
      fig: "depth",
      sym: "d"
    },
    B: {
      what: "Brinell hardness number of the work material being milled.",
      tip: "Take it from the material certificate or a hardness test.",
      effect: "Harder work needs less clearance in the handbook formula.",
      fig: "number",
      sym: "HB"
    },
    dist: {
      what: "Distance the cutter or indicator is moved in a straight line for the indicator-drop check.",
      tip: "The handbook tables use 0.005 to 0.062 in for relief and 0.031 to 0.125 in for rake.",
      effect: "The drop grows in direct proportion.",
      fig: "length",
      sym: "x"
    },
    rake: {
      what: "Rake angle of the tooth face that you want to check with the indicator.",
      tip: "Positive rake of 10 to 15° is common on high-speed steel cutters for steel.",
      effect: "Sets the indicator drop for the rake check.",
      fig: "angle",
      sym: "γ"
    }
  },
  "spline-shaft-milling-cutter": {
    Ns: {
      what: "Number of straight-sided splines around the shaft to be milled.",
      tip: "Count them on the drawing or the mating hub.",
      effect: "Sets the cutter angle and the space available between splines.",
      fig: "count",
      sym: "N"
    },
    W: {
      what: "Width of each spline across its two parallel sides.",
      tip: "Use the width the spline must have after milling, within its tolerance.",
      effect: "Wider splines leave a narrower space for the cutter.",
      fig: "length",
      sym: "W"
    },
    d: {
      what: "Root diameter of the splined shaft, at the bottom of each space.",
      tip: "Take the minor diameter from the spline drawing.",
      effect: "Sets the angle A and the chordal width at the root.",
      fig: "diameter",
      sym: "d"
    }
  },
  "top-knurling-cam-rise": {
    Dst: {
      what: "Diameter of the bar stock being knurled on the screw machine.",
      tip: "Use the turned diameter the knurl rolls on.",
      effect: "A larger stock radius increases the cam rise a little.",
      fig: "diameter",
      sym: "2R"
    },
    Dk: {
      what: "Outside diameter of the knurl used from the cross slide.",
      tip: "Measure the knurl; resharpened knurls are smaller.",
      effect: "A larger knurl increases the travel from contact to centre.",
      fig: "diameter",
      sym: "2r"
    },
    depthFrom: {
      what: "Whether the tooth depth is found from the knurl pitch or entered directly.",
      tip: "Use the pitch for a standard sharp V knurl; enter the depth for special or worn knurls.",
      effect: "Chooses where the tooth depth comes from.",
      fig: "choice",
      sym: "mode"
    },
    pc: {
      what: "Circular pitch of the knurl, the distance between teeth around its face.",
      tip: "For inch knurls it is π divided by the diametral pitch, or 25.4 divided by the teeth per inch.",
      effect: "The tooth depth grows with the pitch.",
      fig: "pitch",
      sym: "p"
    },
    ang: {
      what: "Included angle of the knurl teeth.",
      tip: "The handbook example uses 90° for brass.",
      effect: "A smaller angle gives deeper teeth for the same pitch.",
      fig: "angle",
      sym: "θ"
    },
    dg: {
      what: "Depth of the knurled teeth when you enter it directly.",
      tip: "Measure a knurled sample or take it from the knurl maker.",
      effect: "The cam rise grows roughly with the square root of the depth.",
      fig: "depth",
      sym: "d"
    },
    f: {
      what: "Feed of the knurl per spindle revolution for top knurling.",
      tip: "Take it from your screw machine feed table for the material.",
      effect: "The revolutions to knurl fall in proportion as the feed rises.",
      fig: "feed",
      sym: "f"
    },
    n: {
      what: "Spindle speed of the screw machine while knurling.",
      tip: "Use the speed set for the knurling position.",
      effect: "Only moves the time to knurl.",
      fig: "rotation",
      sym: "n"
    }
  },
  "rubber-pad-forming-pressure": {
    F: {
      what: "Force the press can apply to the rubber pad container.",
      tip: "Take the rated capacity from the press plate; 1 short ton = 8.896 kN, 1 tonne-force = 9.807 kN.",
      effect: "The pad pressure grows in proportion.",
      fig: "force",
      sym: "F"
    },
    A: {
      what: "Area of the rubber pad in its container, seen in plan.",
      tip: "Use the inside length times width of the pad container.",
      effect: "The pad pressure falls as the area grows.",
      fig: "area",
      sym: "A"
    },
    t: {
      what: "Thickness of the rubber or polyurethane pad.",
      tip: "Measure the pad itself, not the container depth.",
      effect: "Sets the pad thickness check against the form block height.",
      fig: "thickness",
      sym: "t"
    },
    shore: {
      what: "Durometer hardness of the pad material in Shore A.",
      tip: "Take it from the pad supplier; the handbook gives 50 to 70 Shore.",
      effect: "Only moves the hardness check.",
      fig: "number",
      sym: "Sh"
    },
    h: {
      what: "Height of the rigid form block above the press bed.",
      tip: "Measure from the bed to the top of the block, including any spacer.",
      effect: "Sets the pad thickness needed.",
      fig: "height",
      sym: "h"
    },
    preq: {
      what: "Pressure the part needs on its blank to form fully.",
      tip: "Take it from trials or forming data for the material, thickness and smallest radius.",
      effect: "Only moves the pressure check.",
      fig: "pressure",
      sym: "p_req"
    }
  },
  "gear-angular-backlash": {
    Bk: {
      what: "Backlash between the two gears, measured on the pitch circles.",
      tip: "Measure at the tightest point of mesh with one gear held and an indicator on the other.",
      effect: "The angular play grows in direct proportion.",
      fig: "gap",
      sym: "B"
    },
    D: {
      what: "Pitch diameter of the larger gear of the pair.",
      tip: "Module times teeth, or teeth divided by diametral pitch.",
      effect: "The larger gear rocks through a smaller angle.",
      fig: "diameter",
      sym: "D"
    },
    d: {
      what: "Pitch diameter of the smaller gear of the pair.",
      tip: "Module times teeth, or teeth divided by diametral pitch.",
      effect: "The smaller gear rocks through the larger angle.",
      fig: "diameter",
      sym: "d"
    },
    dC: {
      what: "Change in centre distance from the one at which the backlash was measured.",
      tip: "Positive when the gears move apart, negative when they move together.",
      effect: "Moving apart adds backlash; moving together removes it.",
      fig: "length",
      sym: "ΔC"
    },
    phi: {
      what: "Transverse pressure angle of the gear teeth.",
      tip: "20° for most modern spur gears, 14.5° for older ones.",
      effect: "A larger pressure angle changes the backlash more for a centre distance change.",
      fig: "angle",
      sym: "φ"
    },
    maxSmall: {
      what: "Largest angular play you accept at the smaller gear.",
      tip: "Set it from the positioning accuracy the drive must hold at that shaft.",
      effect: "Only moves the play check.",
      fig: "angle",
      sym: "θ_max"
    }
  },
  "unified-cut-thread-tap-limits": {
    Dn: {
      what: "Basic major diameter of the Unified thread the tap cuts.",
      tip: "For a 1/4-20 tap it is 0.25 in; numbered sizes have their own basic diameters.",
      effect: "Sets the basic pitch diameter and every limit.",
      fig: "diameter",
      sym: "D"
    },
    n: {
      what: "Threads per inch of the Unified thread the tap cuts.",
      tip: "Read it from the tap marking.",
      effect: "Sets the pitch, the basic pitch diameter and the constant C.",
      fig: "thread",
      sym: "n"
    },
    A: {
      what: "Major diameter tolerance A from Table 3 for the tap diameter.",
      tip: "Read the row for the tap diameter range.",
      effect: "Widens the major diameter limits.",
      fig: "tolerance",
      sym: "A"
    },
    B: {
      what: "Amount over basic for the minimum pitch diameter, B, from Table 3.",
      tip: "Read the column for 36 or more, or 34 or fewer, threads per inch.",
      effect: "Raises both the major and pitch diameter limits.",
      fig: "tolerance",
      sym: "B"
    },
    Dt: {
      what: "Pitch diameter tolerance D from Table 3 for the tap diameter and series.",
      tip: "Use the NF-and-finer column for fine threads and for taps over 1½ in with 10 or more threads per inch.",
      effect: "Widens the pitch diameter limits.",
      fig: "tolerance",
      sym: "D_t"
    },
    PDm: {
      what: "Pitch diameter of the tap as measured.",
      tip: "Measure over three wires or with a thread micrometer, near the front of the full threads.",
      effect: "Only moves the pitch diameter check.",
      fig: "diameter",
      sym: "E_m"
    },
    Mm: {
      what: "Major diameter of the tap as measured over the thread crests.",
      tip: "Measure with a micrometer across the lands, behind the chamfer.",
      effect: "Only moves the major diameter check.",
      fig: "diameter",
      sym: "D_m"
    }
  },
  "silent-chain-width": {
    P: {
      what: "Power the silent chain drive must transmit.",
      tip: "Use the motor rating or the measured power of the driven machine.",
      effect: "The width needed grows in proportion.",
      fig: "power",
      sym: "P"
    },
    SF: {
      what: "Service factor for the driver and the driven machine.",
      tip: "Take it from the service factor table for the type of load and hours a day.",
      effect: "The width needed grows in proportion.",
      fig: "factor",
      sym: "SF"
    },
    rate: {
      what: "Power rating per 25.4 mm (1 in) of chain width from the rating table.",
      tip: "Read it for the chain pitch, small sprocket teeth and speed; 1 hp = 0.7457 kW.",
      effect: "The width needed falls as the rating rises.",
      fig: "power",
      sym: "P_in"
    },
    wChosen: {
      what: "Width of the chain you intend to use.",
      tip: "Choose from the standard widths for the pitch, next above the width needed.",
      effect: "Only moves the width check and the capacity reported.",
      fig: "length",
      sym: "w"
    },
    lube: {
      what: "Lubrication method the rating table assumes for this drive.",
      tip: "It is marked on the rating table beside the rating you use.",
      effect: "Sets the lubrication the drive needs.",
      fig: "choice",
      sym: "lube"
    },
    lubeHave: {
      what: "Lubrication method the drive will actually have in service.",
      tip: "Bath or disc lubrication needs an oil-tight casing; avoid greases.",
      effect: "Fails the drive if poorer than the rating assumes.",
      fig: "choice",
      sym: "lube_d"
    }
  }
});
