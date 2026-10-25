---
book: machine-part-repairs-by-the-numbers
chapterSlug: reading-the-failure
order: 2
title: "Reading the failure"
description: "Tell fatigue from overload on a broken shaft, read beach marks and the final fracture zone, count the load cycles a part saw, recognise the kinds of wear, and find the cause before repairing the part."
draft: false
---

A broken or worn part is evidence. Its fracture surface, wear marks, colour and shape record how it failed, and often why. A repair that ignores the evidence restores the part to the condition in which it failed, and the same failure follows. Campbell understood this in 1919, when he explained that a crankshaft generally breaks in one of two ways: by an external force, such as a connecting rod coming loose, or by what was then called crystallisation, which he recognised as usually due to fatigue. The two needed different repairs, and in the first case the shaft was likely to be bent as well as broken.

This chapter explains how to tell fatigue from overload, how to read a fatigue fracture surface for where it started and how heavily the part was loaded, how to estimate the load cycles a rotating part has seen, how to recognise the main kinds of wear, and how to use all of that to find the cause before the repair. It applies the method to a broken auger drive shaft. Weld Repairs That Hold covers reading damage in plate structures in its chapter on [reading the damage before choosing a repair](/reados/publications/weld-repairs-that-hold/read-the-damage-before-choosing-a-repair/); this chapter concentrates on machine parts.

## Preserve the evidence

The first rule is to protect the fracture surfaces. A broken shaft's two halves should not be fitted back together, which crushes the fine features; should not be wire brushed or ground; and should be kept dry, because rust quickly obscures the surface. The repairer photographs the fracture and the part, notes where it broke, measures any distortion, and asks the owner about the part's history: how long it had run, whether it had been repaired before, what the machine was doing when it failed, and whether there had been noise, vibration or heat beforehand.

## Fatigue and overload

Most broken machine parts have failed in one of two ways.

```figure
type: compare
title: Fatigue and overload fractures compared
cols: Fatigue | Overload
caption: General features. Many failures combine both: a fatigue crack grows until the remaining section is overloaded and breaks suddenly.
- How it happens | a crack starts and grows a little with each load cycle | the load exceeds what the section can carry, once
- Time | many cycles, often millions | one event
- Distortion | usually little or none | often bent, twisted or stretched
- Surface | smooth region with curved beach marks, then a rough final zone | rough, fibrous or granular over the whole face
- *Cause to look for | stress raiser, misalignment, vibration, poor repair | jam, impact, wrong part, overload
```

Fatigue is by far the commoner cause of failure in rotating machine parts. A shaft turning under a bending load sees its surface pass from tension to compression and back once every revolution, and a crack that starts at a stress raiser, such as a keyway end, a sharp shoulder, a corrosion pit or a weld toe, grows a tiny amount each cycle, often for millions of cycles, until the remaining section can no longer carry the load and breaks suddenly. The old word "crystallisation" came from the bright, granular look of that final fracture, which was thought to show that the metal had changed its structure; in fact, the metal had not changed, and the granular zone is simply the last part to break.

## Reading a fatigue surface

A fatigue fracture surface has two distinct regions. The **fatigue zone** is relatively smooth, often with curved lines called beach marks, which record pauses and changes in the load as the crack grew; the beach marks curve around the origin, the point where the crack started, like ripples spreading from a stone. The **final fracture zone** is rough and is where the remaining section broke at the end.

The relative size of the two zones is informative. A small final fracture zone means the crack grew across most of the section before the remainder broke, which tells the reader that the remaining section could carry the load until it was small, and so that the nominal stress was low and the crack grew slowly over a long time. A large final fracture zone means the section broke while the crack was still small, so the stress was high. The position of the origin and the shape of the beach marks show whether the load was bending, torsion or both, and in rotating bending, cracks often start at several points round the circumference, separated by small steps called ratchet marks.

## Torsion, bending and the angle of the crack

The direction of a fatigue crack shows what kind of load drove it. A shaft loaded mainly in rotating bending cracks on a plane roughly at right angles to its axis, straight across. A shaft loaded mainly in reversing torsion, twisting back and forth, often cracks on a spiral at about 45° to the axis, along the direction of the maximum tensile stress. A crack that runs along the axis of a keyway or a spline usually points to torsion and to the high stresses at the corners of the keyway. Reading the angle tells the repairer which load to look for on the machine: a bending crack suggests misalignment, a bent mounting or an overhung load; a torsion crack suggests shock loads in the drive, a jamming machine or torsional vibration.

## Sending a part to a laboratory

Most fractures in a repair shop can be read well enough by eye and with a magnifying glass. Some cannot, or matter too much to leave to a workshop opinion: a failure that injured someone, a part covered by a warranty claim, a repeated failure whose cause is not obvious, or a failure that may be the subject of a dispute or an insurance claim. For those, the part is sent to a materials testing laboratory, which can examine the fracture under a microscope, analyse the material, measure its hardness and section it. The repairer then keeps the part as found, does not attempt a repair, and records what was done with it. A laboratory report costs money and time, but it is the evidence that settles the question.

## Material identification

Campbell insisted that a welder must know the metal before welding it, and gave simple workshop tests by fracture, emery wheel, chisel and torch to distinguish cast iron, malleable iron, wrought iron and steels. Modern repairers have better tools, such as portable hardness testers, spark testing against known samples, and, through suppliers and laboratories, chemical analysis. Knowing whether a broken shaft is plain carbon steel, an alloy steel, or a hardened and tempered steel decides whether it can be welded at all and what procedure it needs, as Chapter 4 explains. The maker's drawing or specification, where it can be found, is the best source.

## Counting the cycles

A rotating part's load cycles are easily counted, and the count puts a fatigue failure in perspective.

```figure
type: formula
title: Load cycles seen by a rotating shaft
formula: cycles = rev/min × 60 × hours a day × days in service
caption: This is an illustration for the auger drive shaft in this chapter. In rotating bending, each revolution is one full reversal of stress at the surface.
- Speed | 1,200 rev/min
- Running time | about 10 hours a day
- Service before failure | about 42 days
step: cycles per day = 1,200 × 60 × 10 = 720,000
step: cycles before failure ≈ 720,000 × 42 ≈ 30 million
```

Thirty million cycles in six weeks is a lot of reversals. Steels have a fatigue strength below which, in clean conditions, they can survive very many cycles, and the shaft was designed to stay below it. A shaft that fails after tens of millions of cycles has been stressed at its surface, somewhere, above that limit, by a stress raiser, an extra load such as misalignment or vibration, or damage, and finding which is the point of the investigation. Simply replacing or rewelding the shaft without finding it invites the same failure in about the same time.

## The kinds of wear

Worn parts tell their own story.

- **Abrasive wear**, from hard particles between surfaces, leaves scratches and grooves in the direction of motion; its cause is dirt, poor sealing or contaminated lubricant.
- **Adhesive wear and galling**, where surfaces weld together locally and tear apart, leaves torn, smeared metal; its causes are lack of lubricant, overload or the wrong pairing of materials.
- **Fretting**, from tiny relative movements between parts that should be fixed, such as a bearing on a shaft or a hub on a key, leaves reddish-brown oxide debris and a pitted surface, and often starts fatigue cracks; its cause is a loose fit or flexing.
- **Corrosion** leaves pits and general metal loss, and corrosion pits make excellent starting points for fatigue cracks.
- **Spun bearings**, where a bearing's inner or outer ring has rotated on its seat, leave a polished, worn and often discoloured journal or bore; the causes include a fit that was too loose, a seized bearing or overheating.

Each kind of wear has a cause, and the repair should remove it as well as restoring the worn surface. READOS explains how bearings and their fits on shafts and in housings are chosen in [Selecting bearings and lubrication for reliable machines](/reados/collections/machine-elements-and-mechanical-design/selecting-bearings-and-lubrication-for-reliable-machines/).

## The running case: the auger drive shaft

This is an illustration. A contractor brings in a grain auger's drive shaft, broken cleanly at the end of the keyway under the drive pulley. The fracture surface has a smooth fatigue zone, with beach marks curving round an origin at the inner corner of the keyway end, covering about four-fifths of the section, and a small rough final zone opposite. There is no bending. The auger had run about six weeks of the season since the shaft was fitted.

The reading was clear. The crack started at the keyway end, a well-known stress raiser, and grew slowly under rotating bending, with the small final zone showing that the nominal stress was moderate. But the shaft had failed after about 30 million cycles, when an identical shaft had lasted several seasons before, so something had raised the stress at the keyway. The repairer found the cause on the auger: the pulley's taper-lock bush had not been fully tightened, the pulley had rocked slightly on the shaft, and fretting marks on the shaft under the hub showed it had been moving. The repeated rocking had added a bending load at the keyway end on every revolution.

## Finding the cause

The auger shaft shows the general method:

```figure
type: steps
title: From failed part to cause
caption: A general method. The investigation is in proportion to the part's value and the consequences of a repeat failure; for a simple shaft it may take an hour, for a critical failure an expert's report.
- Preserve | protect the fracture; photograph; record history
- Read | fatigue or overload; origin; zones; wear marks; distortion
- *Find the stress raiser and the load | keyway, shoulder, pit, weld; misalignment, looseness, vibration
- Check the machine | alignment, fits, mounting, lubrication, related parts
- Decide | repair or replace (Chapter 1), and how to remove the cause
```

## Previous repairs

A part that has been repaired before deserves particular suspicion. Weld repairs on shafts and other cyclically loaded parts can introduce stress raisers, at the toe of the weld and in the hard heat-affected zone, that start fatigue cracks. A shaft that breaks at the edge of an earlier build-up, or beside a weld, has very likely failed because of it. Chapter 4 explains how journal build-up should be done to avoid this, and Chapter 10 how the repair record helps the next investigator.

## Overload failures

Overload failures are usually easier to read and harder to prevent from the repair bench. A shaft twisted through a spiral, a bent axle, a gear with several teeth broken at once, a housing cracked across a mounting lug: all point to an event, a jam, an impact, a stone through a harvester, a wrong part fitted. Campbell noted that a crankshaft broken by an external force was likely to be sprung, bent out of line, and that restoring its alignment could take far longer than the weld itself. An overload failure often damages other parts of the machine, which must be inspected, and the event that caused it may need to be prevented, for example with a shear pin, a slip clutch or a guard.

## A failure: the shaft rewelded twice

This is an illustration. A neighbouring workshop had welded a broken conveyor shaft back together, turned it true and returned it. It broke again in about the same place within two months. They welded it again, and it broke a third time.

When the repairer examined the third fracture, it showed a fatigue origin at the toe of the previous weld, where the hard heat-affected zone met the softer shaft, and beach marks spreading from it. The original break had been a fatigue failure at a shoulder with too sharp a fillet, caused by a misaligned bearing. Each weld repair had restored the shaft but added a new stress raiser and done nothing about the misalignment. A new shaft with a properly radiused shoulder, and a realigned bearing, ended the series.

## Exercise: what the zones say

Two broken shafts of the same design come in from two machines. Shaft A has a fatigue zone covering about 90% of the section and a small final zone; shaft B has a fatigue zone of about 30% and a large final zone. Which shaft was more heavily stressed, and what should the repairer look for on each machine?

Shaft B was more heavily stressed. Its section broke while the fatigue crack was still small, so the remaining 70% of the section could not carry the load, which means the nominal stress was high. On machine B, the repairer should look for an overload or a large extra bending load: severe misalignment, a bent mounting, a heavier load than the design, or a wrong part.

Shaft A's crack grew across most of the section before the remainder broke, so the nominal stress was lower and the crack grew slowly, probably over a long time. On machine A, the repairer should look for a stress raiser or a local cause, such as a sharp fillet, a corrosion pit, fretting or a previous weld at the origin, and for a modest additional load such as slight misalignment or looseness.
