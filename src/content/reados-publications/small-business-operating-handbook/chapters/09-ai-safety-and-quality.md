---
book: small-business-operating-handbook
chapterSlug: ai-safety-and-quality
order: 9
title: "Protect information and verify AI work"
description: "Create simple AI operating rules that reduce leakage, wrong advice, unreviewed publication and unsupported business claims."
draft: false
---

Responsible AI use begins with limits rather than tool selection. A system that saves time but discloses customer records, invents product claims or makes an unapproved financial commitment has failed the business.

## Decide what data is permitted
Create a classification scheme. **Public:** approved website copy and published specifications. **Internal:** operational procedures and aggregated non-sensitive figures, subject to tool approval. **Confidential:** customer identities, contractual prices, employee records, private contact details, unreleased designs or commercial discussions. **Restricted:** passwords, payment credentials, identity documents and highly sensitive information. Do not place confidential or restricted data into a service unless there is a specifically approved and suitable arrangement, controls and legal basis.

Avoid relying on a single instruction such as 'keep this confidential' to make a third-party system secure. Access permissions, retention, provider terms, organisational settings and human practice matter.

```figure
type: layers
title: Classify data before it reaches an AI tool
caption: An instruction to "keep this confidential" does not make a third-party system secure; permissions and settings do.
- Public | approved website copy, published specifications
- Internal | procedures, aggregated non-sensitive figures
- Confidential | customers, prices, employee records, designs
- *Restricted | passwords, payment credentials, identity documents
```

## Verify every important answer
For financial advice, check arithmetic against a calculator and your records. For legislation or obligations, consult the current official authority or adviser. For marketing, substantiate claims before publication. For engineering or safety, require qualified review and relevant technical validation. For generated code or automation, test safely before granting production access.

## A small-business approval matrix
**Low risk:** internal brainstorming or first-pass formatting of public information; a designated user reviews. **Moderate risk:** operational templates and customer communications; an accountable owner confirms facts and tone. **High risk:** tax interpretations, contractual commitments, employment decisions, financial transfers or regulatory instructions; qualified review, explicit approval and an audit trail are required.

```figure
type: layers
title: A small-business approval matrix
caption: The higher the risk, the more qualified and accountable the reviewer must be.
- Low risk | brainstorming, formatting public information · a designated user reviews
- Moderate risk | templates, customer messages · an accountable owner confirms
- *High risk | tax, contracts, employment · qualified review before use
```

## Failure and escalation
Define when the AI-assisted process stops: source information is missing, figures do not reconcile, the answer claims certainty without evidence, a privacy concern arises or repeated outputs fail quality checks. Record the error and repair the workflow rather than asking the model to sound more confident.

## Sample internal policy
Only business-approved AI tools may be used for business work. Do not enter credentials, personal customer information, confidential agreements or unreleased client material without explicit authorisation and controls. Verify key claims and calculations. No AI output is a binding instruction or authority to publish, purchase, pay or commit. Keep an accountable human owner and retain records of consequential decisions.

## Simple quality test
Assess five dimensions from 1 to 5: factual accuracy, completeness, clarity, privacy compliance and usability. Set a pass threshold before the pilot. If an output contains a critical privacy, legal or safety error, mark it failed regardless of the average score.

## Exercise
Pick three common uses of AI. Classify data sensitivity, approval level, verification method and stop rule. Share the one-page policy with anyone who may use AI on the business's behalf and revisit it as providers or workflows change.

*KEVOS educational guidance. Review actual provider data handling and current laws before using business information.*


## Extended study: professional practice

### Identify what the system can access

Before approving an AI tool, inspect which conversations, files, email, calendars, repositories or business systems it can read and which actions it may take. An assistant drafting a response is different from an automation with permission to send, modify or delete. Apply least privilege: only the data and action rights necessary for the specific workflow. Record the provider, account owner, plan or agreement, retention settings, access controls and business rationale. Revisit these controls when a connector is enabled or when a service changes terms. A well-written prompt cannot override the surrounding access arrangement.

### Classify information before sharing

Use four tiers, with examples. Public: published product information and approved site copy. Internal: general operating procedures, anonymised aggregate figures and draft schedules. Confidential: client agreements, employee files, supplier prices and unreleased designs. Restricted: credentials, identity documents, private banking details and security recovery information. Define acceptable destinations for each tier. Redaction must remove identifiers and indirectly identifying details; replacing a name while preserving a unique order number may still reveal a customer. For sensitive business data, choose approved environments and seek appropriate privacy and contractual advice.

### Prevent fabricated authority

A language model can sound certain when it is wrong. Require source evidence for tax, legal, safety, regulatory or financial statements. A response claiming a law commenced on a particular date should identify the current regulator page and the effective date; a claim about revenue should come from company records rather than an invented benchmark. Separate suggestions from decisions. A suggestion may be assessed and rejected; an approved decision has a named accountable person, evidence and recorded authorisation. Never publish AI-generated testimonials, results or customer stories that did not occur.

### Test difficult and adversarial cases

A realistic evaluation set includes typical examples, missing information, ambiguous instructions, incorrect amounts, conflicting source documents and attempts to induce unauthorised actions. For a quotation generator, try a missing unit, a mismatched drawing revision and a requested rush date that exceeds capacity. The workflow should flag or halt rather than confidently invent a specification. If a connected document contains text instructing the AI to ignore its rules, the system must treat it as untrusted content rather than higher-priority authority. Re-test when models, prompts or data integrations change.

### Build human approval into the workflow

For low-risk drafting, a trained reviewer may confirm factual quality before distribution. For contracts, financial transfers, employment decisions, legal representations and public technical claims, require explicit approval by an authorised or qualified person. Log who reviewed, which source was checked, what changed and when the final output was used. Approval should occur after the complete final output is visible, not be assumed from an earlier request. An efficient system makes review easy while retaining accountability and traceability.

### Know when to stop

Set rejection conditions that cause a workflow to halt: insufficient source data, irreconcilable figures, confidential content outside approved boundaries, unsupported legal claims, critical errors in a test or a request that exceeds the system's authorised scope. Create an incident process that captures what happened, the potential exposure, immediate containment, human owner, affected parties where appropriate and corrective action. Treat repeated corrections as evidence the process needs redesign. Do not accept a weaker quality standard merely because AI generates answers quickly.

### A one-page assurance register

For each AI-assisted activity record purpose, data classification, authorised model or service, integrations, human owner, source-of-truth records, verification steps, approval method, logs, retention requirement, incident contact and next review date. Test at least five real or synthetic cases before production use. Where the tool touches personal information, customer contracts, payroll or regulated subjects, obtain advice tailored to the business. Sound governance is not a thick policy document; it is a set of controls people can follow and demonstrate.

## Primary learning references

- [Australian Government small-business guidance](https://business.gov.au/).
- [ATO](https://www.ato.gov.au/) for current Australian tax and super requirements.
- [Fair Work Ombudsman](https://www.fairwork.gov.au/) for employment requirements.

**Study note:** Worked numbers and scenarios are educational illustrations, not actual client records or promises of commercial results.


## Implementation laboratory: AI access, quality and approval controls

### Define a realistic starting point

Before changing anything, create a baseline record dated at the beginning of the exercise. State what is currently happening, who owns the process, what happens when it fails, and what evidence is available. For this topic, give special attention to **confidential information entering an unapproved workflow**. A single recent incident is not necessarily a representative trend, so look for several examples where available. If the process is entirely new, say that there is no observed baseline and use a synthetic rehearsal rather than describing assumptions as history.

Write a one-sentence objective in the form: "Over the next four weeks we want to improve [measurable outcome] while maintaining [quality or safety requirement]." Avoid using a vague outcome such as working harder, being more professional or creating growth. A useful objective contains an observable difference and a control that prevents apparent efficiency from concealing new problems.

### Identify the people and decision boundaries

Consider the different responsibilities of the **data owner, system administrator, business approver and reviewer**. In a microbusiness one individual may hold several roles, but those roles should still be conceptually separated. Identify who prepares the information, who checks it, who approves a change, who carries it out and who records the result. If outside advice is required, identify the point at which the process must pause for that advice. Avoid giving software or an AI assistant implicit authority to make legal, financial or employment commitments.

Prepare a short responsibility table with the columns *Input owner*, *Process owner*, *Independent check*, *Final approver* and *Backup contact*. For a sole trader, the independent check may be a periodic external professional review instead of a second employee. The objective is accountability, not artificial complexity.

### Build a small evidence package

An evidence package should contain the current procedure, one or more real or simulated examples, relevant figures, the expected output and a list of known exceptions. Remove confidential personal information from teaching materials. For a real business, store operational evidence in an approved private location with access limited to the people who need it. Link each figure to its source instead of copying it manually between documents without a reference.

Separate observed facts from forecasts and estimates. An observed payment date is a fact; a future customer's payment is an assumption, even when it is a reasonable one. A change in accounting classification or business circumstances may alter which facts are comparable. Mark missing information explicitly and assign responsibility for collecting it.

### Work through an exception rather than only the easy case

Normal scenarios are useful for learning the steps; exceptions test the quality of the process. Imagine that **confidential information entering an unapproved workflow** occurs just before an important customer or statutory deadline. Which facts would you need immediately? Which decisions can be made under the existing authority? Which tasks could be paused safely? How would the customer, supplier, employee or adviser be informed where appropriate? What written record would be necessary to explain the response later?

Run the situation twice. First follow the present procedure. Then follow the improved procedure and compare clarity, elapsed time, error risk and confidence in the information. Note where the new approach merely moves work to another person. An effective improvement should not reduce one person's workload by hiding costs or risk elsewhere.

### Choose a review metric and define it precisely

The principal indicator for this exercise is **critical errors, access exceptions and review pass rate**. State the numerator, denominator, measurement period and data source where applicable. Decide what level of movement would be meaningful before seeing the results. Pair a speed or output measure with at least one quality indicator. For example, a process that closes actions more quickly but increases uncorrected mistakes has not clearly improved.

Review results using a small table: *Period*, *Baseline or target*, *Actual*, *Difference*, *Reason*, *Corrective action* and *Owner*. Do not infer causation from a single good week. Demand, seasonality, staff absence or unusual orders can affect outcomes independently of the process change.

### Put an approval gate before an irreversible action

The major decision boundary is **allowing write access or using sensitive records**. Before crossing it, prepare a concise decision note: the available options, evidence, total cash exposure, dependencies, legal or customer obligations, reversibility, downside risk and the person authorised to approve. If information is missing, a smaller pilot may be preferable to a permanent commitment. Refusing to invent an uncertain input is a sign of a trustworthy process.

Agree a review date and an exit rule. An exit rule might limit an experiment to a fixed amount of money, a defined sample size or a certain number of weeks. The rule should be proportionate to the risk rather than copied from another business. Keep written approval evidence for consequential commitments and use specialist advice where required.

### Complete a four-week practice cycle

**First week:** Describe the present method and collect baseline evidence. Do not redesign everything at once. Check whether the records can support **critical errors, access exceptions and review pass rate** and choose one narrow intervention.

**Second week:** Create the new procedure, checklist or template. Test it on a simple example and on a difficult exception. Document each correction and identify whether missing inputs or ambiguous responsibility caused the problem.

**Third week:** Conduct a limited live pilot where appropriate and authorised. An example of a suitably narrow outcome for this topic is **a low-risk drafting pilot with explicit sign-off**. Measure time, quality and unintended consequences. Keep the ability to return to the prior process if the pilot fails.

**Fourth week:** Compare results, collect feedback from the people affected and write a decision: adopt, refine, retest or stop. Assign an owner and future review date. If no clear benefit appears, keep the evidence but do not claim success. The purpose of a pilot is to learn accurately, not to defend the original idea.

### Reflection and transfer

Explain the principle to someone who has not read the chapter, without using jargon. Ask them to reproduce the calculation, review or process from your instructions. Any point requiring your verbal rescue is an opportunity to improve the documentation. Then consider where the same logic applies in another process: setting clear inputs, acknowledging uncertainty, naming decision rights, measuring outcomes and checking the effect on both money and people.

**Completion evidence:** a dated baseline, one-page procedure, exception test, recorded results and approved next action. These five records convert general business advice into a verifiable operating improvement.
