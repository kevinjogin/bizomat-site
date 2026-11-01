---
book: metal-casting-by-the-numbers
chapterSlug: melting-energy-time-and-cost
order: 2
title: "Melting: energy, time and cost"
description: "How much energy, time and money each melt takes: the heat balance of a charge, furnace efficiency, the melting cycle with charging and tapping, metal per shift, and energy per casting."
draft: false
---

A foundry's furnace sets the pace of everything else. However many moulds the moulders can make, the shift can pour only as much metal as the furnace can melt, and every kilogram melted costs energy, whether it ends up in a casting or goes back into the furnace as gates and risers. Knowing how long a melt takes and what it costs is the first piece of arithmetic in planning any casting job.

This chapter works through the heat balance of a melt for GB-12, turns it into a melting time and an energy cost with one WORKOS tool, builds the furnace's cycle and its output per shift with another, and works through a planning error that promised a customer more metal than the furnace could deliver.

## The furnace and the charge

This is an illustration. GB-12's foundry melts in an electric crucible furnace: a silicon carbide crucible holding 150 kg of aluminium, heated by resistance elements in an insulated, lidded chamber. The furnace draws 100 kW. Its overall efficiency, the share of the electrical energy that ends up in the metal, is about 60% with the lid on and the lining in good condition. The rest is lost through the furnace walls and lid, to the crucible itself, and while the lid is open for charging and skimming.

Each melt is a charge of 150 kg made up of new ingot and the foundry's own returns, the gates and risers cut from earlier castings, in proportions set in Chapter 3. Energy costs the foundry A$0.30 per kWh including GST, on its current electricity contract.

## The heat balance of one melt

Chapter 1 set out the three-part heat balance: warm the solid to the liquidus, supply the latent heat, superheat the liquid to pouring temperature. Multiplied by the charge mass and divided by the efficiency, it gives the energy drawn from the supply.

The WORKOS [Energy and time to melt metal](/tools/melting-energy/) tool does this for one charge. From the charge mass, starting, melting and pouring temperatures, solid and liquid specific heats, latent heat, furnace power and efficiency and energy price, it reports the energy into the metal, the share of it that is latent heat, the energy drawn, the melting time, the energy cost per melt and the specific energy in kilowatt-hours per tonne.

```figure
type: steps
title: One 150 kg melt of GB-12's alloy in the melting energy tool
caption: This is an illustration. Liquidus 615 °C, pouring 720 °C, c_s 0.9 and c_l 1.18 kJ/(kg·K), latent heat 390 kJ/kg, 100 kW at 60% efficiency, A$0.30 per kWh including GST.
- Heat into the metal | 150 × 1,049.4 = 157.4 MJ, or 43.7 kWh
- Latent heat share | 37.2%
- Energy drawn at 60% efficiency | 43.7 ÷ 0.60 = 72.9 kWh
- Melting time at 100 kW | 0.729 h, about 44 min
- * Energy cost per melt | 72.9 × 0.30 = A$21.86
- Specific energy | 486 kWh per tonne melted
```

Two things stand out. The energy that actually goes into the metal, 43.7 kWh, is only three-fifths of what the foundry pays for. And the cost of melting a whole 150 kg charge, about A$22, is small beside the value of the metal itself. Energy is rarely the largest cost of a casting, but the melting time sets how many melts a shift can make, and that is often the constraint.

### What efficiency means and how it is lost

Furnace efficiency is not a fixed property of the furnace. It depends on how the furnace is run:

```figure
type: compare
title: The same 150 kg melt at two efficiencies
cols: Energy drawn, kWh | Melting time, min | Cost per melt | Specific energy, kWh/t
rowhead: Furnace condition
- * Lid on, lining in good condition, 60% | 72.9 | 44 | A$21.86 | 486
- Lid left open, worn lining, 45% | 97.2 | 58 | A$29.15 | 648
caption: This is an illustration. From the melting energy tool. A fall of 15 percentage points in efficiency costs a third more energy and 14 more minutes per melt.
```

Leaving the lid open while waiting for moulds, a cracked or thinning lining, a crucible thick with built-up oxide, and charging cold, bulky returns that take a long time to collapse into the bath all lower efficiency. None of these is visible on a single melt, but over a shift they add up to a lost melt.

### Holding

The tool deliberately leaves out holding losses: the heat lost while molten metal waits in the furnace for moulds to be ready. A crucible furnace at temperature loses heat continuously through its walls and lid, and the elements must keep supplying it. This is an illustration. If GB-12's furnace loses about 8 kW at temperature and the metal waits 20 minutes on average per melt, that is about 2.7 kWh per melt, or about 19 kWh over seven melts, against about 510 kWh drawn for the melting itself: roughly 4% on top. A shift with poorly matched moulding and melting, with metal held for an hour each time, would lose three times as much, and its metal would pick up more hydrogen and oxide as well (Chapter 8).

### The first melt of the day

The heat balance assumes the furnace is already hot. The first melt of a shift is different, because the crucible, the lining and the chamber must be heated too. This is an illustration. GB-12's silicon carbide crucible weighs about 60 kg; taking a mean specific heat of 0.75 kJ/(kg·K) and a rise from 20 to 750 °C, it alone absorbs 60 × 0.75 × 730 = 32.9 MJ, about 9.1 kWh, a fifth of what the metal itself needs. The lining and chamber take more again. The foundry's records show its first melt takes about 25 minutes longer than the others, which is why the furnace is switched on before the moulders start and why the batch plan's seven melts are a comfortable figure rather than a tight one.

Overnight cooling and reheating also stress the crucible. Crucible makers give heating and cooling rates for their products, and a crucible heated too fast from cold can crack, which is both an expense and a hazard. The foundry follows its crucible supplier's warm-up procedure on Monday mornings and after any long stop.

### Melt loss and dross

Not all of the charge becomes pourable metal. Aluminium oxidises at its surface, and the oxide skimmed off the top of the melt, the dross, carries metal with it. Thin, oily or heavily oxidised returns lose more than clean ingot, because they present more surface. The foundry's records give an average melt loss of about 2% for GB-12's charge make-up, so a 150 kg charge yields about 147 kg of pourable metal. The batch plan tool works with the charge mass; the foundry's capacity figures use the pourable mass. Over a shift of seven melts that is a difference of about 21 kg, almost two moulds.

Dross is not waste to throw away: it contains a good deal of metal, and dross processors recover it. But it is not free metal either, and a foundry that sees its melt loss creep up should look for its cause: dirtier returns, longer holding, more stirring, or a higher pouring temperature than the job needs.

### Choosing a furnace type

GB-12's foundry melts in an electric resistance crucible furnace, which is simple, quiet, clean and well suited to small batches of aluminium. Other foundries use gas-fired crucible furnaces, which are cheaper to run where gas is cheap but have lower efficiencies, or coreless induction furnaces, which heat the metal directly with induced eddy currents, melt fast, stir the bath and suit larger outputs and higher-melting metals. Reverberatory and tower furnaces melt large tonnages of aluminium for die-casting shops. The heat balance is the same for all of them; what differs is the efficiency, the power, the cycle and the metal quality each delivers. A furnace comparison for a new job should run the batch plan for each candidate with its own efficiency and cycle, not just compare power ratings.

## The melting cycle and output per shift

A melt is not just the time to heat the metal. The furnace must be charged, the metal skimmed, sampled, degassed and treated, the crucible tapped or the metal ladled out, and the furnace recharged. Those steps take time whatever the furnace's power.

The WORKOS [Melting furnace batch plan](/tools/melt-furnace-batch-plan/) tool adds them. With the same heat balance as the melting energy tool, it takes a charging and tapping time per melt, the hours in a shift and the metal needed per shift, and reports the cycle per melt, the number of complete melts per shift, the metal per shift against the demand, the energy per tonne and the energy cost per kilogram.

```figure
type: steps
title: GB-12's furnace in the batch plan tool
caption: This is an illustration. Same melt as above; 20 minutes per melt for charging, skimming, treating and tapping; an 8-hour shift; demand 60 castings × 12.1 kg poured = 726 kg.
- Melt time | 44 min
- Cycle per melt with charging and tapping | 64 min
- Complete melts per shift | 7
- * Metal per shift | 1,050 kg, against 726 kg needed: demand met
- Energy per tonne | 486 kWh
- Energy cost per kilogram melted | A$0.146
```

The furnace can supply GB-12's first order with room to spare: 1,050 kg against 726 kg, about 45% more than needed. The spare melts are useful. They allow for the first melt of the day starting from a cold furnace, which takes longer, for a melt rejected on chemistry, and for the moulding line occasionally running ahead.

### Energy per casting

Each GB-12 mould takes 12.1 kg of metal, of which 6.68 kg becomes the casting and the rest, the gates and risers, returns to the furnace to be melted again. The energy cost of a casting must therefore be based on the metal poured, not the casting's own mass: 12.1 kg × 0.486 kWh/kg = 5.9 kWh, or about A$1.76 per casting. Per kilogram of finished casting that is 0.88 kWh, almost twice the furnace's specific energy, because nearly half of every melt goes round again. Improving the casting yield, the share of poured metal that ends up in the casting, is therefore one of the most effective ways of saving melting energy. Chapter 7 shows where GB-12's yield of 55% comes from.

It helps to keep the energy in proportion. This is an illustration. Chapter 3 works out a charge cost of about A$3.33 per kilogram. The 6.68 kg that leaves the foundry in each casting, plus its share of the 2% melt loss on 12.1 kg poured, is about 6.9 kg of metal, worth roughly A$23. Melting energy, at about A$1.76 per casting, is less than a tenth of that. Energy savings matter, especially across a year, but the metal that is lost, scrapped or sent out inside a defective casting matters more. A melt that is rejected on chemistry, or a batch of castings scrapped for porosity, wastes the metal and the energy together.

## The error: a cycle without the tapping

This is an illustration. When the customer asked whether the foundry could raise the order to 100 castings a shift, the sales coordinator worked out the furnace's capacity from the melting time alone. Eight hours divided by 44 minutes is 10.9, so ten melts, 1,500 kg a shift, comfortably more than the 1,210 kg that 100 castings need. The foundry accepted the order.

On the first double-order shift the furnace managed seven melts, as it always had, and the moulders stood idle for the last two hours. The coordinator's calculation had left out the 20 minutes per melt that the furnace spends being charged, skimmed, sampled, degassed and tapped, during which it is not melting anything.

```figure
type: compare
title: Two estimates of the furnace's output per shift
cols: Cycle per melt, min | Melts per shift | Metal per shift, kg | Against 1,210 kg for 100 castings
rowhead: Estimate
- Melting time only (the coordinator's) | 44 | 10 | 1,500 | met, on paper
- * Melting plus charging and tapping (the batch plan) | 64 | 7 | 1,050 | short by 160 kg
- Batch plan with the lid habitually left open, 45% | 78 | 6 | 900 | short by 310 kg
caption: This is an illustration. The batch plan tool rounds down to complete melts, because a part-melt at the end of a shift cannot be poured into a full mould.
```

The foundry met the order by running the furnace through the meal break with a second operator, which added an eighth melt and 150 kg, and by cutting the charging time with pre-heated, pre-sized returns. The coordinator now checks capacity with the batch plan tool, and the foundry's quoting sheet has a line for the charging and tapping time measured over a week of real melts.

## Safety at the furnace

Molten aluminium is dangerous in two ways that matter for planning. It burns, at 700 °C or more, anyone it touches. And it reacts violently with water: any moisture trapped in a charge, a tool, a ladle or a mould turns instantly to steam when it meets molten metal, and the expanding steam can throw metal out of the crucible. Returns stored outside, ingot with condensation on it after a cold night, and tools left wet all carry that risk. GB-12's foundry preheats every charge addition and every tool on the furnace rim before it touches the melt, stores returns undercover, and keeps the furnace area free of water. Its procedures follow its duties under the model WHS laws to manage the risks of plant and hazardous work, and its people wear the protective clothing the risk assessment requires. Planning that saves time by charging cold or damp material is not a saving.

## Exercise: a smaller charge

This is an illustration. To keep the metal fresher, the foundry considers melting 120 kg charges instead of 150 kg, keeping the 20-minute charging and tapping time.

1. What are the energy into the metal, the energy drawn and the melting time for 120 kg?
2. What is the cycle, and how many melts and how much metal does a shift give?
3. Does it meet the original demand of 726 kg, and the 1,210 kg of the larger order?

**Worked answer.**

1. 120 × 1,049.4 kJ = 125.9 MJ = **35.0 kWh** into the metal; **58.3 kWh** drawn; **35 min** at 100 kW.
2. Cycle 35 + 20 = **55 min**; 480 ÷ 55 = 8.7, so **8 melts**, **960 kg** per shift.
3. **Yes** for 726 kg; **no** for 1,210 kg. Smaller charges melt faster, but the fixed 20 minutes per melt takes a larger share of each cycle, so output falls. Fresher metal is bought with less of it.
