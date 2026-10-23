---
book: fixtures-that-repeat
chapterSlug: control-wear-spares-and-return-to-service
order: 9
title: "Control wear, spares and return to service"
description: "Connect fixture wear limits to dimensional function, evaluate a simple wear trend and plan spare parts and requalification without treating forecasts as guarantees."
draft: false
---

A fixture's geometry changes through use, cleaning, adjustment and repair. Wear can increase clearance gradually; an impact can change a locator immediately. Maintenance should therefore protect the function the fixture was qualified to perform.

Begin with the features whose change can affect location, force or access. Assign a check and a response to each. A general instruction to inspect for damage is not enough when a small dimensional change matters.

## Link a wear limit to the functional model

This is a separate illustration involving a round locating pin. Assume the largest accepted mating hole is 8.040 mm and the permitted radial clearance contribution from this interface is 0.030 mm.

Under an ideal round, aligned cross-section model:

**Radial clearance = (hole diameter − pin diameter) / 2.**

The smallest pin diameter consistent with that isolated allocation is:

**8.040 − 2 × 0.030 = 7.980 mm.**

This is a geometric boundary for the stated interface, not a complete fixture acceptance limit. Pin form, alignment, other locators and the product's total error budget still require consideration.

Choose an earlier action threshold where appropriate. For the exercise, use **7.990 mm**, leaving 0.010 mm of diametral difference before the geometric boundary. That corresponds to 0.005 mm of radial-clearance reserve.

The threshold is a management and engineering choice for this case. It is not a universal wear allowance for an 8 mm pin.

## Keep a register for each fixture

A fixture register turns maintenance from memory into a schedule. Each fixture gets an entry listing its identifier and revision, its location, its status, and the checks that protect its function, each with an interval, a method, a limit and the last result. For the bracket fixture, the entry might include:

```figure
type: compare
title: Register entries for the bracket fixture
cols: Check | Trigger
caption: Each check protects a function the fixture was qualified for, with a limit and a record of the last result.
- Locating pin diameter | Measure at the contact, against 7.990 mm | Every 200 cycles, and after any impact
- Primary support heights | Compare with the build baseline | Each changeover
- Side and end stops | Position and wear against the baseline | Monthly
- Clamp force | Force check at the lowest supply pressure | Quarterly, and after clamp repair
- *Location keys and base | Fit in the table slots, base flatness | Each mounting
```

The intervals here are illustrative, to be set from the trial evidence and adjusted as wear data accumulate. What matters is that every check is written down with its limit, so that the person doing it knows what result means stop, and so that the register shows at a glance which checks are overdue.

## Schedule maintenance around production

Maintenance competes with production for the fixture's time. A check that requires the fixture off the machine for an hour will be postponed when the schedule is tight, and postponed checks are how wear goes unnoticed. Designing the checks to fit the production pattern makes them more likely to happen.

Checks that take a minute, such as looking at contacts for damage or confirming the work offset, belong in every changeover. Checks that need instruments, such as measuring pin diameters or support heights, can be timed for the natural breaks between batches, when the fixture is already being cleaned and stored. Checks that need the fixture dismantled, such as replacing a worn stop and verifying its position, should be planned into the production schedule with the spares ready, rather than waiting for a failure to force them. The register should show not only what is due, but when the next suitable window is.

## Compare against the baseline, not the drawing

Chapter 2 recommended measuring the locator positions after the fixture was built, and Chapter 4 recommended measuring the delivered clamp force. Those baselines are the reference for maintenance. A support that has worn 0.004 mm since the baseline tells a clearer story than a support that is "within drawing tolerance", because the drawing tolerance may be wider than the change that matters.

Periodically, and after any repair or impact, repeat the baseline measurements and record the differences. A slow, even change across all contacts suggests normal wear; a change at one contact suggests local damage or a loading habit; a sudden change suggests an impact or a loose fixing. Each points to a different response, and none is visible without the baseline.

## Read the trend without trusting it blindly

Suppose an invented inspection record shows a minimum measured pin diameter of 7.998 mm initially and 7.992 mm after 1,200 cycles. A simple linear trend is:

**Wear rate = (7.998 − 7.992) / 1,200 = 0.000005 mm per cycle.**

The remaining indicated difference to the 7.990 mm action threshold is 0.002 mm. At the same rate, that corresponds to **400 more cycles**.

This is a forecast, not permission to run 400 cycles. Two measurements do not establish a stable wear law. Abrasive contamination, impact, material changes and lubrication conditions can alter the rate. Wear can be directional, so a single diameter measurement may miss the smallest local section.

```figure
type: line
title: A locating pin wearing towards its threshold
x: Cycles
y: Minimum pin diameter (mm)
ymin: 7.975
ymax: 8.0
caption: Two readings forecast about 400 more cycles to the 7.990 mm action threshold; the geometric boundary is 7.980 mm.
legend: Measured, then forecast | Action threshold | Geometric boundary
- 0 | 7.998 | 7.99 | 7.98
- 1200 | 7.992 | 7.99 | 7.98
- 1600 | 7.99 | 7.99 | 7.98
```

Use the trend to plan inspection and spare availability while keeping the actual acceptance rule in force. A proposed 200-cycle inspection interval would imply 0.001 mm of wear per interval under the model, but the interval still needs justification against uncertainty and plausible faster wear.

## Include measurement uncertainty at the threshold

Suppose the latest diameter result is 7.992 mm with expanded uncertainty of 0.003 mm under the applicable method. Its lower interval endpoint is **7.989 mm**, below the chosen 7.990 mm action threshold.

If the agreed conservative maintenance rule requires the lower endpoint to remain above the threshold, action is required now. The 400-cycle trend forecast cannot override that rule.

This illustrates the same distinction developed in [measurement and acceptance](/reados/publications/fits-that-work/make-measurement-and-acceptance-agree/): a displayed value and a decision are not the same thing. Establish the maintenance rule before reviewing a borderline result.

Also check whether the measurement method can assess the relevant wear pattern. A pin may remain large in one direction while wearing locally at the actual contact. Record measurement positions and orientation where they affect interpretation.

## Design replacement as a controlled operation

Replaceable locators can reduce downtime, but replacement must preserve the reference. Define the permitted component, mounting condition, seating, securing method and required checks.

A replacement with the same nominal diameter may have a different length, tolerance, hardness, relief or contact geometry. Verify the actual specification rather than relying on a similar description.

After replacement, inspect the reference relationship and perform the required reload or first-off verification. A new locator may correct wear while revealing that the old process offset had been compensating for it. Remove only those compensations that the reviewed method identifies.

Record the removed condition where useful for diagnosis. Repeated early wear may indicate contamination or loading problems rather than an inadequate spare quantity.

## Train the people who maintain it

The person who replaces a locating pin or rebuilds a clamp needs to know which features are part of the location strategy and how to restore them. Without that knowledge, a well-meant repair can move a reference: a stop refitted without its dowels, a support re-shimmed to the wrong height, a pin pressed in at a slight angle.

Give the maintenance instructions the same attention as the operating instructions: identify the critical features, the approved parts, the fixing methods, and the checks that must pass before the fixture returns to production. Record who did the work and the check results in the register. A fixture is only as repeatable as the last repair made to it.

## Clean without causing damage

Cleaning is the most frequent maintenance task and can do harm if done carelessly. Hammering a stuck part free, scraping contacts with a hard tool, or blasting debris into clamp mechanisms and locating holes can damage the very surfaces the fixture depends on. Follow the site's approved cleaning methods and safety requirements, and specify on the set-up sheet which tools and cleaning agents may be used on the locating surfaces.

Protect bare steel contacts from corrosion between uses, particularly where water-based coolant is used, and check that any protective film is removed before the next part is located. A thin layer of rust or dried coolant on a primary support has the same effect as a chip.

## Maintain the clamps as mechanisms

Clamps need their own care. Screw threads should be kept clean and, where the manufacturer specifies, lubricated, so that the same handle effort continues to produce similar force. Toggle clamp pivots and spindles wear, changing their locking point and force. Pads harden, crack and wear, changing contact pressure and marking. Powered clamps depend on seals, hoses and regulators, and lose force as these deteriorate.

The force baseline from Chapter 4 is the simplest overall check: if a clamp no longer delivers its qualified force at the lowest supply pressure or the stated tightening method, it needs repair or replacement through the controlled process, with the force measured again afterwards.

## Plan spares using inventory position

For a fictional replaceable locating-button item, assume consumption averages two buttons every four weeks, replenishment lead time is six weeks and management selects a buffer of two buttons.

Average consumption is **0.5 button per week**. Expected lead-time demand is **0.5 × 6 = 3 buttons**. Adding the chosen buffer gives a reorder point of **5 buttons**.

This is a simple planning rule, not a specified service-level calculation. It assumes the demand and lead-time estimates are meaningful. Review variability, supplier reliability, minimum order quantities and the consequence of a stockout before adopting it.

Use inventory position: usable stock on hand plus confirmed stock on order, minus allocated demand. If there are four usable buttons, two confirmed on order and one allocated, inventory position is **4 + 2 − 1 = 5**.

```figure
type: stats
title: Planning spare locating buttons
caption: Reorder on inventory position, not just stock on the shelf.
- 0.5 a week | Average use
- 3 | Expected lead-time demand | over six weeks
- *5 | Reorder point | including a buffer
- 4 + 2 − 1 = 5 | Inventory position | on hand, on order, allocated
```

Under a policy that orders at or below five, this triggers replenishment. If the chosen order quantity is four, the position becomes nine after the new order is recorded. Keeping the on-order quantity visible prevents repeated ordering from the same low on-hand count.

Plan dissimilar items separately. A round pin and a relieved pin are not interchangeable units merely because the fixture uses one of each.

## Read wear patterns as evidence

Where a fixture wears is often more informative than how fast. Wear concentrated at one end of a side stop suggests that parts are being slid into position along the stop rather than placed and pushed. A polished patch on a support outside the intended contact area suggests the part is not seating where the design assumed. Burrs raised on a locating pin's entry edge suggest the part is being forced on at an angle.

Each of these points back to the loading method or the incoming parts rather than to the fixture's material. Photographing worn components when they are replaced, and noting where the wear was, gives the design and process teams evidence for improving the next revision, and may show that a change to the instruction would extend component life more than a harder material would.

## Define stop conditions beyond wear

An impact, cracked component, loose mounting, damaged clamp or unexplained location shift may require immediate withdrawal regardless of the planned inspection date. List conditions the operator can recognise and the escalation route.

Do not permit a fixture to return to service solely because the visible damage was polished away. Determine whether references, force paths or material condition were affected and repeat the relevant checks.

Preserve the fixture's status physically and in the register. A quarantined fixture left on a production shelf can be selected accidentally if its status exists only in a maintenance spreadsheet.

## Decide when to rebuild or retire

Every fixture eventually reaches a point where maintaining it costs more than it saves. Signs include frequent component replacement, growing adjustments to keep parts in tolerance, base wear that cannot be corrected by replacing parts, or a product revision that the fixture no longer suits.

The decision to rebuild, replace or retire belongs with the same people who approved the original business case, using the register's history as evidence. A retired fixture should be clearly marked and removed from production storage, so that it cannot be picked up by mistake. Its register entry, trial record and lessons should be kept, because they are the best starting brief for its replacement.

## Exercise: distinguish a forecast from a release

The wear trend predicts 400 cycles to the action threshold, but the uncertainty interval already crosses it. Which governs the maintenance decision under the stated conservative rule?

The current measurement decision governs. The trend helps plan future work; it does not invalidate the rule. Investigate, improve the measurement if appropriate, or replace the component through the controlled process.

Then calculate the radial clearance at a pin diameter of 7.990 mm with an 8.040 mm hole. It is **0.025 mm**, leaving the stated 0.005 mm reserve to the isolated 0.030 mm allocation.

The final chapter brings technical qualification, operating control and the business case into one release decision.
