---
title: "Is your AI a feature you sell or a tool you use? Different owners, economics and risks"
description: "AI inside what you sell and AI inside how you work are different assets. How to give each the right owner, cost model and measures, and what changes when a tool becomes a product."
publishDate: 2026-10-04
category: "Technology"
tags:
  - ai
  - product-development
  - finance
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

When a business lists its AI initiatives, they usually divide into two kinds, often without anyone noticing. Some go inside what the business sells: a diagnostic built into a service, an automated recommendation in an app, a smart feature in a product. Others change how the business itself works: tools that help design, plan, quote, write, test or analyse.

These are not two versions of the same investment. They have different owners, different cost behaviour, different risks, different measures of success and different ways of failing. Managed as one category, under one budget and one set of measures, each tends to be judged on the wrong evidence. The internal tool is asked to prove revenue it cannot directly produce, and the customer feature is judged on engineering quality while its cost quietly erodes the margin of the product it sits in.

This article explains the difference between an AI feature and an AI tool, the economic traps specific to each, how to measure each properly and what must change when a capability crosses from one side to the other.

## Two different assets

An **embedded feature** is AI capability inside the offering. Customers experience it, whether or not they know AI is involved. It belongs to whoever is responsible for the product or service and its profitability. Its economics are unit economics: a cost that recurs every time it is used, set against a price, inside a margin. Its risk is external: when it fails, a customer is affected, and the failure carries your name.

A **development or internal tool** is AI capability inside the business. No customer experiences it directly. It belongs to whoever owns the process it supports, such as engineering, estimating, operations or marketing. Its economics are about time, cost per piece of work and the options it makes possible. Its risk is internal, and its typical failure is invisible.

The same technique can sit on either side. What matters is where the capability sits relative to the sale.

## Measuring across the line

The common failure is not misclassification but applying the wrong measures:

- **A tool measured like a feature.** The business asks an internal tool to show how much revenue it generated. It cannot do so honestly, because its effects reach customers only indirectly and mixed with many other causes. Either the tool is cut as unproven, or someone builds an attribution model that satisfies the finance review but means little.
- **A feature measured like a tool.** The business reports engineering progress, model accuracy and internal adoption, but nobody checks whether customers will pay more, stay longer or choose the business because of it, or what it costs to run against the product's margin.

## The marginal cost trap

Many AI features carry a cost every time they are used, for example charges from an AI service provider for each request. A small cost per use is easy to dismiss. But a variable cost inside a fixed price changes the shape of the margin, and it grows with success. The more customers use the feature, the more it costs. Heavy users, often the customers the business is proudest of, can consume all the margin on their accounts.

Three commercial questions follow:

- **Bundled or metered?** Including unlimited use in a fixed price is a pricing decision with a cost consequence. Model it at heavy usage, not average usage, before deciding.
- **Who bears the cost of a wrong answer?** A feature that advises a customer creates an expectation. One that acts on the customer's behalf creates a more serious responsibility. Decide what the feature may do, within what limits, as a business decision rather than a technical one.
- **Do you control the route to the customer?** If the product is sold through a platform or channel you do not control, your freedom to price the feature may be limited by someone else's terms.

## The tool's real return

Internal AI tools are usually justified on speed. Speed is the weaker half of the case. Speeding up a step only creates value if that step limits the overall flow of work. This is the central idea of Eliyahu Goldratt's theory of constraints. If design drafting is not what holds up your projects, halving its time simply means waiting faster for whatever does, such as approvals, supplier lead times or testing. The first question about any internal tool is which bottleneck it relieves.

The stronger half of the case is often the range of options a tool makes affordable. A tool that lets a business evaluate more design alternatives, more quoting scenarios or more risks than it previously could changes what gets considered, not just how fast. That suggests a different measure: how much of the realistic range of options was actually examined, and how often an option that would not otherwise have been considered was chosen.

## Internal is not automatically safe

Internal tools carry no direct customer liability, but they carry risk. AI systems trained on past examples tend to suggest answers close to the middle of what has been done before. A design team using an AI assistant might produce three times as many options, all clustered closer to past designs than the smaller set it produced before. Every productivity measure improves while exploration narrows, and no incident report is ever written. Track the variety of options as well as the volume, and have someone senior ask why genuinely different proposals have stopped appearing.

## When a tool becomes a feature

The most expensive mistake is a change of category that nobody approved. An internal tool proves useful. A customer sees it and asks for access. The business agrees, and in that moment the tool acquires a different cost structure and risk profile: support obligations, availability commitments, security review, documentation, liability and questions about where its data came from. None of this was in the original case.

The reverse also happens: a feature built for customers turns out to be more valuable internally but continues to be measured on customer metrics it will never influence. A simple rule helps: **record the classification when funding is approved, and require fresh approval, with a new cost model and owner, for any change of classification.**

## Depending on AI providers

Most small businesses build AI features and tools on services provided by others. That brings a dependence worth managing. Providers change their prices, usage limits, terms and underlying models, sometimes with little notice. A model update can change how a feature behaves for customers, for better or worse. Keep a record of which providers each feature and tool relies on, test important features after provider updates, watch for price changes that affect unit economics and, for critical features, consider whether an alternative provider could be used if needed.

## Budget for each separately

Because features and tools behave differently, budget for them separately. Fund features from product budgets, judged against price, margin and customer outcomes. Fund tools from operating or improvement budgets, judged against the bottleneck they relieve and the options they open up. Review each on its own evidence. Mixing them in one AI budget tends to favour whichever can show a dated return, usually features, while starving tools whose benefits are real but diffuse.

## Comparing the two

| | Embedded feature | Internal tool |
|---|---|---|
| Owner | Whoever is responsible for the product and its profit | Whoever owns the process it supports |
| Economics | Cost per use against price and margin | Time and cost on the real bottleneck; options considered |
| Main measures | Willingness to pay, retention, margin per customer, cost to serve | Bottleneck relieved, range of options examined, decisions improved |
| Typical failure | Margin erosion that grows with use; customer-facing errors | Faster convergence on a narrower set; speeding up a step that was not the bottleneck |
| Stop condition | Contribution falls below an agreed level at realistic usage | The bottleneck moves elsewhere, or options demonstrably narrow |
| Liability | External and visible | Internal and rarely recorded |

```figure
type: balance
title: Embedded feature or internal tool
left: Embedded feature
right: Internal tool
caption: The two have different owners, economics and ways of failing.
- Cost per use against price and margin | Time saved on the real bottleneck
- Fails by margin erosion as use grows | Fails by speeding up the wrong step
```

Three questions classify any AI initiative: Does a customer's use of it consume our cost? Would a customer notice if it were switched off tomorrow? Is it named, described or implied in something we have sold? If two answers are yes, treat it as a feature.

## A worked example

This is an illustration. A small facilities maintenance business adds an AI-powered diagnostic to its service agreements. Customers can upload photos and readings from equipment, and the system suggests likely faults and urgency. The agreement is priced at a flat annual fee per site. Each diagnostic run costs the business about 40 cents in AI service charges.

Most sites use the diagnostic about 50 times a year, costing about $20. But the business's largest and most valued customers use it heavily, up to about 3,000 times a year at one site, costing about $1,200 and wiping out most of the margin on that account. The more useful the feature proves, the faster heavy users consume the margin.

The business changes the pricing: each site's agreement includes up to 500 diagnostic runs a year, with additional runs charged at 60 cents. It also clarifies in its terms that the diagnostic suggests likely faults for a technician to confirm, rather than giving a final diagnosis.

```figure
type: bars
title: Annual AI cost of one diagnostic feature per site
unit: $
max: 1300
caption: At about 40 cents a run under a flat fee, the heaviest users erased the margin; agreements now include 500 runs, then 60 cents each.
- Typical site: about 50 runs | 20
- *Heaviest site: about 3,000 runs | 1200
```

Separately, the business uses an AI tool internally to draft maintenance schedules. It stops asking that tool to justify itself in revenue and instead asks which bottleneck it relieves. The answer turns out to be the planner's time preparing schedules, which had been delaying new contracts. The measure becomes the time from contract signing to the first scheduled visit, which falls from about three weeks to about one.

## How this applies to a small Australian business

Small businesses increasingly add AI features to their services and use AI tools internally. Practical steps:

- **Classify each AI initiative** as a feature or a tool, and record it.
- **Model per-use costs at heavy usage** before including features in fixed prices.
- **Decide what features may do** and describe them accurately to customers.
- **Ask which bottleneck each internal tool relieves**, and measure that.
- **Watch for narrowing options** as well as speed.
- **Re-approve any change** from internal tool to customer feature.
- **Remember your obligations**: consumer guarantees under the Australian Consumer Law apply to products and services that include AI features, and claims about what they do must be accurate. Check privacy obligations for any customer data involved.

The articles on [adopting AI by starting with the work](/reados/collections/ai-in-business-practice/adopting-ai-start-with-the-work/) and [pricing your product or service](/reados/collections/pricing-margins-and-profitability/pricing-your-product-or-service/) cover related ideas.

## Signals worth watching

- Margins falling on products with embedded AI as usage grows.
- A few customers accounting for most of the AI running cost.
- Internal tools asked to prove revenue, or producing doubtful attribution.
- High use of internal tools with no improvement in end-to-end time.
- More design options, but less variety among them.
- Internal tools shown to customers without a decision to sell them.
- AI service providers changing their prices.

## Common mistakes

- **Funding both kinds of initiative** from one budget with one set of measures.
- **Including unlimited AI use in fixed prices** without modelling heavy users.
- **Justifying tools on speed** without checking the bottleneck.
- **Assuming internal tools carry no risk.**
- **Letting a tool become a product** without re-approval.
- **Describing AI features inaccurately** to customers.

## Frequently asked questions

**How do we know our per-use costs?** Check your AI service provider's pricing and usage reports, and test the feature at realistic volumes before launch. Revisit costs when providers change their prices.

**Should we tell customers a feature uses AI?** Be accurate and transparent about what the feature does and its limits, especially where customers rely on its outputs. Check any legal disclosure requirements that apply to your sector.

**Can an internal tool ever be measured in revenue?** Sometimes indirectly, for example if it lets you quote more jobs in the same time and win rates hold. Prefer measures closer to the tool's actual effect, such as time on the bottleneck.

**Who should own an AI feature in a small business?** The person responsible for the product or service it sits in, because they own its price, margin and customer promise, supported by whoever builds and maintains the technology.

**What if a feature is mainly for marketing appeal?** Then judge it on whether customers choose you because of it, and on its cost, rather than on technical quality alone.

## Questions to ask

- For each AI initiative, is it a feature or a tool, and do its measures match?
- What does our most-used AI feature cost per use, and what is our margin at heavy usage?
- Which bottleneck was each internal tool meant to relieve, and did it move?
- What have we promised customers about AI features, explicitly or by implication?
- Which internal tool is closest to being offered to customers, and who would approve that?
- If our AI provider doubled its prices, which products would stop being profitable?

## Bringing it together

AI inside what you sell and AI inside how you work are different assets on different clocks. Features need unit economics, careful pricing at heavy usage and clear limits on what they do. Tools need a bottleneck to relieve and a measure of the options they open up, not a revenue story they cannot honestly tell. Classify each initiative, measure it on the evidence it can actually produce, and treat any crossing from tool to product as a new decision. One question separates them: does a customer's use of this consume our cost?

---

*Source: BIZOMAT notes, drawing on Eliyahu Goldratt's theory of constraints. Examples and figures in this article are illustrations. This article is general information, not legal advice.*
