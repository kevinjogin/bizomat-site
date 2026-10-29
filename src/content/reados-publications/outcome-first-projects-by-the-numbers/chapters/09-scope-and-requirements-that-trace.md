---
book: outcome-first-projects-by-the-numbers
chapterSlug: scope-and-requirements-that-trace
order: 9
title: "Tracing every scope item and requirement to a target"
description: "Each scope item priced in A$ a year and failures removed; RFID and amenities trace to nothing; five requirements derived from targets; the ironer rate checked on the customer's mix."
draft: false
---

An option that passes all four targets as a package can still carry items that do nothing for them, and items whose contribution depends on a number nobody has checked. This chapter takes the options apart. It traces every scope item to the targets it moves, in dollars a year, failures removed, litres and megajoules per kilogram, and finds that two items in the owners' original request trace to nothing at all. It then derives the requirements that the chosen option's suppliers must meet from the same targets, and follows one of them back to where its key number came from, which is where the most expensive mistake in the project was waiting.

The method is the outcome-first sequence applied one level down. Chapter 5 derived targets from the purpose; here each requirement is derived from a target, and each scope item must earn its place against one.

## The scope test

This is an illustration. All amounts are Australian dollars excluding GST. The laundry's owners adopted a three-part test for every item in every option. An item stays in scope only if it does at least one of these things.

- **It moves a target**: it removes failed deliveries, lowers cost per clean kilogram, or reduces water or energy per kilogram, by an amount that can be estimated.
- **It enables an item that moves a target**: it is needed for another item to work, and goes if that item goes.
- **It meets a stated constraint**: a requirement that every option must satisfy whatever its effect on the targets, such as hygiene under AS 4146:2024, work health and safety law, or a condition of the hospital group's contract.

An item that does none of these may still be worth doing, but it is a separate decision with its own case, measured on its own terms. It does not ride inside a project justified by other benefits.

## Tracing Option B item by item

Each item's net annual cost is its capital charge (8% over 12 years for plant) plus any running costs it adds, less the savings it brings. Its effect on delivery comes from the removal shares of Chapter 7, and its effect on water and energy from the wash, dry and iron model of [Working back from the gap to its causes](/reados/publications/outcome-first-projects-by-the-numbers/where-the-gap-comes-from/).

Take the ironer line, item I. Its capital charge on A$1,250,000 is A$165,869 a year. It removes six feeding and folding roles and the peak-day overtime, seven full-time equivalents at A$68,000, a saving of A$476,000. It saves A$90,000 of line 1 maintenance but adds a A$40,000 maintenance contract, a net A$50,000. Its better insulated rolls cut ironing gas from 1.1 to about 0.98 MJ/kg, worth about A$10,090 a year, while its drives add about A$8,424 of electricity. The net is 165,869 − 476,000 − 50,000 − 10,090 + 8,424 = **−A$361,797 a year**, a saving. It removes 95% of the 157 backlog failures and 85% of the 74 breakdown failures: 149.15 + 62.9 = 212.05 per 26 weeks, shown as 212.1.

```figure
type: compare
title: Option B traced to the targets, item by item
cols: Capex | Net annual cost | Failures removed per 26 weeks | Water, L/kg | Energy, MJ/kg
caption: This is an illustration. Negative cost is a saving. Items are attributed in the order I, F, S, X, W, H, C. Every item moves at least one target; the sums equal the option's totals.
- I New ironer line | A$1,250,000 | −A$361,797 | 212.1 | | −0.079
- F Towel folder | A$160,000 | −A$46,769 | | |
- S Dispatch changes | A$140,000 | +A$171,577 | 96.2 | |
- X Three efficient washers | A$360,000 | −A$4,353 | | −1.688 | −0.289
- W Rinse-water reuse | A$320,000 | −A$639 | | −2.709 |
- H Heat recovery | A$210,000 | −A$36,671 | | | −0.739
- C Customer agreement | A$0 | +A$12,000 | 19.8 | |
- * Option B total | A$2,440,000 | −A$266,653 | 328.1 | −4.396 | −1.108
```

The sums agree with the option-level model of Chapter 8: A$266,653 a year below the baseline, water from 14.0 to 9.604 L/kg, energy from 6.00 to 4.892 MJ/kg. Failures removed add to 328.05, shown as 328.1, which leaves 83.95 of the 412, the 84.0 reported in Chapters 7 and 8.

Two items cost money rather than saving it. The dispatch changes, S, add A$171,577 a year, and the customer agreement A$12,000. Both pass the scope test on delivery alone, and the trace shows the price of each failure they remove, which is the right way to judge them. The towel folder, F, moves only cost, and only because it replaces one role; if the laundry could not or would not change that role, F would trace to nothing and should go.

## Why the order of attribution matters

When items interact, the credit each receives depends on the order in which they are counted. The water items are the clearest case. Rinse reuse, W, saves 22% of whatever water the washers use. The efficient washers, X, reduce how much water there is to save.

Counted in the order used above, X first, X takes water from 14.0 to 12.3125 L/kg, a cut of 1.688, and W then saves 22% of 12.3125, a further 2.709. Counted the other way, W first saves 22% of 14.0, 3.080 L/kg, and X then saves only 1.316. The pair's combined effect is identical either way, 4.396 L/kg and a saving of about A$4,992 a year. But X's own line changes from a saving of A$4,353 to a cost of about A$1,554, because in the second order most of its water saving has already been credited to W.

The lesson is not that one order is right. It is that interacting items should be judged together when they are counted separately. Had X been reviewed on its own, last in the queue, it would have looked like an item that costs money, and it might have been cut. Without X, rinse reuse alone takes water only to 14.0 × 0.78 = 10.92 L/kg, and heat recovery takes energy only to about 5.08 MJ/kg: the option would fail both sustainability thresholds. The laundry's rule is to state the order of attribution on every trace and to test the removal of any interacting item against the whole option, not against its own line.

## Tracing the owners' request

Option A traces very differently.

```figure
type: bars
title: Option A's scope items by net annual cost
unit: A$ a year
caption: This is an illustration. Only the tunnel moves a target, removing 33.3 failures per 26 weeks. The extension only houses the tunnel. RFID and amenities trace to no target. Net total +A$183,778 a year.
- T Tunnel washer, press and shuttle | −168125 | 33.3 failures removed; water and energy
- D Three gas dryers | 26865 | energy only
- E Building extension | 209886 | enables T only
- * R RFID linen tracking | 91732 | traces to no target
- * M Amenities and office | 23420 | traces to no target
```

The tunnel, T, does save money on its own line, A$168,125 a year, because it replaces six wash-room roles and uses far less water and gas. But it cannot be installed without the extension, E, which adds A$209,886 a year. Together they cost a net A$41,761 a year more than today, and remove 33.3 of the 412 failures.

RFID linen tracking, R, costs A$420,000 of capital and, with its A$36,000 subscription, A$91,732 a year. It might reduce linen losses or help settle disputes with customers, but neither is one of the four targets, and the delivery analysis found no failures caused by lost linen. Amenities and office refurbishment, M, costs A$250,000. Staff facilities may be worth improving, and may even be required, but that is a matter for its own decision, judged on workplace needs and law, not carried inside a plant project. Between them R and M are **A$670,000** of capital and A$115,152 a year that trace to no target. Under the scope test both left the project and became separate decisions for the owners.

## Requirements derived from the targets

A requirement states what a supplier, an installation or a process must achieve, in terms that can be tested. In an outcome-first project each requirement is derived from a target, so that meeting the requirement contributes to meeting the target. The laundry's five main requirements for Option B are these.

```figure
type: compare
title: Option B's requirements and the targets they trace to
cols: Requirement | Traces to | Verified by
caption: This is an illustration. Every requirement names its target and its test. R4 carries a constraint, hygiene to AS 4146:2024, that applies whatever the effect on water.
- R1 | Effective flatwork capacity at least 599.0 kg/h, the year-5 peak | OTIF, via the 157 backlog failures | rate demonstrated at acceptance
- R2 | New line availability at least 95% over the 8 weeks after acceptance | OTIF, via the 74 breakdown failures | downtime log
- R3 | Hospital vans loaded by 04:45, hotel vans by 08:00 | OTIF, via the 111 dispatch failures | daily loading times
- R4 | Water at most 10.0 L/kg monthly, rewash at most 4%, hygiene to AS 4146:2024 | water target; hygiene as a constraint | meters, rewash log, hygiene audit
- R5 | Energy at most 5.0 MJ/kg on the reporting-period average, season-adjusted for comparison | energy target | gas and electricity meters
```

Three features of the list are deliberate. First, each requirement is stated in the same unit and over the same period as the target it serves, so that a supplier who meets it has contributed something the tender will see. R2's 8-week window, for example, runs from acceptance in month 5 into the first weeks of the evidence window, when a breakdown costs the most.

Second, R3 is a requirement on a business change, not on equipment. Nobody can buy a loading time. The dispatch supervisor set 04:45 and 08:00 from the run times in the new routing software, leaving a buffer before the 06:00 and 10:00 cut-offs, and the requirement is met only when the dock crew works to the plan every day. Writing it down puts the business change on the same footing as the ironer line: it has a measure, an owner and a test.

Third, R4 and R5 carry guards. A water target can be met by cutting rinses, which is the kind of gaming Chapter 3 warned about: water per kilogram falls while linen comes back dirty, rewash rises, and the hospital group's hygiene audit fails. R4 therefore requires the rewash rate to stay at or below 4% and hygiene to meet AS 4146:2024, the Australian Standard for handling, laundering, transporting and storing clean and soiled textiles in commercial, hospital and other laundries. R5 states its averaging period because energy per kilogram rises in winter, when incoming water is colder, and a single cold month can exceed 5.0 MJ/kg while the period average is well within it. [Holding acceptance and benefit tracking to the outcome](/reados/publications/outcome-first-projects-by-the-numbers/holding-delivery-to-the-outcome/) shows what happens when that adjustment is forgotten.

R1 shows how the derivation works. The delivery target allows 93 failures, and the option's estimates leave 7.9 from peak-day backlog, which assumes the ironers can keep up with a peak day. Today's peak-day need is 516.7 kg/h; with volume growing at 3% a year and the tunnel decision expected in year 4, the owners set the design horizon at year 5, when the peak reaches 516.7 × 1.03⁵ = **599.0 kg/h**. Line 2 supplies 229.5 kg/h, so the new line must supply at least 369.5 kg/h effective. At the availability of 0.95 in R2 and a performance of 0.88, that needs a nominal rate of about 442 kg/h.

```figure
type: tree
title: R1 derived from the delivery target
caption: This is an illustration. Each level answers "what must be true for the level above to hold?". The vendor's quoted rate enters only at the bottom, where it can be checked against the number the target needs.
- Target: OTIF at least 98% over the evidence window | at most 93 failures in 4,680 deliveries
  - Backlog failures held to about 7.9 per 26 weeks | 95% of today's 157 removed
    - Ironers keep up with the peak day through year 5 | 516.7 × 1.03⁵ = 599.0 kg/h
      - * R1: effective flatwork capacity at least 599.0 kg/h | line 2 gives 229.5 kg/h
        - New line at least 369.5 kg/h effective | at 0.95 × 0.88, nominal about 442 kg/h
          - Vendor's quoted nominal rate | 650 kg/h, giving 543.4 kg/h effective and 772.9 kg/h in total
```

At the quoted 650 kg/h the new line gives 650 × 0.95 × 0.88 = 543.4 kg/h effective, and with line 2 the total is 772.9 kg/h, **29.0% above** the year-5 peak. On paper the margin was generous.

## Tracing backwards as well as forwards

Gotel and Finkelstein (1994), from empirical work with more than 100 practitioners, distinguished two kinds of requirements traceability. **Post-specification** traceability follows a requirement forwards, into design, build and test. **Pre-specification** traceability follows it backwards, to where it came from: the person, the decision or the source that produced it. They found that most of the problems attributed to poor traceability came from the second kind. Requirements could be followed into tests, but not back to their origins, so nobody could tell when an origin was wrong.

ISO/IEC/IEEE 29148:2018 is the international standard for requirements engineering processes in systems and software, and the information items they produce; it treats traceability as a property of a well-formed set of requirements. [Requirements that can be traced and tested](/reados/collections/project-planning-and-control/requirements-that-can-be-traced-and-tested/) covers how to write such requirements. The laundry's case shows why the backward trace deserves as much attention as the forward one.

## The error: a rate measured on someone else's linen

This is an illustration. The ironer vendor's proposal quoted 650 kg/h, and R1's first draft accepted it. During the review of the requirements, the finance manager asked the question pre-specification traceability asks: where did 650 come from? The answer, from the vendor's application engineer, was a demonstration run on hotel queen sheets, large, flat, uniform items that feed quickly. The hospital group's linen is a different mix: smaller items, drawsheets, pillowcases and theatre linen, with more handling per kilogram.

The vendor ran a second demonstration on a sample of the hospital mix, and the line achieved **540 kg/h**, 16.9% below the quoted rate. At 540 kg/h the new line delivers 540 × 0.95 × 0.88 = **451.4 kg/h** effective, and the total with line 2 is 451.4 + 229.5 = **680.9 kg/h**. That still meets R1, but the margin over the year-5 peak falls from 29.0% to **13.7%**. And if line 2 were down on a peak day, the new line alone would be 12.6% short of today's 516.7 kg/h.

```figure
type: compare
title: The new line's rate: vendor's quote against the customer's mix
cols: Vendor's quote | Hospital mix, demonstrated
caption: This is an illustration. The requirement is still met, but less than half of the apparent margin is real. Had the line been bought on the quoted rate and accepted on hotel sheets, the shortfall would have appeared in the evidence window.
- Nominal rate | 650 kg/h, hotel queen sheets | 540 kg/h, hospital mix
- Effective rate at 0.95 × 0.88 | 543.4 kg/h | 451.4 kg/h
- With line 2 (229.5 kg/h) | 772.9 kg/h | 680.9 kg/h
- * Margin over year-5 peak of 599.0 kg/h | 29.0% | 13.7%
```

The error was found before the order was placed, at no cost but a day's demonstration. Found at acceptance, it would have left the laundry arguing about a contract that promised 650 kg/h without saying on what. R1 was rewritten as "**540 kg/h demonstrated on the customer's mix at acceptance**", with the mix defined from the hospital dockets, and the rate became a condition of payment. [How contracts shape behaviour](/reados/publications/project-teams-and-contracts-by-the-numbers/how-contracts-shape-behaviour/) in *Project Teams and Contracts by the Numbers* explains why such a risk is best carried by the party that controls it, here the vendor, and what that costs. How long the acceptance run must be, and how many repeat runs give a confident average, is the subject of [Measured performance: sample sizes for means and comparisons](/reados/publications/prototypes-and-simulation-by-the-numbers/measured-performance-and-sample-size/) in *Prototypes and Simulation by the Numbers*.

## Exercise: availability on the hospital mix

At acceptance on the hospital mix, the new line demonstrates 540 kg/h, but over the first weeks its availability turns out to be 0.92 rather than the 0.95 in R2. Performance stays at 0.88. Does the ironer capacity still meet R1, and with what margin?

**Worked answer.** The new line's effective rate is 540 × 0.92 × 0.88 = **437.2 kg/h**. With line 2's 229.5 kg/h the total is **666.7 kg/h**, against R1's 599.0 kg/h, a margin of **11.3%**. R1 still holds. R2 does not: 0.92 is below the 95% availability required over the 8 weeks after acceptance, so the vendor must correct the cause, and the laundry should not accept the line as complete until it does. The two requirements do different jobs. R1 protects the delivery target over five years of growth; R2 protects it in the evidence window, when every breakdown failure counts against the 93.
