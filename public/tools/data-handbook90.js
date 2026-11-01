// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook90) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "journal-bearing-lubrication-analysis",
    "name": "Journal Bearing Lubrication Analysis (Pressure Parameter, Friction, Oil Flow, Temperature Rise, Film Thickness)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a pressure-fed plain journal bearing at a trial diametral clearance and an assumed oil temperature rise, what are the bearing pressure, pressure parameter, friction torque and power, the oil flow it needs and the flow it actually passes, the actual temperature rise and the minimum film thickness — and does the assumed rise hold or must I repeat with a new one?",
    "description": "One pass of the handbook’s journal bearing lubrication analysis: unit load pb = W ÷ (K l d) (K = 1 single oil hole, 2 central groove), clearance modulus m = cd ÷ d, bearing pressure parameter P = 6.9 (1000 m)² pb ÷ (Z N) and capacity number Cn = (l/d)² ÷ (60 P) for reading the eccentricity ratio and flow factor from the handbook figures, friction torque Tf = T r² Z N ÷ (6900 × 1000 m), friction horsepower Pf = K Tf N l ÷ 63,000, flow required QR = X Pf ÷ ta, hydrodynamic flow Q1 = N l cd q d ÷ 294, pressure flow Q2 = K′ ps cd³ d (1 + 1.5 ε²) ÷ (Z l), actual temperature rise t = X Pf ÷ (Q1 + Q2) and minimum film thickness ho = ½ cd (1 − ε), with the new assumed rise halfway between when the two differ by more than 5 °F.",
    "keywords": [
      "MAKEOS",
      "journal bearing lubrication analysis",
      "oil flow journal bearing",
      "pressure fed bearing",
      "temperature rise bearing",
      "minimum film thickness",
      "eccentricity ratio",
      "friction horsepower"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load on the bearing",
        "type": "number",
        "default": 26689,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Journal diameter d",
        "type": "number",
        "default": 58.42,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l",
        "label": "Bearing length l (half the length with a central groove)",
        "type": "number",
        "default": 48.26,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "feed",
        "label": "Oil feed",
        "type": "select",
        "default": "hole",
        "options": [
          [
            "hole",
            "Single oil hole (K = 1)"
          ],
          [
            "groove",
            "Central groove (K = 2)"
          ]
        ]
      },
      {
        "key": "n",
        "label": "Speed N",
        "type": "number",
        "default": 4800,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cd",
        "label": "Diametral clearance cd (operating)",
        "type": "number",
        "default": 0.0762,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ps",
        "label": "Oil supply pressure",
        "type": "number",
        "default": 206.84,
        "unit": "kPa",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ta",
        "label": "Assumed temperature rise of the oil",
        "type": "number",
        "default": 16.667,
        "unit": "°C",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_read_from_the_handbook_figures",
        "label": "Read from the handbook figures",
        "type": "heading"
      },
      {
        "key": "Z",
        "label": "Oil viscosity at inlet temperature + assumed rise",
        "type": "number",
        "default": 6.8,
        "unit": "cP",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Eccentricity ratio ε (Fig. 7, from P and l/d)",
        "type": "number",
        "default": 0.86,
        "unit": "",
        "min": 0.000001,
        "max": 0.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tp",
        "label": "Torque parameter T (Fig. 8 or 9)",
        "type": "number",
        "default": 1.53,
        "unit": "",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qf",
        "label": "Flow factor q (Fig. 10, from Cn)",
        "type": "number",
        "default": 1.48,
        "unit": "",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "X",
        "label": "Factor X (Table 5, or 0.1837 ÷ oil density × specific heat)",
        "type": "number",
        "default": 11.9,
        "unit": "",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "flat-plate-thrust-bearing-design",
    "name": "Flat Plate Thrust Bearing Design (Pad Layout, Unit Load, Friction Loss, Oil Flow, Chamfer Depth)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a flat plate (parallel surface) thrust bearing carrying an axial load, what outside diameter, pad width, number and length of pads, actual unit load and pitch-line speed result, what friction power and oil flow does it need for my temperature rise, and how deep must the feed chamfers be to pass that oil?",
    "description": "Flat plate thrust bearing design by the handbook procedure: outside diameter D2 = √(4W ÷ (π Kg p) + D1²), radial pad width a = (D2 − D1) ÷ 2, pitch-line circumference B = π(D2 − a), approximate number of pads B ÷ (a + s), pad length b = (B − i s) ÷ i, actual unit load W ÷ (i a b), pitch-line velocity U = B N ÷ 12, friction power Pf = i a b M with M read from the handbook’s friction-loss chart, oil flow Q = 42.4 Pf ÷ (c t), film flow QF = 1.5 × 10⁵ i V h³ ps ÷ Z2 (h taken as 0.002 in), flow per chamfer Qc = share × Q ÷ i, uncorrected flow Q0c = Qc ÷ κ with the kinetic energy factor κ from the chart, and chamfer depth g = ⁴√(Q0c l Z2 ÷ (4.74 × 10⁴ ps)).",
    "keywords": [
      "MAKEOS",
      "flat plate thrust bearing",
      "parallel thrust bearing",
      "thrust washer design",
      "thrust bearing oil flow",
      "chamfer depth",
      "pad layout",
      "thrust bearing friction"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Axial load",
        "type": "number",
        "default": 4003.4,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D1",
        "label": "Inside diameter D1",
        "type": "number",
        "default": 76.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pDesign",
        "label": "Design unit load p",
        "type": "number",
        "default": 517.11,
        "unit": "kPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kg",
        "label": "Fraction of the circumference occupied by pads Kg",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D2",
        "label": "Outside diameter chosen D2",
        "type": "number",
        "default": 139.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Oil groove width s",
        "type": "number",
        "default": 4.7625,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Number of pads chosen",
        "type": "number",
        "default": 10,
        "unit": "pads",
        "min": 2,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "n",
        "label": "Speed N",
        "type": "number",
        "default": 4000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_friction_and_oil",
        "label": "Friction and oil",
        "type": "heading"
      },
      {
        "key": "M",
        "label": "Friction loss M from the handbook chart (Fig. 3)",
        "type": "number",
        "default": 0.19,
        "unit": "hp/in²",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Oil density",
        "type": "number",
        "default": 880,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Oil specific heat",
        "type": "number",
        "default": 1.9953,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Oil temperature rise allowed",
        "type": "number",
        "default": 22.222,
        "unit": "°C",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Z2",
        "label": "Oil viscosity at the outlet temperature",
        "type": "number",
        "default": 9.6,
        "unit": "cP",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Film thickness for the film flow (handbook: 0.002 in)",
        "type": "number",
        "default": 0.0508,
        "unit": "mm",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ps",
        "label": "Oil supply pressure",
        "type": "number",
        "default": 206.84,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Share of the oil flow passed by the chamfers",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lc",
        "label": "Chamfer length l",
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
        "key": "kappa",
        "label": "Kinetic energy correction factor κ from the chart (Fig. 4)",
        "type": "number",
        "default": 0.44,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
