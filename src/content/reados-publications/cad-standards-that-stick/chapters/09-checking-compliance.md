---
book: cad-standards-that-stick
chapterSlug: checking-compliance-without-policing
order: 9
title: "Checking compliance without policing people"
description: "Combine automated file checks, peer checking and a monthly random sample to measure compliance with a CAD standard, and design the checks so they cannot be satisfied by gaming."
draft: false
---

A standard that is never checked becomes a suggestion. A standard that is checked aggressively becomes a source of resentment, and people learn to satisfy the checker rather than the purpose. Between those two lies a practical middle: checks that are mostly automatic, aimed at the things that cause real faults, reported as trends rather than as personal scores and treated as information about the environment rather than about individuals.

This chapter builds that middle for the running case office. It divides the work between software, people and sampling, estimates how much a sample can be trusted to find, costs a simple automated check and measures six months of results. Its error case is a check that improved its own numbers while making the data worse.

## Three layers of checking

No single method checks everything well. The office uses three layers, each suited to a different kind of rule.

```figure
type: layers
title: Three layers of compliance checking
caption: This is an illustration. Each layer catches what the others miss; none replaces design checking by an engineer.
- Automated checks | run on every file before release; property completeness, allowed values, template revision, rebuild errors
- Peer check | by the drawing checker as part of normal checking; modelling rules, references, drawing conventions
- *Monthly sample | 30 random files checked in depth by the administrator; measures the trend and tests the other layers
```

Automated checks are cheap per file, consistent and tireless, but they can test only what can be expressed as a rule about file data. Peer checks catch the judgement-based rules, such as whether a hole is located from a plane or a face, but depend on the checker's attention and time. The monthly sample is slow and covers only a fraction of files, but it is the only layer that measures how well the other two are working.

## What to automate

The office's automated check is a small script that runs inside the CAD system and inspects a file or a folder of files. It reads properties and a few model attributes and writes a short report. It tests:

- that the TemplateID property shows a current template revision;
- that every schema property due at the release stage is present and not blank;
- that list properties, such as Material, Finish and MakeBuy, hold values from their allowed lists;
- that Description is 40 characters or fewer;
- that the Material property agrees with the material assigned to the model for mass calculation;
- that the model rebuilds with no errors or warnings at every configuration;
- that every referenced file comes from the project folder or the controlled library;
- that bill of materials tables and title blocks contain no typed overrides.

Each of these was chosen because it had caused a real fault in an earlier chapter. The list is not exhaustive and was not meant to be. A check that tests forty things produces reports that nobody reads; a check that tests eight things that matter produces reports that get acted on.

## Cost the automation honestly

The script took the administrator about **14 hours** to write and test, using the CAD system's macro interface. Before it existed, a checker spent about three minutes per drawing confirming the same items by hand. Over 480 drawings a year that is **480 × 3 ÷ 60 = 24 hours**, so the script pays back its development time in about **14 ÷ 24 × 12 ≈ 7 months**, before counting its better consistency.

```figure
type: formula
title: Payback on the automated check
formula: Payback in months = development hours ÷ hours saved a year × 12
caption: This is an illustration. Maintenance after each software release reduces the net saving and must be included.
- Development | 14 hours
- Manual checking replaced | 3 minutes on each of 480 drawings a year
- Maintenance | about 3 hours after each major software release
step: Hours saved a year = 480 × 3 ÷ 60 = 24
step: Payback = 14 ÷ 24 × 12 ≈ 7 months
step: Net saving in a release year = 24 − 3 = 21 hours
```

Automation has a running cost that is easy to forget. Macro interfaces change between releases, and a script that worked last year may fail or, worse, run and report incorrectly. The office budgets about three hours of maintenance after each major release and tests the script against a set of files with known faults before trusting it again. The KEVOS® [automation business case](/tools/automation-check/) tool helps frame the same comparison for other repetitive tasks, and the Library’s chapter on [automating CAD with macros and APIs](/reados/collections/cad-modelling-and-design-intent/automating-cad-with-macros-and-apis/) discusses when automation is worth building.

Scripts are code, and code that runs with access to every engineering file deserves control. The office keeps its scripts in a read-only folder under revision control, runs only scripts from that folder and does not allow scripts downloaded from forums to run without review. This follows the same thinking as the Australian Cyber Security Centre's Essential Eight, which treats restricting macros and controlling which applications can run as baseline protections for any organisation. CAD macros are not the office-document macros that guidance names, but the risk is of the same kind.

## Give the peer checker a short list

The drawing checker already examines every drawing before release, as part of normal engineering practice. Asking them to check every rule in the standard as well would double their work and dilute their attention to the design itself. The office gave the checker a short addition instead: four modelling questions that the script cannot answer and that matter most.

- Do holes and interfaces locate from planes, axes or sketches rather than faces?
- For configured parts, was a flex test done, and does the drawing update correctly at each configuration?
- Are references between parts in an assembly removed or locked before release?
- Are any exceptions to the modelling rules recorded on the features concerned?

Each takes a minute or two with the model open. The checker records a yes, no or not applicable for each on the checking record, alongside the design check. Where the answer is no, the file goes back to the designer like any other checking comment.

The peer check works because it is attached to an existing step rather than added as a new one. A separate compliance review, scheduled apart from design checking, would compete with it for time and would soon be skipped. Folding four questions into the check the office already does costs a few minutes a drawing and gets done.

## Close the loop on every finding

A finding that is recorded and never acted on teaches people that the checks do not matter. Every finding from any of the three layers should end in one of three outcomes: the file is corrected, the rule is clarified, or the environment is changed so that the fault cannot recur.

The third outcome is the most valuable, and the monthly sample is where it usually starts. When the administrator sees the same fault in several sampled files, the question is not who made it but why the environment allowed it. In the first six months, two recurring faults led to environment changes rather than reminders. Materials missing from the allowed list were added and the list was aligned with purchasing's records. A drawing template that let one dimension style be overridden too easily was revised. In each case, the fault stopped appearing without anyone being asked to try harder.

## How much can a sample find?

The monthly sample is the layer that measures. Each month the office creates about **40** new drawings. The administrator picks **30** files at random from the month's released files and checks each against the full standard, including rules that neither the script nor the peer checker covers well.

Thirty is a practical number, not a statistically derived one. It is worth knowing what it can and cannot detect. If some fault affects a fraction p of files, the chance that a random sample of 30 contains none of them is roughly **(1 − p) raised to the power 30**. For a fault in 10% of files, that is **0.9³⁰ ≈ 0.042**, about a 4% chance of missing it entirely. For a fault in 20% of files, it is **0.8³⁰ ≈ 0.0012**, about one chance in 800.

```figure
type: compare
title: Chance that a sample of 30 finds no example of a fault
cols: Chance of finding none | Interpretation
caption: This is an illustration, treating the sample as random draws from a large population. Common faults are almost certain to appear; rare ones may not.
- Fault in 20% of files | about 0.1% | almost certain to be seen
- *Fault in 10% of files | about 4% | very likely to be seen
- Fault in 2% of files | about 55% | as likely to be missed as found
```

For the rarest case, **0.98³⁰ ≈ 0.55**: a fault in one file in fifty is about as likely to be missed as found in a single month. That is why the sample complements the automated check rather than replacing it. The sample is good at measuring common problems and trends, while rare but serious faults need a rule in the automated check or the peer checklist.

Because 30 of 40 files is a large share of a small population, the true chances of missing a fault are somewhat lower than these figures. The simple formula is a cautious estimate, which is the right direction to err.

## Six months of results

A sampled file is compliant if it meets every rule in the standard. The office's results for the first six months after the standard's release were:

```figure
type: line
title: Compliant files in the monthly sample of 30
x: Month after release
y: Compliant files, %
ymin: 50
ymax: 100
caption: This is an illustration. Counts were 19, 21, 22, 24, 25 and 26 compliant files out of 30 in months 1 to 6.
- 1 | 63.3
- 2 | 70.0
- 3 | 73.3
- 4 | 80.0
- 5 | 83.3
- 6 | 86.7
```

The proportion rose from **19 ÷ 30 = 63.3%** to **26 ÷ 30 = 86.7%**. As Chapter 2 cautioned, single months are noisy; the steady rise over six months is more convincing than any one value. The administrator reported the trend and the main reasons for non-compliance each month, without naming individuals. The reasons shifted over time from template and property faults, which the automated check soon eliminated, towards modelling rules, which only training could address.

## The error case: a check that improved its own numbers

In the second month, the automated check reported a sharp fall in blank properties. Purchasing, at the same time, complained that new bills of materials contained "TBA" in the Supplier column for dozens of bought parts.

The administrator searched the property values directly. The text "TBA" appeared in **37** property values in files released that month, against **2** in the month before. Designers under deadline pressure had learned that the check rejected blank fields and had begun typing "TBA", "-" or "?" to get files through. The check's first version tested only whether a field was empty, so the placeholders passed. The number the check reported had improved; the data had got worse.

Nobody had set out to deceive anyone. The designers were reacting sensibly to a check that blocked release over information they genuinely did not have, such as supplier data that purchasing had not yet confirmed. The fault was in the check's design and in the process around it.

The correction had three parts:

1. **The check was tightened.** Free-text fields now reject a short list of known placeholders, and list fields accept only values from their lists.
2. **The process was fixed.** Supplier data is owned by purchasing, as Chapter 5's schema says. The check was changed so that a Buy part with blank supplier fields is flagged for purchasing rather than blocking the designer, and release of the drawing waits for purchasing to complete them.
3. **The report was broadened.** The monthly report now includes a count of placeholder values found by direct search, so that a similar workaround would show up even if the check missed it.

Within a month, placeholders fell back to the low single figures. The lesson applies to any measured process: when a check blocks people from doing their work, they will find a way through it. Design checks to test what you care about, make sure people can meet them with the information they have, and look at the data directly from time to time instead of trusting the check's own summary.

## Report the environment, not the people

Compliance results can easily become a league table of individuals, which damages trust quickly in a six-person office where everyone knows whose files were sampled. The office reports results by rule and by cause, not by person. A designer whose files repeatedly break the same rule is a training need, raised privately and addressed in Chapter 10's way, not a name on a chart.

The monthly report itself is short: the sample result and its trend, the three most common causes of non-compliance, what was changed in the environment as a result, and anything the administrator needs from others, such as purchasing completing supplier data. It goes to the whole office, not only the manager, so that everyone sees the same picture and can see their colleagues' faults treated as problems to fix rather than people to blame.

## Retire checks that have done their job

Checks accumulate as easily as rules. Once a fault has been designed out of the environment, its check may no longer be needed. After the template identity property and the read-only template folder were in place, files from superseded templates stopped appearing altogether. The template check still runs, because it costs nothing in the script, but the administrator stopped spending sample time on it and moved that time to the modelling rules, where faults still occurred.

Review the checks at the same time as the standard, once a year. For each, ask how many faults it found in the past year and whether the environment now prevents them. A check that has found nothing for a year may be retired from manual checking, or kept in the script as a cheap tripwire. A rule that is still broken often needs better training or a better environment, not more checking.

## Exercise: size the sample for a rarer fault

The engineering manager wants the monthly sample to have at least a 90% chance of including a file with a fault that affects 5% of files. Using the same approximation, roughly how large must the sample be? Is that practical when about 40 files are released each month?

**Answer.** The chance of finding no faulty file in a sample of n is about **0.95ⁿ**. A 90% chance of finding at least one means **0.95ⁿ ≤ 0.10**. Taking logarithms, **n ≥ ln 0.10 ÷ ln 0.95 ≈ 2.303 ÷ 0.0513 ≈ 44.9**, so about **45** files.

That is more than the 40 files released in a typical month, so the sample would have to cover every file, which is a full inspection, not a sample. The practical alternatives are to pool two months, which gives about 80 files and would meet the target over that period, or better, to turn the rule into an automated check that inspects every file. A sample is the right tool for measuring a trend; it is the wrong tool for reliably catching a specific fault that affects one file in twenty.
