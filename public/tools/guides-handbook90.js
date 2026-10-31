// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook90).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "journal-bearing-lubrication-analysis": {
    "purpose": "One pass of the handbook’s journal bearing lubrication analysis: unit load pb = W ÷ (K l d) (K = 1 single oil hole, 2 central groove), clearance modulus m = cd ÷ d, bearing pressure parameter P = 6.9 (1000 m)² pb ÷ (Z N) and capacity number Cn = (l/d)² ÷ (60 P) for reading the eccentricity ratio and flow factor from the handbook figures, friction torque Tf = T r² Z N ÷ (6900 × 1000 m), friction horsepower Pf = K Tf N l ÷ 63,000, flow required QR = X Pf ÷ ta, hydrodynamic flow Q1 = N l cd q d ÷ 294, pressure flow Q2 = K′ ps cd³ d (1 + 1.5 ε²) ÷ (Z l), actual temperature rise t = X Pf ÷ (Q1 + Q2) and minimum film thickness ho = ½ cd (1 − ε), with the new assumed rise halfway between when the two differ by more than 5 °F.",
    "uses": [
      "Check a pressure-fed sleeve bearing at a trial clearance",
      "Find the oil flow and temperature rise for a bearing design",
      "Plot film thickness, temperature rise, friction and flow against clearance"
    ],
    "users": [
      "Machine designers",
      "Rotating equipment engineers",
      "Lubrication engineers"
    ],
    "inputs": {
      "W": "Radial load carried by the bearing.",
      "d": "Diameter of the journal.",
      "l": "Bearing length as the handbook defines it: the whole length with a single oil hole, half the length with a central circumferential groove.",
      "feed": "How the oil is fed: a single hole or a central groove; it sets the constants K.",
      "n": "Shaft speed.",
      "cd": "Diametral clearance at operating temperature, chosen on a trial basis (the handbook’s Fig. 6 suggests ranges by diameter and speed).",
      "ps": "Oil supply pressure at the bearing.",
      "ta": "Assumed rise of oil temperature through the bearing; the handbook starts with 20 °F (11.1 °C).",
      "Z": "Absolute viscosity of the oil in centipoises at the inlet temperature plus the assumed rise, from the oil’s viscosity–temperature data.",
      "eps": "Eccentricity ratio read from the handbook’s Fig. 7 using the pressure parameter P and l/d shown in the results.",
      "Tp": "Torque parameter read from the handbook’s Fig. 8 or 9 using 1/(1 − ε) and l/d.",
      "qf": "Flow factor read from the handbook’s Fig. 10 using the capacity number Cn shown in the results.",
      "X": "Factor X for mineral oil from the handbook’s Table 5 (about 12), or 0.1837 ÷ (density in lb/in³ × specific heat in Btu/lb °F)."
    },
    "outputs": [
      "Unit load, clearance modulus and l/d",
      "Pressure parameter P and capacity number Cn (to read the figures)",
      "Friction torque and friction power",
      "Oil flow required and actual (hydrodynamic and pressure flow)",
      "Actual temperature rise and the next assumed rise",
      "Minimum film thickness against the handbook minimum"
    ],
    "method": [
      "pb = W ÷ (K l d) psi; m = cd ÷ d; P = 6.9 (1000 m)² pb ÷ (Z N); Cn = (l/d)² ÷ (60 P).",
      "Tf = T r² Z N ÷ (6900 × 1000 m) in·lb per inch; Pf = K Tf N l ÷ 63,000 hp.",
      "QR = X Pf ÷ ta; Q1 = N l cd q d ÷ 294 gpm; Q2 = K′ ps cd³ d (1 + 1.5 ε²) ÷ (Z l) gpm with K′ = 1.64 × 10⁵ (hole) or 2.35 × 10⁵ (groove).",
      "t = X Pf ÷ (Q1 + Q2); if t and ta differ by more than 5 °F, repeat with ta halfway between.",
      "ho = ½ cd (1 − ε); handbook minimum 200 µin below 1 in diameter, 500 µin for 1 to 4 in, 750 µin larger; temperature rise up to about 40 °F.",
      "Inputs are converted to inches, pounds, psi and °F for the handbook constants; results are shown in SI with the inch values.",
      "Example: the bearing passes 1.388 L/min and the oil rises 19.154 °C against 16.667 °C assumed; the minimum film is 0.005334 mm."
    ],
    "limitations": [
      "Eccentricity ratio, torque parameter and flow factor come from the handbook’s design charts; read them at the P and Cn shown and repeat until the temperature rise settles.",
      "Repeat the analysis for several clearances to choose a working clearance range, as the handbook describes.",
      "For full (360°) bearings in steady load; misalignment above about 0.0003 in per inch of length reduces the film.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the actual rise exceeds the assumed rise, the oil runs thinner than assumed: repeat with the new assumed rise.",
      "A larger clearance passes more oil and runs cooler but thins the film."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2328–2338. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flat-plate-thrust-bearing-design": {
    "purpose": "Flat plate thrust bearing design by the handbook procedure: outside diameter D2 = √(4W ÷ (π Kg p) + D1²), radial pad width a = (D2 − D1) ÷ 2, pitch-line circumference B = π(D2 − a), approximate number of pads B ÷ (a + s), pad length b = (B − i s) ÷ i, actual unit load W ÷ (i a b), pitch-line velocity U = B N ÷ 12, friction power Pf = i a b M with M read from the handbook’s friction-loss chart, oil flow Q = 42.4 Pf ÷ (c t), film flow QF = 1.5 × 10⁵ i V h³ ps ÷ Z2 (h taken as 0.002 in), flow per chamfer Qc = share × Q ÷ i, uncorrected flow Q0c = Qc ÷ κ with the kinetic energy factor κ from the chart, and chamfer depth g = ⁴√(Q0c l Z2 ÷ (4.74 × 10⁴ ps)).",
    "uses": [
      "Lay out a parallel-surface thrust bearing for a light or occasional load",
      "Find the oil flow and chamfer size that keep the temperature rise acceptable",
      "Check the unit load of an existing thrust face"
    ],
    "users": [
      "Machine designers",
      "Pump and gearbox engineers",
      "Students"
    ],
    "inputs": {
      "W": "Axial (thrust) load on the bearing.",
      "D1": "Inside diameter of the thrust face, set by the shaft and its clearance.",
      "pDesign": "Unit load the bearing is designed for; the handbook gives about 75 psi (517 kPa) normal and 150 psi (1034 kPa) maximum for parallel surface bearings.",
      "Kg": "Fraction of the circumference occupied by pads; usually 0.8.",
      "D2": "Outside diameter you choose, at least the diameter required (often rounded up).",
      "s": "Width of each oil groove between pads.",
      "i": "Number of pads you choose, near the approximate number shown and usually even.",
      "n": "Shaft speed.",
      "M": "Friction horsepower per square inch of pad read from the handbook’s Fig. 3 at the pitch-line speed and unit load shown.",
      "rho": "Density of the oil.",
      "cp": "Specific heat of the oil.",
      "dT": "Temperature rise of the oil you allow; the handbook gives 50 °F (27.8 °C) as an acceptable maximum.",
      "Z2": "Oil viscosity in centipoises at the outlet temperature (inlet plus the rise).",
      "h": "Film thickness used for the film flow; the handbook says to use 0.002 in because it cannot be calculated for this bearing.",
      "ps": "Oil supply pressure.",
      "share": "Share of the required oil flow to pass through the chamfers; the handbook recommends at least one-half.",
      "lc": "Length of each feed chamfer.",
      "kappa": "Kinetic energy correction factor read from the handbook’s Fig. 4 at Z2 × l and the flow per chamfer."
    },
    "outputs": [
      "Outside diameter required",
      "Pad width, pitch-line circumference, approximate number of pads and pad length",
      "Actual unit load and pitch-line velocity",
      "Friction power and oil flow required",
      "Film flow, flow per chamfer and chamfer depth"
    ],
    "method": [
      "D2 = √(4W ÷ (π Kg p) + D1²); a = (D2 − D1) ÷ 2; B = π(D2 − a); approximate pads B ÷ (a + s).",
      "b = (B − i s) ÷ i; p = W ÷ (i a b); U = B N ÷ 12 ft/min.",
      "Pf = i a b M hp; Q = 42.4 Pf ÷ (c t) gpm with c in Btu/gal °F.",
      "QF = 1.5 × 10⁵ i (a/b) h³ ps ÷ Z2 gpm; Qc = share × Q ÷ i; Q0c = Qc ÷ κ; g = ⁴√(Q0c l Z2 ÷ (4.74 × 10⁴ ps)) in.",
      "Inputs are converted to inches, pounds, psi and °F for the handbook constants; results are shown in SI with the inch values.",
      "Example: 10 pads of 31.75 × 29.151 mm carry 432.55 kPa; the bearing needs 3.125 L/min and chamfers 0.50667 mm deep."
    ],
    "limitations": [
      "Friction loss M and the kinetic energy factor κ come from the handbook’s charts; read them at the pitch-line speed, unit load and flow shown.",
      "The film thickness of a flat plate bearing cannot be calculated; the film flow uses the handbook’s 0.002 in.",
      "Flat plate bearings suit light or occasional loads; use step, tapered land or tilting pad bearings for higher loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Most of the oil must pass the chamfers because the film flow is small.",
      "A deeper chamfer passes more oil at the same supply pressure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2338–2344. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
