---
book: configure-price-quote-by-the-numbers
chapterSlug: model-the-options-and-their-rules
order: 2
title: "Model the options and their rules"
description: "Write down a configurable product's options, count the combinations, express the rules that make some impossible, explain refusals to users and test every pair of choices."
draft: false
---

A configurable product is a set of choices and a set of rules about which choices go together. In most manufacturers, the choices are in the brochure and the rules are in the heads of the production engineer and the most experienced estimator. That works while those people answer every question. It fails when a new estimator quotes a combination that cannot be built, when a sales representative promises an option the factory dropped last year, or when anyone tries to build a configurator, which needs the rules written down precisely enough for a computer.

This chapter models the bench range's options and rules. It lists the options, counts the combinations, writes the constraints that remove impossible ones, decides how to explain a refusal to the person configuring, routes requests outside the model to a person, and tests every pair of choices. The failure case is an early spreadsheet that let a sales representative quote a bench on castors with a sink.

## List the options

Start with the options a customer can choose, each with its allowed values. Resist the temptation to include everything the factory has ever made. The model should cover the standard range that accounts for most orders, with a route for everything else.

```figure
type: compare
title: The bench range's options
cols: Allowed values | Count
caption: This is an illustration. Values outside these lists are special requests, priced and checked by a person (see the decision figure below).
- Length | 900 to 3,000 mm in 300 mm steps | 8
- Depth | 600 or 750 mm | 2
- Undershelves | none, one or two | 3
- Splashback | none, 100 mm or 300 mm high | 3
- Castors | no or yes | 2
- Sink | none, left, right or centre | 4
```

## Count the combinations

The number of possible configurations is the product of the number of values of each option: **8 × 2 × 3 × 3 × 2 × 4 = 1,152**. That is far more than any person can check one by one, and it is a modest range. Adding one more option with three values would triple it.

The count matters for two reasons. It shows why the old approach of copying the nearest past quote fails: with 1,152 possibilities, the nearest past quote is often not very near. And it shows why the rules must be general statements rather than a list of allowed products. Nobody can maintain a list of 1,152 rows by hand, let alone one for a larger range.

## Write the rules

Not every combination can be built. The production engineer, interviewed over two sessions, gave four rules, each with a reason:

- **R1** A centre sink needs a bench at least **1,500 mm** long, because the sink bowl and its supports need clear bench on both sides.
- **R2** A left or right sink needs a bench at least **1,200 mm** long, for the same reason on one side.
- **R3** Castors cannot be fitted to a bench with a sink, because a sink is plumbed in and must not move.
- **R4** Castors cannot be fitted to a bench with two undershelves, because the castor-mounted frame has a lower rated load and two shelves invite overloading.

```figure
type: bars
title: Combinations removed by each rule, applied in order
unit: combinations
max: 400
caption: This is an illustration. Of 1,152 combinations, 600 remain buildable. Rule R3 removes the most because it touches every sink position.
- R1 centre sink, length under 1,500 mm | 72
- R2 side sink, length under 1,200 mm | 72
- *R3 castors with a sink | 360
- R4 castors with two undershelves | 48
```

Applied in that order, the rules remove 72, 72, 360 and 48 combinations, leaving **600** buildable configurations out of 1,152. Each rule is written as a condition with a reason, owned by the production engineer, in the same way the companion book on CAD automation keeps its design rules: as data an engineer can read and approve, not as code only a programmer can see.

## Rules that add, not just forbid

Not all rules remove combinations. Some add consequences. A sink requires a waste outlet hole and a tap hole in the splashback, so a bench with a sink and no splashback needs a separate tap mounting. A bench longer than 2,400 mm needs a fifth and sixth leg at mid-span. A 300 mm splashback on a bench against a wall needs wall brackets.

These consequence rules matter as much for price as for buildability. The extra legs on long benches add about A$76 of material in this range. An estimator who forgets them underprices the bench, as Chapter 1's error analysis found. In the configurator, consequence rules add the components automatically, so the price and the bill of materials always include them.

## Ask about the need, not just the option

Four of the customers in Chapter 1's lost-quote calls said the bench did not quite match what they needed. A configurator that only asks for options repeats the estimator's habit of quoting exactly what was asked. A few questions about the use can lead to a better choice:

- Will the bench be moved for cleaning? If yes, castors are worth considering, and the configurator explains that castors exclude a sink.
- Will heavy equipment sit on it? If yes, the 750 mm depth and a second undershelf as a brace may suit, and the configurator shows the rated load for each option.
- Is it against a wall? If yes, a splashback is usually wanted.

These questions do not decide anything. They set sensible defaults and show the consequences of the choices, so that the person configuring understands what they are buying.

## Choose defaults deliberately

Every option starts with a value, and most users leave most values as they find them. Defaults therefore shape what gets quoted and sold. The firm reviewed its order history and set each default to the most common choice for a first-time customer: 1,800 mm long, 750 mm deep, one undershelf, a 100 mm splashback, no castors and no sink. About a third of quotes in the following months needed no change to four or more of the six options.

Defaults also carry risk. A default that suits most customers can be wrong for some, and a busy user may not notice. The configurator therefore shows a short summary of every choice, with defaults marked as defaults, before the quote is produced. The estimator, or a customer using the configurator directly, confirms the summary rather than the individual fields.

## Keep the model in one place

The option lists, rules, consequence rules, defaults and questions together form the product model. The firm keeps it as a single controlled table, owned by the production engineer for buildability and by the product manager for what the range offers. Each change has a revision, a reason and a date, and the configurator shows the model revision on every quote it produces. When a rule changes, the firm can find every open quote made under the old revision and check whether it is affected. That matters for quotes valid for 30 days, which can outlive a rule change.

## Explain every refusal

When a user chooses something a rule forbids, the configurator must say so, and say why. "Invalid combination" is useless. "Castors cannot be fitted to a bench with a sink, because a plumbed sink must not move. Remove the sink or the castors, or request a special design." lets the user fix the problem or make an informed request.

The firm's configurator goes one step further. It greys out options that would break a rule given the choices already made, with the reason shown when the user points at the greyed option. A user who has chosen a centre sink sees the 900 mm and 1,200 mm lengths greyed, with rule R1's reason. That avoids the frustration of filling in a whole form and being told at the end that it cannot be built.

## Route the rest to a person

Some customers need something outside the model: a 3,300 mm bench, a sink in an unusual position, a heavier gauge. The configurator must not stretch its rules to cover them. It routes them to a person.

```figure
type: decision
title: What happens to a request the model does not cover?
question: Is every choice within the option lists and allowed by the rules?
caption: This is an illustration of the firm's routing. Special requests are logged, so the product manager can see which ones recur and should become standard options.
- *Yes | Configured and priced automatically | quote in minutes, with the rules' consequences included
- No, a value outside a list | Special request to the estimator | priced by hand, checked by the production engineer, logged
- No, a combination a rule forbids | Explain the rule; offer alternatives or a special request | never quoted automatically
```

Special requests are logged with what was asked. After six months, the log showed 14 requests for a 3,300 mm length and none for anything else repeated more than twice. The product manager added the 3,300 mm length as a standard option, with the production engineer extending rule R1 and the leg rule to cover it. The other special requests stayed special, priced by hand, because no single one recurred often enough to justify the extra rules and tests.

## Test every pair of choices

With 1,152 combinations, testing every one is possible with automation but not by hand, and larger products have millions. A widely used shortcut is to test every **pair** of option values, on the observation that many faults in rule sets involve the interaction of just two choices.

For the bench range, the number of value pairs across the six options is the sum, over each pair of options, of the product of their value counts. That comes to **189** pairs. A well-chosen set of configurations can cover all 189 pairs with far fewer than 1,152 tests, because each configuration covers 15 pairs at once, one for each pair of options. The firm's test set covered every pair in about **40** configurations, each checked for buildability against the production engineer's judgement and for price against a hand calculation. Tools exist to generate such sets automatically.

The firm also tested every rule at its boundary: a centre sink at 1,200 mm and 1,500 mm, a side sink at 900 mm and 1,200 mm. Boundary errors are the commonest kind, as the companion book's chapter on design rules shows.

## A failure case: castors under a sink

This is an illustration. Before the configurator, a sales representative used a spreadsheet the previous estimator had built, with a drop-down for each option and a price formula. It had no rules at all. A customer asked for a 1,800 mm bench with a right-hand sink and castors, so that it could be moved for cleaning. The spreadsheet priced it, and the representative sent the quote.

The order arrived two weeks later. The production engineer, reviewing it, saw the combination and called the customer. A plumbed sink on castors would strain or break its plumbing the first time the bench moved. The customer had not thought about it either. The bench was redesigned with the sink on a fixed section and a separate mobile bench beside it, which cost the customer more than the original quote and the firm a difficult conversation and about four hours of engineering time.

The detection came at order engineering, after the customer had committed, which is late and awkward. The correction was rule R3, written with its reason, and the greying of incompatible options, so that the combination can no longer be quoted at all. The firm also added the cleaning question above, because the customer's real need, a sink area that can be cleaned under, had a better answer that a good question would have found at the start.

## How this applies to a small Australian business

Small manufacturers often keep their product rules entirely in the heads of one or two people. Writing them down, even before any configurator, protects the business when those people are away and helps new estimators and sales staff quote correctly. Keep the rules short, each with its reason and owner, and resist modelling every special case. A range that covers eight in ten orders automatically, with a clear route for the other two, is far more useful than one that tries to cover everything and is never finished. Start with the options and rules behind your most common orders and extend the model only when the special-request log shows a need. Australian food-industry customers often have hygiene requirements that drive choices like castors and splashbacks, and asking about the use, not just the option, often finds the better product.

## Exercise: adding an option

The product manager proposes adding a drawer unit as an option with three values: none, one drawer or two drawers. The production engineer adds one rule: drawers cannot be fitted under a sink position. How many combinations does the range have before the new rule, and how would you estimate the effect of the rule on the buildable count?

**Worked answer.** Before the new rule, the count triples: **1,152 × 3 = 3,456** combinations, and the buildable count before the new rule also triples, **600 × 3 = 1,800**. The new rule removes buildable configurations that have both a sink and one or two drawers. Among the 600 buildable configurations without drawers, those with a sink are 600 minus those with no sink. With no sink, all lengths, depths, undershelves, splashbacks and castor choices are allowed except castors with two undershelves: **8 × 2 × 3 × 3 × 2 − 8 × 2 × 3 = 288 − 48 = 240**. So **600 − 240 = 360** buildable configurations have a sink. Each of those 360 loses its two drawer values, removing **360 × 2 = 720**, leaving **1,800 − 720 = 1,080** buildable configurations. The pair tests must also be extended to cover the new option's pairs with every other option.
