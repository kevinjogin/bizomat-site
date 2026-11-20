// Sales order to delivery (ERP Release 5 part A): the customer's order in Supply Chain, stock from Inventory or a
// manufacturing order, the shipment, the delivery and the draft invoice made through Finance's own code.
import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: 'sales-order-to-delivery',
  title: 'Sales order to delivery',
  status: 'connected',
  summary:
    'A customer\'s order becomes a delivered shipment and a draft invoice in Finance. The order is made for a customer of your CRM, its stock is allocated or made to order, then it is picked, packed, dispatched, delivered and invoiced once per shipment.',
  stages: [
    { guide: 'crm', label: 'The customer', detail: 'The customer is a company of your CRM, linked to the Finance customer it is billed as. The order keeps the link; nothing is copied.' },
    { guide: 'supply-chain', label: 'Sales order', detail: 'A sales manager makes and confirms the order: products, prices and tax codes as Finance prices them, dates and the delivery address. Confirmed orders are demand in MRP.' },
    { guide: 'inventory', label: 'Allocation', detail: 'Stock is reserved for each line through Inventory, soonest expiry first, then the oldest, never from quarantine.' },
    { guide: 'manufacturing', label: 'Make to order, when needed', detail: 'A production manager makes a manufacturing order for a line, linked both ways. Its finished goods are allocated to the line once received, and the order shows its job profitability.' },
    { guide: 'supply-chain', label: 'Shipment', detail: 'The shipment is planned with its carrier and freight, then picked, packed and dispatched from a phone. Stock leaves once, never below what is there.' },
    { guide: 'supply-chain', label: 'Delivery', detail: 'The delivery is confirmed with who received it, and a photo, document or signature.' },
    { guide: 'finance', label: 'Draft invoice', detail: 'One draft invoice per shipment is made through Finance\'s own code, with the freight charge as a line. It is checked and approved in Finance.' },
  ],
  tutorial: {
    id: 'sales-order-to-delivery-walkthrough',
    title: 'From the customer\'s order to the draft invoice',
    outcome: 'The order is delivered and a draft invoice for each shipment waits in Finance.',
    needs: 'A sales manager, warehouse staff, a production manager for lines made to order, and a Finance role that may create invoices for the person who asks for the invoice.',
    steps: [
      { title: 'Check the customer', body: 'In a registered company, the customer\'s CRM company should be linked to its Finance customer (In Finance, on the company in Sales and CRM). In your own or example company, you choose Billed as in Finance on the order instead. Without a Finance customer the order can be made, but not invoiced.' },
      { title: 'Make the order', body: 'In Supply Chain, Sales orders, choose New sales order. Choose the Customer, add the lines with their Product, Quantity, Unit price, Tax code and Fulfil (From stock or Make to order), and choose Save and confirm.', where: 'Save and confirm' },
      { title: 'Allocate the stock', body: 'On the order, choose Allocate stock. The Short column shows what could not be reserved.', where: 'Allocate stock' },
      { title: 'Make what is short, if needed', body: 'A production manager chooses Make to order on a line. When the manufacturing order\'s finished goods are received, choose Allocate stock again.', where: 'Make to order' },
      { title: 'Plan the shipment', body: 'Choose Plan a shipment: carrier, service, ship date, delivery window, freight cost and charge, and whether to email the customer on dispatch. Choose Plan the shipment.', where: 'Plan a shipment' },
      { title: 'Pick and pack', body: 'On a phone, open Pick and dispatch and the shipment. Choose Picked as listed, add each package with Add the package, then choose Packed.', where: 'Picked as listed' },
      { title: 'Dispatch', body: 'Type the Tracking number and choose Dispatch. The stock leaves the warehouse once.', where: 'Dispatch' },
      { title: 'Confirm the delivery', body: 'Add a photo, a document or the receiver\'s signature, type Received by, and choose Confirm the delivery.', where: 'Confirm the delivery' },
      { title: 'Make the draft invoice', body: 'A sales manager with a Finance role that may create invoices chooses Make the draft invoice in Finance, then Open it to check and approve it in Finance.', where: 'Make the draft invoice in Finance' },
    ],
    after: 'If goods come back, record a return on the order: a sales manager authorises it, the warehouse receives it, and a draft credit note is made in Finance once.',
  },
  faqs: [
    { q: 'Is the value of the stock sold posted to my ledger?', a: 'No. Each dispatch records its Finance posting as planned; nothing is posted. Only the draft invoice reaches Finance, and approving it is Finance\'s own step (see /learn/finance/).' },
    { q: 'Can the same shipment be invoiced twice?', a: 'No. Each shipment has one draft invoice, made once even if the button is pressed twice or by two people. If the last try failed, the reason is shown and you can try again.' },
    { q: 'What if only part of the order can ship?', a: 'Plan a shipment for what is allocated. The rest stays open on the order and in the Open orders report; allocate it when stock arrives and plan another shipment.' },
    { q: 'Does BIZOMAT book the carrier?', a: 'No. Book with the carrier yourself and type the tracking number on the shipment. The tracking link comes from the carrier\'s tracking page address.' },
    { q: 'Can I start the order from a won deal?', a: 'Not from a screen yet. Make the order in Supply Chain and choose the deal\'s company as the customer (see /learn/supply-chain/).' },
  ],
  keywords: ['order to cash', 'order to delivery', 'O2C', 'sales order', 'fulfilment', 'fulfillment', 'shipping', 'dispatch', 'despatch', 'delivery', 'proof of delivery', 'invoice', 'make to order'],
  sources: [
    'docs/erp/release-5-supply-chain.md',
    'apps/work/src/client/system/erp/SupplyChain.tsx',
    'apps/work/src/worker/erp/sales.ts',
    'apps/work/src/worker/erp/logistics.ts',
    'apps/work/src/worker/erp/returns.ts',
    'apps/work/src/worker/erp/access.ts',
  ],
  updated: '2026-11-20',
};

export default workflow;
