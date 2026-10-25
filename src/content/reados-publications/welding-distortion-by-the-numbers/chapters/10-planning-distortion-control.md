---
book: welding-distortion-by-the-numbers
chapterSlug: planning-distortion-control
order: 10
title: "Planning distortion control and keeping the record"
description: "Build a distortion control plan for each product, from its tolerance through prediction to the cheapest controls that work, measure the results, and keep the record that lets the shop improve."
draft: false
---

The earlier chapters dealt with each kind of distortion and each control separately. In a working shop, they come together product by product: each part has its own tolerances, its own welds and its own history of what went wrong. A distortion control plan pulls the pieces together for one product, so that the shop decides in advance how it will keep that product in tolerance, measures whether it did, and improves the plan from the results. Without a plan, distortion control is whatever each welder remembers to do that day.

This chapter sets out the steps of a distortion control plan, ranks the controls by cost, shows the measurement and record that make the plan work, and reviews the shop's results on its three problem products.

## Start from the tolerance

The plan starts with what the product must achieve: the straightness, flatness, squareness and dimensions that its standard, specification or customer requires, and which of them matter most. A girder's camber, sweep and flange tilt; a base frame's top plate flatness and mounting hole positions; a panel's waviness and overall size. Knowing the tolerance tells the shop how much effort the product deserves. A part with generous tolerances may need nothing more than sensible weld sizes; a precision part may need every control in this book.

## Predict the distortion

Next, the plan predicts which kinds of distortion the product will show and roughly how much, using the reasoning of Chapters 2 to 6: transverse shrinkage across butt seams, longitudinal bowing from welds off the neutral axis, angular distortion at single-sided welds and fillets, buckling of thin panels, and movement on release or machining from residual stress. The predictions need not be precise; their purpose is to show which distortion will matter for which tolerance, so that the controls are aimed at the right target. Where the shop has measurements from earlier parts, those replace the models.

## Choose the controls, cheapest first

The controls differ greatly in cost, and the plan uses the cheapest that will work.

```figure
type: steps
title: Distortion controls, roughly from cheapest to most expensive
caption: A general ranking. Most products need a combination; the plan adds controls until the prediction, and then the measurements, show the tolerance is met.
- Design | fewer welds, symmetric joints, stiffer sections, thicker thin panels or closer stiffeners
- Weld size and process | welds sized to their loads; lower heat input; double-sided preparations
- *Sequence | balance about the axis; back-step and skip; middle outwards; sub-assemblies
- Allowances and presets | oversize cutting for shrinkage; preset angles; pre-bent flanges
- Fixtures and restraint | locate, clamp, chill and turn the work
- Stress relief and staged machining | for parts that must stay stable after machining
- Straightening | the correction of last resort, after welding
```

The ranking reflects the fact that the earliest controls prevent distortion, while the later ones correct or contain it. A shop that relies on straightening is paying the highest price for distortion control, every time.

## The plan for each product

This is an illustration. The shop's plans for its three products, after the work described in the earlier chapters, can be summarised side by side.

```figure
type: compare
title: The shop's distortion control plans
cols: Main distortion | Controls used
caption: This is an illustration of the shop's plans. Each plan is a page in the welding procedure for the product, with the sequence sheet and fixture settings attached.
- Plate girders | bow, sweep, flange tilt | 6 mm fillets; double-V web splices; balanced sequence with twin-head carriage; pre-bent flanges; rotating fixture
- Machine base frames | top plate dishing; movement after machining | balanced attachments; side-frame sub-assemblies in a flat fixture; staged machining with a rest between cuts
- *Stainless panels | buckling between welds | stiffeners at 400 mm; stitch welds; spaced sequence; pulsed arc; chill-bar fixture
```

## Measure every piece, at first

When a plan is new, every piece is measured at the points that matter, and the results recorded. The measurements show whether the plan works, how much the distortion varies from piece to piece, and whether presets and allowances need adjusting. Once the plan is proved and the variation is small, the shop measures a sample, perhaps every fifth piece, and every piece after any change of welder, consumable, process or design.

## The distortion record

The shop keeps a simple record for each product: the date, the piece, the welder, the procedure and sequence used, the preset settings, the measurements at each point, and any straightening done with its time. Plotted over time, the record shows trends: a gradual increase in girder camber that turned out to be a worn carriage drive slowing the travel speed, a jump in panel waviness that coincided with a new batch of sheet. It also gives the production manager the numbers to justify fixtures and changes, as Chapter 8 showed for the girder fixture.

```figure
type: checklist
title: What the shop records for each welded product
caption: This is an illustration of the shop's practice. The record is short enough to complete in a few minutes per piece.
- x Piece, date, welder and procedure | including consumable batch and machine
- x Sequence followed | and any departures, with the reason
- x Presets and fixture settings | as used, not just as specified
- x Measurements at each control point | after cooling, before any straightening
- x Straightening done | method, heats or force, time taken, final measurements
- *? Lessons | what changed and what to try next time
```

## The cost of distortion, measured

The record also measures what distortion costs. Before the plans, the shop's distortion costs, mainly straightening, rework and the occasional scrapped part, came to an illustrative A$30,000 a year across the three products. After the plans, they fell to about A$6,000, mostly the occasional straightening of a girder from a new design before its plan was calibrated. The fixtures and changes cost about A$25,000 in all, recovered in a little over a year.

```figure
type: stats
title: The shop's distortion results after a year of planned control
caption: This is an illustration. Costs exclude GST and come from the shop's job records and distortion record.
- *About 80% | Fall in distortion costs | about A$30,000 to about A$6,000 a year
- Under 1 mm | Girder flange tilt | from about 3 mm
- Within 0.05 mm | Base frame top flatness after machining | from about 0.4 mm
- Under 1 mm | Panel waviness | from up to about 4 mm
```

## Choosing measurement points

A plan names the points where each product is measured and how. For the girders, the shop measures camber and sweep at mid-length and the quarter points with a string line and a steel rule, and flange tilt with a square and feeler gauges at three positions along each flange. For the base frames, it measures the top plate's flatness on a grid of nine points with a dial gauge on a surface plate, before and after machining. For the panels, it measures the largest gap under a 1 m straight-edge in each bay between stiffeners. Fixing the points and methods makes measurements comparable from piece to piece and inspector to inspector; changing them makes trends meaningless.

## When to measure

The timing of measurement matters as much as the method. Distortion changes as a part cools, as clamps are released and as metal is machined, so each measurement is taken at a defined stage: after the part has cooled to near room temperature, after it is released from the fixture, and after machining where that applies. A girder measured warm in the fixture may look perfect and be bowed an hour later on the floor. The shop's record states the stage of each measurement, so that before-and-after comparisons are made between like stages.

## Variation and capability

Distortion varies from piece to piece even with the same plan, because welders, materials, fit-up and conditions vary. The record shows how much. If the variation is small compared with the tolerance, the plan is capable, and sampling can be reduced. If it is close to or larger than the tolerance, some pieces will fail however good the average is, and the plan must reduce the variation, usually by making the welding more consistent with mechanised travel, fixed parameters or better fit-up, before presets can be relied on. Testing Welded Joints by the Numbers discusses variation and sample sizes in its chapter on [variation and how many specimens](/reados/publications/testing-welded-joints-by-the-numbers/variation-and-how-many-specimens/), and the same reasoning applies to distortion measurements.

## New designs and first articles

A new product, or a significant change to an existing one, starts with a first-article approach: the plan is drafted from prediction and experience, the first piece is made with extra measurement at each stage, and the plan is adjusted before production continues. The shop builds the cost of first-article measurement and possible straightening into its quotes for new designs, so that the learning is paid for rather than absorbed. Once the first few pieces have calibrated the presets and allowances, the plan is frozen and the production rate rises.

## Who owns the plan

A plan needs an owner. In the shop, the welding engineer writes each plan with the welding supervisor, the welders follow it and record their measurements, and the production manager reviews the records monthly. When a plan fails, the owner finds out why and changes it; when a welder finds a better way, the owner tests it and, if it works, writes it into the plan. Without an owner, plans drift: presets are adjusted informally, sequences shortened, records skipped, and within months the shop is back to straightening.

## Distortion and design together

The cheapest controls are in the design, and the shop learned to feed its distortion records back to the designers. When a new product is designed, the welding engineer reviews the drawings for distortion: welds that could be smaller, joints that could be balanced, panels that need closer stiffeners, faces that should be machined after welding. Designing Welded Joints by the Numbers sets out the designer's side of this in its chapter on [weld volume, cost and distortion](/reados/publications/designing-welded-joints-by-the-numbers/weld-volume-cost-and-distortion/). A distortion problem caught on the drawing costs minutes; caught on the shop floor, it costs hours on every piece.

## Distortion in subcontracted work

Many shops send some welding out, and distortion control does not stop at the gate. When the shop subcontracts sub-assemblies, it sends the distortion plan with the drawings: the sequence, the presets, the measurement points and the tolerances, and asks for the measurement record back with the parts. A subcontractor who receives only a drawing will weld in whatever order suits them, and the shop discovers the distortion when the parts arrive. Including the plan in the purchase order costs nothing and turns an argument about whose fault the distortion is into a check of whether the plan was followed.

## Communicating tolerances to the welders

Welders control much of the distortion, but they cannot aim at a tolerance they do not know. The shop posts each product's key tolerances on its sequence sheet, beside the sequence, so that a welder who measures a girder's camber after the first stage knows whether it is on track. Welders who know the target, and see the measurements, start to adjust their own technique to meet it, which no written procedure can fully capture. The welding supervisor reviews the records with the welders weekly, so that the measurements are a shared tool, not just an inspector's tick.

## Keeping it simple

A plan should be as simple as the product allows. The shop's girder plan, the most elaborate, fits on two pages with its sequence sheet; the panel plan on one; and many of its simpler products need only a line in the welding procedure stating the weld sizes and a balanced sequence. Complicated plans are not followed. The aim is the fewest controls that keep the product in tolerance, applied every time.

## Bringing it together

Each chapter of this book applied one idea to one kind of distortion. Metal heated more than about a hundred degrees above its surroundings and held back yields, and shrinks when it cools. Transverse shrinkage grows with the weld's area and draws plates together, and the gap ahead moves as the weld proceeds, as Whittemore found. Longitudinal shrinkage acts as a tendon force that bows members when it lies off their axis. Uneven shrinkage through the thickness kinks butt joints and tilts flanges. Thin plates buckle under compressive stresses far below what welding produces. Restraint trades distortion for residual stress and cracking. Sequence balances the pulls; presets and fixtures use or resist them; straightening corrects what remains. And a plan, with measurements and a record, turns all of it into parts that come out right. The early welders' rule, that what is expanded by heat must contract again and that the welder must provide for it, runs through every page.

## A failure: the plan nobody followed

This is an illustration. A few months after the girder plan was introduced, a batch of girders came out bowed again. The plan had not changed, but the record showed that the twin-head carriage had been out of service for repair, and the welders, under time pressure, had welded the flanges one at a time by hand, without recording the departure. The girders needed straightening, costing about the time the plan had saved for the previous three months.

The shop's response was to add a line to the plan: if the carriage or fixture is unavailable, the hand welding sequence on the sequence sheet's reverse is used, alternating short lengths top and bottom, and the departure is recorded. A plan must cover what to do when the preferred method is unavailable, or it will be abandoned exactly when it is most needed.

## Exercise: plan for a new product

The shop is asked to make a batch of long welded channels, 7 m long, of 6 mm plate, with lifting lugs welded to one flange at intervals. List the distortion you would expect and the controls you would put in the plan, cheapest first.

The main distortions would be longitudinal bowing and sweep from the channel's longitudinal welds, if it is fabricated from plates, and from the lugs welded to one flange, which lie off the neutral axis; angular distortion of the flange at each lug; and some shortening.

The plan, cheapest first, would: ask whether a rolled channel could replace the fabricated one, removing the longitudinal welds; size the lug welds to their loads, which for lifting lugs are set by the lifting equipment requirements and must not be undersized; weld the lugs in a balanced sequence from the middle outwards, perhaps with matching attachments on the other flange if the design allows; preset the channel with a small opposite bow, calibrated on the first few pieces; hold it in a straightening fixture during welding; and measure every piece at first, straightening only as a last resort. Because the lugs are for lifting, their welds would also be inspected to the applicable requirements, whatever the distortion plan.
