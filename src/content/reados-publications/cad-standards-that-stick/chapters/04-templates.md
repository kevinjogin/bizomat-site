---
book: cad-standards-that-stick
chapterSlug: templates-that-start-every-file-right
order: 4
title: "Templates that start every file right"
description: "Design part, assembly and drawing templates that carry the right document settings and empty property fields, test them before release and identify their revision inside every file."
draft: false
---

A template is a standard that runs itself. A written rule about units or drafting standards relies on people remembering it; a template applies the rule at the moment a file is created, before anyone has had a chance to forget. That makes templates the most efficient tool a CAD administrator has, and also one of the most dangerous, because a mistake in a template is copied faithfully into every file made from it.

This chapter sets out what part, assembly and drawing templates should carry, how many the running case office needs, how to test them before release and how to tell, months later, which template a file came from. It costs the template work against the time it saves. Its error case is a template that was saved with someone's real part data still in it.

## What a template carries

Chapter 3 separated seat settings from document settings. A template is the container for document settings, and for more besides. When a new file is created from it, the file inherits everything in the template: its options, its property fields, its reference geometry and, for drawings, its sheet and title block.

```figure
type: layers
title: What a template passes to every new file
caption: This is an illustration. The deeper layers are the ones most often forgotten when a template is built by saving an old file.
- Document options | units, drafting standard, dimension and note styles, display precision, line styles
- Property fields | names and empty or default values, with lists of allowed values where the software supports them
- Reference geometry | origin, principal planes and any standard axes or coordinate systems
- Sheet and title block | for drawings: sheet size, border, title block, linked notes, table anchors
- *Template identity | a property recording the template's name and revision
- Hidden content | anything left over from whatever file the template was made from
```

The last layer is a warning rather than a design choice. If a template is made by opening an existing part, deleting the features and saving it as a template, it may keep things that are not visible: old property values, hidden sketches, configurations, custom materials, file references or display states. The cleanest templates are built from the vendor's default template, with each change made deliberately and recorded.

## Decide how many templates you need

The running case office's baseline found three template families and eleven drawing templates in use. Some differed only in sheet size, others in title block layout, and two were near-copies with slightly different property names. Too many templates create the same problem as too few: people choose inconsistently, and the administrator cannot maintain them all.

A useful principle is to create a separate template only when the starting conditions genuinely differ. A sheet metal part needs different defaults from a machined part, because its document options include bend allowance settings and its property fields include material thickness. A large module assembly may need different display defaults from a small subassembly. Drawings need one template per sheet size, because the border and title block differ. Beyond that, variation should be handled inside the file, not by multiplying templates.

The office settled on nine templates:

- three part templates: general or machined part, sheet metal part and weldment;
- two assembly templates: general assembly, and large module assembly with lighter display defaults;
- four drawing templates: A4, A3, A2 and A1, all using the same title block design scaled to the sheet.

Nine templates replaced the three families and eleven drawing templates. Every one of the nine was listed in the register with a revision, owner and location, and all nine sat in one shared, read-only folder that the controlled settings from Chapter 3 pointed every seat towards.

## Templates and sheet formats

Many CAD systems separate a drawing's template, which holds its document options, from its sheet format, which holds the border and title block graphics. The separation is useful. A title block can be updated in one place and applied to drawings without changing their document options, and one template can carry different sheet formats for different sheet sizes.

The separation also causes confusion. If the template and the sheet format are revised separately, a drawing can combine a new template with an old title block, or the reverse. The office handled this by giving each sheet format its own revision in the register, recording in each drawing template which sheet format revision it used, and releasing templates and formats together as a set. A designer starting a drawing then gets a consistent combination without needing to know that two files are involved.

## Build property fields as empty slots

The property fields in a template are slots that will later be filled with each part's data: number, description, material, finish, drawn by, and so on. Chapter 5 deals with the property schema in detail. For the template, three rules matter.

First, the fields should be present but empty, or hold a deliberately neutral default. A field that is missing from the template is likely to be added later under a slightly different name. A field that holds a real-looking value is likely to be left unchanged and copied into the bill of materials.

Second, where the software allows a list of allowed values, the template should carry it. A material field that offers a list of the office's standard materials produces consistent entries; a free-text field produces several spellings of the same steel.

Third, title block notes on drawing templates should be linked to properties rather than typed. A linked note displays the property's current value, so changing the description in the model changes it on the drawing. A typed note is a copy, and copies diverge.

## Record the template's identity inside every file

Chapter 2's sample asked whether each drawing had been started from a current template. Answering that question was slow, because the administrator had to compare title block details by eye. The new templates made it easy by carrying their own identity.

Each template includes a property named for its purpose, for example a template identity field holding a value such as "DWG-A3 rev 3". Every file created from the template inherits that value. Because it is a property, it can be read in bulk by a search or a simple script, and a file started from an old template shows it immediately. The value should be protected from casual editing where possible, and the written standard should say that it is never changed by hand.

This small addition changes later administration. When a template is revised, the administrator can count how many active files were made from each revision. When a drawing behaves oddly, its template revision is the first thing to check. And when sampling for compliance, as Chapter 9 describes, the template question can be answered automatically.

## Test a template before releasing it

A template is a piece of production equipment and needs a release test. The office's test takes about an hour for the full set of nine and is run whenever any template or sheet format changes.

```figure
type: checklist
title: Release test for a template set
caption: This is an illustration of the running case office's test. Every item is checked on a seat other than the one used to build the template.
- New file from each template | creates without warnings or missing references
- Document options | units, drafting standard, precision and line styles match the register
- Property fields | all present, all empty or neutral, allowed-value lists working
- Title block | every linked note shows the test part's properties correctly
- Print test | test drawing prints to PDF identically from two seats
- Template identity | correct name and revision in the identity property
- Hidden content | no stray configurations, references, materials or sketches
- ? Rollback | previous revision archived and recoverable
```

Run the test from a seat other than the one used to build the template. A template that works only on its author's seat is depending on something in that seat's configuration, which is exactly the problem templates are supposed to remove.

## Count the time saved

Chapter 1 estimated that each new drawing needed about five minutes of manual title block entry, because properties were not linked. The office timed it on ten drawings before the new templates and ten after. This is an illustration. The average fell from about six minutes to about one, a saving of five minutes a drawing.

```figure
type: formula
title: Payback on the template work
formula: Annual saving = drawings a year × minutes saved ÷ 60 × hourly cost
formula: Payback in months = setup cost ÷ annual saving × 12
caption: This is an illustration using the running case office's internal cost rate of A$95 an hour.
- Drawings a year | 480
- Minutes saved per drawing | 5
- Setup effort | 24 hours to build, test and release nine templates
step: Annual saving = 480 × 5 ÷ 60 × 95 = 40 hours, or A$3,800
step: Setup cost = 24 × 95 = A$2,280
step: Payback = 2,280 ÷ 3,800 × 12 ≈ 7.2 months
```

A payback of about seven months on title block time alone is a reasonable result, and it understates the benefit. The larger gain is in avoided errors: four of the nine failures in Chapter 2's sample came from superseded templates, and Chapter 1 costed each reissued drawing at about A$752.50. Preventing even three reissues a year would be worth more than the title block saving. The office reported the title block saving because it was measured, and mentioned the error benefit as likely but unproven until the next sample.

## The error case: a template with real data in it

Five weeks after the first release, the purchasing officer queried a bill of materials. Thirty-seven different parts across four projects all carried the same part number and the description "DRIVE END BRACKET". Purchasing had been about to order 37 lots of the same bracket.

The cause was found within an hour. During development, the administrator had tested the general part template by modelling a real bracket from it, filling in its properties and checking the title block. After the test, the features were deleted and the file was saved back as the template. The property values were not cleared. Every part created from that template for five weeks inherited the bracket's number and description, and most designers had not noticed because they changed the fields they cared about and left the others.

The release test had included a line about property fields, but it had been run before the final save. The error therefore had two parts: the template contained real data, and the test was not repeated on the version actually released.

The correction was done in this order:

1. The template was withdrawn from the shared folder and the previous revision restored, so that no further files were affected.
2. The administrator searched all files created in the five weeks for the bracket's part number, found the 37, and listed them with their authors.
3. Each author corrected their own files, which took about four minutes each, **37 × 4 = 148 minutes** in total, or about 2.5 hours.
4. The template was rebuilt from the vendor default rather than from the test file, retested on another seat after the final save, and re-released with a new revision.
5. The release test was amended so that its last step is always run on the file as saved in the shared folder.

```figure
type: steps
title: Recovering from a faulty template
caption: This is an illustration. Withdraw first, then find, then fix, then prevent recurrence.
- Withdraw | remove the faulty template and restore the previous revision
- Find | search by the template identity and the stray values for every affected file
- Fix | owners correct their own files, with the list as a checklist
- Rebuild | from the vendor default, not from a used file
- *Retest the released file | run the test on the template exactly as it sits in the shared folder
```

The template identity property made step 2 straightforward, because every file made from the faulty revision carried that revision's identity value. Without it, the search would have depended on the bracket's number alone, and files where a designer had overwritten the number but kept the description would have been missed.

## Control who can change a template

A template that anyone can edit is not a standard. The shared template folder in the running case office is read-only for everyone except the administrator and the named backup person from the charter. Designers can use the templates freely but cannot save over them. That single permission prevented the most common way templates decay, which is a well-meaning person fixing something for themselves and saving the fix back to the shared copy without testing it.

Read-only access also changes behaviour in a helpful way. When a designer wants a template improved, they cannot quietly change it, so they raise a request. The request list then becomes a record of what the office actually needs from its templates, which is better evidence for the next release than the administrator's own guesses.

The folder should hold only current templates. Superseded revisions belong in an archive folder alongside it, also read-only, so that they remain available for investigation or rollback but are not offered when someone starts a new file. The controlled settings from Chapter 3 point every seat at the current folder only. If a person can browse to the archive and start a file from an old template, sooner or later someone will, so the archive should not be in any location the software searches by default.

Finally, keep a copy of the whole template set, with its sheet formats and the register entry, outside the shared drive. If the shared folder is damaged or overwritten, the office should be able to restore a known, tested set within minutes rather than rebuilding it from memory.

## Maintain templates without disturbing old files

A template change affects new files only. Files already created keep the document options and properties they inherited. That is usually what the office wants: released drawings should not change appearance silently. It does mean that the office will always have files from several template revisions, and the register should record what changed between revisions so that a designer revising an old drawing knows what to update.

Keep template revisions infrequent and grouped. A release every few months, with all accumulated changes tested together, is easier to manage than a stream of small edits. Between releases, collect change requests on the request list described in Chapter 1.

## Exercise: decide whether a tenth template is justified

A designer asks for a tenth template: an A3 drawing template for sheet metal parts, with a flat-pattern view already placed and a bend table anchored in position. It would save, they estimate, three minutes on each sheet metal drawing. The office makes about 150 sheet metal drawings a year. Building and testing the template would take about six hours, and each extra template adds about 30 minutes to every future release test cycle, of which the office runs about three a year. Is it worth it?

**Answer.** The annual saving is **150 × 3 ÷ 60 = 7.5 hours**, worth **7.5 × 95 = A$712.50**. The setup costs **6 × 95 = A$570**, and the ongoing testing costs **3 × 0.5 = 1.5 hours**, or **A$142.50**, a year. The net annual saving after the first year is **712.50 − 142.50 = A$570**, so the setup pays back in about a year.

The numbers favour the template, modestly. Two further questions decide it. Does the flat-pattern view place correctly for most sheet metal parts, or will designers delete and recreate it? And could the same benefit come from a predefined view in the existing A3 template, avoiding a tenth template entirely? If the predefined view can be added to the A3 template without disrupting other drawings, that is the better choice, because it gains the saving without adding another file to maintain.
