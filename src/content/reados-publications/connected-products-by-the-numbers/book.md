---
title: "Connected Products by the Numbers"
subtitle: "Requirements, sensing, power, data, firmware, security and service for a product that reports from the field"
description: "Develop a connected product with numbers: requirements and architecture, sensing, battery and data budgets, testable firmware, security rules, pilot fleets and service models."
category: Products
tags: [product-development, systems, validation, design, strategy]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate product development"
audience: "Product engineers, mechanical and electronics designers, technical founders and product managers turning a physical product into one that measures, connects and reports, and who must make the system work as a whole."
outcomes:
  - "Turn a product idea into numbered requirements and trace them through functions, logical blocks and physical parts."
  - "Calculate sensing accuracy, battery life and data volume, and see which requirement drives each."
  - "Plan firmware so it can be tested before boards arrive and updated safely in the field."
  - "Apply Australia's smart-device security standard and privacy principles to a connected consumer product."
  - "Read pilot-fleet results honestly and choose a service model, support period and network plan that last."
coverVariant: category
references:
  - title: "The Engineering Handbook for Designing Smart Connected Products"
    creator: "Chad Jackson, Lifecycle Insights (LC-Insights LLC)"
    year: "2018"
    note: "Supplied source, a 12-page industry eBook. Used only as a subject map: smart versus connected products, streaming data for service and planning, model-based development, the requirements-functions-logical-physical approach and outsourcing choices. No text, figures or structure are reproduced; the case, calculations and method here are original."
  - title: "NASA Systems Engineering Handbook, NASA/SP-2016-6105 Rev 2"
    creator: "National Aeronautics and Space Administration"
    year: "2016"
    url: "https://www.nasa.gov/reference/systems-engineering-handbook/"
    note: "Public reference for requirements definition, logical decomposition, design solution definition, verification and validation, used as the background to Chapters 2 and 9. No text or figures are reproduced."
  - title: "Speed of Sound"
    creator: "NASA Glenn Research Center, Beginner's Guide to Aeronautics"
    year: "current web page"
    url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/speed-of-sound-interactive/"
    note: "Source for the relationship a = √(γRT) used in Chapter 3. The values γ = 1.4 and R = 287 J/(kg·K) for dry air are standard properties applied here."
  - title: "LS 33600 primary lithium-thionyl chloride D-size cell, product data sheet"
    creator: "Saft"
    year: "current data sheet"
    note: "Reference cell for Chapter 4: nominal 3.6 V, 17 Ah nominal capacity under the maker's stated conditions, an operating range of −60 °C to +85 °C and limited pulse capability. Typical values, not a specification; the derating in Chapter 4 is a stated assumption."
  - title: "Cyber Security (Security Standards for Smart Devices) Rules 2025, F2025L00276"
    creator: "Commonwealth of Australia, made under the Cyber Security Act 2024"
    year: "2025"
    url: "https://www.legislation.gov.au/F2025L00276/asmade/text"
    note: "Read for Chapter 8: commencement of Part 2 and Schedule 1 on 4 March 2026, scope for products acquired by consumers, password requirements, publishing how to report security issues, defined support periods that cannot be shortened, and statement of compliance contents. Paraphrased, not quoted."
  - title: "ETSI EN 303 645, Cyber Security for Consumer Internet of Things: Baseline Requirements"
    creator: "European Telecommunications Standards Institute"
    year: "current edition"
    url: "https://www.etsi.org/technologies/consumer-iot-security"
    note: "Named by number and scope as an international baseline for consumer IoT security that covers more practices than the Australian rules. No provisions are quoted."
  - title: "Australian Privacy Principles"
    creator: "Office of the Australian Information Commissioner"
    year: "current web page"
    url: "https://www.oaic.gov.au/privacy/australian-privacy-principles"
    note: "Reference for the principles discussed in Chapter 7 and for checking whether the Privacy Act applies to a business. Educational summary only."
  - title: "The 3G network is closing down"
    creator: "business.gov.au, Australian Government"
    year: "2024"
    url: "https://business.gov.au/news/the-3g-network-is-closing-down"
    note: "Background for Chapter 10 on the closure of Australia's 3G networks and the types of connected devices affected. Closure dates are as reported by the government and operators."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods, section 8.4.5.1"
    creator: "National Institute of Standards and Technology"
    year: "online handbook"
    url: "https://www.itl.nist.gov/div898/handbook/apr/section4/apr451.htm"
    note: "Source for the chi-square confidence bound on a constant failure rate used for the pilot fleet in Chapter 9."
  - title: "Goods and services tax (GST)"
    creator: "Australian Taxation Office"
    year: "current web page"
    url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst"
    note: "Background for stating prices with GST included and separating the GST component in Chapter 10. General information, not tax advice."
related:
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
  - title: "Product Development and Launch"
    href: "/reados/collections/product-development-and-launch/"
  - title: "Requirements that can be traced and tested"
    href: "/reados/collections/project-planning-and-control/requirements-that-can-be-traced-and-tested/"
---

## About this book

A connected product is a physical product with a second life on a network. It measures something, sends what it measures and lets someone act on it from a distance. That second life changes the engineering. A level gauge that only needs to be read on site must be accurate and durable. A level gauge that reports to a phone must also last years on a battery, use a network that will still exist in a decade, send data someone can use, accept software updates safely, resist attack and be supported for as long as its owner was promised.

This book is for engineers, designers, technical founders and product managers who are turning a physical product into a connected one. It covers the decisions that sit between the hardware and the business: what the data is for, how requirements become an architecture, how sensing, power and data budgets interact, how firmware is tested before the boards exist, how Australia's smart-device security standard applies, how to read a pilot fleet's results and how a service model and support period follow from the engineering. Each chapter works one decision through the running case with real numbers and ends with an exercise and its worked answer.

It assumes basic engineering arithmetic and some familiarity with product development. It does not assume programming or radio expertise; each chapter explains the concepts it needs.

## The running case

The book follows a fictional **tank monitor**, a battery-powered ultrasonic level sensor for a 22,500 L rainwater tank on a rural property. It mounts in the tank roof, measures the air gap to the water surface, and reports the level over the LTE-M cellular network to an app. It alerts the owner when the tank is low, when it is falling unusually fast and when the sensor needs attention. The tank is 3.60 m in diameter and holds 22,500 L at a water depth of 2.21 m. The product is made by a small fictional Australian company and sold to households and farms with a monthly service subscription.

All dimensions, currents, prices, quantities and results are invented for teaching. This is an illustration. None of it describes a BIZOMAT project, product or measured result. Money is in Australian dollars, and each example says whether GST is included.

## How to use the book

Read the chapters in order the first time, because the budgets in Chapters 3 to 5 depend on the requirements in Chapters 1 and 2, and the later chapters depend on the budgets. Each chapter also stands alone as a reference. The companion book [Electronics Packaging by the Numbers](/reados/publications/electronics-packaging-by-the-numbers/) covers the mechanical side of putting electronics into a product: mounting, heat, sealing, cables, antennas and compliance testing.

## Source limits and professional responsibility

A short industry eBook on designing smart connected products was supplied for this book. It was used only to choose the subject, and it influenced the emphasis on model-based development, systems engineering and the use of field data. The structure, case, calculations, figures and exercises here are original. Physical relationships, legislation and guidance are attributed to public sources and paraphrased; standards are named by number and scope only.

This book is educational. It is not legal, privacy, security or tax advice. Legislation and network arrangements change, and the current legislation, the regulators' guidance and qualified advisers govern real products. Products that control water supply for health purposes, monitor safety-critical plant or handle sensitive personal information carry obligations beyond its scope.
