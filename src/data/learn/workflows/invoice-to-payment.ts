import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: "invoice-to-payment",
  title: "Invoice to payment",
  status: "live",
  summary:
    "An approved invoice records what the customer owes. You send it by secure link, email or PDF, record the payment when the money arrives in your bank, match it to the bank statement line, and follow anything unpaid in Aged receivables. BIZOMAT records payments; it never collects them.",
  stages: [
    {
      guide: "finance",
      label: "Invoice approved",
      detail: "A draft invoice (made in Finance, from an accepted quote, a won deal or a shipment) is checked and approved, which posts it to the ledger as money owed to you.",
    },
    {
      guide: "finance",
      label: "Invoice sent",
      detail: "The customer gets a secure online link, an email carrying that link, or the PDF you send yourself (then Mark as sent). Opening the link never marks it paid.",
    },
    {
      guide: "finance",
      label: "Payment recorded",
      detail: "When the money is in your bank, Record a payment notes the date, the account it went into and the amount. Part payments leave the invoice Part paid.",
    },
    {
      guide: "finance",
      label: "Bank statement matched",
      detail: "The imported statement line is matched to the recorded payment, and the account is reconciled against the statement's closing balance.",
    },
    {
      guide: "crm",
      label: "Customer view in the CRM",
      detail: "Connected: in a registered company, the CRM company's In Finance panel shows its open invoices and the amount still owed, to people whose Finance role can see sales.",
    },
  ],
  tutorial: {
    id: "invoice-to-payment-walkthrough",
    title: "Get an invoice paid and reconciled",
    outcome: "The invoice is approved, sent, marked Paid, and its payment is matched to the bank statement.",
    needs:
      "A business workspace and a role that can create sales records. If the workspace requires approval for invoices (off by default), approving and recording payments need the approve right for sales. Matching statement lines and reconciling need the approve right for banking (Owner, Administrator, Accountant and Finance Manager by default).",
    steps: [
      {
        title: "Open the invoice",
        body: "In Finance and Accounting, open Invoices and the draft, or choose New invoice. Check the customer, the Due date, each line's account and GST, and the total.",
        where: "Invoices",
      },
      {
        title: "Approve it",
        body: "Choose Approve on the saved draft (or Save and approve (post to the ledger) while editing). The invoice shows Approved and counts in Aged receivables.",
        where: "Approve",
      },
      {
        title: "Send it",
        body: "Choose Get a link to copy a secure link, or Email to send that link when BIZOMAT's email is set up. Or choose PDF, send it yourself, and choose Mark as sent.",
        where: "Get a link",
      },
      {
        title: "Wait for the money",
        body: "Past its due date the invoice shows Overdue, appears on the dashboard and in Aged receivables, and the people who look after sales are reminded.",
        where: "Overdue",
      },
      {
        title: "Record the payment",
        body: "When the money is in your bank, choose Record a payment. Enter the Date received, the account it was Received into, the Amount and a Reference, and choose Record payment. More than the amount due is refused.",
        where: "Record payment",
      },
      {
        title: "Import the statement",
        body: "Open Bank accounts, the account's Statement and reconcile, and Import a statement with the file you downloaded from your bank.",
        where: "Import a statement",
      },
      {
        title: "Match the line",
        body: "On Statement lines, the customer's payment shows the recorded payment with the same amount and a nearby date. Choose Match.",
        where: "Match",
      },
      {
        title: "Reconcile",
        body: "On the Reconcile tab, enter the Statement date and the Closing balance on the statement and choose Record the reconciliation.",
        where: "Record the reconciliation",
      },
    ],
    after: "If the customer was overcharged, choose Credit note on the invoice, approve it, and use Apply to an invoice or Record a refund on the credit note.",
  },
  faqs: [
    {
      q: "Can my customer pay the invoice online through BIZOMAT?",
      a: "No. The online link lets the customer read and download the invoice; it never takes a payment and never marks the invoice paid. Add how to pay to your document template (Settings, Document templates).",
    },
    {
      q: "The customer paid only part. What do I do?",
      a: "Record a payment for the amount received. The invoice shows Part paid and the rest stays in Aged receivables. Record another payment when the rest arrives.",
    },
    {
      q: "I recorded a payment by mistake. How do I undo it?",
      a: "Void the payment from the invoice's payments list. The payment's entry is reversed and the invoice is owed again. An invoice with payments cannot itself be voided until its payments are voided.",
    },
    {
      q: "Why can't I record a payment?",
      a: "The invoice must be approved, not a draft or awaiting approval. If your workspace requires approval for invoices, recording payments also needs the approve right for sales. Nothing can be dated on or before the workspace's lock date. (see /learn/roles-and-permissions/)",
    },
    {
      q: "Where can I see everything customers owe?",
      a: "Reports, Aged receivables lists what each customer owes by age, and the dashboard shows the total owed to you. In the CRM, a linked company's In Finance panel shows its open invoices. (see /learn/finance/)",
    },
  ],
  keywords: ["accounts receivable", "debtors", "getting paid", "payment received", "receipt", "overdue invoice", "aged receivables", "bank reconciliation", "cash application"],
  sources: [
    "apps/work/src/client/fin/Docs.tsx",
    "apps/work/src/client/fin/sales-ui.tsx",
    "apps/work/src/client/fin/Sales.tsx",
    "apps/work/src/client/fin/Banking.tsx",
    "apps/work/src/client/fin/ui.tsx",
    "apps/work/src/worker/fin/routes-banking.ts",
    "apps/work/src/worker/company/links.ts",
    "apps/work/src/client/crm/CompanyLinks.tsx",
    "docs/finance/README.md",
  ],
  updated: "2026-11-20",
};

export default workflow;
