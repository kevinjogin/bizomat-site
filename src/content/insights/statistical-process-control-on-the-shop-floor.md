---
title: "Statistical process control on the shop floor: control charts, real signals and when to leave a process alone"
description: "Control charts separate the normal noise of a process from real change. How to choose a chart, set limits, read the signals and stop well-meant adjustments that make variation worse."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - quality
  - manufacturing
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

Every manufacturing process varies. Two shafts turned on the same lathe, minutes apart, by the same operator, will not have exactly the same diameter. The tool wears a little, the material differs slightly, the spindle warms, the coolant temperature moves. Most of the time these influences are small and random, and the parts stay comfortably within tolerance. Occasionally something changes: a tool chips, a new batch of material behaves differently, a setting is knocked. The difficulty on a busy shop floor is telling the two apart quickly, from a handful of measurements, before a pallet of bad parts has been made.

**Statistical process control (SPC)** is a set of simple methods for doing exactly that. Its central tool, the **control chart**, plots measurements over time against limits calculated from the process's own natural variation. Points inside the limits, with no unusual pattern, suggest the process is behaving as it normally does and should be left alone. Points outside the limits, or certain patterns, signal that something has changed and deserves a response. The idea was developed in the 1920s and remains one of the most useful quality tools available to a manufacturer of any size.

This article explains the thinking behind control charts, how to choose and set one up, how to read its signals, the difference between control limits and specification limits, how SPC relates to process capability, and how to make charts part of daily work rather than wall decoration. It is written for owners, supervisors, quality staff and engineers in small and medium manufacturing businesses. It is general information; where customers specify particular charting or capability requirements, their requirements apply.

## Two kinds of variation

The foundation of SPC is a distinction between two kinds of variation.

- **Common-cause variation** is the background noise built into the process as it is currently designed and run: many small influences, none dominant, that together produce a predictable spread. A process showing only common-cause variation is called **stable** or **in statistical control**. Its future behaviour can be predicted within limits.
- **Special-cause variation** comes from a specific, identifiable change that is not part of the normal process: a broken tool, a wrong material, a new operator who has not been trained, a fixture that has moved. Special causes make the process unpredictable.

The two require completely different responses. A special cause should be found and removed, usually by the people running the process, and as close to the moment it occurred as possible. Common-cause variation cannot be reduced by reacting to individual parts. It can only be reduced by changing the process itself: better fixturing, a more capable machine, tighter material specifications, a different method. That is usually a management and engineering decision, not an operator's.

Confusing the two causes two expensive mistakes. Treating common-cause noise as if each high or low part had a special cause leads to constant adjustment, which, as explained below, increases variation. Treating a genuine special cause as normal noise lets a problem run until it produces scrap or a customer complaint. A control chart exists to reduce both mistakes.

## How a control chart works

A control chart has three horizontal lines and a series of plotted points in time order:

- **The centre line**, usually the average of the plotted values.
- **The upper control limit (UCL)** and **lower control limit (LCL)**, typically set three standard deviations of the plotted statistic above and below the centre line.

The limits are calculated from the process's own data, not from the drawing. For a stable process following a roughly normal distribution, about 99.7% of points fall within three standard deviations of the average. A point outside the limits is therefore unlikely to be noise and is a reasonable signal to investigate. Three-sigma limits are a deliberate compromise: wide enough that false alarms are rare, narrow enough that real changes are caught reasonably quickly.

## Control limits are not specification limits

This is the most important distinction in SPC, and the most often confused.

| | Specification limits | Control limits |
|---|---|---|
| **Where they come from** | The drawing, customer or design | The process's own measured variation |
| **What they describe** | What the product must be | What the process actually does |
| **Who sets them** | Designers, customers, standards | Calculated from data |
| **What a breach means** | The part is nonconforming | The process has probably changed |
| **Where they appear** | On individual measurements | Usually on averages or ranges of small samples |

A process can be in control but produce parts outside specification, because its normal spread is wider than the tolerance. Equally, a process can be out of control while every part is still within specification, because the change has not yet pushed parts over the limit. The chart answers "has the process changed?", while the specification answers "is this part acceptable?". Both questions matter, and they must not be merged. Never draw specification limits on a chart of subgroup averages: averages vary less than individual parts, so the comparison is misleading.

## Choosing the right chart

The right chart depends on the kind of data and how it is collected.

| Data | Typical chart | When to use it |
|---|---|---|
| Measurements in small subgroups, such as five parts each hour | **Average and range (X̄ and R) chart** | The most common choice for machined, moulded or pressed parts where several parts can be measured together |
| Single measurements, such as one test per batch | **Individuals and moving range (I-MR) chart** | Slow processes, batch chemistry, daily or weekly measures |
| Proportion of defective items in samples | **p chart** | Pass or fail inspection with varying sample sizes |
| Count of defects per unit or area | **c or u chart** | Blemishes per panel, errors per document, defects per assembly |

**Variables data**, actual measured values, carry much more information than **attributes data**, simple pass or fail results. A measurement shows how close a part was to the limit; a pass shows only that it was not over. Where you can measure, measure.

## Rational subgroups

For average and range charts, each plotted point summarises a small **subgroup** of parts, often three to five. The subgroup should be chosen so that variation within it represents only short-term, common-cause variation, and differences between subgroups reveal changes over time. In practice, that usually means consecutive parts from the same machine, tool, cavity and operator, taken at regular intervals.

Poor subgrouping undermines the chart. Mixing parts from two machines or several mould cavities in one subgroup inflates the within-subgroup range, widens the limits and hides real differences. If the machines or cavities differ, chart them separately, or design the subgroups so the difference can be seen.

## Setting up an average and range chart

A practical sequence:

1. **Choose the characteristic.** Chart characteristics that matter to function, safety or the customer, or that are early indicators of trouble. Charting everything wastes effort and buries the important signals.
2. **Check the measurement system.** If the gauge's own variation is a large share of the tolerance, the chart will show measurement noise rather than process behaviour. Confirm the gauge is adequate first.
3. **Collect initial data.** Gather at least 20 to 25 subgroups under normal operating conditions.
4. **Calculate the centre lines.** Average each subgroup, then average those averages to get the centre line of the averages chart. Calculate each subgroup's range and average them to get the average range, R̄.
5. **Calculate the limits** using standard constants that depend on subgroup size. For subgroups of five, the averages chart limits are the centre line plus or minus 0.577 × R̄, and the range chart upper limit is 2.114 × R̄ (with a lower limit of zero).
6. **Review the initial data.** Investigate any points outside the limits. If a special cause is found and removed, recalculate the limits without those subgroups.
7. **Use the limits going forward** and plot new subgroups as they are measured.

For single measurements, the individuals chart limits are the average plus or minus 2.66 times the average moving range, where a moving range is the difference between each measurement and the previous one. The moving range chart's upper limit is 3.267 times the average moving range.

The constants come from statistical tables found in any quality engineering reference. Software calculates them automatically, but understanding where they come from helps people trust the chart.

## Reading the signals

A point outside the control limits is the clearest signal. Patterns inside the limits can also indicate change. Commonly used rules include:

- **One point beyond three standard deviations** from the centre line.
- **Two of three consecutive points** beyond two standard deviations on the same side.
- **Four of five consecutive points** beyond one standard deviation on the same side.
- **Eight or more consecutive points** on the same side of the centre line, suggesting a shift.
- **Six or more points steadily rising or falling**, suggesting a trend such as tool wear or drift.

Each additional rule catches certain changes sooner but increases false alarms. Many shops use the first rule plus one or two others that fit their process, such as the run rule for detecting shifts. Write down which rules apply, so everyone reacts to the same signals.

Some patterns are informative even without a formal rule. A sawtooth pattern may reveal regular tool changes. Points hugging the centre line suspiciously closely may mean the subgroups mix different sources of variation, or that someone is adjusting the data. Cycles may match shifts, operators or temperatures.

## The cost of over-adjustment

One of the most valuable lessons of SPC is counterintuitive: adjusting a stable process in response to individual results makes it worse.

Suppose a stable process is centred on target but each part varies randomly. An operator measures a part that is slightly high and moves the tool offset down by the same amount. The next part's random variation is independent of the last, so the adjustment has simply moved the whole process off centre. The next correction moves it again. Over many cycles, this habit, often called **tampering**, increases the spread of the output, in theory by a large margin. The operator is working hard, with good intentions, and making the product less consistent.

A control chart gives a clear rule instead: adjust when the chart signals, not whenever a single part looks off. That rule alone often reduces variation noticeably, at no cost, simply by removing well-meant over-correction.

## A reaction plan for every chart

A chart without a defined response is decoration. For each chart, write a short **reaction plan** that says:

- **What to do immediately** when a signal occurs: stop, check the last parts, quarantine back to the last good subgroup, or continue with closer monitoring.
- **What to check first**: tool condition, material batch, settings, fixture, gauge.
- **Who to call** if the cause is not obvious.
- **How to record** the signal, the cause found and the action taken, ideally directly on the chart.

Annotations on the chart turn it into a history of the process. Over time, they show which causes recur and which improvements worked.

## SPC and process capability

Control and capability answer different questions. A control chart shows whether the process is predictable. **Process capability** shows whether that predictable output fits the specification.

Two common capability indices:

- **Cp** compares the tolerance width with the process spread: (upper specification limit − lower specification limit) ÷ (6 × standard deviation). It shows what the process could achieve if perfectly centred.
- **Cpk** takes centring into account: the smaller of (upper limit − average) ÷ (3 × standard deviation) and (average − lower limit) ÷ (3 × standard deviation).

A Cpk of 1.0 means the nearest specification limit is three standard deviations from the average. Many customers require higher values, often 1.33 or more, for important characteristics. Capability figures are only meaningful for a stable process: if the process is out of control, today's capability says little about tomorrow's. Establish stability first, then measure capability. When capability is poor, remember that centring and spread are different problems with different fixes: a centring problem may be solved by an adjustment, while a spread problem usually needs a process change.

## Making SPC part of daily work

Charts work when they are close to the process and owned by the people running it:

- **Keep charts at the machine**, paper or screen, where the operator can see them.
- **Train operators** to plot, read signals and follow the reaction plan.
- **Review charts briefly** at shift handovers or daily meetings, focusing on signals and their causes.
- **Retire charts** that never signal on characteristics that never cause trouble, and move the effort to where it matters.
- **Recalculate limits** after a deliberate process improvement, not routinely and not to make signals disappear.
- **Escalate common-cause problems** to engineering or management, because operators cannot fix them by adjustment.

The [proving a process is ready for production](/insights/proving-a-process-is-ready-for-production/) article covers using stability and capability evidence when launching a new process.

## A worked example

This is an illustrative example. A 25-person machining business turns steel shafts with a critical diameter of 25.000 mm ± 0.010 mm. The customer has started asking for capability evidence, and the business is scrapping or reworking a few percent of parts.

**Current practice.** Operators measure every tenth part and adjust the tool offset whenever a part is more than a couple of microns from 25.000 mm.

**Setting up the chart.** The quality lead checks that the micrometer used is adequate for the tolerance, then collects 25 subgroups of five consecutive shafts, one subgroup each hour. The centre line of the averages is 25.002 mm and the average range, R̄, is 0.010 mm. Using the constants for subgroups of five, the averages chart limits are 25.002 ± 0.577 × 0.010, which gives about 24.996 to 25.008 mm. The range chart upper limit is 2.114 × 0.010, about 0.021 mm.

**Reading the result.** The process is in control: no points outside the limits and no unusual patterns. But the estimated standard deviation, calculated as R̄ divided by the constant 2.326 for subgroups of five, is about 0.0043 mm. Cp is 0.020 ÷ (6 × 0.0043), about 0.78, and Cpk is about 0.62 because the process runs slightly high. The process is stable but not capable. More inspection will not fix that; the process must change.

**First change: stop tampering.** The team adopts a rule that the offset is adjusted only when the chart signals. After a month, the average range has fallen to about 0.007 mm, giving an estimated standard deviation of about 0.0030 mm. With the process centred on 25.000 mm, Cp and Cpk are both about 1.11.

**Second change: remove a known source.** Annotations on the chart show that most large ranges occur in the first hour after start-up. The team introduces a short warm-up cycle before production parts are run. The estimated standard deviation falls to about 0.0024 mm, and Cp and Cpk rise to about 1.39, above the customer's requirement of 1.33.

**Keeping it.** A reaction plan sits beside the chart: on a signal, the operator stops, checks the insert and the last subgroup, quarantines parts back to the last in-control subgroup if needed, and records the cause. The supervisor reviews the chart at each shift handover.

## Applying this in a small Australian manufacturer

- **Start with one or two characteristics** that matter most to customers or cause the most scrap.
- **Prove the gauge first**, then collect enough data to set honest limits.
- **Keep control limits and specification limits separate.**
- **Choose a few signal rules** and write them down.
- **Stop adjusting on single parts**; adjust on signals.
- **Write a reaction plan** for every chart and annotate causes.
- **Measure capability only once the process is stable.**
- **Escalate common-cause problems** to engineering or management.
- **Check customer requirements**, as many specify capability levels and charting methods.

## Where SPC goes wrong

- **Plotting charts nobody looks at**, or that sit in a drawer until an audit.
- **Drawing specification limits** on an averages chart.
- **Recalculating limits** every month so that signals vanish.
- **Mixing machines or cavities** in one subgroup.
- **Charting with an inadequate gauge.**
- **Reporting capability for an unstable process.**
- **Blaming operators** for variation built into the process.
- **Treating every point near a limit** as a reason to adjust.

## Questions for your next production review

- Which characteristics really need charting, and which charts could we retire?
- Is our process stable, capable, both or neither?
- How often do operators adjust, and on what basis?
- What does our reaction plan say, and was it followed at the last signal?
- Have we confirmed that our gauges can see the variation we are charting?
- Which recurring causes appear in our chart annotations?
- Who owns the common-cause improvements that operators cannot make?

## Bringing it together

A control chart answers a simple question every production team faces: has something changed, or is this normal? By separating common-cause noise from special-cause signals, it tells people when to act and, just as valuably, when to leave the process alone. Choose a chart that suits the data, build sensible subgroups, set limits from real process data, keep them separate from the specification and agree which signals trigger a response. Stop adjusting on single parts, attach a reaction plan to every chart and measure capability only once the process is stable. Used this way, SPC turns measurement from a record of what went wrong into an early warning that prevents it. For persistent problems that need a structured project rather than a chart, the [fixing a recurring problem with DMAIC](/insights/fixing-a-recurring-problem-with-dmaic/) article sets out a fuller method.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® manufacturing handbooks on the DMAIC control phase, process capability and manufacturing data analysis. The worked example is illustrative. This article is general information; follow your customers' specific quality requirements.*
