---
book: inspecting-to-the-drawing
chapterSlug: handle-nonconformance-and-feed-back
order: 9
title: "Handle nonconforming parts and feed back to the drawing"
description: "Contain a nonconforming part, choose a disposition within the right authority, request a concession properly, fix the cause and send drawing problems back to the designer."
draft: false
---

Every inspection system eventually finds a part that does not conform. What happens next decides whether the system protects anyone. A nonconforming part that is quietly reworked, argued into acceptance or mixed back into the good stock has been inspected for nothing. A part that is identified, held, decided by the right person and traced to its cause becomes the most useful thing the inspection produced.

This chapter takes the bracket batch through its nonconformances: three parts out of 40, each taking a different route. It separates what an inspector may decide from what only the design authority may decide, shows a concession request a customer can act on, follows a cause back to the fixture that produced it, and sends the problems the drawing caused back to the people who own the drawing.

## First, contain

The first response to a nonconforming part is physical: stop it moving. A part that fails inspection is tagged with what failed and why, recorded, and placed in a marked hold area away from conforming parts. If the failure could affect other parts, the inspector also asks which ones, and holds them until they are checked.

AS/NZS ISO 9001 requires nonconforming outputs to be identified and controlled to prevent unintended use or delivery, and many customers' requirements add to that. The mechanics need not be elaborate. A red tag, a labelled crate and a line in a register are enough in a small shop, provided they are always used. The register line records the part, the batch, the drawing and revision, the balloon, the requirement, the actual result, who found it and when.

## Dispositions and who may decide

Once contained, a nonconforming part needs a disposition: a decision about what happens to it. There are five common dispositions, and they differ in who has the authority to choose them.

```figure
type: compare
title: Dispositions for a nonconforming part
cols: What it means | Who may decide
caption: For a build-to-print part, any disposition that leaves the part different from the drawing needs the customer, as design authority, to agree in writing.
- Rework | Further work makes the part conform to the drawing | The shop, then re-inspect
- Scrap | The part is destroyed or made unusable | The shop
- Return to supplier | A bought-in item goes back | The shop
- *Use as is | Accept the part as it is, not conforming | Design authority, by concession
- *Repair | Make it usable but not to the drawing | Design authority, by concession
```

The distinction between rework and repair is the important one. Rework brings the part back to the drawing; after re-inspection it conforms, and nobody else needs to be asked. Repair leaves it different from the drawing, perhaps with an oversized hole bushed or a thread re-cut to a larger size, and that is a design decision. For a part made to a customer's drawing, the design authority is the customer. Neither the inspector nor the shop's production manager can accept a nonconforming part on the customer's behalf, however obvious it seems that the part will work.

## The running case: three nonconformances

This is an illustration. Across the batch of 40 brackets, three parts are held.

| Part | Balloon | Requirement | Result | Disposition |
|---|---|---|---|---|
| 17 | 9 | Bore, acceptance zone 10.0014 to 10.0136 | 10.0145, mean of three | Concession requested; granted |
| 23 | 22 | Break edges 0.2 to 0.5 | One edge of the upright left sharp | Rework would break the anodise; scrapped |
| 31 | 14.2 | Thread M4-6H | NO-GO plug enters fully | Concession requested; refused; scrapped |

Part 23 shows why rework needs care on a finished part. Deburring the sharp edge would cut through the anodise, and the customer's finish specification does not permit touch-up of anodised surfaces. The edge could not be reworked without stripping and re-anodising the whole part, which would change its dimensions. The shop scrapped it instead. Part 23 is a reminder that the disposition must respect every requirement on the part, not only the one that failed.

Part 31's thread was cut with a tap that had worn oversize on one side. The shop asked the customer whether a part with an oversize thread could be used. The customer refused, because the cover screws on their assembly are tightened to a torque that needs full thread engagement. The shop scrapped the part and replaced the tap, and added a check of the first hole after every tap change.

## A concession request a customer can act on

Part 17 is the held bore from Chapter 6: inside the drawing limits but outside the guarded acceptance zone. The shop does not know whether the customer can use it; the customer does. A good concession request lets the customer decide quickly and confidently.

```figure
type: checklist
title: What a concession request contains
caption: This is an illustration. The request gives the customer facts, not arguments; the decision on function is theirs.
- Part, drawing and revision | SB-2041 rev C, batch 0412, part 17
- The requirement and the result | balloon 9; 10.0145 mean of three; U = 0.0014 at k = 2
- Why it is held | inside drawing limits, outside agreed guarded acceptance zone
- Quantity affected | one part; all others measured within the acceptance zone
- Cause | process mean drifted toward the upper limit; see corrective action
- Proposed disposition | use as is, part marked and recorded
- Corrective action | bore target moved down 0.002 mm; trend chart at the machine
- x Assertions about function | "it will work" is the customer's judgement, not the supplier's
```

This is an illustration. The customer reviews the request against their sensor's clearance and grants a concession for part 17 alone, in writing, with a concession number. The part is marked with the concession number, the delivery documents list it, and the concession is filed with the batch records. The concession covers one part; it does not change the drawing or the acceptance rule for the next part.

## The cost of three parts

This is an illustration with invented prices; all amounts exclude GST. The shop sells the bracket at A$46.00 each, A$50.60 including GST. Replacing a scrapped bracket costs the shop about A$32.00 in material, machining, anodising and inspection. Two scrapped brackets cost about A$64.00 to replace, and preparing the two concession requests took about 1.5 hours of the inspector's time at a charge-out rate of A$90.00 an hour, A$135.00. The total, around A$199.00, is more than four brackets' worth of selling price on a 40-part order.

The arithmetic matters less than its direction. Each nonconformance costs more than the part, because it consumes the scarcest time in a small shop: that of the people who can make decisions. That is the argument for spending effort on causes.

## From correction to corrective action

Scrapping part 31 is a correction: it deals with the part. Replacing the worn tap and checking the first hole after each tap change is corrective action: it deals with the cause so the problem does not recur. Inspection records are full of corrections; the effective ones are followed by corrective actions.

The most consequential cause in the bracket job was the one behind FA-1's hole position, found in Chapter 4. The investigation asked why repeatedly until the answer was something the shop could change.

```figure
type: cycle
title: The corrective action cycle for the fixture stop
caption: This is an illustration. Each step is recorded, and the cycle ends only when a later check confirms the fix worked.
- Contain | FA-1 held; position check added for all parts made on the fixture
- Describe | hole 8.2 shifted +0.11 from datum C; hole 8.1 +0.06
- Find the cause | end stop held by one cap screw, no dowel; knocked while clearing chips
- Act | stop doweled; stop position added to the set-up checklist
- Verify | FA-2 positions 0.072 and 0.089; tenth-part checks stable through the batch
```

The verification step closes the cycle. A corrective action that has not been checked is a hope. The bracket's tenth-part position records, collected under the production plan in Chapter 8, provide the evidence that the doweled stop held its place.

## Containment beyond the failed part

The part on the bench is rarely the only one affected. A worn tap that cut one oversize thread may have cut several before the gauge caught it. A knocked fixture stop affects every part made since it moved. Containment therefore asks a second question after "hold this part": since when?

The answer comes from the records. For part 31, the tap had been changed at part 24, so the inspector re-gauged every thread on parts 24 to 30, all of which had passed the attribute check at the machine, and found them conforming; the tap had worn on one side over the last few holes. For the fixture stop, the last confirmed good position check was on the trial parts, so everything made on the fixture after them was held until checked with the position gauge. Without records of when each check was done and what it found, the only safe answer to "since when?" is "since the start of the batch", and everything is re-inspected.

## Telling the customer early

Customers rarely object to hearing about a problem. They object to finding it themselves. A short message on the day a nonconformance is found, saying what was found, how many parts are affected, what has been contained and when a disposition request will follow, keeps the customer's planning accurate and their trust intact.

This is an illustration. When part 17's bore was held, the shop's inspector told the customer's buyer the same afternoon that one bracket of the 40 was held for a concession decision and that the delivery date for the other 39 was unaffected. The concession request followed the next morning. The customer's engineer had the facts before anyone needed to ask for them, and the decision took a day.

The same principle applies to drawing feedback. A query raised during ballooning, before parts are made, costs the customer a few minutes. The same question raised after a batch has been made to a guess costs both parties far more.

## The error: an internal "use as is"

This is an illustration from an earlier job at the same shop, before the procedure in this chapter existed. A bracket with an oversize thread, like part 31, was found at final inspection. The production manager tried an M4 screw in the hole, found it held, and wrote "use as is" on the hold tag to meet the delivery date. The part shipped with the rest.

The customer's receiving inspection gauged a sample of threads, found the oversize one, and quarantined the whole delivery. The shop had to re-inspect every part at the customer's site, the delivery was a week late, and the customer asked for the shop's nonconformance procedure in writing before placing the next order.

The cause was not the worn tap; it was a disposition made by someone without the authority to make it. The shop's procedure now contains an authority table: the inspector may contain and record; the shop may rework to the drawing or scrap; only the customer may approve use as is or repair, by written concession. The production manager's signature on a hold tag no longer releases anything.

## Feeding problems back to the drawing

Some nonconformances are caused by the drawing, not by the process. A requirement that is ambiguous, unachievable, unmeasurable or in conflict with another produces queries, holds and concessions on every batch until the drawing changes. The inspector sees these problems first and is well placed to report them, but the drawing belongs to its design authority, and the inspector's job is to report the problem clearly, not to fix it.

This is an illustration. By the end of the batch, the bracket job had raised four points that the shop sent to the customer as a single drawing feedback note, each with the evidence behind it:

1. **The bore and anodising.** The bore's 0.015 mm tolerance applies after a coating that shrinks it by 0.010 to 0.015 mm, which leaves very little process margin. The shop asked whether the bore could be masked during anodising, and noted what that would change.
2. **The implied right angle.** The angle between the upright and the base was resolved by query; the shop suggested making it explicit.
3. **Texture after finishing.** Note 1 covers dimensions only; the query confirmed texture also applies after anodising. The shop suggested the note say so.
4. **The model's status.** The drawing does not say whether the STEP model is for reference.

```figure
type: steps
title: What happens when the customer issues revision D
caption: This is an illustration. The change reaches the shop as a new revision, and every document built from revision C is reviewed against it.
- Customer issues SB-2041 revision D | bore masked during anodising; angle, note 1 and model status clarified
- Order amended to revision D | the shop does not adopt it until the order changes
- Ballooned drawing updated | unchanged balloons keep their numbers; balloon 25 added for the angle
- Limits table and method sheet updated | bore now bare aluminium; texture measured on bare bore
- Set-up sheet updated | pre-anodising bore allowance removed
- *Partial first article | bore, its texture and its location re-inspected against revision D
```

Revision D is the payoff for the whole job. The next batch will start with fewer queries, a bore that no longer depends on coating growth, and a drawing that says what the customer meant. The shop's inspection work has improved the design, without the shop ever changing the design itself.

## Learning across batches

A single batch shows a few problems. The register of nonconformances over many batches shows patterns: a feature that is often held, a process that drifts in the same direction, a finisher whose coatings run thick. Reviewing the register every few months, by balloon and by cause, is how a small shop finds the problems worth fixing permanently. Keeping balloon numbers stable across revisions, as Chapter 2 recommended, is what makes that review possible.

## Exercise: decide the authority

A shop makes pump shafts to a customer's drawing. At final inspection, five shafts have a keyway 0.03 mm wider than its upper limit. The shop's machinist suggests fitting an oversize key, which the shop could supply. The production manager wants to ship on time. What may the inspector do, what may the shop do, and what must the customer decide? Draft the essential content of the concession request.

**Answer.** The inspector contains the five shafts, tags and records them, and checks whether other shafts from the same set-up are affected. The shop may scrap the shafts, or rework them if any rework could bring the keyway back within its limits, which it cannot, because the keyway is already too wide. Fitting an oversize key is a repair: the shaft would not conform to the drawing, and the assembly would use a non-standard key. Only the customer, as design authority, may approve it, by written concession. The request should state the drawing and revision, the five part identifiers, the keyway balloon, its limits and the measured widths with the method used, the cause as far as known, the proposed disposition with the oversize key's details, the corrective action, and a clear statement that the customer must judge the effect on function. Shipping on time is not a reason to ship nonconforming parts; it is a reason to send the request today.
