---
book: plastic-parts-by-the-numbers
chapterSlug: snap-fits-that-assemble-and-release
order: 5
title: "Snap fits that assemble and release"
description: "Size a cantilever snap hook for permissible strain, deflection force and assembly force, check the worst-case undercut and design it to release for maintenance."
draft: false
---

A snap fit is one of the cheapest joints in manufacturing. It is moulded into the part, needs no screw, no tool and no extra component, and it assembles in a fraction of a second. It is also one of the easiest features to get wrong. Strain it too far and it cracks at the root on the first assembly or after a few dozen. Make it too stiff and it cannot be assembled by hand. Give it the wrong return angle and it either falls apart or can never be opened again.

This chapter designs the two snap hooks at one end of the cover, using the equations and material data from a published snap-fit design guide, and checks them against the brief's requirement of at least 200 removal cycles.

## How a cantilever snap hook works

A cantilever snap hook is a short beam, fixed at its root, with a catch at its free end. During assembly, the catch rides over a lip on the mating part and the beam bends out of the way. When the catch passes the lip, the beam springs back and the catch locks behind it. The distance the beam must bend is the undercut: the overlap between the catch and the lip.

The bending strain is highest at the outer surface of the root, where the bending moment is largest. If that strain exceeds what the material can tolerate, the root cracks or whitens. Snap-fit design is therefore mostly a strain calculation: for a given undercut, choose a length and thickness that keep the root strain within a permissible limit.

The Bayer MaterialScience snap-fit guide sets out the equations used here and gives permissible strains for its materials. It also notes that the moment of assembly is brief, so the material may be loaded beyond its linear range, which is why the deflection force is calculated with a secant modulus, the ratio of stress to strain at the strain actually reached, rather than the ordinary elastic modulus.

## Choose the permissible strain

The guide's table of permissible short-term strains for a single, brief joining operation gives 4% for unreinforced polycarbonate. For joints that are separated and rejoined frequently, it advises using about 60% of the tabulated value. The cover must be removed at least 200 times, so the design limit is:

**ε_allowed = 0.6 × 4% = 2.4%.**

The guide also explains where such figures come from: during a single brief snap, partly crystalline materials may be strained almost to their yield point, and amorphous materials to about 70% of their yield strain. The reference polycarbonate grade's yield strain is 6%, and **0.7 × 6% = 4.2%**, consistent with the guide's 4%. That cross-check is worth doing whenever a guideline is applied to a specific grade.

## Size the hook

This is an illustration. The cover's hooks have a constant rectangular cross-section, 8 mm wide and 1.6 mm thick at the root, with a length from root to catch of 14 mm. The box's lip requires an undercut of 1.5 mm. The guide's equation for the permissible deflection of a constant-section rectangular cantilever can be rearranged to give the strain for a chosen deflection.

```figure
type: formula
title: Cantilever snap hook equations
formula: y = 0.67 × ε × l² / h        P = (b × h² / 6) × (E_s × ε / l)
formula: W = P × (μ + tan α) / (1 − μ × tan α)
caption: From a published snap-fit design guide, for a constant rectangular section. A hook tapering to half its thickness uses 1.09 in place of 0.67.
- y | Undercut, the deflection at the catch, mm
- ε | Strain at the root, as a fraction
- l, b, h | Length, width and root thickness of the hook, mm
- E_s | Secant modulus at the strain reached, MPa
- P, W | Deflection force and mating force, N
- μ, α | Friction coefficient and the catch's lead angle
step: ε = y × h / (0.67 × l²) = 1.5 × 1.6 / (0.67 × 14²) ≈ 1.83%
step: P = (8 × 1.6² / 6) × (1,850 × 0.0183 / 14) ≈ 8.2 N
step: W = 8.2 × (0.6 + tan 30°) / (1 − 0.6 × tan 30°) ≈ 8.2 × 1.80 ≈ 14.8 N
```

The root strain is about 1.83%, below the 2.4% limit for frequent separation. The hook's thickness of 1.6 mm is 64% of the 2.5 mm wall, within the rib guideline from Chapter 4, so it should not cause sink where it joins the top.

## Calculate the forces

The deflection force needs the secant modulus at the strain reached. The guide's curve for unreinforced polycarbonate gives a secant modulus of about 1,850 MPa near 1.8% strain, lower than the 2,400 MPa tensile modulus because the material is no longer quite linear at that strain. The deflection force is then about **8.2 N** per hook.

The mating force is larger, because the catch's lead face is inclined and friction resists the sliding. The guide's friction data for polycarbonate on steel give 0.45 to 0.55, with a factor of 1.2 noted for polycarbonate on polycarbonate. The cover's hooks slide over a painted steel lip, so 0.6, the upper end of the range with some allowance for the paint, is used here. With a 30° lead angle:

**(0.6 + tan 30°) / (1 − 0.6 × tan 30°) ≈ 1.80**, so **W ≈ 8.2 × 1.80 ≈ 14.8 N** per hook.

Two hooks need about 30 N to engage, comfortably within what a person can apply with a thumb. The brief asked for hand assembly, and this confirms it.

## Choose the return angle for release

The catch's back face, the return face, decides how the joint comes apart. With a 90° return face, pulling on the cover cannot deflect the hook, and the joint will not separate until something breaks. With a shallower return angle, pulling produces a sideways component that deflects the hook, and the same mating force equation, using the return angle instead of the lead angle, gives the separation force.

At a 45° return angle with μ = 0.6, the factor is **(0.6 + 1) / (1 − 0.6) = 4.0**, so each hook would release at about **8.2 × 4.0 ≈ 33 N** of pull, about 66 N for two. That might be too low for a cover that must stay shut when someone leans on a cable, and too high for easy removal.

The cover therefore uses a 90° return face, so it cannot be pulled off, with a press tab on each hook, reached through a small recess in the skirt. Pressing the tab deflects the hook by its 1.5 mm undercut at about the deflection force, roughly 8 N per hook, and the cover lifts free. This meets the brief's maintenance requirement without a tool and avoids the screwdriver levering that cracked the earlier design described in Chapter 1.

```figure
type: svg
title: The cover's snap hook with its press tab
alt: A side section of the cover's end. The top plate runs horizontally. A hook hangs down from the underside, 14 mm long and 1.6 mm thick at its root, with a root radius. At its lower end a catch points outwards, with a 30 degree lead face below and a square return face above, locking under a lip on the steel box. A press tab extends from the hook through a recess in the skirt.
caption: The 30° lead face eases assembly. The 90° return face prevents pull-off. Pressing the tab deflects the hook by the 1.5 mm undercut to release it.
viewbox: 0 0 620 300
body:
<rect class="bx" x="60" y="40" width="460" height="24"/>
<text class="tx txs" x="70" y="32">Cover top, 2.5 mm</text>
<path class="bxa" d="M300 64H322V200H300Z"/>
<path class="la draw" pathLength="1" d="M322 170L346 186L346 200L322 200"/>
<path class="ln" d="M300 64Q296 64 296 68"/>
<text class="txa" x="356" y="200">Catch, 1.5 mm undercut</text>
<text class="tx txs" x="356" y="220">30° lead face below</text>
<path class="bxi" d="M346 160H520V172H346Z"/>
<text class="tx txs" x="400" y="152">Box lip, steel</text>
<path class="ln" d="M300 120H230"/>
<rect class="bxi" x="200" y="110" width="30" height="20"/>
<text class="tx txs" x="80" y="104">Press tab through a</text>
<text class="tx txs" x="80" y="120">recess in the skirt</text>
<path class="ln dsh" d="M290 64V230"/>
<text class="tx txs" x="200" y="262">Hook length 14 mm, root 1.6 mm thick, 8 mm wide</text>
<circle class="fa pulse" cx="300" cy="68" r="4"/>
<text class="tx txs" x="160" y="84">Root radius 0.5 mm</text>
```

## Give the root a radius

The strain equation assumes the root is a clean change of section. In reality the root needs a radius, because a sharp corner concentrates stress and invites cracking. The snap-fit guide shows that stress concentration at the root falls as the ratio of root radius to hook thickness increases, with little further benefit above a ratio of about 0.6. A large radius, though, creates a thick section where the hook meets the wall, with the sink and residual stress problems of Chapter 2. The guide recommends a compromise and states that the radius should never be less than 0.015 inch, about 0.38 mm.

The cover's hooks use a 0.5 mm root radius, a ratio of about **0.5 / 1.6 ≈ 0.31**, above the guide's minimum and modest enough to keep the junction thin.

## Compare a tapered hook

The guide recommends, where possible, a hook whose thickness tapers from h at the root to h/2 at the catch, because it spreads the strain more evenly along its length. Its deflection equation uses 1.09 in place of 0.67, which means the same undercut produces about 39% less strain.

```figure
type: compare
title: Constant and tapered hooks for the same 1.5 mm undercut
cols: Constant section | Tapered to half thickness
caption: Same length, width and root thickness. The taper lowers the strain and force, at the cost of a slightly more complex core.
- Root strain | 1.83% | 1.12%
- Margin below the 2.4% limit | 24% | 53%
- Secant modulus used | About 1,850 MPa | About 2,000 MPa
- Deflection force per hook | 8.2 N | 5.5 N
- *Mating force per hook, 30° lead | 14.8 N | 9.9 N
```

For the tapered hook, **ε = 1.5 × 1.6 / (1.09 × 14²) ≈ 1.12%**. At that lower strain the secant modulus read from the guide's curve is higher, about 2,000 MPa, and the deflection force is about **(8 × 1.6² / 6) × (2,000 × 0.0112 / 14) ≈ 5.5 N**. The extra margin is useful for a joint that will be cycled hundreds of times, and the taper uses less material. The cover adopts the tapered hook.

## A failure case: the undercut that grew

This is an illustration. The hooks were first checked at the nominal undercut of 1.5 mm. During the tolerance review in Chapter 6, the analyst found that the box's lip position and the cover's catch position each vary, and that in the worst combination the undercut could reach 1.8 mm.

For the constant-section hook, that raises the root strain to **1.8 × 1.6 / (0.67 × 14²) ≈ 2.19%**, still below 2.4% but with little margin. A designer who had chosen a slightly shorter hook to save space would have exceeded the limit: at the worst-case undercut, a constant-section hook would need to be at least about **√(1.8 × 1.6 / (0.67 × 0.024)) ≈ 13.4 mm** long to stay within 2.4%.

The detection is to run the strain calculation at the worst-case undercut, not only at nominal. For the tapered hook, the worst case is **1.8 × 1.6 / (1.09 × 14²) ≈ 1.35%**, comfortably inside the limit, which is another reason to prefer it.

## Let the hook rest unstressed after assembly

A snap hook should be strained only while it is passing the lip. Once engaged, it should return to its moulded shape, carrying no bending load. The snap-fit guide makes this a general principle for all snap joints: after the joining operation, the snap-fit features should return to a stress-free condition.

The reason is creep. Plastics held at a constant strain slowly lose stress, a process called relaxation, and plastics held at a constant stress slowly deform. A hook left permanently bent by 0.3 mm because the catch was positioned a little too far out would gradually relax, and the cover would loosen. Worse, a sustained strain in polycarbonate makes it more vulnerable to stress cracking from some chemicals, which links back to the brief's open item on cleaning products.

The cover's hooks are therefore dimensioned so that, at the worst tolerance combination in the engaged position, the catch sits against the lip with a small clearance rather than an interference. Any rattle this allows is taken out by the screws at the other end, which hold the cover down firmly against its seal face. The snap end locates; the screw end clamps.

## Design the lip as carefully as the hook

The hook is only half of the joint. The box's lip must be stiff enough not to bend away as the hook passes, smooth enough not to scrape the catch and positioned accurately enough to keep the undercut within the range the strain calculation assumed. A painted steel lip on a sheet metal box is stiff, but its paint thickness and the box's folding tolerances both move its effective position, and both belong in the tolerance review.

A small chamfer or radius on the lip's leading edge reduces the effective lead angle during the first part of the stroke and lowers the peak assembly force. A sharp burr on the lip, left from punching, does the opposite and can shave the catch over many cycles. The box drawing should call for the lip edge to be deburred, and the first-off assembly test should use a production box, not a carefully finished prototype.

## Know the other kinds of snap joint

The cantilever hook is the most common snap joint, but not the only one. The snap-fit guide groups snap joints into a few basic forms: cantilever hooks, loaded mainly in bending; U-shaped hooks, a variation of the cantilever that gives more length in a small space; torsion snap joints, where a bar twists rather than bends; and annular snap joints, rotationally symmetric beads around a shaft or bore, which involve multiaxial stresses and often give a partly sealed joint.

For the cover, a cantilever is the natural choice because the hooks must release for maintenance and the space under the top is shallow. A U-shaped hook would be worth considering if the hook had to be longer than the skirt allows; a torsion joint, with a rocker that tips when pressed, can give a pleasant release action on larger lids, at the cost of a more complex mould.

## Confirm by test

The equations assume a uniform cantilever, a rigid mating part, room temperature and short-term loading. The real hook has a root radius, a catch of finite size and a mating lip that bends a little. The first parts should be assembled and released at least as many times as the brief requires, 200 cycles here, at room temperature and at the cold end of the service range, where polycarbonate is less forgiving. Inspect the roots for whitening or cracks, and measure the assembly force with a simple force gauge to confirm that it is comfortable by hand.

## Exercise: a longer hook

The tooling layout allows the hooks to be lengthened to 16 mm. With the same 1.6 mm root thickness and constant section, what is the root strain at the nominal 1.5 mm undercut and at the worst-case 1.8 mm, and is the tapered design still needed?

**Worked answer.** At 1.5 mm, **ε = 1.5 × 1.6 / (0.67 × 16²) ≈ 1.40%**. At 1.8 mm, **ε = 1.8 × 1.6 / (0.67 × 16²) ≈ 1.68%**. Both are well below the 2.4% limit for frequent separation. The longer constant-section hook would be adequate, and the choice between it and the 14 mm tapered hook becomes a question of space, tooling simplicity and assembly force rather than strain.
