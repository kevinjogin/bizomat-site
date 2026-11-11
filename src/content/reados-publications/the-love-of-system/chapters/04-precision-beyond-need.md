---
book: the-love-of-system
chapterSlug: precision-beyond-need
order: 4
title: "Precision beyond need: the measuring machine that keeps better time"
description: "Smith's watch in a quality room: how an uncertainty budget shows when a more precise instrument changes no decisions, when it still falls short, and what humbler measures actually serve the end."
draft: false
---

Smith's watch collector paid many times over for a watch that kept better time, and was no more punctual for it. Every quality room has a version of that watch. A more precise instrument is easy to want, because precision is admirable in itself, and because a better number on a specification sheet feels like a better quality system. Whether it changes any decision the business makes is a separate question, and usually the one nobody asks.

This chapter takes the sales representative's offer to upgrade the job shop's coordinate measuring machine and tests it with a measurement uncertainty budget. The result is a double surprise: the upgrade is more precise than the shop needs for most of its work, and still not precise enough for the work where precision matters. The chapter then shows the humbler measures that serve the end.

## The offer

This is an illustration. The shop's coordinate measuring machine, or CMM, is about eight years old and in good order. A sales representative offers an upgrade at **A$95,000** excluding GST: a new scanning probe, new software and a recalibration that together roughly halve the machine's calibration uncertainty, refine its resolution and improve its repeatability. The brochure shows readings to a tenth of a micron.

The owner is tempted. Two customers have recently tightened their tolerances, and a better CMM sounds like the obvious response. Applying the test from Chapter 1, he first names the end: **reliable accept-or-reject decisions on the parts the shop makes**, especially the tighter ones. Then he asks how much the upgrade would change those decisions.

## The uncertainty budget

The [measurement uncertainty budget tool](/tools/measurement-uncertainty-budget/) in BIZOMAT Tools builds an uncertainty budget for a dimensional measurement. It takes standard uncertainties from the gauge's calibration certificate, its display resolution, the repeatability of repeat readings, an Abbe error from any offset and tilt, and the uncertainty in the part's temperature, combines them by root-sum-square, expands the result with a coverage factor, and compares it with the tolerance band as a test uncertainty ratio. It also gives guard-banded acceptance limits inside the tolerance, and names the largest contributor. The method follows the general approach of the international guide to the expression of uncertainty in measurement.

The shop's acceptance rule is that the test uncertainty ratio, the tolerance band divided by twice the expanded uncertainty, should be at least **4** for a measurement to be relied on.

For the current CMM, the owner enters a calibration uncertainty of 2.5 µm at k = 2, a resolution of 0.5 µm, a repeatability of 1.2 µm, no Abbe offset, a measured length of 100 mm on steel at 11.5 µm/m·K, and a part temperature uncertainty of ±0.5 K in the temperature-controlled measuring room. For the upgraded CMM, he enters the representative's figures: 1.0 µm calibration uncertainty, 0.1 µm resolution and 0.6 µm repeatability, with the same temperature.

He runs both against the two kinds of tolerance the shop sees: the typical ±25 µm of most turned and milled features, a 50 µm band, and the ±5 µm, a 10 µm band, of the bearing seats two customers now call for.

```figure
type: compare
title: Current and upgraded CMM against two tolerances
cols: Expanded uncertainty | Ratio, ±25 µm parts | Ratio, ±5 µm parts | Largest contributor
caption: This is an illustration. Results from the measurement uncertainty budget tool at k = 2 with the part at ±0.5 K. The shop requires a test uncertainty ratio of at least 4. The upgrade doubles the ratio where it is already ample and leaves it short where it is not.
- Current CMM | 3.54 µm | 7.06 | 1.41 | Calibration
- *Upgraded CMM, A$95,000 | 1.70 µm | 14.72 | 2.94 | Repeatability
```

The two columns tell the whole story.

- **For ±25 µm parts**, the current CMM already gives a ratio of **7.06**, comfortably above 4. The upgrade raises it to **14.72**. Both are capable. The upgrade changes the guard-banded acceptance limits only slightly, from ±21.5 µm to ±23.3 µm of mid-tolerance, which matters only for the small number of parts that fall in that narrow strip near the limits.
- **For ±5 µm parts**, the current CMM gives **1.41**, far below 4: it cannot reliably decide whether these parts conform. The upgrade improves the ratio to **2.94**, still below 4. Even after spending A$95,000, the shop would not be able to accept the tight bearing seats with the confidence it requires.

The upgrade is Smith's watch, twice over. Where the shop already keeps good enough time, it keeps better time to no purpose. Where the shop is late, it is still late.

## What limits the tight measurements

The budget also shows why the upgrade falls short. After the upgrade, the largest contributor is **repeatability**, followed by calibration and then **temperature**, which grows to about 15% of the total once the machine itself improves. On a ±5 µm feature, a fraction of a micron of thermal growth in the part matters, and so does the scatter of the probe's contact on a particular surface.

Neither can be fixed by a finer display. The resolution of 0.1 µm, the feature the brochure emphasised, contributes almost nothing to the budget. This is the clearest sign of precision admired for its own sake: the number that impresses is the one that matters least.

## The failure case: the indicator that read to a tenth

The shop has met this before. Several years ago, for an earlier job with a tight bore, it bought a digital bore gauge with a display reading to 0.1 µm. Operators liked it; the display was clear and steady. But first-off readings on the same bore varied by 3 to 4 µm across a day, and the customer rejected a batch that the shop had measured as conforming.

The cause was temperature. Parts came off the lathe warm and were measured within minutes, while the setting master sat at room temperature. The display's resolution had nothing to do with the problem; the part's temperature had everything to do with it.

The uncertainty budget tool shows the size of the effect. With the current CMM's other figures, a part temperature uncertainty of **±2 K**, typical of a part measured soon after machining, raises the expanded uncertainty to **4.38 µm**. The test ratio for ±5 µm parts falls to **1.14**, and temperature becomes the largest contributor at about 37% of the budget. Even for ±25 µm parts, the ratio falls from 7.06 to 5.71.

### How it is detected

An uncertainty budget detects it, before purchase rather than after a rejection. Listing every contributor and its size shows immediately whether resolution, the feature most often sold, is a meaningful part of the total. In the shop's case it never is.

### How it is corrected

The correction was a procedure, not an instrument: tight features are measured only after the part has soaked at the measuring room's temperature, with the master stored beside the part. That one rule brought the bore readings into agreement with the customer's.

## A humbler instrument for the tight work

With the end named, the question for the bearing seats becomes: what measures a ±5 µm bore reliably? For a feature measured in quantity, the usual answer is comparative gauging: an air gauge or a dedicated bore gauge set against a calibrated master of the same nominal size and material, used in the measuring room after the part has soaked.

Comparative gauging works because it measures the small difference from a master rather than an absolute size, which removes most of the instrument's own errors, and because a master of the same material at the same temperature cancels most of the thermal effect. The owner models an air gauge with a calibrated master: a master calibration uncertainty of 0.6 µm at k = 2, resolution 0.1 µm, repeatability 0.2 µm, a 30 mm bore, and a temperature difference between part and master of no more than ±0.1 K. The tool gives an expanded uncertainty of **0.72 µm** and a test ratio of **6.9** for the ±5 µm tolerance: capable, with guard-banded acceptance at ±4.3 µm.

```figure
type: bars
title: Test uncertainty ratio on a ±5 µm bearing seat
unit: ratio
max: 8
caption: This is an illustration. Results from the measurement uncertainty budget tool. The shop requires 4. Only the comparative gauge set against a master, used after soaking, meets it.
- Current CMM, part soaked | 1.41
- Current CMM, part measured warm | 1.14
- Upgraded CMM, part soaked | 2.94
- *Air gauge with master, part soaked | 6.9
```

The air gauge and two masters are quoted at about **A$9,500** excluding GST, about a tenth of the CMM upgrade. It measures only one kind of feature, which is the opposite of the CMM's appeal, and it is exactly what the end requires.

## How many parts are at stake

The test also asks for realistic use. The owner counts the parts with ±5 µm features made last year: about **600** bearing-seat parts for the two customers concerned, out of tens of thousands of parts in total. Most of the shop's measuring work is at ±25 µm or wider, where the current CMM is already capable. An A$95,000 upgrade would have bought a better ratio on work that did not need it, and a still inadequate ratio on 600 parts that did.

For those 600 parts, the air gauge serves the end. For the rest, the existing CMM serves it. If the tight work grows, or if the shop starts making many different tight features that a dedicated gauge cannot cover, the CMM upgrade, or a better-controlled measuring room, may become the right choice, and the uncertainty budget will show when.

## What the representative was right about

Rejecting the upgrade as an instrument does not mean every part of the offer was without value. The new software would make measuring programs faster to write, and Chapter 2's log showed that first-off parts from the lathe wait about two hours a week at the CMM, partly while a program is written. That waiting is at the constraint, so it has a real price: up to two hours a week of lathe time at A$101 an hour, about A$9,700 a year if all of it could be recovered.

The owner asks the representative whether the software can be bought without the probe and recalibration. It can, for a small fraction of the full price. The shop also starts preparing measuring programs before each lathe job begins, which costs nothing. Separating the parts of an offer, and pricing each against the end it serves, often finds a modest purchase hidden inside an extravagant one.

## Ask whether the tolerance is needed

There is one more question to ask before buying precision: does the customer actually need it? Tolerances are sometimes tightened by habit, by a drawing template, or by a designer unsure of the function. The owner calls the two customers who tightened their bearing seats to ±5 µm and asks what the seats do and what fit the bearing requires.

One customer confirms the tolerance: the seat carries a precision bearing in a high-speed pump, and the fit is critical. The other admits the tolerance came from a new drawing standard applied to every bearing seat, whatever its duty, and agrees to relax it to ±12 µm for its slow-running conveyor shafts, which the current CMM measures with a ratio of about 3.4 when soaked; the customer accepts the shop's air gauge results instead. The cheapest precision is the precision nobody needs. Asking about function is part of naming the end.

## Precision in data as well as in instruments

The same pattern appears outside the quality room. The scheduling and monitoring system proposed in Chapter 1 promises machine status updated every few seconds. The shop's scheduling decisions are made once a day, at the morning meeting, and capacity decisions once a week. Data refreshed every few seconds is more precise than any decision that uses it. Like the instrument's resolution, it is the most impressive feature and the one that matters least. Chapter 5 takes this up.

```figure
type: checklist
title: Before buying more precision
caption: This is an illustration. The owner's checklist after the CMM review. The open item depends on the customers' future tolerances.
- x Name the decision the measurement supports and its tolerance
- x Build an uncertainty budget for the current method and the proposed one
- x Check whether the proposal changes any accept or reject decision
- x Find the largest contributor; check that the proposal addresses it
- x Count the parts that actually need the extra precision
- ? Review if tight work grows beyond what a dedicated gauge covers
```

## Exercise: a warm-part rule for the ±25 µm work

The production supervisor asks whether the soaking rule is needed for ordinary ±25 µm work too, because waiting for parts to cool slows first-off approval at the lathe, the constraint. Using the uncertainty budget results above, what is the current CMM's test ratio for ±25 µm parts measured warm at ±2 K, and what do you recommend?

**Worked answer.** With the part at ±2 K, the tool gives an expanded uncertainty of **4.38 µm** and a test ratio of **5.71** for the 50 µm band, against 7.06 when the part has soaked. Both are above the shop's minimum of 4, so warm measurement of ±25 µm features is still capable, and the guard-banded acceptance limits narrow only from ±21.5 µm to ±20.6 µm.

The recommendation is to keep the soaking rule for tight features, where it is essential, and to relax it for ±25 µm first-off checks, with the narrower guard band applied when parts are measured warm. That shortens first-off waiting at the lathe, which Chapter 2 identified as lost constraint time, without weakening any acceptance decision. It is a small example of the book's theme: the right precision is the one the decision needs, applied where the decision is made. The [Accept or Reject by the Numbers chapter on guard bands and the cost of errors](/reados/publications/accept-or-reject-by-the-numbers/guard-bands-and-the-cost-of-errors/) covers setting guard bands in more depth.
