---
book: engineering-tools-people-use
chapterSlug: write-messages-and-help-that-work
order: 4
title: "Write messages and help that work"
description: "Write errors, warnings and help in an engineering tool so users can act on them: what happened, why it matters and what to do, with examples where they are needed."
draft: false
---

Messages are the tool talking to its user at the moment something is unusual. A good message helps the user fix a problem or confirms they are on the right track. A poor message, "Invalid input", "Error 17", "Value out of range", leaves the user to guess, and users who guess under time pressure tend to do whatever makes the message go away. In an engineering tool, the thing that makes a message go away is sometimes the thing that makes the answer wrong.

This chapter rewrites the stack-up tool's messages and help. It sorts messages into errors, warnings and information, gives each a structure users can act on, puts help and examples where users need them rather than in a manual, measures whether people understand the messages, and keeps a short record of changes inside the tool. The failure case is a designer who removed a minus sign to silence an error, and in doing so reversed a tolerance.

## Three kinds of message

The old tool had 23 messages, all shown in the same red box with the same beep. The new tool sorts them into three kinds, each with its own appearance and behaviour:

- **Errors** stop the calculation because the input cannot be used: a field that is not a number, a required value missing, a dimension that refers to a deleted model feature. The user must fix them.
- **Warnings** allow the calculation but say something looks wrong: an implausible tolerance, a negative nominal gap, a statistical result relied on without a reason. The user can confirm them, and the confirmation is recorded, as Chapter 2 described.
- **Information** reports something the user may want to know but need not act on: a dimension imported with the drawing's general tolerance, a stack opened from an old file and converted.

Mixing the three teaches users to treat every message as an obstacle. Separating them means errors are rare and serious, warnings are worth reading, and information does not interrupt.

## Every message says three things

Each message in the new tool follows the same structure: what happened, why it matters, and what to do. The office rewrote every message to this pattern.

```figure
type: compare
title: Three of the tool's messages, before and after
cols: Old message | New message
caption: This is an illustration from the office's rewrite. Each new message names the field, explains the consequence and offers the next step.
- Pasted lower deviation | Invalid input in row 3 | The lower deviation for B contains a minus sign copied from a PDF. Treat it as a minus? The value would be −0.12 mm.
- Negative nominal gap | Check signs | The nominal gap is −0.30 mm, so the parts would overlap at nominal. Check the direction of each arrow in the sketch; one may be reversed.
- *Statistical result chosen | RSS selected | You have chosen the statistical result. It assumes independent, centred, normally distributed dimensions. Enter a reason; it will appear in the review record.
```

```figure
type: steps
title: How the office writes every message
caption: This is an illustration of the office's message template. A message that cannot complete step 3 usually reports something the user cannot change, and should be handled another way.
- Name it | the field or object in the words on the screen: "the lower deviation for B"
- Say what happened | with the value and its unit: "contains a minus sign copied from a PDF"
- *Say what to do | a specific action, ideally offered as a button: "Treat it as a minus?"
- Say what follows | where the choice is recorded or what changes: "the value would be −0.12 mm"
- Classify it | error, warning or information, with the matching appearance
```

Writing the "what to do" part was the hardest, and it was revealing. For several old messages, the author could not say what a user should do, because the message reported an internal state the user could not change. Those messages were either removed, because the condition could be handled silently and safely, or turned into errors with a clear fix.

## Name the thing, in the user's words

Messages should refer to things by the names users see on the screen: "the lower deviation for B", not "field tolDn[2]". They should use the terms on drawings: deviation, nominal, gap, datum. And they should give numbers with units. "The nominal gap is −0.30 mm" is understood instantly. "Gap < 0" requires the user to work out what it means and how bad it is.

## Keep one vocabulary

The old tool used "tol.", "tolerance", "band" and "spread" for related but different things, and "gap", "clearance" and "float" for the same thing. Users could not tell whether two words meant the same. The office wrote a short glossary of the terms the tool uses, about twenty, each with a one-line definition matching the office's drafting standard, and changed every label, message and help text to use only those terms. "Deviation" means the upper or lower deviation as drawn. "Tolerance band" means the difference between them. "Gap" means the result of the stack, positive for clearance and negative for interference. The glossary is in the quick guide and the help, and new messages are checked against it before release.

## Help where it is needed

The old tool's help was a 14-page document on the shared drive, last updated four years earlier. In the observation study, none of the six designers opened it. The new tool puts help where the question arises:

- **Examples beside fields.** Under the deviation fields, a faint example: "For 45.50 ± 0.10, enter +0.10 and −0.10." That single line would have prevented the gear hub failure in Chapter 1.
- **Explanations on demand.** A small question mark beside each concept, such as worst case, statistical method or general tolerance, opens a short explanation of three or four sentences, with a diagram where it helps.
- **A worked example stack** built into the tool, which a new designer can open, examine and change without affecting real work.
- **A one-page quick guide** for printing, covering the five things people most often get wrong, chosen from the observation study and the support questions.

The full reference document still exists, for the methods and assumptions in detail, but nobody needs it for routine use. It was rewritten to match the tool, and its date and the tool version it describes appear on its first page, so an out-of-date copy is obvious.

## Test whether people understand the messages

A message that its author finds clear may not be clear to anyone else. The office tested the new messages simply. Five designers, none of whom had worked on the tool, were shown each message out of context, with a short description of the situation, and asked two questions: what has happened, and what would you do? A message passed if all five gave a correct answer to both.

This is an illustration. Of the old 23 messages, **9** failed this test: at least one designer misread what had happened or chose the wrong action. Of the rewritten messages, all passed after a second round, in which three were reworded again. The test took about an hour per designer. It is now repeated whenever messages are added or changed.

## When the tool itself fails

Some messages report the tool's own problems: the vault cannot be reached to import a dimension, a model reference has been deleted since the stack was saved, the tool has hit an unexpected internal error. These are the messages most likely to be written badly, because the author thinks of them as rare and technical. They are also the ones that arrive when the user is already stuck.

The office applied three rules. First, the user's work is never lost: the tool saves the stack before showing any message about its own failure, and says so. Second, the message says plainly whether the user can continue: "The dimension for D could not be updated because its drawing is checked out by another user. Your stack is saved with the previous value, marked as not current. You can continue and update it later." Third, unexpected internal errors offer a one-click report that sends the author the stack, the tool version and the error details, and tells the user what is included before it is sent. Those reports, about two a month in the first year, let the author fix faults users would otherwise have worked around in silence.

## Do not train people to dismiss

A warning that fires often for legitimate inputs teaches people to click past warnings without reading them, and then they click past the one that matters. The office tracked how often each warning fired and how often users confirmed it as intended, from the records described in Chapter 2. A warning confirmed as intended most of the time is a candidate for tuning: its threshold may be wrong, or it may need to recognise a legitimate pattern. Over the first six months, two warnings were retuned and one was removed, and the share of warnings that pointed to real mistakes rose from about a half to about two thirds.

## Fewer questions to the author

Before the changes, designers had taken their questions to the tool's author, who estimated answering about **11** a month, each interrupting other work. The office counted them for three months after the messages and help were rewritten.

```figure
type: bars
title: Questions to the tool's author per month
unit: questions
max: 12
caption: This is an illustration from the author's own log. Most of the remaining questions were about the statistical method, which led to a short training session rather than more help text.
- Before the rewrite | 11
- First month after | 6
- Second month after | 4
- *Third month after | 3
```

Questions fell from about 11 a month to about **3**. Most of the remaining ones were about when to rely on the statistical method, a matter of engineering judgement rather than of using the tool. The office ran a 45-minute session on tolerance methods for all designers, which did more than any amount of help text could.

## Messages belong in the record

The review record from Chapter 3 lists every warning the designer confirmed, with the designer's note. That serves two purposes. The reviewer sees where the designer made a judgement, which is where review attention is most useful. And the office can count, across many stacks, which warnings designers confirm and why, which is how the tuning described above was done. A confirmed warning with a good reason, such as "deliberate 0.002 mm tolerance on a ground spacer", is evidence of care. A confirmed warning with no reason is a prompt for the reviewer to ask.

## Tell people what changed

When the tool changes, users need to know, or they will apply old habits to new behaviour. The new tool shows a short "What has changed" note the first time each designer opens a new version: three or four lines, in plain words, such as "Tolerances are now entered as upper and lower deviations, exactly as on the drawing. Old stacks ask you to confirm their tolerances when opened." The note can be reopened from the help menu.

## A failure case: the minus sign that went away

This is an illustration. Before the rewrite, a designer copied a bearing's tolerance, "0 / −0.12", from the supplier's PDF into the old tool's fields. The PDF used a typographic minus sign rather than a hyphen. The tool did not recognise it and showed "Invalid input in row 3". The designer tried retyping the value without the minus sign, the error disappeared, and the stack calculated.

The bearing's width was now entered as 12.00 +0.12 / 0 instead of 12.00 +0 / −0.12, shifting its mean by 0.12 mm in the wrong direction. The stack still passed, with less margin than it really had in this case. In another stack, the same habit could have made a failing stack pass. The review record showed the bearing's tolerance as +0.12, which the reviewer compared with the supplier's data sheet and queried.

The detection came from the review, checking inputs against their sources, as Chapter 3 established. The cause was a message that told the user something was wrong without saying what, so the user found their own way to make it go away. The corrections were the pasted-value cleaning from Chapter 2, the rewritten message in the comparison above, and a plausibility warning when a bought part's tolerance differs from the most recent value used for the same part number. The office also added the episode to the quick guide, as an example of why messages deserve to be read.

## How this applies to a small Australian business

Small offices rarely think of their tools' messages as worth writing carefully, because the author is down the corridor. That works until the author is on leave, or leaves. Rewrite each message to say what happened, why it matters and what to do, put one example beside each confusing field, and test the messages on a few colleagues who did not write the tool. Count the questions people bring to the author, before and after. It is the cheapest measure of whether the tool explains itself. And when a colleague reports that they "just got around" a message, treat it as a fault report: someone has found a way past a check, and the next person to do it may not be as lucky.

## Exercise: rewrite a message

The tool shows "Requirement missing" when a designer tries to calculate a stack without entering a required gap. Rewrite the message to the three-part pattern, and decide whether it should be an error, a warning or information.

**Worked answer.** One good version: "No gap requirement has been entered, so the tool cannot say whether the stack passes. Enter the minimum gap, the maximum gap or both, with their source, or choose 'Calculate limits only' to see the range without a pass or fail." It should be a **warning**, not an error. There are legitimate reasons to see the limits before the requirement is known, for example at an early design stage, and the tool can still calculate them. The second option keeps that possible, while making clear that no pass or fail is shown. The review record should then state that no requirement was entered.
