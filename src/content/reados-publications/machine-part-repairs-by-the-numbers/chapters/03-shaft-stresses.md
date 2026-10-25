---
book: machine-part-repairs-by-the-numbers
chapterSlug: shaft-stresses
order: 3
title: "Shaft stresses and what a repair does to them"
description: "Calculate the bending and torsion stresses in a shaft, see why stress rises with the cube of a smaller diameter, and compare regrinding undersize, sleeving and weld build-up for a worn journal."
draft: false
---

A shaft carries torque from one part of a machine to another, and usually bending as well, from the pull of belts and chains, the weight of pulleys and gears, and the forces in the gears themselves. Its diameter was chosen by its designer so that the resulting stresses, especially at the shoulders, keyways and other places where stress concentrates, stay below what the steel can survive for millions of cycles. Every repair changes the shaft's diameter, surface or material somewhere, and so changes those stresses. A repairer who knows how much can choose between repair methods with numbers rather than habit.

This chapter sets out the basic formulas for shaft stresses, shows why a small reduction in diameter has a large effect, and compares three ways of restoring the harvester gearbox shaft's worn journal from Chapter 1: regrinding it undersize, fitting a sleeve, and building it up by welding.

## Torsion and bending

For a solid round shaft of diameter d, the maximum shear stress from a torque T is at the surface:

τ = 16 T ÷ (π d³)

and the maximum bending stress from a bending moment M, also at the surface, is:

σ = 32 M ÷ (π d³)

Both depend on the cube of the diameter. When a shaft carries both, as most do, their combined effect is often judged with the von Mises equivalent stress, σₑ = √(σ² + 3τ²), which is compared with the strength of the steel. In a rotating shaft, the bending stress reverses every revolution, which is what drives the fatigue failures described in Chapter 2.

```figure
type: formula
title: Stresses at the harvester shaft's bearing journal
formula: τ = 16T ÷ (πd³), σ = 32M ÷ (πd³), σₑ = √(σ² + 3τ²)
caption: This is an illustration, with a torque and bending moment chosen for teaching. A real shaft's loads come from the machine's power, speed and layout, and its design checks include stress concentration and fatigue.
- d, journal diameter | 50 mm
- T, torque | 800 N·m
- M, bending moment at the journal | 400 N·m
step: τ = 16 × 800 ÷ (π × 0.050³) ≈ 32.6 MPa
step: σ = 32 × 400 ÷ (π × 0.050³) ≈ 32.6 MPa
step: σₑ = √(32.6² + 3 × 32.6²) ≈ 65.2 MPa
```

## The cube of the diameter

Because both stresses depend on 1 ÷ d³, the stress rises steeply as the diameter falls. A shaft whose diameter is reduced by a fraction carries stresses increased by the cube of the ratio of the old diameter to the new.

```figure
type: bars
title: Rise in shaft stress as the journal diameter is reduced from 50 mm
unit: % increase in stress for the same loads
max: 100
caption: Calculated from the ratio (50 ÷ d)³. Small reductions matter: 2% off the diameter adds about 6% to the stress, and 12% off adds nearly half.
- 49.2 mm, as worn | 5.0
- 49.0 mm, reground undersize | 6.2
- 46.0 mm | 28.4
- *44.0 mm, machined for a 3 mm sleeve | 46.7
- 40.0 mm | 95.3
```

That steepness is the key to choosing a repair. Removing a little metal, as in regrinding, adds a modest amount of stress; removing a lot, as in machining a shaft down to take a thick sleeve, can raise the stress in the remaining core by half or more, unless the sleeve itself carries part of the load.

## Stress concentration

The formulas give the nominal stress, the stress in a plain shaft. Where the shaft changes diameter, has a keyway, a groove, a cross-hole, or a weld, the stress is locally higher, by a stress concentration factor that depends on the geometry: the sharper the change, the higher the factor. Design handbooks give factors for standard features, such as the ratio of the fillet radius at a shoulder to the shaft diameter. For a repairer, the practical lessons are to keep or restore generous fillet radii at shoulders, never to leave a sharp corner where the original had a radius, to blend the ends of weld build-up smoothly into the shaft, and to remember that the keyway ends, shoulders and the edges of any repair are where the next fatigue crack will most likely start.

## Fatigue strength, not just strength

The stresses in this chapter are far below the tensile strength of any shaft steel, typically several hundred megapascals, yet shafts break at them. The reason is fatigue. A steel's fatigue strength in reversed bending, the stress it can survive for very many cycles, is a fraction of its tensile strength, and that fraction falls further with a rough surface, a corrosive environment, a stress concentration and a large section. A shaft is therefore designed against its fatigue strength at its worst feature, with a margin, not against its tensile strength. A repair that leaves a rough surface, a sharp step, a weld toe or a hard heat-affected zone reduces the fatigue strength at exactly the place where the stress is highest, and can turn a comfortable margin into none. That is why a repair that looks strong enough by the tensile numbers can still fail in weeks.

## Estimating the loads

The repairer rarely has the designer's calculations, but can often estimate the loads well enough to compare repair options. The torque follows from the power and speed: T = P ÷ ω, where ω is the angular speed in radians per second. This is an illustration. A shaft carrying 50 kW at 600 rev/min turns at about 600 × 2π ÷ 60 ≈ 62.8 rad/s, so the torque is about 50,000 ÷ 62.8 ≈ **800 N·m**, the value used above. The bending comes from the forces of belts, chains and gears and the distances between them and the bearings, which can be measured on the machine. The numbers need not be exact; they need to be good enough to show whether a repair that adds 6% to the stress or one that adds 47% is the safer choice.

## Comparing with the original

The most useful check is often a comparison rather than an absolute calculation. If the shaft ran for years at its original diameter without trouble, its stresses at that diameter were acceptable, whatever their exact value. A repair that keeps the stress within a few per cent of the original, with an equally good surface and no new stress raisers, is likely to last about as long; a repair that raises it substantially, or adds a stress raiser, is a step into the unknown. The cube law lets the repairer make that comparison from a single measurement, the new diameter, without knowing the loads at all.

## Option 1: regrind undersize

The harvester shaft's journal is worn to about 49.2 mm. One option is to regrind it round and true to 49.0 mm and fit a bearing with a correspondingly undersize bore, if one is available, or a bush or adapter to suit. The journal stress rises by about 6%, from about 65 MPa to about 69 MPa equivalent in this illustration, which a shaft designed with a normal margin will usually tolerate. The metal removed is small, the surface is the original heat-treated steel, and there is no welding. The difficulty is the bearing: standard rolling bearings come in standard bore sizes, so an undersize journal needs a special part, which may itself have a long lead time.

## Option 2: sleeve the journal

A second option is to machine the journal down and fit a sleeve, a short steel tube with an interference fit on the shaft, then grind the sleeve's outside to the original journal size. The sleeve restores the bearing size exactly, with a fresh surface. But the shaft under the sleeve must be machined down by twice the sleeve's wall thickness. This is an illustration. A 3 mm wall sleeve on a 50 mm journal leaves the shaft core at about 44 mm, and if the sleeve carries none of the bending or torsion, the core stress rises by about 47%, to about 96 MPa equivalent, and the ends of the sleeve add stress raisers of their own. A thin sleeve on a shaft with a generous margin is a good repair; a thick sleeve on a highly stressed shaft is not. READOS covers fits, including the interference fits that hold a sleeve, in [Specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/), and shaft design in [Shafts, couplings and alignment](/reados/collections/machine-elements-and-mechanical-design/shafts-couplings-and-alignment/).

## Option 3: build up by welding

The third option, the one Dunham described for crankshaft journals in 1917, is to build the worn journal up by welding and machine it back to the original size. It restores the diameter without reducing the core and needs no special bearing. Its risks are metallurgical rather than geometric: the weld metal and the heat-affected zone beneath it may be harder or softer than the shaft, may contain residual stresses, porosity or lack of fusion, and the ends of the build-up are stress raisers. On a shaft of steel that welds readily, with a suitable procedure, the build-up can be sound and durable; on a hardened, high-carbon or alloy shaft, it can crack. Chapter 4 explains how the build-up is planned.

```figure
type: compare
title: Three ways to restore the harvester shaft's worn journal
cols: Effect on stress | Main risk | Time and cost
caption: This is an illustration for the 50 mm journal. The choice depends on the shaft's material, its stress margin, the bearing available and the time.
- Regrind to 49.0 mm | about 6% higher at the journal | finding an undersize bearing | short, if the bearing exists
- Sleeve, 3 mm wall | up to about 47% higher in the core | sleeve ends; fit loosening | moderate
- *Weld build-up and remachine | nominal stress unchanged | hard zones, defects, cracking at the ends | about a day and a half
```

## Other ways to restore a journal

Regrinding, sleeving and welding are not the only methods. Thermal spraying deposits a coating of metal or ceramic onto a prepared surface, with little heat into the shaft, and suits worn bearing and seal seats on shafts where welding heat would be harmful, though the coating's bond is mechanical and it does not add strength. Hard chrome plating builds up thin layers on precision journals. Some repairers fit a bearing with a slightly larger bore, using a special sleeve or adhesive designed for retaining bearings on worn seats, for light wear. Each has its own limits, and specialist repairers offer them; the stress reasoning in this chapter applies to all of them, because each must leave the shaft with enough section and a good enough surface where the stress is highest.

## The repairer's choice

For the harvester shaft, an undersize bearing was not available in time, and the shaft's material, a medium-carbon steel that the maker's parts list identified, could be welded with preheat and a suitable filler. A thick sleeve would have raised the core stress too far for comfort on a shaft that already carried bending from the gear. The repairer chose weld build-up, with the procedure described in Chapter 4, and recommended the new shaft for the off-season, as Chapter 1 explained.

## Where the stress is

A shaft's stresses are not the same along its length. The bending moment varies, usually being largest under or near the gears and pulleys and smaller towards the bearings, and the torque is carried only between the parts that put it in and take it out. A worn bearing journal at the end of a shaft may carry little bending; a worn seat under a gear in the middle may carry the most. The repair method that suits one place may not suit another on the same shaft, so the repairer locates the repair on a sketch of the shaft's loads before choosing it. The sketch need only show the bearings, the parts that drive and are driven, the direction of their forces and the distances between them, and it takes a few minutes with a tape measure at the machine.

## Torsional stiffness

Repairs also change stiffness. A shaft machined down and sleeved, or built up with a different material, twists differently under torque, which can matter in drives with timing, such as gear trains and some agricultural mechanisms, and in shafts near their critical speed. For most repairs on most shafts the change is negligible, but a repairer working on high-speed shafts or on drives where timing matters should consider it.

## A failure: the thick sleeve

This is an illustration. Years earlier, the repairer had sleeved a worn seal journal on a hydraulic pump's drive shaft with a 4 mm wall sleeve, to restore the seal surface. The shaft broke within weeks, at the inner end of the sleeve, where the core had been reduced from 35 mm to 27 mm. The core stress had risen by about (35 ÷ 27)³ ≈ 2.2 times, and the sharp step at the end of the sleeve's seat had concentrated it further.

A thin-wall sleeve of the kind made specially for seal journals, needing almost no machining of the shaft, would have done the job. The lesson was to calculate the core stress before sleeving, and to prefer the repair that removes the least metal from a highly stressed section.

## Exercise: undersize or sleeve?

A 60 mm shaft journal is worn to 59.3 mm. The repairer can regrind to 59.0 mm or fit a sleeve with a 2.5 mm wall. Calculate the increase in stress for each, assuming the sleeve carries no load. Which would you choose if the shaft is highly stressed?

Regrinding to 59.0 mm increases the stress by (60 ÷ 59)³ − 1 ≈ **5.2%**. The sleeve needs the core machined to 60 − 2 × 2.5 = 55 mm, increasing the core stress by (60 ÷ 55)³ − 1 ≈ **29.8%**, plus the stress concentration at the sleeve's ends.

On a highly stressed shaft, regrinding is the safer choice, provided a bearing or bush for the 59.0 mm journal can be obtained. If it cannot, a thinner sleeve, a weld build-up with a qualified procedure, or a new shaft would be preferable to the 2.5 mm sleeve.
