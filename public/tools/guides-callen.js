// MAKEOS methods, input sources and limits for the thermodynamics tool from Callen (batch callen).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "liquid-throttling-temperature-rise": {
    "purpose": "Temperature rise of a liquid throttled at constant enthalpy across a valve, orifice or other restriction, from its density, expansion coefficient and specific heat and the pressure dropped (the Joule–Thomson relation applied to a liquid): the temperature rise, the pressure energy turned to heat per kilogram, the simpler estimate that ignores thermal expansion and how far the expansion term lowers it, the temperature after the restriction, and a check of the rise against your limit.",
    "uses": [
      "Estimate oil heating across a relief valve, flow control or pressure-reducing valve",
      "Find the temperature after an orifice or partly closed valve in a water or process line",
      "Check whether a throttled circuit needs more cooling"
    ],
    "users": [
      "Hydraulic engineers",
      "Process and plant engineers",
      "Maintenance engineers chasing hot oil"
    ],
    "inputs": {
      "rho": "Density of the liquid at the working temperature, from the supplier’s data sheet or property tables.",
      "beta": "Fractional volume increase per kelvin at constant pressure, from fluid data.",
      "cp": "Specific heat at constant pressure, from fluid data.",
      "T": "Temperature of the liquid arriving at the restriction.",
      "dp": "Pressure upstream minus pressure downstream of the restriction.",
      "limit": "Your limit on temperature rise for this duty; it only moves the pass or fail line."
    },
    "outputs": [
      "Temperature rise across the restriction",
      "Pressure energy turned to heat per kilogram",
      "Simple estimate ignoring expansion, and the share the expansion term removes",
      "Temperature after the restriction"
    ],
    "method": [
      "A throttle does no work and, if it is short and insulated, exchanges little heat, so the liquid’s enthalpy is the same before and after it (Callen §6.3, equation 6.37).",
      "At constant enthalpy dT = (v ÷ cp)(T β − 1) dP (Callen equation 6.41), with v = 1 ÷ ρ and T in kelvin. For a pressure drop Δp the rise is ΔT = v (1 − T β) Δp ÷ cp; for liquids T β is well below 1, so they warm.",
      "Ignoring expansion gives the simpler v Δp ÷ cp, the pressure energy v Δp turned to heat; the expansion term lowers it by the share T β.",
      "Example: oil at 40 °C (870 kg/m³, β 700 × 10⁻⁶/K, cp 1.9 kJ/(kg·K)) dropping 300 bar warms 14.17 K; the simple estimate of 18.15 K is 21.9 % high."
    ],
    "limitations": [
      "Properties are taken at the inlet and held constant; for large drops use values at the mean temperature.",
      "The liquid alone with no heat loss; in a circuit the heat spreads into pipes, tank and cooler, so the measured rise is usually smaller.",
      "The liquid must stay liquid: if the outlet pressure falls below its vapour pressure it flashes or cavitates and this result does not apply.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With the example oil, every 10 bar dropped across a valve without doing work warms it by about 0.47 K; that heat must leave through the cooler.",
      "For liquid compressed quickly rather than throttled, use the liquid adiabatic compression tool: most compression heating returns on decompression, while throttling heat is a true loss."
    ],
    "refs": [
      "Herbert B. Callen, Thermodynamics and an Introduction to Thermostatistics, 2nd edition (John Wiley & Sons, 1985), sections 3.9 and 6.3, printed pp. 84–86 and 160–165. Method reference; no text, worked examples, problems or tables are reproduced.",
      "NIST Chemistry WebBook, SRD 69, Thermophysical Properties of Fluid Systems (https://webbook.nist.gov/chemistry/fluid/), a public source of fluid property values to enter."
    ],
    "verify": [
      "Check that the outlet pressure stays above the liquid’s vapour pressure at the outlet temperature."
    ]
  }
});
