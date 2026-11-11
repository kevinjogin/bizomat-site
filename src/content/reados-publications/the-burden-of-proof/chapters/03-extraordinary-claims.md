---
book: the-burden-of-proof
chapterSlug: extraordinary-claims
order: 3
title: "Extraordinary claims: physical limits, prior plausibility and the conditions behind a number"
description: "How to test a performance claim against the physical limit, then against its plausibility before any data, and why the likeliest explanation of a remarkable figure is its test conditions."
draft: false
---

Some claims are ordinary. A drive saves energy by slowing a pump; nobody doubts the principle, only the amount. Other claims are remarkable: a machine performs far better than others of its kind. Remarkable claims are sometimes true, because engineering does improve. But they need more evidence than ordinary ones, and they need it in a particular order. First, is the claim physically possible? Then, how likely was it before you saw any data? Only then, what do the data show?

This chapter applies that order to the supplier's heat pump, whose claimed performance turns out to be possible, implausible and, on inspection, true at different conditions from the ones the proposal implies.

## Proportioning belief to evidence

David Hume's essay "Of Miracles", in *An Enquiry Concerning Human Understanding* of 1748, sets out a principle that every engineer who reads proposals can use. A wise person, Hume says, proportions belief to the evidence. When someone reports an event that runs against long and uniform experience, the listener must weigh two improbabilities: that the event happened, and that the report is mistaken, whether through error, exaggeration or misunderstanding. The listener should believe whichever is less surprising.

Hume's essay was aimed at reports of miracles, and its argument about them is still debated; the Companion's chapter on naturalism, by Evan Fales, discusses how miracles might be conceived and what evidence they could provide. This book takes no view on that question. The principle it borrows is narrower and uncontroversial in engineering: a claim that contradicts a great deal of experience needs evidence strong enough that its being wrong would be more surprising than its being right.

For a performance figure, the comparison is usually easy to make. A remarkable number is far more often the product of different test conditions, a misprint or optimistic rounding than of a genuine leap in performance. That is not cynicism; it is a matter of frequencies. Most remarkable figures in proposals turn out, on inspection, to describe something other than what the reader assumed.

## The claim

This is an illustration. The supplier's optional heat pump would take heat from the cooling-water return at 35 °C and deliver hot water at 70 °C for the factory's parts-washing line, at a coefficient of performance (COP) of 7.5. That means 7.5 kW of heat delivered for every 1 kW of electricity. The proposal sizes it at 120 kW of heat, so it would draw 16 kW. At 4,000 hours a year and A$0.28 per kWh excluding GST, it would cost about A$17,920 a year to run.

## First filter: is it physically possible?

The second law of thermodynamics sets an absolute ceiling on a heat pump's COP between two temperatures, the Carnot limit. For heating, it is the hot-side absolute temperature divided by the temperature lift. No real machine reaches it, because heat exchangers need temperature differences to transfer heat and compressors have losses. Real machines achieve some fraction of it, called the second-law efficiency.

The [Carnot limit claim check](/tools/carnot-limit-check/) in BIZOMAT Tools tests a claimed COP or efficiency for a heat pump, chiller or heat engine against the Carnot limit for the temperatures entered. It reports the actual COP from the stated output and input, the Carnot COP, the second-law efficiency as the ratio of the two, and the yearly running cost, and it flags any claim above 100% of the limit as impossible as stated. Its limitations are stated with it: the Carnot limit is the ceiling for the temperatures entered, so the source and sink temperatures at the rating point should be used; the result is for one operating point; and ratings to be compared must be at the same conditions, which for heat pumps in Australia follow the AS/NZS 3823 series of test conditions.

The plant engineer enters 70 °C and 35 °C, 120 kW of output and 16 kW of input.

```figure
type: stats
title: The heat pump claim against the Carnot limit
caption: This is an illustration. From the Carnot limit claim check. The claim does not break the second law. It does claim three-quarters of the theoretical maximum.
- 7.5 | Claimed COP | 120 kW out for 16 kW in
- 9.80 | Carnot COP | 343.15 K ÷ 35 K lift
- * 76.5% | Second-law efficiency | The share of the ideal claimed
- A$17,920 | Yearly running cost as claimed | 64,000 kWh at A$0.28
```

The claim passes the first filter. It is 76.5% of the Carnot limit, not above it, so it is not impossible. The tool reports it as within the limit and above the 30% minimum the plant engineer entered. But the tool's own guidance adds a caution: real vapour-compression machines fall well short of the Carnot limit, and a claim close to the limit deserves its test conditions checked. Three-quarters of the ideal is close.

## Second filter: how plausible was it before the data?

Passing the physical filter makes a claim possible, not likely. The next question is how plausible the claim was before looking at the supplier's evidence: the prior plausibility, in the language of probability.

The plant engineer has no statistics on heat pump performance and does not invent any. What she has is experience and the tool's guidance: the commercial heat pumps she has seen, at lifts like this one, have come nowhere near three-quarters of the Carnot limit. She judges that a claim of 76.5% at a 35 K lift is unlikely to be right for a standard commercial machine, though not out of the question for an unusual design.

To see what that judgement means for the decision, she puts rough numbers on it, labelled as judgement rather than data. Suppose she thought, before reading the proposal, that there was a 1 in 20 chance a heat pump of this kind could truly reach this figure at these conditions. And suppose a datasheet showing the figure is three times as likely to exist if the claim is true as if it is not, because datasheets sometimes report figures at other conditions or from prototypes. Bayes' rule then gives the chance the claim is true, after reading the datasheet, as about 14%. If she had started more generously, at 1 in 5, it would be about 43%.

```figure
type: compare
title: What a datasheet can do to a remarkable claim
cols: Before the datasheet | Datasheet's weight | After the datasheet
caption: This is an illustration. Judgements, not data, used to show the arithmetic. Even a generous starting point leaves the claim more likely wrong than right as stated. The useful step is to find out why the figure might be misleading.
- Sceptical starting point | 5% | 3 times as likely if true | 13.6%
- Generous starting point | 20% | 3 times as likely if true | 42.9%
- What would change it | Independent test at 70 °C | Much more than 3 times | Close to settled either way
```

The arithmetic is not the point; the numbers are guesses. The point is the shape of the result. A remarkable claim, supported only by the claimant's own document, stays more likely wrong than right, unless the document is the kind of evidence that would rarely exist if the claim were false. An independent test at the stated conditions would be that kind of evidence. A datasheet is not.

## The likeliest explanation: the conditions

Hume's principle points to the question to ask next: what would make the report mistaken, without anyone lying? For a heat pump COP, the answer is almost always the temperatures. COP depends strongly on the lift. A figure measured at a small lift, quoted next to a requirement for a large one, will look extraordinary.

The plant engineer asks for the test report behind the 7.5. Its footnote states the rating point: water from 35 °C, heated to 50 °C. That is a lift of 15 K, not 35 K. She reruns the tool at 50 °C and 35 °C.

```figure
type: compare
title: The same COP at two rating points
cols: Carnot COP | Second-law efficiency of COP 7.5 | Verdict
caption: This is an illustration. From the Carnot limit claim check. At the rating point in the test report, 7.5 is an ordinary figure. At the temperatures the factory needs, it would be extraordinary.
- 35 → 50 °C, as tested | 21.54 | 34.8% | Ordinary
- * 35 → 70 °C, as the factory needs | 9.80 | 76.5% | Close to the limit; not credible without a test at these conditions
```

At the tested conditions, a COP of 7.5 is 34.8% of the Carnot limit, an unremarkable figure. The claim was true, at a different lift. Two figures that seem to conflict are often both true, each under its own conditions, and the first step is always to find those conditions. The supplier did not lie. Its proposal placed a figure from one condition beside a requirement at another.

### What it means for the business case

If the machine kept the same second-law efficiency at the larger lift, 34.8% of the 9.80 Carnot COP, its COP at 70 °C would be about 3.41. The tool, rerun with 120 kW out and 35.2 kW in, gives a running cost of about A$39,424 a year, against the A$17,920 implied by the proposal. The difference, about A$21,500 a year, is larger than the whole retrofit package's claimed energy saving.

The plant engineer does not treat 3.41 as the machine's real COP either. It is an estimate on an assumption, and real machines often lose efficiency at higher lifts. She asks the supplier for a rating at 35 to 70 °C, measured, before she will put any figure into the business case. Until then, the heat pump stays out of the decision.

## What evidence would settle it

The Bayes arithmetic showed that the strength of evidence matters more than its quantity. Ten datasheets saying the same thing are worth little more than one, because they come from the same source and would exist whether the claim is true or not. What the plant engineer needs is evidence that would be hard to produce if the claim were false.

Three kinds would do, in rising order of cost. A rating at the factory's own conditions, 35 °C to 70 °C, measured to a recognised test method and reported with its instrument uncertainties, would be a large step. A rating of the same kind by an independent laboratory would be larger, because it removes the supplier's own interest from the measurement. And a witnessed test on the actual machine, with the factory's engineer present, before delivery or as a condition of acceptance, would settle the question for this machine at least.

She also asks for the machine's performance across a range of lifts, not at one point. A credible heat pump's COP falls smoothly as the lift rises; a set of figures that falls off a cliff, or one that stays implausibly flat, says something about the machine or the data. A single figure, however good, tells her less than a curve.

The cost of the evidence is weighed against the stakes. The heat pump is a A$68,000 option whose running cost could be A$17,920 or nearer A$39,000 a year depending on which figure is right. A witnessed test costing a few thousand dollars is well worth it at those stakes. For a cheaper, lower-stakes claim, a rating at the right conditions might be enough.

## Remarkable is not the same as false

The order of the filters matters. A claim above the physical limit is rejected outright: no evidence could support it as stated, and the useful question is only what the figure really describes. A claim below the limit but far from experience is not rejected; it is marked as needing strong evidence, and the first thing to examine is the conditions. A claim near ordinary experience needs ordinary evidence.

Treating remarkable claims as false would block genuine improvements. Heat pump designs do get better, and an unusual cycle or refrigerant can move a machine closer to the limit. The protection against being fooled is not disbelief; it is asking for the kind of evidence that would rarely exist if the claim were false, at the conditions that matter.

## The failure case: more heat out than energy in

This is an illustration. The factory had met a remarkable figure once before. A compressor heat-recovery unit was offered with a claim of 95 kW of recovered heat. The factory's compressor drew 75 kW of electricity. All the heat a compressor rejects comes from the energy put into it, so no recovery unit can recover more heat than the compressor's input; the claim broke the first law, not just the second. Nobody noticed until the unit was installed and delivered about 55 kW. The supplier's figure had been for a larger compressor in the same range.

### How it is detected and corrected

The failure is detected with an energy balance before anything else: compare the claimed output with the energy available to produce it. For heat pumps and engines, the Carnot limit check adds the second-law test. Either takes minutes. The correction is to ask, for any figure that fails or nearly fails these filters, which conditions or which model it was measured on, and to get a figure for the actual case in writing before it enters a business case.

## Exercise: two more claims

Use the Carnot limit claim check for a heat pump heating water from a 35 °C source to 60 °C, delivering 100 kW.

1. A supplier claims a COP of 12. What fraction of the Carnot limit is that, and what is your verdict?
2. Another claims a COP of 15. What does the tool report?

**Worked answer.**

1. The Carnot COP for 60 °C and 35 °C is 333.15 ÷ 25 = 13.33. A COP of 12 (100 kW out for 8.33 kW in) is 90.1% of the limit. The tool reports it within the limit, so it is not impossible. But it is extraordinarily close to the ideal, far closer than real vapour-compression machines achieve. The verdict is not proven, and the first step is to ask for the test report and its rating temperatures.
2. A COP of 15 (100 kW out for 6.67 kW in) is 112.5% of the limit, and the tool reports that the claim exceeds the Carnot limit and is impossible as stated. No evidence can support it at these temperatures. The useful question is what the figure actually describes: different temperatures, a different machine, or a misprint.
