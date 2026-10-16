---
title: "Notes on prototyping early"
description: "Why rough prototypes are often more useful than polished ones, how to decide what each prototype should learn, and how to keep early tests cheap, quick and honest."
publishDate: 2026-10-03
category: "Products"
tags:
  - prototyping
  - product-development
  - validation
  - experimentation
author: "GoCore"
featured: false
draft: false
---

There is a moment in most product ideas when the thinking has gone as far as it can. The problem has been described, the people who have it have been found, and the conversations have been encouraging. The next step is to make something.

How that step is taken matters a great deal. A prototype built too carefully, too early, can absorb months of effort answering questions nobody needed answered yet. A prototype built with a clear question in mind can answer it in days.

This article sets out a practical approach to early prototyping: treating each prototype as a question, matching its fidelity to that question, separating the different kinds of uncertainty, running tests honestly and knowing when to stop. It draws on widely used product-development practice. GoCore will add its own first-hand observations as its own prototypes progress.

## A prototype is a question

The most useful way to think about a prototype is as a question in physical or digital form. Before building anything, decide what the prototype is meant to find out.

- Will this mechanism hold the load?
- Do people understand what this screen is for without being told?
- Does this shape fit comfortably in the hand?
- Would someone pay for this outcome if it were delivered by hand?

A prototype without a question tends to grow. Features are added because they are easy, finishes improve because they look better, and weeks pass without anything being learned. A prototype with a question has a natural end: once the question is answered, the prototype has done its job.

### Write the question down

It helps to write the question, and the result that would change your mind, before building. For example: "Question: can users complete a booking without help? We will consider the design workable if at least four of five test users finish without asking for help." Writing it down makes the test harder to reinterpret afterwards.

## What is the least you need to build?

Once the question is clear, ask: what is the least that needs to be built to answer it?

Often, the answer is surprisingly little. A question about whether people understand a concept can be tested with a sketch. A question about whether people value a service can be tested by delivering it manually. A question about whether a mechanism works can be tested with rough parts, without any housing, finish or electronics beyond what the mechanism needs.

The principle is to build only the part that carries the question, and to fake, borrow or skip everything else.

## Rough prototypes invite honest feedback

Polished prototypes have a hidden cost: they invite politeness. When people see something that looks finished, they assume a lot of work has gone into it and soften their criticism. They comment on colours and details rather than on whether the idea makes sense.

Rough prototypes signal that the work is unfinished and that feedback can still change it. People feel freer to say "I don't understand this" or "I wouldn't use it". Those are exactly the reactions that are most valuable early.

Rough does not mean careless. A rough prototype must still work well enough to answer its question. But it should look provisional, so that everyone, including the people who built it, treats it as something to learn from rather than something to defend.

## Three kinds of uncertainty

Early product ideas usually carry three distinct kinds of uncertainty, and it helps to separate them.

**Does it work?** Is the core function technically possible? Will the mechanism move, the circuit respond, the software calculate correctly, the material hold up?

**Does anyone want it?** Do the people with the problem understand the solution, value it, and prefer it to their current workaround?

**Can it be made and delivered sensibly?** Can it be produced at a cost, quality and volume that make a viable business? Can it be supported, maintained and shipped?

Each needs different prototypes. A "does it work?" prototype may be ugly and unusable by anyone except its builder. A "does anyone want it?" prototype may not work at all behind the scenes. A "can it be made?" prototype explores materials, processes and suppliers.

Mixing them in one prototype usually slows everything down. Testing desirability with a fully engineered device delays learning by months; testing engineering with a polished user interface wastes effort on the wrong layer.

### Test the riskiest uncertainty first

Which uncertainty to test first depends on where the greatest risk lies. If the technology is well established but nobody is sure customers want the result, test desirability first. If customers clearly want the outcome but nobody knows whether it can be achieved, test feasibility first. The aim is to find a fatal flaw, if there is one, as early and cheaply as possible.

## Kinds of prototypes

Product developers use a wide range of prototype types. Some common ones:

| Type | What it is | Good for testing |
| --- | --- | --- |
| Sketch or storyboard | Drawings of the product or how it would be used | Whether the concept makes sense |
| Paper prototype | Screens drawn on paper, changed by hand as the user "clicks" | Software flow and understanding |
| Clickable mock-up | Linked images that simulate an app or website | Navigation, layout, comprehension |
| Looks-like model | Foam, card, 3D print or wood showing form and size | Size, shape, ergonomics, appearance |
| Works-like rig | Rough assembly of the working parts, without finish | Mechanisms, electronics, performance |
| Manual service | The outcome delivered by people instead of technology | Whether customers value the outcome |
| "Behind the curtain" test | Appears automated, but a person does the work behind the scenes | Demand before automation |
| Landing page | A page describing the offer, measuring interest | Whether people will register or enquire |
| Spreadsheet model | Calculations that mimic software logic | Whether the logic produces useful results |

The right type depends entirely on the question. The cheapest prototype that can answer the question is usually the best one.

### A note on "behind the curtain" tests

Tests in which a person secretly performs work that appears automated can be very informative, because they show whether customers value an outcome before expensive automation is built. They should be run ethically: people should not be misled in ways that harm them, data should be handled properly, and where appropriate participants should be told afterwards how the test worked.

## Matching fidelity to the question

**Fidelity** describes how closely a prototype resembles the finished product. Low-fidelity prototypes are rough and quick; high-fidelity prototypes are detailed and slow.

A common mistake is to assume that higher fidelity is always better. It is not. Fidelity should match the question:

- Testing whether a concept is understood needs low fidelity.
- Testing whether a grip is comfortable needs fidelity in shape and weight, but not in function.
- Testing whether a mechanism survives a thousand cycles needs fidelity in materials and tolerances, but not in appearance.
- Testing whether customers will pay a particular price may need fairly high fidelity in what they see, but not in what happens behind the scenes.

Asking "which aspects must be real for this question, and which can be faked?" keeps prototypes focused.

## Running a prototype test

A prototype only produces learning if it is tested well. A simple structure helps:

1. **Choose the right people.** Test with people who actually have the problem, not friends or colleagues who want to be supportive.
2. **Set the scene, then step back.** Explain the situation the product is meant for, then let people use the prototype without guidance. Resist the urge to explain or defend.
3. **Watch what they do.** Behaviour is more reliable than comments. Note where they hesitate, misunderstand or give up.
4. **Ask open questions afterwards.** "What did you expect to happen there?" "What would you do next?" "What would stop you using this?"
5. **Record observations straight away.** Memory blurs quickly. Write down what happened, not just what it meant.
6. **Compare with the result you wrote down in advance.** Decide what the test showed against the standard set before it started.

Small numbers of users often reveal the biggest problems. Usability practitioners have long observed that a handful of test users typically surface most major issues in an interface; the same pattern tends to hold for many physical products. More tests are useful later, for refinement and confidence.

## Keeping prototypes cheap and quick

Speed matters because each prototype cycle produces learning, and the more cycles that fit into a given time, the faster an idea improves or is abandoned.

Some habits help:

- **Set a time and cost limit** for each prototype before starting. If it cannot be done within the limit, simplify the question.
- **Use available materials and tools.** Card, foam, off-the-shelf parts, development boards, 3D printing and no-code tools make many prototypes possible within days.
- **Reuse earlier prototypes** where they still serve.
- **Avoid early tooling.** Moulds, custom parts and production equipment should wait until the design is stable.
- **Keep a prototype log.** A simple record of each prototype, its question, its result and what changed afterwards prevents repeating mistakes and documents the reasoning for later.

## From prototype to product

As questions are answered, prototypes naturally become more refined. At some point the focus shifts from "should we build this?" to "how do we build this well?"

Several considerations become important at that stage.

**Design for manufacture and assembly.** Parts that are easy to prototype are not always easy to produce in volume. Early conversations with manufacturers can reveal changes that reduce cost and improve reliability.

**Materials and tolerances.** A 3D-printed part may behave very differently from an injection-moulded one. Testing with production-like materials becomes necessary before committing to tooling.

**Safety and compliance.** Many products must meet mandatory safety standards or regulatory requirements before they can be sold, and some require testing or certification. Electrical products, children's products, food-contact items and medical or safety-related products are common examples. Understanding these requirements early prevents expensive redesigns later.

**Reliability testing.** Prototypes that worked a few times must now work thousands of times, in real conditions, in the hands of real users.

**Cost.** Each refinement should be checked against the target cost. Features that seemed small in a prototype can add significant cost in production.

## When to stop prototyping

Prototyping can become a comfortable place to stay. Each prototype reveals something new to improve, and the product never quite launches.

Some signs it may be time to move on:

- the key questions have been answered, and remaining issues are refinements
- recent prototypes are producing small improvements rather than new learning
- real customers are asking when they can buy it
- the cost of further prototyping exceeds the likely value of what it would reveal

Equally, prototyping should stop if the results consistently show that the idea does not work, or that nobody wants it. Stopping is a legitimate outcome. The purpose of prototyping early is to make that discovery cheaply.

## A worked illustration

This is a hypothetical illustration, not a GoCore project.

Someone has an idea for a wall-mounted holder that keeps hand tools organised and visible in small workshops. Conversations suggest that tradespeople do lose time searching for tools, but nobody knows whether a holder would be used.

The first prototype is a sheet of cardboard with tool outlines drawn on it, taped to the wall of a willing workshop for two weeks. The question: will people put tools back on it? Photographs taken each afternoon show that they mostly do, but that some tools are too heavy for the planned mounting method and some outlines are in awkward positions.

The second prototype uses plywood and off-the-shelf hooks, testing a revised layout and heavier mounting. Its question: does the layout suit the way people actually work? Two more workshops try it. The layout is adjusted again.

Only then does the third prototype explore materials and production: could the board be made from a durable sheet material, cut efficiently, at a cost that leaves a healthy margin?

Each step cost little and answered one question. By the time money is spent on production, the idea has been tested where it matters most: on the wall, in real use.

## Common mistakes

**Building before deciding the question.** The prototype grows without purpose.

**Polishing too early.** Polished prototypes invite politeness and absorb time.

**Testing with friendly audiences.** Supportive people rarely give useful criticism.

**Mixing uncertainties.** One prototype trying to answer everything usually answers nothing clearly.

**Explaining during tests.** If the product needs explaining, that is the finding.

**Ignoring compliance until late.** Safety and regulatory requirements can force major redesigns.

**Never stopping.** Prototyping should lead to a decision.

## Questions to ask

- What is the one question this prototype needs to answer?
- What result would change our mind?
- What is the least we can build to answer it?
- Which kind of uncertainty is riskiest: does it work, does anyone want it, or can it be made?
- Who exactly should test it, and how will we record what happens?
- What would tell us it is time to stop?

## Bringing it together

Early prototypes are tools for learning, not early versions of the product. Each should be designed around a single question, built with just enough fidelity to answer it, and tested honestly with the people who have the problem. Rough prototypes invite honest feedback; polished ones invite politeness. Separating the questions of whether it works, whether anyone wants it and whether it can be made keeps each test focused and fast.

Prototyping well means learning quickly and cheaply, and being willing to act on what is learned, including the decision to stop. GoCore will share its own observations from prototyping as its work progresses, including what did not work.
