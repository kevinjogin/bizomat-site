---
book: engineering-software-you-can-sell
chapterSlug: own-what-you-sell
order: 2
title: "Own what you sell"
description: "Before selling an engineering tool, confirm who owns each part of its code, what third-party licences require, what the CAD vendor's terms allow and whether the product's name is free to use."
draft: false
---

A firm can only sell what it owns or is licensed to resell. Software built inside an engineering office over several years rarely has a clean ownership record. Parts were written by employees, parts by a contractor who has since moved on, parts copied from an online example, and the whole thing calls libraries from other people and runs on a CAD vendor's programming interface under that vendor's terms. None of that matters while the tool stays inside the office. All of it matters the moment the firm offers it for sale, gives a reseller a warranty, or is asked by a buyer's lawyer who owns the code.

This chapter audits the drawing-checking add-in's ownership before anything is sold. It covers who owns code written by employees and contractors, what the licences of third-party components require, what the CAD vendor's developer terms allow, whether the product name is free to use and whether any client's confidential information has crept into the tool. The failure case is a contractor's code with no written assignment, discovered when a reseller asked for a warranty.

This chapter is general information, not legal advice. Ownership questions depend on contracts, facts and the law at the time, and a firm planning to sell software should have a lawyer review its position.

## Copyright arises automatically

In Australia, copyright in original computer code arises automatically when it is written. There is no register to join. That makes ownership easy to acquire and hard to prove, because the evidence is in employment contracts, contractor agreements, version-control history and emails rather than in a certificate.

Government business guidance summarises the starting points. Code written by an **employee** in the course of their employment is generally owned by the employer. Code written by a **contractor** generally belongs to the contractor unless they have assigned it in writing, even if the client paid for it. Where several people wrote code together, they may be joint authors unless an agreement says otherwise. Each of these is a default that contracts can change, which is why the contracts matter.

## Map who wrote what

The office went through the add-in's version-control history and its own records to map every part of the code to the person who wrote it and the basis on which they wrote it.

```figure
type: tree
title: Who wrote the drawing-checking add-in, and on what basis
caption: This is an illustration. The map came from the version-control history, timesheets and contracts; each branch needed a different kind of evidence.
- The add-in, about 17,000 lines of its own code
  - Checking rules and core engine, about 11,000 lines | employee designer, in work hours, over three years | employment contract on file
  - Early macros later folded in, about 1,500 lines | the principal, before the company was formed | assignment to the company needed
  - Interface and installer, about 4,000 lines | contract developer, two engagements | no written assignment found
  - Snippets adapted from public forum examples, about 300 lines | unknown authors | licence terms of the forum to be checked
  - Third-party libraries, 14 components | various | each under its own licence
```

Each branch raised its own question.

**The employee designer's work** was written during work hours as part of their role, under an employment contract that included a standard intellectual property clause. The office was comfortable that it owned this code. The designer had also done some work on a personal laptop in the evenings. Commentary on Australian cases suggests that ownership of work done outside hours depends mainly on whether it falls within the employee's duties, not on the device or the time. The office's lawyer was content that checking drawings was within the designer's duties, and the designer confirmed in writing that they claimed no ownership.

**The principal's early macros** were written before the company existed, so the principal personally owned them. A short written assignment to the company fixed that.

**The contract developer's interface and installer** were the problem, covered in the failure case below.

**Forum snippets** are a common and underestimated risk. Code posted online is not automatically free to reuse. Some forums specify a licence for posted code and some do not. The office found the source of each of its five adapted snippets. Two came from a forum whose terms granted a permissive licence. Three could not be traced, and the office rewrote them from scratch, about 12 hours of work.

## Third-party components and their licences

The add-in used **14** third-party components: libraries for reading spreadsheets, writing reports, logging and similar tasks. Each came with a licence, and selling the add-in means distributing those components under their terms.

```figure
type: compare
title: Common kinds of open-source licence and what selling software usually involves
cols: Typical obligations when distributing | What the office did
caption: This is a general summary, not legal advice. Licence terms differ in detail; read each component's actual licence and take advice on anything unclear.
- Permissive, such as MIT, BSD or Apache 2.0 | keep copyright and licence notices; Apache 2.0 also has notice and patent terms | 11 components; notices collected in a third-party notices file shipped with the product
- Weak copyleft, such as LGPL or MPL | changes to the component itself must be shared; using it from separate code is usually allowed with conditions | 2 components; used unmodified, conditions documented
- *Strong copyleft, such as GPL | distributing a work based on the component can require offering that work's source under the same licence | 1 component; replaced with a permissively licensed alternative
- No licence stated | no permission to redistribute by default | none after the audit
```

The audit took about **16 hours**: listing each component and version, finding its licence, recording the obligations and collecting the notices. The single strong-copyleft component, a small charting library, was replaced with an alternative under a permissive licence. That took about 10 hours. The office could have taken advice on whether its use triggered the licence's source-sharing conditions, but replacing it was cheaper and removed the question for good.

The component list became a controlled document, updated with every release, because a developer adding a convenient library in a later version could reintroduce the problem. It is the same software bill of materials that a security process needs, and the companion book on connected products discusses it from that angle.

## The CAD vendor's terms

The add-in runs inside a commercial CAD system and uses that system's programming interface. CAD vendors publish terms for developers, sometimes as part of the software's own licence and sometimes as a separate developer or partner programme. Those terms may cover whether the interface can be used for commercial products, whether any of the vendor's libraries may be redistributed with the add-in, how the vendor's name and trade marks may be used, and whether a partner programme offers listing, testing or early access to new releases.

The office read the vendor's current terms, asked its CAD reseller to confirm its reading, and joined the vendor's developer programme. Three points shaped the product:

- the vendor's interface libraries are installed with the CAD system, so the add-in's installer does not include them;
- the product name may describe compatibility with the CAD system, in the form the terms allow, but may not include the vendor's trade mark as part of the product's own name;
- a new release of the CAD system may change the interface, and the vendor does not guarantee compatibility, which became part of the support policy in Chapter 4.

Vendors' terms change, and they differ between vendors. Read the current version for your own platform rather than relying on anyone else's summary, including this one.

## The name

The office had called the add-in by a nickname internally. Before selling it, the firm needed a product name it could use and defend. Registering a business name or a domain name does not give exclusive rights to use a name as a trade mark. The office searched IP Australia's trade mark records for its preferred names in the relevant classes, found that its first choice was already registered by a software company for similar goods, and chose another. It then applied to register the new name. The steps and costs are covered in [Trade marks for small businesses](/reados/collections/starting-funding-and-structuring-a-business/trade-marks-for-small-businesses/).

## Clients' confidential information

Tools built inside a consultancy absorb knowledge from client work. The add-in's first version included checking rules that encoded one major client's drafting standard, written into the code from the client's confidential standard document. Selling that would have disclosed the client's confidential information, and possibly breached the office's contract with that client.

The office moved all drafting-standard rules out of the code into configuration files, which each customer writes for its own standard. It shipped only a generic configuration based on public practice, and kept the client's configuration for use on that client's projects alone. The change also made the product more useful, because every customer has its own standard. The general point: before selling a tool, search it for anything that came from a client, including rules, templates, sample files and test drawings.

```figure
type: checklist
title: Ownership audit before selling the add-in
caption: This is an illustration of the office's audit. Each line has evidence filed with the product records.
- Every part of the code mapped to its author and the basis of their work | version-control history and contracts
- Written assignments from anyone who is not an employee acting in their duties | principal and contract developer
- Forum or example code traced to a licence or rewritten | three snippets rewritten
- Third-party components listed with licences, obligations met, notices shipped | one component replaced
- CAD vendor's developer terms read and confirmed for commercial use and naming | developer programme joined
- Product name searched and trade mark application filed | first choice already registered
- x Client standards, data or drawings inside the product or its test files | moved to client-only configuration
```

## A failure case: the contractor's code

This is an illustration. A year before the decision to sell, a contract developer had built the add-in's interface and installer over two short engagements, invoiced by the hour. There was a purchase order and a set of invoices, but no written agreement and no assignment of copyright. Nobody had thought about it, because the tool was for internal use.

The gap was found when the CAD reseller, discussing distribution in Chapter 9, sent its standard reseller agreement. It required the office to warrant that it owned or was licensed to distribute every part of the product. The office's lawyer pointed out that, on the general rule, the contractor probably still owned the copyright in about 4,000 lines of the product's code. The office probably had an implied licence to use that code internally for the purpose it was written. That did not obviously extend to selling it.

The office contacted the developer, who was helpful but reasonably asked to be paid for transferring rights in work they had priced as a service. After a short negotiation, the developer signed a deed of assignment for a fee of **A$3,000** plus the office's legal costs of about **A$1,200**, both excluding GST. The alternative, rewriting 4,000 lines, was estimated at about 160 hours, roughly A$17,600 at the internal rate.

The detection came late, from a third party's due diligence, but before any sale. Had the office sold licences first and found the gap afterwards, it would have been negotiating with the developer while already in breach of the reseller's warranty, from a much weaker position. The correction for the future was simple: every contractor who writes code for the office now signs an agreement assigning copyright to the office, before work starts, whether or not the code is ever expected to leave the building.

## Keep the evidence where it can be found

Ownership is proved with documents, and the documents need to be findable years later, when a reseller, an investor or a buyer of the business asks. The office created an ownership register for the product, kept with its release records, holding:

- the map of contributors from the version-control history, updated with each release;
- each employee's employment contract clause on intellectual property, or a note of where it is filed;
- every written assignment, from the principal, the contract developer and any later contributors;
- the third-party component list for each release, with licences and the notices file;
- the CAD vendor's developer terms as they stood when each version was released, and the developer programme membership;
- the trade mark search, application and registration;
- a record of the client-confidentiality review and what was removed.

Due diligence questions follow a predictable pattern. Who wrote it? Under what agreement? What third-party code does it contain and under what licences? Does it infringe anyone's rights? Has anyone claimed it does? Is any of it subject to a security interest? A register that answers those questions in an afternoon turns a negotiation that could take weeks into a formality. It also lets the firm give the warranties a reseller agreement asks for with confidence, rather than hoping.

## How this applies to a small Australian business

Most engineering firms have never had to think about who owns their code, and most have gaps like these. The audit is not expensive: a few days of internal work and a short review by a lawyer familiar with intellectual property. It is much cheaper before a sale, an investment or a reseller agreement than during one. Fix contractor agreements now, for all future work, because it costs nothing at the start of an engagement and can cost thousands afterwards. If the firm uses employees' after-hours projects, settle ownership in writing while everyone is on good terms. And consider which entity should own the product. Some firms hold intellectual property in a separate company within their group, so that a software venture's risks and value are kept apart from the engineering practice. That is a structuring question for an accountant and a lawyer, best answered before the first sale rather than after.

## Exercise: a new component

A developer proposes adding a free PDF-reporting library to the next version. Its licence is the GPL. The library would save about 40 hours of development. A permissively licensed alternative exists but would take about 70 hours to integrate. At A$110 an hour, what is the cost difference, and what would you recommend before deciding?

**Worked answer.** The GPL library costs about **40 × 110 = A$4,400** of integration, the alternative about **70 × 110 = A$7,700**, a difference of **A$3,300**. Before deciding, the office should get advice on whether distributing the add-in with that library would make the add-in a work based on it under the GPL's terms, which could require offering the add-in's source code under the same licence. If the answer is yes, or uncertain, the A$3,300 is a small price for avoiding that obligation and the uncertainty it brings to every later reseller agreement. On the office's past practice, it would choose the permissive alternative.
