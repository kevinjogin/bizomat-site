---
book: weld-repairs-that-hold
chapterSlug: cracks-between-holes-and-in-knuckles
order: 7
title: "Cracks between holes and in knuckles"
description: "Treat cracks across ligaments and flange radii as evidence of cyclic strain, and recognise when closing holes changes how a plate is supported."
draft: true
---

Some cracks are easy to explain once mapped: a fatigue crack at the toe of a poorly supported attachment, for instance. Two kinds are harder, and the 1919 Airco booklet spends pages on both. The first runs between holes, across the narrow ligaments of plate that separate them. The second runs along a knuckle, the curved flange where a flat plate turns to meet another. Both are signs that a region of plate is being strained, cycle after cycle, more than it can tolerate.

This chapter looks at what those cracks mean, how the booklet closed them, and why a modern repair has to ask a structural question the booklet barely raised.

## Ligaments concentrate strain

Chapter 6 introduced ligament efficiency. A row of holes is a row of narrow necks in the plate, and every neck has a stress concentration at its edges. When the plate is strained repeatedly, by pressure, by temperature or by flexing, the necks see the highest local strain. A crack that starts at one hole's edge has only a short way to travel to reach the next hole. Once a ligament has cracked, its neighbours take more of the load and crack sooner.

That is why the booklet was cautious. It warned that cracks between staybolt holes are not easily welded, because proper allowance for expansion is hard to make, and that a side sheet with many such cracks would be better replaced. A run of cracked ligaments is a region failing, not a collection of separate small defects.

## The booklet's method for closing holes

Where welding was used, the booklet described a careful sequence for a crack running through holes that were to be closed:

1. Bevel the sides of each hole and the crack between them.
2. Prepare a soft steel disc for each hole, a little smaller than the hole and bevelled at its edge, with a length of rod melted onto it as a handle.
3. Heat the plate between the first two holes and keep it red hot while tacking and welding the first disc into its hole.
4. Let that heated section cool together with the weld, so the shrinkage is shared.
5. Weld the next disc in the same way, then weld the crack between the holes, and reinforce the finished weld.

For a plate with several cracked rows, it set out an order: preheat, weld one row, reheat to relieve the shrinkage, let the whole job cool, then move to the next row, leaving the longest continuous crack until last.

```figure
type: steps
title: Closing a cracked row of holes, as described in 1919
caption: A record of historical practice. Plugging stay or bolt holes is a structural change that modern repairs must assess first.
- Bevel each hole and the crack
- Prepare bevelled discs on rod handles
- Heat the plate between holes
- *Weld one disc, then cool together
- Weld the next disc, then the crack
- Reinforce, reheat, cool before the next row
```

## The question the method skips: what were the holes for?

In a firebox side sheet, the holes being closed were staybolt holes. Staybolts tie the inner firebox sheet to the outer wrapper so that the flat plates, which could not resist boiler pressure on their own, are supported at close intervals. Close a staybolt hole with a disc and you remove a support. The plate around it now spans further between the remaining stays.

For a flat plate supported at regular points and loaded by pressure, bending stress rises roughly with the square of the span between supports relative to its thickness. That proportionality is enough to see the consequence. If the stays sit at a 100 mm pitch and one is removed, the local span between remaining supports becomes about 200 mm. Twice the span means roughly four times the bending stress in that region, before any weld effects are counted.

```figure
type: bars
title: Relative plate bending stress as the support span grows
caption: Bending stress in a flat plate under pressure rises roughly with the square of the span; removing one support in a 100 mm grid doubles the local span.
max: 4.5
- 100 mm span, all supports present | 1
- 141 mm, the diagonal of the grid | 2
- *200 mm, one support removed | 4
```

The numbers are proportions, not a design calculation, and real stayed plates are analysed with methods from the applicable boiler standard. The point is qualitative and decisive: closing holes that carried load changes the structure. A modern repair that removes stays, bolts or rivets must be assessed by a competent engineer against the governing standard before it is done, not justified afterwards by how good the weld looks.

## Knuckles flex

A knuckle is the curved flange where a flat plate, such as a firebox door sheet or tube sheet, turns to meet another plate. In service, flat plates under changing pressure and temperature flex slightly, and the knuckle is where that movement concentrates. Fatigue cracks along the radius are the result.

The booklet treated knuckle cracks with its usual tools: preheat one end, tack, back-weld towards the start, reheat the far end, and weld from the water side where possible. It asked for knuckle welds to be reinforced about 1/8 inch and widened to about 2 inches at the top, adding stiffness where the plate had been moving.

A modern repair asks why the knuckle cracked. A knuckle radius smaller than the design called for, thinning at the bend, corrosion, scale build-up on the water side that let the plate overheat, or restraint from nearby stays can all contribute. If the cause remains, a weld across the radius may simply move the crack to the edge of the repair. Sometimes the right answer is a new flanged section with the correct radius, welded in away from the bend.

## Stop drilling is not a repair

A common workshop response to a crack is to drill a small hole at its tip, removing the sharp crack front so it stops growing. A crack-arrest hole can buy time and may be a sensible temporary measure while a proper repair is planned. It does not remove the cause, the crack may continue from the hole's edge, and in pressure equipment any such measure falls under the same rules as other repairs. Record it as temporary, inspect it, and plan the permanent repair.

## The tank case: cracks along a riveted seam

This is an illustration. The second crack in the tank, introduced in Chapter 1's exercise, ran from a rivet hole along the rivet row, in a region thinned to 6.8 to 7.4 mm. Penetrant inspection now finds two more short cracks at neighbouring rivet holes in the same row.

The workshop treats this as a failing region, not as three small cracks. The seam is a row of holes in thinned plate carrying the tank's water load; welding up the cracks and closing holes would change how the seam is held together and would still leave thin plate. The decision is to remove the riveted joint region and fit a new welded insert that extends beyond the thinned and cracked area, reviewed by the owner's engineer because it changes the joint type of the seam.

## Exercise: count the cracked ligaments

A row of 12 holes has 11 ligaments between them. Inspection finds cracks in ligaments 3, 4, 5 and 8. What proportion of the ligaments are cracked, and what does the pattern suggest?

Four of eleven ligaments are cracked, **about 36%**. Three adjacent cracked ligaments, 3 to 5, suggest a region where strain is concentrated, possibly by a local cause such as a nearby restraint, a heat concentration or thinning. The isolated crack at 8 may be an early instance of the same mechanism. The pattern points towards investigating the region and considering an insert or replacement, rather than welding four separate cracks.
