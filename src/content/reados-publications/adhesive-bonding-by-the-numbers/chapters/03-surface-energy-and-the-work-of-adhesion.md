---
book: adhesive-bonding-by-the-numbers
chapterSlug: surface-energy-and-the-work-of-adhesion
order: 3
title: "Surface energy and the work of adhesion"
description: "Estimating a solid's surface energy from two contact angles by the Owens and Wendt method, the work of adhesion, predicting wetting, and why wetting alone does not make a strong bond."
draft: false
---

A contact angle with water tells whether a surface has changed. It does not say how much energy the surface has, or whether a particular adhesive will wet it, because Young's equation contains the solid–liquid tension, which nobody can measure directly. A way round this was found in the 1960s: split each surface tension into parts that come from different kinds of molecular attraction, and measure angles with two liquids whose parts are known. The result is an estimate of the solid's surface energy, and from it a prediction of how any liquid, including an adhesive, will behave on it.

This chapter works through that method, introduces the work of adhesion, applies both to Plant K's aluminium skin and polycarbonate window, and shows the limit of the whole approach: a surface can be perfectly wetted and still bond badly.

## Two kinds of attraction

The attraction between molecules comes in several kinds. Every molecule attracts every other through **dispersion forces**, which arise from fluctuating electron clouds and act between all matter. Some molecules also carry permanent dipoles or can form hydrogen bonds, and these add **polar** attractions. Fowkes proposed in 1964 that surface tension can be split into a dispersion part and a part from the other interactions, and that across an interface the dispersion parts interact through their geometric mean. Owens and Wendt extended the idea in 1969 to the polar part, giving a method that is still the most widely used in industry.

For a liquid L and a solid S, the total surface tension or energy is the sum of the two parts, γ = γᵈ + γᵖ. Where the liquid meets the solid, the energy gained from their attraction is taken as twice the geometric mean of each kind, so that like interacts mainly with like. A non-polar liquid can only use its dispersion part, however polar the solid; water, which is strongly polar, interacts strongly with a polar surface such as a clean metal oxide and weakly with a non-polar one such as polyethylene.

## The work of adhesion

The **work of adhesion** WA is the energy needed to separate a unit area of a liquid–solid interface into two free surfaces. It is the reversible, thermodynamic measure of how strongly the two attract. Combining its definition with Young's equation gives a relation that needs only measurable quantities, and combining it with the geometric-mean rule gives the Owens and Wendt equation.

```figure
type: formula
title: The work of adhesion and the Owens and Wendt equation
caption: The first line is the Young–Dupré equation. The last line is the geometric-mean split of the work of adhesion into dispersion and polar parts, after Owens and Wendt (1969). One contact angle gives one equation in the two unknown parts of the solid's surface energy, so two liquids are needed.
- WA = γSV + γLV − γSL | energy to separate a unit area of interface
- step: WA = γLV (1 + cos θ) | Young–Dupré, using Young's equation
- step: WA = 2(√(γSᵈ γLᵈ) + √(γSᵖ γLᵖ)) | geometric-mean interaction of like components
- step: γLV (1 + cos θ) = 2(√(γSᵈ γLᵈ) + √(γSᵖ γLᵖ)) | the Owens and Wendt equation
```

The **work of cohesion** of a liquid, the energy to split it into two surfaces, is 2γLV. Comparing the two gives a useful view of spreading: a liquid spreads completely when its attraction to the solid is at least as strong as its attraction to itself, WA ≥ 2γLV. The spreading coefficient of Chapter 2 is simply S = WA − 2γLV.

## Two liquids, two unknowns

The method uses two probe liquids with very different polarities. The usual pair is water, strongly polar, and diiodomethane, almost purely dispersive. The standard values used with the Owens and Wendt method are:

- **water**: γ = 72.8 mN/m, of which γᵈ = 21.8 and γᵖ = 51.0;
- **diiodomethane**: γ = 50.8 mN/m, all dispersive, so γᵈ = 50.8 and γᵖ = 0.

Because diiodomethane has no polar part, its contact angle gives the solid's dispersion part directly. Water then gives the polar part.

```figure
type: steps
title: Surface energy from water and diiodomethane contact angles
caption: The arithmetic for Plant K's isopropanol-wiped skin, with a water angle of 72° and a diiodomethane angle of 45°. This is an illustration. Each step is a rearrangement of the Owens and Wendt equation.
- Diiodomethane: 50.8 × (1 + cos 45°) = 86.72 mN/m | the left-hand side for the dispersion-only liquid
- √γSᵈ = 86.72 ÷ (2 × √50.8) = 86.72 ÷ 14.255 = 6.084 | so γSᵈ = 37.01 mN/m
- Water: 72.8 × (1 + cos 72°) ÷ 2 = 47.65 mN/m | half the water work of adhesion
- Subtract the dispersion term: 47.65 − √(37.01 × 21.8) = 47.65 − 28.41 = 19.24 | what the polar parts must supply
- √γSᵖ = 19.24 ÷ √51.0 = 2.694 | so γSᵖ = 7.26 mN/m
- * Total surface energy 37.01 + 7.26 = 44.27 mN/m | about 44 mJ/m², mostly dispersive
```

Diiodomethane is dense, toxic and light-sensitive, and a workshop may prefer another non-polar liquid, but the method needs the probe's components to be known, and the pair above is the one with the widest published use.

## Plant K's surfaces

The engineer measured water and diiodomethane angles on the three conditions of the aluminium skin from Chapter 2 and on the polycarbonate window sheet, and worked out each surface energy.

```figure
type: compare
title: Surface energies of Plant K's surfaces from two contact angles
rowhead: Surface
cols: Water angle | Diiodomethane angle | Dispersion part | Polar part | Total
caption: This is an illustration. Averages of five drops of each liquid. Components and totals in mN/m, rounded to one decimal from unrounded values. The polar part responds most to preparation, because contamination is non-polar and a fresh oxide is polar.
- Aluminium as received | 85° | 52° | 33.2 | 3.2 | 36.3
- Aluminium wiped with isopropanol | 72° | 45° | 37.0 | 7.3 | 44.3
- * Aluminium abraded, then wiped | 45° | 38° | 40.6 | 20.6 | 61.2
- Polycarbonate sheet, film just removed | 82° | 33° | 42.9 | 2.3 | 45.3
```

The pattern is the one expected. An oily surface behaves like the oil, low in energy and nearly non-polar. Wiping removes some of the oil and the polar part rises a little. Abrasion exposes fresh aluminium oxide, which is strongly polar, and the polar part rises to over 20 mN/m. The polycarbonate, a fairly non-polar plastic, has a surface energy of about 45 mN/m, almost all dispersive, which agrees with the dyne-ink bracket of 40 to 46 from Chapter 2.

These numbers are not the true surface energies of aluminium or its oxide, which are far higher. They describe the surface as it actually is in the workshop, including whatever is adsorbed on it, and that is the surface the adhesive meets.

## Will the adhesive wet?

With the solid's components known, the same equation predicts the contact angle of any liquid whose components are known. Plant K's epoxy, before cure, has an illustrative surface tension of 45 mN/m, split into 37 dispersive and 8 polar. For the isopropanol-wiped skin, the work of adhesion is 2 × (√(37.01 × 37) + √(7.26 × 8)) = 89.3 mN/m, and cos θ = 89.3 ÷ 45 − 1 = 0.983, an angle of about 10°.

```figure
type: compare
title: Predicted wetting of the uncured epoxy on each surface
rowhead: Surface
cols: Work of adhesion | Predicted contact angle | Spreading coefficient
caption: This is an illustration. Epoxy surface tension 45 mN/m (37 dispersive, 8 polar). A spreading coefficient of zero or above means complete wetting. The epoxy wets every prepared surface well, including the wiped one, which is why wetting alone did not explain the failures.
- Aluminium as received | 80.1 mN/m | 39° | −9.9 mN/m
- Aluminium wiped with isopropanol | 89.3 mN/m | 10° | −0.7 mN/m
- * Aluminium abraded, then wiped | 103.2 mN/m | spreads, 0° | +13.2 mN/m
- Polycarbonate sheet | 88.3 mN/m | 16° | −1.7 mN/m
```

A useful rule falls out of the table: an adhesive wets a surface well when its surface tension is below the surface energy of the solid. The epoxy at 45 mN/m wets the abraded skin at 61 completely, and the wiped skin at 44 and the polycarbonate at 45 almost completely. It would wet the as-received skin at 36 only partly. This is the reason low-energy plastics such as polyethylene, with surface energies around 30 mJ/m², are so hard to bond: almost every structural adhesive has a higher surface tension than they do, and beads on them unless the surface is first raised by flame, corona or plasma treatment, or a special primer.

## How long a prepared surface lasts

A freshly abraded aluminium surface does not stay at 61 mJ/m². Air in a workshop carries traces of oil mist, plasticisers from hoses and gloves, and silicone from sprays and release agents, and a high-energy surface adsorbs them, because doing so lowers its energy. The prepared surface ages back towards the contaminated one, and the polar part falls first.

Plant K's engineer abraded and wiped a set of skin offcuts, left them on a rack beside the bonding bench, and measured both angles on fresh pieces at intervals over three days.

```figure
type: compare
title: Ageing of the abraded and wiped aluminium skin in the workshop air
rowhead: Time since preparation
cols: Water angle | Diiodomethane angle | Polar part | Total
caption: This is an illustration. Each row is a fresh offcut prepared at the same time and measured at the stated age; components and totals in mN/m. The polar part halves within a day, so the plant set a two-hour window between preparation and bonding.
- * Freshly prepared | 45° | 38° | 20.6 | 61.2
- 2 hours | 49° | 39° | 18.5 | 58.6
- 8 hours | 56° | 41° | 14.9 | 54.0
- 24 hours | 63° | 43° | 11.4 | 49.5
- 72 hours | 68° | 44° | 9.0 | 46.5
```

After a day, the polar part had fallen to 11.4 mN/m, about halfway back to the wiped surface, and after three days the prepared skin was little better than one that had only been wiped. Lap shear coupons bonded at 2 hours and at 24 hours confirmed what the angles suggested: the older surface gave lower strengths and some interfacial failure. The plant set a working rule that skins and stiffeners are bonded within two hours of preparation, and that parts prepared before a break or at the end of a shift are prepared again. It also moved a silicone-based mould release spray, used on a nearby press, out of the bonding area.

### Raising the energy of plastics

For plastics, the problem is often the material itself rather than contamination. Polyethylene and polypropylene have surface energies around 30 mJ/m², almost entirely dispersive, and no structural adhesive wets them well. Flame, corona and plasma treatments oxidise a thin surface layer, adding polar groups that raise the polar part and with it the total. The treatment is effective but not permanent: the treated layer slowly reorganises, and polar groups turn inward, so treated plastics have a shelf life too, measured with dyne inks. The polycarbonate window, at 45 mJ/m², needs no such treatment, only protection from handling, because the epoxy and the window adhesive both have surface tensions below its surface energy.

### Wetting takes time

The predicted angle is the angle the adhesive would reach at equilibrium. A thick paste with a viscosity thousands of times that of water approaches it slowly, and it has to displace air from every valley of an abraded surface on the way. In practice, three things help it get there before it gels: pressing the parts together so the paste is squeezed along the surface rather than merely set down on it, applying the adhesive as a bead that spreads outward and pushes air ahead of it, and keeping parts at room temperature or above, since a cold adhesive is far more viscous. A surface energy calculation says whether wetting is possible; the process decides whether it happens.

## The error: it wets, so it will bond

The prediction table led to a short-lived conclusion at Plant K. The epoxy was predicted to wet the isopropanol-wiped skin at about 10°, nearly completely. If it wetted, the reasoning went, it would bond, so the wipe was adequate and the trial failures must have another cause.

The conclusion confused wetting with adhesion. Wetting is necessary: an adhesive that does not touch the surface cannot bond to it. It is not sufficient. On the wiped skin, the epoxy wets a thin film of residual rolling oil, not the aluminium oxide beneath it. The oil film has no strength. When the joint is loaded, it fails within or at that film, a **weak boundary layer**, and the failure surface shows bare-looking metal on one side and adhesive on the other, exactly as on the third trial door.

Three numbers in the tables gave the problem away once the engineer looked at them in this light.

- **The polar part.** The wiped skin's polar component, 7.3 mN/m, was barely above the oily skin's 3.2 and far below the abraded skin's 20.6. An oil film is non-polar; a clean oxide is polar. The polar part is a sensitive indicator of how much of the surface is oxide and how much is contamination.
- **The work of adhesion.** Even at full wetting, the attraction to the wiped surface, 89 mN/m, was well below the 103 to the abraded one, because the epoxy's polar groups had nothing polar to interact with.
- **The water angle.** As Chapter 2 found, the wiped skin's water angle was much nearer the oily surface's than the abraded one's.

Real joint strength also depends on things that no surface energy captures: chemical bonds between the adhesive and the oxide, mechanical interlocking in the roughness made by abrasion, and the strength of the oxide layer itself. The work of adhesion is about a tenth of a joule per square metre; the energy needed to break a good structural joint is typically ten thousand times more or greater, almost all of it spent deforming the adhesive. What the surface does is decide whether that energy can be called on, by keeping the crack in the adhesive instead of letting it run along a weak layer at the interface.

```figure
type: layers
title: What decides whether a bond is strong
caption: Each layer must be sound for the joint to be strong. Surface energy measurements address the second and third; the others need preparation control and testing.
- Adherend | the metal or plastic itself, strong enough and stable
- Surface layer | oxide or plastic skin firmly attached, not loose, porous or weak
- Interface | free of oil, release agent, water and dust, so the adhesive meets the real surface
- Wetting | adhesive surface tension below the solid's surface energy, with time to flow into roughness
- Adhesive | mixed, applied and cured correctly, with the toughness to absorb energy
```

## How this applies to a small Australian business

Two probe liquids and a phone camera give a usable estimate of the surface energy of a part as it really arrives. Use it to check that an adhesive's surface tension is below the surface energy, and to watch the polar part as an indicator of how clean a metal is. But do not stop at wetting: a well-wetted contaminated surface makes a weak joint. Confirm preparation with failure surfaces and strength tests, as Chapter 10 describes.

## Exercise: a moulded housing

A moulded plastic housing gives a water angle of 92° and a diiodomethane angle of 48°. (a) Estimate its dispersion and polar surface energy components and total. (b) Predict the contact angle of an adhesive with a surface tension of 38 mN/m, of which 30 is dispersive and 8 polar. (c) What would you try first if bonds fail at the interface?

**Worked answer.** (a) From diiodomethane, √γSᵈ = 50.8 × (1 + cos 48°) ÷ (2√50.8) = 84.79 ÷ 14.255 = 5.948, so **γSᵈ = 35.4 mN/m**. From water, 72.8 × (1 + cos 92°) ÷ 2 = 35.13; subtracting √(35.38 × 21.8) = 27.77 leaves 7.36, so √γSᵖ = 7.36 ÷ √51.0 = 1.030 and **γSᵖ = 1.1 mN/m**. The **total is about 36.4 mN/m**, a low-energy, almost non-polar surface. (b) WA = 2 × (√(35.38 × 30) + √(1.06 × 8)) = 2 × (32.58 + 2.91) = 70.99 mN/m, so cos θ = 70.99 ÷ 38 − 1 = 0.868 and **θ ≈ 30°**. The adhesive wets reasonably but not completely. (c) The low polar part and a total close to the adhesive's surface tension suggest a release agent or a naturally low-energy polymer. Check the moulder's release agent first and clean or abrade the surface; if that is not enough, try a primer or a plasma or flame treatment recommended by the adhesive supplier, and confirm by dyne inks and lap shear tests.
