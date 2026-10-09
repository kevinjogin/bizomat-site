---
title: "Cutting lead time with flow and pull: batch sizes, work in progress, cells and kanban"
description: "Most of a job's lead time is spent waiting, not being worked on. How work in progress, batch size and utilisation drive lead time, and how flow, cells and pull signals shorten it."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - process-improvement
  - operations
author: "KEVOS"
featured: false
draft: false
---

Ask a manufacturer why their lead time is three weeks and the answer is usually about capacity: the machines are busy, the welders are flat out, the paint shop is booked. Then follow one order through the factory with a stopwatch. The parts are cut in an hour, folded in another, welded in half a day, coated and assembled in a day. The other two and a half weeks are spent waiting: in a queue in front of the press brake, on a pallet beside the welding bay, on a rack outside the paint booth, in a corner because one component has not arrived. The work is slow not because the people are slow, but because the job spends most of its life waiting.

That gap between the time spent working on a product and the time it takes to get through the factory is where lead time is won or lost. It is driven by how much work in progress sits in the system, how large the batches are, how fully the key resources are loaded and how work is released to the floor. Change those, and lead time can fall dramatically, often without new equipment or extra people.

This article explains the relationships that govern lead time, why large batches and full utilisation make it longer, how to see the flow with value stream maps and spaghetti diagrams, and how cells, takt time and pull systems such as kanban shorten it. It is general information for owners, operations managers and engineers in manufacturing and fabrication businesses, and the principles apply to many office and service processes too.

## Lead time is mostly waiting

**Lead time** is the total elapsed time for a job to pass through a process, from release or order to completion. **Process time** is the time someone or something is actually working on it. In most batch manufacturing, process time is a small fraction of lead time, often only a few percent. The rest is queueing, waiting for the rest of the batch, waiting for other components, waiting for transport, waiting for a decision.

That matters for two reasons. It means faster machines or harder-working people rarely shorten lead time much, because they attack the small part. And it means that reducing the waiting, which is mostly a matter of how work is organised, can shorten lead time a great deal.

## Little's law: work in progress equals waiting

A simple relationship, known as **Little's law**, links three averages in any stable process:

**Average lead time = average work in progress ÷ average throughput**

**Work in progress (WIP)** is everything released but not finished. **Throughput** is the rate at which jobs are completed. If a fabrication shop has 480 frames somewhere between cutting and dispatch and completes 40 frames a day, the average frame takes 480 ÷ 40 = 12 days to get through, whatever the individual operation times.

The implication is powerful. If throughput stays the same, the only way to shorten lead time is to reduce work in progress. Releasing more work onto the floor to keep everyone busy does not make jobs finish sooner; it makes them wait longer. Conversely, limiting work in progress shortens lead time immediately, as long as the bottleneck is kept supplied.

## Batch size: the hidden multiplier

Large batches lengthen lead time in a way that is easy to underestimate. Consider 100 parts that each need four operations of one minute.

- **Batch and queue**: each operation processes all 100 parts before the batch moves on. The first part is finished after 301 minutes, and the last after 400 minutes.
- **One-piece flow**: each part moves to the next operation as soon as it is done. The first part is finished after 4 minutes, and the last after 103 minutes.

The work content is identical. The difference is entirely waiting for the rest of the batch. In real factories, with different operation times, changeovers and queues, the effect is less tidy but the direction is the same: smaller batches, and smaller transfer quantities between operations, mean faster flow, less work in progress and earlier discovery of defects. A defect in a batch of 100 may not be found until all 100 are made; in one-piece flow it is found on the next operation.

Batches exist for a reason, usually changeover time. If a machine takes two hours to change over, running small batches loses a lot of capacity. The answer is to reduce changeover time, through **set-up reduction** methods that move work outside the stoppage, standardise tooling and simplify adjustments, so that smaller batches become affordable.

## Utilisation: why full machines make long queues

Many businesses aim to keep every machine and person as busy as possible. Queueing theory shows why this lengthens lead time. When work arrives unevenly and operation times vary, as they always do, the waiting time in front of a resource grows sharply as its utilisation approaches 100%. A widely used approximation shows waiting time rising in proportion to utilisation divided by spare capacity: at 80% utilisation that ratio is 4, at 90% it is 9 and at 95% it is 19. Moving a resource from 80% to 95% busy can therefore multiply the queue in front of it by almost five, with the same variability.

Two lessons follow. First, a resource that is planned to be busy every minute will have long, unpredictable queues; some spare capacity is the price of short lead times. Second, reducing variability, in arrivals, in operation times and in breakdowns, shortens queues at any given level of utilisation. Releasing work evenly, rather than in large weekly lumps, is one of the cheapest ways to do that.

## Seeing the flow

Before redesigning anything, make the current flow visible.

- **Value stream map**: a one-page diagram of the material and information flow for a product family, from order to delivery. Each process box records cycle time, changeover time, reliability and the number of people. Inventory triangles between boxes record how much work waits there. A timeline along the bottom compares total lead time with total process time. The map usually shows that most of the lead time sits in the triangles.
- **Spaghetti diagram**: a floor plan with a line tracing the actual path a product, or a person, takes. Long, tangled paths reveal transport and motion that add cost but no value.
- **Work sampling**: observing people at random moments over several days and recording what they are doing. The proportions estimate how much time goes to value-adding work, walking, searching, waiting and fetching. The results are about the system, not individuals, and should be presented that way.
- **Following an order**: physically tracking a real job and recording where it waits and why.

The [lean as an operating system](/insights/lean-as-an-operating-system-not-a-toolkit/) article explains how these tools fit into a wider approach to flow and problem solving.

## Takt time: pacing to demand

**Takt time** is the rate at which the customer needs products: available working time divided by customer demand over the same period. If a shop works 456 minutes a day and customers need 40 frames a day, the takt time is 456 ÷ 40, or about 11.4 minutes per frame.

Takt time is a design tool. Each operation in a flow should be able to complete its work within the takt time, and the number of people or stations needed follows from the work content divided by takt. An operation that takes longer than takt is a bottleneck in the making; one far shorter than takt may be overstaffed or a candidate for combining with another. When demand changes, the takt time changes, and the line can be rebalanced.

## Cells: putting the steps together

A **manufacturing cell** groups the machines and people needed to make a family of similar products, arranged in sequence and close together, often in a U shape. Instead of parts travelling between departments, such as all the saws in one area and all the welders in another, they move a few metres from one step to the next.

Cells shorten transport and waiting, make problems visible, allow small transfer batches and give a team ownership of a complete product. They work best when:

- **Product families** share similar routings and can be grouped, for example by mapping which products use which processes.
- **Demand is steady enough** to justify dedicating equipment.
- **People are cross-trained** to cover several operations and balance the work.
- **Changeovers within the family** are short.

Not every process suits a cell. Large, shared equipment, such as a paint line, a heat treatment furnace or a laser cutter serving the whole factory, often stays as a shared resource that feeds or is fed by cells.

## Pull: release work when there is room for it

In a **push** system, work is released to the floor according to a schedule or forecast, whether or not the next operation is ready for it. Work in progress grows wherever the flow is slowest. In a **pull** system, work is released or replenished only when a downstream signal shows it is needed, so work in progress is capped.

Common pull methods:

- **Kanban**: a card, bin or electronic signal authorises the production or delivery of a fixed quantity. When a container of parts is used, its kanban goes back to the supplying process, which makes or delivers exactly one container's worth. The number of kanbans in the loop limits the work in progress.
- **Supermarkets**: small, controlled stores of standard parts between processes that cannot flow directly, replenished by kanban.
- **Work-in-progress caps**: a simple rule that a new job can be released only when one finishes, keeping the total in the system constant. This approach, sometimes called CONWIP, suits job shops where products vary too much for part-specific kanbans.
- **Releasing to the bottleneck**: pacing the release of work to the rate of the slowest resource, so that queues do not build in front of it.

Pull systems need reasonably stable processes. If machines break down often or quality is poor, the small buffers run out, and the first reaction is to add stock back. Stability, through maintenance, standard work and quality at source, usually comes first. The [before adding capacity, change the control logic](/insights/change-the-control-logic-before-adding-capacity/) article covers how release and scheduling rules govern output.

## Synchronise what meets at assembly

Assembly can only start when every component is present. If each component is made on its own schedule, assembly waits for whichever arrives last, and the others sit in stock. Aligning the release and sequencing of components that come together, so that sets arrive together, often shortens lead time more than speeding up any single operation.

## Make the flow visible every day

Flow improvements decay without daily attention. Simple visual management helps:

- **Boards at each cell or area** showing safety, quality, delivery and output against plan.
- **A brief daily meeting** at the board, focused on yesterday's problems and today's risks.
- **Clear limits** on work-in-progress areas, marked on the floor, so overflow is obvious.
- **Escalation** when a problem stops the flow, so it is solved rather than worked around.

## Measures that reward flow

Measures shape behaviour. Departmental efficiency and machine utilisation reward large batches and full queues. Measures that reward flow include:

- **Lead time**, from release or order to dispatch.
- **Work in progress**, in units or days.
- **On-time delivery** to the customer's requested or promised date.
- **First-time-through quality**: the share of products completed without rework.
- **Output against takt or plan** by hour or day.

## A worked example

This is an illustrative example. A 35-person fabrication business makes steel equipment frames in several sizes. Its process runs laser cutting, folding, welding, an external powder coater, assembly and dispatch. Customers wait about 15 working days for an order, and the business is losing quotes to competitors offering 7 days.

**Seeing the flow.** A value stream map shows about 480 frames' worth of parts between laser cutting and dispatch. With 40 frames completed a day, Little's law gives about 12 days of internal lead time. Total process time for one frame, excluding the coater, is under two hours. Work is released to the laser once a week, in large nested batches, because changeovers take about 30 minutes. A spaghetti diagram shows parts crossing the factory twice between folding and welding.

**Changes.**

- **Smaller, daily release.** The laser team cuts changeover to about 10 minutes by preparing sheets and programs while the previous job runs. Work is now released daily, matched to the next day's welding plan.
- **A welding and assembly cell.** Folding, welding and assembly for the two highest-volume frame families are moved together. With demand of 40 frames a day and 456 available minutes, the takt time is about 11.4 minutes, and the cell is balanced with cross-trained welders to meet it.
- **A supermarket for common parts.** Brackets and gussets used across many frames are cut to kanban and held in a small supermarket beside the cell, replenished when a bin empties.
- **A work-in-progress cap.** No more than four days of frames may be released ahead of welding, and the floor area for waiting work is marked.
- **Synchronised coating.** Frames are sent to the coater in daily lots rather than weekly, by agreement with the coater, who prefers the steadier flow.

**Result.** After four months, work in progress has fallen to about 160 frames. At the same 40 frames a day, that is about 4 days of internal lead time. Including two days at the coater, the business can quote 7 working days with confidence. Floor space freed by the lower stock becomes a second cell, and defects are found the same day rather than a week later.

## Applying this in an Australian manufacturing business

- **Follow a real job** and measure how much of its lead time is waiting.
- **Use Little's law**: reduce work in progress to cut lead time.
- **Shrink batches**, starting with changeover reduction where it matters.
- **Leave spare capacity** on key resources rather than loading them fully.
- **Map the value stream** and draw spaghetti diagrams before moving equipment.
- **Pace to takt time** and balance work across operations.
- **Form cells** for product families with similar routings.
- **Pull work** with kanban, supermarkets or work-in-progress caps.
- **Synchronise components** that meet at assembly.
- **Measure lead time and work in progress**, not just utilisation.

## Where flow improvements go wrong

- **Buying capacity** when the real problem is waiting.
- **Releasing more work** to keep people busy.
- **Measuring machine utilisation** and rewarding big batches.
- **Installing kanban on unstable processes.**
- **Building cells for products** that do not share routings.
- **Moving equipment** before mapping the flow.
- **Treating lean as a project** rather than a daily routine.

## Questions to ask about your lead time

- How much of our lead time is process time, and how much is waiting?
- How much work in progress do we carry, in days of output?
- Why are our batches the size they are, and what would it take to halve them?
- Which resources are planned to be busy all the time, and what do their queues look like?
- What signal releases work to the floor?
- What waits at assembly for the last component?
- Which of our measures reward big batches?

## Bringing it together

Lead time is mostly waiting, and waiting is mostly a result of how work is organised. Little's law shows that lead time falls when work in progress falls. Smaller batches, made affordable by quicker changeovers, cut the time parts spend waiting for each other. Spare capacity and steadier release shorten queues at busy resources. Value stream maps and spaghetti diagrams reveal the waste; cells, takt time and pull systems remove it; synchronised components and daily visual management keep the flow moving. Done patiently, these changes can shorten lead times dramatically, free space and capacity and make problems visible while they are still small.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS manufacturing handbooks on lead-time reduction, one-piece flow and pull, cellular manufacturing and labour productivity, and the eight wastes of lean manufacturing. The worked example is illustrative. This article is general information.*
