---
book: cad-data-you-can-trust
chapterSlug: revisions-versions-and-release
order: 4
title: "Revisions, versions and release"
description: "Separate working versions from released revisions, keep models and drawings at the same revision, control engineering changes and make sure every print in use is the current one."
draft: false
---

Two different questions are often asked with the same word. "Which version is this?" can mean "which saved state of the file am I looking at?" or "which approved issue of the design is this?". The first is a question about history; the second is a question about authority. Confusing them is how a workshop ends up making a part from a file that nobody approved, or how two prints with the same revision letter come to show different dimensions.

This chapter separates versions from revisions, sets out the running case team's revision conventions, describes a simple engineering change process and deals with the copies of released drawings that live outside the vault. Its error case is a released model that was quietly changed after release.

## Versions and revisions are different things

A **version** is a saved state of a file. In a vault, each check-in creates a new version, numbered automatically: version 1, 2, 3 and so on. Versions record history. Most are working states that nobody outside the design office will ever see.

A **revision** is an approved, released issue of a design. Revisions are deliberate: someone decides that the design is ready, it is checked and approved, and it is released under a revision identifier, such as a letter. Revisions record authority. Purchasing, the workshop, suppliers and customers work from revisions.

```figure
type: compare
title: Versions and revisions
cols: Version | Revision
caption: This is an illustration of the distinction the running case team uses. Every revision is a version, but most versions are never revisions.
- Created by | every check-in | a deliberate release after checking and approval
- Identified by | an automatic number | a letter on the title block and in properties
- Seen by | the design office | everyone who makes, buys, inspects or uses the part
- *Can change after creation | no, but a newer version can follow | no; a change needs a new revision
- Purpose | history and recovery | authority to make and use
```

The baseframe for one skid, part 220318, illustrates the relationship. Its file has been checked in **47** times. Three of those versions were released, as revisions A, B and C. The other 44 versions are working history.

```figure
type: timeline
title: Versions and revisions of baseframe 220318
caption: This is an illustration. Only the three released versions carry authority; the vault keeps the rest as history.
- Version 1 | Created | first check-in, work in progress
- Version 12 | *Revision A released | first issue for fabrication
- Version 30 | Revision B released | lifting lugs moved after a site report
- Version 47 | Revision C released | motor slide rails changed for a larger frame size
- Version 48 onwards | Change pending | work towards revision D, not yet released
```

Keeping the two concepts separate has a practical benefit. Designers can check in as often as they like, knowing that a check-in does not release anything. And everyone outside the design office can ignore versions entirely, working only from released revisions.

## Revision conventions

The team adopted these conventions, which follow common practice but are its own choices. Where a contract calls up a revision standard, such as ASME Y14.35 for some customers, that standard governs instead.

- Before first release, a drawing has no revision letter and carries a "PRELIMINARY, NOT FOR MANUFACTURE" note.
- The first release is revision A. Later releases follow the alphabet.
- Letters easily confused with numerals, such as I, O and Q, are skipped.
- Each revision is recorded in the drawing's revision table with the letter, a short description of what changed, the change record number, the date and the approver.
- The model and its drawing always carry the same revision. Because the drawing number equals the part number, a change to either releases both together.

The last convention needs explanation, because some offices revise models and drawings separately. The team chose to couple them because its drawings are generated from its models: a change to the model changes the drawing's views, and a drawing revision without a model revision, or the reverse, would describe a combination that never existed. Coupling them makes the revision letter on the drawing a reliable statement about the model too.

## Release locks the file

In a vault, release is a change of state, from a working state to a released state, as Chapter 5 describes. The released state changes permissions: nobody can check out a released file for editing. To change a released design, someone must start a change, which moves the file into a state where editing is allowed and where the result will become a new revision.

On the shared drive, there was no such lock. A released file could be opened, edited and saved like any other, and the only signal that it had been released was the revision letter in its properties, which an edit did not change. The error case shows where that leads.

## The error case: two prints both labelled revision C

Shortly before the vault went live, the quality inspector was checking a batch of baseframes against the drawing. The motor slide rail holes were 5 mm from where the inspector's print placed them. The inspector reprinted the drawing from the drafters' PDF folder and found that the new print agreed with the parts. Both prints said revision C. Both had the same date in the revision table.

Investigation showed what had happened. After revision C was released and exported to PDF, a designer had noticed that the slide rail holes conflicted with a motor frame size the team had begun to buy. They opened the baseframe on the shared drive, moved the holes and saved it, intending to raise a change. The fabricator had been sent the revision C PDF before the edit. Later, a drafter re-exported the PDF for an unrelated reason, producing a new PDF from the edited model, still labelled revision C. The fabricator's next batch was made from a re-sent copy of that PDF.

The inspector's first print was the original revision C; the second was an unreleased change wearing revision C's label. Neither the model nor the PDF folder recorded the difference.

The error was detected because the inspector compared parts against two prints and noticed the disagreement. The correction was formal. The engineer reviewed the change, confirmed it was needed for the new motor frame size and released it properly as revision D, with a revision table entry describing the moved holes. The PDF folder's revision C was replaced by the true revision C from the backup, marked superseded, and revision D was issued. The parts already made were checked against revision D and accepted.

In the vault, the same sequence cannot happen. The designer could not have checked out the released baseframe without starting a change, and the PDF could not have been regenerated from an unreleased version under the released revision's label, because the team's vault generates PDFs only at release, as described below.

## Run changes through a short process

An engineering change process does not need to be elaborate for a team of nine. It needs to make sure that every change to a released design is reviewed, approved and recorded, and that the people who use the design find out. The team's process has five steps.

```figure
type: steps
title: Engineering change for a released design
caption: This is an illustration of the running case team's process. The where-used review in step 2 comes from Chapter 3.
- Request | anyone may raise a change request describing the problem and, if known, the proposed fix
- Review | the engineer checks where-used, decides revision or new number, and identifies affected drawings
- *Approve | the engineering manager approves the change and its effectivity
- Implement | the designer makes the change in the vault; the file moves to a change state; versions accumulate
- Release | after checking and approval, the new revision is released, PDFs are generated and users are notified
```

The review step applies the interchangeability rule from Chapter 2. A change that keeps the part interchangeable with its previous revision in every use becomes a new revision. A change that does not becomes a new part number. The rule removes most of the argument about what counts as a revision.

**Effectivity** records from when a change applies: from the next batch, from a particular serial number or immediately, including parts in stock. The team keeps effectivity simple, usually "from the next order placed after release", but states it on every change, because purchasing and production need to know whether existing stock and work in progress are still usable.

## Tell the people who use the design

A release that nobody hears about is only half a release. Purchasing may be about to reorder the old revision; production may have kits already picked; a supplier may be part-way through a batch. The team's change record therefore includes a short distribution list, prepared at the review step, naming who must be told and what they must do.

The notice itself is brief: the part number, the old and new revision, a one-line description of the change, the effectivity and any action required, such as "quarantine stock of revision C until inspected" or "no action, revision C stock usable". It goes by email from the vault's workflow at release, so that no one has to remember to send it, and the recipients are recorded with the change.

Two recipients are easy to forget. The first is anyone holding a printed copy at a workstation, who needs the old print replaced. The second is the supplier who last received the drawing, which Chapter 10 deals with through a register of what was sent to whom. A change notice that reaches every internal user but not the supplier still allows the old revision to be made.

## Measure the change process

A change process that takes weeks will be bypassed, and the bypass is usually an edit to a released file, which is exactly what the process exists to prevent. The team measures two things: how long changes take from request to release, and how many changes were found after release that should have gone through the process but did not.

In the first six months after the vault went live, the team processed **38** changes. The median time from request to release was **6 working days**; most of that was waiting for checking and approval rather than doing the work. Four of the 38 became new part numbers under the interchangeability rule rather than new revisions. No released file was changed outside the process, which the vault made impossible, and no unreleased change was found in a PDF, because the vault generated every release PDF itself.

The six-day median prompted one adjustment. Small, low-risk changes, such as drawing note corrections, were given a shortened path in which the engineer could both review and approve, with the engineering manager informed rather than asked. That kept the full process for changes that needed it and stopped minor corrections queuing behind major ones.

## Control the copies outside the vault

Most of the people who use drawings never open the vault. They use PDFs and prints. A vault that controls its CAD files perfectly but leaves PDFs uncontrolled has moved the problem rather than solved it.

The team made three rules for copies:

- **PDFs are generated at release, automatically.** The vault's release step creates the PDF from the released version and stores it with the revision letter in its file name, such as 220318_C. No one exports release PDFs by hand.
- **One folder holds current PDFs only.** When revision D is released, revision C's PDF moves to a superseded folder that production cannot see. The current folder never holds two revisions of the same part.
- **Prints are marked and limited.** Workshop prints carry a printed note stating that they are uncontrolled if more than a week old and must be checked against the current folder. Prints on workbenches are replaced when a revision is released, and the change notice lists which stations hold prints.

None of these rules depends on the vault alone, and the first two could have been applied on the shared drive with discipline. The vault makes them automatic, which is the difference between a rule people try to follow and a rule they cannot break.

## Old revisions remain available

Released revisions are never deleted. A customer may hold a skid built to revision B for twenty years and need a spare baseframe component that matches it. The vault keeps every released version, and the team can retrieve revision B, its drawing and its PDF at any time. The superseded PDF folder keeps the old PDFs for the same reason.

This is one of the strongest arguments for a vault in a business that supports equipment in service. On the shared drive, an old revision existed only if someone had happened to save a copy, or in a backup old enough to contain it, and the backup retention period often did not reach back far enough.

Keep the link between a delivered product and the revisions it was built to. The team records, against each skid's serial number, the revision of its top assembly at dispatch. Because the top assembly's released version references the exact released versions of its components, that single record is enough to rebuild the complete as-built bill of materials years later, which is what a customer asking for a matching spare actually needs.

## Exercise: revision, new number or neither?

For each proposed change to the released pump mounting plate 210417, revision C, used in 13 assemblies, decide whether it needs a new revision, a new part number or neither, and why.

1. Correct a spelling mistake in a general note on the drawing.
2. Enlarge four clearance holes from Ø14 to Ø15 mm so a slightly larger bolt fits; the old bolts still fit in every assembly.
3. Change the material from 304 to 316 stainless steel for better corrosion resistance; the plate's dimensions and function are unchanged.
4. Add a slot that a new pump needs, which would foul a gusset in two of the existing baseframes.

**Answer.** (1) A **new revision**, D, because the released drawing changes, even though the part does not. Some offices allow minor drawing corrections without a new revision; the team does not, because any change to a released document must be traceable. (2) A **new revision**: the plate remains interchangeable in every use. (3) Usually a **new revision**, if the engineer confirms that 316 can replace 304 in every use; the where-used review must check, because the change affects cost and possibly supply, and purchasing must know the effectivity. (4) A **new part number**: the changed plate cannot replace the old one in two assemblies without further changes, so it fails the interchangeability rule. Those assemblies keep 210417; the new pump's baseframe uses the new number.
