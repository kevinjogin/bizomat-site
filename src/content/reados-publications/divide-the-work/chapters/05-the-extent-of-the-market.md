---
book: divide-the-work
chapterSlug: the-extent-of-the-market
order: 5
title: "The extent of the market: when there is enough work to divide"
description: "Smith's limit on dividing work, applied to roles: how to test whether demand keeps a specialised role busy, why sustained demand rather than peaks should decide, and what to do in between."
draft: false
---

Smith's third chapter carries one of his most useful ideas, and its title says it: the division of labour is limited by the extent of the market. A person can specialise only if there is enough demand for their one kind of work to keep them occupied and paid. In a remote Highland farmhouse, Smith observed, every family had to be its own butcher, baker and brewer, because no village was large enough to support a specialist. A country carpenter did joinery, cabinet making, wheelwright's work and more, because no single trade had enough customers nearby. Cities and coasts, where cheap water carriage widened each trade's market, supported far finer divisions.

For a small engineering business the question is concrete. Before creating a specialised role, is there enough work of that one kind to keep a person usefully busy? This chapter turns the question into a capacity calculation, applies it to the bench maker at three volumes, and shows what goes wrong when a role is created on a peak rather than on sustained demand.

## The market decides the division

This is an illustration. Under the generalist arrangement, each fabricator spent a third or so of their time welding. At six benches a week, welding was about 18 hours of work a week across the whole business: 180 minutes a frame times six frames. That is less than half of one person's working week.

If the owner had created a dedicated welder at that volume, the welder would have been idle, or doing other things badly, for much of the week. The gains from dexterity, switching and invention would have been bought with a large amount of unused time. The distributor contract changes the arithmetic, and that is precisely Smith's point: the same workshop, the same people and the same product support a different division of work once the market grows.

## Test the role's utilisation

The [capacity check tool](/tools/capacity/) in BIZOMAT Tools converts working time, cycle time and efficiency into realistic output and utilisation. From the available hours in a period, the number of parallel stations, the cycle time per unit, a realistic efficiency and the demand for the period, it gives the practical capacity, the utilisation of that capacity and the buffer or shortfall. Its guidance is to plan at about 85% utilisation, to leave room for breakdowns and variation.

For a single welder working 38 hours a week at 85% efficiency, the owner tests the welding station at the volumes in question:

```figure
type: bars
title: Utilisation of a dedicated welder
unit: %
max: 140
caption: This is an illustration. Results from the capacity check tool at 38 hours a week and 85% efficiency. At six benches a week a welder would be idle nearly half the time; at fifteen with the early weld time, overloaded; with learning and the fixture, close to the 85% planning level.
- 6 a week, 180 min a frame | 55.7
- 10 a week, 180 min a frame | 92.9
- 15 a week, 180 min a frame, early | 139.3
- *15 a week, 116 min a frame, with learning and fixture | 89.8
```

The bars tell the story of the decision.

- **At six a week**, the welder would be **55.7%** utilised: practical capacity about 10.8 frames a week against demand of 6. There is not enough welding to justify a welder.
- **At ten a week**, utilisation rises to **92.9%**, already above the 85% planning level, and the welder would be busy enough. This is the volume at which a dedicated welder starts to make sense.
- **At fifteen a week, with the early weld time**, utilisation would be **139.3%**. One welder cannot carry the load until learning and the fixture bring the time down. That is the arithmetic behind the ramp plan in Chapter 1.
- **At fifteen a week, with learning and the fixture**, at 116 minutes a frame, capacity rises to about 16.7 frames a week and utilisation falls to **89.8%**. One welder now carries the load, a little above the planning level, with a buffer of under two frames a week.

The same test applied to the other stations shows similar patterns. The cutting and folding station, at 96 minutes a bench, would be only about 30% utilised at six benches a week: far too little for a dedicated folder. At fifteen, with the assembly work Chapter 6 moves there, it becomes a full role.

## The failure case: a role created on a peak

The owner has made this mistake before. Two years earlier, after a run of orders lifted demand to about nine benches a week for six weeks, he hired a dedicated polisher. Polishing and assembly took about 160 minutes a bench, and at nine benches a week the polisher was busy.

Then demand fell back to its usual six. At six benches a week and 160 minutes each, the capacity check tool gives a utilisation of **49.5%**. The polisher was idle for half of each week, or filling in at other jobs without the skills for them. The arrangement suited nobody. After seven months the polisher left, and the business lost both the recruitment cost and the polishing skill it had built.

The decision had been made on a peak. Six weeks of high demand is not the extent of a market; it is a fluctuation in it.

### How it is detected

The detection is to test any proposed role at the **sustained** level of demand, not the recent maximum, before creating it. Sustained demand means what the business can reasonably expect over the next year or more: a signed contract, a stable customer base, or a trend over several quarters, not the last month. The owner now writes down, for any new specialised role, the demand assumption, its source and the utilisation at that demand, and tests the role at the low end of the expected range as well.

Estimating sustained demand is itself a judgement, and it helps to be explicit about the evidence behind it. In rough order of strength:

- **committed volume**, such as a signed contract with minimum quantities;
- **repeat history**, such as several years of orders from the same customers at a stable level;
- **a trend over several quarters**, not weeks, with the reasons for it understood;
- **a weighted pipeline** of likely orders, discounted for the chance each one does not proceed.

A recent peak on its own is the weakest evidence of all, because it is the one most likely to reverse. The polisher was hired on exactly that.

### How it is corrected

For the distributor contract, the demand assumption is the contract's committed fifteen benches a week for at least a year, with the distributor's history giving some confidence in the volume. The welder role passes the test at 89.8% once learning and the fixture are in place. The polishing and assembly role passes only after the rebalancing in Chapter 6. The owner also includes a review point: if the contract volume drops below about ten benches a week for two consecutive months, the station arrangement will be reviewed, because below that level the specialised roles start to lose their utilisation.

## Demand is not a constant

Fifteen benches a week is an average, and real weeks vary. The distributor's orders arrive in batches tied to its own customers' projects. In the first quarter of the contract, weekly orders ranged from 11 to 19 benches.

At 19 benches in a week, the welding station with the fixture would be at **113.7%** utilisation: about two frames short. A single dedicated role has no slack to absorb peaks; a team of generalists does, because anyone can pick up welding in a busy week. Dividing the work trades some flexibility for productivity, and the trade must be managed.

The owner uses three measures, all common in small businesses:

- **A modest finished-goods buffer.** A few completed benches in stock smooth the weekly peaks without overtime, at the cost of the working capital examined in Chapter 7.
- **Agreed lead times with the distributor.** A delivery commitment of ten working days rather than five lets a peak week's orders spread into the following week.
- **A second person competent at welding.** The cross-training in Chapter 9 gives a second welder for peak weeks and for the primary welder's leave.

```figure
type: compare
title: Specialised roles at different volumes
cols: Utilisation of a dedicated welder | Sensible arrangement
caption: This is an illustration. Utilisation from the capacity check tool with the weld time expected at each volume. The middle range, where a role is partly but not fully justified, is common in growing businesses.
- 6 a week | 55.7% at 180 min | Generalists, perhaps batching (Chapter 3)
- 10 a week | 92.9% at 180 min | One person primarily welding, others able to help
- *15 a week, after the ramp | 89.8% at 116 min | Dedicated welder with trained cover
- 19 a week, peak | 113.7% at 116 min | Buffer stock, agreed lead times, second welder
```

## In between: primary roles

Between the volume at which a role is clearly unjustified and the volume at which it is clearly full, there is a wide middle range. In that range, a **primary role** often works better than a fully dedicated one. Each person has a primary station, where they do most of their work and accumulate most of their repetitions, and a secondary station where they help when needed.

At ten benches a week, for example, one fabricator could weld most frames, gaining most of the dexterity and fixture benefits, while also cutting or polishing for part of the week. The switching gain is smaller than at full stations, because the person still changes tasks, but the changes are fewer and can be scheduled, for example welding every morning and polishing every afternoon. This keeps the business flexible while capturing much of what Smith described.

```figure
type: matrix
title: Choosing how to divide the work
x: Sustained volume of this kind of work
y: Variety between jobs
hot: 2
caption: This is an illustration. Dedicated roles suit high, steady volume of similar work; generalists suit low volume or high variety. The bench maker's B-series work moved from the left column to the right when the contract arrived.
- Low variety, low volume | Generalists; batch similar jobs together
- Low variety, high volume | Dedicated stations: the B-series under the contract
- High variety, low volume | Generalists with whole-job ownership: custom work
- High variety, high volume | Primary roles with cross-training; consider cells by product family
```

## Reaching a wider market costs something

Smith's coastal towns had wide markets because water carriage was cheap. The bench maker's wider market is reached through a distributor and road freight to two capital cities, and neither is free. The distributor takes a margin, which lowers the price per bench. Freight and packaging add cost, and a bench that arrives scratched or dented costs the margin on several others. The contract also brings obligations the business did not have before: delivery windows, packaging standards and a returns process.

Those costs belong in the decision to divide the work, because they are part of what makes the larger market possible. The owner adds a packing step to the assembly station, with a written packaging standard agreed with the distributor, and includes freight damage in the monthly review. A larger market supports a finer division of work only if the business can serve it at a cost the price covers.

## Each role has its own market

The capacity test applies to every role, not only to the workshop stations. The contract increases the office work too: more quotes for variants, more purchase orders, more freight bookings, more invoices. The owner considers creating a dedicated purchasing and logistics role. Testing it the same way, with the hours of purchasing and freight work the contract adds against one person's productive hours, shows that the work would fill about half a role. The answer, for now, is a part-time position combined with reception and invoicing, a primary role rather than a dedicated one.

Within a business, the market for a role is the volume of that role's work, whoever it comes from. Smith's limit applies at every scale: the economy, the firm and each position within it.

## The market and the division reinforce each other

Smith's chapter has a dynamic reading that the economist Allyn Young developed in 1928: the division of labour depends on the extent of the market, and the extent of the market depends in part on the division of labour. When dividing work lowers the cost of a product, the product can be sold more cheaply or more widely, which enlarges the market, which supports a finer division of work, and so on.

The bench maker sees a small version of this. The distributor offered the contract partly because the business could quote a competitive price at volume, and the station arrangement is what makes that price sustainable. The lower cost per bench may in turn open other distributors in other cities, the modern equivalent of Smith's water carriage. The sequence matters, though. The business took on the market first, with a committed contract, and divided the work second. Dividing first in the hope that the market would follow is the bet that Smith's limit warns against.

## Exercise: a dedicated folder

At fifteen benches a week, the cutting and folding work takes **96 minutes** a bench before any assembly is moved to that station. The owner is considering whether the cutting and folding role is justified on its own. Use the capacity check tool's method with 38 hours a week, 85% efficiency and one station. What is the utilisation at fifteen benches a week, and at six? What do the results suggest?

**Worked answer.** Practical capacity is 38 × 60 × 0.85 ÷ 96 = **20.2** benches a week. At fifteen a week, utilisation is 15 ÷ 20.2 = **74.3%**; at six a week, it is 6 ÷ 20.2 = **29.7%**.

At fifteen a week, a dedicated folder would be about three-quarters busy: below the 85% planning level, with about a quarter of the week available. The role is justified only if that spare time is used, which is exactly what Chapter 6 proposes by moving some assembly work to the folding station. At six a week, a dedicated folder would be idle for most of the week, which confirms that at the old volume the generalist arrangement was right. The market, not the attractiveness of the station layout, decides whether the role exists.
