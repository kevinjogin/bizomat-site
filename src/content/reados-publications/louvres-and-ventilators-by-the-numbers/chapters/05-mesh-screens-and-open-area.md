---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: mesh-screens-and-open-area
order: 5
title: "Mesh, screens and the area that is really open"
description: "Calculate the open area of bird and insect mesh behind PR-30's louvre, see why mesh rarely limits a clean louvre but often limits a dirty one, and plan screening, access and cleaning."
draft: false
---

Behind almost every louvre is a mesh. Birds nest in plant rooms if they can get in, and their nests, droppings and occasional bodies are not welcome near compressors and switchboards. In food premises and some other buildings, insects must be kept out too. Mesh does both jobs, and it also blocks part of the opening. A clean, coarse bird mesh costs little airflow; a fine insect mesh costs more; any mesh coated in lint, pollen and dust can cost a great deal, and it gets dirty from the day it is installed.

This chapter calculates the open area of woven mesh, compares bird and insect mesh behind PR-30's louvre, estimates their pressure losses and the effect of a half-blocked insect screen on the fans, and plans the mesh's position, access and cleaning. The failure case is an insect screen that quietly clogged until the compressors overheated.

## Open area of woven mesh

Square woven mesh is described by its **aperture**, the clear opening between wires, and its **wire diameter**. The **pitch** of the wires is aperture plus wire diameter. In each square of the mesh, the open part is the aperture squared and the whole is the pitch squared, so the **open-area ratio** is (aperture ÷ pitch)².

```figure
type: formula
title: Open area of PR-30's mesh options
formula: open-area ratio = (aperture ÷ (aperture + wire diameter))²
caption: This is an illustration with typical mesh sizes. Real mesh is specified from the supplier's data, which gives aperture, wire diameter and open area for each product.
- Bird mesh, 12 mm aperture, 1.6 mm wire | (12 ÷ 13.6)² ≈ 77.9% open
- Finer bird mesh, 6 mm aperture, 1.0 mm wire | (6 ÷ 7)² ≈ 73.5% open
- Insect mesh, 1.0 mm aperture, 0.28 mm wire | (1.0 ÷ 1.28)² ≈ 61.0% open
step: The finer the mesh, the larger the share taken by wire, because wire diameter falls more slowly than aperture
```

The pattern is general. Bird mesh is mostly hole; insect mesh, because its wire cannot be made proportionally thinner, is nearly 40% wire. Perforated sheet, sometimes used instead of woven mesh for its neat appearance, follows its own rule: its open area depends on hole diameter, hole pitch and the hole pattern, and is usually lower than woven mesh with a similar opening, often well under half. The supplier's open-area figure is used, never a guess from the look of the sheet.

## Where the mesh sits

PR-30's mesh is fixed across the back of the louvre, inside the frame, covering the whole core of **2.25 × 1.40 m = 3.15 m²**. Placed there, its open area is the core area times its open-area ratio:

```figure
type: compare
title: PR-30's mesh open area compared with the louvre's free area
cols: Open area behind the louvre | Velocity through the openings at 3.89 m³/s | Limits the airflow?
caption: This is an illustration. With the mesh behind the blades across the whole core, clean bird mesh has more open area than the louvre's 1.638 m² free area, so the blades, not the mesh, set the narrowest passage. A half-blocked insect screen becomes the narrowest passage in the louvre.
- *Bird mesh, 77.9%, clean | 3.15 × 0.779 ≈ 2.45 m² | about 1.59 m/s | no; the blades' 1.638 m² is smaller
- Insect mesh, 61.0%, clean | 3.15 × 0.610 ≈ 1.92 m² | about 2.02 m/s | no, but close
- Insect mesh, half blocked | about 0.96 m² | about 4.05 m/s | yes; it is now the smallest area
```

Mesh fixed across the front of the louvre, in the plane of the face, would behave differently: it would see the approaching air spread over the whole gross face, and its open area would be larger still, but it would catch rain, collect dirt where everyone can see it and be easy to damage. Mesh fixed in the narrow passage between blades, which some makers do with clipped-in screens, faces the full free-area velocity and costs much more. Behind the blades is the usual compromise: protected from weather and vandals, covering the whole core and reachable from inside for cleaning.

### Mesh on the exhaust side

PR-30's exhaust louvre also needs bird mesh, because birds will nest in a closed motorised louvre as happily as in an open intake. On the exhaust, the mesh sits on the inside of the louvre, between the fans and the blades, where it protects the blades' linkage from nesting material as well. Air leaving the room carries much less dust than air entering it, since the dust settles in the room or passes through the compressors' own filters, so exhaust mesh stays cleaner. It is still checked at the same visits, because a bird that has found a gap will build on the mesh from the outside, between the blades, and a nest of twigs on a closed louvre stops it opening fully.

## Pressure loss through the mesh

The mesh behind PR-30's louvre is struck by jets of air leaving the gaps between the blades, at roughly the free-area velocity, rather than by a smooth, slow approach flow. For the pressure budget, this book therefore uses teaching loss coefficients referred to the louvre's free-area velocity, as in Chapter 3:

- clean bird mesh, **K ≈ 0.62**, about **2.0 Pa** at the design flow;
- clean insect mesh, **K ≈ 2.0**, about **6.5 Pa**;
- insect mesh with half its openings blocked, **K ≈ 8.0**, about **26 Pa**. Halving the open area roughly doubles the velocity through what is left and quadruples its loss.

These are not maker's figures. A mesh supplier or louvre maker can provide tested values for a mesh fitted behind a particular louvre, and they should be used for a real design.

## What a dirty screen does to the fans

The pressure budget from Chapter 3 can be re-solved with each mesh in place, using the same teaching fan curve.

```figure
type: bars
title: PR-30's airflow with three mesh conditions
unit: m³/s
max: 4.5
caption: This is an illustration, solved from the teaching fan curve and loss coefficients. The room's temperature rise is about 7.95 K with clean bird mesh, 8.12 K with clean insect mesh and 8.86 K with a half-blocked insect screen.
- Design flow needed | 3.89
- *Clean bird mesh | 3.92
- Clean insect mesh | 3.83
- Insect mesh, half blocked | 3.51
```

Clean insect mesh costs about 2% of the flow, which PR-30's margin absorbs. A half-blocked insect screen costs about **10%** of the flow, raising the room's temperature rise from about 8 K to nearly **8.9 K** and the room's suction from about 15 Pa to about **32 Pa**, the same symptoms as the undersized louvre in Chapter 3. A compressor room that was fine in spring and overheats in late summer, with nothing else changed, has very often clogged its screens.

## Does the plant room need insect mesh?

Insect mesh is sometimes demanded by a food safety plan or an auditor for every opening in a food business. A compressor room that is separated from food handling areas by walls and doors, with no open product, may not need it; one that opens directly into a production area may. The question is one for the business's food safety program and its auditor, and the answer should be written into the design brief, because it changes the louvre's size, its access and its cleaning schedule. PR-30's plant room has no internal opening into the food areas, and its auditor accepted bird mesh on its external louvres, with insect control at the doors between the plant room and the factory.

If insect mesh is required on a plant room intake, the louvre is sized for the dirty mesh, not the clean one, and the mesh is fitted in removable framed panels that can be lifted out, washed and refitted without tools, with a spare set so that cleaning does not leave the opening unscreened.

## When mesh is not enough: filters

Some sites are dusty: a plant room beside a gravel yard, a quarry, a flour store or a timber mill. Compressor makers commonly recommend that cooling and intake air be clean, and some offer intake filters for their machines; a plant room in a dusty place may need its whole intake filtered. A filter is a different order of thing from mesh. Panel filters are sized by their own face velocity, from the filter maker's data; at a teaching filter face velocity of 2.0 m/s, PR-30's 3.89 m³/s would need about **3.89 ÷ 2.0 ≈ 1.95 m²** of filter face, in a frame behind the louvre with access to change the panels.

The pressure drop is the bigger change. A clean panel filter might lose a few tens of pascals and a dirty one many times that, both from the filter maker's data. PR-30's propeller fans, whose teaching curve falls to about 1.1 m³/s each at 75 Pa, could not hold the design flow against a loaded filter. A filtered plant room intake therefore usually goes with a different fan, often an axial or centrifugal fan with a steeper curve, selected for the filter's dirty pressure drop, and with a gauge across the filter to show when it needs changing. PR-30's site is not dusty, and its intake has bird mesh only; the filter calculation was done to confirm that, not to design one.

## What mesh does not stop

Mesh keeps out what is bigger than its aperture. Twelve-millimetre bird mesh stops pigeons, sparrows and most nesting birds, but not wasps, spiders, mice or snakes, all of which have been found in plant rooms. Gaps around the louvre frame, where it meets the wall, are often bigger than the mesh openings and admit what the mesh excludes; the frame is sealed to the wall all round, and the mesh panel's frame seals to the louvre frame on an EPDM strip, so there is no gap at the edge. Spiders and wasps that build on the inside of the mesh are removed at each cleaning. Where vermin are a particular concern, the pest controller's advice on aperture and sealing is taken before the mesh is ordered, so that one mesh does both jobs.

## Fixing the mesh

PR-30's bird mesh is 12 mm aperture, 1.6 mm stainless woven wire, held in a folded aluminium frame screwed to the inside of the louvre frame in two panels, one for each bay. Stainless mesh in an aluminium frame is a dissimilar-metal pair, so the mesh's edges sit in an EPDM strip within the folded channel, keeping the two apart where water may collect. The panels are fixed with stainless screws into rivet nuts, so they can be removed repeatedly without wearing the holes.

The mesh must be tight. Slack mesh vibrates in the airflow and hums, and it lets birds push through at the edges. Each panel is checked by pressing the mesh at its centre: it should give a few millimetres and spring back.

## Access and cleaning

Mesh that cannot be reached will not be cleaned. PR-30's intake louvre is low in the wall, and its mesh panels can be lifted out from inside the plant room standing on the floor. Its exhaust louvre is high in the east wall, 3 m up, and its mesh panels are reached from a platform; that louvre has bird mesh only, and air blowing outwards through it keeps it cleaner.

The plant room's maintenance schedule checks the intake mesh monthly in the first year, to learn how fast it gets dirty, and then at whatever interval that experience shows. Cleaning is by vacuum or a soft brush from the inside, never by hosing from outside, which drives dirt into the louvre's drains. The check is recorded with the room's suction reading from a fixed manometer on the plant room wall: a rising suction at the same fan speeds is the earliest warning of a blocking screen.

## A failure case: the screen that blocked

This is an illustration. On an earlier compressor room, an auditor's request led the owner to have fine insect mesh fitted behind the existing intake louvre, which had been sized for bird mesh with only a small margin. Nobody recalculated the airflow, and the mesh was fixed with rivets.

It worked well for three months. By late summer, the compressors were tripping on high temperature in the afternoons and the plant room door was difficult to open. The detection came from the trips and the door. When the maintenance fitter finally drilled out the rivets and lifted the mesh, it was felted with lint from a nearby bag store and pollen, and well over half its openings were closed.

The correction had three parts: the mesh was replaced with removable framed panels and a spare set; the louvre was enlarged, so that its free area and the dirty mesh together still met the airflow; and a manometer was fixed to the plant room wall with a marked limit. The shop now asks, for every louvre, which mesh is required and how it will be cleaned, before it calculates the louvre's size.

## How this applies to a small Australian business

Calculate mesh open area from its aperture and wire diameter. Fit mesh behind the blades across the whole core, and check that its open area exceeds the louvre's free area by a comfortable margin when clean. Find out early whether insect mesh is required, and if it is, size the louvre for dirty mesh, fit it in removable panels with a spare set, and plan access. Fix a manometer in the room and watch the suction, because a slowly blocking screen shows there first.

## Exercise: a finer bird mesh

The owner asks whether 6 mm aperture bird mesh with 1.0 mm wire would keep out smaller birds without hurting the airflow. Using this chapter's method, what is its open area behind PR-30's 3.15 m² core, and how does it compare with the louvre's 1.638 m² free area? Through what fraction of blockage could the mesh go before its open area equalled the louvre's free area?

**Worked answer.** The open-area ratio is **(6 ÷ 7)² ≈ 73.5%**, so the open area is **3.15 × 0.735 ≈ 2.31 m²**, comfortably more than the louvre's **1.638 m²**; when clean, the blades still set the narrowest passage. The mesh's open area would fall to 1.638 m² when **1 − 1.638 ÷ 2.31 ≈ 29%** of its openings were blocked. With the 12 mm mesh, the same point is reached at **1 − 1.638 ÷ 2.45 ≈ 33%** blocked. The finer mesh is a reasonable choice for small birds, with a slightly shorter cleaning interval.
