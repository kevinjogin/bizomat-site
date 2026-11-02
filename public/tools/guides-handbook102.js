// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook102).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "ba-thread-limits": {
    "purpose": "British Association threads by the handbook’s formulas: a 47½° thread with H = 1.13634p, depth h = 0.6p, crest and root radius r = 0.18083p and truncation s = 0.26817p, effective diameter D − h and minor diameter D − 2h, and the BS 93 tolerances: close class bolts (0 to 10 BA) major 0.15p, effective 0.08p + 0.02 and minor 0.16p + 0.04 mm; normal class bolts major 0.20p (0 to 10 BA) or 0.25p (11 to 16 BA), effective 0.10p + 0.025 and minor 0.20p + 0.05 mm with a 0.025 mm allowance for 0 to 10 BA; and nuts of all classes effective 0.12p + 0.03 and minor 0.375p mm.",
    "uses": [
      "Make or check BA screws for instruments and older British equipment",
      "Find the tapping and minor diameters of a BA thread",
      "Set the limits for close or normal class BA bolts and nuts"
    ],
    "users": [
      "Instrument makers",
      "Machinists",
      "Maintenance fitters"
    ],
    "inputs": {
      "n": "BA number of the thread, 0 being the largest size.",
      "p": "Pitch of the thread from the BA table, in millimetres.",
      "D": "Major diameter of the thread from the BA table, in millimetres.",
      "cls": "BS 93 class of the bolt; nuts have one class."
    },
    "outputs": [
      "Thread depth, radius and truncation",
      "Basic effective and minor diameters",
      "Bolt major, effective and minor limits",
      "Nut effective and minor limits"
    ],
    "method": [
      "H = 1.13634p; h = 0.6p; r = 0.18083p; s = 0.26817p; effective diameter E = D − h; minor diameter K = D − 2h.",
      "Bolts, close class (0 to 10 BA): tolerances major 0.15p, effective 0.08p + 0.02, minor 0.16p + 0.04 mm, no allowance.",
      "Bolts, normal class: major 0.20p (0 to 10 BA) or 0.25p (11 to 16 BA), effective 0.10p + 0.025, minor 0.20p + 0.05 mm, below an allowance of 0.025 mm for 0 to 10 BA.",
      "Nuts: from the basic sizes, effective + (0.12p + 0.03) and minor + 0.375p mm.",
      "Example: the bolt effective diameter is 5.375 to 5.25 mm."
    ],
    "limitations": [
      "Enter the pitch and major diameter of the BA size from the BA table; BS 93 is obsolescent and BA threads are no longer recommended for new designs.",
      "The close class is defined for 0 to 10 BA only.",
      "The nut major diameter has no maximum in the tolerance formulas.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "BA threads have rounded crests and roots like Whitworth threads but a smaller 47½° angle.",
      "Close class bolts have no allowance on the nut, for precision parts under stress."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1981–1982. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "steel-pipe-mass": {
    "purpose": "Nominal plain-end mass of wrought steel pipe by the ANSI/ASME B36.10M formulas the handbook gives: Wpe = 0.02466 (D − t) t kg/m with D rounded to 0.1 mm and t to 0.01 mm, and Wpe = 10.68 (D − t) t lb/ft with D and t rounded to 0.001 in, with the inside diameter, the mass of a length of pipe and, with the density of the contents you enter, the mass of the contents and of the full pipe.",
    "uses": [
      "Weigh a length of steel pipe for lifting or transport",
      "Find the mass of a pipe full of water or product for supports",
      "Check a pipe weight from its outside diameter and wall"
    ],
    "users": [
      "Piping designers",
      "Fabricators",
      "Riggers"
    ],
    "inputs": {
      "D": "Outside diameter of the pipe; for sizes up to 12 in it is larger than the nominal size.",
      "t": "Specified wall thickness of the pipe schedule.",
      "L": "Length of pipe to weigh.",
      "rho": "Density of the fluid in the pipe, from your data, or 0 for an empty pipe."
    },
    "outputs": [
      "Plain-end mass per metre and weight per foot",
      "Inside diameter",
      "Mass of the length of pipe",
      "Mass of the contents and of the full pipe"
    ],
    "method": [
      "SI: Wpe = 0.02466 (D − t) t kg/m, with D to the nearest 0.1 mm and t to the nearest 0.01 mm.",
      "Inch: Wpe = 10.68 (D − t) t lb/ft, with D and t to the nearest 0.001 in.",
      "Inside diameter = D − 2t; contents per metre = density × π (D − 2t)² ÷ 4.",
      "Masses of the length = per metre values × length.",
      "Example: the pipe has a plain-end mass of 5.4372 kg/m."
    ],
    "limitations": [
      "The formulas are for plain-end carbon steel pipe; threaded and coupled pipe and other steels weigh slightly more or less.",
      "Select the wall thickness for pressure by the governing code, then take its mass here.",
      "Add the mass of fittings, flanges, insulation and coatings separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The nominal weights in the pipe tables are calculated by this formula.",
      "Schedule 40 and Standard walls are the same up to 10 in nominal size."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3392. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ductile-regime-critical-depth": {
    "purpose": "The handbook’s fracture mechanics threshold for ductile-regime micromachining: critical depth of cut dc = A (E ÷ H)(Kc ÷ H)² with Young’s modulus E, surface fracture toughness Kc and surface microhardness H of the material and the constant A you enter (0.1 to 0.6 by the handbook), compared with your planned depth of cut, and the check that the depth is not less than about half the tool cutting edge radius, below which ploughing and fracture occur.",
    "uses": [
      "Set the depth of cut for diamond turning silicon, germanium or glass",
      "Compare brittle materials for ductile-regime machining",
      "Check the depth against the tool edge radius"
    ],
    "users": [
      "Precision machinists",
      "Manufacturing engineers",
      "Optics makers"
    ],
    "inputs": {
      "E": "Young’s modulus of the work material, for its crystal orientation where known.",
      "Kc": "Surface fracture toughness of the work material from tests or data.",
      "H": "Surface microhardness (Knoop or Vickers) of the work material.",
      "A": "Constant of the threshold equation; the handbook gives 0.1 to 0.6.",
      "ap": "Depth of cut you intend to take.",
      "re": "Cutting edge radius of the diamond or other tool."
    },
    "outputs": [
      "Critical depth of cut",
      "Ratio of planned to critical depth",
      "Whether the cut is in the ductile regime",
      "Edge radius check"
    ],
    "method": [
      "dc = A (E ÷ H)(Kc ÷ H)² with E and H in the same units and Kc ÷ H in √m.",
      "The cut is in the ductile regime when the depth of cut is below dc.",
      "Ploughing and fracture occur when the depth is less than about half the cutting edge radius.",
      "Example: the critical depth of cut is 0.009072 µm."
    ],
    "limitations": [
      "A varies with the uncertainty of the measured properties; E, Kc and H depend on crystal orientation, surface condition and cutting fluid.",
      "True ductile-regime cutting happens only along favourable crystal orientations.",
      "Confirm the depth with test cuts; the threshold is an estimate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger toughness or a lower hardness raises the critical depth.",
      "Cutting fluid changes the surface properties and so the critical depth, as the handbook shows for germanium."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1109–1110. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
