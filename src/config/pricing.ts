// The BIZOMAT ERP subscription price, one source for every page that names it (/pricing/, the Systems pages).
//
// Read from Stripe's live mode on 15 Nov 2026 (read-only): the owner's product prod_VdED2AiKMDhIgM "BIZOMAT Business
// Subscription", default price price_1UbyE5Rs74vQph6MdBU51OeG: AUD 10.00 per unit, monthly, licensed, per unit,
// active, lookup key bizomat_user_monthly_aud. A Stripe price's amount never changes, so a new amount is a new price id:
// tests/pricing.test.ts keeps this id equal to WORK_STRIPE_PRICE_SEAT_MONTHLY in fly.website.toml, which the work app
// charges, and the billing page shows the amount Stripe returns for that id.
//
// GST: the price's tax behaviour in Stripe is not set (neither inclusive nor exclusive), and BIZOMAT's GST registration
// is not recorded, so no page says GST is included or added. The work app refuses to sell a live price until its tax
// behaviour is set (apps/work/src/worker/billing/stripe.ts, checkPrice). When the owner sets it, change `gst` here.
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
  gst: 'unconfirmed' as GstTreatment,
  open: false,
} as const;

/** "A$10.00" */
export const PRICE_PER_USER = `A$${(ERP_PRICE.unitAmount / 100).toFixed(2)}`;

/** "A$10.00 per active user per month" */
export const PRICE_LINE = `${PRICE_PER_USER} per active user per month`;

/** One sentence on GST that claims only what is recorded. */
export const GST_LINE: Record<GstTreatment, string> = {
  unconfirmed: 'How GST applies to this price is being confirmed. It will be shown here and on the billing page before anyone can subscribe.',
  exclusive: 'The price excludes GST. GST is added where it applies, and shown on the billing page and on each invoice.',
  inclusive: 'The price includes GST where it applies.',
};

/** A worked example for a number of users: "5 × A$10.00 = A$50.00 a month". */
export function example(users: number): string {
  return `${users} × ${PRICE_PER_USER} = A$${((ERP_PRICE.unitAmount * users) / 100).toFixed(2)} a month`;
}
