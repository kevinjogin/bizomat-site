// KEVOS® MAKEOS: polymer thermodynamics tools (batch polymers) within the WORKOS directory.
// Methods follow V. J. Klenin, Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999) and the papers cited in each guide.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "polymer-solution-phase-check",
    "name": "Polymer Solution and Blend Phase Check (Flory–Huggins χ, Spinodal, Critical Point, Cloud Temperature)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "Will this polymer stay dissolved in this solvent, or mixed with this second polymer, at my concentration and temperature, and at what temperature will it start to separate?",
    "description": "Flory–Huggins phase check for a polymer in a solvent or a blend of two polymers: the interaction parameter χ at the temperature from the two solubility parameters and an entropic part, the spinodal χ at your polymer fraction from the weight-average chain length, the critical concentration and χ from the weight- and z-average chain lengths (Stockmayer), the binodal (cloud-point) χ for a uniform chain of the weight-average length, the matching critical-point, spinodal and cloud temperatures, and whether the mixture is one phase, metastable or unstable, with a table of the phase boundary.",
    "keywords": [
      "MAKEOS",
      "Flory–Huggins",
      "interaction parameter",
      "chi parameter",
      "polymer solution",
      "polymer blend",
      "miscibility",
      "cloud point",
      "spinodal",
      "UCST",
      "solubility parameter"
    ],
    "fields": [
      {
        "key": "h_component_1_solvent_or_first_polymer_of_a_blend_",
        "label": "Component 1 (solvent, or first polymer of a blend)",
        "type": "heading"
      },
      {
        "key": "M1",
        "label": "Molar mass of component 1",
        "type": "number",
        "default": 92,
        "unit": "g/mol",
        "min": 1,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho1",
        "label": "Density of component 1",
        "type": "number",
        "default": 0.87,
        "unit": "g/cm³",
        "min": 0.1,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d1",
        "label": "Solubility parameter of component 1",
        "type": "number",
        "default": 17,
        "unit": "MPa½",
        "min": 5,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_component_2_the_polymer_",
        "label": "Component 2 (the polymer)",
        "type": "heading"
      },
      {
        "key": "M2",
        "label": "Weight-average molar mass of the polymer (Mw)",
        "type": "number",
        "default": 200000,
        "unit": "g/mol",
        "min": 100,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PDz",
        "label": "Ratio of z-average to weight-average molar mass (Mz/Mw)",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho2",
        "label": "Density of the polymer",
        "type": "number",
        "default": 1.05,
        "unit": "g/cm³",
        "min": 0.1,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d2",
        "label": "Solubility parameter of the polymer",
        "type": "number",
        "default": 19,
        "unit": "MPa½",
        "min": 5,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mixture_and_conditions_",
        "label": "Mixture and conditions",
        "type": "heading"
      },
      {
        "key": "phi",
        "label": "Polymer volume fraction",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0.001,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "chiS",
        "label": "Entropic part of the interaction parameter (χS)",
        "type": "number",
        "default": 0.34,
        "unit": "",
        "min": -2,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Temperature of the mixture",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -150,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTm",
        "label": "Required margin above the cloud temperature",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hansen-solvent-compatibility",
    "name": "Solvent Attack and Swelling Screen for Plastics and Elastomers (Hansen Distance Ra and RED)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "Will this solvent, cleaner or blend of two liquids dissolve or swell my plastic or rubber part, or will it dissolve the polymer I want to dissolve?",
    "description": "Hansen solubility parameter screen: the dispersion, polar and hydrogen-bonding parameters of a liquid or of a blend of two liquids mixed by volume, the Hansen distance Ra to the polymer with the dispersion difference weighted four times, the relative energy difference RED = Ra ÷ R₀ against the polymer’s interaction radius, the blend share that brings the liquid closest to the polymer, and a verdict for a part that must resist the liquid or for a liquid meant to dissolve the polymer, with a band of uncertainty around the sphere boundary.",
    "keywords": [
      "MAKEOS",
      "Hansen solubility parameters",
      "HSP",
      "RED",
      "solvent compatibility",
      "chemical resistance",
      "swelling",
      "solvent cracking",
      "cleaning solvent",
      "solvent blend"
    ],
    "fields": [
      {
        "key": "purpose",
        "label": "What the liquid must do",
        "type": "select",
        "default": "resist",
        "options": [
          [
            "resist",
            "The part must resist the liquid"
          ],
          [
            "dissolve",
            "The liquid should dissolve or swell the polymer"
          ]
        ]
      },
      {
        "key": "h_polymer_",
        "label": "Polymer",
        "type": "heading"
      },
      {
        "key": "pD",
        "label": "Polymer dispersion parameter δD",
        "type": "number",
        "default": 18.5,
        "unit": "MPa½",
        "min": 10,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pP",
        "label": "Polymer polar parameter δP",
        "type": "number",
        "default": 4.5,
        "unit": "MPa½",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pH",
        "label": "Polymer hydrogen-bonding parameter δH",
        "type": "number",
        "default": 2.9,
        "unit": "MPa½",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R0",
        "label": "Polymer interaction radius R₀",
        "type": "number",
        "default": 8.6,
        "unit": "MPa½",
        "min": 0.5,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_liquid_a_",
        "label": "Liquid A",
        "type": "heading"
      },
      {
        "key": "aD",
        "label": "Liquid A dispersion parameter δD",
        "type": "number",
        "default": 15.5,
        "unit": "MPa½",
        "min": 10,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aP",
        "label": "Liquid A polar parameter δP",
        "type": "number",
        "default": 9,
        "unit": "MPa½",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aH",
        "label": "Liquid A hydrogen-bonding parameter δH",
        "type": "number",
        "default": 19,
        "unit": "MPa½",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_liquid_b_second_liquid_of_a_blend_",
        "label": "Liquid B (second liquid of a blend)",
        "type": "heading"
      },
      {
        "key": "bD",
        "label": "Liquid B dispersion parameter δD",
        "type": "number",
        "default": 18,
        "unit": "MPa½",
        "min": 10,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bP",
        "label": "Liquid B polar parameter δP",
        "type": "number",
        "default": 1.5,
        "unit": "MPa½",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bH",
        "label": "Liquid B hydrogen-bonding parameter δH",
        "type": "number",
        "default": 2,
        "unit": "MPa½",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xB",
        "label": "Share of liquid B in the blend by volume",
        "type": "number",
        "default": 0,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_decision_",
        "label": "Decision",
        "type": "heading"
      },
      {
        "key": "band",
        "label": "Uncertainty band either side of RED = 1",
        "type": "number",
        "default": 0.1,
        "unit": "",
        "min": 0,
        "max": 0.9,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rubber-swelling-crosslink-density",
    "name": "Rubber Swelling Test: Crosslink Density, Chain Molar Mass and Network Modulus (Flory–Rehner)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From the masses of a rubber specimen before swelling, swollen in a solvent and dried again, what is its crosslink density, and is the cure within my acceptance range?",
    "description": "Equilibrium swelling test of a vulcanised rubber or gel: the rubber volume fraction in the swollen specimen from the initial, swollen and dried masses, the rubber share of the compound and the densities, the volume and mass change and the soluble fraction, the crosslink density from the Flory–Rehner equation for a network of the stated functionality with the polymer–liquid interaction parameter you supply (and its sensitivity to that parameter), the molar mass between crosslinks, and the network shear and Young’s moduli this crosslink density implies, against your acceptance range.",
    "keywords": [
      "MAKEOS",
      "Flory–Rehner",
      "crosslink density",
      "swelling test",
      "state of cure",
      "molar mass between crosslinks",
      "Mc",
      "rubber quality",
      "gel",
      "elastomer"
    ],
    "fields": [
      {
        "key": "h_weighings_",
        "label": "Weighings",
        "type": "heading"
      },
      {
        "key": "m0",
        "label": "Initial mass of the specimen",
        "type": "number",
        "default": 2,
        "unit": "g",
        "min": 0.001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ms",
        "label": "Swollen mass at equilibrium",
        "type": "number",
        "default": 6.2,
        "unit": "g",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "md",
        "label": "Dried mass after swelling",
        "type": "number",
        "default": 1.95,
        "unit": "g",
        "min": 0.001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_compound_and_liquid_",
        "label": "Compound and liquid",
        "type": "heading"
      },
      {
        "key": "rhoC",
        "label": "Density of the compound",
        "type": "number",
        "default": 1.12,
        "unit": "g/cm³",
        "min": 0.5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wR",
        "label": "Rubber share of the dried compound mass",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoR",
        "label": "Density of the rubber polymer",
        "type": "number",
        "default": 0.92,
        "unit": "g/cm³",
        "min": 0.5,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoS",
        "label": "Density of the swelling liquid",
        "type": "number",
        "default": 0.867,
        "unit": "g/cm³",
        "min": 0.3,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V1",
        "label": "Molar volume of the swelling liquid",
        "type": "number",
        "default": 106.3,
        "unit": "cm³/mol",
        "min": 10,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "chi",
        "label": "Rubber–liquid interaction parameter χ",
        "type": "number",
        "default": 0.39,
        "unit": "",
        "min": 0,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Crosslink functionality",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 3,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "T",
        "label": "Test temperature",
        "type": "number",
        "default": 23,
        "unit": "°C",
        "min": -50,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_acceptance_range_",
        "label": "Acceptance range",
        "type": "heading"
      },
      {
        "key": "numin",
        "label": "Lowest acceptable crosslink density",
        "type": "number",
        "default": 50,
        "unit": "mol/m³",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "numax",
        "label": "Highest acceptable crosslink density",
        "type": "number",
        "default": 300,
        "unit": "mol/m³",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "polymer-intrinsic-viscosity",
    "name": "Polymer Intrinsic Viscosity and Molar Mass from One Viscometer Reading (Single-Point [η], Mark–Houwink)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From the flow times of the solvent and of one dilute polymer solution in a capillary viscometer, what is the intrinsic viscosity, what viscosity-average molar mass does it imply, and is it within my specification?",
    "description": "Dilute-solution viscometry from one concentration: the relative, specific, reduced and inherent viscosities from the flow times, the intrinsic viscosity by the Solomon–Ciuta, Billmeyer or Huggins single-point relation (all three are reported side by side to show their agreement), the viscosity-average molar mass from Mark–Houwink constants you supply, and the intrinsic viscosity against your specification limits, as used for resin grade and degradation checks.",
    "keywords": [
      "MAKEOS",
      "intrinsic viscosity",
      "IV",
      "single-point viscosity",
      "Solomon–Ciuta",
      "Billmeyer",
      "Huggins",
      "Mark–Houwink",
      "capillary viscometer",
      "molar mass",
      "resin quality"
    ],
    "fields": [
      {
        "key": "h_viscometer_readings_",
        "label": "Viscometer readings",
        "type": "heading"
      },
      {
        "key": "t0",
        "label": "Flow time of the pure solvent",
        "type": "number",
        "default": 100,
        "unit": "s",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Flow time of the polymer solution",
        "type": "number",
        "default": 135,
        "unit": "s",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Polymer concentration of the solution",
        "type": "number",
        "default": 0.5,
        "unit": "g/dL",
        "min": 0.001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_method_and_constants_",
        "label": "Method and constants",
        "type": "heading"
      },
      {
        "key": "method",
        "label": "Single-point relation for the result",
        "type": "select",
        "default": "sc",
        "options": [
          [
            "sc",
            "Solomon–Ciuta"
          ],
          [
            "bm",
            "Billmeyer"
          ],
          [
            "hg",
            "Huggins, with the Huggins constant below"
          ]
        ]
      },
      {
        "key": "kH",
        "label": "Huggins constant kH",
        "type": "number",
        "default": 0.35,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Mark–Houwink constant K",
        "type": "number",
        "default": 0.0005,
        "unit": "dL/g",
        "min": 1e-7,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Mark–Houwink exponent a",
        "type": "number",
        "default": 0.7,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_specification_",
        "label": "Specification",
        "type": "heading"
      },
      {
        "key": "IVmin",
        "label": "Lowest acceptable intrinsic viscosity",
        "type": "number",
        "default": 0.6,
        "unit": "dL/g",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "IVmax",
        "label": "Highest acceptable intrinsic viscosity",
        "type": "number",
        "default": 0.75,
        "unit": "dL/g",
        "min": 0.001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "polymer-melting-point-depression",
    "name": "Polymer Melting or Dissolution Temperature with a Diluent (Flory Melting-Point Depression)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How far does a solvent, plasticiser or other diluent lower the melting point of a semicrystalline polymer, and will its crystals melt (or survive) at my process or service temperature?",
    "description": "Flory’s equation for the melting (liquidus) temperature of a semicrystalline polymer swollen by a diluent: the diluent volume fraction from the mass share and densities, the depressed melting temperature from the pure polymer’s melting point, the heat of fusion and molar volume of its repeat unit, the diluent’s molar volume and the interaction parameter, the depression in kelvin, and the result against a process temperature at which the crystals must melt or dissolve, or a service temperature at which they must survive, with a table of melting temperature against diluent content.",
    "keywords": [
      "MAKEOS",
      "melting point depression",
      "Flory",
      "dissolution temperature",
      "plasticiser",
      "diluent",
      "semicrystalline polymer",
      "liquidus",
      "gel spinning",
      "polymer processing"
    ],
    "fields": [
      {
        "key": "purpose",
        "label": "What the crystals must do",
        "type": "select",
        "default": "melt",
        "options": [
          [
            "melt",
            "Melt or dissolve at the process temperature"
          ],
          [
            "keep",
            "Survive at the service temperature"
          ]
        ]
      },
      {
        "key": "h_polymer_",
        "label": "Polymer",
        "type": "heading"
      },
      {
        "key": "Tm0",
        "label": "Melting temperature of the pure polymer",
        "type": "number",
        "default": 140,
        "unit": "°C",
        "min": -100,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dH",
        "label": "Heat of fusion per mole of repeat unit",
        "type": "number",
        "default": 8000,
        "unit": "J/mol",
        "min": 100,
        "max": 200000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vu",
        "label": "Molar volume of the repeat unit",
        "type": "number",
        "default": 33,
        "unit": "cm³/mol",
        "min": 5,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoP",
        "label": "Density of the amorphous polymer",
        "type": "number",
        "default": 0.85,
        "unit": "g/cm³",
        "min": 0.5,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_diluent_",
        "label": "Diluent",
        "type": "heading"
      },
      {
        "key": "V1",
        "label": "Molar volume of the diluent",
        "type": "number",
        "default": 150,
        "unit": "cm³/mol",
        "min": 10,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho1",
        "label": "Density of the diluent",
        "type": "number",
        "default": 0.9,
        "unit": "g/cm³",
        "min": 0.5,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w1",
        "label": "Diluent share of the mixture by mass",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 0,
        "max": 99.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "chi",
        "label": "Polymer–diluent interaction parameter χ",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": -2,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_temperature_",
        "label": "Temperature",
        "type": "heading"
      },
      {
        "key": "Tp",
        "label": "Process or service temperature",
        "type": "number",
        "default": 135,
        "unit": "°C",
        "min": -100,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Required temperature margin",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "dls-particle-size",
    "name": "Particle and Polymer Coil Size from Dynamic Light Scattering (Decay Rate, Diffusion Coefficient, Stokes–Einstein)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From the decay rate of a dynamic light scattering correlation function, what are the diffusion coefficient and hydrodynamic size of the particles or polymer coils, and are they within my specification?",
    "description": "Dynamic light scattering (photon correlation) reduced by hand: the scattering vector from the laser wavelength, the refractive index of the liquid and the scattering angle, the field decay rate (half the decay rate of the intensity correlation), the translational diffusion coefficient D = Γ ÷ q², the hydrodynamic radius and diameter from the Stokes–Einstein equation at the liquid’s temperature and viscosity, the product qRh that shows whether internal motion of flexible coils can enter the decay, and the size against your specification limits.",
    "keywords": [
      "MAKEOS",
      "dynamic light scattering",
      "DLS",
      "photon correlation spectroscopy",
      "Stokes–Einstein",
      "hydrodynamic radius",
      "diffusion coefficient",
      "particle size",
      "emulsion",
      "nanoparticles",
      "polymer coil"
    ],
    "fields": [
      {
        "key": "h_instrument_",
        "label": "Instrument",
        "type": "heading"
      },
      {
        "key": "lam",
        "label": "Laser wavelength in vacuum",
        "type": "number",
        "default": 632.8,
        "unit": "nm",
        "min": 200,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nr",
        "label": "Refractive index of the liquid",
        "type": "number",
        "default": 1.332,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Scattering angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measurement_",
        "label": "Measurement",
        "type": "heading"
      },
      {
        "key": "corr",
        "label": "Correlation function the decay rate was fitted to",
        "type": "select",
        "default": "g2",
        "options": [
          [
            "g2",
            "Intensity correlation g₂(τ) − 1"
          ],
          [
            "g1",
            "Field correlation g₁(τ)"
          ]
        ]
      },
      {
        "key": "Gm",
        "label": "Measured decay rate",
        "type": "number",
        "default": 6000,
        "unit": "1/s",
        "min": 0.01,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Sample temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -20,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Viscosity of the liquid at the sample temperature",
        "type": "number",
        "default": 0.89,
        "unit": "mPa·s",
        "min": 0.01,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_specification_",
        "label": "Specification",
        "type": "heading"
      },
      {
        "key": "dmin",
        "label": "Smallest acceptable hydrodynamic diameter",
        "type": "number",
        "default": 40,
        "unit": "nm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dmax",
        "label": "Largest acceptable hydrodynamic diameter",
        "type": "number",
        "default": 80,
        "unit": "nm",
        "min": 0.1,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
