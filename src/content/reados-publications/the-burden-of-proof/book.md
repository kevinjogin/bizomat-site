---
title: "The Burden of Proof"
subtitle: "Who must prove a technical claim, how much evidence it needs, and how to decide while it is still unproven"
description: "How to weigh a supplier's technical claims: who carries the burden, what counts as proof, how extraordinary and untestable claims differ, and how to trial and decide on incomplete evidence."
category: Engineering
tags: [validation, quality, experimentation, strategy, customers]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-11
referencesChecked: 2026-11-11
edition: "1"
level: "Intermediate engineering practice"
audience: "Plant, maintenance, reliability and project engineers, and the managers who approve purchases, who must judge suppliers' performance, life and savings claims before committing money or plant to them."
outcomes:
  - "Allocate the burden of proof for each claim in a proposal, and recognise when an absence of evidence counts and when it does not."
  - "Reach one of three verdicts on a claim, accepted, rejected or not proven, and know what evidence each verdict needs."
  - "Test extraordinary claims against physical limits and prior plausibility before testing them against data."
  - "Rewrite claims that cannot fail into predictions that can, and scale the evidence demanded to the consequence of being wrong."
  - "Design a trial with a refutation rule written in advance, judge hidden-reason explanations fairly, and act while a claim is still unproven."
coverVariant: category
references:
  - title: "The Cambridge Companion to Atheism: General Introduction; chapter 4 (Theistic Critiques of Atheism); chapter 6 (Some Contemporary Theistic Arguments); chapter 10 (The Argument from Evil); chapter 14 (Feminism and Atheism)"
    creator: "Michael Martin (ed.), with William Lane Craig, Keith M. Parsons, Andrea M. Weisberger and Christine Overall; Cambridge University Press"
    year: "2007 (Cambridge Collections Online)"
    note: "Supplied source. Martin's distinction between the absence of belief and positive disbelief, and the two tasks positive disbelief requires; Craig's critique of the presumption of atheism and his point that an absence of evidence counts only where evidence would be expected; Parsons on attempts to shift the burden; Overall on the burden of evidence; and Weisberger's account of the appeal to unknown reasons and its reply, supply the book's framework. The book presents these debates evenly and takes no position on the religious questions; its structure, case and exercises are original."
  - title: "The Presumption of Atheism, Canadian Journal of Philosophy, vol. 2, no. 1, pp. 29–46"
    creator: "Antony Flew"
    year: "1972"
    note: "Origin of the argument that the burden of proof lies with the party making a positive claim, summarised in Chapter 1 as reported by Overall and criticised by Craig."
  - title: "Theology and Falsification, in Antony Flew and Alasdair MacIntyre (eds), New Essays in Philosophical Theology, SCM Press"
    creator: "Antony Flew"
    year: "1955 (first published 1950)"
    note: "Source of the parable of the invisible gardener and the idea of a claim that dies by a thousand qualifications, paraphrased in Chapter 4."
  - title: "An Enquiry Concerning Human Understanding, section X, Of Miracles"
    creator: "David Hume; Project Gutenberg ebook 9662"
    year: "1748; online edition"
    url: "https://www.gutenberg.org/ebooks/9662"
    note: "Public-domain source for Chapter 3's principle that belief should be proportioned to evidence, and that a report of an extraordinary event must be weighed against the chance that the report is mistaken. Paraphrased."
  - title: "The Ethics of Belief, Contemporary Review; reprinted in Lectures and Essays, Macmillan"
    creator: "W. K. Clifford"
    year: "1877; reprinted 1879"
    note: "Public-domain source of the shipowner example and the principle of believing on sufficient evidence, used in Chapter 5, with William James's later reply noted for balance."
  - title: "Constant repair rate (HPP/exponential) model, NIST/SEMATECH e-Handbook of Statistical Methods, section 8.4.5.1"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://www.itl.nist.gov/div898/handbook/apr/section4/apr451.htm"
    note: "Source of the MTBF confidence bounds used by the BIZOMAT tool in Chapter 2. The supplier's field data are invented."
  - title: "Exponential life distribution (or HPP model) tests, NIST/SEMATECH e-Handbook of Statistical Methods, section 8.3.1.1"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://www.itl.nist.gov/div898/handbook/apr/section3/apr311.htm"
    note: "Source of the test-length factor used by the BIZOMAT reliability demonstration tool in Chapter 6, and of its constant failure rate assumption, which the chapter shows does not suit wearing seals."
  - title: "What is misleading or deceptive conduct, ACCC small business toolkit"
    creator: "Australian Competition and Consumer Commission"
    year: "current guidance"
    url: "https://www.accc.gov.au/business/selling-products-and-services/small-business-toolkit/misleading-conduct-and-advertising/what-is-misleading-or-deceptive-conduct"
    note: "Background for Chapter 4's point that performance claims made to businesses are subject to the Australian Consumer Law. General information only, not legal advice."
  - title: "Misleading conduct and advertising: introduction, ACCC small business education program"
    creator: "Australian Competition and Consumer Commission"
    year: "current guidance"
    url: "https://accc.gov.au/business/selling-products-and-services/small-business-education-program/misleading-conduct-and-advertising/introduction"
    note: "States that misleading or deceptive conduct, and false representations, are prohibited whether made to consumers or to other businesses. Background only; not legal advice."
  - title: "Model Code of Practice: How to manage work health and safety risks"
    creator: "Safe Work Australia"
    year: "current model code"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-how-manage-work-health-and-safety-risks"
    note: "Background for Chapter 5's treatment of a seal leak of a hazardous chemical as a work health and safety risk. Apply the code adopted in your own jurisdiction."
  - title: "AS/NZS 3823 series (performance of electrical appliances: air conditioners and heat pumps)"
    creator: "Standards Australia and Standards New Zealand"
    year: "current editions"
    note: "Named by number and scope only, as the basis for the rating conditions of heat pump performance figures mentioned in Chapter 3. No values are taken from it."
related:
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
  - title: "Stage Gates and Stopping Rules by the Numbers"
    href: "/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/"
---

## About this book

Every purchase of plant rests on claims. The drive will save energy. The seal will last longer. The controller will not fail. The package will pay back in fourteen months. Some claims are true, some are true only under conditions the brochure does not mention, and a few are impossible. The buyer must decide which is which, usually before there is enough evidence to be sure, and the supplier usually holds most of the evidence.

This book is about that decision. It takes its framework from an old and well-argued debate in the philosophy of religion about the burden of proof: who must show what, what an absence of evidence can establish, what it takes to believe an extraordinary report, and what to make of an explanation that can absorb any evidence. The essays collected in *The Cambridge Companion to Atheism* set out both sides of that debate with care. The book uses only the structure of their arguments, and takes no position on the religious questions they address.

## Who it is for and how to use it

The book is for plant, maintenance, reliability and project engineers, and for the managers who approve what they recommend. It assumes basic engineering calculation and some familiarity with reliability statistics.

Read the chapters in order. Chapter 1 allocates the burden of proof. Chapter 2 sets out three verdicts: accepted, rejected and not proven. Chapter 3 deals with extraordinary claims and Chapter 4 with claims that cannot fail. Chapter 5 scales the evidence demanded to the consequence of being wrong. Chapter 6 designs a test that could prove a claim wrong, Chapter 7 judges the explanations offered when it does, and Chapter 8 shows how to act while a claim remains unproven. Each chapter ends with an exercise and a worked answer.

BIZOMAT Tools carry the calculations: MTBF confidence bounds, the Carnot limit claim check, the pump speed control plan, the risk rating matrix, Weibull reliability, the reliability demonstration test plan, the preventive replacement interval plan and equipment investment appraisal. Each chapter states what the tool calculates and the limits of its model, including one case where a tool's model does not fit the claim being tested.

## The running case

This is an illustration. A plastics moulding factory runs about 6,000 hours a year. Its mould cooling water is circulated by two pumps, P1 and P2, each throttled by a valve to about 1,350 L/min and drawing about 11.4 kW. Four more pumps of the same model and seal type serve other circuits. The maintenance records show fourteen seal failures across the six pumps in four years.

A supplier proposes a retrofit package for P1 and P2: two variable speed drives, a monitoring controller and two long-life mechanical seals, for A$21,300 excluding GST, with an optional heat-recovery heat pump quoted separately. Its proposal makes six claims. The drives save up to 40% of pump energy. The heat pump delivers 70 °C water from the cooling return at a coefficient of performance of 7.5. The seals last three times as long as standard seals. The controller has a field-proven MTBF of 150,000 hours. The package is maintenance-free. And it pays back in fourteen months.

The factory's plant engineer must recommend whether to buy. The book follows her through each claim.

All companies, people, prices, measurements, failure records and test results in the case are invented for teaching. They are not BIZOMAT work, and the supplier and its products are fictional. Nothing in the case describes any real product.

## Source limits and professional responsibility

This book is educational. It teaches a way of weighing evidence, not pump, seal or heat pump selection. Real decisions need manufacturers' data, measurements made for the purpose, and competent people. Where a claim bears on safety, such as a seal on a hazardous chemical service, the decision is governed by the work health and safety law of your jurisdiction. Statements about the Australian Consumer Law are general information, not legal advice.

The supplied source informed the framework only. The structure, case, calculations and exercises are original, and standards are named by number and scope only.
