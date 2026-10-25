---
book: resistance-welding-by-the-numbers
chapterSlug: butt-and-flash-welding
order: 8
title: "Butt and flash welding"
description: "Join bar, rod and rings end to end: resistance butt and flash welding, length lost to flashing and upset, current lost around a ring, clamping and bend testing."
draft: false
---

Spot, seam and projection welds join overlapping sheet. Butt and flash welds join parts end to end across their whole cross-section in one operation: wire and rod in resistance butt welding, bar, strip, tube, rail and rings in flash welding. The parts are gripped in copper clamps, current passes from one clamp to the other through the joint, the ends heat, and the clamps are driven together to forge them into one piece. This was the original resistance process, the one Elihu Thomson developed in 1886, and it was the most developed part of Hamilton and Oberg's 1918 treatise.

This chapter flash-welds the cabinet's base ring. It works out how much length the weld consumes, why a ring takes more current than a straight bar, how hard the clamps must grip, and how the weld is tested.

## Two processes

**Resistance butt welding**, also called upset welding, presses the two ends together first and then passes current. The heat comes from the contact resistance at the interface and the resistance of the metal near it, and when the ends reach forging temperature they are pushed together, upsetting the metal into a collar. TWI describes it as joining components of similar cross-section in one operation across the whole joint, typically for wires and rods up to about 16 mm diameter. Larger sections are difficult, because the interface heats unevenly and oxide trapped in the joint is not expelled.

**Flash welding** brings the ends together lightly while current flows, so they touch only at a few points. Each contact point melts and is blown out as a shower of sparks, the flash, burning away surface irregularities and oxide. The parts are advanced steadily to keep flashing until the whole end faces are uniformly molten and the metal behind them is hot. Then the current is cut and the parts are upset rapidly. TWI describes the result as a forge butt weld with no melted metal remaining in the joint: the molten layer and its oxides are squeezed out into the upset collar, which is later trimmed off.

```figure
type: steps
title: The stages of a flash weld
caption: Flashing heats the ends and cleans them; upset forges them together and expels the molten layer into the collar.
- Clamp | parts gripped in copper dies with a set projection
- Flash | parts advanced while current flows; contact points melt and are expelled
- *Upset | current cut; parts driven together rapidly under high force
- Hold and release | weld cools under force; dies open
- Trim | upset collar sheared or ground flush
```

Hamilton and Oberg made several points that still apply. The secondary voltage of butt welding transformers varied between one and seven volts depending on section and material. The work had to project a set distance from the clamping jaws, which depended on the material and section, so that heating and upset happened in the right place. Copper, brass and high-carbon steel had to be welded very rapidly with higher current. And they noted that endless pieces, such as rings, need more power than straight pieces of the same section, which this chapter calculates.

## The base ring

This is an illustration. The cabinet stands on a base ring of 40 × 5 mm low carbon steel flat bar, rolled into a 600 × 400 mm rectangle with radiused corners and joined by one flash weld in the middle of a long side. The cross-section is 40 × 5 = **200 mm²**. The finished centreline perimeter is 1,980 mm.

The shop's flash welder has a 50 kVA transformer and hydraulic clamping and upset. Trials on straight pieces of the bar settled its schedule: flashing for about 4 s, with 4 mm of flashing loss from each piece, followed by an upset of 2.5 mm from each piece at an upset force of 12 kN.

## Length lost to flashing and upset

A flash weld consumes material. Each piece loses length during flashing, as metal is burnt away, and again during upset, as metal is pushed out into the collar. The cut length of the bar must allow for both.

```figure
type: formula
title: Cut length of the base ring bar
formula: cut length = finished length + flashing loss + upset loss
caption: This is an illustration. Losses are for both ends together; the bar is bent into a ring so that its two ends meet at the weld.
- finished length | centreline perimeter, 1,980 mm
- flashing loss | 4 mm from each end, 8 mm total
- upset loss | 2.5 mm from each end, 5 mm total
step: cut length = 1,980 + 8 + 5
step: cut length = 1,993 mm
```

Getting this wrong is a common cause of out-of-size parts. A ring cut to 1,980 mm would finish 13 mm short in perimeter, roughly 6.5 mm short on the long side, which is enough to stop the cabinet sitting square. Because the flashing loss varies a little from weld to weld, the shop measures the finished perimeter of the first rings of each batch and adjusts the cut length if needed.

## The current that goes the long way round

When the two ends of a ring are clamped for welding, there are two paths between the clamps. One goes through the joint, as intended. The other goes the long way round the ring itself. The two are in parallel, so the current divides between them in inverse proportion to their resistances, the same principle as shunting in Chapter 5, but on a much larger scale.

This is an illustration. The ring path is 1,980 mm of cold steel bar. With a resistivity of about 0.15 µΩ·m for cold low carbon steel, its resistance is 0.15 × 10⁻⁶ × 1.98 ÷ (200 × 10⁻⁶) ≈ **1.49 mΩ**. Suppose the joint presents about 0.5 mΩ during heating, a representative figure for a flashing joint. The fraction of the current going round the ring is then 0.5 ÷ (0.5 + 1.49) ≈ **25%**.

```figure
type: bars
title: Share of welding current going round the ring instead of through the joint
unit: % of secondary current
max: 45
caption: This is an illustration with a joint resistance of 0.5 mΩ and 40 × 5 mm bar. The smaller the ring, the shorter and lower in resistance the shunt path, and the more current it takes.
- *1.98 m ring (cabinet base) | 25.2
- 1.2 m ring | 35.7
- 1.0 m ring | 40.0
```

So a quarter of the current heats the ring rather than the joint, and the transformer must deliver about a third more current than for a straight bar to put the same current through the joint. That is the calculation behind Hamilton and Oberg's remark that rings need more power as their diameter decreases. In practice the ring path heats a little and its resistance rises, but that does not change the conclusion.

Two practical consequences follow. A schedule developed on straight pieces must be re-checked on rings, because the joint receives less current. And very small rings may shunt so much current that they cannot be flash welded on a given machine, which is why small rings are often made by other methods.

## Clamping and upset force

The clamps must carry the current into the bar without arcing or burning its surface, and they must grip hard enough that the bar does not slip when the upset force is applied. Slip during upset gives a short upset, a weak weld and burnt clamp marks.

This is an illustration. The upset force of 12 kN on the 200 mm² section is a mean upset pressure of 12,000 ÷ 200 = **60 MPa**. The force is resisted by friction between each bar and its clamping die. With a friction coefficient of about 0.3 between the dies and the bar, and the bar gripped on two faces, each die needs a clamping force of at least 12 ÷ (2 × 0.3) = **20 kN** to resist slip. The shop's welder clamps at 30 kN, a margin of 1.5. Many dies also include a shoulder or backstop behind the bar for large sections, which takes the upset force directly.

The die faces must be clean, flat and in good contact with the bar along their length. A die face with spatter, scale or a worn patch carries current through a few small contact points, which heat and burn the bar surface. Hamilton and Oberg described water-cooled copper clamping jaws on the larger machines of 1918, and modern machines still use them.

## Material, section and projection

The distance each piece projects from its die controls how the heat is distributed. Too little projection and the dies cool the joint and restrict the upset; too much and the hot zone is long, the upset buckles sideways instead of forging squarely, and the parts can misalign. Hamilton and Oberg showed different projections for different materials and weld types, and noted special arrangements for welding strip into a tee, where the two parts have very different volumes near the joint.

Dissimilar sections and materials need matching heat. A thick piece welded to a thin one heats more slowly, so the thin piece is given more projection or the thick one is shaped to a matching section at the joint. Hamilton and Oberg described butt welding high-speed steel tool bits to low-carbon steel shanks, an early example of using the process to save expensive material.

## Power, time and energy

Butt and flash welds are slow by spot welding standards, seconds rather than fractions of a second, because a whole cross-section must be heated. Their energy use follows the same rule as Chapter 1: more power for less time usually means less energy, because less heat is conducted away into the bar and the dies while the joint comes up to temperature.

Hamilton and Oberg's figures from 1918 show the scale. Their example of a one-inch round wrought-iron rod, about 507 mm² in section, could be welded with 15 kW for fifteen seconds or 23 kW for six seconds, using 225 kJ or 138 kJ respectively. They described a pipe-welding machine for tubes up to 4 inches diameter with a capacity of 60 kW for 50 seconds, which made 100 welds with 83 kWh. The two figures agree: 60 kW for 50 s is 3,000 kJ, or 0.83 kWh per weld, and 100 welds take 83 kWh.

This is an illustration. For the cabinet's base ring, with the 50 kVA machine flashing for about 4 s and then upsetting, suppose the real power during flashing averages 30 kW. The flashing energy is then about 30 × 4 = 120 kJ, roughly 0.033 kWh, a few cents of electricity per ring. As with spot welds, energy is a minor part of the cost; the machine time, the bar lost to flashing and upset, and the trimming are what matter.

Flashing also has a quality purpose beyond heating. The metal blown out as flash carries the surface oxide and dirt with it, so a stable, continuous flash right up to the moment of upset leaves clean metal to forge together. If flashing is interrupted, even briefly, the hot end faces oxidise in the air before upset, which is a classic cause of the flat spots described below.

## Testing flash welds

A flash weld that looks good after trimming can still contain flat spots, areas where oxide was trapped in the joint because flashing stopped too early or the upset was too small or too slow. They are thin, flat and almost invisible, and they make the joint brittle. The shop uses three checks:

1. **Bend test.** At the start of each batch, a straight test piece of the same bar is flash welded on the production schedule and bent around a former with the weld at the outside of the bend. Cracking along the weld line indicates flat spots or lack of fusion.
2. **Upset and collar check.** The measured upset distance and the shape of the collar on every weld are compared with the trial values; a short upset or a lopsided collar is rejected.
3. **Finished size.** The perimeter of the first rings of each batch is measured to confirm the cut length allowance.

```figure
type: checklist
title: Flash weld checks for the base ring
caption: This is an illustration of the shop's routine. The bend test finds flat spots that cannot be seen after trimming.
- x Cut length 1,993 mm | adjusted if the first rings measure out of size
- x Die faces clean and flat | no spatter or burnt patches
- x Clamping force 30 kN | twice-daily check of hydraulic pressure
- x Upset distance and collar | on every weld, against trial values
- x Bend test | one straight test piece per batch
- *? Ring schedule | confirmed on rings, not only straight pieces
```

## A failure: cracks along the weld line

This is an illustration. A base ring cracked through its weld when a cabinet was dropped from a forklift during delivery. The fracture face was flat and dull over about a third of the section, with a granular appearance over the rest.

The flat dull area was the signature of a flat spot. The shop's records showed that the flash welder's hydraulic upset valve had been replaced a week earlier, and that since then the upset distance on some welds had been closer to 1.5 mm than 2.5 mm from each piece. With less upset, the molten layer and its oxides were not fully expelled into the collar; some remained in the joint as a film. The bend test, which would have shown it, had been skipped on two batches during a busy week.

The valve was adjusted to restore the upset distance and speed, the upset distance of each weld was added to the machine's recorded data with an automatic reject below 2.2 mm, and the bend test was made a hold point that the next batch cannot start without. The rings welded in the affected period were recalled from stock and tested, and cabinets already delivered were inspected.

## Exercise: a smaller base

A compact cabinet uses a base ring with a finished centreline perimeter of 1,200 mm from the same 40 × 5 mm bar and the same schedule. Calculate the cut length, the ring path resistance and the fraction of current going round the ring. Then work out the total current needed to put 15,000 A through the joint, compared with the large ring.

The cut length is 1,200 + 8 + 5 = **1,213 mm**. The ring path resistance is 0.15 × 10⁻⁶ × 1.20 ÷ (200 × 10⁻⁶) = **0.90 mΩ**, so the fraction going round the ring is 0.5 ÷ (0.5 + 0.90) ≈ **0.357**, about 36%.

To put 15,000 A through the joint, the total must be 15,000 ÷ (1 − 0.357) ≈ **23,300 A**. For the large ring, the total would be 15,000 ÷ (1 − 0.252) ≈ 20,100 A. The smaller ring needs about 16% more total current for the same joint current, so the shop would check that its 50 kVA transformer can deliver it, and re-run the bend tests on the smaller rings before production.
