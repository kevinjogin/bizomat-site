---
book: cad-standards-that-stick
chapterSlug: standardise-the-settings-that-change-results
order: 3
title: "Standardise the settings that change results"
description: "Sort CAD system options into those that change results, those that affect performance and personal preferences, then control only the first group and deploy it without breaking trust."
draft: false
---

A CAD administrator who tries to control every setting will fail, and deserves to. Designers spend their working day inside the software, and much of what makes it pleasant or tiresome to use is personal: colours, shortcuts, toolbar layout, how the mouse zooms. Taking those away buys nothing for the office and costs goodwill that the administrator will need later. At the same time, some settings change what the office produces, and leaving those to individual choice is how the same drawing comes to print two ways.

The skill is in drawing the line. This chapter gives a test for sorting settings into three groups, applies it to the 38 differences that the running case office found in Chapter 2, and describes how to deploy the controlled group. Its error case is an over-zealous first deployment that locked too much and was quietly undone by the people it was meant to help.

## Three kinds of setting

Every system option falls into one of three groups, according to what changes when it changes.

- **Result settings** change what a file contains, how it is interpreted, or what is printed or exported. Examples are the default drafting standard, default units for new documents, where the software looks for templates and libraries, how external references are resolved, and how line styles map to printed weights. If two seats differ in a result setting, the same work can produce different output.
- **Performance settings** change speed, memory use or responsiveness, without changing results. Examples are image quality for new documents, whether large assemblies open in a reduced mode, and how often automatic recovery files are written. They matter to productivity, and they often interact with hardware.
- **Personal settings** change only the person's experience of the software. Examples are background colours, toolbar arrangement, keyboard shortcuts and mouse gestures. Two seats differing in personal settings produce identical output.

```figure
type: decision
title: Classify a setting by asking what changes
question: If this setting differed between two seats, what would change?
caption: This is an illustration. Ask the question about output first; a setting that changes output is a result setting even if it also affects speed.
- *The file content, printout or export | Result setting | control it centrally and lock it where the software allows
- Only speed, memory or responsiveness | Performance setting | deploy a recommended default; allow documented exceptions
- Only what the person sees or how they work | Personal setting | leave it to the person
```

Some settings resist neat classification. A setting that controls the default image quality for new parts mainly affects performance, but if the office exports lightweight visual files for customers, it also changes those files. Classify by the most serious effect. If any plausible use of the setting changes output, treat it as a result setting.

## Apply the test to the running case

The running case office's export listed 212 settings. The administrator worked through them all once, which took about six hours spread over two weeks, and placed each in a group. The result was:

```figure
type: stack
title: The office's 212 system settings by group
unit: settings
caption: This is an illustration. Only about one in seven settings needed central control.
- Result settings, controlled | 31
- Performance settings, recommended default | 14
- Personal settings, left to the user | 167
```

The totals add to **31 + 14 + 167 = 212**. The important finding is the proportion: only 31 settings, about 15%, needed to be controlled. That number made the project manageable and made it easier to explain to the office. Nobody was going to lose their shortcuts.

The 38 settings that had differed between seats in Chapter 2 sorted as follows: **17 result settings, 6 performance settings and 15 personal settings**, again summing to 38. The 17 result differences were the real problem. Among them were the default drafting standard on two seats, the template location on three, the line style mapping for printing on three, and the setting that had caused Chapter 1's missing bend lines.

## Decide the value, not just the uniformity

Making all seats agree is not enough if they all agree on the wrong value. For each of the 31 result settings, the administrator recorded a decision and its reason. Most decisions were obvious: the drafting standard follows AS 1100, units are millimetres and the template location is the shared template folder. A few needed thought.

One example was how the software should treat a reference to a file it cannot find at the stored path. Options in many CAD systems include searching certain folders in a defined order, or asking the user. The office chose to search the shared library folder first and then the folder of the opening assembly, so that a missing fastener would be resolved from the controlled library rather than from a stray copy in a project folder. That decision connected the settings work with the library work in Chapter 6, and the reason was written beside it in the register.

Another example was the option to allow editing of files that another user has open. On a shared drive without data management, allowing it invites overwritten work; preventing it causes delays. The office chose to prevent it and to address the delays through better assembly structure, recording that this would be revisited if a data management system were introduced.

Write the reason down for every controlled setting. Reasons are what allow the next administrator, or the same one two years later, to decide whether a setting can be changed safely.

## Deploy centrally, and keep the source

Once the values are decided, they must reach every seat and stay there. CAD vendors provide different mechanisms. Some allow an administrator to build an installation image with predefined options and to lock selected options against change. Others read a central settings file at start-up. At the simplest, a settings file can be exported from a reference seat and imported on the others. The vendor documentation cited in this book's references describes one such mechanism; whichever you use, the principles are the same.

```figure
type: steps
title: Deploying controlled settings
caption: This is an illustration of the order the running case office followed. Each step leaves a record in the register.
- Build a reference seat | clean installation, controlled values set, personal settings left at defaults
- Export the controlled set | only the 31 result settings, plus the 14 performance defaults as a separate file
- *Test on one seat | open the reference model, print the test drawing set, compare with the reference seat
- Deploy to all seats | lock result settings where the software allows; apply performance defaults unlocked
- Verify | repeat the Chapter 2 comparison and printing test on every seat
- Record | revision of the settings file, date, seats updated, exceptions
```

The test step deserves emphasis. A settings file imported over an existing configuration can do more than intended, because some export formats include everything rather than only the chosen settings. Test the import on one seat whose owner has agreed to the risk, and check that personal settings survived before deploying further.

Keep the settings file under revision control, in the register, like a template. When a controlled setting needs to change, the change is made to the source file, given a new revision, tested and redeployed. Changing a setting directly on six seats, one at a time, is how the office got into difficulty in the first place.

## Seat settings and document settings

Most parametric CAD systems keep two kinds of option. System options belong to the seat and apply to everything opened there. Document options belong to each file and travel with it: its units, its drafting standard, its dimension style, its display precision, and often its line styles and fonts. The distinction matters because the two kinds are controlled in different ways.

Seat settings are controlled by deployment, as described above. Document settings are controlled by templates, because a new file inherits its document options from the template it was started from. A perfectly deployed seat will still produce an inconsistent drawing if the drawing was started from an old template with old document options. That is why four of the nine failures in Chapter 2's sample came from superseded templates, even on seats whose system options were correct.

Some settings exist in both places. A system option may set the default drafting standard for new documents, while the document itself stores the standard actually in use. In that case the system option matters only at the moment a file is created without a template, and the document option governs thereafter. The administrator's register should note, for each controlled item, whether it lives on the seat, in the document or both, so that a change is made in the right place.

For the running case office, the practical rule became: seats are controlled by the settings file, documents are controlled by templates, and existing documents are corrected when they are next revised, not in a bulk campaign. The bulk approach was tempting, but changing the drafting standard of thousands of released drawings would alter their appearance without a revision, which the office's release process forbids. A drawing that changes must be revised; a drawing that is not being revised should be left as released.

## Performance settings need exceptions

Performance settings are recommended rather than locked, because the right value can depend on the work and the hardware. The engineer who opens the full 3,000 mm module with its supporting structure benefits from opening large assemblies in a reduced mode; the drafter who mainly works on single-part drawings does not.

The office handled this by publishing recommended defaults with a short explanation and allowing any user to change them, provided they did not change results. Exceptions were noted in the register so that a support request about slowness could be checked against them. When the comparison was repeated after deployment, two seats still differed from the recommended performance defaults, both deliberately and both recorded.

## The error case: locking too much

The first deployment did not go well. The administrator's initial export from the reference seat included toolbar layouts, keyboard shortcuts and colour schemes, because the export tool's default was to include everything. When it was imported, five of six people found their working environment reset to the reference seat's appearance.

Two people did what most people would do: they found a backup of their own old settings file and imported it over the top. Their personal settings came back, and so did their old result settings, including the old template location and line style mapping. Within a week, the office had two seats configured as before, one partly reconfigured, and a general feeling that the settings project was an imposition.

The administrator detected the problem by repeating the settings comparison a week after deployment, as the register's plan required. The comparison showed 9 result settings differing again, all on the two seats where old files had been restored. Conversations with the two users explained why.

The correction had three parts. The administrator apologised plainly and restored everyone's personal settings from the pre-deployment exports taken in Chapter 2, which is one reason to keep the baseline's raw files. The deployment was rebuilt to include only the 31 result settings, locked, and the 14 performance settings as an unlocked default file. And the office agreed a short rule: personal settings belong to the person, result settings belong to the office, and nobody imports a whole settings file over a seat without the administrator. A second comparison after the corrected deployment showed **no** differences in result settings, **2** recorded performance exceptions and **15** personal differences, which was exactly the intended state.

```figure
type: compare
title: Differences between seats before and after deployment
cols: Baseline | After first deployment | After corrected deployment
caption: This is an illustration. The goal is zero differences in result settings, not zero differences overall.
- *Result settings differing | 17 | 9 | 0
- Performance settings differing | 6 | 4 | 2, both recorded exceptions
- Personal settings differing | 15 | 3, forced to match | 15, restored to users
```

The lesson is that the line between result and personal settings is a matter of trust as well as engineering. People accept control of what affects the office's output when they can see that control stops there.

## Explain the change before making it

The corrected deployment went smoothly partly because it was explained first. The administrator spent fifteen minutes at a regular team meeting showing three things: the baseline table with its six unique seats, the bend-line incident from Chapter 1 and the list of 31 controlled settings with a one-line reason for each. People could see which settings were being locked and why, and could see that their own shortcuts and colours were not on the list.

Two people raised objections. One designer relied on a different default for dimension precision when detailing small machined parts. That turned out to be a document setting better handled in the drawing template, and it was passed to the template work in Chapter 4. The graduate asked why the template location could not simply be their own folder, which led to a useful explanation of how one stray template had produced four of the nine sampled failures. Both conversations improved the deployment, and neither would have happened if the settings had simply arrived one morning.

## Keep the settings stable through updates

Settings drift for reasons other than people. A software update can reset options, add new ones or change their meaning. A reinstallation after a hardware fault can restore defaults. A new seat may be built from the vendor's defaults rather than from the office's file.

Three habits keep settings stable:

- After any update or reinstallation, repeat the settings comparison on the affected seat before it returns to production work.
- When a new software release adds options, classify the new ones using the same test and add any result settings to the controlled file.
- Build every new seat from the controlled settings file, not by copying a colleague's configuration.

The comparison takes minutes once the method is established, and it catches drift before it reaches a drawing.

## Exercise: classify five settings

Classify each of these settings as a result, performance or personal setting, and state what you would do with it in the running case office.

1. The default drafting standard for new drawings.
2. The colour of the graphics area background.
3. Whether assemblies open with components in a reduced, lightweight state.
4. The folder searched first for referenced files that cannot be found.
5. The tolerance used to display the number of decimal places in dimensions on new drawings.

**Answer.** (1) Result: it changes how drawings are annotated and printed; control and lock it, set to the office's AS 1100-based standard. (2) Personal: it changes only the screen; leave it to the user. (3) Performance, with a caveat: it changes speed, but if some operations behave differently on reduced components, check that output is unaffected; publish a recommended default and allow recorded exceptions. (4) Result: it determines which file is loaded, which can change the assembly and its bill of materials; control it, pointing first to the controlled library. (5) Result: it changes printed dimensions; control it, consistent with the templates in Chapter 4, which normally carry the drawing's own display precision as well.
