// MAKEOS methods, input sources and limits for the polymer thermodynamics tools (batch polymers).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "polymer-solution-phase-check": {
    "purpose": "Flory–Huggins phase check for a polymer in a solvent or a blend of two polymers: the interaction parameter χ at the temperature from the two solubility parameters and an entropic part, the spinodal χ at your polymer fraction from the weight-average chain length, the critical concentration and χ from the weight- and z-average chain lengths (Stockmayer), the binodal (cloud-point) χ for a uniform chain of the weight-average length, the matching critical-point, spinodal and cloud temperatures, and whether the mixture is one phase, metastable or unstable, with a table of the phase boundary.",
    "uses": [
      "Check that a polymer stays dissolved in a coating, adhesive, casting or spinning solution at its storage and use temperature",
      "Estimate the temperature at which a solution turns cloudy on cooling",
      "Screen whether two polymers in a recycled or compounded blend can mix as one phase",
      "Choose a polymer concentration far enough from the phase boundary"
    ],
    "users": [
      "Materials and process engineers",
      "Coating, adhesive and membrane formulators",
      "Polymer compounders and recyclers",
      "Quality and laboratory staff"
    ],
    "inputs": {
      "M1": "Molar mass of the solvent from its data sheet; for a blend, the weight-average molar mass of the first polymer.",
      "rho1": "Density of the solvent or first polymer at about the working temperature, from the supplier’s data sheet.",
      "d1": "Hildebrand solubility parameter of the solvent or first polymer, from a handbook of solubility parameters or the supplier.",
      "M2": "Weight-average molar mass Mw of the polymer from the supplier’s certificate or a GPC (SEC) measurement.",
      "PDz": "Mz ÷ Mw from the same GPC report; enter 1 for a polymer of one chain length.",
      "rho2": "Density of the amorphous polymer from the data sheet.",
      "d2": "Solubility parameter of the polymer from a handbook, a group-contribution estimate or a swelling test.",
      "phi": "Volume fraction of the polymer in the mixture, from the recipe (mass shares divided by densities).",
      "chiS": "Entropic part of χ: about 0.34 for many polymer–solvent pairs (Blanks and Prausnitz), usually near 0 for two polymers; better from a measured χ.",
      "T": "Lowest temperature the mixture sees in storage, transport or use.",
      "dTm": "Distance you require between the working temperature and the cloud temperature, from your own experience of the system."
    },
    "outputs": [
      "χ at the temperature and χ at the binodal and spinodal for your fraction",
      "Critical polymer fraction and critical χ",
      "Estimated cloud and spinodal temperatures and the temperature at the critical point",
      "One phase, metastable or unstable",
      "Table of the phase boundary against polymer fraction"
    ],
    "method": [
      "Lattice cells are the size of component 1: V₁ = M₁ ÷ ρ₁, and the polymer occupies N = (M₂ ÷ ρ₂) ÷ V₁ cells (weight average Nw, z-average Nz = Nw × Mz/Mw).",
      "χ = χS + V₁(δ₁ − δ₂)² ÷ (R T), Klenin’s Eq. 3.1-71 with χS entered, so χ falls as the temperature rises (upper critical behaviour).",
      "Spinodal: 2χs = 1 ÷ (Nw φ) + 1 ÷ (1 − φ); critical fraction φc = 1 ÷ (1 + Nw ÷ √Nz) and 2χc = (1 + 1 ÷ √Nz)(1 + √Nz ÷ Nw) (Klenin Eqs. 3.2-9 to 3.2-11).",
      "Binodal: the χ at which your fraction coexists with a second phase of equal chemical potentials of both components, for a uniform chain of length Nw; each temperature is T = V₁(δ₁ − δ₂)² ÷ [R (χ − χS)].",
      "Example: Mw 200,000 g/mol (density 1.05) at 5 % in a liquid of 92 g/mol (density 0.87): Nw = 1,801, χ = 0.5106 at 25 °C against 0.5273 at the binodal and 0.5319 at the spinodal; the estimated cloud temperature is −1.6 °C, a margin of 26.6 K: one phase."
    ],
    "limitations": [
      "Mean-field Flory–Huggins model with χ independent of concentration; near the critical point and in dilute solution its predictions are only approximate (Klenin chapters 4 and 5).",
      "Only upper critical (cloud on cooling) behaviour is modelled; lower critical separation on heating, specific interactions such as hydrogen bonding and crystallisation are not.",
      "The binodal is computed for a uniform chain of length Mw; the cloud point of a polydisperse polymer depends on its whole molar-mass distribution.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A stability ratio χ ÷ χ(binodal) below 1 means one stable phase; between the binodal and spinodal values the mixture is metastable and separates by nucleation, often slowly; at or above the spinodal it separates spontaneously.",
      "Long chains have a critical fraction of only a few per cent and a critical χ just above 0.5, so a small change in temperature or solvent can move a concentrated solution across the boundary.",
      "For a polydisperse polymer the critical point lies on the side of the phase boundary, not at its top, so the boundary can reach a higher temperature than the critical point; read the table for the highest cloud temperature."
    ],
    "refs": [
      "Klenin V. J., Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999; ISBN 0-444-82373-5), §3.1 (state equations and liquid–liquid separation, Eq. 3.1-71 for χ from solubility parameters) and §3.2.1 (spinodal and critical point of a polydisperse polymer, Eqs. 3.2-9 to 3.2-11). Method reference; no tables or figures are reproduced.",
      "Flory P. J., Principles of Polymer Chemistry (Cornell University Press, 1953), chapters XII and XIII.",
      "Stockmayer W. H., J. Chem. Phys. 17, 588 (1949): spinodal and critical point of polydisperse polymer solutions, as cited by Klenin.",
      "Blanks R. F. and Prausnitz J. M., Ind. Eng. Chem. Fundam. 3, 1 (1964): the entropic part of χ for polymer solutions."
    ],
    "verify": [
      "Confirm the cloud temperature by cooling a sample slowly and watching for turbidity.",
      "Use a measured χ (osmometry, light scattering or swelling) where one exists."
    ]
  },
  "hansen-solvent-compatibility": {
    "purpose": "Hansen solubility parameter screen: the dispersion, polar and hydrogen-bonding parameters of a liquid or of a blend of two liquids mixed by volume, the Hansen distance Ra to the polymer with the dispersion difference weighted four times, the relative energy difference RED = Ra ÷ R₀ against the polymer’s interaction radius, the blend share that brings the liquid closest to the polymer, and a verdict for a part that must resist the liquid or for a liquid meant to dissolve the polymer, with a band of uncertainty around the sphere boundary.",
    "uses": [
      "Screen whether a cleaner, solvent, fuel or process liquid will attack a plastic part or swell a seal",
      "Choose a solvent or blend for solvent bonding, coating or dissolving a polymer",
      "Design a two-liquid blend that dissolves a polymer neither liquid dissolves alone",
      "Decide which liquids need an immersion test before approval"
    ],
    "users": [
      "Design and materials engineers",
      "Maintenance and cleaning planners",
      "Coating and adhesive formulators",
      "Quality engineers"
    ],
    "inputs": {
      "purpose": "Choose whether the part must resist the liquid or the liquid is meant to dissolve or swell the polymer.",
      "pD": "Dispersion parameter of the polymer from Hansen’s handbook, the material supplier or a solubility test with known solvents.",
      "pP": "Polar parameter of the polymer from the same source as δD.",
      "pH": "Hydrogen-bonding parameter of the polymer from the same source as δD.",
      "R0": "Interaction radius of the polymer’s solubility sphere, from the same source; it belongs with the three parameters above.",
      "aD": "Dispersion parameter of the first liquid from a table of Hansen parameters or the supplier.",
      "aP": "Polar parameter of the first liquid.",
      "aH": "Hydrogen-bonding parameter of the first liquid.",
      "bD": "Dispersion parameter of the second liquid of a blend; leave the share at 0 % for a single liquid.",
      "bP": "Polar parameter of the second liquid.",
      "bH": "Hydrogen-bonding parameter of the second liquid.",
      "xB": "Volume share of liquid B in the blend, from the recipe; 0 % for liquid A alone, 100 % for liquid B alone.",
      "band": "How far either side of RED = 1 you treat as uncertain, from your own test experience with the polymer."
    },
    "outputs": [
      "Hansen parameters of the liquid or blend",
      "Hansen distance Ra and RED",
      "Blend share closest to the polymer",
      "Resist, borderline or dissolve verdict"
    ],
    "method": [
      "Blend parameters are volume-weighted: δ = (1 − x)δA + x δB for each of δD, δP and δH.",
      "Ra² = 4(δD,liquid − δD,polymer)² + (δP,liquid − δP,polymer)² + (δH,liquid − δH,polymer)²; RED = Ra ÷ R₀, below 1 inside the polymer’s solubility sphere (Hansen).",
      "The blend share closest to the polymer minimises Ra², a quadratic in x, limited to 0 to 100 %.",
      "Example: liquid A (15.5, 9.0, 19.0) against a polymer at (18.5, 4.5, 2.9) with R₀ = 8.6: Ra = 17.76 and RED = 2.07, likely to resist; liquid B alone gives RED 0.38, and the closest blend, 91.1 % B, gives RED 0.33."
    ],
    "limitations": [
      "The sphere is an empirical screen: its boundary is not sharp and its values come from tests with a set of solvents.",
      "Time, temperature, stress, crystallinity, crosslinking and the size of the liquid molecules all change real attack and swelling; the screen does not model them.",
      "Environmental stress cracking can occur in liquids outside the sphere.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "RED well above 1: the liquid is unlikely to dissolve the polymer, but test before approval; RED near 1: borderline, partial swelling is likely; RED well below 1: likely to dissolve an amorphous polymer or strongly swell a crosslinked one.",
      "Two liquids that each sit outside the sphere can, blended, sit inside it; the blend result shows when that happens."
    ],
    "refs": [
      "Hansen C. M., Hansen Solubility Parameters: A User’s Handbook, 2nd edition (CRC Press, 2007): the three-parameter solubility sphere, Ra with the factor 4 on dispersion, RED and volume-weighted blends.",
      "Klenin V. J., Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999; ISBN 0-444-82373-5), §3.1.1: Hildebrand’s solubility parameter, its split into dispersion, polar and hydrogen-bonding parts, and best solubility for close parameters. Method reference; no tables are reproduced.",
      "ISO 175, Plastics: methods of test for the determination of the effects of immersion in liquid chemicals; ISO 1817, Rubber, vulcanized or thermoplastic: determination of the effect of liquids. Consult the current editions."
    ],
    "verify": [
      "Run an immersion test of the actual part material in the actual liquid at the service temperature."
    ]
  },
  "rubber-swelling-crosslink-density": {
    "purpose": "Equilibrium swelling test of a vulcanised rubber or gel: the rubber volume fraction in the swollen specimen from the initial, swollen and dried masses, the rubber share of the compound and the densities, the volume and mass change and the soluble fraction, the crosslink density from the Flory–Rehner equation for a network of the stated functionality with the polymer–liquid interaction parameter you supply (and its sensitivity to that parameter), the molar mass between crosslinks, and the network shear and Young’s moduli this crosslink density implies, against your acceptance range.",
    "uses": [
      "Check the state of cure of a rubber batch against an acceptance range",
      "Compare cure systems, cure times or ageing in the laboratory",
      "Estimate the network modulus of a gel or rubber from a swelling test",
      "Investigate under-cure or reversion complaints"
    ],
    "users": [
      "Rubber technologists and compounders",
      "Quality and laboratory staff",
      "Seal and moulded-rubber engineers"
    ],
    "inputs": {
      "m0": "Mass of the dry specimen before immersion, weighed on an analytical balance.",
      "ms": "Mass of the specimen swollen to equilibrium, weighed quickly after blotting off surface liquid.",
      "md": "Mass of the specimen after the liquid has been driven off to constant mass.",
      "rhoC": "Density of the compound, measured by hydrostatic weighing or from the compound sheet.",
      "wR": "Share of rubber polymer in the dried compound by mass, from the recipe (rubber ÷ total parts) after allowing for extracted oils.",
      "rhoR": "Density of the rubber polymer itself, from the polymer supplier.",
      "rhoS": "Density of the swelling liquid at the test temperature.",
      "V1": "Molar volume of the swelling liquid: molar mass ÷ density.",
      "chi": "Interaction parameter of this rubber with this liquid, from the literature for the pair or from a calibration against a known network.",
      "f": "Number of chains that meet at each crosslink: 4 for usual vulcanisation, 3 for some networks made by end-linking.",
      "T": "Temperature at which the specimen was swollen.",
      "numin": "Lowest crosslink density your specification or control chart accepts.",
      "numax": "Highest crosslink density your specification or control chart accepts."
    },
    "outputs": [
      "Rubber volume fraction v₂ and swelling ratio",
      "Volume change, mass change and soluble fraction",
      "Crosslink density and its sensitivity to χ",
      "Molar mass between crosslinks",
      "Network shear and Young’s moduli",
      "In or out of the acceptance range"
    ],
    "method": [
      "Rubber volume Vr = md × wR ÷ ρR, absorbed liquid Vs = (ms − md) ÷ ρs, v₂ = Vr ÷ (Vr + Vs).",
      "Flory–Rehner (Klenin Eq. 3.5-65, liquid in equilibrium with the network): ν = −[ln(1 − v₂) + v₂ + χv₂²] ÷ [V₁(v₂^⅓ − 2v₂ ÷ f)].",
      "Mc = ρR ÷ ν (Eq. 3.5-67); shear modulus G = ν R T (Eq. 3.5-50) and Young’s modulus E = 3G (Eq. 3.5-58) for the dry network.",
      "Example: 2.000 g swells to 6.200 g and dries to 1.950 g, 60 % rubber of density 0.92 in a liquid of 0.867 g/cm³ and 106.3 cm³/mol: v₂ = 0.2060; with χ = 0.39 and f = 4, ν = 156.7 mol/m³, Mc = 5,872 g/mol and G = 0.386 MPa at 23 °C: in range."
    ],
    "limitations": [
      "Affine Flory–Rehner network: other network models (phantom network, Mooney–Rivlin corrections) give different absolute values, so compare results only within one method.",
      "No Kraus correction for reinforcing filler, which restricts swelling and raises the apparent crosslink density.",
      "The result is very sensitive to χ, and χ itself varies with concentration; entanglements count as crosslinks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Treat the crosslink density as a comparative quality measure: a batch that swells more than usual has fewer effective crosslinks or more degraded network.",
      "The modulus shown is the network’s contribution; filled compounds are stiffer than it."
    ],
    "refs": [
      "Flory P. J. and Rehner J., J. Chem. Phys. 11, 521 (1943): statistical mechanics of crosslinked polymer networks, swelling.",
      "Klenin V. J., Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999; ISBN 0-444-82373-5), §3.5.1–3.5.2: network shear modulus (Eq. 3.5-50), E = 3μ (Eq. 3.5-58), chemical potential of the liquid in a swollen network (Eqs. 3.5-64 and 3.5-65) and chains per volume (Eq. 3.5-67). Method reference; no tables or figures are reproduced.",
      "Kraus G., J. Appl. Polym. Sci. 7, 861 (1963): swelling of filler-reinforced vulcanizates.",
      "ASTM D6814 (crosslink density of crumb rubber by swelling) and ISO 1817 (effect of liquids on rubber): test practice. Consult the current editions."
    ],
    "verify": [
      "Weigh at intervals until the swollen mass is steady before recording it.",
      "Run a reference compound of known cure with every batch of tests."
    ]
  },
  "polymer-intrinsic-viscosity": {
    "purpose": "Dilute-solution viscometry from one concentration: the relative, specific, reduced and inherent viscosities from the flow times, the intrinsic viscosity by the Solomon–Ciuta, Billmeyer or Huggins single-point relation (all three are reported side by side to show their agreement), the viscosity-average molar mass from Mark–Houwink constants you supply, and the intrinsic viscosity against your specification limits, as used for resin grade and degradation checks.",
    "uses": [
      "Check incoming resin against its intrinsic viscosity grade",
      "Detect molar-mass loss from drying, moulding, extrusion or recycling",
      "Estimate the viscosity-average molar mass of a polymer",
      "Compare a single-point result with a full dilution series"
    ],
    "users": [
      "Quality and laboratory staff",
      "Polymer processing engineers",
      "Recyclers and resin buyers"
    ],
    "inputs": {
      "t0": "Mean flow time of the pure solvent through the capillary viscometer at the bath temperature.",
      "t": "Mean flow time of the polymer solution in the same viscometer at the same temperature.",
      "c": "Polymer concentration in grams per decilitre, from the weighed polymer and the solution volume.",
      "method": "Single-point relation your test method or customer specifies; the other two are shown for comparison.",
      "kH": "Huggins constant for this polymer and solvent, from a dilution series or the literature; used only by the Huggins relation.",
      "K": "Mark–Houwink constant K for this polymer, solvent and temperature, from the literature or a calibration, in dL/g.",
      "a": "Mark–Houwink exponent a for the same polymer, solvent and temperature as K.",
      "IVmin": "Lowest intrinsic viscosity the grade or specification accepts.",
      "IVmax": "Highest intrinsic viscosity the grade or specification accepts."
    },
    "outputs": [
      "Relative, specific, reduced and inherent viscosity",
      "Intrinsic viscosity by the chosen relation and by all three",
      "Viscosity-average molar mass",
      "Within or outside the specification"
    ],
    "method": [
      "ηr = t ÷ t₀ (equal densities), ηsp = ηr − 1, reduced viscosity ηsp ÷ c and inherent viscosity ln ηr ÷ c.",
      "Solomon–Ciuta: [η] = √[2(ηsp − ln ηr)] ÷ c. Billmeyer: [η] = ¼(ηsp + 3 ln ηr) ÷ c. Huggins: ηsp ÷ c = [η] + kH[η]²c solved for [η] = [√(1 + 4kH ηsp) − 1] ÷ (2kH c).",
      "Mark–Houwink: [η] = K Mᵃ, so Mv = ([η] ÷ K)^(1/a).",
      "Example: 135.0 s against 100.0 s at 0.5 g/dL: ηr = 1.35, [η] = 0.6318 dL/g (Solomon–Ciuta), 0.6252 (Billmeyer) and 0.6304 (Huggins, kH = 0.35); with K = 5 × 10⁻⁴ dL/g and a = 0.70, Mv = 26,969 g/mol: within 0.60 to 0.75 dL/g."
    ],
    "limitations": [
      "Single-point relations assume a typical concentration dependence (a Huggins constant near 0.35); for unusual polymers or solvents they drift from the extrapolated value.",
      "No kinetic-energy or density correction; the solution must be dilute and free of gel or dust.",
      "Mv depends entirely on the Mark–Houwink constants entered and is not the weight-average molar mass.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A fall in intrinsic viscosity after processing means chain scission, for example by hydrolysis of an undried resin.",
      "The exponent a shows solvent quality: about 0.5 in a theta solvent and up to about 0.8 in a good solvent for flexible coils (Klenin chapters 4 and 5)."
    ],
    "refs": [
      "Solomon O. F. and Ciută I. Z., J. Appl. Polym. Sci. 6, 683 (1962): single-point determination of intrinsic viscosity.",
      "Billmeyer F. W., J. Polym. Sci. 4, 83 (1949): methods for estimating intrinsic viscosity.",
      "Huggins M. L., J. Am. Chem. Soc. 64, 2716 (1942): concentration dependence of the viscosity of dilute solutions of long-chain molecules.",
      "Klenin V. J., Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999; ISBN 0-444-82373-5), §5.3 (hydrodynamic properties of macromolecules, intrinsic viscosity of coils) and chapter 4 (scaling of coil size with chain length). Topic reference; no tables are reproduced.",
      "ISO 1628-1 (viscosity of polymers in dilute solution using capillary viscometers, general principles); ASTM D2857 and, for PET, ASTM D4603. Consult the current editions."
    ],
    "verify": [
      "Repeat each flow time until readings agree, and check the solvent time against the viscometer’s record."
    ]
  },
  "polymer-melting-point-depression": {
    "purpose": "Flory’s equation for the melting (liquidus) temperature of a semicrystalline polymer swollen by a diluent: the diluent volume fraction from the mass share and densities, the depressed melting temperature from the pure polymer’s melting point, the heat of fusion and molar volume of its repeat unit, the diluent’s molar volume and the interaction parameter, the depression in kelvin, and the result against a process temperature at which the crystals must melt or dissolve, or a service temperature at which they must survive, with a table of melting temperature against diluent content.",
    "uses": [
      "Set the dissolution temperature for solution or gel processing of a semicrystalline polymer",
      "Estimate how far a plasticiser, oil or absorbed liquid lowers a polymer’s melting point",
      "Check that a swollen semicrystalline part keeps its crystals at its service temperature",
      "Plan a phase analysis of a polymer–liquid system"
    ],
    "users": [
      "Polymer process engineers",
      "Materials engineers",
      "Laboratory staff"
    ],
    "inputs": {
      "purpose": "Choose whether the crystals must melt at the process temperature or survive at the service temperature.",
      "Tm0": "Melting temperature of the pure polymer, preferably its equilibrium melting point from the literature or DSC.",
      "dH": "Heat of fusion of fully crystalline polymer per mole of repeat unit, from the literature (heat per gram × repeat-unit molar mass).",
      "Vu": "Molar volume of the repeat unit: its molar mass ÷ the amorphous density.",
      "rhoP": "Density of the amorphous polymer, used to turn the mass share into a volume fraction.",
      "V1": "Molar volume of the diluent: its molar mass ÷ its density.",
      "rho1": "Density of the diluent near the working temperature.",
      "w1": "Share of diluent in the mixture by mass, from the recipe or the measured uptake.",
      "chi": "Interaction parameter of the polymer with this diluent, from the literature, a swelling test or a fit to measured melting points.",
      "Tp": "Temperature of the process step or of service.",
      "margin": "Distance you require between that temperature and the melting temperature."
    },
    "outputs": [
      "Diluent volume fraction",
      "Melting temperature with the diluent and the depression",
      "Margin against the process or service temperature",
      "Table of melting temperature against diluent content"
    ],
    "method": [
      "Diluent volume fraction φ₁ = (w₁ ÷ ρ₁) ÷ [w₁ ÷ ρ₁ + (1 − w₁) ÷ ρp].",
      "Equal chemical potentials of the polymer in the crystal and in the solution (Klenin §6.1, Flory 1949) give 1 ÷ Tm − 1 ÷ Tm₀ = (R ÷ ΔHu)(Vu ÷ V₁)(φ₁ − χφ₁²), temperatures in kelvin.",
      "Example: 50 % by mass of a diluent (0.90 g/cm³, 150 cm³/mol) in a polymer melting at 140 °C (8,000 J/mol and 33 cm³/mol per repeat unit, 0.85 g/cm³) with χ = 0.3: φ₁ = 48.6 %, Tm = 124.4 °C, a depression of 15.6 K; at 135 °C the margin is 10.6 K, so the crystals melt."
    ],
    "limitations": [
      "Equilibrium theory for long chains with the diluent excluded from the crystals; real crystals are thinner than equilibrium and melt lower.",
      "χ is taken as independent of concentration and temperature.",
      "When χ is 0.5 or more the melt and diluent can also separate into two liquids, which this equation does not describe (Klenin §6.3).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A good solvent (small χ, small molar volume) lowers the melting point most; a large or poorly compatible diluent hardly lowers it.",
      "The table is the liquidus of the state diagram: above it the crystals melt or dissolve, below it they can form."
    ],
    "refs": [
      "Flory P. J., J. Chem. Phys. 17, 223 (1949): thermodynamics of crystallisation in high polymers, melting-point depression by diluents.",
      "Klenin V. J., Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999; ISBN 0-444-82373-5), §6.1 (conditions of phase equilibrium between polymer crystals and solution, Eqs. 6.1-1 to 6.1-5) and §6.3 (mixed types of phase separation). Method reference; no tables or figures are reproduced.",
      "Mandelkern L., Crystallization of Polymers, 2nd edition, Volume 1 (Cambridge University Press, 2002): melting of polymer–diluent mixtures."
    ],
    "verify": [
      "Measure the melting or dissolution temperature of the actual mixture by DSC at a slow heating rate."
    ]
  },
  "dls-particle-size": {
    "purpose": "Dynamic light scattering (photon correlation) reduced by hand: the scattering vector from the laser wavelength, the refractive index of the liquid and the scattering angle, the field decay rate (half the decay rate of the intensity correlation), the translational diffusion coefficient D = Γ ÷ q², the hydrodynamic radius and diameter from the Stokes–Einstein equation at the liquid’s temperature and viscosity, the product qRh that shows whether internal motion of flexible coils can enter the decay, and the size against your specification limits.",
    "uses": [
      "Check a DLS instrument’s reported size from its decay rate",
      "Recalculate a size for a different liquid viscosity or temperature",
      "Accept or reject an emulsion, latex, dispersion or nanoparticle batch on size",
      "Judge whether a polymer measurement needs extrapolation to zero angle"
    ],
    "users": [
      "Quality and laboratory staff",
      "Formulation and process engineers",
      "Colloid and polymer scientists"
    ],
    "inputs": {
      "lam": "Wavelength of the instrument’s laser in vacuum, from its specification (for example a helium–neon laser).",
      "nr": "Refractive index of the liquid at the laser wavelength and sample temperature.",
      "theta": "Angle between the laser beam and the detector, from the instrument settings.",
      "corr": "Which correlation function the decay rate comes from; most instruments fit the intensity correlation.",
      "Gm": "Decay rate fitted to the correlation function: the first cumulant, or 1 ÷ the decay time.",
      "T": "Temperature of the sample cell during the measurement.",
      "eta": "Viscosity of the liquid alone at the sample temperature, from tables or a viscometer.",
      "dmin": "Smallest hydrodynamic diameter the specification accepts.",
      "dmax": "Largest hydrodynamic diameter the specification accepts."
    },
    "outputs": [
      "Scattering vector and field decay rate",
      "Diffusion coefficient",
      "Hydrodynamic radius and diameter",
      "qRh check for internal motion",
      "In or out of specification"
    ],
    "method": [
      "q = 4πn sin(θ ÷ 2) ÷ λ₀; the field correlation decays as exp(−Γt) with Γ = D q² (Klenin Eqs. 3.3-57 to 3.3-60); the intensity correlation g₂ − 1 = |g₁|² decays at 2Γ.",
      "Stokes–Einstein: Rh = kB T ÷ (6πηD), diameter d = 2Rh.",
      "For flexible coils the decay is purely translational when qR ≪ 1 (Klenin Eq. 3.3-67); otherwise measure at several angles and extrapolate Γ ÷ q² to q = 0.",
      "Example: 632.8 nm, n = 1.332, 90°: q = 18.70 µm⁻¹; an intensity decay rate of 6,000 s⁻¹ is a field rate of 3,000 s⁻¹, so D = 8.58 × 10⁻¹² m²/s and, at 25 °C and 0.89 mPa·s, Rh = 28.6 nm and d = 57.2 nm: in range, with qRh = 0.54."
    ],
    "limitations": [
      "One decay rate gives the intensity-weighted (z-average) size; it cannot describe a broad or multimodal distribution.",
      "Dilute, non-interacting particles in a Newtonian liquid are assumed; concentrated samples need extrapolation to zero concentration.",
      "The hydrodynamic size includes any solvation layer or adsorbed stabiliser and differs from microscope or sieve sizes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger decay rate means faster diffusion and smaller particles; at fixed decay rate the size is proportional to temperature ÷ viscosity.",
      "If the size changes with scattering angle, the sample is polydisperse or the particles are large or flexible compared with 1 ÷ q."
    ],
    "refs": [
      "Klenin V. J., Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999; ISBN 0-444-82373-5), §3.3.2 (Brownian motion of macromolecules in solution and inelastic light scattering: Eqs. 3.3-57 to 3.3-61, the condition qR ≪ 1 of Eq. 3.3-67 and the method of cumulants). Method reference; no tables or figures are reproduced.",
      "Berne B. J. and Pecora R., Dynamic Light Scattering (Wiley, 1976; Dover, 2000).",
      "Koppel D. E., J. Chem. Phys. 57, 4814 (1972): the method of cumulants.",
      "ISO 22412, Particle size analysis: dynamic light scattering (DLS). Consult the current edition."
    ],
    "verify": [
      "Measure a size standard of known diameter on the same instrument and settings."
    ]
  }
});
