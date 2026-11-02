// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook101).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "spline-pin-measurement": {
    "purpose": "Two-pin measurement of inch involute splines by the handbook’s formulas: pitch diameter D = N ÷ P and base diameter Db = D cos φD; for internal splines inv φi = s ÷ D + inv φD − di ÷ Db and Mi = Db sec φi − di (even teeth) or Db cos(90° ÷ N) sec φi − di (odd teeth) with di = 1.7280 ÷ P (30° and 37.5°) or 1.9200 ÷ P (45°); for external splines inv φe = t ÷ D + inv φD + de ÷ Db − π ÷ N and Me = Db sec φe + de (even) or Db cos(90° ÷ N) sec φe + de (odd) with de = 1.9200 ÷ P, the pressure angle at the pin centre found from its involute.",
    "uses": [
      "Inspect the actual space width of an internal spline with pins",
      "Inspect the actual tooth thickness of an external spline over pins",
      "Set the pin measurement limits from the space width or tooth thickness limits"
    ],
    "users": [
      "Quality inspectors",
      "Gear machinists",
      "Toolmakers"
    ],
    "inputs": {
      "kind": "Whether you measure an internal spline between pins or an external spline over pins.",
      "P": "Diametral pitch of the spline, the first number of the pitch fraction (e.g. 3 for 3/6).",
      "N": "Number of teeth of the spline.",
      "pa": "Standard pressure angle of the spline.",
      "w": "Actual space width (internal) or tooth thickness (external) at the pitch circle that the measurement is for.",
      "dp": "Diameter of the pins used, or 0 for the standard pin size."
    },
    "outputs": [
      "Pitch and base diameters",
      "Pin diameter used",
      "Pressure angle at the pin centre",
      "Measurement between or over pins"
    ],
    "method": [
      "D = N ÷ P; Db = D cos φD; inv φ = tan φ − φ.",
      "Internal: inv φi = s ÷ D + inv φD − di ÷ Db; Mi = Db sec φi − di (even N) or Db cos(90° ÷ N) sec φi − di (odd N); standard di = 1.7280 ÷ P (30°, 37.5°) or 1.9200 ÷ P (45°).",
      "External: inv φe = t ÷ D + inv φD + de ÷ Db − π ÷ N; Me = Db sec φe + de (even N) or Db cos(90° ÷ N) sec φe + de (odd N); standard de = 1.9200 ÷ P.",
      "The angle is found from its involute by Newton iteration instead of the involute tables.",
      "Example: the measurement between pins is 5.8351 in."
    ],
    "limitations": [
      "The measurement checks the actual space width or tooth thickness only; it does not show the fit, which depends on the effective dimensions.",
      "Pins must touch the flanks on the involute; check that the pin contact lies between the form and major (or minor) diameters.",
      "For the maximum and minimum measurements, enter the limits of the actual space width or tooth thickness from the standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger space width moves the pins outward, so the internal measurement between pins falls.",
      "A thicker external tooth raises the measurement over pins."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2271–2272. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "iso-fit-limits-from-deviations": {
    "purpose": "Limits of size by the BS ISO limits and fits procedure the handbook gives: for a shaft, ei = es − IT when the upper deviation es is tabulated or es = ei + IT when the lower deviation ei is; for a hole, EI = ES − IT or ES = EI + IT, with the delta value added to ES for holes K, M and N up to IT8 and P to ZC up to IT7; H and h have a zero deviation and Js and js are split equally about the basic size; and the largest and smallest clearance of the fit.",
    "uses": [
      "Turn a fit designation such as 45 H7/p6 into limits of size",
      "Apply the delta value for K, M, N and P to ZC holes",
      "See whether a fit is a clearance, transition or interference fit"
    ],
    "users": [
      "Design engineers",
      "Machinists",
      "Quality inspectors"
    ],
    "inputs": {
      "size": "Basic size common to the hole and the shaft.",
      "hk": "Which deviation the hole table gives for its letter.",
      "hdev": "The tabulated hole deviation, with its sign.",
      "hIT": "Standard tolerance for the hole grade and size.",
      "hdelta": "Delta value from the table for K, M, N up to IT8 and P to ZC up to IT7, or 0.",
      "sk": "Which deviation the shaft table gives for its letter.",
      "sdev": "The tabulated shaft deviation, with its sign.",
      "sIT": "Standard tolerance for the shaft grade and size."
    },
    "outputs": [
      "Upper and lower deviations of the hole and shaft",
      "Limits of size of the hole and shaft",
      "Largest and smallest clearance (negative = interference)",
      "Type of fit"
    ],
    "method": [
      "Shaft: es given → ei = es − IT; ei given → es = ei + IT; h → es = 0, ei = −IT; js → ±IT ÷ 2.",
      "Hole: EI given → ES = EI + IT; ES given → ES = tabulated ES + Δ, then EI = ES − IT; H → EI = 0, ES = IT; Js → ±IT ÷ 2.",
      "Limits = basic size + deviation.",
      "Largest clearance = ES − ei; smallest clearance = EI − es; negative values are interference.",
      "Example: the hole is 45 to 45.025 mm and the shaft 45.026 to 45.042 mm."
    ],
    "limitations": [
      "The deviations, IT values and delta values come from the ISO limits tables for your size and grade and are entered by you.",
      "The tables cover sizes up to 3150 mm; check the size step the values are read from.",
      "Limits apply at 20 °C.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A positive smallest clearance is a clearance fit; a negative largest clearance is an interference fit; otherwise it is a transition fit.",
      "H holes and h shafts have their tolerance zones on the basic size, as in the hole-basis and shaft-basis systems."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 662–664. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cylinder-portion-volume": {
    "purpose": "Portions of a cylinder by the handbook’s formulas: for a cylinder cut by a plane through a chord of the base, V = (2/3 a³ ± b × base area) h ÷ (r ± b) and curved surface S = (a d ± b × arc length) h ÷ (r ± b), with a the half chord, b the distance from the axis to the chord, d the diameter, plus when the base is larger than half the circle and minus when smaller; and for a cylinder cut off at an angle across its full section, V = π r² (h1 + h2) ÷ 2 and S = π r (h1 + h2).",
    "uses": [
      "Find the volume of a hoof cut from a cylinder or round bar",
      "Work out the material in a pipe or bar cut at an angle",
      "Find the curved surface area of a mitred cylinder"
    ],
    "users": [
      "Fabricators",
      "Design engineers",
      "Estimators"
    ],
    "inputs": {
      "mode": "Whether the plane cuts through a chord of the base or across the whole cylinder.",
      "d": "Diameter of the cylinder.",
      "h": "Height of the ungula at the point of the base furthest from the chord.",
      "b": "Perpendicular distance from the cylinder axis to the chord where the plane meets the base.",
      "side": "Whether the base of the ungula is more or less than half the circle.",
      "h1": "Height of the longest side of the cut-off cylinder.",
      "h2": "Height of the shortest side of the cut-off cylinder."
    },
    "outputs": [
      "Base area and arc length of the ungula",
      "Volume",
      "Curved surface area",
      "Mass for a density, if wanted (multiply the volume)"
    ],
    "method": [
      "Ungula: a = √(r² − b²); segment area = r² acos(b ÷ r) − a b and arc = 2 r acos(b ÷ r) for a base of half the circle or less; for a larger base, area = π r² − that segment and arc = 2π r − that arc.",
      "V = (2/3 a³ ± b × base area) h ÷ (r ± b); S = (a d ± b × arc) h ÷ (r ± b); + for a base larger than half the circle, − for smaller.",
      "Cut across: V = π r² (h1 + h2) ÷ 2; S = π r (h1 + h2).",
      "Example: the volume is 136,560 mm³ and the curved surface 6,451.6 mm²."
    ],
    "limitations": [
      "The plane must meet the base along the chord and rise to the height h at the far side of the base.",
      "For a pipe, subtract the volume of the bore cut the same way.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With the chord through the axis (b = 0) the ungula volume is 2/3 r² h.",
      "Cut across the whole cylinder, the volume equals a cylinder of the mean height."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 83–84. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "after-tax-npv-comparison": {
    "purpose": "Net present value of two alternatives by the handbook’s present worth formulas: NPV = −P + (AR − AE − (A/G, i, n) G)(1 − TR)(P/A, i, n) + L ÷ (1 + i)ⁿ, plus the after-tax depreciation recovery ATDR = TR (P − L) ÷ n × (P/A, i, n) for straight-line depreciation, with (P/A) = ((1 + i)ⁿ − 1) ÷ (i (1 + i)ⁿ) and (A/G) = 1 ÷ i − n ÷ ((1 + i)ⁿ − 1), and the alternative with the larger NPV chosen.",
    "uses": [
      "Compare two machines or processes on an after-tax basis",
      "Include the tax saved by straight-line depreciation",
      "Allow for a yearly rise in operating expense"
    ],
    "users": [
      "Business owners",
      "Engineering managers",
      "Accountants"
    ],
    "inputs": {
      "i": "Rate of return after tax that an investment must earn.",
      "n": "Life in years, the same for both alternatives.",
      "TR": "Rate of income tax on the net income.",
      "PA": "Purchase and installation cost of alternative A.",
      "LA": "Value of alternative A at the end of its life.",
      "ARA": "Yearly revenue or saving from alternative A.",
      "AEA": "Yearly operating and maintenance expense of alternative A in the first year.",
      "GA": "Amount by which the expense of A rises each year.",
      "PB": "Purchase and installation cost of alternative B.",
      "LB": "Value of alternative B at the end of its life.",
      "ARB": "Yearly revenue or saving from alternative B.",
      "AEB": "Yearly operating and maintenance expense of alternative B in the first year.",
      "GB": "Amount by which the expense of B rises each year."
    },
    "outputs": [
      "Present worth factor and gradient factor",
      "Before-depreciation NPV and depreciation recovery of each",
      "After-tax NPV of each",
      "The alternative to choose"
    ],
    "method": [
      "(P/A, i, n) = ((1 + i)ⁿ − 1) ÷ (i (1 + i)ⁿ); (A/G, i, n) = 1 ÷ i − n ÷ ((1 + i)ⁿ − 1).",
      "NPV before depreciation = −P + (AR − AE − (A/G) G)(1 − TR)(P/A) + L ÷ (1 + i)ⁿ.",
      "ATDR = TR × (P − L) ÷ n × (P/A) for straight-line depreciation.",
      "NPV = NPV before depreciation + ATDR; choose the larger NPV, and neither if both are negative.",
      "Example: NPV of A is 281.53 and of B 8,161.4."
    ],
    "limitations": [
      "Both alternatives must have the same life; for unequal lives compare equivalent uniform annual costs.",
      "Straight-line depreciation over the life is assumed for the tax saving; other schedules change ATDR.",
      "Tax is taken on the net income each year at a flat rate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A positive NPV means the alternative earns more than the minimum rate of return after tax.",
      "Depreciation recovery favours the alternative with the larger depreciable cost."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 136–141. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
