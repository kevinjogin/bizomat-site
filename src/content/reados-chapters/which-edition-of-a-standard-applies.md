---
title: "Which edition applies? When the law references an older version of a standard"
description: "Laws, codes and contracts often reference a specific edition of a technical standard, so working to the newest edition can leave you unable to show compliance. How to track it."
publishDate: 2026-10-04
category: "Business"
tags:
  - systems
  - validation
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

Most compliance problems run in one direction: a requirement changed and the business did not keep up. A less familiar problem runs the other way. The business kept up, diligently adopting the newest edition of a technical standard, but the law, code or contract that actually governs its work still references an older edition. The business has improved its practice and, in the process, may have stepped outside the obligation it is actually under.

This happens because of how technical requirements are written into law and contracts. Legislators and regulators rarely write detailed technical requirements themselves. Instead they **adopt standards by reference**: a regulation, building code or licence condition names an external standard and says that complying with it satisfies a requirement. Often the reference names a specific edition, fixed on the date the instrument was written. The standard itself keeps being revised on its own schedule. The two drift apart.

The result is easy to miss, because nothing breaks. The equipment works and the building stands. The problem surfaces at a checkpoint: certification, an audit, insurance renewal, handover, a claim or the sale of an asset, when someone asks you to demonstrate compliance with the edition named in the governing document, and your evidence was prepared against a different one. This article explains how adoption by reference works, why good document control can create the problem, and how to track which edition applies.

## Dated and undated references

References to standards generally come in two forms:

- A **dated reference** names a particular edition, for example a standard identified with its year of publication. The obligation stays tied to that edition, whatever the standard's publisher does later, until the instrument itself is amended.
- An **undated reference** points to the standard without naming an edition. Depending on the instrument and how it is interpreted, it may refer to the current edition, so the obligation can move when the standard is revised.

Both types are common, and both can appear in the same document. Neither is usually flagged in a way that someone maintaining a standards library would notice. Building codes, electrical safety regulations, plumbing and gas regulations, workplace safety rules, product safety requirements, government procurement specifications and private contracts all reference standards, and the way each one does so matters.

## Why the newest edition is not automatically the right one

It is natural to assume that the newest edition of a standard is always safer and better. Technically, it often is. But in compliance terms it is simply different:

- A later edition may tighten some requirements and relax others.
- It may change the **test method** or method of demonstration, so evidence produced under one edition does not automatically satisfy an obligation framed around another.
- It may reorganise clauses, so cross-references in design documents no longer line up.

```figure
type: balance
title: Dated and undated references
left: Dated reference
right: Undated reference
caption: The obligation comes from the governing instrument, not from the standard's newest edition.
- Names a particular edition | Points to the standard without an edition
- The obligation stays with that edition | It may move when the standard moves
```

A design that exceeds the requirements of the referenced edition in performance may still fail to demonstrate compliance with it, because what an assessor checks is the demonstration against the named edition, not general quality.

## How good document control creates the problem

Quality systems are designed to stop people working from outdated documents. Document control identifies superseded editions, marks them obsolete, withdraws them and replaces them with the current version. In most situations that is exactly right.

But if a governing instrument still names the older edition, document control has just removed the document the obligation actually refers to. The control worked as designed and produced the gap.

The gap persists because two different parts of an organisation look after two different documents. Engineering or quality maintains the standards library and is measured on keeping it current. Legal, compliance or an external certifier reads the regulations and contracts. Neither owns the relationship between the two. Each is performing competently, and the defect sits in the gap between them.

A further clue: standards publishers sometimes keep selling superseded editions. That usually happens because some instrument still references them.

## Where the gap appears

### At certification or approval

A design team works to the newest edition of a standard governing a piece of plant or a building system. The certifier or approval authority is bound by an instrument that names an earlier edition. The design may be excellent, but the certifier must assess it against the named edition using that edition's methods. The result is not necessarily rejection, but a demand for additional evidence, produced late, against a document the team no longer uses. Time and money are lost.

### In contracts

Many supply contracts warrant compliance with "all applicable standards". That phrase raises questions: applicable where, and as referenced by whom? If a customer operates under an instrument that references a different edition from the one the supplier designed to, the warranty may be breached without either party noticing, until someone checks. Open-ended wording shifts the edition risk onto whichever party is least able to see it.

### When assets change hands

Long-lived assets, such as buildings, plant and vehicles, are often designed, built and certified across several years, during which editions change. When the asset is sold, refinanced or insured, a third party may read the governing instruments for the first time and ask which edition the evidence relates to.

## An edition register

The practical tool is an **edition register**. It is not a list of standards, but a list of pairs: each obligation and the standard it references. Create one row for each obligation that governs a product, asset or process.

| Field | What it records | Why it matters |
|---|---|---|
| Governing instrument | The regulation, code, licence, specification or contract creating the obligation | The obligation comes from here, not from the standard |
| Reference type | Dated or undated | Whether the obligation moves when the standard moves |
| Edition referenced | The edition the instrument names | The compliance benchmark |
| Current published edition | The publisher's latest edition | The engineering benchmark |
| Gap | None, one edition, or more | The size of the exposure |
| Design basis | The edition the design team works to | Where a mismatch is created |
| Evidence basis | The edition the test or verification evidence was produced under | Where a mismatch becomes costly |
| Owner | A named person | Gaps between functions have no owner by default |

### Three checks

1. **Read the reference.** For every row, someone must read the actual citation and record whether it is dated or undated. If it has been assumed rather than read, treat it as unknown, and treat unknown as a potential gap.
2. **Check for drift.** Where the reference is dated and differs from the current edition, flag the row. If the affected product or asset is being designed, built or is still under warranty, escalate it to the owner promptly.
3. **Check direction.** For each flagged row, state which edition the design follows and which the evidence follows. If they differ from each other or from the referenced edition, estimate the work needed to close the gap before the next major decision.

```figure
type: steps
title: Three checks on an edition register
caption: Gaps between functions have no owner by default, so every row needs a named person.
- Read the reference | dated or undated?
- Check for drift | referenced edition against the current one
- *Check direction | which edition the design and the evidence follow
```

### Keep it current

A register built once and never updated creates false confidence. Review it periodically against the publishers' catalogues and against amendments to the governing instruments, and whenever a new project or contract starts.

## A worked example

This is an illustration. A small engineering firm designs and installs process equipment for food manufacturers. Its engineers work to the latest edition of a relevant equipment standard, published two years ago, which they regard as best practice. The firm's quality system withdrew the previous edition when the new one arrived.

A new client operates under a licence condition, and a supply specification, that both reference the previous edition by year. During acceptance, the client's certifier asks for evidence of compliance with that edition. Several test methods differ between the editions, and the firm's evidence was produced using the new methods.

The firm has to obtain a copy of the previous edition, map its requirements against the design, and repeat two tests using the older method. The work takes three weeks and costs about $12,000 in engineering time and testing, and the client's commissioning date slips.

```figure
type: timeline
title: When the evidence followed the wrong edition
caption: About $12,000 in engineering time and testing, three weeks of work, and a commissioning date that slipped.
- Design | Latest edition, as best practice | the previous edition withdrawn
- The client | Licence and specification name the previous edition | dated references
- Acceptance | The certifier asks for evidence | to the previous edition's methods
- *Recovery | Old edition obtained, two tests repeated | three weeks, about $12,000
```

Afterwards, the firm makes three changes:

- It starts an edition register for its main product lines, recording which edition each client's instruments and specifications reference.
- It stops withdrawing superseded editions automatically. They are archived, not destroyed, until the register shows nothing references them.
- It changes its quotation and contract wording to name the edition it designs to, and asks clients to confirm the edition their instruments require before design starts.

On the next project, the edition question is resolved at quotation, and the design and evidence are prepared against the right edition from the start.

## Raise the edition question at quotation

The cheapest time to settle which edition applies is before any design work starts. A few questions at enquiry or quotation stage prevent most problems:

- Which regulations, codes, licences or specifications govern this work?
- Do any of them reference standards, and do they name editions?
- Does the customer have its own specification that names editions?
- Does the customer's certifier, surveyor or insurer have specific expectations?
- If editions differ between instruments, which takes precedence?

Record the answers in the quotation and the design basis. If the answers change during the project, treat the change as a variation, because it may change the work required.

## Signals worth watching

- A certifier, auditor or customer asks which edition a submission was prepared against.
- Designers ask for archived copies of older editions.
- A publisher continues to sell a superseded edition, which suggests something still references it.
- A document control review reports that all superseded editions have been removed.
- A long-lived asset is about to be sold, refinanced or insured, when a third party may read the governing instruments closely.

## How this applies to a small Australian business

Australian businesses work under many instruments that reference standards: the National Construction Code and state building regulations, electrical, plumbing and gas safety rules, workplace health and safety regulations, product safety requirements, government procurement specifications and customer contracts. The way each references a standard, and which edition it names, can differ and can change when the instrument is amended. Practical steps:

- **Ask early** which edition the governing instrument, specification or contract requires, before design or quotation.
- **Record the edition** in your quotes, design documents and purchase specifications.
- **Avoid open-ended warranties** such as "complies with all applicable standards" where you can. Name the standards and editions instead. Have contract wording reviewed by a lawyer.
- **Archive superseded editions** rather than destroying them while they may still be referenced.
- **Assign one person** to own the relationship between obligations and standards for your main products or services.
- **Check with the authority**: confirm current requirements with the relevant regulator, building surveyor, certifier or an adviser, because instruments are amended over time.

The article on [why a substitution can void your compliance evidence](/reados/collections/specifications-product-quality-and-sustainability/substitutions-and-tested-assemblies/) explains a related way that evidence can stop matching what you build.

## A first-month plan

If you have never tracked editions, a short, focused start is enough:

1. **Week 1:** list the five products, services or assets where a compliance failure would cost the most.
2. **Week 2:** for each, identify the governing instruments and specifications, and read the actual references to standards.
3. **Week 3:** record the referenced edition, the current edition, the edition your design follows and the edition your evidence follows.
4. **Week 4:** for any gaps, estimate the work to close them, update quotation and contract wording, and set a review date.

```figure
type: timeline
title: A first-month plan for edition control
caption: Start with the five products, services or assets where a compliance failure would cost the most.
- Week 1 | List the costliest five
- Week 2 | Read the actual references
- Week 3 | Record four editions | referenced, current, design, evidence
- *Week 4 | Close the gaps | quotations, contracts, a review date
```

Extend the register to other products and customers over the following months. Keep the register somewhere everyone involved in quoting, design and compliance can see it, and add a step to your project start-up checklist to update it for each new job. The aim is not a perfect document but a habit: every time a new obligation appears, someone records which edition it names before work begins.

## Common mistakes

- **Assuming the newest edition is always the one that applies.**
- **Destroying superseded editions** that instruments still reference.
- **Keeping the standards library and the regulations in separate silos** with nobody owning the link.
- **Using open-ended compliance warranties** in contracts.
- **Preparing evidence under one edition** and designing to another.
- **Building a register once** and never reviewing it.
- **Treating a clean compliance record as proof** the issue is managed, when it may simply be that nothing has changed yet.

## Questions to ask

- For our most important products or assets, which edition does each governing instrument reference, and has someone read the citation?
- Are our design bases and our evidence prepared against the same edition?
- Which of our contracts promise compliance with "applicable standards" without naming editions?
- When we last withdrew superseded editions, did anyone check whether they were still referenced?
- Who owns the link between our obligations and the standards they reference?
- When did we last check for amendments to the instruments that govern our work?

## Bringing it together

Laws, codes and contracts often adopt technical standards by reference, and many name a specific edition. Standards keep evolving, so the edition you work to and the edition your obligation requires can drift apart. Good document control can widen the gap by withdrawing the very edition an obligation names. Treat compliance as a relationship between two documents: the governing instrument and the standard it references. Keep an edition register, read the actual citations, archive rather than destroy superseded editions, name editions in quotes and contracts, and give one person ownership of the link. That way, keeping up with good practice never quietly takes you outside your obligations.

---

*Source: KEVOS® notes. Examples in this article are illustrations. This article is general information, not legal or engineering advice. Confirm current requirements with the relevant authority or an adviser.*
