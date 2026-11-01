---
book: springs-by-the-numbers
chapterSlug: designing-a-compression-spring
order: 3
title: "Designing a compression spring from two working points"
description: "How to design a compression spring from the forces needed at two lengths: rate, free length, wire size for a stress limit, coils, solid length, rounding to stock wire."
draft: false
---

Checking a spring starts from its dimensions and finds its forces. Designing one runs the other way: it starts from the forces a machine needs at two positions and finds a wire, a coil and a number of turns that give them, within a stress the wire can stand and a space the machine has. Two working points are enough to fix a linear spring completely, because they fix its rate and its free length. Everything else is a choice about how to build that rate.

This chapter designs the replacement lock plunger spring for the VM-8's tool changer. It shows how the coil diameter is chosen to fit the space, how the wire is sized for the stress, how the design is rounded to wire that can be bought, and why the result must go back through the checking tool of Chapter 2. Its mistake is rounding the wire the wrong way.

## Two points fix the line

The changer needs the pin held in the notch with at least 50 N, and the shop asked for 55 N at the parked length of 50 mm to allow for tolerance and the small losses of Chapter 1. It also wanted the cam to work against less force than the old spring's 116 N when the pin is pulled back to 38 mm, because the cam follower and its pivot showed wear. It chose 100 N at 38 mm.

Those two points fix everything about the force–length line.

```figure
type: formula
title: A linear spring from two working points
formula: k = (F2 − F1) ÷ (L1 − L2)
formula: L0 = L1 + F1 ÷ k
caption: F1 at length L1 is the lighter working point, F2 at the shorter length L2 the heavier. The free length follows from extending the line back to zero force.
- k | rate, N/mm
- L0 | free length, mm
```

For the plunger: k = (100 − 55) ÷ (50 − 38) = 3.75 N/mm, and L0 = 50 + 55 ÷ 3.75 = 64.67 mm. Any spring with that rate and free length will do the job, whatever it is made of. The design question is which of the many possible springs to make.

## Choosing the coil diameter

The space usually decides the coil diameter. The plunger spring works inside a 23.5 mm bore and over a 15 mm stem, so its outside diameter must stay below about 22.5 mm and its inside diameter above about 16.5 mm, leaving clearance for the coil to grow as it is compressed and for tolerance. A mean diameter between about 18 and 20 mm fits.

Within that range, a larger coil diameter needs a thicker wire to carry the same force at the same stress, but fewer coils to give the same rate, and so a shorter solid length. A smaller coil needs thinner wire and more coils.

## Sizing the wire for the stress

Once the coil diameter is chosen, the stress at the heavier working point depends only on the wire diameter: τ = K × 8 F2 D ÷ (π d³). The designer picks an allowable stress and finds the wire that meets it. Because K also depends on d through the index, this cannot be solved in one line; a short numerical search does it.

The allowable stress for a design is lower than the static allowable of Chapter 2, because the plunger spring cycles with every tool change. The shop chose 500 MPa at the heavier point, about a quarter of the wire's tensile strength, as a starting figure to be confirmed by the fatigue check in Chapter 4. This is an illustration.

The [compression spring designer](/tools/compression-spring-designer/) takes the two working points, the mean coil diameter, an allowable shear stress at the heavier load, the shear modulus, the end type and a minimum clash allowance as a share of the deflection. It returns the rate and free length from the two points, the wire diameter that keeps the Wahl-corrected stress at the heavier load at the allowable, the spring index, the active and total coils, the solid length, the outside and inside diameters, the clash allowance, the stress at solid and the buckling ratio. It treats a round-wire spring under static load and reminds the user to round the wire to an available size and recheck with the compression spring tool.

```figure
type: steps
title: The replacement plunger spring in the compression spring designer
caption: This is an illustration. 55 N at 50 mm and 100 N at 38 mm, mean diameter 20 mm, allowable 500 MPa, G = 79.3 GPa, closed and ground ends, minimum clash allowance 15%.
- Rate / free length | 3.750 N/mm / 64.67 mm
- Wire diameter | 2.282 mm
- Spring index | 8.76
- Active / total coils | 8.96 / 10.96
- Solid length | 25.02 mm
- Outside / inside diameter | 22.28 / 17.72 mm
- Clash allowance | 48.7%: SPRING FEASIBLE
- * Stress at solid | 743 MPa: pressing solid would exceed 1.15 × 500 MPa
- Buckling ratio L₀ ÷ D | 3.23: guide the spring
```

The tool's two warnings are expected. The stress at solid is high because the spring has a long way to go from 38 mm to its solid length of 25 mm; it is below the 800 MPa static allowable of Chapter 2, so a spring pressed solid once in assembly will not take a set, but it should not be driven solid in service. The pin's shoulder stops it at 31 mm. The buckling ratio is above 2.6, and the spring is guided by its bore and stem, as the old one was.

### Comparing coil diameters

Running the designer at three coil diameters shows the trade-off.

```figure
type: compare
title: The plunger spring designed at three coil diameters
cols: Wire, mm | Active coils | Solid length, mm | Stress at solid, MPa
rowhead: Mean diameter
- 18 mm | 2.212 | 10.85 | 28.43 | 679
- 19 mm | 2.248 | 9.84 | 26.60 | 714
- * 20 mm | 2.282 | 8.96 | 25.02 | 743
caption: This is an illustration. All three give 55 N at 50 mm and 100 N at 38 mm at 500 MPa. The larger coil uses less wire and gives more clearance below the working length; the smaller coil gives more clearance in the bore.
```

The differences are small. The shop kept 20 mm, the same mean diameter as the original spring, so the new spring would fit the same bore and stem without any change and could be compared directly with the old one.

## Rounding to stock wire

Nobody sells 2.282 mm wire. Music wire is drawn to a series of standard sizes, and a spring maker will hold some and order others. The nearest sizes either side are 2.2 mm and 2.3 mm.

Changing the wire changes the rate, so the active coils must be recalculated to restore it: Na = G d⁴ ÷ (8 D³ k). For 2.3 mm wire that is 79,300 × 2.3⁴ ÷ (8 × 20³ × 3.75) = 9.25 coils. Spring makers can coil fractional turns, and a quarter turn is normal. With 9.25 active coils and closed and ground ends, the total is 11.25 coils and the solid length 25.9 mm.

That rounded design must go back through the [compression spring check](/tools/compression-spring/), because the designer's figures no longer describe it.

```figure
type: steps
title: The rounded design in the compression spring check, at 38 mm
caption: This is an illustration. 2.3 mm music wire, 20 mm mean diameter, 9.25 active coils, closed and ground, free length 64.7 mm, working length 38 mm, allowable 800 MPa.
- Spring rate | 3.749 N/mm
- Load at 50 mm / 38 mm | 55.1 N / 100.1 N
- * Shear stress at 38 mm | 489 MPa, below the 500 MPa design figure
- Shear stress at solid | 712 MPa: within 800 MPa
- Spring index / Wahl factor | 8.70 / 1.168
- Solid length / clash allowance | 25.87 mm / 12.13 mm
- Natural frequency | 222 Hz
- Slenderness L₀/D | 3.24: guided in its bore
```

The rounded spring meets both working points to within 0.1 N and runs at 489 MPa at the heavier point, slightly below the design stress because the wire is slightly thicker than the designer's figure. Its stress at the pin's 31 mm stop is 618 MPa, which the static allowable covers.

```figure
type: line
title: Force against length, old and new plunger springs
x: Spring length, mm
y: Force, N
caption: This is an illustration. The new spring is softer: it holds the pin with almost the same force but pulls back against the cam with 16 N less. The working range runs from 50 mm, parked, to 38 mm, retracted.
series: Old spring, 4.84 N/mm, free 62 mm | New spring, 3.749 N/mm, free 64.7 mm
- 62 | 0 | 10.1
- 50 | 58.1 | 55.1
- 44 | 87.1 | 77.6
- 38 | 116.2 | 100.1
- 31 | 150.0 | 126.3
```

## The mistake: rounding down

The first order for the replacement springs went out with 2.2 mm wire. The buyer had rounded the designer's 2.282 mm to the nearest tenth, 2.3 mm, then found the supplier had 2.2 mm in stock and 2.3 mm on a four-week lead time. Since the rate can be restored by adjusting the coils, and the 2.2 mm spring with 7.74 active coils gives exactly the same rate and forces, the change looked harmless.

It was not. The force is set by the working points, so a thinner wire carrying the same force is more highly stressed. Run through the compression spring check, the 2.2 mm spring gives 556 MPa at 38 mm and 901 MPa at solid.

```figure
type: compare
title: Rounding the wire up or down
cols: Active coils | Stress at 38 mm, MPa | Stress at solid, MPa | Verdict
rowhead: Wire
- 2.2 mm, rounded down | 7.74 | 556 | 901 | Over the design stress; takes a set if pressed solid
- * 2.3 mm, rounded up | 9.25 | 489 | 712 | Within both limits
caption: This is an illustration. Both springs have a rate of 3.75 N/mm and give 55 N at 50 mm and 100 N at 38 mm. Only the stress differs, and it differs by 14% at the working point.
```

The engineer approving the order caught it because the shop's order form asks for the checking tool's output for the spring as it will be made, not the designer's output. The order was changed to 2.3 mm and the four weeks were accepted; two of the old springs were kept in service until then, with the arm's lock checked at each shift start.

The rule the shop wrote down is short. When rounding a designed wire size to stock, round up, recalculate the coils for the rate, and rerun the check. A thinner wire can always be made to give the right rate; it cannot be made to give the right stress.

## Choosing the wire material

The plunger spring is music wire, a cold-drawn high-carbon steel that is the strongest common spring wire in small sizes and the cheapest to buy in them. It is not the only choice, and the material changes three numbers in the design: the tensile strength that the allowable stress comes from, the shear modulus that sets the rate, and how the wire behaves in the spring's surroundings.

```figure
type: compare
title: Common spring wires for small compression springs
cols: Strength | Shear modulus | Where it suits
rowhead: Wire
- Music wire | Highest in small sizes | About 79 to 82 GPa | Dry, indoor, up to about 120 °C
- Oil-tempered carbon steel | Somewhat lower | About 77 to 79 GPa | Larger springs, general machinery
- Chrome-silicon alloy | High, keeps strength when warm | About 77 GPa | Shock loads, valve springs, warm duty
- Stainless steel | Lower | About 69 to 70 GPa | Wet, corrosive or food-contact duty
caption: General characteristics for comparison. Spring makers' and wire suppliers' data give the actual strength for each size and the temperature limits. A stainless spring of the same dimensions as a carbon steel one is about 12% softer because of its lower shear modulus.
```

The VM-8's changer sits above the machining area, behind the shutter, and in principle stays dry. Chapter 4 finds that it does not, which reopens the choice.

## When the space is too small

Sometimes the designer cannot find a spring at all: even the thickest wire that fits the coil leaves the stress too high, or the solid length leaves no room for the working deflection. There are only a few ways out, and they are worth trying in this order.

1. **Check the working points.** A spring asked for a large force at a short length and a small force at a long length needs a high rate and a long stroke together, the hardest combination. If the machine can accept a little less force at the long length, or a little more at the short one, the rate falls and so does the stress at the heavier point.
2. **Raise the allowable stress, honestly.** Shot peening, set removal and better wire raise what a spring can stand, but each costs money and each must be specified. The allowable cannot simply be raised because the design does not fit.
3. **Change the shape of the spring.** Square wire packs more steel into the same solid length, and a nested pair puts a second spring in the space inside the first. Chapter 5 compares both.
4. **Change the type of spring.** Disc springs carry very large forces in a short length; Chapter 7 shows why drawbars use them.

The plunger spring needed none of these; the 20 mm coil had room to spare. The fixture pads in Chapter 5 and the drawbar in Chapter 7 are the cases where the space decided the design.

## Specifying the result

The specification sent to the spring maker followed Chapter 1's list: 2.3 mm music wire, 20 mm mean diameter, 9.25 active coils, closed and ground ends, 55 N ± 10% at 50 mm and 100 N ± 10% at 38 mm, free length 64.7 mm for reference, solid length 26 mm maximum, set removed, and the duty stated as a tool changer lock plunger with up to a few hundred thousand cycles a year. Asking for set removal costs little and takes out the loss of free length in early service that Chapter 2 suspected in the old springs. The maker was also asked to test every spring at both working lengths and to report the forces, so that the shop could compare them with its own tester on receipt; a batch with forces outside the tolerance goes back before any spring is fitted.

## What a two-point design leaves open

The design fixes the forces and the stress at two lengths. It does not, by itself, say anything about fatigue, buckling or surge, or about what happens if the parts around the spring are not where the drawing says. The designer's checks flag buckling and the stress at solid; fatigue needs the stress range and the wire's endurance data, which Chapter 4 adds. And the working lengths themselves came from the drawing. Chapter 4 also finds that one of them was wrong.

```figure
type: checklist
title: The rounded plunger spring before ordering
caption: The VM-8 rebuild's sign-off for the new plunger spring. This is an illustration.
- x Forces at both working lengths within ± 10% of 55 N and 100 N
- x Stress at the heavier working point within the design figure of 500 MPa
- x Stress at solid within the 800 MPa static allowable
- x Outside diameter 22.3 mm clears the 23.5 mm bore; inside diameter 17.7 mm clears the 15 mm stem
- x Buckling ratio above 2.6, but guided by bore and stem
- x Clash allowance 12.1 mm at 38 mm
- ? Fatigue with the stroke the cam actually gives (Chapter 4)
```

## Exercise: a heavier pin

A later version of the changer has a heavier arm, and its maker asks for 70 N at the parked length of 50 mm and no more than 125 N at 38 mm. Keep the 20 mm mean diameter, the 500 MPa design stress and closed and ground ends. Find the rate, the free length and, using the stress formula, roughly what wire diameter is needed. Would 2.5 mm wire do, and how many active coils would it need?

### Worked answer

The rate is (125 − 70) ÷ (50 − 38) = 4.583 N/mm, and the free length is 50 + 70 ÷ 4.583 = 65.27 mm.

At 125 N the wire must satisfy K × 8 × 125 × 20 ÷ (π d³) = 500 MPa. The compression spring designer finds d by search; by hand, trying d = 2.45 mm gives an index of 8.16, a Wahl factor of 1.180, and a stress of 1.180 × 8 × 125 × 20 ÷ (π × 14.71) = 511 MPa. Trying d = 2.5 mm gives an index of 8.0, a Wahl factor of 1.184 and a stress of 1.184 × 20,000 ÷ 49.09 = 482 MPa. So the designer's figure lies between them, a little under 2.47 mm, and 2.5 mm is the next stock size up.

With 2.5 mm wire, the active coils for 4.583 N/mm are 79,300 × 2.5⁴ ÷ (8 × 8,000 × 4.583) = 10.56. The total coils are 12.56 and the solid length 31.4 mm, leaving 6.6 mm clash allowance at 38 mm: 24% of the 27.3 mm working deflection from free length. Rechecked in the compression spring tool, the 2.5 mm spring gives 70.0 N at 50 mm, 125.0 N at 38 mm and 482 MPa at 38 mm, within the design stress.
