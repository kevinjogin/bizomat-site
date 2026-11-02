---
title: "Solvent Vapours by the Numbers"
subtitle: "Vapour pressure, mixtures, flammable headspaces, evaporation, blush, ventilation, ovens and solvent recovery for workshops that clean, paint and bond"
description: "How solvents evaporate, mix, burn and condense in a workshop, and how to calculate headspaces, evaporation, ventilation, oven exhaust and recovery to control them."
category: Operations
tags: [operations, manufacturing, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate operations and process engineering"
audience: "Production, maintenance and process engineers, workshop supervisors and safety advisers in businesses that clean, paint, coat or bond with organic solvents."
outcomes:
  - "Account for where purchased solvent goes, and estimate vapour pressure at any temperature from one known point with the Clausius–Clapeyron relation."
  - "Work out the vapour above solvent blends with Raoult's law and their lower flammable limit with Le Chatelier's rule."
  - "Screen closed containers and headspaces against the lower explosive limit, and explain why empty drums and over-rich spaces are dangerous."
  - "Estimate evaporation, evaporative cooling and blush, and size dilution, purge and local exhaust ventilation and oven exhaust."
  - "Plan solvent recovery by condensing or vacuum distillation, choose substitutes with a solubility screen and prove a reduction in use."
coverVariant: category
references:
  - title: "Statistical Physics, Part 1, third edition (Course of Theoretical Physics, Volume 5)"
    creator: "L. D. Landau and E. M. Lifshitz; revised by E. M. Lifshitz and L. P. Pitaevskii; translated by J. B. Sykes and M. J. Kearsley"
    year: "1980"
    note: "Pergamon Press, all rights reserved. Only the title pages and contents were read, as a subject map for the chapters on phase equilibrium, the Clapeyron–Clausius formula, solutions and mixtures of ideal gases. No text, equations, figures or problems are taken from it."
  - title: "NIST Chemistry WebBook, NIST Standard Reference Database 69"
    creator: "National Institute of Standards and Technology"
    year: "current edition"
    url: "https://webbook.nist.gov/chemistry/"
    note: "Phase-change data for acetone, toluene, ethyl acetate, 2-butanone and isopropanol: Antoine coefficients and their temperature ranges, normal boiling points and enthalpies of vaporisation, used for the vapour pressures in Chapters 2 to 10."
  - title: "NIOSH Pocket Guide to Chemical Hazards"
    creator: "National Institute for Occupational Safety and Health"
    year: "current edition"
    url: "https://www.cdc.gov/niosh/npg/"
    note: "Vapour pressures at 20 °C, lower and upper explosive limits, flash points and specific gravities for the five solvents, and the recommended exposure limit for acetone quoted in Chapter 7."
  - title: "Evaporation rates of liquid hydrocarbon spills on land and water"
    creator: "D. Mackay and R. S. Matsugu"
    year: "1973"
    url: "https://doi.org/10.1002/cjce.5450510407"
    note: "Canadian Journal of Chemical Engineering 51, 434–439. A widely used mass transfer correlation for evaporation from pools, described in Chapter 5."
  - title: "Hansen Solubility Parameters: A User's Handbook, second edition"
    creator: "C. M. Hansen"
    year: "2007"
    note: "CRC Press. Source of the solvent solubility parameters used in Chapter 11."
  - title: "Estimation du grisou par les limites d'inflammabilité"
    creator: "H. Le Chatelier"
    year: "1891"
    note: "Annales des Mines. Origin of the mixing rule for the flammable limits of gas mixtures used in Chapter 3; cited from secondary accounts."
  - title: "Managing risks of hazardous chemicals in the workplace, model Code of Practice"
    creator: "Safe Work Australia"
    year: "current edition"
    note: "Named for scope in Chapters 1 and 7: the model code under the work health and safety laws for identifying, assessing and controlling risks from hazardous chemicals. Workplace exposure limits for airborne contaminants are also published by Safe Work Australia and are not reproduced here."
  - title: "AS/NZS 60079.10.1 (classification of areas: explosive gas atmospheres), AS 1940 (storage and handling of flammable and combustible liquids) and AS/NZS 4114 (spray painting booths and designated spray painting areas)"
    creator: "Standards Australia; Standards New Zealand"
    year: "current editions"
    note: "Named for scope only in Chapters 4, 7 and 9. Their requirements and values govern real installations and are not reproduced."
  - title: "NFPA 86, Standard for Ovens and Furnaces"
    creator: "National Fire Protection Association"
    year: "current edition"
    note: "Named for scope only in Chapter 9, as a standard that sets ventilation requirements for ovens that release flammable vapours."
related:
  - title: "Adhesive Bonding by the Numbers"
    href: "/reados/publications/adhesive-bonding-by-the-numbers/"
  - title: "Vacuum by the Numbers"
    href: "/reados/publications/vacuum-by-the-numbers/"
  - title: "Humidity Control by the Numbers"
    href: "/reados/publications/humidity-control-by-the-numbers/"
  - title: "Ductwork by the Numbers"
    href: "/reados/publications/ductwork-by-the-numbers/"
---

## About this book

Organic solvents are among the most useful liquids in a workshop. They clean oil from metal, carry paint to a surface, thin adhesives and wash spray guns. They are also volatile, flammable and harmful to breathe, and most of what a workshop buys ends up in its air. Controlling them well is a matter of numbers: how fast a solvent evaporates, how much vapour sits above it, at what concentration the vapour can burn, how much air dilutes it, and how much can be recovered.

This book teaches that arithmetic. It starts with where purchased solvent goes and with vapour pressure, the property that governs nearly everything else. It covers blends, flammable headspaces in drums and tanks, evaporation from open surfaces, and the cooling that makes coatings blush. It then turns to control: dilution and purge ventilation, local exhaust, ovens kept below the flammable limit, recovery by condensing and distilling, and substitution with less hazardous solvents.

It is for production, maintenance and process engineers, workshop supervisors and safety advisers in businesses that clean, paint, coat or bond with organic solvents. It assumes algebra, logarithms and the ideal gas law. Each chapter works the running case with real property data, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional workshop. This is an illustration. Plant S makes painted steel machine frames and guards, about 60 frames a week. Its solvent use has grown with the business:

- **Acetone** for wiping parts before painting and for cleaning spray guns, bought in 205 L drums;
- **A paint thinner**, a blend of toluene, 2-butanone (methyl ethyl ketone, MEK) and ethyl acetate, used to thin a two-pack polyurethane paint and to flush the spray equipment;
- **The paint itself**, whose solvent evaporates in the spray booth and in a low-temperature curing oven.

The story begins with three events in one summer: a fire-service inspection that asked how the plant knew its oven was safe, a near miss when a worker began to cut an "empty" drum, and a batch of frames whose gloss finish came out milky. The plant's operations engineer is asked to put numbers on the plant's solvents and to cut their use.

The plant, its products, its recipes, its suppliers and its measurements are invented. None describes KEVOS® work or a real company. Solvent properties are real values from the NIST Chemistry WebBook and the NIOSH Pocket Guide, cited where used; the thinner's composition is illustrative.

## How to use the book

Read Chapters 1 to 3 in order: they cover where solvent goes, vapour pressure and blends, which every later chapter uses. Chapter 4 deals with flammable headspaces, Chapter 5 with evaporation and Chapter 6 with evaporative cooling and blush. Chapters 7 to 9 cover ventilation of rooms, local exhaust and ovens. Chapter 10 covers recovery and Chapter 11 substitution and proving a reduction.

KEVOS® tools are linked where they perform a step of the method, with a note of exactly what each one calculates and where its model stops. Where a tool solves a related problem rather than the chapter's own, the text says so.

## Source limits and professional responsibility

The relations used here are the established ones of phase equilibrium and mass transfer: the Clausius–Clapeyron relation, Raoult's law, Le Chatelier's mixing rule, diffusion-limited evaporation and well-mixed dilution. Each chapter states the assumptions they need, and real solvents and real rooms often depart from them. Standards and codes are named by number and scope only.

Flammable atmospheres and airborne contaminants are regulated hazards. In Australia, the work health and safety laws, Safe Work Australia's model codes and workplace exposure limits, the hazardous area classification and flammable liquid storage standards, and the solvent's safety data sheet govern real decisions, together with competent people: a hazardous area classification by a qualified person, ventilation designed and tested by a competent engineer, and exposure monitoring by an occupational hygienist where needed. This book is educational. It explains how the numbers are made and how far to trust them; it is not a risk assessment, a hazardous area classification or a substitute for any of these.
