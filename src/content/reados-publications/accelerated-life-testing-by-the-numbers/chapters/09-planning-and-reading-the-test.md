---
book: accelerated-life-testing-by-the-numbers
chapterSlug: planning-and-reading-the-test
order: 9
title: "Planning the programme and reading the field"
description: "FL-60's complete test programme, what it predicts and what it cannot, analysing warranty returns with suspensions, closing the loop, and the failures no test was looking for."
draft: false
---

The earlier chapters each built one piece of FL-60's reliability case: a model for each wear-out mechanism, a test for each, a statistical basis for the number of units and hours, and a ceiling for the stresses. This chapter assembles them into a single programme, sets out what the programme predicts about the production floodlight in service, and then follows the product into the field, where the predictions meet reality. It shows how to analyse warranty returns with the same Weibull methods as the tests, why the field always contains failures that no accelerated test was looking for, and how the business closed the loop.

## FL-60's test programme

This is an illustration. The programme below is the one the business ran on the production design, after the prototype findings of the earlier chapters had been fixed. Each line names the mechanism it addresses, the model that converts test time to service time, and the evidence it produces.

```figure
type: compare
title: FL-60's production reliability programme
cols: Mechanism or purpose | Test | Evidence produced
caption: This is an illustration. The capacitor demonstration is the longest item and sets the programme's length; the others run in parallel in separate chambers.
- HALT | weak links, limits | 2 to 4 days, combined stresses, 3 drivers and 3 LED boards | limits and fixes: inductor staked, clip replaced
- Activation energy | capacitor electrolyte loss | 85, 95 and 105 °C cores, 1,000 h each, capacitance logged | Ea = 0.70 eV measured
- * Driver demonstration | wear-out of the driver as a whole | 10 drivers, 4,123 h at 105 °C core, one failure allowed | R = 0.90 over 10 years at C = 0.908
- LED board | solder fatigue | −40 to +100 °C on the board, 1,235 cycles, plus power cycling | two design lives, no joint failures
- Humidity | corrosion and migration | 85 °C, 85% RH, 1,000 h, drivers powered | 7.8 design lives on the Peck model
- Condensation | breathing and salt | cyclic damp heat on complete housings, salt variant | vent and drip shield confirmed
- Optics | UV and heat ageing | agreed with the optic supplier | supplier's data plus a sample check
```

The demonstration needs the most chamber time: 4,123 hours, about 172 days. The thermal cycling takes about 51 days, the humidity test about 42, and the activation energy measurement about 42 in three chambers at once. Run in parallel, the programme takes about six months from the end of HALT, and it fits the business's launch plan only because HALT and the activation energy measurement were run early, on pre-production units, so that their findings were in the design before the long tests began.

## What the programme predicts

If every test passes, the programme supports a set of specific statements. Each is conditional on the models and assumptions stated with it, and the report states them that way.

This is an illustration. The production driver's capacitors are rated for five times the life of the prototype's. If the production driver's wear-out distribution has the prototype's shape, β = 2.57, and a characteristic life five times longer at the same core temperature, then with the measured acceleration factor of 21.2 its field characteristic life is about 5,950 × 5 × 21.2 = **630,700 hours**. On that model, about **0.02%** of drivers would wear out within the 5-year warranty and about **0.1%** within 10 years. The capacitors would reach the maker's calendar cap of 13 to 15 years long before their formula life.

```figure
type: stats
title: What FL-60's programme supports, if every test passes
caption: This is an illustration. Each figure holds only for the mechanisms tested and the models stated. None covers overstress, installation faults or defects outside the tested population.
- R ≥ 0.90 | driver survival over 10 years, at 90.8% confidence or more
- about 0.1% | predicted driver wear-out within 10 years, from the scaled prototype fit
- 2 design lives | LED board solder fatigue tested without failure
- 7.8 design lives | humidity exposure covered at the Peck parameters
- 13 to 15 years | capacitor maker's calendar cap, the real upper bound on driver life
```

The prediction of 0.1% in ten years is the kind of number that should make an engineer cautious rather than pleased. It says that capacitor wear-out, the mechanism the programme was built around, is no longer what limits the driver's life. Something else will be, and the programme cannot say what, because it was designed to test the mechanisms that were known. That is the honest position at launch: the known wear-out mechanisms have been pushed well beyond the design life, and the field will reveal the rest. The programme's success, in other words, changes the question the business should be asking. Before testing, it was whether the capacitors would last; after testing, it is what else could fail, how often, and how quickly the business would find out. Answering that needs a way of collecting and analysing field failures from the first unit shipped, set up before launch rather than after the first complaint.

## Writing the reliability report

The programme ends in a report, and the report is what the business's managers, its customers and, if something goes wrong, its insurers will read. A good reliability report is short and conditional. For each claim it states the target, the test, the units and hours, the result, and the models and assumptions that connect test to service, with their sources. It shows the sensitivity of each conclusion to its weakest assumption, as Chapters 2, 4 and 7 did for activation energy, humidity parameters and shape. It lists every failure in every test, with its root cause and disposition, including those judged irrelevant and the reason. And it says plainly what was not tested.

That last section is the one most often missing, and it is the one that would have helped most with FL-60. A sentence such as "electrical transients beyond the driver's rated surge immunity were not tested; installations with long exposed feeders may see larger surges" would have pointed straight at the field problem. Writing down the gaps is not an admission of weakness; it is how a business decides consciously which risks it is accepting.

## Deciding when to ship

No programme removes all risk, and at some point the business must decide that the evidence is sufficient. A useful way to frame the decision is to compare three things: the strength of the evidence for each known mechanism, the size of the unknowns that remain, and the cost of being wrong, which includes warranty returns, field repairs and reputation. FL-60's evidence for capacitor wear-out, solder fatigue and humidity was strong; its unknowns were the overstress environments and any mechanism nobody had thought of; and its cost of being wrong was moderate, since a floodlight driver can be replaced in the field.

On that basis, shipping with the evidence in hand and a plan to watch the field closely was a reasonable decision. A product whose failure could injure someone, or one that cannot be repaired once installed, would justify more testing and a higher confidence before release. The decision, and the reasoning behind it, belong in the reliability report, signed by whoever has the authority to accept the risk.

## Screening in production

The test programme proves the design. It does not prove that every unit built is like the units tested. Early failures from manufacturing defects, the first kind of failure in Chapter 1, are controlled in production by process control and inspection and, where justified, by a short **screen**: running every unit at an elevated temperature or through a few thermal cycles before shipping, to make weak units fail in the factory rather than in the field. A screen must be gentle enough not to use up a meaningful share of the good units' life, which the acceleration models can check; FL-60's production test runs each driver at full load for a few hours at a warm ambient, a tiny fraction of its life at the demonstrated acceleration. The screen's own failures go into the failure register, where a rising count is an early warning of a process problem.

## Reading the field: warranty returns

Field returns are life data, and they can be analysed with the same methods as test data, with one important difference: almost every unit in the field is a suspension. A floodlight that has been in service for 14 months and has not failed is a suspension at 14 months, and leaving the survivors out, as Chapter 6's error showed, produces nonsense.

This is an illustration. Eighteen months after launch, the business had shipped and installed about **4,000** FL-60s, which had been in service for an average of about **1.2 years**. Eighteen had been returned under warranty with failed drivers. The installed fleet had accumulated about 4,000 × 1.2 × 4,380 = about **21 million operating hours**, so the observed failure rate was about 18 ÷ 21,024,000 = **8.6 × 10⁻⁷ per hour**, or about **0.38% a year**.

That is far above the 0.02% over five years predicted for capacitor wear-out, so the returns were not capacitor wear-out. A Weibull analysis of the returns, with every unit in service entered as a suspension at its own age, gave a shape parameter close to 1: failures were occurring at a roughly constant rate, unrelated to age. That is the signature of random events, not of wear-out. If the rate stayed constant, about **1.9%** of floodlights would fail within the 5-year warranty and about **3.7%** within 10 years, far more than the test programme predicted, and all from a mechanism it had not tested.

```figure
type: bars
title: FL-60 driver failures within 5 years: predicted and observed
unit: %
max: 2
caption: This is an illustration. The test programme's prediction covered capacitor wear-out; the field rate is dominated by a random mechanism the programme was not designed to test.
- Predicted capacitor wear-out, from the programme | 0.02
- * Projected from 18 months of field returns, constant rate | 1.86
```

## The error: the failures no test was looking for

This is an illustration. The eighteen returned drivers were all opened and analysed. Fourteen had the same failure: the input surge protection had been destroyed and the input rectifier had failed short. Most came from two customers, both with floodlights on tall poles in open yards in regions with frequent summer thunderstorms, fed by long cable runs. The remaining four were a mix of water ingress from a damaged cable gland, physical damage and one no-fault-found.

The driver's surge protection had been designed for a typical commercial installation, and it was adequate there. On tall poles with long, exposed feeder cables, induced surges from nearby lightning were much larger and more frequent, and the protection was overwhelmed. No accelerated life test would have found this, because surges are overstress events, not wear-out, and the programme's HALT had not included electrical transients. The test programme had done exactly what it was designed to do. Its design had a gap.

The business made three changes. The driver's surge protection was upgraded for exposed installations, and the change was checked by a test laboratory with surge testing of the kind that electromagnetic compatibility and product standards describe. The installation guide was revised to recommend an external surge protective device, installed by a licensed electrician, for floodlights on tall poles or long exposed runs. And the reliability programme for the next product gained an explicit review of overstress environments, including electrical transients, before any test was planned.

```figure
type: checklist
title: Closing the loop from the field
caption: The open item is this chapter's error. The programme answered the questions it asked; the field asked another one.
- x Every warranty return analysed to root cause | 14 surge, 2 ingress, 1 damage, 1 no fault found
- x Field data analysed with survivors as suspensions | β close to 1: random, not wear-out
- x Field rate compared with the programme's prediction | 0.38% a year against 0.02% in 5 years
- x Fixes verified by test before release | surge protection checked by a laboratory
- ? Overstress environments reviewed when the programme was planned | surges on exposed poles missed
```

## A failure reporting system

What made the field analysis possible was a habit the business had adopted during testing: every failure, in test or in the field, was recorded in one register, with the unit's identity and history, the failure's symptoms, the root cause found by analysis, the corrective action, and the evidence that the action worked. Reliability engineers call this a **failure reporting, analysis and corrective action system**, and for a small business it can be a single spreadsheet, provided it is kept faithfully. It turns warranty returns from a cost to be absorbed into data that improves the next design, and it is the evidence a business needs when a customer, a distributor or a regulator asks how a problem was handled.

The register also feeds back into the test programme. The next product's HALT includes surge steps; its humidity plan starts with complete housings; its capacitor demonstration starts from the measured activation energy rather than an assumed one. Each line of the register, in effect, becomes a line in the next plan.

## How this applies to a small Australian business

The Australian Consumer Law's consumer guarantees apply to goods regardless of the warranty a business offers, and the ACCC's guidance makes clear that durability is part of acceptable quality. For a small manufacturer, that makes field reliability a legal and commercial matter, not only an engineering one. The practical lessons of this book come together here. Test the mechanisms that wear the product out, with stresses measured on the parts and models whose parameters are stated and checked. Demonstrate the target with enough units and hours, and report what the evidence really supports. Find the margins with HALT, and fix weak links when the fix is cheap. Then watch the field, analyse every return with the survivors included, and expect it to show something the tests did not. The business that closes that loop learns from each product; the one that does not keeps paying for the same failures.

## Exercise: a second year of returns

A year later, the business has shipped **6,000** floodlights, in service for an average of **1.5 years**, and has received **25** driver returns, after the surge protection upgrade reached new production. Assuming a constant failure rate, what is the observed rate per operating hour, what fraction would be expected to fail within the 5-year warranty, and how many returns should the business budget for over five years from these 6,000 units?

**Worked answer.** The fleet has accumulated 6,000 × 1.5 × 4,380 = **39.4 million** operating hours, so the rate is 25 ÷ 39,420,000 = about **6.3 × 10⁻⁷ per hour**. Over 21,900 operating hours, the fraction expected to fail is 1 − exp(−6.34 × 10⁻⁷ × 21,900) = about **1.4%**, or about **83** of the 6,000 units over five years. The rate has fallen from about 8.6 × 10⁻⁷ per hour, which is consistent with the upgrade working, but the figure mixes units built before and after the change. A cleaner check separates returns by build date, analysing post-upgrade units on their own with their survivors as suspensions, to see whether the surge failures have actually gone.
