---
book: arc-welding-by-the-numbers
chapterSlug: polarity-arc-blow-and-the-return-path
order: 7
title: "Polarity, arc blow and the return path"
description: "Choose polarity, recognise and cure magnetic arc blow, and route the welding current so it never passes through bearings, chains or the wrong part of a structure."
draft: false
---

The welding current does not stop at the arc. It flows out through the electrode, across the arc, through the work and back to the machine through the return cable. The direction it flows decides the polarity, and the path it takes through the work decides two things that cause a surprising share of welding problems: magnetic arc blow, where the arc is pushed off the joint by magnetic fields, and stray current, where welding current finds its way through bearings, chains or other parts and damages them.

This chapter sets the polarity for the conveyor frames, deals with an outbreak of arc blow on magnetised rails, and works out how a badly placed return clamp ruined a conveyor bearing on site.

## Polarity

With direct current, the electrode can be positive (electrode positive, also called reverse polarity) or negative (electrode negative, or straight polarity). Chapter 1 showed that the heat released at the two ends of an arc is not equal. Hamilton and Oberg noted in 1918 that carbon-arc welders made the work positive because more heat appeared at the positive terminal, and the 1921 measurements quoted in Chapter 1 estimated a larger drop at the anode than at the cathode in a short bare-wire arc.

With modern covered electrodes and shielding gases, the coating or gas changes the arc so much that the simple rule no longer predicts which polarity gives more penetration; each consumable is designed for particular polarities. The maker's data sheet states them, and the welding procedure records the one qualified. The low-hydrogen electrodes on the conveyor frames are designed for electrode positive or alternating current. Gas metal arc welding with solid wire is normally run electrode positive; gas tungsten arc welding of steel is normally run electrode negative, so that most of the heat goes into the work rather than the tungsten.

```figure
type: compare
title: Polarity for the processes the conveyor shop uses or might use
cols: Usual polarity | Why
caption: General practice, subject to the consumable maker's data and the qualified procedure, which always govern.
- Low-hydrogen covered electrode | electrode positive or AC | as the data sheet allows; AC reduces arc blow
- Gas metal arc, solid wire | electrode positive | stable spray and short-circuit transfer
- Gas tungsten arc, steel | electrode negative | heat into the work, not the tungsten
- Some self-shielded flux-cored wires | electrode negative | as the data sheet requires
```

## Magnetic arc blow

An arc is a current-carrying conductor, so it is pushed sideways by any magnetic field across it. Normally the fields around the arc are balanced and it points where the electrode points. When they are not balanced, the arc is deflected, usually forward or backward along the joint. That is arc blow.

TWI describes the causes and cures. Arc blow tends to occur when the material being welded has residual magnetism, particularly when the root is being made, and when the welding current is direct current. It comes from the interaction between the arc's own magnetic field and the field of the residual magnetism. It is most common in steels, and as a rule of thumb, arc blow may be experienced if the magnetic field strength is greater than about 50 gauss, which is 5 millitesla. Individual parts may have little residual magnetism, but when they are brought together the field across the root gap can increase significantly.

Residual magnetism often comes from handling with lifting magnets or magnetic clamps, and sometimes from magnetic particle inspection. The position of the return clamp matters too, because the current flowing through the work to the clamp creates its own field, which can push the arc away from or towards the clamp, especially near the ends of a joint and in corners.

The symptoms are distinctive: the arc wanders, sputters and is hard to direct; spatter increases; the bead is irregular; and fusion suffers, often at one side of the root or at the ends of the joint. TWI lists lack of fusion among the defects it causes.

## Arc blow on the side rails

This is an illustration. A new delivery of 150 mm channel for conveyor side rails gave the welders constant trouble on the cross-member root welds near the rail ends. The arc kept blowing towards the end of the rail, and a sample of welds sectioned by the shop showed lack of fusion at one side of the root.

The supervisor borrowed a gaussmeter. Readings across the root gaps at the rail ends were about 6 to 8 mT, that is 60 to 80 gauss, above TWI's rule-of-thumb level of about 50 gauss. The steel supplier confirmed that the new delivery had been handled with lifting magnets in their yard, while earlier deliveries had been slung.

```figure
type: gauge
title: Field across a cross-member root gap at a rail end
min: 0
max: 10
value: 7
unit: mT
label: measured
caption: This is an illustration. TWI gives about 50 gauss (5 mT) as the rule-of-thumb level above which arc blow may be experienced. The new rails measured about 6 to 8 mT at their ends.
- 0 | 5 | Arc blow unlikely
- 5 | 10 | Arc blow may be experienced
```

TWI's remedies were applied in order of ease:

1. **Return clamp position.** The clamp was moved so that welding always progressed towards or away from it, rather than across it, and a second return lead was added at the other end of the rail on the worst joints.
2. **Alternating current.** For the root runs, the welders switched to alternating current, which the low-hydrogen electrodes allow and which TWI notes helps for manual metal arc welding, because the alternating field does not push the arc consistently in one direction.
3. **Demagnetising.** For the rails with the highest readings, the shop hired a demagnetising unit and brought the fields down before welding. TWI notes that demagnetising is often the only effective means where residual magnetism is high.

The steel supplier agreed to sling future deliveries for the shop, and the gaussmeter became part of the shop's equipment, with readings taken on any delivery that welds badly.

## Arc blow from the shape of the work

Arc blow does not always need residual magnetism. The arc's own field is distorted by the steel around it: near the end of a plate, in a corner, or next to a heavy section, the magnetic field has an easier path through steel on one side than on the other, and the arc is pushed towards the side with less steel. Welders notice that the arc tends to blow away from the start of a plate and towards the end, or into a corner, and that the effect is worst on root runs in thick material with direct current at higher currents.

Practical cures follow from the cause. Welding towards a heavy tack weld or a run-off tab gives the field steel on both sides at the end of the joint. Run-on and run-off plates move the ends of the weld away from the ends of the joint. Changing the electrode angle so that it points slightly against the blow compensates for mild cases. Shorter arcs are less affected than long ones. And, as above, the return clamp position and alternating current both help. A welder who understands why the arc blows can usually find a combination that works without changing the procedure; where the procedure must change, for example to alternating current, it should be qualified for that change.

## Stray current through electrical installations

Welding current can also find its way into a building's or a plant's electrical earthing system. If the work is connected to earth through equipment, and the welding power source's return clamp is poorly connected or placed far away, part of the welding current can return through the protective earth conductors of motors, switchboards or instruments, which are not designed to carry it. Those conductors can overheat, and the current can damage electronic equipment and instrumentation. On a conveyor, the drive motor, the belt-monitoring sensors and their cabling are all connected to the frame.

The cure is the same as for bearings: a sound, close return connection on the part being welded, so that the welding current has a short, low-resistance path back to the machine and no reason to wander. On site, the welder should also know how the conveyor's electrical equipment is earthed and whether the site requires sensitive equipment to be isolated or disconnected before welding. The shop's site procedure requires the quarry's permission and isolation procedures to be followed before any welding on a conveyor that is part of the plant.

## The return path through the work

The welding current takes every available path from the arc to the return clamp, dividing between them in inverse proportion to their resistances, like any parallel circuit. Usually the main path is the steel between the joint and the clamp, and nothing else matters. But if the clamp is placed so that part of the current can return through something it should not, such as a bearing, a gearbox, a chain, a wire rope or electrical equipment, the current will find it.

Rolling bearings are particularly vulnerable. The current must cross the thin lubricant film between the balls or rollers and their races, and at each crossing it can arc, melting tiny craters in the hardened surfaces. The damage may not show immediately; the bearing fails weeks or months later with pitted or fluted races. Lifting chains, slings and wire ropes are also vulnerable, because arcing at their contacts creates hard, brittle spots that can initiate cracks. The safe practice is to place the return clamp on the part being welded, as close to the weld as practicable, so that no current path passes through anything else.

## A failure: the head pulley bearing

This is an illustration. The shop's site crew welded a new chute bracket onto an existing conveyor frame at a quarry, about 300 mm from the head pulley's bearing housing on one side of the frame. Because the bracket area was awkward to reach, the welder put the return clamp on a leg on the opposite side of the frame, so that the head pulley, its shaft and both bearings lay between the weld and the clamp. Six weeks later the bearing nearest the bracket failed noisily. The quarry's maintenance team found the races covered with fine, regular grooves and pits.

The shop's investigation modelled the current paths. This is an illustration. The welding current at 130 A had two paths from the bracket to the clamp: through the frame steel, with its bolted joints, and through the bearing housing, the bearings and the shaft. Suppose the frame path had a resistance of about 0.5 mΩ and the bearing path about 2 mΩ. The current through the bearings would then be 0.5 ÷ (0.5 + 2) = 20% of the total, about **26 A**, crossing the lubricant films in both bearings for every second of arc time.

```figure
type: formula
title: Welding current through a bearing path in parallel with the frame
formula: I_bearing = I × R_frame ÷ (R_frame + R_bearing)
caption: This is an illustration with assumed resistances. Moving the clamp onto the bracket itself shortens the frame path so much that almost no current passes through the bearings.
- I | welding current, 130 A
- R_frame | resistance of the frame path to the clamp, 0.5 mΩ
- R_bearing | resistance of the path through housing, bearings and shaft, 2 mΩ
step: clamp on the far leg: I_bearing = 130 × 0.5 ÷ (0.5 + 2) = 26 A
step: clamp on the bracket: R_frame ≈ 0.05 mΩ, I_bearing = 130 × 0.05 ÷ 2.05 ≈ 3 A
```

The resistances are illustrative; the real values were not measured. But the conclusion did not depend on them: with the clamp on the far side, a substantial current passed through the bearings, and the damage matched electrical erosion.

The shop replaced the bearing at its own cost and changed its site procedure. The return clamp must be attached to the part being welded, or to the frame immediately beside the weld, with a direct path that does not cross any bearing, gearbox, chain, belt, electrical equipment or bolted joint that is not part of the weld area. Where that is not possible, the welder must stop and ask the supervisor. The procedure also requires the welder to check where the conveyor's own earthing and electrical equipment are, and to isolate them as the site requires.

## Checking the circuit before striking an arc

The shop's welders now run through a short mental check before welding anywhere other than the bench: Where is the return clamp, and is it on clean steel on the part being welded? Is there anything between the weld and the clamp that rotates, slides, lifts or carries electricity? Are the cables sound, laid out and not coiled? Is the polarity set for the electrode? The check takes a few seconds and has prevented a repeat of the bearing failure.

## Exercise: a better clamp position

For the chute bracket repair, the welder could have placed the return clamp on the frame 100 mm from the bracket, giving a frame path resistance of about 0.05 mΩ, with the bearing path unchanged at 2 mΩ. Calculate the share and the current through the bearing path at 130 A. Then calculate the current if the clamp had been placed on a leg so far away that the frame path was 1.0 mΩ.

With the clamp close by, the share through the bearings is 0.05 ÷ (0.05 + 2) ≈ **0.024**, about 2.4%, which is about **3 A** at 130 A. With a frame path of 1.0 mΩ, the share is 1.0 ÷ (1.0 + 2) ≈ **0.33**, about **43 A**.

Even the close clamp passes a few amperes through the bearings in this model, because the bearing path is still in parallel with the short frame path. That is why the procedure prefers a clamp on the bracket itself, so that the current path from the weld to the clamp does not reach the pulley at all, and why critical bearings near site welds are sometimes protected further by temporary bonding straps around them or by removing them before welding.
