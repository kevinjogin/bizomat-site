---
book: polymer-chains-by-the-numbers
chapterSlug: crystals-diluents-and-melting
order: 9
title: "Crystals, diluents and melting-point depression"
description: "Use Flory's equation to find how far a solvent or plasticiser lowers the melting point of a semicrystalline polymer, judge solvent containers and hot dissolution, and see why crystals resist solvents."
draft: false
---

Polystyrene, the workshop's main resin, is amorphous: its chains are frozen in random coils with no regular order, and a good solvent can reach every one of them. Many other plastics are semicrystalline. Polyethylene, polypropylene, nylon, acetal and PET all contain regions where chains have folded into ordered crystals, held together by many close contacts, alongside amorphous regions between them. A solvent can swell the amorphous regions at room temperature, but it cannot dissolve the polymer until the crystals melt, and a liquid that dissolves the same polymer's melt readily may leave the solid almost untouched.

How far a liquid lowers the melting point of a polymer's crystals is given by an equation Flory derived from the same lattice ideas as Chapter 7. This chapter applies it to the workshop's polyethylene solvent containers and to a proposal to dissolve polyethylene residues with hot solvent, and ends with a Hansen screen that predicted, wrongly, that the containers would dissolve.

## Why crystals resist liquids

A polymer crystal is held together by many contacts between neatly packed chain segments. To dissolve it, a liquid must supply enough freedom to make the disordered, solvated state more favourable than the crystal. At room temperature, far below the crystal's melting point, the order is so strongly favoured that even a liquid closely matched to the polymer cannot pull chains out of the crystals. It can only swell the amorphous regions between them, which is why a semicrystalline plastic in a good solvent gains weight and softens slightly instead of dissolving.

As the temperature rises towards the melting point, the balance shifts. A liquid absorbed into the polymer lowers its melting point, because it adds to the entropy of the melt but cannot enter the crystals. At some temperature below the pure polymer's melting point, the crystals in contact with the liquid can no longer survive, and the polymer dissolves. That temperature is what Flory's equation estimates.

Laboratories that need polyethylene in solution meet this directly. Size-exclusion chromatography of polyolefins, the technique of Chapter 2, is run at high temperature, typically well above 100 °C in a chlorinated aromatic solvent, precisely because the crystals will not dissolve at room temperature in any solvent. Intrinsic viscosity of polyethylene and polypropylene is likewise measured hot. For a moulder, the same fact is the reason polyolefin parts are so resistant to cleaners and fuels that would destroy polystyrene: their crystals act as a network of physical crosslinks that a room-temperature liquid can swell between but not break.

## Flory's equation

For a polymer of high molar mass with a diluent that is excluded from its crystals, Flory showed that the melting temperature T_m falls below the pure polymer's equilibrium melting temperature T_m⁰ according to

1 ÷ T_m − 1 ÷ T_m⁰ = (R ÷ ΔH_u) × (V_u ÷ V₁) × (φ₁ − χ φ₁²),

with temperatures in kelvin. Here ΔH_u is the heat of fusion per mole of repeat unit, V_u and V₁ are the molar volumes of the repeat unit and the diluent, φ₁ is the diluent's volume fraction and χ is the interaction parameter of Chapter 7. A good diluent, with small χ, lowers the melting point more than a poor one, and a small, compact diluent molecule more than a large one.

```figure
type: formula
title: Flory's melting-point depression
formula: 1 ÷ T_m − 1 ÷ T_m⁰ = (R ÷ ΔH_u) × (V_u ÷ V₁) × (φ₁ − χ φ₁²)
caption: Temperatures in kelvin. Assumes chains of high molar mass, a diluent excluded from the crystals and χ independent of concentration. Teaching values for high-density polyethylene and d-limonene.
- T_m⁰ | equilibrium melting temperature of the pure polymer, 145 °C (teaching value)
- ΔH_u | heat of fusion per repeat unit, 8,200 J/mol per –CH₂CH₂– unit (teaching value)
- V_u | repeat unit molar volume, 28.05 ÷ 0.85 = 33.0 cm³/mol
- V₁ | diluent molar volume, 136.24 ÷ 0.84 = 162 cm³/mol for d-limonene
- χ | polymer–diluent interaction parameter, 0.35 (teaching value)
step: 10% limonene by mass is 10.1% by volume
step: Melting temperature falls from 145 °C to 141.5 °C
step: At 95% limonene, the liquidus is 123.3 °C
```

The equilibrium melting temperature T_m⁰ is not the peak of a melting curve measured on a moulded part. Real crystals are thin lamellae, a few to a few tens of nanometres thick, and thin crystals melt below the equilibrium value of an infinitely thick one. A differential scanning calorimeter shows the melting peak of the actual crystals, usually some degrees below T_m⁰. Both values have uses, as the worked case shows.

## The workshop's containers

This is an illustration. The workshop keeps its cement solvents, including d-limonene, in high-density polyethylene (HDPE) containers in a shed that reaches 40 °C in summer. The question is whether the containers' crystals could be threatened by the liquid they hold.

The [polymer melting or dissolution temperature tool](/tools/polymer-melting-point-depression/) applies Flory's equation. From the pure polymer's melting temperature, its heat of fusion and repeat-unit molar volume, its amorphous density, the diluent's molar volume, density and mass share, and χ, it calculates the diluent's volume fraction, the depressed melting temperature, the depression in kelvin and the margin against a process temperature at which the crystals must melt or a service temperature at which they must survive, with a table of melting temperature against diluent content. It also warns when χ is 0.5 or more, where melt and diluent can separate as two liquids.

With the teaching values above and a generous allowance of 10% limonene absorbed by mass, the tool gives a volume fraction of 10.1%, a melting temperature of **141.5 °C**, a depression of only 3.5 K, and a margin of **101.5 K** above the 40 °C service temperature: the crystals survive comfortably. Its table shows how the melting temperature falls as the diluent share rises.

```figure
type: compare
title: Melting temperature of HDPE crystals against limonene content
rowhead: Limonene by mass
cols: By volume | Melting (liquidus) temperature | Depression
caption: From the polymer melting or dissolution temperature tool with teaching values: T_m⁰ 145 °C, ΔH_u 8,200 J/mol, V_u 33.0 cm³/mol, V₁ 162 cm³/mol, χ 0.35. The last row is close to the temperature at which HDPE would dissolve in a large excess of limonene.
- 0% | 0% | 145.0 °C | 0 K
- * 10% | 10.1% | 141.5 °C | 3.5 K
- 30% | 30.2% | 135.5 °C | 9.5 K
- 50% | 50.3% | 130.6 °C | 14.4 K
- 70% | 70.2% | 126.7 °C | 18.3 K
- 90% | 90.1% | 123.8 °C | 21.2 K
- 95% | 95.1% | 123.3 °C | 21.7 K
```

The containers are not entirely unaffected. Their amorphous regions absorb some limonene, which softens them slightly, and limonene can permeate through the container wall over time, losing solvent and releasing vapour into the shed. Those effects are matters for the container maker's chemical compatibility data and for the storage rules that apply to flammable liquids, not for Flory's equation. What the equation settles is that the containers will not dissolve or lose their crystalline strength at any temperature the shed will reach.

## Where the absorbed liquid goes

The 10% limonene assumed above needs a word of explanation, because a container that gained 10% of its own mass in solvent would be badly swollen. The equation's diluent fraction refers to the liquid mixed with the polymer's amorphous material, not to the whole part. Liquid cannot enter the crystals, so everything a semicrystalline part absorbs is concentrated in its amorphous regions.

This is an illustration. Suppose an HDPE container wall is 70% crystalline by mass, a teaching value of the right order for high-density polyethylene, and a soak test shows it gaining 3 g of limonene per 100 g of polymer at equilibrium. All 3 g sit in the 30 g of amorphous polymer, so the amorphous material contains 3 ÷ (30 + 3) = **9.1%** limonene by mass. That is close to the 10% used in the tool. The crystals border amorphous regions with that much diluent in them, and it is those crystal surfaces that the equation describes. Taking the whole-part figure of 3% would have understated the depression by about two-thirds, though here the margin is so large that the conclusion would not change.

## Measuring the effect

Two simple tests confirm what the equation predicts. A soak test, in which weighed strips of the container wall are immersed in the liquid at the highest service temperature and weighed at intervals until their mass stops changing, gives the equilibrium uptake and how long it takes to reach it. Strips that keep gaining mass, crack, or lose mass after a few days are a warning that something other than simple swelling is happening, such as extraction of additives or stress cracking.

A differential scanning calorimeter, available at most polymer testing laboratories, measures the melting peak of a strip before and after soaking. The soaked strip's peak is lowered by roughly the depression the equation predicts for its absorbed diluent, and the area under the peak shows whether the crystallinity has changed. For the containers, a depression of a few kelvin and an unchanged crystallinity would confirm that the liquid swells the amorphous regions only. A large fall in peak temperature or in crystallinity would mean the liquid is attacking the crystals, and the containers should be replaced with a more resistant material.

## Could hot solvent dissolve polyethylene residue?

The workshop also moulds a few polyethylene parts, and lumps of polyethylene purge occasionally foul its granulator. A suggestion was made to dissolve them by soaking the granulator parts in hot limonene at 110 °C.

The tool's melt case answers it. At 95% limonene by mass, roughly a small lump in a large bath, the liquidus is 123.3 °C. At 110 °C the process temperature is **13.3 K below** the temperature at which the crystals would melt into the liquid, so the lumps would swell but not dissolve. Using the DSC melting peak of the actual purge, a teaching value of 131 °C, in place of the equilibrium value gives a liquidus of 110.7 °C, so thin, imperfect crystals might just begin to dissolve at 110 °C. The real answer lies between the two estimates, and neither gives a workable process.

The decisive point, though, is not in the equation. Limonene's flash point is far below 110 °C, so heating it to that temperature in an open bath would create a serious fire hazard. The proposal was rejected, and purge lumps are removed mechanically with the granulator isolated and locked out. A calculation that shows a process will not work is a good result; one that shows it might work does not make it safe.

## The error: a Hansen screen applied to a crystalline polymer

This is an illustration. When the cement changed to the ethyl acetate and limonene blend, a new engineer screened the HDPE containers against it with the solvent attack and swelling tool of Chapter 8. Using teaching parameters for polyethylene of 17.1, 0 and 2.0 MPa½ with an interaction radius of 6.0, the screen gave a RED of **0.49** for limonene and **0.88** for the 50:50 blend, both inside the sphere, with the verdict "likely to dissolve or swell the part". The engineer recommended replacing every container with steel cans, at considerable cost.

The supervisor pointed out that HDPE containers are widely used for hydrocarbon and terpene solvents, and that the tool's own standing note says crystalline polymers resist liquids that dissolve their amorphous form. Flory's equation showed why: the crystals of HDPE cannot dissolve in limonene below about 123 °C, more than 80 K above the shed's highest temperature. The Hansen screen had correctly said that limonene is a good solvent for polyethylene's amorphous form, which is why it swells the containers slightly and permeates them. It had said nothing about the crystals, which hold the containers together.

```figure
type: compare
title: Two screens of HDPE against the cement solvents
rowhead: Question
cols: Hansen screen | Flory melting-point equation | What it means for the containers
caption: Teaching values. The Hansen screen judges the liquid against the amorphous polymer; Flory's equation judges the crystals. For a semicrystalline container both are needed, along with the container maker's compatibility data.
- Is limonene a solvent for polyethylene? | yes, RED 0.49 | — | swelling and permeation expected
- Can the crystals dissolve at 40 °C? | not addressed | no; liquidus about 123 °C | containers keep their strength
- * Overall | inside the sphere | 80 K or more of margin | keep HDPE; follow maker's data and storage rules
```

The steel cans were not bought. The workshop instead checked the container maker's chemical resistance data for limonene and ethyl acetate, confirmed the containers were rated for them, and added a rule to replace solvent containers on a fixed schedule because of slow permeation and swelling. The screening procedure now says: for a semicrystalline plastic, use the Hansen screen for swelling and the melting-point equation for dissolution, and rely on the maker's data for the final decision.

## Plasticisers and other diluents

The same equation describes plasticisers in semicrystalline polymers. A plasticiser is a diluent of high boiling point that stays in the polymer permanently. In a semicrystalline polymer it lowers the melting point and the crystallinity, making the material softer and more flexible, and its effect can be estimated in the same way, with its own molar volume and χ. A diluent with χ near or above 0.5, which the tool flags, is a poor plasticiser: it may separate from the polymer as droplets and weep to the surface over time, a defect called blooming or exudation. The tool's warning is the same Flory–Huggins limit that governed the cement's cloud point in Chapter 7.

## How this applies to a small Australian business

Semicrystalline plastics are the most common containers, liners and tanks for liquids, and their resistance depends on two separate things: how much the liquid swells their amorphous regions, and whether it can melt their crystals at the service temperature. A solubility screen answers the first and Flory's equation the second. Neither replaces the maker's chemical resistance data, the storage rules for the liquid, or a soak test at the worst service temperature, but together they explain the data and stop a correct screen from being read as a wrong conclusion.

## Exercise: a hotter shed

If the shed could reach 60 °C in a heatwave, and the HDPE containers absorbed up to 20% limonene by mass at that temperature, would their crystals survive with the workshop's required margin of 20 K? Use the tool's table, which gives the melting temperature at 20% limonene by mass.

**Worked answer.** At 20% limonene by mass, the table gives a melting temperature of **138.3 °C**. The margin above 60 °C is 138.3 − 60 = **78.3 K**, far more than the 20 K required, so the crystals survive. The practical concerns at 60 °C are faster permeation and higher vapour pressure in the shed, not dissolution of the containers.
