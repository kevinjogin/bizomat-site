// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook102) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "ba-thread-limits",
    "name": "British Association (BA) Thread Basic Sizes and Limits (BS 93)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a British Association (BA) screw thread of my pitch and major diameter, what are the basic thread form dimensions, and what are the bolt and nut limits of size in the close or normal class of BS 93?",
    "description": "British Association threads by the handbook’s formulas: a 47½° thread with H = 1.13634p, depth h = 0.6p, crest and root radius r = 0.18083p and truncation s = 0.26817p, effective diameter D − h and minor diameter D − 2h, and the BS 93 tolerances: close class bolts (0 to 10 BA) major 0.15p, effective 0.08p + 0.02 and minor 0.16p + 0.04 mm; normal class bolts major 0.20p (0 to 10 BA) or 0.25p (11 to 16 BA), effective 0.10p + 0.025 and minor 0.20p + 0.05 mm with a 0.025 mm allowance for 0 to 10 BA; and nuts of all classes effective 0.12p + 0.03 and minor 0.375p mm.",
    "keywords": [
      "MAKEOS",
      "BA thread dimensions",
      "British Association thread",
      "BS 93 tolerances",
      "BA screw limits",
      "47.5 degree thread",
      "instrument screw thread"
    ],
    "fields": [
      {
        "key": "n",
        "label": "BA size number",
        "type": "number",
        "default": 0,
        "unit": "BA",
        "min": 0,
        "max": 25,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "p",
        "label": "Pitch p",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Major diameter D",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cls",
        "label": "Bolt class",
        "type": "select",
        "default": "normal",
        "options": [
          [
            "normal",
            "Normal class (general use)"
          ],
          [
            "close",
            "Close class (precision parts, 0 to 10 BA)"
          ]
        ]
      }
    ]
  },
  {
    "id": "steel-pipe-mass",
    "name": "Wrought Steel Pipe Plain-End Mass (ASME B36.10M)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What is the plain-end mass per metre (and weight per foot) of a welded or seamless wrought steel pipe of my outside diameter and wall thickness, and what do a length of it and its contents weigh?",
    "description": "Nominal plain-end mass of wrought steel pipe by the ANSI/ASME B36.10M formulas the handbook gives: Wpe = 0.02466 (D − t) t kg/m with D rounded to 0.1 mm and t to 0.01 mm, and Wpe = 10.68 (D − t) t lb/ft with D and t rounded to 0.001 in, with the inside diameter, the mass of a length of pipe and, with the density of the contents you enter, the mass of the contents and of the full pipe.",
    "keywords": [
      "MAKEOS",
      "steel pipe weight per metre",
      "pipe plain end mass",
      "B36.10M pipe weight formula",
      "pipe weight per foot",
      "schedule pipe mass",
      "full pipe weight"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Outside diameter D",
        "type": "number",
        "default": 60.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Wall thickness t",
        "type": "number",
        "default": 3.91,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length of pipe",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density of the contents (0 = empty)",
        "type": "number",
        "default": 0,
        "unit": "kg/m³",
        "min": 0,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ductile-regime-critical-depth",
    "name": "Ductile-Regime Critical Depth of Cut for Brittle Materials",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Below what depth of cut will a brittle material such as silicon, germanium, glass or a ceramic machine in the ductile regime instead of fracturing, and is my planned depth below it and above the depth at which the tool edge only ploughs?",
    "description": "The handbook’s fracture mechanics threshold for ductile-regime micromachining: critical depth of cut dc = A (E ÷ H)(Kc ÷ H)² with Young’s modulus E, surface fracture toughness Kc and surface microhardness H of the material and the constant A you enter (0.1 to 0.6 by the handbook), compared with your planned depth of cut, and the check that the depth is not less than about half the tool cutting edge radius, below which ploughing and fracture occur.",
    "keywords": [
      "MAKEOS",
      "ductile regime machining",
      "critical depth of cut",
      "brittle material micromachining",
      "silicon diamond turning depth",
      "fracture toughness hardness depth",
      "ductile mode cutting"
    ],
    "fields": [
      {
        "key": "E",
        "label": "Young’s modulus E",
        "type": "number",
        "default": 168,
        "unit": "GPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kc",
        "label": "Surface fracture toughness Kc",
        "type": "number",
        "default": 0.6,
        "unit": "MPa·√m",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "H",
        "label": "Surface microhardness H",
        "type": "number",
        "default": 10,
        "unit": "GPa",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Constant A",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Planned depth of cut",
        "type": "number",
        "default": 0.005,
        "unit": "µm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "re",
        "label": "Tool cutting edge radius (0 = no check)",
        "type": "number",
        "default": 0.008,
        "unit": "µm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
