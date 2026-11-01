// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook87).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "area-converter": {
    "purpose": "Convert a area between SI, metric and US customary or British units and see it in every listed unit at once.",
    "uses": [
      "Convert area values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The area in each listed unit",
      "Value in m²"
    ],
    "method": [
      "Value in m² = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … m²): km² 1000000; hectare 10000; are 100; cm² 0.0001; mm² 0.000001; µm² 1e-12; in² 0.00064516; ft² 0.09290304; yd² 0.83612736; acre 4046.8564224000006; mile² 2589988.110336; square mil 6.451599999999999e-10; circular mil 5.067074790974976e-10; circular inch 0.0005067074790974977.",
      "Example: 100 ft² = 9.290304 m²."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "The circular mil and circular inch are the areas of circles 0.001 in and 1 in in diameter, used for wire and cable sections.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2675–2677. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "volume-converter": {
    "purpose": "Convert a volume between SI, metric and US customary or British units and see it in every listed unit at once.",
    "uses": [
      "Convert volume values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The volume in each listed unit",
      "Value in m³"
    ],
    "method": [
      "Value in m³ = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … m³): litre (dm³) 0.001; mL (cm³) 0.000001; mm³ 1e-9; hectolitre 0.1; in³ 0.000016387064; ft³ 0.028316846592000004; yd³ 0.764554857984; US gallon 0.003785411784; US quart 0.000946352946; US pint 0.000473176473; US fluid ounce 0.0000295735295625; Imperial gallon 0.00454609; Imperial quart 0.0011365225; Imperial pint 0.00056826125; Imperial fluid ounce 0.0000284130625; US bushel (2150.42 in³) 0.03523907016688; Imperial bushel (8 gal) 0.03636872.",
      "Example: 55 US gallon = 0.20819765 m³."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "US and Imperial gallons, quarts, pints and fluid ounces are different sizes; the US fluid ounce is 1/128 US gallon and the Imperial 1/160 Imperial gallon.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2678–2681. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "inertia-converter": {
    "purpose": "Converts the four quantities of the handbook’s moment of inertia and momentum tables between SI, metric and US customary units: mass moment of inertia (kg·m², lb·ft², lb·in², slug·ft², lbf·in·s² and others), second moment of area (m⁴, cm⁴, mm⁴, in⁴, ft⁴), section modulus (m³, cm³, mm³, in³, ft³) and momentum (kg·m/s, lb·ft/s, lb·in/s), showing the value in every unit of the same kind.",
    "uses": [
      "Convert motor and load inertias from a US data sheet",
      "Convert section properties from an inch steel table",
      "Check a calculation that mixes unit systems"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the data sheet, section table or calculation.",
      "from": "The unit printed beside the value; the tool shows the value in every other unit of the same kind."
    },
    "outputs": [
      "The value in each unit of the same kind",
      "Value in the SI unit of that kind"
    ],
    "method": [
      "Value in the SI unit = entered value × factor of the entered unit; value in each other unit = SI value ÷ that unit’s factor.",
      "Factors are built from 1 in = 0.0254 m, 1 ft = 0.3048 m, 1 lb = 0.45359237 kg and standard gravity 9.80665 m/s², all exact; they reproduce the handbook’s Tables 57 and 58.",
      "Mass moment of inertia in lb·ft² (often written WR² or WK²) is a mass times a radius squared; slug·ft² and lbf·in·s² are the gravitational units used in dynamics.",
      "Example: 1 lb·ft² = 0.04214011 kg·m²."
    ],
    "limitations": [
      "Mass moment of inertia (resistance to angular acceleration) and second moment of area (resistance to bending) are different quantities; the tool converts only within a kind.",
      "Some data sheets give WR² in lb·ft² but GD² in kgf·m², which is four times the kg·m² value.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep the original unit on record and round to the precision of the source."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2699. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "silent-chain-sprocket-inspection": {
    "purpose": "Inspection of silent chain sprockets for 3/8 in and larger pitch by the ANSI B29.2M rules in the handbook: the nominal pitch diameter P ÷ sin(180°/N), outside diameter for rounded teeth P(cot 180°/N + 0.08), blank diameter, over-pin diameter over 0.625P gauge pins (even and odd numbers of teeth), the over-pin tolerance (0.004 + 0.001 P √N) in, all negative, the eccentricity of the pitch diameter to the bore 0.001 × PD but not less than 0.006 nor more than 0.032 in total indicator reading, and the maximum guide groove diameter P(cot 180°/N − 1.16) with its +0, −0.030 in tolerance, against your measurements.",
    "uses": [
      "Accept or reject cut silent chain sprockets",
      "Set the limits for an inspection sheet",
      "Check a worn or reworked sprocket"
    ],
    "users": [
      "Quality inspectors",
      "Gear and sprocket cutters",
      "Maintenance fitters"
    ],
    "inputs": {
      "P": "Pitch of the silent chain the sprocket is cut for, 3/8 in (9.525 mm) or larger; 1 in is 25.4 mm.",
      "Nt": "Number of teeth on the sprocket.",
      "OPDm": "Diameter measured over two gauge pins of diameter 0.625 × pitch placed in opposite tooth spaces (or the nearest spaces for an odd number of teeth).",
      "TIRm": "Total indicator reading of the pitch diameter (over pins or teeth) with the sprocket turned on its bore.",
      "Gm": "Diameter measured at the bottom of the guide groove."
    },
    "outputs": [
      "Nominal pitch, outside, blank and over-pin diameters",
      "Over-pin tolerance and limits",
      "Eccentricity limit",
      "Guide groove limits",
      "Accept or reject"
    ],
    "method": [
      "PD = P ÷ sin(180°/N); outside diameter (rounded teeth) = P(cot 180°/N + 0.08); blank diameter 0.020 in larger.",
      "Gauge pin Dp = 0.625P; over-pin diameter, even N: PD − 0.125P csc(30° − 180°/N) + 0.625P; odd N: cos(90°/N)(PD − 0.125P csc(30° − 180°/N)) + 0.625P.",
      "Over-pin tolerance (all negative) = (0.004 + 0.001 P √N) in, P in inches; the handbook Table 4a lists it by bands of tooth numbers.",
      "Eccentricity of the pitch diameter to the bore: 0.001 × PD, not less than 0.006 in nor more than 0.032 in TIR.",
      "Maximum guide groove diameter G = P(cot 180°/N − 1.16), tolerance +0, −0.030 in.",
      "Example: a 25-tooth sprocket for 25.4 mm pitch has a nominal over-pin diameter of 209.96 mm, accepted down to 209.73 mm."
    ],
    "limitations": [
      "For 3/8 in and larger pitch; 3/16 in pitch chain uses 0.667P pins, other constants and its own Table 4b.",
      "Tooth form, face width and the tooth profile are checked against the tooth form drawing (silent-chain-sprocket-tooth-form).",
      "The tolerance by the formula at the actual number of teeth can differ from the table band value by up to 0.001 in.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An over-pin diameter above nominal means the teeth are thick and the chain will ride high; below the limit, the chain sits too deep and the pitch line moves.",
      "Run-out shows as a once-per-revolution tension and speed pulse in the chain."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3458–3464. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fuel-oil-heating-value": {
    "purpose": "Fuel oil heating value by the handbook’s approximate formula BTU per pound = 18,650 + 40 × (degrees Baumé − 10), with the Baumé scale for liquids lighter than water, specific gravity = 140 ÷ (130 + degrees Baumé), so that either can be entered; the value in MJ/kg, MJ/L and BTU per US gallon, and the oil burned per hour and over a running time to deliver a heat output at the appliance efficiency you enter.",
    "uses": [
      "Estimate the heating value of an oil from its gravity",
      "Estimate burner fuel use for a heat demand",
      "Convert between Baumé degrees and specific gravity"
    ],
    "users": [
      "Boiler and furnace operators",
      "Plant engineers",
      "Estimators"
    ],
    "inputs": {
      "from": "Enter the oil’s gravity on the Baumé hydrometer scale or as a specific gravity.",
      "be": "Degrees on the Baumé hydrometer scale for liquids lighter than water, from the oil supplier or a hydrometer reading.",
      "sg": "Specific gravity of the oil relative to water, both at 60 °F (15.6 °C).",
      "Q": "Useful heat the burner, boiler or heater must deliver.",
      "eff": "Efficiency of the appliance from its data plate or test, the share of the fuel’s heat that becomes useful heat.",
      "hours": "Hours the appliance runs at that output, for the fuel used over the period."
    },
    "outputs": [
      "Degrees Baumé and specific gravity",
      "Heating value in BTU/lb, MJ/kg and MJ/L",
      "Heating value per US gallon",
      "Oil burned per hour (kg/h and L/h)",
      "Oil used over the running time"
    ],
    "method": [
      "Specific gravity = 140 ÷ (130 + degrees Baumé) for liquids lighter than water; degrees Baumé = 140 ÷ specific gravity − 130.",
      "Heating value ≈ 18,650 + 40 × (degrees Baumé − 10) BTU/lb; 1 BTU/lb = 2.326 kJ/kg.",
      "Density = specific gravity × 999.0 kg/m³ (water at 60 °F); heat per litre and per US gallon follow.",
      "Oil burned = heat output ÷ (efficiency × heating value).",
      "Example: oil of 26.9 °Bé has a specific gravity of 0.89229 and about 19,326 BTU/lb (44.952 MJ/kg); 100 kW at 80 % needs about 11.23 L/h."
    ],
    "limitations": [
      "The heating value formula is an approximate fit to samples of petroleum oils from heavy crude to gasoline (about 18,500 to 21,100 BTU/lb); use the supplier’s tested value when there is one.",
      "The formula gives the gross (higher) heating value; appliance efficiencies quoted on the net value need the lower figure.",
      "For liquids heavier than water the Baumé scale uses specific gravity = 145 ÷ (145 − degrees Baumé); fuel oils are lighter than water.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Lighter oils (higher Baumé) carry more heat per kilogram but less per litre.",
      "Fuel use scales directly with heat output and inversely with efficiency."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 381, 2694, 3012. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "surface-roughness-acceptance": {
    "purpose": "Acceptance of measured surface roughness values (Ra, Rz and other parameters) against the drawing limits by the comparison rules described in the handbook: with the default 16 % rule no more than 16 % of the measured values may exceed the upper limit and no more than 16 % may fall below a lower limit, and the handbook notes that more than 16 % above the limit may still be accepted when the values are normally distributed and the mean plus one standard deviation lies within the upper limit; with the max rule (the parameter marked max, for example Rz1.5max) no value may exceed the limit anywhere on the surface. The default evaluation length is five sampling lengths, ln = 5 lr.",
    "uses": [
      "Decide whether a part meets its surface roughness callout",
      "Plan the length each roughness reading must cover",
      "Settle whether the 16 % or the max rule applies to a drawing callout"
    ],
    "users": [
      "Quality inspectors",
      "Machinists",
      "Design engineers"
    ],
    "inputs": {
      "rule": "The comparison rule: the 16 % rule applies unless the parameter on the drawing is marked max.",
      "U": "Upper limit of the roughness parameter from the drawing, for example Ra 0.8.",
      "lower": "Whether the drawing also gives a lower limit for the parameter.",
      "Lw": "Lower limit of the parameter when the drawing specifies one.",
      "n": "Total number of values measured on the surface.",
      "nAbove": "How many of the measured values are above the upper limit.",
      "nBelow": "How many of the measured values are below the lower limit.",
      "vmax": "Largest single value measured anywhere on the surface.",
      "vmin": "Smallest single value measured.",
      "mean": "Arithmetic mean of all the measured values.",
      "sd": "Standard deviation of the measured values.",
      "lr": "Sampling length (filter cut-off) used for each value, from the drawing or the default for the parameter."
    },
    "outputs": [
      "Share of values above the upper limit and below the lower limit",
      "Decision under the rule on the drawing",
      "Mean plus one standard deviation against the upper limit",
      "Evaluation length ln = 5 lr"
    ],
    "method": [
      "16 % rule: accept when no more than 16 % of the values exceed the upper limit and no more than 16 % fall below the lower limit.",
      "Exception noted in the handbook: when more than 16 % exceed the upper limit, the surface may still be accepted if the values follow a normal distribution and mean + one standard deviation is within the upper limit.",
      "Max rule: accept only when no value measured anywhere on the surface exceeds the upper limit (and none falls below a lower limit).",
      "Default evaluation length ln = 5 × sampling length lr (ISO 4287 R-profile).",
      "Example: 1 of 12 values above Ra 0.8 µm is 8.3333 % under the 16 % rule; each value covers 4 mm."
    ],
    "limitations": [
      "Use the rule the drawing calls for; ISO 4288 and ASME B46.1 give further detail on the number of readings and where to take them.",
      "The normal-distribution exception needs enough readings to judge the distribution; record it on the inspection report.",
      "Values must be measured with the cut-off and filter the drawing specifies.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With few readings, one value over the limit is already more than 16 % (1 in 6 is 16.7 %); take more readings before rejecting a marginal surface.",
      "A max requirement is stricter: a single reading over the limit rejects the surface."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 750. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
