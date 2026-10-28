---
book: project-teams-and-contracts-by-the-numbers
chapterSlug: team-size-and-communication-paths
order: 7
title: "Team size and communication paths: how big the core team should be"
description: "Twenty people make 190 paths; a hub of seven leads makes 34. Meeting redesign saves A$127,400 a year, and a 34-name notice list costs A$114,240 yet still misses the racking supplier."
draft: true
---

Chapters 2 to 6 dealt with how money moves between the organisations. This chapter turns to the people who have to make the chosen contract work. The distribution centre's core team is twenty people from six organisations, and every one of them needs information from others to do their job. The number of possible conversations grows much faster than the number of people, and that growth, not any one person's competence, is what makes a large team slow.

The chapter counts communication paths, sets out what the research on teams says about size, and uses a simple overhead model to show how coordination eats into a working week. It then designs a team structure and a meeting pattern for the case and prices them, and ends with a distribution list that sent every design change to 34 people and still missed the one who needed it.

## Counting the paths

In a group of n people in which each must communicate with every other, the number of two-person paths is **n(n − 1) ÷ 2**. Brooks set out the count in *The Mythical Man-Month* (1975) to explain why software projects do not speed up in proportion to the people added to them: each newcomer has a path to everyone already there, so the paths grow roughly with the square of the team size while the people grow only in proportion to it.

The count is a ceiling, not a forecast. Not every pair needs to talk, and a well-organised team uses only a fraction of the possible paths. But the ceiling sets how much organising is needed, and an unorganised team drifts towards it, because without a structure nobody knows which paths can safely be left unused.

```figure
type: bars
title: Communication paths by team size, n(n − 1) ÷ 2
unit: paths
max: 330
caption: Doubling a team from 10 to 20 people would multiply the paths from 45 to 190. Each person in a team of 20 has 19 paths to keep open.
- 5 people | 10
- 7 people, the DC coordination group | 21
- 9 people | 36
- 12 people | 66
- 15 people | 105
- * 20 people, the DC core team | 190
- 22 people, the original weekly meeting | 231
- 26 people | 325
```

This is an illustration. The distribution centre's core team of 20 has **190** possible paths among its people, as Chapter 1 counted, and six organisations have 15 organisation pairs. Of the 190 people paths, 161 (84.7%) cross an organisational boundary, so most conversations on the project are between people with different employers, different managers and different commercial interests, under the contracts of Chapters 2 to 6. A path inside one organisation is cheap to maintain: the people share a manager, a system and a reason to agree. A path across a boundary often needs a letter, a register entry or a meeting.

## What the research says about team size

Hackman (2002) set out five conditions that make teams effective: a **real team**, with clear and reasonably stable membership whose members know who is in it; a **compelling direction**; an **enabling structure** of task, membership and norms; a **supportive context** of rewards, information and resources; and **expert coaching** at the right moments. In a 2009 interview in the *Harvard Business Review*, Hackman advised keeping teams small, below about ten members, because the links among members multiply as a team grows and the work of maintaining them crowds out the work itself.

By that standard the DC's core team of 20 is not a team. It is a group of people from six organisations whose work interlocks. The seven-person coordination group, one lead from each organisation plus the owner's DC manager-designate, can be a real team: small enough for every member to know the others' work, and with a clear membership that does not change from meeting to meeting. The packages beneath it, building, materials handling and systems, can each be a small team too. Chapter 9 returns to Hackman's other conditions.

## An overhead model

To see what the paths cost, assume, purely as a teaching illustration, that each path in a fully connected team takes **1 hour a week** of the two people's time in total: messages, calls, short meetings and the reading that goes with them. Each person works 38 hours a week.

This is an illustration, and the hour per path is not a research figure. A team of six has 15 paths, so 15 of its 228 weekly hours go to coordination, **6.6%**, leaving each person 35.5 hours of other work. A team of twenty fully connected has 190 paths, so 190 of its 760 hours go to coordination, **25%**, leaving 28.5 hours each. At the blended cost of A$140 an hour, excluding GST, those 190 hours cost about A$26,600 a week.

```figure
type: compare
title: Coordination overhead at 1 hour per path per week, fully connected
cols: Paths | Coordination h/week | Other work per person, h | Overhead
rowhead: Team size
caption: This is an illustration. A teaching model with a 38-hour week. Overhead grows with team size because each person's paths grow with it.
- 6 | 15 | 15 | 35.5 | 6.6%
- 9 | 36 | 36 | 34.0 | 10.5%
- 12 | 66 | 66 | 32.5 | 14.5%
- 16 | 120 | 120 | 30.5 | 19.7%
- * 20 | 190 | 190 | 28.5 | 25.0%
```

The real figure for any team could be higher or lower; what the model shows reliably is the shape. Each added person both brings 38 hours and adds n − 1 new paths, so the useful work added by the twentieth person is far smaller than that added by the sixth. The model also explains why a large team feels busy without feeling productive: a quarter of the week goes on keeping everyone informed.

## A hub structure for the DC

The answer is not to stop people talking but to decide which paths carry the project's coordination. In the **hub structure** the seven members of the coordination group are fully connected with one another, 21 paths, and each of the other 13 people works through their own organisation's lead, 13 more paths. The 20 people then need **34** managed paths instead of 190.

```figure
type: tree
title: Hub structure for the DC core team
caption: This is an illustration. Seven leads fully connected (21 paths) and 13 members linked to their own lead (13 paths): 34 managed paths in place of 190.
- Coordination group, 7 people | 21 paths among the leads, meets weekly
  - * Owner: project director | sponsor and contract administrator work through the project director
  - Owner: DC manager-designate | operational readiness, order profiles, acceptance
  - Designer: design manager | structural and civil engineer, fire and services engineer
  - Builder: project manager | site manager, contracts administrator, project engineer, safety adviser, foreman
  - Racking supplier-installer: project lead | installation supervisor
  - Conveyor and controls integrator: project lead | mechanical engineer, controls engineer
  - WMS vendor: project lead | implementation consultant
```

A hub has a cost: the leads become bottlenecks if they hoard decisions or fail to pass information on, and direct technical conversations between, say, the structural engineer and the racking installation supervisor are still needed. The hub does not forbid those paths; it makes them deliberate. A technical path that matters, such as the slab joint layout under the racking, is recorded against its interface in the register of Chapter 1 with a named owner on each side. Everything else flows through the leads.

### Where the boundaries are crossed

The hub also changes where the organisational boundaries are crossed. Of the 21 paths in the coordination group, only one, between the owner's project director and its DC manager-designate, lies inside one organisation; the other **20** cross a boundary. All 13 links from members to their own lead lie inside one organisation. So 20 of the 34 managed paths, 59%, cross a boundary, against 161 of 190 in the fully connected team, and every one of those 20 is held by a lead who answers for their organisation's commercial position.

That is where the contracts of Chapters 2 to 6 do their work. A lead who knows that a dollar saved is shared, and who sits weekly with the leads of the other five organisations, can settle in one conversation a question that would otherwise travel by letter through two contract administrators. A hub built on leads without authority does the opposite: it concentrates the boundary crossings in people who cannot decide anything, and Chapter 9 shows what that costs.

### The leads' load

The hub moves work onto the leads, and their load needs checking. Under the same teaching model of an hour a path, shared between the two people on it, the builder's project manager has 6 paths to the other leads and 5 to the builder's own people: 11 paths, about **5.5 hours a week**, before meetings. Fully connected, the same person would have 19 paths and 9.5 hours. The designer's design manager and the owner's project director each have 8 paths. The leads are the people the project can least afford to overload, and the same people whose departure Chapter 8 prices, so each should have a named deputy who knows the lead's paths.

## Who belongs in the core team

The core team is not everyone who works on the project. A useful test is that a person belongs in it if they own a decision on at least one interface in the register, or if a decision of theirs can move the programme's critical path. On the DC, the builder's foreman passes that test because sequencing on the slab decides when racking can start; the builder's estimators do not, and are reached through the contracts administrator. Designers' drafters, subcontractors' supervisors and the WMS vendor's developers are in the extended team: informed through their own lead, invited to package meetings when their work is on the agenda, but not part of the weekly coordination.

Membership should also be stable. Hackman's "real team" needs people who know who else is in it, which rules out a rotating cast sent along by whichever manager is free that week. Where an organisation's representative must change, the change is a decision, made with a handover, not a substitution at the door.

How the team itself is set up before work starts, including who is released from a day job and for how long, is covered in [Setting up a project team before the work starts: roles, day jobs and readiness](/reados/collections/project-sponsors-governance-and-decisions/setting-up-a-project-team-before-work-starts/). The same logic of small, stable teams applies to repeated work; [Experience, proven technology and keeping the team](/reados/publications/modular-projects-by-the-numbers/experience-and-the-team/) in *Modular Projects by the Numbers* shows what a stable crew is worth when the same cell is built twelve times.

## Meeting design and its cost

This is an illustration. When the works began, the project ran one weekly coordination meeting for everyone: **22 attendees** (the core team of 20 plus two subcontractor supervisors) for **2 hours**. That is 44 person-hours, or **A$6,160 a week** at A$140 an hour, and **A$320,320** over a year of weekly meetings (52 weeks). A meeting of 22 contains 231 possible paths, and in 120 minutes each attendee has on average **5.5 minutes** to speak. Most of the agenda concerned two or three organisations at a time while the others listened.

The redesign follows the hub structure. The coordination group of 7 meets for 1.5 hours a week, 10.5 person-hours (A$1,470). Three package meetings handle the detail: building and civil with 6 people, materials handling (racking and conveyors) with 6, and systems (controls and WMS) with 4, each for an hour, 16 person-hours (A$2,240). The total is **26.5 person-hours, A$3,710 a week**, or **A$192,920** over 52 weeks, a saving of **A$127,400**. In the coordination meeting each member now has about **12.9 minutes** in 90 minutes, and each package meeting has only 15, 15 and 6 paths.

```figure
type: compare
title: Weekly meetings before and after the redesign
cols: One meeting for all | Coordination group plus three package meetings
caption: This is an illustration. At A$140 an hour, excluding GST. The saving over 52 weeks is A$127,400, and every attendee has more time to speak.
- Attendees | 22 | 7, then 6, 6 and 4
- Duration | 2.0 h | 1.5 h, then 1 h each
- Person-hours a week | 44 | 26.5
- Cost a week | A$6,160 | A$3,710
- * Cost over 52 weeks | A$320,320 | A$192,920
- Paths in the room | 231 | 21, then 15, 15 and 6
- Speaking time per attendee | 5.5 min | 12.9 min in the coordination group
```

The cash saving is the smaller benefit. The larger one is that decisions are taken in a room where everyone present has a stake in them, and that each package meeting can go into the detail its interfaces need without twenty people waiting.

## The error: everyone copied, no one responsible

This is an illustration. During design development the designer issued **96 design change notices**. To make sure nobody was missed, each notice went to all 20 core team members and 14 subcontractor contacts: **34 recipients**. If each recipient spent a quarter of an hour opening, reading and deciding whether the notice affected them, the list cost 96 × 34 × 0.25 = **816 person-hours**, or **A$114,240**.

It still failed. Notice 41 changed the slab joint layout in two aisles of the racking area. Both of the racking supplier-installer's people received it with the other 95. Each assumed from its title that it concerned the builder's pour sequence, and each assumed the other would deal with it if it mattered. The racking was set out on the old joint layout; 18 base plates sat across new joints and had to be re-cut and re-anchored, costing **A$27,500**, and the racking crew stood for **4 days** at A$6,800 a day while the drawings were checked: A$27,200. The total was **A$54,700**.

The problem was found on site when the builder's foreman saw base plates marked out over a saw-cut joint. The investigation found that every one of the 34 recipients had received the notice, and none had been asked to confirm that they had acted on it. Sending to everyone had replaced deciding who needed to know.

The correction used the interface register. Each change notice now lists the interfaces it affects, and goes to the **named owner on each side** of each interface, who must acknowledge it within two working days and record any action. Notices average **6 recipients**, so the 96 notices take 96 × 6 × 0.25 = **144 person-hours (A$20,160)**, saving 672 person-hours (A$94,080) of reading. Unacknowledged notices appear in the coordination group's weekly report, so a missed notice is chased in days rather than discovered on site.

```figure
type: checklist
title: Routing a design change notice
caption: The question-marked item is this chapter's error: 34 recipients, no acknowledgement, and the two people who needed notice 41 did not act on it.
- List the interfaces in the register that the change affects | slab joints affect Designer–Racking and Builder–Racking
- Send to the named owner on each side of each affected interface | about 6 recipients per notice
- Require acknowledgement and a recorded action within two working days | unacknowledged notices reported weekly
- Copy the leads for information only where the change affects cost or programme | the hub keeps the leads aware without making them the route
- x Sending every notice to everyone so that nobody can say they were not told | 816 person-hours for 96 notices
- ? Has the person who must act on this notice confirmed that they have | both racking recipients received notice 41 and neither acted on it
```

## Exercise: three ways to organise fourteen people

The owner considers a smaller core team. Option A is a fully connected team of **9** people. Option B is a fully connected team of **14**. Option C organises the same 14 as **two sub-teams of 7**, each fully connected, with their two leads linked to each other. How many paths does each option have, and what does the comparison suggest?

**Worked answer.** Option A has 9 × 8 ÷ 2 = **36** paths. Option B has 14 × 13 ÷ 2 = **91**, two and a half times as many for 56% more people. Option C has two sub-teams of 7 × 6 ÷ 2 = 21 paths each, plus one path between the leads: 21 + 21 + 1 = **43**, less than half of option B and only 7 more than option A, while keeping all 14 people. Option C's sub-teams are each below Hackman's suggested size of about ten. Its weakness is the single path between the leads: work that crosses the two sub-teams depends on that one link, so the split should follow the interfaces with the fewest crossings, and those crossings should be in the register with named owners.
