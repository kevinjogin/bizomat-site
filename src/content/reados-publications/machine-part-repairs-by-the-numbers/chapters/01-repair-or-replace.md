---
book: machine-part-repairs-by-the-numbers
chapterSlug: repair-or-replace
order: 1
title: "Repair or replace"
description: "Decide whether to repair or replace a broken machine part by counting the new part's price, the downtime, the chance the repair fails and its cost, and the parts that must never be repaired."
draft: false
---

When a machine part breaks, the first question is not how to repair it but whether to. A new part from the maker restores the machine to its design, with the maker's materials, heat treatment and tolerances, and its cost and lead time are known, if the part is still made. A repair may be far cheaper and far quicker, which is why the repair welding shops of a century ago flourished: Dunham wrote in 1917 that welding restored broken frames, smashed cylinders and cracked crank cases and gear cases for a small part of what new parts cost. But a repair also carries a risk that the new part does not, the risk that it fails again, and for some parts that risk is not acceptable at any price.

This chapter sets out the factors in the decision, puts them into a simple expected-cost calculation for the repairer's first job of the season, and identifies the parts that should be replaced whatever the numbers say.

## What the decision weighs

A repair-or-replace decision weighs five things:

- **the cost of the new part**, including freight and any machining or fitting it needs;
- **the cost of the repair**, including labour, materials, machining, testing and fitting;
- **the downtime** while each option is carried out, and what that downtime costs the owner;
- **the risk that the repair fails** in service, and the cost of that failure, including more downtime, a new part after all, and any damage the failure causes;
- **the consequences for safety**, if the part's failure could injure anyone.

The first two are usually easy to find from the maker's price list and the repairer's quote. The third is often the largest, and the fourth is the hardest to estimate. The fifth overrides all the others. Writing all five down, even roughly, makes the decision visible to the owner.

## The cost of downtime

A stopped machine costs its owner the work it would have done. For a harvesting contractor in the middle of the season, a day without a harvester may cost thousands of dollars in lost contract income, idle crew and crops at risk; for a factory, a day without a press may stop a production line. The same broken part is a minor inconvenience in the off-season and an emergency in the busy season. A repairer who asks the owner what a day of downtime costs learns more about the right decision than from any other question.

## The running case: the harvester gearbox shaft

This is an illustration. A harvesting contractor brings in the output shaft from a harvester's gearbox in the second week of harvest. One bearing journal is worn about 0.8 mm undersize, and the bearing has spun on it. A new shaft from the maker costs about **A$2,800**, excluding GST, but the maker's nearest stock is overseas, with a lead time of about three weeks. The contractor estimates that each day without the harvester costs about **A$4,000** in lost contract work.

The repairer can build up the worn journal by welding, machine it back to size and return the shaft in about a day and a half, for about **A$900**. Based on the shaft's condition, the repairer judges, as an illustration, a 10% chance that the repair will fail during the season, which would cost about two more days of downtime and a new shaft after all.

## The expected cost of each option

```figure
type: formula
title: Expected cost of repairing the gearbox shaft
formula: expected cost = repair + downtime + P(failure) × cost of failure
caption: This is an illustration, excluding GST. The probability of failure is a judgement, not a measurement; the calculation shows how much the decision depends on it.
- Repair, 1.5 days downtime | A$900 + 1.5 × A$4,000
- Chance of failure in the season | 10%
- Cost if it fails | 2 days × A$4,000 + A$2,800 for a new shaft
step: repair and its downtime: 900 + 6,000 = A$6,900
step: expected failure cost: 0.10 × (8,000 + 2,800) = A$1,080
step: expected cost of repairing ≈ A$7,980
```

Replacing the shaft costs A$2,800 for the part plus three weeks, about 21 days, of downtime at A$4,000 a day, about **A$86,800**, if the harvester stands idle waiting for it.

```figure
type: bars
title: Expected cost of each option for the harvester shaft
unit: A$, excluding GST
max: 90000
caption: This is an illustration. Downtime dominates both options. The third option repairs the shaft for the season and fits a new one, ordered at once, in the off-season.
- *Repair now | 7980
- Repair now, new shaft fitted after harvest | 10780
- Wait for a new shaft | 86800
```

On these numbers, waiting for a new shaft is out of the question during harvest. The best option is often a combination: repair the shaft now, order a new one at the same time, and fit the new one in the off-season, when downtime costs little. That costs about A$10,780, of which A$2,800 is the new shaft, and removes the risk of the repair for the following seasons.

## How much the probability matters

The probability of failure is a judgement, and it is worth testing how much it matters. At a 30% chance of failure, the expected cost of repairing rises from about A$7,980 to about A$10,140, still far below waiting. The decision here is robust: even a fairly unreliable repair beats three weeks of downtime. In other cases, with a short lead time on the new part, low downtime costs or a high cost of failure, the decision can be much closer, and the probability matters more.

## When the cost of failure includes damage

Some failures damage more than the part. A repaired gear tooth that breaks off can jam the gearbox and wreck the other gears and bearings; a repaired shaft that breaks can throw a pulley or a coupling. The cost of failure must include that collateral damage, which can make a cheap repair a poor bet. The repairer's judgement of what happens if the repair fails is as important as the judgement of how likely it is. For the harvester shaft, a failed journal repair would most likely spin the bearing again rather than break the shaft, which kept the cost of failure to downtime and a new part; a repair whose failure would wreck the gearbox would have needed a far lower chance of failure to be worth making.

## Talking to the owner

The owner of the machine makes the final decision, and the repairer's job is to give them the information to make it. That means explaining, in plain terms, what is wrong, what the options are, what each costs and how long it takes, what the repair can and cannot be expected to do, and what could happen if it fails. Owners who understand that a repair is a calculated risk are far more likely to accept the recommendation to fit a new part later, and far less likely to blame the repairer if the risk turns out badly. The repairer records the advice on the job card, with the owner's decision, which protects both of them.

## Checking the part is really the problem

Before deciding anything, the repairer confirms that the part brought in is the cause of the machine's trouble, and that it is the only part affected. A spun bearing has damaged the shaft, but it may also have damaged the housing bore it sits in, overheated the seals, or sent metal debris through the gearbox. A broken tooth may have chipped the teeth of the gear it meshed with. Repairing the shaft and refitting it to a scored housing, or a new gear to a damaged mate, wastes the repair. The repairer inspects the machine, or asks the owner to bring the related parts, before quoting, and the decision covers the whole damage, not only the part that broke.

## The value of a spare

A part that fails once on a machine that matters may fail again, and a spare on the shelf turns weeks of downtime into hours. The harvester shaft calculation shows why: almost all the cost of the "wait" option was downtime, not the part. When the repairer orders a new shaft to fit in the off-season, the repaired shaft can then become the spare. Owners of critical machines often keep spares of the parts most likely to fail for exactly this reason, and a repairer who suggests it is giving advice worth more than the repair.

## Parts that must be replaced

For some parts, the cost of failure includes injury or death, and no saving in money or downtime justifies the risk of an uncertain repair. These include, among others:

- **vehicle steering, braking and suspension parts**, governed by vehicle standards and regulators, which commonly prohibit welding repairs to steering components;
- **lifting equipment** such as hooks, chains, shackles and the structural parts of cranes and hoists, governed by their standards and makers;
- **pressure-retaining parts** of boilers and pressure vessels, unless repaired under the applicable repair standard by people qualified for it;
- **parts the maker says must not be repaired**, often hardened, high-strength or heat-treated parts whose properties welding would destroy.

Chapter 9 returns to vehicle and trailer parts. For these parts, the decision is not a calculation: they are replaced, or the machine stays stopped until they are.

## The remaining life of the machine

A repair should be judged against the machine's remaining life and value. Repairing a part on an old machine near the end of its life may be the right answer even if the repair will not last as long as a new part, because the machine itself will not; fitting an expensive new part to a machine that will be scrapped in a year may be money wasted. Conversely, a repair on a new, valuable machine should be at least as durable as the original, or be treated as temporary.

## Capability and honesty

A repair is only an option if the repairer can do it well. Building up a journal needs welding skill, a lathe big enough to turn the shaft and the knowledge to choose a filler and preheat; repairing a gear needs the ability to cut or grind a tooth profile; repairing a cracked housing may need line boring. A repairer who lacks the capability for a particular repair serves the owner best by saying so and referring the job, or by quoting a new part, rather than attempting it.

## Temporary and permanent repairs

Dunham drew a clear line between emergency and permanent repairs when he discussed springs, which he said should rarely be welded and only as an emergency measure, with the understanding that the repair was not permanent, when no spring was available. The distinction is still useful. A temporary repair gets a machine running until a permanent repair or a new part can be fitted, and it should be labelled and recorded as temporary, with the owner told plainly and in writing. A permanent repair is designed and proved to last. Treating a temporary repair as permanent, because it held for a while, is one of the commonest causes of repeat failures.

## Obsolete parts

For older machines, the new part may simply not exist. Then the choice is between repairing the old part, making a new one, or adapting a part from another machine. Making a new part from a drawing or by measuring the old one is often the best answer for simple parts such as shafts, bushes and pins, and the repairer's machining capability decides what is possible. For complex parts such as gears and castings, repair is often the only practical choice, and its quality becomes correspondingly more important.

## A failure: the repair that repeated

This is an illustration. The previous season, the repairer had built up and remachined a worn pulley shaft on a contractor's baler. It failed again within a month, worn in exactly the same place. The repair itself had been sound; the cause of the wear, a misaligned pulley that loaded the bearing unevenly, had not been found or fixed.

The lesson was that a repair restores a part, not the conditions that wore it out. A part that has failed should be read for the cause of its failure before it is repaired, which is the subject of Chapter 2, and the repair should include fixing the cause, or it will be repeated.

## Exercise: a closer decision

A factory's conveyor drive shaft has a worn keyway. A new shaft costs A$1,200 and can be delivered in two days; the factory's downtime costs about A$1,500 a day. The repair, welding up the keyway and cutting a new one, costs about A$600 and takes one day. The repairer judges a 15% chance that the repair fails within a year, which would cost another day of downtime and a new shaft. Compare the expected costs.

Replacing costs 1,200 + 2 × 1,500 = **A$4,200**. Repairing costs 600 + 1 × 1,500 = A$2,100, plus an expected failure cost of 0.15 × (1,500 + 1,200) ≈ A$405, about **A$2,505**.

Repair is cheaper by about A$1,700 on these numbers. But the margin is narrower than for the harvester shaft, and if the probability of failure were much higher, above about 78%, where the expected costs meet, or the shaft were safety-critical, replacement would win. The factory might also order a new shaft now as a spare, so that the next failure costs only the time to fit it.
