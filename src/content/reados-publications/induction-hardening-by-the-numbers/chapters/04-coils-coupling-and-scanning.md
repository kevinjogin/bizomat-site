---
book: induction-hardening-by-the-numbers
chapterSlug: coils-coupling-and-scanning
order: 4
title: "Coils, coupling and scanning"
description: "How the coil shapes the heated zone: coupling gap and power, end effects, flux concentrators, rotation, scanning speed, coil cooling, and a knocked coil that hardened one side shallow."
draft: false
---

The coil is where the electrical design meets the part. Its shape decides where the field is strong and where it is weak, its distance from the part decides how much of the generator's power arrives, and its cooling decides whether it survives. Two coils carrying the same current at the same frequency can give quite different cases on the same journal. In practice, most induction hardening problems that are not caused by the steel or the quench are caused by the coil, its position, or its wear.

This chapter covers coupling and the gap between coil and part, end effects and coil length, flux concentrators, rotating the part, scanning, and cooling the coil, using the IH-40 journal throughout. Its error is a coil knocked slightly off-centre, which hardened one side of every journal shallower than the other. Little of this chapter can be calculated precisely, so most of it is about measuring, checking and keeping things the same.

## Coupling and the gap

The coil induces current in the part through the magnetic field in the gap between them. The smaller the gap, the more of the coil's field passes through the part and the more power the part absorbs for a given coil current. As the gap grows, more field passes through the air between coil and part, inducing nothing, and the generator must drive more current to deliver the same power, with more loss in the coil and its leads.

For a round journal in a round coil, gaps of a few millimetres are usual: close enough to couple well, far enough that the part never touches the coil and that slight runout and thermal growth are accommodated. The IH-40 coil has an inside diameter of 45 mm on the 40 mm journal, a radial gap of 2.5 mm.

```figure
type: compare
title: Power reaching the IH-40 journal at three coil gaps, same generator setting
cols: Power at the work, relative | Energy in 4 s, kJ | Expected effect on the case
rowhead: Radial gap
- * 2.5 mm, as designed | 100% | about 145 | case in the middle of the band
- 4.0 mm | about 85% | about 123 | case near or below the 2.0 mm minimum
- 6.0 mm | about 70% | about 101 | shallow, patchy case
caption: This is an illustration. Relative powers are the case manufacturer's measurements on its own machine with a power meter on the coil and a calorimetric check; they are not general values, but the trend, a steep loss of coupling with gap, is typical.
```

The table explains why the shallow cases in Chapter 3's error appeared. A gap that had grown from 2.5 to about 4 mm, from a coil bent in a collision with a loading arm, cost about 15% of the power at the part with no change on the generator's display. A machine that controls the generator's output, rather than the energy actually reaching the part, cannot see that loss.

### Why the gap matters so much

The loss of coupling with gap is steep because two effects add up. The field in the gap between coil and part is wasted: it stores energy but induces no current in the steel, and the wider the gap, the larger the share of the coil's field it takes. And the coil must carry more current to drive the same field into the part through a wider gap, so its own copper losses rise with the square of that current. A gap that grows by a millimetre or two therefore costs power at the part twice over: less of the field reaches the steel, and more of the generator's output is lost in the coil.

The same steepness makes small differences in a part's diameter or position matter. A journal turned 0.5 mm undersize sits in a slightly larger gap and receives slightly less power; a journal held off-centre by worn centres sees a gap that varies around its circumference. Both are reasons why the gap, not just the generator setting, is part of the recipe.

## End effects and coil length

At the ends of a single-shot coil, the field spreads out and weakens, so the part heats less near the coil's ends than in its middle. If the coil were exactly as long as the zone to be hardened, the ends of the zone would be under-hardened. The coil is therefore made a little longer than the zone, or its end turns are shaped to concentrate the field, and the hardened length is confirmed on sectioned parts.

The ends of the zone matter for another reason. On the IH-40, the journal ends at a shoulder with a fillet, where the drawing forbids hardening (Chapter 1), and at the other end runs out onto the plain shaft. The case must end before the fillet, because a case ending in a fillet puts the transition from hard to soft, and its residual stresses, exactly where the bending stress is highest (Chapter 9). The coil's position along the shaft is set by a locating stop against the shoulder, and its end turn is positioned so that the case stops 5 mm short of the fillet.

```figure
type: svg
title: The IH-40 journal in its single-shot coil
alt: A side view of the shaft shows the 40 mm journal between a shoulder with a fillet on the left and the plain shaft on the right. A coil drawn as a rectangle in section surrounds the journal, slightly longer than the hardened zone at the right end and stopping short of the fillet at the left. The hardened case is shaded as a band just under the journal surface, tapering at each end. A dimension marks a 5 mm unhardened gap before the fillet.
caption: The coil is located off the shoulder so the case stops short of the fillet, and overhangs the zone slightly at the other end to make up for the weaker field at the coil's ends.
viewbox: 0 0 640 300
body:
<path class="bx" d="M40 60H150V240H40Z"/>
<path class="ln" d="M150 100Q150 110 160 110H600M150 200Q150 190 160 190H600"/>
<path class="bxa" d="M185 110H560V122H185ZM185 178H560V190H185Z"/>
<path class="bxi" d="M175 86H580V100H175ZM175 200H580V214H175Z"/>
<path class="ln dsh" d="M160 150H600"/>
<path class="ln" d="M160 260H185"/>
<text class="tx txs" x="150" y="282">5 mm unhardened before the fillet</text>
<text class="txb" x="300" y="78">coil, in section</text>
<text class="tx txs" x="300" y="145">hardened case, shaded</text>
<text class="tx txs" x="44" y="40">shoulder and fillet</text>
<text class="tx txs" x="480" y="40">journal, 40 mm</text>
```

## Flux concentrators

A flux concentrator is a shaped piece of soft magnetic material, laminated steel or a ferrite or iron-powder composite, fitted around part of the coil. It gathers the coil's field and directs it towards the part, increasing the coupling where it is fitted and reducing stray field elsewhere. Concentrators let a coil heat a particular area harder, such as a fillet that must be hardened on some parts, or keep the field off an area that must stay soft, such as a nearby keyway. They also heat up and age, and a cracked or overheated concentrator changes the heating pattern, so they are inspected with the coil.

## Rotating the part

No coil is perfectly round, and no part sits exactly on the coil's axis. A part held still in a coil heats more on the side closer to the coil. Rotating the part during heating averages the gap around the circumference, so every point sees the same mean coupling. The IH-40 journal turns several times during its 4-second heat, between centres that locate it on the coil's axis. Rotation is not a cure for a coil that is badly off-centre, which it can only average, but it removes the small asymmetries that every real setup has.

## Scanning

In scanning (Chapter 3), a short coil with a quench ring behind it travels along the part, or the part travels through it. The scan speed and the coil's height set how long each point is heated, and the scan speed and the quench ring's distance set the dwell before quenching. This is an illustration. With a 20 mm coil and a target of about 4 seconds under the coil, the scan speed is 20 ÷ 4 = 5 mm/s.

Scanning has its own start and end problems. At the start, the first part of the zone has no preheated steel behind it and may harden shallow unless the coil dwells there briefly; at the end, the coil approaching a shoulder or the end of the part concentrates heat and may overheat the last few millimetres. Scanning recipes therefore include a dwell or reduced speed at the start and a power reduction or early cut-off near the end, proved by sections along the full length.

## Cooling the coil

A coil carrying hundreds of amps at tens of kilohertz loses several kilowatts in its own copper and would melt in seconds without cooling. Coils are made of copper tube or machined copper with water passages, and the water carries the heat away. This is an illustration. If the IH-40 coil loses about 5 kW during a heat, and is supplied with 10 L/min of water, the water warms by 5,000 ÷ (10 ÷ 60 × 4,180) = 7.2 K while the coil is on. At 15 L/min it would warm by 4.8 K. The machine monitors the water's flow and outlet temperature and will not start a heat if the flow is low.

```figure
type: checklist
title: Start-of-shift coil checks on the IH-40 machine
caption: The open item is the one added after the error below.
- Coil cooling water flow and temperature within limits | interlocked, but checked by eye too
- Coil and concentrators free of cracks, burns and debris | scale and quench residue build up on the coil
- Locating stop set to the shoulder | so the case ends 5 mm short of the fillet
- ? Coil gap checked with a gauge at four points around the journal | 2.5 mm nominal, within the set tolerance
- Energy per part from the monitor within its band on the first parts | Chapter 10
```

## Designing a coil for a new part

Coil design is a specialist skill, usually shared between the machine builder and the user, but its starting points are simple. The coil's inside diameter is the part's diameter plus twice the chosen gap. Its length is the zone's length plus an allowance for end effects, adjusted after the first sections. The number of turns trades current against voltage: a single wide turn, like the IH-40's, carries a large current at a low voltage and heats a long zone evenly; several narrower turns carry less current at a higher voltage, and their spacing can be varied to shape the heating along the zone. The coil must match the generator's output through its transformer, so that the generator can deliver its rated power into the coil's electrical load.

An integral quench, as on the IH-40 coil, puts rows of small holes in the coil's inner face, through which the quench is sprayed onto the journal the instant the power stops. The holes' size, spacing and angle decide how evenly and how fast the journal is quenched (Chapter 6). They also block with scale and dried polymer, which is why they appear in the start-of-shift checks.

## Coil life and spares

A coil works hard: high current, rapid heating and cooling, quench spray, scale and the occasional knock. Coils crack at their brazed joints, erode where scale and spray hit them, and distort. A coil's condition changes the heating pattern long before it fails outright. The manufacturer keeps a spare IH-40 coil, proved on sectioned parts when new, so that a damaged coil can be replaced without stopping production for a re-proving trial, and records the number of parts each coil has hardened. Coil repairs, rebrazing or straightening, are followed by the same first-part sectioning as a new coil.

## Changeovers

Every time a coil is changed or the machine is set for a different part, the conditions that the proven recipe depends on can change: the coil's position, the locating stop, the quench connections, the program. The manufacturer's changeover routine is a short checklist and a first-part check: set and verify the coil gap and locating stop, load the recipe for the part, harden the first part, check its energy record, and section it, or hold the batch until a sectioned part has passed. The first-part section costs one shaft and an hour of laboratory time, which is cheap beside a batch of shafts with shallow cases.

## The error: a knocked coil

This is an illustration. One week, several IH-40 shafts sectioned for the routine case depth check showed cases of 2.6 mm on one side of the journal and 1.8 mm on the other, below the 2.0 mm minimum. Earlier sections, cut in only one plane, had happened to pass through the deeper side.

The cause was found at the machine: the coil had been struck by a loading arm during a changeover and was no longer concentric with the journal. Its gap measured about 1.5 mm on one side and 3.5 mm on the other. The rotation of the part averaged the heating around the journal, but not completely: the part spent equal time near each side of the coil, yet the coupling falls faster as the gap opens than it rises as the gap closes, and the journal's turning was too slow to even out every rotation's heating. The energy monitor had shown nothing unusual, because the total energy drawn had hardly changed.

A shaft with a 1.8 mm case on one side is a shaft whose journal will wear through its case on that side first, in service, long after it has left the factory; no customer inspection would have found it. The coil was straightened and reset. The manufacturer added a four-point gap check with a feeler gauge to the start-of-shift routine and after every changeover, began sectioning check shafts in two planes at right angles, and added a guard to keep the loading arm clear of the coil.

## Exercise: a scanning recipe for a long shaft

This is an illustration. A 300 mm long journal on a 40 mm shaft is to be scan hardened with a 20 mm coil, aiming for about 4 seconds under the coil at each point, with a 2-second dwell at the start.

1. What scan speed is needed?
2. How long does the scan take, including the start dwell and the time for the coil to clear the end of the zone?
3. What would you check on the first sectioned shafts?

**Worked answer.**

1. 20 mm ÷ 4 s = **5 mm/s**.
2. 300 mm ÷ 5 mm/s = 60 s along the zone, plus 20 ÷ 5 = 4 s for the coil to clear the end, plus the 2 s start dwell: about **66 s** per shaft.
3. Case depth at the **start**, the **middle** and the **end** of the zone, in two planes at right angles; the hardened length and where it stops relative to any shoulder; and the surface for overheating at the end, where the coil approaches the shoulder or the end of the part.
