---
book: oxy-fuel-by-the-numbers
chapterSlug: jet-preheat-and-cut-quality
order: 8
title: "Jet, preheat and cut quality"
description: "Use the 1921 findings on jet velocity and preheat size, read drag lines, edges and slag as evidence, and choose a cutting setting on quality as well as speed."
draft: false
---

A cut edge records how it was made. Its top corner shows the preheat, its face shows the jet, its drag lines show the speed and its underside shows the balance between oxygen and metal. A workshop that reads those marks can correct a setting from the work itself, without guesswork, and can say in advance what quality a setting will give.

The 1921 investigation drew five conclusions about the jet and the preheat flame that still frame the choice of a cutting setting. This chapter restates them, shows how to read a cut against them and applies them to the choice between settings B and C in the base-plate case.

## What the 1921 tests found about jet and preheat

The report's cutting data were plotted to show, for each thickness, how speed related to oxygen use, acetylene use and the velocity of the cutting jet. From them the investigator drew conclusions that can be summarised as follows.

1. Cutting speed generally rises with the volume of oxygen used, provided the jet velocity and the preheat acetylene are held constant.
2. With the same jet velocity and oxygen use, more acetylene in the preheat makes the cut slower and dearer. In the torches tested, the extra acetylene took extra oxygen to burn, which was oxygen no longer available to the cutting jet.
3. With the same acetylene and oxygen use, a faster jet cuts faster and cheaper, but only up to a limit; beyond it, more velocity buys nothing.
4. Raising the jet velocity and the oxygen use together does not raise the speed in proportion, and can raise the cost. For each thickness there is a limiting velocity at which the oxygen is fully used, and a limiting amount of oxygen the cut needs.
5. No torch was equally good at all thicknesses. Two of the six cheapest torches on 1/2 inch plate could not get through the 10 inch block at all, and some of the least economical on thin plate were among the best on thick.

The investigator's explanation of that reversal was that the average torch ran its jet too fast. The most efficient torches at each thickness tended to be those running at lower velocities, and those that seemed to contradict this were using too much acetylene. He gave a pointed example: if a jet velocity of about 2,200 feet per second was enough to cut 6 inch steel, then 1,800 feet per second, which several torches used, was excessive for 2 inch steel. In metric terms, about 671 m/s was enough for 152 mm plate, so 549 m/s was more than 51 mm plate needed.

## The velocity index

The 1921 velocities were not measured. They were calculated, by taking the oxygen available to the jet and dividing it by the area of the jet's bore. For cutting torches the investigator assumed that the preheat flames used a volume of oxygen equal to the acetylene, and subtracted that from the total oxygen to find the jet's share. Because the gas expands as it leaves the nozzle and the real exit flow is near or above the speed of sound, these figures are not true velocities. They are a consistent index for comparing nozzles and settings, and they can be calculated the same way today.

```figure
type: formula
title: Jet velocity index, as calculated in 1921
formula: v_index = Q_jet ÷ (3,600 × A)
caption: This is an illustration for a 1.6 mm bore. Like the 1921 figures, it compares jets; it is not the true exit velocity of an expanding gas.
- Q_jet | cutting oxygen at standard conditions, m³/h
- A | area of the cutting oxygen bore, m²
- v_index | velocity index, m/s
step: A = π × 0.0016² ÷ 4 ≈ 2.011 × 10⁻⁶ m²
step: v_index = 4.6 ÷ (3,600 × 2.011 × 10⁻⁶)
step: v_index ≈ 636 m/s for setting B
```

This is an illustration. Through the workshop's 1.6 mm bore, setting B's 4.6 m³/h gives an index of about **636 m/s**. Setting C's 5.8 m³/h gives about **801 m/s**, 26% higher. A 1.4 mm bore carrying setting B's flow would give about 830 m/s. On the 1921 reasoning, setting C has raised the velocity and the oxygen together, which is the combination least likely to pay: 26% more cutting oxygen for 5% more speed is exactly the diminishing return described in finding 4.

The index also shows how to add oxygen without adding velocity. A larger bore carrying more oxygen at the same index is a different nozzle, not a different pressure. That is why nozzle charts change the nozzle size with thickness rather than simply raising the pressure.

## Preheat flames that are too big

The 1921 investigators found that most torches were supplied with preheat flames too large for the thickness each tip was meant for. In many cases they had to reduce the acetylene pressure below the maker's figure to stop the flame melting the top edge of the cut and letting molten metal run back into the kerf. With some specified flames, the two pieces were practically welded back together along the top edge; with others, the top edge was badly bevelled. Either result added work later.

The makers' view, recorded in the report, was that large preheat flames were needed to deal with heavy scale and slag and to start cuts quickly. The investigation did not find that an oversized flame started a cut any faster than a correctly sized one. On scale, the investigator was blunt: burning heavy scale off with oxygen, at what he estimated as $1.50 to $10 an hour of gas depending on thickness, could hardly compete with an unskilled worker with a hammer and chisel at 75 cents an hour.

In the base-plate case, setting A uses 40% more acetylene than setting B for the same cutting jet, and Chapter 2 showed it releases about 40% more heat into the top of the plate. Its rounded top edge is the 1921 finding reproduced.

## Reading the cut face

TWI's application note links the common cutting faults to their causes, and the links follow directly from the chemistry of Chapter 7.

```figure
type: compare
title: What the cut face says, and what to change
cols: What you see | Likely cause
caption: Drawn from TWI's guidance on oxyfuel cutting faults. Change one thing at a time and recheck.
- Coarse drag lines angled back; slag on bottom edge | travel too fast; jet trails and too little oxygen reaches the bottom
- Uneven face; heavy top-edge melting; coarse lower drag lines | nozzle too far from the plate
- Excess slag on face; local gouging; top-edge melting | oxygen flow too high; turbulence between jet and preheat
- *Top-edge melting alone | preheat flow too high
- Poor slag removal | cutting oxygen too low
```

The **drag** of a cut is the horizontal distance by which a drag line at the bottom of the plate lags behind the same line at the top. It is easy to measure on a broken-off sample and is a direct record of how far the burning front trailed the torch. A small drag means the jet kept oxygen and momentum to the bottom; a large drag means it did not. Expressing drag as a percentage of thickness makes it comparable between plates.

## What the slag says

The 1921 report adds an observation about the underside of the cut that is easy to overlook. A completely oxidised slag tended to cling to the bottom edge, and excess oxygen undercut the edge and made the slag hold more firmly, leaving a rough lower corner. With the oxygen correctly proportioned, a slightly metallic slag formed, the metal in it being iron blown out before it was fully oxidised. That slag also clung, but it could be stripped off in long pieces, leaving a smooth, sharp lower edge. A 6 inch section in the report, cut with such a slag, was one of its examples of very good work.

The investigator used the slag as evidence of waste. In cutting 2 inch plate, practically none of the slag showed metallic character; it was fully oxidised. Together with the oversized preheat flames, that suggested the torches were heating and burning more metal than the cut required, giving a wider kerf than necessary and using the oxygen poorly. A fully oxidised, tenacious slag on a modern cut can be read in the same way: a sign to check whether the oxygen or the preheat is more than the thickness needs.

## Stand-off, distortion and kerf

The distance between the nozzle and the plate matters as much as any gas setting. The preheat flames work best with the tips of their inner cones close to, but not touching, the steel, and the jet loses its shape the further it travels through air before entering the kerf. TWI's fault table shows the cost of running too high: an uneven face, a melted top edge and coarse drag at the bottom. Running too low risks the tip touching the plate or catching spatter, which Chapter 6 showed is one of the routes to backfire.

The 1921 investigators found that even their machine-guided cuts needed one manual adjustment, the stand-off, because the plate warped as it was cut. Heating a narrow strip along the kerf expands it, the cooler plate restrains it, and the plate bows. Long, narrow strips move the most. A modern track machine or profile cutter may have a height follower to keep the stand-off constant, but on a hand-guided or simple track machine the operator still has to watch for it, and a cut that starts well can degrade along its length as the plate moves.

Kerf width also decides the size of the part. If the torch follows a line drawn at the part's edge, half the kerf falls each side of it unless the path is offset. This is an illustration. If the kerf on the base plates widens from 2.0 mm to 2.6 mm because the preheat or oxygen is excessive, and the operator keeps the nozzle on the centreline of the marked line, each cut edge moves inward by an extra 0.3 mm. A plate cut on two opposite sides ends up about 0.6 mm smaller than intended. For a painted base plate that rarely matters; for a part that must fit against another, the kerf belongs in the cutting programme or the marking-out, and a change in kerf is a change in part size. The 1921 observation that oversized preheat flames widened the kerf therefore has a dimensional cost as well as a gas cost.

## Specifying the quality you need

A cut edge can be specified, not just inspected. ISO 9013 classifies thermal cuts by tolerance ranges for the squareness or angularity of the cut face and for its surface roughness, among other characteristics, so that a drawing can call up the quality a part needs. Its values are not reproduced here; the point is that "good cut" can be written down in terms a supplier and an inspector can check. A base plate whose edges will be painted and never fitted needs a different class from an edge that will be welded or fitted against another part.

## A failure: the operator who chased speed

This is an illustration. Behind schedule, the track-machine operator raised setting B's travel from 400 to 460 mm/min. The cut still separated, and the change saved about 13% of the cutting time, since 400 ÷ 460 ≈ 0.87. At the end of the shift, the supervisor broke a sample from an offcut and measured the drag. At 400 mm/min the drag had been about 2 mm on the 25 mm plate, 8% of thickness. At 460 mm/min it was about 5 mm, 20%, with angled drag lines and slag welded to the bottom edge. On two plates the cut had lost penetration near a corner and had to be restarted, leaving a gouge.

The time saved in cutting was lost several times over in slag removal, restarts and grinding the gouges. The measured drag made the problem visible before it reached the remaining plates. The setting sheet was amended to give the speed as a band with the maximum drag allowed, so that an operator who needed to adjust speed could check the result against a number rather than against whether the cut separated.

## Choosing between B and C

The trial of Chapter 1 left the workshop choosing between setting B, with its square top edge and clean face, and setting C, 5% faster but with local gouging on the face and 26% more cutting oxygen. The 1921 findings explain C's behaviour: it raised velocity and oxygen together, past the point where the jet's extra oxygen was being used. TWI's fault table explains its gouging: oxygen flow too high, with turbulence between jet and preheat.

For base plates whose faces will be painted, either might be acceptable to the eye. The workshop chose B because its edges needed no grinding before the stiffeners were welded and because it ran comfortably within the acetylene withdrawal limit of Chapter 3. Chapter 9 checks whether that choice also holds on cost.

```figure
type: decision
title: Choosing a setting for a cut
question: What does the edge have to do?
caption: Quality decides which settings are eligible; cost then chooses among them.
- Painted, not fitted | Is appearance specified? | widest choice of settings
- *Welded later | Does the top edge need grinding? | square edge; modest preheat
- Fitted to another part | Which ISO 9013 class is called up? | tight drag limit; possibly machine edge
- Hardenable steel | Will the edge be hard? | preheat before cutting; see Chapter 10
```

## Exercise: more oxygen at the same velocity

Setting C's problem was that it raised oxygen and velocity together. Calculate the velocity index if setting C's 5.8 m³/h of cutting oxygen were passed through a 1.8 mm bore instead of 1.6 mm, and compare it with setting B.

The area of a 1.8 mm bore is π × 0.0018² ÷ 4 ≈ 2.545 × 10⁻⁶ m². The index is 5.8 ÷ (3,600 × 2.545 × 10⁻⁶) ≈ **633 m/s**, almost exactly setting B's 636 m/s. That is the condition of the 1921 finding 1: more oxygen at the same velocity and preheat, which generally gives more speed. Whether it gives enough more to pay for the oxygen is a question for a trial, run as in Chapter 1, and a cost calculation, as in Chapter 9.
