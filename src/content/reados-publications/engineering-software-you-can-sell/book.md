---
title: "Engineering Software You Can Sell"
subtitle: "Turning an in-house CAD tool into a product: market, ownership, packaging, licensing, price, terms, channels and support"
description: "Turn an in-house engineering tool into a software product: test the market, secure ownership, package and license it, price with GST, meet consumer law and support it."
category: Business
tags: [product-development, strategy, sales, finance, startups]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate engineering business"
audience: "Engineering firm owners, design managers and technical staff who have built a useful CAD add-in, calculator or automation tool and are considering selling it to other firms."
outcomes:
  - "Test whether other firms will pay for an in-house tool before spending on productising it."
  - "Check ownership of the code, its components and the name before selling anything."
  - "Estimate the real effort and cost of turning a working tool into a supportable product."
  - "Choose licensing, pricing and channels with the revenue and GST arithmetic worked through."
  - "Write terms that respect the Australian Consumer Law and plan support and end of life honestly."
coverVariant: category
references:
  - title: "SolidWorks 2009 API: Advanced Product Development, first edition"
    creator: "Luke Malpass, AngelSix"
    year: "2008–2013"
    note: "Supplied source, read for its subject map: planning a CAD add-in as a product, installers, licensing approaches, preparing a product for market, online and reseller distribution and marketing. All rights reserved; no text, code, figures or structure are reproduced. Its specific reseller percentages are not used."
  - title: "Registering for GST"
    creator: "Australian Taxation Office"
    year: "current web page"
    url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst"
    note: "Source for the GST registration threshold of A$75,000 GST turnover (A$150,000 for non-profit bodies) used in Chapter 7. General information only."
  - title: "Goods and services tax (GST)"
    creator: "business.gov.au, Australian Government"
    year: "current web page"
    url: "https://business.gov.au/New-to-business-essentials/Goods-and-services-tax-GST"
    note: "Background on GST registration, tax invoices and the treatment of sales to overseas customers, which Chapter 7 refers readers to rather than summarising in detail."
  - title: "Federal Court finds Valve made misleading representations about consumer guarantees"
    creator: "Australian Competition and Consumer Commission"
    year: "2016"
    url: "https://www.accc.gov.au/media-release/federal-court-finds-valve-made-misleading-representations-about-consumer-guarantees"
    note: "Source for the point in Chapter 8 that computer software is treated as goods under the Australian Consumer Law, including when it is licensed."
  - title: "Consumer rights and guarantees: who is protected"
    creator: "Australian Competition and Consumer Commission"
    year: "current web page"
    url: "https://www.accc.gov.au/business/selling-products-and-services/small-business-toolkit/consumer-rights-and-guarantees/who-is-protected"
    note: "Source for the consumer guarantees applying to purchases of A$100,000 or less (since 1 July 2021), including many business-to-business purchases, and the exclusion for goods bought for resupply."
  - title: "Businesses urged to remove unfair contract terms ahead of law changes"
    creator: "Australian Competition and Consumer Commission"
    year: "2023"
    url: "https://www.accc.gov.au/media-release/businesses-urged-to-remove-unfair-contract-terms-ahead-of-law-changes"
    note: "Source for the prohibition on unfair terms in standard form contracts with consumers and small businesses from 9 November 2023 and the penalties that now apply. The small-business definition (fewer than 100 employees or turnover under A$10 million) is as reported in government and legal summaries."
  - title: "4 intellectual property considerations for software ownership"
    creator: "Business Victoria, Victorian Government"
    year: "current web page"
    url: "https://business.vic.gov.au/learning-and-advice/hub/4-intellectual-property-considerations-for-software-ownership"
    note: "Background for Chapter 2: employers generally own software written by employees in the course of employment, while contractors generally keep copyright unless it is assigned in writing."
  - title: "Semantic Versioning 2.0.0"
    creator: "Tom Preston-Werner"
    year: "2013"
    url: "https://semver.org/"
    note: "Reference for the version numbering discussed in Chapter 4."
related:
  - title: "CAD Automation by the Numbers"
    href: "/reados/publications/cad-automation-by-the-numbers/"
  - title: "Pricing your product or service"
    href: "/reados/collections/pricing-margins-and-profitability/pricing-your-product-or-service/"
  - title: "Trade marks for small businesses"
    href: "/reados/collections/starting-funding-and-structuring-a-business/trade-marks-for-small-businesses/"
---

## About this book

Engineering firms build software all the time: macros that save hours, add-ins that check drawings, calculators that size parts, scripts that export data. Sometimes a tool is good enough that people outside the firm ask for it. The idea of selling it is attractive: the work is done, other firms have the same problem, and every copy sold is almost pure margin. The reality is that a tool that works in its own office is perhaps a third of a product. The rest is everything needed for strangers to install it, trust it, pay for it, get help with it and keep using it for years.

This book is for engineering firm owners, design managers and technical staff considering that step. It covers testing the market before spending money, making sure the firm actually owns what it plans to sell, turning a tool into a supportable product, installing and updating it at many sites, choosing a licensing model and protecting it without punishing honest customers, pricing it and handling GST, writing terms that respect the Australian Consumer Law, choosing between direct sales and resellers, and supporting the product through to its end of life. Each chapter works one decision through the running case with real numbers and ends with an exercise and its worked answer.

It assumes the reader understands their own engineering work and the tool they have built. It does not assume any background in software business, licensing or consumer law.

## The running case

The book follows a fictional 12-person structural and mechanical design office that built a **drawing-checking add-in** for its own CAD system. The add-in checks each drawing before release for missing title-block properties, inconsistent revision tables, untoleranced dimensions and layer and style breaches. Inside the office it saves about a quarter of an hour on each of about 2,400 drawings a year. Several clients and two peer firms have asked whether they can buy it.

All quantities, prices, costs and results are invented for teaching. This is an illustration. None of it describes a KEVOS® product, client or result. Money is in Australian dollars, and each example says whether GST is included.

## How to use the book

Read Chapters 1 and 2 before spending anything: they decide whether to go ahead at all. Chapters 3 and 4 cover the engineering of a product, Chapters 5 to 8 the commercial decisions and Chapters 9 and 10 selling and supporting it. The companion book [CAD Automation by the Numbers](/reados/publications/cad-automation-by-the-numbers/) covers building, testing and deploying a CAD tool for internal use, which is the foundation for everything here.

## Source limits and professional responsibility

A 2009 book on developing and selling an add-in for one CAD system was supplied for this book. It was used only to choose the subject and identify the stages from tool to product. The structure, case, calculations, figures and exercises here are original. Legal and tax points are paraphrased from public guidance by Australian regulators and government agencies and are stated at a general level.

This book is educational. It is not legal, tax or financial advice. Consumer law, contract law, intellectual property and tax rules are detailed, change over time and depend on circumstances. Before selling software, a firm should take advice from a lawyer and an accountant on its own situation. An engineering software product also carries professional responsibility for what users do with its results, which no licence term entirely removes.
