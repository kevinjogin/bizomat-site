// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook78).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "edm-sinker-plan": {
    "purpose": "Plan for die-sinking EDM of a straight-walled cavity: the roughing current from the electrode face area and your current density against the machine limit, the duty cycle and spark frequency from the on and off times, the volume left for finishing on the walls and floor and the roughing volume, roughing and finishing times from the removal rates for your settings, the end wear of the roughing electrode from its linear wear and the number of roughing electrodes needed to keep each within your limit, the undersize of the roughing and finishing electrodes from the overcut and finishing stock, and the machine and electrode cost, with a check that the finishing stock covers the damaged layer left by roughing.",
    "uses": [
      "Plan the electrodes and machine time for an EDM cavity",
      "Size roughing and finishing electrodes for overcut and finishing stock",
      "Estimate the cost of a sunk cavity for a quote"
    ],
    "users": [
      "Toolmakers",
      "Mould and die makers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "A": "Area of the electrode face seen along the direction of sinking, which carries the roughing current.",
      "depth": "Depth of the cavity to be sunk.",
      "perim": "Length around the cavity walls, used for the finishing stock on the walls.",
      "fin": "Material left on each wall and on the floor by the roughing electrode for the finishing electrode to remove.",
      "J": "Roughing current per unit of electrode face area for graphite or copper electrodes, from the machine maker's guidance.",
      "Imax": "Largest current the EDM generator can deliver.",
      "ton": "Time the current is on in each spark cycle.",
      "toff": "Time the current is off in each spark cycle, which lets the dielectric clear and recover.",
      "mrrR": "Volume of work removed per hour at your roughing settings, from the machine maker's technology tables or your own records.",
      "wearR": "Loss of electrode length as a share of the depth sunk at the roughing settings, from the maker's tables.",
      "ocR": "Gap left on each side between the roughing electrode and the cavity wall.",
      "crater": "Depth of craters, recast layer and heat-affected zone left by roughing, which finishing must remove.",
      "endMax": "Most an electrode may wear at its end before it is replaced by a fresh one.",
      "mrrF": "Volume removed per hour at your finishing settings.",
      "ocF": "Gap left on each side between the finishing electrode and the cavity wall.",
      "rate": "Charge-out rate for the EDM machine.",
      "elec": "Cost to make one electrode, including material and machining."
    },
    "outputs": [
      "Roughing current, duty cycle and spark frequency",
      "Roughing and finishing volumes and times",
      "Roughing electrode end wear and number of electrodes",
      "Electrode undersize for roughing and finishing",
      "Machine, electrode and total cost"
    ],
    "method": [
      "Roughing current = current density × electrode face area, against the machine maximum.",
      "Duty cycle = on time ÷ (on time + off time); spark frequency = 1 ÷ (on time + off time).",
      "Cavity volume = face area × depth; finishing volume = stock × (perimeter × depth + face area); roughing volume = cavity − finishing volume.",
      "Times = volume ÷ removal rate for roughing and finishing.",
      "Roughing end wear = wear share × (depth − stock); roughing electrodes = end wear ÷ the largest accepted wear, rounded up.",
      "Roughing electrode undersize on each side = overcut + finishing stock; finishing electrode undersize = finishing overcut.",
      "Cost = total time × machine rate + (roughing electrodes + 1) × electrode cost.",
      "Example: 48 A on the 6 cm² electrode; roughing takes 1.43 h and finishing 0.42 h, with 2 roughing electrodes, about A$616.5 for the cavity."
    ],
    "limitations": [
      "A straight-walled cavity of constant section; tapers, ribs and detail need their own electrodes and settings.",
      "Removal rates, wear and overcut come from your machine's tables for the electrode and work materials; this plan does not predict them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Finishing removes metal far more slowly than roughing, so leave only enough stock to clear the damaged layer.",
      "Electrode wear is usually the hidden cost: one electrode per wear allowance, plus a finisher."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1394–1399. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wire-edm-cut-plan": {
    "purpose": "Plan for a wire EDM profile cut: the kerf and wire offset from the wire diameter and spark gap, the smallest inside corner radius the last pass can leave against the drawing, the main-cut feed from the area cutting rate for the thickness, the main-cut, skim and start-hole times, the wire run off the spool and its mass and cost, the wire's breaking load from its tensile strength and the tension setting as a share of it, and the machine and wire cost per part.",
    "uses": [
      "Check that the wire can make the drawing's inside corners",
      "Estimate wire EDM time and cost for a die or part",
      "Check the wire tension against the wire's strength"
    ],
    "users": [
      "Toolmakers",
      "Wire EDM operators",
      "Estimators"
    ],
    "inputs": {
      "Lc": "Length of the profile the wire travels on the main cut.",
      "t": "Thickness of the work the wire cuts through.",
      "rMin": "Smallest inside corner radius the drawing allows on the cut profile.",
      "holes": "Number of start holes the wire must be threaded through.",
      "tHole": "Time to EDM-drill one start hole and thread the wire through it.",
      "dw": "Diameter of the electrode wire.",
      "gap": "Gap between the wire and the cut wall on each side during the main cut, from the machine's settings.",
      "gapF": "Gap on each side on the last skim pass (the main cut if there are no skims).",
      "ar": "Rate at which the main cut sweeps area through the work (feed × thickness), from the machine maker's tables for the wire and material.",
      "skims": "Number of trim passes after the main cut to improve accuracy and finish.",
      "vs": "Feed along the profile on each skim pass.",
      "vw": "Speed at which wire is fed off the spool through the cut.",
      "Rm": "Tensile strength of the wire, from the wire maker.",
      "Tw": "Tension the machine applies to the wire.",
      "uMax": "Largest share of the breaking load you allow the tension to reach.",
      "dens": "Density of the wire material.",
      "wcost": "Price of the wire per kilogram.",
      "rate": "Charge-out rate for the wire EDM machine."
    },
    "outputs": [
      "Kerf, wire offset and smallest inside corner",
      "Main-cut feed, cut, skim and start-hole times",
      "Wire used, its mass and cost",
      "Wire breaking load and tension share",
      "Cost per part"
    ],
    "method": [
      "Kerf = wire diameter + 2 × spark gap; wire offset = wire diameter ÷ 2 + gap.",
      "Smallest inside corner = wire diameter ÷ 2 + the last-pass gap, against the drawing's smallest radius.",
      "Main-cut feed = area rate ÷ thickness; main-cut time = length ÷ feed; skim time = passes × length ÷ skim speed.",
      "Wire used = run speed × cutting time; mass = density × π d² ÷ 4 × length.",
      "Breaking load = tensile strength × π d² ÷ 4; tension share = tension ÷ breaking load.",
      "Cost = total time × machine rate + wire mass × wire price.",
      "Example: a 0.31 mm kerf at 4 mm/min; the cut takes 104 min and 333.79 g of wire, about A$147.01 a part."
    ],
    "limitations": [
      "Area cutting rates, gaps and skim speeds come from your machine's tables for the wire and material; this plan does not predict them.",
      "Taper cuts, part supports and wire breakages are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Wire EDM time is set by the area swept, so time grows with thickness at the same profile length.",
      "Skims improve accuracy and finish but at much lower speed; specify only as many as the drawing needs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1394–1403. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "laser-cutting-plan": {
    "purpose": "Plan for laser cutting sheet: the focused spot diameter from the wavelength, beam quality factor, raw beam diameter and focal length, the power density at the work against the density your process needs, the depth of focus over which the spot grows by no more than your tolerance against the height variation of the surface the head does not follow, the cutting speed scaled from a reference speed by power and thickness on the handbook's rule that the depth cut is proportional to power and inversely proportional to speed, and the cutting and pierce time and machine cost per part.",
    "uses": [
      "Check whether a lens and laser give enough power density for a cut",
      "Check the depth of focus against sheet flatness",
      "Estimate laser cutting time and cost for a quote"
    ],
    "users": [
      "Laser cutting operators",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "lam": "Wavelength of the laser light: about 10.6 µm for CO₂ lasers and about 1.06 µm for Nd:YAG and fibre lasers.",
      "M2": "Beam quality factor: how many times larger the focused spot is than a perfect beam would give, from the laser maker.",
      "Db": "Diameter of the unfocused beam where it enters the focusing lens.",
      "fl": "Focal length of the focusing lens or mirror.",
      "P": "Laser power delivered to the work after optics losses.",
      "Hreq": "Power density your material and process need at the work, from the laser maker or your own trials.",
      "tol": "How much the spot may grow either side of focus and still count as in focus; the handbook defines depth of focus at 5 %.",
      "t": "Thickness of the sheet being cut.",
      "flat": "Height variation of the sheet surface that the cutting head does not follow; zero for a head that follows the surface exactly.",
      "vref": "Cutting speed from the maker's chart for this material and gas at a known power and thickness.",
      "Pref": "Laser power at which the reference speed applies.",
      "tref": "Sheet thickness at which the reference speed applies.",
      "Lc": "Total length of cut on one part, including inside cut-outs.",
      "pierces": "Number of times the beam pierces the sheet to start a cut on one part.",
      "tp": "Time to pierce the sheet once at this thickness.",
      "rate": "Charge-out rate for the laser, including assist gas and power."
    },
    "outputs": [
      "Focused spot diameter and f-number",
      "Power density at the work",
      "Depth of focus against the surface variation",
      "Estimated cutting speed",
      "Cut and pierce time and cost per part"
    ],
    "method": [
      "Focused spot d = 4 M² λ f ÷ (π D) for a beam of wavelength λ and diameter D through a lens of focal length f.",
      "Power density H = 4P ÷ (π d²).",
      "Rayleigh range z_R = π d² ÷ (4 M² λ); the spot grows by a factor √(1 + (z ÷ z_R)²), so the depth of focus for a growth tolerance g is 2 z_R √((1 + g)² − 1).",
      "Cut depth is proportional to power and inversely proportional to speed, so v = v_ref × (P ÷ P_ref) × (t_ref ÷ t).",
      "Time per part = cut length ÷ speed + pierces × pierce time; cost = time × machine rate.",
      "Example: a 0.12855 mm spot gives 15,409,000 W/cm² with 0.52269 mm depth of focus; cutting at 3 m/min takes 33 s a part, A$1.375."
    ],
    "limitations": [
      "Gaussian-beam estimates; real spots depend on the optics, their cleanliness and the beam mode.",
      "The speed rule holds only within the maker's range for the material, gas and laser; it does not predict cut quality or the thickest sheet that can be cut.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the spot diameter quadruples the power density but shortens the depth of focus four times, so a shorter lens suits thin sheet and a longer one thick or uneven sheet.",
      "A shorter wavelength gives a proportionally smaller spot through the same lens."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1487–1494. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
