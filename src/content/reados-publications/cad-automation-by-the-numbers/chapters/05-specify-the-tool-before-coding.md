---
book: cad-automation-by-the-numbers
chapterSlug: specify-the-tool-before-coding
order: 5
title: "Specify the tool before coding"
description: "Write a short specification for a CAD automation tool: workflow, inputs, outputs, behaviour and acceptance tests, prove it with a mock-up users can try, and estimate the build from it."
draft: false
---

Engineers who would never fabricate a part without a drawing will happily start programming without a specification. The result is predictable: a tool that does what its author imagined, which is not quite what its users needed, rebuilt two or three times as the gaps appear. A specification for a CAD automation tool does not need to be long. It needs to state what goes in, what comes out, what happens when things go wrong and how everyone will know the tool is finished.

This chapter writes the trestle configurator's specification. It maps the workflow the tool serves, defines inputs and outputs down to units and formats, sets the behaviour for awkward cases, writes acceptance criteria that become tests, and proves the user interface with a mock-up before any real functionality exists. It ends with the build estimate that came from the specification and with a cut-list format that nobody specified.

## Start from the workflow

A tool serves a workflow, not a model. Before describing the tool, the office mapped what happens to a trestle from order to fabrication, and marked where the tool fits.

```figure
type: steps
title: A trestle variant from order to workshop
caption: This is an illustration. The configurator replaces most of steps 3 to 5; the order entry, check, release and purchasing steps stay, but each receives better inputs.
- Order entered | sales records the customer, conveyor and trestle quantities
- Variant identified | designer reads belt width, height, foot and bracing from the order
- *Model and drawings | configurator checks the vault, reuses or generates the variant
- Cut list | configurator writes the cut list in purchasing's format
- Independent check | a second designer checks drawings against the rule table
- Release | drawings released to PDF in the vault; workshop and purchasing notified
```

Mapping the workflow found two things the first idea of the tool had missed. The designer reads the inputs from the sales order, so the tool should accept the order number and read the customer and quantities into the title block, rather than having them typed again. And purchasing uses the cut list, so purchasing is a user of the tool whose needs must be specified, even though they will never open it.

## Inputs, with units and limits

Every input is defined with its name, unit, allowed values and where it comes from. This is an illustration from the specification:

- **Order number**, text, must exist in the order system; the tool reads the customer name and trestle quantity from it.
- **Belt width**, mm, one of 450, 600, 750, 900, 1,050 or 1,200 (rule R1's validated range).
- **Height**, mm, 400 to 1,500 in 50 mm steps (rule R6).
- **Foot style**, one of bolt-down, levelling or cast-in, plus customer-specific styles where the order's customer has one.
- **Bracing**, not an input: set by rule R4 from the height, and shown to the designer.

The last line is a deliberate design choice. The first sketch of the interface had a bracing tick-box. The rule owner removed it, because a tick-box invites the designer to override a rule. Anything decided by a rule is shown, not offered.

## Outputs, with formats

Outputs are specified as precisely as inputs, including file names, properties, drawing contents and data formats. Where another person or system consumes an output, its format is agreed with them and an example file is attached to the specification.

This is an illustration. The trestle configurator produces:

- the generated assembly and parts, named as in Chapter 4, checked into the vault in the work-in-progress state;
- a drawing set from the master drawing, with the order number, customer, quantity, rule-table revision and generator version in the title block;
- a cut list for purchasing, as a file in the format purchasing's spreadsheet already imports, with an example attached;
- a line in the generation log: date, user, order, inputs, rule-table revision, generator version and the names of the files produced.

## Behaviour when things are not simple

Most of a tool's code handles cases that are not the happy path. The specification lists them and states the required behaviour for each, so the developer does not invent it.

- **Variant already exists under the current rule revision**: reuse it, add the order to its where-used record and produce the cut list.
- **Variant exists under an older rule revision**: do not reuse it; tell the designer which rules changed and ask them to generate afresh or raise a review.
- **Input outside the validated range**: refuse, naming the rule and its range (Chapter 3).
- **A needed file is checked out by another user, or the vault is unavailable**: stop before creating anything, and say what is blocking.
- **Generation fails partway**: remove everything created in this run, leave the vault as it was and log the failure (Chapter 6).
- **The user cancels**: same as a failure.

## Requirements that are not about trestles

Some requirements have nothing to do with the product and everything to do with whether the tool survives in the office. They are easy to forget because no user asks for them. The trestle configurator's specification lists them under their own heading:

- **CAD releases.** The tool must work on the CAD release the office runs and be retested on each new release before the office upgrades. The office upgrades once a year, so that is one retest a year as a minimum.
- **Seats.** Four design workstations and one build machine that runs the batch program overnight. The tool must not need administrator rights to run, only to install.
- **The vault.** All files are created through the vault's own check-in, never by writing to folders directly, so that the vault's history and permissions apply to generated files exactly as to hand-made ones.
- **Logging.** Every generation, refusal and failure is written to the generation log, which is kept for at least seven years with the product records.
- **Trust.** The installed tool is signed, so that the CAD system and the office's security settings can tell it apart from an unknown macro. Chapter 8 covers this.
- **Ownership.** The source code, the build instructions, the rule table and the test set are kept in the office's own version control, and the developer's contract says so.

None of these needs much code, but each needs a decision. A tool that writes directly to folders, or that only runs with administrator rights, will either be blocked by the office's IT settings or will quietly undermine them.

## Who signs and what waits

The specification is signed by the people whose work it changes: the rule owner for the engineering, a designer for the workflow, the purchasing officer for the cut list and the developer for feasibility. It then goes under change control, like a drawing. Any later change is written against it, with its effect on the estimate.

The office also kept a list of ideas that were deliberately left out of the first version: automatic pricing on the sales quote, a 3D PDF for customers and a web form so that sales could request a variant directly. Each was a reasonable idea. Each would have added weeks. Writing them down as deferred, rather than refusing them, kept the conversation friendly and the first version small. Two of the three were built in the following year, once the configurator had proved itself. The third, the web form for sales, was dropped when the measured data showed that designers spent less than a minute per request entering the inputs, so the form would have saved almost nothing. Deferring it until there was evidence cost nothing and avoided building a feature nobody needed.

## Acceptance criteria that become tests

The specification ends with acceptance criteria: statements that are either true or false, which the finished tool must satisfy before it is used for real work. Each becomes a test in Chapter 7.

```figure
type: compare
title: Part of the trestle configurator's acceptance criteria
cols: Criterion | How it is tested
caption: This is an illustration. Every criterion is measurable; none says "user-friendly" or "fast" without a number.
- A1 Correct variants | all 24 flex-test combinations generate without error, mass within 1% of hand values | regression set, run automatically
- A2 Rules applied | every rule boundary from Chapter 3 gives the rule table's outcome | rules library tests
- A3 Refusal | every input outside a validated range is refused with the rule named | scripted invalid inputs
- *A4 Clean failure | a failure injected at each stage leaves the vault unchanged | fault-injection tests
- A5 Time | generation of a new variant completes in under 60 s on the office's standard workstation | timed on 10 variants
- A6 Cut list | purchasing imports the generated cut list without editing | purchasing tests five files
- A7 Upgrade | all of the above pass on the current CAD release and the next one in beta | rerun at each release
```

## Prove the interface with a mock-up

The source for this book recommends building the program's forms and flow first, with buttons that call empty functions, before writing any real functionality. The idea is sound and old: let users try the shape of the tool while changes are still cheap.

This is an illustration. The contract developer built the configurator's panel in two days with no generation behind it. The panel accepted an order number, showed dummy customer details, offered the belt widths, heights and foot styles, displayed the bracing decision and had a Generate button that showed a fixed message. Three designers and the purchasing officer used it for an hour each with real orders.

Their feedback changed the specification before any real code depended on it:

- The designers wanted to see the cut list before generating, to spot an obviously wrong order input. The panel gained a preview of the cut list, which the rules library can produce without the CAD system at all.
- They wanted the height entered as a number and checked, not chosen from a list of 23 values, because the order states it as a number.
- The purchasing officer asked for the cut list to group pieces by section and stock length, not by part. That changed the output format before any code was written.

Each change took minutes in the mock-up. The same changes after the generator was finished would have taken days.

## Estimate the build from the specification

With the specification and mock-up agreed, the developer and the designer estimated the work by component.

```figure
type: bars
title: Build estimate for the trestle configurator by component
unit: hours
max: 120
caption: This is an illustration. The total of 320 hours is the figure used in the payback calculation in Chapter 1; the tests are a sixth of the effort and are part of the build, not an extra.
- Generator for models, drawings and cut lists | 110
- Rules library and its tests | 60
- Add-in panel, menu and save warning | 50
- Regression and fault-injection tests | 50
- Batch program | 30
- Installer and deployment | 20
```

The total is **320 hours**, which fed the payback calculation in Chapter 1. Tests take 50 hours, about **16%** of the total, plus the rules library's own tests within its 60 hours. Offices that leave tests out to save time usually spend more than that on the faults the tests would have found.

## A failure case: the cut list nobody specified

This is an illustration. The office's earlier macro, described in Chapter 1, had produced a cut list, and the first draft of the configurator's specification said only "produce cut list as the macro does". The developer copied the macro's output: one line per part, with lengths in metres to three decimal places.

At acceptance testing, the purchasing officer could not import it. Their spreadsheet expected lengths in millimetres, grouped by section and stock length, with a column for the quantity across the whole order. For the macro, a designer had been reformatting the file by hand every time, about ten minutes per variant, a cost nobody had counted in Chapter 1's breakdown.

The detection came from acceptance criterion A6, which had been added after the mock-up session: purchasing must import the file without editing. Without that criterion, the configurator would have gone into use with the same hidden reformatting step. The correction took about **40 hours** of rework in the generator and its tests, because the cut-list code had been written to the wrong format. Had purchasing been asked for an example file at the start, it would have taken perhaps four hours.

The lesson the office recorded was general: every output with a downstream user needs an example file from that user in the specification, and an acceptance criterion that the user tests themselves.

## How this applies to a small Australian business

A specification for a small tool can be three or four pages: the workflow, inputs, outputs, awkward cases and acceptance criteria. Writing it takes a day or two and saves far more. If an outside developer is involved, the specification and acceptance criteria are the basis of the contract and the way to decide when the work is finished and paid for. Fixed-price software contracts without acceptance criteria are a common source of disputes for small businesses. The mock-up step is especially valuable when the developer is not a designer, because it lets the people who know the work shape the tool before the expensive part begins.

Keep the specification beside the tool for its whole life. When a question arises in two years about why the tool refuses a 1,550 mm trestle, or why the cut list groups pieces by stock length, the answer should be in a signed document, not in the memory of whoever was in the meeting. Chapter 10 treats the specification, rule table and test set together as the tool's documentation.

## Exercise: an acceptance criterion for speed

The designers say the tool must be "fast enough to use while a customer is on the phone". Rewrite this as a measurable acceptance criterion. If generation of a new variant currently takes about 45 s on the standard workstation, reusing an existing variant takes about 5 s, and about 60% of requests are for variants that already exist, what is the expected average time per request?

**Worked answer.** A measurable version: **"For 10 representative orders, the time from pressing Generate to a complete preview of the drawings and cut list is under 60 s for a new variant and under 10 s for an existing one, on the office's standard workstation."** The expected average is **0.6 × 5 + 0.4 × 45 = 3 + 18 = 21 s** per request. That meets the designers' real need, a customer can be told the price and lead time within a call, and the criterion can now be tested rather than argued about.
