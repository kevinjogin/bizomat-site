// BIZOMAT Tools input guides: handbook97. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook97.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "narrow-v-belt-rating": {
    sec: {
      what: "Cross section of the narrow V-belt to rate.",
      tip: "Use the handbook selection chart for the design power and speed of the faster shaft.",
      effect: "Sets the constants of the rating formula.",
      fig: "choice",
      sym: "sec"
    },
    dp: {
      what: "Pitch diameter of the smaller sheave, where the belt bends most.",
      tip: "Use at least the minimum diameter recommended for the section and speed.",
      effect: "A larger small sheave raises the rating per belt.",
      fig: "diameter",
      sym: "d_p"
    },
    Dp: {
      what: "Pitch diameter of the larger sheave of the drive.",
      tip: "Dp ÷ dp is the speed ratio used to read the speed ratio factor.",
      effect: "Sets the speed ratio and the arc of contact.",
      fig: "diameter",
      sym: "D_p"
    },
    C: {
      what: "Distance between the centres of the two shafts.",
      tip: "Measure between shaft centres with the belt at working tension.",
      effect: "A shorter centre distance reduces the arc of contact.",
      fig: "length",
      sym: "C"
    },
    n: {
      what: "Speed of the faster shaft, the one with the smaller sheave.",
      tip: "Use the motor speed for a speed-reducing drive.",
      effect: "The rating rises with speed until the belt speed limits it.",
      fig: "rotation",
      sym: "n"
    },
    KSR: {
      what: "Speed ratio correction added to the narrow V-belt rating.",
      tip: "Read it from the handbook table for the section and the speed ratio shown; 0 for a ratio of 1.00.",
      effect: "Adds KSR × r to the rating per belt.",
      fig: "factor",
      sym: "K_SR"
    },
    kL: {
      what: "Correction for belts longer or shorter than the average length.",
      tip: "Read it from the handbook table for the belt length and section.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_L"
    },
    kA: {
      what: "Correction for an arc of contact less than 180° on the small sheave.",
      tip: "Read it from the handbook table for the arc the tool shows.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_θ"
    },
    P: {
      what: "Power the drive must transmit to the driven machine.",
      tip: "Use the motor rating or the measured power of the driven machine.",
      effect: "Times the service factor, sets the design power.",
      fig: "power",
      sym: "P"
    },
    SF: {
      what: "Factor for the type of driver, driven machine and hours of running.",
      tip: "Take it from the handbook service factor tables for the belt type.",
      effect: "Raises the design power the belts must carry.",
      fig: "factor",
      sym: "SF"
    },
    nb: {
      what: "Number of belts you intend to fit on the sheaves.",
      tip: "Fit at least the number the tool shows as needed.",
      effect: "Fails the drive when fewer belts are fitted than needed.",
      fig: "count",
      sym: "N_b"
    }
  },
  "classical-v-belt-rating": {
    sec: {
      what: "Cross section of the classical V-belt to rate.",
      tip: "X marks the cogged belts, which suit smaller sheaves.",
      effect: "Sets the constants of the rating formula.",
      fig: "choice",
      sym: "sec"
    },
    dp: {
      what: "Pitch diameter of the smaller sheave, where the belt bends most.",
      tip: "Use at least the minimum diameter recommended for the section and speed.",
      effect: "A larger small sheave raises the rating per belt.",
      fig: "diameter",
      sym: "d_p"
    },
    Dp: {
      what: "Pitch diameter of the larger sheave of the drive.",
      tip: "Dp ÷ dp is the speed ratio used to read the speed ratio factor.",
      effect: "Sets the speed ratio and the arc of contact.",
      fig: "diameter",
      sym: "D_p"
    },
    C: {
      what: "Distance between the centres of the two shafts.",
      tip: "Measure between shaft centres with the belt at working tension.",
      effect: "A shorter centre distance reduces the arc of contact.",
      fig: "length",
      sym: "C"
    },
    n: {
      what: "Speed of the faster shaft, the one with the smaller sheave.",
      tip: "Use the motor speed for a speed-reducing drive.",
      effect: "The rating rises with speed until the belt speed limits it.",
      fig: "rotation",
      sym: "n"
    },
    KSR: {
      what: "Speed ratio factor for the classical V-belt rating.",
      tip: "Read it from the handbook table for the speed ratio shown; 1.0000 for a ratio of 1.00.",
      effect: "Adds K2 r (1 − 1 ÷ KSR) to the rating.",
      fig: "factor",
      sym: "K_SR"
    },
    kL: {
      what: "Correction for belts longer or shorter than the average length.",
      tip: "Read it from the handbook table for the belt length and section.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_L"
    },
    kA: {
      what: "Correction for an arc of contact less than 180° on the small sheave.",
      tip: "Read it from the handbook table for the arc the tool shows.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_θ"
    },
    P: {
      what: "Power the drive must transmit to the driven machine.",
      tip: "Use the motor rating or the measured power of the driven machine.",
      effect: "Times the service factor, sets the design power.",
      fig: "power",
      sym: "P"
    },
    SF: {
      what: "Factor for the type of driver, driven machine and hours of running.",
      tip: "Take it from the handbook service factor tables for the belt type.",
      effect: "Raises the design power the belts must carry.",
      fig: "factor",
      sym: "SF"
    },
    nb: {
      what: "Number of belts you intend to fit on the sheaves.",
      tip: "Fit at least the number the tool shows as needed.",
      effect: "Fails the drive when fewer belts are fitted than needed.",
      fig: "count",
      sym: "N_b"
    }
  },
  "double-v-belt-tension": {
    sec: {
      what: "Cross section of the double V-belt to rate.",
      tip: "Use the handbook selection chart for the design power and speed of the faster shaft.",
      effect: "Sets the constants of the rating formula.",
      fig: "choice",
      sym: "sec"
    },
    d: {
      what: "Effective diameter of the smaller sheave of the drive.",
      tip: "Effective diameter = nomenclature diameter + 2hd − 2ap from the handbook table.",
      effect: "A larger sheave allows more tight side tension per belt.",
      fig: "diameter",
      sym: "d"
    },
    D: {
      what: "Effective diameter of the larger sheave of the drive.",
      tip: "Found the same way as the small sheave’s effective diameter.",
      effect: "Sets the arc of contact and the tension allowed on that sheave.",
      fig: "diameter",
      sym: "D"
    },
    C: {
      what: "Distance between the centres of the two shafts.",
      tip: "Measure between shaft centres with the belt at working tension.",
      effect: "A shorter centre distance reduces the arc of contact.",
      fig: "length",
      sym: "C"
    },
    n: {
      what: "Speed of the faster shaft, the one with the smaller sheave.",
      tip: "Use the motor speed for a speed-reducing drive.",
      effect: "The rating rises with speed until the belt speed limits it.",
      fig: "rotation",
      sym: "n"
    },
    RR: {
      what: "Tension ratio factor R ÷ (R − 1) for the arc of contact on the driver.",
      tip: "Read it from the handbook table for the arc of contact shown.",
      effect: "Raises the tight side tension for small arcs.",
      fig: "factor",
      sym: "R_f"
    },
    Kf: {
      what: "Length-flex correction factor for the belt.",
      tip: "Read it from the handbook table for the effective length ÷ number of sheaves.",
      effect: "Multiplies the allowable tight side tension per belt.",
      fig: "factor",
      sym: "K_f"
    },
    P: {
      what: "Power the drive must transmit to the driven machine.",
      tip: "Use the motor rating or the measured power of the driven machine.",
      effect: "Times the service factor, sets the design power.",
      fig: "power",
      sym: "P"
    },
    SF: {
      what: "Factor for the type of driver, driven machine and hours of running.",
      tip: "Take it from the handbook service factor tables for the belt type.",
      effect: "Raises the design power the belts must carry.",
      fig: "factor",
      sym: "SF"
    },
    nb: {
      what: "Number of belts you intend to fit on the sheaves.",
      tip: "Fit at least the number the tool shows as needed.",
      effect: "Fails the drive when fewer belts are fitted than needed.",
      fig: "count",
      sym: "N_b"
    }
  },
  "light-duty-v-belt-rating": {
    sec: {
      what: "Cross section of the light duty V-belt to rate.",
      tip: "Use the handbook selection chart for the design power and speed of the faster shaft.",
      effect: "Sets the constants of the rating formula.",
      fig: "choice",
      sym: "sec"
    },
    d0: {
      what: "Effective outside diameter of the smaller sheave.",
      tip: "Measure across the outside of the sheave.",
      effect: "Sets the rating diameter with the 2a differential.",
      fig: "diameter",
      sym: "d_0"
    },
    twoA: {
      what: "Differential between the outside and the rating diameter of the sheave.",
      tip: "Read 2a from the handbook sheave table for the section.",
      effect: "Subtracted from the outside diameter before rating.",
      fig: "length",
      sym: "2a"
    },
    n: {
      what: "Speed of the faster shaft, the one with the smaller sheave.",
      tip: "Use the motor speed for a speed-reducing drive.",
      effect: "The rating rises with speed until the belt speed limits it.",
      fig: "rotation",
      sym: "n"
    },
    cf: {
      what: "Combined correction factor for drive geometry and service.",
      tip: "Read it from the handbook table for the driven machine and the speed ratio.",
      effect: "The rating is divided by it.",
      fig: "factor",
      sym: "K"
    },
    P: {
      what: "Power the single belt must carry to the driven machine.",
      tip: "Use the motor nameplate power for fractional horsepower motors.",
      effect: "Fails the belt when it is larger than the corrected rating.",
      fig: "power",
      sym: "P"
    }
  },
  "v-ribbed-belt-rating": {
    sec: {
      what: "Cross section of the V-ribbed belt to rate.",
      tip: "Use the handbook selection chart for the design power and speed of the faster shaft.",
      effect: "Sets the constants of the rating formula.",
      fig: "choice",
      sym: "sec"
    },
    dp: {
      what: "Pitch diameter of the smaller sheave, where the belt bends most.",
      tip: "Use at least the minimum diameter recommended for the section and speed.",
      effect: "A larger small sheave raises the rating per belt.",
      fig: "diameter",
      sym: "d_p"
    },
    Dp: {
      what: "Pitch diameter of the larger sheave of the drive.",
      tip: "Dp ÷ dp is the speed ratio used to read the speed ratio factor.",
      effect: "Sets the speed ratio and the arc of contact.",
      fig: "diameter",
      sym: "D_p"
    },
    C: {
      what: "Distance between the centres of the two shafts.",
      tip: "Measure between shaft centres with the belt at working tension.",
      effect: "A shorter centre distance reduces the arc of contact.",
      fig: "length",
      sym: "C"
    },
    n: {
      what: "Speed of the faster shaft, the one with the smaller sheave.",
      tip: "Use the motor speed for a speed-reducing drive.",
      effect: "The rating rises with speed until the belt speed limits it.",
      fig: "rotation",
      sym: "n"
    },
    KSR: {
      what: "Speed ratio factor for the V-ribbed belt rating.",
      tip: "Read it from the handbook table for the speed ratio shown.",
      effect: "Adds K2 r (1 − 1 ÷ KSR) to the rating per rib.",
      fig: "factor",
      sym: "K_SR"
    },
    kL: {
      what: "Correction for belts longer or shorter than the average length.",
      tip: "Read it from the handbook table for the belt length and section.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_L"
    },
    kA: {
      what: "Correction for an arc of contact less than 180° on the small sheave.",
      tip: "Read it from the handbook table for (D − d) ÷ C, which the tool shows.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_θ"
    },
    P: {
      what: "Power the drive must transmit to the driven machine.",
      tip: "Use the motor rating or the measured power of the driven machine.",
      effect: "Times the service factor, sets the design power.",
      fig: "power",
      sym: "P"
    },
    SF: {
      what: "Factor for the type of driver, driven machine and hours of running.",
      tip: "Take it from the handbook service factor tables for the belt type.",
      effect: "Raises the design power the belts must carry.",
      fig: "factor",
      sym: "SF"
    },
    nr: {
      what: "Number of ribs on the belt you intend to fit.",
      tip: "Standard rib counts depend on the section.",
      effect: "Fails the drive when fewer ribs are fitted than needed.",
      fig: "count",
      sym: "ribs"
    }
  },
  "variable-speed-belt-drive": {
    sec: {
      what: "Cross section of the variable-speed belt to rate.",
      tip: "The first two digits give the top width in sixteenths of an inch, the next two the groove angle.",
      effect: "Sets the constants of the rating formula.",
      fig: "choice",
      sym: "sec"
    },
    dp: {
      what: "Smallest working pitch diameter of the small sheave.",
      tip: "Rate the belt where it runs on the smallest diameter.",
      effect: "The rating per belt is lowest here.",
      fig: "diameter",
      sym: "d_p"
    },
    n: {
      what: "Speed of the faster shaft, the one with the smaller sheave.",
      tip: "Use the motor speed for a speed-reducing drive.",
      effect: "The rating rises with speed until the belt speed limits it.",
      fig: "rotation",
      sym: "n"
    },
    KSR: {
      what: "Speed ratio factor for the variable-speed belt rating.",
      tip: "Read it from the handbook table for the speed ratio of the drive.",
      effect: "Adds the speed ratio term to the rating.",
      fig: "factor",
      sym: "K_SR"
    },
    kL: {
      what: "Correction for belts longer or shorter than the average length.",
      tip: "Read it from the handbook table for the belt length and section.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_L"
    },
    kA: {
      what: "Correction for an arc of contact less than 180° on the small sheave.",
      tip: "Read it from the handbook table for the arc the tool shows.",
      effect: "Multiplies the rating per belt.",
      fig: "factor",
      sym: "K_θ"
    },
    P: {
      what: "Power the drive must transmit to the driven machine.",
      tip: "Use the motor rating or the measured power of the driven machine.",
      effect: "Times the service factor, sets the design power.",
      fig: "power",
      sym: "P"
    },
    SF: {
      what: "Factor for the type of driver, driven machine and hours of running.",
      tip: "Take it from the handbook service factor tables for the belt type.",
      effect: "Raises the design power the belts must carry.",
      fig: "factor",
      sym: "SF"
    },
    nb: {
      what: "Number of belts you intend to fit on the sheaves.",
      tip: "Fit at least the number the tool shows as needed.",
      effect: "Fails the drive when fewer belts are fitted than needed.",
      fig: "count",
      sym: "N_b"
    },
    mode: {
      what: "Whether one sheave or both sheaves change pitch diameter.",
      tip: "Compound drives with both sheaves variable reach larger speed ranges.",
      effect: "Changes the speed variation formula.",
      fig: "choice",
      sym: "mode"
    },
    PDmax: {
      what: "Largest working pitch diameter of the variable (driver) sheave.",
      tip: "From the sheave maker’s data for the belt section.",
      effect: "Raises the speed variation.",
      fig: "diameter",
      sym: "PD_max"
    },
    PDmin: {
      what: "Smallest working pitch diameter of the variable (driver) sheave.",
      tip: "From the sheave maker’s data for the belt section.",
      effect: "Lowers the speed variation when larger.",
      fig: "diameter",
      sym: "PD_min"
    },
    DNmax: {
      what: "Largest working pitch diameter of the driven sheave in a compound drive.",
      tip: "Used only when both sheaves are variable.",
      effect: "Raises the speed variation.",
      fig: "diameter",
      sym: "D_N"
    },
    DNmin: {
      what: "Smallest working pitch diameter of the driven sheave in a compound drive.",
      tip: "Used only when both sheaves are variable.",
      effect: "Lowers the speed variation when larger.",
      fig: "diameter",
      sym: "d_n"
    },
    Do: {
      what: "Outside diameter of the variable sheave, for its rim speed.",
      tip: "Measure across the flanges of the variable sheave.",
      effect: "Rim speed rises in proportion.",
      fig: "diameter",
      sym: "D_o"
    },
    nv: {
      what: "Rotational speed of the variable sheave.",
      tip: "Usually the motor speed when the variable sheave is on the motor.",
      effect: "Rim speed rises in proportion.",
      fig: "rotation",
      sym: "n_v"
    },
    vmax: {
      what: "Largest rim speed the variable sheave is designed for.",
      tip: "Take it from the sheave maker; it depends on the material and design.",
      effect: "Fails the drive when the rim speed is higher.",
      fig: "velocity",
      sym: "v_max"
    }
  },
  "synchronous-belt-rating": {
    sec: {
      what: "Cross section of the synchronous belt to rate.",
      tip: "The pitch of each section is shown in brackets.",
      effect: "Sets the constants of the rating formula.",
      fig: "choice",
      sym: "sec"
    },
    z: {
      what: "Number of teeth (grooves) on the smaller pulley.",
      tip: "Count the grooves or read them from the pulley designation, e.g. 30L075.",
      effect: "Sets the pitch diameter and the rating.",
      fig: "teeth",
      sym: "z"
    },
    n: {
      what: "Speed of the faster shaft, the one with the smaller sheave.",
      tip: "Use the motor speed for a speed-reducing drive.",
      effect: "The rating rises with speed until the belt speed limits it.",
      fig: "rotation",
      sym: "n"
    },
    mesh: {
      what: "Number of belt teeth engaged with the small pulley.",
      tip: "From the drive layout; six or more give the full rating.",
      effect: "Below six, each missing tooth lowers the rating by a fifth.",
      fig: "teeth",
      sym: "z_m"
    },
    mxlw: {
      what: "Width of an MXL belt, which has its own torque formula for each width.",
      tip: "Used only for the MXL section.",
      effect: "Sets the MXL torque rating.",
      fig: "choice",
      sym: "b"
    },
    wf: {
      what: "Width factor for the belt width chosen, relative to the widest standard width.",
      tip: "Read it from the handbook width factor table; 1.00 for the widest standard width.",
      effect: "Multiplies the rating of the widest belt.",
      fig: "factor",
      sym: "K_w"
    },
    P: {
      what: "Power the drive must transmit to the driven machine.",
      tip: "Use the motor rating or the measured power of the driven machine.",
      effect: "Times the service factor, sets the design power.",
      fig: "power",
      sym: "P"
    },
    SF: {
      what: "Factor for the type of driver, driven machine and hours of running.",
      tip: "Take it from the handbook service factor tables for the belt type.",
      effect: "Raises the design power the belts must carry.",
      fig: "factor",
      sym: "SF"
    }
  }
});
