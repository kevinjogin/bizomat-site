---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: choosing-prototype-fidelity
order: 2
title: "Choosing prototype fidelity: the cheapest build that answers the question"
description: "Analytical or physical, focused or comprehensive: BPU-5's five questions answered by a A$20,500 set of focused prototypes before a A$88,000 EVT build, and a thermal rig built without its lid."
draft: false
---

A prototype is bought to answer a question. The question might be whether an inverter can start a drop saw, whether a person can wheel an 82 kg unit across a muddy site, or whether a battery stays cool enough on a hot afternoon. A prototype that answers its question cheaply and quickly is good value, however crude it looks. A polished prototype that answers nothing in particular is an expensive model for the brochure.

This chapter shows how the BPU-5 team chose a prototype for each of its main questions before the first whole units were built. It describes the two dimensions on which prototypes differ, explains how fidelity trades against cost and time, lists the cheapest credible prototype for each question with its cost, lead time and blind spots, and ends with a thermal rig that answered its question confidently and wrongly, because it was missing the one feature that drove the answer.

## A prototype answers a question

Chapter 1 showed that a design issue found at concept costs about A$1,000, excluding GST, against A$6,000 at EVT and A$120,000 in the field, and that a plan which finds more issues early saves far more than it spends: [Finding problems while they are cheap](/reados/publications/prototypes-and-simulation-by-the-numbers/finding-problems-while-they-are-cheap/) put the saving at A$316,059 net for the BPU-5. Prototypes and models before the first build are how a plan finds issues early. The difficulty is choosing which ones to build.

The useful discipline is to start from the question, not the prototype. Write down what the team needs to know, what decision depends on it, and what answer would change that decision. Then ask what is the cheapest thing that could give a credible answer, and how long it would take. A question that changes no decision does not need a prototype at all. A question whose answer would change a large decision deserves a prototype that is credible enough to be believed when the answer is unwelcome.

## Two dimensions of a prototype

Ulrich, Eppinger and Yang (2020) describe prototypes on two dimensions. The first runs from **analytical** to **physical**. An analytical prototype represents the product mathematically or visually: a calculation, a spreadsheet model, a simulation or a 3D model. A physical prototype is a thing you can touch, test and drop. The second dimension runs from **focused** to **comprehensive**. A focused prototype represents one or a few attributes of the product, such as its thermal behaviour or its mass, and ignores the rest. A comprehensive prototype represents most or all of the product's attributes at once.

```figure
type: matrix
title: Prototype types, with BPU-5 examples
x: Focused to comprehensive
y: Analytical to physical
hot: 1
caption: This is an illustration. The BPU-5 team answered four of its five main questions with focused prototypes, three of them physical, and kept the comprehensive physical build for integration.
- Physical, focused | Inverter bench test with real tools; thermal rig; 82 kg plywood mass mock-up
- Physical, comprehensive | 4 EVT units, A$88,000, 10 weeks
- Analytical, focused | Thermal model of the battery bay; energy budget and Monte Carlo runtime model
- Analytical, comprehensive | Whole-unit system model: not built, because the EVT units answer integration directly
```

Each quadrant has its uses. Analytical prototypes are cheap to change and can explore many options, but they contain only the physics the modeller put in. Physical prototypes contain all the physics, including the parts nobody thought of, but they take longer to make and change. Focused prototypes are fast and cheap and can be ready long before the design is complete. Comprehensive prototypes are the only way to find problems that arise from interactions between subsystems, such as heat from the inverter reaching the battery, or electrical noise from the charger tripping an RCD, but they come late and cost the most.

## Fidelity, cost and cycle time

**Fidelity** is how closely a prototype represents the real product in the respects that matter to the question. Higher fidelity usually means a more credible answer, and it nearly always means more cost and a longer cycle from deciding to build the prototype to having its answer. Thomke (1998, 2003) describes development as a series of experiments, each a problem-solving cycle of design, build, run and analyse, and shows that the cost and duration of each cycle depend heavily on the fidelity of the model or prototype used. Cheaper, faster cycles allow more experiments, earlier, which is the point of Plan B in Chapter 1.

The practical rule follows: use the lowest fidelity that gives a credible answer to the question, and no lower. "Credible" is doing the work in that sentence. A prototype is credible when it reproduces the features that drive the answer. Everything else can be left out. A mass mock-up for a handling question needs the right mass, the right centre of mass, the right wheels and the right handle positions. It does not need a battery, a paint finish or a working inverter. The same mock-up is useless for a thermal question, because it has none of the features that drive temperature.

## The BPU-5's questions and the cheapest credible prototype for each

This is an illustration. Before the EVT build, the product manager and the lead engineers listed the questions on which large decisions depended, and the cheapest prototype that could answer each one.

**Q1. Will the inverter start a 2.4 kW drop saw and a 230 mm angle grinder?** Electric motors draw a large inrush current when they start, and an inverter that cannot supply it will trip or stall the tool. If the candidate inverter cannot, the team needs a bigger one, which changes the enclosure and the thermal design. The prototype is a **bench test** of the candidate inverter, powered from a battery pack, starting the real tools repeatedly. It costs **A$3,500** and takes **1 week**.

**Q2. Will the hottest cell stay at or below 45 °C after 1 hour at 3 kW in a 35 °C ambient?** This is requirement R2. If it fails, the fan, the ducting or the layout must change. The prototype is an **analytical thermal model** of the battery bay (**A$2,000**) to choose a fan and duct, followed by a **focused physical rig**: a representative battery bay with heaters standing in for the inverter's losses, run in a climatic chamber (**A$9,000**). Together they cost **A$11,000** and take **3 weeks**.

**Q3. Can one person wheel it over rough ground, and two people lift it onto a ute tray?** If not, the wheels, handles or mass budget must change. The prototype is a **plywood mass mock-up** ballasted to **82 kg**, with the intended wheels and handles. It costs **A$1,200** and takes **4 days**.

**Q4. Will it last a site day?** This is requirement R1. The prototype is analytical: an **energy budget and Monte Carlo model**, fed by data from load loggers placed on the power supply of **6 residential sites**. It costs **A$4,800** and takes **4 weeks**, most of it waiting for logged days. Chapter 7, [Monte Carlo in a spreadsheet: will the unit last the day](/reados/publications/prototypes-and-simulation-by-the-numbers/monte-carlo-for-the-working-day/), builds and runs that model.

**Q5. Does the whole unit work together?** Only a comprehensive physical prototype can answer this. The prototype is the **EVT build of 4 units** at A$22,000 each, **A$88,000**, taking **10 weeks** from order to first test.

```figure
type: compare
title: BPU-5's questions and the cheapest credible prototype for each
cols: Prototype | Cost | Time | What it cannot show
caption: This is an illustration, excluding GST. The four focused prototypes cost A$20,500 together, 23% of the EVT build, and run in parallel in about 4 weeks.
- Q1 Inverter starts the tools | Bench test, real tools | A$3,500 | 1 week | heat in the enclosure; battery voltage at the end of a day
- Q2 Hottest cell at or below 45 °C | Thermal model, then rig in a chamber | A$11,000 | 3 weeks | airflow features missing from the rig; drop damage
- Q3 Handling | 82 kg plywood mass mock-up | A$1,200 | 4 days | durability of wheels and handles over years of use
- Q4 Lasts a site day | Energy budget and Monte Carlo, 6 logged sites | A$4,800 | 4 weeks | the real usable capacity, until units are measured
- * Q5 Works as a whole | 4 EVT units | A$88,000 | 10 weeks | variation between units; anything that needs production tools
```

The last column matters as much as the cost. Every prototype has blind spots, and writing them down tells the team which questions remain open after the prototype has answered. The bench test says nothing about heat. The thermal rig says nothing about drop damage. The energy model is only as good as the six sites it was fed, and it uses the claimed 4.50 kWh until real units can be measured. Four EVT units are too few to show anything about variation between units, a point Chapter 5 makes with numbers, and they are built with fabricated enclosure parts because the production rotomould tool has not been made. Whether to make that tool before a drop test is the decision in [The value of a test](/reados/publications/prototypes-and-simulation-by-the-numbers/the-value-of-a-test/).

## Focused first, then comprehensive

The four focused prototypes cost **A$20,500** together, 23% of the EVT build's A$88,000, and because they are independent they can run in parallel, finishing in about 4 weeks against the EVT build's 10. More importantly, they can start before the design is complete. The thermal model can choose a fan before the enclosure is drawn; the mass mock-up can test handle positions before the frame is designed. Each answer then shapes the EVT design, so the EVT units test a design that already reflects what the focused prototypes found.

The focused set does not replace the EVT build. Comprehensive prototypes find the problems that live between subsystems, and the BPU-5 has several candidates: the inverter heats the air that cools the battery, the charger and inverter share a fan, and the RCD protection must work with the inverter's output. What the focused set does is clear the single-subsystem questions away first, so that when the EVT units are tested, their 10 weeks and A$88,000 are spent on the questions only they can answer.

[Notes on prototyping early](/reados/collections/product-development-and-launch/notes-on-prototyping/) gives a shorter, qualitative treatment of matching fidelity to the question. When the technology itself is unproven, as a new combination of battery, inverter and thermal design can be, prototypes also show how mature it is; [Technology readiness levels and critical technology elements](/reados/publications/first-of-a-kind-technology-by-the-numbers/technology-readiness-levels/) in *First-of-a-Kind Technology by the Numbers* describes how that maturity is graded and which elements to prototype first.

## What prototypes cannot settle

A battery power unit for building sites must satisfy requirements that no development prototype settles on its own. As examples of the relevant fields: IEC 62619 sets safety requirements for secondary lithium cells and batteries in industrial applications; AS/NZS 3012 covers electrical installations on construction and demolition sites, including the in-service testing of equipment used there; and subsection 38.3 of the UN Manual of Tests and Criteria sets the tests lithium batteries must pass before they can be transported. Which requirements apply to a real product, and how it shows compliance, needs an assessment by competent people. The development prototypes in this book are there to find design problems before formal compliance testing, so that the expensive certification tests are run on a design that is likely to pass.

## The error: a thermal rig without its lid

This is an illustration. The thermal rig for Q2 was built quickly by the test technician from the mechanical design engineer's sketch: a frame holding a representative battery module with its cell spacing, the chosen fan and duct, and heaters standing in for the inverter. To make it easy to fit thermocouples and adjust the duct, it was built **open-frame**, without the enclosure lid. Run for 1 hour at the equivalent of 3 kW in the climatic chamber at 35 °C, its hottest cell reached **41 °C**, comfortably inside R2's 45 °C limit. The thermal question was marked as answered.

The first enclosed EVT unit, run under the same conditions, reached **52 °C**, failing R2 by **7 K**. With the lid on, air no longer escaped freely above the battery; it had to leave through the vent grilles, and the fan, working against that resistance, moved much less air than it had in the open rig. The rig had reproduced the cells, the fan and the heat source accurately, and omitted the feature that set the airflow: the enclosure and its grilles.

```figure
type: bars
title: Hottest cell after 1 hour at 3 kW in a 35 °C ambient
unit: °C
max: 55
caption: This is an illustration. The open-frame rig read 11 K low and passed R2. Rebuilt with the lid and the real vent grilles, it agreed with the first enclosed EVT unit within 1.5 K.
- R2 limit | 45
- Open-frame rig, no lid | 41 | passed, wrongly
- * First enclosed EVT unit | 52 | failed by 7 K
- Rig rebuilt with lid and real grilles | 50.5 | within 1.5 K of the EVT unit
```

The problem was found at EVT, as one issue at the EVT cost of **A$6,000**, and the fix was a fan-duct redesign that took **4 weeks** of the mechanical design engineer's time. Those weeks were off the critical path, because the next build was months away, so they cost engineering time but no release time. Had the rig been representative, the problem would have been a concept-stage issue at about A$1,000. Had the EVT units not been run hot, it could have reached DVT or later at A$15,000 or more.

The team rebuilt the rig with the enclosure lid and the real vent grilles for **A$2,600**. It then read **50.5 °C** against the EVT unit's 52 °C, agreement within **1.5 K**, which was close enough to trust the rig for comparing duct designs. That correlated rig became the workhorse for the redesign loops in Chapter 4, at a fraction of the cost of rebuilding EVT units for each change.

The lesson is the one in the definition of fidelity. "Representative" does not mean "looks like the product". It means reproducing the features that drive the answer. For a forced-air thermal question, those are the heat sources, the fan, and every resistance in the air path, including the lid and the grilles. A focused rig earns trust only when it has been checked against something more complete, and the check should be planned, not left to chance.

```figure
type: checklist
title: Before trusting a focused rig
caption: This is an illustration. The crossed item is the BPU-5 thermal rig's error. The open questions are worth asking of any focused prototype before its answer is used.
- Write down the question and the decision that depends on it | R2: hottest cell at or below 45 °C; fan and duct choice
- List the features that drive the answer | heat sources, fan, cell spacing, and every resistance in the air path
- Build every driving feature as it will be in the product | lid, vent grilles, filter and duct
- Plan a correlation check against a more complete prototype | first enclosed EVT unit, agreement within 1.5 K
- x Leave out a feature to make the rig easier to instrument | the open frame read 11 K low
- ? What would make this rig read optimistic | any missing restriction raises airflow and lowers temperature
- ? Which questions does the rig not answer | drop damage, ageing, variation between units
```

## Exercise: the bench test for the drop saw

The lead electrical engineer estimates a probability of **0.25** that the candidate inverter cannot start the 2.4 kW drop saw. If that is first found at EVT, the fix costs the EVT issue cost of A$6,000 plus **4 weeks** on the critical path to source and fit a larger inverter, at A$25,000 a week. If the A$3,500 bench test finds it now, the fix costs the concept-stage A$1,000. What is the expected cost with and without the bench test, the expected saving, and the probability of a problem at which the test just pays for itself?

**Worked answer.** Found at EVT, the problem costs 6,000 + 4 × 25,000 = **A$106,000**. Without the bench test, the expected cost is 0.25 × 106,000 = **A$26,500**. With it, the expected cost is the test plus the cheap fix when needed: 3,500 + 0.25 × 1,000 = **A$3,750**. The test saves **A$22,750** in expectation. It pays for itself when the probability p satisfies 3,500 + p × 1,000 = p × 106,000, so p = 3,500 ÷ 105,000 = **0.0333**, about 1 in 30. Because the saving comes mostly from avoiding 4 weeks on the critical path, a cheap focused test is worth running even when the engineer is fairly confident of the answer. Chapter 3 turns this reasoning into a general method for valuing a test, including one that can give the wrong answer.
