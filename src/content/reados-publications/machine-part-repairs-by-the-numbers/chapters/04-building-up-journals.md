---
book: machine-part-repairs-by-the-numbers
chapterSlug: building-up-journals
order: 4
title: "Building up worn journals"
description: "Plan a weld build-up of a worn shaft journal: the deposit and machining allowance, the steel's carbon equivalent and preheat, bead sequence to limit bowing, and the checks that follow."
draft: false
---

Building up a worn journal by welding and turning it back to size is one of the oldest machine repairs. Dunham described it in 1917 for a car's crankshaft journal: the journal was built up with mild steel filler until, when turned down, it would be oversize, about a quarter of an inch in diameter in his example, with the shaft kept at a red heat in a charcoal fire while the metal was added. He explained why: the shaft was heavy and drew heat away quickly, so if it was not kept hot, the added metal cooled before it was properly fused and came out hard, porous and difficult to machine. He added the metal in lengthwise runs, turning the shaft a little after each, until the whole surface was covered.

Modern build-up uses arc welding rather than the gas flame, and controlled preheat rather than a fire, but Dunham's reasons still apply. This chapter plans the build-up of the harvester shaft's worn journal: how much metal to deposit, what preheat the steel needs, how to sequence the beads to limit distortion, and how to check the result.

## The deposit and the allowance

The journal is worn to about 49.2 mm and must finish at 50.00 mm. The build-up must cover the worn area with sound weld metal, extend beyond it onto unworn shaft, and leave enough extra diameter that machining removes the rough surface and any defects near it, leaving clean, fully fused metal at the finished size.

```figure
type: formula
title: Weld metal needed to build up the harvester shaft journal
formula: V = π ÷ 4 × (D_built² − D_worn²) × L
caption: This is an illustration. The journal is 40 mm long; the build-up runs 10 mm beyond it at each end to blend into the shaft. Built-up diameter 52.5 mm leaves 1.25 mm of radial machining allowance.
- D_worn | 49.2 mm
- D_built | 52.5 mm
- L, build-up length | 60 mm
step: V = 0.785 × (52.5² − 49.2²) × 60 ≈ 15,800 mm³
step: mass ≈ 15,800 × 7.85 ÷ 1,000 ≈ 124 g of weld metal
```

About 124 g of weld metal is a small deposit, perhaps five minutes of arc time with a manual metal arc electrode depositing around 1.5 kg an hour. The time of the repair lies elsewhere: preparing and cleaning the shaft, preheating it and holding the temperature, making the beads in a careful sequence, letting it cool slowly, and turning it back to size. The welding is the smallest part of the job. A quote that prices the repair from the arc time alone will be wrong by a factor of ten or more, and a repairer who rushes the other steps to match such a quote is likely to produce the cold, hard build-up that Dunham warned against.

## Know the steel

The steel decides the procedure. A plain low-carbon steel shaft can be built up with little or no preheat; a medium-carbon or alloy steel shaft, which most power transmission shafts are, hardens in the heat-affected zone as it cools and can crack, especially with any hydrogen present, unless it is preheated and cooled slowly. A through-hardened or case-hardened shaft may not be weldable at all without a full heat treatment afterwards. Weldability by the Numbers explains the link between carbon, cooling rate and hardness in its chapter on [carbon, cooling rate and hardness](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/), including the carbon equivalent used to judge a steel's hardenability.

This is an illustration. The harvester maker's parts information identified the shaft as a medium-carbon chromium steel, with nominal composition about 0.40% carbon, 0.75% manganese and 0.2% chromium. Using the widely published IIW carbon equivalent, CE = C + Mn ÷ 6 + (Cr + Mo + V) ÷ 5 + (Ni + Cu) ÷ 15, the steel's CE is about 0.40 + 0.125 + 0.04 ≈ **0.57**, high enough that its heat-affected zone would harden and could crack if welded cold.

## Preheat and cooling

For a steel with a carbon equivalent of that order, a preheat of a few hundred degrees, held through the welding, with a low-hydrogen filler and slow cooling afterwards, is the usual approach; the procedure for the actual steel, size and filler is set by competent people from the filler maker's and the steel maker's guidance and the applicable standards. Weld Repairs That Hold explains the reasons for preheat, hydrogen control and slow cooling in its chapter on [preheat, hydrogen and cooling](/reados/publications/weld-repairs-that-hold/preheat-hydrogen-and-cooling/). Dunham's charcoal fire did the same job a century ago: the whole section of the shaft at the journal was kept hot, so that the weld and the metal around it cooled slowly and stayed soft enough to machine.

For the harvester shaft, the repairer's procedure, prepared by its welding supervisor, used induction heating blankets to bring the journal and about 100 mm on either side to the preheat temperature, measured with temperature-indicating crayons and a contact thermometer, held it there through the welding, and wrapped the shaft in insulation afterwards to cool slowly overnight.

## Choosing the filler

The filler must suit both the shaft steel and the service. For a bearing journal, the weld metal must be strong and tough enough to carry the shaft's stresses, machinable to a good finish, and compatible with the bearing's fit. A low-hydrogen filler of strength similar to the shaft steel, or slightly lower, is common; very hard fillers make machining difficult and can crack, and very soft ones may wear or deform under the bearing. Dunham used mild steel filler for journals, but noted that more modern cars needed a filler of less ductility, with some shops using vanadium or nickel alloy rods; the principle, of matching the filler to the shaft, is the same now.

## Bead sequence and bowing

Weld metal shrinks as it cools, and a bead laid along one side of a shaft pulls that side shorter, bowing the shaft towards it. Dunham's lengthwise runs, each followed by turning the shaft slightly, spread the shrinkage round the circumference. Modern practice achieves the same in one of two ways:

- **longitudinal beads**, laid along the journal, with each bead placed opposite the previous one, then at right angles to both, and so on, so that each pull is balanced by another on the opposite side;
- **circumferential or helical beads**, laid round the shaft as it rotates slowly in a lathe or positioner, so that shrinkage is uniform round the circumference from the start.

```figure
type: compare
title: Two ways to lay the build-up
cols: How | Strengths | Watch for
caption: General characteristics. Either can give a sound build-up; mechanised helical build-up in a lathe gives the most even result on large shafts.
- Longitudinal beads | along the journal, opposite sides in turn | easy by hand; no rotating equipment | bowing if the sequence is not balanced
- *Helical beads | round the shaft, rotating in a lathe or positioner | uniform shrinkage; smooth surface; mechanises well | needs rotating set-up and earthing through a rotary clamp
```

Both methods leave some bow, and Chapter 6 explains how it is measured and corrected. The ends of the build-up are blended smoothly into the shaft, never stopped with a step, because a step at the end of a build-up is a stress raiser of exactly the kind Chapter 3 warned against.

## Before welding

The shaft is cleaned of oil, grease and paint over the whole heated length, because contamination burns into the weld as porosity and hydrogen. Any fatigue cracks are found, by magnetic particle or dye penetrant inspection, and ground out completely before build-up, because welding over a crack hides it without removing it. Keyways and other features near the journal are protected or filled, as Chapter 5 describes. The shaft's run-out is measured before welding, so that the distortion caused by the build-up can be measured against it afterwards.

## After welding

Once the shaft has cooled slowly to room temperature, it is checked and machined. The repairer measures the run-out, straightens the shaft if necessary (Chapter 6), turns the journal to finished size with a good surface finish and a smooth blend at each end, and checks the surface for porosity, lack of fusion or cracks, visually and with dye penetrant or magnetic particle inspection. A portable hardness tester checks that the weld metal and the heat-affected zone are within the range the procedure aimed for: hard spots show where the cooling was too fast and can crack in service. The bearing's fit on the finished journal is checked to the bearing maker's requirement. The finished diameter, the hardness readings and the inspection results are written on the job card, so that if the shaft comes back, the next person knows exactly what was done and found, and can tell a repair problem from a machine problem.

## Machining allowance and the finished surface

The radial machining allowance, 1.25 mm on the harvester shaft, is a balance. Too little, and the finished surface may still contain the ripples, oxide and small defects of the last bead's surface, or the fusion boundary of a bead that did not quite cover; too much, and the extra weld metal costs time to deposit and to machine, and the extra heat adds distortion. An allowance of around a millimetre or two on radius is common for manual build-up; mechanised helical build-up, which gives a smoother, more even surface, can work with less. The allowance must also cover the bow the build-up introduces, because a bowed shaft machined true loses more metal on one side than the other, and the thin side must still clean up to sound weld metal.

## Rotating the shaft

For helical build-up, the shaft is mounted between centres or in a chuck in a lathe or on a welding positioner, and turned slowly while the welding gun or torch is traversed along it, by hand or on the lathe's carriage. The welding current must not pass through the lathe's bearings, which it would damage by arcing across them; a rotary earth clamp on the shaft itself carries the current back to the machine. The rotation speed is set so that the surface passes under the arc at the travel speed the procedure calls for, which for a 50 mm shaft is a slow turn: a travel speed of 250 mm a minute corresponds to about 250 ÷ (π × 50) ≈ 1.6 rev/min.

## Recording the procedure

The procedure for the harvester shaft was written down: the steel, the filler and its baking, the preheat and its measurement, the bead sequence, the interpass temperature, the slow cooling, the machining allowance and the inspections. Writing it took the welding supervisor half an hour. It meant that the next build-up of the same shaft, or of a similar one, would be done the same way, and it became part of the repair record in Chapter 10.

## Why the build-up is worth the care

Dunham's warning was that a journal built up on a cold shaft gave hard, porous metal that was difficult to machine. The modern explanation is the same in different words: fast cooling of the heat-affected zone of a medium-carbon steel forms hard martensite, which is brittle and, with hydrogen from the welding, can crack, while poor fusion and porosity leave defects just under the finished surface. Both shorten the shaft's fatigue life, as Chapter 2 explained. A build-up that is preheated, low in hydrogen, well fused, cooled slowly and blended smoothly avoids both.

## A failure: the cold build-up

This is an illustration. Before the repairer adopted its current procedure, a fitter had built up a worn tractor PTO shaft journal with ordinary electrodes on a cold shaft, to save time. When the shaft was turned, the tool chattered and chipped on hard spots in the weld, and the finished journal had fine pores. The shaft was fitted anyway because the customer was waiting. It cracked at the end of the build-up within a fortnight, and the crack ran across the shaft.

The fracture showed a fatigue origin in the hard heat-affected zone at the abrupt end of the build-up. The shaft had been a medium-carbon steel, the electrodes had not been low-hydrogen, and the build-up had ended in a step. Every one of those faults was avoidable, and the repairer's written procedure for shaft build-up dates from that job.

## Exercise: a bigger journal

A 75 mm journal, 50 mm long, is worn to 74.0 mm. The build-up is to extend 15 mm beyond each end of the journal and leave 1.5 mm of radial machining allowance. Calculate the built-up diameter, the volume and mass of weld metal, and the arc time at a deposition rate of 1.5 kg an hour.

The built-up diameter is 75 + 2 × 1.5 = **78 mm**, and the build-up length is 50 + 2 × 15 = **80 mm**. The volume is about 0.785 × (78² − 74²) × 80 ≈ 0.785 × 608 × 80 ≈ **38,200 mm³**, and the mass about 38,200 × 7.85 ÷ 1,000 ≈ **300 g**.

At 1.5 kg an hour, the arc time is about 0.30 ÷ 1.5 × 60 ≈ **12 minutes**. As with the smaller journal, preheating, the careful bead sequence, slow cooling and machining will take far longer than the welding itself, and the quote must allow for them.
