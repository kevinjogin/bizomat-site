---
book: plastic-parts-by-the-numbers
chapterSlug: shrinkage-warpage-and-tolerances
order: 6
title: "Shrinkage, warpage and realistic tolerances"
description: "Size the mould from published shrinkage, set tolerances that moulding can hold, check the fit through temperature and keep critical dimensions steel safe."
draft: false
---

Every moulded part is smaller than the mould that made it. The plastic enters as a hot, expanded melt and shrinks as it cools and solidifies, first in the mould and then for hours or days afterwards. The toolmaker allows for this by cutting the mould oversize. How much oversize depends on the material, the wall thickness, the direction of flow, the packing pressure, the mould temperature and how much the mould restrains each feature, so the allowance is an informed estimate rather than a constant.

This chapter sizes the cover's mould from the material data, turns the uncertainty in shrinkage into realistic tolerances, checks the cover's fit to the box across its temperature range and looks at the warpage that uneven shrinkage produces.

## What the shrinkage figure on a data sheet means

The reference polycarbonate's data sheet gives a moulding shrinkage of 0.65% parallel to the flow and 0.70% normal to it, measured on a 60 × 60 × 2 mm plaque at a holding pressure of 500 bar under a standard test method. Those numbers describe that plaque, moulded that way. A real part has different thicknesses, flow lengths, packing and restraint, and it may shrink more or less.

The Covestro design guide explains how to adjust. It advises tending towards the lower end of the published range for parts thinner than about 0.100 inch, roughly 2.5 mm, and for highly constrained features, such as the distance between holes, which the mould restrains as the part cools. Packing reduces shrinkage, so regions near the gate, which pack well, shrink less than distant thick regions. It also notes that the most accurate values for a new mould usually come from measuring parts from an existing mould running a similar part in the same material.

For the cover, with a 2.5 mm wall and an easy-flow grade, the toolmaker adopts 0.65% in the direction of the cover's length, along which most of the flow will run from a central gate, and 0.70% across its width. A mould flow analysis, described in Chapter 7, could refine those values.

## Size the mould

If a part dimension L must result after a fractional shrinkage S, the mould dimension is **L / (1 − S)**. Many toolmakers use the close approximation **L × (1 + S)**, which differs by a negligible amount at these shrinkages.

```figure
type: formula
title: Sizing the cavity for shrinkage
formula: L_mould = L_part / (1 − S)
caption: S is the fractional shrinkage. For shrinkages under 1%, L_part × (1 + S) agrees to within a few thousandths of a millimetre over the cover's size.
- L_part | Required part dimension after shrinkage, mm
- S | Expected shrinkage, as a fraction
step: Length: 160.00 / (1 − 0.0065) ≈ 161.05 mm in the mould
step: Width: 100.00 / (1 − 0.0070) ≈ 100.70 mm in the mould
step: Uncertainty of ±0.1% in S over 160 mm: ±0.16 mm in the part
```

The last line of the figure is the important one. If the real shrinkage turned out 0.1 percentage point higher or lower than assumed, the cover's length would be about 0.16 mm shorter or longer than intended. That is the scale of uncertainty on a first mould before trial parts are measured, and it sets a floor on what tolerances are realistic until the mould has been proven and, if necessary, adjusted.

## Keep the first cut steel safe

Chapter 4 introduced steel-safe design for ribs. The same idea governs critical dimensions. The cover's skirt must fit inside the box opening. If the first parts are too large, they will not fit; if they are slightly small, they will fit with a little more clearance. The toolmaker therefore cuts the cavity so that the first parts come out at the small end of the tolerance. If trial parts are smaller than wanted, the cavity can be opened up by removing steel. If the cavity had been cut large and the parts came out too big, steel would have to be added.

The Covestro guide recommends designing critical features and dimensions steel safe for exactly this reason: to make the correction of errors in shrinkage prediction simple. The brief and the drawing should say which dimensions are to be cut steel safe and in which direction, because only the designer knows which way a dimension can safely err.

## Set tolerances that moulding can hold

Moulded parts cannot hold the tolerances of machined metal, and a drawing that demands them either drives up cost or is quietly ignored. The international standard for moulded-part tolerances, ISO 20457, provides a framework that relates achievable tolerance to the material, the size of the dimension and whether it is affected by the mould's parting line or moving parts. The moulder can say which tolerance group their process achieves for the chosen material, and that is the starting point for any tolerance on the drawing.

Not every dimension needs a specific tolerance. The cover has a short list of dimensions that are critical to its function:

1. the skirt's outside length and width at the open edge, which set the fit to the box;
2. the positions of the two boss holes relative to the hooks, which must align with the box's screw holes;
3. the height of each catch below the top, which sets the snap fit's undercut;
4. the flatness of the top, which affects the seal at the box's edge and the appearance.

Everything else can carry a general tolerance from the drawing's title block, chosen with the moulder. Concentrating attention on a short list makes inspection practical and tells the moulder where process control matters.

## Check the fit to the box

This is an illustration. The box's opening is 161.0 mm long with a tolerance of ±0.3 mm, typical of folded sheet metal. The cover's skirt is 160.0 mm long at the open edge, with a tolerance of ±0.25 mm agreed with the moulder. At 20 °C:

- Smallest total clearance: **(161.0 − 0.3) − (160.0 + 0.25) = 0.45 mm**, about 0.22 mm per side.
- Largest total clearance: **(161.0 + 0.3) − (160.0 − 0.25) = 1.55 mm**, about 0.78 mm per side.

The cover always fits at 20 °C, though the clearance can be as small as 0.22 mm per side.

## Carry the fit through temperature

Polycarbonate expands far more than steel when it warms. The reference grade's expansion coefficient is 0.65 × 10⁻⁴ per kelvin, or 65 × 10⁻⁶, against about 12 × 10⁻⁶ for steel. Over the cover's 160 mm length, the difference in growth is **(65 − 12) × 10⁻⁶ × 160 ≈ 0.0085 mm per kelvin**.

At the brief's maximum of 60 °C, 40 K above the 20 °C at which parts are measured, the cover grows about **0.0085 × 40 ≈ 0.34 mm** more than the box, or about 0.17 mm per side. At 0 °C, 20 K below, it shrinks about 0.085 mm per side relative to the box.

```figure
type: range
title: Clearance per side between skirt and box across temperature
min: 0
max: 1
unit: mm
caption: Worst-case tolerance ranges with differential expansion. At 60 °C the tightest combination leaves about 0.06 mm per side, enough to fit but with little margin.
ticks: 0 | 0.25 | 0.5 | 0.75 | 1.0
- *60 °C, hottest | 0.06 | 0.61
- 20 °C, as measured | 0.22 | 0.78
- 0 °C, coldest | 0.31 | 0.86
```

The cover still fits in the worst combination at 60 °C, with about **0.225 − 0.17 ≈ 0.06 mm** per side. That is very little. A cover at the large end of its tolerance, fitted to a box at the small end of its tolerance, might bind when hot. The team has three options: tighten the cover's tolerance, which the moulder may achieve once the mould is proven; increase the nominal clearance slightly, at some cost to appearance; or accept the risk with the knowledge that the cover sits loosely in the opening and is held by its hooks and screws, not by the skirt. They choose to reduce the nominal skirt length by 0.1 mm, which the steel-safe cavity allows easily, raising the hot worst case to about 0.11 mm per side. The BIZOMAT [plastic and metal thermal mismatch calculator](/tools/plastic-thermal-mismatch/) repeats this calculation for other materials and lengths.

## Align the screws with the box's holes

The second critical dimension is the position of the two boss holes. The screws pass through clearance holes in the box's flange into the bosses. If a boss is out of position by more than the clearance allows, the screw will not start, or it will start at an angle and strip the boss.

This is an illustration. The box's holes are Ø3.4 mm for the 2.9 mm screws, leaving **(3.4 − 2.9) / 2 = 0.25 mm** of radial float. The box supplier holds hole positions to ±0.2 mm, and the moulder proposes ±0.15 mm for the boss positions relative to the hooks. In the worst case the two errors add to **0.15 + 0.2 = 0.35 mm**, more than the 0.25 mm of float.

Temperature adds a second effect. The bosses sit about 150 mm from the hooks along the cover's length. The cover is fitted at room temperature, but at 60 °C the distance between hooks and bosses grows about **(65 − 12) × 10⁻⁶ × 150 × 40 ≈ 0.32 mm** more than the matching distance on the box. With the hooks located and the screws tight, that growth has nowhere to go, and the cover would either bow or load its bosses sideways.

```figure
type: compare
title: Options for the screw holes in the box flange
cols: Float available | Worst position error | Thermal growth absorbed
caption: Teaching values. A slot along the cover's length absorbs both position error and differential expansion, which a round hole cannot.
- Ø3.4 round hole | 0.25 mm radial | 0.35 mm | No
- Ø3.8 round hole | 0.45 mm radial | 0.35 mm | Partly, with screw head bearing on a smaller land
- *3.4 × 4.4 mm slot along the length | 0.25 mm across, 0.75 mm along | 0.35 mm | Yes, along the length
```

A slot in the box's flange, elongated along the cover's length, solves both problems: it allows the cover to grow relative to the box without loading the bosses, and its extra length absorbs position error in that direction. The cross-slot float of 0.25 mm still needs the position tolerances across the width tightened, or the moulder's ±0.15 mm accepted with the box supplier holding ±0.1 mm across the width. The change is on the box, not the cover, and is cheap for a punched sheet metal part. It is the kind of solution that appears only when the moulded part and its mating part are reviewed together.

## Understand warpage

Warpage is distortion caused by uneven shrinkage. If one face of a flat panel shrinks more than the other, the panel bows towards the side that shrank more. If one direction shrinks more than the other, a panel can twist. The causes are mostly the same as for sink: uneven wall thickness, uneven cooling and uneven packing.

A flat cover with ribs on one side is prone to bowing. The Covestro guide explains that in unfilled materials with fairly uniform shrinkage, ribs thinner than the wall tend to solidify earlier and shrink less than the base wall, so the ends of a ribbed panel may warp away from the ribbed side; as rib thickness approaches the wall, the effect reverses. It recommends extra mould cooling on the ribbed side to compensate for the heat load the ribs add.

## A failure case: the cover that rocked

This is an illustration. At the first trial, covers measured on a surface plate were found to bow by about 0.6 mm at the centre, with the outer face convex. The brief's flatness requirement, agreed with the moulder, was 0.5 mm. The covers rocked slightly when placed on the box and left a visible gap at one end before the screws were tightened.

Two checks pointed to the cause. A thermal camera image of the mould at opening showed the core side, with its rib slots, running about 8 °C hotter than the cavity side. And the bow was the same direction and size on every cavity sample, which ruled out random process variation. The core side was cooling more slowly, so the ribbed face shrank later and more, pulling the panel into a bow.

The fix did not need a design change. The moulder adjusted the coolant flow to the core and lowered its temperature, and the toolmaker added a cooling line under the rib grid that had been omitted to save cost. The bow fell to about 0.2 mm. The lesson for design is to tell the toolmaker, in the brief, that the part is a ribbed flat panel with a flatness requirement, so that balanced cooling is designed in from the start rather than added after the first trial.

## Measure at the right time and temperature

Moulded parts keep changing for a while after ejection. They continue to cool, and in some materials they continue to shrink slowly as internal stresses relax and the material absorbs or loses moisture. Polycarbonate absorbs relatively little water, but its dimensions should still be measured after a defined conditioning period and temperature, agreed in the brief, not straight from the machine. A common practice is to condition parts for 24 hours at a controlled room temperature before measuring, and to record the conditions on the inspection report.

## Exercise: a tighter tolerance request

The box supplier proposes tightening the opening's tolerance to ±0.15 mm. With the cover's revised nominal length of 159.9 mm and ±0.25 mm tolerance, what are the smallest clearances per side at 20 °C and at 60 °C?

**Worked answer.** At 20 °C, the smallest total clearance is **(161.0 − 0.15) − (159.9 + 0.25) = 0.70 mm**, or 0.35 mm per side. At 60 °C, subtracting the differential growth of about 0.17 mm per side leaves about **0.35 − 0.17 = 0.18 mm** per side. The tighter box tolerance raises the hot worst-case clearance from about 0.11 mm, with the revised nominal alone, to about 0.18 mm, and from the original 0.06 mm it roughly triples it, which may justify its cost if the box supplier can hold it routinely.
