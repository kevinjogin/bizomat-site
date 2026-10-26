---
book: engineering-software-you-can-sell
chapterSlug: terms-refunds-and-consumer-law
order: 8
title: "Terms, refunds and consumer law"
description: "Write licence terms that respect the Australian Consumer Law: consumer guarantees for software, unfair contract terms with small businesses, refunds and professional responsibility."
draft: false
---

Every software product comes with terms: what the customer may do, what the seller promises, what happens if something goes wrong. Many small sellers copy terms from a large overseas software company, on the reasoning that big companies have good lawyers. Those terms were written for a different legal system and a different kind of customer. In Australia, several of their standard clauses can mislead customers about rights they cannot lose, and some can be unfair terms that the law now penalises.

This chapter sets out the legal framework that shapes the drawing-checking add-in's terms and how the office's terms respond to it: consumer guarantees and their application to software, unfair contract terms in standard-form contracts with small businesses, refunds, limits of liability and the professional responsibility that sits with every engineer who uses a checking tool. The failure case is a licence copied from a template, which a lawyer's review found would have misled customers on day one.

This chapter is general information, not legal advice. Consumer and contract law is detailed and fact-dependent. The Australian Competition and Consumer Commission publishes guidance for businesses, and any firm selling software should have its terms reviewed by a lawyer.

## Software is goods under the Australian Consumer Law

The Australian Consumer Law includes consumer guarantees: goods must be of acceptable quality, fit for any purpose the customer made known, and match their description, among other things. These guarantees cannot be excluded by contract.

The definition of goods in the law expressly includes computer software. In 2016 the Federal Court found that a large online games platform had made misleading representations about consumer guarantees, rejecting its argument that it supplied services rather than goods. The ACCC noted it was the first time the courts had applied the extended definition of goods to computer software, and the decision confirmed that this applies even when the software is licensed rather than sold outright. Software sold to customers in Australia carries the consumer guarantees where they apply, wherever the seller is based.

## Business customers are often consumers too

It is easy to assume that consumer law is about households, and that a product sold to engineering firms is outside it. That assumption is often wrong. According to the ACCC's guidance, since 1 July 2021 the consumer guarantees protect anyone who acquires goods or services costing **A$100,000 or less**, as well as more expensive goods of a kind normally bought for personal, domestic or household use. Some purchases are excluded, notably goods bought to resupply. Before 1 July 2021 the threshold was A$40,000.

A firm buying a few seats of an add-in, or even a site licence, will usually spend far less than A$100,000, so it is generally a consumer for the purposes of the guarantees, even though it is a business.

```figure
type: decision
title: Do the consumer guarantees apply to this sale?
question: Is the purchase A$100,000 or less, or of a kind ordinarily bought for personal or household use, and not bought to resupply?
caption: A simplified guide based on the ACCC's published guidance for businesses, for orientation only. Edge cases need legal advice.
- *Yes | Treat the guarantees as applying | the add-in must be of acceptable quality, fit for disclosed purposes and as described; terms must not suggest otherwise
- No, over A$100,000 for business use | Guarantees may not apply to that sale | the contract governs; still avoid misleading statements and unfair terms where those laws apply
- No, bought for resale | A reseller is not the consumer | the end customer who buys from the reseller usually is
```

## Unfair contract terms in standard-form contracts

A licence agreement that customers accept by clicking, or sign without negotiation, is a standard-form contract. The unfair contract terms laws cover standard-form contracts with consumers and with small businesses. Government guidance describes a small business, for this purpose, as one with fewer than 100 employees or annual turnover under A$10 million. Most of the add-in's customers, and most engineering firms in Australia, meet that description.

From **9 November 2023**, the law has prohibited businesses from proposing, using or relying on unfair terms in such contracts, and courts can impose penalties. The ACCC's published maximum for a company is the greatest of A$50 million, three times the benefit obtained from the conduct, or, where that cannot be determined, 30% of adjusted turnover during the breach period. The change applies to contracts made, renewed or varied from that date. Subscriptions renew every year, so every renewal is a new opportunity for the terms to be judged.

A term may be unfair if it causes a significant imbalance in the parties' rights, is not reasonably necessary to protect the legitimate interests of the party relying on it and would cause detriment if relied on. Terms commonly found in overseas software licences that deserve scrutiny in Australia include those letting the seller change terms or prices at any time without notice, terminate without cause while the customer cannot, or exclude almost all liability while the customer bears all the risk.

## The office's terms

The office's lawyer rewrote its licence terms around a few principles. This is an illustration of the result, not a template to copy.

```figure
type: compare
title: Terms copied from a template, and the office's rewritten terms
cols: Problem in an Australian sale | Rewritten term
caption: This is an illustration. The rewritten terms were drafted by the office's lawyer for its own circumstances; other products need their own advice.
- "No refunds under any circumstances" | could mislead customers about consumer guarantees | refunds and remedies as required by the Australian Consumer Law, plus a 30-day money-back offer for first purchases
- "We may change these terms at any time" | one-sided change, a likely unfair term | changes take effect at the next renewal, with at least 60 days' notice, and the customer may decline by not renewing
- *"All warranties are excluded" | cannot exclude the consumer guarantees; misleading if presented as complete | a statement of the guarantees the law provides, and what the office additionally promises
- "Liability limited to nil" | likely unenforceable and unfair against consumers and small businesses | liability limited as far as the law permits, with the guarantees preserved
- "We may terminate at any time for any reason" | one-sided termination | termination for material breach by either party, with notice and a chance to fix it
```

The terms also state, plainly and early, that the add-in assists checking and does not replace professional judgement, which the next section explains.

## Terms people will actually read

Licence terms that nobody reads protect nobody well. Customers who do not know what they agreed to are surprised when a term is applied, and surprise turns into disputes. The office publishes a one-page plain-language summary beside its full terms, covering what the customer may do, what the office promises, how renewal, price changes and cancellation work, refunds and consumer guarantees, what data the add-in sends, and the professional-responsibility statement. The summary says that the full terms govern, and the lawyer checked that the two agree.

Customers' purchasing and legal staff read the summary first, and most of their questions are answered by it. That shortened the approval process at several larger firms, whose legal teams would otherwise have spent hours on a licence for a few hundred dollars of software.

## Data and privacy terms

The terms and the privacy policy also cover the data the add-in handles. Chapter 6 listed what the licence check sends, and Chapter 4 described the opt-in usage counts and the customer register. The terms commit the office to using that data only to provide, support and improve the product, never to sell it, and to tell customers about any change at renewal. The privacy policy explains what personal information the office holds about customers' contacts and how to have it corrected or removed.

Whether the Privacy Act applies to a particular firm depends on its turnover and activities. The office follows the Australian Privacy Principles regardless, because its customers' IT and legal staff expect it and because the cost of doing so for a small product is low.

## Keep a record of what each customer agreed to

Terms change over time, and a dispute is judged against the terms the customer actually accepted. The office keeps every version of its terms with its date. The licence portal records which version each customer accepted, when and by whom, at first purchase and at each renewal. When the terms change, the new version applies from each customer's next renewal, as the terms promise, and the portal shows the customer the summary of changes before they accept.

## Refunds

The consumer guarantees give customers rights to remedies when goods fail them. Depending on whether a failure is major or minor, those remedies can include repair, replacement or a refund. A seller cannot remove those rights by saying "no refunds".

On top of the guarantees, the office offers a voluntary **30-day money-back** offer on a customer's first purchase. Combined with the 30-day free trial in Chapter 5, it makes buying low-risk for a cautious firm. In two years, the office refunded three first purchases under the offer. Two were firms whose CAD release turned out to be older than the supported versions, which the office now checks during the trial, and one was a firm that changed its mind. The three refunds together cost less than a single day of the office's engineering time, and each firm spoke well of the office afterwards.

## Professional responsibility does not move to the software

A drawing-checking add-in finds certain kinds of error. It does not check whether the design is right, whether the tolerances are suitable or whether the drawing meets the client's real needs. Engineers who sign or approve drawings carry professional responsibility for them, and a tool cannot take it on.

The office's terms, user guide and the add-in's own report all say so in plain words: the add-in checks drawings against the rules in the customer's configuration and reports what it finds; a drawing that passes may still contain errors the rules do not cover; checking and approval remain the responsibility of the customer's qualified people. That statement protects the office. It also states the truth, which is the best defence against a customer who relies on the tool more than they should.

The office also accepts its own responsibility. If the add-in fails to report something its rules say it should, that is a defect in the product, and the office treats it as one under the guarantees and its support commitments.

## A failure case: the borrowed licence

This is an illustration. Before launch, the office's lead designer drafted the licence terms by adapting a licence agreement from a large overseas software company's website, changing the names and the product description. It contained, among other things, a "no refunds" clause, a clause excluding "all warranties, express or implied", a liability cap of nil and a right for the seller to change the terms at any time by posting them on its website.

The principal sent the draft to the office's lawyer for a quick check before launch, expecting a short reply. The reply was not short. The lawyer explained that several of the clauses could mislead Australian customers about their rights under the consumer guarantees, which can itself breach the law. The unilateral change clause and the nil liability cap could be unfair terms in standard-form contracts with small businesses, which most of the office's customers would be. And the borrowed document's governing law was a foreign jurisdiction, which made no sense for an Australian seller.

The detection came before any sale because the principal asked for a review. Without it, the problem would most likely have surfaced in a reseller's legal review (Chapter 9) or, worse, in a dispute with a customer. The lawyer's rewrite cost about **A$2,500** excluding GST. The office now has its terms reviewed whenever the product, the pricing model or the law changes, and at least every two years.

```figure
type: checklist
title: Terms review before launch
caption: This is an illustration of the office's checklist with its lawyer. It is a prompt for advice, not a substitute for it.
- Consumer guarantees acknowledged; no statement implies they can be excluded | including "no refunds" and "no warranties" wording
- Changes to price or terms take effect at renewal, with notice | customer may decline by not renewing
- Termination and liability terms balanced between the parties | reviewed against unfair contract terms rules
- Professional responsibility for drawings stated plainly | in terms, guide and the add-in's report
- Governing law and how disputes are handled stated | Australian state or territory
- ? Overseas customers' own consumer laws | advice before selling into each country
- x Terms copied from an overseas template without review | written for a different legal system
```

## How this applies to a small Australian business

Most Australian engineering firms will never be in a consumer law dispute over software, and the reason is usually that the seller was fair and clear from the start. Fair terms, a refund offer a little more generous than the law requires and a plain statement of what the tool does and does not do cost very little. They remove most of the reasons customers have to complain. A lawyer's review of standard terms is one of the best-value purchases a small software seller makes. The ACCC's small business guidance on consumer guarantees and unfair contract terms is written for non-lawyers and is worth reading before the lawyer's meeting. Bring the lawyer the facts that matter: who the customers are, what they pay, how the licence renews, what the product does and does not do and what data it handles. A clear brief makes the review faster, cheaper and better suited to the product.

## Exercise: three clauses

A reseller proposes that the office's add-in be sold under the reseller's own standard terms, which include: (a) "Prices may be varied by the reseller at any time"; (b) "The software is supplied as is, without any warranty"; (c) "Customer must report defects within 7 days of installation or lose all rights". For each, identify the concern for sales to Australian engineering firms with fewer than 100 employees, and suggest what the office should ask for.

**Worked answer.** (a) A one-sided right to vary price at any time in a standard-form contract with a small business may be an **unfair term**. Ask for price changes to apply only from the next renewal, with notice, and a right not to renew. (b) "As is, without any warranty" could **mislead** customers about the consumer guarantees, which apply to software where the purchase is within the consumer thresholds and cannot be excluded. Ask for wording that preserves the guarantees. (c) A 7-day limit on reporting defects could also mislead customers about their rights and may be unfair. Consumer guarantee rights are not lost because a fault is reported after an arbitrary period. Ask for it to be removed or replaced with a reasonable support process. In each case the office should take legal advice, because the reseller's terms will carry the office's product to its customers.
