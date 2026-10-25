---
book: cad-data-you-can-trust
chapterSlug: lifecycle-states-and-permissions
order: 5
title: "Lifecycle states and permissions"
description: "Design a small set of lifecycle states and transitions, give groups the least access they need, keep approval separate from authorship and audit the history for changes that bypassed the process."
draft: false
---

A vault's most important feature is not storage but control. Storage the shared drive already provided. What the shared drive could not do was make the same file editable on Monday and locked on Tuesday, or let a designer change a working file while preventing them from approving it. Lifecycle states and permissions are how a vault expresses those rules. Designed well, they are almost invisible; designed badly, they either block work or protect nothing.

This chapter designs a small lifecycle for the running case team, sets up groups and permissions on the principle of least privilege, separates authorship from approval and shows how to audit the vault's history. Its error case is a set of generous early permissions that let a released drawing be changed without a revision, inside the very system meant to prevent it.

## Lifecycle states describe authority

A lifecycle state records where a file stands in its journey from first sketch to retirement. Most vaults let administrators define their own states and the transitions between them. The temptation is to model every step of the office's process, producing a dozen states that nobody can remember. A small team needs few.

The running case team uses five states:

```figure
type: steps
title: The team's five lifecycle states
caption: This is an illustration. Each state changes who may do what; the transitions between them are where approvals happen.
- Work in progress | the designer may edit; others may view the latest version
- In review | locked for editing; the checker and approver work from this version
- *Released | locked; available to everyone; PDFs generated; the only state used for making and buying
- Change pending | a released file being changed; edits create versions towards the next revision
- Obsolete | no longer used for new work; kept for history, service and spares
```

A file starts in work in progress. When the designer believes it is ready, they submit it for review, which locks it. The checker either returns it to work in progress with comments or passes it to the approver. Approval releases it. A later change starts from released and passes through change pending and review again, ending in a new release. A file that should no longer be used for new designs moves to obsolete, from which it can still be viewed and, for service work, retrieved.

## Transitions carry the rules

The states themselves are labels. The real control lies in who may move a file from one state to another, and what must be true when they do. The team's transitions are:

- **Work in progress to in review**: any designer, for files they are working on. The vault requires that mandatory properties from the property schema are complete.
- **In review to work in progress**: the checker, with a comment.
- **In review to released**: an approver, who must not be the person who last edited the file. The vault assigns the next revision letter.
- **Released to change pending**: an approver, and only with a change record number from the process in Chapter 4.
- **Released to obsolete**: an approver, after a where-used check shows no active assembly depends on the file.

```figure
type: compare
title: Who may move a file between states
cols: Who | Condition
caption: This is an illustration of the running case team's rules. The vault enforces the conditions it can test; the others are checked in review.
- Work in progress to in review | the designer | mandatory properties complete
- In review to work in progress | the checker | a comment explaining why
- *In review to released | an approver | not the last editor of the file; next revision assigned automatically
- Released to change pending | an approver | a change record number entered
- Released to obsolete | an approver | where-used shows no active use
```

Two conditions do most of the work. The rule that an approver cannot release a file they last edited enforces separation between authorship and approval. The rule that a released file can only enter change pending with a change record number makes it impossible to change a released design without the change process. Together they turn the procedures of Chapter 4 from intentions into constraints.

## Library files have their own lifecycle

Standard parts and purchased components from the library behave differently from project files. They are created once, used everywhere and changed rarely. Giving them the full project lifecycle would mean that every new fastener passed through review by an engineer, which is a poor use of an engineer's time.

The team gave library files a shorter lifecycle with three states: in preparation, released and obsolete. The CAD administrator and the drafter who maintains the library may release library files, after the duplicate check and data completion described in the library process. Changes to a released library file still need a reason recorded, and the where-used check is mandatory, because a library part used in two hundred assemblies is the most widely shared file in the vault.

The difference is recorded in the vault's configuration and in the written standard. Without it, someone would eventually ask why a washer needs an engineer's approval, or, worse, why a pump mounting plate does not.

## Legacy files and the lifecycle

The thousands of files migrated from the shared drive, as Chapter 6 describes, had no lifecycle history. The team had to decide what state each would start in.

Files that had been released on the shared drive, as shown by a revision letter and a matching PDF in the drafters' folder, entered the vault in the released state, with their existing revision letter and a note in the history that they were migrated rather than released in the vault. Files with no evidence of release entered work in progress. Files in the archive set, those untouched for years and not used by any active assembly, were not imported at all; Chapter 6 explains why they stayed on a read-only share. If an archived file is ever needed for new work, it is imported then, reviewed and released like any other file.

Every migrated file also carried a property recording its original folder and file name on the shared drive. That property cost nothing to set during import and proved its worth repeatedly in the first year, whenever someone remembered a design by where it used to live rather than by its number.

The rule was conservative by design. A file wrongly placed in released would gain an authority it had not earned; a file wrongly placed in work in progress would merely need to be reviewed before use. Where the evidence was unclear, the team chose work in progress, and in the first months after migration several dozen such files passed through a quick review and release when they were next needed.

## Groups, not individuals

Permissions should be granted to groups, and people placed in groups, rather than granted to individuals. When someone joins, changes role or leaves, the change is one membership rather than a list of permissions to remember.

```figure
type: stats
title: The team's vault groups
caption: This is an illustration. Twenty-three people use the vault; two hold administrator accounts that they do not use for daily work.
- 7 | Designers | five designers and two drafters; edit work in progress
- 2 | Approvers | the two engineers; check, approve, release and start changes
- 14 | Viewers | production, purchasing and quality; view released files and PDFs
- *2 | Administrators | separate accounts for the CAD administrator and the backup engineer
```

The administrator accounts are separate from the same people's daily accounts. The CAD administrator works as a designer under a designer account and signs in to the administrator account only to change the vault's configuration. This follows a general security principle, and one of the Australian Signals Directorate's Essential Eight strategies: restrict administrative privileges, and do not use privileged accounts for everyday work. In a vault, the practical reason is simple. An administrator account can do things that bypass the lifecycle, and using it for daily design work invites exactly the bypass the lifecycle exists to prevent.

## Least privilege, adjusted for a small team

The principle of least privilege says that each person should have only the access their role needs. In a large organisation, that leads to detailed permission schemes. In a team of nine CAD users, it needs adjusting so that it does not block ordinary work.

The team's adjustments were deliberate. Designers can edit any work-in-progress file in any project, not only their own, because designers often help each other at short notice and a permission request for every file would slow them down. Designers can see released files in every project, because reuse depends on finding existing designs. Viewers see only released files, never work in progress, because a working file shown to production is a risk: it may be printed and made.

One project was treated differently. A customer required that its project data be visible only to the people working on it. The team created a project folder with its own permissions, restricting it to four named people and the administrators, and recorded the customer's requirement against the folder so that future administrators would know why it was different.

## The error case: everyone an administrator

When the vault went live, the implementation consultant recommended giving every CAD user administrator rights for the first few weeks, so that early problems could be solved without waiting for the administrator. The team agreed. It seemed a sensible way to avoid frustration during the change.

In the third week, a drafter noticed a spelling mistake in a general note on a released drawing. Under the process, this needed a change record and a new revision. The drafter, with administrator rights, found that they could move the drawing directly from released back to work in progress, a transition reserved for administrators to repair mistakes. They corrected the note, moved the drawing back to released and, because the vault's administrator transition did not assign a new letter, it was released again as the same revision.

That was the error case of Chapter 4 again, inside the vault. Two PDFs of revision C now existed, one with the mistake and one without, generated a few days apart.

The problem was found by the administrator's weekly review of the vault's history. The vault records every state change with the user, date and transition. A filter for transitions out of released that did not pass through change pending showed **three** such transitions in the first four weeks, all by administrator rights, all well-meant: the spelling correction, a title block fix and a property correction on a library part.

```figure
type: checklist
title: Weekly review of the vault's history
caption: This is an illustration of the administrator's review. It takes about ten minutes once the filters are saved.
- Transitions out of released without a change record | should be none
- Releases where the approver was the last editor | should be none
- Files checked out for more than two weeks | follow up with the holder
- Administrator account sign-ins | each should match a recorded configuration change
- ? Unusual volumes | many check-ins, deletions or state changes in a short time
```

The correction had three parts. Each of the three files was reviewed; the spelling correction and the title block fix were re-released properly as new revisions, and the property correction was confirmed harmless and recorded. Administrator rights were removed from all daily accounts, and two separate administrator accounts were created as described above. And the administrator-only transition from released to work in progress was restricted further, so that it required a written reason and generated an email to both approvers whenever it was used.

The consultant's advice had a reasonable motive, but it confused convenience with safety. Early problems in a vault are better solved quickly by a named administrator than instantly by everyone.

## Audit trails are part of the record

A vault's history is not just a debugging aid. It is the evidence that the design process was followed: who created a file, who checked it, who approved it and when. For a business working to a quality management system, or supplying customers who audit their suppliers, that evidence is often what an auditor asks for. READOS's chapter on [controlled document management systems](/reados/collections/operational-data-records-and-controls/controlled-document-management-systems/) describes the wider requirements for controlled documents and records.

Protect the history accordingly. It should be included in backups, as Chapter 7 requires, and it should not be editable by daily users. When people leave, their accounts should be disabled rather than deleted, so that the history still shows their name against their work.

## Joiners, movers and leavers

Permissions decay unless they are maintained. The team ties vault access to its ordinary staff processes:

- A **joiner** is added to a group on their first day, after the administrator confirms their role with the engineering manager.
- A **mover**, such as a drafter promoted to designer or a designer becoming an approver, has their group membership changed on the day of the change, and old memberships are removed.
- A **leaver** has their account disabled on their last day. Any files they have checked out are reviewed and either checked in or released from check-out by the administrator, with a note.
- **Contractors** are given accounts with an expiry date set at creation, so that access ends even if nobody remembers.

Twice a year, the administrator lists every account and its groups and sends the list to the engineering manager to confirm. In a team of 23 vault users, the review takes a few minutes and reliably finds something, usually a contractor whose access was extended informally or a viewer who has changed role.

## Exercise: set up a contract drafter

A contract drafter will work for eight weeks on Project G only, detailing drawings from models prepared by the team's designers. They must not see the restricted customer project. What group membership and permissions would you give them, and what would you set up to make sure access ends?

**Answer.** Create a separate account with an **expiry date eight weeks from the start**, plus a short margin agreed with the engineering manager. Do not add the drafter to the general Designers group, which can edit work in progress in every project. Instead, create or use a group with **edit rights on work-in-progress files in Project G only**, and **view rights on released files** across ordinary projects so that they can reuse existing details. Give **no access** to the restricted customer project, and **no approver or administrator rights**.

Because the drafter will release nothing, their drawings pass through review and release by the team's approvers in the normal way, and the vault's history shows the drafter as author. On the last day, disable the account rather than deleting it, review any checked-out files, and include the account in the next six-monthly review to confirm it is closed.
