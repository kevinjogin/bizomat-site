---
book: fixtures-that-repeat
chapterSlug: control-wear-spares-and-return-to-service
order: 9
title: "Control wear, spares and return to service"
description: "Connect fixture wear limits to dimensional function, evaluate a simple wear trend and plan spare parts and requalification without treating forecasts as guarantees."
draft: true
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

## Read the trend without trusting it blindly

Suppose an invented inspection record shows a minimum measured pin diameter of 7.998 mm initially and 7.992 mm after 1,200 cycles. A simple linear trend is:

**Wear rate = (7.998 − 7.992) / 1,200 = 0.000005 mm per cycle.**

The remaining indicated difference to the 7.990 mm action threshold is 0.002 mm. At the same rate, that corresponds to **400 more cycles**.

This is a forecast, not permission to run 400 cycles. Two measurements do not establish a stable wear law. Abrasive contamination, impact, material changes and lubrication conditions can alter the rate. Wear can be directional, so a single diameter measurement may miss the smallest local section.

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

## Plan spares using inventory position

For a fictional replaceable locating-button item, assume consumption averages two buttons every four weeks, replenishment lead time is six weeks and management selects a buffer of two buttons.

Average consumption is **0.5 button per week**. Expected lead-time demand is **0.5 × 6 = 3 buttons**. Adding the chosen buffer gives a reorder point of **5 buttons**.

This is a simple planning rule, not a specified service-level calculation. It assumes the demand and lead-time estimates are meaningful. Review variability, supplier reliability, minimum order quantities and the consequence of a stockout before adopting it.

Use inventory position: usable stock on hand plus confirmed stock on order, minus allocated demand. If there are four usable buttons, two confirmed on order and one allocated, inventory position is **4 + 2 − 1 = 5**.

Under a policy that orders at or below five, this triggers replenishment. If the chosen order quantity is four, the position becomes nine after the new order is recorded. Keeping the on-order quantity visible prevents repeated ordering from the same low on-hand count.

Plan dissimilar items separately. A round pin and a relieved pin are not interchangeable units merely because the fixture uses one of each.

## Define stop conditions beyond wear

An impact, cracked component, loose mounting, damaged clamp or unexplained location shift may require immediate withdrawal regardless of the planned inspection date. List conditions the operator can recognise and the escalation route.

Do not permit a fixture to return to service solely because the visible damage was polished away. Determine whether references, force paths or material condition were affected and repeat the relevant checks.

Preserve the fixture's status physically and in the register. A quarantined fixture left on a production shelf can be selected accidentally if its status exists only in a maintenance spreadsheet.

## Exercise: distinguish a forecast from a release

The wear trend predicts 400 cycles to the action threshold, but the uncertainty interval already crosses it. Which governs the maintenance decision under the stated conservative rule?

The current measurement decision governs. The trend helps plan future work; it does not invalidate the rule. Investigate, improve the measurement if appropriate, or replace the component through the controlled process.

Then calculate the radial clearance at a pin diameter of 7.990 mm with an 8.040 mm hole. It is **0.025 mm**, leaving the stated 0.005 mm reserve to the isolated 0.030 mm allocation.

The final chapter brings technical qualification, operating control and the business case into one release decision.
