import type { Workflow } from '../types.ts';

// Procure to pay: ERP Procurement (requisition, quotations, purchase order, goods receipt), Inventory (stock in),
// Quality (inspection where flagged) and Finance (the draft bill, approved and its payment recorded). Labels from
// apps/work/src/client/system/erp/Purchasing.tsx, Suppliers.tsx and apps/work/src/client/fin/Docs.tsx.
const workflow: Workflow = {
  id: 'procure-to-pay',
  title: 'Procure to pay',
  status: 'connected',
  summary:
    'From a need to a paid supplier: a requisition is approved, suppliers quote, a purchase order is approved and sent, the goods are received into stock, and one draft bill is made in Finance and Accounting, where it is approved and its payment recorded.',
  stages: [
    { guide: 'procurement', label: 'Requisition', detail: 'Someone asks for goods; a procurement manager who did not raise the requisition approves it.' },
    { guide: 'procurement', label: 'Quotations', detail: 'A buyer asks approved suppliers for prices, records their quotations, compares them and selects one with a reason; a procurement manager approves the choice.' },
    { guide: 'procurement', label: 'Purchase order', detail: 'Approved at once within the company’s limit, else by a procurement manager; the PDF is sent from your own email and recorded as sent.' },
    { guide: 'inventory', label: 'Goods receipt', detail: 'The warehouse receives all or part of the order; accepted goods enter stock with their lots, serial numbers and expiry dates.' },
    { guide: 'quality', label: 'Inspection, where flagged', detail: 'Products marked for inspection on receipt are inspected; a failed lot can go into quarantine.' },
    { guide: 'finance', label: 'Bill and payment', detail: 'One draft bill per receipt is made in Finance, approved there, and the payment you made through your bank is recorded against it.' },
  ],
  tutorial: {
    id: 'procure-to-pay-walkthrough',
    title: 'Buy goods and pay the supplier',
    outcome: 'The goods are in stock, the supplier’s bill is approved in Finance, and the payment is recorded.',
    needs: 'Several roles take part: anyone with an ERP role but viewer or executive raises the requisition; a buyer orders; a procurement manager approves; a warehouse manager or operator receives; a Finance role that may create and approve bills finishes it.',
    steps: [
      {
        title: 'Make sure the supplier is approved and linked',
        body: 'In Procurement, Suppliers, the supplier must be Approved by a procurement manager who did not create it, and linked to its Finance supplier in the Finance section, or the draft bill cannot be made later.',
        where: 'Create it in Finance and link',
      },
      {
        title: 'Raise the requisition',
        body: 'On Requisitions choose New requisition, add the lines and reason, and choose Submit for approval. A procurement manager who did not raise it chooses Approve.',
        where: 'New requisition',
      },
      {
        title: 'Ask for quotations',
        body: 'On the approved requisition choose Request quotations, tick the suppliers and choose Create. Download each supplier’s PDF, send it from your own email and choose Record as sent. Skip this step with Make a purchase order from it when you already know the supplier.',
        where: 'Request quotations',
      },
      {
        title: 'Compare and choose',
        body: 'Choose Record quotation for each answer. The comparison marks the Cheapest and Fastest. Choose Select a supplier and say why; a procurement manager who did not select it chooses Approve the choice.',
        where: 'Select a supplier',
      },
      {
        title: 'Make and approve the purchase order',
        body: 'Choose Make the purchase order, check the lines, choose Save draft, then Submit. Within the approval limit it is approved at once; above it a procurement manager chooses Approve.',
        where: 'Make the purchase order',
      },
      {
        title: 'Send the order',
        body: 'Choose Download, send the PDF from your own email, and choose Record as sent.',
        where: 'Record as sent',
      },
      {
        title: 'Receive the goods',
        body: 'When the delivery arrives, a warehouse manager or operator chooses Receive goods on the order (or Receive on the warehouse screen), records what was received, damaged or rejected, the location, lots, serial numbers and expiry, and chooses Receive. Accepted goods are in stock at once.',
        where: 'Receive goods',
      },
      {
        title: 'Inspect where the receipt asks',
        body: 'A receipt line of a product that needs inspection shows Inspect. A quality inspector chooses Start inspection and records it in Quality.',
        where: 'Start inspection',
      },
      {
        title: 'Make the draft bill',
        body: 'On the receipt, a buyer or procurement manager whose Finance role may create bills chooses Make a draft bill in Finance. It is made once, from what was accepted at the order’s prices. Choose Open the draft bill.',
        where: 'Make a draft bill in Finance',
      },
      {
        title: 'Approve the bill and record the payment',
        body: 'In Finance and Accounting, Bills, check the bill against the supplier’s invoice and choose Approve. Pay the supplier through your bank, then choose Record a payment on the bill. BIZOMAT does not make the payment.',
        where: 'Record a payment',
      },
    ],
    after: 'The receipt counts toward the supplier’s performance (on time, in full, lead time), and the supplier spend and purchase commitments reports include it.',
  },
  faqs: [
    {
      q: 'Can I skip quotations?',
      a: 'Yes. On an approved requisition, Make a purchase order from it drafts an order for the supplier you choose at the requisition’s estimates. You can also start a purchase order directly on the Purchase orders tab.',
    },
    {
      q: 'Why can I not make the draft bill?',
      a: 'The receipt’s Finance section gives the reason: no Finance business workspace, the supplier not linked to its Finance supplier, no access to the company’s Finance, a Finance role that cannot create bills, or an ERP role other than buyer, procurement manager or ERP administrator (see /learn/procurement/).',
    },
    {
      q: 'Does BIZOMAT pay the supplier or email the order?',
      a: 'No to both. Pay through your bank and record the payment in Finance. Download the purchase order PDF and send it from your own email, then record it as sent.',
    },
    {
      q: 'Is the value of the goods posted to Finance’s ledger when they arrive?',
      a: 'No. The receipt values the stock in the ERP and records the Finance posting it would need as planned; nothing is posted. The bill reaches Finance’s ledger when it is approved in Finance.',
    },
    {
      q: 'Is the bill matched against the supplier’s invoice automatically?',
      a: 'No. The receipt and its draft bill are linked, and the person approving the bill checks it against the supplier’s invoice. Three-way matching is planned.',
    },
  ],
  keywords: ['P2P', 'purchase to pay', 'procure-to-pay', 'buying process', 'purchase order to bill', 'accounts payable', 'supplier invoice', 'goods received', 'requisition to payment'],
  sources: [
    'apps/work/src/client/system/erp/Purchasing.tsx',
    'apps/work/src/client/system/erp/Suppliers.tsx',
    'apps/work/src/client/system/erp/WarehouseScreen.tsx',
    'apps/work/src/client/fin/Docs.tsx',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/procurement.ts',
    'apps/work/src/worker/erp/purchasing.ts',
    'docs/erp/release-2.md',
    'docs/finance/README.md',
    'src/data/erp-capabilities.ts',
  ],
  updated: '2026-11-20',
};

export default workflow;
