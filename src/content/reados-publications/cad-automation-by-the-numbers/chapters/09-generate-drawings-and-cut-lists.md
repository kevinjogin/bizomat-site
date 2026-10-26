---
book: cad-automation-by-the-numbers
chapterSlug: generate-drawings-and-cut-lists
order: 9
title: "Generate drawings and cut lists"
description: "Produce drawing sets, cut lists, profile files and stock plans from a configurator, agree each format with its user, include saw kerf and trim, and check outputs before they reach the workshop."
draft: false
---

Most of the value of a configurator is not in the model. It is in the outputs the model feeds: the drawing set the workshop builds from, the cut list purchasing orders from, the profile file the cutting machine runs and the stock plan the saw operator follows. Each output has a different user with different needs, and each can be wrong in its own way even when the model is perfect.

This chapter sets out the trestle configurator's outputs and how each is produced and checked. It covers drawings generated from the master drawing, cut lists grouped for purchasing, profile files for the foot plates and a stock-length plan that includes saw kerf and end trim. It works through how combining orders improves material yield, and ends with a cut list that planned eight legs from a bar that could only give seven.

## Every output has a customer

The specification in Chapter 5 listed the outputs and attached an example file from each user. This is an illustration of the full set:

```figure
type: compare
title: The configurator's outputs and who uses them
cols: Format | User | How it is checked
caption: This is an illustration. Each format was agreed with its user before it was coded, and each user tested it at acceptance.
- Drawing set | PDF released from the vault, general arrangement and details | workshop, customer | independent check against the rule table
- Cut list | file in purchasing's import format, grouped by section and stock length | purchasing | exact comparison with reference files
- Foot-plate profiles | flat-pattern file in the format the profile cutter's software imports | cutting operator | test cut of each new foot style
- *Stock plan | which pieces to cut from which bar, with kerf and trim | saw operator | piece count and remnant check per bar
- Generation log | one line per variant | maintainer, auditors | read when tracing any drawing
```

Treating each user as a customer of the tool changes how outputs are designed. The saw operator does not need a model or a drawing to cut legs. They need to know which pieces come from which bar, in what order, and what is left over. The cutting operator does not need the general arrangement. They need a clean flat outline with holes, on the right layer and in the right units.

## Drawings from the master drawing

The generator produces each drawing set by copying the master drawing from Chapter 4, pointing it at the generated assembly and its parts, and then updating what the master cannot know in advance:

- **view scales**, chosen from a table of standard scales so that the largest view fits the sheet;
- **title block properties**: part number, description, order, customer, quantity, rule-table revision and generator version;
- **the parts list**, filled from the assembly's components and their properties, with library parts carrying their catalogue descriptions;
- **notes** that depend on options, such as the brace bolt specification, which appears only when a brace is present.

The drawing is then checked automatically against the reference outputs in Chapter 7's tests and, for real orders, by a person. The independent check uses a short checklist tied to the rule table: inside width, cross-member section, brace present or absent, foot style and hole pattern, leg length. The checker compares each against the rule table for the stated inputs, rather than reading the drawing as if it were new. The general discipline of checking drawings is covered in [What a checker is for](/reados/publications/checking-drawings-by-the-numbers/what-a-checker-is-for/).

## Cut lists grouped for buying

The cut list's job is to tell purchasing what to buy and the workshop what to cut. It lists every linear piece by section, length and quantity, totalled across the order, and every plate by size and thickness. It comes from the rules library, which knows every piece and its length, not from reading the model's geometry. The model is used to check it: Chapter 6's self-check compares the model's mass with the mass the cut list predicts.

The cut list carries the order number and the generator version, so purchasing can trace any line to the trestle that needs it. When the same piece appears in several trestles in one order, it appears once with the total quantity, which was the change described in Chapter 8.

## Profile files for the foot plates

Foot plates are cut on the fabricator's profile cutter from a flat outline. The generator exports each foot plate's flat pattern in the file format the cutter's software imports, with holes, outline and marking text on agreed layers, in millimetres. The cutting operator's software nests the plates from all orders together, so the generator does not nest them itself.

Every new foot style was test-cut once before its rule was released. That caught one problem the tests could not: the hole size in the profile file was the bolt's nominal diameter, 16 mm, rather than the clearance hole the workshop needed, and the cutter's process also slightly reduces small holes. The foot-plate library parts now carry the cut hole size as well as the finished one, and the profile file uses the cut size.

## Plan the stock, including kerf and trim

Legs, cross-members and braces are cut from stock bars. The office's supplier stocks the leg section in **8.0 m** lengths. A stock plan says how to cut each bar to waste as little as possible. The rules that make the plan real are easy to forget:

- each saw cut removes material, the **kerf**, about **3 mm** on the office's band saw;
- each bar's ends are trimmed square before the first cut, here **10 mm** in total, leaving **7,990 mm** usable;
- a bar of n pieces needs n − 1 cuts between them.

```figure
type: formula
title: How many legs one bar gives
formula: pieces per bar = floor((usable length + kerf) ÷ (piece length + kerf))        usable length = bar length − end trim
caption: This is an illustration with a 3 mm kerf and 10 mm of end trim. Ignoring kerf and trim, eight 1,000 mm legs appear to fit in an 8,000 mm bar; in fact only seven do.
- Bar | 8,000 mm, usable 7,990 mm after trim
- Leg | 1,000 mm for a 1,100 mm trestle on a belt of 900 mm or less
step: pieces = floor((7,990 + 3) ÷ (1,000 + 3)) = floor(7.97) = 7
step: eight pieces would need 8 × 1,000 + 7 × 3 = 8,021 mm, more than the bar
```

## Combine orders for yield

Cutting each order on its own wastes more than cutting several orders together, because short leftover lengths from one order can be used for pieces of another.

This is an illustration. In one week, the office had two orders needing the same section: **20 legs at 1,000 mm** and **14 legs at 1,250 mm**. Cut order by order, with a simple rule of filling each bar with the longest pieces first, the first needs 3 bars and the second 3 bars: **6 bars**. The material in the pieces is **20 × 1,000 + 14 × 1,250 = 37,500 mm**, so the yield is **37,500 ÷ 48,000 ≈ 78%**.

Combining the two orders and searching for a better pattern does much better. Four bars cut as **three 1,250 mm and four 1,000 mm legs** use **3 × 1,250 + 4 × 1,000 + 6 × 3 = 7,768 mm** each, within 7,990 mm. A fifth bar takes the remaining **two 1,250 mm and four 1,000 mm**, using **6,515 mm**. That is **5 bars** and a yield of **37,500 ÷ 40,000 ≈ 94%**.

```figure
type: bars
title: Material yield on one week's legs, two orders
unit: % of bar length in finished pieces
max: 100
caption: This is an illustration. The same 34 legs from 6 bars or from 5; the saving is one 8 m bar of 50 × 50 × 3 SHS, about 35 kg of steel, every week this combination occurs.
- Each order cut separately, longest first | 78.1
- Orders combined, longest first | 78.1
- *Orders combined, pattern search | 93.8
```

Two lessons follow. Combining orders only helps if the planning method can use the combination: the simple longest-first rule needed six bars either way. And the saving is real but modest: one bar of about **35 kg** of steel in that week, computed from the section's area of about 564 mm² and a steel density of 7,850 kg/m³. The office added a weekly stock-planning step that combines the week's orders for each section, using a small pattern-search routine in the rules library. It did not try to optimise across sections or across weeks, because the extra saving would not justify the complexity.

## A failure case: eight legs from seven

This is an illustration. The first version of the stock plan ignored kerf and trim. For an order of ten 1,100 mm trestles, it planned **eight** 1,000 mm legs from each 8.0 m bar, which looks exact on paper.

At the saw, the operator cut seven legs from the first bar and measured the last piece at **979 mm**, short by 21 mm, the total of seven 3 mm kerfs, before any end trim. The operator stopped, recut the leg from a new bar and reported the problem. Material cost was small. The lost time, and the operator's justified loss of confidence in the plan, were not.

The detection came from a skilled person measuring before cutting, which is why the stock plan was never meant to replace that habit. The correction was to add kerf and trim to the rules library's stock planning, as parameters in the rule table owned by the workshop supervisor, since they depend on the saw and blade in use. A test was added that every planned bar's total length, including kerf and trim, is within the stock length. The saw operator also asked for the expected remnant length to be printed for each bar, so that a wrong plan shows up as a remnant that does not match before the last cut.

## Outputs for the customer

The customer needs something different again. A conveyor designer buying trestles wants the interface: the overall height to the idler mounting, the inside width, the foot pattern and anchor holes, the bolt positions for the idler frame and the trestle's mass. They do not want the workshop's weld details or cut lengths, which are the fabricator's know-how and change without affecting the customer.

The configurator therefore produces a one-sheet customer drawing for each variant from a second master drawing that shows only interface dimensions and the mass. It is generated with the workshop set, under the same part number and revision, so the two cannot drift apart. Sales can send it with a quotation within minutes of the order details being known. That turned out to be one of the benefits Chapter 1 recorded without a number: the office began winning small, urgent orders it had previously been too slow to quote.

## Only released outputs leave the office

Generated files enter the vault in the work-in-progress state. Nothing goes to the workshop, purchasing, the cutter or the customer until the drawing set has passed the independent check and been released. Release produces the PDFs, and the cut list, profile files and stock plan are issued from the released revision, never from a live model.

That discipline protected the office in Chapter 4, when a shared cross-member file changed under older drawings: the workshop was building from released PDFs, which were correct. It also means that every output in use can be traced to a specific released revision, generated by a specific tool version under a specific rule-table revision. When a question arises on site months later, the office can say exactly what was supplied and why.

## Check the outputs, not just the model

Every output has its own check, matched to how it can go wrong:

- drawings, by the independent checker against the rule table;
- cut lists, by exact comparison in the reference tests and by purchasing's import, which rejects malformed files;
- profile files, by a test cut of each new foot style and by the cutter's own preview;
- stock plans, by a length total per bar in the tests and the remnant check at the saw.

The office does not rely on any single check, because each catches different faults. The model can be right and the cut list wrong. The cut list can be right and the stock plan wrong. When a fault gets past every check, the review asks which check should have caught it, and that check is strengthened, as Chapter 7 describes for the automated tests.

## How this applies to a small Australian business

Small fabricators often have the design office, the saw and the profile cutter within a few metres of each other. That makes it easy to agree output formats directly with the people who use them, and the configurator should do exactly that rather than impose a format. Steel is a large share of the cost of fabricated products, so the stock plan can save real money. Keep the planning method simple enough that the workshop understands and trusts it, and let the workshop own the parameters, kerf, trim and stock lengths, that describe its own equipment and suppliers. When the supplier changes stock lengths or a new saw arrives, the workshop updates its own figures and every later plan follows.

## Exercise: a different saw

The workshop buys a cold saw with a **2 mm** kerf and keeps **10 mm** of end trim. How many 1,250 mm legs does one 8.0 m bar now give, and how many 1,000 mm legs? Does the four-bar pattern of three 1,250 mm and four 1,000 mm pieces still fit, and what remnant does it leave?

**Worked answer.** Usable length is still **7,990 mm**. For 1,250 mm legs: **floor((7,990 + 2) ÷ 1,252) = floor(6.38) = 6**. For 1,000 mm legs: **floor((7,990 + 2) ÷ 1,002) = floor(7.98) = 7**. The kerf change does not add a piece in either case. The mixed pattern uses **3 × 1,250 + 4 × 1,000 + 6 × 2 = 7,762 mm**, which fits, leaving a remnant of **7,990 − 7,762 = 228 mm**. The plan's yield is unchanged. The narrower kerf only increases the remnant slightly. That is why the kerf belongs in the rule table as a parameter the workshop owns: changing it updates every plan without changing code.
