---
book: practical-wisdom-by-the-numbers
chapterSlug: command-and-carry-it-through
order: 7
title: "Command: turn the judgement into action on time"
description: "Check that the capacity exists to keep each promise, issue a clear command with owners and dates, and guard against rashness, thoughtlessness, inconstancy and negligence."
draft: false
---

A decision that is never carried out has not been made. Aquinas is blunt about this. Of the three acts of prudence, taking counsel, judging and commanding, he ranks command as the chief, because it comes closest to the purpose of practical reason, which is action (*Summa Theologiae* II-II q.47 a.8). A person who reasons well and then fails to act is, in his account, more imprudent than one who reasons poorly, because the failure lies in the very act prudence exists to perform.

For an engineering team, command is the point where a choice becomes instructions: who does what, by when, with what resources, and what each person tells the customer. It is also where a well-reasoned decision most often comes apart, because promises are made faster than capacity is checked. This chapter closes the open condition left in Chapter 6, issues the workshop's command, and examines the four ways Aquinas says command fails.

## Close the open condition first

Chapter 6 left one circumstance unconfirmed: whether the workshop has the machine hours to finish the replacements by working day 12. The castings arrive on day 10, which leaves days 10, 11 and 12 for machining, inspection and packing. The answer is different for the two outcomes of the concession request.

If the concession is accepted, 6 flanges need replacing. Machining at 1.2 hours each and inspection at 0.25 hours each come to 8.7 hours, plus an hour to pack and document the second delivery: 9.7 hours in all. If the concession is refused, 18 flanges need replacing: 21.6 hours of machining, 4.5 hours of inspection and about 2 hours of packing, 28.1 hours in all.

The BIZOMAT [schedule risk check](/tools/schedule-risk/) compares remaining work with productive capacity before a deadline. It multiplies the people available by their productive hours a day and by a planning efficiency, then by the working days remaining, and reports capacity as a percentage of the work. It rates coverage of 115% or more as low delivery risk, 100% to 115% as tight, and under 100% as high delivery risk, and it reports the working days the work needs at that rate. It also warns when the planning efficiency is set above 90%, because few shops sustain that.

This is an illustration. The workshop's machinist has 7.6 productive hours a day, and the planner uses an efficiency of 80%, so one person contributes 6.08 productive hours a day.

| Scenario | Work | People | Days | Capacity | Coverage | Result |
|---|---|---|---|---|---|---|
| Concession accepted | 9.7 h | 1 | 3 | 18.24 h | 188% | Low delivery risk; needs 1.6 days |
| Concession refused, one machinist | 28.1 h | 1 | 3 | 18.24 h | 65% | High delivery risk; needs 4.6 days |
| Concession refused, two machinists | 28.1 h | 2 | 3 | 36.48 h | 130% | Low delivery risk; needs 2.3 days |

```figure
type: bars
title: Capacity as a share of the replacement work
unit: %
caption: Day 12 is safe if the concession is accepted; if it is refused, day 12 is safe only with a second machinist assigned for three days.
- Accepted, one machinist | 188
- *Refused, one machinist | 65 | needs 4.6 days, not 3
- Refused, two machinists | 130
```

## A failure: the promise made before the check

The draft concession request, written on the afternoon of day zero, said that if the concession were refused, "all 18 replacements will be delivered on working day 12". The production manager had written it on the reasonable-sounding basis that the 6-flange plan needed less than two days, and the castings would arrive on day 10.

The schedule check shows the promise was not supported. With one machinist, 18 replacements need about 4.6 working days, which would put the second delivery on day 14 or 15, not 12. The draft would have made a promise about a future date without reasonable grounds for it, the kind of statement that damages trust when it fails and, in a commercial setting, can be misleading.

The error was detected because circumspection in Chapter 6 had marked capacity as an unconfirmed condition, so the quality lead ran the check before the request was sent. The correction had two parts. The production manager confirmed that a second machinist could be released for days 10 to 12 if the concession were refused, by moving about 18 hours of another customer's work to the following week. That customer was told on day zero, before anything was certain, that its job might move by up to three days and why. Only then did the request's day-12 promise stand for both outcomes.

The general lesson is simple and often ignored: check capacity before making a date promise, not after. Every promise in a command is a claim that the means exist.

## The obstacle nobody listed

Running the capacity check exposed a second gap. The replacement castings come from the same foundry, poured after the same sand change. If they carry porosity at the current batch's rate of 7.5%, some replacements will themselves fail final inspection, and their failure will be discovered only after they have been machined.

The numbers make the gap concrete. If the concession is accepted and only 6 flanges are needed, the chance that all of the first 6 machined are good is 0.925 to the sixth power, about 63%. That sounds poor, but with 18 castings on hand, spares are available, and the schedule's buffer of 8.54 hours absorbs up to five extra flanges at 1.45 hours each. If the concession is refused, the picture is worse. All 18 castings would have to be good, and the chance of that is 0.925 to the eighteenth power, about 25%. Three times in four, the workshop would be short of at least one casting on day 12.

The correction is cheap. Ordering 22 castings instead of 18 raises the chance of having at least 18 good ones to about 98%, for an extra A$248. If the concession is accepted, the extra castings go into stock with the others. The amendment went to the foundry with the order on the evening of day zero. It is a small example of caution in Aquinas's sense, guarding against an obstacle to a good plan, and of how one check often reveals the need for another.

## Issue the command

With the condition closed, the command can be written. A good command names the action, the owner and the date for each step, and it says what each person will do if an assumption fails.

```figure
type: timeline
title: The command issued on the evening of day zero
caption: Every step has an owner; the two fallback lines say what happens if the customer refuses or the foundry slips.
- Day 0 | Order 22 castings | Purchasing; 18 plus 4 for yield, confirmed by the foundry by 9 am day 1
- Day 0 | Send the concession request | Quality lead; includes map, section photos, the note on flange 140
- Day 0 | Warn the other customer of a possible move | Production manager; up to three days, reason given
- Day 2 | Customer's answer due | Quality lead; if refused, second machinist confirmed for days 10 to 12
- Day 6 | Ship 222 conforming flanges | Dispatch; 12 concession flanges ship too if accepted, marked and listed
- Day 10 | Castings arrive; incoming sample inspected | Inspector; if the foundry slips, customer told the same day
- *Day 12 | Ship the replacements | Dispatch; deduction status confirmed with the customer
```

Two features of the command are easy to leave out and expensive to miss. The first is the fallback lines. A command that describes only the expected path leaves people to improvise when the path changes, and improvisation under pressure is where precipitation returns. The second is the communication steps. The other customer, the foundry and the pump-station contractor each learn something on a stated day from a named person. Nobody is left to discover the change from a missed delivery.

## One voice to the customer

Commands inside the workshop are only half of the action. The other half is what the customer hears, and from whom. A decision can be well made and well executed internally, and still go badly because the customer receives three different accounts from three different people.

The workshop's command names the quality lead as the single point of contact with the customer's engineer for everything about the 18 flanges. The production manager handles delivery logistics with the customer's site team, but refers any question about conformance back to the quality lead. Dispatch does not discuss the flanges at all beyond what is on the delivery documents.

The day-zero message from the quality lead follows the structure of the decision itself:

1. **The fact.** Eighteen of 240 flanges do not meet the inspection criterion; the inspection has been confirmed.
2. **The plan.** 222 conforming flanges ship on the due date, covering stage 1; the remaining flanges are being replaced or put forward for a concession.
3. **The request.** A concession for 12 named flanges, with the evidence attached, and a note on flange 140.
4. **The dates.** Replacements on day 12 in either case, with the basis for that date.
5. **What the customer needs to decide, and by when.** An answer on the concession by day 2 keeps every option open.

The message does not apologise at length or explain the foundry's sand change in detail, because neither helps the customer decide. It does say that the cause has been identified and that the workshop is acting on it. A customer who receives a message like this can plan their stage 1 installation the same afternoon. That is the practical test of a good command: the people affected by it can act on it without having to ask what it means.

## Four ways command fails

Aquinas names the vices that defeat prudence, and four of them bear directly on command (II-II q.53 and q.54).

**Precipitation**, or rashness, is acting without passing through the steps of counsel: memory, understanding, docility and reasoning. It shows up in a command as an instruction issued before the facts are in, such as ordering 6 castings before the indication map is complete.

**Thoughtlessness** is a failure of judgement: neglecting the considerations a sound judgement depends on. The draft day-12 promise was thoughtlessness in this sense. The information needed to check it existed; nobody had looked at it.

**Inconstancy** is abandoning a good purpose already settled, when the will is drawn away and reason fails to carry out what it has counselled and judged. In the workshop it looks like a plan that dissolves at the first complaint: the customer phones on day 4 to ask whether everything can come on day 6, and someone agrees, undoing the replacement plan without any new facts.

**Negligence**, in Aquinas's analysis, is the lack of the prompt will that command requires: not a change of purpose but a failure to act on it (II-II q.54 a.2). It is the request that sits in a draft folder until day 2 because the quality lead was busy, so that the customer's answer, and the second machinist, arrive too late.

```figure
type: checklist
title: Guarding the command against its four failures
caption: Each guard is a habit the workshop can check, not a matter of character alone.
- Precipitation | No instruction issues before counsel's questions are closed
- Thoughtlessness | Every date in the command has been checked against capacity
- Inconstancy | The plan changes only when a fact changes, and the change is recorded
- Negligence | Each step has an owner and a time, and someone checks it happened
- x Do not let a phone call change a written plan | Ask what fact has changed first
- ? Is anything in the command still unowned? | If so, it is not yet a command
```

The guards are deliberately mechanical. Aquinas treats these as failures of a virtue, and good character certainly helps. But a workshop cannot rely on everyone's character being at its best on a busy Thursday. A checklist that asks whether every date has been checked, and whether every step has an owner, makes the virtue easier to practise.

## Record what was done, not only what was decided

The decision record now gains its last section: the command, and then, as the days pass, what actually happened. This is an illustration. The customer accepted the concession on day 2, so the second machinist was not needed and the other customer's job stayed in place; the workshop told that customer on day 2. The 222 conforming flanges and the 12 concession flanges shipped on day 6, marked and listed. The 22 castings arrived on day 10, and the incoming sample from the next production batch showed porosity at a similar rate, which became the starting point for Chapter 8. Of the first 6 replacements machined, one showed an indication at final inspection; a seventh was machined from the spares, using 1.45 hours of the buffer, and the 6 good replacements shipped on day 12. Fifteen castings, worth A$930, went into stock. The customer confirmed that the delay deduction would not be applied, because stage 1 had been supplied on time; the workshop recorded the confirmation rather than assuming it.

A record of outcomes is how memory, the first part of prudence, is built for the next decision. Without it, the next team facing porosity will rely on recollection, and Chapter 2 showed where that leads.

## Exercise: a second machinist who is not available

Suppose the second machinist could not be released, and the concession had been refused. One machinist is available for days 10, 11 and 12, and the workshop can add Saturday overtime on day 11 of 6 productive hours. Using the same efficiency of 80%, does the overtime make day 12 achievable for 28.1 hours of work? If not, what should the command say?

**Worked answer.** Normal capacity is 6.08 hours a day for three days, 18.24 hours. Six hours of Saturday overtime at 80% efficiency adds 4.8 productive hours, giving 23.04 hours, or 82% of the 28.1 hours needed. That is still high delivery risk, about 5 hours short. Day 12 is not achievable on these assumptions. The command should not promise it. It should tell the customer that refused concessions would move the replacements to day 13, which one more normal day of 6.08 hours would cover with about an hour to spare, and offer to deliver the replacements in two lots if that helps stage 2. An honest later date given on day 2 is worth far more to the customer than an unsupported earlier one discovered missing on day 12.
