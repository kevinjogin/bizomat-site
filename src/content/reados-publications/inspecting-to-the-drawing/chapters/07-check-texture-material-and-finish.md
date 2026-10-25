---
book: inspecting-to-the-drawing
chapterSlug: check-texture-material-and-finish
order: 7
title: "Check surface texture, material and finish"
description: "Verify surface texture with the right instrument settings, trace material from certificate to part, check a coating, and allow for what a finish does to dimensions."
draft: false
---

Dimensions get most of an inspector's attention because they are measured on the bench, one balloon at a time. The requirements in this chapter are different. Surface texture needs a specialised instrument and settings the drawing may not spell out. Material cannot be measured at all with workshop tools; it is verified through documents and traceability. A finish is applied by someone else, often off site, and it changes the part it covers.

These are also the requirements most often missing from inspection records, as the trainee's first balloon list in Chapter 2 showed. On the bracket, one of them, the anodise, turned a set of passing dimensions into a rejected part. This chapter works through texture, material and finish for the bracket and follows that failure from cause to correction.

## Surface texture

The bracket carries two texture requirements: Ra 0.8 µm in the sensor bore, balloon 13, and Ra 3.2 µm on all other surfaces under note 4, balloon 24. Ra is the arithmetic mean of the profile's deviations from its mean line over the evaluation length, measured after filtering out waviness and form. It is a useful summary, and it is easy to misuse.

### Measuring Ra

Ra is measured with a stylus instrument, a profilometer, that draws a fine diamond tip across the surface and records its height. The result depends on settings: the cut-off wavelength of the filter that separates roughness from waviness, the evaluation length, and the stylus tip radius. The drawing may state the cut-off beside the symbol; if it does not, the surface texture standard the drawing follows gives a default that depends on the expected roughness. The chapter on [surface texture symbols](/reados/publications/drawings-that-make-parts/surface-texture/) in *Drawings That Make Parts* covers how the drawing states these, and why a different cut-off can change a result.

Three practical rules cover most shop measurement.

1. **Measure across the lay.** Machined surfaces have a direction, the lay, left by the tool. Measuring along the lay can read much smoother than across it. The drawing may specify the lay; if not, measure in the direction that gives the largest value, which is usually across the tool marks.
2. **Take several traces.** One trace is one sample. Take readings at several places on the surface and apply the drawing's or standard's rule for how many may exceed the limit.
3. **Check the instrument with its reference specimen** before the session, and record that check.

### The short bore

The sensor bore is 10 mm in diameter and only 8 mm long. A standard profilometer pickup may not fit inside it, and the evaluation length the standard requires, plus the run-up and run-out the instrument needs, may not fit within 8 mm. This is a measurement problem, not a reason to skip the requirement.

This is an illustration. The shop's profilometer has a small-bore pickup that enters the bore, and with the default cut-off for the expected roughness the full traverse just fits within the bore length. The inspector records three traces at 120° intervals. Had it not fitted, the options would have been to measure a replica of the surface made with a casting compound, to measure a witness bore machined in the same set-up in the same material, or to ask the customer to accept a shorter evaluation length. Each needs to be agreed and recorded, not improvised.

### Comparison specimens

Roughness comparison specimens, small blocks machined to known Ra values, let an inspector compare a surface by sight and fingernail. They are good for screening the Ra 3.2 surfaces, where the margin is wide and the process reliably produces something smoother. They are not adequate for the Ra 0.8 bore, and a record that says "Ra 0.8: conforms by comparison" claims more than the method can support.

### Before or after finishing?

Note 1 says dimensions apply after anodising. Does texture? Anodising changes surface texture, sometimes making a fine machined surface slightly rougher. The note mentions dimensions only. This is an illustration: the inspector raises a query, and the customer confirms that texture also applies after anodising. The query becomes part of the record, and the texture traces are taken on finished parts.

## Material

Balloon 19 requires 6061-T6 aluminium alloy plate. The inspector cannot verify an alloy with a caliper. Verification rests on a chain of documents and markings that connects the bracket in the inspector's hand to a test made at the mill.

```figure
type: steps
title: The traceability chain for the bracket's material
caption: This is an illustration. A break anywhere in the chain means the certificate no longer proves anything about the part.
- Mill certificate | alloy, temper, product form, size, lot number, test results
- Plate as received | lot number marked on the plate, checked against the certificate at goods-in
- Blanks cut from the plate | each batch of blanks tagged with the plate's lot number
- Job traveller | records the lot number for this batch of brackets
- *Finished bracket | batch number marked under note 3 links back to the traveller
```

At goods-in, the receiver checks that the certificate states the alloy and temper ordered, the product form (plate, not bar or extrusion), a size that covers the plate received, and a lot or heat number that matches the marking on the plate. A certificate that says "6061" without the temper, or that covers a different thickness, does not support balloon 19.

Certificates come in different kinds. EN 10204, widely used for metallic products, distinguishes documents by who issues them and whether the results are from the actual product or from typical production; the 3.1 inspection certificate, issued by the manufacturer's authorised inspection representative independent of manufacturing, is commonly requested for engineering parts. Check what the customer's order requires and whether the certificate received is that kind.

The certificate describes the mill's lot, not the shop's parts. The traceability chain is what extends it to them. When offcuts from different plates share a rack, the chain breaks easily; offcuts are marked with their lot before they are put away, or they are not used for certified work.

Some shops add a physical check. Hardness or electrical conductivity measurements can distinguish some tempers and alloys of aluminium, and are sometimes required by customers for heat-treated parts. They are confirmation, not substitutes for the certificate, and the acceptance values come from the customer or the relevant specification, not from memory.

## Finish

Balloon 20 requires clear anodise to the customer's finish specification, which, as Chapter 2 found, adds a coating thickness of 10 to 15 µm, a finisher's certificate for each lot and no rack marks on datum A.

Coating thickness on anodised aluminium is commonly measured with an eddy-current gauge, a method standardised in ISO 2360 for non-conductive coatings on non-magnetic conductive metals. The gauge is checked on uncoated material of the same alloy and on calibration foils before use. It needs a flat or gently curved area larger than its probe, so it measures the bracket's outside faces, not the inside of the bore.

This is an illustration. The inspector takes five readings on each of three faces of the first article bracket and records a mean of 12 µm, with all readings between 11 and 13 µm. The finisher's certificate states the specification and the lot. A visual check of datum A finds no rack marks; the finisher racked the parts by the M4 holes, as the purchase order to the finisher instructed.

### What a finish does to size

Anodising converts the aluminium surface into oxide. The coating grows partly into the original metal and partly outward from it, so the finished surface stands proud of the machined one. On an outside dimension the part gets bigger; in a bore, it gets smaller, by twice the outward growth because there are two walls.

This is an illustration. The finisher's process sheet states that, for this process, about half the coating thickness builds above the original surface. Real growth depends on the alloy and the process; ask the finisher for figures for the specific process and alloy, in writing.

```figure
type: formula
title: Bore size after anodising
caption: This is an illustration. The growth figure comes from the finisher's process sheet; the arithmetic shows why the bore target must allow for it.
formula: bore after = bore before − 2 × (coating × outward fraction)
- coating | 12 µm measured on the first article
- outward fraction | about one half, from the finisher
step: Growth per wall = 0.012 × 0.5 = 0.006 mm
step: Bore machined at 10.008 becomes 10.008 − 2 × 0.006 = 9.996 mm
step: Lower limit is 10.000: the anodised bore is 0.004 mm undersize
```

## The error: a bore that passed before anodising

This is an illustration, and it is the failure Chapter 2 introduced. The first article bracket was machined with the bore aimed at 10.008, near the middle of the 10.000 to 10.015 band, because the machining set-up sheet did not mention the anodise. Measured before finishing, the bore read 10.008 and passed. Because the trainee's balloon list had no line for note 1, nobody planned a second measurement after anodising.

When the reconciled list added balloons 19 to 24, the inspector re-measured the anodised bracket. The bore read 9.996 mm, 0.004 below the lower limit, and the GO plug at 10.000 would not enter. The part was nonconforming.

The cause was not the finisher and not the machinist. It was a requirement, note 1, that had not reached the machining set-up. The corrections were:

- **Inspection:** dimensions are now measured after anodising for acceptance, as note 1 requires. Pre-anodising measurement continues as a process check, recorded separately.
- **Machining:** the set-up sheet now carries a pre-anodising bore target of 10.024 mm, with in-process limits of 10.020 to 10.028. With growth of 0.010 to 0.015 mm on the diameter across the permitted coating range, 10.024 lands between 10.009 and 10.014 after anodising. Chapter 6 later trimmed the target to 10.022.
- **Drawing feedback:** the shop asked the customer whether the bore could be masked during anodising, which would remove the growth from a tight feature altogether. That question is a design change, and Chapter 9 follows it.

```figure
type: range
title: Bore before and after anodising, original and corrected targets
caption: This is an illustration. The original target ignored coating growth; the corrected target allows for growth across the whole permitted coating range.
min: 9.990
max: 10.030
unit: mm
ticks: 9.990 | 10.010 | 10.030
- Drawing limits, after anodising | 10.000 | 10.015
- *Original: machined 10.008, after | 9.993 | 9.998 | growth 0.010 to 0.015; undersize
- Corrected target, before | 10.024 | 10.024 | in-process limits 10.020 to 10.028
- Corrected target, after | 10.009 | 10.014 | inside limits across the coating range
```

The first article bracket could not be reworked: opening the bore would cut through the coating, and stripping and re-anodising would remove metal from every surface. It was scrapped, and a new first article was made.

## Reading a certificate properly

Certificates are evidence only if someone reads them against the requirement. A certificate filed unread is a piece of paper. At goods-in and again at final inspection, the inspector checks each certificate line by line.

- **Identity.** Does it name this part number, this lot or this order? A finisher's certificate for "aluminium brackets" with no part number or lot does not identify anything.
- **Specification.** Does it state the specification the drawing or order calls up, including any class, type or grade? "Clear anodise" is not the same as "clear anodise to the customer's specification".
- **Results.** Where the certificate reports measured values, such as coating thickness or a mill's tensile results, are they within the specification's limits? Certificates sometimes report out-of-limit values that nobody noticed.
- **Quantity and date.** Does the quantity cover the parts received, and is the date consistent with when the parts were processed?
- **Authority.** Is it signed or otherwise authorised by the issuer in the way the customer requires?

Faults found at this point are cheap to fix: a phone call to the finisher or the material supplier usually produces a corrected certificate within a day. Found by the customer after delivery, the same fault can quarantine a batch.

This is an illustration. The finisher's first certificate for the bracket lot named the customer's specification but gave the coating thickness only as "in tolerance". The inspector asked for the measured values, the finisher supplied a revised certificate showing a range of 11 to 14 µm, and the revised certificate went into the record.

## A finish is a special process

A finish like anodising is often called a special process: its result cannot be fully verified by inspecting the finished part, so confidence comes from controlling the process. An inspector can measure coating thickness on an outside face but cannot check its adhesion, sealing or uniformity inside every hole without destroying the part.

That is why the finisher's certificate matters, why the customer's specification asks for it, and why many customers require finishers to be approved. The inspector checks what can be checked, coating thickness, appearance and the absence of rack marks, and verifies the rest through the certificate and the finisher's approval status. The record names the finisher, the lot and the certificate number.

## Exercise: zinc-plated threads

A steel bracket has an M8-6H tapped hole and a note: "Zinc plate 8 to 12 µm. Dimensions apply after plating." A plating supplier states that zinc electroplate builds up on the surface by its full thickness. The tapped holes are made with a standard 6H tap and checked with a 6H GO gauge before plating. What happens after plating, and what should the inspection plan say?

**Answer.** Electroplate that builds outward by its full thickness reduces the internal thread's effective size. On a thread the effect on the flanks is larger than the coating thickness, because the coating sits on inclined flanks, so a hole that just passes the GO gauge before plating can refuse it after. The inspection plan should measure the threads with the GO and NO-GO gauges after plating, as the note requires, and the machining plan should either tap oversize with a tap selected for plating allowance, or the threads should be masked if the customer allows. The plating supplier's figures should be obtained for the specific process, and the first article should prove the chosen approach by gauging plated threads, not unplated ones.
