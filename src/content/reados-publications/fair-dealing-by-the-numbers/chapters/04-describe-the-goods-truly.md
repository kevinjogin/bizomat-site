---
book: fair-dealing-by-the-numbers
chapterSlug: describe-the-goods-truly
order: 4
title: "Describe the goods truly: substance, quantity and quality"
description: "Check a quote against the specification for material, capacity and finish, calculate the tank's working volume and correct a description that promised more than the design delivered."
draft: false
---

A fair price for the wrong thing is not a fair exchange. Chapters 2 and 3 checked that the tank's price honestly estimates its worth. This chapter checks the other side of the exchange: that what the quote describes is what the customer asked for, and that what the workshop delivers will be what the quote describes.

Aquinas identifies three ways a thing sold can be defective (*Summa Theologiae* II-II q.77 a.2). It can be defective in substance, as when wine is mixed with water or base metal is sold as precious. It can be defective in quantity, as when a false measure is used. And it can be defective in quality, as when a sick animal is sold as healthy. Knowingly selling a thing with any of these defects is fraud, and the seller owes restitution. A seller who did not know of the defect has not acted wrongly, but must compensate the buyer once the defect comes to light. The three categories still work as a checklist for a modern quote, and Australian law prohibits the same kinds of misdescription. This chapter applies them to the tank.

## Substance: what it is made of

This is an illustration. The customer's specification calls for grade 316 stainless steel for all product-contact parts, because the tank will hold a salted product. The first draft of the quote described the tank simply as "stainless steel". The material line in that draft had been priced from a supplier's quote for grade 304 sheet, about A$1,150 cheaper for this tank than 316.

Grade 304 and grade 316 are both stainless steels, and both are widely used for food equipment. They are not the same material, and the customer had a reason for specifying one rather than the other. A quote that says "stainless steel" and a tank built from 304 would have supplied a different composition from the one the customer specified, while using a description that the customer could reasonably read as meeting their specification.

Under the Australian Consumer Law, a business must not make a false or misleading representation that goods are of a particular standard, quality, value, grade or composition, and must not engage in conduct that is misleading or deceptive or likely to mislead or deceive. Whether a particular description would breach those provisions depends on the circumstances. The workshop does not need to resolve that question to see that the draft was not good enough. The description should state the grade, and the material should be the grade stated.

The correction was made before the quote went out: the material line was re-priced for 316, which is the A$4,850 used in Chapter 2, and the description now reads "grade 316 stainless steel for all product-contact parts". The workshop also records the mill certificates for the sheet and plate it buys, so that the grade can be shown, not merely asserted.

## Quantity: how much it holds

The customer asked for a tank of 3,000 litres working capacity. The first drawing showed a shell of 1,400 mm inside diameter and 2,000 mm straight height, labelled "3,000 L". Was it?

The volume of a cylinder is π × r² × h. For a radius of 0.7 m and a height of 2.0 m, that is about 3.079 cubic metres, or 3,079 litres to the brim. But the customer's specification defines working capacity as the volume up to 150 mm below the top of the shell, to leave freeboard for the lid and for filling. The working height is therefore 1.85 m, and the working volume is π × 0.7² × 1.85, about 2,848 litres. The drawing's tank was about 152 litres, or 5.1%, short of what the customer asked for.

```figure
type: formula
title: Working volume of the tank
formula: Working volume = π × r² × (shell height − freeboard)
caption: A 2,000 mm shell holds 3,079 litres to the brim but only 2,848 litres to the working level; a 2,100 mm shell gives 3,002 litres working.
- r | 0.7 m, half the 1,400 mm inside diameter
- Freeboard | 0.15 m, from the customer's definition of working capacity
step: 2,000 mm shell: π × 0.49 × 1.85 = 2.848 m³ = 2,848 L working
step: Height needed for 3,000 L: 3.0 ÷ (π × 0.49) + 0.15 = 2.099 m
step: 2,100 mm shell: π × 0.49 × 1.95 = 3.002 m³ = 3,002 L working
```

### A failure: the brim volume called capacity

The error was not careless arithmetic. The draughtsperson had calculated the volume correctly, but to the brim, and rounded 3,079 down to a comfortable "3,000 L". The specification's definition of working capacity had not reached the drawing office.

It was found when the owner checked each line of the customer's specification against the quote and the drawing, the same review that found the polishing hours missing in Chapter 2. The specification's definition of working capacity was the clue: once the freeboard was subtracted, the label could not be true.

The correction was to increase the straight shell to 2,100 mm, which gives a working volume of about 3,002 litres. Each additional millimetre of height adds about 1.54 litres, so the extra 100 mm adds about 154 litres. The extra shell is about 0.44 square metres of 3 mm 316 sheet, roughly 10.6 kg at an estimating density of about 8,000 kg per cubic metre, or about A$95 of material at the workshop's buying price, plus a little extra rolling and welding. The Chapter 2 estimate already includes it.

```figure
type: bars
title: Tank volumes against the requirement
unit: L
caption: The first drawing met 3,000 litres only if measured to the brim; the corrected shell meets it at the working level.
- 2,000 mm shell, to the brim | 3079
- *2,000 mm shell, working level | 2848 | 5.1% short
- Requirement, working level | 3000
- 2,100 mm shell, working level | 3002
- 2,100 mm shell, to the brim | 3233
```

Had the tank been built to the first drawing, the customer would have received about 95% of the capacity they paid for. That is precisely Aquinas's defect of quantity: not a false scale, but a false measure all the same. Because the workshop would not have known, it would not have been fraud in his sense, but the workshop would still have owed the customer a remedy once the shortfall came to light, and a tank is a great deal harder to fix after delivery than on a drawing.

## Quality: how well it is made

The customer's specification, invented for this book, requires internal welds to be ground flush and polished to a surface roughness of Ra 0.8 micrometres or better, so that the surface can be cleaned. The first draft of the quote said "welds dressed".

"Dressed" is a common workshop word, and to the estimator it meant ground and polished. To a reader it could mean anything from a quick pass with a flap disc to a mirror finish. A description that a buyer could reasonably read as meeting their specification, when the seller intends something less, invites the defect of quality Aquinas describes: an item represented as sound when it is not quite what was required.

The correction was twofold. The description now states the finish in the customer's own terms, Ra 0.8 micrometres or better on internal welds. And the quote says how the finish will be verified: roughness readings at ten stated locations on the internal welds, recorded in the manufacturing data book. A quality claim that cannot be checked is weaker than one that can, and stating the check makes the workshop's own team clear about what "done" means.

## The three checks as a habit

The three defects are a useful review structure for any quote that will be read against a specification.

| Defect | Question | For the tank |
|---|---|---|
| Substance | Is the material, grade or composition stated, and is it what was specified? | Grade 316 stated; mill certificates recorded |
| Quantity | Is every quantity stated on the customer's definition, and does the design meet it? | Working capacity 3,002 L at the customer's freeboard |
| Quality | Is every quality requirement stated in measurable terms, with its check? | Ra 0.8 micrometres or better, checked at ten points |

Aquinas adds a point that is easy to overlook. Measures fixed by public authority or by custom must be respected (II-II q.77 a.2). In modern terms, a quantity stated in a unit the customer relies on, such as a working capacity defined in their specification, or a grade defined by a recognised standard, must be used in the sense the customer relies on. Choosing a convenient private definition, such as brim volume, does not change what the customer is entitled to expect.

## When the specification itself is unclear

The tank's specification defined working capacity, so the workshop could check its design against the definition. Many enquiries are less precise. A customer asks for "a 3,000-litre tank" with no definition at all, or for "food-grade stainless" with no grade, or for "a good finish" with no measure.

In those cases the honest course is not to choose the reading that is cheapest to meet, nor the one that is easiest to argue about later. It is to ask, and where asking is not possible, to state the assumption in the quote so that the customer can correct it before ordering. "3,000 L to 150 mm below the top of the shell; please advise if you require a different definition" costs one line and removes the ambiguity entirely. So does "grade 316 assumed for a salted product; grade 304 available at a lower price if suitable".

Aquinas counts docility, a readiness to learn from those who know more about the matter, as one of the parts of practical wisdom (II-II q.49 a.3), and it applies here directly. The customer knows how the tank will be used. The workshop knows how tanks are made. A truthful description often depends on combining the two, and a short question at the quoting stage is the cheapest way to do it.

```figure
type: checklist
title: Before sending a quote against a specification
caption: Each line catches one of Aquinas's three defects before it reaches the customer.
- Grade and composition stated, and matched to the specification | substance
- Every quantity calculated on the customer's own definition | quantity
- Every quality requirement stated in measurable terms, with its check | quality
- ? Any requirement the specification leaves undefined | state the assumption and invite correction
- x Do not round a quantity towards the requirement | round the design, not the label
```

## If a defect is found after delivery

Suppose the review had not caught the capacity error and the 2,000 mm tank had been delivered. Aquinas's principle is that a seller who unknowingly supplied a defective thing has not acted wrongly, but owes the buyer compensation once the defect is known (II-II q.77 a.2). The question is what compensation restores equality.

A tempting shortcut is to refund the shortfall in proportion to price. The tank delivered 2,848 litres of the 3,000 litres paid for, a shortfall of 152 litres or about 5.07%. Five point zero seven per cent of A$22,290 is about A$1,130. That figure is a useful floor for discussion, but it is rarely the right remedy. The customer did not buy litres; it bought a tank that would hold a 3,000-litre batch. A tank that holds 2,848 litres may force smaller batches, a second vessel or a change to the process, and the customer's real loss could be several times the proportional refund. Equally, if the customer's batches are 2,800 litres in practice, the loss may be close to nothing.

The fair remedy is the one that restores what the customer was promised, chosen with the customer: rectification if it is practical, replacement if it is not, or an agreed reduction that reflects the customer's real loss. Contract terms and the Australian Consumer Law may also give the customer specific rights, and a workshop facing a real dispute of this kind should take advice. What Aquinas adds is the starting point: the workshop owes a remedy because the exchange was unequal, not because the customer complained.

## Why truthful description protects the seller

Accurate description can feel like a burden: more words on the quote, more checks before it goes out. It is better understood as protection. A quote that says exactly what will be supplied is a quote the workshop can meet and prove it has met. A quote that says "stainless steel tank, 3,000 L, welds dressed" is a quote whose meaning will be decided after delivery, by whoever is more upset.

There is also a fairness point between customers. A workshop that describes its tanks loosely can win work on price against competitors who describe theirs precisely and price them accordingly. That is an unequal contest, and customers who buy on the loose description are the ones who pay for it, in a tank that does not quite do what they needed.

## Exercise: size a smaller tank

Another customer wants a tank with 2,000 litres of working capacity, 1,200 mm inside diameter, and the same 150 mm freeboard. Calculate the straight shell height needed, round it up to the nearest 10 mm, and state the working and brim volumes of the tank you would quote.

**Worked answer.** The radius is 0.6 m, so r² is 0.36 m². The working height needed is 2.0 ÷ (π × 0.36) = 1.768 m, and adding the freeboard gives 1.918 m. Rounding up to the nearest 10 mm gives a 1,920 mm shell. Its working height is 1.77 m, giving a working volume of π × 0.36 × 1.77 = 2.0018 m³, about 2,002 litres, which meets the requirement. Its brim volume is π × 0.36 × 1.92 = 2.171 m³, about 2,171 litres. The quote should describe the tank as "2,000 L working capacity (2,002 L calculated to 150 mm below the top of the shell)", so that the customer can see the definition being used. Rounding down to 1,910 mm would give only about 1,990 litres working, 0.5% short, which is small but would still make the description untrue.
