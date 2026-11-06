// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook33) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "spline-joint-design",
    "name": "Spline Joint Design (Engagement Length and Stresses)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How long must this involute spline engage to carry the torque, and are the shaft and teeth within their allowable stresses?",
    "description": "Design of a metric-module involute spline joint (30° flat-root proportions): pitch, minor diameter, tooth thickness and working depth from module and tooth count, root shear stress of the shaft, the engagement length needed for tooth shear at the pitch line and for tooth compression (fixed or flexible spline), and the stresses at the length chosen, by the same method as the spline torque capacity tool.",
    "keywords": [
      "MAKEOS",
      "spline design",
      "spline engagement length",
      "involute spline",
      "spline shear stress",
      "spline compressive stress",
      "splined shaft"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.25,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 6,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Le",
        "label": "Engagement length",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dh",
        "label": "Bore of a hollow shaft (0 = solid)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kind",
        "label": "Spline type",
        "type": "select",
        "default": "fixed",
        "options": [
          [
            "fixed",
            "Fixed (no sliding)"
          ],
          [
            "flexible",
            "Flexible (sliding or misaligned)"
          ]
        ]
      },
      {
        "key": "acc",
        "label": "Spacing accuracy",
        "type": "select",
        "default": "good",
        "options": [
          [
            "good",
            "Good (load shared by about half the teeth)"
          ],
          [
            "poor",
            "Ordinary (load shared by about a third of the teeth)"
          ]
        ]
      },
      {
        "key": "Ka",
        "label": "Application factor",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Km",
        "label": "Load distribution factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kf",
        "label": "Fatigue life factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kw",
        "label": "Wear life factor (flexible splines)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sc",
        "label": "Allowable compressive stress",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ballscrew-axis-stiffness",
    "name": "Ball-Screw Axis Stiffness, Preload and Axial Frequency",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How stiff is this ball-screw axis, how far will it deflect under load, is the nut preload right, and what is the axial natural frequency?",
    "description": "Axial stiffness of a ball-screw feed axis: screw shaft stiffness for thrust bearings at one end or both ends, combined in series with the nut and support bearing stiffnesses, deflection under the largest axial load, the preload needed so the preloaded nut does not unload (load ÷ 2.83), preload drag torque, preload as a share of the dynamic rating and the axial natural frequency of the moving mass on the axis stiffness.",
    "keywords": [
      "MAKEOS",
      "ball screw stiffness",
      "axial stiffness",
      "ball nut preload",
      "lost motion",
      "preload drag torque",
      "axis natural frequency"
    ],
    "fields": [
      {
        "key": "d0",
        "label": "Nominal screw diameter",
        "type": "number",
        "default": 32,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dr",
        "label": "Screw root diameter",
        "type": "number",
        "default": 27,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l",
        "label": "Lead",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "Thrust bearing layout",
        "type": "select",
        "default": "both",
        "options": [
          [
            "both",
            "Thrust bearings at both ends (fixed–fixed)"
          ],
          [
            "one",
            "Thrust bearing at one end (fixed–free or fixed–supported)"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Span (between thrust bearings, or thrust bearing to farthest nut position)",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kn",
        "label": "Nut stiffness (catalogue, at the preload)",
        "type": "number",
        "default": 600,
        "unit": "N/µm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kb",
        "label": "Support bearing stiffness",
        "type": "number",
        "default": 1000,
        "unit": "N/µm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Largest axial load",
        "type": "number",
        "default": 3000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dAllow",
        "label": "Allowable elastic deflection",
        "type": "number",
        "default": 20,
        "unit": "µm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fp",
        "label": "Nut preload",
        "type": "number",
        "default": 1200,
        "unit": "N",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ca",
        "label": "Dynamic load rating",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMax",
        "label": "Largest preload as a share of the dynamic rating",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mt",
        "label": "Moving mass (table, workpiece, fixture)",
        "type": "number",
        "default": 200,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fReq",
        "label": "Least axial natural frequency wanted",
        "type": "number",
        "default": 50,
        "unit": "Hz",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tank-heater-sizing",
    "name": "Electric Tank Heater Sizing (Heat-up, Losses and Watt Density)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much heater power will bring this tank up to temperature in time, and is the installed heater’s surface loading safe for the liquid?",
    "description": "Sizing of an electric immersion heater for a tank: energy to heat the liquid and the vessel (as the heating energy tool), average surface loss during heat-up and holding loss at temperature from an overall loss coefficient, the power needed for the heat-up time with a margin, the heat-up time with the installed heater, holding duty and the element surface watt density against your limit for the liquid.",
    "keywords": [
      "MAKEOS",
      "tank heater sizing",
      "immersion heater",
      "watt density",
      "heat-up time",
      "heat loss",
      "electric heating"
    ],
    "fields": [
      {
        "key": "h_tank_and_liquid",
        "label": "Tank and liquid",
        "type": "heading"
      },
      {
        "key": "V",
        "label": "Liquid volume",
        "type": "number",
        "default": 1000,
        "unit": "L",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Liquid specific heat",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mv",
        "label": "Vessel mass heated",
        "type": "number",
        "default": 200,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cv",
        "label": "Vessel specific heat",
        "type": "number",
        "default": 0.5,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T0",
        "label": "Starting temperature",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": -50,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ts",
        "label": "Set temperature",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -50,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tamb",
        "label": "Ambient temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -50,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Tank surface area losing heat",
        "type": "number",
        "default": 6,
        "unit": "m²",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "U",
        "label": "Overall loss coefficient",
        "type": "number",
        "default": 2,
        "unit": "W/m²·K",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th",
        "label": "Heat-up time wanted",
        "type": "number",
        "default": 3,
        "unit": "h",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "marg",
        "label": "Power margin",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_heater",
        "label": "Heater",
        "type": "heading"
      },
      {
        "key": "Pinst",
        "label": "Installed heater power",
        "type": "number",
        "default": 21,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of elements",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Ae",
        "label": "Heated surface per element",
        "type": "number",
        "default": 1000,
        "unit": "cm²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wdMax",
        "label": "Largest watt density for the liquid",
        "type": "number",
        "default": 8,
        "unit": "W/cm²",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hydraulic-line-sizing",
    "name": "Hydraulic Line Sizing (Velocity, Pressure Drop and Tube Rating)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Is this tube big enough for the flow, how much pressure does the line lose, and is the tube rated for the system pressure?",
    "description": "Sizing check of a hydraulic pressure, return or suction line: the least bore for the flow at your velocity limit (as the pipe size by velocity tool), the actual velocity, Reynolds number, friction factor and pressure drop through the line and fittings (as the pipe friction tool), the power lost, and the tube burst pressure by Barlow’s formula on the outside diameter with the working pressure rating at your design factor.",
    "keywords": [
      "MAKEOS",
      "hydraulic line sizing",
      "hydraulic tube",
      "fluid velocity",
      "line pressure drop",
      "tube pressure rating",
      "Barlow formula"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 60,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Velocity limit for this line",
        "type": "number",
        "default": 5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 15,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "di",
        "label": "Tube bore",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "do",
        "label": "Tube outside diameter",
        "type": "number",
        "default": 22,
        "unit": "mm",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Working pressure",
        "type": "number",
        "default": 160,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Su",
        "label": "Tube tensile strength",
        "type": "number",
        "default": 410,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "DF",
        "label": "Design factor (burst ÷ working)",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Line length",
        "type": "number",
        "default": 10,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Sum of fitting loss coefficients",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Oil viscosity at working temperature",
        "type": "number",
        "default": 46,
        "unit": "cSt",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Oil density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Tube roughness",
        "type": "number",
        "default": 0.0015,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dpMax",
        "label": "Allowed pressure drop in the line",
        "type": "number",
        "default": 5,
        "unit": "bar",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "holding-brake-sizing",
    "name": "Spring-Applied Holding Brake Sizing (Stop Time, Energy and Holding)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Will this spring-applied brake stop and hold the load in time, and can it absorb the stopping energy at this number of stops per hour?",
    "description": "Check of a spring-applied (fail-safe) motor brake: kinetic energy of the inertia at the motor shaft, the net decelerating torque with the load either driving through the stop (lowering, overhauling) or helping it, slip time and total stop time with the engagement delay, stopping angle, friction energy per stop and per hour against the brake’s permissible values, the brake torque needed for the required stop time, and the holding factor on the static load torque.",
    "keywords": [
      "MAKEOS",
      "holding brake",
      "spring-applied brake",
      "motor brake sizing",
      "stopping time",
      "brake energy",
      "fail-safe brake"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Speed at the brake",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "J",
        "label": "Total inertia at the brake shaft",
        "type": "number",
        "default": 0.05,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TL",
        "label": "Load torque at the brake shaft",
        "type": "number",
        "default": 20,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir",
        "label": "Load during the stop",
        "type": "select",
        "default": "over",
        "options": [
          [
            "over",
            "Load drives through the stop (lowering, downhill)"
          ],
          [
            "assist",
            "Load helps the stop (lifting, friction)"
          ]
        ]
      },
      {
        "key": "Tb",
        "label": "Brake torque (dynamic rating)",
        "type": "number",
        "default": 60,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "td",
        "label": "Engagement delay",
        "type": "number",
        "default": 0.05,
        "unit": "s",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "treq",
        "label": "Required total stop time",
        "type": "number",
        "default": 0.5,
        "unit": "s",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SFh",
        "label": "Holding factor required",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Wmax",
        "label": "Permissible energy per stop",
        "type": "number",
        "default": 5,
        "unit": "kJ",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Stops per hour",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Wh",
        "label": "Permissible energy per hour",
        "type": "number",
        "default": 100,
        "unit": "kJ",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "weld-preheat-check",
    "name": "Weld Preheat and Cooling Time Check (CE, Heat Input, t8/5)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Does this steel need preheat for this thickness, and will my heat input and preheat give a cooling time in the range my procedure wants?",
    "description": "Screening check of a welding procedure for carbon and low-alloy steel: carbon equivalent CE (IIW) and Pcm from the composition (as the carbon equivalent tool), a preheat estimate by Séférian’s formula for the plate thickness, heat input from voltage, current, travel speed and process efficiency (as the welding heat input tool), and the cooling time from 800 to 500 °C (t8/5) for thick-plate (three-dimensional) and thin-plate (two-dimensional) heat flow, with the governing case compared to your window.",
    "keywords": [
      "MAKEOS",
      "weld preheat",
      "carbon equivalent",
      "t8/5 cooling time",
      "heat input",
      "hydrogen cracking",
      "Seferian"
    ],
    "fields": [
      {
        "key": "h_composition_",
        "label": "Composition (%)",
        "type": "heading"
      },
      {
        "key": "C",
        "label": "Carbon",
        "type": "number",
        "default": 0.18,
        "unit": "%",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mn",
        "label": "Manganese",
        "type": "number",
        "default": 1.3,
        "unit": "%",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Si",
        "label": "Silicon",
        "type": "number",
        "default": 0.3,
        "unit": "%",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cr",
        "label": "Chromium",
        "type": "number",
        "default": 0.1,
        "unit": "%",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mo",
        "label": "Molybdenum",
        "type": "number",
        "default": 0.02,
        "unit": "%",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Vanadium",
        "type": "number",
        "default": 0.01,
        "unit": "%",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ni",
        "label": "Nickel",
        "type": "number",
        "default": 0.1,
        "unit": "%",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cu",
        "label": "Copper",
        "type": "number",
        "default": 0.15,
        "unit": "%",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Boron",
        "type": "number",
        "default": 0,
        "unit": "%",
        "min": 0,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_joint_and_welding",
        "label": "Joint and welding",
        "type": "heading"
      },
      {
        "key": "th",
        "label": "Plate thickness",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "U",
        "label": "Arc voltage",
        "type": "number",
        "default": 28,
        "unit": "V",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Welding current",
        "type": "number",
        "default": 250,
        "unit": "A",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vt",
        "label": "Travel speed",
        "type": "number",
        "default": 250,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Process thermal efficiency",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T0",
        "label": "Preheat (interpass) temperature",
        "type": "number",
        "default": 150,
        "unit": "°C",
        "min": 0,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F3",
        "label": "Joint shape factor, thick plate",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F2",
        "label": "Joint shape factor, thin plate",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_your_procedure_limits",
        "label": "Your procedure limits",
        "type": "heading"
      },
      {
        "key": "CElim",
        "label": "CE above which preheat is required",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0.2,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tMin",
        "label": "Shortest t8/5 wanted",
        "type": "number",
        "default": 10,
        "unit": "s",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tMax",
        "label": "Longest t8/5 wanted",
        "type": "number",
        "default": 25,
        "unit": "s",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "snap-fit-joint-design",
    "name": "Snap-Fit Joint Design (Deflection, Assembly and Retention Forces)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How far can this snap-fit finger deflect, how hard is it to push together, and how much force will hold it closed?",
    "description": "Design of a cantilever snap-fit joint in plastic: the largest undercut the finger can take at the permissible strain, the assembly strain for the undercut chosen, deflection force and mating force over the lead-in angle (as the snap-fit tool), the separation force over the retaining angle (or self-locking when the retaining face cannot slide), and the bending stress at the root.",
    "keywords": [
      "MAKEOS",
      "snap-fit design",
      "cantilever snap",
      "retention force",
      "mating force",
      "plastic clip",
      "undercut"
    ],
    "fields": [
      {
        "key": "Y",
        "label": "Undercut (deflection)",
        "type": "number",
        "default": 1.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Finger thickness at the root",
        "type": "number",
        "default": 1.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Finger length",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Finger width",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Geometry factor (1 = constant section; higher for a tapered finger)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Secant modulus at the strain",
        "type": "number",
        "default": 2300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eAllow",
        "label": "Permissible strain",
        "type": "number",
        "default": 2.5,
        "unit": "%",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Lead-in angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 5,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Retaining (return) angle",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 5,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Freq",
        "label": "Retention force wanted",
        "type": "number",
        "default": 10,
        "unit": "N",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "worm-gear-drive-design",
    "name": "Worm Gear Drive Design (Efficiency, Forces and Heat)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What torque and forces does this worm drive deliver, how much heat does it make, will the housing stay cool enough, and is it self-locking?",
    "description": "Design check of a worm gear drive: ratio, lead angle and efficiency from module, starts, teeth, worm diameter and friction (as the worm gear tool), sliding velocity, input and output torque, tangential, axial and separating forces on worm and wheel, power lost as heat and the oil temperature from the housing surface and heat transfer coefficient, and a self-locking check when the load must be held.",
    "keywords": [
      "MAKEOS",
      "worm gear drive",
      "worm efficiency",
      "self-locking worm",
      "worm thrust",
      "sliding velocity",
      "worm gearbox heat"
    ],
    "fields": [
      {
        "key": "P1",
        "label": "Input power",
        "type": "number",
        "default": 1.1,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Worm speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mx",
        "label": "Axial module",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.5,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Worm starts",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Wheel teeth",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 10,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d1",
        "label": "Worm pitch diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alphan",
        "label": "Normal pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient at the sliding speed",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0.005,
        "max": 0.3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ah",
        "label": "Housing surface area",
        "type": "number",
        "default": 0.8,
        "unit": "m²",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kh",
        "label": "Heat transfer coefficient",
        "type": "number",
        "default": 18,
        "unit": "W/m²·K",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tamb",
        "label": "Ambient temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -40,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Highest oil temperature",
        "type": "number",
        "default": 90,
        "unit": "°C",
        "min": 0.000001,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lock",
        "label": "Must the drive hold the load by itself?",
        "type": "select",
        "default": "no",
        "options": [
          [
            "no",
            "No (a brake holds it, or it does not matter)"
          ],
          [
            "yes",
            "Yes (must be statically self-locking)"
          ]
        ]
      }
    ]
  },
  {
    "id": "lifting-lug-design",
    "name": "Lifting Lug Design (Plate, Pin and Bearing Checks)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Is this pinned lifting lug strong enough for the sling load: net tension, tear-out, bearing and pin shear?",
    "description": "Check of a plate lifting lug with a pin or shackle: the load per sling leg from the total load, number of legs, sling angle and a dynamic factor, net-section tension across the hole, shear tear-out beyond the hole, bearing of the pin on the plate, double-shear stress in the pin (as the bolt and pin shear tool), utilisation of each against your allowables and the hole clearance.",
    "keywords": [
      "MAKEOS",
      "lifting lug",
      "padeye",
      "lug tear-out",
      "pin shear",
      "bearing stress",
      "sling angle"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Total load lifted",
        "type": "number",
        "default": 200,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "legs",
        "label": "Sling legs sharing the load",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "ang",
        "label": "Sling angle from vertical",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dyn",
        "label": "Dynamic factor",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Lug plate thickness",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Distance from hole centre to the plate edge (in the load direction)",
        "type": "number",
        "default": 55,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dh",
        "label": "Hole diameter",
        "type": "number",
        "default": 34,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pin diameter",
        "type": "number",
        "default": 32,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable tensile stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tA",
        "label": "Allowable shear stress (plate)",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bA",
        "label": "Allowable bearing stress",
        "type": "number",
        "default": 225,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tP",
        "label": "Allowable shear stress (pin)",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "clr",
        "label": "Largest hole clearance",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
