// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook91).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "step-thrust-bearing-design": {
    "purpose": "Step thrust bearing design by the handbook procedure, with its optimum proportions a = b, b2 = 1.2 b1 and step depth e = 0.7 h: outside diameter for a design unit load D2 = √(4W ÷ (π Kg p) + D1²), radial pad width a = (D2 − D1) ÷ 2, pitch-line circumference B = π(D1 + D2) ÷ 2, approximate number of pads B ÷ (a + s), pad length b = B ÷ i − s, pitch-line velocity U = B N ÷ 12, film thickness h = √(2.09 × 10⁻⁹ i a³ U Z ÷ W), friction power Pf = 7.35 × 10⁻¹³ i a² U² Z ÷ h, step position b2 = 1.2 b ÷ 2.2, hydrodynamic oil flow Q = 6.65 × 10⁻⁴ i a h U and temperature rise Δt = 42.4 Pf ÷ (c Q). It needs no chart readings.",
    "uses": [
      "Design a small positioning thrust face for a shaft",
      "Check the film thickness and temperature rise of a step thrust bearing",
      "Size the step depth and position on each pad"
    ],
    "users": [
      "Machine designers",
      "Pump, compressor and turbine engineers",
      "Students"
    ],
    "inputs": {
      "W": "Axial (thrust) load on the bearing.",
      "D1": "Inside diameter of the thrust face, set by the shaft and its clearance.",
      "D2": "Outside diameter you choose; for a lightly loaded positioning bearing it is chosen for convenient proportions.",
      "pDesign": "Unit load used to find the outside diameter required; the handbook gives 200 psi (1379 kPa) normal and 500 psi maximum for step bearings.",
      "Kg": "Fraction of the circumference occupied by pads; usually 0.8.",
      "s": "Width of each oil groove; the handbook takes 0.062 in (1.6 mm) as the minimum.",
      "i": "Number of pads, the even number nearest the approximate number shown.",
      "n": "Shaft speed.",
      "Z": "Oil viscosity in centipoises at the operating temperature.",
      "rho": "Density of the oil.",
      "cp": "Specific heat of the oil.",
      "dTmax": "Largest temperature rise of the oil you accept; the handbook gives 50 °F (27.8 °C) as an acceptable maximum for thrust bearings."
    },
    "outputs": [
      "Outside diameter required for the design unit load",
      "Pad width, pitch circumference, approximate number of pads and pad length",
      "Pitch-line velocity and actual unit load",
      "Film thickness and step depth",
      "Step position from the leading edge",
      "Friction power, oil flow and temperature rise"
    ],
    "method": [
      "D2 = √(4W ÷ (π Kg p) + D1²); a = (D2 − D1) ÷ 2; B = π(D1 + D2) ÷ 2; approximate pads B ÷ (a + s); b = B ÷ i − s; U = B N ÷ 12 ft/min.",
      "h = √(2.09 × 10⁻⁹ i a³ U Z ÷ W) in; step depth e = 0.7 h; step position b2 = 1.2 b ÷ 2.2 from the leading edge.",
      "Pf = 7.35 × 10⁻¹³ i a² U² Z ÷ h hp; Q = 6.65 × 10⁻⁴ i a h U gpm; Δt = 42.4 Pf ÷ (c Q) °F with c in Btu/gal °F.",
      "Inputs are converted to inches, pounds and °F for the handbook constants; results are shown in SI with the inch values.",
      "Example: 6 pads on 25.4 × 76.2 mm run with a 0.14553 mm film and a 0.10187 mm step, losing 0.098346 kW and raising the oil 15.267 °C."
    ],
    "limitations": [
      "The procedure assumes the optimum proportions a = b, b2 = 1.2 b1 and e = 0.7 h.",
      "If the oil flow is too small (temperature rise too high), add feed chamfers as in the flat plate thrust bearing design.",
      "Step bearings become sensitive to alignment as their size increases.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The film thickens with speed and viscosity and thins with load.",
      "The step depth is fixed by the film: machine it to about 0.7 h."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2339, 2345–2347. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tapered-land-thrust-bearing-design": {
    "purpose": "Tapered land thrust bearing design by the handbook procedure: outside diameter D2 = √(4W ÷ (π Kg p) + D1²), radial pad width a = (D2 − D1) ÷ 2, pitch-line circumference B = π(D1 + D2) ÷ 2, approximate pads B ÷ (a + s), pad length b = (B − i s) ÷ i, unit load p = W ÷ (i a b), pitch-line velocity U = B N ÷ 12, leakage factor YL = b ÷ (1 + π² b² ÷ 12 a²), film-thickness factor K = 5.75 × 10⁶ p ÷ (U YL Z) for reading the film thickness from the chart, friction power Pf = 8.79 × 10⁻¹³ i a b J U² Z with J from the chart, oil flow required Q = 42.4 Pf ÷ (c Δt), shape factor YS = 8 a b ÷ (D2² − D1²) and film flow QF = 8.9 × 10⁻⁴ i δ2 D2³ N YG YS² ÷ (D2 − D1) with the oil-flow factor YG from the chart.",
    "uses": [
      "Design a tapered land thrust bearing for a turbine, compressor or pump",
      "Check whether the film passes enough oil or chamfers are needed",
      "Estimate friction loss and oil flow for the lubrication system"
    ],
    "users": [
      "Machine designers",
      "Pump, compressor and turbine engineers",
      "Students"
    ],
    "inputs": {
      "W": "Axial (thrust) load on the bearing.",
      "D1": "Inside diameter of the thrust face, set by the shaft and its clearance.",
      "D2": "Outside diameter you choose, near the diameter required.",
      "pDesign": "Unit load used to find the outside diameter; the handbook gives 200 psi (1379 kPa) normal and 500 psi (3447 kPa) maximum for tapered land bearings.",
      "Kg": "Fraction of the circumference occupied by pads; 0.8 or 0.9.",
      "s": "Width of each oil groove between pads.",
      "i": "Number of pads, the even number nearest the approximate number shown.",
      "n": "Shaft speed.",
      "d2": "Taper depth at the outside diameter from the handbook’s Table 2 for the pad size.",
      "Z": "Oil viscosity in centipoises at the outlet temperature (inlet plus the allowed rise).",
      "rho": "Density of the oil.",
      "cp": "Specific heat of the oil.",
      "dT": "Oil temperature rise you allow; the handbook gives 50 °F (27.8 °C) as an acceptable maximum.",
      "h": "Minimum film thickness read from the handbook’s Fig. 9 using the factor K shown and the tapers; about 0.001 in for small and 0.002 in for large or fast bearings.",
      "J": "Power-loss coefficient read from the handbook’s Fig. 10 at the film thickness.",
      "YG": "Oil-flow factor read from the handbook’s Fig. 11 using the shape factor YS and D1/D2 shown.",
      "hAccept": "Least minimum film thickness you accept; the handbook suggests about 0.001 in (0.025 mm) for small bearings and 0.002 in (0.051 mm) for larger and high-speed bearings."
    },
    "outputs": [
      "Outside diameter required",
      "Pad width, pitch circumference, approximate pads and pad length",
      "Unit load and pitch-line velocity",
      "Leakage factor YL and film-thickness factor K",
      "Friction power and oil flow required",
      "Shape factor YS and the film flow passed"
    ],
    "method": [
      "D2 = √(4W ÷ (π Kg p) + D1²); a = (D2 − D1) ÷ 2; B = π(D1 + D2) ÷ 2; approximate pads B ÷ (a + s); b = (B − i s) ÷ i; p = W ÷ (i a b); U = B N ÷ 12.",
      "YL = b ÷ (1 + π² b² ÷ 12 a²); K = 5.75 × 10⁶ p ÷ (U YL Z).",
      "Pf = 8.79 × 10⁻¹³ i a b J U² Z hp; Q = 42.4 Pf ÷ (c Δt) gpm.",
      "YS = 8 a b ÷ (D2² − D1²); QF = 8.9 × 10⁻⁴ i δ2 D2³ N YG YS² ÷ (D2 − D1) gpm; chamfers or more taper are needed when QF is less than Q.",
      "Inputs are converted to inches, pounds and °F for the handbook constants; results are shown in SI with the inch values.",
      "Example: 6 pads 127 × 146.89 mm carry 2,781.8 kPa; the bearing loses 68.076 kW and needs 83.729 L/min against 101.31 L/min passed by the film."
    ],
    "limitations": [
      "Film thickness h, the power-loss coefficient J and the oil-flow factor YG come from the handbook’s charts; read them at the K, h, YS and D1/D2 shown.",
      "The tapers come from the handbook’s Table 2 for the pad size; the taper usually covers 80 % of the pad length.",
      "Tapered land bearings need good alignment as their size increases.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the film passes less oil than the heat needs, increase the taper or add feed chamfers.",
      "A higher viscosity or speed raises the film thickness but also the friction loss."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2339, 2347–2352. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tilting-pad-thrust-bearing-design": {
    "purpose": "Tilting pad thrust bearing design by the handbook procedure: outside diameter D2 = √(4W ÷ (π Kg p) + D1²) (or the largest available), radial pad width a = (D2 − D1) ÷ 2, pitch-line circumference B = π(D1 + D2) ÷ 2, number of pads ≈ B Kg ÷ a, pad length ≈ B Kg ÷ i, pitch-line velocity U = B N ÷ 12, unit load p = W ÷ (i a b), operating number O = 1.45 × 10⁻⁷ Z2 U ÷ (5 p b) for reading the dimensionless film thickness α from the chart, minimum film hmin = α b, friction power Pf = f W U ÷ 33,000 with the friction coefficient f from the chart, oil flow Q = 0.0591 α i a b U and temperature rise Δt = 0.0217 f p ÷ (α c).",
    "uses": [
      "Design a tilting pad thrust bearing for a turbine, compressor or large pump",
      "Check the film and temperature rise of an existing pivoted pad bearing",
      "Estimate friction loss and oil flow for the lubrication system"
    ],
    "users": [
      "Machine designers",
      "Pump, compressor and turbine engineers",
      "Students"
    ],
    "inputs": {
      "W": "Axial (thrust) load on the bearing.",
      "D1": "Inside diameter of the thrust face, set by the shaft and its clearance.",
      "D2": "Outside diameter of the pads, from the design unit load or the largest that fits.",
      "pDesign": "Unit load used to find the outside diameter required; the handbook gives 200 psi normal and 500 psi (3447 kPa) maximum for tilting pad bearings.",
      "Kg": "Fraction of the circumference occupied by pads; 0.8 for tilting pad bearings.",
      "i": "Number of pads, the even number nearest the estimate shown.",
      "b": "Pad length on the pitch line you choose, near the estimate B Kg ÷ i.",
      "n": "Shaft speed.",
      "Z2": "Oil viscosity in centipoises at the outlet temperature (inlet plus the assumed rise).",
      "rho": "Density of the oil.",
      "cp": "Specific heat of the oil.",
      "dTmax": "Largest temperature rise of the oil you accept; the handbook gives 50 °F (27.8 °C) as an acceptable maximum.",
      "alpha": "Dimensionless film thickness factor α read from the handbook’s Fig. 13 at the operating number shown, in thousandths (for example 0.30 for 0.30 × 10⁻³).",
      "f": "Coefficient of friction read from the handbook’s Fig. 14 at the film thickness factor.",
      "hAccept": "Least minimum film thickness you accept; the handbook suggests about 0.001 in (0.025 mm) for small bearings and 0.002 in (0.051 mm) for larger and high-speed bearings."
    },
    "outputs": [
      "Outside diameter required, pad width and pitch circumference",
      "Estimated number and length of pads",
      "Pitch-line velocity and unit load",
      "Operating number O",
      "Minimum film thickness",
      "Friction power, oil flow and temperature rise"
    ],
    "method": [
      "D2 = √(4W ÷ (π Kg p) + D1²); a = (D2 − D1) ÷ 2; B = π(D1 + D2) ÷ 2; i ≈ B Kg ÷ a; b ≈ B Kg ÷ i; U = B N ÷ 12; p = W ÷ (i a b).",
      "O = 1.45 × 10⁻⁷ Z2 U ÷ (5 p b); α from the chart; hmin = α b.",
      "Pf = f W U ÷ 33,000 hp; Q = 0.0591 α i a b U gpm; Δt = 0.0217 f p ÷ (α c) °F with c in Btu/gal °F.",
      "Inputs are converted to inches, pounds and °F for the handbook constants; results are shown in SI with the inch values.",
      "Example: 6 pads carry 4,233.6 kPa at an operating number of 1.8554 × 10⁻⁶; the film is 0.036195 mm and the oil rises 25.381 °C."
    ],
    "limitations": [
      "The film thickness factor α and the friction coefficient f come from the handbook’s charts for the optimum pivot location; read them at the operating number shown.",
      "For rotation in both directions the pivot must be at mid-pad, with little loss of performance.",
      "If the temperature rise is too high, add feed chamfers to raise the oil flow.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tilting pads absorb misalignment and suit high loads and speeds, at higher cost.",
      "A larger operating number (higher speed or viscosity, lower load) thickens the film."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2339, 2352–2356. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
