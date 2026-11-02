---
book: electroplating-by-the-numbers
chapterSlug: hydrogen-embrittlement-and-baking
order: 7
title: "Hydrogen embrittlement and baking"
description: "Understand how plating puts hydrogen into hardened steel, why the resulting fractures are delayed and sudden, and how specification, process choice and baking control the risk."
draft: false
---

Some plating failures are visible the moment the parts leave the line. Hydrogen embrittlement is not. A hardened part can be plated perfectly, pass every thickness and adhesion check, be assembled and loaded, and then break hours or days later without warning, with almost no deformation. The cause is hydrogen absorbed by the steel during cleaning, pickling and plating, and the only reliable defences are taken before and immediately after plating.

The 1917 treatise did not discuss this failure; the high-strength steels in which it matters most were not yet common. Modern coating and fastener standards treat it as one of the central requirements of any specification for plated steel. This chapter explains the mechanism, puts numbers on the hydrogen a plating line produces and brings the case's 400 hardened spring clips into the story.

## Where the hydrogen comes from

Chapter 3 showed that in most plating baths part of the current releases hydrogen at the cathode instead of depositing metal. The same happens in cathodic electrocleaning, and acid pickling releases hydrogen wherever the acid attacks the steel. Most of that hydrogen forms bubbles and escapes. A small fraction, in the form of single hydrogen atoms, enters the steel.

The quantity produced is large compared with what is needed to cause trouble. This is an illustration. Each bracket rack passes 93.66 A·h at 80% efficiency, so about 20%, or 18.73 A·h, goes to hydrogen. Two electrons release one molecule of hydrogen, so that charge produces about 18.73 × 3,600 ÷ (2 × 96,485) ≈ 0.35 mol of hydrogen gas, about **8.3 litres** at 15 °C and atmospheric pressure, from one rack. Only a minute fraction of that need enter a susceptible steel to cause cracking.

## Why hardened steel cracks

Hydrogen atoms are small enough to diffuse through steel. They gather where the metal's lattice is strained, at grain boundaries, at inclusions and, above all, in the region of high tensile stress ahead of a notch, a thread root or a sharp bend. There they reduce the steel's resistance to cracking. Under a sustained tensile load, a crack can start and grow slowly as more hydrogen diffuses to its tip, until the remaining section breaks suddenly.

Two features make the failure dangerous. It is **delayed**: the part carries its load at first and fails later, often after assembly and inspection, because the hydrogen needs time to collect. And its likelihood rises steeply with the **strength and hardness** of the steel. Soft, low-strength steels such as the mild steel brackets are generally tolerant; hardened springs, clips, high-strength fasteners and case-hardened parts are susceptible. Coating and fastener standards therefore relate their embrittlement-relief requirements to the part's hardness or strength class, and ISO 4042 for electroplated fasteners gives requirements and recommendations specifically to minimise the risk. Those thresholds and requirements must be read from the current editions; they are not reproduced here.

```figure
type: steps
title: How a plated hardened part comes to fail
caption: Each step is a point at which the risk can be reduced: less hydrogen in, more hydrogen out, or less sustained stress.
- Pickle and clean | hydrogen released at the steel surface
- Plate | more hydrogen at the cathode, under a coating that slows its escape
- Absorb | atomic hydrogen diffuses into the steel
- Load | part assembled under sustained tensile stress
- *Collect | hydrogen gathers at notches, roots and bends
- Fracture | delayed, brittle failure, hours or days later
```

## Controls before, during and after plating

The controls follow the steps in the figure. ISO 9587 deals with pretreatment of iron or steel to reduce the risk, and ISO 9588 with post-coating treatments; between them they cover the measures below in detail.

**Before plating.** Parts with high residual stresses from grinding, forming or heat treatment may be stress-relieved before cleaning, so that less tensile stress is available to drive cracking. Heavy scale is removed by abrasive blasting rather than long pickling. Cleaning is done anodically, or with inhibited acids for short times, to limit the hydrogen produced at the surface.

**During plating.** A bath with high cathode efficiency produces less hydrogen per gram of metal. Some baths and processes are chosen for susceptible parts precisely for that reason.

**After plating.** The principal defence is **baking**: heating the plated parts at a stated temperature for a stated time, starting within a stated period after plating, so that hydrogen diffuses out of the steel or into harmless sites before it can do damage. The coating itself slows the escape of hydrogen, which is one reason the start time matters: the longer a part waits at room temperature, the more hydrogen can move to where it causes cracks. Some passivates are damaged by baking temperatures, so the order of baking and passivating must suit the coating system and the specification.

**Avoid it altogether.** Where the risk is high and the coating's thickness can be met another way, a non-electrolytic coating may be chosen instead. The Library chapter on [protecting metals from corrosion and wear](/reados/collections/machine-elements-and-mechanical-design/protecting-metals-from-corrosion-and-wear/) notes that zinc flake coatings are applied without electrolysis and so introduce no hydrogen from the coating process, which is why they are widely used on high-strength fasteners.

```figure
type: decision
title: Is embrittlement relief needed?
question: What is the part and how will it be loaded?
caption: A screening guide only. The hardness or strength thresholds and the baking requirements come from the applicable standard and the part's specification.
- Low-strength steel, e.g. mild steel bracket | Below the standard's threshold? | relief normally not required; state so
- *Hardened spring, clip or high-strength fastener | Above the threshold? | bake, or choose a non-electrolytic coating
- Case-hardened part | Surface hardness high? | treat as susceptible
- Safety-critical part under sustained load | Consequence of fracture severe? | relief plus testing, or avoid electroplating
```

## The spring clips

This is an illustration. The workshop also orders zinc plating for **400 hardened spring steel clips** that hold covers onto the brackets under a permanent preload. The clips are small and robust, so the plater proposes barrel plating in loads of 100. Their hardness puts them above the threshold at which the applicable standard requires embrittlement relief, so the specification calls for baking.

To show how baking shapes the job, use **placeholder values for teaching**, not values from any standard: suppose the specification requires baking to start within 4 hours of plating and to last 8 hours, and the plater's oven holds 200 clips. The real figures come from the specification and the standard it cites.

The plater runs a barrel load every 30 minutes, so the four loads finish at 0.5, 1.0, 1.5 and 2.0 hours. The first 200 clips can enter the oven at 1.0 hour, well inside the start window. But the oven is then occupied for 8 hours, and the second 200 clips, finished at 2.0 hours, would wait until 9.0 hours to start their bake, five hours beyond the 4-hour window.

```figure
type: timeline
title: Plating and baking 400 clips with one oven
caption: This is an illustration with placeholder times. The second batch cannot start its bake within the window, so the plating must be split or a second oven used.
- 0.5 to 2.0 h | Four barrel loads plated | 100 clips each
- 1.0 h | Batch 1 into oven | within the start window
- *2.0 h | Batch 2 ready | oven still full
- 6.0 h | Start window for batch 2 closes | 4 h after plating
- 9.0 h | Oven free | too late for batch 2
```

The answer is to plan the plating around the oven, not the other way round: plate the second 200 clips on a later run timed to finish as the oven becomes free, or use a second oven. A plater who plates first and looks for oven space afterwards will sooner or later bake parts outside the window, or not bake them at all.

## A failure: clips that broke on Wednesday

This is an illustration. An earlier batch of clips, ordered before the specification was revised, was sent to plating with the same two-word note as the brackets: "zinc plate". Nothing on the order said the clips were hardened, and the plater, treating them like any other small steel part, plated them without baking. They passed the thickness check and were assembled onto brackets on a Monday. On Wednesday, a fitter found three clips lying broken under the bench, and by Friday another eleven had snapped on assembled units.

The fractures were flat and bright, with no sign of bending before failure, and they started at the inside of the clip's tightest bend, where the preload put the steel in tension. A metallurgist's examination of the fracture surfaces found features characteristic of hydrogen embrittlement. The timing fitted: failures began a day or two after assembly and continued for days.

The response recognised that hydrogen embrittlement cannot be inspected out of a batch. A clip that has not yet broken may still break.

1. **Contain.** All clips from the batch, assembled or not, were quarantined and replaced. Assembled units already shipped were traced and the clips replaced in the field.
2. **Correct the specification.** The clip drawing now states the steel, its hardness, the coating standard, the requirement for embrittlement relief and the baking requirement by reference to the applicable standard.
3. **Choose the process deliberately.** The workshop asked the plater to compare a baked zinc electroplate with a zinc flake coating for the clips, taking into account corrosion performance, cost and the consequence of a fracture.

The root cause was the same as the bracket's first failure in Chapter 1: the drawing did not tell the plater what the part was. For a mild steel bracket the result was thin zinc; for a hardened clip it was broken parts.

## What the plater cannot see

A plater looking at a box of clips cannot tell their hardness. A soft clip and a hardened one look identical, plate identically and pass the same thickness check. The information that decides whether baking is needed exists only in the parts maker's records: the steel grade, the heat treatment, the hardness achieved and how the part will be loaded. That is why coating standards make the purchaser responsible for stating whether embrittlement relief is required, and why a specification for a hardened part must carry the hardness or strength class and the relief requirement explicitly. A note that leaves the plater to assume is a note that will eventually produce the failure above.

## Rework adds hydrogen

Stripping a defective coating and replating the part is routine for mild steel brackets, as several chapters of this book have shown. For susceptible parts it is not routine. Stripping usually involves acid, which releases more hydrogen at the steel surface, and replating adds the plating hydrogen again. Each cycle increases the hydrogen the part has absorbed and the risk that baking will not remove enough. Specifications for susceptible parts often limit or forbid rework, or require baking after stripping as well as after replating. The cheapest rework for a batch of hardened clips with a coating defect can be to scrap them.

## Hydrogen after plating

Plating is not the only source of hydrogen. A zinc coating protects steel by corroding sacrificially, as Chapter 8 explains, and at a scratch or a pore where steel and zinc meet in moisture, hydrogen can be generated on the steel surface as the zinc corrodes. Acid cleaning during maintenance, cathodic protection systems and some service environments can also supply hydrogen long after the part left the plater. For the highest-strength parts, designers therefore consider the whole life, not only the plating process, when choosing a coating. A baked electroplate removes the hydrogen put in by plating; it does not make a susceptible steel immune to hydrogen from elsewhere.

## Testing for embrittlement

Baking reduces the risk; it does not prove it has been removed. For susceptible parts, standards provide test methods in which samples from a batch are held under sustained load, often above their service load, for a stated period and then examined for cracks or fractures. The purchaser's specification should say whether such tests are required, how many samples, and what happens to a batch if a sample fails. For safety-critical parts, a qualified engineer should decide whether electroplating is appropriate at all.

The baking itself also needs evidence. An oven record showing the batch, the time plating finished, the time the bake started, the temperature achieved throughout and the duration is the only proof that relief was carried out as specified. Ovens can run cooler in their corners than on their display, so platers who bake susceptible parts check the temperature distribution of the loaded oven at intervals. In the clip failure above, no bake had been done at all; in a subtler case, a bake started too late or run too cool would leave the same risk with a record that appeared to show compliance.

## Exercise: hydrogen from a barrel load

Each barrel load of clips has 10 dm² of surface and is plated at 0.8 A/dm² for 40 minutes. Suppose the bath runs at 70% efficiency for these conditions. Calculate the charge, the zinc thickness and the volume of hydrogen released at the cathode, and explain why the hydrogen volume, though small, still matters for the clips but not for the brackets.

The current is 10 × 0.8 = 8 A, so the charge is 8 × 40 ÷ 60 ≈ **5.33 A·h**. The thickness is about 17.08 × 0.8 × 0.70 × 40 ÷ 60 ≈ **6.4 µm**. The 30% of the charge not depositing zinc, about 1.6 A·h, releases about 1.6 × 3,600 ÷ (2 × 96,485) ≈ 0.030 mol of hydrogen, about **0.71 litres** at 15 °C. The volume is small, and almost all of it escapes as gas, but the fraction absorbed by a hardened spring steel under a permanent preload can be enough to crack it. The brackets release more hydrogen per load, but their low-strength steel tolerates it, which is why the specification requires relief for the clips and states that it is not required for the brackets. Note also that the clips' 6.4 µm average is below the brackets' 8 µm minimum; if the clips need the same corrosion protection, either the plating time or the current density must rise, and both would add hydrogen, which makes the baking requirement more important, not less.
