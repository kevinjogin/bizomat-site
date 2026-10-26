---
title: "Engineering Tools People Use"
subtitle: "Designing in-house engineering software so designers enter the right inputs, read results correctly and keep using it"
description: "Design in-house engineering tools people use correctly: observe users, design inputs and results, write messages, fit the workflow, test with five users and measure use."
category: Technology
tags: [design, systems, validation, people, product-development]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate engineering and software practice"
audience: "Engineers, CAD administrators and developers who build calculators, add-ins and small tools for colleagues and want them used correctly rather than worked around or abandoned."
outcomes:
  - "Observe how colleagues really use a tool and find where inputs and results are misread."
  - "Design inputs with units, ranges and conventions that prevent the commonest errors."
  - "Present engineering results so the decision they support is clear and hard to misread."
  - "Test a tool with small rounds of real users and fix what they find before release."
  - "Make tools accessible and consistent, and measure their use and error rates over time."
coverVariant: category
references:
  - title: "SolidWorks 2009 API: Advanced Product Development, first edition"
    creator: "Luke Malpass, AngelSix"
    year: "2008–2013"
    note: "Supplied source, read for its chapters on menus, property pages and planning a tool's interface before coding. No text, code or figures are reproduced."
  - title: "Why You Only Need to Test with 5 Users"
    creator: "Jakob Nielsen, Nielsen Norman Group"
    year: "2000"
    url: "https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/"
    note: "Source for the problem-discovery formula and the typical single-user discovery rate of 31% used in Chapter 6."
  - title: "10 Usability Heuristics for User Interface Design"
    creator: "Jakob Nielsen, Nielsen Norman Group"
    year: "1994, updated"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
    note: "Background for the review checklist in Chapter 6. Paraphrased, not quoted."
  - title: "Web Content Accessibility Guidelines (WCAG) 2.2"
    creator: "World Wide Web Consortium"
    year: "2023"
    url: "https://www.w3.org/TR/WCAG22/"
    note: "Reference for the minimum text contrast ratio of 4.5:1 and the principle of not relying on colour alone, applied in Chapter 7 to desktop engineering tools."
  - title: "ISO 9241-110, Ergonomics of human-system interaction: Interaction principles"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Named by number and scope only as the international standard on interaction principles. No content is quoted."
related:
  - title: "CAD Automation by the Numbers"
    href: "/reados/publications/cad-automation-by-the-numbers/"
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "User experience for products and services"
    href: "/reados/collections/product-development-and-launch/user-experience-for-products-and-services/"
---

## About this book

Engineering firms are full of small tools written by engineers for engineers: a spreadsheet that sizes a beam, a CAD add-in that checks a drawing, a calculator for bolt preload or a tolerance stack. Most are technically correct. Many are used wrongly, worked around or quietly abandoned, because the person who wrote them understood every input and every result, and the people who use them do not. An input that one engineer reads as a total tolerance band, another reads as plus-or-minus. A result shown to five decimal places looks precise and says nothing about whether the design passes. An error message written for the author makes sense only to the author.

This book is for engineers, CAD administrators and developers who build tools for colleagues. It shows how to watch people use a tool, design inputs that prevent errors, present results that support the right decision, write messages and help that work, fit the tool into the way people already work, test it with a handful of real users, make it accessible and consistent, and measure its use. Each chapter works one decision through the running case with real numbers and ends with an exercise and its worked answer.

## The running case

The book follows a fictional machine builder's design office of **14 designers** and an in-house **tolerance stack-up tool**, written by a senior engineer five years ago. It calculates worst-case and statistical (root-sum-square) stacks for linear chains of dimensions. Designers use it for gearbox, bearing and housing assemblies. The tool works, but the office suspects it is misused: two field problems in a year traced back to stacks that the tool passed.

All quantities, times, results and names of fictional products are invented for teaching. This is an illustration. None of it describes a KEVOS® project or product.

## How to use the book

Read Chapter 1 first, because the observation method it describes is the source of almost every improvement in the rest of the book. The other chapters can be read in any order. The companion books [CAD Automation by the Numbers](/reados/publications/cad-automation-by-the-numbers/) and *Engineering Software You Can Sell* cover building, deploying and selling tools; this book covers making them usable.

## Source limits and professional responsibility

A 2009 book on CAD add-in development was supplied for this series. It informed only this book's attention to menus, property pages and planning an interface before coding. The structure, case, calculations and figures here are original. Usability findings from published research are attributed and paraphrased.

This book is educational. A clearer tool reduces errors but does not remove the engineer's responsibility for the design. Tools that support safety-related or regulated decisions need verification, review and approval appropriate to those decisions, whatever their interface.
