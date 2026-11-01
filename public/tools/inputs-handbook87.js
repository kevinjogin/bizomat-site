// KEVOS® WORKOS input guides: handbook87. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook87.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "area-converter": {
    value: {
      what: "The area you want to convert, exactly as written on the drawing, plan or data sheet.",
      tip: "Square units scale with the square of the length unit: 1 ft² is 144 in², not 12.",
      effect: "Every converted value is proportional to it.",
      fig: "area",
      sym: "A"
    },
    from: {
      what: "The unit the area was given in; the tool converts it to every other listed area unit.",
      tip: "Circular mils are used for wire sizes; acres and hectares for land.",
      effect: "Sets the factor applied to the value.",
      fig: "choice",
      sym: "unit"
    }
  },
  "volume-converter": {
    value: {
      what: "The volume or capacity you want to convert, exactly as written on the drawing, label or data sheet.",
      tip: "US and Imperial gallons, quarts, pints and fluid ounces differ; check which the source uses.",
      effect: "Every converted value is proportional to it.",
      fig: "volume",
      sym: "V"
    },
    from: {
      what: "The unit the volume was given in; the tool converts it to every other listed volume unit.",
      tip: "A litre is a cubic decimetre; a millilitre is a cubic centimetre.",
      effect: "Sets the factor applied to the value.",
      fig: "choice",
      sym: "unit"
    }
  },
  "inertia-converter": {
    value: {
      what: "The moment of inertia, section modulus or momentum you want to convert, as written in the source.",
      tip: "WR² on motor data sheets is a mass moment of inertia in lb·ft².",
      effect: "Every converted value is proportional to it.",
      fig: "inertia",
      sym: "I"
    },
    from: {
      what: "The unit the value was given in, which also sets the kind of quantity converted.",
      tip: "in⁴ and mm⁴ are second moments of area for bending; kg·m² and lb·ft² are mass moments of inertia for rotation.",
      effect: "Chooses the kind of quantity and the factor applied.",
      fig: "choice",
      sym: "unit"
    }
  },
  "silent-chain-sprocket-inspection": {
    P: {
      what: "Pitch of the silent chain the sprocket is cut for, 3/8 in (9.525 mm) or larger.",
      tip: "Read it from the chain number: SC8 is 1 in pitch, SC4 is 1/2 in.",
      effect: "All diameters and the tolerance grow with the pitch.",
      fig: "pitch",
      sym: "P"
    },
    Nt: {
      what: "Number of teeth on the sprocket being inspected.",
      tip: "Count them; odd numbers of teeth use the odd-tooth over-pin formula.",
      effect: "Sets every diameter and widens the over-pin tolerance with √N.",
      fig: "teeth",
      sym: "N"
    },
    OPDm: {
      what: "Diameter measured over two gauge pins of 0.625 × pitch placed in opposite tooth spaces.",
      tip: "For an odd number of teeth use the spaces nearest to opposite; take the largest reading.",
      effect: "Fails the sprocket above nominal or below the lower limit.",
      fig: "diameter",
      sym: "OPD_m"
    },
    TIRm: {
      what: "Total indicator reading of the pitch diameter with the sprocket turned on its bore.",
      tip: "Mount the sprocket on an arbor in its bore and indicate over pins or the teeth.",
      effect: "Fails the sprocket when it exceeds the eccentricity limit.",
      fig: "tolerance",
      sym: "TIR"
    },
    Gm: {
      what: "Diameter measured at the bottom of the guide groove for the chain guide links.",
      tip: "Measure across the groove bottom with a groove micrometer or calipers.",
      effect: "Fails the sprocket outside +0, −0.030 in of the maximum groove diameter.",
      fig: "diameter",
      sym: "G_m"
    }
  },
  "fuel-oil-heating-value": {
    from: {
      what: "Whether the oil gravity is entered in degrees Baumé or as a specific gravity.",
      tip: "Supplier sheets may give API gravity instead; convert that first.",
      effect: "Chooses which of the two gravity inputs is used.",
      fig: "choice",
      sym: "grav"
    },
    be: {
      what: "Gravity of the oil on the Baumé hydrometer scale for liquids lighter than water.",
      tip: "Read the hydrometer at 60 °F (15.6 °C) or correct the reading to it.",
      effect: "Higher Baumé means a lighter oil with more heat per kilogram.",
      fig: "density",
      sym: "°Bé"
    },
    sg: {
      what: "Specific gravity of the oil relative to water, both at 60 °F.",
      tip: "Fuel oils are about 0.82 to 0.95; take it from the supplier’s certificate.",
      effect: "A lighter oil gives a higher heating value per kilogram.",
      fig: "density",
      sym: "SG"
    },
    Q: {
      what: "Useful heat the burner, boiler or heater must deliver.",
      tip: "Use the heat load, not the burner’s maximum firing rate.",
      effect: "Oil burned rises in proportion.",
      fig: "power",
      sym: "Q"
    },
    eff: {
      what: "Efficiency of the appliance: the share of the fuel’s heat that becomes useful heat.",
      tip: "Take it from the data plate or a combustion test; check whether it is on gross or net heating value.",
      effect: "Lower efficiency burns more oil for the same output.",
      fig: "efficiency",
      sym: "η"
    },
    hours: {
      what: "Hours the appliance runs at the heat output entered.",
      tip: "Use equivalent full-load hours for a varying load.",
      effect: "Only changes the oil used over the period.",
      fig: "time",
      sym: "t"
    }
  },
  "surface-roughness-acceptance": {
    rule: {
      what: "Comparison rule for the roughness callout: the default 16 % rule, or the max rule when the parameter is marked max.",
      tip: "Rz1.5max on a drawing means the max rule; Ra 0.8 without max means the 16 % rule.",
      effect: "Changes which measured values decide acceptance.",
      fig: "choice",
      sym: "rule"
    },
    U: {
      what: "Upper limit of the roughness parameter from the drawing callout.",
      tip: "Check the parameter (Ra, Rz) matches what the instrument reports.",
      effect: "Values above it count against the surface.",
      fig: "roughness",
      sym: "U"
    },
    lower: {
      what: "Whether the drawing also sets a lower limit for the roughness parameter.",
      tip: "Lower limits are used on bearing and sealing surfaces that must hold oil.",
      effect: "Adds the lower-limit check.",
      fig: "choice",
      sym: "L?"
    },
    Lw: {
      what: "Lower limit of the roughness parameter when the drawing specifies one.",
      tip: "Must be below the upper limit.",
      effect: "Values below it count against the surface.",
      fig: "roughness",
      sym: "L"
    },
    n: {
      what: "Total number of roughness values measured on the surface.",
      tip: "More readings make the 16 % share meaningful; one in six is already 16.7 %.",
      effect: "Sets the share that each value over the limit represents.",
      fig: "count",
      sym: "n"
    },
    nAbove: {
      what: "How many of the measured values are above the upper limit.",
      tip: "Count readings, not places; repeat a doubtful reading rather than discard it.",
      effect: "Rejects the surface when more than 16 % are above.",
      fig: "count",
      sym: "n_U"
    },
    nBelow: {
      what: "How many of the measured values are below the lower limit.",
      tip: "Only used when a lower limit is specified.",
      effect: "Rejects the surface when more than 16 % are below.",
      fig: "count",
      sym: "n_L"
    },
    vmax: {
      what: "Largest single roughness value measured anywhere on the surface.",
      tip: "Under the max rule search the whole surface for the worst area.",
      effect: "Decides the max rule.",
      fig: "roughness",
      sym: "v_max"
    },
    vmin: {
      what: "Smallest single roughness value measured on the surface.",
      tip: "Used against a lower limit under the max rule.",
      effect: "Decides the lower limit under the max rule.",
      fig: "roughness",
      sym: "v_min"
    },
    mean: {
      what: "Arithmetic mean of all the roughness values measured.",
      tip: "Most roughness testers report it over a set of readings.",
      effect: "With the standard deviation, decides the normal-distribution exception.",
      fig: "roughness",
      sym: "μ"
    },
    sd: {
      what: "Standard deviation of the roughness values measured.",
      tip: "Use the sample standard deviation of the same readings as the mean.",
      effect: "A larger spread makes the exception harder to meet.",
      fig: "roughness",
      sym: "σ"
    },
    lr: {
      what: "Sampling length (filter cut-off) used for each roughness value.",
      tip: "0.8 mm is common for turned and ground surfaces; use the drawing value if one is given.",
      effect: "Sets the evaluation length of five sampling lengths.",
      fig: "length",
      sym: "l_r"
    }
  }
});
