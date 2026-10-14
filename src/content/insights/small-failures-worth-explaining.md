---
title: "Small failures worth explaining: near misses, odd events and learning at the right level"
description: "Most businesses investigate failures by how much damage they caused, so near misses and odd events go unexplained. How to decide what deserves a look and record lessons at a useful level."
publishDate: 2026-10-04
category: "Business"
tags:
  - operations
  - process-improvement
  - systems
author: "KEVOS®"
featured: false
draft: false
---

Every business decides which problems to look into. Attention is scarce, so the failures that get explained are the ones that hurt: the lost customer, the expensive rework, the injury. Everything else is noted, fixed on the spot and forgotten. Nobody writes this rule down or debates it, but it runs every day and shapes what the business learns.

The rule usually works, because large losses tend to have large causes. It fails in one important class of case: when the cause is a flaw in a definition, a handover or an assumption, and the size of the consequence depends on circumstances rather than on the flaw. The same mismatch can produce nothing on most days and a serious loss on one. A well-known example from space exploration is the loss of a spacecraft in 1999, where investigators focused on a mismatch in the units used by different parties working on its navigation. The flaw had been there all along; the consequence arrived on one particular day.

This article explains why deciding what to investigate by the size of the damage lets chance choose your lessons, which kinds of small events are worth explaining anyway, and how to record what you learn at a level that changes more than the single item that went wrong. It is general information. Some events, such as certain workplace incidents, must be reported to regulators whatever your own rules; your state or territory safety regulator can tell you which.

## What a damage-based rule selects

In a study of post-project reviews published in 1999, J. S. Busby recorded a meeting in which someone raised a piece of equipment placed where it was awkward to maintain. It was small, cheap and needed little maintenance, so the point was dismissed as minor and the discussion moved on. Busby's comment was that this assumed minor outcomes reflect minor causes, and that maintainability was sometimes critical for that industry's customers. He was careful to say the objection was not to setting priorities, but to doing it without thinking, because then big issues are missed simply because, on a particular occasion, they happened not to have big outcomes.

A rule based only on damage has three effects that are hard to see from inside:

- **Your lessons become a biased sample.** They include causes that happened to strike under bad conditions and exclude the same causes when conditions were kind. Any sense of "what usually goes wrong" is drawn from a distorted set.
- **Near misses are excluded by design.** A near miss is an event where the cause played out fully but the consequence did not. It is the cheapest lesson a business can get, and under a damage rule it scores zero.
- **Nobody is accountable for the rule.** There is no moment where someone says "we have decided not to understand this". There is only a meeting where a small thing is mentioned and the conversation moves on.

The [reviews that ask why](/insights/reviews-that-ask-why/) article covers other findings from the same research about how review meetings drift away from causes.

## Five kinds of event worth explaining regardless of damage

Write down a short rule naming events that earn an explanation however small their consequence:

1. **Handover defects.** Anything that went wrong at the boundary between two people, teams, systems, suppliers or stages of work.
2. **Definition mismatches.** Two parties using the same word, unit, standard or specification differently.
3. **Near misses on important boundaries.** Safety, legal, food safety, financial control or customer commitments, whether the boundary was crossed or not.
4. **Surprises in someone else's behaviour.** A customer, supplier or regulator doing something you did not expect is evidence that your understanding of them is wrong.
5. **Anything a competent person found strange.** The only category that catches what the other four miss.

Three quick tests help check your current habits:

- **The severity test.** Would we have looked into this if the consequence had been ten times bigger? If yes, what are we actually deciding on?
- **The level test.** Is the lesson recorded as a fact about this one item, this habit, or this kind of decision? Did anyone choose?
- **The recurrence test.** When we last explained a failure, did anyone ask whether it had happened before?

## Learn at the right level

Busby also found that diagnoses tended to be **too concrete**: too narrow and too literal. His example was a part that failed because its wall was too thin. One diagnosis is "we did not specify an adequate wall thickness", fixed by adding a line to the design rules. Another is "our designers do not understand the extremes of how customers use our products", fixed by exposing designers to customers' real conditions.

Both are true. Only the second is likely to prevent the next, different failure. The first produces a rule that catches this defect and nothing nearby. The second changes a capability.

Concrete fixes are not wrong; they are often needed. The problem is a business that only ever learns at the concrete level, adjusting rules one item at a time and never asking whether an event is an instance of something more general. For each significant finding, write it at two levels:

| Level | Example | Typical fix |
|---|---|---|
| The item | "This job's colour profile was wrong" | Add a check for this job type |
| The habit or decision | "Our briefs do not capture how the customer will use the product" | Change how jobs are briefed and quoted |

## Has this happened before?

In Busby's study, people referred to past experience several times, but never to establish whether an event was a one-off, frequent or systemic. Without that question, every failure arrives looking like a first occurrence, which is the reading that justifies the smallest response.

You cannot know whether something is unique unless you look at other jobs. That does not require a sophisticated system. A simple log of small events, recorded at a consistent level ("handover between sales and production", "supplier delivered wrong grade"), lets you answer "has this happened before?" with a count rather than a recollection. The opposite mistake is also possible: treating the past as a template for a future that will differ. The useful level is the process, not the detail. Your next job will differ in every specific and still run through very similar steps.

## Fund the looking

An investigation with no time set aside competes with today's work and loses, every time, to a sensible manager making a reasonable choice. If the rule matters, give it time: a short slot in a weekly meeting, a few hours a month for someone to review the log, or a standing agreement that any event in the five categories gets a fifteen-minute conversation within a week.

## Make small events easy to raise

Near misses and odd events are only useful if people mention them. Most go unreported, not because staff are careless, but because raising them costs something: time, awkwardness, the risk of looking incompetent or of getting a colleague into trouble. A few practical steps lower that cost:

- **Make reporting quick.** A one-line entry in a shared log or a message in a team channel is enough to start.
- **Thank people for raising problems**, especially their own.
- **Focus on the handover or the decision**, not the person.
- **Show what changed.** When a small report leads to a fix, say so. People keep reporting when they can see it matters.

The [bad news early](/insights/bad-news-early-how-a-business-teaches-people-to-speak-up/) article covers how a business teaches people whether speaking up is worthwhile.

## Turn lessons into changes, and check them

A lesson that does not change anything is a story. For each finding worth acting on, name who owns the change, what will be different and when you will check whether it worked. Prefer changes to how work is designed, briefed or handed over over simply adding another check, because added checks pile up and are rarely removed. The [retiring controls that no longer earn their place](/insights/retiring-controls-that-no-longer-earn-their-place/) article covers keeping the number of checks under control. If a fix does not work, or creates a new problem, say so and try something else. That is learning too.

## A worked example

This is an illustration. A commercial print shop with ten staff tracks only reprints that cost more than $1,000 or upset a major customer. Small problems are fixed on the spot.

The owner tries the five categories on the last month of small events and finds three worth explaining:

- **A definition mismatch.** A customer asked for "white" stock and received bright white; they wanted natural white for a wedding range. It was reprinted free.
- **A near miss.** A forklift reversing out of the paper store narrowly missed a staff member walking through a gap in the racking. Nobody was hurt.
- **A supplier surprise.** A delivery arrived with the right label but the wrong paper weight. Prepress noticed by chance.

Each gets a short conversation. The colour issue is first written up as "check stock colour with customer", a concrete fix. The owner then asks the level question, and the team recognises a broader habit: their job briefs record what the customer orders but not how the product will be used. Checking the job log for the past year, they find seven similar reprints, about $420 each or around **$2,940** in total, none large enough to trigger a review. The brief template is changed to capture intended use, and sales staff are shown examples of common mismatches.

The forklift near miss leads to the gap in the racking being closed and a marked pedestrian route. The owner checks whether the event needs to be reported to the state safety regulator and records the outcome.

The supplier surprise leads to a simple check of paper weight on delivery and a conversation with the supplier, who discovers a labelling error in its own warehouse affecting other customers too.

None of these events was costly. Each revealed something that could have been.

## How this applies to a small Australian business

- **Write down which small events deserve a look**, using the five categories.
- **Keep a simple log** of small problems and near misses.
- **Record lessons at two levels**: the item and the habit or decision behind it.
- **Ask "has this happened before?"** every time, and check the log.
- **Set aside time** for short reviews, or they will not happen.
- **Treat near misses as free lessons**, not lucky escapes.
- **Check reporting duties** for safety and other incidents with the relevant regulator.

## Signals worth watching

- Small problems fixed on the spot and never discussed.
- Near misses described as "lucky" and forgotten.
- The same kind of minor problem recurring under different names.
- Lessons recorded only as rules for one item.
- Nobody able to say how often a problem has happened.
- Reviews held only after expensive failures.

## Common mistakes

- **Letting the size of the damage decide** what gets explained.
- **Ignoring near misses.**
- **Learning only at the most concrete level.**
- **Treating every failure as a first occurrence.**
- **Expecting investigations to happen without time set aside.**
- **Using the past as a template** rather than as evidence at the level of process.

## Frequently asked questions

**Won't this create too much work?** Not if the categories are narrow and the conversations short. Fifteen minutes on the right small event can save far more later.

**Who should take part?** The people involved, plus someone from the other side of any handover. Keep it about causes, not blame.

**How do we keep a log without new software?** A shared spreadsheet with date, what happened, category, level-one lesson and level-two lesson is enough.

**What about events that turned out well?** They are worth explaining too. A surprisingly good result also means your understanding was incomplete.

**How do we stop it becoming a blame exercise?** Focus on handovers, definitions and decisions rather than individuals, and thank people who raise small problems.

**How many events should go in the log?** As many as people genuinely notice in the five categories. In a small business that might be a handful a month. If the log is empty, the problem is usually that reporting feels costly, not that nothing happens.

**What if the same person keeps appearing in the log?** Look first at what they are being asked to do, with what information and under what pressure. Repeated problems around one role often point to a handover or briefing gap rather than an individual failing.

## Questions to ask

- What rule do we actually use to decide which problems to look into?
- Which near misses have we had this year, and what did we learn?
- Which small problems keep recurring under different names?
- Are our lessons written about items, or about habits and decisions?
- Can we say how often a given problem has happened?
- Who has time set aside to look into small events?

## Bringing it together

Deciding which failures to explain by how much damage they caused lets chance choose your lessons, and it excludes near misses entirely. Write down a short rule naming events that deserve a look regardless of cost: handover defects, definition mismatches, near misses on important boundaries, surprises in others' behaviour and anything a competent person found strange. Record each lesson at the level of the item and at the level of the habit or decision behind it, ask whether it has happened before, and set aside time for the looking. Small failures are the cheapest teachers a business has.

---

*Source: KEVOS® notes, drawing on J. S. Busby, "An assessment of post-project reviews", Project Management Journal (1999), and on published accounts of the 1999 loss of the Mars Climate Orbiter. Examples and figures in this article are illustrations. This article is general information.*
