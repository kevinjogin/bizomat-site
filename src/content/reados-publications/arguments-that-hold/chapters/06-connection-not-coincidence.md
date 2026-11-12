---
book: arguments-that-hold
chapterSlug: connection-not-coincidence
order: 6
title: "Connection, not coincidence: when one thing follows another"
description: "Why a sequence or pattern in time is not a connection, how to test a proposed cause for relevance and mechanism, and how to run and read a before-and-after trial without overclaiming."
draft: false
---

Things happen after other things all the time. A lubricant is changed and, weeks later, a pinion breaks. A new crew starts and the scrap rate rises. A software update is installed and a machine trips. In each case the sequence is real and the suspicion is natural. But a sequence is not a connection, and acting on a coincidence wastes money while the real cause carries on.

Abelard was demanding about what counts as a genuine consequence. In Christopher Martin's account in the *Cambridge Companion to Abelard*, Abelard held that an entailment needs both necessity and relevance: the antecedent must, through its meaning or the nature of the things involved, require the consequent. A conditional that happens to be true because two things always occur together, without any connection between them, did not satisfy him. Twentieth-century logicians who developed relevance logic shared the same concern. For engineers the lesson is practical: before treating one event as the cause of another, show how the first could produce the second, and then test the connection where other changes cannot get in the way.

## Three changes and a run of failures

This is an illustration. The depot's timeline over the six months before the failures shows several changes on or around conveyor C1:

```figure
type: timeline
title: Changes and failures on the depot's conveyors
caption: This is an illustration. Several changes cluster in the weeks before the failures on C1. A timeline shows what came before what; it cannot show which change, if any, caused the failures.
- Month 1 | C1 extended; motor upgraded from 11 kW to 15 kW | drive base moved and re-grouted
- Month 2 | Purchasing switches pinions to the new supplier | first lot received on certificate
- Month 3 | First new-supplier pinion fitted to C1; one fitted to C2 at a routine change | C2 otherwise unchanged
- Month 4 | Site-wide change to a new gear lubricant | applied to C1, C2 and other drives
- *Months 4 to 6 | Three C1 pinions lose teeth | all at the root, all starting at the coupling end of the face
```

Every one of these changes precedes the failures. Each has an advocate. The fitter who said "it's that new oil" is reasoning from sequence: the failures came after the lubricant change, so the change caused them. The reasoning is so common it has a Latin name, *post hoc, ergo propter hoc*: after this, therefore because of this. It is invalid for the reason Chapter 3 gave for affirming the consequent. Many things came before the failures; sequence alone cannot pick among them.

## Ask for a mechanism

The first test of relevance is to ask how the proposed cause would act on the observed failure. The failures are tooth root fractures that started at one end of the face. A cause is relevant if there is a known route from it to that kind of damage.

- **Load and alignment** act directly on root bending stress, as Chapter 5 showed. The mechanism is well established.
- **Pinion hardness** sets the material's fatigue strength at the root. The mechanism is well established.
- **Lubricant** acts mainly on the contact surfaces of the teeth. Lubrication problems typically show up as surface distress, such as scuffing, pitting or wear, rather than as root fractures with clean surfaces. A lubricant could contribute to root failure indirectly, for example if surface damage altered the load sharing, but there should then be surface damage to see.

The reliability engineer inspects the failed pinions' tooth flanks. They show light, even wear with no scuffing or pitting. The mechanism test does not rule the lubricant out absolutely, but it makes it a weak candidate: the route from lubricant to root fracture would leave evidence on the flanks, and the evidence is not there.

## Test where only one thing changed

A mechanism argument narrows the candidates; a test where only the candidate changed can check it directly. On C1 the lubricant change is tangled with every other change. But C2 offers something close to a controlled comparison: its load, alignment and motor did not change, and the lubricant did. If the new lubricant were harming gears, C2 is the place to see it.

The plant's condition monitoring has daily overall vibration velocity readings for C2's gear drive. The reliability engineer takes the 12 working-day readings before the lubricant change and the 12 after. Before: mean 2.80 mm/s, standard deviation 0.35 mm/s. After: mean 2.74 mm/s, standard deviation 0.40 mm/s.

The [process change trial tool](/tools/process-change-trial/) in BIZOMAT Tools is built for this kind of question. It plans a before-and-after trial by giving the sample size per group needed to detect the smallest difference worth detecting at a chosen significance level and power. It then evaluates the results with Welch's two-sample t-test, giving the p-value and a confidence interval, and states one of three decisions: improvement confirmed, no proven difference, or made worse. It also checks whether the samples were large enough and whether the observed change is large enough to matter.

The engineer decides that a change of 0.3 mm/s in either direction would be worth knowing about, and enters an expected standard deviation of 0.4 mm/s, a 5% significance level, 80% power and "lower is better".

```figure
type: compare
title: C2 vibration before and after the lubricant change
cols: Result | What it means
caption: This is an illustration. Results from the process change trial tool. The trial does not prove a difference, and it was smaller than the plan called for; its confidence interval is still informative.
- Planned sample per group | 28 | Needed to detect 0.3 mm/s reliably
- Actual sample per group | 12 | The trial may miss a real difference of that size
- Difference, before minus after | 0.06 mm/s | Slightly lower after, far below 0.3 mm/s
- p-value, two-sided | 0.70 | No evidence of a difference
- *95% confidence interval for the difference | −0.26 to 0.38 mm/s | A worsening of 0.3 mm/s or more is not consistent with the data
- Decision | No proven difference | Not the same as no difference
```

### Read the result carefully

The tool's decision is "no proven difference", and it warns that 12 readings per group is fewer than the 28 the plan called for. Two opposite mistakes are easy here.

The first is to say: "No difference, so the lubricant is harmless." That claims more than the trial shows. A small trial that finds no difference has not shown that there is none; it may simply have been too small to see one. Absence of evidence is not evidence of absence, unless the test was capable of finding the effect.

The second mistake is to say: "The trial was too small, so it tells us nothing." That claims less. The confidence interval runs from −0.26 to 0.38 mm/s for before minus after. A negative value would mean vibration rose after the change. The interval's lower end, −0.26 mm/s, means that any worsening is very probably less than 0.26 mm/s, smaller than the 0.3 mm/s the engineer judged worth detecting. So even this small trial makes a material worsening on C2 unlikely.

Combined with the mechanism test, the conclusion is: "The lubricant change has no identified mechanism for root fracture, the failed teeth show no surface distress, and on C2, where only the lubricant changed, vibration has not risen by a worthwhile amount. The lubricant is not supported as a cause of the C1 failures." That conclusion is qualified, specific and defensible. It does not say the lubricant can never cause trouble.

### What a properly sized trial would have needed

The tool's plan figure, 28 readings per group, is worth taking seriously for the next question of this kind. At one reading per working day, 28 readings is nearly six weeks before and six weeks after a change. That is often longer than anyone wants to wait, which is why small trials are common. There are better options than accepting an underpowered result:

- **Decide the smallest worthwhile difference before looking at the data**, as the engineer did here. It is what gives the confidence interval its meaning.
- **Take more readings per day** if the measurement allows it and the readings are not simply repeats of each other.
- **Use more than one unit**: several drives that received the change, compared with several that did not over the same period, separate the change from seasonal or production effects.
- **Report the confidence interval, not just the decision.** "No proven difference" alone invites the first mistake above; the interval shows what the trial can and cannot exclude.

The [chapter on testing a hypothesis without fooling yourself](/reados/collections/research-and-evidence-for-better-decisions/testing-a-hypothesis-without-fooling-yourself/) covers the planning of comparisons in more depth.

## Changes that arrive together

C1's history shows a harder problem than any single coincidence: several real changes arriving together. The extension, the motor, the base move, the new supplier and the new lubricant all affected C1 within four months. Observing C1 alone, there is no way to separate their effects. Any one of them, or any combination, could be connected to the failures, and the timeline fits them all.

Statisticians call this confounding. The practical response has two parts. The first is to look for places where the changes did not arrive together, as the depot did with C2, where only the lubricant and one new pinion changed. The second is to think about the fix in the same terms. If the depot changes the pinion supplier, realigns the drive and fits a soft starter all in one shutdown, and the failures stop, the result will be confounded in the same way: it will show that the combination works, but not which part of it mattered.

Sometimes that is the right choice. When a failure is costly or dangerous, fixing everything plausible at once is sensible, and the uncertainty about which part worked is a price worth paying. But it should be a conscious choice, recorded in the justification, rather than an accident that later leads someone to credit the wrong change. Chapter 8 shows how to state a conclusion that honestly carries that uncertainty.

## The failure case: acting on sequence

Before the trial and the flank inspection, the depot's purchasing team had begun preparing to revert all fourteen of the site's gear drives to the old lubricant, at the cost of draining, flushing and refilling each drive, and of abandoning a supply contract. The argument for it was the fitter's sequence argument, repeated in a management email as "the failures started after the oil change".

The reversion would not have stopped the C1 failures, because the lubricant was not driving them. It would have used labour that was needed for the real corrections, and it would have created a new, comforting sequence of its own: if the next pinion had happened to last longer after the reversion, for unrelated reasons such as a harder pinion from a different lot, the lubricant would have been credited with a fix it did not make.

### How it is detected and corrected

The cheap detection is a rule for any proposed cause based on timing: before acting, state the mechanism, name the evidence the mechanism would leave, and find a place or period where the candidate changed and other things did not. The correction at the depot was to pause the reversion until the mechanism test and the C2 trial were done, which took four days, and then to cancel it.

## Base rates: check whether a pattern is surprising

Patterns in timing are tempting even when no change is involved. One of the night-shift supervisors notices that all three failures happened on the night shift, and suggests that night operators are overloading the conveyor.

Before looking for a mechanism, check whether the pattern is surprising at all. The night shift runs 12 of C1's 20 operating hours a day, 60% of the running time. If failures happened at random times during running, the chance that all three would fall on the night shift is 0.6 × 0.6 × 0.6 = **0.216**, a little over one in five. That is not surprising. The pattern is about what chance alone would produce often, and it gives no reason to suspect the night shift.

The same check applies to other coincidences. A fitter points out that two of the three failures happened within two days after a weekly oil top-up. If failures were unrelated to top-ups, each would have a 2-in-7 chance of falling in such a window. The chance that at least two of three would do so is about **0.20**. Again, not surprising.

A base rate does not prove a pattern is meaningless, but it tells you whether the pattern needs explaining. Only patterns that would be unusual by chance deserve an investigation of their own.

## Tests of connection

The depot's checks generalise into a short list. A proposed cause gains support as it passes more of these tests.

```figure
type: checklist
title: Tests that a proposed cause is connected, not just earlier
caption: This is an illustration. The lubricant failed the mechanism and control tests; misalignment and soft pinions passed both, as Chapter 7 shows.
- x Mechanism | a known route from the cause to this failure mode, leaving visible evidence
- x Evidence of the mechanism | the traces the route would leave are present
- x Control comparison | the effect appears where the cause changed and others did not, and not where it did not
- x Base rate | the pattern would be unusual by chance alone
- x Dose and response | more of the cause gives more of the effect
- x Specificity | the cause explains the details, such as which end of the face, not just that something failed
```

The specificity test deserves emphasis. A good causal explanation predicts details. "Misalignment" predicts fractures starting at one end of the face, and they did. "Soft pinions" predicts low hardness readings in the failed pinions. "Lubricant" predicts surface distress, and there was none. "Night-shift overloading" predicts nothing in particular about where on the tooth the crack starts. The more specific the evidence an explanation predicts and receives, the stronger the connection it supports.

## Exercise: the top-up coincidence

Show the calculation behind the figure of about 0.20 for the oil top-up coincidence, and state in one sentence what the result does and does not show.

**Worked answer.** If failures are unrelated to top-ups, each failure independently has a probability q = 2 ÷ 7 of falling within two days after a weekly top-up. The chance that exactly two of three do so is 3 × q² × (1 − q) = 3 × (2/7)² × (5/7) ≈ 0.175. The chance that all three do is q³ = (2/7)³ ≈ 0.023. The chance of at least two is their sum, **about 0.198**.

The result shows that the observed pattern would arise about one time in five by chance alone, so it gives little reason to suspect the top-ups; it does not show that top-ups have no effect on the gears, only that this pattern is not evidence that they do.
