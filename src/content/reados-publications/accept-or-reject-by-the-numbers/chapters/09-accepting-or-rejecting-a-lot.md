---
book: accept-or-reject-by-the-numbers
chapterSlug: accepting-or-rejecting-a-lot
order: 9
title: "Accepting or rejecting a lot"
description: "Decide about lots by sampling: designing a plan for producer's and consumer's risk, operating characteristics, lot acceptance from process capability, and what a sample adds to prior data."
draft: false
---

The decisions so far were about single parts. Many quality decisions are about lots: a customer receives 2,000 bushes, inspects a sample, and accepts or rejects the whole delivery on the result. Sampling inspection is cheaper than inspecting every part, and for a customer who knows little about a supplier's process, it is a sensible defence. But a sampling plan answers a narrower question than most people think it does, and both supplier and customer can draw the wrong conclusion from a lot that passes.

This chapter looks at the cylinder maker's incoming inspection of BU-25 from both sides. It designs the plan with the BIZOMAT acceptance sampling plan tool, reads its operating characteristic with the sampling probability tool, links it to the shop's process capability with the lot acceptance tool, and asks what a sample actually tells either party when the process is already well known. The error is a supplier that let the customer's sampling plan do its inspection.

## The customer's plan

A single sampling plan by attributes takes a random sample of n parts from each lot, counts the defectives, and accepts the lot if there are no more than c. It is designed around two quality levels. The acceptable quality level is a defective rate the customer is content to receive, and lots at that level should usually be accepted; the probability of rejecting them is the producer's risk. The rejectable quality level is a rate the customer wants to keep out, and lots at that level should usually be rejected; the probability of accepting them is the consumer's risk. Standard tables, such as those of ISO 2859-1, index plans by the acceptable quality level and lot size. Plans can also be designed directly from the binomial distribution.

The [acceptance sampling plan tool](/tools/acceptance-sampling-plan/) does that: it finds the smallest sample size and acceptance number whose binomial operating characteristic accepts lots at the acceptable level with at least one minus the producer's risk, and lots at the rejectable level with at most the consumer's risk. It reports the plan, its acceptance probabilities at both levels and its average outgoing quality limit, and checks any plan the user enters against the same two requirements.

This is an illustration. The cylinder maker asks for an acceptable quality level of 1% defective with a producer's risk of 5%, and a rejectable level of 5% with a consumer's risk of 10%. The tool designs a plan of **n = 132, c = 3**. It accepts lots at 1% defective 95.6% of the time and lots at 5% defective 9.9% of the time, so it protects both parties as asked, and its average outgoing quality limit is 1.47%.

## The operating characteristic

A plan's behaviour is summed up by its operating characteristic: the probability of accepting a lot as a function of the lot's true fraction defective. The [acceptance sampling probability tool](/tools/sampling-oc/) calculates it for any plan, with the probability of rejection and the average outgoing quality at the fraction entered, and a table of acceptance probabilities at standard defect levels.

```figure
type: line
title: Operating characteristic of the plan n = 132, c = 3
x: Lot fraction defective, %
y: Probability the lot is accepted, %
ymin: 0
ymax: 100
caption: This is an illustration, from the binomial distribution, as the BIZOMAT sampling probability tool calculates it. The plan accepts 95.6% of lots at 1% defective and 9.9% at 5%.
- 0.1 | 100.0
- 0.5 | 99.5
- 1 | 95.6
- 2 | 72.8
- 3 | 43.8
- 5 | 9.9
- 8 | 0.5
```

Entering n = 132, c = 3 and a lot at 2% defective, the tool gives a 72.8% probability of acceptance, a 27.2% probability of rejection and an average outgoing quality of 1.456%: lots at 2% that pass go through unchanged, and lots that are rejected are, in the usual arrangement, sorted completely, so the average quality leaving the customer's receiving dock is better than 2%. The worst average outgoing quality, over all incoming levels, is the 1.47% limit the design tool reported.

The curve's lesson is that the plan discriminates well between 1% and 5% and poorly between, say, 0.2% and 1%: both are accepted almost always. A sampling plan is a coarse filter. It keeps out lots that are much worse than the acceptable level and lets everything else through.

## Lots from a known process

The supplier can do better than wonder how its lots will fare. If the process capability is known, the lot's fraction defective can be predicted, and with it the probability that the customer's plan accepts the lot. The [lot acceptance from process capability tool](/tools/lot-acceptance-from-capability/) does exactly this: from the process mean, standard deviation and limits, it calculates the fraction out of tolerance for a normal process, then the probability that a sampling plan with the given n and c accepts a lot with that fraction, the share of lots rejected and the average outgoing quality, and checks the acceptance probability against the level the supplier needs.

```figure
type: compare
title: BU-25 lots against the customer's plan, n = 132, c = 3
cols: Fraction defective in the lot | Probability the lot is accepted | Defective bushes reaching the customer per 2,000
rowhead: What the shop ships
- Lots straight from the lathe, no inspection | 0.776%, from capability | 98.0% | about 15.2
- * Lots after the shop's 100% inspection | about 0.055%, gauge and camera escapes | more than 99.99% | about 1.1
caption: This is an illustration. The first row is from the BIZOMAT lot acceptance tool with mean 25.0125 mm, standard deviation 0.0035 mm and limits 25.000 to 25.021 mm. The second uses Chapter 3's 0.34 bore escapes and Chapter 7's 0.76 chatter escapes per 2,000.
```

The first row is the striking one. Uninspected bushes, with 0.78% out of tolerance, would pass the customer's plan 98% of the time. The tool reports that such lots will pass, since 98% exceeds a required 95%. The plan was designed to accept lots at up to 1% defective, and 0.78% is within that. Passing the customer's sampling does not mean the bushes are good; it means they are not much worse than 1%.

## What a sample tells each party

A sample's information depends on what was known before it. For the customer, with no knowledge of the shop's process, a sample of 132 with no defectives is useful but limited evidence. Starting from a flat prior, every defect rate equally likely, it leaves about a 26% probability that the lot is worse than 1% defective, but only about a 0.1% probability that it is worse than 5%. That matches the plan's purpose: it rules out disasters, not mediocrity.

For the shop, which knows from its gauging, audits and Chapter 8's estimates that its shipped lots run at about 0.055% defective, the customer's sample adds almost nothing. A lot at 0.055% has a 93% chance of showing no defectives in 132, and a probability above 99.99% of passing. A pass confirms what the shop already knew, and a rejection would be a surprise demanding investigation of a special cause, not a routine event. This is the Bayesian view of sampling: the same sample result means very different things to people with different prior knowledge, and the more one knows about the process, the less a sample adds. It also suggests how a customer might use a supplier's data. If the shop shares its audit estimates, the customer can start from the shop's posterior distribution rather than a flat prior, discounted for any doubt about the data, and a small sample then serves to check that the shared data are honest rather than to establish quality from nothing. The sample size needed for that purpose is far smaller than the one needed to protect against an unknown process.

```figure
type: decision
title: What a sampling plan is good for
question: What does the receiver already know about the process?
caption: Sampling is most valuable where knowledge is least. A supplier with good process data should not rely on the customer's sample, and a customer with good supplier data can often reduce sampling.
- Nothing | a new supplier or a new part | sampling is the main protection against bad lots
- Some history | several passed lots, occasional data | sampling detects disasters; reduced or skip-lot sampling may suit
- * Good process data shared | capability, audits, inspection records | sampling confirms; the process data carry the quality
```

The practical consequence for customers is that sharing process data can replace much incoming sampling. Many customers move suppliers with demonstrated capability and inspection records to reduced or skip-lot inspection, saving their own receiving time. For suppliers, the consequence is that the customer's plan is a check on the supplier's system, not part of it.

## Sample size, lot size and randomness

Three practical points decide whether a plan behaves as its operating characteristic says.

The first is lot size. The binomial calculation assumes that drawing a sample does not change the chance that the next part drawn is defective, which is true when the lot is much larger than the sample. The sampling probability tool notes that for lots under about ten times the sample size, the hypergeometric distribution, which allows for sampling without replacement, should be used instead. A lot of 2,000 bushes is about fifteen times the sample of 132, so the binomial is adequate; a lot of 500 would not be, and the plan's real protection would be somewhat better than the binomial curve shows.

The second is randomness. The operating characteristic assumes that every part in the lot is equally likely to be sampled. A receiving inspector who takes 132 bushes from the top layer of the box samples the last hour's production, not the lot, and if defects cluster in time, as chatter does when a boring bar fails, the sample can miss a bad stretch entirely or catch it disproportionately. Taking parts from several layers or boxes, or numbering the boxes and choosing them at random, keeps the plan honest.

The third is what counts as a defective. The plan counts bushes failing the customer's own check, with the customer's gauge and decision rule. If the customer's gauge has a larger uncertainty than the shop's, or uses the tolerance limits as its acceptance limits, its count will include some false rejects and miss some true defects, by exactly the arithmetic of Chapters 2 and 3. Agreeing the measurement method and decision rule with the customer avoids disputes in which both parties measured correctly and still disagree.

## Rejected lots and what follows

When a lot is rejected, the usual consequence is that it is sorted: every part inspected, the defectives removed, and the rest accepted. The cost falls on whoever the contract says, often the supplier, and sorting at the customer's site is expensive. The rejection also usually triggers a corrective action request and, under many sampling schemes including those of ISO 2859-1, a switch to tightened inspection for subsequent lots until quality is shown to have recovered. For a supplier, a single rejected lot therefore costs far more than the lot itself, which is another reason to treat a rejection as a special cause to investigate, not as bad luck.

## Lot decisions and part decisions

Chapter 1 noted that deciding each part on its own probability minimises the number of parts decided wrongly, while a lot decision treats the whole lot as one. The two can disagree. A lot at 2% defective is accepted by the customer's plan 73% of the time, and when it is, all 40 defective bushes in 2,000 go to the assembly line. A 100% inspection of the same lot would remove almost all of them. Sampling is cheaper per lot, and the price is that, when the lot is accepted, nothing about its individual bushes has been decided at all. For a part like BU-25, where a single bad bush costs A$400 at the customer, lot sampling suits the customer's protection against a broken supplier process, and 100% inspection, or a capable process, suits the protection of each assembly.

## The error: letting the customer inspect

This is an illustration. Under pressure to cut costs, the shop's operations manager proposed stopping the air gauge's 100% inspection, reasoning that the customer sampled every lot and that lots had always passed. If quality slipped, the customer's plan would catch it. For three weeks the bushes were shipped straight from the lathe.

Every lot passed the customer's sampling. Over the same three weeks, the cylinder maker's assembly line found about 15 oversize bushes in every 2,000, failures at the press-fit station that stopped the line each time. The lot acceptance tool, run afterwards, showed why both facts were true at once: at 0.78% defective, lots pass the plan 98% of the time, so the plan was never going to catch the problem. At A$400 each, the escapes cost about A$6,000 a shift, against about A$730 a shift for 100% gauging, its wrong decisions included.

The 100% inspection was reinstated the same week. The lesson was recorded in the shop's quality plan: the customer's sampling plan protects the customer against lots much worse than 1%; it does not protect the customer's assembly line against a steady 0.78%, and it is not part of the shop's inspection.

## Exercise: a tighter plan

This is an illustration. At the next contract review, the cylinder maker proposes an acceptable quality level of 0.65% and a rejectable level of 4%, with the same risks of 5% and 10%.

1. The acceptance sampling plan tool designs n = 166, c = 3. What are its acceptance probabilities at 0.65% and 4%?
2. What would it accept of uninspected BU-25 lots, at 0.776% defective?
3. Does the tighter plan change the conclusion of this chapter's error?

**Worked answer.**

1. The tool reports **97.6%** at 0.65% defective and **9.8%** at 4%, meeting both risks, with an average outgoing quality limit of **1.17%**.
2. With the lot acceptance tool or the sampling probability tool, a lot at 0.776% defective is accepted about **95.9%** of the time.
3. **No.** The tighter plan still accepts uninspected lots almost every time, because 0.78% is barely above its acceptable level. A sampling plan cannot distinguish reliably between rates this close; only inspection of every bush, or a better process, protects each assembly from the steady 0.78%.
