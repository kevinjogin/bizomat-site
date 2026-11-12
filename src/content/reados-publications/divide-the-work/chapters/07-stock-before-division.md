---
book: divide-the-work
chapterSlug: stock-before-division
order: 7
title: "Stock before division: work in progress, lead time and working capital"
description: "Smith argued that stock must be built up before work can be divided. How a divided flow ties up work in progress and cash, how Little's law links stock to lead time, and how to cap both deliberately."
draft: false
---

Smith opens the second book of *The Wealth of Nations* with a point that is easy to skip past: before work can be divided, a stock of goods must already have been accumulated. A weaver can devote themselves entirely to weaving only if someone has already stored up the food they will eat, the materials they will use and the tools they will need until their cloth is finished and sold. The finer the division of labour, Smith adds, the more stock is needed, because each worker's output takes longer to become something saleable and because divided work leads to more tools and machines.

Emma Rothschild and Amartya Sen, in their chapter of the *Cambridge Companion to Adam Smith*, stress how central this is to Smith's account: the accumulation of stock comes before the division of labour, not after it. For a small engineering business, stock means three things: the materials and partly built products moving through the workshop, the tools and equipment that stations need, and the cash that carries the business between paying for materials and wages and being paid by customers. This chapter measures each one for the bench maker's contract.

## Work in progress and lead time

This is an illustration. In the third month of the contract, the owner counts the benches somewhere between the first cut and the finished, wrapped product: tops cut but not folded, frames waiting to be welded, frames waiting for fitting, benches at polishing, benches waiting for inspection. On average there are about **14** benches in progress. The line finishes three a day.

Little's law, published by the operations researcher John Little in 1961, links these quantities for any stable process: the average work in progress equals the throughput multiplied by the average time each item spends in the process. Rearranged, the average lead time is the work in progress divided by the throughput.

The [WIP and lead time tool](/tools/wip-lead-time-check/) in BIZOMAT Tools applies Little's law. From the work in progress, the throughput per day, the value-added time per unit and the working hours per day, it gives the average lead time in days and working hours, the flow efficiency (value-added time as a share of lead time), and the work-in-progress limit that would give a target lead time at the same throughput. It notes that the law holds for a stable system, with work in progress and throughput measured over the same period and no growing backlog.

With 14 benches in progress, three finished a day, 372 minutes of work per bench, 7.6 working hours a day and a target lead time of three days, the tool gives:

```figure
type: stats
title: Work in progress on the bench line, third month
caption: This is an illustration. Results from the WIP and lead time tool. A bench spends about four and two-thirds working days in the workshop but receives just over six hours of work.
- 4.67 days | average lead time | 14 benches in progress at 3 a day
- 35.5 h | lead time in working hours | against 6.2 hours of work per bench
- *17.5% | flow efficiency | the share of a bench's time in the workshop spent being worked on
- 9 benches | WIP limit for a 3-day lead time | a reduction of 5
```

The lead time of 4.67 days is longer than the distributor's expectation of three working days from order to dispatch. And the flow efficiency of 17.5% says that for more than four-fifths of its time in the workshop, a bench is waiting.

## Where the waiting comes from

Some waiting is the price of dividing the work: each bench now passes through three stations, and the small buffers recommended in Chapter 6 hold a bench or two between them. That waiting is deliberate, and it buys steadier flow. But the count shows more than that. Tops are being cut and folded in batches of five, a habit carried over from the generalist days, so several finished tops wait for their frames. The welder, keen to stay ahead, sometimes welds two or three frames beyond what polishing can take. Benches finished late in the day wait overnight for inspection.

None of these is unreasonable on its own. Together they hold about five more benches in progress than the line needs.

## The failure case: stock that hid the line's problems

The extra stock did more than lengthen lead time. Because finished tops and frames were always waiting, the line never visibly stopped. When the polisher was off sick for two days in the second month, the business kept dispatching from the benches already part-built, and the absence was barely noticed. That sounds like an advantage, but it meant nobody saw that the polishing station had no trained cover until it happened again for a week and dispatches stopped altogether.

High work in progress also slowed the discovery of faults. The weld shrinkage problem described in Chapter 4 was found three weeks into production, by which time about 20 frames had been welded narrow. With fewer benches in progress, the first narrow frame would have reached the top fitting within a day.

### How it is detected

Little's law gives the detection directly: if the lead time calculated from work in progress and throughput is longer than the target, there is more stock in the line than the target allows. A weekly count of benches in progress, taken at the same time each week, is enough to track it.

### How it is corrected

The owner caps work in progress at **nine benches**, the limit the tool gives for a three-day lead time at three a day. The cap is made physical: marked floor squares in front of each station, two in front of welding, two in front of polishing, one each elsewhere, and a rule that a station does not start a new bench if the square after it is full. Cutting moves from batches of five to batches of two. With nine benches in progress, the tool gives a lead time of **3.0 days** and a flow efficiency of about **27%**.

The cap also makes problems visible. When the polisher is absent, squares in front of polishing fill within a day and the rest of the line stops, which forces the cover question into the open. That is uncomfortable, and it is the point.

### Finished stock is not the same as work in progress

Chapter 5 recommended a small buffer of finished benches to absorb weekly peaks in orders. That might seem to contradict the cap on work in progress, but the two kinds of stock behave differently. A finished bench has been through every station and inspection, so it carries no hidden faults and can be shipped the moment an order arrives. A part-built bench in the line carries every defect not yet found, delays the discovery of problems, and adds to lead time without being available to ship.

The owner therefore holds the buffer deliberately at the end of the line, sized to the peaks the distributor's order pattern shows, and keeps the line itself lean. If extra stock is needed, it is better held as finished goods or as raw material, both of which are easy to count and easy to use, than as half-built benches scattered between stations.

## Stock in tools and equipment

Smith's second kind of stock is the tools and machines that divided work requires. Generalists shared one welding set-up, one polishing set-up and one set of hand tools, each moved to where the work was. Stations need each set in its own place. The bench maker's station equipment so far includes the welding bay and duplicate hand tools from Chapter 3 at A$9,500, the leg-frame fixture from Chapter 4 at A$4,800, and the floor marking and trolleys for the work-in-progress squares, a few hundred dollars more.

This is the stock that makes the division of work possible, and it must be paid for before the gains arrive. It is modest for a small workshop, but in a larger reorganisation, with dedicated machines at each station, it can be the largest single cost.

## Stock in cash: the working capital of a larger market

The third kind of stock is the one that most often catches growing businesses out. Under the old arrangement, the bench maker sold about six benches a week directly to food plants, at about A$2,400 each excluding GST, paid within about 14 days. Under the contract, it sells fifteen a week to the distributor at about **A$1,980** each excluding GST, paid **45 days** after delivery. Material for a bench costs about **A$640** excluding GST, bought on 30-day terms. These figures are an illustration.

The owner estimates the cash tied up in the business at the contract volume, excluding GST throughout:

- **Raw material stock**, about two weeks of sheet and tube for 30 benches: about **A$19,200**.
- **Work in progress**, 14 benches valued at material plus about half their labour, roughly A$832 each: about **A$11,650**.
- **Finished benches** held as a peak buffer, four at material plus labour: about **A$4,100**.
- **Money owed by the distributor**: 45 days of sales at A$29,700 a week, about **A$190,900**.
- Less **money owed to suppliers**: 30 days of material at A$9,600 a week, about **A$41,100**.

That gives net working capital of about **A$184,700**, against about **A$22,500** under the old arrangement.

```figure
type: bars
title: Cash tied up in the business, before and after the contract
unit: A$'000
max: 200
caption: This is an illustration, excluding GST. Most of the increase is the distributor's 45-day payment terms on a larger volume, not the workshop's own stock. GST collected and paid adds its own timing, which depends on the business's reporting period.
- Old arrangement, about 6 benches a week | 22.5
- *Contract, 15 benches a week, 14 in progress | 184.7
```

The workshop's own stock, materials, work in progress and finished benches, is about A$35,000 of the total. The rest is the distributor's payment terms, multiplied by a larger volume. This is Smith's point in its most practical form: a larger market supports a finer division of work, but someone has to carry the stock while the larger market pays. A small business can be profitable on every bench and still run out of cash in the first three months of a contract like this.

The owner arranges a working capital facility with the bank before the contract starts, negotiates a 30-day term for the first three months while volume ramps up, and caps work in progress, which recovers about A$4,000 of the work-in-progress figure. Each measure is modest; together they keep the business inside its limits during the ramp.

### GST adds its own timing

The figures above exclude GST, but the cash moving through the business does not. The bench maker charges GST on its invoices to the distributor and pays GST on its material purchases, and the difference is reported and paid on its business activity statement. When the distributor pays 45 days after delivery, the business may have to account for GST on a sale before it has received the money for it, depending on whether it reports GST on a cash or accruals basis. That can widen the cash gap for a while.

This is a question for the business's accountant and the Australian Taxation Office's guidance on GST reporting methods, not for a workshop calculation. The practical point for the owner is to include GST timing in the cash forecast for the ramp-up months, rather than discovering it when the first activity statement under the contract falls due.

## What to measure each week

A small business does not need an elaborate inventory system to keep stock under control during a change like this. The owner tracks four numbers every Friday, on the same whiteboard as the station counts from Chapter 6:

- benches in progress, counted on the floor squares;
- benches finished and waiting for dispatch;
- sheet and tube in stock, in benches' worth;
- money owed by the distributor and by other customers, from the accounts.

Each number has a target and a limit. When one moves outside its limit, it is discussed at the Monday meeting. That is the whole system, and it is enough to stop stock growing quietly until it shows up as a long lead time or an overdraft.

## Stock and the division of work, together

```figure
type: compare
title: The three kinds of stock a divided flow needs
cols: What it is | Bench maker at contract volume | How it is controlled
caption: This is an illustration. Each kind of stock is a precondition of dividing the work, as Smith argued, and each grows with the market the division serves.
- Work in progress | Benches between first cut and dispatch | 14, capped to 9 | Little's law, floor squares, small batches
- Tools and equipment | Station sets, fixtures, trolleys | About A$14,800 so far | Costed and paid back from measured gains
- *Cash | Materials, stock and money owed less money owing | About A$184,700 | Facility, payment terms, WIP cap
```

## Exercise: faster throughput, same stock

Suppose that after the polishing jig, the line can finish **3.5 benches a day**, but the work in progress stays at **14**. Using the WIP and lead time tool's method with 372 minutes of work per bench and 7.6 hours a day, find the lead time, the flow efficiency, and the work-in-progress limit for a three-day lead time.

**Worked answer.** The lead time is 14 ÷ 3.5 = **4.0 days**, or 30.4 working hours. The flow efficiency is 6.2 hours of work divided by 30.4 hours of lead time, about **20.4%**. The work-in-progress limit for three days is 3 × 3.5 = **10.5** benches, which the tool displays rounded to 11; in whole benches, a cap of **10** meets the target, a reduction of four.

The result shows that faster throughput alone does not deliver a short lead time if the stock in the line is left as it was. The lead time improves from 4.67 days to 4.0, because the line clears benches faster, but it still misses three days. Raising throughput and capping work in progress work together: the cap can rise slightly as throughput rises, from 9 to 10, but it still needs to be set and kept.
