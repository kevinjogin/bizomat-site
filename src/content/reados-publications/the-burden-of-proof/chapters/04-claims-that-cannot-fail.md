---
book: the-burden-of-proof
chapterSlug: claims-that-cannot-fail
order: 4
title: "Claims that cannot fail: up to, typically, normal conditions and maintenance-free"
description: "How qualifications such as up to, typically and under normal conditions make a claim fit any result, and how to turn it into a site prediction that measurement could show to be wrong."
draft: false
---

Chapter 3 dealt with claims that might be too good to be true. This chapter deals with claims that cannot be shown untrue at all. "Saves up to 40% of pump energy" is true if the drive saves 40%, and true if it saves 2%. "Maintenance-free under normal conditions" is true until something needs maintenance, at which point the conditions were not normal. Such claims sound definite. They are built so that no result can count against them.

This chapter shows how to recognise them, using a parable from the philosophy of religion, and how to turn the supplier's energy claim into a prediction for this site that a meter could prove wrong.

## The invisible gardener

In a short paper of 1950, "Theology and Falsification", Antony Flew told a parable. Two explorers find a clearing in the jungle where flowers and weeds grow together. One says a gardener must tend it. The other doubts it. They watch, and no gardener appears. They put up a fence, electrify it and patrol it with dogs, and still nothing. Each time, the believer adjusts the claim: the gardener is invisible, cannot be felt, makes no sound, leaves no scent. At last the sceptic asks what remains of the original claim. How does an invisible, intangible, undetectable gardener differ from no gardener at all?

Flew's point was that an assertion compatible with every possible observation asserts nothing. A claim can die, as he put it, by a thousand qualifications. His paper was about religious language, and it began a long debate that this book does not enter. The test it proposes, though, is the most useful single question to put to a supplier's claim: what result would show this to be false? If nothing could, the claim tells the buyer nothing, however confident it sounds.

## Qualifications that make a claim safe

Engineering proposals use a standard set of qualifications. Each is reasonable in moderation, and each, used without limit, turns a claim into a gardener nobody can find.

```figure
type: compare
title: Qualifications that protect a claim from any result
cols: What it allows | The question that restores the claim
caption: Each qualification is legitimate when it is bounded. Unbounded, it makes the claim compatible with any outcome at your site.
- "Up to 40%" | Any saving from zero to 40% | What saving do you predict at our measured duty?
- "Typically" | Any result, since your site may not be typical | Typical of what range of sites, and where does ours fall?
- "Under normal operating conditions" | Blaming any failure on abnormal conditions | Which conditions, stated in numbers, count as normal?
- "Compared with conventional systems" | Choosing the worst comparison | Compared with what we have now?
- "Maintenance-free" | Redefining maintenance after the event | What do your own manuals say must be done, and when?
- "Field proven" | Any amount of field use, with or without failures | Proven to do what, over how many hours, with what record?
```

These qualifications are not usually dishonest. "Up to 40%" may be exactly what the supplier has seen at its best sites. But a claim in that form protects the supplier and informs nobody. The buyer's job is to ask for the claim in a form that could fail.

### A note on the law

Performance claims made in trade, including between businesses, are subject to the Australian Consumer Law, which prohibits misleading or deceptive conduct. The ACCC's guidance for small business notes, among other things, that a verbal claim can be misleading even if it is later contradicted or clarified in writing. Whether a particular "up to" claim is misleading depends on its context and is a legal question, not an engineering one; this book offers no view on any case. The engineering point is independent of the law: a claim that cannot fail cannot be relied on, whether or not it is lawful.

## Turning "up to 40%" into a prediction

This is an illustration. The energy saving from slowing a pump depends on two things the supplier does not know without the factory's data: how far the flow is reduced, and how much of the pump's head is static lift rather than friction. With high static head, slowing the pump saves less, because the pump must still lift the water. The factory supplies the data from its four weeks of logging.

- Each pump is throttled by a valve to about 1,350 L/min.
- The pump curve gives a shut-off head of 48 m, and best efficiency at 1,500 L/min and 38 m, at 78% efficiency, at 1,460 rpm.
- The circuit has 14 m of static head, and the system needs 30 m at 1,500 L/min with the valve fully open.
- The pumps run about 6,000 hours a year, and electricity costs A$0.28 per kWh excluding GST.

The [pump speed control plan](/tools/pump-speed-control-plan/) in BIZOMAT Tools compares reducing a pump's flow by speed with reducing it by throttling. It fits pump and system curves from the shut-off head, the best-efficiency point and one known system point, finds the speed that gives the target flow, and calculates the head, efficiency and power at that speed, the power when throttled, and the yearly saving. Its limitations are stated: it uses quadratic pump and system curves and a simple efficiency curve, so the maker's curves should be used for important decisions, and it does not include drive and motor losses at part speed.

```figure
type: stats
title: Speed control against throttling at 1,350 L/min, per pump
caption: This is an illustration. From the pump speed control plan. The saving at the pump shaft is 32.9%. The drive's own losses are not in the tool's model and are added separately below.
- 1,248 rpm | Speed for 1,350 L/min | 85.5% of rated speed
- 11.4 kW | Power when throttled | Valve absorbing the excess head
- 7.65 kW | Power with speed control | Before drive losses
- * 32.9% | Saving at the pump shaft | Not 40%, and not "up to" anything
```

The tool gives a power of 7.65 kW with speed control against 11.4 kW throttled, a saving of 32.9% at the pump shaft. The plant engineer then adds what the tool leaves out. A variable speed drive has its own losses. She asks the supplier for the drive's efficiency at this load and, until she has it, assumes 97%, a figure she will replace with the maker's. That raises the input power to 7.65 ÷ 0.97 ≈ 7.89 kW, and the saving to about 30.8%, or about A$5,900 a year per pump.

### The prediction, with its refutation

The plant engineer now writes the claim as a prediction that a meter could prove wrong.

```figure
type: range
title: Predicted input power per pump at 1,350 L/min with the drive
min: 7
max: 12
unit: kW
ticks: 7 | 8 | 9 | 10 | 11 | 12
caption: This is an illustration. The band allows ±0.3 kW for measurement and modelling. A saving inside the band confirms the prediction; one well outside it, in either direction, means the model or the claim is wrong and must be explained.
- * Predicted with drive | 7.59 | 8.19
- Claimed "up to 40%" | 6.84 | 6.84
- Measured now, throttled | 11.4 | 11.4
```

> Prediction for C1: at 1,350 L/min, with the valve fully open and the drive controlling flow, each pump set will draw between 7.6 and 8.2 kW, a saving of 28 to 33% against its present 11.4 kW. Measured by the same meter as the baseline, over four weeks of comparable production. A measured saving below 25% will be treated as a failure of the prediction.

That sentence can fail. It names the conditions, the measurement, the expected range and the result that would count against it. The supplier may dispute the numbers, and should if it knows better; but any dispute is now about inputs that can be checked, not about what "up to" meant.

The prediction also differs from the claim in an instructive way. It promises less than 40%, which is what the factory's static head implies. A buyer who had relied on 40% would have budgeted about A$7,660 a year per pump, against a likely A$5,900. Chapter 8 shows what that does to the payback.

## Maintenance-free, tested against the supplier's own documents

C5, "maintenance-free", is the other claim that cannot fail as written. The plant engineer applies the same question: what would show it false? The quickest evidence is in the supplier's own documents. She asks for the installation and operating manuals for the drive and the controller, and reads the maintenance sections.

This is an illustration. The drive manual lists cleaning of the cooling-air filter at intervals depending on dust, inspection of the cooling fan, and replacement of the fan and the DC bus capacitors at intervals that depend on the cabinet temperature. The seal's installation guide lists a flushing check. None of this is unusual; every drive needs it. But it means the claim, read literally, is contradicted by the supplier's own manuals. Either "maintenance-free" means something narrower, such as "no scheduled maintenance beyond cleaning and periodic inspection", or the claim is wrong.

The plant engineer asks the supplier to replace the word with its maintenance schedule, with the time each task takes. The schedule goes into the business case as a running cost, A$400 a year for the two drives on her estimate, and into the maintenance plan as tasks. The claim that could not fail becomes a list that can be checked.

The exercise also tells her something about the supplier. A supplier whose sales material says "maintenance-free" while its manuals list maintenance has two documents that disagree. That is common, because sales and engineering write different documents for different readers. But it means the sales material cannot be relied on where it differs from the manuals, and every other claim in the proposal deserves the same comparison.

## When a qualification is legitimate

The plant engineer's own prediction is full of qualifications: at 1,350 L/min, with the valve open, over comparable production, by the same meter. If qualifications are what killed the invisible gardener, why are these acceptable?

The difference lies in when the qualification is made and what it does to the claim's content. A legitimate qualification is stated before the test and makes the claim more specific. It says where the claim applies, so that it predicts more precisely what will happen there. "At 1,350 L/min" narrows the claim to the duty that matters and allows a definite power to be predicted. "By the same meter" ensures that a difference in measurement cannot be mistaken for a difference in the pump. Each qualification closes a way the result could be misread.

An illegitimate qualification is added after the test, or held in reserve to be added, and makes the claim less specific. It explains away a result rather than predicting one. "The conditions were not normal", produced after a seal fails, does not narrow the claim to a range where it can be checked; it removes the failed case from the claim's scope after the fact. Each such move makes the claim safer and emptier, which is exactly Flew's thousand qualifications.

A practical test separates the two. Write down every qualification before the trial or the order, with its numbers. Any qualification that appears for the first time after a result is a rescue, and should be treated as one: it may be true, but it is not evidence for the claim, and it needs its own evidence. Chapter 7 deals with rescues in detail, because some of them turn out to be right.

The same test applies to the buyer. If the meter shows a saving of 24%, just below the plant engineer's own threshold, she cannot then decide that the production weeks were not comparable after all, unless she can show that they were not by a measure she named in advance. The rule binds both parties, which is what makes it fair.

## The failure case: normal operating conditions

This is an illustration. The factory's last pump overhaul used seals from a different supplier, sold as lasting "at least two years under normal operating conditions". One failed after eight months. The supplier inspected it and reported that the cooling water's suspended solids were higher than normal, so the conditions were abnormal and the warranty did not apply. The order had not said what normal conditions were. The factory had no record of its solids levels before the failure. The argument could not be settled, because the claim had been written so that it could not fail.

### How it is detected and corrected

The failure is detected by asking, of every qualified claim before an order: if the product failed, what would the supplier say, and could we answer it? For "normal conditions", the answer is to write them into the order in numbers: temperature, pressure, flow, solids content, start-stops per day, whatever the claim depends on. The factory now records its cooling water's solids and temperature monthly, so that the conditions of any later failure can be shown. A claim with stated conditions can fail, and so can be relied on.

## Exercise: three claims that cannot fail

Rewrite each claim as a prediction that could be shown false at your site, and say what the factory must supply to make it possible.

1. "Our compressor controller typically reduces energy use by 15 to 30%."
2. "This coating extends component life under normal operating conditions."
3. "The software pays for itself within the first year for most customers."

**Worked answer.**

1. A site prediction needs the compressors' present load profile, from logged power and pressure over representative weeks, which the factory supplies. The rewritten claim: "At your logged profile, the controller will reduce compressor energy by between A% and B% per unit of air delivered, measured by the same meter over four comparable weeks; below C% counts as a failure." The supplier fills in A, B and C from its model of the site. Measuring per unit of air delivered stops a fall in production being counted as a saving.
2. A site prediction needs the component's present life under stated conditions, from the factory's records, and the conditions themselves. Rewritten: "On components of this type, at the stated temperature, load and environment, the coating will raise the mean life from X hours to at least Y hours, assessed on N coated components by a stated date." The factory supplies X and the conditions; the trial design follows Chapter 6.
3. "Most customers" and "pays for itself" both need definitions. Rewritten: "At your site, with the stated number of users and the stated processes, the software will save H hours a month of named tasks, measured by time records before and after; at your labour rate that is A$V a year, against a cost of A$W." The factory supplies the users, processes, labour rate and before-and-after time records.
