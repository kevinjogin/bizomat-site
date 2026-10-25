// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook24).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "plastic-gear-power": {
    "purpose": "Power rating of plastics spur, helical and straight bevel gears by the handbook’s Lewis-type formulas in metric form, from face width, tooth form factor, module, safe bending stress, pitch-line velocity and service factor, with the corresponding torque.",
    "uses": [
      "Check whether a plastics gear can replace a metal one",
      "Size face width or module for a plastics gear train",
      "Rate a molded gear at a new speed"
    ],
    "users": [
      "Design engineers",
      "Product engineers",
      "Gear designers"
    ],
    "inputs": {
      "type": "Gear type.",
      "F": "Face width.",
      "Y": "Lewis tooth form factor for the tooth count and system (from the handbook table or the material supplier).",
      "m": "Module (normal module for helical gears).",
      "Ss": "Safe bending stress of the plastic at the operating temperature and lubrication (from the material supplier).",
      "d": "Pitch diameter, for the pitch-line velocity.",
      "rpm": "Speed of the gear.",
      "Cs": "Service factor for the load type and running hours.",
      "C": "Pitch cone distance of a bevel gear (must exceed the face width)."
    },
    "outputs": [
      "Pitch-line velocity",
      "Power rating",
      "Torque at the rating"
    ],
    "method": [
      "V = π d n ÷ 60,000 m/s.",
      "Spur: kW = F Y m S_s V ÷ [327 (3.05 + V) C_s].",
      "Helical: kW = F Y m S_s V ÷ [179 (5.56 + V) C_s]; straight bevel: the spur value × (C − F) ÷ C.",
      "The metric constants match the US-customary forms (55 (600 + V) P C_s and 423 (78 + V) P_n C_s).",
      "Example: a 10 mm wide, module 1.5 spur gear at 600 rpm is rated about 143.19 W."
    ],
    "limitations": [
      "Bending strength only; wear, heat build-up and creep often govern plastics gears.",
      "Plastics strength falls with temperature and moisture: use the stress for the service condition.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Plastics gears running against metal pinions wear less and run cooler than plastic-on-plastic pairs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 604–606. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "plastic-thermal-mismatch": {
    "purpose": "Thermal stress in a plastics part fully restrained by a metal part, σ = (α_m − α_p) E_p ΔT, and the relative movement between unrestrained plastic and metal parts, from their expansion coefficients, the plastic’s modulus at temperature (or an apparent creep modulus from a creep curve) and the temperature change.",
    "uses": [
      "Check a plastic housing screwed or bonded to a metal frame",
      "Size slots or clearances for a plastic cover on metal",
      "Estimate long-term stress using creep modulus"
    ],
    "users": [
      "Design engineers",
      "Product engineers",
      "Materials engineers"
    ],
    "inputs": {
      "am": "Linear expansion coefficient of the metal part.",
      "ap": "Linear expansion coefficient of the plastic part.",
      "emode": "Use the modulus at temperature, or derive an apparent modulus from a creep curve for long-held loads.",
      "Ep": "Tensile modulus of the plastic at the temperature involved.",
      "sc": "Stress level read on the creep curve.",
      "ec": "Strain at that stress after the time of interest.",
      "dT": "Temperature change from assembly (negative for cooling).",
      "L": "Length between fixing points (or a hole diameter).",
      "allow": "Allowable stress for the plastic in tension or compression."
    },
    "outputs": [
      "Thermal stress in the restrained plastic",
      "Relative movement if unrestrained",
      "Apparent modulus used"
    ],
    "method": [
      "Fully restrained plastic: σ = (α_m − α_p) E_p ΔT (handbook formula 29).",
      "Unrestrained: relative movement ΔL_rel = (α_p − α_m) L ΔT (formula 30).",
      "Apparent creep modulus E_app = σ ÷ ε_c from the creep curve.",
      "Example: a plastic part restrained by steel over a 40 K rise carries about 5.464 MPa; unrestrained it moves 0.2732 mm relative to the metal over 100 mm."
    ],
    "limitations": [
      "Full restraint is an upper bound; fixings that slip or flex relieve stress.",
      "Plastics relax under sustained stress; the creep modulus gives the longer-term value.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cooling usually puts the plastic in tension, which is the cracking risk; allow slotted holes or flexible fixings."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 578–580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "set-screw-holding": {
    "purpose": "Safe power and torque a cup-point set screw can transmit without slipping by the handbook’s empirical formulas, the corresponding holding force at the shaft surface, and the number of set screws needed for a required power.",
    "uses": [
      "Check a set-screwed pulley, collar or gear on a shaft",
      "Decide whether to add a second set screw or a key",
      "Choose set-screw size for a light drive"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Machine builders"
    ],
    "inputs": {
      "D": "Diameter of the shaft.",
      "d": "Nominal diameter of the set screw.",
      "rpm": "Shaft speed.",
      "P": "Power the joint must transmit."
    },
    "outputs": [
      "Power and torque per set screw",
      "Holding force at the shaft surface",
      "Set screws required"
    ],
    "method": [
      "Power per screw P = D N d^2.3 ÷ 50 hp, and torque T = 1250 D d^2.3 lb-in, with D and d in inches (converted here).",
      "Holding force at the shaft surface = T ÷ (D ÷ 2) ≈ 2500 d^2.3 lb (about 500 lb for a ½-in. screw, as the handbook lists).",
      "Handbook example: a ½-in. screw on a 1-in. shaft at 1000 rpm holds 4.1 hp.",
      "Example: a 12.7 mm set screw on a 25.4 mm shaft at 1000 rpm holds about 4.0613 hp."
    ],
    "limitations": [
      "Cup-point set screws seated on a plain shaft; varies with hardness of screw and shaft.",
      "Vibration and reversing loads loosen set screws: use a key for anything beyond light duty.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Two screws at 90° hold more securely than one; a flat on the shaft also helps."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1699–1700. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
