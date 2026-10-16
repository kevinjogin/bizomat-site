---
title: "Framing, certainty and the limits of rational choice"
description: "Decision theory describes how choices should be made; people often choose differently. How the certainty effect, framing and prospect theory shape real decisions, and how to design around them."
publishDate: 2026-10-03
category: "Ideas"
tags:
  - strategy
  - customers
  - validation
author: "GoCore"
featured: false
draft: false
---

Decision theory offers a clear standard for rational choice: assign probabilities to outcomes, assign utilities reflecting how much each outcome matters, and choose the action with the highest expected utility. The requirements behind this standard, such as consistency and transitivity of preferences, seem so reasonable that most people agree with them when they are explained.

Yet people's actual choices regularly break these rules, and not only when they are careless. Experts, under carefully controlled conditions, make choices that contradict the axioms they would endorse on reflection. The way a question is worded, whether an outcome is certain or merely probable, and whether results are described as gains or losses all change what people choose.

*Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray describes decision theory as a **normative** theory, which prescribes how choices should be made, rather than a **descriptive** theory, which predicts how people actually behave. This article explores the gap between the two: the certainty effect, the framing effect, prospect theory and other biases, why they matter for anyone designing decision systems or asking people to make choices, and how to design processes that account for them. It is part of GoCore's series on decision making.

## Normative and descriptive theories

A **normative** theory says what a rational agent should do, given its beliefs and preferences. Expected utility theory is normative: it tells us how to choose consistently.

A **descriptive** theory says what people actually do. It aims to predict behaviour, including behaviour that is inconsistent.

Both are useful. Normative theories guide the design of decision systems and help people check their reasoning. Descriptive theories help predict how customers, staff and stakeholders will respond to choices, and warn where human judgement needs support.

The problem arises when the two are confused: when a decision system assumes people behave rationally, or when people treat their intuitive choices as necessarily rational.

## The certainty effect

In experiments reported in 1981, the psychologists Amos Tversky and Daniel Kahneman asked university students to choose between outcomes in a hypothetical public health scenario. The structure of their findings, described in the book, is revealing.

Students were asked to choose between:

- **Option A:** a certain loss of 75 lives.
- **Option B:** an 80% chance of losing 100 lives (and a 20% chance of losing none).

Most preferred B, the gamble, over the certain loss.

They were then asked to choose between:

- **Option C:** a 10% chance of losing 75 lives.
- **Option D:** an 8% chance of losing 100 lives.

Most preferred C.

Here is the problem. The second pair is simply the first pair with every probability divided by ten. Under expected utility theory, if B is preferred to A, then D must be preferred to C, regardless of how much anyone values each outcome. The book shows that the two common choices together contradict the axioms of rational preference, even though many people who make them find the axioms agreeable.

The explanation is the **certainty effect**: people give disproportionate weight to outcomes that are certain compared with outcomes that are merely probable. A certain loss feels much worse than a probable loss, even when the probabilities would suggest otherwise. The same effect appears with gains: a smaller certain gain is often preferred to a larger probable gain, in ways that break consistency.

## The framing effect

In another famous experiment, Tversky and Kahneman described an epidemic expected to kill 600 people and offered two programmes.

Framed in terms of lives saved:

- **Programme E:** 200 people will be saved.
- **Programme F:** a one-third chance that all 600 will be saved, and a two-thirds chance that none will be saved.

Most people chose E, the certain option.

Framed in terms of deaths:

- **Programme G:** 400 people will die.
- **Programme H:** a one-third chance that nobody will die, and a two-thirds chance that all 600 will die.

Most people chose H, the gamble.

But E and G describe exactly the same outcome, as do F and H. The only difference is the wording. Described as gains (lives saved), people preferred the certain option. Described as losses (deaths), they preferred the gamble. This is the **framing effect**.

## Prospect theory

To explain such patterns, Kahneman and Tversky proposed **prospect theory** in 1979, a descriptive model of how people evaluate risky choices. Its main features are:

**Reference points.** People evaluate outcomes as gains or losses relative to a reference point, often the current situation or an expectation, rather than in terms of final wealth.

**Loss aversion.** Losses weigh more heavily than gains of the same size. Losing $100 feels worse than gaining $100 feels good. Studies have commonly found losses weighing roughly twice as much as equivalent gains, though estimates vary.

**Diminishing sensitivity.** The difference between $0 and $100 feels larger than the difference between $1,000 and $1,100, for both gains and losses. This makes people risk averse for gains and often risk seeking for losses.

**Probability weighting.** People overweight small probabilities and underweight moderate to large ones, and treat certainty as special. This helps explain why people buy both insurance and lottery tickets.

Prospect theory does not say people are foolish. It describes systematic patterns that make choices predictable, even when they are inconsistent with expected utility theory. Kahneman was awarded the Nobel memorial prize in economics in 2002, in part for this work.

## Other common biases

Many other patterns cause human choices to depart from the normative model. Some that affect business decisions:

- **Anchoring:** estimates are pulled towards an initial number, even an irrelevant one.
- **Availability:** events that are easy to recall, such as recent or vivid ones, are judged more likely.
- **Overconfidence:** people tend to be more certain of their estimates than their accuracy justifies.
- **Sunk cost effect:** people continue with something because of what they have already invested, rather than what it will produce.
- **Status quo bias:** people prefer the current state of affairs, partly because change is framed as a potential loss.
- **Confirmation bias:** people seek and favour evidence that supports their existing views.

Several of these are discussed in the context of markets in GoCore's article [The psychology of bubbles](/reados/collections/judgement-markets-and-learning/the-psychology-of-bubbles/).

## Defaults and choice architecture

One of the most practical findings from this research is the power of **defaults**. When one option is pre-selected, many people stick with it, whether because changing takes effort, because the default seems like a recommendation, or because switching feels like a potential loss. Retirement savings schemes that enrol people automatically, with the option to leave, tend to achieve much higher participation than schemes that require people to opt in.

Richard Thaler and Cass Sunstein popularised the term **choice architecture** for the way choices are presented, in their 2008 book *Nudge*. Every form, menu, price list and approval process has a choice architecture, whether designed deliberately or not. Recognising this gives businesses a responsibility as well as an opportunity: to set defaults that genuinely serve the people choosing.

## Mental accounting

People also tend to treat money differently depending on where it came from or what it is labelled for, a pattern Thaler called **mental accounting**. A bonus may be spent more freely than regular income; money in a "marketing budget" may be guarded differently from money in a "training budget", even when the business's overall interest would favour moving it. In organisations, budget categories can lock in spending that no longer reflects priorities. Periodically asking where the next dollar would do the most good, regardless of its label, counters this.

## Why this matters for decision systems

The book highlights a specific practical concern: when designing a decision support system, the system's utilities are often elicited from human experts. If experts' preferences are inconsistent, as these experiments show they can be, the resulting utility function may not accurately represent what they actually value.

Several consequences follow.

**Elicit carefully.** Ask questions in several ways, including both gain and loss framings, and check for consistency. Discuss discrepancies with the experts rather than averaging them away.

**Expect disagreement with intuition.** A decision system that maximises expected utility may make recommendations that feel wrong to people, precisely because it is consistent where human intuition is not. Explaining the reasoning helps.

**Do not assume users behave rationally.** Systems that interact with people, such as pricing tools, recommendation systems or interfaces presenting choices, should anticipate framing, loss aversion and the certainty effect.

## Why this matters for business

### Presenting choices to customers

The same offer can be received very differently depending on how it is framed. A discount described as "save $20" and a surcharge avoided by "paying on time" may have identical economics but different effects. Certainty is powerful: guarantees, fixed prices and clear commitments often carry more weight with customers than their expected value would suggest.

There is an ethical line here. Understanding framing helps present choices clearly and fairly; using it to mislead or pressure customers damages trust and, in Australia, may breach consumer law, which prohibits misleading or deceptive conduct. The aim should be clear choices that customers would endorse on reflection.

### Making decisions within the business

Framing affects internal decisions too. A project described as having "a 70% chance of success" may be approved more readily than one with "a 30% chance of failure". A cost described as a loss may be resisted more strongly than the same cost described as a forgone gain.

Practical safeguards include:

- **Describe options in more than one frame.** State both the chance of success and the chance of failure, both gains and losses.
- **Separate the decision from sunk costs.** Ask what you would decide if starting fresh today.
- **Use numbers, not just words.** Vague probability words are easily distorted.
- **Write down expectations in advance.** Records counter hindsight and confirmation bias.
- **Seek a second view.** Someone not invested in the decision is less affected by its framing.

## Rationality as a tool, not a description

None of this means the normative theory is useless. On the contrary, the gap between how people choose and how they would choose on reflection is exactly why normative tools are valuable. Expected utility calculations, decision trees and the value of information provide a check on intuition, especially for large, unfamiliar or high-stakes decisions.

At the same time, intuitions are not always wrong. Experienced practitioners often make good fast judgements in familiar situations. The practical skill is knowing when to rely on intuition and when to slow down and calculate.

## A worked illustration

This is an illustration, not a real business.

A small software business is deciding whether to continue a product feature that has consumed six months of development and has attracted little customer use. The team's discussion keeps returning to the effort already spent.

The founder reframes the decision. Ignoring the sunk six months, the question becomes: given what we know now, would we start building this feature today? The team also restates the options in both frames: continuing has a "25% chance of meaningful adoption" and a "75% chance of further wasted effort".

Seen this way, the decision is clearer. The team pauses the feature, documents what was learned, and redirects effort to an area where customers have shown stronger interest. The six months are not recovered, but no further months are lost.

## Common mistakes

**Assuming people choose rationally.** Real choices show systematic patterns that differ from the normative model.

**Assuming intuition is always wrong.** In familiar situations, experienced judgement can be valuable.

**Eliciting preferences with one framing.** Answers can change with wording.

**Letting sunk costs drive decisions.** Only future consequences should matter.

**Using framing to mislead.** It erodes trust and can breach consumer law.

## Questions to ask

- Would the decision change if the options were described as losses instead of gains, or vice versa?
- Is a certain option being overvalued compared with a probable one?
- Are past investments influencing a decision about the future?
- Have we stated probabilities as numbers, in both directions?
- For your own business: how are the choices you offer customers framed, and would they endorse that framing on reflection?

## Bringing it together

Decision theory describes how choices should be made; human choices often differ in systematic ways. The certainty effect gives disproportionate weight to certain outcomes, the framing effect makes choices depend on wording, and prospect theory explains these patterns through reference points, loss aversion, diminishing sensitivity and probability weighting.

For designers of decision systems, these patterns call for careful elicitation of preferences and clear explanations of recommendations. For businesses, they call for presenting choices fairly, examining decisions in more than one frame and using normative tools as a check on intuition where the stakes are high.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022), which describes experiments by Amos Tversky and Daniel Kahneman, together with widely published research in behavioural economics. Explanations are GoCore's own. This article is general information, not legal or professional advice.*
