---
book: practical-wisdom-by-the-numbers
chapterSlug: separate-making-from-deciding
order: 1
title: "Separate the well-made part from the well-made decision"
description: "Distinguish technical skill from practical judgement, set up the pump-flange case and describe a decision by its object, purpose and circumstances before choosing anything."
draft: true
---

An inspection report arrives late on a Thursday. Eighteen of 240 machined flanges show indications on their sealing faces, delivery is due in six working days, and someone asks the obvious question: can we still ship on time? The question sounds technical. Most of what makes it hard is not.

Two different kinds of reasoning are at work in that moment. One asks whether the parts are good: whether the faces meet the drawing, whether the inspection method was right, whether the defects matter to the seal. The other asks what the business should now do: what to tell the customer, what to remake, what to promise and who decides. People who are excellent at the first can be poor at the second, and the reverse is also true. This chapter separates them, sets up the case the book follows, and shows how to describe a decision fully before anyone tries to make it.

## Two kinds of right reasoning

Aquinas, following Aristotle, distinguishes art from prudence (*Summa Theologiae* I-II q.57 a.3 and a.4). Art is right reason about things to be made. Its goodness lies in the product: a craftsman is praised for the quality of the work, in Aquinas's phrase "not for the will with which he does a work". A skilled machinist who cuts a perfect face while resenting the job has still exercised the art well.

Prudence is right reason about things to be done: about human actions, including the decisions that surround the making. Its goodness cannot be separated from the person's aims. Aquinas argues that prudence requires a rightly ordered will, because a clever plan for a bad purpose is not practical wisdom at all. It is the virtue that applies general principles to particular cases and carries the result into action.

The distinction maps cleanly onto engineering practice. Calculation, inspection, machining and design are arts in Aquinas's sense. Deciding whether to ship, rework or disclose is prudence. The Engineers Australia *Code of Ethics* makes a similar separation when it lists competent practice and integrity as different commitments. Competence in the art does not guarantee good judgement, and good intentions do not make up for poor technique.

```figure
type: compare
title: Making well and deciding well
cols: Art (making) | Prudence (doing)
caption: The same people often exercise both, but each has its own standard of success and its own ways of failing.
- Concerned with | The part, drawing or calculation | The action taken about it
- Judged by | The quality of the product | The quality of the choice and its execution
- Needs a good will? | No; a resentful expert can still cut a good face | Yes; a clever plan for a bad end is not wisdom
- Typical failure | Out-of-tolerance work, wrong method | Rushing, ignoring advice, failing to act
- *In the case | Were the 18 faces inspected correctly? | What should the workshop now do and say?
```

Keeping the two apart has a practical benefit. When a decision goes wrong, a review that asks only technical questions tends to blame the parts. A review that also asks how the decision was made can find the missing conversation, the skipped check or the promise made without capacity behind it.

## The running case

This is an illustration. A small Australian machining workshop has a purchase order from a pump-station contractor for 240 flanges, machined from stainless steel castings supplied by a regional foundry. The price is A$240 per flange excluding GST, so the order is worth A$57,600 excluding GST, or A$63,360 including 10% GST. The workshop's own cost for the batch is about A$42,720, a gross margin of roughly 25.8%.

The customer's specification, invented for this book, calls for dye-penetrant inspection of every sealing face, with no linear indications and no rounded indications larger than 1.0 mm on the raised face. The flanges will be installed in a pump station operating at a working pressure of 1.6 MPa. The purchase order includes a deduction of A$200 for each working day that any part of the order is late.

Final inspection on day zero finds indications on 18 flanges, a reject rate of 7.5%. Delivery is due in six working days. The foundry quotes ten working days for replacement castings, at A$62 each. Machining and inspecting a replacement takes about 1.2 hours and 0.25 hours at a shop rate of A$110 an hour, so each replacement costs about A$221.50 before freight.

```figure
type: stats
title: The case on day zero
caption: Invented figures used throughout the book; each later chapter adds to them.
- 240 | flanges in the batch | A$240 each, excluding GST
- *18 | flanges with indications | 7.5% of the batch
- 6 | working days to delivery | A$200 deduction per late working day
- A$221.50 | to replace one flange | casting, machining and inspection
```

None of these numbers is a recommendation, and none describes BIZOMAT work. They are chosen to make the reasoning concrete enough to check.

## Confirm the art before deciding about it

Because art and prudence are different, the first practical step is to make sure the technical finding is sound before building a decision on it. A decision about 18 rejected flanges is wasted effort if half of the indications turn out to be false, and dangerous if the inspection missed others.

Dye-penetrant inspection can produce false indications when a surface is poorly cleaned, when machining marks hold penetrant, or when the developer is applied unevenly. It can also miss defects if the dwell time, lighting or surface preparation were not as the written procedure requires. None of that is a matter of judgement about the customer; it is a matter of checking the method. The workshop's inspector should therefore:

1. Confirm that the inspection followed the written procedure for every flange, including surface preparation and dwell time.
2. Re-inspect a sample of the 18 rejected faces after re-cleaning, to rule out false indications.
3. Re-inspect a sample of accepted faces, to check that nothing was missed.
4. Record each indication by flange serial number, type (rounded or linear), size and position on the face.

The fourth step matters most for what follows. A list that says "18 rejects" supports only a yes-or-no conversation. A map that says where each indication sits, and how large it is, supports a much better one. In the case, the re-inspection confirms all 18 rejections and finds no new ones, and the map is completed by the end of day zero. Chapter 4 uses it to judge each flange against the specification.

This sequence also protects the people involved. An inspector who is asked "can we ship?" before the finding has been confirmed is being asked to make a commercial judgement with technical authority. Separating the two questions lets the inspector answer the one that is theirs.

## Describe the act before judging it

Aquinas holds that an action is specified first by its object, meaning what is actually done, and then shaped by its end and its circumstances. He lists the circumstances using a verse he takes from Cicero: who, what, where, by what aids, why, how and when (I-II q.7 a.3). Of these he treats the end, the "why", as the most important, and the substance of the act, the "what", as next (I-II q.7 a.4).

The list is old, but it works as a modern decision checklist. A decision described without its circumstances is not yet a decision that can be evaluated. "Ship on Friday" means one thing if the customer knows about the 18 flanges and another if they do not. It means one thing if the indications sit where the gasket seals and another if they sit outside it.

```figure
type: checklist
title: The seven circumstances, applied to the flange decision
caption: Each line is a question to answer before any option is chosen; open questions are marked for counsel in Chapter 2.
- Who | The workshop proposes; the customer decides on any nonconformance
- What | Deliver 240 flanges that meet the specification, or agree a variation
- Where | Pump station, 1.6 MPa working pressure, installed by the customer's crew
- ? By what aids | Replacement castings, machining capacity, concession process
- ? Why | What the customer's schedule actually needs, and when
- How | Openly, with inspection evidence the customer can review
- When | Decision today; delivery due in six working days
```

Notice that two lines are still open. The workshop does not yet know what the customer's installation schedule needs, and it has not confirmed what aids are available, such as whether the foundry can expedite or whether the specification has a concession route. Those gaps are the agenda for the next chapter.

## Order the purposes

Every action serves more than one purpose. The workshop wants to be paid, to keep the customer, to meet its delivery promise and to protect its reputation. The customer wants flanges that seal reliably at pressure and arrive when the crew needs them. These purposes are not equal. Aquinas's analysis of practical reasoning begins with the end and works back to the means: the end orders the thinking about what must be done (I-II q.1 a.4 and the treatment of intention and choice in I-II qq.12 to 17).

For the flanges, the governing end is a reliable seal in service. Delivery on time serves that end because a pump station cannot be commissioned without its flanges, but delivery cannot outrank it. A flange that ships on time and weeps at 1.6 MPa has failed the purpose that justified buying it. Payment and reputation follow from serving the customer's purpose; they are not separate goals to be traded against it.

Writing the order down sounds pedantic. It prevents a common distortion in which the nearest deadline quietly becomes the highest purpose.

## A first failure: the decision framed too narrowly

The first message the quality lead receives reads: "Can we ship all 240 on Friday? Yes or no." The framing has already made three choices. It assumes the batch moves together. It assumes the customer is a recipient of the decision rather than a party to it. It assumes that "on time" is the measure of success.

Detecting this failure is straightforward once the circumstances are listed. If a proposed decision cannot be described by all seven circumstances, or if one of them has been answered by assumption, the framing is too narrow. Here, "who decides" has been answered wrongly: the workshop cannot decide on its own that nonconforming flanges are acceptable, because the specification belongs to the customer. And "by what aids" has been skipped entirely.

The correction is to rewrite the question so it names the purpose and leaves the means open:

1. State the end: flanges that seal reliably at the customer's working pressure, delivered to suit the installation schedule.
2. State the fact: 18 of 240 flanges do not meet the inspection criterion as written.
3. State the authority: the customer decides whether any nonconforming flange is accepted.
4. Ask the open question: what combination of delivery, replacement and disclosure best serves the end, at a cost the workshop can carry?

That question is harder to answer than yes or no. It is also the only one whose answer can be defended afterwards.

## Who decides what

In a supply relationship, authority is split. The workshop decides how to make and inspect, what to offer, what to tell the customer and what it will promise. The customer, or the engineer who owns the specification, decides whether a departure from the specification is acceptable. Regulators and standards govern certain matters regardless of what either party prefers.

A prudent decision respects that division. A workshop that ships nonconforming flanges without telling anyone has not made a bold technical call; it has made a decision that was not its to make. Later chapters return to this point, because the line between interpreting a requirement and overriding it is where many costly mistakes begin. The Library's chapter on [engineering registration, competence and duty of care](/reados/collections/engineering-design-practice/engineering-registration-competence-and-duty-of-care/) covers the Australian professional context in more detail.

## What a decision record contains

A decision that will be reviewed later needs a record written as it is made. The record does not need to be long. It needs to capture the description of the act, the purpose and the authority, so that anyone reading it can see what was known and what was assumed.

| Element | For the flange decision | Why it matters later |
|---|---|---|
| The fact | 18 of 240 flanges with indications, inspection report reference | Separates the finding from the response |
| The purpose | Reliable seal at 1.6 MPa, delivery to suit installation | Shows what the options were judged against |
| The authority | Customer approves any nonconformance | Shows the decision stayed within its limits |
| The circumstances | Seven questions, with open items named | Shows what was unknown at the time |
| The options considered | To be completed after counsel | Shows the choice was a choice |
| The command | Who does what, by when | Shows the decision was carried out |

The last three rows are empty on day zero, and that is correct. A record that already lists the chosen option before counsel has been taken is a sign that the decision was made first and justified afterwards.

## Exercise: rewrite the production manager's question

The production manager sends a second message: "Customer is chasing. Just tell me whether we can make Friday." Using the seven circumstances, identify which ones the message leaves unanswered or answers by assumption, and rewrite it as a question the team can actually work on.

**Worked answer.** The message answers "when" (Friday) and leaves the rest open or assumed. It assumes the batch ships as one ("what"), it treats the customer as chasing rather than deciding ("who"), and it ignores the replacement and concession routes ("by what aids"). It also hides the purpose ("why") behind the deadline. A workable rewrite is: "Eighteen flanges do not meet the inspection criterion. The customer needs reliable flanges in time for installation and decides on any nonconformance. By close of business today, what delivery and replacement plan can we offer, what evidence will we send, and what does each option cost us and them?" The rewrite names the fact, the purpose, the authority and the deadline for the decision itself, and it leaves the means open for counsel.

The next chapter takes that counsel: it looks at what the records say, what the requirement is for, and who else needs to be asked before the options are narrowed.
