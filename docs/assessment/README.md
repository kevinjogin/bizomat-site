# KEVOS® Engineering Problem Assessment: operations guide

A fixed-price A$195 remote assessment of one defined engineering or manufacturing problem, sold at
<https://kevos.com/assessment/>. This guide covers how the service runs, what is automated, what is manual,
how to configure payment and booking, and what still needs the owner's approval.

## 1. Where everything lives

| What | Where |
|---|---|
| Wording, price, inclusions, exclusions, conditions, examples, journey, statuses, sample report | `src/config/assessment.ts` (single source of truth) |
| Page | `src/pages/assessment/index.astro` (`/assessment/`), `src/pages/assessment/received.astro` (no-JS receipt, `noindex`) |
| Components | `src/components/assessment/` (hero animation, icons, examples, journey, sample preview, form, feature block) |
| Enquiry validation | `src/lib/assessment.ts` (shared by browser, Worker and tests) |
| Enquiry delivery (browser) | `src/lib/assessment-client.ts` (same provider as REACHOS: Web3Forms today) |
| Worker endpoints | `src/server/assessment/handler.ts` (`/api/assessment`), `src/server/assessment/stripe.ts` (`/api/assessment/stripe-webhook`) |
| Site integration | Home and Services (fixed-scope offers, pricing row), Factory Fix (“Start smaller?”), REACHOS (`/contact/`), footer, assistant knowledge and FAQ, Terms (`/terms/#assessment`), Privacy |
| Public assets | `public/assessment/` (brochure PDF, sample report PDF, QR SVG/PNG, QR card PDF, social image, banner) |
| Asset generators | `scripts/assessment/` (`qr.py`, `marketing.mjs`, `report.mjs`, `lib.mjs`); run `npm run assessment:assets` |
| Email templates | `docs/assessment/email-templates.md` |
| Register template | `docs/assessment/assessment-register-template.csv` (headers only) |
| Tests | `tests/assessment.test.ts` |

Customer information never goes into this repository. Keep the live register, customer files and real
reports in private business storage (or the git-ignored `assessment-private/` folder for local work).

## 2. What is automated and what is manual (as of 16 October 2026)

| Step | Status |
|---|---|
| Enquiry form, validation, spam check | **Live.** Browser validation plus hCaptcha; Web3Forms verifies the hCaptcha token server-side and emails the enquiry to the REACHOS inbox. |
| Server-side field validation and rate limiting | **Built, inactive.** `/api/assessment` validates every field, rejects files, checks origin, honeypot and fill time, and rate-limits per IP (when a `CONTACT_RATE_LIMIT` KV namespace is bound). It is used when the site's contact provider is switched to `worker` (see §5). |
| Acknowledgement email to the customer | **Manual** (template 1). The on-screen message confirms receipt; Web3Forms' free plan does not send auto-replies. |
| Suitability review, scope, payment instructions | **Manual** (templates 2–4). |
| Payment | **Manual payment link or invoice.** No payment is taken on the website. Stripe is not configured (no Worker secrets exist). |
| Payment verification | **Manual** in the Stripe dashboard or bank account. Optional automatic verification: `/api/assessment/stripe-webhook` (§4), currently disabled (returns 503). |
| Booking | **Manual.** Booking instructions are sent only after payment is verified (template 6). |
| Report | **Semi-automated.** `npm run assessment:report -- <data.json> <out.pdf>` renders the branded one-page PDF. |

## 3. Workflow and statuses

Track each assessment in the private register (copy the CSV template). Reference format: `KEVOS-A-YYYY-NNN`.

| Status | Meaning | KEVOS® action | Template |
|---|---|---|---|
| NEW | Enquiry received (email subject “KEVOS® assessment enquiry: …”) | Log it, give it a reference, acknowledge within one business day | 1 |
| NEEDS INFORMATION | Not enough to judge suitability | Ask specific questions; arrange secure file sharing or an NDA if requested | 2 |
| APPROVED | Suitable: one defined problem, remote review is enough, no regulated sign-off needed | Write the scope (problem boundary, information to supply, delivery date) | 3 |
| PAYMENT PENDING | Scope and payment instructions sent | Send the payment link (with `?client_reference_id=<reference>`) or invoice | 4 |
| PAID | Payment verified in Stripe or the bank account (never from a success page or a customer screenshot) | Record payment reference and date | 5 |
| BOOKING PENDING | Booking instructions sent | Send the dedicated booking link | 6 |
| BOOKED | Calendar confirmation received from Proton Calendar | Confirm the meeting and what to have ready | 7 |
| IN PROGRESS | Meeting held; review under way | Review information; draft the report data file | — |
| REPORT READY | PDF rendered and checked | The responsible KEVOS® professional reviews and signs the findings | — |
| DELIVERED | Report sent | Send the PDF; offer a quote where follow-on work suits | 8 (and 9 if relevant) |
| CLOSED | Nothing further | Archive files per the privacy policy | — |
| DECLINED | Not suitable | Explain kindly; suggest the right route; no charge | 10 |
| REFUNDED | Fee refunded under the conditions | Refund in Stripe or by bank transfer; record it | — |

Rules that must not be broken:

- Never request payment before the scope is approved in writing.
- Never send a payment receipt or “payment received” message until payment is verified.
- Never describe a meeting as booked until Proton Calendar's confirmation arrives.
- Keep to one defined problem; anything more is quoted separately.
- Final technical findings are prepared or reviewed by the responsible KEVOS® professional.

## 4. Payment setup (Stripe), when the owner is ready

Nothing below is active. Do not invent or publish a payment URL.

1. In Stripe (Australia, AUD), create a product **KEVOS Engineering Problem Assessment**, one-time price **A$195.00**.
2. Set tax behaviour to match the business's actual GST registration (see §7). If GST-registered, decide whether A$195 includes GST and configure Stripe Tax or the price accordingly.
3. Create a **Payment Link** for that price. Do not put it on the website. Send it per customer in template 4, adding `?client_reference_id=KEVOS-A-YYYY-NNN` so the payment matches the register.
4. Optional automatic verification: in Stripe → Developers → Webhooks, add the endpoint `https://kevos.com/api/assessment/stripe-webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy its signing secret and store it as a Worker secret:
   `npx wrangler secret put STRIPE_WEBHOOK_SECRET`
   The Worker verifies the `Stripe-Signature` (HMAC-SHA256, five-minute tolerance) and, for a paid A$195 AUD session, emails a “payment verified” notice to KEVOS® through the Worker mail provider (§5). Without Worker mail it only logs the event. It never contacts the customer; Stripe sends the receipt.
5. A browser redirect to a success page is never proof of payment. Confirm in the Stripe dashboard or via the webhook.

## 5. Email delivery

- Today: the assessment form and REACHOS both post to **Web3Forms**, which emails the configured inbox. Verify delivery after any change by sending a test enquiry and checking the inbox.
- To move to server-side delivery through the Worker (enables `/api/assessment` validation and rate limiting):
  1. Set Worker secrets: `MAIL_PROVIDER=resend`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (a verified sender on kevos.com).
  2. Optionally bind a KV namespace as `CONTACT_RATE_LIMIT` in `wrangler.toml`.
  3. Set the build variable `PUBLIC_CONTACT_PROVIDER=worker` in Workers Builds and redeploy. Remove `https://api.web3forms.com` from the CSP only if nothing else uses it.
- Customer emails (templates) are sent manually from the business mailbox.

## 6. Booking (Proton Calendar)

- The site's general booking page (`SITE.booking.url`) stays for REACHOS discussions. It is not used for paid assessments.
- Create a dedicated Proton Calendar booking page: **Engineering Problem Assessment**, 30 minutes, video meeting. Keep its link private and send it only in template 6 after payment is verified.
- Proton Calendar and payment are **not** integrated. Proton's confirmation email is what makes a booking real; until then the status stays BOOKING PENDING.

## 7. Owner approvals required before relying on the service

1. **GST.** Registration was not verified. The site uses the standing wording “GST applies where applicable. The exact amount payable is confirmed in writing before you pay.” Decide whether A$195 is GST-inclusive. Under Australian Consumer Law, prices shown to consumers must include any GST. Then update `gstNote` in `src/config/assessment.ts`.
2. **Commercial conditions** in `CONDITIONS` (rescheduling with one business day's notice; full refund if cancelled before the meeting, or if KEVOS® finds after payment that the problem cannot be assessed). They are deliberately customer-friendly defaults. Confirm or change them.
3. **Terms and Privacy updates** (`/terms/#assessment`, “Paying for an assessment” in `/privacy/`): owner or legal review recommended.
4. **Report delivery timeframe:** the site says the date is confirmed with the scope. Set a standard if wanted.
5. **Who signs reports:** the PDF has a professional-review block. Decide who the responsible KEVOS® professional is for each report (the website does not name individuals).
6. **Stripe account, tax settings and the dedicated booking page** (§4, §6).

## 8. Producing a report

1. Copy the sample data (`SAMPLE_REPORT` in `src/config/assessment.ts`) into a JSON file **outside the repository**, or in `assessment-private/`.
2. Fill in: `reference, customer, date, problem, supplied[], observations[], factors[], options[{title,text}] (max 3), nextStep, verification[], assumptions[], followOn, preparedBy, reviewedBy, reviewedOn`. Do not set `sample`.
3. Run `npm run assessment:report -- assessment-private/KEVOS-A-2026-001.json assessment-private/KEVOS-A-2026-001.pdf`.
4. Check that it fits on one page, review and sign it, then send it with template 8.

## 9. Regenerating public assets

`npm run assessment:assets` regenerates the QR code (verified by decoding), brochure, QR card, social image, banner and sample report. It needs Python with `segno` and `opencv-python`, and Microsoft Edge or Google Chrome (set `CHROME_PATH` or `EDGE_PATH` if not in the default location).
