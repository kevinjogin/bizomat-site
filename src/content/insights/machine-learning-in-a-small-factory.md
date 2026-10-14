---
title: "Machine learning in a small factory: inspection, maintenance and forecasting, and what each needs to work"
description: "Machine learning can inspect parts, flag failing machines and forecast demand, given the right data and checks. How to match the method to the problem, test it honestly and keep it working."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - manufacturing
  - quality
author: "KEVOS®"
featured: false
draft: false
---

A plastics manufacturer is offered three artificial intelligence products in the same month: a camera system that inspects moulded parts for defects, a sensor kit that predicts when machines will fail, and forecasting software that promises better production plans. Each demonstration is impressive. Each vendor says the system learns from the factory's own data. The owner's questions are practical. Which of these would work here? What data would they need? How would we know they work, and keep working?

**Machine learning** is the family of techniques that lets software learn patterns from data rather than following rules written by hand. In manufacturing it can inspect products, detect unusual machine behaviour and forecast demand, sometimes far better than older methods. It can also fail quietly: a model that performs brilliantly in a demonstration may struggle with a new material colour, a changed camera position or a defect it has rarely seen. The difference between the two outcomes usually lies less in the algorithm than in whether the problem suits the method, whether the data contain the right signal and whether the system is tested and monitored honestly.

This article explains the main kinds of machine learning in plain terms, how to match them to factory problems, what visual inspection, predictive maintenance and demand forecasting each need, how to train and test a model without fooling yourself, and how to keep it working once it is in use. It is general information for owners, engineers and quality and operations managers in small and medium manufacturers.

## Three kinds of learning

Machine learning methods are usually grouped by the kind of signal they learn from:

| Kind | Learns from | Typical factory uses |
|---|---|---|
| **Supervised learning** | Examples labelled with the correct answer, such as images marked good or defective, or past records with known outcomes | Visual inspection, predicting quality from process settings, estimating cycle times or costs |
| **Unsupervised learning** | Data without labels, finding structure or unusual patterns | Detecting abnormal machine behaviour from sensor data, grouping products or customers with similar patterns |
| **Reinforcement learning** | Trial and feedback over sequences of decisions | Robot motion, some scheduling and control problems; rarely the first choice for a small business |

Supervised learning splits further into **classification**, which predicts a category such as good or defective, and **regression**, which predicts a number such as a dimension or a price.

The most important question is not which algorithm to use, but **what learning signal exists**. If you want a model to recognise defects, you need examples of defects, labelled consistently. If machines rarely fail, you will have few failure examples, which shapes what is possible.

## Start with the decision and the simplest workable method

Before considering machine learning, write down:

- **The decision** the system will support: reject a part, schedule maintenance, set next week's production quantities.
- **What happens now**, and how well it works, measured if possible.
- **What a wrong answer costs**, in both directions: a missed defect versus a good part rejected, an unnecessary maintenance stop versus a breakdown.

Then ask whether a simpler method would do. Control charts detect many process shifts. A vibration threshold may warn of bearing wear well enough. A seasonal average may forecast stable demand adequately. Machine learning earns its place where patterns are complex, inputs are many or the task is perceptual, such as recognising visual defects, and where the simpler method has been tried or clearly falls short.

Look too at the data the business already holds. Inspection records, scrap logs, maintenance histories, machine controller data, production reports and sales orders often contain more useful signal than people expect, though usually with gaps, inconsistent codes and missing context. Cleaning and understanding that data is often the largest part of any machine learning project, and it pays off even if the model is never built.

## Visual inspection

Camera-based inspection using supervised learning is one of the most practical factory uses. It can check every part, consistently, at production speed. It needs:

- **Consistent images**: fixed camera positions, controlled lighting and a stable way of presenting parts. Many projects that fail do so because lighting or positioning varies, not because the model is weak.
- **Labelled examples of each defect type**, ideally hundreds, collected over a period that covers normal variation in materials, colours, shifts and machines.
- **Consistent labels.** If two experienced inspectors disagree about whether a mark is a defect, the model will learn that confusion. Before labelling, check how well inspectors agree, agree boundary samples and resolve differences.
- **A plan for rare defects.** Defects may be only 1 or 2% of parts, and some types far rarer. A model trained mostly on good parts can score high accuracy by passing everything. Collect extra examples of rare defects and judge the model on how many defects it catches, not on overall accuracy.

The model usually produces a score, and the business chooses the **threshold** above which a part is rejected. Lower thresholds catch more defects but reject more good parts. Set the threshold from the costs of each error, and consider sending borderline parts to a person for review.

## Predictive maintenance

The promise of predicting machine failure is appealing, but the data are often the limiting factor. Failures that matter are, fortunately, rare, so there are few labelled examples to learn from. A practical progression:

1. **Condition monitoring**: measure vibration, temperature, motor current, pressure or oil condition, and set sensible alarm limits.
2. **Anomaly detection**: use unsupervised methods to learn what normal looks like for each machine and flag unusual patterns for investigation.
3. **Failure prediction**: once enough failures and their warning signs have been recorded, supervised models can estimate the probability or timing of failure.

Each step is only worth doing if someone can act on the warning: a planned maintenance window, spare parts and a technician. The [maintenance that prevents breakdowns](/insights/maintenance-that-prevents-breakdowns/) article explains how to decide which machines justify condition monitoring.

## Demand forecasting

Forecasting is a regression problem on data over time. Machine learning can combine many inputs, such as order history, seasonality, promotions, customer schedules and economic indicators. But demand for many small manufacturers is lumpy and driven by a few large customers, where conversations with those customers may beat any model. Always compare a machine learning forecast with simple methods, such as a moving average or seasonal naive forecast, on the same data. If it does not beat them clearly, the extra complexity is not worth it. The [demand forecasting for small manufacturers](/insights/demand-forecasting-for-small-manufacturers/) article covers simple methods and how to measure forecast accuracy.

## Train and test without fooling yourself

The central rule of machine learning is that a model must be judged on data it has not learned from. Typical practice divides the data into three sets:

- **Training data**, used to fit the model.
- **Validation data**, used to compare versions and tune settings.
- **Test data**, held back until the end and used once for an honest estimate of performance.

Several traps produce models that look excellent in testing and disappoint in use:

- **Overfitting**: the model memorises the training data, including its noise, and does poorly on new data. A large gap between training and test performance is the warning sign.
- **Data leakage**: information that would not be available at the moment of the real decision sneaks into the training data. Examples include images of the same physical part appearing in both training and test sets, or a maintenance model using a field that is only filled in after a failure is diagnosed.
- **Testing on the wrong period**: for anything that changes over time, test on data from after the training period, as the model will be used, not on randomly mixed records.
- **Unrepresentative data**: a model trained only on one machine, shift, material or colour may fail on others.

Choose **measures that match consequences**. For inspection, report the share of defects caught and the share of good parts rejected separately, by defect type. For forecasting, report average error in units the planners use. Single accuracy figures hide what matters.

Set the acceptance rule before testing: what performance, on what data, is needed to go live, and compared with what current method? The [is the AI good enough to rely on](/insights/is-the-ai-good-enough-to-rely-on/) article covers benchmarks, test scenarios and the decision to deploy.

## Keep it working after go-live

Models do not wear out, but the world they were trained on changes. New materials, colours, suppliers, tools, camera replacements, products and seasons can all degrade performance, a problem known as **drift**. Plan for it:

- **Monitor performance** using a regular audit sample checked by people.
- **Track inputs** for changes, such as image brightness or sensor ranges.
- **Define triggers** for review and retraining, such as a new product or material.
- **Keep a fallback** procedure for when the system is down or doubtful.
- **Record versions** of the model and the data it was trained on.

## People, standard work and authority

Machine learning systems should fit into standard work, with clear authority. Decide who can override the system, how borderline cases are handled, how operators report suspected errors and who owns the system's performance. Treat the system's outputs as evidence, not orders, especially early on. Where decisions affect safety or customer requirements, apply the same change control as for any other inspection or process change.

## Build, buy or partner

Most small manufacturers will not build models from scratch. Vendors offer inspection, monitoring and forecasting products, and integrators can adapt them. When evaluating one, ask:

- **What data does it need**, how much and of what quality?
- **How will it be trained** on our parts and processes, and who does the labelling?
- **How was performance measured**, on whose data, and can we test it on ours?
- **What happens when things change**: new products, materials or cameras?
- **Who owns our data** and the trained model?
- **What does it cost** to run, maintain and retrain?

## A worked example

This is an illustrative example. A 40-person plastics business moulds coloured housings and inspects them visually at the end of each machine. Customers have complained about occasional short shots and black specks reaching them.

**Current performance.** An attribute agreement check with known samples shows that manual inspection misses about 12% of defective parts, more on night shift.

**Data.** A camera station with controlled lighting is fitted to one machine. Over three months it collects about 12,000 images, of which about 2%, roughly 240, show defects. Two inspectors label the images after first agreeing boundary samples for each defect type, because their initial agreement on borderline specks was poor.

**Training and testing.** The vendor trains a model on the first two months of images and tests it on the third month, about 4,000 images including 80 defects. Images of the same part never appear in both sets. At the chosen threshold, the model catches 77 of the 80 defects, missing about 4%, and flags about 3% of good parts, around 118. Together, about 5% of parts are flagged.

**Threshold and workflow.** Because a defect reaching the customer costs far more than a second look, the business keeps the threshold low and sends flagged parts to an inspector for confirmation, rather than rejecting them automatically. Inspectors now review about one part in twenty rather than every part.

**Drift.** Two months after go-live, a new colour masterbatch is introduced and the false reject rate jumps. Monitoring catches it within a day. The vendor retrains the model with labelled images of the new colour, and the business adds "new colour or material" to its retraining triggers.

**Result.** Customer complaints about short shots and specks stop over the following quarter. The business extends the system to two more machines, using the same data and labelling discipline.

## Applying this in an Australian manufacturing business

- **Start from the decision**, the current performance and the costs of errors.
- **Try simpler methods first**, and use machine learning where they fall short.
- **Check the learning signal**: labelled examples, failure history or usable time series.
- **Control image and sensor conditions** before blaming the model.
- **Label consistently**, after agreeing boundary samples.
- **Test on later, unseen data**, and watch for leakage.
- **Measure what matters**: defects caught and good parts rejected, separately.
- **Plan for drift** with monitoring, triggers and a fallback.
- **Keep people in authority**, especially for safety and customer requirements.

## Where factory machine learning goes wrong

- **Choosing the technology** before the problem.
- **Uncontrolled lighting** and part presentation.
- **Inconsistent labels.**
- **Judging by overall accuracy** when defects are rare.
- **Testing on data the model has effectively seen.**
- **No monitoring after go-live.**
- **Predictive maintenance warnings** nobody can act on.

## Questions to ask before you start

- What decision will this support, and what does a wrong answer cost each way?
- How well does our current method perform, measured?
- Do we have, or can we collect, the right examples and labels?
- How will we test it on our own, unseen data?
- What will change in our process that could make the model wrong?
- Who owns the system's performance once it is running?

## Bringing it together

Machine learning can bring real gains in a small factory, particularly for visual inspection, condition monitoring and forecasting, but it rewards discipline more than enthusiasm. Start from the decision and the costs of errors, try simpler methods first and choose the kind of learning that matches the signal your data actually contain. Control the conditions under which data are collected, label consistently, test on later and unseen data, and measure the outcomes that matter. Then monitor for drift, keep people in authority and plan for change. Handled this way, machine learning becomes a dependable part of standard work rather than an impressive demonstration that fades.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® handbooks on machine learning methods for business, training and validating AI models, and AI for internal operations and quality management. The worked example is illustrative. This article is general information.*
