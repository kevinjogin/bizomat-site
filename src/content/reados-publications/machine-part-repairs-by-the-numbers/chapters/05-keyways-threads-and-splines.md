---
book: machine-part-repairs-by-the-numbers
chapterSlug: keyways-threads-and-splines
order: 5
title: "Keyways, threads and splines"
description: "Repair worn keyways, threads and splines: check a key's shear and crushing stresses, choose between an oversize key, a new keyway and weld filling, and decide when a thread or spline can be restored."
draft: false
---

Keys, threads and splines are where a shaft hands its torque and its axial loads to the parts on it, and they wear and fail in their own ways. A key that has worked loose hammers its keyway wider with every start and stop; a thread that has been overtightened or cross-threaded strips; a spline that has run without lubrication wears its teeth thin. Dunham listed destroyed threads on axles among the worn parts a welder could build up and restore, along with scored shafts and worn cams. Some of these repairs are straightforward; others, on parts that carry high stresses or are safety-critical, should not be made.

This chapter checks the stresses in a key, compares the ways of repairing a worn keyway, and sets out when worn threads and splines can be restored and when the part should be replaced.

## What a key does

A parallel key sits half in a keyway in the shaft and half in a keyway in the hub, and transmits the torque by being pushed sideways between them. It is loaded in two ways: in **shear**, across its width at the joint between shaft and hub, and in **crushing** or bearing, on the sides of the key pressed against the keyway walls. For a key of width w, height h and length L in a shaft of diameter d carrying a torque T, the force at the shaft surface is about 2T ÷ d, and the stresses are approximately:

- shear: τ = 2T ÷ (d × w × L);
- crushing on the half-height in the shaft or hub: σ = 4T ÷ (d × h × L).

```figure
type: formula
title: Stresses in the key of the harvester gearbox output shaft
formula: τ = 2T ÷ (d × w × L), σ_crush = 4T ÷ (d × h × L)
caption: This is an illustration with the 800 N·m torque from Chapter 3 and a 14 mm × 9 mm key, a common size for a shaft of about 50 mm. Real key sizes and allowable stresses come from the key standard and the design.
- T | 800 N·m
- d | 50 mm
- w × h × L | 14 mm × 9 mm × 40 mm
step: τ = 2 × 800 ÷ (0.050 × 0.014 × 0.040) ≈ 57 MPa
step: σ_crush = 4 × 800 ÷ (0.050 × 0.009 × 0.040) ≈ 178 MPa
```

The crushing stress is usually the higher of the two, which is why keyways wear and widen at their sides rather than keys shearing across. A key that is loose in its keyway, even slightly, is hammered against the walls at every change of torque, multiplying the effective crushing stress and wearing the keyway into a bell mouth.

## Why keyways wear

Keyway wear almost always starts with looseness: a key that was a loose fit to begin with, a hub that was not clamped or held axially, a set screw that backed off, or a taper bush that was not fully tightened, as on the auger in Chapter 2. Once there is clearance, the key rocks and the hub moves on the shaft, and fretting and impact enlarge the keyway quickly. A repair that restores the keyway without fixing the looseness will wear again. The repairer therefore looks at the hub, its fastening and its bore as carefully as at the keyway itself, and asks how long the machine ran with a knock or rattle before it was stopped.

## Repairing a worn keyway

There are four common ways to repair a worn keyway in a shaft.

```figure
type: compare
title: Ways to repair a worn shaft keyway
cols: How | Strengths | Limits
caption: General characteristics. The choice depends on the shaft's stress, its material, the hub and whether the shaft's position in the machine allows a new keyway.
- Oversize key | widen the keyway to the next standard key width; fit a stepped or oversize key | quick; no heat | needs a matching hub keyway or a stepped key; reduces the shaft section
- *New keyway | cut a new keyway at 90° or 180° to the old; leave the old one empty | no welding; original key size | the old keyway remains a stress raiser; hub keyway must be recut or a new hub fitted
- Weld fill and recut | fill the worn keyway by welding, machine round, cut a new keyway | restores the original | heat and distortion; risk of cracking in hardenable steels; not for highly stressed shafts
- New shaft | replace | restores the design fully | cost and lead time
```

Cutting a new keyway at 90° or 180° to the old one is often the best compromise for a shaft of modest stress: it uses the standard key, avoids welding heat, and leaves the shaft's section only slightly more reduced than before. The old keyway remains, and its end is a stress raiser, so the new keyway's ends should not coincide with it along the shaft, and both ends should be well away from shoulders. The hub needs a matching new keyway, or a new hub.

## Weld filling keyways

Filling a worn keyway with weld metal and cutting a new one in the same place restores the shaft's appearance and its original key size, which is why it is tempting. It is also one of the riskier shaft repairs. The weld fills a slot with stiff walls, so shrinkage stresses are high; the weld is at the surface, where bending and torsion stresses are greatest; and on a medium-carbon or alloy shaft, the heat-affected zone along the keyway walls hardens and can crack, exactly where the new keyway's corners will concentrate stress. Where the shaft is lightly loaded, of a readily weldable steel, and the procedure includes proper preheat and slow cooling (Chapter 4), it can work. On highly stressed shafts, it is better avoided, and the maker's advice or a new shaft is the safer choice.

## Key length and the oversize option

If the original key is too short for the torque, as a repeated keyway failure may suggest, a longer key spreads the load over more length and lowers both stresses in proportion. In the illustration above, shortening the key from 40 mm to 30 mm would raise the crushing stress from about 178 MPa to about 237 MPa; lengthening it to 50 mm would lower it to about 142 MPa. A wider key reduces the crushing stress less than its width suggests, because the crushing depends on the key's height, but it does reduce the shear and spreads the load. The hub length usually limits the key length. Two keys at 180° can also share a heavy load, if both are fitted accurately.

## Fitting a key properly

Many keyway failures begin at assembly. A key should be a close fit in both keyways on its sides, where the load is carried, with a small clearance on its top in a parallel-key joint; it should be deburred, so that it seats fully; and its length should not run past the end of the hub, where the hub's support ends and the key can rock. The hub must be held axially, by a shoulder and a nut, a circlip, a set screw on the key or a locking device, so that it cannot walk along the shaft. Torque-transmitting joints that see frequent reversals or shocks, such as those on crushers and some agricultural drives, often use a light interference fit of the hub on the shaft as well as the key, so that the key locates the hub and the fit carries much of the torque. A repairer who restores a keyway and then refits the key loosely has repaired nothing.

## Keyway position and shaft section

A keyway removes metal from the shaft, and a second keyway removes more. For a shaft of 50 mm with a keyway about 5.5 mm deep, the section lost at the keyway is a small fraction of the whole, and the shaft's resistance to bending and torsion falls by somewhat more than that fraction, because the metal removed is at the surface where it does the most work. Adding a second keyway at 180° roughly doubles the loss, and at 90° adds a little less. The main effect, though, is not the lost section but the stress concentration at the keyway's ends and bottom corners, which is why both keyways should have properly radiused bottom corners, as the key standards specify, and why their ends should be kept apart along the shaft.

## Tapers and their keys

Some shafts carry hubs on tapers, with or without keys. A worn or damaged taper is a precision surface that should be reground to the correct angle, not built up by welding, and the hub's taper must match it closely, checked by blueing the two together. A key in a tapered joint locates the hub but should not carry the torque; if the taper is not pulled up tight, the key will be overloaded and the taper will fret. Tapered joints therefore depend on the nut or bolt that pulls them together being tightened to the maker's figure and locked.

## Threads

Worn or damaged threads on shafts and studs are common, and the right repair depends on the load the thread carries. Lightly loaded threads, such as those holding a cover or a guard, can often be chased with a die or tap to clean them up, or recut to a smaller standard size with a matching nut or bolt. Damaged internal threads in housings can be repaired with thread inserts, which restore the original size with a hardened insert in an enlarged, retapped hole. The Library covers thread forms and strength in [Choosing fasteners and threads](/reados/collections/machine-elements-and-mechanical-design/choosing-fasteners-and-threads/).

Building up a thread by welding and recutting it, as Dunham described for axles, is a different matter. The thread root is a severe stress raiser, and a weld at the root of a thread that carries a large axial load, such as a wheel bearing nut on an axle, puts the hard, possibly defective heat-affected zone exactly where the fatigue stress is highest. For load-carrying threads on axles, steering parts and other safety-critical components, the part should be replaced, not built up. For lightly loaded threads on non-critical parts, weld build-up and recutting can be acceptable with a sound procedure.

## Splines

Splines carry torque through many teeth, and when they wear, they wear together. A worn external spline on a shaft can sometimes be restored by building up and recutting, but recutting a spline needs the right tooling, often a hob or a shaper cutter, and an accurate set-up, which many repair shops do not have. More often, worn splines are dealt with by replacing the part, or, for a shaft with a worn spline at one end and good material elsewhere, by machining off the splined end and fitting a new splined section, a repair that needs careful design of the joint. A worn spline also usually means a worn mating spline, so both parts must be inspected and usually replaced together.

## The running case: the gearbox keyway

This is an illustration. Alongside the harvester shaft's journal, the repairer found the output gear's keyway in the shaft worn about 0.5 mm oversize on its driving side, with fretting marks round the gear's bore. The gear had been held axially by a circlip that had lost its tension, letting the gear move slightly on the shaft. The repairer judged the shaft's stress at the keyway moderate, the shaft medium-carbon steel, and the season's need urgent.

The choice was a new keyway at 180° to the old one, cut in the lathe with the shaft already set up for the journal build-up, with its ends offset from the old keyway's ends, and a matching new keyway broached in the gear's bore. A new key of the original size, fitted with a light interference, and a new circlip completed the repair. No welding went near the keyway.

## Hubs and bores

The hub's half of the joint matters too. A hub bore that has been fretted or worn oval will not hold the key tightly, however good the shaft's keyway. A worn bore can be bored out and bushed, or the hub replaced, and its keyway broached or cut to match. A hub held by a taper bush or a locking assembly needs the bush tightened to the maker's torque, checked after the first hours of running, and rechecked at service intervals.

## A failure: the filled keyway

This is an illustration. A local workshop had filled a worn keyway in a stone crusher's countershaft by welding, cut a new keyway in the same place, and returned the shaft. It broke at the keyway within a month. The fracture showed a fatigue crack starting at the bottom corner of the new keyway, in the hard heat-affected zone of the weld filling, which had cracked along one wall of the old keyway as it cooled. The countershaft was an alloy steel, heavily loaded, and had been welded without preheat.

A new keyway at 90° to the old one, on a shaft of that size, would have reduced the section by only a few per cent and avoided the heat altogether; given the load, a new shaft would have been better still.

## Exercise: a longer key

A pulley on a 40 mm shaft carries 500 N·m with a 12 mm × 8 mm key, 32 mm long. Calculate the shear and crushing stresses. If the hub allows a 45 mm key, what are the new stresses?

With the 32 mm key, τ = 2 × 500 ÷ (0.040 × 0.012 × 0.032) ≈ **65 MPa** and σ_crush = 4 × 500 ÷ (0.040 × 0.008 × 0.032) ≈ **195 MPa**.

With a 45 mm key, the stresses fall in proportion to the length: τ ≈ 65 × 32 ÷ 45 ≈ **46 MPa** and σ_crush ≈ 195 × 32 ÷ 45 ≈ **139 MPa**. The longer key cuts the crushing stress by about 29%, which, together with a tight fit and a hub held firmly, should stop the keyway wearing again.
