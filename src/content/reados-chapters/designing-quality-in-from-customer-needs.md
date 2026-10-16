---
title: "Designing quality in: turning the voice of the customer into critical-to-quality requirements"
description: "Customers say quiet, easy and reliable; factories need numbers and tolerances. How to translate needs into measurable requirements, link them to design and process drivers, and verify them."
publishDate: 2026-10-09
category: "Products"
tags:
  - product-development
  - quality
  - customers
author: "KEVOS®"
featured: false
draft: false
---

Customers describe what they want in their own words: the drawer should close quietly, the fitting should be easy to install, the pump should be reliable, the order should arrive when promised. Designers, engineers and factories work with something different: dimensions, materials, forces, tolerances, cycle counts and process settings. Somewhere between the two, the customer's meaning has to be translated into requirements that can be designed, made and checked. When that translation is weak, a business can build exactly what its drawings say and still disappoint its customers.

Much quality effort happens after a product is designed: inspection, process control, corrective action. Those matter, but they can only protect a design's intent. They cannot add what the design never captured. The cheapest point to build quality in is at the start, when customer needs are turned into measurable requirements, and those requirements are linked to the design features and process settings that drive them.

This article explains how to capture the **voice of the customer (VOC)**, how to distinguish the kinds of needs customers have, how to translate them into **critical-to-quality (CTQ)** requirements, how to trace those requirements to the design and process characteristics that control them, and how the DMADV approach, sometimes called design for Six Sigma, structures the work. It is general information for product businesses, manufacturers and service designers.

## Capture the voice of the customer

The voice of the customer is the collected evidence of what customers need, in their own words. Good sources include:

- **Direct conversation and observation**: interviews, site visits and watching people use, install or maintain the product.
- **Complaints, returns and warranty claims**, which show where current products fall short.
- **Service and installation records**, which reveal difficulties customers may not mention.
- **Sales and distributor feedback**, particularly reasons for lost sales.
- **Usage data**, where products or services generate it.
- **Requirements from regulations, standards and customer contracts**, which are needs too, even if no customer voices them.

Talk to all the relevant customers, not just the buyer. For an industrial product, that may include the purchaser, the installer, the operator, the maintainer and the person responsible for safety. Each has different needs, and the installer's frustration can lose a sale as surely as the buyer's price objection.

## Separate the need from the requested solution

Customers often express needs as solutions. "Make it out of stainless steel" may really mean "it must not corrode in a coastal environment for ten years". "Add a bigger handle" may mean "it must be easy to lift with gloves on". Translating back to the underlying need opens up better design options and prevents expensive features that do not address the real problem. A simple habit helps: for each statement, ask what problem it solves for the customer and how they would judge whether it had been solved.

## Not all needs are equal

The **Kano model**, developed by Noriaki Kano, classifies customer needs by how they affect satisfaction:

| Type | Effect on satisfaction | Example for a kitchen drawer runner |
|---|---|---|
| **Basic** | Expected; absence causes strong dissatisfaction, presence earns no praise | Drawer runs smoothly without scraping |
| **Performance** | More is better, roughly in proportion | Quieter close, higher load capacity |
| **Delighters** | Unexpected; presence delights, absence goes unnoticed | Tool-free height adjustment |

Two points follow. Basic needs are rarely mentioned because customers assume them, so research must look for them deliberately, often through complaints and observation. And needs move over time: yesterday's delighter, such as soft-close drawers, becomes today's basic expectation.

## Translate needs into critical-to-quality requirements

A **critical-to-quality (CTQ) requirement** is a measurable characteristic of the product or service that represents a customer need, with a target and acceptable limits. The translation chain:

1. **Capture the voice**: the customer's statement.
2. **Clarify the need**: the outcome the customer wants.
3. **Define the measure**: a characteristic that can be measured or tested.
4. **Set the target and limits**: what performance is acceptable.
5. **Identify the drivers**: the design and process characteristics that influence the measure.
6. **Verify and validate**: confirm the product meets the requirement, and that the requirement really represents the need.

| Customer statement | Underlying need | Possible CTQ | Typical drivers |
|---|---|---|---|
| "It must be easy to assemble." | Low effort, no forcing, no errors | Insertion force; assembly time; first-time assembly rate | Clearances, spring dimensions, lead-in features, fixture alignment |
| "It must be reliable." | Consistent function over its life | Cycle life; failure rate; leakage limit | Material, stress levels, process capability, test method |
| "It must arrive when promised." | Delivery reliability | On-time-in-full rate | Flow, capacity, changeovers, supplier reliability |

A **CTQ tree** is a useful way to organise the translation, starting from a broad need at the top, branching into more specific needs, and ending in measurable requirements at the bottom. It keeps the link between each requirement and the customer need it serves, which matters later when someone proposes relaxing a requirement to save cost.

## Make every requirement measurable

A CTQ needs an **operational definition**: a precise statement of what is measured, how, under what conditions and with what equipment. "Quiet" becomes, for example, a sound level measured at a stated distance and position under defined conditions. "Easy to install" becomes installation time by a trained installer with standard tools, and the share of first-time installations without adjustment. Without an operational definition, two people can test the same product and reach different conclusions.

Set targets and limits from evidence: customer research, competitor benchmarks, regulatory requirements and the consequences of falling short. Avoid limits copied from a previous product without asking whether they still fit.

## Link requirements to design and process drivers

A product's performance on each CTQ depends on design characteristics, and those in turn depend on process characteristics. This chain is sometimes written as **Y = f(x)**: the output (Y) is a function of the inputs (x). For each CTQ:

- **Identify the design characteristics** that influence it, such as dimensions, materials, clearances and component specifications.
- **Understand the relationship**, through engineering analysis, prior data or experiments: which inputs matter most, and how sensitive the output is to them.
- **Identify the process characteristics** that control those design characteristics, such as moulding temperature, torque settings or supplier processes.
- **Mark the critical links** as special characteristics on drawings and in process documents, so they receive appropriate control.

**Quality function deployment (QFD)**, often visualised as a "house of quality", is a structured matrix method for this translation. It relates customer needs to technical characteristics, records the strength of each relationship and helps prioritise. It can be valuable for complex products; for simpler ones, a CTQ tree and a short table linking requirements to drivers often does the job.

## Design for capability, not just function

A design can work perfectly at nominal dimensions and still fail in production, because real parts vary. Two practices reduce this risk:

- **Set tolerances with process capability in mind.** Before finalising a tolerance on a critical characteristic, ask what the intended process can actually achieve. A tolerance tighter than the process can hold guarantees scrap, inspection or disputes. Where possible, choose designs that tolerate more variation.
- **Design for robustness.** A robust design keeps performing despite variation in materials, manufacturing, environment and use. Testing designs deliberately against those sources of variation, called noise factors, reveals settings where performance is least sensitive to them. The [experiment before you standardise](/reados/collections/product-development-and-launch/designed-experiments-before-standardising/) article explains how designed experiments find robust settings.

## DMADV: a structure for designing to requirements

Where DMAIC improves an existing process, **DMADV** is used when a product or process is being designed, or fundamentally redesigned, to meet customer requirements from the start. Its five phases:

1. **Define** the customer, business need, scope and design objective.
2. **Measure**: capture the voice of the customer, translate it into CTQs and set targets.
3. **Analyse** concepts and alternatives against the CTQs, assess risks and identify the capability the design will need.
4. **Design** the detailed product and process, including tolerances, controls and a verification plan.
5. **Verify** through prototypes, testing and pilot production that the design meets the CTQs, and hand over to operations with controls in place.

The economic logic is strong. Design decisions fix most of a product's cost and much of its quality before production begins, when changing them is comparatively cheap. A few weeks spent on structured requirements and robustness at the start can save months of correction later.

## Verification and validation

Two different questions close the loop:

- **Verification**: does the product meet the requirements? Tests against the CTQs, measured with defined methods.
- **Validation**: do the requirements, and therefore the product, actually meet the customer's needs? Trials with real users in real conditions.

A product can pass every verification test and still fail validation if a requirement was wrong or missing. Validation with installers, operators and end users, before full launch, is the check on the translation itself. The [quality starts before the specification](/reados/collections/specifications-product-quality-and-sustainability/quality-starts-before-the-specification/) article covers the risk of faithfully building to a weak specification.

## Services have CTQs too

The same approach works for services: response time to a breakdown call, first-time fix rate, accuracy of quotes, clarity of documentation, on-time completion. Customers' words such as "responsive" and "reliable" translate into measurable service characteristics, which depend on drivers such as staffing, scheduling, training and parts availability.

## A worked example

This is an illustrative example. A 30-person Australian manufacturer makes drawer runners for cabinet makers and is designing a new soft-close range. Previous products have drawn complaints about installation time and drawers that slam when heavily loaded.

**Voice of the customer.** The team interviews ten cabinet makers, watches four installations and reviews two years of complaints. Key statements include "it takes too long to fit", "heavy drawers still bang", "it has to last" and "I want to adjust the drawer front without taking it out".

**Kano classification.** Smooth running without scraping is basic. Quiet, controlled closing and load capacity are performance needs, now expected but with more being better. Tool-free front adjustment is a delighter, offered by few competitors.

**CTQs.** The team defines:

- **Closing control**: closing speed over the last 50 mm below a set limit, for loads from empty to the rated maximum, measured on a standard test rig.
- **Installation time**: a pair of runners installed by a trained installer, with standard tools, in under 60 seconds.
- **Durability**: no more than a set loss of damping performance after 50,000 open-close cycles at rated load.
- **Adjustment**: front adjustable by a set amount in each direction without tools.

**Drivers.** Analysis and a small designed experiment show that closing speed depends mainly on damper oil viscosity, piston clearance and spring preload, and that piston clearance is the most sensitive. Installation time depends on the position of the mounting holes relative to standard cabinet drilling patterns and on a snap-fit clip design.

**Design for capability.** The damper supplier's process can hold piston clearance with a Cpk of about 1.3 at a tolerance of ±0.02 mm, but not tighter. The team adjusts oil viscosity and preload so that closing speed stays within limits across that full clearance tolerance, making the design robust to the supplier's normal variation. Piston clearance is marked as a special characteristic.

**Verification and validation.** Prototype runners pass the closing, cycle and adjustment tests. In a validation trial, six cabinet makers fit the new runners in real kitchens. Installation time averages under 50 seconds, but two installers find the clip awkward with gloves on. The clip is modified before tooling.

## Applying this in an Australian product business

- **Gather the voice of all customers**, including installers, operators and maintainers.
- **Translate solutions back to needs** before designing.
- **Classify needs**, and research basic needs deliberately.
- **Define CTQs** with operational definitions, targets and limits.
- **Trace each CTQ** to design and process drivers, and mark critical links.
- **Set tolerances** with process capability in mind, and design for robustness.
- **Use DMADV** for new or fundamentally redesigned products and processes.
- **Verify against requirements** and validate with real users before launch.

## Where requirement translation goes wrong

- **Designing to what customers asked for** rather than what they need.
- **Vague requirements** such as "durable" or "easy" with no measure.
- **Missing basic needs** because nobody mentioned them.
- **Tolerances tighter than the process** can hold.
- **Losing the link** between requirements and customer needs, so they are relaxed carelessly.
- **Verification without validation.**
- **Treating last year's delighter** as a differentiator.

## Questions to ask before the design is fixed

- Whose needs have we captured, and whose have we missed?
- Which customer statements are really requested solutions?
- How would we measure each need, precisely?
- Which design and process characteristics drive each critical requirement?
- Can our processes, and our suppliers', hold the tolerances we are setting?
- How will we validate with real users before tooling?

## Bringing it together

Quality is easiest and cheapest to build in at the start, when customer needs are translated into requirements. Gather the voice of every relevant customer, separate needs from requested solutions and recognise which needs are basic, performance or delighters. Turn each important need into a critical-to-quality requirement with an operational definition and limits, trace it to the design and process characteristics that drive it, and set tolerances that the real process can hold. Use a structured approach such as DMADV for new designs, then verify against the requirements and validate with real users. Done well, the factory's numbers and the customer's words finally describe the same product.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® quality handbooks on translating the voice of the customer into critical-to-quality requirements, DMADV and design for Six Sigma, and the DMAIC define phase. The worked example is illustrative. This article is general information.*
