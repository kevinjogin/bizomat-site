---
book: commissioning-custom-software
chapterSlug: contract-for-ownership-and-exit
order: 4
title: "Contract for ownership and exit"
description: "Write a software contract so the business owns its code and data, receives source as it is built, pays against accepted increments, has a warranty period and can leave without losing the system."
draft: false
---

The software contract matters most after the software is finished. During the project, goodwill and regular meetings carry most of the relationship. Afterwards, when the developer moves on to other clients, raises prices, is bought by a larger firm or simply stops answering, the contract decides whether the business still controls the system it paid for. The machining business's earlier database, in Chapter 1, failed because nobody had thought about that moment.

This chapter sets out the contract the business agreed with its developer. It covers ownership of the code, delivery of source code as the work proceeds, ownership of data and hosting accounts, payment against accepted increments with a retention, a warranty period, change control, a separate support agreement, and a clean way out for either side. It also touches on unfair contract terms, which can protect a small business offered a developer's standard terms. The failure case is the developer's standard contract, which would have left the business renting its own software.

This chapter is general information, not legal advice. The business had its contract reviewed by a lawyer experienced in technology agreements, and any business commissioning software should do the same.

## Read the contract as a story about the future

The most useful way to review a software contract is not clause by clause but scenario by scenario. The owner and the lawyer read the draft against five questions. What happens if the developer is unavailable for a month during the build? What happens if the developer goes out of business a year after go-live? What happens if the business wants another developer to add a feature in year three? What happens if the hosting bill is not paid because a card expires? And what happens if the business is sold? Each question exposed a gap in the developer's standard terms, and each answer in the final contract can be traced to one of them.

## Who owns the code

Under Australian law, a contractor who writes software generally owns the copyright in it unless it is assigned in writing, even when the client has paid for it, as Victorian Government business guidance explains. A business that pays a developer to build software and signs nothing about ownership may own very little.

The contract assigns to the business the copyright in all code, designs and documentation written for the project, from the moment each is created. Developers usually bring their own tools and reusable components, written before the project and used for many clients. Those stay the developer's, and the contract gives the business a permanent, royalty-free licence to use, change and have others maintain them as part of its system. Open-source components are listed, with their licences, as Chapter 2 of *Engineering Software You Can Sell* describes from the seller's side.

## Source code as it is built, not at the end

Ownership on paper is worth little if the business does not have the code. The contract requires the developer to keep all source code, build scripts and documentation in a repository owned by the business, under the business's account, with the developer given access. Every increment's code is in that repository before the increment is accepted.

That one requirement removes most of the risk that escrow arrangements, in which code is held by a third party, are designed to cover. If the developer disappears tomorrow, the business has the code as of the last increment, and a new developer can pick it up. The operations manager checks the repository at each increment's acceptance, which takes ten minutes and needs no technical skill beyond seeing that the files are there and dated.

## Data and accounts in the business's name

The app runs on a cloud hosting service. The contract requires the hosting account, the domain name, the database and every other service the app depends on to be in the business's name and paid by the business, with the developer given administrative access. The business's data, every job, time, scrap record and inspection, belongs to the business and can be exported in a documented, standard format at any time.

The app records operators' identities and their working times, which is personal information about employees. The contract requires the developer to handle it securely and only for the business's purposes. The business, for its part, told its staff before go-live what the app records and why. Some Australian states have workplace surveillance laws that may bear on monitoring employees' work, and the business took advice on how they applied.

## Pay against accepted increments

The work is delivered in increments, short stages each ending with working software the business can test, as Chapter 5 describes. Payments follow acceptance, not the calendar.

```figure
type: timeline
title: The job-tracking project's payment schedule
caption: This is an illustration. Amounts exclude GST. The A$88,000 build after discovery is paid in five increments of A$17,600, each with 10% retained until the end of the warranty period.
- Discovery | A$8,000 | paid on delivery of refined stories, prototype and revised estimate
- Increments 1 to 5 | A$15,840 each | 90% of A$17,600, paid on acceptance of each increment
- Go-live | Warranty starts | 90 days of defect correction at no charge
- *End of warranty | A$8,800 released | the 10% retained from all five increments
```

The retention gives the developer a reason to fix defects promptly during the warranty period, and gives the business a little protection if defects remain. It is calculated on the build, the figure that the cap from Chapter 3 limits.

## Warranty and defects

The contract defines a defect as the software not meeting an accepted acceptance criterion, or failing in a way that stops a must-have working. For **90 days** after go-live, the developer fixes defects at no charge, with response times by severity: a defect that stops operators recording work is started within four working hours, and a minor one within five working days. After the warranty, defects are handled under the support agreement.

Defects are not the same as changes. A request for something the acceptance criteria did not include is a change, handled through change control. The acceptance criteria from Chapter 2 are what make the distinction clear, which is one more reason to write them carefully.

## Change control

Requirements change during a project, as people see the software and learn what they really need. The contract sets out a simple process: either side can propose a change, the developer estimates its effect on cost and time, the business approves or declines it in writing, and approved changes adjust the estimate and cap. Changes are recorded in a log. Small changes within an increment that the developer can absorb without affecting the estimate are allowed without formality, but are still logged.

## Support is a separate agreement

Support after the warranty is a different relationship from the build, with its own agreement: a monthly fee covering a set number of hours, response times by severity, hosting management, security updates to components, and a rate for work beyond the included hours. It can be ended by either side with notice, typically three months, and its ending triggers the exit obligations below. Separating it means the business can change its support provider later without renegotiating the build contract. Chapter 8 covers support in detail.

## A clean way out

Every contract should say how it ends. The business's contract allows either side to end the relationship with notice, and requires the developer, on exit, to:

- confirm that all code, documentation and build instructions are in the business's repository and up to date;
- hand over every credential and access, and remove their own;
- provide up to **20 hours** of handover to a successor developer, at the support rate;
- delete the business's data from their own systems, keeping only what the law requires.

The exit clause is the one both parties hope never to use. It is also the one that most changes the balance of power during the relationship, because a business that can leave easily is a business whose developer stays attentive.

```figure
type: compare
title: The developer's standard terms and the agreed contract
cols: Developer's standard terms | Agreed contract
caption: This is an illustration of the main changes negotiated with the business's lawyer. The developer accepted all of them; most said their standard terms had been written for small website clients.
- Ownership of project code | developer keeps it; client licensed to use it | assigned to the business; developer's prior tools licensed permanently
- Source code | provided on request at the end | in the business's repository at every increment
- Hosting and accounts | in the developer's name, charged to the client | in the business's name, developer given access
- Payment | 50% upfront, 50% at completion | against accepted increments, 10% retained to end of warranty
- *Exit | not addressed | notice, handover of code and credentials, 20 hours of transition help
```

## Liability and insurance

Software faults can cost money: lost production records, a missed delivery because a job's status was wrong, an audit failed for want of an inspection record. The contract sets each side's liability for such losses, usually capped at a multiple of the contract value for most kinds of loss, with some kinds, such as breaches of confidentiality, outside the cap. The developer holds professional indemnity insurance, with a certificate provided before signing and renewed each year of the support agreement. The business, for its part, keeps its paper fallback for the first weeks after go-live and its own backups of exported data, so that a fault in the app is an inconvenience rather than a disaster.

## Confidentiality of the business's know-how

During discovery and the build, the developer learns a great deal about the business: its customers, prices, processes, inspection requirements and problems. The contract keeps all of that confidential and prevents the developer using the business's specific workflows, customer forms or data in work for others. It does not prevent the developer reusing general skills and techniques, which would be unreasonable and probably unenforceable. A competitor commissioning a similar app from the same developer would get a similar kind of software, built from scratch, without the business's customer forms or data.

```figure
type: checklist
title: The business's contract checklist, reviewed with its lawyer
caption: This is an illustration. Each line was checked against the developer's draft before signing; the first three are the ones most often missing from developers' standard terms.
- Copyright in project code assigned to the business; prior tools licensed permanently | not a licence that ends with support
- Source code, build instructions and documentation in the business's repository at every increment | not "on request at the end"
- Hosting, domains and services in the business's name | developer given access, not ownership
- Payment against accepted increments with a retention to the end of warranty | never for work not yet delivered
- Defined acceptance, defects, warranty period and change control | linked to the brief's acceptance criteria
- Separate support agreement with response times and notice to end | Chapter 8
- Exit: handover of code, credentials and transition help | the clause that keeps the relationship balanced
- x Signing a developer's standard terms without a lawyer's review | written for different clients and risks
```

## Unfair contract terms

Many developers offer their standard terms on a take-it-or-leave-it basis. Those are standard-form contracts. Since **9 November 2023**, Australian law prohibits unfair terms in standard-form contracts with consumers and small businesses, and penalties apply, as the ACCC has explained. A small business for this purpose, in the government's description, is one with fewer than 100 employees or turnover under A$10 million, which describes the machining business and many like it. Terms that let one side change the contract at will, end it without cause while the other cannot, or avoid all responsibility may be unfair.

The protection is useful background, but negotiating fair terms is better than relying on the law afterwards. The Australian Government's Digital Transformation Agency publishes a digital sourcing framework and contract templates for its own purchasing. They are written for government, not small business, but they are a useful public model of balanced clauses on ownership, data, acceptance and exit, and the business's lawyer used them as a reference.

## A failure case: renting your own software

This is an illustration. Developer Z's first contract draft was its standard terms. Under them, the developer kept the copyright in everything it wrote and gave the business a licence to use the software while the support agreement continued. Hosting was in the developer's account, charged on to the business. Source code would be "provided on reasonable request at completion".

Read quickly, it looked normal. Read by the business's lawyer, it meant that the business would pay about A$96,000 for software it did not own, could not move to another developer, and could lose access to if the support agreement ended. In effect, it would be renting its own system.

The detection came from a lawyer's review before signing, about **A$2,200** of legal fees excluding GST. The developer, asked to change the terms, agreed without difficulty. Its standard terms had been written for small website clients, and it had not thought about a client that would depend on the software for years. The lesson recorded was simple: never sign a software contract that has not been read by someone whose job is to find what it means after the developer leaves.

## How this applies to a small Australian business

Small businesses often sign developers' standard terms because the project feels urgent and the developer seems trustworthy. Most developers are trustworthy. The terms still decide what happens when circumstances change, and circumstances always change over the life of a system. Insist on ownership of project code, source code in your own repository at every stage, accounts in your name, payment against accepted work, a warranty period and a clean exit. Pay a lawyer to read the contract. It costs a small fraction of the build and protects all of it.

## Exercise: a different payment schedule

The developer proposes instead 30% of the A$88,000 build on signing, 40% at the third increment and 30% at go-live, with no retention. Calculate the amounts, and compare the business's exposure at the end of increment 2 with the agreed schedule, assuming increments 1 and 2 have been accepted.

**Worked answer.** The proposed schedule pays **A$26,400** on signing, **A$35,200** at increment 3 and **A$26,400** at go-live, with nothing retained. At the end of increment 2, the business has paid **A$26,400** for two increments of work worth about **2 × A$17,600 = A$35,200**, so its exposure is low, but A$26,400 was paid before any work existed. Under the agreed schedule, it has paid **2 × A$15,840 = A$31,680** for accepted work, with A$3,520 retained. The agreed schedule never pays for work before it is accepted and keeps a retention through the warranty. The proposed one pays a large sum before anything is delivered and leaves no leverage for defects after go-live.
