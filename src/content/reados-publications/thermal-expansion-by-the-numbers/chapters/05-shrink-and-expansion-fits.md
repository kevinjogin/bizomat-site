---
book: thermal-expansion-by-the-numbers
chapterSlug: shrink-and-expansion-fits
order: 5
title: "Shrink and expansion fits"
description: "Assemble interference fits by heating the hub or cooling the shaft: the temperature for interference plus assembly clearance, heating limits, methods, timing and fits that loosen."
draft: false
---

An interference fit holds a hub on a shaft, or a bearing in a housing, by making the bore slightly smaller than the shaft it must go over. Pressed together cold, the parts need large forces and can gall or crack. Heating the hub, so its bore grows, lets it slide on freely; as it cools, it grips the shaft with the full interference. Cooling the shaft does the same from the other side. These **shrink fits** and **expansion fits** are among the oldest uses of thermal expansion in engineering, and the calculation behind them is a direct application of Chapter 1: how hot must the hub be for its bore to grow by the interference plus enough clearance to assemble it?

This chapter calculates the shrink fit for the coupling hub on HW-60's circulating pump shaft. It finds the bore growth needed, the temperature that gives it, and the effect of also cooling the shaft; sets limits on how hot parts may be heated; compares heating methods; covers the practical sequence and the time available before the hub grips; and explains why a fit made with two different materials can loosen in service. The failure case is a hub heated with a torch that seized partway along the shaft.

## The coupling hub

HW-60's circulating pump drives through a flexible coupling. Its steel coupling hub is fitted to the pump's **40 mm** steel shaft with an **interference** of **0.03 mm** on diameter: the hub's bore is 0.03 mm smaller than the shaft. This is an illustration; the interference for a real fit comes from the coupling maker's instructions or a fit calculation, as described in *Fits That Work*.

To slide the hub on freely, the bore must not only grow by the interference but also open a small **assembly clearance**, so the hub does not catch as it starts to cool. The workshop allows **0.03 mm** of clearance, giving a total bore growth of **0.06 mm**.

## The temperature needed

The bore grows like the rest of the hub, by α × diameter × temperature rise, as Chapter 1 explained.

```figure
type: formula
title: Temperature to expand the coupling hub's bore for assembly
formula: ΔT = (interference + assembly clearance) ÷ (α × d)
caption: This is an illustration for a steel hub at α = 12 × 10⁻⁶ per °C on a 40 mm shaft, starting from a workshop at 20 °C.
- Interference on diameter | 0.03 mm
- Assembly clearance | 0.03 mm
- Bore diameter d | 40 mm
step: ΔT = 0.06 ÷ (12 × 10⁻⁶ × 40) = 125 °C
step: heat the hub to about 20 + 125 = 145 °C
```

A steel hub heated to about **145 °C** will slide over the shaft with about 0.03 mm to spare. The hub's outside diameter grows too, by the same proportion, but that has no effect on the fit.

The calculation shows why the temperature depends on the fit's proportions, not its size. A larger shaft with a proportionally larger interference needs the same temperature; a tight fit on a small shaft needs a high one. Interference is often specified per unit of diameter for this reason.

## Cooling the shaft instead, or as well

The shaft can be shrunk by cooling it, with the same calculation in reverse. Cooling a steel shaft by 125 °C, to about −105 °C, would give the same clearance with the hub cold. Cooling agents such as dry ice and liquid nitrogen reach very low temperatures, and the temperature each reaches is given in its supplier's data; they need careful handling, ventilation and protective equipment, because they cause cold burns and can displace oxygen in enclosed spaces.

Heating and cooling can be combined. If the hub is heated only to **100 °C**, its bore grows by **12 × 10⁻⁶ × 40 × 80 ≈ 0.038 mm**, leaving about **0.022 mm** still needed. Cooling the shaft by about **45 °C** provides that. Combining the two keeps both temperatures moderate, which suits parts that must not be heated much.

```figure
type: compare
title: Ways to get 0.06 mm of assembly growth on the 40 mm fit
cols: Hub temperature | Shaft temperature | Notes
caption: This is an illustration for steel parts at 12 × 10⁻⁶ per °C, from a 20 °C workshop.
- *Heat the hub only | about 145 °C | 20 °C | simplest; check the hub's temperature limit
- Cool the shaft only | 20 °C | about −105 °C | needs a cryogenic agent and its precautions
- Heat both ways | about 100 °C | about −25 °C | moderate temperatures for each part
- Press cold | 20 °C | 20 °C | needs a large press force; risk of galling
```

## How hot is too hot

Heating changes some materials. Hardened and tempered steels can lose hardness if heated above their tempering temperature. Bearings contain lubricant and seals, and their makers state a maximum heating temperature, usually well below the temperatures that harm the steel itself. Parts with paint, plastic inserts or bonded rubber elements, such as the flexible element of a coupling, must not be heated with them in place. And uneven heating, hot on one side, distorts the part.

The workshop's rule for HW-60's coupling is to heat only the steel hub, with its flexible element removed, to no more than the coupling maker's stated temperature, measured with a contact thermometer or temperature indicator, and never with a flame playing on one spot.

## Heating methods

```figure
type: checklist
title: Heating methods for shrink fits in HW-60's workshop
caption: This is an illustration of the workshop's preferences, in order. Each method heats evenly and to a known temperature except the last.
- Induction heater with temperature probe | fast, even, controlled; the workshop's first choice for hubs and bearings
- Oven with thermostat | even and controlled; slower; good for several parts
- Hot plate with temperature control | suits small, flat parts
- Hot oil bath | even, but fire and burn risks and messy; not used in the food plant
- x Gas torch | uneven, uncontrolled; local overheating and distortion
```

An induction heater, which heats the part by inducing currents in it, with a probe that stops at a set temperature, is fast and even and is the workshop's first choice. The part is demagnetised by the heater at the end of the cycle, which matters for bearings that would otherwise attract iron particles.

## The sequence and the time available

Once the hot hub meets the cold shaft, heat flows from hub to shaft, and the hub begins to shrink. The time before it grips is short, a matter of seconds for a thin hub on a large shaft, longer for a heavy hub. Everything must be ready before the hub comes off the heater:

1. Shaft clean, deburred, measured and lightly lubricated or dry as the maker specifies.
2. Key fitted, if the hub is keyed, and keyway aligned.
3. A stop or spacer on the shaft to set the hub's final position.
4. Gloves, tongs or a lifting aid, and a clear path from heater to shaft.
5. Hub heated, temperature checked, and pushed on in one smooth movement against the stop.
6. Held in position until it grips, then left to cool naturally.

The workshop rehearses the push cold, without heating, to check the alignment and the path, before heating the hub. For a heavy hub or a large bearing, two people take part, one to guide and one to push, and the rehearsal agrees who does what. Hot parts at 145 °C burn skin instantly, so heat-resistant gloves are worn and the bench around the shaft is kept clear.

## How much the fit grips

The temperature calculation says how to assemble the fit. How firmly it then grips is a separate calculation, from the interference, the diameters of shaft and hub and the materials' stiffness, giving the contact pressure and from that the torque and axial force the fit can carry. *Fits That Work* explains how interference is chosen for the load, and the BIZOMAT [shrink fit design](/tools/shrink-fit-design/) calculator estimates both the grip and the assembly temperature. The two calculations belong together: a fit with too little interference slips in service; one with too much can overstress a thin hub, or need a temperature the parts cannot tolerate.

## Check the fit after assembly

Once the hub has cooled to room temperature, the fitter checks three things. Its **position** against the drawing, measured from the shaft shoulder or end, confirms it reached its stop. Its **run-out**, measured with a dial indicator on the hub's face and rim while the shaft is turned slowly, confirms it went on square and was not distorted by uneven heating. And a **witness mark**, a fine paint line across hub and shaft, lets anyone see later whether the hub has slipped. For HW-60's coupling, the coupling's alignment to the motor is then set and recorded, because a hub that has gone on even slightly askew shows up as misalignment, and misalignment shortens the life of the coupling, the seals and the bearings.

## Other uses of thermal assembly

The same method assembles many other parts: gear rims shrunk onto hubs, steel tyres on wheels, bearing inner rings on shafts, sleeves pressed into housings, valve seats in cylinder heads. Bushes made of bronze or other alloys are often cooled before being dropped into steel or aluminium housings, rather than having the housing heated, because the housing is large and the bush small. In every case the arithmetic is the same: the growth needed, divided by α times the diameter. The care needed differs only in the materials' temperature limits and the time available before the parts grip.

## Fits that loosen in service

A shrink fit made between two parts of the same material keeps its interference as both warm and cool together. A fit between different materials does not. HW-60's pump has a steel bearing in an aluminium bearing housing. The housing's bore grows at aluminium's rate, 23 × 10⁻⁶ per °C, and the bearing's outer ring at steel's, 12 × 10⁻⁶. At a housing temperature 40 °C above assembly, the bore of a **72 mm** housing grows about **(23 − 12) × 10⁻⁶ × 72 × 40 ≈ 0.032 mm** more than the bearing. If the fit's interference at assembly were less than that, the bearing would be loose at operating temperature and could creep round in its housing, wearing it.

Designers allow for this by choosing a larger interference for aluminium housings, by fitting a steel sleeve in the housing, or by using bearings and fits that their makers recommend for light-alloy housings. The calculation is the same as for every differential expansion in this book: the difference in coefficients, times the size, times the temperature change. Chapter 8 returns to it for machine design.

## Removing a shrink-fitted part

Removing a shrink-fitted hub is harder than fitting it. Heating the hub also heats the shaft beneath it, through the tight contact, so the bore does not open as much as the hub's temperature suggests. Fast heating of the hub, by induction or a large heater, before the shaft can warm, gives the best chance, with a puller already applying load so the hub moves the moment it frees. Some hubs have oil injection holes so that oil pumped between hub and shaft at high pressure expands the bore hydraulically. Where none of this works, the hub is cut off and replaced, which is why the fitting sequence is worth getting right the first time.

## A failure case: stuck halfway

This is an illustration. Before the workshop adopted an induction heater, a replacement coupling hub was heated with a gas torch, played over the hub until it "looked hot enough". Pushed onto the shaft, it slid about two thirds of the way, then stopped dead, **15 mm** short of its shoulder.

The torch had heated the hub unevenly, very hot on the side facing the flame and much cooler on the other side, so the bore was out of round and its average growth less than needed. The hub began to grip as soon as it met the cold shaft and seized before it reached the stop. There was no stop on the shaft to aim for, and no rehearsal.

The detection was immediate: the hub stopped short. The correction was to cut the hub off, check the shaft for damage, which needed light polishing, and fit a new hub using an induction heater set to the calculated temperature, with a spacer on the shaft as a stop and a rehearsed push. The workshop's shrink-fit procedure now specifies the calculated temperature, an even heating method with a temperature check, a positive stop and a cold rehearsal.

## How this applies to a small Australian business

Calculate the temperature for a shrink fit as the interference plus an assembly clearance, divided by α times the diameter. Check the parts' temperature limits, especially for hardened parts, bearings and anything with seals or rubber, and consider cooling the shaft as well to keep temperatures moderate. Heat evenly to a measured temperature, ideally with an induction heater, never with a torch on one spot. Prepare and rehearse the assembly, with a positive stop, before heating. And for fits between different materials, calculate how the interference changes at operating temperature.

## Exercise: a larger shaft

A steel hub must be fitted to a **50 mm** steel shaft with an interference of **0.04 mm** on diameter and an assembly clearance of **0.03 mm**. From 20 °C, how hot must the hub be? If the hub's maker limits it to 120 °C, how much must the shaft be cooled?

**Worked answer.** The total growth needed is **0.07 mm**. The temperature rise is **0.07 ÷ (12 × 10⁻⁶ × 50) ≈ 117 °C**, so the hub must reach about **137 °C**. At the 120 °C limit, a rise of 100 °C gives **12 × 10⁻⁶ × 50 × 100 = 0.06 mm**, leaving **0.01 mm**. Cooling the shaft by **0.01 ÷ (12 × 10⁻⁶ × 50) ≈ 17 °C**, to about 3 °C, provides it. A cold pack or a short time in a freezer would do, avoiding any need for a cryogenic agent.
