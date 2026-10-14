---
title: "What you may infer about customers, and what you may price on"
description: "Data makes it easy to infer things about customers and price on them. How to separate what you collect, what you infer and what you act on, and avoid pricing on visibility instead of risk."
publishDate: 2026-10-04
category: "Business"
tags:
  - customers
  - ai
  - strategy
  - finance
author: "KEVOS®"
featured: false
draft: false
---

Imagine two proposals reaching the same business in the same quarter. The first, from the sales and growth side, suggests using richer customer data to personalise prices, credit limits or offers: customers who look more affluent or more reliable get different terms from those who do not. The commercial logic is clear. The second, from someone concerned about risk and reputation, warns that systems built on behavioural and historical data can reproduce and amplify unfair patterns that nobody in the business would ever approve if they were written down as policy.

Both proposals might be approved, each by different people, and neither refers to the other. Yet they describe the same mechanism from opposite ends. The benefit of using customer inferences is owned by one part of the business and the risk by another, and there is often no place where the two must be reconciled before anything reaches a customer.

This article is for any business that uses customer data to set prices, credit terms, eligibility or offers, from online retailers and service providers to trade suppliers, lenders and insurers. It explains why the real constraint has shifted from what a business can discover about customers to what it can defend acting on, and offers a simple gate for deciding which inferences may affect a customer.

## The constraint has moved

For most of commercial history, knowing more about a customer was expensive, and tailoring an offer to that knowledge was more expensive still. Businesses worked with a handful of broad segments. Both costs have fallen dramatically. Data is plentiful, and software can tailor prices and terms to individuals.

That shifts the important question. When knowledge was scarce, the question was how to get more of it. When it is abundant, the question is which parts of it the business is prepared to turn into a decision that affects someone: a price, a limit, a ranking, an approval or a refusal. A business that would carefully review a change to its published price list can find that software has changed prices for a group of customers based on variables nobody has reviewed.

## Collect, infer, act

It helps to separate three questions:

- **What may we collect?** A question of lawful basis, purpose, proportionality and security. Many businesses have some capability here because privacy law requires it.
- **What may we infer?** An inferred attribute, such as likely income, household type or likely health status, is not in the customer's record. The business created it from other data. Few businesses keep any record of what they infer.
- **What may we act on?** Which inferences are allowed to change a price, limit, eligibility or priority, and under what conditions.

Governance often stops at the first question. Most of the commercial value, and most of the risk, sits in the third.

## Common misreadings

- **If it is legal to hold the data, it is fine to use it.** Legal permission to hold data is not the same as being able to justify using it to set someone's price. Privacy, credit reporting, consumer and anti-discrimination laws set a floor, and specific cases need professional advice. But the floor is not the decision.
- **Concerns will be raised in time.** Problems usually become visible after a system is in use, when withdrawing it means unwinding prices, contracts and commitments.
- **The effects fall evenly.** The commercial appeal is often greatest for customers with thin records: short histories, irregular income or few assets. They are also the customers least able to understand or challenge a decision, and most affected by a mistake.

## The inference is the product, and it is fragile

The value in personalised pricing does not lie in the data, which is increasingly available to everyone, but in the inference: the claim that some pattern predicts something useful. Two consequences follow.

First, an advantage built on widely available data and methods tends not to last. Competitors can do the same, and the business may simply end up repricing its customers at some cost and arriving in the same relative position.

Second, many models measure **visibility** rather than the thing they claim to measure. A customer whose life is heavily documented in the available data is not necessarily a better risk, only a more visible one. Treating visibility as reliability systematically misprices people who leave fewer traces, and the business may never notice, because the customers it turned away never produce data showing they would have been fine.

## Association is not the individual

Using signals about a person's connections, location or social network raises a particular problem. These are heavily shaped by geography, family, language, workplace and background. Pricing on them prices those groups, not the individual. Removing a sensitive attribute, such as a protected characteristic, from the data rarely solves this, because the same information is often encoded across many ordinary variables, such as postcode, and a model can reconstruct it. Saying "the model does not use that attribute" is not a defence anyone outside the business is obliged to accept.

## Costs the growth case leaves out

- **Reversibility**: once applied across many customers, a pricing mechanism is hard to unwind.
- **Explanation**: if a decision is questioned, the business may need to show what data and logic were used, and why.
- **Revenue quality**: margin earned from a method the business would not describe publicly is fragile.
- **Data security**: holding richer customer data raises the consequences of a breach.

## A simple gate before inferences affect customers

| Step | Question | Test | Who decides |
|---|---|---|---|
| Collect | May we hold this data? | Lawful basis, stated purpose, proportionality, security | Data owner, with privacy advice where needed |
| Infer | May we derive this attribute? | Would we be comfortable describing the inference to the customer it concerns? | Whoever owns the model or tool, with someone responsible for risk |
| Act | May this change a price, limit or eligibility? | Can we explain it, have we checked effects on different groups, and can we reverse it? | A named manager responsible for the product or service |

Three thresholds make it workable:

1. **A written list of attributes and inferences the business will never price on**, regardless of how predictive they are.
2. **A category used only with clear consent** and a plain explanation of how it is used.
3. **Everything else**, treated as normal and reviewed periodically.

The decisive question is not whether an inference improves accuracy. It is whether the business could state the basis of its decision to the customer, a business partner and a regulator in the same words.

## Be open with customers

Customers increasingly expect to understand how their information is used. Explain in plain language, in your privacy policy and at the point of collection, what you collect, why and how it affects what they are offered. Where personalisation is used, say so. Where customers can choose not to share information or opt out of personalised offers, make that easy. Openness reduces the chance of an unpleasant surprise that damages trust, and it encourages the business to use only inferences it is comfortable explaining.

## Check outcomes for fairness

Fairness checks do not need to be complicated. Periodically compare outcomes, such as average prices paid, approval rates, credit limits or offers received, across customer groups that matter, such as locations, age groups where known, or new and existing customers. Large unexplained differences deserve investigation: are they explained by genuine differences in cost to serve or risk, or by proxies the business would not accept? Record what was checked, what was found and what was changed. That record is also valuable if a decision is ever challenged.

## Review supplier and platform tools

Much personalisation now happens inside tools provided by others: e-commerce platforms, payment and finance providers, advertising systems and customer management software. These tools may make inferences and act on them by default. Review their settings, ask suppliers what data and criteria they use, switch off features you cannot explain and record the choices you make. The business remains responsible for decisions affecting its customers, even when a supplier's software made them.

## A worked example

This is an illustration. A small online retailer installs a pricing tool that adjusts prices automatically. Reviewing the tool's settings, the owner discovers it raises prices for visitors using certain devices and from certain suburbs, inferring that they are more affluent, and that a buy-now-pay-later option is withheld from some postcodes based on the provider's risk settings combined with the retailer's own filters.

The owner applies the gate. The data collected, such as device type and location, is lawfully held for operating the website. But the inferences, affluence from device and suburb, and risk from postcode, fail the "act" test: the owner would not be comfortable explaining to a customer that they paid more because of their phone or where they live, and postcode-based restrictions could affect some communities unfairly.

The owner turns off device- and suburb-based pricing, keeps price changes based on stock levels and clear promotions, removes the retailer's own postcode filter and asks the payment provider to explain its criteria. A short written list now states that the business will not set prices based on location, device or inferred personal characteristics. Over the following months, conversion rates are unchanged, and the owner has removed a risk to the business's reputation and customer trust.

## How this applies to a small Australian business

Many small businesses now use software that personalises prices, offers or credit, sometimes without realising it. Practical steps:

- **Find out which customer data and inferences** your pricing, credit and marketing tools use.
- **Apply the collect, infer, act gate** before inferences affect customers.
- **Write a short list** of attributes you will not price on.
- **Check effects on different groups** of customers.
- **Be able to explain decisions** to customers in plain language.
- **Review supplier tools**: ask software and payment providers what criteria they apply.
- **Check legal obligations**: the Privacy Act, credit reporting rules, the Australian Consumer Law and anti-discrimination laws may all be relevant. The Office of the Australian Information Commissioner and the ACCC publish guidance. Take advice for specific cases.

The articles on [data readiness](/insights/data-readiness-is-a-business-habit/) and [governing AI decisions](/insights/governing-ai-decisions/) cover related topics.

## Signals worth watching

- Pricing or credit changes reaching customers without the review that applies to normal price changes.
- Refusals or complaints clustered by location or channel.
- Gaps between predicted and actual outcomes for groups scored on inferred data.
- Business partners or platforms adding requirements to explain pricing or decisions.
- Claims that a fairness question has been solved technically, without anyone reading the test.

## Common mistakes

- **Treating legal permission to hold data** as permission to price on it.
- **Not recording what the business infers** about customers.
- **Using location or association as a stand-in** for individual risk.
- **Assuming removing a sensitive attribute removes the problem.**
- **Leaving growth and risk views unreconciled.**
- **Letting supplier tools make decisions** you cannot explain.

## Frequently asked questions

**Is personalised pricing always wrong?** No. Many forms are fair and transparent, such as volume discounts, loyalty rewards, published promotions and prices based on real differences in cost to serve. The concern is pricing on inferences customers would not expect or accept.

**What if a supplier's tool does the inferring?** You remain responsible for decisions affecting your customers. Ask suppliers what data and criteria they use, and configure tools to match your own rules.

**How do we check effects on different groups?** Compare outcomes, such as prices paid, approval rates or offers made, across groups such as locations or customer types. Large unexplained differences deserve investigation.

**What about dynamic pricing based on demand?** Prices that change with demand, time or stock levels, applied to everyone in the same situation and clearly communicated, are generally a different matter from prices based on inferred personal characteristics. Be transparent and check consumer law requirements on price displays.

**Who should own the gate?** A senior person responsible for the product or service, working with whoever manages privacy and risk, so commercial and risk views meet before decisions reach customers.

**Does this apply to business customers?** Yes, though the legal context differs. Trade credit decisions, for example, should rest on information you could explain to the customer, such as payment history, rather than on proxies.

**How do we explain our rules to customers without frightening them?** Keep it short and specific. Say in plain words what information you use, what you use it for and what you do not do, for example that you use order history to suggest products but do not set prices based on inferred personal circumstances. Put it where customers make decisions, not only in a privacy policy, and make it easy to ask a question or opt out where that is possible.

## Questions to ask

- Which inferred attributes currently affect a price, limit or approval in our business, and who approved each?
- If a customer asked why they received their price or decision, what would we say?
- Are our models measuring risk, or how visible customers are in the data?
- What would it cost to withdraw our current pricing or credit logic?
- Which attributes have we decided never to price on, and is that written down?
- Where growth and risk views differ, who decides?

## Bringing it together

The limit on using customer data is no longer what a business can discover. It is what the business can defend acting on. Separate collection, inference and action, record what you infer, apply a clear gate before inferences affect customers, write down what you will never price on and make sure you can explain every decision in the same words to a customer, a partner and a regulator. Decided deliberately, this becomes a statement of what the business stands for, expressed where customers actually experience it: the price and terms they are offered.

---

*Source: KEVOS® notes. Examples and figures in this article are illustrations. This article is general information, not legal or privacy advice.*
