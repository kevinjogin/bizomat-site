import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: "deal-to-invoice",
  title: "Deal to invoice",
  status: "connected",
  summary:
    "A deal in Sales and CRM starts a draft quote in Finance for the deal's company, and once won becomes a draft invoice. Finance's own approval posts the invoice, and the deal shows the quote's and the invoice's status.",
  stages: [
    {
      guide: "crm",
      label: "Deal",
      detail: "An open deal with a company and a value, in the same currency as the company's Finance workspace.",
    },
    {
      guide: "finance",
      label: "Quote (optional)",
      detail: "Start a quote makes a draft quote in Finance for the deal's company, with one line for the deal's value. It is priced in detail, sent and accepted in Finance; each step shows on the deal's timeline without amounts.",
    },
    {
      guide: "crm",
      label: "Deal won",
      detail: "The deal is marked Won in the CRM.",
    },
    {
      guide: "finance",
      label: "Draft invoice",
      detail: "Make a draft invoice puts one line with the deal's title and value on a draft invoice to the deal's company, once per deal. Nothing is posted yet.",
    },
    {
      guide: "finance",
      label: "Approved invoice",
      detail: "Someone who may approve invoices in Finance checks the amount, GST and account and approves it, which posts it to the ledger. The deal's panel shows its number, status and total.",
    },
  ],
  tutorial: {
    id: "deal-to-invoice-walkthrough",
    title: "Quote and invoice a won deal",
    outcome: "The won deal has a quote and an approved invoice in Finance, linked to it, for the same customer record.",
    needs:
      "A registered company that runs both Sales and CRM and Finance. A Finance role that may create sales records to start the quote and invoice (Owner, Administrator, Accountant, Finance Manager or Contributor by default). If the workspace requires approval for invoices (off by default), approving needs the approve right. Marking the deal won needs a CRM role that can edit it.",
    steps: [
      {
        title: "Open the deal",
        body: "In Sales and CRM, open Deals and the deal. Check it has a Company (the quote and invoice are made out to it) and the right Value.",
        where: "Deals",
      },
      {
        title: "Find the Across panel",
        body: "In the side panel of the deal, the section headed Across and your company's name shows a Finance section. It appears only in a registered company that runs Finance.",
        where: "Across",
      },
      {
        title: "Start a quote",
        body: "Choose Start a quote. A draft quote opens in Finance, made out to the deal's company (created as one Finance customer the first time) with one line for the deal's value.",
        where: "Start a quote",
      },
      {
        title: "Price and send it in Finance",
        body: "Change the line into the real items, quantities and prices, then send it with Get a link, Email or Mark as sent. The quote says it was made for a deal in the CRM.",
        where: "Get a link",
      },
      {
        title: "Record the customer's answer",
        body: "The customer accepts or declines from the link, or you choose Record acceptance in Finance. The deal lists the quote with its status, and its timeline records each step.",
        where: "Record acceptance",
      },
      {
        title: "Mark the deal won",
        body: "Back in the CRM, choose Won on the deal.",
        where: "Won",
      },
      {
        title: "Choose one way to invoice",
        body: "Either invoice the accepted quote in Finance with Create invoice (all of it, or a percentage for progress invoices), or choose Make a draft invoice on the deal for one line with the deal's title and value. Use one way only: BIZOMAT does not stop both, and the customer would be invoiced twice.",
        where: "Make a draft invoice",
      },
      {
        title: "Check and approve in Finance",
        body: "Open the draft invoice. Check the amount, the GST code and the income account, then choose Approve (or Save and approve (post to the ledger) while editing). If your workspace requires approval for invoices and you may not approve, choose Submit for approval instead.",
        where: "Approve",
      },
      {
        title: "Send the invoice",
        body: "Use Get a link, Email, or PDF and Mark as sent. The deal's Across panel now shows the invoice's number, status and total.",
        where: "Mark as sent",
      },
    ],
    after: "Record the payment when it arrives (see the Invoice to payment workflow). The company's In Finance panel in the CRM shows its open invoices and the amount owed.",
  },
  faqs: [
    {
      q: "Why don't I see Start a quote or Make a draft invoice?",
      a: "The Across panel appears only when the CRM organisation belongs to a registered company that also runs Finance. Start a quote needs a Finance role that may create sales records and a deal that is not lost; Make a draft invoice also needs the deal to be won and appears once per deal. If you have no access to Finance, the panel says so. (see /learn/companies/)",
    },
    {
      q: "It says the deal is in another currency. What now?",
      a: "Quotes and invoices from a deal need the deal and the Finance workspace to use the same currency. Make the quote or invoice in Finance directly instead.",
    },
    {
      q: "It says to give the deal a company first. Why?",
      a: "A quote or invoice is made out to a customer. Edit the deal, choose its Company, and try again; the company becomes one Finance customer the first time.",
    },
    {
      q: "Is the invoice posted when I make it from the deal?",
      a: "No. It is a draft, with a note to check the amount, GST and account. Only Finance's own approval posts it to the ledger.",
    },
    {
      q: "Can a won deal also become a sales order for stock?",
      a: "Sales orders, shipments and their invoices are in Supply Chain in the ERP, for the same customer record. Today a deal offers no button to make one; create the sales order in Supply Chain. (see /learn/supply-chain/)",
    },
  ],
  keywords: ["quote to invoice", "order to cash", "billing a deal", "won deal", "sales invoice", "estimate", "proposal", "CRM to Finance"],
  sources: [
    "apps/work/src/worker/company/links.ts",
    "apps/work/src/client/crm/CompanyLinks.tsx",
    "apps/work/src/client/crm/RecordPage.tsx",
    "apps/work/src/client/fin/Sales.tsx",
    "apps/work/src/client/fin/sales-ui.tsx",
    "apps/work/src/client/fin/Docs.tsx",
    "apps/work/src/worker/fin/sales.ts",
    "apps/work/src/worker/erp/sales.ts",
    "apps/work/src/client/system/erp/SupplyChain.tsx",
    "docs/finance/README.md",
    "docs/company/README.md",
  ],
  updated: "2026-11-20",
};

export default workflow;
