---
book: reverse-osmosis-by-the-numbers
chapterSlug: pretreatment-that-protects-the-membranes
order: 7
title: "Pretreatment that protects the membranes"
description: "Particles, colloids, iron, biology and oxidants: the silt density index, cartridge filters, dechlorination with sodium metabisulfite, antiscalant dosing and the interlocks that protect the elements."
draft: false
---

A reverse osmosis membrane is a very fine filter that cannot be backwashed. Everything in the feed that it does not pass either leaves with the concentrate or stays on the membrane, and what stays on the membrane costs flux, raises the pressure drop and shortens the element's life. Pretreatment is the equipment and chemistry upstream of the high-pressure pump that decides how much reaches the membrane. Its job is narrow and unforgiving: remove what the membrane cannot tolerate, condition what it can, and do so reliably, because a few hours of failure can undo years of careful operation.

This chapter sets out the five threats a brackish feed brings (particles and colloids, iron and manganese, biological growth, oxidants and scale), shows how the silt density index measures the first, and calculates BW-12's cartridge filters, its dechlorination dose and its antiscalant consumption. It ends with a dosing tank that ran empty for three weeks.

## Five threats and their controls

Each foulant has a characteristic place in the plant and a characteristic control. Particles and colloids are caught by the lead elements, where the flux is highest. Scale forms at the tail, where the water is strongest. Biological growth can start anywhere that is warm and fed. Oxidants do not foul; they damage the polyamide itself, and the damage cannot be reversed.

```figure
type: matrix
title: Where each threat strikes and how BW-12 controls it
x: Where in the plant: lead elements → tail elements
y: Reversible by cleaning: no → yes
hot: 1
caption: This is an illustration. Oxidant damage is the only threat that no cleaning can undo, which is why BW-12's dechlorination has its own interlock.
- Particles, colloids, oxidised iron | cartridge filters, keep iron reduced; mostly cleanable
- Scale at the concentrate end | antiscalant, recovery limit, Chapter 6; carbonate cleanable, silica hardly
- Oxidants, free chlorine | sodium metabisulfite and an ORP interlock; damage is permanent
- Biofilm anywhere | covered tank, no stagnant legs, biocides the maker approves; cleanable if caught early
```

BW-12's pretreatment train follows the water from the bore. The bore pump fills a covered feed tank. A small hypochlorite dose holds a low chlorine residual in the tank and its pipework to control bacterial growth. A booster pump lifts the water through the dosing points: first sodium metabisulfite to remove the chlorine, then antiscalant. Two housings of cartridge filters catch particles, and the high-pressure pump feeds the first stage. An oxidation-reduction potential (ORP) probe after the metabisulfite dose, and a sample point after the cartridge filters, check that what reaches the pump is fit for the membranes.

## Particles and the silt density index

The cartridge filters remove particles of a few micrometres and larger, but the colloids that foul membranes are much smaller: clay, silica and iron colloids, organic matter. Their effect is measured indirectly by the silt density index (SDI), defined in ASTM D4189. Feed water is passed through a 0.45 µm membrane filter disc at a constant pressure; the time to collect a fixed volume is measured at the start and again after a set interval, usually 15 minutes. If the filter clogs, the second collection takes longer.

```figure
type: formula
title: Silt density index from a 15-minute test
formula: SDI₁₅ = (1 − tᵢ ÷ t_f) × 100 ÷ 15
caption: tᵢ is the time to collect the sample volume at the start, t_f the time to collect the same volume after 15 minutes of continuous filtration. The bracketed term is the fraction of the filter plugged. This is an illustration: BW-12's feed after the cartridge filters.
- Initial collection | tᵢ = 28 s
- Collection after 15 minutes | t_f = 45 s
step: Plugging = (1 − 28 ÷ 45) × 100 = 37.8%
step: SDI₁₅ = 37.8 ÷ 15 = 2.52
```

Membrane data sheets state a maximum feed SDI; the brackish element sheet cited for this book gives 5. That is a ceiling, not a target. Makers' design guidelines link the recommended flux to the feed's SDI, and a water near the maximum is designed at a lower flux and cleaned more often than one well below it. BW-12's design flux of 18 L/(m²·h) assumes a well water with an SDI below 3, which the commissioning tests confirmed.

The test is sensitive to technique. The filter must be the type the standard calls for, the pressure steady, the apparatus clean and flushed, and the sample taken from a point that represents the feed. Published guidance warns that results obtained with filter discs from different makers may not be comparable. A plant should do its SDI tests the same way every time, so that a change in the result means a change in the water.

## Cartridge filters

The cartridge filters are the last barrier before the membranes. They protect the high-pressure pump and the elements from particles that slip through upstream: sand from the bore, scale from pipework, debris from maintenance. They are not intended to remove colloids, and a cartridge that clogs quickly is a sign that something upstream needs attention.

This is an illustration. BW-12's designer selected nominal 5 µm cartridges of 1,016 mm length, which the cartridge maker rates at 2.0 m³/h each at a clean pressure drop well inside the high-pressure pump's suction allowance. For 16.0 m³/h that is eight cartridges; the plant has two housings of six, twelve in all, so that the flow per cartridge is 1.33 m³/h and one housing can be serviced while the other runs at reduced output. The cartridges are changed when their pressure drop reaches the limit the cartridge maker gives, or at a fixed interval, whichever comes first, and the change is recorded so that a rising change frequency is noticed.

## Iron, manganese and air

Many bore waters carry dissolved iron and manganese in their reduced forms, which are soluble. BW-12's analysis showed 0.05 mg/L of iron and less than 0.02 mg/L of manganese, both low. Reduced iron passes through a reverse osmosis plant without harm as long as it stays reduced. If it meets oxygen, from an open tank, an air leak at a pump suction or a vented pipe, it oxidises to iron hydroxide, a fine floc that coats the lead elements and is one of the commonest foulants in groundwater plants.

The controls are to keep air out or to take the iron out. BW-12's feed tank is covered but vented, so the water picks up some oxygen there; at 0.05 mg/L the iron load is small enough for the cartridges and the cleaning schedule. A bore with several milligrams per litre would need either a closed feed system with no air contact, or deliberate oxidation and filtration upstream, and the membrane maker's guidelines give the iron levels at which each approach is needed.

## Oxidants: the dechlorination dose

Polyamide membranes are damaged by free chlorine and other oxidants. The brackish element data sheet cited for this book gives a free chlorine tolerance of less than 0.1 ppm, and the makers state that oxidation damage is not covered by warranty. Any chlorine in the feed must therefore be removed before the membranes. Sodium metabisulfite, Na₂S₂O₅, is the usual reagent. In water it forms bisulfite, which reduces hypochlorous acid to chloride.

```figure
type: steps
title: Sodium metabisulfite dose for BW-12's feed
caption: This is an illustration. The stoichiometric ratio follows from the reaction Na₂S₂O₅ + 2 HOCl + H₂O → 2 NaHSO₄ + 2 HCl and the molar masses. Plants dose an excess, set by measuring residual chlorine or ORP after the dose; BW-12 uses twice the theoretical amount.
- Chlorine to remove | 0.5 mg/L × 16.0 m³/h = 8.0 g/h as Cl₂
- Stoichiometric ratio | 190.1 ÷ (2 × 70.9) = 1.34 g of metabisulfite per gram of chlorine
- Theoretical dose | 8.0 × 1.34 = 10.7 g/h
- * Dose with a 2× margin | 21.4 g/h of metabisulfite
- As a 10% solution by mass | 0.214 kg/h; 3.4 kg per 16-hour day; about 860 kg a year
```

The excess covers variations in the chlorine residual and the slow loss of strength of a made-up metabisulfite solution, which reacts with air in its tank. It should not be large: excess bisulfite in the feed is food for some bacteria, and the dose is a balance between protecting the membrane and feeding a biofilm. The ORP probe after the dosing point reads high when oxidant is present and low when it has been removed; BW-12's control system stops the high-pressure pump and diverts the feed to drain if the ORP rises above its set point.

## Biology

Biofilm grows wherever water stands, nutrients are present and the temperature is warm, and a reverse osmosis plant offers all three: a feed tank, a spacer-filled channel with a large surface area, and the nutrients that the membrane itself concentrates. Biofouling shows as a steady rise in pressure drop, usually first in the lead elements, and a fall in normalised flow.

The controls are partly design and partly routine. Covered tanks keep light and debris out. Pipework without dead legs prevents stagnant water. A plant that stops for a weekend should be flushed with permeate before it stops, so that the elements sit in clean water. Chlorination upstream with dechlorination before the membranes, as at BW-12, controls growth in the tank and pipework, though bacteria that survive can regrow downstream of the dechlorination point. Non-oxidising biocides that the membrane maker approves can be used periodically. Each of these chemicals is a hazardous chemical under work health and safety law; Safe Work Australia's model code of practice for managing the risks of hazardous chemicals sets out the duties for storage, labelling, safety data sheets and spill containment, and the plant's procedures must follow the version that applies in its state.

## Antiscalant

Chapter 6 chose the antiscalant; this chapter doses it. This is an illustration. The supplier's projection for BW-12's water recommends 3.0 mg/L of product as supplied, based on the feed flow. At 16.0 m³/h that is 48 g/h, or 192 kg a year at 16 hours a day for 250 days. The product's density, 1.2 kg/L in this illustration, makes the pump rate 40 mL/h, small enough that the dosing pump must be sized carefully and checked often.

```figure
type: checklist
title: BW-12's pretreatment interlocks and alarms
caption: This is an illustration. Each item protects against a failure that would otherwise reach the membranes before anyone noticed.
- x High ORP after the metabisulfite dose stops the high-pressure pump and diverts to drain
- x Low level in the metabisulfite tank and the antiscalant tank alarms a day before empty
- x Dosing pump stroke or flow failure alarms
- x Cartridge filter pressure drop high alarm
- x Low suction pressure at the high-pressure pump trips it
- ? Monthly SDI test and quarterly feed analysis recorded and trended
```

## Starting, stopping and standing

Pretreatment does not end when the pump stops. A plant that runs two shifts stops every night, and each stop and start is a small hazard to the membranes.

When the plant stops, the vessels are left full of concentrate. That concentrate is supersaturated in silica in winter, by Chapter 6's figures, and the antiscalant only delays crystallisation; it does not prevent it indefinitely. BW-12 therefore flushes itself with permeate at low pressure for a few minutes after every stop, displacing the concentrate with water that cannot scale. This is an illustration. Each pressure vessel has a bore of about 0.2 m and a length of about 6 m, so the three vessels hold roughly 3 × π × 0.1² × 6 = 0.57 m³, and the flush pushes about three vessel volumes, 1.7 m³, through them. The permeate tank is sized to keep that volume in reserve.

When the plant starts, air in the vessels and pipework must be vented at low pressure before the high-pressure pump ramps up. Air compressed and then released by a fast start causes pressure surges that can crack the elements' end caps or telescope the membrane leaves. A variable-speed drive with a ramp of tens of seconds, a fill-and-vent step at low flow and a check that the permeate line is open all protect the membranes from mechanical damage that no chemistry can prevent.

A plant that stands for more than a day or two needs more. The makers specify a preservation procedure for longer shutdowns, commonly a dilute food-grade sodium metabisulfite solution in the vessels, renewed at intervals, and they specify how the elements must be flushed before the plant restarts. BW-12's annual shutdown follows the maker's procedure word for word, with the dates recorded.

## The error: three weeks without metabisulfite

This is an illustration. In its second year, BW-12's metabisulfite tank ran empty during a holiday period. The level switch had been bypassed months earlier after it gave false alarms, and the ORP probe, which should have caught the chlorine, had drifted with a fouled sensing surface and read low. The plant ran for about three weeks with the feed tank's chlorine reaching the membranes.

The first sign was in the permeate conductivity log. The normalised salt passage, steady at about 1.5% for a year, rose week by week to over 3%, while the normalised permeate flow rose slightly, which is the signature of oxidation: the damaged polyamide passes more water and much more salt. Cleaning made no difference, as expected. The lead elements, which had seen the chlorine first and at the highest concentration, were the worst; the plant ran on with its permeate near the rinse specification until a replacement set was installed.

The review found three failures behind one empty tank: a bypassed alarm, an uncalibrated probe and no routine check of either. The corrections were to restore and test the level switch, to add the ORP probe to the monthly calibration round with a check against a free chlorine test kit, and to make the high-ORP trip part of the plant's weekly function test. The cost of the elements was many times the cost of all three.

## Exercise: a dirtier feed and more chlorine

After a new bore is connected, an SDI test on BW-12's feed gives an initial collection time of 31 s and a time of 64 s after 15 minutes. The feed tank's chlorine residual is raised to 0.8 mg/L to control growth. Calculate the SDI and the metabisulfite dose with a margin of 1.5 times the theoretical amount at 16.0 m³/h.

**Worked answer.** This is an illustration. Plugging is (1 − 31 ÷ 64) × 100 = 51.6%, so SDI₁₅ = 51.6 ÷ 15 = **3.44**. That is below the data sheet maximum of 5 but above the value BW-12's flux was designed for, so the plant should expect faster fouling of the lead elements; the new bore's water should be investigated for colloids or iron before it becomes the main supply. The chlorine load is 0.8 × 16.0 = 12.8 g/h, the theoretical metabisulfite 12.8 × 1.34 = 17.2 g/h, and with the 1.5 margin the dose is **25.7 g/h**, or 0.257 kg/h of 10% solution. The ORP set point and the tank's level alarm should be checked against the higher consumption.
