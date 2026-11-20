import type { Workflow } from '../types.ts';

// Make to order: a sales order line made through a linked manufacturing order (Supply Chain and Manufacturing), its
// finished goods allocated, shipped and invoiced as a draft in Finance, with job profitability on the order. Labels from
// apps/work/src/client/system/erp/SupplyChain.tsx and Manufacturing.tsx; rules from apps/work/src/worker/erp/sales.ts,
// production.ts, logistics.ts and access.ts.
const workflow: Workflow = {
  id: 'make-to-order',
  title: 'Make to order',
  status: 'live',
  summary:
    'A product made for one customer’s order: a confirmed sales order line is made to order through a linked manufacturing order, the finished goods are allocated to the line, shipped and invoiced as a draft in Finance, and the manufacturing order shows the job’s profitability.',
  stages: [
    { guide: 'supply-chain', label: 'Sales order', detail: 'A sales manager makes and confirms the order for a customer of the company’s CRM and Finance, with the line to be made.' },
    { guide: 'manufacturing', label: 'Manufacturing order', detail: 'A production manager makes a manufacturing order from the line, linked both ways, then releases and runs it.' },
    { guide: 'inventory', label: 'Finished goods', detail: 'The finished goods are received into stock at the order’s actual cost.' },
    { guide: 'supply-chain', label: 'Allocate and ship', detail: 'The finished goods are allocated to the line, picked, packed, dispatched and delivered.' },
    { guide: 'finance', label: 'Draft invoice', detail: 'One draft invoice per shipment is made in Finance through Finance itself, then approved there.' },
  ],
  tutorial: {
    id: 'make-to-order-walkthrough',
    title: 'Make and deliver a product for a customer’s order',
    outcome: 'The customer’s product is made, delivered and invoiced as a draft in Finance, and its manufacturing order compares the line’s revenue with the actual cost.',
    needs: 'A sales manager makes, confirms and invoices the sales order; a production manager makes and runs the manufacturing order; warehouse staff receive, pick, pack and dispatch. The product needs a released bill of materials and a released routing.',
    steps: [
      {
        title: 'Make the sales order',
        body: 'In Supply Chain, Sales orders, choose New sales order. Choose the customer (a company of your CRM with the Finance customer it is billed as), add the product with its quantity and price, and set the line’s Fulfil to Make to order. Choose Save and confirm, or Save as a draft to finish later.',
        where: 'New sales order',
      },
      {
        title: 'Confirm the order',
        body: 'A draft order is confirmed with Confirm on its page. A line can be made to order only once the order is confirmed.',
        where: 'Confirm',
      },
      {
        title: 'Choose Make to order on the line',
        body: 'A production manager chooses Make to order on the line. A draft manufacturing order opens for the quantity still to make, due on the line’s promised date, with the sales order as its reference. The order shows Made for, and the line shows its order.',
        where: 'Make to order',
      },
      {
        title: 'Release and run the manufacturing order',
        body: 'Choose Release, then Issue materials, and record the work on the Shop floor: Start, Good output and Complete for each operation.',
        where: 'Release',
      },
      {
        title: 'Receive the finished goods',
        body: 'Choose Receive finished goods. They enter stock at the order’s actual cost. Then Complete the order and, when nothing more is to be recorded, Close and finalise costs.',
        where: 'Receive finished goods',
      },
      {
        title: 'Allocate them to the line',
        body: 'Back on the sales order, choose Allocate stock. The finished goods are reserved for the line like any stock.',
        where: 'Allocate stock',
      },
      {
        title: 'Ship them',
        body: 'Choose Plan a shipment. In Pick and dispatch, the warehouse chooses Picked as listed, adds the packages, chooses Packed, types the tracking number and chooses Dispatch. Stock leaves once. Confirm the delivery records who received it, with a photo, document or signature.',
        where: 'Plan a shipment',
      },
      {
        title: 'Make the draft invoice',
        body: 'On the dispatched shipment, a sales manager whose Finance role may create invoices chooses Make the draft invoice in Finance. It is made once per shipment, and is approved and sent in Finance and Accounting.',
        where: 'Make the draft invoice in Finance',
      },
      {
        title: 'Read the job profitability',
        body: 'On the manufacturing order, the Costs section shows the job profitability: the sales order line’s value before tax for the quantity made, against the order’s actual cost by element. Freight is not included.',
        where: 'Costs',
      },
    ],
    after: 'The job profitability report on the Reports page lists every order made to order with its revenue, cost and margin.',
  },
  faqs: [
    {
      q: 'Why is Make to order missing on the line?',
      a: 'Only a production manager or ERP administrator sees it, only on a confirmed order, and only while part of the line is not yet allocated, shipped or being made. The product also needs a released bill of materials and routing.',
    },
    {
      q: 'Are the finished goods allocated to the customer automatically?',
      a: 'No. Once they are received into stock, choose Allocate stock on the sales order; they are reserved for the line like any other stock.',
    },
    {
      q: 'Does MRP count the sales order too?',
      a: 'Yes. Confirmed sales orders are demand in MRP: what is ordered less what is shipped and allocated. Do not add the same demand to the master production schedule (see /learn/manufacturing/).',
    },
    {
      q: 'Is the cost of the product or the stock sold posted to Finance’s ledger?',
      a: 'No. Production value and the value of stock sold are recorded as planned postings; nothing is posted. The invoice reaches Finance as a draft through Finance’s own code.',
    },
  ],
  keywords: ['MTO', 'make-to-order', 'build to order', 'job order', 'customer order', 'job profitability', 'job costing', 'sales order to production'],
  sources: [
    'apps/work/src/client/system/erp/SupplyChain.tsx',
    'apps/work/src/client/system/erp/Manufacturing.tsx',
    'apps/work/src/worker/erp/sales.ts',
    'apps/work/src/worker/erp/production.ts',
    'apps/work/src/worker/erp/logistics.ts',
    'apps/work/src/worker/erp/access.ts',
    'docs/erp/release-5-supply-chain.md',
    'docs/erp/release-3.md',
  ],
  updated: '2026-11-20',
};

export default workflow;
