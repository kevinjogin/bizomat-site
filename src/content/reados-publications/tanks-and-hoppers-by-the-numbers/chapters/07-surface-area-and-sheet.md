---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: surface-area-and-sheet
order: 7
title: "Surface area and sheet"
description: "Calculate the sheet a tank needs: shell blanks at the mean diameter, cone and lid areas, nesting on stock sheets, yield, weld length and material cost, and catch a shell blank cut 9 mm short."
draft: false
---

Capacity tells the customer what a tank holds; surface area tells the fabricator what it costs. Every square metre of the shell, cone, lid and baffles is sheet bought, cut, rolled and welded, and the sheet comes in stock sizes that the parts must be nested on, with offcuts. A tank quoted from its net surface area alone is quoted short, and a shell blank cut to the wrong length will not roll to the right diameter, however carefully it is rolled.

This chapter calculates TK-1's surface areas, the blank length for its rolled shell, the nesting of its parts on stock sheets, the yield, the length of its welds and the cost of its sheet. The running case finds a shell blank cut to the inside circumference, 9 mm short, which left a cone that would not fit.

## Areas of the parts

The surface area of each part follows from its geometry, as the volumes did.

- **Cylinder**: curved area π × d × h. For a rolled shell, use the **mean** diameter, the diameter at mid-thickness, for the sheet; the inside diameter for contact area with the contents.
- **Cone frustum**: curved area π × (R + r) × s, with s the slant height, √((R − r)² + h²).
- **Pyramid frustum**: the sum of its trapezoidal faces, each half the sum of its parallel sides times its slant height in the plane of the face.
- **Flat discs and plates**: π × r² for a disc; length times width for a rectangle.
- **Sphere and caps**: 4πr² for a sphere; 2πRh for a cap of depth h on a sphere of radius R.

```figure
type: compare
title: TK-1's sheet areas
cols: Size | Formula | Area
caption: This is an illustration for 3 mm sheet. The shell is sized at the mean diameter, 1,203 mm; the cone's slant height is 680 mm.
- Shell | 1,203 mm mean diameter × 1,500 mm | π × d × h | 5.669 m²
- Cone | 1,200 to 100 mm over 400 mm | π × (R + r) × s | 1.389 m²
- Lid | 1,200 mm disc | π × r² | 1.131 m²
- *Net total | | | 8.189 m²
```

## The shell blank

A shell rolled from flat sheet stretches on the outside of the bend and compresses on the inside. The length that stays the same is at about mid-thickness for rolling a large radius in thin sheet, so the flat blank's length is π times the **mean** diameter: the inside diameter plus one thickness.

This is an illustration. TK-1's shell has a 1,200 mm inside diameter and a 3 mm wall, so its mean diameter is 1,203 mm and its blank length is π × 1,203 = **3,779 mm**. The blank is 1,500 mm wide, the shell's height. For a tight radius in thick plate, the neutral axis moves inwards, as *Sheet Metal Parts by the Numbers* explains for folded parts, but for a 600 mm radius in 3 mm sheet the mid-thickness rule is accurate to well under a millimetre.

## The error: a blank 9 mm short

This is an illustration. The first shell blank for TK-1 was cut at π × 1,200 = **3,770 mm**, the inside circumference, by a cutter who took the drawing's 1,200 mm diameter as the length to multiply. Rolled and tacked, the shell closed with its seam butted, but its mean diameter was 3,770 ÷ π = 1,200 mm and its inside diameter therefore 1,197 mm, 3 mm under the drawing.

The cone, rolled separately to the correct 1,200 mm inside diameter at its top, would not enter the shell. The fit-up check found it: the cone's top edge measured 3,789 mm round its outside, the shell's inside would have needed the same, and a tape round the shell's outside read only 3,779 mm. The shell blank was 9.4 mm short, exactly π × 3 mm, the wall thickness's contribution to the circumference.

The fix was to cut a new blank at 3,779 mm and to put the blank length, not only the diameter, on the shell's drawing. A dimension that a cutter must calculate is a dimension that will eventually be calculated wrongly.

```figure
type: bars
title: Shell blank length by the diameter used
unit: mm
max: 3800
caption: This is an illustration for TK-1's 1,200 mm inside diameter in 3 mm sheet. The inside and outside circumferences differ by π × 2t, about 19 mm; the blank belongs in the middle.
- Inside circumference, π × 1,200 | 3770
- *Mean circumference, π × 1,203 | 3779
- Outside circumference, π × 1,206 | 3789
```

## Nesting on stock sheets

Sheet is bought in stock sizes, and the parts must be nested on them. This is an illustration, with stock sheets of 3,048 × 1,524 mm.

- The **shell** blank, 3,779 × 1,500 mm, is longer than any stock sheet, so it is made in two halves, each 1,890 × 1,500 mm, with two vertical seams. Each half takes a sheet and leaves an offcut of about 1,158 × 1,524 mm.
- The **cone** pattern, developed in Chapter 8, is an almost complete ring of about 742 mm outer radius, roughly 1,484 × 1,354 mm overall.
- The **lid**, a 1,200 mm disc, is too wide for the shell offcuts, which are only 1,158 mm long, but fits beside the cone on a third sheet: 1,484 + 1,200 = 2,684 mm along a 3,048 mm sheet.

Three sheets are needed, 13.94 m² in all, against a net area of 8.19 m²: a yield of about **59%**. The offcuts are not all waste. The two shell offcuts are large enough for the legs' base plates, the lugs and HP-400's smaller parts, and a fabricator that nests several jobs together recovers much of them. A quotation should still be priced on the sheets bought for this job, unless the offcuts will certainly be used.

## Yield and cost

This is an illustration, in Australian dollars excluding GST. Three 3,048 × 1,524 mm sheets of 3 mm stainless at 7,900 kg/m³ weigh 13.94 × 0.003 × 7,900 = about **330 kg**. At A$7.50 per kilogram, the sheet costs about **A$2,477**. Priced on the net area of 8.19 m², it would have been about A$1,456, so a quotation on net area would have understated the material by about A$1,020.

```figure
type: stats
title: TK-1's sheet, bought and used
caption: This is an illustration with 3,048 × 1,524 mm stock sheets and A$7.50/kg ex GST.
- 3 | Stock sheets | Two for the shell halves, one for the cone and lid
- 13.94 m² | Sheet bought | 330 kg of 3 mm stainless
- * 59% | Yield | 8.19 m² of parts
- A$2,477 | Sheet cost | Excluding GST
```

## Weld length

Weld length drives labour cost much as sheet area drives material cost, and it comes from the same geometry. For TK-1:

- two vertical shell seams, 1.5 m each, **3.0 m**;
- the shell-to-cone circumferential seam, π × 1.2 = **3.77 m**;
- the lid's perimeter seam, if it is welded on, **3.77 m**;
- the cone's own seam along its slant, **0.68 m**;
- the outlet nozzle to the cone, π × 0.1 = **0.31 m**.

That is about **11.5 m** of seam, before nozzles and lugs. Making the shell from a single blank, if a long enough sheet or coil were available, would remove one vertical seam, 1.5 m of welding and its finishing, which is often worth more than the sheet it saves.

## Hopper sheet

HP-400's four trapezoidal walls, each with parallel sides of 1,000 and 250 mm and a slant height of 975 mm, total 2.44 m², and its upstand 1.2 m²: 3.64 m² net, as Chapter 6 used for its mass. The walls nest well, because two trapezoids laid head to tail make a parallelogram 1,250 mm long and 975 mm high. Two such pairs, 2,500 mm long, fit along a 3,048 × 1,524 mm sheet in a single row, so all four walls come from one sheet, leaving a strip about 549 mm wide down its length. That strip yields three of the four 1,000 × 300 mm upstand panels, and the fourth comes from an offcut of the shell sheets. Chapter 9 develops the true shape of each wall, which for a square pyramid hopper is a symmetrical trapezoid; for an offset hopper, each wall is different and the nest changes.

## Seams, root gaps and the blank

The blank length of π times the mean diameter assumes the seam closes with its edges touching. Butt welds are often prepared with a small **root gap** between the edges, and the blank must be shortened by the gap at each seam, or the shell will be oversize. This is an illustration. With two vertical seams and a 1.5 mm root gap at each, each of TK-1's half-shell blanks is (3,779.3 − 2 × 1.5) ÷ 2 = **1,888.2 mm** long, not the 1,889.7 mm that halving the full blank would give. Lap seams and grooved seams, used on thinner sheet, need the opposite: an allowance added for the overlap or the folded lock, which the seam's own detail specifies.

Raw stock is not always square or clean at its edges, and many fabricators trim a few millimetres from each edge before cutting the blank. That trim belongs to the stock, not to the blank: the finished blank is still the calculated length, and the drawing should give the finished length, with the trim left to the workshop's cutting practice.

## Thickness and the sheet bill

Sheet cost is proportional to thickness, so a thickness decision is also a cost decision. This is an illustration. The same three sheets in 2 mm stainless would weigh about 220 kg and, at a slightly higher A.60 per kilogram for the thinner sheet, cost about A,674 excluding GST, some A00 less than the 3 mm sheet. Whether 2 mm is adequate for TK-1's shell, under its liquid head, its supports and its handling, is a structural question for the tank's designer, and the saving should never drive the answer. What the geometry can do is price both options quickly once the designer has said which are acceptable.

## Internal parts and attachments

The shell, cone and lid are most of a tank's sheet, but not all of it. Baffles, stiffening rings, nozzle pads, lifting lugs, leg pads and the agitator's support bridge are each small and together can add a tenth or more to the sheet bill. They are also where offcuts earn their keep. This is an illustration. TK-1's four leg pads, 150 × 150 mm, its two lifting lugs, 120 × 100 mm, and a 1,200 × 100 mm agitator bridge total about 0.23 m², all cut from the shell offcuts, which between them hold about 3.5 m² of sheet. Small parts like these rarely justify a sheet of their own, and are best cut in the same programme as the shell halves. Listing them on the cutting list, with the sheet they come from, stops them being cut from a fresh sheet by someone who did not know the offcuts were reserved.

## Checking the bill of sheet

A sheet bill can be checked against the tank's mass. The net area of 8.19 m² in 3 mm sheet at 7,900 kg/m³ is about 194 kg; add the legs, nozzles and fittings of Chapter 6 and the result should be near the weighed mass of the finished tank, less the weld metal. A sheet bill whose net area implies a mass well below the finished tank's has missed a part; one well above has counted a part twice. Both errors are common on tanks with many attachments, and the weighed mass of Chapter 6 is the cheapest independent check available.

## Finishes and area

Surface area also prices finishes. TK-1's inside, in contact with food product, is to be polished; its outside is to be left as supplied. The inside area, at the inside diameter, is π × 1.2 × 1.5 = 5.65 m² of shell plus about 1.39 m² of cone and the underside of the lid, about 8.2 m² in all. Polishing is priced per square metre, often with a premium for inside work and tight corners, so the inside and outside areas should be listed separately. The cone, which is curved in two directions near its outlet, is the hardest part to polish and usually the most expensive per square metre.

## Exercise: a single-sheet shell

A supplier offers 3 mm stainless in 4,000 × 1,524 mm sheets at A$7.80 per kilogram, excluding GST. If TK-1's shell were made from one such sheet in a single blank, how long is the blank, how much sheet is bought for the shell, and what does the shell's sheet cost compared with two 3,048 × 1,524 mm sheets at A$7.50 per kilogram? What else changes?

**Worked answer.** The blank is still π × 1,203 = **3,779 mm** long and 1,500 mm wide; it fits a 4,000 mm sheet with a 221 mm offcut. One 4,000 × 1,524 mm sheet is 6.096 m², 6.096 × 0.003 × 7,900 = **144.5 kg**, costing about **A$1,127**. Two 3,048 × 1,524 mm sheets are 9.290 m², 220.2 kg, costing about **A$1,651**.

The single sheet saves about A$524 of shell sheet, and it removes one of the two vertical seams, 1.5 m of welding, grinding and polishing. It also changes the offcuts: the two large offcuts that the half-shells left, used for base plates and lugs, become one narrow 221 mm strip, so those small parts need sheet from elsewhere. The cheaper choice depends on whether those offcuts would really have been used, which is the question every nesting decision comes back to.
