---
book: weldability-by-the-numbers
chapterSlug: joining-different-metals
order: 9
title: "Joining different metals"
description: "Predict the composition of a dissimilar-metal weld from dilution, allow for different expansion and galvanic action, and choose a filler for a stainless spool welded to a mild steel bracket."
draft: false
---

Joining two different metals combines the difficulties of both and adds three of its own. The weld metal is a mixture of the filler and both parents, so its composition, and therefore its structure, depends on how much of each melted in. The two parents expand by different amounts, so every heating and cooling, in welding or in service, strains the joint. And two different metals in contact with moisture form a galvanic cell, so one of them may corrode faster at the joint than it would alone.

Kautny gave only a short passage to welding different metals, but its rule is sound: understand the peculiarities of each metal and arrange the welding to suit the more difficult one. This chapter turns that rule into calculations, applies it to the pump set's stainless steel drain spool welded to a mild steel bracket, and shows why the filler that suits stainless to stainless can fail when one side is carbon steel.

## Kautny's two examples

Kautny described two dissimilar joints common in his day. Motor valves were made with a spindle of wrought iron and a disc of cast steel, because the two parts carried different stresses, and the two were united with the flame in the regular manner, taking account of each metal's nature. For iron joined to copper or copper alloys, he set out a specific rule: avoid burning the copper, and because copper conducts heat much faster than iron, melt the iron first and then let the copper flow into it, using a copper filler.

His copper rule shows the principle well. The metal that is harder to bring to temperature, the iron in this case, because the copper drains heat from everything near it, is heated first, and the metal that is more easily damaged by overheating, the copper, is added last and briefly. The weld is arranged around the difference in properties rather than treating the joint as though both sides were alike.

## Dilution and the mixing rule

When a weld joins metal A to metal B with filler F, the weld metal is roughly a mixture: the filler's share, plus the share of A that melted, plus the share of B that melted. The parent shares together are the **dilution**. For a first estimate, the content of any element in the weld is the sum of each contributor's share times its content.

```figure
type: formula
title: Estimating weld metal composition from dilution
formula: weld % = (1 − D) × filler % + D_A × A % + D_B × B %
caption: This is an illustration. With 30% total dilution split equally between 316 stainless and mild steel, a 309-type filler gives weld metal of about 19.0% chromium and 10.75% nickel.
- D | total dilution, D_A + D_B
- filler %, A %, B % | element content of each contributor
step: Cr = 0.70 × 23.5 + 0.15 × 17 + 0.15 × 0
step: Cr = 16.45 + 2.55 + 0
step: Cr ≈ 19.0%
```

The compositions used in this chapter are rounded illustrations, not certified data: a 309-type filler at about 23.5% chromium and 13% nickel, a 308-type filler at about 20% chromium and 10% nickel, 316 stainless steel at about 17% chromium and 11% nickel, and mild steel with neither. Real values come from the filler maker's data and the material certificates.

The dilution itself depends on the process, the joint and the technique. Arc processes typically melt a substantial fraction of the parent metal into each run, the root and first runs most of all, and high current, slow travel and weaving increase it.

## Why the filler matters on the carbon steel side

Stainless steels stay tough and corrosion resistant because their chromium and nickel keep them austenitic, with a small amount of ferrite in many weld metals. Dilute that composition with carbon steel and it moves towards a region where **martensite**, hard and brittle, can form. Metallurgists predict the result with constitution diagrams, of which the Schaeffler diagram is the best known, plotting a weld's structure against equivalents for chromium and nickel. The practical aim is weld metal that stays austenitic with a little ferrite, avoiding the martensitic region on one side and fully austenitic, crack-prone compositions on the other.

A filler richer in alloy than the stainless parent, such as a 309-type, has room to absorb dilution from the carbon steel and still stay in the safe region. A filler that merely matches the stainless parent, such as a 308-type, does not.

```figure
type: compare
title: Weld metal from two fillers, 316 stainless to mild steel
cols: 30% dilution | 50% dilution
caption: This is an illustration with rounded compositions, dilution split equally between the parents. The 309-type filler keeps more chromium and nickel in the weld at every dilution.
- *309-type filler, chromium | 19.0% | 16.0%
- 309-type filler, nickel | 10.75% | 9.25%
- 308-type filler, chromium | 16.55% | 14.25%
- 308-type filler, nickel | 8.65% | 7.75%
```

TWI's guidance on joining stainless to carbon steel adds two practical points. Dilution should be kept to a minimum, because higher dilution tends to lower weld metal strength and promote martensite, with higher hardness and hydrogen cracking sensitivity. And a narrow, hard martensitic layer tends to form at the interface with the carbon steel whatever the filler and dilution, which is one reason such joints are kept away from the highest stresses where possible.

## Expansion that never agrees

Chapter 3 calculated that a 500 mm length of 316 stainless steel heated by 300 °C moves about 0.6 mm farther than the same length of carbon steel, because its expansion coefficient is about 16.0 × 10⁻⁶ per °C against about 12. In welding, that difference adds to the residual stress at the joint. In service, if the joint heats and cools repeatedly, the weld carries the difference every cycle, and the hard interface layer is where fatigue cracks start. Nickel-based fillers, with an expansion coefficient between the two, are often chosen for dissimilar joints that will see significant temperature cycling, because they share the mismatch more evenly. For the pump set's drain spool at ambient temperature, the mismatch matters mainly during welding. Even then it is worth arranging the welding so the joint is free to move as it cools, tacking lightly and welding the most restrained side first, because the stress left behind adds to whatever the pump's vibration later imposes.

## Galvanic action

Two metals in electrical contact, wet with an electrolyte, form a cell in which the more active metal corrodes faster. Stainless steel is more noble than carbon steel, so at a wet stainless-to-steel joint the carbon steel corrodes preferentially, concentrated near the joint. The effect is strongest when the noble metal's area is large and the active metal's small. The Library discusses the same mechanism for zinc coatings in the electroplating chapter on [how zinc protects](/reados/publications/electroplating-by-the-numbers/how-zinc-protects-and-for-how-long/).

Kautny met a version of this in aluminium: a soldered joint that leaves an oxide film between the parts forms a galvanic chain that eventually destroys the joint. The general rule is to expect galvanic action wherever different metals meet in moisture and to design for it: coat the active metal, keep the joint dry and drained, or avoid the couple by choosing compatible metals or isolating them.

## Metals that should not be fusion welded together

Some pairs cannot be fusion welded directly with any filler, because their mixture forms brittle intermetallic compounds. Aluminium to steel and aluminium to copper are the commonest examples in industry. They are joined instead by mechanical fastening with isolation, by brazing in some cases, by transition inserts made from the two metals bonded in the solid state, or by solid-state processes such as friction welding, which Chapter 10 describes. Kautny's welders met the same limit in their own terms; the modern solutions are largely the solid-state joining he foresaw.

## Buttering: welding to the difficult side first

A technique that runs through this book becomes especially useful in dissimilar joints. **Buttering** lays one or more layers of a compatible weld metal on the more difficult parent before the joint itself is made. Chapter 5 buttered cast iron with nickel so that the fill would meet a ductile surface rather than the casting. In a joint between carbon steel and stainless steel, the carbon steel face can be buttered with a high-alloy filler, so that the final joint is effectively stainless to stainless; the buttered carbon steel part can, if needed, be heat treated before the final weld, which would be harmful to the stainless side if done afterwards.

Buttering also separates two problems in time. The dilution with the difficult parent happens in the buttering layer, under careful control, with small runs and low heat input. The joint weld then sees only the buttering metal and the other parent. The cost is an extra layer of welding and inspection, and the procedure must say how thick the buttering must be and how it is checked.

## Choosing how to join two metals

The options narrow quickly once the pair of metals is known.

```figure
type: decision
title: Joining two different metals
question: What happens when the two metals mix?
caption: A screening guide. The final choice needs the actual compositions, the service conditions and a qualified procedure.
- Mixture stays ductile with a suitable filler | e.g. stainless to carbon steel | fusion weld with an overalloyed filler; control dilution
- *Mixture brittle unless filler absorbs it | e.g. cast iron to steel | butter with nickel; weld to the buttering
- Brittle intermetallics form | e.g. aluminium to steel or copper | solid-state joint, transition insert or mechanical joint
- Melting points far apart | e.g. copper to steel | melt the higher-melting side first, or braze
```

## Brazing between different metals

Brazing deserves consideration whenever two dissimilar metals must be joined and the joint's strength and service temperature allow it. Because neither parent melts, there is no dilution in the welding sense, no brittle mixture of the parents and much less heat-affected metal. Copper to steel, copper to stainless steel and many other pairs are routinely brazed. The filler's corrosion behaviour against both metals, the joint clearance and the flux or atmosphere all need attention, and galvanic action between the filler and each parent remains a consideration. Kautny's hard soldering of copper and its alloys was an early form of the same choice.

## Fume from stainless steel

Welding stainless steel and other chromium-bearing alloys releases hexavalent chromium in the fume, as SafeWork NSW's chromium technical fact sheet notes, along with nickel. Hexavalent chromium is a serious health hazard. Dissimilar joints involving stainless steel need the same fume controls as stainless-to-stainless welding: local exhaust ventilation, suitable respiratory protection where needed, and the other controls in Safe Work Australia's model code of practice on welding processes.

## The drain spool joint

This is an illustration. The 316 stainless drain spool is to be welded to a 6 mm mild steel bracket on the pump baseplate with fillet welds. The workshop's plan:

1. **Filler.** A 309-type low-carbon filler, chosen so that the weld metal stays in the safe region despite dilution from the mild steel.
2. **Dilution control.** Low heat input, stringer runs rather than weaving, small electrode or wire size, and the arc kept on the weld pool and the stainless side rather than playing on the mild steel, to limit the carbon steel melted into the weld.
3. **Cleanliness.** Separate brushes and abrasives for the stainless steel, so carbon steel particles are not embedded in its surface where they would rust.
4. **Galvanic protection.** The mild steel bracket and the weld zone are painted after welding, overlapping onto the stainless steel, and the joint is arranged to drain.
5. **Fume.** Local exhaust extraction at the weld and respiratory protection as the risk assessment requires.

## A failure: the matching filler

This is an illustration. The pump set's previous drain spool had been fitted by another contractor, who had welded it to the bracket with a 308-type filler, the filler normally used for 304 stainless to itself. Within a year, a crack had grown along the toe of one fillet on the mild steel side, and rust stained the bracket around it.

The workshop's assessment followed the calculation above. At the high dilution typical of a fillet weld made in one heavy run, a 308-type filler leaves weld metal too lean in chromium and nickel to stay austenitic next to carbon steel, and martensite forms. The hard zone, the expansion mismatch and vibration from the pump together grew the crack, and the galvanic couple corroded the bracket where the crack opened. The correction was the plan above: a 309-type filler, controlled dilution and protection of the carbon steel. A filler that is right for stainless to stainless is not automatically right for stainless to anything else.

The old spool also showed how dissimilar-joint failures combine causes. No single factor would have been enough: a 308-type weld with low dilution might have survived, a hard zone in a joint without vibration might have held, and a crack in a dry joint would not have rusted. Assessments of dissimilar joints therefore look at composition, stress and environment together, and the repair addresses all three.

## Exercise: forty per cent dilution

A heavier fillet made at higher current has about 40% dilution, split equally between the 316 spool and the mild steel bracket. Using the rounded compositions in this chapter, estimate the chromium and nickel in the weld metal for the 309-type and 308-type fillers, and compare them with the 30% results.

With the 309-type filler: chromium ≈ 0.60 × 23.5 + 0.20 × 17 ≈ **17.5%**, nickel ≈ 0.60 × 13 + 0.20 × 11 ≈ **10.0%**. With the 308-type filler: chromium ≈ 0.60 × 20 + 0.20 × 17 ≈ **15.4%**, nickel ≈ 0.60 × 10 + 0.20 × 11 ≈ **8.2%**. Both fillers lose alloy as dilution rises from 30% to 40%, but the 309-type keeps about two percentage points more chromium and nickel, which is the margin that keeps it out of the martensitic region. The better answer is still to reduce the dilution, by technique, rather than relying on the filler alone.
