---
title: "The seven basic quality tools: what each one shows and how to use them together"
description: "Most quality problems can be diagnosed with simple tools and data you already have. How check sheets, Pareto charts, histograms, fishbones, scatter diagrams and control charts work together."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - quality
  - process-improvement
  - manufacturing
author: "KEVOS®"
featured: false
draft: false
---

Quality problems are rarely mysterious. Rejects, rework, complaints and delays usually leave a trail of evidence, in inspection records, job sheets, complaint logs and the experience of the people doing the work. The difficulty is that the evidence is scattered and unorganised, so discussions about causes rely on opinion and memory. Teams argue about what is happening, act on the loudest theory and are surprised when the problem returns.

In post-war Japan, the quality pioneer Kaoru Ishikawa championed a small set of simple tools that frontline teams could use to turn raw observations into understanding. They became known as the **seven basic quality tools**. They need no special software, only a pencil, paper or a spreadsheet, yet they underpin most structured problem solving, from shop-floor improvement to Six Sigma projects. Used together, they help a team define a problem, collect the right data, find where to focus, understand variation, identify likely causes, test relationships and confirm that fixes work.

This article explains each of the seven tools, what it reveals, how to build it and the common mistakes, and then shows how they work together on a real kind of problem. It is general information for supervisors, quality staff, engineers and managers in manufacturing, services and projects.

## The seven tools at a glance

| Tool | Question it answers |
|---|---|
| Flowchart or process map | How does the work actually flow, and where could problems arise? |
| Check sheet | What is happening, how often, where and when? |
| Pareto chart | Which few problems account for most of the impact? |
| Histogram | What does the variation look like compared with requirements? |
| Cause-and-effect diagram | What could be causing this problem? |
| Scatter diagram | Are two variables related? |
| Control chart | Is the process stable over time, or has something changed? |

Some lists include **stratification**, separating data by source, in place of the flowchart. Stratification is valuable whichever list is used, and it is covered below.

## 1. Flowcharts and process maps

A **flowchart** shows the steps of a process, decision points and the order of work. Drawing the process as it really happens, not as the procedure says, often reveals the problem directly: duplicated steps, unclear hand-offs, missing checks, rework loops and points where errors can enter.

How to use it: walk the process with the people who do it, record each step and decision, and mark where defects are found and where they are created. These are often far apart.

Common mistakes: mapping the ideal process from an office, and mapping in so much detail that the picture becomes unreadable.

## 2. Check sheets

A **check sheet** is a simple form for recording observations as they occur, usually as tally marks against categories. A good check sheet records not just what happened but also where and when, for example defect type by machine, shift and day.

How to use it: agree clear definitions of each category, so different people record the same thing in the same way. Keep the sheet simple and at the point where the work happens. Collect for long enough to capture normal variation, such as several weeks.

Common mistakes: vague categories, an "other" column that ends up holding most of the data, and collecting data nobody analyses.

## 3. Pareto charts

A **Pareto chart** is a bar chart of problem categories sorted from largest to smallest, usually with a line showing the cumulative percentage. It reflects the **Pareto principle**, popularised in quality by Joseph Juran: a small number of causes often account for most of the effect. The split is rarely exactly 80/20, but impact is usually uneven.

How to use it: rank categories by the measure that matters most, often cost or consequence rather than count. A rare defect that scraps an expensive assembly may matter more than a frequent cosmetic one. Focus improvement on the largest bars, then redraw the chart after improvements to see what has become the new largest problem.

Common mistakes: ranking by count when cost matters, and categories so broad, such as "operator error", that they hide the real causes.

## 4. Histograms

A **histogram** shows how often values fall into ranges, revealing the shape of variation in a measurement such as a dimension, a coating thickness, a cycle time or a delivery delay. Comparing the histogram with specification limits shows whether the process can meet requirements.

What shapes suggest:

- **A single, centred, narrow peak within limits**: a capable process.
- **A peak off-centre**: the process needs adjusting towards target.
- **A wide spread**: too much variation, needing reduction rather than adjustment.
- **Two peaks**: two different sources mixed together, such as two machines, operators, shifts or material batches.
- **A sharp cut-off at a limit**: out-of-specification items may have been sorted out or the data adjusted.

How to use it: collect enough values, typically at least 50 to 100, and choose range widths that show the shape without being too coarse or too fine.

## 5. Cause-and-effect diagrams

A **cause-and-effect diagram**, also called a fishbone or Ishikawa diagram, organises possible causes of a problem into categories branching from a spine that points to the effect. Common categories in manufacturing are machines, methods, materials, measurement, people and environment.

How to use it: state the effect precisely, such as "paint runs on panel edges", not "poor quality". Bring together people with different knowledge, including operators, maintenance, engineering and quality. Ask "why?" repeatedly along each branch. The value comes largely from the discussion.

Common mistakes: treating the finished diagram as proof. A fishbone lists possible causes; data and tests must confirm which ones matter.

## 6. Scatter diagrams

A **scatter diagram** plots pairs of values, such as oven temperature against coating defects or line speed against reject rate, to show whether two variables are related.

What to look for: an upward or downward pattern suggests a relationship; a cloud with no pattern suggests none. A curved pattern may show that a variable matters only above or below a certain point.

Common mistakes: assuming that correlation proves causation. Both variables may be driven by a third factor, such as season or batch. Confirm suspected causes by deliberately changing one factor and observing the result; the [designed experiments before standardising](/insights/designed-experiments-before-standardising/) article explains how to test several factors efficiently.

## 7. Control charts

A **control chart** plots a measure over time against a centre line and control limits calculated from the process's own natural variation. It distinguishes **common-cause variation**, the normal noise of a stable process, from **special-cause variation**, signals that something has changed.

How to use it: calculate limits from process data, not from specification limits. Investigate points outside the limits and non-random patterns, such as runs on one side of the centre line. Do not adjust a stable process in response to every point within the limits; reacting to noise, often called tampering, increases variation.

Control charts are also the best way to confirm that an improvement has worked and is being sustained. When a process genuinely changes for the better, recalculate the limits from the new data, so the chart reflects the improved process and can detect any slide back.

## Stratification

**Stratification** means separating data by its source: machine, shift, operator, supplier, product, customer or location. Many problems are invisible in combined data and obvious once it is separated. A reject rate that looks uniform overall may come almost entirely from one machine or one supplier. Build stratification into check sheets from the start by recording the likely sources of difference.

## Beyond the factory floor

The tools work just as well in offices, services and projects. A customer service team can use a check sheet to record complaint types by product and channel, a Pareto chart to find the few causes behind most complaints, and a control chart to track weekly complaint rates. An accounts team can map the invoice approval process to find where delays occur and use a histogram of approval times to show the spread. A project team can use cause-and-effect diagrams to explore why design changes keep arriving late and a scatter diagram to see whether late changes relate to the number of interfaces in a package. The principle is the same: replace anecdotes with organised evidence.

## Making data collection practical

Data collection succeeds when it is easy and trusted:

- **Collect at the point of work**, on a simple paper sheet, tablet form or existing system field, rather than reconstructing data later.
- **Keep it short**, collecting only what will be used.
- **Check that measurements are reliable**: if two inspectors measure the same part differently, the data will mislead. Simple repeatability checks on gauges and inspection judgements are worthwhile before relying on data.
- **Explain why the data is being collected** and share the results with the people who collect it, so they see it used rather than filed.
- **Use sampling** where measuring everything is impractical, making sure samples cover all shifts, machines and conditions.

## Using the tools together

The tools are most powerful as a sequence within a structured problem-solving method such as plan-do-check-act or DMAIC:

1. **Flowchart** the process to understand where the problem arises.
2. **Check sheet** to collect data, stratified by likely sources.
3. **Pareto chart** to choose the problem with the greatest impact.
4. **Histogram** to understand the variation behind it.
5. **Cause-and-effect diagram** to list possible causes.
6. **Scatter diagram** and simple tests to check suspected causes.
7. **Control chart** to confirm the fix and hold the gain.

The [fixing a recurring problem with DMAIC](/insights/fixing-a-recurring-problem-with-dmaic/) article sets out the wider method in which these tools sit.

## A worked example

This is an illustrative example. A sheet metal fabricator powder coats about 1,000 parts a week. Coating rejects are running at about 5.5%, causing rework, delays and customer complaints, and the coating supervisor and production manager disagree about the cause.

**Collecting the data.** For four weeks, the coating team records every reject on a check sheet by defect type, spray booth, shift and part family. There are 220 rejects from 4,000 parts.

**Pareto.** Ranking by count gives:

| Defect | Count | Cumulative share |
|---|---|---|
| Runs and sags | 92 | 41.8% |
| Orange peel texture | 48 | 63.6% |
| Contamination | 41 | 82.3% |
| Thin coverage | 23 | 92.7% |
| Other | 16 | 100.0% |

Three defect types account for about 82% of rejects. Because runs and orange peel both suggest excessive film thickness, the team starts there.

**Histogram.** Film thickness readings from 120 parts form two distinct peaks. Stratifying by spray booth shows that one booth consistently applies much thicker coatings than the other.

**Fishbone.** A cross-functional session lists possible causes of runs: gun settings, powder flow, operator technique, hanging angle, part geometry, oven temperature and humidity.

**Scatter diagram.** Plotting film thickness against the presence of runs shows runs appear mainly above a certain thickness. A short trial changing gun settings in the thicker booth confirms the effect.

**Actions.** Both booths' guns are calibrated, standard settings are documented for each part family, operators are trained on technique and a quick thickness check is added at the start of each shift. Contamination is tackled next, with improved cleaning of hooks and booth filters.

**Control chart.** Daily reject percentage is plotted on a control chart. Over the following two months, the average falls to about 2% and stays within new, narrower limits. The redrawn Pareto shows contamination is now the largest remaining problem, and the team moves on to it.

## Applying this in an Australian business

- **Map the real process** with the people who do the work.
- **Collect data on simple check sheets**, with clear categories and stratification.
- **Rank problems by impact** with Pareto charts, using cost where it matters.
- **Look at the shape of variation** with histograms.
- **Brainstorm causes widely**, then confirm them with data and tests.
- **Use control charts** to separate signals from noise and hold gains.
- **Redraw the Pareto** after each improvement.
- **Teach the tools to frontline teams**, not just specialists.

## Where quality tools go wrong

- **Opinions instead of data.**
- **Vague categories** and a large "other" column.
- **Counting defects** when cost or consequence matters more.
- **Treating fishbone diagrams as conclusions.**
- **Confusing correlation with causation.**
- **Adjusting stable processes** in response to noise.
- **Stopping after one improvement** instead of moving to the next problem.
- **Charts produced for reports** but never used to make decisions.

## Questions to ask about a quality problem

- Do we know how the process actually works?
- What data do we have, and is it separated by likely sources?
- Which few problems account for most of the impact?
- What does the variation look like against requirements?
- Which suspected causes have we confirmed with data?
- How will we know the fix has worked and stayed fixed?

## Bringing it together

The seven basic quality tools turn scattered evidence into understanding. Flowcharts show how work really happens, check sheets collect data where it occurs, Pareto charts show where to focus, histograms reveal the shape of variation, cause-and-effect diagrams organise possible causes, scatter diagrams test relationships and control charts separate real changes from noise. Combined with stratification and a structured improvement method, they let any team solve problems with evidence rather than opinion, and keep them solved.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® project and quality management study material on the seven tools of quality and the Pareto principle, together with established quality practice. The worked example is illustrative. This article is general information.*
