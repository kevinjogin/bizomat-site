---
book: cad-standards-that-stick
chapterSlug: baseline-the-environment
order: 2
title: "Baseline the environment before changing it"
description: "Measure a CAD office before standardising it: compare settings across seats, time a reference model, sample drawings for errors and read the results with honest uncertainty."
draft: false
---

Every CAD office believes its seats are set up the same way until someone checks. The check is rarely difficult. Most CAD systems can export their options to a file, most models can be timed with a stopwatch, and most drawings can be inspected against a short list. What makes the baseline valuable is not difficulty but discipline: it is taken before anything is changed, recorded in a form that can be repeated, and interpreted without exaggeration.

This chapter takes the running case office through a baseline in three parts: settings, performance and output quality. It shows how to read a small sample without claiming more precision than it has. Its error case is a baseline built from interviews rather than evidence, which is the most common way of measuring nothing while feeling thorough.

## Why measure first

A baseline does three jobs. It finds the actual differences, which are seldom the ones people expect. It gives a starting value for each measure in the administrator's charter, so that improvement can later be shown rather than asserted. And it protects the administrator from blame for problems that existed before any change. If the first template release is followed by a property error, the baseline shows whether that error is new or merely newly noticed.

Measure only what will be measured again. A baseline of fifty indicators that nobody repeats is less useful than three indicators repeated every quarter. For the running case office, the administrator chose three: settings differences between seats, the time to open and rebuild a reference assembly, and the proportion of sampled drawings with an environment error.

## Part 1: compare settings across seats

Most parametric CAD systems store their system options in a form that can be exported, either through a built-in tool or from a settings file. The method is simple:

1. Export the full option set from each seat on the same day, before anyone changes anything.
2. Convert each export to a plain list of setting name and value.
3. Combine the lists into one table with a column per seat.
4. Flag every row where the seats do not all agree.

The running case office compared **212 settings** across its six seats. **38** differed on at least one seat. That is about 18% of the settings, which sounds alarming, but the count alone says little. A difference in background colour and a difference in the default drafting standard are both one row in the table, and they matter very differently.

```figure
type: stats
title: Settings comparison across six seats
caption: This is an illustration. The count of differences is a starting point; Chapter 3 classifies each difference by its effect.
- 212 | settings compared | exported from every seat on one day
- *38 | differed on at least one seat | about 18%
- 6 | seats with a unique combination | no two seats were identical
```

No two seats were identical. That finding, more than the count, persuaded the engineering manager that the problem was real. Chapter 3 sorts the 38 differences into those that change results, those that affect performance and those that are personal preference.

Record two other things during the settings comparison. First, note the software version and service pack on each seat, because a difference there can explain behaviour that no option table will. In the running case, five seats ran one service pack and the graduate's seat, installed later, ran a newer one. Second, note where each seat looks for templates, libraries and other shared files. The office found three different template folders in use.

## Part 2: time a reference model

Performance complaints are common and usually vague: "it's slow today". A reference model turns the complaint into a number. Choose a real assembly that represents the office's typical heavy work, copy it to a fixed location so that nobody edits it, and time two operations on every seat: opening it, and forcing a full rebuild. Repeat each measurement three times and use the middle value, because the first open is often slower while files are cached.

The running case office used the top-level assembly of the 2,400 mm transfer module, with about 640 component instances. The median full-rebuild times were as follows.

```figure
type: bars
title: Median full-rebuild time of the reference assembly
unit: s
max: 120
caption: This is an illustration. Five seats cluster between 39 and 46 seconds; seat 4 takes nearly three times as long.
- Seat 1 | 41
- Seat 2 | 44
- Seat 3 | 39
- *Seat 4 | 118
- Seat 5 | 46
- Seat 6 | 43
```

The mean of all six times is **55.2 s**, but the mean is not a useful summary here because one seat dominates it. The other five average **42.6 s**, and seat 4 takes **118 s, about 2.8 times as long**. That pattern points to something specific to seat 4 rather than a general need for faster computers.

The settings table explained most of it. Seat 4 had a verification option switched on that re-checks every feature during rebuild, and its image quality was set much higher than the others. Both are legitimate choices for a particular investigation, and both had been left on after one. When the two settings were matched to the other seats, seat 4's rebuild time fell to 47 s. The remaining small gap was attributed to an older graphics card, which the administrator passed to IT rather than treating as a CAD problem.

A reference model also becomes a regression test. Chapter 10 and any upgrade plan reuse it: when a new release or service pack is installed, the same model is timed again, and a large change is investigated before the release reaches everyone.

## Part 3: sample the output

Settings and timings describe the environment. Output quality describes its effect. The office's output is drawings, so the administrator sampled drawings.

Over the previous twelve months the office had issued about 480 new drawings. Checking all of them was impractical in a four-hour week, so the administrator drew a random sample of **40**, using a random number list against the drawing register rather than picking ones that came to mind. Each sampled drawing was checked against five questions:

- Was it started from a current template?
- Did the title block properties match the model's properties?
- Were the units and drafting standard correct?
- Did the stated scale match the views?
- Did it print correctly from a seat other than the author's?

A drawing failing any question was counted as having an environment error. **Nine of 40** failed at least one, a sample proportion of **22.5%**. Four were started from superseded templates, three had property mismatches, and two had unit or scale problems.

## Look at the files as well as the seats

Seats and drawings are not the whole environment. The 26,400 files in the project folders carry their own history, and a quick inventory of them often reveals more than any interview. The administrator ran a simple listing of the project folders, recording for each file its type, folder, size and last-modified date, and then looked at three things.

The first was where files had come from. Most CAD systems store a reference to the template or the creating file somewhere in a file's properties, or at least keep property names that betray their origin. By grouping files by their property name sets, the administrator found three distinct families, which matched the three template folders already seen on the seats. About 61% of files had come from the oldest family, 30% from a second and 9% from the newest. The newest family was the closest to what the office wanted, and also the least used.

The second was where standard parts lived. A search for files whose names began with common fastener descriptions found them in 47 different folders, including inside project folders, which meant that the same screw had been copied into projects rather than referenced from one place. That observation fed directly into Chapter 6.

The third was age. Files untouched for more than five years made up a large share of the total. They did not need to be standardised; they needed to be left alone and protected, because retrofitting old files is expensive and risky. Knowing the share of old files kept the plan realistic: the standard would apply to new work and to files when they were next revised, not to the whole archive at once.

None of these findings required special software. A folder listing exported to a spreadsheet, sorted and counted, was enough. The skill lies in asking which questions the listing can answer and recording the method so it can be repeated.

## Read the sample honestly

Nine out of 40 is evidence, but not a precise rate. A different random sample of 40 could easily have found six or thirteen. Before reporting "22.5% of our drawings have errors", it is worth asking how wide the plausible range is.

A standard method for a proportion is the Wilson score interval, which behaves sensibly with small samples. For 9 failures in 40 at roughly 95% confidence, it gives an interval from about **12% to 38%**. The administrator reported the result in those terms: somewhere between about one drawing in eight and about one in three had an environment error, with a central estimate of about one in four or five.

```figure
type: range
title: What a sample of 40 drawings can say
min: 0
max: 50
unit: %
caption: This is an illustration. The sample proportion is 22.5%; the Wilson interval at about 95% confidence runs from roughly 12% to 38%.
- Sample proportion | 22.5
- *Plausible range for all 480 drawings | 12 | 38
```

That range is wide, and it should be. It is still decisive for the question that matters: even the optimistic end, one drawing in eight, is far too high for an office whose drawings go straight to a folding press. A sample does not need to be precise to support a decision; it needs to be precise enough that the decision would not change if the true value lay anywhere in the range.

Two cautions apply. First, the sample measures errors that the five questions can detect. A drawing that passes all five may still be wrong in its design. Second, the sample is of last year's drawings, made in last year's environment. It is a baseline, not a forecast.

## The error case: a baseline built from interviews

Before the measured baseline, the engineering manager had asked each person whether their settings matched the office standard. Everyone said yes. The graduate added that they had copied the settings from the designer who trained them, which seemed to settle the matter.

The interviews were sincere and wrong. People cannot report settings they have never looked at, and "the office standard" was itself unwritten. The designer who trained the graduate had changed several options years earlier and forgotten. Asking people whether they comply with an unwritten standard can only produce agreement.

The error was detected when the measured comparison found six unique combinations among six seats. The correction was procedural: interviews were kept for what they do well, which is finding out what frustrates people and where they lose time, and evidence was used for everything that can be exported, timed or counted. The graduate's interview, for instance, produced a useful lead: they spent a long time searching for fasteners, which became part of the library work in Chapter 6.

## Record the baseline so it can be repeated

A baseline is only useful if the next measurement uses the same method. The administrator recorded, in the register:

```figure
type: checklist
title: Baseline record for repeat measurement
caption: This is an illustration. Each line states what to repeat, not just the result.
- Settings | export method, date, full table, list of differing rows
- Versions | software version and service pack per seat
- Reference model | file location, operations timed, number of repeats, median times
- Drawing sample | population, sample size, random selection method, the five questions, results
- Interpretation | interval for the drawing error rate and its limits
- ? Next measurement | planned date and who will do it
```

Store the raw exports and the timing sheet with the record. When the same comparison is repeated after Chapter 3's changes, a reviewer can see that like was compared with like.

## Use the baseline to choose priorities

The baseline turns the estimates of Chapter 1 into evidence. The office now knew that settings differed widely, that one seat's performance problem was a settings problem, and that roughly a quarter of drawings had detectable environment errors, mostly from old templates and mismatched properties.

That evidence set the order of work: settings first, because they affect everything else; templates and properties next, because they caused seven of the nine sampled failures; libraries after that. Each later chapter repeats part of this baseline to show whether its change worked.

The baseline also changed some priorities that intuition had set. Before measuring, the engineering manager had expected to buy new workstations for everyone, because "the computers are slow". The reference model showed that five of six seats performed alike and the sixth was slow mostly because of its settings. The money set aside for six workstations could instead fund one graphics card and the administrator's time. Conversely, the drawing sample showed a higher error rate than anyone had guessed, which justified spending the first quarter on templates and properties rather than on the macro that one designer had been keen to write.

Share the baseline with the whole office, not just the manager. People are more willing to accept controlled settings and new templates when they have seen the six-way settings table and the drawing sample for themselves. Present it as a description of the environment, not of anyone's performance: the point is that the system allowed the variation, not that individuals caused it.

## Exercise: read a repeat sample

Three months after the first template release, the administrator samples another 40 drawings made since the release and finds **3** with environment errors. What is the sample proportion? Can the office claim the error rate has fallen by two-thirds?

**Answer.** The sample proportion is **3 ÷ 40 = 7.5%**, against 22.5% before. The central estimate has fallen to a third of its former value. The Wilson interval for 3 in 40 at about 95% confidence runs from about **2.6% to 19.9%**. The two intervals overlap between about 12% and 20%, so a sample this size cannot by itself prove a two-thirds reduction.

The honest claim is that the evidence points strongly towards improvement and that the office should keep sampling. If the next quarter's sample also finds a low count, the combined evidence becomes much firmer. Report the result as "fewer errors found, consistent with a substantial reduction", not as a precise percentage improvement.
