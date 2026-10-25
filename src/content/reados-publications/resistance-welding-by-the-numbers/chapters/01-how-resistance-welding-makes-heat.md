---
book: resistance-welding-by-the-numbers
chapterSlug: how-resistance-welding-makes-heat
order: 1
title: "How resistance welding makes heat"
description: "Use Joule's law to estimate the heat in a spot weld, see why it concentrates at the faying surface, and find how little of the energy ends up in the nugget."
draft: false
---

Every resistance weld starts with one relationship: an electric current passing through a resistance turns electrical energy into heat. Nothing else is added. There is no flame, no arc and usually no filler. The current, the resistance it meets and the time it flows decide how much heat is produced, and the shape of the parts and the electrodes decide where that heat goes. A spot welder is a machine for putting a large current through a small region for a carefully controlled time while holding the parts together.

This chapter builds the heat balance of a single spot weld in the cabinet body. It shows why the heat appears at the interface between the sheets rather than everywhere at once, why most of the energy never reaches the nugget, and why the welders of 1918 found that a fast weld uses less energy than a slow one.

## Joule's law

The heat generated in a conductor is

**Q = I² × R × t**

where Q is heat in joules, I is current in amperes, R is resistance in ohms and t is time in seconds. The current appears squared, which is the single most important fact in resistance welding. A 10% increase in current gives about 21% more heat; a 10% decrease gives about 19% less. Time and resistance act in simple proportion.

Resistance welding currents are large because the resistances are tiny. Two sheets of steel squeezed between copper electrodes might present a total resistance of the order of a hundred micro-ohms (millionths of an ohm) once they are hot. To produce useful heat in a fraction of a second through such a small resistance needs thousands of amperes, delivered at only a few volts. Chapter 3 shows how a transformer provides that.

```figure
type: formula
title: Heat generated in one cabinet spot weld
formula: Q = I² × R × t
caption: This is an illustration. The resistance is a representative value for two hot 1.2 mm steel sheets between electrodes; in practice it changes throughout the weld.
- Q | heat generated, J
- I | welding current, A (9,000 A)
- R | resistance between the electrodes, Ω (100 µΩ)
- t | weld time, s (0.20 s, ten cycles at 50 Hz)
step: Q = 9,000² × 0.000100 × 0.20
step: Q = 81,000,000 × 0.000020
step: Q = 1,620 J
```

## Where the resistance is

The current passes through five resistances in series between the two electrode tips:

1. the contact between the top electrode and the top sheet;
2. the bulk of the top sheet;
3. the contact between the two sheets, called the faying surface;
4. the bulk of the bottom sheet;
5. the contact between the bottom sheet and the bottom electrode.

Because they are in series, the same current flows through all five, and each produces heat in proportion to its own resistance. The trick of spot welding is to make the faying-surface contact the largest and to keep the electrode contacts small.

Three things make that happen. First, the electrodes are copper alloy, which conducts electricity and heat far better than steel, so the electrode-to-sheet contacts are low in resistance and the copper carries heat away from them. Second, the electrodes are water-cooled, so the sheet surfaces next to them stay relatively cool. Third, the faying surface is a contact between two steel surfaces that touch only at the peaks of their roughness and any films on them, so at the start of the weld its resistance is high.

As the weld proceeds, the picture changes. The contact peaks soften and flatten, so contact resistance falls quickly. At the same time the steel heats, and the electrical resistivity of steel rises steeply with temperature, so the bulk resistance of the sheets rises. By the time the nugget is forming, the heat is coming mainly from the hot steel at the centre of the stack, which is the part furthest from the cold electrodes. The nugget grows outwards from the faying surface.

```figure
type: layers
title: The five resistances in series in a spot weld
caption: The same current passes through every layer. Heat is greatest where resistance is high and cooling is poor, which is the faying surface at the centre of the stack.
- Top electrode contact | low resistance, cooled by water through the copper
- Top sheet | resistance rises as the steel heats
- *Faying surface | high contact resistance at first; where the nugget starts
- Bottom sheet | resistance rises as the steel heats
- Bottom electrode contact | low resistance, cooled by water through the copper
```

## Why force matters to the heat

The electrode force does more than hold the sheets together. It decides how hard the contact surfaces are pressed, and therefore how much contact resistance there is. A light force leaves high contact resistance everywhere, including at the electrodes, which produces heat in the wrong places, burns the sheet surface and can melt the copper onto the steel. A heavy force flattens the contacts and lowers resistance, so more current is needed for the same heat.

Hamilton and Oberg described this in 1918: an increase in pressure needs an increase in current, a smaller current needs a longer time, and a small current with heavy pressure will not make a good weld while a heavy current with light pressure will burn the metal. The welding window in Chapter 2 is the modern form of that observation.

The force also contains the molten metal. While the nugget is liquid, the surrounding solid ring of steel, clamped by the electrodes, stops it escaping. If the force is too low, or the current too high for the force, molten metal squirts out between the sheets. This is called expulsion, and it leaves a cavity in the nugget and a shower of sparks.

## The heat balance of one spot

The cabinet body uses two 1.2 mm sheets of cold-rolled low carbon steel. This is an illustration. The shop's spot schedule, developed in Chapter 2, is 9,000 A for ten cycles of the 50 Hz supply, which is 0.20 s, with a force of 3.0 kN. Taking 100 µΩ as a representative resistance between the electrodes, Joule's law gives 1,620 J per weld.

How much of that is needed to make the nugget? Suppose the finished nugget is 5.5 mm in diameter and 1.6 mm thick, a lens of fused metal roughly two-thirds of the way through the 2.4 mm stack. Treating it as a short cylinder for a first estimate:

- volume = π/4 × 5.5² × 1.6 = **38.0 mm³**;
- mass = 38.0 mm³ × 0.00785 g/mm³ = **0.298 g**.

To melt steel from room temperature needs enough heat to raise it to about 1,510 °C and then to supply the latent heat of melting. Taking typical values for iron of about 0.65 J/g·°C as an average specific heat over the range and about 270 J/g as the latent heat, each gram needs roughly 0.65 × 1,490 + 270 ≈ 1,240 J. The nugget therefore needs about 0.298 × 1,240 ≈ **370 J**.

That is only about 23% of the 1,620 J generated. The rest goes into heating the steel around the nugget, the heat-affected ring that never melts, and especially into the water-cooled electrodes, which conduct heat away from both faces of the stack throughout the weld. These property values are approximations that vary with the steel and temperature, so the percentage is an estimate, but the conclusion is robust: most of the energy in a spot weld is spent fighting conduction losses.

```figure
type: bars
title: Where the 1,620 J of one cabinet spot weld goes
unit: J
max: 1700
caption: This is an illustration. The nugget share is estimated from its volume and typical property values for iron; the remainder is conducted into the surrounding sheet and the water-cooled electrodes.
- Generated in the weld zone | 1620
- *Needed to melt the 0.298 g nugget | 370
- Conducted into sheet and electrodes | 1250
```

## Fast welds use less energy

The heat lost by conduction grows with time. The longer the current flows, the more heat escapes into the electrodes and the surrounding metal before the weld zone reaches temperature. So a short, intense weld wastes less energy than a long, gentle one.

Hamilton and Oberg gave a clear example from butt welding in 1918. A one-inch round wrought-iron rod could be welded with 15 kW for fifteen seconds, or with 23 kW for six seconds. The first uses 15 × 15 = 225 kilowatt-seconds, which is 225 kJ; the second uses 23 × 6 = 138 kJ, about 39% less energy for the same weld. Their advice was to install enough power to finish each weld fast, since a quick weld was usually a better one and saved both time and electricity.

The same principle sets the very short weld times of modern spot welding, measured in tens or hundreds of milliseconds rather than seconds. It also explains why aluminium, which conducts heat away far faster than steel, is welded with very high currents and very short times, as Chapter 9 shows.

There is a limit. A weld that is too fast and too intense heats the contact surfaces before the heat has spread into the bulk, which tends to cause surface burning, electrode sticking and expulsion. Choosing current and time together is the subject of Chapter 2.

## Cycles, milliseconds and RMS current

Most resistance welders in Australian workshops still run from the 50 Hz alternating supply, and weld times are often set in cycles. One cycle at 50 Hz lasts 1 ÷ 50 = 0.020 s, so the cabinet's ten-cycle weld is 0.20 s and a three-cycle squeeze or hold interval is 0.06 s. Machines built for 60 Hz countries count cycles of 0.0167 s, so a schedule copied from an American source without conversion runs about 20% longer in time on a 50 Hz machine than its author intended. Many modern controls set time directly in milliseconds, which removes the ambiguity.

With alternating current the current rises and falls through every cycle, so the figure used in Joule's law is the root-mean-square (RMS) value: the steady current that would produce the same heat. Welding controls and current meters report RMS current for this reason. Where a control uses phase-shift heat control to trim the current, it delays the start of conduction in each half-cycle, which lowers the RMS current and changes the waveform; the meter reading, not the percentage-heat setting, is what tells the welder how much current actually flowed.

Hamilton and Oberg noted that resistance welding in 1918 used single-phase alternating current at 40 to 60 cycles, and that direct current was not used because there was no simple way to reduce its voltage without wasting power in resistance. Modern inverter welders, discussed in Chapter 3, overcame that limitation and now supply direct welding current from a medium-frequency transformer.

## Resistance welding against the other processes

Resistance welding's heat source is inside the joint itself, which is why it is so efficient at joining thin overlapping sheets and why it needs no filler or shielding gas. TWI lists its advantages as the ability to weld similar and dissimilar metals, high automation and production rates, low waste and no consumables such as rods, fluxes or gases. It also lists the limitations: complex and often expensive machinery, limited workpiece thickness, lower efficiency for highly conductive materials and high electrical power demand.

The last two limitations follow directly from Joule's law. A metal with low resistivity, such as copper or aluminium, produces less heat for a given current, so it needs much more current. And because the resistances are so small, the currents are always large, which means heavy transformers and a substantial electrical supply.

## A failure: welds that would not form

This is an illustration. Early in the cabinet run, a batch of sheet arrived with a heavy coat of rust-preventive oil and some light surface rust. The first welds on the morning shift looked normal from outside, with the usual electrode marks, but two cabinets in the first ten failed the shop's routine peel test on a test coupon: the sheets pulled apart with only a small, irregular stuck area instead of a nugget.

The investigation started from the five resistances. Oil and rust raise contact resistance unevenly, both at the faying surface and at the electrode contacts. At some spots the extra electrode contact resistance had produced heat at the sheet surface instead of at the interface, leaving a burned surface and a small weld. At others the films had broken down unpredictably, so the current found a small path and the weld grew from it irregularly. The electrode tips, when inspected, had picked up dark deposits, which further increased contact resistance at the next welds.

The correction was to remove the cause rather than to raise the current: the oiled sheet was wiped and the rusty sheets were cleaned before welding, the electrode tips were dressed back to clean copper (Chapter 4), and the peel tests were repeated before production resumed. Raising the current might have produced bigger welds on clean areas and expulsion on dirty ones, and would not have fixed the variability. The incident became the reason the shop's procedure now specifies the surface condition of incoming sheet.

## Exercise: a drop in current

During the morning, a supply problem lowers the welding current on the cabinet spot welder from 9,000 A to 8,000 A, with the same resistance and time. Estimate the heat per weld, and the fall in heat as a percentage. Then estimate whether the 8,000 A weld still supplies enough heat for the nugget, assuming the same fraction of the heat reaches it as before.

At 8,000 A, Q = 8,000² × 0.000100 × 0.20 = **1,280 J**. The ratio of heats is (8,000 ÷ 9,000)² = 0.790, so the heat falls by about **21%** for an 11% fall in current. If about 23% of the heat still reached the nugget, it would receive about 0.23 × 1,280 ≈ 290 J, against the 370 J needed to melt a 5.5 mm nugget. The weld would therefore be noticeably smaller, perhaps too small to meet the minimum size in Chapter 2.

In practice the fraction reaching the nugget would fall too, because a weaker weld spends proportionally more of its time heating the surroundings. That is why current monitoring, discussed in Chapters 3 and 10, matters: an 11% fall in current is invisible from the outside of the weld but large in the nugget.
