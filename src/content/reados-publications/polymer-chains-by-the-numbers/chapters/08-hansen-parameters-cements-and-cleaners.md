---
book: polymer-chains-by-the-numbers
chapterSlug: hansen-parameters-cements-and-cleaners
order: 8
title: "Choosing solvents and cleaners with Hansen parameters"
description: "Screen liquids against a plastic with Hansen solubility parameters, blend two liquids to reach or avoid a polymer, pick a cement solvent and a safe cleaner, and know what the sphere cannot predict."
draft: false
---

"Like dissolves like" is the oldest rule in chemistry, and solubility parameters are a way of putting numbers to it. A liquid dissolves or swells a polymer when the forces holding the liquid's molecules together resemble the forces holding the polymer's segments together, so that swapping one neighbour for the other costs little energy. Hansen's method splits those forces into three parts, gives every liquid and every polymer a point in a three-dimensional space, and draws a sphere around the polymer: liquids inside the sphere dissolve or swell it, liquids outside leave it alone.

The method is a screening tool, not a guarantee, but it is quick, it explains surprises, and it shows how to blend liquids to hit or miss a target. This chapter sets out the method, applies it to the workshop's choice of cement solvent and of a cleaner for its housings, and ends with a "natural" citrus cleaner that dissolved the surface of a batch of housings.

## Three kinds of cohesion

The total solubility parameter δ, used in Chapter 7, is the square root of a liquid's cohesive energy per unit volume, in MPa½. Hansen divided it into three parts, each with the same units:

- **δD**, from dispersion forces, the weak attractions present between all molecules;
- **δP**, from polar forces between permanent dipoles;
- **δH**, from hydrogen bonding, which dominates in alcohols and water.

The total is recovered as δ² = δD² + δP² + δH². Two liquids with the same total can behave very differently towards a polymer if their totals are made up differently, which is why the single-parameter estimate of Chapter 7 is cruder than Hansen's.

## The Hansen distance and the sphere

The distance between a polymer (subscript 2) and a liquid (subscript 1) in Hansen space is

Ra² = 4 (δD₂ − δD₁)² + (δP₂ − δP₁)² + (δH₂ − δH₁)².

The factor of 4 on the dispersion term is empirical; it makes the regions of good solvents roughly spherical. Each polymer has an interaction radius, R₀, found by testing it against many liquids: liquids that dissolve it lie within R₀, those that do not lie outside. The ratio RED = Ra ÷ R₀, the relative energy difference, then gives a single verdict. RED below 1 means the liquid is likely to dissolve or swell the polymer; above 1, it is likely to leave it alone; near 1, the result is uncertain and must be tested.

```figure
type: formula
title: Hansen distance and relative energy difference
formula: Ra² = 4 (δD₂ − δD₁)² + (δP₂ − δP₁)² + (δH₂ − δH₁)²
formula: RED = Ra ÷ R₀
caption: Parameters in MPa½. RED below 1 means inside the polymer's sphere: likely to dissolve or swell it. Teaching values for polystyrene: δD 18.5, δP 4.5, δH 2.9, R₀ 8.6.
- δD, δP, δH | dispersion, polar and hydrogen-bonding parameters
- R₀ | the polymer's interaction radius
- RED | relative energy difference
step: Toluene (18.0, 1.4, 2.0): Ra² = 4 × 0.25 + 9.61 + 0.81 = 11.42, Ra = 3.38, RED = 0.39
step: Isopropanol (15.8, 6.1, 16.4): Ra² = 29.16 + 2.56 + 182.25 = 213.97, Ra = 14.63, RED = 1.70
```

The parameters for common liquids and polymers are tabulated in Hansen's handbook and elsewhere. This book uses teaching values close to commonly published ones, chosen so that the arithmetic can be followed; real decisions need the tabulated values for the actual products, which often contain several liquids.

## Screening the workshop's liquids

The [solvent attack and swelling screen tool](/tools/hansen-solvent-compatibility/) takes the polymer's three parameters and interaction radius and the parameters of one liquid or of a blend of two liquids by volume. It calculates the blend's parameters, the Hansen distance with the dispersion difference weighted four times, the relative energy difference, the blend share that brings the liquid closest to the polymer, and a verdict for a part that must resist the liquid or for a liquid meant to dissolve the polymer, with an uncertainty band around RED = 1. With the workshop's teaching values for polystyrene, it gives the following.

```figure
type: compare
title: Liquids screened against polystyrene
rowhead: Liquid
cols: δD / δP / δH (MPa½) | Ra | RED | Screen result
caption: Teaching parameter values, polystyrene 18.5 / 4.5 / 2.9 with R₀ 8.6, uncertainty band ±0.1 around RED = 1. Results from the solvent attack and swelling screen tool; confirm with immersion tests of the actual material.
- Toluene | 18.0 / 1.4 / 2.0 | 3.38 | 0.39 | dissolves
- d-Limonene | 17.2 / 1.8 / 4.3 | 4.00 | 0.47 | dissolves
- Ethyl acetate | 15.8 / 5.3 / 7.2 | 6.95 | 0.81 | dissolves
- * 50:50 ethyl acetate and d-limonene | 16.5 / 3.55 / 5.75 | 5.00 | 0.58 | dissolves
- Hexane | 14.9 / 0 / 0 | 8.97 | 1.04 | borderline: test it
- Acetone | 15.5 / 10.4 / 7.0 | 9.36 | 1.09 | borderline: test it
- Isopropanol | 15.8 / 6.1 / 16.4 | 14.63 | 1.70 | resists
- Ethanol | 15.8 / 8.8 / 19.4 | 17.89 | 2.08 | resists
- Water | 15.5 / 16.0 / 42.3 | 41.48 | 4.82 | resists
```

The results agree with workshop experience: aromatic and terpene solvents and esters dissolve polystyrene, alcohols and water do not, and acetone and hexane sit near the edge. Acetone's position is a good example of why the band matters. Its RED of 1.09 does not say "safe"; it says "uncertain", and in practice acetone attacks polystyrene surfaces, crazing or softening them, especially where the part is stressed.

## Where a polymer's sphere comes from

A polymer's three parameters and its radius are not calculated from its chemistry; they are fitted to tests. The usual method is to place small samples of the polymer in a set of twenty to forty liquids whose parameters are known, spread widely through Hansen space, and to record for each one whether the polymer dissolves, swells strongly, or is unaffected after a fixed time. A sphere is then fitted so that it contains as many of the "good" liquids and excludes as many of the "bad" ones as possible. Its centre gives the polymer's δD, δP and δH, and its radius gives R₀.

Two consequences follow. First, a sphere describes one grade of one polymer under one test condition. A higher molar mass, a copolymer, a filled compound or a semicrystalline grade can have a smaller or shifted sphere, and a sphere fitted for "dissolves" is smaller than one fitted for "swells". Second, the method is open to anyone with a set of solvents, a fume cupboard and a few days. A workshop that uses one plastic heavily and meets many liquids could fit its own sphere for its own grade and test condition, and would then have a screen that matches its own experience better than any table.

Spheres for elastomers are fitted the same way, usually with swelling rather than dissolution as the criterion, since a crosslinked rubber cannot dissolve. The same screen therefore helps choose seals and hoses: a fuel, oil or cleaner well inside an elastomer's sphere will swell it, soften it and change its dimensions. [Rubber Parts by the Numbers](/reados/publications/rubber-parts-by-the-numbers/) deals with how rubber parts respond to load; the swelling screen is the chemical counterpart, and a seal that passes one check must pass the other.

## Choosing the cement solvent

The workshop's older cement used toluene, which the screen puts deep inside the sphere at RED 0.39. It was replaced for work health and safety reasons, and the question was which alternative would still dissolve the resin well. d-Limonene alone screens almost as well, at RED 0.47, and the tool's blend calculation confirms that, of a blend of ethyl acetate and limonene, pure limonene is the closest to polystyrene. So why does the workshop use a 50:50 blend at RED 0.58?

The answer is evaporation, which the sphere knows nothing about. A cement must stay wet long enough to soften both surfaces of the joint and then dry within a sensible clamping time. Limonene evaporates slowly, so a pure limonene cement would stay soft for a long time and leave solvent in the joint; ethyl acetate evaporates quickly. The blend gives a working time the assembly area can live with while staying comfortably inside the sphere. Solubility parameters choose which liquids are candidates; evaporation, odour, flammability, exposure limits and cost choose among them.

## Two non-solvents can make a solvent

Because the sphere is a region in three dimensions, two liquids that each lie outside or on its edge can blend to a point inside it. Acetone, at RED 1.09, is too polar and too hydrogen-bonded on its own; hexane, at RED 1.04, has the right dispersion character but no polarity at all. Their 50:50 blend has parameters of 15.2, 5.2 and 3.5 MPa½ and a RED of **0.77**, well inside: the blend dissolves polystyrene although neither liquid alone reliably does. The tool reports that the closest blend is about 52% hexane, with almost the same RED.

The same geometry works in reverse, and that is how the cheaper thinner of Chapters 3 and 7 crept towards trouble. Adding 12% of an aliphatic thinner like hexane to the 50:50 cement blend moves it to 16.3, 3.1 and 5.1 MPa½, a total of **17.35 MPa½**, the value used in Chapter 7. The Hansen screen still gives a RED of 0.59, inside the sphere, so on this screen the thinned blend still dissolves polystyrene. Chapter 7's single-parameter Flory–Huggins estimate, which adds temperature and concentration, put the same blend on the edge of separation in the cold. The two models answer different questions and neither is exact. Their disagreement was itself a signal to test the blend in a refrigerator before using it.

## The error: a citrus cleaner on polystyrene

This is an illustration. A batch of housings came back from a customer with adhesive residue from protective film. An assembler, wanting to avoid harsh solvents, cleaned them with a citrus degreaser from the hardware store, whose label described it as natural and made from orange peel. Within minutes, the cleaned surfaces turned tacky and dull, and fine crazes appeared around the snap-fit hooks.

The orange-peel ingredient is d-limonene, the same liquid the workshop uses to dissolve polystyrene for its cement. The screen puts it at RED **0.47** against polystyrene: far inside the sphere. Its natural origin has nothing to do with its effect on the plastic. The quality engineer ran the screen for the part-resisting case and got "likely to dissolve or swell the part", with the tool's standing note that even liquids outside the sphere can cause stress cracking in strained parts, which explained why the crazes were worst at the stressed snap-fit roots.

```figure
type: decision
title: Choosing a cleaner for polystyrene housings
question: Where does the cleaner sit against polystyrene's sphere?
caption: Teaching parameters; screen with the solvent attack and swelling tool, then confirm by wiping a scrap part, including a stressed one, and checking after 24 hours.
- RED well below 1 | Do not use | Dissolves or swells the surface: limonene, toluene, esters
- RED near 1 | Test before use | Uncertain; may craze stressed areas: acetone, hexane
- * RED well above 1 | Usable after an ESC test | Isopropanol 1.70; 70:30 isopropanol and water 2.61
```

The batch was scrapped. The workshop's cleaning procedure now names isopropanol, at RED 1.70, or a 70:30 isopropanol and water mix, at RED 2.61, as the approved cleaners for polystyrene, bans citrus and aromatic products in the assembly area, and requires any new cleaning product to be screened and then tested on a stressed scrap part before use.

## Reading a safety data sheet with the screen

The quickest way to place a commercial product in Hansen space is its safety data sheet, which lists hazardous ingredients and usually their concentration ranges. In this illustration, the citrus degreaser's sheet listed d-limonene at 30 to 60% with surfactants and water. Even the low end of that range puts a substantial quantity of a strong polystyrene solvent on the part, and the water and surfactants do nothing to reduce its effect at the surface. A cleaner's other ingredients may make it less aggressive in bulk, but at the surface, after the water has run off or evaporated, the solvent is what remains. The workshop's screening procedure now starts with the safety data sheet, places the main solvent ingredients on the screen individually, and treats any ingredient inside the sphere as a reason to test before use, whatever its share.

## What the sphere cannot tell you

The Hansen sphere is a model of dissolution and swelling at room temperature by liquids of small molecules. It does not predict:

1. **Environmental stress cracking.** A liquid well outside the sphere can still crack a strained glassy plastic, by plasticising a thin layer at the tip of a growing craze. Stressed parts must be tested in the liquid under strain.
2. **The effect of crystallinity.** A crystalline polymer can resist a liquid that would dissolve its amorphous form, because its crystals must melt before the chains can dissolve. Chapter 9 explains why with Flory's melting-point equation.
3. **Temperature and molar mass.** A liquid near the sphere's edge may dissolve the polymer when hot and not when cold, or dissolve short chains but not long ones; Chapter 7's phase check handles both, roughly.
4. **Rate.** A liquid inside the sphere may take hours to dissolve a thick part and seconds to craze a thin, stressed one.
5. **Mixtures of unknown composition.** A commercial product's label rarely gives enough detail to place it in Hansen space; the product must be tested as supplied.

## How this applies to a small Australian business

Cleaners, degreasers, inks, adhesives, lubricants and fuels all meet plastic parts, and the label rarely says what they will do to them. A Hansen screen takes minutes and points to the risky combinations, which are often not the ones people expect: "natural" citrus cleaners, ester-based adhesive removers and aromatic solvents attack polystyrene and several other common plastics. Screen first, then test the actual product on a scrap part, including a stressed one, and record the result.

## Exercise: an adhesive remover

An adhesive remover is mostly ethyl acetate. Using the teaching values, is it safe on the workshop's polystyrene housings? If it were diluted 50:50 by volume with isopropanol, would it be safe? Use the screen's method: the blend's parameters are the volume-weighted averages.

**Worked answer.** Ethyl acetate alone has RED **0.81**, inside the sphere, so it would dissolve or swell the housings. The 50:50 blend with isopropanol has parameters of (15.8 + 15.8) ÷ 2 = 15.8, (5.3 + 6.1) ÷ 2 = 5.7 and (7.2 + 16.4) ÷ 2 = 11.8 MPa½. Then Ra² = 4 × (18.5 − 15.8)² + (4.5 − 5.7)² + (2.9 − 11.8)² = 29.16 + 1.44 + 79.21 = 109.81, so Ra = 10.48 and RED = 10.48 ÷ 8.6 = **1.22**. That is outside the sphere, but only just beyond the 0.9 to 1.1 band, and ethyl acetate's effect on stressed parts could still be significant. The diluted remover should be tested on a stressed scrap part before use, and isopropanol alone remains the safer choice.
