---
book: cutting-and-gouging-by-the-numbers
chapterSlug: plasma-and-oxy-fuel-by-the-metre
order: 6
title: "Plasma and oxy-fuel by the metre"
description: "Build an hourly rate for a cutting table, turn it into a cost per metre for plasma and oxy-fuel at each thickness, add pierces and finishing, and find where oxy-fuel, with one torch or three, wins."
draft: false
---

A cutting table's owner sells cut metres, and needs to know what each metre costs. The answer is not the gas or the consumables, which are a small part of it, but the hour: the machine's cost per hour, the operator's, the power, gas and consumables, all divided by the metres cut in that hour. Because plasma cuts thin and medium plate several times faster than oxy-fuel, it is much cheaper per metre there, even though its hour costs more. Because oxy-fuel's speed falls far more gently with thickness, and because several oxy-fuel torches can cut at once on one table, there is a thickness at which oxy-fuel becomes cheaper. Finding it is one of the most useful calculations a plate shop can make.

This chapter builds an hourly rate for each process on the service centre's table, turns it into cost per metre at each thickness, adds the costs of pierces and finishing, and finds the crossover with one oxy-fuel torch and with three. Oxy-Fuel by the Numbers works through the cost of an oxy-fuel metre in more detail.

## The hourly rate

```figure
type: compare
title: Illustrative hourly cost of cutting on the service centre's table
cols: Plasma, 200 A oxygen | Oxy-fuel, one torch
caption: This is an illustration in Australian dollars excluding GST, for teaching. The table's share covers its depreciation, maintenance, software, space and extraction over its expected hours; consumables and gases come from the shop's records for 12 to 25 mm plate.
- Table's share | about A$45 | about A$45
- Operator, fully loaded | about A$72 | about A$72
- Electrical power | about A$9 | negligible
- Gases | about A$3 | about A$15
- *Consumables | about A$20 per arc hour | about A$2
- Total per hour of cutting | about A$149 | about A$134
```

The plasma hour costs a little more than the oxy-fuel hour, mainly because of its consumables and power. But the two biggest items, the table and the operator, are the same for both and together make up most of each hour. That is why speed dominates: the faster process spreads the same large hourly cost over more metres.

## Cost per metre

Dividing the hourly cost by the metres cut per hour gives the cost per metre, at each thickness's speed.

```figure
type: formula
title: Cost per metre of 12 mm plate, plasma and oxy-fuel
formula: cost per metre = hourly cost ÷ (cutting speed × 60 ÷ 1,000)
caption: This is an illustration using the hourly costs above and typical speeds of about 2,500 mm/min for plasma and 550 mm/min for oxy-fuel on 12 mm mild steel. Pierces, moves and finishing are added separately.
- Plasma | A$149 an hour at 2.5 m/min, 150 m an hour
- Oxy-fuel | A$134 an hour at 0.55 m/min, 33 m an hour
step: plasma ≈ 149 ÷ 150 ≈ A$0.99 per metre
step: oxy-fuel ≈ 134 ÷ 33 ≈ A$4.06 per metre
step: on 12 mm plate, plasma cuts a metre for about a quarter of oxy-fuel's cost
```

## Across the thicknesses

```figure
type: compare
title: Illustrative cost per metre by thickness, plasma and oxy-fuel
cols: Plasma, one torch | Oxy-fuel, one torch | Oxy-fuel, three torches
caption: This is an illustration from the hourly rates above and typical speeds for teaching: plasma 5,000, 2,500, 1,300, 900 and 350 mm/min, and oxy-fuel 650, 550, 480, 450 and 380 mm/min, for 6, 12, 20, 25 and 40 mm. Three oxy-fuel torches share one operator and table, at about A$56 an hour per torch. Figures exclude GST.
- 6 mm | A$0.50 | A$3.44 | A$1.44
- 12 mm | A$0.99 | A$4.06 | A$1.70
- 20 mm | A$1.91 | A$4.65 | A$1.94
- *25 mm | A$2.76 | A$4.96 | A$2.07
- 40 mm | A$7.10 | A$5.88 | A$2.46
```

With one torch each, plasma is cheaper up to somewhere around 35 mm in this illustration, and oxy-fuel beyond. With three oxy-fuel torches cutting identical parts at once, sharing one table and one operator, oxy-fuel's cost per metre falls by more than half, and the crossover moves down to about 20 mm. Above that, a shop cutting repeated parts in thick plate does better with several oxy-fuel torches than with one plasma torch; below it, plasma wins even against three torches. The figures change with every shop's rates and equipment, but the shape of the comparison is very stable, and every plate shop should work out its own.

## Pierces

A metre of cut is not the whole job; every part starts with a pierce, and every hole needs another. Plasma pierces medium plate in a second or two. Oxy-fuel must preheat the plate to its ignition temperature before the cutting oxygen can be turned on, which on 25 mm plate may take the best part of a minute, and the pierce throws slag up at the torch.

At the oxy-fuel table's A$134 an hour, a 60-second pierce costs about A$2.20, as much as cutting about half a metre; a plasma pierce of 2 seconds costs about A$0.08. For parts with many holes, the pierces can matter more than the metres. A base plate with eight bolt holes in 25 mm plate has eight pierces for the holes and one for the outside, about nine minutes of oxy-fuel preheat, which can cost more than its whole perimeter. That is why plate shops often cut the outsides of thick parts with oxy-fuel and the holes with plasma, or drill the holes.

## Finishing

The cost of a cut part includes whatever must be done to it afterwards: removing dross, grinding a bevel, cleaning a heat-affected edge, or machining a hole to size. A process that cuts more cheaply but leaves more finishing can lose its advantage. Oxygen plasma's low dross, and oxy-fuel's square edge on thick plate, are both worth money. The service centre measured the time its customers spent cleaning its parts before welding, and found that tuning the plasma settings to eliminate dross saved them more than the centre's whole cutting charge on some parts.

## Material and kerf

The kerf is metal that becomes scrap. On 12 mm plate, a 3 mm plasma kerf loses about 0.28 kg per metre and a 2 mm oxy-fuel kerf about 0.19 kg. At about A$1.50 per kg for plate, the difference is about A$0.14 per metre, small beside the cost of the cut but not nothing. Nesting, which Chapter 1 described, matters far more to material cost than the kerf width.

## Utilisation

The hourly rate assumes the table is cutting. A table that spends half its time idle, waiting for plates, programs or an operator, carries its fixed costs over fewer cutting hours, and its real cost per metre rises. Loading the next plate while the current one is cutting, having programs and nests ready, and keeping consumables stocked at the table are as important to the cost per metre as the choice of process. The service centre's table cut for about 60% of its scheduled hours when the manager first measured it; after organising plate handling and programming, about 75%.

## Quoting by the metre

A plate shop quotes customers by the part, not the metre, but the part's price is built from metres, pierces, finishing, material and handling. The service centre's quoting sheet takes the part's cut length and number of pierces from the nesting software, applies the cost per metre and per pierce for the thickness and process, adds the material from the nest's utilisation, any finishing and a margin, and gives the price. Chapter 10 describes the cutting record that keeps those rates honest.

## Sensitivity to the rates

Because the table and operator dominate the hourly cost, the cost per metre is most sensitive to them and to speed, and least to gas and consumable prices. In this illustration, a 20% rise in the price of oxygen raises oxy-fuel's hourly cost by about A$3 and its cost per metre on 25 mm plate by about 2%; a 20% rise in the operator's cost raises both processes' metres by about 10%. A 10% gain in plasma speed, from better settings or consumables, cuts its cost per metre by about 9%. The manager's attention therefore went first to speed and utilisation, then to the operator's time, and only then to gas and consumable prices, though those were the items suppliers most often offered to discount.

## Bevels cost more

A bevelled cut is slower than a square one, because the torch cuts through a longer path in the plate: a 30° bevel on 20 mm plate cuts through about 20 ÷ cos 30° ≈ 23 mm of steel, and the bevel head moves more slowly round corners. Bevel cuts also need more careful set-up and checking. The service centre charges bevelled metres at the rate for the effective thickness the bevel cuts through, plus a set-up charge per part, which reflects their real cost and has not deterred customers who would otherwise have to grind the bevels themselves.

## Conventional and high-definition plasma

High-definition plasma systems cost more than conventional ones and use dearer consumables, but cut squarer edges, smaller and more accurate holes, and less dross, at similar or higher speeds. Their cost per metre is a little higher; their cost per finished part can be lower, if the parts need less finishing and their holes need no drilling. The comparison is made per part, including finishing, not per metre. For the service centre, whose fabricator customers valued square edges and bolt-ready holes, the high-definition system it already owned was worth its extra consumable cost.

## Hand cutting by the metre

Hand cutting with a torch or a hand-held plasma set costs far more per metre than table cutting, because the operator's speed is lower and less steady, the operator factor is low, and the edge usually needs more cleaning. As an illustration, a fitter hand cutting 12 mm plate with an air plasma set at about 1,000 mm/min, at an operator factor of 40% and a cost of about A$85 an hour including the set, cuts about 24 m an hour and costs about A$3.50 per metre before grinding, against about A$1 on the table. Hand cutting is right for odd cuts, site work and repairs; repeated parts belong on the table, and the service centre offers cut parts to its repair bay at table rates, which has moved much of the bay's hand cutting onto the table.

## Thin sheet

At the thin end, plasma's advantage over oxy-fuel is enormous, but it meets a new competitor: the laser. On 1.5 to 5 mm sheet, plasma's wider kerf, bevel, heat distortion and poor small holes limit its quality, and a fibre laser cuts faster and much more accurately. The service centre's 10% of work in thin sheet, cut by plasma with mediocre edges, was the main reason its manager was considering a laser, whose costs per metre Chapter 7 compares with plasma's.

## Moves and lead-ins

Between cuts, the torch moves across the plate with the cutting off, and each part has lead-ins and lead-outs, short cuts from the pierce to the profile and away from it at the end. On a nest of many small parts, the moves and lead-ins can add a large share to the cutting time, and they cost the same hourly rate as cutting. Nesting software that orders the cuts to minimise travel, chains parts so that one cut runs into the next, and uses short lead-ins where the edge quality allows, saves time on every sheet. The service centre found that reordering the cuts on its common bracket nests cut their cycle times by about 8% with no change in the cutting itself.

## Overheads beyond the table

The hourly rate above covers the table and its operator, but not everything the cutting business carries: the programmer's time to nest and program each job, the crane and forklift that load plates, the plate store and its handling, quality checks, and the office's quoting and invoicing. The service centre adds those as a separate overhead per part and per tonne, from its accounts, rather than burying them in the cutting rate, so that the cost per metre stays a clean comparison between processes.

## The running case: the thick plate work

This is an illustration. The service centre cut about 210 tonnes a year of 30 to 100 mm plate with a single oxy-fuel torch on its plasma table. The cost comparison showed that for repeated parts, such as the mining wear plate brackets that made up most of that work, a second table with three oxy-fuel torches would cut them at less than half the cost per metre. The manager weighed that against the cost of the table and found it paid back in about three years, but chose instead to add two more oxy-fuel torches to the existing table's gantry, which the maker offered, giving most of the benefit for a fraction of the price.

## A failure: the plasma on thick plate

This is an illustration. A shop with only a plasma table took on an order for brackets in 50 mm plate, cutting them with its 200 A plasma at a slow speed near the limit of its range. The cuts were heavily bevelled, with thick dross, and the consumables wore out quickly. The brackets needed extensive grinding, and the job lost money.

A subcontractor with an oxy-fuel table would have cut the brackets square, with little dross, for less than the shop's grinding alone. The shop now sends plate above its plasma's practical range to a subcontractor, and quotes such work only after checking the subcontract price.

## Exercise: the crossover for a shop's own rates

A shop's plasma table costs about A$160 an hour to run and cuts 25 mm plate at about 1,000 mm/min. Its oxy-fuel torch costs about A$140 an hour and cuts 25 mm at about 430 mm/min. What is each one's cost per metre? With two oxy-fuel torches sharing the table and operator at about A$75 an hour per torch, what is the oxy-fuel cost per metre?

Plasma cuts 60 m an hour, so it costs about 160 ÷ 60 ≈ **A$2.67 per metre**. One oxy-fuel torch cuts about 25.8 m an hour, about 140 ÷ 25.8 ≈ **A$5.43 per metre**.

With two torches at A$75 an hour each, each torch's metre costs about 75 ÷ 25.8 ≈ **A$2.91**, close to plasma's. At 25 mm this shop is near its crossover with two torches; with three, or on thicker plate, oxy-fuel would win, while for parts with many holes plasma's quick pierces would keep it ahead.
