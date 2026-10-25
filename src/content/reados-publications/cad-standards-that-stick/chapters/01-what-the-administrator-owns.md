---
book: cad-standards-that-stick
chapterSlug: what-a-cad-administrator-owns
order: 1
title: "What a CAD administrator owns"
description: "Define the CAD administrator's job as ownership of a shared environment, list what it contains, give it a time budget and test that budget against what inconsistency costs."
draft: false
---

Most small design offices do not appoint a CAD administrator. They notice, usually after an expensive mistake, that somebody has been doing the job informally: the person who knows where the good templates are, who fixes the broken library part and who is asked why the drawing printed with the wrong line weights. Making the role explicit does not create new work. It makes existing work visible, gives it a budget and lets the rest of the office stop solving the same problem six times.

This chapter defines the role by what it owns rather than by a job title. It lists the parts of a CAD environment, separates administration from design and from information technology, and sets a time budget for the running case office. Its error case is the one that usually triggers the conversation: a drawing that was correct on one seat and wrong on another.

## Ownership, not expertise

A CAD administrator is often chosen because they are the best user. Skill helps, but the defining feature of the role is ownership. The administrator is the person who decides, records and maintains the shared parts of the environment, and who answers for whether they work.

Ownership has three practical consequences. First, there is one place to send a request to change a template or add a library part, rather than everyone making their own copy. Second, there is one record of what the current standard is, so a new starter can be told rather than left to imitate whoever sits nearby. Third, there is someone who notices when the environment starts to drift and has the authority to correct it.

Ownership does not mean doing everything personally. The administrator can delegate library maintenance to a drafter or ask a designer to test a new template. What cannot be delegated away is the decision about what the standard is. Where two people each believe they own the templates, the office has two standards.

## What the environment contains

A CAD environment is larger than the software. A useful first step is to write down every shared element, because anything not on the list tends to be left to individual habit. For the running case office, the list looks like this.

```figure
type: tree
title: The parts of a small office's CAD environment
caption: This is an illustration for the running case office. Anything shared by more than one person belongs on the administrator's list.
- CAD environment | owned by the CAD administrator
  - Software | versions, service packs, add-ins and licences
  - Settings | system options deployed to every seat
  - Start files | part, assembly and drawing templates; sheet formats
  - Data definitions | custom property names, allowed values, title block links
  - Libraries | standard parts, purchased parts, features, symbols
  - Rules | written modelling and drawing standard, checklists
  - People | onboarding, training, support log, change requests
  - *Records | register of the above, with revision and owner
```

The last branch, the register, is the one most often missing. A register is simply a table listing each controlled item, its location, its current revision, its owner and the date it last changed. Without it, the question "which template is current?" has no answer except memory.

Some items sit at the boundary of the role. Workstation hardware, network storage, backups and operating system updates usually belong to whoever looks after information technology. Product data management, numbering and release usually belong to engineering management. The CAD administrator does not need to own those, but needs to know who does, because a CAD problem often turns out to have its cause on the other side of the boundary.

## Administration, design and IT

Three roles meet at the CAD workstation, and confusion between them is a common source of friction.

```figure
type: compare
title: Who decides what at the CAD workstation
cols: Decides | Typical example
caption: This is an illustration. In a small office one person may hold two roles, but the decisions remain different decisions.
- Designer | how this part or product meets its requirements | the wall thickness of a side member
- *CAD administrator | how every file in the office is set up and structured | the property names in the part template
- IT support | how computers, storage and networks run | the graphics driver version and backup schedule
- Engineering manager | what is released, and when | approving the drawing for manufacture
```

The distinctions matter when something goes wrong. If a drawing shows the wrong material, the cause may be the designer's choice, a template default, a property mapping or a corrupted file. Each has a different owner. A support process that sends every CAD question to one person will overload that person and leave the real cause unaddressed.

In a six-seat office, the administrator is almost always also a designer. That is workable, provided the administrator's own design deadlines do not silently consume the administration time. The usual failure is that the four hours a week exist on paper and disappear whenever a project runs late, which is precisely when the environment is under most strain.

## Set a time budget and test it

The running case office has allocated four hours a week. This is an illustration. Over 46 working weeks, that is **4 × 46 = 184 hours a year**. At the internal cost rate of A$95 an hour, the allocation costs **184 × 95 = A$17,480 a year**. Is that too much, too little or about right?

One way to answer is to estimate what inconsistency currently costs. The office reviewed its last twelve months and found three measurable losses.

- **Reissued drawings.** Eleven drawings were reissued after reaching the workshop because of environment causes: an old template with a superseded title block, a part modelled in inches, a sheet scale that did not match the stated scale. Each cost about 3.5 hours of rework plus A$420 of scrap or remade parts, so **11 × (3.5 × 95 + 420) = 11 × 752.50 = A$8,277.50**.
- **Manual title block entry.** Because properties were not linked to the title block, each new drawing needed about five minutes of typing that a template could have filled. Over 480 drawings that is **480 × 5 = 2,400 minutes, or 40 hours**, worth **A$3,800**.
- **Searching for library parts.** Each of six people estimated twenty minutes a week spent looking for, or recreating, a standard part. That is **6 × 20 ÷ 60 × 46 = 92 hours**, worth **A$8,740**.

```figure
type: bars
title: Estimated annual cost of inconsistency against the administration budget
unit: A$
max: 21000
caption: This is an illustration. The losses are estimates from one year's records and staff recollection, not measurements, and only part of them can be recovered.
- Reissued drawings | 8277.5
- Searching and recreating library parts | 8740
- Manual title block entry | 3800
- *Total estimated loss | 20817.5
- Administration time, 4 h a week | 17480
```

The estimated losses total **A$20,817.50**, which is larger than the budget, but not by much. That comparison is useful for two reasons. It shows that four hours a week is a reasonable order of magnitude: it is neither trivial nor wildly excessive compared with what is at stake. It also shows that the budget must be spent on the causes of these losses, not on interesting side projects. If the administrator spends the year writing macros that save nobody time, the losses continue and the budget is spent as well.

Do not treat the comparison as a business case accurate to the dollar. The search time is a recollection, the reissue costs vary widely and nobody can recover all of the loss. The value of the exercise is that it ties the administration time to named problems that can be measured again later. Chapter 2 makes that measurement more rigorous.

## The error case: correct on one seat, wrong on another

The incident that prompted the running case office to formalise the role is a common one. A designer prepared a drawing of a drive-end bracket on their own seat, checked it on screen and sent a PDF to the workshop. The printed drawing looked right. A week later the drafter opened the same drawing to add a revision and printed it for the folding press operator. The bend lines were missing and two hidden lines appeared solid.

Nothing in the drawing file had changed. The difference lay in the seats. The designer's computer had a system option set to show bend lines on sheet metal drawings by default; the drafter's did not. The drafter's seat also mapped line styles differently when printing. Each person's output was consistent with their own settings, and both believed the drawing was correct.

The office found the cause by opening the drawing on all six seats and printing the same sheet from each. Three seats gave one result and three gave another. The investigation took about two hours. The correction had three parts:

1. The drawing was fixed so that bend lines were controlled by the drawing itself rather than by a system default.
2. The system options on all six seats were exported and compared, which revealed many more differences than the one that caused the incident. Chapter 2 describes that comparison.
3. The office decided that settings capable of changing printed output would in future be set centrally and recorded, which is the subject of Chapter 3.

The lesson is not that the drafter or the designer made a mistake. Both did reasonable work in an environment that allowed the same file to mean two things. That is an administration failure, and it needs an administration fix.

## Write a short charter

The most useful single document for a new administrator is a one-page charter. It should state what the role owns, who it serves, how requests reach it, how much time it has and how success will be measured. A charter turns an informal arrangement into something the engineering manager can support and other staff can rely on.

```figure
type: checklist
title: A one-page charter for the CAD administrator
caption: This is an illustration for the running case office. A charter longer than one page is usually trying to be a standard.
- Scope | settings, templates, properties, libraries, written standard, CAD training and first-line support
- Boundaries | IT owns hardware, storage and backups; engineering owns numbering and release
- Time | four hours a week, protected; reported monthly against use
- Requests | one shared request list; no private fixes to shared items
- Authority | may reject changes to shared items that bypass the request list
- Measures | reissues from environment causes, property errors in sampled drawings, support requests by category
- ? Backup person | who acts when the administrator is away
```

The open item at the bottom matters. A role held by one person is a single point of failure. The charter should name a backup who knows where the register is and can deploy a corrected template if the administrator is on leave. In a six-seat office, the engineering manager or a senior designer usually takes that role.

## Plan the first quarter around causes

A new administrator faces a long list of possible improvements and a short weekly allowance. The temptation is to begin with whatever is most visible or most enjoyable, often a new title block or a clever macro. A better order follows the causes of loss, starting with the ones that make the same file mean different things, because every later improvement depends on them.

For the running case office, the first thirteen weeks at four hours a week give **13 × 4 = 52 hours**. The administrator planned them in this order.

```figure
type: timeline
title: The administrator's first quarter
caption: This is an illustration. Hours are planned allocations from the 52 available; measurement comes first so that later changes can be judged.
- Weeks 1–2 | Charter and register | agree scope, list every shared item, about 8 hours
- Weeks 3–4 | Baseline | compare settings, time models, sample drawings, about 10 hours
- Weeks 5–7 | Settings | classify, decide and deploy the controlled set, about 12 hours
- Weeks 8–11 | Templates and properties | build, test and release the first set, about 16 hours
- *Weeks 12–13 | Measure again | repeat the sample and report, about 6 hours
```

The allocations sum to **8 + 10 + 12 + 16 + 6 = 52 hours**. Library consolidation, the modelling standard and compliance checking follow in the second and third quarters. The plan is deliberately modest. A first quarter that finishes its work and reports a measured result earns support for the next; one that starts five things and finishes none earns scepticism.

## Handle requests and learn to say no

Once the role is visible, requests arrive. Some are improvements to shared items, some are personal preferences, and some are design questions that belong to someone else. The administrator needs a simple way to sort them so that the four hours go to work that benefits the office.

A short test helps. Does the request affect more than one person's files? Does it change results, such as printed output, properties or the bill of materials? Is there a measured problem behind it? A request that answers yes to all three goes near the top of the list. A request that affects only one person's screen colours is a personal preference and can usually be left to that person, as Chapter 3 explains. A request about whether a bracket is strong enough is a design question and goes to the engineer.

Saying no is easier when the reasons are written down. The charter's statement that shared items change only through the request list allows the administrator to decline a private fix without making it personal. Record declined requests too. A request declined three times by three different people is evidence of a real need, and the register should show it.

## What good looks like after a year

The aim is not a perfect environment. It is a stable one in which every seat gives the same result, new files start correctly, shared parts are found rather than recreated, and changes happen through a known route. Useful signs of progress are measurable:

- reissues caused by the environment fall towards zero;
- sampled drawings show fewer property and template errors;
- support requests shift from "why is this different?" towards "can we add this?";
- an upgrade can be planned and carried out without a week of lost productivity.

Each of these can be counted, and the following chapters show how. Report them monthly in a few lines, alongside the hours actually spent. A short, regular report keeps the role visible to the engineering manager, shows where the time goes and makes it much easier to defend the budget when a busy project tempts everyone to borrow it. If none of them improves after a year, the time budget is being spent on the wrong things, and the charter should be revisited. If they all improve, the budget can be defended and perhaps reduced, because a stable environment needs less attention than a drifting one.

READOS's chapter on [governing a CAD environment](/reados/collections/engineering-design-practice/governing-a-cad-environment/) gives a broader overview of the same governance ideas. This book goes further into each element, using one office throughout.

## Exercise: size the budget again

The engineering manager suggests cutting the administration time to three hours a week, on the grounds that the office is small. Using the running case figures, what does three hours a week cost, and how does it compare with the estimated loss? What would you want to know before agreeing?

**Answer.** Three hours a week over 46 weeks is **3 × 46 = 138 hours**, costing **138 × 95 = A$13,110 a year**. The estimated loss remains **A$20,817.50**, so the comparison alone does not decide the question: both budgets are of the same order as the loss, and neither will recover all of it.

Before agreeing, ask which losses the reduced budget will still address and how quickly. The three largest causes, reissues, library searching and title block entry, each need a defined piece of work: settings control, a consolidated library and linked templates. If the setup work can be finished in the first months, a lower ongoing allocation may be enough. If the setup is still incomplete, cutting time now prolongs the losses. A sensible answer is to keep four hours until the measures in Chapter 2 show the main causes fixed, then review.
