---
book: divide-the-work
chapterSlug: specialists-and-waiting
order: 8
title: "Specialists and waiting: why separate queues are slower than shared ones"
description: "Dividing work by specialty splits one queue into several. How a queue calculation shows the cost, why waits rise steeply as people get busier, and when pooling beats specialisation."
draft: false
---

Most discussion of dividing work concerns how fast each person works. A quieter effect concerns how long work waits. When work arrives at random and each kind goes to its own specialist, each specialist has a separate queue. One can be swamped while another is idle, and work cannot move between them. A shared queue, served by anyone able to do the work, uses the same people far more effectively.

This chapter applies a queue calculation to the bench maker's office, where the contract has increased the requests for custom variants, and shows that dividing the office work by customer makes requests wait more than twice as long as sharing it. It then explains why waiting rises so sharply as people get busier, and what that means for specialised roles generally.

## The office under the contract

This is an illustration. The distributor sells the standard B-series bench, but its customers often want variants: a different length, an extra shelf, a splashback, cut-outs for a sink. Each variant needs a quote, a drawing and a cutting program before it can be made. The business's own direct customers ask for the same kind of work. Under the contract, these requests arrive at about **one an hour** on average across the working day, roughly half from the distributor and half from direct customers. Each takes about **90 minutes** of quoting, drawing and programming.

That is more than the owner can handle alone, so he hires an estimator. The obvious way to divide the work is by customer: the estimator handles the distributor's requests, which are mostly variants of one design, and the owner keeps the direct customers, whom he knows well. Each person then receives about half a request an hour.

## Calculate the queues

The [queue wait tool](/tools/queue-wait-check/) in BIZOMAT Tools models a queue with random arrivals and random service times served by one or more servers, the queue known as M/M/c. From the arrival rate, the average service time and the number of servers, it gives the utilisation, the chance that an arriving job has to wait, the average wait in the queue, the average time in the system and the average number waiting, along with the fewest servers that would keep the average wait within a target. It assumes arrivals are roughly random; scheduled or batched arrivals change the waits.

**Divided by customer.** Each person is a single server with half a request an hour and 90 minutes per request. The tool gives, for each:

- utilisation **75%**;
- chance that a request waits **75%**;
- average wait before work starts **270 minutes**, four and a half working hours;
- average time from arrival to completion **360 minutes**, six hours;
- average number waiting **2.25**.

**Shared.** Both people take the next request from a single list, whichever customer it came from. That is two servers with one request an hour. The tool gives:

- utilisation **75%**, the same as before;
- chance that a request waits **64.3%**;
- average wait **115.7 minutes**, under two hours;
- average time from arrival to completion **205.7 minutes**;
- average number waiting **1.93**.

```figure
type: compare
title: The same two people, two ways of sharing the requests
cols: Utilisation | Chance of waiting | Average wait | Arrival to completion
caption: This is an illustration. Results from the queue wait tool with one request an hour in total and 90 minutes per request. The people, the workload and the utilisation are identical; only the queue arrangement differs.
- Divided by customer, each person with half the requests | 75% | 75% | 270 min | 360 min
- *Shared list, both people take any request | 75% | 64.3% | 115.7 min | 205.7 min
```

The shared arrangement cuts the average wait by more than half, from 270 to about 116 minutes, without any change in the people, their skill, their workload or their utilisation. The reason is simple once seen. Under the divided arrangement, there are frequent moments when one person has two requests waiting while the other has none. The idle time of one cannot help the queue of the other. In a shared queue, whoever is free takes the next request, so neither person is idle while work waits.

## Why busier means much longer waits

The owner's first reaction to the long waits is that the estimator is only 75% busy, so there must be plenty of slack. That reasoning is natural and wrong, and the error is common enough to deserve its own section.

For a single server with random arrivals, the average wait rises steeply as utilisation approaches 100%. The queue wait tool, run for one person at 90 minutes per request with different arrival rates, shows how steeply:

```figure
type: bars
title: Average wait for one person handling requests alone
unit: min
max: 820
caption: This is an illustration. Results from the queue wait tool for a single server at 90 minutes per request. Moving from 75% to 90% busy multiplies the average wait by three.
- 50% busy | 90
- 65% busy | 167
- *75% busy | 270
- 85% busy | 510
- 90% busy | 810
```

At 50% utilisation, a request waits on average about 90 minutes. At 75%, 270 minutes. At 85%, about 510 minutes, more than a working day. At 90%, 810 minutes, nearly two working days. Each further step towards full utilisation costs more waiting than the one before.

Two lessons follow for any specialised role that receives work at random:

- **Utilisation that looks comfortable can still mean long waits.** A specialist who is busy three-quarters of the time is not under-used if work arrives unpredictably; the remaining quarter is what keeps the queue short.
- **A small rise in demand can cause a large rise in waiting.** If requests increased by about 13%, from half an hour to 0.567 an hour, the estimator's average wait would almost double.

The steepness is not a quirk of the model. It reflects something everyone has seen in a busy office or a service counter: when people are nearly always busy, any small cluster of arrivals has nowhere to go but the queue, and the queue takes a long time to clear because there is so little spare time to clear it with.

The bench line itself avoids most of this because its work is scheduled, not random: three benches a day, released to a plan. The office cannot schedule when customers ask for variants, so queueing behaviour dominates there.

## The failure case: the invisible queue

The divided arrangement ran for six weeks before the problem surfaced. The distributor complained that variant quotes were taking two days or more, losing its customers' orders to faster competitors. The owner was surprised, because the estimator never seemed overloaded, and his own direct-customer quotes were going out the same day.

The explanation was in the queues. The distributor's requests were bunched: its sales team tended to send several at once after customer visits, so the estimator's queue built up in bursts, well beyond the averages above. The owner's direct customers happened to have a quieter month. One queue was overloaded while the other had capacity to spare, and nothing in the arrangement let the spare capacity help.

### How it is detected

The cheapest detection is to measure the time from request to quote for each request, not just how busy each person feels. A simple log of request time and quote time, kept for every request, shows the waits directly and shows which queue they are in. The owner had been watching utilisation; the customer was experiencing waiting.

### How it is corrected

The owner moves to a single shared list of requests, ordered by arrival, with each person taking the next request when they finish one. Two exceptions remain: requests that need the owner's knowledge of a particular direct customer go to him, and the estimator handles the distributor's standard variants first when both are free, because he is quicker at them. Within a month, the average time from request to quote falls below four hours, as the queue calculation suggested.

## Specialisation and pooling are a trade

None of this means that specialised roles are a mistake. A specialist may be faster at their kind of work, which reduces the service time and so reduces waiting. Suppose the estimator, working only on the distributor's variants of one design, gets quicker at them: 75 minutes instead of 90. The queue wait tool gives his separate queue a utilisation of **62.5%** and an average wait of **125 minutes**, much better than 270, and close to the shared arrangement.

The trade-off, then, is between the speed gained by specialising and the waiting lost by separating queues. Which wins depends on how much faster the specialist is and how variable the arrivals are. A useful rule of thumb from the calculations is that **pooling wins unless specialisation makes the work substantially faster**, and that a hybrid often captures most of both: a shared list, with each person taking their own kind of request first when they have a choice.

The same idea applies in the workshop. The floater from Chapter 6 is pooled capacity: one person able to help at any station, who absorbs the peaks that would otherwise queue in front of whichever station is busiest that day. Cross-training, in Chapter 9, extends the pool. In both cases, the business keeps its specialists and adds the flexibility that pooling provides.

```figure
type: checklist
title: Before dividing work that arrives at random
caption: This is an illustration. The owner's checks for the office work. The open item depends on data from the new request log.
- x Measure arrival rate and service time for each kind of work
- x Compare separate and shared queues with the same people
- x Check waits at the expected peak, not only at the average
- x Measure time from request to response, not only how busy people are
- x Keep a shared list, with preferences rather than exclusive ownership
- ? Check whether arrivals are bunched, which makes real waits longer than the model's
```

## Larger pools wait less

Pooling has a further property that echoes Smith's argument about the extent of the market. A larger pool, serving a larger flow of work at the same utilisation, keeps waits shorter than a smaller one. If the bench maker's request volume doubled to two an hour and it had four people on a shared list, each still 75% busy, the queue wait tool gives an average wait of about **46 minutes**, against about 116 with two people and one request an hour.

The reason is the same as before. With more people sharing one queue, it is more likely that someone is free when a request arrives, so random bunching is absorbed. This is part of why larger operations can offer faster service at the same efficiency: their pools are bigger, not just their numbers. For a small business, it argues for making every pool as large as practical, by sharing lists across people and by training people to cover more than one kind of work, rather than fragmenting work into many small specialised queues.

## Shortening waits without adding people

The queue calculation shows two levers besides adding people: reduce the arrival rate of work that needs a person, or reduce the time each request takes. The owner uses both.

- **A catalogue of standard variants.** About a third of variant requests turn out to be the same few changes: two extra lengths, a splashback and an extra shelf. Pre-drawn, pre-programmed and pre-priced, these no longer need the 90-minute process. The [Configure, Price, Quote by the Numbers chapter on measuring the quoting you have](/reados/publications/configure-price-quote-by-the-numbers/measure-the-quoting-you-have/) shows how to find which requests repeat.
- **Triage.** Requests that need only a price from the catalogue are answered within the hour; those needing new drawings join the shared list.
- **Fewer interruptions.** Phone calls about existing quotes go to whoever is not working on a new drawing at the time, protecting the service time of the person who is.

Each measure lowers the utilisation of the shared list, and because waits rise so steeply near full utilisation, a modest reduction in workload buys a large reduction in waiting.

## The model's limits

The queue wait tool's model assumes that arrivals are random and independent and that service times vary in a particular way. Real office work departs from this: the distributor's bunched requests made waits longer than the model predicted, while a request process with very regular service times would make them shorter. The model's value lies in its comparison between arrangements and in its demonstration of how waits rise with utilisation, both of which are robust. Its exact minutes should be treated as an estimate and checked against the request log.

## Exercise: more requests

After the C-series bench is launched, variant requests rise to **1.2 an hour** in total, still at about 90 minutes each. Using the queue wait tool's method with a shared list, what are the utilisation and the average wait with two people, and with three if the floater spends their time on requests too? What would you recommend?

**Worked answer.** With **two people**, the tool gives utilisation of **90%**, an 85.3% chance that a request waits, and an average wait of about **384 minutes**, more than a working day. The average number waiting is about 7.7. That is the steep part of the curve: a 20% rise in requests has more than tripled the average wait from about 116 minutes.

With **three people**, utilisation falls to **60%**, the chance of waiting to 35.5%, and the average wait to about **27 minutes**.

The recommendation depends on what a third person costs and what fast quotes are worth, but the calculation makes the trade clear. Adding a third person to the shared list for part of the day, for example the floater for the busiest hours or a part-time drafter, would cut waits sharply. Two people at 90% utilisation will produce long and unpredictable waits, and the distributor's experience shows those cost orders. The worst option would be to add a third person with a separate queue of their own, which would lose much of the pooling benefit.
