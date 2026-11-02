---
book: solvent-vapours-by-the-numbers
chapterSlug: capturing-vapour-at-the-source
order: 8
title: "Capturing vapour at the source"
description: "Local exhaust hoods for solvent work, capture velocity and how fast it falls with distance from a hood, sizing hood airflows, checking the duct and fan, and commissioning by measurement."
draft: false
---

Chapter 7 showed that general ventilation cannot protect a person standing over a source of vapour, because the air at their face is much richer than the room average. Local exhaust ventilation solves this by catching the vapour close to where it is released, before it reaches the worker or mixes into the room. A hood draws air towards it, and if the air speed at the source is high enough to overcome the draughts and movements around it, the vapour goes into the hood instead of into the room.

This chapter sets out capture velocity and the steep fall of air speed in front of a hood, sizes hoods for Plant S's wiping bench, gun-washing station and mixing bench, checks the duct and fan with a KEVOS® tool, and describes commissioning. Its error is a hood mounted too far from the work.

## How a hood captures

A hood is an opening connected to a fan. Air flows into it from all directions in front of it, and its speed falls off rapidly with distance, roughly as it would towards a point sink in open space, where the speed falls with the square of the distance. The air speed needed at the point where vapour is released, to draw it into the hood against whatever is moving it the other way, is the **capture velocity**.

Capture velocities used in design range from about 0.25 to 0.5 m/s for vapour released with little energy into fairly still air, such as solvent evaporating from a rag on a bench, up to several metres per second for contaminants thrown out with force, such as overspray from a spray gun or dust from a grinder. Cross-draughts from doors, fans and people walking past raise the speed needed.

```figure
type: formula
title: Airflow for a plain hood to reach a capture velocity at a distance
caption: An empirical relation, after DallaValle, for an unflanged opening of face area A with the source at distance x along the hood's axis. A flange round the opening, which stops it drawing air from behind, cuts the airflow needed by about a quarter. Valid for x up to about 1.5 hood diameters.
- Q = V (10 x² + A) | airflow for capture velocity V at distance x
- step: Q_flanged ≈ 0.75 V (10 x² + A) | with a flange of adequate width
- step: V = Q ÷ (10 x² + A) | the capture velocity a given airflow achieves at x
```

The x² term dominates as soon as the source is more than a short distance from the hood. Doubling the distance roughly quadruples the airflow needed for the same capture, which is the most important single fact in hood design.

### Enclosing, receiving and capturing hoods

Hoods fall into three broad kinds, and the choice matters more than the fan. An **enclosing hood** surrounds the source, leaving only the openings needed to work, so the vapour is released inside it and the airflow only has to keep it from escaping through those openings; a fume cupboard is the familiar example. A **receiving hood** sits where the contaminant is already heading, such as a canopy over a hot tank whose vapour rises on its own. A **capturing hood** stands beside or behind a source and has to reach out and pull the contaminant in against everything else that moves it; it needs the most air for the least certainty.

Solvent vapour from cool work has no motion of its own, and it is denser than air, so it does not rise to a canopy. For benches, capturing hoods at the back, drawing horizontally across the work, are usually right; wherever a task can be enclosed instead, as at the gun-washing station, the enclosure does the same job with a fraction of the air.

### Cross-draughts

A hood's capture velocity has to beat the air movements around the work. A door opening onto a breeze, a pedestal fan cooling an operator, or a forklift passing close by can produce air speeds of 0.5 to 1 m/s or more at the bench, enough to blow vapour straight past a hood designed for 0.5 m/s. Plant S placed its bench hoods away from the roller doors, banned pedestal fans at the solvent benches in favour of a ducted supply of cool air from behind the operators, and checked capture with smoke on a windy afternoon as well as a still one.

## Hoods for Plant S

The engineer chose three hoods, one for each place where people worked closely with open solvent after the lids of Chapter 5 had been fitted.

- **The wiping bench.** A flanged hood 400 by 300 mm, face area 0.12 m², mounted at the back of the bench so that the parts being wiped sit about 300 mm from its face. Capture velocity 0.5 m/s.
- **The gun-washing station.** An enclosing hood over the lidded drum and the gun-cleaning area, open at the front. An enclosing hood needs far less air than a capturing hood, because the vapour is released inside it.
- **The mixing bench.** A slot hood along the back of the bench, drawing across the tins being mixed and thinned.

```figure
type: compare
title: Airflow for the wiping bench hood against distance from the work
rowhead: Distance from hood face to work
cols: Plain hood | Flanged hood
caption: This is an illustration. Capture velocity 0.5 m/s, face area 0.12 m², by the plain-hood relation with a 0.75 factor for the flange. The airflow needed rises steeply with distance, so the hood should be as close to the work as the job allows.
- 150 mm | 621 m³/h | 466 m³/h
- * 300 mm | 1,836 m³/h | 1,377 m³/h
- 450 mm | 3,861 m³/h | 2,896 m³/h
- 600 mm | 6,696 m³/h | 5,022 m³/h
```

With the gun-washing and mixing hoods, the three hoods were designed for about 1,150 m³/h each on average, 3,450 m³/h in total.

## The duct and the fan

The [extraction duct check](/tools/extraction-duct-check/) checks a local exhaust duct serving several hoods. From the number of hoods and the airflow per hood, the main duct's diameter, length and roughness, the total loss coefficient of its fittings, the air's density and viscosity, the least transport velocity needed, the hood entry loss and the fan pressure available at the design flow, it gives the total airflow, the duct velocity, the Reynolds number and friction factor, the pressure loss in the duct and fittings, and the fan pressure needed, and checks them against the transport velocity and the fan.

The tool was written with dust in mind, where the duct velocity must be high enough to keep particles moving. Vapours do not settle, so for them the transport velocity check is only a lower bound to keep the duct from being made needlessly large; the plant entered a modest 10 m/s.

```figure
type: compare
title: Plant S's local exhaust duct with two main duct sizes
rowhead: Quantity
cols: 250 mm duct | 315 mm duct
caption: From the extraction duct check: three hoods at 1,150 m³/h, 18 m of duct with roughness 0.15 mm, fittings loss coefficient 3, hood entry loss 250 Pa, air at 1.2 kg/m³ and 15 cSt, and the chosen fan giving 1,200 Pa at 3,450 m³/h.
- Total airflow | 3,450 m³/h | 3,450 m³/h
- Duct velocity | 19.5 m/s | 12.3 m/s
- Duct and fittings loss | 993 Pa | 367 Pa
- * Fan pressure needed | 1,243 Pa, fan short | 617 Pa, fan adequate
```

The 250 mm duct, the size first sketched, would have needed slightly more than the fan could give, and at 19.5 m/s it would have been noisy and would have left no margin for a filter or damper added later. The 315 mm duct roughly halved the fan pressure needed and left a good margin. The plant used it.

### Where the exhaust goes

The exhaust from solvent hoods is vapour-laden air, and it has to be discharged where it cannot return. Plant S's discharge stack rises above the roof line, away from air intakes, doors and the neighbouring building's windows, and discharges vertically at a velocity that carries the plume upward. The fan is of a type suitable for flammable vapour, with its motor outside the air stream, a requirement for a competent designer to settle. Even at the design flow the exhaust is far below the lower explosive limit, about 0.013% from the wiping bench's 0.175 m³/h of vapour in its hood's 1,377 m³/h, but the fan and duct must still not be able to ignite a richer mixture drawn in after a spill.

## The error: a hood too far away

Before the engineer's design, the plant had bought a hood for the wiping bench and installed it as a canopy above the bench, with its face about 600 mm above the parts, so that it would be clear of the operator's head. Its fan delivered about 1,836 m³/h, the figure that would have given 0.5 m/s at 300 mm for a plain hood of that size.

At 600 mm, the same airflow gives a capture velocity of 0.51 ÷ (10 × 0.6² + 0.12) = 0.137 m/s at the parts, barely a quarter of the design value and below the room's ordinary air movements. Worse, a canopy above the bench drew the vapour upward past the operator's face, which was between the work and the hood. Personal sampling showed that the canopy had made almost no difference to the operator's exposure.

```figure
type: stats
title: The canopy hood over the wiping bench
caption: This is an illustration. The same airflow gives very different capture at different distances, and a canopy draws vapour past the face of anyone leaning over the work.
- 1,836 m³/h | airflow of the canopy's fan
- 600 mm | distance from the hood face to the parts
- 0.137 m/s | capture velocity at the parts, against 0.5 required
- 5,022 m³/h | flanged airflow that 600 mm would have needed
```

The fix cost less than the canopy. The hood was moved to the back of the bench, flanged and lowered so that the parts sat about 300 mm from its face, with the operator standing in front and the hood drawing vapour away from them, not past them. The same fan then delivered more than the 1,377 m³/h a flanged hood at that distance needs.

## The spray booth as a hood

A spray booth is a large enclosing hood. Air is drawn in across its open face, past the painter and the part, through filters that catch the overspray, and out through the exhaust. Its airflow is set by the face area and the air speed across it. Spray painting booths and designated spray painting areas in Australia are covered by AS/NZS 4114, named here for scope only, which sets requirements for their construction, airflow and use.

For Plant S's booth, with an open face 3 m wide and 2.5 m high and an illustrative face velocity of 0.5 m/s, the airflow is 3 × 2.5 × 0.5 × 3,600 = 13,500 m³/h. If about 9 kg of paint and thinner solvent evaporates in the booth over a 6-hour spraying day, 1.5 kg/h with an average vapour molar mass of about 82 g/mol, the vapour release is about 0.45 m³/h and the average concentration in the booth's exhaust about 33 ppm. That is very far below any fire limit, which is the point of a booth's large airflow.

It is not a health figure for the painter. The painter stands inside the source, in the near field of the spray, and breathes overspray, solvent and, with a two-pack polyurethane, isocyanates, which are a serious respiratory sensitiser. The booth keeps the workshop clean and the booth itself far from flammable; the painter's protection comes from the respiratory protective equipment specified by the paint's safety data sheet and Safe Work Australia's guidance for spray painting, typically air-supplied for isocyanate paints.

## The cost of the air

Every cubic metre of air a hood or booth extracts has to be replaced from outside, and in winter that air has to be heated. Plant S's three hoods and the booth together extract about 16,950 m³/h. Heating that much air by 15 K takes 16,950 ÷ 3,600 × 1.2 × 1,006 × 15, about 85 kW, roughly 680 kWh over an 8-hour winter day. The three bench hoods alone account for about 17 kW of it.

```figure
type: stats
title: Heating the make-up air in winter
caption: This is an illustration. Air at 1.2 kg/m³ and 1,006 J/kg·K, heated by 15 K from outside to the workshop. The figure explains why hoods should run only while they are needed, and why the plant fitted run-on timers rather than leaving them on all day.
- 16,950 m³/h | total extraction, three hoods and the booth
- about 85 kW | heat to warm the make-up air by 15 K
- about 17 kW | the three bench hoods' share
- about 680 kWh | per 8-hour winter day if everything ran continuously
```

Extraction that runs when nobody is using the bench wastes that heat, and people tend to switch off a noisy hood they cannot see the point of. Plant S fitted each bench hood with a switch at the work position and a run-on timer of ten minutes, enough to clear the bench after the last use, and made the gun-washing hood start automatically when its drum lid is opened.

## Commissioning by measurement

A local exhaust system is not finished when it is installed. It is finished when measurements show it works.

```figure
type: checklist
title: Commissioning and maintaining Plant S's local exhaust
caption: Each check compares a measurement with a design value. Australian guidance expects local exhaust ventilation to be maintained and tested; the measurements give the plant its own baseline.
- x Capture velocity at the work position | vane or thermal anemometer, against 0.5 m/s
- x Smoke test at each hood | smoke released at the work goes cleanly into the hood with the operator in place
- x Airflow at each hood | duct traverse or hood static pressure, against design
- x Fan pressure and current | recorded as a baseline for later checks
- x Discharge | clear of intakes, vertical, above the roof line
- ? Personal sampling | exposure before and after, by an occupational hygienist
```

The plant recorded each hood's static pressure on a label beside it with a simple gauge, so that a falling reading, from a blocked filter, a slipped belt or a damaged duct, could be noticed by anyone.

## How this applies to a small Australian business

Catch vapour where it is released, with a hood close to the work and drawing it away from the worker's face. Calculate the airflow from a capture velocity and the real distance, remembering that the airflow needed rises with the square of the distance. Flange hoods and enclose sources where you can. Size the duct so that the fan has a margin, discharge high and away from intakes, and commission by measuring capture velocity and airflow, not by switching on the fan. Give people a switch at the work and a run-on timer, so the hood is used when it is needed and not wasting heated air when it is not.

## Exercise: a closer hood

The mixing bench's work sits 250 mm from a flanged hood with a face area of 0.10 m². (a) What airflow gives a capture velocity of 0.4 m/s at the work? (b) If the operator later moves the work to 400 mm from the hood, what capture velocity does that airflow give? (c) What would you do?

**Worked answer.** (a) Q = 0.75 × 0.4 × (10 × 0.25² + 0.10) = 0.75 × 0.4 × 0.725 = 0.2175 m³/s, about **783 m³/h**. (b) At 400 mm, a flanged hood gives V = Q ÷ (0.75 × (10 × 0.4² + 0.10)) = 0.2175 ÷ (0.75 × 1.70) = **0.17 m/s**, well under half the design value. (c) Fix the work position so it cannot drift away from the hood, for example with a raised stand or a marked area at the right distance, or extend the hood with side baffles that enclose the work. Then check the capture velocity at the real work position.
