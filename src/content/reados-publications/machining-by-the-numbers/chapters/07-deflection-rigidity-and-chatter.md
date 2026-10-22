---
book: machining-by-the-numbers
chapterSlug: deflection-rigidity-and-chatter
order: 7
title: "Deflection, rigidity and chatter"
description: "Estimate tool and workpiece deflection with cantilever formulas, see why overhang and diameter dominate, and recognise and reduce chatter before it limits accuracy and output."
draft: false
---

A machine can have ample power and the cutting data can be perfectly chosen, yet the part comes out tapered, oversize or covered in chatter marks. The usual cause is not the cut itself but the structure carrying it: a long end mill, a slender shaft, a boring bar reaching deep into a bore, or a part clamped where it can flex. Under cutting forces, everything bends a little. When the bending is large enough to matter, it limits accuracy and productivity before power does.

This chapter shows how to estimate deflection with the simplest structural model, why overhang and diameter dominate the result, and what chatter is and how to reduce it.

## The cantilever model

Most cutting tools, and many workpieces, behave roughly like a cantilever: a beam fixed at one end with a load at the other. Standard beam theory, found in any mechanical design text, gives the deflection at the loaded end as:

**δ = F × L³ ÷ (3 × E × I)**

where F is the force perpendicular to the beam, L the overhang, E the elastic modulus of the material and I the second moment of area of the cross-section. For a solid round section of diameter d:

**I = π × d⁴ ÷ 64**

Two features of these formulas explain most deflection problems in machining:

- deflection grows with the **cube** of overhang, so a 33% longer overhang more than doubles it; and
- stiffness grows with the **fourth power** of diameter, so a modestly smaller tool is much more flexible.

```figure
type: svg
title: A cutting tool behaves like a cantilever
alt: An end mill clamped in a holder projects a length L. A radial cutting force F at its tip bends it by a deflection delta, exaggerated in the drawing.
caption: δ = F × L³ ÷ (3 × E × I). Deflection grows with the cube of overhang and stiffness with the fourth power of diameter.
viewbox: 0 0 640 280
body:
<rect class="bx" x="40" y="80" width="150" height="120" rx="4"/>
<text class="tx" x="115" y="145" text-anchor="middle">Holder</text>
<rect class="lf dsh" x="190" y="122" width="300" height="36"/>
<path class="bxa" d="M190 122H490Q496 150 488 158H190Z"/>
<path class="la draw" pathLength="1" d="M190 140Q360 142 492 160"/>
<path class="la flow" d="M580 168H506"/>
<path class="ah" d="M506 162L492 168L506 174Z"/>
<text class="txb" x="590" y="172">F</text>
<path class="li" d="M190 230H490M190 222V238M490 222V238"/>
<text class="txb" x="340" y="254" text-anchor="middle">Overhang L</text>
<path class="ln" d="M520 140V160M512 140H528M512 160H528"/>
<text class="txa" x="540" y="126">δ, exaggerated</text>
```

The model is approximate. Real tools are not uniform cylinders, holders and spindles flex too, and the fixed end is never perfectly rigid. But it captures the trends reliably and gives realistic orders of magnitude.

## End mill deflection

A fluted end mill is less stiff than a solid bar of the same diameter. A common approximation treats it as a solid bar of about 80% of its diameter, although the true figure varies with flute count and core diameter.

This is an illustration. Harbourline's bracket profiling job from Chapter 4 uses a Ø16 solid carbide end mill with 48 mm projecting from the holder. Take E = 600,000 N/mm² for cemented carbide, an effective diameter of 0.8 × 16 = 12.8 mm and an assumed radial cutting force of 400 N acting near the tip.

- I = π × 12.8⁴ ÷ 64 = 1,318 mm⁴
- δ = 400 × 48³ ÷ (3 × 600,000 × 1318) = **0.019 mm**

| Change | Deflection | Ratio to baseline |
|---|---|---|
| Baseline: Ø16 carbide, 48 mm overhang | 0.019 mm | 1.0 |
| Overhang increased to 64 mm | 0.044 mm | 2.37 |
| Same geometry in a steel-bodied tool, E = 210,000 N/mm² | 0.053 mm | 2.86 |
| Ø12 carbide, 48 mm overhang | 0.059 mm | 3.16 |

Increasing the overhang by a third, from 48 to 64 mm, multiplies deflection by (64 ÷ 48)³ = 2.37. Dropping from Ø16 to Ø12 at the same overhang multiplies it by more than three. Carbide's high stiffness, nearly three times that of steel, is a major reason solid carbide tools hold size on long reaches.

```figure
type: line
title: Deflection of a Ø16 end mill under 400 N against overhang
x: Overhang from holder (mm)
y: Tip deflection (mm)
legend: Solid carbide, E 600 GPa | Steel body, E 210 GPa
ymin: 0
ymax: 0.25
mark: 48 | Harbourline set-up
caption: Effective diameter 12.8 mm. A third more overhang more than doubles deflection; steel bends almost three times as much as carbide.
- 32 | 0.0055 | 0.0158
- 40 | 0.0108 | 0.0308
- 48 | 0.0187 | 0.0533
- 56 | 0.0296 | 0.0846
- 64 | 0.0442 | 0.1263
- 72 | 0.0629 | 0.1798
- 80 | 0.0863 | 0.2467
```

A deflection of 0.019 mm may be acceptable for a bracket wall with a tolerance of ±0.05 mm. On a wall toleranced at ±0.02 mm it is not. The tool bends away from the wall most at the tip, so the wall comes out tapered, thicker at the bottom than at the top. Remedies include shorter projection, a larger cutter, lighter finishing cuts with a constant small radial engagement, or a spring pass that repeats the finish path to remove material left by deflection.

## Workpiece deflection in turning

Slender workpieces deflect in the same way. A Ø20 steel shaft held in a chuck with 80 mm projecting, and an assumed radial cutting force of 500 N at its end, deflects by:

- I = π × 20⁴ ÷ 64 = 7,854 mm⁴
- δ = 500 × 80³ ÷ (3 × 210,000 × 7854) = **0.052 mm**

The part springs away from the tool, so the diameter at the free end is left oversize by about twice that amount, around 0.1 mm, and the shaft comes out tapered. Halving the projection to 40 mm reduces the deflection to 0.0065 mm, an eighth of the original.

Supporting the free end changes the structure completely. A tailstock centre turns the cantilever into a beam supported at both ends, which is many times stiffer. A steady rest supports long parts in between. Many shops bring up the tailstock once the unsupported length exceeds roughly three to four times the diameter and use a steady rest for much longer parts, but the right limit depends on the tolerance, the cutting forces and the material. Reducing the radial force helps too: a sharp insert with a small nose radius and a 90° or greater entering angle pushes the work less.

## Boring bars

Internal turning combines both problems: the boring bar must be thinner than the bore and must reach its full depth. Suppose a Ø32 bar must reach 160 mm into a bore, five times its diameter, with an assumed radial force of 300 N:

- A steel bar deflects about 0.038 mm.
- A solid carbide bar of the same size deflects about 0.013 mm.

Tool suppliers typically suggest steel boring bars for overhangs up to about four times the bar diameter, carbide bars for up to about six times, and tuned, damped bars for longer reaches, sometimes ten times or more. Those limits are about vibration as much as static deflection, because a long, flexible bar has a low natural frequency and is prone to chatter.

The Harbourline flange's Ø40 bore is only 30 mm long. A bar of about Ø32 at little more than one diameter of overhang is very stiff, so deflection is not a concern there.

## What chatter is

Chatter is a self-excited vibration. It starts when the tool or workpiece vibrates slightly and leaves a wavy surface. On the next revolution or the next tooth pass, the edge meets that wavy surface, so the chip thickness varies, so the cutting force varies, which drives the vibration further. If the system's damping cannot absorb the energy fed in, the vibration grows until it is limited by the tool leaving the cut. The result is a loud, characteristic noise, a patterned surface, and rapid tool wear or edge chipping.

Because each pass cuts over the surface left by the previous one, this mechanism is called **regenerative chatter**. Whether a cut chatters depends on the depth of cut, the stiffness and damping of the tool, holder, spindle, workpiece and fixture, and the spindle speed. Research on machining dynamics, such as the work summarised by Altintas in the references, shows the stable depths of cut as a series of lobes against spindle speed: at certain speeds a much deeper cut is stable than at others.

Chatter differs from **forced vibration**, which comes from an outside source such as an unbalanced spindle, a damaged bearing or interrupted cuts, and repeats at a fixed frequency regardless of depth of cut.

## Reducing chatter

Practical remedies, roughly in order of how often they work:

1. **Reduce the depth or width of cut.** Chatter is strongly linked to how much of the cutting edge is engaged.
2. **Shorten and stiffen.** Reduce tool overhang and workpiece projection; use the largest practical tool and holder; tighten fixtures and support thin walls.
3. **Change spindle speed.** Moving the speed by a modest amount, up or down, can move the cut from an unstable region into a stable lobe, particularly at higher spindle speeds. It is a trial, not a guarantee.
4. **Use sharper, freer-cutting geometry.** Positive rake, sharp edges and small nose radii reduce cutting and radial forces.
5. **Use variable-pitch or variable-helix cutters.** Uneven tooth spacing disrupts the regenerative effect.
6. **Add damping.** Damped boring bars and holders absorb vibration energy.

```figure
type: steps
title: Working through a chatter problem
caption: Change one thing at a time and note the result, so the fix can be repeated on the next job.
- Reduce engagement | less depth or width of cut
- Shorten and stiffen | tool overhang, part projection, fixture
- *Try another speed | a modest change can reach a stable lobe
- Freer-cutting tool | positive rake, sharp edge, small nose radius
- Uneven pitch | variable-pitch or variable-helix cutters
- Add damping | damped bars and holders
```

## Common mistakes

- **Long tools by habit.** Using the tool that happens to be in the magazine, at whatever length it is set, rather than the shortest that reaches.
- **Small tools where large ones fit.** Stiffness falls with the fourth power of diameter.
- **Fixing deflection with more finishing passes** before addressing overhang or support.
- **Assuming lower speed always helps chatter.** Sometimes it makes it worse.
- **Ignoring the fixture.** A rigid tool on a flexible part or clamp still vibrates.

## Questions to ask

- What is the shortest overhang that reaches the feature, and the largest tool that fits?
- How much will the tool or part deflect under the expected radial force, and how does that compare with the tolerance?
- Is the workpiece adequately supported for its length and diameter?
- Is this vibration chatter, which changes with depth of cut, or forced vibration from another source?

## Exercise: estimate deflection on a real set-up

Choose a long tool or slender part in your workshop. Measure the overhang and diameter, estimate the radial force as about a third to a half of the tangential force from Chapter 6, and calculate the deflection. Then recalculate with the overhang reduced by 25%. Compare the predicted change with the size and taper of parts made each way.

Deflection and power set the limits of what a cut can be. The next chapter turns to how long the tool will survive the cut, and the relationship that F. W. Taylor discovered more than a century ago.
