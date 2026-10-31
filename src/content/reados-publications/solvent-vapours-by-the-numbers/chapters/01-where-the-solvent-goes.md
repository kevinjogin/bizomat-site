---
book: solvent-vapours-by-the-numbers
chapterSlug: where-the-solvent-goes
order: 1
title: "Where the solvent goes"
description: "A solvent mass balance for a workshop: what is bought, what leaves as waste and what evaporates, the three hazards of solvent vapour, and the order in which to control them."
draft: false
---

A workshop that buys solvent by the drum rarely knows where it goes. Some leaves in waste drums to a recycler, some stays in the product as residual solvent for a short while, and the rest evaporates. The evaporated share is usually most of it, and it is the share that matters: it is what workers breathe, what can form a flammable atmosphere, what the neighbours smell and what the business pays for and throws into the air.

This chapter sets up a solvent mass balance for Plant S, describes the three hazards of solvent vapour, and sets out the order in which they are controlled. Its error is the most common way of underestimating solvent use: measuring it from the waste drum.

## Three questions from one summer

Plant S's engineer began with three questions, one from each of the summer's events, and they map onto the rest of this book.

The fire-service inspector asked how the plant knew its curing oven could not fill with a flammable mixture. Answering needs the amount of solvent the oven receives with each load, how fast it is released, the oven's exhaust flow and the flammable limit of the vapour: Chapters 2, 3 and 9.

The near miss with the "empty" drum raised the question of what is inside a container that holds only a little liquid or none, and why a drum full of vapour can be more dangerous than one full of liquid: Chapter 4.

The milky gloss finish raised a question that seems unrelated to safety: why a coating sprayed on a humid day can trap water. The answer lies in the cooling that evaporation causes, and it leads back to the same vapour pressures: Chapters 5 and 6.

All three start from the same place: how much solvent the plant uses, and where it goes.

## A mass balance

A mass balance is an account. Over a period, everything that goes in must come out or be stored:

solvent purchased = solvent in waste + solvent leaving in product + solvent evaporated + change in stock.

Over a month, with stock levels roughly steady and with a coating that releases its solvent before the parts leave, the balance simplifies to: evaporated = purchased − waste. The purchased quantity comes from invoices, the waste from the recycler's dockets, and the evaporated share is what remains.

To add solvents of different kinds, the balance is best kept in kilograms, because litres of different liquids weigh different amounts. Plant S's thinner is an illustrative blend of 50% toluene, 25% 2-butanone and 25% ethyl acetate by mass. Using specific gravities of 0.87, 0.81 and 0.90 from the NIOSH Pocket Guide and assuming the volumes add, its density is 1 ÷ (0.5 ÷ 0.87 + 0.25 ÷ 0.81 + 0.25 ÷ 0.90) = 0.861 kg/L. Acetone's specific gravity is 0.79.

```figure
type: compare
title: Plant S's solvent account for a typical month
rowhead: Item
cols: Volume | Mass of solvent | Note
caption: This is an illustration. Purchases from invoices, waste from the recycler's dockets. The paint's solvent is taken as 40% of the paint's volume at the thinner's density, an illustrative figure; the safety data sheet gives the real value. About 87% of the solvent bought evaporates.
- Thinner purchased | 410 L | 353 kg | two 205 L drums
- Acetone purchased | 205 L | 162 kg | one 205 L drum
- Solvent in paint used | 300 L of paint | 103 kg | evaporates in the booth and oven
- Total in | | 618 kg |
- Waste to recycler | 120 L of dirty thinner | about 83 kg of solvent | about 80% solvent by volume
- * Evaporated, by difference | | about 536 kg | 87% of the total
```

The result is typical of small painting and cleaning operations: most of the solvent bought ends up in the air. For Plant S that is over half a tonne a month, about 25 kg on each working day.

### What the solvent costs

The money involved is easy to put a number on. At illustrative prices of A$4.50 a litre for thinner and A$4.00 for acetone, excluding GST, the plant spends about A$2,665 a month on cleaning and thinning solvents, plus about A$180 for waste disposal at A$1.50 a litre. Since 87% of the solvent evaporates, almost all of that spending goes into the air. Every litre not evaporated is a litre not bought, which is why the later chapters on lids, recovery and substitution have a straightforward payback as well as safety benefits.

## The three hazards of solvent vapour

Solvent vapour causes harm in three different ways, at very different concentrations.

```figure
type: compare
title: Three hazards of solvent vapour
rowhead: Hazard
cols: Concentrations involved | Where it matters | Controlled by
caption: Fire needs concentrations of the order of a per cent; health effects arise at concentrations tens to hundreds of times lower. A space safe from fire is not necessarily safe to breathe.
- Fire and explosion | above the lower explosive limit, about 1 to 2.5% by volume for these solvents | closed containers, tanks, ovens, booths, poorly ventilated rooms | ventilation below a fraction of the limit, ignition control, hazardous area classification
- * Health | workplace exposure limits, typically tens to hundreds of parts per million | the breathing zone of workers | elimination, substitution, local exhaust, dilution, respiratory protection
- Environment and amenity | emissions over time, odour at the boundary | neighbours, the local authority | reducing use, capture, recovery
```

The difference in scale between the first two rows is the most important single fact about solvent vapour. The lower explosive limit of acetone is 2.5% by volume, 25,000 parts per million. The NIOSH recommended exposure limit for acetone, as a time-weighted average over a working day, is 250 parts per million, one hundredth of that. Australian workplace exposure limits are published by Safe Work Australia, and for other solvents the ratio can be larger still. Ventilation designed to keep a room safe from fire may leave its air unhealthy to breathe.

### The hierarchy of control

Australia's work health and safety laws require risks to be controlled using the hierarchy of control: eliminate the hazard if possible; otherwise substitute something less hazardous, isolate it or use engineering controls; then administrative controls; and finally personal protective equipment. Safe Work Australia's model Code of Practice on managing risks of hazardous chemicals in the workplace explains how this applies to chemicals such as solvents. The chapters of this book follow roughly the same order in reverse: they first build the understanding needed to measure the hazard, then cover engineering controls, and end with substitution and elimination, which are the most effective controls and the hardest to evaluate without the numbers that come before.

## Units for vapour concentrations

Vapour concentrations are quoted in three units, and mixing them up causes errors of a factor of ten thousand.

- **Per cent by volume**, used for flammable limits: 1% means one volume of vapour in a hundred volumes of the mixture.
- **Parts per million by volume (ppm)**, used for exposure: 1% is 10,000 ppm.
- **Milligrams per cubic metre (mg/m³)**, also used for exposure: the mass of vapour in a cubic metre of air.

For an ideal gas, the volume fraction equals the mole fraction and the ratio of partial pressure to total pressure, which is why vapour pressures convert so directly to concentrations in later chapters. To convert between ppm and mg/m³, use the volume of a mole of gas, about 24.45 L at 25 °C and 101.325 kPa:

mg/m³ = ppm × M ÷ 24.45, where M is the molar mass in g/mol.

For acetone, with M = 58.08 g/mol, 250 ppm is 250 × 58.08 ÷ 24.45 = 594 mg/m³, which agrees with the 590 mg/m³ that the NIOSH Pocket Guide gives alongside its 250 ppm limit. The same 250 ppm of toluene, with M = 92.14, is 942 mg/m³: the same number of molecules, but heavier ones.

## Vapour is heavier than air

Every solvent vapour in this book is denser than air. The ratio of its molar mass to that of air, 28.96 g/mol, gives its density relative to air at the same temperature and pressure: about 2.0 for acetone and isopropanol, 2.5 for 2-butanone, 3.0 for ethyl acetate and 3.2 for toluene. Concentrated vapour pours like a slow liquid. It flows out of an open drum, down the side of a tank, along a floor and into a pit or drain, and it can travel some distance before it mixes away.

Once diluted, vapour behaves like air. At 2.5% by volume, acetone vapour in air makes a mixture only 2.5% denser than air, and ordinary air movements mix it. So vapour hugs the floor near its source, where it is concentrated, and mixes through a room farther away. This is why extraction for solvent stores and mixing rooms is placed low as well as high, why pits and trenches near solvent use are dangerous, and why an ignition source at floor level, such as a grinder, a heater or a forklift, is a particular concern near open solvents. Chapter 7 returns to it when choosing where to place ventilation.

## Solvent that stays in the product

The mass balance assumed that the paint's solvent all leaves before the parts do. For Plant S's oven-cured paint that is close to true, but not exactly. A cured coating holds a small amount of residual solvent that leaves over the following days, and parts with blind holes, crevices or absorbent materials can carry solvent away from the plant. For a balance, the residue is usually a small correction. For quality it can matter: residual solvent under a coating can cause blisters when the part is later heated, and solvent trapped in a crevice can affect a later bonding or welding operation. Plant S's frames are open steel sections, so it treated the residue as negligible.

## Where Plant S's solvent evaporates

A mass balance says how much evaporates, not where. The engineer walked the plant with the purchase records and listed every place solvent was exposed to air.

1. **The wiping bench.** Parts are wiped with acetone on rags before painting. Rags are dispensed from an open bucket.
2. **The gun-washing station.** Spray guns are flushed with thinner into a drum and wiped with acetone. The drum stands open during the shift.
3. **The mixing bench.** Paint is mixed and thinned in open tins.
4. **The spray booth.** Most of the paint's solvent evaporates during spraying and in the flash-off period that follows.
5. **The curing oven.** The remaining solvent leaves the paint film as it is heated.
6. **The waste drums and solvent store.** Closed drums breathe vapour as they warm in the day and as they are filled or emptied.

The engineer then estimated, from the purchase quantities and the way each liquid was used, roughly how the 536 kg split between these places. That estimate guided the order of work in later chapters: the open containers at the wiping bench and gun-washing station first, because they were cheap to fix, and the booth and oven next, because they were the largest.

```figure
type: bars
title: Estimated monthly evaporation at Plant S, by place
unit: kg per month
caption: This is an illustration. A first allocation from the uses of each liquid, to be refined by weighing open containers (Chapter 5) and by the oven's solvent load (Chapter 9). The total is the 536 kg from the mass balance.
- Spray booth and flash-off | 190
- * Open bucket and gun-wash drum | 150
- Curing oven | 85
- Rags and wiping | 70
- Mixing bench | 26
- Store and waste drums | 15
```

## The error: the waste drum as the measure

When the fire-service inspector asked how much solvent the plant used, the supervisor answered with the figure the plant reported to its recycler: about 120 L a month, the contents of the dirty-thinner drum. That figure had also been used in the plant's chemical risk assessment, which concluded that the quantities involved were small.

The waste drum measured what was left over, not what was used. The mass balance showed that for every kilogram of solvent in the waste drum, about 6.5 kg had evaporated. The risk assessment had understated the solvent going into the plant's air more than sixfold, and with it the case for ventilation, for keeping containers closed and for checking the oven.

```figure
type: stats
title: Two answers to "how much solvent do we use?"
caption: This is an illustration. The waste drum records only what is left over; the purchases record what is used, and the difference is what evaporates.
- 83 kg | solvent in the waste drum each month
- 618 kg | solvent bought each month, including the paint's
- 536 kg | evaporated each month, by difference
- 6.5 times | evaporated solvent per kilogram in the waste drum
```

The error is common for an understandable reason. Waste is the only solvent stream that is visible, measured and paid for separately. The evaporated stream is invisible, and the purchased stream lives in the accounts rather than on the workshop floor. A simple mass balance, kept monthly, puts all three in one place.

### Keeping the balance honest

Three practical points make a solvent balance reliable. Count stock at the start and end of the period, including part drums, because a delivery just before month end otherwise looks like a month of heavy use. Weigh the waste drum when it is collected rather than guessing its volume, and find out from the recycler what fraction of it is recoverable solvent. And include the solvent in paints, adhesives and other products, from their safety data sheets, because it evaporates in the same air.

## How this applies to a small Australian business

Keep a monthly solvent mass balance in kilograms: purchases in, waste out, the difference evaporated. Expect most of what you buy to evaporate. Separate the fire hazard, which arises at per cent concentrations in containers, ovens and booths, from the health hazard, which arises at concentrations a hundred times lower in the breathing zone. Walk the workshop and list every place solvent meets air; the open containers are usually the cheapest to fix. Then use the later chapters to put a number on each place, starting with the largest and the cheapest to change.

## Exercise: a smaller workshop

A cabinet maker buys 60 L of acetone and 40 L of a lacquer thinner of density 0.85 kg/L each month, and sends 15 L of waste thinner, about 70% solvent by volume, to a recycler. (a) How much solvent evaporates each month? (b) What fraction is that of the solvent bought? (c) Which number should the risk assessment use?

**Worked answer.** (a) Solvent bought is 60 × 0.79 + 40 × 0.85 = 47.4 + 34.0 = 81.4 kg. The waste carries about 15 × 0.70 × 0.85 = 8.9 kg of solvent. About **72.5 kg evaporates** each month. (b) That is 72.5 ÷ 81.4 = **89%** of the solvent bought. (c) The **evaporated quantity**, 72.5 kg a month or about 3.5 kg a working day, together with where it evaporates. The 15 L in the waste drum understates the vapour released about eightfold.
