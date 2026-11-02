// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook103).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "planetary-arrangement-ratio": {
    "purpose": "Speed ratios of planetary or epicyclic gearing by the formula the handbook prints with each of its 24 arrangements (Figs. 1 to 24): A the driving gear, B the driven gear or follower, C the fixed gear, x and y the planet gears, z the secondary driving gear and S the turns of the secondary driver per turn of the initial driver (negative when they turn in opposite directions), giving F, the turns of the follower per turn of the driver, or D, the turns of the driver per turn of the follower, with F = 1 ÷ D, and the follower speed for your driver speed.",
    "uses": [
      "Find the ratio of a planetary or epicyclic gear train from its arrangement",
      "Check the speed of the follower of a compound planetary train",
      "Work out a differential with a secondary driver"
    ],
    "users": [
      "Machine designers",
      "Gearbox designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "fig": "The figure in the handbook’s table whose gears, arm and fixed member match your train.",
      "A": "Size of the driving gear, as teeth or pitch diameter.",
      "B": "Size of the driven gear or follower.",
      "C": "Size of the fixed gear.",
      "x": "Size of the planet gear marked x in the figure.",
      "y": "Size of the planet gear marked y in the figure.",
      "z": "Size of the secondary driving gear when the follower is driven from two members.",
      "S": "Turns of the secondary driver for one turn of the initial driver; negative if they turn opposite ways.",
      "E": "Angle of the inclined planet axis in Fig. 4.",
      "n": "Speed of the driving member."
    },
    "outputs": [
      "Follower turns per driver turn F",
      "Driver turns per follower turn D",
      "Follower speed for the driver speed",
      "Direction of the follower"
    ],
    "method": [
      "Choose the figure whose arrangement matches yours; its formula gives F or D.",
      "Simple trains: F = 1 ± C/B, C/B or cos E + C/B (Figs. 1–4, 9, 12); D = 1 + C/A (Figs. 10, 11, 23).",
      "Compound planets: F = 1 + xC/yB or 1 + yC/xB (Figs. 5, 6), D = 1 + xC/yA or 1 + yC/xA (Figs. 7, 8), F = 1 − Cx/yB (Figs. 13, 17), D = 1 − Cx/yA (Figs. 16, 18), D = (1 + C/A) ÷ (1 − Cx/yB) or (1 + C/A) ÷ (1 − Cy/xB) (Figs. 14, 15, 24).",
      "Secondary driver: F = 1 + z(1 − S)/B (Figs. 19, 22); D = (A + z) ÷ (A + S z) (Figs. 20, 21).",
      "F = 1 ÷ D; follower speed = F × driver speed; a negative value turns the follower the opposite way to the driver.",
      "Example: Fig. 10 gives D = 5, so the follower turns at 200 rpm."
    ],
    "limitations": [
      "The member called the driver, the follower and the fixed gear must match the figure; the same gears give different ratios with a different member held.",
      "In Figs. 1 to 4, F is the rotation of the planet follower about its own axis.",
      "Gear sizes may be teeth or pitch diameters, but use the same kind for all of them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A ratio near zero means the follower barely moves, typical of trains with nearly equal gear sizes, which give large reductions.",
      "A negative ratio means the follower turns the opposite way to the driver."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2212–2214. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "microdroplet-adhesion-check": {
    "purpose": "The handbook’s condition for a micro-droplet to adhere to a rotating micro tool, Equation (18b): 2m Vc² ÷ Dt ≤ P (1 + cos θ) σL, with the droplet mass m from its diameter and the lubricant density, the tool surface speed Vc = π Dt n, the projected drop size P, the contact angle θ and the surface tension σL of the lubricant, giving the margin between adhesion and centrifugal force and the highest spindle speed at which the droplet still adheres.",
    "uses": [
      "Check whether mist lubrication will wet a fast-spinning micro tool",
      "Find the spindle speed limit for droplets of a given size",
      "Compare lubricants by contact angle and surface tension"
    ],
    "users": [
      "Micromachining engineers",
      "CNC machinists",
      "Process developers"
    ],
    "inputs": {
      "Dd": "Diameter of a lubricant droplet in the mist.",
      "rho": "Density of the lubricant, from its data sheet.",
      "P": "Projected size of the drop on the tool surface, measured as the handbook describes.",
      "theta": "Contact angle of the lubricant on the tool material, measured or from data.",
      "sig": "Surface tension of the lubricant against air, from its data sheet.",
      "Dt": "Diameter of the micro tool.",
      "n": "Spindle speed of the tool."
    },
    "outputs": [
      "Droplet mass and tool surface speed",
      "Centrifugal and adhesion terms of Equation (18b)",
      "Whether the droplet adheres",
      "Highest spindle speed for adhesion"
    ],
    "method": [
      "Droplet mass m = ρ π d³ ÷ 6; tool surface speed Vc = π Dt n ÷ 60.",
      "Centrifugal term = 2 m Vc² ÷ Dt; adhesion term = P (1 + cos θ) σL (both in newtons).",
      "The droplet adheres when the centrifugal term is not larger than the adhesion term.",
      "Highest speed: Vc max = √(P (1 + cos θ) σL Dt ÷ 2m); n max = 60 Vc max ÷ (π Dt).",
      "Example: the adhesion term is 90.611 times the centrifugal term."
    ],
    "limitations": [
      "The droplet must first reach the tool through the air boundary layer around it; this check covers adhesion only.",
      "Contact angle and surface tension depend on the lubricant and the tool coating; measure them for your pair.",
      "Projected drop size and droplet diameter are measured or taken from the mist generator data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Small droplets adhere easily: the handbook found 1 to 10 µm droplets adhered at all speeds of the tested machine.",
      "A smaller contact angle wets better and raises the adhesion term."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1118–1119. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "force-ratio-tool-life": {
    "purpose": "The handbook’s relation between tool life and the force ratio from machining econometrics: T = (FH ÷ (a FC))^(LF/L), with the rake angle constant a (about 0.25 to 0.5 in turning) and the ratio LF ÷ L of the force ratio and tool life equation constants (10 to 20), both entered by you, giving the tool life for a measured or estimated force ratio and, the other way round, the force ratio that corresponds to a target tool life, FH ÷ FC = a T^(L/LF).",
    "uses": [
      "Estimate tool life from measured cutting forces",
      "Set a force ratio limit for tool-change monitoring",
      "See how sensitive tool life is to the force ratio"
    ],
    "users": [
      "Manufacturing engineers",
      "Process developers",
      "Tooling engineers"
    ],
    "inputs": {
      "mode": "Whether to take the ratio from two measured forces or enter it directly.",
      "FH": "Resultant force in the feed plane (axial and radial combined).",
      "FC": "Tangential cutting force.",
      "r": "Ratio of the feed-plane force to the cutting force.",
      "a": "Constant that depends on the rake angle; the handbook gives about 0.25 to 0.5 for turning.",
      "k": "Ratio of the force-ratio constant LF to the tool-life constant L, from your tests; the handbook gives 10 to 20.",
      "Tt": "Tool life you want, to find the matching force ratio."
    },
    "outputs": [
      "Force ratio FH ÷ FC",
      "Tool life from the relation",
      "Force ratio for the target tool life",
      "Whether the present ratio meets the target life"
    ],
    "method": [
      "FH ÷ FC from the measured forces, or as entered.",
      "T = (FH ÷ (a FC))^(LF ÷ L) minutes.",
      "For a target life: FH ÷ FC = a × T^(L ÷ LF).",
      "Example: a force ratio of 0.5 gives a tool life of 1 min."
    ],
    "limitations": [
      "The constants a, L and LF come from tests on your tool and work material; the relation holds along the tool-life curve described in the handbook.",
      "The force ratio also varies with ECT and cutting speed; compare ratios at the same conditions.",
      "Use the result to set monitoring limits and confirm them with tool-life tests.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With the handbook’s a = 0.5, a force ratio of 0.5 gives a life of 1 minute whatever LF ÷ L is.",
      "A larger LF ÷ L makes the tool life rise very steeply with the force ratio."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1140–1143. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
