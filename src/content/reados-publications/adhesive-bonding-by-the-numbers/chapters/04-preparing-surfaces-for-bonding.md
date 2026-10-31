---
book: adhesive-bonding-by-the-numbers
chapterSlug: preparing-surfaces-for-bonding
order: 4
title: "Preparing surfaces for bonding"
description: "The order of degreasing, abrading and cleaning, choosing a solvent that will not attack a plastic part, primers and conversion coatings, and keeping prepared parts above the dew point."
draft: false
---

Surface preparation is where most bonding problems start and where most of them can be prevented. Chapters 2 and 3 showed how to measure a surface; this chapter is about producing a good one and keeping it good until the adhesive arrives. The aims are simple to state: remove contamination, remove or stabilise weak surface layers, add a little roughness, and get the adhesive onto the surface before anything else does. The details decide whether they are met.

The chapter sets out the order of operations, chooses cleaning solvents for metal and for plastic with a solubility screen, covers primers and conversion coatings, and ends with the error that cost Plant K a week of humid summer mornings: invisible condensation on cold stock.

## The order of operations

The sequence matters as much as the steps. For metals, a sound general sequence has four stages.

```figure
type: steps
title: A general preparation sequence for metal adherends
caption: The detail for any real job comes from the adhesive supplier's instructions and, for structural bonding, from a qualified procedure. ISO 17212 gives guidance on preparing metals and plastics for structural adhesives; it is named here for scope only.
- Degrease | remove oil and loose dirt with a solvent or alkaline cleaner, before any abrasion
- Abrade | remove the old oxide and add roughness with a clean non-woven pad, abrasive paper or grit blast
- Clean again | remove abrasion debris with a fresh solvent wipe or clean dry air, using clean wipes
- Prime or bond | apply a primer if specified, or bond within the time window set by testing
```

Degreasing comes first because abrading an oily surface drives the oil into the fresh scratches, where a later wipe cannot reach it. Abrasion comes next to remove the oxide that has grown and collected contamination over months in storage and replace it with a fresh, rougher one. The final clean removes the dust abrasion leaves, which would otherwise form a weak layer of its own. Then the adhesive goes on promptly, because Chapter 3 showed how quickly a prepared surface ages.

### Wiping technique

How a solvent is applied matters nearly as much as which solvent. A wipe dipped repeatedly into a container of solvent soon carries oil back to every surface it touches, and the container becomes a dilute oil bath. Plant K adopted three rules that cost nothing:

1. Dispense solvent from a squeeze or pump bottle onto a clean lint-free wipe, never dip the wipe into stock.
2. Wipe in one direction with the wet wipe and follow immediately with a second, dry wipe before the solvent evaporates, so that dissolved oil is lifted off instead of being redeposited as the solvent dries.
3. Turn or replace the wipe after each pass, and never use a wipe that has touched a floor, a glove or an unprepared part.

The solvent itself needs looking after. Keep it in a closed, labelled dispenser, buy a grade with low non-volatile residue, and do not top up a bottle that has been in use for weeks: it collects water from humid air and oil from wipes, and leaves both behind on the surface it was meant to clean.

### Abrasion

Abrasion should remove the surface layer and roughen evenly without leaving loose material. For Plant K's 2 mm aluminium skin, a medium-grade non-woven pad gave an even matt surface in about a minute per flange zone. Abrasive papers work too but clog with aluminium. Grit blasting with clean aluminium oxide grit gives a more consistent, deeper profile and is the usual choice for high-performance bonds, but it needs a booth and can distort thin sheet. Whatever the method, the abrasive must be clean: Chapter 2 showed that pads reused from the previous week raised the water angle by 8°.

## Cleaning plastics without harming them

Plastics need gentler treatment. Many are attacked by the solvents that clean metals well, and some that are not dissolved outright will craze or crack where they are stressed. Polycarbonate is a well-known example, and Plant K's window had to be cleaned before bonding without that risk.

A useful screen is the **Hansen solubility parameter** approach. Each liquid and each polymer is described by three numbers: dispersion δD, polar δP and hydrogen-bonding δH, in MPa½. A polymer is described as a sphere in that three-dimensional space with an interaction radius R₀; liquids inside the sphere tend to dissolve or swell it, liquids outside tend not to. The distance Ra between a liquid and the polymer is computed with the dispersion difference weighted four times, and the ratio RED = Ra ÷ R₀ places the liquid inside (below 1) or outside (above 1).

The [Hansen solvent compatibility tool](/tools/hansen-solvent-compatibility/) performs this screen. It takes the polymer's three parameters and interaction radius, the parameters of one liquid or of a blend of two mixed by volume, and an uncertainty band around RED = 1. It returns the blend's parameters, Ra, RED, the blend share that would come closest to the polymer, and a verdict for a part that must resist the liquid or for a liquid meant to dissolve the polymer. It also reminds the user that stress cracking can occur outside the sphere and that an immersion test of the real material governs.

The engineer used one published set of parameters for bisphenol A polycarbonate, δD 19.1, δP 10.1, δH 9.3 and R₀ 6.4 MPa½, from a 2023 study, and standard solvent values from Hansen's handbook.

```figure
type: compare
title: Hansen screen of three cleaning solvents against polycarbonate
rowhead: Solvent
cols: δD / δP / δH | Ra | RED | Screen verdict | Practical note
caption: Polycarbonate parameters 19.1 / 10.1 / 9.3 MPa½ with R₀ 6.4, from one published fitted set; solvent parameters from Hansen's handbook. Results from the Hansen solvent compatibility tool with a band of 0.1 either side of RED = 1. The screen predicts dissolving, not stress cracking.
- Acetone | 15.5 / 10.4 / 7.0 | 7.56 | 1.18 | likely to resist, close to the band | known to craze stressed polycarbonate; avoid
- * Isopropanol | 15.8 / 6.1 / 16.4 | 10.49 | 1.64 | likely to resist | the usual cleaner for polycarbonate; confirm with the sheet supplier
- Toluene | 18.0 / 1.4 / 2.0 | 11.57 | 1.81 | likely to resist | an aromatic solvent; polycarbonate suppliers' resistance guides advise against such solvents on stressed parts
```

The screen ranks acetone as the closest liquid to polycarbonate, just outside the sphere, and that is a warning in itself: a liquid near the boundary will swell the surface, and a swollen surface under stress crazes. Toluene ranks farther away than isopropanol, which shows the limit of the screen: crazing of a stressed glassy polymer depends on how readily small molecules enter its surface, and the sphere does not predict it. The plant took the screen as a first filter and the sheet supplier's chemical resistance guidance as the deciding source. It chose isopropanol for the window, applied by the two-wipe method, and banned acetone and general-purpose thinners from the bonding area.

When fine cracks appeared beside the bond on the first windows, solvent attack was the first suspicion. The plant's records showed that every window had been cleaned with isopropanol, and the cracks ran parallel to the bond edge on the hot side of the door, a pattern Chapter 8 traces to thermal movement. The screen did not prove the solvent innocent, but together with the records it pointed the investigation elsewhere.

## Primers and conversion coatings

Abrasion and cleaning give a good surface for many joints, but the bond to the oxide of aluminium can still be slowly attacked by water, which is the main durability risk for bonded aluminium. Two kinds of treatment improve it.

- **Primers and coupling agents.** A silane coupling agent applied as a dilute solution reacts with the oxide on one side and the adhesive on the other, forming a chemical bridge that resists water. Adhesive suppliers also offer primers matched to their products. Primers have their own drying time and their own window before bonding, both set by the supplier.
- **Conversion coatings and anodising.** Chemical treatments build a new, stable, porous oxide that the adhesive interlocks with. Etching and anodising processes developed for aircraft give the most durable bonds to aluminium but involve acid baths and strict process control, and are usually bought from a specialist finisher. Chemical conversion coatings applied before painting may or may not be suitable for bonding; the coating supplier and adhesive supplier together decide.

For Plant K, abrasion and an isopropanol wipe were the starting point. Chapter 11 tests a grit blast followed by a silane primer as an improvement.

## Keeping prepared parts dry

A prepared surface also has to stay free of water. Water is invisible as a film a few molecules thick, it is strongly attracted to a clean, polar oxide, and it blocks the adhesive from the surface as effectively as oil does. In a workshop, the usual source is condensation: a part colder than the dew point of the air around it collects water from that air.

The [surface dew point check](/tools/surface-dew-point-check/) works out the dew point of moist air and compares a surface temperature with it. From the air temperature, the relative humidity and the barometric pressure, it calculates the saturation and actual vapour pressures, the humidity ratio, the enthalpy and specific volume of the air, the dew point, and the relative humidity the air would have if cooled to the surface temperature. It then checks the surface temperature against the dew point plus a margin you choose.

## The error: humid summer mornings

In the third week of production, lap shear coupons cut from scrap skins and bonded alongside the doors began to fail at low loads with bare-looking metal on the failure surface. The failures were not random. Coupons bonded before about 9 am failed; those bonded in the afternoon did not. The surface preparation, the operators and the adhesive batch were the same morning and afternoon.

The difference was the stock. Aluminium skins were held in a shipping container outside the workshop and brought in each morning. On a typical humid summer morning the container's contents were at about 18 °C after the night, while the workshop air had reached 28 °C at 75% relative humidity.

```figure
type: stats
title: Cold stock in humid workshop air
caption: This is an illustration. From the surface dew point check at 101.325 kPa. The stock was 5.15 K below the dew point, so its surface was wet with condensation that the operators could not see on the matt, freshly abraded aluminium.
- 23.15 °C | dew point of workshop air at 28 °C and 75% relative humidity
- 18 °C | skin temperature on arrival from the container
- −5.15 K | margin of the surface above the dew point, against 3 K required
- 26.15 °C | lowest skin temperature that meets a 3 K margin
```

The tool's verdict for the morning stock was that the surface would sweat: the air at the surface would be at a relative humidity of 137%. The same air over a skin at 27 °C would leave a margin of 3.85 K and the surface would stay dry. The plant had abraded and wiped the skins as they came in, then bonded them while they were still cold and wet. A film of condensate too thin to see sat between the fresh oxide and the adhesive.

### How long to wait

The fix was to let stock warm to within a margin of the shop air before preparation. How long that takes depends on how the stock is held. A single 2 mm sheet standing in air with a heat transfer coefficient of about 10 W/m²K on each face has a thermal time constant of ρct ÷ 2h = 2,680 × 900 × 0.002 ÷ 20 = 241 seconds, about 4 minutes, and reaches 26.15 °C from 18 °C in 28 °C air in about 1.69 time constants, about 7 minutes. A stack of 20 skins 40 mm deep, warming mainly through its top and bottom faces, has a time constant about twenty times longer, 80 minutes, and needs over two hours.

```figure
type: decision
title: Is a part ready to be prepared and bonded?
question: Is the part's surface temperature at least 3 K above the dew point of the air around it?
caption: Measure the part with a contact or infrared thermometer and the air with a hygrometer, and check them with the surface dew point check. Parts brought in from cold storage, and parts cooled by solvent evaporation, need the most care.
- * Yes | surface stays dry | prepare and bond within the qualified window
- No, part colder than the air | condensation likely | spread the stock out to warm, or store it inside overnight
- No, air very humid at any temperature | margin is small for all parts | dehumidify the bonding area or bond at a cooler, drier time
```

Plant K moved the next day's skins into the workshop the afternoon before, standing in a rack with space between them. A hygrometer and an infrared thermometer at the bonding bench made the check part of the start-of-shift routine, and morning failures stopped.

### Evaporating solvent cools the surface too

A solvent wipe has the same effect on a smaller scale. As solvent evaporates it takes its latent heat from the surface, which can cool by several degrees for a few seconds. On a humid day that is enough to condense a little water, especially with fast-evaporating solvents. The two-wipe method helps by removing most of the solvent mechanically, and a short pause before bonding lets the surface recover. The companion book on solvent vapours explains the effect in more detail, in [evaporative cooling, blush and condensation](/reados/publications/solvent-vapours-by-the-numbers/evaporative-cooling-blush-and-condensation/).

## How this applies to a small Australian business

Degrease before you abrade, clean after, and bond promptly. Dispense solvent onto clean wipes and wipe dry before it evaporates. Screen solvents for plastic parts with the Hansen approach, but take the plastic supplier's chemical resistance guidance as the deciding word, because the screen cannot predict stress cracking. In humid weather, check parts against the dew point before you bond them, and bring cold stock in to warm well beforehand.

## Exercise: a cool, humid winter morning

Plant K's workshop on a winter morning is at 16 °C and 80% relative humidity, and the skins have been inside overnight at 15 °C. (a) Using the surface dew point check at 101.325 kPa, what is the dew point, and do the skins meet a 3 K margin? (b) If a solvent wipe cools the surface by 3 K for a few seconds, is condensation possible during that time? (c) What would you do?

**Worked answer.** (a) The tool gives a dew point of **12.6 °C**. The skins at 15 °C are 2.45 K above it, **short of the 3 K margin**, though not yet wet. (b) A surface cooled by 3 K reaches 12 °C, **below the dew point**, so a brief film of condensation is possible during and just after the wipe. (c) Warm the bonding area or the parts, for example with a heater in the bonding bay so that both air and parts sit near 20 °C. At 20 °C with the same moisture content, the dew point is unchanged but the parts have a margin of over 7 K. Wipe with the two-wipe method and allow a short pause before bonding.
