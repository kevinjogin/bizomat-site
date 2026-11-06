---
title: "Proving a process is ready for production: measurement, stability, capability and PPAP-style evidence"
description: "Why good samples do not prove a process is ready to scale, and how measurement checks, control charts, capability indices and a traceable evidence chain show it can repeat."
publishDate: 2026-10-04
category: "Products"
tags:
  - manufacturing
  - validation
  - process-improvement
author: "BIZOMAT"
featured: false
draft: false
---

A new part has been made, measured and approved. The samples were good, the customer is happy and the order is coming. It is tempting to treat that as proof the process is ready. Often it is not. Samples made by the most experienced operator, on a freshly set-up machine, with an engineer standing beside it and every part measured twice, show what the process can do under ideal attention. They do not show what it will do on a Tuesday night shift, with a different batch of material and a tool halfway through its life.

The gap between "we made good parts" and "we can make good parts every time" is where launch problems live: scrap, rework, late deliveries, sorting at the customer's site and lost trust. Industries that cannot afford those problems, such as automotive, aerospace, medical devices and defence, have developed structured ways to prove readiness before production scales. The best known in automotive supply is the **Production Part Approval Process (PPAP)**, a standard package of evidence that a supplier's process can consistently produce parts meeting the customer's requirements at the intended production rate.

You do not need to supply car makers to benefit from the thinking behind it. This article explains the evidence that genuinely shows a process is ready: a trustworthy measurement system, a stable process, adequate capability under real production conditions, a clear reaction plan and a traceable chain linking each critical requirement to how it is controlled. It also explains why a complete stack of documents is not the same as a coherent proof.

## Good samples are not proof of capability

Prototype success and production capability are different achievements. A process can produce acceptable samples while remaining sensitive to material variation, temperature, tool wear, machine condition or operator technique. Short runs under close attention hide these sensitivities. The question that matters is whether the process can repeatedly produce parts within requirements under the normal variation of everyday production, with an adequate margin to spare.

Answering that question needs several kinds of evidence, assessed in the right order. If the measurement system is unreliable, nothing measured with it can be trusted. If the process is unstable, capability figures calculated from it are misleading. If capability data came from an engineering run, it may overstate routine performance. And even a capable process will eventually drift, so you need to know what happens when it does.

## Step 1: Trust the measurement system first

Every conclusion about a process depends on measurements, and measurements have their own variation. If a gauge gives slightly different readings each time the same part is measured, or two inspectors measure the same part differently, some of the variation you see is measurement variation, not process variation.

**Measurement system analysis (MSA)** is the general term for checking whether a measurement method is adequate for its purpose. A common study, often called **gauge repeatability and reproducibility (gauge R&R)**, has several people measure the same set of parts several times, then separates:

- **Repeatability**: variation when the same person measures the same part with the same gauge.
- **Reproducibility**: variation between different people or setups.

Check also that the gauge has enough **resolution** (it can detect differences much smaller than the tolerance), is **calibrated**, and that everyone measures the characteristic the same way: where on the part, at what temperature, with what fixture.

Effort should match risk. A critical bore diameter on a safety part deserves a careful study. A non-critical cosmetic dimension may not.

## Step 2: Show the process is stable

A process is **stable**, or in statistical control, when its variation comes only from the many small, routine causes always present, called **common causes**, rather than from unusual, identifiable events, called **special causes**, such as a worn tool, a wrong material or a setting change.

**Statistical process control (SPC)** uses **control charts** to tell the two apart. Samples are measured at regular intervals and plotted against **control limits** calculated from the process's own natural variation, typically about three standard deviations either side of the average. Points outside the limits, or non-random patterns such as long runs on one side of the average or steady trends, suggest a special cause worth investigating.

Two important distinctions:

- **Control limits are not specification limits.** Control limits describe what the process actually does. Specification limits describe what the customer requires. A process can be stable but produce parts outside specification, or unstable while still inside specification for now.
- **Stability comes before capability.** Capability indices assume a predictable process. If the process is shifting or trending, a capability figure describes a moment, not a reliable future.

## Step 3: Measure capability with an adequate margin

**Process capability** compares the spread of a stable process with the width of the specification. Two common indices are:

- **Cp**: the specification width divided by six standard deviations of the process. It shows how well the process spread would fit if it were perfectly centred.
- **Cpk**: the distance from the process average to the nearest specification limit, divided by three standard deviations. It accounts for centring, so it is always equal to or less than Cp.

A Cpk of 1.0 means the nearest specification limit sits three standard deviations from the average, so a small but steady proportion of parts falls outside. Higher values mean more margin. Many customers require minimum values for critical characteristics, and requirements for new processes are often stricter than for established ones. The exact thresholds, and whether short-term indices (often written Pp and Ppk) or long-term indices are required, depend on the customer and industry, so always check the current customer-specific requirements.

## A worked example

This is an illustration. A small machining business is preparing to supply a shaft with a bearing diameter specified as 10.00 mm ± 0.05 mm, so the specification runs from 9.95 mm to 10.05 mm. The customer asks for evidence of capability before releasing a volume order.

**Measurement first.** A gauge study shows the measurement system has a standard deviation of about 0.004 mm, small relative to the 0.10 mm tolerance, so the gauge is judged adequate.

**Stability.** The shop machines 125 parts over several days, sampling five parts every hour across two shifts and two bar stock batches. The control charts show no points outside the limits and no trends, so the process is treated as stable.

**Capability.** The measured average is 10.012 mm and the overall standard deviation is 0.009 mm.

- Cp = (10.05 − 9.95) ÷ (6 × 0.009) = 0.10 ÷ 0.054 ≈ 1.85.
- Distance to the upper limit: 10.05 − 10.012 = 0.038 mm. Divided by 3 × 0.009 = 0.027, this gives about 1.41.
- Distance to the lower limit: 10.012 − 9.95 = 0.062 mm. Divided by 0.027, this gives about 2.30.
- Cpk is the smaller of the two, about 1.41.

The spread of the process is good (Cp about 1.85), but it runs high, so most of the risk sits at the upper limit. A Cpk of about 1.41 corresponds roughly to the upper limit sitting 4.2 standard deviations from the average, which in a stable, normally distributed process implies only a small number of oversize parts per million.

The fix is simple: adjust the tool offset to centre the process at 10.000 mm. With the same spread, Cpk would rise to 0.05 ÷ 0.027 ≈ 1.85, matching Cp. After the adjustment, a further run confirms the new average and the result.

```figure
type: range
title: A 10.00 ± 0.05 mm bearing diameter
unit: mm
min: 9.94
max: 10.06
caption: Process spread is ±3 × 0.009 mm. Cp is about 1.85; Cpk is about 1.41 as found, rising to about 1.85 once centred.
- Specification | 9.95 | 10.05
- Process as found, average 10.012 | 9.985 | 10.039 | runs high
- *Process centred at 10.000 | 9.973 | 10.027
```

**Measurement's influence.** The observed standard deviation of 0.009 mm includes the gauge's 0.004 mm. Because variances add, the process's own standard deviation is about √(0.009² − 0.004²) = √(0.000065) ≈ 0.0081 mm. The process is slightly better than the raw data suggests. Had the gauge been much worse, it could have made a good process look marginal, or hidden real problems.

**Reaction plan.** The shop agrees with the operators that if a control chart shows a point beyond the limits or a run of seven points above the average, they stop, check the tool and the last parts made, quarantine any suspect parts, record the cause and restart only once the supervisor signs off.

## Step 4: Use evidence from real production conditions

Capability evidence should come from the conditions customers will actually receive parts from: the intended tooling, materials, machines, operators, cycle times and production rates. Evidence gathered during an engineering run, with skilled specialists making constant adjustments, tends to overstate routine performance.

Waiting for perfect long-run data is not always practical before a launch. A sensible compromise is a staged launch: begin with the evidence available, apply heightened controls such as extra inspection or more frequent sampling, and remove them only when production data confirms capability. Be careful that temporary controls do not quietly become permanent because nobody fixed the underlying causes.

## Step 5: Define what happens when the process drifts

Even a capable process will eventually change: tools wear, materials vary and machines age. A **reaction plan** sets out, before it is needed:

- What signal triggers action (a control chart rule, a failed check, a customer complaint).
- Who acts, and what they do first.
- How suspect product is identified and contained.
- How the cause is investigated.
- What evidence is needed before production restarts, and who authorises it.

Triggers should be statistically sound. Reacting to normal variation by constantly adjusting the process, sometimes called **tampering**, makes it less stable, not more.

## Make the evidence tell one coherent story

Readiness frameworks such as PPAP require a set of documents. In automotive supply these typically include design records, a process flow diagram, failure mode and effects analyses (FMEAs) that identify how the design and process could fail, a control plan describing how each characteristic will be controlled, measurement system studies, dimensional and material test results, initial process capability studies, and a formal submission warrant signed by the supplier. The required elements and submission levels are set by the industry framework and each customer's specific requirements, which should be checked at the time.

A complete package can still be weak if the documents do not agree with each other. The strongest test is **traceability**: pick a critical characteristic and follow it through every document.

| Evidence | What to check for the bearing diameter |
|---|---|
| Design record | Specified as 10.00 ± 0.05 mm and marked as critical |
| Process flow | The turning operation that creates it is shown |
| Process FMEA | Failure modes such as tool wear and wrong offset are identified, with causes and controls |
| Control plan | The characteristic, gauge, sample size, frequency and reaction plan are listed |
| Measurement study | The gauge in the control plan is the one that was studied |
| Capability study | Data came from the turning operation under production conditions |
| Reaction plan | Operators know what to do and have authority to stop |

```figure
type: steps
title: One coherent story for a critical characteristic
caption: Each piece of evidence must refer to the same characteristic, operation and gauge.
- Design record | 10.00 ± 0.05 mm, marked critical
- Process flow | the turning operation shown
- Process FMEA | tool wear and wrong offset covered
- Control plan | gauge, sample, frequency, reaction
- Measurement study | of the gauge in the control plan
- Capability study | under production conditions
- *Reaction plan | operators may stop the process
```

If the characteristic is critical on the drawing but missing from the control plan, or the control plan specifies a gauge that was never studied, the package has a gap, however complete it looks.

## Reopen the evidence when things change

Readiness evidence describes a specific combination of design, tooling, material, process and location. Engineering changes, new suppliers, tool replacements, process changes or a move to another machine or site can invalidate parts of it. Change control should identify which evidence must be refreshed and whether the customer must be notified or approve the change, which many customers require. Treat readiness as something maintained throughout a product's life, not a file archived at launch.

## How this applies to a small Australian manufacturer

Small manufacturers supplying automotive, aerospace, rail, defence, mining equipment or medical customers may be asked for formal readiness evidence, such as PPAP packages or first article inspection reports. Aerospace, for example, commonly uses a standardised first article inspection format. Even where customers do not require it, a lightweight readiness pack reduces launch risk and builds credibility:

- A drawing with critical characteristics clearly marked.
- A simple process flow.
- A short risk review of how each critical characteristic could go wrong.
- A control plan listing what is checked, how, how often and what happens if it fails.
- A basic gauge check for critical measurements.
- Capability data from a realistic production run.
- A reaction plan the operators understand.

This need not be elaborate. A spreadsheet-based control chart and a one-page control plan for each critical part number are often enough to change how a small shop launches new work. The article on [experimenting before you standardise](/reados/collections/product-development-and-launch/designed-experiments-before-standardising/) explains how to find robust settings before collecting capability data, and the article on [zero-defect manufacturing in a small factory](/reados/collections/manufacturing-quality/zero-defect-manufacturing-in-a-small-factory/) covers prevention more broadly.

## Common mistakes

- **Treating good samples as proof** of production capability.
- **Calculating capability from an unstable process**, producing numbers that describe nothing reliable.
- **Ignoring measurement variation**, which can make good processes look poor or hide real problems.
- **Confusing control limits with specification limits.**
- **Collecting data during an engineering run** rather than under normal production conditions.
- **Relying on end-of-line inspection** instead of controlling the process upstream.
- **Assembling documents that do not agree**, so the package is complete but incoherent.
- **Letting temporary containment become permanent.**
- **Changing the process without refreshing the evidence** or telling the customer.

## Questions to ask

- Can we measure each critical characteristic reliably, and have we checked?
- Do our control charts show a stable process, or are special causes still active?
- Is our capability margin adequate for the customer's requirements, and is the process centred?
- Were the data collected under true production conditions?
- Can we trace each critical characteristic through the drawing, process flow, risk analysis, control plan, measurement study and capability evidence?
- What happens, and who decides, when a control signal shows the process has changed?
- Which temporary controls are at risk of becoming permanent?
- Which future changes would require us to refresh the evidence or notify the customer?

## Bringing it together

A few good parts do not prove a process is ready to scale. Readiness rests on a chain of evidence: a measurement system you can trust, a stable process, capability with an adequate margin under real production conditions, and a reaction plan for when the process drifts. Frameworks such as PPAP formalise that chain, but their real value lies in coherence: every critical requirement should be traceable from the drawing through the risk analysis, control plan, measurement and capability evidence. Small manufacturers can apply the same discipline with simple tools, and keep it current as designs, tools and processes change. Scale should follow demonstrated capability, not optimism.

---

*Source: BIZOMAT notes. Figures in this article are illustrations, not data. Check current industry and customer-specific requirements for any formal approval process.*
