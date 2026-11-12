---
book: design-for-assembly-by-the-numbers
chapterSlug: find-the-theoretical-minimum
order: 2
title: "Find the theoretical minimum"
description: "Apply the three minimum-part questions to every part of an assembly, separate essential parts from candidates for elimination, generate ways to combine them, and decide which candidates to keep."
draft: false
---

The largest savings in design for assembly come from parts that are not there. A part that has been eliminated costs nothing to buy, stock, handle, insert, inspect or get wrong. Every other improvement in this book, from chamfers to error-proofing, makes an existing part a little quicker or safer to assemble. Removing a part removes all of its costs at once.

The difficulty is that every part in an existing design looks necessary to the people who designed it, because each was added to solve a real problem. The method in this chapter gets past that by asking three questions of each part that do not depend on how the product is currently made. The answers give the theoretical minimum number of parts. The parts that fail all three questions are candidates for elimination, and the design team's job is then to find a way to remove each one, or a good reason to keep it.

The failure case is an earlier attempt to cut the IP-16's part count that removed a part it should not have.

## The three questions

The design for assembly method published by Boothroyd, Dewhurst and Knight asks three questions of each part, in the order the product is assembled. The first part, the base, is always counted. For each later part:

1. **Motion.** During the product's normal operation, does this part move relative to all the parts already assembled? Small movements allowed by flexible parts do not count; the question is whether the product's function needs relative motion.
2. **Material.** Must this part be made of a different material from, or be isolated from, all the parts already assembled? The reason must be functional, such as electrical insulation, sealing, wear or a spring property, not cost or convenience.
3. **Assembly and service.** Must this part be separate from all the parts already assembled, because otherwise assembling or taking apart the other parts would be impossible?

If the answer to any question is yes, the part is essential and counts towards the theoretical minimum. If all three are no, the part could in principle be combined with another part or eliminated, and it is a **candidate**.

The questions are deliberately strict. They ignore how parts are currently made and bought, because those are exactly the habits the review is trying to see past. That strictness is also why the theoretical minimum is a target to reason towards, not a rule.

## Revision A through the questions

```figure
type: compare
title: Revision A's eleven parts through the three questions
cols: Moves? | Different material? | Separate for assembly? | Result
caption: This is an illustration. Parts are taken in assembly order; "yes" to any question makes a part essential. Six essential parts give a theoretical minimum of 6. Five parts are candidates.
- Body | base part | base part | base part | essential
- Wiper O-ring | no | yes, an elastomer seal | no | essential
- Plunger | yes, slides in the body | yes, hardened steel | no | essential
- Spring | yes, deflects with each stroke | yes, spring steel | no | essential
- *Spring seat washer | no | no | no | candidate
- Rear cap | no | no | yes, closes the body after the plunger and spring go in | essential
- *Cross pin | no | no | no | candidate
- *Knob washer | no | no | no | candidate
- *Knob | no, fixed to the plunger | no functional need | no | candidate
- *Knob screw | no | no | no | candidate
- Lock nut | no | no | yes, must come off to mount the plunger through a plate | essential
```

The theoretical minimum for revision A is **6 parts**: body, O-ring, plunger, spring, rear cap and lock nut. The other five are candidates. That is the count used for revision A's design efficiency index in Chapter 1.

### Reading the answers

Some answers need thought.

**The spring** moves relative to the plunger and body as it compresses, and it needs a spring steel the body cannot provide. It passes both of the first two questions, and almost any design keeps it as a separate part.

**The rear cap** is the classic case for the third question. Neither its motion nor its material justifies it, but without a removable or separate rear closure, the plunger and spring could not be put into the body. It must be separate, although it does not have to be the threaded cap revision A uses.

**The knob** is the hardest. It does not move relative to the plunger, and its plastic is chosen for grip, colour and warmth to the touch, not for a function the product cannot do without. By the strict questions it is a candidate: a knurled head turned on the plunger's tail would do the job. Whether to keep it is a judgment the team makes later in this chapter.

**The lock nut** is essential, but only as a separate item. It must be separate so the customer can mount the plunger through a plate. It does not need to be assembled onto the body at the factory, which is what revision A does.

## The first win: stop assembling the lock nut

Every customer unscrews the lock nut, passes the body through the hole in their plate, and screws the nut back on behind it. Revision A spends **6 s** screwing on a nut that the customer immediately removes. Shipping the nut loose in the plunger's bag takes about 2 s at packing, saves **4 s** in total, and saves the customer an operation too.

This change needs no redesign at all, and it was made the week the review began. With the nut out of the assembly, revision A takes **63.5 s** for 10 parts, its theoretical minimum is 5, and its index is 3 × 5 ÷ 63.5, about **23.6%**. From here on, the lock nut is a packed item, not an assembled part.

## Ways to remove each candidate

For each candidate, the team asked what job it does and which essential part could do that job instead.

```figure
type: tree
title: Where each candidate's job could go
caption: This is an illustration. Each branch names the job the candidate does in revision A and the essential part that could take it over. Chapter 4 checks the retention methods these ideas need.
- Spring seat washer | gives the spring a flat face to push on
  - Plunger | a turned collar on the plunger gives the spring's front seat
  - Rear closure | a flat face on the closure gives its rear seat
- Cross pin | stops the plunger being pushed out of the front; gives the locked-out position
  - Plunger | the same collar seats against a shoulder inside the body
  - Knob | a moulded lug on the knob rests on a notch in the closure for lock-out
- Knob screw and knob washer | hold the knob on and spread the screw's load
  - Plunger and knob | a thread on the plunger's tail, a threaded insert moulded into the knob, and a factory-applied thread-locking patch
- Knob | grip, colour and insulation
  - Plunger | a knurled head turned on the plunger's tail, if the knob is eliminated
```

The collar on the plunger is the key idea. A shoulder turned on the plunger, inside the body, does three jobs at once: it seats the spring, it stops the plunger against a step in the body's bore, which sets the nose's protrusion, and it takes the place of the cross pin's stop. That removes the spring seat and the cross pin.

The rear closure then no longer needs a thread. In revision A the threaded cap took the spring's load through the cross pin; in the new arrangement the spring pushes the collar forward against the body's internal step, and the rear closure only has to guide the plunger's tail and take the load when the knob is pulled. A plain bush, pressed into the rear of the body, can do that. Chapter 4 checks that a press fit holds.

The knob can be screwed straight onto a thread on the plunger's tail if it has a threaded insert moulded in. A thread-locking patch, applied by the plunger's supplier, holds it. That removes the screw and washer.

### What the combinations cost to make

Combining parts moves work from the assembly bench to the machine shop or the mould. The combined parts are a little more complicated, and they cost a little more. The team asked its suppliers for prices before going further, because a combination that saves 10 s of assembly and adds a dollar of machining is not a saving.

This is an illustration. The plunger with its collar and threaded tail would cost about **A$0.35** more than revision A's plunger, A$4.95 instead of A$4.60, for slightly larger bar and an extra turning and threading operation. The body would cost about **A$0.40** more, A$8.20, for the internal step and a plain counterbore with a notch at the rear in place of the rear thread. The knob with a moulded-in insert and lug would cost **A$1.65** instead of A$1.20. Against that, the pressed rear bush would cost **A$1.10**, against A$1.90 for the threaded cap, and the spring seat, cross pin, knob washer and knob screw, A$0.39 together, would disappear. Chapter 7 adds these up properly, with the tooling the changes need.

### Counting rules that trip teams up

A few counting habits make the minimum-part questions give misleading answers.

- **Identical parts count separately.** Three screws holding a cover are three parts and three operations, each a candidate, not one line on the parts list.
- **Bought-in assemblies count as one** if they arrive assembled and are fitted in one operation, such as a sealed bearing or a cable with its connector. What is inside them is the supplier's design-for-assembly problem.
- **Consumables are operations, not parts.** Thread-locking compound, grease and adhesive do not appear in the part count, but their application time does, and revision A's thread-locker on the knob screw is part of the screw's 8.5 s.
- **Labels and markings are parts** if they are separate items applied at assembly. A label that could be laser-marked on an essential part is a candidate.
- **Parts for the customer, not the product,** such as the lock nut, are judged by whether they must be separate for the customer's use, and then by whether they need to be assembled at all.

## Which candidates to keep

The strict questions mark the knob as a candidate, and a knurled head turned on the plunger would remove it. The team decided to keep it, for three reasons it wrote down.

- **Cost.** Turning a knurled head would make the plunger longer and larger in diameter, and the supplier quoted about A$2.80 more per plunger, against A$1.65 for a moulded knob with an insert.
- **The customer.** Machine builders choose IP-16s partly by knob colour, which marks different functions on the same machine, and a plastic knob is warmer and easier to grip than steel.
- **The lock-out lug.** A moulded knob can carry the lug that gives the locked-out position at no extra cost.

The design team kept the knob, with those reasons recorded. A candidate kept for a reason is a decision; a candidate kept because nobody questioned it is a habit. The method's value is in forcing the difference.

## Revision B in outline

```figure
type: stats
title: Revision B against revision A, without the lock nut
caption: This is an illustration. Revision B's assembly time is the team's prototype timing from Chapters 3 and 4; Chapter 8 checks it on a pilot build. The theoretical minimum is 5 for both, because the knob is a candidate kept by choice.
- 10 parts, 63.5 s | revision A, lock nut packed loose
- 6 parts, 26.0 s | revision B: body, O-ring, plunger with collar, spring, pressed rear bush, threaded knob
- 5 | theoretical minimum for both
- 23.6% | revision A's design efficiency index
- *57.7% | revision B's index, 3 × 5 ÷ 26.0
```

## A failure case: one part too few

This is an illustration. Two years before this review, a junior engineer was asked to "take some parts out" of the IP-16. The first proposal combined the body and the rear cap into a single machined part, with the bore open only at the front. It cut a part, saved the cap's 9 s and removed a thread. On the drawing, it looked like a clear improvement.

It could not be assembled. The plunger in that proposal already had a collar, which was larger than the nose bore at the front of the body; the plunger could only go in from the rear, and the rear was now closed. Nobody noticed until the first prototype parts arrived and the plunger would not go into its body.

The rear cap had been essential all along, by the third question: without a separate rear closure, the parts already counted as essential could not be assembled. The proposal had removed a part that met the third question and kept parts, such as the cross pin, that met none of them.

The detection was a failed prototype, which is an expensive way to apply the third question. The correction, in this review, was to go through the questions in assembly order with the design team at a table, writing the answers down, before anyone redrew a part, and to check every proposed combination with a simple assembly sequence on paper or in CAD before ordering parts. The sequence is a list of steps in the order the parts go together, with a note against each saying which way the part moves and what it passes through. Ten minutes with that list would have shown that a collared plunger cannot pass through a closed rear end, and saved the cost of the prototype parts and the six weeks it took to get them.

## How this applies to a small Australian business

Take each part in assembly order and ask the three questions, writing down the answers and the reasons. Expect fasteners, washers, pins, brackets and seats to be candidates, and expect the base, moving parts, seals and springs to be essential. Look first for changes that need no redesign, such as parts assembled only to be removed. For each candidate, ask which essential part could do its job. Keep a candidate only for a recorded reason, and check every combination against the third question before cutting metal.

## Exercise: a sealed variant

A customer asks for a variant of revision B for a wash-down machine. It adds a **stainless dust cap** that clips over the knob end, and an **anti-rotation grub screw** through the body that runs in a slot in the plunger so the knob always stops at the same angle. Apply the three questions to the two new parts. What is the theoretical minimum for the variant, and what would you suggest instead of each new part?

**Worked answer.** The **dust cap** does not move relative to the knob once fitted, and stainless steel is not functionally needed as a separate material if the knob itself can seal; it need not be separate for assembly. It is a candidate. A moulded lip on the knob that seals against the rear bush, or a knob in a wash-down-rated plastic, could do its job. The **grub screw** does not move relative to the body, needs no different material, and need not be separate for assembly; it is also a candidate. A flat or key machined on the plunger's tail running in a matching shape in the rear bush would stop rotation without a separate part. Both new parts are candidates, so the theoretical minimum stays at **5**, and each addition would lower the design efficiency index unless its job is given to an existing part.
