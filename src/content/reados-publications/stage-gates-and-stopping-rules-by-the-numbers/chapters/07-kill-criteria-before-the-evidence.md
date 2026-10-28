---
book: stage-gates-and-stopping-rules-by-the-numbers
chapterSlug: kill-criteria-before-the-evidence
order: 7
title: "Stopping rules and kill criteria written before the evidence"
description: "A break-even P(High) of 0.0980 becomes field and dealer-deposit criteria signed at Gate 4; the field season returns 89% detection and 6 deposits, and a draft paper tries to move the goalposts."
draft: true
---

A gate can stop a project only if the people at it agree, before they see the evidence, what evidence would stop it. Once the results are on the table, everyone in the room can see which threshold would give which answer, and the threshold tends to move towards the answer the room prefers. A kill criterion written in advance takes that choice away. It is a promise made while the business could still think about the decision without knowing how it would turn out.

This chapter derives SB36's launch threshold from the decision tree of Chapter 2, turns it into criteria that a field season can measure, shows how the criteria were written and signed at Gate 4, and reports what the season found. It ends with a draft Gate 5 paper that tried to re-read the criteria after the results were known, and how it was caught.

## Why the criteria must come first

Chip Heath's 1995 study found that people who set a budget for an endeavour tended to stop once it was exhausted, and that escalation was more likely when no budget had been set. A budget is the simplest kill criterion: a number agreed before the spending, which turns a matter of judgement ("is it worth a bit more?") into a matter of record ("we said A$644k"). Chapter 6 showed the same idea applied to a stage's cost, and what happened when nobody checked it.

Robert Cooper's Stage-Gate work makes the same point for the content of a gate. He separates **must-meet** criteria, which a project has to satisfy to pass at all, from **should-meet** criteria, which are scored and weighed. Must-meet criteria are knock-outs: a single "no" stops the project or sends it back, whatever the scores elsewhere. They work only if they are specific enough that a "no" cannot be argued into a "yes". "Strong market interest" is not a must-meet criterion; "at least ten refundable dealer deposits by 31 March" is.

There is a second reason to write criteria first, and it is arithmetical. Every number in the decision tree that this book has built depends on how the field signal is defined. Chapter 2 assumed that the season would return a **Strong** signal with probability 0.85 if the market was High, 0.45 if it was Medium and 0.10 if it was Low. Those likelihoods describe a test. If the test's pass mark changes after the results arrive, the likelihoods no longer describe what was done, and the posterior probabilities, the expected values and the decision that rest on them are no longer valid. Moving the goalposts is not only a governance failure. It breaks the arithmetic.

## From the tree to a threshold

This is an illustration. All money in this chapter is in Australian dollars excluding GST, in thousands (A$k) unless stated. Corella Plains Implements values a full launch of SB36 at the launch date, over six sales seasons at 10% a year, for a launch spend of A$1,800k. Chapter 2's three market states give these launch NPVs:

- **High**, 40 booms a year: **A$7,258.9k**.
- **Medium**, 8 booms a year: **A$11.8k**.
- **Low**, 2 booms a year: **−A$1,347.1k**.

The launch is worth making when its expected NPV is above zero. With three states there is no single break-even probability, because the answer depends on how the remaining probability is split between Medium and Low. The practical way through is to hold that split fixed and ask how large P(High) must be.

After a Weak signal, Chapter 2's posterior probabilities are 0.0655 High, 0.3843 Medium and 0.5502 Low. Of the probability not on High, Medium's share is 0.3843 ÷ (0.3843 + 0.5502) = **0.4112**. Holding that share, the expected NPV of the rest of the distribution is 0.4112 × 11.8 + 0.5888 × (−1,347.1) = **−A$788.3k**, and the launch breaks even where P(High) × 7,258.9 balances (1 − P(High)) × 788.3.

```figure
type: formula
title: Break-even probability of the High market for a full launch
formula: p* = −R ÷ (NPV_High − R)
formula: R = m × NPV_Medium + (1 − m) × NPV_Low
caption: This is an illustration. With Medium's share of the non-High probability at 0.4112, the share it has after a Weak signal, a full launch pays only if P(High) is above 0.0980.
- p* | break-even probability of the High state
- m | Medium's share of the probability not on High, 0.4112
- R | expected launch NPV if the market is not High, −A$788.3k
- NPV_High | A$7,258.9k at 40 booms a year
step: R = 0.4112 × 11.8 + 0.5888 × (−1,347.1) = −788.3
step: p* = 788.3 ÷ (7,258.9 + 788.3) = 788.3 ÷ 8,047.2 = 0.0980
```

The threshold is **0.0980**, just under 10%. Holding instead the prior split of 0.40 to 0.35 (Medium's share 0.5333), the threshold is **0.0790**. The difference matters little here; what matters is where the two possible field signals put P(High):

- after a **Strong** signal, P(High) is **0.4971**, five times the threshold, and a full launch is clearly worth making (expected NPV A$3,502.9k);
- after a **Weak** signal, P(High) is **0.0655**, below the threshold, and a full launch is expected to lose money (expected NPV −A$261.2k).

```figure
type: bars
title: P(High) after each field signal against the launch threshold
unit: %
max: 50
caption: This is an illustration. The prior and both posteriors from Chapter 2, with the break-even of 9.80% from the Weak posterior's Medium-to-Low split. The field season can move P(High) to either side of the threshold, which is why it is worth running.
- Prior at Gate 3 | 25.0
- After a Strong signal | 49.7
- * Break-even for a full launch | 9.80
- After a Weak signal | 6.55
```

That is the whole case for the field season in one picture. Because the two possible signals land on opposite sides of the threshold, the season can change the launch decision, which is why Chapter 4 found that its market programme was worth A$149.5k against its A$100k cost. It also tells the business what the stopping rule must be. The rule is not "launch if the field season goes well". It is: launch the full boom only on a result that the tree treats as Strong, because only that result carries P(High) above 9.8%.

## Writing the criteria at Gate 4

This is an illustration. At Gate 4 on 17 December 2025, the gatekeepers turned "Strong" into measurable conditions before the season began. The engineering manager proposed the technical condition, the sales and dealer manager proposed the market condition, and the independent board adviser checked that together they described a signal for which the Chapter 2 likelihoods were a fair judgement. The managing director signed the record, and it was filed with the Gate 4 minutes.

```figure
type: checklist
title: SB36 kill criteria, as signed at Gate 4 on 17 December 2025
caption: This is an illustration. Unmarked items are required; crossed items are practices the gatekeepers agreed to avoid. A Weak signal stops the full boom at Gate 5; it does not by itself decide what happens next.
- Field detection at least 92% of weeds sprayed at no more than 5% false-spray | measured over every hectare of the season, all paddocks included
- At least 10 dealer deposits of A$5,000 (refundable) by 31 March 2026 | deposits banked, not verbal interest
- Strong only if both conditions are met | either one failing means Weak: no full launch
- Gate 5 held by 30 April 2026 | time box: the gate is held on the evidence available by then
- Stage 4 cost within 115% of budget, A$368k | above it, a re-gate before more money is committed
- x Revising a threshold after results are seen | any change needs a new gate decision recorded before the data
- x Reporting a subset of paddocks or dealers in place of the whole | the criteria apply to the season as run
```

Each condition does a different job. The **detection** condition is technical: the controlled test at Gate 4 had shown 94% against a 93% criterion, but a paddock in summer, with stubble, dust, varying light and a boom bouncing at working speed, is a harder place than a test rig. Below about 92%, the scoping interviews suggested, enough weeds survive to set seed that growers would need a follow-up blanket spray, which removes most of the herbicide saving that the boom exists to deliver. The **deposit** condition is commercial: a A$5,000 refundable deposit is a small cost to a grower or dealer, but it separates intention from interest more reliably than a survey. Requiring both reflects how the tree was built: a High market needs a product that works in the field and buyers who will commit.

Each threshold was derived from what the decision needs, not chosen as a round improvement on something. [Targets derived from the purpose, not from the baseline](/reados/publications/outcome-first-projects-by-the-numbers/targets-from-the-purpose/) in *Outcome-First Projects by the Numbers* applies the same discipline to project targets, with a useful test for any criterion: what happens if the result lands exactly on it.

The **time box** stops the season from being extended to wait for a better result, a common way of not deciding. The **budget cap** on Stage 4, 1.15 × 320 = **A$368k**, applies the lesson of Chapter 6 from the start.

How strong a criterion can be is limited by the size of the test. A handful of farms and one season of dealer contact are a small sample. [Pass-fail tests: what a small sample can and cannot show](/reados/publications/prototypes-and-simulation-by-the-numbers/pass-fail-tests-and-small-samples/) in *Prototypes and Simulation by the Numbers* works through how little a short run of passes proves, and why acceptance criteria for a trial should state the confidence they carry as well as the pass mark. The SB36 criteria do not claim to prove the market is High. They claim only to separate two groups of outcomes whose likelihoods the gatekeepers had judged, which is all the tree needs.

## Criteria that stop and criteria that start a review

Not every threshold should stop a project. Some should stop it; others should start a review that may change it. Confusing the two is a common reason why kill criteria are not used: if every trigger means "kill", gatekeepers become reluctant to write triggers at all.

```figure
type: compare
title: What each SB36 criterion does when it is missed
cols: Kind | If missed
caption: This is an illustration. Only the signal criterion stops the full boom by itself; the others start a review or are recorded for the next decision.
- Field detection and dealer deposits | Stopping rule | full boom not launched; Gate 5 chooses among the remaining options
- Gate 5 by 30 April 2026 | Time box | gate held on the evidence then available
- Stage 4 forecast above A$368k | Review trigger | re-gate before more money is committed
- Herbicide saving at least 60% | Claim check | the saving is not used in sales material if missed
- Retrofit kit enquiries | Recorded only | an input to the option set at Gate 5, not a criterion
```

A stopping rule stops one course of action, not the business's thinking. A Weak signal at Gate 5 would stop the full boom, but the gate would still have to decide among launching anyway against the rule, waiting, changing the product or stopping altogether. Chapters 8 and 9 take that choice in turn. [Stopping well: ending projects that no longer deserve the people and money](/reados/collections/project-sponsors-governance-and-decisions/stopping-projects-well/) covers what then happens inside the organisation, such as closing the work and moving its people.

## What the season found

This is an illustration. The field season ran from 22 December 2025, three weeks late because of the Stage 3 overrun, on 5 farms and 7,400 ha instead of the planned 6 farms and 9,000 ha. The results were compiled in March 2026:

- **Field detection: 89%** of weeds sprayed, at **4%** false-spray. The false-spray limit was met; the detection threshold of 92% was not.
- **Dealer deposits: 6** banked by 31 March 2026, against at least 10.
- **Herbicide saving: 71%** on average over the 7,400 ha, against the claim of at least 60%. Met.
- **Retrofit kit enquiries: 14**, from growers asking whether the cameras and controller could be fitted to their existing booms. Recorded, as agreed, but not a criterion.

```figure
type: gauge
title: Field detection over the 2025–26 season against the 92% criterion
min: 80
max: 100
value: 89
unit: %
label: of weeds sprayed, at 4% false-spray
caption: This is an illustration. Detection fell short of the criterion by 3 percentage points over the whole 7,400 ha. Dealer deposits also fell short, 6 against 10, so the signal was Weak on both conditions.
- 80 | 92 | Below criterion: Weak
- 92 | 100 | Meets criterion
```

Both conditions failed, so the signal was **Weak**. Under the tree, that moves P(High) from 25% to 6.55%, below the 9.8% threshold, and the expected NPV of a full launch to −A$261.2k. The rule signed at Gate 4 said: no full launch.

## The error: moving the goalposts

This is an illustration. On 13 April 2026, eight days before Gate 5, the engineering manager and the sales and dealer manager circulated a draft Gate 5 paper. It recommended a full launch and described the field season as Strong. Two passages carried the argument:

- "Six deposits are acceptable given the late start to the season." The criterion was ten.
- "Detection reached 93% on paddocks with under 30% stubble cover." Those paddocks made up **2,900 ha** of the 7,400 ha, **39.2%** of the area tested.

Neither statement was false. Each replaced the criterion with a different one, chosen after the results were known, and each happened to turn a failing result into a passing one. Together they would have re-labelled a Weak signal as Strong and supported a A$1,800k launch with an expected NPV of −A$261.2k.

The independent board adviser caught it by doing one simple thing: laying the draft beside the signed Gate 4 record and checking each result against the criterion as written. The record said "at least 10" and "all paddocks included". The draft said neither. The adviser's note to the managing director, two paragraphs long, listed the two differences and asked for the paper to be reissued.

Both arguments fail on their own terms as well:

- **The late start.** The season ran from 22 December to 31 March, 99 days, against a planned 120 days from 1 December. Scaling the deposit threshold to the shorter season gives 10 × 99 ÷ 120 = **8.25**, so even a pro-rata criterion would have needed nine deposits. Six falls short either way. The late start explains part of the shortfall; it does not remove it.
- **The stubble subset.** The likelihoods 0.85, 0.45 and 0.10 were judged for a detection rate measured over the whole season. A rate measured on the easiest 39% of the area is a different test, which almost any working prototype would pass more often, so its result carries less information about the market state. Using it as if it were the planned test overstates P(High). Stubble is also where many growers' fallow paddocks are after harvest, so a boom that detects well only on bare ground serves a smaller market than the one the tree valued.

The paper was reissued on 16 April with the results reported against the criteria as written: detection 89% against 92%, deposits 6 against 10, signal Weak. The late start appeared as a reason for the shortfall, and as a lesson about Stage 3's overrun, not as a new threshold. The stubble result appeared as a finding for the engineering team, useful for any future design, with its share of the area stated. The managing director added one line to the business's gate procedure: a gate paper reports each criterion in the words of the signed record, before any commentary.

Nobody in this episode acted dishonestly. The two managers believed in SB36, had worked on it for more than a year, and found real reasons why the results understated the product. That is why the criteria had to be written first. After the evidence, the people closest to a project are the people most able to find a reading of it that lets the project continue.

## Exercise: a dearer launch

Suppose that at Gate 4 the launch had been costed at A$2,000k instead of A$1,800k, with the same contributions in each market state (present values of A$9,058.9k, A$1,811.8k and A$452.9k). Holding Medium's share of the non-High probability at 0.4112, what is the break-even P(High) for a full launch, and would a Strong or a Weak signal clear it?

**Worked answer.** The launch NPVs fall by A$200k each: High 9,058.9 − 2,000 = **A$7,058.9k**, Medium 1,811.8 − 2,000 = **−A$188.2k**, Low 452.9 − 2,000 = **−A$1,547.1k**. The expected NPV if the market is not High is R = 0.4112 × (−188.2) + 0.5888 × (−1,547.1) = **−A$988.3k**. The break-even is p* = 988.3 ÷ (7,058.9 + 988.3) = 988.3 ÷ 8,047.2 = **0.1228**, or 12.3%. A Strong signal (P(High) 0.4971) still clears it comfortably. A Weak signal (0.0655) falls further below it than before. The criteria would not need to change, but the dearer launch widens the gap a Weak signal would have to close, which makes the goalpost arguments of April 2026 even harder to justify. A criterion should be revised when the inputs to the threshold change, as here, and the revision recorded at a gate before the data, never after.
