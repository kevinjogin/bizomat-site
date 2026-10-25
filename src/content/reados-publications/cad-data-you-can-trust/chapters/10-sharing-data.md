---
book: cad-data-you-can-trust
chapterSlug: sharing-data-outside-the-vault
order: 10
title: "Sharing data outside the vault"
description: "Send drawings and models to suppliers and customers in suitable formats with a transmittal record, state revisions on every order, check incoming models and run an annual data health check."
draft: false
---

A vault controls data while it is inside. The moment a drawing is emailed to a fabricator or a model is sent to a customer, it leaves that control. The copy outside will not update when the design changes, will not know that it has been superseded and will be used by people who have never heard of the team's revision process. Most of the expensive data errors in a manufacturing business happen at this boundary, because it is where an old copy meets a new order.

This final chapter deals with the boundary. It chooses formats for outgoing data, introduces a transmittal record of what was sent to whom, ties purchase orders to revisions, sets rules for checking models that come in, and closes the book with an annual health check of the whole data system. Its error case is a correct quotation that turned into an incorrect order.

## Choose the format for the purpose

Different recipients need different things, and the format should match the purpose.

```figure
type: compare
title: Formats for data leaving the vault
cols: Best for | What is lost or at risk
caption: This is an illustration of the running case team's practice. The PDF drawing remains the authority unless a contract says otherwise.
- PDF drawing | quoting, making and inspecting | nothing for its purpose; it is the released document
- *Neutral 3D model, such as STEP | fabricators' CAM, customers' layouts | features, parameters, design history; sometimes annotations and properties
- Native CAD files | partners working in the same CAD system | everything is shared, including design history and internal properties
- Lightweight viewable files | review by people without CAD | precision, depending on the format
```

The team's default for suppliers is a PDF drawing plus a neutral 3D model in STEP format, the widely supported exchange format based on the ISO 10303 series of standards. The PDF is the authority; the model is supplied for convenience, so the fabricator can program cutting and folding without remodelling. Every package says so in its transmittal: "The PDF drawings govern. The 3D model is supplied for information."

Native files are sent only by agreement, because they carry everything: design history, internal properties, sometimes references to other files and information about how the team designs. For customers, the team sends neutral models of the skid's external envelope and interfaces, simplified to show what the customer needs for layout and connection, not the internal design.

## Name exported files with their revision

A file outside the vault has no lifecycle state. Its name must do some of that work. The team's exported files are named with the part number and revision letter, such as 230114_B.pdf and 230114_B.step, and each PDF carries a watermark stating its purpose: FOR QUOTATION, FOR MANUFACTURE or FOR INFORMATION. The vault generates these exports at release or on request, so the name and watermark always match the released revision.

The watermark matters more than it seems. A drawing sent for quotation is often sent before the design is final, and the fabricator's workshop may later find it in an email and make parts from it. A drawing marked FOR QUOTATION announces that it is not authority to manufacture.

## Keep a transmittal register

A transmittal is a record that accompanies a package: what was sent, at which revision, to whom, when and for what purpose. A transmittal register is the collection of those records. It answers the question every change eventually raises: who outside the business holds an old revision of this drawing?

```figure
type: steps
title: Sending a package to a supplier
caption: This is an illustration of the running case team's procedure. The vault generates the export and records the transmittal; the person sending checks the list.
- Select | the released items and revisions the recipient needs, and nothing else
- Export | PDFs and neutral models named with number and revision, watermarked for the purpose
- *Record | transmittal number, recipient, date, purpose, each item and revision
- Send | package with a cover note stating the purpose and that the PDFs govern
- Confirm | recipient acknowledges receipt; acknowledgement attached to the transmittal
```

The vault can hold the register itself, linking each transmittal to the released versions it contained. When a part is revised, the change process in Chapter 4 can then ask the vault which recipients hold earlier revisions and include them in the change notice automatically.

## The error case: the quote was right, the order was not

The team sent a request for quotation for a coupling guard, part 230114 at revision A, to three fabricators. The package contained the guard's drawings and a STEP model, all marked FOR QUOTATION, under transmittal T-0142. Two weeks later, while quotes were being prepared, the team released revision B, which added an opening in the mesh panel for a grease nipple on the new motor. Revision B was issued to the internal users on the change notice, but none of the fabricators had yet been chosen, so none was on the notice.

The lowest quote was accepted. Purchasing raised an order quoting the part number, 230114, the quantity, six, and the quoted price. The order did not state a revision. The fabricator made six guards from the files it held, which were revision A, sensibly ignoring the FOR QUOTATION watermark because it now had an order for the part number on the drawing.

At incoming inspection, the inspector checked the guards against the current drawing, revision B, and found no grease nipple opening. The guards were returned for rework at the team's cost, about **A$540**, and delivery of the skid slipped by three days.

The investigation was short, because the transmittal register showed exactly what the fabricator had received: revision A, for quotation, and nothing since. The fabricator had done what the documents in its hands said. The gap was in the team's process: an order that named a part without a revision, and no step that sent current manufacturing data when an order was placed.

The team corrected the process in three ways:

1. **Every purchase order states the revision.** Orders for made parts quote the part number and revision, for example 230114 revision B, taken from the vault at the moment the order is raised.
2. **Placing an order triggers a manufacturing transmittal.** The current released revision is sent, marked FOR MANUFACTURE, with the order, and the transmittal is recorded. The supplier is asked to confirm that it will work only from that package.
3. **Quotes are checked against the current revision before an order.** If the revision has changed since the request for quotation, purchasing asks the supplier to confirm the price for the current revision.

```figure
type: checklist
title: Before placing an order for a made part
caption: This is an illustration of the check the team added to purchasing. It takes a minute in the vault and prevents an old revision being made.
- Current released revision confirmed | from the vault, not from the quote
- Revision stated on the order | part number and revision letter together
- Quote matches current revision | otherwise the supplier reprices against it
- Manufacturing transmittal sent | FOR MANUFACTURE package recorded against the order
- x Order quoting the part number alone | never acceptable for made parts
```

## Notify everyone who holds an old revision

When a part is revised, the change notice from Chapter 4 goes to internal users. The transmittal register extends it outward. For each changed part, the vault lists every transmittal that included an earlier revision, and the engineer decides who must be told: suppliers with open orders certainly, suppliers who quoted recently probably, and customers who hold the part's model for layout purposes if the change affects them.

The team's notice to suppliers is short: the part number, the superseded and new revisions, the change in one line and a clear instruction, such as "Do not manufacture revision A. Revision B attached." It is sent as a transmittal in its own right, so the register shows that the supplier was told.

## Check models that come in

Data flows in as well as out. Suppliers send models of pumps, motors, valves and instruments; customers send models of the platforms and pipework the skid must connect to. Incoming models are useful and unreliable in equal measure. The team checks each before use:

- **Units and scale.** A model in inches or at the wrong scale is surprisingly common and immediately obvious if checked, and very expensive if not.
- **Identity.** Does the model match the exact variant being bought, including options such as flange rating, motor frame size and terminal box position? Check against the datasheet, not the model's file name.
- **Key dimensions.** Compare the mounting holes, shaft height, flange positions and overall envelope with the datasheet.
- **Detail.** Supplier models often include internal detail that slows assemblies and adds nothing to the team's design. Simplify to the envelope and interfaces, as the library process requires.
- **Properties and source.** Add the team's properties and record where the model came from, the date received and the supplier's model revision, so that the next person knows its provenance.

The result is stored as a purchased item in the library, released through the library lifecycle. The original supplier file is kept as an attachment for reference, but assemblies use the checked, simplified version.

## Protect what you send

Engineering data is commercially valuable, and sending it outside creates obligations on both sides. Before sending, the team asks three questions. Does the recipient need everything in the package, or only the parts they will make? Does a confidentiality agreement cover this recipient and this data? Do any files contain information the recipient should not see, such as internal properties showing costs or customer names?

Neutral formats help with the third question, because they usually carry little beyond geometry, but not always: some exports include property data. The team checks a sample of each export type once to see what it carries, and adjusts the export settings so that only intended properties travel. For the restricted customer project described in Chapter 5, every outgoing transmittal is approved by the project's lead engineer.

## Look after data you hold for others

The boundary works in both directions. The team holds customers' drawings of plant rooms, platforms and pipework, and suppliers' models and datasheets, some supplied under confidentiality terms. That data is not the team's to share, and its contract terms may say how long it can be kept and what must happen to it when a project ends.

The team stores incoming customer data in the vault, in the project's own area, with a property recording the source, the date received and any conditions attached. Customer data is never copied into the library, even when a customer's standard part would be convenient to reuse on another project, because doing so would carry one customer's information into another's work. Where a contract requires data to be returned or destroyed at the end of a project, the engineer records the requirement at the start, and the project close-out checklist includes it, so that it is not left to memory years later.

Supplier models are treated a little differently. Once checked, simplified and released as purchased items, they are used across projects, which is their purpose. The original files, with any supplier terms, stay attached to the library item as received, so that the team can show where the geometry came from if a supplier ever asks.

## Run an annual health check

Data systems decay quietly. Once a year, the CAD administrator and the engineering manager spend an hour reviewing the measures that this book has introduced, using the vault's reports and the records kept through the year.

```figure
type: checklist
title: Annual data health check
caption: This is an illustration. Each line refers to the chapter that set the measure; a worsening trend is a prompt to look closer, not a verdict.
- Duplicate names and broken references in the vault | Chapters 1 and 3; should remain at zero
- Part numbers issued and remaining capacity | Chapter 2
- Changes processed, median time, and any released file changed outside the process | Chapters 4 and 5
- Accounts and group memberships confirmed; administrator account use matched to changes | Chapter 5
- Archive files imported during the year | Chapter 6
- Test restores completed, times against objectives, faults found | Chapter 7
- Licence demand, unmet hours and unused add-ins | Chapter 8
- Current release and service pack; date of next planned upgrade | Chapter 9
- Orders without a revision; transmittals without acknowledgement | Chapter 10
```

The check is not an audit for its own sake. In the team's first year it found two things worth acting on: the offsite restore time creeping towards the recovery objective as the vault grew, and a handful of purchase orders raised in a hurry without revisions. Both were small. Both would have grown unnoticed for another year without the review.

## Bringing it together

The running case team began with 41,600 files on a shared drive, 6,350 duplicate names, 212 broken assemblies and a background of expensive surprises. The chapters of this book did not remove the need for care. They moved care from individuals' memories into a system that records which file is which, who may change it, what has been released, what was sent to whom and how to get it all back. That is what makes engineering data trustworthy: not that nobody makes mistakes, but that the system shows them quickly and recovers from them cheaply.

The order of the chapters is also a reasonable order of work for any small team starting the same journey. Measure first, so that later improvements can be shown rather than claimed. Settle numbering and naming before configuring anything, because they are the hardest decisions to reverse. Understand references before moving a single file. Define revisions, states and permissions before migrating, so that files arrive into a system that already knows the rules. Prove backups by restoring them. Then keep the system healthy through licences, upgrades and a disciplined boundary with the outside world. None of these steps needs a large team or a large budget. Each needs a decision, a record of the decision and a check that it still holds a year later.

## Exercise: who must be told?

Coupling guard 230114 is about to be released at revision C. The transmittal register shows these entries for the guard:

- T-0142: revision A, for quotation, to fabricators X, Y and Z.
- T-0157: revision B, for manufacture, to fabricator Y, with an order for six guards, delivered and closed.
- T-0171: revision B, for manufacture, to fabricator Y, with an open order for ten guards, not yet delivered.
- T-0163: revision B, for information, to the customer, as part of the skid's layout model.

Who must be notified of revision C, and with what instruction?

**Answer.** **Fabricator Y** must be notified urgently because of the open order under T-0171: send revision C for manufacture with an instruction not to make revision B, and agree any price or delivery change before work continues. The closed order under T-0157 needs no action for manufacture, but the six delivered guards should be assessed by the engineer for whether they need rework or can be used.

**The customer** must be notified if the change affects the skid's envelope or interfaces in their layout; if it does not, a note is still good practice so that their model is not later found to disagree. **Fabricators X and Z** hold only revision A for quotation and have no orders. A courtesy notice that revision A is superseded is sensible but not urgent; if either is asked to quote again, they receive revision C.
