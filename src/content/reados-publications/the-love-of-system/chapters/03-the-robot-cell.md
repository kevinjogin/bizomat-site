---
book: the-love-of-system
chapterSlug: the-robot-cell
order: 3
title: "The robot cell: the vendor's case, the shop's case and a humbler machine"
description: "How an automation case changes when the demonstration's assumptions are replaced by a job shop's real batch sizes and duties, tested with an automation business case and an investment appraisal."
draft: false
---

A robot loading a lathe is one of the most persuasive sights in manufacturing. It is precise, tireless and quick, and it suggests a shop that runs itself. The vendor's case for one is usually persuasive too: so many hours of loading a week, so much labour cost removed, payback in two or three years. The question for a job shop is not whether the robot works. It does. The question is whether the case describes the shop's work or the demonstration's.

This chapter takes the robot cell proposed for the job shop's main lathe, runs the vendor's case through an automation business case and an investment appraisal, then replaces each assumption with the shop's own data. It ends with a humbler machine that serves part of the same end at a fraction of the cost.

## The vendor's case

This is an illustration. The robot cell is quoted at **A$185,000** installed, including the robot, grippers, a parts conveyor, guarding, integration and training. The vendor's proposal assumes that the lathe operator spends about **30 hours a week** loading and unloading parts, that the robot removes **90%** of that work, and that maintenance and support cost about **A$9,000** a year. The operator costs A$68 an hour fully loaded, and the shop works 48 weeks a year.

The [automation business case tool](/tools/automation-check/) in BIZOMAT Tools compares the annual cost of manual work with an automation investment and its running cost. From the manual hours a week, the loaded labour rate, the working weeks, the investment, the annual automation cost and the expected reduction in manual effort, it gives the manual annual cost, the labour cost removed, the net annual benefit and the simple payback. Its guidance lists what the calculation leaves out: failure modes, support burden, process stability, safety and change management. Its check reminds the user that automating an unstable process automates its problems.

With the vendor's assumptions, the tool gives a manual annual cost of **A$97,920**, labour cost removed of **A$88,128**, a net annual benefit of **A$79,128** and a payback of **2.34 years**.

The [equipment investment appraisal tool](/tools/investment-appraisal/) takes the analysis further. From the purchase cost, the yearly savings, the yearly running cost, the salvage value, the life and the hurdle rate, it gives the net present value, the internal rate of return, simple and discounted payback, the benefit–cost ratio and the equivalent annual cost of ownership. With an eight-year life, a salvage value of A$40,000 and the shop's hurdle rate of 10%, the vendor's case gives a net present value of **A$255,802**, an internal rate of return of **40.5%** and a discounted payback of 2.8 years.

On paper, it is an excellent investment.

## Test each assumption against the shop's work

The owner applies the test from Chapter 1. The end is more useful lathe hours, and lower labour cost as a secondary end. The question is what the robot delivers at the shop's realistic use.

**How many hours is the operator actually loading?** Chapter 2's log shows the lathe loading and unloading for about **4 hours** a week of machine time. The operator's time around the lathe is larger than that, because loading includes fetching blanks, removing chips, deburring and gauging during the cycle, but it is nowhere near 30 hours. The operator also does the lathe's 18 hours of changeovers, which a robot does not remove and partly adds to.

**Which jobs suit the robot?** A robot cell pays when it runs long batches of similar parts. The shop's batches average about 40 parts. The owner sorts last year's lathe jobs by batch size and finds that jobs of 200 parts or more, the ones the vendor's integrator considers worth teaching the robot, account for about a fifth of the lathe's parts. On smaller batches, the time to teach the robot, change grippers and prove the cycle would eat most of the gain.

```figure
type: bars
title: Share of last year's lathe parts by batch size
unit: %
max: 40
caption: This is an illustration. From the shop's job records. Only the batches of 200 or more parts suit robot loading in the integrator's judgement; they are about a fifth of the lathe's parts and a much smaller share of its jobs.
- Under 20 parts | 18
- 20 to 49 parts | 27
- 50 to 199 parts | 34
- *200 parts or more | 21
```

The distribution matters more than the average. A shop whose batches averaged 40 parts but were all close to 40 would have no work for a robot at all; one whose average hid a steady stream of long batches might have plenty. The job shop sits between the two: enough long batches to tempt, not enough to fill a cell.

**How much of the operator's work does the robot remove on suitable jobs?** On long batches, the operator's work related to loading is about **12 hours** a week. The robot removes the repetitive part, but the operator still teaches the cell for each new job, changes grippers, checks parts, deburrs where the cell cannot, and clears faults. The integrator's own reference site, asked directly, puts the reduction at about **70%** for a job shop.

```figure
type: compare
title: The robot cell's case, two ways
cols: Vendor's assumptions | Shop's data
caption: This is an illustration. Results from the automation business case tool at A$68 an hour over 48 weeks, with A$185,000 invested and A$9,000 a year of running cost, excluding GST. Only the manual hours and the reduction differ.
- Manual loading hours a week | 30 | 12, on batches of 200 or more
- Reduction in manual effort | 90% | 70%
- Labour cost removed a year | A$88,128 | A$27,418
- Net annual benefit | A$79,128 | A$18,418
- *Simple payback | 2.34 years | 10.04 years
```

With the shop's data, the automation business case tool gives labour cost removed of **A$27,418**, a net annual benefit of **A$18,418** and a payback of **10.04 years**. The investment appraisal tool, with the same life, salvage value and hurdle rate, gives a net present value of about **−A$68,081**, an internal rate of return of about **0.2%**, no discounted payback within the eight-year life, and a benefit–cost ratio of 0.68.

The robot works exactly as described. The case collapses because the shop is not the shop in the demonstration.

## The failure case: a reference site that was not similar

The vendor's strongest evidence was a reference visit: a manufacturer two hours away running three similar cells, each paying back in about two years. The owner visited, was impressed, and came back ready to sign.

The reference site makes hydraulic fittings for a vehicle maker, in batches of several thousand, the same few part families every week, on two shifts. Its cells run the same jobs for days at a time. It is a fair example of where robot loading pays. It is not an example of the job shop.

This is the argument from similar cases discussed in many places: like causes in like conditions give like effects. The reference site was like the job shop in the machine and the robot, and unlike it in every condition that decides the case: batch size, job variety, shifts and the share of operator time spent loading.

### How it is detected

The detection is to ask of any reference site the questions that decide the case, and to compare the answers with your own data: typical batch size, number of different jobs a week, hours of loading per week, shifts run, and how long a new job takes to set up on the cell. The owner sends the questions to the reference site's production manager, who answers them frankly. The comparison makes the dissimilarity obvious in a way the visit did not.

### How it is corrected

The shop declines the robot cell for now and records why, with the data. The record also says what would change the decision: a contract for long-running parts large enough to fill most of the lathe's week, or a move to a second shift where unattended running would add real lathe hours. That keeps the decision open to evidence rather than closing it on taste.

## The one real benefit: unattended running

The shop's case leaves out one benefit that the vendor mentioned and the owner found genuinely attractive: running the lathe unattended for a few hours after the shift ends, on long batches with enough blanks queued. That adds lathe hours, which is the shop's main end, not just labour savings.

The owner estimates that, on the long batches the robot suits, the lathe could run about **6 hours** a week unattended, about 288 hours a year. With no operator present, those hours are worth the machine rate rather than the machine-and-operator rate, about A$33 an hour from Chapter 2, or about **A$9,500** a year. Adding that to the labour saving gives yearly savings of about A$36,900 and, after running costs, a net yearly flow of about A$27,900.

The investment appraisal tool then gives a net present value of about **−A$17,400**, an internal rate of return of about **7.6%** and a simple payback of 6.6 years. Better, but still below the hurdle rate. Unattended running also needs things the case does not yet include: reliable chip control, tool-wear monitoring, a safe way to stop and alert if something goes wrong, and confidence that a fault at night will not damage the machine. Each of those has a cost.

## A humbler machine

The test in Chapter 1 asks what a simpler means would deliver. For a lathe, the obvious one is a **bar feeder**: a machine that pushes bar stock through the spindle so that the lathe can make part after part from bar without anyone loading blanks. It is a mature, unglamorous technology. It suits only bar-fed work, and it does nothing for chucked parts made from forgings or castings. But about **8 hours** a week of the operator's loading time is on bar work.

The bar feeder is quoted at about **A$35,000** installed, with running costs of about A$1,500 a year and a reduction in manual loading effort on bar jobs of about **85%**. The automation business case tool gives labour cost removed of **A$22,195**, a net annual benefit of **A$20,695** and a payback of **1.69 years**. The investment appraisal tool, with an eight-year life and a salvage value of A$5,000, gives a net present value of about **A$77,700** and an internal rate of return of about 58%.

```figure
type: compare
title: Four cases at a 10% hurdle rate over eight years
cols: Net present value | Internal rate of return | Simple payback
caption: This is an illustration. Results from the equipment investment appraisal tool, excluding GST. Only the vendor's case and the bar feeder clear the hurdle, and the vendor's case describes a different shop.
- Robot cell, vendor's assumptions | A$255,802 | 40.5% | 2.34 years
- Robot cell, shop's data | −A$68,081 | 0.2% | 10.04 years
- Robot cell, shop's data with unattended running | −A$17,394 | 7.6% | 6.63 years
- *Bar feeder, shop's bar work | A$77,739 | 57.8% | 1.69 years
```

The bar feeder will never draw a crowd at a trade show. It also does not solve the shop's main problem, the changeovers, which the quick-change system in Chapter 2 addresses. But for the loading the shop does have, it is a much better fit than the robot, and it can run unattended on long bar jobs too, adding lathe hours without a robot's teaching and gripper changes.

### Ask the integrator the hard questions

The owner's experience suggests a short list of questions to put to any automation supplier before the business case is written, and to put in writing so the answers can be compared:

- On jobs like ours, with these batch sizes, what share of the operator's time does your cell actually remove?
- How long does it take to set up the cell for a new part, including gripper changes and proving the first cycle?
- What faults stop the cell most often, and who clears them?
- What does support cost after the first year, and how quickly do you respond?
- Which of your customers have batch sizes like ours, and may we speak to them?

Good integrators answer these readily, and the answers are usually more useful than the demonstration. A supplier who will only talk about the cell's speed is describing the contrivance, not the case.

## What automation does not fix

The automation business case tool's check is worth repeating: automating an unstable process automates its problems. The lathe's real problem is variety. Many small batches, each needing a changeover, is the job shop's business model, not a defect to be automated away. Automation suits steady, repetitive work; a job shop has little of it. The right sequence for the shop is to reduce the cost of variety first, with quick-change workholding and standard part families, and then to automate whatever steady work remains.

That sequence is not anti-automation. It is a matter of fitting the contrivance to the end. If the shop wins steady work in future, the robot's case should be re-run with that work, and it may well pass. Any cell that is installed must also be designed and guarded to meet the shop's work health and safety obligations for plant, with a risk assessment and safe commissioning, which are part of its cost.

## Exercise: a second shift

A large customer offers a three-year contract for a family of pump shafts in batches of about 500, enough to keep the lathe busy for about **25 hours** a week of long runs. The owner considers adding a lightly staffed second shift, with the robot loading during both shifts. Suppose this raises the operator loading time on robot-suitable jobs to **28 hours** a week, with a reduction of 70%. Using the automation business case tool's method at A$68 an hour, 48 weeks, A$185,000 and A$9,000 a year of running cost, find the net annual benefit and payback. What else would you need before deciding?

**Worked answer.** The manual annual cost is 28 × A$68 × 48 = **A$91,392**. The labour cost removed at 70% is **A$63,974**, and the net annual benefit after A$9,000 of running cost is **A$54,974**. The payback is A$185,000 ÷ A$54,974 = about **3.4 years**.

That is within the shop's four-year payback limit, so the contract changes the case from weak to reasonable. Before deciding, the owner would need the contract's terms and how certain the volume is over three years, since the robot's life is longer than the contract; an investment appraisal with the shop's hurdle rate and a realistic salvage value; the cost of the second shift itself; and a check that the extra lathe hours are worth more than the robot, for example by comparing with a second lathe. The calculation shows that the robot can be the right machine. It is the shop's work, not the robot, that decides when.
