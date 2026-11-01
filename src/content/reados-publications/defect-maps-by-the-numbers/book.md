---
title: "Defect Maps by the Numbers"
subtitle: "Where defects fall on a part, whether they are random or clustered, and what their pattern says about the cause, the yield and the inspection"
description: "How to map where defects fall on parts, test whether they are random or clustered, and use the pattern to find causes, predict yield, chart counts and plan inspection."
category: Manufacturing
tags: [quality, manufacturing, process-improvement]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate quality and process engineering"
audience: "Quality and process engineers, production supervisors and inspectors who count surface, coating, casting or assembly defects and need to find their causes and predict their cost."
outcomes:
  - "Record defects with their positions and turn counts on parts into defect densities and Poisson probabilities."
  - "Test whether defects are spread at random, using quadrat counts, the index of dispersion and nearest-neighbour distances."
  - "Read Ripley's K function with simulation envelopes to find the scale at which defects cluster."
  - "Predict first-pass yield from defect density with Poisson and clustered (negative binomial) models, and judge the effect of a smaller part or a cleaner process."
  - "Chart defect counts without false alarms from clustering, plan sampling inspection and prove that a process change reduced defects."
coverVariant: category
references:
  - title: "Statistical Physics and Spatial Statistics: The Art of Analyzing and Modeling Spatial Structures and Pattern Formation"
    creator: "K. R. Mecke and D. Stoyan (eds), Lecture Notes in Physics 554, Springer, Berlin (ISBN 3 540 67750 X)"
    year: "2000"
    url: "https://doi.org/10.1007/3-540-45043-2"
    note: "Supplied source, in copyright. Read only as a subject map: its contents and preface name point processes, second-order characteristics, edge corrections, the Boolean model and Monte Carlo methods as shared ground between physics and statistics. No text, equations, figures, examples or exercises are reproduced or adapted; the manufacturing treatment, running case and numbers here are original."
  - title: "Statistical Analysis of Spatial Point Patterns, second edition"
    creator: "P. J. Diggle, Arnold, London"
    year: "2003"
    note: "Standard text for complete spatial randomness, quadrat and distance methods and Monte Carlo tests, used in Chapters 3 to 6."
  - title: "Statistical Analysis and Modelling of Spatial Point Patterns"
    creator: "J. Illian, A. Penttinen, H. Stoyan and D. Stoyan, Wiley, Chichester"
    year: "2008"
    note: "Background for the K and L functions, edge effects, cluster processes and inhomogeneous intensity in Chapters 6 and 8."
  - title: "Distance to nearest neighbor as a measure of spatial relationships in populations"
    creator: "P. J. Clark and F. C. Evans, Ecology, vol. 35, pp. 445–453"
    year: "1954"
    url: "https://doi.org/10.2307/1931034"
    note: "Original paper for the nearest-neighbour ratio and its test statistic, used in Chapter 5."
  - title: "Modelling spatial patterns"
    creator: "B. D. Ripley, Journal of the Royal Statistical Society Series B, vol. 39, pp. 172–192"
    year: "1977"
    url: "https://doi.org/10.1111/j.2517-6161.1977.tb01615.x"
    note: "Source of the K function used in Chapter 6."
  - title: "Integrated circuit yield statistics"
    creator: "C. H. Stapper, F. M. Armstrong and K. Saji, Proceedings of the IEEE, vol. 71, pp. 453–470"
    year: "1983"
    url: "https://doi.org/10.1109/PROC.1983.12619"
    note: "Review of Poisson and clustered (negative binomial) yield models, the basis of Chapter 7's treatment of yield with clustered defects. No data are reproduced."
  - title: "Stochastic Geometry and Its Applications, third edition"
    creator: "S. N. Chiu, D. Stoyan, W. S. Kendall and J. Mecke, Wiley, Chichester"
    year: "2013"
    note: "Background for the Boolean model and coverage relations in Chapter 9."
  - title: "Improved control charts for attributes"
    creator: "D. B. Laney, Quality Engineering, vol. 14, pp. 531–537"
    year: "2002"
    url: "https://doi.org/10.1081/QEN-120003555"
    note: "Source of the adjustment of attribute chart limits for overdispersion described in Chapter 10."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods: attributes control charts"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc33.htm"
    note: "Public reference for c and u charts and their Poisson basis, used in Chapter 10."
  - title: "Evaluation of measurement data: Guide to the expression of uncertainty in measurement (JCGM 100:2008)"
    creator: "Joint Committee for Guides in Metrology (BIPM)"
    year: "2008"
    url: "https://www.bipm.org/en/committees/jc/jcgm/publications"
    note: "Background for treating inspection as a measurement with its own detection probability in Chapter 10."
  - title: "ISO 2859-1 (sampling procedures for inspection by attributes), SAE J2277 (shot peening coverage determination) and ISO 8501-1 (visual assessment of surface cleanliness before painting)"
    creator: "International Organization for Standardization; SAE International"
    year: "current editions"
    note: "Named by number and scope only in Chapters 9 and 10. Nothing is quoted; the sampling plans in the book are designed from first principles with the WORKOS tools."
related:
  - title: "Microstructures by the Numbers"
    href: "/reados/publications/microstructures-by-the-numbers/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
  - title: "Breakdowns and Buffers by the Numbers"
    href: "/reados/publications/breakdowns-and-buffers-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Inspecting to the Drawing"
    href: "/reados/publications/inspecting-to-the-drawing/"
---

## About this book

Most factories count their defects. Far fewer record where on the part each one was. Yet the position of a defect is often the best clue to its cause: dirt that falls from a hook lands below the hook, a contaminated spray gun leaves craters along its path, and a cold corner in a mould leaves porosity in the same place on every casting. The pattern of positions also decides how defects affect yield and how they should be charted and inspected, because defects that cluster behave very differently from defects scattered at random.

This book teaches the arithmetic of defect positions, which statisticians call spatial point pattern analysis, for practical use on the shop floor. It starts with recording defects and turning counts into densities, then sets out what random scatter looks like and how to test for it with quadrat counts, nearest-neighbour distances and Ripley's K function. It goes on to clustered defects and their effect on yield, uneven defect density across a part, overlapping spots and coverage, and finally charting, sampling and proving that a change has worked.

It is for quality and process engineers, production supervisors and inspectors who deal with surface, coating, casting, welding or assembly defects. It assumes algebra, logarithms and basic probability, and the idea of a control chart. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. Plant E makes steel electrical enclosures and powder-coats its own switchboard doors on a conveyorised line: the doors are hung from two hooks through holes in their top edge, pass through pretreatment, a dry-off oven, an automatic powder booth with manual touch-up, and a curing oven. Each door is 800 mm wide and 1,200 mm high, and its outer face, 0.96 m², is a visible surface on which no defect is accepted. A door with any defect on its outer face is sanded and recoated.

After the line was moved into a new building, the share of doors needing rework rose to about one in four. The plant's quality engineer is asked to find out why and to fix it. The engineer starts by mapping where the defects are.

The plant, its line and every count, position and cost are invented. None describes KEVOS® work, a real company or a real supplier's product.

## How to use the book

Read Chapters 1 and 2 first: they set up the counts, densities and Poisson model that everything else uses. Chapters 3 to 6 ask whether defects are random or clustered, in increasing depth. Chapters 7 to 9 deal with the consequences: yield, uneven density and overlapping defects. Chapters 10 and 11 turn the analysis into charts, inspection plans and a proven improvement.

WORKOS tools are linked where they perform a step of the method, with a note of exactly what each one calculates and where its model stops. Where a tool solves a related problem rather than the chapter's own, the text says so.

## Source limits and professional responsibility

The methods in this book are the established ones of spatial statistics and quality control: the Poisson process, quadrat and distance tests, the K function with Monte Carlo envelopes, clustered yield models and attribute control charts. Each chapter states their assumptions, chiefly that defects can be treated as points and that the area inspected is known. Standards are named by number and scope only.

The statistical tests here help to find causes and to decide when evidence is strong enough to act. They do not replace engineering judgement about the process, the safety of the people working on it, or the requirements of a customer's specification. This book is educational; real acceptance criteria, sampling plans and process changes should be agreed with the people responsible for them.
