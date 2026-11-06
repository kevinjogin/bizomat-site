// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook93) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "spur-gear-profile-checker",
    "name": "Spur Gear Profile Checker Settings (Significant Diameters, Roll Angles, TIF, HPSTC, Undercut)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For a pair of spur gears at standard centre distance, where are the true involute form, contact, lowest and highest single-tooth-contact diameters on each gear, what roll angles do I set on the involute checker, is the hob tip radius allowed and is any tooth undercut?",
    "description": "Every significant diameter of a spur gear pair at standard centre distance by the handbook’s three-step and two-step formulas: contact diameter (cos A = N cos φ ÷ Do P, tan b = tan φ − (N ÷ n)(tan A − tan φ), dc = n cos φ ÷ P cos b), contact ratio by three formulas, lowest point of single tooth contact (tan c = tan a − 2π ÷ n), highest point (tan d = tan b + 2π ÷ n), the maximum hob tip radius rc = (0.785398 cos φ − b sin φ) ÷ (1 − sin φ), the undercut limit (b − rc) ÷ sin φ + rc ≤ 0.5 n sin φ, the true involute form diameter tan e = tan φ − (4 ÷ n)[(b − rc) ÷ sin 2φ + rc ÷ 2 cos φ], the base radius and the roll angle at each point (tan × 57.2958) for the involute checker.",
    "keywords": [
      "MAKEOS",
      "profile checker settings",
      "involute checker roll angle",
      "true involute form diameter",
      "TIF diameter",
      "highest point of single tooth contact",
      "HPSTC",
      "gear undercut limit hob",
      "maximum hob tip radius"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module m (25.4 ÷ P)",
        "type": "number",
        "default": 2.54,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Pressure angle φ",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Teeth in pinion n",
        "type": "number",
        "default": 23,
        "unit": "teeth",
        "min": 5,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "dO",
        "label": "Outside diameter of pinion do",
        "type": "number",
        "default": 63.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Teeth in gear N",
        "type": "number",
        "default": 31,
        "unit": "teeth",
        "min": 5,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "DO",
        "label": "Outside diameter of gear Do",
        "type": "number",
        "default": 83.82,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tooth_system_and_hob",
        "label": "Tooth system and hob",
        "type": "heading"
      },
      {
        "key": "b",
        "label": "Dedendum constant b (dedendum = b ÷ P)",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 0.000001,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rc",
        "label": "Hob tip radius constant rc (radius = rc ÷ P)",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mfMin",
        "label": "Least contact ratio you accept",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spur-gears-for-given-centre-distance",
    "name": "Spur Gears Cut for a Given Centre Distance and Ratio (Operating Pitch, Tooth Thickness, Root and Outside Diameters)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "When no standard pitch fits the centre distance, how do I cut a pair of spur gears with a standard hob to run at that centre distance: what operating pitch and pressure angle result, and what tooth thicknesses, root diameters and outside diameters do I cut?",
    "description": "Spur gears of standard diametral pitch P and pressure angle φ redesigned to run at a specified centre distance C1 by the handbook procedure: operating pitch P1 = (NP + NG) ÷ 2 C1, operating pressure angle φ1 = arccos (P1 cos φ ÷ P), operating pitch and base diameters, basic tooth thickness 1.5708 ÷ P1 at the operating pitch circle, tooth thicknesses at the standard pitch circle t = (N ÷ P)(1.5708 ÷ N + inv φ1 − inv φ), dedendums b1 = bc − (t − 1.5708 ÷ P) ÷ 2 tan φ for a hob of addendum bc, root diameters N ÷ P − 2 b1 and outside diameters 2 C1 − (mating root diameter) − 2 (bc − 1 ÷ P).",
    "keywords": [
      "MAKEOS",
      "gears for given centre distance",
      "non-standard centre distance spur gears",
      "operating pressure angle",
      "operating pitch diameter",
      "tooth thickness involute function",
      "hob addendum root diameter"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module of the hob m (25.4 ÷ P)",
        "type": "number",
        "default": 3.175,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Pressure angle of the hob φ",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Np",
        "label": "Teeth in pinion NP",
        "type": "number",
        "default": 28,
        "unit": "teeth",
        "min": 5,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Ng",
        "label": "Teeth in gear NG",
        "type": "number",
        "default": 88,
        "unit": "teeth",
        "min": 5,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C1",
        "label": "Centre distance required C1",
        "type": "number",
        "default": 190.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bc",
        "label": "Addendum of the hob bc",
        "type": "number",
        "default": 4.2926,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_operating_pressure_angle_range",
        "label": "Operating pressure angle range",
        "type": "heading"
      },
      {
        "key": "phiMin",
        "label": "Smallest operating pressure angle you accept",
        "type": "number",
        "default": 18,
        "unit": "°",
        "min": 1,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phiMax",
        "label": "Largest operating pressure angle you accept",
        "type": "number",
        "default": 25,
        "unit": "°",
        "min": 1,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "enlarged-spur-pinion-mesh",
    "name": "Enlarged Spur Pinion Mesh (Long and Short Addendum or Enlarged Centre Distance, Tight-Mesh Centre Distance)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "When I enlarge a spur pinion to avoid undercut, what tooth thicknesses and outside diameters do the pinion and its mating gear take, at what centre distance will they mesh tight, and how few teeth can the reduced gear have?",
    "description": "Enlarged spur pinions by the handbook formulas, in the standard centre-distance (long and short addendum) system or the enlarged centre-distance system: outside diameters, arc tooth thickness at the standard pitch circle t = p ÷ 2 + e tan φ for the enlarged pinion and p ÷ 2 − e tan φ for a reduced gear, the centre distance for no backlash from inv φ1 = inv φ + (P (t + T) − π) ÷ (n + N) and C1 = C cos φ ÷ cos φ1, the smallest gear teeth without undercut N = 2 a csc² φ, and the smallest teeth of standard proportions a hob cuts without undercut, Nmin = 2 P csc² φ [aH − rt (1 − sin φ)].",
    "keywords": [
      "MAKEOS",
      "enlarged pinion",
      "long and short addendum",
      "standard centre distance system",
      "enlarged centre distance system",
      "centre distance for no backlash",
      "minimum teeth to avoid undercut"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module m (25.4 ÷ P)",
        "type": "number",
        "default": 0.254,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Pressure angle φ",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Teeth in pinion n",
        "type": "number",
        "default": 10,
        "unit": "teeth",
        "min": 3,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Nt",
        "label": "Teeth in gear N",
        "type": "number",
        "default": 30,
        "unit": "teeth",
        "min": 3,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "ePin",
        "label": "Enlargement of pinion outside diameter e",
        "type": "number",
        "default": 0.21089,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eGear",
        "label": "Reduction of gear outside diameter (0 = standard gear)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_hob_for_the_undercut_check",
        "label": "Hob for the undercut check",
        "type": "heading"
      },
      {
        "key": "aH",
        "label": "Addendum of the hob aH",
        "type": "number",
        "default": 0.3175,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rt",
        "label": "Tip radius of the hob rt",
        "type": "number",
        "default": 0.0762,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-shaving-stock-check",
    "name": "Gear Shaving Stock Check (Centre Distance Method)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "I have meshed a preshaved gear tight with a gear of standard tooth thickness and measured how far the centre distance exceeds standard: how much stock is left on the teeth for shaving, and is it within the allowance I want?",
    "description": "Stock left for shaving by the handbook’s centre-distance method: the preshaved gear is meshed without backlash against a gear of standard tooth thickness and the increase d in centre distance over standard is measured; the total thickness over standard is t2 = 2 tan φ × d, half on each side of the tooth, checked here also by the exact involute relation (inv φ1 = inv φ + (t2 ÷ m) ÷ (n + N) with cos φ1 = C cos φ ÷ (C + d)) and against your shaving allowance.",
    "keywords": [
      "MAKEOS",
      "gear shaving stock",
      "shaving allowance",
      "preshaved gear",
      "centre distance method",
      "tooth thickness over standard",
      "tight mesh centre distance"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module m (25.4 ÷ P)",
        "type": "number",
        "default": 3.175,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Pressure angle φ",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Teeth in preshaved gear",
        "type": "number",
        "default": 30,
        "unit": "teeth",
        "min": 5,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Nt",
        "label": "Teeth in standard master gear",
        "type": "number",
        "default": 40,
        "unit": "teeth",
        "min": 5,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d",
        "label": "Centre distance over standard, meshed tight d",
        "type": "number",
        "default": 0.087,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_shaving_allowance_total_tooth_thickness_",
        "label": "Shaving allowance (total tooth thickness)",
        "type": "heading"
      },
      {
        "key": "sMin",
        "label": "Least stock you want",
        "type": "number",
        "default": 0.0508,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sMax",
        "label": "Most stock you want",
        "type": "number",
        "default": 0.0762,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
