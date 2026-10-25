---
book: machine-part-repairs-by-the-numbers
chapterSlug: gears-and-sprockets
order: 7
title: "Gears and sprockets"
description: "Decide whether a broken gear tooth can be rebuilt, estimate its root bending stress and what a defect there costs, restore the profile, and know when gears and sprockets are replaced in pairs."
draft: false
---

A gear with a broken tooth will usually still turn, with a knock every revolution, until the shock breaks another tooth or damages its mate. Replacing it is the clean answer, but gears for older machines can be slow to come, costly, or no longer made, and the repair welders of a century ago rebuilt teeth routinely. Dunham described the method in 1917: the broken tooth was not reused and no new one was made to fit; instead, filler was added a drop at a time to build up a new tooth, which was then filed or milled to shape. Campbell's manual of 1919 showed large cast-iron gear wheels, with faces about 10 inches wide, given new teeth in the same way.

Their method can still work, on the right gear. This chapter sets out which gears can be rebuilt and which cannot, estimates the bending stress in a tooth and how much a weld defect at its root matters, explains how the profile is restored, and covers sprockets and the rule that worn drive parts are replaced together. Gears by the Numbers covers gear geometry and strength in full; this chapter applies it to repair.

## Which gears can be repaired

The gear's material and heat treatment decide whether a tooth can be rebuilt at all.

```figure
type: compare
title: Gear types and the prospects for tooth repair by welding
cols: Typical use | Prospects for weld repair
caption: General guidance. The maker's material and heat treatment, the gear's speed and load, and the consequences of failure decide each case.
- Cast iron | large, slow mill, crane and old machinery gears | possible with cast-iron methods and preheat; brittle, crack-prone
- Plain carbon or low-alloy steel, not hardened | slow agricultural and general drives | often possible with preheat and a suitable filler
- *Through-hardened and tempered steel | general industrial gearboxes | difficult; heat alters the hardness; usually replace
- Case-hardened or nitrided steel | vehicle, high-speed and high-load gearboxes | not practical; the hard case is lost; replace
```

Case-hardened gears, with a hard skin over a tough core, cannot be satisfactorily rebuilt by welding in a repair shop: the weld destroys the case, and restoring it needs a controlled heat treatment of the whole gear, which distorts it. Dunham suggested hardening a rebuilt tooth by heating it nearly to melting and playing a strongly carburising flame over it; that may have added some surface hardness to a mild steel tooth on a slow car part, but it is not a controlled case-hardening process and is no substitute for one. For gears that carry high loads or run at speed, a rebuilt tooth is at best a temporary repair.

## The tooth as a cantilever

A gear tooth is loaded near its tip by the force from the mating tooth and bends like a short cantilever, with the highest bending stress at its root, where the fillet joins the gear's rim. The classical Lewis approach estimates that stress from the tangential force on the tooth, the face width, the module and a form factor that depends on the tooth's shape and number of teeth. Gears by the Numbers works through the method in its chapter on [tooth bending strength](/reados/publications/gears-by-the-numbers/tooth-bending-strength/).

```figure
type: formula
title: Bending stress at the root of the auger drive gear's teeth
formula: σ = F_t ÷ (b × m × Y), with F_t = 2T ÷ d
caption: This is an illustration using the simple Lewis form. The form factor of about 0.39 is an illustrative value for a gear of about 40 teeth; Gears by the Numbers explains how it is found, and modern rating methods add factors for dynamics, load sharing and fillet stress concentration.
- T, torque on the gear | 300 N·m
- d, pitch diameter: 40 teeth × 4 mm module | 160 mm
- b, face width | 30 mm
- Y, form factor | about 0.39
step: F_t = 2 × 300 ÷ 0.160 = 3,750 N
step: σ ≈ 3,750 ÷ (0.030 × 0.004 × 0.39) ≈ 80 MPa
```

## Why the root matters

The bending stress at the root depends on the square of the tooth's thickness there, because the tooth's resistance to bending, its section modulus, grows with the square of its thickness. A rebuilt tooth whose weld has a lack-of-fusion defect, porosity or a crack near the root has, in effect, a thinner root. If the effective root thickness is reduced by 10%, the bending stress rises by about 1 ÷ 0.9² − 1 ≈ **23%**; if by 20%, by about **56%**, before counting the stress concentration of the defect itself.

The root is also where the weld meets the rim, and where the heat-affected zone of the gear body lies. A tooth rebuilt on a gear that was not preheated enough can have a hard zone, or a crack, exactly at the root. Dunham explained the commonest failure in his day: most gear welding failures came from adding filler before the heavy section the tooth was attached to had reached fusion, so that the new tooth was not bonded and pulled away. His remedy, heating the gear in a fire while welding, is the same as the modern one: preheat the gear body, not just the tooth area, and fuse the new metal into the root properly.

## Contact stress and wear

Bending is not the only way gear teeth fail. The flanks of meshing teeth press against each other with very high local stresses, the contact or Hertzian stresses, and over many cycles they can pit, spall and wear. Gears by the Numbers explains contact stress in its chapter on [surface contact stress](/reados/publications/gears-by-the-numbers/surface-contact-stress/). For a repair, contact stress matters in two ways. A rebuilt tooth whose weld metal is softer than the original teeth will wear faster and may pit, so the filler and its hardness are chosen to match the gear as nearly as possible. And a tooth whose profile is slightly wrong carries its load on a smaller area, near its tip or root, raising the contact stress there; an inaccurate hand-finished profile is a source of early pitting as well as noise.

## Why gears break

Like shafts, gear teeth break either by fatigue or by overload, and the fracture tells which. A tooth broken by fatigue shows beach marks spreading from an origin at the root fillet, often on the loaded side, and typically fails after long service; a tooth broken by overload, from a jam or a foreign object, shows a rough fracture over its whole section, and often several adjacent teeth are broken or cracked together. Fatigue breakage points to a gear overloaded for its size, misaligned so that the load is concentrated at one end of the face, poorly lubricated or with a stress raiser at the root; overload points to an event, such as the stone through the auger. As with shafts, the repair should deal with the cause.

## Alignment across the face

A gear tooth is designed to carry its load spread evenly across its face width. If the shafts are misaligned, or the bearings worn, the load concentrates at one end of the face, and the stress there can be many times the average. Teeth broken at one corner, or worn and pitted at one end, are the sign. Any gear repair includes checking the shaft alignment and bearings, because a rebuilt tooth in a misaligned gearbox will fail at its loaded corner, as the original did. The contact pattern, shown by painting a few teeth with marking compound and turning the gears under light load, shows whether the load is spread across the face after reassembly.

## Lubrication and debris

A gearbox that has broken a tooth is full of debris: fragments of the tooth, metal particles from the damage and, often, contaminated or degraded oil. Refitting repaired gears without cleaning the gearbox, flushing it and replacing the oil sends that debris through the bearings and the new mesh, and damages them. The repairer cleans the housing, checks the bearings for damage from the debris, replaces seals as needed and fills the box with the oil the maker specifies.

## Rebuilding a tooth

A sound tooth rebuild follows a sequence:

```figure
type: steps
title: Rebuilding a broken tooth on a plain steel gear
caption: A general sequence for a low-speed gear of weldable, unhardened steel. The procedure for a particular gear is set from its material, size and duty.
- Inspect | confirm the material; check the other teeth and the mating gear; crack-test the root area
- Prepare | grind the stump to sound metal with a smooth root; clean the gear
- *Preheat the whole gear body | to the procedure's temperature; hold it through welding
- Build up | add weld metal in layers, fusing into the root; leave allowance on all faces
- Cool slowly, then shape | machine, mill or grind the profile to a template from a sound tooth; blend the root fillet
- Check | crack-test the root; check profile, pitch and thickness against the neighbouring teeth
```

## Restoring the profile

The rebuilt tooth must have the right shape. Its flanks must follow the involute profile of the other teeth, its thickness must match theirs, and it must sit at the right pitch from its neighbours, or it will carry more or less than its share of the load and run noisily. On a gear-cutting machine, a rebuilt tooth can be recut with the gear's own cutter, indexed to the existing teeth, which gives the best result. In a general repair shop, the tooth is often shaped by milling and hand grinding to a template taken from a sound tooth, and checked with a gear tooth vernier or by comparison with its neighbours. Gears by the Numbers explains how tooth thickness and backlash are measured in its chapter on [backlash and tooth thickness](/reados/publications/gears-by-the-numbers/backlash-and-tooth-thickness/). A hand-shaped tooth is rarely as accurate as a cut one, which is another reason to treat such repairs on anything but slow gears as temporary.

## The mating gear

A broken tooth seldom fails alone. The shock of the break, or the debris it produced, may have chipped or cracked teeth on the mating gear, and the cause of the break, whether an overload, a foreign object, misalignment or wear, affects both gears. The mating gear is inspected as carefully as the broken one. Gears that have run together for a long time develop matching wear, so a new gear running with an old, worn mate may wear or run noisily; for this reason, worn gear pairs are generally replaced together.

## Sprockets and chains

Sprockets wear in a recognisable way: their teeth become hooked, worn on the driving side, as the chain stretches with wear and rides higher on each tooth. A worn sprocket wears a new chain quickly, and a worn chain wears a new sprocket. The usual rule is to replace chain and sprockets together. Rebuilding sprocket teeth by welding is possible on large, slow sprockets of weldable steel, but the profile must be restored accurately or the chain will ride badly, and on most sprockets replacement is cheaper and more reliable than repair.

## Making a new gear instead

For a gear that cannot be bought and should not be rebuilt, making a new one is often possible. A gear cutting shop can cut a new gear from a drawing, or from measurements of the old gear and its mate: the number of teeth, the module or diametral pitch, the pressure angle, the face width, the helix angle for helical gears, the bore and the keyway. Gears by the Numbers explains how a gear is measured and specified in its chapter on [measuring and specifying a gear](/reados/publications/gears-by-the-numbers/measuring-and-specifying-a-gear/). A new gear of the right steel and heat treatment restores the design, and for gears on machines that matter, it is usually worth the wait, with a rebuilt tooth to bridge the gap.

## The running case: the auger drive gear

This is an illustration. The feed auger's drive gear, 40 teeth of 4 mm module and a 30 mm face, had lost one tooth, broken off at the root. The gear was a plain medium-carbon steel, not hardened, running at a low speed, and the replacement was three weeks away. The repairer checked the remaining teeth and the pinion it meshed with by eye and with dye penetrant, and found no other cracks, and traced the break to a lump of stone that had passed through the auger. The bending stress of about 80 MPa in the illustration above left a comfortable margin for a sound rebuild.

The repairer preheated the whole gear, rebuilt the tooth in layers with a low-hydrogen filler, cooled it slowly, milled the tooth to rough shape in the mill with the gear indexed off its neighbours, and finished it by hand to a template. The root fillet was blended smoothly and crack tested. The gear ran for the rest of the season, and the new gear and pinion were fitted afterwards. The rebuilt gear was kept, labelled, as a spare.

## A failure: the hardened gear

This is an illustration. Some years earlier, the repairer had been asked to rebuild a broken tooth on a gear from a tractor's transmission. The gear was case-hardened. A welder rebuilt it with care and shaped it well, and it was refitted at the owner's insistence, with a written warning that the repair was temporary. Within hours, the rebuilt tooth, soft where the rest were hard, had deformed and broken, and its fragments damaged the gears it ran with.

The repairer's rule since then has been that case-hardened and through-hardened transmission gears are not rebuilt by welding, whatever the owner asks, because the likely cost of failure is not one gear but several.

## Exercise: a defect at the root

A rebuilt tooth on a gear like the auger's is found, by sectioning a trial piece, to have lack of fusion along about 15% of its root thickness. Estimate the increase in the root bending stress, ignoring the defect's stress concentration. If the original stress is 80 MPa, what is the new stress, and what would you do?

With the effective root thickness reduced to 85%, the bending stress rises by about 1 ÷ 0.85² − 1 ≈ **38%**, from 80 MPa to about **111 MPa**, and the real increase at the tip of the defect would be larger, because a sharp lack-of-fusion edge is a severe stress concentration and the start of a fatigue crack.

The defect is unacceptable. The rebuilt tooth should be ground out completely and rebuilt with better preheat and fusion into the root, and the procedure checked by sectioning another trial piece before the next attempt.
