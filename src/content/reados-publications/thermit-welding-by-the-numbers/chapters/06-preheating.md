---
book: thermit-welding-by-the-numbers
chapterSlug: preheating
order: 6
title: "Preheating"
description: "Work out why the parts are heated to red heat before the pour, how much heat and gas that takes for the crusher frame, and what an unevenly heated joint does to fusion."
draft: false
---

In the fusion method, the parts are heated before the iron is poured. Viall wrote in 1921 that they had to be preheated, usually to a red heat, to prevent the thermit being chilled by contact with colder metal and causing an imperfect weld. TWI's modern description of rail welding says the same: the rail ends are preheated until orange so that the molten steel is not chilled as it flows between them. Preheating is not an optional extra; it is part of the heat budget of the weld.

This chapter calculates how much the preheat helps the superheat do its job, how much heat and gas it takes for the crusher frame, why it must be even, and what happens when it is not.

## What preheat buys

Chapter 2 showed that the poured iron carries a limited amount of superheat, the heat it can give up before it begins to freeze, and that this superheat must melt the faces of the parts if they are to fuse. The colder the faces, the more of that superheat is spent heating them up to melting, and the less is left to melt them.

This is an illustration. Melting a kilogram of steel from room temperature takes roughly 0.75 × 1,485 + 270 ≈ **1,385 kJ**, using an average specific heat and a latent heat of melting. From a preheat of 900 °C, it takes only about 0.80 × 610 + 270 ≈ **760 kJ**, about 55% as much. So preheating the faces to red heat nearly halves the superheat needed to melt each kilogram of face metal.

For the crusher frame, suppose a layer 3 mm deep on each of the two 200 × 150 mm faces must melt for sound fusion. That layer weighs about 2 × 200 × 150 × 3 × 0.007 85 ≈ 1.41 kg. Melting it from cold would take about 1.41 × 1,385 ≈ 1,960 kJ; from 900 °C, about 1.41 × 760 ≈ 1,070 kJ. Those figures look small beside the 35 MJ of superheat in Chapter 2, but most of the superheat goes into the mould, the collar's contact with the member and the bulk of the parts behind the faces, and the faces are reached last, by iron that has already lost heat on its way through the runner and the bottom of the gap. Preheating protects the margin exactly where it is thinnest.

```figure
type: compare
title: Heat to melt the crusher-frame face layer, cold and preheated
cols: From 25 °C | From 900 °C
caption: This is an illustration with approximate average property values. Preheating to red heat nearly halves the heat the poured iron must supply to melt each kilogram of the faces.
- Heat to melt 1 kg of steel | about 1,385 kJ | about 760 kJ
- Face layer, 3 mm on two faces | 1.41 kg | 1.41 kg
- Heat to melt the face layer | about 1,960 kJ | about 1,070 kJ
```

## Other reasons to preheat

Preheating serves several purposes beyond the superheat budget.

- **Drying.** Preheating drives moisture off the parts, the mould and the luting, removing the hazard described in Chapter 3.
- **Thermal shock and cracking.** A cold cast steel part suddenly surrounded by iron at over 2,000 °C experiences steep temperature gradients and thermal stresses. In hardenable steels, rapid cooling of the heated zone after welding can form hard, crack-prone structures. A preheated part cools more slowly afterwards, for the reasons explained in [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/preheat-hydrogen-and-cooling/).
- **Shrinkage control.** The heated length of the parts expands with the preheat and contracts as the weld cools. Chapter 7 shows how that contraction adds to the shrinkage of the weld metal and how it is allowed for.

Viall also noted that thermit's big advantage on heavy work was that the steel was produced and introduced into the weld quickly and in bulk, giving a single contraction of the whole mass. Even preheating supports that: a joint heated evenly contracts evenly.

## How much heat the crusher frame needs

This is an illustration. Suppose the contractor's procedure calls for the member to be heated to about 900 °C for 150 mm on each side of the gap. The heated volume is 200 × 150 × 300 mm, which is 9.0 litres of steel, weighing about **70.6 kg**. Using an average specific heat of about 0.65 kJ/kg·°C from room temperature to 900 °C, the heat stored in it is about 70.6 × 0.65 × 875 ≈ **40 MJ**.

The heat has to come from burners, and much of a burner's heat goes past the work and into the air, especially around a large, irregular casting. If about a quarter of the burner's heat ends up in the steel, the burners must supply about 40 ÷ 0.25 ≈ 160 MJ. Propane releases about 46 MJ per kilogram, so the preheat uses about 160 ÷ 46.3 ≈ **3.5 kg** of propane. With burners totalling about 100 kW, it takes about 160,000 ÷ 100 ≈ 1,600 s, roughly **27 minutes**, ignoring the heat lost during heating by radiation from the hot steel, which lengthens it in practice.

```figure
type: formula
title: Preheat heat and gas for the crusher frame
formula: Q = m × c × ΔT;  gas = Q ÷ (efficiency × heating value)
caption: This is an illustration. The burner efficiency of about 25% is an assumed value for heating a large casting in the open; the contractor's experience gives the real figure.
- m | steel heated, 200 × 150 × 300 mm ≈ 70.6 kg
- c | average specific heat to 900 °C, about 0.65 kJ/kg·°C
- ΔT | 900 − 25 = 875 °C
- efficiency, heating value | about 25%; propane about 46.3 MJ/kg
step: Q ≈ 70.6 × 0.65 × 875 ≈ 40 MJ
step: propane ≈ 40 ÷ (0.25 × 46.3) ≈ 3.5 kg
step: time at 100 kW of burners ≈ 160,000 kJ ÷ 100 kW ≈ 27 min
```

The comparison with Chapter 2 is instructive. The preheat puts about 40 MJ into the parts; the thermit charge releases about 375 MJ. The preheat is about a tenth of the reaction's heat, but it decides whether the superheat, also about a tenth, is enough to fuse the faces.

## Preheat must be even

A preheat that leaves part of the joint colder than the rest leaves that part short of fusion. On a large section like the crusher member, the risks are obvious: the bottom of the joint, furthest from the burners and closest to the cold pit below, tends to lag, and the corners of a rectangular section heat faster than the middle of the faces. The far side of a wide section, shielded from the flame, can be several hundred degrees cooler than the near side.

The contractor therefore heats through the mould, with burners directed into the cavity through the riser and through preheat openings, so that the heat reaches the faces themselves rather than only the outside of the member, and checks the temperature at several points before firing. Colour is a poor guide to temperature: the same steel looks redder in shade than in sunlight, and the eye is easily misled. Contact thermometers, temperature-indicating crayons on the outside of the member and an infra-red thermometer used with care on the faces give better information, and the procedure states where and how temperatures are checked.

```figure
type: checklist
title: Preheat checks before firing the crusher-frame weld
caption: This is an illustration of planning items. The contractor's approved procedure sets the temperature, method and check points.
- x Temperature measured at several points | both faces, top and bottom, near and far side
- x Bottom of the joint at temperature | the most likely place to lag
- x Mould and luting dry | no steam from the riser or seams
- x Burners removed and openings closed | immediately before firing
- *? Time between end of preheat and firing | kept short so the faces do not cool
```

## Preheat in the early days

The early practitioners preheated with whatever was at hand. Viall described gear and casting repairs preheated in forges and charcoal fires, with asbestos sheets used to hold in the heat, materials that would not be used today. Viall's thermit preheaters burnt gasoline with compressed air; later practice moved to oxy-acetylene, propane and other fuel gases, which are cleaner and easier to control, and which do not deposit carbon in the mould the way a badly adjusted liquid-fuel burner could. The plastic method for pipes, described in Chapter 1, did without separate preheating: the slag, poured first, coated the pipe ends and the iron that followed heated them to welding temperature before they were pressed together. For fusion welds of heavy sections, though, both Viall and Hart treated preheat as essential, and Viall's warning about chilled thermit and imperfect welds is the same point this chapter makes with numbers.

Viall's instructions for a heavy weld show how much of the modern practice was already in place by 1921. The preheater's burner was set to point into the mould, so that the heat reached the faces of the joint. Its gasoline and air were started gently and increased as the mould warmed, so as not to crack or wash the mould. And when the joint was at heat, the preheater was quickly removed and directed down the riser, or down the pouring gate if the riser was awkward to reach, to clear out any loose sand or debris in the mould before it was plugged and the charge fired. Each of those steps has a direct modern equivalent: heat delivered to the faces, a mould that survives its own preheat, and a clean cavity with the shortest possible delay before firing.

## Gas supply on site

A 100 kW preheat burns propane at about 100 ÷ 46.3 ≈ 2.2 g per second, about 7.8 kg an hour. A single propane cylinder cannot always supply gas that fast. Propane leaves a cylinder by boiling, and the boiling cools the liquid; at high withdrawal rates, and in cold weather, the pressure falls and the burners lose power just when the preheat needs it. The same limit on withdrawal from fuel gas cylinders is worked through for oxy-fuel equipment in [Oxy-Fuel by the Numbers](/reados/publications/oxy-fuel-by-the-numbers/cylinders-contents-and-withdrawal/). Contractors running large preheats use several cylinders manifolded together, or a larger supply, sized from the supplier's withdrawal data for the expected temperature. For the crusher job on a winter morning, the engineer asked the contractor to confirm the gas supply would sustain the burners for the full preheat.

## The effect on the parent steel

Heating 300 mm of a cast steel member to 900 °C is a heat treatment in itself. The heated zone passes through the temperature range in which the steel's structure transforms, and how it cools afterwards affects its hardness and toughness. A large weld cools slowly, because the mass of hot metal and the mould insulate it, which is generally favourable for avoiding hard, brittle zones. But a cast steel with a high carbon equivalent, as [Weldability by the Numbers](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/) explains, may still need controlled cooling, for example under insulating blankets, or a post-weld heat treatment. The engineer asked for the frame's material grade from the crusher manufacturer so that the contractor and a metallurgist could decide whether the procedure needed controlled cooling.

## The time between preheat and pour

The faces start cooling the moment the burners are removed, and they cool fastest exactly where fusion matters most. A hot steel surface at 900 °C loses heat rapidly by radiation, and a thin face layer cools faster than the bulk behind it. The procedure therefore keeps the interval between removing the burners and firing the charge as short as practicable, with the crucible already in place, the portion loaded and the igniter ready, so that the only step left is to close the preheat openings and ignite. Rehearsing the sequence before the burners are lit, with every person knowing their step, is the simplest way to keep that interval short.

## A failure: the cold bottom face

This is an illustration. Among the contractor's records was a heavy weld on a cast steel dragline component in which ultrasonic testing after the repair found a band of lack of fusion along the bottom of one face, about 20 mm deep. The rest of the joint was sound.

The preheat records showed that the temperature had been checked at the top and sides of the joint but not underneath, where access was awkward. The burners had been directed down through the riser, and the bottom of the joint, in the lee of the section and close to cold ground, had probably reached only a few hundred degrees. When the iron arrived at the bottom of the gap, first and already cooled by the runner, it did not have enough superheat to melt that face.

The weld was cut out and repeated with burners directed into the bottom of the mould through dedicated openings and with the bottom temperature checked before firing. The contractor's procedure was changed to require temperatures to be measured at the bottom of every heavy joint. For the crusher frame, which sits over the cold, damp crusher pit, the engineer made the bottom temperature a hold point: the weld does not proceed until it has been measured and recorded.

## Exercise: a lower preheat

The contractor considers preheating the crusher member to 700 °C instead of 900 °C to save time. Using the same assumptions, calculate the heat stored in the 70.6 kg of steel, the propane needed at 25% efficiency, and the heat needed to melt a kilogram of the face from 700 °C. Compare the last figure with the 760 kJ needed from 900 °C.

The stored heat is 70.6 × 0.65 × 675 ≈ **31 MJ**, and the propane about 31 ÷ (0.25 × 46.3) ≈ **2.7 kg**, saving about 0.8 kg of gas and a few minutes. Melting a kilogram of the face from 700 °C takes about 0.80 × 810 + 270 ≈ **920 kJ**, about 21% more than the 760 kJ from 900 °C.

The saving in gas and time is small; the extra demand on the iron's superheat falls exactly where the margin is thinnest, at the faces. The engineer would accept a lower preheat only if the supplier's procedure specified it for this joint, not as a way of saving time.
