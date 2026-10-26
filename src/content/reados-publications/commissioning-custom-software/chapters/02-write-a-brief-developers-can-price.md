---
book: commissioning-custom-software
chapterSlug: write-a-brief-developers-can-price
order: 2
title: "Write a brief developers can price"
description: "Write a software brief with the problem in numbers, must-haves as user stories with acceptance criteria, data volumes, integrations, quality needs and a budget range."
draft: false
---

A developer can only price what they understand. A brief that says "a shop-floor app to track jobs and integrate with our system" will produce quotes that differ by a factor of two or three, because each developer fills the gaps with their own assumptions. The quotes cannot be compared, the cheapest one is cheap because it assumed the least, and the gaps reappear later as variations. A good brief does not design the software. It describes the problem, the people, the work, the data and the tests the result must pass, precisely enough that every developer is pricing the same thing.

This chapter writes the machining business's brief. It sets out the structure, turns the twelve must-haves from Chapter 1 into user stories with acceptance criteria, states data volumes and integrations exactly, lists the quality needs that are easy to forget, attaches real examples and states a budget range. The failure case is a single line about integration that two developers read so differently that their quotes could not be compared.

## The structure of the brief

The brief ran to about twelve pages plus attachments. Its structure:

```figure
type: tree
title: The job-tracking brief's structure
caption: This is an illustration. Each part answers a question developers would otherwise have to guess at; the attachments do more than the prose to prevent misunderstanding.
- The job-tracking brief
  - Context | the business, the problem in numbers, why now
  - Users | operators, supervisor, office, quality, owner; how many of each
  - Must-haves as user stories | each with acceptance criteria
  - Nice-to-haves | listed so developers can price them separately, or not at all
  - Data and volumes | jobs, operations, scrap, inspections, retention
  - Integrations | what flows each way, how often, in what format
  - Quality needs | speed, offline use, security, backup, support
  - Constraints | tablets, budget range, timeline, who decides
  - Attachments | traveller, inspection forms, system export samples, floor plan with Wi-Fi coverage
```

## Write must-haves as user stories

A user story describes a need from a user's point of view: who, what and why. Each story carries acceptance criteria: specific, testable conditions that show the story is done. This is an illustration of three of the twelve.

**Story 1.** "As an operator, I want to start, pause and finish an operation at my machine, so that the office knows what I am working on and how long it takes." Acceptance criteria:

- the operator scans the traveller's barcode, or picks the job from a list of jobs released to that machine;
- starting, pausing and finishing each take no more than two taps after the scan;
- the start, pause and finish times are recorded to the second, against the operator's identity;
- the action completes in under one second at the machine, with or without a network connection.

**Story 2.** "As an operator in the back bay, I want the app to keep working when the Wi-Fi drops, so that I do not have to remember to record things later." Acceptance criteria:

- every action works with no connection for up to eight hours;
- records made offline are sent automatically when the connection returns, in the order they were made;
- the operator can see, at a glance, whether there are records waiting to be sent.

**Story 6.** "As the quality inspector, I want to record inspection results in each customer's required format, so that audits take minutes rather than hours." Acceptance criteria:

- inspection forms are configured per customer, with the fields of the three attached example forms;
- results are stored against the job and operation, and printable in the customer's format;
- any past inspection record can be found by job, part number or customer within one minute.

Acceptance criteria turn opinions into checks. "The app should be fast" invites argument. "The action completes in under one second" can be tested, and Chapter 6 tests every one of them.

## State the data and volumes

Developers need to know how much data the software will handle, because it affects design and cost. The brief stated:

```figure
type: stats
title: The job-tracking data, in the brief
caption: This is an illustration. Figures are the business's current volumes; the brief asked developers to allow for 50% growth.
- 350 | Jobs a month | about 6 operations each
- 2,100 | Operation records a month | about 25,200 a year
- *176,400 | Operation records over 7 years | the retention period
- 4,200 | Inspection records a year | three customer formats
- 40 | People | 30 on the floor, 10 in the office
- About 200 | Scans a working day | start and finish across all machines
```

None of these numbers is large for modern software. Stating them stops a developer from proposing an elaborate, expensive architecture for millions of records, or a fragile one for a few dozen, and it gives both sides a basis for testing performance.

## Specify integrations exactly

Integrations, connections to other systems, are where most software budgets go wrong, because "integrate with our system" can mean anything from a weekly spreadsheet to a real-time two-way link. The brief specified each flow:

- **Jobs and routings in:** from the existing job and accounting system, every 15 minutes, including job number, part, quantity, due date and the list of operations with their machines and standard times. The system can export these as a file on a schedule; a sample export is attached.
- **Actual times out:** to the same system, once a night, as a file in the system's import format, for job costing. A sample of the import format is attached.
- **Nothing else.** No other system connections are in scope.

The brief also named the person at the business who understands the existing system, and offered each developer an hour with them during the quoting period.

## Quality needs that are easy to forget

Some needs are not features, and briefs often leave them out until it is too late. The brief listed them, using the international ISO/IEC 25010 model of software quality as a prompt for what to consider:

- **Performance:** under one second for any action at a machine.
- **Reliability:** offline operation for eight hours, no lost records.
- **Security:** individual logins, a role for each kind of user, no shared passwords, access only from the business's devices and network or a secure connection.
- **Maintainability:** source code in the business's own repository, documented, buildable by another developer from written instructions.
- **Backup and recovery:** daily backups, with a tested restore within one working day.
- **Usability:** an operator new to the app can start, pause and finish an operation after five minutes of instruction.
- **Retention:** records kept for at least seven years and exportable at any time.

## Describe a day on the floor

Stories describe needs one at a time. Developers also need the whole picture: what an operator's shift looks like, when the supervisor needs status, what happens when a job is split between two machines or a part is reworked. The brief included two pages describing a typical day, written by the production supervisor in plain language, with the awkward cases named: jobs paused overnight, operations shared between shifts, a job pulled from one machine to another because of a breakdown, a reworked part counted against the original job, and the Friday afternoon rush to dispatch. Developers said that these two pages told them more about the real complexity than the twelve stories, and three of their questions during the quoting period were about cases the day's description had raised.

## Attach real examples

Attachments did more than any paragraph. The brief attached a real paper traveller, the three customers' inspection forms, sample files from the existing system's export and import, a floor plan showing where the Wi-Fi was weak, and photos of the tablets. Developers said afterwards that the samples saved them most of their questions, and that seeing the real paper traveller showed them how much information operators were used to reading at a glance.

## State a budget range

Business owners often withhold their budget, hoping to get a lower price. Developers then guess, and their proposals are designed for very different budgets, which makes them hard to compare. The brief stated a range: **A$85,000 to A$110,000**, excluding GST, for the must-haves, with nice-to-haves priced separately. It also stated the target timeline, five months to go-live, and the decision date. Stating the range did not make every quote sit at the top, as the owner had feared it might. Two of the three came in below the middle, and the range let developers explain what they would include at each level.

## A failure case: one line, two readings

This is an illustration. The first draft of the brief, sent to two developers before the owner had taken advice, said: "Integrate with our existing job and accounting system." Nothing more.

The quotes came back at **A$64,000** and **A$138,000**. The cheaper developer had assumed a nightly file export of jobs and a nightly import of times. The dearer one had assumed a real-time two-way connection through the existing system's programming interface, including updating job status in that system as operations finished, which would have required the existing system's vendor to enable and support an interface the business did not license.

```figure
type: compare
title: Two quotes for "integrate with our existing system"
cols: Cheaper quote | Dearer quote
caption: This is an illustration. Both readings were reasonable; the brief had not said which was meant. The rewritten brief specified a 15-minute file export in and a nightly file import out.
- Jobs into the app | nightly file export | real-time, through the system's programming interface
- Times back to the system | nightly file import | real-time, updating job status as operations finish
- Work on the existing system | none | interface licence and vendor support needed
- *Price, excluding GST | A$64,000 | A$138,000
```

Neither developer was wrong. The brief was. The detection came when the owner tried to compare the quotes and found they described different projects. The correction was the exact integration specification above, with sample files, and a fresh request to three developers. The new quotes were within 25% of each other, and every difference between them could be traced to a choice the developers explained.

## Ask for proposals in one format

Comparing proposals is far easier when they are laid out the same way. The brief asked each developer to include:

- their understanding of the problem, in their own words, in no more than a page;
- their proposed approach, including the technology and where the software would run;
- a price for each must-have story, and separately for each nice-to-have, with the assumptions behind each;
- the team who would do the work, by name and role, and how much of each person's time;
- a timeline with the increments they would deliver, as Chapter 5 describes;
- their price and terms for support after go-live;
- two references from clients with similar projects, whom the business could call.

The per-story prices turned out to be the most useful part. They showed where developers' assumptions differed, and they allowed the owner to drop or defer a story if the total came in over budget, knowing what that would save.

## Nice-to-haves, priced but not promised

The brief listed the nice-to-haves, a big-screen dashboard, maintenance scheduling and operator training records, and asked developers to price them separately. The owner did not intend to buy them in the first project. Pricing them had two purposes. It showed whether the proposed design would make them easy or hard to add later, which was a useful sign of the design's quality. And it gave the business a realistic idea of the cost of the next stage, so that the first project's benefits could be weighed against it.

## Say who decides

The brief named the decision-makers: the owner for budget and contract, the operations manager for the brief and acceptance, and the production supervisor as the representative of the shop floor. Developers were told that questions about the work on the floor would be answered by the supervisor, not by the owner, because the supervisor knew how jobs actually moved. That avoided a common trap, in which the person who signs the contract describes the work as they imagine it, and the people who do it discover the difference after the software arrives.

## Run a fair question period

During the quoting period, developers ask questions. The owner answered each in writing and sent every question and answer, without naming who asked, to all bidders. That kept the quotes comparable and avoided giving one developer information the others lacked. The question period also showed which developers had read the brief carefully, which was useful evidence for Chapter 3. Thoughtful questions about the awkward cases were a better sign than none at all.

## How this applies to a small Australian business

A brief takes a few days of the owner's and managers' time, and it is the best money spent in the project. Write the problem in numbers, the must-haves as stories with testable criteria, the data volumes, the integrations flow by flow, and the quality needs. Attach real examples, state a budget range and answer questions in writing to everyone. Australian developers working for small businesses often quote quickly from thin briefs, and a better brief usually produces closer, more honest quotes. The general approach to requirements that can be tested is in [Requirements that can be traced and tested](/reados/collections/project-planning-and-control/requirements-that-can-be-traced-and-tested/).

## Exercise: write acceptance criteria

Write three acceptance criteria for must-have 4: "Late-running jobs are flagged before their due date." State any assumption about what "late-running" means.

**Worked answer.** Assume a job is late-running when the standard time remaining for its unfinished operations exceeds the working time left before its due date. Possible criteria: (1) each job shows a status of on track, at risk or late-running, recalculated at least every 15 minutes from the latest recorded operations and standard times; (2) a job becomes late-running as soon as the remaining standard time exceeds the remaining working time, and the supervisor sees it on the job list within 15 minutes; (3) for a test job due in two working days with 20 hours of standard time remaining on one machine working 7.6 hours a day, the app shows late-running. The third criterion is a worked case that a tester can set up, which is the most useful kind.
