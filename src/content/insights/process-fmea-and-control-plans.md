---
title: "Process FMEA and control plans: turning what could go wrong into controls that work on the floor"
description: "A process FMEA is useful only if it changes the process. How to analyse failure chains, rate and prioritise risk, prefer prevention to detection, and build a control plan people follow."
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

In many manufacturing businesses, the process failure mode and effects analysis is a spreadsheet produced for a customer approval, filed and rarely opened again. It lists dozens of failure modes, each with three numbers multiplied together, and a column of recommended actions that say "operator awareness" or "100% visual inspection". Meanwhile the problems that actually reach customers are often not in it at all, or are in it with a low score.

Used properly, the **process failure mode and effects analysis (PFMEA)** is one of the most practical tools a manufacturer has. It asks a cross-functional team to think systematically, before production starts or before a change is made, about how each step in a process could fail to do what it should, what that failure would mean for the next operation or the customer, why it could happen, and what currently prevents or detects it. The answers should change the process: a fixture redesigned so a part cannot be loaded backwards, a press that monitors force and distance, a supplier requirement tightened, a gauge added at the point of manufacture. The **control plan** then records the controls that result, so that the risk thinking becomes daily practice.

This article explains how a PFMEA is structured, how to analyse failure chains, how severity, occurrence and detection are rated, why simple risk priority numbers can mislead, how to choose actions that actually reduce risk, and how the control plan turns the analysis into routine. It is general information. Many customers, particularly in the automotive and related industries, specify a particular FMEA method and rating tables, and their requirements apply.

## What a PFMEA is for

A PFMEA is a structured, team-based analysis of the risks in a manufacturing or assembly process. Its purpose is not documentation. It is to find weaknesses while they are cheap to fix, which means before tooling is cut, equipment is bought and operators are trained. Once a process is running, changing it costs far more and meets more resistance.

A **design FMEA** applies the same thinking to a product design, asking how the design could fail to meet its function. The two connect: the design FMEA and the drawing identify which characteristics matter most, and the PFMEA asks how the process could fail to produce them.

The most useful PFMEAs share three features. They are done early, while the process can still change. They are done by a team including the people who will run, maintain and inspect the process, not by one quality engineer at a desk. And they are kept alive, revisited when the process changes and when problems occur.

## The structure of the analysis

Current industry practice, including the joint FMEA handbook published by the automotive industry bodies AIAG and VDA, sets out the analysis in a sequence of steps. A simplified version suitable for most manufacturers:

1. **Plan the scope**: which process, which product family, what boundaries, which team and when.
2. **Describe the structure**: list the process steps, ideally using the same step numbers as the process flow diagram, and the main elements of each step, such as machine, operator, material, method and environment.
3. **Describe the functions**: what each step must achieve, including the product characteristics it creates and the process settings that matter.
4. **Analyse failures**: for each function, how it could fail, what the effects would be and what could cause it.
5. **Analyse risk**: identify current prevention and detection controls and rate severity, occurrence and detection.
6. **Optimise**: decide and complete actions that reduce the risk, then re-rate.
7. **Document and communicate** the results, including updating the control plan and work instructions.

## Think in failure chains

The core of the analysis is a **failure chain** with three links:

- **Failure mode**: how the process step fails to do its job, such as "bearing not fully seated", "hole position out of tolerance" or "label applied to wrong carton".
- **Failure effect**: the consequence at the next operation, the final product, the customer or the end user. A bearing not fully seated might cause noise, early failure or, in some products, a safety issue.
- **Failure cause**: why the failure mode could occur, expressed as something that can be controlled. "Operator error" is not a useful cause. "Press stroke not set to the correct depth after changeover" or "debris in housing bore" are.

Keeping the three links distinct prevents a common muddle in which effects, modes and causes are mixed in one column. It also points to different controls: causes are addressed by prevention, while failure modes and causes can be caught by detection.

Good sources of failure modes include previous problems on similar processes, customer complaints, warranty returns, scrap records, maintenance logs and, above all, the experience of operators and setters. A walk along the actual process, asking people what goes wrong, usually finds more than a meeting room.

## Rating severity, occurrence and detection

Three ratings, each on a scale from 1 to 10, describe the risk:

| Rating | What it describes | Driven by |
|---|---|---|
| **Severity (S)** | How serious the worst likely effect is | The effect on the customer, product function, safety and regulatory compliance |
| **Occurrence (O)** | How likely the cause is to occur, given current prevention controls | Process history, robustness and the strength of prevention controls |
| **Detection (D)** | How likely current detection controls are to find the cause or failure mode before the product leaves the process | The type and reliability of detection |

Use defined rating tables, preferably those your customers require, so that ratings mean the same thing across different analyses. Severity is set by the effect and generally only changes if the design changes. Occurrence falls when prevention improves. Detection improves when detection becomes more reliable, earlier and less dependent on human attention.

Ratings at the top of the severity scale, usually 9 and 10, are reserved for effects that could affect safety or regulatory compliance. These deserve attention whatever the other ratings say.

## Why the risk priority number can mislead

The traditional **risk priority number (RPN)** multiplies the three ratings: S × O × D. It is simple, and many organisations set an RPN threshold above which action is required. It has well-known weaknesses:

- **Different risks get the same number.** A severity 10, occurrence 2, detection 5 failure has the same RPN (100) as a severity 2, occurrence 10, detection 5 failure. They are not equally important.
- **The ratings are rankings, not measurements**, so multiplying them has limited mathematical meaning.
- **Thresholds invite gaming.** When action is required above an RPN of, say, 100, ratings tend to drift down to 96, often by optimistic detection scores.
- **High-severity risks can hide.** A safety-related failure mode with a modest RPN may never be acted on.

Newer methods, including the **action priority** approach in the AIAG and VDA handbook, rank combinations of severity, occurrence and detection as high, medium or low priority using a table that gives most weight to severity, then occurrence, then detection. Whatever method you use, apply judgement: look first at high severity, then at causes likely to occur, and treat the score as a guide to discussion rather than a substitute for it.

## Choosing actions that reduce risk

Actions should be judged by how reliably they reduce risk, not by how quickly they can be written. A rough hierarchy, from strongest to weakest:

1. **Eliminate the cause by design**: change the product or process so the failure cannot occur, such as a part made symmetrical so orientation no longer matters.
2. **Prevent the cause with mistake-proofing**: fixtures that accept parts only in the correct orientation, sensors that stop a cycle if a component is missing, tools that cannot be used with the wrong setting.
3. **Reduce occurrence with robust processes**: controlled parameters, preventive maintenance, better materials, supplier controls.
4. **Detect automatically at the source**: in-station gauging or monitoring that stops or rejects the part before it moves on.
5. **Detect later by inspection**: downstream gauging or checks.
6. **Rely on people noticing**: visual inspection, awareness training and instructions.

"Operator training" and "100% visual inspection" are sometimes necessary, but they are the weakest controls and rarely justify a large reduction in ratings. Visual inspection of every part sounds thorough but typically misses a share of defects, particularly when defects are rare and inspection is repetitive. The [zero-defect manufacturing in a small factory](/insights/zero-defect-manufacturing-in-a-small-factory/) article covers mistake-proofing in more depth.

Every action needs an owner, a due date and evidence of completion. Once it is done, re-rate the risk based on what actually changed, not on what was intended.

## The control plan: making controls routine

A **control plan** is a structured summary of how each characteristic of the product and process is controlled during production. It is not a substitute for the PFMEA; it is what the PFMEA's conclusions look like on the shop floor. Typical columns include:

- **Process step** number and description, matching the process flow and PFMEA.
- **Machine, tool or fixture** used.
- **Characteristic**: product characteristics, such as a dimension, and process characteristics, such as a temperature or pressure.
- **Special characteristic** classification, where the customer or design has identified one.
- **Specification or tolerance.**
- **Evaluation or measurement method**: which gauge or test.
- **Sample size and frequency.**
- **Control method**: for example a control chart, first-off and last-off checks, a mistake-proofing device verified each shift, or automatic monitoring.
- **Reaction plan**: what to do if the characteristic is out of specification or the process is out of control.

Control plans are often prepared at three stages: prototype, pre-launch and production. The pre-launch plan typically includes extra checks that are relaxed once the process has proven itself.

## Reaction plans deserve care

The reaction plan column is where many control plans are weakest. "Notify supervisor" or "adjust process" says little. A useful reaction plan answers:

- **What happens to the product?** Stop, segregate and check back to the last known good part, with a defined method for identifying suspect stock.
- **What happens to the process?** Stop, check specified causes, correct, and verify with a first-off before restarting.
- **Who must be told**, and when does it escalate?
- **How is it recorded**, so the PFMEA can be updated if a new cause appears?

Mistake-proofing devices also need a reaction plan and a routine check, such as running a deliberately faulty test part at the start of each shift to confirm the device still works. An undetected failed sensor quietly turns a strong control into no control at all.

## Keep the documents consistent

The process flow diagram, PFMEA, control plan and work instructions describe the same process from different angles, and customers and auditors check that they agree. Use the same step numbers and names throughout. Trace each special characteristic from the drawing through the PFMEA, where its risks are assessed, into the control plan, where it is controlled, and into the work instruction, where the operator sees what to do. A mismatch, such as a step in the control plan that is missing from the PFMEA, often points to a real gap in thinking, not just in paperwork. The [PPAP for small suppliers](/insights/ppap-for-small-suppliers/) article explains how customers review this consistency.

## Keep it alive

A PFMEA should be revisited when:

- The process, equipment, materials, supplier or product design changes.
- A customer complaint, internal failure or near miss reveals a failure mode or cause that was missing or underrated.
- Data show that occurrence or detection ratings were optimistic.
- A similar process elsewhere in the business learns something new.

Many manufacturers keep a **foundation or family PFMEA** for common process types, such as machining, welding, pressing or assembly, and use it as a starting point for each new part. This captures lessons once and reuses them, as long as each new analysis still examines what is specific to the new part.

## A worked example

This is an illustrative example. A 40-person business assembles industrial ventilation fans. One process step presses a bearing into a cast aluminium housing. Field returns show a small number of fans with noisy, early-failing bearings.

**Failure chain.** The team, which includes the assembly lead, a setter, the maintenance technician and the quality engineer, records the failure mode as "bearing not fully seated in housing". The effect is bearing noise and premature failure in service, leading to a warranty claim. The causes identified are the press stop not reset after a changeover between fan sizes, debris in the housing bore, and housing bores at the small end of tolerance from the supplier.

**Initial ratings.** Severity is rated 7: the fan loses performance and fails early, but there is no safety effect. For the changeover cause, occurrence is rated 5 because changeovers happen several times a week and rely on the setter remembering the stop position. Detection is rated 7 because the only check is a visual inspection of the bearing face at final assembly, which cannot see a small gap reliably. The RPN is 245.

**Actions.** The team chooses actions from the stronger end of the hierarchy:

- The press is fitted with a force and distance monitor that compares each pressing against an acceptable window and automatically rejects any pressing outside it.
- Each fan size gets its own pressing program, selected by scanning the job card, so the stop position no longer depends on memory.
- A compressed-air blow-off and a simple bore cleanliness check are added before pressing.
- The housing supplier is given a tighter control requirement on the bore, with capability evidence requested.

**Re-rating.** With program selection by scan, occurrence for the changeover cause falls to 2. With automatic monitoring rejecting incorrect pressings in the station, detection falls to 3. The RPN becomes 42. Severity remains 7, because the effect of the failure has not changed.

**Control plan.** The control plan for the pressing step now lists the force and distance window as a process characteristic, the monitor as the control method, 100% automatic checking as the frequency, and a reaction plan: rejected parts go to a red bin, the setter checks the program, the bore and the press, and three consecutive good pressings are required before production resumes. A known-bad test housing is pressed at the start of each shift to verify the monitor rejects it.

**Result.** Over the following six months, no further field returns are traced to bearing seating, and the monitor records show which shifts and fan sizes produce the most rejects, giving the team its next improvement target.

## Applying this in an Australian manufacturing business

- **Do the PFMEA early**, while the process can still change.
- **Build a cross-functional team** that includes operators, setters and maintenance.
- **Write clear failure chains**: mode, effect and a controllable cause.
- **Use consistent rating tables**, ideally your customers'.
- **Do not let RPN thresholds drive the decision**; look at severity first.
- **Prefer elimination and mistake-proofing** over inspection and training.
- **Write specific reaction plans**, and verify mistake-proofing devices routinely.
- **Keep the flow diagram, PFMEA, control plan and instructions consistent.**
- **Update the PFMEA** after changes and after every significant problem.

## Where PFMEAs go wrong

- **Completed after the process is fixed**, purely for a customer submission.
- **Written by one person** without the people who run the process.
- **Causes listed as "operator error".**
- **Detection ratings that assume inspection is perfect.**
- **Actions that only add inspection or training.**
- **Control plans with vague reaction plans.**
- **Documents that never change** despite complaints and process changes.

## Questions to ask about your process risk analysis

- When did our PFMEA last change, and what triggered the change?
- Do our recent customer complaints appear in it, with realistic ratings?
- Which high-severity failure modes rely only on people noticing?
- Are our mistake-proofing devices checked to confirm they still work?
- Do our control plan reaction plans tell people exactly what to do with suspect product?
- Do the process flow, PFMEA, control plan and work instructions use the same steps?
- Who on the shop floor contributed to the analysis?

## Bringing it together

A process FMEA earns its place when it changes the process. Analyse each step as a chain of failure mode, effect and controllable cause, rate the risk with consistent tables, and look beyond the risk priority number to severity and the strength of the controls. Choose actions from the strong end of the hierarchy: eliminate, mistake-proof and monitor automatically before relying on inspection and training. Then carry the results into a control plan with specific reaction plans, keep all the process documents consistent and revisit the analysis whenever the process changes or a problem occurs. Done this way, the PFMEA stops being paperwork for a customer and becomes the way the business learns to prevent its own failures.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® manufacturing handbooks on FMEA for manufacturing risk analysis, PPAP PFMEA assessment and control plan assessment. The worked example is illustrative. This article is general information; follow your customers' specific FMEA and control plan requirements.*
