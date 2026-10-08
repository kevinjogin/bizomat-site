---
title: "Fair use of AI in hiring and people decisions: bias, testing and human review"
description: "AI tools can screen applications and rate staff quickly, and can repeat past unfairness at scale. How to choose, test and govern them so people decisions stay fair and explainable."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - people
  - systems
author: "KEVOS"
featured: false
draft: false
---

A small business advertising a warehouse role receives 400 applications. A recruitment platform offers an AI tool that reads every CV, scores each against the job and produces a shortlist in minutes. Another tool analyses recorded video interviews. A third promises to rate staff performance from system data. For a business without an HR department, the appeal is obvious: decisions that would take days take minutes.

People decisions are among the most consequential a business makes. A rejected applicant or an overlooked employee has a livelihood at stake, and the business carries legal obligations about fairness and discrimination. AI tools learn from data, and data about past hiring and performance carries the patterns, and sometimes the unfairness, of past decisions. A tool can repeat those patterns quickly and at scale, in ways that are hard to see because nobody reviews the hundreds of applicants it quietly set aside.

This article explains where AI is used in people decisions, how bias gets in, how to test a tool before relying on it, what human review needs to look like, and how to keep candidates and staff informed. It is general information, not legal advice. Australian anti-discrimination laws, the Fair Work Act, privacy law and some state workplace surveillance laws can all apply to how you recruit and manage people. The Australian Human Rights Commission, the Fair Work Ombudsman and the Office of the Australian Information Commissioner publish guidance, and an employment lawyer can advise on a particular tool.

## Where AI appears in people decisions

| Use | What the tool does | Risk level |
|---|---|---|
| **Scheduling and admin** | Books interviews, sends reminders | Low |
| **CV screening and ranking** | Scores applications against a job | High: decides who is seen |
| **Assessments and video analysis** | Rates answers, tone or behaviour | High: often hard to explain |
| **Learning recommendations** | Suggests training | Moderate: can narrow opportunity |
| **Performance insight** | Combines data into scores or flags | High: affects pay, promotion and discipline |
| **Rostering and workload** | Allocates shifts and tasks | Moderate to high, depending on effect on hours and pay |

The higher the stakes for the person, the stronger the controls need to be. Using AI to book interviews is very different from using it to decide who gets one.

## How bias gets in

- **Historical data.** A tool trained on who was hired or promoted in the past learns those patterns, including any unfairness in them.
- **Proxies.** Removing a sensitive field such as age or gender does not remove the information. Postcode, gaps in employment, names, schools, hobbies or writing style can stand in for it. Career gaps, for instance, often reflect caring responsibilities or illness.
- **Unrepresentative data.** A tool may work well on average and poorly for groups that were under-represented in the data it learned from.
- **Measuring the wrong thing.** A tool that scores "enthusiasm" in a video, or keyword matches on a CV, may measure presentation rather than ability to do the job.
- **Disability and adjustments.** Timed online tests, video analysis and chat assessments can disadvantage people with disability unless alternatives and reasonable adjustments are available.

## Define the job before you configure the tool

A screening tool can only be as fair as the criteria it applies, and many unfair outcomes start with a vague or inflated job description. Before configuring anything, write down what the role genuinely requires:

- **Essential requirements**: the skills, licences, physical capabilities and availability the work actually needs, stated in terms of the tasks.
- **Desirable extras**: useful but not necessary, and never used as automatic filters.
- **Things that are not requirements**: a degree for a role that does not need one, unbroken employment history, or experience in a particular brand of software that can be learned in a week.

Be especially careful with **knockout questions**, the yes-or-no questions that automatically exclude an applicant. A knockout on "Do you hold a current forklift licence?" may be reasonable for a forklift role. A knockout on "Have you worked in a warehouse for five years?" may exclude capable people for no good reason, and nobody will ever see who was excluded. Every hard filter should be traceable to an essential requirement.

## Before you buy: questions for the vendor

- **What exactly does the tool assess**, and how is each factor linked to performance in the job?
- **What data was it trained on**, and how similar is that to your applicants and roles?
- **How has it been tested for differences in outcomes** between groups, and can you see the results?
- **Can it explain** why an individual was ranked or rejected?
- **What can you configure**, and what is fixed?
- **What happens to applicants' data**, where is it stored and for how long?
- **How are reasonable adjustments** and alternative formats supported?

A vendor that cannot answer these clearly is asking you to take responsibility for decisions you cannot explain. The [is the AI good enough to rely on](/insights/is-the-ai-good-enough-to-rely-on/) article covers testing AI against your current process more generally.

## Test it on your own decisions

Before relying on a tool, run it alongside your normal process:

1. **Define what a good decision looks like** for the role, in job-related terms.
2. **Run the tool and your people in parallel** on the same applications.
3. **Review a sample of the tool's rejections** by hand. Are capable candidates being screened out, and why?
4. **Compare outcomes across groups** where you lawfully have the information, for example from voluntary diversity questions, and investigate large differences.
5. **Check which factors drive the scores.** If something unrelated to the job matters a lot, reconfigure or reject the tool.

Repeat these checks periodically after deployment, because applicant pools, job requirements and vendor models change. The [governing AI decisions](/insights/governing-ai-decisions/) article covers recording what automated systems may decide and planning a fallback.

## Comparing outcomes between groups

One practical check is to compare **selection rates**: the share of applicants from each group who move to the next stage. If 20% of one group is shortlisted and 10% of another, the second group's rate is half the first. A large gap does not prove the tool is unfair, because the groups may differ in relevant experience, but it does call for investigation into which factors are driving it.

Two cautions apply. Small numbers make rates noisy: with 15 applicants in a group, one or two decisions can swing the result, so look at several months together before drawing conclusions. And you can only compare groups you have information about, which usually means voluntary, clearly explained questions kept separate from the selection process. Where you have no group information, reviewing rejected applicants by hand remains the most useful check.

## Make human review real

"A human makes the final decision" means little if the human only sees the tool's shortlist and never the people it rejected. Real review means:

- **Someone accountable** for each decision, with the authority to overrule the tool.
- **Access to the reasons** behind the tool's output, not just a score.
- **Review of rejections, not only selections**, at least by sampling.
- **Time to review properly.** If a person is expected to approve hundreds of recommendations an hour, the review is a formality.
- **Clear criteria** for when to depart from the tool's recommendation.

## Keep people informed and give them a way to respond

Tell applicants and staff when AI is used in decisions about them, what it assesses and how they can ask for a human review or an adjustment. Offer an alternative way to apply or be assessed for people who need it. Keep records of decisions and reasons, because you may need to explain a decision later to the person affected or to a regulator. Openness also tends to improve the quality of applications and staff trust.

## Handle applicant and staff information carefully

AI tools often collect more information than a traditional process, including recordings, test responses and data inferred from them. Collect only what the decision needs, tell people how it will be used, agree with the vendor how long it is kept and where it is stored, and make sure it is deleted when no longer needed. Ask whether the vendor uses your applicants' data to train its models for other customers.

Privacy obligations depend on the size and type of business and on whether the information relates to job applicants or existing employees, and the rules about automated decisions have been changing. The OAIC publishes current guidance, and an adviser can confirm what applies to you.

## Performance and monitoring tools need extra care

Tools that score staff performance from system data, or monitor activity, raise further issues. They measure what is easy to capture, which may not be what matters, and they can push people to game the measure. Workplace surveillance rules vary between states, and some require notice to employees. Use such data as one input to a conversation, not as an automatic verdict, and never as the sole basis for discipline. The [measuring employee performance fairly](/insights/measuring-employee-performance-fairly/) article covers fair performance measurement more broadly.

## A worked example

This is an illustration. A 45-person logistics business receives about 400 applications a month for warehouse roles. It trials a CV screening tool from its recruitment platform, which ranks applicants and suggests a shortlist of about 40.

Before switching off its manual process, the operations manager runs both in parallel for a month and reviews a random sample of 50 applicants the tool rejected. Nine of them look well suited to the role: they have relevant warehouse experience but were ranked low. About 360 applicants a month are not shortlisted, so if the sample is representative, roughly 65 suitable people a month were being set aside without anyone seeing them. Looking at the tool's explanation of its scores, the manager finds three patterns. Applicants with employment gaps are ranked down. Applicants who did not mention a driver licence are ranked down, although the role does not require one. And applicants from postcodes further from the depot score lower, which may reflect commuting but also screens out areas with higher unemployment.

The business reconfigures the tool to use only job-related criteria: warehouse experience, forklift licences where relevant, availability for the shifts required, and a stated willingness to commute. It removes the scoring of employment gaps and the driver licence criterion. A video interview add-on that rated "enthusiasm" is not adopted, because nobody can explain how it relates to doing the job.

For the next three months, a supervisor reviews a random sample of 30 rejections each month as well as the shortlist. The job advertisement explains that applications are screened with the help of software, and gives a phone number for anyone who wants to apply another way or needs an adjustment. The operations manager reviews the shortlist mix and the rejection sample each month. In the third month, the sample turns up only one candidate the supervisor would have shortlisted, and the business keeps the reduced sampling as a standing check.

## How this applies to a small Australian business

- **Match controls to the stakes**: admin tools need less; screening and performance tools need more.
- **Ask vendors hard questions** before buying.
- **Run tools in parallel** with your current process first.
- **Review samples of rejections**, not just shortlists.
- **Remove factors unrelated to the job.**
- **Tell people when AI is used** and offer alternatives and adjustments.
- **Keep records** of decisions and reasons.
- **Check your obligations** with the Australian Human Rights Commission, Fair Work Ombudsman, OAIC or a lawyer.

## Signals worth watching

- Shortlists that look less diverse than the applicant pool.
- Capable applicants found among the rejections.
- Scores nobody can explain.
- Reviewers approving recommendations in seconds.
- No alternative for applicants who need adjustments.
- Performance scores used as automatic verdicts.

## Common mistakes

- **Assuming removing sensitive fields removes bias.**
- **Reviewing only the shortlist.**
- **Buying tools whose criteria cannot be explained.**
- **Using AI scores as the sole basis** for rejection, promotion or discipline.
- **Not telling people** that AI is involved.
- **Testing once** and never again.

## Frequently asked questions

**Is it legal to use AI in recruitment in Australia?** Using software is not unlawful in itself, but the business remains responsible for discrimination, privacy and fair treatment in its decisions, however they are made. Get advice on your specific use.

**Can we collect diversity data to test for bias?** Voluntary, clearly explained diversity questions can help, but handle the information carefully and in line with privacy obligations. Seek advice before collecting sensitive information.

**What if the vendor says the tool is unbiased?** Ask for the evidence, and test it on your own applicants. A claim is not a test.

**Do small businesses really need this much care?** The care should match the stakes. A tool that decides who gets an interview affects people's livelihoods, whatever the size of the business.

**Can AI help reduce bias?** It can, for example by applying consistent job-related criteria. But only if it is designed, tested and monitored with that aim.

## Questions to ask

- What decisions about people is AI already influencing in our business?
- What does each tool assess, and is it related to the job?
- Have we reviewed the people it rejected?
- Who is accountable for each decision, and can they overrule the tool?
- Do candidates and staff know AI is used, and how to ask for review?
- When did we last check outcomes across groups?

## Bringing it together

AI can make people decisions faster and more consistent, and it can also repeat past unfairness at scale. Match controls to the stakes, question vendors closely, and test tools on your own decisions before relying on them, including samples of the people they reject. Remove factors unrelated to the job, keep human review real, tell people when AI is involved and offer alternatives and adjustments. The business remains responsible for every decision, however it was made.

---

*Source: KEVOS notes, drawing on earlier KEVOS handbooks on responsible AI in human resource management and on algorithmic bias risk controls and fairness audits. Examples and figures in this article are illustrations. This article is general information, not legal advice.*
