---
book: buckling-by-the-numbers
chapterSlug: heat-restraint-and-buckling
order: 8
title: "Heat, restraint and buckling"
description: "How a member that carries no external load can buckle when it is heated between restraints: thermal force, the degree of restraint, the temperature rise at buckling and a hot outlet pipe."
draft: false
---

Every chapter so far has dealt with members pushed by an external load: the weight of a tank, the wind, a hydraulic cylinder. A member can also be pushed by its own supports. Heat a bar that is held at both ends and it tries to grow; the supports stop it, and in stopping it they push on it. The push does not depend on the bar's length, and it can be large. If the bar is slender, the push can buckle it, even though nothing is resting on it at all.

This chapter shows how to calculate the push, why the real answer depends mostly on how stiff the supports are, and how to find the temperature rise at which a restrained member buckles. Its case is a hot-water outlet pipe on HT-8, and its error is a pipe run that looked neat on the drawing and pulled a pump out of line.

## The thermal force

A free bar of length L heated by ΔT grows by α × ΔT × L, where α is the coefficient of thermal expansion. If both ends are held rigidly, the bar cannot grow, and the supports compress it by exactly the amount it would have grown. The strain is α × ΔT, and the stress is:

σ = E × α × ΔT

The length has cancelled out. A rigidly restrained bar 1 m long and one 100 m long, heated by the same amount, carry the same thermal stress. Only the material and the temperature change matter.

```figure
type: formula
title: Thermal stress and force in a restrained member
formula: Fully restrained: σ = E × α × ΔT and F = σ × A
formula: Partly restrained: σ = R × E × α × ΔT, where R = k_s ÷ (k_s + k_m)
formula: Temperature rise at buckling: ΔT_b = σ_cr ÷ (R × E × α)
caption: R is the degree of restraint, between 0 (free ends) and 1 (rigid supports). k_s is the stiffness of the supports along the member's axis, and k_m = E × A ÷ L is the member's own axial stiffness. σ_cr comes from Chapters 1 and 4.
- E | elastic modulus, MPa
- α | coefficient of thermal expansion, per kelvin
- ΔT | temperature rise from the temperature at which the member was fixed, K
- σ_cr | critical stress of the member on its effective length, MPa
```

For steel, E × α is about 200,000 × 12 × 10⁻⁶ = 2.4 MPa per kelvin. A fully restrained carbon steel member heated by 50 K is stressed to 120 MPa. For austenitic stainless steel, with a higher expansion coefficient of about 16 × 10⁻⁶ per kelvin and a modulus of about 193,000 MPa, the figure is about 3.1 MPa per kelvin.

The thermal-expansion side of this subject, including expansion loops, guides and anchors for long pipe runs, is covered in detail in [Thermal stress when growth is stopped](/reados/publications/thermal-expansion-by-the-numbers/thermal-stress-when-growth-is-stopped/). This chapter concentrates on the buckling side: when the thermal push becomes a buckling load, and how the stiffness of the supports decides it.

### Restraint is never complete

Rigid supports do not exist. The member's push is resisted by whatever holds its ends: a bracket that bends, a nozzle on a thin tank wall that flexes, a pump whose base bolts slip, a frame that sways. Those supports have a stiffness, and so does the member. The two act like springs in series: the member's free growth is shared between compressing the member and deflecting the supports, in inverse proportion to their stiffnesses.

The degree of restraint R expresses this. If the supports are much stiffer than the member, R is close to 1 and the full thermal stress develops. If the supports are much softer, R is small, the supports take up most of the growth by deflecting, and the stress is low. The supports then carry the member's growth as a deflection, and whatever is attached to them, a pump nozzle for instance, has to tolerate that deflection.

## HT-8's hot outlet pipe

This is an illustration. Some months after HT-8 entered service, the plant decided to use it to supply hot water at 65 °C to a cleaning-in-place set during cleaning cycles, heating the tank with a steam coil. The tank's outlet pipe runs straight down from a flanged nozzle on the tank's bottom to the suction flange of a transfer pump on a concrete plinth: 3,800 mm of 316 stainless pipe, 60.3 mm outside diameter and 2.77 mm wall, flanged at both ends. It was installed at about 20 °C, so a cleaning cycle heats it by 45 K.

```figure
type: steps
title: The outlet pipe heated by 45 K, if fully restrained
caption: This is an illustration. E = 193,000 MPa and α = 16 × 10⁻⁶ per kelvin for 316 stainless at these temperatures; 0.2% proof stress taken as 205 MPa from the material certificate.
- Pipe section | A = π × (60.3² − 54.76²) ÷ 4 = 500.6 mm²; I = 207,601 mm⁴; r = 20.36 mm
- Free growth | 3,800 × 16 × 10⁻⁶ × 45 = 2.74 mm
- Fully restrained thermal stress | 193,000 × 16 × 10⁻⁶ × 45 = 139.0 MPa
- * Fully restrained thermal force | 139.0 × 500.6 = 69.6 kN
- Factor against yield | 205 ÷ 139.0 = 1.48
```

A thermal push of nearly 70 kN on a light pipe and a small pump is enormous: it is more than three times the weight on one of HT-8's legs. Two questions follow. Would the pipe buckle before it reached that force? And how much of it would the real supports actually allow?

### The pipe as a column

Flanged at both ends to a tank nozzle and a pump, the pipe is somewhere between pinned and fixed at its ends. The shop's engineer took K = 0.7 as a reasonable middle value and checked the two extremes.

```figure
type: compare
title: Buckling of the 3,800 mm outlet pipe for three end conditions
cols: Effective length, mm | Slenderness | Mode | Critical stress, MPa | Buckling load, kN
rowhead: End condition
- Both ends fully fixed (K = 0.5) | 1,900 | 93.3 | Johnson | 157.0 | 78.6
- * Flanged ends, partly fixed (K = 0.7) | 2,660 | 130.6 | Johnson | 110.9 | 55.5
- Both ends pinned (K = 1.0) | 3,800 | 186.6 | Euler | 54.7 | 27.4
caption: This is an illustration. Calculated with the Column buckling tool using E = 193 GPa and a yield of 205 MPa. The transition slenderness for these values is 136.3.
```

With K = 0.7, the pipe buckles at 55.5 kN, a critical stress of 110.9 MPa. Fully restrained, the thermal force of 69.6 kN would exceed that. The temperature rise at which the fully restrained pipe would buckle is 110.9 ÷ (193,000 × 16 × 10⁻⁶) = 35.9 K, which is less than the 45 K of a cleaning cycle.

The KEVOS® [Column buckling](/tools/column-buckling/) tool gives the buckling load of the pipe from its area, least second moment of area, length and effective length factor; the thermal force has to be worked out separately, as above, because the tool takes an applied load rather than a temperature. For solid round members, the KEVOS® [Restrained bar heating](/tools/restrained-bar-thermal-check/) tool does both steps together: from the bar's diameter, length between restraints, effective length factor, modulus, expansion coefficient, temperature rise, degree of restraint as a percentage and yield strength, it gives the thermal stress and force, the yield and buckling factors, and the temperature rises at which yielding and buckling would begin. It treats the bar as solid and uniformly heated, so it does not apply directly to a pipe.

## How much restraint is real

The pipe's own axial stiffness is k_m = E × A ÷ L = 193,000 × 500.6 ÷ 3,800 = 25,427 N/mm. The supports at its ends are the tank's bottom plate around the nozzle, which can flex upwards, and the pump's casing, base and plinth bolts, which can flex and slip. Neither is easily calculated, and the shop's engineer did not try to pretend otherwise. Instead, the engineer worked out what the answer would be for a range of restraint.

```figure
type: compare
title: The outlet pipe heated by 45 K at four degrees of restraint
cols: Support stiffness that gives R, N/mm | Thermal stress, MPa | Thermal force, kN | Factor against buckling, K = 0.7 | Temperature rise at buckling, K
rowhead: Degree of restraint
- 100%, rigid supports | infinite | 139.0 | 69.6 | 0.80 | 35.9
- 60% | 38,141 | 83.4 | 41.7 | 1.33 | 59.9
- * 40% | 16,951 | 55.6 | 27.8 | 2.00 | 89.8
- 25% | 8,476 | 34.7 | 17.4 | 3.19 | 143.7
caption: This is an illustration. Support stiffness is the combined stiffness of both ends in series, from k_s = R × k_m ÷ (1 − R) with k_m = 25,427 N/mm. Buckling factor = 110.9 MPa ÷ thermal stress.
```

The table shows why restraint matters more than anything else. Between full restraint and 25% restraint, the factor against buckling rises fourfold. But it also shows the catch. A pipe at 25% restraint does not buckle, but its supports take up three-quarters of its growth, 2.06 mm, as movement, and they carry a force of 17.4 kN while doing so. A pump suction nozzle is not designed to be pushed down by 17 kN or moved by 2 mm. Pump makers publish allowable nozzle forces and moments for each pump, and the forces from thermal growth in rigid pipework commonly exceed them by a wide margin.

In other words, there is no comfortable answer for a straight pipe between two fixed points. Either the supports are stiff, and the pipe is overloaded and may buckle, or they are soft, and whatever the pipe is attached to is overloaded instead.

## The error: a neat straight drop

This is an illustration. The outlet pipe had been designed for cold water, where it had no thermal growth to speak of, and its straight vertical drop from the tank to the pump was the neatest and shortest route. When the plant converted the tank to hot water, nobody revisited the pipe.

After the first week of cleaning cycles, the maintenance fitter doing a routine coupling check found the pump and motor out of alignment by 0.4 mm, far beyond the coupling maker's limit, and the pump's mechanical seal was weeping. The fitter realigned the pump cold. After the next cleaning cycle it was out again. The fitter then measured the pipe's length between the flanges with the system cold and hot, and found the hot pipe was pushing the pump's suction flange down and tilting the casing on its plinth. A slight bow had also appeared in the pipe, about 3 mm at mid-length, which disappeared when the pipe cooled.

The bow was the sign that the pipe had reached its buckling load in the hot condition and was being held from collapsing only by the yielding of its supports. The pump and its base had become the expansion joint.

```figure
type: decision
title: Dealing with a hot pipe between two fixed points
question: Can the pipe's growth be absorbed by flexibility rather than by its supports?
- Yes, with a change of direction | Offset leg or loop | Add a bend so the growth is taken in bending of a leg; the classic and usually cheapest answer
- * Yes, with a flexible connector | Braided hose or bellows at the pump | Rated for the temperature and movement; anchor the pipe so the connector, not the pump, takes the growth
- No, the run must stay straight | Restrain and guide it properly | Design the anchors for the full thermal force, guide the pipe against buckling, and protect the pump with a connector
```

The plant fitted a short stainless braided flexible connector rated for the temperature at the pump's suction, and added a pipe anchor just above it, so that the pipe's growth was taken by the connector's flexibility rather than by the pump. A guide halfway up the run stops the pipe bowing. The pump stayed aligned after the next ten cleaning cycles. The plant also added "change of temperature" to its management-of-change checklist: a change of service temperature is a change of design.

## Uneven heating bows a member

A temperature difference across a member, rather than along it, produces a different effect: a bow. The hot side grows more than the cold side, so the member curves towards the cold side, with a curvature equal to α times the temperature difference across it divided by its depth. For a member free to bow between pinned ends, the mid-length bow is that curvature times the length squared divided by eight.

This is an illustration. On a clear afternoon, the western faces of HT-8's legs can be several degrees warmer than their eastern faces. For a 5 K difference across a 76.1 mm leg, the curvature is 12 × 10⁻⁶ × 5 ÷ 76.1 = 7.9 × 10⁻⁷ per millimetre. On a 2,000 mm braced segment that gives a bow of 7.9 × 10⁻⁷ × 2,000² ÷ 8 = 0.39 mm; on the full 4,000 mm it would be 1.58 mm. Both are small beside the 2 mm crookedness allowance of Chapter 5, which is why the shop's offset and bow allowances cover them. On a slender member with a large temperature difference, such as a dark-painted steel strut beside a hot process vessel, the thermal bow can be the largest imperfection the member has, and it is present exactly when the member is most heavily loaded if the heat also raises its axial load.

## Cooling, tension and pretension

The same arithmetic works in reverse. A restrained member that cools below the temperature at which it was fixed goes into tension, again by E × α × ΔT. That is harmless for buckling but matters for other things. A weld made in a stiff assembly cools and shrinks, leaving the surrounding steel in compression, which is one source of the residual stresses that Chapter 4 described. And a tension-only bracing rod loses pretension when it warms relative to the frame it braces: for HT-8's 16 mm rods, fully restrained, each kelvin of warming relative to the frame would remove 200,000 × 201 × 12 × 10⁻⁶ = 0.48 kN of tension. The real loss is less, because the frame is not rigid, but it is the reason the shop tensions its diagonals firmly enough that a sunny afternoon does not leave them slack, and checks them again after the first summer.

## Restrained members in frames

Thermal buckling is not just a piping problem. A strut welded between two massive supports, a handrail between two fixed posts, a long weld run in a stiff assembly and a crane rail all behave in the same way. The checks are the same:

```figure
type: checklist
title: Checking a member heated between restraints
caption: The open item is the one the conversion to hot water skipped.
- Temperature range from installation to the hottest and coldest service | not just the working temperature
- Thermal stress at full restraint calculated | E × α × ΔT, independent of length
- Degree of restraint estimated or bounded | supports are springs, not walls
- Thermal force compared with the member's buckling load | on a realistic effective length
- Force and movement at each support compared with what it can take | including equipment nozzles
- ? Design revisited whenever the service temperature changes | a temperature change is a design change
```

## Exercise: a cooler cleaning cycle

This is an illustration. Before fitting the connector, the plant considered running the cleaning cycle at 50 °C instead of 65 °C, a temperature rise of 30 K from installation.

1. What is the fully restrained thermal stress in the pipe at 30 K?
2. At 40% restraint, what are the thermal stress, force and factor against buckling (K = 0.7, critical stress 110.9 MPa)?
3. At full restraint, would the pipe buckle at 30 K?
4. Would you accept the cooler cycle as the only change?

**Worked answer.**

1. 193,000 × 16 × 10⁻⁶ × 30 = **92.6 MPa**.
2. 0.4 × 92.6 = **37.1 MPa**; force 37.1 × 500.6 = **18.6 kN**; factor 110.9 ÷ 37.1 = **2.99**.
3. **No**, just: the fully restrained rise at buckling is 35.9 K, so at 30 K the pipe would be at 84% of its buckling stress, with a large amplification of any bow (Chapter 5).
4. **No.** The pipe might not buckle, but at 40% restraint its supports would still take about 1.1 mm of movement and carry 18.6 kN, which is very likely above the pump's allowable nozzle load. Reducing the temperature reduces the problem but does not remove it. The flexible connector and anchor are still needed, and the cleaning temperature should be chosen for cleaning, not for the pipework.
