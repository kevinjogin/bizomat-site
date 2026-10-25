---
book: cad-standards-that-stick
chapterSlug: training-support-and-changing-the-standard
order: 10
title: "Training, support and changing the standard"
description: "Log and classify CAD support requests, aim training at the causes they reveal, bring new starters up to standard and run a change process that keeps the standard improving."
draft: false
---

The earlier chapters built an environment: controlled settings, templates, a property schema, a library, modelling rules, a written standard and checks. None of it stays good by itself. People join and leave, software changes, products change and the office learns things it did not know when the standard was written. The last part of a CAD administrator's job is to keep the environment and the people in step, through support, training and a disciplined way of changing the standard.

This chapter shows how the running case office logs and classifies support requests, uses the log to aim training, brings a new starter up to standard and runs its change process. It closes the loop on the measures set in Chapter 1. Its error case is a well-meant quick fix that undid part of Chapter 3.

## Log every request

Before the charter, CAD support in the office happened by interruption. Someone leaned over a partition, the administrator answered, and the question disappeared. The same question was answered many times, nobody knew how much time support took, and nothing about the pattern of questions reached the people who could fix the causes.

The charter introduced a simple log: a shared list where each request is recorded with the date, the requester, a one-line description, a category, the time taken and the outcome. Recording takes about a minute. Urgent problems are still answered at once; the log entry is made afterwards.

Over the first **13 weeks** after the log began, it recorded **126** requests. Their average handling time was about **18 minutes**, so support took **126 × 18 ÷ 60 = 37.8 hours**, about **2.9 hours a week**. That was most of the administrator's four-hour allowance, leaving little for the improvement work in the plan.

## Classify by cause, not by symptom

A request such as "my drawing shows the wrong material" is a symptom. Its cause may be a template, a property, a library item, a software fault or a misunderstanding. The log classifies each request by its cause, decided when it is resolved, because causes point to fixes.

```figure
type: bars
title: Support requests in 13 weeks, by cause
unit: requests
max: 60
caption: This is an illustration. The 126 requests are classified by the cause found when each was resolved.
- *Templates and properties | 52
- Library parts | 27
- Modelling and rebuild problems | 22
- Software and licences | 15
- Hardware, routed to IT | 10
```

The five categories sum to **52 + 27 + 22 + 15 + 10 = 126**. Templates and properties account for **52 ÷ 126 ≈ 41%**. Reading the 52 entries showed that most were not faults in the templates at all but uncertainty about them: which template to use for a weldment, which properties to complete at which stage, how to fix a blank in a title block. The templates were doing their job; the people using them had not been shown how.

The hardware requests were passed to IT and closed in the log with a note. Recording them still mattered, because they showed that the graphics card in seat 4, already identified in Chapter 2, was generating repeat requests and moved its replacement up IT's list.

## Aim training at the biggest cause

With the log's evidence, the administrator ran a 90-minute session on templates and properties for all six staff. It covered the nine templates and when to use each, the property schema and its stages, the description convention and the five most common questions from the log, each worked through on a real file.

The session cost **1.5 × 6 = 9 person-hours**, or **A$855** at the internal rate. In the following 13 weeks, template and property requests fell from **52** to **19**. The administrator's time saved was about **(52 − 19) × 18 ÷ 60 = 9.9 hours** in the quarter. Each request also cost its requester, by their estimate, about ten minutes of waiting or interruption, so a further **33 × 10 ÷ 60 = 5.5 hours** was saved across the office.

```figure
type: compare
title: Effect of the templates and properties session
cols: Quarter before | Quarter after
caption: This is an illustration. The fall may not all be due to the session, since people also became more familiar with the templates over time.
- Template and property requests | 52 | 19
- Administrator handling time | 15.6 hours | 5.7 hours
- *Time saved in the quarter, all staff | | about 15.4 hours, worth about A$1,463
- Cost of the session | | 9 person-hours, A$855
```

The saving in one quarter, about **A$1,463**, already exceeded the session's cost. The comparison is not a controlled experiment. Some of the fall would have happened anyway as people grew used to the new templates. But the size and timing of the drop made it reasonable to credit much of it to the session, and the approach, aiming training at the largest category in the log, was repeated for other causes.

## Bring new starters up to standard

A new starter is the easiest person to train well and the easiest to train badly. Left to pick things up from colleagues, they inherit whatever habits sit nearest. Given a short, deliberate introduction, they start with the standard as it is meant to be.

```figure
type: timeline
title: First two weeks for a new CAD user
caption: This is an illustration of the running case office's onboarding. The total administrator time is about six hours.
- Day 1 | Environment | seat built from the controlled settings; tour of the register, templates and library, 1 hour
- Days 2–3 | The standard | read the written standard; build a cross-member using it, without help
- Day 4 | Review | go through the cross-member with the administrator against the checklists, 1 hour
- Week 2 | Supported work | first real task with a nominated mentor; first drawings peer-checked with extra care
- *End of week 2 | Feedback | new starter's questions about the standard are logged as change requests
```

The last step makes onboarding useful to the office as well as to the new starter. As Chapter 8 noted, a newcomer is the best reviewer the written standard will get. Their questions show where the document assumes knowledge the reader does not have.

The mentor in week 2 need not be the administrator. A designer who knows the standard well and has the patience to explain it can mentor more effectively than an administrator with four hours a week, and mentoring builds a second person who understands the environment deeply. In the running case office, the senior designer became both mentor and the administrator's named backup.

## Grow a second expert

An environment understood by one person is fragile. If the administrator leaves, the register, the reasons behind the settings and the knowledge of where problems hide go with them. The charter's backup person is the first defence, but a backup who has only read the register is not much help in a crisis.

The office developed its senior designer deliberately. Each quarter the designer took on one piece of administration work with the administrator's guidance: maintaining the library request list for a quarter, running the monthly sample, building and testing one template revision. By the end of the first year, the designer had done each of the routine tasks at least once and could act alone for a few weeks. That cost perhaps an hour a week of the designer's time and repaid itself the first time the administrator took leave during a busy period.

Power users often emerge on their own: the person colleagues already ask, who enjoys solving CAD problems. They are natural candidates, but enthusiasm is not the only qualification. The backup must also be willing to follow the change process, including when their own preferred solution is declined.

## Use outside help well

The office is small, and not every question can be answered inside it. Three outside sources are useful, each with its own limits.

The software reseller's support line can confirm whether a behaviour is a known defect, supply fixes and advise on installation problems. Its value depends on a good report: which version and service pack, which file, what was expected and what happened, and whether it happens on other seats. The log makes such reports quick to assemble.

User forums and user groups are good for questions about technique and for learning how other offices solve problems. They are not the place for the office's files. Before posting a model or screenshot, remove anything that identifies a customer, a product under development or a confidential design, or recreate the problem in a simple test file. A simple test file is usually better anyway, because it shows that the problem is in the software rather than in one complicated model.

Training providers can teach general CAD skills more efficiently than the administrator. The office uses outside courses for new software modules and keeps internal sessions for its own standard, which no outside course can teach.

## The error case: a quick fix that undid the standard

In month five, a designer reported that a large assembly opened very slowly on their seat. The administrator was away for a week. The designer asked a colleague, who suggested changing an option controlling how the software searched for referenced files, so that it stopped searching the library folder first. Opening was faster. The colleague made the same change on their own seat, since it seemed to help.

Three weeks later, the quarterly settings comparison from Chapter 3 found two seats differing from the controlled file on one result setting. Investigation showed that, with the library no longer searched first, both seats had been resolving three fastener references to stray copies inside an old project folder. Two assemblies saved on those seats now referenced the stray copies instead of the library items, and their bills of materials showed the old, inconsistent descriptions from before Chapter 6's clean-up.

The quick fix had treated a symptom and reintroduced one of the faults the office had spent months removing. The underlying cause of the slow opening turned out to be different: a network path to an old archive folder that timed out on each search. Removing the archive path from the search list, centrally, solved the speed problem on every seat without changing the order of search.

The office drew three lessons from the incident:

1. **Fixes to shared settings go through the log**, even when the administrator is away. The backup person named in the charter has authority to make an urgent change centrally and record it.
2. **The quarterly comparison earned its keep.** Without it, the two seats would have continued to drift, and the stray references would have spread with every assembly saved.
3. **A setting that changes speed can change results.** The search-order setting looked like a performance setting to the people who changed it. Chapter 3's classification correctly treated it as a result setting, and the written standard now says why in plain words.

The two affected assemblies were corrected by replacing the stray references with library items, and the stray copies in the old project folder were moved to the archive so they could not be found by accident again.

## Change the standard deliberately

A standard that never changes becomes obsolete; one that changes constantly cannot be learned. The office collects change requests continuously on the request list and decides them at a quarterly review, releasing accepted changes together with a new revision of the standard and, where needed, the templates.

In the first year the office received **48** change requests. It accepted **21**, declined **15** with recorded reasons and deferred **12** pending more evidence or a related change.

```figure
type: stack
title: Fate of 48 change requests in the first year
unit: requests
caption: This is an illustration. Declined and deferred requests are kept with their reasons; a request that keeps returning is evidence of a real need.
- Accepted and released | 21
- Declined with reasons | 15
- Deferred for evidence or a related change | 12
```

The reasons for declining matter as much as the acceptances. The most common was that a request asked the standard to control a personal preference, such as a colour scheme, which Chapter 3 deliberately leaves to individuals. The next most common was that a request would have added a rule that could not be checked.

Software upgrades are a special kind of change, because they can alter settings, templates, scripts and models all at once. Before any major release reaches the office, the administrator repeats a small regression test: the Chapter 2 reference model timed again, the template release test from Chapter 4 and the automated check from Chapter 9 run against files with known faults. Upgrading in a controlled way is a large subject in its own right, but those three tests catch most of what an upgrade can break in the environment this book has built.

## Close the loop on the charter's measures

Chapter 1's charter set measures for the role. After a year, the office could report on each:

- **Reissues from environment causes** fell from eleven in the baseline year to two, both traced to files made before the standard.
- **Sampled drawings meeting the standard** rose from about 63% in the first month to about 87% by month six.
- **Support requests** shifted towards requests for additions rather than explanations of differences.
- **Standard-part files created outside the library** fell from an estimated 140 in six months to a counted 9.

None of these is a precise measurement of value, and the book has been careful to say so throughout. Together they show an environment that behaves more consistently, costs less to support and gives the office a basis for its next decisions, which is what the four hours a week were for.

## Exercise: justify a second session

The modelling and rebuild category had 22 requests in the quarter. The administrator proposes a two-hour session on the modelling rules for all six staff and expects it to halve these requests. Using an 18-minute handling time and 10 minutes of requester time per request, is the session worth running on support savings alone over a year?

**Answer.** The session costs **2 × 6 = 12 person-hours**, or **12 × 95 = A$1,140**. Halving 22 requests saves **11 requests a quarter**. Over four quarters, administrator time saved is **11 × 18 ÷ 60 × 4 = 13.2 hours**, and requester time saved is **11 × 10 ÷ 60 × 4 ≈ 7.3 hours**, a total of about **20.5 hours**, worth about **A$1,950**.

On support savings alone the session repays its cost within the year, provided the halving is roughly right. The stronger argument lies elsewhere: Chapter 9 found that modelling rules had become the main cause of non-compliance in the monthly sample, and rebuild failures like the side member in Chapter 7 cost far more than a support request when they reach a quote or a drawing. Run the session, then check both the log and the sample to see whether it worked.
