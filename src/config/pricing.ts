// The BIZOMAT ERP subscription price, one source for every page that names it (/pricing/, the Systems pages).
//
// Read from Stripe's live mode on 15 Nov 2026 (read-only): the owner's product prod_VdED2AiKMDhIgM "BIZOMAT Business
// Subscription", default price price_1UbyE5Rs74vQph6MdBU51OeG: AUD 10.00 per unit, monthly, licensed, per unit,
// active, lookup key bizomat_user_monthly_aud. A Stripe price's amount never changes, so a new amount is a new price id:
// tests/pricing.test.ts keeps this id equal to WORK_STRIPE_PRICE_SEAT_MONTHLY in fly.website.toml, which the work app
// charges, and the billing page shows the amount Stripe returns for that id.
//
// GST (owner, 15 Nov 2026): exclusive. The price is before GST; Stripe Tax adds GST where it applies and shows it on
// the billing page and each invoice. Stripe Tax holds an active Australian registration with "exclusive" as its
// default (read 15 Nov 2026), production sets WORK_STRIPE_AUTOMATIC_TAX = "on", and the price itself is set to
// exclusive in Stripe. The work app refuses to sell a live price whose tax behaviour is not set
// (apps/work/src/worker/billing/stripe.ts, checkPrice), so the page and Stripe cannot disagree at checkout.
//
// Subscriptions open only when the founder opens them in the console (Billing, "Who may start a subscription"), after
// the live keys, webhook and GST are in place: until then `open` stays false and the pages say nothing is charged.

export type GstTreatment = 'unconfirmed' | 'exclusive' | 'inclusive';

export const ERP_PRICE = {
  stripePriceId: 'price_1UbyE5Rs74vQph6MdBU51OeG',
  /** Australian cents per active user per month. */
  unitAmount: 1000,
  currency: 'AUD',
  interval: 'month',
  gst: 'exclusive' as GstTreatment,
  open: false,
} as const;

/** "A$10.00" */
export const PRICE_PER_USER = `A$${(ERP_PRICE.unitAmount / 100).toFixed(2)}`;

/** "A$10.00 per active user per month" */
export const PRICE_LINE = `${PRICE_PER_USER} per active user per month`;

/** "A$11.00": the price with Australia's 10% GST added. */
export const PRICE_WITH_AU_GST = `A$${((ERP_PRICE.unitAmount * 11) / 1000).toFixed(2)}`;

/** One sentence on GST that claims only what is recorded. */
export const GST_LINE: Record<GstTreatment, string> = {
  unconfirmed: 'How GST applies to this price is being confirmed. It will be shown here and on the billing page before anyone can subscribe.',
  exclusive: `The price excludes GST. GST is added where it applies, calculated by Stripe and shown on the billing page before you pay and on each invoice. For a customer in Australia, GST is 10%: ${PRICE_WITH_AU_GST} per user per month including GST.`,
  inclusive: 'The price includes GST where it applies.',
};

/** The price line with its GST treatment: "A$10.00 per active user per month, plus GST". */
export const PRICE_LINE_GST =
  ERP_PRICE.gst === 'exclusive' ? `${PRICE_LINE}, plus GST` : ERP_PRICE.gst === 'inclusive' ? `${PRICE_LINE}, including GST` : PRICE_LINE;

/** A worked example for a number of users: "5 × A$10.00 = A$50.00 a month, plus GST". */
export function example(users: number): string {
  const line = `${users} × ${PRICE_PER_USER} = A$${((ERP_PRICE.unitAmount * users) / 100).toFixed(2)} a month`;
  return ERP_PRICE.gst === 'exclusive' ? `${line}, plus GST` : line;
}
