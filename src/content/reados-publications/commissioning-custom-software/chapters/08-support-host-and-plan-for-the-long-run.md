---
book: commissioning-custom-software
chapterSlug: support-host-and-plan-for-the-long-run
order: 8
title: "Support, host and plan for the long run"
description: "Support custom software for years: a support agreement with clear response times, hosting and accounts the business controls, security updates, measured benefits and a yearly exit check."
draft: false
---

The warranty ends ninety days after go-live. The developers move on to other projects, the champions stop being asked questions, and the app becomes part of how the factory works. That is the moment the earlier database in Chapter 1 began to die: nobody owned it, nobody updated it, and when something broke, nobody could fix it. Custom software is not finished at go-live. It needs looking after for as long as the business uses it, and the cost and effort of that care belong in the plan from the start.

This chapter sets up the job-tracking app's long run. It agrees a support arrangement with clear response times, keeps hosting and accounts under the business's control, keeps security updates flowing, manages a short list of improvements, measures the benefits against the baseline from Chapter 1, and checks every year that the business could change developer if it had to. The failure case is a domain name that lapsed because its renewal notices went to a mailbox nobody read.

## What the support agreement covers

Chapter 4 separated support from the build contract. When the warranty ended, the business signed Developer Z's support agreement, with the price negotiated in Chapter 3. This is an illustration. The support fee is **A$1,020** a month. Hosting, paid directly by the business in its own cloud account, costs about **A$180** a month. Together they are **A$1,200** a month, **A$14,400** a year, which is the support-and-hosting figure Chapter 1 used in its five-year comparison. All amounts exclude GST.

```figure
type: checklist
title: What the job-tracking app's support agreement covers
caption: This is an illustration of the agreement's main terms. Anything not on the list is priced as a change at the support rate.
- Monitoring of the app and its nightly export, with alerts to the developer and the product owner | every working day
- Security updates to the app's components, framework and server | applied within an agreed window after release
- Defect fixes with response times by severity | critical started within four working hours
- Up to 6 hours a month of small changes or questions | unused hours do not carry over
- Further work at A$150 an hour, approved in advance by the product owner | estimated before it starts
- A monthly one-page report: uptime, incidents, updates applied, hours used | read at the operations meeting
- ? Notice to end the agreement: three months, either side | ending triggers the exit obligations in Chapter 4
- x Changes requested directly by staff, bypassing the product owner | the dashboard lesson from Chapter 5
```

The agreement is short, about four pages, because the build contract already settled ownership, data and exit. What it adds is the rhythm of looking after the system: who watches it, how quickly problems are dealt with, how changes are requested and how much they cost.

## Response times by severity

The severity definitions from Chapter 6 carried over into support, so that everyone already knew what "critical" meant. A **critical** problem, one that stops operators recording work or loses data, must be started within four working hours and worked on until fixed or worked around. A **major** problem, a must-have working incorrectly with a workaround, must be started within one working day. A **minor** problem joins the list of small changes and is fixed within the included hours, usually within the month.

In the first year after the warranty, the app had one critical incident, the lapsed domain described below, three major ones and about twenty minor ones. The three major problems were all caused by changes outside the app: a vendor update to the existing job system changed the format of one field in its export, a tablet operating system update changed how the barcode scanner's camera started, and a new customer's inspection form needed a field type the app did not yet support. Each was fixed within two days. Software that connects to other systems is affected by every change in those systems, which is one reason support never ends.

## Keep hosting and accounts under control

Chapter 4 put the hosting account, domain name, database and every other service in the business's name. Keeping them there takes a little discipline. The product owner keeps a one-page register of every account the app depends on: the hosting account, the domain name and its registrar, the email service that sends the app's alerts, the code repository and the barcode scanning library's licence. For each, the register records who in the business is the account holder, which email address receives notices, how it is paid, when it renews and who at the developer has access.

The register is checked twice a year, and whenever someone with access joins or leaves the business or the developer. It takes about half an hour. It is the cheapest protection the business has against the slow drift that leaves a system depending on one person's mailbox or one person's credit card.

Backups were tested before acceptance in Chapter 6. Under support, the developer restores a backup to a separate environment every six months, with the product owner checking a sample of the restored jobs and inspection records. A backup that was restored successfully two years ago is weak evidence that today's backups work, because the database, the hosting service and the app have all changed since.

## Keep security updates flowing

Every app is built from components written by others: a programming framework, libraries for the database, the barcode scanner and the interface, and the server's operating system. Those components receive security fixes regularly. An app whose components are never updated becomes more vulnerable every month, even if its own code never changes. The Australian Cyber Security Centre's Essential Eight strategies, widely used as a baseline by Australian organisations, include patching applications and operating systems promptly for this reason.

The support agreement requires the developer to apply security updates within an agreed window, sooner for serious vulnerabilities, to test the app's automated tests and the product owner's short checklist from Chapter 6 after each update, and to report what was updated in the monthly report. About two hours a month of the included time goes on updates in a typical month. Larger updates, such as a new major version of the framework every few years, are planned and estimated as changes, because they can take days rather than hours.

The business has its own part to play. Operators' logins are personal, never shared, and removed the day someone leaves. The product owner reviews the list of users each quarter. Tablets receive their own operating system updates through the business's IT provider. None of this is complicated. All of it is easy to neglect once the project team has dispersed.

## Manage a short list of improvements

At go-live, about fifteen small improvements were added to the list, and more arrived as people used the app. The product owner keeps them in one list, ranked by value, and decides each month which to do within the included hours and which, if any, justify paid work. In the first year, about twenty-five improvements were made, most of them small: a filter on the job-status screen, a printed label for scrapped parts, a weekly report of late operations by machine.

Two larger changes were proposed. The first, a big-screen dashboard for the workshop wall in its full form, was approved at an estimate of about **A$3,600**, because the supervisor could show it would replace a whiteboard that took 20 minutes a day to update. The second, connecting the app directly to the machines to record cycle times automatically, was deferred. It was a much larger project, with machine controls of several makes and ages, and the owner wanted a year of reliable manual data before deciding whether automatic collection would add enough to justify it.

The test for every improvement is the same as for the original must-haves in Chapter 2: what problem does it solve, for whom, how will we know it worked, and what does it cost? Most improvements are cheap. Together, they are how custom software stays fitted to the business as the business changes.

## Measure the benefits against the baseline

Chapter 1 stated the problem in hours and dollars before anything was built. A year after go-live, the product owner measured the same things again, using the same methods.

```figure
type: compare
title: Before the app and a year after go-live
cols: Baseline, Chapter 1 | A year after go-live
caption: This is an illustration. Each measure was collected the same way both times, from timesheets, the supervisor's diary and audit records, so the comparison is fair.
- Supervisor's time finding job status | about 6 hours a week | under 1 hour a week
- Office time answering customers' status calls and finding records | about 4 hours a week | about 1 hour a week
- Time to find 10 inspection records for an audit | about 35 minutes | under 3 minutes
- Scrap recorded with a reason | about a third of scrap events | all scrap events
- *Cost of scrap from the two set-up causes addressed | not known | down by about A$1,200 a month
```

Converted to money at the internal rate of A$80 an hour over 48 working weeks, the saving in supervisor time is about **5 × 48 × A$80 = A$19,200** a year, and in office time about **3 × 48 × A$80 = A$11,520**. The scrap reduction is worth about **A$14,400** a year. The total measured benefit is about **A$45,120** a year.

Some benefits were real but not counted. On-time delivery improved, because late-running jobs were flagged while there was still time to act, and one major customer's annual review commented on it. Quoting improved, because real operation times replaced estimates. The owner chose not to put a dollar figure on either, because any figure would have been a guess, and a business case built on guesses is easy to dismiss.

```figure
type: formula
title: Payback measured after the first year
formula: net annual benefit = measured benefits − annual support cost        payback = project cost ÷ net annual benefit
caption: This is an illustration. Amounts exclude GST. The project cost is the A$99,400 build and discovery from Chapter 5. Support includes 30 hours of work beyond the included hours.
- Measured benefits | A$19,200 + A$11,520 + A$14,400 = A$45,120 a year
- Annual support cost | A$14,400 + 30 hours × A$150 = A$18,900
step: net annual benefit = 45,120 − 18,900 = A$26,220
step: payback ≈ 99,400 ÷ 26,220 ≈ 3.8 years
```

The measured payback, about **3.8 years**, was close to Chapter 1's expectation of four to five years, but for a different reason. Chapter 1 divided the build cost by the supervisor's time alone and left support out. With support included, the supervisor's time alone would have taken about eleven years to repay the build. It was the scrap and office savings, which Chapter 1 had called likely but hard to measure, that made the project worthwhile. That is worth recording honestly, because the next software decision will rely on this one as evidence.

## Stay ready to leave

The contract in Chapter 4 gave the business a clean way out. That way out only works if it is kept open. Once a year, the product owner runs a short exit-readiness check:

- the code repository is in the business's account, and its latest version matches what is running;
- the build and deployment instructions are current, and the developer has walked the product owner through them;
- every account on the register is held by the business, with current contacts;
- the developer's access list matches the people who actually work on the app;
- the documentation describes the app as it is now, including the year's changes.

Every second year, the business repeats the independent-build test from Chapter 6, paying another developer for half a day to build the app from the repository. The first repeat found that a library had moved to a new location and the build instructions no longer worked without the original developers' knowledge. It took an hour to fix. Undetected, it would have cost a successor days at the worst possible time.

None of this signals distrust of Developer Z, who has supported the app well. Developers are people and small firms: they retire, are bought, change direction or simply become too busy. A business that can leave at short notice is also a business whose developer has every reason to stay attentive, which suits both sides.

## Plan for the end

All software reaches the end of its useful life eventually. Frameworks stop being supported, the business outgrows the design, or a bought product appears that does the job well. The owner wrote a note in the system's file: review the build-or-buy decision from Chapter 1 every three years, with fresh quotes and an honest look at the market. If a bought option one day meets the must-haves at a lower five-year cost, the app's data can be exported in its documented format and the business can move. That was the point of owning the code and the data from the start: not that the app must last forever, but that its ending is the business's decision.

## A failure case: the domain that lapsed

This is an illustration. Fourteen months after go-live, at 6.40 on a Monday morning, the tablets showed an error instead of the job list. Operators switched to the paper fallback, which had been kept in the office for exactly this, and the supervisor phoned the developer.

The app's domain name had expired over the weekend. The registrar had sent renewal notices for two months, to the email address of the office manager who had registered it during the build and who had left the business four months earlier. Their mailbox had been kept open but nobody read it. The card on the account had also expired. The account was in the business's name, as the contract required, which meant only the business could renew it.

The developer diagnosed the problem within half an hour. Renewing the domain took the owner twenty minutes, once they found the registrar's login in the departed office manager's files, and the app was back by about **11.30 am**, roughly five hours after the start of the shift. The office entered the morning's paper records that afternoon. No data was lost, because the app and its database had kept running; only the address that pointed to them had lapsed.

The detection came from the app stopping, the most expensive possible way. The correction was cheap. Every account on the register now sends its notices to a shared operations mailbox that two people read. Domains and certificates are set to renew automatically, on a business card whose expiry date is in the register. The register's twice-yearly check now includes logging into each account. The domain's renewal had been listed in the register all along. Nobody had checked where its notices went.

## How this applies to a small Australian business

Small businesses budget for building software and are surprised by what it costs to keep. Plan support from the start, at a realistic annual figure, and keep the agreement separate from the build. Hold every account in the business's name, record them in one register, and make sure their notices go somewhere people read. Keep security updates flowing, and test backups by restoring them. Measure the benefits against the baseline you set before building, honestly, including the ones that did not appear. Check every year that you could change developer if you had to. Software you own and can leave is an asset. Software you depend on and cannot leave is a risk, however well it works today.

## Exercise: a less fortunate first year

Suppose the scrap reduction had not happened, and the business had needed **60** hours of work beyond the included hours in its first year of support, instead of 30. Using the other figures in this chapter, what are the measured benefits, the annual support cost, the net annual benefit and the payback on the A$99,400 project? What would you look at first?

**Worked answer.** Measured benefits are the supervisor and office savings only: **A$19,200 + A$11,520 = A$30,720** a year. Support costs **A$14,400 + 60 × A$150 = A$23,400**. The net annual benefit is **30,720 − 23,400 = A$7,320**, and the payback is about **99,400 ÷ 7,320 ≈ 13.6 years**, longer than the app is likely to last unchanged. The first thing to look at is the extra support hours: which requests used them, whether they were defects that should have been found at acceptance, changes that could have waited, or problems caused by other systems. The second is whether the scrap data the app now collects could be used to find savings, since that was the benefit the business expected and did not yet have. A disappointing payback is not a reason to abandon the app, but it is a reason to manage it more closely.
