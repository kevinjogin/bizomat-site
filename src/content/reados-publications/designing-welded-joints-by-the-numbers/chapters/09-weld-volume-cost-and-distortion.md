---
book: designing-welded-joints-by-the-numbers
chapterSlug: weld-volume-cost-and-distortion
order: 9
title: "Weld volume, cost and distortion"
description: "Turn weld sizes into kilograms of weld metal, hours and dollars, see how much a habit of oversizing costs a frame, and design joints that use less weld, distort less and are easier to make well."
draft: false
---

A weld sized by the numbers is not only safer than one sized by habit; it is usually cheaper. Weld metal costs money to deposit, mostly in the welder's time, and every extra millimetre of leg adds weld metal with the square of the leg. It also adds heat, and heat brings distortion, which costs more time to correct. A designer who knows what a weld costs designs joints that need less of it, in places the welder can reach, and leaves the fabricator less to straighten afterwards.

This chapter converts fillet sizes into weld metal per metre, compares the conveyor frame's weld metal under a habit of oversizing and under the sizes the earlier chapters calculated, puts a price on the difference, and sets out the design choices that cut weld volume and distortion together.

## Weld metal per metre

The cross-sectional area of an equal-leg fillet is half the leg squared, and the weld metal per metre is that area times a metre times the density of steel, about 7.85 grams per cubic centimetre.

```figure
type: bars
title: Weld metal in a metre of fillet weld, by leg size
unit: kg per metre, ignoring reinforcement and losses
max: 0.45
caption: Calculated as s² ÷ 2 × 1 m × 7,850 kg/m³. Real welds carry some reinforcement, and the filler bought is more than the weld deposited, because of spatter, stubs and slag.
- 4 mm | 0.063
- 5 mm | 0.098
- *6 mm | 0.141
- 8 mm | 0.251
- 10 mm | 0.392
```

An 8 mm fillet holds about 1.78 times the weld metal of a 6 mm fillet, and a 10 mm fillet about 2.8 times, while their strengths rise by only 1.33 and 1.67 times. Arc Welding by the Numbers works through the weld metal in fillet welds, including reinforcement and root gaps, in its chapter on [weld metal in fillet welds](/reados/publications/arc-welding-by-the-numbers/weld-metal-in-fillet-welds/), and the WORKOS [fillet weld quantity calculator](/tools/fillet-weld-quantity/) does the arithmetic for a whole job.

## From kilograms to dollars

Weld metal is cheap; depositing it is not. Most of the cost of a weld is the welder's time, and the time depends on how fast the process deposits metal while the arc is on and on what fraction of the welder's time the arc is actually on, the operator factor. Arc Welding by the Numbers explains both in its chapter on [arc time and operator factor](/reados/publications/arc-welding-by-the-numbers/arc-time-and-operator-factor/).

```figure
type: formula
title: Labour cost of a kilogram of deposited weld metal
formula: cost per kg = labour rate ÷ (deposition rate × operator factor)
caption: This is an illustration, excluding GST, for a semi-automatic process in a jobbing shop. Filler, gas and power add a few dollars more per kilogram.
- Labour rate, with overhead | A$130 an hour
- Deposition rate while the arc is on | 3 kg an hour
- Operator factor | 30%
step: kilograms deposited per paid hour = 3 × 0.30 = 0.9 kg
step: labour cost ≈ 130 ÷ 0.9 ≈ A$144 per kilogram of weld metal
step: with filler, gas and power, about A$152 per kilogram
```

At about A$150 per kilogram deposited, every 100 grams of unnecessary weld metal costs about A$15, and on a frame with tens of metres of weld, those grams add up to real money.

## The conveyor frame, by habit and by design

This is an illustration. The conveyor drive's frame has about 30 m of fillet weld in all. A habit that the company's previous drawings had followed was to specify 8 mm fillets on everything, "to be safe". The calculations in the earlier chapters, with the minimum sizes and fatigue considerations, gave instead about 6 m of 8 mm fillet at the heaviest joints, 14 m of 6 mm fillet at the motor bracket, gearbox plate and other loaded joints, and 10 m of 4 mm fillet at lightly loaded stiffeners and guards on thinner parts.

```figure
type: compare
title: Weld metal and cost for the conveyor frame, by habit and by design
cols: Weld metal | Approximate cost
caption: This is an illustration, excluding GST, at about A$152 per kilogram deposited. Distortion correction, which falls with weld volume, is not included and would widen the gap.
- All 8 mm, by habit | about 7.5 kg | about A$1,140
- *Sized by the numbers | about 4.1 kg | about A$625
- Saving per frame | about 3.4 kg | about A$520
```

About A$520 per frame, on a small frame, is a saving the company makes on every drive it builds, and it comes with less heat, less distortion and less straightening. The designed welds are also all within the single-pass range for the shop's process, while 8 mm fillets in the vertical position would have needed two or three passes each.

## Where the welder's time goes

The deposition arithmetic covers only the time the arc is on, and it understates the time a joint takes. Before each weld, the parts are cut, cleaned, fitted, clamped and tacked; after it, the slag is removed, spatter cleaned, the weld inspected and the part turned for the next. Joints that are awkward to fit, need back-gouging, or require many small welds in different places take far longer per kilogram than long, straight welds in the flat position. The operator factor in the formula above, 30%, reflects a jobbing shop with varied work; a frame designed with simple, repetitive, accessible joints may let the welders reach a higher factor, and a frame full of awkward joints a lower one. The designer influences the operator factor as much as the weld size.

## Fit-up and its cost

Poorly fitting parts cost twice: once in the time spent forcing them together or filling the gap, and again in the extra weld metal a gap demands, as Chapter 4 showed. Parts cut accurately, with edges that meet without gaps, let welds be made to their nominal size quickly. Designers can help by specifying cutting tolerances that suit the welds, by using jigs and fixtures for repeated frames, and by avoiding joints that stack tolerances so that the last part never fits. READOS covers the design of fixtures for repeatable fabrication in [Fixtures That Repeat](/reados/publications/fixtures-that-repeat/), and a well-designed fixture often pays for itself on a short run of frames by removing fit-up time and gaps.

## Plate thickness and weld size

The thickness of the parts drives the weld size through the minimum size rules (Chapter 4), so a designer who uses thicker plate than necessary also buys larger welds, more preheat and more distortion. A gearbox plate of 16 mm, when 12 mm would carry the loads and stay flat enough after machining, needs a larger minimum fillet on every edge. Choosing thicknesses with the welds in mind, rather than adding thickness "for stiffness" without calculating it, is one of the quieter savings in welded design.

## Welding time in the quote

For a fabricator quoting a job from the drawing, the weld sizes and lengths are the starting point of the labour estimate. A drawing that shows every weld with its size and length lets the estimator calculate the weld metal and the time with some confidence; a drawing that says "weld all round, 8 mm" leaves the estimator guessing and usually quoting high to cover the risk. Clear weld information on the drawing therefore lowers the price the customer pays, as well as the cost the fabricator incurs.

## The finish after welding

Welds that will be painted, galvanised or left visible need finishing, and the finish adds cost. Grinding welds flush, removing spatter, blending weld ends and dressing the toes of fatigue-critical welds all take time, and the designer should specify only the finish the use needs. A frame hidden inside a machine guard does not need cosmetically ground welds; a stainless steel food-processing frame may need every weld ground smooth and polished for hygiene. Stating the finish on the drawing avoids both the expensive over-finishing of hidden welds and the arguments over welds that were not finished enough.

## Distortion grows with weld volume

Every weld shrinks as it cools, and the shrinkage pulls the parts out of shape: plates bend at fillet welded tees, frames bow, flanges tilt. The amount of distortion depends on many things, but the volume of weld metal and the heat put in are among the most important, and both rise with the weld size. A frame welded with oversized fillets distorts more, and the fabricator spends time straightening it, presetting parts to allow for it, or machining mounting faces flat after welding. Welding Distortion by the Numbers deals with the mechanics and control of distortion in detail.

## Designing for less weld

Several design choices reduce weld volume without reducing strength:

- **size welds to the load**, as this book has shown, with minimum sizes and fatigue considered, rather than by habit;
- **use longer, smaller welds** rather than shorter, larger ones where more capacity is needed;
- **put welds where they work hardest**, far from the axis of bending or twisting, so that smaller welds carry the load;
- **use double-sided preparations** for thick butt welds, which need about half the weld metal of single-sided ones;
- **use partial penetration or fillet welds** where complete penetration is not needed;
- **use rolled and formed shapes** instead of fabricating them from welded plates, removing welds altogether;
- **use bolted connections** where parts must come apart or where site welding would be difficult.

## Designing for the welder

A weld that is easy to make is more likely to be sound and is quicker to make. Designers can help by placing welds in the flat or horizontal positions where the parts can be turned, giving the welder room to reach the root at the right angle, avoiding welds inside small boxes and deep pockets, keeping weld sizes consistent across a job so the welder is not constantly changing settings, and avoiding very short welds and many stops and starts. A designer who spends an hour in the shop watching their own frames being welded learns more about this than from any book, including this one.

## Symmetry and sequence

Welds placed symmetrically about a member's axis pull it equally on both sides and distort it less than welds on one side. A beam with a stiffener welded on one side of its web bows towards the stiffener; with matching stiffeners on both sides, the pulls balance. A frame with all its heavy welds along one edge bows; the same welds spread evenly round it pull it less out of shape. Designers can arrange joints for symmetry, and specify welding sequences for critical parts, although the detailed sequence is usually the fabricator's to plan.

## Machined faces after welding

Mounting faces that must be flat and in line, such as the gearbox plate and the motor shelf, are often machined after welding, because welding distortion is hard to predict precisely enough to hold close tolerances. The designer allows extra thickness for machining on those faces, specifies the flatness and position needed, and plans the welding to minimise the distortion the machining must remove. For the conveyor frame, the gearbox plate was specified 2 mm thick oversize and machined flat after welding, a cost far smaller than the alternative of shimming a distorted plate on site.

## Value engineering a welded frame

Once a frame has been designed, a short review with the fabricator often finds further savings: a joint that could use a bent plate instead of two welded ones, a bracket that could be bolted to an existing hole rather than welded on, a stiffener that the calculation shows is not needed, a weld that could move to the flat position if a part were turned. The conveyor company now holds a half-hour review of each new frame's drawings with its fabricator before release. On the first frame reviewed, it removed four small stiffeners and changed two vertical welds to flat ones by reversing a sub-assembly, saving about another hour of welding per frame.

## A failure: the "safe" welds

This is an illustration. An earlier batch of the company's machine bases, drawn with 10 mm fillets on every joint to be safe, came back from the fabricator late and over budget. The heavy welds had needed several passes each, the bases had twisted out of flat, and the fabricator had spent nearly as long straightening them as welding them. The motor mounting faces still had to be shimmed on site.

Recalculating the welds from the loads showed that 5 and 6 mm fillets would have carried them, with the minimum sizes met. The next batch, drawn with the calculated sizes, used about a third of the weld metal, needed no straightening beyond normal, and arrived on time. Oversizing had not made the bases safer; it had made them worse. The company keeps the two batches' costs side by side in its design guide as the clearest argument it has for calculating welds.

## Exercise: a frame's weld metal

A frame has 12 m of 6 mm fillet and 4 m of 10 mm fillet. Calculate the weld metal and its approximate cost at A$152 per kilogram. If the 10 mm fillets could be replaced by 6 mm fillets twice as long, how would the weld metal change?

The 6 mm fillets hold about 12 × 0.141 ≈ **1.69 kg** and the 10 mm fillets about 4 × 0.392 ≈ **1.57 kg**, a total of about 3.26 kg, costing about 3.26 × 152 ≈ **A$496**.

Replacing the 4 m of 10 mm fillet with 8 m of 6 mm fillet gives about 8 × 0.141 ≈ 1.13 kg instead of 1.57 kg. The capacity of 8 m of 6 mm fillet, at 848 N/mm, is about 6,780 kN against about 5,660 kN for 4 m of 10 mm at 1,414 N/mm, so the longer, smaller weld is both stronger and lighter, saving about 0.44 kg, about A$67, if the joint has room for the extra length.
