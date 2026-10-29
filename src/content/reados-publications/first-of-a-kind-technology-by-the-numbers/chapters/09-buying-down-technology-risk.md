---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: buying-down-technology-risk
order: 9
title: "Buying down technology risk: qualification, guarantees and separable modules"
description: "Qualifying first (expected NPV A$11.35m), a yield guarantee whose damages cover 6.8% of the shortfall, and a separable fines module worth A$856,924 as an option, valued against doing nothing."
draft: false
---

By the end of Chapter 8 the novel process's lead had gone. Its yield had been corrected to 78.9%, its ramp-up stretched to nearly two years, and its capital cost graded up by novelty to a P80 of A$22.9 million excluding GST. The simulation put its mean net present value at A$8,760,870 against A$12,676,871 for the proven line. A board in that position need not simply choose the proven line and walk away from the better technology. It can try to buy the risk down.

This chapter values three ways of doing that, each against doing nothing: qualifying the novel process on the recycler's own bales before committing, accepting the supplier's performance guarantee with liquidated damages, and taking only the novel process's most valuable idea as a separable module added to the proven line later. They give very different answers, and the reasons are more useful than the numbers.

## What buying down means

There are two ways to reduce a technology risk. The first is to **spend money or time to narrow the distribution**: run a test, wait for evidence, build a smaller step first. The second is to **move the risk to someone better able to carry it**, usually through a contract. Both cost something, and both should be valued the same way: as the change in expected net present value, and in the spread of outcomes, compared with the best choice available without them.

This is an illustration. The comparison uses the simulation of Chapter 8, 10,000 trials per strategy, and the case's 144-month horizon to the end of the site lease, discounted at 8% a year real. Doing nothing means choosing now between **A, the proven line**, mean NPV **A$12,676,871**, and **B, the novel process**, mean **A$8,760,870**. The best of those is A.

## Qualifying first: strategy D

Strategy D runs a **six-month qualification** of the full novel process on the recycler's own bales, at a cost of **A$600,000**, using the run design of Chapter 6. To save time it runs in parallel with B's front-end design, which costs **A$500,000**. The process engineer judged the chance of a pass at **0.6**.

- **If it passes**, B goes ahead three months later than it otherwise would. The qualification retires part of the novelty, so the excess of each novel element's growth factor over 1 is cut to 60% of its value, the schedule factors fall to 1.10 and 1.25, and the ramp-up improves to a 97% plateau with a 4-month time constant. The mean NPV of this branch is **A$12,546,926**.
- **If it fails**, the board builds A after all, six months late, and writes off the A$500,000 of B's design. The mean NPV of this branch is **A$9,558,675**.

```figure
type: decision
title: Strategy D: qualify the novel process on the recycler's bales first
question: Does the six-month qualification pass?
caption: This is an illustration. Expected NPV 0.6 × A$12,546,926 + 0.4 × A$9,558,675 = A$11,351,626, which is A$1,325,245 below building A now. Even the pass branch falls A$129,945 short of A.
- * Pass, probability 0.6 | Build B, three months later | qualified novelty growth, 97% plateau: mean NPV A$12,546,926
- Fail, probability 0.4 | Build A, six months late | B's A$500,000 design written off: mean NPV A$9,558,675
- Compare: no qualification | Build A now | mean NPV A$12,676,871
```

The expected NPV of D is **A$11,351,626**, **A$1,325,245** below building A now. The striking part is that even a pass does not beat A. The reason is the yield. A qualification run measures the yield; it does not raise it. Chapter 6 corrected the expected yield to 78.87%, and at the case's P50 inputs a qualified B at that yield is worth A$13,432,811, only **A$153,296** more than A's A$13,279,515. The yield at which a qualified B exactly matches A is **78.75%**, almost exactly the yield the qualification is expected to find. A test whose most likely result leaves the decision where it was is worth little, and this one costs six months and A$600,000.

The general rule, developed in [Paying for information: perfect, sample and useless](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/paying-for-information/) in *Stage Gates and Stopping Rules by the Numbers*, is that information is worth buying only if a plausible result would change the choice. Here, a qualified yield of **80%** would put B **A$1,549,580** ahead of A at P50 inputs. If the board had good reason to think such a result likely, perhaps because cleaner feed could be bought, D would be worth reconsidering. On the evidence it has, a pass most likely confirms 78.9%, and D is the third-best strategy.

## Guarantees and liquidated damages

Supplier B offered to guarantee the yield instead. Its offer: **82% yield**, dry, on feed with no more than 10% contamination, with **liquidated damages (LDs) of A$100,000 for each percentage point** below 82%, capped at **A$700,000**, 10% of the A$7.0 million novel package. LDs are a pre-agreed sum the supplier pays if the plant falls short; they spare both parties the cost of proving the actual loss in court, and they also cap what the owner can recover.

At the expected yield of 78.87% the shortfall is **3.13 points**, so the expected LDs are **A$312,626**, paid once. The shortfall itself costs **A$680,900 every year**, at A$217,800 a point. Over 10 years that is A$6,809,000 undiscounted, or **A$4,568,894** in present value at 8% (an annuity factor of 6.7101). The guarantee covers **6.8%** of the loss it appears to insure. Even the full cap, reached at a yield of 75%, would cover only 15.3% of the present value of the expected shortfall.

```figure
type: balance
title: What the yield guarantee covers against what it leaves with the recycler
left: Covered by the guarantee
right: Left with the recycler
tilt: right
caption: This is an illustration at the expected 78.87% yield. LDs of A$312,626 against a shortfall worth A$4,568,894 over 10 years: 6.8% cover, unsecured, from a supplier whose net assets are about A$2.1 million.
- A$312,626 of LDs, paid once | A$680,900 a year of lost flake and disposal, every year
- Yield shortfall up to 7 points, then capped at A$700,000 | Everything beyond the cap
- Yield only, measured as the contract defines it | Capital cost growth, delay and slow ramp-up
- A promise from a company with A$2.1m net assets | The risk that the supplier cannot pay
```

Two further checks changed the board's view of the offer.

**Security.** The A$700,000 cap is **33.3%** of Supplier B's net assets of about A$2.1 million. A small technology company facing a claim of that size on its first plant may not be able to pay it, so an LD clause without a parent-company guarantee or a bank guarantee is worth less than its face value.

**Wording.** The draft contract measured yield "as weighed at the bagging station", which is wet, on "feed agreed between the parties", with no contamination limit. A plant producing 78.9% saleable flake at 1.0% moisture reads **80.5%** when weighed wet at 3% moisture, so the shortfall would read **1.5 points** instead of 3.13, and the LDs would halve to about A$150,000. The basis defined in Chapter 6, dry saleable flake on feed of stated contamination, has to be written into the guarantee, or the guarantee measures something else. [How contracts shape behaviour: who keeps a dollar saved](/reados/publications/project-teams-and-contracts-by-the-numbers/how-contracts-shape-behaviour/) in *Project Teams and Contracts by the Numbers* sets out who should carry which risk and why.

None of this makes the guarantee worthless. It gives the supplier a reason to make the plant work, and the obligation to measure yield properly is valuable in itself. It does not move much of the risk.

## The error: treating the guarantee as insurance

Once the guarantee was on the table, the project team proposed to **cut B's contingency by the LD cap, A$700,000**, on the argument that the supplier now carried that much of the risk. The independent reviewer showed three things wrong with it. The contingency of Chapter 8 is for capital cost growth; the LDs pay only for a yield shortfall, a different risk, so they cannot replace any of it. Even for yield, the LDs cover 6.8% of the expected loss. And the payment is unsecured against a supplier with A$2.1 million of net assets. The proposal was found when the reviewer asked which line of the risk register each dollar of the guarantee would pay for, and none of them was a capital line. It was reversed, and the contingency stayed at the simulated P80.

## A separable module: strategy C

The third approach takes the part of the novel process that creates most of its value, and adds it to the proven line later, small and separable. In Option A, flake fines below about 6 mm, about 7% of the feed mass, leave with the residue. A **fines-recovery module**, a hyperspectral fines sorter at A$1.6 million and a small hydrocyclone stage at A$0.6 million, **A$2.2 million** estimated, would treat A's 5,040 t a year of residue using A's conventional water treatment. It uses no closed loop, so the TRL 5 element, the one that set the novel process's system readiness, is left out entirely.

This is an illustration. The expected gain is **+5.0 yield points**, 900 t of flake a year, worth A$1,089,000 at A$1,210 a tonne. Less the module's variable cost of A$30 a tonne of residue (A$151,200) and A$80,000 a year of fixed cost, it nets **A$857,800 a year**. Its capital is graded as novel: P50 **A$2,860,000** (×1.30) and P80 A$3,520,000 (×1.60), so simple payback at P50 is 3.33 years. Ordered at month 30 and producing from month 36, its NPV today is **A$1,873,692**.

The module is not ordered blind. It is first qualified on a slip-stream rig fed from A's own residue, from month 18 to month 30, for **A$300,000** (a present value of A$267,292), with a pass probability judged at **0.6**. The module is built only if it passes. The value of this option is about 0.6 × A$1,873,692 − A$267,292 = **A$856,924**. The full simulation, which draws the gain, the capital and the pass at random, puts strategy C's mean NPV at A$13,408,066, **A$731,195** above A alone.

```figure
type: compare
title: Four strategies for the recycler, simulated
cols: Mean NPV | Against A now | What a bad outcome costs
caption: This is an illustration, 10,000 trials per strategy. C is the only strategy that beats A, because its novel step is small, separable, off the main product path and bought only after its own qualification.
- A, proven line now | A$12,676,871 | | little: proven plant, short ramp-up
- B, novel process now | A$8,760,870 | −A$3,916,001 | most: 2.0% of trials below zero
- * C, proven line now, module later | A$13,408,066 | +A$731,195 | the A$300,000 qualification if it fails
- D, qualify B first | A$11,351,626 | −A$1,325,245 | six months and A$1,100,000 if it fails
```

C also improves the bad outcomes, not only the average. Its P10 NPV is A$11,051,836 against A's A$10,927,083, and its P90 is A$15,959,907 against A$14,397,617. The worst trials of C are trials in which the module failed its qualification and only the A$300,000 was lost; the best are trials in which it passed and added about A$860,000 a year. B's P10, by contrast, is A$3,281,476.

C works for reasons that generalise. The novel part is a small share of the whole: A$2.2 million in an A$18.2 million plant, 12.1%, as Chapter 3's exercise found. It sits on the residue stream, so if it underperforms, the main product is untouched. It is qualified on the recycler's own residue before it is bought. And the decision to buy is taken at month 30, with evidence, rather than at month 0 without it. [What the NPV spreadsheet hides](/reados/collections/investment-appraisal-and-business-cases/what-the-npv-spreadsheet-hides/) is a reminder that each of these features changes the timing and the incremental cash, which is why C has to be valued as a strategy, not as a line item. [Chapter 10](/reados/publications/first-of-a-kind-technology-by-the-numbers/choosing-and-following-through/) follows the board's choice of C and the qualification that decided the module.

## Other ways to buy the risk down

The three strategies valued here are not the only ones, and a board facing a similar choice should at least list the others before settling.

- **Be second.** Wait for another owner to build the first full-scale plant, and buy the second with its lessons. The cost is the contribution forgone while waiting, and the risk that the first plant's owner keeps its lessons to itself.
- **Build smaller first.** A first train at a fraction of the design rate, with space and connections for more, turns one large first-of-a-kind plant into a small one followed by a second-of-a-kind. It costs economies of scale and some duplicated work.
- **Share the outcome with the supplier.** A supplier confident in its yield can take part of its price as a share of the extra flake, or build, own and operate the novel section for a fee per tonne. That moves more risk than an LD clause, but only to a supplier with the balance sheet to carry it.
- **Keep the option to switch.** Design the proven line so that a later module can be connected without a long shutdown, which is the physical side of strategy C.

Each of these can be valued with the same model, as a change in expected NPV and in its spread against the best choice available now. [Waiting, testing or proceeding: simple real options](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/waiting-testing-or-proceeding/) sets out the method for valuing the right to wait or to add a step later.

## Exercise: the yield that would justify qualifying

At the case's P50 inputs, a qualified B is worth A$13,432,811 at 78.9% yield, A$14,829,095 at 80% and A$16,068,844 at 81%, against A$13,279,515 for A. At what qualified yield does B exactly match A, and how far ahead would it be at 81%? What does that say about strategy D?

**Worked answer.** Between 78.9% and 80%, qualified B gains (14,829,095 − 13,432,811) ÷ 1.1 ≈ A$1.27 million of NPV per yield point. It matches A where its lead of A$153,296 at 78.9% is used up, about 0.12 points lower: the case model's exact break-even is **78.75%**. At 81% B's lead is 16,068,844 − 13,279,515 = **A$2,789,330**. So qualification pays only if the board has real reason to expect a qualified yield of 80% or more. With an expected yield of 78.87%, sitting on the break-even, the most likely result of the test is a decision unchanged, which is why D's expected NPV falls short of A's. A cheaper or shorter test would not fix this; only evidence that the yield could be materially higher, such as a supply of cleaner bales, would.
