---
book: commissioning-custom-software
chapterSlug: run-the-work-in-short-increments
order: 5
title: "Run the work in short increments"
description: "Run a software build in three-week increments with working software shown on the floor, one product owner deciding priorities, visible budget tracking and change control."
draft: false
---

A software project that disappears for five months and reappears as a finished system is a gamble. If the developer misunderstood something in week two, the business finds out in month five, when fixing it costs most. Short increments change the odds. Each one delivers a small piece of working software that real users try in real conditions. Misunderstandings surface within weeks, priorities can shift as people learn what they need, and the business can see where the money is going. The public statement of this way of working, the 2001 Manifesto for Agile Software Development, put working software and collaboration with the customer ahead of comprehensive documentation and contract negotiation, without dismissing either.

This chapter runs the job-tracking build in five increments of about three weeks. It sets the roles, plans what each increment delivers, runs the demonstrations on the shop floor, tracks the budget against the estimate and the cap, and controls changes. The failure case is a dashboard that grew quietly between increments until the budget tracking showed what it had cost.

## Roles

Three roles mattered most:

- **The product owner** was the operations manager: the person who decides what the software should do and in what order, answers developers' questions within a day, and accepts or rejects each increment. One person, with the authority to decide, so the developers never receive conflicting instructions.
- **The floor representative** was the production supervisor, who attended every demonstration, recruited operators to try each increment and spoke for how the work really happens.
- **The developers** were the two from Developer Z, with a part-time tester, who planned, built and demonstrated each increment.

The owner stayed out of day-to-day decisions, reviewing progress fortnightly with the product owner and approving any change that affected the estimate.

## Plan the increments by value

The order of increments followed value and risk: the most valuable stories first, and the riskiest early enough that problems could be fixed.

```figure
type: timeline
title: The five increments of the job-tracking build
caption: This is an illustration. Each increment ended with a demonstration on the shop floor and acceptance against the stories' acceptance criteria. Offline operation came second because it was the riskiest technical problem.
- Weeks 1 to 3 | Increment 1 | start, pause and finish operations at two machines, with operator logins
- Weeks 4 to 6 | Increment 2 | offline operation and synchronisation in the back bay
- Weeks 7 to 9 | Increment 3 | jobs imported from the existing system; live job status for the office
- Weeks 10 to 12 | Increment 4 | scrap recording, late-running flags and the nightly time export
- *Weeks 13 to 15 | Increment 5 | inspection records in the three customers' formats
```

The first increment delivered something small but real: two operators on two machines recording their work, with the office able to see it. It proved the basic idea, the tablets, the logins and the developers' approach, in three weeks. The second tackled the riskiest problem, offline operation, while there was still time to change approach if needed.

## Demonstrate on the floor

Each increment ended with a demonstration, not in a meeting room, but at the machines, with operators using the software on real jobs for at least a day beforehand. The developers watched, the supervisor gathered the operators' comments, and the product owner checked each story against its acceptance criteria.

Demonstrating on the floor caught problems a meeting room never would: buttons too small for gloved hands, glare on the tablet screen near the windows in the afternoon, a barcode scanner that could not read travellers that had picked up coolant. Each was fixed in the next increment, when it was cheap and the code was still fresh in the developers' minds.

## When an increment is not accepted

Increment 2 was not accepted at its first demonstration. Offline operation worked for short dropouts but, after a full shift without a connection, some records synchronised out of order, so a pause appeared before the start it belonged to. The acceptance criterion said records must be sent "in the order they were made", and they were not. The product owner declined to accept the increment, the developers took another week to fix the ordering, and the increment was demonstrated again and accepted.

That was the system working as intended. The payment for increment 2 waited until acceptance, the developers had a precise criterion to meet rather than a vague complaint, and the problem was fixed in week seven instead of being discovered after go-live, when every operator would have been affected. Declining an increment felt awkward at the time. Everyone agreed afterwards that accepting it would have been worse.

## Listen to the operators

The operators who tried each increment had views that nobody in the office could have predicted. In increment 1, they asked for the job number to be the largest thing on the screen, because they glanced at it from the machine, not the tablet. In increment 3, they asked for the next job on their machine to be shown when they finished one, which saved a walk to the supervisor. In increment 4, two experienced operators pointed out that scrap was often discovered at the next operation, by a different operator, so scrap recording needed to allow a reason that pointed back to an earlier operation. Each request went to the product owner. Most were small and absorbed. The scrap point changed the design of a story before it was built, which was cheap only because it was raised during the increment rather than after go-live.

## Keep documentation current, increment by increment

The contract required documentation in the business's repository at every increment. In practice, that meant three things updated each time: a short description of how the system is built and deployed, so another developer could take it over; a user guide for each role, a page or two, updated as screens changed; and a list of the decisions made and why, such as "records synchronise in the order made, using the tablet's clock corrected against the server". The product owner checked each at acceptance. Documentation written at the end of a project is usually rushed and incomplete. Written alongside the code, it took the developers perhaps an hour per increment and was accurate.

## Prepare for go-live from the start

Go-live, covered in Chapter 7, needs work that is not software: training operators, preparing the paper fallback, setting up the tablets at every machine, deciding when to stop using travellers. The product owner started a go-live plan in increment 1 and added to it after each demonstration, so that by increment 5 most of the preparation was already done. Each increment's demonstration also served as training for the operators who took part, who became the floor's experts when the system went live.

## Track the budget openly

At each increment's end, the developer reported the hours spent, which Developer Z's capped arrangement required anyway, and the product owner compared them with the plan. A simple comparison is enough: the value of accepted work against what it cost.

```figure
type: formula
title: Budget position after increment 3
formula: cost performance = value of accepted work ÷ actual cost        forecast build cost = build estimate ÷ cost performance
caption: This is an illustration. Each increment was valued at its share of the A$88,000 build estimate, A$17,600; amounts exclude GST. The forecast stays well under the cap.
- Accepted work | three increments, 3 × A$17,600 = A$52,800
- Actual cost to date | A$56,000 of developers' time
step: cost performance = 52,800 ÷ 56,000 ≈ 0.94
step: forecast build ≈ 88,000 ÷ 0.94 ≈ A$93,300
step: with discovery, about A$101,300, under the A$110,000 cap
```

```figure
type: bars
title: Developers' cost of each increment against its A$17,600 share
unit: A$, excluding GST
max: 24000
caption: This is an illustration. Increment 2, offline synchronisation, ran well over; increments 3 and 4 came close to plan. Cumulative cost after four increments was A$73,500 against A$70,400 of accepted work.
- Increment 1 | 16800
- *Increment 2 | 21700
- Increment 3 | 17500
- Increment 4 | 17500
```

After three increments, the project was running about 6% over its estimate, mainly because offline synchronisation had been harder than expected. The forecast, about A$101,300 including discovery, was still under the cap, and the shared-savings arrangement meant the overrun up to the cap was paid at cost. The product owner and the developers agreed to look for savings in the last two increments and to watch the inspection-forms work, the largest remaining story, closely.

## Keep a short list of risks

Alongside the budget, the product owner kept a list of the five or six things most likely to go wrong, reviewed at each weekly meeting: the inspection forms being larger than estimated, the existing system's export changing after a vendor update, operators resisting the tablets, the back bay's Wi-Fi, and the key developer's planned leave in week 11. Each risk had an owner and a next action. The Wi-Fi risk led the business to install the access points discussed in Chapter 1's exercise during increment 2, which made testing easier as well as reducing the risk. The leave risk led the second developer to work alongside the first on the time export before the leave began. None of the listed risks became a crisis, partly because each was being watched.

## Control changes

As people used each increment, they asked for things. Some were defects: the software did not meet an acceptance criterion. Those were fixed without discussion. Others were changes, and went through the change process from Chapter 4: the developer estimated the effect, and the product owner decided. Over the five increments, the change log recorded nine changes. Six were small and absorbed within the estimate, such as larger buttons and a different sort order for the job list. Three were estimated at about **A$4,200** together, and two of those were approved.

## A failure case: the dashboard that grew

This is an illustration. During increment 3, the supervisor asked one of the developers, informally at the coffee machine, whether the job-status screen could be shown on a large monitor on the workshop wall. The developer, keen to help, said it would be easy, and spent a few hours on it. The supervisor then asked for colours by customer, then for the screen to cycle between machines, then for a count of late jobs at the top. Each request was small. None went through the change process, and none was in the stories. Big-screen dashboards were on the nice-to-have list that the brief had deliberately deferred.

The budget comparison after increment 3 showed hours higher than the story estimates explained. The product owner asked where they had gone, and the developers' time records showed about **33 hours**, about **A$4,620**, spent on the dashboard over the three weeks.

Nobody had acted in bad faith. The supervisor had wanted something useful, and the developer had wanted to please the client. The detection came from open budget tracking at each increment, which is its purpose. The correction was a short conversation: all requests go to the product owner, who decides whether they are changes and whether to approve them. The dashboard was kept, because it was useful, recorded as an approved change, and its remaining improvements deferred to after go-live. The developers agreed to say "please raise that with the product owner" to any informal request, which they found easier than saying no.

## How the increments ended

Increment 5, the inspection forms, came in close to its share, helped by the earlier discovery work on the conditional sections of one customer's form. The final build cost was about **A$91,400** against the A$88,000 estimate, and about **A$99,400** including discovery, below the A$110,000 cap. Under the shared-savings arrangement, nothing was shared because the cost exceeded the estimate, and the business paid the cost of the time as worked. Those figures include the approved changes, the dashboard among them, so the project's total of about A$99,400, excluding GST, sat inside the budget range of A$85,000 to A$110,000 stated in the brief. The owner considered that a fair outcome for a first project, and the reasons for the overrun, offline synchronisation and the dashboard, were documented and understood.

## Keep a short rhythm

Between demonstrations, the product owner and the developers met for 30 minutes each week to review progress, answer questions and look at any problems. The developers also kept a short written list of open questions, which the product owner answered within a working day. Slow answers stall developers, and a stalled developer on time and materials is the business's cost. Over the project, the product owner answered about 140 questions, most within a few hours, and estimated spending about four hours a week on the project in total, which was well within the 150 hours of the business's time that Chapter 1 had budgeted.

## How this applies to a small Australian business

Small businesses often hand a project to a developer and wait. Short increments, each tried on the real floor or office by real users, catch misunderstandings while they are cheap. Name one product owner with the authority to decide, and make sure every request goes through them. Track accepted work against cost at every increment: it takes ten minutes and gives early warning of trouble. The broader view of how software is built and tested in stages is in [How software is built, tested and delivered](/reados/collections/software-and-cloud-foundations/how-software-is-built-tested-and-delivered/).

## Exercise: forecasting after increment 4

After increment 4, accepted work is valued at **A$70,400** (four increments) and the actual cost is **A$73,500**. What is the cost performance, the forecast build cost and the forecast total with discovery? Is the project still under the A$110,000 cap?

**Worked answer.** Cost performance is **70,400 ÷ 73,500 ≈ 0.958**. The forecast build cost is **88,000 ÷ 0.958 ≈ A$91,900**, and with the A$8,000 discovery, about **A$99,900**, under the cap. The overrun has narrowed from about 6% to about 4%, so the savings sought in increment 4 worked. The product owner should still watch increment 5, the inspection forms, which discovery had already shown was the largest and least certain story.
