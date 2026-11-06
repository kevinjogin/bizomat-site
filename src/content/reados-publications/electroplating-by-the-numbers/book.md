---
title: "Electroplating by the Numbers"
subtitle: "Faraday's laws, current, thickness, adhesion, hydrogen and cost for engineers who specify and buy plated parts, from a 1917 treatise to modern practice"
description: "Specify, check and cost electroplated finishes: Faraday's laws, current efficiency and density, thickness distribution, preparation, hydrogen embrittlement, zinc life and rinsing."
category: Manufacturing
tags: [manufacturing, quality, design, process-improvement, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-24
referencesChecked: 2026-10-24
edition: "1"
level: "Intermediate manufacturing and design engineering"
audience: "Design engineers, manufacturing and quality engineers, buyers and supervisors who specify, purchase, inspect or run electroplated finishes on metal parts, and want to understand what the numbers on a plating specification mean."
outcomes:
  - "Write a plating specification that states the coating, minimum thickness, significant surfaces, supplementary treatments and embrittlement relief."
  - "Use Faraday's laws to calculate deposit mass, thickness and plating time, and allow for current efficiency."
  - "Explain how current density and part geometry set the thickness at edges and in recesses, and design parts that plate evenly."
  - "Recognise when hydrogen embrittlement is a risk and what pre-treatment, baking and alternative coatings are for."
  - "Estimate the service life of a zinc coating, the rinse water a line needs and the cost of plating a part."
coverVariant: category
references:
  - title: "Applied Electrochemistry and Welding (Part I, Applied Electrochemistry; Part II, Welding)"
    creator: "Charles F. Burgess and George W. Cravens (American Technical Society, Chicago)"
    year: "1914, 1917"
    note: "Historical source used throughout for the principles of the electrolytic cell, Faraday's laws, current density, deposit quality, surface preparation and plating practice of the period. Its ideas are discussed in new words; none of its text, tables or illustrations is reproduced, and its solutions and practices are not modern instructions."
  - title: "Faraday constant, CODATA recommended value"
    creator: "National Institute of Standards and Technology"
    year: "reference value"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?f"
    note: "Source for the Faraday constant, 96,485.332 12 C/mol, exact in the current SI, used in all deposit calculations from Chapter 2."
  - title: "HDG Corrosion Rates for ISO Categories C1-C5/X"
    creator: "American Galvanizers Association"
    year: "2021"
    url: "https://galvanizeit.org/knowledgebase/article/hdg-corrosion-rates-for-iso-categories-c1-c5-x"
    note: "Source for first-year zinc corrosion rates by ISO 9223 corrosivity category, used in Chapter 8 to estimate the life of a thin zinc coating."
  - title: "Guide to controlling the risks associated with electroplating"
    creator: "Safe Work Australia"
    year: "guidance"
    url: "https://safeworkaustralia.gov.au/doc/guide-controlling-risks-associated-electroplating"
    note: "Cited in Chapters 1 and 9 as the national guidance on chemical, electrical, plant and other hazards in electroplating, anodising and metal finishing workplaces."
  - title: "Chromium technical fact sheet"
    creator: "SafeWork NSW"
    year: "fact sheet"
    url: "https://www.safework.nsw.gov.au/resource-library/hazardous-chemicals/chromium-technical-fact-sheet"
    note: "Source for the health effects of hexavalent chromium, its release in chrome electroplating and the controls and health monitoring discussed in Chapter 9."
  - title: "AS/NZS 1789:2023 Electroplated zinc (electrogalvanized) coatings on ferrous articles (batch process)"
    creator: "Standards Australia and Standards New Zealand"
    year: "2023"
    url: "https://store.standards.org.au/product/as-nzs-1789-2023"
    note: "Named in Chapters 1 and 10 as the Australian standard for batch zinc electroplating on iron and steel, which adopts ISO 2081:2018 with modifications. No content is reproduced; obtain the current edition before use."
  - title: "ISO 2081 Metallic and other inorganic coatings: electroplated coatings of zinc on iron or steel"
    creator: "International Organization for Standardization"
    year: "2018 and 2025 editions"
    note: "Named in Chapters 1 and 8. The 2025 edition narrowed the scope to zinc with supplementary treatments containing hexavalent chromium; check which edition a specification calls up. No content is reproduced."
  - title: "ISO 4042 Fasteners: electroplated coating systems"
    creator: "International Organization for Standardization"
    year: "2022"
    note: "Named in Chapters 1 and 7 as the standard for electroplated steel fasteners, including requirements and recommendations to minimise the risk of hydrogen embrittlement. No values are quoted."
  - title: "ISO 9587 and ISO 9588 Metallic and other inorganic coatings: pretreatment and post-coating treatments of iron or steel to reduce the risk of hydrogen embrittlement"
    creator: "International Organization for Standardization"
    year: "2007"
    note: "Named in Chapter 7 by number and scope. No baking temperatures or times are quoted from them."
  - title: "ISO 9227 Corrosion tests in artificial atmospheres: salt spray tests"
    creator: "International Organization for Standardization"
    year: "standard"
    note: "Named in Chapter 8 as the common accelerated salt spray method used to compare passivates and check process consistency. No content is reproduced."
  - title: "ISO 2178, ISO 3497 and ISO 2177 coating thickness measurement methods"
    creator: "International Organization for Standardization"
    year: "2016, 2000 and 2003"
    note: "Named in Chapter 10 as the magnetic, X-ray spectrometric and coulometric methods of measuring coating thickness. No content is reproduced."
related:
  - title: "Protecting metals from corrosion and wear"
    href: "/reados/collections/machine-elements-and-mechanical-design/protecting-metals-from-corrosion-and-wear/"
  - title: "Designing sheet metal parts for manufacture"
    href: "/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-sheet-metal-parts-for-manufacture/"
  - title: "Oxy-Fuel by the Numbers"
    href: "/reados/publications/oxy-fuel-by-the-numbers/"
---

## About this book

Most engineers meet electroplating as a line on a drawing: "zinc plate", "bright nickel", "hard chrome". The line hides a manufacturing process with its own physics, chemistry, defects, hazards and costs. A plated part can arrive with half the coating the designer intended, with bare metal in a recess, with blisters that lift in a month, or with a coating that is perfect while the steel underneath has been made brittle by hydrogen. Almost all of those outcomes can be predicted, specified against and checked, if the numbers behind the process are understood.

This book is for the people who write that line on the drawing or answer for what comes back: design, manufacturing and quality engineers, buyers and supervisors. It assumes school chemistry and physics, simple algebra and SI units. It does not teach how to run a plating line; that needs trained platers, chemical suppliers and the controls that regulators require. It teaches what a plater's numbers mean, so a specification can be written clearly, a supplier's process questioned sensibly and a result checked on evidence.

## A 1917 treatise as the starting point

*Applied Electrochemistry and Welding*, published in Chicago by the American Technical Society, with copyrights of 1914 and 1917, was a practical textbook for engineers and tradespeople. Its first part, by Charles F. Burgess, a former professor of chemical engineering and applied electrochemistry at the University of Wisconsin, explains the electrolytic cell, Faraday's laws, electroplating, electrolytic refining and the industrial chemistry of the day. Its second part, by George W. Cravens, covers welding.

The plating chapters are short, but almost every principle in them still governs the process: the amount deposited follows the current and the time; the current density decides whether the deposit is sound or burned; a deposit is only as good as the cleanliness of the surface beneath it; plating roughens rather than smooths; and the cost lies mainly in the labour of preparing, racking and finishing. Each chapter of this book takes one of those principles, restates it in modern terms with current units and standards, and works it through a modern case.

## The running case

This is an illustration. A sheet-metal workshop orders zinc electroplating with a trivalent passivate for **4,000 mild steel mounting brackets**. Each bracket has about **2.0 dm²** of surface, including a formed channel that creates a recess, and the drawing calls for a minimum of **8 µm** of zinc on significant surfaces. A smaller order of 400 hardened spring clips joins the case in Chapter 7. Through the book the brackets are specified, their plating time calculated, their current efficiency measured, their thickness distribution examined, their preparation, life, rinsing and cost worked out, and the result recorded. The workshop, the plater, the parts, the process settings, prices and results are invented for teaching. They are not BIZOMAT work and not data for any real plating process or product.

## How to use the book

Read Chapters 1 to 5 in order to understand how a specification turns into current, time and thickness. Chapters 6 and 7 deal with adhesion and hydrogen embrittlement, the two failures that a thickness measurement cannot detect. Chapters 8 to 10 cover service life, the plating line's chemistry and waste, and cost and inspection. Each chapter ends with an exercise and its worked answer. Current densities are given in amperes per square decimetre (A/dm²), the unit used by most modern platers; the 1917 figures in amperes per square foot are converted where they appear.

## Limits and professional responsibility

This book is educational. Electroplating uses corrosive, toxic and in some cases carcinogenic chemicals, high currents, heat and heavy plant, and it produces regulated wastes. In Australia it is governed by work health and safety laws and regulations, Safe Work Australia's guidance on electroplating, state and territory environmental and trade-waste requirements, Australian and international coating standards, and the chemical suppliers' safety data sheets. The 1917 solutions and practices, some of which used cyanide openly, are described only as history. Coating standards are named by number and scope; their requirements must be read from the current editions. Where a figure comes from a published source it is cited; where it comes from the running case it is labelled as an illustration and must be replaced with real specification, supplier and measured data before any decision is made.

## An original treatment

The Library already compares coating systems in [Protecting metals from corrosion and wear](/reados/collections/machine-elements-and-mechanical-design/protecting-metals-from-corrosion-and-wear/), which places electroplating beside galvanising, paint and other treatments. This book goes inside the electroplating process itself. The explanations, the bracket case, the calculations, figures and exercises are original BIZOMAT writing. The 1917 treatise is a public-domain historical work; its ideas are summarised and analysed in new words, and none of its text, tables or illustrations is reproduced.
