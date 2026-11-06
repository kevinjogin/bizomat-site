---
title: "Tests that cannot fail: checking whether your assurance could ever find a problem"
description: "A check that passes whether or not the problem exists tells you nothing, yet feels like assurance. How to spot tests that cannot fail, from padlocks to AI bias audits, and replace them."
publishDate: 2026-10-04
category: "Technology"
tags:
  - validation
  - ai
  - systems
author: "BIZOMAT"
featured: false
draft: false
---

For years, staff were taught that a website with a padlock icon in the address bar is safe. The padlock shows that the connection is encrypted. It says nothing about who is on the other end. Certificates are issued automatically and at no cost, so a fraudulent site can show a padlock as easily as a bank can. Checking for the padlock is a test that a fake site passes just as reliably as a real one. It discriminates nothing, but it returns a reassuring result, so it feels like protection and displaces the judgement that would actually help.

That pattern is far more common than one outdated piece of security advice. A supplier fills in its own compliance questionnaire. A policy is confirmed to exist rather than to operate. Training completion is reported as proof that staff will not be deceived. An AI tool is declared unbiased because the protected attribute was removed from its inputs. Each produces a clean result. In each case, the clean result would have appeared whether or not the problem existed.

This article explains why such tests survive, offers one question that exposes them, works through a detailed example from AI screening tools, and shows how to replace weak checks with ones that could actually find a problem. It is general information. Discrimination, privacy and other laws apply to decisions however they are made; the Office of the Australian Information Commissioner and the Australian Human Rights Commission publish relevant guidance, and legal advice is worth getting for specific situations.

## Why tests that cannot fail survive

Owners and managers rarely inspect the thing itself. They inspect a document about it: an audit, a certificate, a questionnaire, a summary. Those documents are what a business points to if a decision is later questioned.

That creates a quiet pressure. What the business asks for is a document that closes a question, and methods that reliably produce one win out over methods that sometimes do not. A check that almost always passes is easier to commission, faster to complete, cheaper to repeat and more comfortable to present. Its popularity has little to do with whether it can find anything.

The result is worse than having no check. With no check, the worry remains and someone might look properly. With a check that cannot fail, the question is closed and a record exists showing the business looked and found nothing.

## One question that exposes them

Before reading any assurance result, ask:

**What would this check have had to observe in order to report a problem, and would it observe that if the problem were actually present?**

If nobody can answer, or the honest answer is "it would show the same result either way", the check is not a control. It is a procedure that produces a document.

Applied honestly, the question does uncomfortable work:

| Check | Why it may not be able to fail | A check that could fail |
|---|---|---|
| Padlock on a website | Fake sites have padlocks too | Verifying requests through a separate, known channel |
| Staff training completion | Attendance does not show resistance to a convincing scam | A process where a deceived person still cannot complete the loss alone, such as call-back verification and dual approval |
| Supplier self-assessment | The supplier sets the scope and writes the answers | Evidence requested and checked, such as a recent backup restore test |
| "We have a policy" | Existence is not operation | A sample of actual cases checked against the policy |
| "Backups are running" | A backup job can succeed while producing unusable files | A timed restore of real data |
| AI tool "does not use" a protected attribute | The attribute may be reconstructed from other inputs | Outcome testing by group, described below |

```figure
type: compare
title: Checks that cannot fail, and ones that can
cols: Why it cannot fail | A check that could
caption: Ask what the check would have to observe to show a problem.
- Training completion | Attendance shows nothing about resisting a scam | Call-back and a second approver
- Supplier self-assessment | The supplier writes the answers | Evidence such as a restore test
- "Backups are running" | Jobs succeed with unusable files | A timed restore of real data
- *"Does not use age" | Age can be reconstructed | Outcome testing by group
```

Some weak checks are still worth running, because a failure is informative even when a pass is not. The mistake is presenting the pass as proof.

## State what you fear in terms of consequences

A related habit makes checks more useful: describe the risk in terms of what would actually hurt, not in technical terms. Instead of "we have backups", say "we must be able to issue invoices within 24 hours of losing our accounting system". Instead of "staff are trained on scams", say "no payment to a new or changed bank account can be made on the strength of an email alone".

Statements like these can be tested. Restore the accounting data on a spare machine and time it. Send a realistic test request and see whether the payment process stops it. If the result falls short, you have learned something before it mattered. The [cyber security basics](/reados/collections/business-systems-security-and-it-decisions/cyber-security-basics-for-small-businesses/) article covers the core protections against payment redirection scams and data loss.

## The AI example: removing an attribute does not remove it

A common way to "test" whether an automated decision tool is fair is to remove a sensitive attribute, such as age, sex or ethnicity, from its inputs, run the tool with and without it, and check whether results change. If they do not, the tool is declared free of bias.

The flaw is that the attribute is often **encoded in other inputs**. People's circumstances leave traces in almost everything a business records: postcode, the schools and employers in their history, gaps in employment, graduation year, language and naming patterns, purchasing and payment behaviour. None of these is a protected attribute. Together, they can carry a great deal of information about one.

If the attribute can be reconstructed from the remaining inputs, removing its label removes the label, not the information. A tool that was picking up the pattern through other inputs will produce much the same results either way. So the "remove and compare" test returns a clean result exactly when the pattern is most thoroughly built into the data. A clean result tells you about how the tool gets the signal, not whether it has one.

Two practical conclusions follow:

- **"We don't collect that attribute" is not a defence.** Whether a business recorded a characteristic is a fact about its data policy. Whether its tool acted on it is a fact about its inputs and outcomes.
- **Removing one variable is a weak fix** against a pattern spread across many. Evidence has to come from outcomes.

## Tests that can detect the problem

A more useful approach has four parts:

1. **A recoverability check.** Try to predict the sensitive attribute from the tool's other inputs. If it can be predicted much better than chance, the "remove and compare" test is void before it is run.
2. **Outcome testing by group.** Compare decision rates, and where possible error rates, across groups on real or held-out cases. This shows whether the system actually produces different outcomes.
3. **A chosen standard.** Equal selection rates, equal error rates and well-calibrated scores are different standards, and it is widely understood that they cannot all be met at once in general. Decide which you will hold yourself to, write it down and be ready to explain why.
4. **Monitoring with a pre-agreed trigger.** Decide in advance what difference would prompt action, what the action is and who can pause the tool.

There is a tension to manage. You cannot measure differences by group without knowing group membership for the people tested, yet good privacy practice says not to collect more than you need. A workable approach keeps any such information separate, used only for testing, with restricted access and never fed into the tool itself. Australian privacy principles and anti-discrimination laws both bear on this, so get advice before collecting sensitive information.

Test the whole **decision system**, not just the tool: the threshold, the human reviewer, the override rules and the appeal path all shape outcomes. A tool can be balanced while a poorly chosen cut-off or an inconsistent reviewer creates the disparity. The [governing AI decisions](/reados/collections/ai-in-business-practice/governing-ai-decisions/) article covers keeping human oversight real and planning a fallback.

## Automated errors are read as policy

One more reason to test properly: when a person makes a poor decision, it is usually treated as an individual mistake. When an automated system makes one, it is read as a policy, because the behaviour traces back to a specification, a data set and a threshold that someone approved. And because the system applies the same rule to every case, one flaw can produce hundreds of identical poor outcomes before anyone notices. Testing that could actually find problems, and records showing it was done, are part of what lets a business show it decided responsibly.

## A worked example

This is an illustration. A small recruitment agency uses three forms of assurance it has never questioned.

**Scam resistance.** All staff have completed online training on email scams, and the completion rate is reported as 100%. The owner asks what the training would have to observe to show a problem, and realises it observes only attendance. The agency adds a process control instead: any new payee or change of bank details must be confirmed by calling a number already on file, and approved by a second person. A test request sent by the owner is stopped at the call-back step.

**Backups.** The IT provider's monthly report says backups "completed successfully". The agency asks for a restore of one week's placement records to a spare laptop. The restore takes nine hours and two files are corrupted. The provider fixes the configuration, and a quarterly timed restore becomes part of the contract.

**AI screening.** The agency uses a CV screening tool whose vendor says it is "unbiased because it does not use age or gender". The owner asks the vendor whether age could be predicted from the other inputs. The vendor cannot say. The agency then looks at outcomes for a sample of recent applicants who had voluntarily provided age information in a separate, optional survey held apart from the screening tool. Applicants over 50 were shortlisted at about 9%, compared with about 21% for other applicants, for similar roles. Graduation year and total years of experience were among the inputs the tool weighted most.

```figure
type: bars
title: Shortlisting rates for similar roles
unit: %
max: 25
caption: The tool "does not use age", but graduation year and years of experience were among its heaviest inputs.
- Other applicants | 21
- *Applicants over 50 | 9
```

The agency stops relying on the tool's rejections alone: rejected applicants are now reviewed by a consultant, graduation year is removed from the criteria it controls, and shortlisting rates by age band are checked monthly, with a written trigger for pausing the tool. It also takes advice on its obligations under anti-discrimination and privacy law, and asks the vendor for evidence of outcome testing in future.

None of the three original checks was false. Each simply could not have reported the problem it was supposed to find.

## How this applies to a small Australian business

- **List the checks you rely on**: certificates, audits, questionnaires, reports, training records, vendor assurances.
- **Ask of each what it would show if the problem were present.**
- **Describe key risks in consequence terms**, then test against them.
- **Prefer process controls** that work even when someone is deceived.
- **Ask suppliers for evidence**, not self-assessments.
- **Test automated decision tools on outcomes by group**, not by removing inputs.
- **Separate testing data** from the tool, and get advice before collecting sensitive information.
- **Check current guidance** from the Australian Signals Directorate on cyber security, the OAIC on privacy and the Australian Human Rights Commission on discrimination.

## Signals worth watching

- Checks that have never once reported a problem.
- Assurance prepared by the party being assured.
- Training completion used as evidence of protection.
- Backups reported as successful but never restored.
- Vendors claiming tools are fair because an attribute was removed.
- Nobody able to say what result would count as a failure.

## Common mistakes

- **Treating a pass as proof** when a pass was the only possible result.
- **Measuring inputs** such as attendance or policy existence instead of outcomes.
- **Letting the party being checked define the check.**
- **Assuming removing a sensitive attribute removes bias.**
- **Testing the tool but not the whole decision process.**
- **Closing a question with a document** rather than evidence.

## Frequently asked questions

**Should we stop using checklists and certificates?** No. They are useful starting points. Just be clear about what each can and cannot show, and add checks that could actually fail for the risks that matter most.

**How do we test an AI tool without technical expertise?** Start with outcomes: compare results across groups on real cases. Ask vendors what testing they have done, what it could have detected and what it found.

**Isn't collecting age or similar data risky?** It can be, which is why testing data should be optional, kept separate, tightly controlled and never used in the decision itself. Get advice on your privacy obligations first.

**How often should we test backups?** Often enough that a failed restore would be discovered before you needed it. Quarterly is a reasonable starting point for many small businesses.

**What is the single most useful change?** Ask, before accepting any assurance, what it would have shown if the problem had been present.

## Questions to ask

- Which of our checks have never reported a problem, and could they?
- Who designs the checks we rely on, and do they want a particular answer?
- What risks can we state in terms of consequences we could test?
- Which of our controls still work if someone is deceived?
- How do we know our automated tools treat groups fairly in practice?
- When did we last restore our data and time it?

## Bringing it together

A check that passes whether or not the problem exists tells you nothing, yet it closes the question and leaves a record that you looked. Padlocks, training completion, self-assessments, unverified backups and "we removed the attribute" fairness tests all share this flaw. Ask of every check what it would have to observe to report a problem. State risks in terms of consequences you can test, prefer controls that work even when someone is deceived, ask for evidence rather than assertions, and judge automated decisions by their outcomes across groups. Good assurance is not the kind that always passes. It is the kind that could fail.

---

*Source: BIZOMAT notes, drawing on teaching material on cyber security guidance for business, AI fairness auditing and proxy variables, and automated decision-making governance. Examples and figures in this article are illustrations. This article is general information, not legal advice.*
