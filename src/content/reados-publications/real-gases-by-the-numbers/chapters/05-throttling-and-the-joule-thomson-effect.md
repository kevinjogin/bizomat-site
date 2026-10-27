---
book: real-gases-by-the-numbers
chapterSlug: throttling-and-the-joule-thomson-effect
order: 5
title: "Throttling: the Joule–Thomson effect at the regulator"
description: "Why gas cools through a regulator, LN-1's drop from 15 °C to −20 °C on a full pack, the inversion temperature, why hydrogen warms, CO₂ regulators that freeze, and a cold-gas alarm."
draft: false
---

Every gas supply has a regulator, and every regulator is a throttle: a narrow passage through which the gas expands from the cylinder's pressure to the line's, with no work taken out and almost no heat exchanged on the way. For an ideal gas, a throttle changes the pressure and nothing else; the gas leaves at the temperature it arrived. A real gas leaves colder, sometimes much colder, and the frost that grows on a nitrogen regulator on a humid day is the visible sign.

This chapter explains why, using the attraction between molecules from Chapter 2. It calculates how cold LN-1's nitrogen gets through its regulator at different pack pressures, shows how much heat it takes to warm it again, explains the inversion temperature and why hydrogen and helium warm instead, deals with carbon dioxide regulators that freeze, and ends with a machine alarm that only sounded on the mornings a full pack went on.

## What a throttle conserves

A throttle is a steady-flow device: a regulator seat, a valve, a porous plug, a long capillary. Gas enters at a high pressure and leaves at a low one. No shaft takes work out, and the flow is too fast for much heat to be exchanged inside the device. The first law of thermodynamics for steady flow then says that the **enthalpy** of each kilogram of gas is the same on the way out as on the way in. Enthalpy is the internal energy plus the pressure times the volume, and the second term accounts for the work the upstream gas does pushing each kilogram into the throttle and the work each kilogram does pushing the downstream gas out of the way.

For an ideal gas, enthalpy depends only on temperature, so constant enthalpy means constant temperature. For a real gas, enthalpy also depends on pressure, and the temperature has to change to keep it constant as the pressure falls. The rate of change is the **Joule–Thomson coefficient**:

μ_JT = (change in temperature ÷ change in pressure) at constant enthalpy

A positive coefficient means the gas cools as its pressure falls.

## Why real gas cools

The van der Waals picture gives the reason. A gas at high pressure is dense, and its molecules sit within reach of each other's attraction. Expanding the gas pulls the molecules apart against that attraction, and the energy to do it comes from their motion: they slow down, and the gas cools. At the same time, the size of the molecules works the other way, because a dense gas of molecules with size carries extra pressure-volume energy that is released as it expands. At room temperature, for nitrogen, oxygen, argon and air, attraction wins, and the gas cools. For a gas hot enough, or with weak enough attraction, size wins, and the gas warms. Gould and Tobochnik's text shows the same balance using the van der Waals equation at low density; here it is enough to use NIST's data, which already contain it.

## LN-1's nitrogen through the regulator

This is an illustration. LN-1's regulator takes nitrogen at 15 °C from the pack and delivers it at 1.9 MPa absolute, 1.8 MPa gauge. With the pack full, at 30.1 MPa, the gas's enthalpy on entry is **256.59 kJ/kg**, from NIST. At 1.9 MPa, nitrogen with that enthalpy is at **−20.2 °C**. The gas leaves the regulator 35 K colder than it entered.

As the pack empties, the drop shrinks:

- from **30.1 MPa**: out at **−20.2 °C**;
- from **20.1 MPa**: out at −13.9 °C;
- from **10.1 MPa**: out at −0.9 °C;
- from **5.1 MPa**: out at +8.3 °C.

These are the temperatures for a throttle with no heat exchange at all. A real regulator's body is a lump of brass or stainless steel in room air, and it gives some heat to the gas, so the outlet is a little warmer than the calculation, especially at low flow. The calculation is the coldest the gas can be, which is the figure to design against.

```figure
type: line
title: LN-1's nitrogen leaving the regulator at 1.9 MPa, by pack pressure
x: Pack pressure, MPa absolute
y: Outlet temperature, °C
legend: Throttled from 15 °C, no heat exchange
ymin: -25
ymax: 15
caption: This is an illustration from NIST enthalpies for nitrogen. The gas enters at 15 °C in every case; the full pack gives the coldest gas.
- 5.1 | 8.3
- 10.1 | -0.9
- 20.1 | -13.9
- 30.1 | -20.2
```

The calculation can be checked on site. A small thermocouple strapped to the regulator's outlet fitting and insulated from the room, read after the laser has cut steadily for ten minutes or so, gives the outlet temperature to within a few kelvin. On LN-1 with a fresh pack, such a reading should sit a little above −20 °C; with the pack at 10 MPa, a little above −1 °C. A reading far colder than the calculation means the thermocouple, the pressure readings or the gas are not what they seem; one far warmer means the regulator body is supplying a lot of heat, which usually means the flow is lower than assumed.

## The coefficient falls at high pressure

The drop is not simply proportional to the pressure difference, because nitrogen's Joule–Thomson coefficient changes with pressure. At 15 °C, NIST gives:

- 2.31 K/MPa at 0.1 MPa;
- 1.90 K/MPa at 5.1 MPa;
- 1.48 K/MPa at 10.1 MPa;
- 0.76 K/MPa at 20.1 MPa;
- 0.28 K/MPa at 30.1 MPa.

At high pressure, the molecules are so close together that their size begins to matter as much as their attraction, and the cooling per megapascal falls. The first 10 MPa of a full pack's drop cools the gas less than the last 10 MPa. That is why the 30.1 MPa pack gives only 6.3 K more cooling than the 20.1 MPa one, while the 10 MPa difference between 20.1 and 10.1 MPa gives 13 K.

Other gases differ. At 5 MPa and 15 °C, NIST gives argon a coefficient of 3.37 K/MPa and oxygen 2.57 K/MPa, both larger than nitrogen's, because both sit at lower reduced temperatures (Chapter 3) and feel their attraction more. Argon regulators frost more readily than nitrogen ones for the same drop.

```figure
type: compare
title: Joule–Thomson coefficients at 15 °C and 5 MPa, from NIST
rowhead: Gas
cols: Coefficient, K/MPa | On throttling
caption: A positive coefficient means the gas cools as its pressure falls. Hydrogen and helium are above their inversion temperatures at room temperature and warm slightly.
- Argon | 3.37 | cools
- Oxygen | 2.57 | cools
- * Nitrogen | 1.90 | cools
- Hydrogen | −0.31 | warms
- Helium | −0.62 | warms
```

## The inversion temperature

Because attraction matters less the faster the molecules move, every gas has an **inversion temperature** above which its Joule–Thomson coefficient becomes negative and throttling warms it. At low pressure, NIST's data put nitrogen's at about **334 °C**. Van der Waals predicts 2a ÷ (R × b), which is 6.75 times the critical temperature, 852 K or 579 °C: right in kind, too high in number, as Chapter 2 found for the Boyle temperature.

For most gases the inversion temperature is far above room temperature, so they cool on throttling. For hydrogen and helium, whose attractions are very weak, it is far below: room temperature is above their inversion temperatures, and they warm slightly when throttled. At 5 MPa and 15 °C, hydrogen's coefficient is −0.31 K/MPa. A hydrogen regulator does not frost, and a hydrogen leak through a crack warms the escaping gas a little rather than cooling it. Neither effect is large at workshop pressures. It becomes significant at the 70 MPa of hydrogen vehicle refuelling, where the warming during a fast fill is one of the things refuelling stations manage by pre-cooling the gas.

The inversion temperature also explains why gases can be liquefied by repeated throttling. Gas below its inversion temperature, cooled by a throttle, can be used to pre-cool the incoming gas in a heat exchanger, so the next pass starts colder and ends colder still. That cumulative cooling is the principle of the Linde process for liquefying air, which is how the liquid nitrogen in Chapter 6 is made.

## Warming the gas back up

The cold gas from LN-1's regulator warms as it flows along the line to the machine, taking heat from the pipe and the air. The heat it needs to return to 15 °C at 1.9 MPa is its enthalpy rise, from 256.59 to **294.59 kJ/kg**, 38.0 kJ for each kilogram. At the laser's 36.0 kg an hour, that is **380 watts**, continuously, while the beam is on.

That heat is free, in the sense that it comes from the room, but it has to get in. A short run of small-bore tube in still air cannot pass 380 W at a modest temperature difference, so the gas reaches the machine still cold. A longer run, a finned section, or a regulator with an electric heater can supply it.

Staging does not help by itself. A two-stage regulator, which drops from 30.1 MPa to an intermediate pressure and then to 1.9 MPa, conserves enthalpy across both stages, so if no heat enters between them the gas leaves at the same −20.2 °C. Two stages hold the outlet pressure steadier as the pack empties, which is why they are used, and they give the intermediate body a chance to collect heat from the room, but the cold comes from the total drop, not from how it is divided.

The cooling also costs something besides heat. A throttle wastes the gas's ability to do work, as Entropy by the Numbers explains in [its chapter on throttling, mixing and friction](/reados/publications/entropy-by-the-numbers/throttling-mixing-and-friction/). In a cylinder supply that waste is unavoidable, because nothing useful could be done with the energy, but it is the reason large plants recover it with expanders instead of throttles.

## Carbon dioxide regulators that freeze

Carbon dioxide behaves very differently, because at room temperature it is stored as a liquid under its own vapour pressure (Chapter 6). This is an illustration for a cylinder at 15 °C, where the vapour above the liquid is at 5.09 MPa with an enthalpy of 416.6 kJ/kg, from NIST. Throttling that vapour to 0.6 MPa absolute, about the pressure inside a typical flow regulator's low-pressure side, takes it to carbon dioxide's saturation temperature at 0.6 MPa, **−53 °C**, and condenses about **4%** of it to liquid. Below 0.518 MPa, carbon dioxide's triple-point pressure, liquid cannot exist, and throttling further turns part of the gas to solid, dry ice, which can block the regulator's orifice.

That is why carbon dioxide regulators for welding often have heaters, and why a heavy draw from an unheated carbon dioxide regulator ends with a frozen, blocked regulator and a stopped weld. The cylinder itself also cools as the liquid boils to replace the vapour drawn off, which lowers its pressure and slows the boiling; Chapter 6 deals with that.

```figure
type: checklist
title: Checks on a regulator for cold gas
caption: The calculated outlet temperature assumes no heat exchange, which is the coldest case. The last line is this chapter's error.
- Outlet temperature from the gas's enthalpy at the full inlet pressure | −20.2 °C for LN-1's full pack
- Materials and seals rated for that temperature | regulator, hose and fittings
- Heat to bring the gas back to room temperature | 380 W at LN-1's 36 kg/h
- Humid air on cold surfaces | frost and drips, not a fault in itself
- Carbon dioxide and other liquefied gases | heated regulator; avoid outlets below 0.518 MPa without heat
- x Short cold line to a machine with an inlet temperature limit | alarm on full-pack mornings only
```

## The error: a cold-gas alarm on full-pack mornings

This is an illustration. LN-1's laser monitors the temperature of its assist gas at the machine inlet and warns the operator when it falls below 0 °C, because its proportional valve is calibrated for gas between 0 and 40 °C. A few weeks after installation, the warning began to appear, but only some mornings, and only in the first hour or two of cutting. The machine maker's technician suspected the sensor, replaced it, and the warning continued.

The production engineer noticed the pattern: the warning appeared on the days the pack had been changed first thing, and never late in a pack's life. The calculation explained it. With a full pack, the gas left the regulator at about −20 °C at full flow, and the regulator sat only 2 metres from the machine, connected by 10 mm tube along a cold block wall. The tube could not pass 380 W, and the gas arrived below zero. As the pack emptied below about 10 MPa, the gas left the regulator above −1 °C and warmed enough on the way, so the warning stopped.

The fix was to move the regulator to the pack's enclosure and run the line 15 metres to the machine through the workshop, with a finned section near the pack. A thermocouple on the line at the machine inlet now reads 9 to 14 °C on a full pack. The shop also checked that the regulator, hose and fittings were rated below −20 °C, since the calculation showed they had been running that cold for weeks.

## Exercise: the argon regulator

The welding bays draw argon at 15 °C from a 20 MPa cylinder through a regulator to 0.3 MPa absolute. Using an average Joule–Thomson coefficient of about 3 K/MPa over the drop, estimate the outlet temperature for a throttle with no heat exchange, and say whether a nitrogen cylinder at the same pressures would be colder or warmer.

**Worked answer.**

- Pressure drop: 20 − 0.3 = 19.7 MPa.
- Estimated temperature drop: 19.7 × 3 ≈ **59 K**, so the outlet would be about 15 − 59 = **−44 °C** with no heat exchange at all.
- This is a rough estimate, because argon's coefficient, like nitrogen's, falls at high pressure and rises at low pressure; an enthalpy lookup from NIST would give the precise figure.
- Nitrogen's coefficient at the same conditions is smaller, 1.90 K/MPa at 5 MPa against argon's 3.37, so a nitrogen cylinder at the same pressures would leave its regulator warmer.

At welding flows of a few kilograms an hour the regulator body supplies much of the heat and the outlet is far warmer than the estimate, but at high flow an argon regulator frosts readily, and that is the reason.
