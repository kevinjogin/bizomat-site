---
book: weld-repairs-that-hold
chapterSlug: preheat-hydrogen-and-cooling
order: 5
title: "Preheat, hydrogen and cooling"
description: "Distinguish preheat used to share shrinkage from preheat used to prevent hydrogen cracking, and estimate weldability with a carbon equivalent."
draft: false
---

The word preheat appears throughout the 1919 Airco booklet, but it does not mean what a modern welding procedure means by it. In the booklet, preheating is local and purposeful in a mechanical sense: heat the plate between two holes so it expands with the weld, then let both cool together. In a modern procedure, preheat is usually a specified minimum temperature for the whole joint region, chosen mainly to prevent hydrogen cracking in the heat-affected zone.

Both uses are legitimate. Confusing them is not. This chapter separates the two purposes and introduces the carbon equivalent, the simple number most often used to judge how much care a steel needs.

## Two different reasons to heat the plate

**Heating to share shrinkage.** As Chapter 2 explained, a weld shrinks and the cold plate resists. Heating a region beside the weld makes it expand too, so it contracts with the weld instead of opposing it. The booklet used this when closing cracks and setting patches: heat the area marked on the drawing, keep it hot while welding, let it cool with the weld. The temperatures were judged by colour, such as red heat, and were not controlled or recorded.

**Heating to slow cooling.** In arc welding, hydrogen from moisture, contamination or consumables can enter the weld pool and diffuse into the heat-affected zone. If that zone cools quickly and forms a hard microstructure while it is restrained, cracks can form, sometimes hours after welding. TWI's guidance on hydrogen cracking explains that preheat slows the cooling rate, allows some hydrogen to diffuse away and generally reduces hardness, and with it the susceptibility to cracking.

The second purpose is governed by procedure: a minimum preheat temperature over a defined width either side of the joint, a maximum interpass temperature, controlled consumables and, for susceptible steels, holding heat for a period after welding.

```figure
type: compare
title: Two reasons to preheat
cols: Sharing shrinkage, as in 1919 | Preventing hydrogen cracking, today
caption: The same word describes two different jobs; a repair may need both, controlled differently.
- Where | A chosen region beside the weld | A defined band either side of the joint
- How hot | Judged by colour, such as red heat | A specified minimum, measured
- Main purpose | Let nearby plate expand and shrink with the weld | Slow cooling, let hydrogen escape, limit hardness
- *Recorded | Rarely | In the procedure and the weld record
```

## Carbon equivalent: a first measure of weldability

Steel's tendency to form hard, crack-susceptible structures when welded rises with carbon and with alloying elements that increase hardenability. The carbon equivalent combines them into one number. TWI's summary of the formulae gives the widely used IIW expression, with all values in weight per cent:

**CE = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15**

TWI notes that steels with a CE below about 0.4 are generally not susceptible to heat-affected-zone hydrogen cracking when low-hydrogen consumables or processes are used. As CE rises, procedures typically call for more care, including higher preheat. The guidance mentions preheats as high as 200 °C for thick sections of high-CE steel, and refers to standards such as EN 1011-2 for recommended levels. Other formulae, such as Pcm, are often preferred for low-carbon modern steels, so the applicable code decides which to use.

## The tank case: what is the plate?

This is an illustration. The tank plate has no surviving mill certificate. The workshop sends a sample from an offcut, removed during an earlier alteration, for chemical analysis. The illustrative result is: carbon 0.18%, manganese 1.20%, chromium 0.05%, molybdenum 0.02%, vanadium 0.00%, nickel 0.05% and copper 0.10%.

**CE = 0.18 + 1.20/6 + (0.05 + 0.02 + 0.00)/5 + (0.05 + 0.10)/15**

**CE = 0.18 + 0.200 + 0.014 + 0.010 = 0.404**

The plate sits right at the boundary TWI describes. The workshop's procedure therefore specifies low-hydrogen consumables stored and handled to the manufacturer's instructions, a modest measured preheat over a band either side of the groove, a maximum interpass temperature, and dye penetrant inspection repeated after a delay rather than only immediately after welding, because hydrogen cracks can appear late.

```figure
type: stack
title: Carbon equivalent of the tank plate
caption: Carbon and manganese contribute almost all of the 0.404; small residual elements still count.
- Carbon | 0.18
- *Manganese ÷ 6 | 0.2
- Chromium, molybdenum, vanadium ÷ 5 | 0.014
- Nickel and copper ÷ 15 | 0.01
```

## Old plate deserves extra suspicion

Repair work often meets steel whose composition is unknown. Old plate may contain more carbon, sulphur or phosphorus than modern steel, may be laminated, and may have been heated, cold-worked or repaired before. Before welding a part whose integrity matters:

- find the original specification or a mill certificate if one exists;
- if not, test a sample for composition, and consider mechanical testing where strength or toughness matters;
- examine the plate near the repair for laminations or earlier repairs;
- be cautious with materials the welding procedure was not qualified on.

In the United States, the steam locomotive regulation discussed in Chapter 8 distinguishes carbon steel above and below 0.25% carbon for welding on unstayed boiler portions, requiring prior approval above that level. Whatever the jurisdiction, composition is not a detail to guess.

## Cooling after welding

Cooling deserves as much thought as heating. A repair cooled quickly in a cold workshop, or quenched to save time, can harden and crack. Procedures may call for slow cooling under insulation, holding at temperature for a period to let hydrogen escape, or a formal post-weld heat treatment for stress relief where a standard or design requires it. The booklet's practice of reheating areas after welding to relieve shrinkage was an early, unmeasured step in this direction. Modern heat treatment is controlled, recorded and justified by the applicable standard, because uncontrolled heating can damage as easily as it can help.

## Exercise: compare two steels

Calculate the IIW carbon equivalent for a plate with 0.12% carbon, 0.90% manganese, 0.03% chromium, 0.01% molybdenum, no vanadium, 0.03% nickel and 0.06% copper. Compare it with the tank plate.

**CE = 0.12 + 0.90/6 + (0.03 + 0.01 + 0)/5 + (0.03 + 0.06)/15 = 0.12 + 0.150 + 0.008 + 0.006 = 0.284**

This steel is well below 0.4 and would normally be easier to weld than the tank plate at 0.404. Explain why a low CE does not remove the need for low-hydrogen practice and a qualified procedure, and why thickness and restraint still affect the preheat a procedure specifies.
