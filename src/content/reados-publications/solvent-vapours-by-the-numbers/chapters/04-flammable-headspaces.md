---
book: solvent-vapours-by-the-numbers
chapterSlug: flammable-headspaces
order: 4
title: "Flammable headspaces"
description: "The saturated vapour in a closed drum or tank against its explosive limits, how it compares with the flash point, why empty drums and over-rich spaces are dangerous, and purging."
draft: false
---

A closed container of solvent always holds vapour. Given time, the space above the liquid, its headspace, fills with vapour at the liquid's vapour pressure, and whether that space can burn depends on how that concentration compares with the solvent's flammable limits. For most workshop solvents at most workshop temperatures, it can. Knowing this changes how containers are opened, emptied, cleaned, stored and above all how they are cut, welded or ground.

This chapter screens Plant S's containers against the lower explosive limit, compares the temperature at which a headspace becomes flammable with the measured flash point, explains why a headspace above the upper limit is no safer, and shows how little liquid it takes to fill an "empty" drum with vapour. Its error is the near miss of the summer.

## The saturated headspace

In a closed container left long enough, the headspace reaches equilibrium with the liquid. The vapour's partial pressure equals the liquid's vapour pressure, or for a blend its partial pressure by Raoult's law, and its volume fraction in the headspace is that partial pressure divided by the total pressure. That is the worst case: a freshly filled or ventilated space holds less, but closed spaces approach it over time.

A vapour–air mixture can burn only between two concentrations, its lower and upper explosive (flammable) limits. Below the lower limit there is too little fuel; above the upper limit there is too little oxygen. Comparing the saturated concentration with these limits says whether a closed headspace can burn.

The [solvent headspace LEL check](/tools/solvent-headspace-lel-check/) performs this screen. From the pure solvent's vapour pressure at a reference temperature and its enthalpy of vaporisation, it calculates the vapour pressure at the liquid's temperature by the Clausius–Clapeyron relation, the solvent's partial pressure by Raoult's law for the mole fraction entered, the saturated headspace concentration and its share of the lower explosive limit. It also gives the liquid temperatures at which the headspace reaches a share of the limit you choose and the limit itself. It handles one volatile component in an ideal solution, states that it is a screening aid, and says that hazardous area classification and any work in the space need a competent person.

```figure
type: compare
title: Saturated headspace of Plant S's solvents at 20 °C
rowhead: Solvent
cols: Saturated concentration | Lower explosive limit | Share of the limit
caption: From the solvent headspace LEL check at 101.325 kPa, with the vapour pressures and enthalpies of Chapter 2 and the lower explosive limits from the NIOSH Pocket Guide. Every one is many times its limit.
- * Acetone | 24.3% | 2.5% | about 970%
- 2-Butanone | 10.3% | 1.4% | about 730%
- Ethyl acetate | 9.7% | 2.0% | about 490%
- Isopropanol | 4.3% | 2.0% | about 220%
- Toluene | 2.9% | 1.1% | about 260%
```

## The limit temperature and the flash point

The tool's most useful output is the liquid temperature at which the saturated headspace reaches the lower explosive limit. Below that temperature the headspace is too lean to burn; above it, it can. That is close to the idea of the **flash point**, the lowest temperature at which a liquid gives off enough vapour to ignite in a standard test apparatus. The flash point is measured, standardised and used for classifying flammable liquids, and it governs. Comparing the two shows how good the screen is.

```figure
type: compare
title: Liquid temperature at which the headspace reaches the LEL, against the flash point
rowhead: Solvent
cols: Limit temperature from the screen | Closed-cup flash point, NIOSH | Difference
caption: Screen results from the solvent headspace LEL check; flash points from the NIOSH Pocket Guide, converted from °F. The screen runs a few kelvin below the flash point in every case, which is the cautious direction.
- Acetone | −24.1 °C | −17.8 °C | 6.3 K lower
- 2-Butanone | −16.1 °C | −8.9 °C | 7.2 K lower
- Ethyl acetate | −8.5 °C | −4.4 °C | 4.1 K lower
- * Toluene | 3.0 °C | 4.4 °C | 1.4 K lower
- Isopropanol | 8.3 °C | 11.7 °C | 3.4 K lower
```

The screen agrees with the measured flash points to within a few kelvin and is always the colder of the two. The difference is expected: a flash point test is a short, specific procedure in which equilibrium is not quite reached and ignition needs a little more than the limit concentration, so it reads somewhat higher. For deciding whether a space can be flammable, the screen errs on the safe side; for classification, the measured flash point is used.

The comparison also shows how cold these liquids must be before their headspace is safe. Acetone, 2-butanone and ethyl acetate stay flammable well below anything an Australian workshop reaches. Toluene and isopropanol become too lean only on cold mornings, and are flammable on every working afternoon.

### Screening a blend

The headspace screen handles one volatile component, either pure or dissolved in a non-volatile liquid. Plant S's thinner has three volatile components, so its headspace was screened with the two rules of Chapter 3 instead: Raoult's law for the total vapour pressure, 6.80 kPa at 20 °C, giving a saturated concentration of 6.71%, and Le Chatelier's rule for the vapour's lower limit, 1.475%. The headspace is about 455% of its limit, and the temperature at which it would fall to the limit is about −7.4 °C. The screen can still help with a blend in one way: running it for each component on its own, at its mole fraction in the blend, shows which component contributes most of the flammable vapour. For the thinner, 2-butanone alone, at a mole fraction of 0.296, already gives a headspace of about 3.0% at 20 °C, more than twice its own limit of 1.4%, so it would make the headspace flammable even without the other two.

## Too rich is not safe

At warmer temperatures, some headspaces exceed the upper explosive limit. Acetone's upper limit is 12.8%. Its saturated headspace reaches that at about 6 °C, and at 25 °C it is about 30%, far too rich to burn. It is tempting to conclude that a drum of acetone on a warm day is safe from explosion. It is not, for two reasons.

- **Anything that lets air in passes through the flammable range.** When a drum is opened, emptied or vented, air enters and mixes with the vapour. Somewhere between the rich interior and the clean air outside, at the mouth of the drum or in the plume flowing from it, the mixture passes through the flammable range. Emptying a drum draws in its own volume of air.
- **Anything that drives vapour out does the same.** Heating a drum, for example with a cutting torch or the sparks from a grinder, expels rich vapour that mixes with air outside, and the mixture near the opening becomes flammable.

The flammable range is a band that every mixture between pure vapour and pure air must cross. A space above its upper limit is not safe; it is a store of fuel waiting for air.

## A headspace through the day

A headspace follows the liquid's temperature, so it changes through the day. For Plant S's drums in the yard, the engineer worked out the saturated concentrations for a summer day running from 5 °C before dawn to 35 °C in the afternoon.

```figure
type: compare
title: Saturated headspace in two drums through a summer day
rowhead: Liquid temperature
cols: Toluene drum | Toluene's flammable range | Acetone drum | Acetone's flammable range
caption: This is an illustration. Vapour pressures by the Clausius–Clapeyron relation from the 20 °C values of Chapter 2. The toluene drum is flammable all day; the acetone drum is above its upper limit all day, which, as the next section shows, is no protection.
- Dawn, 5 °C | 1.24% | 1.1 to 7.1%, flammable | about 12% | 2.5 to 12.8%, near the upper limit
- Morning, 15 °C | 2.19% | flammable | 19.4% | above the upper limit
- * Afternoon, 35 °C | 6.13% | flammable, near the upper limit | about 45% | far above the upper limit
```

Toluene's headspace is flammable from dawn to dusk, approaching the lean limit before dawn and the rich limit in the afternoon. Acetone's is above its upper limit for almost the whole day, and is at its most dangerous before dawn, when it falls to near the upper limit, and whenever it is opened. Neither drum is ever safe to treat as anything but flammable.

### Inerting

Where a closed vessel must be kept non-flammable, for example a solvent tank in a process or a vessel being emptied for maintenance, the alternative to keeping vapour out is keeping oxygen out. Inerting replaces the air in the headspace with nitrogen, carbon dioxide or another inert gas, so that the oxygen concentration stays below the level at which the vapour can burn at any fuel concentration. Inerting needs a reliable gas supply, oxygen monitoring and procedures for anyone who might enter the space, since an inerted atmosphere cannot support life. It is a design decision for a competent person, not a workshop improvisation, but it explains why some solvent tanks are fitted with a nitrogen blanket and a pressure–vacuum vent.

## How little liquid it takes

The vapour pressure does not depend on how much liquid is present, only on its temperature, so a nearly empty container holds the same headspace concentration as a full one, once a little liquid has had time to evaporate. The question is how little is enough.

For a 205 L drum of acetone at 25 °C, with a vapour pressure of 30.6 kPa, saturating the whole drum needs PV ÷ RT = 30,600 × 0.205 ÷ (8.314 × 298.15) = 2.53 mol of acetone, 0.147 kg, or **0.19 L of liquid**. Less than a cupful in a drum that looks and sounds empty saturates it completely, and the rest of the liquid, if any, simply stays liquid.

```figure
type: stats
title: An "empty" 205 L acetone drum at 25 °C
caption: This is an illustration. Vapour pressure by the Clausius–Clapeyron relation, ideal gas, well-mixed headspace. Any drum that has held a volatile solvent should be treated as full of vapour unless it has been cleaned and tested.
- 0.19 L | acetone liquid needed to saturate the whole drum
- 30.1% | saturated concentration, above the 12.8% upper limit
- 0.5 L | a typical residue after "emptying"
- 166 L | volume of pure vapour that 0.5 L of acetone would make at 25 °C
```

## The error: cutting an empty drum

In February, a worker set out to cut the top off a 205 L acetone drum to make a parts bin. The drum had been drained into the gun-washing station the day before and stood in the yard with its bungs out. The worker's view, shared by others, was that the drum was empty and that in any case acetone vapour on a 30 °C day would be "too rich to light". A supervisor stopped the job when the grinder was already plugged in.

The engineer's numbers showed how serious the near miss was. The drum's residue, about half a litre, was more than enough to keep its headspace saturated, at about 37% acetone by volume at 30 °C, well above the upper limit. A grinder cutting the top would have heated the steel and thrown sparks at the bung hole, where vapour flowing out was mixing with air and passing through the flammable range at the point of ignition. Drums with flammable residues have exploded in exactly this way, throwing their ends with lethal force.

```figure
type: checklist
title: Before any hot work on a container that has held solvent
caption: Hot work on containers that have held flammable liquids is a recognised high-risk task. These steps describe the principle; the site's hot work permit system, the safety data sheet and a competent person govern the real work.
- x Treat it as full of vapour | whatever it looks or sounds like inside
- x Remove all liquid residue and clean | rinse and steam or wash by an approved method, then ventilate
- x Test the atmosphere | with a calibrated detector, inside and at openings, immediately before work
- x Keep it vented and gas-free during work | continuous ventilation or inerting, retest if work stops
- x Prefer cold methods | use a hacksaw or a nibbler, or buy a bin
- ? Ask whether the job needs doing at all | most drum conversions are not worth the risk
```

The plant banned hot work on any container that had held a flammable liquid, sent used drums back to the supplier or to a reconditioner, and bought parts bins. It also painted a warning on every solvent drum in the yard.

## Purging and why it needs the liquid gone

Purging a headspace with air dilutes the vapour. In a well-mixed space, each volume of fresh air passed through reduces the concentration by a factor of e, so after N volume changes the concentration has fallen to e⁻ᴺ of its starting value. To bring a 30.2% acetone headspace down to a quarter of its 2.5% lower limit, 0.625%, needs N = ln(30.2 ÷ 0.625) = 3.88 volume changes, and to reach the limit itself, 2.49.

That arithmetic assumes no more vapour is being produced. With liquid residue present, every volume of air passed through picks up more vapour, and the purge reaches a balance at some concentration set by the evaporation rate and the airflow, not at zero. Purging a drum that still holds liquid can therefore look effective on a quick reading at the bung and still leave a flammable atmosphere inside, especially in corners and seams where liquid lingers. Removing the liquid comes first; purging and testing come after.

### Stores and tanks

The same reasoning applies to the plant's solvent store and to any tank that holds solvent. Closed spaces above flammable liquids are treated as zones where a flammable atmosphere is likely, for the purposes of hazardous area classification under AS/NZS 60079.10.1, named here for scope only, and storage of flammable liquids is governed by AS 1940. A competent person classifies the areas and specifies the equipment allowed in each. The headspace screen helps an engineer understand why those zones exist and how temperature changes them, not draw them.

## How this applies to a small Australian business

Assume that the headspace of every container of a volatile solvent is flammable at workshop temperatures, and check the few exceptions with the solvent's flash point. Remember that a headspace above the upper limit becomes flammable as soon as air enters or vapour leaves. Treat every container that has held a flammable liquid as full of vapour: less than a cupful saturates a 205 L drum. Never do hot work on such a container without a proper permit, cleaning and testing, and prefer not to do it at all. Remove liquid before purging, then test. And keep drums shaded and closed: every degree cooler lowers the vapour they breathe out.

## Exercise: an isopropanol tank

A small tank holds isopropanol at 15 °C on a winter morning and 30 °C in the afternoon. With a vapour pressure of 4.40 kPa at 20 °C, 45.5 kJ/mol and a lower explosive limit of 2.0%, use the Clausius–Clapeyron relation to find (a) the saturated headspace concentration at each temperature, and (b) whether the headspace can burn at each.

**Worked answer.** (a) At 15 °C: P = 4.40 × exp[−(45,500 ÷ 8.314)(1 ÷ 288.15 − 1 ÷ 293.15)] = 4.40 × e^−0.324 = **3.18 kPa**, a concentration of 3.18 ÷ 101.325 = **3.1%**. At 30 °C: P = 4.40 × exp[−(45,500 ÷ 8.314)(1 ÷ 303.15 − 1 ÷ 293.15)] = 4.40 × e^0.616 = **8.15 kPa**, a concentration of **8.0%**. (b) Both are above the 2.0% lower limit and below the 12.7% upper limit, so the headspace is **flammable at both temperatures**. The screen's limit temperature for isopropanol is 8.3 °C, so the tank's headspace becomes too lean only below about that temperature.
