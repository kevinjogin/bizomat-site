---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: stripping-and-stripper-springs
order: 5
title: "Stripping and stripper springs"
description: "Why strip grips the punches, fixed and spring strippers, sizing MP-40's stripper springs for force, travel and regrinds, what they add to press load, and a stripper too weak to strip."
draft: false
---

Cutting is only half of a punch's work. After breakthrough the sheet around each punch grips it, because the metal that was pushed aside springs back against the punch's sides, and the punch has to be pulled out of that grip on the way up. If nothing holds the strip down, it rides up with the punches and jams the die. The part of the die that holds it is the stripper, and in most modern dies the stripper is a plate on springs that also holds the strip flat while it is cut.

This chapter estimates MP-40's stripping force, compares fixed and spring strippers, sizes the springs for force, travel and a lifetime of regrinds, shows what they add to the load on the press and the energy of each stroke, and ends with a stripper whose springs were preloaded too little to strip.

## Why the strip grips the punch

When a punch pierces a hole, the sheet around it is compressed and pushed outward. After breakthrough, the elastic part of that deformation recovers and the hole closes slightly on the punch. Friction between the punch's sides and the hole's burnished wall then resists the punch's withdrawal. The longer the punch's contact with the sheet, the thicker and stronger the sheet, and the tighter the clearance, the larger the grip. Blunt punches, which push more metal aside before cutting, grip more than sharp ones.

The force needed to strip a punch is usually estimated as a percentage of its cutting force. Published figures vary widely, from a few per cent to about a fifth, depending on material, clearance and how many punches are close together; the stripping force for a cluster of punches in a small area is larger than for the same punches spread out. This book takes **10%** of the cutting force as an illustration:

- MP-40's cutting force: 192.8 kN (Chapter 2);
- stripping force: 0.10 × 192.8 = **19.3 kN**.

That force is needed for the whole time the punches are withdrawing from the strip. It is largest at the start of withdrawal and falls as the punches come out, but the stripper must not let go until every punch is clear.

## Fixed and spring strippers

There are two kinds of stripper.

- A **fixed stripper** is a plate bolted above the die with a channel for the strip to run through. The punches pass through clearance holes in it. On the upstroke the strip rises with the punches until it hits the underside of the plate, which pulls it off. A fixed stripper is cheap, simple and adds no load to the press. It does not hold the strip flat during cutting, and the strip can lift and bow, which spoils flatness and lets slugs pull.
- A **spring stripper** is a plate carried on springs from the upper die. It comes down with the ram, meets the strip before the punches do, clamps it to the die face, and stays there while the punches cut and withdraw. It holds the strip flat, can guide the punches' tips in close-fitting bushes (Chapter 4), and lets the operator see the strip. It costs more, and its springs add load to the press.

MP-40's die uses a spring stripper, for the flatness of the plate and to guide its punches. Hodgson's book described both kinds in 1903, along with knockouts that eject parts from the die; the arrangement has changed little since, though the springs have.

```figure
type: steps
title: One stroke of MP-40's spring stripper
caption: This is an illustration. The stripper face stands 1.0 mm below the punch tips at rest, so its springs compress 4.0 mm in all: 1.0 mm before the punches touch, 2.0 mm through the sheet and 1.0 mm of entry into the die.
- Stripper meets the strip | springs at their 5.5 mm preload, about 16.5 kN of clamping
- Punches reach the strip | springs compressed 1.0 mm more; strip clamped flat
- Punches cut and break through | 2.0 mm more; pilots and punches guided at the tips
- *Bottom of stroke | punches 1.0 mm into the die; springs at 9.5 mm, 28.5 kN
- Upstroke strips the punches | spring force falls from 28.5 to 19.5 kN as the punches withdraw
- Stripper lifts off the strip | strip free to feed
```

## The stripper's travel

The springs' compression has to cover every millimetre the stripper moves relative to the punches, plus an allowance for the punches being ground shorter over the die's life. For MP-40, as an illustration:

- the stripper face stands **1.0 mm** below the punch tips at rest, so that it meets the strip first;
- the punches travel **2.0 mm** through the sheet;
- they enter the die **1.0 mm** to push slugs and blanks clear;
- working travel: 1.0 + 2.0 + 1.0 = **4.0 mm**.

Over its life, MP-40's die is expected to have about **3.0 mm** ground off its punches in regrinds (Chapter 9). Each regrind shortens the punches relative to the stripper, so unless the springs are re-shimmed or the stripper is ground by the same amount, the springs compress further at the bottom of every stroke. The springs must be able to take the working travel plus that allowance without exceeding their safe deflection.

## Sizing the springs

The spring stripper must still be pressing on the strip with at least the full stripping force at the moment the last punch tip leaves the strip's top surface. At that moment the springs are compressed by their preload plus the 1.0 mm by which the stripper stands below the punch tips. At the bottom of the stroke they are compressed by their preload plus the full 4.0 mm.

This is an illustration. The toolmaker chooses **ten die springs**, each rated at **300 N/mm**, giving a combined rate of 3,000 N/mm, and fits them with **5.5 mm** of preload. Then:

- force at the end of stripping: 3,000 × (5.5 + 1.0) = **19.5 kN**, just over the 19.3 kN needed;
- force at the bottom of the stroke: 3,000 × (5.5 + 4.0) = **28.5 kN**;
- force at the bottom after 3.0 mm of regrinds, if not re-shimmed: 3,000 × (9.5 + 3.0) = **37.5 kN**;
- greatest deflection of each spring: 9.5 + 3.0 = **12.5 mm**.

The springs chosen have a free length of 64 mm, and their maker rates them for long life at deflections up to 16 mm. The 12.5 mm worst case is within that, with some margin. Die springs are colour-coded by duty, and their makers publish rates, free lengths and deflection limits for different lives; a spring worked beyond its long-life deflection fails early, often by breaking into pieces inside its pocket. WORKOS's [compression spring calculator](/tools/compression-spring/) checks a spring's rate and stress from its dimensions.

Ten springs are spread symmetrically around the punches, so that the stripper stays square as it moves. An odd number, or an uneven layout, tilts the stripper, which then bends guided punches.

```figure
type: formula
title: Spring stripper force at the end of stripping and at the bottom
formula: F = n × k × (preload + travel)
caption: This is an illustration for MP-40's stripper: ten springs at 300 N/mm with 5.5 mm preload. The stripping force needed is 19.3 kN, 10% of the 192.8 kN cutting force.
- n × k | Combined spring rate, 10 × 300 = 3,000 N/mm
- preload | Compression with the die open, 5.5 mm
- travel | 1.0 mm at the end of stripping; 4.0 mm at the bottom
step: End of stripping: 3,000 × (5.5 + 1.0) = 19,500 N = 19.5 kN
step: Bottom of stroke: 3,000 × (5.5 + 4.0) = 28,500 N = 28.5 kN
step: Bottom after 3.0 mm of regrinds: 3,000 × 12.5 = 37,500 N = 37.5 kN
```

## What the springs cost the press

The stripper springs push down on the strip, and therefore on the die and the press, for the last 4.0 mm of every stroke. At the bottom, their 28.5 kN adds directly to the cutting force:

- cutting: 192.8 kN;
- springs at the bottom: 28.5 kN;
- **total: 221.3 kN**.

The springs' force acts at the same time as the cutting force, near the bottom of the stroke, so the press must be able to deliver the total there. As the die is reground without re-shimming, the spring force at the bottom rises to 37.5 kN, and the total to 230.3 kN. Re-shimming the springs or grinding the stripper face at each regrind keeps the bottom force at 28.5 kN, and is the better practice.

The springs also take energy. Compressing them from 5.5 to 9.5 mm stores ½ × 3,000 × (9.5² − 5.5²) = **90,000 N·mm**, or **90 J**, every stroke. Much of it is given back on the upstroke as the springs push the stripper down off the punches, but it must be supplied by the press's flywheel on the downstroke, at the same time as the cutting work. The companion book's chapter on flywheel energy adds it in.

Strong springs are not free in another way: they clamp the strip harder than the cut needs, and very strong springs can mark soft or coated sheet. The design aims for the force needed, with a margin, and no more.

```figure
type: stack
title: The MP-40 die's load at the bottom of the stroke
unit: kN
caption: This is an illustration with sharp tools and springs at their design compression. If the die is reground without re-shimming, the spring share rises to 37.5 kN.
- Cutting, all stations | 192.8
- Stripper springs | 28.5
```

## Springs in service

Die springs are worked hard: MP-40's ten springs each go through a 4.0 mm compression cycle on every stroke, 125,000 times between sharpenings and millions of times over the die's life. They fail in two ways.

- **Taking a set.** A spring worked near or beyond its rated deflection slowly loses free length. Each millimetre it loses is a millimetre of preload gone, and 300 N of stripping force with it. A spring that has shortened by 2 mm in a 3,000 N/mm set of ten costs the set 600 N; if all ten have done the same, the stripper's force at the end of stripping falls from 19.5 to 13.5 kN, below the 19.3 kN needed.
- **Breaking.** A spring that fatigues cracks and breaks, usually into two or more pieces that stay in the pocket. The stripper then presses harder on one side than the other, tilts, and pushes guided punches out of line.

Both are checked at every regrind. The springs are taken out and their free lengths measured against the new length; any spring that has lost more than the maker's allowance, or shows cracks or rubbing marks, is replaced, and the set is replaced together, because springs of different ages have different lengths and rates. A tilted stripper shows itself in service as an uneven burr or a strip that lifts on one side, and it is a reason to stop and look before a punch breaks.

The stripper's force at the end of stripping is worth recalculating whenever springs are changed, from the measured preload and the rate of the springs actually fitted. Substituting springs of a different duty because the right ones are out of stock is a common way for a die that stripped well for years to start lifting its strip.

## Other spring-loaded parts

Springs appear elsewhere in dies, and each adds load the same way.

- **Pressure pads** hold blanks flat in forming dies, and blank holders control wrinkling in drawing dies.
- **Knockouts and ejectors** push parts out of compound dies, where the blank is trapped in the upper die after cutting.
- **Spring-loaded pilots** retract if they meet a misfed strip instead of a hole, so that they do not punch through it.
- **Lifters** raise the strip off the die face between strokes in progressive dies with formed features, so that it can feed.

In place of mechanical springs, many dies use **nitrogen gas springs**, sealed cylinders of compressed nitrogen. They give a high force in a small space and a force that changes less with compression than a coil spring's. Their makers publish ratings and the conditions for safe use and disposal, which matter because they are pressurised.

## The error: preload too light

This is an illustration. The die's first trial used the same ten springs but with only **2.0 mm** of preload, because the spring pockets had been machined deeper than drawn. At the end of stripping, the stripper was pressing with only 3,000 × (2.0 + 1.0) = **9.0 kN**, less than half the 19.3 kN the estimate called for.

The trial showed it at once. On the upstroke the strip clung to the piercing punches, lifted off the pilots' line and dropped back a few tenths of a millimetre out of position, and on the third stroke the pilots met the strip off-centre and buckled it. The setter stopped the press, and the toolmaker measured the spring pockets and found them 3.5 mm deep against the drawing.

The fix was to fit 3.5 mm spacers under the springs, restoring the 5.5 mm preload and the 19.5 kN stripping force. The trial then ran clean. The toolmaker's final inspection sheet now includes the stripper's force at the end of stripping, calculated from the measured preload, and a check that the strip stays down on the die during slow strokes on inching before the press is run continuously.

```figure
type: checklist
title: Spring stripper checks before a die's first strip
caption: The force at the end of stripping, not at the bottom of the stroke, is the one that decides whether the die strips.
- Stripping force estimated from the cutting force | 19.3 kN, 10% of 192.8 kN
- Force at the end of stripping at least the stripping force | 19.5 kN at 6.5 mm compression
- Greatest deflection within the spring maker's long-life limit | 12.5 mm against 16 mm
- Spring load at the bottom added to the press load | 221.3 kN in all
- Springs symmetrical, replaced as a set | ten springs around the punches
- x Preload not measured after assembly | 2.0 mm gave 9.0 kN; the strip lifted
```

## Exercise: springs for the stainless version

For the 1.6 mm stainless version of MP-40 (Chapter 2), the cutting force is 275.4 kN and the stripping force is again taken as 10%. The stripper stands 1.0 mm below the punches, the punches enter the die 1.0 mm, and the same 3.0 mm regrind allowance applies. With the same ten springs of 300 N/mm, what preload is needed, what is the force at the bottom, and is the deflection still within 16 mm?

**Worked answer.** The stripping force is 0.10 × 275.4 = **27.5 kN**. The working travel is 1.0 + 1.6 + 1.0 = 3.6 mm.

- At the end of stripping the springs must give 27.5 kN: preload + 1.0 ≥ 27,540 ÷ 3,000 = 9.18 mm, so the preload is **8.2 mm**, giving 27.6 kN.
- At the bottom: 3,000 × (8.2 + 3.6) = **35.4 kN**, making the die's total 275.4 + 35.4 = **310.8 kN**.
- Greatest deflection: 8.2 + 3.6 + 3.0 = **14.8 mm**, within 16 mm but with little margin.

A toolmaker would probably choose stiffer springs or twelve of them instead, to bring the preload and deflection down and leave room for the stainless steel's higher and more variable stripping force.
