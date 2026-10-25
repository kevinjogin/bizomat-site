---
book: hardfacing-and-surfacing-by-the-numbers
chapterSlug: dilution
order: 3
title: "Dilution and the first layer"
description: "Calculate how much base metal melts into a hardfacing deposit, how dilution weakens the first layers' composition and hardness, how it falls layer by layer, and how process and technique control it."
draft: false
---

A weld deposit fuses into the metal beneath it, and to do so, it melts some of that metal and mixes it in. In ordinary joining, this mixing is harmless or even helpful. In hardfacing, it is a problem, because the base metal is usually plain steel with none of the chromium, carbon or other elements that make the hardfacing alloy wear-resistant. Every bit of base metal melted into the deposit dilutes it, and the first layer of a hardfacing deposit can end up with much less of its alloying elements, and much less wear resistance, than the filler that went into it.

This chapter defines dilution, calculates its effect on the composition of the first and later layers, explains why the filler maker's stated hardness is often for the second or third layer, and shows how process, parameters and technique control dilution.

## What dilution is

Dilution is the fraction of the weld bead's cross-section that came from melted base metal. If a bead's cross-section has an area above the original surface, the deposited filler, and an area below it, the melted base, the dilution is:

D = area of melted base ÷ (area of melted base + area of deposited filler)

A dilution of 30% means that about three-tenths of the bead is melted base metal and seven-tenths is filler. Dilution is measured on a cross-section of a trial bead, cut, polished and etched to show the fusion line, by measuring the two areas.

## Dilution and composition

Because the bead is a mixture, its composition is the weighted average of the filler's and the base's. For any element:

C_deposit = (1 − D) × C_filler + D × C_base

```figure
type: formula
title: Chromium and carbon in the first layer of a chromium carbide deposit
formula: C_deposit = (1 − D) × C_filler + D × C_base
caption: This is an illustration with a filler containing about 25% chromium and 4% carbon laid on a plain steel with about 0.2% carbon and no chromium, at 30% dilution. The compositions are illustrative, not data for any product.
- Filler | about 25% Cr, 4% C
- Base steel | 0% Cr, about 0.2% C
- D | 30%
step: chromium: 0.7 × 25 + 0.3 × 0 = 17.5%
step: carbon: 0.7 × 4 + 0.3 × 0.2 ≈ 2.86%
step: the first layer has about 70% of the filler's chromium and carbon
```

With less chromium and carbon, the first layer forms fewer and smaller hard carbides, and its wear resistance can be much lower than the filler's data sheet suggests. In some alloys, the change in composition also changes the structure entirely, so that a deposit meant to be full of hard primary carbides is, in its first layer, a much softer mixture.

## Layer by layer

The second layer is laid on the first, not on the base, so its dilution mixes it with the already alloyed first layer, and its composition comes much closer to the filler's. Each further layer comes closer still.

```figure
type: bars
title: Chromium in successive layers at 30% and 10% dilution
unit: % chromium, from a filler of about 25%
max: 26
caption: This is an illustration from C_n = 0.7 × 25 + 0.3 × C_(n−1) and C_n = 0.9 × 25 + 0.1 × C_(n−1), starting from a base with no chromium. Lower dilution brings the first layer close to the filler's composition.
- Layer 1, 30% dilution | 17.5
- Layer 2, 30% dilution | 22.8
- Layer 3, 30% dilution | 24.3
- *Layer 1, 10% dilution | 22.5
- Layer 2, 10% dilution | 24.8
```

At 30% dilution, the deposit needs two or three layers to reach most of the filler's composition. At 10%, a single layer comes within about a tenth of it. This is why filler makers often state their deposit's hardness for a particular number of layers, commonly two or three, and why a single layer laid with high dilution may disappoint. It is also why, with alloys that may only be laid in two or three layers before they crack (Chapter 2), reducing dilution in the first layer matters so much: it gives more of the permitted thickness at full wear resistance.

## What sets dilution

Dilution is set by how deeply the arc or flame melts into the base relative to how much filler it deposits. More penetration means more dilution. The main influences are:

- **the process**: processes that melt the base deeply relative to their deposition, such as submerged arc at high current, give high dilution; those that deposit filler with little melting of the base, such as oxy-fuel surfacing, plasma transferred arc and laser cladding, give low dilution;
- **current**: higher current penetrates deeper and raises dilution;
- **travel speed**: faster travel with the same current can reduce penetration per unit of deposit in some processes, but too fast a speed thins the bead and raises the proportion of base;
- **bead overlap**: beads laid with a large overlap on the previous bead melt more of the previous bead and less of the base, lowering dilution of the base;
- **weaving and electrode angle**: weaving spreads the heat and reduces penetration; pointing the arc onto the previous bead or the pool rather than the base reduces it too;
- **polarity**: in some processes, the polarity changes how much heat goes into the base.

```figure
type: compare
title: Typical dilution of surfacing processes
cols: Dilution, roughly | Notes
caption: This is an illustration. Illustrative ranges for teaching; actual dilution depends strongly on parameters and technique and should be measured on trial beads.
- Oxy-fuel surfacing | low | slow; base surface only sweated, not deeply melted
- Plasma transferred arc and laser | low | precise, controlled heat; mechanised
- Gas-shielded and flux-cored arc | moderate | adjustable with parameters and overlap
- Manual metal arc | moderate to high | depends on current and technique
- *Submerged arc | can be high | deep penetration at high current; strip cladding variants lower
```

## Dilution in the hardness numbers

Filler makers' data sheets usually give a deposit's hardness, and that number is only meaningful with its conditions: the number of layers, the base metal, the process and sometimes the parameters. A data sheet that quotes a hardness "in the third layer on mild steel" describes a deposit with little dilution; the same filler laid as a single layer on a plain steel may be considerably softer. When comparing fillers, or checking a deposit with a portable hardness tester, the workshop compares like with like: the same number of layers on the same kind of base, with the hardness measured at the surface of the top layer, ground flat enough for the tester.

## Oxy-fuel surfacing

The lowest-dilution surfacing method of the early manuals, and still a useful one, is surfacing with the oxy-fuel flame. The base is heated until its surface just begins to sweat, a thin film of melting at the very surface, and the filler rod is melted onto it, so that the deposit wets the surface without melting deeply into it. Dunham described building up worn parts with the flame, keeping the heavy part hot so that the added metal would bond, and the same care for fusion without deep melting is the key to low-dilution flame surfacing. It is slow and needs skill, but it gives very low dilution with expensive alloys, such as tungsten carbide rods, where every bit of alloy counts.

## Dilution and the heat-affected base

The heat that melts the base also affects the base beneath the fusion line, as in any weld. On hardened parts, such as boron steel tillage points, the heat-affected zone may soften, losing some of the hardness that the part's maker gave it; on hardenable steels cooled quickly, it may harden and crack. Lower-dilution procedures generally put less heat into the base as well, which reduces these effects. For parts whose base properties matter, such as hardened points that rely on their core for strength, the workshop keeps the heat low and the hardfacing narrow, protecting the edge without softening the whole part.

## Stringer beads or weaving

Hardfacing can be laid as narrow stringer beads, made with little sideways movement, or as wider weave beads. Weaving spreads the heat and, for the same deposit, generally reduces penetration and dilution, and it covers an area with fewer starts and stops. Stringer beads give more control of the bead shape and penetration on small parts and edges. The filler maker's guidance often states which suits the alloy; some carbide alloys are best laid in stringers to keep the carbides fine, others in weaves to reduce dilution.

## Dilution in build-up layers

Dilution matters less in build-up layers, whose composition is similar to the base anyway, than in hardfacing layers. But it matters in buffer layers and in the transition from build-up to hardfacing: the first hardfacing layer laid on a build-up is diluted by the build-up, not the base, and if the build-up is a tough low-alloy steel, the effect is much the same as laying it on the base. Some procedures lay the first hardfacing layer with deliberately low-dilution parameters, or use a filler richer in alloying elements for the first layer, to bring it up to strength.

## Dilution and cracking

Dilution also changes how the deposit behaves on the base. A deposit diluted with a high-carbon base, such as a cast iron or a high-carbon steel, picks up carbon, which can make it harder and more crack-prone than intended. A stainless or manganese buffer layer diluted with a hardenable carbon steel can form a hard, brittle zone at the fusion line. Chapter 8 discusses the cracking that results and how buffer layers and preheat prevent it.

## Measuring dilution on trial beads

The workshop measures dilution on trial beads whenever it sets up a new procedure: a few beads are laid on a scrap of the part's material with the planned parameters, sectioned, etched, and the areas above and below the original surface measured on a photograph of the section. The dilution, and a hardness traverse across the layers, show whether the procedure gives the intended deposit. Testing Welded Joints by the Numbers describes macro sections and hardness traverses in its chapters on [macro sections and visual inspection](/reados/publications/testing-welded-joints-by-the-numbers/macro-sections-and-visual-inspection/) and [hardness and the heat-affected zone](/reados/publications/testing-welded-joints-by-the-numbers/hardness-and-the-heat-affected-zone/).

## Dilution as a procedure variable

Because dilution changes the deposit, the workshop treats the parameters that control it as part of the hardfacing procedure, written down and followed: the current range, the travel speed, the bead overlap, the electrode or gun angle and the number of layers. A welder who turns up the current to speed up a job is not just welding faster; they are making a different, more diluted deposit, and the procedure says so. Writing the parameters down also makes it possible to compare results from different welders and jobs, and to find the cause when one batch of parts wears faster than the last.

## The running case: tillage points

This is an illustration. The workshop's first attempt at hardfacing tillage points used a manual metal arc chromium carbide electrode in a single layer, run at a high current to get good fusion on the hardened boron steel points. The points wore only a little better than plain ones. A trial bead section showed about 35% dilution, and a hardness traverse showed the single layer well below the electrode's stated hardness.

The workshop changed to two layers, the first run at lower current with a large overlap and the arc directed onto the previous bead, which brought the first layer's dilution down to about 20%; the second layer then came close to the electrode's stated hardness. The points lasted the farms' full season, about twice as long as before. The second layer added about four minutes per point and a little filler; the saving in replacement points and in the farmers' downtime during sowing was far larger, and the farms asked for the same treatment on their seeding boots the next year.

## Dilution and cost

Dilution has a cost as well as a performance effect. Every millimetre of the first layer that is diluted is filler that does not do its full job, and to reach the wear resistance needed, either more layers are laid, using more filler and time, or a lower-dilution process is used, which may be slower or need more expensive equipment. For high-value parts and expensive alloys, such as tungsten carbide or cobalt-based deposits, low-dilution processes usually pay for themselves in alloy saved and performance gained; for low-cost parts with inexpensive alloys, a second layer by an ordinary process is often the cheaper route.

## A failure: the single thick layer

This is an illustration. A welder trying to save time on a chute liner laid a single, very thick hardfacing layer at high current, aiming to get the full thickness in one pass. The deposit cracked across its width in a regular pattern, which is normal for that alloy (Chapter 6), but it also wore through to the base within weeks in places, much faster than expected.

The high current had melted deeply into the liner plate, diluting the deposit heavily, and the deposit's lower part was little better than the plate. Relaid in two thinner layers at lower current, with the arc kept on the pool, the liner's deposit lasted several times longer for about the same amount of filler.

## Exercise: one layer or two

A hardfacing filler contains about 6% of an alloying element that controls its hardness. Laid on plain steel containing none of it, at 25% dilution, what is its content in the first and second layers? If laid at 12% dilution, what is the first layer's content?

At 25% dilution, the first layer contains about 0.75 × 6 + 0.25 × 0 = **4.5%**, and the second about 0.75 × 6 + 0.25 × 4.5 ≈ **5.6%**. At 12% dilution, the first layer contains about 0.88 × 6 ≈ **5.3%**, almost as much as the second layer at 25% dilution.

If the alloy may be laid in only two layers, the lower-dilution procedure gives one more layer's worth of near-full composition, which may be worth a slower process or more careful technique.
