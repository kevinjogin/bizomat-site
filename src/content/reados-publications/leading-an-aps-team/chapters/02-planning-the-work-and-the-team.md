---
book: leading-an-aps-team
chapterSlug: planning-the-work-and-the-team
order: 2
title: "Planning the work and the team"
description: "Turn demand into hours, FTE and a phone roster that meets a service standard, plan for peaks, match engagement to the work and ask for resources with numbers."
draft: false
---

Every staffing argument rests on a number someone believes. "We're flat out" is a feeling, and "calls are down" is half a fact. A workload plan turns demand into hours, hours into people and a service standard into a roster. It lets a manager show what the work needs, when, and what happens without it, before the queue makes the case for her.

This is an illustration. In her first week Hannah read the section's phone reports. In the first fortnight of July only 52 per cent of calls had been answered within 60 seconds, against NRIO's standard of 80 per cent. Marcus said the team was short. The Director asked the right question: short of what? Hannah spent September building the answer with Marcus and Leila. In early October it became urgent, when Daniel's move to another agency was confirmed and he was due to leave at the end of the month.

## Start from demand

Plan from the work; positions come last. Each kind of work needs two figures: how many items arrive in a year and how long one takes. Take the volume from next year's forecast, and ask what could move it: a new program, a new online form, a facility closure.

Time per item needs measuring. For calls, the phone system reports the average handling time: talk time plus the notes and follow-up done straight after the call. For letters, time a sample of real items from receipt to signature. Estimates made in a meeting usually run low, because people remember the easy items.

This is an illustration. Hannah's forecast for 2026–27 comes from the phone and email systems and from Leila's correspondence register.

| Work | Volume a year | Time per item | Where the time comes from |
| --- | --- | --- | --- |
| Phone calls | 34,000 | 6 minutes | Phone system's average handling time |
| Emails | 9,600 | 12 minutes | Email system and a timed sample |
| Letters and complaints | 1,200 | 90 minutes | Timed sample from the register |

## Turn hours into FTE

Full-time equivalent (FTE) expresses the work as full-time people doing nothing else. Multiply volume by minutes, divide by 60 for hours, then divide by one person's productive hours for the year.

This is an illustration. NRIO's planning figure is 1,500 available hours a person each year, net of leave and public holidays, of which it counts 85 per cent as productive. The other 15 per cent covers meetings, training, system outages and similar time. These are NRIO's own planning figures, not a Commonwealth rule.

```figure
type: formula
title: From demand to handling-time FTE
caption: This is an illustration. NRIO's 2026–27 forecast and planning figures. Each FTE is rounded to two places as the last step.
formula: Hours = volume × minutes per item ÷ 60
formula: FTE = hours ÷ productive hours per person
- Productive hours | 1,500 available hours × 85% = 1,275 per person a year
step: Calls: 34,000 × 6 = 204,000 minutes; 204,000 ÷ 60 = 3,400 hours; 3,400 ÷ 1,275 = 2.67 FTE
step: Emails: 9,600 × 12 = 115,200 minutes; 115,200 ÷ 60 = 1,920 hours; 1,920 ÷ 1,275 = 1.51 FTE
step: Letters and complaints: 1,200 × 90 = 108,000 minutes; 108,000 ÷ 60 = 1,800 hours; 1,800 ÷ 1,275 = 1.41 FTE
step: Total: 3,400 + 1,920 + 1,800 = 7,120 hours; 7,120 ÷ 1,275 = 5.58 FTE, about 5.6
```

The Staffing Need tool runs the same arithmetic from units, minutes per unit, available hours and productive efficiency, and gives an FTE and a whole-person figure. Run it once for each stream and add the FTE, not the rounded people: 3 + 2 + 2 = 7 people would overstate a need of 5.58. And because NRIO's 1,500 hours already exclude leave, the 85 per cent must not allow for leave a second time.

The 5.6 FTE is handling time only, as if every productive minute went on an item. It leaves out the team leaders' work and the time call-takers must spend free, waiting for the next call. The second matters most.

## Size the phones to the service standard

Letters can wait in a tray until someone is free. Calls cannot. They arrive at random, and a caller who reaches a busy line waits. Whether 80 per cent are answered within 60 seconds depends on how many people are on the phones in that hour, not on the year's total hours.

This is an illustration. The phone line is open from 9 am to 5 pm on about 250 business days a year. Marcus's reports for 2025–26 show the pattern of a normal week:

- an ordinary hour brings about 15 calls;
- from 9 to 11 am, Tuesday to Friday, about 20 calls an hour;
- from 9 to 11 am on Monday, about 30 calls an hour: the Monday morning peak.

The pattern adds up. A week has 40 open hours: 30 ordinary hours at 15 calls (450), 8 weekday morning hours at 20 (160) and 2 Monday morning hours at 30 (60), or 670 calls. Over 50 weeks that is 33,500. The July and December peaks bring the other 500 of the forecast 34,000.

Three numbers describe each hour. The load is the hours of calls arriving in the hour: calls × handling minutes ÷ 60. Utilisation is the load divided by the number of call-takers. The chance that a caller has to wait comes from a standard queueing formula, Erlang C, which assumes that calls arrive at random and that handling times vary at random. The [Queue Wait Check](/tools/queue-wait-check/) tool calculates it, with the average wait and the fewest call-takers for a target average wait. NRIO's standard is not an average, so one more step turns the chance of waiting into the share answered within 60 seconds.

```figure
type: formula
title: Can three call-takers meet the standard in an ordinary hour?
caption: This is an illustration. 15 calls an hour, 6 minutes each, 3 call-takers. The formula assumes random arrivals, so check the real pattern before relying on it.
formula: Load a = calls an hour × handling minutes ÷ 60; utilisation = a ÷ c call-takers
formula: Chance of waiting = T ÷ (S + T); average wait = chance of waiting × handling minutes ÷ (c − a)
formula: Answered within 60 seconds = 1 − chance of waiting × e^(−(c − a) × 60 ÷ handling seconds)
- S | 1 + a + a² ÷ 2! + a³ ÷ 3! and so on, up to a to the power c − 1, divided by (c − 1)!
- T | The next term, a to the power c ÷ c!, multiplied by c ÷ (c − a)
- e | The constant 2.718; a spreadsheet's EXP function does this step
step: a = 15 × 6 ÷ 60 = 1.5; utilisation = 1.5 ÷ 3 = 50%
step: S = 1 + 1.5 + 1.5² ÷ 2 = 3.625; T = 1.5³ ÷ 6 × 3 ÷ 1.5 = 1.125
step: Chance of waiting = 1.125 ÷ 4.75 = 23.7%; average wait = 23.7% × 6 ÷ 1.5 = 0.95 minutes, about 57 seconds
step: Within 60 seconds = 1 − 0.2368 × e^(−1.5 × 60 ÷ 360) = 1 − 0.2368 × 0.7788 = 81.6%, which meets the standard
```

This is an illustration. The average wait, about 57 seconds, sits almost on the 60-second line, yet 81.6 per cent of callers are answered within it. Most callers, 76.3 per cent, do not wait at all, and a few wait a long time. That is why an average wait is the wrong test for this standard.

```figure
type: compare
title: Calls answered within 60 seconds, by call-takers on the phones
rowhead: Hour in a normal week
cols: 3 call-takers | 4 call-takers | 5 call-takers
caption: This is an illustration. Erlang C with 6-minute calls. Bold marks the fewest call-takers that meet NRIO's standard of 80 per cent within 60 seconds.
- Ordinary hour, 15 calls (load 1.5) | **81.6%** | 95.1% | 98.9%
- Weekday morning, 20 calls (load 2.0) | 62.4% | **87.5%** | 96.4%
- Monday morning, 30 calls (load 3.0) | Overloaded: 100% busy | 56.9% | **83.1%**
```

Two lessons sit in that table. A small team meets a tight standard only with plenty of free time: three call-takers at 50 per cent utilisation only just pass. And near the limit, one person changes everything. On Monday morning a fourth call-taker answers 56.9 per cent in time and a fifth lifts it to 83.1 per cent. With three, the load equals the call-takers, and the queue grows for as long as the peak lasts.

## Build the roster and the full requirement

This is an illustration. The table sets the roster: three call-takers in ordinary hours, four on weekday mornings and five on Monday mornings. Hannah approves those levels, and Marcus builds the half-hourly roster from them.

A week then needs 30 × 3 + 8 × 4 + 2 × 5 = 90 + 32 + 10 = 132 hours on the phones, or 132 × 50 = 6,600 hours a year. Calls take 3,400 of them, leaving 3,200 hours between calls. Officers use that time for emails, putting each one down when the phone rings, so the 1,920 email hours fit inside it. That leaves 3,200 − 1,920 = 1,280 hours of ready time, the price of answering most calls within a minute. Marcus tests the email assumption with a month of reports. If emails pile up, or waits run longer than the formula predicts, it does not hold.

Letters and complaints need quiet time off the phones, so add their 1,800 hours: 6,600 + 1,800 = 8,400 hours of officer time. Check it another way: 7,120 hours of handling plus 1,280 hours of ready time is also 8,400. That is 8,400 ÷ 1,275 = 6.59 FTE.

The six officer positions give 6 × 1,275 = 7,650 hours. Even at full strength the section is 8,400 − 7,650 = 750 hours a year short, about 15 hours a week over 50 weeks. Marcus and Leila cover it by taking escalated calls and filling roster gaps, which uses 750 ÷ (2 × 1,275) = 29 per cent of their productive time. The rest goes to rosters, checks, coaching and the hardest cases. The plan works at full strength, just. It has no slack for a vacancy, a long absence or a peak.

## Plan for the peaks

A plan built on the average fails in the busiest hours. Peaks come in layers: the morning, the Monday, the season, and the weeks when many people want leave at once.

This is an illustration. The section's seasonal peaks are the first two weeks of July and the first three weeks of December. In those weeks the morning rate on any weekday reaches about 30 calls an hour, as on a normal Monday. From Tuesday to Friday that adds 10 calls an hour for two hours: 4 × 2 × 10 = 80 calls a week, or 400 over the five weeks. The other 100 peak calls fall in the 150 ordinary hours, lifting them to nearly 16 calls an hour, and three call-takers would then answer only 79.4 per cent within 60 seconds. So each peak week needs five call-takers on weekday mornings and four in ordinary hours: 4 × 2 = 8 more hours on the phones in the mornings and 30 in ordinary hours, or 38 in all. December's three weeks need 3 × 38 = 114 extra hours.

Hannah's peak plan is agreed before each peak, not invented during it:

- no training, team meetings or projects on peak mornings;
- leave planned around the peaks, because the 1,275 hours allow for leave on average, not for half the team away in the same fortnight;
- correspondence officers join the phones on peak mornings and take turns as the fourth call-taker after 11 am, keeping letters within NRIO's 15-business-day standard;
- a trigger: if the share answered within 60 seconds falls below 80 per cent on two days in a row, Marcus tells Hannah that day;
- before each peak, Hannah tells the Director what will wait.

Because the 34,000 calls include the peaks, a normal week runs a little below the average: 670 calls against 34,000 ÷ 50 = 680. The quieter weeks are where training, leave and projects belong.

## Match the engagement to the need

Section 22(2) of the [Public Service Act](https://www.legislation.gov.au/C2004A00538/latest/text) allows three kinds of engagement: as an ongoing employee, "for a specified term or for the duration of a specified task", or for irregular or intermittent duties. The Employment Principles recognise "that the usual basis for engagement is as an ongoing APS employee" (s 10A(1)(b)).

The [Public Service Regulations 2023](https://www.legislation.gov.au/F2023L00368/latest/text) set the circumstances for a specified term. One is that the duties are needed only for a limited period and are unlikely to be needed after it (s 13(4)(a)). The note to that provision gives examples: a temporary increase in workload, a temporary demand for particular skills, or replacing an ongoing employee who is on leave. The Regulations also refer to the Fair Work Act's limits on fixed-term contracts (s 13(8)), so ask People Branch which rules apply before you propose one.

This is an illustration. The plan answers the question. The 8,400 hours recur every year, so they belong in ongoing positions. A peak, a project or cover for a long absence may suit a specified term. Aaron's term ends on Wednesday 30 June 2027, but the work in the plan does not. Hannah notes in the plan that the hours continue after that date, so the question of how they will be staffed reaches the Director well before June. Any ongoing engagement is a merit decision (Chapter 3).

## Ask for resources early, with numbers and options

```figure
type: timeline
title: Officers at work against the plan's 8,400 hours
caption: This is an illustration. Each officer gives 1,275 productive hours a year. Shortfalls are annual rates; the weekly figure divides by 50 weeks.
- Mon 5 Oct 2026 | Ruby starts | Five officers, one still learning the calls
- Late Oct | Daniel leaves | Four officers: 5,100 hours, 3,300 short, 66 a week
- 1 to 18 Dec | December peak | Five call-takers on weekday mornings, four in ordinary hours
- Mon 4 Jan 2027 | Mei returns | Five officers if full-time: 6,375 hours, 2,025 short, 40.5 a week
- *Mon 15 Feb | New APS 5 starts | Six officers if Mei is full-time: 7,650 hours, 750 short, covered by the team leaders
- Wed 30 Jun | Aaron's term ends | One officer fewer unless the need is met
```

This is an illustration. The figure shows why timing mattered. With Mei on parental leave and Daniel gone, four officers give 4 × 1,275 = 5,100 hours a year against 8,400: a shortfall of 3,300 hours, or 66 a week. Even if Marcus and Leila did nothing but take calls, their 2 × 1,275 ÷ 50 = 51 productive hours a week would not close it. The December peak falls in the middle.

Hannah wrote to the Director the day Daniel's move was confirmed. Her one-page case set out:

- the demand and how it was measured;
- the requirement: 8,400 hours of officer time, 6.59 FTE, and the 750 hours the team leaders already carry;
- the gap by date, as in the figure;
- three options and their consequences: fill Daniel's position as ongoing now; fill it and add short-term help until mid-February; or leave it vacant, which makes the shortfall 750 + 1,275 = 2,025 hours a year for good;
- her recommendation, the decision needed and the date it was needed by.

NRIO's finance area costed each option from its salary tables, which follow the enterprise agreement, so nobody had to guess. Before Daniel left, the Director agreed to fill the position as ongoing, and Chapter 3 follows that process. The short-term help was left for a later decision.

Three habits make a request land. Ask when the evidence first shows the gap, not when the queue is already out of control. Show the arithmetic, so anyone can check it. And give options with their consequences, so the Director receives a decision to make, not a complaint.

## When it goes wrong: a roster built on the average

This is an illustration. Before Hannah arrived, the section rostered three people on the phones all day. The reasoning sounded careful. 34,000 calls over 250 days is 136 a day, or 17 an hour over 8 hours. At 6 minutes each, that is 17 × 6 ÷ 60 = 1.7 hours of calls every hour, so three call-takers seemed to leave room to spare.

In ordinary hours it worked: three call-takers answer 81.6 per cent of 15 calls within a minute. On weekday mornings it did not, at 62.4 per cent. On Monday mornings the load of 3.0 equalled the three call-takers, so the queue grew for two hours. Then July came, and the morning rate reached about 30 calls on most days. For two weeks, every morning was a Monday morning with two call-takers too few.

The phone report for the fortnight showed 52 per cent of calls answered within 60 seconds. The costs spread. Callers who gave up rang back and lengthened the queue. Some complained in writing, and each complaint takes about 90 minutes to answer, fifteen times a 6-minute call. Leila's officers were pulled onto the phones with no plan, so letters slipped. Officers worked through breaks, and missed breaks are a safety issue, not only a service one (Chapter 8).

The 17-calls figure was correct and useless: no hour of the week has 17 calls. Plan each kind of hour against the standard, not the day against the average. Three controls would have caught it: the queue calculation for the busiest hour, the hourly phone report read every week, and a peak plan agreed in May for July.

## Exercise: one more minute per call

This is an illustration. Before taking the plan further, the Director asks a what-if question. Suppose the average handling time rose from 6 minutes to 7, for example while staff learn a new system, with every other figure unchanged. Work out:

1. the handling-time FTE for calls and for the whole section;
2. the call-takers needed in each kind of hour of a normal week to answer 80 per cent of calls within 60 seconds;
3. the hours on the phones each year, the officer requirement and the gap against six officer positions.

### Worked answer

**1. Handling-time FTE.** Calls: 34,000 × 7 = 238,000 minutes; 238,000 ÷ 60 = 3,966.7 hours; 3,966.7 ÷ 1,275 = 3.11 FTE, up from 2.67. Section: 3,966.7 + 1,920 + 1,800 = 7,686.7 hours; 7,686.7 ÷ 1,275 = 6.03 FTE, up from 5.58. The extra minute adds 566.7 hours, or 566.7 ÷ 1,275 = 0.44 FTE.

**2. Call-takers.** The loads become 15 × 7 ÷ 60 = 1.75, 20 × 7 ÷ 60 = 2.33 and 30 × 7 ÷ 60 = 3.5. Sixty seconds is now 60 ÷ 420 = 1/7 of a call, so the last step multiplies by e^(−(c − a) ÷ 7). The chance of waiting comes from the same formula, or from the Queue Wait Check tool.

| Hour | Call-takers | Chance of waiting | Within 60 seconds |
| --- | --- | --- | --- |
| Ordinary, load 1.75 | 3 | 33.4% | 1 − 0.334 × 0.836 = 72.1% |
| Ordinary, load 1.75 | 4 | 11.8% | 1 − 0.118 × 0.725 = 91.4% |
| Weekday morning, load 2.33 | 4 | 26.6% | 1 − 0.266 × 0.788 = 79.0% |
| Weekday morning, load 2.33 | 5 | 10.3% | 1 − 0.103 × 0.683 = 93.0% |
| Monday morning, load 3.5 | 5 | 37.8% | 1 − 0.378 × 0.807 = 69.5% |
| Monday morning, load 3.5 | 6 | 17.7% | 1 − 0.177 × 0.700 = 87.6% |

The roster becomes four, five and six: one more call-taker in every hour. Four on weekday mornings misses by a whisker, at 79.0 per cent.

**3. Hours and the gap.** Hours on the phones: 30 × 4 + 8 × 5 + 2 × 6 = 120 + 40 + 12 = 172 a week, and 172 × 50 = 8,600 a year, up from 6,600. Officer requirement: 8,600 + 1,800 = 10,400 hours, or 10,400 ÷ 1,275 = 8.16 FTE. Against the six positions' 7,650 hours, the gap is 10,400 − 7,650 = 2,750 hours a year, or 55 a week, far beyond the 750 hours the team leaders cover now.

The lesson is the ratio. One more minute adds 0.44 FTE of handling, but 8,600 − 6,600 = 2,000 hours on the phones, which is 2,000 ÷ 1,275 = 1.57 FTE, because the queue needs one more person in every hour. Handling time is a number to watch each month. If it rises, find out why, such as a new system or a change in the mix of calls, and fix the cause before asking for people. If the cause cannot be fixed, these figures are the case to put to the Director, including the option of a different standard for NRIO to decide.

Chapter 3 follows the APS 5 vacancy through a merit selection, from the aim and purpose to the new officer's first day.
