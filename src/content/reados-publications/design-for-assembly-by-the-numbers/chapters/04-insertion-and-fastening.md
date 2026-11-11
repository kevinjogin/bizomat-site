---
book: design-for-assembly-by-the-numbers
chapterSlug: make-parts-easy-to-insert-and-fasten
order: 4
title: "Make parts easy to insert and fasten"
description: "Cut insertion time with one assembly direction, chamfers, self-location and parts that need no holding, then choose and check retention methods: press fit, ring, staking, snap fit and a threaded knob."
draft: false
---

Insertion is the second half of every assembly step: putting the part where it belongs and making it stay there. It is usually the longer half, and it is where most of the difference between an easy product and a difficult one lies. A part that drops into place and is held by the next part takes a second. A part that must be held while something else is aligned with it, pushed against a spring, and then fastened with a separate screw and a drop of compound can take ten.

This chapter takes the insertion half of the IP-16's assembly, applies the design features that make insertion quick, and then deals with the hardest decision in the redesign: how to hold the rear bush and the knob in place without the threads, pins and screws of revision A. Two BIZOMAT tools help screen the options. The failure case is an early prototype bush that went in too far.

## Revision A's insertion time

With the lock nut packed loose, revision A's ten assembled parts spend **39.0 s** in insertion. Three steps take 22.5 s of it: the cross pin at 9.0 s, the rear cap at 7.0 s and the knob screw at 6.5 s. The O-ring adds 6.0 s, mostly from stretching it over the nose carefully enough not to cut it.

The slow steps have three things in common. Each needs the assembler to **hold something** while doing something else: the spring compressed while the pin goes in, the knob in place while its screw is started. Each needs **alignment** of small features: a pin with a hole, a screw with a thread. And each is a **separate fastening operation** after the part is in place, rather than the part holding itself.

## What makes insertion quick

```figure
type: checklist
title: Features that make a part quick to insert
caption: This is an illustration. Each item is a design property the drawing controls. The ticked items are ones revision B achieves.
- x All parts go in from one direction, ideally from above | revision B: everything enters the body's rear, along one axis
- x No part needs holding down or aligning while the next is fitted | revision B: the spring sits on the collar; the bush holds the spring
- x Every hole and bore has a lead-in chamfer | body bore, bush and knob insert all chamfered
- x Parts locate themselves before they are secured | the bush is guided by its chamfer before it is pressed
- x Fastening is part of insertion, not a separate step | press fit and a threaded knob with a factory-applied patch
- x Access and visibility are clear for hands and tools | everything is fitted from the open rear end
- ? Nothing can be inserted wrongly | covered in Chapter 6
```

The order of preference for securing a part, from quickest to slowest, is roughly this.

1. **Held by the next part**, with no fastening of its own: the spring, trapped between the plunger's collar and the bush.
2. **Secured as it is inserted**: a snap fit, or a press fit with a simple press stroke.
3. **Secured by turning**: a screw, nut or threaded part, which needs alignment, a few turns and often a torque.
4. **Secured by a separate operation**: adhesive, staking, riveting, welding or soldering, each needing its own tool and often a cure or inspection.

Revision A used the third and fourth levels for most of its joins. Revision B moves as many as possible up to the first two.

## Revision B's assembly sequence

```figure
type: steps
title: How revision B is assembled, all from the rear
caption: This is an illustration. Times are from a prototype trial of 20 builds, insertion only. Total insertion 17.0 s; with handling from Chapter 3, the build takes 26.0 s.
- Body | placed rear end up in the fixture, 2.0 s
- Wiper O-ring | slid onto the plunger's nose over a loading cone that guides it into its groove, 3.5 s
- Plunger | dropped nose first into the body; the bore's chamfer guides the O-ring past the edge, 2.5 s
- Spring | dropped over the tail onto the collar, 0.5 s
- * Rear bush | placed on its chamfer and pressed in one stroke to a hard stop, compressing the spring, 4.0 s
- Knob | spun onto the tail's thread with a clutch driver until the driver slips, 4.5 s
```

Every part goes in from the same direction, and none needs holding while the next is fitted. The spring is the only part under load during assembly, and the press compresses it as part of the bush's stroke, so the assembler never holds it. The knob's thread-locking patch is applied by the plunger's supplier, so the assembler handles no compound.

Insertion falls from **39.0 s** to **17.0 s**, a saving of 22 s per unit, about A$0.379 at A$62 an hour, or about **A$2,273** a year. Together with the handling saving in Chapter 3, that takes the build from 63.5 s to **26.0 s**.

## Holding the rear bush

In revision A, the threaded rear cap carried the spring's force through the cross pin. In revision B, the spring pushes the plunger's collar forward against a step in the body, and the rear bush carries load only when the knob is pulled: the collar then pushes back on the bush. The bush also guides the plunger's tail. Whatever holds the bush in must take the hardest pull an operator might give the knob, repeatedly, for the life of the product.

This is an illustration. The team took the design load as **250 N**, a firm two-finger pull with allowance for a jerk, applied every time the plunger is released. It asked for a design factor of **3** on that load, so the retention must hold at least 750 N.

Three ways of holding a bush in a 14 mm bore were considered.

- **Press fit.** The bush is made slightly larger than the bore and pressed in. It needs a press and controlled sizes on both parts, but no extra part.
- **Internal retaining ring.** A slip-fit bush is held by a spring-steel ring in a groove in the bore. It needs a groove, a ring and ring pliers, and can be taken apart for service.
- **Staking.** A slip-fit bush is held by deforming the body's rim over it with a staking tool. It needs a tool and a qualified process, and cannot be undone without damage.

### Screening with the Retention Method Selector

The [Retention Method Selector](/tools/retention-selector/) screens up to three retention methods against the joint, load, speed, temperature and disassembly needs, and compares their lifecycle cost from part, feature machining, assembly time and tooling costs, the volume and the production life. It takes a rated capacity for each candidate, or flags it for verification if none is supplied, and its rule is that technical rejections always override cost.

```figure
type: compare
title: Retention Method Selector results for the rear bush
cols: Press fit | Retaining ring | Staking
caption: This is an illustration. Inputs: bore, 14 mm, 250 N cyclic, 0 rpm, 60 °C, never disassembled, design factor 3, 6,000 a year for 5 years, A$62 an hour. Ratings: press fit 1,500 N from push-out tests on prototypes; ring 1,540 N from the ring thrust check below; staking 900 N from a supplier's trial. Costs are the team's estimates.
- Part, feature and time | A$1.10, A$0.30, 5 s | A$0.95, A$0.45, 9 s | A$0.80, A$0.20, 7 s
- Tooling | A$1,800 press fixture | A$150 pliers | A$2,500 staking tool
- Capacity ÷ load | 6× | 6.16× | 3.6×
- Cost per unit | A$1.49 | A$1.56 | A$1.12
- Lifecycle cost, 30,000 units | A$46,383 | A$46,800 | A$36,117
- *Status | verify | verify | verify
```

All three candidates come back as **VERIFY**, not pass. The selector does not accept a static rating as proof of fatigue strength under a load that is repeated every time the plunger is released, and it lists what must be checked for each: fatigue under cyclic load for all three, retention of the interference at temperature for the press fit, and push-out tests on production parts for the staking. On cost, staking leads by about A$0.37 a unit, roughly A$2,050 a year.

### Checking the ring option

The ring's rating came from the [Retaining Ring Thrust Capacity tool](/tools/retaining-ring-thrust/), which takes the bore diameter, the ring's thickness, the groove depth, the ring's shear strength, the groove material's yield and shear strengths, a safety factor, the applied thrust, the ring type and, for stamped rings, the groove contact fraction. It returns the ring's shear capacity, the load at which the groove starts to yield, the lower of the two as the allowable thrust, and the least distance of the groove from the end of the bore.

For a stamped ring 1.0 mm thick in a 0.6 mm deep groove in a free-machining steel body with a groove yield strength of 250 MPa, a safety factor of 3 and a contact fraction of 70%, the tool gives a ring shear capacity of 14.66 kN and a groove yield capacity of **1.54 kN**, so the groove governs. The allowable thrust of 1.54 kN already includes the tool's safety factor of 3, so entering it in the selector and asking again for a design factor of 3 counts the margin twice. The ring's comparison above is therefore conservative.

### The decision

The team chose the **press fit**, against the selector's cost ranking, and recorded why.

- **The bush is also the guide.** In the press-fit design, the bronze bush both closes the body and guides the plunger's tail. A staked or ringed design still needs a bush, and the costs above include one, but a staked rim around a slip-fit bush leaves the bush free to rock slightly, and the plunger's tail then wears it unevenly.
- **The lock-out notch.** The knob's lug rests in a notch in the body's rear face. Staking deforms that same rim, and the trial staked parts showed distorted notches.
- **Evidence.** The press fit's push-out tests already existed, and its remaining checks, fatigue and temperature, can be made on the pilot build in Chapter 8. Staking needed a qualified process and a new tool before any evidence could be gathered.

The decision is a judgment, and the record says when to revisit it: if staking can be shown not to distort the notch, its saving of about A$2,050 a year would be worth having. The selector's value was in making the cost of the choice visible and listing the verifications the chosen method still owes.

## Holding the knob

Revision A held the knob with a screw, a washer and thread-locking compound applied at the bench. Revision B needed something quicker that would still survive the 250 N pull and an operator who uses the knob as a handle.

### A snap fit, tried and rejected

A plastic knob with three moulded fingers snapping into a groove on the plunger's tail would be the quickest of all: one push. The [Snap-Fit Joint Design tool](/tools/snap-fit-joint-design/) checks a cantilever finger in plastic. It takes the undercut, the finger's thickness, length and width, a geometry factor, the material's secant modulus and permissible strain, the friction coefficient, and the lead-in and retaining angles, with a retention force wanted. It returns the largest undercut the finger can take, the assembly strain, the deflection and mating forces, the separation force, or self-locking if the retaining face cannot slide, and the root bending stress.

```figure
type: compare
title: Snap-Fit Joint Design for one knob finger, two retaining angles
cols: Retaining angle 45° | Retaining angle 80°
caption: This is an illustration. One finger: undercut 0.6 mm, 1.5 mm thick, 8 mm long, 4 mm wide, constant section, secant modulus 2,300 MPa, permissible strain 2.5%, friction 0.4, lead-in 30°, 250 N wanted. The knob would have three fingers.
- Assembly strain | 2.11%, within 2.5% | 2.11%, within 2.5%
- Mating force per finger | 11.6 N | 11.6 N
- Separation force per finger | 21.2 N, about 64 N for three | self-locking
- Root bending stress | 48.5 MPa | 48.5 MPa
- *Verdict | redesign: far short of 250 N | works by the tool, but cannot be removed and its strength is unverified
```

With a releasable 45° retaining face, three fingers would hold only about 64 N against the 250 N wanted. With a steep 80° face the joint is self-locking, which the tool reports as working, but self-locking only means the face will not slide. Whether the finger or the groove's lip shears first under 250 N, and whether the plastic creeps under a sustained pull, are questions the tool's beam model does not answer, and the knob could never be removed to replace a worn plunger. The team rejected the snap fit.

### The threaded knob

The chosen knob has a brass threaded insert moulded in. It spins onto an M6 thread on the plunger's tail, and a thread-locking patch on the tail, applied by the plunger's supplier, resists loosening. A clutch driver set to the patch maker's recommended assembly torque stops at the same tightness every time. Pull-off and loosening tests on the pilot build in Chapter 8 confirm it.

## A failure case: the bush that went too far

This is an illustration. The first prototype rear bushes were pressed in by hand with a small arbor press, by feel, until they "felt home". Of the first 20 prototypes, three would not lock out: the knob's lug would not reach its notch. One had a plunger that would not return fully under its spring.

The cause was depth. Without a stop, the bush could be pressed past the body's rear face. A bush pressed 0.4 mm too far shortened the space between the collar and the bush, reduced the plunger's stroke, and moved the lock-out notch's effective position. The function test caught all four, because it checks that the knob reaches lock-out and that the plunger returns fully.

The correction was a press fixture with a **hard stop** that sets the bush exactly flush with the rear face, the A$1,800 fixture in the selector's figures. With the stop, the bush's depth no longer depends on the assembler, and Chapter 5 treats the flush face as a dimension with a tolerance, not a variable.

## How this applies to a small Australian business

Arrange the assembly so every part goes in from one direction and nothing needs holding while the next part is fitted. Put lead-in chamfers on every bore and hole. Move fastening up the order of preference: held by the next part, then pressed or snapped, then screwed, and separate operations last. Screen retention options with numbers, including lifecycle cost, but treat a cheaper option's missing evidence as a reason to verify, not a reason to choose it. Record why a more expensive option was chosen and when to revisit it. And give every press operation a hard stop.

## Exercise: a shallower groove

If the retaining ring option were reconsidered with a groove depth of **0.4 mm** instead of 0.6 mm, everything else the same, what allowable thrust does the [Retaining Ring Thrust Capacity tool](/tools/retaining-ring-thrust/) give? Would it still hold the 750 N that the design load times the design factor requires?

**Worked answer.** The tool gives a groove yield capacity of **1.03 kN**, still below the ring's shear capacity of 14.66 kN, so the groove governs and the allowable thrust is 1.03 kN. Groove yield capacity rises in proportion to groove depth: two-thirds of the depth gives about two-thirds of 1.54 kN. Because the allowable already includes the tool's safety factor of 3, 1.03 kN against the 250 N design load is a factor of about 4.1 beyond that, and it also exceeds 750 N. The shallower groove would hold, with less margin; a groove that shallow also makes the ring easier to dislodge with a sharp blow, which a real design would test.
