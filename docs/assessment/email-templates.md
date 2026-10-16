# Engineering Problem Assessment: email templates

Reusable, KEVOS®-branded wording for each stage. Send from the business mailbox. Replace every `{{placeholder}}`.
Use the subject lines as written so threads stay easy to find. Plain text keeps them readable in every mail client;
add the KEVOS® signature block configured in the mailbox.

Rules (see `README.md` §3): no payment request before the scope is approved; no “payment received” before payment
is verified; no “booked” before Proton Calendar confirms. Only templates backed by a verified, working integration
may ever be automated. At present all ten are sent manually.

Signature block:

```
{{sender_name}}
KEVOS® | Engineering, manufacturing and operations support
kevos.com
```

---

## 1. Assessment enquiry received (status NEW)

**Subject:** Your KEVOS® assessment enquiry ({{reference}})

Hello {{first_name}},

Thank you for your enquiry about the KEVOS® Engineering Problem Assessment. We have received the details of the
{{category}} problem you described and given it the reference {{reference}}.

KEVOS® will review the information and confirm whether the problem is suitable for the fixed-price assessment.
This is not yet a booking or a purchase, and nothing is payable at this stage.

We aim to reply within {{reply_time}}. If you would like a confidentiality agreement before sharing drawings or
photographs, just reply to this email.

---

## 2. Additional information required (NEEDS INFORMATION)

**Subject:** A few questions about your assessment enquiry ({{reference}})

Hello {{first_name}},

Thank you for the details so far. Before we can confirm whether the problem suits the fixed-price assessment,
it would help to know:

1. {{question_1}}
2. {{question_2}}
3. {{question_3}}

If photographs, drawings or process information would help, please share them using {{secure_sharing_method}}.
Please only send material you are entitled to share. If something is confidential, tell us and we will arrange a
confidentiality agreement first.

---

## 3. Assessment approved (APPROVED)

**Subject:** Your problem suits the A$195 assessment ({{reference}})

Hello {{first_name}},

Good news: the problem you described suits the KEVOS® Engineering Problem Assessment. The confirmed scope is:

- **Problem:** {{problem_boundary}}
- **Information to provide:** {{information_list}}
- **Included:** up to 30 minutes of remote technical discussion, a preliminary review of the information supplied,
  up to three practical improvement options where the evidence permits, and a one-page PDF recommendation.
- **Not included:** site visits, physical inspection, detailed CAD modelling, manufacturing drawings, prototypes,
  testing, formal certification or regulated design sign-off, guaranteed root-cause identification or savings, and
  implementation work.
- **Report delivery:** by {{delivery_date}}, after the meeting.

Payment instructions follow in a separate email. The conditions are on the page at
https://kevos.com/assessment/#terms.

---

## 4. Payment instructions (PAYMENT PENDING)

**Subject:** Payment instructions: Engineering Problem Assessment ({{reference}})

Hello {{first_name}},

To go ahead with the assessment confirmed in our previous email, please pay **{{amount_text}}** using:

{{payment_link_or_invoice_details}}

Please use the reference **{{reference}}**. Card payments are processed securely by the payment provider; KEVOS®
never sees or stores card details.

Once payment is verified, we will send instructions for booking the 30-minute remote meeting. If you cancel before
the meeting, the fee is refunded in full.

---

## 5. Payment received (PAID; only after verification)

**Subject:** Payment received: assessment {{reference}}

Hello {{first_name}},

We have verified your payment of {{amount_text}} for assessment {{reference}} (payment reference
{{payment_reference}}). Thank you.

Booking instructions for the meeting follow shortly.

---

## 6. Booking instructions (BOOKING PENDING)

**Subject:** Book your 30-minute assessment meeting ({{reference}})

Hello {{first_name}},

Please choose a time for your 30-minute remote assessment meeting here:

{{dedicated_booking_link}}

Your meeting is confirmed when you receive the calendar confirmation. If none of the times suit, reply with two or
three options and we will do our best to match one.

Before the meeting, please send {{information_reminder}} if you have not already.

---

## 7. Appointment confirmation (BOOKED; only after the calendar confirms)

**Subject:** Confirmed: assessment meeting on {{meeting_date}} ({{reference}})

Hello {{first_name}},

Your assessment meeting is confirmed for **{{meeting_date}} at {{meeting_time}} ({{time_zone}})**. The video link is
in the calendar confirmation.

To make the most of the 30 minutes, please have to hand:

- {{prep_item_1}}
- {{prep_item_2}}

To reschedule at no cost, let us know at least one business day before the meeting.

---

## 8. Assessment report delivery (DELIVERED)

**Subject:** Your Engineering Problem Assessment report ({{reference}})

Hello {{first_name}},

Thank you for your time on {{meeting_date}}. Your one-page assessment report is attached.

In summary, the recommended next step is: {{next_step_summary}}

The findings are preliminary and based on the information supplied and our discussion. They are not certification
or design sign-off, and the options should be verified before implementation, as the report explains.

If you would like help with the next step, reply to this email and we will scope it. There is no obligation.

---

## 9. Custom quotation recommended

**Subject:** Next step for {{company}}: a quote for {{work_type}}

Hello {{first_name}},

Based on {{the_assessment_or_your_enquiry}}, the most useful next step looks like {{work_type}} rather than
{{alternative}}. We suggest a scoped quote covering:

- {{scope_item_1}}
- {{scope_item_2}}

We will confirm scope, deliverables, timing and price in writing before any work begins. Would you like us to
prepare it?

---

## 10. Assessment declined or out of scope (DECLINED)

**Subject:** Your assessment enquiry ({{reference}})

Hello {{first_name}},

Thank you for considering KEVOS®. Having reviewed your enquiry, we do not think the fixed-price assessment is the
right fit, because {{reason}}.

{{suggested_route}}

Nothing is payable. If anything changes, or if you would like to talk it through, just reply to this email.
