---
title: "Evaluating generative AI: gold datasets, rubrics, grounding checks and regression tests"
description: "Generative AI changes silently when prompts, models or documents change. How to build gold datasets and rubrics, use judge models carefully, test safety and gate every release."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - quality
  - systems
author: "KEVOS®"
featured: false
draft: false
---

Traditional software either does what its tests say or it does not. Generative AI is different. The same input can produce different wording each time, quality is partly a matter of judgement, and behaviour can change when a prompt is edited, a document is added, a setting is adjusted or a provider updates its model. An assistant that worked well at launch can quietly get worse, and nobody notices until a customer, an auditor or a manager finds a bad answer.

Evaluation is how a business knows whether a generative AI system is good enough, and keeps knowing. It means defining what good looks like for the specific use, building a set of test cases that represent real work, scoring outputs consistently with people and automated methods, testing for safety and manipulation, and rerunning the tests every time something changes. It is the quality system for AI.

This article explains how to set acceptance criteria, build gold datasets, score free-text outputs with rubrics and judge models, evaluate retrieval systems and agents, test for safety, latency and cost, run regression tests on every change and monitor systems in use. It builds on the broader question of whether AI is good enough to rely on and is general information for managers, quality professionals and technical teams.

## Start with the decision and the risk

Evaluation begins with the use. A tool that drafts internal meeting summaries needs a different standard from one that answers customers' questions about warranty terms or extracts figures for financial reports. For each application, define:

- **The task** and who relies on the output.
- **The consequences of errors**, including which errors are worst.
- **Acceptance criteria**: the measures and thresholds that must be met before release, such as correct field extraction in at least 98% of test documents with no errors in critical fields.
- **The comparison**: the current process, such as human performance, so the AI is judged against a realistic baseline.

The [is the AI good enough to rely on](/insights/is-the-ai-good-enough-to-rely-on/) article covers benchmarking against current processes and deciding whether to deploy, support or shelve.

## Gold datasets

A **gold dataset** is a curated set of test cases with known good answers or reference information. It is the foundation of evaluation. Good gold datasets:

- **Represent real work**: actual documents, questions and requests, in their real variety.
- **Include difficult cases**: ambiguous requests, poor scans, unusual products, conflicting sources and questions the system should decline.
- **Include adversarial cases**: attempts to manipulate the system or extract information it should not reveal.
- **Record expected outcomes**: exact values for extraction, correct categories for classification, required facts and sources for answers, and behaviours such as "should say it does not know".
- **Are versioned and protected**: changes to the dataset are recorded, and test cases are not used to tune prompts directly, or the tests stop being a fair measure.
- **Are refreshed** as the business, its documents and its users' questions change.

Sizes vary with risk and variety, but a few hundred well-chosen cases are often enough to reveal most problems in a business application, with more for high-volume or high-risk systems.

### Reading scores honestly

Small test sets give uncertain results. With 200 test cases and a measured accuracy of 95%, the true accuracy could plausibly lie anywhere from about 92% to 98%, so a change from 95% to 94% may be noise rather than a real decline. Report the number of cases with every score, and treat small differences with caution.

Averages also hide what matters. A system can score 96% overall while failing every case of a rare but important type, such as contracts with unusual liability clauses or enquiries from customers with accessibility needs. Break results down by case type, document source, customer group and error severity, and set separate thresholds for critical cases. One serious error in a critical field may matter more than ten minor wording problems.

### Who should evaluate

Evaluation needs people who understand the work, not only the technology. Subject matter experts define what correct and complete look like, write reference answers and score difficult cases. Quality or risk professionals help set acceptance criteria and keep the process independent of the team building the system. Technical staff automate the tests and keep records. Keeping evaluation at least partly independent from development avoids the natural temptation to judge one's own work generously.

## Scoring structured outputs

For extraction and classification, automated scoring is precise and cheap. Useful measures include:

- **Field accuracy**: the share of fields extracted correctly, reported separately for critical fields such as amounts, dates and account numbers.
- **Precision and recall** for categories or flags: of the items the system flagged, how many were right, and of the items it should have flagged, how many it found.
- **Schema validity**: the share of outputs that are well formed.
- **Abstention quality**: whether the system correctly declines when information is missing, rather than guessing.

## Scoring free-text outputs

Some outputs can be scored automatically: extracted fields can be compared with expected values, categories with correct labels, and structured outputs checked against their schema. Free text, such as answers, summaries and drafts, needs judgement.

### Human evaluation with rubrics

A **rubric** defines the criteria and scoring levels for an output, for example:

- **Correctness**: are the statements accurate?
- **Completeness**: are the required points covered?
- **Groundedness**: is every claim supported by the supplied sources?
- **Clarity and tone**: is it suitable for the audience?
- **Safety and policy**: does it avoid prohibited content and disclosures?

Train reviewers on the rubric with examples, have some cases scored by more than one person to check agreement, and resolve disagreements to sharpen the criteria. Human evaluation is the reference standard but is slow and costly, so use it where judgement matters most.

### Judge models

A **judge model** is a language model instructed to score outputs against a rubric. It is cheap and scales to thousands of cases, but it has known biases: it may prefer longer answers, favour answers in a particular position when comparing two, or rate outputs from similar models more kindly. Use judge models as a noisy filter, not the only gate for high-stakes outputs. Calibrate them by comparing their scores with human scores on a sample, and recheck calibration when the judge or the rubric changes.

## Evaluating retrieval systems

For systems that answer from documents, evaluate retrieval and generation separately:

- **Retrieval recall**: how often the correct source passages appear among the retrieved results.
- **Context precision**: how much of the retrieved material is actually relevant.
- **Faithfulness or groundedness**: whether the answer's claims are supported by the retrieved passages.
- **Citation accuracy**: whether cited sources actually support the statements attached to them.
- **Answer relevance**: whether the answer addresses the question asked.

Separating these shows whether a failure is a search problem, a content problem or a generation problem.

## Evaluating agents

Agents that take multiple steps need measures of the whole task and the path taken: task success, number of steps, tool errors, policy compliance, appropriate escalation to people and cost per task. Test with realistic scenarios, including ones where the right action is to stop and ask.

## Adversarial and safety testing

Systems that face customers, process external content or take actions need **red-team testing**: deliberate attempts to make them misbehave. Test for:

- **Prompt injection**: instructions hidden in documents, emails or user messages that try to override the system's rules.
- **Data leakage**: attempts to extract confidential information, system instructions or other users' data.
- **Harmful or inappropriate output**: offensive content, unsafe advice or statements outside the system's scope.
- **Bias**: systematically different quality or treatment across groups of users or types of request.

Record failures as test cases, so fixes are confirmed and the same weakness is checked in future.

## Latency, load and cost

A system can be accurate and still fail in use if it is too slow or expensive. Measure typical and slow-case response times, behaviour under peak load and cost per task, and include thresholds for them in acceptance criteria.

## Regression testing on every change

Generative AI systems change in many ways: prompt edits, new documents, retrieval settings, model upgrades by the business or its provider, and changes to tools. Each can improve one thing and break another. A **regression pipeline** reruns the gold dataset and safety tests automatically whenever anything changes, compares results with the previous version and blocks release if agreed thresholds are not met.

Supporting practices include versioning prompts, models, datasets and settings together, so any result can be traced to the exact configuration that produced it, and keeping a release record of what changed, the evaluation results and who approved it. A check that would pass whether or not a problem exists gives false comfort; the [tests that cannot fail](/insights/tests-that-cannot-fail/) article explains how to make sure tests can actually detect problems.

## Monitoring in use

Offline tests cannot anticipate everything. Once live, monitor:

- **User feedback**, such as ratings and reported problems.
- **Sampled human review** of real outputs against the rubric.
- **Signals of trouble**, such as rising rates of "I don't know", escalations, retries or complaints.
- **Drift**: changes in the kinds of requests, documents or users that make the gold dataset less representative.
- **Costs and response times.**

Feed real failures back into the gold dataset. Where the system makes or supports consequential decisions, keep monitoring arrangements consistent with how the business governs automated decisions, as the [governing AI decisions](/insights/governing-ai-decisions/) article describes.

## Evaluating products before buying

Many businesses buy AI features inside software rather than building them. The same principles apply. Ask vendors for evidence of evaluation on tasks like yours, but run your own trial on a sample of your own documents and questions, scored against your own criteria. Ask how the vendor tests model and prompt changes, how customers are told about them, whether you can pin a version or test changes before they reach you, and what logs and reports you can access. A vendor that cannot answer these questions is asking you to accept unmeasured risk.

## Reporting and go or no-go decisions

Present evaluation results so decision-makers can act: a scorecard against each acceptance criterion, the most serious failure types with examples, known limitations, safety findings, cost and speed, and a recommendation to release, release with conditions or hold. Name the person who approves release, and record the decision.

## A worked example

This is an illustrative example. A professional services firm deploys an assistant that summarises client contracts for its staff, highlighting key terms such as liability caps, indemnities, termination rights and payment terms.

**Evaluation design.** The firm assembles a gold dataset of 200 past contracts, with reference lists of key clauses and their effect prepared by experienced staff. The rubric scores correctness, completeness of key terms, groundedness in the contract text and clarity. Two reviewers score a sample of 50 summaries to calibrate a judge model, which agrees with the human consensus on about 85% of scores; disagreements are reviewed by people. Acceptance criteria require at least 95% recall of indemnity and liability clauses, no invented terms and a sampled human review before each release.

**Regression in action.** Some months later, the model provider releases an update. The regression pipeline runs automatically and shows indemnity clause recall falling from 96% to 88%, while other scores are unchanged. Release is blocked. Investigation shows the new model summarises long clauses more aggressively. The prompt is adjusted to require each indemnity clause to be listed separately with its reference, recall returns to 97%, and the release proceeds with the evaluation record attached.

**Monitoring.** Each month, staff review a random sample of live summaries, and any missed clause is added to the gold dataset.

## Applying this in an Australian business

- **Define acceptance criteria** from the use and the consequences of errors.
- **Build a representative gold dataset**, including difficult and adversarial cases.
- **Score free text with rubrics**, calibrating any judge model against people.
- **Evaluate retrieval and generation separately.**
- **Red-team systems** that face customers or take actions.
- **Run regression tests** on every change, including provider model updates.
- **Monitor in use** and feed failures back into tests.
- **Report clearly** and record release decisions.

## Where AI evaluation goes wrong

- **Judging by demonstrations** and impressions.
- **Test sets of easy cases** that never fail.
- **Tuning prompts on the test set** until scores look good.
- **Relying only on judge models** for high-stakes outputs.
- **No retest** after model or prompt changes.
- **Ignoring cost and speed** until users complain.
- **No feedback loop** from real failures.

## Questions to ask about an AI system's evaluation

- What are the acceptance criteria, and who set them?
- What is in the gold dataset, and how representative is it?
- How are free-text outputs scored, and how was any judge model calibrated?
- What safety and manipulation tests were run?
- What happens automatically when the model or prompt changes?
- How is quality monitored in use?

## Bringing it together

Generative AI needs an evaluation system as disciplined as any quality system. Define acceptance criteria from the use and its risks, build gold datasets that reflect real and difficult work, score outputs with rubrics and calibrated judge models, evaluate retrieval, agents, safety, speed and cost, and rerun everything whenever anything changes. Monitor live use and feed real failures back into the tests. The result is AI that the business can trust today and can keep trusting as it changes.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® AI academy lessons on evaluation strategy and acceptance criteria, gold datasets, offline and online evaluation, human rubrics, judge models, retrieval and agent evaluation, adversarial testing, latency and cost testing, regression pipelines, versioning, monitoring and go or no-go reporting, together with established AI practice. The worked example is illustrative. This article is general information.*
