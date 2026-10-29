---
book: condensation-control-by-the-numbers
chapterSlug: cold-pipes-sweating-and-insulation
order: 7
title: "Cold pipes, sweating and insulation"
description: "How much water a cold pipe gathers in humid air, the insulation thickness that keeps its surface above the dew point, why a vapour barrier matters, and the valves left bare for access."
draft: false
---

A pipe carrying water colder than the air's dew point gathers condensation on its outside, continuously, for as long as the conditions last. Plumbers call it sweating. On a chilled-water line it is expected and designed for. On a cold-water main in a pump room it often comes as a surprise, because the water is not chilled at all; it is simply cooler than a humid summer day.

This chapter calculates how much water a bare cold pipe at PS-7 gathers, finds the insulation thickness that keeps its surface above the dew point, explains why the insulation must also be a vapour barrier and what happens when it is not, and follows the water from the valves that were left bare for access down onto the equipment below them.

## A cold pipe in a humid room

This is an illustration. PS-7's pump room holds the duty and standby pumps and a **DN100** steel delivery main, **114.3 mm** outside diameter, about **6 m** of which runs exposed along the wall above a local control station. It carries bore water at about **17 °C** all year. The room is ventilated by louvres, and in summer its air follows the outside air, made a little wetter by the room's own sources: a damp floor, a sump and the pumps' gland leakage. The utility takes **30 °C and 80% RH** as the room's humid design condition, which has a dew point of **26.2 °C**.

A steel pipe full of flowing water has a surface temperature almost equal to the water's, because the water-side heat transfer is strong and steel conducts well. The pipe's outside is therefore at about 17 °C, more than 9 K below the room's dew point. Condensation is certain.

### How much water a bare pipe gathers

The rate at which water condenses on a cold surface can be estimated from the same analogy between heat and mass transfer used in Chapter 2. The mass flux is about h ÷ c_p times the difference between the air's mixing ratio and the mixing ratio of saturated air at the surface temperature.

```figure
type: formula
title: Condensation on PS-7's bare delivery main
formula: m = (h ÷ c_p) × (w_air − w_surface)
caption: This is an illustration. Convection coefficient for a horizontal pipe in still room air assumed at 8 W/m²·K. The estimate ignores the latent heat released, which warms the surface slightly.
- h | outside convection coefficient, 8 W/m²·K
- c_p | specific heat of air, 1,006 J/kg·K
- w_air | mixing ratio at 30 °C, 80% RH, about 21.5 g/kg
- w_surface | saturated at 17 °C, about 12.1 g/kg
step: m ≈ 8 ÷ 1,006 × 9.4 g/kg ≈ 0.075 g/m²·s ≈ 270 g per m² per hour
step: 6 m of pipe has 2.15 m² of surface: about 580 g an hour, 5.8 litres in a 10-hour humid day
```

At a milder 28 °C and 75% RH (dew point 23.2 °C), the same pipe gathers about 165 g/m² an hour, or 3.6 litres over a 10-hour day. These are large quantities. Water at this rate does not stay on the pipe; it runs to the lowest point and drips, and at PS-7 the lowest points were the flanges above the local control station.

### Why the pump room is wetter than outside

The design condition of 30 °C and 80% RH is wetter than most of PS-7's summer weather, and the reason is the room's own water. A room's air is the outside air plus whatever water the room adds, diluted by its ventilation. Each kilogram of water evaporated into the room per hour raises the absolute humidity of the air by one kilogram divided by the ventilation flow in cubic metres per hour.

This is an illustration. Suppose the pump room's wet floor, open sump and gland leakage evaporate about **0.5 kg of water an hour** on a warm day, and the louvres give about two air changes an hour in the room's 60 m³, a flow of 120 m³/h. Outside air at 28 °C and 75% RH carries 20.4 g/m³. The room adds 500 ÷ 120 ≈ **4.2 g/m³**, so the room's air carries about 24.5 g/m³, which at 28 °C is about 90% RH with a dew point of **26.3 °C**, 3 K above the outside dew point and close to the design condition. Tripling the ventilation to six air changes an hour would cut the added water to 1.4 g/m³ and the room's dew point to about 24.3 °C.

Two lessons follow. Reducing the room's own water, by fixing gland leaks, covering the sump and draining the floor, lowers the dew point the insulation must beat. And more ventilation helps only up to a point, because it can never bring the room below the outside dew point, which on a humid summer day at PS-7 is still above the 17 °C water temperature. Ventilation alone cannot stop a cold pipe sweating; insulation can.

## Insulating to stay above the dew point

Insulation stops sweating by putting a thermal resistance between the cold pipe and the air, so that the outside of the insulation runs close to the air temperature. The design question is the least thickness that keeps the outer surface above the dew point with a margin.

The outer surface temperature follows from two resistances in series per metre of pipe: conduction through the insulation, ln(r₂/r₁) ÷ (2πk), and convection from its outer surface, 1 ÷ (2π r₂ h). The heat flowing in from the air divides the temperature difference between them. The [insulated pipe tool](/tools/insulated-pipe/) does exactly this sum. Entered with a pipe temperature of 17 °C and an ambient of 30 °C, it returns a negative heat loss, which is a heat gain into the pipe, and the outer surface temperature, which is the figure to compare with the dew point.

Two choices in the inputs decide the answer. The insulation's conductivity: closed-cell elastomeric foam of the kind used on cold pipes is typically about **0.035 W/m·K** when dry, the value used here. And the outside coefficient: a lower coefficient leaves the surface colder, so a cautious design for still air uses a low value, here **6 W/m²·K**.

```figure
type: compare
title: Outer surface of PS-7's insulated main at 30 °C, 80% RH
cols: Outer surface | Margin over 26.2 °C dew point | Heat gain per metre
rowhead: Insulation thickness
caption: This is an illustration: k = 0.035 W/m·K, h = 6 W/m²·K, water at 17 °C. The least thickness that just reaches the dew point is about 13 mm; 25 mm leaves a margin of 1.7 K.
- None | 17.0 °C | −9.2 K | 28.0 W/m
- 9 mm | 25.1 °C | −1.1 K | 12.2 W/m
- 13 mm | 26.3 °C | +0.1 K | 9.9 W/m
- 19 mm | 27.3 °C | +1.1 K | 7.9 W/m
- *25 mm | 27.9 °C | +1.7 K | 6.6 W/m
- 32 mm | 28.3 °C | +2.2 K | 5.6 W/m
```

A margin is needed because every input is uncertain: the room can be more humid than the design condition, the air stiller, the insulation thinner where it is compressed at supports, and its conductivity higher once it has aged. The utility chose **25 mm**, the smallest common wall thickness with more than 1.5 K of margin. The tool, with 25 mm, 0.035 W/m·K, 6 W/m²·K and 6 m of pipe, gives an outer surface of 27.9 °C and a heat gain of 6.6 W/m, about 40 W for the run, which makes no measurable difference to the water.

### What the coefficient does

The outside coefficient deserves a second look, because it acts in the opposite direction from intuition. For a hot pipe, a higher coefficient means more heat lost. For a cold insulated pipe, a higher coefficient pulls the surface closer to the air temperature, which is safer. With 25 mm of insulation, the surface is at 28.6 °C with h = 10 W/m²·K but only 27.1 °C with h = 4. A pipe in a stagnant corner, behind a cabinet or in a ceiling void is therefore at more risk than the same pipe in moving air, and the design value should suit the worst location along the run.

## The insulation must also be a vapour barrier

The temperature calculation assumes the insulation stays dry. It will not, unless water vapour is kept out of it. The inner surface of the insulation is at the pipe's temperature, 17 °C, far below the room's dew point. If room air can reach the pipe, through joints, cuts or a porous material, its vapour condenses on the pipe under the insulation, out of sight.

Wet insulation fails in a self-reinforcing way. Water conducts heat many times better than the gas in the foam's cells, so as the insulation takes up water its conductivity rises. A higher conductivity lowers the outer surface temperature, and once the outer surface falls below the dew point, water condenses on the outside too. If, for illustration, the 25 mm layer's conductivity doubled to 0.07 W/m·K, its outer surface would fall to 26.3 °C, with a margin of only 0.2 K. A 19 mm layer in the same state would sit at 25.5 °C, below the dew point.

That is why cold pipes are insulated with closed-cell materials, whose cells do not connect, and why their joints are glued and taped. Fibrous insulation such as mineral wool or glass wool is permeable to vapour and can only be used on cold pipes with a continuous, sealed vapour barrier on its warm side, which is hard to keep intact. The rule has a simple form: on a cold pipe, the vapour barrier goes on the outside, the warm side, and it must be continuous.

```figure
type: checklist
title: Insulating PS-7's cold delivery main
caption: The open item is this chapter's error. A cold pipe is only as dry as its least-insulated fitting.
- x Closed-cell insulation of the calculated thickness | 25 mm elastomeric foam, k about 0.035 W/m·K
- x Longitudinal seams and butt joints glued with the maker's adhesive | no gaps for vapour to reach the pipe
- x Insulation carried through pipe supports without compression | load-bearing inserts at clamps
- x Ends sealed where the insulation stops | glued to the pipe at each termination
- ? Valves, flanges and strainers insulated with removable sealed jackets | left bare for access, and dripping
```

### Supports, clamps and wall penetrations

Most insulation failures on cold pipes start where something interrupts the insulation. A pipe clamp fastened directly to the steel conducts heat from the wall bracket into the cold pipe, so the clamp itself runs close to the water temperature and sweats. Worse, the insulation is usually cut around it, leaving a gap for vapour. The answer is a load-bearing insulated insert, a block of high-density closed-cell material or a rigid foam cradle, fitted between the pipe and the clamp, with the main insulation glued to it on both sides. The clamp then sits on warm material and the vapour barrier stays continuous.

Wall penetrations need the same care: the insulation should run through the sleeve without a break and be sealed to it, so that air from a cavity or from outside cannot reach the pipe. Where the main leaves the room underground, the insulation should stop at a sealed end glued to the pipe, not in a loose, open cut where the ground's damp air can travel back along the pipe. Each of these details is cheap at installation and expensive to find later, under a wet, failing layer of foam.

## The error: fittings left bare for access

This is an illustration. When the delivery main was insulated, the contractor stopped the insulation short of the gate valve, the two flanged joints beside it and a strainer, so that they could be reached for maintenance. Those fittings, about **0.6 m²** of bare, cold metal together, sat directly above the local control station on the wall. Within a fortnight of humid weather the control station's pushbuttons had started to stick, and its terminals showed a white bloom.

The investigation found water dripping from the lowest flange bolt directly onto the control station's lid, and running down its cable into the gland. The rate fitted the calculation: at the design condition, bare metal at 17 °C gathers about 270 g/m² an hour, so 0.6 m² of fittings gathered about **160 g an hour**, and all of it left the pipe at one or two drip points. On a humid day that was more than a litre and a half on one small enclosure.

```figure
type: stats
title: The bare fittings above the control station
caption: This is an illustration at 30 °C and 80% RH. A short length of bare fitting on an otherwise insulated pipe gathers almost as much water as a long bare pipe, and delivers it to a single drip point.
- 0.6 m² | bare valve, flanges and strainer
- 270 g/m²·h | condensation on bare metal at 17 °C
- 160 g/h | water dripping from the lowest flange
- 1.6 L | in a 10-hour humid day
```

The fix had four parts. The fittings were fitted with removable insulated jackets made from closed-cell material, with sealed, overlapping closures that can be opened for maintenance and closed again. A drip tray with a drain was fitted under the valve as a second line of defence. The control station was moved along the wall so that nothing electrical sat directly beneath the pipe. And the maintenance procedure was changed so that a jacket opened for work is closed and resealed before the crew leaves.

### Other cold surfaces in a pump room

The same reasoning applies to other cold items at PS-7 and similar sites: pump casings and motor end shields cooled by the water they carry, pressure gauges and their impulse lines, sample taps, and the cold bodies of non-return valves. Pump casings cannot sensibly be insulated, so the usual answers there are drains, drip trays and keeping electrical equipment out from under them. In a pump room, the rule of thumb is that anything carrying water below the room's dew point will drip, and the room's layout should assume it does.

## Exercise: a chilled-water branch

A future upgrade will add a **48.3 mm** outside diameter branch carrying chilled water at **8 °C** through the same room, with the same 30 °C, 80% RH design condition. Using k = 0.035 W/m·K and h = 6 W/m²·K, find whether 25 mm of insulation keeps its outer surface above the 26.2 °C dew point with at least 1.5 K of margin, and if not, what thickness does.

**Worked answer.** With 25 mm on the 48.3 mm pipe, r₁ = 24.15 mm and r₂ = 49.15 mm. The conduction resistance is ln(49.15 ÷ 24.15) ÷ (2π × 0.035) ≈ 3.231 m·K/W, and the surface resistance is 1 ÷ (2π × 0.04915 × 6) ≈ 0.540 m·K/W, a total of 3.771. The heat gain is (8 − 30) ÷ 3.771 ≈ −5.83 W/m, and the outer surface is 30 − 5.83 × 0.540 ≈ **26.9 °C**, only 0.7 K above the dew point. Repeating with thicker layers: 32 mm gives about 27.6 °C (1.4 K margin) and **40 mm gives about 28.1 °C (1.9 K margin)**, which meets the requirement. A colder pipe needs more insulation than the bore-water main even though it is smaller, because the temperature difference to be held across the insulation is larger.
