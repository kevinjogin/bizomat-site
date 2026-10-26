---
book: engineering-tools-people-use
chapterSlug: watch-people-use-the-tool
order: 1
title: "Watch people use the tool"
description: "Find out how colleagues really use an engineering tool by watching them do real tasks, recording time, errors and workarounds, and tracing field problems back to the interface."
draft: false
---

Ask engineers whether they find a tool easy to use, and most will say yes. Ask them to explain how they use it, and they will describe what they think they do. Watch them use it on a real task, and you will see what they actually do: the field they misread, the step they skip, the result they copy into a spreadsheet because the tool does not show what they need. The gap between what people say and what they do is where most of a tool's problems live, and the only reliable way to see it is to watch.

This chapter observes the machine builder's designers using the tolerance stack-up tool. It plans a short observation study, runs it with six designers on real work, records time, errors and workarounds, and traces two field problems back to what was seen. It ends with the most serious finding: a field whose meaning the author and half the users understood differently, which let a stack pass that should have failed.

## Why watch rather than ask

Surveys and interviews are useful for opinions, but they miss most usability problems, for three reasons. People do not notice their own workarounds, because they have become habits. People describe the ideal, not the actual, especially to the tool's author or a manager. And people who misunderstand a field do not know they misunderstand it, so they cannot report it.

Observation avoids all three. The observer sees what is done, including the parts the user does not think are worth mentioning. It is also cheap. Each session takes under an hour, and a handful of sessions finds most of the serious problems, as Chapter 6 shows.

## Plan the observation

The office's design manager and the tool's author planned a short study:

- **Participants:** six of the fourteen designers, chosen to include two who used the tool weekly, two occasionally and two who had joined in the past year.
- **Task:** each participant's next real stack-up, not an invented exercise, so the dimensions, tolerances and requirement were ones they cared about.
- **Method:** the participant worked as normal, thinking aloud, while an observer sat beside them taking notes and timing each step. The observer did not help or explain. If the participant got stuck, the observer noted it and waited.
- **Recording:** the observer noted every input entered and how, every hesitation, every question asked aloud, every workaround and the time for each step. With the participant's agreement, the screen was recorded so details could be checked later.
- **Debrief:** after the task, a few minutes of questions about anything the observer had noticed, asked neutrally: "I saw you paused at the tolerance field. What were you thinking there?"

The tool's author did not observe. The person who wrote a tool finds it very hard to watch someone misuse it without intervening, and participants behave differently in front of the author.

## What six designers did

This is an illustration. The six sessions took about 45 minutes each, and the observer's notes, set side by side, showed patterns no single session would have revealed.

```figure
type: stats
title: Six designers using the stack-up tool on real stacks
caption: This is an illustration from the office's observation study. Each figure counts the participants who did the thing at least once.
- 18 min | Average time to set up a five-dimension stack | range 9 to 31 minutes
- 3 of 6 | Entered plus-or-minus values | into a field that expected the total tolerance band
- 2 of 6 | Unsure whether a dimension added or subtracted | guessed, one wrongly at first
- *4 of 6 | Copied results into a spreadsheet | to compare with the requirement
- 1 of 6 | Used the statistical result | without knowing its assumptions
```

**Time.** Setting up a five-dimension stack took about **18 minutes** on average, from 9 minutes for a weekly user to 31 for a new designer. Most of the time went on finding the dimensions in the model and drawing, typing them in, and working out which way each one acted in the chain.

**The tolerance field.** The tool's input for each dimension had a field labelled "Tol." The author had written the tool to expect the **total tolerance band**: for a dimension of 45.50 ± 0.10, a value of 0.20. Three of the six designers typed **0.10**, the plus-or-minus value, which they read as the natural meaning of "tolerance". The tool accepted it without complaint and calculated as if the tolerance were ±0.05.

**Direction.** Each dimension in a stack either adds to the gap or subtracts from it. The tool asked for a sign, + or −, with no picture. Two designers were unsure which to choose for a dimension measured from a different datum, and one chose wrongly before noticing the nominal gap was negative and correcting it.

**The missing answer.** The tool showed the nominal gap, the worst-case limits and the statistical limits. It did not show the requirement or whether the stack met it. Four designers copied the results into a spreadsheet, typed the requirement beside them and compared by eye. Each did it slightly differently.

**Statistical results.** One designer used the root-sum-square limits as the answer because they were narrower, without knowing that they assume independent, centred, normally distributed dimensions, conditions that their small-batch machined parts might not meet.

## Trace the field problems

The office had two field problems in the previous year that it suspected involved the tool. With the observation findings in hand, the design manager reopened both.

The first was a gearbox in which the gear hub rubbed the housing face on a small number of assemblies. The designer's saved stack file was still on the server. Every tolerance in it had been entered as a plus-or-minus value, as half the observed designers had done. Chapter 3 works through the numbers. In short, the tool had reported a worst-case minimum clearance of about 0.355 mm against a requirement of at least 0.25 mm, a comfortable pass, when the true worst case was about 0.21 mm, a fail.

The second, a bearing preload problem, turned out to have a different cause, a drawing error. Not every problem traces to the tool, and the study helped separate the two, so that the drawing error was fixed where it arose rather than blamed on the software.

```figure
type: formula
title: The gear hub stack as entered and as intended
formula: worst-case gap = nominal gap ± Σ (half of each total tolerance band)
caption: This is an illustration. Housing depth A = 45.50 ± 0.10, bearing B = 12.00 ± 0.06, spacer C = 8.00 ± 0.05, hub D = 25.00 ± 0.08; gap = A − B − C − D; requirement at least 0.25 mm.
- As intended | half-bands 0.10, 0.06, 0.05 and 0.08 mm
- As entered | plus-or-minus values typed as total bands, so the tool halved them again
step: nominal gap = 45.50 − 12.00 − 8.00 − 25.00 = 0.50 mm
step: intended worst case = 0.50 ± 0.29, minimum 0.21 mm, fails the 0.25 mm requirement
step: as calculated = 0.50 ± 0.145, minimum about 0.355 mm, an apparent pass
```

## Workarounds are requirements

The four designers who copied results into a spreadsheet were not misusing the tool. They were doing the job the tool should have done, comparing the result with the requirement, and doing it in four slightly different ways. Workarounds are among the most useful things an observation finds, because each one is a requirement the tool's author missed, demonstrated by people who needed it badly enough to build it themselves.

The office listed every workaround it saw: the spreadsheet comparison, a printed sketch one designer kept beside the keyboard showing which way dimensions act, a personal note of "Tol = total!" taped to another designer's monitor by someone who had been caught out before. Each became an item in the improvement list for the chapters that follow.

## What the author thought and what the users did

The tool's author, shown the findings, was surprised by most of them. To the author, "Tol." obviously meant the total band, because that was how the calculation used it. The sign convention was obvious because the author always drew the chain first. The requirement comparison was the user's job, because requirements vary. Every one of those assumptions was reasonable, and every one was invisible to the users.

```figure
type: compare
title: What the author assumed and what the users did
cols: The author's assumption | What users did
caption: This is an illustration from the observation study. Each row became a change in Chapters 2 to 5.
- "Tol." field | obviously the total band | half read it as plus-or-minus
- Sign of each dimension | obvious once the chain is drawn | guessed, sometimes wrongly
- Comparing with the requirement | the user's job | done by hand in four different spreadsheets
- Statistical limits | used only when assumptions hold | used because they were narrower
- *Finding the dimensions | quick from the drawing | most of the 18 minutes
```

That is the general lesson of observation. A tool's author knows things the tool does not say. Users fill the gaps with their own reasonable assumptions, which are sometimes different. The tool works perfectly for its author and inconsistently for everyone else, and nobody notices until a part rubs.

## A failure case: the field that meant two things

This is an illustration. The gear hub problem was found when a customer returned a gearbox with a worn housing face, and the service team found two more in the same batch. The investigation looked first at the parts, which were within their drawing tolerances, then at the design. The design manager checked the stack file and found the plus-or-minus entries.

The fault was not the designer's carelessness, since half the observed designers made the same assumption, nor the calculation, which was correct for its inputs. It was a single ambiguous label on a field that silently accepted either convention. The detection came from a field failure, the most expensive route. The observation study, run afterwards, showed it had been a risk on every stack for five years.

The correction is the subject of Chapter 2: replace the ambiguous field with explicit upper and lower deviations, show the resulting limits immediately, and convert any stored stacks. The office also checked every saved stack file from the past two years for tolerance values that looked like half-bands, by comparing them with the drawings, and found eleven more. Nine still passed with the correct values. Two failed and were reviewed, and one led to a drawing change before any parts were made.

## Set a baseline to improve against

The observation gave the office numbers to improve against, as well as problems to fix. Before changing anything, the design manager recorded a baseline from the study and the file audit:

- time to set up a five-dimension stack, about **18 minutes** on average;
- the share of saved stack files from the past two years with tolerance values that did not match the drawings, about **11 of 140**, roughly **8%**;
- the share of observed designers who compared results with the requirement inside the tool, **none**, since the tool could not do it;
- the share who could say what the statistical limits assume, **one of six**.

Chapter 8 measures the same things after the changes. Without the baseline, the office would know only that the new tool felt better. With it, the office could say whether errors had actually fallen, which was the point of the exercise after the gearbox return.

The audit itself is worth describing because it is cheap and revealing. A junior designer opened each saved stack file, found the drawings for its dimensions in the vault and compared each tolerance with the drawing. It took about two days for 140 files. It found the half-band entries, two dimensions entered with the wrong sign whose errors had been caught in design review but never corrected in the saved stack files, and three files for assemblies that had since been redesigned, so that the saved stack no longer described any real product. Each finding was sent to the responsible designer with a request to correct or archive the file. The audit is now repeated each year on a sample of 20 files.

## Keep watching

The office decided to repeat a smaller observation, with two or three designers, after each significant change to the tool and whenever a new designer joined. It costs about an hour per session, and it is the only way to find the next misunderstanding before a customer does. New designers are especially valuable participants, because they have not yet learned the workarounds and still read every label literally, as the tool's text actually says.

## How this applies to a small Australian business

Small engineering offices often have one person who wrote every tool, and the tools carry that person's assumptions. Watching two or three colleagues use each important tool on real work, for under an hour each, is one of the cheapest quality checks available. Do not let the author observe, do not help, and write down every workaround. Then trace your last few field problems back through the tools that touched them. The broader principles of designing for users are covered in [User experience for products and services](/reados/collections/product-development-and-launch/user-experience-for-products-and-services/).

## Exercise: a three-part stack

A designer checks a stack with three dimensions: E = 30.00 ± 0.05, which adds to the gap, and F = 18.00 ± 0.04 and G = 11.70 ± 0.03, which subtract. The requirement is a gap of at least 0.10 mm. Calculate the nominal gap and the worst-case minimum. Then calculate what the old tool would have shown if the designer had typed the plus-or-minus values into its total-band field.

**Worked answer.** Nominal gap: **30.00 − 18.00 − 11.70 = 0.30 mm**. The sum of half-bands is **0.05 + 0.04 + 0.03 = 0.12 mm**, so the worst-case minimum is **0.30 − 0.12 = 0.18 mm**, which meets the 0.10 mm requirement. With plus-or-minus values typed as total bands, the tool would have used **0.025 + 0.02 + 0.015 = 0.06 mm**, showing a minimum of **0.24 mm**. Both pass here, but the tool's figure overstates the margin by 0.06 mm, half the real tolerance effect. For a tighter requirement, such as 0.20 mm, the real stack fails while the tool shows a pass.
